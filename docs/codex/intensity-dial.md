# The intensity dial

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

Intensity is set once per property and follows the register. The theme keeps its identity at every level; only the volume changes.

| Level | Register | What stays | What goes | Timing |
| --- | --- | --- | --- | --- |
| Full | Creative or community | Everything on the card: glitch, chroma split, stutter, flicker, stepped frames, cursor effects. | Nothing beyond the hard gates. | The card's own timing. |
| Tempered | Editorial or civic | Palette, type trio, transition grammar, the S1 signature, the ambient layer. | Glitch, chroma and stutter cut to accents of 150 ms or less, at most one per section. Saturation down 20%. No cursor effects. | Card timing x 1.25. |
| Boardroom | B2B intelligence (the BHIL default) | Palette (darkened or neutralized), type trio, one transition grammar, the S1 at low contrast. | All glitch, flicker, stutter, chroma split and stepped-frame motion; particles above 30; any WebGL fluid. | 600 to 1200 ms, power3.out or expo.out. |

## Rules

- Every card ends with a Boardroom translation. A theme marked 'never pitched for B2B' is never pitched for B2B work.
- One chapter may step up one level for a deliberate beat, such as TX-06's flipped world or TX-10's infrared chapter. Declare it in the manifest.
- The dial never loosens a hard gate. A Full build still keeps reduced-motion guards, pause controls and the flash limits.

## B2B fit

| Code | Meaning | Themes |
| --- | --- | --- |
| native | Runs at Boardroom as is | [TX-03](../themes/tx-03-glass-hud.md), [TX-08](../themes/tx-08-cold-storage.md), [TX-10](../themes/tx-10-sandscale.md), [TX-12](../themes/tx-12-slit-scan-cosmos.md), [TX-13](../themes/tx-13-clockwork-realm.md), [TX-16](../themes/tx-16-paper-cut-titles.md), [TX-19](../themes/tx-19-symmetry-diorama.md), [TX-20](../themes/tx-20-liminal-office.md) |
| board | Has a Boardroom translation | [TX-01](../themes/tx-01-vector-grid.md), [TX-02](../themes/tx-02-phosphor-rain.md), [TX-04](../themes/tx-04-rainlight-noir.md) |
| news | Boardroom is news-desk only | [TX-05](../themes/tx-05-stutter-broadcast.md) |
| temp | Tempered is the ceiling | [TX-06](../themes/tx-06-otherside-83.md), [TX-09](../themes/tx-09-space-opera.md), [TX-14](../themes/tx-14-red-line-expedition.md), [TX-15](../themes/tx-15-painted-wind.md), [TX-17](../themes/tx-17-silhouette-smoke.md) |
| avoid | Never pitched for B2B | [TX-07](../themes/tx-07-night-drive.md), [TX-11](../themes/tx-11-wasteland-chrome.md), [TX-18](../themes/tx-18-halftone-multiverse.md) |

## Boardroom translations

| Theme | Boardroom translation |
| --- | --- |
| TX-01 VECTOR GRID | Deep navy ground, grid at 8% opacity, cyan only on the key path, no shards. |
| TX-02 PHOSPHOR RAIN | Rain only in the hero at 15% opacity or less, frozen after 3 s; decode accents on KPIs only. |
| TX-03 GLASS HUD | Native. Cap it at 3 panels per view and stop the rotating reticles. |
| TX-04 RAINLIGHT NOIR | Keep haze and palette. Rain freezes after 5 s, no flicker, neon only as underline accents. |
| TX-05 STUTTER BROADCAST | News-desk format only: chyrons, lower thirds, a ticker and clean cuts. No stutter, glitch or chroma. |
| TX-06 OTHERSIDE ’83 | Tempered is the ceiling. Keep the two-worlds device and palette; drop the VHS roll and the flashlight cursor. |
| TX-07 NIGHT DRIVE | Avoid. If forced, keep only the palette, muted to dusk violet. |
| TX-08 COLD STORAGE | Ready as is. Drop phosphor trails and blinking; keep the terminal grammar and segmented meters. |
| TX-09 SPACE OPERA | Tempered is the ceiling. Keep the wipes and the episode structure. Use the crawl only if the intro is 60 words or fewer and also readable as plain text. |
| TX-10 SANDSCALE | Native. Cap haze at 3 layers. |
| TX-11 WASTELAND CHROME | Avoid. For editorial work, Tempered keeps the palette and center framing and drops the stepped bursts. |
| TX-12 SLIT-SCAN COSMOS | Native. Keep the slow pacing; swap the shader for a static lens poster. |
| TX-13 CLOCKWORK REALM | Native. This is the natural skin for a market terrain board. |
| TX-14 RED-LINE EXPEDITION | Tempered is the ceiling. Keep the route grammar for customer journeys and timelines; drop stains and flicker. |
| TX-15 PAINTED WIND | Tempered is the ceiling. For human-centered health or community briefs, keep the palette and pacing and drop particles. |
| TX-16 PAPER CUT TITLES | Native, and one of the strongest B2B themes. Slow the rhythm to 600 to 900 ms. |
| TX-17 SILHOUETTE & SMOKE | Tempered is the ceiling: gold-on-black luxury minimalism with no fluid sim (WebGL fluid never runs in B2B). |
| TX-18 HALFTONE MULTIVERSE | Avoid. Tempered only for creative-adjacent editorial work. |
| TX-19 SYMMETRY DIORAMA | Native. Mute the pastels about 15% for org and process stories. |
| TX-20 LIMINAL OFFICE | Native, and the strongest theme in the codex for AI-workforce briefs. |

## How the reel engine applies the dial

How the reel engine applies the dial. Values are multipliers on each pass; OFF means the pass is skipped.

| Pass | Full | Tempered | Boardroom |
| --- | --- | --- | --- |
| Bloom | 1.0 | .80 | .45 |
| Light rays | 1.0 | .80 | .40 |
| Halo | 1.0 | .80 | .50 |
| Chromatic aberration | 1.0 | .60 | OFF |
| Lens dirt | 1.0 | .70 | OFF |
| Grain | 1.0 | 1.0 | .50 |
| Persistence | 1.0 | .60 | OFF |
| Channel and VHS cuts | ON | FADE | OFF |
