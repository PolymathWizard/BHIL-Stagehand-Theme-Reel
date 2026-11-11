# Web slots and build tiers

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

Every themed page fills the same five slots. A card's web slot map says how this theme fills each one.

| Slot | Name | Role |
| --- | --- | --- |
| S1 | Hero signature | The opening moment that only this subject could have. The theme dresses it; the subject still decides it. |
| S2 | Section transitions | How one chapter hands off to the next: wipes, rolls, cuts, decodes. |
| S3 | Ambient layer | The texture that runs under everything: grain, scanlines, haze, drifting particles. Always quiet, always pausable. |
| S4 | Data skin | How charts, numbers and labels look and move. Every data beat in the reel demonstrates one. |
| S5 | Interaction and focus | Hover, focus and press states, including the page's one call to action. |

## Build tiers

Slot fills name a tier, so an agent knows the cost before it commits.

| Tier | Name | Role |
| --- | --- | --- |
| T1 | CSS and SVG | Transforms, gradients, clip paths and SVG strokes. The default tier and the safest. |
| T2 | Canvas and script | 2D canvas, particles and animation libraries. Needs a pause control when it runs past five seconds. |
| T3 | WebGL | Shaders and 3D. At most one WebGL layer per page, and never fluid simulation in B2B work. |

## Every card, slot by slot

### S1 · Hero signature

