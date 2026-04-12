'use client';

import { useEffect, useState } from 'react';
import { loadInvestment } from '@/lib/data';
import type { InvestmentData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
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

  return (
    <div>
      <PageHeader
        title={t('investment.pageTitle')}
        description={t('investment.pageDesc')}
        accent="ganga"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="BGBS 2025 Proposals" value={`\u20B9${km.latestEditionProposalsLakhCr}L Cr`} subtitle={`${km.mous2025} MoUs signed`} color="ganga" />
        <StatCard label="Cumulative Proposals" value={`\u20B9${km.cumulativeProposalsLakhCr}L Cr`} subtitle="Across 7 BGBS editions" color="shantiniketan" />
        <StatCard label="Realized" value={`\u20B9${km.realizedLakhCr}L Cr`} subtitle={`${Math.round((km.realizedLakhCr / km.cumulativeProposalsLakhCr) * 100)}% conversion`} color="sundarbans" />
        <StatCard label="Industrial Parks" value={`${infra.industrialParks}+`} subtitle="Ready for investment" color="mustard" />
        <StatCard label="Silicon Valley Hub" value={`${infra.siliconValleyHubCompanies}`} subtitle={`IT cos + ${infra.dataCentres} data centres`} color="twilight" />
        <StatCard label="Strikes Since 2011" value={`${infra.strikesSince2011}`} subtitle="Labour stability record" color="tea" />
      </div>

      {/* BGBS Timeline */}
      <ChartCard
        title="Bengal Global Business Summit — Proposals Over Time"
        subtitle="Investment proposals per edition (\u20B9 lakh crore)"
        source="WBIDC / BGBS official records"
        data={data.bgbsEditions as unknown as Record<string, unknown>[]}
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.bgbsEditions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `\u20B9${v}L Cr`} />
            <Tooltip formatter={(v) => `\u20B9${Number(v).toFixed(2)}L Cr`} />
            <Bar dataKey="proposalsLakhCr" name="Proposals" radius={[4, 4, 0, 0]}>
              {data.bgbsEditions.map((_, i) => (
                <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Major Investments grid */}
      <div className="mt-6">
        <ChartCard
          title="Major Corporate Commitments"
          subtitle="Notable investments announced / under execution"
          source="BGBS 2025, Business Standard, company disclosures"
          data={sortedInvestments as unknown as Record<string, unknown>[]}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedInvestments.map((inv, i) => (
              <div key={inv.company} className="rounded-lg border border-border bg-card-hover p-4">
                <p className="text-sm font-semibold" style={{ color: COLORS.chart[i % COLORS.chart.length] }}>{inv.company}</p>
                <p className="text-2xl font-bold mt-1">\u20B9{(inv.amountCr / 1000).toFixed(1)}K Cr</p>
                <p className="text-xs text-muted mt-1">{inv.sector}</p>
                <p className="text-xs text-muted mt-2 italic">{inv.note}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Industrial infra stats */}
        <ChartCard title="Industrial Infrastructure" subtitle="Ready ecosystem for new investors" source="WBIDC, WEBEL">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Industrial Parks</p>
              <p className="text-xl font-bold text-ganga">{infra.industrialParks}+</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">IT Parks</p>
              <p className="text-xl font-bold text-shantiniketan">{infra.itParks}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Electronics Parks</p>
              <p className="text-xl font-bold text-sundarbans">{infra.electronicsParks}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">SEZs</p>
              <p className="text-xl font-bold text-mustard">{infra.sezs}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Silicon Valley Hub Cos</p>
              <p className="text-xl font-bold text-twilight">{infra.siliconValleyHubCompanies}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-hover p-3">
              <p className="text-xs text-muted">Data Centres</p>
              <p className="text-xl font-bold text-tea">{infra.dataCentres}</p>
            </div>
          </div>
        </ChartCard>

        {/* Key sectors chips */}
        <ChartCard title="Key Industry Sectors" subtitle="Established and emerging strengths" source="IBEF West Bengal">
          <div className="flex flex-wrap gap-2">
            {data.keySectors.map((sector, i) => (
              <span
                key={sector}
                className="inline-block rounded-full border border-border px-3 py-1.5 text-sm"
                style={{ borderColor: COLORS.chart[i % COLORS.chart.length], color: COLORS.chart[i % COLORS.chart.length] }}
              >
                {sector}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-lg border-l-2 border-tea bg-card-hover p-3">
            <p className="text-xs text-muted">Zero industrial strikes since 2010-11 \u2014 among the most stable labour environments in India.</p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
