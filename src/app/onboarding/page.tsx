'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Brain, MessageCircle, Zap, Info, Key } from 'lucide-react';
import Link from 'next/link';

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

  // Transitions
  const nextStep = (next: Step) => setStep(next);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-300 relative">
      
      {/* Happy Background for Success Step */}
      {step === 'ignition' && (
        <div 
          className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1499346030926-9a72daac6ea6?q=80&w=3200&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

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
        <p className="text-xs text-[var(--muted)] font-medium">3 quick steps (less than 1 min)</p>
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
                <h3 className="text-xl font-semibold mb-1 text-[var(--foreground)]">Meta AI</h3>
                <p className="text-sm text-[var(--muted)]">Fast, reliable, and included in your plan.</p>
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
                <p className="text-sm text-[var(--muted)]">Bring your own intelligence (OpenAI, Anthropic).</p>
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
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-left space-y-2">
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
                        <strong>What is this?</strong> An API Key is like a secret password that allows me to talk to a specific AI brain (like ChatGPT) using your personal account.
                      </div>
                    )}

                    <input 
                      type="password" 
                      placeholder="sk-..." 
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                    />
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
              <p className="text-[var(--muted)] text-lg">You can give me my name later. First, pick a home.</p>
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
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-md`}>
                      <MessageCircle className="w-6 h-6 text-white fill-white" />
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
                setTimeout(() => nextStep('ignition'), 3000);
              }}
              className="mt-8 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              {isProvisioning ? 'Initializing...' : 'Create Life OS'}
              {!isProvisioning && <ChevronRight className="w-5 h-5" />}
            </button>
          </motion.div>
        )}

        {/* Step 3: Ignition */}
        {step === 'ignition' && (
          <motion.div 
            key="ignition"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-8 z-10"
          >
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full animate-pulse" />
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Check className="w-12 h-12 text-black" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">System Online</h2>
              <p className="text-white/80 text-lg drop-shadow-sm">Your assistant is ready to help.</p>
            </div>

            <Link 
              href="/dashboard" 
              className="w-full py-4 bg-white text-black rounded-2xl text-lg font-bold hover:bg-white/90 shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              Open My Mission Control
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
