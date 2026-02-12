'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Command, 
  LayoutGrid, 
  LogOut, 
  Mail, 
  MessageSquare, 
  Moon, 
  Plus, 
  Settings, 
  Smartphone, 
  Sun, 
  Zap,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [greeting, setGreeting] = useState('Good afternoon');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] p-6 hidden md:flex flex-col justify-between fixed h-full bg-[var(--background)]">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-6 h-6 bg-[var(--foreground)] rounded-full" />
            <span className="font-semibold tracking-tight text-xl">Life OS</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Overview' },
              { id: 'chat', icon: MessageSquare, label: 'Chat' },
              { id: 'integrations', icon: Zap, label: 'Integrations' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
          <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] text-xs font-bold">L</div>
              <div>
                <div className="text-sm font-medium">Luigi Rivo</div>
                <div className="text-xs text-[var(--muted)]">Pro Plan</div>
              </div>
            </div>
            <div className="h-1 w-full bg-[var(--glass-border)] rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[80%]" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[var(--muted)]">Usage</span>
              <span className="text-[10px] text-[var(--foreground)]">80%</span>
            </div>
          </div>
          
          <button className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-red-500 transition-colors px-2">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{greeting}, Luigi.</h1>
            <p className="text-[var(--muted)]">Here's what's happening with your Life OS.</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 rounded-full hover:bg-[var(--glass-bg)] transition-colors text-[var(--muted)]">
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Status & Quick Actions) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Activity className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-medium mb-4">System Status</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Memory", value: "Active", color: "text-green-500" },
                  { label: "Uptime", value: "99.9%", color: "text-[var(--foreground)]" },
                  { label: "Requests", value: "124", color: "text-[var(--foreground)]" },
                  { label: "Latency", value: "45ms", color: "text-[var(--foreground)]" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-xs text-[var(--muted)] mb-1">{stat.label}</div>
                    <div className={`text-xl font-semibold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Integrations Grid */}
            <div>
              <h3 className="text-sm font-medium text-[var(--muted)] mb-4 uppercase tracking-wider">Active Integrations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Oura', status: 'Connected', icon: Activity, color: 'text-white bg-black' },
                  { name: 'Google Calendar', status: 'Syncing', icon: Calendar, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' },
                  { name: 'Gmail', status: 'Connected', icon: Mail, color: 'text-red-600 bg-red-100 dark:bg-red-900/20' },
                  { name: 'Uber', status: 'Connected', icon: MapPin, color: 'text-white bg-black' },
                ].map((app, i) => (
                  <motion.div 
                    key={app.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] flex items-center justify-between hover:border-[var(--foreground)] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.color}`}>
                        <app.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{app.name}</div>
                        <div className="text-xs text-[var(--muted)]">{app.status}</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </motion.div>
                ))}
                
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Connect App</span>
                </motion.button>
              </div>
            </div>

          </div>

          {/* Right Column (Activity Feed) */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] h-full">
              <h2 className="text-lg font-medium mb-6">Recent Activity</h2>
              <div className="space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[var(--border)]" />

                {[
                  { title: "Drafted email to Sarah", time: "2 min ago", icon: Mail },
                  { title: "Booked Uber to SFO", time: "1 hour ago", icon: MapPin },
                  { title: "Syncing Oura sleep data", time: "4 hours ago", icon: Activity },
                  { title: "Rescheduled Weekly Sync", time: "Yesterday", icon: Calendar },
                  { title: "Morning Briefing Sent", time: "Yesterday", icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="w-5 h-5 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center z-10 shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--muted)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
