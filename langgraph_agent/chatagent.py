import os
import psycopg
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

# --- 1. SETUP GRAPH LOGIC ---
llm = ChatOpenAI(model="gpt-4o") # Or your preferred model

class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

def chat_node(state: ChatState):
    # The 'add_messages' annotation handles the history merge automatically
    response = llm.invoke(state['messages'])
    return {"messages": [response]}

# Define the workflow
workflow = StateGraph(ChatState)
workflow.add_node("chat_node", chat_node)
workflow.add_edge(START, "chat_node")
workflow.add_edge("chat_node", END)

# --- 2. SETUP POSTGRES & SERVER ---
DB_URI = "postgresql://postgres:2003@localhost:5432/aiagent"

# Persistent connection for LangGraph Checkpointing
# We use a context manager or startup event in production
conn = psycopg.connect(DB_URI, autocommit=True)
checkpointer = PostgresSaver(conn)
checkpointer.setup() # Creates internal tables if they don't exist

# Compile the graph with the checkpointer
chatbot = workflow.compile(checkpointer=checkpointer)


