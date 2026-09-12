# Leash project checkpoint

Updated: 2026-09-11

## Current project

Leash is a revocable, capability-scoped authorization gate for autonomous agents. ENSv2 controls authority, Agent0/The Graph supplies optional reputation, MCP exposes the same gate to agents, and Hedera x402/HCS is the planned payment and audit layer.

## Completed

- Next.js dashboard and documented `/api/v1` routes build successfully.
- ENSv2 client supports role reads, grant, revoke, ownership, expiry, and events.
- Credentials are address-bound, capability-scoped, short-lived, nonce-based, and single-use.
- Protected service calls re-check live ENSv2 authority before serving.
- Revoked credentials are rejected immediately.
- Reputation checks fail closed when a positive threshold is configured.
- MCP server exposes `leash_capabilities` and `leash_check_authority` using the same gate.
- Local CLI demo, gate server, audit log, receipt, latency output, and ablation output exist.
- README, `.env.example`, `.env.local`, and `.gitignore` exist.
- `bun test`, `bunx tsc --noEmit`, and `bun run build` pass.

## Live ENSv2 deployment

Owner/name:

```text
Name: leash.eth
Owner: 0xf450d687863E9a86d440acD6dbf6D9973682962B
Agent: 0xb2F0C31e0C3a0dAE5298f7A70478637a64F55FA5
Resource: 0xe5edd0e482c95985582112af99c7fa487b70360c42f108c45d55011300000000
Registry: 0x1d78834d97c1d7b1a38c1dedbd1a287cfed3971e
RPC: https://ethereum-sepolia-rpc.publicnode.com
```

Public proof:

- Registration: [0xf0c204…19ba](https://sepolia.etherscan.io/tx/0xf0c2040c8ad124ff26e8df4f2ceb5707ea2686bbc87c28dffd7a62d84b9619ba)
- First grant: [0x56b9…ded8](https://sepolia.etherscan.io/tx/0x56b9c367003703e17307386c7fca8147ba5939ef5d3ab9948a6ecea1a517ded8)
- Earlier revoke: [0x6be9…506c](https://sepolia.etherscan.io/tx/0x6be9b2a0a0865fcda084d5afab95eca6eac556d1aa31c3aa68a682d6a251506c)
- Corrected revoke test: [0x650a…bdfe](https://sepolia.etherscan.io/tx/0x650a58a39cb4a516033344b7c3faf1d65e56515f3c67dd6d20640f97516ebdfe)
- Verified denial after corrected revoke: `ROLE_NOT_HELD`
- Final re-grant: [0x9296…ff02](https://sepolia.etherscan.io/tx/0x92967d7fe172b08df26f31e81176fbab233e1a7996b028a46373f6470dc0ff02)

The final live allow test returned HTTP 200 from the protected service. The agent was re-granted afterward.

## Secrets required locally

These must exist only in `.env.local` and must never be committed or pasted into chat:

```env
PRIVATE_KEY=
AGENT_PRIVATE_KEY=
GRAPH_API_KEY=
HEDERA_PRIVATE_KEY=
```

Public/configuration values belong in `.env.local` as well:

```env
AGENT_ADDRESS=0xb2F0C31e0C3a0dAE5298f7A70478637a64F55FA5
LEASH_RESOURCE_ID=0xe5edd0e482c95985582112af99c7fa487b70360c42f108c45d55011300000000
LEASH_REGISTRY=0x1d78834d97c1d7b1a38c1dedbd1a287cfed3971e
```

## Next implementation order

### 1. Make the ENS permission model safe

Current capabilities still reuse ENS administrative roles such as `SET_RESOLVER`. Implement an owned application permission registry or dedicated subregistry so `inference.call` cannot accidentally grant control over ENS records.

### 2. Finish The Graph/Agent0 integration

- Obtain a Graph API key.
- Confirm the agent is registered in the supported Agent0 subgraph.
- Add a live reputation route and dashboard evidence.
- Add tests for unregistered agent, low score, API outage, and valid score.
- Keep the gate fail-closed for configured reputation policies.

### 3. Implement real Hedera x402 payment

- Add the official x402 Hedera packages.
- Configure a Hedera testnet payer and merchant account.
- Return a real HTTP 402 payment challenge.
- Verify and settle payment through Blocky402.
- Return settlement transaction/reference data to the caller.
- Add tests for missing, invalid, replayed, and successful payment proofs.

### 4. Implement HCS audit submission

- Create/configure an HCS topic.
- Implement an `HcsSink` using the Hedera SDK.
- Submit decision and settlement records asynchronously.
- Expose HCS topic ID, sequence number, consensus timestamp, and error state in `/api/v1/audit`.
- Add retry and flush behavior for shutdown/demo completion.

### 5. Connect MCP to payment-aware service calls

The current MCP tools use the gate but do not yet perform x402 payment. Add a payment-capable tool that requests authority, calls the paid service, and returns both the service result and proof references.

### 6. Build the executable live guided demo

The local CLI demo works. The submission demo still needs one command or page that runs:

1. Agent is allowed.
2. Agent makes a paid call.
3. Decision and payment are recorded.
4. Owner revokes authority.
5. The next call is denied.
6. ENS transaction, Hedera settlement, and HCS evidence are displayed.

### 7. Complete submission evidence

- Deploy publicly.
- Add live deployment URL to README.
- Add Graph evidence and HCS evidence.
- Add final grant/revoke/payment explorer links.
- Run the static-allowlist ablation.
- Record the final demo video.

## Current blockers

- Graph API key and Agent0 registration/reputation evidence are not configured.
- Hedera account, merchant account, HCS topic, and private key are not configured.
- Real x402/Blocky402 settlement is not implemented yet.
- HCS submission is not implemented yet.
- The capability-to-ENS-role mapping still needs replacement before production or submission claims.
