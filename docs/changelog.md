<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. Source: CHANGELOG.md -->
# Changelog

All notable changes to this repository. Versions follow semantic versioning; commits follow conventional commits scoped to `stagehand`.

## 1.4.0 · 2026-11-13

Reel v7, the cinematography layer. It replaces the gentle camera of 1.3.0 with real shots and adds a lens and a light.

- **Shots.** Every staged beat is now a shot built from its focus keys. A reveal opens tight on the first subject (up to 1.3x) and pulls back to the wide. A tour stays tight and travels from subject to subject, then pulls back: the route in TX-14, the panels in TX-18, the towers in TX-13. A push holds the wide, then moves in on the last subject. The frame edge never shows.
- **Key light.** A pool of light follows the subject: the frame falls into shadow away from it, and it moves when focus racks. Off on light-ground themes.
- **Lens per theme.** The finished frame is redrawn through a model of the glass. Tube curvature for TX-01, TX-02, TX-05 and TX-08. Heat shimmer for TX-07, TX-10 and TX-11. Liquid ripple for TX-06, TX-12 and TX-17. Hand-made boil for TX-16 and TX-18. Rain on the glass for TX-04, where each drop shows the scene behind it inverted.
- **Kept from 1.3.0:** focus keys, depth of field with keep rectangles for titles (TX-19 gains one), foreground parallax.
- **Data beats** take no shot, no light and no blur; the lens runs at 40 percent there.
- **The dial.** Tight zoom, light and lens step down at Tempered. Boardroom has no lens and 35 percent of the zoom.
- The pipeline is twenty passes. Measured cost against the unstaged reel: 12 to 24 percent more frame time in software rendering, on four themes.
- The engine reads `data-plain` on a plate and draws it without this layer, which is how the before-and-after page is built.

## 1.3.0 · 2026-11-13

Reel v6, the staging layer: every theme gains a directed camera, and most gain rack focus and a foreground.

- **Directed camera.** Each non-data beat carries focus keys (where the subject is, and when). The camera pushes toward the subject, follows it as it moves, and settles after each cut. It replaces the generic drift on those beats and never shows past the frame edge.
- **Depth of field.** A new pass softens everything outside the subject, so focus racks from the title to the gauge, down a list, or along a route. TX-19 uses a horizontal band, the miniature look. The flat graphic themes (TX-05, TX-16, TX-18) stay fully sharp.
- **Foreground parallax.** Fourteen themes get particles between the lens and the scene: rain and neon bokeh, ash, sand and embers, petals, paper flecks, data bits, dust. They move further than the scene when the camera moves.
- **Data beats stay clean.** S4 keeps no depth of field and a thinned foreground, so charts read as before.
- **The dial still rules.** Camera travel, blur and particle count step down at Tempered and again at Boardroom.
- The pipeline is now eighteen passes (`canon/pipeline.json`, STC-06, the engine page). Staging lives in `reel/src/stage.js`. Measured cost: about 4 to 7 percent of frame time in software rendering.

## 1.2.0 · 2026-11-11

The reel page now wears the BHIL frame (Brand Guidelines v1.0) around the theme stages, as ADR-005 intended.

- **Brand strips** top and bottom, with the reference line and the copyright: © 2026 · Barry Hurd Intelligence Lab · barryhurd.com.
- **Site header** with the BHIL terminal badge (inline SVG, drawn from the guidelines' anatomy) and links to the reel, About, the docs, GitHub and barryhurd.com.
- **Masthead** in Newsreader over the dot constellation, the page's one motif, with an italic dek and the dial key.
- **About section**: four big numbers, what the reel is, how to use it, how it is built, the rules it keeps, the controls, the licenses and About BHIL.
- **Colophon footer** with version, release date, links, license and the tagline. Version, date, repository and site come from `canon/stagehand.json` at build time.
- Ink, Terminal Navy and one blue replace the amber shell; square corners and hairlines throughout. Body text measures 14.7:1 on the plates.
- On phones the family filters scroll in one row, so the sticky control strip stays short.
- `build_reel.py` inlines italic faces, hashes `canon/stagehand.json` as a reel input, and drops two unused condensed weights.

## 1.1.0 · 2026-11-10

Visual navigation: the README and the docs now show every theme instead of listing it.

- **Start here grid.** Six cards at the top of the README (live reel, roster, codex, agents and prompts, reel engine, figures), each with an image.
- **Visual roster.** One still per theme from the reel at Full, in a four-column grid; each still links to its card. The full roster table is folded underneath.
- **Figure grid.** Thumbnails of STC-01 to STC-10 replace the figure table.
- **Stills on every theme card** and a gallery on the docs roster page.
- `canon/screens.json` picks each theme's frame; `scripts/render_screens.py` renders the stills, thumbnails and two mosaics with the reel paused and seeded (ADR-011).
- The validator checks every still and thumbnail for presence, size and freshness against the reel, canon and the figure PNGs, and rejects stray images. Two new regression tests.

## 1.0.0 · 2026-11-10

First public release: the public edition of the Stagehand Theme Codex (STC v1.0) and the Stagehand Theme Reel (v5).

### Codex

- Twenty theme cards in five families, as canon in `canon/themes.json`, with the Homage Rule, intensity dial, card anatomy and token schema, web slots and build tiers, video kit, safety table, workflow and bench.
- Public edition (ADR-002): codenames only. Inspiration names and the shipped-property ledger stay in the internal brief. A salted, hashed deny list enforces this in CI.
- Guardrails rewritten to name banned elements without the source works' terms; ledger proximity rewritten as collision notes (ADR-003).
- Terms coined by a specific work replaced: TX-01's build and exit moves are now "wire-in" and "shard-out".
- TX-19 SYMMETRY DIORAMA ink moved from `#3D2C2E` to `#3C2B2D` (10.97:1 to 11.13:1) so every ink meets the 11:1 floor as stated (ADR-008).
- Range dashes replaced with "to" throughout.

### Reel

- One self-contained HTML file with twenty stages, beat chips, the three-level dial, a sixteen-pass film pipeline and an adaptive render scale. No network requests.
- Reel history folded in: v1 one-page reel; v2 directed beats and autoplay; v3 post-processing and transitions; v4 film pipeline (grade, bloom, halation, light rays, lens dirt, chromatic aberration, grain, focus pull, letterbox); v5 the data-story layer (build, insight, re-sort, rank on every S4 beat, now 9.5 s).
- `data.js` is now generated from canon. The inspiration field and its toggle are removed. TX-09's crawl reads PART III.
- Build moved to `reel/build_reel.py` with pinned font packages and a freshness hash file.

### Tooling and gates

- Stdlib generators and gates: `build_derived.py`, `verify_drift.py`, `validate.py`, `fit_test.py`, `homage.py`.
- Eighteen regression tests, each named for the bug it prevents, plus the canvas stub sweep of every scene at every level.
- GitHub Actions: quality gate, drift gate, Pages publish with the live reel.

### Agents, prompts and figures

- Seven Claude Code agents (CADRE pattern) with tool isolation enforced against canon; a blind homage auditor (ADR-009).
- Eleven prompts, P00 to P10.
- Ten figures, STC-01 to STC-10, as animated SVG with embedded font subsets and 1600 x 900 PNGs, plus a teaching sequence (ADR-006).
- A worked example, The Port Delay Index, generated from canon with a computed fit test.
