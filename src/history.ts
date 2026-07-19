import type { Aggregate } from './types';
import type { HomeAssistant } from './ha';

export interface HistoryPoint {
  /** epoch millis */
  t: number;
  v: number;
}

export type HistoryMap = Record<string, HistoryPoint[]>;

interface WsHistoryState {
  s: string;
  lu: number;
}

/**
 * Fetches recorder history for the given entities via the websocket API.
 * Returns numeric points only; non-numeric states are dropped.
 */
export async function fetchHistory(
  hass: HomeAssistant,
  entityIds: string[],
  days: number
): Promise<HistoryMap> {
  if (!entityIds.length) return {};
  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const resp = await hass.callWS<Record<string, WsHistoryState[]>>({
    type: 'history/history_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: entityIds,
    minimal_response: true,
    no_attributes: true,
  });

  const out: HistoryMap = {};
  for (const id of entityIds) {
    out[id] = (resp?.[id] ?? [])
      .map((p) => ({ t: p.lu * 1000, v: parseFloat(p.s) }))
      .filter((p) => Number.isFinite(p.v));
  }
  return out;
}

/**
 * Buckets history points into one value per day (last `days` days incl. today).
 * Days without data are NaN.
 */
export function bucketDaily(
  points: HistoryPoint[],
  days: number,
  aggregate: Aggregate
): number[] {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const windowStart = dayStart.getTime() - (days - 1) * 86400000;

  const buckets: number[][] = Array.from({ length: days }, () => []);
  for (const p of points) {
    const idx = Math.floor((p.t - windowStart) / 86400000);
    if (idx >= 0 && idx < days) buckets[idx].push(p.v);
  }

  return buckets.map((vals) => {
    if (!vals.length) return NaN;
    switch (aggregate) {
      case 'min':
        return Math.min(...vals);
      case 'max':
        return Math.max(...vals);
      case 'sum':
        return vals.reduce((a, b) => a + b, 0);
      case 'last':
        return vals[vals.length - 1];
      default:
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    }
  });
}

export interface StatsRow {
  /** bucket start, epoch millis */
  start: number;
  mean: number | null;
  min: number | null;
  max: number | null;
  state: number | null;
  sum: number | null;
}

export type StatsMap = Record<string, StatsRow[]>;

export type StatsPeriod = 'day' | 'month';

/**
 * Fetches daily or monthly long-term statistics — unlike recorder history
 * these survive the purge window, so month/year/max ranges keep working.
 */
export async function fetchStats(
  hass: HomeAssistant,
  entityIds: string[],
  count: number,
  period: StatsPeriod = 'day'
): Promise<StatsMap> {
  if (!entityIds.length) return {};
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (period === 'month') {
    start.setDate(1);
    start.setMonth(start.getMonth() - (count - 1));
  } else {
    start.setDate(start.getDate() - (count - 1));
  }

  const resp = await hass.callWS<Record<string, Record<string, unknown>[]>>({
    type: 'recorder/statistics_during_period',
    start_time: start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: entityIds,
    period,
    types: ['mean', 'min', 'max', 'state', 'sum'],
  });

  const num = (x: unknown): number | null =>
    typeof x === 'number' && Number.isFinite(x) ? x : null;
  const out: StatsMap = {};
  for (const id of entityIds) {
    out[id] = (resp?.[id] ?? []).map((r) => ({
      start:
        typeof r.start === 'number' ? r.start : new Date(r.start as string).getTime(),
      mean: num(r.mean),
      min: num(r.min),
      max: num(r.max),
      state: num(r.state),
      sum: num(r.sum),
    }));
  }
  return out;
}

function statsValue(r: StatsRow, aggregate: Aggregate): number | null {
  return aggregate === 'min'
    ? r.min
    : aggregate === 'max' || aggregate === 'sum'
      ? (r.max ?? r.mean)
      : aggregate === 'last'
        ? (r.state ?? r.mean)
        : r.mean;
}

/** Maps statistics rows onto day or month buckets (newest bucket = current). */
export function bucketsFromStats(
  rows: StatsRow[],
  count: number,
  aggregate: Aggregate,
  period: StatsPeriod = 'day'
): number[] {
  const out: number[] = new Array(count).fill(NaN);
  if (period === 'month') {
    const now = new Date();
    const endIdx = now.getFullYear() * 12 + now.getMonth();
    for (const r of rows) {
      const d = new Date(r.start);
      const idx = d.getFullYear() * 12 + d.getMonth() - (endIdx - (count - 1));
      if (idx < 0 || idx >= count) continue;
      const v = statsValue(r, aggregate);
      if (v !== null) out[idx] = v;
    }
    return out;
  }
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const windowStart = dayStart.getTime() - (count - 1) * 86400000;
  for (const r of rows) {
    const idx = Math.floor((r.start - windowStart) / 86400000);
    if (idx < 0 || idx >= count) continue;
    const v = statsValue(r, aggregate);
    if (v !== null) out[idx] = v;
  }
  return out;
}

/** Buckets raw history into one value per hour (last `hours` hours). */
export function bucketHourly(
  points: HistoryPoint[],
  hours: number,
  aggregate: Aggregate
): number[] {
  const hourStart = new Date();
  hourStart.setMinutes(0, 0, 0);
  const windowStart = hourStart.getTime() - (hours - 1) * 3600000;
  const buckets: number[][] = Array.from({ length: hours }, () => []);
  for (const p of points) {
    const idx = Math.floor((p.t - windowStart) / 3600000);
    if (idx >= 0 && idx < hours) buckets[idx].push(p.v);
  }
  return buckets.map((vals) => {
    if (!vals.length) return NaN;
    switch (aggregate) {
      case 'min':
        return Math.min(...vals);
      case 'max':
        return Math.max(...vals);
      case 'sum':
        return vals.reduce((a, b) => a + b, 0);
      case 'last':
        return vals[vals.length - 1];
      default:
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    }
  });
}

/** Forward- and back-fills NaN gaps so line charts stay continuous. */
export function fillGaps(values: number[]): number[] {
  const out = [...values];
  let last = NaN;
  for (let i = 0; i < out.length; i++) {
    if (Number.isFinite(out[i])) last = out[i];
    else out[i] = last;
  }
  let next = NaN;
  for (let i = out.length - 1; i >= 0; i--) {
    if (Number.isFinite(out[i])) next = out[i];
    else out[i] = next;
  }
  return out;
}

/** First → last change across the (filled) values; NaN when not computable. */
export function trendDelta(values: number[]): number {
  const finite = values.filter(Number.isFinite);
  if (finite.length < 2) return NaN;
  return finite[finite.length - 1] - finite[0];
}
