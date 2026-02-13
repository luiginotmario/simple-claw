import axios from 'axios';
import { config } from '../config/index.js';
import { logger } from './logger.js';

const cloudflareApi = axios.create({
  baseURL: `https://api.cloudflare.com/client/v4/zones/${config.CLOUDFLARE_ZONE_ID}/dns_records`,
  headers: {
    'Authorization': `Bearer ${config.CLOUDFLARE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const cloudflare = {
  /**
   * Creates a subdomain pointing to the VPS IP
   * e.g., agent-abc123.lifeos.app → 95.217.x.x
   */
  async createDNSRecord(subdomain: string, ipv4: string): Promise<string> {
    logger.info('Creating Cloudflare DNS record', { subdomain, ipv4 });
    
    try {
      const response = await cloudflareApi.post('', {
        type: 'A',
        name: subdomain,
        content: ipv4,
        ttl: 120, // 2 minutes for faster propagation
        proxied: false, // Direct IP, not proxied through Cloudflare
      });
      
      const fullDomain = `${subdomain}.${config.CLOUDFLARE_DOMAIN}`;
      
      logger.info('DNS record created', { domain: fullDomain, ip: ipv4 });
      
      return fullDomain;
    } catch (error: any) {
      logger.error('Failed to create DNS record', error, { subdomain, ipv4 });
      throw new Error(`Cloudflare API error: ${error.response?.data?.errors?.[0]?.message || error.message}`);
    }
  },
  
  async deleteDNSRecord(subdomain: string): Promise<void> {
    logger.info('Deleting DNS record', { subdomain });
    
    try {
      // Find record ID first
      const recordsResponse = await cloudflareApi.get('', {
        params: {
          name: `${subdomain}.${config.CLOUDFLARE_DOMAIN}`,
        },
      });
      
      const records = recordsResponse.data.result;
      
      for (const record of records) {
        await cloudflareApi.delete(`/${record.id}`);
        logger.info('DNS record deleted', { recordId: record.id });
      }
    } catch (error: any) {
      logger.error('Failed to delete DNS record', error, { subdomain });
    }
  },
};
