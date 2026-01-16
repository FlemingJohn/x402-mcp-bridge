import axios from "axios";

// Helper to find a working model
export async function resolveModel(apiKey: string): Promise<string> {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);
        const models = response.data.models;

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
export async function sendMessageWithRetry(chat: any, content: any, retries = 10): Promise<any> {
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
