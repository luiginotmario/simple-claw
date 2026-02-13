# Security Architecture

## Question: Is the gateway safe from IP exploits?

**YES. Here's exactly why:**

## The Problem (What You're Worried About)

If OpenClaw's gateway runs on port 18789, could someone:
1. Get the VPS IP address
2. Try to access `http://VPS_IP:18789` directly
3. Bypass your security and access the gateway?

## The Answer: NO - Impossible

### Layer 1: Firewall (UFW)
```bash
ufw allow 22/tcp    # SSH only
ufw allow 80/tcp    # HTTP (redirects to HTTPS)
ufw allow 443/tcp   # HTTPS
ufw deny 18789/tcp  # OpenClaw port BLOCKED
```

If someone tries `http://VPS_IP:18789`:
- **Result:** Connection refused
- **Why:** UFW firewall blocks the port from external traffic

### Layer 2: Loopback Binding
```bash
openclaw gateway --bind loopback --port 18789
```

OpenClaw only listens on `127.0.0.1:18789` (localhost).

This means:
- `http://127.0.0.1:18789` ✅ Works (from inside the server)
- `http://VPS_IP:18789` ❌ Doesn't even try (process not listening on public IP)

### Layer 3: Nginx Reverse Proxy
```nginx
location / {
    proxy_pass http://127.0.0.1:18789;
}
```

Nginx (running on the same VPS) can reach `127.0.0.1:18789` because it's **inside** the server.

External request flow:
```
User → https://agent-abc.lifeos.app:443
  ↓
Nginx (receives on port 443)
  ↓
Forwards to 127.0.0.1:18789 (localhost only)
  ↓
OpenClaw Gateway
```

### Layer 4: Token Authentication
```json
{
  "gateway": {
    "auth": {
      "token": "abc123..."
    },
    "controlUi": {
      "allowInsecureAuth": false
    }
  }
}
```

Even if someone somehow reached the gateway (impossible due to layers 1-3), they'd need:
- Bearer token in Authorization header
- `allowInsecureAuth: false` means NO bypasses

## Attack Scenarios

### Scenario 1: Direct IP Access
```bash
curl http://95.217.x.x:18789
```
**Result:** Connection refused (UFW blocks it)

### Scenario 2: Port Scan
```bash
nmap 95.217.x.x
```
**Result:**
```
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
18789/tcp closed (blocked by firewall)
```

### Scenario 3: Nginx Exploit
**Attacker:** "What if I hack Nginx to bypass the firewall?"

**Answer:** If Nginx is compromised, they still need:
1. Gateway Bearer token (64 random hex chars)
2. The attacker can't steal it from config (needs root SSH access)
3. If they have root SSH, game over anyway - but that's OS security, not gateway

### Scenario 4: DNS Poisoning
**Attacker:** "What if I point a fake DNS to the VPS?"

**Answer:**
- SSL certificate is tied to your domain (Let's Encrypt)
- Fake domain won't have valid cert
- Browser shows warning, user doesn't proceed

## ClawHost Uses the Same Architecture

From their cloud-init:
```yaml
- openclaw gateway --bind loopback --port 18789
- ufw allow 22/tcp
- ufw allow 80/tcp
- ufw allow 443/tcp
- ufw --force enable
```

Same exact setup. They're running in production with this security model.

## Summary: Your Stack is Secure

| Layer | Protection | Attack Result |
|-------|-----------|---------------|
| UFW Firewall | Blocks port 18789 | Connection refused |
| Loopback Binding | Only listens on 127.0.0.1 | Port not reachable on public IP |
| Nginx Proxy | Only local forwarding | External can't bypass |
| Token Auth | Bearer token required | No unauthorized access |
| SSL/TLS | HTTPS encryption | No man-in-the-middle |

**Conclusion:** Gateway is NOT exposed. IP address doesn't matter. Architecture is solid.
