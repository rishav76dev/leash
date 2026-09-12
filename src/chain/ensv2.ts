/**
 * ENSv2 Sepolia beta — deployment addresses, EAC roles, ABIs.
 *
 * Every address and behavioural quirk in this file was verified against the
 * live chain on 2026-09-11, not read off a docs page.
 * See research/ensv2-sepolia-verification.md for the raw evidence.
 */

import { keccak256, toHex, type Address, type Hex } from "viem";

// ─────────────────────────────────────────────── deployment (Sepolia beta)

export const SEPOLIA_CHAIN_ID = 11155111;

export const CONTRACTS = {
  ethRegistry: "0xbdc85dd5b15d7ecb354cd7cb6f2c50b4f2c4f0e2",
  rootRegistry: "0x8115186e8f2e0b0281e86ab91f0f48ba90364354",
  userRegistryImpl: "0x624a25d67b59d587752ebec8dded8827dae52050",
  verifiableFactory: "0x10dc6333cdfe1fcef624c6e0a8221b91804cd7ef",
  ethRegistrar: "0xa88553f454b77203b0d036a05c894d555eaaa2cc",
  permissionedResolverImpl: "0x9eae5c2730a7dd16bdd1dee6421a1b91e3b0365e",
  ensV2Resolver: "0x508cb4e4596429ca98a1bb3112d88d18f92456b5",
  universalResolverV2: "0x4a1817d13e9cf196f471725176355c1234b63c70",
  /** Freely mintable test USDC — ETHRegistrar takes stablecoin, not ETH. */
  mockUSDC: "0x768f42455a2d082e23ceef7d51e5787c82d67a39",
  mockDAI: "0x5472c5725a00b7ba11f0794a79d08ade6f4683bd",
} as const satisfies Record<string, Address>;

export const RPC_URLS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc.sepolia.org",
  "https://sepolia.drpc.org",
] as const;

// ─────────────────────────────────────────────── Enhanced Access Control

/**
 * EAC packs 32 regular roles into bits 0..127 (one nybble each) and their
 * admin counterparts 128 bits higher. Verified live: a real name owner's
 * bitmap decoded to SET_RESOLVER + SET_SUBREGISTRY plus both admin roles.
 */
export const ROLES = {
  REGISTRAR: 1n << 0n,
  REGISTER_RESERVED: 1n << 4n,
  SET_PARENT: 1n << 8n,
  UNREGISTER: 1n << 12n,
  RENEW: 1n << 16n,
  SET_SUBREGISTRY: 1n << 20n,
  SET_RESOLVER: 1n << 24n,
  SET_URI: 1n << 36n,
  UPGRADE: 1n << 124n,
} as const;

export type RoleName = keyof typeof ROLES;

export const ADMIN_SHIFT = 128n;

/** ROOT_RESOURCE (0x0) means "the whole contract" — a master key. */
export const ROOT_RESOURCE = 0n;

export const ROLE_BY_VALUE: ReadonlyMap<bigint, RoleName> = new Map(
  Object.entries(ROLES).map(([k, v]) => [v, k as RoleName]),
);

/** Split a raw bitmap into readable role names. */
export function decodeRoleBitmap(bitmap: bigint): {
  regular: RoleName[];
  admin: RoleName[];
} {
  const regular: RoleName[] = [];
  const admin: RoleName[] = [];
  for (const [name, value] of Object.entries(ROLES) as [RoleName, bigint][]) {
    // value is a single set bit; its index is the nybble offset
    const shift = BigInt(value.toString(2).length - 1);
    if ((bitmap >> shift) & 0xfn) regular.push(name);
    if ((bitmap >> (shift + ADMIN_SHIFT)) & 0xfn) admin.push(name);
  }
  return { regular, admin };
}

// ─────────────────────────────────────────────── GOTCHA 1: canonical id

/**
 * The low 32 bits of a registry entry ID are a mutable version counter.
 * The canonical resource ID is the labelhash with those bits CLEARED.
 *
 * ⚠️  VERIFIED FOOTGUN — this cost an hour to find and would have cost a day
 * mid-build. Passing a raw labelhash to ownerOf() returns 0x0 *silently*,
 * which is indistinguishable from "this name is available". It is not an
 * error. It is a wrong answer that looks like a valid one.
 *
 * Proof: for a real registered name, ownerOf(canonicalId) returned exactly
 * the address from that name's mint event, while ownerOf(labelhash) → 0x0.
 */
const LOW_32_MASK = (1n << 256n) - 1n - 0xffffffffn;

