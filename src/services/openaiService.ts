import { OPENAI_API_URL } from "../constants/aiApiUrl";
import type { PromptInput } from "../constants/prompt"

const fillPrompt = (promptParams : PromptInput): string => {
    const {quantity, device, room} = promptParams;
    return `I have ${quantity} ${device} in my ${room}. What can u suggest to do with ${device} to reduce energy consumption there?`;
}

export const askSuggestion = async (promptParams : PromptInput): Promise<string> => {
    const prompt = fillPrompt(promptParams);
    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4о",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        }),
    })

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "No suggestion received.";
}