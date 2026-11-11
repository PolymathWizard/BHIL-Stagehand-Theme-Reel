# P09 · New theme card

**Agent:** `card-author` · **Stage:** R, T · **Model:** Sonnet

## Purpose

Add a theme to the codex, or graduate one from the bench, with every field complete, ink at 11:1 or better, and guardrails an auditor can apply.

## Inputs

- A codename (capitals, no franchise words) or a bench entry from `canon/bench.json`.
- The family it belongs to and the stories it is for.
- Two existing cards in that family, as models.

## Prompt

```text
Write a complete Stagehand card for {{CODENAME}} in family {{A-E}}.

Fill every field in canon/themes.json:
id, name, slug, family, feel, best_for, data_shapes, home_register, b2b, tokens
(bg, ink, a1, a2, a3), extra_tokens, fonts (display, body, mono with weights),
ease, dur, essence (five or six words), look, motion, slots (S1 to S5, each with a
tier), video, data_skin, boardroom, guardrails, collision, seed.

Rules:
- Never name, quote or describe the work that inspired the idea.
- Fonts must be open-license (SIL OFL or Apache 2.0) and added to canon/fonts.json.
- Ink on ground must measure 11:1 or better. Shift lightness by up to 10% to pass;
  never change hue.
- Mark accents under 3:1 as fill only in the look or data skin.
- Guardrails name banned elements in plain words an auditor can spot in a frame.
- The Boardroom translation names exactly what is removed.
- The seed opens with "TX-## CODENAME:".
- No em or en dashes.
```

## Steps after writing

1. Add the id to the family in `canon/families.json`.
2. `python3 scripts/build_derived.py`
3. `python3 scripts/validate.py` and fix every failure (contrast, fonts, dashes, homage).
4. Hand off to `reel-engineer` with P10.
5. Add a line to `CHANGELOG.md`.

## Field checklist

| Field | Done when |
| --- | --- |
| feel | One picture-able line |
| essence | Five or six words a U1 reader could write |
| data_shapes | One to three from the vocabulary |
| tokens | Five uppercase hex values; ink at 11:1 |
| fonts | Three open-license faces with weights, in canon/fonts.json |
| look | Palette roles, type, texture and light, composition |
| motion | Eases, durations, signature move, camera |
| slots | S1 to S5, each concrete, each with a tier |
| video | Opener, cut grammar, pacing, sound bed |
| data_skin | Charts, numbers, labels |
| boardroom | What is removed, what stays |
| guardrails | Spot-able elements |
| collision | The kind of build it sits near |
| seed | One line, opens with id and codename |

## Failure modes

| Failure | Guard |
| --- | --- |
| A card that only makes sense if you know the film | Swap test before submitting |
| Ink at 10.97:1 | The validator measures; rounding does not pass |
| A license assumed | Read the font package manifest |
