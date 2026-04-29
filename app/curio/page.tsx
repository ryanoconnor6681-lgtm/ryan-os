"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ───────────────────────────────────────────────────────────────────────────
// Curio Primer — hidden landing page at /curio
//
// Direction C ("The Living Brain"). Voice: Sagan / Jason Fried / Ryan.
// Pain frame: exhaustion, not FOMO. The wave didn't arrive on a schedule —
// the firehose did, and the operator is drowning. Curio is the beacon.
//
// Sequence:
//   I. Recognition  — persona gate → cold open (beacon) → three layers
//   II. Reframe     — the hangups (mirror) → the mindset shift
//   III. Receipts   — brain → range → builds  (next pass)
//   IV. Invitation  — pricing → about → faq    (next pass)
// ───────────────────────────────────────────────────────────────────────────

type Persona = 'self' | 'team' | null;

const PERSONAS: { id: Exclude<Persona, null>; label: string; sub: string }[] = [
  {
    id: 'self',
    label: 'For myself',
    sub: 'I sense I could be operating at a higher level. I want a guide.',
  },
  {
    id: 'team',
    label: 'For my team',
    sub: 'I see what’s coming for us. I want everyone moving the same way.',
  },
];

// Cold-open copy — calm, low, empathetic. Persona-tuned.
const COLD_OPEN: Record<Exclude<Persona, null>, string[]> = {
  self: [
    'It’s late.',
    'You opened this because something nagged at you today.',
    'A thing you saw. A thing you almost said.',
    'A thing you wanted to build but didn’t.',
    '',
    'You’re not behind. You’re swamped.',
    'I built this for that feeling.',
  ],
  team: [
    'It’s late.',
    'And your team is asking.',
    'What does any of this actually mean for us?',
    'Which one of these things is the one that matters?',
    '',
    'They’re not behind. They’re swamped.',
    'I built this so you can answer them.',
  ],
};

const HANGUPS = [
  {
    tag: 'i · the exhaustion',
    claim: 'I want this. I can’t keep up.',
    real: (
      <>
        That isn&rsquo;t a personal failing. That&rsquo;s the firehose. <strong>The fix isn&rsquo;t another sprint</strong> &mdash; it&rsquo;s a filter you can trust, run by someone who already drank from it.
      </>
    ),
  },
  {
    tag: 'ii · the guilt',
    claim: 'Is this cheating?',
    real: (
      <>
        A calculator is cheating at math. The question isn&rsquo;t whether AI is cheating &mdash; it&rsquo;s whether you&rsquo;re <strong>still useful</strong> when the room around you stops calling it that. They already have.
      </>
    ),
  },
  {
    tag: 'iii · the identity',
    claim: 'I’m the deck person. I’m the Excel person.',
    real: (
      <>
        That was the <strong>scaffold</strong> you climbed to get senior. AI doesn&rsquo;t take it. It frees you to be the person who <em>directed</em> the deck &mdash; which was always who you were trying to become.
      </>
    ),
  },
  {
    tag: 'iv · the muscle memory',
    claim: '“Some day I’ll be good at AI.”',
    real: (
      <>
        That&rsquo;s not how this works. You won&rsquo;t get good at it &mdash; you&rsquo;ll <strong>change what you ask of it</strong>. Stop asking <em>how do I&hellip;</em>. Ask what you wish. Or what you hate.
      </>
    ),
  },
];

// ─── Spirograph ────────────────────────────────────────────────────────────
const Spirograph = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden>
    <g fill="none" stroke="var(--curio-amber)" strokeWidth="0.5" opacity="0.85">
      {Array.from({ length: 18 }).map((_, i) => (
        <ellipse key={i} cx="100" cy="100" rx="74" ry="42" transform={`rotate(${i * 10} 100 100)`} />
      ))}
    </g>
    <g fill="none" stroke="var(--curio-amber)" strokeWidth="0.4" opacity="0.55">
      <ellipse cx="100" cy="100" rx="55" ry="55" />
      <ellipse cx="100" cy="100" rx="38" ry="38" />
      <ellipse cx="100" cy="100" rx="20" ry="20" />
    </g>
  </svg>
);

