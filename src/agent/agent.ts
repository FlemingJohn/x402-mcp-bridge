import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

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
async function startGeminiAgent(userPrompt: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        tools: [{ functionDeclarations: tools as any }]
    });

    const chat = model.startChat();

    console.log(`\n[User]: ${userPrompt}`);

    let result = await chat.sendMessage(userPrompt);
    let response = result.response;

    // Handle tool calls iteratively
    while (response.candidates![0].content.parts.some(part => part.functionCall)) {
        const functionCalls = response.candidates![0].content.parts.filter(part => part.functionCall);

        const toolResults = await Promise.all(functionCalls.map(async (fc: any) => {
            console.log(`\n[Agent]: Calling tool ${fc.functionCall.name}...`);
            const mcpResult = await callMcpTool(fc.functionCall.name, fc.functionCall.args);
            return {
                functionResponse: {
                    name: fc.functionCall.name,
                    response: mcpResult
                }
            };
        }));

        result = await chat.sendMessage(toolResults);
        response = result.response;
    }

    console.log(`\n[Gemini]: ${response.text()}`);
}

// Simple CLI entry point
if (require.main === module) {
    const prompt = process.argv.slice(2).join(" ") || "What is my balance for address 0x0000000000000000000000000000000000000000?";
    startGeminiAgent(prompt).catch(console.error);
}

export { startGeminiAgent };
