import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Keep this secure!
});

// HARDCODED BYPASS: We are putting the ID directly here.
const ASSISTANT_ID = 'asst_lDBeuMQlca4yjadkBue3xVcW'; 

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    // Debug Log to prove it's loaded
    console.log("--- RyanOS Hardline Debug ---");
    console.log("Assistant ID Target:", ASSISTANT_ID);

    // 1. Create or Retrieve a Thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      thread = await openai.beta.threads.create();
    }

    // 2. Add the User's Message
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    // 3. Create and Poll
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // 4. Handle Result
    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        const lastMessage = messages.data[0];
        
        let textResponse = "I'm having trouble retrieving the answer.";
        
        if (lastMessage.content[0].type === 'text') {
            textResponse = lastMessage.content[0].text.value;
            
            // Safe cleanup
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
    } else {
        return NextResponse.json({ response: "RyanOS is thinking too hard. Try again." });
    }

  } catch (error) {
    console.error("OpenAI Assistant Error:", error);
    return NextResponse.json({ response: "System offline. Deep search failed." }, { status: 500 });
  }
}