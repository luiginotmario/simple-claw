import axios from 'axios';
import { config } from '../config/index.js';
import { logger } from './logger.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hetznerApi = axios.create({
  baseURL: 'https://api.hetzner.cloud/v1',
  headers: {
    'Authorization': `Bearer ${config.HETZNER_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Load cloud-init template
const cloudInitTemplate = readFileSync(
  join(__dirname, '../../../infra/cloud-init.yaml'),
  'utf-8'
);

// Life OS master API keys (shared across all users)
const LIFE_OS_OPENAI_KEY = config.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

export interface CreateServerParams {
  userId: string;
  plan: 'free' | 'pro';
  gatewayToken: string;
}

export interface ServerInfo {
  id: number;
  name: string;
  ipv4: string;
  status: string;
}

/**
 * SECURITY NOTE:
 * - OpenClaw binds to 127.0.0.1:18789 (loopback only)
 * - UFW blocks port 18789 from external access
 * - Nginx proxies HTTPS → localhost:18789
 * - Gateway requires Bearer token even for proxied requests
 * - No direct IP access to OpenClaw possible
 */
export const hetzner = {
  /**
   * Create a dedicated VPS for Pro users
   */
  async createDedicatedServer(params: CreateServerParams): Promise<ServerInfo> {
    logger.info('Creating dedicated Hetzner server', { userId: params.userId, plan: params.plan });
    
    try {
      // Inject Life OS credentials into cloud-init
      const userData = cloudInitTemplate
        .replace('YOUR_PASSWORD_HERE', generateSecurePassword())
        .replace('OPENAI_KEY_PLACEHOLDER', LIFE_OS_OPENAI_KEY)
        .replace('GATEWAY_TOKEN_PLACEHOLDER', params.gatewayToken)
        .replace('PRICESAPI_KEY_PLACEHOLDER', config.PRICESAPI_KEY || '');
      
      const response = await hetznerApi.post('/servers', {
        name: `lifeos-${params.userId.slice(0, 8)}`,
        server_type: 'cpx11', // 2 vCPU, 2GB RAM - €4.15/mo
        image: 'ubuntu-22.04',
        location: 'nbg1', // Nuremberg
        user_data: userData,
        labels: {
          user_id: params.userId,
          plan: params.plan,
          service: 'lifeos',
        },
      });
      
      const server = response.data.server;
      
      logger.info('Server created successfully', {
        userId: params.userId,
        serverId: server.id,
        ip: server.public_net.ipv4.ip,
      });
      
      return {
        id: server.id,
        name: server.name,
        ipv4: server.public_net.ipv4.ip,
        status: server.status,
      };
    } catch (error: any) {
      logger.error('Failed to create Hetzner server', error, { userId: params.userId });
      throw new Error(`Hetzner API error: ${error.response?.data?.error?.message || error.message}`);
    }
  },
  
  /**
   * Create a shared VPS for free tier users
   * Multiple users run OpenClaw instances on same server with resource limits
   */
  async getOrCreateSharedServer(): Promise<ServerInfo> {
    logger.info('Getting or creating shared server for free tier');
    
    try {
      // Check for existing shared server with capacity
      const serversResponse = await hetznerApi.get('/servers', {
        params: {
          label_selector: 'service=lifeos,tier=shared',
        },
      });
      
      const servers = serversResponse.data.servers;
      
      // Find a server with < 20 users
      for (const server of servers) {
        const userCount = parseInt(server.labels.user_count || '0');
        if (userCount < 20) {
          logger.info('Using existing shared server', { serverId: server.id, userCount });
          return {
            id: server.id,
            name: server.name,
            ipv4: server.public_net.ipv4.ip,
            status: server.status,
          };
        }
      }
      
      // Create new shared server if none available
      logger.info('Creating new shared server');
      const response = await hetznerApi.post('/servers', {
        name: `lifeos-shared-${Date.now()}`,
        server_type: 'cpx31', // 4 vCPU, 8GB RAM - can handle 20 users
        image: 'ubuntu-22.04',
        location: 'nbg1',
        user_data: cloudInitTemplate.replace('YOUR_PASSWORD_HERE', generateSecurePassword()),
        labels: {
          service: 'lifeos',
          tier: 'shared',
          user_count: '0',
        },
      });
      
      const server = response.data.server;
      
      return {
        id: server.id,
        name: server.name,
        ipv4: server.public_net.ipv4.ip,
        status: server.status,
      };
    } catch (error: any) {
      logger.error('Failed to get/create shared server', error);
      throw new Error(`Hetzner API error: ${error.response?.data?.error?.message || error.message}`);
    }
  },
  
  async deleteServer(serverId: number): Promise<void> {
    logger.info('Deleting server', { serverId });
    await hetznerApi.delete(`/servers/${serverId}`);
  },
  
  async getServerStatus(serverId: number): Promise<string> {
    const response = await hetznerApi.get(`/servers/${serverId}`);
    return response.data.server.status;
  },
};

function generateSecurePassword(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
