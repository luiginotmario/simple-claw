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
  intelligence?: 'default' | 'claude' | 'gemini' | 'gpt4';
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
 * Free Tier (Dedicated VPS + Usage Limit):
 * - 1 user per CPX11 server (2 vCPU, 2GB RAM)
 * - Same instance persists before/after payment
 * - Free tier is enforced by action limits (server remains the same)
 *
 * Pro Tier:
 * - Same VPS as free tier, unlimited actions once paid
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

      // 2b. Resolve LLM configuration
      const { llmProvider, llmModel } = getLlmConfig(req.intelligence);
      
      // 3. Create a dedicated server per user (free tier is usage-limited)
      const serverInfo = await hetzner.createDedicatedServer({
        userId: req.userId,
        gatewayToken,
        llmProvider,
        llmModel,
      });
      const subdomain = `agent-${nanoid(10)}`;
      
      // 4. Create DNS record
      const agentUrl = await cloudflare.createDNSRecord(subdomain, serverInfo.ipv4);
      
      // 5. Save to database
      await supabase.from('users').update({
        instance_id: serverInfo.id.toString(),
        instance_ip: serverInfo.ipv4,
        instance_status: 'active',
        gateway_token: gatewayToken,
        agent_url: `https://${agentUrl}`,
        llm_provider: llmProvider,
        llm_model: llmModel,
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
   * Upgrade user to Pro (same VPS, removes usage limit)
   */
  async upgradeUserToPro(userId: string): Promise<void> {
    logger.info('Upgrading user to Pro', { userId });
    
    await supabase
      .from('users')
      .update({ subscription_status: 'active' })
      .eq('id', userId);
    
    logger.info('User upgraded successfully', { userId });
  },
  
  /**
   * Track action usage and trigger payment if limit exceeded
   */
  async trackAction(userId: string): Promise<{ shouldPay: boolean; checkoutUrl?: string; blocked?: boolean }> {
    const { data: user } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', userId)
      .single();
    
    if (user?.subscription_status === 'active') {
      return { shouldPay: false };
    }
    
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
      .update({ action_count: newCount, last_action_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    logger.info('Action tracked', { userId, actionCount: newCount });
    
    // If user hits or exceeds 5 actions, create Stripe checkout and block further usage
    if (newCount >= 5) {
      const { stripeService } = await import('../lib/stripe.js');
      const checkoutUrl = await stripeService.checkUsageLimitAndCreateCheckout(userId, newCount);
      
      return {
        shouldPay: true,
        checkoutUrl: checkoutUrl || undefined,
        blocked: true,
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

function getLlmConfig(intelligence?: 'default' | 'claude' | 'gemini' | 'gpt4'): { llmProvider: string; llmModel: string } {
  switch (intelligence) {
    case 'claude':
      return { llmProvider: 'openrouter', llmModel: 'anthropic/claude-3.5-sonnet' };
    case 'gemini':
      return { llmProvider: 'openrouter', llmModel: 'google/gemini-1.5-pro' };
    case 'gpt4':
      return { llmProvider: 'openrouter', llmModel: 'openai/gpt-4o' };
    case 'default':
    default:
      return { llmProvider: 'openrouter', llmModel: 'openai/gpt-4o-mini' };
  }
}
