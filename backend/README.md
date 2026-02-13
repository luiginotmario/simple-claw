# Life OS Backend

Production-ready backend API for Life OS - OpenClaw wrapper with automated provisioning.

## Architecture

- **Framework:** Hono.js (fast, lightweight)
- **Runtime:** Node.js 20+
- **Database:** Supabase (PostgreSQL)
- **Logging:** Axiom
- **Deploy:** Render

## Security

### Free Tier (Shared VPS)
- Multiple users on CPX31 (4 vCPU, 8GB RAM)
- Docker containers with resource limits
- Process-level isolation
- 5 action limit before payment required

### Pro Tier (Dedicated VPS)
- 1 user per CPX11 (2 vCPU, 2GB RAM)
- OS-level isolation
- OpenClaw binds to `127.0.0.1:18789` (loopback only)
- UFW blocks port 18789 from internet
- Nginx reverse proxy on port 443 (HTTPS)
- Gateway requires Bearer token auth
- `allowInsecureAuth: false` enforced

**No Gateway Exploits:** Port 18789 is unreachable from internet. Even with VPS IP, firewall blocks direct access.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

### 3. Setup Database

Run the schema in your Supabase project:

```bash
psql $SUPABASE_URL < schema.sql
```

### 4. Run Development Server

```bash
pnpm dev
```

Server runs on `http://localhost:3001`

## Endpoints

### Health Check
```
GET /health
```

### Provision Agent
```
POST /api/provision
Body: { userId, plan: 'free' | 'pro', email }
```

### Track Action
```
POST /api/provision/track-action
Body: { userId }
```

### Stripe Webhook
```
POST /api/webhooks/stripe
Header: stripe-signature
```

## Deployment (Render)

1. Push to GitHub
2. Connect repo to Render
3. Render will use `render.yaml` config
4. Add environment variables in Render dashboard
5. Deploy

## Environment Variables

See `.env.example` for all required keys.

**Critical:**
- `HETZNER_API_TOKEN` - Read/Write permissions
- `CLOUDFLARE_API_TOKEN` - Zone DNS Edit
- `STRIPE_WEBHOOK_SECRET` - From Stripe dashboard
- `ENCRYPTION_KEY` - 32+ character random string

## Usage Flow

1. User signs up → Free tier
2. Backend provisions shared VPS slot
3. User gets agent URL + 5 free actions
4. On 5th action: Stripe checkout created automatically
5. User pays → Upgrade to dedicated VPS
6. Backend migrates to Pro instance
