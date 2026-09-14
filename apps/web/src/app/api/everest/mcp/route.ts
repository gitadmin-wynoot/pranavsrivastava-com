import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, LATEST_PROTOCOL_VERSION } from "@modelcontextprotocol/sdk/types.js";
import { MCP_TOOLS, ROUTE_NOTE, ROUTE_RESOURCE, createFixtureLedger, runFixture, validateDemoRequest, type DemoRequest, type DemoResponse, type DemoResult } from "@/lib/everest-mcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bounded, ephemeral demo bookkeeping, never a production side-effect store.
// Entries may disappear on a cold start; no external operations can occur here.
const ledger = createFixtureLedger();
const MAX_BODY_BYTES = 8192;

async function readBoundedBody(request: Request): Promise<unknown> {
  const size = Number(request.headers.get("content-length") ?? 0);
  if (size > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("A JSON body is required.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    bytes += next.value.byteLength;
    if (bytes > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("BODY_TOO_LARGE"); }
    chunks.push(next.value);
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(body)); } catch { throw new Error("Body must be valid JSON."); }
}

/** The HTTP route is an app adapter. Real MCP messages run across linked SDK transports. */
async function executeMcp(request: DemoRequest): Promise<DemoResponse> {
  const started = performance.now();
  const wire: NonNullable<DemoResponse["wire"]> = [];
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  for (const transport of [clientTransport, serverTransport]) {
    const send = transport.send.bind(transport);
    transport.send = async (message, options) => {
      if ("method" in message) wire.push({ method: message.method, ...("params" in message ? { params: message.params } : {}) });
      else if ("result" in message) wire.push({ method: "response", result: message.result });
      return send(message, options);
    };
  }
  const server = new Server({ name: `everest-${request.server}-fixture`, version: "1.0.0" }, { capabilities: { tools: {}, ...(request.server === "route" ? { resources: {} } : {}) } });
  const client = new Client({ name: "everest-expedition-host", version: "1.0.0" }, { capabilities: {} });
  const definitions = MCP_TOOLS.filter((tool) => tool.server === request.server && !(request.failure === "unavailable" && tool.name === request.tool));
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: definitions.map((tool) => ({
    name: tool.name, description: tool.description, inputSchema: tool.inputSchema,
    outputSchema: { type: "object" as const, properties: { fixture: { type: "boolean" }, data: { type: "object" } }, required: ["fixture", "data"] },
    annotations: { readOnlyHint: tool.impact === "read", destructiveHint: tool.impact === "high-impact", idempotentHint: true, openWorldHint: false },
  })) }));
  if (request.server === "route") {
    server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: [ROUTE_RESOURCE] }));
    server.setRequestHandler(ReadResourceRequestSchema, async (message) => {
      if (message.params.uri !== ROUTE_RESOURCE.uri) throw new Error("Unknown fixture resource.");
      return { contents: [{ uri: ROUTE_RESOURCE.uri, mimeType: "application/json", text: JSON.stringify(ROUTE_NOTE) }] };
    });
  }
  let result: DemoResult | undefined;
  server.setRequestHandler(CallToolRequestSchema, async (message, context) => {
    result = runFixture({ ...request, tool: message.params.name, arguments: message.params.arguments ?? {} }, ledger);
    if (request.failure === "timeout" && result.code === "DEADLINE_EXCEEDED") {
      // Accelerated demo: 100 ms of wall time represents the 2-second dependency budget.
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 180);
        context.signal.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
      });
    }
    if (result.code === "OUTPUT_SCHEMA_INVALID") return { content: [{ type: "text" as const, text: "wind: probably fine" }], structuredContent: { fixture: true, data: "invalid" } };
    const isError = !["success", "degraded"].includes(result.status);
    return { content: [{ type: "text" as const, text: JSON.stringify(result.output) }], ...(isError ? { isError: true } : { structuredContent: result.output }) };
  });
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const discovered = await client.listTools();
    const resources = request.server === "route" ? (await client.listResources()).resources : [];
    const resourceContents = request.server === "route" ? await client.readResource({ uri: ROUTE_RESOURCE.uri }) : undefined;
    if (request.action === "call") {
      try {
        await client.callTool({ name: request.tool!, arguments: request.arguments }, undefined, { timeout: request.failure === "timeout" ? 100 : 1500 });
        if (request.failure === "duplicate" && result?.status === "success" && result.policy.impact !== "read") {
          await client.callTool({ name: request.tool!, arguments: request.arguments }, undefined, { timeout: 1500 });
          if (result) result = { ...result, retries: 1 };
        }
      } catch (error) {
        // These cases intentionally exercise SDK deadline / output-schema validation.
        if (!result || !["DEADLINE_EXCEEDED", "OUTPUT_SCHEMA_INVALID"].includes(result.code)) throw error;
      }
    }
    const response: DemoResponse = {
      mode: "live-mcp", protocolVersion: LATEST_PROTOCOL_VERSION, server: request.server,
      tools: discovered.tools.map((tool) => ({ ...definitions.find((definition) => definition.name === tool.name)!, inputSchema: tool.inputSchema as (typeof MCP_TOOLS)[number]["inputSchema"] })),
      resources: resources.map((resource) => ({ uri: resource.uri, name: resource.name, mimeType: resource.mimeType ?? "application/json", description: resource.description ?? "" })),
      ...(resourceContents ? { resourceContents } : {}),
      ...(request.action === "call" ? { result, request: { ...request, timestamp: new Date().toISOString(), traceId: `demo-${request.idempotencyKey}` } } : {}),
      transportLatencyMs: Math.round((performance.now() - started) * 10) / 10, wire,
    };
    return response;
  } finally {
    await client.close();
    await server.close();
  }
}

export async function POST(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  let input: DemoRequest;
  try { input = validateDemoRequest(await readBoundedBody(request)); }
  catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request.";
    return Response.json({ error: message === "BODY_TOO_LARGE" ? "Request body exceeds 8 KB." : message }, { status: message === "BODY_TOO_LARGE" ? 413 : 400, headers });
  }
  try { return Response.json(await executeMcp(input), { headers }); }
  catch { return Response.json({ error: "Live MCP demo unavailable — continuing with simulation." }, { status: 503, headers }); }
}
