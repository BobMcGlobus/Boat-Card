import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './ha';
import { getEntity, friendlyName, resolveColor } from './ha';
import { fmtState } from './format';
import { boatScene } from './boat-scene';
import {
  BOAT_VARIANTS,
  type BoatVariant,
  type ChipConfig,
  type ChipPosition,
  type DotDir,
} from './types';

const VARIANT_LABEL: Record<BoatVariant, string> = {
  dock: 'Am Steg',
  sailing: 'Segeln',
  trailer: 'Anhänger',
};

const DOT_OPTIONS = [
  'right',
  'left',
  'top',
  'bottom',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
].map((v) => ({ value: v, label: v }));

const CHIP_LABELS: Record<string, string> = {
  entity: 'Entität',
  entity2: 'Zweite Entität (z. B. Strom)',
  name: 'Name',
  icon: 'Icon',
  icon_on: 'Icon (wenn an)',
  color: 'Farbe (Token oder #hex)',
  unit: 'Einheit',
  precision: 'Nachkommastellen',
  tap_action: 'Tippen',
  x: 'X (%)',
  y: 'Y (%)',
  dot: 'Label-Richtung',
  hidden: 'In dieser Ansicht ausblenden',
};

function clean<T extends Record<string, any>>(obj: T): T {
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return out;
}

/** Deep-ish clone of the chips array (positions objects copied). */
function cloneChips(chips: ChipConfig[]): ChipConfig[] {
  return chips.map((c) => ({
    ...c,
    positions: c.positions
      ? (Object.fromEntries(
          Object.entries(c.positions).map(([k, v]) => [k, { ...v }])
        ) as ChipConfig['positions'])
      : undefined,
  }));
}

