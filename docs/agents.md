# Agent team

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

CADRE: one Opus director over Sonnet specialists. Tool isolation is declared here and enforced by scripts/validate.py against .claude/agents/*.md.

| Agent | Model | Stages | Tools | Role |
| --- | --- | --- | --- | --- |
| `stagehand-director` | opus | D, I, U1, U2, U3, R, E, C, T, M | Read, Write, Edit, Glob, Grep, Task | Runs the eight moves, delegates each to a specialist, and writes the manifest line. |
| `essence-reader` | sonnet | U1 | Read, Glob, Grep | Reads the brief and returns five essence words and the dominant data shape. Never opens the codex. |
| `theme-scout` | sonnet | U1, U2, U3 | Read, Glob, Grep | Runs the fit test, proposes the triptych with at most one theme-led concept, and checks the ledger. |
| `theme-stylist` | sonnet | R, E, C | Read, Write, Edit, Glob, Grep, Bash | Applies the dial, fills S1 to S5 from the card, and wires tokens and fonts into the build. |
| `homage-auditor` | sonnet | T | Read, Glob, Grep | Grades blind: runs the swap test and the safety table against the built output, with no write tools and no access to the stylist's rationale. |
| `reel-engineer` | sonnet | C | Read, Write, Edit, Glob, Grep, Bash | Adds or changes reel scenes, keeps the scene API and the data beat grammar, and rebuilds the reel. |
| `card-author` | sonnet | R, T | Read, Edit, Glob, Grep, Bash | Writes a new theme card into canon (bench graduation), with every field, a contrast check and a homage review. |

Read-only agents: `essence-reader`, `theme-scout`, `homage-auditor`. The homage auditor grades blind: it sees the built output and the card, never the stylist's reasoning.

## Prompt pack

| ID | Prompt | Agent | Stage |
| --- | --- | --- | --- |
| P00 | [Director kickoff](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p00-director.md) | `stagehand-director` | all |
| P01 | [U1 essence extraction](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p01-essence.md) | `essence-reader` | U1 |
| P02 | [Fit test and shortlist](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p02-fit-test.md) | `theme-scout` | U1 |
| P03 | [Concept triptych](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p03-triptych.md) | `theme-scout` | U2 |
| P04 | [Ledger check](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p04-ledger.md) | `theme-scout` | U3 |
| P05 | [Intensity and Boardroom translation](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p05-dial.md) | `theme-stylist` | R |
| P06 | [Slot fill plan](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p06-slots.md) | `theme-stylist` | E |
| P07 | [Homage swap test and safety audit](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p07-homage-audit.md) | `homage-auditor` | T |
| P08 | [Manifest line](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p08-manifest.md) | `stagehand-director` | M |
| P09 | [New theme card](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p09-new-card.md) | `card-author` | R, T |
| P10 | [Reel scene for a theme](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/p10-reel-scene.md) | `reel-engineer` | C |
