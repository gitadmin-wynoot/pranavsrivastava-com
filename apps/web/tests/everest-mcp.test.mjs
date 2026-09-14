import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function compile(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const exports = {};
  new Function("exports", "require", compiled.outputText)(exports, (name) => dependencies[name] ?? require(name));
  return exports;
}
const fixtures = compile("../src/lib/everest-mcp.ts");
const { POST } = compile("../src/app/api/everest/mcp/route.ts", { "@/lib/everest-mcp": fixtures });
const { MCP_TOOLS, MCP_SERVERS, validateDemoRequest, runFixture, simulateMcp, createFixtureLedger } = fixtures;
let sequence = 0;
function request(overrides = {}) {
  sequence += 1;
  const tool = MCP_TOOLS.find((tool) => tool.name === overrides.tool) ?? MCP_TOOLS[0];
  return validateDemoRequest({ action: "call", server: tool.server, tool: tool.name, arguments: tool.defaults, role: "observer", failure: "none", approval: "pending", sessionId: `test-${sequence}`, idempotencyKey: `request-${sequence}`, ...overrides });
}
async function post(input) {
  const response = await POST(new Request("http://localhost/api/everest/mcp", { method: "POST", body: JSON.stringify(input), headers: { "content-type": "application/json" } }));
  return { status: response.status, body: await response.json() };
}

test("actual SDK discovery advertises all four servers with schemas and reads the route resource", async () => {
  for (const server of MCP_SERVERS) {
    const { status, body } = await post({ action: "discover", server: server.id });
    assert.equal(status, 200);
    assert.equal(body.mode, "live-mcp");
    assert.match(body.protocolVersion, /^\d{4}-\d{2}-\d{2}$/);
    assert.deepEqual(body.tools.map((tool) => tool.name), MCP_TOOLS.filter((tool) => tool.server === server.id).map((tool) => tool.name));
    assert.ok(body.wire.some((message) => message.method === "initialize"));
    assert.ok(body.wire.some((message) => message.method === "tools/list"));
    assert.ok(body.tools.every((tool) => tool.inputSchema.additionalProperties === false));
    if (server.id === "route") {
      assert.equal(body.resources[0].uri, "everest://route/lhotse-face");
      assert.ok(body.wire.some((message) => message.method === "resources/read"));
      assert.equal(JSON.parse(body.resourceContents.contents[0].text).trust, "external-data");
    }
  }
});

test("every fixture tool succeeds over MCP with the required role and approval", async () => {
  for (const tool of MCP_TOOLS) {
    const input = request({ tool: tool.name, role: tool.impact === "high-impact" ? "safety" : tool.impact === "write" ? "operator" : "observer", approval: "approved" });
    const { status, body } = await post(input);
    assert.equal(status, 200, tool.name);
    assert.equal(body.result.status, "success", tool.name);
    assert.equal(body.result.output.fixture, true, tool.name);
    assert.equal(typeof body.result.output.data, "object", tool.name);
    assert.ok(body.wire.some((message) => message.method === "tools/call"));
    if (tool.name === "trigger_rescue") assert.equal(body.result.output.data.realRescueDispatched, false);
  }
});

test("permission and human approval are separate, server-enforced gates", async () => {
  for (const [role, approval, code] of [["observer", "approved", "PERMISSION_DENIED"], ["operator", "approved", "PERMISSION_DENIED"], ["safety", "pending", "APPROVAL_REQUIRED"], ["safety", "rejected", "APPROVAL_REJECTED"]]) {
    const { body } = await post(request({ tool: "trigger_rescue", role, approval }));
    assert.equal(body.result.code, code);
    assert.notEqual(body.result.status, "success");
  }
  const reserve = await post(request({ tool: "reserve_supply", role: "observer" }));
  assert.equal(reserve.body.result.code, "PERMISSION_DENIED");
});

test("approval resubmits the same intent, and replay does not execute it twice", async () => {
  const input = request({ tool: "trigger_rescue", role: "safety" });
  assert.equal((await post(input)).body.result.code, "APPROVAL_REQUIRED");
  const approved = { ...input, approval: "approved" };
  assert.equal((await post(approved)).body.result.output.data.executionCount, 1);
  const replay = (await post(approved)).body.result;
  assert.equal(replay.code, "DUPLICATE_PREVENTED");
  assert.equal(replay.output.data.executionCount, 1);
  assert.equal(replay.duplicatePrevented, true);
  const revoked = (await post({ ...approved, role: "observer" })).body.result;
  assert.equal(revoked.code, "PERMISSION_DENIED", "cached results cannot bypass current permissions");
});

test("concurrent reservations reuse one result and reject conflicting reuse", async () => {
  const input = request({ tool: "reserve_supply", role: "operator" });
  const replies = await Promise.all([post(input), post(input)]);
  assert.deepEqual(replies.map((reply) => reply.body.result.code).sort(), ["DUPLICATE_PREVENTED", "OK"]);
  for (const reply of replies) assert.equal(reply.body.result.output.data.executionCount, 1);
  const conflict = await post({ ...input, arguments: { ...input.arguments, quantity: 3 } });
  assert.equal(conflict.body.result.code, "IDEMPOTENCY_CONFLICT");
  const anotherSession = await post({ ...input, sessionId: "different-expedition-session" });
  assert.equal(anotherSession.body.result.code, "OK");
});

