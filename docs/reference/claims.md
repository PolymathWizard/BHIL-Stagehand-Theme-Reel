# Claims and evidence

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

Every factual claim this repository makes carries an evidence tier: VERIFIED (checked directly), CORROBORATED (two or more independent sources), STATED (one source says so), UNCORROBORATED, or INFERENCE.

| ID | Tier | Claim | Basis |
| --- | --- | --- | --- |
| CL-01 | VERIFIED | Every theme's ink on its ground measures 11:1 or better. | Computed by scripts/build_derived.py with the WCAG 2.x relative-luminance formula; listed on the contrast reference page and gated by the validator. |
| CL-02 | VERIFIED | All 48 font families the reel and figures use are licensed SIL OFL 1.1 or Apache 2.0. | License field of each @fontsource package manifest, recorded in canon/fonts.json on 2026-11-10. |
| CL-03 | VERIFIED | The built reel is one self-contained HTML file that requests nothing from the network. | The validator scans reel/dist for src, href and url() references to http or https; only plain anchor links are allowed. |
| CL-04 | VERIFIED | Every S4 data beat in the reel runs 9.5 seconds, and every loop runs 21 to 26.3 seconds. | Parsed from the beats arrays in reel/src/scenes-*.js by the build and checked by a regression test. |
| CL-05 | VERIFIED | The reel exposes one global Pause control and per-plate beat chips; motion plays on load. | reel/src/engine.js and shell.html. |
| CL-06 | VERIFIED | Under 26 ms average frame time the reel holds full render scale; above it the scale steps down to a 50% floor. | Adaptive loop in reel/src/engine.js. |
| CL-07 | STATED | Content must not flash more than three times in any one-second period. | W3C WCAG 2.2, Success Criterion 2.3.1 Three Flashes or Below Threshold. [Source](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold) |
| CL-08 | STATED | Moving content that starts automatically and lasts more than five seconds needs a way to pause, stop or hide it. | W3C WCAG 2.2, Success Criterion 2.2.2 Pause, Stop, Hide. [Source](https://www.w3.org/TR/WCAG22/#pause-stop-hide) |
| CL-09 | STATED | PEAT is a free photosensitive epilepsy analysis tool from the Trace Research and Development Center. | Trace Center's PEAT page. [Source](https://www.trace.umd.edu/?p=1669) |
| CL-10 | STATED | B612 was drawn for legibility on aircraft cockpit screens. | The B612 project's own description. |
| CL-11 | INFERENCE | A visual style cannot be owned, while logos, characters and specific creative expression can. | The working position behind the Homage Rule. It is a design rule, not legal advice; escalate any licensed-look request. |
| CL-12 | INFERENCE | Composition- and rhythm-led themes (family E) survive the Boardroom dial better than glitch-led ones (family B). | Read from the B2B fit column: three of five family E themes run at Boardroom as is, against one of four in family B. |