// ─── Persona Gate (now leads the page) ─────────────────────────────────────
const PersonaGate = ({
  persona,
  onSelect,
}: {
  persona: Persona;
  onSelect: (p: Exclude<Persona, null>) => void;
}) => (
  <section className="curio-cold curio-persona-cold">
    <div className="curio-cold-inner">
      <div className="curio-mark">
        <span className="curio-mark-dot" />
        <span>Curio</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="curio-persona-prelude"
      >
        Before we start.
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="curio-persona-h"
      >
        Who&rsquo;s here?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="curio-persona-quiet"
      >
        Two doors. Pick the one that fits. The page tunes itself the rest of the way.
      </motion.p>

      <div className="curio-persona-grid">
        {PERSONAS.map((p, i) => (
          <motion.button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`curio-persona-card ${persona === p.id ? 'is-selected' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 + i * 0.15 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
          >
            <div className="curio-persona-num">0{i + 1}</div>
            <div className="curio-persona-label">{p.label}</div>
            <div className="curio-persona-sub">{p.sub}</div>
            <div className="curio-persona-arrow">&rarr;</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="curio-persona-aside"
      >
        Pick the wrong one and you can switch later. No email. No paywall.
      </motion.div>
    </div>
  </section>
);

// ─── Cold Open (the beacon) ────────────────────────────────────────────────
const ColdOpen = ({
  persona,
  onDone,
}: {
  persona: Exclude<Persona, null>;
  onDone: () => void;
}) => {
  const lines = COLD_OPEN[persona];
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= lines.length) return;
    const isBlank = lines[revealed] === '';
    const timer = setTimeout(() => setRevealed((r) => r + 1), isBlank ? 700 : 1300);
    return () => clearTimeout(timer);
  }, [revealed, lines]);

  const finished = revealed >= lines.length;

  return (
    <section className="curio-cold">
      <div className="curio-beacon" aria-hidden>
        <div className="curio-beacon-glow" />
      </div>
      <div className="curio-cold-inner">
        <div className="curio-cold-text">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: i < revealed ? 1 : 0, y: i < revealed ? 0 : 10 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className={line === '' ? 'curio-cold-blank' : 'curio-cold-line'}
            >
              {line || ' '}
            </motion.div>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: finished ? 1 : 0 }}
          transition={{ duration: 0.8, delay: finished ? 0.3 : 0 }}
          onClick={onDone}
          className="curio-cold-cta"
          aria-hidden={!finished}
          tabIndex={finished ? 0 : -1}
        >
          <span>Pull up a chair</span>
          <span className="curio-arrow">&darr;</span>
        </motion.button>
      </div>
    </section>
  );
};

// ─── Three layers — what Curio actually does ───────────────────────────────
const ThreeLayers = ({ persona }: { persona: Exclude<Persona, null> }) => {
  const layers = [
    {
      name: 'Inspiration',
      sub: 'a north star',
      q:
        persona === 'team'
          ? 'Where could AI take this team in eighteen months? What’s the version of our work we can’t yet see?'
          : 'Where could AI take me in eighteen months? What’s the version of my work I can’t yet see?',
      not: 'Inspiration alone is a TED talk.',
    },
    {
      name: 'Filter',
      sub: 'a curator',
      q:
        persona === 'team'
          ? 'Of all the noise this week, what one thing actually deserves my team’s attention?'
          : 'Of all the noise this week, what one thing actually deserves my attention?',
      not: 'Filter alone is a paid newsletter.',
    },
    {
      name: 'Mindset',
      sub: 'a transferred way of seeing',
      q:
        'How does someone three years in actually think about this — and how do I get there without the three-year detour?',
      not: 'Mindset alone is therapy.',
    },
  ];

  return (
    <section className="curio-section curio-layers">
      <div className="curio-eyebrow">what this is</div>
      <h2 className="curio-h2">
        Three questions, one answer.
      </h2>
      <p className="curio-quiet">
        Most of what&rsquo;s out there picks one of these and sells it back to you. Curio is built to do all three at once &mdash; not as features, but as the shape of a single working artifact.
      </p>
      <div className="curio-layer-grid">
        {layers.map((l, i) => (
          <motion.div
            key={l.name}
            className="curio-layer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="curio-layer-num">0{i + 1}</div>
            <div className="curio-layer-name">{l.name}</div>
            <div className="curio-layer-sub">{l.sub}</div>
            <div className="curio-layer-q">&ldquo;{l.q}&rdquo;</div>
            <div className="curio-layer-not">{l.not}</div>
          </motion.div>
        ))}
      </div>
      <div className="curio-layer-payoff">
        Curio integrates them. The artifact you end up holding is inspiration, filter, and mindset folded into one thing you can run after I leave the room.
      </div>
    </section>
  );
};

// ─── Hangups (the mirror) ──────────────────────────────────────────────────
const Hangups = ({ persona }: { persona: Exclude<Persona, null> }) => (
  <section className="curio-section curio-hangups">
    <div className="curio-eyebrow curio-eyebrow-amber">act ii · reframe</div>
    <h2 className="curio-h2 curio-h2-dark">
      Four things I keep hearing.{' '}
      <strong>Maybe you&rsquo;ve said one of them.</strong>
    </h2>
    <p className="curio-quiet curio-quiet-dark">
      I&rsquo;m not going to argue you out of any of them. I&rsquo;m going to put them next to a small reframe and let you sit with both.
      {persona === 'self' && ' (You&rsquo;ll know which one you keep coming back to.)'}
      {persona === 'team' && ' (Your team has these. Half of them won&rsquo;t say it out loud.)'}
    </p>
    <div className="curio-hangup-grid">
      {HANGUPS.map((h, i) => (
        <motion.div
          key={h.tag}
          className="curio-hangup"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
        >
          <div className="curio-hangup-tag">{h.tag}</div>
          <div className="curio-hangup-claim">&ldquo;{h.claim}&rdquo;</div>
          <div className="curio-hangup-real">{h.real}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

// ─── Reframe / The Shift ───────────────────────────────────────────────────
const Reframe = () => {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yMove = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section className="curio-section curio-reframe" ref={ref}>
      <motion.div className="curio-reframe-spiro" style={{ rotate, y: yMove }}>
        <Spirograph />
      </motion.div>
      <div className="curio-reframe-inner">
        <div className="curio-eyebrow">the shift</div>
        <motion.h2
          className="curio-h-display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
        >
          You can&rsquo;t catch up.{' '}
          <em>You can change what you&rsquo;re reaching for.</em>
        </motion.h2>
        <motion.p
          className="curio-lede"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          You&rsquo;re not going to read your way to the front of the wave. Nobody is. The operators who feel ahead aren&rsquo;t ahead because they read more &mdash; they&rsquo;re ahead because they <em>asked differently</em>. They stopped chasing tools and started naming the work.
        </motion.p>
        <motion.div
          className="curio-shift"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.4 }}
        >
          <div className="curio-shift-line">Stop asking <em>how do I&hellip;</em></div>
          <div className="curio-shift-line curio-shift-line-strong">
            Ask what you wish. Or what you hate.
          </div>
          <div className="curio-shift-line curio-shift-tag">The mindset is the skill.</div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Coming next placeholder ───────────────────────────────────────────────
const ComingNext = () => (
  <section className="curio-section curio-coming">
    <div className="curio-eyebrow">still building</div>
    <h3 className="curio-h3">
      Next: the brain talks back. Three live builds. Twelve channels. The price.
    </h3>
    <p className="curio-quiet">
      This is the empathy half. The receipts are in the next cut.
    </p>
  </section>
);

// ─── Main ──────────────────────────────────────────────────────────────────
export default function CurioPage() {
  const [persona, setPersona] = useState<Persona>(null);
  const [coldOpenDone, setColdOpenDone] = useState(false);
  const coldRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);

  // After persona pick, scroll to the cold open
  useEffect(() => {
    if (persona && coldRef.current) {
      setTimeout(() => coldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [persona]);

  // After cold open done, scroll to three-layers
  useEffect(() => {
    if (coldOpenDone && layersRef.current) {
      setTimeout(() => layersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [coldOpenDone]);

  return (
    <main className="curio-root">
      <CurioStyles />

      <PersonaGate persona={persona} onSelect={(p) => setPersona(p)} />

      {persona && (
        <>
          <div ref={coldRef}>
            <ColdOpen persona={persona} onDone={() => setColdOpenDone(true)} />
          </div>

          <div ref={layersRef}>
            <ThreeLayers persona={persona} />
          </div>

          <Hangups persona={persona} />

          <Reframe />

          <ComingNext />
        </>
      )}

      <footer className="curio-footer">
        <div>Curio Studio &middot; Ryan O&rsquo;Connor</div>
        <div className="curio-mono">hidden &middot; v0.2 &middot; not in nav</div>
      </footer>
    </main>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const CurioStyles = () => (
  <style>{`
    .curio-root {
      --curio-cream: #f3ede1;
      --curio-cream-2: #ece4d4;
      --curio-paper: #faf6ec;
      --curio-ink: #16140f;
      --curio-ink-2: #0e0d09;
      --curio-ink-soft: rgba(22, 20, 15, 0.72);
      --curio-muted: rgba(22, 20, 15, 0.55);
      --curio-rule: rgba(22, 20, 15, 0.18);
      --curio-amber: #e08a2b;
      --curio-amber-soft: rgba(224, 138, 43, 0.18);
      --curio-serif: var(--font-fraunces), Georgia, 'Times New Roman', serif;
      --curio-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
      --curio-mono: var(--font-mono), 'JetBrains Mono', monospace;

      background: var(--curio-cream);
      color: var(--curio-ink);
      font-family: var(--curio-sans);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── Section frame ───────────────────────────────────────────────── */
    .curio-section {
      max-width: 1180px;
      margin: 0 auto;
      padding: 112px 28px;
    }
    @media (max-width: 720px) { .curio-section { padding: 80px 22px; } }

    /* ── Type primitives ─────────────────────────────────────────────── */
    .curio-eyebrow {
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--curio-muted);
      margin-bottom: 22px;
    }
    .curio-eyebrow-amber { color: var(--curio-amber); }
    .curio-h2 {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(34px, 5vw, 60px);
      line-height: 1.04;
      letter-spacing: -0.01em;
      margin: 0 0 22px;
      color: var(--curio-ink);
      max-width: 22ch;
    }
    .curio-h2 em { font-style: italic; color: var(--curio-amber); font-weight: 500; }
    .curio-h2 strong { font-style: italic; font-weight: 700; color: var(--curio-amber); }
    .curio-h2-dark { color: var(--curio-cream); }
    .curio-h2-dark strong { color: var(--curio-amber); }
    .curio-h3 {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(22px, 3vw, 30px);
      line-height: 1.2;
      margin: 0 0 12px;
    }
    .curio-quiet {
      font-size: 15.5px;
      line-height: 1.6;
      color: var(--curio-ink-soft);
      max-width: 60ch;
      margin: 0 0 36px;
    }
    .curio-quiet-dark { color: rgba(243, 237, 225, 0.72); }
    .curio-mono {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--curio-muted);
    }

    /* ── Cold-open shell (used by persona gate AND the beacon) ──────── */
    .curio-cold {
      background: var(--curio-ink);
      color: var(--curio-cream);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 72px 28px;
      position: relative;
      overflow: hidden;
    }
    .curio-cold-inner {
      max-width: 760px;
      width: 100%;
      position: relative;
      z-index: 2;
    }
    .curio-mark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(243, 237, 225, 0.6);
      margin-bottom: 64px;
    }
    .curio-mark-dot {
      width: 7px; height: 7px;
      background: var(--curio-amber);
      border-radius: 50%;
      box-shadow: 0 0 18px rgba(224, 138, 43, 0.6);
    }

    /* ── Persona gate (front door, in the dark) ──────────────────────── */
    .curio-persona-cold {
      background: radial-gradient(ellipse at 50% 35%, rgba(224,138,43,0.05) 0%, transparent 60%), var(--curio-ink);
    }
    .curio-persona-prelude {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--curio-amber);
      margin-bottom: 18px;
    }
    .curio-persona-h {
      font-family: var(--curio-serif);
      font-weight: 300;
      font-size: clamp(48px, 7vw, 88px);
      line-height: 1;
      letter-spacing: -0.02em;
      color: var(--curio-cream);
      margin: 0 0 22px;
    }
    .curio-persona-quiet {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: clamp(17px, 1.6vw, 19px);
      color: rgba(243, 237, 225, 0.7);
      margin: 0 0 48px;
      max-width: 50ch;
      line-height: 1.5;
    }
    .curio-persona-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    @media (max-width: 720px) { .curio-persona-grid { grid-template-columns: 1fr; } }
    .curio-persona-card {
      background: rgba(243, 237, 225, 0.04);
      border: 1px solid rgba(243, 237, 225, 0.18);
      padding: 28px 28px 28px;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
      color: var(--curio-cream);
      transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
      position: relative;
      min-height: 200px;
      display: flex;
      flex-direction: column;
    }
    .curio-persona-card:hover {
      border-color: var(--curio-amber);
      background: rgba(224, 138, 43, 0.05);
      box-shadow: 0 0 60px -20px rgba(224, 138, 43, 0.5);
    }
    .curio-persona-card.is-selected {
      border-color: var(--curio-amber);
      background: rgba(224, 138, 43, 0.08);
    }
    .curio-persona-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--curio-amber);
      margin-bottom: 18px;
    }
    .curio-persona-label {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(24px, 2.2vw, 28px);
      line-height: 1.15;
      margin-bottom: 10px;
      color: var(--curio-cream);
    }
    .curio-persona-sub {
      font-size: 14px;
      color: rgba(243, 237, 225, 0.7);
      line-height: 1.5;
      max-width: 32ch;
      margin-bottom: 20px;
      flex: 1;
    }
    .curio-persona-arrow {
      font-family: var(--curio-serif);
      font-size: 22px;
      color: var(--curio-amber);
      align-self: flex-end;
      transition: transform 0.25s;
    }
    .curio-persona-card:hover .curio-persona-arrow { transform: translateX(4px); }
    .curio-persona-aside {
      margin-top: 32px;
      font-size: 12px;
      color: rgba(243, 237, 225, 0.4);
      font-style: italic;
      font-family: var(--curio-serif);
    }

    /* ── The beacon (cold open) ──────────────────────────────────────── */
    .curio-beacon {
      position: absolute; inset: 0;
      pointer-events: none;
    }
    .curio-beacon-glow {
      position: absolute;
      top: 28%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px; height: 800px;
      background: radial-gradient(circle, rgba(224, 138, 43, 0.14) 0%, transparent 55%);
      animation: curio-pulse 6s ease-in-out infinite;
    }
    @keyframes curio-pulse {
      0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.06); }
    }
    .curio-cold-text {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .curio-cold-line {
      font-family: var(--curio-serif);
      font-weight: 300;
      font-size: clamp(26px, 4vw, 44px);
      line-height: 1.22;
      letter-spacing: -0.005em;
      color: var(--curio-cream);
    }
    .curio-cold-line:last-of-type {
      font-style: italic;
      color: var(--curio-amber);
    }
    .curio-cold-blank { height: 18px; }
    .curio-cold-cta {
      margin-top: 64px;
      background: transparent;
      border: 1px solid rgba(243, 237, 225, 0.4);
      color: var(--curio-cream);
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      padding: 14px 22px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 14px;
      transition: border-color 0.2s, background 0.2s, color 0.2s;
    }
    .curio-cold-cta:hover {
      border-color: var(--curio-amber);
      color: var(--curio-amber);
      background: rgba(224, 138, 43, 0.04);
    }
    .curio-arrow { font-family: var(--curio-serif); font-size: 16px; }

    /* ── Three layers ────────────────────────────────────────────────── */
    .curio-layers { background: var(--curio-cream); }
    .curio-layer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 28px;
    }
    @media (max-width: 900px) { .curio-layer-grid { grid-template-columns: 1fr; } }
    .curio-layer {
      background: var(--curio-paper);
      border: 1px solid var(--curio-rule);
      padding: 28px 24px 24px;
      display: flex;
      flex-direction: column;
      min-height: 280px;
    }
    .curio-layer-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.25em;
      color: var(--curio-amber);
      margin-bottom: 16px;
    }
    .curio-layer-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: 28px;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .curio-layer-sub {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 14px;
      color: var(--curio-muted);
      margin-bottom: 18px;
    }
    .curio-layer-q {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 16px;
      line-height: 1.45;
      color: var(--curio-ink);
      margin-bottom: 18px;
      flex: 1;
    }
    .curio-layer-not {
      border-top: 1px dashed var(--curio-rule);
      padding-top: 14px;
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--curio-muted);
    }
    .curio-layer-payoff {
      margin-top: 36px;
      padding: 26px 28px;
      background: var(--curio-ink);
      color: var(--curio-cream);
      font-family: var(--curio-serif);
      font-size: clamp(17px, 1.8vw, 21px);
      line-height: 1.5;
      max-width: 65ch;
    }

    /* ── Hangups (gentler than v0.1) ─────────────────────────────────── */
    .curio-hangups {
      background: var(--curio-ink);
      color: var(--curio-cream);
      max-width: none;
      padding-left: 0;
      padding-right: 0;
    }
    .curio-hangups > * {
      max-width: 1180px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 28px;
      padding-right: 28px;
    }
    .curio-hangup-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin-top: 12px;
    }
    @media (max-width: 760px) { .curio-hangup-grid { grid-template-columns: 1fr; } }
    .curio-hangup {
      background: rgba(243, 237, 225, 0.04);
      border: 1px solid rgba(243, 237, 225, 0.16);
      padding: 28px 28px 30px;
    }
    .curio-hangup-tag {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.25em;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--curio-amber);
      margin-bottom: 16px;
    }
    .curio-hangup-claim {
      font-family: var(--curio-serif);
      font-style: italic;
      font-weight: 400;
      font-size: 22px;
      line-height: 1.3;
      color: var(--curio-cream);
      margin-bottom: 16px;
    }
    .curio-hangup-real {
      font-size: 14px;
      line-height: 1.65;
      color: rgba(243, 237, 225, 0.78);
    }
    .curio-hangup-real strong { color: var(--curio-cream); font-weight: 600; }
    .curio-hangup-real em { color: var(--curio-amber); font-style: italic; }

    /* ── Reframe / shift ─────────────────────────────────────────────── */
    .curio-reframe {
      position: relative;
      overflow: hidden;
      background: var(--curio-cream);
    }
    .curio-reframe-spiro {
      position: absolute;
      top: -120px;
      right: -160px;
      width: 600px;
      height: 600px;
      pointer-events: none;
      opacity: 0.7;
    }
    @media (max-width: 720px) {
      .curio-reframe-spiro { width: 380px; height: 380px; top: -60px; right: -120px; }
    }
    .curio-reframe-inner { position: relative; z-index: 2; }
    .curio-h-display {
      font-family: var(--curio-serif);
      font-weight: 300;
      font-size: clamp(44px, 7vw, 88px);
      line-height: 1.0;
      letter-spacing: -0.02em;
      max-width: 18ch;
      margin: 0 0 28px;
      color: var(--curio-ink);
    }
    .curio-h-display em {
      font-style: italic;
      font-weight: 500;
      color: var(--curio-amber);
    }
    .curio-lede {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(18px, 1.8vw, 22px);
      line-height: 1.5;
      max-width: 55ch;
      color: var(--curio-ink);
      margin: 0 0 64px;
    }
    .curio-lede em { color: var(--curio-amber); font-style: italic; font-weight: 500; }

    .curio-shift {
      border-top: 1px solid var(--curio-rule);
      border-bottom: 1px solid var(--curio-rule);
      padding: 36px 0 40px;
      max-width: 800px;
    }
    .curio-shift-line {
      font-family: var(--curio-serif);
      font-size: clamp(22px, 2.6vw, 30px);
      line-height: 1.3;
      color: var(--curio-ink);
      margin-bottom: 8px;
    }
    .curio-shift-line em { color: var(--curio-muted); font-style: italic; }
    .curio-shift-line-strong {
      font-weight: 700;
      font-style: italic;
      color: var(--curio-amber);
    }
    .curio-shift-tag {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--curio-amber);
      margin-top: 18px;
    }

    /* ── Coming next + footer ─────────────────────────────────────── */
    .curio-coming {
      border-top: 1px solid var(--curio-rule);
      padding-top: 60px;
      padding-bottom: 60px;
    }
    .curio-footer {
      max-width: 1180px;
      margin: 0 auto;
      padding: 28px;
      border-top: 1px solid var(--curio-rule);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--curio-mono);
      font-size: 11px;
      color: var(--curio-muted);
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    @media (max-width: 540px) {
      .curio-footer { flex-direction: column; gap: 10px; align-items: flex-start; }
    }
  `}</style>
);
