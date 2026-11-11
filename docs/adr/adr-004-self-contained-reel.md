# ADR-004 · The reel is one self-contained file

**Status:** Accepted · 2026-11-10

## Context

The reel demonstrates themes whose deploy rule is "inline woff2 subsets, never a live font CDN link." It would be odd for the demonstration to break the rule it demonstrates. It also needs to be easy to share: one file a person can open from a download, an email or a Pages URL.

Building that file needs font subsetting, which needs fontTools, which is not stdlib. BHIL gates and generators are stdlib-only.

## Decision

1. The reel ships as **one HTML file** with every script, style and font inline. Faces are subset to Latin plus the glyphs the reel draws and embedded as base64 woff2. No CDN, no font links, no analytics, no network requests at all.
2. The builder, `reel/build_reel.py`, is **deliberately non-stdlib** and sits apart from the gates. Its inputs are pinned (`reel/package-lock.json` for the `@fontsource` packages).
3. The built file is **committed**. The builder writes `reel/dist/SOURCES.sha256` with the hash of every input (the ten source files, the shell, the canon it reads, and itself). The stdlib validator recomputes those hashes and fails on any mismatch, naming the stale input.
4. The validator also scans the built file for network references (`src`, `srcset`, `url()` and `<link href>` to http or https) and fails on any.
5. The publish workflow copies the committed file into the Pages site at `/reel/`.

## Consequences

- CI never downloads fonts to validate a release, and a stale build cannot merge.
- The file is about 1 MB. Most of it is font data; the code is under 200 KB.
- A contributor who changes a scene must run the builder locally. The validator's message says exactly that.

## Alternatives considered

- **Load fonts from a CDN in the reel.** Rejected: it breaks the deploy rule and the zero-request promise.
- **Build in CI and never commit the file.** Rejected for now: it would make every Pages deploy depend on a fresh font download and a non-stdlib toolchain in the critical path.

## Settling criteria

Revisit if the file passes 2 MB or a fourth family of fonts is added; at that point consider per-family lazy subsets inside the same file.
