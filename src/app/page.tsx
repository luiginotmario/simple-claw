'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Zap, Activity, Clock, MapPin, MessageCircle, FileText, Phone, Sun, Moon, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const TypingIndicator = () => (
  <div className="flex gap-1 px-2 py-1.5 items-center h-full">
    <motion.div 
      className="w-1.5 h-1.5 bg-[var(--muted)]/50 rounded-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-[var(--muted)]/50 rounded-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-[var(--muted)]/50 rounded-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

export default function Home() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 50]);
  
  const [chatStep, setChatStep] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system pref
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isSystemDark);
    }

    const timer = setInterval(() => {
      setChatStep((prev) => (prev + 1) % 5); 
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#09090b');
      document.documentElement.style.setProperty('--card', '#f4f4f5');
      document.documentElement.style.setProperty('--muted', '#71717a');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(0,0,0,0.05)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(0,0,0,0.1)');
    } else {
      document.documentElement.style.setProperty('--background', '#050505');
      document.documentElement.style.setProperty('--foreground', '#ffffff');
      document.documentElement.style.setProperty('--card', '#0a0a0a');
      document.documentElement.style.setProperty('--muted', '#a1a1aa');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255,255,255,0.05)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(255,255,255,0.1)');
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)]/10 overflow-x-hidden font-sans transition-colors duration-500`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[var(--foreground)] rounded-full" />
          <span className="font-semibold tracking-tight text-lg">Life OS</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
          <Link href="/pricing" className="hover:text-[var(--foreground)] transition-colors hidden md:block">Pricing</Link>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--glass-bg)] transition-colors">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className="text-[var(--foreground)] hover:opacity-70 transition-opacity">Login</Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Hero Section (Centered) */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm font-medium text-[var(--muted)] mb-8 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Online 24/7</span>
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
            className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Helping with college. Managing work apps. Talking to other agents.
            <br className="hidden md:block" />
            <span className="text-[var(--foreground)] mt-2 block">No apps to open. Just chat.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/onboarding"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-[var(--foreground)]/20"
            >
              Create my assistant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Feature Section: The Interface (Split View) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40 text-left">
          
          {/* Left: Description */}
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--foreground)] leading-tight">
              It lives where <br/> you chat.
            </h2>
            <div className="space-y-6 text-lg text-[var(--muted)]">
              <p>
                No new apps to learn. Life OS integrates directly into <strong>iMessage, WhatsApp, and Telegram</strong>.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center"><img src="/assets/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" /></div>
                  <span>WhatsApp</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center"><img src="/assets/imessage.svg" alt="iMessage" className="w-5 h-5" /></div>
                  <span>iMessage</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center"><img src="/assets/telegram.svg" alt="Telegram" className="w-5 h-5" /></div>
                  <span>Telegram</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: iPhone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-sm mx-auto relative order-1 lg:order-2"
          >
            {/* CSS iPhone 15 Pro Frame */}
            <div className="relative mx-auto border-[10px] border-[#1a1a1a] dark:border-[#2a2a2a] bg-[#1a1a1a] dark:bg-[#2a2a2a] rounded-[3.5rem] h-[750px] w-full shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
              {/* Screen */}
              <div className="h-full w-full bg-[var(--background)] rounded-[2.5rem] overflow-hidden relative flex flex-col">
                
                {/* Dynamic Island / Status Bar */}
                <div className="absolute top-0 w-full h-14 z-20 flex justify-center pt-2">
                  <div className="h-7 w-28 bg-black rounded-full flex items-center justify-center px-3 gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] text-white/50 font-medium tracking-wide">LIFE OS</span>
                  </div>
                </div>

                {/* iMessage Header */}
                <div className="pt-16 pb-4 px-6 bg-[var(--glass-bg)]/50 backdrop-blur-md border-b border-[var(--glass-border)] flex flex-col items-center z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-lg font-bold text-[var(--foreground)] shadow-sm">
                    L
                  </div>
                  <span className="text-xs text-[var(--muted)] mt-1">Life OS • iMessage</span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col justify-end">
                  
                  {/* User Msg 1 */}
                  <div className="self-end max-w-[85%]">
                    <div className="bg-[#007AFF] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-snug shadow-sm">
                      Move my 3pm meeting and book dinner for 2 at Balthazar tonight.
                    </div>
                  </div>

                  {/* Agent Msg 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="self-start max-w-[85%]"
                  >
                    <div className="bg-[#e9e9eb] dark:bg-[#262626] text-black dark:text-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-snug shadow-sm">
                      Done. Moved "Product Sync" to 4:30pm.
                      <div className="my-2 h-px bg-black/5 dark:bg-white/10" />
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-xs opacity-70">Balthazar • 8:00 PM • Confirmed</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* User Msg 2 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: chatStep >= 2 ? 1 : 0, display: chatStep >= 2 ? 'block' : 'none' }}
                    className="self-end max-w-[85%]"
                  >
                    <div className="bg-[#007AFF] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-snug shadow-sm">
                      Also, how did I sleep?
                    </div>
                  </motion.div>

                  {/* Typing Indicator */}
                  <motion.div 
                    animate={{ opacity: chatStep === 2 ? 1 : 0, display: chatStep === 2 ? 'block' : 'none' }}
                    className="self-start"
                  >
                    <div className="bg-[#e9e9eb] dark:bg-[#262626] rounded-2xl rounded-tl-sm px-3 py-2 w-14 shadow-sm">
                      <TypingIndicator />
                    </div>
                  </motion.div>

                  {/* Agent Msg 2 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: chatStep >= 3 ? 1 : 0, display: chatStep >= 3 ? 'block' : 'none' }}
                    className="self-start max-w-[85%]"
                  >
                    <div className="bg-[#e9e9eb] dark:bg-[#262626] text-black dark:text-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-snug shadow-sm">
                      Not great. Oura says 5h 42m.
                      <br /><br />
                      I suggest canceling your morning run. Want me to clear your schedule until 10am?
                    </div>
                  </motion.div>

                </div>

                {/* Input Area Mock */}
                <div className="h-16 bg-[var(--background)]/80 backdrop-blur-md border-t border-[var(--glass-border)] flex items-center px-4 gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--glass-bg)] flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                  <div className="flex-1 h-9 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center px-3 text-xs text-[var(--muted)]">
                    iMessage
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* Bento Grid: "Works While You Sleep" */}
        <section className="w-full mt-32 mb-20 text-left">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--foreground)]">
              Background Intelligence.
            </h2>
            <p className="text-xl text-[var(--muted)] mb-12 max-w-2xl">
              Life OS runs on a private server, not your phone. It works 24/7, crossing platforms to get things done while you sleep.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              
              {/* Card 1: Proactive Health (Large) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] overflow-hidden relative group"
              >
                <div className="absolute top-8 right-8 p-3 bg-[var(--glass-bg)] rounded-2xl">
                  <img src="/assets/oura.svg" alt="Oura" className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">Proactive Health</h3>
                <p className="text-[var(--muted)] mb-8 max-w-md">Connects to Oura/Whoop. Detects recovery needs and automatically blocks focus time.</p>
                
                {/* Visual */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/90 text-white rounded-2xl p-5 flex items-center justify-between shadow-2xl border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Recovery Mode</div>
                        <div className="text-lg font-bold">Meetings Cleared</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-400 font-mono">ON</div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Smart Travel */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden"
              >
                <div className="absolute top-8 right-8 p-3 bg-[var(--glass-bg)] rounded-2xl">
                  <img src="/assets/uber.svg" alt="Uber" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Smart Travel</h3>
                <p className="text-sm text-[var(--muted)] mb-6">Flight delayed? It rebooks your Uber.</p>
                
                <div className="space-y-3 mt-8">
                  <div className="flex justify-between items-center text-sm border-b border-[var(--border)] pb-3">
                    <span className="text-[var(--muted)] font-mono">UA 145</span>
                    <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded text-xs">DELAYED +45m</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-[var(--muted)]">Uber Pickup</span>
                    <span className="text-[var(--foreground)] font-medium">Updated 10:15 PM</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Any Platform */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden"
              >
                <div className="absolute top-8 right-8 p-3 bg-[var(--glass-bg)] rounded-2xl">
                   <img src="/assets/gmail.svg" alt="Gmail" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Omnipresent</h3>
                <p className="text-sm text-[var(--muted)]">WhatsApp, Telegram, iMessage. It lives where you chat.</p>
                
                <div className="flex gap-2 mt-8 opacity-60 grayscale group-hover:grayscale-0 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center"><img src="/assets/whatsapp.svg" className="w-5 h-5" /></div>
                   <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center"><img src="/assets/telegram.svg" className="w-5 h-5" /></div>
                   <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center"><img src="/assets/imessage.svg" className="w-5 h-5" /></div>
                </div>
              </motion.div>

              {/* Card 4: Documents & Research (Large) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden"
              >
                <div className="absolute top-8 right-8 p-3 bg-[var(--glass-bg)] rounded-2xl">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">Deep Work</h3>
                <p className="text-[var(--muted)] mb-6 max-w-md">"Summarize this PDF", "Draft a contract", "Research this company". It works in your documents.</p>
                
                <div className="flex gap-4 mt-8">
                   <div className="bg-[var(--background)] border border-[var(--border)] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Contract.pdf</span>
                   </div>
                   <div className="bg-[var(--background)] border border-[var(--border)] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Research.md</span>
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
