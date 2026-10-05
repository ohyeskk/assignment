const allowedStatuses = new Set(["New", "Contacted", "Follow-up due", "Qualified", "Closed"]);

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return {};
}

export function validateLead(input, { partial = false } = {}) {
  const allowed = ["name", "company", "email", "event", "notes", "follow_up_status"];
  const result = {};
  for (const key of allowed) {
    if (partial && !(key in input)) continue;
    const value = input[key];
    result[key] = typeof value === "string" ? value.trim() : value;
  }

  if (!partial || "name" in result) {
    if (typeof result.name !== "string" || result.name.length < 1 || result.name.length > 120) {
      return { error: "Name is required and must be under 120 characters." };
    }
  }
  if (!partial || "email" in result) {
    if (typeof result.email !== "string" || result.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) {
      return { error: "Enter a valid email address." };
    }
  }
  for (const key of ["company", "event", "notes"]) {
    if (key in result && typeof result[key] !== "string") return { error: `Invalid ${key} value.` };
  }
  if (("company" in result && result.company.length > 160) || ("event" in result && result.event.length > 160) || ("notes" in result && result.notes.length > 4000)) {
    return { error: "A field is longer than allowed." };
  }
  if ("follow_up_status" in result && !allowedStatuses.has(result.follow_up_status)) {
    return { error: "Choose a valid follow-up status." };
  }
  return { value: result };
}

export async function supabaseRequest(path, options = {}) {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const legacyServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = secretKey || legacyServiceRoleKey;
  if (!url || !key) throw new Error("Database setup is incomplete. Add SUPABASE_URL and SUPABASE_SECRET_KEY in your local environment and Vercel settings.");

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      ...(legacyServiceRoleKey && !secretKey ? { Authorization: `Bearer ${legacyServiceRoleKey}` } : {}),
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.text();
  let data = null;
  try { data = body ? JSON.parse(body) : null; } catch { data = null; }
  if (!response.ok) {
    const message = data?.message || data?.hint || "The database request failed.";
    throw new Error(message);
  }
  return data;
}
