# ADR-001 · Canon is the only source

**Status:** Accepted · 2026-11-10

## Context

The codex began as one long document, and the reel began with its own copy of the theme data in a JavaScript file. Two copies of the same tokens drift: during the reel's five passes, the reel's data and the codex document were kept in step by hand. A public repository adds more places the same facts appear: theme pages, token files, reference tables, the README, the figures. Every extra copy is another chance to ship a palette that the codex does not say.

## Decision

`canon/*.json` is the single source of truth. Everything else that states a fact about a theme is derived from it:

| Derived artifact | Generator |
| --- | --- |
| `reel/src/data.js` | `scripts/build_derived.py` |
| `tokens/` (scoped CSS, per-theme CSS, design-token JSON) | `scripts/build_derived.py` |
| `docs/themes/`, `docs/codex/`, `docs/reference/`, three reel pages, the worked example | `scripts/build_derived.py` |
| README roster, figure table and counts (between markers) | `scripts/build_derived.py` |
| `MANIFEST.sha256` | `scripts/build_derived.py` |
| Figures | `scripts/figures.py` (non-stdlib, freshness-gated) |
| The built reel | `reel/build_reel.py` (non-stdlib, freshness-gated) |

Generated files open with a "Generated from canon" comment. `scripts/verify_drift.py` regenerates everything in memory and fails on any byte that differs, and on any file in a generated folder that the generator did not produce.

The reel's scene code is not canon. It is source, and its beat lists are read back out of it by the generator, so the docs describe what the reel actually plays.

## Consequences

- A change to a theme is one edit in `canon/themes.json` followed by one command.
- The reel cannot claim a token the codex does not hold, because its data file is generated.
- Prose that explains *why* lives in hand-written pages and ADRs; prose that states *what* lives in canon.
- Contributors must learn which files are generated. The comment header and the drift gate's error message tell them.

## Alternatives considered

- **Hand-maintained docs with a lint.** Cheaper to start, but a lint can only check what it knows to look for. Rejected.
- **Make the reel's `data.js` the source.** JavaScript is a poor home for long prose fields and is harder for agents to edit safely. Rejected.

## Settling criteria

Revisit if a derived artifact needs content that cannot be expressed in canon without contortion. Until then, any new artifact that states theme facts gets a generator, not a hand-written file.
