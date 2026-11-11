# Worked example: The Port Delay Index

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

A fictional brief taken through the eight moves. The fit test below is computed from canon by `scripts/fit_test.py`, so it changes if a card changes.

## The brief

**Halden Freight (fictional).** A quarterly B2B intelligence brief for Halden Freight, a fictional regional freight operator. It scores twelve ports on delay risk, flags the three that crossed the warning line this quarter, and recommends where to reroute. The audience is the operations leadership team; the format is a scroll page plus a 30-second video trailer.

## 1. U1 essence

Essence words: **monitoring, precision, systems, warning, compliance**. Dominant data shape: **score**. Register: **B2B**.

## 2. Fit test

Only themes with at least one essence match are shown. A theme passes with two or more matches and the right data shape.

| Theme | Matches | Fit | Shape | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| [TX-03 GLASS HUD](themes/tx-03-glass-hud.md) | monitoring, precision | 2/5 | yes | passes, blocked | used in the last two builds (ledger) |
| [TX-08 COLD STORAGE](themes/tx-08-cold-storage.md) | systems, warning | 2/5 | yes | eligible |   |
| [TX-01 VECTOR GRID](themes/tx-01-vector-grid.md) | precision | 1/5 | no | fails |   |
| [TX-17 SILHOUETTE & SMOKE](themes/tx-17-silhouette-smoke.md) | precision | 1/5 | yes | fails | Tempered is the ceiling, so it cannot serve a B2B register |
| [TX-20 LIMINAL OFFICE](themes/tx-20-liminal-office.md) | compliance | 1/5 | yes | fails |   |

```text
python3 scripts/fit_test.py --words "monitoring, precision, systems, warning, compliance" --shape score --register b2b --ledger TX-03
```

## 3. Triptych

At most one concept is theme-led, so the comparison stays honest.

| Concept | Kind | Direction |
| --- | --- | --- |
| A | Theme-led | TX-08 COLD STORAGE at Boardroom: the port network drawn as a vector wireframe on a green console, segmented meters for each port's score, amber at the warning line. |
| B | Theme-free | A plain ranked list that re-sorts as the reader scrubs the quarter, with the three warning ports pinned to the top. |
| C | Theme-free | A map-first page: twelve ports sized by delay score, with the reroute recommendation drawn as a single line. |

## 4. Ledger

The last build shipped TX-03 GLASS HUD, so the ledger blocks it here even though it passes the fit test. Collision note for the pick: Sits near security builds with heap-grid or sonar signatures. Prefer non-security subjects, or a different S1 family when either shipped recently.

## 5. Dial

B2B register, so Boardroom. TX-08 COLD STORAGE: runs at boardroom as is. Boardroom translation: *Ready as is. Drop phosphor trails and blinking; keep the terminal grammar and segmented meters.*

## 6. Slots

S1 comes from the subject; the theme dresses it. The port network draws onto the console as a vector wireframe, one port at a time, beside a live readout of the index. The wireframe is the subject's own network, not a generic terrain.

| Slot | Card fill | At Boardroom |
| --- | --- | --- |
| S1 | a monochrome vector wireframe (terrain, schematic or data structure) drawing onto a CRT beside live status readouts (DrawSVG + CSS scanlines, T1 to T2). | Keep |
| S2 | terminal type-on section heads (TextPlugin; real text in the DOM). | Keep, calm |
| S3 | CRT vignette, 2% scanlines, a faint hum flicker at 3% opacity or less and 2 Hz or less. | Keep, calm |
| S4 | segmented bar meters, 7-segment counters, blinking threshold lamps. | Keep |
| S5 | hardware-key buttons with pressed states. | Keep, calm |

## 7. Swap test and safety

Guardrails for TX-08: No ship or onboard-computer names, no creature, egg or biomechanical forms, no film corporation logos, no franchise wordmark. Nothing in the plan needs a property to make sense, so homage-check is PASS.

| Safety risk | Rule |
| --- | --- |
| Flashing and flicker | Never more than 3 flashes per second (WCAG 2.3.1). Ambient flicker stays at 3% opacity or less and 2 Hz or less. No full-screen flashes. |
| Text over moving texture | Add a scrim. Measure contrast on the worst frame at 4.5:1 or better. Noise overlays stay at 8% or less inside text zones. |
| Sound | Never autoplay. Muted by default with a clear toggle. No hover sounds in B2B. |

## 8. Manifest

```text
theme: TX-08 COLD STORAGE · boardroom · fit 2/5 · homage-check PASS
chapter step-up: None. The whole property stays at Boardroom.
audio: Original drone bed, 30 s, licensed to the build.
flash test: Not required: Boardroom drops blinking and the video has no flicker cuts.
```
