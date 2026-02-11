import chromadb
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv
import uuid

load_dotenv()

# Use PersistentClient so data survives restarts
llm = ChatOpenAI(model="gpt-4o", temperature=0.3)
embeddings = OpenAIEmbeddings()

def answer_question(user_id, thread_id, question):
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection("pdf_embeddings")
    query_embedding = embeddings.embed_query(question)

    # Search for relevant chunks
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=15,
        # Ensure this key exists in the metadata of your embedded chunks
        where={"thread_id": thread_id} 
    )

    # Results["documents"] is a list of lists. We want the first list.
    documents = results.get("documents", [[]])[0]

    if not documents:
        return "No relevant context found in this PDF."

    context = "\n\n".join(documents)

    prompt = f"""
    

    Context:
    {context}

    Question:
    {question}
    """

    response = llm.invoke(prompt)
    return response.content


