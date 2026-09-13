"use client";

import { useEffect, useState } from "react";

type Dashboard = {
  health?: Record<string, unknown>;
  audit?: { summary: { total: number; allow: number; deny: number; medianLatencyMs: number }; entries: Array<Record<string, unknown>> };
};

const demoAddress = "0xb2F0C31e0C3a0dAE5298f7A70478637a64F55FA5";

export default function Home() {
  const [data, setData] = useState<Dashboard>({});
  const [agentName, setAgentName] = useState("researcher");
  const [address, setAddress] = useState(demoAddress);
  const [capability, setCapability] = useState("inference.call");
  const [decision, setDecision] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [health, audit] = await Promise.all([
      fetch("/api/v1/health").then((r) => r.json()),
      fetch("/api/v1/audit?limit=8").then((r) => r.json()),
    ]);
    setData({ health, audit });
  }

  useEffect(() => { void refresh(); }, []);

  async function evaluate(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setDecision(null);
    try {
      const response = await fetch("/api/v1/decisions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentName, capability, agentAddress: address }) });
      setDecision(await response.json()); await refresh();
    } finally { setBusy(false); }
  }

  const summary = data.audit?.summary ?? { total: 0, allow: 0, deny: 0, medianLatencyMs: 0 };
  const configured = Boolean(data.health?.configured);
  const allowed = decision?.verdict === "ALLOW";

  return <main className="shell landing-shell">
    <nav className="nav"><a className="brand" href="/" aria-label="Leash home"><img className="brand-logo" src="/leash-wordmark.png" alt="LEASH" /></a><div className="navlinks"><a href="#story">Why Leash</a><a href="#decision">Try the gate</a><a href="#audit">Audit trail</a><a className="nav-cta" href="/demo">Watch the flow <span>↗</span></a></div></nav>

    <section className="hero landing-hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> Permission infrastructure for autonomous agents</div><h1>Give agents power.<br /><em>Keep the leash.</em></h1><p className="lede">Leash turns on-chain authority into a permission that can be checked, scoped, and revoked before every action.</p><div className="hero-actions"><a className="button-link" href="#decision">Test the live gate <span>↓</span></a><a className="text-link" href="#story">See how it works <span>↘</span></a></div><div className="hero-proof"><span className="proof-check">✓</span> ENSv2 on Sepolia <span className="proof-divider" /><span className="proof-check">✓</span> ERC-8004 identity <span className="proof-divider" /><span className="proof-check">✓</span> Live revocation</div></div><div className="authority-card"><div className="card-topline"><span className="status-pill"><span className="live-dot" /> LIVE SYSTEM</span><span className="chain-label">SEPOLIA · 11155111</span></div><div className="authority-title">Authority check</div><div className="identity-row"><div className="avatar">R</div><div><strong>researcher</strong><span>researcher.leash.eth</span></div><span className="verified">✓</span></div><div className="authority-line"><span>requested capability</span><strong>inference.call</strong></div><div className="authority-line"><span>ENS role</span><strong className="green-text">ROLE_SET_RESOLVER <span>✓</span></strong></div><div className="authority-result"><div><span className="result-label">DECISION</span><strong>ALLOW</strong></div><span className="result-arrow">↗</span></div><p className="card-caption">Scoped to one capability · expires in 30s</p></div></section>

    <section className="stats-strip"><Stat label="Authority source" value="ENSv2" detail="Sepolia"/><Stat label="Agent identity" value="ERC-8004" detail="Sepolia"/><Stat label="Credential" value="30 sec" detail="single-use scope"/><Stat label="Current status" value={configured ? "Connected" : "Setup needed"} detail={String(data.health?.resourceLabel ?? "leash.eth")} /></section>

    <section id="story" className="story-section"><div className="section-intro"><div className="eyebrow">The problem with permanent keys</div><h2>Agents are becoming capable.<br /><span>Permission systems are not.</span></h2><p>One leaked key can become unlimited access. One stale allowlist can outlive the person who created it. Leash makes authority explicit, short-lived, and observable.</p></div><div className="story-grid"><StoryCard n="01" title="Authority on-chain" body="ENSv2 stores who an agent is and which capabilities it holds. No hidden allowlist, no guesswork." accent="mint"/><StoryCard n="02" title="Scoped credentials" body="Each approved request receives a short-lived credential for exactly one capability." accent="lavender"/><StoryCard n="03" title="Revocation that works" body="Every protected call checks live authority again. Revoke once, and the next call fails." accent="peach"/></div></section>

    <section className="flow-section"><div className="eyebrow">One request, three checks</div><div className="flow"><FlowStep n="01" title="Identify" body="Agent + wallet"/><span className="flow-arrow">→</span><FlowStep n="02" title="Authorize" body="ENS role"/><span className="flow-arrow">→</span><FlowStep n="03" title="Scope" body="Short-lived credential"/><span className="flow-arrow">→</span><FlowStep n="04" title="Re-check" body="Before execution"/></div></section>

    <section id="decision" className="tester-section"><div className="section-intro compact"><div className="eyebrow">Live gate · try it yourself</div><h2>Does this agent have permission <span>right now?</span></h2><p>Use the configured demo agent to read the real ENSv2 state on Sepolia. Change the role, revoke it, and watch the next request get denied.</p></div><div className="split tester-grid"><div className="card form-card"><div className="form-header"><div><span className="step-number">01</span><h3>Ask for access</h3></div><span className="small-tag">READ-ONLY CHECK</span></div><form onSubmit={evaluate} className="form"><label>Agent name<input value={agentName} onChange={(e) => setAgentName(e.target.value)} /></label><label>Wallet address<input value={address} onChange={(e) => setAddress(e.target.value)} /></label><label className="full">Capability<select value={capability} onChange={(e) => setCapability(e.target.value)}><option>inference.call</option><option>inference.batch</option><option>data.read</option><option>treasury.spend</option></select></label><div className="demo-hint full">Demo agent loaded · <button type="button" className="plain-button" onClick={() => setAddress(demoAddress)}>reset address</button></div><div className="full"><button className="button-link submit-button" disabled={busy}>{busy ? "Reading Sepolia…" : "Evaluate authority  ↗"}</button></div></form></div><div className={`card decision decision-card ${allowed ? "allow" : decision ? "deny" : ""}`}><div className="form-header"><div><span className="step-number">02</span><h3>Get the answer</h3></div><span className="small-tag">EXPLAINABLE RESULT</span></div>{decision ? <><div className={`decision-badge ${allowed ? "good" : "bad"}`}>{String(decision.verdict)}</div><p className="decision-reason">{String(decision.reason ?? ((decision.error as { message?: unknown } | undefined)?.message ?? ""))}</p><pre>{JSON.stringify(decision, null, 2)}</pre></> : <div className="empty-result"><div className="empty-icon">✦</div><h3>Waiting for a request</h3><p>Every result includes the verdict, reason code, block number, role bitmap, and credential scope.</p></div>}</div></div></section>

    <section id="audit" className="section card audit-card"><div className="audit-heading"><div><div className="eyebrow">Proof, not promises</div><h2>Every decision leaves a trail.</h2></div><a className="text-link" href="/audit">Open full audit ↗</a></div>{data.audit?.entries?.length ? <table><thead><tr><th>Verdict</th><th>Capability</th><th>Code</th><th>Latency</th></tr></thead><tbody>{data.audit.entries.map((entry, i) => <tr key={`${String(entry.seq)}-${i}`}><td className={entry.verdict === "ALLOW" ? "allow-text" : "deny-text"}>{String(entry.verdict)}</td><td>{String(entry.capability)}</td><td><span className="pill">{String(entry.code)}</span></td><td>{String(entry.latencyMs)}ms</td></tr>)}</tbody></table> : <p className="muted">No decisions recorded yet.</p>}</section>
    <footer><span className="brand">leash<span>.</span>agent</span><span>ENS authority · scoped credentials · safer agents</span></footer>
  </main>;
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function StoryCard({ n, title, body, accent }: { n: string; title: string; body: string; accent: string }) { return <article className={`story-card ${accent}`}><span className="story-number">{n}</span><div className="story-icon">✦</div><h3>{title}</h3><p>{body}</p></article>; }
function FlowStep({ n, title, body }: { n: string; title: string; body: string }) { return <div className="flow-step"><span>{n}</span><strong>{title}</strong><small>{body}</small></div>; }
