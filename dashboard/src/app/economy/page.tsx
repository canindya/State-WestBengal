'use client';

import { useEffect, useState } from 'react';
import { loadEconomy } from '@/lib/data';
import type { EconomyData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import ComparisonBar from '@/components/layout/ComparisonBar';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';

export default function EconomyPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<EconomyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEconomy()
      .then(setData)
      .catch(e => { console.error('Economy load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading economy data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('economy.loading')}</div>;

  const km = data.keyMetrics;
  const gsdpLatest = data.gsdpTimeline[data.gsdpTimeline.length - 1];

  return (
    <div>
      <PageHeader
        title={t('economy.pageTitle')}
        description={t('economy.pageDesc')}
        accent="mustard"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="GSDP 2024-25" value={`\u20B9${gsdpLatest.valueLakhCr}L Cr`} subtitle={`Rank #${km.gsdpRank} in India`} color="mustard" />
        <StatCard label="Per Capita Income" value={`\u20B9${(km.perCapitaIncomeInr / 1000).toFixed(0)}K`} subtitle="2025-26 est." color="ganga" />
        <StatCard label="MSME Units" value={`${km.msmeUnitsLakh}L`} subtitle={`Rank #${km.msmeRank} in India`} color="sundarbans" />
        <StatCard label="Poverty Rate" value={`${km.povertyRatePct}%`} subtitle={`vs India ${km.nationalPovertyPct}%`} color="tea" />
        <StatCard label="Industrial Growth" value={`${km.industrialGrowthPct}%`} subtitle={`vs India ${km.nationalIndustrialGrowthPct}%`} color="shantiniketan" />
        <StatCard label="Debt / GSDP" value={`${km.debtGsdpRatioPct}%`} subtitle="Elevated but declining" color="durga" />
      </div>

      {/* The Comeback narrative */}
      <div className="rounded-xl border-l-4 border-mustard bg-card p-5 mb-8">
        <h3 className="text-lg font-semibold mb-1">The Comeback State</h3>
        <p className="text-sm text-muted">
          Once <span className="text-foreground font-semibold">{km.gdpShare1960Pct}%</span> of India&rsquo;s GDP in 1960-61, West Bengal&rsquo;s share has fallen to <span className="text-foreground font-semibold">{km.gdpShareIndiaPct}%</span> today.
          But GSDP has more than doubled in a decade — from ₹8.03L Cr in 2015-16 to ₹{gsdpLatest.valueLakhCr}L Cr in 2024-25.
          Industrial growth ({km.industrialGrowthPct}%) now outpaces the national average ({km.nationalIndustrialGrowthPct}%), and MSMEs rank #{km.msmeRank} nationally.
        </p>
      </div>

      {/* GSDP Timeline */}
      <ChartCard
        title="GSDP Growth"
        subtitle="Gross State Domestic Product, ₹ lakh crore (2015-16 to 2024-25)"
        source="MoSPI / RBI Handbook of Statistics on Indian States"
        insight="GSDP has more than doubled in a decade. The 2020-21 COVID dip was shallow and the recovery sharp — FY25 is nearly 50% above the 2019 pre-pandemic level."
        data={data.gsdpTimeline as unknown as Record<string, unknown>[]}
      >
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.gsdpTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `\u20B9${v}L Cr`} />
            <Tooltip formatter={(v) => `\u20B9${Number(v).toFixed(2)}L Cr`} />
            <Line type="monotone" dataKey="valueLakhCr" name="GSDP" stroke={COLORS.mustardYellow} strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Sector Split */}
        <ChartCard
          title="GSDP Sector Composition"
          subtitle="Share of services, industry, agriculture"
          source="MoSPI / NITI Aayog"
          insight="Services dominate at 55% — typical of a post-industrial state. Industry is the smallest of the three legs; reversing that gap is the entire manufacturing-led growth case for West Bengal."
          data={data.sectorSplit as unknown as Record<string, unknown>[]}
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.sectorSplit}
                dataKey="percentage"
                nameKey="sector"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
              >
                {data.sectorSplit.map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Exports */}
        <ChartCard
          title="Top Export Commodities"
          subtitle="Major export categories (indicative share %)"
          source="IBEF West Bengal Presentation"
          insight="Engineering goods and gems lead the value chart, but legacy strengths (tea, rice, leather) still matter for employment. A diversified basket — less vulnerable to single-sector shocks than export monocultures."
          data={data.topExports as unknown as Record<string, unknown>[]}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.topExports} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="share" name="Share" radius={[0, 4, 4, 0]}>
                {data.topExports.map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Comparison WB vs India */}
      <div className="mt-6">
        <ChartCard
          title="West Bengal vs India"
          subtitle="Key macro indicators side-by-side"
          source="MoSPI, NITI Aayog MPI 2023, PRS India"
          insight="WB beats the national average on per-capita income, poverty rate, and industrial growth. Fiscal deficit is the one metric where the state is modestly worse — a reminder that a growing economy still needs disciplined finances."
        >
          <ComparisonBar rows={data.comparisonIndia} />
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-sundarbans" /> WB better</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-durga" /> WB worse</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-ganga" /> India</span>
          </div>
        </ChartCard>
      </div>

      {/* Fiscal footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Exports</p>
          <p className="text-2xl font-bold text-ganga">${km.exportsBillionUsd}B</p>
          <p className="text-xs text-muted mt-1">Merchandise exports (IBEF)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Own Tax Revenue</p>
          <p className="text-2xl font-bold text-sundarbans">₹{(km.ownTaxRevenueCr / 1000).toFixed(0)}K Cr</p>
          <p className="text-xs text-muted mt-1">2024-25 (PRS India)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Fiscal Deficit</p>
          <p className="text-2xl font-bold text-shantiniketan">{km.fiscalDeficitPctGsdp}%</p>
          <p className="text-xs text-muted mt-1">of GSDP</p>
        </div>
      </div>
    </div>
  );
}
