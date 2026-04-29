"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, ArrowUpRight, ArrowRight, Sparkles, Zap, Box, FileText, Send, ChevronLeft, Layers, Cpu, Globe, Anchor, Terminal, ExternalLink, Download, Info, Plus, Filter } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- VISUAL ASSETS ---
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E`;

const topRowVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 50, damping: 15, delay: 1.2 } }
};

const identityRowVariants: Variants = {
  hidden: { y: -200, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 120, damping: 12, mass: 1.5, delay: 0.5 } }
};

// --- DISCIPLINES: rewritten in a single consistent voice, each closing with a proof point ---
const focusAreas = [
  {
    id: 'innovation',
    eyebrow: 'DISCIPLINE 01',
    title: 'AI & EMERGING TECH',
    subtitle: 'Co-Creation & Scale',
    icon: <Cpu size={24} className="text-white" />,
    img: '/images/emerging_tech.png',
    desc: 'I build AI systems organizations actually adopt\u2014custom skills, onboarding programs, agentic workflows. Not demos. Operational tools that move teams from curiosity to daily use.',
    prompt: "I want to talk about Innovation. How are you using AI to change agency workflows? Keep it brief."
  },
  {
    id: 'experience',
    eyebrow: 'DISCIPLINE 02',
    title: 'IMMERSIVE EXPERIENCE',
    subtitle: 'Space, Screen, & Story',
    icon: <Layers size={24} className="text-white" />,
    img: '/images/Immersive_experience.png',
    desc: 'I design brand systems that live across space, screen, and story. Nike executive summits. Super Bowl builds. Meta arena suites. Strategy translated into environments people walk through.',
    prompt: "I want to talk about Experience. How do you lead large-scale physical builds and teams? Keep it brief."
  },
  {
    id: 'future',
    eyebrow: 'DISCIPLINE 03',
    title: 'CREATIVE LEADERSHIP',
    subtitle: 'Clarity & Alignment',
    icon: <Globe size={24} className="text-white" />,
    img: '/images/Creative_leadership.png',
    desc: 'I lead cross-disciplinary teams with clarity and creative conviction. Trained as an architect, published through MIT Press, teaching at the graduate level\u2014the thinking runs through everything I direct.',
    prompt: "I want to talk about Leadership. What is your philosophy on directing cross-disciplinary teams?"
  }
];

const generateImages = (projectId: string, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/images/${projectId}/detail_${num}.jpg`;
  });
};

