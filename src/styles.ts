import { css } from 'lit';
import type { CardStyle } from './types';
import { isDark, type HomeAssistant } from './ha';

/** Map a card_style to the host class that drives the theme variables. */
export function styleClass(style?: CardStyle): string {
  switch (style) {
    case 'glass':
      return 's-glass';
    case 'default':
      return 's-default';
    case 'marine':
    default:
      return 's-marine';
  }
}

/** Full host class incl. the HA-theme-driven dark flag. */
export function cardClass(style: CardStyle | undefined, hass?: HomeAssistant): string {
  return styleClass(style) + (isDark(hass) ? ' dark' : '');
}

// Shared theme + layout styles for every card in the family.
export const sharedStyles = css`
  :host {
    /* colour tokens, all overridable by the card_style variants below */
    --bc-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
    /* solid surface colour (chips, borders) — must never be a gradient */
    --bc-surface: var(--card-background-color, #fff);
    --bc-text: var(--primary-text-color, #212121);
    --bc-muted: var(--secondary-text-color, #727272);
    --bc-tile-bg: color-mix(in srgb, var(--bc-text) 6%, transparent);
    --bc-tile-border: color-mix(in srgb, var(--bc-text) 10%, transparent);
    --bc-accent: var(--bc-marine, #5b7cfa);
    --bc-solar: #f5a623;
    --bc-battery: #34c759;
    --bc-water: #2aa5c7;
    --bc-radius: var(--ha-card-border-radius, 16px);
    --bc-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);
    display: block;
  }

  .bc-root {
    position: relative;
    color: var(--bc-text);
    background: var(--bc-card-bg);
    border-radius: var(--bc-radius);
    padding: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .bc-root.no-bg {
    background: none;
    padding: 0;
  }

  /* ---- card_style variants ---- */
  .s-default {
    --bc-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .s-marine {
    --bc-marine: #5b7cfa;
    --bc-card-bg: linear-gradient(
      170deg,
      #cfe0f5 0%,
      #bcd0f2 42%,
      #aebff0 100%
    );
    --bc-text: #16233a;
    --bc-muted: #48566e;
    --bc-surface: #ffffff;
    --bc-tile-bg: rgba(255, 255, 255, 0.28);
    --bc-tile-border: rgba(255, 255, 255, 0.45);
  }
  .s-glass {
    --bc-marine: #6d8bff;
    --bc-card-bg: color-mix(in srgb, var(--bc-text) 4%, transparent);
    --bc-tile-bg: color-mix(in srgb, var(--bc-text) 8%, transparent);
    backdrop-filter: blur(10px);
  }
  /* dark tokens are driven by the HA theme (hass.themes.darkMode), applied via
     the .dark class on the card_style host — not by prefers-color-scheme */
  .s-marine.dark {
    --bc-card-bg: linear-gradient(170deg, #223049 0%, #1a2740 55%, #141f34 100%);
    --bc-text: #eef3fb;
    --bc-muted: #a9b6cd;
    --bc-surface: #1a2740;
    --bc-tile-bg: rgba(255, 255, 255, 0.08);
    --bc-tile-border: rgba(255, 255, 255, 0.14);
  }

  /* ---- header ---- */
  .bc-head {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 12px;
  }
  .bc-title {
    font-size: 1.9rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }
  .bc-subtitle {
    font-size: 0.9rem;
    color: var(--bc-muted);
  }

  /* ---- generic tile ---- */
  .bc-grid {
    display: grid;
    gap: 12px;
  }
  .bc-tile {
    background: var(--bc-tile-bg);
    border: 1px solid var(--bc-tile-border);
    border-radius: 14px;
    padding: 12px 14px;
    box-sizing: border-box;
  }
  .bc-tile-head {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--bc-muted);
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .bc-tile-head ha-icon {
    --mdc-icon-size: 18px;
  }
  .bc-value {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.1;
  }
  .bc-value .u {
    font-size: 0.62em;
    font-weight: 600;
    color: var(--bc-muted);
    margin-left: 2px;
  }
  .bc-sub {
    font-size: 0.8rem;
    color: var(--bc-muted);
    margin-top: 3px;
  }

  /* ---- stat + controls rows (overview) ---- */
  .bc-stats {
    display: flex;
    justify-content: space-around;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 6px;
  }
  .bc-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    min-width: 64px;
    text-align: center;
  }
  .bc-stat ha-icon {
    --mdc-icon-size: 24px;
    color: var(--bc-accent);
  }
  .bc-stat .v {
    font-weight: 700;
    font-size: 1.05rem;
  }
  .bc-stat .l {
    font-size: 0.72rem;
    color: var(--bc-muted);
  }

  .bc-controls {
    display: flex;
    justify-content: space-around;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 14px;
  }
  .bc-ctl {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: var(--bc-muted);
    cursor: pointer;
    font: inherit;
    padding: 4px 6px;
    border-radius: 12px;
    transition: color 0.15s, background 0.15s;
  }
  .bc-ctl:hover {
    background: var(--bc-tile-bg);
  }
  .bc-ctl ha-icon {
    --mdc-icon-size: 26px;
  }
  .bc-ctl.on {
    color: var(--bc-accent);
  }
  .bc-ctl .cl {
    font-size: 0.78rem;
  }

  .bc-progress {
    height: 8px;
    border-radius: 5px;
    background: var(--bc-tile-border);
    overflow: hidden;
    margin-top: 8px;
  }
  .bc-progress > span {
    display: block;
    height: 100%;
    border-radius: 5px;
    background: var(--bar-color, var(--bc-accent));
    transition: width 0.4s ease;
  }
`;
