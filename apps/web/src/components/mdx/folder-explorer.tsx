"use client";

import { useState } from "react";
import { Folder, FolderOpen, FileText } from "lucide-react";

/*
  FolderExplorer — an interactive Open Knowledge Format (OKF) bundle: a folder of
  markdown files with YAML frontmatter. Click through the tree, open a file, and
  see how knowledge lives as plain, navigable, cross-linked files — the "folder"
  way of giving an AI knowledge.
*/

type FileDoc = {
  type: string;
  title: string;
  desc: string;
  tags?: string[];
  body: string;
};

type Node =
  | { kind: "folder"; name: string; children: Node[] }
  | { kind: "file"; name: string; path: string };

const TREE: Node = {
  kind: "folder",
  name: "sales/",
  children: [
    { kind: "file", name: "index.md", path: "index" },
    {
      kind: "folder",
      name: "tables/",
      children: [
        { kind: "file", name: "orders.md", path: "orders" },
        { kind: "file", name: "customers.md", path: "customers" },
      ],
    },
    {
      kind: "folder",
      name: "metrics/",
      children: [{ kind: "file", name: "weekly_active_users.md", path: "wau" }],
    },
  ],
};

const FILES: Record<string, FileDoc> = {
  index: {
    type: "Index",
    title: "Sales knowledge",
    desc: "Everything an agent needs to reason about the sales domain.",
    body: "This bundle describes the sales tables and the metrics built on them.\n\n- Tables → tables/\n- Metrics → metrics/\n\nStart with [orders](tables/orders.md).",
  },
  orders: {
    type: "BigQuery Table",
    title: "Orders",
    desc: "One row per completed customer order.",
    tags: ["sales", "revenue"],
    body: "# Schema\n| Column        | Type   | Description                         |\n|---------------|--------|-------------------------------------|\n| order_id      | STRING | Globally unique order id.           |\n| customer_id   | STRING | FK → [customers](customers.md).     |\n| amount_eur    | FLOAT  | Order total, in euros.              |\n\n# Joins\nJoined with [customers](customers.md) on customer_id.",
  },
  customers: {
    type: "BigQuery Table",
    title: "Customers",
    desc: "One row per customer.",
    tags: ["sales"],
    body: "# Schema\n| Column       | Type   | Description              |\n|--------------|--------|--------------------------|\n| customer_id  | STRING | Globally unique id.      |\n| country      | STRING | ISO country code.        |\n| created_at   | DATE   | Sign-up date.            |",
  },
  wau: {
    type: "Metric",
    title: "Weekly Active Users",
    desc: "Distinct customers with an order in the last 7 days.",
    tags: ["metric", "engagement"],
    body: "# Definition\nCOUNT(DISTINCT customer_id) from [orders](../tables/orders.md)\nwhere the order date is within the last 7 days.\n\n# Note\nThis is order-based activity, not app opens.",
  },
};

function TreeView({
  node,
  depth,
  open,
  toggle,
  selected,
  onSelect,
}: {
  node: Node;
  depth: number;
  open: Set<string>;
  toggle: (name: string) => void;
  selected: string;
  onSelect: (p: string) => void;
}) {
  if (node.kind === "file") {
    const isSel = selected === node.path;
    return (
      <button
        onClick={() => onSelect(node.path)}
        className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[13px] transition-colors ${isSel ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" /> {node.name}
      </button>
    );
  }
  const isOpen = open.has(node.name);
  return (
    <div>
      <button
        onClick={() => toggle(node.name)}
        className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[13px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        {isOpen ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500" /> : <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
        {node.name}
      </button>
      {isOpen &&
        node.children.map((c) => (
          <TreeView key={c.name} node={c} depth={depth + 1} open={open} toggle={toggle} selected={selected} onSelect={onSelect} />
        ))}
    </div>
  );
}

export function FolderExplorer() {
  const [open, setOpen] = useState<Set<string>>(new Set(["sales/", "tables/", "metrics/"]));
  const [sel, setSel] = useState("orders");
  const toggle = (name: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const doc = FILES[sel];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Knowledge as a folder — an Open Knowledge Format bundle. Click through it.
      </div>
      <div className="grid sm:grid-cols-[200px_1fr]">
        {/* tree */}
        <div className="border-b border-zinc-200 p-2 dark:border-zinc-800 sm:border-b-0 sm:border-r">
          <TreeView node={TREE} depth={0} open={open} toggle={toggle} selected={sel} onSelect={setSel} />
        </div>
        {/* viewer */}
        <div className="p-4">
          <div className="mb-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="text-zinc-400">---</span>
            <div><span className="text-violet-600 dark:text-violet-400">type:</span> {doc.type}</div>
            <div><span className="text-violet-600 dark:text-violet-400">title:</span> {doc.title}</div>
            <div><span className="text-violet-600 dark:text-violet-400">description:</span> {doc.desc}</div>
            {doc.tags && (
              <div><span className="text-violet-600 dark:text-violet-400">tags:</span> [{doc.tags.join(", ")}]</div>
            )}
            <span className="text-zinc-400">---</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-zinc-700 dark:text-zinc-200">{doc.body}</pre>
        </div>
      </div>
      <figcaption className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-[11px] text-zinc-400">
        Just markdown + a little YAML. Human-readable, git-versionable, and an agent can read it, follow the links, and even update it.
      </figcaption>
    </figure>
  );
}
