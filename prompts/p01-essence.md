# P01 · U1 essence extraction

**Agent:** `essence-reader` · **Stage:** U1 · **Model:** Sonnet · **Tools:** read-only

## Purpose

Name what the story is before anyone decides what it looks like. Five essence words and one dominant data shape drive the whole fit test, so they must come from the subject, not from a favorite theme.

## Inputs

- The brief.
- Any source material the brief points to (data dictionary, outline, transcript).
- The data-shape vocabulary: flow, network, comparison, timeline, terrain, score, document.

## Prompt

```text
Read the brief below. Do not open any theme card, token file or the reel.

Return:
1. Five essence words: single words or short phrases about the subject's nature,
   stakes and forces. No format words (dashboard, video), no style words (neon,
   retro, cinematic), no empty praise (innovative, powerful).
2. One dominant data shape from: flow, network, comparison, timeline, terrain,
   score, document.
3. One line of evidence per word, quoting or pointing to the brief.
4. A runner-up shape if the call was close, with the reason.

Brief:
{{brief}}
```

## Choosing the data shape

| The main number... | Shape |
| --- | --- |
| moves along a path or through stages | flow |
| connects actors or systems | network |
| differs between groups | comparison |
| changes over time | timeline |
| covers ground or a distribution | terrain |
| measures against a line or threshold | score |
| records evidence or a case | document |

## Output contract

```text
U1 essence: w1, w2, w3, w4, w5
Data shape: <shape> (runner-up: <shape>, because ...)
Evidence:
- w1: ...
- w2: ...
- w3: ...
- w4: ...
- w5: ...
```

## Checks

- [ ] Exactly five words.
- [ ] No word names a visual style, a genre or a medium.
- [ ] Every word has evidence in the brief.
- [ ] One shape, from the list.
- [ ] No theme named anywhere in the output.

## Failure modes

| Failure | What it looks like | Fix |
| --- | --- | --- |
| Style leakage | "noir", "retro", "neon" | Replace with what the style was standing in for: "surveillance", "nostalgia" |
| Format leakage | "dashboard", "deck" | Ask what the dashboard monitors: "monitoring" |
| Empty praise | "innovative" | Ask what the innovation changes: "speed", "precision" |
| Two shapes at once | "timeline and comparison" | Pick the one the headline number uses; note the runner-up |

## Example output

```text
U1 essence: monitoring, precision, systems, warning, compliance
Data shape: score (runner-up: comparison)
```
