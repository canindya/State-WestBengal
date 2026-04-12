'use client';

import { useEffect, useState } from 'react';
import { loadEducation } from '@/lib/data';
import type { EducationData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS, dimmedColor } from '@/lib/colors';
import { AXIS_PROPS, GRID_PROPS, GRID_PROPS_VERTICAL } from '@/lib/chartDefaults';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

export default function EducationPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<EducationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEducation()
      .then(setData)
      .catch(e => { console.error('Education load error:', e); setError(e.message); });
  }, []);

  if (error) return <div className="text-center py-20"><p className="text-durga font-semibold">Error loading education data</p><p className="text-muted text-sm mt-2">{error}</p></div>;
  if (!data) return <div className="text-center py-20 text-muted">{t('education.loading')}</div>;

  const totalSchools = data.schools.reduce((s, d) => s + d.count, 0);
  const totalEnrollment = data.enrollment.reduce((s, d) => s + d.total, 0);
  const govtSchools = data.schools.filter(s => s.management === 'Government').reduce((s, d) => s + d.count, 0);
  const govtPct = ((govtSchools / totalSchools) * 100).toFixed(1);

  // Schools by type and management
  const schoolTypes = ['Primary', 'Upper Primary', 'Secondary', 'Higher Secondary'];
  const schoolsByType = schoolTypes.map(type => {
    const govt = data.schools.find(s => s.type === type && s.management === 'Government')?.count || 0;
    const pvt = data.schools.find(s => s.type === type && s.management === 'Private')?.count || 0;
    return { type, Government: govt, Private: pvt };
  });

  // Enrollment by level with gender
  const enrollmentByLevel = data.enrollment.map(e => ({
    level: e.level.split('(')[0].trim(),
    Boys: e.boys / 1000,
    Girls: e.girls / 1000,
  }));

  // Management split: pie → horizontal bar
  const managementSplit = [
    { name: 'Government', value: govtSchools },
    { name: 'Private', value: totalSchools - govtSchools },
  ];

  // Infrastructure sorted low-to-high (so gaps are visible at the top)
  const infraSorted = [...data.infrastructure].sort((a, b) => a.percentage - b.percentage);

  // Pupil-teacher ratio: worst first (most important)
  const ptrSorted = [...data.teacherMetrics].sort((a, b) => b.pupilTeacherRatio - a.pupilTeacherRatio);

  return (
    <div>
      <PageHeader
        title={t('education.pageTitle')}
        description={t('education.pageDesc')}
        accent="mustard"
        story="West Bengal's literacy rate has climbed past 82%, and its 67,000+ schools reach every district. But learning outcomes tell a harder story — on ASER reading and arithmetic benchmarks, WB still trails the national average. The system has solved access; the next decade is about solving quality."
      />

      {/* Stat cards — cooled to 2 colours: mustard (page accent) + ganga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Schools" value={totalSchools.toLocaleString()} subtitle="All levels combined" color="mustard" />
        <StatCard label="Total Enrollment" value={`${(totalEnrollment / 1000000).toFixed(1)}M`} subtitle="Students across all levels" color="ganga" />
        <StatCard label="Government Schools" value={`${govtPct}%`} subtitle={`${govtSchools.toLocaleString()} schools`} color="mustard" />
        <StatCard label="Computer Labs" value={`${data.infrastructure.find(i => i.metric === 'Computer Lab')?.percentage || 0}%`} subtitle="Schools with computer labs" color="ganga" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Type — grouped bars, private dimmed */}
        <ChartCard
          title="Government schools dominate every level"
          subtitle="School count by type and management"
          source="UDISE+ 2024-25"
          insight="Private provision is thin and concentrated in urban areas — meaning state capacity, not private choice, determines quality across most of the state."
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={schoolsByType} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="type" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="Government" fill={COLORS.mustardYellow} />
              <Bar dataKey="Private" fill={dimmedColor(COLORS.mustardYellow)} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.mustardYellow }} /> Government</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.mustardYellow }} /> Private</span>
          </div>
        </ChartCard>

        {/* Enrollment by Level */}
        <ChartCard
          title="Gender parity at primary — but drops at higher secondary"
          subtitle="Enrollment in thousands, boys vs girls"
          source="UDISE+ 2024-25"
          insight="Girls match or exceed boys in primary enrollment. The drop-off comes at secondary and higher secondary, where the gap reappears and fewer students continue at all — the real challenge is retention, not initial access."
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={enrollmentByLevel} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="level" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}K`} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(0)}K students`} />
              <Bar dataKey="Boys" fill={COLORS.gangaBlue} />
              <Bar dataKey="Girls" fill={COLORS.durgaVermillion} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.gangaBlue }} /> Boys</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.durgaVermillion }} /> Girls</span>
          </div>
        </ChartCard>
      </div>

      {/* Infrastructure */}
      <div className="mt-6">
        <ChartCard
          title="Basics are universal — the next-gen infrastructure lags"
          subtitle="School infrastructure coverage (%), lowest first"
          source="UDISE+ 2024-25"
          insight="Toilets, drinking water, and electricity are near-universal — that's the access story. Computer labs, internet, and libraries remain sparse — that's the quality frontier."
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={infraSorted} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" domain={[0, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="metric" width={130} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {infraSorted.map((d, i) => (
                  <Cell key={i} fill={d.percentage < 60 ? COLORS.durgaVermillion : d.percentage >= 90 ? COLORS.sundarbansGreen : dimmedColor(COLORS.mustardYellow)} />
                ))}
                <LabelList dataKey="percentage" position="right" fontSize={10} fill="var(--fg)" formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Learning Outcomes */}
        <ChartCard
          title="WB trails the national average on ASER benchmarks"
          subtitle="Learning outcomes (%), WB vs national average"
          source="ASER 2024"
          insight="The uncomfortable truth: literacy rate is high, but learning — the thing literacy is supposed to measure — still has a lot of ground to cover. These are the indicators that matter for tomorrow's workforce."
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.learningOutcomes} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" domain={[0, 80]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="indicator" width={130} {...AXIS_PROPS} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="wb" fill={COLORS.durgaVermillion} />
              <Bar dataKey="national" fill={dimmedColor(COLORS.gangaBlue)} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted justify-center">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: COLORS.durgaVermillion }} /> West Bengal</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded opacity-40" style={{ background: COLORS.gangaBlue }} /> National</span>
          </div>
        </ChartCard>

        {/* Teacher Metrics */}
        <ChartCard
          title="Pupil-teacher ratio is within norm across most districts"
          subtitle="Worst-first ranking; RTE norm for primary is 30:1"
          source="UDISE+ 2024-25"
          insight="Teacher deployment has equalised across the state. The spread is narrow, which is a genuine success — even if learning outcomes have not caught up to the improvement in staffing."
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ptrSorted} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} />
              <YAxis type="category" dataKey="district" width={120} {...AXIS_PROPS} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="pupilTeacherRatio" radius={[0, 4, 4, 0]}>
                {ptrSorted.map((d, i) => (
                  <Cell key={i} fill={d.pupilTeacherRatio > 40 ? COLORS.durgaVermillion : dimmedColor(COLORS.mustardYellow)} />
                ))}
                <LabelList dataKey="pupilTeacherRatio" position="right" fontSize={10} fill="var(--fg)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Management Split — pie → horizontal bar */}
      <div className="mt-6">
        <ChartCard
          title="4 in 5 schools are government-run"
          subtitle="Share of schools by management type"
          source="UDISE+ 2024-25"
          insight="Both a strength (universal access) and a vulnerability (quality depends entirely on state execution). Unlike states where private schools absorb a large share of demand, WB's quality story is almost entirely a public-sector story."
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={managementSplit} layout="vertical" margin={{ top: 10, right: 100, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID_PROPS_VERTICAL} />
              <XAxis type="number" {...AXIS_PROPS} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" width={110} {...AXIS_PROPS} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                <Cell fill={COLORS.mustardYellow} />
                <Cell fill={dimmedColor(COLORS.mustardYellow)} />
                <LabelList dataKey="value" position="right" fontSize={11} fill="var(--fg)" formatter={(v: unknown) => `${Number(v).toLocaleString()} schools`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
