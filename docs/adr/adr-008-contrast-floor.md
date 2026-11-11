# ADR-008 · Contrast floor of 11:1, enforced

**Status:** Accepted · 2026-11-10

## Context

STC v1.0 states that every card's ink measures 11:1 or better on its ground, checked on 2026-11-06. While building this repository, the generator computed every pair with the WCAG 2.x relative-luminance formula. Nineteen themes passed with room to spare. TX-19 SYMMETRY DIORAMA measured **10.97:1** (ink `#3D2C2E` on ground `#F7E8DC`), which rounds to 11.0 but does not meet it.

## Decision

1. The floor is **11:1, measured, not rounded.** The validator fails any theme below it and `test_every_ink_reaches_eleven_to_one` names the TX-19 case.
2. TX-19's ink moves from `#3D2C2E` to **`#3C2B2D`**, which measures 11.13:1. This is a lightness shift of about one percent and keeps the hue, which the codex's token rules allow ("hue is fixed, lightness flexes").
3. The contrast of every ink and accent is published on [the contrast page](../reference/contrast.md), generated at build time. Accents under 3:1 are labeled *fill only*.

## Consequences

- The claim on every card is now true as stated, and checked on every commit (claim CL-01).
- The reel, tokens and figures picked up the new TX-19 ink through the normal rebuild.
- The internal brief should take the same change at its next quarterly pass.

## Alternatives considered

- **Lower the claim to "about 11:1."** Rejected: a floor that rounds is not a floor.
- **Lighten the ground instead.** Rejected: the pastel ground is the theme's identity; the ink had room to move.
