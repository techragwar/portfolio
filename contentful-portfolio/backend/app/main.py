from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import chat, db
from .config import CORS_ORIGINS, MAX_UPLOAD_MB, TOP_K_CHAT, TOP_K_SEARCH
from .ingest import IngestError, extract_pdf, new_doc_id
from .retrieval import Hit, index


@asynccontextmanager
async def lifespan(_: FastAPI):
    db.init_db()
    yield


app = FastAPI(title="Stacks", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type"],
)


# ---------- schemas ----------
class DocumentOut(BaseModel):
    id: str
    name: str
    pages: int


class SourceOut(BaseModel):
    doc_id: str
    doc_name: str
    page: int
    text: str
    score: float


class QueryIn(BaseModel):
    query: str = Field(min_length=1, max_length=2000)


class SearchOut(BaseModel):
    results: list[SourceOut]


class ChatOut(BaseModel):
    answer: str
    sources: list[SourceOut]


def _source(h: Hit) -> SourceOut:
    return SourceOut(doc_id=h.doc_id, doc_name=h.doc_name, page=h.page, text=h.text, score=h.score)


# ---------- routes ----------
@app.get("/api/health")
def health():
    return {"status": "ok", "chat_enabled": bool(chat.ANTHROPIC_API_KEY)}


@app.get("/api/documents", response_model=list[DocumentOut])
def list_documents():
    rows = db.query("SELECT id, name, pages FROM documents ORDER BY created_at, rowid")
    return [DocumentOut(**dict(r)) for r in rows]


@app.post("/api/documents", response_model=DocumentOut, status_code=201)
async def upload_document(file: UploadFile = File(...)):
    name = file.filename or "untitled.pdf"
    if not name.lower().endswith(".pdf"):
        raise HTTPException(415, "Only PDF files are supported.")

    data = await file.read(MAX_UPLOAD_MB * 1024 * 1024 + 1)
    if len(data) > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"File is larger than {MAX_UPLOAD_MB} MB.")
    if not data.startswith(b"%PDF"):
        raise HTTPException(415, "This file does not look like a PDF.")

    try:
        pages, chunks = await run_in_threadpool(extract_pdf, data)
    except IngestError as exc:
        raise HTTPException(422, str(exc)) from exc

    doc_id = new_doc_id()
    with db.tx() as conn:
        conn.execute("INSERT INTO documents (id, name, pages) VALUES (?, ?, ?)", (doc_id, name, pages))
        conn.executemany(
            "INSERT INTO chunks (doc_id, page, text) VALUES (?, ?, ?)",
            [(doc_id, page, text) for page, text in chunks],
        )
    index.invalidate()
    return DocumentOut(id=doc_id, name=name, pages=pages)


@app.delete("/api/documents/{doc_id}", status_code=204)
def delete_document(doc_id: str):
    with db.tx() as conn:
        cur = conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        if cur.rowcount == 0:
            raise HTTPException(404, "Document not found.")
    index.invalidate()


@app.post("/api/search", response_model=SearchOut)
async def search(body: QueryIn):
    hits = await run_in_threadpool(index.search, body.query, TOP_K_SEARCH)
    return SearchOut(results=[_source(h) for h in hits])


@app.post("/api/chat", response_model=ChatOut)
async def chat_endpoint(body: QueryIn):
    hits = await run_in_threadpool(index.search, body.query, TOP_K_CHAT)
    if not hits:
        return ChatOut(
            answer="I could not find anything in your documents that relates to that question.",
            sources=[],
        )
    try:
        text = await chat.answer(body.query, hits)
    except chat.ChatUnavailable as exc:
        raise HTTPException(503, str(exc)) from exc
    return ChatOut(answer=text, sources=[_source(h) for h in hits])
