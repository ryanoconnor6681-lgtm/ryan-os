"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LaneShift, DoorHeader, PriceBlock, BridgeClose, CurioFooter, usePersonaOrRedirect } from '../shared';

export default function CurioMindsetPage() {
  const persona = usePersonaOrRedirect();
  if (!persona) return null;

  return (
    <main className="curio-root curio-door curio-door-mindset">
      <DoorHeader
        dark
        num="03"
        name="Mindset"
        forText={persona === 'team' ? 'Your team isn’t behind. They’re using a colleague like a search bar. That’s the only shift.' : 'You haven’t been doing it wrong. You’ve been using it like a calculator when it wants to be a colleague.'}
        illo="/images/curio/frontiers/hand-brain.jpeg"
      />

      <section className="curio-section curio-mindset-page">
        <div className="curio-wall-tie curio-wall-tie-dark">
          this door answers the wall: <em>&ldquo;some day I&rsquo;ll be good at AI.&rdquo;</em>
        </div>

        <LaneShift
          question={persona === 'team' ? 'The team plateau isn’t a skill problem.' : 'The plateau isn’t a skill problem.'}
          answer={persona === 'team' ? 'It’s a permission problem.' : 'It’s a question problem.'}
          prompt={persona === 'team' ? 'Stop scoping a project.' : 'Stop acting like this is software.'}
          punch={persona === 'team' ? 'Make the bigger ask visible.' : 'Ask what you wish. Or tell it what you hate.'}
        />

        {persona === 'self' ? (
          <>
            <p className="curio-prose-dark">
              You learned the prompts. You save time on email. You built a few good habits. And then nothing &mdash; same job, same outputs, same ceiling. You suspect you should be further along by now and you can&rsquo;t figure out why.
            </p>
            <p className="curio-prose-dark">
              Here&rsquo;s the part to keep: the plateau isn&rsquo;t a skill problem. It&rsquo;s a <strong>question problem</strong>. You&rsquo;re still asking AI to do tasks faster &mdash; the kind of tasks you already knew how to do. The shift is at the other end of the question.
            </p>
            <p className="curio-prose-dark">
              Try the food analogy. Stop planning. Stop scoping. Stop trying to <em>figure out the best way to use it</em>. Get Claude the ingredients &mdash; better yet, point it at the pantry &mdash; and ask it to make you a soufflé. Don&rsquo;t worry how it gets there. (Check the data, check the permissions; that&rsquo;s the only caveat.)
            </p>
            <p className="curio-prose-dark">
              <strong>Tomorrow morning.</strong> Not next Friday. Not next month. Tomorrow. Open Claude and instead of asking <em>&ldquo;help me write this email,&rdquo;</em> say: <em>&ldquo;I wish I had a tool that did X. Build it.&rdquo;</em> Then tell it what to fix. The plateau ends the day you change the question.
            </p>
          </>
        ) : (
          <>
            <p className="curio-prose-dark">
              Half your team is fluent. Half isn&rsquo;t. The gap is widening &mdash; not because some are smarter, but because the fluent half started asking <em>bigger</em> questions. The other half is still asking AI to do tasks faster.
            </p>
            <p className="curio-prose-dark">
              Here&rsquo;s the harder part: the half that isn&rsquo;t asking bigger questions usually <strong>doesn&rsquo;t think they&rsquo;re allowed to.</strong> They&rsquo;re waiting for a training, a permission slip, a manager who tells them <em>&ldquo;yes, ask AI to do that.&rdquo;</em> Most teams stall here for a year.
            </p>
            <p className="curio-prose-dark">
              The teams that move don&rsquo;t train people. They make the bigger ask <em>visible</em>. Someone &mdash; usually one operator at the top &mdash; starts modeling it, every day, in their actual work. The team copies. The plateau ends.
            </p>
          </>
        )}

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
      </section>

      {/* MINDSET — examples (curated: shifts I've made) */}
      <section className="curio-section curio-why curio-why-dark">
        <div className="curio-eyebrow">examples</div>
        <h2 className="curio-h2 curio-h2-dark">
          Shifts <em>I&rsquo;ve already made.</em>
        </h2>
        <p className="curio-prose-dark">
          Each of these came from changing the question. Not from training. Not from a course. From asking what I wished, or what I hated, and handing it to Claude.
        </p>

        <div className="curio-build-grid">
          <ExBuildDark
            n="01"
            tag="my own brain"
            name="The Brain — a polymath’s second brain"
            what="A running second brain across 3,346 indexed conversations. Daily briefings, weekly digests, custom skills firing on triggers. The pattern is Andrej Karpathy’s ‘LLM as operating system’ — externalized, persistent, addressable. For a polymath / neurodivergent operator, this is the shift: not faster work, but coherent work."
          />
          <ExBuildDark
            n="02"
            tag="moodboard, in 60 seconds"
            name="Style Sync"
            what="A working AI moodboard tool for agency creative work. Multi-API, live, functional. The shift: I stopped asking ‘how do I make moodboards faster?’ and asked ‘what if it just made them?’"
            href="https://style-sync-eight.vercel.app/dashboard"
          />
          <ExBuildDark
            n="03"
            tag="brand system as artifact"
            name="RedPeg Brand Bible 2026"
            what="A 24-page navigable HTML brand-doc &mdash; not a deck, not a PDF. The shift: the brand bible itself becomes the proof of the brand."
          />
          <ExBuildDark
            n="04"
            tag="3D, after 30 years on the same tools"
            name="3D CAD + fabrication tests"
            what="Send Cut Send token tests for the Lantern kit. The shift: AI changed how I prototyped physical objects after thirty years of one workflow."
          />
          <ExBuildDark
            n="05"
            tag="creative direction, AI-driven"
            name="Portfolio site (this domain)"
            what="ryanoconnor.design — vibe-coded with Claude. AI chatbot per project. Custom interactions instead of a template. The shift: the portfolio is itself an AI-native artifact."
            href="https://www.ryanoconnor.design"
          />
        </div>

        <div className="curio-essay-grid" style={{ marginTop: 36 }}>
          <a href="https://substack.com/@ryanoconnor618637" target="_blank" rel="noopener noreferrer" className="curio-essay">
            <div className="curio-essay-num">case</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">Lantern &amp; Fox — a case study in speculative thinking</div>
              <div className="curio-essay-sub">A D2C heirloom kit and an AI story engine. The mindset shift made tangible.</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </a>
          <a href="https://curioco.substack.com/p/welcome-to-curio-speculative-thinking" target="_blank" rel="noopener noreferrer" className="curio-essay">
            <div className="curio-essay-num">essay</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">Welcome to Curio — Speculative Thinking</div>
              <div className="curio-essay-sub">The opening note. Why this Substack exists, and what it isn’t.</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </a>
          <a href="https://www.amazon.com/dp/B0FHVR8M97" target="_blank" rel="noopener noreferrer" className="curio-essay">
            <div className="curio-essay-num">novel</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">Gift.Script (a hint)</div>
              <div className="curio-essay-sub">A 340-page novel I never thought I&rsquo;d finish. The biggest mindset shift on this list.</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </a>
        </div>
      </section>

      <PriceBlock />

      <BridgeClose
        fromDoor="Mindset"
        toDoor="Solutions"
        toHref="/curio/solutions"
        ifLine="OK, but I need help building the actual thing"
      />

      <CurioFooter />
    </main>
  );
}

function ExBuildDark({ n, tag, name, what, href, label = 'open' }: {
  n: string; tag: string; name: string; what: string; href?: string; label?: string;
}) {
  return (
    <motion.div
      className="curio-build curio-build-dark"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
    >
      <div className="curio-build-num">{n} &middot; <span>{tag}</span></div>
      <h3 className="curio-build-name">{name}</h3>
      <p className="curio-build-what">{what}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="curio-build-cta">
          <span>{label}</span><span>&#8599;</span>
        </a>
      ) : (
        <div className="curio-build-private">private &mdash; ask for a walk-through</div>
      )}
    </motion.div>
  );
}
