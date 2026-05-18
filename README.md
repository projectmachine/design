# Open Design Web Fork

This fork keeps only the browser application and the HTTP daemon needed to serve it. Desktop packaging, sidecars, agent runtimes, Claude/Codex integrations, skills, design-system catalogs, plugins, MCP, E2E infrastructure, release tooling, and content bundles have been removed.

## What remains

- `apps/web` - Next.js frontend.
- `apps/daemon` - Express API and static web server.
- `packages/contracts` - Shared web/daemon TypeScript contracts.
- `packages/db` - Database schema package retained for hosted/Postgres work.
- `deploy` - Dockerfile and Compose setup for serving the app.

The Docker image runs a single Node process: `apps/daemon/dist/cli.js --no-open`. The daemon serves `/api/*`, `/artifacts/*`, and the static export from `apps/web/out` on port `7456`.

## Local development

```bash
corepack enable
pnpm install
pnpm --filter @open-design/daemon dev
```

In another shell, run the web app if you want Next's dev server:

```bash
OD_PORT=7456 pnpm --filter @open-design/web dev
```

The web dev server proxies `/api/*` to the daemon through `OD_PORT`.

## Production build

```bash
pnpm --filter @open-design/db build
pnpm --filter @open-design/daemon build
pnpm --filter @open-design/web build
```

## Docker

```bash
cd deploy
docker compose up -d --build
```

Open `http://localhost:7456`.

## Removed on purpose

This fork does not spawn local agents and does not include Claude Code, Codex, MCP, plugins, packaged Electron, desktop sidecars, bundled skills, design systems, or media-generation workflows. API routes for those removed features either return empty catalog responses or `410 Gone` style errors so the remaining UI fails closed.
