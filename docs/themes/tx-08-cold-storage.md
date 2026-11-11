# TX-08 COLD STORAGE

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*Chunky CRT terminals humming in a cold industrial hull.*

<div class="tx-swatches"><span class="tx-sw" style="background:#030503" title="--tx-bg #030503"></span><span class="tx-sw" style="background:#E8E2D0" title="--tx-ink #E8E2D0"></span><span class="tx-sw" style="background:#FFB000" title="--tx-a1 #FFB000"></span><span class="tx-sw" style="background:#33FF66" title="--tx-a2 #33FF66"></span><span class="tx-sw" style="background:#FF3B30" title="--tx-a3 #FF3B30"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| B · Retro Signal | Editorial | Runs at Boardroom as is | score, document | System status, audits, monitoring, legacy tech |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-08-cold-storage.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-08-cold-storage.css).

```css
/* TX-08 COLD STORAGE */
:root {
  --tx-id: "TX-08";
  --tx-bg: #030503;
  --tx-ink: #E8E2D0;
  --tx-a1: #FFB000;
  --tx-a2: #33FF66;
  --tx-a3: #FF3B30;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .05;
  --tx-display: "Michroma", system-ui, sans-serif;
  --tx-body: "IBM Plex Sans Condensed", system-ui, sans-serif;
  --tx-mono: "VT323", ui-monospace, monospace;
  --tx-display-weight: 400;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.25,.1,.25,1);
  --tx-dur: 500ms;
  --tx-step: steps(1);
}
```

## Essence words

isolation, systems, warning, industrial, protocol, dread

## Look

Green and amber CRT text on black, beige plastic consoles, gunmetal panels, red alarm lamps. Rounded screen bezels, curvature vignette, phosphor persistence. DSEG7 supplies the 7-segment numerals.

## Motion grammar

Line-by-line type-on with a block cursor, vector wireframes drawing stroke by stroke, status lamps blinking at 1 Hz, slow tracking moves.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | a monochrome vector wireframe (terrain, schematic or data structure) drawing onto a CRT beside live status readouts (DrawSVG + CSS scanlines, T1 to T2). |
| S2 | Section transitions | terminal type-on section heads (TextPlugin; real text in the DOM). |
| S3 | Ambient layer | CRT vignette, 2% scanlines, a faint hum flicker at 3% opacity or less and 2 Hz or less. |
| S4 | Data skin | segmented bar meters, 7-segment counters, blinking threshold lamps. |
| S5 | Interaction and focus | hardware-key buttons with pressed states. |

## Data skin

Segmented bars, monochrome green with amber thresholds; red only for a breach.

## Video

Slow pans across instrument panels, blinking lights, long silences. Ship hum and relay clicks; no score, or a sparse drone.

## Boardroom translation

Ready as is. Drop phosphor trails and blinking; keep the terminal grammar and segmented meters.

## Homage guardrails

No ship or onboard-computer names, no creature, egg or biomechanical forms, no film corporation logos, no franchise wordmark. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near security builds with heap-grid or sonar signatures. Prefer non-security subjects, or a different S1 family when either shipped recently.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 15.8:1 | Body text |
| a1 on ground | 11.2:1 | Text and data lines |
| a2 on ground | 15.2:1 | Text and data lines |
| a3 on ground | 5.8:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Michroma | 400 | OFL-1.1 |
| Body | IBM Plex Sans Condensed | 400 | OFL-1.1 |
| Mono | VT323 | 400 | OFL-1.1 |

## In the reel

The live loop runs 24 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-08).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Wireframe survey | 6.5 |
| 2 | S2 | Terminal type-on | 4.5 |
| 3 | S4 | Meters: limit line, ranked load | 9.5 |
| 4 | S5 | Hardware keys | 3.5 |

## Prompt seed

```text
TX-08 COLD STORAGE: a humming late-70s ship console; vector wireframes draw onto green CRTs; segmented meters and 7-segment counters; red appears only at breach.
```
