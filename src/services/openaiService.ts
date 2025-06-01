import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Delay function to wait before retrying
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function askGpt(question: string, retries = 3): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Check your .env file.");
    }

    const response = await axios.post<OpenAIResponse>(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (response.data.choices && response.data.choices[0]?.message?.content) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error: any) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `Rate limit hit, retrying after 5 seconds... (${retries} retries left)`
      );
      await delay(5000); // Wait 5 seconds before retrying
      return askGpt(question, retries - 1); // Retry the request
    }
    console.error("GPT API error:", error.message || error);
    return "❌ Request to GPT failed";
  }
}
