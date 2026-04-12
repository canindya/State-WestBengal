'use client';

interface ComparisonRow {
  metric: string;
  wb: number;
  india: number;
  unit: string;
  higherIsBetter: boolean;
}

interface ComparisonBarProps {
  rows: ComparisonRow[];
}

export default function ComparisonBar({ rows }: ComparisonBarProps) {
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const max = Math.max(row.wb, row.india) * 1.15;
        const wbPct = (row.wb / max) * 100;
        const indiaPct = (row.india / max) * 100;
        const wbBetter = row.higherIsBetter ? row.wb > row.india : row.wb < row.india;
        const wbColor = wbBetter ? 'bg-sundarbans' : 'bg-durga';

        return (
          <div key={row.metric}>
            <p className="text-sm font-medium mb-2">{row.metric}</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xs w-16 shrink-0 text-muted">W Bengal</span>
                <div className="flex-1 h-6 rounded bg-card-hover relative overflow-hidden">
                  <div
                    className={`h-full ${wbColor} transition-all`}
                    style={{ width: `${wbPct}%` }}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold">
                    {row.wb}{row.unit}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs w-16 shrink-0 text-muted">India</span>
                <div className="flex-1 h-6 rounded bg-card-hover relative overflow-hidden">
                  <div
                    className="h-full bg-ganga transition-all"
                    style={{ width: `${indiaPct}%` }}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold">
                    {row.india}{row.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
