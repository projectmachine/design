# Docker Deployment

The web-only fork is served by one Node process. The daemon exposes the API and serves the static Next export.

```bash
docker compose up -d --build
```

The service binds `127.0.0.1:${OPEN_DESIGN_PORT:-7456}` by default. Put an authenticated reverse proxy in front of it before exposing it beyond localhost.

Persistent runtime data lives in the `open_design_data` volume mounted at `/app/.od`.
