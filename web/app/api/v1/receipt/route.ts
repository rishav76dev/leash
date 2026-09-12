import { NextResponse } from "next/server";
import { getRuntime } from "@/api/runtime";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(getRuntime().service.receipt());
}
