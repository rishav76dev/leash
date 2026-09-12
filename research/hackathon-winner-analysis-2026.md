# What actually wins hackathons (Sept 2025 – Sept 2026)

Winner analysis across ETHGlobal, Sui Overflow, Solana Frontier, and Mantle — and what to do about it at ETHOnline 2026.

Compiled 10 September 2026. Companion to [ethglobal-2026-project-thesis.md](./ethglobal-2026-project-thesis.md).

---

## 0. The deadline, first

**ETHOnline 2026 submissions close Sunday 13 September 2026, 12:00pm EDT.** Roughly three days from now. Every recommendation below is filtered through that.

---

## 1. Dataset

| Event | Scale | What was pulled |
| --- | --- | --- |
| Sui Overflow 2026 | 747 projects, 58 countries, 6 weeks | All 16 track winners + 10 University Awards, 4 tracks |
| Sui Overflow 2025 | 599 submissions | 36 track winners |
| Solana Frontier (Colosseum, 2026) | 10,000+ participants, 150+ countries, **2,857 projects — largest crypto hackathon to date** | Grand Champion, Top 25, University + Public Good awards, 16 honorable mentions |
| ETHGlobal New York 2026 | 66 finalists listed | Full finalist list, ~21 carrying partner-prize badges |
| ETHGlobal Cannes 2026 | 66 finalists listed | Full finalist list with badges |
| ETHGlobal New Delhi 2025 | 33 finalists (page 1) | Finalist list |
| ETHOnline 2025 | 33 finalists (page 1) | Finalist list + badges |
| ETHGlobal NYC 2025 (ASI track) | $10k pool | 1st–3rd + honorable mentions |
| Mantle Turing Test 2026 | $223k+ stated value, 6 tracks | Tracks, prizes, dates; **partial** winner data (see §7) |

---

## 2. Pattern 1 — The single most repeated winning shape

> **An autonomous actor is bound by a guardrail it provably cannot override.**

This shape won, or placed, in *every ecosystem examined*, independently:

| Ecosystem | Project | The guardrail |
| --- | --- | --- |
| Sui Overflow 2026 | **Sup Wallet** (1st, Agentic Web) | Agent trades and pays within limits you set once — "without ever holding your key" |
| Sui Overflow 2026 | **Praxis** (4th, Walrus) | Dry-runs, risk-scores and gates agent spends; every decision logged with an on-chain receipt |
| Sui Overflow 2026 | **TALOS** (University) | Two agents manage yield behind "an on-chain guardrail the executor can't override" |
| Sui Overflow 2026 | **AgentOS** (University) | Agent passports, verifiable skills, scoped delegation |
| ETHGlobal Cannes 2026 | **maki** (badged) | DeFi agent whose keys stay in hardware, "unreachable by the model" |
| ETHGlobal Cannes 2026 | **Bound** | On-chain trust policy layer for agent spending and delegation |
| ETHGlobal Cannes 2026 | **MultisigPE** (badged) | TEE policy engine that raises multisig thresholds as contract risk rises |
| ETHGlobal NY 2026 | **Preo** (badged) | Private, policy-based agentic paycheck routing |
| ETHGlobal NY 2026 | **Clawback** (badged) | Escrow for agent payments with adjudicated disputes — "chargebacks for the machine economy" |
| ETHGlobal NY 2026 | **AgentBlox** | One on-chain policy engine shared by agents and finance teams |
| Solana Frontier | **Sudont** (Top 25) | "Bare-metal execution firewall" for agents |

**Why it wins:** it is demoable in 30 seconds (the agent tries, and *visibly fails*), it is technically legible, and it answers the judge's unspoken question — "why does this need a blockchain?" — with enforcement rather than storage.

**The catch:** this is now the most contested space in the entire hackathon circuit. Building "agent spending guardrail" generically in September 2026 is building the median project.

---

## 3. Pattern 2 — Everyone ranks; almost nobody enforces

A large cluster of 2026 projects computes an agent/counterparty **reputation score** and stops there:

- ETHGlobal NY 2026: **AgentIndex**, **AgentRankr**, **Agentbook.eth**, **andre8004**, **AgentRanker**, **Pfand**
- ETHGlobal Cannes 2026: **TrustAgent**, **veritas**, **AlphaShield**
- Sui Overflow 2026: **Rill**, **Carry**

Scores got badges. But the *guardrail* projects (§2) placed higher and more consistently. The gap between "displays a trust number" and "the number physically blocks the transfer" is the gap between a badge and a first place.

Also notable: the badged reputation projects at NY 2026 (**AgentIndex**, **AgentRankr**) built their indexes on **BigQuery**, not The Graph — despite The Graph being a $15,000 sponsor at ETHOnline 2026. That is an open lane.

---

## 4. Pattern 3 — Payments winners are boring, geographic, and already live

The DeFi & Payments winners of 2026 do not invent primitives. They plug into rails that already exist, in a named country:

| Project | Event | The unglamorous detail that won |
| --- | --- | --- |
| **Quay** (1st, DeFi & Payments) | Sui Overflow 2026 | Web2 merchants accept any token **through their existing QR code**; "Live in Singapore now" |
| **Talise** (2nd) | Sui Overflow 2026 | Google sign-in, gasless, send to a name, sub-second |
| **Brisk** (3rd) | Sui Overflow 2026 | Tap-to-pay POS, exact USDC amounts, no gas or card fees |
| **Splash** (4th) | Sui Overflow 2026 | B2B invoices from **approval → stablecoin settlement → audit proof** |
| **DashX** (Top 25) | Solana Frontier | Compliant cross-border stablecoin rails for emerging markets, India first |
| **KinnectFi** (Top 25) | Solana Frontier | "Dual-jurisdiction neobank" for the Philippine diaspora |
| **Stablecorp** (Top 25) | Solana Frontier | Back-office for remote founders paid in stablecoins, starting with India |
| **PyPI / CryptoUPI / Unipay** | ETHGlobal New Delhi 2025 | Stablecoin ↔ INR over **UPI** |

