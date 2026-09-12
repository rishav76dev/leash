import { AuditLog } from "../audit/log.ts";
import { CredentialMinter } from "../gate/credential.ts";
import { LeashGate } from "../gate/gate.ts";
import { MeteredService } from "../service/metered.ts";

const address = "0x000000000000000000000000000000000000dEaD" as `0x${string}`;
let held = true;
const minter = new CredentialMinter({ secret: "local-demo-secret", ttlSeconds: 30 });
const client = {
  blockNumber: async () => 100n,
  ownerOf: async () => address,
  expiryOf: async () => 0n,
  checkRole: async () => ({ bitmap: 1n << 24n, held, detail: held ? "role held" : "role revoked", reverted: !held }),
};
const audit = new AuditLog();
const gate = new LeashGate({ client: client as never, resource: 1n, minter, audit });
const service = new MeteredService(minter, 0.001, (capability, agentAddress) => gate.verifyCredential(capability, agentAddress as typeof address));

const allowed = await gate.evaluate("researcher", "inference.call", address);
const firstCall = await service.handle("inference.call", allowed.credential, { prompt: "hello leash" });
const tokenBeforeRevocation = await gate.evaluate("researcher", "inference.call", address);
held = false;
const revoked = await gate.evaluate("researcher", "inference.call", address);
const postRevokeCall = await service.handle("inference.call", tokenBeforeRevocation.credential, { prompt: "must fail" });

console.log(JSON.stringify({ allowed, firstCall, revoked, postRevokeCall, audit: audit.summary() }, (_, value) => typeof value === "bigint" ? value.toString() : value, 2));
