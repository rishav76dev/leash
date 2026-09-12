import { NextResponse } from "next/server";
import { serializeCapability } from "@/api/runtime";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ capabilities: serializeCapability() });
}
