import { performance } from "node:perf_hooks";
import { CredentialMinter } from "../gate/credential.ts";

const minter = new CredentialMinter({ secret: "latency", ttlSeconds: 30 });
const samples: number[] = [];
for (let i = 0; i < 100; i++) {
  const t = performance.now();
  const token = minter.mint("bench", "0x000000000000000000000000000000000000dEaD", "inference.call", 1n);
  minter.verify(token, "inference.call");
  samples.push(performance.now() - t);
}
samples.sort((a, b) => a - b);
console.log(JSON.stringify({ samples: samples.length, medianMs: samples[50], p95Ms: samples[95] }, null, 2));
