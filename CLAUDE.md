# West Bengal State Dashboard

## Project Overview

Interactive web dashboard visualizing open data for West Bengal, India across **14 domains**: economy, demographics, tourism, investment, culture & heritage, climate & environment, air quality, health, education, crime & safety, transport, budget & finance, and geographic mapping. Built from 30+ open data sources. Supports dark and light themes.

Inspired by and modeled after the Kolkata City Dashboard: https://canindya.github.io/City-Kolkata

**Repo:** https://github.com/canindya/State-WestBengal

## Architecture

Two-part system: **Python data pipeline** (download + transform) and **Next.js 16 frontend** (static site with Recharts). See [DESIGN.md](DESIGN.md) for detailed design rationale.

```
State_WestBengal/
├── scripts/                    # Python data pipeline
│   ├── download/               # Fetchers for each data source
│   ├── transform/              # Raw -> processed JSON
│   └── run_pipeline.py         # Orchestrator
├── data/
│   ├── raw/                    # Downloaded files (gitignored)
│   ├── processed/              # Clean JSON files (committed)
│   └── geojson/                # District boundary GeoJSON
├── dashboard/                  # Next.js 16 app
│   ├── src/app/                # 10 page routes
│   ├── src/components/layout/  # Navbar, PageHeader, StatCard, ChartCard, ThemeProvider
│   ├── src/lib/                # types.ts, colors.ts, data.ts
│   ├── src/i18n/               # English + Bengali translations
│   └── public/data/            # Copy of processed JSON served statically
├── CLAUDE.md                   # This file
├── DESIGN.md                   # Architecture and design decisions
├── todo.md                     # Task tracking
├── CHANGELOG.md                # Dated changelog (updated after each commit)
├── implementation.md           # Data sources and implementation guide
└── .gitignore
```

## Data Pipeline

### Running the pipeline
```bash
# Automated scripts (weather/AQI via Open-Meteo API)
cd scripts
python run_pipeline.py

# Copy to dashboard
cp ../data/processed/*.json ../dashboard/public/data/
cp ../data/geojson/*.geojson ../dashboard/public/data/
```

### Processed JSON files
| File | Page(s) | Coverage |
|------|---------|----------|
| `overview_wb.json` | `/` | Key state indicators |
| `demographics_wb.json` | `/demographics` | District populations, urban/rural, SC/ST |
| `climate_wb.json` | `/climate` | Rainfall, temperature, extreme events |
| `aqi_wb.json` | `/environment` | Multi-city AQI, pollutants |
| `health_wb.json` | `/health` | Infrastructure, MMR, IMR, immunization |
| `education_wb.json` | `/education` | UDISE+ school data, enrollment |
| `crime_wb.json` | `/crime` | NCRB state crime statistics |
| `transport_wb.json` | `/transport` | Roads, vehicles, public transport |
| `budget_wb.json` | `/budget` | Revenue, expenditure, deficits |
| `economy_wb.json` | `/economy` | GSDP timeline, sectors, exports, WB vs India |
| `tourism_wb.json` | `/tourism` | Foreign arrivals, UNESCO, flights, sources |
| `investment_wb.json` | `/investment` | BGBS editions, major commitments, industrial infra |
| `culture_wb.json` | `/culture` | Nobel laureates, figures, art forms, destinations |
| `districts_wb.geojson` | `/map` | 23 district boundaries |

## Dashboard (Next.js)

### Tech stack
- **Next.js 16.2.1** (App Router, Turbopack)
- **Tailwind CSS v4** — `@import "tailwindcss"` + `@theme inline` (NOT v3)
- **Recharts** — all chart types
- **Leaflet** — interactive district maps
- **TypeScript** strict mode
- Custom layout components (no shadcn/ui)

### Key conventions
- All pages are `'use client'` components fetching from `/data/*.json` via `src/lib/data.ts`
- Theme: dark/light toggle via `ThemeProvider` context + `.light` class on `<html>` + CSS custom properties
- Recharts chart colors (grids, axes, tooltips, legends) themed via CSS `!important` overrides
- Recharts `Tooltip` `formatter`: use `(v) =>` not `(v: number) =>` (type error)
- Recharts `Pie` `label` with `percent`: needs `(percent ?? 0)` null guard
- Recharts `Treemap` `content`: must return `<g />` not `null`
- West Bengal color palette: sundarbansGreen, gangaBlue, shantiniketan, durgaVermillion, mustardYellow, terracottaBrown, twilightPurple, teaGreen

