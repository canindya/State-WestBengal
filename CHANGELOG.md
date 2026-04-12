# Changelog

All notable changes to the West Bengal State Dashboard will be documented in this file.

---

## 2026-04-13 — Landing page redesign: chart above the fold

Followed up the SWD sweep with a landing-page redesign that addresses the "looks AI-generated" critique. Core move: put a real data visualization above the fold on a data dashboard, and strip out the recognisable model-output tells.

### Added
- **Annotated GSDP line chart in the hero** — a rendered Recharts line (2015-16 → 2024-25, hardcoded 10-row constant for instant paint) with three direct annotations: starting point `₹8.03L`, the `COVID` dip, and the final `₹18.15L Cr` in bold mustard. No legend, no tooltip grid, no interactivity — explanatory, not exploratory. The line *shows* the "comeback" thesis that the headline *tells*.
- **Asymmetric 12-column hero layout** — editorial headline left (5/12), chart right (7/12) at `lg` and up; stacked on mobile.
- **Freshness strip** at the top of the landing: `UPDATED FY 2024-25 · 30+ OPEN DATA SOURCES · 14 DOMAINS`. Signals currency before anything else.
- **Stat masthead** below the hero — four bare tiles separated by `divide-x border-border`, no card borders, no colour accents, no gerund labels, no `Explore →` CTAs. Reads like a newspaper masthead, not a marketing grid.
- **Feature card for the Geographic group** — wide, typographic, with a huge muted `23` rendered as a background element anchored right. Breaks the uniform card-grid rhythm for the one group that only has a single item.
- **`layout` discriminator on `SectionGroup`** — `'grid-4' | 'grid-2' | 'feature'` — so different groups can render with different grids on the landing without duplicating code.

### Removed
- **Gerund-labelled hero cards** (`GROWING / WELCOMING / BUILDING / REMEMBERING`). The four 2×2 narrative cards with border-left accents and `Explore X →` CTAs are gone. The chart + masthead combination does their job with more credibility and less marketing-copy feel.
- **Per-card `Explore →` CTA** from every section card. The whole card is a link; the CTA was repetitive and was the second-clearest AI-generation tell.
- **The formulaic `West Bengal in data: 14 domains, 30+ open datasets, one state's full portrait.` subhead** — folded into the freshness strip and shortened to `West Bengal in data — one state's full portrait.`

### Changed
- **All 5 section-group taglines** rewritten to break parallel cadence. Previous taglines all hit the same triadic em-dash rhythm (`Three X. Three Y. One Z.`). New versions use varied sentence forms:
  - People: *"Fertility below replacement. Literacy climbing. The population curve is bending."*
  - Economy: *"Share of India's GDP halved since 1960. GSDP has doubled in the last decade. The comeback is data-supported."*
  - Culture: *"Tagore wrote two national anthems. Durga Puja moves \$4.5 billion. The brand outruns the infrastructure."*
  - Environment: *"The delta takes the first cyclone each year. Kolkata's winter air crosses WHO limits by 10×."*
  - Geographic: *"Click a district to see what the state average is hiding."*
- **Section groups use differentiated grid widths** — People and Economy stay at `lg:grid-cols-4`, Culture and Environment use `sm:grid-cols-2`, Geographic uses the new `feature` layout. Visual rhythm varies across the page instead of every row looking identical.
- **Headline typography** slightly tightened — `text-5xl xl:text-[3.5rem]` on the left column (was full-width `text-6xl`), fitting the new two-column constraint.

### Verified
- `npm run build` passes all 14 static routes with TypeScript strict mode.
- Curl of rendered home HTML shows zero literal `\uXXXX` escape sequences, all headline elements present, all 5 new taglines rendered, GSDP chart container mounted.
- Landing page paints instantly (GSDP data is a local constant — no fetch latency on the hero chart).

---

## 2026-04-13 — Storytelling-with-Data full dashboard sweep

Informed by Cole Nussbaumer Knaflic's four books (Storytelling with Data, Before & After, Storytelling with You, Let's Practice!). Every chart on every page was rewritten to follow SWD principles: takeaway titles, focused colour, quiet chart chrome, direct labels instead of legends, and per-page narrative blocks.

