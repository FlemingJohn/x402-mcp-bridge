import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Wallet } from "ethers";

import { tools } from "./tools";
import { resolveModel, sendMessageWithRetry } from "./utils";
import { callMcpTool } from "./mcp";

// Suppress dotenv logging if possible
dotenv.config({ path: '.env', debug: false } as any);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Main agent loop using Gemini with tool-calling.
 */
async function startGeminiAgent(userPrompt: string) {
    const apiKey = process.env.GEMINI_API_KEY || "";

    // Derive address from env for context
    let userContext = "";
    try {
        if (process.env.PRIVATE_KEY) {
            const wallet = new Wallet(process.env.PRIVATE_KEY);
            userContext = `system_instruction: The user's wallet address is ${wallet.address}. If they refer to "my" address/balance/funds, use this. 
            If the user needs funds (TCRO or USDC), direct them to the Cronos Testnet Faucet: https://cronos.org/faucet`;
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
