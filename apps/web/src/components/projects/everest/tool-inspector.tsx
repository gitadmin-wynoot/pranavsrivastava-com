"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, Clock3, Code2, Database, Radio, RefreshCw, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { MCP_SERVERS, MCP_TOOLS, MCP_FAILURES, createFixtureLedger, inputErrors, runFixture, simulateMcp, validateDemoRequest, type DemoRequest, type DemoResponse, type DemoRole, type FailureMode, type McpServerId } from "@/lib/everest-mcp";
import { radioClick, successChime, toolErrorBuzz, toolSuccessBeep, waitingTone } from "./audio";
import styles from "./tool-inspector.module.css";

const pretty = (value: unknown) => JSON.stringify(value, null, 2);
const roleNames: Record<DemoRole, string> = { observer: "Observer · read only", operator: "Operator · supply writes", safety: "Safety · request rescue" };
const componentLessons: Record<string, string> = {
  agent: "The agent chooses a useful capability. This deterministic host stands in for that choice; no live model is needed.",
  client: "The MCP client speaks the protocol: it discovers tools, sends structured arguments and receives results from one server.",
  server: "The server exposes a catalogue of capabilities and their schemas. Server-side application policy decides which requests can execute.",
  tool: "A tool is the specific capability being called. MCP standardises access to it; MCP is not the action itself.",
};

