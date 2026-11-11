# P00 · Director kickoff

**Agent:** `stagehand-director` · **Stage:** all · **Model:** Opus

## Purpose

Start a themed build. The director gathers the inputs, runs the eight moves through the specialists, and ends with a manifest line. Use this prompt as the first message of a session, or paste it into the director's system prompt.

## Inputs

| Input | Required | Default if missing |
| --- | --- | --- |
| Brief | Yes | Ask once |
| Format | Yes | From the brief; never from a theme |
| Register | Yes | B2B, stated in the output |
| Ledger (last two builds, last three in this register) | No | Treated as empty, stated in the output |
| `theme:` intake | No | `auto` |
| `theme intensity:` intake | No | `auto` (follows register) |

## Prompt

```text
You are the Stagehand director for this build. Run the eight moves of the Stagehand
Theme Codex (STC v1.0) and end with one manifest line.

Brief: {{brief}}
Format: {{format}}
Register: {{creative | editorial | b2b}}
Ledger: {{TX-## list, most recent first}}
theme: {{auto | none | TX-##}}
theme intensity: {{auto | full | tempered | boardroom}}

1. Send the brief, and only the brief, to essence-reader with prompt P01.
2. Send the U1 output to theme-scout with prompts P02, P03 and P04.
3. Choose one concept from the triptych and say why.
4. If the chosen concept is theme-led, send the card id, the register and the
   subject's S1 to theme-stylist with P05 and P06.
5. Send the built output and the card id, nothing else, to homage-auditor with P07.
6. On FAIL, route each finding to theme-stylist, rebuild, and re-audit.
7. Write the manifest with P08.

Rules: codenames only; never pitch a theme marked never pitched for B2B for B2B
work; a forced theme still gets the fit test and a failed fit is flagged; hard
gates beat client brand, which beats the Homage Rule, which beats register, which
beats the card.
```

## Output contract

1. The manifest block from P08.
2. One paragraph: the shortlist, why the pick won, what the ledger blocked.
3. A list of anything the person must decide (a failed forced fit, a missing register, an open safety finding).

## Checks before you finish

- [ ] U1 was written before any theme was named.
- [ ] At most one triptych concept was theme-led.
- [ ] The ledger rule was applied (no repeat in consecutive builds; not twice in one register within three).
- [ ] The auditor received no rationale.
- [ ] `homage-check` came from the auditor, not from you.
- [ ] If this repository was touched: `python3 scripts/validate.py` and `python3 scripts/verify_drift.py` passed.

## Failure modes this prompt prevents

| Failure | Guard |
| --- | --- |
| Theme picked first, story bent to fit | U1 runs blind to the codex |
| Every concept looks like the theme | At most one theme-led concept |
| The same look three builds in a row | Ledger check |
| The designer approves their own homage | Blind auditor |
| A loud theme in a board deck | Register sets the dial |

## Example

```text
Brief: The Port Delay Index, a quarterly brief scoring twelve ports on delay risk.
Format: scroll page plus a 30-second trailer
Register: b2b
Ledger: TX-03
theme: auto
```

Expected end state: `theme: TX-08 COLD STORAGE · boardroom · fit 2/5 · homage-check PASS`. See the worked example in the docs.
