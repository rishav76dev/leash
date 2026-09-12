/**
 * ERC-8004 agent reputation via The Graph's Agent0 subgraphs.
 *
 * This is the second gate input: authority says *may* the agent act, and
 * reputation says *should* it. Both are read from public infrastructure, so a
 * third party can reproduce the decision without our cooperation.
 *
 * Requires a Subgraph Studio API key. Mocked or static data explicitly does
 * not qualify for The Graph's tracks, so when no key is present we say so
 * loudly and the gate simply skips the reputation check rather than inventing
 * a number.
 */

const AGENT0_SUBGRAPHS = {
  "ethereum-sepolia": "6wQRC7geo9XYAhckfmfo8kbMRLeWU8KQd3XsJqFKmZLT",
  "base-sepolia": "4yYAvQLFjBhBtdRCY7eUWo181VNoTSLLFd5M7FXQAi6u",
  "ethereum-mainnet": "FV6RR6y13rsnCxBAicKuQEwDp8ioEGiNaWaZUmvr1F8k",
  "base-mainnet": "43s9hQRurMGjuYnC1r2ZwS6xSQktbFyXMPMqGKUFJojb",
  "monad-testnet": "8iiMH9sj471jbp7AwUuuyBXvPJqCEsobuHBeUEKQSxhU",
} as const;

export type Agent0Network = keyof typeof AGENT0_SUBGRAPHS;

export interface ReputationResult {
  score: number | null;
  note: string;
}

export interface ReputationSource {
  scoreFor(address: string): Promise<ReputationResult>;
}

interface Agent0Agent {
  id: string;
  agentId: string;
  owner: string;
  totalFeedback?: number;
  registrationFile?: {
    name?: string | null;
    mcpEndpoint?: string | null;
    x402Support?: boolean | null;
    ens?: string | null;
  } | null;
}

export class Agent0Reputation implements ReputationSource {
  private readonly apiKey: string | undefined;
  private readonly network: Agent0Network;
  private readonly cache = new Map<string, ReputationResult>();

  constructor(opts?: { apiKey?: string; network?: Agent0Network }) {
    this.apiKey = opts?.apiKey ?? process.env.GRAPH_API_KEY;
    this.network = opts?.network ?? "ethereum-sepolia";
  }

  get enabled(): boolean {
    return Boolean(this.apiKey);
  }

  get subgraphId(): string {
    return AGENT0_SUBGRAPHS[this.network];
  }

  get endpoint(): string {
    if (!this.apiKey) {
      return `https://gateway.thegraph.com/api/subgraphs/id/${this.subgraphId}`;
    }
    return `https://gateway.thegraph.com/api/${this.apiKey}/subgraphs/id/${this.subgraphId}`;
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
      throw new Error(`subgraph HTTP ${res.status}: ${await res.text()}`);
    }
    const json = (await res.json()) as { data?: T; errors?: unknown[] };
    if (json.errors?.length) {
      throw new Error(`subgraph errors: ${JSON.stringify(json.errors).slice(0, 200)}`);
    }
    if (!json.data) throw new Error("subgraph returned no data");
    return json.data;
  }

  /** Health check used by `bun run verify`. */
  async probe(): Promise<{ ok: boolean; detail: string; agents?: number }> {
    if (!this.apiKey) {
      return {
        ok: false,
        detail:
          "GRAPH_API_KEY not set — reputation gate disabled (mocked data would not qualify)",
      };
    }
    try {
      const data = await this.query<{ agents: Agent0Agent[] }>(
        `{ agents(first: 5) { id agentId owner } }`,
      );
      return {
        ok: true,
        detail: `Agent0 ${this.network} subgraph reachable`,
        agents: data.agents.length,
      };
    } catch (e) {
      return { ok: false, detail: String(e).slice(0, 160) };
    }
  }

  /**
   * Look up an agent by owner address and derive a simple reputation signal
   * from its ERC-8004 feedback records.
   */
  async scoreFor(address: string): Promise<ReputationResult> {
    const key = address.toLowerCase();
    const hit = this.cache.get(key);
    if (hit) return hit;

    if (!this.apiKey) {
      const r: ReputationResult = {
        score: null,
        note: "no GRAPH_API_KEY — reputation not consulted",
      };
      this.cache.set(key, r);
      return r;
    }

    try {
      const data = await this.query<{ agents: Agent0Agent[] }>(
        `query ByOwner($owner: String!) {
           agents(where: { owner: $owner }, first: 1) {
             id agentId owner totalFeedback
             registrationFile { name mcpEndpoint x402Support ens }
           }
         }`,
        { owner: key },
      );
      const agent = data.agents[0];
      if (!agent) {
        const r: ReputationResult = {
          score: null,
          note: "no ERC-8004 registration found for this address",
        };
        this.cache.set(key, r);
        return r;
      }
      const fb = agent.totalFeedback ?? 0;
      const r: ReputationResult = {
        score: fb,
        note: `ERC-8004 agent ${agent.id} with ${fb} feedback record(s)`,
      };
      this.cache.set(key, r);
      return r;
    } catch (e) {
      // Fail closed on the *authority* path, but reputation is advisory:
      // a subgraph outage must not silently lower the bar, so we return null
      // and let the gate's minReputation decide.
      const r: ReputationResult = {
        score: null,
        note: `subgraph unavailable: ${String(e).slice(0, 80)}`,
      };
      return r;
    }
  }
}
