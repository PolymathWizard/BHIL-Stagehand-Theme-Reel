# ADR-002 · This repository is the public edition

**Status:** Accepted · 2026-11-10

## Context

The codex's own Homage Rule says public pages, meta tags, alt text and client deliverables use the codename only, and that internal briefs may name the inspiration. The internal brief (STC v1.0) names, for every theme, the films and series it evokes, and its ledger names BHIL's shipped properties. The reel's earlier versions carried an inspiration line on each plate, with a "Hide inspirations" toggle for screen-sharing.

A public GitHub repository is a public page. It is also permanent: anything committed lives in history.

## Decision

1. The repository carries **codenames only**. No inspiration names appear in canon, docs, tokens, figures, prompts, agent briefs, tests or the built reel. The reel's inspiration field and toggle are removed, not hidden.
2. The names live in an internal file, `internal/homage-denylist.json`, which is gitignored and never committed or packaged.
3. The validator enforces the rule with a **salted, hashed deny list**. `scripts/homage.py hash` turns each internal phrase into a SHA-256 of `salt:normalized phrase`; only the hashes ship in `canon/homage-denylist.json`. The validator normalizes every text file in the repository (lowercase, punctuation to spaces, base64 data URIs removed), hashes every one- to four-word sequence, and fails on any match.
4. Theme guardrails and ledger notes that only made sense by naming a property are rewritten for the public edition ([ADR-003](adr-003-public-guardrails.md)).
5. Terms coined by a specific work are replaced in public copy and in the reel's labels, for example the vector theme's build and exit moves are now "wire-in" and "shard-out".

## Consequences

- The rule is enforced in public CI without publishing the list it checks against.
- Hashes of short, common words can be reversed by anyone with a dictionary. The point is to keep names out of the repository's text, not to keep a secret; this is stated plainly here so nobody mistakes it for one.
- Contributors who trip the gate get the file name and a count, and can run `python3 scripts/homage.py scan <file>` locally. Maintainers with the internal file can see which phrase matched.
- A plain word that collides with a listed title fails the gate and has to be rephrased. One such collision (a three-digit number that matched ADR link text) was found while building this repository and removed from the list; the regression test `test_adr_numbers_are_not_flagged` keeps it out.

## Alternatives considered

- **A plain-text regex in the validator.** This is what the first figure kit did, which published the names in the tool meant to keep them out. Rejected; `test_validator_ships_no_names` guards against it.
- **No automated check.** Rejected: the rule is too easy to break in a caption or a commit.

## Settling criteria

If a commentary page (a story *about* a film) ever needs to live in this repository, it needs its own ADR, an allowlist entry scoped to that file, and the property's disclaimer.
