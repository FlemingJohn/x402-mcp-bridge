import { facilitatorClient, provider } from "../blockchain/cronos";
import { db } from "../db/database";
import { Interface } from "ethers";

// x402 Facilitator Event ABI snippet
const X402_ABI = [
    "event PaymentExecuted(address indexed agentId, address indexed sender, uint256 amount, string currency, string reason, bytes32 indexed txHash)"
];

export const startIndexing = () => {
    console.log("Starting payment indexer...");

    const facilitatorAddress = process.env.X402_FACILITATOR_ADDRESS || "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0"; // Default to USDC Testnet

    // Standard ERC20 Transfer event
    // event Transfer(address indexed from, address indexed to, uint256 value)
    const TRANSFER_ABI = [
        "event Transfer(address indexed from, address indexed to, uint256 value)"
    ];

    const iface = new Interface(TRANSFER_ABI);

    // Listening for logs on the USDC contract
    provider.on({ address: facilitatorAddress }, (log: any) => {
        try {
            const parsedLog = iface.parseLog(log);
            if (parsedLog && parsedLog.name === "Transfer") {
                const { from, to, value } = parsedLog.args;

                // We only care about this if we can associate it with an "agent" or if we just log everything for now
                const txHash = log.transactionHash;

                savePayment({
                    txHash,
                    agentId: from, // simplified: assuming sender is agent
                    amount: value.toString(),
                    currency: "USDC",
                    status: "success",
                    reason: "Full X402 Settlement",
                    metadata: { from, to }
                });
                console.log(`Indexed new x402 payment: ${txHash}`);
            }
        } catch (e) {
            // Log might not be for this event, ignore
        }
    });

    console.log(`Indexer listening for x402 events on ${facilitatorAddress}...`);
};

export const savePayment = (payment: any) => {
    const { txHash, agentId, amount, currency, status, reason, metadata } = payment;

    db.run(`
    INSERT OR IGNORE INTO x402_payments (tx_hash, agent_id, amount, currency, status, reason, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [txHash, agentId, amount, currency, status, reason, JSON.stringify(metadata)], (err: any) => {
        if (err) {
            console.error("Failed to save payment:", err);
        }
    });
};
