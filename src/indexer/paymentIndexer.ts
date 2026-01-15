import { facilitatorClient, provider } from "../blockchain/cronos";
import { db } from "../db/database";
import { Interface } from "ethers";

// x402 Facilitator Event ABI snippet
const X402_ABI = [
    "event PaymentExecuted(address indexed agentId, address indexed sender, uint256 amount, string currency, string reason, bytes32 indexed txHash)"
];

export const startIndexing = () => {
    console.log("Starting payment indexer...");

    const facilitatorAddress = process.env.X402_FACILITATOR_ADDRESS;
    if (!facilitatorAddress || facilitatorAddress === "0x0000000000000000000000000000000000000000") {
        console.warn("X402_FACILITATOR_ADDRESS is not configured. Indexer will not start.");
        return;
    }

    const iface = new Interface(X402_ABI);

    // Listening for logs on the facilitator contract
    provider.on({ address: facilitatorAddress }, (log: any) => {
        try {
            const parsedLog = iface.parseLog(log);
            if (parsedLog && parsedLog.name === "PaymentExecuted") {
                const { agentId, sender, amount, currency, reason, txHash } = parsedLog.args;
                savePayment({
                    txHash,
                    agentId,
                    amount: amount.toString(),
                    currency,
                    status: "success",
                    reason,
                    metadata: { sender }
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
