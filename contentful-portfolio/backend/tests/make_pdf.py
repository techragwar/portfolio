"""Helpers that build small PDFs for tests."""
import io

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def make_pdf(pages: list[str]) -> bytes:
    """One PDF page per string. An empty string gives a page with no text."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    for text in pages:
        y = 740
        for line in text.split("\n"):
            if line:
                c.drawString(72, y, line)
            y -= 16
        c.showPage()
    c.save()
    return buf.getvalue()


SAMPLE_PAGES = [
    "Quarterly report\nRevenue grew twelve percent driven by enterprise subscriptions.",
    "Operations\nThe warehouse in Rotterdam reduced shipping delays by adopting barcode scanners.",
    "Risks\nCurrency volatility and supplier concentration remain the main exposure.",
]
