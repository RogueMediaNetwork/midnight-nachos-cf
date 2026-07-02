# YOU × AI Summit Attendee App — Cloudflare Deployment Guide

Attendee companion app for the **YOU × AI Summit** (youxai.live) — September 12, 2026 · PACC, Waco, TX.

## Stack
- **Frontend:** React + Vite + Tailwind → static files on Cloudflare Pages
- **AI Concierge:** Cloudflare Pages Function → Claude (`/api/concierge`)
- **Announcements & Q&A:** Cloudflare Pages Functions → Cloudflare KV

## Features
- **Home** — countdown, live announcements feed, quick stats
- **Schedule** — full day across Main Stage / AI Track / Creator Track, with a starred "My Agenda" (saved in the attendee's browser)
- **Speakers** — practitioner lineup with session cross-links
- **Q&A** — attendees submit and upvote questions per session (KV-backed)
- **Concierge** — Claude-powered chat that knows the schedule, speakers, and logistics
- **Info** — venue, WiFi, tickets, FAQ

## Updating event content
All event content lives in plain data files — no CMS needed:
- `src/data/event.ts` — date, venue, WiFi, hashtag
- `src/data/schedule.ts` — sessions (currently a **draft agenda**; flip `SCHEDULE_IS_DRAFT` to `false` when final)
- `src/data/speakers.ts` — speaker lineup and bios

The AI concierge automatically picks up changes to these files.

---

## Step 1: Create a KV Namespace

In Cloudflare dashboard → **Workers & Pages → KV**:
1. Click **Create a namespace**
2. Name it: `YOUXAI_EVENT`
3. Copy the **Namespace ID**

Update `wrangler.toml`:
```
id = "PASTE_YOUR_KV_ID_HERE"
preview_id = "PASTE_YOUR_KV_ID_HERE"  # can use same ID for now
```

## Step 2: Create Cloudflare Pages Project

1. Go to **Workers & Pages → Create → Pages**
2. Connect this GitHub repo (or use Direct Upload)
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

## Step 3: Bind KV to Your Pages Project

In your Pages project → **Settings → Functions → KV namespace bindings**:
- Variable name: `EVENT_KV`
- KV namespace: select `YOUXAI_EVENT`

## Step 4: Add Environment Variables

In Pages project → **Settings → Environment Variables** (Production + Preview):
- `ANTHROPIC_API_KEY` = your Claude API key from console.anthropic.com (concierge falls back to canned answers without it)
- `ADMIN_KEY` = a long random string (optional — enables publishing announcements)

## Step 5: Custom Domain

In the Pages project → **Custom Domains**, add e.g. `app.youxai.live`. Since youxai.live is on Cloudflare DNS it auto-configures.

---

## Publishing an announcement (organizers)

```bash
curl -X POST https://app.youxai.live/api/announcements \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{"title":"Doors are open!","body":"Badge pickup in the PACC lobby.","priority":"important"}'
```

`priority` is `"info"` (default) or `"important"` (highlighted amber in the app).

---

## Deploy

Via GitHub (recommended): push to the connected branch — Pages auto-deploys.

Via CLI:
```bash
npm install
npm run deploy
```

## API surface
- `GET /api/announcements` — announcement feed (seeded on first read)
- `POST /api/announcements` — organizer-only (requires `x-admin-key`)
- `GET|POST /api/questions` — attendee Q&A board
- `POST /api/questions/[id]/upvote` — upvote a question
- `POST /api/concierge` — AI concierge chat (`{ messages: [{role, content}] }`)

100% Cloudflare edge — no Node server.
