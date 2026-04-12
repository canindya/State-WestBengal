'use client';

import { useEffect, useState } from 'react';
import { loadTourism } from '@/lib/data';
import type { TourismData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

export default function TourismPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<TourismData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTourism()
      .then(setData)
      .catch(e => { console.error('Tourism load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading tourism data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('tourism.loading')}</div>;

  const km = data.keyMetrics;
  const latestArrivals = data.foreignArrivals[data.foreignArrivals.length - 1];

  return (
    <div>
      <PageHeader
        title={t('tourism.pageTitle')}
        description={t('tourism.pageDesc')}
        accent="durga"
        story="West Bengal is India's #2 state for foreign tourist arrivals — 3.12 million visitors in 2024, nearly double the pre-COVID peak. Durga Puja alone generates $4.53 billion in economic activity. The ceiling is air connectivity: Kolkata gets fewer than 10% of Delhi's international flights. The brand is already in place; the runway slots aren't."
      />

      {/* Stat cards — cooled to 2 colours: durga (page accent) + mustard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Foreign Tourists 2024" value={`${km.foreignArrivalsMillion}M`} subtitle={`Rank #${km.rankForeignArrivals} in India`} color="durga" />
        <StatCard label="Share of India" value={`${km.sharePct}%`} subtitle="of foreign arrivals" color="mustard" />
        <StatCard label="YoY Growth" value={`+${km.yoyGrowthPct}%`} subtitle="2023 → 2024" color="durga" />
        <StatCard label="Durga Puja Impact" value={`$${km.durgaPujaEconomicImpactBillionUsd}B`} subtitle="UNESCO ICH (2021)" color="mustard" />
        <StatCard label="Community Pujas" value={`${(km.communityPujasCount / 1000).toFixed(1)}K`} subtitle="across Bengal" color="durga" />
        <StatCard label="UNESCO Sites" value="3" subtitle="ICH + 2 WHS" color="mustard" />
      </div>

      {/* Foreign Arrivals Trend — takeaway title, highlight latest year */}
      <ChartCard
        title="Arrivals nearly doubled the pre-COVID peak"
        subtitle="Foreign tourist arrivals, millions per year (2019 → 2024)"
        source="India Tourism Data Compendium 2025, Ministry of Tourism"
        insight="The COVID crash took arrivals to near-zero in 2020-21. The rebound has been complete and then some — 2024 sits at 3.12 M, well beyond the 1.65 M pre-pandemic level. Bengal didn't just recover; it broke its own ceiling."
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.foreignArrivals} margin={{ top: 30, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}M`} />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)}M`} />
            <Bar dataKey="million" radius={[4, 4, 0, 0]}>
              {data.foreignArrivals.map((row) => (
                <Cell key={row.year} fill={row.year === latestArrivals.year ? COLORS.durgaVermillion : dimmedColor(COLORS.durgaVermillion)} />
              ))}
              <LabelList dataKey="million" position="top" fontSize={11} fill="var(--fg)" formatter={(v: unknown) => `${Number(v).toFixed(2)}M`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* India share — kept as donut since 2 slices read fine, but no label overlap */}
        <ChartCard
          title="1 in 7 foreign tourists to India visits West Bengal"
          subtitle="West Bengal's share of India's foreign arrivals"
          source="Ministry of Tourism, GoI (2024)"
          insight="Remarkable for a state with just one major international gateway. The brand is visibly stronger than the infrastructure — a hint that unlocking capacity would pay off quickly."
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.indiaShare}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
              >
                <Cell fill={COLORS.durgaVermillion} />
                <Cell fill={dimmedColor(COLORS.gangaBlue)} />
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily international flights — highlight Kolkata (the story), dim the rest */}
        <ChartCard
          title="Kolkata gets 51 international flights a day — Delhi has 590"
          subtitle="International flights per day, Indian metros"
          source="DGCA / Airport International Schedules"
          insight="The single biggest bottleneck to tourism growth isn't demand; it's runway slots. Doubling Kolkata's international capacity would likely pay back inside a decade given the existing demand signal."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.internationalFlightsDaily} layout="vertical" margin={{ top: 10, right: 60, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} />
              <YAxis type="category" dataKey="city" width={90} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v} flights/day`} />
              <Bar dataKey="flights" radius={[0, 4, 4, 0]}>
                {data.internationalFlightsDaily.map((row) => (
                  <Cell key={row.city} fill={row.city === 'Kolkata' ? COLORS.durgaVermillion : dimmedColor(COLORS.gangaBlue)} />
                ))}
                <LabelList dataKey="flights" position="right" fontSize={11} fill="var(--fg)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* UNESCO badges */}
        <ChartCard title="Three UNESCO recognitions across three categories" subtitle="Intangible heritage, natural heritage, industrial heritage" source="UNESCO World Heritage Centre" insight="Few states anywhere in India match that breadth. Durga Puja (2021, intangible cultural heritage), the Sundarbans (1987, world heritage site), the Darjeeling Himalayan Railway (1999, world heritage site).">
          <div className="space-y-3">
            {data.unescoSites.map((site) => (
              <div key={site.name} className="flex items-start gap-3 rounded-lg border border-border bg-card-hover p-3">
                <div className="shrink-0 rounded-full bg-mustard/20 text-mustard w-10 h-10 flex items-center justify-center font-bold">
                  {site.year}
                </div>
                <div>
                  <p className="font-semibold">{site.name}</p>
                  <p className="text-xs text-muted">{site.type}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top source countries — dim all except top 3 */}
        <ChartCard
          title="US, UK and Bangladesh drive most arrivals"
          subtitle="Top source countries (indicative share of foreign visitors)"
          source="Ministry of Tourism, WB Tourism Department"
          insight="Diaspora traffic and the neighbourhood together dominate. Growth markets like Southeast Asia and the Gulf are still under-tapped — and not coincidentally, also under-served by direct flights to Kolkata."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.topSourceCountries} layout="vertical" margin={{ top: 10, right: 60, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="country" width={110} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                {data.topSourceCountries.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? COLORS.shantiniketan : dimmedColor(COLORS.shantiniketan)} />
                ))}
                <LabelList dataKey="share" position="right" fontSize={11} fill="var(--fg)" formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
