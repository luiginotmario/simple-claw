'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  CheckCircle, 
  Clock, 
  LayoutGrid, 
  LogOut, 
  Mail, 
  MessageSquare, 
  Moon, 
  Plus, 
  Settings, 
  Sun, 
  Zap,
  MapPin,
  Menu,
  X,
  User,
  CreditCard,
  Bell,
  Shield,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [greeting, setGreeting] = useState('Good afternoon');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
     // Check system pref
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isSystemDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#09090b');
      document.documentElement.style.setProperty('--card', '#f4f4f5');
      document.documentElement.style.setProperty('--muted', '#71717a');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(0,0,0,0.05)');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--background', '#050505');
      document.documentElement.style.setProperty('--foreground', '#ffffff');
      document.documentElement.style.setProperty('--card', '#0a0a0a');
      document.documentElement.style.setProperty('--muted', '#a1a1aa');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255,255,255,0.05)');
    }
  };

  const menuItems = [
    { id: 'overview', icon: LayoutGrid, label: 'Overview' },
    { id: 'chat', icon: MessageSquare, label: 'Chat Logs' },
    { id: 'integrations', icon: Zap, label: 'Integrations' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-full w-64 bg-[var(--background)] border-r border-[var(--border)] p-6 flex flex-col justify-between transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[var(--foreground)] rounded-full" />
              <span className="font-semibold tracking-tight text-xl">Life OS</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[var(--glass-bg)] text-[var(--foreground)]' 
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setShowProfileModal(true)}
            className="w-full p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-left hover:bg-[var(--glass-border)] transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">LR</div>
              <div>
                <div className="text-sm font-medium">Luigi Rivo</div>
                <div className="text-xs text-[var(--muted)]">Pro Plan</div>
              </div>
            </div>
            <div className="h-1 w-full bg-[var(--glass-border)] rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[80%]" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[var(--muted)]">Tokens</span>
              <span className="text-[10px] text-[var(--foreground)]">80%</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
        
        {/* Header (Mobile) */}
        <header className="flex md:hidden justify-between items-center mb-8">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2">
              <Menu className="w-6 h-6" />
           </button>
           <span className="font-semibold">Life OS</span>
           <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Header (Desktop) */}
        <header className="hidden md:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{greeting}, Luigi.</h1>
            <p className="text-[var(--muted)]">System is active and listening on WhatsApp.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--glass-bg)] transition-colors text-[var(--muted)]">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Vibe Check Card */}
                <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Activity className="w-32 h-32" />
                  </div>
                  <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Vibe Check
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Mood", value: "Focused", color: "text-blue-500" },
                      { label: "Energy", value: "High", color: "text-green-500" },
                      { label: "Tasks", value: "12 Left", color: "text-[var(--foreground)]" },
                      { label: "Sleep", value: "7h 12m", color: "text-[var(--foreground)]" },
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide font-medium">{stat.label}</div>
                        <div className={`text-xl font-semibold ${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Integrations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Active Apps</h3>
                    <button 
                      onClick={() => setActiveTab('integrations')}
                      className="text-xs text-[var(--foreground)] hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Oura', status: 'Syncing...', icon: '/assets/oura.svg' },
                      { name: 'Google Calendar', status: 'Up to date', icon: '/assets/calendar.svg' },
                      { name: 'Gmail', status: 'Scanning', icon: '/assets/gmail.svg' },
                      { name: 'Uber', status: 'Standby', icon: '/assets/uber.svg' },
                    ].map((app, i) => (
                      <div 
                        key={app.name}
                        className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] flex items-center justify-between hover:border-[var(--foreground)] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center p-2`}>
                            <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{app.name}</div>
                            <div className="text-xs text-[var(--muted)]">{app.status}</div>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Activity Feed) */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] h-full">
                  <h2 className="text-lg font-medium mb-6">Recent Activity</h2>
                  <div className="space-y-8 relative pl-2">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--border)]" />

                    {[
                      { title: "Drafted email to Sarah", time: "2 min ago", icon: Mail, color: "bg-red-500" },
                      { title: "Booked Uber to SFO", time: "1 hour ago", icon: MapPin, color: "bg-black" },
                      { title: "Syncing Oura sleep data", time: "4 hours ago", icon: Activity, color: "bg-white border-2 border-black" },
                      { title: "Rescheduled Weekly Sync", time: "Yesterday", icon: Calendar, color: "bg-blue-500" },
                      { title: "Morning Briefing Sent", time: "Yesterday", icon: Zap, color: "bg-yellow-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center z-10 shrink-0 text-[var(--background)] shadow-sm border border-[var(--border)]`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium leading-none mb-1.5">{item.title}</div>
                          <div className="text-xs text-[var(--muted)] flex items-center gap-1">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB (iOS Style) */}
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-6">
                {/* Section 1 */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
                  <div className="p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white"><User className="w-5 h-5" /></div>
                      <span className="font-medium">Personal Information</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white"><CreditCard className="w-5 h-5" /></div>
                      <span className="font-medium">Subscription & Billing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--muted)]">Pro</span>
                        <ChevronRight className="w-5 h-5 text-[var(--muted)]" />
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
                   <div className="p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white"><Bell className="w-5 h-5" /></div>
                      <span className="font-medium">Notifications</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center text-white"><Shield className="w-5 h-5" /></div>
                      <span className="font-medium">Privacy & Security</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                </div>

                 {/* Section 3 */}
                 <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)]">
                   <div className="p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white"><Brain className="w-5 h-5" /></div>
                      <span className="font-medium">AI Model Configuration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--muted)]">Default</span>
                        <ChevronRight className="w-5 h-5 text-[var(--muted)]" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                    <button className="text-red-500 text-sm font-medium hover:underline">Sign Out</button>
                    <p className="text-xs text-[var(--muted)] mt-2">Life OS v1.0.2</p>
                </div>

              </div>
            </motion.div>
          )}

          {/* Fallback for other tabs */}
          {(activeTab === 'chat' || activeTab === 'integrations') && (
            <motion.div 
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-[60vh] text-[var(--muted)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 animate-spin-slow" />
              </div>
              <p>This module is under construction.</p>
              <button onClick={() => setActiveTab('overview')} className="mt-4 text-[var(--foreground)] hover:underline">
                Back to Overview
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--card)] border border-[var(--border)] w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--glass-bg)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--muted)]" />
              </button>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                  LR
                </div>
                <h2 className="text-2xl font-bold">Luigi Rivo</h2>
                <p className="text-[var(--muted)]">luigi@example.com</p>
                <div className="mt-2 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                  PRO MEMBER
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--glass-bg)] rounded-xl p-4 flex justify-between items-center">
                   <span className="text-sm font-medium">Plan Usage</span>
                   <span className="text-sm font-bold">80%</span>
                </div>
                <div className="bg-[var(--glass-bg)] rounded-xl p-4 flex justify-between items-center">
                   <span className="text-sm font-medium">Next Billing</span>
                   <span className="text-sm font-bold">Mar 12, 2026</span>
                </div>
                <button className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Manage Subscription
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
