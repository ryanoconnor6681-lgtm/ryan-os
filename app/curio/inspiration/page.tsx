"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LaneShift, DoorHeader, PriceBlock, BridgeClose, CurioFooter, usePersonaOrRedirect } from '../shared';

export default function CurioInspirationPage() {
  const persona = usePersonaOrRedirect();
  if (!persona) return null;

  return (
    <main className="curio-root curio-door curio-door-inspiration">
      <DoorHeader
        num="01"
        name="Inspiration"
        forText={persona === 'team' ? 'You came here because your team is moving, and you want a horizon they can walk toward together.' : 'You came here because you can feel the wave. You just can’t yet see your part in it. Let’s go look.'}
        illo="/images/curio/frontiers/figure-sun.jpeg"
      />

      <section className="curio-section">
        <div className="curio-wall-tie">
          this door answers the wall: <em>&ldquo;I&rsquo;m the [Excel] person. The deck person. The one who [your craft].&rdquo;</em>
        </div>

        <LaneShift
          answer={persona === 'team' ? 'Your team needs a horizon they can walk toward together.' : 'You need a north star.'}
          prompt={persona === 'team' ? 'Stop asking what we should learn.' : 'Stop asking what to learn.'}
          punch={persona === 'team' ? 'Ask what we could become.' : 'Ask what to become.'}
        />

        {persona === 'self' ? (
          <>
            <p className="curio-prose">
              Something nagged at you. Maybe a friend mentioned an agent that does work you used to spend Tuesdays on. Maybe a clip on your phone showed something you couldn&rsquo;t have built two years ago. The feeling that came back wasn&rsquo;t fear. It was <em>what could be</em>.
            </p>
            <p className="curio-prose">
              That feeling is the most important sense you have right now. Most of the noise reaching you treats AI like a tool you have to learn. The bigger question isn&rsquo;t <em>what is it for</em>. It&rsquo;s <strong>what does it want to do that you&rsquo;ve never been allowed to ask for</strong>.
            </p>
            <p className="curio-prose">
              A north star isn&rsquo;t a roadmap. It&rsquo;s the version of your work that&rsquo;s still ahead of you &mdash; the one you only ever saw in flashes. AI is the first tool in thirty years that closes the gap between <em>what you wish for</em> and <em>what the software allows</em>. The work here is to help you see that version of your work clearly enough to walk toward it.
            </p>
          </>
        ) : (
          <>
            <p className="curio-prose">
              Your team had the slide deck. Maybe more than one. The McKinsey deck. The keynote with the word <em>transformation</em>. They were energized for a week. Then nothing changed.
            </p>
            <p className="curio-prose">
              That isn&rsquo;t a willpower problem. It&rsquo;s a <strong>horizon problem</strong>. Frameworks tell people what to do. Roadmaps tell them when. Neither moves a group. What moves a group is the same thing that moves an individual: <em>a shared image of where they&rsquo;re going, that they actually want to walk toward</em>.
            </p>
            <p className="curio-prose">
              An institutional Curiosity Catalog does that &mdash; fourteen entry points by belief system, so the skeptic finds her door, the optimist finds his, and the quiet one finally has language for what she was already feeling. It&rsquo;s not training. It&rsquo;s <strong>alignment around a future they want to build</strong>, not one they&rsquo;re being warned about.
            </p>
          </>
        )}
      </section>

      {/* INSPIRATION — examples (curated: speculation made into work) */}
      <section className="curio-section curio-why">
        <div className="curio-eyebrow">examples</div>
        <h2 className="curio-h2">
          Speculation, <em>made into work.</em>
        </h2>
        <p className="curio-prose">
          Five things I made when I asked &ldquo;what could this be?&rdquo; instead of &ldquo;how do I do this?&rdquo; Open any of them.
        </p>

        <div className="curio-build-grid">
          <ExBuild
            n="01"
            tag="editorial speculation"
            name="The Ladder That Isn’t"
            what="An interactive editorial dashboard about American wealth. Built in a Sunday afternoon with Claude after the $887M Warner Bros. Discovery payout. Cited by a working journalist."
            href="https://ladder-mu.vercel.app"
          />
          <ExBuild
            n="02"
            tag="institutional speculation"
            name="RedPeg AI Curiosity Catalog"
            what="A 40-person agency moved to 75% Claude utilization in 4 weeks via fourteen belief-system entry points. Speculation as alignment."
            href="https://red-peg-curiosity-catalog.vercel.app/"
          />
          <ExBuild
            n="03"
            tag="long-form speculation"
            name="Gift.Script — a published novel"
            what="A 340-page novel about simulated worlds, written with AI as authorship tool. The kind of thing I was never going to make before."
            href="https://www.amazon.com/dp/B0FHVR8M97"
            label="amazon"
          />
          <ExBuild
            n="04"
            tag="d2c speculation"
            name="Lantern & Fox"
            what="A heirloom kit for screen-conscious parents, paired with an AI story engine. The product I’d been imagining for years; AI made the prototype reachable."
            href="https://lanternandfox.com"
          />
        </div>

        <div className="curio-essay-grid" style={{ marginTop: 36 }}>
          <a href="https://curioco.substack.com/p/waiting-for-humans" target="_blank" rel="noopener noreferrer" className="curio-essay">
            <div className="curio-essay-num">essay</div>
            <div className="curio-essay-body">
              <div className="curio-essay-title">Waiting for Humans</div>
              <div className="curio-essay-sub">On what AI can&rsquo;t do yet, and why that&rsquo;s still the real story.</div>
            </div>
            <div className="curio-essay-arrow">&#8599;</div>
          </a>
        </div>
      </section>

      <PriceBlock />

      <BridgeClose
        fromDoor="Inspiration"
        toDoor="Filter"
        toHref="/curio/filter"
        ifLine="I'm convinced — but I still don't know which AI tools are actually worth my week"
      />

      <CurioFooter />
    </main>
  );
}

// Inline build card — same visual as WhyCurio's grid, configurable per door.
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
      ) : null}
    </motion.div>
  );
}
