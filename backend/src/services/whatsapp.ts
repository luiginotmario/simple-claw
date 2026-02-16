import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeInMemoryStore,
  type WAMessage,
} from '@whiskeysockets/baileys';
import pino from 'pino';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

const store = makeInMemoryStore({
  logger: pino({ level: 'silent' }),
});

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

function extractText(message: WAMessage): string | null {
  const msg = message.message;
  if (!msg) return null;
  if (msg.conversation) return msg.conversation;
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text;
  if (msg.imageMessage?.caption) return msg.imageMessage.caption;
  if (msg.videoMessage?.caption) return msg.videoMessage.caption;
  return null;
}

function normalizeJidToE164(jid: string | null | undefined): string | null {
  if (!jid) return null;
  const num = jid.split('@')[0];
  if (!num) return null;
  const digits = num.replace(/\D/g, '');
  return digits ? `+${digits}` : null;
}

function isGroupJid(jid: string | null | undefined): boolean {
  return Boolean(jid && jid.endsWith('@g.us'));
}

async function getLinkedUserId(platformUserId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('messaging_integrations')
    .select('user_id')
    .eq('platform', 'whatsapp')
    .eq('platform_user_id', platformUserId)
    .eq('is_active', true)
    .maybeSingle();
  
  if (error) {
    logger.error('Failed to lookup messaging integration', error, { platformUserId });
    return null;
  }
  
  return data?.user_id || null;
}

async function linkUserByEmail(platformUserId: string, email: string): Promise<boolean> {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  
  if (!user) return false;
  
  await supabase
    .from('messaging_integrations')
    .insert({
      user_id: user.id,
      platform: 'whatsapp',
      platform_user_id: platformUserId,
      is_active: true,
    });
  
  return true;
}

async function forwardToAgent(userId: string, message: string, from: string): Promise<string | null> {
  const { data: user } = await supabase
    .from('users')
    .select('agent_url, gateway_token')
    .eq('id', userId)
    .maybeSingle();
  
  if (!user?.agent_url || !user.gateway_token) {
    return 'Your assistant is still provisioning. Try again in a minute.';
  }
  
  const url = `${user.agent_url}${config.AGENT_WEBHOOK_PATH}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.gateway_token}`,
      },
      body: JSON.stringify({
        message,
        from,
        platform: 'whatsapp',
      }),
    });
    
    if (!res.ok) {
      logger.error('Agent webhook failed', { status: res.status, url });
      return 'I had trouble reaching your assistant. Please try again.';
    }
    
    const data = await res.json().catch(() => null);
    if (data?.reply && typeof data.reply === 'string') {
      return data.reply;
    }
    
    return 'Got it. What would you like me to do next?';
  } catch (error: any) {
    logger.error('Agent webhook error', error);
    return 'I had trouble reaching your assistant. Please try again.';
  }
}

async function handleIncoming(message: WAMessage, sock: ReturnType<typeof makeWASocket>) {
  if (message.key.fromMe) return;
  if (isGroupJid(message.key.remoteJid)) return;
  
  const sender = normalizeJidToE164(message.key.remoteJid);
  if (!sender) return;
  
  const text = extractText(message)?.trim();
  if (!text) return;
  
  const linkedUserId = await getLinkedUserId(sender);
  if (!linkedUserId) {
    const emailMatch = text.match(EMAIL_REGEX);
    if (!emailMatch) {
      await sock.sendMessage(message.key.remoteJid!, {
        text: 'To link your account, reply with the email you used to sign up.',
      });
      return;
    }
    
    const linked = await linkUserByEmail(sender, emailMatch[0]);
    await sock.sendMessage(message.key.remoteJid!, {
      text: linked
        ? 'Linked! You can now message your assistant here.'
        : 'No account found with that email. Please try again.',
    });
    return;
  }
  
  const reply = await forwardToAgent(linkedUserId, text, sender);
  if (reply) {
    await sock.sendMessage(message.key.remoteJid!, { text: reply });
  }
}

export async function startWhatsAppRouter() {
  if (config.WHATSAPP_ENABLED !== 'true') {
    logger.info('WhatsApp router disabled');
    return;
  }
  
  const { state, saveCreds } = await useMultiFileAuthState(config.WHATSAPP_AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
  });
  
  store.bind(sock.ev);
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.warn('WhatsApp connection closed', { shouldReconnect });
      if (shouldReconnect) {
        void startWhatsAppRouter();
      }
    } else if (connection === 'open') {
      logger.info('WhatsApp connection established');
    }
  });
  
  sock.ev.on('messages.upsert', async (m) => {
    if (m.type !== 'notify') return;
    for (const msg of m.messages) {
      await handleIncoming(msg, sock);
    }
  });
}
