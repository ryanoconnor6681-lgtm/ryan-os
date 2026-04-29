"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ───────────────────────────────────────────────────────────────────────────
// Curiosity Catalog cards — 14 entries adapted from the RedPeg Catalog
// (red-peg-curiosity-catalog.vercel.app). Lightly de-RedPegged so they read
// for any senior operator. Embedded inline on the door pages as free proof
// points: "still interested? more ↓"
// ───────────────────────────────────────────────────────────────────────────

export type CatalogCard = {
  id: string;
  icon: string;
  type: string;
  audience: string;
  title: string;
  hook: string;
  body: string[];
  takeaway: string;
  prompts: string[];
};

export const CATALOG: Record<string, CatalogCard> = {
  'we-did-this-before': {
    id: 'we-did-this-before',
    icon: '🌐',
    type: 'History',
    audience: 'All ages',
    title: 'We Did This Before',
    hook: "The internet didn't kill agencies. It created them. Here's what actually happened.",
    body: [
      "In 1994, most ad agencies thought the web was a fad. By 2000, every one of them had a “digital department.” The ones who got there early didn’t just survive — they led. The ones who waited mostly didn’t make it in their original form.",
      "The pattern is identical to what’s happening now. A new capability appears. Most people dismiss it. A few lean in early. A few years later, the early movers are running the show and everyone else is catching up — or gone.",
      "If you were around in the mid-90s, you remember when “building a website” felt exotic. Now it’s table stakes. AI is at the same inflection point — and the window to be early is still open, but not for long.",
    ],
    takeaway: "The question isn’t whether AI will change your job. It’s whether you’ll be the one who shaped how.",
    prompts: [
      "Explain how the internet changed the marketing and advertising industry in the 1990s and 2000s, and draw parallels to how AI might change it now.",
      "What kinds of jobs existed before the internet that don’t exist anymore — and what jobs did the internet create that didn’t exist before?",
    ],
  },
  'okay-to-be-skeptical': {
    id: 'okay-to-be-skeptical',
    icon: '\u{1F62C}',
    type: 'Fear → Confidence',
    audience: 'Everyone',
    title: "It's Okay to Be Skeptical",
    hook: "AI hype is real. So is AI utility. Here's how to tell the difference — without the sales pitch.",
    body: [
      "Skepticism is healthy. There’s a lot of noise around AI — overblown promises, bad demos, tools that don’t work as advertised. You’re right to question it.",
      "The best way through skepticism isn’t to be convinced by an argument. It’s to use it for something small and real. Not a grand experiment — just: paste an email you’re dreading and see what comes back. That’s it.",
      "Most people who describe themselves as skeptics about AI have never actually tried it on a real task. The ones who have — even one time, on something real — almost always come back. Not because it’s magic. Because it’s useful.",
    ],
    takeaway: "You don’t have to believe in AI. You just have to try it once on something that actually costs you time.",
    prompts: [
      "Here’s an email I’ve been putting off writing. Draft it for me: [paste your situation]",
      "I’m skeptical about AI. What’s the most useful thing you could actually help me with in my day-to-day work if I told you I work in [your role]?",
    ],
  },
  'stories-we-told': {
    id: 'stories-we-told',
    icon: '\u{1F680}',
    type: 'Sci-Fi',
    audience: 'Storytellers',
    title: 'The Stories We Already Told',
    hook: "We've been imagining this moment for 80 years. Some of us just didn't realize we were watching a documentary.",
    body: [
      "HAL 9000. JARVIS. Samantha from Her. The replicants in Blade Runner. Science fiction has been processing our hopes and fears about AI for generations — and now we’re living in the part of the story where the technology actually arrives.",
      "The interesting thing: most sci-fi got the emotional part right and the technical part wrong. AI isn’t a robot overlord. It’s closer to a brilliant, tireless collaborator who knows a little about everything and never gets defensive when you push back.",
      "If you love stories — if you’re drawn to ideas, futures, and “what if” — AI is genuinely one of the most interesting things to explore right now. Not because it’s powerful. Because it’s strange, and new, and nobody fully knows where it goes yet.",
    ],
    takeaway: "The best sci-fi doesn’t predict the future. It prepares us to inhabit it. We’re in that moment now.",
    prompts: [
      "Explain how today’s AI compares to the AI depicted in Her / 2001: A Space Odyssey / Blade Runner. What did they get right? What did they miss?",
      "Write a short scene set 10 years from now where a creative director at a marketing agency is briefing their AI. Make it feel real, not sci-fi.",
    ],
  },
  'what-happens-to-my-job': {
    id: 'what-happens-to-my-job',
    icon: '\u{1F4BC}',
    type: 'Fear → Confidence',
    audience: 'Everyone',
    title: 'What Happens to My Job',
    hook: "The honest answer — not the reassuring one or the scary one. Just what the evidence actually shows.",
    body: [
      "The real pattern isn’t “AI takes jobs.” It’s “AI absorbs tasks.” The jobs that disappear are the ones that are mostly made of repetitive, low-judgment tasks. The jobs that grow are the ones where human taste, relationships, and creative judgment are the core — not the wrapper.",
      "The executional grunt work gets faster and cheaper. The strategic and creative thinking becomes more valuable, not less — because there’s more capacity to pursue it. Your job isn’t disappearing. The low-value parts of it are, which frees up more time for the high-value parts.",
      "The risk isn’t that AI replaces you. It’s that someone who uses AI well outpaces you. That’s a solvable problem — and it’s exactly why you’re reading this.",
    ],
    takeaway: "The people most at risk from AI are the ones who use it least.",
    prompts: [
      "What does the research actually show about which jobs AI is most likely to affect in the next 5 years — and which are most resilient?",
      "I work in [your role]. What parts of my job is AI most likely to change, and what should I focus on developing?",
    ],
  },
  'electricity-moment': {
    id: 'electricity-moment',
    icon: '\u{1F50C}',
    type: 'History',
    audience: 'Skeptics',
    title: 'The Electricity Moment',
    hook: "Every generation gets one technology that rewires everything. This is ours.",
    body: [
      "When electricity became widely available in the late 1800s, most factory owners used it to power the same machines they’d been running with steam. It took 30 years for them to realize electricity didn’t just replace the power source — it allowed them to redesign the entire factory floor.",
      "The factories that thrived weren’t the ones that swapped steam for electric motors and called it done. They were the ones that asked: “Now that we have this, what becomes possible that wasn’t possible before?”",
      "That’s the question for AI. Not “what tasks can it automate?” but “what becomes possible now that wasn’t before?” The answer is enormous — faster ideation, better research, more time for the work that actually matters.",
    ],
    takeaway: "The factories that just swapped steam for electricity didn’t win. The ones that redesigned everything did.",
    prompts: [
      "Explain the historical analogy between how factories adopted electricity and how businesses are adopting AI today.",
      "What’s something a small team could do with AI today that would have been impossible or cost-prohibitive 3 years ago?",
    ],
  },
  'best-idea-in-the-room': {
    id: 'best-idea-in-the-room',
    icon: '✨',
    type: 'Inspiration',
    audience: 'Creatives',
    title: 'The Best Idea in the Room',
    hook: "What if you never had to start from a blank page again?",
    body: [
      "The most paralyzing moment in creative work isn’t execution — it’s the blank page. The moment before anything exists. AI doesn’t replace the creative leap. It obliterates the blank page.",
      "Ask Claude for 10 directions on a brief. They won’t all be good. Some will be obvious. But two or three will spark something — a direction you wouldn’t have found alone, or a combination of ideas that opens a whole new territory. That’s the value. Not the output. The spark.",
      "The best creatives aren’t the ones with the most raw talent. They’re the ones who generate the most ideas — because they know good ideas are a numbers game. AI turns that dial up by an order of magnitude.",
    ],
    takeaway: "You’re still the one with the taste. AI just makes sure you never run out of material to react to.",
    prompts: [
      "Give me 10 completely different creative directions for a campaign about [your current brief]. Push into unexpected territory.",
      "I’m stuck on a concept for [project]. Here’s what I have so far: [paste notes]. What am I not seeing?",
    ],
  },
  'ten-minutes-back': {
    id: 'ten-minutes-back',
    icon: '⚡',
    type: 'Practical',
    audience: 'Doers',
    title: 'Give Me 10 Minutes Back Today',
    hook: "Not a vision. Not a pitch. Just real time savings, starting now.",
    body: [
      "Theory is fine. Results are better. Here are three things you can do in the next hour that will save you real time — no setup, no training, no special access required.",
      "1. The email you’ve been putting off. Paste the situation into Claude. Get a draft back in 10 seconds. Edit. Send. Done.",
      "2. The recap nobody wants to write. Paste your bullet notes from a meeting or event. Ask Claude to turn them into a client-facing recap. 30 seconds.",
      "3. The thing you need to understand fast. New client category? Competitor you’ve never heard of? Ask Claude to brief you in plain language. Faster than Google, and it synthesizes instead of just listing links.",
    ],
    takeaway: "Pick one. Do it today. See what happens. That’s the whole experiment.",
    prompts: [
      "Turn these bullet notes into a professional client recap email: [paste your notes]",
      "Brief me on [client industry or brand] like I have 5 minutes before a meeting and know nothing.",
    ],
  },
  'jobs-that-dont-exist': {
    id: 'jobs-that-dont-exist',
    icon: '\u{1F52D}',
    type: 'Inspiration',
    audience: 'Career thinkers',
    title: "Jobs That Don't Exist Yet",
    hook: "The internet created the social media manager. The UX designer. The SEO strategist. What does AI create?",
    body: [
      "In 1995, “social media manager” wasn’t a job. Neither was “UX researcher,” “growth hacker,” “content strategist,” or “data scientist” in any meaningful volume. The internet didn’t just change existing jobs — it invented entirely new categories of work.",
      "AI is already generating early versions of new roles: AI prompt engineers, AI creative directors who specialize in human-AI collaboration, experiential producers who design AI-integrated live events. In five years, there will be job titles that don’t exist yet that will be standard on org charts.",
      "The people who define those roles will be the ones who are curious about AI now — who are experimenting, learning, and building fluency before it becomes required.",
    ],
    takeaway: "The best career move right now isn’t knowing AI. It’s being the person at your company who shapes how it gets used.",
    prompts: [
      "What new job titles and roles do you predict will exist in marketing in 5–10 years because of AI? Describe what they’d actually do.",
      "I’m a [your role]. How might my role evolve over the next 3 years with AI — and what skills should I be building?",
    ],
  },
  'brilliant-intern': {
    id: 'brilliant-intern',
    icon: '\u{1F9E0}',
    type: 'Practical',
    audience: 'Analogy people',
    title: 'Think of It Like a Brilliant Intern',
    hook: "One who has read everything, never sleeps, and never takes it personally when you say “that’s not quite right.”",
    body: [
      "The best analogy for working with Claude isn’t “using a search engine.” It’s closer to having a brilliant intern who has genuinely read everything — every brief, every strategy doc, every textbook, every piece of journalism published in the last 30 years — and can apply it to your specific situation in real time.",
      "Like a great intern, you still need to direct it. You still need to apply your judgment to what it gives you. You still need to know what good looks like. But you never have to start from scratch, never have to do the low-value grunt work alone, and never have to say “I wish I had more time to think about this.”",
      "And unlike an intern, it’s available at 11pm, never gets offended by feedback, and gets better the more specifically you direct it.",
    ],
    takeaway: "The more you tell it about your work, your clients, and your standards — the more it starts to feel like a real team member.",
    prompts: [
      "I’m going to describe what I do at my company and what I’m working on right now. Then tell me the three most useful ways you could help me this week.",
      "Act as a smart intern who just joined our team. Here’s a brief: [paste brief]. What questions would you ask before getting started?",
    ],
  },
  'new-colleague': {
    id: 'new-colleague',
    icon: '\u{1F393}',
    type: 'Belief',
    audience: 'Everyone',
    title: 'Meet Your New Colleague',
    hook: "Former doctor, lawyer, coder, strategist, creative director. Speaks every language. Available 24/7. You’re already paying for them.",
    body: [
      "Claude scored in the 90th percentile on the Bar Exam. Top marks on the US Medical Licensing Exam. 95th percentile on the GRE. It outperforms most humans on standardized tests across law, medicine, math, coding, and science. This is not a search engine. This is a colleague with credentials most of us will never have.",
      "And it’s sitting in a browser tab you open twice a week to ask one question.",
      "McKinsey research found knowledge workers using AI save 1.5 to 2 hours every day — not because the tool is magical, but because they actually ask it things. Consistently. For everything. That’s a full extra workday every week, compounding.",
      "You have one of the most capable thinking partners ever built available to you. The question is whether you’re using it like a colleague or like a calculator you pull out for specific problems.",
    ],
    takeaway: "You wouldn’t hire a brilliant strategist and only ask them to fix your typos. Stop doing that with Claude.",
    prompts: [
      "I work in [your role]. What are the 5 most valuable ways you could help me this week — be specific to my actual job, not generic AI advice.",
      "What do you actually know about [your industry]? Walk me through it like you’re briefing a new hire.",
    ],
  },
  'no-training-needed': {
    id: 'no-training-needed',
    icon: '\u{1F6AB}',
    type: 'Belief',
    audience: 'Skeptics',
    title: "You Don't Have to Train It",
    hook: "You don’t spend weeks teaching Claude. You just… ask. Right now. With no setup.",
    body: [
      "One of the most common reasons people delay using Claude is the belief that there’s a setup phase — that you need to “train” it before it’s useful, the way you’d onboard a new employee. There isn’t. There’s no training. There’s just asking.",
      "Claude already knows your domain. Not because you taught it — because it was trained on more relevant material than any person could read in a lifetime. You bring the context of your specific situation. It brings the capability.",
      "The “training” people think they need is actually just good prompting — and good prompting is just being specific. Tell it what you’re working on. Tell it who it’s for. Tell it what format you want. That’s the whole setup. You can learn it in one conversation.",
    ],
    takeaway: "The setup is describing your task. That’s the entire setup. You already know how to do it.",
    prompts: [
      "I’ve been putting off [task] because I thought I’d need to set AI up first. Here it is: [describe]. How should we approach this right now?",
    ],
  },
  'computer-under-paperwork': {
    id: 'computer-under-paperwork',
    icon: '\u{1F5A5}️',
    type: 'Belief',
    audience: 'Everyone',
    title: 'The Computer Under the Paperwork',
    hook: "You have a computer. It’s sitting under the pile of work you’re doing by hand.",
    body: [
      "Imagine someone handed you a laptop in 1985 and you said “I’ll learn to use this in my spare time” — then kept doing your work by hand while the computer sat in the corner. That’s what treating AI as a side skill looks like right now.",
      "AI is not a software tool you add to your stack. It’s the medium your work should live in. 90% of what you do every day — writing, thinking, researching, planning, communicating — Claude can do faster alongside you. Not instead of you. Alongside you.",
      "The people integrating this now are not smarter or more technical. They just started earlier. The gap compounds. A person saving 90 minutes a day has an extra 7.5 hours a week — nearly a full extra workday — compared to someone who doesn’t.",
    ],
    takeaway: "This is not a tool you learn on the side. It’s the thing everything else runs on now.",
    prompts: [
      "Walk me through what a full workday could look like if I actually used you for everything — from first email to last deliverable. My role is [your role].",
      "What percentage of a typical [your role]’s workday involves tasks you could meaningfully help with? Be honest and specific.",
    ],
  },
  'try-it-right-now': {
    id: 'try-it-right-now',
    icon: '\u{1F3AF}',
    type: 'Practical',
    audience: 'Right now',
    title: 'Stop Reading. Try It Right Now.',
    hook: "Pick the task from your actual to-do list. Paste it in. See what happens. That’s the entire experiment.",
    body: [
      "No more reading about AI. No more demos. Open Claude in a new tab. Pick one of these — the one that costs you the most time today — and just go.",
      "The proposal you’re dreading. Paste the brief. Ask Claude to draft the executive summary. 45 seconds.",
      "The recap you’ve been putting off. Paste your bullet notes. Ask for a client-ready version in your tone. 30 seconds.",
      "The client you know nothing about. Type their name and category. Ask Claude to brief you like you have 10 minutes before a call. Better than Google.",
      "The email thread that’s been sitting there. Paste the whole thread. Ask what the three most important action items are and draft the reply. Under a minute.",
      "The moment you get a result that surprises you — that’s the switch. Everything changes after that moment.",
    ],
    takeaway: "You are one task away from never working the old way again.",
    prompts: [
      "Here’s a brief I need to respond to: [paste]. Draft a strong executive summary and a section on relevant experience.",
      "Here’s an email thread that needs a response: [paste]. Tell me the 3 key action items and draft a reply I can edit and send.",
    ],
  },
  'believe-but-dont-think': {
    id: 'believe-but-dont-think',
    icon: '\u{1F4AD}',
    type: 'Belief',
    audience: 'Almost there',
    title: '"I Believe It. I Just Don’t Think About It."',
    hook: "Converted but not integrated. This is the last gap — and it’s a habit problem, not a knowledge problem.",
    body: [
      "Some people have seen the demos. They believe Claude is capable. They’ve even used it and gotten great results. But it’s still not the first place they go. When a task lands on their desk, the instinct is still to open a blank doc and start — not to open Claude first.",
      "That gap isn’t about knowledge. It’s about habit formation. The tool isn’t wired into the reflex yet. And habits don’t form from information — they form from repetition plus immediate reward.",
      "The fix is simple but requires a commitment: for the next two weeks, Claude is your first move on every task. Not sometimes. Every time. Even the small ones. Especially the small ones. The reflex builds through repetition, not resolution.",
      "Within two weeks, opening Claude will feel like opening email. You won’t remember deciding to use it. You’ll just do it — because the output is better and you’ve proved that to yourself enough times that your brain stopped arguing.",
    ],
    takeaway: "The goal isn’t to remember to use AI. It’s to use it enough times that forgetting becomes impossible.",
    prompts: [
      "I’ve used you before and gotten good results, but I keep forgetting to start with you. Help me build a simple habit. What’s a realistic ‘Claude first’ trigger I could use every morning?",
      "Design me a 10-day challenge where each day I use Claude for one specific task in my role as [your role].",
    ],
  },
};

