# IntentFlow Frontend

React + Vite dashboard that reads backend API data.

## Make it better matched to your backend

Create `.env` in the project root and choose one mode.

### Proxy mode (recommended for local dev)

```bash
VITE_DASHBOARD_PATH=/api/dashboard
VITE_PROXY_TARGET=http://localhost:5000
VITE_REQUEST_TIMEOUT_MS=8000
```

- Frontend calls `VITE_DASHBOARD_PATH` (for example `/api/dashboard`).
- Vite forwards `/api/*` to `VITE_PROXY_TARGET`.

### Direct mode

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_DASHBOARD_PATH=/api/dashboard
VITE_REQUEST_TIMEOUT_MS=8000
```

- Frontend calls `VITE_API_BASE_URL + VITE_DASHBOARD_PATH` directly.

## Supported backend response shapes

- Raw object/array/scalar payloads.
- Envelope payloads like `{ data: ... }` and `{ result: ... }`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
