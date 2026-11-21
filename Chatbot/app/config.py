"""Application settings, read from environment variables / .env."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8", extra="ignore")

    env: Literal["development", "production", "test"] = "development"

    # ── LLM (Groq) ──────────────────────────────────────────────
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b"
    # gpt-oss models think before answering; "low" keeps answers fast.
    llm_reasoning_effort: Literal["low", "medium", "high"] = "low"
    llm_temperature: float = 0.2
    llm_max_tokens: int = 900

    # ── Embeddings (local ONNX model, no API call per question) ─
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    embedding_dim: int = 384
    embedding_cache_dir: Path = BASE_DIR / "storage" / "models"

    # ── Vector store ────────────────────────────────────────────
    # "auto" = Pinecone when PINECONE_API_KEY is set, otherwise the local index.
    vector_store: Literal["auto", "pinecone", "local"] = "auto"
    pinecone_api_key: str = ""
    pinecone_index: str = "aman-portfolio-kb"
    pinecone_namespace: str = "kb-v2"
    pinecone_cloud: str = "aws"
    pinecone_region: str = "us-east-1"
    # "memory": load all vectors from Pinecone at startup and search in RAM
    #           (~1 ms; Pinecone stays the source of truth).
    # "remote": query Pinecone on every question (adds one network round trip).
    pinecone_query_mode: Literal["memory", "remote"] = "memory"
    local_index_dir: Path = BASE_DIR / "storage" / "index"

    # ── Knowledge base + chunking ───────────────────────────────
    knowledge_base_path: Path = BASE_DIR / "data" / "knowledge_base.pdf"
    chunk_target_chars: int = 850
    chunk_max_chars: int = 1100

    # ── Retrieval ───────────────────────────────────────────────
    top_k: int = 6
    # Always give the model at least this many relevant chunks (when they pass the gate).
    min_context_chunks: int = 3
    # Below this cosine score the question is treated as out of scope and the
    # bot refuses without calling the LLM. Calibrated with scripts/eval_retrieval.py.
    relevance_threshold: float = 0.48
    # Chunks scoring this far below the best match are left out of the prompt.
    context_score_window: float = 0.15
    filter_boost: float = 0.02

    # ── API ─────────────────────────────────────────────────────
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    rate_limit_requests: int = 20
    rate_limit_window_seconds: int = 300
    trust_proxy: bool = False
    answer_cache_size: int = 256
    answer_cache_ttl_seconds: int = 3600
    max_history_turns: int = 6
    # Protects POST /admin/reload (reload the index after a knowledge-base update).
    # Leave empty to disable the endpoint.
    admin_token: str = ""
    # Where `python -m app.ingest` pings the running service after uploading.
    chatbot_reload_url: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def resolved_vector_store(self) -> Literal["pinecone", "local"]:
        if self.vector_store == "auto":
            return "pinecone" if self.pinecone_api_key else "local"
        return self.vector_store

    @property
    def llm_configured(self) -> bool:
        return bool(self.groq_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()
