/**
 * Short-lived, capability-scoped credentials.
 *
 * The point of the whole product: the agent never holds the upstream secret.
 * It holds a name. When it wants to act, the gate reads its authority from
 * the chain and — only if authorised — mints a token scoped to exactly one
 * capability, expiring in seconds.
 *
 * So a leaked credential is bounded in both scope and time, and revoking the
 * name stops new credentials from ever being minted.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export interface CredentialClaims {
  agent: string;
  agentAddress: string;
  capability: string;
  /** Block height the authority decision was pinned to. */
  block: string;
  /** Unix seconds. */
  expires: number;
}

export interface VerifyResult {
  ok: boolean;
  reason: string;
  claims?: CredentialClaims;
}

export class CredentialMinter {
  private readonly secret: Buffer;
  readonly ttlSeconds: number;
  private readonly consumed = new Set<string>();

  constructor(opts?: { secret?: string; ttlSeconds?: number }) {
    this.secret = Buffer.from(
      opts?.secret ?? randomBytes(32).toString("hex"),
      "utf8",
    );
    this.ttlSeconds = opts?.ttlSeconds ?? 30;
  }

  mint(agent: string, agentAddress: string, capability: string, block: bigint): string {
    const expires = Math.floor(Date.now() / 1000) + this.ttlSeconds;
    const payload = Buffer.from(JSON.stringify({ agent, agentAddress, capability, block: block.toString(), expires, nonce: randomBytes(16).toString("hex") })).toString("base64url");
    const sig = this.sign(payload);
    return `leash.${payload}.${sig}`;
  }

  /**
   * Verified by the protected service, which knows nothing about ENS.
   * It trusts the credential, not the caller.
   */
  verify(token: string, expectedCapability: string): VerifyResult {
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== "leash") {
      return { ok: false, reason: "malformed credential" };
    }
    const [, payload, sig] = parts as [string, string, string];

    const expect = this.sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expect);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: "bad signature (tampered or forged)" };
    }

    let claims: CredentialClaims;
    try {
      const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<CredentialClaims>;
      if (typeof parsed.agent !== "string" || typeof parsed.agentAddress !== "string" || typeof parsed.capability !== "string" || typeof parsed.block !== "string" || typeof parsed.expires !== "number") throw new Error("invalid claims");
      claims = { agent: parsed.agent, agentAddress: parsed.agentAddress, capability: parsed.capability, block: parsed.block, expires: parsed.expires };
    } catch {
      return { ok: false, reason: "malformed claims" };
    }

    if (claims.capability !== expectedCapability) {
      return {
        ok: false,
        reason: `credential is scoped to '${claims.capability}', not '${expectedCapability}'`,
      };
    }
    if (!Number.isFinite(claims.expires) || claims.expires < Math.floor(Date.now() / 1000)) {
      return { ok: false, reason: "credential expired" };
    }
    if (this.consumed.has(payload)) return { ok: false, reason: "credential already consumed" };

    return {
      ok: true,
      reason: `valid for ${claims.agent}`,
      claims,
    };
  }

  consume(token: string): boolean {
    const payload = token.split(".")[1];
    if (!payload || this.consumed.has(payload)) return false;
    this.consumed.add(payload);
    return true;
  }

  private sign(payload: string): string {
    return createHmac("sha256", this.secret)
      .update(payload)
      .digest("hex")
      .slice(0, 32);
  }
}
