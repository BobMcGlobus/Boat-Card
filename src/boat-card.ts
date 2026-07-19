import { LitElement, html, nothing } from 'lit';
import type { TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import {
  getEntity,
  isUnavailable,
  isOn,
  numeric,
  friendlyName,
  fireMoreInfo,
  toggleEntity,
  resolveColor,
  domainOf,
} from './ha';
import { fmtState, fmtNumber, compass, joinUnit } from './format';
import { t } from './i18n';
import { sharedStyles, styleClass } from './styles';
import { boatScene } from './boat-scene';
import { SECTION_PRESETS } from './presets';
import {
  fetchHistory,
  bucketDaily,
  bucketHourly,
  fillGaps,
  trendDelta,
  type HistoryMap,
} from './history';
import { lineChart, barChart } from './charts';
import {
  BOAT_VARIANTS,
  type BoatCardConfig,
  type BoatVariant,
  type SectionConfig,
  type ChipConfig,
  type ChipPosition,
  type ControlConfig,
  type GpsConfig,
  type GraphType,
  type Aggregate,
  type TrendMode,
  type DotDir,
} from './types';

import './editors';

type PtzDir = 'left' | 'right' | 'up' | 'down' | 'zoom_in' | 'zoom_out';
const PTZ_DIRS: PtzDir[] = ['left', 'right', 'up', 'down', 'zoom_in', 'zoom_out'];

const REFETCH_MIN_MS = 20_000;
const REFETCH_MAX_AGE_MS = 5 * 60_000;

interface PopupRange {
  key: string;
  labelKey: string;
  kind: 'hour' | 'day';
  count: number;
}
const POPUP_RANGES: PopupRange[] = [
  { key: 'day', labelKey: 'range_day', kind: 'hour', count: 24 },
  { key: 'week', labelKey: 'range_week', kind: 'day', count: 7 },
  { key: 'month', labelKey: 'range_month', kind: 'day', count: 30 },
];

@customElement('boat-card')
export class BoatCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: BoatCardConfig;
  @state() private _variantOverride: Record<number, BoatVariant> = {};
  @state() private _history: HistoryMap = {};
  @state() private _popup: number | null = null;
  @state() private _popupRange = 'week';
  @state() private _tileRanges: Record<number, string> = {};

  private _cfgSig = '';
  private _stateSig = '';
  private _lastFetch = 0;
  private _fetching = false;

  public setConfig(config: BoatCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    if (!Array.isArray(config.sections))
      throw new Error('boat-card: "sections" must be a list');
    this._config = config;
    this._variantOverride = {};
    this._cfgSig = '';
  }

  public getCardSize(): number {
    return 4 + (this._config?.sections?.length ?? 0) * 2;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('boat-card-editor');
  }

  static getStubConfig(): BoatCardConfig {
    return {
      type: 'custom:boat-card',
      title: 'Hoppetosse',
      card_style: 'default',
      columns: 2,
      sections: [
        {
          type: 'boat',
          variant: 'dock',
          show_variant_switch: true,
          chips: [
            { entity: 'sensor.solar_power', icon: 'mdi:solar-power', positions: { dock: { x: 58, y: 26, dot: 'left' } } },
            { entity: 'sensor.battery_soc', icon: 'mdi:battery', positions: { dock: { x: 40, y: 66, dot: 'right' } } },
          ],
        },
        { type: 'battery', soc: 'sensor.battery_soc', voltage: 'sensor.battery_voltage' },
        { type: 'solar', power: 'sensor.solar_power', yield_today: 'sensor.solar_yield_today' },
        { type: 'fridge', switch: 'switch.fridge', temperature: 'sensor.fridge_temperature' },
      ],
    };
  }

  // ==================== history lifecycle ====================
  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('hass') || changed.has('_config')) this._maybeFetch();
  }

  private _sectionSeries(s: SectionConfig): string[] {
    switch (s.type) {
      case 'sensor': {
        const ids: string[] = [];
        if (s.entities?.length)
          ids.push(...s.entities.map((e) => (typeof e === 'string' ? e : e.entity)));
        if (s.entity) ids.push(s.entity);
        if (s.entity2) ids.push(s.entity2);
        return ids;
      }
      case 'battery':
        return s.soc ? [s.soc] : [];
      case 'solar':
        return s.power ? [s.power] : [];
      default:
        return [];
    }
  }

  private _watchedEntities(): string[] {
    const ids = new Set<string>();
    for (const s of this._config?.sections ?? []) {
      if (s.graph === 'none') continue;
      for (const id of this._sectionSeries(s)) if (id) ids.add(id);
    }
    return [...ids];
  }

  private _maybeFetch(): void {
    if (!this.hass || !this._config || this._fetching) return;
    const ids = this._watchedEntities();
    if (!ids.length) return;
    const days = Math.max(
      31,
      ...this._config.sections.map((s) => s.days ?? 7)
    );
    const cfgSig = `${days}|${ids.join(',')}`;
    const stateSig = ids.map((id) => this.hass.states[id]?.last_updated ?? '').join('|');
    const now = Date.now();
    const stale =
      cfgSig !== this._cfgSig ||
      now - this._lastFetch > REFETCH_MAX_AGE_MS ||
      (stateSig !== this._stateSig && now - this._lastFetch > REFETCH_MIN_MS);
    if (!stale) return;
    this._fetching = true;
    this._cfgSig = cfgSig;
    this._stateSig = stateSig;
    fetchHistory(this.hass, ids, days)
      .then((h) => {
        this._history = h;
        this._lastFetch = Date.now();
      })
      .catch((e) => console.warn('boat-card: history fetch failed', e))
      .finally(() => {
        this._fetching = false;
      });
  }

  private _buckets(id: string | undefined, kind: 'hour' | 'day', count: number, agg: Aggregate): number[] {
    if (!id) return [];
    const pts = this._history[id] ?? [];
    return kind === 'hour' ? bucketHourly(pts, count, agg) : bucketDaily(pts, count, agg);
  }

  // ==================== helpers ====================
  private _accent(s: SectionConfig): string {
    const preset = SECTION_PRESETS[s.type] ?? SECTION_PRESETS.sensor;
    return resolveColor(s.color) ?? preset.color;
  }
  private _icon(s: SectionConfig): string {
    return s.icon ?? (SECTION_PRESETS[s.type] ?? SECTION_PRESETS.sensor).icon;
  }
  private _name(s: SectionConfig): string {
    const preset = SECTION_PRESETS[s.type] ?? SECTION_PRESETS.sensor;
    return s.name ?? t(this.hass, preset.nameKey);
  }
  private _isFull(s: SectionConfig): boolean {
    return s.full_width ?? ['boat', 'camera', 'grafana'].includes(s.type);
  }
  private _graph(s: SectionConfig): GraphType {
    return s.graph ?? (SECTION_PRESETS[s.type]?.graph ?? 'none');
  }
  private _trendMode(s: SectionConfig): TrendMode {
    return s.trend ?? (SECTION_PRESETS[s.type]?.trend ?? 'none');
  }
  private _agg(s: SectionConfig): Aggregate {
    return s.aggregate ?? (SECTION_PRESETS[s.type]?.aggregate ?? 'mean');
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    const c = this._config;
    const cardClass = [
      'cardroot',
      styleClass(c.card_style),
      c.tiles === false ? 'flat' : 'tiles',
      c.flush ? 'flush' : '',
    ].join(' ');
    const inner = html`
      ${c.title
        ? html`<div class="header">
            <div class="title">${c.title}</div>
            ${c.subtitle ? html`<div class="subtitle">${c.subtitle}</div>` : nothing}
          </div>`
        : nothing}
      <div class="metrics ${c.layout === 'carousel' ? 'carousel' : ''}" style="--bc-columns:${c.columns ?? 2}">
        ${(c.sections ?? []).map((s, i) => this._renderSection(s, i))}
      </div>
    `;
    return html`
      ${c.background === false
        ? html`<div class="${cardClass} nobg">${inner}</div>`
        : html`<ha-card class=${cardClass}>${inner}</ha-card>`}
      ${this._renderPopup()}
    `;
  }

  private _renderSection(s: SectionConfig, i: number): TemplateResult {
    const full = this._isFull(s) ? 'full' : '';
    const accent = this._accent(s);
    let body: TemplateResult | typeof nothing;
    switch (s.type) {
      case 'boat': body = this._renderBoat(s, i); break;
      case 'battery': body = this._renderBattery(s, i); break;
      case 'solar': body = this._renderSolar(s, i); break;
      case 'fridge': body = this._renderFridge(s); break;
      case 'camera': body = this._renderCamera(s); break;
      case 'grafana': body = this._renderGrafana(s); break;
      case 'sensor': body = this._renderSensor(s, i); break;
      default: body = nothing;
    }
    return html`<div class="metric ${full}" style="--bc-accent:${accent}">${body}</div>`;
  }

  private _tileHead(s: SectionConfig, right?: TemplateResult): TemplateResult {
    return html`<div class="head">
      <div class="iconchip"><ha-icon .icon=${this._icon(s)}></ha-icon></div>
      <div class="name">${this._name(s)}</div>
      ${right ?? nothing}
    </div>`;
  }

  // ==================== value-tile building blocks ====================
  private _trendEl(id: string | undefined, s: SectionConfig): TemplateResult | typeof nothing {
    const mode = this._trendMode(s);
    if (mode === 'none' || !id) return nothing;
    const days = s.days ?? 7;
    const delta = trendDelta(fillGaps(this._buckets(id, 'day', days, this._agg(s))));
    if (!Number.isFinite(delta) || Math.abs(delta) < 1e-9) return nothing;
    const up = delta > 0;
    const good = mode === 'up_good' ? up : mode === 'down_good' ? !up : null;
    const cls = good === null ? 'flat' : good ? 'up' : 'down';
    return html`<span class="trend ${cls}">
      <ha-icon .icon=${up ? 'mdi:arrow-top-right' : 'mdi:arrow-bottom-right'}></ha-icon>
      ${fmtNumber(this.hass, Math.abs(delta), s.precision ?? 1)}
    </span>`;
  }

  private _miniChart(ids: string[], color: string, s: SectionConfig): TemplateResult | typeof nothing {
    const graph = this._graph(s);
    if (graph === 'none') return nothing;
    const days = s.days ?? 7;
    const agg = this._agg(s);
    if (graph === 'bar') {
      return barChart(this._buckets(ids[0], 'day', days, agg), color, undefined, { h: 56 });
    }
    if (graph === 'progress') return nothing; // progress uses the bar under the value
    const series = ids.filter(Boolean).map((id, idx) => ({
      values: fillGaps(this._buckets(id, 'day', days, agg)),
      color: idx === 0 ? color : 'var(--secondary-text-color)',
    }));
    return lineChart(series, { h: 56 });
  }

  private _handleTap(s: SectionConfig, i: number, primaryId?: string): void {
    const action = s.tap_action ?? 'popup';
    if (action === 'none') return;
    if (action === 'toggle' && primaryId) return toggleEntity(this.hass, primaryId);
    if (action === 'link' && s.link) {
      if (/^https?:/.test(s.link)) window.open(s.link, '_blank');
      else if (primaryId) fireMoreInfo(this, primaryId);
      return;
    }
    if (action === 'more-info') {
      if (primaryId) fireMoreInfo(this, primaryId);
      return;
    }
    this._popupRange = 'week';
    this._popup = i;
  }

  // ==================== BATTERY / SOLAR / SENSOR (value tiles) ====================
  private _kvRow(id: string | undefined, label: string): TemplateResult | typeof nothing {
    const st = getEntity(this.hass, id);
    if (!id || isUnavailable(st)) return nothing;
    return html`<div class="kv"><span>${label}</span><b>${fmtState(this.hass, st)}</b></div>`;
  }
  private _socColor(soc: number): string {
    if (!Number.isFinite(soc)) return 'var(--secondary-text-color)';
    if (soc >= 50) return 'var(--bc-battery)';
    if (soc >= 20) return 'var(--bc-solar)';
    return 'var(--bc-danger)';
  }

  private _valueTile(
    s: SectionConfig,
    i: number,
    primaryId: string | undefined,
    valueTpl: TemplateResult | typeof nothing,
    extras: TemplateResult | typeof nothing,
    chartIds: string[],
    chartColor: string
  ): TemplateResult {
    const st = getEntity(this.hass, primaryId);
    const clickable = (s.tap_action ?? 'popup') !== 'none';
    return html`<div
      class="tile-inner ${clickable ? 'clickable' : ''}"
      @click=${() => this._handleTap(s, i, primaryId)}
    >
      ${this._tileHead(
        s,
        st ? html`<div class="time">${this._trendEl(primaryId, s)}</div>` : undefined
      )}
      <div class="body">
        <div class="info">${valueTpl}${extras}</div>
        <div class="chartcell">${this._miniChart(chartIds, chartColor, s)}</div>
      </div>
    </div>`;
  }

  private _renderBattery(s: SectionConfig, i: number): TemplateResult {
    const socSt = getEntity(this.hass, s.soc);
    const soc = numeric(socSt);
    const color = this._socColor(soc);
    const value = socSt
      ? html`<div class="value" style="color:${color}">${fmtState(this.hass, socSt, { unit: '%', precision: 0 })}</div>
          <div class="progress"><span style="width:${Math.max(0, Math.min(100, soc || 0))}%;--bar-color:${color}"></span></div>`
      : html`<div class="missing">${t(this.hass, 'unavailable')}</div>`;
    const extras = html`<div class="kvs">
      ${this._kvRow(s.voltage, t(this.hass, 'voltage'))}
      ${this._kvRow(s.current, t(this.hass, 'current'))}
      ${this._kvRow(s.power, t(this.hass, 'power_now'))}
      ${this._kvRow(s.temperature, t(this.hass, 'temperature'))}
      ${this._kvRow(s.time_remaining, '⌛')}
    </div>`;
    return this._valueTile(s, i, s.soc, value, extras, [s.soc ?? ''], color);
  }

  private _renderSolar(s: SectionConfig, i: number): TemplateResult {
    const powerSt = getEntity(this.hass, s.power);
    const value = powerSt
      ? html`<div class="value" style="color:var(--bc-solar)">${fmtState(this.hass, powerSt, { unit: 'W', precision: 0 })}</div>`
      : html`<div class="missing">${t(this.hass, 'unavailable')}</div>`;
    const extras = html`<div class="kvs">
      ${this._kvRow(s.yield_today, t(this.hass, 'yield_today'))}
      ${this._kvRow(s.voltage, t(this.hass, 'voltage'))}
      ${this._kvRow(s.current, t(this.hass, 'current'))}
      ${this._kvRow(s.state, t(this.hass, 'state'))}
    </div>`;
    return this._valueTile(s, i, s.power, value, extras, [s.power ?? ''], 'var(--bc-solar)');
  }

  private _renderSensor(s: SectionConfig, i: number): TemplateResult {
    const primary = s.entity ?? (s.entities?.length ? (typeof s.entities[0] === 'string' ? s.entities[0] : s.entities[0].entity) : undefined);
    const st = getEntity(this.hass, primary);
    const value = html`<div class="value">${fmtState(this.hass, st, { precision: s.precision, unit: s.unit, attribute: s.attribute, unavailable: '—' })}</div>`;
    const secondary = (s.secondary ?? [])
      .map((id) => getEntity(this.hass, id))
      .filter((x) => x && !isUnavailable(x))
      .map((x) => fmtState(this.hass, x));
    const extras = secondary.length
      ? html`<div class="secondary-vals">${secondary.join(' · ')}</div>`
      : nothing;
    return this._valueTile(s, i, primary, value, extras, this._sectionSeries(s), this._accent(s));
  }

  // ==================== BOAT HERO ====================
  private _variant(s: SectionConfig, i: number): BoatVariant {
    if (this._variantOverride[i]) return this._variantOverride[i];
    if (s.variant_entity) {
      const st = getEntity(this.hass, s.variant_entity);
      if (st) {
        const mapped = s.variant_map?.[st.state];
        if (mapped) return mapped;
        if (BOAT_VARIANTS.includes(st.state as BoatVariant)) return st.state as BoatVariant;
      }
    }
    return s.variant ?? 'dock';
  }

  private _renderBoat(s: SectionConfig, i: number): TemplateResult {
    const variant = this._variant(s, i);
    const url = s.images?.[variant];
    return html`
      <div class="stage">
        ${url
          ? html`<img class="scene ${s.image_remove_black ? 'rm-black' : ''}" src=${url} alt=${variant} />`
          : html`<div class="scene">${boatScene(variant)}</div>`}
        ${(s.chips ?? []).map((chip) => this._renderChip(chip, variant))}
        ${s.show_variant_switch !== false ? this._renderVariantSwitch(variant, i) : nothing}
      </div>
      ${this._renderGps(s.gps)} ${this._renderControls(s.controls)}
    `;
  }

  private _renderVariantSwitch(active: BoatVariant, i: number): TemplateResult {
    const icons: Record<BoatVariant, string> = { dock: 'mdi:dock-top', sailing: 'mdi:sail-boat', trailer: 'mdi:truck-trailer' };
    return html`<div class="variant-switch">
      ${BOAT_VARIANTS.map(
        (v) => html`<button class=${v === active ? 'on' : ''} title=${t(this.hass, v)} @click=${() => (this._variantOverride = { ...this._variantOverride, [i]: v })}>
          <ha-icon .icon=${icons[v]}></ha-icon>
        </button>`
      )}
    </div>`;
  }

  private _chipPos(chip: ChipConfig, variant: BoatVariant): ChipPosition | undefined {
    const p = chip.positions?.[variant];
    if (p) return p.hidden ? undefined : p;
    if (chip.x !== undefined && chip.y !== undefined) return { x: chip.x, y: chip.y, dot: chip.dot };
    return undefined;
  }

  private _tapChip(chip: ChipConfig): void {
    const action = chip.tap_action ?? 'more-info';
    if (action === 'none') return;
    if (action === 'toggle') return toggleEntity(this.hass, chip.entity);
    if (action === 'link' && chip.link) {
      if (/^https?:/.test(chip.link)) window.open(chip.link, '_blank');
      else fireMoreInfo(this, chip.entity);
      return;
    }
    fireMoreInfo(this, chip.entity);
  }

  private _renderChip(chip: ChipConfig, variant: BoatVariant): TemplateResult | typeof nothing {
    const pos = this._chipPos(chip, variant);
    const st = getEntity(this.hass, chip.entity);
    if (!pos || !st) return nothing;
    const dir: DotDir = pos.dot ?? (pos.x >= 50 ? 'left' : 'right');
    const color = resolveColor(chip.color) ?? 'var(--bc-accent)';
    let value: string;
    if (chip.entity2) {
      const st2 = getEntity(this.hass, chip.entity2);
      value = `${fmtState(this.hass, st, { precision: chip.precision, unit: '' })} / ${fmtState(this.hass, st2, { precision: chip.precision })}`;
    } else {
      value = fmtState(this.hass, st, { precision: chip.precision, unit: chip.unit, attribute: chip.attribute });
    }
    const name = chip.name ?? friendlyName(st, '');
    return html`<div class="anchor dot-${dir}" style="left:${pos.x}%;top:${pos.y}%;--ac:${color}" @click=${() => this._tapChip(chip)}>
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        ${chip.icon ? html`<ha-icon class="ci" .icon=${chip.icon}></ha-icon>` : nothing}
        <div class="anchor-txt">
          ${name ? html`<span class="anchor-name">${name}</span>` : nothing}
          <span class="anchor-val">${value}</span>
        </div>
      </div>
    </div>`;
  }

  private _renderGps(g?: GpsConfig): TemplateResult | typeof nothing {
    if (!g) return nothing;
    const parts: TemplateResult[] = [];
    const speedSt = getEntity(this.hass, g.speed);
    if (speedSt && !isUnavailable(speedSt))
      parts.push(html`<span class="gps-item"><ha-icon icon="mdi:speedometer"></ha-icon>${fmtState(this.hass, speedSt, { unit: g.speed_unit })}</span>`);
    const headSt = getEntity(this.hass, g.heading);
    if (headSt && !isUnavailable(headSt)) {
      const deg = numeric(headSt);
      parts.push(html`<span class="gps-item"><ha-icon icon="mdi:compass-outline"></ha-icon>${compass(deg)} ${Number.isFinite(deg) ? html`${fmtNumber(this.hass, deg, 0)}°` : ''}</span>`);
    }
    const coord = this._coords(g);
    if (coord) parts.push(html`<span class="gps-item"><ha-icon icon="mdi:map-marker"></ha-icon>${coord}</span>`);
    return parts.length ? html`<div class="gps-bar">${parts}</div>` : nothing;
  }

  private _coords(g: GpsConfig): string {
    let lat = NaN;
    let lon = NaN;
    if (g.location) {
      const st = getEntity(this.hass, g.location);
      lat = numeric(st, 'latitude');
      lon = numeric(st, 'longitude');
    }
    if (!Number.isFinite(lat) && g.lat) lat = numeric(getEntity(this.hass, g.lat));
    if (!Number.isFinite(lon) && g.lon) lon = numeric(getEntity(this.hass, g.lon));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return '';
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }

  private _renderControls(controls?: (string | ControlConfig)[]): TemplateResult | typeof nothing {
    if (!controls?.length) return nothing;
    return html`<div class="controls">
      ${controls.map((ct) => {
        const cfg: ControlConfig = typeof ct === 'string' ? { entity: ct } : ct;
        const st = getEntity(this.hass, cfg.entity);
        const on = isOn(st);
        const icon = on ? cfg.icon_on ?? cfg.icon : cfg.icon;
        return html`<button class="ctl ${on ? 'on' : ''}" @click=${() => toggleEntity(this.hass, cfg.entity)}>
          <ha-icon .icon=${icon ?? 'mdi:power'}></ha-icon>
          <span class="cl">${cfg.name ?? friendlyName(st, '')}</span>
          <span class="cl">${on ? t(this.hass, 'on') : t(this.hass, 'off')}</span>
        </button>`;
      })}
    </div>`;
  }

  // ==================== FRIDGE ====================
  private _renderFridge(s: SectionConfig): TemplateResult {
    const sw = getEntity(this.hass, s.switch);
    const on = isOn(sw);
    const tempSt = getEntity(this.hass, s.temperature);
    return html`
      ${this._tileHead(s)}
      <div class="fridge">
        ${s.switch
          ? html`<button class="power ${on ? 'on' : ''}" @click=${() => toggleEntity(this.hass, s.switch!)}>
              <ha-icon icon="mdi:fridge-outline"></ha-icon>
              <span>${on ? t(this.hass, 'on') : t(this.hass, 'off')}</span>
            </button>`
          : nothing}
        <div class="readouts">
          ${s.temperature
            ? html`<div class="ro" @click=${() => fireMoreInfo(this, s.temperature!)}>
                <span class="l">${t(this.hass, 'fridge_temp')}</span>
                <span class="v">${fmtState(this.hass, tempSt, { precision: 1 })}</span>
              </div>`
            : nothing}
          ${s.target && !isUnavailable(getEntity(this.hass, s.target))
            ? html`<div class="ro"><span class="l">${t(this.hass, 'target')}</span><span class="v">${fmtState(this.hass, getEntity(this.hass, s.target), { precision: 1 })}</span></div>`
            : nothing}
          ${s.power && !isUnavailable(getEntity(this.hass, s.power))
            ? html`<div class="ro"><span class="l">${t(this.hass, 'power_now')}</span><span class="v">${fmtState(this.hass, getEntity(this.hass, s.power))}</span></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  // ==================== CAMERA ====================
  private _ptzButtons(s: SectionConfig): Partial<Record<PtzDir, string>> {
    if (s.ptz_buttons) return s.ptz_buttons;
    const groups: Record<string, Partial<Record<PtzDir, string>>> = {};
    for (const id of Object.keys(this.hass.states)) {
      if (domainOf(id) !== 'button') continue;
      const m = id.match(/^button\.(.+)_ptz_(left|right|up|down|zoom_in|zoom_out)$/);
      if (!m) continue;
      (groups[m[1]] ??= {})[m[2] as PtzDir] = id;
    }
    const camObj = (s.camera ?? '').split('.')[1] ?? '';
    let best = '';
    let bestScore = -1;
    for (const prefix of Object.keys(groups)) {
      const at = prefix.split('_');
      const bt = camObj.split('_');
      let n = 0;
      while (n < at.length && n < bt.length && at[n] === bt[n]) n++;
      if (n > bestScore) { bestScore = n; best = prefix; }
    }
    return best ? groups[best] : {};
  }

  private _renderCamera(s: SectionConfig): TemplateResult {
    const cam = getEntity(this.hass, s.camera);
    const power = getEntity(this.hass, s.switch);
    const presetSel = getEntity(this.hass, s.presets);
    const b = this._ptzButtons(s);
    const showPtz = s.ptz !== false && (s.ptz === true || PTZ_DIRS.some((d) => b[d]));
    const pic = cam?.attributes?.entity_picture;
    const btn = (dir: PtzDir, icon: string) =>
      html`<button class="ptz-btn" ?disabled=${!b[dir]} @click=${() => b[dir] && this.hass.callService('button', 'press', { entity_id: b[dir] })}><ha-icon .icon=${icon}></ha-icon></button>`;
    return html`
      ${this._tileHead(
        s,
        s.switch
          ? html`<button class="ptz-btn" style=${isOn(power) ? 'color:var(--bc-accent)' : ''} title=${t(this.hass, 'camera_power')} @click=${() => toggleEntity(this.hass, s.switch!)}><ha-icon icon="mdi:power"></ha-icon></button>`
          : undefined
      )}
      <div class="cam-wrap" style="--ar:${(s.aspect_ratio ?? '16:9').replace(':', '/')}">
        ${s.switch && !isOn(power)
          ? html`<div class="cam off"><ha-icon icon="mdi:cctv-off"></ha-icon><span>${t(this.hass, 'off')}</span></div>`
          : html`<div class="cam" @click=${() => s.camera && fireMoreInfo(this, s.camera)}>
              ${cam ? html`<ha-camera-stream .hass=${this.hass} .stateObj=${cam} muted></ha-camera-stream>` : nothing}
              ${!cam && pic ? html`<img src=${pic} alt="camera" />` : nothing}
            </div>`}
      </div>
      ${presetSel && !isUnavailable(presetSel)
        ? html`<div class="presets">
            <ha-icon icon="mdi:map-marker-radius"></ha-icon>
            <select @change=${(e: Event) => this.hass.callService('select', 'select_option', { entity_id: s.presets, option: (e.target as HTMLSelectElement).value })}>
              ${(presetSel.attributes.options ?? []).map((o: string) => html`<option ?selected=${o === presetSel.state}>${o}</option>`)}
            </select>
          </div>`
        : nothing}
      ${showPtz
        ? html`<div class="ptz">
            <div class="pad">
              <span></span>${btn('up', 'mdi:chevron-up')}<span></span>
              ${btn('left', 'mdi:chevron-left')}<ha-icon class="pad-center" icon="mdi:pan"></ha-icon>${btn('right', 'mdi:chevron-right')}
              <span></span>${btn('down', 'mdi:chevron-down')}<span></span>
            </div>
            <div class="zoom">${btn('zoom_out', 'mdi:magnify-minus-outline')}${btn('zoom_in', 'mdi:magnify-plus-outline')}</div>
          </div>`
        : nothing}
    `;
  }

  // ==================== GRAFANA ====================
  private _grafanaUrl(s: SectionConfig): string {
    let url = s.url ?? '';
    if (s.auto_params === false) return url;
    const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const add = (key: string, val?: string) => {
      if (new RegExp(`[?&]${key}(=|&|$)`).test(url)) return;
      url += (url.includes('?') ? '&' : '?') + (val ? `${key}=${val}` : key);
    };
    add('theme', dark ? 'dark' : 'light');
    add('kiosk');
    return url;
  }

  private _renderGrafana(s: SectionConfig): TemplateResult {
    return html`
      ${this._tileHead(
        s,
        s.show_open !== false && s.url
          ? html`<a class="g-open" href=${s.url} target="_blank" rel="noopener" title=${t(this.hass, 'open_grafana')}><ha-icon icon="mdi:open-in-new"></ha-icon></a>`
          : undefined
      )}
      ${s.url
        ? html`<iframe class="frame" style="height:${s.height ?? 400}px" src=${this._grafanaUrl(s)} loading="lazy" referrerpolicy="no-referrer"></iframe>`
        : html`<div class="missing">${t(this.hass, 'no_url')}</div>`}
    `;
  }

  // ==================== DETAIL POPUP ====================
  private _popupSection(): SectionConfig | undefined {
    return this._popup === null ? undefined : this._config?.sections[this._popup];
  }

  private _renderPopup(): TemplateResult | typeof nothing {
    const s = this._popupSection();
    if (!s) return nothing;
    const range = POPUP_RANGES.find((r) => r.key === this._popupRange) ?? POPUP_RANGES[1];
    const primary = this._sectionSeries(s)[0];
    const color = s.type === 'solar' ? 'var(--bc-solar)' : this._accent(s);
    const agg = this._agg(s);
    const buckets = this._buckets(primary, range.kind, range.count, agg);
    const graph = this._graph(s) === 'bar' ? 'bar' : 'line';
    const chart =
      graph === 'bar'
        ? barChart(buckets, color, undefined, { w: 520, h: 150, yFmt: (v) => fmtNumber(this.hass, v, 0) })
        : lineChart([{ values: fillGaps(buckets), color }], { w: 520, h: 150, yFmt: (v) => fmtNumber(this.hass, v, 0) });
    const finite = buckets.filter(Number.isFinite);
    const min = finite.length ? Math.min(...finite) : NaN;
    const max = finite.length ? Math.max(...finite) : NaN;
    const avg = finite.length ? finite.reduce((a, b) => a + b, 0) / finite.length : NaN;
    const delta = trendDelta(fillGaps(buckets));
    const stat = (label: string, v: number) =>
      html`<div class="stat-tile"><div class="stat-label">${label}</div><div class="stat-value">${fmtNumber(this.hass, v, s.precision ?? 1)}</div></div>`;
    return html`<div class="backdrop ${styleClass(this._config?.card_style)}" @click=${() => (this._popup = null)}>
      <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
        <div class="dialog-head">
          <div class="iconchip"><ha-icon .icon=${this._icon(s)}></ha-icon></div>
          <div class="dialog-title">${this._name(s)}</div>
          <button class="close" @click=${() => (this._popup = null)}><ha-icon icon="mdi:close"></ha-icon></button>
        </div>
        <div class="ranges">
          ${POPUP_RANGES.map(
            (r) => html`<button class="range ${r.key === this._popupRange ? 'on' : ''}" @click=${() => (this._popupRange = r.key)}>${t(this.hass, r.labelKey)}</button>`
          )}
        </div>
        <div class="bigchart">${chart}</div>
        <div class="stats">
          ${stat(t(this.hass, 'stat_min'), min)}
          ${stat(t(this.hass, 'stat_avg'), avg)}
          ${stat(t(this.hass, 'stat_max'), max)}
          ${stat(t(this.hass, 'stat_trend'), delta)}
        </div>
      </div>
    </div>`;
  }

  static styles = sharedStyles;
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'boat-card',
  name: 'Boat Card',
  description:
    'A fully configurable single card for a boat: a graphical boat hero with per-image chips plus configurable metric tiles (battery, solar, fridge, camera, Grafana, sensors) with mini charts, trends and a detail popup.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Boat-Card',
});
