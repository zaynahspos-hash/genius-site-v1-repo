import { GoogleGenAI } from "@google/genai";

// @desc    Generate content using Gemini
// @route   POST /api/admin/ai/generate-content
// @access  Private/Admin
export const generateContent = async (req, res) => {
  const { prompt, type, context } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ message: 'Gemini API Key is not configured' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let modelName = 'gemini-3-flash-preview';
    let finalPrompt = prompt;

    // Adjust model/prompt based on task type
    if (type === 'insights') {
        modelName = 'gemini-3-pro-preview';
        finalPrompt = `As an e-commerce expert, analyze these stats and provide insights: ${JSON.stringify(context)}. Task: ${prompt}`;
    } else if (type === 'product_description') {
        finalPrompt = `Write a professional e-commerce product description. Context: ${context}. Instructions: ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: finalPrompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ message: 'AI Generation Failed', error: error.message });
  }
};
