# West Bengal State Dashboard — Complete Build Plan for Claude Code

## Project Vision

Build a single-page, interactive, data-rich React dashboard that tells the complete story of West Bengal — its economy, people, culture, opportunities, challenges, and future. The dashboard should be compelling for both an insider (a Bengali wanting pride-worthy data) and an outsider (an investor, tourist, or researcher wanting to understand the state quickly). Every metric shown must be traceable to a real, cited source.

---

## 1. Architecture & Tech Stack

```
/west-bengal-dashboard
├── /public
│   └── /data                  # All JSON data files (static, pre-processed)
│       ├── economics.json
│       ├── demographics.json
│       ├── education.json
│       ├── health.json
│       ├── tourism.json
│       ├── investment.json
│       ├── crime.json
│       ├── culture.json
│       ├── weather.json
│       └── places.json
├── /src
│   ├── /components
│   │   ├── /layout
│   │   │   ├── DashboardShell.jsx      # Main layout with nav
│   │   │   ├── SectionHeader.jsx       # Reusable section headers
│   │   │   └── SourceFooter.jsx        # Data source citations
│   │   ├── /sections
│   │   │   ├── HeroSection.jsx         # State at a glance — key numbers
│   │   │   ├── EconomicsSection.jsx    # GSDP, sectors, exports, fiscal
│   │   │   ├── DemographicsSection.jsx # Population, religion, languages
│   │   │   ├── EducationSection.jsx    # Literacy, institutions, trends
│   │   │   ├── HealthSection.jsx       # IMR, life expectancy, infra
│   │   │   ├── TourismSection.jsx      # Arrivals, destinations, UNESCO
│   │   │   ├── InvestmentSection.jsx   # BGBS, companies, FDI
│   │   │   ├── CrimeSection.jsx        # NCRB data, safety metrics
│   │   │   ├── CultureSection.jsx      # Heritage, personalities, festivals
│   │   │   ├── WeatherSection.jsx      # Seasonal patterns
│   │   │   └── PlacesSection.jsx       # Key destinations with visuals
│   │   └── /charts
│   │       ├── BarChart.jsx
│   │       ├── LineChart.jsx
│   │       ├── PieChart.jsx
│   │       ├── StatCard.jsx
│   │       ├── ComparisonBar.jsx       # WB vs India comparison
│   │       ├── TimelineChart.jsx
│   │       └── HeatMap.jsx             # District-level map
│   ├── /hooks
│   │   └── useData.js                  # Data loading hook
│   ├── /utils
│   │   └── formatters.js               # Number/currency formatters
│   ├── App.jsx
│   └── index.js
├── /scripts
│   └── build-data.js                   # Script to compile JSON from raw CSVs
├── package.json
└── README.md
```

**Stack**: React 18 + Recharts + Tailwind CSS + Lucide Icons. No backend — all data is pre-compiled static JSON. This keeps cost at zero (host on Vercel/Netlify free tier).

---

## 2. Data Sources — Where to Get Real Data

### 2.1 Economics

| Metric | Source | URL | Format |
|--------|--------|-----|--------|
| GSDP (time series 2011–2025) | MoSPI / RBI | https://statisticstimes.com/economy/india/west-bengal-economy.php | Scrape/manual |
| GSDP sectoral split (Agri/Industry/Services) | MoSPI via EPWRF | https://niti.gov.in (state fiscal reports) | PDF → extract |
| State Budget highlights | PRS India | https://prsindia.org/budgets/states/west-bengal-budget-analysis-2024-25 | PDF/HTML |
| Exports by commodity | IBEF | https://www.ibef.org/states/west-bengal-presentation | PDF |
| Per capita income & poverty rate | NITI Aayog MPI 2023 | https://niti.gov.in | PDF |
| MSME count | NSSO 73rd round | data.gov.in | CSV |
| FDI cumulative | DPIIT | https://dpiit.gov.in | PDF |
| Tax revenue growth | WB Budget docs | https://finance.wb.gov.in | PDF |

**Key data points to hardcode**:
- GSDP FY25: ₹18.15 lakh crore (~$236 billion projected FY26)
- 4th largest state economy in India
- GDP contribution to India: 5.6% (down from 10.5% in 1960-61 — this is a critical narrative)
- Per capita income 2025-26: ~₹2.03 lakh ($2,400)
- Poverty rate: 11.89% vs national 14.96% (NITI Aayog 2023)
- MSME units: 88.67 lakh (2nd highest in India after UP, 14% of national total)
- Industrial growth 2024-25: 7.3% (above national 6.2%)
- Debt-to-GSDP ratio: ~38% (elevated but declining)
- Sector split: Services 54.9%, Industry 24%, Agriculture 17.1%

### 2.2 Demographics

