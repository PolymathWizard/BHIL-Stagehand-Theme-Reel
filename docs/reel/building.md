# Building the reel

## Build

```bash
cd reel
npm ci                              # installs the open-license @fontsource packages (pinned)
pip install fonttools brotli        # woff2 subsetting
python3 build_reel.py               # writes reel/dist/stagehand-theme-reel.html and SOURCES.sha256
cd ..
node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html
python3 scripts/validate.py
```

`build_reel.py` reads `canon/themes.json` and `canon/families.json` for the plates, concatenates the sources in a fixed order (`data.js`, `helpers.js`, `dataviz.js`, the four scene files, `fx.js`, `cine.js`, `engine.js`), subsets every face the themes and the interface use to Latin plus the glyphs the reel draws, and inlines the result as base64 woff2. The output is one file of about 1 MB.

It also writes `reel/dist/SOURCES.sha256`, the hashes of every input. The validator recomputes them, so a source change without a rebuild fails CI with the name of the stale input. This is how a non-stdlib build stays inside stdlib gates ([ADR-004](../adr/adr-004-self-contained-reel.md)).

## Add or change a scene

Scenes live in `reel/src/scenes-a.js` to `scenes-d.js`. A scene is an object on `SCENES`:

```js
SCENES['TX-21'] = {
  beats: [['S1', 'Opening signature', 6], ['S2', 'Section handoff', 4], ['S4', 'Data skin: build, insight, re-sort', 9.5], ['S5', 'The one action', 3]],
  init(s) { /* seeded state: s.R() is a deterministic random generator */ },
  draw(s, t, B, dt) {
    const { c, W, H, lvl } = s, T = s.th.tok;       // context, 960 x 540 logical size, level 0 Full, 1 Tempered, 2 Boardroom
    if (B.i === 2) DATA4['TX-21'](s, t, B, {});    // hand the data beat to the shared data-story layer
  }
};
```

Rules that keep scenes safe and comparable:

1. **Draw in 960 x 540 logical units.** The engine scales to the device and caps the pixel ratio.
2. **Respect the level.** Read `s.lvl` and calm down at Tempered and Boardroom: no flicker, no stutter, no stepped frames at Boardroom. Themes capped at Tempered use `Math.min(s.lvl, 1)`.
3. **Use the shared data story.** Every S4 beat runs 9.5 s and calls into `dataviz.js`, so it builds, lands an insight, re-sorts and ranks like the rest.
4. **Never flash.** Ambient flicker stays at 3% opacity or less and 2 Hz or less; no full-frame flashes.
5. **Clamp your eases.** `eio` and `eo` in `helpers.js` do not clamp; wrap inputs in `clamp()` or use `pin()` and `pout()`.
6. **Keep geometry finite and radii non-negative.** The stub sweep fails on `NaN`, `Infinity` and negative radii.
7. **Codenames only.** No franchise names, terms or quotes in labels or on-screen text. The validator scans the sources with the hashed deny list.

Then add the theme's card to canon (prompt P09), rebuild derived files, rebuild the reel, and run the gates. Prompt P10 walks the whole sequence.

## The stub sweep

`tests/reel_stub_sweep.js` runs every scene at every level through its whole loop at 30 fps against a strict mock of the 2D context. The mock throws on non-finite arguments, negative radii, malformed colors, gradient stops out of range and unknown composite modes. It caught the negative-radius bug in the TX-06 data beat before any browser did. CI runs it at 1.25 loops; run it longer locally when you change timing:

```bash
node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html 2.5
```
