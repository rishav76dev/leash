import Link from "next/link";

export default function AuditPage() {
  return <main className="shell"><nav className="nav"><Link className="brand" href="/">leash<span>.</span>agent</Link><div className="navlinks"><Link href="/">Dashboard</Link><Link href="/decisions">Decisions</Link></div></nav><section className="card"><div className="eyebrow">Append-only audit</div><h1>Decision stream</h1><p className="lede">The live audit endpoint keeps the exact authority decision and latency for every request.</p><a href="/api/v1/audit?limit=100"><button>Open audit JSON</button></a></section></main>;
}
