# Life OS

**"Her" meets "Apple Shortcuts"** - A premium OpenClaw wrapper that lets anyone run their own AI assistant with zero technical knowledge.

## The Vision

Normal people shouldn't need to understand terminals, config files, or "instances." They just want an AI assistant that works. Life OS handles all the infrastructure automatically:

- ✅ One-click deployment
- ✅ Automatic VPS provisioning (Hetzner)
- ✅ DNS + SSL configured automatically
- ✅ WhatsApp/iMessage/Telegram integration
- ✅ Free tier with automatic upgrade prompts
- ✅ Complete security isolation

## Project Structure

```
lifeos/
├── frontend/          # Next.js web app (Vercel)
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Hono.js API (Render)
│   ├── src/
│   ├── drizzle/
│   └── package.json
├── infra/
│   └── cloud-init.yaml
└── docs/
```

## Quick Start

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
# Opens on http://localhost:3000
```

### Backend
```bash
cd backend
cp .env.example .env
# Fill in API keys
pnpm install
pnpm dev
# Runs on http://localhost:3001
```

## Architecture

**User Journey:**
1. User signs up → Gets agent URL
2. Agent is pre-configured with Life OS's API keys
3. User starts chatting immediately
4. Agent asks: "What's your name?" and learns through conversation

**Tech Stack:**

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Hono.js, Node.js 20+ |
| Database | Supabase (PostgreSQL) |
| VPS | Hetzner Cloud (€4.15/mo per user) |
| DNS | Cloudflare |
| Payments | Stripe |
| Logging | Axiom |

## Security

OpenClaw gateway is **completely secure** from IP exploits:

1. **UFW Firewall** - Blocks port 18789 from internet
2. **Loopback Binding** - Gateway only listens on 127.0.0.1
3. **Nginx Proxy** - HTTPS termination on port 443
4. **Token Auth** - Bearer token required, `allowInsecureAuth: false`
5. **Dedicated IPs** - Pro users get isolated VPS

See `SECURITY.md` for full analysis.

## Cost Breakdown (Per User)

| Item | Cost |
|------|------|
| Hetzner VPS (CPX11) | €4.15 ($4.50) |
| OpenAI API (typical) | $2-5 |
| Stripe fees (2.9% + $0.30) | $0.88 |
| **Total Cost** | **$7.38 - $10.38** |
| **Revenue** | **$20.00** |
| **Profit** | **$9.62 - $12.62** |

## Deployment

### Frontend (Vercel)
```bash
git push origin main
# Vercel auto-deploys from /frontend
```

### Backend (Render)
```bash
git push origin main
# Render auto-deploys using render.yaml
```

See `backend/DEPLOYMENT.md` and `TODO.md` for full setup.

## Features

### Current (MVP)
- ✅ Beautiful glassmorphism UI
- ✅ 3-step onboarding flow
- ✅ Free tier with 5 actions
- ✅ Automatic Stripe checkout after limit
- ✅ VPS provisioning (Hetzner API)
- ✅ DNS management (Cloudflare API)
- ✅ Structured logging (Axiom)
- ✅ Automated database migrations
- ✅ Production-ready cloud-init script

### Coming Soon
- [ ] WhatsApp Business API integration
- [ ] Telegram bot integration
- [ ] iMessage bridge (Mac relay)
- [ ] Dashboard with real agent stats
- [ ] Usage analytics
- [ ] Agent customization (personality, skills)

## API Keys Needed

| Service | Purpose | Get From |
|---------|---------|----------|
| Supabase | Database + Auth | supabase.com/dashboard |
| Hetzner | VPS provisioning | console.hetzner.cloud |
| Cloudflare | DNS management | dash.cloudflare.com |
| Stripe | Payments | dashboard.stripe.com |
| Axiom | Logging | app.axiom.co |
| OpenAI | AI (Life OS provides to users) | platform.openai.com |

Full setup guide: `TODO.md`

## Documentation

- `TODO.md` - Setup checklist
- `SECURITY.md` - Security analysis
- `backend/DEPLOYMENT.md` - Deploy to production
- `docs/LIFE_OS_VISION.md` - Product vision
- `docs/INFRA_ARCHITECTURE.md` - Infrastructure design

## License

MIT

---

Built with ❤️ by Voltaic Studio