**Read:** "pay with crypto" is dead. "Pay with crypto *through the QR code the merchant already has, in Singapore*" wins. Specificity of rail and jurisdiction is doing the work, not the cryptography.

Note **Splash** — B2B invoice approval → settlement → audit — is squarely adjacent to the existing VendorLock thesis, and it placed 4th rather than 1st.

---

## 5. Pattern 4 — Solana Frontier signals a shift from protocols to companies

The largest crypto hackathon ever run picked a **robotics DePIN** as Grand Champion (**CrowdBrain**: train teleoperators in simulation, QA-screen them, route the best to real robots — $30,000).

The Top 25 is startups, not protocols: fantasy sports pools, **three separate trading-card companies** (JK Index, One Arena, Traded.gg), an FX venue, a turnkey physical supply chain (Nomu), private-credit RWA (ODL), real-estate debt (Housd), neobanks. Very little pure infrastructure.

**Read:** at the top of the market, judges are rewarding things that look like businesses with a customer. This is the strongest argument against building another "layer" or "protocol."

---

## 6. Pattern 5 — Prediction markets are the growth area and are already saturated

Sui gave DeepBook Predict effectively a whole track (**PIPS**, **Yosuku**, **Skew**, **Flicky**, plus **CallIt**, **Pelagos** in University). Solana: **Bench**, **Mentioned**, **Memetic Machines**, **Senthos**. ETHGlobal NY 2026: **JuryDuty**, **Calibre**, **Tap Tap Revolution**. Cannes 2026: **HackaTriathlon**.

It still wins — but you are entering the most crowded consumer category on the circuit with three days of build time. Avoid unless you have an unusual data source.

---

## 7. Mantle — what could and couldn't be confirmed

**The Turing Test Hackathon 2026** replaced the older Global Hackathon / Cookathon format. Structure:

- Phase I "Claw Hacks" (on-chain): 15–30 April 2026, winners 8 May; +$20K
- Phase II "AI Awakening": submissions 1 May – 15 June 2026
- Demo Day: 2–3 July 2026 · Final winners: 10 July 2026
- Six tracks, each with one exclusive sponsor: **AI Trading & Strategy** (BGA × Bybit), **AI Alpha & Data** (Mirana), **AI × RWA** (Mantle), **Consumer & Viral DApps** (Animoca), **AI DevTools** (Tencent Cloud), **Agentic Economy** (Byreal)
- Grand Champion $9,000 · 6 × $8,500 track firsts · $17,000 community voting (X engagement) · $3,000 UI/UX · 20 × $1,000 finalist/deployment · $223K+ stated total value incl. ~$103–110K API credits

**Confirmed winners (from participant posts, not an official list):** **Conatus** — Grand Champion *and* Best in Track (Dev Tool); **ChainSight AI** — Project Deployment Award.

⚠️ **Gap:** the official full winner list could not be retrieved — Mantle's devhub page still serves pre-event content and DoraHacks rejects automated fetching (HTTP 405). Track-by-track Mantle winners remain unverified. If Mantle is a target, this needs a manual pass.

Two structural notes worth stealing regardless: **$17,000 of Mantle's pool was awarded for X engagement**, and **$20,000 was for deployment**, not for the demo. Mantle pays for distribution and for shipping to mainnet.

---

## 7b. OKX — the most useful non-trading signal in the dataset

OKX ran **two** AI hackathons in the last two months, both now closed:

| Event | Window | Pool |
| --- | --- | --- |
| **OKX.AI Genesis Hackathon** | 2 Jul – 27 Jul 2026 (extended to 28 Jul); rewards announced 3 Aug | $100,000 · 506+ participants |
| **Build X: AI Season** (X Layer) | 7 Aug – 21 Aug 2026 | up to 300,000 USDT |

⚠️ **Gap:** no published winner list exists for either. The HackQuest project gallery is empty and no results coverage surfaced. What follows is therefore read from **what OKX asked for and what it chose to launch with** — which is arguably better evidence than a winner list anyway.

### OKX is explicitly steering away from trading

The Genesis track structure is the tell. Four service categories: **Finance, Software Services, Lifestyle, Art Creation** — three of four are non-trading. The tracks:

| Track | Prize | Note |
| --- | --- | --- |
| Best Product | $20,000 (10/6/4k) | |
| Creative Genius | $20,000 | |
| **Revenue Rocket** | $20,000 | **judged on actual revenue** |
| Finance Copilot | $7,500 (3 × $2,500) | |
| Software Utility | $7,500 | |
| Lifestyle Companion | $7,500 | |
| Artistic Excellence | $7,500 | |
| **Social Buzz** | $10,000 (10 × $1,000) | **judged purely on social traction** |

Judging criterion for every track is "OKXAI Internal Review," **and the ASP must actually go live or the entry is void.** No live listing, no prize. AI Season goes further: its **Launch Grant releases 50,000 USDT per each $10M of cumulative real DEX volume**, measured by 31 Aug with an anti-fraud review.

