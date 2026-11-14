# ADR-012 · Staging layer: directed camera, rack focus, foreground

**Status:** Accepted · 2026-11-13

## Context

Through v5 the reel's camera drifted the same way on every beat: a slow zoom and a small pan, whatever the scene was showing. Every pixel sat at the same depth and the whole frame was equally sharp. The scenes had subjects (a title, a gauge, a plane on a route) but nothing in the engine knew where they were, so nothing could direct the eye to them.

## Decision

1. **Focus keys per beat.** `reel/src/stage.js` gives each non-data beat a short list of keys `[p, x, y, r]`: at beat progress `p` the subject is at scene point `(x, y)` and is sharp inside radius `r`. Keys are eased, so focus racks from one subject to the next.
2. **The camera follows the keys.** It pushes in on the subject, follows it, and settles after each cut. Travel is small (zoom 1.5 to 4.5 percent by default) and clamped so the frame edge never shows and edge titles are not cropped.
3. **Depth of field is one pass.** A quarter-size blurred copy of the frame, cut away around the subject, is laid back over the sharp frame. TX-19 uses a horizontal band. Flat graphic themes set it to zero. A theme can name a keep rectangle, its title block, that never blurs.
4. **Foreground parallax is one pass.** Per-theme particles are drawn in screen space and move further than the scene when the camera moves.
5. **Data beats are not staged.** S4 has no keys: no blur, the generic camera, and a thinned foreground. A regression test enforces it.
6. **The dial scales all three,** and depth of field is skipped below render scale .75.

## Consequences

- Each scene now reads as shot rather than displayed: there is a subject, a move and a near layer.
- A new or changed beat needs its focus keys updated, or the focus will sit in the wrong place. The test catches a count mismatch, not a wrong position.
- About 4 to 7 percent more frame time, measured in software rendering.
- Outside the subject the blurred copy is blended, not a true lens blur, so very high-contrast shapes can show a faint double edge.

## Alternatives considered

- **Rebuild each scene in layers with true depth.** Rejected for now: twenty rewrites, and the screen-space pass gets most of the effect.
- **Stage the data beats too.** Rejected: a chart must be readable edge to edge.