@customElement('boat-chips-editor')
export class BoatChipsEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public chips: ChipConfig[] = [];
  @property({ attribute: false }) public images?: Partial<Record<BoatVariant, string>>;

  @state() private _variant: BoatVariant = 'dock';
  @state() private _expanded = -1;
  @state() private _working?: ChipConfig[]; // live copy while dragging
  private _drag?: { index: number; pointerId: number; moved: boolean; x0: number; y0: number };

  private get _chips(): ChipConfig[] {
    return this._working ?? this.chips ?? [];
  }

  private _emit(chips: ChipConfig[]): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: chips.map((c) => clean(c)) },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ---- drag placement ----
  private _stageRect(): DOMRect | undefined {
    const stage = this.renderRoot?.querySelector('.ce-stage') as HTMLElement | null;
    return stage?.getBoundingClientRect();
  }

  private _onDotDown(ev: PointerEvent, index: number): void {
    ev.preventDefault();
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    this._working = cloneChips(this.chips);
    this._drag = { index, pointerId: ev.pointerId, moved: false, x0: ev.clientX, y0: ev.clientY };
  }

  private _onDotMove(ev: PointerEvent): void {
    if (!this._drag) return;
    if (Math.abs(ev.clientX - this._drag.x0) + Math.abs(ev.clientY - this._drag.y0) > 3)
      this._drag.moved = true;
    const r = this._stageRect();
    if (!r) return;
    let x = ((ev.clientX - r.left) / r.width) * 100;
    let y = ((ev.clientY - r.top) / r.height) * 100;
    x = Math.max(0, Math.min(100, Math.round(x * 10) / 10));
    y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
    const chip = this._working![this._drag.index];
    const prev = (chip.positions?.[this._variant] as ChipPosition) ?? { x: 50, y: 50 };
    chip.positions = { ...(chip.positions ?? {}), [this._variant]: { ...prev, x, y } };
    this.requestUpdate();
  }

  private _onDotUp(ev: PointerEvent, index: number): void {
    if (!this._drag) return;
    const moved = this._drag.moved;
    const chips = this._working ?? this.chips;
    this._drag = undefined;
    this._working = undefined;
    if (moved) this._emit(chips);
    else this._expanded = this._expanded === index ? -1 : index; // tap = toggle detail
  }

  private _chipPos(chip: ChipConfig): ChipPosition | undefined {
    const p = chip.positions?.[this._variant];
    return p && !p.hidden ? p : undefined;
  }

  // ---- chip mutations ----
  private _addChip(): void {
    const chips = cloneChips(this.chips);
    chips.push({
      entity: '',
      positions: { [this._variant]: { x: 50, y: 50, dot: 'right' } },
    });
    this._expanded = chips.length - 1;
    this._emit(chips);
  }

  private _removeChip(i: number): void {
    const chips = cloneChips(this.chips);
    chips.splice(i, 1);
    if (this._expanded === i) this._expanded = -1;
    this._emit(chips);
  }

  private _moveChip(i: number, dir: -1 | 1): void {
    const chips = cloneChips(this.chips);
    const j = i + dir;
    if (j < 0 || j >= chips.length) return;
    [chips[i], chips[j]] = [chips[j], chips[i]];
    this._emit(chips);
  }

  private _placeHere(i: number): void {
    const chips = cloneChips(this.chips);
    chips[i].positions = {
      ...(chips[i].positions ?? {}),
      [this._variant]: { x: 50, y: 50, dot: 'right' },
    };
    this._emit(chips);
  }

  private _chipSchema() {
    return [
      { name: 'entity', selector: { entity: {} } },
      { name: 'entity2', selector: { entity: {} } },
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
          { name: 'color', selector: { text: {} } },
          { name: 'unit', selector: { text: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'precision', selector: { number: { min: 0, max: 4, mode: 'box' } } },
          {
            name: 'tap_action',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'more-info', label: 'Info-Dialog' },
                  { value: 'toggle', label: 'Schalten' },
                  { value: 'link', label: 'Link' },
                  { value: 'none', label: 'Nichts' },
                ],
              },
            },
          },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'x', selector: { number: { min: 0, max: 100, step: 0.5, mode: 'box' } } },
          { name: 'y', selector: { number: { min: 0, max: 100, step: 0.5, mode: 'box' } } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'dot', selector: { select: { mode: 'dropdown', options: DOT_OPTIONS } } },
          { name: 'hidden', selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _flatten(chip: ChipConfig): Record<string, unknown> {
    const p = (chip.positions?.[this._variant] as ChipPosition) ?? {};
    return clean({
      entity: chip.entity,
      entity2: chip.entity2,
      name: chip.name,
      icon: chip.icon,
      color: chip.color,
      unit: chip.unit,
      precision: chip.precision,
      tap_action: chip.tap_action,
      x: p.x,
      y: p.y,
      dot: p.dot,
      hidden: p.hidden,
    });
  }

  private _chipFormChanged(ev: CustomEvent, i: number): void {
    ev.stopPropagation();
    const v = ev.detail.value as any;
    const chips = cloneChips(this.chips);
    const c = chips[i];
    c.entity = v.entity ?? '';
    c.entity2 = v.entity2 || undefined;
    c.name = v.name || undefined;
    c.icon = v.icon || undefined;
    c.color = v.color || undefined;
    c.unit = v.unit || undefined;
    c.precision = v.precision;
    c.tap_action = v.tap_action || undefined;
    const positions = { ...(c.positions ?? {}) };
    if (v.x !== undefined && v.y !== undefined) {
      positions[this._variant] = {
        x: v.x,
        y: v.y,
        dot: (v.dot as DotDir) || undefined,
        hidden: v.hidden || undefined,
      } as ChipPosition;
    } else if (v.hidden) {
      positions[this._variant] = {
        ...(positions[this._variant] ?? { x: 50, y: 50 }),
        hidden: true,
      } as ChipPosition;
    } else {
      delete positions[this._variant];
    }
    c.positions = positions;
    this._emit(chips);
  }

  private _label = (s: any) => CHIP_LABELS[s?.name] ?? s?.name ?? '';

  render() {
    const chips = this._chips;
    return html`
      <div class="ce">
        <div class="ce-tabs">
          ${BOAT_VARIANTS.map(
            (v) => html`<button
              class=${v === this._variant ? 'on' : ''}
              @click=${() => (this._variant = v)}
            >
              ${VARIANT_LABEL[v]}
            </button>`
          )}
        </div>

        <div class="ce-stage-wrap">
          <div class="ce-stage">
            ${this.images?.[this._variant]
              ? html`<img src=${this.images[this._variant]} alt="" />`
              : html`<div class="svg">${boatScene(this._variant)}</div>`}
            ${chips.map((chip, i) => this._renderDot(chip, i))}
          </div>
          <div class="ce-hint">
            Punkte auf das Boot ziehen · Antippen zum Bearbeiten ·
            Ansicht: <b>${VARIANT_LABEL[this._variant]}</b>
          </div>
        </div>

        <div class="ce-list">
          ${chips.map((chip, i) => this._renderRow(chip, i))}
        </div>

        <button class="ce-add" @click=${this._addChip}>
          <ha-icon icon="mdi:plus"></ha-icon> Chip hinzufügen
        </button>
      </div>
    `;
  }

  private _renderDot(chip: ChipConfig, i: number): TemplateResult | typeof nothing {
    const pos = this._chipPos(chip);
    if (!pos) return nothing;
    const st = getEntity(this.hass, chip.entity);
    const color = resolveColor(chip.color) ?? 'var(--bc-accent, #5b7cfa)';
    const val = st ? fmtState(this.hass, st, { precision: chip.precision, unit: chip.unit } as any) : '—';
    const dir: DotDir = pos.dot ?? (pos.x >= 50 ? 'left' : 'right');
    const label = (chip.name ?? friendlyName(st, chip.entity)) || `#${i + 1}`;
    // WYSIWYG anchor: the draggable dot sits exactly on x/y, the label offsets
    // in the configured direction — same geometry the card uses.
    return html`<div
      class="ce-anchor dot-${dir} ${i === this._expanded ? 'active' : ''}"
      style="left:${pos.x}%;top:${pos.y}%;--ac:${color}"
    >
      <span
        class="ce-adot"
        @pointerdown=${(e: PointerEvent) => this._onDotDown(e, i)}
        @pointermove=${this._onDotMove}
        @pointerup=${(e: PointerEvent) => this._onDotUp(e, i)}
        @pointercancel=${(e: PointerEvent) => this._onDotUp(e, i)}
        title=${label}
      ></span>
      <span
        class="ce-albl"
        @click=${() => (this._expanded = this._expanded === i ? -1 : i)}
        >${label}: ${val}</span
      >
    </div>`;
  }

  private _renderRow(chip: ChipConfig, i: number): TemplateResult {
    const st = getEntity(this.hass, chip.entity);
    const placed = !!chip.positions?.[this._variant];
    const hidden = !!chip.positions?.[this._variant]?.hidden;
    const color = resolveColor(chip.color) ?? 'var(--bc-accent, #5b7cfa)';
    const name = (chip.name ?? friendlyName(st, chip.entity)) || `Chip #${i + 1}`;
    const open = i === this._expanded;
    return html`<div class="ce-row ${open ? 'open' : ''}">
      <div class="ce-row-head" @click=${() => (this._expanded = open ? -1 : i)}>
        <span class="swatch" style="background:${color}"></span>
        <span class="rn">${name}</span>
        <span class="badge ${placed ? (hidden ? 'hid' : 'ok') : 'no'}">
          ${placed ? (hidden ? 'ausgeblendet' : 'platziert') : 'nicht in dieser Ansicht'}
        </span>
        <span class="sp"></span>
        <ha-icon-button
          .label=${'hoch'}
          @click=${(e: Event) => {
            e.stopPropagation();
            this._moveChip(i, -1);
          }}
        ><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(e: Event) => {
            e.stopPropagation();
            this._moveChip(i, 1);
          }}
        ><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(e: Event) => {
            e.stopPropagation();
            this._removeChip(i);
          }}
        ><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
      </div>
      ${open
        ? html`<div class="ce-row-body">
            ${!placed
              ? html`<button class="ce-place" @click=${() => this._placeHere(i)}>
                  <ha-icon icon="mdi:map-marker-plus"></ha-icon>
                  In „${VARIANT_LABEL[this._variant]}" platzieren
                </button>`
              : nothing}
            <ha-form
              .hass=${this.hass}
              .data=${this._flatten(chip)}
              .schema=${this._chipSchema()}
              .computeLabel=${this._label}
              @value-changed=${(e: CustomEvent) => this._chipFormChanged(e, i)}
            ></ha-form>
          </div>`
        : nothing}
    </div>`;
  }

  static styles = css`
    .ce {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ce-tabs {
      display: flex;
      gap: 4px;
      background: var(--secondary-background-color, #eee);
      padding: 4px;
      border-radius: 10px;
    }
    .ce-tabs button {
      flex: 1;
      border: none;
      background: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      font: inherit;
      color: var(--secondary-text-color);
    }
    .ce-tabs button.on {
      background: var(--primary-color, #5b7cfa);
      color: #fff;
    }
    .ce-stage-wrap {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
    }
    .ce-stage {
      position: relative;
      width: 100%;
      aspect-ratio: 41 / 24;
      background: linear-gradient(170deg, #cfe0f5, #aebff0);
      touch-action: none;
      user-select: none;
    }
    .ce-stage img,
    .ce-stage .svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    }
    .ce-anchor {
      position: absolute;
      --gap: 11px;
      --dg: 3px;
    }
    .ce-adot {
      position: absolute;
      top: 0;
      left: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: var(--ac);
      border: 2px solid #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
      cursor: grab;
      touch-action: none;
    }
    .ce-adot:active {
      cursor: grabbing;
    }
    .ce-anchor.active .ce-adot {
      outline: 2px solid var(--ac);
      outline-offset: 2px;
    }
    .ce-albl {
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(255, 255, 255, 0.92);
      color: #16233a;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 8px;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
      cursor: pointer;
    }
    .ce-anchor.dot-right .ce-albl {
      transform: translate(calc(-100% - var(--gap)), -50%);
    }
    .ce-anchor.dot-left .ce-albl {
      transform: translate(var(--gap), -50%);
    }
    .ce-anchor.dot-top .ce-albl {
      transform: translate(-50%, var(--gap));
    }
    .ce-anchor.dot-bottom .ce-albl {
      transform: translate(-50%, calc(-100% - var(--gap)));
    }
    .ce-anchor.dot-top-left .ce-albl {
      transform: translate(var(--dg), var(--dg));
    }
    .ce-anchor.dot-top-right .ce-albl {
      transform: translate(calc(-100% - var(--dg)), var(--dg));
    }
    .ce-anchor.dot-bottom-left .ce-albl {
      transform: translate(var(--dg), calc(-100% - var(--dg)));
    }
    .ce-anchor.dot-bottom-right .ce-albl {
      transform: translate(calc(-100% - var(--dg)), calc(-100% - var(--dg)));
    }
    .ce-hint {
      padding: 6px 10px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color, #f4f4f4);
    }
    .ce-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ce-row {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      overflow: hidden;
    }
    .ce-row-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 6px 6px 12px;
      cursor: pointer;
    }
    .swatch {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex: 0 0 auto;
    }
    .rn {
      font-weight: 600;
    }
    .sp {
      flex: 1;
    }
    .badge {
      font-size: 0.68rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--secondary-background-color, #eee);
      color: var(--secondary-text-color);
    }
    .badge.ok {
      background: rgba(52, 199, 89, 0.18);
      color: #1a8c3a;
    }
    .badge.no {
      opacity: 0.7;
    }
    .badge.hid {
      background: rgba(245, 166, 35, 0.18);
      color: #a8710a;
    }
    .ce-row-body {
      padding: 10px 12px 14px;
      border-top: 1px solid var(--divider-color, #eee);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ce-add,
    .ce-place {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      justify-content: center;
      border: 1px dashed var(--divider-color, #bbb);
      background: none;
      color: var(--primary-color, #5b7cfa);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font: inherit;
    }
    .ce-place {
      border-style: solid;
      align-self: flex-start;
    }
    ha-icon-button {
      --mdc-icon-button-size: 34px;
      color: var(--secondary-text-color);
    }
  `;
}

