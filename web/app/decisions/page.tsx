import Link from "next/link";

export default function DecisionsPage() {
  return <main className="shell"><nav className="nav"><Link className="brand" href="/">leash<span>.</span>agent</Link><div className="navlinks"><Link href="/">Dashboard</Link><Link href="/audit">Audit</Link></div></nav><section className="card"><div className="eyebrow">Decision API</div><h1>Every request is a proof.</h1><p className="lede">Use the dashboard to evaluate an agent. The response includes the verdict, stable reason code, block, role bitmap, and scoped credential.</p><Link href="/#decision"><button>Open decision tester</button></Link></section></main>;
}
