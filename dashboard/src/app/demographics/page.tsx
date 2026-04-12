'use client';

import { useEffect, useState } from 'react';
import { loadDemographics } from '@/lib/data';
import type { DemographicsData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';

export default function DemographicsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DemographicsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDemographics()
      .then(setData)
      .catch(e => { console.error('Demographics load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading demographics data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('demographics.loading')}</div>;

  const pop2026 = data.populationProjection.find(p => p.year === 2026);
  const latestSRS = data.srsTrend[data.srsTrend.length - 1];

  // Age-sex pyramid: 2026 projected (horizontal bar chart)
  const pyramidData = data.ageProjection.map(d => ({
    ageGroup: d.ageGroup,
    'Male 2026': -d.male2026,
    'Female 2026': d.female2026,
    'Male 2011': -d.male2011,
    'Female 2011': d.female2011,
  }));

  // Female literacy sorted
  const literacySorted = [...data.districts].sort((a, b) => b.femaleLiteracy15_49 - a.femaleLiteracy15_49);

  // Child stunting sorted (worst first)
  const stuntingSorted = [...data.districts].sort((a, b) => b.childrenStunted - a.childrenStunted);

  // Household amenities: one sorted list per metric for side-by-side comparison
  const shortName = (name: string) => (name.length > 14 ? name.slice(0, 12) + '…' : name);
  const amenityMetrics = [
    { key: 'improvedSanitation', label: 'Sanitation', color: COLORS.gangaBlue },
    { key: 'cleanCookingFuel', label: 'Clean Fuel', color: COLORS.shantiniketan },
    { key: 'electricity', label: 'Electricity', color: COLORS.sundarbansGreen },
  ] as const;
  const sortedAmenities: Record<string, { district: string; value: number }[]> = {
    improvedSanitation: [...data.districts].sort((a, b) => b.improvedSanitation - a.improvedSanitation).map(d => ({ district: shortName(d.district), value: d.improvedSanitation })),
    cleanCookingFuel: [...data.districts].sort((a, b) => b.cleanCookingFuel - a.cleanCookingFuel).map(d => ({ district: shortName(d.district), value: d.cleanCookingFuel })),
    electricity: [...data.districts].sort((a, b) => b.electricity - a.electricity).map(d => ({ district: shortName(d.district), value: d.electricity })),
  };

  return (
    <div>
      <PageHeader
        title={t('demographics.pageTitle')}
        description={t('demographics.pageDesc')}
        accent="shantiniketan"
      />

      {/* Data source banner */}
      <div className="rounded-lg border border-ganga/30 bg-ganga/5 px-4 py-3 mb-6 text-sm text-muted">
        District data from <strong>NFHS-5 (2019-21)</strong>. Population estimates from <strong>RGI Projections (2020)</strong>. Vital statistics from <strong>SRS (2010-2023)</strong>. India&apos;s Census 2021 has not yet been conducted.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Est. Population" value={`${((pop2026?.total || 0) / 10000).toFixed(1)} Cr`} subtitle="RGI Projection 2026" color="ganga" />
        <StatCard label="TFR" value={data.stateAverage.totalFertilityRate.toString()} subtitle="Below replacement (NFHS-5)" color="shantiniketan" tooltip="Total Fertility Rate — the average number of children a woman would have over her lifetime at current age-specific fertility rates. Replacement level is 2.1." />
        <StatCard label="Female Literacy" value={`${data.stateAverage.femaleLiteracy15_49}%`} subtitle="Women 15-49 (NFHS-5)" color="sundarbans" />
        <StatCard label="Sex Ratio at Birth" value={data.stateAverage.sexRatioAtBirth.toString()} subtitle="Females per 1000 males" color="durga" />
        <StatCard label="Institutional Delivery" value={`${data.stateAverage.institutionalDelivery}%`} subtitle="NFHS-5" color="tea" />
        <StatCard label="Full Immunization" value={`${data.stateAverage.fullImmunization}%`} subtitle="Children 12-23 months" color="twilight" />
      </div>

      {/* Population Pyramid: 2011 vs 2026 */}
      <ChartCard title="Population Pyramid: 2011 Actual vs 2026 Projected" subtitle="Male (left) and female (right) population in thousands by age group" source="RGI Population Projections (2020), Census 2011" insight="The pyramid is losing its base. The 0-4 cohort in 2026 is smaller than in 2011 — a direct consequence of TFR falling below replacement. West Bengal is ageing faster than most Indian states.">
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={pyramidData} layout="vertical" stackOffset="sign" barGap={0} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${Math.abs(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="ageGroup" width={50} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => `${Math.abs(Number(v)).toLocaleString()}K`} />
            <Legend />
            <Bar dataKey="Male 2011" fill={COLORS.gangaBlue} fillOpacity={0.3} stackId="2011" />
            <Bar dataKey="Female 2011" fill={COLORS.durgaVermillion} fillOpacity={0.3} stackId="2011" />
            <Bar dataKey="Male 2026" fill={COLORS.gangaBlue} stackId="2026" />
            <Bar dataKey="Female 2026" fill={COLORS.durgaVermillion} stackId="2026" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Female Literacy by District */}
        <ChartCard title="Female Literacy (Age 15-49) by District" subtitle="Percentage of women who are literate" source="NFHS-5 (2019-21)" insight="A 20-point gap between the best and worst districts. Literacy still clusters around Kolkata and the southern deltas; tribal and border districts lag behind." data={literacySorted as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={literacySorted} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[50, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={100} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="femaleLiteracy15_49" name="Female Literacy %" radius={[0, 4, 4, 0]}>
                {literacySorted.map((d, i) => (
                  <Cell key={i} fill={d.femaleLiteracy15_49 >= 80 ? COLORS.sundarbansGreen : d.femaleLiteracy15_49 >= 70 ? COLORS.shantiniketan : COLORS.durgaVermillion} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Child Stunting by District */}
        <ChartCard title="Child Stunting by District" subtitle="Children under 5 who are stunted (height-for-age, %)" source="NFHS-5 (2019-21)" insight="Stunting is a rural-forest story: the worst-affected districts cluster along the Jharkhand and Odisha borders. Nutrition programmes that treat the state as one unit will keep missing these children." data={stuntingSorted as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={stuntingSorted} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 50]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={100} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="childrenStunted" name="Stunted %" radius={[0, 4, 4, 0]}>
                {stuntingSorted.map((d, i) => (
                  <Cell key={i} fill={d.childrenStunted > 38 ? COLORS.durgaVermillion : d.childrenStunted > 30 ? COLORS.shantiniketan : COLORS.sundarbansGreen} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Household Amenities */}
      <div className="mt-6">
        <ChartCard
          title="Household Amenities by District"
          subtitle="Districts sorted by each metric individually — easier to see leaders and laggards"
          source="NFHS-5 (2019-21)"
          insight="Electricity is essentially universal across districts. Clean cooking fuel is the big gap — LPG adoption still lags in rural and tribal belts, and the public-health cost shows up in respiratory disease data."
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {amenityMetrics.map((m) => (
              <div key={m.key}>
                <p className="text-xs uppercase tracking-wide font-semibold mb-2 text-center" style={{ color: m.color }}>
                  {m.label} (%)
                </p>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={sortedAmenities[m.key]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="district" width={90} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="value" fill={m.color} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Vital Statistics Trend */}
      <div className="mt-6">
        <ChartCard title="Vital Statistics Trend (2010-2023)" subtitle="Birth rate, death rate, and natural growth rate per 1,000 population" source="SRS Bulletins, Office of Registrar General" insight="Birth rate has fallen steadily; death rate is stable. The gap between them — the natural growth rate — is shrinking every year. Within a generation, WB's demographic arithmetic changes completely." data={data.srsTrend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.srsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="birthRate" stroke={COLORS.gangaBlue} strokeWidth={2} name="Birth Rate" dot />
              <Line type="monotone" dataKey="deathRate" stroke={COLORS.durgaVermillion} strokeWidth={2} name="Death Rate" dot />
              <Line type="monotone" dataKey="naturalGrowthRate" stroke={COLORS.sundarbansGreen} strokeWidth={2} name="Natural Growth Rate" dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Population Projection */}
      <div className="mt-6">
        <ChartCard title="Population Projection (2011-2036)" subtitle="Total population in thousands — growth slowing as TFR stays below replacement" source="RGI Population Projections (2020)" insight="The curve is visibly bending. By 2036, WB will add fewer people per decade than at any point since independence — the demographic dividend window is narrowing." data={data.populationProjection as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.populationProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} domain={[85000, 110000]} />
              <Tooltip formatter={(v) => `${(Number(v) / 1000).toFixed(1)}M`} />
              <Legend />
              <Bar dataKey="male" name="Male" fill={COLORS.gangaBlue} stackId="pop" />
              <Bar dataKey="female" name="Female" fill={COLORS.durgaVermillion} stackId="pop" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
