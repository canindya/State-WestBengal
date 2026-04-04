'use client';

import { useEffect, useState } from 'react';
import { loadCrime } from '@/lib/data';
import type { CrimeData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  Treemap,
} from 'recharts';

export default function CrimePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<CrimeData | null>(null);

  useEffect(() => {
    loadCrime().then(setData);
  }, []);

  if (!data) return <div className="text-center py-20 text-muted">{t('crime.loading')}</div>;

  const latestYear = data.yearly[data.yearly.length - 1];
  const prevYear = data.yearly[data.yearly.length - 2];
  const changeRate = (((latestYear.total - prevYear.total) / prevYear.total) * 100).toFixed(1);

  // Category treemap
  const treemapData = data.categories
    .filter(c => c.category !== 'Others')
    .sort((a, b) => b.count - a.count)
    .map(c => ({ name: c.category, size: c.count }));

  // District-wise sorted
  const districtCrime = [...data.districtWise].sort((a, b) => b.rate - a.rate);

  return (
    <div>
      <PageHeader
        title={t('crime.pageTitle')}
        description={t('crime.pageDesc')}
        accent="twilight"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={`Total Crimes (${latestYear.year})`} value={latestYear.total.toLocaleString()} subtitle={`${changeRate}% vs ${prevYear.year}`} color="twilight" />
        <StatCard label="Crime Rate" value={latestYear.rate.toString()} subtitle="Per 100,000 population" color="durga" />
        <StatCard label="IPC Crimes" value={latestYear.ipc.toLocaleString()} subtitle={`${((latestYear.ipc / latestYear.total) * 100).toFixed(0)}% of total`} color="shantiniketan" />
        <StatCard label="SLL Crimes" value={latestYear.sll.toLocaleString()} subtitle={`${((latestYear.sll / latestYear.total) * 100).toFixed(0)}% of total`} color="ganga" />
      </div>

      {/* Yearly Crime Trend */}
      <ChartCard title="Crime Trend (2018-2023)" subtitle="Total cognizable crimes registered in West Bengal" data={data.yearly as unknown as Record<string, unknown>[]}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.yearly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => Number(v).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke={COLORS.twilightPurple} strokeWidth={2} name="Total" dot />
            <Line type="monotone" dataKey="ipc" stroke={COLORS.durgaVermillion} strokeWidth={2} name="IPC" dot />
            <Line type="monotone" dataKey="sll" stroke={COLORS.gangaBlue} strokeWidth={2} name="SLL" dot />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Crime Categories Treemap */}
        <ChartCard title={`Crime Categories (${latestYear.year})`} subtitle="Major crime types by number of cases reported">
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#2D3748"
              content={(props: Record<string, unknown>) => {
                const { x, y, width, height, name, index } = props as { x: number; y: number; width: number; height: number; name: string; index: number };
                const val = (props as Record<string, unknown>).size ?? (props as Record<string, unknown>).value ?? 0;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={COLORS.chart[(index ?? 0) % COLORS.chart.length]} opacity={0.85} rx={4} />
                    {width > 60 && height > 30 && (
                      <>
                        <text x={x + 6} y={y + 16} fill="#fff" fontSize={10} fontWeight="bold">{name}</text>
                        <text x={x + 6} y={y + 30} fill="#fff" fontSize={9} opacity={0.8}>{Number(val).toLocaleString()}</text>
                      </>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </ChartCard>

        {/* Special Categories */}
        <ChartCard title={`Special Category Crimes (${latestYear.year})`} subtitle="Crimes against women, children, SC/ST, and seniors" data={data.specialCategories as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.specialCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" width={180} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="count" name="Cases" radius={[0, 4, 4, 0]}>
                {data.specialCategories.map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* District-wise Crime Rate */}
      <div className="mt-6">
        <ChartCard title="District-wise Crime Rate" subtitle="Crimes per 100,000 population (reporting districts)" data={districtCrime as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtCrime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="district" width={140} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v} per 100K`} />
              <Bar dataKey="rate" name="Crime Rate (per 100K)" radius={[0, 4, 4, 0]}>
                {districtCrime.map((d, i) => (
                  <Cell key={i} fill={d.rate > 300 ? COLORS.durgaVermillion : d.rate > 180 ? COLORS.shantiniketan : COLORS.sundarbansGreen} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
