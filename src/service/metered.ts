/**
 * The protected service.
 *
 * Deliberately knows nothing about ENS, EAC, or Leash's internals. It accepts
 * a credential, verifies signature + scope + expiry, meters the call, serves.
 *
 * That separation is the product argument: any service can sit behind the gate
 * without adopting our permission model. It trusts the credential, not the
 * caller.
 */

import { CAPABILITIES } from "../gate/capabilities.ts";
import type { CredentialMinter } from "../gate/credential.ts";

export interface ServiceResponse {
  status: 200 | 402 | 403;
  body: Record<string, unknown>;
}

export interface LedgerEntry {
  capability: string;
  units: number;
  costUsd: number;
  timestamp: number;
}

export class MeteredService {
  private readonly minter: CredentialMinter;
  readonly pricePerUnitUsd: number;
  private readonly liveAuthority?: (capability: string, agentAddress: string) => Promise<{ ok: boolean; reason: string }>;

  served = 0;
  refused = 0;
  unitsBilled = 0;
  readonly ledger: LedgerEntry[] = [];

  constructor(minter: CredentialMinter, pricePerUnitUsd = 0.001, liveAuthority?: (capability: string, agentAddress: string) => Promise<{ ok: boolean; reason: string }>) {
    this.minter = minter;
    this.pricePerUnitUsd = pricePerUnitUsd;
    this.liveAuthority = liveAuthority;
  }

  async handle(
    capability: string,
    credential: string | undefined,
    payload?: Record<string, unknown>,
  ): Promise<ServiceResponse> {
    if (!credential) {
      this.refused++;
      return {
        status: 403,
        body: { error: "no credential presented" },
      };
    }

    const v = this.minter.verify(credential, capability);
    if (!v.ok) {
      this.refused++;
      return {
        status: 403,
        body: { error: `credential rejected: ${v.reason}` },
      };
    }

    if (this.liveAuthority && v.claims) {
      const live = await this.liveAuthority(capability, v.claims.agentAddress);
      if (!live.ok) {
        this.minter.consume(credential);
        this.refused++;
        return { status: 403, body: { error: `credential rejected: ${live.reason}` } };
      }
    }
    if (!this.minter.consume(credential)) {
      this.refused++;
      return { status: 403, body: { error: "credential rejected: credential already consumed" } };
    }

    const cap = CAPABILITIES[capability];
    const units = cap?.units ?? 1;
    const cost = units * this.pricePerUnitUsd;

    this.served++;
    this.unitsBilled += units;
    this.ledger.push({
      capability,
      units,
      costUsd: round6(cost),
      timestamp: Date.now(),
    });

    return {
      status: 200,
      body: {
        capability,
        result: this.doWork(capability, payload),
        units,
        costUsd: round6(cost),
        billedTotalUsd: round6(this.unitsBilled * this.pricePerUnitUsd),
        agent: v.claims?.agent,
      },
    };
  }

  private doWork(
    capability: string,
    payload?: Record<string, unknown>,
  ): unknown {
    switch (capability) {
      case "inference.call": {
        const prompt = String(payload?.prompt ?? "(empty)");
        // Deterministic pseudo-score so demo output is reproducible.
        let h = 0;
        for (const ch of prompt) h = (h * 31 + ch.charCodeAt(0)) % 100000;
        return `score for ${JSON.stringify(prompt)} = 0.${String(h).padStart(5, "0").slice(0, 4)}`;
      }
      case "inference.batch": {
        const n = Array.isArray(payload?.prompts)
          ? (payload!.prompts as unknown[]).length
          : 0;
        return `batch of ${n} prompt(s) scored`;
      }
      case "data.read":
        return {
          feed: "eth-usd",
          value: 4412.55,
          asOf: Math.floor(Date.now() / 1000),
        };
      default:
        return "ok";
    }
  }

  receipt() {
    return {
      served: this.served,
      refused: this.refused,
      unitsBilled: this.unitsBilled,
      totalUsd: round6(this.unitsBilled * this.pricePerUnitUsd),
    };
  }
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}
