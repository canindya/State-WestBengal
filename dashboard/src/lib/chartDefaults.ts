// Shared Recharts prop spreads — SWD-inspired decluttering.
// Spread these into XAxis, YAxis, CartesianGrid etc. to get consistent,
// quiet chart chrome across every chart in the dashboard.

export const AXIS_PROPS = {
  tick: { fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

export const AXIS_PROPS_SMALL = {
  tick: { fontSize: 9 },
  tickLine: false,
  axisLine: false,
} as const;

export const GRID_PROPS = {
  strokeDasharray: '3 3',
  vertical: false,
  stroke: 'var(--bdr)',
} as const;

// Use for horizontal bar charts (where the value axis is x): grid lines should be vertical.
export const GRID_PROPS_VERTICAL = {
  strokeDasharray: '3 3',
  horizontal: false,
  stroke: 'var(--bdr)',
} as const;
