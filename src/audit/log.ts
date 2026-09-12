/**
 * Append-only decision log.
 *
 * Shaped like Hedera's HCS: an ordered stream of immutable messages. When
 * Hedera credentials are present, each decision is also submitted to a real
 * HCS topic for a consensus timestamp.
 *
 * Note what we do NOT need to build: the registry already emits
 * EACRolesChanged(resource, account, oldBitmap, newBitmap) on every grant and
 * revoke, so the authority-change trail is on-chain and free. This log records
 * the *decisions made against* that authority.
 */

import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { Decision } from "../gate/gate.ts";

export interface AuditEntry {
  seq: number;
  verdict: string;
  code: string;
  agent: string;
  agentAddress: string;
  capability: string;
  reason: string;
  roleBitmap: string;
  block: string | null;
  latencyMs: number;
  timestamp: number;
  reverted: boolean;
  hcs?: unknown;
}

export interface HcsSink {
  readonly enabled: boolean;
  readonly topicId?: string;
  submit(entry: AuditEntry): Promise<unknown>;
}

export class AuditLog {
  readonly entries: AuditEntry[] = [];
  private readonly path?: string;
  private readonly hcs?: HcsSink;
  private pending: Promise<void> = Promise.resolve();

  constructor(opts?: { path?: string; hcs?: HcsSink }) {
    this.path = opts?.path;
    this.hcs = opts?.hcs;
    if (this.path) mkdirSync(dirname(this.path), { recursive: true });
  }

  record(d: Decision): AuditEntry {
    const entry: AuditEntry = {
      seq: this.entries.length + 1,
      verdict: d.verdict,
      code: d.code,
      agent: d.agent,
      agentAddress: d.agentAddress,
      capability: d.capability,
      reason: d.reason,
      roleBitmap: `0x${d.roleBitmap.toString(16)}`,
      block: d.block === null ? null : d.block.toString(),
      latencyMs: d.latencyMs,
      timestamp: d.timestamp,
      reverted: d.reverted,
    };
    this.entries.push(entry);

    if (this.path) {
      appendFileSync(this.path, JSON.stringify(entry) + "\n");
    }

    // HCS submission is fire-and-forget so it never adds latency to a
    // permission decision. The local stream is the source of truth.
    if (this.hcs?.enabled) {
      this.pending = this.pending.then(async () => {
        try {
          entry.hcs = await this.hcs!.submit(entry);
        } catch (e) {
          entry.hcs = { error: String(e).slice(0, 120) };
        }
      });
    }

    return entry;
  }

  /** Wait for any in-flight HCS submissions. */
  async flush(): Promise<void> {
    await this.pending;
  }

  tail(n = 10): AuditEntry[] {
    return this.entries.slice(-n);
  }

  summary() {
    const allow = this.entries.filter((e) => e.verdict === "ALLOW").length;
    const deny = this.entries.length - allow;
    const lat = this.entries.map((e) => e.latencyMs).sort((a, b) => a - b);
    return {
      total: this.entries.length,
      allow,
      deny,
      medianLatencyMs: lat.length
        ? lat[Math.floor(lat.length / 2)]!
        : 0,
    };
  }
}
