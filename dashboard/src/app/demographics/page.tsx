'use client';

import { useEffect, useState, useMemo } from 'react';
import { loadDemographics } from '@/lib/data';
import type { DemographicsData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';

export default function DemographicsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DemographicsData | null>(null);

  useEffect(() => {
    loadDemographics().then(setData);
  }, []);

  if (!data) return <div className="text-center py-20 text-muted">{t('demographics.loading')}</div>;

  const totalPop = data.districts.reduce((s, d) => s + d.population, 0);
  const avgLiteracy = (data.districts.reduce((s, d) => s + d.literacy, 0) / data.districts.length).toFixed(1);
  const avgSexRatio = Math.round(data.districts.reduce((s, d) => s + d.sexRatio, 0) / data.districts.length);

  // Population pyramid (horizontal bar chart)
  const pyramidData = data.ageDistribution.map(d => ({
    ageGroup: d.ageGroup,
    Male: -d.male,
    Female: d.female,
  }));

  // District density sorted
  const districtsByDensity = [...data.districts].sort((a, b) => b.density - a.density);

  // Urban vs Rural from population trend
  const urbanRuralTrend = data.populationTrend
    .filter(d => d.year >= 1951)
    .map(d => ({
      year: d.year.toString(),
      Urban: d.urban,
      Rural: d.rural,
    }));

  // SC/ST composition
  const avgSC = (data.districts.reduce((s, d) => s + d.scPercentage, 0) / data.districts.length).toFixed(1);
  const avgST = (data.districts.reduce((s, d) => s + d.stPercentage, 0) / data.districts.length).toFixed(1);

  // Top SC and ST districts
  const topSCDistricts = [...data.districts].sort((a, b) => b.scPercentage - a.scPercentage).slice(0, 10);
  const topSTDistricts = [...data.districts].sort((a, b) => b.stPercentage - a.stPercentage).slice(0, 10);

  // Urban percentage by district
  const urbanByDistrict = [...data.districts]
    .sort((a, b) => b.urbanPercentage - a.urbanPercentage)
    .slice(0, 15);

  return (
    <div>
      <PageHeader
        title={t('demographics.pageTitle')}
        description={t('demographics.pageDesc')}
        accent="shantiniketan"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Population" value={`${(totalPop / 10000000).toFixed(1)} Cr`} subtitle="Census 2011" color="ganga" />
        <StatCard label="Districts" value="23" subtitle="Including new districts" color="shantiniketan" />
        <StatCard label="Avg Literacy" value={`${avgLiteracy}%`} subtitle="Across districts" color="sundarbans" />
        <StatCard label="Avg Sex Ratio" value={avgSexRatio.toString()} subtitle="Females per 1000 males" color="durga" />
        <StatCard label="SC Population" value={`${avgSC}%`} subtitle="State average" color="twilight" />
        <StatCard label="ST Population" value={`${avgST}%`} subtitle="State average" color="tea" />
      </div>

      {/* Population Pyramid */}
      <ChartCard title="Population Pyramid (Age-Gender Distribution)" subtitle="Male (left) and female (right) population in thousands by age group">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={pyramidData} layout="vertical" stackOffset="sign">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${Math.abs(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="ageGroup" width={50} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => `${Math.abs(Number(v)).toLocaleString()} thousand`} />
            <Legend />
            <Bar dataKey="Male" fill={COLORS.gangaBlue} stackId="stack" />
            <Bar dataKey="Female" fill={COLORS.durgaVermillion} stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* District Density */}
        <ChartCard title="Population Density by District" subtitle="Persons per km\u00B2 (Census 2011)" data={districtsByDensity as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={districtsByDensity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="district" width={140} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} per km\u00B2`} />
              <Bar dataKey="density" name="Density (per km\u00B2)" radius={[0, 4, 4, 0]}>
                {districtsByDensity.map((d, i) => (
                  <Cell key={i} fill={d.density > 3000 ? COLORS.durgaVermillion : d.density > 1000 ? COLORS.shantiniketan : COLORS.sundarbansGreen} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Urbanization by District */}
        <ChartCard title="Urbanization by District" subtitle="Top 15 districts by urban population %" data={urbanByDistrict as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={urbanByDistrict} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={140} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="urbanPercentage" name="Urban %" radius={[0, 4, 4, 0]}>
                {urbanByDistrict.map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Urban vs Rural Trend */}
      <div className="mt-6">
        <ChartCard title="Urban vs Rural Population Trend" subtitle="Population in thousands (1951-2026 projection)" data={urbanRuralTrend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={urbanRuralTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} thousand`} />
              <Legend />
              <Area type="monotone" dataKey="Rural" stackId="pop" stroke={COLORS.sundarbansGreen} fill={COLORS.sundarbansGreen} fillOpacity={0.4} />
              <Area type="monotone" dataKey="Urban" stackId="pop" stroke={COLORS.gangaBlue} fill={COLORS.gangaBlue} fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* SC/ST Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Scheduled Caste Population by District" subtitle="Top 10 districts by SC %" data={topSCDistricts as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topSCDistricts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 55]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={130} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="scPercentage" name="SC %" fill={COLORS.twilightPurple} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Scheduled Tribe Population by District" subtitle="Top 10 districts by ST %" data={topSTDistricts as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topSTDistricts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 35]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={130} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="stPercentage" name="ST %" fill={COLORS.teaGreen} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
