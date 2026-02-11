from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import  HumanMessage
from summaryagent import chatbot
import uuid
import shutil
from fastapi import FastAPI, UploadFile, File, Form,HTTPException, BackgroundTasks
from db import get_connection
from rag.embedding_creation.embed import embed_pdf
from rag.agent.answeragent import answer_question
from rag.delete_embedding.deletethreadembed import delete_thread_embeddings


app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
     allow_origins=["http://localhost:5173"], 
     allow_credentials=True, 
     allow_methods=["*"],
     allow_headers=["*"],
)

class SummaryInput(BaseModel):
    url:str
    

@app.post('/get-summary')
async def get_summary(url:str):
    try:
        
        result = chatbot.invoke({"messages": [HumanMessage(content=url)]},)
        
        # Return the last message content (AI's response)
        return {"content": result['messages'][-1].content}
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Agent Error")
    

class ThreadRequest(BaseModel):
    user_id:int

@app.post('/get-threads')
async def get_threads(data:ThreadRequest):
    try:
        conn=get_connection()
        cur=conn.cursor()
        cur.execute("SELECT thread_id FROM threads WHERE user_id=%s",(data.user_id,))
        rows=cur.fetchall()
        all_threads = [
            
               row[0] for row in rows
            ]
    
        cur.close()
        conn.close()
    
        return {"all_threads": all_threads}
    except Exception as e:
        return {"Error":e}

class CreateThread(BaseModel):
    user_id:int
    thread_id:str

@app.post("/create-thread")
async def create_thread(data:CreateThread):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO threads (thread_id, user_id) VALUES (%s, %s)",
            (data.thread_id, data.user_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {
            "message":"Thread created successfully" 
        }

    except Exception as e:
        return {"error": str(e)}
    

class DeleteThreads(BaseModel):
    user_id:int
    thread_id:str

@app.delete('/delete-thread')
def delete(data:DeleteThreads):  
    try:
        conn=get_connection()
        cur=conn.cursor()

        cur.execute('delete from threads where thread_id=(%s) and user_id=(%s)',(data.thread_id,data.user_id))  
        cur.execute('delete from pdf_documents where thread_id=(%s) and user_id=(%s)',(data.thread_id,data.user_id))
        cur.execute('delete from pdf_messages where thread_id=(%s)',(data.thread_id,))

        delete_thread_embeddings(data.thread_id)

        conn.commit()
        
        return {"message":"Deletion successful"}

    except Exception as e:
        return {"message":f"Deletion failed,{e}"}  
    finally:
        cur.close()
        conn.close()
         



@app.post('/upload-pdf')
def upload_pdf( user_id: int =Form(...),thread_id:str=Form(...),file: UploadFile = File(...)):
    conn = get_connection()
    cur = conn.cursor()

    try:
        # 2. Create directory and Save file FIRST
        import os
        os.makedirs("temp", exist_ok=True)
        file_path = f"temp/{thread_id}.pdf"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 3. Database Insert
        cur.execute(
            "INSERT INTO pdf_documents (thread_id, filename, status, user_id) VALUES (%s, %s, %s, %s)",
            (thread_id, file.filename, "processing", user_id)
        )
        conn.commit()

        # 4. Now process the file using the file_path we just created
        embed_pdf(file_path, user_id, thread_id)

        # 5. Update status
        cur.execute(
            "UPDATE pdf_documents SET status='completed' WHERE thread_id=%s",
            (thread_id,)
        )
        conn.commit()
        
        return {"message": "Upload successful", "thread_id": thread_id}

    except Exception as e:
        cur.execute('delete from pdf_documents where thread_id=(%s)',(thread_id,))
        conn.commit()
        print(f"Error: {e}")
        return {"Error":"error"}
    finally:
        cur.close()
        conn.close()

# class UploadFailed(BaseModel):
#     thread_id:str

# @app.delete('/upload-failed')    
# def uploadfailure(data:UploadFailed):
#     try:
#         conn=get_connection()
#         cur=conn.cursor()


#         cur.execute('delete from pdf_documents where thread_id=(%s)',(data.thread_id,))
#         conn.commit()
#     except:
#         return {"message":"Failed"}
#     finally:
#         cur.close()
#         conn.close()


from pydantic import BaseModel

class ThreadDetailsRequest(BaseModel):
    thread_id: str

@app.post('/get-thread-details')
def loadpdfdoc(data: ThreadDetailsRequest):
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        
        cur.execute('SELECT * FROM pdf_documents WHERE thread_id = %s', (data.thread_id,))
        rows = cur.fetchall() 
        
        details_list = []
        for row in rows:
            details_list.append({
                "thread_id": row[0],
                "filename": row[1],
                "status": row[2],
                "created_at": str(row[3]),
                "user_id": row[4]
            })
        
        return {"details": details_list}
    except Exception as e:
        return {"error": str(e)}
    finally:
        cur.close()
        conn.close()


class Questions(BaseModel):
    user_id:int
    thread_id:str
    question:str

@app.post("/ask")
async def ask_question(data:Questions):

    conn = get_connection()
    cur = conn.cursor()

    # Check thread exists
    cur.execute(
        "SELECT status FROM pdf_documents WHERE thread_id=%s",
        (data.thread_id,)
    )
    result = cur.fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Thread not found")

    if result[0] != "completed":
        return {"message": "PDF is still being indexed. Please wait."}

    # RAG call
    answer = answer_question(data.user_id, data.thread_id, data.question)

    # Store messages
    cur.execute(
        "INSERT INTO pdf_messages (id, thread_id, role, content) VALUES (%s,%s,%s,%s)",
        (str(uuid.uuid4()), data.thread_id, "user", data.question)
    )

    cur.execute(
        "INSERT INTO pdf_messages (id, thread_id, role, content) VALUES (%s,%s,%s,%s)",
        (str(uuid.uuid4()), data.thread_id, "assistant", answer)
    )

    conn.commit()
    conn.close()

    return {"answer": answer}

class GetUserMessages(BaseModel):
    thread_id:str

@app.post('/get-thread-messages')
def getmessages(data:GetUserMessages):
    try:
        conn=get_connection()
        curr=conn.cursor()
        curr.execute('select content,role from pdf_messages where thread_id=(%s)',(data.thread_id,))

        rows=curr.fetchall()

        messages=[]
       
        for row in rows:
            messages.append({
                "content": row[0],
                "role": row[1],
            })
        return {"messages":messages}

    except Exception as e:
        return {"Error:": e}
    finally:
        curr.close()
        conn.close()






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)












