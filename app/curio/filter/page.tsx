"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LaneShift, DoorHeader, PriceBlock, BridgeClose, CurioFooter, usePersonaOrRedirect } from '../shared';

export default function CurioFilterPage() {
  const persona = usePersonaOrRedirect();
  if (!persona) return null;

  return (
    <main className="curio-root curio-door curio-door-filter">
      <DoorHeader
        num="02"
        name="Filter"
        forText={persona === 'team' ? 'Most of what’s reaching your team isn’t AI. It’s noise about AI. Here’s how I sort it.' : 'Most of what’s reaching you isn’t AI. It’s noise about AI. Here’s how I sort it.'}
        illo="/images/curio/frontiers/hourglass.jpeg"
      />

      <section className="curio-section">
        <div className="curio-wall-tie">
          this door answers the wall: <em>&ldquo;I don&rsquo;t have time.&rdquo;</em>
        </div>

        <LaneShift
          question={persona === 'team' ? 'Your team doesn’t need more newsletters.' : 'You can’t out-read the firehose.'}
          answer={persona === 'team' ? 'They need someone who already used the thing.' : 'You need someone who already did.'}
          prompt={persona === 'team' ? 'Stop forwarding what dropped.' : 'Stop asking what’s new.'}
          punch={persona === 'team' ? 'Ask what worked.' : 'Ask what works.'}
        />

        {persona === 'self' ? (
          <>
            <p className="curio-prose">
              The first reason most people don&rsquo;t have time for AI is that they&rsquo;re treating it like every tool that came before. <em>How long did it take you to get good at Excel? At Asana? At Figma, or 3D modeling?</em> Years. Of course you don&rsquo;t have another five years for a new one.
            </p>
            <p className="curio-prose">
              The fallacy is the comparison. Saying <em>&ldquo;I don&rsquo;t have time to learn AI&rdquo;</em> is like saying <em>&ldquo;I don&rsquo;t have time to learn to drive &mdash; I have to keep walking everywhere.&rdquo;</em> The tool <strong>is</strong> the time.
            </p>
            <p className="curio-prose">
              AI is fundamentally different. Claude bends to you. There is no syntax to memorize, no certification, no curriculum. You tell it what&rsquo;s hard and it sorts the firehose. The filter you actually need isn&rsquo;t a smarter newsletter &mdash; it&rsquo;s someone who already used the thing in your kind of work and tells you what stuck. That&rsquo;s the work I do every week, and it&rsquo;s why we moved 75% in four weeks while the rest of the industry was still arguing about training plans.
            </p>
          </>
        ) : (
          <>
            <p className="curio-prose">
              Every newsletter your team subscribes to is someone else&rsquo;s filter &mdash; usually a person summarizing the firehose. That isn&rsquo;t a filter. It&rsquo;s a finer firehose with a friendly voice on top. Your inbox knows.
            </p>
            <p className="curio-prose">
              The reason your team feels overwhelmed isn&rsquo;t volume. It&rsquo;s <strong>hierarchy</strong>. Nobody&rsquo;s done the next move: <em>used the thing, in your kind of work, and reported back what mattered</em>. That&rsquo;s the job. It&rsquo;s why the agency I&rsquo;m at moved to 75% Claude utilization in four weeks while the rest of the industry was still arguing about training plans.
            </p>
            <p className="curio-prose">
              A real filter says <em>&ldquo;ignore that one. this one mattered for us.&rdquo;</em> If a tool, a workflow, or a claim doesn&rsquo;t map to one of the channels below &mdash; you can almost always set it down and come back to it next quarter.
            </p>
          </>
        )}
      </section>

      {/* FILTER — examples (curated: filters in action) */}
      <section className="curio-section curio-why">
        <div className="curio-eyebrow">examples</div>
        <h2 className="curio-h2">
          Filters <em>in action.</em>
        </h2>
        <p className="curio-prose">
          Five real moves I&rsquo;ve made to choose what deserves attention &mdash; mine, my team&rsquo;s, a former colleague&rsquo;s.
        </p>

        <div className="curio-build-grid">
          <ExBuild
            n="01"
            tag="institutional filter"
            name="RedPeg Curiosity Catalog (with curated videos)"
            what="Fourteen belief-system entry points for a 40-person agency. Each entry includes hand-picked AI Edges videos already vetted &mdash; the team doesn&rsquo;t hunt for what&rsquo;s real."
            href="https://red-peg-curiosity-catalog.vercel.app/"
          />
          <ExBuild
            n="02"
            tag="one-for-one filter"
            name="A primer for John"
            what="A former colleague, 18 months out of agency life. Ten chapters tuned to his career shape, with the videos and reading he should actually open first."
            href="https://claude-onboarding-kohl.vercel.app/"
          />
          <ExBuild
            n="03"
            tag="MCP filter"
            name="Claude × MCP × Excel / Asana / NetSuite"
            what="Claude wired through MCP into our actual financial systems. Cross-referenced scoped vs delivered hours and surfaced ~$433K in cost-recovery questions in a single analysis. The filter, applied to data nobody had time to comb through manually."
          />
          <ExBuild
            n="04"
            tag="team filter"
            name="The AI Edges Teams channel"
            what="A running internal channel where I post the videos and threads worth watching, weekly. Now the team uses Claude to filter the channel back to them on demand &mdash; so even the channel doesn&rsquo;t have to be read in order."
          />
        </div>

        <div className="curio-essay-grid" style={{ marginTop: 36 }}>
          <a href="https://curioco.substack.com/p/new-frontiers-the-staff-you-never" target="_blank" rel="noopener noreferrer" className="curio-essay">
            <div className="curio-essay-num">essay</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">New Frontiers — The Staff You Never Hired</div>
              <div className="curio-essay-sub">AI doesn&rsquo;t automate work. It hires staff you never had budget for.</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </a>
          <a href="https://curioco.substack.com/p/the-contract-you-didnt-know-you-signed" target="_blank" rel="noopener noreferrer" className="curio-essay">
            <div className="curio-essay-num">essay</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">The Contract You Didn&rsquo;t Know You Signed</div>
              <div className="curio-essay-sub">Why thirty years of software conditioning is the real barrier to AI adoption.</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </a>
        </div>
      </section>

      <PriceBlock />

      <BridgeClose
        fromDoor="Filter"
        toDoor="Mindset"
        toHref="/curio/mindset"
        ifLine="I know what to use — but I still feel stuck"
      />

      <CurioFooter />
    </main>
  );
}

function ExBuild({ n, tag, name, what, href, label = 'open' }: {
  n: string; tag: string; name: string; what: string; href?: string; label?: string;
}) {
  return (
    <motion.div
      className="curio-build"
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
        <div className="curio-build-private">internal &mdash; ask if you want a walk-through</div>
      )}
    </motion.div>
  );
}
