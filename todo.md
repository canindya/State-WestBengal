# West Bengal State Dashboard — Task Tracker

## Phase 1: Core Setup — COMPLETE
- [x] Initialize git repository
- [x] Create project directory structure
- [x] Set up Next.js 16 with TypeScript, Tailwind v4
- [x] Install dependencies (Recharts, Leaflet, D3)
- [x] Create .gitignore
- [x] Create documentation files (CLAUDE.md, DESIGN.md, todo.md, CHANGELOG.md)
- [x] Create WB color palette (colors.ts)
- [x] Create theme CSS (globals.css)
- [x] Create layout components (Navbar, PageHeader, StatCard, ChartCard, etc.)
- [x] Create i18n infrastructure (en.json, bn.json, providers)
- [x] Create type definitions (types.ts)
- [x] Create data loading utilities (data.ts)
- [x] Create root layout (layout.tsx)
- [x] Scaffold all 10 page routes with placeholders
- [x] Verify dev server runs successfully

## Phase 1: Data Pipeline — COMPLETE
- [x] Create curated overview JSON (population, GSDP, literacy, etc.)
- [x] Create curated climate data (district rainfall, temperature, extreme events)
- [x] Create curated AQI data (5 major cities, seasonal patterns)
- [x] Create curated budget data (PRS India extraction)
- [x] Create curated health data (NFHS-5/NHM extraction)
- [x] Create curated demographics data (23 districts, Census 2011)
- [x] Create curated education data (UDISE+ extraction)
- [x] Create curated crime data (NCRB state data)
- [x] Create curated transport data (roads, vehicles, public transport)
- [x] Create placeholder WB district GeoJSON boundaries
- [x] Create Python download scripts (Open-Meteo weather + AQI)
- [x] Create Python transform scripts (AQI aggregation)
- [x] Copy all data to dashboard/public/data/

## Phase 1: Pages with Full Content — COMPLETE
- [x] Landing page (stat cards + section cards + data sources)
- [x] Climate page (district rainfall bar, monthly area, temperature trend, seasonal radar, extreme events)
- [x] Air Quality page (city-wise AQI, seasonal pattern, pollutant comparison, AQI scale)
- [x] Budget page (revenue vs expenditure, sector bars, revenue sources, capital vs revenue, fiscal indicators)
- [x] Health page (infrastructure, immunization radar, IMR/MMR trends, nutrition, anemia)
- [x] Map page (Leaflet choropleth with metric selector, color legend)

## Phase 2: Additional Pages — COMPLETE
- [x] Demographics page (population pyramid, district density, urbanization, urban/rural trend, SC/ST composition)
- [x] Education page (schools by type/management, enrollment by gender, infrastructure, learning outcomes, teacher metrics, management pie)
- [x] Crime page (yearly trends, category bars, special categories, district-wise crime rate)
- [x] Transport page (road network, vehicle registration trend, EV adoption, public transport cards, accident trends)

## Bug Fixes — COMPLETE
- [x] Add error handling to all page data loaders (catch + error state display)
- [x] Add console logging to fetchJSON for debugging
- [x] Fix .sort() mutation on frozen React state arrays (budget, education pages)
- [x] Replace unreadable Crime Categories treemap with horizontal bar chart

## Phase 3: Data Quality & Real Data — COMPLETE
- [x] Run Open-Meteo pipeline for real weather/AQI data (10 WB cities, 2015-2026)
- [x] Obtain real WB district boundary GeoJSON (replace simplified rectangles)
- [x] Cross-verify curated data against primary sources (Census, NCRB, NFHS-5, UDISE+, PRS India)
- [x] Add data vintage labels on each chart (e.g. "Source: Census 2011", "NFHS-5 2019-21")
- [x] Expand AQI data with more cities and daily granularity
- [x] Create weather transform script (convert raw Open-Meteo weather data to climate_wb.json)

## Phase 4: Deployment & Polish
- [x] GitHub Pages deployment workflow (.github/workflows/deploy.yml)
- [x] Set NEXT_PUBLIC_BASE_PATH=/State-WestBengal for production build
- [ ] Create GitHub repo (canindya/State-WestBengal) and push
- [x] Mobile responsive testing across breakpoints (nav breakpoint fix md→lg)
- [ ] Lighthouse performance audit and optimization

## Phase 3.5: Census 2011 Data Replacement — COMPLETE
- [x] Replace all Census 2011 demographics charts with NFHS-5 (2019-21) district indicators
- [x] Replace population pyramid with RGI 2011 vs 2026 projected comparison
- [x] Add SRS vital statistics trend (2010-2023) replacing urban/rural trend
- [x] Add household amenities, female literacy, child stunting charts (NFHS-5)
- [x] Update map choropleth: 5 NFHS-5 metrics replacing 4 Census metrics
- [x] Update home page StatCards (population, literacy, sex ratio) to modern sources
- [x] Update GeoJSON properties with NFHS-5 indicators on all 23 districts
- [x] Update overview JSON, i18n footer, SEO descriptions
- [x] Add data source banner explaining data currency on demographics page

## Phase 5: Enhancements
- [ ] Cross-domain correlations page (e.g. literacy vs crime rate, rainfall vs agriculture)
- [ ] Data export functionality (CSV download on all charts)
- [ ] Historical comparison slider on map page
- [ ] Search by district name
- [ ] Google Analytics integration
- [x] SEO meta tags for each page (title template, OG/Twitter cards, per-route metadata)
