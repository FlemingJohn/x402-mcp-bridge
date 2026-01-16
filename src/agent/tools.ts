/**
 * Tool definitions for Gemini to understand how to interact with the bridge.
 */
export const tools = [
    {
        name: "get_agent_balance",
        description: "Fetch the native TCRO balance of a specified Cronos address.",
        parameters: {
            type: "object",
            properties: {
                address: { type: "string", description: "The Cronos EVM wallet address." }
            },
            required: ["address"]
        }
    },
    {
        name: "make_payment",
        description: "Executes a secure X402 payment on Cronos. Requires recipient, amount in base units, and a description.",
        parameters: {
            type: "object",
            properties: {
                to: { type: "string", description: "Recipient address." },
                amount: { type: "string", description: "Amount in base units (e.g., '1000000' for 1 USDC)." },
                description: { type: "string", description: "Purpose of the payment." }
            },
            required: ["to", "amount", "description"]
        }
    },
    {
        name: "get_payment_history",
        description: "Retrieves the indexed payment history for a specific agent ID.",
        parameters: {
            type: "object",
            properties: {
                agent_id: { type: "string", description: "The unique ID of the agent." }
            },
            required: ["agent_id"]
        }
    },
    {
        name: "explain_failure",
        description: "Provides a natural language explanation for a failed transaction using its hash.",
        parameters: {
            type: "object",
            properties: {
                tx_hash: { type: "string", description: "The transaction hash to investigate." }
            },
            required: ["tx_hash"]
        }
    }
];
