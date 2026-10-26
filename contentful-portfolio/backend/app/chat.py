from anthropic import APIError, AsyncAnthropic

from .config import ANTHROPIC_API_KEY, CLAUDE_MODEL
from .retrieval import Hit

SYSTEM_TEMPLATE = (
    "You are a careful research assistant. Answer the user's question using ONLY the numbered "
    "excerpts below. Cite the excerpt number in square brackets, like [1], right after each "
    "claim that relies on it. If the excerpts do not contain enough to answer, say so plainly "
    "rather than guessing.\n\nExcerpts:\n{excerpts}"
)

_client: AsyncAnthropic | None = None


class ChatUnavailable(Exception):
    pass


def _get_client() -> AsyncAnthropic:
    global _client
    if not ANTHROPIC_API_KEY:
        raise ChatUnavailable(
            "ANTHROPIC_API_KEY is not set on the server. Add it to your environment and restart."
        )
    if _client is None:
        _client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    return _client


def build_system_prompt(hits: list[Hit]) -> str:
    block = "\n\n".join(
        f"[{i}] ({h.doc_name}, page {h.page}): {h.text}" for i, h in enumerate(hits, start=1)
    )
    return SYSTEM_TEMPLATE.format(excerpts=block)


async def answer(question: str, hits: list[Hit]) -> str:
    client = _get_client()
    try:
        resp = await client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=1000,
            system=build_system_prompt(hits),
            messages=[{"role": "user", "content": question}],
        )
    except APIError as exc:
        raise ChatUnavailable(f"The Claude API returned an error: {exc.message}") from exc
    text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text").strip()
    return text or "I could not generate a response."
