"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

const API = (process.env.NEXT_PUBLIC_STACKS_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

type Doc = {
  id: string;
  name: string;
  pages: number;
  status: "ready" | "uploading" | "error";
  error?: string;
};

type Source = {
  doc_id: string;
  doc_name: string;
  page: number;
  text: string;
  score: number;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  pending?: boolean;
};

type Tab = "chat" | "search";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, init);
  } catch {
    throw new Error(`Cannot reach the Stacks API at ${API}. Is the backend running?`);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") message = body.detail;
      else if (Array.isArray(body.detail) && body.detail[0]?.msg) message = body.detail[0].msg;
    } catch {
      // keep the default message
    }
    throw new Error(message);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Wrap each query term found in `text` in a <mark>. */
function Highlighted({ text, query }: { text: string; query: string }) {
  const terms = Array.from(new Set((query.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter((t) => t.length > 2)));
  if (terms.length === 0) return <>{text}</>;

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "ig"));

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-blue-500/30 px-0.5 text-white">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Render "[1]" style citations in an answer as small badges. */
function AnswerText({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap leading-7">
      {text.split(/(\[\d+\])/g).map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/);
        return match ? (
          <span
            key={i}
            className="mx-0.5 inline-block rounded bg-blue-500/20 px-1.5 text-xs font-semibold text-blue-300"
          >
            {match[1]}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </p>
  );
}

function SourceCard({ source, index }: { source: Source; index?: number }) {
  const excerpt = source.text.length > 220 ? `${source.text.slice(0, 220)}…` : source.text;
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
      <p className="text-xs font-semibold text-blue-400">
        {index !== undefined ? `[${index}] ` : ""}
        {source.doc_name} · page {source.page}
      </p>
      <p className="mt-1 text-sm italic leading-6 text-slate-400">&ldquo;{excerpt}&rdquo;</p>
    </div>
  );
}

