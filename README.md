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

## Architecture

### User Journey (3 Steps)
1. **Sign up** → Get 5 free AI actions
2. **Choose chat app** → WhatsApp, Telegram, or iMessage
3. **Start chatting** → Agent is live in 60 seconds

### Behind the Scenes

**Free Tier:**
- Shared VPS (20 users per server)
- 5 actions limit
- Automatic payment prompt after limit

**Pro Tier ($20/mo):**
- Dedicated Hetzner CPX11 server
- Unlimited actions
- Full OS-level isolation

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Hono.js, Node.js 20+ |
| Database | Supabase (PostgreSQL) |
| VPS | Hetzner Cloud (€4.15/mo per user) |
| DNS | Cloudflare |
| Payments | Stripe |
| Logging | Axiom |
| Deploy | Vercel (frontend), Render (backend) |

## Security

OpenClaw gateway is **completely secure** from IP exploits:

1. **UFW Firewall** - Blocks port 18789 from internet
2. **Loopback Binding** - Gateway only listens on 127.0.0.1
3. **Nginx Proxy** - HTTPS termination on port 443
4. **Token Auth** - Bearer token required, `allowInsecureAuth: false`
5. **Dedicated IPs** - Pro users get isolated VPS

Even if someone gets your VPS IP, they **cannot access** the gateway. See `SECURITY.md` for detailed analysis.

## Project Structure

```
simple-claw/
├── backend/               # Hono.js API (Render)
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── lib/          # Hetzner, Cloudflare, Stripe
│   │   └── db/           # Drizzle ORM + migrations
│   └── drizzle/          # Auto-generated migrations
├── src/                  # Next.js frontend (Vercel)
│   ├── app/              # Pages (landing, dashboard, onboarding)
│   ├── utils/            # Client-side utilities
│   └── lib/              # Supabase client
├── infra/
│   └── cloud-init.yaml   # VPS bootstrap script
├── docs/                 # Vision & architecture
└── SECURITY.md           # Security analysis
```

## Quick Start

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in API keys (see backend/SETUP_CHECKLIST.md)
pnpm install
pnpm db:generate
pnpm dev
```

### Frontend Setup
```bash
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and keys
pnpm install
pnpm dev
```

Open http://localhost:3000

## Deployment

### Backend (Render)
```bash
git push origin main
# Render auto-deploys from render.yaml
# Add env vars in Render dashboard
```

See `backend/DEPLOYMENT.md` for full guide.

### Frontend (Vercel)
```bash
vercel
# Follow prompts, add env vars
```

## API Keys Needed

| Service | Purpose | Get From |
|---------|---------|----------|
| Supabase | Database + Auth | supabase.com/dashboard |
| Hetzner | VPS provisioning | console.hetzner.cloud |
| Cloudflare | DNS management | dash.cloudflare.com |
| Stripe | Payments | dashboard.stripe.com |
| Axiom | Logging | app.axiom.co |

Full setup guide: `backend/SETUP_CHECKLIST.md`

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

## Cost Breakdown (Per User)

| Item | Cost | Revenue | Margin |
|------|------|---------|--------|
| Hetzner VPS | €4.15/mo | - | - |
| Stripe fees | $0.30 + 2.9% | - | - |
| Total cost | ~$4.90 | $20/mo | **$15.10** |

**At 100 Pro users:** $1,510/mo profit
**At 1,000 Pro users:** $15,100/mo profit

## Development

### Run Tests
```bash
pnpm test
```

### Generate Migration
```bash
cd backend
pnpm db:generate
```

### Database Studio
```bash
cd backend
pnpm db:studio
```

### Logs (Production)
View at: https://app.axiom.co

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open Pull Request

## Documentation

- `backend/README.md` - Backend architecture
- `backend/SETUP_CHECKLIST.md` - Setup guide
- `backend/DEPLOYMENT.md` - Deploy to production
- `SECURITY.md` - Security analysis
- `docs/LIFE_OS_VISION.md` - Product vision
- `docs/INFRA_ARCHITECTURE.md` - Infrastructure design
- `BLOCKERS.md` - Current blockers
- `KEYS_NEEDED.md` - Required API keys

## License

MIT

## Support

- GitHub Issues: Report bugs
- Email: support@lifeos.app (coming soon)

---

Built with ❤️ by Voltaic Studio