# class ChatInput(BaseModel):
#     message: str
#     thread_id: str

# @app.post("/chat")
# async def chat(data: ChatInput):
#     try:
#         # Configuration links the user to their specific DB history
#         config = {"configurable": {"thread_id": data.thread_id}}
        
#         # Run the agent
#         # We pass the message; LangGraph pulls history from Postgres automatically
#         result = chatbot.invoke(
#             {"messages": [HumanMessage(content=data.message)]}, 
#             config=config
#         )
        
#         # Return the last message content (AI's response)
#         return {"content": result['messages'][-1].content}
    
#     except Exception as e:
#         print(f"Error: {e}")
#         raise HTTPException(status_code=500, detail="Internal Agent Error")
    
# @app.get("/history/{thread_id}")
# async def get_history(thread_id: str):
#     try:
#         config = {"configurable": {"thread_id": thread_id}}
#         state = chatbot.get_state(config)
        
        
#         # If no history exists yet, return empty list instead of erroring
#         if not state or not state.values or "messages" not in state.values:
#             return {"messages": []}

#         history = []
#         for msg in state.values["messages"]:
#             # Standardizing the role for your React frontend
#             if isinstance(msg, HumanMessage):
#                 role = "user"
#             elif isinstance(msg, (AIMessage, SystemMessage)):
#                 role = "agent"
#             else:
#                 role = "agent" # Default fallback
                
#             history.append({"role": role, "content": msg.content})
            
#         return {"messages": history}
#     except Exception as e:
#         print(f"Detailed History Error: {str(e)}")
#         # Return empty list so the frontend doesn't crash on 500 error
#         return {"messages": []}
    