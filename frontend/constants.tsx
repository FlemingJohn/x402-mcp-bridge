
import React from 'react';
import { TrendingUp, ShieldCheck, Diamond, Briefcase, Globe, Zap } from 'lucide-react';

export const COLORS = {
  black: '#090909',
  gold: '#FFD700',
  darkGold: '#C5A028',
  silver: '#E5E7EB',
};

export const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-[#FFD700]" />,
    title: "Light-Speed Bridge",
    description: "Instant, low-latency communication between AI agents and the Cronos EVM."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#FFD700]" />,
    title: "Militarily Secure",
    description: "End-to-end encrypted signals with automated transaction verification and revert protection."
  },
  {
    icon: <Briefcase className="w-6 h-6 text-[#FFD700]" />,
    title: "MCP Standard",
    description: "Built on the Model Context Protocol for universal compatibility with Claude, Gemini, and OpenAI."
  },
  {
    icon: <Globe className="w-6 h-6 text-[#FFD700]" />,
    title: "Cronos Native",
    description: "Deep integration with Cronos Testnet/Mainnet for seamless DeFi interactions."
  }
];
