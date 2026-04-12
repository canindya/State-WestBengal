# Design Process — West Bengal State Dashboard

> A companion to [DESIGN.md](DESIGN.md). Where DESIGN.md covers the architecture,
> this document covers the **design process** — the editorial approach, the visual
> system, the iterative journey, and the lessons learned along the way.

---

## 1. The Brief

Build a single interactive portal that tells the story of West Bengal through
open data — one that works for an insider (a Bengali wanting pride-worthy
numbers), an outsider (an investor or tourist wanting a quick understanding),
and a researcher (wanting sourced facts with district-level depth).

The north star was **not** "another government dashboard". It was an
**editorial data portal** — every page leading with a fact, every chart
earning its place, every interpretation sourced.

---

## 2. Inspiration

The project is a direct philosophical descendant of the
[Kolkata City Dashboard](https://canindya.github.io/City-Kolkata).

What we borrowed:

- **Typographic hero** — bold stacked headline statements, not carousels or illustrations.
- **Fact-first section cards** — each card leads with a number or surprising fact, not a generic description.
- **Thematic grouping** — sections organised by story, not by database schema.
- **Honest tone** — show strengths *and* challenges. No cheerleading.
- **Design-system primitives** — same CSS custom-property naming (`--bg`, `--fg`, `--card`, `--card-h`, `--bdr`, `--mute`), same max-width (`max-w-7xl`), same Geist font family.

What we diverged on:

- **District-level disaggregation**: The Kolkata dashboard is a city portrait. Ours adds 23 districts of disaggregation — every NFHS-5 indicator, every crime rate, every literacy number, rankable by district.
- **Bengal cultural palette**: Instead of Kolkata-specific hues (tram yellow, Maidan green), a palette drawn from the whole state — Sundarbans mangroves, Ganga blue, Shantiniketan ochre, Durga Puja sindoor, mustard fields, Bishnupur terracotta, twilight purple, Darjeeling tea green.
- **"So what?" on every chart**: Every Recharts visualization ships with a short editorial callout explaining what the numbers *mean*, not just what they are.

---

## 3. Design Pillars

Five principles governed every decision:

1. **Editorial, not encyclopedic.** Lead with facts. Every section card carries a real number or a surprising statement, not a bullet list of features.
2. **Data-dense but scannable.** Content density matters more than animations. A reader should be able to skim a page and walk away with three specific takeaways.
3. **Honest.** Show the comeback *and* the decline. Show Kolkata as India's safest metro *and* the rural under-reporting problem. Credibility comes from admission.
4. **Culturally grounded.** Palette, fonts, language, and imagery all resonate with Bengal. A reader from Birbhum should feel this was made for them, not ported from a template.
5. **Mobile-first.** If it doesn't render cleanly at 375 px width, it doesn't ship. All charts wrapped in `ResponsiveContainer`, all grids with `grid-cols-1` base breakpoints, all typography with `sm:` and `md:` scaling.

---

## 4. Visual Design System

### 4.1 Colors

Theme tokens live as CSS custom properties in `globals.css` and are exposed to Tailwind v4 via `@theme inline`. Both dark and light modes are first-class — the component layer reads `bg-card`, `text-foreground`, etc., and the variables do the work.

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | `#0F1419` | `#F8F9FA` | Page background |
| `--fg` | `#E8EAED` | `#1A1A2E` | Body text |
| `--card` | `#1E2A3A` | `#FFFFFF` | Card surface |
| `--card-h` | `#243447` | `#F0F1F3` | Card hover / subtle fill |
| `--bdr` | `#2D3748` | `#E2E4E8` | Borders, dividers |
| `--mute` | `#9AA0A6` | `#6B7280` | Captions, subtitles |

The **accent palette** (same in both themes) encodes cultural meaning:

| Token | Hex | Meaning |
|---|---|---|
| `sundarbans` | `#2D7D46` | Mangrove green — for health, environment |
| `ganga` | `#2B6E99` | River blue — for primary actions, economy |
| `shantiniketan` | `#C4873B` | Laterite ochre — for demographics, people |
| `durga` | `#D94F3D` | Vermillion — for alerts, tourism, AQI |
| `mustard` | `#D4A824` | Mustard field — for economy headlines, "So what?" callouts |
| `terracotta` | `#A0522D` | Bishnupur temples — for transport |
| `twilight` | `#7B68AE` | Evening sky — for culture, crime |
| `tea` | `#5A8F6A` | Darjeeling tea — for health supporting roles |

### 4.2 Typography

- **Family**: Geist Sans + Geist Mono (Vercel's open-source default). Falls back to `system-ui`.
- **Bengali**: Noto Sans Bengali, loaded for the i18n layer.
- **Hierarchy**:
  - Hero h1 — `text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight` (stacked headline statements).
  - Page h1 — `text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight`.
  - Section h2 — `text-xl sm:text-2xl font-bold`.
  - Card h3 — `text-base sm:text-lg font-semibold tracking-tight`.
  - Stat value — `text-xl sm:text-2xl md:text-3xl font-bold tabular-nums`.
  - Stat label — `text-[11px] sm:text-xs text-muted uppercase tracking-wide`.
  - Body — `text-sm leading-relaxed`.
- **`tabular-nums`** is applied to every numeric display so digits align vertically across rows.

### 4.3 Spacing, Radius, Surfaces

- Container: `max-w-7xl` (80 rem / 1280 px), `px-4`.
- Card radius: `rounded-2xl` everywhere (softer than the stock `rounded-xl`).
- Accent stripe: `border-l-4` with a palette colour, used on section cards and stat hero cards.
- Hover: `hover:bg-card-hover` — subtle fill shift, no scale transforms, no shadows on dark mode.
- Dividers: `border-t border-border` for section separators, never horizontal rules.

---

## 5. Component Patterns

### 5.1 `StatCard`

The atomic unit of numeric display. Props: `label`, `value`, `subtitle`, `color`, `tooltip`.

Responsibilities:
- Accept `string | number | null | undefined` as `value`. If a raw number is passed, it is auto-formatted through `fmtCompact` from `src/lib/format.ts` (e.g. `10123456` → `1.01 Cr`). If `null` / `undefined` is passed, it renders `—`. **Never `NaN`, never `undefined`, never raw 10-digit numbers.**
- Render a small **"i" info badge** in the top-right corner when a `tooltip` prop is provided, cursor-help style. The HTML `title` attribute carries the text. This is how acronyms like IMR/MMR/TFR get explained without cluttering the label.
- Uppercase muted label above, large tabular-nums value in the palette accent colour, optional muted subtitle below.

### 5.2 `ChartCard`

The wrapper around every Recharts visualization. Props: `title`, `subtitle`, `source`, `insight`, `children`, `className`.

Layout from top to bottom:
1. **Title** — `text-base sm:text-lg font-semibold`.
2. **Subtitle** — `text-sm text-muted` one-liner describing the axes or scope.
3. **Chart** — Recharts content, always inside a `ResponsiveContainer`.
4. **"So what?" callout** — mustard left-border, `bg-card-hover/60`, uppercase label, italic-free body. One or two sentences that explain the meaning of the chart.
5. **Source line** — `text-xs text-muted opacity-70`, prefixed with `Source:`.

The insight field is mandatory in spirit: every chart in the dashboard has one. 52 insights across 11 pages.

### 5.3 `PageHeader`

A left-bordered block with the page title and description. The border colour is a page-level accent (e.g. `border-mustard` for Economy, `border-durga` for Tourism). This single vertical stripe is the only persistent visual identity a page carries.

### 5.4 `ComparisonBar`

A custom dual-bar renderer for "West Bengal vs India" comparisons. Rows get `higherIsBetter` metadata; the WB bar is coloured green (`bg-sundarbans`) if WB is winning on that metric, red (`bg-durga`) if it's losing. The India bar is always Ganga blue. Reusable across Economy, Health, Tourism pages.

### 5.5 `Navbar`

Sticky top nav with grouped dropdowns. Six top-level entries:

- **Home** (standalone)
- **People** ▾ Demographics · Health · Education · Crime
- **Economy** ▾ Economy · Investment · Budget · Transport
- **Culture** ▾ Tourism · Culture
- **Environment** ▾ Climate · Air Quality
- **Map** (standalone)

Dropdowns are **click-to-open** (not hover), making them touch-compatible. Clicking outside closes the dropdown. The parent group highlights as active when any child route matches. On mobile, groups become collapsible sections with indented children, and the group containing the current route auto-expands.

---

## 6. Information Architecture

Fourteen pages organised into five thematic groups. Each group carries a one-sentence tagline that sets the mood before the cards load.

| Group | Tagline | Pages |
|---|---|---|
| People & Society | 100 million lives, 23 districts, one demographic transition. | Demographics · Health · Education · Crime & Safety |
| Economy & Business | From 10.5% to 5.6% of India — now staging a comeback. | Economy · Investment & Business · Budget & Finance · Transport |
| Culture & Tourism | Three Nobel Laureates. Three UNESCO recognitions. One Bengal. | Culture & Heritage · Tourism |
| Environment & Climate | Mangroves, monsoons, and the air over a hundred million. | Climate · Air Quality |
| Geographic | Twenty-three districts, five indicators, one interactive map. | District Map |

Section cards follow a strict pattern: **fact-based description**, not feature list. Examples:

- **Demographics** — "10.1 Cr people, TFR 1.6 — below replacement, density 1,029/km²."
- **Health** — "IMR 19 vs India 27 — already past the SDG U5MR target."
- **Crime & Safety** — "46 violent crimes per lakh state-wide, but Kolkata is India's safest metro."

Every card ends with an "Explore →" CTA that brightens on group hover.

---

## 7. The "So What?" Pattern

Every chart across the dashboard carries a short editorial interpretation below the visualization and above the source line. Examples:

- **IMR Trend (Health)** — *"IMR has dropped by roughly a third in a decade. West Bengal is already ahead of the national average — the question now is closing the remaining gap to the SDG target of 12."*
- **International Flights per Day (Tourism)** — *"Kolkata has fewer than 10% of Delhi's international flights — despite being the #2 state for foreign arrivals. The single biggest bottleneck to tourism growth isn't demand; it's runway slots."*
- **Learning Outcomes (Education)** — *"The uncomfortable truth: WB trails the national average on reading and arithmetic benchmarks. Literacy rate is high, but learning — the thing literacy is supposed to measure — still has a lot of ground to cover."*

These insights are the single highest-impact design pattern in the dashboard. They turn raw charts into editorial content that a casual reader can understand in seconds.

**52 insights across 11 pages.**

---

## 8. Iterative Journey

The dashboard was built in five visible phases, each roughly a session of work.

### Phase 1 — MVP scaffold
Next.js 16 + Tailwind v4 + Recharts + Leaflet. 10 pages scaffolded. Six built out with initial charts (Landing, Climate, Air Quality, Budget, Health, Map). Curated JSON across all domains. Initial cultural colour palette.

### Phase 2 — Secondary pages
Demographics, Education, Crime, Transport built to parity. 40+ Recharts visualizations total. First mobile responsive sweep.

### Phase 3 — Data quality and modernization
Replaced Census 2011 data with NFHS-5 (2019-21), RGI 2026 population projections, and SRS (2010-2023) vital statistics. Real WB district GeoJSON. Open-Meteo API integration for climate and AQI. GitHub Actions workflow for Pages deployment. SEO metadata per route.

### Phase 4 — Narrative pages
Gap analysis against `WEST_BENGAL_DASHBOARD_PLAN.md` revealed missing editorial dimensions: economy, tourism, investment, culture. Four new pages added with new data files (`economy_wb.json`, `tourism_wb.json`, `investment_wb.json`, `culture_wb.json`). Reusable `ComparisonBar` component. Landing page gained new stat ribbon and section cards.

### Phase 5 — Visual refresh (the City-Kolkata inspiration)
The largest design pass. Rebuilt the landing page with a magazine-style editorial hero ("Growing at 10.5% YoY. / #2 in India for foreign tourists. / Three Nobel Laureates."), a seasonal tagline that rotates by month, and four narrative hero cards (Growing / Welcoming / Building / Remembering). Thematic section grouping replaced the flat 13-card grid. Grouped navbar dropdowns replaced the 14-item flat nav. Card radii softened to `rounded-2xl`. Added `tabular-nums` everywhere. Introduced `src/lib/format.ts` for safe numeric rendering. YAxis widths tightened on district bar charts for mobile legibility.

### Phase 6 — Editorial polish
Chart insights added to every ChartCard (52 "So what?" callouts). CSV download button removed from charts. Section cards rewritten with fact-based copy. "i" info badge added to StatCard for acronym tooltips.

### Phase 7 — Bug sweep (Issues.pdf)
A screenshot PDF flagged seven issues in the rendered UI. All fixed in a single pass:

1. GSDP Growth subtitle — JSX-attribute escape bug (`\u20B9` rendering literally).
2. Tourism YoY Growth subtitle — same bug class (`\u2192`).
3. Map page Area stat card — same bug class (`\u00B2`).
4. Homepage section taglines were right-aligned under the header — moved to left-aligned, stacked below h2.
5. Household Amenities chart was unreadable (23 districts × 3 metrics crammed into one vertical bar chart) — reworked as three separate sorted horizontal bar charts in a responsive grid.
6. IMR/MMR acronyms unexplained — added `tooltip` content and a small discoverable "i" badge on the stat card.
7. Foreign Tourist Arrivals subtitle — same escape-bug class as #1.

Bonus sweep caught five more instances of the same JSX-attribute escape bug class that hadn't been visible in the PDF.

---

## 9. Lessons Learned

### 9.1 JSX attributes are not JavaScript strings
JSX double-quoted attribute values (`subtitle="... \u20B9 ..."`) do **not** interpret unicode escapes. Only JavaScript string literals (`'...\u20B9...'` or `` `...\u20B9...` ``) and template literals inside JSX expression braces (`{...}`) do. Assuming otherwise costs a full round of visible escape sequences in production. Use real unicode characters in JSX text and attribute strings — `₹`, `→`, `²`, `·`, `—`.

### 9.2 React 19 freezes state arrays
`array.sort()` on a value read from `useState` throws "Cannot assign to read only property". Always spread first: `[...array].sort((a, b) => ...)`. This caught us in three pages before we generalized the rule.

### 9.3 `.catch()` is mandatory
Pages using `loadData().then(setData)` without a `.catch()` silently swallowed fetch errors, leaving the page stuck on "Loading...". Every data-loading page now has both `.catch()` and an error state display with the error message.

### 9.4 Flat navigation doesn't scale past ~10 items
14 flat nav items overflowed the desktop bar at `lg` (1024 px). The fix wasn't smaller fonts or more breakpoints — it was **grouping**. Six top-level dropdowns is discoverable, 14 links is noise.

### 9.5 Treemaps hide small categories
Recharts Treemap rendered tiny cells for minor crime categories where labels couldn't fit. Replaced with a horizontal bar chart: every category visible, every label legible, sortable at a glance.

### 9.6 One chart, one story
The Household Amenities chart tried to compare 23 districts across 3 metrics in a single vertical bar chart (69 bars). Unreadable. Rewrote as three separate sorted bar charts in a responsive grid — each chart answers one question. **Don't overload a single chart to save card space.**

### 9.7 Acronyms need a hover surface
IMR, MMR, TFR, GSDP, HDI — any non-obvious three-letter code on a stat card needs an explanation. A bare HTML `title` attribute isn't discoverable. Adding a small "i" badge in the top-right corner signals hoverability without cluttering the label.

### 9.8 Format helpers eliminate whole bug classes
Introducing `src/lib/format.ts` with `fmtNum`, `fmtCompact`, `fmtInr`, `fmtLakhCr`, `fmtPct` let us delete dozens of ad-hoc `.toFixed()` calls and guarantee that `null` / `undefined` / `NaN` all render as `—` rather than leaking into the UI.

---

## 10. Design Principles in One Page

1. **Lead with the fact.** Every card, every section, every insight leads with a real number or a surprising statement.
2. **One card, one idea.** If a reader can't state the takeaway in one sentence, the card is doing too much.
3. **Honest over flattering.** Show the declines, the gaps, the under-reporting. Credibility is the currency.
4. **Palette is meaning.** Sundarbans green is not just a colour — it signals health and environment. Vermillion signals alerts. Mustard signals the editorial voice.
5. **Typography is hierarchy.** Don't lean on borders or backgrounds to create visual order. Let font size and weight do the work.
6. **Every chart ships with an interpretation.** "So what?" is not optional.
7. **Every number has a source.** The source line is part of the contract with the reader.
8. **Every route has a citation.** No marketing page. No "About" page with vibes. Every page is sourced.
9. **Mobile first, desktop second.** If it doesn't work at 375 px, it doesn't ship.
10. **No dead ends.** Every card links somewhere. Every page has nav back. Every chart has a page-level source.

---

## 11. What's Next

Gaps still open in Phase 5+:
- Cross-domain correlations page (literacy vs crime rate, rainfall vs agriculture).
- Historical comparison slider on the map page.
- District search.
- Google Analytics integration.
- Lighthouse performance pass.
- A Python fetcher for MoSPI / IBEF / WBIDC / Tourism Ministry data, replacing the curated JSON in the narrative pages.

The skeleton is stable. The next phase is about **deepening the interpretation**, not widening the surface area.
