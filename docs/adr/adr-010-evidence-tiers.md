# ADR-010 · Evidence tiers on every factual claim

**Status:** Accepted · 2026-11-10

## Context

A design codex mixes three kinds of statement: rules ("Boardroom drops chroma split"), facts about the world ("WCAG limits flashes to three per second", "this face is OFL"), and facts about this repository ("every data beat runs 9.5 seconds"). Readers need to know which facts were checked and how.

## Decision

1. Factual claims live in `canon/claims.json`, each with one of five tiers used across BHIL: **VERIFIED** (checked directly, often by code in this repository), **CORROBORATED** (two or more independent sources), **STATED** (one source says so, linked), **UNCORROBORATED**, and **INFERENCE** (a reasoned position, labeled as such).
2. Claims about this repository are VERIFIED by the gates wherever possible: contrast, font licenses from package manifests, zero network requests in the reel, beat durations.
3. The design rule behind the Homage Rule ("a style cannot be owned") is recorded as INFERENCE and explicitly not legal advice.
4. The gates report **PASS for the checks they ran**, never a verdict on a build that uses the codex. A clean validator run says nothing about whether a themed page is safe to ship; the auditor and the manifest do that.

## Consequences

- The [claims page](../reference/claims.md) is generated, so it cannot fall out of step with canon.
- Adding a fact to the docs means adding a claim, or phrasing it as a rule.
