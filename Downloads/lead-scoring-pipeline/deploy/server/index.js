require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json({ limit: "2mb" }));

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to extract emails from HTML
function extractEmails(html) {
  const matches = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return Array.from(new Set(matches.map((e) => e.toLowerCase()))).slice(0, 50);
}

// Define your API route
app.post("/api/leads/from-url", async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const r = await axios.get(url, { redirect: "follow" });
    if (!r.ok) return res.status(400).json({ error: `Fetch failed: ${r.status}` });
    const html = r.data;

    // Extract emails and other details
    const emails = extractEmails(html);
    const hostname = new URL(url).hostname.replace(/^www\./, "");

    // Create leads
    const leads = emails.map((email) => ({
      name: hostname,
      email,
      company: hostname,
      intent_score: 70,
      source: "organic",
      evidenceUrl: url,
      evidenceSnippet: "Email found on audited page",
    }));

    // Store leads in Supabase
    for (const lead of leads) {
      const { data, error } = await supabase
        .from("leads")
        .upsert(
          {
            name: lead.name,
            email: lead.email,
            company: lead.company,
            intent_score: lead.intent_score,
            source: lead.source,
            last_activity_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        )
        .select("id")
        .single();

      if (error || !data?.id) continue;

      // Insert intent signal for this lead
      await supabase.from("intent_signals").insert({
        lead_id: data.id,
        signal_type: "url_audit_email_found",
        description: "Email found on audited URL",
        weight: 25,
        metadata: { url: lead.evidenceUrl, snippet: lead.evidenceSnippet },
      });
    }

    res.json({ leads });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
});

// Health check endpoint
app.get("/health", (_, res) => res.json({ ok: true }));

// Set up server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));