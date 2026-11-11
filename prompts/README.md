# Prompt pack

Eleven prompts, one per step of the Stagehand workflow. Each names its agent, its stage, its inputs, an output contract, checks and the failure modes it prevents.

| ID | Prompt | Agent | Stage |
| --- | --- | --- | --- |
| P00 | [Director kickoff](p00-director.md) | `stagehand-director` | all |
| P01 | [U1 essence extraction](p01-essence.md) | `essence-reader` | U1 |
| P02 | [Fit test and shortlist](p02-fit-test.md) | `theme-scout` | U1 |
| P03 | [Concept triptych](p03-triptych.md) | `theme-scout` | U2 |
| P04 | [Ledger check](p04-ledger.md) | `theme-scout` | U3 |
| P05 | [Intensity and Boardroom translation](p05-dial.md) | `theme-stylist` | R |
| P06 | [Slot fill plan](p06-slots.md) | `theme-stylist` | E |
| P07 | [Homage swap test and safety audit](p07-homage-audit.md) | `homage-auditor` | T |
| P08 | [Manifest line](p08-manifest.md) | `stagehand-director` | M |
| P09 | [New theme card](p09-new-card.md) | `card-author` | R, T |
| P10 | [Reel scene for a theme](p10-reel-scene.md) | `reel-engineer` | C |

Placeholders use `{{double braces}}`. Paste a prompt into the matching agent, or let the director chain them from P00.
