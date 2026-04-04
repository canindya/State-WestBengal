'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import StatCard from '@/components/layout/StatCard';

const SECTIONS = [
  { href: '/demographics', title: 'People & Demographics', desc: 'Population, districts, urban-rural split, social categories', color: 'shantiniketan' },
  { href: '/climate', title: 'Climate & Environment', desc: 'Rainfall, temperature trends, extreme weather events', color: 'sundarbans' },
  { href: '/environment', title: 'Air Quality', desc: 'AQI monitoring across major cities, pollutant breakdown', color: 'durga' },
  { href: '/health', title: 'Health', desc: 'Healthcare infrastructure, maternal & child health, disease burden', color: 'tea' },
  { href: '/education', title: 'Education', desc: 'School infrastructure, enrollment, learning outcomes', color: 'mustard' },
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        <StatCard label={t('home.stat_population')} value="10.3 Cr" subtitle="2024 projection" color="ganga" />
        <StatCard label={t('home.stat_density')} value="1,029" subtitle="per km\u00B2" color="shantiniketan" />
        <StatCard label={t('home.stat_literacy')} value="77.08%" subtitle="Census 2011" color="sundarbans" />
        <StatCard label={t('home.stat_sexRatio')} value="950" subtitle="females per 1000 males" color="durga" />
        <StatCard label={t('home.stat_gsdp')} value="\u20B915.4L Cr" subtitle="2024-25 (est.)" color="mustard" />
        <StatCard label={t('home.stat_hdi')} value="0.641" subtitle="Rank 28 (2021)" color="tea" />
        <StatCard label={t('home.stat_forest')} value="18.93%" subtitle="ISFR 2023" color="sundarbans" />
        <StatCard label={t('home.stat_roads')} value="115.5" subtitle="km per 100 km\u00B2" color="terracotta" />
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
          <span>Census 2011</span>
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
