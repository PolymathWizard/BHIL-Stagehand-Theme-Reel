# P08 · Manifest line

**Agent:** `stagehand-director` · **Stage:** M · **Model:** Opus

## Purpose

Leave a record that the next build, the next person and the ledger can read. The manifest is how a theme choice stays accountable after the session ends.

## Inputs

- Fit result (P02), dial sheet (P05), auditor report (P07).
- For video: audio license and flash-test result.

## Format

```text
theme: TX-## CODENAME · intensity · fit n/5 · homage-check PASS|FAIL
chapter step-up: none | <chapter> to <level>
safety: PASS | FAIL (<auditor summary>)
audio: <original | library track and license> (video only)
flash test: <tool and result | not required, because ...> (video only)
fonts: <faces and licenses>
```

Use `theme: none` when the codex was off or the build ended theme-free.

## Prompt

```text
Write the manifest for this build from the records below. Do not restate design
rationale. Use the exact line format. Copy homage-check and safety from the auditor's
report; never set them yourself.

Fit: {{P02 line for the chosen theme}}
Dial: {{P05 level and step-up}}
Audit: {{P07 report}}
Video: {{audio license, flash test}}
Fonts: {{faces}}
```

## Ledger row

Append one row to the team's ledger at the same time:

| Property | Register | Recipe | Theme (TX · intensity) | S1 signature family | Novelty axis | Motif | Shipped |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {{name}} | {{register}} | {{recipe}} | {{TX-## · level}} | {{family}} | {{axis}} | {{motif}} | {{month year}} |

## Example

```text
theme: TX-08 COLD STORAGE · boardroom · fit 2/5 · homage-check PASS
chapter step-up: none
safety: PASS (no flicker at Boardroom; meters static between updates)
audio: original drone bed, licensed to the build
flash test: not required, Boardroom drops blinking and the trailer has no flicker cuts
fonts: Michroma (OFL-1.1), IBM Plex Sans Condensed (OFL-1.1), VT323 (OFL-1.1)
```

## Checks

- [ ] One theme line, exact format.
- [ ] homage-check copied from the auditor.
- [ ] Ledger row appended.
- [ ] A FAIL is recorded as FAIL with the open findings, not rounded up.

## Failure modes

| Failure | Guard |
| --- | --- |
| Manifest written before the audit | homage-check must be copied from P07 |
| Rationale bloat | Lines only; rationale lives in the director's summary |
| Video shipped without a flash result | Video rows are required for video |

## Why it matters

The ledger rule (P04) only works if every build writes its row. A missing manifest is how the same theme ends up in three consecutive builds.
