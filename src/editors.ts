import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import { fireEvent, getEntity, friendlyName } from './ha';
import { SECTION_PRESETS } from './presets';
import { t } from './i18n';
import {
  SECTION_TYPES,
  type BoatCardConfig,
  type SectionConfig,
  type SectionType,
} from './types';
import './chip-editor';

const LABELS: Record<string, string> = {
  title: 'Titel',
  subtitle: 'Untertitel',
  card_style: 'Kartenstil',
  columns: 'Spalten',
  layout: 'Layout',
  background: 'Hintergrund anzeigen',
  tiles: 'Als Kacheln',
  flush: 'Ohne Rand (flush)',
  name: 'Name',
  icon: 'Icon',
  color: 'Akzentfarbe (Token oder #hex)',
  full_width: 'Volle Breite',
  variant: 'Aktive Ansicht',
  variant_entity: 'Ansicht aus Entität',
  images: 'Bilder (URLs)',
  dock: 'Am Steg (URL)',
  sailing: 'Unter Segeln (URL)',
  trailer: 'Auf dem Anhänger (URL)',
  image_remove_black: 'Schwarz transparent machen',
  show_variant_switch: 'Umschalter anzeigen',
  gps: 'GPS',
  speed: 'Geschwindigkeit',
  heading: 'Kurs',
  location: 'Standort (device_tracker)',
  lat: 'Breitengrad (Sensor)',
  lon: 'Längengrad (Sensor)',
  altitude: 'Höhe (Sensor)',
  speed_unit: 'Einheit Geschwindigkeit',
  soc: 'Ladezustand (%)',
  voltage: 'Spannung',
  current: 'Strom',
  power: 'Leistung',
  temperature: 'Temperatur',
  time_remaining: 'Restzeit',
  yield_today: 'Ertrag heute',
  state: 'Zustand (Text)',
  switch: 'Schalter (Strom)',
  target: 'Sollwert',
  camera: 'Kamera',
  ptz: 'PTZ-Steuerung',
  presets: 'Preset-Auswahl (select)',
  aspect_ratio: 'Seitenverhältnis',
  url: 'Grafana-URL',
  height: 'Höhe (px)',
  auto_params: 'kiosk/theme automatisch',
  show_open: '„Öffnen"-Button',
  entity: 'Entität',
  entity2: 'Zweite Entität',
  unit: 'Einheit',
  precision: 'Nachkommastellen',
  attribute: 'Attribut',
  tap_action: 'Tippen',
  graph: 'Diagramm',
  days: 'Zeitraum (Tage)',
  trend: 'Trend-Pfeil',
};

const SECTION_LABEL: Record<SectionType, string> = {
  boat: 'Boot (Bild + Chips)',
  battery: 'Batterie',
  solar: 'Solar',
  fridge: 'Kühlschrank',
  camera: 'Kamera',
  grafana: 'Grafana',
  sensor: 'Sensor (Wert)',
};

const text = (name: string) => ({ name, selector: { text: {} } });
const bool = (name: string) => ({ name, selector: { boolean: {} } });
const sensor = (name: string) => ({ name, selector: { entity: { domain: 'sensor' } } });
const ent = (name: string, domain?: string | string[]) => ({
  name,
  selector: { entity: domain ? { domain } : {} },
});
const num = (name: string, min = 0, max = 100) => ({
  name,
  selector: { number: { min, max, mode: 'box' } },
});

const STYLE_SELECT = {
  name: 'card_style',
  selector: {
    select: {
      mode: 'dropdown',
      options: [
        { value: 'default', label: 'Standard' },
        { value: 'glass', label: 'Liquid Glass' },
        { value: 'material', label: 'Material You' },
        { value: 'bubble', label: 'Bubble' },
        { value: 'mirror', label: 'Magic Mirror' },
      ],
    },
  },
};

/** Chart/behaviour fields shared by the value tiles (battery, solar, sensor). */
const CHART_FIELDS = [
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'graph',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'line', label: 'Linie' },
              { value: 'bar', label: 'Balken' },
              { value: 'none', label: 'Kein Chart' },
            ],
          },
        },
      },
      { name: 'days', selector: { number: { min: 1, max: 31, mode: 'box' } } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'trend',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'up_good', label: 'Steigend = gut' },
              { value: 'down_good', label: 'Fallend = gut' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'none', label: 'Kein Trend' },
            ],
          },
        },
      },
      {
        name: 'tap_action',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'popup', label: 'Detail-Popup' },
              { value: 'more-info', label: 'Info-Dialog' },
              { value: 'none', label: 'Nichts' },
            ],
          },
        },
      },
    ],
  },
];

