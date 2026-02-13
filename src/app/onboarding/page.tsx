'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Brain, Zap, Info, Key, Loader2, MessageCircle, Send, Smartphone, X, Copy, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
type Step = 'intelligence' | 'interface' | 'ignition';
type Intelligence = 'claude' | 'gemini' | 'gpt4';
type Interface = 'whatsapp' | 'telegram'; // Removed iMessage for now as per focused requirements

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
        className="relative bg-[var(--card)] border border-[var(--border)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function Onboarding() {
  const [step, setStep] = useState<Step>('intelligence');
  const [intelligence, setIntelligence] = useState<Intelligence>('claude');
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
    setIsProvisioning(true);
    // Simulate connection/provisioning
    setTimeout(() => {
        setIsProvisioning(false);
        nextStep('ignition');
    }, 2000);
  };

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

      {/* Progress */}
      <div className="fixed top-0 w-full p-8 flex flex-col items-center gap-2 z-10">
        <div className="flex gap-2">
          {['intelligence', 'interface', 'ignition'].map((s, i) => {
            const steps = ['intelligence', 'interface', 'ignition'];
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
        <p className="text-xs text-[var(--muted)] font-medium">Step {steps.indexOf(step) + 1} of 3</p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Intelligence */}
        {step === 'intelligence' && (
          <motion.div 
            key="intelligence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full space-y-8 text-center z-10"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Choose my Brain.</h2>
              <p className="text-[var(--muted)] text-lg">Select the AI model that powers your assistant.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Claude */}
              <button 
                onClick={() => setIntelligence('claude')}
                className={`p-6 rounded-2xl border text-left transition-all relative group ${
                  intelligence === 'claude' 
                    ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#D97757]/10 text-[#D97757] rounded-xl flex items-center justify-center border border-[#D97757]/20">
                    <Brain className="w-6 h-6" />
                  </div>
                  {intelligence === 'claude' && <Check className="w-5 h-5 text-[var(--foreground)]" />}
                </div>
                <h3 className="text-xl font-semibold mb-1 text-[var(--foreground)]">Claude 3.5 Sonnet</h3>
                <p className="text-sm text-[var(--muted)]">Anthropic's latest. Balanced, nuanced, and human-like.</p>
              </button>

              {/* Gemini */}
              <button 
                onClick={() => setIntelligence('gemini')}
                className={`p-6 rounded-2xl border text-left transition-all relative group ${
                  intelligence === 'gemini' 
                    ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  {intelligence === 'gemini' && <Check className="w-5 h-5 text-[var(--foreground)]" />}
                </div>
                <h3 className="text-xl font-semibold mb-1 text-[var(--foreground)]">Gemini 1.5 Pro</h3>
                <p className="text-sm text-[var(--muted)]">Google's powerhouse. Fast and great with large contexts.</p>
              </button>

              {/* GPT-4o */}
              <button 
                onClick={() => setIntelligence('gpt4')}
                className={`p-6 rounded-2xl border text-left transition-all relative group ${
                  intelligence === 'gpt4' 
                    ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)] shadow-lg' 
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)] hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  {intelligence === 'gpt4' && <Check className="w-5 h-5 text-[var(--foreground)]" />}
                </div>
                <h3 className="text-xl font-semibold mb-1 text-[var(--foreground)]">GPT-4o</h3>
                <p className="text-sm text-[var(--muted)]">OpenAI's flagship. Versatile reasoning and knowledge.</p>
              </button>
            </div>

            <button 
              onClick={() => nextStep('interface')}
              className="mt-12 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Interface */}
        {step === 'interface' && (
          <motion.div 
            key="interface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full space-y-8 text-center z-10"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Where do we talk?</h2>
              <p className="text-[var(--muted)] text-lg">Connect your preferred messaging app.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleInterfaceSelect('whatsapp')}
                className="w-full p-5 rounded-2xl border bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--foreground)] hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg text-[var(--foreground)]">WhatsApp</div>
                    <div className="text-sm text-[var(--muted)]">Connect via QR Code</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
              </button>

              <button 
                onClick={() => handleInterfaceSelect('telegram')}
                className="w-full p-5 rounded-2xl border bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--foreground)] hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                    <Send className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg text-[var(--foreground)]">Telegram</div>
                    <div className="text-sm text-[var(--muted)]">Connect via Bot Token</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
              </button>
            </div>
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
            
            <p className="text-xs text-[var(--muted)] animate-pulse">Initializing {intelligence}...</p>

          </motion.div>
        )}

      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && selectedInterface === 'whatsapp' && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Link WhatsApp"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                   <QrCode className="w-12 h-12 text-gray-400" />
                   <span className="sr-only">Mock QR Code</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-[var(--muted)] max-w-xs mx-auto">
                <p>1. Open WhatsApp on your phone</p>
                <p>2. Go to <strong>Settings</strong> {'>'} <strong>Linked Devices</strong></p>
                <p>3. Tap <strong>Link a Device</strong> and scan this code</p>
              </div>

              <button 
                onClick={handleConnectionComplete}
                className="w-full py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                I've Scanned It
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
            <div className="flex flex-col gap-6">
               <div className="bg-[var(--muted)]/5 p-4 rounded-xl text-sm space-y-2 border border-[var(--border)]">
                 <p className="font-medium text-[var(--foreground)]">How to get a token:</p>
                 <ol className="list-decimal list-inside space-y-1 text-[var(--muted)]">
                   <li>Open <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@BotFather</a> in Telegram</li>
                   <li>Send <code>/newbot</code> and follow instructions</li>
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
                className="w-full py-3 bg-[#0088cc] text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                Connect
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

const steps = ['intelligence', 'interface', 'ignition'];

// Missing Icon Component
function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
