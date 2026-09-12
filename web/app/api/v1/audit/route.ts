import { NextResponse } from "next/server";
import { getRuntime } from "@/api/runtime";

export const runtime = "nodejs";

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("limit");
  const limit = Math.min(100, Math.max(1, Number(raw ?? 20) || 20));
  const rt = getRuntime();
  return NextResponse.json({ entries: rt.audit.tail(limit), summary: rt.audit.summary() });
}