// ---------------------------------------------------------------------------
// Generic list editor for stats / controls (array of {entity,name,icon,...}).
// ---------------------------------------------------------------------------

interface ListField {
  name: string;
  selector: any;
}

@customElement('boat-items-editor')
export class BoatItemsEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public items: any[] = [];
  @property({ attribute: false }) public fields: ListField[] = [];
  @property({ type: String }) public addLabel = 'Hinzufügen';

  @state() private _expanded = -1;

  private _emit(items: any[]): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: items.map((it) => clean(it)) },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _norm(it: any): any {
    return typeof it === 'string' ? { entity: it } : { ...it };
  }

  private _add(): void {
    const items = this.items.map((i) => this._norm(i));
    items.push({ entity: '' });
    this._expanded = items.length - 1;
    this._emit(items);
  }

  private _remove(i: number): void {
    const items = this.items.map((x) => this._norm(x));
    items.splice(i, 1);
    if (this._expanded === i) this._expanded = -1;
    this._emit(items);
  }

  private _move(i: number, dir: -1 | 1): void {
    const items = this.items.map((x) => this._norm(x));
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    this._emit(items);
  }

  private _changed(ev: CustomEvent, i: number): void {
    ev.stopPropagation();
    const items = this.items.map((x) => this._norm(x));
    items[i] = { ...items[i], ...ev.detail.value };
    this._emit(items);
  }

  private _label = (s: any) => CHIP_LABELS[s?.name] ?? s?.name ?? '';

  render() {
    const items = (this.items ?? []).map((i) => this._norm(i));
    return html`<div class="li">
      ${items.map((it, i) => {
        const st = getEntity(this.hass, it.entity);
        const open = i === this._expanded;
        const name = (it.name ?? friendlyName(st, it.entity)) || `#${i + 1}`;
        return html`<div class="row ${open ? 'open' : ''}">
          <div class="head" @click=${() => (this._expanded = open ? -1 : i)}>
            ${it.icon ? html`<ha-icon icon=${it.icon}></ha-icon>` : nothing}
            <span class="n">${name}</span>
            <span class="sp"></span>
            <ha-icon-button @click=${(e: Event) => { e.stopPropagation(); this._move(i, -1); }}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(e: Event) => { e.stopPropagation(); this._move(i, 1); }}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(e: Event) => { e.stopPropagation(); this._remove(i); }}>
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          </div>
          ${open
            ? html`<div class="body">
                <ha-form
                  .hass=${this.hass}
                  .data=${it}
                  .schema=${this.fields}
                  .computeLabel=${this._label}
                  @value-changed=${(e: CustomEvent) => this._changed(e, i)}
                ></ha-form>
              </div>`
            : nothing}
        </div>`;
      })}
      <button class="add" @click=${this._add}>
        <ha-icon icon="mdi:plus"></ha-icon> ${this.addLabel}
      </button>
    </div>`;
  }

  static styles = css`
    .li {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .row {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      overflow: hidden;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 6px 6px 12px;
      cursor: pointer;
    }
    .n {
      font-weight: 600;
    }
    .sp {
      flex: 1;
    }
    .body {
      padding: 10px 12px 14px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    .add {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      justify-content: center;
      border: 1px dashed var(--divider-color, #bbb);
      background: none;
      color: var(--primary-color, #5b7cfa);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font: inherit;
    }
    ha-icon-button {
      --mdc-icon-button-size: 34px;
      color: var(--secondary-text-color);
    }
  `;
}
