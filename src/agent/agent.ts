import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
import { Wallet } from "ethers";

// Suppress dotenv logging if possible
dotenv.config({ path: '.env', debug: false } as any);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MCP_URL = "http://localhost:4020/api/mcp";

/**
 * Tool definitions for Gemini to understand how to interact with the bridge.
 */
const tools = [
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

/**
 * Calls the local MCP server with the specified tool and parameters.
 */
const callMcpTool = async (toolName: string, params: any) => {
    try {
        const response = await axios.post(MCP_URL, {
            tool: toolName,
            params: params
        });
        return response.data;
    } catch (error: any) {
        return { error: error.message };
    }
};

/**
 * Main agent loop using Gemini with tool-calling.
 */
// Helper to find a working model
async function resolveModel(apiKey: string): Promise<string> {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);
        const models = response.data.models;

        // console.log("Available Models for this Key:");
        // models.forEach((m: any) => {
        //     if (m.name.includes("gemini")) console.log(` - ${m.name}`);
        // });

        // Prefer stable flash models for rate limits
        const preferred = [
            "models/gemini-flash-latest",
            "models/gemini-2.0-flash-lite",
            "models/gemini-1.5-flash",
            "models/gemini-1.5-flash-latest",
            "models/gemini-1.5-flash-001",
            "models/gemini-2.0-flash-exp",
            "models/gemini-pro"
        ];

        // First check if any preferred model exists
        for (const p of preferred) {
            if (models.find((m: any) => m.name === p)) return p.replace("models/", "");
        }

        // Fallback: Find ANY gemini model that supports content generation
        const backup = models.find((m: any) =>
            m.name.includes("gemini") &&
            m.supportedGenerationMethods.includes("generateContent")
        );

        if (backup) return backup.name.replace("models/", "");

        return "gemini-1.5-flash";
    } catch (e) {
        console.warn("Model resolution failed, defaulting to gemini-1.5-flash");
        return "gemini-1.5-flash";
    }
}

// Retry wrapper
async function sendMessageWithRetry(chat: any, content: any, retries = 10): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            return await chat.sendMessage(content);
        } catch (error: any) {
            if (error.status === 429 || error.message.includes("429")) {
                // Exponential backoff: 2s, 3s, 4.5s... capped at 10s
                const baseWait = Math.min(2000 * Math.pow(1.5, i), 10000);
                const waitTime = Math.floor(baseWait);

                console.warn(`[429] Rate limit hit. Retrying in ${waitTime / 1000}s (Attempt ${i + 1}/${retries})...`);
                await new Promise(r => setTimeout(r, waitTime));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Max retries exceeded. Please wait a minute and try again.");
}

async function startGeminiAgent(userPrompt: string) {
    const apiKey = process.env.GEMINI_API_KEY || "";

    // Derive address from env for context
    let userContext = "";
    try {
        if (process.env.PRIVATE_KEY) {
            const wallet = new Wallet(process.env.PRIVATE_KEY);
            userContext = `system_instruction: The user's wallet address is ${wallet.address}. If they refer to "my" address/balance/funds, use this. `;
        }
    } catch (e) {
        // Ignore invalid keys
    }

    const modelName = await resolveModel(apiKey);
    console.log(`Using Gemini Model: ${modelName}`);

    const model = genAI.getGenerativeModel({
        model: modelName,
        tools: [{ functionDeclarations: tools as any }]
    });

    const chat = model.startChat();

    console.log(`\n\nUser:\n${userPrompt}\n`);

    // Combine context with prompt
    const fullPrompt = userContext ? `${userContext}\n\n${userPrompt}` : userPrompt;
    let result = await sendMessageWithRetry(chat, fullPrompt);
    let response = result.response;

    // Handle tool calls iteratively
    while (response.candidates![0].content.parts.some((part: any) => part.functionCall)) {
        const functionCalls = response.candidates![0].content.parts.filter((part: any) => part.functionCall);

        const toolResults = await Promise.all(functionCalls.map(async (fc: any) => {
            console.log(`Agent: Calling tool ${fc.functionCall.name}...`);
            const mcpResult = await callMcpTool(fc.functionCall.name, fc.functionCall.args);
            return {
                functionResponse: {
                    name: fc.functionCall.name,
                    response: mcpResult
                }
            };
        }));

        result = await sendMessageWithRetry(chat, toolResults);
        response = result.response;
    }

    console.log(`\nGemini:\n${response.text()}\n`);
}

// Simple CLI entry point
if (require.main === module) {
    const prompt = process.argv.slice(2).join(" ") || "What is my balance for address 0x0000000000000000000000000000000000000000?";
    startGeminiAgent(prompt).catch(console.error);
}

export { startGeminiAgent };
