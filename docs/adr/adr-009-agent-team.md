# ADR-009 · A CADRE agent team with a blind auditor

**Status:** Accepted · 2026-11-10

## Context

The codex is written for agents. The steps are mechanical enough to automate (fit test, ledger check, dial, slot fills) and judgment-heavy in two places (the triptych and the homage swap test). Letting one agent both design and approve its own output invites rationalized copying: the agent that chose a look is the worst judge of whether it slid into a specific work.

## Decision

1. **One director, six specialists,** following the BHIL CADRE pattern: an Opus orchestrator over Sonnet subagents, each with the tools its stage needs and nothing else.
2. Tool isolation is **declared in `canon/agents.json`** and **enforced by the validator** against each brief's frontmatter in `.claude/agents/`. Read-only agents (`essence-reader`, `theme-scout`, `homage-auditor`) may not hold Write, Edit, Bash or NotebookEdit.
3. The **homage auditor grades blind.** It receives the built output, the card and the Homage Rule. It does not receive the stylist's reasoning, so it judges what shipped rather than what was intended.
4. **The essence reader never opens the codex.** U1 words are written before any theme is seen, so the fit test is not reverse-engineered from a favorite theme.
5. Every agent has a matching prompt in `prompts/` (P00 to P10), and the director ends every run with one manifest line.

## Consequences

- The same safeguards hold whether a person or an agent runs the process.
- The auditor cannot fix what it finds; it reports, and the director routes the fix to the stylist. This is slower and intentional.

## Alternatives considered

- **One agent with a checklist.** Rejected for the self-approval problem above.
- **Give the auditor Bash to run the validator.** Rejected: Bash can write. The director runs the validator; the auditor reads its output.
