# TX-04 RAINLIGHT NOIR

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*Rain, haze and neon reflections in a city that watches.*

<div class="tx-swatches"><span class="tx-sw" style="background:#05070B" title="--tx-bg #05070B"></span><span class="tx-sw" style="background:#D9E2E8" title="--tx-ink #D9E2E8"></span><span class="tx-sw" style="background:#FF8A1F" title="--tx-a1 #FF8A1F"></span><span class="tx-sw" style="background:#FF2E88" title="--tx-a2 #FF2E88"></span><span class="tx-sw" style="background:#3FD0E0" title="--tx-a3 #3FD0E0"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| A · Digital Frontier | Editorial | Has a Boardroom translation | terrain, timeline | Privacy, data brokers, AI ethics, future of work |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-04-rainlight-noir.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-04-rainlight-noir.css).

```css
/* TX-04 RAINLIGHT NOIR */
:root {
  --tx-id: "TX-04";
  --tx-bg: #05070B;
  --tx-ink: #D9E2E8;
  --tx-a1: #FF8A1F;
  --tx-a2: #FF2E88;
  --tx-a3: #3FD0E0;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .08;
  --tx-display: "Saira Condensed", system-ui, sans-serif;
  --tx-body: "Inter", system-ui, sans-serif;
  --tx-mono: "Share Tech Mono", ui-monospace, monospace;
  --tx-display-weight: 600;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.65,0,.35,1);
  --tx-dur: 1600ms;
  --tx-step: none;
}
```

## Essence words

memory, identity, surveillance, rain, melancholy, scale

## Look

Wet blacks, teal shadow, sodium-orange haze, magenta and cyan signage, rain highlights. Tall verticals, layered haze, floor reflections, ad-scale typography. Any non-English signage must be real, correctly written words, or left out.

## Motion grammar

Slow push-ins and dissolves of 1.2 to 2.5 s. Neon signs flicker on with 2 flickers at most, under 3 per second. Rain is constant but pausable.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | rain on glass over a neon-bokeh scene, title flickering on as a sign (VFX-JS custom shader or canvas droplets; the page's one WebGL layer). |
| S2 | Section transitions | slow dolly reveals: scale plus a crossfade between pre-blurred layers. |
| S3 | Ambient layer | drifting fog bands + rain streaks (transform-only). |
| S4 | Data skin | tall translucent "billboard" stat panels with a scanning light. |
| S5 | Interaction and focus | neon-tube hover outlines. |

## Data skin

Bars as vertical light columns, orange-vs-teal for two series, tall condensed caps for labels.

## Video

Long takes, slow push-ins, reflections, silhouettes against haze, 2.39:1 letterbox. Lush analog brass pads and long reverb, 60 to 80 BPM or free time.

## Boardroom translation

Keep haze and palette. Rain freezes after 5 s, no flicker, neon only as underline accents.

## Homage guardrails

No synthetic-human interrogation tests, origami figures, flying police vehicles, invented megacorporations, or recreated skyline shots. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near dark forensic looks; differentiate through the rain-and-neon S1. A strong fit for data-broker and privacy stories.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 15.4:1 | Body text |
| a1 on ground | 8.6:1 | Text and data lines |
| a2 on ground | 5.8:1 | Text and data lines |
| a3 on ground | 10.9:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Saira Condensed | 600 | OFL-1.1 |
| Body | Inter | 400 | OFL-1.1 |
| Mono | Share Tech Mono | 400 | OFL-1.1 |

## In the reel

The live loop runs 21 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-04).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Neon sign in the rain | 6.5 |
| 2 | S2 | Slow push through haze | 5 |
| 3 | S4 | Billboards: gap, then ranked | 9.5 |

## Prompt seed

```text
TX-04 RAINLIGHT NOIR: a rain-streaked, neon-lit city that watches back; slow push-ins through haze; signage-scale numbers; orange versus teal.
```
