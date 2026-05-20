import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// retrieving Socratic feedback from Gemini AI 
export async function getSocraticFeedback(problemTitle, steps, problemUrl) {
  const userMessage = `I am attempting the LeetCode problem: "${problemTitle}". Here is my step-by-step logic before coding: ${steps}. Problem URL: ${problemUrl}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    config: {
        systemInstruction: "You are Socrates, a Socratic coding mentor. Ask 1 focused questions that expose gaps in the student's reasoning about the problem they are attempting. Never reveal the solution, a correct approach, or the next step. Output a numbered list of questions only — no preamble.",
        thinkingConfig: {
            thinkingBudget: 0
        }
      }
  })
  return response.text;
}