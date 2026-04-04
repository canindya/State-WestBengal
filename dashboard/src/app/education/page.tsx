'use client';

import { useEffect, useState, useMemo } from 'react';
import { loadEducation } from '@/lib/data';
import type { EducationData } from '@/lib/types';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import ChartCard from '@/components/layout/ChartCard';
import { COLORS } from '@/lib/colors';
import { useTranslation } from '@/i18n/useTranslation';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
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

  // Management split for pie
  const managementSplit = [
    { name: 'Government', value: govtSchools },
    { name: 'Private', value: totalSchools - govtSchools },
  ];

  // Learning outcomes: WB vs National
  const learningComparison = data.learningOutcomes;

  return (
    <div>
      <PageHeader
        title={t('education.pageTitle')}
        description={t('education.pageDesc')}
        accent="mustard"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Schools" value={totalSchools.toLocaleString()} subtitle="All levels combined" color="mustard" />
        <StatCard label="Total Enrollment" value={`${(totalEnrollment / 1000000).toFixed(1)}M`} subtitle="Students across all levels" color="ganga" />
        <StatCard label="Government Schools" value={`${govtPct}%`} subtitle={`${govtSchools.toLocaleString()} schools`} color="sundarbans" />
        <StatCard label="Computer Labs" value={`${data.infrastructure.find(i => i.metric === 'Computer Lab')?.percentage || 0}%`} subtitle="Schools with computer labs" color="twilight" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Type */}
        <ChartCard title="Schools by Type & Management" subtitle="Government vs private schools at each level" data={schoolsByType as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={schoolsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              <Legend />
              <Bar dataKey="Government" fill={COLORS.gangaBlue} />
              <Bar dataKey="Private" fill={COLORS.shantiniketan} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Enrollment by Level */}
        <ChartCard title="Enrollment by Level & Gender" subtitle="Students in thousands (boys vs girls)" data={enrollmentByLevel as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={enrollmentByLevel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `${v}K`} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(0)}K students`} />
              <Legend />
              <Bar dataKey="Boys" fill={COLORS.gangaBlue} />
              <Bar dataKey="Girls" fill={COLORS.durgaVermillion} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Infrastructure */}
      <div className="mt-6">
        <ChartCard title="School Infrastructure" subtitle="Percentage of schools with each facility (UDISE+ 2024-25)" data={data.infrastructure as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={[...data.infrastructure].sort((a, b) => b.percentage - a.percentage)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="metric" width={130} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percentage" name="% Schools" radius={[0, 4, 4, 0]}>
                {[...data.infrastructure].sort((a, b) => b.percentage - a.percentage).map((d, i) => (
                  <Cell key={i} fill={d.percentage >= 90 ? COLORS.sundarbansGreen : d.percentage >= 60 ? COLORS.mustardYellow : COLORS.durgaVermillion} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Learning Outcomes */}
        <ChartCard title="Learning Outcomes: WB vs National" subtitle="ASER 2024 — percentage of children achieving each benchmark" data={learningComparison as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={learningComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 80]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="indicator" width={170} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Bar dataKey="wb" name="West Bengal" fill={COLORS.gangaBlue} />
              <Bar dataKey="national" name="National Avg" fill={COLORS.shantiniketan} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Teacher Metrics */}
        <ChartCard title="Pupil-Teacher Ratio by District" subtitle="Lower is better (RTE norm: 30:1 for primary)" data={data.teacherMetrics as unknown as Record<string, unknown>[]}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={[...data.teacherMetrics].sort((a, b) => b.pupilTeacherRatio - a.pupilTeacherRatio)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="district" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="pupilTeacherRatio" name="Pupil-Teacher Ratio" radius={[0, 4, 4, 0]}>
                {[...data.teacherMetrics].sort((a, b) => b.pupilTeacherRatio - a.pupilTeacherRatio).map((d, i) => (
                  <Cell key={i} fill={d.pupilTeacherRatio > 40 ? COLORS.durgaVermillion : d.pupilTeacherRatio > 30 ? COLORS.mustardYellow : COLORS.sundarbansGreen} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Management Split Pie */}
      <div className="mt-6">
        <ChartCard title="School Management Distribution" subtitle="Government vs Private management across all school types">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={managementSplit}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
              >
                <Cell fill={COLORS.gangaBlue} />
                <Cell fill={COLORS.shantiniketan} />
              </Pie>
              <Tooltip formatter={(v) => Number(v).toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
