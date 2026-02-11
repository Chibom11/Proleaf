import chromadb
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("pdf_embeddings")

embeddings_model = OpenAIEmbeddings()

def embed_pdf(file_path: str, user_id: int, thread_id: str):
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)

    texts = [chunk.page_content for chunk in chunks]

    vectors = embeddings_model.embed_documents(texts)

    ids = [f"{thread_id}_{i}" for i in range(len(texts))]
    metas = [{"user_id": user_id, "thread_id": thread_id} for _ in texts]

    collection.upsert(
        ids=ids,
        embeddings=vectors,
        documents=texts,
        metadatas=metas
    )

    return True
