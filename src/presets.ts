// Per-section-type defaults (icon, accent colour, name key), mirroring the
// PRESETS table in HealthCard.
import type { SectionType, GraphType, TrendMode, Aggregate } from './types';

export interface SectionPreset {
  icon: string;
  color: string;
  /** i18n key for the default name */
  nameKey: string;
  graph?: GraphType;
  trend?: TrendMode;
  aggregate?: Aggregate;
}

export const SECTION_PRESETS: Record<SectionType, SectionPreset> = {
  boat: { icon: 'mdi:sail-boat', color: '#5b7cfa', nameKey: 'boat' },
  battery: { icon: 'mdi:car-battery', color: '#34c759', nameKey: 'battery', graph: 'line', trend: 'up_good' },
  solar: { icon: 'mdi:solar-power-variant', color: '#f5a623', nameKey: 'solar', graph: 'bar', trend: 'up_good' },
  weather: { icon: 'mdi:weather-partly-cloudy', color: '#2aa5c7', nameKey: 'weather' },
  forecast: { icon: 'mdi:calendar-clock', color: '#5b7cfa', nameKey: 'forecast' },
  radar: { icon: 'mdi:radar', color: '#5b7cfa', nameKey: 'radar' },
  fridge: { icon: 'mdi:fridge-outline', color: '#2aa5c7', nameKey: 'fridge' },
  camera: { icon: 'mdi:cctv', color: '#6d8bff', nameKey: 'camera' },
  grafana: { icon: 'mdi:chart-areaspline', color: '#f46800', nameKey: 'grafana' },
  sensor: { icon: 'mdi:gauge', color: '#5b7cfa', nameKey: 'sensor', graph: 'line', trend: 'neutral' },
};

/**
 * Maps Home Assistant weather condition strings to MDI icons (from
 * Weatherglass). `-night` variants are picked for clear/partly at night.
 */
export const CONDITION_ICONS: Record<string, string> = {
  'clear-night': 'mdi:weather-night',
  cloudy: 'mdi:weather-cloudy',
  fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail',
  lightning: 'mdi:weather-lightning',
  'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy',
  pouring: 'mdi:weather-pouring',
  rainy: 'mdi:weather-rainy',
  snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy',
  sunny: 'mdi:weather-sunny',
  windy: 'mdi:weather-windy',
  'windy-variant': 'mdi:weather-windy-variant',
  exceptional: 'mdi:weather-cloudy-alert',
};

export function conditionIcon(condition?: string, isDay = true): string {
  if (!condition) return isDay ? 'mdi:weather-partly-cloudy' : 'mdi:weather-night';
  if (!isDay) {
    if (condition === 'sunny') return 'mdi:weather-night';
    if (condition === 'partlycloudy') return 'mdi:weather-night-partly-cloudy';
  }
  return CONDITION_ICONS[condition] ?? 'mdi:weather-partly-cloudy';
}