### Building and running
```bash
cd dashboard
npm install
npm run dev            # Dev server on :3000
npm run build          # Production build + type check
npx next start -p 3000 # Serve production build
```

### Pages (14 routes)
| Route | Title | Description |
|-------|-------|-------------|
| `/` | Landing | Key stats ribbon, 13 section cards, narrative ribbon, data source grid |
| `/economy` | Economy | GSDP trend, sector pie, exports, WB vs India comparison, Comeback narrative |
| `/demographics` | People & Demographics | Population pyramid, district density, urban/rural |
| `/tourism` | Tourism | Foreign arrivals, UNESCO sites, flight connectivity, Durga Puja impact |
| `/investment` | Investment & Business | BGBS timeline, major commitments, industrial ecosystem, key sectors |
| `/culture` | Culture & Heritage | Nobel laureates, iconic figures, art forms, 12 destinations |
| `/climate` | Climate & Environment | Rainfall, temperature trends, extreme weather |
| `/environment` | Air Quality | Multi-city AQI, pollutants, health advisories |
| `/health` | Health | Infrastructure, maternal/child health, disease burden |
| `/education` | Education | School infrastructure, enrollment, learning outcomes |
| `/crime` | Crime & Safety | Crime heat map, trends, special categories |
| `/transport` | Transport | Road network, vehicles, public transport, EVs |
| `/budget` | Budget & Finance | Revenue, expenditure, deficits, debt |
| `/map` | Geographic Map | Interactive district choropleth with metric selector |

## Commands Reference
```bash
# Install dependencies
pip install pandas requests openpyxl beautifulsoup4 numpy scipy
cd dashboard && npm install

# Run pipeline + copy to dashboard
cd scripts && python run_pipeline.py
cp ../data/processed/*.json ../dashboard/public/data/

# Build and serve
cd dashboard && npm run build && npx next start -p 3000
```

### Known issues / conventions
- Always use `[...array].sort()` instead of `array.sort()` on state data — React 19 freezes state objects
- All data-loading pages must have `.catch()` on the promise + error state display
- Recharts `Tooltip` `formatter`: use `(v) =>` not `(v: number) =>` (type error)
- Recharts `Pie` `label` with `percent`: needs `(percent ?? 0)` null guard
- Recharts `Treemap` `content`: must return `<g />` not `null`
- Avoid Treemap for categories with wide count ranges — use horizontal bar charts instead

## Session History
- **Session 1** (2026-04-04): Project setup and full build — scaffolded Next.js 16 app, created shared infrastructure (theme, colors, components, i18n), all 10 page routes with full chart content, curated JSON data for all domains, Python data pipeline for Open-Meteo API. Built Phase 1 (Landing, Climate, Air Quality, Budget, Health, Map) and Phase 2 (Demographics, Education, Crime, Transport) pages with 40+ Recharts visualizations. Fixed .sort() state mutation bugs, added error handling to all pages, replaced unreadable crime treemap with bar chart. Documentation files created (CLAUDE.md, DESIGN.md, todo.md, CHANGELOG.md).
- **Session 3** (2026-04-12): Phase 4.5 — closed the narrative gap from `WEST_BENGAL_DASHBOARD_PLAN.md`. Built 4 new pages (/economy, /tourism, /investment, /culture), 4 curated JSON data files, a reusable `ComparisonBar` component, and added landing-page narrative stat ribbon + 4 new section cards. Updated navbar, i18n (English + Bengali), types, loaders. Dashboard now covers 14 domains (up from 10), with full WB "story" coverage: economic decline/comeback, tourism surge, BGBS investments, Nobel laureates & heritage destinations. Data sourcing is hybrid — curated JSON from plan now, Python fetchers deferred.
- **Session 2** (2026-04-05): Phase 3 complete + Phase 4 progress + Census 2011 replacement. Data quality: added source labels to all 30+ charts, real WB GeoJSON, Open-Meteo pipeline, weather transform. Deployment: GitHub Actions workflow, SEO metadata, responsive fixes. **Major data modernization**: replaced all Census 2011 charts/data with NFHS-5 (2019-21) district indicators, RGI Population Projections (2026), and SRS vital statistics (2010-2023). Demographics page rebuilt with 6 new charts. Map page updated to 5 NFHS-5 choropleth metrics. Crime data corrected (SLL undercount). Data source banner added.
