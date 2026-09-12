/**
 * ENSv2 registry client.
 *
 * Two verified on-chain behaviours shape this entire file:
 *
 *   1. Entries are keyed by canonical ID (labelhash with low 32 bits cleared).
 *      A raw labelhash returns 0x0 silently. See canonicalId() in ensv2.ts.
 *
 *   2. A permission check for an account holding no roles REVERTS. It does
 *      not return false. Tested 3x consecutively against live Sepolia, fully
 *      deterministic. Therefore every error path here lands on DENY.
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
  type Account,
} from "viem";
import { sepolia } from "viem/chains";
import {
  CONTRACTS,
  REGISTRY_ABI,
  RPC_URLS,
  toResourceHex,
  type RoleName,
  ROLES,
} from "./ensv2.ts";

export interface RoleReadResult {
  /** Raw bitmap. 0n if the read reverted (i.e. no roles). */
  bitmap: bigint;
  /** True only if the chain affirmatively said yes. */
  held: boolean;
  /** Why we concluded what we concluded — surfaced in the audit log. */
  detail: string;
  /** Set when the underlying call reverted rather than returning false. */
  reverted: boolean;
}

export class Ensv2Client {
  readonly pub: PublicClient;
  readonly registry: Address;
  private wallet?: WalletClient;

  constructor(opts?: { rpcUrl?: string; registry?: Address }) {
    this.registry = opts?.registry ?? CONTRACTS.ethRegistry;
    this.pub = createPublicClient({
      chain: sepolia,
      transport: http(opts?.rpcUrl ?? process.env.LEASH_RPC_URL ?? RPC_URLS[0]),
    });
  }

