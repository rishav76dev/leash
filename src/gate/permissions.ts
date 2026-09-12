/**
 * Application permission bits.
 *
 * ── Why this file exists ──────────────────────────────────────────────────
 *
 * ENSv2's Enhanced Access Control stores a uint256 bitmap per
 * (resource, account), and `hasRoles(resource, bitmap, account)` answers one
 * question: does this account hold ALL of these bits?
 *
 * The registry only *acts* on the bits it knows about — SET_RESOLVER,
 * SET_SUBREGISTRY, UNREGISTER, and so on. Those bits are real authority over
 * a name.
 *
 * An earlier revision of this project mapped product capabilities straight
 * onto those administrative bits. That was wrong, and wrong in a way that
 * mattered: authorising `inference.call` by setting SET_RESOLVER on
 * `leash.eth` also handed the agent the genuine, on-chain power to repoint
 * that name's resolver — and therefore to serve forged records for it.
 *
 * ── What we do instead ────────────────────────────────────────────────────
 *
 * Leash uses bits that no deployed registry function reads. An agent holding
 * them cannot do anything to the name. They are what we actually wanted from
 * ENSv2 in the first place: a general-purpose, on-chain, revocable permission
 * bitmap that fails closed.
 *
 * Two independent defences, so that neither one alone is load-bearing:
 *
 *   1. BIT SEPARATION — application capabilities use nybbles the registry
 *      never inspects. Enforced by assertNoRoleCollision().
 *   2. RESOURCE ISOLATION — authority is granted on a dedicated per-agent
 *      resource, never on the operational name. See namespace.ts.
 *
 * Residual risk, stated plainly: these nybbles are *unassigned*, not
 * *reserved*. A future ENSv2 release could assign one. That is exactly why
 * defence 2 exists, and why `bun run permissions` re-checks for collisions
 * against the role table on every run.
 */

import { ROLES, type RoleName } from "../chain/ensv2.ts";

/** Which of the 32 nybbles the deployed contracts are known to read. */
const ASSIGNED_NYBBLES: ReadonlyMap<number, RoleName> = new Map(
  (Object.entries(ROLES) as [RoleName, bigint][]).map(([name, value]) => [
    Number(value.toString(2).length - 1) / 4,
    name,
  ]),
);

/**
 * Nybble 24 onward: the highest unassigned range below the admin half
 * (nybble 32+), and far from the low nybbles where ENS assigns roles.
 *
 * Bit = nybble * 4. So nybble 24 → bit 96.
 */
const APP_NYBBLE_BASE = 24;

/** One set bit per capability. Index i → nybble APP_NYBBLE_BASE + i. */
export function appBit(index: number): bigint {
  const nybble = APP_NYBBLE_BASE + index;
  if (nybble >= 32) {
    throw new Error(
      `application permission index ${index} overflows into the admin half — max is ${31 - APP_NYBBLE_BASE}`,
    );
  }
  return 1n << BigInt(nybble * 4);
}

export interface AppPermission {
  /** Set bit, unique per capability. */
  bit: bigint;
  /** Nybble index it occupies — printed so it can be checked by hand. */
  nybble: number;
  bitIndex: number;
}

export const APP_PERMISSIONS: Record<string, AppPermission> = {};

function define(id: string, index: number): AppPermission {
  const bit = appBit(index);
  const bitIndex = Number(bit.toString(2).length - 1);
  const perm = { bit, nybble: bitIndex / 4, bitIndex };
  APP_PERMISSIONS[id] = perm;
  return perm;
}

/**
 * The capability registry. Order is stable: it fixes the bit assignment, so
 * appending is safe but reordering would silently re-map live permissions.
 */
export const APP_PERMISSION_ORDER = [
  "inference.call",
  "inference.batch",
  "data.read",
  "treasury.spend",
] as const;

APP_PERMISSION_ORDER.forEach((id, i) => define(id, i));

/**
 * Collision guard. Throws if any application bit overlaps a bit the deployed
 * registry reads — i.e. if a product capability could ever double as real
 * authority over a name.
 *
 * Called at module load, so a collision is a build-time failure rather than a
 * security bug that ships.
 */
export function assertNoRoleCollision(): void {
  for (const [id, perm] of Object.entries(APP_PERMISSIONS)) {
    for (const [name, roleBit] of Object.entries(ROLES) as [RoleName, bigint][]) {
      const shift = BigInt(roleBit.toString(2).length - 1);
      // Compare nybbles, not exact bits: EAC treats each nybble as one role
      // slot, so sharing a nybble with an ENS role is already a collision.
      const roleNybble = Number(shift) / 4;
      if (perm.nybble === roleNybble) {
        throw new Error(
          `permission '${id}' occupies nybble ${perm.nybble}, which ENSv2 assigns to ${name}. ` +
            `Granting '${id}' would grant real authority over the name.`,
        );
      }
      // Admin counterparts sit 128 bits higher; same nybble check applies.
      if (perm.nybble === roleNybble + 32) {
        throw new Error(
          `permission '${id}' collides with the admin counterpart of ${name}.`,
        );
      }
    }
  }
}

/** Human-readable report for `bun run permissions` and the audit trail. */
export function permissionModelReport() {
  return {
    scheme: "application-bits on isolated authority resources",
    nybbleBase: APP_NYBBLE_BASE,
    assignedNybbleCount: ASSIGNED_NYBBLES.size,
    permissions: Object.entries(APP_PERMISSIONS).map(([id, p]) => ({
      id,
      nybble: p.nybble,
      bitIndex: p.bitIndex,
      bit: p.bit.toString(),
      hex: `0x${p.bit.toString(16)}`,
    })),
    collisions: [] as string[],
  };
}

assertNoRoleCollision();
