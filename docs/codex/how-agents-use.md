# How agents use the codex

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

A theme is a costume layer. It sets palette, type, motion grammar, transitions and video language. It never picks the format, never replaces the subject-derived S1 signature, and never overrides a hard gate.

## The eight moves

| # | Stage | Move | What happens |
| --- | --- | --- | --- |
| 1 | U1 | Essence | Write five essence words and the dominant data shape before opening the codex. |
| 2 | U1 | Fit test | Shortlist themes whose essence words match two or more U1 words and whose data shapes include the U1 shape. |
| 3 | U2 | Triptych | Three concepts. At most one is theme-led, so the comparison stays honest. A theme-led concept still needs its own subject-specific S1. |
| 4 | U3 | Ledger | No theme repeats in consecutive builds, or twice in one register within three builds. Check the card's collision note. |
| 5 | R | Dial | Set intensity from the register: Full, Tempered or Boardroom. |
| 6 | E | Slots | Fill S1 to S5 from the card's web slot map. Every effect still resolves through your effect library. |
| 7 | T | Swap test | Run the Homage Rule swap test and the safety table. Log homage-check PASS or FAIL. |
| 8 | M | Manifest | Record the theme line in the build manifest. |

## Stage letters

The letters are stage labels from BHIL's Stagehand Design Framework, the build process this codex plugs into. You do not need the framework to use the codex; each stage is described by what it does.

| Stage | What it does with a theme |
| --- | --- |
| D, I | Phase 1: decide format and modules. A theme never picks the format. |
| U1 | Essence extraction: five words and the dominant data shape. |
| U2 | Concept triptych: three directions, at most one theme-led. |
| U3 | Ledger check against recent builds. |
| R | Register and look: intensity, palette, type. |
| E | Effects: fill the five slots. |
| C | Code: tokens, fonts and the build. |
| T | Tests: homage swap test, safety and accessibility. |
| M | Manifest: the record that ships with the build. |

## When rules collide

| Order | Rule | Meaning |
| --- | --- | --- |
| 1 | Hard gates | Budgets, reduced motion, accessibility, honesty, licensing. |
| 2 | Client brand | Client tokens replace ground, ink and type; the theme lends motion. |
| 3 | The Homage Rule | Evoke the genre, never the property. |
| 4 | Register | Set through the intensity dial. |
| 5 | The theme card | The last word, never the first. |

## Intake values

| Value | Effect |
| --- | --- |
| theme: auto | The agent may propose at most one theme inside the triptych. |
| theme: none | Switches the codex off. |
| theme: TX-## | Forces a theme. The fit test still runs, and a failed fit is flagged, not silently obeyed. |

```text
theme intensity: [auto | full | tempered | boardroom]
```

## Manifest line

```text
theme: TX-## CODENAME · intensity · fit score · homage-check PASS/FAIL
theme: TX-03 GLASS HUD · boardroom · fit 4/5 · homage-check PASS
```

## Paste-ready theme directive

```text
THEME DIRECTIVE · Stagehand Theme Codex STC v1.0

1. U1 ESSENCE. Write five essence words and the dominant data shape before opening the codex.
2. U1 FIT TEST. Shortlist themes whose essence words match two or more U1 words and whose data shapes include the U1 shape.
3. U2 TRIPTYCH. Three concepts. At most one is theme-led, so the comparison stays honest. A theme-led concept still needs its own subject-specific S1.
4. U3 LEDGER. No theme repeats in consecutive builds, or twice in one register within three builds. Check the card's collision note.
5. R DIAL. Set intensity from the register: Full, Tempered or Boardroom.
6. E SLOTS. Fill S1 to S5 from the card's web slot map. Every effect still resolves through your effect library.
7. T SWAP TEST. Run the Homage Rule swap test and the safety table. Log homage-check PASS or FAIL.
8. M MANIFEST. Record the theme line in the build manifest.

HOMAGE RULE. Codename only in public copy. No logos, wordmarks, characters, named places or terms, quotes, scores or sound-alikes, stills, or franchise typefaces.
INTENSITY follows register: creative = full, editorial = tempered, B2B = boardroom. Never pitch a theme marked "never pitched for B2B" for B2B work.
SAFETY. The safety table applies on top of your hard gates.
MANIFEST: theme: TX-## CODENAME · intensity · fit score · homage-check PASS/FAIL · any one-level chapter step-up · flash-test result (video).
END DIRECTIVE
```

## Signature ledger

Add a Theme column to your build ledger.

| Property | Register | Recipe | Theme (TX · intensity) | S1 signature family | Novelty axis | Motif | Shipped |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Example Story | B2B | 5 | TX-13 · boardroom | mechanism-rise map board | mechanical assembly | the ratchet tick | Nov 2026 |

A theme never repeats in consecutive builds, and never appears twice in the same register within three builds. Rows from before the codex get none in the Theme column.
