"""Builds the service graph (embedder → index → retriever → chat) and
reloads the index on demand after a knowledge-base update."""

import logging

from fastapi import FastAPI

from .api.rate_limit import RateLimiter
from .config import Settings
from .llm.groq_client import GroqLLM
from .rag.embeddings import Embedder
from .rag.models import Chunk
from .rag.retriever import Retriever
from .rag.vectorstores import LocalVectorStore, VectorStore
from .services.chat_service import ChatService

log = logging.getLogger("app")


def load_index(settings: Settings, embedder: Embedder) -> tuple[VectorStore, list[Chunk], str, VectorStore | None]:
    """Return (store to query, chunks for keyword search, label, fallback store)."""
    local = LocalVectorStore(settings.local_index_dir)

    if settings.resolved_vector_store != "pinecone":
        return local, local.chunks, "local", None

    from .rag.vectorstores.pinecone_store import PineconeVectorStore

    pine = PineconeVectorStore(
        settings.pinecone_api_key, settings.pinecone_index, settings.pinecone_namespace,
        settings.embedding_dim, settings.pinecone_cloud, settings.pinecone_region,
    )

    if settings.pinecone_query_mode == "memory":
        try:
            chunks, vectors = pine.fetch_all()
            if not chunks:
                raise RuntimeError("the Pinecone namespace is empty — run `python -m app.ingest`")
            local.replace(chunks, vectors)  # also refreshes the on-disk copy used if Pinecone is down
            return local, local.chunks, "pinecone (served from memory)", None
        except Exception as exc:
            log.warning("Could not load the index from Pinecone (%s) — using the local copy.", exc)
            return local, local.chunks, "local (Pinecone unavailable)", None

    # Remote mode: open the connection now so the first visitor doesn't pay for it.
    try:
        pine.query(embedder.embed_query("warm up"), 1)
    except Exception as exc:
        log.warning("Pinecone warm-up failed: %s", exc)
    return pine, local.chunks, "pinecone (remote)", local if local.count() else None


def build_services(app: FastAPI, settings: Settings, llm=None) -> None:
    embedder = Embedder(settings.embedding_model, str(settings.embedding_cache_dir))
    embedder.warm_up()

    store, corpus, label, fallback = load_index(settings, embedder)
    if not corpus:
        log.warning("The index is empty — run `python -m app.ingest`.")

    if llm is None and settings.llm_configured:
        llm = GroqLLM(settings)
    if llm is None:
        log.warning("GROQ_API_KEY is not set — only small talk and refusals will work.")

    app.state.settings = settings
    app.state.embedder = embedder
    app.state.chat = ChatService(Retriever(embedder, store, settings, corpus=corpus, fallback=fallback), llm, settings)
    app.state.rate_limiter = RateLimiter(settings.rate_limit_requests, settings.rate_limit_window_seconds)
    app.state.store_name = label
    app.state.chunk_count = len(corpus)
    log.info("Ready: store=%s chunks=%d llm=%s", label, len(corpus), getattr(llm, "model", None))


def reload_index(app: FastAPI) -> dict:
    """Re-read the index (after `python -m app.ingest`) without restarting."""
    settings: Settings = app.state.settings
    store, corpus, label, fallback = load_index(settings, app.state.embedder)
    chat: ChatService = app.state.chat
    chat.retriever = Retriever(app.state.embedder, store, settings, corpus=corpus, fallback=fallback)
    chat.cache.clear()  # cached answers may be out of date
    app.state.store_name, app.state.chunk_count = label, len(corpus)
    log.info("Index reloaded: store=%s chunks=%d", label, len(corpus))
    return {"status": "reloaded", "vector_store": label, "chunks": len(corpus)}
