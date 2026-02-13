'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Brain, Zap, Info, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
type Step = 'intelligence' | 'interface' | 'ignition';
type Intelligence = 'standard' | 'custom';
type Interface = 'whatsapp' | 'telegram' | 'imessage';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('intelligence');
  const [intelligence, setIntelligence] = useState<Intelligence>('standard');
  const [customKey, setCustomKey] = useState('');
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState<Interface>('whatsapp');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const router = useRouter();

  // Transitions
  const nextStep = (next: Step) => setStep(next);

  // Auto-redirect on Ignition
  useEffect(() => {
    if (step === 'ignition') {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2500); // 2.5s delay to show the "Success" animation
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
            className="max-w-2xl w-full space-y-8 text-center z-10"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Choose my Brain.</h2>
              <p className="text-[var(--muted)] text-lg">I can run on a standard model or use your own custom key.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setIntelligence('standard')}
                className={`p-6 rounded-2xl border text-left transition-all relative ${
                  intelligence === 'standard' 
                    ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)]' 
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  {intelligence === 'standard' && <Check className="w-5 h-5 text-[var(--foreground)]" />}
                </div>
                <h3 className="text-xl font-semibold mb-1 text-[var(--foreground)]">Default</h3>
                <p className="text-sm text-[var(--muted)]">Fast, reliable, and included. Great for everyday tasks.</p>
              </button>

              <button 
                onClick={() => setIntelligence('custom')}
                className={`p-6 rounded-2xl border text-left transition-all relative ${
                  intelligence === 'custom' 
                    ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)]' 
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <Key className="w-6 h-6" />
                  </div>
                  {intelligence === 'custom' && <Check className="w-5 h-5 text-[var(--foreground)]" />}
                </div>
                <h3 className="text-xl font-semibold mb-1 text-[var(--foreground)]">Custom Model</h3>
                <p className="text-sm text-[var(--muted)]">Bring your own key (OpenAI, Anthropic).</p>
              </button>
            </div>

            {/* Custom Key Input */}
            <AnimatePresence>
              {intelligence === 'custom' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-left space-y-2 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium">API Key</label>
                      <button 
                        onClick={() => setShowKeyInfo(!showKeyInfo)}
                        className="text-[var(--muted)] hover:text-[var(--foreground)]"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {showKeyInfo && (
                      <div className="text-xs bg-blue-500/10 text-blue-500 p-3 rounded-lg mb-3">
                        <strong>What is this?</strong> An API Key allows me to talk to AI providers using your personal account. We store this securely.
                      </div>
                    )}

                    <input 
                      type="password" 
                      placeholder="sk-..." 
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] mb-2"
                    />
                    <button
                      onClick={() => setCustomKey('SKIPPED')}
                      className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] underline"
                    >
                      I'll add this later in settings
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => nextStep('interface')}
              className="mt-8 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
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
              <p className="text-[var(--muted)] text-lg">Pick your preferred app. You can change this anytime.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]' },
                { id: 'telegram', name: 'Telegram', color: 'bg-[#0088cc]' },
                { id: 'imessage', name: 'iMessage', color: 'bg-[#007AFF]' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedInterface(item.id as Interface)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    selectedInterface === item.id 
                      ? 'bg-[var(--glass-bg)] border-[var(--foreground)] ring-1 ring-[var(--foreground)]' 
                      : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* App Icon Style */}
                    <div className={`w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shadow-md`}>
                      <img src={`/assets/${item.id}.svg`} alt={item.name} className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg capitalize text-[var(--foreground)]">{item.name}</div>
                    </div>
                  </div>
                  {selectedInterface === item.id && <Check className="w-6 h-6 text-[var(--foreground)]" />}
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setIsProvisioning(true);
                // Simulate network request
                setTimeout(() => {
                    setIsProvisioning(false);
                    nextStep('ignition');
                }, 2000);
              }}
              disabled={isProvisioning}
              className="mt-8 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProvisioning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Life OS...
                </>
              ) : (
                <>
                  Create my assistant
                  <ChevronRight className="w-5 h-5" />
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
    </div>
  );
}

const steps = ['intelligence', 'interface', 'ignition'];
