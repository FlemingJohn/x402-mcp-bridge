
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsight = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are AUREUS, a high-end private wealth management AI assistant. 
        Your tone is professional, sophisticated, and executive. 
        Focus on luxury assets: Gold, Fine Art, Luxury Watches (Rolex, Patek), Prime Real Estate, and Blue-chip Crypto.
        Provide succinct, data-driven insights. Format your responses with clear structure and a touch of elegance.`,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 1000 }
      },
    });

    return response.text || "I apologize, but my market sensors are temporarily obstructed. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the AUREUS intelligence network.";
  }
};