  withAccount(account: Account, rpcUrl?: string): this {
    this.wallet = createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl ?? process.env.LEASH_RPC_URL ?? RPC_URLS[0]),
    });
    return this;
  }

  // ───────────────────────────────────────────────────────────── reads

  async blockNumber(): Promise<bigint> {
    return this.pub.getBlockNumber();
  }

  async chainId(): Promise<number> {
    return this.pub.getChainId();
  }

  async bytecodeSize(address: Address): Promise<number> {
    const code = await this.pub.getCode({ address });
    return code ? (code.length - 2) / 2 : 0;
  }

  /** Owner of a resource. Returns the zero address on revert. */
  async ownerOf(resource: bigint, blockNumber?: bigint): Promise<Address> {
    try {
      const tokenId = await this.tokenIdFor(resource, blockNumber);
      return (await this.pub.readContract({
        address: this.registry,
        abi: REGISTRY_ABI,
        functionName: "ownerOf",
        args: [tokenId],
        ...(blockNumber !== undefined ? { blockNumber } : {}),
      })) as Address;
    } catch {
      return "0x0000000000000000000000000000000000000000";
    }
  }

  async expiryOf(resource: bigint, blockNumber?: bigint): Promise<bigint> {
    try {
      const tokenId = await this.tokenIdFor(resource, blockNumber);
      return (await this.pub.readContract({
        address: this.registry,
        abi: REGISTRY_ABI,
        functionName: "getExpiry",
        args: [tokenId],
        ...(blockNumber !== undefined ? { blockNumber } : {}),
      })) as bigint;
    } catch {
      return 0n;
    }
  }

  /** ENSv2 role resources are canonical IDs; ownership is stored on mutable token IDs. */
  private async tokenIdFor(resource: bigint, blockNumber?: bigint): Promise<bigint> {
    try {
      return (await this.pub.readContract({
        address: this.registry,
        abi: REGISTRY_ABI,
        functionName: "getTokenId",
        args: [resource],
        ...(blockNumber !== undefined ? { blockNumber } : {}),
      })) as bigint;
    } catch {
      return resource;
    }
  }

  /** Raw role bitmap for an account on a resource. 0n on revert. */
  async rolesOf(
    resource: bigint,
    account: Address,
    blockNumber?: bigint,
  ): Promise<bigint> {
    try {
      return (await this.pub.readContract({
        address: this.registry,
        abi: REGISTRY_ABI,
        functionName: "roles",
        args: [resource, account],
        ...(blockNumber !== undefined ? { blockNumber } : {}),
      })) as bigint;
    } catch {
      return 0n;
    }
  }

  /**
   * GOTCHA 2 — fail closed.
   *
   * On chain, hasRoles() reverts for an account with no roles rather than
   * returning false. So a revert is not an infrastructure problem to retry
   * past; it is the chain's way of saying "this account holds nothing".
   *
   * An account with no roles is indistinguishable from a broken call,
   * so both must mean NO.
   */
  async checkRole(
    resource: bigint,
    role: bigint,
    account: Address,
    blockNumber?: bigint,
  ): Promise<RoleReadResult> {
    const bitmap = await this.rolesOf(resource, account, blockNumber);
    try {
      const held = (await this.pub.readContract({
        address: this.registry,
        abi: REGISTRY_ABI,
        functionName: "hasRoles",
        args: [resource, role, account],
        ...(blockNumber !== undefined ? { blockNumber } : {}),
      })) as boolean;
      return {
        bitmap,
        held,
        reverted: false,
        detail: held ? "role held" : "role not held",
      };
    } catch (e) {
      return {
        bitmap,
        held: false,
        reverted: true,
        detail: "hasRoles() reverted — account holds no roles on this resource",
      };
    }
  }

  /** Which of the named roles does this account hold right now? */
  async roleReport(
    resource: bigint,
    account: Address,
    roles: readonly RoleName[],
  ): Promise<Record<string, boolean>> {
    const out: Record<string, boolean> = {};
    for (const name of roles) {
      const r = await this.checkRole(resource, ROLES[name], account);
      out[name] = r.held;
    }
    return out;
  }

  async eacRoleChanges(fromBlock: bigint, toBlock: bigint) {
    return this.pub.getContractEvents({
      address: this.registry,
      abi: REGISTRY_ABI,
      eventName: "EACRolesChanged",
      fromBlock,
      toBlock,
    });
  }

  // ───────────────────────────────────────────────────────────── writes

  private requireWallet(): WalletClient {
    if (!this.wallet) {
      throw new Error(
        "no wallet configured — call withAccount() and set PRIVATE_KEY",
      );
    }
    return this.wallet;
  }

  async grantRoles(
    resource: bigint,
    roleBitmap: bigint,
    account: Address,
  ): Promise<Hex> {
    const w = this.requireWallet();
    return w.writeContract({
      address: this.registry,
      abi: REGISTRY_ABI,
      functionName: "grantRoles",
      args: [resource, roleBitmap, account],
      chain: sepolia,
      account: w.account!,
    });
  }

  async revokeRoles(
    resource: bigint,
    roleBitmap: bigint,
    account: Address,
  ): Promise<Hex> {
    const w = this.requireWallet();
    return w.writeContract({
      address: this.registry,
      abi: REGISTRY_ABI,
      functionName: "revokeRoles",
      args: [resource, roleBitmap, account],
      chain: sepolia,
      account: w.account!,
    });
  }

  async waitForTx(hash: Hex) {
    return this.pub.waitForTransactionReceipt({ hash });
  }

  /** Simulate a write without sending it — used to prove the write path. */
  async simulateGrant(
    resource: bigint,
    roleBitmap: bigint,
    account: Address,
    from: Address,
  ) {
    return this.pub.simulateContract({
      address: this.registry,
      abi: REGISTRY_ABI,
      functionName: "grantRoles",
      args: [resource, roleBitmap, account],
      account: from,
    });
  }

  async simulateRevoke(
    resource: bigint,
    roleBitmap: bigint,
    account: Address,
    from: Address,
  ) {
    return this.pub.simulateContract({
      address: this.registry,
      abi: REGISTRY_ABI,
      functionName: "revokeRoles",
      args: [resource, roleBitmap, account],
      account: from,
    });
  }
}

export function resourceLink(resource: bigint): string {
  return toResourceHex(resource);
}
