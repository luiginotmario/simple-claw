# Infrastructure Architecture & Backend Design

## Overview
This document outlines the architecture for "Life OS" (Simple Claw), a SaaS that provisions and manages private OpenClaw instances for users.

## 1. Cloud Provider Choice: DigitalOcean (Droplets)
**Why:**
- **Persistence:** OpenClaw bots need to run 24/7 (listening for webhooks/events). Serverless (Cloud Run) is less ideal due to cold starts and timeout limits for long-polling/sockets.
- **Isolation:** A dedicated VPS (Droplet) provides the best security boundary between users.
- **Cost:** ~$4-6/mo per user is predictable compared to metered serverless usage.
- **Control:** We can inject a "Supervisor" agent easily via Cloud-Init.

## 2. Architecture Diagram

```mermaid
graph TD
    User[User Dashboard] -->|Next.js App| API[Main API (Vercel)]
    API -->|1. Create Account| DB[(Supabase)]
    API -->|2. Provision| DO[DigitalOcean API]
    DO -->|3. Spin Up| VPS[User VPS (Droplet)]
    
    subgraph "User Instance (VPS)"
        Supervisor[Node.js Watchdog]
        OC[OpenClaw Core]
        Supervisor -->|Monitor| OC
        Supervisor -->|Fetch Config| DB
        Supervisor -->|Push Logs| DB
        OC -->|Action| Web[Internet]
    end
```

## 3. The "Supervisor" (Watchdog)
A lightweight Node.js script running alongside OpenClaw on the user's VPS.
**Responsibilities:**
1.  **Config Sync:** Polls Supabase for new API keys or settings changes.
2.  **Process Management:** Starts/Stops the OpenClaw Docker container.
3.  **Self-Healing:** Detects crashes, parses the error log.
    *   *Scenario:* If crash is due to "Invalid API Key", it pauses and updates status to "Needs Attention" in DB.
    *   *Scenario:* If generic crash, it retries 3 times then alerts.
4.  **Logging:** Streams simplified activity logs back to Supabase for the user dashboard.

## 4. Provisioning Flow ("Ghost Onboarding")
1.  User enters Stripe details.
2.  `POST /api/provision` called.
3.  Server generates a unique `instance_id` and `access_token`.
4.  Server calls DigitalOcean API to create a Droplet.
5.  **Cloud-Init Script** injected during creation:
    *   Install Docker & Node.js.
    *   Pull Supervisor code.
    *   Write `ENV` file with `INSTANCE_ID` and `SUPABASE_KEYS`.
    *   Start Supervisor.
6.  Supervisor starts, pulls OpenClaw image, and pings `POST /api/heartbeat` -> "Online".
7.  User Dashboard flips from "Provisioning..." to "Active".

## 5. Security
- **API Keys:** Stored encrypted in Supabase (pgcrypto).
- **Isolation:** Each user has their own IP and OS.
- **Communication:** Supervisor talks to Supabase via RLS policies or a restricted Service Role.

## 6. Schema Design
See `backend/schema.sql`.
