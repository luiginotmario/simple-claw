# Required API Keys

To run the "Life OS" backend orchestrator, we need the following keys added to our environment (or Supabase secrets).

## Infrastructure Provider
*   **DIGITALOCEAN_API_TOKEN**
    *   *Purpose:* To spin up/down Droplets (VPS) programmatically.
    *   *Permissions:* Read/Write Droplets.

## Database & Auth
*   **SUPABASE_URL**
    *   *Purpose:* Connection URL.
*   **SUPABASE_SERVICE_ROLE_KEY**
    *   *Purpose:* Bypass RLS to provision users and update statuses from the backend.
*   **SUPABASE_ANON_KEY**
    *   *Purpose:* Public client key.

## Payments
*   **STRIPE_SECRET_KEY**
    *   *Purpose:* Verify subscriptions before provisioning.
*   **STRIPE_WEBHOOK_SECRET**
    *   *Purpose:* Listen for `checkout.session.completed` events.

## Container Registry (Optional)
*   **DOCKER_HUB_TOKEN** (or GHCR)
    *   *Purpose:* If the OpenClaw core image is private, the user instances need a pull token.
