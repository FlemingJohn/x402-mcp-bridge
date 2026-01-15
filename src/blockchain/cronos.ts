import { JsonRpcProvider, Wallet } from "ethers";
import { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
import dotenv from "dotenv";

dotenv.config();

export const provider = new JsonRpcProvider(process.env.CRONOS_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const signer = (privateKey && privateKey !== "0000000000000000000000000000000000000000000000000000000000000000")
    ? new Wallet(privateKey, provider)
    : undefined;

// The sdk Facilitator constructor takes ClientConfig & { network: CronosNetwork }
export const facilitatorClient = new Facilitator({
    baseUrl: "https://evm-t3.cronos.org",
    network: CronosNetwork.CronosTestnet
});
/**
 * Retrieves the agent's balance on Cronos.
 * This includes the native TCRO balance and could be extended to include
 * supported X402 tokens like USDC.
 */
export const getAgentBalance = async (address: string) => {
    const balance = await provider.getBalance(address);
    return {
        native: balance.toString(),
        symbol: "TCRO",
        timestamp: new Date().toISOString()
    };
};

// Comprehensive verification logic
export const verifyPayment = async (txHash: string) => {
    try {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) return { status: "not_found", message: "Transaction receipt not available yet." };

        const success = receipt.status === 1;
        return {
            status: success ? "success" : "failed",
            blockNumber: receipt.blockNumber,
            confirmations: await receipt.confirmations(),
            from: receipt.from,
            to: receipt.to,
            gasUsed: receipt.gasUsed.toString()
        };
    } catch (error: any) {
        return { status: "error", message: error.message };
    }
};
