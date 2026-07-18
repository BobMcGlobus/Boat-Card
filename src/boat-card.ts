import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
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
} from './ha';
import { fmtState, fmtNumber, compass, joinUnit } from './format';
import { t } from './i18n';
import { sharedStyles, cardClass } from './styles';
import { boatScene } from './boat-scene';
import {
  BOAT_VARIANTS,
  type BoatCardConfig,
  type BoatVariant,
  type ChipConfig,
  type ChipPosition,
  type ControlConfig,
  type StatConfig,
  type DotDir,
} from './types';

// register the rest of the family + the editors into the single bundle
import './battery-card';
import './fridge-card';
import './camera-card';
import './grafana-card';
import './editors';

@customElement('boat-card')
export class BoatCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: BoatCardConfig;
  @state() private _override?: BoatVariant; // manual switch in the UI

  public setConfig(config: BoatCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = config;
    this._override = undefined;
  }

  public getCardSize(): number {
    return 8;
  }

  static getStubConfig(): BoatCardConfig {
    return {
      type: 'custom:boat-card',
      title: 'Hoppetosse',
      card_style: 'marine',
      variant: 'dock',
      show_variant_switch: true,
      chips: [
        {
          entity: 'sensor.solar_power',
          icon: 'mdi:solar-power',
          positions: {
            dock: { x: 22, y: 30, dot: 'right' },
            sailing: { x: 30, y: 24, dot: 'right' },
            trailer: { x: 24, y: 34, dot: 'right' },
          },
        },
        {
          entity: 'sensor.battery_soc',
          icon: 'mdi:battery',
          positions: {
            dock: { x: 70, y: 62, dot: 'left' },
            sailing: { x: 66, y: 60, dot: 'left' },
            trailer: { x: 72, y: 64, dot: 'left' },
          },
        },
      ],
      stats: [],
      controls: [],
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('boat-card-editor');
  }

  // ---- variant resolution ----
  private _variant(): BoatVariant {
    if (this._override) return this._override;
    const c = this._config!;
    if (c.variant_entity) {
      const st = getEntity(this.hass, c.variant_entity);
      if (st) {
        const mapped = c.variant_map?.[st.state];
        if (mapped) return mapped;
        if (BOAT_VARIANTS.includes(st.state as BoatVariant))
          return st.state as BoatVariant;
      }
    }
    return c.variant ?? 'dock';
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

  render() {
    if (!this._config || !this.hass) return nothing;
    const c = this._config;
    const variant = this._variant();
    const cls = cardClass(c.card_style, this.hass);
    const noBg = c.background === false;

    return html`
      <ha-card class=${cls} style="background:none;border:none;box-shadow:none">
        <div class="bc-root ${noBg ? 'no-bg' : ''}">
          ${c.title
            ? html`<div class="bc-head">
                <div class="bc-title">${c.title}</div>
                ${c.subtitle
                  ? html`<div class="bc-subtitle">${c.subtitle}</div>`
                  : nothing}
              </div>`
            : nothing}

          <div class="stage">
            ${this._renderImage(c, variant)}
            <div class="chip-layer">
              ${(c.chips ?? []).map((chip) => this._renderChip(chip, variant))}
            </div>
            ${c.show_variant_switch !== false
              ? this._renderSwitch(variant)
              : nothing}
          </div>

          ${this._renderStats(c)} ${this._renderGps(c)}
          ${this._renderControls(c)}
        </div>
      </ha-card>
    `;
  }

  private _renderImage(c: BoatCardConfig, variant: BoatVariant): TemplateResult {
    const url = c.images?.[variant];
    if (url) {
      return html`<img
        class="scene ${c.image_remove_black ? 'rm-black' : ''}"
        src=${url}
        alt=${variant}
      />`;
    }
    return html`<div class="scene svg">${boatScene(variant)}</div>`;
  }

  private _renderSwitch(active: BoatVariant): TemplateResult {
    return html`<div class="variant-switch">
      ${BOAT_VARIANTS.map(
        (v) => html`<button
          class=${v === active ? 'on' : ''}
          title=${t(this.hass, v)}
          @click=${() => (this._override = v)}
        >
          <ha-icon
            .icon=${v === 'dock'
              ? 'mdi:dock-top'
              : v === 'sailing'
                ? 'mdi:sail-boat'
                : 'mdi:truck-trailer'}
          ></ha-icon>
        </button>`
      )}
    </div>`;
  }

  // ---- chips ----
  private _chipPos(
    chip: ChipConfig,
    variant: BoatVariant
  ): ChipPosition | undefined {
    const p = chip.positions?.[variant];
    if (p) return p.hidden ? undefined : p;
    if (chip.x !== undefined && chip.y !== undefined)
      return { x: chip.x, y: chip.y, dot: chip.dot };
    return undefined;
  }

  private _renderChip(
    chip: ChipConfig,
    variant: BoatVariant
  ): TemplateResult | typeof nothing {
    const pos = this._chipPos(chip, variant);
    const st = getEntity(this.hass, chip.entity);
    if (!pos || !st) return nothing;

    const dir: DotDir = pos.dot ?? (pos.x >= 50 ? 'left' : 'right');
    const color = resolveColor(chip.color) ?? 'var(--bc-accent)';

    let value: string;
    if (chip.entity2) {
      const st2 = getEntity(this.hass, chip.entity2);
      value = `${fmtState(this.hass, st, { precision: chip.precision, unit: '' })} / ${fmtState(
        this.hass,
        st2,
        { precision: chip.precision }
      )}`;
    } else {
      value = fmtState(this.hass, st, {
        precision: chip.precision,
        unit: chip.unit,
        attribute: chip.attribute,
      } as any);
    }
    const name = chip.name ?? friendlyName(st, '');

    return html`<div
      class="anchor dot-${dir}"
      style="left:${pos.x}%;top:${pos.y}%;--ac:${color}"
      @click=${() => this._tapChip(chip)}
    >
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        ${chip.icon
          ? html`<ha-icon class="ci" .icon=${chip.icon}></ha-icon>`
          : nothing}
        <div class="anchor-txt">
          ${name ? html`<span class="anchor-name">${name}</span>` : nothing}
          <span class="anchor-val">${value}</span>
        </div>
      </div>
    </div>`;
  }

  // ---- stats row ----
  private _renderStats(c: BoatCardConfig): TemplateResult | typeof nothing {
    const stats = c.stats ?? [];
    if (!stats.length) return nothing;
    return html`<div class="bc-stats">
      ${stats.map((s) => {
        const cfg: StatConfig = typeof s === 'string' ? { entity: s } : s;
        const st = getEntity(this.hass, cfg.entity);
        const color = resolveColor(cfg.color);
        return html`<div
          class="bc-stat"
          @click=${() => fireMoreInfo(this, cfg.entity)}
        >
          ${cfg.icon
            ? html`<ha-icon
                .icon=${cfg.icon}
                style=${color ? `color:${color}` : ''}
              ></ha-icon>`
            : nothing}
          <span class="v"
            >${fmtState(this.hass, st, {
              precision: cfg.precision,
              unit: cfg.unit,
              attribute: cfg.attribute,
            } as any)}</span
          >
          <span class="l">${cfg.name ?? friendlyName(st, '')}</span>
        </div>`;
      })}
    </div>`;
  }

  // ---- gps footer ----
  private _renderGps(c: BoatCardConfig): TemplateResult | typeof nothing {
    const g = c.gps;
    if (!g) return nothing;
    const parts: TemplateResult[] = [];

    const speedSt = getEntity(this.hass, g.speed);
    if (speedSt && !isUnavailable(speedSt)) {
      parts.push(html`<span class="gps-item"
        ><ha-icon icon="mdi:speedometer"></ha-icon
        >${fmtState(this.hass, speedSt, { unit: g.speed_unit })}</span
      >`);
    }
    const headSt = getEntity(this.hass, g.heading);
    if (headSt && !isUnavailable(headSt)) {
      const deg = numeric(headSt);
      parts.push(html`<span class="gps-item"
        ><ha-icon icon="mdi:compass-outline"></ha-icon
        >${compass(deg)} ${Number.isFinite(deg)
          ? html`${fmtNumber(this.hass, deg, 0)}°`
          : ''}</span
      >`);
    }
    const coord = this._coords(g);
    if (coord) {
      parts.push(html`<span class="gps-item"
        ><ha-icon icon="mdi:map-marker"></ha-icon>${coord}</span
      >`);
    }
    if (!parts.length) return nothing;
    return html`<div class="gps-bar">${parts}</div>`;
  }

  private _coords(g: NonNullable<BoatCardConfig['gps']>): string {
    let lat = NaN;
    let lon = NaN;
    if (g.location) {
      const st = getEntity(this.hass, g.location);
      lat = numeric(st, 'latitude');
      lon = numeric(st, 'longitude');
    }
    if (!Number.isFinite(lat) && g.lat)
      lat = numeric(getEntity(this.hass, g.lat));
    if (!Number.isFinite(lon) && g.lon)
      lon = numeric(getEntity(this.hass, g.lon));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return '';
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }

  // ---- controls row (actor toggles) ----
  private _renderControls(c: BoatCardConfig): TemplateResult | typeof nothing {
    const controls = c.controls ?? [];
    if (!controls.length) return nothing;
    return html`<div class="bc-controls">
      ${controls.map((ct) => {
        const cfg: ControlConfig =
          typeof ct === 'string' ? { entity: ct } : ct;
        const st = getEntity(this.hass, cfg.entity);
        const on = isOn(st);
        const icon = on ? cfg.icon_on ?? cfg.icon : cfg.icon;
        return html`<button
          class="bc-ctl ${on ? 'on' : ''}"
          @click=${() => toggleEntity(this.hass, cfg.entity)}
        >
          <ha-icon .icon=${icon ?? 'mdi:power'}></ha-icon>
          <span class="cl">${cfg.name ?? friendlyName(st, '')}</span>
          <span class="cl">${on ? t(this.hass, 'on') : t(this.hass, 'off')}</span>
        </button>`;
      })}
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      .stage {
        position: relative;
        width: 100%;
        aspect-ratio: 41 / 24;
        margin: 4px 0 10px;
      }
      .scene {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .scene.svg :first-child {
        width: 100%;
        height: 100%;
      }
      .scene.rm-black {
        mix-blend-mode: screen;
      }
      .chip-layer {
        position: absolute;
        inset: 0;
      }

      /* variant switch */
      .variant-switch {
        position: absolute;
        top: 4px;
        right: 4px;
        display: flex;
        gap: 2px;
        background: var(--bc-tile-bg);
        border: 1px solid var(--bc-tile-border);
        border-radius: 999px;
        padding: 2px;
        backdrop-filter: blur(4px);
      }
      .variant-switch button {
        border: none;
        background: none;
        color: var(--bc-muted);
        cursor: pointer;
        border-radius: 999px;
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        padding: 0;
      }
      .variant-switch button.on {
        background: var(--bc-accent);
        color: #fff;
      }
      .variant-switch ha-icon {
        --mdc-icon-size: 18px;
      }

      /* chips (anchors) */
      .anchor {
        position: absolute;
        pointer-events: auto;
        cursor: pointer;
        --gap: 10px;
      }
      .anchor-dot {
        position: absolute;
        top: 0;
        left: 0;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: var(--ac);
        border: 2px solid var(--bc-surface, #fff);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
      .anchor-chip {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        gap: 6px;
        background: color-mix(in srgb, var(--bc-surface, #fff) 88%, transparent);
        color: var(--bc-text);
        border-radius: 0.9em;
        padding: 0.32em 0.7em;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
        white-space: nowrap;
        font-size: 0.8rem;
      }
      .anchor-chip .ci {
        --mdc-icon-size: 18px;
        color: var(--ac);
      }
      .anchor-txt {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }
      .anchor-name {
        font-size: 0.66rem;
        color: var(--bc-muted);
      }
      .anchor-val {
        font-weight: 700;
      }
      .anchor.dot-right .anchor-chip {
        transform: translate(calc(-100% - var(--gap)), -50%);
      }
      .anchor.dot-left .anchor-chip {
        transform: translate(var(--gap), -50%);
      }
      .anchor.dot-top .anchor-chip {
        transform: translate(-50%, calc(-100% - var(--gap)));
      }
      .anchor.dot-bottom .anchor-chip {
        transform: translate(-50%, var(--gap));
      }
      .anchor.dot-top-left .anchor-chip {
        transform: translate(calc(-100% - 4px), calc(-100% - 4px));
      }
      .anchor.dot-top-right .anchor-chip {
        transform: translate(4px, calc(-100% - 4px));
      }
      .anchor.dot-bottom-left .anchor-chip {
        transform: translate(calc(-100% - 4px), 4px);
      }
      .anchor.dot-bottom-right .anchor-chip {
        transform: translate(4px, 4px);
      }

      /* gps footer */
      .gps-bar {
        display: flex;
        justify-content: center;
        gap: 18px;
        flex-wrap: wrap;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--bc-tile-border);
        color: var(--bc-muted);
        font-size: 0.85rem;
      }
      .gps-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .gps-item ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bc-accent);
      }
    `,
  ];
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'boat-card',
  name: 'Boat Card',
  description:
    'Graphical boat overview with per-image configurable chips, stats, actor controls and GPS.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Boat-Card',
});
