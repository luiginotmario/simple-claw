import { Hono } from 'hono';
import { provisioningService } from '../services/provisioning.js';
import { logger } from '../lib/logger.js';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

const usage = new Hono();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

/**
 * POST /api/usage/check
 * Instance-authenticated usage gate for actions.
 *
 * Auth: Authorization: Bearer <gateway_token>
 */
usage.post('/check', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('gateway_token', token)
      .single();
    
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }
    
    const result = await provisioningService.trackAction(user.id);
    
    return c.json({
      allowed: !result.blocked,
      shouldPay: result.shouldPay,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error: any) {
    logger.error('Usage check error', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default usage;