| Theme | Fill |
| --- | --- |
| [TX-01 VECTOR GRID](../themes/tx-01-vector-grid.md) | perspective grid floor scrolling toward the horizon while a light-trail draws the headline (T1 CSS 3D + gradient grid; T3 option: three.js grid with bloom). |
| [TX-02 PHOSPHOR RAIN](../themes/tx-02-phosphor-rain.md) | canvas rain that resolves into the headline (T2 to T3; 60 columns desktop, 24 mobile; stops or pauses after 5 s). |
| [TX-03 GLASS HUD](../themes/tx-03-glass-hud.md) | panels assemble in depth around the headline datum (CSS 3D + static backdrop blur, T2; T3 option: three.js). |
| [TX-04 RAINLIGHT NOIR](../themes/tx-04-rainlight-noir.md) | rain on glass over a neon-bokeh scene, title flickering on as a sign (VFX-JS custom shader or canvas droplets; the page's one WebGL layer). |
| [TX-05 STUTTER BROADCAST](../themes/tx-05-stutter-broadcast.md) | rotating line-box backdrop (CSS 3D, T1 to T2) behind an on-air frame, with the headline stuttering in. |
| [TX-06 OTHERSIDE ’83](../themes/tx-06-otherside-83.md) | the title assembly in glowing outlined serif over a dark field (T1 to T2; no autoplay audio). |
| [TX-07 NIGHT DRIVE](../themes/tx-07-night-drive.md) | a striped sun sinking behind a scrolling horizon grid under a chrome title (T1 CSS; T3 option: a shader sun). |
| [TX-08 COLD STORAGE](../themes/tx-08-cold-storage.md) | a monochrome vector wireframe (terrain, schematic or data structure) drawing onto a CRT beside live status readouts (DrawSVG + CSS scanlines, T1 to T2). |
| [TX-09 SPACE OPERA](../themes/tx-09-space-opera.md) | a scroll-scrubbed crawl receding into a starfield, then tilting down into chapter one (T1 CSS 3D; starfield canvas T2). |
| [TX-10 SANDSCALE](../themes/tx-10-sandscale.md) | a monumental reveal: a ridge, a structure or the key number at architectural scale rising from layered haze above a tiny marker (layered parallax, T1 to T2). |
| [TX-11 WASTELAND CHROME](../themes/tx-11-wasteland-chrome.md) | a scroll-scrubbed charge: speed lines and dust converge on a center-framed headline (canvas, T2 to T3). |
| [TX-12 SLIT-SCAN COSMOS](../themes/tx-12-slit-scan-cosmos.md) | choose one: a slit-scan light corridor (VFX-JS slitScan) or a gravitational-lens ring around the key number (custom shader). Either is the page's one WebGL layer. |
| [TX-13 CLOCKWORK REALM](../themes/tx-13-clockwork-realm.md) | a tilted map where each player's mechanism rises and assembles as you scroll (CSS 3D + SVG gears, T2; T3 option: three.js). |
| [TX-14 RED-LINE EXPEDITION](../themes/tx-14-red-line-expedition.md) | the route draws across an aged map as you scroll, with stamps landing at each stop (DrawSVG + MotionPath, T1 to T2). |
| [TX-15 PAINTED WIND](../themes/tx-15-painted-wind.md) | a painted landscape with wind passing through layered grass (SVG or canvas sway, T2) under parallax clouds. |
| [TX-16 PAPER CUT TITLES](../themes/tx-16-paper-cut-titles.md) | cut-paper shapes assemble into the headline in a jazz-timed sequence (SVG + GSAP; jagged edges from an feTurbulence displacement baked once, never animated). |
| [TX-17 SILHOUETTE & SMOKE](../themes/tx-17-silhouette-smoke.md) | smoke or ink flowing through a gold-lit frame to reveal the title (VFX-JS fluid at FULL only; poster + MorphSVG at TEMPERED). |
| [TX-18 HALFTONE MULTIVERSE](../themes/tx-18-halftone-multiverse.md) | comic panels burst into a split-screen hero, each panel in a different style (T2; VFX-JS halftone optional as the WebGL layer). |
| [TX-19 SYMMETRY DIORAMA](../themes/tx-19-symmetry-diorama.md) | a cross-section building whose rooms are the story's chapters; scroll tracks laterally room to room (a pinned horizontal scroll; mobile gets a native scroll-snap row). |
| [TX-20 LIMINAL OFFICE](../themes/tx-20-liminal-office.md) | an endless corridor in CSS 3D one-point perspective that scroll walks down; doors open onto chapters (T1). |

### S2 · Section transitions

| Theme | Fill |
| --- | --- |
| [TX-01 VECTOR GRID](../themes/tx-01-vector-grid.md) | DrawSVG light-trails linking section points at right angles. |
| [TX-02 PHOSPHOR RAIN](../themes/tx-02-phosphor-rain.md) | ScrambleText decode on section heads. |
| [TX-03 GLASS HUD](../themes/tx-03-glass-hud.md) | panel boot per section. |
| [TX-04 RAINLIGHT NOIR](../themes/tx-04-rainlight-noir.md) | slow dolly reveals: scale plus a crossfade between pre-blurred layers. |
| [TX-05 STUTTER BROADCAST](../themes/tx-05-stutter-broadcast.md) | stutter-repeat reveals on section heads; the repeats sit in `aria-hidden` spans and the real text appears once. |
| [TX-06 OTHERSIDE ’83](../themes/tx-06-otherside-83.md) | VHS tracking-roll transitions (clip + offset, 300 ms or less). |
| [TX-07 NIGHT DRIVE](../themes/tx-07-night-drive.md) | neon-sign flicker-on headers + script underline draw. |
| [TX-08 COLD STORAGE](../themes/tx-08-cold-storage.md) | terminal type-on section heads (TextPlugin; real text in the DOM). |
| [TX-09 SPACE OPERA](../themes/tx-09-space-opera.md) | wipe transitions between chapters (clip-path; the clock wipe uses a conic-gradient mask). |
| [TX-10 SANDSCALE](../themes/tx-10-sandscale.md) | sand-sweep noise-mask wipes. |
| [TX-11 WASTELAND CHROME](../themes/tx-11-wasteland-chrome.md) | crash-zoom section reveals with pre-baked motion blur. |
| [TX-12 SLIT-SCAN COSMOS](../themes/tx-12-slit-scan-cosmos.md) | slow fades with long holds. |
| [TX-13 CLOCKWORK REALM](../themes/tx-13-clockwork-realm.md) | gear-turn chapter transitions and armillary sweeps. |
| [TX-14 RED-LINE EXPEDITION](../themes/tx-14-red-line-expedition.md) | journal-page reveals. |
| [TX-15 PAINTED WIND](../themes/tx-15-painted-wind.md) | soft fades with held pause beats. |
| [TX-16 PAPER CUT TITLES](../themes/tx-16-paper-cut-titles.md) | hard-edged shape wipes. |
| [TX-17 SILHOUETTE & SMOKE](../themes/tx-17-silhouette-smoke.md) | liquid MorphSVG transitions. |
| [TX-18 HALFTONE MULTIVERSE](../themes/tx-18-halftone-multiverse.md) | panel-to-panel transitions with on-twos stepping. |
| [TX-19 SYMMETRY DIORAMA](../themes/tx-19-symmetry-diorama.md) | whip-pan transitions and centered chapter cards. |
| [TX-20 LIMINAL OFFICE](../themes/tx-20-liminal-office.md) | clean slide-ins and held cuts. |

### S3 · Ambient layer

| Theme | Fill |
| --- | --- |
| [TX-01 VECTOR GRID](../themes/tx-01-vector-grid.md) | horizon glow + 2% scanlines. |
| [TX-02 PHOSPHOR RAIN](../themes/tx-02-phosphor-rain.md) | CRT scanlines + light bloom. |
| [TX-03 GLASS HUD](../themes/tx-03-glass-hud.md) | slow reticle rings at 6% opacity. |
| [TX-04 RAINLIGHT NOIR](../themes/tx-04-rainlight-noir.md) | drifting fog bands + rain streaks (transform-only). |
| [TX-05 STUTTER BROADCAST](../themes/tx-05-stutter-broadcast.md) | scanlines + 2 px chroma offset. |
| [TX-06 OTHERSIDE ’83](../themes/tx-06-otherside-83.md) | floating ash (tsParticles slim, 40 desktop / 20 mobile) + film grain. |
| [TX-07 NIGHT DRIVE](../themes/tx-07-night-drive.md) | static heat-haze shimmer + VHS softness. |
| [TX-08 COLD STORAGE](../themes/tx-08-cold-storage.md) | CRT vignette, 2% scanlines, a faint hum flicker at 3% opacity or less and 2 Hz or less. |
| [TX-09 SPACE OPERA](../themes/tx-09-space-opera.md) | a 3-layer parallax starfield. |
| [TX-10 SANDSCALE](../themes/tx-10-sandscale.md) | drifting particulate (30 max) + static heat shimmer. |
| [TX-11 WASTELAND CHROME](../themes/tx-11-wasteland-chrome.md) | dust and grit overlay at 8% or less. |
| [TX-12 SLIT-SCAN COSMOS](../themes/tx-12-slit-scan-cosmos.md) | sparse stars, no parallax. |
| [TX-13 CLOCKWORK REALM](../themes/tx-13-clockwork-realm.md) | slow rotating rings at 5% opacity. |
| [TX-14 RED-LINE EXPEDITION](../themes/tx-14-red-line-expedition.md) | paper grain + lamp flicker at 3% opacity or less and 2 Hz or less. |
| [TX-15 PAINTED WIND](../themes/tx-15-painted-wind.md) | drifting seeds or petals (20 max). |
| [TX-16 PAPER CUT TITLES](../themes/tx-16-paper-cut-titles.md) | paper texture. |
| [TX-17 SILHOUETTE & SMOKE](../themes/tx-17-silhouette-smoke.md) | slow smoke drift. |
| [TX-18 HALFTONE MULTIVERSE](../themes/tx-18-halftone-multiverse.md) | slow Ben-Day dot drift. |
| [TX-19 SYMMETRY DIORAMA](../themes/tx-19-symmetry-diorama.md) | none. |
| [TX-20 LIMINAL OFFICE](../themes/tx-20-liminal-office.md) | the fluorescent hum at the safety limits. |

### S4 · Data skin

| Theme | Fill |
| --- | --- |
| [TX-01 VECTOR GRID](../themes/tx-01-vector-grid.md) | bars as glowing light-walls (scaleY only), lines as trails with a fading wake. |
| [TX-02 PHOSPHOR RAIN](../themes/tx-02-phosphor-rain.md) | numbers decode from glyph noise to the true value, which sits in the DOM. |
| [TX-03 GLASS HUD](../themes/tx-03-glass-hud.md) | radial gauges, ring meters, sparklines with tick ladders. |
| [TX-04 RAINLIGHT NOIR](../themes/tx-04-rainlight-noir.md) | tall translucent "billboard" stat panels with a scanning light. |
| [TX-05 STUTTER BROADCAST](../themes/tx-05-stutter-broadcast.md) | charts "change channel" between states (crossfade + 150 ms noise). |
| [TX-06 OTHERSIDE ’83](../themes/tx-06-otherside-83.md) | charts as 80s graph-paper plots and photocopied handouts; the flipped chapter shows the same chart with the hidden variable revealed. |
| [TX-07 NIGHT DRIVE](../themes/tx-07-night-drive.md) | equalizer bars and gradient chrome numerals. |
| [TX-08 COLD STORAGE](../themes/tx-08-cold-storage.md) | segmented bar meters, 7-segment counters, blinking threshold lamps. |
| [TX-09 SPACE OPERA](../themes/tx-09-space-opera.md) | fleet-style unit charts (small glyph units), star-map networks, episode timelines. |
| [TX-10 SANDSCALE](../themes/tx-10-sandscale.md) | bars as textured stone slabs, contour terrain charts for distributions, tiny figures for per-capita comparisons. |
| [TX-11 WASTELAND CHROME](../themes/tx-11-wasteland-chrome.md) | gauge needles, warning-stencil labels, heat-scorch maps. |
| [TX-12 SLIT-SCAN COSMOS](../themes/tx-12-slit-scan-cosmos.md) | log-scale timelines, orbital diagrams, dual "time-dilation" clocks. |
| [TX-13 CLOCKWORK REALM](../themes/tx-13-clockwork-realm.md) | territories as tiles that flip to reveal share, plus brass-ruled tables. Gear size is decoration, never data. |
| [TX-14 RED-LINE EXPEDITION](../themes/tx-14-red-line-expedition.md) | routes annotated with distance and time, dated stamps as data markers, ledger tables. |
| [TX-15 PAINTED WIND](../themes/tx-15-painted-wind.md) | watercolor charts: Rough.js hachure with soft fills on paper texture. |
| [TX-16 PAPER CUT TITLES](../themes/tx-16-paper-cut-titles.md) | bars as cut strips, pies as paper wedges, arrows as cut shards. |
| [TX-17 SILHOUETTE & SMOKE](../themes/tx-17-silhouette-smoke.md) | thin gold line charts on black with Didone numerals. |
| [TX-18 HALFTONE MULTIVERSE](../themes/tx-18-halftone-multiverse.md) | flat-ink charts with halftone shading and caption-box annotations, each segment drawn in its own visual dialect. |
| [TX-19 SYMMETRY DIORAMA](../themes/tx-19-symmetry-diorama.md) | pictogram rows, specimen-label charts, inventory tables. |
| [TX-20 LIMINAL OFFICE](../themes/tx-20-liminal-office.md) | a sorting interaction on a teal-on-black terminal grid: the reader drags numbers into bins, then sees the real distribution (predict-then-reveal). |

### S5 · Interaction and focus

| Theme | Fill |
| --- | --- |
| [TX-01 VECTOR GRID](../themes/tx-01-vector-grid.md) | neon focus rings with circuit-trace corners. |
| [TX-02 PHOSPHOR RAIN](../themes/tx-02-phosphor-rain.md) | terminal caret and green focus outline. |
| [TX-03 GLASS HUD](../themes/tx-03-glass-hud.md) | targeting-bracket focus states. |
| [TX-04 RAINLIGHT NOIR](../themes/tx-04-rainlight-noir.md) | neon-tube hover outlines. |
| [TX-05 STUTTER BROADCAST](../themes/tx-05-stutter-broadcast.md) | a LIVE bug and chyron-style hovers. |
| [TX-06 OTHERSIDE ’83](../themes/tx-06-otherside-83.md) | a flashlight spotlight cursor, gated to `(hover:hover)`; touch gets a static vignette. |
| [TX-07 NIGHT DRIVE](../themes/tx-07-night-drive.md) | neon glow hovers. |
| [TX-08 COLD STORAGE](../themes/tx-08-cold-storage.md) | hardware-key buttons with pressed states. |
| [TX-09 SPACE OPERA](../themes/tx-09-space-opera.md) | a hyperspace streak on CTA click. |
| [TX-10 SANDSCALE](../themes/tx-10-sandscale.md) | restrained. |
| [TX-11 WASTELAND CHROME](../themes/tx-11-wasteland-chrome.md) | stencil-stamp hovers. |
| [TX-12 SLIT-SCAN COSMOS](../themes/tx-12-slit-scan-cosmos.md) | minimal. |
| [TX-13 CLOCKWORK REALM](../themes/tx-13-clockwork-realm.md) | brass toggle hovers. |
| [TX-14 RED-LINE EXPEDITION](../themes/tx-14-red-line-expedition.md) | compass-needle hovers. |
| [TX-15 PAINTED WIND](../themes/tx-15-painted-wind.md) | soft lift hovers. |
| [TX-16 PAPER CUT TITLES](../themes/tx-16-paper-cut-titles.md) | shapes nudge on hover. |
| [TX-17 SILHOUETTE & SMOKE](../themes/tx-17-silhouette-smoke.md) | gold underline sweeps. |
| [TX-18 HALFTONE MULTIVERSE](../themes/tx-18-halftone-multiverse.md) | sticker pops. |
| [TX-19 SYMMETRY DIORAMA](../themes/tx-19-symmetry-diorama.md) | crisp, exact micro-interactions. |
| [TX-20 LIMINAL OFFICE](../themes/tx-20-liminal-office.md) | corporate-polite toasts. |
