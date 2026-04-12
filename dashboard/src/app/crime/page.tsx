'use client';

import { useEffect, useState } from 'react';
import { loadCrime } from '@/lib/data';
import type { CrimeData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, AXIS_PROPS_SMALL, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

export default function CrimePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<CrimeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCrime()
      .then(setData)
      .catch(e => { console.error('Crime load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading crime data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('crime.loading')}</div>;

  const latestYear = data.yearly[data.yearly.length - 1];
  const prevYear = data.yearly[data.yearly.length - 2];
  const changeRate = (((latestYear.total - prevYear.total) / prevYear.total) * 100).toFixed(1);

  // Category bar chart
  const categoryData = data.categories
    .filter(c => c.category !== 'Others')
    .sort((a, b) => b.count - a.count);

  // District-wise sorted
  const districtCrime = [...data.districtWise].sort((a, b) => b.rate - a.rate);

  return (
    <div>
      <PageHeader
        title={t('crime.pageTitle')}
        description={t('crime.pageDesc')}
        accent="twilight"
        story="The crime picture in West Bengal carries two stories. The first is genuinely good news: Kolkata is consistently among India's safest metros by IPC crime rate per capita. The second is harder: the pattern of crimes against women is structural — it doesn't change year to year, which says enforcement isn't moving the underlying drivers. And rural under-reporting is the iceberg beneath the tip."
      />

      {/* Stat cards — cooled to 2 colours: twilight (page accent) + ganga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={`Total Crimes (${latestYear.year})`} value={latestYear.total.toLocaleString()} subtitle={`${changeRate}% vs ${prevYear.year}`} color="twilight" />
        <StatCard label="Crime Rate" value={latestYear.rate.toString()} subtitle="Per 100,000 population" color="ganga" />
        <StatCard label="IPC Crimes" value={latestYear.ipc.toLocaleString()} subtitle={`${((latestYear.ipc / latestYear.total) * 100).toFixed(0)}% of total`} color="twilight" tooltip="IPC — Indian Penal Code crimes: offences defined in the main criminal code (assault, theft, murder, etc.)" />
        <StatCard label="SLL Crimes" value={latestYear.sll.toLocaleString()} subtitle={`${((latestYear.sll / latestYear.total) * 100).toFixed(0)}% of total`} color="ganga" tooltip="SLL — Special & Local Law crimes: offences defined outside the IPC (motor vehicles, narcotics, cyber, dowry, etc.)" />
      </div>

      {/* Yearly Crime Trend — direct end-labels */}
      <ChartCard
        title="SLL cases are the growth driver — IPC is flat"
        subtitle="Total, IPC, and SLL case counts per year (2018 → 2023)"
        source="NCRB — Crime in India 2023"
        insight="IPC (code crimes) has tracked roughly flat. The growth is in Special & Local Law cases — partly reflecting better reporting of previously hidden offences, partly new enforcement categories. The total rises; the underlying signal is more nuanced than it looks."
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.yearly} margin={{ top: 20, right: 80, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => Number(v).toLocaleString()} />
            <Line type="monotone" dataKey="total" stroke={COLORS.twilightPurple} strokeWidth={2} dot>
              <LabelList dataKey="total" position="right" fontSize={10} fill={COLORS.twilightPurple} formatter={(v: unknown) => (v === latestYear.total ? `Total ${(Number(v) / 1000).toFixed(0)}K` : '')} />
            </Line>
            <Line type="monotone" dataKey="ipc" stroke={COLORS.durgaVermillion} strokeWidth={2} dot>
              <LabelList dataKey="ipc" position="right" fontSize={10} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === latestYear.ipc ? `IPC ${(Number(v) / 1000).toFixed(0)}K` : '')} />
            </Line>
            <Line type="monotone" dataKey="sll" stroke={COLORS.gangaBlue} strokeWidth={2} dot>
              <LabelList dataKey="sll" position="right" fontSize={10} fill={COLORS.gangaBlue} formatter={(v: unknown) => (v === latestYear.sll ? `SLL ${(Number(v) / 1000).toFixed(0)}K` : '')} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Crime Categories — highlight top */}
        <ChartCard
          title="Crimes against women and property crimes dominate"
          subtitle={`Major crime types by case count (${latestYear.year})`}
          source="NCRB — Crime in India 2023"
          insight="The ranking is structural, not episodic — it looks similar year after year. That tells you enforcement isn't shifting the underlying drivers; it's processing symptoms."
        >
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" width={115} {...AXIS_PROPS_SMALL} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.twilightPurple : dimmedColor(COLORS.twilightPurple)} />
                ))}
                <LabelList dataKey="count" position="right" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${(Number(v) / 1000).toFixed(0)}K`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Special Categories — highlight women (the story) */}
        <ChartCard
          title="Crimes against women dwarf every other special category"
          subtitle={`Special-category crime counts (${latestYear.year})`}
          source="NCRB — Crime in India 2023"
          insight="NCRB numbers almost certainly understate the true scale — reporting barriers are well documented. Even the recorded figures are alarming, and the gap between WB and the national average is narrow enough to call this a nationwide problem, not a WB-specific one."
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.specialCategories} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" width={120} {...AXIS_PROPS_SMALL} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.specialCategories.map((d, i) => (
                  <Cell key={i} fill={d.category.toLowerCase().includes('women') ? COLORS.durgaVermillion : dimmedColor(COLORS.twilightPurple)} />
                ))}
                <LabelList dataKey="count" position="right" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${(Number(v) / 1000).toFixed(0)}K`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* District-wise Crime Rate */}
      <div className="mt-6">
        <ChartCard
          title="Urban districts post higher rates — but that's a reporting story"
          subtitle="Crimes per 100,000 population, reporting districts"
          source="NCRB — Crime in India 2023"
          insight="Dense cities have more police stations per resident and more willingness to register a case. Rural under-reporting is the hidden iceberg — a higher number here often means a more functional reporting system, not a more dangerous place."
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtCrime} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} />
              <YAxis type="category" dataKey="district" width={100} {...AXIS_PROPS_SMALL} />
              <Tooltip formatter={(v) => `${v} per 100K`} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {districtCrime.map((d, i) => (
                  <Cell key={i} fill={d.rate > 300 ? COLORS.twilightPurple : dimmedColor(COLORS.twilightPurple)} />
                ))}
                <LabelList dataKey="rate" position="right" fontSize={10} fill="var(--fg)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
