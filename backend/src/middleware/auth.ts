import { Context, Next } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

/**
 * Middleware to verify Supabase JWT token
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }
    
    // Attach user to context
    c.set('userId', user.id);
    c.set('userEmail', user.email);
    
    await next();
  } catch (error) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
}
