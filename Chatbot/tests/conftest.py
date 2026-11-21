import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

from app.config import BASE_DIR, Settings  # noqa: E402
from app.main import build_services, create_app  # noqa: E402
from app.rag.chunker import build_chunks  # noqa: E402
from app.rag.loader import load_blocks  # noqa: E402
from app.rag.prompts import REFUSAL  # noqa: E402


class FakeLLM:
    """Stands in for Groq: records prompts and streams a fixed answer."""

    model = "fake-llm"

    def __init__(self, answer: str = "Aman built BlogPilot with LangGraph."):
        self.answer = answer
        self.calls: list[list[dict]] = []

    async def stream(self, messages):
        self.calls.append(messages)
        for word in self.answer.split(" "):
            yield word + " "


@pytest.fixture(scope="session")
def settings() -> Settings:
    return Settings(
        _env_file=None,
        env="test",
        vector_store="local",
        groq_api_key="",
        rate_limit_requests=1000,
        local_index_dir=BASE_DIR / "storage" / "index",
        admin_token="test-admin-token",
    )


@pytest.fixture(scope="session")
def chunks():
    return build_chunks(load_blocks(BASE_DIR / "data" / "knowledge_base.pdf"))


@pytest.fixture()
def fake_llm() -> FakeLLM:
    return FakeLLM()


@pytest.fixture()
def client(settings, fake_llm):
    app = create_app()
    build_services(app, settings, llm=fake_llm)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def refusing_client(settings):
    app = create_app()
    build_services(app, settings, llm=FakeLLM(REFUSAL))
    with TestClient(app) as test_client:
        yield test_client
