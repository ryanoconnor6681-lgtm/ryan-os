import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// HARDCODED ID: Stability override
const ASSISTANT_ID = 'asst_lDBeuMQlca4yjadkBue3xVcW'; 

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    // 1. Create or Retrieve a Thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      thread = await openai.beta.threads.create();
    }

    // 2. Add the User's Message
    // Cast to 'any' to bypass strict type checking on arguments
    await (openai.beta.threads.messages as any).create(String(thread.id), {
      role: "user",
      content: message
    });

    // 3. Run the Assistant (Classic Method)
    // Cast to 'any' to force it through
    const run = await (openai.beta.threads.runs as any).create(String(thread.id), {
      assistant_id: ASSISTANT_ID,
    });

    // 4. Poll for Completion (Classic Loop)
    // We cast to 'any' so TypeScript doesn't care if the arguments match the interface
    let runStatus = await (openai.beta.threads.runs as any).retrieve(
        String(thread.id), 
        String(run.id)
    );

    // Loop until finished
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
          return NextResponse.json({ response: "I encountered an error processing that request." });
      }
      // Wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      runStatus = await (openai.beta.threads.runs as any).retrieve(
          String(thread.id), 
          String(run.id)
      );
    }

    // 5. Get the Final Response
    const messages = await (openai.beta.threads.messages as any).list(String(thread.id));
    const lastMessage = messages.data[0];
    
    let textResponse = "I'm having trouble retrieving the answer.";
    
    // Safety check for content type
    if (lastMessage?.content?.[0]?.type === 'text') {
        textResponse = lastMessage.content[0].text.value;
        
        // --- SAFE REGEX CLEANUP ---
        const citationRegex = new RegExp('【.*?】', 'g');
        const sourceRegex = new RegExp('\\', 'g');
        const citeRegex = new RegExp('\\', 'g');

        textResponse = textResponse.replace(citationRegex, '');
        textResponse = textResponse.replace(sourceRegex, '');
        textResponse = textResponse.replace(citeRegex, '');
    }

    return NextResponse.json({ 
        response: textResponse,
        threadId: thread.id 
    });

  } catch (error) {
    console.error("OpenAI Assistant Error:", error);
    return NextResponse.json({ response: "System offline. Deep search failed." }, { status: 500 });
  }
}