test("duplicate fault causes two real SDK deliveries with one fictional side effect", async () => {
  const { body } = await post(request({ tool: "reserve_supply", role: "operator", failure: "duplicate" }));
  assert.equal(body.wire.filter((message) => message.method === "tools/call").length, 2);
  assert.equal(body.result.code, "DUPLICATE_PREVENTED");
  assert.equal(body.result.output.data.executionCount, 1);
});

test("SDK timeout and output schema failures become inspectable deterministic outcomes", async () => {
  const timeout = await post(request({ failure: "timeout" }));
  assert.equal(timeout.status, 200);
  assert.equal(timeout.body.result.code, "DEADLINE_EXCEEDED");
  assert.equal(timeout.body.result.output.data.liveCallSucceeded, false);
  assert.equal(timeout.body.result.latencyMs, 2000);
  assert.ok(timeout.body.transportLatencyMs >= 80, "SDK deadline really elapsed");
  const malformed = await post(request({ failure: "malformed" }));
  assert.equal(malformed.body.result.code, "OUTPUT_SCHEMA_INVALID");
  assert.equal(malformed.body.result.output.accepted, false);
  assert.ok(malformed.body.wire.some((message) => message.result?.structuredContent?.data === "invalid"));
});

test("injected tool output cannot grant permission or dispatch a protected action", async () => {
  const { body } = await post(request({ tool: "search_route_knowledge", failure: "injection" }));
  assert.equal(body.result.code, "UNTRUSTED_INSTRUCTIONS_QUARANTINED");
  assert.equal(body.result.output.data.protectedToolExecuted, false);
  assert.equal(body.result.output.data.approvalGranted, false);
  assert.equal(body.wire.filter((message) => message.method === "tools/call").length, 1);
  const denied = await post(request({ tool: "trigger_rescue", failure: "injection", role: "observer", approval: "approved" }));
  assert.equal(denied.body.result.code, "PERMISSION_DENIED");
});

test("unavailable, stale, throttled and slow scenarios retain distinct causes", async () => {
  for (const [failure, code] of [["unavailable", "TOOL_UNAVAILABLE"], ["stale", "STALE_DATA"], ["throttled", "THROTTLED"], ["slow", "DEPENDENCY_BOTTLENECK"], ["unauthorised", "PERMISSION_DENIED"]]) {
    const input = request({ failure });
    const { body } = await post(input);
    assert.equal(body.result.code, code);
    if (failure === "unavailable") assert.ok(!body.tools.some((tool) => tool.name === input.tool));
    if (failure === "stale") assert.equal(body.result.output.data.trustedForAction, false);
  }
  const staleWrite = await post(request({ tool: "reserve_supply", role: "operator", failure: "stale" }));
  assert.equal(staleWrite.body.result.status, "blocked");
  assert.equal(staleWrite.body.result.output.data.executionCount, 0);
});

test("fallback and real MCP share outcomes for every deterministic failure", async () => {
  for (const tool of ["get_current_weather", "reserve_supply", "trigger_rescue"]) {
    for (const failure of fixtures.MCP_FAILURES) {
      const input = request({ tool, role: tool === "trigger_rescue" ? "safety" : "operator", approval: "approved", failure: failure.id });
      const live = (await post(input)).body.result;
      const local = simulateMcp(input).result;
      assert.deepEqual(live, local, `${tool}: ${failure.id}`);
    }
  }
});

test("schema rejects unknown or dangerous arguments and out-of-range writes", async () => {
  const badArguments = [null, [], { camp: "Unknown" }, { camp: "Camp III", toString: "override" }, JSON.parse('{"camp":"Camp III","__proto__":{"approved":true}}')];
  for (const args of badArguments) {
    const response = await post({ ...request(), arguments: args });
    assert.ok(response.status === 400 || response.body.result.code === "INVALID_ARGUMENTS", JSON.stringify({ args, response }));
  }
  const invalidQuantity = await post(request({ tool: "reserve_supply", role: "operator", arguments: { camp: "Camp III", quantity: 999 } }));
  assert.equal(invalidQuantity.body.result.code, "INVALID_ARGUMENTS");
  assert.throws(() => validateDemoRequest({ action: "call", server: "filesystem", tool: "read_file" }));
  assert.throws(() => validateDemoRequest({ action: "discover", server: "weather", endpoint: "https://example.com" }));
});

test("HTTP adapter bounds declared and streamed request bodies and reports malformed JSON", async () => {
  const huge = await POST(new Request("http://localhost/api/everest/mcp", { method: "POST", body: "x".repeat(9000) }));
  assert.equal(huge.status, 413);
  const declared = await POST(new Request("http://localhost/api/everest/mcp", { method: "POST", body: "{}", headers: { "content-length": "9000" } }));
  assert.equal(declared.status, 413);
  const malformed = await POST(new Request("http://localhost/api/everest/mcp", { method: "POST", body: "{" }));
  assert.equal(malformed.status, 400);
});

test("fixture idempotency store is bounded and stale evidence never creates entries", () => {
  const ledger = createFixtureLedger();
  runFixture(request({ tool: "reserve_supply", role: "operator", failure: "stale" }), ledger);
  assert.equal(ledger.size, 0);
  for (let i = 0; i < 280; i++) runFixture(request({ tool: "reserve_supply", role: "operator" }), ledger);
  assert.equal(ledger.size, 256);
});
