# ADR-013 · Cinematography layer: shots, key light, lens

**Status:** Accepted · 2026-11-13 · extends ADR-012

## Context

ADR-012 gave the reel focus keys, a camera that leaned toward the subject, depth of field and a foreground. Side by side with the reel before it, the difference was real but quiet: the camera moved a few percent, so most frames looked the same. The owner asked for the pass to be redone at a much higher level. The focus keys already said where each subject is; they were being used timidly.

## Decision

1. **A beat is a shot.** From the same focus keys the engine builds one of three shots. *Reveal* opens tight on the first subject and pulls back to the wide by the middle of the beat. *Tour* stays tight, travels through the subjects and pulls back at the end. *Push* holds the wide, then moves in on the last subject. S1 beats reveal unless the theme sets `s1: 'tour'`; S2 and S5 push. Tight zoom is 1.3 on S1, 1.09 on S2 and 1.14 on S5, so a push never crops much of a heading.
2. **A reveal holds its first subject** until the wide, then follows the live focus, so a title is not cut while the camera is still tight.
3. **Key light is one pass.** A radial falloff to shadow around the subject, plus a small glow in the theme accent. It uses the same position as the depth of field, so light and focus move together. Themes on a light ground set it to zero.
4. **Lens is one pass, one model per theme.** The frame is copied and drawn back in strips or tiles: tube curvature, heat shimmer in a band, liquid ripple, a twelve-per-second boil, or rain drops that draw the scene behind them inverted. Six themes have no lens because nothing in their genre calls for one.
5. **Limits.** Data beats take no shot, light or blur and 40 percent of the lens. Boardroom takes no lens. The lens and depth of field are skipped below render scale .75. Nothing here flashes: every lens motion is a slow displacement.
6. **`data-plain` on a plate** draws that stage without the layer, for comparisons.

## Consequences

- The difference from the unstaged reel is visible in almost every frame of a staged beat.
- Tight shots crop what is outside them, titles included, as a tight shot does. The wide always arrives.
- 12 to 24 percent more frame time in software rendering.
- The tube curvature bends rows only, and corners fall to black, so it suits dark-ground themes.

## Alternatives considered

- **Raise the zoom of ADR-012's camera.** Rejected: a bigger lean is still a lean. Shots have a beginning and an end.
- **True per-pixel lens distortion.** Rejected: too slow on a 2D canvas at this size; strips are close enough at these strengths.
