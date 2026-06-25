"use client";

import { isValidElement, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

// Replaces the default <pre>. For real code (a language-tagged fence, which
// rehype-highlight marks with `hljs language-*`) it renders a proper window:
// copy button, contained max-height with scroll, dark surface. For untagged
// fences — our ASCII <Diagram>s — it renders a plain <pre> so the surrounding
// component keeps full control of the styling.
export function CodeBlock(props: React.ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const child = props.children;
  const childClassName =
    isValidElement<{ className?: string }>(child) ? child.props.className ?? "" : "";
  const isCode = /language-|hljs/.test(childClassName);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  // Diagrams / plain blocks: let the surrounding component style it.
  if (!isCode) {
    return <pre {...props} />;
  }

  return (
    <div className="code-block group relative not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800/80 text-zinc-300 backdrop-blur opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-zinc-700 hover:text-zinc-100 transition-all"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
      <pre
        ref={ref}
        className="m-0 overflow-auto max-h-[30rem] p-4 text-[13px] leading-relaxed bg-zinc-950 text-zinc-100"
      >
        {props.children}
      </pre>
    </div>
  );
}
