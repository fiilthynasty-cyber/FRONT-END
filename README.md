# IntentFlow Frontend

React + Vite dashboard connected to backend API responses.

## Make it match your backend

Use a `.env` file in the project root.

### Option A (recommended for local dev, avoids CORS): Vite proxy

```bash
VITE_DASHBOARD_PATH=/api/dashboard
VITE_PROXY_TARGET=http://localhost:5000
```

- Frontend will call `/api/dashboard`.
- Vite forwards `/api/*` to `VITE_PROXY_TARGET`.

### Option B: direct backend URL

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_DASHBOARD_PATH=/api/dashboard
```

- Frontend calls `VITE_API_BASE_URL + VITE_DASHBOARD_PATH` directly.

The dashboard supports common backend shapes:
- raw object/array values
- envelope responses like `{ data: ... }` or `{ result: ... }`

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
