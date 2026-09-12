import { NextResponse } from "next/server";
import { getRuntime, parseAddress, serializeAuthority } from "@/api/runtime";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ address: string }> }) {
  const { address: rawAddress } = await context.params;
  const address = parseAddress(rawAddress);
  if (!address) return NextResponse.json({ error: { code: "INVALID_ADDRESS", message: "address is not valid" } }, { status: 400 });
  const rt = getRuntime();
  const [owner, expiry, bitmap, report] = await Promise.all([
    rt.client.ownerOf(rt.gate.resource),
    rt.client.expiryOf(rt.gate.resource),
    rt.client.rolesOf(rt.gate.resource, address),
    rt.gate.capabilityReport(address),
  ]);
  return NextResponse.json({ address, resource: rt.gate.resource.toString(), owner, expiry: expiry.toString(), authority: serializeAuthority(bitmap, report) });
}
