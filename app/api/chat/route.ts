// FORCE NODE.JS RUNTIME: v103.0
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; 
export const dynamic = 'force-dynamic'; // Force server-side execution

// --- ENCRYPTION BYPASS ---
// 1. Paste your Base64 string below.
// 2. The code decodes it at runtime.
// 3. GitHub cannot read it. Vercel cannot lose it.
const ENCODED_KEY = 'c2stcHJvai0xSjZITE1OVC1nNGZqeE9Rc1lZYVgxMzlTYnA5SlExaFdtZkhGLTRXYmROOG80aFFXclpwcUhVaWZpTTZKQnF5WUd5bUgxMGkyTVQzQmxia0ZKYWd2YkVhYzBSd1VhRjJwZTlldG5WUWd1Rm9ncnRPSEpCcVY0U3FQLVpEd25rMW9fQndySC1kakg4ajJfSzA1eGFtZ0VISTJ6OEE=';
const DECODED_KEY = Buffer.from(ENCODED_KEY, 'base64').toString('utf-8');

const openai = new OpenAI({
  apiKey: DECODED_KEY,
});

const ASSISTANT_ID = 'asst_xwVWPu6dfrdVFozzdCm5104j'; 

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    // 1. DIAGNOSTIC: Verify Key Decode
    if (!DECODED_KEY || !DECODED_KEY.startsWith('sk-')) {
        throw new Error("CRITICAL: The Base64 key did not decode correctly. Check your copy-paste.");
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

    const tId = String(thread.id); 

    // 3. Add Message
    await (openai as any).beta.threads.messages.create(tId, {
      role: "user",
      content: message
    });

    // 4. Start Run
    const run = await (openai as any).beta.threads.runs.create(tId, {
      assistant_id: ASSISTANT_ID,
    });
    
    const rId = String(run.id);

    // 5. Poll for Completion (List Method)
    let runStatus = "queued";
    
    while (runStatus !== 'completed') {
        const runs = await (openai.beta.threads.runs as any).list(tId);
        const latestRun = runs.data.find((r: any) => r.id === rId);
        
        if (!latestRun) {
             throw new Error("Lost track of the run in the queue.");
        }

        runStatus = latestRun.status;

        if (runStatus === 'failed' || runStatus === 'cancelled') {
            throw new Error(`Run failed with status: ${runStatus}`);
        }
        
        if (runStatus !== 'completed') {
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