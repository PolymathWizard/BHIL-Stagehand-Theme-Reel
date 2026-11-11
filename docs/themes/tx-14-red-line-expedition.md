# TX-14 RED-LINE EXPEDITION

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*A red route inking across an aged map, stamp by stamp.*

<div class="tx-swatches"><span class="tx-sw" style="background:#E9DCC0" title="--tx-bg #E9DCC0"></span><span class="tx-sw" style="background:#2E2318" title="--tx-ink #2E2318"></span><span class="tx-sw" style="background:#A8341C" title="--tx-a1 #A8341C"></span><span class="tx-sw" style="background:#556B3F" title="--tx-a2 #556B3F"></span><span class="tx-sw" style="background:#1F2A33" title="--tx-a3 #1F2A33"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| D · Worlds and Maps | Editorial | Tempered is the ceiling | timeline, flow | Journeys, company histories, investigations, provenance |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-14-red-line-expedition.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-14-red-line-expedition.css).

```css
/* TX-14 RED-LINE EXPEDITION */
:root {
  --tx-id: "TX-14";
  --tx-bg: #E9DCC0;
  --tx-ink: #2E2318;
  --tx-a1: #A8341C;
  --tx-a2: #556B3F;
  --tx-a3: #1F2A33;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .12;
  --tx-display: "Alfa Slab One", system-ui, sans-serif;
  --tx-body: "Libre Caslon Text", system-ui, sans-serif;
  --tx-mono: "Special Elite", ui-monospace, monospace;
  --tx-display-weight: 400;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.33,1,.68,1);
  --tx-dur: 1000ms;
  --tx-step: none;
}
```

## Essence words

journey, discovery, evidence, adventure, provenance, risk

## Look

Aged map paper, route red, ink brown, khaki, faded green, and a night-camp navy chapter. Paper grain, folds, light stains, lamp vignette. Typewriter field notes; old-style map labels.

## Motion grammar

The red line draws continuously with scroll while a small generic vintage plane or ship icon rides it. Place labels stamp in at each stop; photo prints slide in under paper corners.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | the route draws across an aged map as you scroll, with stamps landing at each stop (DrawSVG + MotionPath, T1 to T2). |
| S2 | Section transitions | journal-page reveals. |
| S3 | Ambient layer | paper grain + lamp flicker at 3% opacity or less and 2 Hz or less. |
| S4 | Data skin | routes annotated with distance and time, dated stamps as data markers, ledger tables. |
| S5 | Interaction and focus | compass-needle hovers. |

## Data skin

Timelines drawn as routes, stamps as markers, ledger-style tables.

## Video

A map-travel montage dissolving into "on location" scenes; original adventure brass and strings at 100 to 120 BPM.

## Boardroom translation

Tempered is the ceiling. Keep the route grammar for customer journeys and timelines; drop stains and flicker.

## Homage guardrails

No hat-and-whip silhouettes, named relics, franchise typography or theme melody. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near ink-drawn maps and bearing-line forensics. Avoid if either is among the last two builds. A natural fit for provenance and investigation timelines.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 11.3:1 | Body text |
| a1 on ground | 4.9:1 | Text and data lines |
| a2 on ground | 4.3:1 | Large text, icons and data lines |
| a3 on ground | 10.8:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Alfa Slab One | 400 | OFL-1.1 |
| Body | Libre Caslon Text | 400 | OFL-1.1 |
| Mono | Special Elite | 400 | Apache-2.0 |

## In the reel

The live loop runs 23 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-14).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Route inks across the map | 9 |
| 2 | S2 | Journal page | 4.5 |
| 3 | S4 | Route: longest leg, ranked finds | 9.5 |

## Prompt seed

```text
TX-14 RED-LINE EXPEDITION: the story as a journey; a red route inks across an aged map as you scroll; each stop stamps in with its evidence; field notes in typewriter.
```