### Added
- **`src/lib/chartDefaults.ts`**: shared Recharts prop spreads (`AXIS_PROPS`, `AXIS_PROPS_SMALL`, `GRID_PROPS`, `GRID_PROPS_VERTICAL`) — removes default tick lines and axis lines, enforces a consistent `3 3` dashed grid, shifts all chart chrome through CSS variables so themes stay consistent.
- **`highlightColors()`, `highlightColorsBy()`, `dimmedColor()`** in `src/lib/colors.ts`: palette-aware focus helpers. Dim unfocused bars to ~40% opacity (`+ 66` hex alpha) while keeping highlighted bars at full brightness — preserves the Bengal palette as the brand while creating SWD-style visual hierarchy.
- **`story` prop on `PageHeader`**: optional 3-sentence lede paragraph rendered below the page description. Every page now opens with its Big Idea before any chart loads.

### Changed
- **Takeaway chart titles everywhere** (~52 charts across 11 pages). Titles used to describe the axes ("GSDP Growth", "Hospital Beds by District", "Foreign Tourist Arrivals") — they now state the conclusion ("GSDP has more than doubled in a decade", "Kolkata dominates the bed count — rural districts trail far behind", "Arrivals nearly doubled the pre-COVID peak"). Subtitles were rewritten as terse "what you're looking at" metadata lines.
- **Directional chart subtitles**: subtitles across all chart pages now describe what to look at, not just the axis units.
- **Pies and radars replaced with horizontal bars** in four places:
  - `/economy` — GSDP Sector Composition: pie → sorted horizontal bar
  - `/education` — School Management Distribution: pie → horizontal bar
  - `/health` — Immunization Coverage: radar → sorted horizontal bar
  - `/climate` — Seasonal Rainfall Distribution: radar → grouped horizontal bars
- **Single-element highlighting** applied to ~20 single-series bar charts. Examples: the latest BGBS edition highlighted against earlier ones; Kolkata highlighted in flights-per-day and hospital-beds charts; the #1 export highlighted against the rest; the top-3 worst stunting districts highlighted in red against the rest.
- **Direct end-labels replaced legends** on multi-series line and area charts in `/health` (IMR/MMR trends), `/demographics` (vital statistics), `/crime` (crime trend), `/transport` (vehicle trend + accident trend), `/budget` (fiscal indicators), `/climate` (temperature trend).
- **Reference lines** replaced inline target series on `/health` IMR/MMR trend charts and `/budget` fiscal indicators chart — cleaner, more SWD-orthodox.
- **Shared `AXIS_PROPS` / `GRID_PROPS` spreads** applied to every XAxis, YAxis, and CartesianGrid across all 11 chart pages. Removes default tickLine and axisLine; enforces a consistent dashed grid.
- **Stat cards cooled from 6 colours to 2 per page**: each page now uses its accent colour plus one neutral (e.g. health page = tea + sundarbans; economy = mustard + tea; tourism = durga + mustard). The 4 hero narrative cards on the landing page keep their 4 distinct colours as the intentional brand moment.
- **Per-page "story" blocks** added to every PageHeader: economy, tourism, investment, health, demographics, education, crime, transport, budget, climate, environment. Each a 3-sentence lede that sets up the page's Big Idea.

### Removed
- **`Legend` component** removed from most charts — replaced by direct end-labels or simple custom legend strips below the chart that match the editorial tone.

---

## 2026-04-13 — Issues.pdf bug sweep

### Fixed
- **Issue 1 — GSDP Growth subtitle** (`economy/page.tsx`): "\u20B9 lakh crore" rendering as literal text. Replaced with `₹ lakh crore`. Root cause: JSX *attribute* strings (double-quoted) don't interpret `\uXXXX` escapes — only JS string literals and template literals do. Prior assumption was wrong.
- **Issue 2 — Tourism YoY Growth subtitle**: "2023 \u2192 2024" rendering literally → `2023 → 2024`.
- **Issue 3 — Map page Area stat card**: "88,752 km\u00B2" rendering literally → `88,752 km²`.
- **Issue 7 — Foreign Tourist Arrivals subtitle**: "Millions per year (2019 \u2192 2024)" rendering literally → `Millions per year (2019 → 2024)`.
- **Bonus escape-bug sweep**: Same bug class found and fixed in `budget/page.tsx` (Revenue vs Expenditure subtitle, 2 Bar legend names), `investment/page.tsx` (BGBS subtitle), `environment/page.tsx` (Pollutant units `µg/m³`). All 9 JSX-attribute escape instances fixed.
- **Issue 4 — Homepage section group tagline alignment**: Taglines ("100 million lives…", "From 10.5% to 5.6%…") were right-aligned next to the group `h2` via `flex items-baseline justify-between`. Changed to stack below the header, left-aligned — now `h2` on top, muted italic tagline on the line below.
- **Issue 5 — Household Amenities chart unreadable**: Original chart had 23 districts × 3 metrics in a single vertical bar chart — 69 bars crammed together, impossible to read. Reworked as three separate horizontal bar charts arranged in a responsive grid (1 col on mobile, 3 cols on desktop), each sorted independently by its own metric. Districts now clearly rankable per dimension, leaders and laggards immediately visible.
- **Issue 6 — IMR / MMR need hover explanation**: Added `tooltip` prop content on `/health` stat cards (IMR: "Infant Mortality Rate — infant deaths per 1,000 live births, lower is better"; MMR: "Maternal Mortality Ratio — maternal deaths per 100,000 live births, lower is better"). Also added TFR tooltip on `/demographics`. Enhanced `StatCard` to render a small discoverable "i" info badge in the top-right corner whenever a `tooltip` is provided, cursor-help style, so the hoverable surface is obvious (not hidden behind a bare HTML title attribute).

