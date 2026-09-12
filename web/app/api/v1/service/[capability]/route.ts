import { NextResponse } from "next/server";
import { getRuntime } from "@/api/runtime";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ capability: string }> }) {
  const { capability } = await context.params;
  let body: unknown = {};
  try { body = await request.json(); } catch { /* optional payload */ }
  const input = body as Record<string, unknown>;
  const credential = typeof input.credential === "string" ? input.credential : undefined;
  const payload = input.payload && typeof input.payload === "object" ? input.payload as Record<string, unknown> : undefined;
  const result = await getRuntime().service.handle(capability, credential, payload);
  return NextResponse.json(result.body, { status: result.status });
}
