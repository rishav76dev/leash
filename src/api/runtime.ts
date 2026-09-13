import { isAddress, type Address, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { AuditLog } from "../audit/log.ts";
import { Ensv2Client } from "../chain/client.ts";
import { canonicalId, decodeRoleBitmap, CONTRACTS, SEPOLIA_CHAIN_ID } from "../chain/ensv2.ts";
import { CAPABILITIES, CAPABILITY_IDS } from "../gate/capabilities.ts";
import { CredentialMinter } from "../gate/credential.ts";
import { LeashGate, type Decision } from "../gate/gate.ts";
import { MeteredService } from "../service/metered.ts";

const ZERO_RESOURCE = 0n;

function configuredResource(): bigint {
  const raw = process.env.LEASH_RESOURCE_ID;
  if (!raw) return ZERO_RESOURCE;
  try {
    return raw.startsWith("0x") ? BigInt(raw) : BigInt(raw);
  } catch {
    return ZERO_RESOURCE;
  }
}

export interface LeashRuntime {
  readonly client: Ensv2Client;
  readonly audit: AuditLog;
  readonly minter: CredentialMinter;
  readonly gate: LeashGate;
  readonly service: MeteredService;
  readonly admin: Ensv2Client | null;
}

let runtime: LeashRuntime | undefined;

export function getRuntime(): LeashRuntime {
  if (runtime) return runtime;
  const configuredRegistry = process.env.LEASH_REGISTRY;
  const client = new Ensv2Client({
    registry: configuredRegistry && isAddress(configuredRegistry) ? configuredRegistry : undefined,
  });
  const audit = new AuditLog({ path: process.env.AUDIT_LOG_PATH });
  const minter = new CredentialMinter({
    secret: process.env.LEASH_CREDENTIAL_SECRET,
    ttlSeconds: Number(process.env.LEASH_CREDENTIAL_TTL ?? 30),
  });
  const gate = new LeashGate({
    client,
    resource: configuredResource(),
    resourceLabel: process.env.LEASH_RESOURCE_LABEL,
    minter,
    audit,
  });
  let admin: Ensv2Client | null = null;
  if (process.env.LEASH_ADMIN_ENABLED === "true" && process.env.PRIVATE_KEY) {
    try {
      const rawKey = process.env.PRIVATE_KEY.trim();
      const key = (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as Hex;
      admin = new Ensv2Client({ registry: client.registry }).withAccount(privateKeyToAccount(key));
    } catch {
      admin = null;
    }
  }
  runtime = { client, audit, minter, gate, service: new MeteredService(minter, 0.001, (capability, agentAddress) => gate.verifyCredential(capability, agentAddress as Address)), admin };
  return runtime;
}

export function parseAddress(value: unknown): Address | null {
  return typeof value === "string" && isAddress(value) ? value : null;
}

export function parseResource(value: string | undefined): bigint {
  if (!value) return getRuntime().gate.resource;
  try {
    return value.startsWith("0x") ? BigInt(value) : BigInt(value);
  } catch {
    return getRuntime().gate.resource;
  }
}

export function serializeDecision(decision: Decision) {
  return {
    ...decision,
    roleBitmap: decision.roleBitmap.toString(),
    block: decision.block?.toString() ?? null,
  };
}

export function serializeCapability() {
  return CAPABILITY_IDS.map((id) => {
    const capability = CAPABILITIES[id]!;
    return {
      ...capability,
      role: capability.role.toString(),
    };
  });
}

export function configSummary() {
  const rt = getRuntime();
  return {
    chainId: SEPOLIA_CHAIN_ID,
    registry: rt.client.registry,
    resource: rt.gate.resource.toString(),
    resourceLabel: rt.gate.resourceLabel,
    configured: rt.gate.resource !== ZERO_RESOURCE,
    contracts: { ethRegistry: CONTRACTS.ethRegistry },
  };
}

export function serializeAuthority(bitmap: bigint, report: Record<string, boolean>) {
  return { bitmap: bitmap.toString(), ...decodeRoleBitmap(bitmap), capabilities: report };
}

export function toCanonicalResource(label: string): string {
  return canonicalId(label).toString();
}
