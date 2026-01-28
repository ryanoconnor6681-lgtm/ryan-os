import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// --- HARDCODED ID ---
// I grabbed this from your error log. It is correct.
const ASSISTANT_ID = 'asst_xwVWPu6dfrdVFozzdCm5104j'; 

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    // 1. DIAGNOSTIC: Check if API Key exists
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("CRITICAL: OPENAI_API_KEY is missing from env.");
    }

    // 2. Create or Retrieve a Thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      try {
        // Cast to 'any' to bypass TS check
        thread = await (openai as any).beta.threads.create();
      } catch (e: any) {
        throw new Error(`Failed to create thread: ${e.message}`);
      }
    }

    // 3. Add the User's Message
    try {
        // Cast to 'any'
        await (openai as any).beta.threads.messages.create(String(thread.id), {
        role: "user",
        content: message
        });
    } catch (e: any) {
        throw new Error(`Failed to send message: ${e.message}`);
    }

    // 4. Run the Assistant
    let run;
    try {
        // Cast to 'any'
        run = await (openai as any).beta.threads.runs.create(String(thread.id), {
        assistant_id: ASSISTANT_ID,
        });
    } catch (e: any) {
        throw new Error(`Failed to start run. Error: ${e.message}`);
    }

    // 5. Poll for Completion (Manual Loop)
    // Cast to 'any'
    let runStatus = await (openai.beta.threads.runs as any).retrieve(
        String(thread.id), 
        String(run.id)
    );

    // Loop until finished
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
          throw new Error(`Run failed with status: ${runStatus.status}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cast to 'any'
      runStatus = await (openai.beta.threads.runs as any).retrieve(
          String(thread.id), 
          String(run.id)
      );
    }

    // 6. Get the Final Response
    // Cast to 'any'
    const messages = await (openai.beta.threads.messages as any).list(String(thread.id));
    const lastMessage = messages.data[0];
    
    let textResponse = "I'm having trouble retrieving the answer.";
    
    if (lastMessage?.content?.[0]?.type === 'text') {
        textResponse = lastMessage.content[0].text.value;
        
        // Clean citations
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

  } catch (error: any) {
    console.error("RyanOS Error Log:", error);
    return NextResponse.json({ 
        response: `[SYSTEM ERROR] ${error.message || "Unknown error occurred."}` 
    });
  }
}