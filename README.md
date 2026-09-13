# Leash Agent

Leash is a revocable, capability-scoped gate for autonomous agents. It reads ENSv2 authority on Sepolia, issues a single-use credential for an allowed capability, re-checks authority immediately before the protected service call, and records the decision in an append-only audit stream.

## Run locally

```bash
cp .env.example .env.local
bun install
bun run dev
```

Open `http://localhost:3000`. Without a configured ENSv2 resource, the UI intentionally fails closed. To exercise the complete local mechanism without a wallet or RPC, run:

```bash
bun run demo
```

The demo proves allow, service use, revocation, and post-revocation refusal. Other commands are `bun run test`, `bun run build`, `bun run verify`, `bun run mcp`, and `bun run gate`.

## Live configuration

Set `LEASH_RESOURCE_ID` to the canonical ENSv2 resource ID owned by the deployment. For the ETHOnline hackathon deployment, also set `LEASH_REGISTRY` to the registry that issued the name. `LEASH_ADMIN_ENABLED=true` plus `PRIVATE_KEY` enables the protected grant/revoke API; never expose that key to the browser. ERC-8004 identifies the agent, while ENSv2 is the authorization source.

The live Sepolia proof used `leash.eth`, agent `0xb2F0C31e0C3a0dAE5298f7A70478637a64F55FA5`, and these public transactions:

- Grant: [0x56b9…ded8](https://sepolia.etherscan.io/tx/0x56b9c367003703e17307386c7fca8147ba5939ef5d3ab9948a6ecea1a517ded8)
- Revoke: [0x650a…bdfe](https://sepolia.etherscan.io/tx/0x650a58a39cb4a516033344b7c3faf1d65e56515f3c67dd6d20640f97516ebdfe)
- Re-grant: [0x9296…ff02](https://sepolia.etherscan.io/tx/0x92967d7fe172b08df26f31e81176fbab233e1a7996b028a46373f6470dc0ff02)
