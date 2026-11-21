from ...config import Settings
from .base import VectorStore
from .local_store import LocalVectorStore


def create_vector_store(settings: Settings) -> VectorStore:
    """The configured store (Pinecone or local)."""
    if settings.resolved_vector_store == "pinecone":
        from .pinecone_store import PineconeVectorStore

        return PineconeVectorStore(
            api_key=settings.pinecone_api_key,
            index_name=settings.pinecone_index,
            namespace=settings.pinecone_namespace,
            dimension=settings.embedding_dim,
            cloud=settings.pinecone_cloud,
            region=settings.pinecone_region,
        )
    return LocalVectorStore(settings.local_index_dir)


__all__ = ["VectorStore", "LocalVectorStore", "create_vector_store"]
