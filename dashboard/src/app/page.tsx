'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import { COLORS } from '@/lib/colors';
import { AXIS_PROPS } from '@/lib/chartDefaults';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceDot, Label,
} from 'recharts';

interface SectionItem {
  href: string;
  title: string;
  desc: string;
  color: string;
}

interface SectionGroup {
  title: string;
  tagline: string;
  items: SectionItem[];
  layout?: 'grid-4' | 'grid-2' | 'feature';
}

// Hardcoded hero-chart data. Synced from data/processed/economy_wb.json.
// Landing hero paints instantly — no fetch, no loading state.
const GSDP_DATA = [
  { year: '2015-16', value: 8.03 },
  { year: '2016-17', value: 8.93 },
  { year: '2017-18', value: 10.21 },
  { year: '2018-19', value: 11.51 },
  { year: '2019-20', value: 12.54 },
  { year: '2020-21', value: 12.41 },
  { year: '2021-22', value: 14.16 },
  { year: '2022-23', value: 15.36 },
  { year: '2023-24', value: 17.02 },
  { year: '2024-25', value: 18.15 },
];

const SECTION_GROUPS: SectionGroup[] = [
  {
    title: 'People & Society',
    tagline: 'Fertility below replacement. Literacy climbing. The population curve is bending.',
    layout: 'grid-4',
    items: [
      { href: '/demographics', title: 'Demographics', desc: '10.1 Cr people, TFR 1.6 — below replacement, density 1,029/km².', color: 'shantiniketan' },
      { href: '/health', title: 'Health', desc: 'IMR 19 vs India 27 — already past the SDG U5MR target.', color: 'tea' },
      { href: '/education', title: 'Education', desc: '82.6% literacy, up from 76.3% in a decade. 67K+ schools.', color: 'mustard' },
      { href: '/crime', title: 'Crime & Safety', desc: '46 violent crimes per lakh state-wide, but Kolkata is India\u2019s safest metro.', color: 'twilight' },
    ],
  },
  {
    title: 'Economy & Business',
    tagline: 'Share of India\u2019s GDP halved since 1960. GSDP has doubled in the last decade. The comeback is data-supported.',
    layout: 'grid-4',
    items: [
      { href: '/economy', title: 'Economy', desc: 'GSDP ₹18.2L Cr, rank #4. Industrial growth 7.3% vs India\u2019s 6.2%.', color: 'mustard' },
      { href: '/investment', title: 'Investment & Business', desc: '₹19L Cr in BGBS proposals over 7 editions. Zero strikes since 2011.', color: 'ganga' },
      { href: '/budget', title: 'Budget & Finance', desc: '₹47K Cr on education, debt-to-GSDP 38% — elevated but declining.', color: 'ganga' },
      { href: '/transport', title: 'Transport', desc: '51 international flights a day vs Delhi\u2019s 590 — the gateway gap.', color: 'terracotta' },
    ],
  },
  {
    title: 'Culture & Tourism',
    tagline: 'Tagore wrote two national anthems. Durga Puja moves $4.5 billion. The brand outruns the infrastructure.',
    layout: 'grid-2',
    items: [
      { href: '/culture', title: 'Culture & Heritage', desc: 'Tagore, Sen, Banerjee. Durga Puja worth $4.53B. 12 destinations to explore.', color: 'twilight' },
      { href: '/tourism', title: 'Tourism', desc: '3.12M foreign visitors in 2024 — #2 in India, 14.8% YoY growth.', color: 'durga' },
    ],
  },
  {
    title: 'Environment & Climate',
    tagline: 'The delta takes the first cyclone each year. Kolkata\u2019s winter air crosses WHO limits by 10×.',
    layout: 'grid-2',
    items: [
      { href: '/climate', title: 'Climate', desc: '1,540 mm annual rainfall, Kalboishakhi squalls, a warming delta.', color: 'sundarbans' },
      { href: '/environment', title: 'Air Quality', desc: 'Kolkata PM2.5 crosses 150 µg/m³ in winter — 10× the WHO limit.', color: 'durga' },
    ],
  },
  {
    title: 'Geographic',
    tagline: 'Click a district to see what the state average is hiding.',
    layout: 'feature',
    items: [
      { href: '/map', title: 'District Map', desc: 'A choropleth of NFHS-5 indicators across 23 districts. Pick a metric — sex ratio, literacy, immunization, stunting — and watch the geography light up.', color: 'sundarbans' },
    ],
  },
];

