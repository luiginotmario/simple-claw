# Messaging Integration Setup

## Overview

One phone number, multiple users. Messages are routed based on sender's phone number or Telegram chat_id.

---

## 1. Database Setup

Run this in Supabase SQL Editor:

```sql
-- Copy contents from: backend/messaging-integration-setup.sql
```

This creates the `messaging_integrations` table to map:
- **WhatsApp**: `+15551234567` → `user_id`
- **Telegram**: `123456789` (chat_id) → `user_id`

---

## 2. WhatsApp Setup (Twilio)

### A. Get Twilio Number

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Buy a WhatsApp-enabled number (or use sandbox for testing)
3. Copy the number: `+1 (555) 123-4567`

### B. Environment Variables

Add to `whatsapp-router/.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=whatsapp:+15551234567
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
PORT=3002
```

### C. How Routing Works

```
1. User texts Twilio number: "Hello"
   From: +15559876543

2. Twilio webhook → POST https://whatsapp-router.railway.app/webhook
   Body: { From: "whatsapp:+15559876543", Body: "Hello" }

3. Router queries Supabase:
   SELECT user_id, agent_url, gateway_token 
   FROM users u
   JOIN messaging_integrations m ON u.id = m.user_id
   WHERE m.platform = 'whatsapp' 
   AND m.platform_user_id = '+15559876543'

4. Router forwards to user's agent:
   POST https://agent-abc123.lifeos.app/webhook
   Headers: { Authorization: Bearer ${gateway_token} }
   Body: { message: "Hello", from: "+15559876543" }

5. Agent processes → replies back to router:
   POST https://whatsapp-router.railway.app/send
   Body: { to: "+15559876543", message: "Hi! How can I help?" }

6. Router sends via Twilio:
   POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages
   Body: { From: "whatsapp:+15551234567", To: "whatsapp:+15559876543", Body: "Hi! How can I help?" }
```

### D. User Linking Flow

**When new user signs up and selects WhatsApp:**

1. Frontend shows: "Text START to +1 (555) 123-4567"
2. User texts "START" from their phone
3. Router receives message from unknown number
4. Router replies: "Reply with your email to link your account"
5. User replies: "user@example.com"
6. Router:
   - Finds user by email in Supabase
   - Inserts into `messaging_integrations`:
     ```sql
     INSERT INTO messaging_integrations (user_id, platform, platform_user_id)
     VALUES ('user-uuid', 'whatsapp', '+15559876543')
     ```
7. Router replies: "Account linked! Your AI assistant is ready."
8. Future messages from that number → routed to that user's agent

---

## 3. Telegram Setup

### A. Create Bot

1. Open Telegram, message @BotFather
2. Send: `/newbot`
3. Name: `Life OS Assistant`
4. Username: `lifeos_assistant_bot`
5. Copy bot token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### B. Environment Variables

Add to `telegram-router/.env` (or same service as WhatsApp):

```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

### C. How Routing Works

```
1. User opens Telegram bot, sends: "Hello"
   chat_id: 987654321

2. Telegram Bot API → Webhook or Long Polling
   Update: { message: { chat: { id: 987654321 }, text: "Hello" } }

3. Router queries Supabase:
   SELECT user_id, agent_url, gateway_token
   FROM users u
   JOIN messaging_integrations m ON u.id = m.user_id
   WHERE m.platform = 'telegram'
   AND m.platform_user_id = '987654321'

4. Router forwards to agent → Agent replies → Router sends via Telegram Bot API
```

### D. User Linking Flow

**Option 1: Deep Link (Recommended)**

1. Frontend generates link: `https://t.me/lifeos_assistant_bot?start=USER_ID_BASE64`
2. User clicks → Opens Telegram → Sends `/start USER_ID_BASE64`
3. Bot receives message with `chat_id` and `start_param`
4. Bot decodes `USER_ID_BASE64` → links `chat_id` to `user_id`
5. Insert into `messaging_integrations`:
   ```sql
   INSERT INTO messaging_integrations (user_id, platform, platform_user_id)
   VALUES ('decoded-user-uuid', 'telegram', '987654321')
   ```

**Option 2: Manual Linking**

1. User opens bot, sends `/start`
2. Bot replies: "Send your email to link"
3. User sends: "user@example.com"
4. Bot finds user by email → links `chat_id`

---

## 4. Router Service Architecture

**Tech Stack:**
- Node.js + TypeScript
- Hono.js (lightweight API framework)
- Supabase client (for user lookups)
- Twilio SDK (for WhatsApp)
- `node-telegram-bot-api` (for Telegram)

**File Structure:**

```
whatsapp-telegram-router/
├── src/
│   ├── index.ts          # Main server
│   ├── routes/
│   │   ├── whatsapp.ts   # POST /webhook (Twilio)
│   │   ├── telegram.ts   # Telegram bot setup
│   │   └── send.ts       # POST /send (agents reply here)
│   ├── services/
│   │   ├── router.ts     # Core routing logic
│   │   └── supabase.ts   # DB queries
│   └── config.ts
├── package.json
├── .env
└── Railway.toml
```

**Deploy to:** Railway.app (persistent storage, $5/month)

---

## 5. Agent Webhook Endpoint

Each OpenClaw agent needs to **receive messages** from the router.

**Add to `cloud-init.yaml`:**

```yaml
# Webhook endpoint for incoming messages
- |
    cat > /home/openclaw/webhook-handler.js <<'EOF'
    const http = require('http');
    const { spawn } = require('child_process');

    const server = http.createServer((req, res) => {
      if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          const { message, from } = JSON.parse(body);
          
          // Forward to OpenClaw gateway
          const openclaw = spawn('curl', [
            '-X', 'POST',
            'http://127.0.0.1:18789/api/chat',
            '-H', 'Content-Type: application/json',
            '-H', `Authorization: Bearer ${process.env.GATEWAY_TOKEN}`,
            '-d', JSON.stringify({ message })
          ]);
          
          openclaw.stdout.on('data', (data) => {
            const response = JSON.parse(data);
            
            // Send reply back to router
            fetch(process.env.LIFEOS_API_URL + '/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: from,
                platform: 'whatsapp', // or 'telegram'
                message: response.reply
              })
            });
          });
          
          res.writeHead(200);
          res.end('OK');
        });
      }
    });

    server.listen(8080);
    EOF
```

---

## Summary Checklist

**Database:**
- [ ] Run `messaging-integration-setup.sql` in Supabase

**WhatsApp:**
- [ ] Get Twilio account + WhatsApp number
- [ ] Set up Twilio webhook → router URL
- [ ] Add Twilio env vars to router

**Telegram:**
- [ ] Create bot with @BotFather
- [ ] Get bot token
- [ ] Add token to router env vars
- [ ] Set webhook or use long polling

**Router Service:**
- [ ] Build whatsapp-telegram-router
- [ ] Deploy to Railway
- [ ] Test message routing

**OpenClaw Agents:**
- [ ] Add webhook endpoint to cloud-init
- [ ] Test agent receives messages
- [ ] Test agent replies

---

## Next Steps

Want me to build the `whatsapp-telegram-router` service now?
