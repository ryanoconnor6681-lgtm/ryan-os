# Curio refresh, November 2026

## Goal

Curio (curio.help) becomes a free, non-commercial guide. It keeps its model, four
focuses and five fallacies, and reads as written by a person in November 2026.
Ryan no longer needs income from it, so the paid offers and the portfolio feel go.

## Inputs

- Live site: `public/curio-site/` (index, Inspiration, Filter, Mindset, Solutions, about, quiz, llms.txt)
- Chat prompt: the `curio` block in `app/api/chat/route.ts`
- `~/Desktop/Vision 2028 v0.7.pdf` (internal EY essay; ideas only, no EY specifics, no quoted text)
- `~/curiosity-catalog/FACT-CHECK.md` (July memo that already cut the exam and McKinsey claims)
- `~/.claude/skills/writing-voice/lint.sh`

## Decisions (Ryan, 2026-11-19)

1. Solutions becomes "hand AI the task": building it yourself, software made for the need.
2. Bio is past only. RedPeg story in past tense, nothing about the current job, EY never named.
3. Quiz has no email capture. It shows the result and offers the Starter as a direct download.
4. Work-example cards on Inspiration, Filter and Mindset are replaced by generic "imagine if" prompts about the reader's work.

5. (Notes round) Drop the "for myself / for my team" persona choice. One version of each page, with the best team-only lines folded in.
6. (Notes round) Fold in the bubble talk. Ryan's view: the dot-com comparison is wrong, the tools are in real use, and the questions people now ask come from using it (what do grads do, what is my part when AI does 50 to 80%, what to do with the new kind of tiredness). Written as "stock prices are one question, whether it works is another". No specific hacks or news events named.

## Claude's calls (correct any of these)

- Keep the on-site names "focuses" and "fallacies". Fix About, which still says doors and walls.
- "Studio" becomes "guide" in titles and taglines, since a studio implies a business.
- Keep the RedPeg rollout numbers (75% daily use, about $433K in cost-recovery questions) once, on About, in past tense. One short mention of the 75% stays in the home hero.
- Keep the chat. Update its prompt and move the model to `claude-opus-5-5`.
- Substack essay links stay as an archive. No promise of a weekly cadence.
- The Mirror dashboard and the Supabase signup function are left alone (unused once capture is off).

## What changed during the build

- The chat model was left on `claude-opus-5`. There is no API key in `.env.local`, so the chat could not be tested locally, and the model constant is shared with the portfolio chat. The prompt change is type-checked only. Test it on a Vercel preview before or right after merging.
- The Starter PDF: `assets/Curio_Starter_v2.pdf` is untouched. A new `Curio_Starter_v3.pdf` holds pages 1 to 14 (page 15 carried the paid offers and a weekly-essay promise). The quiz links to v3.
- The mental-model card backs lost their pull quotes and gained a plain "Try this:" line, which also holds the card layout.
- The general `SYSTEM_PROMPT` in `app/api/chat/route.ts` still says Ryan is VP at RedPeg. It belongs to the portfolio chat (out of scope). The Curio block now carries an override, so the Curio chat should speak of RedPeg in the past tense.
- The About page no longer mentions the book "Ask the Mirror"; its status was unknown.
- `curio-chat.js` ignores any stored persona.

## Approaches considered

- Trim in place: delete the offer blocks and work cards, patch the copy. Fast, but Solutions is a hire-me page top to bottom and would be left hollow.
- Rewrite page by page on the existing design (picked). Same layout, CSS and components; new copy; Solutions rebuilt on the same template as the other three focuses.
- Rebuild the site. Out of proportion to the ask, and the visual design is not the problem.

## Vision 2028 ideas, and where they land

| Idea | Lands in |
|---|---|
| Seeing the new thing through the old (horseless carriage, five hundred channels) | Inspiration cards, Muscle Memory fallacy |
| General IQ versus context IQ; ask, brief, connect, train, delegate | Mindset, Filter, home "why" panel; replaces the "no setup" card |
| Authorship moves from making to directing | Identity fallacy, Mindset |
| The dial: do it for me versus teach me | Guilt fallacy, Solutions |
| Software made for the need | Solutions |
| The middle hollows out; what stays the same | Inspiration, Filter |

## Out of scope

Visual redesign, quiz questions and scoring, the portfolio site, the Starter PDF's contents
(flag anything commercial in it, do not edit it), deleting the Gumroad products.

## Done means

- Zero em dashes in visible copy on all seven pages; `lint.sh` clean or each remaining hit explained.
- No prices, Gumroad links, consulting or hire language in pages, llms.txt, or the chat prompt.
- No work-example cards or links to Ryan's projects on the focus pages.
- Every statistic traces to a source or is cut (exam percentiles and McKinsey attribution are cut).
- No present-tense RedPeg; EY not named.
- Pages checked in a local preview at 1440 wide and at phone width; fallacy cards still fit their text.
- A fresh-context read by the website-auditor agent before calling it finished.
- Archive exists: `Brain/Personal/Projects/Curio/99_Archive/2026-11-19_site-with-paid-and-portfolio/` and git tag `curio-pre-refresh-2026-11-19`.
- Nothing pushed to `main` (which deploys) until Ryan says so.

## Checkpoints

1. Home page, shown to Ryan before the rest.
2. Four focus pages.
3. About, quiz ending, llms.txt, chat prompt.
4. Full verification and auditor read.
