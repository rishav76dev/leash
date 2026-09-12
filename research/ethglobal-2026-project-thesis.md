# VendorLock

## A private invoice-change firewall for stablecoin businesses

## Recommendation

Build **VendorLock**: a payment-operations product that prevents invoice-redirection fraud.

A business uploads an invoice or submits a vendor bank/wallet-detail change. VendorLock privately checks whether the destination and invoice attributes match the vendor's previously approved payment identity and the organization's policy. It emits only a signed risk decision and a reason code. A low-risk invoice can be paid in USDC; a novel or anomalous change is held until the required people approve it on their hardware devices.

The product is deliberately **not** an agent marketplace or an agent-to-agent economy. A bounded workflow may extract and compare data, but it never owns an open-ended budget or negotiates with other agents. Its valuable promise is simple: **a bank/wallet-detail change cannot silently reroute a payment.**

## Why this is the best gap

ETHOnline 2026 runs from September 4–16 and limits projects to **three sponsor SDKs**. Its prize set rewards a real B2B financial workflow (Privy), a privacy-preserving risk/policy workflow (Chainlink CRE), and device-backed human intervention for irreversible actions (Ledger). These three are unusually complementary rather than arbitrary integrations. [ETHOnline 2026 prizes](https://ethglobal.com/events/ethonline2026/prizes)

Recent winners show why not to build a generic alternative:

| Crowded direction | Evidence | Implication |
| --- | --- | --- |
| AI data marketplace / DeFAI data | Sui Overflow's AI winners included Suithetic, OpenGraph, RaidenX and Hyvve. | Do not submit an AI data market, trading copilot, or general on-chain agent. |
| Yield abstraction and perps | Sui's DeFi winners included Magma Finance, Pismo and Kamo; Mantle winners include a memecoin derivatives platform and a perps DEX. | A new vault, swap router, yield optimizer, or generic exchange will look interchangeable. |
| Generic wallet/payment UX | Sui winners already include stealth-payment links, multisig wallets, and token streams; ETHGlobal Brussels finalists included NFC transfers and WhatsApp crypto payments. | "Pay crypto more easily" alone is not enough. |
| Generic contract-builder AI | Mantle APAC rewarded Mantle Contract Builder and MNT DEV AI. | The product needs a user-specific problem, not code generation. |

VendorLock occupies the overlap that is less represented in those lists: **confidential B2B payment-risk decisions, with auditable policy enforcement and an explicitly retained human decision.**

## Relevant builder scan: what to borrow, what not to copy

The following public project histories are useful competitive evidence. They are not a reason to duplicate the projects.

| Builder | Public work relevant to ETHOnline | Winning pattern to learn | Boundary for VendorLock |
| --- | --- | --- | --- |
| [Tim / @winsznx](https://github.com/winsznx) | Remlo is borderless payroll and agent-payment infrastructure; FlowGuard is on-chain treasury and streaming-payment infrastructure; BlindMarkets and DarkOdds use private execution or confidential market mechanics. His public profile describes multiple hackathon placements. | Ship an opinionated financial primitive with a credible path past the demo, and make the hard mechanism visible. | Do not build payroll, treasury automation, generic x402 plumbing, a prediction market, or a broad "agent bank." VendorLock is a pre-payment security control for a narrow event: changed payout details. |
| [MrNetwork / @encrypt_wizard](https://x.com/encrypt_wizard) | Nexa is a paid AI-audit service that uses MPP and on-chain attestations; ShieldSuite combines transaction scanning, a TEE identity, and an on-chain security console. | A demonstrable payment/attestation/action loop is much stronger than an AI chat interface. | Do not build a paid AI endpoint, A2A bridge, generic scam detector, or trading/security dashboard. VendorLock's enforced destination-change policy is the product. |
| [drey.eth / @dreyethh](https://x.com/dreyethh) | Public traces associate drey.eth with Turnstile in the ZecHub hackathon directory and a privacy-routed weather-service SDK submission. Identity and prize placement cannot be independently confirmed from those pages alone. | Consumer projects earn attention when their privacy or identity property is tangible in the user journey. | Do not attach privacy as a slogan. In VendorLock, private invoice fields must actually remain inside the CRE confidential handler and never appear in the chain event or frontend audit log. |

The combined lesson is: **one irreversible user moment, one cryptographic/control primitive, and one proof screen.** For VendorLock that moment is "the payout destination changed"; the primitive is the confidential comparison plus enforced policy; the proof screen is the failed release followed by a correctly authorized payment.

## Evidence from winners

### ETHGlobal

ETHGlobal Brussels' 2024 ten finalists (from 355 submissions) combined concrete experiences with a visible on-chain primitive: NFC prediction markets and transfers, a WhatsApp onboarding flow, a child savings product, a contract-context layer, and a task-payment market. The takeaway is not "add AI"; it is make the blockchain-enforced action central and immediately demoable. [ETHGlobal Brussels recap](https://ethglobal.medium.com/ethglobal-brussels-2024-recap-68512e2502a8)

ETHOnline 2025's prize requirements similarly favored functional, sponsor-native work: public code, a short demo, and live integrations—not a static pitch. [ETHOnline 2025 prize page](https://ethglobal.com/events/ethonline2025/prizes)

### Sui Overflow 2025

Sui Overflow had 599 submissions and 36 track winners. First places covered verifiable synthetic data (Suithetic), anonymous whistleblowing (ZeroLeaks), programmable yield (Magma), social reputation (GiveRep), robotics coordination (Suibotics), SQL tooling (SuiSQL), stealth payment links (PIVY), and decentralized document signing (SuiSign). This confirms that winning projects pair a specific user action with a blockchain property that a Web2 version lacks. [Sui Foundation winner announcement](https://www.sui.io/blog/2025-sui-overflow-hackathon-winners)

The closest projects are not direct substitutes. ZeroLeaks protects anonymous document submission, SuiSign makes signatures immutable, and PIVY makes payments private. VendorLock is about protecting a business's confidential invoice data while preventing the **payment destination itself** from being changed without the intended controls.

### Mantle

Mantle's Global Hackathon prioritized RWA/RealFi, DeFi composability, AI/oracles, ZK/privacy, tooling, and consumer products; its published judging criteria stress technical execution, UX, real-world applicability, Mantle integration, and ecosystem potential. [Mantle Global Hackathon 2025](https://www.hackquest.io/hackathons/Mantle-Global-Hackathon-2025)

Mantle APAC winners reinforce the crowdedness of DeFi and generic AI: ellipse (memecoin derivatives), FLIP NFT (bonding-curve liquidity), Payroll Protocol (confidential payroll), Mantle Contract Builder, Web3Insights, StealthPass, Vortis, Truman AI Live, and Dunk Verse. [HackQuest's winner announcement](https://www.linkedin.com/posts/hackquest_thrilled-to-announce-mantle-apac-hackathon-activity-7288757860597997568-IaEQ) Cookathon 03's first place, FOURPLAY, simplified cross-chain payments using a four-word flow. [Winner account](https://in.linkedin.com/in/ooviya-manickam-147887233)

The lesson: real financial workflows and privacy can win, but "payments," "payroll," and "DeFi assistant" are occupied. VendorLock narrows the job to a costly, recognizable approval failure: a changed payee destination.

## Product definition

### User story

1. **Register vendor.** A buyer creates `acme.supplier.company.eth` (or an internal vendor record) and commits a salted hash of the vendor's approved wallet/bank destination plus approval policy. Raw banking data never goes on-chain.
2. **Submit invoice/change request.** The AP clerk drops in an invoice. The demo includes both a legitimate invoice and a visually identical invoice whose wallet/bank details have changed.
3. **Private decision.** A Chainlink CRE Confidential Workflow extracts the relevant fields and compares them inside a TEE against the approved fingerprint, value threshold, and historical payment signals. It returns `ALLOW`, `REQUIRE_QUORUM`, or `BLOCK`, along with minimal reason codes such as `DESTINATION_CHANGED`.
4. **Enforce.** A Privy organization wallet policy creates a USDC payment intent. `ALLOW` pays; `REQUIRE_QUORUM` waits for two approvers; `BLOCK` cannot become a transfer.
5. **Approve visibly.** The designated approvers use Ledger device-backed confirmation for a high-risk payment. The workflow runner has no reusable private key and cannot bypass the approval.
6. **Audit without leaking.** The chain records invoice commitment, policy version, decision, approvers, and payment hash—not invoice contents or the payout destination.

### A 90-second demo

Open two invoices from the same vendor. The first has the registered USDC destination and is paid. The second changes only that destination.

The dashboard shows: `Destination fingerprint changed → payment locked`. Attempted release fails. Two designated officers approve on a Ledger confirmation flow; only then does the Privy-managed wallet send USDC. Finish on an audit timeline that proves policy, decision and authorization while revealing no invoice number, amount, or address.

That contrast makes the value legible without a pitch deck.

## Sponsor plan

| Integration | Non-cosmetic use | Relevant ETHOnline 2026 track |
| --- | --- | --- |
| Chainlink CRE Confidential Workflows | TEE parses and compares private invoice/payment fields; output is a minimal signed decision used by the payment contract. | Best Confidential Workflow. CRE explicitly calls out private risk assessment, policy enforcement, and payment orchestration. |
| Privy | Embedded org wallets, signer roles, payment intent, threshold/quorum flow. | Best B2B financial product; Best financial flow. |
| Ledger Agent Stack / Key Ring | Holds the inspector's scoped document-analysis credential and makes a device-backed human confirmation necessary for a high-risk release. | AI Agents x Ledger. The “agent” is constrained to invoice evaluation; no A2A marketplace. |

This is the complete sponsor set—do **not** add Arc, The Graph, ENS, or another sponsor SDK. Arc is attractive for USDC settlement, but adds a network/deployment obligation; The Graph is valuable only if its live, composable data is genuinely load-bearing; ENS would be cosmetic in this product. The prize rules favor depth over a sponsor-logo collage.

## Architecture

```text
Private invoice/PDF
       │
       ▼
Chainlink CRE confidential TEE
  extract → compare fingerprints/policy → signed ALLOW | QUORUM | BLOCK
       │                              │
       │                              └─ public commitment + reason code only
       ▼
VendorLock policy contract ───────────► Privy org wallet intent
                                         │
               low risk ───────────────► testnet stablecoin payment
               high risk ─► Ledger-confirmed quorum ─► USDC payment
```

Use an append-only `PaymentCase` record with `invoiceCommitment`, `vendorId`, `policyVersion`, `decision`, `approvalCount`, and `settlementTx`. Do not store raw invoice text, wallet address, bank account, email, or API response on-chain.

## Build sequence

### Must ship

1. One buyer, one vendor, USDC-on-testnet payment, legitimate and changed-destination invoice fixtures.
2. Contract state machine: `Submitted → Evaluated → Held/Approved → Settled`.
3. CRE confidential handler genuinely processes the private data and calls the contract with its decision.
4. Privy organization wallet plus a real policy/quorum and a completed testnet stablecoin transfer.
5. Ledger Key Ring is the credential backend for the constrained inspector and provides the human confirmation for a held case.
6. Short demo with terminal logs proving the confidential workflow ran.

### Explicitly do not build

- A full accounting integration, OCR engine, bank integration, KYC system, or generalized fraud score.
- A token, governance system, marketplace, or agent-to-agent settlement layer.
- A claim that this replaces enterprise fraud controls. It is a demoable policy-enforcement layer.

## Submission positioning

**One-liner:** “VendorLock makes vendor payment-detail changes cryptographically impossible to pay silently.”

**Problem:** Finance teams validate a changed invoice destination with private data, but current approval systems often leak that data or leave a social-engineering gap between detection and payment.

**Blockchain necessity:** Public blockchains alone cannot process confidential invoices; Web2 alone cannot give a payment policy a tamper-evident, shared enforcement point. VendorLock uses confidential computation for the decision and on-chain intents/policy for enforceable settlement.

**Judge-facing claim:** “We are not asking you to trust an AI fraud score. You can inspect the actual rule: a destination change cannot send USDC until the designated humans approve it, while the confidential invoice stays private.”

## Sources

1. ETHGlobal. [ETHOnline 2026 prizes](https://ethglobal.com/events/ethonline2026/prizes). Accessed 10 September 2026.
2. Sui Foundation. [Announcing the Sui Overflow 2025 Hackathon Winners](https://www.sui.io/blog/2025-sui-overflow-hackathon-winners). June 30, 2025.
3. ETHGlobal. [ETHGlobal Brussels 2024: Recap](https://ethglobal.medium.com/ethglobal-brussels-2024-recap-68512e2502a8). August 6, 2024.
4. ETHGlobal. [ETHOnline 2025 prizes](https://ethglobal.com/events/ethonline2025/prizes). Accessed 10 September 2026.
5. HackQuest / Mantle. [Mantle Global Hackathon 2025](https://www.hackquest.io/hackathons/Mantle-Global-Hackathon-2025). Accessed 10 September 2026.
6. HackQuest. [Mantle APAC Hackathon winners](https://www.linkedin.com/posts/hackquest_thrilled-to-announce-mantle-apac-hackathon-activity-7288757860597997568-IaEQ). Accessed 10 September 2026.
7. Ooviya Manickam. [Cookathon 03 winner post](https://in.linkedin.com/in/ooviya-manickam-147887233). Accessed 10 September 2026.
