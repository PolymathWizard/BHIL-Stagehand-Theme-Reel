# P04 · Ledger check

**Agent:** `theme-scout` · **Stage:** U3 · **Model:** Sonnet · **Tools:** read-only

## Purpose

Keep a body of work from repeating itself. Themes are memorable; the same look three builds running reads as a house style nobody chose.

## Inputs

- The candidate theme (from the triptych's theme-led concept).
- The ledger: one row per shipped build, most recent first, with register and theme.
- The candidate card's collision note.

## The rule

1. A theme never repeats in **consecutive builds**.
2. A theme never appears **twice in the same register within three builds**.
3. The card's **collision note** names the kind of build it sits near. If the ledger holds one of those within the last two builds, change the S1 signature family or pick another concept.

## Prompt

```text
Check the ledger for {{TX-## CODENAME}} in register {{register}}.

Ledger, most recent first:
{{| Property | Register | Theme (TX · intensity) | S1 signature family | Shipped |}}

Collision note for the candidate: {{note}}

Report:
1. Consecutive-build rule: pass or blocked, with the row.
2. Same-register-within-three rule: pass or blocked, with the row.
3. Collision note: which recent builds are of the kind it names, and what to change.
4. Verdict: clear | change S1 family | pick another concept.
```

## Ledger row format

| Property | Register | Recipe | Theme (TX · intensity) | S1 signature family | Novelty axis | Motif | Shipped |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Example Story | B2B | 5 | TX-13 · boardroom | mechanism-rise map board | mechanical assembly | the ratchet tick | Nov 2026 |

Rows from before the codex get `none` in the Theme column.

## Output contract

```text
Consecutive: pass | blocked by <row>
Same register within three: pass | blocked by <row>
Collision: <finding>
Verdict: clear | change S1 family to ... | pick concept B or C
```

## Checks

- [ ] Both numeric rules applied.
- [ ] Collision note read against the ledger, not just quoted.
- [ ] A blocked theme is reported, not quietly swapped.

## Failure modes

| Failure | Guard |
| --- | --- |
| Ledger treated as optional when empty | Say "ledger empty, treated as clear" |
| A blocked theme swapped for its nearest neighbor without saying so | Report the block and let the director choose |
| Only theme ids checked, not look | The collision note covers look |

## Notes

The ledger lives with the team, not in this repository. Keep it as a table in the project that ships the builds and append a row at every manifest.
