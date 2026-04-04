interface StatCardProps {
  label: string;
  value: string | number;
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

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 hover:bg-card-hover transition-colors" title={tooltip}>
      <p className="text-xs sm:text-sm text-muted">{label}</p>
      <p className={`text-lg sm:text-xl md:text-2xl font-bold ${textColor} break-words`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
    </div>
  );
}
