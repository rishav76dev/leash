/**
 * The Leash gate.
 *
 * An agent asks to do something. The gate resolves the agent's authority from
 * the ENSv2 registry, and either mints a scoped credential or refuses.
 *
 * Design rule, forced on us by what the live chain actually returns:
 *
 *     A caller with no roles cannot be distinguished from a broken call,
 *     so both must mean NO.
 *
 * Every failure path in this file lands on DENY. That is not defensive
 * programming around a papercut — it is the only sound reading of a registry
 * whose permission check reverts instead of returning false.
 */

import type { Address } from "viem";
import { Ensv2Client } from "../chain/client.ts";
import { decodeRoleBitmap, toResourceHex } from "../chain/ensv2.ts";
import { getCapability, USED_ROLES } from "./capabilities.ts";
import { CredentialMinter } from "./credential.ts";
import type { AuditLog } from "../audit/log.ts";

export type Verdict = "ALLOW" | "DENY";

export interface Decision {
  verdict: Verdict;
  agent: string;
  agentAddress: Address;
  capability: string;
  /** Machine-readable reason code — stable, greppable, safe to assert on. */
  code: DenyCode | "AUTHORISED";
  /** Human sentence for the demo and the audit trail. */
  reason: string;
  /** Raw EAC bitmap at decision time. */
  roleBitmap: bigint;
  /** Block height the decision was pinned to. */
  block: bigint | null;
  credential?: string;
  latencyMs: number;
  timestamp: number;
  /** True when the chain reverted rather than returning false. */
  reverted: boolean;
}

export type DenyCode =
  | "UNKNOWN_CAPABILITY"
  | "CHAIN_UNREACHABLE"
  | "NAME_NOT_REGISTERED"
  | "NAME_EXPIRED"
  | "ROLE_NOT_HELD"
  | "NO_ROLES_ON_RESOURCE"

export interface GateOptions {
  client: Ensv2Client;
  /**
   * The EAC resource authority is read against — a canonical ENSv2 resource
   * ID. This is the fix for the earlier design: the gate is keyed by resource,
   * not by label, because the registry itself is keyed by resource.
   */
  resource: bigint;
  /** Display label for the resource, e.g. "myfleet.eth". */
  resourceLabel?: string;
  minter?: CredentialMinter;
  audit?: AuditLog;
}

export class LeashGate {
  private readonly client: Ensv2Client;
  readonly resource: bigint;
  readonly resourceLabel: string;
  readonly minter: CredentialMinter;
  private readonly audit?: AuditLog;

  checks = 0;

  constructor(opts: GateOptions) {
    this.client = opts.client;
    this.resource = opts.resource;
    this.resourceLabel = opts.resourceLabel ?? toResourceHex(opts.resource);
    this.minter = opts.minter ?? new CredentialMinter();
    this.audit = opts.audit;
  }

  /**
   * The core call. Returns a Decision; never throws.
   *
   * @param agentName  display name, e.g. "researcher"
   * @param capability capability id, e.g. "inference.call"
   * @param agentAddress the address the agent signs with
   */
  async evaluate(
    agentName: string,
    capability: string,
    agentAddress: Address,
  ): Promise<Decision> {
    const t0 = performance.now();
    this.checks++;

    const finish = (
      verdict: Verdict,
      code: Decision["code"],
      reason: string,
      extra: Partial<Decision> = {},
    ): Decision => {
      const d: Decision = {
        verdict,
        agent: agentName,
        agentAddress,
        capability,
        code,
        reason,
        roleBitmap: extra.roleBitmap ?? 0n,
        block: extra.block ?? null,
        latencyMs: Math.round((performance.now() - t0) * 10) / 10,
        timestamp: Date.now(),
        reverted: extra.reverted ?? false,
        ...extra,
      };
      this.audit?.record(d);
      return d;
    };

    // 1. Is this a capability we recognise?
    const cap = getCapability(capability);
    if (!cap) {
      return finish(
        "DENY",
        "UNKNOWN_CAPABILITY",
        `unknown capability '${capability}'`,
      );
    }

    // 2. Pin the decision to a block so it is auditable and reproducible.
    let block: bigint;
    try {
      block = await this.client.blockNumber();
    } catch {
      return finish(
        "DENY",
        "CHAIN_UNREACHABLE",
        "chain unreachable — failing closed",
      );
    }

    // 3. Does the authority resource still exist?
    const owner = await this.client.ownerOf(this.resource);
    if (BigInt(owner) === 0n) {
      return finish(
        "DENY",
        "NAME_NOT_REGISTERED",
        `authority resource ${this.resourceLabel} is not registered`,
        { block },
      );
    }

    const expiry = await this.client.expiryOf(this.resource);
    if (expiry > 0n && expiry < BigInt(Math.floor(Date.now() / 1000))) {
      return finish(
        "DENY",
        "NAME_EXPIRED",
        `authority resource expired at ${expiry}`,
        { block },
      );
    }

    // 4. THE CHECK.
    const check = await this.client.checkRole(
      this.resource,
      cap.role,
      agentAddress,
      // deliberately not pinned to `block`: we want the freshest possible
      // answer, so a revocation bites on the very next call.
    );

    if (!check.held) {
      return finish(
        "DENY",
        check.reverted ? "NO_ROLES_ON_RESOURCE" : "ROLE_NOT_HELD",
        `${check.detail}; '${capability}' requires ROLE_${cap.roleName}`,
        { block, roleBitmap: check.bitmap, reverted: check.reverted },
      );
    }

    // 5. Authorised. Mint a credential scoped to exactly this capability.
    const credential = this.minter.mint(agentName, agentAddress, capability, block);
    return finish(
      "ALLOW",
      "AUTHORISED",
      `holds ROLE_${cap.roleName}; credential scoped to '${capability}', ttl ${this.minter.ttlSeconds}s`,
      { block, roleBitmap: check.bitmap, credential },
    );
  }

  /** Re-check live authority immediately before a credential is consumed. */
  async verifyCredential(capability: string, agentAddress: Address) {
    const cap = getCapability(capability);
    if (!cap) return { ok: false, reason: "unknown capability" };
    const owner = await this.client.ownerOf(this.resource);
    if (BigInt(owner) === 0n) return { ok: false, reason: "authority resource is not registered" };
    const expiry = await this.client.expiryOf(this.resource);
    if (expiry > 0n && expiry < BigInt(Math.floor(Date.now() / 1000))) return { ok: false, reason: "authority resource expired" };
    const check = await this.client.checkRole(this.resource, cap.role, agentAddress);
    return check.held ? { ok: true, reason: "live role held" } : { ok: false, reason: check.reverted ? "role revoked or absent" : "role not held" };
  }

  /** Which capabilities does this agent hold right now? For the demo table. */
  async capabilityReport(
    agentAddress: Address,
  ): Promise<Record<string, boolean>> {
    return this.client.roleReport(this.resource, agentAddress, USED_ROLES);
  }

  /** Decode the agent's current authority into readable role names. */
  async describeAuthority(agentAddress: Address) {
    const bitmap = await this.client.rolesOf(this.resource, agentAddress);
    return { bitmap, ...decodeRoleBitmap(bitmap) };
  }
}
