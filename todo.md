# West Bengal State Dashboard — Task Tracker

## Phase 1: Core Setup
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

## Phase 1: Data Pipeline
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

## Phase 1: Pages with Full Content
- [x] Landing page (stat cards + section cards + data sources)
- [x] Climate page (district rainfall bar, monthly area, temperature trend, seasonal radar, extreme events)
- [x] Air Quality page (city-wise AQI, seasonal pattern, pollutant comparison, AQI scale)
- [x] Budget page (revenue vs expenditure, sector bars, revenue sources, capital vs revenue, fiscal indicators)
- [x] Health page (infrastructure, immunization radar, IMR/MMR trends, nutrition, anemia)
- [x] Map page (Leaflet choropleth with metric selector, color legend)

## Phase 2: Additional Pages
- [x] Demographics page (population pyramid, district density, urbanization, urban/rural trend, SC/ST composition)
- [x] Education page (schools by type/management, enrollment by gender, infrastructure, learning outcomes, teacher metrics, management pie)
- [x] Crime page (yearly trends, category treemap, special categories, district-wise crime rate)
- [x] Transport page (road network, vehicle registration trend, EV adoption, public transport cards, accident trends)

## Phase 3: Deployment & Polish
- [ ] GitHub Pages deployment workflow
- [ ] Obtain real WB district boundary GeoJSON (replace simplified rectangles)
- [ ] Run Open-Meteo pipeline for real weather/AQI data
- [ ] Mobile responsive testing
- [ ] Complete i18n English keys
- [ ] Bengali language support
- [ ] Final documentation updates
