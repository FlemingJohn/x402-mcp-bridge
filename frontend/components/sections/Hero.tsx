
import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GoldCoinEffect from '../GoldCoinEffect';
import Terminal from '../Terminal';

interface HeroProps {
  onTerminalActivity: (active: boolean) => void;
  isTerminalActive: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onTerminalActivity, isTerminalActive }) => (
  <div id="intelligence" className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[70vh] scroll-mt-24">
    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[10px] uppercase tracking-widest font-bold">
        <TrendingUp className="w-3 h-3" /> AI-Native Payment Bridge
      </div>
      <h2 className="text-6xl md:text-7xl font-bold leading-tight text-white serif">
        The Gold Standard of <span className="gold-gradient">AI Payments.</span>
      </h2>
      <p className="text-lg text-silver/60 max-w-lg leading-relaxed">
        Empowering autonomous agents with secure, bridge-less value transfer on Cronos.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C5A028] text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all">
          Deploy Agent
        </button>
        <a href="https://github.com/FlemingJohn/x402-mcp-bridge" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-[#333] text-white rounded-lg hover:border-[#FFD700] transition-all flex items-center justify-center">
          View on GitHub
        </a>
      </div>
    </div>

    <div className="relative h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <GoldCoinEffect isActive={isTerminalActive} />
      </div>
      <div className="w-full relative z-10 transition-transform hover:scale-[1.01] duration-500">
        <Terminal onActivity={onTerminalActivity} />
      </div>
    </div>
  </div>
);
