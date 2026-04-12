'use client';

import { useEffect, useState } from 'react';
import { loadTourism } from '@/lib/data';
import type { TourismData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
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

  return (
    <div>
      <PageHeader
        title={t('tourism.pageTitle')}
        description={t('tourism.pageDesc')}
        accent="durga"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Foreign Tourists 2024" value={`${km.foreignArrivalsMillion}M`} subtitle={`Rank #${km.rankForeignArrivals} in India`} color="durga" />
        <StatCard label="Share of India" value={`${km.sharePct}%`} subtitle="of foreign arrivals" color="shantiniketan" />
        <StatCard label="YoY Growth" value={`+${km.yoyGrowthPct}%`} subtitle="2023 → 2024" color="sundarbans" />
        <StatCard label="Durga Puja Impact" value={`$${km.durgaPujaEconomicImpactBillionUsd}B`} subtitle="UNESCO ICH (2021)" color="mustard" />
        <StatCard label="Community Pujas" value={`${(km.communityPujasCount / 1000).toFixed(1)}K`} subtitle="across Bengal" color="twilight" />
        <StatCard label="UNESCO Sites" value="3" subtitle="ICH + 2 WHS" color="tea" />
      </div>

      {/* Gateway narrative */}
      <div className="rounded-xl border-l-4 border-durga bg-card p-5 mb-8">
        <h3 className="text-lg font-semibold mb-1">The Gateway Nobody Sees</h3>
        <p className="text-sm text-muted">
          West Bengal is India&rsquo;s <span className="text-foreground font-semibold">#2 destination</span> for foreign tourists — but Kolkata receives only
          <span className="text-foreground font-semibold"> {km.kolkataIntlFlightsDaily} international flights/day</span> versus Delhi&rsquo;s {km.delhiIntlFlightsDaily} and Mumbai&rsquo;s {km.mumbaiIntlFlightsDaily}.
          Air connectivity is the single biggest unlock for tourism here.
        </p>
      </div>

      {/* Foreign Arrivals Trend */}
      <ChartCard
        title="Foreign Tourist Arrivals"
        subtitle="Millions per year (2019 → 2024)"
        source="India Tourism Data Compendium 2025, Ministry of Tourism"
        insight="A full recovery from the COVID crash — and then some. 2024 arrivals are nearly twice the 2019 baseline. Bengal didn't just rebound; it broke its own ceiling."
        data={data.foreignArrivals as unknown as Record<string, unknown>[]}
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.foreignArrivals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${v}M`} />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)}M`} />
            <Bar dataKey="million" name="Foreign arrivals (M)" fill={COLORS.durgaVermillion} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* India share donut */}
        <ChartCard
          title="Share of India's Foreign Arrivals"
          subtitle="West Bengal captures ~15% of all foreign visits"
          source="Ministry of Tourism, GoI (2024)"
          insight="Roughly 1 in 7 foreign tourists entering India visits West Bengal — remarkable for a state with just one major international gateway. The brand is stronger than the infrastructure."
          data={data.indiaShare as unknown as Record<string, unknown>[]}
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
                <Cell fill={COLORS.text.muted} />
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily international flights comparison */}
        <ChartCard
          title="International Flights per Day"
          subtitle="Kolkata vs other Indian metros"
          source="DGCA / Airport International Schedules"
          insight="Kolkata has fewer than 10% of Delhi's international flights — despite being the #2 state for foreign arrivals. The single biggest bottleneck to tourism growth isn't demand; it's runway slots."
          data={data.internationalFlightsDaily as unknown as Record<string, unknown>[]}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.internationalFlightsDaily} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="city" width={90} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v} flights/day`} />
              <Bar dataKey="flights" name="Daily flights" radius={[0, 4, 4, 0]}>
                {data.internationalFlightsDaily.map((row) => (
                  <Cell key={row.city} fill={row.city === 'Kolkata' ? COLORS.durgaVermillion : COLORS.gangaBlue} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* UNESCO badges */}
        <ChartCard title="UNESCO Recognition" subtitle="Heritage that draws the world" source="UNESCO World Heritage Centre" insight="Three UNESCO recognitions across three categories — intangible culture, natural heritage, industrial heritage. Few states anywhere in India match that breadth.">
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

        {/* Top source countries */}
        <ChartCard
          title="Top Source Countries"
          subtitle="Where foreign visitors come from (indicative share)"
          source="Ministry of Tourism, WB Tourism Department"
          insight="US, UK, and Bangladesh dominate — diaspora traffic and the neighbourhood together. Growth markets like Southeast Asia and the Gulf are still under-tapped."
          data={data.topSourceCountries as unknown as Record<string, unknown>[]}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.topSourceCountries} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="country" width={110} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="share" name="Share" fill={COLORS.shantiniketan} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
