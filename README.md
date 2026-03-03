# IntentFlow Frontend

Simple React + Vite dashboard wired to a backend endpoint.

## Configure backend connection

Create a `.env` file in the project root and set:

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_DASHBOARD_PATH=/api/dashboard
```

- `VITE_API_BASE_URL`: backend host (protocol + domain + optional port).
- `VITE_DASHBOARD_PATH`: API path used by the dashboard view.

If your backend uses a different route, update `VITE_DASHBOARD_PATH` so the frontend matches it.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
