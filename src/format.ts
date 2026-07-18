// Number / unit / duration formatting, locale-aware.
import type { HomeAssistant, HassEntity } from './ha';
import { numeric, unitOf, isUnavailable } from './ha';

function locale(hass?: HomeAssistant): string {
  return hass?.locale?.language ?? hass?.language ?? 'de';
}

export function fmtNumber(
  hass: HomeAssistant | undefined,
  value: number,
  precision?: number
): string {
  if (!Number.isFinite(value)) return '–';
  const opts: Intl.NumberFormatOptions = {};
  if (precision !== undefined) {
    opts.minimumFractionDigits = precision;
    opts.maximumFractionDigits = precision;
  } else {
    opts.maximumFractionDigits = 1;
  }
  try {
    return new Intl.NumberFormat(locale(hass), opts).format(value);
  } catch {
    return String(value);
  }
}

export function joinUnit(value: string, unit?: string): string {
  if (!unit) return value;
  // no space before % / °, space before everything else
  const glued = ['%'].includes(unit);
  return glued ? `${value}${unit}` : `${value} ${unit}`;
}

/**
 * Format an entity's state for display: numeric with sensible precision +
 * its unit, or the raw/translated state for non-numeric entities.
 */
export function fmtState(
  hass: HomeAssistant,
  st: HassEntity | undefined,
  opts: {
    precision?: number;
    unit?: string;
    unavailable?: string;
    attribute?: string;
  } = {}
): string {
  if (isUnavailable(st)) return opts.unavailable ?? '—';
  const n = numeric(st, opts.attribute);
  if (Number.isFinite(n)) {
    return joinUnit(fmtNumber(hass, n, opts.precision), opts.unit ?? unitOf(st));
  }
  if (opts.attribute && st) {
    const raw = st.attributes?.[opts.attribute];
    if (raw !== undefined && raw !== null) return String(raw);
  }
  // let HA translate device_class states when it can
  if (hass.formatEntityState && st) {
    try {
      return hass.formatEntityState(st);
    } catch {
      /* ignore */
    }
  }
  return st ? st.state : opts.unavailable ?? '—';
}

/** Human readable duration from seconds ("7 h 12 min"). */
export function fmtDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return '–';
  const s = Math.max(0, Math.round(seconds));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const parts: string[] = [];
  if (d) parts.push(`${d} d`);
  if (h) parts.push(`${h} h`);
  if (m || parts.length === 0) parts.push(`${m} min`);
  return parts.slice(0, 2).join(' ');
}

/** Compass point (N, NO, O, …) from a heading in degrees. */
export function compass(deg: number, lang: 'de' | 'en' = 'de'): string {
  if (!Number.isFinite(deg)) return '';
  const de = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  const en = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return (lang === 'de' ? de : en)[idx];
}

/** Latitude/longitude as a short human string. */
export function fmtCoord(lat?: number, lon?: number): string {
  if (!Number.isFinite(lat as number) || !Number.isFinite(lon as number)) return '';
  const f = (v: number) => v.toFixed(4);
  return `${f(lat as number)}, ${f(lon as number)}`;
}
