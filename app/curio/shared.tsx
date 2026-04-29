"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ───────────────────────────────────────────────────────────────────────────
// Shared module for Curio (home + the four door routes).
// Persona localStorage, the shift block, the price ladder, the styles.
// ───────────────────────────────────────────────────────────────────────────

export type Persona = 'self' | 'team';

const PERSONA_KEY = 'curio-persona';

export const getPersona = (): Persona | null => {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(PERSONA_KEY);
  return v === 'self' || v === 'team' ? v : null;
};

export const setStoredPersona = (p: Persona) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PERSONA_KEY, p);
};

/** Hook used by door pages: read persona, redirect home if missing. */
export const usePersonaOrRedirect = (): Persona | null => {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  useEffect(() => {
    const p = getPersona();
    if (!p) {
      router.replace('/curio');
      return;
    }
    setPersona(p);
  }, [router]);
  return persona;
};

// ─── The Shift block (used at the top of each door page) ───────────────────
// question is optional — pass "" to skip the setup line and lead with the answer.
export const LaneShift = ({
  question,
  answer,
  prompt,
  punch,
}: {
  question?: string;
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
    {question ? <div className="curio-laneshift-q">{question}</div> : null}
    <div className="curio-laneshift-a"><em>{answer}</em></div>
    <div className="curio-laneshift-rule" />
    <div className="curio-laneshift-prompt">
      <span>{prompt}</span> <strong>{punch}</strong>
    </div>
  </motion.div>
);

// ─── Door Header (used on each door page) ──────────────────────────────────
// Hero illustration is BIG — full-bleed at the top of the page.
export const DoorHeader = ({
  num,
  name,
  forText,
  illo,
  dark,
}: {
  num: string;
  name: string;
  forText: string;
  illo: string;
  dark?: boolean;
}) => (
  <header className={`curio-door-header ${dark ? 'is-dark' : ''}`}>
    <div className="curio-door-illo-hero">
      <img src={illo} alt="" aria-hidden />
    </div>
    <div className="curio-door-header-text">
      <Link href="/curio" className="curio-door-back" prefetch>
        <span>&larr;</span>
        <span>back to the wheel</span>
      </Link>
      <div className="curio-door-eyebrow">door {num} &middot; one of four</div>
      <h1 className="curio-door-title">{name}</h1>
      <p className="curio-door-for">{forText}</p>
    </div>
  </header>
);

// ─── The Price Block (shared across door pages) ────────────────────────────
export const PriceBlock = () => {
  const tiers = [
    {
      tag: 'free',
      name: 'The Talk',
      price: '$0',
      desc: 'The chat at the wheel. Four turns, calibrated. No email, no upsell sequence.',
      cta: 'go talk',
      featured: false,
      href: '/curio',
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
      desc: 'The institutional version. Custom Curiosity Catalog tuned to your team’s belief mix, role coverage, and rollout plan.',
      cta: 'book leadership intake',
      featured: false,
    },
  ];

  return (
    <section className="curio-section curio-price">
      <div className="curio-eyebrow">how can I help?</div>
      <h2 className="curio-h2">Four rungs.</h2>
      <p className="curio-prose">
        Same DNA at every rung. The free chat at the wheel is the demo. The Bespoke is the book-of-record. The Catalog is the institutional version.
      </p>
      <div className="curio-price-grid">
        {tiers.map((t, i) => {
          const inner = (
            <>
              <div className="curio-price-tag">{t.tag}</div>
              <div className="curio-price-name">{t.name}</div>
              <div className="curio-price-num">{t.price}</div>
              <p className="curio-price-desc">{t.desc}</p>
              <span className="curio-price-cta">{t.cta}</span>
            </>
          );
          return (
            <motion.div
              key={i}
              className={`curio-price-tier ${t.featured ? 'is-featured' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              {t.href ? <a href={t.href} className="curio-price-link">{inner}</a> : inner}
            </motion.div>
          );
        })}
      </div>
      <p className="curio-price-aside">
        There&rsquo;s a fifth tier &mdash; the Vision Sprint &mdash; for full strategic engagements at $25k+. Inbound only, no public price.
      </p>
    </section>
  );
};

// ─── Why Curio (the proof / trust section — three builds + twelve channels combined) ──
// This is the transition to pay-me. Trust frame: I've built this already, across a lot
// of needs, at three scales. Then we show. No "I've shipped this three times" — let the
// reader conclude the credibility for themselves.
export const WhyCurio = ({ children }: { children?: React.ReactNode }) => {
  const channels: [string, string, string][] = [
    ['Claude Design / primers', 'Three vision-transfer artifacts (this is one)', 'curio'],
    ['Long-form fiction', 'Gift.Script — a 340-page published novel', 'amazon'],
    ['Editorial / data viz', "The Ladder That Isn't — journalist-cited dashboard", 'ladder-mu.vercel.app'],
    ['Operational / MCP', 'Claude × MCP × Excel/Asana/NetSuite → ~$433K surfaced', 'redpeg internal'],
    ['Team enablement', 'RedPeg Curiosity Catalog → 75% utilization in 4 weeks', 'curiosity catalog'],
    ['SaaS / web apps', 'Style Sync — multi-API moodboard tool, live', 'style-sync-eight.vercel.app'],
    ['Brand systems', 'RedPeg Brand Bible 2026 — 24-page navigable HTML', 'pdf'],
    ['Physical products', 'Lantern & Fox — D2C heirloom kit + AI story engine', 'lanternandfox.com'],
    ['Long-form essays', '"The Employee Is The Audience," and others', 'ryanoconnor.design'],
    ['3D CAD / fabrication', 'Send Cut Send token tests for the Lantern kit', 'in production'],
    ['Brain systems', '3,346-conversation indexed Brain', 'private'],
    ['Creative direction', '20 years across Nike, Meta, Faraday, Santander', 'redpeg portfolio'],
  ];

  return (
    <section className="curio-section curio-why">
      <div className="curio-eyebrow">the work</div>
      <h2 className="curio-h2">
        Three builds. <em>Twelve channels.</em>
      </h2>
      <p className="curio-prose">
        Curio isn&rsquo;t here because I&rsquo;m an AI consultant. It&rsquo;s here because I&rsquo;ve already built this &mdash; at three scales, across about twelve different kinds of work. Open any of it.
      </p>

      {/* Three builds, three scales — depth (same artifact, repeated) */}
      <div className="curio-why-subhead">
        <span className="curio-why-tag">depth</span>
        <span className="curio-why-sub">three builds, three scales</span>
      </div>
      <div className="curio-build-grid">
        <div className="curio-build">
          <div className="curio-build-num">01 &middot; <span>personal</span></div>
          <h3 className="curio-build-name">My Brain</h3>
          <p className="curio-build-what">
            A working second brain across 3,346 indexed conversations. Daily briefings, weekly digests, custom skills firing on triggers. The system that produced everything below.
          </p>
          <div className="curio-build-private">private &mdash; the output is everything on this site</div>
        </div>
        <div className="curio-build">
          <div className="curio-build-num">02 &middot; <span>institutional</span></div>
          <h3 className="curio-build-name">RedPeg AI Curiosity Catalog</h3>
          <p className="curio-build-what">
            The 40-person agency version. Fourteen entry points by belief system. 75% Claude utilization in 4 weeks. ~$433K in cost-recovery questions surfaced via Claude + MCP.
          </p>
          <a href="https://red-peg-curiosity-catalog.vercel.app/" target="_blank" rel="noopener noreferrer" className="curio-build-cta">
            <span>open the build</span><span>&#8599;</span>
          </a>
        </div>
        <div className="curio-build">
          <div className="curio-build-num">03 &middot; <span>one-for-one</span></div>
          <h3 className="curio-build-name">A Primer for John</h3>
          <p className="curio-build-what">
            A former colleague, eighteen months out of agency life. Ten chapters tuned to his exact career shape. Built in one working day. The next one takes 2&ndash;3 hours.
          </p>
          <a href="https://claude-onboarding-kohl.vercel.app/" target="_blank" rel="noopener noreferrer" className="curio-build-cta">
            <span>open the build</span><span>&#8599;</span>
          </a>
        </div>
      </div>

      {/* Twelve channels — breadth (same mind, across) */}
      <div className="curio-why-subhead curio-why-subhead-second">
        <span className="curio-why-tag">breadth</span>
        <span className="curio-why-sub">twelve channels, one mind</span>
      </div>
      <div className="curio-range-table">
        {channels.map(([name, output, where], i) => (
          <motion.div
            key={i}
            className="curio-range-row"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="curio-range-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="curio-range-name">{name}</div>
            <div className="curio-range-output">{output}</div>
            <div className="curio-range-where">{where}</div>
          </motion.div>
        ))}
      </div>

      <p className="curio-prose curio-why-close">
        That&rsquo;s the work. If a piece of this is the kind of thinking you want &mdash; for yourself, or for your team &mdash; here&rsquo;s how we start.
      </p>

      {children}
    </section>
  );
};

// ─── WhatWorks — kept as alias of WhyCurio for back-compat with door pages.
// The combined section above replaces both. Door pages calling WhatWorks now
// render an empty fragment; remove the WhatWorks call once each door page is updated.
export const WhatWorks = () => null;

// ─── Essays (deeper Curio writing — Substack links) ────────────────────────
// Same set on every door for v1. Magazine-spread feel, click-out to Substack.
// Each one is a doorway into bigger thinking — not gated, not summarized, just linked.
export const EssaysBlock = ({ dark = false }: { dark?: boolean }) => {
  const essays = [
    {
      title: 'The Contract You Didn’t Know You Signed',
      sub: 'Why thirty years of software conditioning is the real barrier to AI adoption.',
      href: 'https://curioco.substack.com/p/the-contract-you-didnt-know-you-signed',
    },
    {
      title: 'Waiting for Humans',
      sub: 'On what AI can’t do yet, and why that’s still the real story.',
      href: 'https://curioco.substack.com/p/waiting-for-humans',
    },
    {
      title: 'The Employee Is the Audience Nobody Is Building For',
      sub: 'B2E is the empty lane in experiential. That signal deserves a builder, not a vendor.',
      href: 'https://curioco.substack.com/p/the-employee-is-the-audience-nobody',
    },
    {
      title: 'New Frontiers — The Staff You Never Hired',
      sub: 'AI doesn’t automate work. It hires staff you never had budget for.',
      href: 'https://curioco.substack.com/p/new-frontiers-the-staff-you-never',
    },
    {
      title: 'Welcome to Curio — Speculative Thinking',
      sub: 'The opening note. What this Substack is for, and what it isn’t.',
      href: 'https://curioco.substack.com/p/welcome-to-curio-speculative-thinking',
    },
    {
      title: 'Lantern & Fox — a case study in speculative thinking',
      sub: 'A D2C heirloom kit and an AI story engine. The brand built while figuring out what AI is for.',
      href: 'https://substack.com/@ryanoconnor618637',
    },
  ];

  return (
    <section className={`curio-section curio-essays ${dark ? 'is-dark' : ''}`}>
      <div className="curio-eyebrow curio-eyebrow-amber">read deeper</div>
      <h2 className={`curio-h2 ${dark ? 'curio-h2-dark' : ''}`}>
        Essays from the <em>Curio Substack.</em>
      </h2>
      <p className={`curio-prose ${dark ? 'curio-prose-dark' : ''}`}>
        Speculative thinking, written long. The leadership / intellectual side of the work that informs every artifact on this page.
      </p>
      <div className="curio-essay-grid">
        {essays.map((e, i) => (
          <motion.a
            key={i}
            href={e.href}
            target="_blank"
            rel="noopener noreferrer"
            className="curio-essay"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <div className="curio-essay-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">{e.title}</div>
              <div className="curio-essay-sub">{e.sub}</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

// ─── Bridge Close (end of each door — points to the next door) ─────────────
// "I'm in the right place" payoff + "I should check the next one too" thread.
// Each door is complete on its own AND opens the next one.
export const BridgeClose = ({
  fromDoor,
  toDoor,
  toHref,
  ifLine,
}: {
  fromDoor: string; // current door name (e.g., "Vision")
  toDoor: string;   // next door name (e.g., "Filter")
  toHref: string;   // route (e.g., "/curio/filter")
  ifLine: string;   // the "if X lands harder" line in their voice
}) => (
  <section className="curio-section curio-bridge">
    <div className="curio-eyebrow">one of four</div>
    <p className="curio-bridge-text">
      <em>{fromDoor}</em> is one of four doors. If <span className="curio-bridge-quote">&ldquo;{ifLine}&rdquo;</span> lands harder right now, that&rsquo;s the next one.
    </p>
    <Link href={toHref} prefetch className="curio-bridge-cta">
      <span>&rarr; {toDoor}</span>
    </Link>
  </section>
);

// ─── Footer (shared) ───────────────────────────────────────────────────────
export const CurioFooter = () => (
  <footer className="curio-footer">
    <div>Curio Studio &middot; Ryan O&rsquo;Connor</div>
    <div className="curio-mono">hidden &middot; v0.5 &middot; not in nav</div>
  </footer>
);
