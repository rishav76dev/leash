import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getRuntime, parseAddress, serializeDecision } from "../api/runtime.ts";
import { serializeCapability } from "../api/runtime.ts";

const server = new McpServer({ name: "leash-agent", version: "0.1.0" });
const rt = getRuntime();

server.registerTool("leash_capabilities", { description: "List capabilities and their ENSv2 role requirements." }, async () => ({
  content: [{ type: "text", text: JSON.stringify(serializeCapability()) }],
}));

server.registerTool("leash_check_authority", {
  description: "Evaluate an agent's live ENSv2 authority and return a scoped credential when allowed.",
  inputSchema: { agentName: z.string().min(1), agentAddress: z.string(), capability: z.string() },
}, async ({ agentName, agentAddress, capability }) => {
  const address = parseAddress(agentAddress);
  if (!address) return { isError: true, content: [{ type: "text", text: "invalid agent address" }] };
  const decision = await rt.gate.evaluate(agentName, capability, address);
  return { isError: decision.verdict === "DENY", content: [{ type: "text", text: JSON.stringify(serializeDecision(decision)) }] };
});

await server.connect(new StdioServerTransport());
