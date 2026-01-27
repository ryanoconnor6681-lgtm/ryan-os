import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// ⚠️ PASTE YOUR KEYS HERE
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
const MY_ASSISTANT_ID = "asst_lDBeuMQlca4yjadkBue3xVcW";

// Keep SDK for creation (since that part works)
const openai = new OpenAI({ apiKey: MY_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    // 1. Thread Setup
    let FINAL_THREAD_ID = "";
    if (threadId) {
      FINAL_THREAD_ID = threadId;
      console.log("--> Resuming Thread:", FINAL_THREAD_ID);
    } else {
      const thread = await openai.beta.threads.create();
      FINAL_THREAD_ID = thread.id;
      console.log("--> Created New Thread:", FINAL_THREAD_ID);
    }

    // 2. Add Message
    await openai.beta.threads.messages.create(FINAL_THREAD_ID, {
      role: "user",
      content: message,
    });

    // 3. Start Run
    const run = await openai.beta.threads.runs.create(FINAL_THREAD_ID, {
      assistant_id: MY_ASSISTANT_ID,
    });
    const FINAL_RUN_ID = run.id;
    console.log("--> Run Started:", FINAL_RUN_ID);

    // 4. POLL FOR COMPLETION (RAW FETCH MODE)
    // We bypass the SDK here to avoid the 'undefined' bug
    let status = "queued";
    
    while (status !== "completed") {
      // Manual API Call
      const response = await fetch(
        `https://api.openai.com/v1/threads/${FINAL_THREAD_ID}/runs/${FINAL_RUN_ID}`,
        {
          headers: {
            "Authorization": `Bearer ${MY_API_KEY}`,
            "OpenAI-Beta": "assistants=v2", // Required for Assistants API
          },
          cache: "no-store" // Prevent Next.js from caching this request
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Raw API Error: ${JSON.stringify(err)}`);
      }

      const runData = await response.json();
      status = runData.status;

      if (status === "failed" || status === "cancelled") {
        return NextResponse.json({ error: "AI Failed: " + runData.last_error?.message }, { status: 500 });
      }

      if (status !== "completed") {
        // Wait 1 second before checking again
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // 5. Get Messages (SDK is usually fine here, but let's be safe)
    const messages = await openai.beta.threads.messages.list(FINAL_THREAD_ID);
    const lastMessage = messages.data[0];
    
    let text = "";
    if (lastMessage.content[0].type === 'text') {
        text = lastMessage.content[0].text.value;
    }

    return NextResponse.json({ response: text, threadId: FINAL_THREAD_ID });

  } catch (error: any) {
    console.error("CRASH REPORT:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}