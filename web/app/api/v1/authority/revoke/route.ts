import { NextResponse } from "next/server";
import { getRuntime, parseAddress } from "@/api/runtime";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rt = getRuntime();
  if (!rt.admin || process.env.LEASH_ADMIN_ENABLED !== "true") {
    return NextResponse.json({ error: { code: "ADMIN_DISABLED", message: "server-side role writes are disabled" } }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: { code: "INVALID_JSON", message: "request body must be valid JSON" } }, { status: 400 }); }
  const account = parseAddress(body.account);
  if (!account || (typeof body.roleBitmap !== "string" && typeof body.roleBitmap !== "number")) {
    return NextResponse.json({ error: { code: "INVALID_INPUT", message: "account and roleBitmap are required" } }, { status: 400 });
  }
  let roleBitmap: bigint;
  try { roleBitmap = BigInt(body.roleBitmap as string | number); } catch { return NextResponse.json({ error: { code: "INVALID_ROLE", message: "roleBitmap must be an integer" } }, { status: 400 }); }
  if (roleBitmap <= 0n) return NextResponse.json({ error: { code: "INVALID_ROLE", message: "roleBitmap must be positive" } }, { status: 400 });
  const hash = await rt.admin.revokeRoles(rt.gate.resource, roleBitmap, account);
  return NextResponse.json({ hash, resource: rt.gate.resource.toString(), account, roleBitmap: roleBitmap.toString() });
}
