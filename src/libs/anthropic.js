import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true,
})

export async function getSocraticFeedback(problemTitle, steps) {
    const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: `You are a Socratic coding mentor. Ask 2-4 focused questions that expose gaps in the student's reasoning. Never reveal the solution, a correct approach, or the next step. Output a numbered list of questions only — no preamble.`,
        messages: [
            {
                role: 'user',
                content: `Problem: ${problemTitle}\n\nMy reasoning steps:\n${steps}`,
            },
        ],
    })

    return message.content[0].text
}