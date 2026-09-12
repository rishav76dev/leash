# Leash Agent — implementation plan

## Product direction

Leash Agent is a revocable permission layer for autonomous agents. An agent
requests a capability, Leash reads the agent's ENSv2 authority, optionally
checks ERC-8004 reputation, and returns either:

- `ALLOW` plus a short-lived credential scoped to one capability; or
- `DENY` plus a stable reason code.

The existing TypeScript/Bun code is the core domain implementation. The user
interface will be a Next.js application that makes the decision, authority,
audit, and metering flows visible without putting private keys or gate secrets
in the browser.

This plan follows the latest recommendation in the research: Leash is the
primary project direction. The older VendorLock thesis remains useful as
competitive context, but its invoice/CRE/Privy/Ledger workflow is not the
scope of this repository.

## Target architecture

```text
Next.js web app (web/)
  dashboard · agent detail · decision tester · audit timeline
              │ same-origin HTTPS API
              ▼
Next.js route handlers / server actions
  validate input · rate limit · serialize bigint · call core services
              │
              ▼
Leash Agent core (src/)
  LeashGate · ENSv2 client · credential minter · audit log
  reputation source · metered service
              │
              ├── ENSv2 Sepolia registry / RPC — identity and capabilities
              ├── ERC-8004 Agent0 subgraph via The Graph — reputation
              ├── Hedera testnet / Blocky402 — metered payment path
              └── Hedera HCS — consensus audit stream
```

The frontend is a control-plane dashboard, not the authority boundary. All
permission checks happen server-side. The browser may display a credential
for a demo, but it must never receive `PRIVATE_KEY`, `GRAPH_API_KEY`, RPC
credentials, HMAC secrets, or server-side wallet configuration.

The sponsor integrations must be load-bearing: ENSv2 owns the capability
state, The Graph supplies live Agent0 reputation data, and Hedera/HCS records
the paid decision trail. Keep an ablation path in the demo that compares this
against a hardcoded allowlist.

## Proposed repository layout

```text
src/                         # framework-independent Leash Agent core
  api/                       # request/response DTOs and service facade
  audit/
  chain/
  gate/
  reputation/
  service/
web/                         # Next.js App Router frontend
  app/
    page.tsx                 # overview dashboard
    agents/page.tsx          # registered/known agents
    agents/[address]/page.tsx
    decisions/page.tsx       # decision tester and recent decisions
    audit/page.tsx           # append-only audit timeline
    api/                     # thin route handlers over src/api
  components/
  lib/                       # browser-safe API client and formatting helpers
```

Keep `src/chain`, `src/gate`, and credential code free of React and Next.js
imports. This lets the CLI, MCP server, API, and tests share the same
fail-closed behavior.

## API contract

