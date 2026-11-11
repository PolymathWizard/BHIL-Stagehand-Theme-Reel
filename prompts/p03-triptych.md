# P03 · Concept triptych

**Agent:** `theme-scout` · **Stage:** U2 · **Model:** Sonnet · **Tools:** read-only

## Purpose

Give the director three genuinely different directions. At most one may be theme-led, so a theme is compared against real alternatives instead of against variations of itself.

## Inputs

- U1 output (P01) and the shortlist (P02).
- The format from Phase 1.
- The subject's own material: its data, its vocabulary, its one surprising fact.

## Prompt

```text
Propose three concepts for this build.

Brief: {{one-paragraph brief}}
Format: {{format}}
U1: {{five words}} · shape {{shape}}
Eligible themes: {{list from P02}}

Rules:
- At most one concept is theme-led. The other two use no Stagehand theme.
- Every concept has its own S1: the opening moment only this subject could have.
  For the theme-led concept, the theme dresses that S1; it does not replace it.
- Concepts must differ in their S1 signature family (what the opening does),
  not only in color or type.
- Use only the subject's real data and words; numbers you invent are SAMPLE.

For each concept give: a name, the S1 in two sentences, the data treatment in
one sentence, and the one risk.
```

## Output contract

```text
A (theme-led, TX-## CODENAME): <name>
  S1: ...
  Data: ...
  Risk: ...
B (theme-free): <name>
  S1: ...
  Data: ...
  Risk: ...
C (theme-free): <name>
  S1: ...
  Data: ...
  Risk: ...
Recommendation: A | B | C, because ...
```

## What makes a good S1

| Good | Weak |
| --- | --- |
| The port network draws itself, one port at a time, beside the live index | A generic dashboard fades in |
| The key number rises from haze at architectural scale over a tiny human marker | A big number with a glow |
| The organization's real departments as rooms in a cross-section | Icons in a grid |

A theme-led S1 should still pass the test: would this opening make sense for this subject with the theme removed? If not, the theme is doing the subject's work.

## Checks

- [ ] One theme-led concept at most.
- [ ] Three different S1 signature families.
- [ ] Every S1 uses the subject's own material.
- [ ] No franchise names; codenames only.

## Failure modes

| Failure | Guard |
| --- | --- |
| Three flavors of the same idea | Different S1 signature families |
| The theme is the concept | The S1 must survive the theme's removal |
| A strawman pair of theme-free concepts | Each must be a direction you would defend |
