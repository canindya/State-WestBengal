'use client';

import { useEffect, useState } from 'react';
import { loadBudget } from '@/lib/data';
import type { BudgetData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell, ComposedChart,
} from 'recharts';

export default function BudgetPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<BudgetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBudget()
      .then(setData)
      .catch(e => { console.error('Budget load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading budget data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('budget.loading')}</div>;

  const latest = data.revenue[data.revenue.length - 1];
  const latestExp = data.expenditure[data.expenditure.length - 1];
  const latestFiscal = data.fiscalIndicators[data.fiscalIndicators.length - 1];

  // Revenue vs Expenditure
  const revExpData = data.revenue.map((r, i) => ({
    year: r.year,
    Revenue: r.total,
    Expenditure: data.expenditure[i]?.total || 0,
  }));

  // Capital vs Revenue expenditure
  const capRevData = data.expenditure.map(e => ({
    year: e.year,
    'Revenue Expenditure': e.revenue,
    'Capital Expenditure': e.capital,
  }));

  // Fiscal indicators
  const fiscalData = data.fiscalIndicators.map(f => ({
    year: f.year,
    'Fiscal Deficit (% GSDP)': f.fiscalDeficit,
    'Revenue Deficit (% GSDP)': f.revenueDeficit,
    'Debt-GSDP Ratio (%)': f.debtGsdpRatio,
  }));

  return (
    <div>
      <PageHeader
        title={t('budget.pageTitle')}
        description={t('budget.pageDesc')}
        accent="ganga"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={`Total Revenue ${latest.year}`} value={`\u20B9${(latest.total / 100).toFixed(0)}K Cr`} subtitle="Own Tax + Non-Tax + Central Transfers" color="sundarbans" />
        <StatCard label={`Total Expenditure ${latestExp.year}`} value={`\u20B9${(latestExp.total / 100).toFixed(0)}K Cr`} subtitle="Revenue + Capital" color="durga" />
        <StatCard label="Fiscal Deficit" value={`${latestFiscal.fiscalDeficit}%`} subtitle={`of GSDP (${latestFiscal.year})`} color="mustard" />
        <StatCard label="Debt-GSDP Ratio" value={`${latestFiscal.debtGsdpRatio}%`} subtitle={latestFiscal.year} color="ganga" />
      </div>

      {/* Revenue vs Expenditure */}
      <ChartCard title="Revenue vs Expenditure" subtitle="Total receipts and spending over time (\u20B9 Crores)" data={revExpData as Record<string, unknown>[]}>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={revExpData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={55} />
            <Tooltip formatter={(v) => `\u20B9${Number(v).toLocaleString()} Cr`} />
            <Legend />
            <Bar dataKey="Revenue" fill={COLORS.sundarbansGreen} opacity={0.7} />
            <Bar dataKey="Expenditure" fill={COLORS.durgaVermillion} opacity={0.7} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Sector Expenditure */}
        <ChartCard title={`Expenditure by Sector (${data.sectorExpenditure[0]?.year})`} subtitle="Where the state spends its money" data={data.sectorExpenditure as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[...data.sectorExpenditure].sort((a, b) => b.amount - a.amount)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K Cr`} />
              <YAxis type="category" dataKey="sector" width={140} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `\u20B9${Number(v).toLocaleString()} Cr`} />
              <Bar dataKey="amount" name="\u20B9 Crores">
                {[...data.sectorExpenditure].sort((a, b) => b.amount - a.amount).map((_, i) => (
                  <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Sources */}
        <ChartCard title={`Revenue Sources (${latest.year})`} subtitle="Own tax, non-tax, and central transfers">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              { source: 'Own Tax Revenue', amount: latest.ownTax },
              { source: 'Non-Tax Revenue', amount: latest.nonTax },
              { source: 'Central Transfers', amount: latest.centralTransfers },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `\u20B9${(v / 1000).toFixed(0)}K Cr`} />
              <YAxis type="category" dataKey="source" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `\u20B9${Number(v).toLocaleString()} Cr`} />
              <Bar dataKey="amount" name="\u20B9 Crores" radius={[0, 4, 4, 0]}>
                <Cell fill={COLORS.gangaBlue} />
                <Cell fill={COLORS.shantiniketan} />
                <Cell fill={COLORS.sundarbansGreen} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Capital vs Revenue Expenditure */}
      <div className="mt-6">
        <ChartCard title="Capital vs Revenue Expenditure" subtitle="Revenue expenditure (recurring) vs capital expenditure (asset-building)" data={capRevData as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capRevData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={55} />
              <Tooltip formatter={(v) => `\u20B9${Number(v).toLocaleString()} Cr`} />
              <Legend />
              <Bar dataKey="Revenue Expenditure" stackId="exp" fill={COLORS.shantiniketan} />
              <Bar dataKey="Capital Expenditure" stackId="exp" fill={COLORS.gangaBlue} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Fiscal Indicators */}
      <div className="mt-6">
        <ChartCard title="Fiscal Health Indicators" subtitle="Deficit ratios and debt as % of GSDP (FRBM target: 3.0% fiscal deficit)" data={fiscalData as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fiscalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Line type="monotone" dataKey="Fiscal Deficit (% GSDP)" stroke={COLORS.durgaVermillion} strokeWidth={2} dot />
              <Line type="monotone" dataKey="Revenue Deficit (% GSDP)" stroke={COLORS.mustardYellow} strokeWidth={2} dot />
              <Line type="monotone" dataKey="Debt-GSDP Ratio (%)" stroke={COLORS.gangaBlue} strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
