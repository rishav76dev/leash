/**
 * Capability map.
 *
 * Leash does not invent a permission system. It reuses the one ENSv2 already
 * enforces on names. Each product capability is bound to a real Enhanced
 * Access Control role that exists in the deployed registry.
 *
 * This mapping is declared here, printed by the demo, and exposed over MCP —
 * so nobody has to trust that it is honest. You can read the role straight
 * off the chain and check it yourself.
 */

import { ROLES, type RoleName } from "../chain/ensv2.ts";

export interface Capability {
  /** Stable identifier the agent asks for. */
  id: string;
  /** The EAC role that authorises it. */
  role: bigint;
  roleName: RoleName;
  /** Human description, shown in the demo and the MCP tool schema. */
  description: string;
  /** Metering weight — how many units one call costs. */
  units: number;
  /** True for capabilities that move value; these are the irreversible ones. */
  irreversible: boolean;
}

export const CAPABILITIES: Record<string, Capability> = {
  "inference.call": {
    id: "inference.call",
    role: ROLES.SET_RESOLVER,
    roleName: "SET_RESOLVER",
    description: "Call the metered inference endpoint",
    units: 1,
    irreversible: false,
  },
  "inference.batch": {
    id: "inference.batch",
    role: ROLES.SET_SUBREGISTRY,
    roleName: "SET_SUBREGISTRY",
    description: "Submit a batch inference job",
    units: 10,
    irreversible: false,
  },
  "data.read": {
    id: "data.read",
    role: ROLES.RENEW,
    roleName: "RENEW",
    description: "Read from the metered data feed",
    units: 1,
    irreversible: false,
  },
  "treasury.spend": {
    id: "treasury.spend",
    role: ROLES.UNREGISTER,
    roleName: "UNREGISTER",
    description: "Move funds from the fleet treasury",
    units: 0,
    irreversible: true,
  },
};

export const CAPABILITY_IDS = Object.keys(CAPABILITIES);

export function getCapability(id: string): Capability | undefined {
  return CAPABILITIES[id];
}

/** Roles referenced by the capability map, for a one-shot role report. */
export const USED_ROLES: RoleName[] = [
  ...new Set(Object.values(CAPABILITIES).map((c) => c.roleName)),
];
