# Coolify Deployment

The web-only fork is served by one Node process. The daemon exposes the API and serves the static Next export on container port `7456`.

## Coolify Setup

Create a new resource from this repository and choose the Docker Compose build pack.

- Base Directory: `/`
- Docker Compose Location: `deploy/docker-compose.yml`
- Build Pack: Docker Compose

Coolify reads `deploy/docker-compose.yml` as the source of truth. The compose file uses `SERVICE_FQDN_OPENDESIGN_7456` so Coolify can generate or assign a domain and route traffic through its proxy to container port `7456`.

## Required Variables

Set these in Coolify's environment variables screen before deploying:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`DATABASE_URL` should be the Supabase connection-pooler URL. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; only the `NEXT_PUBLIC_*` values are embedded into the static web client during the image build.

Optional tuning:

```env
OPEN_DESIGN_MEM_LIMIT=384m
NODE_OPTIONS=--max-old-space-size=192
```

## Storage

Persistent runtime data lives in the `open_design_data` volume mounted at `/app/.od`.