// --- DATA SOURCE ---
// Top 9 reordered to alternate AI and experiential:
// curio, nike, onboarding, meta, costsavings, faraday, giftscript, thought, skycar
const allProjects = [
  {
    id: 'curio',
    tags: ['innovation', 'future', 'ai', 'leadership', 'strategy'],
    type: 'case_study',
    title: 'Curio Studio',
    client: 'STUDIO',
    role: 'Founder / Lead Researcher',
    date: 'Active',
    category: 'Future',
    img: '/images/curio/hero_collab.png',
    images: [],
    groups: [
      {
        name: 'Lantern & Fox',
        size: 'large',
        link: 'https://lanternandfox.com',
        images: ['/images/curio/Lantern1.png', '/images/curio/Lantern2.png', '/images/curio/Lantern3.png', '/images/curio/Lantern4.png'],
      },
      {
        name: "The Ladder That Isn't",
        size: 'large',
        link: 'https://ladder-mu.vercel.app/',
        images: ['/images/curio/ladder1.png', '/images/curio/ladder2.png', '/images/curio/ladder3.png', '/images/curio/ladder4.png'],
      },
      {
        name: 'RedPeg Brand Bible',
        size: 'large',
        images: ['/images/curio/brand1.png', '/images/curio/brand2.png', '/images/curio/brand3.png', '/images/curio/brand4.png'],
      },
      {
        name: 'Style Sync (Trender)',
        size: 'small',
        link: 'https://style-sync-eight.vercel.app/dashboard',
        images: ['/images/curio/trender1.png', '/images/curio/trender2.png'],
      },
      {
        name: 'Career Manager',
        size: 'small',
        images: ['/images/curio/career1.png', '/images/curio/career2.png'],
      },
      {
        name: 'RedPeg Creative Pricing',
        size: 'small',
        images: ['/images/curio/pricing1.png', '/images/curio/pricing2.png'],
      },
      {
        name: 'Curiosity Catalog',
        size: 'small',
        link: 'https://red-peg-curiosity-catalog.vercel.app/',
        images: ['/images/curio/curiosity1.png', '/images/curio/curiosity2.png'],
      },
    ],
    stats: ['Speculative Design', 'AI R&D', 'Vibe Coding'],
    link: 'https://ladder-mu.vercel.app/',
    desc: 'A studio for senior operators catching up on AI without the slop.',
    fullDesc: 'Curio is the studio behind a stack of AI-native artifacts \u2014 The Ladder That Isn\u2019t, the RedPeg Brand Bible, Style Sync, Lantern & Fox, and a body of essays on what AI actually changes for senior operators.',
    context: 'The studio\u2019s first product is The Curio Primer \u2014 a bespoke onboarding artifact for ChatGPT-fluent executives moving to Claude. Built as a navigable HTML primer + a starter Brain vault + 2\u20133 custom Claude skills tuned to your work. Two tiers: self-serve ($249) or done-for-you ($2,500).',
    subProjects: [
      {
        name: 'Lantern & Fox',
        link: 'https://lanternandfox.com',
        desc: 'An AI-native D2C heirloom brand for screen-conscious parents. Storybooks, kits, and a story system co-created with parents and kids.',
      },
      {
        name: "The Ladder That Isn't",
        link: 'https://ladder-mu.vercel.app/',
        desc: 'An editorial dashboard on American wealth. Six tabs of scaled visualizations, sims, and policy framing. Cited by working journalists.',
      },
      {
        name: 'RedPeg Brand Bible',
        desc: 'A 24-page navigable HTML brand system. The Actualization Thesis, three lanes (Live Event, B2E, Music), nine commitments.',
      },
      {
        name: 'Style Sync (Trender)',
        link: 'https://style-sync-eight.vercel.app/dashboard',
        desc: 'An AI moodboard tool for agency creative work. 60-second moodboard generation locked to a client \u2014 replaces hours of Pinterest-pulling.',
      },
      {
        name: 'Career Manager',
        desc: 'A personal OS for non-linear job search. Tracks applications and builds tailored resumes from a master knowledge base.',
      },
      {
        name: 'RedPeg Creative Pricing',
        desc: 'An internal scoping calculator. Three program tiers, 57 tasks across 12 categories, live hour/cost math. Built to close a real margin leak.',
      },
      {
        name: 'Curiosity Catalog',
        link: 'https://red-peg-curiosity-catalog.vercel.app/',
        desc: 'RedPeg\u2019s AI onboarding system. Custom Claude skill + interactive launchpad + PDF playbook that gets a non-technical team building on day one.',
      },
      {
        name: 'The Curio Primer',
        desc: 'The studio\u2019s first commercial product. Bespoke ChatGPT\u2192Claude onboarding for senior operators. Self-serve $249 / done-for-you $2,500.',
        isNew: true,
      },
    ],
  },
  {
    id: 'nike',
    tags: ['experience', 'leadership', 'strategy', 'nike', 'branding'],
    type: 'case_study',
    title: 'Leading Nike',
    client: 'NIKE',
    role: 'VP Creative / Creative Director',
    date: '2023',
    category: 'Experience',
    img: '/images/nike/hero.jpg',
    videos: ['tG6yageDylc', 'A_sVqA4RBH0'],
    images: generateImages('nike', 20),
    stats: ['400+ VPs', '$2M+ Budget', 'Global Summit'],
    desc: 'Aligning 400 VPs on a future vision. 4 days. 1 Strategy.',
    fullDesc: 'We needed to align 400 VPs on a 50-year strategic roadmap. Instead of a conference, we built a "Future-Casting" simulator.',
    context: 'The challenge was high: Nike needed to align 400 VPs on a new future vision without it feeling like just another corporate event. My intervention was to model the revenue logic of the experience itself. The "secret detail" was the sculptural installation called "We Are One" using 400 individual rods. Each VP physically placed their own rod into the structure to complete it\u2014a tangible, silence-inducing metaphor for alignment. This wasn\'t just design; it was a strategic pivot point for the company.',
  },
  {
    id: 'onboarding',
    tags: ['ai', 'innovation', 'leadership', 'strategy'],
    type: 'case_study',
    title: 'AI Onboarding System',
    client: 'REDPEG AI',
    role: 'AI Lead / Architect',
    date: '2025',
    category: 'Innovation',
    img: '/images/onboarding/hero.jpg',
    papers: [
      {
        title: 'Your First Hour with Claude',
        url: '/papers/RedPeg_Claude_Onboarding_Guide.pdf',
        desc: 'The hands-on PDF playbook. Set up Claude, understand the basics, and build something useful before you leave the session.'
      }
    ],
    images: generateImages('onboarding', 6),
    stats: ['Custom Claude Skill', 'Onboarding Website', 'PDF Playbook'],
    link: 'https://red-peg-curiosity-catalog.vercel.app/',
    desc: 'Three-part AI adoption system: custom skill, onboarding site, and playbook.',
    fullDesc: 'I designed and shipped a complete AI onboarding system for RedPeg Marketing\u2014a custom Claude skill, a guided onboarding website, and a PDF playbook called "Your First Hour with Claude" that gets team members building with AI in their first session. Explore the live onboarding site at red-peg-curiosity-catalog.vercel.app.',
    context: 'The challenge was moving a 50-person experiential agency from zero AI adoption to daily usage. I built three interlocking pieces: a custom Claude skill that runs a guided intake conversation\u2014learning who you are, what you do, and what drains your time\u2014then builds something useful on the spot. A standalone onboarding website (red-peg-curiosity-catalog.vercel.app) that serves as an interactive launchpad with role-specific entry points. And a PDF playbook that walks through setup, explains Projects, Skills, and Connectors, and gives role-specific use cases. The system was designed to be replicable across any creative organization. The skill file alone is a distributable .skill package that any Claude user can install.',
  },
  {
    id: 'meta',
    tags: ['innovation', 'digital', 'meta', 'experience', 'branding'],
    type: 'case_study',
    title: 'Meta Arena Suite',
    client: 'META',
    role: 'Design Lead',
    date: '2023',
    category: 'Innovation',
    img: '/images/meta/hero.jpg',
    images: generateImages('meta', 12),
    stats: ['$3M Budget', 'AR/VR Integration', 'Phygital'],
    desc: 'The Metaverse as a layer, not a place. AR hospitality.',
    fullDesc: 'We transformed a suite at Capital One Arena into a "Phygital" hospitality lab. The challenge: selling the Metaverse in a physical hockey arena.',
    context: 'Selling "The Metaverse" in a hockey arena is tough. You can\'t isolate VIPs in headsets. Our solution was "Phygital" hospitality\u2014using AR mirrors and pass-through VR to layer digital content onto the physical game below. The hardest technical hurdle was the lighting: VR tracking cameras fail in dark suites, but VIPs hate bright "hospital" lighting. We engineered a custom ambient rail system that satisfied the computer vision algorithms while maintaining a premium, moody atmosphere.',
  },
  {
    id: 'costsavings',
    tags: ['ai', 'innovation', 'strategy', 'leadership'],
    type: 'case_study',
    title: '$433K Cost Analysis',
    client: 'REDPEG AI',
    role: 'AI Lead / CFO Partner',
    date: '2026',
    category: 'Innovation',
    img: '/images/costsavings/hero.jpg',
    papers: [
      {
        title: 'Redacted Case Study',
        url: '/papers/RedPeg_AI_Cost_Savings_Analysis_Redacted.pdf',
        desc: 'The full AI-driven financial analysis. Names redacted, all numbers real.'
      },
      {
        title: 'Strategic Vision Document',
        url: '/papers/RedPeg_AI_Strategic_Vision.pdf',
        desc: 'The strategic roadmap that came out of the cost analysis. Where the agency goes from here.'
      }
    ],
    images: generateImages('costsavings', 6),
    stats: ['$433K Identified', '48-Hour Sprint', 'NetSuite + Claude'],
    link: 'https://redpeg-test-site.vercel.app/index.html#specs',
    desc: 'AI-driven financial audit and strategic vision that reshaped agency operations.',
    fullDesc: 'Partnered with the CFO to run an AI-driven financial audit using Claude. In a 2-day sprint, we ingested NetSuite data and operational spreadsheets, cross-referenced hours against contracted scope, and identified ~$433,000 in financial waste and lost revenue. The findings didn\u2019t stop at diagnosis\u2014they became the foundation for a new strategic vision for how the agency operates, prices, and allocates resources.',
    context: 'Claude analyzed NetSuite actuals vs. scoped hours for every employee and client engagement YTD 2026. It surfaced three categories of waste: $193K in over-delivery on signed work (hours delivered beyond scope but never billed), $165K in unsigned exposure (hours burned on clients without signed contracts), and $113K in wasted admin capacity. Combined, that\u2019s ~2,887 hours\u2014the equivalent of 1.4 FTEs working full-time for a year. The analysis went beyond a financial audit into a strategic inflection point: it gave leadership the data to restructure how the agency scopes work, qualifies clients, and protects margins. A new strategic vision emerged from the findings, redefining the operating model around specialization, value-based pricing, and diagnostic-first engagement. A traditional consulting engagement covering this scope would take 2-4 weeks and cost $30K-$80K. Claude did it in 48 hours. The interactive analysis site is live at redpeg-test-site.vercel.app. I also built two operational dashboards with Claude: a Morning Briefing that pulls live data from Asana, Slack, and calendars for a VP-level daily standup, and a Utilization Report that visualizes employee billable/non-billable/admin time with drill-down filtering.',
  },
  {
    id: 'faraday',
    tags: ['experience', 'automotive', 'architecture', 'branding'],
    type: 'case_study',
    title: 'Faraday Future',
    client: 'FARADAY',
    role: 'Creative Director',
    date: '2022',
    category: 'Experience',
    img: '/images/faraday/hero.jpg',
    images: generateImages('faraday', 9),
    stats: ['$1M+ Budget', 'Flagship Retail', 'Digital UX'],
    desc: 'A "Living Brand Lab" for the future of mobility.',
    fullDesc: 'We merged digital UX with physical architecture to create a "Living Brand Lab" in Los Angeles.',
    context: 'How do you sell a luxury EV that doesn\'t fully exist yet? You build a simulator. We integrated motion, lighting, and fabrication into a single narrative loop where the architecture itself "breathed" in sync with the car\'s digital interface. It wasn\'t a showroom for parking cars; it was an immersive environment designed to sell the *feeling* of the future.',
  },
  {
    id: 'giftscript',
    tags: ['ai', 'future', 'writing', 'innovation', 'strategy'],
    type: 'case_study',
    title: 'Gift Script',
    client: 'AI + PUBLISHING',
    role: 'Author / AI Architect',
    date: 'Ongoing',
    category: 'Future',
    img: '/images/giftscript/hero.jpg',
    images: [
      '/images/giftscript/post2_01.jpg',
      '/images/giftscript/post2_02.jpg',
      '/images/giftscript/post2_03.jpg',
      '/images/giftscript/post2_04.jpg',
      '/images/giftscript/post2_05.jpg',
      '/images/giftscript/post2_06.jpg',
      '/images/giftscript/detail_01.jpg',
      '/images/giftscript/detail_02.jpg',
      '/images/giftscript/detail_03.jpg',
      '/images/giftscript/detail_04.jpg',
      '/images/giftscript/detail_05.jpg',
      '/images/giftscript/detail_06.jpg',
      '/images/giftscript/detail_07.jpg',
    ],
    stats: ['Novel', 'AI Voice Skill', 'Ocelus.co'],
    link: 'https://ocelus.co',
    desc: 'A novel with an AI-powered marketing engine. Non-traditional publishing meets custom tooling.',
    fullDesc: 'Gift Script is a novel about purpose in the age of intelligent machines\u2014and a live case study in AI-augmented creative distribution. The marketing isn\'t separate from the product; it\'s built with the same AI tools the book is about.',
    context: 'This project goes beyond writing a book. I built a constellation of AI tools around the narrative itself: a custom voice skill for the main character Maya that writes in her tone and cadence, a personalized calendar tool that delivers story-world content on a schedule, and a fictional company website (ocelus.co) that exists as both a plot device and a marketing surface. The thesis: if AI can help write the story, it can also help distribute it in ways traditional publishing never could. Every tool I built is a proof of concept for AI-native content marketing\u2014applied to fiction instead of a brand.',
  },
  {
    id: 'lanternfox',
    tags: ['future', 'innovation', 'branding', 'ai', 'strategy'],
    type: 'case_study',
    title: 'Lantern & Fox',
    client: 'INDEPENDENT',
    role: 'Founder / Creative Director',
    date: 'Ongoing',
    category: 'Future',
    img: '/images/lanternfox/hero.jpg',
    images: [
      '/images/lanternfox/detail_01.jpg',
      '/images/lanternfox/detail_02.jpg',
      '/images/lanternfox/detail_03.jpg',
      '/images/lanternfox/detail_04.jpg',
      '/images/lanternfox/detail_05.jpg',
      '/images/lanternfox/detail_06.jpg',
      '/images/lanternfox/detail_07.jpg',
    ],
    stats: ['Heirloom Kit', 'AI Story Engine', 'D2C Brand'],
    link: 'https://lanternandfox.com',
    desc: 'A heirloom story-kit for kids, paired with an AI engine that writes the next chapter.',
    fullDesc: 'Lantern & Fox is a direct-to-consumer brand I founded around a single idea: family imagination should be tangible. The product is a beautifully made physical kit\u2014tokens, prompts, a lantern\u2014paired with an AI story engine that turns a child\u2019s name, choices, and the night\u2019s prompt into a fresh chapter at bedtime.',
    context: 'The goal is to prove that AI can serve handmade, human rituals instead of replacing them. The kit is the anchor: a wooden lantern, a fox token, and a deck of prompt cards designed to be passed down, not used up. The AI engine sits behind the experience, generating short, illustrated chapters that adapt to the family\u2014never a chatbot, always a story. It\u2019s also a live test of an AI-native consumer brand operating system: I\u2019m running everything from supply chain and email to Instagram templates and analytics through a single Brain-driven workflow. Live at lanternandfox.com.',
  },
  {
    id: 'thought',
    tags: ['future', 'writing', 'ai', 'leadership', 'strategy'],
    type: 'whitepaper',
    title: 'Thinking at the Edges',
    client: 'WRITING',
    role: 'Author',
    date: 'Ongoing',
    category: 'Future',
    img: '/images/thinking/hero.jpg',
    papers: [
      {
        title: 'The Contract You Didn\'t Know You Signed',
        url: '/papers/The_Contract_You_Didnt_Know_You_Signed.pdf',
        desc: 'Why 30 years of software conditioning is the real barrier to AI adoption.'
      },
      {
        title: 'The Employee Is the Audience Nobody Is Building For',
        url: '/papers/The_Employee_Is_The_Audience.pdf',
        desc: 'A LinkedIn essay on B2E \u2014 the empty lane in experiential marketing where the internal audience deserves a builder, not a vendor.'
      },
      {
        title: 'The Ladder That Isn\'t',
        url: 'https://ladder-mu.vercel.app/',
        desc: 'An interactive essay on what happens to career structure when the corporate ladder dissolves.'
      },
      {
        title: 'Frontiers',
        url: '/papers/Frontiers.pdf',
        desc: 'An essay on what\u2019s ahead at the frontier of AI and creative practice.'
      },
      {
        title: 'The New Moore\'s Law',
        url: '/papers/The_New_Moores_Law.pdf',
        desc: 'AI capacity is doubling every 4 months. A breakdown of the math.'
      },
      {
        title: 'AI 2025: Navigating the Transformative Decade',
        url: '/papers/AI_2025_Report.pdf',
        desc: 'A strategic roadmap for the AI transition.'
      },
      {
        title: 'The End of the Blank Page',
        url: '/papers/End_of_the_Blank_Page.pdf',
        desc: 'How AI is reshaping creation & higher-order thinking.'
      },
      {
        title: 'Gift Script (Back Cover)',
        url: '/papers/Gift_Script_Back_Cover.pdf',
        desc: 'A novel about purpose in the age of intelligent machines.'
      }
    ],
    stats: ['Strategy Essay', 'AI Impact', 'Agency Ops'],
    desc: 'Thinking at the Edges of Creative Practice.',
    fullDesc: 'I believe speculative design isn\u2019t just about what\u2019s possible\u2014it\u2019s about what\u2019s preferable. The future is a brief; we get to shape it.',
    context: 'My writing explores the shift from designer as "generator" to designer as "editor." In essays like "The End of the Blank Page," I argue that AI is a co-creator that requires us to ask better questions. "Navigating the Transformative Decade" provides a roadmap for creative agencies to survive the AI transition by moving up the value chain from production to strategy.',
  },
  {
    id: 'skycar',
    tags: ['future', 'architecture', 'mobility', 'strategy'],
    type: 'case_study',
    title: 'Skycar City',
    client: 'MIT PRESS',
    role: 'Author / Editor',
    date: '2008',
    category: 'Future',
    img: '/images/skycar/hero.jpg',
    videos: ['H4NrGEHelz8'],
    images: Array.from({ length: 15 }, (_, i) => {
      const num = i.toString().padStart(2, '0');
      return `/images/skycar/detail_${num}.jpg`;
    }),
    stats: ['MVRDV Collab', 'Published Thesis', 'Vertical Urbanism'],
    desc: 'If cars can fly, the street becomes obsolete.',
    fullDesc: 'A published thesis on Vertical Urbanism co-authored with Winy Maas (MVRDV). We designed a city for 5 million inhabitants rising 800 meters into the air.',
    context: 'This project challenged the "Last Mile" problem by asking: If cars can fly, why do we need streets? We designed a city where traffic lights are replaced by on-board AI navigation and parking happens on the 40th floor. We developed a revolutionary address system based on 3D coordinates (X, Y, Z) rather than street names, allowing the city to grow organically like a coral reef rather than a rigid grid.',
  },
  {
    id: 'intel',
    tags: ['experience', 'technology', 'fabrication', 'architecture'],
    type: 'case_study',
    title: 'Intel Olympics',
    client: 'INTEL',
    role: 'Art Director',
    date: '2018',
    category: 'Experience',
    img: '/images/intel/hero.jpg',
    images: generateImages('intel', 10),
    stats: ['Pyeongchang', 'Global Broadcast', 'Pavilion Build'],
    desc: 'A Pavilion with Purpose. Fire & Ice in Pyeongchang.',
    fullDesc: 'I led a team to transform a modest restaurant in Pyeongchang into a global media amplifier for Intel during the Winter Games.',
    context: 'The goal was to transform a modest restaurant into a global media amplifier. It had to look as good on a broadcast feed as it did in person. The "secret detail" was the interactive "Fire and Ice" wall we built outside. It allowed guests to control digital elements with gestures. It became a viral hit, drawing crowds to interact with the brand even in freezing temperatures.',
  },
  {
    id: 'redpeg',
    tags: ['strategy', 'branding', 'leadership', 'innovation'],
    type: 'case_study',
    title: 'RedPeg Rebrand',
    client: 'REDPEG',
    role: 'VP Creative',
    date: '2026',
    category: 'Innovation',
    img: '/images/redpeg/hero.jpg',
    videos: ['N0lCtCKBILc'],
    images: generateImages('redpeg', 6),
    papers: [
      {
        title: 'RedPeg Brand Bible 2026',
        url: '/papers/RedPeg_Brand_Bible_2026.pdf',
        desc: 'The full internal brand bible. Positioning, three lanes, voice, visual system, and nine operating commitments.'
      }
    ],
    stats: ['Brand Bible 2026', 'Execution Engine Thesis', 'Visual System'],
    desc: 'Where ideas become real. A new brand system built around physical execution as durable advantage.',
    fullDesc: 'I led the 2026 rebrand and authored the RedPeg Brand Bible \u2014 a full internal system covering positioning, narrative, three service lanes, voice, visual identity, and nine operating commitments. The thesis: as AI commoditizes creative strategy, RedPeg\u2019s durable advantage is the physical execution layer between the brief and the real world. \u201CAI thinks it. We build it.\u201D',
    context: 'The brand bible reframes a 30-year-old experiential shop around what AI can\u2019t do. Three named lanes: Live Event Production, Employee Experience (B2E), and Music Partnerships through in-house subsidiary Deep Cuts Entertainment. The visual system is cream-dominant with red as accent and black for weight \u2014 bold, typographic, confident, never decorative. The operating commitments are the harder half: paid diagnostics, no free pitching, $1M minimum engagement floor, transparent money conversations on day one. The bible lives at /papers/RedPeg_Brand_Bible_2026.pdf as a 24-page internal document. Alongside it, I implemented AI-driven workflows across the creative team that increased concept velocity by ~30%, letting a lean 37-person team punch above weight against agencies five times the size.',
  },
  {
    id: 'xgames',
    tags: ['innovation', 'gaming', 'community', 'experience'],
    type: 'case_study',
    title: 'X Games Digital',
    client: 'ESPN',
    role: 'Creative Director',
    date: '2021',
    category: 'Innovation',
    img: '/images/xgames/hero.jpg',
    videos: ['Iu8uBvBQZaI'],
    images: generateImages('xgames', 7),
    stats: ['Virtual World', 'Community', 'Gaming'],
    desc: 'Translating Culture into Code. Virtual environments.',
    fullDesc: 'We built virtual environments and digital storytelling engines that allowed fans to explore the X Games remotely.',
    context: 'This was an experiment in community-driven virtual worlds. We translated the high-energy culture of action sports into code and immersive digital exploration, allowing fans to engage with the X Games remotely in a way that felt authentic to the gaming community.',
  },
  {
    id: 'iqos',
    tags: ['experience', 'branding', 'retail', 'architecture'],
    type: 'case_study',
    title: 'IQOS Retail',
    client: 'ALTRIA',
    role: 'Art Director',
    date: '2019',
    category: 'Experience',
    img: '/images/iqos/hero.jpg',
    images: generateImages('iqos', 10),
    stats: ['Retail Design', 'Customer Journey', 'Physical Build'],
    desc: 'Physical retail environments for a regulated product.',
    fullDesc: 'We designed the physical retail environments for IQOS, focusing on a premium customer journey.',
    context: 'Designing for a regulated product like tobacco requires a different approach. We couldn\'t advertise traditionally, so the architecture became the marketing. We designed high-touch, educational retail environments that functioned less like stores and more like galleries. The "secret detail" was the acoustic dampening\u2014creating a hushed, intimate atmosphere that encouraged 1-on-1 conversation and education.',
  },
  {
    id: 'light',
    tags: ['fabrication', 'architecture', 'innovation', 'design'],
    type: 'case_study',
    title: 'Parametric Light',
    client: 'INDEPENDENT',
    role: 'Designer / Fabricator',
    date: '2018',
    category: 'Innovation',
    img: '/images/light/hero.jpg',
    images: generateImages('light', 8),
    stats: ['Parametric Design', 'Fabrication', 'Industrial Design'],
    desc: 'Coding light. A parametric fabrication study.',
    fullDesc: 'This project used parametric design code (Grasshopper/Rhino) to generate a unique, complex lighting fixture.',
    context: 'This project represents the intersection of code, industrial design, and digital fabrication. I used parametric software (Grasshopper) to generate a complex, undulating form based on the specific light requirements of a coffee shop. The entire structure was laser-cut from flat plywood and assembled without glue or screws, relying entirely on friction-fit joinery derived directly from the code.',
  },
  {
    id: 'usbank',
    tags: ['experience', 'branding', 'fabrication', 'strategy'],
    type: 'case_study',
    title: 'US Bank Pop-Up',
    client: 'US BANK',
    role: 'Creative Lead',
    date: '2019',
    category: 'Experience',
    img: '/images/usbank/hero.jpg',
    videos: ['5lKJdx367b0'],
    images: generateImages('usbank', 8),
    stats: ['Modular Design', 'Fabrication', 'Video Direction'],
    desc: 'A modular, traveling brand system.',
    fullDesc: 'I led the design and system approach for a modular pop-up experience for US Bank.',
    context: 'The challenge was creating a premium brand presence that could travel to parking lots, festivals, and city squares. We designed a modular "kit of parts" that could scale up or down depending on the footprint. I also personally directed the video content displayed inside, ensuring the digital storytelling was perfectly synchronized with the physical environment.',
  },
  {
    id: 'office',
    tags: ['architecture', 'leadership', 'strategy', 'culture'],
    type: 'case_study',
    title: 'GMR HQ Reno',
    client: 'GMR MARKETING',
    role: 'Design Oversight',
    date: '2017',
    category: 'Experience',
    img: '/images/office/hero.jpg',
    images: generateImages('office', 11),
    stats: ['Interior Design', 'Spatial Planning', 'Construction Oversight'],
    desc: 'Renovating the headquarters of a global agency.',
    fullDesc: 'I collaborated with the architect of record to lead the interior design and spatial strategy for GMR\'s headquarters.',
    context: 'This was about shaping culture through space. We needed to update a legacy office to reflect a modern, collaborative agency. I led the strategy to break down silos and create "collision points"\u2014cafes, lounges, and huddle rooms\u2014where unexpected collaboration could happen. I provided high-level oversight during construction to ensure the creative intent was realized.',
  },
  {
    id: 'polly',
    tags: ['experience', 'branding', 'strategy'],
    type: 'case_study',
    title: 'Polly Booth',
    client: 'POLLY',
    role: 'Creative Director',
    date: '2018',
    category: 'Experience',
    img: '/images/polly/hero.jpg',
    images: generateImages('polly', 12),
    stats: ['Tradeshow', 'Experiential', 'Award Winning'],
    desc: 'Disrupting the tradeshow floor.',
    fullDesc: 'Creative direction for an award-winning tradeshow experience. We rejected the standard "booth" format.',
    context: 'How do you stand out on a sterile, plastic tradeshow floor? You go the opposite direction. We built a warm, nostalgic "root beer stand" environment using real wood and vintage props. We even pumped in the scent of vanilla. It became a sensory oasis in a sea of corporate booths, winning "Best in Show" because it felt human, not transactional.',
  },
  {
    id: 'kits',
    tags: ['branding', 'experience', 'strategy'],
    type: 'case_study',
    title: 'Brand Kits',
    client: 'VARIOUS',
    role: 'Creative Lead',
    date: '2020',
    category: 'Innovation',
    img: '/images/kits/hero.jpg',
    videos: ['aDCFfTfLPs4'],
    images: generateImages('kits', 9),
    stats: ['Direct Mail', 'Packaging', 'Okta / Vikings'],
    desc: 'Tactile brand experiences delivered to your door.',
    fullDesc: 'A collection of high-touch direct mail and influencer kits for clients like Okta and the Minnesota Vikings.',
    context: 'In a digital world, physical atoms carry outsized weight. We designed intricate packaging systems that unfolded like origami, revealing the brand story layer by layer. For the Vikings kit, we incorporated actual stadium materials into the box design, putting a piece of the team directly into the fan\'s hands.',
  },
  {
    id: 'lowes',
    tags: ['experience', 'branding', 'retail'],
    type: 'case_study',
    title: 'Lowes @ ACL',
    client: 'LOWES',
    role: 'Creative Director',
    date: '2022',
    category: 'Experience',
    img: '/images/lowes/hero.jpg',
    images: generateImages('lowes', 6),
    stats: ['Festival Activation', 'Brand Strategy', 'Austin City Limits'],
    desc: 'A festival survival hub at Austin City Limits.',
    fullDesc: 'We brought Lowe\'s to Austin City Limits not as a hardware store, but as a festival survival partner.',
    context: 'The goal was to make a big box retailer feel relevant at a cool music festival. We leaned into utility. Instead of just "branding," we provided "service." The space was designed to be a sanctuary from the Texas heat, offering shade, charging stations, and hydration. This created positive brand association through gratitude rather than just exposure.',
  }
];

