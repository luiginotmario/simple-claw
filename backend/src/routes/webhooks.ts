import { Hono } from 'hono';
import { stripeService } from '../lib/stripe.js';
import { logger } from '../lib/logger.js';

const webhooks = new Hono();

/**
 * POST /api/webhooks/stripe
 * Handle Stripe payment webhooks
 */
webhooks.post('/stripe', async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header('stripe-signature');
    
    if (!signature) {
      return c.json({ error: 'Missing signature' }, 400);
    }
    
    await stripeService.handleWebhook(body, signature);
    
    return c.json({ received: true });
    
  } catch (error: any) {
    logger.error('Stripe webhook error', error);
    return c.json({ error: error.message }, 400);
  }
});

export default webhooks;
