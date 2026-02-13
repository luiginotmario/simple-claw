import { Hono } from 'hono';
import { provisioningService } from '../services/provisioning.js';
import { authMiddleware } from '../middleware/auth.js';
import { logger } from '../lib/logger.js';

const provision = new Hono();

// Apply auth middleware to all routes
provision.use('*', authMiddleware);

/**
 * POST /api/provision
 * Create a new OpenClaw instance for the user
 */
provision.post('/', async (c) => {
  const userId = c.get('userId');
  const userEmail = c.get('userEmail');
  try {
    const body = await c.req.json();
    const { plan } = body;
    
    if (!plan || !['free', 'pro'].includes(plan)) {
      return c.json({ error: 'Invalid plan' }, 400);
    }
    
    const result = await provisioningService.provisionAgent({
      userId,
      plan,
      email: userEmail,
    });
    
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    
    return c.json({
      success: true,
      agentUrl: result.agentUrl,
      message: 'Your AI assistant is ready!',
    });
    
  } catch (error: any) {
    logger.error('Provision endpoint error', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * POST /api/provision/track-action
 * Track user action and check if payment is needed
 */
provision.post('/track-action', async (c) => {
  const userId = c.get('userId');
  
  try {
    const result = await provisioningService.trackAction(userId);
    
    return c.json(result);
    
  } catch (error: any) {
    logger.error('Track action error', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default provision;
