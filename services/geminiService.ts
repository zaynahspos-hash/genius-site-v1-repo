
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a professional product description.
 */
export const generateProductDescription = async (title: string, keywords: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional, persuasive, and SEO-optimized product description.
        Product Title: ${title}
        Keywords/Features: ${keywords}
        Tone: Modern and trustworthy. Length: 2-3 sentences. Just the text.`,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Error generating content. Please try again.";
  }
};

/**
 * Provides business insights based on dashboard statistics.
 */
export const generateBusinessInsights = async (stats: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `As an e-commerce consultant, analyze these store stats and provide 3 actionable growth strategies.
        Stats: ${JSON.stringify(stats)}
        Format: Return a concise summary with bullet points.`,
    });

    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Failed to analyze business data.";
  }
};

/**
 * Shopping Assistant Chat Logic
 */
export const getShoppingAssistantResponse = async (userMessage: string, catalogContext: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are ShopGenius AI, a helpful personal shopper. 
          Use the following product catalog to answer questions: ${catalogContext}.
          Be friendly, concise, and always try to recommend specific products from the catalog.
          If you don't know the answer, suggest checking the help center.`,
      },
      contents: userMessage,
    });

    return response.text || "I'm here to help! What are you looking for today?";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having a bit of trouble connecting. Can I help you with something else?";
  }
};

/**
 * Generates a product image based on a prompt.
 */
export const generateProductImage = async (prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high-quality, professional e-commerce product photo: ${prompt}. Studio lighting, clean white background, 4k resolution.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null; 
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
