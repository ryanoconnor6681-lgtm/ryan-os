"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { setStoredPersona } from './shared';

// ───────────────────────────────────────────────────────────────────────────
// Curio Primer — hidden landing page at /curio
//
// Visual language: Frontiers brand (Brain/Personal/Projects/Frontiers).
// Cream + ink + navy + rust + amber. Halftone dots, retro illustration,
// editorial ribbons. Voice: Sagan / Jason Fried / Ryan, with the warmth of
// "Your Architecture Friend" + a therapist's quiet. No SaaS. No "I built."
// I'm here for you.
//
// Sequence:
//   I.  Recognition  — persona gate → cold open (the sit-down)
//   II. Reframe      — three layers (inspiration / filter / mindset)
//                    → the four hangups → the shift
//   III. Receipts    — chat → range → builds   (next pass)
//   IV.  Invitation  — pricing → about → faq    (next pass)
// ───────────────────────────────────────────────────────────────────────────

type Persona = 'self' | 'team' | null;

const PERSONAS: { id: Exclude<Persona, null>; label: string; sub: string }[] = [
  {
    id: 'self',
    label: 'For myself',
    sub: 'I sense I could be operating differently. I want a guide.',
  },
  {
    id: 'team',
    label: 'For my team',
    sub: 'I see what’s coming for us. I want everyone moving the same way.',
  },
];

// Cold-open copy — universal, Jobs voice. Stated, not reframed. Lets the reader finish the thought.
// Fires before the persona gate. No "you aren't behind, you're swamped" hedging — too coach-y. State what is.
const COLD_OPEN: string[] = [
  'The world has changed.',
  '',
  'AI is already in your team’s day. Your kid’s homework. The headlines you keep meaning to read.',
  '',
  'Most of what’s reaching you isn’t the change.',
  'It’s noise about the change.',
  '',
  'The work is figuring out which is which.',
  '',
  'One choice to start.',
];

// Each wall is a fallacy. Each fallacy is answered by a door.
const HANGUPS = [
  {
    tag: 'i · the exhaustion fallacy',
    claim: 'I don’t have time.',
    real: (
      <>
        Saying <em>&ldquo;I don&rsquo;t have time to learn AI&rdquo;</em> is like saying <em>&ldquo;I don&rsquo;t have time to learn to drive &mdash; I have to keep walking everywhere.&rdquo;</em> The tool <strong>is</strong> the time. <span className="curio-wall-door">→ Filter</span>
      </>
    ),
  },
  {
    tag: 'ii · the guilt fallacy',
    claim: 'Is this cheating?',
    real: (
      <>
        A calculator was cheating at math. Until it wasn&rsquo;t. The room around you has already moved &mdash; the question isn&rsquo;t whether AI is cheating, it&rsquo;s whether you&rsquo;re <strong>still useful</strong> after they stop calling it that. <span className="curio-wall-door">→ Solutions</span>
      </>
    ),
  },
  {
    tag: 'iii · the identity fallacy',
    claim: 'I’m the deck person. The Excel person. The one who [my craft].',
    real: (
      <>
        That was the <strong>scaffold</strong> you climbed to get here. AI doesn&rsquo;t take it &mdash; it frees you to be the person who <em>directed</em> the deck. Which was always the version of you that was trying to arrive. <span className="curio-wall-door">→ Inspiration</span>
      </>
    ),
  },
  {
    tag: 'iv · the muscle-memory fallacy',
    claim: 'Some day I’ll be good at AI.',
    real: (
      <>
        That&rsquo;s not how this works. There is no curriculum. You won&rsquo;t get good at it &mdash; you&rsquo;ll <strong>change what you ask of it</strong>. Stop asking <em>how do I&hellip;</em>. Ask what you wish. Or what you hate. <span className="curio-wall-door">→ Mindset</span>
      </>
    ),
  },
];

// ─── Halftone dot pattern for backgrounds (subtle texture) ─────────────────
const Halftone = ({ className = '' }: { className?: string }) => (
  <svg className={className} aria-hidden width="100%" height="100%" preserveAspectRatio="none">
    <defs>
      <pattern id="curio-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.4" fill="currentColor" opacity="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#curio-dots)" />
  </svg>
);

// ─── Persona Gate (front door, in the dark) ────────────────────────────────
const PersonaGate = ({
  persona,
  onSelect,
}: {
  persona: Persona;
  onSelect: (p: Exclude<Persona, null>) => void;
}) => (
  <section className="curio-cold curio-persona-cold">
    {/* soft amber beacon glow + halftone wash behind everything */}
    <div className="curio-beacon" aria-hidden>
      <div className="curio-beacon-glow" />
    </div>
    <div className="curio-cold-halftone" aria-hidden style={{ color: '#e08a2b' }}>
      <Halftone />
    </div>

    <div className="curio-cold-inner">
      <div className="curio-mark">
        <span className="curio-mark-dot" />
        <span>Curio <span className="curio-mark-by">— a studio by Ryan O&rsquo;Connor</span></span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="curio-persona-prelude"
      >
        Before we sit down.
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
        Two doors. Pick the one that fits today. The page tunes itself the rest of the way &mdash; and you can switch later. No email. No paywall.
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
    </div>
  </section>
);

// ─── Cold Open (the sit-down) ──────────────────────────────────────────────
const ColdOpen = ({
  onDone,
}: {
  onDone: () => void;
}) => {
  const lines = COLD_OPEN;
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= lines.length) return;
    const isBlank = lines[revealed] === '';
    const timer = setTimeout(() => setRevealed((r) => r + 1), isBlank ? 700 : 1300);
    return () => clearTimeout(timer);
  }, [revealed, lines]);

  const finished = revealed >= lines.length;

  return (
    <section className="curio-cold curio-cold-warm">
      <div className="curio-beacon" aria-hidden>
        <div className="curio-beacon-glow" />
      </div>
      <div className="curio-cold-halftone" aria-hidden style={{ color: '#d49d3a' }}>
        <Halftone />
      </div>
      <div className="curio-cold-inner">
        <div className="curio-mark">
          <span className="curio-mark-dot" />
          <span>Curio <span className="curio-mark-by">— a studio by Ryan O&rsquo;Connor</span></span>
        </div>
        <div className="curio-cold-text">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: i < revealed ? 1 : 0, y: i < revealed ? 0 : 10 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className={line === '' ? 'curio-cold-blank' : 'curio-cold-line'}
            >
              {line || ' '}
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
          <span>One choice to start</span>
          <span className="curio-arrow">&darr;</span>
        </motion.button>
      </div>
    </section>
  );
};

// ─── The Hub — wordmark + chat + four needs ────────────────────────────────
type ChatMsg = { role: 'you' | 'curio'; text: string };

