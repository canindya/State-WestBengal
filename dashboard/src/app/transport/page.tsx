'use client';

import { useEffect, useState } from 'react';
import { loadTransport } from '@/lib/data';
import type { TransportData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

export default function TransportPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<TransportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransport()
      .then(setData)
      .catch(e => { console.error('Transport load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading transport data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('transport.loading')}</div>;

  const totalRoadLength = data.roadNetwork.reduce((s, r) => s + r.length, 0);
  const latestVehicles = data.vehicleRegistration[data.vehicleRegistration.length - 1];
  const latestAccidents = data.accidents[data.accidents.length - 1];
  const totalDailyRiders = data.publicTransport.reduce((s, p) => s + p.dailyRidership, 0);

  // Road network sorted — the longest (village roads) should be first
  const roadSorted = [...data.roadNetwork].sort((a, b) => b.length - a.length);
  const topRoadIndex = 0;

  const vehicleTrend = data.vehicleRegistration.map(v => ({
    year: v.year.toString(),
    'Two Wheeler': v.twoWheeler / 1000000,
    Car: v.car / 1000000,
    Commercial: v.commercial / 1000000,
  }));

  const evTrend = data.vehicleRegistration.map(v => ({
    year: v.year.toString(),
    'EV Registrations': v.ev,
  }));

  const latestVehicleTrend = vehicleTrend[vehicleTrend.length - 1];

  const accidentTrend = data.accidents.map(a => ({
    year: a.year.toString(),
    Accidents: a.total,
    Deaths: a.deaths,
    Injuries: a.injuries,
  }));
  const latestAccidentTrend = accidentTrend[accidentTrend.length - 1];

  return (
    <div>
      <PageHeader
        title={t('transport.pageTitle')}
        description={t('transport.pageDesc')}
        accent="terracotta"
        story="Road connectivity in West Bengal is broad — over 300,000 kilometres across highways, district, and village roads — and village roads carry most of the actual movement. Two-wheelers dominate vehicle registrations; EVs are tiny but growing vertically. Road fatalities are slowly declining, but the injury count remains high. This page traces where people and goods actually move."
      />

      {/* Stat cards — cooled to 2 colours: terracotta (page accent) + ganga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Road Network" value={`${(totalRoadLength / 1000).toFixed(0)}K km`} subtitle="NH + SH + District + Village" color="terracotta" />
        <StatCard label="Registered Vehicles" value={`${(latestVehicles.total / 1000000).toFixed(1)}M`} subtitle={latestVehicles.year.toString()} color="ganga" />
        <StatCard label="EV Registrations" value={latestVehicles.ev.toLocaleString()} subtitle={`${latestVehicles.year} (growing rapidly)`} color="terracotta" />
        <StatCard label="Daily PT Ridership" value={`${(totalDailyRiders / 1000000).toFixed(1)}M`} subtitle="All public transport modes" color="ganga" />
        <StatCard label="Road Accidents" value={latestAccidents.total.toLocaleString()} subtitle={latestAccidents.year.toString()} color="terracotta" />
        <StatCard label="Road Deaths" value={latestAccidents.deaths.toLocaleString()} subtitle={latestAccidents.year.toString()} color="ganga" />
      </div>

      {/* Road Network Breakdown */}
      <ChartCard
        title="Village and district roads do the heavy lifting"
        subtitle="Road network length by category, kilometres"
        source="MoRTH — Basic Road Statistics of India"
        insight="National and state highways are a small fraction of the total network. Their maintenance quality is what determines how fast goods and people move — and rural road quality is where the real freight-cost savings sit."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roadSorted} layout="vertical" margin={{ top: 10, right: 70, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID_PROPS_VERTICAL} />
            <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K km`} />
            <YAxis type="category" dataKey="type" width={110} {...AXIS_PROPS} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => `${Number(v).toLocaleString()} km`} />
            <Bar dataKey="length" radius={[0, 4, 4, 0]}>
              {roadSorted.map((_, i) => (
                <Cell key={i} fill={i === topRoadIndex ? COLORS.terracottaBrown : dimmedColor(COLORS.terracottaBrown)} />
              ))}
              <LabelList dataKey="length" position="right" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${(Number(v) / 1000).toFixed(0)}K`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Vehicle Registration Trend — direct end labels instead of legend */}
        <ChartCard
          title="Two-wheelers remain the workhorse of mobility"
          subtitle="Cumulative registrations in millions, 2018 → 2024"
          source="VAHAN Dashboard, MoRTH"
          insight="Car growth is steady but modest. Commercial vehicles are the quietest segment, consistent with relatively flat freight growth. The stacked area under-shows the two-wheeler dominance because it's so large."
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={vehicleTrend} margin={{ top: 10, right: 100, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}M`} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(2)}M`} />
              <Area type="monotone" dataKey="Two Wheeler" stackId="v" stroke={COLORS.gangaBlue} fill={COLORS.gangaBlue} fillOpacity={0.5}>
                <LabelList dataKey="Two Wheeler" position="right" fontSize={10} fill={COLORS.gangaBlue} formatter={(v: unknown) => (v === latestVehicleTrend['Two Wheeler'] ? `2W ${Number(v).toFixed(1)}M` : '')} />
              </Area>
              <Area type="monotone" dataKey="Car" stackId="v" stroke={COLORS.shantiniketan} fill={COLORS.shantiniketan} fillOpacity={0.5} />
              <Area type="monotone" dataKey="Commercial" stackId="v" stroke={COLORS.sundarbansGreen} fill={COLORS.sundarbansGreen} fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.gangaBlue }} /> Two-wheeler</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.shantiniketan }} /> Car</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.sundarbansGreen }} /> Commercial</span>
          </div>
        </ChartCard>

        {/* EV Adoption — highlight latest year */}
        <ChartCard
          title="EV adoption is vertical off a tiny base"
          subtitle="Electric vehicle registrations per year"
          source="VAHAN Dashboard"
          insight="EVs are still a rounding error in the total fleet. But the growth curve is almost vertical — exponential off a tiny base is how every auto disruption starts."
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={evTrend} margin={{ top: 30, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="EV Registrations" radius={[4, 4, 0, 0]}>
                {evTrend.map((_, i) => (
                  <Cell key={i} fill={i === evTrend.length - 1 ? COLORS.sundarbansGreen : dimmedColor(COLORS.sundarbansGreen)} />
                ))}
                <LabelList dataKey="EV Registrations" position="top" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${(Number(v) / 1000).toFixed(0)}K`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Public Transport — single accent colour instead of 6 */}
      <div className="mt-6">
        <ChartCard
          title="Suburban rail carries most of Kolkata's daily riders"
          subtitle="Public transport fleet and daily ridership by mode"
          source="WB Transport Department"
          insight="Suburban rail and the Kolkata Metro together move millions every day — the backbone of the city's mobility. Buses carry the quieter majority state-wide. The ratio is the planning brief: more rail, not more roads."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.publicTransport.map((pt) => (
              <div key={pt.mode} className="rounded-lg border border-border bg-card-hover p-4">
                <p className="text-sm font-semibold text-terracotta">{pt.mode}</p>
                <p className="text-2xl font-bold mt-1">{pt.fleet.toLocaleString()}</p>
                <p className="text-xs text-muted">vehicles/coaches</p>
                <p className="text-lg font-semibold mt-2">{(pt.dailyRidership / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted">daily riders</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Road Accidents — direct end labels */}
      <div className="mt-6">
        <ChartCard
          title="Fatalities are slowly declining — injuries remain stubborn"
          subtitle="Road accident outcomes per year"
          source="MoRTH — Road Accidents in India"
          insight="Two-wheeler riders and pedestrians — India's most vulnerable road users — bear the brunt. Infrastructure for them (pavement, signage, crossings) is the fastest lever; it's also the cheapest."
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={accidentTrend} margin={{ top: 20, right: 100, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Line type="monotone" dataKey="Injuries" stroke={COLORS.gangaBlue} strokeWidth={2} dot>
                <LabelList dataKey="Injuries" position="right" fontSize={10} fill={COLORS.gangaBlue} formatter={(v: unknown) => (v === latestAccidentTrend.Injuries ? `Injuries ${(Number(v) / 1000).toFixed(0)}K` : '')} />
              </Line>
              <Line type="monotone" dataKey="Accidents" stroke={COLORS.shantiniketan} strokeWidth={2} dot>
                <LabelList dataKey="Accidents" position="right" fontSize={10} fill={COLORS.shantiniketan} formatter={(v: unknown) => (v === latestAccidentTrend.Accidents ? `Accidents ${(Number(v) / 1000).toFixed(0)}K` : '')} />
              </Line>
              <Line type="monotone" dataKey="Deaths" stroke={COLORS.durgaVermillion} strokeWidth={2} dot>
                <LabelList dataKey="Deaths" position="right" fontSize={10} fill={COLORS.durgaVermillion} formatter={(v: unknown) => (v === latestAccidentTrend.Deaths ? `Deaths ${(Number(v) / 1000).toFixed(0)}K` : '')} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