// --- COMPONENTS ---
const AboutModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-neutral-900/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
    >
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl p-12 relative shadow-2xl border border-white/20">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-black hover:text-white transition-colors"><X size={20} /></button>
        <h2 className="text-4xl font-black uppercase mb-8 tracking-tighter">System Info</h2>
        <div className="prose prose-lg text-neutral-600 font-medium leading-relaxed space-y-6">
          <p>This site is a working proof of concept for what I do.</p>
          <p>In the age of AI, information isn&apos;t searched or browsed&mdash;it&apos;s generated on demand against a specific question. This interface is built that way end to end: an architected system on top of Claude and OpenAI, connected to my actual work, answering in my voice.</p>
          <p>No templates. No static pages. A living interface that thinks with you&mdash;and a live example of how I approach AI-native product design.</p>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-100 text-xs font-mono text-neutral-400 uppercase tracking-widest">Build: RyanOS v106.1 // Powered by Vercel & OpenAI</div>
      </motion.div>
    </motion.div>
  );
};

const FormattedText = ({ text }: { text: string }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (line.trim().startsWith('###')) { return <h3 key={i} className="text-lg font-black uppercase mt-6 mb-2">{parseBold(line.replace(/#/g, ''))}</h3> }
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (<div key={i} className="flex gap-3 ml-2"><span className="text-black font-bold">&bull;</span><span className="leading-relaxed">{parseBold(line.substring(2))}</span></div>);
        }
        if (line.trim().length > 0) { return <p key={i} className="leading-relaxed text-neutral-800">{parseBold(line)}</p>; }
        return null;
      })}
    </div>
  );
};

