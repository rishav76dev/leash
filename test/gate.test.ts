import { describe, expect, test } from "bun:test";
import { AuditLog } from "../src/audit/log.ts";
import { CredentialMinter } from "../src/gate/credential.ts";
import { LeashGate } from "../src/gate/gate.ts";
import { MeteredService } from "../src/service/metered.ts";

const address = "0x000000000000000000000000000000000000dEaD" as `0x${string}`;

function makeGate() {
  const minter = new CredentialMinter({ secret: "test-secret", ttlSeconds: 30 });
  const audit = new AuditLog();
  const client = {
    blockNumber: async () => 123n,
    ownerOf: async () => address,
    expiryOf: async () => 0n,
    checkRole: async () => ({ bitmap: 1n, held: true, detail: "role held", reverted: false }),
  };
  return { gate: new LeashGate({ client: client as never, resource: 1n, minter, audit }), minter, audit };
}

describe("LeashGate", () => {
  test("denies unknown capabilities without touching the chain", async () => {
    const { gate, audit } = makeGate();
    const result = await gate.evaluate("researcher", "unknown.action", address);
    expect(result.verdict).toBe("DENY");
    expect(result.code).toBe("UNKNOWN_CAPABILITY");
    expect(audit.summary().deny).toBe(1);
  });

  test("mints a capability-scoped credential for an allowed request", async () => {
    const { gate, minter } = makeGate();
    const result = await gate.evaluate("researcher", "inference.call", address);
    expect(result.verdict).toBe("ALLOW");
    expect(result.credential).toBeDefined();
    expect(minter.verify(result.credential!, "inference.call").ok).toBe(true);
    expect(minter.verify(result.credential!, "data.read").ok).toBe(false);
  });

  test("rejects a credential after live authority is revoked and consumes it once", async () => {
    let held = true;
    const minter = new CredentialMinter({ secret: "test-secret", ttlSeconds: 30 });
    const service = new MeteredService(minter, 0.001, async () => ({ ok: held, reason: "role revoked or absent" }));
    const token = minter.mint("researcher", address, "inference.call", 123n);
    held = false;
    const revoked = await service.handle("inference.call", token, { prompt: "hello" });
    expect(revoked.status).toBe(403);
    held = true;
    const used = await service.handle("inference.call", token, { prompt: "hello" });
    expect(used.status).toBe(403);
    expect(String(used.body.error)).toContain("already consumed");
  });
});