// Map of door → ordered card IDs
export const DOOR_CARDS: Record<string, string[]> = {
  inspiration: [
    'we-did-this-before',
    'electricity-moment',
    'jobs-that-dont-exist',
    'stories-we-told',
    'what-happens-to-my-job',
  ],
  filter: [
    'okay-to-be-skeptical',
  ],
  mindset: [
    'best-idea-in-the-room',
    'computer-under-paperwork',
    'new-colleague',
    'brilliant-intern',
    'no-training-needed',
    'believe-but-dont-think',
  ],
  solutions: [
    'ten-minutes-back',
    'try-it-right-now',
  ],
};

// ─── Single card UI (expandable) ───────────────────────────────────────────
const Card = ({ card, dark }: { card: CatalogCard; dark?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.article
      className={`curio-cat-card ${dark ? 'is-dark' : ''} ${expanded ? 'is-expanded' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="curio-cat-top">
        <div className="curio-cat-icon" aria-hidden>{card.icon}</div>
        <div className="curio-cat-tags">
          <span className="curio-cat-tag curio-cat-tag-type">{card.type}</span>
          <span className="curio-cat-tag curio-cat-tag-aud">{card.audience}</span>
        </div>
      </div>
      <h3 className="curio-cat-title">{card.title}</h3>
      <p className="curio-cat-hook">{card.hook}</p>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="curio-cat-body"
        >
          {card.body.map((p, i) => <p key={i} className="curio-cat-p">{p}</p>)}
          <div className="curio-cat-takeaway">&ldquo;{card.takeaway}&rdquo;</div>
          <div className="curio-cat-prompts-label">Try these in Claude &rarr;</div>
          {card.prompts.map((p, i) => (
            <div key={i} className="curio-cat-prompt">{p}</div>
          ))}
        </motion.div>
      )}
      <button className="curio-cat-toggle" onClick={() => setExpanded((v) => !v)}>
        <span className={`curio-cat-arrow ${expanded ? 'is-up' : ''}`}>&darr;</span>
        <span>{expanded ? 'Collapse' : 'Read more'}</span>
      </button>
    </motion.article>
  );
};

// ─── Catalog block — reveals on click ─────────────────────────────────────
export const CatalogCards = ({
  door,
  persona,
  dark = false,
}: {
  door: keyof typeof DOOR_CARDS;
  persona: 'self' | 'team';
  dark?: boolean;
}) => {
  const ids = DOOR_CARDS[door] || [];
  const cards = ids.map((id) => CATALOG[id]).filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <section className={`curio-section curio-catalog ${dark ? 'is-dark' : ''}`}>
      <div className="curio-eyebrow curio-eyebrow-amber">ways in</div>
      <h2 className={`curio-h2 ${dark ? 'curio-h2-dark' : ''}`}>
        {persona === 'team'
          ? <>Doorways inside the door &mdash; <em>map these to your team.</em></>
          : <>Doorways inside the door &mdash; <em>open what fits.</em></>}
      </h2>
      <p className={`curio-prose ${dark ? 'curio-prose-dark' : ''}`}>
        {persona === 'team'
          ? <>Short reads your team has walked through before. Pick the ones that match the people you&rsquo;re trying to move &mdash; <strong>send them this page</strong>, not a forwarded launch summary.</>
          : <>Short reads into bigger ideas. Open whichever lands. Each one ends with a prompt you can paste into Claude and try right now &mdash; before you&rsquo;ve decided anything about Curio at all.</>}
      </p>

      <div className="curio-cat-grid">
        {cards.map((c) => <Card key={c.id} card={c} dark={dark} />)}
      </div>
    </section>
  );
};
