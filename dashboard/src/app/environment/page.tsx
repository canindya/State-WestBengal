'use client';

import { useEffect, useState, useMemo } from 'react';
import { loadAQI } from '@/lib/data';
import type { AQIData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import CategoryToggle from '@/components/layout/CategoryToggle';
import { COLORS, getAQIColor, getAQILabel } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell,
} from 'recharts';

export default function EnvironmentPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<AQIData | null>(null);
  const [activeCities, setActiveCities] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAQI()
      .then(d => { setData(d); setActiveCities(new Set(d.cities)); })
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

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading air quality data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('environment.loading')}</div>;

  const worstCity = cityAvg[0];
  const bestCity = cityAvg[cityAvg.length - 1];

  // Filter daily data by active cities
  const filteredDaily = data.daily.filter(d => activeCities.has(d.city));

  // Pollutant comparison across cities
  const pollutantData = cityAvg.map(c => {
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

  return (
    <div>
      <PageHeader
        title={t('environment.pageTitle')}
        description={t('environment.pageDesc')}
        accent="durga"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Worst Air Quality" value={worstCity?.city || 'N/A'} subtitle={`Avg AQI: ${worstCity?.avgAQI} (${getAQILabel(worstCity?.avgAQI || 0)})`} color="durga" />
        <StatCard label="Best Air Quality" value={bestCity?.city || 'N/A'} subtitle={`Avg AQI: ${bestCity?.avgAQI} (${getAQILabel(bestCity?.avgAQI || 0)})`} color="sundarbans" />
        <StatCard label="Cities Monitored" value={data.cities.length.toString()} subtitle="Major urban centres" color="ganga" />
        <StatCard label="Data Points" value={data.daily.length.toString()} subtitle="Daily records" color="shantiniketan" />
      </div>

      {/* City-wise Average AQI */}
      <ChartCard title="City-wise Average AQI" subtitle="Average Air Quality Index across monitoring cities (lower is better)" data={cityAvg as unknown as Record<string, unknown>[]}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityAvg}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip formatter={(v) => [`AQI: ${v}`, 'Average']} />
            <Bar dataKey="avgAQI" name="Avg AQI">
              {cityAvg.map((d, i) => (
                <Cell key={i} fill={getAQIColor(d.avgAQI)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Seasonal AQI */}
        <ChartCard title="Seasonal AQI Pattern" subtitle="Average AQI by season (all cities combined)" data={seasonalData as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={(v) => `AQI: ${v}`} />
              <Bar dataKey="avgAQI" name="Avg AQI">
                {seasonalData.map((d, i) => (
                  <Cell key={i} fill={getAQIColor(d.avgAQI)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pollutant Comparison */}
        <ChartCard title="Pollutant Levels by City" subtitle="Average PM2.5, PM10, NO2, SO2 (\u00B5g/m\u00B3)" data={pollutantData as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pollutantData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="PM2_5" name="PM2.5" fill={COLORS.durgaVermillion} />
              <Bar dataKey="PM10" name="PM10" fill={COLORS.shantiniketan} />
              <Bar dataKey="NO2" name="NO2" fill={COLORS.gangaBlue} />
              <Bar dataKey="SO2" name="SO2" fill={COLORS.mustardYellow} />
            </BarChart>
          </ResponsiveContainer>
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
