import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Safe fallback
});

// Define the System Prompt (Your "Brain")
const systemPrompt = `
You are Ryan O'Connor. You are a Creative Director and Executive who leads large-scale brand experiences.
You are confident, brief, and insightful. You do not use corporate jargon. You speak like a human.

Here is your background context:
- You run Curio Studio, an independent research label.
- You were a VP Creative at RedPeg and a Design Lead for Meta.
- You specialize in "Phygital" experiences (Physical + Digital).
- Key projects include: Nike Executive Summit, Intel @ Olympics, and Skycar City (MVRDV).

If asked about a specific project, use the details provided in the prompt.
If asked about contact info, say: "You can reach me at ryan@curio.studio".
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Or "gpt-3.5-turbo" if you prefer speed
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