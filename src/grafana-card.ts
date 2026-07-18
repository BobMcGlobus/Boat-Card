import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import { t } from './i18n';
import { sharedStyles, cardClass } from './styles';
import type { GrafanaCardConfig } from './types';

@customElement('boat-grafana-card')
export class BoatGrafanaCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: GrafanaCardConfig;

  public setConfig(config: GrafanaCardConfig): void {
    if (!config || !config.url)
      throw new Error('boat-grafana-card: "url" is required');
    this._config = config;
  }

  public getCardSize(): number {
    const h = this._config?.height ?? 400;
    return Math.max(3, Math.round(h / 50));
  }

  static getStubConfig(): GrafanaCardConfig {
    return {
      type: 'custom:boat-grafana-card',
      title: 'Grafana',
      card_style: 'marine',
      url: 'https://grafana.local/d/xxxx/boat?orgId=1',
      height: 420,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('boat-grafana-card-editor');
  }

  private _prefersDark(): boolean {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  private _url(): string {
    const c = this._config!;
    if (c.auto_params === false) return c.url;
    let url = c.url;
    const add = (key: string, val?: string) => {
      if (new RegExp(`[?&]${key}(=|&|$)`).test(url)) return;
      url += (url.includes('?') ? '&' : '?') + (val ? `${key}=${val}` : key);
    };
    add('theme', this._prefersDark() ? 'dark' : 'light');
    add('kiosk');
    return url;
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
        <div class="g-head">
          ${c.title
            ? html`<div class="bc-title small">${c.title}</div>`
            : nothing}
          ${c.show_open !== false
            ? html`<a
                class="open"
                href=${c.url}
                target="_blank"
                rel="noopener"
                title=${t(this.hass, 'open_grafana')}
              >
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </a>`
            : nothing}
        </div>
        <iframe
          class="frame"
          style="height:${c.height ?? 400}px"
          src=${this._url()}
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </div>
    </ha-card>`;
  }

  static styles = [
    sharedStyles,
    css`
      .g-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .bc-title.small {
        font-size: 1.3rem;
      }
      .open {
        color: var(--bc-muted);
        text-decoration: none;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        border: 1px solid var(--bc-tile-border);
        background: var(--bc-tile-bg);
      }
      .open:hover {
        color: var(--bc-accent);
      }
      .frame {
        width: 100%;
        border: none;
        border-radius: 14px;
        background: #0b0f19;
        display: block;
      }
    `,
  ];
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'boat-grafana-card',
  name: 'Boat Grafana Card',
  description: 'Embed a Grafana dashboard/panel with kiosk + theme handling.',
  preview: true,
  documentationURL: 'https://github.com/BobMcGlobus/Boat-Card',
});
