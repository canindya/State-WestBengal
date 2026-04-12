'use client';

import { useEffect, useState, useMemo } from 'react';
import { loadAQI } from '@/lib/data';
import type { AQIData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, getAQIColor, getAQILabel, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList,
} from 'recharts';

export default function EnvironmentPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<AQIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAQI()
      .then(setData)
      .catch(e => { console.error('AQI load error:', e); setError(e.message); });
  }, []);

  // City averages
  const cityAvg = useMemo(() => {
    if (!data) return [];
    const cityMap: Record<string, { sum: number; count: number; pm25Sum: number; pm10Sum: number }> = {};
    for (const d of data.daily) {
      if (!cityMap[d.city]) cityMap[d.city] = { sum: 0, count: 0, pm25Sum: 0, pm10Sum: 0 };
      cityMap[d.city].sum += d.aqi;
      cityMap[d.city].count++;
      cityMap[d.city].pm25Sum += d.pm25;
      cityMap[d.city].pm10Sum += d.pm10;
    }
    return Object.entries(cityMap)
      .map(([city, v]) => ({
        city,
        avgAQI: Math.round(v.sum / v.count),
        avgPM25: Math.round(v.pm25Sum / v.count * 10) / 10,
        avgPM10: Math.round(v.pm10Sum / v.count * 10) / 10,
      }))
      .sort((a, b) => b.avgAQI - a.avgAQI);
  }, [data]);

  // Seasonal AQI pattern
  const seasonalData = useMemo(() => {
    if (!data) return [];
    const seasons: Record<string, { sum: number; count: number }> = {
      'Winter (Dec-Feb)': { sum: 0, count: 0 },
      'Pre-Monsoon (Mar-May)': { sum: 0, count: 0 },
      'Monsoon (Jun-Sep)': { sum: 0, count: 0 },
      'Post-Monsoon (Oct-Nov)': { sum: 0, count: 0 },
    };
    for (const d of data.daily) {
      const month = parseInt(d.date.split('-')[1]);
      const key = month >= 12 || month <= 2 ? 'Winter (Dec-Feb)' :
                  month <= 5 ? 'Pre-Monsoon (Mar-May)' :
                  month <= 9 ? 'Monsoon (Jun-Sep)' : 'Post-Monsoon (Oct-Nov)';
      seasons[key].sum += d.aqi;
      seasons[key].count++;
    }
    return Object.entries(seasons).map(([season, v]) => ({
      season,
      avgAQI: v.count ? Math.round(v.sum / v.count) : 0,
    }));
  }, [data]);

  // Pollutant comparison across cities
  const pollutantData = useMemo(() => {
    if (!data) return [];
    return cityAvg.map(c => {
      const cityRecords = data.daily.filter(d => d.city === c.city);
      const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length * 10) / 10 : 0;
      return {
        city: c.city,
        PM2_5: avg(cityRecords.map(r => r.pm25)),
        PM10: avg(cityRecords.map(r => r.pm10)),
        NO2: avg(cityRecords.map(r => r.no2)),
        SO2: avg(cityRecords.map(r => r.so2)),
      };
    });
  }, [data, cityAvg]);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading air quality data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('environment.loading')}</div>;

  const worstCity = cityAvg[0];
  const bestCity = cityAvg[cityAvg.length - 1];

  return (
    <div>
      <PageHeader
        title={t('environment.pageTitle')}
        description={t('environment.pageDesc')}
        accent="durga"
        story="Air quality in West Bengal follows geography almost perfectly. Industrial belts (Howrah, Asansol) and dense urban cores (Kolkata) spend much of winter above the 'unhealthy' AQI threshold. Hill towns like Darjeeling stay near WHO limits year-round. And the seasonal pattern is stark — winter is always the worst, monsoon the best."
      />

      {/* Stat cards — cooled to 2 colours: durga (page accent) + sundarbans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Worst Air Quality" value={worstCity?.city || 'N/A'} subtitle={`Avg AQI: ${worstCity?.avgAQI} (${getAQILabel(worstCity?.avgAQI || 0)})`} color="durga" />
        <StatCard label="Best Air Quality" value={bestCity?.city || 'N/A'} subtitle={`Avg AQI: ${bestCity?.avgAQI} (${getAQILabel(bestCity?.avgAQI || 0)})`} color="sundarbans" />
        <StatCard label="Cities Monitored" value={data.cities.length.toString()} subtitle="Major urban centres" color="durga" tooltip="AQI — Air Quality Index, a composite measure on a 0-500 scale. Below 50 is 'Good'; above 200 is 'Unhealthy' for all groups." />
        <StatCard label="Data Points" value={data.daily.length.toString()} subtitle="Daily records" color="sundarbans" />
      </div>

      {/* City-wise Average AQI — colour by AQI category (meaningful, not decorative) */}
      <ChartCard
        title={`${worstCity?.city} has roughly ${Math.round((worstCity?.avgAQI || 0) / (bestCity?.avgAQI || 1))}× the AQI of ${bestCity?.city}`}
        subtitle="Average Air Quality Index by monitoring city, lower is better"
        source="Open-Meteo Air Quality API"
        insight="Industrial belts and dense urban cores post the worst averages; hill towns stay near the WHO limit. Air quality maps almost perfectly onto geography and industry — the colour here encodes the AQI category, not a decorative choice."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityAvg} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="city" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip formatter={(v) => [`AQI: ${v}`, 'Average']} />
            <Bar dataKey="avgAQI">
              {cityAvg.map((d, i) => (
                <Cell key={i} fill={getAQIColor(d.avgAQI)} />
              ))}
              <LabelList dataKey="avgAQI" position="top" fontSize={10} fill="var(--fg)" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Seasonal AQI */}
        <ChartCard
          title="Winter is always the worst — monsoon the best"
          subtitle="Average AQI by season, all cities combined"
          source="Open-Meteo Air Quality API"
          insight="Air quality follows rainfall and wind inversely — still air plus low rain traps pollutants, and the delta's geography amplifies the effect. The seasonal swing is larger than the city-to-city swing."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="season" {...AXIS_PROPS} tick={{ fontSize: 10 }} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `AQI: ${v}`} />
              <Bar dataKey="avgAQI">
                {seasonalData.map((d, i) => (
                  <Cell key={i} fill={getAQIColor(d.avgAQI)} />
                ))}
                <LabelList dataKey="avgAQI" position="top" fontSize={10} fill="var(--fg)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pollutant Comparison — PM dominates, others dimmed */}
        <ChartCard
          title="Particulate matter dominates the pollution load"
          subtitle="Average PM2.5, PM10, NO2, SO2 by city (µg/m³)"
          source="Open-Meteo Air Quality API"
          insight="PM2.5 and PM10 come largely from biomass burning, road dust, and construction. NO2 and SO2 track industrial activity but are secondary by volume — cleaner fuels alone won't solve the problem."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pollutantData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="city" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip />
              <Bar dataKey="PM2_5" fill={COLORS.durgaVermillion} />
              <Bar dataKey="PM10" fill={COLORS.shantiniketan} />
              <Bar dataKey="NO2" fill={dimmedColor(COLORS.gangaBlue)} />
              <Bar dataKey="SO2" fill={dimmedColor(COLORS.mustardYellow)} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.durgaVermillion }} /> PM2.5</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.shantiniketan }} /> PM10</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.gangaBlue }} /> NO2</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.mustardYellow }} /> SO2</span>
          </div>
        </ChartCard>
      </div>

      {/* AQI Scale Legend */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">AQI Scale Reference</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Good (0-50)', color: COLORS.aqi.good },
            { label: 'Moderate (51-100)', color: COLORS.aqi.moderate },
            { label: 'Unhealthy Sensitive (101-200)', color: COLORS.aqi.unhealthySensitive },
            { label: 'Unhealthy (201-300)', color: COLORS.aqi.unhealthy },
            { label: 'Very Unhealthy (301-400)', color: COLORS.aqi.veryUnhealthy },
            { label: 'Hazardous (401-500)', color: COLORS.aqi.hazardous },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