| Metric | Source | URL |
|--------|--------|-----|
| Population (Census 2011 + projections) | Census of India | https://westbengal.census.gov.in |
| District-wise population | Registrar General | https://www.indiacensus.net/states/west-bengal |
| Religion breakdown | Census 2011 | Same as above |
| Language distribution | Census 2011 | Same |
| Sex ratio, density | Census 2011 | Same |
| Fertility rate | NFHS-5 (2019-21) | https://rchiips.org/nfhs/ |

**Key data points**:
- Population 2026 (est): ~100.6 million (4th most populous state)
- Density: 1,029/sq km (2nd highest after Bihar)
- Sex ratio: 947 females per 1,000 males
- Religion: Hindu 70.5%, Muslim 27%, Others 2.5%
- Languages: Bengali 86.2%, Hindi 5%, Santali 2.7%, Urdu 1.8%, Nepali 1.3%
- Total Fertility Rate: 1.6 (below replacement level, lower than national 2.0)
- 23 districts, area 88,752 sq km

### 2.3 Education

| Metric | Source | URL |
|--------|--------|-----|
| Literacy rate (2023-24 survey) | NSO/PLFS | https://www.indiastat.com/west-bengal-state/data/education |
| District-wise literacy | Census + NSO | Same |
| Number of universities/colleges | UGC / WB Higher Ed Dept | https://www.ugc.gov.in |
| Budget allocation | WB Budget 2024-25 | PRS India |

**Key data points**:
- Literacy rate (2023-24): 82.6% (Male 85.8%, Female 79.3%) — up from 76.3% in 2011
- Schools: 67,926+
- Colleges: 500+
- Universities: 33
- Education budget 2024-25: ₹47,470 crore ($5.73 billion)
- Notable institutions: IIT Kharagpur, ISI Kolkata, Presidency University, Jadavpur University, IIM Calcutta, Visva-Bharati (central university founded by Tagore)

### 2.4 Health

| Metric | Source | URL |
|--------|--------|-----|
| IMR, NMR, U5MR | SRS 2021 / MoHFW | https://www.mohfw.gov.in |
| Life expectancy | SRS | RBI Handbook |
| Hospital beds, PHCs | NHM / WB Health Dept | https://www.nhm.gov.in |
| Swasthya Sathi coverage | WB Govt | https://swasthyasathi.gov.in |
| NFHS-5 health indicators | IIPS | https://rchiips.org/nfhs/ |

**Key data points**:
- IMR: 19-20 per 1,000 live births (better than national 27)
- Under-5 Mortality Rate: 20 (already achieved SDG target of ≤25)
- Life expectancy: 71.6 years (above national ~69)
- Swasthya Sathi: Cashless health coverage up to ₹5 lakh/family/year
- Healthcare budget: ~₹16,368 crore
- Key challenge: Dengue outbreaks, rural infra gaps
- CareEdge State Ranking 2025: 13th of 17 large states (composite score 38.9)
- Three-tier health system: 909 hospitals/health centres

### 2.5 Tourism

| Metric | Source | URL |
|--------|--------|-----|
| Foreign tourist arrivals 2024 | India Tourism Data Compendium 2025 | Ministry of Tourism |
| Domestic tourist arrivals | Same | Same |
| UNESCO heritage sites | UNESCO | https://ich.unesco.org |
| Top destinations | WB Tourism Dept | https://wbtourism.gov.in |

**Key data points**:
- Foreign tourist arrivals 2024: 3.12 million (31 lakh) — 2nd highest in India after Maharashtra
- Growth: 14.8% YoY (from 27 lakh in 2023)
- Share of India's foreign tourists: 14.92%
- Durga Puja: UNESCO Intangible Cultural Heritage (2021) — generates ~$4.53 billion economic impact
- Sundarbans: UNESCO World Heritage Site (largest mangrove forest in the world)
- Key destinations: Kolkata, Darjeeling, Sundarbans, Shantiniketan, Digha, Kalimpong, Siliguri, Murshidabad
- Kolkata international flights: Only 51 daily arrivals (vs 590 Delhi, 516 Mumbai) — massive untapped potential
- Top source countries: USA, UK, Russia, Bangladesh

### 2.6 Investment & Business Opportunities

| Metric | Source | URL |
|--------|--------|-----|
| BGBS investment commitments | WBIDC | https://bengalglobalsummit.com |
| Major company investments | News sources / BGBS records | Various |
| IT parks, SEZs | WEBEL / WBIDC | https://wbidc.com |
| Ease of doing business | DPIIT | DPIIT reports |

