import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Robustly parses JSON from AI responses, handling 
 * markdown code blocks and other common formatting artifacts.
 */
function parseAIJSON(text: string) {
    let cleanText = text.trim();
    // Remove markdown code blocks (```json ... ```)
    cleanText = cleanText.replace(/^```[a-z]*\n/i, '').replace(/\n```$/m, '');

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse AI response as JSON");
}

export async function generateToolDescription(name: string, url: string, category: string) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }

    const prompt = `
        You are an expert tech curator for "RankedByUs", a premium AI tool registry.
        
        Tool Name: ${name}
        Website: ${url}
        Category: ${category}
        
        Task:
        1. Write a professional, punchy, and SEO-optimized description (max 150 words). 
        2. Focus on the unique value proposition (UVP) and solving specific problems.
        3. Suggest 3-5 relevant tags for this tool.
        
        Output format (JSON):
        {
            "description": "...",
            "tags": ["tag1", "tag2", "tag3"]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return parseAIJSON(text);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}

export async function generateArticleContent(topic: string, linkedToolName?: string) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }

    const prompt = `
        You are an elite tech journalist for "RankedByUs".
        Topic/Headline: ${topic}
        ${linkedToolName ? `Highlight Tool: ${linkedToolName}` : ""}
        
        Task:
        1. Write a comprehensive, technical deep-dive article (approx 500-800 words).
        2. Use Markdown formatting (headers, bolding, lists).
        3. Make it highly engaging for a developer/creator audience.
        4. Include a "Verdict" section.
        5. Provide a punchy 1-sentence excerpt.
        
        Output format (JSON):
        {
            "title": "A compelling SEO-optimized headline",
            "excerpt": "...",
            "content": "... (Markdown format) ..."
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return parseAIJSON(text);
    } catch (error) {
        console.error("AI Article Generation Error:", error);
        throw error;
    }
}
