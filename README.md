# Aman Dwivedi — Portfolio

One repository, three services:

| Folder | What it is | Stack | Local URL |
| --- | --- | --- | --- |
| [`Frontend/`](Frontend) | The public site (agent-swarm UI) + the CRM admin at `/admin` | React 19, Vite, Tailwind 4 | http://localhost:5173 |
| [`Backend/`](Backend/README.md) | CRM API: content, auth, uploads, contact inbox | Node, Express 5, MongoDB | http://localhost:5000 |
| [`Chatbot/`](Chatbot/README.md) | "Ask my agent" RAG assistant | Python, FastAPI, Pinecone, Groq | http://localhost:8000 |

## Run everything locally

Each service has its own `.env` (copy its `.env.example`; real keys only ever go in `.env`, which git ignores).

```powershell
# 1. CRM API
cd Backend;  npm install;  npm run dev

# 2. Chatbot (first time: python -m venv .venv; .venv\Scripts\activate; pip install -r requirements-dev.txt)
cd Chatbot;  .venv\Scripts\activate;  uvicorn app.main:app --reload --port 8000

# 3. Site
cd Frontend; npm install;  npm run dev
```

The Vite dev server proxies `/api` to the CRM; the chat widget calls `VITE_CHAT_API_URL` (see `Frontend/.env.development`).

## Updating the chatbot's knowledge base

1. Edit your knowledge-base document and export it as PDF. Keep the same style: numbered
   sections ("4. Professional Experience"), numbered sub-sections ("4.1 Cupshup") and bold sub-headings.
2. Replace `Chatbot/data/knowledge_base.pdf` with it (same file name).
3. With the chatbot running, run in `Chatbot/`:
   ```powershell
   python -m app.ingest
   ```
   It re-chunks and re-embeds the PDF, replaces the vectors in Pinecone, waits until they're searchable
   and tells the running chatbot to reload — no restart. (Without `ADMIN_TOKEN`/`CHATBOT_RELOAD_URL`
   set, just restart the chatbot instead.)
4. Optional checks: `python -m scripts.smoke_chat` (live answers + timings) and
   `python -m scripts.eval_retrieval` (retrieval quality and the off-topic threshold).

New company or project? Add its name to `ENTITIES` in `Chatbot/app/rag/catalog.py` so questions
about it get the precise metadata filter.

## Deploying (outline)

| Service | Host | Root directory | Build | Start |
| --- | --- | --- | --- | --- |
| Frontend | Vercel | `Frontend` | `npm run build` | — (static) |
| Backend | Render web service | `Backend` | `npm install` | `npm start` |
| Chatbot | Render web service | `Chatbot` | `pip install -r requirements.txt && python -m app.ingest --store local` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Environment variables for each are listed in its `.env.example`. Put the Chatbot in a US-East region
(next to the free Pinecone index) for the fastest startup.

## History

This repo was created on 22 Nov 2026 from the separate `Portfolio-Frontend` and `Portfolio-Backend`
repositories; their commits are imported under `Frontend/` and `Backend/`. Files that held secrets
(`.env`, a migration script with the database URL) and the accidentally committed `node_modules`
were removed from the imported history. The original `.git` folders are kept in `../Portfolio-git-backup/`.
