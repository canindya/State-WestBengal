'use client';

import { useEffect, useState } from 'react';
import { loadHealth } from '@/lib/data';
import type { HealthData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList, ReferenceLine,
} from 'recharts';

export default function HealthPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHealth()
      .then(setData)
      .catch(e => { console.error('Health load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading health data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('health.loading')}</div>;

  const totalBeds = data.infrastructure.reduce((s, d) => s + d.beds, 0);
  const totalDoctors = data.infrastructure.reduce((s, d) => s + d.doctors, 0);

  // Immunization: radar → horizontal bar, sorted asc (lowest at top to call attention)
  const immunizationData = Object.entries(data.indicators.immunization.children)
    .map(([key, value]) => ({ indicator: key, value: value as number }))
    .sort((a, b) => a.value - b.value);

  // Infrastructure by district (top 12 by beds); highlight Kolkata
  const topInfra = [...data.infrastructure].sort((a, b) => b.beds - a.beds).slice(0, 12);
  const kolkataRow = topInfra.find(d => d.district.toLowerCase().includes('kolkata'))?.district;

  // Nutrition data — highlight anaemia (the one that's not improving)
  const nutritionData = Object.entries(data.nfhs.nutrition).map(([key, value]) => ({
    indicator: key.replace(/([A-Z])/g, ' $1').trim(),
    percentage: value as number,
  }));
  const anaemiaIndex = nutritionData.findIndex(d => d.indicator.toLowerCase().includes('anaemi') || d.indicator.toLowerCase().includes('anemi'));

  const imrLatest = data.indicators.imr.trend[data.indicators.imr.trend.length - 1];
  const mmrLatest = data.indicators.mmr.trend[data.indicators.mmr.trend.length - 1];

  return (
    <div>
      <PageHeader
        title={t('health.pageTitle')}
        description={t('health.pageDesc')}
        accent="tea"
        story="On the headline numbers, West Bengal's health system is working: IMR is below the national average, MMR has already crossed the 2030 SDG target, and immunization coverage is above 85% on every major antigen. Below those topline wins lies a harder story — anaemia in women remains stubbornly high, and hospital beds concentrate sharply in Kolkata. The system succeeds at preventing death; it's catching up on quality."
      />

      {/* Stat cards — cooled to 2 colours: tea (page accent) + sundarbans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Hospital Beds" value={totalBeds.toLocaleString()} subtitle="Across reporting districts" color="tea" />
        <StatCard label="Doctors" value={totalDoctors.toLocaleString()} subtitle="Govt sector" color="sundarbans" />
        <StatCard label="IMR" value={data.indicators.imr.value.toString()} subtitle="Per 1,000 live births (NFHS-5)" color="tea" tooltip="Infant Mortality Rate — number of infant deaths (under 1 year) per 1,000 live births in a given year. Lower is better." />
        <StatCard label="MMR" value={data.indicators.mmr.value.toString()} subtitle="Per 100,000 live births" color="sundarbans" tooltip="Maternal Mortality Ratio — number of maternal deaths (during pregnancy or within 42 days of termination) per 100,000 live births. Lower is better." />
        <StatCard label="Full Immunization" value={`${data.indicators.immunization.value}%`} subtitle="Children 12-23 months" color="tea" />
        <StatCard label="Institutional Delivery" value={`${data.indicators.institutionalDelivery}%`} subtitle="NFHS-5" color="sundarbans" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure by District — highlight Kolkata, one series not two */}
        <ChartCard
          title="Kolkata dominates the bed count — rural districts trail far behind"
          subtitle="Hospital beds, top 12 districts"
          source="NHM West Bengal"
          insight="Per-capita bed availability in rural districts is less than half the Kolkata figure. Referral patterns reflect it — serious cases travel to the city. The implied centralization is efficient on paper but punishing for rural patients."
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topInfra} layout="vertical" margin={{ top: 10, right: 60, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} />
              <YAxis type="category" dataKey="district" width={100} {...AXIS_PROPS} />
              <Tooltip />
              <Bar dataKey="beds" radius={[0, 4, 4, 0]}>
                {topInfra.map((d) => (
                  <Cell key={d.district} fill={d.district === kolkataRow ? COLORS.teaGreen : dimmedColor(COLORS.teaGreen)} />
                ))}
                <LabelList dataKey="beds" position="right" fontSize={10} fill="var(--fg)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Immunization — radar → horizontal bar, dim all, highlight the lowest */}
        <ChartCard
          title="Immunization coverage is above 85% on every major antigen"
          subtitle="Children 12-23 months fully immunized, by vaccine"
          source="NFHS-5 (2019-21)"
          insight="A genuine public-health success that the IMR numbers are now catching up with. Routine immunization is the lever that built the floor — and the last few percentage points are always the hardest to add."
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={immunizationData} layout="vertical" margin={{ top: 10, right: 60, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" domain={[0, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="indicator" width={80} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {immunizationData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.sundarbansGreen : dimmedColor(COLORS.sundarbansGreen)} />
                ))}
                <LabelList dataKey="value" position="right" fontSize={11} fill="var(--fg)" formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* IMR Trend — direct end-label, reference line instead of second series */}
        <ChartCard
          title="IMR has dropped by a third in a decade"
          subtitle="Infant deaths per 1,000 live births — the line, not the target, is the win"
          source="SRS, NFHS-5 (2019-21)"
          insight="West Bengal is already ahead of the national average. The SDG target of 12 (dashed line) is still below the current figure — the question now is how fast the curve can close the remaining gap."
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.indicators.imr.trend} margin={{ top: 20, right: 50, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis domain={[0, 60]} {...AXIS_PROPS} />
              <Tooltip />
              <ReferenceLine y={12} stroke={COLORS.sundarbansGreen} strokeDasharray="5 5" label={{ value: 'SDG target 12', position: 'insideBottomRight', fontSize: 10, fill: COLORS.sundarbansGreen }} />
              <Line type="monotone" dataKey="value" stroke={COLORS.durgaVermillion} strokeWidth={2} dot={{ r: 3 }}>
                <LabelList dataKey="value" position="top" fontSize={10} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === imrLatest.value ? `${v}` : '')} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* MMR Trend — direct end-label */}
        <ChartCard
          title="MMR already below the 2030 SDG target — and still falling"
          subtitle="Maternal deaths per 100,000 live births"
          source="SRS, NFHS-5 (2019-21)"
          insight="The combination of high institutional delivery (93%) and expanded maternal care is doing the work. This is one of the clearer public-health wins anywhere in India over the past decade."
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.indicators.mmr.trend} margin={{ top: 20, right: 50, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis domain={[0, 180]} {...AXIS_PROPS} />
              <Tooltip />
              <ReferenceLine y={70} stroke={COLORS.sundarbansGreen} strokeDasharray="5 5" label={{ value: 'SDG target 70', position: 'insideTopRight', fontSize: 10, fill: COLORS.sundarbansGreen }} />
              <Line type="monotone" dataKey="value" stroke={COLORS.shantiniketan} strokeWidth={2} dot={{ r: 3 }}>
                <LabelList dataKey="value" position="top" fontSize={10} fill={COLORS.shantiniketan} formatter={(v: unknown) => (v === mmrLatest.value ? `${v}` : '')} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Nutrition Indicators — highlight anaemia */}
      <div className="mt-6">
        <ChartCard
          title="Anaemia is the stubborn exception — everything else is improving"
          subtitle="NFHS-5 child and adult nutrition indicators (%)"
          source="NFHS-5 (2019-21)"
          insight="Stunting and wasting are gradually improving, but anaemia — especially among women — remains stubbornly high. It's the one indicator where WB's social welfare machinery hasn't moved the needle."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="indicator" {...AXIS_PROPS} tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percentage">
                {nutritionData.map((_, i) => (
                  <Cell key={i} fill={i === anaemiaIndex ? COLORS.durgaVermillion : dimmedColor(COLORS.teaGreen)} />
                ))}
                <LabelList dataKey="percentage" position="top" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Anemia Alert */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-durga mb-2">Anaemia: A Critical Challenge</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-durga">{data.indicators.anemia.women}%</p>
            <p className="text-sm text-muted">Women (15-49 years) are anaemic</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-shantiniketan">{data.indicators.anemia.children}%</p>
            <p className="text-sm text-muted">Children (6-59 months) are anaemic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
