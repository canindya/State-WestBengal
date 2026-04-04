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
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
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
        {/* Crime Categories */}
        <ChartCard title={`Crime Categories (${latestYear.year})`} subtitle="Major crime types by number of cases reported" data={categoryData as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" width={160} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="count" name="Cases" radius={[0, 4, 4, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Bar>
            </BarChart>
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
