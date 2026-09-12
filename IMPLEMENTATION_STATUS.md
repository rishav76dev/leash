# Implementation status

Updated 2026-09-11.

## Working in this repository

- Next.js dashboard and all documented `/api/v1` routes build successfully.
- ENSv2 Sepolia client reads roles, owner, expiry, and supports protected grant/revoke writes.
- Gate decisions fail closed on chain errors, missing authority, expiry, missing roles, and configured reputation failure.
- Credentials are capability-scoped, address-bound, short-lived, and single-use.
- Protected service calls re-check live authority immediately before serving, so a revocation rejects an already-issued unused credential.
- Live Sepolia proof completed for `leash.eth`: grant, allowed service call, revoke, immediate `ROLE_NOT_HELD` denial, and re-grant. The app’s hackathon deployment registry is configurable via `LEASH_REGISTRY`.
- Local NDJSON/in-memory audit stream, receipt, demo, latency, ablation output, gate HTTP server, and MCP tool server are present.
- `bun test` passes 3 tests; `bunx tsc --noEmit` and `bun run build` pass.

## Still required for a public hackathon submission

- Configure and register a Leash-owned ENSv2 resource/subname on Sepolia, then capture grant, allow, revoke, and deny transaction links.
- Replace the temporary capability-to-EAC-role mapping with an owned application permission registry/resolver. Generic ENS administrative roles must not be treated as arbitrary business permissions in production.
- Supply a Graph API key and an actual ERC-8004/Agent0 registration; capture a live reputation query and evidence.
- Supply Hedera testnet credentials and implement real x402/Blocky402 settlement plus HCS topic submission. The current ledger and HCS flag are intentionally not presented as real settlement.
- Run the two real ablation experiments and publish reproducible results.
- Deploy the app, add wallet-signed browser authority changes, and record the demo video/explorer links.

## Environment limitation observed

The primary public Sepolia RPC is intermittent in this workspace; `LEASH_RPC_URL` supports a fallback endpoint. The live ENSv2 flow was verified using the registered hackathon deployment. `GRAPH_API_KEY` is still not configured.