const TheHub = ({ persona }: { persona: Exclude<Persona, null> }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const turns = messages.filter((m) => m.role === 'you').length;
  const gated = turns >= 4;

  const send = async (text: string) => {
    if (!text.trim() || sending || gated) return;
    setSending(true);
    setMessages((prev) => [...prev, { role: 'you', text }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'curio',
        text:
          'Stub answer. Claude wiring lands next pass — when it does, this is where I’d sketch your version: what your shape of this looks like, where I’d start, what would surprise you. Try another turn — you’ve got ' + (3 - turns) + ' more.',
      }]);
      setSending(false);
    }, 850);
  };

  const needs = persona === 'team' ? [
    { id: 'inspiration', name: 'Inspiration', sub: 'where this is headed for our team.' },
    { id: 'filter', name: 'Filter', sub: 'what my team actually needs to use.' },
    { id: 'mindset', name: 'Mindset', sub: 'half my team is fluent. half isn’t. close it.' },
    { id: 'solutions', name: 'Solutions', sub: 'help building, auditing, aligning.' },
  ] : [
    { id: 'inspiration', name: 'Inspiration', sub: 'where this is all going.' },
    { id: 'filter', name: 'Filter', sub: 'what to actually use, what to ignore.' },
    { id: 'mindset', name: 'Mindset', sub: 'I’m using it. I’ve plateaued.' },
    { id: 'solutions', name: 'Solutions', sub: 'help building, auditing, thinking.' },
  ];

  const walls = [
    { id: 'wall-exhaustion', short: 'the exhaustion', claim: 'I want this. I can’t keep up.' },
    { id: 'wall-guilt', short: 'the guilt', claim: 'Is this cheating?' },
    { id: 'wall-identity', short: 'the identity', claim: 'I’m the deck person.' },
    { id: 'wall-muscle', short: 'the muscle memory', claim: 'Some day I’ll be good at it.' },
  ];

  const router = useRouter();
  const scrollTo = (id: string) => {
    // Wheel-only: hub-chat is local; others are now routes.
    if (id === 'hub-chat') {
      const el = document.getElementById('hub-chat');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // Door routes
    router.push(`/curio/${id}`);
  };

  // Position items radially around the wheel.
  // Top arc (needs): clock positions 10, 11, 1, 2 → angles -60, -30, 30, 60 from vertical
  // Bottom arc (walls): clock positions 8, 7, 5, 4 → angles -120 (or 240), -150 (210), 150, 120
  const needAngles = [-60, -30, 30, 60]; // degrees from straight-up
  const wallAngles = [240, 210, 150, 120]; // bottom arc, mirrored

  const polar = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 50 + Math.cos(rad) * r, y: 50 + Math.sin(rad) * r }; // % values
  };

  return (
    <section className="curio-section curio-hub">
      {/* Curio mark — sun + ribbons above the wordmark */}
      <motion.div
        className="curio-hub-banner"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9 }}
      >
        <img src="/images/curio/frontiers/curiocircle.png" alt="" aria-hidden />
      </motion.div>
      {/* Top wordmark + parenthetical above the wheel (light half) */}
      <p className="curio-subtle">
        (or: what I&rsquo;ve learned in three years of using AI and bringing my team along with me.)
      </p>
      <motion.div
        className="curio-hub-mark"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        How Curio helps.
      </motion.div>
      <p className="curio-hub-frame curio-hub-frame-top">
        I&rsquo;ve found most people need <em>one of four things</em>.
      </p>

      {/* The wheel — split bg light/dark, satellites + central chat */}
      <div className="curio-wheel-wrap">
        <div className="curio-wheel">
          {/* Split background: cream top half, navy bottom half */}
          <div className="curio-wheel-bg-top" aria-hidden />
          <div className="curio-wheel-bg-bottom" aria-hidden />

          {/* Sun rays + rings */}
          <svg className="curio-wheel-rays" viewBox="0 0 200 200" aria-hidden>
            {/* top-half rays — rust on cream */}
            <g stroke="var(--curio-rust)" strokeWidth="0.4" opacity="0.55" fill="none">
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = i * 10 - 90; // -90 to +80
                if (angle > 90 || angle < -90) return null;
                const a = (angle) * Math.PI / 180;
                const x1 = 100 + Math.cos(a) * 28;
                const y1 = 100 + Math.sin(a) * 28;
                const x2 = 100 + Math.cos(a) * 88;
                const y2 = 100 + Math.sin(a) * 88;
                return <line key={`t-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </g>
            {/* bottom-half rays — amber on navy, slightly stronger */}
            <g stroke="var(--curio-amber-2)" strokeWidth="0.4" opacity="0.45" fill="none">
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = i * 10 + 90; // 90 to 270
                const a = (angle) * Math.PI / 180;
                const x1 = 100 + Math.cos(a) * 28;
                const y1 = 100 + Math.sin(a) * 28;
                const x2 = 100 + Math.cos(a) * 88;
                const y2 = 100 + Math.sin(a) * 88;
                return <line key={`b-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </g>
            <circle cx="100" cy="100" r="86" stroke="var(--curio-rule)" strokeWidth="0.5" fill="none" />
            {/* equator dashed line */}
            <line x1="6" y1="100" x2="194" y2="100" stroke="var(--curio-rule)" strokeWidth="0.6" strokeDasharray="3 2" />
          </svg>

          {/* Equator labels */}
          <div className="curio-wheel-label curio-wheel-label-left">what you need &uarr;</div>
          <div className="curio-wheel-label curio-wheel-label-right">&darr; what holds you back</div>

          {/* Center: chat */}
          <div className="curio-wheel-center" id="hub-chat">
            <div className="curio-wheel-eyebrow">ask curio</div>
            <div className="curio-wheel-prompt">type a wish, or pick a door.</div>
            <div className="curio-chat-input-block curio-chat-input-light">
              <input
                type="text"
                className="curio-chat-input"
                placeholder={persona === 'team' ? 'what does my team need…' : 'what would my version look like…'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
                disabled={sending || gated}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || sending || gated}
                className="curio-chat-send"
              >
                send &rarr;
              </button>
            </div>
          </div>

          {/* Top arc: 4 needs (satellites with callouts) */}
          {needs.map((n, i) => {
            const p = polar(needAngles[i], 64);
            return (
              <motion.button
                key={n.id}
                className="curio-orbit curio-orbit-need"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => scrollTo(n.id)}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
              >
                <span className="curio-orbit-dot" />
                <span className="curio-orbit-text">
                  <span className="curio-orbit-num">0{i + 1} &middot; {n.name.toLowerCase()}</span>
                  <span className="curio-orbit-name">{n.name}</span>
                  <span className="curio-orbit-sub">{n.sub}</span>
                </span>
              </motion.button>
            );
          })}

          {/* Bottom arc: 4 walls */}
          {walls.map((w, i) => {
            const p = polar(wallAngles[i], 64);
            return (
              <motion.div
                key={w.id}
                className="curio-orbit curio-orbit-wall"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
              >
                <span className="curio-orbit-dot curio-orbit-dot-empty" />
                <span className="curio-orbit-text curio-orbit-text-dark">
                  <span className="curio-orbit-num">{['i','ii','iii','iv'][i]} &middot; {w.short}</span>
                  <span className="curio-orbit-claim">&ldquo;{w.claim}&rdquo;</span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom framing copy — sits on the dark half */}
      <p className="curio-hub-frame curio-hub-frame-bottom">
        &hellip;but feel <em>blocked</em> by these walls.
      </p>

      {/* Mobile fallback: stacked list */}
      <div className="curio-wheel-mobile">
        <div className="curio-mobile-section">
          <div className="curio-mono curio-mobile-label">what you need</div>
          {needs.map((n, i) => (
            <button key={n.id} className="curio-mobile-node curio-mobile-need" onClick={() => scrollTo(n.id)}>
              <span className="curio-mobile-num">0{i + 1}</span>
              <span className="curio-mobile-name">{n.name}</span>
              <span className="curio-mobile-sub">{n.sub}</span>
            </button>
          ))}
        </div>

        <div className="curio-mobile-section">
          <div className="curio-mono curio-mobile-label curio-mobile-label-dim">what holds you back</div>
          {walls.map((w, i) => (
            <div key={w.id} className="curio-mobile-node curio-mobile-wall">
              <span className="curio-mobile-num">{['i','ii','iii','iv'][i]}</span>
              <span className="curio-mobile-name">{w.short}</span>
              <span className="curio-mobile-sub">&ldquo;{w.claim}&rdquo;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat history (if any) appears below the wheel */}
      {messages.length > 0 && (
        <div className="curio-chat-history curio-chat-history-light">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`curio-chat-msg curio-chat-msg-light curio-chat-${m.role}`}
            >
              <div className="curio-chat-tag">{m.role === 'you' ? 'you' : 'curio'}</div>
              <div className="curio-chat-text">{m.text}</div>
            </motion.div>
          ))}
          {sending && (
            <div className="curio-chat-msg curio-chat-msg-light curio-chat-curio">
              <div className="curio-chat-tag">curio</div>
              <div className="curio-chat-text curio-chat-typing">thinking&hellip;</div>
            </div>
          )}
        </div>
      )}
      {gated && (
        <div className="curio-chat-gate-light">
          <span>You&rsquo;ve had four turns &mdash; that&rsquo;s the demo. </span>
          <button className="curio-chat-gate-link" onClick={() => scrollTo('solutions')}>see the price &darr;</button>
        </div>
      )}

      <button className="curio-hub-show" onClick={() => scrollTo('inspiration')}>
        <span>show me everything</span>
        <span className="curio-arrow">&darr;</span>
      </button>
    </section>
  );
};

// ─── Hangups (the mirror) ──────────────────────────────────────────────────
const Hangups = ({ persona }: { persona: Exclude<Persona, null> }) => (
  <section className="curio-section curio-hangups">
    <div className="curio-eyebrow curio-eyebrow-amber">act ii · the four walls</div>
    <h2 className="curio-h2 curio-h2-dark">
      What keeps you from going deeper.{' '}
      <strong>One of these is yours.</strong>
    </h2>
    <p className="curio-quiet curio-quiet-dark">
      Every story has a hero who hesitates. Yours is no different. I&rsquo;m not going to argue you out of any of these &mdash; I&rsquo;m going to put each one next to a small reframe and let you sit with both. The one that lands is your wall.
      {persona === 'self' && ' (You’ll know which one keeps coming back.)'}
      {persona === 'team' && ' (Your team has these. Half of them won’t say so out loud.)'}
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

// ─── Reframe / The Shift (with parallax statue illustration) ───────────────
const Reframe = () => {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yMove = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 0.95, 0.95, 0.5]);

  return (
    <section className="curio-section curio-reframe" ref={ref}>
      <div className="curio-reframe-grid">
        <div className="curio-reframe-text">
          <div className="curio-eyebrow">the shift</div>
          <motion.h2
            className="curio-h-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
          >
            You&rsquo;re not behind.{' '}
            <em>You&rsquo;re asking the wrong question.</em>
          </motion.h2>

          <motion.p
            className="curio-lede"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            A smart person told me yesterday: <em>&ldquo;When I get time. Maybe next month. Once I figure it out.&rdquo;</em> No. That&rsquo;s how you stay still forever.
          </motion.p>

          <motion.p
            className="curio-lede"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            Tomorrow, you open Claude. You don&rsquo;t ask for a wireframe. You ask for the <em>whole damn thing.</em> Then you tell it what to fix. The shift isn&rsquo;t getting good at AI. The shift is <strong>asking bigger.</strong>
          </motion.p>

          <motion.div
            className="curio-shift"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, delay: 0.4 }}
          >
            <div className="curio-shift-line">Don&rsquo;t ask <em>how do I&hellip;</em></div>
            <div className="curio-shift-line">Don&rsquo;t ask for the wireframe.</div>
            <div className="curio-shift-line curio-shift-line-strong">
              Ask for the whole thing.
            </div>
            <div className="curio-shift-line curio-shift-tag">The mindset is the skill.</div>
          </motion.div>
        </div>

        <motion.div
          className="curio-reframe-illo"
          style={{ y: yMove, opacity }}
        >
          <img src="/images/curio/frontiers/statue-strands.jpeg" alt="" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
};

// ─── Per-lane SHIFT block (used inside each lane) ──────────────────────────
const LaneShift = ({
  question,
  answer,
  prompt,
  punch,
}: {
  question: string;
  answer: string;
  prompt: string;
  punch: string;
}) => (
  <motion.div
    className="curio-laneshift"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7 }}
  >
    <div className="curio-laneshift-q">{question}</div>
    <div className="curio-laneshift-a"><em>{answer}</em></div>
    <div className="curio-laneshift-rule" />
    <div className="curio-laneshift-prompt">
      <span>{prompt}</span> <strong>{punch}</strong>
    </div>
  </motion.div>
);

