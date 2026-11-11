# ADR-005 · BHIL frame, theme specimens inside

**Status:** Accepted · 2026-11-10

## Context

Twenty themes have twenty palettes and sixty faces. Documentation and figures that adopt any one of them stop being neutral, and a docs site that changes palette page by page is hard to read. BHIL also has one brand system for its own surfaces: BHIL Brand Guidelines v1.0 (Terminal Navy ground, one blue doing the work, Newsreader headlines, IBM Plex for labels and body).

Earlier BHIL repositories used an older cobalt palette; the most recent framework repository moved its docs site to Brand Guidelines v1.0.

## Decision

1. **The frame is always BHIL.** The docs site, figures and launch copy use Brand Guidelines v1.0: Terminal Navy `#0D1B2E`, Ink `#0A0A0A` sub-panels, BH Blue 3 `#1E3A5F` hairlines, BH Blue `#4FA3D1` and BH Blue Bright `#6CC0E8` accents, square corners, no drop shadows, no gradients on motifs.
2. **Theme colors and faces appear only as specimens inside the frame:** swatches on theme pages, tiles and mini charts in figures, the stages in the reel.
3. **Copper `#D97757` marks warnings and anything switched off** (Boardroom gates, the never-ship list). Sage, Stone and Signal are used only for taxonomy (B2B fit, slot coding).
4. No em or en dashes anywhere, enforced on raw bytes across the repository.

## Consequences

- Every page reads the same way, and the themes stand out as the content.
- The brand tokens are recorded in `canon/brand.json`, so figures and the stylesheet read from one place.

## Alternatives considered

- **Theme each docs page in its own theme.** Striking, but it puts twenty contrast and font-loading problems into the documentation. Rejected.
- **Older cobalt palette.** Rejected in favor of the current guidelines.
