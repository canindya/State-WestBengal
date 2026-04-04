'use client';

import { useEffect, useState } from 'react';
import { loadTransport } from '@/lib/data';
import type { TransportData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
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

  // Vehicle registration trend
  const vehicleTrend = data.vehicleRegistration.map(v => ({
    year: v.year.toString(),
    'Two Wheeler': v.twoWheeler / 1000000,
    Car: v.car / 1000000,
    Commercial: v.commercial / 1000000,
  }));

  // EV adoption trend
  const evTrend = data.vehicleRegistration.map(v => ({
    year: v.year.toString(),
    'EV Registrations': v.ev,
  }));

  // Accident trend
  const accidentTrend = data.accidents.map(a => ({
    year: a.year.toString(),
    Accidents: a.total,
    Deaths: a.deaths,
    Injuries: a.injuries,
  }));

  return (
    <div>
      <PageHeader
        title={t('transport.pageTitle')}
        description={t('transport.pageDesc')}
        accent="terracotta"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Road Network" value={`${(totalRoadLength / 1000).toFixed(0)}K km`} subtitle="NH + SH + District + Village" color="terracotta" />
        <StatCard label="Registered Vehicles" value={`${(latestVehicles.total / 1000000).toFixed(1)}M`} subtitle={latestVehicles.year.toString()} color="ganga" />
        <StatCard label="EV Registrations" value={latestVehicles.ev.toLocaleString()} subtitle={`${latestVehicles.year} (growing rapidly)`} color="sundarbans" />
        <StatCard label="Daily PT Ridership" value={`${(totalDailyRiders / 1000000).toFixed(1)}M`} subtitle="All public transport modes" color="shantiniketan" />
        <StatCard label="Road Accidents" value={latestAccidents.total.toLocaleString()} subtitle={latestAccidents.year.toString()} color="durga" />
        <StatCard label="Road Deaths" value={latestAccidents.deaths.toLocaleString()} subtitle={latestAccidents.year.toString()} color="twilight" />
      </div>

      {/* Road Network Breakdown */}
      <ChartCard title="Road Network by Type" subtitle="Length in kilometers" data={data.roadNetwork as unknown as Record<string, unknown>[]}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.roadNetwork} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K km`} />
            <YAxis type="category" dataKey="type" width={150} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => `${Number(v).toLocaleString()} km`} />
            <Bar dataKey="length" name="Length (km)" radius={[0, 4, 4, 0]}>
              {data.roadNetwork.map((_, i) => (
                <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Vehicle Registration Trend */}
        <ChartCard title="Vehicle Registration Trend" subtitle="Vehicles in millions by type (2018-2024)" data={vehicleTrend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={vehicleTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}M`} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(2)}M`} />
              <Legend />
              <Area type="monotone" dataKey="Two Wheeler" stackId="v" stroke={COLORS.gangaBlue} fill={COLORS.gangaBlue} fillOpacity={0.5} />
              <Area type="monotone" dataKey="Car" stackId="v" stroke={COLORS.shantiniketan} fill={COLORS.shantiniketan} fillOpacity={0.5} />
              <Area type="monotone" dataKey="Commercial" stackId="v" stroke={COLORS.sundarbansGreen} fill={COLORS.sundarbansGreen} fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* EV Adoption */}
        <ChartCard title="Electric Vehicle Adoption" subtitle="EV registrations growing exponentially" data={evTrend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={evTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="EV Registrations" fill={COLORS.sundarbansGreen} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Public Transport */}
      <div className="mt-6">
        <ChartCard title="Public Transport Fleet & Ridership" subtitle="Major public transport modes in West Bengal" data={data.publicTransport as unknown as Record<string, unknown>[]}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.publicTransport.map((pt, i) => (
              <div key={pt.mode} className="rounded-lg border border-border bg-card-hover p-4">
                <p className="text-sm font-semibold" style={{ color: COLORS.chart[i % COLORS.chart.length] }}>{pt.mode}</p>
                <p className="text-2xl font-bold mt-1">{pt.fleet.toLocaleString()}</p>
                <p className="text-xs text-muted">vehicles/coaches</p>
                <p className="text-lg font-semibold mt-2">{(pt.dailyRidership / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted">daily riders</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Road Accidents */}
      <div className="mt-6">
        <ChartCard title="Road Accident Trends" subtitle="Total accidents, deaths, and injuries (2018-2023)" data={accidentTrend as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={accidentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="Accidents" stroke={COLORS.shantiniketan} strokeWidth={2} dot />
              <Line type="monotone" dataKey="Deaths" stroke={COLORS.durgaVermillion} strokeWidth={2} dot />
              <Line type="monotone" dataKey="Injuries" stroke={COLORS.gangaBlue} strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