**Read:** OKX pays for *shipped, listed, revenue-producing, promoted* services. It does not pay for demos. Same lesson as Mantle ($17k for X engagement, $20k for deployment). Note also that trading is separately ghettoized — OKX ran a distinct "OKX.AI Trading Hackathon" with only a $20,000 pool, an order of magnitude below Genesis.

### The architecture OKX bet on

- **Two venues:** an **Agent Marketplace** (builders list agents, define services, set pricing) and a **Task Marketplace** (agents or users post work and pay on delivery; agents hire other agents).
- **Payments:** **x402** + OKX's Agent Payments Protocol, covering quoting, negotiating, escrow, usage metering, settlement, dispute handling. Paid in USDT/USDG.
- **Two payment modes:** escrow-based smart contracts for multi-step or subjective work; immediate **pay-per-call** for standardized services "where outcomes are less subjective."
- **Identity & reputation: ERC-8004** — Identity, Reputation and Validation registries, portable across jobs.
- **Execution:** OKX Agentic Wallet, private keys in a **TEE**, reachable over **MCP or CLI**, ~20 chains, no OKX account required. Works with Claude Code, Codex, Hermes, OpenClaw.
- **Disputes:** no central arbiter — routed to "a decentralised network of evaluators," with rulings feeding back into the trust layer.

### The three services OKX chose as launch partners

Not trading bots. Infrastructure:

| Provider | Service |
| --- | --- |
| **CertiK** | Lets an agent check a wallet's or token's security *before* it executes a transaction |
| **CoinAnk** | Live market data, billed per query |
| **GenLayer** | Dispute resolution between agents — "essentially a digital court system" |

GenLayer's CEO named the real bottleneck out loud: *"The challenge for us is distribution. OKX already has that."*

Context: OKX.AI exited closed beta 30 June 2026 with ~50 ASPs. Launch ecosystem partners include AWS, the Ethereum Foundation, the Solana Foundation and StraitsX. **India is an early focus** — developer tooling faces lighter regulatory friction there than spot trading, which OKX halted in 2024.

### Cross-ecosystem convergence — the strongest signal in this whole document

**ERC-8004 + x402 is becoming the default agent-commerce stack, and it is being validated independently by a major exchange and by ETHGlobal judges in the same quarter:**

| Standard | OKX | ETHGlobal 2026 |
| --- | --- | --- |
| **ERC-8004** | Identity/Reputation/Validation registries underpin OKX.AI | **AgentIndex** (badged, NY) — ERC-8004 analytics; **AgentRankr** (badged, NY) — ERC-8004 reputation |
| **x402** | Settlement layer for the marketplace | **A2A**, **Synapse**, **wisemanager** (Cannes/NY); AgentRankr flags x402 agents |
| **TEE-held keys** | OKX Agentic Wallet | **maki** (badged, Cannes) — keys in hardware "unreachable by the model"; **MultisigPE** (badged) |

### And a theme that appears three separate times: courts for agents

- **GenLayer** — OKX launch partner, agent dispute resolution
- **Clawback** — badged at ETHGlobal NY 2026: agent-payment escrow with AI-adjudicated disputes, "chargebacks for the machine economy"
- **Jurex Network** — ETHGlobal Cannes 2026 finalist: "the court for the agent economy"

Three independent teams, one exchange partnership, one prize badge. The problem is real and validated. **But all three adjudicate *after* something goes wrong. Nobody has built the layer that prevents the dispute.** See §11.

---

## 7c. The serial winners: how Tim and MrNetwork actually operate

X/Twitter is paywalled to automated access (HTTP 402 on every profile), so this is built from the **public GitHub API**, which turned out to be far more revealing than a timeline.

### The two accounts

