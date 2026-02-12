# Life OS: Architecture & Vision

## The Vision
"Her" meets "Apple Shortcuts".
A personal AI assistant for **normal people**. No terminal, no config files, no "instances".
Just a Dashboard ("Mission Control") and a Chat Interface (WhatsApp/iMessage).

## The User Journey (3 Clicks)

1.  **Landing:** Premium, Monaco-style homepage. "Run your Personal AI Assistant." -> [Get Started].
2.  **Onboarding (The Setup):**
    *   **Intelligence:** Standard (Fast) vs Genius (GPT-4o).
    *   **Interface:** Connect WhatsApp / Telegram / iMessage.
3.  **Ignition:**
    *   System spins up their private "Life OS" container in the background.
    *   User gets a QR code to link their WhatsApp.
    *   **Magic Moment:** The agent texts them: "I'm ready. What's on your mind?"

## Technical Architecture

### 1. The Container (The User's Brain)
Each user gets a private Docker container running:
*   **OpenClaw Core:** The agent logic.
*   **The Supervisor (Proprietary Watchdog):**
    *   Monitors OpenClaw process health.
    *   **Auto-Recovery:** If a bad API key crashes the agent, Supervisor detects exit code 1, edits the config to disable the bad tool, and restarts.
    *   **Secret Management:** Receives OAuth tokens from the Dashboard securely.

### 2. The Dashboard (Mission Control)
A Next.js Web App (SimpleClaw) for configuration, not chat.
*   **Personality Slider:** "Professional" <-> "Best Friend".
*   **Connections Store:** Grid of apps (Oura, Uber, Gmail). One-click connect via OAuth.
*   **Status:** "Healthy", "Sleeping", "Thinking".

### 3. The Gatekeeper (Router)
A lightweight edge worker.
*   Receives WhatsApp/Telegram webhooks.
*   Routes message to the correct User Container based on `from_number` or `session_id`.
*   Enforces "Free Trial" limits before routing to shared sandbox vs private instance.

## Branding
*   **Name:** Relay (or Remi).
*   **Vibe:** Premium utility. Invisible but powerful.
*   **No Jargon:** "Connect Calendar" (not "Google API Client ID").
