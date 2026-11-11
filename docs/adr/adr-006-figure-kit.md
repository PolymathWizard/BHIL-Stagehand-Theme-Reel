# ADR-006 · The figure kit

**Status:** Accepted · 2026-11-10

## Context

The repository needs visuals that work in three places with different constraints: a GitHub README (images only, no scripts, served through a proxy), the docs site, and teaching material (slides, handouts, LMS uploads). SVG referenced from a README renders through an `<img>` tag, which blocks external fonts, so most SVG figures fall back to system faces on GitHub.

## Decision

1. **Ten figures, STC-01 to STC-10,** each covering one idea: the roster, families and fit, card anatomy, slots and beats, the dial, the engine, the data beat, the twenty skins, the Homage Rule, and the agent workflow. Their metadata (title, placement, what each teaches, an exercise) lives in `canon/figures.json`.
2. **Each figure ships twice:** an animated SVG (CSS keyframes only, slow, small-area motion, frame zero is a designed static state) and a 1600 x 900 PNG of that static state.
3. **Fonts are embedded per figure** as woff2 subsets containing only the glyphs that figure uses. Data-URI fonts inside an SVG survive the `<img>` context, so GitHub renders the exact type. This was checked by rendering a figure through an `<img>` tag and comparing it to the direct render.
4. **Every SVG stops all motion under `prefers-reduced-motion: reduce`** and hides animation-only overlays, leaving the designed static frame.
5. **No scripts, no external references, no `<image>` elements,** a title and a long description on every figure, and a 120 KB budget.
6. Generation is non-stdlib (fontTools for subsetting, Playwright for PNGs) and is freshness-gated like the reel: `docs/assets/figures/INPUTS.sha256` covers canon, scripts and scene sources; `png/SOURCES.sha256` covers the SVGs.

## Consequences

- Figures are exact on GitHub, on the docs site and in slides.
- STC-08 is the largest at about 96 KB because it embeds twenty display faces.
- A canon change marks the figures stale until someone runs the two scripts.

## Alternatives considered

- **PNG only.** Rejected: no motion, and blurry on high-density screens.
- **SVG text converted to paths.** Rejected: larger files, and the text stops being text for search and assistive tech.
