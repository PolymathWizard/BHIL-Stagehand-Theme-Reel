# Security and safety

This repository ships static files: JSON canon, Markdown docs, CSS tokens, SVG and PNG figures, and one self-contained HTML reel. There is no server, no account system and no data collection.

## What to report

| Report | Why it matters |
| --- | --- |
| A frame in the reel or a figure that flashes more than three times a second, or a full-screen flash | Photosensitive seizure risk (WCAG 2.3.1). Treated as a release blocker. |
| Any network request from `reel/dist/stagehand-theme-reel.html` | The reel promises zero outside requests. |
| Script inside a figure SVG, or an external reference in one | Figures are embedded as images in READMEs and must stay inert. |
| A franchise name, logo, character or quote anywhere in the repository | Breaks the Homage Rule and the public-edition promise (ADR-002). |
| A dependency or workflow change that weakens a gate | The gates are the product's integrity. |

## How to report

Open a private security advisory on the repository (Security tab, then "Report a vulnerability"), or email the address on [barryhurd.com](https://barryhurd.com). Please include the file, the frame or time, and the level (Full, Tempered or Boardroom). You will get an acknowledgment within five business days.

## Supply chain

- Gates and generators are stdlib Python. They need no packages.
- Two builders are isolated and non-stdlib on purpose: `reel/build_reel.py` (fontTools for woff2 subsetting) and `scripts/figures.py` with `scripts/render_figures.py` (fontTools, Playwright). Their outputs are committed and freshness-checked by hash, so CI never has to trust a fresh font download to validate a release.
- Font packages are pinned in `reel/package-lock.json`. Every face is SIL OFL 1.1 or Apache 2.0.
