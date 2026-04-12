import { fmtCompact } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: string | number | null | undefined;
  subtitle?: string;
  color?: string;
  tooltip?: string;
}

export default function StatCard({ label, value, subtitle, color = 'ganga', tooltip }: StatCardProps) {
  const textColor = {
    ganga: 'text-ganga',
    sundarbans: 'text-sundarbans',
    shantiniketan: 'text-shantiniketan',
    durga: 'text-durga',
    mustard: 'text-mustard',
    terracotta: 'text-terracotta',
    twilight: 'text-twilight',
    tea: 'text-tea',
  }[color] || 'text-ganga';

  const displayValue =
    typeof value === 'number'
      ? fmtCompact(value)
      : value == null || value === ''
        ? '\u2014'
        : value;

  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 hover:bg-card-hover transition-colors"
      title={tooltip}
    >
      <p className={`text-[11px] sm:text-xs text-muted uppercase tracking-wide ${tooltip ? 'pr-6' : ''}`}>{label}</p>
      {tooltip && (
        <span
          className="absolute top-3 right-3 w-4 h-4 rounded-full border border-border text-muted flex items-center justify-center text-[10px] font-semibold cursor-help hover:text-foreground hover:border-foreground transition-colors"
          aria-label={tooltip}
        >
          i
        </span>
      )}
      <p className={`mt-1 text-xl sm:text-2xl md:text-3xl font-bold tabular-nums ${textColor} break-words`}>
        {displayValue}
      </p>
      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
    </div>
  );
}