**Key data points**:
- BGBS 2025: ₹4.40 lakh crore in investment proposals, 212 MoUs signed
- Cumulative BGBS (7 editions): ₹19 lakh crore proposals, ₹13 lakh crore realized
- Reliance: ₹50,000 crore invested, plan to double by end of decade; AI-ready data centre in Kolkata
- JSW: ₹16,000 crore for 1,600 MW power plant in Salboni
- Ambuja Neotia: ₹15,000 crore over 5 years (healthcare, hospitality, real estate)
- ITC: Global AI Centre of Excellence planned in New Town, Kolkata
- Bengal Silicon Valley Hub: 41 IT/ITES companies, 11 data centres on 200 acres
- FinTech Hub: Major banks on 69 acres
- 200+ industrial parks/estates ready for investment
- Largest leather complex in Asia (Bantala): 500 tanneries, ₹25,000 crore invested, 5 lakh employed
- Zero industrial strikes since 2010-11
- Key sectors: IT, Leather, Tea, Jute, Steel, Cement, FMCG, Retail

### 2.7 Law & Order

| Metric | Source | URL |
|--------|--------|-----|
| Crime rate per lakh | NCRB "Crime in India" | https://ncrb.gov.in |
| Violent crime rate | NCRB 2023 | Same |
| Kolkata city safety ranking | NCRB | Same |
| Charge-sheet rate | NCRB | Same |

**Key data points**:
- Violent crime rate: 46.1 per lakh (above national average — 4th highest among states)
- Kolkata: Safest metro city in India (crime rate 103.4 per lakh in 2021 vs Delhi ~1,200+)
- Charge-sheet rate: ~90.6% (among highest in India)
- Key challenge: Crimes against women, border security issues (long Bangladesh border)
- Cybercrime: Growing concern nationally
- Present this balanced — Kolkata is safe, but state-level rural crime needs attention

### 2.8 Weather & Climate

| Metric | Source | URL |
|--------|--------|-----|
| Monthly avg temperature | IMD | https://mausam.imd.gov.in |
| Rainfall data | IMD | Same |
| Cyclone history | IMD | Same |
| Climate zones | IMD | Same |

**Key data points** (hardcode seasonal averages):
- Summer (Mar–May): 30–40°C, hot and humid
- Monsoon (Jun–Sep): Heavy rainfall (1,500–2,000 mm annual), flooding risk
- Autumn (Oct–Nov): 20–30°C, pleasant — Durga Puja season
- Winter (Dec–Feb): 10–20°C, mild and dry — best tourist season
- Darjeeling: Cool year-round (5–20°C), hill climate
- Sundarbans: Tropical, tidal
- Major disasters: Cyclone Amphan 2020, annual monsoon flooding

### 2.9 Culture & Heritage

**This is NOT a data-table section — it's a narrative + visual section.**

**Key highlights to feature**:
- Durga Puja: UNESCO Intangible Cultural Heritage (2021), ~37,000 community pujas in Bengal, $4.53B economic impact
- Sundarbans: UNESCO World Heritage Site, home to Royal Bengal Tiger
- Bengali Renaissance: Intellectual movement that shaped modern India
- Nobel Laureates from Bengal: Rabindranath Tagore (Literature 1913), Amartya Sen (Economics 1998), Abhijit Banerjee (Economics 2019)
- Iconic figures: Swami Vivekananda, Satyajit Ray (Oscar-winning filmmaker), Subhas Chandra Bose, Jagadish Chandra Bose, Mother Teresa (adopted Kolkata)
- Bengali cuisine: Globally recognized — fish, sweets (rasgulla, sandesh, mishti doi)
- Art forms: Patachitra, Kantha embroidery, Dokra metalwork, Terracotta temples of Bishnupur
- Film: Tollywood (Tollygunge) — India's 2nd largest film industry
- Music: Rabindra Sangeet, Baul music (UNESCO recognized)
- Literature: Oldest literary tradition in modern Indian languages

### 2.10 Key Destinations (Places to Go)

Create an interactive card grid with images:

| Place | Type | Highlight |
|-------|------|-----------|
| Kolkata | City | Capital, cultural capital of India, Victoria Memorial, Howrah Bridge |
| Darjeeling | Hill Station | Tea gardens, Himalayan views, Toy Train (UNESCO) |
| Sundarbans | Nature | Largest mangrove, Bengal Tiger, UNESCO site |
| Shantiniketan | Heritage | Tagore's Visva-Bharati, art village |
| Siliguri | Gateway | Gateway to Northeast, tea & timber trade |
| Murshidabad | Heritage | Nawabi architecture, historical capital of Bengal |
| Digha/Mandarmani | Beach | Seaside resorts, Bay of Bengal |
| Bishnupur | Heritage | Terracotta temples, Malla dynasty |
| Kalimpong | Hill Station | Buddhist monasteries, flower market |
| Cooch Behar | Heritage | Rajbari Palace, cultural hub |
| Jaldapara | Wildlife | One-horned rhinoceros, elephant safari |
| Bakkhali/Henry Island | Beach | Unspoiled coastal stretches |

