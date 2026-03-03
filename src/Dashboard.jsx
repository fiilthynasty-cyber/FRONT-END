import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const DASHBOARD_PATH = import.meta.env.VITE_DASHBOARD_PATH ?? "/api/dashboard";
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS ?? 8000);

function resolveEndpoint(baseUrl, path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!baseUrl) {
    return normalizedPath;
  }

  return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}

function unwrapBackendPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  if ("data" in payload && payload.data !== undefined) {
    return payload.data;
  }

  if ("result" in payload && payload.result !== undefined) {
    return payload.result;
  }

  return payload;
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function Results({ value }) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return <p className="empty">No records returned.</p>;
    }

    return (
      <section className="results">
        {value.map((item, index) => (
          <article key={`item-${index}`} className="result-row">
            <h2>Item {index + 1}</h2>
            <pre>{formatValue(item)}</pre>
          </article>
        ))}
      </section>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);

    if (!entries.length) {
      return <p className="empty">Backend returned an empty object.</p>;
    }

    return (
      <section className="results">
        {entries.map(([key, entryValue]) => (
          <article key={key} className="result-row">
            <h2>{key}</h2>
            <pre>{formatValue(entryValue)}</pre>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="results">
      <article className="result-row">
        <h2>Value</h2>
        <pre>{formatValue(value)}</pre>
      </article>
    </section>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const endpoint = useMemo(() => resolveEndpoint(API_BASE_URL, DASHBOARD_PATH), []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const payload = await response.json();
      setData(unwrapBackendPayload(payload));
      setLastUpdated(new Date());
    } catch (err) {
      setData(null);
      if (err instanceof Error && err.name === "AbortError") {
        setError(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <main className="dashboard">
      <div className="title-row">
        <h1>Dashboard</h1>
        <button onClick={loadDashboard} disabled={loading} className="refresh-button">
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <p className="subtext">Endpoint: {endpoint}</p>
      {lastUpdated && <p className="meta">Last updated: {lastUpdated.toLocaleString()}</p>}

      {error && (
        <p className="error">
          Could not load backend data: <strong>{error}</strong>
        </p>
      )}

      {!error && !loading && <Results value={data} />}
    </main>
  );
}
