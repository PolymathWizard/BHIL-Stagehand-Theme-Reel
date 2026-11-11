# Safety and accessibility for themed motion

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

These rules apply at every intensity. Genre looks lean on flicker, glitch and constant motion, which are exactly the patterns the hard gates exist to contain.

| Risk | Themes most exposed | Rule |
| --- | --- | --- |
| Flashing and flicker | TX-04, 05, 06, 07, 08, 11, 14, 20 | Never more than 3 flashes per second (WCAG 2.3.1). Ambient flicker stays at 3% opacity or less and 2 Hz or less. No full-screen flashes. |
| Glitch and chroma split | TX-02, 05, 06, 18 | Bursts of 200 ms or less, never on body text, off under reduced motion. |
| Continuous motion over 5 s | TX-01, 02, 04, 07, 09, 10, 12, 15, 17 | A visible pause control (WCAG 2.2.2) or an automatic stop at 5 s. Reduced motion gets a still poster. |
| Text over moving texture | TX-02, 04, 06, 07, 08 | Add a scrim. Measure contrast on the worst frame at 4.5:1 or better. Noise overlays stay at 8% or less inside text zones. |
| Perspective or 3D text | TX-09, 20 | A full plain-text equivalent in the DOM plus a skip control. |
| Fast cuts and crash zooms | TX-11, 19 | Reduced motion swaps them for crossfades. Keep subjects centered. |
| Non-English glyphs used as texture | TX-02, 04 | Real, correctly written words, or none at all. |
| Sound | All | Never autoplay. Muted by default with a clear toggle. No hover sounds in B2B. |

The reel itself is covered in [ADR-007](../adr/adr-007-reel-autoplay.md).
