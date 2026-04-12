const DASH = '\u2014';

function isNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

export function fmtNum(n: number | null | undefined, digits = 0): string {
  if (!isNum(n)) return DASH;
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtCompact(n: number | null | undefined): string {
  if (!isNum(n)) return DASH;
  const abs = Math.abs(n);
  if (abs >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${(n / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return fmtNum(n);
}

export function fmtInr(n: number | null | undefined): string {
  if (!isNum(n)) return DASH;
  return `\u20B9${fmtCompact(n)}`;
}

export function fmtLakhCr(n: number | null | undefined): string {
  if (!isNum(n)) return DASH;
  return `\u20B9${n.toFixed(2)}L Cr`;
}

export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (!isNum(n)) return DASH;
  return `${n.toFixed(digits)}%`;
}

export function fmtMillion(n: number | null | undefined, digits = 2): string {
  if (!isNum(n)) return DASH;
  return `${n.toFixed(digits)}M`;
}

export function fmtAxis(n: number | null | undefined): string {
  if (!isNum(n)) return '';
  return fmtCompact(n);
}
