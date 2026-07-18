// Configuration schemas for the whole Boat Card family.

export type CardStyle = 'default' | 'marine' | 'glass';
export type TapAction = 'more-info' | 'toggle' | 'link' | 'none';

/** The three graphical states of the boat. */
export type BoatVariant = 'dock' | 'sailing' | 'trailer';
export const BOAT_VARIANTS: BoatVariant[] = ['dock', 'sailing', 'trailer'];

/** 8-way placement of the label relative to its anchor dot. */
export type DotDir =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/** Where a chip sits for one particular boat image. */
export interface ChipPosition {
  /** percent of the image area (0–100) */
  x: number;
  y: number;
  /** label direction relative to the dot (default: right if x<50 else left) */
  dot?: DotDir;
  /** don't show this chip on this variant */
  hidden?: boolean;
}

/** A metric badge pinned onto the boat image, with a position per variant. */
export interface ChipConfig {
  entity: string;
  /** second entity, e.g. "12.6 V / 3.1 A" */
  entity2?: string;
  name?: string;
  icon?: string;
  color?: string;
  unit?: string;
  precision?: number;
  /** read an attribute instead of the state */
  attribute?: string;
  /** what a tap does (default: more-info) */
  tap_action?: TapAction;
  /** navigation path / url for tap_action: link */
  link?: string;
  /** per-variant placement; missing variants fall back to x/y/dot below */
  positions?: Partial<Record<BoatVariant, ChipPosition>>;
  /** shared fallback placement used when a variant has no entry */
  x?: number;
  y?: number;
  dot?: DotDir;
}

/** A tappable actor toggle in the controls row. */
export interface ControlConfig {
  entity: string;
  name?: string;
  icon?: string;
  /** icon shown when on (defaults to icon) */
  icon_on?: string;
}

/** A compact readout in the stats row. */
export interface StatConfig {
  entity: string;
  name?: string;
  icon?: string;
  unit?: string;
  precision?: number;
  attribute?: string;
  color?: string;
}

/** GPS sources for the overview footer. */
export interface GpsConfig {
  speed?: string;
  heading?: string;
  /** a device_tracker / zone-aware entity with lat/lon attributes */
  location?: string;
  /** or split latitude/longitude sensors */
  lat?: string;
  lon?: string;
  /** unit override for speed (e.g. "kn") */
  speed_unit?: string;
}

export interface BoatCardConfig {
  type: string;
  title?: string;
  subtitle?: string;
  card_style?: CardStyle;
  background?: boolean;
  /** static active variant */
  variant?: BoatVariant;
  /** or derive the active variant from an entity's state */
  variant_entity?: string;
  /** map entity states to variants, e.g. { docked: dock, moving: sailing } */
  variant_map?: Record<string, BoatVariant>;
  /** image URLs per variant (fall back to the built-in SVG boat) */
  images?: Partial<Record<BoatVariant, string>>;
  /** turn black backgrounds of AI renders transparent */
  image_remove_black?: boolean;
  /** show the small segmented variant switcher over the image */
  show_variant_switch?: boolean;
  chips?: ChipConfig[];
  gps?: GpsConfig;
  stats?: (string | StatConfig)[];
  controls?: (string | ControlConfig)[];
}

/** One battery bank for the battery/solar card. */
export interface BatteryBankConfig {
  name?: string;
  soc?: string;
  voltage?: string;
  current?: string;
  power?: string;
  temperature?: string;
  time_remaining?: string;
  icon?: string;
}

/** One solar array for the battery/solar card. */
export interface SolarArrayConfig {
  name?: string;
  power?: string;
  yield_today?: string;
  voltage?: string;
  current?: string;
  state?: string; // victron charger state (bulk/absorption/float)
}

export interface BatteryCardConfig {
  type: string;
  title?: string;
  card_style?: CardStyle;
  background?: boolean;
  main_battery?: BatteryBankConfig;
  motor_battery?: BatteryBankConfig;
  solar_main?: SolarArrayConfig;
  solar_secondary?: SolarArrayConfig;
}

export interface FridgeCardConfig {
  type: string;
  title?: string;
  card_style?: CardStyle;
  background?: boolean;
  /** the ESPHome switch that powers the fridge */
  switch: string;
  /** fridge temperature sensor */
  temperature?: string;
  /** optional target/setpoint sensor or number entity */
  target?: string;
  /** optional power draw sensor */
  power?: string;
  name?: string;
}

export interface CameraCardConfig {
  type: string;
  title?: string;
  card_style?: CardStyle;
  background?: boolean;
  /** the camera entity (Reolink) */
  camera: string;
  /** optional switch that powers the camera */
  power?: string;
  /** show pan/tilt/zoom controls (default true when PTZ buttons are found) */
  ptz?: boolean;
  /**
   * Explicit Reolink PTZ button entities. When omitted the card auto-discovers
   * `button.*_ptz_left/right/up/down/zoom_in/zoom_out` and picks the group
   * whose name best matches the camera.
   */
  ptz_buttons?: {
    left?: string;
    right?: string;
    up?: string;
    down?: string;
    zoom_in?: string;
    zoom_out?: string;
  };
  /** Reolink PTZ preset select entity (rendered as a dropdown) */
  presets?: string;
  /** aspect ratio, e.g. "16:9" (default) */
  aspect_ratio?: string;
}

export interface GrafanaCardConfig {
  type: string;
  title?: string;
  card_style?: CardStyle;
  background?: boolean;
  /** full Grafana panel/dashboard URL (kiosk & theme params added if missing) */
  url: string;
  /** iframe height in px (default 400) */
  height?: number;
  /** append &kiosk and &theme= automatically (default true) */
  auto_params?: boolean;
  /** open-in-new-tab button (default true) */
  show_open?: boolean;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
