"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const INTRO: Msg = {
  role: "assistant",
  content:
    "Hey — I'm the guide to Pranav's site. Ask about his work, his AI research, the courses, or how to reach him.",
};

const SUGGESTIONS = [
  "Who is Pranav?",
  "What does he research?",
  "Show me the courses",
];

export function SiteChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ??
            data.error ??
            "Something went wrong on my end. Try /contact to reach Pranav directly.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network hiccup. Mind trying again?" },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[28rem] max-h-[70vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Ask about Pranav
            </p>
            <p className="text-xs text-zinc-400">
              A guide to the site · points you to the real pages
            </p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-2 text-sm leading-relaxed"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 px-3 py-2 text-sm leading-relaxed"
                  }
                >
                  {renderWithLinks(msg.content)}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
                  …
                </div>
              </div>
            )}

            {/* Suggestions (only before the first user message) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={1000}
              className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-full px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              aria-label="Send"
              className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/** Turn /path and bare URLs in assistant text into clickable links. */
function renderWithLinks(text: string) {
  const parts = text.split(/(\s)/);
  return parts.map((part, i) => {
    if (/^\/[a-z/-]+$/i.test(part)) {
      return (
        <a key={i} href={part} className="underline underline-offset-2 hover:opacity-80">
          {part}
        </a>
      );
    }
    if (/^https?:\/\/\S+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80 break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