const borderColors: Record<string, string> = {
  ganga: 'border-ganga',
  sundarbans: 'border-sundarbans',
  shantiniketan: 'border-shantiniketan',
  durga: 'border-durga',
  mustard: 'border-mustard',
  terracotta: 'border-terracotta',
  twilight: 'border-twilight',
  tea: 'border-tea',
};

function seasonalTagline(month: number): string {
  if (month >= 2 && month <= 4) return 'Pre-monsoon — the state braces for Kalboishakhi and the first mango showers.';
  if (month >= 5 && month <= 8) return 'Monsoon — 1,500 mm of rain reshapes rivers, fields, and fortunes.';
  if (month === 9 || month === 10) return 'Autumn — Durga Puja fills the streets and the air smells of shiuli.';
  return 'Winter — cool mornings over the delta, peak season across the state.';
}

export default function HomePage() {
  const { t } = useTranslation();
  const month = new Date().getMonth();
  const tagline = seasonalTagline(month);
  const firstPoint = GSDP_DATA[0];
  const lastPoint = GSDP_DATA[GSDP_DATA.length - 1];

  return (
    <div>
      {/* Freshness strip */}
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-6">
        Updated FY 2024-25 · 30+ open data sources · 14 domains
      </p>

      {/* Editorial hero — asymmetric: headline left, GSDP chart right */}
      <section className="mb-12 sm:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: headline */}
          <div className="lg:col-span-5">
            <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.05] tracking-tight">
              <span className="block">
                <span className="text-mustard">Growing</span> at 10.5% YoY.
              </span>
              <span className="block mt-2">
                <span className="text-durga">#2</span> in India for foreign tourists.
              </span>
              <span className="block mt-2">
                <span className="text-twilight">Three</span> Nobel Laureates.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted max-w-xl">
              West Bengal in data — one state&rsquo;s full portrait.
            </p>
            <p className="mt-3 text-sm text-muted italic max-w-xl">{tagline}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-sundarbans" />
              Pop: <span className="text-foreground font-semibold">10.1 Cr</span>
              <span className="mx-1 text-border">·</span>
              Area: <span className="text-foreground font-semibold">88,752 km²</span>
              <span className="mx-1 text-border">·</span>
              Districts: <span className="text-foreground font-semibold">23</span>
            </div>
          </div>

          {/* Right: annotated GSDP chart */}
          <div className="lg:col-span-7">
            <p className="text-[11px] uppercase tracking-widest text-muted mb-2">
              GSDP · ₹ lakh crore · FY16 → FY25
            </p>
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={GSDP_DATA} margin={{ top: 30, right: 60, bottom: 10, left: 0 }}>
                  <XAxis dataKey="year" {...AXIS_PROPS} interval={1} tick={{ fontSize: 10 }} />
                  <YAxis {...AXIS_PROPS} tickFormatter={(v) => `₹${v}L`} domain={[6, 22]} ticks={[8, 12, 16, 20]} />
                  <Tooltip
                    formatter={(v) => `₹${Number(v).toFixed(2)}L Cr`}
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.mustardYellow}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: COLORS.mustardYellow }}
                  />
                  {/* Start annotation */}
                  <ReferenceDot x={firstPoint.year} y={firstPoint.value} r={4} fill={COLORS.mustardYellow} stroke="none">
                    <Label value={`₹${firstPoint.value}L`} position="bottom" offset={10} fontSize={10} fill="var(--mute)" />
                  </ReferenceDot>
                  {/* COVID dip annotation */}
                  <ReferenceDot x="2020-21" y={12.41} r={4} fill={COLORS.durgaVermillion} stroke="none">
                    <Label value="COVID" position="top" offset={10} fontSize={10} fill={COLORS.durgaVermillion} fontWeight={600} />
                  </ReferenceDot>
                  {/* End annotation — the big one */}
                  <ReferenceDot x={lastPoint.year} y={lastPoint.value} r={5} fill={COLORS.mustardYellow} stroke="var(--bg)" strokeWidth={2}>
                    <Label value={`₹${lastPoint.value}L Cr`} position="top" offset={14} fontSize={13} fill={COLORS.mustardYellow} fontWeight={700} />
                  </ReferenceDot>
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-muted text-center">
                Source: MoSPI / RBI Handbook. GSDP more than doubled in a decade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat masthead — no cards, no borders, thin dividers only */}
      <section className="mb-12 sm:mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-border divide-x divide-border">
          <div className="px-4 py-5">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">₹18.2L Cr</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">GSDP 2024-25</p>
            <p className="mt-0.5 text-xs text-muted">Rank #4 in India</p>
          </div>
          <div className="px-4 py-5">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">10.1 Cr</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Population</p>
            <p className="mt-0.5 text-xs text-muted">RGI 2026 projection</p>
          </div>
          <div className="px-4 py-5">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">3.12M</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Foreign Tourists</p>
            <p className="mt-0.5 text-xs text-muted">2024 · #2 in India</p>
          </div>
          <div className="px-4 py-5">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">3</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Nobel Laureates</p>
            <p className="mt-0.5 text-xs text-muted">Tagore · Sen · Banerjee</p>
          </div>
        </div>
      </section>

      {/* Section groups */}
      <section className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-1">{t('home.sections')}</p>
        <p className="text-sm text-muted mb-10">Every number has a source. Every chart has a citation.</p>

        <div className="space-y-12">
          {SECTION_GROUPS.map((group) => {
            const gridClass =
              group.layout === 'grid-2'
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                : group.layout === 'feature'
                  ? 'grid grid-cols-1 gap-4'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';

            return (
              <div key={group.title}>
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{group.title}</h2>
                  <p className="mt-1 text-sm text-muted max-w-3xl">{group.tagline}</p>
                </div>

                {group.layout === 'feature' ? (
                  // Geographic card — wide, typographic, big background numeral
                  <Link
                    href={group.items[0].href}
                    className={`relative block overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 hover:bg-card-hover transition-colors border-l-4 ${borderColors[group.items[0].color] || 'border-ganga'}`}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 text-[7rem] sm:text-[10rem] leading-none font-bold text-muted/10 select-none tabular-nums"
                    >
                      23
                    </span>
                    <div className="relative max-w-xl">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{group.items[0].title}</h3>
                      <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">{group.items[0].desc}</p>
                    </div>
                  </Link>
                ) : (
                  <div className={gridClass}>
                    {group.items.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`flex flex-col rounded-2xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 ${borderColors[s.color] || 'border-ganga'}`}
                      >
                        <h3 className="text-base sm:text-lg font-semibold tracking-tight">{s.title}</h3>
                        <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{s.desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-border pt-8">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted mb-4">{t('home.dataSources')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-muted">
          <span>RGI Projections 2020</span>
          <span>NFHS-5 (2019-21)</span>
          <span>SRS Vital Statistics</span>
          <span>India Meteorological Dept</span>
          <span>Open-Meteo API</span>
          <span>NCRB Crime in India</span>
          <span>UDISE+ 2024-25</span>
          <span>PRS India Budget</span>
          <span>WB Finance Department</span>
          <span>VAHAN Dashboard</span>
          <span>CAG Audit Reports</span>
          <span>NHM West Bengal</span>
          <span>MoSPI / RBI</span>
          <span>IBEF West Bengal</span>
          <span>Ministry of Tourism</span>
          <span>WBIDC / BGBS</span>
          <span>UNESCO</span>
          <span>Nobel Foundation</span>
        </div>
      </section>
    </div>
  );
}
