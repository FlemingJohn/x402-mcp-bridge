
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-[#222] py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold gold-gradient italic serif">AUREUS</h2>
          <p className="text-xs text-silver/30 uppercase tracking-[0.2em]">Excellence in Digital Intelligence</p>
        </div>
        <div className="flex gap-8 text-xs text-silver/40 uppercase tracking-widest">
          {['Privacy', 'Terms', 'Security', 'Support'].map(item => (
            <a key={item} href="#" className="hover:text-[#FFD700] transition-colors">{item}</a>
          ))}
        </div>
        <div className="text-xs text-silver/20 italic">
          &copy; {new Date().getFullYear()} Aureus Private Wealth. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
