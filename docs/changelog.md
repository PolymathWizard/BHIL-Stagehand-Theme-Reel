<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. Source: CHANGELOG.md -->
# Changelog

All notable changes to this repository. Versions follow semantic versioning; commits follow conventional commits scoped to `stagehand`.

## 1.0.0 · 2026-11-10

First public release: the public edition of the Stagehand Theme Codex (STC v1.0) and the Stagehand Theme Reel (v5).

### Codex

- Twenty theme cards in five families, as canon in `canon/themes.json`, with the Homage Rule, intensity dial, card anatomy and token schema, web slots and build tiers, video kit, safety table, workflow and bench.
- Public edition (ADR-002): codenames only. Inspiration names and the shipped-property ledger stay in the internal brief. A salted, hashed deny list enforces this in CI.
- Guardrails rewritten to name banned elements without the source works' terms; ledger proximity rewritten as collision notes (ADR-003).
- Terms coined by a specific work replaced: TX-01's build and exit moves are now "wire-in" and "shard-out".
- TX-19 SYMMETRY DIORAMA ink moved from `#3D2C2E` to `#3C2B2D` (10.97:1 to 11.13:1) so every ink meets the 11:1 floor as stated (ADR-008).
- Range dashes replaced with "to" throughout.

### Reel

- One self-contained HTML file with twenty stages, beat chips, the three-level dial, a sixteen-pass film pipeline and an adaptive render scale. No network requests.
- Reel history folded in: v1 one-page reel; v2 directed beats and autoplay; v3 post-processing and transitions; v4 film pipeline (grade, bloom, halation, light rays, lens dirt, chromatic aberration, grain, focus pull, letterbox); v5 the data-story layer (build, insight, re-sort, rank on every S4 beat, now 9.5 s).
- `data.js` is now generated from canon. The inspiration field and its toggle are removed. TX-09's crawl reads PART III.
- Build moved to `reel/build_reel.py` with pinned font packages and a freshness hash file.

### Tooling and gates

- Stdlib generators and gates: `build_derived.py`, `verify_drift.py`, `validate.py`, `fit_test.py`, `homage.py`.
- Eighteen regression tests, each named for the bug it prevents, plus the canvas stub sweep of every scene at every level.
- GitHub Actions: quality gate, drift gate, Pages publish with the live reel.

### Agents, prompts and figures

- Seven Claude Code agents (CADRE pattern) with tool isolation enforced against canon; a blind homage auditor (ADR-009).
- Eleven prompts, P00 to P10.
- Ten figures, STC-01 to STC-10, as animated SVG with embedded font subsets and 1600 x 900 PNGs, plus a teaching sequence (ADR-006).
- A worked example, The Port Delay Index, generated from canon with a computed fit test.
