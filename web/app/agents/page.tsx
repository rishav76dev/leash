import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AgentsPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  const { address } = await searchParams;
  if (address) redirect(`/agents/${encodeURIComponent(address)}`);
  return <main className="shell"><nav className="nav"><Link className="brand" href="/">leash<span>.</span>agent</Link><div className="navlinks"><Link href="/">Dashboard</Link><Link href="/audit">Audit</Link></div></nav><section className="card"><div className="eyebrow">Agent authority</div><h1>Inspect an agent</h1><p className="lede">Paste an address to read its current ENSv2 roles and capability report.</p><form action="/agents" className="form"><label className="full">Agent address<input name="address" placeholder="0x…" required /></label><button className="full">Open authority</button></form></section></main>;
}
