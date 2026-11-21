import asyncio

import pytest

from app.rag.embeddings import Embedder
from app.rag.retriever import Retriever
from app.rag.router import route
from app.rag.vectorstores import LocalVectorStore


@pytest.fixture(scope="module")
def retriever(settings):
    store = LocalVectorStore(settings.local_index_dir)
    assert store.count() > 0, "run `python -m app.ingest --store local` first"
    return Retriever(Embedder(settings.embedding_model, str(settings.embedding_cache_dir)), store, settings, corpus=store.chunks)


def _context(retriever, question):
    result = asyncio.run(retriever.retrieve(route(question)))
    return result, "\n".join(m.chunk.text for m in result.matches)


@pytest.mark.parametrize(
    ("question", "expected"),
    [
        ("What is his CGPA?", "8.59"),
        ("Where is Aman currently working?", "Cupshup"),
        ("Is he familiar with Kafka?", "Kafka"),
        ("What chunk size did he use in the YouTube assistant?", "1000 characters"),
        ("Explain the architecture of BlogPilot", "LangGraph"),
        ("What did he use for email outreach automation?", "InboxKit"),
        ("Does he have leadership experience?", "Vice Chair"),
    ],
)
def test_answer_reaches_the_context(retriever, question, expected):
    result, context = _context(retriever, question)
    assert result.matches, f"gated: {question} ({result.best_score:.3f})"
    assert expected.lower() in context.lower()


@pytest.mark.parametrize(
    "question",
    ["What is the capital of France?", "Write me a poem about the sea", "Recommend a good movie"],
)
def test_clearly_off_topic_questions_are_gated(retriever, question):
    result, _ = _context(retriever, question)
    assert result.matches == []


def test_context_stays_small(retriever, settings):
    result, _ = _context(retriever, "Explain the architecture of BlogPilot")
    assert 1 <= len(result.matches) <= settings.top_k
