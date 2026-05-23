

# Cognitia Page Redesign — Full Rewrite

## Scope Confirmation
**Only `src/pages/Cognitia.tsx` will be modified.** No changes to `src/pages/ITAMAlternate.tsx`, `src/App.tsx`, navigation, footer, or any other file. The `/en/itam` route and page remain completely untouched.

## What Changes

### Single file rewrite: `src/pages/Cognitia.tsx`

**Visual Overhaul:**
- New "Command Center" palette: deep charcoal (`hsl(240,15%,6%)`), electric violet (`#7C3AED`), data-blue (`#3B82F6`)
- Mouse-reactive canvas particle background replacing static TopologyBg SVG
- Updated glassmorphism card borders/glows to violet/blue spectrum

**Hero Section:**
- Headline: "Cognitia: Align IT Infrastructure with Business Reality."
- New sub-headline about transforming raw data into process-driven maps
- CSS layered graphic: messy infra layer → Cognitia lens → clean business dashboard
- Single CTA: "Request a Personalized Walkthrough"

**Four Feature Sections (new copy, vendor-agnostic positioning):**
1. **Environmental Awareness** — Universal Ingestion, Heuristic Identification, Dynamic Inventory
2. **Dynamic Service Context** — Technical/Logic/Process three-layer view, Impact Visualization
3. **Unified System of Truth** — Platform Orchestration, Automated Reconciliation, Data Health Monitoring
4. **Lifecycle Integrity** — Drift Alerts, Vulnerability Correlation, End-of-Life Planning (3 cards)

**Competitive Section Redesign:**
- Renamed: "Why Agile Enterprises Choose Cognitia"
- Format: "Old Way vs. Cognitia Way" narrative cards (no competitor names)
- Three contrasts: implementation speed, visualization, platform flexibility

**In-page Sub-nav:**
- Sticky smooth-scroll links: Discovery, Mapping, Integrations, Governance

**Closing CTA** updated to match new tone.

## Files NOT Changed
- `src/pages/ITAMAlternate.tsx` — `/en/itam` page is untouched
- `src/App.tsx` — route already exists
- `src/components/Navigation.tsx` — no nav changes
- `src/components/ITAMFooter.tsx` — no footer changes
- Locale files — page stays English-only hardcoded

