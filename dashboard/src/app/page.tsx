'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';

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
}

const SECTION_GROUPS: SectionGroup[] = [
  {
    title: 'People & Society',
    tagline: '100 million lives, 23 districts, one demographic transition.',
    items: [
      { href: '/demographics', title: 'Demographics', desc: '10.1 Cr people, TFR 1.6 — below replacement, density 1,029/km².', color: 'shantiniketan' },
      { href: '/health', title: 'Health', desc: 'IMR 19 vs India 27 — already past the SDG U5MR target.', color: 'tea' },
      { href: '/education', title: 'Education', desc: '82.6% literacy, up from 76.3% in a decade. 67K+ schools.', color: 'mustard' },
      { href: '/crime', title: 'Crime & Safety', desc: '46 violent crimes per lakh state-wide, but Kolkata is India\u2019s safest metro.', color: 'twilight' },
    ],
  },
  {
    title: 'Economy & Business',
    tagline: 'From 10.5% to 5.6% of India — now staging a comeback.',
    items: [
      { href: '/economy', title: 'Economy', desc: 'GSDP ₹18.2L Cr, rank #4. Industrial growth 7.3% vs India\u2019s 6.2%.', color: 'mustard' },
      { href: '/investment', title: 'Investment & Business', desc: '₹19L Cr in BGBS proposals over 7 editions. Zero strikes since 2011.', color: 'ganga' },
      { href: '/budget', title: 'Budget & Finance', desc: '₹47K Cr on education, debt-to-GSDP 38% — elevated but declining.', color: 'ganga' },
      { href: '/transport', title: 'Transport', desc: '51 international flights a day vs Delhi\u2019s 590 — the gateway gap.', color: 'terracotta' },
    ],
  },
  {
    title: 'Culture & Tourism',
    tagline: 'Three Nobel Laureates. Three UNESCO recognitions. One Bengal.',
    items: [
      { href: '/culture', title: 'Culture & Heritage', desc: 'Tagore, Sen, Banerjee. Durga Puja worth $4.53B. 12 destinations to explore.', color: 'twilight' },
      { href: '/tourism', title: 'Tourism', desc: '3.12M foreign visitors in 2024 — #2 in India, 14.8% YoY growth.', color: 'durga' },
    ],
  },
  {
    title: 'Environment & Climate',
    tagline: 'Mangroves, monsoons, and the air over a hundred million.',
    items: [
      { href: '/climate', title: 'Climate', desc: '1,540 mm annual rainfall, Kalboishakhi squalls, a warming delta.', color: 'sundarbans' },
      { href: '/environment', title: 'Air Quality', desc: 'Kolkata PM2.5 crosses 150 µg/m³ in winter — 10× the WHO limit.', color: 'durga' },
    ],
  },
  {
    title: 'Geographic',
    tagline: 'Twenty-three districts, five indicators, one interactive map.',
    items: [
      { href: '/map', title: 'District Map', desc: 'Choropleth of NFHS-5 indicators across 23 districts, one click away.', color: 'sundarbans' },
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
  if (month >= 2 && month <= 4) return 'Pre-monsoon \u2014 the state braces for Kalboishakhi and the first mango showers.';
  if (month >= 5 && month <= 8) return 'Monsoon \u2014 1,500 mm of rain reshapes rivers, fields, and fortunes.';
  if (month === 9 || month === 10) return 'Autumn \u2014 Durga Puja fills the streets and the air smells of shiuli.';
  return 'Winter \u2014 cool mornings over the delta, peak season across the state.';
}

export default function HomePage() {
  const { t } = useTranslation();
  const month = new Date().getMonth();
  const tagline = seasonalTagline(month);

  return (
    <div>
      {/* Editorial hero */}
      <section className="mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
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
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl">
          West Bengal in data: <span className="text-foreground font-semibold">14 domains</span>, <span className="text-foreground font-semibold">30+ open datasets</span>, one state&rsquo;s full portrait.
        </p>
        <p className="mt-3 text-sm text-muted italic max-w-2xl">{tagline}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-sundarbans" />
          Pop: <span className="text-foreground font-semibold">10.1 Cr</span> (RGI 2026)
          <span className="mx-1 text-border">·</span>
          Area: <span className="text-foreground font-semibold">88,752 km²</span>
          <span className="mx-1 text-border">·</span>
          Districts: <span className="text-foreground font-semibold">23</span>
        </div>
      </section>

      {/* Hero narrative cards */}
      <section className="mb-12 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/economy" className="group rounded-2xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 border-l-mustard">
            <p className="text-xs uppercase tracking-wide text-muted">Growing</p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tabular-nums">₹18.2L Cr</p>
            <p className="mt-1 text-sm text-foreground">GSDP 2024-25, rank #4 in India</p>
            <p className="mt-3 text-xs text-mustard group-hover:underline">Explore the economy →</p>
          </Link>
          <Link href="/tourism" className="group rounded-2xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 border-l-durga">
            <p className="text-xs uppercase tracking-wide text-muted">Welcoming</p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tabular-nums">3.12M</p>
            <p className="mt-1 text-sm text-foreground">Foreign tourists 2024, #2 in India</p>
            <p className="mt-3 text-xs text-durga group-hover:underline">Explore tourism →</p>
          </Link>
          <Link href="/investment" className="group rounded-2xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 border-l-ganga">
            <p className="text-xs uppercase tracking-wide text-muted">Building</p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tabular-nums">₹4.4L Cr</p>
            <p className="mt-1 text-sm text-foreground">BGBS 2025 proposals, 212 MoUs</p>
            <p className="mt-3 text-xs text-ganga group-hover:underline">Explore investment →</p>
          </Link>
          <Link href="/culture" className="group rounded-2xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 border-l-twilight">
            <p className="text-xs uppercase tracking-wide text-muted">Remembering</p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tabular-nums">3</p>
            <p className="mt-1 text-sm text-foreground">Nobel Laureates · Tagore, Sen, Banerjee</p>
            <p className="mt-3 text-xs text-twilight group-hover:underline">Explore culture →</p>
          </Link>
        </div>
      </section>

      {/* Section groups */}
      <section className="mb-12">
        <p className="text-xs uppercase tracking-widest text-muted mb-2">{t('home.sections')}</p>
        <p className="text-sm text-muted italic mb-8">Every number has a source. Every chart has a citation.</p>

        <div className="space-y-10">
          {SECTION_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">{group.title}</h2>
                <p className="mt-1 text-sm text-muted italic">{group.tagline}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.items.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={`group flex flex-col rounded-2xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 ${borderColors[s.color] || 'border-ganga'}`}
                  >
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{s.desc}</p>
                    <span className="mt-4 text-xs text-muted group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                      Explore <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-border pt-8">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">{t('home.dataSources')}</h2>
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
