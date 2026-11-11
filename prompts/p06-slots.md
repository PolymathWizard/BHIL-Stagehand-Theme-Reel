# P06 · Slot fill plan

**Agent:** `theme-stylist` · **Stage:** E · **Model:** Sonnet

## Purpose

Turn the card's web slot map into a build plan at the chosen level, with a cost for every fill.

## Inputs

- The card (`docs/themes/<slug>.md` or `canon/themes.json`).
- The dial sheet from P05.
- The subject's S1 from the triptych.
- The build's effect library and brand rules.

## The slots

| Slot | Name | Role |
| --- | --- | --- |
| S1 | Hero signature | The opening moment only this subject could have; the theme dresses it |
| S2 | Section transitions | How chapters hand off |
| S3 | Ambient layer | Texture under everything; quiet and pausable |
| S4 | Data skin | How charts, numbers and labels look and move |
| S5 | Interaction and focus | Hover, focus, press, and the one call to action |

## Tiers

| Tier | What | Limits |
| --- | --- | --- |
| T1 | CSS and SVG | Default |
| T2 | Canvas and script | Pause control past five seconds |
| T3 | WebGL | One layer per page at most; never fluid in B2B |

## Prompt

```text
Write the slot plan for {{TX-## CODENAME}} at {{level}}.

For each slot S1 to S5:
- the card's fill, adapted to the level (remove anything the dial removed);
- the tier (T1, T2 or T3);
- the effect from our library that implements it;
- the safety rows that apply (from canon/safety.json).

S1 must start from the subject's own signature: {{S1 from the triptych}}.
S4 must keep every number honest: real values in the DOM, SAMPLE on placeholders.
Accents marked fill only on the card's contrast table never carry text or a data line.
```

## Output contract

| Slot | Fill at this level | Tier | Library effect | Safety rows |
| --- | --- | --- | --- | --- |
| S1 | ... | T1 | ... | ... |
| S2 | ... | ... | ... | ... |
| S3 | ... | ... | ... | ... |
| S4 | ... | ... | ... | ... |
| S5 | ... | ... | ... | ... |

Plus: total WebGL layers (0 or 1), anything continuous past five seconds and its pause control, and the font subset list.

## Checks

- [ ] One WebGL layer at most; none in B2B fluid form.
- [ ] Every continuous effect has a pause or stops at five seconds.
- [ ] Text over moving texture has a scrim and 4.5:1 on the worst frame.
- [ ] Fonts are inlined subsets or system fallbacks; no CDN links.
- [ ] Client brand tokens replace ground, ink and type when present.

## Failure modes

| Failure | Guard |
| --- | --- |
| S1 copied from the card instead of the subject | S1 starts from the triptych |
| T3 everywhere | Tier per slot, one WebGL layer |
| Decorative data (gear size as value) | Decoration is never data |
