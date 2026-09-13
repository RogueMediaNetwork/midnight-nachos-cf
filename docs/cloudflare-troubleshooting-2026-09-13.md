# Midnight Nachos — Cloudflare Troubleshooting Notes

**Site:** https://midnightnachos.com  
**Repository:** `RogueMediaNetwork/midnight-nachos-cf`  
**Saved:** 2026-09-13  
**Status:** Site reported as not publicly reachable; Cloudflare-side configuration still needs direct verification.

## What we verified

The Midnight Nachos project is present in GitHub and is configured as a Cloudflare Pages site.

Current repo configuration shows:

- Cloudflare project name: `midnight-nachos`
- Build output directory: `dist`
- Front end: React + Vite
- Deployment target: Cloudflare Pages
- Cloudflare KV binding: `STORIES_KV`
- KV namespace ID is populated in `wrangler.toml`
- The repo includes Cloudflare Pages Functions and deployment instructions

The existing `DEPLOY.md` says the intended setup is:

1. Build with `npm run build`
2. Publish `dist`
3. Bind `STORIES_KV`
4. Configure `ANTHROPIC_API_KEY` in Cloudflare Pages environment variables
5. Attach `midnightnachos.com` under the Cloudflare Pages project's **Custom Domains** section

## Current diagnosis

The website code is not the first suspect. The repository and Cloudflare deployment configuration are present, so the failure is more likely at the domain / Pages attachment layer.

The two leading hypotheses are:

### 1. Cloudflare nameserver mismatch

If the Cloudflare zone was deleted and re-added, Cloudflare may have assigned a different pair of authoritative nameservers. If the registrar still points to an older pair, the domain can stop resolving correctly.

### 2. Custom domain became detached from Cloudflare Pages

`midnightnachos.com` may no longer be attached to the `midnight-nachos` Pages project under **Workers & Pages → midnight-nachos → Custom Domains**.

## Exact checks to perform in Cloudflare

### A. Verify zone status

Open Cloudflare → **Websites → midnightnachos.com**.

Confirm:

- Zone status is **Active**
- Cloudflare shows two authoritative nameservers
- Those two nameservers exactly match the nameservers configured at the domain registrar

If they do not match, update the registrar to the nameservers currently assigned by Cloudflare.

### B. Verify DNS records

Open **DNS → Records** for `midnightnachos.com`.

Check whether the apex domain and `www` are present and whether they point to the Pages project as expected.

Do not add random A records before checking the Pages custom-domain configuration; Cloudflare Pages can manage the necessary routing when the custom domain is correctly attached.

### C. Verify Cloudflare Pages custom domain

Open:

**Workers & Pages → midnight-nachos → Custom Domains**

Confirm that:

- `midnightnachos.com` is listed
- Its status is **Active**
- There is no validation, DNS, or certificate error

If the domain is missing, add `midnightnachos.com` again as a custom domain.

### D. Check deployment state

In **Workers & Pages → midnight-nachos → Deployments**:

- Confirm there is a successful production deployment
- Confirm the production deployment is built from the expected repository / branch
- Open the Cloudflare-provided `*.pages.dev` URL

Interpretation:

- If the `pages.dev` URL works but `midnightnachos.com` does not, the problem is DNS/custom-domain configuration.
- If the `pages.dev` URL also fails, inspect the latest deployment/build logs.

### E. Verify environment bindings after the site is reachable

These are not likely to cause the entire domain to disappear, but they matter for app functionality:

- `STORIES_KV` must be bound to the configured KV namespace
- `ANTHROPIC_API_KEY` must exist in the production environment

## Repository details

The existing repo includes:

- `DEPLOY.md`
- `wrangler.toml`
- `package.json`
- `vite.config.ts`
- `src/`
- `functions/`

`package.json` currently provides:

```text
npm run build
npm run deploy
```

The deploy script builds the Vite app and deploys `dist` through Wrangler.

## Recommended order of operations

1. Check Cloudflare zone status and authoritative nameservers.
2. Compare Cloudflare nameservers with the registrar.
3. Check the `midnight-nachos` Pages project's Custom Domains list.
4. Test the `*.pages.dev` production URL.
5. Check the latest production deployment.
6. Only inspect application code if the Pages deployment itself is failing.

## Important note

The nameserver mismatch and detached custom-domain scenarios are **working hypotheses**, not yet confirmed. Direct access to the Cloudflare dashboard is required to identify which one is actually responsible.

Once Cloudflare access is available, record the confirmed root cause and fix in this file so the repo remains the source of truth for the site.
