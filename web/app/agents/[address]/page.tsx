import Link from "next/link";

export default async function AgentPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  return <main className="shell"><nav className="nav"><Link className="brand" href="/">leash<span>.</span>agent</Link><div className="navlinks"><Link href="/agents">Change address</Link><Link href="/">Dashboard</Link></div></nav><section className="card"><div className="eyebrow">ENSv2 authority</div><h1>Agent <code>{address}</code></h1><p className="muted">Live authority data is loaded from the server API.</p><pre>{`GET /api/v1/agents/${address}/authority`}</pre><a href={`/api/v1/agents/${address}/authority`}><button>Load authority JSON</button></a></section></main>;
}
