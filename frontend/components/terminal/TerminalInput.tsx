
import React from 'react';
import { Send } from 'lucide-react';

interface TerminalInputProps {
  input: string;
  setInput: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ input, setInput, handleSubmit, isLoading }) => (
  <form onSubmit={handleSubmit} className="p-4 bg-[#111] border-t border-[#333]">
    <div className="relative">
      <input 
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Inquire about gold prices, luxury real estate, or fine art..."
        className="w-full bg-black border border-[#333] rounded-full py-3 px-6 pr-14 text-sm text-silver placeholder-[#555] focus:outline-none focus:border-[#FFD700] transition-all"
        disabled={isLoading}
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FFD700] text-black hover:bg-[#C5A028] transition-colors disabled:opacity-50"
        disabled={isLoading}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  </form>
);
