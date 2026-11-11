# P05 · Intensity and Boardroom translation

**Agent:** `theme-stylist` · **Stage:** R · **Model:** Sonnet

## Purpose

Set the volume. The register decides the level; the card decides what that level looks like for this theme.

## Inputs

- The card id and the register.
- `canon/dial.json` and the card's `boardroom` line.
- Any intake override (`theme intensity:`) and any planned chapter step-up.

## The levels

| Level | Register | Stays | Goes | Timing |
| --- | --- | --- | --- | --- |
| Full | Creative or community | Everything on the card | Nothing beyond the hard gates | The card's timing |
| Tempered | Editorial or civic | Palette, type trio, transition grammar, S1, ambient layer | Glitch, chroma, stutter cut to 150 ms accents, one per section; saturation down 20%; no cursor effects | Card timing x 1.25 |
| Boardroom | B2B (the BHIL default) | Palette darkened or neutralized, type trio, one transition grammar, S1 at low contrast | All glitch, flicker, stutter, chroma split and stepped frames; particles above 30; WebGL fluid | 600 to 1200 ms, power3.out or expo.out |

## Prompt

```text
Set the intensity for {{TX-## CODENAME}} in register {{register}}.

1. Level from register: creative = full, editorial = tempered, b2b = boardroom.
   An intake override wins only if it is quieter than the register allows, or the
   person explicitly accepts a louder level in writing.
2. If the card's B2B fit is "never pitched for B2B" and the register is b2b, stop
   and report. If the ceiling is Tempered, the theme cannot serve b2b; report.
3. Write the level's version of the card: what stays, what goes, the timing.
   At Boardroom, start from the card's Boardroom translation.
4. List any one-chapter step-up (one level, one chapter, a deliberate beat).

Return the dial sheet.
```

## Output contract

```text
Level: full | tempered | boardroom (from register | from override)
Stays: ...
Goes: ...
Timing: ...
Step-up: none | <chapter> to <level>, because ...
```

## Checks

- [ ] The level came from the register.
- [ ] Every gated effect at this level is named in Goes.
- [ ] At most one chapter steps up, by one level.
- [ ] The dial never loosens a hard gate: pause controls, flash limits and reduced-motion guards stay at every level.

## Failure modes

| Failure | Guard |
| --- | --- |
| Boardroom that is just darker Full | Name every removed effect |
| A whole property stepped up "for energy" | One chapter, one level, declared |
| A Tempered-max theme forced into a board deck | Report; pick another concept |
