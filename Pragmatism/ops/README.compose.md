# Pragmatism App Compose (Dev)

This root-level `docker-compose.yml` spins up:

- `api`: runs the prebuilt Go binary `Server/bin/PragmatismApp` (Linux build) and exposes port 3000 inside the network.
- `nginx`: serves the built SPA from `Client/dist` and proxies `/api` to the Go server.

Prereqs:
- Build the client: from `Client/`, run `npm ci && npm run build`. Output must exist at `Client/dist`.
- Build the server (Linux target): from `Server/`, run PowerShell:
  - `set GOOS=linux; set GOARCH=amd64; go build -o ./bin/PragmatismApp ./cmd/app`

Run:
- `docker compose up -d`
- Open http://localhost:8080

Notes:
- The compose uses volume mounts so changes to `Client/dist` or the server binary reflect immediately on container restart.
- For production with TLS, provide your certs and swap `ops/nginx/default.conf` with your `pragmatism_app_nginx.config` adapted for container paths (e.g., use `proxy_pass http://pragmatism-api:3000/`).
