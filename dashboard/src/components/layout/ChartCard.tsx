interface ChartCardProps {
  title: string;
  subtitle?: string;
  source?: string;
  insight?: string;
  children: React.ReactNode;
  className?: string;
  /** @deprecated kept for backward compatibility; CSV download has been removed */
  data?: Record<string, unknown>[];
  /** @deprecated kept for backward compatibility; CSV download has been removed */
  filename?: string;
}

export default function ChartCard({ title, subtitle, source, insight, children, className = '' }: ChartCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
      {insight && (
        <div className="mt-4 rounded-lg border-l-2 border-mustard bg-card-hover/60 px-3 py-2">
          <p className="text-xs leading-relaxed text-foreground">
            <span className="text-mustard font-semibold uppercase tracking-wide mr-1.5">So what?</span>
            {insight}
          </p>
        </div>
      )}
      {source && <p className="text-xs text-muted mt-3 opacity-70">Source: {source}</p>}
    </div>
  );
}
