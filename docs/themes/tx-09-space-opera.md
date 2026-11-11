# TX-09 SPACE OPERA

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*A perspective crawl, starfields and wipes at mythic scale.*

<div class="tx-swatches"><span class="tx-sw" style="background:#000000" title="--tx-bg #000000"></span><span class="tx-sw" style="background:#E6E9F0" title="--tx-ink #E6E9F0"></span><span class="tx-sw" style="background:#FFD23F" title="--tx-a1 #FFD23F"></span><span class="tx-sw" style="background:#7FB3FF" title="--tx-a2 #7FB3FF"></span><span class="tx-sw" style="background:#C0C8D8" title="--tx-a3 #C0C8D8"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| C · Epic Cinema | Creative | Tempered is the ceiling | timeline, network | Origin sagas, multi-part series, campaign settings |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-09-space-opera.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-09-space-opera.css).

```css
/* TX-09 SPACE OPERA */
:root {
  --tx-id: "TX-09";
  --tx-bg: #000000;
  --tx-ink: #E6E9F0;
  --tx-a1: #FFD23F;
  --tx-a2: #7FB3FF;
  --tx-a3: #C0C8D8;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: 0;
  --tx-display: "Oswald", system-ui, sans-serif;
  --tx-body: "News Cycle", system-ui, sans-serif;
  --tx-mono: "Space Mono", ui-monospace, monospace;
  --tx-display-weight: 700;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.4,0,.2,1);
  --tx-dur: 900ms;
  --tx-step: none;
}
```

## Essence words

saga, destiny, rebellion, empire, journey, myth

## Look

Star-black, a warm gold title color, cool steel greys, hyperspace-blue streaks. Deep space, low planet horizons, symmetric wide frames. Oswald at weight 700 for titles, News Cycle for crawl and body.

## Motion grammar

A perspective text crawl (rotateX about 25°, scroll-scrubbed). Wipes as chapter transitions: horizontal, clock and iris, the classic serial-film grammar. Hyperspace streak bursts of 500 ms or less.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | a scroll-scrubbed crawl receding into a starfield, then tilting down into chapter one (T1 CSS 3D; starfield canvas T2). |
| S2 | Section transitions | wipe transitions between chapters (clip-path; the clock wipe uses a conic-gradient mask). |
| S3 | Ambient layer | a 3-layer parallax starfield. |
| S4 | Data skin | fleet-style unit charts (small glyph units), star-map networks, episode timelines. |
| S5 | Interaction and focus | a hyperspace streak on CTA click. |

## Data skin

Gold on black, Roman-numeral episodes, factions as color pairs.

## Video

Crawl, then tilt down to a planet; wipes between scenes; orchestral brass with a short original motif per faction or competitor.

## Boardroom translation

Tempered is the ceiling. Keep the wipes and the episode structure. Use the crawl only if the intro is 60 words or fewer and also readable as plain text.

## Homage guardrails

No famous opening line or its variants, no franchise logo or its crawl yellow, no glowing swords, ships, robots or helmets from films, no franchise terminology. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near starfield builds. Use a different starfield treatment, or drop S3, if one is among the last two builds.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 17.3:1 | Body text |
| a1 on ground | 14.5:1 | Text and data lines |
| a2 on ground | 9.8:1 | Text and data lines |
| a3 on ground | 12.5:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Oswald | 700 | OFL-1.1 |
| Body | News Cycle | 400 | OFL-1.1 |
| Mono | Space Mono | 400 | OFL-1.1 |

## In the reel

The live loop runs 26.3 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-09).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Receding crawl | 12 |
| 2 | S2 | Clock wipe to chapter | 3 |
| 3 | S4 | Star map folds into share | 9.5 |
| 4 | S2 | Hyperspace, back to the top | 1.8 |

## Prompt seed

```text
TX-09 SPACE OPERA: an episodic saga opened by a receding crawl; chapters change by wipe; competitors as factions on a star map; gold on black.
```
