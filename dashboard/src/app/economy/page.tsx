'use client';

import { useEffect, useState } from 'react';
import { loadEconomy } from '@/lib/data';
import type { EconomyData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import ComparisonBar from '@/components/layout/ComparisonBar';
import { COLORS, highlightColors, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
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
  // Sort sectors largest-first for the horizontal bar
  const sortedSectors = [...data.sectorSplit].sort((a, b) => b.percentage - a.percentage);
  // Top exports already sorted by rank; highlight rank 1 (Engineering Goods)
  const exportHighlight = 0;

  return (
    <div>
      <PageHeader
        title={t('economy.pageTitle')}
        description={t('economy.pageDesc')}
        accent="mustard"
        story="West Bengal's share of India's GDP has been shrinking for six decades — from 10.5% in 1960 to 5.6% today. But the underlying arithmetic has shifted. GSDP has more than doubled in the last decade, industrial growth now outpaces the national average, and MSMEs rank #2 nationally. This page is the case for a comeback."
      />

      {/* Stat cards — cooled to 2 colours: mustard (page accent) + tea (neutral) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="GSDP 2024-25" value={`₹${gsdpLatest.valueLakhCr}L Cr`} subtitle={`Rank #${km.gsdpRank} in India`} color="mustard" />
        <StatCard label="Per Capita Income" value={`₹${(km.perCapitaIncomeInr / 1000).toFixed(0)}K`} subtitle="2025-26 est." color="tea" />
        <StatCard label="MSME Units" value={`${km.msmeUnitsLakh}L`} subtitle={`Rank #${km.msmeRank} in India`} color="mustard" />
        <StatCard label="Poverty Rate" value={`${km.povertyRatePct}%`} subtitle={`vs India ${km.nationalPovertyPct}%`} color="tea" />
        <StatCard label="Industrial Growth" value={`${km.industrialGrowthPct}%`} subtitle={`vs India ${km.nationalIndustrialGrowthPct}%`} color="mustard" />
        <StatCard label="Debt / GSDP" value={`${km.debtGsdpRatioPct}%`} subtitle="Elevated but declining" color="tea" />
      </div>

      {/* GSDP Timeline — takeaway title, minimal chrome, latest point highlighted */}
      <ChartCard
        title="GSDP has more than doubled in a decade"
        subtitle={`₹${(data.gsdpTimeline[0].valueLakhCr).toFixed(2)}L Cr in 2015-16 → ₹${gsdpLatest.valueLakhCr}L Cr in 2024-25`}
        source="MoSPI / RBI Handbook of Statistics on Indian States"
        insight="The 2020-21 COVID dip was shallow and the recovery sharp — FY25 is nearly 50% above the 2019 pre-pandemic level. The slope of the line, not the absolute number, is the story."
      >
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.gsdpTimeline} margin={{ top: 20, right: 60, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={(v) => `₹${v}L`} />
            <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}L Cr`} />
            <Line type="monotone" dataKey="valueLakhCr" stroke={COLORS.mustardYellow} strokeWidth={3} dot={{ r: 4, fill: COLORS.mustardYellow }} activeDot={{ r: 6 }}>
              <LabelList dataKey="valueLakhCr" position="top" fontSize={10} fill={COLORS.mustardYellow} formatter={(v: unknown) => (v === gsdpLatest.valueLakhCr ? `₹${v}L Cr` : '')} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Sector Composition — horizontal bar, no legends, no angles */}
        <ChartCard
          title="Services dominate at 55% — industry is the smallest leg"
          subtitle="Sector share of GSDP (%)"
          source="MoSPI / NITI Aayog"
          insight="The structural challenge is visible immediately: services are larger than industry and agriculture combined. The manufacturing-led growth story that every Indian state is chasing is the mirror image of this chart."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sortedSectors} layout="vertical" margin={{ top: 10, right: 60, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" domain={[0, 60]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="sector" width={100} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {sortedSectors.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.mustardYellow : dimmedColor(COLORS.mustardYellow)} />
                ))}
                <LabelList dataKey="percentage" position="right" fontSize={11} fill="var(--fg)" formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Exports — dim all except the #1 export */}
        <ChartCard
          title="Engineering goods lead exports — but the basket is diversified"
          subtitle="Share of total merchandise exports (%)"
          source="IBEF West Bengal Presentation"
          insight="Legacy strengths (tea, rice, leather) still matter for employment even when the value chart is led by engineering goods and gems. A diversified basket is less vulnerable to single-sector shocks than export monocultures."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.topExports} layout="vertical" margin={{ top: 10, right: 60, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={140} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                {data.topExports.map((_, i) => (
                  <Cell key={i} fill={highlightColors(data.topExports.length, exportHighlight)[i]} />
                ))}
                <LabelList dataKey="share" position="right" fontSize={11} fill="var(--fg)" formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Comparison WB vs India */}
      <div className="mt-6">
        <ChartCard
          title="West Bengal beats India on per-capita income, poverty, and industrial growth"
          subtitle="Key macro indicators, side-by-side"
          source="MoSPI, NITI Aayog MPI 2023, PRS India"
          insight="Fiscal deficit is the one metric where the state is modestly worse — a reminder that a growing economy still needs disciplined finances. Three out of four green is a defensible score card, not a victory lap."
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
          <p className="text-2xl font-bold text-mustard">${km.exportsBillionUsd}B</p>
          <p className="text-xs text-muted mt-1">Merchandise exports (IBEF)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Own Tax Revenue</p>
          <p className="text-2xl font-bold text-mustard">₹{(km.ownTaxRevenueCr / 1000).toFixed(0)}K Cr</p>
          <p className="text-xs text-muted mt-1">2024-25 (PRS India)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Fiscal Deficit</p>
          <p className="text-2xl font-bold text-mustard">{km.fiscalDeficitPctGsdp}%</p>
          <p className="text-xs text-muted mt-1">of GSDP</p>
        </div>
      </div>
    </div>
  );
}
