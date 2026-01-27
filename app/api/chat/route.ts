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
        return NextResponse.json({ response: "System Error: Assistant ID not found." }, { status: 500 });
    }

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

    // 3. THE MAGIC FIX: Create and Poll in one step
    // This replaces the old "while loop" that was breaking
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // 4. Handle the Result
    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        const lastMessage = messages.data[0];
        
        let textResponse = "I'm having trouble retrieving the answer.";
        
        if (lastMessage.content[0].type === 'text') {
            textResponse = lastMessage.content[0].text.value;
            
            // Safe cleanup of citations
            const citationRegex = new RegExp('【.*?】', 'g');
            const sourceRegex = new RegExp('\\', 'g');
            
            textResponse = textResponse.replace(citationRegex, '');
            textResponse = textResponse.replace(sourceRegex, '');
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