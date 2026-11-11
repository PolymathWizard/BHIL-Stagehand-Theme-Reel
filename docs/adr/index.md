# Architecture decisions

| ADR | Decision | Status |
| --- | --- | --- |
| [ADR-001](adr-001-canonical-source.md) | Canon is the only source; everything else is generated and drift-gated | Accepted |
| [ADR-002](adr-002-public-edition.md) | This repository is the public edition: codenames only, enforced by a hashed deny list | Accepted |
| [ADR-003](adr-003-public-guardrails.md) | Guardrails and collision notes are rewritten without the source works' names or terms | Accepted |
| [ADR-004](adr-004-self-contained-reel.md) | The reel is one self-contained file; its non-stdlib build is freshness-gated | Accepted |
| [ADR-005](adr-005-bhil-frame.md) | BHIL frame on every surface, theme palettes only as specimens | Accepted |
| [ADR-006](adr-006-figure-kit.md) | Ten figures as animated SVG plus PNG, fonts embedded, reduced-motion safe | Accepted |
| [ADR-007](adr-007-reel-autoplay.md) | The reel autoplays with one Pause; reduced-motion start is an open question | Accepted, open question |
| [ADR-008](adr-008-contrast-floor.md) | Ink contrast floor of 11:1, measured; TX-19 ink adjusted | Accepted |
| [ADR-009](adr-009-agent-team.md) | CADRE agent team with enforced tool isolation and a blind homage auditor | Accepted |
| [ADR-010](adr-010-evidence-tiers.md) | Evidence tiers on every factual claim; gates never issue a clean verdict on a build | Accepted |

Files: `adr-001-canonical-source.md`, `adr-002-public-edition.md`, `adr-003-public-guardrails.md`, `adr-004-self-contained-reel.md`, `adr-005-bhil-frame.md`, `adr-006-figure-kit.md`, `adr-007-reel-autoplay.md`, `adr-008-contrast-floor.md`, `adr-009-agent-team.md`, `adr-010-evidence-tiers.md`.
