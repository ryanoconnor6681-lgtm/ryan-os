// FORCE NODE.JS RUNTIME: v102.0
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; 

const openai = new OpenAI({
  apiKey: process.env.RYAN_API_KEY || '',
});

const ASSISTANT_ID = 'asst_xwVWPu6dfrdVFozzdCm5104j'; 

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    // 1. Check API Key
    if (!process.env.RYAN_API_KEY) {
        throw new Error("CRITICAL: RYAN_API_KEY is missing from env.");
    }

    // 2. Create or Retrieve Thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      try {
        thread = await (openai as any).beta.threads.create();
      } catch (e: any) {
        throw new Error(`Failed to create thread: ${e.message}`);
      }
    }

    const tId = String(thread.id); // Explicit String Cast

    // 3. Add Message
    await (openai as any).beta.threads.messages.create(tId, {
      role: "user",
      content: message
    });

    // 4. Start Run
    const run = await (openai as any).beta.threads.runs.create(tId, {
      assistant_id: ASSISTANT_ID,
    });
    
    const rId = String(run.id); // Explicit String Cast

    // 5. Poll for Completion (USING LIST INSTEAD OF RETRIEVE)
    // We fetch the list of runs to check the status of the latest one.
    // This bypasses the argument swapping bug in 'retrieve'.
    let runStatus = "queued";
    
    while (runStatus !== 'completed') {
        // Fetch all runs for this thread
        const runs = await (openai.beta.threads.runs as any).list(tId);
        
        // Find our specific run
        const latestRun = runs.data.find((r: any) => r.id === rId);
        
        if (!latestRun) {
             throw new Error("Lost track of the run in the queue.");
        }

        runStatus = latestRun.status;

        if (runStatus === 'failed' || runStatus === 'cancelled') {
            throw new Error(`Run failed with status: ${runStatus}`);
        }
        
        if (runStatus !== 'completed') {
            // Wait 1 second before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // 6. Get Response
    const messages = await (openai.beta.threads.messages as any).list(tId);
    const lastMessage = messages.data[0];
    
    let textResponse = "I'm having trouble retrieving the answer.";
    
    if (lastMessage?.content?.[0]?.type === 'text') {
        textResponse = lastMessage.content[0].text.value;
        textResponse = textResponse.replace(/【.*?】/g, '');
    }

    return NextResponse.json({ 
        response: textResponse,
        threadId: tId 
    });

  } catch (error: any) {
    console.error("RyanOS Error Log:", error);
    return NextResponse.json({ 
        response: `[SYSTEM ERROR] ${error.message || "Unknown error occurred."}` 
    });
  }
}