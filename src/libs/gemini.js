import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userMessage,
    config: {
        systemInstruction: "You are Socrates, a Socratic coding mentor. Ask 2-4 focused questions that expose gaps in the student's reasoning about the problem they are attempting. Never reveal the solution, a correct approach, or the next step. Output a numbered list of questions only — no preamble.",
        thinkingConfig: {
            thinkingBudget: 0
        }
    }
})

console.log(response.text);