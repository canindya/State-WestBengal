// West Bengal-inspired color palette
export const COLORS = {
  // Primary palette
  sundarbansGreen: '#2D7D46',   // Sundarbans mangrove forests
  gangaBlue: '#2B6E99',         // Ganga/Hooghly river system
  shantiniketan: '#C4873B',     // Laterite earth of Birbhum
  durgaVermillion: '#D94F3D',   // Durga Puja sindoor
  mustardYellow: '#D4A824',     // Bengal's mustard fields
  terracottaBrown: '#A0522D',   // Bishnupur terracotta temples
  twilightPurple: '#7B68AE',    // Evening sky accent
  teaGreen: '#5A8F6A',          // Darjeeling tea gardens

  // Chart colors
  chart: [
    '#2B6E99',  // Ganga blue
    '#C4873B',  // Shantiniketan
    '#2D7D46',  // Sundarbans green
    '#D4A824',  // Mustard yellow
    '#D94F3D',  // Durga vermillion
    '#7B68AE',  // Twilight purple
    '#5A8F6A',  // Tea green
    '#A0522D',  // Terracotta brown
  ],

  // AQI colors (WHO breakpoints)
  aqi: {
    good: '#4CAF50',          // 0-50
    moderate: '#FFC107',      // 51-100
    unhealthySensitive: '#FF9800',  // 101-200
    unhealthy: '#F44336',     // 201-300
    veryUnhealthy: '#9C27B0', // 301-400
    hazardous: '#7B1FA2',     // 401-500
  },

  // Temperature anomaly (warming stripes)
  warming: {
    cold: '#053061',
    coolDark: '#2166AC',
    cool: '#4393C3',
    coolLight: '#92C5DE',
    neutral: '#F7F7F7',
    warmLight: '#F4A582',
    warm: '#D6604D',
    warmDark: '#B2182B',
    hot: '#67001F',
  },

  // Background and text
  bg: {
    primary: '#0F1419',
    secondary: '#1A2332',
    card: '#1E2A3A',
    cardHover: '#243447',
  },
  text: {
    primary: '#E8EAED',
    secondary: '#9AA0A6',
    muted: '#6B7280',
  },
  border: '#2D3748',
};

// Theme-aware Recharts props (read CSS variables at render time)
export function getTooltipStyle(): React.CSSProperties {
  if (typeof window === 'undefined') return { backgroundColor: '#1E2A3A', border: '1px solid #2D3748', borderRadius: 8, color: '#E8EAED' };
  const s = getComputedStyle(document.documentElement);
  return {
    backgroundColor: s.getPropertyValue('--tooltip-bg').trim() || '#1E2A3A',
    border: `1px solid ${s.getPropertyValue('--tooltip-border').trim() || '#2D3748'}`,
    borderRadius: 8,
    color: s.getPropertyValue('--tooltip-text').trim() || '#E8EAED',
  };
}

export function getGridColor(): string {
  if (typeof window === 'undefined') return '#2D3748';
  return getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || '#2D3748';
}

export function getAxisColor(): string {
  if (typeof window === 'undefined') return '#9AA0A6';
  return getComputedStyle(document.documentElement).getPropertyValue('--chart-axis').trim() || '#9AA0A6';
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return COLORS.aqi.good;
  if (aqi <= 100) return COLORS.aqi.moderate;
  if (aqi <= 200) return COLORS.aqi.unhealthySensitive;
  if (aqi <= 300) return COLORS.aqi.unhealthy;
  if (aqi <= 400) return COLORS.aqi.veryUnhealthy;
  return COLORS.aqi.hazardous;
}

export function getAQILabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Unhealthy (Sensitive)';
  if (aqi <= 300) return 'Unhealthy';
  if (aqi <= 400) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Return an array of palette colours where every index is dimmed (40% opacity
 * via an 8-bit hex alpha suffix) except `highlightIndex`, which is rendered at
 * full opacity. This is the SWD focus-attention pattern — one element bright,
 * everything else quiet — but expressed through the Bengal palette rather
 * than a neutral grey, so cultural identity is preserved.
 *
 * Usage:
 *   {data.map((_, i) => (
 *     <Cell key={i} fill={highlightColors(data.length, highlightIdx)[i]} />
 *   ))}
 */
export function highlightColors(
  count: number,
  highlightIndex: number = -1,
  palette: readonly string[] = COLORS.chart,
): string[] {
  return Array.from({ length: count }, (_, i) => {
    const base = palette[i % palette.length];
    if (i === highlightIndex) return base;
    return base + '66'; // 0x66 = 102/255 = ~40% opacity
  });
}

/**
 * Return an array of palette colours where entries matching `predicate` are
 * rendered full-opacity and the rest are dimmed to 40%. Useful when the
 * highlighted entry is identified by data content (e.g. "the Kolkata row")
 * rather than by index.
 */
export function highlightColorsBy<T>(
  items: T[],
  predicate: (item: T, index: number) => boolean,
  palette: readonly string[] = COLORS.chart,
): string[] {
  return items.map((item, i) => {
    const base = palette[i % palette.length];
    return predicate(item, i) ? base : base + '66';
  });
}

/**
 * Dim a single base colour to ~40% via an 8-bit hex alpha suffix.
 * Use for cases where every bar uses the SAME palette colour but the
 * highlighted one should pop and the rest recede.
 */
export function dimmedColor(hex: string): string {
  return hex + '66';
}

export function getWarmingColor(anomaly: number): string {
  const { warming } = COLORS;
  if (anomaly < -1.5) return warming.cold;
  if (anomaly < -1.0) return warming.coolDark;
  if (anomaly < -0.5) return warming.cool;
  if (anomaly < -0.2) return warming.coolLight;
  if (anomaly < 0.2) return warming.neutral;
  if (anomaly < 0.5) return warming.warmLight;
  if (anomaly < 1.0) return warming.warm;
  if (anomaly < 1.5) return warming.warmDark;
  return warming.hot;
}
