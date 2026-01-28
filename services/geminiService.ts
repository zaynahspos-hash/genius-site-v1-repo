import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const AI_URL = `${API_BASE_URL}/admin/ai`;

/**
 * Helper to call backend AI generation
 */
const callAI = async (prompt: string, type: string, context: any = {}) => {
  const res = await safeFetch(`${AI_URL}/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ prompt, type, context })
  });
  const data = await res.json();
  return data.text;
};

/**
 * Generates a professional product description.
 */
export const generateProductDescription = async (title: string, keywords: string): Promise<string> => {
  try {
    return await callAI(
      `Write a professional, persuasive, and SEO-optimized product description. Product Title: ${title}. Tone: Modern and trustworthy. Length: 2-3 sentences. Just the text.`,
      'product_description',
      { keywords }
    );
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Error generating content. Please check backend logs.";
  }
};

/**
 * Provides business insights based on dashboard statistics.
 */
export const generateBusinessInsights = async (stats: any): Promise<string> => {
  try {
    return await callAI(
      `Provide 3 actionable growth strategies based on these stats. Format: Return a concise summary with bullet points.`,
      'insights',
      stats
    );
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Failed to analyze business data.";
  }
};

/**
 * Shopping Assistant Chat Logic
 */
export const getShoppingAssistantResponse = async (userMessage: string, catalogContext: string): Promise<string> => {
  try {
    // For chat, we might still want a quick endpoint, but using the generic one works
    return await callAI(
      userMessage,
      'chat',
      { 
        systemInstruction: `You are ShopGenius AI, a helpful personal shopper. Use this catalog context: ${catalogContext}. Be friendly and concise.`,
      }
    );
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having a bit of trouble connecting. Can I help you with something else?";
  }
};

/**
 * Generates a product image based on a prompt.
 * Note: Image generation usually stays on backend if key needs protection, or direct if using specific restricted keys.
 * For now, we stub this or route it similarly if backend supports it.
 */
export const generateProductImage = async (prompt: string): Promise<string | null> => {
  // Image generation often requires specific models not always available in standard text endpoints.
  // Returning null as placeholder or implement distinct backend route if needed.
  console.warn("Image generation via backend not fully implemented in this refactor.");
  return null;
};
