import { getRuntime, configSummary } from "../api/runtime.ts";

const rt = getRuntime();
const chain = await rt.client.chainId().then(async (chainId) => ({ ok: true, chainId, block: (await rt.client.blockNumber()).toString() })).catch((e) => ({ ok: false, error: String(e) }));
console.log(JSON.stringify({ config: configSummary(), chain }, null, 2));
