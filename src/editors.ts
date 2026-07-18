import { LitElement, html, nothing, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import { fireEvent } from './ha';
import './chip-editor';

// ---- shared label table ----
const LABELS: Record<string, string> = {
  title: 'Titel',
  subtitle: 'Untertitel',
  card_style: 'Kartenstil',
  background: 'Hintergrund anzeigen',
  variant: 'Aktive Ansicht',
  variant_entity: 'Ansicht aus Entität',
  show_variant_switch: 'Umschalter anzeigen',
  image_remove_black: 'Schwarz transparent machen',
  images: 'Bilder (URLs)',
  dock: 'Am Steg (URL)',
  sailing: 'Unter Segeln (URL)',
  trailer: 'Auf dem Anhänger (URL)',
  gps: 'GPS',
  speed: 'Geschwindigkeit',
  heading: 'Kurs',
  location: 'Standort (device_tracker)',
  lat: 'Breitengrad (Sensor)',
  lon: 'Längengrad (Sensor)',
  speed_unit: 'Einheit Geschwindigkeit',
  main_battery: 'Hauptbatterie',
  motor_battery: 'Motorbatterie',
  solar_main: 'Solar Hauptmodul',
  solar_secondary: 'Solar Zweitmodul',
  soc: 'Ladezustand (%)',
  voltage: 'Spannung',
  current: 'Strom',
  power: 'Leistung',
  temperature: 'Temperatur',
  time_remaining: 'Restzeit',
  yield_today: 'Ertrag heute',
  state: 'Ladezustand (Text)',
  name: 'Name',
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
};

const STYLE_SELECT = {
  name: 'card_style',
  selector: {
    select: {
      mode: 'dropdown',
      options: [
        { value: 'marine', label: 'Marine (Blau)' },
        { value: 'glass', label: 'Glass' },
        { value: 'default', label: 'HA Standard' },
      ],
    },
  },
};

const sensor = (name: string) => ({
  name,
  selector: { entity: { domain: 'sensor' } },
});
const anyEntity = (name: string, domain?: string | string[]) => ({
  name,
  selector: { entity: domain ? { domain } : {} },
});
const text = (name: string) => ({ name, selector: { text: {} } });
const bool = (name: string) => ({ name, selector: { boolean: {} } });

// ---- base editor ----
class BoatEditorBase extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() protected _config?: any;

  public setConfig(config: any): void {
    this._config = config;
  }

  protected schema(): unknown[] {
    return [];
  }

  protected hint(): TemplateResult | typeof nothing {
    return nothing;
  }

  private _label = (s: any): string => LABELS[s?.name] ?? s?.name ?? '';

  /** Replace the whole config and notify Home Assistant. */
  protected _emit(config: any): void {
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }

  protected _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    this._emit({ ...this._config, ...ev.detail.value });
  }

  /** The scalar ha-form for this editor's schema(). */
  protected _formTemplate(): TemplateResult {
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema()}
      .computeLabel=${this._label}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    return html`${this.hint()} ${this._formTemplate()}`;
  }

  static styles = css`
    .hint {
      display: block;
      margin: 4px 0 12px;
      padding: 10px 12px;
      border-radius: 10px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .hint code {
      font-family: var(--code-font-family, monospace);
    }
    .section {
      margin-top: 18px;
    }
    .section-title {
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--primary-text-color);
    }
    .section-sub {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      margin: -4px 0 10px;
    }
  `;
}

const STAT_FIELDS = [
  { name: 'entity', selector: { entity: {} } },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'unit', selector: { text: {} } },
      { name: 'precision', selector: { number: { min: 0, max: 4, mode: 'box' } } },
    ],
  },
];

