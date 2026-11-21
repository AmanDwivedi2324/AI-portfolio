# Portfolio chatbot (RAG)

"Ask my agent" for the portfolio site. A FastAPI service that answers
recruiter and technical questions **only** from Aman's knowledge base
(`data/knowledge_base.pdf`), and says so when it doesn't know.

## Run it locally

```bash
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
copy .env.example .env            # then add GROQ_API_KEY (and PINECONE_API_KEY if you use Pinecone)
python -m app.ingest              # parse → chunk → embed → index
uvicorn app.main:app --reload --port 8000
```

The frontend reads `VITE_CHAT_API_URL` (see `Frontend/.env.development`).

| Command | What it does |
| --- | --- |
| `python -m app.ingest` | Rebuild the index from the PDF (run after every PDF change). `--store local` / `--dry-run` |
| `python -m scripts.eval_retrieval` | 20 in-scope + 12 off-topic questions: checks the answer reaches the prompt and re-calibrates `RELEVANCE_THRESHOLD` |
| `python -m scripts.smoke_chat` | Live answers through your real Pinecone + Groq setup, with timings |
| `pytest` | 36 tests (chunking, routing, retrieval, API with a fake LLM — no keys needed) |

## How a question is answered

```
question ─► cache hit? ──yes──► instant answer
   │ no
   ▼
router (rules, µs): small talk? → canned reply
   │                 metadata filter from entities/categories (e.g. BlogPilot → entities=blogpilot)
   ▼
embed query locally (bge-small, ~10 ms)
   ▼
vector search: filtered + open in parallel ─► + BM25 keyword scores ─► fused ranking
   ▼
relevance gate: best similarity < threshold → refusal (no LLM call)
   ▼
Groq LLM (gpt-oss-120b) with top chunks + last turns, streamed token by token (SSE)
```

**Chunking.** Headings are detected from the PDF's font styles. Chunks follow
the outline (section › subsection › topic), never mix two companies or
projects, carry their heading path in the embedded text, and are packed to
~850 characters (split with one-block overlap when longer). Sections 11–12
(the bot's policy and maintenance notes) are not indexed — section 11 is
turned into the system prompt instead.

**Why it's fast.** Pinecone is the vector database (ingest writes there), but at startup the
service loads all vectors into memory and searches them in-process (`PINECONE_QUERY_MODE=memory`):
~10 ms instead of a ~400 ms round trip from India to the free-tier US-East index. Plus local
embeddings (no embedding API round trip), tiny
top-k context, rule-based routing instead of an extra LLM call, an answer
cache for repeat questions, Groq's fast inference, and streaming so the first
words appear immediately. With ~36 chunks, metadata filters mostly buy
*precision* (smaller, cleaner prompts); the speed gains come from the rest.

**Off-topic questions** are stopped twice: clearly unrelated ones by the
similarity gate (instant, free), and the rest by the grounding rule — the
model must answer only from the retrieved context or reply with the exact
refusal sentence from the knowledge base (§11.6).

## Updating the knowledge base

1. Replace `data/knowledge_base.pdf` (keep numbered sections/sub-sections and bold sub-headings).
2. `python -m app.ingest` — re-chunks, re-embeds, replaces the Pinecone namespace, waits until it is
   searchable, then calls `POST /admin/reload` on the running service (needs `ADMIN_TOKEN` and
   `CHATBOT_RELOAD_URL` in `.env`). The answer cache is cleared on reload. Without those settings,
   restart the service.
3. `python -m scripts.smoke_chat` to see live answers.

Mention a new company/project? Add it to `ENTITIES` in `app/rag/catalog.py` for precise filtering.

## API

- `GET /health`
- `POST /chat` — `{ "question": "...", "history": [{ "role": "user|assistant", "content": "..." }] }` → `{ answer, sources, refused, cached, timings }`
- `POST /admin/reload` — `Authorization: Bearer <ADMIN_TOKEN>`; reloads the index without a restart
- `POST /chat/stream` — same body; Server-Sent Events: `{"type":"token","text":…}` … `{"type":"done","sources":[…],"refused":…,"timings":{…}}` or `{"type":"error","message":…}`

Rate limit: 20 requests / 5 minutes per IP (configurable).

## Deploy (e.g. Render web service)

- Build: `pip install -r requirements.txt && python -m app.ingest --store local` (downloads the embedding model and builds the offline fallback; Pinecone itself is updated from your machine with `python -m app.ingest`)
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Env: `GROQ_API_KEY`, `PINECONE_API_KEY` (optional), `CORS_ORIGINS=https://<your-site>`, `TRUST_PROXY=true`, `ENV=production`
- Frontend (Vercel): `VITE_CHAT_API_URL=https://<chatbot-service>.onrender.com`

The local index is always built as well; if Pinecone is unreachable the
service falls back to it automatically.
