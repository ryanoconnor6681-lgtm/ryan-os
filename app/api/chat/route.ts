import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || '';

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    if (!ASSISTANT_ID) {
        return NextResponse.json({ response: "System Error: Assistant ID not found in environment." }, { status: 500 });
    }

    // 1. Create or Retrieve a Thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      thread = await openai.beta.threads.create();
    }

    // 2. Add the User's Message to the Thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    // 3. Run the Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // 4. Poll for Completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
          return NextResponse.json({ response: "I encountered an error processing that request." });
      }
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // 5. Get the Final Response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    
    let textResponse = "I'm having trouble retrieving the answer.";
    
    if (lastMessage.content[0].type === 'text') {
        textResponse = lastMessage.content[0].text.value;
        
        // --- CLEANER: REMOVE CITATIONS & SOURCE TAGS (SAFE MODE) ---
        // Using RegExp constructor to avoid build errors with slashes
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