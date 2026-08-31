import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore

from app.services.embeddings import get_embeddings


KNOWLEDGE_DIR = Path("app/knowledge")


def load_documents():

    documents = []

    for file in KNOWLEDGE_DIR.glob("*.md"):

        text = file.read_text(
            encoding="utf-8"
        )

        documents.append(
            Document(
                page_content=text,
                metadata={
                    "source": file.name,
                },
            )
        )

    return documents


def ingest():

    index_name = os.getenv(
        "PINECONE_INDEX_NAME"
    )

    print("Pinecone index:", index_name)

    if not index_name:
        raise ValueError(
            "PINECONE_INDEX_NAME is missing from .env"
        )

    documents = load_documents()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=120,
    )

    chunks = splitter.split_documents(
        documents
    )

    print(
        f"Loaded {len(documents)} documents"
    )

    print(
        f"Created {len(chunks)} chunks"
    )

    PineconeVectorStore.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        index_name=index_name,
    )

    print(
        "Knowledge successfully indexed."
    )


if __name__ == "__main__":
    ingest()