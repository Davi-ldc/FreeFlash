# FreeFlash 🚀

An opinionated, simple, scalable dev stack optimized for hosting cost reduction.

## Features

- 💰 **Free:** Within the limits of 100k requests per day (static assets doesent count), you only need to pay for the domain (11 USD/year). If you need more than that, with 5 USD/month you can get up to 10M requests.
- ⚡ **Flash:** SSR on Cloudflare Workers with Elysia. [Running on edge leads to **9x smaller** _cold starts_ than traditional serverless functions and **2x faster** _warm starts_](https://www.openstatus.dev/blog/monitoring-latency-vercel-edge-vs-serverless). Usando elysia@html o site gasta em média 0.4cpu-ms pra responder a requisição.


## Installation

```bash
git clone https://github.com/Davi-ldc/FreeFlash.git
cd FreeFlash
```

In `/cms` create a new Sanity project:

```bash
cd cms
bun create sanity@latest
```

Create a `.env` file in the `app` folder with:

```env
SANITY_STUDIO_PROJECT_ID=xxxxxxxx
SANITY_WEBHOOK_SECRET=xxxxxxxxxx
SANITY_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

GITHUB_REPO=yourusername/yourrepo
GITHUB_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

TURBO_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TURBO_TEAM=yourteamname
```

Then run:

```bash
bun i

# Run both Sanity and App
bun dev

# Manual build of the app
bun run build

# Workspace-specific commands
bun dev:app
bun dev:cms

# Analyze server bundle size (after running build)
cd app
bun run analyze

# Or from root
bun run a
```

## Setup

### Cloudflare Configuration

Go to https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/

Navigate to Compute (Workers), select your main worker and add a KV in "Bindings", then go to:
- https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/workers/kv/namespaces
- https://dash.cloudflare.com/profile/api-tokens - create a token with read and write permissions for Workers KV or use the preset: "Edit Cloudflare Workers"

Run:
```bash
bunx wrangler kv namespace create CONTENT_KV
```

### Generate Webhook Secret

Generate a hash:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Sanity Token

In Sanity, go to Settings → API → Tokens → Editor. Create a token named something like "Cloudflare Worker Sync Token" with:
- Read and write access to all datasets, with limited access to project settings (Tokens: read+write)

## Notes

- If Vite changes, you need to run build again due to the manifest :(
- You could use Promise.all in deployment, but then you'd have to manually handle caching without Turborepo
- Only the CMS needs to be managed separately. I preferred to leave it out of turbo.json because otherwise, when GitHub Actions updates, instead of deploying only the main worker, the build will have a cache miss and redeploy all APIs.