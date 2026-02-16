import Stripe from 'stripe';
import { config } from '../config/index.js';
import { logger } from './logger.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

export const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export const stripeService = {
  /**
   * Track free tier usage and create checkout when limit hit
   */
  async checkUsageLimitAndCreateCheckout(userId: string, actionCount: number): Promise<string | null> {
    if (actionCount < 5) {
      return null; // Still within free tier
    }
    
    logger.info('User hit free tier limit, creating checkout', { userId, actionCount });
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Life OS Pro',
                description: 'Unlimited AI actions, dedicated server, priority support',
              },
              unit_amount: 2000, // $20.00
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `https://lifeos.app/dashboard?upgrade=success`,
        cancel_url: `https://lifeos.app/dashboard?upgrade=cancelled`,
        client_reference_id: userId,
        metadata: {
          user_id: userId,
        },
      });
      
      logger.info('Checkout session created', { userId, sessionId: session.id });
      
      return session.url;
    } catch (error: any) {
      logger.error('Failed to create checkout session', error, { userId });
      throw error;
    }
  },
  
  /**
   * Handle webhook events from Stripe
   */
  async handleWebhook(payload: string, signature: string): Promise<void> {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.STRIPE_WEBHOOK_SECRET
    );
    
    logger.info('Stripe webhook received', { type: event.type });
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
        
      default:
        logger.info('Unhandled webhook type', { type: event.type });
    }
  },
};

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.user_id;
  
  if (!userId) {
    logger.error('Checkout completed but no user_id found', { sessionId: session.id });
    return;
  }
  
  logger.info('User upgraded to Pro', { userId, customerId: session.customer });

  await supabase
    .from('users')
    .update({ subscription_status: 'active', stripe_customer_id: session.customer as string })
    .eq('id', userId);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  logger.info('Subscription cancelled', { customerId });
  
  await supabase
    .from('users')
    .update({ subscription_status: 'canceled' })
    .eq('stripe_customer_id', customerId);
}