export default function ToolInspector({ onEvent, initialTool }: { onEvent?: (message: string) => void; initialTool?: string }) {
  const first = MCP_TOOLS.find((tool) => tool.name === initialTool) ?? MCP_TOOLS[0];
  const uid = useId();
  const [serverId, setServerId] = useState<McpServerId>(first.server);
  const [toolName, setToolName] = useState(first.name);
  const [argsText, setArgsText] = useState(pretty(first.defaults));
  const [role, setRole] = useState<DemoRole>(first.impact === "high-impact" ? "safety" : "observer");
  const [failure, setFailure] = useState<FailureMode>("none");
  const [response, setResponse] = useState<DemoResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<DemoRequest | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [part, setPart] = useState("client");
  const [callView, setCallView] = useState<"response" | "request" | "wire">("response");
  const [transport, setTransport] = useState<"unverified" | "live-mcp" | "simulation">("unverified");
  const ledger = useRef(createFixtureLedger());
  const session = useRef("");
  const sequence = useRef(0);
  const mounted = useRef(true);
  const latestOperation = useRef(0);
  const definition = MCP_TOOLS.find((tool) => tool.name === toolName)!;
  const server = MCP_SERVERS.find((candidate) => candidate.id === serverId)!;
  const result = response?.result;

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    const selected = MCP_TOOLS.find((tool) => tool.name === initialTool);
    if (!selected) return;
    setServerId(selected.server); setToolName(selected.name); setArgsText(pretty(selected.defaults));
    setRole(selected.impact === "high-impact" ? "safety" : selected.impact === "write" ? "operator" : "observer");
    setResponse(null); setLastRequest(null); setError("");
  }, [initialTool]);

  async function dispatch(request: DemoRequest) {
    setBusy(true); setError("");
    radioClick();
    const operation = ++latestOperation.current;
    let next: DemoResponse;
    try {
      const reply = await fetch("/api/everest/mcp", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request), signal: AbortSignal.timeout(5000),
      });
      if (!reply.ok) {
        if (reply.status < 500) {
          const body = await reply.json();
          throw new Error(`VALIDATION:${body.error ?? "The demo request was rejected."}`);
        }
        throw new Error("MCP adapter unavailable");
      }
      next = await reply.json();
      if (next.mode !== "live-mcp" || !Array.isArray(next.tools)) throw new Error("Invalid adapter response");
      // Keep fictional replay history when a later request has to fall back locally.
      if (next.result?.status === "success" && next.result.policy.impact !== "read") runFixture(request, ledger.current);
    } catch (caught) {
      if (caught instanceof Error && caught.message.startsWith("VALIDATION:")) {
        if (mounted.current && operation === latestOperation.current) { setError(caught.message.slice(11)); setBusy(false); }
        return;
      }
      next = simulateMcp(request, ledger.current);
    }
    if (!mounted.current || operation !== latestOperation.current) return;
    setResponse(next); setTransport(next.mode); setBusy(false);
    if (request.action === "call") {
      setLastRequest(request); setCallView("response");
      const status = next.result?.status;
      if (status === "success" || status === "degraded") toolSuccessBeep();
      else if (status === "blocked" || status === "error") toolErrorBuzz();
      else if (status === "approval-required") waitingTone();
    } else toolSuccessBeep();
    onEvent?.(request.action === "discover" ? `${server.name}: discovered ${next.tools.length} tools via ${next.mode === "live-mcp" ? "MCP" : "simulation"}.` : `${request.tool}: ${next.result?.code ?? "complete"}.`);
  }

  function requestFor(action: "discover" | "call"): DemoRequest | null {
    try {
      const args: unknown = action === "discover" ? {} : JSON.parse(argsText);
      if (typeof args !== "object" || args === null || Array.isArray(args)) throw new Error("Arguments must be a JSON object.");
      if (action === "call") {
        const errors = inputErrors(definition, args as Record<string, unknown>);
        if (errors.length) throw new Error(errors.join(" "));
      }
      if (!session.current) session.current = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `demo-${Date.now()}`;
      sequence.current += 1;
      return validateDemoRequest({ action, server: serverId, tool: toolName, arguments: args, role, failure, approval: "pending", sessionId: session.current, idempotencyKey: `call-${sequence.current}` });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Arguments must be valid JSON."); return null; }
  }
  function chooseServer(id: McpServerId) {
    const selected = MCP_TOOLS.find((tool) => tool.server === id)!;
    setServerId(id); setToolName(selected.name); setArgsText(pretty(selected.defaults));
    setResponse(null); setLastRequest(null); setError("");
  }
  function chooseTool(name: string) {
    const selected = MCP_TOOLS.find((tool) => tool.name === name)!;
    setToolName(name); setArgsText(pretty(selected.defaults)); setResponse(null); setLastRequest(null); setError("");
  }
  const inspected = callView === "request" ? response?.request : callView === "wire" ? response?.wire ?? { mode: "simulation", note: "Local fixture evaluation; no MCP messages crossed a transport." } : result?.output;

  return (
    <section className={styles.inspector} aria-label="MCP tool inspector">
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}><Radio size={13} aria-hidden="true" /> Camp III / Radio room</span><h3>Follow a tool call.</h3></div>
        <span className={`${styles.mode} ${transport === "simulation" ? styles.fallback : ""}`}><span />{transport === "live-mcp" ? "Real MCP · fixture data" : transport === "simulation" ? "Local simulation" : "MCP demo ready"}</span>
      </div>
      <p className={styles.intro}>A <strong>tool</strong> is a capability. <strong>MCP</strong> is the protocol that helps a host discover and call it. Trace the connection, then break a dependency.</p>
      {transport === "simulation" && <p className={styles.notice} role="status">Live MCP demo unavailable — continuing with simulation. The same fixture rules run in your browser.</p>}

      <div className={styles.chain} aria-label="Tool call architecture">
        {([['agent', server.agent], ['client', 'MCP client'], ['server', `${server.name} server`], ['tool', definition.name]] as const).map(([key, label], index) => (
          <div className={styles.chainStep} key={key}>
            {index > 0 && <ArrowRight size={13} aria-hidden="true" />}
            <button type="button" className={part === key ? styles.chainActive : ""} onClick={() => setPart(key)} aria-pressed={part === key}><span>{key === "agent" ? "Host / agent" : key}</span><strong>{label}</strong></button>
          </div>
        ))}
      </div>
      <p className={styles.partLesson}>{componentLessons[part]}</p>

      <div className={styles.servers} aria-label="MCP servers">
        {MCP_SERVERS.map((item) => <button key={item.id} type="button" disabled={busy} className={serverId === item.id ? styles.serverActive : ""} aria-pressed={serverId === item.id} onClick={() => chooseServer(item.id)}><Radio size={14} aria-hidden="true" /><span>{item.name}<small>{MCP_TOOLS.filter((tool) => tool.server === item.id).length} tools</small></span></button>)}
      </div>

      <div className={styles.workbench}>
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); const request = requestFor("call"); if (request) void dispatch(request); }}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-tool`}>Tool capability <span>{definition.impact}</span></label>
            <select id={`${uid}-tool`} value={toolName} disabled={busy} onChange={(event) => chooseTool(event.target.value)}>{MCP_TOOLS.filter((tool) => tool.server === serverId).map((tool) => <option key={tool.name} value={tool.name}>{tool.name}</option>)}</select>
            <p>{definition.description}</p>
          </div>
          <div className={styles.twoFields}>
            <div className={styles.field}><label htmlFor={`${uid}-role`}>Agent permission</label><select id={`${uid}-role`} disabled={busy} value={role} onChange={(event) => { setRole(event.target.value as DemoRole); setLastRequest(null); setResponse(null); }}>{Object.entries(roleNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className={styles.field}><label htmlFor={`${uid}-failure`}>Dependency condition</label><select id={`${uid}-failure`} disabled={busy} value={failure} onChange={(event) => { setFailure(event.target.value as FailureMode); setLastRequest(null); setResponse(null); }}>{MCP_FAILURES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}-args`}>Arguments <span>JSON · editable</span></label>
            <textarea id={`${uid}-args`} rows={5} spellCheck={false} value={argsText} maxLength={2500} disabled={busy} onChange={(event) => { setArgsText(event.target.value); setLastRequest(null); setResponse(null); }} aria-describedby={error ? `${uid}-error` : undefined} />
          </div>
          <details className={styles.schema}><summary><Code2 size={13} aria-hidden="true" /> Input schema</summary><pre>{pretty(definition.inputSchema)}</pre></details>
          {error && <p id={`${uid}-error`} className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}>
            <button type="submit" className={styles.primary} disabled={busy}><ArrowRight size={14} aria-hidden="true" />{busy ? "Sending…" : "Run tool call"}</button>
            <button type="button" className={styles.secondary} disabled={busy} onClick={() => { const request = requestFor("discover"); if (request) void dispatch(request); }}><RefreshCw size={13} aria-hidden="true" /> Discover tools</button>
          </div>
          <p className={styles.disclaimer}>All data and actions are fictional. Permission roles model policy; they are not real account access.</p>
        </form>

        <div className={styles.output} aria-live="polite" aria-busy={busy}>
          {!response ? <div className={styles.empty}><Radio size={29} strokeWidth={1.3} aria-hidden="true" /><h4>Radio channel open.</h4><p>Discover the server catalogue or send a tool request to inspect the policy, result and trace.</p><span>Host → client → server → capability</span></div> : <>
            <div className={styles.outputHeader}><span>{result ? "Call result" : "Capability discovery"}</span><strong className={result && !["success", "degraded"].includes(result.status) ? styles.warning : ""}>{result?.status.replaceAll("-", " ") ?? `${response.tools.length} tools`}</strong></div>
            {result ? <>
              <div className={styles.metrics}>
                <div><Clock3 size={13} aria-hidden="true" /><strong>{result.latencyMs.toLocaleString()} ms</strong><span>Simulated tool time</span></div>
                <div><Database size={13} aria-hidden="true" /><strong>{result.cache}</strong><span>{result.retries} bounded retries</span></div>
                <div><ShieldCheck size={13} aria-hidden="true" /><strong>{result.policy.allowed ? "Permitted" : "Denied"}</strong><span>{result.policy.impact}</span></div>
              </div>
              {result.status === "approval-required" && lastRequest && <div className={styles.approval}>
                <span><TriangleAlert size={14} aria-hidden="true" /> High-impact tool request</span>
                <h4>{lastRequest.tool}</h4><p>Requested by {server.agent}. Reason: {String(lastRequest.arguments.reason)}.</p>
                <details><summary>Inspect evidence</summary><pre>{pretty(result.output)}</pre></details>
                <div className={styles.actions}>
                  <button type="button" className={styles.primary} disabled={busy} onClick={() => { successChime(); void dispatch({ ...lastRequest, approval: "approved" }); }}><Check size={14} aria-hidden="true" /> Approve fictional action</button>
                  <button type="button" className={styles.secondary} disabled={busy} onClick={() => { toolErrorBuzz(); void dispatch({ ...lastRequest, approval: "rejected" }); }}><X size={14} aria-hidden="true" /> Reject</button>
                </div>
              </div>}
              <div className={styles.views} aria-label="Inspect call details">
                {(["response", "request", "wire"] as const).map((view) => <button key={view} type="button" aria-pressed={callView === view} className={callView === view ? styles.viewActive : ""} onClick={() => setCallView(view)}>{view === "wire" ? "MCP messages" : view}</button>)}
              </div>
              <pre className={styles.json} tabIndex={0} aria-label={`${callView} JSON`}>{pretty(inspected)}</pre>
              <p className={styles.lesson}><span>Production lesson</span>{result.lesson}</p>
              {lastRequest && result.status === "success" && <button className={styles.replay} type="button" disabled={busy} onClick={() => void dispatch(lastRequest)}><RefreshCw size={13} aria-hidden="true" /> Replay same idempotency key</button>}
            </> : <div className={styles.catalogue}>
              {response.tools.map((tool) => <button type="button" key={tool.name} onClick={() => chooseTool(tool.name)}><span>{tool.name}<small>{tool.description}</small></span><em>{tool.impact}</em></button>)}
              {response.resources.map((resource) => <details key={resource.uri}><summary><Database size={13} aria-hidden="true" /> Resource: {resource.name}</summary><p>Resources provide data. A tool performs an operation. Reading this note does not authorise an action.</p><code>{resource.uri}</code><pre>{pretty(response.resourceContents)}</pre></details>)}
            </div>}
            <p className={styles.transport}>{response.mode === "live-mcp" ? `Official SDK · protocol ${response.protocolVersion} · in-process transport ${response.transportLatencyMs} ms` : "Browser fixtures · no live MCP transport"}</p>
          </>}
        </div>
      </div>
      <p className={styles.footnote}>This demo runs real MCP discovery and tool calls between an SDK client and server when available. Dependency timing is simulated. Idempotency history is temporary and expires after ten minutes; production writes need a durable, atomic store.</p>
    </section>
  );
}