---

## 3. Dashboard Sections — What to Show in Each

### Section 1: Hero — "West Bengal at a Glance"
A full-width hero with 8-10 large stat cards in a grid:
- Population: ~100M
- GSDP: ₹18.15L Cr
- Rank: 4th largest economy
- Literacy: 82.6%
- Foreign tourists: 3.12M (#2 in India)
- BGBS investment: ₹4.4L Cr (2025)
- UNESCO tags: 2 (Durga Puja + Sundarbans)
- Nobel Laureates: 3 connected to Bengal
- Per capita income: ₹2.03 lakh

### Section 2: Economy Deep Dive
- **Line chart**: GSDP growth over 10 years (₹ crore) with annotation for key milestones
- **Pie chart**: Sector split — Agriculture 17% vs Industry 24% vs Services 55%
- **Bar chart**: Top exports (Engineering Goods, Gems & Jewellery, Tea, Rice, Leather)
- **Comparison bars**: WB vs India on key metrics (per capita, poverty rate, industrial growth)
- **Narrative callout**: "Once 10.5% of India's GDP (1960), now 5.6% — but staging a comeback"
- **Stat card**: MSME units — 88.67 lakh (2nd in India)

### Section 3: People & Demographics
- **Donut chart**: Religion breakdown
- **Horizontal bar**: Language distribution
- **Stat cards**: Population, density, sex ratio, TFR
- **District heatmap**: Population density by district (darker = more dense)
- **Comparison**: WB fertility rate (1.6) vs national (2.0) — "Below replacement"

### Section 4: Education
- **Progress bar/gauge**: Literacy trajectory 2001 → 2011 → 2024
- **Male vs Female literacy**: Dual bar comparison
- **Stat cards**: Schools, colleges, universities, budget
- **Notable institutions grid**: IIT KGP, ISI, IIM-C, Jadavpur, Presidency

### Section 5: Health Scorecard
- **Gauge/thermometer**: IMR (WB: 19 vs India: 27 — WB is better)
- **Comparison bar**: Life expectancy WB vs India
- **Stat cards**: U5MR, Swasthya Sathi coverage, hospital count
- **Traffic light indicator**: SDG targets met (U5MR ✅, NMR ⬜)
- **Narrative**: "Already achieved SDG U5MR target, but rural infra gaps remain"

### Section 6: Tourism Surge
- **Big number + trend arrow**: 3.12M foreign tourists (↑14.8%)
- **Ranking visual**: #2 in India for foreign arrivals (after Maharashtra)
- **Bar chart**: Year-wise foreign arrivals 2019–2024
- **UNESCO badge cards**: Durga Puja + Sundarbans
- **Callout**: "Only 51 international flights/day vs Delhi's 590 — imagine the potential"

### Section 7: Investment & Opportunities
- **Timeline**: BGBS editions (2015–2025) with investment amounts
- **Company logos + amounts**: Reliance (₹50K Cr), JSW (₹16K Cr), Ambuja Neotia (₹15K Cr), ITC (AI CoE)
- **Sector chips**: IT, Leather, Steel, Cement, FMCG, Green Energy
- **Stat card**: 200+ industrial parks, 41 IT companies in Silicon Valley Hub, 0 strikes since 2011
- **Narrative**: "From ₹2,000 Cr to ₹50,000 Cr — Reliance's Bengal story in a decade"

### Section 8: Safety & Law
- **Dual metric**: Kolkata = safest metro vs State violent crime above avg
- **Bar chart**: Crime categories breakdown
- **Charge-sheet rate**: 90.6% (among best in India)
- **Balanced narrative**: Present both positives and challenges honestly

### Section 9: Weather & Best Time to Visit
- **Monthly temperature line chart**: Min/Max across the year
- **Rainfall bar chart**: Monthly rainfall
- **Best season badges**: Oct-Feb for tourism
- **Region cards**: Kolkata (tropical), Darjeeling (alpine), Sundarbans (coastal)

### Section 10: Culture & Heritage
- **Visual cards** (not data-heavy — this is about storytelling):
  - Durga Puja (with $4.53B economic impact stat)
  - Nobel Laureates timeline (Tagore 1913, Sen 1998, Banerjee 2019)
  - Iconic figures gallery
  - Art forms showcase (Patachitra, Kantha, Baul)
- **Quote callout**: Famous quote from Tagore or Vivekananda

### Section 11: Places to Explore
- **Interactive card grid**: 12 destinations with type tags (Hill, Beach, Heritage, Nature, City)
- **Each card**: Name, one-line description, distance from Kolkata, best season

---

## 4. Design Principles

1. **Color palette**: Bengal-inspired — deep saffron (#E8751A), royal blue (#1A3C6E), off-white (#FDF8F0), forest green (#2D5F2E), gold accent (#C9A94E)
2. **Typography**: Clean sans-serif (Inter or similar). Bengali script for section titles adds character.
3. **Layout**: Single-page scrollable with sticky navigation. Each section fills viewport or near-viewport.
4. **Data density**: Every section has at least 3-5 real metrics. No empty marketing fluff.
5. **Source transparency**: Every data point gets a small source tag (e.g., "Source: NCRB 2023" or "Source: MoSPI 2024")
6. **Responsive**: Must work on mobile — card grids collapse to single column
7. **Accessibility**: High contrast, screen-reader friendly labels on charts
8. **Tone**: Proud but honest. Show strengths AND challenges. Don't hide the GDP share decline or crime issues — that builds credibility.

---

## 5. Data Preparation Instructions

For Claude Code, all data should be hardcoded into JSON files under `/public/data/`. Here's the exact format:

### economics.json
```json
{
  "gsdp_timeline": [
    {"year": "2015-16", "value_lakh_cr": 8.03},
    {"year": "2016-17", "value_lakh_cr": 8.93},
    {"year": "2017-18", "value_lakh_cr": 10.21},
    {"year": "2018-19", "value_lakh_cr": 11.51},
    {"year": "2019-20", "value_lakh_cr": 12.54},
    {"year": "2020-21", "value_lakh_cr": 12.41},
    {"year": "2021-22", "value_lakh_cr": 14.16},
    {"year": "2022-23", "value_lakh_cr": 15.36},
    {"year": "2023-24", "value_lakh_cr": 17.02},
    {"year": "2024-25", "value_lakh_cr": 18.15}
  ],
  "sector_split": {
    "agriculture": 17.1,
    "industry": 24.0,
    "services": 54.9,
    "other": 4.0
  },
  "key_metrics": {
    "gsdp_rank": 4,
    "gdp_share_india_pct": 5.6,
    "gdp_share_1960_pct": 10.5,
    "per_capita_income_inr": 203095,
    "poverty_rate_pct": 11.89,
    "national_poverty_pct": 14.96,
    "msme_units_lakh": 88.67,
    "msme_rank": 2,
    "industrial_growth_pct": 7.3,
    "national_industrial_growth_pct": 6.2,
    "exports_billion_usd": 12.67,
    "debt_gsdp_ratio_pct": 38.0,
    "own_tax_revenue_cr": 102349,
    "fiscal_deficit_pct_gsdp": 3.6
  },
  "top_exports": [
    {"name": "Engineering Goods", "rank": 1},
    {"name": "Gems & Jewellery", "rank": 2},
    {"name": "Tea", "rank": 3},
    {"name": "Rice", "rank": 4},
    {"name": "Leather & Products", "rank": 5}
  ],
  "sources": ["MoSPI", "RBI", "IBEF", "PRS India Budget Analysis 2024-25", "NITI Aayog MPI 2023"]
}
```

### demographics.json
```json
{
  "population": {
    "total_million": 100.6,
    "male_million": 51.5,
    "female_million": 49.1,
    "census_2011_million": 91.3,
    "density_per_sq_km": 1029,
    "density_rank": 2,
    "sex_ratio": 947,
    "area_sq_km": 88752,
    "districts": 23,
    "total_fertility_rate": 1.6,
    "national_tfr": 2.0,
    "urbanization_pct": 31.87,
    "decadal_growth_2001_2011_pct": 13.84
  },
  "religion": [
    {"name": "Hindu", "pct": 70.5},
    {"name": "Muslim", "pct": 27.0},
    {"name": "Christian", "pct": 0.72},
    {"name": "Buddhist", "pct": 0.31},
    {"name": "Others", "pct": 1.47}
  ],
  "languages": [
    {"name": "Bengali", "pct": 86.22},
    {"name": "Hindi", "pct": 5.0},
    {"name": "Santali", "pct": 2.66},
    {"name": "Urdu", "pct": 1.82},
    {"name": "Nepali", "pct": 1.26},
    {"name": "Others", "pct": 3.04}
  ],
  "sources": ["Census of India 2011", "NFHS-5 (2019-21)", "Registrar General India"]
}
```

### tourism.json
```json
{
  "foreign_arrivals": [
    {"year": 2019, "million": 1.65},
    {"year": 2020, "million": 0.35},
    {"year": 2021, "million": 0.42},
    {"year": 2022, "million": 1.80},
    {"year": 2023, "million": 2.70},
    {"year": 2024, "million": 3.12}
  ],
  "rank_foreign_arrivals": 2,
  "share_pct": 14.92,
  "yoy_growth_pct": 14.8,
  "kolkata_intl_flights_daily": 51,
  "delhi_intl_flights_daily": 590,
  "mumbai_intl_flights_daily": 516,
  "unesco_sites": [
    {"name": "Durga Puja in Kolkata", "type": "Intangible Cultural Heritage", "year": 2021},
    {"name": "Sundarbans National Park", "type": "World Heritage Site", "year": 1987}
  ],
  "durga_puja_economic_impact_billion_usd": 4.53,
  "community_pujas_count": 36946,
  "top_source_countries": ["USA", "UK", "Russia", "Bangladesh", "Germany"],
  "destinations": [
    {"name": "Kolkata", "type": "City", "highlight": "Cultural capital, Victoria Memorial, Howrah Bridge", "best_season": "Oct-Feb"},
    {"name": "Darjeeling", "type": "Hill Station", "highlight": "Tea gardens, Himalayan views, Toy Train (UNESCO)", "best_season": "Mar-May, Oct-Nov"},
    {"name": "Sundarbans", "type": "Nature", "highlight": "Largest mangrove forest, Royal Bengal Tiger", "best_season": "Oct-Mar"},
    {"name": "Shantiniketan", "type": "Heritage", "highlight": "Tagore's university town, art village", "best_season": "Oct-Feb"},
    {"name": "Siliguri", "type": "Gateway", "highlight": "Gateway to Northeast, trade hub", "best_season": "Oct-Mar"},
    {"name": "Murshidabad", "type": "Heritage", "highlight": "Nawabi palaces, Hazarduari", "best_season": "Oct-Feb"},
    {"name": "Digha", "type": "Beach", "highlight": "Bay of Bengal, weekend getaway", "best_season": "Oct-Feb"},
    {"name": "Bishnupur", "type": "Heritage", "highlight": "Terracotta temples, Malla dynasty", "best_season": "Oct-Mar"},
    {"name": "Kalimpong", "type": "Hill Station", "highlight": "Monasteries, flower nurseries", "best_season": "Mar-May, Oct-Nov"},
    {"name": "Cooch Behar", "type": "Heritage", "highlight": "Rajbari Palace, Koch dynasty", "best_season": "Oct-Feb"},
    {"name": "Jaldapara", "type": "Wildlife", "highlight": "One-horned rhino, elephant safari", "best_season": "Oct-May"},
    {"name": "Mandarmani", "type": "Beach", "highlight": "Longest driveable beach in India", "best_season": "Oct-Feb"}
  ],
  "sources": ["India Tourism Data Compendium 2025", "Ministry of Tourism GoI", "UNESCO"]
}
```

### investment.json
```json
{
  "bgbs_editions": [
    {"year": 2015, "proposals_lakh_cr": 2.43},
    {"year": 2016, "proposals_lakh_cr": 2.53},
    {"year": 2018, "proposals_lakh_cr": 2.19},
    {"year": 2019, "proposals_lakh_cr": 2.84},
    {"year": 2022, "proposals_lakh_cr": 3.42},
    {"year": 2023, "proposals_lakh_cr": 3.76},
    {"year": 2025, "proposals_lakh_cr": 4.40}
  ],
  "cumulative_proposals_lakh_cr": 19,
  "realized_lakh_cr": 13,
  "mous_2025": 212,
  "major_investments": [
    {"company": "Reliance Industries", "amount_cr": 50000, "sector": "Retail, Jio, New Energy", "note": "Plans to double by end of decade"},
    {"company": "JSW Group", "amount_cr": 16000, "sector": "Power (1600 MW at Salboni)", "note": "Expandable to 3200 MW"},
    {"company": "Ambuja Neotia", "amount_cr": 15000, "sector": "Healthcare, Hospitality, Real Estate", "note": "5-year plan"},
    {"company": "ITC", "amount_cr": null, "sector": "AI Centre of Excellence", "note": "New Town, Kolkata"},
    {"company": "Haldia Petrochemicals", "amount_cr": 8500, "sector": "Polycarbonate plant", "note": "Announced Mar 2025"},
    {"company": "Adani Ports (HDC)", "amount_cr": null, "sector": "Port mechanization", "note": "Syama Prasad Mookerjee Port"}
  ],
  "industrial_infra": {
    "industrial_parks": 200,
    "it_parks": 22,
    "electronics_parks": 2,
    "silicon_valley_hub_companies": 41,
    "data_centres": 11,
    "sezs": 22,
    "strikes_since_2011": 0
  },
  "key_industries": ["IT/ITES", "Leather", "Tea", "Jute", "Steel", "Cement", "Textiles", "FMCG", "Foundry", "Hosiery"],
  "sources": ["BGBS 2025", "WBIDC", "IBEF", "Business Standard", "GoodReturns"]
}
```

### health.json
```json
{
  "indicators": {
    "imr_per_1000": 19,
    "national_imr": 27,
    "u5mr_per_1000": 20,
    "national_u5mr": 31,
    "life_expectancy_years": 71.6,
    "national_life_expectancy": 69.0,
    "sdg_u5mr_target": 25,
    "sdg_u5mr_achieved": true,
    "swasthya_sathi_coverage_lakh_per_family": 5,
    "healthcare_budget_cr": 16368,
    "careedge_rank": 13,
    "careedge_total_states": 17
  },
  "infrastructure": {
    "medical_colleges": 18,
    "district_hospitals": 23,
    "rural_hospitals": 250,
    "phcs": 461
  },
  "sources": ["SRS 2021", "MoHFW GoI", "NFHS-5", "CareEdge 2025"]
}
```

### crime.json
```json
{
  "metrics": {
    "violent_crime_rate_per_lakh": 46.1,
    "violent_crime_rank": 4,
    "kolkata_crime_rate_per_lakh": 103.4,
    "kolkata_safety_rank": 1,
    "kolkata_rank_label": "Safest Metro",
    "chargesheet_rate_pct": 90.6,
    "delhi_crime_rate": 1200,
    "mumbai_crime_rate": 309.9,
    "pune_crime_rate": 256.8
  },
  "kolkata_vs_metros": [
    {"city": "Kolkata", "rate": 103.4},
    {"city": "Pune", "rate": 256.8},
    {"city": "Hyderabad", "rate": 259.9},
    {"city": "Mumbai", "rate": 309.9},
    {"city": "Chennai", "rate": 450.0},
    {"city": "Delhi", "rate": 1200.0}
  ],
  "sources": ["NCRB Crime in India 2023", "NCRB 2021-2022"]
}
```

### weather.json
```json
{
  "monthly_kolkata": [
    {"month": "Jan", "min": 12, "max": 26, "rainfall_mm": 11},
    {"month": "Feb", "min": 15, "max": 29, "rainfall_mm": 24},
    {"month": "Mar", "min": 20, "max": 34, "rainfall_mm": 27},
    {"month": "Apr", "min": 24, "max": 36, "rainfall_mm": 47},
    {"month": "May", "min": 25, "max": 36, "rainfall_mm": 130},
    {"month": "Jun", "min": 26, "max": 34, "rainfall_mm": 259},
    {"month": "Jul", "min": 26, "max": 33, "rainfall_mm": 325},
    {"month": "Aug", "min": 26, "max": 33, "rainfall_mm": 306},
    {"month": "Sep", "min": 25, "max": 33, "rainfall_mm": 252},
    {"month": "Oct", "min": 23, "max": 32, "rainfall_mm": 135},
    {"month": "Nov", "min": 17, "max": 30, "rainfall_mm": 17},
    {"month": "Dec", "min": 13, "max": 27, "rainfall_mm": 7}
  ],
  "annual_rainfall_mm": 1540,
  "climate_type": "Tropical wet-and-dry (Aw)",
  "best_visit_months": ["October", "November", "December", "January", "February"],
  "sources": ["India Meteorological Department (IMD)"]
}
```

### culture.json
```json
{
  "nobel_laureates": [
    {"name": "Rabindranath Tagore", "field": "Literature", "year": 1913, "connection": "Born in Kolkata, founded Visva-Bharati"},
    {"name": "Amartya Sen", "field": "Economics", "year": 1998, "connection": "Born in Shantiniketan, educated at Presidency College"},
    {"name": "Abhijit Vinayak Banerjee", "field": "Economics", "year": 2019, "connection": "Born in Kolkata, studied at Presidency & JNU"}
  ],
  "iconic_figures": [
    {"name": "Swami Vivekananda", "domain": "Spiritual Leader", "note": "1893 Chicago speech, Ramakrishna Mission"},
    {"name": "Satyajit Ray", "domain": "Filmmaker", "note": "Academy Honorary Award, Pather Panchali"},
    {"name": "Subhas Chandra Bose", "domain": "Freedom Fighter", "note": "Netaji, INA founder"},
    {"name": "Mother Teresa", "domain": "Humanitarian", "note": "Nobel Peace Prize 1979, lived in Kolkata"},
    {"name": "Jagadish Chandra Bose", "domain": "Scientist", "note": "Pioneer of radio, plant biology"},
    {"name": "Rabindranath Tagore", "domain": "Polymath", "note": "Nobel Prize, composed national anthems of India & Bangladesh"},
    {"name": "Satyendra Nath Bose", "domain": "Physicist", "note": "Bose-Einstein statistics, boson named after him"},
    {"name": "Mrinal Sen", "domain": "Filmmaker", "note": "Parallel cinema pioneer"},
    {"name": "Jhumpa Lahiri", "domain": "Author", "note": "Pulitzer Prize winner"}
  ],
  "art_forms": [
    {"name": "Durga Puja", "type": "Festival", "recognition": "UNESCO ICH 2021"},
    {"name": "Baul Music", "type": "Music", "recognition": "UNESCO Masterpiece of Oral Heritage"},
    {"name": "Patachitra", "type": "Painting", "recognition": "Scroll painting, GI tagged"},
    {"name": "Kantha Embroidery", "type": "Textile", "recognition": "Traditional stitch art"},
    {"name": "Dokra Metalwork", "type": "Craft", "recognition": "Lost-wax casting, tribal art"},
    {"name": "Terracotta Temples", "type": "Architecture", "recognition": "Bishnupur temples"},
    {"name": "Bengali Cuisine", "type": "Culinary", "recognition": "Fish, sweets (rasgulla, sandesh)"},
    {"name": "Rabindra Sangeet", "type": "Music", "recognition": "Songs of Tagore"},
    {"name": "Tollywood", "type": "Cinema", "recognition": "India's 2nd largest film industry"}
  ],
  "sources": ["UNESCO", "Nobel Foundation", "West Bengal Heritage Commission"]
}
```

---

## 6. Build Instructions for Claude Code

### Phase 1: Setup
```bash
npx create-react-app west-bengal-dashboard
cd west-bengal-dashboard
npm install recharts lucide-react
# Tailwind setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Phase 2: Data Layer
1. Create `/public/data/` folder
2. Add all 9 JSON files above (copy from this plan)
3. Create `useData.js` hook that fetches and caches JSON files

### Phase 3: Components (build in this order)
1. `StatCard` — reusable metric card (number, label, trend, source)
2. `ComparisonBar` — "WB vs India" horizontal bar
3. `SectionHeader` — title + subtitle + icon
4. Chart wrappers (thin wrappers around Recharts)
5. Section components (one per section above)
6. `DashboardShell` — sticky nav + scroll sections
7. `SourceFooter` — collapsible data sources panel

### Phase 4: Polish
1. Add smooth scroll between sections
2. Add intersection observer for scroll-triggered animations
3. Responsive breakpoints (mobile first)
4. Source citations on hover/click
5. Dark mode support (optional)

### Phase 5: Deploy
```bash
npm run build
# Deploy to Vercel/Netlify — zero cost
```

---

## 7. Narrative Threads (What Makes This Dashboard Meaningful)

The dashboard shouldn't just dump numbers. It should tell these stories:

1. **"The Comeback State"**: From 10.5% of India's GDP to 5.6% — but GSDP is growing at 10.5%, MSME is #2 in India, and BGBS investments are piling up. The decline was real; the turnaround is in progress.

2. **"Culture as Currency"**: Durga Puja alone generates $4.53B. UNESCO recognition has made Bengal the #2 foreign tourist destination. Culture IS the economy here.

3. **"The People Paradox"**: 100M people, fertility below replacement (1.6), high density (1,029/sq km), but literacy climbing fast (82.6%). More educated, fewer children, more urban — a demographic transition in real time.

4. **"Health — Better Than You Think"**: IMR below national average, life expectancy above it, already hit SDG U5MR target. Swasthya Sathi gives ₹5L coverage. But rural infra gaps and dengue outbreaks remain.

5. **"Kolkata — India's Safest Metro"**: Crime rate 103.4 vs Delhi's 1,200+. But state-level violent crime is above average. The data is nuanced.

6. **"The Gateway Nobody Sees"**: Only 51 international flights daily vs Delhi's 590. If air connectivity doubles, tourism could explode. This is the biggest unlock.

7. **"Renaissance 2.0"**: 3 Nobel Laureates, first Indian to win an Oscar, India & Bangladesh's national anthems both written by the same Bengali (Tagore), Bose-Einstein statistics named after a Bengali. Intellectual capital is Bengal's deepest moat.

---

## 8. What NOT to Do

- Don't use fake or estimated data without labeling it clearly
- Don't hide negative metrics (GDP decline, debt levels, crime)
- Don't make it political — no party logos, no CM photos
- Don't over-design — content density matters more than animations
- Don't use external APIs for real-time data (it will break) — use static JSON
- Don't add a backend — keep it deployable as a static site

---

## 9. Success Criteria

The dashboard is done when:
- [ ] Every section has at least 3 real, sourced data points
- [ ] Every chart has axis labels and a data source citation
- [ ] Mobile responsive (tested at 375px width)
- [ ] A person from outside India can understand WB in 5 minutes of scrolling
- [ ] A Bengali feels proud but also sees the challenges honestly presented
- [ ] Load time < 3 seconds on 4G
- [ ] Zero external API dependencies
- [ ] Can be deployed for free on Vercel/Netlify
