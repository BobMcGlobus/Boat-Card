// Minimal Home Assistant typings + helpers shared by every Boat Card.
// Kept dependency-free on purpose so the whole family bundles into one file.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  context?: { id: string; parent_id?: string; user_id?: string };
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string; number_format?: string };
  themes?: Record<string, any>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ): Promise<unknown>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  formatEntityState?(entity: HassEntity, state?: string): string;
  hassUrl?(path?: string): string;
}

export const UNAVAILABLE_STATES = ['unavailable', 'unknown', 'none', ''];

/** Whether the active Home Assistant theme is dark (follows HA, not the OS). */
export function isDark(hass?: HomeAssistant): boolean {
  return !!hass?.themes?.darkMode;
}

export function getEntity(
  hass: HomeAssistant | undefined,
  id?: string
): HassEntity | undefined {
  if (!hass || !id) return undefined;
  return hass.states[id];
}

export function isUnavailable(st?: HassEntity): boolean {
  return !st || UNAVAILABLE_STATES.includes(String(st.state).toLowerCase());
}

/** Truthy on/active state for switches, lights, binary_sensors, ... */
export function isOn(st?: HassEntity): boolean {
  if (!st) return false;
  const s = String(st.state).toLowerCase();
  return ['on', 'open', 'home', 'active', 'charging', 'true', 'playing'].includes(s);
}

/** Numeric value of a state or one of its attributes (NaN when missing). */
export function numeric(st?: HassEntity, attribute?: string): number {
  if (!st) return NaN;
  const raw = attribute ? st.attributes?.[attribute] : st.state;
  if (raw === undefined || raw === null) return NaN;
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

export function unitOf(st?: HassEntity): string {
  return (st?.attributes?.unit_of_measurement as string) ?? '';
}

export function friendlyName(st?: HassEntity, fallback = ''): string {
  return (st?.attributes?.friendly_name as string) ?? fallback;
}

export function domainOf(entityId: string): string {
  return entityId.split('.')[0] ?? '';
}

/** Fire the native Home Assistant "more info" dialog for an entity. */
export function fireMoreInfo(node: HTMLElement, entityId: string): void {
  node.dispatchEvent(
    new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    })
  );
}

/** Generic bubbling event helper (config-changed, hass-more-info, ...). */
export function fireEvent<T>(node: HTMLElement, type: string, detail?: T): void {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true })
  );
}

/** Toggle a switch/light/etc. via homeassistant.toggle. */
export function toggleEntity(hass: HomeAssistant, entityId: string): void {
  const domain = domainOf(entityId);
  const svcDomain = ['switch', 'light', 'fan', 'input_boolean'].includes(domain)
    ? domain
    : 'homeassistant';
  hass.callService(svcDomain, 'toggle', { entity_id: entityId });
}

/** Resolve a HA theme color token or raw CSS color into a usable CSS value. */
export function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  // rgb/hex/named -> use as-is; token like "red" that is a HA theme color
  if (/^(#|rgb|hsl|var\()/.test(color)) return color;
  // Home Assistant state colors are exposed as CSS vars --<name>-color
  const known = [
    'primary', 'accent', 'red', 'pink', 'purple', 'deep-purple', 'indigo',
    'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime',
    'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey',
  ];
  if (known.includes(color)) return `var(--${color}-color)`;
  return color;
}
