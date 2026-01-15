import { JsonRpcProvider, Wallet } from "ethers";
import { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
import dotenv from "dotenv";

dotenv.config();

const provider = new JsonRpcProvider(process.env.CRONOS_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const signer = (privateKey && privateKey !== "0000000000000000000000000000000000000000000000000000000000000000")
    ? new Wallet(privateKey, provider)
    : undefined;

// The sdk Facilitator constructor takes ClientConfig & { network: CronosNetwork }
export const facilitatorClient = new Facilitator({
    baseUrl: "https://evm-t3.cronos.org",
    network: CronosNetwork.CronosTestnet
});
// Note: In a real scenario, we'll use the provider/signer for Ethers calls 
// and the Facilitator for X402 specific API calls.

export const getAgentBalance = async (address: string) => {
    const balance = await provider.getBalance(address);
    return balance.toString();
};

// Placeholder for verification logic
export const verifyPayment = async (txHash: string) => {
    const tx = await provider.getTransactionReceipt(txHash);
    return tx;
};
