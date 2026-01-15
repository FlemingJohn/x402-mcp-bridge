import { facilitatorClient } from "../blockchain/cronos";
import { db } from "../db/database";

export const startIndexing = () => {
    console.log("Starting payment indexer...");

    // In a real implementation, we would use facilitatorClient.contract.on(...)
    // For this bridge, we'll poll or listen for generic x402 events.

    // Placeholder for event listener logic
    // facilitatorClient.on("PaymentExecuted", (event) => { ... })

    console.log("Indexer listening for x402 events on Cronos...");
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