const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-black text-black">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ProjectModal = ({ project, onClose, initialChatMsg }: { project: any, onClose: () => void, initialChatMsg?: string }) => {
  const [mode, setMode] = useState<'details' | 'chat'>('details');
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (text: string) => {
    if(!text.trim()) return;
    // --- SINGLE TURN LOGIC FOR PROJECT MODAL ---
    const newHistory: { role: 'user'|'ai', content: string }[] = [{ role: 'user', content: text }];
    setChatHistory(newHistory);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, project: project.id }),
      });
      const data = await res.json();
      setChatHistory([...newHistory, { role: 'ai', content: data.response }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: 'ai', content: "Error connecting to RyanOS." }]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (initialChatMsg && mode === 'chat' && chatHistory.length === 0) { handleSend(initialChatMsg); }
  }, [initialChatMsg, mode]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, loading]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-neutral-900/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-7xl h-[85vh] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-white/20 rounded-none">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white hover:bg-black hover:text-white transition-colors border border-neutral-200"><X size={24} /></button>

        {/* Left Side: Visuals (Video/Image OR Papers) */}
        <div className="w-full md:w-2/3 h-1/2 md:h-full bg-neutral-100 overflow-y-auto relative scrollbar-hide border-r border-neutral-200">
          {/* VIDEO RENDERER */}
          {project.videos && project.videos.map((vid: string, i: number) => (
            <div key={i} className="aspect-video w-full">
              <iframe src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`} className="w-full h-full" frameBorder="0" allowFullScreen />
            </div>
          ))}
          {/* PDF RENDERER (Compact) */}
          {project.papers && (
            <div className="px-6 py-4 flex flex-col gap-3 bg-neutral-100">
              {project.papers.map((paper: any, i: number) => (
                <a key={i} href={paper.url} target="_blank" rel="noopener noreferrer" className="group w-full flex items-center gap-4 bg-white px-5 py-4 border border-neutral-200 hover:border-black transition-all shadow-sm hover:shadow-md rounded-sm">
                  <FileText size={20} className="text-neutral-300 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs uppercase leading-tight">{paper.title}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{paper.desc}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors flex-shrink-0">PDF</span>
                </a>
              ))}
            </div>
          )}
          {/* GROUPED GALLERY (used by Curio) */}
          {project.groups && project.groups.length > 0 && (
            <div className="p-4 md:p-6 space-y-8">
              {project.groups.map((group: { name: string; size: 'large' | 'small'; link?: string; images: string[] }, gi: number) => (
                <div key={gi}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
                    <h4 className="font-bold text-xs uppercase tracking-widest">{group.name}</h4>
                    {group.link && (
                      <a href={group.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest inline-flex items-center gap-1">
                        <ExternalLink size={10} /> Live
                      </a>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {group.images.map((img: string, ii: number) => (
                      <div key={ii} className="aspect-[4/3] overflow-hidden bg-neutral-200">
                        <img src={img} alt={`${group.name} ${ii + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* IMAGE RENDERER (flat list, used by other projects) */}
          {(!project.groups || project.groups.length === 0) && project.images && project.images.map((img: string, i: number) => (
            <img key={i} src={img} className="w-full h-auto object-cover" />
          ))}
        </div>

        {/* Right Side: Details/Chat */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-white flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center pr-16">
            {mode === 'chat' ? (
              <button onClick={() => setMode('details')} className="text-xs font-bold flex items-center gap-1 hover:text-blue-600"><ChevronLeft size={12}/> Back to Details</button>
            ) : (
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{project.category} // {project.date}</div>
            )}
          </div>

          {mode === 'details' ? (
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
              <h3 className="text-2xl font-black uppercase mb-2">{project.role}</h3>
              <p className="text-neutral-600 mb-8 font-medium">{project.fullDesc}</p>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mb-8 px-4 py-3 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-blue-600 font-bold text-xs uppercase tracking-widest transition-all">
                  <ExternalLink size={14} /> View Live Project
                </a>
              )}
              <div className="mb-8 p-4 bg-neutral-50 border border-neutral-100 text-xs text-neutral-500 leading-relaxed italic">&quot;{project.context}&quot;</div>
              {project.subProjects && project.subProjects.length > 0 && (
                <div className="mb-8 space-y-3">
                  <h4 className="font-bold text-xs uppercase text-neutral-400 border-b border-neutral-100 pb-2">Inside the Lab</h4>
                  {project.subProjects.map((sp: { name: string; link?: string; desc: string; isNew?: boolean }, i: number) => (
                    <div key={i} className="p-4 border border-neutral-200 hover:border-black transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-sm uppercase tracking-wide">{sp.name}</h5>
                          {sp.isNew && (
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-black text-white px-1.5 py-0.5">NEW</span>
                          )}
                        </div>
                        {sp.link && (
                          <a href={sp.link} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest">
                            <ExternalLink size={12} /> Live
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">{sp.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-xs uppercase text-neutral-400 border-b border-neutral-100 pb-2">Project Data</h4>
                {project.stats.map((stat: string, i: number) => (
                  <div key={i} className="flex justify-between text-sm font-mono"><span className="text-neutral-400">0{i+1}</span><span className="font-bold">{stat}</span></div>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-neutral-100">
                <button onClick={() => setMode('chat')} className="w-full py-4 bg-black text-white font-bold uppercase text-xs tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">Ask Ryan about this <MessageSquare size={16} /></button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-neutral-50 h-full relative">
              <div className="flex-1 p-6 overflow-y-auto space-y-4 pb-20">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 text-sm ${msg.role === 'user' ? 'bg-black text-white rounded-t-lg rounded-bl-lg' : 'bg-white border border-neutral-200 rounded-t-lg rounded-br-lg shadow-sm'}`}>
                      {msg.role === 'ai' ? <FormattedText text={msg.content} /> : msg.content}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-bold">{msg.role === 'user' ? 'You' : 'RyanOS'}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start">
                    <div className="bg-white border border-neutral-200 p-4 rounded-t-lg rounded-br-lg shadow-sm flex items-center gap-2 text-neutral-400"><Sparkles size={14} className="animate-spin" /> Thinking...</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200">
                <div className="relative">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { handleSend(input); setInput(''); }}} placeholder={`Ask about ${project.title}...`} className="w-full bg-neutral-100 border border-transparent focus:bg-white focus:border-black rounded-none py-3 px-4 text-sm outline-none transition-all pr-10" autoFocus />
                  <button onClick={() => { handleSend(input); setInput(''); }} className="absolute right-2 top-2 p-1.5 text-neutral-400 hover:text-black"><Send size={16} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  // MAIN CHAT STATE
  const [mainInput, setMainInput] = useState('');
  const [mainHistory, setMainHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [mainLoading, setMainLoading] = useState(false);
  const mainChatEndRef = useRef<HTMLDivElement>(null);

  const sendMainMessage = async (textOverride?: string) => {
    const msgToSend = textOverride || mainInput;
    if (!msgToSend.trim()) return;
    // --- SINGLE TURN LOGIC (WIPE HISTORY ON NEW QUESTION) ---
    const newHistory: { role: 'user'|'ai', content: string }[] = [{ role: 'user', content: msgToSend }];
    setMainHistory(newHistory);
    if (!textOverride) setMainInput('');
    setMainLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msgToSend }) });
      const data = await res.json();
      let rawResponse = data.response || '';
      // Filter Logic - Now Robust to spaces (e.g. [filter: Experience])
      const tagMatch = rawResponse.match(/\[filter:\s*([a-zA-Z0-9_-]+)\]/i);
      if (tagMatch) {
        const tag = tagMatch[1].toLowerCase();
        setActiveFilter(tag);
        rawResponse = rawResponse.replace(tagMatch[0], '');
      } else {
        setActiveFilter(null);
        setVisibleCount(9);
      }
      setMainHistory([...newHistory, { role: 'ai', content: rawResponse }]);
    } catch (error) {
      setMainHistory([...newHistory, { role: 'ai', content: "System offline. Please try again." }]);
    } finally { setMainLoading(false); }
  };

  // SCROLL FIX: Only scroll if we actually have history (i.e., user sent a message)
  useEffect(() => {
    if (mainHistory.length > 0) { mainChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }
  }, [mainHistory, mainLoading]);

  const handleLoadMore = () => { setVisibleCount(prev => prev + 7); };
  const clearFilter = () => { setActiveFilter(null); setVisibleCount(9); };

  const displayedProjects = allProjects.filter(p => {
    if (!activeFilter) return true;
    return p.tags && p.tags.includes(activeFilter);
  });

  const projectsToShow = activeFilter ? displayedProjects : displayedProjects.slice(0, visibleCount);
  const hasInteracted = mainHistory.length > 0;

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[60] mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />
      <div className="max-w-[1920px] mx-auto bg-white min-h-screen shadow-2xl border-x border-neutral-200">

        {/* ROW 1: STATUS BAR */}
        <div className="bg-black text-white px-8 py-2 flex justify-between items-center text-[10px] font-mono tracking-widest border-b border-neutral-800">
          <div className="flex gap-4 items-center">
            <span>RYAN_OS v106.1 // ONLINE</span>
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-neutral-400 transition-colors flex items-center gap-1 border-l border-neutral-700 pl-4"><Info size={10} /> SYSTEM_INFO</button>
          </div>
          <div>MILWAUKEE, WI</div>
        </div>

        {/* ROW 2: FOCUS AREAS */}
        <motion.div className="border-b border-neutral-100 relative" variants={topRowVariants} initial="hidden" animate="visible">
          <div className="bg-white border-b border-neutral-100 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Core Disciplines // Specialized Zones</div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {focusAreas.map((area) => (
              <div key={area.id} className="relative h-[300px] overflow-hidden group cursor-pointer border-r border-neutral-100 last:border-r-0" onClick={() => !mainLoading && sendMainMessage(area.prompt)}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${area.img})` }} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/80 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                  <div className="text-[10px] font-mono text-white/70 mb-2">{area.eyebrow}</div>
                  <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full w-fit">{area.icon}</div>
                  <div className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2">{area.subtitle}</div>
                  <h3 className="text-3xl font-black uppercase mb-2 text-white drop-shadow-md">{area.title}</h3>
                  <p className="text-sm font-medium text-white/90 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ROW 3: IDENTITY & CHAT */}
        <motion.div layout variants={identityRowVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-neutral-100 h-auto lg:h-[450px] lg:max-h-[450px] overflow-hidden">
          {!hasInteracted && (
            <motion.div initial={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="p-8 md:p-16 border-r border-neutral-100 flex flex-col justify-center bg-white col-span-1 h-full min-h-[300px]">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-4">HI,<br/>I&apos;M RYAN.</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">AI Enablement &middot; Creative Systems &middot; Experiential Leadership</p>
              <div className="prose prose-sm text-neutral-600 font-medium leading-relaxed">
                <p>I translate emerging technology into systems organizations can adopt.</p>
                <p className="mt-4">Architecture trained the systems thinking. Teaching trained the translation. Experiential trained the craft. AI is the medium that lets all three run at once.</p>
                <p className="mt-4">Instead of scrolling, <strong>just ask.</strong></p>
              </div>
            </motion.div>
          )}

          {/* HEADSHOT CONTAINER */}
          <motion.div layout className={`p-0 flex items-end justify-center bg-white border-r border-neutral-100 relative overflow-hidden min-h-[400px] lg:min-h-0 h-full col-span-1`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="w-full h-full relative z-10 flex items-end justify-center overflow-hidden group">
              <img src="/images/ryan_headshot.png" className="h-auto max-h-[85%] w-auto object-contain transition-opacity duration-300 group-hover:opacity-0 absolute bottom-0 drop-shadow-2xl" alt="Ryan O'Connor" />
              <img src="/images/ryan_headshot_hover.png" className="h-auto max-h-[85%] w-auto object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 absolute bottom-0 drop-shadow-2xl" alt="Ryan O'Connor Hover" />
            </div>
          </motion.div>

          {/* CHAT CONTAINER */}
          <motion.div layout className={`p-8 md:p-8 flex flex-col bg-white h-full max-h-full min-h-[500px] lg:min-h-0 ${hasInteracted ? 'md:col-span-1 lg:col-span-2' : 'md:col-span-2 lg:col-span-1'}`}>
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                {mainLoading ? (
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400"><Sparkles size={12} className="animate-spin" /> Ryan is thinking...</div>
                ) : (
                  <><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/><span className="text-xs font-bold uppercase tracking-widest text-neutral-400">System Online</span></>
                )}
              </div>
              <div className="flex gap-4">
                <a href="/labs/dragon.html" target="_blank" className="text-[10px] font-mono text-neutral-400 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1">DRAGON <ArrowUpRight size={8} /></a>
                <a href="/labs/solar.html" target="_blank" className="text-[10px] font-mono text-neutral-400 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1">SOLAR <ArrowUpRight size={8} /></a>
              </div>
            </div>

            {/* CHAT HISTORY AREA */}
            <div className="h-[280px] overflow-y-auto mb-4 pr-2 scrollbar-hide shrink-0 space-y-4">
              {mainHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-400 text-lg font-medium">What do you want to know? Ask me anything about my work, leadership style, or what I&apos;m building next.</div>
              ) : (
                mainHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-black text-white rounded-t-lg rounded-bl-lg' : 'bg-neutral-100 text-neutral-900 rounded-t-lg rounded-br-lg'}`}>
                      {msg.role === 'ai' ? <FormattedText text={msg.content} /> : msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={mainChatEndRef} />
            </div>

            <div className={`relative group border-b-2 border-neutral-200 focus-within:border-black transition-colors shrink-0 mt-auto ${mainLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              <input value={mainInput} onChange={(e) => setMainInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !mainLoading && sendMainMessage()} placeholder="Type to talk to Ryan..." disabled={mainLoading} className="w-full bg-transparent py-4 pr-12 text-lg font-bold placeholder:text-neutral-300 text-black outline-none disabled:cursor-not-allowed" />
              <button onClick={() => !mainLoading && sendMainMessage()} disabled={mainLoading} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-black transition-colors disabled:cursor-not-allowed"><Send size={20} /></button>
            </div>
          </motion.div>
        </motion.div>

        {/* ACTIVE FILTER BAR */}
        {activeFilter && (
          <div className="bg-black text-white px-8 py-3 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
            <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Filter size={12} /> FILTER ACTIVE: <span className="text-blue-400">{activeFilter}</span></div>
            <button onClick={clearFilter} className="text-[10px] font-mono uppercase hover:text-red-400 transition-colors">Clear Filter [X]</button>
          </div>
        )}

        {/* ROW 4: WORK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projectsToShow.map((proj) => (
            <motion.div key={proj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} onClick={() => setActiveProject(proj)} className="group relative aspect-[4/3] border-r border-b border-neutral-100 overflow-hidden cursor-pointer bg-neutral-100">
              <img src={proj.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-8">
                <div className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-2">{proj.client} // {proj.date}</div>
                <h3 className="text-3xl text-white font-black uppercase leading-none mb-6">{proj.title}</h3>
                <div className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest border-b border-white pb-1">
                  {proj.type === 'whitepaper' ? 'Read Paper' : 'View Project'} <ArrowUpRight size={12} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 bg-white px-4 py-3 z-10 border-t border-r border-neutral-100">
                <span className="font-bold text-xs uppercase tracking-widest text-black">{proj.title}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* LOAD MORE */}
        {!activeFilter && visibleCount < allProjects.length && (
          <div className="flex justify-center p-12 bg-white border-t border-neutral-100">
            <button onClick={handleLoadMore} className="px-8 py-4 bg-black text-white font-bold uppercase text-xs tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"><Plus size={16} /> More Work ({allProjects.length - visibleCount} Projects)</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
        {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
