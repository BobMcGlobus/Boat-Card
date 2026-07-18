// Per-section-type defaults (icon, accent colour, name key), mirroring the
// PRESETS table in HealthCard.
import type { SectionType } from './types';

export interface SectionPreset {
  icon: string;
  color: string;
  /** i18n key for the default name */
  nameKey: string;
}

export const SECTION_PRESETS: Record<SectionType, SectionPreset> = {
  boat: { icon: 'mdi:sail-boat', color: '#5b7cfa', nameKey: 'boat' },
  battery: { icon: 'mdi:car-battery', color: '#34c759', nameKey: 'battery' },
  solar: { icon: 'mdi:solar-power-variant', color: '#f5a623', nameKey: 'solar' },
  fridge: { icon: 'mdi:fridge-outline', color: '#2aa5c7', nameKey: 'fridge' },
  camera: { icon: 'mdi:cctv', color: '#6d8bff', nameKey: 'camera' },
  grafana: { icon: 'mdi:chart-areaspline', color: '#f46800', nameKey: 'grafana' },
  sensor: { icon: 'mdi:gauge', color: '#5b7cfa', nameKey: 'sensor' },
};
