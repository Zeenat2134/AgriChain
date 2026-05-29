const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini client (it automatically picks up GEMINI_API_KEY from .env)
const ai = new GoogleGenAI({});

const getCropAdvice = async (req, res) => {
  try {
    const { farmerQuestion } = req.body;

    if (!farmerQuestion) {
      return res.status(400).json({ error: "Please provide a question." });
    }

    const systemInstruction = `
      You are an expert Indian Agronomist working for 'Agri-Chain'. 
      Your job is to help farmers diagnose crop diseases, suggest fertilizers, and give farming advice.
      Keep your answers short, practical, and easy to understand.
      If a user asks about anything other than farming or agriculture, politely decline to answer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: farmerQuestion,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const aiResponse = response.text;

    res.status(200).json({ answer: aiResponse });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to connect to the AI Crop Doctor." });
  }
};

module.exports = { getCropAdvice };