import chromadb

def delete_thread_embeddings(thread_id: str):
    try:
        # Connect to the persistent database
        client = chromadb.PersistentClient(path="./chroma_db")
        collection = client.get_collection("pdf_embeddings")

        # Delete all documents where the thread_id matches
        collection.delete(
            where={"thread_id": thread_id}
        )
       
        return True
    except Exception as e:
        
        return False
    




# def inspect_collection(collection_name):
#     # Connect to your project's persistent directory
#     client = chromadb.PersistentClient(path="./chroma_db")
    
#     try:
#         collection = client.get_collection(collection_name)
        
#         # Get all data stored in the collection
#         data = collection.get()
        
#         print(f"--- Collection: {collection_name} ---")
#         print(f"Total Vectors: {len(data['ids'])}")
        
#         # Loop through the first 5 items to see what's inside
#         for i in range(min(5, len(data['ids']))):
#             print(f"\nID: {data['ids'][i]}")
#             print(f"Metadata: {data['metadatas'][i]}")
#             print(f"Document Preview: {data['documents'][i][:100]}...")
            
#     except Exception as e:
#         print(f"Error: {e}")


