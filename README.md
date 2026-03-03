# IntentFlow Frontend

React + Vite dashboard that reads backend API data.

## Launch-ready setup

1. Copy environment template:

```bash
cp .env.example .env
```

2. Pick one connection mode:

### A) Proxy mode (recommended for local dev)

```bash
VITE_API_BASE_URL=
VITE_DASHBOARD_PATH=/api/dashboard
VITE_PROXY_TARGET=http://localhost:5000
VITE_REQUEST_TIMEOUT_MS=8000
```

- Frontend calls `VITE_DASHBOARD_PATH`.
- Vite dev server forwards `/api/*` to `VITE_PROXY_TARGET`.
- Avoids browser CORS issues during local development.

### B) Direct mode (staging/production)

```bash
VITE_API_BASE_URL=https://api.your-domain.com
VITE_DASHBOARD_PATH=/api/dashboard
VITE_REQUEST_TIMEOUT_MS=8000
```

- Frontend calls `VITE_API_BASE_URL + VITE_DASHBOARD_PATH`.

## Supported backend responses

- Raw object / array / scalar payloads.
- Envelopes like `{ data: ... }` and `{ result: ... }`.
- Non-JSON responses are displayed as text.

## Troubleshooting `package.json` parse errors (Vercel)

If deploy logs show JSON parse errors like `Expected ',' or '}' after property value`, validate locally before deploy:

```bash
npm run validate:package
```

This checks `package.json` syntax exactly as JSON and fails fast if commas/braces are invalid.

For CI / Vercel, use:

```bash
npm run ci:check
```

This runs package validation, lint, and production build in one command.

## Vercel configuration note

This repo now includes:

- `vercel-build` script that runs `npm run ci:check`

If your Vercel project uses the default build command, set it to:

```bash
npm run vercel-build
```

This ensures malformed `package.json` is caught before Vite build.

## Pre-launch checklist

- Confirm `VITE_DASHBOARD_PATH` matches your backend route exactly.
- In direct mode, confirm backend CORS allows your frontend origin.
- Validate timeout value (`VITE_REQUEST_TIMEOUT_MS`) for your environment.
- Validate package syntax with `npm run validate:package`.
- Run full checks with `npm run ci:check`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
npm run validate:package
npm run ci:check
npm run vercel-build
```
