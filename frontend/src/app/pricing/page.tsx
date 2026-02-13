'use client';

import { Check, X, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans py-20 px-6">
      
      {/* Navbar (Minimal) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
           <Link href="/" className="font-semibold tracking-tight text-lg flex items-center gap-2">
             <div className="w-5 h-5 bg-[var(--foreground)] rounded-full" />
             Life OS
           </Link>
        </div>
        <Link href="/login" className="text-sm font-medium hover:opacity-70">Login</Link>
      </nav>

      <div className="max-w-5xl mx-auto pt-20 text-center">
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
        >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Simple pricing.
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Your personal assistant should work for you, not sell your data.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-32">
            
            {/* Free Plan */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] text-left flex flex-col"
            >
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Basic</h3>
                    <div className="text-4xl font-bold mb-1">$0<span className="text-lg font-normal text-[var(--muted)]">/mo</span></div>
                    <p className="text-[var(--muted)]">Perfect for trying it out.</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Basic Chat (GPT-3.5)</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>5 Requests / Day</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Manual Calendar Sync</span>
                    </li>
                    <li className="flex gap-3 text-sm text-[var(--muted)]">
                        <X className="w-5 h-5 text-[var(--muted)] shrink-0" />
                        <span>No Proactive Agents</span>
                    </li>
                </ul>

                <Link href="/onboarding" className="w-full py-4 rounded-xl border border-[var(--border)] hover:bg-[var(--glass-bg)] font-semibold text-center transition-colors">
                    Get Started
                </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl border-2 border-[var(--foreground)] bg-[var(--card)] text-left flex flex-col relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold px-3 py-1 rounded-bl-xl">
                    MOST POPULAR
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        Pro
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </h3>
                    <div className="text-4xl font-bold mb-1">$20<span className="text-lg font-normal text-[var(--muted)]">/mo</span></div>
                    <p className="text-[var(--muted)]">For power users.</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span><strong>GPT-4o / Claude 3.5</strong> Intelligence</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Unlimited Requests</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Full Calendar & Email Access</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Proactive Health & Travel Agents</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>BYO API Key Support</span>
                    </li>
                </ul>

                <Link href="/onboarding" className="w-full py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-semibold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Upgrade to Pro
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>

        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto text-left space-y-12">
            <h2 className="text-3xl font-bold mb-8">FAQ</h2>
            
            <div>
                <h3 className="text-lg font-bold mb-2">Can I bring my own API key?</h3>
                <p className="text-[var(--muted)]">Yes. If you have your own OpenAI or Anthropic key, you can use it. We just charge a small $5/mo platform fee instead of the full subscription.</p>
            </div>

             <div>
                <h3 className="text-lg font-bold mb-2">Is my data safe?</h3>
                <p className="text-[var(--muted)]">Absolutely. We don't train models on your data. Your context is stored in an encrypted vector database isolated to your account.</p>
            </div>

             <div>
                <h3 className="text-lg font-bold mb-2">What happens if I cancel?</h3>
                <p className="text-[var(--muted)]">You lose access to the proactive agents, but your chat logs remain available for export for 30 days.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
