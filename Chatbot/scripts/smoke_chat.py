"""Live end-to-end check with the real vector store and Groq LLM.

    python -m scripts.smoke_chat
    python -m scripts.smoke_chat "Your own question here"

Prints each answer with timings. Run it after updating the knowledge base.
"""

import asyncio
import logging
import sys
import time

from fastapi import FastAPI

from app.config import get_settings
from app.main import build_services

DEFAULT_QUESTIONS = [
    "Tell me about yourself",
    "What did Aman build with LangGraph?",
    "What is his CGPA?",
    "Where is he working now and what does he do there?",
    "Is Aman married?",
    "What is the capital of France?",
]


async def main(questions: list[str]) -> None:
    logging.disable(logging.INFO)
    app = FastAPI()
    build_services(app, get_settings())
    chat = app.state.chat
    print(f"store={app.state.store_name} llm={getattr(chat.llm, 'model', None)}\n")

    for question in questions:
        started = time.perf_counter()
        result = await chat.answer(question, [])
        wall = round((time.perf_counter() - started) * 1000)
        t = result.get("timings", {})
        tag = "REFUSED" if result.get("refused") else "ANSWER"
        print(f"Q: {question}")
        print(f"{tag} ({wall} ms total, retrieval {t.get('retrieval_ms', '-')} ms, first token {t.get('first_token_ms', '-')} ms)")
        print(result["answer"])
        if result.get("sources"):
            print("sources:", ", ".join(s["title"] for s in result["sources"]))
        print("-" * 80)


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:] or DEFAULT_QUESTIONS))
