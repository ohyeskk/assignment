import { parseBody, sendJson } from "../lib/api-utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  let input;
  try { input = parseBody(req); } catch { return sendJson(res, 400, { error: "Request body must be valid JSON." }); }
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 120) : "";
  const company = typeof input.company === "string" ? input.company.trim().slice(0, 160) : "";
  const event = typeof input.event === "string" ? input.event.trim().slice(0, 160) : "";
  const notes = typeof input.notes === "string" ? input.notes.trim().slice(0, 4000) : "";
  if (!name) return sendJson(res, 400, { error: "A lead name is required to draft a follow-up." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return sendJson(res, 503, { error: "AI setup is incomplete. Add GEMINI_API_KEY to your local environment and Vercel settings." });

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const prompt = [
    "Write a short, warm, professional follow-up email after meeting an event lead. Return only the email body, with a greeting and a simple sign-off.",
    "Use only facts present in the details below. Do not invent promises, dates, products, or conversation details. Keep it under 120 words. If the notes are empty, write a friendly generic follow-up that does not pretend to remember a specific conversation.",
    `Lead: ${name}`,
    `Company: ${company || "Not provided"}`,
    `Event: ${event || "Not provided"}`,
    `Conversation notes: ${notes || "Not provided"}`,
  ].join("\n");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 220 },
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      const message = result?.error?.message || "The AI provider could not generate a draft.";
      return sendJson(res, 502, { error: message });
    }
    const draft = result?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!draft) return sendJson(res, 502, { error: "The AI provider returned an empty draft. Try again." });
    return sendJson(res, 200, { draft });
  } catch {
    return sendJson(res, 502, { error: "Could not reach the AI provider. Check your connection and try again." });
  }
}
