# TX-13 CLOCKWORK REALM

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

*A brass map where mechanisms rise to show who holds what.*

<div class="tx-swatches"><span class="tx-sw" style="background:#1A1712" title="--tx-bg #1A1712"></span><span class="tx-sw" style="background:#E9DCC0" title="--tx-ink #E9DCC0"></span><span class="tx-sw" style="background:#C9A464" title="--tx-a1 #C9A464"></span><span class="tx-sw" style="background:#8C1C13" title="--tx-a2 #8C1C13"></span><span class="tx-sw" style="background:#7A8C96" title="--tx-a3 #7A8C96"></span></div>

| Family | Home register | B2B fit | Data shapes | Best for |
| --- | --- | --- | --- | --- |
| D · Worlds and Maps | B2B | Runs at Boardroom as is | network, terrain | Market landscapes, ecosystems, power maps |

## Tokens

Paste-ready custom properties. Download: [`tokens/themes/tx-13-clockwork-realm.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/tx-13-clockwork-realm.css).

```css
/* TX-13 CLOCKWORK REALM */
:root {
  --tx-id: "TX-13";
  --tx-bg: #1A1712;
  --tx-ink: #E9DCC0;
  --tx-a1: #C9A464;
  --tx-a2: #8C1C13;
  --tx-a3: #7A8C96;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .06;
  --tx-display: "Cinzel", system-ui, sans-serif;
  --tx-body: "EB Garamond", system-ui, sans-serif;
  --tx-mono: "Cormorant SC", ui-monospace, monospace;
  --tx-display-weight: 600;
  --tx-body-weight: 400;
  --tx-mono-weight: 500;
  --tx-ease: cubic-bezier(.5,0,.5,1);
  --tx-dur: 1200ms;
  --tx-step: steps(12);
}
```

## Essence words

power, territory, alliances, machinery, succession, strategy

## Look

Dark vellum, brass and bronze, parchment, slate, a wax-red seal accent. An overhead, tilted map-as-tabletop; mechanisms rise from its tiles; armillary rings turn overhead.

## Motion grammar

Mechanical. Gear-driven rotations, ratchet ticks (`steps(12)`), extrusions rising from the map, a camera that glides between regions on a pinned scrub.

## Web slot map

| Slot | Name | Fill |
| --- | --- | --- |
| S1 | Hero signature | a tilted map where each player's mechanism rises and assembles as you scroll (CSS 3D + SVG gears, T2; T3 option: three.js). |
| S2 | Section transitions | gear-turn chapter transitions and armillary sweeps. |
| S3 | Ambient layer | slow rotating rings at 5% opacity. |
| S4 | Data skin | territories as tiles that flip to reveal share, plus brass-ruled tables. Gear size is decoration, never data. |
| S5 | Interaction and focus | brass toggle hovers. |

## Data skin

Tile maps, brass-ruled tables, engraved numerals.

## Video

An overhead glide across the map while structures assemble; an original cello ostinato at 90 to 110 BPM.

## Boardroom translation

Native. This is the natural skin for a market terrain board.

## Homage guardrails

No noble-house sigils, continent shapes or place names from any series, no astrolabe-sun opener composition, no theme melody. These sit on top of the [Homage Rule](../codex/homage-rule.md).

## Collision note

Sits near ink-drawn territory maps and Voronoi market boards. Differentiate with mechanical assembly, not ink lines or cells.

## Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink on ground | 13.2:1 | Body text |
| a1 on ground | 7.6:1 | Text and data lines |
| a2 on ground | 1.9:1 | Fill only |
| a3 on ground | 5.1:1 | Text and data lines |

## Type trio

| Role | Face | Weight | License |
| --- | --- | --- | --- |
| Display | Cinzel | 600 | OFL-1.1 |
| Body | EB Garamond | 400 | OFL-1.1 |
| Mono | Cormorant SC | 500 | OFL-1.1 |

## In the reel

The live loop runs 22 s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#tx-13).

| Beat | Slot | Label | Seconds |
| --- | --- | --- | --- |
| 1 | S1 | Mechanisms rise | 7 |
| 2 | S2 | Gear-turn transition | 2.5 |
| 3 | S4 | Tiles flip, ledger re-sorts | 9.5 |
| 4 | S5 | Brass toggles | 3 |

## Prompt seed

```text
TX-13 CLOCKWORK REALM: the market as a brass tabletop map; each player's mechanism rises and locks in as you scroll; tiles flip to reveal share; ratchet-tick transitions.
```
