'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Brain, Zap, Info, Key, Loader2, MessageCircle, Send, Smartphone, X, Copy, QrCode, Sparkles, Bot } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Types
type Step = 'setup' | 'ignition';
type Intelligence = 'default' | 'claude' | 'gemini' | 'gpt4';
type Interface = 'whatsapp' | 'telegram' | 'imessage';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[var(--card)] border border-[var(--border)] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
      >
        <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors md:hidden">
                <X className="w-5 h-5 text-[var(--muted)]" />
            </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto">
            {children}
            </div>
        </div>

        {/* Video Placeholder Side */}
        <div className="hidden md:flex w-[350px] bg-black/5 border-l border-[var(--border)] items-center justify-center p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors z-10">
                <X className="w-5 h-5 text-[var(--muted)]" />
            </button>
            
            {/* VIDEO PLACEHOLDER - @CodingAssistant: Insert mobile screenshare video/gif here */}
            <div className="w-full aspect-[9/19] bg-white rounded-[2.5rem] shadow-xl border-4 border-gray-900 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-[var(--muted)] gap-2">
                    <Smartphone className="w-8 h-8 opacity-50" />
                    <span className="text-xs font-medium text-center px-4">
                        Video Placeholder<br/>
                        (Mobile Walkthrough)
                    </span>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Onboarding() {
  const [step, setStep] = useState<Step>('setup');
  const [intelligence, setIntelligence] = useState<Intelligence>('default');
  const [selectedInterface, setSelectedInterface] = useState<Interface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const router = useRouter();

  // Transitions
  const nextStep = (next: Step) => setStep(next);

  const handleInterfaceSelect = (id: Interface) => {
    setSelectedInterface(id);
    setIsModalOpen(true);
  };

  const handleConnectionComplete = () => {
    setIsModalOpen(false);
    // User stays on setup page to confirm or change other settings if needed
  };

  const handleFinalize = async () => {
      setIsProvisioning(true);
      
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          alert('Please sign in first');
          router.push('/login');
          return;
        }
        
        // Call backend to provision agent
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/provision`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            plan: 'free', // Start with free tier
            intelligence,
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          nextStep('ignition');
        } else {
          alert(`Provisioning failed: ${data.error}`);
        }
      } catch (error) {
        console.error('Provisioning error:', error);
        alert('Failed to provision agent. Please try again.');
      } finally {
        setIsProvisioning(false);
      }
  }

  // Auto-redirect on Ignition
  useEffect(() => {
    if (step === 'ignition') {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-300 relative font-sans">
      
      {/* Happy Background for Success Step */}
      {step === 'ignition' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0 z-0 bg-gradient-to-tr from-green-500/20 via-blue-500/20 to-purple-500/20"
        />
      )}

      {/* Simplified Progress */}
      <div className="fixed top-0 w-full p-8 flex flex-col items-center gap-2 z-10">
        <div className="flex gap-2">
          {['setup', 'ignition'].map((s, i) => {
            const steps = ['setup', 'ignition'];
            const currentIndex = steps.indexOf(step);
            const isActive = i <= currentIndex;
            
            return (
              <div 
                key={s} 
                className={`h-1 w-16 rounded-full transition-colors duration-500 ${
                  isActive 
                  ? 'bg-[var(--foreground)]' 
                  : 'bg-[var(--glass-border)]'
                }`} 
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Unified Setup Step */}
        {step === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl w-full space-y-12 text-center z-10 py-12"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Configure your Agent.</h2>
              <p className="text-[var(--muted)] text-lg">Choose a brain and connect your channels.</p>
            </div>

            {/* Section 1: Brain */}
            <div className="space-y-6">
                <div className="text-left px-1">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">1. Select Intelligence</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* No Preference (Default) */}
                <button 
                    onClick={() => setIntelligence('default')}
                    className={`p-4 rounded-2xl border text-left transition-all relative group ${
                    intelligence === 'default' 
                        ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                    }`}
                >
                    <div className="mb-3">
                        <div className="w-10 h-10 bg-zinc-500/10 text-zinc-500 rounded-xl flex items-center justify-center border border-zinc-500/20">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="font-semibold text-[var(--foreground)]">No Preference</div>
                    <div className="text-xs text-[var(--muted)] mt-1">We'll pick the best model for the task.</div>
                    {intelligence === 'default' && <div className="absolute top-4 right-4"><Check className="w-4 h-4" /></div>}
                </button>

                {/* Claude */}
                <button 
                    onClick={() => setIntelligence('claude')}
                    className={`p-4 rounded-2xl border text-left transition-all relative group ${
                    intelligence === 'claude' 
                        ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                    }`}
                >
                    <div className="mb-3">
                        <div className="w-10 h-10 bg-[#D97757]/10 text-[#D97757] rounded-xl flex items-center justify-center border border-[#D97757]/20">
                            <Brain className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="font-semibold text-[var(--foreground)]">Claude 3.5</div>
                    <div className="text-xs text-[var(--muted)] mt-1">Nuanced & human.</div>
                    {intelligence === 'claude' && <div className="absolute top-4 right-4"><Check className="w-4 h-4" /></div>}
                </button>

                {/* Gemini */}
                <button 
                    onClick={() => setIntelligence('gemini')}
                    className={`p-4 rounded-2xl border text-left transition-all relative group ${
                    intelligence === 'gemini' 
                        ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                    }`}
                >
                    <div className="mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <Zap className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="font-semibold text-[var(--foreground)]">Gemini 1.5</div>
                    <div className="text-xs text-[var(--muted)] mt-1">Fast & huge context.</div>
                    {intelligence === 'gemini' && <div className="absolute top-4 right-4"><Check className="w-4 h-4" /></div>}
                </button>

                {/* GPT-4o */}
                <button 
                    onClick={() => setIntelligence('gpt4')}
                    className={`p-4 rounded-2xl border text-left transition-all relative group ${
                    intelligence === 'gpt4' 
                        ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                    }`}
                >
                    <div className="mb-3">
                        <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20">
                            <Bot className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="font-semibold text-[var(--foreground)]">GPT-4o</div>
                    <div className="text-xs text-[var(--muted)] mt-1">Smart reasoning.</div>
                    {intelligence === 'gpt4' && <div className="absolute top-4 right-4"><Check className="w-4 h-4" /></div>}
                </button>
                </div>
            </div>

            {/* Section 2: Channels */}
            <div className="space-y-6">
                <div className="text-left px-1">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">2. Connect Channels</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => handleInterfaceSelect('whatsapp')}
                        className="w-full p-4 rounded-2xl border bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--foreground)] hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-[var(--foreground)]">WhatsApp (Official)</div>
                            <div className="text-xs text-[var(--muted)]">Business API • Secure & Isolated</div>
                        </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedInterface === 'whatsapp' ? <span className="text-xs font-medium text-green-500">Connected</span> : <span className="text-xs text-[var(--muted)]">Connect</span>}
                            <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
                        </div>
                    </button>

                    <button 
                        onClick={() => handleInterfaceSelect('imessage')}
                        className="w-full p-4 rounded-2xl border bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--foreground)] hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-[var(--foreground)]">iMessage</div>
                            <div className="text-xs text-[var(--muted)]">Apple Native Integration</div>
                        </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--muted)]">Connect</span>
                            <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
                        </div>
                    </button>

                    <button 
                        onClick={() => handleInterfaceSelect('telegram')}
                        className="w-full p-4 rounded-2xl border bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--foreground)] hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                            <Send className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-[var(--foreground)]">Telegram</div>
                            <div className="text-xs text-[var(--muted)]">Bot API Integration</div>
                        </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--muted)]">Connect</span>
                            <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
                        </div>
                    </button>
                </div>
            </div>

            <button 
              onClick={handleFinalize}
              className="mt-8 px-12 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            >
              {isProvisioning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finalizing...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 3: Ignition (Auto Redirect) */}
        {step === 'ignition' && (
          <motion.div 
            key="ignition"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-8 z-10"
          >
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" 
              />
              <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Check className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">You're all set.</h2>
              <p className="text-[var(--muted)] text-lg">Redirecting to your dashboard...</p>
            </div>
            
            <div className="w-full bg-[var(--glass-border)] h-1 rounded-full overflow-hidden max-w-xs mx-auto">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="h-full bg-[var(--foreground)]"
                />
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && selectedInterface === 'whatsapp' && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Connect WhatsApp Business"
          >
            <div className="flex flex-col gap-6 h-full justify-center">
              <div className="space-y-4">
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                      We use the official WhatsApp Cloud API for maximum reliability and privacy. 
                      This provides your assistant with its own dedicated phone number.
                  </p>
                  
                  <div className="p-4 bg-[var(--muted)]/5 rounded-xl border border-[var(--border)] text-sm space-y-3">
                      <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                          <span>Create a Meta Business Account (or use existing).</span>
                      </div>
                      <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                          <span>Add a phone number (you will receive an OTP).</span>
                      </div>
                      <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                          <span>Paste your System User Token below.</span>
                      </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Token</label>
                    <input 
                        type="password" 
                        placeholder="EAA..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                    />
                  </div>
              </div>

              <button 
                onClick={handleConnectionComplete}
                className="w-full py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all mt-auto"
              >
                Connect WhatsApp
              </button>
            </div>
          </Modal>
        )}

        {isModalOpen && selectedInterface === 'telegram' && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Connect Telegram"
          >
            <div className="flex flex-col gap-6 h-full justify-center">
               <div className="bg-[var(--muted)]/5 p-4 rounded-xl text-sm space-y-2 border border-[var(--border)]">
                 <p className="font-medium text-[var(--foreground)]">How to get a token:</p>
                 <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
                   <li>Open <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@BotFather</a> in Telegram</li>
                   <li>Send <code>/newbot</code> and follow the instructions</li>
                   <li>Copy the HTTP API token provided</li>
                 </ol>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium">Bot Token</label>
                 <div className="relative">
                   <input 
                     type="text" 
                     placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                     className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                   />
                   <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]">
                     <Copy className="w-4 h-4" />
                   </button>
                 </div>
               </div>

               <button 
                onClick={handleConnectionComplete}
                className="w-full py-3 bg-[#0088cc] text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all mt-auto"
              >
                Connect Telegram
              </button>
            </div>
          </Modal>
        )}

        {isModalOpen && selectedInterface === 'imessage' && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Connect iMessage"
          >
            <div className="flex flex-col gap-6 h-full justify-center items-center text-center">
               <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2">
                  <MessageSquare className="w-8 h-8" />
               </div>
               
               <p className="text-[var(--muted)]">
                   iMessage integration requires a Mac running as a server (which you are!).
                   <br/><br/>
                   We will install the local relay bridge. Please ensure you are signed into iMessage on this machine.
               </p>

               <button 
                onClick={handleConnectionComplete}
                className="w-full py-3 bg-[#007AFF] text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all mt-auto"
              >
                Enable iMessage Relay
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Missing Icons
function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
}

function Bot(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
    )
}

function MessageSquare(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )
}
