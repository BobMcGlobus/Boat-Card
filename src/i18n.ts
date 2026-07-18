// Tiny DE/EN string table. Cards default to the Home Assistant UI language.
import type { HomeAssistant } from './ha';

type Dict = Record<string, string>;

const DE: Dict = {
  boat: 'Boot',
  sensor: 'Sensor',
  state: 'Zustand',
  target: 'Sollwert',
  no_url: 'Keine URL konfiguriert',
  battery: 'Batterie',
  main_battery: 'Hauptbatterie',
  motor_battery: 'Motorbatterie',
  solar: 'Solar',
  solar_main: 'Solar Hauptmodul',
  solar_secondary: 'Solar Zweitmodul',
  yield_today: 'Ertrag heute',
  power_now: 'Leistung',
  voltage: 'Spannung',
  current: 'Strom',
  soc: 'Ladezustand',
  fridge: 'Kühlschrank',
  fridge_temp: 'Kühlschranktemperatur',
  temperature: 'Temperatur',
  water_temp: 'Wassertemperatur',
  camera: 'Kamera',
  depth: 'Echolot',
  nav_lights: 'Positionsbeleuchtung',
  camera_power: 'Kamera-Strom',
  speed: 'Geschwindigkeit',
  heading: 'Kurs',
  position: 'Position',
  on: 'An',
  off: 'Aus',
  unavailable: 'Nicht verfügbar',
  grafana: 'Grafana',
  open_grafana: 'Grafana öffnen',
  dock: 'Am Steg',
  sailing: 'Unter Segeln',
  trailer: 'Auf dem Anhänger',
  charging: 'lädt',
  discharging: 'entlädt',
  preset: 'Preset',
  move: 'Bewegen',
};

const EN: Dict = {
  boat: 'Boat',
  sensor: 'Sensor',
  state: 'State',
  target: 'Target',
  no_url: 'No URL configured',
  battery: 'Battery',
  main_battery: 'Main battery',
  motor_battery: 'Motor battery',
  solar: 'Solar',
  solar_main: 'Solar main array',
  solar_secondary: 'Solar secondary array',
  yield_today: 'Yield today',
  power_now: 'Power',
  voltage: 'Voltage',
  current: 'Current',
  soc: 'State of charge',
  fridge: 'Fridge',
  fridge_temp: 'Fridge temperature',
  temperature: 'Temperature',
  water_temp: 'Water temperature',
  camera: 'Camera',
  depth: 'Depth sounder',
  nav_lights: 'Navigation lights',
  camera_power: 'Camera power',
  speed: 'Speed',
  heading: 'Heading',
  position: 'Position',
  on: 'On',
  off: 'Off',
  unavailable: 'Unavailable',
  grafana: 'Grafana',
  open_grafana: 'Open Grafana',
  dock: 'At the dock',
  sailing: 'Sailing',
  trailer: 'On the trailer',
  charging: 'charging',
  discharging: 'discharging',
  preset: 'Preset',
  move: 'Move',
};

export function lang(hass?: HomeAssistant): 'de' | 'en' {
  const l = (hass?.locale?.language ?? hass?.language ?? 'de').toLowerCase();
  return l.startsWith('de') ? 'de' : 'en';
}

export function t(hass: HomeAssistant | undefined, key: string): string {
  const table = lang(hass) === 'de' ? DE : EN;
  return table[key] ?? key;
}
