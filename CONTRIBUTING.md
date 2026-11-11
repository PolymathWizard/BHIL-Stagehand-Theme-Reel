# Contributing

Thank you for helping. This repository has a few firm rules because it makes promises: every theme is the theme in the codex, nothing names a franchise, nothing flashes, and nothing reaches the network.

## The rules

1. **Canon first.** Theme facts live in `canon/*.json`. Generated files (they open with "Generated from canon") are never edited by hand. Change canon, then run `python3 scripts/build_derived.py`.
2. **Codenames only.** No franchise, studio, character or product names, invented terms or quotes, anywhere: code, comments, docs, commit messages, issue titles. The validator checks every file against a hashed deny list. If it flags your file, rephrase.
3. **No em or en dashes.** Use commas, colons, parentheses or "to" for ranges. The dash gate reads raw bytes.
4. **Safety at every level.** No more than three flashes a second, ambient flicker at 3% opacity or less and 2 Hz or less, no full-frame flashes, a pause for anything continuous.
5. **Open-license fonts only** (SIL OFL or Apache 2.0), recorded in `canon/fonts.json`.
6. **Ink at 11:1 or better** on every theme ground, measured.

## Workflow

```bash
git checkout -b feat/your-change
# edit canon or sources
python3 scripts/build_derived.py
cd reel && npm ci && python3 build_reel.py && cd ..          # if you touched the reel or theme tokens
python3 scripts/figures.py && python3 scripts/render_figures.py  # if you touched canon the figures read
python3 scripts/render_screens.py                                # if you rebuilt the reel or the figures
python3 scripts/validate.py
python3 scripts/verify_drift.py
python3 -m unittest discover -s tests
node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html
mkdocs build --strict
```

The reel, figure and screenshot builders need `pip install fonttools brotli playwright pillow` and `npx playwright install chromium` (or set `CHROME` to a local Chrome). The gates need nothing beyond Python 3.10+ and Node 18+.

## Commits

Conventional commits, scoped to `stagehand`:

```text
feat(stagehand): TX-21 card and scene
fix(stagehand): clamp TX-12 scale morph ease
docs(stagehand): clarify the ledger rule
chore(stagehand): rebuild reel after font update
```

## Adding a theme

Use prompt P09 (card) and P10 (scene). A theme lands with: a complete card, a family entry, a scene with a 9.5 s data beat, rebuilt derived files, a rebuilt reel, refreshed figures, passing gates, and a changelog line. Bench entries in `canon/bench.json` graduate the same way.

## Regression tests

Every test's docstring names the bug it prevents. If you fix a bug, add the test that would have caught it, and name the bug.

## Reporting safety or homage problems

See [SECURITY.md](SECURITY.md). Flash problems are release blockers.
