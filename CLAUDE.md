# CLAUDE.md · working in BHIL-Stagehand-Theme-Reel

You are working in the public edition of the Stagehand Theme Codex (STC v1.0) and its reel (v5). Read this before changing anything.

## Non-negotiables

- **Codenames only.** Never write a film, series, studio, character or product name, an invented term from a work, or a quote, in any file, comment, commit message or reply that might be pasted into the repo. The validator scans everything with a hashed deny list (`scripts/homage.py`).
- **Canon is the source.** Edit `canon/*.json`, then run `python3 scripts/build_derived.py`. Never hand-edit a file that starts with "Generated from canon", including `reel/src/data.js`.
- **No em or en dashes.** Anywhere.
- **Safety.** Three flashes a second at most; ambient flicker 3% opacity and 2 Hz at most; no full-frame flashes.
- **Contrast.** Ink at 11:1 or better, measured.

## Commands

```bash
python3 scripts/build_derived.py      # regenerate docs, tokens, data.js, README blocks, manifest
python3 scripts/validate.py           # quality gate
python3 scripts/verify_drift.py       # drift gate
python3 -m unittest discover -s tests # regression tests
node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html
python3 scripts/fit_test.py --words "a, b, c, d, e" --shape score --register b2b
cd reel && python3 build_reel.py      # rebuild the reel (needs npm ci, fonttools, brotli)
python3 scripts/figures.py && python3 scripts/render_figures.py   # rebuild figures (fonttools, playwright)
mkdocs build --strict
```

## Agents

Seven agents live in `.claude/agents/`. Start themed work with `stagehand-director` and prompt P00. The `homage-auditor` is read-only and grades blind: never pass it design rationale. Tool lists are enforced against `canon/agents.json`.

## Layout

| Path | What |
| --- | --- |
| `canon/` | Source of truth: themes, families, dial, slots, homage, workflow, pipeline, safety, video, bench, fonts, claims, agents, prompts, figures, examples |
| `reel/src/` | Reel sources (scenes, data story, effects, engine, shell); `data.js` is generated |
| `reel/dist/` | The built reel and its input hashes |
| `tokens/` | Generated CSS and JSON tokens |
| `docs/` | MkDocs site; themes, codex, reference and three reel pages are generated |
| `docs/assets/figures/` | Figure kit: svg, png, input and output hashes |
| `prompts/` | P00 to P10 |
| `scripts/` | Generators, gates and the two non-stdlib builders |
| `tests/` | Regression tests and the canvas stub sweep |
| `internal/` | Gitignored. The deny-list source. Never commit it, never read it into a reply. |

## Commit style

`feat(stagehand): ...`, `fix(stagehand): ...`, `docs(stagehand): ...`, `chore(stagehand): ...`. Run all gates before committing.
