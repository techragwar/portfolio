import io
import re
import uuid

from pypdf import PdfReader
from pypdf.errors import PdfReadError

from .config import CHUNK_OVERLAP, CHUNK_SIZE


class IngestError(Exception):
    pass


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    clean = re.sub(r"\s+", " ", text).strip()
    if not clean:
        return []
    out, start = [], 0
    while start < len(clean):
        end = min(start + size, len(clean))
        out.append(clean[start:end])
        if end >= len(clean):
            break
        start = end - overlap
    return out


def extract_pdf(data: bytes) -> tuple[int, list[tuple[int, str]]]:
    """Return (page_count, [(page_number, chunk_text), ...])."""
    try:
        reader = PdfReader(io.BytesIO(data))
        if reader.is_encrypted:
            raise IngestError("This PDF is password-protected. Remove the password and upload it again.")
        pages = len(reader.pages)
        chunks: list[tuple[int, str]] = []
        for number, page in enumerate(reader.pages, start=1):
            for piece in chunk_text(page.extract_text() or ""):
                chunks.append((number, piece))
    except IngestError:
        raise
    except (PdfReadError, ValueError, KeyError) as exc:
        raise IngestError("Could not read this file as a PDF.") from exc

    if not chunks:
        raise IngestError(
            "No text found in this PDF. It may be a scan; run OCR on it first and upload the result."
        )
    return pages, chunks


def new_doc_id() -> str:
    return "doc_" + uuid.uuid4().hex[:12]
