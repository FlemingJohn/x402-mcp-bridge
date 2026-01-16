
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
    icon: <Diamond className="w-6 h-6 text-[#FFD700]" />,
    title: "Elite Analysis",
    description: "Deep-dive intelligence for high-net-worth portfolio management."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#FFD700]" />,
    title: "Secure Insights",
    description: "End-to-end encrypted financial modeling and forecasting."
  },
  {
    icon: <Zap className="w-6 h-6 text-[#FFD700]" />,
    title: "Real-time Edge",
    description: "Instant market volatility detection and trend mapping."
  },
  {
    icon: <Globe className="w-6 h-6 text-[#FFD700]" />,
    title: "Global Custody",
    description: "Insights spanning international luxury real estate and commodities."
  }
];
