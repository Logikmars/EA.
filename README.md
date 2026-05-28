## Art Nation

This repository contains:

- `front`: Next.js frontend and contact form route
- `back`: Express admin/auth/content API

## Local Setup

1. Install dependencies in both apps.

```bash
cd front && npm install
cd ../back && npm install
```

2. Create local env files from the examples:

```bash
copy front\.env.local.example front\.env.local
copy back\.env.example back\.env
```

3. Start the backend and frontend in separate terminals:

```bash
cd back && npm run dev
cd front && npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

## Environment Notes

Backend:

- `FRONTEND_URL` must match the real frontend origin for CORS.
- `AUTH_SECRET` must be a long random value in production.
- `ADMIN_PASSWORD_HASH` should be generated with `cd back && npm run hash:admin-password`.
- `TRUST_PROXY` should stay `false` unless Express is actually behind a trusted reverse proxy.

Frontend:

- `NEXT_PUBLIC_API_URL` must point to the Express backend origin.
- `NEXT_PUBLIC_SITE_URL` should match the public site URL in production.
- `TRUSTED_PROXY_IP_HEADERS` should be empty by default. Set it only if your platform provides a trusted client-IP header for the contact form route.

## Proxy And Rate Limit Safety

The project now avoids trusting arbitrary `X-Forwarded-For` values by default.

- For the Express backend, set `TRUST_PROXY` only when you control the reverse proxy chain.
- For the Next.js contact form route, set `TRUSTED_PROXY_IP_HEADERS` only to headers added by your platform, such as `cf-connecting-ip`, `x-real-ip`, or another documented trusted header.
- Do not copy client-supplied forwarding headers from the public internet straight into app logic.

## Verification Before Deploy

Run these checks before release:

```bash
cd front && npm run lint && npm run build
cd ../back && npm run dev
```

Also verify:

- `/robots.txt`
- `/sitemap.xml`
- admin login flow
- contact form delivery
- backend CORS with the real frontend domain
