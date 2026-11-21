"""Build (or rebuild) the vector index from the knowledge-base PDF.

    python -m app.ingest                  # into the configured store (+ local copy)
    python -m app.ingest --store local    # local index only
    python -m app.ingest --dry-run        # parse + chunk, print a report, write nothing

Re-run it whenever the PDF changes. Chunk ids are content hashes and the
namespace is cleared first, so the index always matches the PDF exactly.
"""

import argparse
import json
import logging
import time
import urllib.error
import urllib.request
from pathlib import Path

from .config import get_settings
from .rag.chunker import build_chunks
from .rag.embeddings import Embedder
from .rag.loader import load_blocks
from .rag.vectorstores import LocalVectorStore
from .rag.vectorstores.pinecone_store import PineconeVectorStore


def main() -> None:
    settings = get_settings()
    parser = argparse.ArgumentParser(description="Index the knowledge base")
    parser.add_argument("--pdf", type=Path, default=settings.knowledge_base_path)
    parser.add_argument("--store", choices=["auto", "pinecone", "local"], default=settings.vector_store)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    logging.basicConfig(level=logging.WARNING, format="%(message)s")

    started = time.perf_counter()
    blocks = load_blocks(args.pdf)
    chunks = build_chunks(blocks, settings.chunk_target_chars, settings.chunk_max_chars)
    sizes = [len(c.text) for c in chunks]
    print(f"• {args.pdf.name}: {len(blocks)} blocks → {len(chunks)} chunks "
          f"(chars min {min(sizes)}, avg {sum(sizes) // len(sizes)}, max {max(sizes)})")

    preview = settings.local_index_dir.parent / "chunks.preview.json"
    preview.parent.mkdir(parents=True, exist_ok=True)
    preview.write_text(json.dumps([{"id": c.id, **c.metadata()} for c in chunks], ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"• Chunk preview written to {preview}")
    if args.dry_run:
        return

    embedder = Embedder(settings.embedding_model, str(settings.embedding_cache_dir))
    vectors = embedder.embed_passages([c.text for c in chunks])
    print(f"• Embedded with {settings.embedding_model} → {vectors.shape}")

    # A local copy is always written: it is the fallback if Pinecone is unreachable.
    local = LocalVectorStore(settings.local_index_dir)
    local.reset()
    local.upsert(chunks, vectors)
    print(f"✓ Local index: {local.count()} vectors in {settings.local_index_dir}")

    store = args.store if args.store != "auto" else settings.resolved_vector_store
    if store == "pinecone":
        if not settings.pinecone_api_key:
            raise SystemExit("PINECONE_API_KEY is not set.")
        pine = PineconeVectorStore(
            settings.pinecone_api_key, settings.pinecone_index, settings.pinecone_namespace,
            settings.embedding_dim, settings.pinecone_cloud, settings.pinecone_region,
        )
        pine.ensure_index()
        pine.reset()
        pine.upsert(chunks, vectors)
        print(f"✓ Pinecone: {len(chunks)} vectors upserted to {settings.pinecone_index}/{settings.pinecone_namespace}")
        _wait_until_searchable(pine, len(chunks))

    _notify_running_service(settings)
    print(f"Done in {time.perf_counter() - started:.1f}s")


def _wait_until_searchable(pine: PineconeVectorStore, expected: int, timeout: float = 30) -> None:
    """Pinecone is eventually consistent; wait until every vector is visible."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if pine.count() == expected:
            print("✓ Pinecone index is up to date")
            return
        time.sleep(2)
    print("! Pinecone is still catching up — give it a few seconds before reloading the service.")


def _notify_running_service(settings) -> None:
    """Ask the running chatbot to reload, so the update is live without a restart."""
    if not (settings.chatbot_reload_url and settings.admin_token):
        print("• Restart the chatbot (or set CHATBOT_RELOAD_URL + ADMIN_TOKEN) to serve the new index.")
        return
    request = urllib.request.Request(
        settings.chatbot_reload_url, method="POST", headers={"Authorization": f"Bearer {settings.admin_token}"}
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            print(f"✓ Running chatbot reloaded: {json.loads(response.read())}")
    except (urllib.error.URLError, OSError) as exc:
        print(f"• Chatbot not reloaded ({exc}). Restart it, or check CHATBOT_RELOAD_URL / ADMIN_TOKEN.")


if __name__ == "__main__":
    main()
