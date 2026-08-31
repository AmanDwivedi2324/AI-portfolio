import os
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from .embeddings import get_embeddings

def get_vector_store():
    pc = Pinecone(
        api_key = os.getenv("PINECONE_API_KEY")
    )

    index = pc.Index(
        os.getenv("PINECONE_INDEX_NAME")
    )

    return PineconeVectorStore(
        index = index,
        embedding = get_embeddings(),
    )