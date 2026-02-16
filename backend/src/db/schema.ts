import { pgTable, uuid, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  stripe_customer_id: text('stripe_customer_id'),
  subscription_status: text('subscription_status').default('inactive'),
  instance_status: text('instance_status').default('none'),
  instance_ip: text('instance_ip'),
  instance_id: text('instance_id'),
  gateway_token: text('gateway_token'),
  agent_url: text('agent_url'),
  llm_provider: text('llm_provider'),
  llm_model: text('llm_model'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const user_secrets = pgTable('user_secrets', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  service: text('service').notNull(),
  encrypted_value: text('encrypted_value').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const user_usage = pgTable('user_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id).unique(),
  action_count: integer('action_count').default(0).notNull(),
  plan: text('plan').default('free').notNull(),
  last_action_at: timestamp('last_action_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const activity_logs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  level: text('level').default('info').notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'), // JSON stringified
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const instance_heartbeats = pgTable('instance_heartbeats', {
  user_id: uuid('user_id').primaryKey().references(() => users.id),
  last_seen: timestamp('last_seen'),
  cpu_usage: integer('cpu_usage'),
  memory_usage: integer('memory_usage'),
  version: text('version'),
  status: text('status'),
});

export const messaging_integrations = pgTable('messaging_integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  platform: text('platform').notNull(), // 'whatsapp', 'telegram'
  platform_user_id: text('platform_user_id').notNull(), // Phone number for WhatsApp, chat_id for Telegram
  is_active: boolean('is_active').default(true).notNull(),
  linked_at: timestamp('linked_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