export function canonicalId(label: string): bigint {
  const lh = BigInt(keccak256(toHex(label)));
  return lh & LOW_32_MASK;
}

/** Raw labelhash — kept only to demonstrate the trap in the verify output. */
export function rawLabelhash(label: string): bigint {
  return BigInt(keccak256(toHex(label)));
}

export function toResourceHex(id: bigint): Hex {
  return `0x${id.toString(16).padStart(64, "0")}`;
}

// ─────────────────────────────────────────────── ABIs

export const REGISTRY_ABI = [
  // --- reads
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "anyId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "getExpiry",
    stateMutability: "view",
    inputs: [{ name: "anyId", type: "uint256" }],
    outputs: [{ type: "uint64" }],
  },
  {
    type: "function",
    name: "getResolver",
    stateMutability: "view",
    inputs: [{ name: "anyId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "getSubregistry",
    stateMutability: "view",
    inputs: [{ name: "anyId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "getTokenId",
    stateMutability: "view",
    inputs: [{ name: "anyId", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getResource",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "roles",
    stateMutability: "view",
    inputs: [
      { name: "resource", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "hasRoles",
    stateMutability: "view",
    inputs: [
      { name: "resource", type: "uint256" },
      { name: "roleBitmap", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "hasRootRoles",
    stateMutability: "view",
    inputs: [
      { name: "roleBitmap", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  // --- writes
  {
    type: "function",
    name: "grantRoles",
    stateMutability: "nonpayable",
    inputs: [
      { name: "anyId", type: "uint256" },
      { name: "roleBitmap", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "revokeRoles",
    stateMutability: "nonpayable",
    inputs: [
      { name: "anyId", type: "uint256" },
      { name: "roleBitmap", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "register",
    stateMutability: "nonpayable",
    inputs: [
      { name: "label", type: "string" },
      { name: "owner", type: "address" },
      { name: "registry", type: "address" },
      { name: "resolver", type: "address" },
      { name: "roleBitmap", type: "uint256" },
      { name: "expiry", type: "uint64" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "setSubregistry",
    stateMutability: "nonpayable",
    inputs: [
      { name: "anyId", type: "uint256" },
      { name: "registry", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setResolver",
    stateMutability: "nonpayable",
    inputs: [
      { name: "anyId", type: "uint256" },
      { name: "resolver", type: "address" },
    ],
    outputs: [],
  },
  // --- events
  {
    type: "event",
    name: "EACRolesChanged",
    inputs: [
      { name: "resource", type: "uint256", indexed: true },
      { name: "account", type: "address", indexed: true },
      { name: "oldRoleBitmap", type: "uint256", indexed: false },
      { name: "newRoleBitmap", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "TransferSingle",
    inputs: [
      { name: "operator", type: "address", indexed: true },
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "id", type: "uint256", indexed: false },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
] as const;

// ─────────────────────────────────────────────── verified on-chain facts

/**
 * Real transactions on Sepolia, found by scanning EACRolesChanged events.
 * These are other people's transactions — cited as precedent that the
 * mechanism works in production, independent of anything we deploy.
 */
export const PRECEDENT = {
  fullRevoke: {
    block: 11642967n,
    tx: "0x2b3653d3710b14136fcbcf4d2dd754167dedcafe8630838ca205d329ccf960ab",
    oldBitmap:
      0x0000000000000000000000001110000000000000000000000000000001100000n,
    newBitmap: 0x0n,
  },
  /**
   * THE money shot. One role removed, the rest retained, single transaction.
   * This is the "narrower re-grant" beat of the demo, already on chain.
   */
  partialRevoke: {
    block: 11647965n,
    tx: "0x4e2ea89c95279d5e551ef228acc77d37f99bdfa2c74183af4690b82a89776b81",
    oldBitmap:
      0x0000000000000000000000001110000000000000000000000000000001100000n,
    newBitmap:
      0x0000000000000000000000001110000000000000000000000000000001000000n,
  },
} as const;

/**
 * A real registered ENSv2 name discovered by scanning mint events. Used by
 * `bun run verify` to prove the canonical-ID mask is correct without needing
 * us to own anything.
 */
export const KNOWN_NAME = {
  canonicalId:
    0x8af93ff8ff9822652bee13d5aa2ae120032dafea15021a81716ae3b100000000n,
  owner: "0x05fda3609a772d3b07e8bdcd568a5d78132a46b7" as Address,
} as const;

export const EXPLORER = "https://sepolia.etherscan.io";
