"""BM25 retrieval over all stored chunks.

The index is held in memory and rebuilt lazily after any change to the
chunk table, which is plenty for an MVP-sized corpus. To move to embeddings
later, replace `search()` and keep the same return shape.
"""
import math
import re
import threading
from collections import Counter
from dataclasses import dataclass

from . import db

STOPWORDS = set(
    "a an the and or but if of in on at to for with as is are was were be been being "
    "this that these those it its from by not no do does did can will would should could "
    "i you he she we they them his her our your their".split()
)
_TOKEN_RE = re.compile(r"[a-z0-9']+")

K1 = 1.5
B = 0.75


def tokenize(text: str) -> list[str]:
    return [t for t in _TOKEN_RE.findall(text.lower()) if len(t) > 2 and t not in STOPWORDS]


@dataclass
class Hit:
    chunk_id: int
    doc_id: str
    doc_name: str
    page: int
    text: str
    score: float


class _Index:
    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.dirty = True
        self.rows: list[dict] = []
        self.tfs: list[Counter] = []
        self.lengths: list[int] = []
        self.df: Counter = Counter()
        self.avg_len = 0.0

    def invalidate(self) -> None:
        self.dirty = True

    def _rebuild(self) -> None:
        rows = db.query(
            "SELECT c.id, c.doc_id, d.name AS doc_name, c.page, c.text "
            "FROM chunks c JOIN documents d ON d.id = c.doc_id"
        )
        self.rows = [dict(r) for r in rows]
        self.tfs, self.lengths, self.df = [], [], Counter()
        for r in self.rows:
            toks = tokenize(r["text"])
            tf = Counter(toks)
            self.tfs.append(tf)
            self.lengths.append(len(toks))
            self.df.update(tf.keys())
        self.avg_len = (sum(self.lengths) / len(self.lengths)) if self.lengths else 0.0
        self.dirty = False

    def search(self, query: str, k: int) -> list[Hit]:
        with self.lock:
            if self.dirty:
                self._rebuild()
            n = len(self.rows)
            q_terms = set(tokenize(query))
            if n == 0 or not q_terms:
                return []
            idf = {
                t: math.log(1 + (n - self.df[t] + 0.5) / (self.df[t] + 0.5))
                for t in q_terms
                if self.df.get(t)
            }
            scored: list[tuple[float, int]] = []
            for i, tf in enumerate(self.tfs):
                score = 0.0
                norm = K1 * (1 - B + B * self.lengths[i] / (self.avg_len or 1))
                for t, w in idf.items():
                    f = tf.get(t)
                    if f:
                        score += w * (f * (K1 + 1)) / (f + norm)
                if score > 0:
                    scored.append((score, i))
            scored.sort(reverse=True)
            return [
                Hit(
                    chunk_id=self.rows[i]["id"],
                    doc_id=self.rows[i]["doc_id"],
                    doc_name=self.rows[i]["doc_name"],
                    page=self.rows[i]["page"],
                    text=self.rows[i]["text"],
                    score=round(s, 4),
                )
                for s, i in scored[:k]
            ]


index = _Index()