// ─── LANE: Inspiration (was Live Builds — three sample-flows) ──────────────
const LaneInspiration = ({ persona }: { persona: Exclude<Persona, null> }) => {
  const builds = [
    {
      scale: 'Personal',
      name: 'Brain Launcher + Ryan OS',
      what: 'A working second brain across 3,346 indexed conversations. Daily briefings, weekly digests, custom skills firing on triggers. The system that produced everything else here.',
      link: null,
      label: 'private — the output is everything on this site',
    },
    {
      scale: 'Institutional',
      name: 'RedPeg AI Curiosity Catalog',
      what: 'The 40-person agency version. Fourteen entry points by belief system. 75% Claude utilization in 4 weeks. ~$433K in cost-recovery questions surfaced.',
      link: 'https://red-peg-curiosity-catalog.vercel.app/',
      label: 'open the build',
    },
    {
      scale: 'One-for-one',
      name: 'A Primer for John',
      what: 'A former colleague, eighteen months out of agency life. Ten chapters tuned to his exact career shape. Built in one working day. The next one takes 2–3 hours.',
      link: 'https://claude-onboarding-kohl.vercel.app/',
      label: 'open the build',
    },
  ];

  return (
    <section className="curio-section curio-builds curio-lane" id="inspiration">
      <div className="curio-lane-header">
        <div className="curio-lane-num">01 / inspiration</div>
        <div className="curio-lane-for">
          {persona === 'team' ? 'for the leader who wants a horizon their team can rally around.' : 'for those who want to know where this is all going.'}
        </div>
      </div>

      <LaneShift
        question={persona === 'team' ? 'You don’t need a roadmap for your team.' : 'You don’t need a roadmap.'}
        answer={persona === 'team' ? 'You need a horizon they can see together.' : 'You need a north star.'}
        prompt={persona === 'team' ? 'Stop asking what we should learn.' : 'Stop asking what’s launching.'}
        punch={persona === 'team' ? 'Ask what we could become.' : 'Ask what could be possible — for the version of you that’s still ahead of you.'}
      />

      <h2 className="curio-h2 curio-h2-after-shift">
        {persona === 'team' ? 'Here’s what it can look like.' : 'Here’s what it looks like at three scales.'}
      </h2>
      <p className="curio-prose">
        {persona === 'team'
          ? 'Three real builds at three scales. Open any of them — walk through. The one that’s closest to your team is the institutional build (RedPeg). It’s where this lane usually lands.'
          : 'At three scales — for me, for a whole agency, for one person. Each is its own sample-flow. Open it. Walk through. Decide what your version could be.'}
      </p>

      <div className="curio-build-grid">
        {builds.map((b, i) => (
          <motion.div
            key={i}
            className="curio-build"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="curio-build-num">0{i + 1} &middot; <span>{b.scale} scale</span></div>
            <h3 className="curio-build-name">{b.name}</h3>
            <p className="curio-build-what">{b.what}</p>
            {b.link ? (
              <a href={b.link} target="_blank" rel="noopener noreferrer" className="curio-build-cta">
                <span>{b.label}</span>
                <span>&#8599;</span>
              </a>
            ) : (
              <div className="curio-build-private">{b.label}</div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── LANE: Filter (twelve channels — what works) ──────────────────────────
const LaneFilter = ({ persona }: { persona: Exclude<Persona, null> }) => {
  const channels = [
    { name: 'Claude Design / primers', output: 'Three vision-transfer artifacts (this is one of them)', where: 'curio' },
    { name: 'Long-form fiction', output: 'Gift.Script — a 340-page published novel', where: 'amazon' },
    { name: 'Editorial / data viz', output: "The Ladder That Isn't — journalist-cited interactive dashboard", where: 'ladder-mu.vercel.app' },
    { name: 'Operational / MCP', output: 'Claude × MCP × Excel/Asana/NetSuite → ~$433K in cost-recovery questions surfaced', where: 'redpeg internal' },
    { name: 'Team enablement', output: 'RedPeg Curiosity Catalog → 75% utilization in 4 weeks', where: 'curiosity catalog' },
    { name: 'SaaS / web apps', output: 'Style Sync — multi-API moodboard tool, live and functional', where: 'style-sync-eight.vercel.app' },
    { name: 'Brand systems', output: 'RedPeg Brand Bible 2026 — 24-page navigable HTML brand-doc', where: 'pdf' },
    { name: 'Physical products', output: 'Lantern & Fox — D2C heirloom kit + AI story engine', where: 'lanternandfox.com' },
    { name: 'Long-form essays', output: '“The Employee Is The Audience,” “The Contract You Didn’t Know You Signed,” others', where: 'ryanoconnor.design' },
    { name: '3D CAD / fabrication', output: 'Send Cut Send token tests for the Lantern kit', where: 'in production' },
    { name: 'Brain systems', output: '3,346-conversation indexed Brain, custom skills firing on triggers', where: 'private' },
    { name: 'Creative direction', output: '20 years across Nike, Meta, Faraday, Santander, agency leadership', where: 'redpeg portfolio' },
  ];

  return (
    <section className="curio-section curio-range curio-lane" id="filter">
      <div className="curio-lane-header">
        <div className="curio-lane-num">02 / filter</div>
        <div className="curio-lane-for">
          {persona === 'team' ? 'for the leader drowning in launch summaries forwarded to every channel.' : 'for those who hear it all over, but want what actually works.'}
        </div>
      </div>

      <LaneShift
        question={persona === 'team' ? 'Your team doesn’t need more newsletters.' : 'You can’t read your way to clarity.'}
        answer={persona === 'team' ? 'They need someone who already used the thing and tells you whether it stuck.' : 'You can pick someone who already did.'}
        prompt={persona === 'team' ? 'Stop forwarding what dropped.' : 'Stop asking what’s new.'}
        punch={persona === 'team' ? 'Tell us what worked.' : 'Ask what works.'}
      />

      <h2 className="curio-h2 curio-h2-after-shift">
        Here&rsquo;s <em>what works</em>.
      </h2>
      <p className="curio-prose">
        The internet is loud. Every week another launch, another benchmark, another &ldquo;the only AI tool you&rsquo;ll ever need.&rdquo; Most of it doesn&rsquo;t survive contact with a real workday. These twelve channels did. <strong>Use this as a filter.</strong> If a tool or workflow doesn&rsquo;t map to one of these, you can usually ignore it for now.
      </p>

      <div className="curio-range-table">
        {channels.map((c, i) => (
          <motion.div
            key={i}
            className="curio-range-row"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <div className="curio-range-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="curio-range-name">{c.name}</div>
            <div className="curio-range-output">{c.output}</div>
            <div className="curio-range-where">{c.where}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── LANE: Mindset (the wall, the reframe, the ask-bigger move) ────────────
const LaneMindset = ({ persona }: { persona: Exclude<Persona, null> }) => {
  const scrollToHub = () => {
    const el = document.getElementById('hub-chat');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="curio-section curio-mindset curio-lane" id="mindset">
      <div className="curio-lane-header curio-lane-header-dark">
        <div className="curio-lane-num curio-lane-num-amber">03 / mindset</div>
        <div className="curio-lane-for curio-lane-for-dark">
          {persona === 'team' ? 'for the leader watching their team plateau on prompts.' : 'for those using AI but feel stuck or plateaued.'}
        </div>
      </div>

      <LaneShift
        question={persona === 'team' ? 'The team plateau isn’t a training problem.' : 'The plateau isn’t a skill problem.'}
        answer={persona === 'team' ? 'It’s a permission problem. Nobody’s asking bigger because they don’t think they’re allowed to.' : 'It’s a question problem.'}
        prompt={'Stop asking how do I…'}
        punch={'Ask what you wish. Or what you hate.'}
      />

      <h2 className="curio-h2 curio-h2-dark curio-h2-after-shift">
        {persona === 'team' ? 'Half your team is fluent. Half isn’t.' : 'You’re using it. '}
        <em>{persona === 'team' ? 'The gap is widening.' : 'You’re still flat.'}</em>
      </h2>
      <p className="curio-quiet curio-quiet-dark">
        {persona === 'team'
          ? 'It’s not about training. It’s about giving people permission to ask bigger. Most teams stall at "save time on writing." The teams that move past that point have someone modeling the bigger move — every day, in their actual work.'
          : 'The plateau is the most common shape of stuck. You learned the prompts, you save time on email, you built a few good habits. Then nothing. Same job, same outputs, same ceiling.'}
      </p>

      <div className="curio-mindset-mantras">
        <div className="curio-mantra">
          <div className="curio-mantra-num">i.</div>
          <div className="curio-mantra-text">
            Stop asking <em>how do I do X</em>. Start asking <strong>what do I wish</strong>, or <strong>what do I hate</strong>.
          </div>
        </div>
        <div className="curio-mantra">
          <div className="curio-mantra-num">ii.</div>
          <div className="curio-mantra-text">
            Stop asking for the <em>wireframe</em>. Ask for the <strong>whole damn thing</strong>. Then tell it what to fix.
          </div>
        </div>
        <div className="curio-mantra">
          <div className="curio-mantra-num">iii.</div>
          <div className="curio-mantra-text">
            Stop trying to <em>get good at AI</em>. Start changing <strong>what you ask of it</strong>.
          </div>
        </div>
      </div>

      <button className="curio-mindset-cta" onClick={scrollToHub}>
        <span>Try it &mdash; ask Curio about your specific wall</span>
        <span className="curio-arrow">&uarr;</span>
      </button>
    </section>
  );
};

// ─── LANE: Solutions (was The Price — four rungs) ──────────────────────────
const LaneSolutions = ({ persona }: { persona: Exclude<Persona, null> }) => {
  const tiers = [
    {
      tag: 'free',
      name: 'The Talk',
      price: '$0',
      desc: 'The chat above. Four turns, calibrated to your persona. Free as in free — no email, no upsell sequence.',
      cta: 'try the chat ↑',
      featured: false,
    },
    {
      tag: 'self-serve',
      name: 'The Bundle',
      price: '$149',
      desc: 'A reusable scaffold: HTML primer template, starter Brain vault, video walkthrough. You customize it to your work.',
      cta: 'gumroad — soon',
      featured: false,
    },
    {
      tag: 'done-for-you',
      name: 'Bespoke',
      price: '$2,500',
      desc: 'I build it for you. Custom HTML primer, tuned Brain vault, 2–3 custom Claude skills, walkthrough session. Three slots a quarter.',
      cta: 'book a chemistry call',
      featured: true,
    },
    {
      tag: 'team / company',
      name: 'Catalog',
      price: '$7,500–$15,000',
      desc: 'The institutional version. Custom Curiosity Catalog tuned to your team’s belief mix, role coverage, and rollout plan. Two slots a quarter.',
      cta: 'book leadership intake',
      featured: false,
    },
  ];

  return (
    <section className="curio-section curio-price curio-lane" id="solutions">
      <div className="curio-lane-header">
        <div className="curio-lane-num">04 / solutions</div>
        <div className="curio-lane-for">
          {persona === 'team' ? 'for the leader who needs a partner, not a vendor.' : 'for those who need help building, auditing, thinking.'}
        </div>
      </div>

      <LaneShift
        question={persona === 'team' ? 'You don’t need an "AI services" SKU.' : 'You don’t need to learn how to build it.'}
        answer={persona === 'team' ? 'You need a partner who fits inside your operations and your culture.' : 'You need someone who’ll build it with you.'}
        prompt={persona === 'team' ? 'Stop hiring vendors.' : 'Stop trying to learn it.'}
        punch={persona === 'team' ? 'Hire a partner.' : 'Hand me the wish.'}
      />

      <h2 className="curio-h2 curio-h2-after-shift">Four rungs.</h2>
      <p className="curio-prose">
        Same DNA at every rung &mdash; vision artifact, starter Brain, custom skills, walkthrough &mdash; at increasing scale and customization. The free chat at the hub is the demo. The Bespoke is the book-of-record. The Catalog is the institutional version.
      </p>

      <div className="curio-price-grid">
        {tiers.map((t, i) => (
          <motion.div
            key={i}
            className={`curio-price-tier ${t.featured ? 'is-featured' : ''}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <div className="curio-price-tag">{t.tag}</div>
            <div className="curio-price-name">{t.name}</div>
            <div className="curio-price-num">{t.price}</div>
            <p className="curio-price-desc">{t.desc}</p>
            <button className="curio-price-cta">{t.cta}</button>
          </motion.div>
        ))}
      </div>

      <p className="curio-price-aside">
        There&rsquo;s a fifth tier &mdash; the Vision Sprint &mdash; for full strategic engagements at $25k+. Inbound only, no public price. Typically a Catalog client who&rsquo;s ready for the deeper version.
      </p>
    </section>
  );
};

// ─── Coming next placeholder (Act IV) ──────────────────────────────────────
const ComingNext = () => (
  <section className="curio-section curio-coming">
    <div className="curio-eyebrow">still to come</div>
    <h3 className="curio-h3">
      About the operator. The FAQ. How to start, when you&rsquo;re ready.
    </h3>
    <p className="curio-quiet">
      Act IV in the next cut.
    </p>
  </section>
);

// ─── Main ──────────────────────────────────────────────────────────────────
export default function CurioPage() {
  const [coldOpenDone, setColdOpenDone] = useState(false);
  const [persona, setPersona] = useState<Persona>(null);
  const gateRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (coldOpenDone && gateRef.current) {
      setTimeout(() => gateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [coldOpenDone]);

  useEffect(() => {
    if (persona && hubRef.current) {
      setTimeout(() => hubRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [persona]);

  return (
    <main className="curio-root">
      {/* 1. Universal cold open — fires first. The world has changed. */}
      <ColdOpen onDone={() => setColdOpenDone(true)} />

      {/* 2. Persona gate appears after cold open finishes. One choice to start. */}
      {coldOpenDone && (
        <div ref={gateRef}>
          <PersonaGate persona={persona} onSelect={(p) => { setPersona(p); setStoredPersona(p); }} />
        </div>
      )}

      {/* 3. The hub (wheel + chat + needs/walls) appears after persona is chosen. */}
      {persona && (
        <div ref={hubRef}>
          <TheHub persona={persona} />
        </div>
      )}

      <footer className="curio-footer">
        <div>Curio Studio &middot; Ryan O&rsquo;Connor</div>
        <div className="curio-mono">hidden &middot; v0.7 &middot; not in nav</div>
      </footer>
    </main>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
export const CurioStyles = () => (
  <style>{`
    .curio-root {
      /* Frontiers palette */
      --curio-cream: #f3ede1;
      --curio-cream-2: #ece4d4;
      --curio-paper: #faf6ec;
      --curio-ink: #16140f;
      --curio-ink-2: #0e0d09;
      --curio-ink-soft: rgba(22, 20, 15, 0.74);
      --curio-muted: rgba(22, 20, 15, 0.56);
      --curio-rule: rgba(22, 20, 15, 0.18);
      --curio-amber: #d49d3a;
      --curio-amber-2: #e08a2b;
      --curio-rust: #a8453a;
      --curio-navy: #2a3a5a;
      --curio-navy-deep: #1a2238;
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
    .curio-eyebrow-amber { color: var(--curio-amber-2); }
    .curio-h2 {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(34px, 5vw, 60px);
      line-height: 1.04;
      letter-spacing: -0.01em;
      margin: 0 0 28px;
      color: var(--curio-ink);
      max-width: 22ch;
    }
    .curio-h2 em { font-style: italic; color: var(--curio-rust); font-weight: 500; }
    .curio-h2 strong { font-style: italic; font-weight: 700; color: var(--curio-rust); }
    .curio-h2-dark { color: var(--curio-cream); }
    .curio-h2-dark strong { color: var(--curio-amber-2); }
    .curio-h3 {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(22px, 3vw, 30px);
      line-height: 1.2;
      margin: 0 0 12px;
    }
    .curio-prose {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(17px, 1.7vw, 20px);
      line-height: 1.55;
      color: var(--curio-ink);
      margin: 0 0 20px;
      max-width: 60ch;
    }
    .curio-prose strong { font-weight: 700; }
    .curio-prose em { font-style: italic; color: var(--curio-rust); font-weight: 500; }
    .curio-quiet {
      font-size: 15.5px;
      line-height: 1.6;
      color: var(--curio-ink-soft);
      max-width: 62ch;
      margin: 0 0 36px;
    }
    .curio-quiet-dark { color: rgba(243, 237, 225, 0.74); }
    .curio-mono {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--curio-muted);
    }

    /* ── Cold open shells (persona gate + cold open) ─────────────────── */
    .curio-cold {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 72px 28px;
      position: relative;
      overflow: hidden;
    }
    .curio-cold-warm {
      background: linear-gradient(180deg, var(--curio-navy-deep) 0%, #221a14 100%);
    }
    .curio-cold-inner {
      max-width: 760px;
      width: 100%;
      position: relative;
      z-index: 3;
    }
    .curio-cold-halftone {
      position: absolute;
      inset: 0;
      opacity: 0.08;
      pointer-events: none;
      z-index: 1;
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
      background: var(--curio-amber-2);
      border-radius: 50%;
      box-shadow: 0 0 18px rgba(224, 138, 43, 0.6);
    }

    /* Beacon glow behind cold-open content */
    .curio-beacon {
      position: absolute; inset: 0;
      pointer-events: none;
      z-index: 2;
    }
    .curio-beacon-glow {
      position: absolute;
      top: 28%;
      left: 50%;
      transform: translateX(-50%);
      width: 900px; height: 900px;
      background: radial-gradient(circle, rgba(212, 157, 58, 0.22) 0%, rgba(168, 69, 58, 0.08) 35%, transparent 60%);
      animation: curio-pulse 6.5s ease-in-out infinite;
    }
    @keyframes curio-pulse {
      0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.06); }
    }

    /* ── Persona gate ────────────────────────────────────────────────── */
    .curio-persona-prelude {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--curio-amber-2);
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
      color: rgba(243, 237, 225, 0.74);
      margin: 0 0 48px;
      max-width: 52ch;
      line-height: 1.55;
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
      padding: 28px 28px;
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
      border-color: var(--curio-amber-2);
      background: rgba(224, 138, 43, 0.06);
      box-shadow: 0 0 80px -20px rgba(224, 138, 43, 0.6);
    }
    .curio-persona-card.is-selected {
      border-color: var(--curio-amber-2);
      background: rgba(224, 138, 43, 0.09);
    }
    .curio-persona-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--curio-amber-2);
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
      color: rgba(243, 237, 225, 0.72);
      line-height: 1.5;
      max-width: 32ch;
      margin-bottom: 20px;
      flex: 1;
    }
    .curio-persona-arrow {
      font-family: var(--curio-serif);
      font-size: 22px;
      color: var(--curio-amber-2);
      align-self: flex-end;
      transition: transform 0.25s;
    }
    .curio-persona-card:hover .curio-persona-arrow { transform: translateX(4px); }

    /* ── Cold open lines ─────────────────────────────────────────────── */
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
    .curio-cold-line:nth-last-child(2),
    .curio-cold-line:last-of-type {
      font-style: italic;
      color: var(--curio-amber-2);
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
      border-color: var(--curio-amber-2);
      color: var(--curio-amber-2);
      background: rgba(224, 138, 43, 0.04);
    }
    .curio-arrow { font-family: var(--curio-serif); font-size: 16px; }

    /* ── What Curio is (lanes) ───────────────────────────────────────── */
    .curio-layers { background: var(--curio-cream); }
    .curio-layer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 40px;
    }
    .curio-layer-grid-4 {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 1100px) { .curio-layer-grid-4 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 900px) { .curio-layer-grid { grid-template-columns: 1fr; } }
    @media (max-width: 720px) { .curio-layer-grid-4 { grid-template-columns: 1fr; } }

    .curio-expand {
      background: transparent;
      border: 1px solid var(--curio-rule);
      color: var(--curio-ink);
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 12px 18px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
      margin-bottom: 8px;
      transition: border-color 0.2s, color 0.2s;
    }
    .curio-expand:hover {
      border-color: var(--curio-rust);
      color: var(--curio-rust);
    }
    .curio-prose-block { margin-top: 12px; }
    .curio-layer {
      background: var(--curio-paper);
      border: 1px solid var(--curio-rule);
      padding: 0 0 28px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .curio-layer-illo {
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      background: var(--curio-cream-2);
    }
    .curio-layer-illo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .curio-layer-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.25em;
      color: var(--curio-rust);
      margin: 24px 24px 14px;
    }
    .curio-layer-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: 28px;
      line-height: 1.1;
      margin: 0 24px 4px;
    }
    .curio-layer-sub {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 14px;
      color: var(--curio-muted);
      margin: 0 24px 18px;
    }
    .curio-layer-q {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 16px;
      line-height: 1.45;
      color: var(--curio-ink);
      margin: 0 24px;
      flex: 1;
    }

    /* ── Hangups ─────────────────────────────────────────────────────── */
    .curio-hangups {
      background: var(--curio-navy-deep);
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
      color: var(--curio-amber-2);
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
    .curio-hangup-real em { color: var(--curio-amber-2); font-style: italic; }

    /* ── Reframe / shift ─────────────────────────────────────────────── */
    .curio-reframe {
      position: relative;
      overflow: hidden;
      background: var(--curio-cream);
    }
    .curio-reframe-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 56px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .curio-reframe-grid { grid-template-columns: 1fr; gap: 36px; }
    }
    .curio-reframe-text {
      min-width: 0;
    }
    .curio-reframe-illo {
      pointer-events: none;
      position: relative;
      width: 100%;
    }
    .curio-reframe-illo img {
      width: 100%; height: auto; display: block;
      mix-blend-mode: multiply;
    }
    @media (max-width: 900px) {
      .curio-reframe-illo { max-width: 480px; margin: 0 auto; opacity: 0.75; }
    }
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
      color: var(--curio-rust);
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
    .curio-lede em { color: var(--curio-rust); font-style: italic; font-weight: 500; }

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
      color: var(--curio-rust);
    }
    .curio-shift-tag {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--curio-amber-2);
      margin-top: 18px;
    }

    /* ── THE HUB ─────────────────────────────────────────────────────── */
    .curio-hub {
      background: linear-gradient(180deg,
        var(--curio-cream) 0%,
        var(--curio-cream) 50%,
        var(--curio-navy-deep) 50%,
        var(--curio-navy-deep) 100%);
      text-align: left;
      max-width: none;
      padding-left: 0;
      padding-right: 0;
    }
    .curio-hub > * {
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 28px;
      padding-right: 28px;
    }
    .curio-hub-frame {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: clamp(20px, 2.4vw, 28px);
      line-height: 1.4;
      max-width: 60ch;
      margin: 32px auto 0;
    }
    .curio-hub-frame em {
      font-weight: 700;
      color: var(--curio-rust);
      font-style: italic;
    }
    .curio-hub-frame-top { color: var(--curio-ink); margin-bottom: 12px; }
    .curio-hub-frame-bottom {
      color: var(--curio-cream);
      margin-top: 12px;
      margin-bottom: 36px;
    }
    .curio-hub-frame-bottom em { color: var(--curio-amber-2); }
    .curio-hub-mark {
      font-family: var(--curio-serif);
      font-weight: 300;
      font-style: italic;
      font-size: clamp(56px, 9vw, 116px);
      line-height: 0.95;
      letter-spacing: -0.025em;
      color: var(--curio-ink);
      margin: 0 auto 12px;
    }
    .curio-hub-chat {
      margin: 28px auto 0;
      max-width: 1180px;
    }
    .curio-chat-input-light {
      background: #fff;
      border-color: var(--curio-rule);
    }
    .curio-chat-input-light:focus-within {
      border-color: var(--curio-rust);
      background: #fff;
    }
    .curio-chat-input-light .curio-chat-input {
      color: var(--curio-ink);
    }
    .curio-chat-input-light .curio-chat-input::placeholder {
      color: var(--curio-muted);
    }
    .curio-chat-input-light .curio-chat-send {
      background: var(--curio-ink);
      color: var(--curio-cream);
    }
    .curio-chat-input-light .curio-chat-send:hover:not(:disabled) {
      background: var(--curio-rust);
    }
    .curio-chat-history-light .curio-chat-msg-light {
      background: #fff;
      border-color: var(--curio-rule);
    }
    .curio-chat-history-light .curio-chat-msg-light .curio-chat-text {
      color: var(--curio-ink);
    }
    .curio-chat-history-light .curio-chat-msg-light .curio-chat-tag {
      color: var(--curio-rust);
    }
    .curio-chat-history-light .curio-chat-you {
      background: rgba(168,69,58,0.06);
      border-color: rgba(168,69,58,0.4);
    }
    .curio-chat-gate-light {
      margin-top: 18px;
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 16px;
      color: var(--curio-ink-soft);
    }
    .curio-chat-gate-link {
      background: none;
      border: none;
      color: var(--curio-rust);
      font-family: inherit;
      font-style: italic;
      font-size: inherit;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
      padding: 0;
    }
    .curio-hub-divider {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 56px auto 36px;
      max-width: 1180px;
    }
    .curio-hub-divider::before,
    .curio-hub-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--curio-rule);
    }
    .curio-hub-divider span {
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--curio-muted);
    }

    .curio-need-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin-top: 28px;
    }
    @media (max-width: 760px) { .curio-need-grid { grid-template-columns: 1fr; } }
    .curio-need {
      background: var(--curio-paper);
      border: 1px solid var(--curio-rule);
      padding: 0 0 26px;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
      color: inherit;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      position: relative;
    }
    .curio-need:hover {
      border-color: var(--curio-rust);
      background: #fff;
      box-shadow: 0 14px 32px -22px rgba(0,0,0,0.25);
    }
    .curio-need-illo {
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      background: var(--curio-cream);
      border-bottom: 1px solid var(--curio-rule);
    }
    .curio-need-illo img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .curio-need-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.25em;
      color: var(--curio-rust);
      margin: 24px 24px 12px;
    }
    .curio-need-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: clamp(28px, 3vw, 36px);
      line-height: 1.05;
      margin: 0 24px 10px;
    }
    .curio-need-sub {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 16px;
      line-height: 1.5;
      color: var(--curio-ink-soft);
      margin: 0 24px;
      max-width: 38ch;
    }
    .curio-need-arrow {
      align-self: flex-end;
      margin: 12px 24px 0 0;
      font-size: 22px;
      color: var(--curio-rust);
      transition: transform 0.2s;
    }
    .curio-need:hover .curio-need-arrow { transform: translateX(4px); }

    .curio-hub-show {
      margin-top: 48px;
      background: transparent;
      border: 1px solid var(--curio-ink);
      color: var(--curio-ink);
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
      transition: background 0.15s, color 0.15s;
    }
    .curio-hub-show:hover {
      background: var(--curio-ink);
      color: var(--curio-cream);
    }

    /* ── The Wheel (circular hub, split bg) ──────────────────────────── */
    .curio-wheel-wrap {
      margin: 32px auto 0;
      max-width: 1100px;
      padding: 0 28px;
    }
    .curio-wheel {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      max-width: 1000px;
      margin: 0 auto;
      overflow: visible;
    }
    @media (max-width: 880px) { .curio-wheel-wrap { display: none; } }

    /* Split background (clipped to a circle by overflow + ring) */
    .curio-wheel-bg-top,
    .curio-wheel-bg-bottom {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: calc(86% / 0.5 * 0.5); /* tied to ring size below; effectively visual cue only */
      pointer-events: none;
    }
    /* Use a clipped circle approach via SVG ring; bg here is just decorative tint */

    .curio-wheel-rays {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .curio-wheel-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 38%;
      max-width: 360px;
      min-width: 240px;
      text-align: center;
      z-index: 5;
      background: var(--curio-cream);
      border: 1px solid var(--curio-rule);
      padding: 22px 22px 18px;
      box-shadow: 0 24px 60px -28px rgba(0,0,0,0.35);
    }
    .curio-wheel-eyebrow {
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--curio-rust);
      margin-bottom: 4px;
    }
    .curio-wheel-prompt {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 14px;
      color: var(--curio-ink-soft);
      margin-bottom: 12px;
    }
    .curio-wheel-center .curio-chat-input-block {
      max-width: 100%;
    }
    .curio-wheel-center .curio-chat-input {
      font-size: 14px;
      padding: 11px 14px;
    }
    .curio-wheel-center .curio-chat-send {
      padding: 0 14px;
      font-size: 9px;
    }

    .curio-wheel-label {
      position: absolute;
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      padding: 4px 12px;
      white-space: nowrap;
      z-index: 2;
    }
    .curio-wheel-label-left {
      top: 50%; left: 0; transform: translateY(-150%);
      color: var(--curio-rust);
      background: var(--curio-cream);
    }
    .curio-wheel-label-right {
      top: 50%; right: 0; transform: translateY(50%);
      color: var(--curio-amber-2);
      background: var(--curio-navy-deep);
    }

    /* Orbit nodes (satellites): dot + callout text */
    .curio-orbit {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 200px;
      background: transparent;
      border: none;
      padding: 0;
      font-family: inherit;
      color: inherit;
      z-index: 4;
    }
    .curio-orbit-need { cursor: pointer; }
    .curio-orbit-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      background: var(--curio-rust);
      box-shadow: 0 0 0 4px var(--curio-cream), 0 0 0 5px var(--curio-rust);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .curio-orbit-dot-empty {
      background: transparent;
      border: 1.5px dashed rgba(243,237,225,0.6);
      box-shadow: 0 0 0 4px var(--curio-navy-deep);
    }
    .curio-orbit-need:hover .curio-orbit-dot {
      transform: scale(1.2);
      box-shadow: 0 0 0 4px var(--curio-cream), 0 0 0 6px var(--curio-rust), 0 0 24px rgba(168,69,58,0.5);
    }
    .curio-orbit-text {
      margin-top: 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .curio-orbit-text-dark { color: var(--curio-cream); }
    .curio-orbit-num {
      font-family: var(--curio-mono);
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--curio-rust);
      font-weight: 700;
    }
    .curio-orbit-text-dark .curio-orbit-num {
      color: var(--curio-amber-2);
    }
    .curio-orbit-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: 22px;
      line-height: 1.1;
      color: var(--curio-ink);
      margin-top: 4px;
    }
    .curio-orbit-sub {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 13px;
      color: var(--curio-ink-soft);
      line-height: 1.4;
      margin-top: 4px;
      max-width: 22ch;
    }
    .curio-orbit-claim {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 14px;
      color: rgba(243,237,225,0.78);
      line-height: 1.35;
      margin-top: 4px;
      max-width: 22ch;
    }
    .curio-orbit-need:hover .curio-orbit-name { color: var(--curio-rust); }

    /* Mobile fallback for wheel */
    .curio-wheel-mobile {
      display: none;
      max-width: 580px;
      margin: 30px auto 0;
      padding: 0 4px;
    }
    @media (max-width: 880px) { .curio-wheel-mobile { display: block; } }
    .curio-mobile-section { margin-bottom: 32px; }
    .curio-mobile-label {
      color: var(--curio-rust);
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--curio-rule);
    }
    .curio-mobile-label-dim { color: var(--curio-muted); }
    .curio-mobile-node {
      display: grid;
      grid-template-columns: 30px 1fr;
      gap: 4px 14px;
      padding: 14px 16px;
      margin-bottom: 6px;
      background: var(--curio-paper);
      border: 1px solid var(--curio-rule);
      text-align: left;
      width: 100%;
      font-family: inherit;
      color: inherit;
      cursor: pointer;
    }
    .curio-mobile-wall { background: rgba(22,20,15,0.04); border-style: dashed; cursor: default; }
    .curio-mobile-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--curio-rust);
      align-self: start;
      padding-top: 3px;
    }
    .curio-mobile-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: 17px;
      line-height: 1.15;
      color: var(--curio-ink);
    }
    .curio-mobile-sub {
      grid-column: 2 / 3;
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 13px;
      color: var(--curio-ink-soft);
      line-height: 1.4;
    }

    /* ── Lane shift (per-lane reframe block) ────────────────────────── */
    .curio-laneshift {
      margin: 8px 0 36px;
      max-width: 60ch;
      padding: 22px 0 24px;
    }
    .curio-mindset .curio-laneshift {
      max-width: 64ch;
    }
    .curio-laneshift-q {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(20px, 2.4vw, 26px);
      line-height: 1.25;
      color: var(--curio-ink);
      margin-bottom: 6px;
    }
    .curio-mindset .curio-laneshift-q { color: var(--curio-cream); }
    .curio-laneshift-a {
      font-family: var(--curio-serif);
      font-size: clamp(22px, 3vw, 32px);
      line-height: 1.2;
      margin-bottom: 18px;
    }
    .curio-laneshift-a em {
      font-style: italic;
      font-weight: 700;
      color: var(--curio-rust);
    }
    .curio-mindset .curio-laneshift-a em { color: var(--curio-amber-2); }
    .curio-laneshift-rule {
      width: 48px;
      height: 1px;
      background: var(--curio-rust);
      margin: 22px 0 22px;
    }
    .curio-mindset .curio-laneshift-rule { background: var(--curio-amber-2); }
    .curio-laneshift-prompt {
      font-family: var(--curio-serif);
      line-height: 1.15;
      color: var(--curio-ink-soft);
    }
    .curio-mindset .curio-laneshift-prompt { color: rgba(243, 237, 225, 0.62); }
    .curio-laneshift-prompt span {
      display: block;
      font-size: clamp(24px, 3vw, 34px);
      font-weight: 400;
      margin-bottom: 6px;
    }
    .curio-laneshift-prompt strong {
      display: block;
      font-style: italic;
      font-weight: 600;
      font-size: clamp(28px, 3.6vw, 42px);
      color: var(--curio-rust);
      letter-spacing: -0.005em;
    }
    .curio-mindset .curio-laneshift-prompt strong { color: var(--curio-amber-2); }
    .curio-mindset .curio-laneshift-prompt {
      color: rgba(243,237,225,0.55);
    }
    .curio-mindset .curio-laneshift-prompt strong {
      color: var(--curio-cream);
    }
    .curio-h2-after-shift {
      margin-top: 8px;
    }

    /* ── Lane headers (used by all four lanes) ───────────────────────── */
    .curio-lane-header {
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 22px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--curio-rule);
    }
    .curio-lane-header-dark {
      border-bottom-color: rgba(243,237,225,0.18);
    }
    .curio-lane-num {
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--curio-rust);
    }
    .curio-lane-num-amber { color: var(--curio-amber-2); }
    .curio-lane-for {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 15px;
      color: var(--curio-muted);
    }
    .curio-lane-for-dark { color: rgba(243,237,225,0.6); }

    /* ── Mindset lane (mantras) ──────────────────────────────────────── */
    .curio-mindset {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
      max-width: none;
      padding-left: 0;
      padding-right: 0;
    }
    .curio-mindset > * {
      max-width: 1180px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 28px;
      padding-right: 28px;
    }
    .curio-mindset-mantras {
      margin-top: 36px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .curio-mantra {
      display: grid;
      grid-template-columns: 60px 1fr;
      gap: 20px;
      padding: 26px 28px;
      border: 1px solid rgba(243,237,225,0.16);
      background: rgba(243,237,225,0.04);
    }
    @media (max-width: 600px) {
      .curio-mantra { grid-template-columns: 1fr; gap: 8px; padding: 22px; }
    }
    .curio-mantra-num {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 28px;
      color: var(--curio-amber-2);
      line-height: 1;
    }
    .curio-mantra-text {
      font-family: var(--curio-serif);
      font-size: clamp(18px, 2vw, 22px);
      line-height: 1.45;
      color: var(--curio-cream);
    }
    .curio-mantra-text em {
      font-style: italic;
      color: rgba(243,237,225,0.55);
    }
    .curio-mantra-text strong {
      font-weight: 700;
      color: var(--curio-amber-2);
      font-style: italic;
    }
    .curio-mindset-cta {
      margin-top: 36px;
      background: transparent;
      border: 1px solid rgba(243,237,225,0.4);
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
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .curio-mindset-cta:hover {
      border-color: var(--curio-amber-2);
      color: var(--curio-amber-2);
      background: rgba(224,138,43,0.04);
    }

    /* ── Curio hub banner (sun + ribbons mark above wordmark) ────────── */
    .curio-hub-banner {
      max-width: 540px;
      margin: 0 auto 16px;
      padding: 0 28px;
    }
    .curio-hub-banner img {
      width: 100%;
      height: auto;
      display: block;
      mix-blend-mode: multiply;
    }

    /* ── Door pages (subroutes for the four needs) ───────────────────── */
    .curio-door .curio-door-header {
      max-width: none;
      margin: 0 auto;
      padding: 0;
      position: relative;
    }
    .curio-door .curio-door-header.is-dark {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
    }
    /* Giant hero illustration — full-bleed, big shine */
    .curio-door-illo-hero {
      width: 100%;
      background: var(--curio-cream-2);
      overflow: hidden;
      position: relative;
      aspect-ratio: 21 / 9;
      max-height: 80vh;
      border-bottom: 1px solid var(--curio-rule);
    }
    .curio-door-illo-hero img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
      mix-blend-mode: multiply;
    }
    .curio-door-header.is-dark .curio-door-illo-hero {
      background: var(--curio-navy-deep);
      border-bottom-color: rgba(243,237,225,0.16);
    }
    .curio-door-header.is-dark .curio-door-illo-hero img {
      mix-blend-mode: screen;
      opacity: 0.92;
    }
    /* Door header text below hero illo */
    .curio-door-header-text {
      max-width: 1180px;
      margin: 0 auto;
      padding: 56px 28px 24px;
    }
    .curio-door-header.is-dark .curio-door-header-text {
      max-width: 1180px;
      margin: 0 auto;
      padding: 56px 28px 24px;
    }
    .curio-door-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--curio-rust);
      text-decoration: none;
      margin-bottom: 32px;
      transition: color 0.2s, transform 0.2s;
    }
    .curio-door-back:hover { color: var(--curio-ink); transform: translateX(-3px); }
    .curio-door-header.is-dark .curio-door-back { color: var(--curio-amber-2); }
    .curio-door-header.is-dark .curio-door-back:hover { color: var(--curio-cream); }

    .curio-door-eyebrow {
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--curio-rust);
      margin-bottom: 16px;
    }
    .curio-door-header.is-dark .curio-door-eyebrow { color: var(--curio-amber-2); }
    .curio-door-title {
      font-family: var(--curio-serif);
      font-weight: 300;
      font-style: italic;
      font-size: clamp(56px, 9vw, 120px);
      line-height: 0.95;
      letter-spacing: -0.025em;
      margin: 0 0 18px;
      color: var(--curio-ink);
    }
    .curio-door-header.is-dark .curio-door-title { color: var(--curio-cream); }
    .curio-door-for {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: clamp(17px, 1.8vw, 22px);
      color: var(--curio-ink-soft);
      margin: 0 0 8px;
      max-width: 56ch;
    }
    .curio-door-header.is-dark .curio-door-for { color: rgba(243,237,225,0.72); }

    .curio-prose-dark {
      font-family: var(--curio-serif);
      font-weight: 400;
      font-size: clamp(17px, 1.7vw, 20px);
      line-height: 1.55;
      color: rgba(243,237,225,0.85);
      margin: 0 0 32px;
      max-width: 60ch;
    }
    .curio-prose-dark strong { color: var(--curio-cream); font-weight: 700; }
    .curio-prose-dark em { color: var(--curio-amber-2); font-style: italic; }
    .curio-mindset-page {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
      max-width: none;
      padding-left: 0;
      padding-right: 0;
    }
    .curio-mindset-page > * {
      max-width: 1180px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 28px;
      padding-right: 28px;
    }
    .curio-mindset-page .curio-laneshift-q {
      color: var(--curio-cream);
    }
    .curio-mindset-page .curio-laneshift-a em {
      color: var(--curio-amber-2);
    }
    .curio-mindset-page .curio-laneshift-rule {
      background: var(--curio-amber-2);
    }
    .curio-mindset-page .curio-laneshift-prompt {
      color: rgba(243,237,225,0.55);
    }
    .curio-mindset-page .curio-laneshift-prompt strong {
      color: var(--curio-cream);
    }

    .curio-why { background: var(--curio-cream); }

    .curio-price-link {
      display: flex;
      flex-direction: column;
      height: 100%;
      text-decoration: none;
      color: inherit;
    }

    /* ── Catalog cards (the 14 free reads) ───────────────────────────── */
    .curio-catalog { background: var(--curio-cream); }
    .curio-catalog.is-dark {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
      max-width: none;
      padding-left: 0;
      padding-right: 0;
    }
    .curio-catalog.is-dark > * {
      max-width: 1180px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 28px;
      padding-right: 28px;
    }
    .curio-cat-reveal {
      margin-top: 12px;
      background: transparent;
      border: 1px solid var(--curio-rust);
      color: var(--curio-rust);
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
      transition: background 0.2s, color 0.2s;
    }
    .curio-cat-reveal:hover { background: var(--curio-rust); color: var(--curio-cream); }
    .curio-catalog.is-dark .curio-cat-reveal {
      border-color: var(--curio-amber-2);
      color: var(--curio-amber-2);
    }
    .curio-catalog.is-dark .curio-cat-reveal:hover {
      background: var(--curio-amber-2);
      color: var(--curio-ink);
    }

    .curio-cat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 32px;
    }
    @media (max-width: 760px) { .curio-cat-grid { grid-template-columns: 1fr; } }

    .curio-cat-card {
      background: var(--curio-paper);
      border: 1px solid var(--curio-rule);
      padding: 24px 24px 18px;
      display: flex;
      flex-direction: column;
      transition: border-color 0.2s, transform 0.2s;
    }
    .curio-cat-card:hover { border-color: var(--curio-rust); }
    .curio-cat-card.is-dark {
      background: rgba(243,237,225,0.04);
      border-color: rgba(243,237,225,0.16);
    }
    .curio-cat-card.is-dark:hover { border-color: var(--curio-amber-2); }

    .curio-cat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }
    .curio-cat-icon { font-size: 22px; line-height: 1; }
    .curio-cat-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .curio-cat-tag {
      font-family: var(--curio-mono);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 3px 7px;
      border: 1px solid var(--curio-rule);
      color: var(--curio-muted);
    }
    .curio-cat-card.is-dark .curio-cat-tag {
      border-color: rgba(243,237,225,0.18);
      color: rgba(243,237,225,0.6);
    }
    .curio-cat-tag-type { color: var(--curio-rust); border-color: rgba(168,69,58,0.4); }
    .curio-cat-card.is-dark .curio-cat-tag-type {
      color: var(--curio-amber-2);
      border-color: rgba(224,138,43,0.5);
    }

    .curio-cat-title {
      font-family: var(--curio-serif);
      font-weight: 700;
      font-size: 22px;
      line-height: 1.15;
      margin: 0 0 8px;
      color: var(--curio-ink);
    }
    .curio-cat-card.is-dark .curio-cat-title { color: var(--curio-cream); }
    .curio-cat-hook {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 15px;
      line-height: 1.5;
      color: var(--curio-ink-soft);
      margin: 0 0 12px;
    }
    .curio-cat-card.is-dark .curio-cat-hook { color: rgba(243,237,225,0.78); }

    .curio-cat-body {
      overflow: hidden;
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--curio-rule);
    }
    .curio-cat-card.is-dark .curio-cat-body {
      border-top-color: rgba(243,237,225,0.18);
    }
    .curio-cat-p {
      font-size: 14px;
      line-height: 1.65;
      color: var(--curio-ink-soft);
      margin: 0 0 12px;
    }
    .curio-cat-card.is-dark .curio-cat-p { color: rgba(243,237,225,0.85); }
    .curio-cat-takeaway {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 16px;
      line-height: 1.5;
      color: var(--curio-rust);
      padding: 14px 16px;
      border-left: 3px solid var(--curio-rust);
      background: rgba(168,69,58,0.04);
      margin: 16px 0;
    }
    .curio-cat-card.is-dark .curio-cat-takeaway {
      color: var(--curio-amber-2);
      border-left-color: var(--curio-amber-2);
      background: rgba(224,138,43,0.06);
    }
    .curio-cat-prompts-label {
      font-family: var(--curio-mono);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--curio-muted);
      margin: 12px 0 8px;
    }
    .curio-cat-card.is-dark .curio-cat-prompts-label { color: rgba(243,237,225,0.55); }
    .curio-cat-prompt {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 13px;
      line-height: 1.5;
      color: var(--curio-ink);
      padding: 10px 12px;
      background: var(--curio-cream-2);
      border: 1px dashed var(--curio-rule);
      margin-bottom: 6px;
    }
    .curio-cat-card.is-dark .curio-cat-prompt {
      color: var(--curio-cream);
      background: rgba(243,237,225,0.04);
      border-color: rgba(243,237,225,0.16);
    }

    .curio-cat-toggle {
      margin-top: 14px;
      align-self: flex-start;
      background: transparent;
      border: none;
      padding: 0;
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--curio-rust);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: color 0.2s;
    }
    .curio-cat-toggle:hover { color: var(--curio-ink); }
    .curio-cat-card.is-dark .curio-cat-toggle { color: var(--curio-amber-2); }
    .curio-cat-card.is-dark .curio-cat-toggle:hover { color: var(--curio-cream); }
    .curio-cat-arrow { display: inline-block; transition: transform 0.2s; }
    .curio-cat-arrow.is-up { transform: rotate(180deg); }

    /* ── Subtle parenthetical line ──────────────────────────────────── */
    .curio-subtle {
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 16px;
      line-height: 1.5;
      color: var(--curio-muted);
      margin: -14px 0 24px;
      max-width: 60ch;
    }

    /* ── The Brain (chat) ────────────────────────────────────────────── */
    .curio-brain {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
      max-width: none;
      padding-left: 0;
      padding-right: 0;
    }
    .curio-brain > * {
      max-width: 1180px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 28px;
      padding-right: 28px;
    }
    .curio-h3-dark { color: var(--curio-cream); }
    .curio-mono-dim { color: rgba(243,237,225,0.5); margin-bottom: 4px; }
    .curio-hub .curio-mono-dim { color: var(--curio-rust); }

    .curio-chat-history {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 16px auto 24px;
    }
    .curio-chat-msg {
      max-width: 720px;
      padding: 18px 22px;
      border: 1px solid rgba(243,237,225,0.16);
      background: rgba(243,237,225,0.04);
    }
    .curio-chat-you {
      align-self: flex-end;
      border-color: rgba(224,138,43,0.5);
      background: rgba(224,138,43,0.06);
    }
    .curio-chat-tag {
      font-family: var(--curio-mono);
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--curio-amber-2);
      margin-bottom: 8px;
    }
    .curio-chat-you .curio-chat-tag { color: var(--curio-amber); }
    .curio-chat-text {
      font-family: var(--curio-serif);
      font-size: 16px;
      line-height: 1.55;
      color: var(--curio-cream);
    }
    .curio-chat-typing {
      color: rgba(243,237,225,0.55);
      font-style: italic;
    }

    .curio-chat-input-block {
      display: flex;
      gap: 0;
      max-width: 720px;
      margin: 16px auto 0;
      border: 1px solid rgba(243,237,225,0.3);
      background: rgba(243,237,225,0.03);
    }
    .curio-chat-input-block:focus-within {
      border-color: var(--curio-amber-2);
      background: rgba(224,138,43,0.04);
    }
    .curio-chat-input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 16px 20px;
      color: var(--curio-cream);
      font-family: var(--curio-serif);
      font-size: 17px;
      outline: none;
    }
    .curio-chat-input::placeholder { color: rgba(243,237,225,0.4); font-style: italic; }
    .curio-chat-send {
      background: var(--curio-amber-2);
      color: var(--curio-ink);
      border: none;
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 0 22px;
      cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
    }
    .curio-chat-send:hover:not(:disabled) { background: var(--curio-amber); }
    .curio-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

    .curio-chat-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      max-width: 720px;
      margin: 18px auto 0;
      align-items: center;
    }
    .curio-chat-chip {
      background: transparent;
      border: 1px solid rgba(243,237,225,0.22);
      color: rgba(243,237,225,0.78);
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 14px;
      padding: 8px 14px;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .curio-chat-chip:hover {
      border-color: var(--curio-amber-2);
      color: var(--curio-amber-2);
      background: rgba(224,138,43,0.05);
    }

    .curio-gate {
      max-width: 720px;
      margin: 36px auto 0;
      border-top: 1px solid rgba(243,237,225,0.18);
      padding-top: 32px;
    }
    .curio-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      padding: 14px 22px;
      background: var(--curio-amber-2);
      color: var(--curio-ink);
      font-family: var(--curio-mono);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-decoration: none;
      transition: background 0.15s, transform 0.15s;
    }
    .curio-cta:hover { background: var(--curio-amber); transform: translateX(2px); }

    /* ── Live Builds ─────────────────────────────────────────────────── */
    .curio-builds { background: var(--curio-cream); }
    .curio-build-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin-top: 36px;
    }
    @media (max-width: 900px) { .curio-build-grid { grid-template-columns: 1fr; } }
    .curio-build {
      background: var(--curio-paper);
      border: 1px solid var(--curio-rule);
      padding: 28px 26px 26px;
      display: flex;
      flex-direction: column;
      transition: border-color 0.2s;
    }
    .curio-build:hover { border-color: var(--curio-rust); }
    .curio-build-num {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--curio-rust);
      margin-bottom: 14px;
    }
    .curio-build-num span { color: var(--curio-muted); }
    .curio-build-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: 22px;
      line-height: 1.2;
      margin: 0 0 12px;
      color: var(--curio-ink);
    }
    .curio-build-what {
      font-size: 14px;
      line-height: 1.6;
      color: var(--curio-ink-soft);
      margin: 0 0 24px;
      flex: 1;
    }
    .curio-build-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      align-self: flex-start;
      padding: 10px 16px;
      background: var(--curio-ink);
      color: var(--curio-cream);
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-decoration: none;
      transition: background 0.15s, transform 0.15s;
    }
    .curio-build-cta:hover { background: var(--curio-rust); transform: translateX(2px); }
    .curio-build-private {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--curio-muted);
      padding-top: 12px;
      border-top: 1px dashed var(--curio-rule);
    }

    /* ── The Range ───────────────────────────────────────────────────── */
    .curio-range { background: var(--curio-cream-2); }
    .curio-range-table {
      margin-top: 28px;
      border-top: 1px solid var(--curio-rule);
    }
    .curio-range-row {
      display: grid;
      grid-template-columns: 50px 24% 1fr 22%;
      gap: 18px;
      padding: 18px 0;
      border-bottom: 1px solid var(--curio-rule);
      align-items: baseline;
    }
    @media (max-width: 760px) {
      .curio-range-row {
        grid-template-columns: 36px 1fr;
        gap: 8px 14px;
      }
      .curio-range-output, .curio-range-where {
        grid-column: 2 / 3;
      }
    }
    .curio-range-num {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--curio-rust);
      font-weight: 700;
    }
    .curio-range-name {
      font-family: var(--curio-serif);
      font-weight: 700;
      font-size: 16px;
      color: var(--curio-ink);
    }
    .curio-range-output {
      font-size: 14px;
      line-height: 1.55;
      color: var(--curio-ink-soft);
    }
    .curio-range-where {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--curio-rust);
    }

    /* ── Why Curio sub-headers (depth / breadth) ─────────────────────── */
    .curio-why-subhead {
      display: flex;
      align-items: baseline;
      gap: 14px;
      margin: 56px 0 22px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--curio-rule);
    }
    .curio-why-subhead-second { margin-top: 80px; }
    .curio-why-tag {
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--curio-rust);
      padding: 4px 8px;
      border: 1px solid var(--curio-rust);
      border-radius: 2px;
    }
    .curio-why-sub {
      font-family: 'Fraunces', serif;
      font-style: italic;
      font-size: 22px;
      color: var(--curio-ink);
    }
    .curio-why-close {
      margin-top: 56px;
      padding-top: 28px;
      border-top: 1px solid var(--curio-rule);
      font-style: italic;
      color: var(--curio-ink-soft);
    }

    /* ── Bridge Close (end-of-door, points to next door) ─────────────── */
    .curio-bridge {
      background: var(--curio-cream-2);
      text-align: center;
      padding-top: 64px;
      padding-bottom: 64px;
    }
    .curio-bridge-text {
      max-width: 640px;
      margin: 18px auto 28px;
      font-size: 17px;
      line-height: 1.55;
      color: var(--curio-ink-soft);
    }
    .curio-bridge-text em {
      font-family: 'Fraunces', serif;
      font-style: italic;
      color: var(--curio-ink);
    }
    .curio-bridge-quote {
      color: var(--curio-rust);
      font-style: italic;
    }
    .curio-bridge-cta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 12px 22px;
      background: var(--curio-ink);
      color: var(--curio-cream);
      font-family: var(--curio-mono);
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 2px;
      transition: transform 0.2s, background 0.2s;
    }
    .curio-bridge-cta:hover {
      background: var(--curio-rust);
      transform: translateX(3px);
    }

    /* ── Mark "by" attribution (small italic next to Curio wordmark) ── */
    .curio-mark-by {
      font-family: 'Fraunces', serif;
      font-style: italic;
      font-weight: 400;
      font-size: 12px;
      color: var(--curio-muted);
      margin-left: 4px;
      letter-spacing: 0;
      text-transform: none;
    }
    .curio-cold .curio-mark-by { color: rgba(243, 237, 225, 0.5); }
    .curio-cold-warm .curio-mark-by { color: rgba(243, 237, 225, 0.55); }

    /* ── Essays block (Substack links — magazine spread feel) ────────── */
    .curio-essays { background: var(--curio-paper); }
    .curio-essays.is-dark { background: var(--curio-navy-deep); }
    .curio-essay-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0;
      margin-top: 36px;
      border-top: 1px solid var(--curio-rule);
    }
    .curio-essays.is-dark .curio-essay-grid { border-top-color: rgba(243, 237, 225, 0.18); }
    .curio-essay {
      display: grid;
      grid-template-columns: 56px 1fr 36px;
      align-items: center;
      gap: 18px;
      padding: 22px 4px;
      border-bottom: 1px solid var(--curio-rule);
      text-decoration: none;
      color: var(--curio-ink);
      transition: background 0.2s, transform 0.2s, padding-left 0.2s;
    }
    .curio-essays.is-dark .curio-essay {
      color: var(--curio-cream);
      border-bottom-color: rgba(243, 237, 225, 0.18);
    }
    .curio-essay:hover {
      background: var(--curio-cream);
      padding-left: 14px;
    }
    .curio-essays.is-dark .curio-essay:hover { background: rgba(243, 237, 225, 0.04); }
    .curio-essay-num {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--curio-rust);
    }
    .curio-essays.is-dark .curio-essay-num { color: var(--curio-amber-2); }
    .curio-essay-body { min-width: 0; }
    .curio-essay-title {
      font-family: 'Fraunces', serif;
      font-style: italic;
      font-weight: 500;
      font-size: clamp(18px, 1.8vw, 22px);
      line-height: 1.25;
      margin-bottom: 4px;
    }
    .curio-essay-sub {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: var(--curio-ink-soft);
      line-height: 1.45;
    }
    .curio-essays.is-dark .curio-essay-sub { color: rgba(243, 237, 225, 0.62); }
    .curio-essay-arrow {
      font-family: var(--curio-mono);
      font-size: 16px;
      color: var(--curio-muted);
      text-align: right;
      transition: color 0.2s, transform 0.2s;
    }
    .curio-essay:hover .curio-essay-arrow {
      color: var(--curio-rust);
      transform: translate(2px, -2px);
    }
    .curio-essays.is-dark .curio-essay:hover .curio-essay-arrow { color: var(--curio-amber-2); }

    /* ── Wall tie (each door names the wall it answers) ──────────────── */
    .curio-wall-tie {
      font-family: var(--curio-mono);
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--curio-muted);
      padding: 12px 16px;
      border-left: 2px solid var(--curio-rust);
      background: rgba(168, 69, 58, 0.04);
      margin-bottom: 28px;
      max-width: 640px;
    }
    .curio-wall-tie em {
      font-style: italic;
      text-transform: none;
      letter-spacing: 0.02em;
      color: var(--curio-ink);
      font-family: 'Fraunces', serif;
      font-size: 14px;
    }
    .curio-wall-tie-dark {
      color: rgba(243, 237, 225, 0.55);
      border-left-color: var(--curio-amber-2);
      background: rgba(212, 157, 58, 0.06);
    }
    .curio-wall-tie-dark em {
      color: var(--curio-cream);
    }

    /* ── Why-section dark variant (Mindset door) ─────────────────────── */
    .curio-why-dark {
      background: var(--curio-navy-deep);
      color: var(--curio-cream);
    }
    .curio-why-dark .curio-eyebrow { color: var(--curio-amber-2); }
    .curio-why-dark .curio-prose-dark { color: rgba(243, 237, 225, 0.78); }

    /* ── Build cards, dark variant (Mindset only) ────────────────────── */
    .curio-build-dark {
      background: rgba(243, 237, 225, 0.04);
      border-color: rgba(243, 237, 225, 0.18);
      color: var(--curio-cream);
    }
    .curio-build-dark:hover { border-color: var(--curio-amber-2); }
    .curio-build-dark .curio-build-num { color: rgba(243, 237, 225, 0.6); }
    .curio-build-dark .curio-build-num span { color: var(--curio-amber-2); }
    .curio-build-dark .curio-build-name { color: var(--curio-cream); }
    .curio-build-dark .curio-build-what { color: rgba(243, 237, 225, 0.74); }
    .curio-build-dark .curio-build-cta {
      background: var(--curio-amber-2);
      color: var(--curio-ink);
    }
    .curio-build-dark .curio-build-cta:hover {
      background: var(--curio-amber);
    }
    .curio-build-dark .curio-build-private {
      color: rgba(243, 237, 225, 0.5);
    }

    /* ── Wall → Door tag (each wall points to its answering door) ────── */
    .curio-wall-door {
      display: inline-block;
      margin-left: 8px;
      padding: 2px 8px;
      font-family: var(--curio-mono);
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--curio-amber-2);
      background: rgba(212, 157, 58, 0.12);
      border: 1px solid rgba(212, 157, 58, 0.3);
      border-radius: 2px;
      vertical-align: middle;
    }

    /* ── The Price ───────────────────────────────────────────────────── */
    .curio-price { background: var(--curio-paper); }
    .curio-price-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-top: 36px;
    }
    @media (max-width: 1100px) { .curio-price-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .curio-price-grid { grid-template-columns: 1fr; } }
    .curio-price-tier {
      background: var(--curio-cream);
      border: 1px solid var(--curio-rule);
      padding: 26px 22px 22px;
      display: flex;
      flex-direction: column;
    }
    .curio-price-tier.is-featured {
      background: var(--curio-ink);
      color: var(--curio-cream);
      border-color: var(--curio-ink);
    }
    .curio-price-tag {
      font-family: var(--curio-mono);
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--curio-rust);
      margin-bottom: 14px;
    }
    .is-featured .curio-price-tag { color: var(--curio-amber-2); }
    .curio-price-name {
      font-family: var(--curio-serif);
      font-weight: 600;
      font-size: 24px;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .curio-price-num {
      font-family: var(--curio-serif);
      font-style: italic;
      font-weight: 400;
      font-size: 22px;
      color: var(--curio-rust);
      margin-bottom: 16px;
    }
    .is-featured .curio-price-num { color: var(--curio-amber-2); }
    .curio-price-desc {
      font-size: 13px;
      line-height: 1.55;
      color: var(--curio-ink-soft);
      margin: 0 0 22px;
      flex: 1;
    }
    .is-featured .curio-price-desc { color: rgba(243,237,225,0.78); }
    .curio-price-cta {
      align-self: flex-start;
      background: transparent;
      border: 1px solid var(--curio-ink);
      color: var(--curio-ink);
      font-family: var(--curio-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .curio-price-cta:hover {
      background: var(--curio-ink);
      color: var(--curio-cream);
    }
    .is-featured .curio-price-cta {
      border-color: var(--curio-amber-2);
      color: var(--curio-amber-2);
    }
    .is-featured .curio-price-cta:hover {
      background: var(--curio-amber-2);
      color: var(--curio-ink);
    }
    .curio-price-aside {
      margin-top: 32px;
      font-family: var(--curio-serif);
      font-style: italic;
      font-size: 14px;
      color: var(--curio-muted);
      max-width: 60ch;
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
