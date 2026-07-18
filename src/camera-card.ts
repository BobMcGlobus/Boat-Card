import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import {
  getEntity,
  isOn,
  isUnavailable,
  toggleEntity,
  fireMoreInfo,
  domainOf,
} from './ha';
import { t } from './i18n';
import { sharedStyles, cardClass } from './styles';
import type { CameraCardConfig } from './types';

type PtzDir = 'left' | 'right' | 'up' | 'down' | 'zoom_in' | 'zoom_out';
const PTZ_DIRS: PtzDir[] = ['left', 'right', 'up', 'down', 'zoom_in', 'zoom_out'];

@customElement('boat-camera-card')
export class BoatCameraCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: CameraCardConfig;

  public setConfig(config: CameraCardConfig): void {
    if (!config || !config.camera)
      throw new Error('boat-camera-card: "camera" is required');
    this._config = config;
  }

  public getCardSize(): number {
    return 6;
  }

  static getStubConfig(): CameraCardConfig {
    return {
      type: 'custom:boat-camera-card',
      title: 'Kamera',
      card_style: 'marine',
      camera: 'camera.mast',
      ptz: true,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('boat-camera-card-editor');
  }

  // Resolve the six PTZ buttons: explicit config first, then auto-discovery.
  private _ptzButtons(): Partial<Record<PtzDir, string>> {
    const c = this._config!;
    if (c.ptz_buttons) return c.ptz_buttons;
    const out: Partial<Record<PtzDir, string>> = {};
    // group all *_ptz_<dir> button entities by their shared prefix
    const groups: Record<string, Partial<Record<PtzDir, string>>> = {};
    for (const id of Object.keys(this.hass.states)) {
      if (domainOf(id) !== 'button') continue;
      const m = id.match(/^button\.(.+)_ptz_(left|right|up|down|zoom_in|zoom_out)$/);
      if (!m) continue;
      const [, prefix, dir] = m;
      (groups[prefix] ??= {})[dir as PtzDir] = id;
    }
    const camObj = c.camera.split('.')[1] ?? '';
    let best = '';
    let bestScore = -1;
    for (const prefix of Object.keys(groups)) {
      const score = this._overlap(prefix, camObj);
      if (score > bestScore) {
        bestScore = score;
        best = prefix;
      }
    }
    return best ? groups[best] : out;
  }

  private _overlap(a: string, b: string): number {
    // length of the longest shared leading token run
    const at = a.split('_');
    const bt = b.split('_');
    let n = 0;
    while (n < at.length && n < bt.length && at[n] === bt[n]) n++;
    return n;
  }

  private _pressPtz(id?: string): void {
    if (!id) return;
    this.hass.callService('button', 'press', { entity_id: id });
  }

  private _selectPreset(ev: Event): void {
    const value = (ev.target as HTMLSelectElement).value;
    if (!value || !this._config?.presets) return;
    this.hass.callService('select', 'select_option', {
      entity_id: this._config.presets,
      option: value,
    });
  }

  private _renderImage(cam: any): TemplateResult {
    // ha-camera-stream is a built-in HA element; fall back to the snapshot img
    const pic = cam?.attributes?.entity_picture;
    return html`<div class="cam" @click=${() =>
      fireMoreInfo(this, this._config!.camera)}>
      ${cam
        ? html`<ha-camera-stream
            .hass=${this.hass}
            .stateObj=${cam}
            muted
          ></ha-camera-stream>`
        : nothing}
      ${!cam && pic ? html`<img src=${pic} alt="camera" />` : nothing}
    </div>`;
  }

  private _renderPtz(): TemplateResult | typeof nothing {
    const c = this._config!;
    if (c.ptz === false) return nothing;
    const b = this._ptzButtons();
    const hasAny = PTZ_DIRS.some((d) => b[d]);
    if (!hasAny && c.ptz !== true) return nothing;

    const btn = (dir: PtzDir, icon: string) =>
      html`<button
        class="ptz-btn"
        ?disabled=${!b[dir]}
        @click=${() => this._pressPtz(b[dir])}
      >
        <ha-icon .icon=${icon}></ha-icon>
      </button>`;

    return html`<div class="ptz">
      <div class="pad">
        <span></span>${btn('up', 'mdi:chevron-up')}<span></span>
        ${btn('left', 'mdi:chevron-left')}
        <ha-icon class="pad-center" icon="mdi:pan"></ha-icon>
        ${btn('right', 'mdi:chevron-right')} <span></span>
        ${btn('down', 'mdi:chevron-down')}<span></span>
      </div>
      <div class="zoom">
        ${btn('zoom_out', 'mdi:magnify-minus-outline')}
        ${btn('zoom_in', 'mdi:magnify-plus-outline')}
      </div>
    </div>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const c = this._config;
    const cls = cardClass(c.card_style, this.hass);
    const cam = getEntity(this.hass, c.camera);
    const power = getEntity(this.hass, c.power);
    const presetSel = getEntity(this.hass, c.presets);

    return html`<ha-card
      class=${cls}
      style="background:none;border:none;box-shadow:none"
    >
      <div class="bc-root ${c.background === false ? 'no-bg' : ''}">
        <div class="cam-head">
          ${c.title
            ? html`<div class="bc-title small">${c.title}</div>`
            : nothing}
          ${c.power
            ? html`<button
                class="pow ${isOn(power) ? 'on' : ''}"
                title=${t(this.hass, 'camera_power')}
                @click=${() => toggleEntity(this.hass, c.power!)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>`
            : nothing}
        </div>

        <div class="cam-wrap" style="--ar:${(c.aspect_ratio ?? '16:9').replace(':', '/')}">
          ${c.power && !isOn(power)
            ? html`<div class="cam off">
                <ha-icon icon="mdi:cctv-off"></ha-icon>
                <span>${t(this.hass, 'off')}</span>
              </div>`
            : this._renderImage(cam)}
        </div>

        ${presetSel && !isUnavailable(presetSel)
          ? html`<div class="presets">
              <ha-icon icon="mdi:map-marker-radius"></ha-icon>
              <select @change=${this._selectPreset}>
                ${(presetSel.attributes.options ?? []).map(
                  (o: string) =>
                    html`<option ?selected=${o === presetSel.state}>${o}</option>`
                )}
              </select>
            </div>`
          : nothing}

        ${this._renderPtz()}
      </div>
    </ha-card>`;
  }

  static styles = [
    sharedStyles,
    css`
      .cam-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .bc-title.small {
        font-size: 1.3rem;
      }
      .pow {
        border: 1px solid var(--bc-tile-border);
        background: var(--bc-tile-bg);
        color: var(--bc-muted);
        width: 36px;
        height: 36px;
        border-radius: 10px;
        cursor: pointer;
        display: grid;
        place-items: center;
      }
      .pow.on {
        color: var(--bc-accent);
        border-color: var(--bc-accent);
      }
      .cam-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: var(--ar, 16 / 9);
        border-radius: 14px;
        overflow: hidden;
        background: #000;
      }
      .cam {
        position: absolute;
        inset: 0;
        cursor: pointer;
      }
      .cam ha-camera-stream,
      .cam img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .cam.off {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: #8b949e;
        height: 100%;
      }
      .cam.off ha-icon {
        --mdc-icon-size: 40px;
      }
      .presets {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        color: var(--bc-muted);
      }
      .presets select {
        flex: 1;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--bc-tile-border);
        background: var(--bc-tile-bg);
        color: var(--bc-text);
        font: inherit;
      }
      .ptz {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        margin-top: 14px;
      }
      .pad {
        display: grid;
        grid-template-columns: repeat(3, 40px);
        grid-template-rows: repeat(3, 40px);
        gap: 4px;
        place-items: center;
      }
      .pad-center {
        --mdc-icon-size: 22px;
        color: var(--bc-muted);
      }
      .zoom {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ptz-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid var(--bc-tile-border);
        background: var(--bc-tile-bg);
        color: var(--bc-text);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: background 0.15s;
      }
      .ptz-btn:hover:not([disabled]) {
        background: color-mix(in srgb, var(--bc-accent) 25%, transparent);
      }
      .ptz-btn[disabled] {
        opacity: 0.35;
        cursor: default;
      }
    `,
  ];
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'boat-camera-card',
  name: 'Boat Camera Card',
  description: 'Reolink live view with PTZ controls and presets.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Boat-Card',
});
