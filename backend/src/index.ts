import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';
import { runMigrations } from './db/index.js';
import provision from './routes/provision.js';
import webhooks from './routes/webhooks.js';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://lifeos.app'],
  credentials: true,
}));

app.use('*', honoLogger());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
  });
});

// Routes
app.route('/api/provision', provision);
app.route('/api/webhooks', webhooks);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  logger.error('Unhandled error', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start server
const port = parseInt(config.PORT);

async function startServer() {
  // Run migrations on startup
  await runMigrations();
  
  logger.info('Starting Life OS Backend', {
    port,
    env: config.NODE_ENV,
  });
  
  const { serve } = await import('@hono/node-server');
  serve({
    fetch: app.fetch,
    port,
  });
  
  console.log(`🚀 Life OS Backend running on http://localhost:${port}`);
}

startServer().catch((error) => {
  logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
});
