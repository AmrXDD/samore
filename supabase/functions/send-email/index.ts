// Supabase Edge Function: send-email
// A thin, secured relay to Resend. Callable from database webhooks or the app
// to send transactional email server-side without exposing the API key.
//
// Deploy:  supabase functions deploy send-email
// Secrets: supabase secrets set RESEND_API_KEY=... EMAIL_FROM=... EDGE_FUNCTION_SECRET=...

import { corsHeaders } from "../_shared/cors.ts";

interface EmailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Shared-secret gate.
  const expected = Deno.env.get("EDGE_FUNCTION_SECRET");
  if (expected && req.headers.get("x-edge-secret") !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") ?? "SAMORE <no-reply@samore-eng.com>";
  if (!apiKey) {
    return json({ error: "RESEND_API_KEY not configured" }, 500);
  }

  let payload: EmailPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!payload.to || !payload.subject || (!payload.html && !payload.text)) {
    return json({ error: "Missing to, subject, or body" }, 400);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return json({ error: "Resend error", detail: data }, 502);
  }
  return json({ ok: true, id: data.id });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
