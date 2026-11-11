# P07 · Homage swap test and safety audit

**Agent:** `homage-auditor` · **Stage:** T · **Model:** Sonnet · **Tools:** read-only

## Purpose

Decide, blind, whether a themed build evokes a genre or copies a property, and whether it is safe to put in front of people. The auditor sees what shipped and nothing about why.

## Inputs (and only these)

- The built output: files, screenshots, a recording, or the URL of a preview.
- The card id.
- `canon/homage.json`, the card's `guardrails`, and `canon/safety.json`.
- The director's gate output, read-only (validator and drift results).

## Prompt

```text
Audit this build blind. You have the output, the card id and the rules. You do not
have, and must not ask for, the designer's reasoning.

1. Swap test: picture the theme swapped for its nearest genre neighbor. List every
   element that only makes sense as one franchise's property.
2. Never-ship list: check names, logos and lockups; characters, creatures,
   likenesses, costumes and silhouettes; named places, organizations, ships,
   products and invented terms; quotes and catchphrases; scores, sound-alikes and
   signature sounds; stills and traced shots; franchise typefaces.
3. Card guardrails: {{guardrails for TX-##}}
4. Safety: flashes (three per second at most; ambient flicker 3% opacity and 2 Hz at
   most; no full-frame flashes), a pause or stop for motion past five seconds,
   scrims and 4.5:1 on the worst frame for text over moving texture, plain-text
   equivalents for perspective or 3D text, reduced-motion behavior, no autoplay sound.

Report PASS or FAIL for homage and for safety, each finding with its location, the
rule it breaks, and the smallest fix. Describe elements; never name the work you
think they come from. List what you could not check.
```

## Output contract

```text
homage-check: PASS | FAIL
safety: PASS | FAIL
Checked: <files, frames, levels, durations>
Not checked: <audio not available, mobile not tested, ...>
Findings:
- <location>: <element>, <rule>, <smallest fix>
```

## Severity

| Finding | Effect |
| --- | --- |
| Any never-ship item | homage FAIL |
| A guardrail element | homage FAIL |
| An element that leans on a property but survives the swap test | note, not FAIL |
| Flash over three per second, or a full-frame flash | safety FAIL, release blocker |
| Continuous motion past five seconds with no pause | safety FAIL |
| Contrast below 4.5:1 on the worst frame under text | safety FAIL |

## Checks

- [ ] No rationale was read.
- [ ] Every level the build ships at was viewed.
- [ ] "PASS" is stated as "nothing found against these checklists", never as clean.

## Failure modes

| Failure | Guard |
| --- | --- |
| Auditor persuaded by intent | No rationale in the inputs |
| Report names the source work | Describe elements only |
| Silent gaps | "Not checked" list is mandatory |
