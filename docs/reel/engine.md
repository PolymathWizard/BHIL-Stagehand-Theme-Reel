# The reel engine

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

The reel is one HTML file: twenty canvases, one shared engine, and a film pipeline that runs after every scene draw. The engine is plain JavaScript with no dependencies.

## Render order

| # | Pass | What it does | Dial |
| --- | --- | --- | --- |
| 1 | Scene draw | Inside the camera transform; one function per theme | All levels |
| 2 | FX and sheen | Per-theme effects and specular text sweeps, still in camera space | All levels |
| 3 | Persistence | Previous frame blended with lighten for light trails | x.60 Tempered, off at Boardroom |
| 4 | Focus pull | Blur resolves at each cut | All levels |
| 5 | Bloom | Bright-pass at quarter and twelfth resolution, added back | x.80 Tempered, x.45 Boardroom |
| 6 | Halo | Tinted halation around highlights | x.80 Tempered, x.50 Boardroom |
| 7 | Light rays | Radial zoom from the bloom buffer | x.80 Tempered, x.40 Boardroom |
| 8 | Lens dirt | Bloom multiplied by a dirt texture | x.70 Tempered, off at Boardroom |
| 9 | Grade | Filter grade, soft-light tint and screen lift | Filter runs at render scale .75 or better |
| 10 | Chromatic aberration | Red channel scaled outward | x.60 Tempered, off at Boardroom |
| 11 | Grain | 24 fps overlay grain | x.50 Boardroom |
| 12 | Tilt-shift | Per-theme post pass | All levels |
| 13 | Overlays | Crisp text drawn above the film look | All levels |
| 14 | Transition | Snapshot of the last beat played out with the theme's transition | Calm styles only at Boardroom |
| 15 | Letterbox | Optional 2.39:1 bars | All levels |
| 16 | Beat chips | DOM chips track the beat and jump on click | All levels |

## Quality governor

- Device pixel ratio capped at 1.5; the canvas is capped at 1600 px wide.
- Frame time is averaged. Above 26 ms the render scale drops by 18%, with a floor of 50%; under 18 ms it climbs back.
- Grade, chromatic aberration and lens dirt run only at render scale .75 or better.

## Scene API

```js
SCENES['TX-01'] = {
  beats: [['S1', 'Wire-in hero', 6], ...],
  init(s) { /* seeded state */ },
  draw(s, t, B, dt) { /* one frame */ }
};
```

- B = { i, t, d, p, n, tc, start }: beat index, time in beat, beat duration, progress, beat count, time in cycle, beat start.
- s = { th, scene, c, cv, k, W, H, R, st, t, lvl, pointer, q, P }: theme, scene, context, canvas, scale, logical size 960 x 540, seeded random, scene state, clock, level, pointer, render scale, post config.

Each scene draws in a logical 960 x 540 space; the engine scales it to the device. See [Building the reel](building.md) for adding a scene.