const CONTROL_FIELDS = [
  { name: 'entity', selector: { entity: {} } },
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

@customElement('boat-card-editor')
export class BoatCardEditor extends BoatEditorBase {
  private _chipsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._emit({ ...this._config, chips: ev.detail.value });
  }
  private _statsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._emit({ ...this._config, stats: ev.detail.value });
  }
  private _controlsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._emit({ ...this._config, controls: ev.detail.value });
  }

  override render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      ${this._formTemplate()}
      <div class="section">
        <div class="section-title">Chips auf dem Boot</div>
        <div class="section-sub">
          Ziehe die Punkte auf das Boot. Jede Ansicht (Steg/Segeln/Anhänger) hat
          eigene Positionen.
        </div>
        <boat-chips-editor
          .hass=${this.hass}
          .chips=${this._config.chips ?? []}
          .images=${this._config.images}
          @value-changed=${this._chipsChanged}
        ></boat-chips-editor>
      </div>
      <div class="section">
        <div class="section-title">Werte-Zeile</div>
        <boat-items-editor
          .hass=${this.hass}
          .items=${this._config.stats ?? []}
          .fields=${STAT_FIELDS}
          addLabel="Wert hinzufügen"
          @value-changed=${this._statsChanged}
        ></boat-items-editor>
      </div>
      <div class="section">
        <div class="section-title">Aktoren (Schalter-Reihe)</div>
        <boat-items-editor
          .hass=${this.hass}
          .items=${this._config.controls ?? []}
          .fields=${CONTROL_FIELDS}
          addLabel="Aktor hinzufügen"
          @value-changed=${this._controlsChanged}
        ></boat-items-editor>
      </div>
    `;
  }

  protected override schema() {
    return [
      text('title'),
      text('subtitle'),
      { type: 'grid', name: '', schema: [STYLE_SELECT, bool('show_variant_switch')] },
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
          anyEntity('variant_entity'),
        ],
      },
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
          anyEntity('location', ['device_tracker', 'person', 'zone']),
          sensor('lat'),
          sensor('lon'),
          text('speed_unit'),
        ],
      },
    ];
  }
}

const bankSchema = (name: string) => ({
  type: 'expandable',
  name,
  title: LABELS[name] ?? name,
  schema: [
    text('name'),
    sensor('soc'),
    sensor('voltage'),
    sensor('current'),
    sensor('power'),
    sensor('temperature'),
    sensor('time_remaining'),
  ],
});
const solarSchema = (name: string) => ({
  type: 'expandable',
  name,
  title: LABELS[name] ?? name,
  schema: [
    text('name'),
    sensor('power'),
    sensor('yield_today'),
    sensor('voltage'),
    sensor('current'),
    anyEntity('state'),
  ],
});

@customElement('boat-battery-card-editor')
export class BoatBatteryCardEditor extends BoatEditorBase {
  protected override schema() {
    return [
      text('title'),
      STYLE_SELECT,
      bankSchema('main_battery'),
      bankSchema('motor_battery'),
      solarSchema('solar_main'),
      solarSchema('solar_secondary'),
    ];
  }
}

@customElement('boat-fridge-card-editor')
export class BoatFridgeCardEditor extends BoatEditorBase {
  protected override schema() {
    return [
      text('title'),
      STYLE_SELECT,
      anyEntity('switch', ['switch', 'input_boolean']),
      sensor('temperature'),
      anyEntity('target', ['sensor', 'number', 'input_number']),
      sensor('power'),
    ];
  }
}

@customElement('boat-camera-card-editor')
export class BoatCameraCardEditor extends BoatEditorBase {
  protected override schema() {
    return [
      text('title'),
      STYLE_SELECT,
      anyEntity('camera', 'camera'),
      anyEntity('power', ['switch', 'input_boolean']),
      bool('ptz'),
      anyEntity('presets', 'select'),
      text('aspect_ratio'),
    ];
  }
}

@customElement('boat-grafana-card-editor')
export class BoatGrafanaCardEditor extends BoatEditorBase {
  protected override schema() {
    return [
      text('title'),
      STYLE_SELECT,
      text('url'),
      { name: 'height', selector: { number: { min: 150, max: 1200, mode: 'box' } } },
      { type: 'grid', name: '', schema: [bool('auto_params'), bool('show_open')] },
    ];
  }
}
