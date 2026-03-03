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

## Pre-launch checklist

- Confirm `VITE_DASHBOARD_PATH` matches your backend route exactly.
- In direct mode, confirm backend CORS allows your frontend origin.
- Validate timeout value (`VITE_REQUEST_TIMEOUT_MS`) for your environment.
- Run lint and build before deployment.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