@customElement('boat-card-editor')
export class BoatCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: BoatCardConfig;
  @state() private _expanded = -1;

  public setConfig(config: BoatCardConfig): void {
    this._config = { ...config, sections: config.sections ?? [] };
  }

  private _label = (s: any) => LABELS[s?.name] ?? s?.name ?? '';

  private _emit(config: BoatCardConfig): void {
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }

  private _topSchema() {
    return [
      text('title'),
      text('subtitle'),
      { type: 'grid', name: '', schema: [STYLE_SELECT, num('columns', 1, 4)] },
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'layout',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'grid', label: 'Grid' },
                  { value: 'carousel', label: 'Karussell' },
                ],
              },
            },
          },
          bool('tiles'),
        ],
      },
      { type: 'grid', name: '', schema: [bool('background'), bool('flush')] },
    ];
  }

  private _topChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    this._emit({ ...this._config, ...ev.detail.value, sections: this._config.sections });
  }

  // ---- section-type field schema ----
  private _sectionSchema(type: SectionType) {
    const common = [
      { type: 'grid', name: '', schema: [text('name'), { name: 'icon', selector: { icon: {} } }] },
      { type: 'grid', name: '', schema: [text('color'), bool('full_width')] },
    ];
    switch (type) {
      case 'boat':
        return [
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'variant',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: [
                      { value: 'dock', label: 'Am Steg' },
                      { value: 'sailing', label: 'Unter Segeln' },
                      { value: 'trailer', label: 'Auf dem Anhänger' },
                    ],
                  },
                },
              },
              ent('variant_entity'),
            ],
          },
          bool('show_variant_switch'),
          {
            type: 'expandable',
            name: 'images',
            title: LABELS.images,
            schema: [text('dock'), text('sailing'), text('trailer'), bool('image_remove_black')],
          },
          {
            type: 'expandable',
            name: 'gps',
            title: LABELS.gps,
            schema: [
              sensor('speed'),
              sensor('heading'),
              ent('location', ['device_tracker', 'person', 'zone']),
              sensor('lat'),
              sensor('lon'),
              sensor('altitude'),
              text('speed_unit'),
            ],
          },
        ];
      case 'battery':
        return [
          ...common,
          sensor('soc'),
          { type: 'grid', name: '', schema: [sensor('voltage'), sensor('current')] },
          { type: 'grid', name: '', schema: [sensor('power'), sensor('temperature')] },
          sensor('time_remaining'),
          ...CHART_FIELDS,
        ];
      case 'solar':
        return [
          ...common,
          sensor('power'),
          { type: 'grid', name: '', schema: [sensor('yield_today'), ent('state')] },
          { type: 'grid', name: '', schema: [sensor('voltage'), sensor('current')] },
          ...CHART_FIELDS,
        ];
      case 'fridge':
        return [
          ...common,
          ent('switch', ['switch', 'input_boolean']),
          sensor('temperature'),
          { type: 'grid', name: '', schema: [ent('target', ['sensor', 'number', 'input_number']), sensor('power')] },
        ];
      case 'camera':
        return [
          ...common,
          ent('camera', 'camera'),
          { type: 'grid', name: '', schema: [ent('switch', ['switch', 'input_boolean']), bool('ptz')] },
          { type: 'grid', name: '', schema: [ent('presets', 'select'), text('aspect_ratio')] },
        ];
      case 'grafana':
        return [
          ...common,
          text('url'),
          { type: 'grid', name: '', schema: [num('height', 150, 1200), bool('auto_params')] },
          bool('show_open'),
        ];
      case 'sensor':
      default:
        return [
          ...common,
          ent('entity'),
          ent('entity2'),
          { type: 'grid', name: '', schema: [text('unit'), num('precision', 0, 4)] },
          text('attribute'),
          ...CHART_FIELDS,
        ];
    }
  }

  // ---- section mutations ----
  private _sections(): SectionConfig[] {
    return (this._config?.sections ?? []).map((s) => ({ ...s }));
  }
  private _commit(sections: SectionConfig[]): void {
    this._emit({ ...(this._config as BoatCardConfig), sections });
  }
  private _sectionChanged(ev: CustomEvent, i: number): void {
    ev.stopPropagation();
    const sections = this._sections();
    sections[i] = { ...sections[i], ...ev.detail.value };
    this._commit(sections);
  }
  private _chipsChanged(ev: CustomEvent, i: number): void {
    ev.stopPropagation();
    const sections = this._sections();
    sections[i] = { ...sections[i], chips: ev.detail.value };
    this._commit(sections);
  }
  private _controlsChanged(ev: CustomEvent, i: number): void {
    ev.stopPropagation();
    const sections = this._sections();
    sections[i] = { ...sections[i], controls: ev.detail.value };
    this._commit(sections);
  }
  private _addSection(ev: Event): void {
    const type = (ev.target as HTMLSelectElement).value as SectionType;
    if (!type) return;
    (ev.target as HTMLSelectElement).value = '';
    const sections = this._sections();
    sections.push({ type });
    this._expanded = sections.length - 1;
    this._commit(sections);
  }
  private _removeSection(i: number): void {
    const sections = this._sections();
    sections.splice(i, 1);
    if (this._expanded === i) this._expanded = -1;
    this._commit(sections);
  }
  private _moveSection(i: number, dir: -1 | 1): void {
    const sections = this._sections();
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    [sections[i], sections[j]] = [sections[j], sections[i]];
    this._commit(sections);
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    const sections = this._config.sections ?? [];
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._topSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="sec-title">Sektionen</div>
      <div class="sec-list">
        ${sections.map((s, i) => this._renderSection(s, i))}
      </div>

      <div class="add-row">
        <select class="add-sel" @change=${this._addSection}>
          <option value="">+ Sektion hinzufügen …</option>
          ${SECTION_TYPES.map((ty) => html`<option value=${ty}>${SECTION_LABEL[ty]}</option>`)}
        </select>
      </div>
    `;
  }

  private _renderSection(s: SectionConfig, i: number): TemplateResult {
    const open = i === this._expanded;
    const preset = SECTION_PRESETS[s.type] ?? SECTION_PRESETS.sensor;
    const idEnt =
      s.entity ?? s.soc ?? s.power ?? s.camera ?? s.switch ?? s.url ?? '';
    const sub = s.name ?? friendlyName(getEntity(this.hass, idEnt), '');
    return html`<div class="sec ${open ? 'open' : ''}">
      <div class="sec-head" @click=${() => (this._expanded = open ? -1 : i)}>
        <ha-icon .icon=${s.icon ?? preset.icon}></ha-icon>
        <span class="sec-name">${SECTION_LABEL[s.type] ?? s.type}</span>
        ${sub ? html`<span class="sec-sub">${sub}</span>` : nothing}
        <span class="sp"></span>
        <ha-icon-button @click=${(e: Event) => { e.stopPropagation(); this._moveSection(i, -1); }}><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(e: Event) => { e.stopPropagation(); this._moveSection(i, 1); }}><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(e: Event) => { e.stopPropagation(); this._removeSection(i); }}><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
      </div>
      ${open
        ? html`<div class="sec-body">
            <ha-form
              .hass=${this.hass}
              .data=${s}
              .schema=${this._sectionSchema(s.type)}
              .computeLabel=${this._label}
              @value-changed=${(e: CustomEvent) => this._sectionChanged(e, i)}
            ></ha-form>
            ${s.type === 'boat'
              ? html`
                  <div class="sub-title">Chips auf dem Boot</div>
                  <div class="sub-sub">Punkte aufs Boot ziehen · Tabs = Positionen je Ansicht</div>
                  <boat-chips-editor
                    .hass=${this.hass}
                    .chips=${s.chips ?? []}
                    .images=${s.images}
                    @value-changed=${(e: CustomEvent) => this._chipsChanged(e, i)}
                  ></boat-chips-editor>
                  <div class="sub-title">Aktoren-Reihe</div>
                  <boat-items-editor
                    .hass=${this.hass}
                    .items=${s.controls ?? []}
                    .fields=${CONTROL_FIELDS}
                    addLabel="Aktor hinzufügen"
                    @value-changed=${(e: CustomEvent) => this._controlsChanged(e, i)}
                  ></boat-items-editor>
                `
              : nothing}
          </div>`
        : nothing}
    </div>`;
  }

  static styles = css`
    .sec-title,
    .sub-title {
      font-size: 0.95rem;
      font-weight: 600;
      margin: 18px 0 8px;
      color: var(--primary-text-color);
    }
    .sub-title {
      font-size: 0.85rem;
      margin: 16px 0 2px;
    }
    .sub-sub {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    .sec-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sec {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      overflow: hidden;
    }
    .sec-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 6px 6px 12px;
      cursor: pointer;
    }
    .sec-name {
      font-weight: 600;
    }
    .sec-sub {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 40%;
    }
    .sp {
      flex: 1;
    }
    .sec-body {
      padding: 10px 12px 14px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    .add-row {
      margin-top: 10px;
    }
    .add-sel {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px dashed var(--divider-color, #bbb);
      background: none;
      color: var(--primary-color, #5b7cfa);
      font: inherit;
      cursor: pointer;
    }
    ha-icon-button {
      --mdc-icon-button-size: 34px;
      color: var(--secondary-text-color);
    }
  `;
}

const CONTROL_FIELDS = [
  { name: 'entity', selector: { entity: { domain: ['switch', 'input_boolean', 'light'] } } },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
    ],
  },
  { name: 'icon_on', selector: { icon: {} } },
];
