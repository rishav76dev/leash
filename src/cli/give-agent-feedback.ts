import { SDK } from "agent0-sdk";

const privateKey = process.env.PRIVATE_KEY?.trim();
if (!privateKey) {
  throw new Error("PRIVATE_KEY is required for the evaluator wallet");
}

const agentId = process.env.AGENT0_ID || "11155111:10238";
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: process.env.LEASH_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
  privateKey,
});

const transaction = await sdk.giveFeedback(
  agentId,
  100,
  "quality",
  "leash-demo",
);
const { result: feedback } = await transaction.waitConfirmed({ timeoutMs: 180_000 });

console.log(JSON.stringify({
  agentId,
  transactionHash: transaction.hash,
  feedbackId: feedback.id,
  value: feedback.value,
}, null, 2));