---

## 2026-04-12 — Visual refresh, numeric safety, mobile polish

### Added
- **`src/lib/format.ts`** — safe numeric formatters (`fmtNum`, `fmtCompact`, `fmtInr`, `fmtLakhCr`, `fmtPct`, `fmtMillion`, `fmtAxis`) that return `—` for null / undefined / non-finite values instead of raw `NaN`
- **Editorial landing page** — magazine-style stacked headline ("Growing at 10.5% YoY. #2 in India for foreign tourists. Three Nobel Laureates."), seasonal tagline that rotates by month, hero chip showing population / area / districts
- **4 hero narrative cards** — "Growing / Welcoming / Building / Remembering" each linking to their respective section with prominent headline metric
- **Thematic section groups** on the landing page — People & Society · Economy & Business · Culture & Tourism · Environment & Climate · Geographic (replaces the flat 13-card grid)
- **`tabular-nums`** on all StatCard values for aligned number rendering
- **Auto-formatting in StatCard** — passing a raw `number` now renders via `fmtCompact` automatically; `null` / `undefined` render as `—`

### Changed
- **Navbar desktop breakpoint**: `lg` (1024px) → `xl` (1280px). The 14 nav items were overflowing on laptops; narrower screens now get the hamburger menu which handles them cleanly.
- **ChartCard and StatCard**: `rounded-xl` → `rounded-2xl` for a softer editorial feel
- **PageHeader**: h1 sized up from `text-xl/2xl/3xl` to `text-2xl/3xl/4xl` with `tracking-tight`
- **StatCard label**: now uses `uppercase tracking-wide` for magazine-style section labels
- **YAxis label widths tightened** on vertical bar charts for mobile legibility:
  - `climate/page.tsx` district rainfall: 140 → 100
  - `crime/page.tsx` crime categories: 160 → 115, special categories: 180 → 120, district rates: 140 → 100
  - `demographics/page.tsx` female literacy & stunting: 140 → 100
  - `budget/page.tsx` sector expenditure: 140 → 110
  - `transport/page.tsx` road network: 150 → 110
  - `education/page.tsx` learning outcomes: 170 → 130

### Removed
- **CSV download button on charts**: The `↓ CSV` button in `ChartCard` header has been removed. The `data` and `filename` props on `ChartCard` remain typed (now `@deprecated`) so existing callers don't break, but nothing is rendered and the `downloadCSV` / `slugify` helpers and the `useTranslation` hook have been dropped from the component.

### Added (Chart insights)
- **"So what?" takeaways**: Every chart across the dashboard now carries a short editorial interpretation — 52 insights across 11 pages (economy, tourism, investment, demographics, health, education, crime, transport, budget, climate, environment). Each insight explains the meaning of the chart in 1-2 sentences, not the mechanics, so a casual reader can understand why the visualization matters.
- **ChartCard `insight` prop**: new optional prop renders a mustard-accent callout ("SO WHAT?  …") between the chart and the source line. Left-border accent, `bg-card-hover/60` background, `text-xs leading-relaxed` body for unobtrusive presence.

