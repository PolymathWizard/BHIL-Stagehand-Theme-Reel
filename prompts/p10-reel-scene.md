# P10 · Reel scene for a theme

**Agent:** `reel-engineer` · **Stage:** C · **Model:** Sonnet

## Purpose

Give a theme its stage in the reel: a directed loop through its slot map, safe at every level, with a data beat that tells the shared four-part story.

## Inputs

- The card (`docs/themes/<slug>.md`).
- `reel/src/scenes-*.js` for the house style of scenes in the same family.
- `reel/src/dataviz.js` for the data story helpers.

## Prompt

```text
Write the reel scene for {{TX-## CODENAME}}.

Beats: three to five, each [slot, label, seconds]. Include exactly one S4 beat of
9.5 seconds. Labels describe the move in plain words; no franchise terms.

Draw in 960 x 540 logical units. Read s.lvl:
- 0 Full: everything on the card within the flash limits;
- 1 Tempered: glitch, stutter and chroma become short accents;
- 2 Boardroom: none of them; follow the card's Boardroom translation.
If the card's ceiling is Tempered, use Math.min(s.lvl, 1).

S4 hands off to DATA4['{{TX-##}}'] in dataviz.js: build (0.3 to 2.0 s), insight
(2.8 to 5.5 s: average line, leader lit, callout), re-sort (5.6 to 7.2 s), rank
(7.0 s on). Use SAMPLE values only and label them SAMPLE.

Clamp every ease input. Keep geometry finite and radii non-negative. No flashes over
three per second; ambient flicker at 3% opacity or less and 2 Hz or less.
```

## Build and verify

```bash
python3 scripts/build_derived.py
cd reel && python3 build_reel.py && cd ..
python3 scripts/render_screens.py      # README and card stills; a new theme needs its frame in canon/screens.json first
node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html 2.5
python3 -m unittest discover -s tests
python3 scripts/validate.py
```

Then view the scene in a browser at all three levels and check: labels do not collide with the level flag or the letterbox; callouts stay inside the frame; the Boardroom version is calm; the data beat lands its insight before it re-sorts.

## Post settings

Add an entry to `POST` in `fx.js` (bloom, threshold, transition style, camera) and, if the theme needs it, to `CINE` in `cine.js` (grade, rays, dirt, chromatic aberration, halo, grain, sheen). Keep calm transition styles available at Boardroom.

## Checks

- [ ] One S4 beat, 9.5 s.
- [ ] Stub sweep passes at 2.5 loops.
- [ ] Viewed at Full, Tempered and Boardroom.
- [ ] No franchise words in labels or on-screen text (the validator scans).
- [ ] `reel/dist/SOURCES.sha256` updated by the build.
- [ ] A still picked in `canon/screens.json` and `docs/assets/screens/SOURCES.sha256` refreshed by `render_screens.py`.

## Failure modes

| Failure | Guard |
| --- | --- |
| A data beat that ends before the re-sort | 9.5 s rule, regression test |
| An unclamped ease that overshoots to 5x | Clamp, and the stub sweep |
| A Boardroom version that still flickers | View all levels; flicker gated by s.lvl |

## Commit

`feat(stagehand): TX-## scene with data beat`
