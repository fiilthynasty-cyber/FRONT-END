import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
const DASHBOARD_PATH = import.meta.env.VITE_DASHBOARD_PATH ?? "/api/dashboard";

function formatValue(value) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint = useMemo(() => {
    const normalizedBase = API_BASE_URL.replace(/\/$/, "");
    const normalizedPath = DASHBOARD_PATH.startsWith("/")
      ? DASHBOARD_PATH
      : `/${DASHBOARD_PATH}`;

    return `${normalizedBase}${normalizedPath}`;
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const payload = await response.json();
      setData(payload);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <main className="dashboard">
      <h1>Backend Dashboard</h1>
      <p className="subtext">Connected endpoint: {endpoint}</p>

      <button onClick={loadDashboard} disabled={loading} className="refresh-button">
        {loading ? "Loading..." : "Refresh"}
      </button>

      {error && (
        <p className="error">
          Could not load backend data: <strong>{error}</strong>
        </p>
      )}

      {!error && !loading && data && (
        <section className="results">
          {Object.entries(data).map(([key, value]) => (
            <article key={key} className="result-row">
              <h2>{key}</h2>
              <pre>{formatValue(value)}</pre>
            </article>
          ))}
        </section>
      )}

      {!error && !loading && !data && <p className="empty">No data returned from backend.</p>}
    </main>
  );
}
