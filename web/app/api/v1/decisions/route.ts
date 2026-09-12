import { NextResponse } from "next/server";
import { getRuntime, parseAddress, serializeDecision } from "@/api/runtime";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: { code: "INVALID_JSON", message: "request body must be valid JSON" } }, { status: 400 }); }
  const body = input as Record<string, unknown>;
  const agentName = typeof body.agentName === "string" ? body.agentName.trim() : "";
  const capability = typeof body.capability === "string" ? body.capability : "";
  const agentAddress = parseAddress(body.agentAddress);
  if (!agentName || agentName.length > 120 || !capability || !agentAddress) {
    return NextResponse.json({ error: { code: "INVALID_INPUT", message: "agentName, capability, and a valid agentAddress are required" } }, { status: 400 });
  }
  const decision = await getRuntime().gate.evaluate(agentName, capability, agentAddress);
  return NextResponse.json(serializeDecision(decision), { status: decision.verdict === "ALLOW" ? 200 : 403 });
}
