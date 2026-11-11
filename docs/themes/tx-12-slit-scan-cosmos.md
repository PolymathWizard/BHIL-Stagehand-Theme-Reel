# TX-12 SLIT-SCAN COSMOS

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*Light corridors, lensing rings, and silence as a beat.*

<div class="tx-swatches"><span class="tx-sw" style="background:#000000" title="--tx-bg #000000"></span><span class="tx-sw" style="background:#E8E1D5" title="--tx-ink #E8E1D5"></span><span class="tx-sw" style="background:#F2A65A" title="--tx-a1 #F2A65A"></span><span class="tx-sw" style="background:#5B8CFF" title="--tx-a2 #5B8CFF"></span><span class="tx-sw" style="background:#9B5DE5" title="--tx-a3 #9B5DE5"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| C · Epic Cinema | Editorial | Runs at Boardroom as is | timeline, terrain | AI timelines, futures, keynotes on scale and time |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-12-slit-scan-cosmos.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-12-slit-scan-cosmos.css).

```css
/* TX-12 SLIT-SCAN COSMOS */
:root {
  --tx-id: "TX-12";
  --tx-bg: #000000;
  --tx-ink: #E8E1D5;
  --tx-a1: #F2A65A;
  --tx-a2: #5B8CFF;
  --tx-a3: #9B5DE5;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .03;
  --tx-display: "Inter Tight", system-ui, sans-serif;
  --tx-body: "Inter", system-ui, sans-serif;
  --tx-mono: "Space Mono", ui-monospace, monospace;
  --tx-display-weight: 200;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.37,0,.63,1);
  --tx-dur: 3000ms;
  --tx-step: none;
}
```

## Essence words

time, scale, transcendence, inevitability, intelligence, silence

## Look

True black, bone white, accretion amber, stellar blue, one nebula violet. One-point perspective, centered symmetry, vast negative space. Display is Inter Tight at weights 200 to 300 with wide tracking.

## Motion grammar

Very slow: 2 to 6 s, `sine.inOut`. Slit-scan light corridors, a gravitational-lens ring, and silence as a beat: sections that hold completely still.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | choose one: a slit-scan light corridor (VFX-JS slitScan) or a gravitational-lens ring around the key number (custom shader). Either is the page's one WebGL layer. |
| S2 | Section transitions | slow fades with long holds. |
| S3 | Ambient layer | sparse stars, no parallax. |
| S4 | Data skin | log-scale timelines, orbital diagrams, dual "time-dilation" clocks. |
| S5 | Interaction and focus | minimal. |

## Data skin

Hairline strokes, log scales, ring diagrams.

## Video

Long static frames, intermission cards, organ or orchestral textures. A public-domain composition still needs a licensed or original recording.

## Boardroom translation

Native. Keep the slow pacing; swap the shader for a static lens poster.

## Homage guardrails

No black monolith, no red-eyed ship computer, no film ship designs, no bookshelf-dimension sets, no soundtrack recordings. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near starfield builds. Use the corridor or the lens ring, not a starfield, as the S1.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 16.2:1 | Body text |
| a1 on ground | 10.4:1 | Text and data lines |
| a2 on ground | 6.6:1 | Text and data lines |
| a3 on ground | 5.1:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Inter Tight | 200 | OFL-1.1 |
| Body | Inter | 400 | OFL-1.1 |
| Mono | Space Mono | 400 | OFL-1.1 |

## In the reel

The live loop runs 24 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-12).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Slit-scan corridor | 7 |
| 2 | S1 | Silence as a beat | 2.5 |
| 3 | S4 | Log scale, then the linear truth | 9.5 |
| 4 | S2 | Lensing ring | 5 |

## Prompt seed

```text
TX-12 SLIT-SCAN COSMOS: a story about time at scale; one light corridor or lensing ring; log-scale timelines; silence held as deliberately as motion.
```
