
import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

export const TerminalHeader: React.FC = () => (
  <div className="flex items-center justify-between px-4 py-2 bg-[#151515] border-b border-[#333]">
    <div className="flex items-center gap-2">
      <TerminalIcon className="w-4 h-4 text-[#FFD700]" />
      <span className="text-xs uppercase tracking-widest text-silver font-medium">Aureus Intelligence Core</span>
    </div>
    <div className="flex gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-red-900"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-green-900"></div>
    </div>
  </div>
);