### Changed (Homepage cards — City-Kolkata style)
- **Section cards rewritten** with concise fact-based copy inspired by Kolkata City Dashboard (e.g. "IMR 19 vs India 27 — already past the SDG U5MR target" instead of generic "Infrastructure, maternal & child health…"). Every card leads with a real number or a surprising fact, not a feature list.
- **Card layout upgraded**: flex column with title → leading-relaxed description → "Explore →" CTA at the bottom. CTA dims to muted state, brightens on group hover.
- Title typography tightened (`tracking-tight`, `text-base sm:text-lg font-semibold`) to match the editorial hero.

### Changed (Navbar)
- **Grouped navbar dropdowns**: Collapsed 14 flat nav items into 6 top-level entries with click-to-open dropdowns:
  - Home (standalone)
  - **People** → Demographics, Health, Education, Crime
  - **Economy** → Economy, Investment, Budget, Transport
  - **Culture** → Tourism, Culture
  - **Environment** → Climate, Air Quality
  - Map (standalone)
- Desktop breakpoint restored from `xl` back to `lg` (1024px) — 6 groups fit comfortably
- Dropdowns: click to open (not hover, for touch compatibility), close on outside click, close on route change, parent highlights as active when any child route matches
- Mobile menu: groups render as collapsible sections with indented children, auto-expand the group containing the current route, `max-h-[700px]` transition
- i18n: added `nav.section.people/economy/culture/environment` keys in English and Bengali

### Fixed
- **JSX escape-sequence rendering**: Unicode escapes like `\u20B9` (₹), `\u2014` (—), `\u2192` (→), `\u00b7` (·), `\u00b2` (²) were being written as literal backslash-u sequences inside JSX text nodes on the landing, economy, investment, and culture pages, rendering as visible `\u20B9...` strings in the browser. JSX text is not JavaScript, so escapes don't interpret there — replaced all 15 instances with actual unicode characters.

### Verified
- `npm run build` passes all 14 static routes with TypeScript strict mode
- All pages scanned for `NaN` in rendered HTML — 0 instances
- All pages scanned for raw 7+ digit numbers — 0 instances
- Theme infrastructure already matches Kolkata City Dashboard exactly (same CSS variable names, same hex values, same Geist font, same `max-w-7xl` container) — visual refresh is editorial only

---

## 2026-04-12 — Phase 4: Economy, Tourism, Investment, Culture pages

### Added
- **4 new pages** closing the narrative gap from `WEST_BENGAL_DASHBOARD_PLAN.md`:
  - `/economy` — GSDP timeline (2015-16 to 2024-25), sector pie, top exports bar, WB vs India comparison rows, "Comeback State" narrative callout, fiscal stat strip
  - `/tourism` — Foreign arrivals trend 2019-2024, WB share of India (14.92%), international flights/day comparison (Kolkata 51 vs Delhi 590 vs Mumbai 516), UNESCO sites, top source countries
  - `/investment` — BGBS editions timeline (2015-2025), major corporate commitments (Reliance, JSW, Ambuja Neotia, Haldia, ITC, Adani), industrial infrastructure grid, key sectors chips
  - `/culture` — Tagore quote, Nobel laureates timeline (Tagore, Sen, Banerjee), 9 iconic figures, 8 art forms, 12 destinations grid with type tags
- **4 new JSON data files** (curated from plan sources): `economy_wb.json`, `tourism_wb.json`, `investment_wb.json`, `culture_wb.json`
- **`ComparisonBar` component** (`src/components/layout/ComparisonBar.tsx`) — reusable WB vs India dual bar with win/lose coloring
- **New type interfaces**: `EconomyData`, `TourismData`, `InvestmentData`, `CultureData`
- **New data loaders**: `loadEconomy`, `loadTourism`, `loadInvestment`, `loadCulture` in `src/lib/data.ts`
- **Landing page narrative ribbon**: new stat cards for Foreign Tourists (3.12M, #2), BGBS ₹4.4L Cr, Nobel Laureates (3), UNESCO Sites (3)
- **Landing page section cards**: 4 new entries (Economy, Tourism, Investment, Culture) in the section grid
- **Navbar**: 4 new routes wired into desktop and mobile menus
- **i18n**: English + Bengali labels for all 4 new pages

### Changed
- **Landing page**: GSDP stat card updated from ₹15.4L Cr → ₹18.2L Cr (2024-25), stat ribbon reorganised into 6-col primary + 4-col narrative layout
- **Data sourcing approach (Phase 4)**: curated JSON hardcoded from plan's "Key data points" sections; Python fetchers for MoSPI / IBEF / WBIDC / Ministry of Tourism deferred to a later phase

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
