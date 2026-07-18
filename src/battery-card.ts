import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import { getEntity, numeric, isUnavailable, fireMoreInfo } from './ha';
import { fmtState } from './format';
import { t } from './i18n';
import { sharedStyles, cardClass } from './styles';
import type {
  BatteryCardConfig,
  BatteryBankConfig,
  SolarArrayConfig,
} from './types';

@customElement('boat-battery-card')
export class BoatBatteryCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: BatteryCardConfig;

  public setConfig(config: BatteryCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = config;
  }

  public getCardSize(): number {
    return 5;
  }

  static getStubConfig(): BatteryCardConfig {
    return {
      type: 'custom:boat-battery-card',
      title: 'Batterie & Solar',
      card_style: 'marine',
      main_battery: {
        name: 'Hauptbatterie',
        soc: 'sensor.main_battery_soc',
        voltage: 'sensor.main_battery_voltage',
        current: 'sensor.main_battery_current',
      },
      solar_main: {
        name: 'Solar Hauptmodul',
        power: 'sensor.solar_main_power',
        yield_today: 'sensor.solar_main_yield_today',
      },
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('boat-battery-card-editor');
  }

  private _socColor(soc: number): string {
    if (!Number.isFinite(soc)) return 'var(--bc-muted)';
    if (soc >= 50) return 'var(--bc-battery)';
    if (soc >= 20) return 'var(--bc-solar)';
    return '#e5484d';
  }

  private _batteryTile(
    cfg: BatteryBankConfig | undefined,
    fallbackName: string
  ): TemplateResult | typeof nothing {
    if (!cfg) return nothing;
    const socSt = getEntity(this.hass, cfg.soc);
    const soc = numeric(socSt);
    const color = this._socColor(soc);
    const rows: TemplateResult[] = [];
    const add = (id: string | undefined, label: string) => {
      const st = getEntity(this.hass, id);
      if (!id || isUnavailable(st)) return;
      rows.push(html`<div class="kv">
        <span>${label}</span><b>${fmtState(this.hass, st)}</b>
      </div>`);
    };
    add(cfg.voltage, t(this.hass, 'voltage'));
    add(cfg.current, t(this.hass, 'current'));
    add(cfg.power, t(this.hass, 'power_now'));
    add(cfg.temperature, t(this.hass, 'temperature'));
    add(cfg.time_remaining, '⌛');

    return html`<div class="bc-tile" @click=${() =>
      cfg.soc && fireMoreInfo(this, cfg.soc)}>
      <div class="bc-tile-head">
        <ha-icon .icon=${cfg.icon ?? 'mdi:car-battery'}></ha-icon>
        ${cfg.name ?? fallbackName}
      </div>
      ${socSt
        ? html`<div class="bc-value" style="color:${color}">
              ${fmtState(this.hass, socSt, { unit: '%', precision: 0 })}
            </div>
            <div class="bc-progress">
              <span
                style="width:${Math.max(0, Math.min(100, soc || 0))}%;--bar-color:${color}"
              ></span>
            </div>`
        : nothing}
      <div class="kvs">${rows}</div>
    </div>`;
  }

  private _solarTile(
    cfg: SolarArrayConfig | undefined,
    fallbackName: string
  ): TemplateResult | typeof nothing {
    if (!cfg) return nothing;
    const powerSt = getEntity(this.hass, cfg.power);
    const rows: TemplateResult[] = [];
    const add = (id: string | undefined, label: string) => {
      const st = getEntity(this.hass, id);
      if (!id || isUnavailable(st)) return;
      rows.push(html`<div class="kv">
        <span>${label}</span><b>${fmtState(this.hass, st)}</b>
      </div>`);
    };
    add(cfg.yield_today, t(this.hass, 'yield_today'));
    add(cfg.voltage, t(this.hass, 'voltage'));
    add(cfg.current, t(this.hass, 'current'));
    add(cfg.state, t(this.hass, 'preset'));

    return html`<div class="bc-tile" @click=${() =>
      cfg.power && fireMoreInfo(this, cfg.power)}>
      <div class="bc-tile-head">
        <ha-icon icon="mdi:solar-power-variant"></ha-icon>
        ${cfg.name ?? fallbackName}
      </div>
      ${powerSt
        ? html`<div class="bc-value" style="color:var(--bc-solar)">
            ${fmtState(this.hass, powerSt, { unit: 'W', precision: 0 })}
          </div>`
        : nothing}
      <div class="kvs">${rows}</div>
    </div>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const c = this._config;
    const cls = cardClass(c.card_style, this.hass);
    return html`<ha-card
      class=${cls}
      style="background:none;border:none;box-shadow:none"
    >
      <div class="bc-root ${c.background === false ? 'no-bg' : ''}">
        ${c.title
          ? html`<div class="bc-head">
              <div class="bc-title small">${c.title}</div>
            </div>`
          : nothing}
        <div class="bc-grid two">
          ${this._batteryTile(c.main_battery, t(this.hass, 'main_battery'))}
          ${this._batteryTile(c.motor_battery, t(this.hass, 'motor_battery'))}
          ${this._solarTile(c.solar_main, t(this.hass, 'solar_main'))}
          ${this._solarTile(c.solar_secondary, t(this.hass, 'solar_secondary'))}
        </div>
      </div>
    </ha-card>`;
  }

  static styles = [
    sharedStyles,
    css`
      .bc-title.small {
        font-size: 1.3rem;
      }
      .bc-grid.two {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
      .bc-tile {
        cursor: pointer;
      }
      .kvs {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .kv {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--bc-muted);
      }
      .kv b {
        color: var(--bc-text);
        font-weight: 600;
      }
    `,
  ];
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'boat-battery-card',
  name: 'Boat Battery & Solar Card',
  description: 'Main + motor battery banks and Victron solar arrays.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Boat-Card',
});
