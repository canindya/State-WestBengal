# Changelog

All notable changes to the West Bengal State Dashboard will be documented in this file.

---

## 2026-04-05 — Phase 3: Data quality, modern sources, deployment prep

### Added
- **ChartCard source prop**: New `source` optional prop renders data attribution below each chart
- **Source labels**: All 30+ charts across 8 pages now display their data source (Census, NCRB, NFHS-5, UDISE+, ASER, PRS India, Open-Meteo, IMD, MoRTH, VAHAN)
- **Real GeoJSON**: Replaced placeholder rectangular boundaries with real WB district polygons from Census/Survey of India (CC BY 4.0)
- **Weather transform script**: `scripts/transform/weather_transform.py` converts raw Open-Meteo data into `climate_wb.json`
- **NFHS-5 district data**: 20 districts with 10 health/development indicators from National Family Health Survey 5 (2019-21)
- **RGI population projections**: State-level age-sex pyramids for 2011 and 2026, total projections through 2036
- **SRS vital statistics**: Birth rate, death rate, natural growth rate, IMR for West Bengal (2010-2023)
- **GitHub Actions workflow**: `.github/workflows/deploy.yml` for GitHub Pages deployment with `NEXT_PUBLIC_BASE_PATH`
- **SEO metadata**: Title templates, OpenGraph/Twitter cards, per-route `layout.tsx` for all 9 sub-pages
- **Data source banner**: Info bar on demographics page explaining data currency and Census 2021 status

### Changed
- **Demographics page rebuilt**: Replaced all 6 Census 2011 charts with modern sources — RGI projected pyramid (2011 vs 2026), female literacy by district (NFHS-5), child stunting by district (NFHS-5), household amenities (NFHS-5), vital statistics trend (SRS 2010-2023), population projection (RGI 2011-2036)
- **Map page**: Replaced 4 Census metrics with 5 NFHS-5 choropleth indicators (sex ratio at birth, female literacy, institutional delivery, immunization, stunting)
- **Home page**: Updated 3 StatCards from Census 2011 to modern sources (est. population from RGI, female literacy from NFHS-5, sex ratio at birth from NFHS-5)
- **GeoJSON properties**: Replaced Census 2011 fields (population, density, literacy, sexRatio) with NFHS-5 indicators on all 23 features
- **TypeScript types**: Replaced `DistrictDemographic` with `DistrictNFHS5`, updated `DemographicsData` and `DistrictFeature` interfaces
- **Navbar**: Desktop nav breakpoint moved from `md` to `lg` to prevent overflow on tablets
- **Climate data**: Now generated from real Open-Meteo API data (2015-2026, 10 cities) via weather transform
- **AQI data**: Real daily records from Open-Meteo (2022-2026, 10 cities, 13,400+ daily records)
- **i18n**: Updated footer text, demographics description, map description to reflect modern data sources

### Fixed
- **Crime data**: Corrected total cognizable crimes (~182K → ~397K for 2023) — SLL component was ~50% underreported
- **Pipeline reliability**: Added rate-limit retry logic (exponential backoff) to Open-Meteo download script

---

## 2026-04-04 — Bug fixes, error handling, and documentation

- Fix: `.sort()` on frozen React state arrays causing runtime TypeError (budget, education pages)
- Fix: Replace unreadable Crime Categories treemap with horizontal bar chart
- Fix: Add error handling (`.catch()` + error state) to all 8 data-loading pages
- Add: Console logging to `fetchJSON` in `data.ts` for debugging
- Update: DESIGN.md with lessons learned (state immutability, error handling, treemap readability)
- Update: CLAUDE.md with session history and known conventions
- Update: todo.md with Phase 3-5 roadmap

---

## 2026-04-04 — Phase 2: All pages complete

**Commit:** `163ba0b` — Add Phase 2 pages: Demographics, Education, Crime, Transport

- Demographics page: population pyramid, district density, urbanization by district, urban/rural trend (1951-2026), SC/ST composition
- Education page: schools by type/management, enrollment by gender, infrastructure %, learning outcomes (WB vs national), pupil-teacher ratio, management distribution pie
- Crime page: yearly trend lines (IPC/SLL), category treemap, special categories (women, children, SC/ST), district-wise crime rate
- Transport page: road network breakdown, vehicle registration stacked area, EV adoption, public transport cards, accident trend lines
- All 10 dashboard pages now have full chart content with 40+ visualizations total

---

## 2026-04-04 — Initial project setup

**Commit:** `e74d366` — Initial project setup: Next.js 16 dashboard with 10 pages, 6 fully built

- Scaffolded Next.js 16 + TypeScript + Tailwind v4 + Recharts + Leaflet
- Created WB cultural color palette (Sundarbans Green, Ganga Blue, Shantiniketan Ochre, etc.)
- Built 7 shared layout components (Navbar, PageHeader, StatCard, ChartCard, CategoryToggle, DateRangeFilter, Footer)
- Dark/light theme toggle with CSS custom properties
- i18n system (English complete, Bengali stub)
- 10 page routes scaffolded, 6 with full chart content:
  - Landing page: 8 stat cards, 9 section cards, data sources grid
  - Climate: District rainfall, monthly pattern, seasonal radar, temperature trend, extreme events
  - Air Quality: City-wise AQI, seasonal pattern, pollutant comparison
  - Budget: Revenue vs expenditure, sector breakdown, fiscal indicators
  - Health: Infrastructure, immunization radar, IMR/MMR trends, nutrition
  - Map: Leaflet district choropleth with metric selector
- Curated JSON data for all 10 domains from government sources
- Python data pipeline scripts for Open-Meteo weather/AQI API
- Placeholder district GeoJSON for 23 WB districts
- Documentation: CLAUDE.md, DESIGN.md, todo.md, CHANGELOG.md
