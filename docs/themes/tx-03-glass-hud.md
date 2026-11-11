# TX-03 GLASS HUD

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*Translucent data panels assembling around one datum.*

<div class="tx-swatches"><span class="tx-sw" style="background:#050B14" title="--tx-bg #050B14"></span><span class="tx-sw" style="background:#E8F4FF" title="--tx-ink #E8F4FF"></span><span class="tx-sw" style="background:#6FE3FF" title="--tx-a1 #6FE3FF"></span><span class="tx-sw" style="background:#F5A623" title="--tx-a2 #F5A623"></span><span class="tx-sw" style="background:#FF3B5C" title="--tx-a3 #FF3B5C"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| A · Digital Frontier | B2B | Runs at Boardroom as is | score, comparison | Monitoring, CI dashboards, agent systems |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-03-glass-hud.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-03-glass-hud.css).

```css
/* TX-03 GLASS HUD */
:root {
  --tx-id: "TX-03";
  --tx-bg: #050B14;
  --tx-ink: #E8F4FF;
  --tx-a1: #6FE3FF;
  --tx-a2: #F5A623;
  --tx-a3: #FF3B5C;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: 0;
  --tx-display: "Chakra Petch", system-ui, sans-serif;
  --tx-body: "Inter", system-ui, sans-serif;
  --tx-mono: "B612 Mono", ui-monospace, monospace;
  --tx-display-weight: 600;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.33,1,.68,1);
  --tx-dur: 450ms;
  --tx-step: none;
}
```

## Essence words

foresight, monitoring, augmentation, command, precision, overlay

## Look

Deep navy, translucent glass panels, ice-cyan linework, amber thresholds, one alert red. A central datum surrounded by orbiting panels, brackets, tick ladders and reticles. B612 Mono was drawn for cockpit legibility, so it suits dense readouts.

## Motion grammar

Staged boot sequences: lines draw, brackets snap, labels scramble, values settle. Micro moves 150 to 300 ms, assemblies 800 ms, `power2.out`, parallax depth between glass layers. Blur is applied to static layers only and never animated.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | panels assemble in depth around the headline datum (CSS 3D + static backdrop blur, T2; T3 option: three.js). |
| S2 | Section transitions | panel boot per section. |
| S3 | Ambient layer | slow reticle rings at 6% opacity. |
| S4 | Data skin | radial gauges, ring meters, sparklines with tick ladders. |
| S5 | Interaction and focus | targeting-bracket focus states. |

## Data skin

Thin rings, bracketed labels, tabular mono numerals, amber for any threshold crossing.

## Video

Camera pushes through glass layers toward the subject; callouts track to it; panel wipes. Low synth bed, 80 to 90 BPM, sparse UI chirps (video only; web stays silent).

## Boardroom translation

Native. Cap it at 3 panels per view and stop the rotating reticles.

## Homage guardrails

No armored suits or helmets, no named AI assistants from films, no gesture-glove props and no prediction-chamber imagery. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

The highest dashboard-collision risk in the codex. Set the HUD over something real (a photo, a map, a document) rather than shipping another standalone dashboard.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 17.7:1 | Body text |
| a1 on ground | 13.3:1 | Text and data lines |
| a2 on ground | 9.7:1 | Text and data lines |
| a3 on ground | 5.7:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Chakra Petch | 600 | OFL-1.1 |
| Body | Inter | 400 | OFL-1.1 |
| Mono | B612 Mono | 400 | OFL-1.1 |

## In the reel

The live loop runs 23.5 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-03).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Panels boot up | 6 |
| 2 | S2 | Push into a panel | 4.5 |
| 3 | S4 | Gauges, limit, ranked ladder | 9.5 |
| 4 | S5 | Target lock | 3.5 |

## Prompt seed

```text
TX-03 GLASS HUD: translucent panels boot up around one decisive datum; brackets snap, values settle; amber marks every threshold crossing.
```
