import { JsonRpcProvider, Wallet } from "ethers";
import { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
import dotenv from "dotenv";

dotenv.config();

export const provider = new JsonRpcProvider(process.env.CRONOS_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
export const signer = (privateKey && privateKey !== "0000000000000000000000000000000000000000000000000000000000000000")
    ? new Wallet(privateKey, provider)
    : undefined;

// The sdk Facilitator constructor takes ClientConfig & { network: CronosNetwork }
export const facilitatorClient = new Facilitator({
    baseUrl: "https://facilitator.cronoslabs.org",
    network: CronosNetwork.CronosTestnet
});

export const USDC_TESTNET_ADDRESS = "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0";

/**
 * Executes a full X402 payment flow.
 * 1. Generates EIP-3009 signed header.
 * 2. Generates payment requirements.
 * 3. Verifies and settles the payment via the facilitator.
 */
export const executePayment = async (to: string, amount: string, description: string) => {
    if (!signer) {
        throw new Error("Signer (PRIVATE_KEY) not configured or invalid.");
    }

    try {
        // 1) Generate Header (requires signer)
        const header = await facilitatorClient.generatePaymentHeader({
            to,
            value: amount, // base units
            signer,
        });

        // 2) Generate Requirements
        const reqs = facilitatorClient.generatePaymentRequirements({
            payTo: to,
            description,
            maxAmountRequired: amount,
        });

        // 3) Build and Verify
        const body = facilitatorClient.buildVerifyRequest(header, reqs);
        const verify = await facilitatorClient.verifyPayment(body);

        if (!verify.isValid) {
            throw new Error(`X402 Verification failed: ${verify.invalidReason}`);
        }

        // 4) Settle
        const settle = await facilitatorClient.settlePayment(body);
        return settle;
    } catch (error: any) {
        console.error("Payment execution error:", error.message);
        throw error;
    }
};

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
