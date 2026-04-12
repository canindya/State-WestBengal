'use client';

import { useEffect, useState } from 'react';
import { loadClimate } from '@/lib/data';
import type { ClimateData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, AXIS_PROPS_SMALL, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList,
} from 'recharts';

export default function ClimatePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<ClimateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClimate()
      .then(setData)
      .catch(e => { console.error('Climate load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading climate data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('climate.loading')}</div>;

  const sortedRainfall = [...data.districtRainfall].sort((a, b) => b.annual - a.annual);
  const avgRainfall = Math.round(data.districtRainfall.reduce((s, d) => s + d.annual, 0) / data.districtRainfall.length);
  const wettestDistrict = sortedRainfall[0];
  const driestDistrict = sortedRainfall[sortedRainfall.length - 1];

  const latestTemp = data.temperatureTrend[data.temperatureTrend.length - 1];

  // Seasonal comparison: wettest vs driest district (radar → side-by-side bars)
  const seasonalComparison = [
    { season: 'Monsoon', [wettestDistrict.district]: wettestDistrict.monsoon, [driestDistrict.district]: driestDistrict.monsoon },
    { season: 'Pre-Monsoon', [wettestDistrict.district]: wettestDistrict.preMonsoon, [driestDistrict.district]: driestDistrict.preMonsoon },
    { season: 'Post-Monsoon', [wettestDistrict.district]: wettestDistrict.postMonsoon, [driestDistrict.district]: driestDistrict.postMonsoon },
    { season: 'Winter', [wettestDistrict.district]: wettestDistrict.winter, [driestDistrict.district]: driestDistrict.winter },
  ];

  return (
    <div>
      <PageHeader
        title={t('climate.pageTitle')}
        description={t('climate.pageDesc')}
        accent="sundarbans"
        story="West Bengal's climate is a tale of geographic extremes. Coastal and Himalayan foothill districts get more than 2,500 mm of rainfall a year; the western laterite belt gets under 1,200 mm. Three-quarters of the annual rain arrives in just four monsoon months. And the state-average temperature has drifted upward by roughly half a degree in three decades — consistent with national warming."
      />

      {/* Stat cards — cooled to 2 colours: sundarbans (page accent) + ganga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Avg Annual Rainfall" value={`${avgRainfall} mm`} subtitle="State average" color="sundarbans" />
        <StatCard label="Wettest District" value={wettestDistrict.district} subtitle={`${wettestDistrict.annual} mm/year`} color="ganga" />
        <StatCard label="Driest District" value={driestDistrict.district} subtitle={`${driestDistrict.annual} mm/year`} color="sundarbans" />
        <StatCard label="Extreme Events (2020-24)" value={data.extremeEvents.length.toString()} subtitle="Cyclones, floods, heat waves" color="ganga" />
      </div>

      {/* District-wise Annual Rainfall */}
      <ChartCard
        title="A 3× rainfall gap inside one state"
        subtitle="Annual rainfall by district (mm), wettest first"
        source="India Meteorological Department"
        insight="Coastal and Himalayan foothill districts are wettest; the western laterite belt (Purulia, Bankura) receives less than half the wettest district. Different rainfall means different agriculture, different crop cycles, different economies."
      >
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={sortedRainfall} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS_VERTICAL} />
            <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${v} mm`} />
            <YAxis type="category" dataKey="district" width={100} {...AXIS_PROPS_SMALL} />
            <Tooltip formatter={(v) => `${v} mm`} />
            <Bar dataKey="annual" radius={[0, 4, 4, 0]}>
              {sortedRainfall.map((d, i) => (
                <Cell key={i} fill={i === 0 || i === sortedRainfall.length - 1 ? COLORS.gangaBlue : dimmedColor(COLORS.gangaBlue)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Monthly Rainfall Pattern */}
        <ChartCard
          title="Three-quarters of the rain falls in four months"
          subtitle="State-average monthly rainfall (mm)"
          source="India Meteorological Department"
          insight="Jun-Sep accounts for the vast majority of annual precipitation. The rest of the year is a deficit — which is why water storage, not total rainfall, is the real agricultural constraint."
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyRainfall} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="month" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v} mm`} />
              <Tooltip formatter={(v) => `${v} mm`} />
              <Area type="monotone" dataKey="rainfall" stroke={COLORS.gangaBlue} fill={COLORS.gangaBlue} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Seasonal comparison — radar → grouped horizontal bars */}
        <ChartCard
          title={`${wettestDistrict.district} stays wetter than ${driestDistrict.district} every season`}
          subtitle="Seasonal rainfall (mm), wettest vs driest district"
          source="India Meteorological Department"
          insight="Monsoon rainfall absolutely dominates — pre-monsoon and winter rainfall are thin by comparison. The gap between wettest and driest isn't seasonal noise; it's a structural geographic fact."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalComparison} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${v} mm`} />
              <YAxis type="category" dataKey="season" width={100} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v} mm`} />
              <Bar dataKey={wettestDistrict.district} fill={COLORS.gangaBlue} />
              <Bar dataKey={driestDistrict.district} fill={dimmedColor(COLORS.shantiniketan)} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.gangaBlue }} /> {wettestDistrict.district}</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.shantiniketan }} /> {driestDistrict.district}</span>
          </div>
        </ChartCard>
      </div>

      {/* Temperature Trend */}
      <div className="mt-6">
        <ChartCard
          title="State temperature has drifted up roughly half a degree in three decades"
          subtitle={`Max, avg, and min temperature (°C). Latest: ${latestTemp.avgTemp}°C in ${latestTemp.year}`}
          source="IMD / Open-Meteo Archive API"
          insight="Small numbers, big consequences for agriculture, disease vectors, and coastal communities. The line trend is the climate-change fingerprint on a single state's weather record."
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.temperatureTrend} margin={{ top: 20, right: 80, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis domain={[18, 38]} {...AXIS_PROPS} tickFormatter={(v) => `${v}°C`} />
              <Tooltip formatter={(v) => `${v}°C`} />
              <Line type="monotone" dataKey="maxTemp" stroke={COLORS.durgaVermillion} strokeWidth={2} dot>
                <LabelList dataKey="maxTemp" position="right" fontSize={10} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === latestTemp.maxTemp ? `Max ${v}°` : '')} />
              </Line>
              <Line type="monotone" dataKey="avgTemp" stroke={COLORS.mustardYellow} strokeWidth={2} dot>
                <LabelList dataKey="avgTemp" position="right" fontSize={10} fill={COLORS.mustardYellow} formatter={(v: unknown) => (v === latestTemp.avgTemp ? `Avg ${v}°` : '')} />
              </Line>
              <Line type="monotone" dataKey="minTemp" stroke={COLORS.gangaBlue} strokeWidth={2} dot>
                <LabelList dataKey="minTemp" position="right" fontSize={10} fill={COLORS.gangaBlue} formatter={(v: unknown) => (v === latestTemp.minTemp ? `Min ${v}°` : '')} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Extreme Weather Events */}
      <div className="mt-6">
        <ChartCard
          title="Extreme weather events are not isolated — the list gets longer every year"
          subtitle="Major cyclones, floods, and heat waves (2020-2024)"
          source="IMD, NDMA Reports"
          insight="Cyclones and floods used to be episodic crises. The modern reading is that they're structural — disaster preparedness, not disaster response, is where the investment case now sits."
        >
          <div className="space-y-3">
            {data.extremeEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card-hover">
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${
                  event.type === 'Cyclone' ? 'bg-ganga/20 text-ganga' :
                  event.type === 'Flood' ? 'bg-sundarbans/20 text-sundarbans' :
                  'bg-durga/20 text-durga'
                }`}>
                  {event.type}
                </span>
                <div>
                  <p className="font-medium text-sm">{event.event} ({event.year})</p>
                  <p className="text-xs text-muted mt-0.5">Affected: {event.affected}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
