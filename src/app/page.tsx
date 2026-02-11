'use client';

import { useState } from 'react';
import { Calendar, Car, Utensils, Zap, CheckCircle, Smartphone } from 'lucide-react';
import { generateConfig } from '@/utils/configGenerator';

interface Skill {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const SKILLS: Skill[] = [
  { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Manage your events and meetings.' },
  { id: 'uber', name: 'Uber', icon: Car, description: 'Request rides and check prices.' },
  { id: 'resy', name: 'Resy', icon: Utensils, description: 'Find and book restaurant reservations.' },
];

export default function Home() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProvisioned, setIsProvisioned] = useState(false);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleProvision = async () => {
    if (!userName || !email) return alert('Please fill in your name and email.');
    
    setIsLoading(true);
    
    // Simulate API call to mock endpoint
    // In real scenario: const res = await fetch('/api/provision', { ... });
    
    try {
      // Mock API call locally for frontend demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const config = generateConfig({ userName, skills: selectedSkills });
      console.log('Provisioned Config:', config);
      
      setIsProvisioned(true);
    } catch (error) {
      console.error('Provision failed:', error);
      alert('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-white">
      <main className="w-full max-w-lg space-y-8 glass rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto bg-white/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SimpleClaw</h1>
          <p className="text-white/70 text-sm">Your AI Assistant, configured in seconds.</p>
        </div>

        {!isProvisioned ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium ml-1">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Luigi Rivolta"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full input-glass"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="luigi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-glass"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <label className="text-sm font-medium ml-1 block">Skills</label>
              <div className="grid grid-cols-1 gap-3">
                {SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.id);
                  const Icon = skill.icon;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${
                        isSelected 
                          ? 'glass shadow-inner' 
                          : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-[rgba(255,255,255,0.2)]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{skill.name}</div>
                        <div className="text-xs text-white/50">{skill.description}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-green-300" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleProvision}
              disabled={isLoading}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Provisioning...' : 'Create Assistant'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center animate-in zoom-in duration-500">
            <div className="bg-green-500/20 text-green-300 p-4 rounded-xl border border-green-500/30">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-bold">Assistant Ready!</h3>
              <p className="text-sm opacity-80">Your OpenClaw instance is provisioned.</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left space-y-2">
              <div className="text-xs uppercase tracking-wider text-white/40 font-bold">Details</div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Name:</span>
                <span className="font-mono">{userName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Skills:</span>
                <span className="font-mono">{selectedSkills.join(', ') || 'None'}</span>
              </div>
            </div>

            <button
              onClick={() => alert('Redirecting to WhatsApp...')}
              className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
            >
              <Smartphone className="w-5 h-5" />
              Connect on WhatsApp
            </button>
            
            <button 
              onClick={() => setIsProvisioned(false)}
              className="text-sm text-white/50 hover:text-white underline"
            >
              Start Over
            </button>
          </div>
        )}
      </main>
      
      <footer className="mt-8 text-xs text-white/30">
        &copy; 2024 Voltaic Studio via SimpleClaw
      </footer>
    </div>
  );
}
