'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Brain, MessageCircle, Zap } from 'lucide-react';
import Link from 'next/link';

// Types
type Step = 'intelligence' | 'interface' | 'ignition';
type Intelligence = 'standard' | 'genius';
type Interface = 'whatsapp' | 'telegram' | 'imessage';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('intelligence');
  const [intelligence, setIntelligence] = useState<Intelligence>('standard');
  const [selectedInterface, setSelectedInterface] = useState<Interface>('whatsapp');
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Transitions
  const nextStep = (next: Step) => setStep(next);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Progress Bar */}
      <div className="fixed top-0 w-full p-8 flex justify-center gap-2">
        {['intelligence', 'interface', 'ignition'].map((s, i) => (
          <div 
            key={s} 
            className={`h-1 w-16 rounded-full transition-colors duration-500 ${
              step === s || 
              (step === 'interface' && i === 0) || 
              (step === 'ignition' && i <= 1) 
              ? 'bg-white' 
              : 'bg-white/10'
            }`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Intelligence */}
        {step === 'intelligence' && (
          <motion.div 
            key="intelligence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl w-full space-y-8 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Choose your Brain.</h2>
              <p className="text-white/50 text-lg">How smart does your Life OS need to be?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setIntelligence('standard')}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  intelligence === 'standard' 
                    ? 'bg-white/10 border-white/40 ring-1 ring-white/40' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  {intelligence === 'standard' && <Check className="w-5 h-5 text-white" />}
                </div>
                <h3 className="text-xl font-semibold mb-1">Standard</h3>
                <p className="text-sm text-white/50 mb-4">Perfect for daily tasks, calendar, and quick answers.</p>
                <div className="text-xs font-mono text-white/30">Llama 3.1 • Fast</div>
              </button>

              <button 
                onClick={() => setIntelligence('genius')}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  intelligence === 'genius' 
                    ? 'bg-white/10 border-white/40 ring-1 ring-white/40' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <Brain className="w-6 h-6" />
                  </div>
                  {intelligence === 'genius' && <Check className="w-5 h-5 text-white" />}
                </div>
                <h3 className="text-xl font-semibold mb-1">Genius</h3>
                <p className="text-sm text-white/50 mb-4">Reasoning capabilities for complex research and coding.</p>
                <div className="text-xs font-mono text-white/30">GPT-4o / Claude • +$10/mo</div>
              </button>
            </div>

            <button 
              onClick={() => nextStep('interface')}
              className="mt-8 px-8 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-white/90 active:scale-95 transition-all inline-flex items-center gap-2"
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
            className="max-w-xl w-full space-y-8 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Where do we talk?</h2>
              <p className="text-white/50 text-lg">Choose your primary communication channel.</p>
            </div>

            <div className="space-y-3">
              {['whatsapp', 'telegram', 'imessage'].map((id) => (
                <button 
                  key={id}
                  onClick={() => setSelectedInterface(id as Interface)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                    selectedInterface === id 
                      ? 'bg-white/10 border-white/40' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium capitalize">{id === 'imessage' ? 'iMessage' : id}</div>
                      <div className="text-xs text-white/30">
                        {id === 'whatsapp' ? 'Scan QR Code' : id === 'telegram' ? 'Start Bot' : 'Requires Mac Relay'}
                      </div>
                    </div>
                  </div>
                  {selectedInterface === id && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setIsProvisioning(true);
                setTimeout(() => nextStep('ignition'), 3000);
              }}
              className="mt-8 px-8 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-white/90 active:scale-95 transition-all inline-flex items-center gap-2"
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
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <Check className="w-12 h-12 text-black" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">System Online</h2>
              <p className="text-white/50">Your Life OS is ready.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Instance ID</span>
                <span className="font-mono">life-os-8x92</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Intelligence</span>
                <span className="capitalize">{intelligence}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90">
                  Open Dashboard
                </button>
                <button className="flex-1 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/20">
                  Test Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
