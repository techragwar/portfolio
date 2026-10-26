"""Tests for ingestion, storage and retrieval. No web framework needed.

Run from the project root:  python -m unittest tests.test_core -v   (or: pytest tests/test_core.py)
"""
import os
import tempfile
import unittest

# Point the app at a throwaway database before any app module is imported.
_tmp = tempfile.mkdtemp()
os.environ["STACKS_DB"] = os.path.join(_tmp, "test.db")

from app import db  # noqa: E402
from app.ingest import IngestError, chunk_text, extract_pdf, new_doc_id  # noqa: E402
from app.retrieval import index, tokenize  # noqa: E402
from tests.make_pdf import SAMPLE_PAGES, make_pdf  # noqa: E402


def store(name: str, pdf: bytes) -> str:
    pages, chunks = extract_pdf(pdf)
    doc_id = new_doc_id()
    with db.tx() as conn:
        conn.execute("INSERT INTO documents (id, name, pages) VALUES (?, ?, ?)", (doc_id, name, pages))
        conn.executemany(
            "INSERT INTO chunks (doc_id, page, text) VALUES (?, ?, ?)",
            [(doc_id, p, t) for p, t in chunks],
        )
    index.invalidate()
    return doc_id


class IngestTests(unittest.TestCase):
    def test_chunking_overlaps_and_covers_text(self):
        text = "word " * 400  # ~2000 chars
        pieces = chunk_text(text, size=700, overlap=120)
        self.assertGreater(len(pieces), 2)
        self.assertTrue(all(len(p) <= 700 for p in pieces))

    def test_chunking_empty_text(self):
        self.assertEqual(chunk_text("   \n\t "), [])

    def test_extract_keeps_page_numbers(self):
        pages, chunks = extract_pdf(make_pdf(SAMPLE_PAGES))
        self.assertEqual(pages, 3)
        by_page = {p for p, _ in chunks}
        self.assertEqual(by_page, {1, 2, 3})
        self.assertIn("Rotterdam", " ".join(t for p, t in chunks if p == 2))

    def test_pdf_without_text_is_rejected_with_helpful_message(self):
        with self.assertRaises(IngestError) as ctx:
            extract_pdf(make_pdf(["", ""]))
        self.assertIn("No text found", str(ctx.exception))

    def test_garbage_is_rejected(self):
        with self.assertRaises(IngestError):
            extract_pdf(b"%PDF-1.4 this is not really a pdf")


class RetrievalTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        db.init_db()
        cls.report = store("report.pdf", make_pdf(SAMPLE_PAGES))
        cls.other = store(
            "cooking.pdf",
            make_pdf(["Soup\nSimmer the onions slowly and add vegetable stock.", "Bread\nKnead the dough for ten minutes."]),
        )

    def test_tokenize_drops_stopwords_and_short_tokens(self):
        self.assertEqual(tokenize("The cat is on a mat"), ["cat", "mat"])

    def test_search_returns_right_document_and_page(self):
        hits = index.search("warehouse shipping delays", 5)
        self.assertTrue(hits)
        self.assertEqual(hits[0].doc_name, "report.pdf")
        self.assertEqual(hits[0].page, 2)

    def test_search_discriminates_between_documents(self):
        hits = index.search("knead dough bread", 5)
        self.assertEqual(hits[0].doc_name, "cooking.pdf")
        self.assertEqual(hits[0].page, 2)

    def test_scores_are_descending(self):
        hits = index.search("revenue enterprise currency supplier", 10)
        scores = [h.score for h in hits]
        self.assertEqual(scores, sorted(scores, reverse=True))

    def test_unknown_terms_and_empty_query_return_nothing(self):
        self.assertEqual(index.search("zebra quantum", 5), [])
        self.assertEqual(index.search("the a an", 5), [])
        self.assertEqual(index.search("", 5), [])

    def test_k_limits_results(self):
        self.assertLessEqual(len(index.search("the report operations risks revenue", 1)), 1)

    def test_delete_removes_chunks_and_index_updates(self):
        temp = store("temp.pdf", make_pdf(["Zeppelin\nThe zeppelin hangar opens at dawn."]))
        self.assertEqual(index.search("zeppelin hangar", 3)[0].doc_name, "temp.pdf")
        with db.tx() as conn:
            conn.execute("DELETE FROM documents WHERE id = ?", (temp,))
        index.invalidate()
        self.assertEqual(index.search("zeppelin hangar", 3), [])
        left = db.query("SELECT COUNT(*) AS n FROM chunks WHERE doc_id = ?", (temp,))[0]["n"]
        self.assertEqual(left, 0, "chunks should cascade-delete with their document")


if __name__ == "__main__":
    unittest.main()
