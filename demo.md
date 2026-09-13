# Leash Agent — ENS + The Graph demo

This guide is for recording the hackathon demo from the `ens-graph` branch.
The branch uses ENSv2 on Sepolia for authority and The Graph/Agent0 for
reputation. Hedera and x402 are intentionally not part of this demo.

## What the project does

Leash is a permission and safety layer for autonomous agents. Instead of
giving an agent a permanent API key, the system:

1. Receives an agent, capability, and wallet address.
2. Reads the agent's ENSv2 authority on Sepolia.
3. Checks the requested capability against the ENS role.
4. Optionally checks the agent's ERC-8004/Agent0 reputation through The Graph.
5. Returns either `ALLOW` with a short-lived, capability-scoped credential or
   `DENY` with a stable reason.
6. Re-checks authority immediately before the protected service call.
7. Writes the decision to an append-only audit stream.

The important property is revocation: an agent can be allowed now and denied
on its next request after its ENS role is revoked. The credential is not a
permanent permission and cannot bypass the live authority check.

## Before recording

Use the `ens-graph` branch:

```bash
git switch ens-graph
git status
```

The working tree should be clean. The repository already contains the
frontend and the committed ENS/Graph implementation.

`.env.local` is already configured locally. Do not commit it, paste it into a
terminal recording, or show private keys/API keys on screen. Important values
include:

- ENSv2/Sepolia resource, registry, RPC, and credential settings
- The demo agent address and agent private key
- `GRAPH_API_KEY` and `LEASH_MIN_REPUTATION`
- Local audit-log configuration

The browser must never receive `PRIVATE_KEY`, `AGENT_PRIVATE_KEY`,
`LEASH_CREDENTIAL_SECRET`, or `GRAPH_API_KEY`.

## Verify before the demo

Run the checks once before recording:

```bash
bun install
bun test
bun run build
```

Expected result:

- 3 tests pass.
- The Next.js production build completes successfully.

## Start the application

In the project directory:

```bash
bun run dev
```

Open:

- Dashboard: http://localhost:3000/
- Guided demo page: http://localhost:3000/demo
- Audit page: http://localhost:3000/audit
- Health/API status: http://localhost:3000/api/v1/health

Keep the terminal available so the server logs and any transaction activity
can be shown if needed.

## Recommended recording flow

### 1. Introduce the problem

Say:

> Autonomous agents need permissions, but a permanent API key is too broad.
> Leash turns ENS authority into a revocable, capability-scoped permission
> that is checked again at execution time.

Show the dashboard headline and the ENSv2 Sepolia connection.

### 2. Show the ENS authority

Use the configured demo agent and a capability such as `inference.call`.
Run the decision check from the dashboard.

Point out:

- The agent address
- The ENS resource/name
- The requested capability
- The decoded role/authority result
- The `ALLOW` decision
- The credential expiry and audit entry

Explain that ENS is the source of truth for who may do what. The application
does not use a hardcoded allowlist as the authority boundary.

### 3. Show The Graph reputation check

Point out that the reputation gate is optional and fail-closed when configured.
The runtime queries the Agent0/ERC-8004 data source through The Graph and can
reject an agent that does not meet `LEASH_MIN_REPUTATION`.

If the configured agent has a live reputation record, show the reputation
value in the decision response or health/dashboard data. If the subgraph does
not return a record during recording, clearly label the result as an
unavailable/missing reputation response rather than claiming a live score.

### 4. Use the protected service

Use the credential returned by the allowed decision to call the protected
service. Show the successful response and the receipt/audit information.

Explain that the credential is:

- Short-lived
- Bound to the agent address
- Bound to one capability
- Single-use

### 5. Demonstrate revocation

Revoke the relevant ENSv2 role using the protected admin route or the prepared
wallet flow. Show the Sepolia transaction link/hash if available.

Repeat the same decision or service request. It should now be denied, with a
reason such as `ROLE_NOT_HELD` or `NO_ROLES_ON_RESOURCE`.

This is the key moment of the demo: the previously allowed agent cannot rely
on an old credential after its authority changes on ENS.

### 6. Show the audit trail

Open `/audit` or `/api/v1/audit?limit=100` and show both decisions:

- The original allowed request
- The post-revocation denied request

Point out the capability, verdict, reason, authority details, and latency.

### 7. Optional narrower re-grant

Re-grant only a narrower ENS role. Demonstrate that the matching capability is
allowed while another capability remains denied. This shows that Leash is
capability-scoped, not simply on/off access.

## Short spoken explanation

> Leash is a revocable permission layer for AI agents. ENSv2 stores the
> agent's identity and roles on Sepolia. A role maps to a capability such as
> reading data or calling inference. Before a request is served, Leash checks
> that authority and, when configured, verifies the agent's ERC-8004 reputation
> using The Graph's indexed data. If everything passes, it issues a short-lived
> credential for exactly that capability. If the ENS role is revoked, the next
> request fails because Leash checks live authority again. Every decision is
> recorded so the result is explainable and auditable.

## Why ENS is a sponsor integration

ENS is load-bearing, not cosmetic. The project uses ENSv2 as the authority
layer:

- The agent is identified by an ENS resource/subname and wallet address.
- ENS Enhanced Access Control roles represent capabilities.
- Granting a role grants a specific capability.
- Revoking a role removes that capability.
- Expiry and on-chain state make authority inspectable and revocable.

The demo directly exercises the ENS feature: grant/allow, revoke/deny, and
narrower re-grant. Without ENSv2, the application would fall back to a static
allowlist and would lose the on-chain authority and revocation proof.

## Why The Graph is a sponsor integration

The Graph supplies the reputation data used by the gate. Leash does not invent
its own reputation score. It queries indexed ERC-8004/Agent0 information so an
agent's reputation can become an input to an authorization decision.

This makes the integration useful in the execution path:

```text
ENSv2 authority + Agent0 reputation via The Graph
              -> Leash decision
              -> scoped credential or denial
```

The Graph also makes the reputation layer queryable without writing custom
indexing logic for every registry deployment. In the demo, describe it as the
reputation signal that complements ENS authority: ENS answers “is this agent
allowed to perform this capability?”, while The Graph helps answer “does this
agent meet the configured trust threshold?”

## What is implemented versus intentionally out of scope

Implemented for this branch:

- Next.js frontend dashboard and guided demo page
- ENSv2 Sepolia authority reads and protected grant/revoke routes
- Capability-scoped credentials
- Live authority re-check before service execution
- Agent0/The Graph reputation adapter
- Append-only audit, decisions, receipt, and health endpoints
- Local CLI demo, tests, and production frontend build

Not part of this recording:

- Hedera HCS audit sink
- Hedera x402 or Blocky402 payment settlement
- A claim that all reputation data is live if the subgraph is unavailable

## Local fallback

If Sepolia or the subgraph is temporarily unavailable, run the deterministic
core demonstration:

```bash
bun run demo
```

This proves the local allow, service-use, revocation, and post-revocation
refusal behavior. Label it as the local fallback; use the web dashboard and
Sepolia links for the primary sponsor demo whenever the network is available.

## Final recording checklist

- [ ] On `ens-graph` branch
- [ ] `.env.local` configured and not visible in the recording
- [ ] Dashboard loads at `/`
- [ ] ENSv2 Sepolia connection is visible
- [ ] Allowed capability decision shown
- [ ] Protected service call succeeds
- [ ] ENS role revoked
- [ ] Identical follow-up request is denied
- [ ] Audit trail shows allow and deny
- [ ] The Graph reputation behavior is described accurately
- [ ] No Hedera functionality is claimed for this branch
