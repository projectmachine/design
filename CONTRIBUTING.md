# Contributing

This fork is intentionally small. Keep changes focused on the hosted web application, the Express daemon API, shared contracts, database schema, and Docker deployment.

## Setup

```bash
corepack enable
pnpm install
pnpm typecheck
```

Package-scoped commands:

```bash
pnpm --filter @open-design/web build
pnpm --filter @open-design/daemon build
pnpm --filter @open-design/db build
pnpm --filter @open-design/contracts build
```

## Boundaries

Do not reintroduce desktop/Electron packaging, sidecar process management, agent CLI spawning, Claude/Codex runtime code, MCP, plugins, skills, bundled design systems, or release tooling unless the fork explicitly decides to own those surfaces again.
