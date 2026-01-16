
import React from 'react';
import { Terminal, Database, Activity, AlertCircle } from 'lucide-react';

const TOOLS = [
    {
        name: 'get_agent_balance',
        description: 'Fetch the native TCRO balance of a specified Cronos address.',
        icon: <Database className="w-5 h-5 text-[#FFD700]" />,
        params: '{ address: "0x..." }'
    },
    {
        name: 'make_payment',
        description: 'Executes a secure X402 payment on Cronos. Requires recipient and description.',
        icon: <Activity className="w-5 h-5 text-[#FFD700]" />,
        params: '{ to: "0x...", amount: "1000", description: "Payment" }'
    },
    {
        name: 'get_payment_history',
        description: 'Retrieves the indexed payment history for a specific agent ID.',
        icon: <Terminal className="w-5 h-5 text-[#FFD700]" />,
        params: '{ agent_id: "agent_123" }'
    },
    {
        name: 'explain_failure',
        description: 'Provides a natural language explanation for a failed transaction using its hash.',
        icon: <AlertCircle className="w-5 h-5 text-[#FFD700]" />,
        params: '{ tx_hash: "0xabc..." }'
    }
];

export const ToolsSection: React.FC = () => {
    return (
        <section id="tools" className="max-w-7xl mx-auto mt-32 scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-6 border-b border-[#222] pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[10px] uppercase tracking-widest font-bold mb-4">
                        <Terminal className="w-3 h-3" /> MCP Inventory
                    </div>
                    <h3 className="text-4xl font-bold text-white serif">Agent Capabilities</h3>
                </div>
                <p className="text-silver/40 max-w-sm text-right mt-4 md:mt-0">
                    Native tools exposed to the LLM context for autonomous blockchain interaction.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 px-6">
                {TOOLS.map((tool) => (
                    <div key={tool.name} className="group relative p-6 bg-[#090909] rounded-xl border border-[#222] hover:border-[#FFD700]/30 transition-all overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs text-[#333] group-hover:text-[#FFD700]/20 transition-colors">
                            function
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-[#111] border border-[#222] group-hover:border-[#FFD700]/50 transition-colors">
                                {tool.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-white font-mono mb-2 group-hover:text-[#FFD700] transition-colors">
                                    {tool.name}
                                </h4>
                                <p className="text-sm text-silver/50 mb-4 leading-relaxed">
                                    {tool.description}
                                </p>
                                <div className="bg-[#050505] rounded border border-[#222] p-3 font-mono text-xs text-silver/70">
                                    <span className="text-[#FFD700]">params:</span> {tool.params}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
