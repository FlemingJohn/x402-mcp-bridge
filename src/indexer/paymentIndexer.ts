import { facilitatorClient, provider } from "../blockchain/cronos";
import { db } from "../db/database";
import { Interface } from "ethers";

// x402 Facilitator Event ABI snippet
const X402_ABI = [
    "event PaymentExecuted(address indexed agentId, address indexed sender, uint256 amount, string currency, string reason, bytes32 indexed txHash)"
];

export const startIndexing = async () => {
    console.log("Starting payment indexer...");

    let facilitatorAddress = process.env.X402_FACILITATOR_ADDRESS;
    if (!facilitatorAddress || facilitatorAddress === "0x0000000000000000000000000000000000000000") {
        facilitatorAddress = "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0"; // Fallback to USDC Testnet
    }

    // Standard ERC20 Transfer event
    const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"; // keccak256("Transfer(address,address,uint256)")
    const TRANSFER_ABI = [
        "event Transfer(address indexed from, address indexed to, uint256 value)"
    ];

    const iface = new Interface(TRANSFER_ABI);

    let lastBlock = await provider.getBlockNumber();
    console.log(`Indexer started at block ${lastBlock} listening on ${facilitatorAddress}`);

    // Poll every 5 seconds to avoid eth_newFilter restrictions
    setInterval(async () => {
        try {
            const currentBlock = await provider.getBlockNumber();
            if (currentBlock <= lastBlock) return;

            const logs = await provider.getLogs({
                fromBlock: lastBlock + 1,
                toBlock: currentBlock,
                address: facilitatorAddress,
                topics: [TRANSFER_TOPIC]
            });

            for (const log of logs) {
                try {
                    const parsedLog = iface.parseLog(log);
                    if (parsedLog && parsedLog.name === "Transfer") {
                        const { from, to, value } = parsedLog.args;
                        const txHash = log.transactionHash;

                        savePayment({
                            txHash,
                            agentId: from,
                            amount: value.toString(),
                            currency: "USDC",
                            status: "success",
                            reason: "Full X402 Settlement",
                            metadata: { from, to }
                        });
                        console.log(`Indexed new x402 payment: ${txHash}`);
                    }
                } catch (e) {
                    // ignore parse errors
                }
            }
            lastBlock = currentBlock;
        } catch (error) {
            console.error("Polling error:", error);
        }
    }, 5000);
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
