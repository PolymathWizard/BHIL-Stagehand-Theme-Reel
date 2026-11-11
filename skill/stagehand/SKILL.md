---
name: stagehand
description: Apply a Stagehand Theme Codex motion theme to a page, reel or deck. Use when asked to give a build a genre feel (broadcast, noir, title sequence, space saga and so on), to pick or audit a theme, or to set a theme's intensity for creative, editorial or B2B work.
---

# Stagehand theming

Use this skill with the BHIL-Stagehand-Theme-Reel repository (https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel). It turns a brief into a themed build with a manifest line, without copying any property.

## Before anything

1. Decide the format from the brief. A theme never picks the format.
2. Write five essence words and the dominant data shape (flow, network, comparison, timeline, terrain, score, document) **before** looking at any theme.
3. Note the register: creative, editorial or B2B. B2B is the default.

## Pick

Run the fit test from the repository root:

```bash
python3 scripts/fit_test.py --words "w1, w2, w3, w4, w5" --shape <shape> --register <register> --ledger <recent TX ids>
```

A theme passes with two or more essence matches and the right data shape. Propose three concepts with at most one theme-led. If nothing passes, build theme-free.

## Apply

- Level from register: creative Full, editorial Tempered, B2B Boardroom. Start Boardroom from the card's Boardroom translation.
- Fill S1 to S5 from the card's web slot map (`docs/themes/<slug>.md`), each with a tier. S1 comes from the subject; the theme dresses it.
- Tokens: `tokens/themes/<slug>.css`. Inline open-license font subsets; never a font CDN link in a deploy build.
- Apply every safety row for the theme in `canon/safety.json`.

## Check

- Swap test: anything that only makes sense as one franchise's property is cut. Use codenames only; never name the inspiration.
- Flashes three per second at most; pause control for motion past five seconds; scrims under text on moving texture.

## Record

```text
theme: TX-## CODENAME · intensity · fit n/5 · homage-check PASS|FAIL
```

For the full team version, use the agents in `.claude/agents/` and prompts P00 to P10.
