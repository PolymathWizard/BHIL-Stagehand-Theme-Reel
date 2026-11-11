# Token files

<!-- Generated from canon by scripts/build_derived.py. Do not edit by hand. -->

Three formats, all generated from `canon/themes.json`.

| File | Use |
| --- | --- |
| `tokens/stagehand-tokens.css` | All twenty themes, each scoped to `[data-tx="TX-##"]`. Set the attribute on any element to switch themes. |
| `tokens/themes/tx-##-codename.css` | One theme on `:root`, for a page that wears a single theme. |
| `tokens/stagehand-tokens.json` | Design-token JSON (colors, fonts, motion) for tools and pipelines. |

```html
<section data-tx="TX-16">
  <h2 style="font-family: var(--tx-display); color: var(--tx-a1)">Four moves, measured</h2>
</section>
```

| ID | Codename | bg | ink | a1 | a2 | a3 | ease | dur |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TX-01 | VECTOR GRID | `#02040A` | `#E6FDFF` | `#00E5FF` | `#FF6A00` | `#1E6F8C` | `cubic-bezier(.16,1,.3,1)` | 600ms |
| TX-02 | PHOSPHOR RAIN | `#000500` | `#C8F5CF` | `#00FF41` | `#008F11` | `#7FA8C9` | `cubic-bezier(.22,1,.36,1)` | 750ms |
| TX-03 | GLASS HUD | `#050B14` | `#E8F4FF` | `#6FE3FF` | `#F5A623` | `#FF3B5C` | `cubic-bezier(.33,1,.68,1)` | 450ms |
| TX-04 | RAINLIGHT NOIR | `#05070B` | `#D9E2E8` | `#FF8A1F` | `#FF2E88` | `#3FD0E0` | `cubic-bezier(.65,0,.35,1)` | 1600ms |
| TX-05 | STUTTER BROADCAST | `#000000` | `#FFFFFF` | `#FF00A8` | `#00F0FF` | `#FFE600` | `cubic-bezier(.2,0,0,1)` | 350ms |
| TX-06 | OTHERSIDE ’83 | `#070608` | `#F2E6C9` | `#E0303A` | `#8DA3B5` | `#FF5A4E` | `cubic-bezier(.37,0,.63,1)` | 1400ms |
| TX-07 | NIGHT DRIVE | `#0B0420` | `#F3E8FF` | `#FF2A6D` | `#05D9E8` | `#FFB86C` | `cubic-bezier(.45,0,.55,1)` | 1100ms |
| TX-08 | COLD STORAGE | `#030503` | `#E8E2D0` | `#FFB000` | `#33FF66` | `#FF3B30` | `cubic-bezier(.25,.1,.25,1)` | 500ms |
| TX-09 | SPACE OPERA | `#000000` | `#E6E9F0` | `#FFD23F` | `#7FB3FF` | `#C0C8D8` | `cubic-bezier(.4,0,.2,1)` | 900ms |
| TX-10 | SANDSCALE | `#F3E9DA` | `#2B2620` | `#9A4A1C` | `#6E5536` | `#0E0E0E` | `cubic-bezier(.65,0,.35,1)` | 2200ms |
| TX-11 | WASTELAND CHROME | `#0A0A0A` | `#F2E6D0` | `#FF7A1A` | `#1FB5C9` | `#C9C9C9` | `cubic-bezier(.87,0,.13,1)` | 250ms |
| TX-12 | SLIT-SCAN COSMOS | `#000000` | `#E8E1D5` | `#F2A65A` | `#5B8CFF` | `#9B5DE5` | `cubic-bezier(.37,0,.63,1)` | 3000ms |
| TX-13 | CLOCKWORK REALM | `#1A1712` | `#E9DCC0` | `#C9A464` | `#8C1C13` | `#7A8C96` | `cubic-bezier(.5,0,.5,1)` | 1200ms |
| TX-14 | RED-LINE EXPEDITION | `#E9DCC0` | `#2E2318` | `#A8341C` | `#556B3F` | `#1F2A33` | `cubic-bezier(.33,1,.68,1)` | 1000ms |
| TX-15 | PAINTED WIND | `#F7F3E8` | `#23361F` | `#2F6B3F` | `#3E64A0` | `#B5762A` | `cubic-bezier(.33,0,.2,1)` | 1600ms |
| TX-16 | PAPER CUT TITLES | `#F2E8D5` | `#1C1C1C` | `#C93A1B` | `#1F5F7F` | `#B88A00` | `cubic-bezier(.76,0,.24,1)` | 320ms |
| TX-17 | SILHOUETTE & SMOKE | `#050505` | `#EDE6D6` | `#C9A227` | `#A3262A` | `#F0D27A` | `cubic-bezier(.65,0,.35,1)` | 1500ms |
| TX-18 | HALFTONE MULTIVERSE | `#FFFFFF` | `#111111` | `#E6007E` | `#0095D6` | `#D4C700` | `cubic-bezier(.34,1.56,.64,1)` | 400ms |
| TX-19 | SYMMETRY DIORAMA | `#F7E8DC` | `#3C2B2D` | `#B5452B` | `#4F7FA6` | `#3F7D5C` | `cubic-bezier(.83,0,.17,1)` | 450ms |
| TX-20 | LIMINAL OFFICE | `#F4F6F5` | `#1D2B2A` | `#2E6F5E` | `#1F8A78` | `#6B5E3C` | `linear` | 900ms |
