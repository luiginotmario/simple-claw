'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/20 overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[var(--foreground)] rounded-full" />
          <span className="font-semibold tracking-tight text-lg">Life OS</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-[var(--muted)]">
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Manifesto</Link>
          <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Pricing</Link>
          <Link href="/login" className="text-[var(--foreground)] hover:text-[var(--foreground)]/80 transition-colors">Login</Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Hero Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-medium text-[var(--muted)] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Early Access Available
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 bg-gradient-to-b from-[var(--foreground)] to-[var(--muted)] bg-clip-text text-transparent"
        >
          Your Life.<br />On Autopilot.
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mb-12 leading-relaxed"
        >
          The personal AI that lives in your WhatsApp. It manages your calendar, 
          watches your health, and executes your ideas. No apps to open. Just chat.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
        >
          <Link 
            href="/onboarding"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-semibold text-lg hover:opacity-90 transition-all active:scale-95"
          >
            Start Your Life OS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button className="px-8 py-4 bg-[var(--glass-bg)] text-[var(--foreground)] border border-[var(--glass-border)] rounded-2xl font-semibold text-lg hover:bg-[var(--glass-border)] transition-all">
            See How It Works
          </button>
        </motion.div>

        {/* Visual / Demo Placeholder (Monaco-style card) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 w-full max-w-4xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
          
          <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-4 md:p-8 shadow-2xl overflow-hidden relative group text-left">
            {/* The "Card" UI */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left: Chat Interface */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--glass-bg)] flex items-center justify-center text-xs text-[var(--foreground)]">Me</div>
                  <div className="bg-[var(--glass-bg)] rounded-2xl rounded-tl-none p-4 text-sm text-[var(--foreground)] border border-[var(--glass-border)]">
                    I need a dinner res for 4 tonight in SoHo, something Italian. 
                    Also clear my schedule after 6pm.
                  </div>
                </div>
                
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-bold">R</div>
                  <div className="bg-[var(--accent)] text-[var(--accent-foreground)] rounded-2xl rounded-tr-none p-4 text-sm shadow-lg">
                    Done.
                    <br /><br />
                    🍝 <strong>Carbone</strong> is fully booked, but I snagged a table at <strong>Bar Pitti</strong> for 7:30 PM.
                    <br /><br />
                    🗓️ I moved your "Gym" block to tomorrow morning to clear your evening.
                  </div>
                </div>
              </div>

              {/* Right: Actions/Integrations */}
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-[var(--foreground)]">Resy</div>
                  <div className="text-xs text-[var(--muted)]">Confirmed • 7:30 PM</div>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-[var(--foreground)]">Calendar</div>
                  <div className="text-xs text-[var(--muted)]">Updated 2 events</div>
                </div>

                <div className="col-span-2 p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center text-[var(--foreground)]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium text-[var(--foreground)]">Auto-Pilot Active</div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            { title: "Connects Everything", desc: "Uber, Oura, Gmail, Notion. It connects to your apps so you don't have to." },
            { title: "Runs 24/7", desc: "It never sleeps. It monitors your health data and emails while you rest." },
            { title: "Private Brain", desc: "Your data lives in your private container. We don't train on your life." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--border)] transition-colors text-left"
            >
              <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">{feature.title}</h3>
              <p className="text-[var(--muted)] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
