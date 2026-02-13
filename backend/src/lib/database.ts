import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY
);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  stripe_customer_id?: string;
  subscription_status: 'inactive' | 'active' | 'past_due' | 'canceled';
  instance_status: 'none' | 'provisioning' | 'active' | 'error' | 'stopped';
  instance_ip?: string;
  instance_id?: string;
  gateway_token?: string;
  agent_url?: string;
  created_at: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  action_count: number;
  plan: 'free' | 'pro';
  last_action_at?: string;
  created_at: string;
}
