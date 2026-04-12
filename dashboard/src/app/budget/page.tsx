'use client';

import { useEffect, useState } from 'react';
import { loadBudget } from '@/lib/data';
import type { BudgetData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, AXIS_PROPS_SMALL, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList, ComposedChart, ReferenceLine,
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

  const revExpData = data.revenue.map((r, i) => ({
    year: r.year,
    Revenue: r.total,
    Expenditure: data.expenditure[i]?.total || 0,
  }));
  const latestRevExp = revExpData[revExpData.length - 1];

  const capRevData = data.expenditure.map(e => ({
    year: e.year,
    'Revenue Expenditure': e.revenue,
    'Capital Expenditure': e.capital,
  }));

  const fiscalData = data.fiscalIndicators.map(f => ({
    year: f.year,
    'Fiscal Deficit': f.fiscalDeficit,
    'Revenue Deficit': f.revenueDeficit,
    'Debt / GSDP': f.debtGsdpRatio,
  }));
  const latestFiscalRow = fiscalData[fiscalData.length - 1];

  const sortedSectors = [...data.sectorExpenditure].sort((a, b) => b.amount - a.amount);

  const revenueSources = [
    { source: 'Central Transfers', amount: latest.centralTransfers },
    { source: 'Own Tax Revenue', amount: latest.ownTax },
    { source: 'Non-Tax Revenue', amount: latest.nonTax },
  ].sort((a, b) => b.amount - a.amount);
  const centralTransferIndex = revenueSources.findIndex(r => r.source === 'Central Transfers');

  return (
    <div>
      <PageHeader
        title={t('budget.pageTitle')}
        description={t('budget.pageDesc')}
        accent="ganga"
        story="West Bengal's expenditure has outpaced its revenue every single year. The fiscal deficit is structural, not cyclical — central transfers form the largest single revenue source, and capital spending sits below 15% of the budget. The debt-to-GSDP ratio is slowly declining as GSDP grows faster than borrowings. This page is the state's operating ledger, honestly told."
      />

      {/* Stat cards — cooled to 2 colours: ganga (page accent) + mustard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={`Total Revenue ${latest.year}`} value={`₹${(latest.total / 100).toFixed(0)}K Cr`} subtitle="Own Tax + Non-Tax + Central Transfers" color="ganga" />
        <StatCard label={`Total Expenditure ${latestExp.year}`} value={`₹${(latestExp.total / 100).toFixed(0)}K Cr`} subtitle="Revenue + Capital" color="mustard" />
        <StatCard label="Fiscal Deficit" value={`${latestFiscal.fiscalDeficit}%`} subtitle={`of GSDP (${latestFiscal.year})`} color="ganga" tooltip="Fiscal deficit = total expenditure − total revenue (excluding borrowings). FRBM target is 3.0% of GSDP." />
        <StatCard label="Debt-GSDP Ratio" value={`${latestFiscal.debtGsdpRatio}%`} subtitle={latestFiscal.year} color="mustard" tooltip="Outstanding state debt as a % of Gross State Domestic Product. Higher values indicate greater borrowing stress." />
      </div>

      {/* Revenue vs Expenditure */}
      <ChartCard
        title="Expenditure has outpaced revenue every single year"
        subtitle="Total receipts vs total spending, ₹ crores"
        source="PRS India, WB Finance Department"
        insight="The fiscal deficit is structural, not a response to any single shock. Any return to discipline must start with the revenue side — expenditure has been remarkably sticky."
      >
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={revExpData} margin={{ top: 30, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={55} />
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()} Cr`} />
            <Bar dataKey="Revenue" fill={dimmedColor(COLORS.sundarbansGreen)}>
              <LabelList dataKey="Revenue" position="top" fontSize={9} fill={COLORS.sundarbansGreen} formatter={(v: unknown) => (v === latestRevExp.Revenue ? `Rev ₹${(Number(v) / 1000).toFixed(0)}K` : '')} />
            </Bar>
            <Bar dataKey="Expenditure" fill={COLORS.durgaVermillion}>
              <LabelList dataKey="Expenditure" position="top" fontSize={9} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === latestRevExp.Expenditure ? `Exp ₹${(Number(v) / 1000).toFixed(0)}K` : '')} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Sector Expenditure — highlight top 3 */}
        <ChartCard
          title="Education, welfare, and pensions absorb the bulk"
          subtitle={`Expenditure by sector (${data.sectorExpenditure[0]?.year}), ₹ crores`}
          source="PRS India, WB Budget Documents"
          insight="A typical welfare-first fiscal structure. Infrastructure and capital-formation sectors get what's left after the large recurring claims have been paid."
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedSectors} layout="vertical" margin={{ top: 10, right: 80, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="sector" width={110} {...AXIS_PROPS_SMALL} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()} Cr`} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {sortedSectors.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? COLORS.gangaBlue : dimmedColor(COLORS.gangaBlue)} />
                ))}
                <LabelList dataKey="amount" position="right" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${(Number(v) / 1000).toFixed(0)}K`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Sources — highlight central transfers (the dependency story) */}
        <ChartCard
          title="Central transfers are the single largest source"
          subtitle={`Revenue composition (${latest.year}), ₹ crores`}
          source="PRS India, WB Finance Department"
          insight="Making the state unusually dependent on Union finances. Expanding own-tax revenue is the only path to fiscal autonomy — and the GST-era buoyancy hasn't been generous enough to close the gap."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueSources} layout="vertical" margin={{ top: 10, right: 80, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="source" width={130} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()} Cr`} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {revenueSources.map((_, i) => (
                  <Cell key={i} fill={i === centralTransferIndex ? COLORS.gangaBlue : dimmedColor(COLORS.gangaBlue)} />
                ))}
                <LabelList dataKey="amount" position="right" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${(Number(v) / 1000).toFixed(0)}K`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Capital vs Revenue Expenditure */}
      <div className="mt-6">
        <ChartCard
          title="Capital spending hovers below 15% of the budget"
          subtitle="Recurring vs asset-building expenditure over time"
          source="PRS India, WB Finance Department"
          insight="The rest is recurring — salaries, pensions, interest, subsidies. Capital expenditure builds the roads, hospitals, and power lines that drive long-term growth, but it's the first thing compressed when fiscal pressure rises."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capRevData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={55} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()} Cr`} />
              <Bar dataKey="Revenue Expenditure" stackId="exp" fill={dimmedColor(COLORS.shantiniketan)} />
              <Bar dataKey="Capital Expenditure" stackId="exp" fill={COLORS.gangaBlue} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.shantiniketan }} /> Revenue (recurring)</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.gangaBlue }} /> Capital (asset-building)</span>
          </div>
        </ChartCard>
      </div>

      {/* Fiscal Indicators — direct end labels + reference line for FRBM target */}
      <div className="mt-6">
        <ChartCard
          title="Debt-to-GSDP is falling as GSDP outgrows borrowings"
          subtitle="Deficit and debt as a share of GSDP (%)"
          source="PRS India, CAG Audit Reports"
          insight="Fiscal deficit hovers near the FRBM 3% target. Debt-to-GSDP — elevated but declining — is rebuilding fiscal headroom quietly, without austerity."
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fiscalData} margin={{ top: 20, right: 110, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <ReferenceLine y={3} stroke={COLORS.sundarbansGreen} strokeDasharray="5 5" label={{ value: 'FRBM target 3%', position: 'insideBottomRight', fontSize: 9, fill: COLORS.sundarbansGreen }} />
              <Line type="monotone" dataKey="Debt / GSDP" stroke={COLORS.gangaBlue} strokeWidth={2} dot>
                <LabelList dataKey="Debt / GSDP" position="right" fontSize={10} fill={COLORS.gangaBlue} formatter={(v: unknown) => (v === latestFiscalRow['Debt / GSDP'] ? `Debt ${v}%` : '')} />
              </Line>
              <Line type="monotone" dataKey="Fiscal Deficit" stroke={COLORS.durgaVermillion} strokeWidth={2} dot>
                <LabelList dataKey="Fiscal Deficit" position="right" fontSize={10} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === latestFiscalRow['Fiscal Deficit'] ? `FD ${v}%` : '')} />
              </Line>
              <Line type="monotone" dataKey="Revenue Deficit" stroke={COLORS.mustardYellow} strokeWidth={2} dot>
                <LabelList dataKey="Revenue Deficit" position="right" fontSize={10} fill={COLORS.mustardYellow} formatter={(v: unknown) => (v === latestFiscalRow['Revenue Deficit'] ? `RD ${v}%` : '')} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
