# TX-18 HALFTONE MULTIVERSE

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*Comic panels, misregistered inks, one art style per world.*

<div class="tx-swatches"><span class="tx-sw" style="background:#FFFFFF" title="--tx-bg #FFFFFF"></span><span class="tx-sw" style="background:#111111" title="--tx-ink #111111"></span><span class="tx-sw" style="background:#E6007E" title="--tx-a1 #E6007E"></span><span class="tx-sw" style="background:#0095D6" title="--tx-a2 #0095D6"></span><span class="tx-sw" style="background:#D4C700" title="--tx-a3 #D4C700"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| E · Auteur and Title Design | Creative | Never pitched for B2B | comparison, network | Personas, segmentation, multiple perspectives |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-18-halftone-multiverse.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-18-halftone-multiverse.css).

```css
/* TX-18 HALFTONE MULTIVERSE */
:root {
  --tx-id: "TX-18";
  --tx-bg: #FFFFFF;
  --tx-ink: #111111;
  --tx-a1: #E6007E;
  --tx-a2: #0095D6;
  --tx-a3: #D4C700;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: 0;
  --tx-display: "Bangers", system-ui, sans-serif;
  --tx-body: "Inter", system-ui, sans-serif;
  --tx-mono: "Permanent Marker", ui-monospace, monospace;
  --tx-display-weight: 400;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.34,1.56,.64,1);
  --tx-dur: 400ms;
  --tx-step: steps(12);
}
```

## Essence words

perspective, identity, energy, remix, multiplicity, youth

## Look

White paper, CMYK process inks, misregistered color offsets, Ben-Day dots, thick keylines. The signature device: **each "world" (segment, persona, viewpoint) gets its own art style.**

## Motion grammar

Frame-stepped moves "on twos" (12 fps via `steps()`) for anything character-like, smooth moves for camera. Smash cuts, panel-to-panel camera, sound-effect words popping on impact.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | comic panels burst into a split-screen hero, each panel in a different style (T2; VFX-JS halftone optional as the WebGL layer). |
| S2 | Section transitions | panel-to-panel transitions with on-twos stepping. |
| S3 | Ambient layer | slow Ben-Day dot drift. |
| S4 | Data skin | flat-ink charts with halftone shading and caption-box annotations, each segment drawn in its own visual dialect. |
| S5 | Interaction and focus | sticker pops. |

## Data skin

One style per segment, the theme's tool for personas and multiple perspectives.

## Video

Mixed frame rates (24 and 12), split screens, sound-effect words on hits, misregistration on cuts.

## Boardroom translation

Avoid. Tempered only for creative-adjacent editorial work.

## Homage guardrails

No spider motifs, masks, suits, webs, franchise logos, or a comics publisher's trade dress. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near persona and correlation-network builds; a different S1 family keeps it clear. Strong for fan communities, creators and TTRPG.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 18.9:1 | Body text |
| a1 on ground | 4.5:1 | Text and data lines |
| a2 on ground | 3.3:1 | Large text, icons and data lines |
| a3 on ground | 1.8:1 | Fill only |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Bangers | 400 | OFL-1.1 |
| Body | Inter | 400 | OFL-1.1 |
| Mono | Permanent Marker | 400 | Apache-2.0 |

## In the reel

The live loop runs 22 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-18).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Panels burst in | 5 |
| 2 | S2 | Panel-to-panel camera | 4.5 |
| 3 | S4 | Three worlds agree, then re-sort | 9.5 |
| 4 | S5 | Sticker pops | 3 |

## Prompt seed

```text
TX-18 HALFTONE MULTIVERSE: one dataset, many worlds; each persona or segment is drawn in its own art style; comic panels, misregistered inks, on-twos motion.
```
