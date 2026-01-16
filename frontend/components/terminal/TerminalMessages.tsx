
import React from 'react';
import { Loader2 } from 'lucide-react';
import { TerminalMessage } from '../../types';

interface TerminalMessagesProps {
  messages: TerminalMessage[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const TerminalMessages: React.FC<TerminalMessagesProps> = ({ messages, isLoading, scrollRef }) => (
  <div 
    ref={scrollRef}
    className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4 scroll-smooth"
  >
    {messages.map(msg => (
      <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-[85%] p-3 rounded-lg ${
          msg.role === 'system' 
            ? 'text-[#C5A028] bg-transparent italic' 
            : msg.role === 'user' 
              ? 'bg-[#FFD700]/10 border border-[#FFD700]/20 text-white' 
              : 'text-silver bg-[#1A1A1A] border border-[#333]'
        }`}>
          {msg.role === 'assistant' && (
            <div className="text-[10px] text-[#FFD700] mb-1 font-bold uppercase tracking-tighter">Aureus Response:</div>
          )}
          <div className="whitespace-pre-wrap leading-relaxed">
            {msg.content}
          </div>
        </div>
        <span className="text-[9px] text-[#444] mt-1 px-2">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    ))}
    {isLoading && (
      <div className="flex items-center gap-3 text-[#FFD700] italic animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Processing luxury market indices...</span>
      </div>
    )}
  </div>
);
