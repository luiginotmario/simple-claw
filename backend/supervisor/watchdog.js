/**
 * SUPERVISOR / WATCHDOG
 * 
 * Runs on the User's VPS.
 * 1. Checks Supabase for configuration/secrets.
 * 2. Manages the OpenClaw Docker container.
 * 3. Reports status back to Supabase.
 */

const { createClient } = require('@supabase/supabase-js');
const { exec } = require('child_process');
const fs = require('fs');

// Config from ENV (injected via Cloud-Init)
const CONFIG = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  instanceToken: process.env.INSTANCE_TOKEN,
  userId: process.env.USER_ID // Passed during setup
};

const supabase = createClient(CONFIG.url, CONFIG.key);

async function logActivity(level, message) {
  console.log(`[${level}] ${message}`);
  // Push to centralized log for user dashboard
  await supabase.from('activity_logs').insert({
    level, 
    message,
    user_id: CONFIG.userId
  });
}

async function getSecrets() {
  const { data, error } = await supabase
    .from('user_secrets')
    .select('service, encrypted_value')
    .eq('user_id', CONFIG.userId);
  
  if (error) throw error;
  
  // In real app: Decrypt locally using a shared secret or request plaintext from secure endpoint
  // For prototype: assume we get what we need to run
  return data;
}

async function checkContainer() {
  exec('docker ps --format "{{.Status}}"', async (err, stdout) => {
    if (err || !stdout.includes('Up')) {
      await logActivity('error', 'OpenClaw container is DOWN. Attempting restart...');
      restartContainer();
    } else {
      // Heartbeat
      await supabase.from('instance_heartbeats').upsert({
        user_id: CONFIG.userId,
        last_seen: new Date(),
        status: 'online'
      });
    }
  });
}

async function restartContainer() {
  // 1. Fetch latest config
  const secrets = await getSecrets();
  
  // 2. Construct Env Vars String
  const envVars = secrets.map(s => `-e ${s.service}=${s.encrypted_value}`).join(' ');

  // 3. Run Docker
  const cmd = `docker run -d --name openclaw --restart on-failure ${envVars} openclaw/core:latest`;
  
  exec(`docker stop openclaw && docker rm openclaw`, () => {
    exec(cmd, async (err) => {
      if (err) {
        await logActivity('error', `Failed to restart: ${err.message}`);
      } else {
        await logActivity('success', 'OpenClaw restarted successfully.');
      }
    });
  });
}

// Main Loop
console.log("Supervisor started.");
logActivity('info', 'Instance booted up.');

// Periodically check health
setInterval(checkContainer, 60000); // Every minute
checkContainer(); // Initial check
