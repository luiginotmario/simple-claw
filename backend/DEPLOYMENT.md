# Deployment Guide

## Quick Deploy to Render

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial backend setup"
git push origin main
```

### 2. Create Render Account

Go to [render.com](https://render.com) and sign up

### 3. Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Select `simple-claw` repository
4. Render will detect `render.yaml` automatically
5. Click "Apply"

### 4. Add Environment Variables

In Render dashboard, go to Environment tab and add:

```env
NODE_ENV=production
PORT=3001

# Supabase (get from supabase.com/dashboard)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# Hetzner (get from console.hetzner.cloud)
HETZNER_API_TOKEN=your-token-here

# Cloudflare (get from dash.cloudflare.com)
CLOUDFLARE_API_TOKEN=your-token-here
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_DOMAIN=lifeos.app

# Stripe (get from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Axiom (get from app.axiom.co)
AXIOM_TOKEN=your-token-here
AXIOM_DATASET=lifeos-production

# Auto-generated on first deploy
ENCRYPTION_KEY=(let Render generate this)
```

### 5. Deploy

Click "Manual Deploy" → "Deploy latest commit"

### 6. Setup Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.onrender.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in Render

### 7. Test

```bash
curl https://your-app.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T...",
  "env": "production"
}
```

## Automated Migrations

Migrations run automatically on every deploy:
1. Render builds: `pnpm install && pnpm build`
2. Render starts: `pnpm start`
3. Server runs migrations before accepting requests
4. If migration fails, deploy fails (safe)

## Generate New Migration

When you change the schema:

```bash
# 1. Update src/db/schema.ts
# 2. Generate migration
pnpm db:generate

# 3. Commit
git add drizzle/
git commit -m "Add new schema changes"
git push

# Migration runs automatically on next deploy
```

## Local Development

```bash
# 1. Copy env example
cp .env.example .env

# 2. Fill in your keys
nano .env

# 3. Install deps
pnpm install

# 4. Generate initial migration
pnpm db:generate

# 5. Run dev server (migrations run automatically)
pnpm dev
```

## Monitoring

- **Logs:** View in Render dashboard → Logs tab
- **Axiom:** View at app.axiom.co → Your dataset
- **Metrics:** Render shows CPU/RAM usage

## Rollback

If a deploy breaks:
1. Go to Render dashboard
2. Click "Rollback" → Select previous working deploy
3. Migrations are idempotent (safe to re-run)

## Scaling

- **Free Tier:** Render Free plan (512MB RAM)
- **Starter:** $7/mo (512MB RAM) - Good for first 100 users
- **Standard:** $25/mo (2GB RAM) - Good for 1000+ users
- **Pro:** $85/mo (4GB RAM) - Good for 10K+ users

## Database Connection

Using Supabase connection pooler for production:
- Direct connection for migrations
- Pooled connection for app queries
- Max 10 connections per instance
