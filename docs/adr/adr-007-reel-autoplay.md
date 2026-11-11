# ADR-007 · The reel autoplays; reduced motion is an open question

**Status:** Accepted, with an open question · 2026-11-10

## Context

The codex's safety table says continuous motion over five seconds needs a visible pause control or an automatic stop, and that reduced motion gets a still poster. An early version of the reel started paused when the operating system asked for reduced motion. The reel's owner asked for it to play by default, because a motion reel that opens still reads as broken to most viewers, and kept the global Pause control.

The reel is a demonstration surface for the themes, not a themed property built with them. But it is also public, and some visitors will have vestibular disorders or photosensitivity.

## Decision

1. The reel **plays on load** for everyone.
2. One **Pause** control in the sticky control bar stops every stage at once (WCAG 2.2.2 is met by the pause mechanism).
3. Every theme runs under the codex flash limits at every level: no more than three flashes a second, ambient flicker at 3% opacity or less and 2 Hz or less, no full-frame flashes.
4. The **Boardroom** level is the calm view: no flicker, stutter, chroma split, lens dirt or stepped frames.
5. The **figures** do honor reduced motion and show their static frame ([ADR-006](adr-006-figure-kit.md)).

## Open question

Should the reel start paused, or start at Boardroom, when `prefers-reduced-motion: reduce` is set?

| Option | For | Against |
| --- | --- | --- |
| Start paused | Matches the codex's own rule for themed properties | A first-time visitor with the setting on sees still frames and may not find Pause |
| Start at Boardroom, playing | Keeps the demo alive at its calmest | Still continuous motion |
| Keep current behavior | The owner's explicit choice | Ignores a clear user preference |

**Settling criteria:** decide before the reel is embedded in any client-facing page or linked from a public talk. If any visitor reports discomfort, switch to "start paused with a clear Play button" immediately and record it here.
