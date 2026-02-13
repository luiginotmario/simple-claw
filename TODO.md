# What You Need To Do

## 1. Fix Vercel Build (DONE ✅)

Added `.vercelignore` to exclude backend folder from frontend build.

**Next:** Push changes and redeploy on Vercel.

```bash
git add .vercelignore vercel.json .gitignore
git commit -m "Fix Vercel build - ignore backend"
git push
```

---

## 2. Get API Keys

### Supabase (5 minutes)
1. Go to https://supabase.com/dashboard
2. Create new project (choose region close to you)
3. Wait for project to provision (~2 mins)
4. Go to **Settings → API**:
   - Copy `URL` → `SUPABASE_URL`
   - Copy `anon/public` → `SUPABASE_ANON_KEY`
   - Copy `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Settings → Database**:
   - Click "Connection string" → "URI"
   - Copy full string → `DATABASE_URL`

### Hetzner (3 minutes)
1. Go to https://console.hetzner.cloud
2. Create account + add payment method
3. Create new project: "Life OS"
4. Go to **Security → API tokens**
5. Click "Generate API token"
   - Name: "Life OS Backend"
   - Permissions: **Read & Write**
6. Copy token → `HETZNER_API_TOKEN`

### Cloudflare (5 minutes)
1. Go to https://dash.cloudflare.com
2. Add domain (or use existing)
3. Copy **Zone ID** from Overview → `CLOUDFLARE_ZONE_ID`
4. Go to **Profile → API Tokens**
5. Create Custom Token:
   - Permissions: `Zone → DNS → Edit`
   - Zone Resources: Include → Specific zone → your domain
6. Copy token → `CLOUDFLARE_API_TOKEN`

### Stripe (3 minutes)
1. Go to https://dashboard.stripe.com
2. Toggle "Test mode" ON (top right)
3. Go to **Developers → API keys**
4. Copy `Secret key` → `STRIPE_SECRET_KEY`
5. (Webhook secret comes later after deploy)

### Axiom (2 minutes)
1. Go to https://app.axiom.co/signup
2. Create account (free tier)
3. Create dataset: "lifeos-production"
4. Go to **Settings → Tokens**
5. Create new token → Copy to `AXIOM_TOKEN`

---

## 3. Configure Backend

```bash
cd backend
cp .env.example .env
nano .env
```

Fill in all keys from above.

---

## 4. Test Locally

```bash
# Backend
cd backend
pnpm install
pnpm db:generate
pnpm dev

# In new terminal - Frontend
cd ..
pnpm install
pnpm dev
```

Visit http://localhost:3000

---

## 5. Deploy

### Frontend (Vercel) - ALREADY CONNECTED
1. Push your changes: `git push`
2. Vercel auto-deploys
3. Add env vars in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` = Your Render backend URL

### Backend (Render)
1. Go to https://render.com
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Render detects `render.yaml` automatically
5. Click **Apply**
6. Add all env vars from `.env` in Render dashboard
7. Deploy

### Setup Stripe Webhook (After Render Deploy)
1. Get your Render URL: `https://your-app.onrender.com`
2. Go to Stripe → **Developers → Webhooks**
3. Add endpoint: `https://your-app.onrender.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copy webhook secret → Add to Render env vars as `STRIPE_WEBHOOK_SECRET`
6. Redeploy backend on Render

---

## 6. Test End-to-End

### Test Provisioning:
```bash
curl -X POST https://your-app.onrender.com/api/provision \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -d '{"plan": "free"}'
```

Expected response (2-3 minutes):
```json
{
  "success": true,
  "agentUrl": "https://agent-abc123.lifeos.app",
  "message": "Your AI assistant is ready!"
}
```

---

## Current Status

✅ Backend infrastructure complete
✅ Database schema defined
✅ Automated migrations setup
✅ Hetzner VPS provisioning (shared + dedicated)
✅ Cloudflare DNS automation
✅ Stripe payment flow
✅ Axiom logging integration
✅ Security layer (firewall, token auth)
✅ Vercel build fixed

🔄 Pending:
- [ ] Get API keys
- [ ] Deploy to Render
- [ ] Configure Stripe webhook
- [ ] Test provisioning flow
- [ ] Connect frontend to backend
- [ ] WhatsApp Business API integration
- [ ] Test end-to-end with real user

---

## Deployment Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────────────┐
│  Frontend (Vercel)                   │
│  - Next.js                           │
│  - Supabase Auth                     │
│  - Dashboard UI                      │
└────────────┬─────────────────────────┘
             │
             ↓
┌──────────────────────────────────────┐
│  Backend (Render)                    │
│  - Hono.js API                       │
│  - Provisions VPS                    │
│  - Manages DNS                       │
│  - Handles webhooks                  │
└────────────┬─────────────────────────┘
             │
      ┌──────┴──────┬─────────────┐
      ↓             ↓             ↓
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Hetzner  │  │Cloudflare│  │  Stripe  │
│   VPS    │  │   DNS    │  │ Payments │
└──────────┘  └──────────┘  └──────────┘
      │
      ↓
┌──────────────────────────────────────┐
│  User's VPS (Hetzner)                │
│  - OpenClaw running                  │
│  - Nginx reverse proxy               │
│  - UFW firewall                      │
│  - Systemd auto-restart              │
└──────────────────────────────────────┘
      │
      ↓
┌──────────────────────────────────────┐
│  User's Phone                        │
│  - WhatsApp/Telegram/iMessage        │
└──────────────────────────────────────┘
```

---

## Timeline Estimate

- Get API keys: **20 minutes**
- Deploy backend: **10 minutes**
- Setup webhook: **5 minutes**
- Test: **10 minutes**
- **Total: ~45 minutes**

Then you're live! 🚀
