import { createClient } from '@supabase/supabase-js';

// Types for our provisioning logic
export type ProvisionRequest = {
  userId: string;
  plan: 'hobby' | 'pro';
};

export type InstanceStatus = 'provisioning' | 'active' | 'error' | 'stopped';

// Mock Cloud Provider API (DigitalOcean)
const digitalOcean = {
  createDroplet: async (name: string, region: string, userData: string) => {
    // In reality: axios.post('https://api.digitalocean.com/v2/droplets', ...)
    console.log(`[DO] Creating Droplet: ${name} in ${region}`);
    return { id: '123456', ip: '10.0.0.1' }; // Mock response
  },
  deleteDroplet: async (id: string) => {
    console.log(`[DO] Deleting Droplet: ${id}`);
    return true;
  }
};

// Generates the Cloud-Init script (Bash) to bootstrap the VPS
function generateCloudInit(instanceToken: string, supabaseUrl: string, supabaseKey: string) {
  return `#!/bin/bash
# 1. Basic Setup
apt-get update && apt-get install -y docker.io nodejs npm

# 2. Setup Supervisor Workspace
mkdir -p /opt/openclaw-supervisor
cd /opt/openclaw-supervisor

# 3. Write Environment Config
cat <<EOF > .env
INSTANCE_TOKEN=${instanceToken}
SUPABASE_URL=${supabaseUrl}
SUPABASE_KEY=${supabaseKey}
EOF

# 4. Pull Supervisor Code (In real life, git clone or wget release)
# For now, we'll write a dummy watchdog for demo
echo "console.log('Supervisor starting...');" > index.js

# 5. Start Supervisor (Using PM2 or Systemd)
npm install -g pm2
pm2 start index.js --name supervisor --restart-delay 3000
pm2 save
`;
}

export async function provisionInstance(req: ProvisionRequest) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  
  console.log(`Starting provisioning for user ${req.userId}...`);

  try {
    // 1. Update User Status
    await supabase.from('users').update({ instance_status: 'provisioning' }).eq('id', req.userId);

    // 2. Generate Instance Token (for the supervisor to authenticate back to us)
    // In real app, store this in a separate auth table or use JWT
    const instanceToken = `inst_${Math.random().toString(36).substr(2, 9)}`;

    // 3. Generate Cloud-Init
    const cloudInit = generateCloudInit(
      instanceToken, 
      process.env.SUPABASE_URL!, 
      process.env.SUPABASE_ANON_KEY! // Or a specific limited key
    );

    // 4. Call DigitalOcean
    const droplet = await digitalOcean.createDroplet(
      `claw-${req.userId}`, 
      'nyc3', 
      cloudInit
    );

    // 5. Save Droplet Info
    await supabase.from('users').update({
      instance_id: droplet.id,
      instance_ip: droplet.ip,
      // Status remains 'provisioning' until the instance calls home (Heartbeat)
    }).eq('id', req.userId);

    console.log(`Provisioning command sent. Waiting for instance ${droplet.id} to boot.`);
    
    return { success: true, instanceId: droplet.id };

  } catch (error) {
    console.error('Provisioning failed:', error);
    await supabase.from('users').update({ instance_status: 'error' }).eq('id', req.userId);
    throw error;
  }
}
