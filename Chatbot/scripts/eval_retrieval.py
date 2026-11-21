"""Retrieval check + threshold calibration. Re-run after changing the PDF,
chunking or embedding model:

    python -m scripts.eval_retrieval

Prints, for every test question, the best similarity score and the heading
of the top chunk, then suggests RELEVANCE_THRESHOLD as the midpoint of the
gap between in-scope and out-of-scope questions.
"""

import asyncio
import logging

from app.config import get_settings
from app.rag.embeddings import Embedder
from app.rag.retriever import Retriever
from app.rag.router import route
from app.rag.vectorstores import LocalVectorStore

# (question, text that must reach the prompt for a correct answer)
IN_SCOPE = [
    ("Tell me about yourself", "Tell Me About Yourself"),
    ("Where is Aman currently working?", "Cupshup"),
    ("What did he do at Raventra Solar?", "Raventra"),
    ("What was his work at Difmo?", "Difmo"),
    ("Explain the architecture of BlogPilot", "BlogPilot"),
    ("How does the YouTube Assistant RAG pipeline work?", "YouTube"),
    ("What chunk size did he use in the YouTube assistant?", "YouTube"),
    ("Which vector database has he used?", "Pinecone"),
    ("What is his CGPA?", "8.59"),
    ("What programming languages does he know?", "Java"),
    ("Has he worked with LangGraph?", "LangGraph"),
    ("What are his career goals?", "Career"),
    ("Why should we hire Aman?", "Hire"),
    ("Does he have leadership experience?", "Vice Chair"),
    ("What is his GitHub profile?", "github.com/AmanDwivedi2324"),
    ("How did he get into AI?", "software development"),
    ("Is he familiar with Kafka?", "Kafka"),
    ("What is the admission predictor R2 score?", "0.89"),
    ("What did he use for email outreach automation?", "InboxKit"),
    ("What is his strongest area?", "Strongest"),
]

OUT_OF_SCOPE = [
    "What is the capital of France?",
    "Write me a poem about the sea",
    "How do I bake a chocolate cake?",
    "Who won the cricket world cup in 2011?",
    "What's the weather in Delhi today?",
    "Explain quantum entanglement",
    "What is Aman's salary expectation?",
    "Is Aman married?",
    "What's the best stock to buy right now?",
    "Translate hello into Spanish",
    "Solve 2x + 5 = 15",
    "Recommend a good movie",
]


async def main() -> None:
    logging.disable(logging.WARNING)
    settings = get_settings().model_copy(update={"relevance_threshold": -1.0})
    store = LocalVectorStore(settings.local_index_dir)
    retriever = Retriever(Embedder(settings.embedding_model, str(settings.embedding_cache_dir)),
                          store, settings, corpus=store.chunks)

    gate = Retriever(retriever.embedder, store, get_settings(), corpus=store.chunks)

    async def best(question: str, expected: str = ""):
        rt = route(question)
        r = await retriever.retrieve(rt)
        top = r.matches[0].chunk.heading if r.matches else "-"
        in_context = any(expected.lower() in m.chunk.text.lower() for m in r.matches)
        passes = r.best_score >= gate.threshold_for(rt)
        return r.best_score, top, in_context, passes

    print("IN SCOPE")
    in_scores, misses = [], 0
    for question, expected in IN_SCOPE:
        score, top, ok, passes = await best(question, expected)
        misses += not (ok and passes)
        in_scores.append(score)
        mark = "✓" if ok and passes else ("✗ gated" if not passes else "✗ missing")
        print(f"  {mark:<9} {score:.3f}  {question:<52} → {top[:55]}")

    print("OUT OF SCOPE")
    out_scores, refused = [], 0
    for question in OUT_OF_SCOPE:
        score, top, _, passes = await best(question)
        out_scores.append(score)
        refused += not passes
        print(f"  {'gate' if not passes else 'LLM ':<9} {score:.3f}  {question:<52}")

    lo_in, hi_out = min(in_scores), max(out_scores)
    print()
    print(f"in-scope answered from context: {len(IN_SCOPE) - misses}/{len(IN_SCOPE)}"
          f" | off-topic stopped by the fast gate: {refused}/{len(OUT_OF_SCOPE)} (the rest: LLM grounding rule)")
    print(f"lowest in-scope score {lo_in:.3f} | highest off-topic score {hi_out:.3f}")


if __name__ == "__main__":
    asyncio.run(main())