| | **Tim** — [`winsznx`](https://github.com/winsznx) | **MrNetwork** — [`mrnetwork0001`](https://github.com/mrnetwork0001) |
| --- | --- | --- |
| Real name | Tim | Onwo Ifeanyichukwu Emmanuel |
| Bio | "Dev, building things" | "Builder \| AI Enthusiast \| DeFi Researcher \| **9x Hackathon Winner**" |
| Account age | since Jul 2020 | **since 17 Jan 2026 — 8 months old** |
| Public repos | 242 | 83 |
| Followers | 125 | 32 |
| **New repos since 27 Jul 2026** | **31** | **26** |

MrNetwork built 83 repos and won 9 hackathons in eight months. Tim shipped 31 distinct projects in the last 45 days. **Most repos go from created to final push in 0–3 days.**

### Finding 1 — Neither of them does ETHGlobal

A GitHub search across both accounts for `ethglobal` or `ethonline` in name, description, or topics returns **zero results for both**.

These two do not compete at ETHGlobal. They farm **small, sponsor-specific hackathons** where the entrant pool is a fraction of the size:

> Sibyl Labs · BUIDL CTC 2026 Fall · Binance Agent OS Mini · Nimiq Mini Apps · STRK20 Private Sprint (Starknet) · DreamDEX/Somnia · BOTChain · GIWA L2 · Monad × Cleanverse · iExec Nox · Flare FAssets · Creditcoin × Attestcoin · Telegraph Protocol · QIE · HydraDB · DataHub · Alpaca · Snap Spectacles · Virtuals ACP

This is a **portfolio strategy**, not a moonshot strategy. Twenty-plus shots a quarter at $2k–10k events with maybe 30–80 entrants each, rather than one shot at an 800-project ETHGlobal. It is almost certainly the higher-EV game, and it directly contradicts the framing of the original thesis.

### Finding 2 — Both did OKX/X Layer, and it's visible in the repo dates

| Builder | Repo | Window | What |
| --- | --- | --- | --- |
| MrNetwork | **HatchAI** (topic: `okx-hack`) | 25 May → 25 Jul | Uniswap V4 hook-protected launchpad on X Layer — fee decay, anti-whale caps, buyback-and-burn. Live at hatchai.online |
| MrNetwork | **OKXAgenticSkill** | 17–19 May | — |
| MrNetwork | **ShieldSuite** | 10 Apr → 20 Jul | AI-shielded transaction security on X Layer |
| MrNetwork | **AetheriaExchange** | 11–25 Aug | AI-run prediction market on X Layer; four agents draft, price, seed, settle — **exactly the AI Season window (7–21 Aug)** |
| Tim | **usance** | 21–23 Aug | RWA clearing & risk layer on X Layer, live at usance.xyz — **AI Season's AI-RWA track, the one with the 50k USDT Liquidity Grant** |
| Tim | **theeleven** | 1 Jul | Eleven agents open live football prop markets on X Layer, custom v4 hook, gasless USDT0 |
| Tim | **regista11** | 28 May | Agents generating football markets with commit-reveal on X Layer |
| Tim | **untch** | 9 Jul → 11 Aug | Deterministic authority + x402 settlement for agents |

Tim's `usance` is a precision strike: created two days into a track whose top prize is a 50,000 USDT liquidity grant, tagged `x-layer`, `rwa`, `chainlink`, `risk-engine`, and shipped to a real domain in 48 hours.

### Finding 3 — The README is the weapon

This is the transferable part. Both write READMEs that **prove the mechanism by showing it refuse**.

From Tim's **setld**:

> *"The agent does not report completion. The receipt does."*

The README carries a two-column table of **two real testnet runs** — correct execution vs. verified-but-wrong execution — with block numbers and clickable settlement tx hashes. The wrong case is a transaction that **succeeded** (receipt status 1) but breached one committed field (`amountIn` 25,000 over a 10,000 cap). It is rejected at `AMOUNT_IN_OVER_CAP`, bond penalised 100%.

> *"The wrong case is the point: a successful, Attestcoin-verifiable Ethereum transaction that violates one committed field. Not a revert. setld refuses it with no human evaluator."*

Then — and this is the move almost nobody makes — he runs an **ablation**: the same two executions through a `BaselineReporterSettlement` trusted-reporter path, to prove the sponsor's tech was load-bearing rather than decorative.

From MrNetwork's **Meritor**, a section literally titled *"Why this is load-bearing, not decorative"*:

> *"Fail-closed by construction. The `MemoryBackend` contract has no graceful degradation path… It is never caught-and-defaulted to an empty profile, because an empty profile reads as 'new counterparty, clean record' — which would let an outage silently approve credit."*

Plus a **deletion test**: `meritor wipe --yes` erases the memory, and the identical agent making the identical request flips from APPROVED/0% collateral to DENIED. Each step runs in a **separate process** so nothing can hide in RAM.

**The extractable technique — five moves:**

1. **Lead with the refusal.** The demo is the system saying no, not saying yes.
2. **Ship the negative case with real tx hashes.** Two runs, one passes, one fails, both verifiable on a public explorer.
3. **Run an ablation against a baseline** to prove the sponsor integration is load-bearing. This pre-empts the judge's "is this cosmetic?" — the single most common reason sponsor prizes are lost.
4. **Fail closed, and say so.** Outage must equal denial, never default-approve.
5. **Deploy to a real domain** and put the link in line 3 of the README. Nearly every project has one: usebazar.xyz, usance.xyz, setld.pages.dev, hatchai.online, usevaticr.xyz, syrty.pages.dev.

Cosmetic tells worth copying: aggressive topic-tagging for sponsor discoverability, and short invented latinate names — *setld, refut, limen, syrty, obstat, usance, fief, metrx, vinct, licet, Meritor, Pactora, Vaticr, Cloakra, Truvian, Syntura*.

### Finding 4 ⚠️ — They already built both of my §11 recommendations, last week

This is the most important thing in this section.

| My recommendation | Their repo | Built | Verdict |
| --- | --- | --- | --- |
| **Acceptance** — escrow that pays on a committed machine-checkable predicate, no court | **Tim / `setld`** — "Receipt-verified execution assurance for autonomous on-chain work." Immutable mandate + escrowed reward + bonded executor; receipt proves completion; predicate releases or penalises. | **3–4 Sept 2026** | **Same idea, shipped six days ago.** |
| **Redline** — gate a payment on the counterparty's indexed on-chain history | **MrNetwork / `Meritor`** — "recall a counterparty's history, set a collateral tier, and settle on Base — or refuse." | **4–9 Sept 2026** | **Same idea, shipped this week.** |
| (also) escrow + automated verification | **MrNetwork / `Pactora`** — multi-role escrow marketplace with closed-loop verification engine | 31 Aug 2026 | adjacent |

Read this two ways, both true:

- **Validation.** Two independent serial winners converged on the same two mechanisms in the same fortnight that the winner data pointed at them. The thesis in §11 is correct about where the gap is.
- **Collision.** The gap is being closed *right now*, by people who ship in 48 hours and deploy to real domains. "Acceptance" as specified is no longer a novel idea — it is `setld` with different sponsors.

Note the sponsor sets don't overlap (setld is Creditcoin + Attestcoin; Meritor is Sibyl + Base/EAS + Virtuals ACP), and neither entered ETHOnline. So this is not a direct prize collision. But **"Originality" is a scored ETHGlobal criterion**, and a judge who has seen setld will not score Acceptance as new.

---

## 7d. drey.eth — could not verify

No GitHub account resolves for `dreyeth`, `drey-eth`, `dreyethh`, `0xdrey`, or `dreyxyz` (the first two exist but are empty shells: 0 repos, 0 followers). X profiles return HTTP 402 to automated access. The ETHGlobal showcase requires event filters and surfaces nothing for the handle.

This matches the original thesis, which already flagged that "identity and prize placement cannot be independently confirmed." **Treat drey.eth as unverified.** If you have a direct link — a wallet, an ETHGlobal profile URL, or the exact GitHub handle — I can pull the history properly.

---

## 8. The ETHOnline 2026 meta-game (more important than the idea)

From the official rules and prize pages:

### Mechanics that change strategy

1. **Max 3 Partner Prizes per submission** — but *"a partner running several tracks still counts as 1 Partner Prize."* This is the key arbitrage. See §9.
2. **Async judging is two rounds. Only the top 20% advance to live judging.** ETHGlobal states plainly that **most prize money at these events goes to teams that never reach live judging.**
3. Round-one screening results are **not shared with partners** and do not affect partner-prize eligibility.
4. Mandatory **2–4 minute demo video**. Finalist slot is 7 min: 4 demo + 3 Q&A.
5. **Commit history is checked.** "Submissions with large single commits or missing histories may be disqualified."
6. **AI usage must be disclosed** — and for spec-driven workflows you must commit the spec files, prompts, and planning artifacts. Judges want to see how you directed the AI.
7. Criteria: Technicality, Originality, Practicality, Usability (UI/UX/DX), WOW Factor.

**Strategic conclusion: do not optimize for finalist. Optimize for stacking three partner prizes.** That is where the money is, it is judged asynchronously against published criteria, and it does not require surviving a 20% cut.

### The Continuity pool is 25% of the money

Continuity = the **Extend Open Source** and **Ship a Feature** tracks — building on an existing codebase, with prior work documented.

| Sponsor | Continuity-only prize |
| --- | --- |
| The Graph | $5,000 |
| World (AgentKit Continuity) | $3,500 |
| Arc | $3,000 |
| 1inch (Aqua Continuity) | $2,000 |
| Uniswap Foundation | $2,000 |
| Ledger | $1,500 |
| Hedera | $1,000 |
| Bazantic | $1,000 |
| ENS | $500 |
| Chainlink | $500 |
| **Total** | **$20,000 of $80,000** |

Most hackers arrive to build from scratch and structurally cannot enter these. With three days left, **extending an existing open-source repo is the highest-EV path available**, and it is the one nobody markets.

---

## 9. The sponsor-slot arbitrage (the most actionable finding)

Because a multi-track partner consumes only **one** of your three slots, slot choice varies addressable prize money by ~3x for identical effort.

**Addressable non-Continuity money per slot:**

| Slot choice | Non-Continuity tracks covered | Addressable |
| --- | --- | --- |
| **Hedera** | AI & Agentic Payments $6k (3 winners) + Tokenization of Anything $6k (3 winners) + Improve the Hedera Harness $2k (2 winners) | **$14,000** |
| **The Graph** | Composable/Standardized Graph Products $5k + AI Tooling from Scratch $5k | **$10,000** |
| **Arc (Circle)** | Best DeFi/Onchain Finance $3.5k + Best Agentic Economy w/ Circle Agent Stack $3.5k | **$7,000** |
| 1inch | Build an Aqua App $5k | $5,000 |
| ENS | Best Use of ENSv2 $4.5k | $4,500 |
| Privy | Best B2B financial product $2.5k + Best financial flow $2.5k | $5,000 |
| Ledger | AI Agents x Ledger $3.5k | $3,500 |
| World | Selfie Check $3.5k | $3,500 |
| Uniswap Fdn | Best Uniswap Stack Contribution $3k | $3,000 |
| Chainlink | Best Confidential Workflow $2k + Auto-Liquidation Protection $0.5k | $2,500 |
| Bazantic | Best Recipe $1k + Agentify a new API $1k | $2,000 |

- **Best three slots by addressable money: Hedera + The Graph + Arc = $31,000.**
- The existing thesis's stack (Privy + Ledger + Chainlink) addresses **$11,000.**

Caveat: bigger pools attract more entries. But Hedera and The Graph both award "up to 3 teams" per track, so the number of *payouts* scales too.

**Two under-contested specifics worth naming:**
- **Hedera "Improve the Hedera Harness"** — $2,000 across 2 teams, for an open-source contribution. Almost nobody enters open-source-contribution tracks at a hackathon. Near-highest EV line item on the board.
- **Bazantic** — a brand-new, unknown sponsor with $1,000 tracks split $500/$300/$200. Low name recognition means low entry count.

---

## 10. Verdict on VendorLock

The [existing thesis](./ethglobal-2026-project-thesis.md) is well-reasoned and its core instinct — a constrained actor, a human gate, one irreversible moment — is **exactly the shape that wins** (§2). Three problems now visible in the data:

| Issue | Evidence |
| --- | --- |
| **Weakest possible sponsor stack** | Privy + Ledger + Chainlink addresses $11,000. Hedera + Graph + Arc addresses $31,000 for the same build effort (§9). |
| **The space filled up** | **Splash** (Sui, B2B invoice→settlement→audit, 4th), **Preo** (NY 2026, badged, policy-based payment routing), **AgentBlox** (shared policy engine for agents + finance teams), **QuickLedgerBooks** (badged — AI bookkeeping with ENS payments **and Ledger approval**, i.e. the same Ledger angle), **Bound**, **Praxis**, **MultisigPE**. |
| **Chainlink CRE in 3 days is a schedule risk** | Chainlink's own rules note workflows cannot be updated after the deadline and scenarios run within 24 hours after. A TEE confidential workflow is the wrong thing to be debugging on the last night. |

One factual correction to the thesis: it states ETHOnline "limits projects to three sponsor SDKs." The prize page sets **no cap on SDKs**; the rules cap **partner prizes at three**. The practical constraint is the same, but the reason matters — you can freely integrate a fourth sponsor's SDK to strengthen the build, you just can't claim its prize.

---

## 11. Recommendation

Constraint applied: **no trading projects.** The data supports that independently — OKX put trading in a separate $20k hackathon while giving non-trading agent services $100k (§7b).

### 11.0 Three things hidden in the full prize text

**(a) Count winner *slots*, not dollars.** Because a multi-track partner costs only one of your three slots:

| Slot | Non-Continuity tracks | Winner slots | $ |
| --- | --- | --- | --- |
| **Hedera** | Agentic Payments (3) + Tokenization (3) + Harness (2) | **8** | $14,000 |
| **The Graph** | Composable (3) + AI From Scratch (3) | **6** | $10,000 |
| **ENS** | Best Use of ENSv2 — 1st/2nd/3rd **+ runner-up** | **4** | $4,500 |
| 1inch | Aqua (3) | 3 | $5,000 |
| Ledger | AI Agents x Ledger (3) | 3 | $3,500 |
| World | Selfie Check (3) | 3 | $3,500 |
| Uniswap | Stack Contribution (3) | 3 | $3,000 |
| Bazantic | Recipe (3) + Agentify (3) | 6 | $2,000 |
| Arc | 2 tracks | ~2 | $7,000 (*$5,000 conditional on mainnet by 30 Sept*) |
| Privy | 2 tracks | 2 | $5,000 |
| Chainlink | Confidential (2) + Liquidation (1) | 3 | $2,500 |

**Hedera + The Graph + ENS = 18 winner slots, $28,500** — the best three-slot allocation on the board. Arc looks big at $10k but half is contingent on a mainnet deploy by 30 September and it offers only ~2 slots.

**(b) The chore-gated tracks are where competition dies.** Four tracks require unglamorous paperwork, and hackers skip them:

- **Hedera Harness** — "open PR, **not merged is fine**." $2,000 / 2 slots.
- **Uniswap** — requires a `FEEDBACK.md` *and* a submitted feedback form.
- **World Selfie Check** — requires a written feedback document on docs and sandbox.
- **Bazantic** — requires account, gateway, and recipe setup; brand-new sponsor nobody knows.

**(c) Three sponsors independently asked for the same thing.** Read together:

- **The Graph** lists **Agent0/ERC-8004 Subgraphs** as a resource — ERC-8004 agent registries are *already indexed and queryable live*.
- **Hedera** awards extra points for "on-chain agent identity using **ERC-8004** or HCS-14" and "verifiable payment audit trails on **HCS**."
- **ENS** says: *"Bonus points if you bring AI agents into the mix — think **agents as namespaces, each with their own identity and permissions**"* — and links ENSIP-25 (AI Agent Registry Name Verification) and ENSIP-26 (Agent Text Records).

All three are pointing at **agent identity with scoped, revocable permissions.** That convergence is the opening.

Also worth correcting an earlier concern: **Chainlink accepts a CRE CLI *simulation***, not just a live deployment. The schedule risk I flagged against VendorLock is smaller than I said.

---

### 11.1 Primary — **Leash**: revocable, scoped authority for agents, enforced at the payment gate

**The problem.** When you grant an agent access today, you grant it *entirely* and *forever*. An API key has no scope, no expiry, no revocation, and no audit trail. Ledger's own brief states the goal exactly: *"a broker hands out scoped capabilities, never the API key."* Nobody has built the substrate.

**The mechanism.** An agent's identity **is** an ENS subname — `researcher.myfleet.eth` — issued from your own ENSv2 subname registry. **Enhanced Access Control roles on that name are the capability set**: which text records it may touch, which services it may call, what it may spend. Before any paid call, an x402 gate on Hedera resolves the agent's name, checks its EAC role, checks its ERC-8004 reputation via The Graph's Agent0 subgraph, and either mints a **short-lived scoped credential** or refuses. Every decision writes to **HCS**. The secret is never handed to the agent.

**Revocation is one transaction on the parent registry — and the very next call fails.**

**The demo (the whole pitch is 40 seconds).** An agent is happily making paid inference calls, metered per call, settling in HBAR through Blocky402. Mid-run you revoke its subname. **The next call fails.** Not eventually — next. Then show the HCS stream with the exact consensus timestamp where authority ended, and the subgraph confirming the reputation record. Then re-grant a *narrower* role and show it succeed for one capability and fail for another.

**Qualification, track by track:**

| Track | $ / slots | How it qualifies |
| --- | --- | --- |
| **ENS — Best Use of ENSv2** | $4,500 / 4 | Own subname registry; EAC roles as capabilities; expiring, revocable, non-transferable subnames; Permissioned Resolver per agent. Central, not cosmetic — revoking the name *is* revoking authority. Hits their explicit "agents as namespaces" bonus. |
| **Hedera — AI & Agentic Payments** | $6,000 / 3 | Live x402-gated inference service on Hedera testnet via the **Blocky402 facilitator**; agent completes a real paid request end to end. Extra points collected: pay-per-call metering, ERC-8004 identity, HCS audit trail, agent discovery. |
| **The Graph — Composable** | $5,000 / 3 | Compose the **Agent0/ERC-8004 standardized subgraph** with the **Subgraph MCP**. The leverage story writes itself: *one query pattern resolves any agent's reputation across every ERC-8004 registry*, instead of per-deployment glue. Live data from Subgraph Studio. |
| **The Graph — AI Tooling (From Scratch)** | $5,000 / 3 | Ship the gate as a **reusable MCP server / SKILL** — `can_this_agent(name, capability)` — droppable into any agent framework. This is the "reusable infrastructure, not a single end-user app" the track explicitly asks for. |

**Total: 13 winner slots, $20,500 — with three sponsor slots and one coherent build.**

**Why ENSv2 is the moat.** It went live on Sepolia days ago. ENS says outright: *"be among the first to build on it."* There is **no prior art for anyone** — including the serial winners in §7c. Every other angle in agent-land has been shipped by someone in the last fortnight; this one cannot have been.

**Scope discipline.** The EAC surface you need is tiny: grant role, check role, revoke role. Do not build a UI for registry administration, a token, a marketplace, or your own reputation algorithm. Use ERC-8004's existing one.

### 11.2 The free second shot — bundle a Harness PR under the same Hedera slot

Hedera runs multiple tracks on **one** partner-prize slot. So while building Leash you will inevitably hit rough edges in the Hedera tooling. Capture them:

- Open a real PR against [`hedera-dev/hedera-harness`](https://github.com/hedera-dev/hedera-harness) — **it does not need to be merged.**
- Add whatever you needed and it lacked (x402 helper coverage, an HCS audit-stream convenience, a local-dev mode that skips testnet round trips).
- Record a five-minute before/after on developer experience.

**$2,000 across 2 slots, roughly half a day, zero additional partner slots consumed.** This is the highest EV-per-hour line item on the entire board.

### 11.3 Strong alternate — the ATS secondary market (if you want out of the agent fight)

Hedera's Tokenization brief contains a sentence that is effectively a spec handed to you:

> *Extra points: "A secondary market for ATS-issued assets, **which the Studio does not have today**."*

A sponsor naming its own missing feature, with $6,000 across 3 slots. Build an order book or auction over Asset Tokenization Studio assets where **ERC-3643 compliance is enforced at transfer** — KYC grants, freezes, transfer restrictions checked atomically in the trade path. Add an oracle for NAV and Scheduled Transactions for coupon or maturity settlement, then contribute upstream to ATS.

Why it is attractive: ATS is enterprise-shaped (ERC-3643/ERC-1400, heavy SDK), so **most hackers will not touch it**; it is entirely non-agent, dodging the most contested category on the circuit and avoiding the §7c builders completely; and "institutional tokenized collateral" is exactly the narrative Hedera says it wants. Pair with **The Graph** (index ATS transfers and compliance events on a standardized schema) and **Arc** or **Chainlink** for the third slot.

Cost: it is less demo-sexy than a revocation that bites mid-run. Trade WOW for odds.

### 11.4 What not to build, given who is entering

Per §7c, Tim and MrNetwork ship escrow-and-verification primitives in 48 hours: `setld`, `Meritor`, `Bazar`, `Pactora`, `Splitrail`, `syrty`, `metrx`, `untch`, `mandate`. Avoid head-on collisions:

- ❌ Escrow that releases on a committed predicate — that is `setld`, built 3 Sept.
- ❌ Counterparty credit/history gating a payment — that is `Meritor`, built 4–9 Sept.
- ❌ An ERC-8004 agent marketplace — that is `Bazar`.
- ❌ Generic "policy checks + exact approvals + x402" — that is `untch`.

Leash survives the comparison on one axis only, but it is a real one: **everyone else's policy lives in their own contract; Leash's lives in a name you can revoke.** Lead with that sentence.

### 11.5 Borrow their README technique (§7c)

Non-negotiable, and cheap:

1. **Lead with the refusal**, not the happy path.
2. **Two real runs with clickable tx/HCS links** — one allowed, one denied.
3. **Run an ablation.** Swap ENSv2 EAC for a hardcoded allowlist and show the allowlist failing to revoke in time. This pre-empts "is the sponsor tech cosmetic?" — the top reason sponsor prizes are lost.
4. **Fail closed and say so.** Subgraph unreachable must equal denial, never default-allow. Say this in the README in those words.
5. **Deploy to a real domain**, linked in line 3.
6. **Commit continuously** — ETHGlobal disqualifies large single commits, and 1inch calls this out explicitly.

### 11.6 Three-day shape (deadline Sun 13 Sept, 12:00 EDT)

| | Work |
| --- | --- |
| **Day 1** | ENSv2 subname registry on Sepolia + EAC grant/check/revoke. Prove revocation works before building anything on top of it. If ENSv2 beta blocks you, fall back to §11.3 *today*, not on day 3. |
| **Day 2** | x402-gated service on Hedera testnet via Blocky402 + one real paid request. Agent0 subgraph query through Subgraph MCP. HCS decision stream. |
| **Day 3 (a.m.)** | Package the gate as an MCP server/SKILL. Harness PR. Ablation run. Record 2–4 min video. Submit by 11:00 EDT — **not noon.** |

Register for **Hedera, The Graph, ENS** as your three partner prizes.

---

## 12. Rules of thumb extracted

1. Ship **one irreversible moment**, one guardrail, one proof screen.
2. Make the blockchain do **enforcement**, not storage.
3. Name a **country and a rail** if you touch payments.
4. **Enforce, don't rank** — a score that doesn't block anything is a dashboard.
5. Choose sponsors by **addressable dollars per slot**, not by brand.
6. Optimize for **partner prizes**, not finalist status — that's where the money is and there's no 20% cut.
7. **Commit early and often.** Missing history is a disqualification risk.
8. Disclose AI use and **commit your prompts and specs**.
9. Mantle's design says the quiet part loudly: **deployment and distribution get paid.** Ship to a live network and post about it. OKX says it even louder — no live listing, no prize.
10. **Trading is a low-value category now.** OKX gave non-trading agent services $100k and trading its own separate $20k event. Three of its four service categories are non-trading.
11. **Build once, ship twice.** OKX.AI listings are always open. The same artifact can win a hackathon prize and earn per-call revenue.
12. **Prove the sponsor tech is load-bearing with an ablation.** Run your demo a second time with the sponsor's component swapped for a naive baseline, and show the baseline getting it wrong. This is what the serial winners do (§7c) and it directly answers the judge's "is this cosmetic?"
13. **Portfolio beats moonshot.** The serial winners never enter ETHGlobal. They run 20+ small sponsor hackathons a quarter at 0–3 days each. Ten shots at a 50-entrant event beats one shot at an 800-project event.
14. **Ship the negative case.** A demo where the system *refuses* — with two real tx hashes, one pass and one fail — outperforms any happy path.

---

## Sources

- Sui Foundation — [Announcing the Sui Overflow 2026 Hackathon Winners](https://www.sui.io/blog/sui-overflow-2026-winners)
- Sui Foundation — [Sui Overflow 2025 Hackathon Winners](https://www.sui.io/blog/2025-sui-overflow-hackathon-winners)
- Colosseum — [Announcing the Winners of the Solana Frontier Hackathon](https://blog.colosseum.com/announcing-the-winners-of-the-solana-frontier-hackathon/)
- ETHGlobal — [ETHOnline 2026 prizes](https://ethglobal.com/events/ethonline2026/prizes)
- ETHGlobal — [ETHOnline 2026 rules, judging & submission details](https://ethglobal.com/events/ethonline2026/info/details)
- ETHGlobal — [New York 2026 finalists showcase](https://ethglobal.com/showcase?events=newyork2026&prizeTiers=finalist)
- ETHGlobal — [Cannes 2026 finalists showcase](https://ethglobal.com/showcase?events=cannes2026&prizeTiers=finalist)
- ETHGlobal — [New Delhi 2025 finalists showcase](https://ethglobal.com/showcase?events=newdelhi&prizeTiers=finalist)
- ETHGlobal — [ETHOnline 2025 finalists showcase](https://ethglobal.com/showcase?events=ethonline2025&prizeTiers=finalist)
- ASI Alliance — [Meet the Winners: ASI Hackathon at ETHGlobal NYC](https://superintelligence.io/ethglobal-nyc-winners)
- Mantle — [The Turing Test Hackathon 2026](https://devhub.mantle.xyz/) · [DoraHacks listing](https://dorahacks.io/hackathon/mantleturingtesthackathon2026/detail)
- Rheza Sulaiman — [Conatus: Grand Champion, Mantle Turing Test 2026](https://www.linkedin.com/posts/rhezasulaiman_mantleaihackathon-mantle-ai-activity-7482279801446354944-863n)
- Sam Desigan — [ChainSight AI: Project Deployment Award](https://www.linkedin.com/posts/sam-desigan-198a742a7_github-icohangar-opschainsight-ai-activity-7484049314139385856-Emai)
- Chainwire — [Mantle Launches Turing Test Hackathon 2026](https://chainwire.org/2026/04/23/mantle-launches-turing-test-hackathon-2026-backed-by-tencent-cloud-bybit-byreal-and-bga/)
- HackQuest — [OKX.AI Genesis Hackathon](https://hackquest.io/en/hackathons/OKXAI-Genesis-Hackathon)
- OKX — [Build X Hackathon Series / AI Season](https://web3.okx.com/xlayer/build-x-series)
- TechCrunch — [Crypto exchange OKX wants AI agents to hire and pay each other](https://techcrunch.com/2026/06/30/crypto-exchange-okx-wants-ai-agents-to-hire-and-pay-each-other/)
- DefiHub — [OKX.AI Opens Beta: A Marketplace Where AI Agents Hire Each Other and Get Paid Onchain](https://defihub.space/news/okx-ai-marketplace-launches)
- The Agent Times — [OKX AI Genesis Hackathon Offers $100K to Build Agentic Service Providers](https://theagenttimes.com/articles/okx-ai-genesis-hackathon-offers-100k-to-build-agentic-servic-a17fa400)
- Odaily — [OKX.AI Launches Inaugural Trading Hackathon with $20,000 Total Prize Pool](https://www.odaily.news/en/newsflash/506066)
- GitHub API — [`winsznx`](https://github.com/winsznx) profile, repo list, commit history (accessed 10 Sept 2026); [`setld`](https://github.com/winsznx/setld), [`usance`](https://github.com/winsznx/usance), [`mandate`](https://github.com/winsznx/mandate)
- GitHub API — [`mrnetwork0001`](https://github.com/mrnetwork0001) profile, repo list, commit history (accessed 10 Sept 2026); [`Meritor`](https://github.com/mrnetwork0001/Meritor), [`Bazar`](https://github.com/mrnetwork0001/Bazar), [`HatchAI`](https://github.com/mrnetwork0001/HatchAI), [`Pactora`](https://github.com/mrnetwork0001/Pactora)
