'use client';

import { useEffect, useState } from 'react';
import { loadHealth } from '@/lib/data';
import type { HealthData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

export default function HealthPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<HealthData | null>(null);

  useEffect(() => {
    loadHealth().then(setData);
  }, []);

  if (!data) return <div className="text-center py-20 text-muted">{t('health.loading')}</div>;

  const totalBeds = data.infrastructure.reduce((s, d) => s + d.beds, 0);
  const totalDoctors = data.infrastructure.reduce((s, d) => s + d.doctors, 0);

  // Immunization data for radar chart
  const immunizationData = Object.entries(data.indicators.immunization.children).map(([key, value]) => ({
    indicator: key,
    value: value as number,
  }));

  // Infrastructure by district (top 10 by beds)
  const topInfra = [...data.infrastructure].sort((a, b) => b.beds - a.beds).slice(0, 12);

  // Nutrition data
  const nutritionData = Object.entries(data.nfhs.nutrition).map(([key, value]) => ({
    indicator: key.replace(/([A-Z])/g, ' $1').trim(),
    percentage: value as number,
  }));

  return (
    <div>
      <PageHeader
        title={t('health.pageTitle')}
        description={t('health.pageDesc')}
        accent="tea"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Hospital Beds" value={totalBeds.toLocaleString()} subtitle="Across reporting districts" color="tea" />
        <StatCard label="Doctors" value={totalDoctors.toLocaleString()} subtitle="Govt sector" color="ganga" />
        <StatCard label="IMR" value={data.indicators.imr.value.toString()} subtitle="Per 1,000 live births (NFHS-5)" color="durga" />
        <StatCard label="MMR" value={data.indicators.mmr.value.toString()} subtitle="Per 100,000 live births" color="shantiniketan" />
        <StatCard label="Full Immunization" value={`${data.indicators.immunization.value}%`} subtitle="Children 12-23 months" color="sundarbans" />
        <StatCard label="Institutional Delivery" value={`${data.indicators.institutionalDelivery}%`} subtitle="NFHS-5" color="mustard" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure by District */}
        <ChartCard title="Hospital Beds by District" subtitle="Top 12 districts by number of hospital beds" data={topInfra as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topInfra} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="district" width={130} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="beds" name="Beds" fill={COLORS.teaGreen} />
              <Bar dataKey="doctors" name="Doctors" fill={COLORS.gangaBlue} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Immunization Coverage Radar */}
        <ChartCard title="Immunization Coverage" subtitle="Percentage of children (12-23 months) immunized by vaccine type">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={immunizationData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Coverage %" dataKey="value" stroke={COLORS.sundarbansGreen} fill={COLORS.sundarbansGreen} fillOpacity={0.3} />
              <Tooltip formatter={(v) => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* IMR Trend */}
        <ChartCard title="Infant Mortality Rate Trend" subtitle="Deaths per 1,000 live births (SDG target: 12)" data={data.indicators.imr.trend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.indicators.imr.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 60]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={COLORS.durgaVermillion} strokeWidth={2} name="IMR" dot />
              {/* SDG Target line at 12 */}
              <Line type="monotone" dataKey={() => 12} stroke={COLORS.sundarbansGreen} strokeDasharray="5 5" strokeWidth={1} name="SDG Target (12)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* MMR Trend */}
        <ChartCard title="Maternal Mortality Ratio Trend" subtitle="Deaths per 100,000 live births (SDG target: 70)" data={data.indicators.mmr.trend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.indicators.mmr.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 180]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={COLORS.shantiniketan} strokeWidth={2} name="MMR" dot />
              <Line type="monotone" dataKey={() => 70} stroke={COLORS.sundarbansGreen} strokeDasharray="5 5" strokeWidth={1} name="SDG Target (70)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Nutrition Indicators */}
      <div className="mt-6">
        <ChartCard title="Nutrition Indicators (NFHS-5)" subtitle="Percentage of children and adults affected" data={nutritionData as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="indicator" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percentage" name="Percentage">
                {nutritionData.map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Anemia Alert */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-durga mb-2">Anemia: A Critical Challenge</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-durga">{data.indicators.anemia.women}%</p>
            <p className="text-sm text-muted">Women (15-49 years) are anemic</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-shantiniketan">{data.indicators.anemia.children}%</p>
            <p className="text-sm text-muted">Children (6-59 months) are anemic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
