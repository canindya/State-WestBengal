'use client';
import { useTranslation } from '@/i18n/useTranslation';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  data?: Record<string, unknown>[];
  filename?: string;
}

function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(','))
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ChartCard({ title, subtitle, children, className = '', data, filename }: ChartCardProps) {
  const { t } = useTranslation();
  return (
    <div className={`rounded-xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-1">{title}</h3>
        </div>
        {data && data.length > 0 && (
          <button
            onClick={() => downloadCSV(data, filename || slugify(title))}
            className="shrink-0 text-xs text-muted hover:text-foreground border border-border rounded px-2 py-0.5 transition-colors cursor-pointer"
            title={t('common.downloadCsvTitle')}
          >
            {t('common.downloadCsv')}
          </button>
        )}
      </div>
      {subtitle && <p className="text-sm text-muted mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}
