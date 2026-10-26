"""HTTP-level tests. Needs the dev requirements:  pip install -r requirements-dev.txt && pytest

The Claude call is replaced with a stub, so no API key or network is needed.
"""
import os
import tempfile

import pytest

os.environ["STACKS_DB"] = os.path.join(tempfile.mkdtemp(), "api-test.db")

from fastapi.testclient import TestClient  # noqa: E402

from app import chat  # noqa: E402
from app.main import app  # noqa: E402
from tests.make_pdf import SAMPLE_PAGES, make_pdf  # noqa: E402


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:  # runs the lifespan, which creates tables
        yield c


def upload(client, name="report.pdf", data=None, ctype="application/pdf"):
    data = data if data is not None else make_pdf(SAMPLE_PAGES)
    return client.post("/api/documents", files={"file": (name, data, ctype)})


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_cors_allows_the_configured_frontend_only(client):
    ok = client.options(
        "/api/search",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert ok.status_code == 200
    assert ok.headers["access-control-allow-origin"] == "http://localhost:3000"

    other = client.options(
        "/api/search",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"},
    )
    assert "access-control-allow-origin" not in other.headers


def test_upload_list_and_delete(client):
    r = upload(client)
    assert r.status_code == 201
    doc = r.json()
    assert doc["name"] == "report.pdf" and doc["pages"] == 3

    assert doc["id"] in [d["id"] for d in client.get("/api/documents").json()]

    assert client.delete(f"/api/documents/{doc['id']}").status_code == 204
    assert doc["id"] not in [d["id"] for d in client.get("/api/documents").json()]
    assert client.delete(f"/api/documents/{doc['id']}").status_code == 404


def test_upload_rejections(client):
    assert upload(client, name="notes.txt", data=b"hello", ctype="text/plain").status_code == 415
    assert upload(client, name="fake.pdf", data=b"not a pdf at all").status_code == 415
    scan = upload(client, name="scan.pdf", data=make_pdf(["", ""]))
    assert scan.status_code == 422 and "No text found" in scan.json()["detail"]


def test_search_returns_page_citations(client):
    doc = upload(client).json()
    r = client.post("/api/search", json={"query": "warehouse shipping delays"})
    assert r.status_code == 200
    top = r.json()["results"][0]
    assert top["doc_name"] == "report.pdf" and top["page"] == 2
    client.delete(f"/api/documents/{doc['id']}")


def test_search_validates_input(client):
    assert client.post("/api/search", json={"query": ""}).status_code == 422


def test_chat_uses_retrieved_sources(client, monkeypatch):
    seen = {}

    async def fake_answer(question, hits):
        seen["prompt"] = chat.build_system_prompt(hits)
        return "Shipping delays fell after barcode scanners were adopted [1]."

    monkeypatch.setattr(chat, "answer", fake_answer)
    doc = upload(client).json()

    r = client.post("/api/chat", json={"query": "What reduced shipping delays?"})
    assert r.status_code == 200
    body = r.json()
    assert "[1]" in body["answer"]
    assert body["sources"][0]["page"] == 2
    assert "barcode scanners" in seen["prompt"] and "page 2" in seen["prompt"]
    client.delete(f"/api/documents/{doc['id']}")


def test_chat_without_matches_skips_the_model(client, monkeypatch):
    async def boom(*_):
        raise AssertionError("model must not be called when nothing was retrieved")

    monkeypatch.setattr(chat, "answer", boom)
    r = client.post("/api/chat", json={"query": "zebra quantum"})
    assert r.status_code == 200 and r.json()["sources"] == []


def test_chat_reports_missing_api_key(client, monkeypatch):
    monkeypatch.setattr(chat, "ANTHROPIC_API_KEY", "")
    monkeypatch.setattr(chat, "_client", None)
    doc = upload(client).json()
    r = client.post("/api/chat", json={"query": "warehouse shipping"})
    assert r.status_code == 503 and "ANTHROPIC_API_KEY" in r.json()["detail"]
    client.delete(f"/api/documents/{doc['id']}")
