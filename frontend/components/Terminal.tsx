
import React, { useState, useRef, useEffect } from 'react';
import { TerminalMessage } from '../types';
import { getFinancialInsight } from '../services/geminiService';
import { TerminalHeader } from './terminal/TerminalHeader';
import { TerminalMessages } from './terminal/TerminalMessages';
import { TerminalInput } from './terminal/TerminalInput';

interface TerminalProps {
  onActivity: (active: boolean) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onActivity }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'AUREUS Intelligence Terminal v4.0. Connection established. Ready for luxury asset analysis.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: TerminalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    onActivity(true);

    const responseText = await getFinancialInsight(input);

    const aiMsg: TerminalMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
    onActivity(false);
  };

  return (
    <div className="w-full h-[500px] flex flex-col bg-black/80 rounded-xl overflow-hidden gold-border gold-glow">
      <TerminalHeader />
      <TerminalMessages messages={messages} isLoading={isLoading} scrollRef={scrollRef} />
      <TerminalInput input={input} setInput={setInput} handleSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default Terminal;
