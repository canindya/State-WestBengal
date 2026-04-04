# West Bengal State Dashboard

## Project Overview

Interactive web dashboard visualizing open data for West Bengal, India across **10 domains**: demographics, climate & environment, air quality, health, education, crime & safety, transport, budget & finance, and geographic mapping. Built from 30+ open data sources. Supports dark and light themes.

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

### Pages (10 routes)
| Route | Title | Description |
|-------|-------|-------------|
| `/` | Landing | Key stats ribbon, 9 section cards, data source grid |
| `/demographics` | People & Demographics | Population pyramid, district density, urban/rural |
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

## Session History
- **Session 1** (2026-04-04): Project setup — scaffolded Next.js 16 app, created shared infrastructure (theme, colors, components, i18n), all 10 page routes, documentation files. Modeled after Kolkata City Dashboard.
