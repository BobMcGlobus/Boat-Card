import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import {
  getEntity,
  isOn,
  isUnavailable,
  toggleEntity,
  fireMoreInfo,
} from './ha';
import { fmtState } from './format';
import { t } from './i18n';
import { sharedStyles, cardClass } from './styles';
import type { FridgeCardConfig } from './types';

@customElement('boat-fridge-card')
export class BoatFridgeCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: FridgeCardConfig;

  public setConfig(config: FridgeCardConfig): void {
    if (!config || !config.switch)
      throw new Error('boat-fridge-card: "switch" is required');
    this._config = config;
  }

  public getCardSize(): number {
    return 3;
  }

  static getStubConfig(): FridgeCardConfig {
    return {
      type: 'custom:boat-fridge-card',
      title: 'Kühlschrank',
      card_style: 'marine',
      switch: 'switch.fridge',
      temperature: 'sensor.fridge_temperature',
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('boat-fridge-card-editor');
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const c = this._config;
    const cls = cardClass(c.card_style, this.hass);
    const sw = getEntity(this.hass, c.switch);
    const on = isOn(sw);
    const tempSt = getEntity(this.hass, c.temperature);

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
        <div class="fridge">
          <button
            class="power ${on ? 'on' : ''}"
            @click=${() => toggleEntity(this.hass, c.switch)}
          >
            <ha-icon icon="mdi:fridge-outline"></ha-icon>
            <span>${on ? t(this.hass, 'on') : t(this.hass, 'off')}</span>
          </button>

          <div class="readouts">
            ${c.temperature
              ? html`<div
                  class="ro"
                  @click=${() => fireMoreInfo(this, c.temperature!)}
                >
                  <span class="l">${t(this.hass, 'fridge_temp')}</span>
                  <span class="v"
                    >${fmtState(this.hass, tempSt, { precision: 1 })}</span
                  >
                </div>`
              : nothing}
            ${c.target && !isUnavailable(getEntity(this.hass, c.target))
              ? html`<div class="ro">
                  <span class="l">${t(this.hass, 'preset')}</span>
                  <span class="v"
                    >${fmtState(this.hass, getEntity(this.hass, c.target), {
                      precision: 1,
                    })}</span
                  >
                </div>`
              : nothing}
            ${c.power && !isUnavailable(getEntity(this.hass, c.power))
              ? html`<div class="ro">
                  <span class="l">${t(this.hass, 'power_now')}</span>
                  <span class="v"
                    >${fmtState(this.hass, getEntity(this.hass, c.power))}</span
                  >
                </div>`
              : nothing}
          </div>
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
      .fridge {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .power {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 96px;
        height: 96px;
        border-radius: 20px;
        border: 1px solid var(--bc-tile-border);
        background: var(--bc-tile-bg);
        color: var(--bc-muted);
        cursor: pointer;
        font: inherit;
        transition: all 0.15s;
        flex: 0 0 auto;
      }
      .power ha-icon {
        --mdc-icon-size: 40px;
      }
      .power.on {
        background: color-mix(in srgb, var(--bc-accent) 20%, transparent);
        border-color: var(--bc-accent);
        color: var(--bc-accent);
      }
      .readouts {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
      }
      .ro {
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }
      .ro .l {
        font-size: 0.78rem;
        color: var(--bc-muted);
      }
      .ro .v {
        font-size: 1.6rem;
        font-weight: 700;
      }
    `,
  ];
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'boat-fridge-card',
  name: 'Boat Fridge Card',
  description: 'Fridge power toggle with temperature and power readout.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Boat-Card',
});
