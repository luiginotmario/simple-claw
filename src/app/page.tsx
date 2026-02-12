'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Check, Zap, Activity, Clock, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const TypingIndicator = () => (
  <div className="flex gap-1 px-2 py-1">
    <motion.div 
      className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-medium text-[var(--muted)] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          System Online
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 bg-gradient-to-b from-[var(--foreground)] to-[var(--muted)] bg-clip-text text-transparent"
        >
          Your Life.<br />Your Assistant.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mb-12 leading-relaxed"
        >
          The personal AI that integrates with everything. It manages your calendar, 
          watches your health, and executes your ideas. An assistant that actually does things.
        </motion.p>

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
            See the Magic
          </button>
        </motion.div>

        {/* Demo: Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-32 w-full max-w-md mx-auto relative"
        >
          {/* iPhone Frame */}
          <div className="rounded-[3rem] border-8 border-[var(--border)] bg-[var(--background)] shadow-2xl overflow-hidden relative aspect-[9/19]">
            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-black rounded-b-2xl z-20" />
            
            <div className="h-full w-full bg-[var(--background)] flex flex-col pt-12 pb-8 px-4 relative">
              
              {/* Messages Area */}
              <div className="flex-1 space-y-4 overflow-hidden flex flex-col justify-end pb-4">
                
                {/* Message 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="bg-[#007AFF] text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[80%] shadow-sm">
                    Move my 3pm meeting and book a table for 2 at Balthazar tonight.
                  </div>
                </motion.div>

                {/* Response 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--foreground)] rounded-2xl rounded-tl-sm px-4 py-2 text-sm max-w-[80%]">
                    Done. Moved "Product Sync" to 4:30pm.
                    <br /><br />
                    Balthazar is confirmed for 8:00 PM. I added it to your calendar.
                  </div>
                </motion.div>

                {/* Message 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: chatStep >= 1 ? 1 : 0, display: chatStep >= 1 ? 'flex' : 'none' }}
                  transition={{ delay: 0.2 }}
                  className="justify-end"
                >
                  <div className="bg-[#007AFF] text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[80%] shadow-sm">
                    Also, how did I sleep?
                  </div>
                </motion.div>

                {/* Typing Indicator */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: chatStep === 1 ? 1 : 0, display: chatStep === 1 ? 'flex' : 'none' }}
                  className="justify-start"
                >
                  <div className="bg-[var(--glass-bg)] rounded-2xl rounded-tl-sm px-2 py-2 w-12">
                    <TypingIndicator />
                  </div>
                </motion.div>

                {/* Response 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: chatStep >= 2 ? 1 : 0, display: chatStep >= 2 ? 'flex' : 'none' }}
                  className="justify-start"
                >
                  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--foreground)] rounded-2xl rounded-tl-sm px-4 py-2 text-sm max-w-[80%]">
                    Not great. Oura says 5h 42m. 
                    <br /><br />
                    I suggest canceling your morning run. Want me to clear your schedule until 10am?
                  </div>
                </motion.div>

              </div>

              {/* Input Area */}
              <div className="h-10 rounded-full border border-[var(--glass-border)] flex items-center px-4 justify-between">
                <span className="text-[var(--muted)] text-xs">iMessage</span>
                <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Feature: Background Intelligence (Flighty Style) */}
        <section className="w-full mt-40 mb-20 text-left">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--foreground)]">Works while you sleep.</h2>
            <p className="text-xl text-[var(--muted)] mb-12">
              Most assistants wait for you to ask. Life OS works in the background, connecting dots you didn't even see.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Live Activity */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden relative"
              >
                <div className="absolute top-4 right-4">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Proactive Health</h3>
                <p className="text-sm text-[var(--muted)] mb-6">Detects poor sleep and automatically blocks focus time for recovery.</p>
                
                {/* Mock Widget */}
                <div className="bg-black rounded-2xl p-4 text-white flex items-center justify-between shadow-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-400">Recovery Mode</div>
                      <div className="text-sm font-bold">Meetings Cleared</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">ON</div>
                </div>
              </motion.div>

              {/* Card 2: Flighty Style Data */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              >
                <div className="absolute top-4 right-4">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Smart Travel</h3>
                <p className="text-sm text-[var(--muted)] mb-6">Monitors flight delays and rebooks your Uber automatically.</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-[var(--glass-border)] pb-2">
                    <span className="text-[var(--muted)]">UA 145</span>
                    <span className="text-red-500 font-medium">Delayed +45m</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--muted)]">Uber Pickup</span>
                    <span className="text-[var(--foreground)]">Updated to 10:15 PM</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
