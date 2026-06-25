# Midnight Nachos — Cloudflare Deployment Guide

## Stack
- **Frontend:** React + Vite → static files on Cloudflare Pages
- **AI Chef:** Cloudflare Pages Functions → Claude (claude-sonnet-4-6)
- **Stories:** Cloudflare KV (persists across requests)

---

## Step 1: Create a KV Namespace

In Cloudflare dashboard → **Workers & Pages → KV**:
1. Click **Create a namespace**
2. Name it: `MIDNIGHT_NACHOS_STORIES`
3. Copy the **Namespace ID** — you'll need it

Update `wrangler.toml`:
```
id = "PASTE_YOUR_KV_ID_HERE"
preview_id = "PASTE_YOUR_KV_ID_HERE"  # can use same ID for now
```

---

## Step 2: Create Cloudflare Pages Project

1. Go to **Workers & Pages → Create → Pages**
2. Connect your GitHub repo (push this project to GitHub first)
   - OR use **Direct Upload** if you don't want GitHub
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave blank)

---

## Step 3: Bind KV to Your Pages Project

In your Pages project → **Settings → Functions → KV namespace bindings**:
- Variable name: `STORIES_KV`
- KV namespace: select `MIDNIGHT_NACHOS_STORIES`

---

## Step 4: Add Environment Variables

In Pages project → **Settings → Environment Variables**:
- `ANTHROPIC_API_KEY` = your Claude API key from console.anthropic.com

Add for both **Production** and **Preview** environments.

---

## Step 5: Connect midnightnachos.com

In Cloudflare Pages project → **Custom Domains**:
1. Click **Set up a custom domain**
2. Enter: `midnightnachos.com`
3. Since the domain is already on Cloudflare DNS, it'll auto-configure ✓

---

## Deploy via GitHub (recommended)
```bash
git init
git add .
git commit -m "initial commit"
# push to your GitHub repo
# Cloudflare Pages will auto-deploy on every push
```

## Deploy via CLI (manual)
```bash
npm install
npm run deploy
```

---

## How the AI Works
- `/api/munchies-chef` → Cloudflare Pages Function → Claude API
- `/api/stories` → Cloudflare Pages Function → KV store
- `/api/stories/[id]/upvote` → Cloudflare Pages Function → KV store

No Node.js server, no Express, no Gemini — 100% Cloudflare edge.
