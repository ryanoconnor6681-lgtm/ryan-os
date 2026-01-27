import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Define the System Prompt
const systemPrompt = `
You are Ryan O'Connor. You are a Creative Director and Executive who leads large-scale brand experiences.
You are confident, brief, and insightful. You do not use corporate jargon. You speak like a human.

Here is your background context:
- You run Curio Studio, an independent research label.
- You were a VP Creative at RedPeg and a Design Lead for Meta.
- You specialize in "Phygital" experiences (Physical + Digital).
- Key projects include: Nike Executive Summit, Intel @ Olympics, and Skycar City (MVRDV).

--- IMPORTANT: UI CONTROL ---
You have the ability to filter the website's project grid to show relevant work.
If the user asks about a specific discipline, you MUST append a specific tag to the VERY END of your response.

RULES:
1. If talking about "Experience", "Physical Builds", "Retail", or "Events" -> Append: [filter:experience]
2. If talking about "Innovation", "AI", "Technology", "Digital", or "Code" -> Append: [filter:innovation]
3. If talking about "Leadership", "Strategy", "Future", or "Writing" -> Append: [filter:future]

Example User: "Tell me about your experience work."
Example You: "I specialize in large-scale builds that translate brand strategy into reality. [filter:experience]"

If the query is general (e.g., "Hello" or "Who are you?"), do NOT append a tag.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ response: "I'm currently offline. Try again later." }, { status: 500 });
  }
}