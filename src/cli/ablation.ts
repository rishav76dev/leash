console.log(JSON.stringify({
  name: "leash-ablation",
  comparison: [
    { policy: "static allowlist", revocation: "manual/config reload", liveAuthority: false },
    { policy: "Leash", revocation: "next protected call", liveAuthority: true, credential: "single-use, capability-scoped" },
  ],
  note: "Run against the deployed resource and record explorer links before using as submission evidence.",
}, null, 2));
