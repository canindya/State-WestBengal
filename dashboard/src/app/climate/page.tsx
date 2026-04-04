'use client';

import { useEffect, useState } from 'react';
import { loadClimate } from '@/lib/data';
import type { ClimateData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
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

  // Sort districts by rainfall for the bar chart
  const sortedRainfall = [...data.districtRainfall].sort((a, b) => b.annual - a.annual);
  const avgRainfall = Math.round(data.districtRainfall.reduce((s, d) => s + d.annual, 0) / data.districtRainfall.length);
  const wettestDistrict = sortedRainfall[0];
  const driestDistrict = sortedRainfall[sortedRainfall.length - 1];

  // Latest temperature
  const latestTemp = data.temperatureTrend[data.temperatureTrend.length - 1];

  return (
    <div>
      <PageHeader
        title={t('climate.pageTitle')}
        description={t('climate.pageDesc')}
        accent="sundarbans"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Avg Annual Rainfall" value={`${avgRainfall} mm`} subtitle="State average" color="ganga" />
        <StatCard label="Wettest District" value={wettestDistrict.district} subtitle={`${wettestDistrict.annual} mm/year`} color="sundarbans" />
        <StatCard label="Driest District" value={driestDistrict.district} subtitle={`${driestDistrict.annual} mm/year`} color="shantiniketan" />
        <StatCard label="Extreme Events (2020-24)" value={data.extremeEvents.length.toString()} subtitle="Cyclones, floods, heat waves" color="durga" />
      </div>

      {/* District-wise Annual Rainfall */}
      <ChartCard title="District-wise Annual Rainfall" subtitle="Average annual rainfall (mm) across 23 districts" data={sortedRainfall as unknown as Record<string, unknown>[]}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={sortedRainfall} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${v} mm`} />
            <YAxis type="category" dataKey="district" width={140} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => `${v} mm`} />
            <Bar dataKey="annual" name="Annual Rainfall (mm)" radius={[0, 4, 4, 0]}>
              {sortedRainfall.map((d, i) => (
                <Cell key={i} fill={d.annual > 2500 ? COLORS.gangaBlue : d.annual > 1500 ? COLORS.sundarbansGreen : COLORS.shantiniketan} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Monthly Rainfall Pattern */}
        <ChartCard title="Monthly Rainfall Pattern" subtitle="State average rainfall by month (mm)" data={data.monthlyRainfall as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyRainfall}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v} mm`} />
              <Tooltip formatter={(v) => `${v} mm`} />
              <Area type="monotone" dataKey="rainfall" stroke={COLORS.gangaBlue} fill={COLORS.gangaBlue} fillOpacity={0.3} name="Rainfall (mm)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Seasonal Rainfall Radar */}
        <ChartCard title="Seasonal Rainfall Distribution" subtitle="Top 5 vs Bottom 5 districts by season">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={[
              { season: 'Monsoon', high: wettestDistrict.monsoon, low: driestDistrict.monsoon },
              { season: 'Pre-Monsoon', high: wettestDistrict.preMonsoon, low: driestDistrict.preMonsoon },
              { season: 'Post-Monsoon', high: wettestDistrict.postMonsoon, low: driestDistrict.postMonsoon },
              { season: 'Winter', high: wettestDistrict.winter, low: driestDistrict.winter },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="season" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis />
              <Radar name={wettestDistrict.district} dataKey="high" stroke={COLORS.gangaBlue} fill={COLORS.gangaBlue} fillOpacity={0.3} />
              <Radar name={driestDistrict.district} dataKey="low" stroke={COLORS.shantiniketan} fill={COLORS.shantiniketan} fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Temperature Trend */}
      <div className="mt-6">
        <ChartCard title="Temperature Trend (State Average)" subtitle={`Max, min, and average temperature over time (\u00B0C). Latest: ${latestTemp.avgTemp}\u00B0C avg (${latestTemp.year})`} data={data.temperatureTrend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.temperatureTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[18, 38]} tickFormatter={(v) => `${v}\u00B0C`} />
              <Tooltip formatter={(v) => `${v}\u00B0C`} />
              <Legend />
              <Line type="monotone" dataKey="maxTemp" stroke={COLORS.durgaVermillion} strokeWidth={2} name="Max Temp" dot />
              <Line type="monotone" dataKey="avgTemp" stroke={COLORS.mustardYellow} strokeWidth={2} name="Avg Temp" dot />
              <Line type="monotone" dataKey="minTemp" stroke={COLORS.gangaBlue} strokeWidth={2} name="Min Temp" dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Extreme Weather Events */}
      <div className="mt-6">
        <ChartCard title="Recent Extreme Weather Events" subtitle="Major cyclones, floods, and heat waves (2020-2024)">
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
