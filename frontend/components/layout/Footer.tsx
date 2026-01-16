
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-[#222] py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold gold-gradient italic serif">x402-MCP</h2>
          <p className="text-xs text-silver/30 uppercase tracking-[0.2em]">AI-Native Payment Standards</p>
        </div>
        <div className="flex gap-8 text-xs text-silver/40 uppercase tracking-widest">

        </div>
        <div className="text-xs text-silver/20 italic">
          &copy; {new Date().getFullYear()} x402-MCP Bridge. Open Source.
        </div>
      </div>
    </footer>
  );
};
