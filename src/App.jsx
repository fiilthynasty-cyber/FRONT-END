import { useEffect, useState } from "react";
import { healthCheck, getLeads } from "./api";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const health = await healthCheck();
        setStatus(health.status);

        const data = await getLeads();
        setLeads(data || []);
      } catch (err) {
        setStatus("Backend not available");
      }
    }
    load();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>IntentFlow AI</h2>
        <p>Status: {status}</p>
      </aside>

      <main className="content">
        <h1>Leads</h1>

        {leads.length === 0 ? (
          <p>No leads yet.</p>
        ) : (
          <div className="grid">
            {leads.map((lead) => (
              <div className="card" key={lead.id}>
                <h3>{lead.title}</h3>
                <p>{lead.content}</p>
                <span className={`badge ${lead.intent}`}>
                  {lead.intent}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
      <SpeedInsights />
    </div>
  );
}
