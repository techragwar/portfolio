import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DB_PATH = Path(os.environ.get("STACKS_DB", BASE_DIR / "data" / "stacks.db"))

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = os.environ.get("STACKS_MODEL", "claude-sonnet-5-5")

MAX_UPLOAD_MB = int(os.environ.get("STACKS_MAX_UPLOAD_MB", "25"))
CHUNK_SIZE = int(os.environ.get("STACKS_CHUNK_SIZE", "700"))
CHUNK_OVERLAP = int(os.environ.get("STACKS_CHUNK_OVERLAP", "120"))
TOP_K_CHAT = int(os.environ.get("STACKS_TOP_K_CHAT", "5"))
TOP_K_SEARCH = int(os.environ.get("STACKS_TOP_K_SEARCH", "10"))

# Origins allowed to call the API from a browser (comma-separated).
CORS_ORIGINS = [
    o.strip()
    for o in os.environ.get("STACKS_CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]
