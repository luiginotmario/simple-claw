import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';
import { hetzner } from '../lib/hetzner.js';
import { cloudflare } from '../lib/cloudflare.js';
import { nanoid } from 'nanoid';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

export interface ProvisionRequest {
  userId: string;
  plan: 'free' | 'pro';
  email: string;
}

export interface ProvisionResult {
  success: boolean;
  agentUrl?: string;
  gatewayToken?: string;
  error?: string;
}

/**
 * SECURITY ARCHITECTURE EXPLAINED:
 * 
 * Free Tier (Shared VPS):
 * - 10-20 users per CPX31 server (4 vCPU, 8GB RAM)
 * - Each user gets isolated Docker container with resource limits
 * - No IP-level isolation, but process isolation via containers
 * - Gateway token still required for API access
 * - Suitable for trial users (5 actions limit)
 * 
 * Pro Tier (Dedicated VPS):
 * - 1 user per CPX11 server (2 vCPU, 2GB RAM)
 * - Full OS-level isolation
 * - Dedicated IP address
 * - OpenClaw binds to 127.0.0.1:18789 (NEVER exposed publicly)
 * - UFW firewall blocks port 18789 from internet
 * - Nginx reverse proxy on port 443 (HTTPS only)
 * - Gateway requires Bearer token authentication
 * 
 * No Gateway Exploits Possible Because:
 * 1. Gateway port (18789) blocked by UFW firewall
 * 2. Only Nginx (localhost) can reach it
 * 3. Nginx passes requests but token still required
 * 4. allowInsecureAuth: false in openclaw.json
 * 5. trustedProxies limited to [127.0.0.1, ::1]
 * 6. Even with VPS IP, port 18789 = connection refused
 */
export const provisioningService = {
  async provisionAgent(req: ProvisionRequest): Promise<ProvisionResult> {
    const startTime = Date.now();
    
    logger.info('Starting agent provisioning', {
      userId: req.userId,
      plan: req.plan,
      email: req.email,
    });
    
    try {
      // 1. Update user status
      await supabase
        .from('users')
        .update({ instance_status: 'provisioning' })
        .eq('id', req.userId);
      
      // 2. Generate secure gateway token
      const gatewayToken = generateGatewayToken();
      
      // 3. Create or assign server based on plan
      let serverInfo;
      let subdomain;
      
      if (req.plan === 'pro') {
        // Dedicated VPS for Pro users
        serverInfo = await hetzner.createDedicatedServer({
          userId: req.userId,
          plan: req.plan,
          gatewayToken,
        });
        subdomain = `agent-${nanoid(10)}`;
      } else {
        // Shared VPS for Free tier users
        serverInfo = await hetzner.getOrCreateSharedServer();
        subdomain = `agent-free-${nanoid(10)}`;
      }
      
      // 4. Create DNS record
      const agentUrl = await cloudflare.createDNSRecord(subdomain, serverInfo.ipv4);
      
      // 5. Save to database
      await supabase.from('users').update({
        instance_id: serverInfo.id.toString(),
        instance_ip: serverInfo.ipv4,
        instance_status: 'active',
        gateway_token: gatewayToken,
        agent_url: `https://${agentUrl}`,
      }).eq('id', req.userId);
      
      // 6. Initialize action counter for free tier
      if (req.plan === 'free') {
        await supabase.from('user_usage').insert({
          user_id: req.userId,
          action_count: 0,
          plan: 'free',
        });
      }
      
      const duration = Date.now() - startTime;
      
      logger.info('Agent provisioned successfully', {
        userId: req.userId,
        agentUrl,
        serverId: serverInfo.id,
        duration,
      });
      
      return {
        success: true,
        agentUrl: `https://${agentUrl}`,
        gatewayToken,
      };
      
    } catch (error: any) {
      logger.error('Provisioning failed', error, { userId: req.userId });
      
      await supabase
        .from('users')
        .update({ instance_status: 'error' })
        .eq('id', req.userId);
      
      return {
        success: false,
        error: error.message,
      };
    }
  },
  
  /**
   * Migrate user from free (shared) to pro (dedicated)
   */
  async upgradeUserToPro(userId: string): Promise<void> {
    logger.info('Upgrading user to Pro', { userId });
    
    // Get current user data
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Provision new dedicated server
    const result = await this.provisionAgent({
      userId,
      plan: 'pro',
      email: user.email,
    });
    
    if (!result.success) {
      throw new Error('Failed to provision Pro server');
    }
    
    // Update subscription status
    await supabase
      .from('users')
      .update({ subscription_status: 'active' })
      .eq('id', userId);
    
    logger.info('User upgraded successfully', { userId });
  },
  
  /**
   * Track action usage and trigger payment if limit exceeded
   */
  async trackAction(userId: string): Promise<{ shouldPay: boolean; checkoutUrl?: string }> {
    const { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!usage) {
      logger.error('Usage record not found', { userId });
      return { shouldPay: false };
    }
    
    const newCount = usage.action_count + 1;
    
    await supabase
      .from('user_usage')
      .update({ action_count: newCount })
      .eq('user_id', userId);
    
    logger.info('Action tracked', { userId, actionCount: newCount });
    
    // If user hits 5 actions, create Stripe checkout
    if (newCount === 5) {
      const { stripeService } = await import('../lib/stripe.js');
      const checkoutUrl = await stripeService.checkUsageLimitAndCreateCheckout(userId, newCount);
      
      return {
        shouldPay: true,
        checkoutUrl: checkoutUrl || undefined,
      };
    }
    
    return { shouldPay: false };
  },
};

function generateGatewayToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
