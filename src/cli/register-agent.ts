import { SDK } from "agent0-sdk";

const privateKey = process.env.AGENT_PRIVATE_KEY?.trim();
if (!privateKey) {
  throw new Error("AGENT_PRIVATE_KEY is required and must remain server-side");
}

const rpcUrl = process.env.LEASH_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

const sdk = new SDK({
  chainId: 11155111,
  rpcUrl,
  privateKey,
});

const agent = sdk.createAgent(
  process.env.AGENT0_NAME || "Leash Agent",
  process.env.AGENT0_DESCRIPTION ||
    "A revocable, capability-scoped authorization agent.",
);

agent.setTrust(true, false, false);
agent.setActive(true);

// Use ERC-8004's on-chain data URI flow so registration works in Bun without
// requiring Helia's optional native node-datachannel module.
const transaction = await agent.registerOnChain();
const { result: registration } = await transaction.waitConfirmed({ timeoutMs: 180_000 });

console.log(JSON.stringify({
  network: "ethereum-sepolia",
  agentId: registration.agentId,
  agentURI: registration.agentURI,
}, null, 2));
