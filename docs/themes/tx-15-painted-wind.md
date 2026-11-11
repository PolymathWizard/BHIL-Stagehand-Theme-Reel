# TX-15 PAINTED WIND

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*Hand-painted skies and wind moving through grass.*

<div class="tx-swatches"><span class="tx-sw" style="background:#F7F3E8" title="--tx-bg #F7F3E8"></span><span class="tx-sw" style="background:#23361F" title="--tx-ink #23361F"></span><span class="tx-sw" style="background:#2F6B3F" title="--tx-a1 #2F6B3F"></span><span class="tx-sw" style="background:#3E64A0" title="--tx-a2 #3E64A0"></span><span class="tx-sw" style="background:#B5762A" title="--tx-a3 #B5762A"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| D · Worlds and Maps | Editorial | Tempered is the ceiling | timeline, comparison | Health and care, community, sustainability, poetry |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-15-painted-wind.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-15-painted-wind.css).

```css
/* TX-15 PAINTED WIND */
:root {
  --tx-id: "TX-15";
  --tx-bg: #F7F3E8;
  --tx-ink: #23361F;
  --tx-a1: #2F6B3F;
  --tx-a2: #3E64A0;
  --tx-a3: #B5762A;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .08;
  --tx-display: "Shippori Mincho", system-ui, sans-serif;
  --tx-body: "Zen Maru Gothic", system-ui, sans-serif;
  --tx-mono: "IBM Plex Mono", ui-monospace, monospace;
  --tx-display-weight: 600;
  --tx-body-weight: 500;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.33,0,.2,1);
  --tx-dur: 1600ms;
  --tx-step: none;
}
```

## Essence words

wonder, nature, care, stillness, community, growth

## Look

Painterly skies, towering cumulus, meadow greens, golden-hour light, dusk blue. Watercolor paper, soft edges, hand-painted backgrounds. Every landscape is original.

## Motion grammar

Gentle 1 to 2 s fades, wind rolling across layered grass, drifting clouds, and *ma*: deliberate pauses where nothing moves.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | a painted landscape with wind passing through layered grass (SVG or canvas sway, T2) under parallax clouds. |
| S2 | Section transitions | soft fades with held pause beats. |
| S3 | Ambient layer | drifting seeds or petals (20 max). |
| S4 | Data skin | watercolor charts: Rough.js hachure with soft fills on paper texture. |
| S5 | Interaction and focus | soft lift hovers. |

## Data skin

Hand-painted feel, rounded labels, natural metaphors used honestly (a growing plant only where the number actually grows).

## Video

Lingering establishing shots, slow cloud pans, quiet moments, piano and strings in 3/4.

## Boardroom translation

Tempered is the ceiling. For human-centered health or community briefs, keep the palette and pacing and drop particles.

## Homage guardrails

No characters, creatures, forest spirits, flying machines or animal-bus vehicles that read as one studio's work, and no studio logo or film titles. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near watercolor-and-kintsugi poetry builds. Do not pair this theme with poetry if one shipped in the last two builds.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 11.7:1 | Body text |
| a1 on ground | 5.7:1 | Text and data lines |
| a2 on ground | 5.4:1 | Text and data lines |
| a3 on ground | 3.4:1 | Large text, icons and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Shippori Mincho | 600 | OFL-1.1 |
| Body | Zen Maru Gothic | 500 | OFL-1.1 |
| Mono | IBM Plex Mono | 400 | OFL-1.1 |

## In the reel

The live loop runs 22.5 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-15).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Wind through the grass | 7 |
| 2 | S2 | Soft fade, then a held pause | 3 |
| 3 | S4 | Watercolor: tallest blooms, re-sort | 9.5 |
| 4 | S5 | Seeds and a soft button | 3 |

## Prompt seed

```text
TX-15 PAINTED WIND: a human story told in painted landscapes; wind moves through grass as you scroll; watercolor charts; pauses are part of the rhythm.
```