export default function Stacks() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [tab, setTab] = useState<Tab>("chat");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [asking, setAsking] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchedFor, setSearchedFor] = useState("");
  const [results, setResults] = useState<Source[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const chatLog = useRef<HTMLDivElement>(null);

  const hasReadyDocs = docs.some((d) => d.status === "ready");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [health, existing] = await Promise.all([
          request<{ chat_enabled: boolean }>("/api/health"),
          request<{ id: string; name: string; pages: number }[]>("/api/documents"),
        ]);
        if (cancelled) return;
        setChatEnabled(health.chat_enabled);
        setDocs(existing.map((d) => ({ ...d, status: "ready" as const })));
      } catch (e) {
        if (!cancelled) setApiError(e instanceof Error ? e.message : "Could not reach the API.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    chatLog.current?.scrollTo({ top: chatLog.current.scrollHeight });
  }, [messages]);

  async function addFile(file: File) {
    const tmpId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setDocs((prev) => [...prev, { id: tmpId, name: file.name, pages: 0, status: "uploading" }]);

    const form = new FormData();
    form.append("file", file);
    try {
      const saved = await request<{ id: string; name: string; pages: number }>("/api/documents", {
        method: "POST",
        body: form,
      });
      setDocs((prev) => prev.map((d) => (d.id === tmpId ? { ...saved, status: "ready" } : d)));
    } catch (e) {
      const error = e instanceof Error ? e.message : "Could not add this file.";
      setDocs((prev) => prev.map((d) => (d.id === tmpId ? { ...d, status: "error", error } : d)));
    }
  }

  async function removeDoc(doc: Doc) {
    if (doc.status === "ready") {
      try {
        await request<void>(`/api/documents/${encodeURIComponent(doc.id)}`, { method: "DELETE" });
      } catch (e) {
        setApiError(e instanceof Error ? e.message : "Could not remove this document.");
        return;
      }
    }
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
  }

  async function onAsk(e: FormEvent) {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question || asking) return;
    setChatInput("");

    if (!hasReadyDocs) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "assistant", text: "Add a document to your stack first. I can only answer from what is uploaded." },
      ]);
      return;
    }

    setAsking(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: "Reading your documents…", pending: true },
    ]);

    let reply: ChatMessage;
    try {
      const data = await postJson<{ answer: string; sources: Source[] }>("/api/chat", { query: question });
      reply = { role: "assistant", text: data.answer, sources: data.sources };
    } catch (err) {
      reply = { role: "assistant", text: err instanceof Error ? err.message : "Something went wrong." };
    }
    setMessages((prev) => [...prev.slice(0, -1), reply]);
    setAsking(false);
  }

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query || searching) return;

    setSearching(true);
    setSearchError(null);
    try {
      const data = await postJson<{ results: Source[] }>("/api/search", { query });
      setResults(data.results);
      setSearchedFor(query);
    } catch (err) {
      setResults(null);
      setSearchError(err instanceof Error ? err.message : "Search failed.");
    }
    setSearching(false);
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Document Q&amp;A</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Stacks</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          Upload PDFs, then chat or search across them. Every answer points back to the page it came from.
        </p>

        {apiError && (
          <p role="alert" className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {apiError}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Documents */}
          <aside className="flex h-[70vh] min-h-[32rem] flex-col rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-4 py-4">
              <h2 className="font-semibold">Your documents</h2>
              <p className="mt-1 text-sm text-slate-400">Add PDFs to build a stack you can question.</p>
            </div>

            <ul className="flex-1 space-y-2 overflow-y-auto p-3">
              {docs.length === 0 && (
                <li className="px-1 py-3 text-sm leading-6 text-slate-400">
                  No documents yet. Add a PDF to get started.
                </li>
              )}
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className={`relative rounded-lg border border-l-4 border-slate-800 bg-slate-950 px-3 py-2 ${
                    doc.status === "error" ? "border-l-red-500" : doc.status === "uploading" ? "border-l-slate-600" : "border-l-blue-500"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => removeDoc(doc)}
                    aria-label={`${doc.status === "ready" ? "Remove" : "Dismiss"} ${doc.name}`}
                    className="absolute right-2 top-2 rounded px-1 text-slate-500 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
                  >
                    ×
                  </button>
                  <p className="break-words pr-5 text-sm font-medium">{doc.name}</p>
                  <p className={`mt-1 text-xs ${doc.status === "error" ? "text-red-400" : "text-slate-400"}`}>
                    {doc.status === "ready"
                      ? `${doc.pages} page${doc.pages === 1 ? "" : "s"}`
                      : doc.status === "uploading"
                        ? "Uploading and reading…"
                        : doc.error}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-800 p-3">
              <input
                ref={fileInput}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  Array.from(e.target.files ?? []).forEach(addFile);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Add PDF
              </button>
            </div>
          </aside>

          {/* Chat and search */}
          <div className="flex h-[70vh] min-h-[32rem] flex-col rounded-2xl border border-slate-800 bg-slate-900">
            <div role="tablist" aria-label="Ask or search" className="flex gap-2 border-b border-slate-800 px-4 pt-3">
              {(["chat", "search"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm font-semibold capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                    tab === t ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "chat" ? (
              <>
                <div ref={chatLog} role="log" aria-live="polite" className="flex-1 space-y-5 overflow-y-auto p-5">
                  {messages.length === 0 && (
                    <div className="mx-auto mt-10 max-w-sm text-center text-sm leading-6 text-slate-400">
                      <h2 className="text-lg font-semibold text-white">Ask your stack a question</h2>
                      <p className="mt-2">
                        Answers come only from the documents you have added, with the source passage under each one.
                      </p>
                      {!chatEnabled && (
                        <p className="mt-4 text-amber-300">
                          Chat is off: set ANTHROPIC_API_KEY on the backend and restart it. Search still works.
                        </p>
                      )}
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                      <div className="max-w-[85%]">
                        <div
                          className={`rounded-xl px-4 py-3 text-[15px] ${
                            m.role === "user"
                              ? "bg-blue-600 text-white"
                              : "border border-slate-800 bg-slate-950 text-slate-200"
                          } ${m.pending ? "italic text-slate-400" : ""}`}
                        >
                          {m.role === "assistant" && !m.pending ? <AnswerText text={m.text} /> : m.text}
                        </div>
                        {m.sources && m.sources.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {m.sources.map((s, n) => (
                              <SourceCard key={`${s.doc_id}-${s.page}-${n}`} source={s} index={n + 1} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={onAsk} className="flex gap-2 border-t border-slate-800 p-4">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask something about your documents"
                    aria-label="Question"
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  />
                  <button
                    type="submit"
                    disabled={asking || !chatInput.trim()}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-default disabled:opacity-50"
                  >
                    Ask
                  </button>
                </form>
              </>
            ) : (
              <>
                <form onSubmit={onSearch} className="flex gap-2 border-b border-slate-800 p-4">
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search across your documents"
                    aria-label="Search"
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  />
                  <button
                    type="submit"
                    disabled={searching || !searchInput.trim()}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-default disabled:opacity-50"
                  >
                    Search
                  </button>
                </form>

                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {searchError && <p role="alert" className="text-sm text-red-300">{searchError}</p>}
                  {results === null && !searchError && (
                    <p className="mx-auto mt-10 max-w-sm text-center text-sm leading-6 text-slate-400">
                      {hasReadyDocs
                        ? "Search finds passages that contain your words. Results show the document and page."
                        : "Add a document to your stack first."}
                    </p>
                  )}
                  {results !== null && results.length === 0 && (
                    <p className="mx-auto mt-10 max-w-sm text-center text-sm leading-6 text-slate-400">
                      No matches. Try different words; search looks for terms that appear in your documents.
                    </p>
                  )}
                  {results?.map((r, i) => (
                    <article key={`${r.doc_id}-${r.page}-${i}`} className="rounded-lg border border-slate-800 border-l-4 border-l-blue-500 bg-slate-950 px-4 py-3">
                      <p className="text-xs font-semibold text-blue-400">
                        {r.doc_name} · page {r.page}
                      </p>
                      <p className="mt-1 text-[15px] leading-7 text-slate-300">
                        …<Highlighted text={r.text} query={searchedFor} />…
                      </p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
