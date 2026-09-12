"use client";

import { useEffect, useState } from "react";

type Dashboard = { health?: Record<string, unknown>; audit?: { summary: { total: number; allow: number; deny: number; medianLatencyMs: number }; entries: Array<Record<string, unknown>> }; receipt?: Record<string, unknown> };

const exampleAddress = "0x000000000000000000000000000000000000dEaD";

export default function Home() {
  const [data, setData] = useState<Dashboard>({});
  const [agentName, setAgentName] = useState("researcher");
  const [address, setAddress] = useState(exampleAddress);
  const [capability, setCapability] = useState("inference.call");
  const [decision, setDecision] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [health, audit, receipt] = await Promise.all([
      fetch("/api/v1/health").then((r) => r.json()),
      fetch("/api/v1/audit?limit=8").then((r) => r.json()),
      fetch("/api/v1/receipt").then((r) => r.json()),
    ]);
    setData({ health, audit, receipt });
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
  return <main className="shell">
    <nav className="nav"><a className="brand" href="/">leash<span>.</span>agent</a><div className="navlinks"><a href="#decision">Decision tester</a><a href="#audit">Audit trail</a><a href="/api/v1/health">API health</a></div></nav>
    <section className="hero"><div className="hero-copy"><div className="eyebrow">Revocable authority for agents</div><h1>Permission that can say no on the next call.</h1><p className="lede">Leash reads ENSv2 roles, checks the requested capability, and mints a short-lived credential only when the agent is authorised.</p></div><div className="hero-card"><div className="muted">ENSv2 Sepolia</div><strong>{configured ? "Connected" : "Configure resource"}</strong><div className="muted">{String(data.health?.resourceLabel ?? "No LEASH_RESOURCE_ID set")}</div></div></section>
    <section className="grid"><Metric label="Decisions" value={summary.total}/><Metric label="Allowed" value={summary.allow} good/><Metric label="Denied" value={summary.deny} bad/><Metric label="Median latency" value={`${summary.medianLatencyMs}ms`}/></section>
    <section id="decision" className="split"><div className="card"><div className="eyebrow">Live gate</div><h2>Test a capability</h2><form onSubmit={evaluate} className="form"><label>Agent name<input value={agentName} onChange={(e) => setAgentName(e.target.value)} /></label><label>Wallet address<input value={address} onChange={(e) => setAddress(e.target.value)} /></label><label className="full">Capability<select value={capability} onChange={(e) => setCapability(e.target.value)}><option>inference.call</option><option>inference.batch</option><option>data.read</option><option>treasury.spend</option></select></label><div className="full"><button disabled={busy}>{busy ? "Checking chain…" : "Evaluate authority"}</button></div></form></div><div className={`card decision ${decision?.verdict === "ALLOW" ? "allow" : decision ? "deny" : ""}`}><div className="eyebrow">Decision result</div>{decision ? <><h2 className={decision.verdict === "ALLOW" ? "allow-text" : "deny-text"}>{String(decision.verdict)}</h2><p>{String(decision.reason ?? ((decision.error as { message?: unknown } | undefined)?.message ?? ""))}</p><pre>{JSON.stringify(decision, null, 2)}</pre></> : <><h2>Waiting for a request</h2><p className="muted">Run the check to see the exact reason code, block, role bitmap, and credential scope.</p></>}</div></section>
    <section id="audit" className="section card"><div className="eyebrow">Append-only stream</div><h2>Recent decisions</h2>{data.audit?.entries?.length ? <table><thead><tr><th>Verdict</th><th>Capability</th><th>Code</th><th>Latency</th></tr></thead><tbody>{data.audit.entries.map((entry, i) => <tr key={`${String(entry.seq)}-${i}`}><td className={entry.verdict === "ALLOW" ? "allow-text" : "deny-text"}>{String(entry.verdict)}</td><td>{String(entry.capability)}</td><td><span className="pill">{String(entry.code)}</span></td><td>{String(entry.latencyMs)}ms</td></tr>)}</tbody></table> : <p className="muted">No decisions recorded yet.</p>}</section>
  </main>;
}

function Metric({ label, value, good, bad }: { label: string; value: number | string; good?: boolean; bad?: boolean }) { return <div className="card"><div className="muted">{label}</div><div className={`metric ${good ? "allow-text" : bad ? "deny-text" : ""}`}>{value}</div></div>; }
