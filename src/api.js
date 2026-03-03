const API_BASE = import.meta.env.VITE_API_BASE;

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/`);
  return res.json();
}

export async function getLeads() {
  const res = await fetch(`${API_BASE}/api/getLeads`);
  return res.json();
}
