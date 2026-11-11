# ADR-011 · Reel stills for navigation

**Status:** Accepted · 2026-11-10

## Context

The README listed the twenty themes as a text table. A reader choosing a theme had to open each card or the live reel to see what it looks like, and GitHub cannot run the reel inline. The figures were listed the same way. Navigation needed pictures, and the pictures had to stay honest: a still that drifts from the reel would show a theme that no longer exists.

## Decision

1. **One still per theme, taken from the built reel.** `canon/screens.json` records which beat and which second best represents each theme. `scripts/render_screens.py` pauses the reel before its first frame, seeds `Math.random`, renders each chosen moment into the canvas backing store at 1600 x 900 and saves an 800 x 450 JPEG to `docs/assets/screens/<slug>.jpg`. All stills are at Full.
2. **The README is a visual index.** A generated start-here grid (six cards), a four-column roster grid (each still links to its card, with the full roster table folded under it) and a two-column figure grid built from 640 x 360 thumbnails of the figure PNGs. GitHub drops CSS in READMEs, so the grids are HTML tables with explicit image widths.
3. **Theme cards and the docs roster show the same still,** so the README, the docs site and the reel agree.
4. **Freshness by hash, like the reel and the figures.** `docs/assets/screens/SOURCES.sha256` hashes the reel build, `canon/screens.json`, the script and every figure PNG. The validator fails on a stale hash, a missing or wrongly sized image, an image over 150 KB, or a JPEG that canon does not name.
5. **Rendering is non-stdlib** (Playwright and Pillow) and runs locally; CI only checks the committed output with stdlib code.

## Consequences

- A reader can scan all twenty themes in one screen and click straight to a card.
- Any change to the reel marks the stills stale until someone runs `python3 scripts/render_screens.py`.
- About 1.1 MB of JPEGs in the repository.
- Stills show one moment of a loop. The reel is still the only place to judge motion.

## Alternatives considered

- **Animated GIF or video per theme.** Rejected: ten to fifty times the weight, and autoplaying motion in a README cannot honor reduced motion.
- **Screenshots taken by hand.** Rejected: they drift silently and nobody can reproduce them.
- **Linking the reel only.** Rejected: GitHub cannot run it inline, and it does not help a reader who is scanning.
