# P02 · Fit test and shortlist

**Agent:** `theme-scout` · **Stage:** U1 · **Model:** Sonnet · **Tools:** read-only

## Purpose

Turn U1 into a shortlist with a rule anyone can rerun. A theme passes the fit test when its essence words match two or more U1 words and its data shapes include the U1 shape.

## Inputs

- The U1 output from P01.
- The register.
- `canon/themes.json` (or the output of `scripts/fit_test.py`, which implements the same rule).
- Intake: `theme: auto | none | TX-##`.

## Prompt

```text
Run the Stagehand fit test.

U1 essence: {{five words}}
Data shape: {{shape}}
Register: {{creative | editorial | b2b}}
Intake theme: {{auto | none | TX-##}}

For every theme in canon/themes.json:
- count matches between its essence words and the U1 words (a U1 word matches an
  essence entry if it equals it or appears in it as a whole word);
- check whether its data shapes include the U1 shape;
- it passes with two or more matches and the shape.

Then apply the register:
- b2b: remove themes marked never pitched for B2B and themes whose ceiling is
  Tempered; keep news-desk-only themes with that limit noted.
- editorial: working level is Tempered.
- creative: working level is Full.

If intake names a theme, report its result even if it fails, and flag a failure.
Return every theme with at least one match, sorted by passes, then matches.
```

## Equivalent command

```bash
python3 scripts/fit_test.py --words "{{w1, w2, w3, w4, w5}}" --shape {{shape}} --register {{register}}
```

## Output contract

```text
Shortlist:
- TX-## CODENAME · fit n/5 · shape yes|no · eligible | passes, blocked by ... | fails
Forced theme (if any): TX-## · result · flag
Empty shortlist? say so, and propose the closest passing theme for the runner-up shape.
```

## Checks

- [ ] The fit score is matches over the number of U1 words.
- [ ] No theme passed on "vibe".
- [ ] Register filters applied after the fit test, not instead of it.
- [ ] Codenames only.

## When the shortlist is empty

1. Rerun with the runner-up shape from P01 and say so.
2. If still empty, recommend `theme: none`. A theme-free build is a good outcome, not a failure.

## Failure modes

| Failure | Guard |
| --- | --- |
| Loosening the threshold to one match | Two is the rule; report near misses separately |
| Counting synonyms as matches | Only equal words or whole-word containment count |
| Silently overriding a forced theme | Report and flag; the person decides |
