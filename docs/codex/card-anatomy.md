# Card anatomy and token schema

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

Every card carries the same eleven fields, so an agent can lift exactly the part its stage needs.

| Field | What it gives the agent | Stage |
| --- | --- | --- |
| Tokens | Paste-ready --tx-* CSS custom properties | C |
| Essence words | Vocabulary for the U1 fit test | U1, U2 |
| Look | Palette roles, type trio, texture and light, composition | R |
| Motion grammar | Eases, durations, signature transitions, camera | R, E |
| Web slot map | S1 to S5 fills, each with a build tier | E |
| Video | Opener, cut and transition grammar, pacing, sound bed | Video |
| Data skin | How charts, numbers and labels look | E (S4) |
| Boardroom translation | The B2B version in one line | R |
| Homage guardrails | Theme-specific off-limits list on top of the Homage Rule | T |
| Collision note | What the theme sits near, for the ledger check | U3 |
| Prompt seed | One line to paste into a concept or orchestration prompt | U2 |

## Shared token schema

| Property | Meaning |
| --- | --- |
| `--tx-id` | theme id |
| `--tx-bg` | page ground |
| `--tx-ink` | body text, 4.5:1 or better on --tx-bg |
| `--tx-a1` | primary accent |
| `--tx-a2` | secondary accent |
| `--tx-a3` | tertiary accent or highlight |
| `--tx-glow` | glow built from --tx-a1 |
| `--tx-grain` | noise overlay opacity, 0 to .12 |
| `--tx-display` | display face |
| `--tx-body` | body face |
| `--tx-mono` | mono face |
| `--tx-ease` | signature ease |
| `--tx-dur` | signature duration |
| `--tx-step` | steps() for on-twos themes, or none |

Example, from TX-07:

```css
/* TX-07 NIGHT DRIVE */
:root {
  --tx-id: "TX-07";
  --tx-bg: #0B0420;
  --tx-ink: #F3E8FF;
  --tx-a1: #FF2A6D;
  --tx-a2: #05D9E8;
  --tx-a3: #FFB86C;
  --tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);
  --tx-grain: .06;
  --tx-display: "Monoton", system-ui, sans-serif;
  --tx-body: "Space Grotesk", system-ui, sans-serif;
  --tx-mono: "Share Tech Mono", ui-monospace, monospace;
  --tx-display-weight: 400;
  --tx-body-weight: 400;
  --tx-mono-weight: 400;
  --tx-ease: cubic-bezier(.45,0,.55,1);
  --tx-dur: 1100ms;
  --tx-step: none;
}
```

## Token rules

- Contrast is pre-checked: every card's --tx-ink on --tx-bg measures 11:1 or better. The build measures it and the validator fails below 11:1.
- Accents under 3:1 against the ground are fill-only. They never carry text or a data line on their own.
- Hue is fixed, lightness flexes: agents may shift an accent's lightness by up to 10% to pass contrast, never swap hues.
- Every face is open-license (SIL OFL or Apache 2.0). Confirm the license on the font's own page and record it in the manifest.
- Deploy builds inline woff2 subsets or fall back to the system stack. Never leave a live font CDN link in a deploy build.
- On client work, client tokens replace --tx-bg, --tx-ink and the type trio; the theme keeps its motion grammar and, if the brand allows, its accents.
