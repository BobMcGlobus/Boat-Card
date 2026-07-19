// Configuration schema for the Boat Card — a single, fully configurable
// Home Assistant Lovelace card (same shape as HealthCard / Weatherglass):
// one card, a list of typed sections, the same card styles.

// Same style set as Weatherglass (withings is exclusive to HealthCard):
// default = the soft tinted base look.
export type CardStyle = 'default' | 'glass' | 'material' | 'bubble' | 'mirror';

export const CARD_STYLES: CardStyle[] = [
  'default',
  'glass',
  'material',
  'bubble',
  'mirror',
];

/** popup = built-in detail popup, more-info = native HA dialog */
export type TapAction = 'popup' | 'more-info' | 'toggle' | 'link' | 'none';

export type GraphType = 'line' | 'bar' | 'progress' | 'none';
export type Aggregate = 'mean' | 'min' | 'max' | 'last' | 'sum';
export type TrendMode = 'up_good' | 'down_good' | 'neutral' | 'none';

/** A single data series (for multi-series tiles). */
export interface SeriesConfig {
  entity: string;
  name?: string;
  color?: string;
  unit?: string;
}

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
  /** percent of the image area (0–100); this is the anchor dot position */
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
  entity2?: string;
  name?: string;
  icon?: string;
  color?: string;
  unit?: string;
  precision?: number;
  attribute?: string;
  tap_action?: TapAction;
  link?: string;
  positions?: Partial<Record<BoatVariant, ChipPosition>>;
  x?: number;
  y?: number;
  dot?: DotDir;
}

export interface ControlConfig {
  entity: string;
  name?: string;
  icon?: string;
  icon_on?: string;
}

export interface GpsConfig {
  speed?: string;
  heading?: string;
  location?: string;
  lat?: string;
  lon?: string;
  speed_unit?: string;
}

export type SectionType =
  | 'boat'
  | 'battery'
  | 'solar'
  | 'fridge'
  | 'camera'
  | 'grafana'
  | 'sensor';

export const SECTION_TYPES: SectionType[] = [
  'boat',
  'battery',
  'solar',
  'fridge',
  'camera',
  'grafana',
  'sensor',
];

/**
 * One configurable section. Like HealthCard's MetricConfig: a single interface
 * with a `type` discriminator and every field optional — the renderer and the
 * editor pick the fields that apply to the section's type.
 */
export interface SectionConfig {
  type: SectionType;
  name?: string;
  icon?: string;
  /** accent colour (token like "amber" or a #hex/rgb value) */
  color?: string;
  /** span all grid columns (boat is full width by default) */
  full_width?: boolean;

  // ---- boat (hero: image + chips) ----
  variant?: BoatVariant;
  variant_entity?: string;
  variant_map?: Record<string, BoatVariant>;
  images?: Partial<Record<BoatVariant, string>>;
  image_remove_black?: boolean;
  show_variant_switch?: boolean;
  chips?: ChipConfig[];
  gps?: GpsConfig;
  controls?: (string | ControlConfig)[];

  // ---- battery ----
  soc?: string;
  voltage?: string;
  current?: string;
  power?: string;
  temperature?: string;
  time_remaining?: string;

  // ---- solar ----
  yield_today?: string;
  /** victron charger state (bulk/absorption/float) */
  state?: string;

  // ---- fridge / camera share `switch` = the ESPHome actor that powers it ----
  switch?: string;
  /** fridge target/setpoint (sensor or number entity) */
  target?: string;

  // ---- camera ----
  camera?: string;
  ptz?: boolean;
  ptz_buttons?: {
    left?: string;
    right?: string;
    up?: string;
    down?: string;
    zoom_in?: string;
    zoom_out?: string;
  };
  presets?: string;
  aspect_ratio?: string;

  // ---- grafana ----
  url?: string;
  height?: number;
  auto_params?: boolean;
  show_open?: boolean;

  // ---- value tiles (sensor / battery / solar) ----
  entity?: string;
  entity2?: string;
  /** multiple series in one tile (chips + shared chart) */
  entities?: (string | SeriesConfig)[];
  /** extra entities shown small under the value */
  secondary?: string[];
  unit?: string;
  precision?: number;
  attribute?: string;
  tap_action?: TapAction;
  link?: string;
  /** per-tile mini chart: line (default) | bar | progress | none */
  graph?: GraphType;
  /** history window in days for the tile chart/trend (default 7) */
  days?: number;
  /** how history buckets are aggregated (default mean) */
  aggregate?: Aggregate;
  /** trend arrow direction meaning (default neutral) */
  trend?: TrendMode;
  /** target for a progress graph (number or entity id) */
  goal?: number | string;
  /** show the detail popup inline on the tile */
  expanded?: boolean;
}

/** Popup detail time ranges. */
export type RangeKind = 'hour' | 'day' | 'month';

export interface BoatCardConfig {
  type: string;
  title?: string;
  subtitle?: string;
  /** default (plain HA) · withings · glass · material · bubble · mirror */
  card_style?: CardStyle;
  /** false: no ha-card background/shadow (for use inside containers) */
  background?: boolean;
  /** render sections as tinted tiles (default) or flat rows */
  tiles?: boolean;
  /** no outer padding, sections run edge to edge */
  flush?: boolean;
  /** grid columns for the tile sections (default 2) */
  columns?: number;
  /** grid (default) or carousel: horizontally scrollable tiles */
  layout?: 'grid' | 'carousel';
  sections: SectionConfig[];
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
