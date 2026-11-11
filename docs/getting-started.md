# Getting started

Three ways in, from lightest to deepest.

## 1. Use a theme's tokens on a page

Every theme ships as CSS custom properties. Link the scoped file and set `data-tx` on any element:

```html
<link rel="stylesheet" href="tokens/stagehand-tokens.css">

<main data-tx="TX-16">
  <h1 style="font-family: var(--tx-display); color: var(--tx-ink)">Four moves, measured</h1>
  <p style="font-family: var(--tx-body)">Flat cut-paper shapes that snap to the beat.</p>
</main>
```

Or take one theme on `:root` from `tokens/themes/tx-16-paper-cut-titles.css`. Tokens name fonts but do not load them: each face is open-license and listed on the [fonts page](reference/fonts.md). For a deploy build, inline a woff2 subset or fall back to the system stack. Never leave a live font CDN link in a deploy build.

Before you ship, read three things on the theme's page: the **Boardroom translation** if the work is B2B, the **homage guardrails**, and the **contrast** table. Accents marked *fill only* never carry text or a data line on their own.

## 2. Pick a theme the way the agents do

Write five essence words and the dominant data shape for your story first, before you look at any theme. Then run the fit test:

```bash
python3 scripts/fit_test.py \
  --words "monitoring, precision, systems, warning, compliance" \
  --shape score --register b2b --ledger TX-03
```

The script shortlists themes whose essence words match two or more of yours and whose data shapes include yours, then removes themes the register cannot use and themes your ledger used recently. The [worked example](worked-example.md) walks one brief through all eight moves, and [how agents use the codex](codex/how-agents-use.md) has the full directive to paste into an agent brief.

## 3. Run the agent team in Claude Code

Open the repository in Claude Code. The seven agents in `.claude/agents/` load automatically. Start the director with prompt P00:

```text
Use the stagehand-director agent. Brief: <paste your brief>. Register: B2B. Ledger: TX-03, TX-13.
```

The director delegates U1 to `essence-reader`, the fit test and triptych to `theme-scout`, slot fills to `theme-stylist`, and the swap test to `homage-auditor`, which grades blind and has no write tools. It ends with a manifest line. See [agents and prompts](agents.md).

## See the reel

Open `reel/dist/stagehand-theme-reel.html` in any modern browser, or the [live copy](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html). It needs no server and makes no network requests. Turn the dial to see each theme at Full, Tempered and Boardroom; click a beat chip to jump to it; copy tokens or the prompt seed straight from each plate.

## Gates

Everything that ships passes four stdlib gates. Run them before every commit:

```bash
python3 scripts/validate.py                       # canon, contrast, homage, dashes, agents, prompts, ADRs, figures, reel
python3 scripts/verify_drift.py                   # every generated file matches canon, byte for byte
python3 -m unittest discover -s tests             # regression tests, each named for the bug it prevents
node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html   # every scene, every level, against a strict canvas mock
mkdocs build --strict                             # this site
```

## Changing things

| You want to | Edit | Then run |
| --- | --- | --- |
| Change a theme's words, tokens or slot fills | `canon/themes.json` | `python3 scripts/build_derived.py`, then rebuild the reel and figures |
| Add a theme | `canon/themes.json`, `canon/families.json`, a scene in `reel/src/` | Prompt P09 and P10 walk through it |
| Change the reel's motion | `reel/src/*.js` (never `data.js`) | `cd reel && npm ci && python3 build_reel.py`, then `python3 scripts/render_screens.py` |
| Change a figure | `scripts/figures.py` or canon | `python3 scripts/figures.py && python3 scripts/render_figures.py`, then `python3 scripts/render_screens.py` |
| Change a README still | `canon/screens.json` | `python3 scripts/render_screens.py` |
| Change prose on a hand-written page | that page | `mkdocs build --strict` |

Generated files carry a "Generated from canon" comment at the top. Do not edit them by hand; the drift gate will fail. See [CONTRIBUTING](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/CONTRIBUTING.md).
