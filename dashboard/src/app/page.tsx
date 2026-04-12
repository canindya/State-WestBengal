'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import StatCard from '@/components/layout/StatCard';

const SECTIONS = [
  { href: '/economy', title: 'Economy', desc: 'GSDP trends, sector split, exports, MSMEs, WB vs India', color: 'mustard' },
  { href: '/demographics', title: 'People & Demographics', desc: 'Population, districts, urban-rural split, social categories', color: 'shantiniketan' },
  { href: '/tourism', title: 'Tourism', desc: 'Foreign arrivals, UNESCO sites, Durga Puja economy', color: 'durga' },
  { href: '/investment', title: 'Investment & Business', desc: 'BGBS proposals, major commitments, industrial ecosystem', color: 'ganga' },
  { href: '/culture', title: 'Culture & Heritage', desc: 'Nobel laureates, iconic figures, art forms, destinations', color: 'twilight' },
  { href: '/health', title: 'Health', desc: 'Healthcare infrastructure, maternal & child health, disease burden', color: 'tea' },
  { href: '/education', title: 'Education', desc: 'School infrastructure, enrollment, learning outcomes', color: 'mustard' },
  { href: '/climate', title: 'Climate & Environment', desc: 'Rainfall, temperature trends, extreme weather events', color: 'sundarbans' },
  { href: '/environment', title: 'Air Quality', desc: 'AQI monitoring across major cities, pollutant breakdown', color: 'durga' },
  { href: '/crime', title: 'Crime & Safety', desc: 'Crime statistics, trends, special categories', color: 'twilight' },
  { href: '/transport', title: 'Transport', desc: 'Road network, vehicles, public transport, road safety', color: 'terracotta' },
  { href: '/budget', title: 'Budget & Finance', desc: 'Revenue, expenditure, fiscal deficits, debt', color: 'ganga' },
  { href: '/map', title: 'Geographic Map', desc: 'Interactive district-level choropleth with thematic overlays', color: 'sundarbans' },
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

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="text-ganga">{t('home.pageTitle')}</span>{' '}
          <span className="text-foreground">{t('home.pageTitleSuffix')}</span>
        </h1>
        <p className="mt-3 text-muted max-w-2xl">{t('home.pageDesc')}</p>
      </div>

      {/* Key Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label={t('home.stat_population')} value="10.1 Cr" subtitle="RGI Projection 2026" color="ganga" />
        <StatCard label={t('home.stat_gsdp')} value="\u20B918.2L Cr" subtitle="2024-25 \u2014 Rank #4" color="mustard" />
        <StatCard label={t('home.stat_literacy')} value="76.1%" subtitle="Female 15-49 (NFHS-5)" color="sundarbans" />
        <StatCard label={t('home.stat_sexRatio')} value="973" subtitle="at birth (NFHS-5)" color="durga" />
        <StatCard label={t('home.stat_hdi')} value="0.641" subtitle="Rank 28 (2021)" color="tea" />
        <StatCard label={t('home.stat_forest')} value="18.93%" subtitle="ISFR 2023" color="sundarbans" />
      </div>

      {/* Narrative stats ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-10">
        <StatCard label="Foreign Tourists" value="3.12M" subtitle="2024 \u2014 #2 in India" color="durga" />
        <StatCard label="BGBS 2025 Proposals" value="\u20B94.4L Cr" subtitle="212 MoUs signed" color="ganga" />
        <StatCard label="Nobel Laureates" value="3" subtitle="Tagore \u00b7 Sen \u00b7 Banerjee" color="twilight" />
        <StatCard label="UNESCO Sites" value="3" subtitle="Durga Puja \u00b7 Sundarbans \u00b7 DHR" color="shantiniketan" />
      </div>

      {/* Section Cards */}
      <h2 className="text-xl font-semibold mb-4">{t('home.sections')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`block rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors border-l-4 ${borderColors[s.color] || 'border-ganga'}`}
          >
            <h3 className="font-semibold mb-1">{s.title}</h3>
            <p className="text-sm text-muted">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* Data Sources */}
      <h2 className="text-xl font-semibold mb-4">{t('home.dataSources')}</h2>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm text-muted">
          <span>RGI Projections 2020</span>
          <span>India Meteorological Dept</span>
          <span>Open-Meteo API</span>
          <span>NCRB</span>
          <span>NFHS-5</span>
          <span>UDISE+ 2024-25</span>
          <span>PRS India</span>
          <span>WB Finance Department</span>
          <span>VAHAN Dashboard</span>
          <span>CAG Audit Reports</span>
          <span>NHM West Bengal</span>
          <span>WB State GIS Portal</span>
        </div>
      </div>
    </div>
  );
}
