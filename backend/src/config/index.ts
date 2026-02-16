import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Database
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  DATABASE_URL: z.string().optional(), // Direct Postgres connection string
  
  // Hetzner
  HETZNER_API_TOKEN: z.string(),
  
  // Cloudflare
  CLOUDFLARE_API_TOKEN: z.string(),
  CLOUDFLARE_ZONE_ID: z.string(),
  CLOUDFLARE_DOMAIN: z.string().default('lifeos.app'),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  
  // Axiom
  AXIOM_TOKEN: z.string(),
  AXIOM_DATASET: z.string().default('lifeos-production'),
  
  // Encryption
  ENCRYPTION_KEY: z.string().min(32),
  
  // Life OS Master API Keys (shared across all users)
  OPENAI_API_KEY: z.string().optional(), // Optional, if using OpenAI directly
  OPENROUTER_API_KEY: z.string(), // Life OS's OpenRouter key

  // Public API URL (for instance callbacks)
  LIFEOS_API_URL: z.string().url(),

  // PricesAPI (shopping & price tracking)
  PRICESAPI_KEY: z.string().optional().default('pricesapi_oh02deGgi7W9JV2vASHdOVTS7SbLXV'),

  // WhatsApp (Baileys) Router
  WHATSAPP_ENABLED: z.enum(['true', 'false']).default('false'),
  WHATSAPP_AUTH_DIR: z.string().default('./.whatsapp'),
  AGENT_WEBHOOK_PATH: z.string().default('/webhook'),
  
  // Server
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const config = envSchema.parse(process.env);
