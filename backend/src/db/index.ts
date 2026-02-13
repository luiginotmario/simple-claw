import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';
import * as schema from './schema.js';

// Create postgres client from Supabase URL
// Supabase format: https://xxx.supabase.co
// We need: postgresql://postgres:[password]@xxx.supabase.co:5432/postgres?sslmode=require
// You'll need to add SUPABASE_DB_PASSWORD to your config
const getDatabaseUrl = () => {
  // Check if we have a direct DATABASE_URL
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Otherwise construct from Supabase URL
  // Note: You need to add your DB password to env vars
  const host = config.SUPABASE_URL.replace('https://', '').replace('http://', '');
  return `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD || 'your-password'}@${host}:5432/postgres?sslmode=require`;
};

export const sql = postgres(getDatabaseUrl(), { max: 10 });

export const db = drizzle(sql, { schema });

/**
 * Run database migrations automatically on startup
 */
export async function runMigrations() {
  try {
    logger.info('Running database migrations...');
    
    await migrate(db, {
      migrationsFolder: './drizzle',
    });
    
    logger.info('✅ Database migrations completed');
  } catch (error) {
    logger.error('❌ Migration failed', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}
