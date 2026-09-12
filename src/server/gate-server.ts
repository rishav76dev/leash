import { getRuntime, parseAddress, serializeDecision, configSummary, serializeCapability } from "../api/runtime.ts";

const rt = getRuntime();
const server = Bun.serve({
  port: Number(process.env.PORT ?? 8787),
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return Response.json({ ok: true, chainId: await rt.client.chainId().catch(() => null), config: configSummary() });
    }
    if (url.pathname === "/capabilities") {
      return Response.json({ capabilities: serializeCapability() });
    }
    if (url.pathname === "/decision" && request.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = (await request.json()) as Record<string, unknown>;
      } catch {
        return Response.json({ error: { code: "INVALID_JSON", message: "request body must be valid JSON" } }, { status: 400 });
      }
      const agentAddress = parseAddress(body.agentAddress);
      if (!agentAddress || typeof body.capability !== "string" || !body.capability) {
        return Response.json({ error: { code: "INVALID_INPUT", message: "capability and a valid agentAddress are required" } }, { status: 400 });
      }
      const result = await rt.gate.evaluate(String(body.agentName ?? "agent"), body.capability, agentAddress);
      // serializeDecision converts the bigint roleBitmap/block to strings.
      return Response.json(serializeDecision(result), { status: result.verdict === "ALLOW" ? 200 : 403 });
    }
    return Response.json({ error: "not found" }, { status: 404 });
  },
});
console.log(`Leash gate listening on http://localhost:${server.port}`);
