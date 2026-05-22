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

export async function getHint(problemTitle, steps, problemUrl) {
  const userMessage = `I am attempting: "${problemTitle}". My current thinking: ${steps}. Problem URL: ${problemUrl}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    config: {
      systemInstruction: "You are a coding mentor. Give the student exactly one small nudge — a direction to think in, not a solution or algorithm. One sentence only.",
      thinkingConfig: { 
        thinkingBudget: 0 
      }
    }
  })
  return response.text;
}

export async function summariseThought(problemTitle, steps, problemUrl) {
  const userMessage = `Based on my current thinking: ${steps} for the question: ${problemTitle} with URL: ${problemUrl}, can you summarise my approach in a few words?`
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    config: {
      systemInstruction: "Classify the user's approach to the LeetCode problem as one of: Brute Force, Optimised, or Optimal. Then add a 3–5 word summary of the specific technique used. Format: '<Category> — <technique>'. Example: 'Brute Force — nested loop scan'. No other output.",
      thinkingConfig: {
        thinkingBudget: 0
      }
    }
  })
  return response.text;
}