
export interface AssetData {
  name: string;
  price: number;
  change: number;
  trend: 'up' | 'down';
}

export interface TerminalMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface InvestmentInsight {
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  potential: string;
}
