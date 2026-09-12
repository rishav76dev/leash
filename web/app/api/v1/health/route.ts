import { NextResponse } from "next/server";
import { configSummary, getRuntime } from "@/api/runtime";

export const runtime = "nodejs";

export async function GET() {
  const rt = getRuntime();
  let chain: { ok: boolean; chainId?: number; block?: string; error?: string };
  try {
    chain = { ok: true, chainId: await rt.client.chainId(), block: (await rt.client.blockNumber()).toString() };
  } catch (error) {
    chain = { ok: false, error: String(error).slice(0, 160) };
  }
  return NextResponse.json({ ...configSummary(), chain });
}
