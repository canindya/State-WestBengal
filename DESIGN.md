# Design Document — West Bengal State Dashboard

## 1. Problem Statement

West Bengal, India's fourth most populous state, has rich socio-economic data scattered across 30+ government portals, surveys, and reports. Data lives in PDFs, CSVs behind login walls, and inconsistent APIs. A citizen, journalist, policymaker, or researcher wanting to understand West Bengal holistically must navigate dozens of sources manually.

**Goal:** Build a single interactive dashboard that ingests, cleans, and visualizes West Bengal's open data across 10 major domains — making the state's story accessible through charts rather than spreadsheets.

**Inspiration:** This project directly extends the approach of the [Kolkata City Dashboard](https://canindya.github.io/City-Kolkata), scaling from city-level to state-level data with district-level disaggregation.

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                             │
│  Open-Meteo API  │  Census 2011  │  NCRB  │  PRS India  │ PDFs │
│  (weather, AQ)   │  (population, │  (crime │ (budget     │      │
│                  │   literacy)   │  stats) │  analysis)  │      │
└────────┬────────────────┬────────────────┬──────────────┬───────┘
         │                │                │              │
         ▼                ▼                ▼              ▼
┌──���──────────────────────────────────────────────────────────────┐
│                    DOWNLOAD LAYER (Python)                       │
│  scripts/download/*.py — automated for APIs                     │
│  Fetch raw data → data/raw/ (gitignored)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────��─────────────────────────┐
│                   TRANSFORM LAYER (Python)                       │
│  scripts/transform/*.py + curated JSON for PDF sources          │
│  Clean, filter, normalize, compute derived metrics              │
│  Output → data/processed/*.json                                 │
└───────────���────────────────┬───────���────────────────────────────┘
                             │
                             ▼
┌─────────────��───────────────────────────────────────────────────┐
│                   PRESENTATION LAYER (Next.js 16)                │
│  dashboard/src/app/ — 10 pages with Recharts + Leaflet          │
│  Static JSON fetch from /data/*.json at client render time      │
│  Dark/light theme via CSS custom properties                      │
└───────────���──────────────────────────��──────────────────────────┘
```

## 3. Key Design Decisions

### 3.1 Same Stack as Kolkata Dashboard
**Decision:** Replicate Next.js 16 + Tailwind v4 + Recharts + Leaflet stack.
**Why:** Proven architecture, consistent developer experience, shared component patterns. Allows cross-project learning.

### 3.2 Hybrid Data Pipeline
**Decision:** Use automated Python scripts for API sources (Open-Meteo weather/AQI) and curated JSON for PDF-sourced data (budget, health, education, crime).
**Why:** Most Indian government data for state-level indicators lives in PDFs and reports. Building scrapers for these would be fragile and slow. Curating the data manually and encoding it as clean JSON gets the dashboard running faster while maintaining accuracy. API-based sources (weather, AQI) are automated for frequent updates.

### 3.3 West Bengal Cultural Color Palette
**Decision:** Create a new color palette inspired by West Bengal's cultural and geographic identity.
**Palette:**
- Sundarbans Green (#2D7D46) — mangrove forests
- Ganga Blue (#2B6E99) — Ganga/Hooghly river system
- Shantiniketan Ochre (#C4873B) — laterite earth of Birbhum
- Durga Vermillion (#D94F3D) — Durga Puja sindoor
- Mustard Yellow (#D4A824) — Bengal's mustard fields
- Terracotta Brown (#A0522D) — Bishnupur temples
- Twilight Purple (#7B68AE) — evening sky accent
- Tea Green (#5A8F6A) — Darjeeling tea gardens

**Why:** Cultural resonance makes the dashboard feel uniquely West Bengal, just as the Kolkata palette (Hooghly blue, tram yellow, Maidan green) made that dashboard feel uniquely Kolkata.

### 3.4 District-Level Disaggregation
**Decision:** Design all data structures and visualizations to support 23-district breakdown.
**Why:** State-level data is the Kolkata dashboard's city-level equivalent, but the real value for a state dashboard is district-level comparison. This is the main structural difference from the city dashboard.

### 3.5 Static Site Deployment
**Decision:** Build as a static exported Next.js site, deployed to GitHub Pages.
**Why:** No server costs, instant loading, easy to maintain. Same as Kolkata.

### 3.6 Component Reuse from Kolkata
**Decision:** Adapt (not copy verbatim) all 7 layout components from Kolkata.
**What changed:** Color names in StatCard/PageHeader color maps, localStorage keys in ThemeProvider/LanguageProvider, brand name in Navbar, nav items list.
**What stayed:** ChartCard (CSV download), DateRangeFilter, overall responsive patterns.

## 4. Data Source Strategy

| Domain | Primary Source | Type | Update Frequency |
|--------|---------------|------|-----------------|
| Climate/Weather | Open-Meteo API | Automated | Daily (re-runnable) |
| Air Quality | Open-Meteo API | Automated | Daily (re-runnable) |
| Demographics | Census 2011 + projections | Curated JSON | Static (census) |
| Health | NFHS-5, NHM reports | Curated JSON | Annual |
| Education | UDISE+ 2024-25 | Curated JSON | Annual |
| Crime | NCRB via Indiastat | Curated JSON | Annual |
| Transport | VAHAN, WB Transport Dept | Curated JSON | Quarterly |
| Budget | PRS India, WB Finance Dept | Curated JSON | Annual |
| Geographic | State GIS Portal / Census | GeoJSON | Static |

## 5. Phased Implementation

- **Phase 1 (MVP):** Landing, Climate, Air Quality, Budget, Health, Map — COMPLETE
- **Phase 2:** Demographics, Education, Crime, Transport — COMPLETE
- **Phase 3:** Real data pipeline, data quality, GitHub Pages deployment
- **Phase 4:** Cross-domain correlations, Bengali language, accessibility
- **Phase 5:** Performance tuning, SEO, analytics

## 6. Lessons Learned

### 6.1 React State Immutability
**Issue:** `.sort()` on arrays from React state (`useState`) causes "Cannot assign to read only property" errors in React 19 strict mode. React freezes state objects.
**Fix:** Always use `[...array].sort()` to create a copy before sorting. Applied across budget, education, and crime pages.

### 6.2 Client-Side Data Loading Error Handling
**Issue:** Pages using `loadData().then(setData)` without `.catch()` silently swallowed fetch errors, leaving pages stuck on "Loading..." with no indication of what went wrong.
**Fix:** Added `.catch()` handlers and error state display on all 8 data-loading pages. Added console logging to `fetchJSON` in `data.ts` for debugging.

### 6.3 Treemap Readability
**Issue:** Recharts Treemap renders small cells for minor categories where text labels don't fit, making the chart unreadable.
**Fix:** Replaced Crime Categories treemap with a horizontal bar chart — clearer labels, sortable, and each category is always visible.