Implement a small versioned API under `/api/v1`:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/health` | chain ID, registry address, RPC/subgraph status; never expose secrets |
| `GET /api/v1/capabilities` | capability IDs, descriptions, role names, units, irreversible flag |
| `GET /api/v1/agents/:address/authority` | role bitmap, decoded regular/admin roles, current capability report |
| `POST /api/v1/decisions` | evaluate `{ agentName, capability, agentAddress }` through `LeashGate` |
| `GET /api/v1/audit?limit=50` | recent append-only decisions and summary metrics |
| `POST /api/v1/service/:capability` | demo protected-service call using a presented credential |
| `GET /api/v1/receipt` | metered service totals and refusal counts |

API responses should convert `bigint` values to decimal strings and return a
stable error shape such as `{ error: { code, message } }`. Never return the
raw private credential secret or wallet object.

## Frontend screens

### 1. Overview dashboard

Show chain connection, registry, total decisions, allow/deny counts, median
latency, served/refused calls, and billed units. The main demo action should
be obvious: select an agent, capability, and address, then run a check.

### 2. Decision tester

Display the result as a strong `ALLOW`/`DENY` state with the reason code,
human-readable reason, block number, latency, decoded roles, and credential
expiry when allowed. Include a deliberately denied example so the
fail-closed behavior is easy to demonstrate.

### 3. Agent authority page

Display the ENS resource label, owner, expiry, raw bitmap, decoded roles, and
capability mapping. Addresses and resource IDs must be rendered in copyable,
truncated form with links to Sepolia explorers where appropriate.

### 4. Audit timeline

Render the append-only decision stream with filters for verdict, capability,
agent, reason code, and time. Keep `roleBitmap` and block height visible so a
judge can reproduce why a decision happened.

### 5. Protected service demo

Let the user call `inference.call` or `data.read` with the returned credential,
then show the service response, units charged, and receipt totals. Show an
expired/mismatched credential as a visible refusal path.

### Demo sequence

The primary proof screen should lead with refusal, as recommended by the
research:

1. An authorised agent makes a paid inference call successfully.
2. Revoke one ENSv2 role on the parent registry.
3. Make the next identical call and show it fail immediately.
4. Show the HCS audit entry and the ENSv2 `EACRolesChanged` event.
5. Re-grant only a narrower role; show one capability succeed and another
   remain denied.

The frontend should make this sequence one guided flow, with live transaction,
block, and consensus links wherever available.

## Delivery phases

### Phase 1 — core/API boundary

1. Add an API-facing facade around `LeashGate`, `AuditLog`, and
   `MeteredService`.
2. Add DTO schemas and explicit bigint serialization.
3. Add the health, capabilities, decisions, audit, and receipt endpoints.
4. Add request validation, bounded audit limits, CORS/origin policy, and
   rate limiting for decision/service endpoints.
5. Add tests for every `DenyCode`, credential scope/expiry, and malformed
   input.

### Phase 2 — Next.js frontend

1. Create `web/` with Next.js App Router, TypeScript, and a minimal component
   system.
2. Build the overview, decision tester, authority, audit, and service-demo
   screens above.
3. Use server components for initial dashboard reads and client components only
   for interactive forms, filters, and polling.
4. Add loading, empty, disconnected, and denied states; do not make a denied
   decision look like a transport error.
5. Add responsive layout and a short demo mode with deterministic fixture
   inputs, while keeping live chain results clearly labelled.
6. Add the guided revocation demo and an ablation view showing why the
   ENSv2-backed gate is different from a static allowlist.

### Phase 3 — wallet and production hardening

1. Add wallet connection only if a user needs to grant/revoke roles from the
   UI; reads and decision checks do not require a browser wallet.
2. Keep role writes behind explicit confirmation and show the exact resource,
   role bitmap, target address, and transaction hash.
3. Move the HMAC secret and RPC configuration to deployment secrets.
4. Add structured logging, health checks, timeout/fallback behavior, and
   deployment configuration for Sepolia.
5. Run an end-to-end demo: authorised call, revoked/unauthorised call,
   credential-scoped service call, HCS audit verification, and narrower-role
   re-grant.

## Security and correctness requirements

- Preserve fail-closed behavior: chain errors, missing roles, unknown
  capabilities, and expired resources must never produce `ALLOW`.
- Never put `PRIVATE_KEY`, HMAC credential secrets, or provider API keys in
  `NEXT_PUBLIC_*` variables or client bundles.
- Treat credentials as bearer secrets: do not persist them in localStorage;
  keep demo credentials in memory and redact them from server logs.
- Enforce an allowlist for capability IDs; never accept a role name directly
  from the frontend.
- Keep canonical ENSv2 resource IDs; do not substitute raw label hashes.
- Make audit writes append-only and keep decision data free of unnecessary
  secrets or sensitive agent payloads.
- Add a CSP, secure cookies if authentication is introduced, origin checks,
  and production rate limits before public deployment.

## Definition of done

The first complete slice is done when a user can open the Next.js dashboard,
run a live Sepolia decision, see an auditable `ALLOW` or `DENY`, use an
allowed credential against the protected demo service, see a refused scoped
or expired credential, and inspect all of those events in the audit timeline.

The existing CLI and MCP entrypoints must continue to use the same core gate
and pass their existing verification flow; the Next.js app is an additional
client, not a second permission implementation. Package the same gate as an
MCP tool/skill (`can_this_agent(name, capability)`) so the frontend, CLI, and
agent integrations all exercise the same decision path.
