import { Axiom } from '@axiomhq/js';
import { config } from '../config/index.js';

const axiom = new Axiom({
  token: config.AXIOM_TOKEN,
  orgId: config.AXIOM_DATASET,
});

export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.log(`[INFO] ${message}`, data);
    axiom.ingest(config.AXIOM_DATASET, [
      {
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...data,
      },
    ]);
  },
  
  error: (message: string, error?: Error, data?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, error, data);
    axiom.ingest(config.AXIOM_DATASET, [
      {
        level: 'error',
        message,
        error: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        ...data,
      },
    ]);
  },
  
  warn: (message: string, data?: Record<string, any>) => {
    console.warn(`[WARN] ${message}`, data);
    axiom.ingest(config.AXIOM_DATASET, [
      {
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...data,
      },
    ]);
  },
  
  flush: async () => {
    await axiom.flush();
  },
};

// Flush logs on process exit
process.on('beforeExit', async () => {
  await logger.flush();
});
