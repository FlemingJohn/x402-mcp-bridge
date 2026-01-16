
import React from 'react';

const ASSETS = [
  { name: 'Gold', height: 'h-32' },
  { name: 'Art', height: 'h-24' },
  { name: 'Watches', height: 'h-40' },
  { name: 'Estate', height: 'h-20' }
];

export const MarketBanner: React.FC = () => (
  <section id="treasury" className="max-w-7xl mx-auto mt-24 p-12 bg-gradient-to-r from-[#111] to-[#050505] rounded-3xl border border-[#222] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative scroll-mt-24">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 blur-[120px] rounded-full"></div>
    <div className="space-y-4 relative z-10">
      <h3 className="text-3xl font-bold text-white serif">Luxury Asset Index</h3>
      <p className="text-silver/60 max-w-md">Our proprietary volatility scanner identifies arbitrage opportunities in the luxury watch and collectible markets.</p>
      <button className="px-8 py-3 rounded-full bg-[#FFD700] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#C5A028] transition-all transform hover:translate-y-[-2px]">
        Access Exclusive Report
      </button>
    </div>
    <div className="flex gap-4 relative z-10">
      {ASSETS.map(asset => (
        <div key={asset.name} className="flex flex-col items-center">
          <div className={`w-12 ${asset.height} bg-gradient-to-t from-[#FFD700]/20 to-[#FFD700] rounded-full mb-2`}></div>
          <span className="text-[10px] text-silver/40 uppercase">{asset.name}</span>
        </div>
      ))}
    </div>
  </section>
);
