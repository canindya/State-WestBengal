'use client';

import { useEffect, useState } from 'react';
import { loadInvestment } from '@/lib/data';
import type { InvestmentData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

export default function InvestmentPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<InvestmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvestment()
      .then(setData)
      .catch(e => { console.error('Investment load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading investment data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('investment.loading')}</div>;

  const km = data.keyMetrics;
  const infra = data.industrialInfra;
  const sortedInvestments = [...data.majorInvestments].sort((a, b) => b.amountCr - a.amountCr);
  const latestBgbsIndex = data.bgbsEditions.length - 1;

  return (
    <div>
      <PageHeader
        title={t('investment.pageTitle')}
        description={t('investment.pageDesc')}
        accent="ganga"
        story="Seven editions of the Bengal Global Business Summit have produced ₹19 lakh crore in investment proposals — nearly doubling in size since 2015. The conversion rate from proposal to realised investment is high by Indian summit standards. The 2025 edition set a new record at ₹4.4 lakh crore. This page is the operating record of Bengal's industrial come-on."
      />

      {/* Stat cards — cooled to 2 colours: ganga (page accent) + mustard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="BGBS 2025 Proposals" value={`₹${km.latestEditionProposalsLakhCr}L Cr`} subtitle={`${km.mous2025} MoUs signed`} color="ganga" />
        <StatCard label="Cumulative Proposals" value={`₹${km.cumulativeProposalsLakhCr}L Cr`} subtitle="Across 7 BGBS editions" color="mustard" />
        <StatCard label="Realized" value={`₹${km.realizedLakhCr}L Cr`} subtitle={`${Math.round((km.realizedLakhCr / km.cumulativeProposalsLakhCr) * 100)}% conversion`} color="ganga" />
        <StatCard label="Industrial Parks" value={`${infra.industrialParks}+`} subtitle="Ready for investment" color="mustard" />
        <StatCard label="Silicon Valley Hub" value={`${infra.siliconValleyHubCompanies}`} subtitle={`IT cos + ${infra.dataCentres} data centres`} color="ganga" />
        <StatCard label="Strikes Since 2011" value={`${infra.strikesSince2011}`} subtitle="Labour stability record" color="mustard" />
      </div>

      {/* BGBS Timeline — highlight latest edition */}
      <ChartCard
        title="BGBS proposals have nearly doubled since 2015"
        subtitle="Investment proposals per edition, ₹ lakh crore"
        source="WBIDC / BGBS official records"
        insight="The trajectory is the story — but execution is the test. 68% of the ₹19L Cr cumulative ask has been realised, which is high by Indian summit standards. Proposals are cheap; ribbon-cuttings are the score."
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.bgbsEditions} margin={{ top: 30, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={(v) => `₹${v}L`} />
            <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}L Cr`} />
            <Bar dataKey="proposalsLakhCr" radius={[4, 4, 0, 0]}>
              {data.bgbsEditions.map((_, i) => (
                <Cell key={i} fill={i === latestBgbsIndex ? COLORS.gangaBlue : dimmedColor(COLORS.gangaBlue)} />
              ))}
              <LabelList dataKey="proposalsLakhCr" position="top" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `₹${v}L`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Major Investments grid — single accent colour instead of 6 */}
      <div className="mt-6">
        <ChartCard
          title="Reliance alone outweighs the first BGBS edition"
          subtitle="Major corporate commitments announced or under execution"
          source="BGBS 2025, Business Standard, company disclosures"
          insight="When a single private player (₹50K Cr) commits more than an entire summit edition (2015: ₹2.43L Cr), the signal is unambiguous: the private sector has started to believe the comeback story."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedInvestments.map((inv, i) => (
              <div key={inv.company} className={`rounded-lg border p-4 ${i === 0 ? 'border-ganga bg-ganga/10' : 'border-border bg-card-hover'}`}>
                <p className={`text-sm font-semibold ${i === 0 ? 'text-ganga' : 'text-muted'}`}>{inv.company}</p>
                <p className="text-2xl font-bold mt-1">₹{(inv.amountCr / 1000).toFixed(1)}K Cr</p>
                <p className="text-xs text-muted mt-1">{inv.sector}</p>
                <p className="text-xs text-muted mt-2 italic">{inv.note}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Industrial infra stats — single accent colour instead of 6 */}
        <ChartCard
          title="Physical readiness is not the bottleneck"
          subtitle="Industrial infrastructure ready for investment"
          source="WBIDC, WEBEL"
          insight="200+ industrial parks, 22 SEZs, 41 IT companies in the Silicon Valley Hub, 11 data centres. The places to build exist. The constraint has always been converting proposals into ribbon-cuttings, not finding a plot of land."
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Industrial Parks</p>
              <p className="text-xl font-bold text-ganga">{infra.industrialParks}+</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">IT Parks</p>
              <p className="text-xl font-bold text-ganga">{infra.itParks}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Electronics Parks</p>
              <p className="text-xl font-bold text-ganga">{infra.electronicsParks}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">SEZs</p>
              <p className="text-xl font-bold text-ganga">{infra.sezs}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Silicon Valley Hub Cos</p>
              <p className="text-xl font-bold text-ganga">{infra.siliconValleyHubCompanies}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Data Centres</p>
              <p className="text-xl font-bold text-ganga">{infra.dataCentres}</p>
            </div>
          </div>
        </ChartCard>

        {/* Key sectors — single muted outline instead of 12 colours */}
        <ChartCard
          title="A diversified base — legacy industry and new economy in the same portfolio"
          subtitle="Established and emerging industry sectors"
          source="IBEF West Bengal"
          insight="Jute, tea, leather, and steel (the legacy) sit next to IT, data centres, and green energy (the new economy). Diversification is insurance — no single sector collapse can sink the state."
        >
          <div className="flex flex-wrap gap-2">
            {data.keySectors.map((sector) => (
              <span
                key={sector}
                className="inline-block rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:border-ganga hover:text-ganga transition-colors"
              >
                {sector}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-lg border-l-2 border-ganga bg-card-hover p-3">
            <p className="text-xs text-muted">Zero industrial strikes since 2010-11 — among the most stable labour environments in India.</p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
