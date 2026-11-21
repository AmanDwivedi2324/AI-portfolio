import json

from app.rag.prompts import REFUSAL, SMALL_TALK_REPLIES


def _sse_events(response) -> list[dict]:
    return [json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")]


def test_health(client):
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert body["chunks"] > 0
    assert body["vector_store"] == "local"


def test_small_talk_skips_the_llm(client, fake_llm):
    body = client.post("/chat", json={"question": "hello"}).json()
    assert body["answer"] == SMALL_TALK_REPLIES["greeting"]
    assert fake_llm.calls == []


def test_off_topic_is_refused_without_calling_the_llm(client, fake_llm):
    body = client.post("/chat", json={"question": "What is the capital of France?"}).json()
    assert body["answer"] == REFUSAL
    assert body["refused"] is True
    assert fake_llm.calls == []


def test_grounded_answer_uses_retrieved_context(client, fake_llm):
    body = client.post("/chat", json={"question": "Explain the architecture of BlogPilot"}).json()
    assert body["answer"].startswith("Aman built BlogPilot")
    assert body["refused"] is False
    assert any("BlogPilot" in s["title"] for s in body["sources"])
    prompt = fake_llm.calls[0]
    assert prompt[0]["role"] == "system"
    assert "CONTEXT:" in prompt[-1]["content"] and "LangGraph" in prompt[-1]["content"]


def test_streaming_emits_tokens_then_done(client):
    response = client.post("/chat/stream", json={"question": "What did he build with LangGraph?"})
    assert response.headers["content-type"].startswith("text/event-stream")
    events = _sse_events(response)
    assert events[-1]["type"] == "done"
    text = "".join(e["text"] for e in events if e["type"] == "token")
    assert text.strip() == "Aman built BlogPilot with LangGraph."
    assert "first_token_ms" in events[-1]["timings"]


def test_repeat_questions_come_from_cache(client, fake_llm):
    first = client.post("/chat", json={"question": "What are his career goals?"}).json()
    second = client.post("/chat", json={"question": "what are his career goals"}).json()
    assert second["cached"] is True
    assert second["answer"] == first["answer"]
    assert len(fake_llm.calls) == 1


def test_history_is_passed_to_the_llm(client, fake_llm):
    history = [
        {"role": "user", "content": "Tell me about the YouTube Assistant"},
        {"role": "assistant", "content": "It is a RAG app."},
    ]
    client.post("/chat", json={"question": "Which vector database did it use?", "history": history})
    roles = [m["role"] for m in fake_llm.calls[0]]
    assert roles == ["system", "user", "assistant", "user"]
    assert "Pinecone" in fake_llm.calls[0][-1]["content"]


def test_llm_refusal_has_no_sources(refusing_client):
    body = refusing_client.post("/chat", json={"question": "Is Aman married?"}).json()
    assert body["refused"] is True
    assert body["sources"] == []


def test_validation(client):
    assert client.post("/chat", json={"question": "   "}).status_code == 422
    assert client.post("/chat", json={"question": "x" * 501}).status_code == 422
    assert client.post("/chat", json={"question": "hi", "history": [{"role": "system", "content": "x"}]}).status_code == 422


def test_reload_requires_the_admin_token(client):
    assert client.post("/admin/reload").status_code == 401
    assert client.post("/admin/reload", headers={"Authorization": "Bearer wrong"}).status_code == 401
    body = client.post("/admin/reload", headers={"Authorization": "Bearer test-admin-token"}).json()
    assert body["status"] == "reloaded" and body["chunks"] > 0


def test_reload_clears_cached_answers(client, fake_llm):
    client.post("/chat", json={"question": "What are his career goals?"})
    client.post("/admin/reload", headers={"Authorization": "Bearer test-admin-token"})
    second = client.post("/chat", json={"question": "What are his career goals?"}).json()
    assert second["cached"] is False
    assert len(fake_llm.calls) == 2


def test_rate_limit(client):
    client.app.state.rate_limiter.limit = 2
    codes = [client.post("/chat", json={"question": "hi"}).status_code for _ in range(3)]
    assert codes == [200, 200, 429]
