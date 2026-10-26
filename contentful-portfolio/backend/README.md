# Stacks

Chat and search over your own PDFs. Every answer and search result points back to the document and page it came from.

FastAPI backend, SQLite storage, BM25 retrieval, and Claude for answers. This folder is the API only. The UI is the `Stacks` React component in `../app/components/Stacks.tsx`, mounted at `/stacks` in the Next.js app.

## Run it

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export ANTHROPIC_API_KEY=sk-ant-...      # needed for chat; search works without it
uvicorn app.main:app --reload
```

The API runs at http://localhost:8000 and interactive docs are at http://localhost:8000/docs. Start the Next.js app from the parent folder (`npm run dev`) and open http://localhost:3000/stacks.

The frontend finds the API through `NEXT_PUBLIC_STACKS_API_URL` (default `http://localhost:8000`). If the site runs on another origin, list it in `STACKS_CORS_ORIGINS` here.

## API

| Method | Path | What it does |
|---|---|---|
| GET | `/api/health` | Status, and whether chat is enabled (API key set) |
| GET | `/api/documents` | List uploaded documents |
| POST | `/api/documents` | Upload a PDF (multipart field `file`) |
| DELETE | `/api/documents/{id}` | Remove a document and its chunks |
| POST | `/api/search` | `{"query": "..."}` returns ranked passages with document and page |
| POST | `/api/chat` | `{"query": "..."}` returns a cited answer plus the source passages |

## How it works

1. **Ingest**: `pypdf` extracts text page by page. Each page is split into ~700 character chunks with overlap, and stored in SQLite with its page number.
2. **Retrieve**: BM25 ranking over all chunks, held in memory and rebuilt after any upload or delete (`app/retrieval.py`).
3. **Answer**: the top 5 chunks go to Claude as numbered excerpts. The model is told to answer only from them and cite `[n]`. The response returns the same excerpts so the UI can show the source under each answer.

Scanned PDFs with no text layer are rejected with a clear message; run OCR on them first.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | none | Required for chat |
| `STACKS_MODEL` | `claude-sonnet-5-5` | Model used for answers |
| `STACKS_DB` | `data/stacks.db` | SQLite file location |
| `STACKS_MAX_UPLOAD_MB` | `25` | Upload size limit |
| `STACKS_CHUNK_SIZE` / `STACKS_CHUNK_OVERLAP` | `700` / `120` | Chunking |
| `STACKS_TOP_K_CHAT` / `STACKS_TOP_K_SEARCH` | `5` / `10` | Passages retrieved |
| `STACKS_CORS_ORIGINS` | `http://localhost:3000` | Comma-separated frontend origins allowed to call the API |

Copy `.env.example` as a starting point. The app reads real environment variables and does not load `.env` files itself, so export them in your shell or set them in your host's secrets. Never commit a real API key.

## Tests

```bash
python -m unittest tests.test_core -v     # ingestion + retrieval, no web deps
pip install -r requirements-dev.txt
pytest                                    # adds the HTTP API tests (Claude is stubbed)
```

## Before you put this in front of real users

This site is public, so anyone who can reach the API can upload files and spend your Claude credits.

- **Auth and per-user data.** There are no accounts: every visitor sees every document. Add authentication and a `user_id` on `documents` before deploying anywhere public.
- **Better retrieval.** BM25 matches words, not meaning. Swapping `index.search()` for embeddings plus a vector store (pgvector, Qdrant) is the biggest quality upgrade. The return shape can stay the same.
- **Rate limiting** on `/api/chat`, since each call spends your API credits.
- **Postgres** instead of SQLite once you have more than one server.
