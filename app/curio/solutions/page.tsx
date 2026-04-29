"use client";
import React from 'react';
import { LaneShift, DoorHeader, WhyCurio, EssaysBlock, PriceBlock, BridgeClose, CurioFooter, usePersonaOrRedirect } from '../shared';

export default function CurioSolutionsPage() {
  const persona = usePersonaOrRedirect();
  if (!persona) return null;

  return (
    <main className="curio-root curio-door curio-door-solutions">
      <DoorHeader
        num="04"
        name="Solutions"
        forText={persona === 'team' ? 'You don’t need a vendor. You need a partner who’s already done this institutionally.' : 'Sometimes you don’t need another framework. You need someone who’s done this — and the permission to hand them the wish.'}
        illo="/images/curio/frontiers/hands-touch.jpeg"
      />

      <section className="curio-section">
        <div className="curio-wall-tie">
          this door answers the wall: <em>&ldquo;is this cheating?&rdquo;</em>
        </div>

        <LaneShift
          answer={persona === 'team' ? 'Sometimes you just need a partner who’s done this.' : 'Sometimes you just need someone who’s done this.'}
          prompt={persona === 'team' ? 'Stop scoping a vendor.' : 'It’s OK to not do it this time.'}
          punch={persona === 'team' ? 'Hire the partner who already did it.' : 'Hand me the wish.'}
        />

        {persona === 'self' ? (
          <>
            <p className="curio-prose">
              You have an idea. It&rsquo;s been there for months. Maybe it&rsquo;s a small tool you keep mocking up in your head &mdash; the one that would save you twenty minutes a day if it existed. Maybe it&rsquo;s a Brain you keep wanting to build but never sit down to. Maybe it&rsquo;s a primer you wish your old company had given you on day one.
            </p>
            <p className="curio-prose">
              The hardest part isn&rsquo;t the building. <strong>The hardest part is starting.</strong> Most people stall not because they lack skill but because they have a half-formed wish and no one to hand it to. They feel silly asking. They tell themselves they should figure it out alone. They don&rsquo;t.
            </p>
            <p className="curio-prose">
              That&rsquo;s the part I do. You hand me the wish; I sit down and build the thing. Sometimes it takes a working day, sometimes a week. <em>The point isn&rsquo;t the speed</em> &mdash; it&rsquo;s that the wish gets out of your head and into the world, where you can see it, use it, and decide what comes next.
            </p>
          </>
        ) : (
          <>
            <p className="curio-prose">
              Most agencies offer &ldquo;AI services&rdquo; as a SKU bolted onto a list of capabilities. <em>That isn&rsquo;t what your team needs.</em> A SKU is a vendor relationship: you brief it, they deliver it, you check the box. Then it sits in a Notion page nobody opens.
            </p>
            <p className="curio-prose">
              What your team needs is a <strong>partner</strong> who can sit inside your operations, your culture, and your real workflow &mdash; and build with you instead of around you. Someone who&rsquo;s already done the hard institutional version once, on themselves: 75% Claude utilization in four weeks, ~$433K in cost-recovery questions surfaced via MCP, an institutional vision-transfer artifact your peers can walk through right now.
            </p>
            <p className="curio-prose">
              That&rsquo;s the model. The Catalog tier replicates it for your organization &mdash; tuned to your team&rsquo;s belief mix, role coverage, and rollout plan. Not a deliverable. <em>A working artifact your team owns and runs after I leave.</em>
            </p>
          </>
        )}
      </section>

      {/* SOLUTIONS — kitchen sink: full work + all essays. If a buyer made it here, give them everything. */}
      <WhyCurio />

      <EssaysBlock />

      <PriceBlock />

      <BridgeClose
        fromDoor="Solutions"
        toDoor="Inspiration"
        toHref="/curio/inspiration"
        ifLine="where is this all going long-term"
      />

      <CurioFooter />
    </main>
  );
}
