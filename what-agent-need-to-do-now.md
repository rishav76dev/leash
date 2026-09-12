› what i need to do now


• You are now at the submission-preparation stage.

  Do these next:

  1. Do not run bun run register-agent again. The agent is already registered.
  2. Wait for Agent0 indexing, then run:

  bun run verify

  The Graph service is working; your specific agent may take time to appear.

  3. Keep these settings in .env.local:

  LEASH_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
  LEASH_MIN_REPUTATION=1
  GRAPH_API_KEY=your_key

  4. Run the final checks:

  bun test
  bunx tsc --noEmit
  bun run build
  bun run demo

  5. Start the app and verify the dashboard:

  bun run dev

  Open http://localhost:3000.

  6. Submit with these two integrations:

  - ENSv2: revocable capability authority
  - The Graph/Agent0: registered agent and reputation

  Do not claim Hedera integration. Your Hedera payment and HCS audit features are not
  implemented yet.

  Use these links in your submission:

  - Agent registration transaction
  - Agent feedback transaction
