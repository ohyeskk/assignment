# Gather — Even8 Event Lead Manager

A small event lead manager built for the Even8 AI Native Full Stack Intern assignment. It keeps event contacts in one place and helps draft a personal follow-up from meeting notes.

## Features

- Add, edit, delete, search, and filter event leads.
- Store a lead's name, company, email, event, notes, and follow-up status in Supabase Postgres.
- Generate an editable follow-up email draft from a lead's notes with the Gemini API.
- Responsive React interface for desktop and mobile.
- Keep database and AI credentials in server-side environment variables.

## Stack

- React 19 and Vite for the frontend.
- Vercel Functions for the small `/api` backend.
- Supabase Postgres for persistent lead storage.
- Gemini `generateContent` API for follow-up drafts.

The frontend only calls this app's `/api` routes. The Supabase secret key and Gemini API key are read by the server functions and must never be prefixed with `VITE_` or committed to GitHub.

## Run locally

1. Install Node.js 20 or newer.
2. Install dependencies with `npm install`.
3. Create a Supabase project and run [`db/schema.sql`](db/schema.sql) in the Supabase SQL Editor.
4. Copy `.env.example` to `.env.local` and fill in the values from your Supabase project and Google AI Studio.
5. Start the app and its API routes with the Vercel CLI: `npx vercel dev`.

The regular Vite command (`npm run dev`) serves the frontend only; use `npx vercel dev` to run both the frontend and `/api` functions locally.

## Environment variables

| Variable | Where to find it | Used for |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project settings | Server-side database REST requests |
| `SUPABASE_SECRET_KEY` | Supabase project API keys | Server-side database access; never expose in the browser |
| `GEMINI_API_KEY` | Google AI Studio | Server-side AI follow-up generation |
| `GEMINI_MODEL` | Optional; defaults to `gemini-3.8-flash` | Select the Gemini model |

Add the same variables to the Vercel project's environment settings before deployment. Do not share keys in chat, commit them, or include them in screenshots.

## Deploy

1. Import this GitHub repository into Vercel.
2. Add the environment variables above in the Vercel project settings.
3. Deploy. Vercel builds the Vite app and serves the files in `api/` as server functions.
4. Add the live URL to this README after deployment.

## Database

The schema is in `db/schema.sql`. It creates one `leads` table with a UUID primary key, required contact name and email, optional company/event/notes, a constrained follow-up status, and timestamps. The server accesses the table with Supabase's server-side secret key. Row Level Security is enabled, with no public anonymous table policies.

## AI behavior

`POST /api/ai-draft` sends only the lead's name, company, event, and notes to Gemini. It asks for a short editable draft, and explicitly tells the model not to invent details. The app never sends the email automatically.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/leads` | List leads, newest first |
| `POST` | `/api/leads` | Validate and create a lead |
| `PATCH` | `/api/leads/:id` | Validate and update a lead |
| `DELETE` | `/api/leads/:id` | Delete a lead |
| `POST` | `/api/ai-draft` | Generate an editable follow-up draft |

## Notes for the assignment demo

Use fictional lead data in the public demo. The assignment app does not include user sign-in, so its server routes are publicly reachable on the deployed URL. The database secret stays server-side and anonymous direct access to the table is blocked by Row Level Security, but anyone who finds the app URL can use its lead routes. Do not store real contact data until access control is added.

## Requirement checklist

- [x] Add, edit, delete, search, and filter leads
- [x] Lead fields: name, company, email, event, notes, follow-up status
- [x] Persistent database schema and API routes
- [x] AI-generated follow-up draft based on notes
- [x] Responsive UI
- [x] Setup and deployment documentation
- [ ] Add the deployed URL after publishing
