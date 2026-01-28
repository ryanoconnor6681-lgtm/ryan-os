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
    // @ts-ignore - Suppress TS warning for classic method
    await openai.beta.threads.messages.create(String(thread.id), {
      role: "user",
      content: message
    });

    // 3. Run the Assistant (Classic Method)
    // @ts-ignore - Suppress TS warning for classic method
    const run = await openai.beta.threads.runs.create(String(thread.id), {
      assistant_id: ASSISTANT_ID,
    });

    // 4. Poll for Completion
    // @ts-ignore - Suppress deprecation warning
    let runStatus = await openai.beta.threads.runs.retrieve(
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
      
      // @ts-ignore - Suppress deprecation warning
      runStatus = await openai.beta.threads.runs.retrieve(
          String(thread.id), 
          String(run.id)
      );
    }

    // 5. Get the Final Response
    // @ts-ignore - Suppress warning
    const messages = await openai.beta.threads.messages.list(String(thread.id));
    const lastMessage = messages.data[0];
    
    let textResponse = "I'm having trouble retrieving the answer.";
    
    // @ts-ignore
    if (lastMessage.content[0].type === 'text') {
        // @ts-ignore
        textResponse = lastMessage.content[0].text.value;
        
        // Clean citations
        textResponse = textResponse
            .replace(/【.*?】/g, '')
            .replace(/\/g, '')
            .replace(/\/g, '');
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