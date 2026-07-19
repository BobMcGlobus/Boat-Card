import { css } from 'lit';
import { CARD_STYLES, type CardStyle } from './types';

/** Validate + map a card_style to its host class (default: soft base). */
export function styleClass(style?: CardStyle): string {
  const s = style && CARD_STYLES.includes(style) ? style : 'default';
  return `s-${s}`;
}

// Structure + the six card styles, mirroring HealthCard (tokens renamed --bc-*).
export const sharedStyles = css`
  :host {
    --bc-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
    --bc-tile-bg: color-mix(in srgb, var(--primary-text-color) 4%, var(--bc-card-bg));
    --bc-dot-fill: var(--bc-tile-bg);
    --bc-accent: #5b7cfa;
    --bc-battery: #34c759;
    --bc-solar: #f5a623;
    --bc-danger: #e5484d;
  }
  .cardroot {
    display: block;
    padding: 16px;
  }
  .cardroot.flat {
    --bc-tile-bg: transparent;
    --bc-dot-fill: var(--bc-card-bg);
  }
  .cardroot.nobg {
    background: none;
    box-shadow: none;
    border: none;
  }
  .cardroot.flush {
    padding: 0;
  }
  .cardroot.flush .header {
    padding: 0 0 14px 0;
  }

  /* ---- card styles (descendant selectors so tiles + popups match) ---- */

  /* default: soft tinted tiles = the base tokens (nothing extra needed) */

  /* liquid glass: translucent, blurred, specular edge */
  .s-glass {
    --bc-tile-bg: color-mix(in srgb, var(--bc-card-bg) 42%, transparent);
    --bc-dot-fill: var(--bc-card-bg);
    --bc-tile-radius: 22px;
  }
  ha-card.cardroot.s-glass {
    background: color-mix(in srgb, var(--bc-card-bg) 55%, transparent);
    -webkit-backdrop-filter: blur(18px) saturate(1.5);
    backdrop-filter: blur(18px) saturate(1.5);
  }
  .s-glass .metric {
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    /* no outer drop shadow — it reads as dark bands between stacked tiles */
    box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 25%, transparent);
    -webkit-backdrop-filter: blur(18px) saturate(1.5);
    backdrop-filter: blur(18px) saturate(1.5);
  }
  .s-glass .iconchip {
    background: color-mix(in srgb, var(--bc-accent) 24%, transparent);
    border: 1px solid color-mix(in srgb, #fff 30%, transparent);
    box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 40%, transparent);
  }

  /* material you: tonal tiles, filled icon, top-left colour orb */
  .s-material {
    --bc-tile-radius: 24px;
  }
  ha-card.cardroot.s-material {
    border-radius: 28px;
  }
  .s-material .metric {
    position: relative;
    overflow: hidden;
    background: color-mix(in srgb, var(--bc-accent) 12%, var(--bc-card-bg));
    --bc-dot-fill: color-mix(in srgb, var(--bc-accent) 12%, var(--bc-card-bg));
  }
  .s-material .metric::before {
    content: '';
    position: absolute;
    top: -70px;
    left: -70px;
    width: 190px;
    height: 190px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--bc-accent) 22%, transparent);
    pointer-events: none;
  }
  .s-material .metric > * {
    position: relative;
  }
  .s-material .iconchip {
    border-radius: 14px;
    background: var(--bc-accent);
    color: var(--bc-card-bg);
  }

  /* bubble: floating solid modules with big icon bubbles */
  .s-bubble {
    --bc-tile-bg: var(--bc-card-bg);
    --bc-dot-fill: var(--bc-card-bg);
    --bc-tile-radius: 32px;
  }
  ha-card.cardroot.s-bubble {
    background: none;
    box-shadow: none;
    border: none;
  }
  .s-bubble .metric {
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
    padding: 12px 16px;
  }
  .s-bubble .iconchip {
    width: 42px;
    height: 42px;
    background: color-mix(in srgb, var(--bc-accent) 20%, transparent);
  }
  .s-bubble .iconchip ha-icon {
    --mdc-icon-size: 22px;
  }
  .s-bubble .name {
    font-weight: 700;
  }

  /* magic mirror: pure black, high contrast, monochrome */
  .s-mirror {
    --bc-tile-bg: #000;
    --bc-dot-fill: #000;
    --bc-tile-radius: 14px;
    color: #fff;
  }
  ha-card.cardroot.s-mirror {
    background: #000;
    box-shadow: none;
    border: none;
  }
  .s-mirror .metric {
    border: 1px solid rgba(255, 255, 255, 0.28);
  }
  .s-mirror .metric:hover {
    background: #0d0d0d;
    --bc-tile-bg: #0d0d0d;
  }
  .s-mirror .title,
  .s-mirror .name,
  .s-mirror .value,
  .s-mirror .kv b,
  .s-mirror .stat-value {
    color: #fff;
  }
  .s-mirror .subtitle,
  .s-mirror .unit,
  .s-mirror .secondary,
  .s-mirror .kv span,
  .s-mirror .status {
    color: rgba(255, 255, 255, 0.72);
  }

  /* ---- base structure ---- */
  .header {
    padding: 4px 4px 16px 4px;
  }
  .title {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: var(--primary-text-color);
  }
  .subtitle {
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(var(--bc-columns, 1), minmax(0, 1fr));
    gap: 12px;
  }
  .cardroot.flat .metrics {
    gap: 4px;
  }
  .cardroot.flat .metric {
    border: none;
    box-shadow: none;
  }
  .metrics.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .metrics.carousel::-webkit-scrollbar {
    display: none;
  }
  .metrics.carousel > .metric {
    flex: 0 0 min(85%, 320px);
    scroll-snap-align: center;
  }
  .metric {
    background: var(--bc-tile-bg);
    border-radius: var(--bc-tile-radius, 16px);
    box-sizing: border-box;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: background 0.15s ease;
  }
  /* the boat hero spans the full grid width */
  .metric.full {
    grid-column: 1 / -1;
  }
  .metric.clickable {
    cursor: pointer;
  }
  .metric.clickable:hover {
    background: color-mix(in srgb, var(--primary-text-color) 7%, var(--bc-card-bg));
    --bc-tile-bg: color-mix(in srgb, var(--primary-text-color) 7%, var(--bc-card-bg));
  }
  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .iconchip {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bc-accent);
    background: color-mix(in srgb, var(--bc-accent) 14%, transparent);
  }
  .iconchip ha-icon {
    --mdc-icon-size: 18px;
  }
  .name {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .value {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    color: var(--primary-text-color);
  }
  .value .unit {
    font-size: 14px;
    font-weight: 600;
    color: var(--secondary-text-color);
    margin-left: 2px;
    letter-spacing: 0;
  }
  .secondary {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .missing {
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  /* ---- value tile: value + trend + mini chart ---- */
  .tile-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }
  .tile-inner.clickable {
    cursor: pointer;
  }
  .time {
    font-size: 12px;
    color: var(--secondary-text-color);
    flex: none;
  }
  .body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 14px;
    align-items: center;
  }
  .body.stack {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .trend {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-weight: 600;
  }
  .trend.up {
    color: var(--bc-battery);
  }
  .trend.down {
    color: var(--bc-danger);
  }
  .trend.flat {
    color: var(--secondary-text-color);
  }
  .chartcell {
    min-width: 0;
  }
  .chart {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }
  .chart .axis {
    font-size: 8px;
    fill: var(--secondary-text-color);
  }
  .secondary-vals {
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  /* ---- key/value rows (battery, solar) ---- */
  .kvs {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .kv {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .kv b {
    color: var(--primary-text-color);
    font-weight: 600;
  }
  .progress {
    height: 8px;
    border-radius: 5px;
    background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    overflow: hidden;
  }
  .progress > span {
    display: block;
    height: 100%;
    border-radius: 5px;
    background: var(--bar-color, var(--bc-accent));
    transition: width 0.4s ease;
  }

  /* ---- boat hero: stage + chips ---- */
  .stage {
    position: relative;
    width: 100%;
    /* taller hero stage — the boat image is the centerpiece of the card */
    aspect-ratio: 41 / 32;
  }
  .scene {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .scene.rm-black {
    mix-blend-mode: screen;
  }
  .variant-switch {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    gap: 2px;
    background: color-mix(in srgb, var(--bc-card-bg) 70%, transparent);
    border-radius: 999px;
    padding: 2px;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .variant-switch button {
    border: none;
    background: none;
    color: var(--secondary-text-color);
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

  /* anchors / chips (dot sits ON x/y, label offsets by direction) */
  .anchor {
    position: absolute;
    cursor: pointer;
    --gap: 9px;
    --dg: 2px;
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
    border: 2px solid var(--bc-card-bg);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  .anchor-chip {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    background: color-mix(in srgb, var(--bc-card-bg) 90%, transparent);
    border-radius: 0.9em;
    padding: 0.34em 0.7em;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
    white-space: nowrap;
    font-size: 12px;
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
    font-size: 0.82em;
    font-weight: 600;
    color: color-mix(in srgb, var(--primary-text-color) 82%, transparent);
  }
  .anchor-val {
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .anchor.dot-right .anchor-chip {
    transform: translate(calc(-100% - var(--gap)), -50%);
  }
  .anchor.dot-left .anchor-chip {
    transform: translate(var(--gap), -50%);
  }
  .anchor.dot-top .anchor-chip {
    transform: translate(-50%, var(--gap));
  }
  .anchor.dot-bottom .anchor-chip {
    transform: translate(-50%, calc(-100% - var(--gap)));
  }
  .anchor.dot-top-left .anchor-chip {
    transform: translate(var(--dg), var(--dg));
  }
  .anchor.dot-top-right .anchor-chip {
    transform: translate(calc(-100% - var(--dg)), var(--dg));
  }
  .anchor.dot-bottom-left .anchor-chip {
    transform: translate(var(--dg), calc(-100% - var(--dg)));
  }
  .anchor.dot-bottom-right .anchor-chip {
    transform: translate(calc(-100% - var(--dg)), calc(-100% - var(--dg)));
  }
  .s-glass .anchor-chip {
    border: 1px solid color-mix(in srgb, #fff 30%, transparent);
    -webkit-backdrop-filter: blur(8px) saturate(1.4);
    backdrop-filter: blur(8px) saturate(1.4);
  }
  .s-material .anchor-chip {
    border-radius: 14px;
  }
  .s-mirror .anchor-chip {
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .s-mirror .anchor-dot {
    border-color: #000;
  }

  /* ---- gps footer + controls row (inside boat hero) ---- */
  .gps-bar {
    display: flex;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    color: var(--secondary-text-color);
    font-size: 13px;
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
  .controls {
    display: flex;
    justify-content: space-around;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .ctl {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    font: inherit;
    padding: 4px 6px;
    border-radius: 12px;
  }
  .ctl:hover {
    background: var(--bc-tile-bg);
  }
  .ctl ha-icon {
    --mdc-icon-size: 26px;
  }
  .ctl.on {
    color: var(--bc-accent);
  }
  .ctl .cl {
    font-size: 12px;
  }

  /* ---- fridge ---- */
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
    width: 84px;
    height: 84px;
    border-radius: 18px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    color: var(--secondary-text-color);
    cursor: pointer;
    font: inherit;
    flex: 0 0 auto;
    transition: all 0.15s;
  }
  .power ha-icon {
    --mdc-icon-size: 34px;
  }
  .power.on {
    background: color-mix(in srgb, var(--bc-accent) 20%, transparent);
    border-color: var(--bc-accent);
    color: var(--bc-accent);
  }
  .readouts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .ro .l {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .ro .v {
    font-size: 22px;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  /* ---- camera ---- */
  .cam-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: var(--ar, 16 / 9);
    border-radius: 12px;
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
    margin-top: 10px;
    color: var(--secondary-text-color);
  }
  .presets select {
    flex: 1;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 15%, transparent);
    background: var(--bc-tile-bg);
    color: var(--primary-text-color);
    font: inherit;
  }
  .ptz {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 12px;
  }
  .pad {
    display: grid;
    grid-template-columns: repeat(3, 38px);
    grid-template-rows: repeat(3, 38px);
    gap: 4px;
    place-items: center;
  }
  .pad-center {
    --mdc-icon-size: 22px;
    color: var(--secondary-text-color);
  }
  .zoom {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ptz-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 15%, transparent);
    background: var(--bc-tile-bg);
    color: var(--primary-text-color);
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .ptz-btn:hover:not([disabled]) {
    background: color-mix(in srgb, var(--bc-accent) 25%, transparent);
  }
  .ptz-btn[disabled] {
    opacity: 0.35;
    cursor: default;
  }

  /* ---- grafana ---- */
  .g-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .g-open {
    color: var(--secondary-text-color);
    text-decoration: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: var(--bc-tile-bg);
  }
  .frame {
    width: 100%;
    border: none;
    border-radius: 10px;
    background: #0b0f19;
    display: block;
  }

  /* ---- detail popup ---- */
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 9;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 16px;
  }
  .dialog {
    width: min(560px, 94vw);
    max-height: 88vh;
    overflow: auto;
    box-sizing: border-box;
    background: var(--bc-card-bg);
    color: var(--primary-text-color);
    border-radius: 20px;
    padding: 18px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
  }
  .s-glass .dialog {
    background: color-mix(in srgb, var(--bc-card-bg) 60%, transparent);
    -webkit-backdrop-filter: blur(24px) saturate(1.5);
    backdrop-filter: blur(24px) saturate(1.5);
    border: 1px solid color-mix(in srgb, #fff 25%, transparent);
  }
  .s-mirror .dialog {
    background: #000;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
  .dialog-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .dialog-title {
    font-size: 20px;
    font-weight: 700;
    flex: 1;
  }
  .close {
    border: none;
    background: var(--bc-tile-bg);
    color: inherit;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .ranges {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .range {
    border: none;
    background: var(--bc-tile-bg);
    color: var(--secondary-text-color);
    border-radius: 999px;
    padding: 6px 12px;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
  }
  .range.on {
    background: var(--bc-accent);
    color: #fff;
  }
  .bigchart {
    width: 100%;
    overflow-x: auto;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 12px;
  }
  .stat-tile {
    background: var(--bc-tile-bg);
    border-radius: 12px;
    padding: 10px;
    text-align: center;
  }
  .stat-label {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
`;
