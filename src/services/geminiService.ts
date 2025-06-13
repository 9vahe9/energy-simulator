import { AI_API_URL } from "../constants/aiApiUrl";

export const generateAIResponse = async (prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const response = await fetch(`${AI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI response");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
