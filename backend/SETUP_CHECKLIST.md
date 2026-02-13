# Backend Setup Checklist

## ✅ Infrastructure Complete

### What's Built:

1. **Hono.js API** - Fast, lightweight backend framework
2. **Drizzle ORM** - Automated database migrations
3. **Hetzner Integration** - Real VPS provisioning (shared + dedicated)
4. **Cloudflare DNS** - Automatic subdomain creation
5. **Stripe Integration** - Payment webhooks & auto-upgrade
6. **Axiom Logging** - Structured production logs
7. **Auth Middleware** - Supabase JWT verification
8. **Security Layer** - Gateway token system, firewall config

### Project Structure:

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts          # Environment config with Zod validation
│   ├── db/
│   │   ├── schema.ts         # Drizzle schema definitions
│   │   └── index.ts          # Database client + auto-migrations
│   ├── lib/
│   │   ├── hetzner.ts        # VPS provisioning (shared + dedicated)
│   │   ├── cloudflare.ts     # DNS management
│   │   ├── stripe.ts         # Payment handling
│   │   ├── logger.ts         # Axiom structured logging
│   │   └── database.ts       # Supabase client + types
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── routes/
│   │   ├── provision.ts      # /api/provision endpoints
│   │   └── webhooks.ts       # /api/webhooks/stripe
│   ├── services/
│   │   └── provisioning.ts   # Core provisioning logic
│   └── index.ts              # Server entry point
├── drizzle/                  # Generated migrations (auto-created)
├── drizzle.config.ts         # Drizzle configuration
├── render.yaml               # Render deployment config
├── .env.example              # Environment template
└── package.json              # Dependencies + scripts
```

## 📝 Next Steps (You Need To Do):

### 1. Install Dependencies
```bash
cd backend
pnpm install
```

### 2. Get API Keys

#### Supabase (Database)
- Go to: https://supabase.com/dashboard
- Create new project
- Get from Settings → API:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Get from Settings → Database:
  - `DATABASE_URL` (Connection string)

#### Hetzner (VPS Provider)
- Go to: https://console.hetzner.cloud
- Security → API Tokens
- Create token with **Read & Write** permissions
- Copy to `HETZNER_API_TOKEN`

#### Cloudflare (DNS)
- Go to: https://dash.cloudflare.com
- Select your domain (or add lifeos.app)
- Get Zone ID from Overview page
- Create API token:
  - Permissions: Zone → DNS → Edit
  - Zone Resources: Specific zone → your domain
- Copy `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID`

#### Stripe (Payments)
- Go to: https://dashboard.stripe.com
- Developers → API keys
- Copy `STRIPE_SECRET_KEY` (starts with sk_live_ or sk_test_)
- Setup webhook later (after deploy)

#### Axiom (Logging)
- Go to: https://app.axiom.co
- Create account (free tier is fine)
- Create dataset: "lifeos-production"
- Settings → API tokens → Create token
- Copy `AXIOM_TOKEN`

### 3. Configure Environment
```bash
cp .env.example .env
nano .env
# Fill in all the keys from above
```

### 4. Generate First Migration
```bash
pnpm db:generate
```

This creates initial database schema in `drizzle/` folder.

### 5. Test Locally
```bash
pnpm dev
```

Should output:
```
[INFO] Running database migrations...
[INFO] ✅ Database migrations completed
[INFO] Starting Life OS Backend
🚀 Life OS Backend running on http://localhost:3001
```

### 6. Test Health Endpoint
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T...",
  "env": "development"
}
```

### 7. Deploy to Render (Production)

Follow `DEPLOYMENT.md` guide:
1. Push to GitHub
2. Connect repo to Render
3. Add environment variables
4. Deploy

## 🔒 Security Notes

- ✅ Gateway port (18789) blocked by UFW firewall
- ✅ OpenClaw binds to 127.0.0.1 only (not public IP)
- ✅ Nginx reverse proxy handles HTTPS
- ✅ Bearer token required for all requests
- ✅ `allowInsecureAuth: false` enforced
- ✅ No direct IP access possible

See `../SECURITY.md` for detailed security analysis.

## 📊 Usage Limits

**Free Tier:**
- 5 actions per user
- Shared VPS (20 users per CPX31 server)
- After 5 actions → Automatic Stripe checkout created
- User pays → Migrates to dedicated VPS

**Pro Tier:**
- Unlimited actions
- Dedicated CPX11 server (2 vCPU, 2GB RAM)
- €4.15/mo cost, $20/mo revenue = $15.50 margin

## 🧪 Testing Endpoints

### Provision Free Tier User
```bash
curl -X POST http://localhost:3001/api/provision \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -d '{"plan": "free"}'
```

### Track Action
```bash
curl -X POST http://localhost:3001/api/provision/track-action \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"
```

Response after 5th action:
```json
{
  "shouldPay": true,
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

## 🐛 Troubleshooting

### "Cannot find module '@hono/node-server'"
```bash
pnpm install
```

### "Migration failed"
- Check `DATABASE_URL` is correct
- Verify Supabase project is not paused
- Check connection string format

### "Hetzner API error"
- Verify `HETZNER_API_TOKEN` has Read & Write permissions
- Check if you have billing enabled in Hetzner

### "Cloudflare API error"
- Verify token has Zone:DNS:Edit permission
- Check `CLOUDFLARE_ZONE_ID` is correct
- Make sure domain is active on Cloudflare

## 📦 What's Next?

### For WhatsApp Integration:
1. Create Meta Business Account
2. Get WhatsApp Business API access
3. Add webhook handler in backend
4. Test with sandbox number

### For Frontend Connection:
1. Update frontend to call your Render URL
2. Add Supabase auth to frontend
3. Pass JWT tokens to backend
4. Display agent URLs in dashboard

### For Production:
1. Add rate limiting (hono-rate-limiter)
2. Add request validation (Zod middleware)
3. Add CORS whitelist (only your domain)
4. Setup monitoring alerts (Axiom)
5. Add Sentry for error tracking
