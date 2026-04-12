'use client';

import { useEffect, useState } from 'react';
import { loadDemographics } from '@/lib/data';
import type { DemographicsData } from '@/lib/types';
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

  // Age-sex pyramid: 2026 projected (horizontal bar chart)
  const pyramidData = data.ageProjection.map(d => ({
    ageGroup: d.ageGroup,
    'Male 2026': -d.male2026,
    'Female 2026': d.female2026,
    'Male 2011': -d.male2011,
    'Female 2011': d.female2011,
  }));

  // Female literacy sorted (highest first). Highlight highest and lowest.
  const literacySorted = [...data.districts].sort((a, b) => b.femaleLiteracy15_49 - a.femaleLiteracy15_49);
  const literacyTop = 0;
  const literacyBottom = literacySorted.length - 1;

  // Child stunting sorted (worst first). Highlight top 3 worst.
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

  const latestSRS = data.srsTrend[data.srsTrend.length - 1];
  const latestPop = data.populationProjection[data.populationProjection.length - 1];

  return (
    <div>
      <PageHeader
        title={t('demographics.pageTitle')}
        description={t('demographics.pageDesc')}
        accent="shantiniketan"
        story="West Bengal's total fertility rate has fallen below replacement level (1.6 vs the 2.1 floor). The population pyramid is losing its base — the 0-4 cohort in 2026 is already smaller than in 2011. That shift reshapes everything: schools, labour supply, pension obligations, political constituencies. This page tracks the arithmetic of that transition."
      />

      {/* Data source banner */}
      <div className="rounded-lg border border-ganga/30 bg-ganga/5 px-4 py-3 mb-6 text-sm text-muted">
        District data from <strong>NFHS-5 (2019-21)</strong>. Population estimates from <strong>RGI Projections (2020)</strong>. Vital statistics from <strong>SRS (2010-2023)</strong>. India&apos;s Census 2021 has not yet been conducted.
      </div>

      {/* Stat cards — cooled to 2 colours: shantiniketan (page accent) + ganga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Est. Population" value={`${((pop2026?.total || 0) / 10000).toFixed(1)} Cr`} subtitle="RGI Projection 2026" color="shantiniketan" />
        <StatCard label="TFR" value={data.stateAverage.totalFertilityRate.toString()} subtitle="Below replacement (NFHS-5)" color="ganga" tooltip="Total Fertility Rate — the average number of children a woman would have over her lifetime at current age-specific fertility rates. Replacement level is 2.1." />
        <StatCard label="Female Literacy" value={`${data.stateAverage.femaleLiteracy15_49}%`} subtitle="Women 15-49 (NFHS-5)" color="shantiniketan" />
        <StatCard label="Sex Ratio at Birth" value={data.stateAverage.sexRatioAtBirth.toString()} subtitle="Females per 1000 males" color="ganga" />
        <StatCard label="Institutional Delivery" value={`${data.stateAverage.institutionalDelivery}%`} subtitle="NFHS-5" color="shantiniketan" />
        <StatCard label="Full Immunization" value={`${data.stateAverage.fullImmunization}%`} subtitle="Children 12-23 months" color="ganga" />
      </div>

      {/* Population Pyramid: 2011 vs 2026 */}
      <ChartCard
        title="The pyramid is losing its base — fewer children, more working-age, more elderly"
        subtitle="Age-sex distribution, 2011 actual (faded) vs 2026 projected (solid)"
        source="RGI Population Projections (2020), Census 2011"
        insight="The 0-4 cohort in 2026 is already smaller than in 2011 — a direct consequence of TFR falling below replacement. West Bengal is ageing faster than most Indian states, and the window for a demographic dividend is narrower than headline population growth suggests."
      >
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={pyramidData} layout="vertical" stackOffset="sign" barGap={0} barCategoryGap="15%" margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS_VERTICAL} />
            <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${Math.abs(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="ageGroup" width={50} {...AXIS_PROPS} />
            <Tooltip formatter={(v) => `${Math.abs(Number(v)).toLocaleString()}K`} />
            <Bar dataKey="Male 2011" fill={dimmedColor(COLORS.gangaBlue)} stackId="2011" />
            <Bar dataKey="Female 2011" fill={dimmedColor(COLORS.durgaVermillion)} stackId="2011" />
            <Bar dataKey="Male 2026" fill={COLORS.gangaBlue} stackId="2026" />
            <Bar dataKey="Female 2026" fill={COLORS.durgaVermillion} stackId="2026" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted justify-center">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.gangaBlue }} /> Male 2026</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.durgaVermillion }} /> Female 2026</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.gangaBlue }} /> Male 2011</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.durgaVermillion }} /> Female 2011</span>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Female Literacy by District — highlight top and bottom */}
        <ChartCard
          title="A 20-point gap between the best and worst districts"
          subtitle="Female literacy (age 15-49), % — sorted high to low"
          source="NFHS-5 (2019-21)"
          insight="Literacy still clusters around Kolkata and the southern deltas; tribal and border districts lag behind. The gap isn't random — it maps almost perfectly onto historical patterns of settlement and investment."
        >
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={literacySorted} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" domain={[50, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={100} {...AXIS_PROPS_SMALL} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="femaleLiteracy15_49" radius={[0, 4, 4, 0]}>
                {literacySorted.map((_, i) => (
                  <Cell key={i} fill={i === literacyTop ? COLORS.sundarbansGreen : i === literacyBottom ? COLORS.durgaVermillion : dimmedColor(COLORS.shantiniketan)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Child Stunting by District — highlight top 3 worst */}
        <ChartCard
          title="Stunting concentrates in the forest and border belts"
          subtitle="Children under 5 who are stunted (%), worst first"
          source="NFHS-5 (2019-21)"
          insight="The three worst districts cluster along the Jharkhand and Odisha borders. Nutrition programmes that treat the state as one unit will keep missing these children — the geographic pattern is the diagnosis."
        >
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={stuntingSorted} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" domain={[0, 50]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="district" width={100} {...AXIS_PROPS_SMALL} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="childrenStunted" radius={[0, 4, 4, 0]}>
                {stuntingSorted.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? COLORS.durgaVermillion : dimmedColor(COLORS.shantiniketan)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Household Amenities */}
      <div className="mt-6">
        <ChartCard
          title="Electricity is universal — clean cooking fuel is the big gap"
          subtitle="Household amenity coverage (%) by district, sorted by each metric independently"
          source="NFHS-5 (2019-21)"
          insight="LPG adoption still lags in rural and tribal belts, and the public-health cost shows up in respiratory disease data. The three panels answer three separate questions, which is why splitting them improves readability."
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {amenityMetrics.map((m) => (
              <div key={m.key}>
                <p className="text-xs uppercase tracking-wide font-semibold mb-2 text-center" style={{ color: m.color }}>
                  {m.label} (%)
                </p>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={sortedAmenities[m.key]} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid {...GRID_PROPS_VERTICAL} />
                    <XAxis type="number" domain={[0, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="district" width={90} {...AXIS_PROPS_SMALL} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="value" fill={m.color} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Vital Statistics Trend — direct end-labels instead of legend */}
      <div className="mt-6">
        <ChartCard
          title="Birth rate keeps falling — the natural growth rate is collapsing"
          subtitle="Per 1,000 population, 2010 → 2023"
          source="SRS Bulletins, Office of Registrar General"
          insight="Death rate is stable. The gap between births and deaths — natural growth — is shrinking every year. Within a generation, WB's demographic arithmetic changes completely, and the state transitions from growing to stationary."
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.srsTrend} margin={{ top: 20, right: 110, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis domain={[0, 20]} {...AXIS_PROPS} />
              <Tooltip />
              <Line type="monotone" dataKey="birthRate" stroke={COLORS.gangaBlue} strokeWidth={2} dot>
                <LabelList dataKey="birthRate" position="right" fontSize={10} fill={COLORS.gangaBlue} formatter={(v: unknown) => (v === latestSRS.birthRate ? `Birth ${v}` : '')} />
              </Line>
              <Line type="monotone" dataKey="deathRate" stroke={COLORS.durgaVermillion} strokeWidth={2} dot>
                <LabelList dataKey="deathRate" position="right" fontSize={10} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === latestSRS.deathRate ? `Death ${v}` : '')} />
              </Line>
              <Line type="monotone" dataKey="naturalGrowthRate" stroke={COLORS.sundarbansGreen} strokeWidth={2} dot>
                <LabelList dataKey="naturalGrowthRate" position="right" fontSize={10} fill={COLORS.sundarbansGreen} formatter={(v: unknown) => (v === latestSRS.naturalGrowthRate ? `Growth ${v}` : '')} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Population Projection */}
      <div className="mt-6">
        <ChartCard
          title="The curve is bending — population growth is slowing"
          subtitle="Total population in thousands, 2011 → 2036 (RGI projection)"
          source="RGI Population Projections (2020)"
          insight="By 2036, WB will add fewer people per decade than at any point since independence. The demographic dividend window is narrowing. Schools, labour supply, pensions — everything downstream — has to plan for a smaller arithmetic."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.populationProjection} margin={{ top: 30, right: 30, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`} domain={[85000, 110000]} />
              <Tooltip formatter={(v) => `${(Number(v) / 1000).toFixed(1)}M`} />
              <Bar dataKey="male" fill={dimmedColor(COLORS.gangaBlue)} stackId="pop" />
              <Bar dataKey="female" fill={dimmedColor(COLORS.durgaVermillion)} stackId="pop">
                <LabelList dataKey="total" position="top" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => (v === latestPop.total ? `${(Number(v) / 1000).toFixed(1)}M` : '')} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-60" style={{ background: COLORS.gangaBlue }} /> Male</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-60" style={{ background: COLORS.durgaVermillion }} /> Female</span>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

