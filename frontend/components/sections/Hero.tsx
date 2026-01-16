
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
        <TrendingUp className="w-3 h-3" /> Digital Finance Luxury
      </div>
      <h2 className="text-6xl md:text-7xl font-bold leading-tight text-white serif">
        Master the Art of <span className="gold-gradient">Elite Finance.</span>
      </h2>
      <p className="text-lg text-silver/60 max-w-lg leading-relaxed">
        Navigate the complex landscape of luxury assets with AUREUS. AI-driven insights for the discerning investor.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Gold Spot', value: '$2,142.30', change: '+1.4%', up: true },
          { label: 'BTC Prime', value: '$68,231.12', change: '-0.8%', up: false }
        ].map(stat => (
          <div key={stat.label} className="p-4 bg-[#111] rounded-xl border border-[#222] group hover:border-[#FFD700]/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-silver/40 uppercase tracking-tighter font-bold">{stat.label}</span>
              {stat.up ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className={`text-[10px] ${stat.up ? 'text-green-500' : 'text-red-500'} font-medium`}>{stat.change} Today</div>
          </div>
        ))}
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
