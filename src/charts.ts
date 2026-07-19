import { html, nothing, svg } from 'lit';
import type { TemplateResult } from 'lit';

export interface LineSeries {
  values: number[];
  color: string;
}

export interface AxisMark {
  /** bucket index */
  i: number;
  label?: string;
  /** draw a vertical gridline */
  line?: boolean;
}

export interface ChartOpts {
  /** viewBox width (default 220) */
  w?: number;
  /** viewBox height (default 60) */
  h?: number;
  /** draw ring dots on line charts (default true) */
  dots?: boolean;
  /** y tick formatter; enables horizontal gridlines with labels */
  yFmt?: (v: number) => string;
  /** x-axis marks (vertical lines / labels at bucket indices) */
  xMarks?: AxisMark[];
}

const W = 220;
const H = 60;
const PAD = 7;
const GRID = 'color-mix(in srgb, var(--primary-text-color) 14%, transparent)';

function axisGeometry(opts: ChartOpts, ticks: number[]): { padL: number; padB: number } {
  const padL = opts.yFmt
    ? Math.max(26, ...ticks.map((v) => opts.yFmt!(v).length * 5.6 + 10))
    : PAD;
  const padB = opts.xMarks?.some((m) => m.label) ? 15 : PAD;
  return { padL, padB };
}

function scale(all: number[]): { lo: number; hi: number } {
  const finite = all.filter(Number.isFinite);
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const range = max - min || Math.abs(max) * 0.1 || 1;
  return { lo: min - range * 0.18, hi: max + range * 0.18 };
}

/**
 * Withings-style smoothed sparkline with ring dots on each day.
 * Supports multiple series sharing one y-scale.
 */
export function lineChart(
  seriesList: LineSeries[],
  opts: ChartOpts = {}
): TemplateResult | typeof nothing {
  const w = opts.w ?? W;
  const h = opts.h ?? H;
  const showDots = opts.dots ?? true;
  const drawable = seriesList.filter((s) => s.values.some(Number.isFinite));
  if (!drawable.length) return nothing;
  const { lo, hi } = scale(drawable.flatMap((s) => s.values));
  const n = Math.max(...drawable.map((s) => s.values.length));
  const ticks = opts.yFmt ? [hi - (hi - lo) * 0.08, (lo + hi) / 2, lo + (hi - lo) * 0.08] : [];
  const { padL, padB } = axisGeometry(opts, ticks);
  const x = (i: number) => padL + (i * (w - padL - PAD)) / Math.max(n - 1, 1);
  const y = (v: number) => h - padB - ((v - lo) / (hi - lo)) * (h - padB - PAD);

  const grid = ticks.map(
    (v) => svg`
      <line x1=${padL} x2=${w - PAD} y1=${y(v)} y2=${y(v)}
        stroke=${GRID} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${padL - 5} y=${y(v)} text-anchor="end"
        dominant-baseline="middle">${opts.yFmt!(v)}</text>`
  );
  const marks = (opts.xMarks ?? []).map(
    (mk) => svg`
      ${
        mk.line
          ? svg`<line x1=${x(mk.i)} x2=${x(mk.i)} y1=${PAD} y2=${h - padB}
              stroke=${GRID} stroke-width="1"/>`
          : nothing
      }
      ${
        mk.label
          ? svg`<text class="axis" x=${x(mk.i)} y=${h - 3} text-anchor="middle">${mk.label}</text>`
          : nothing
      }`
  );

  const parts = drawable.map((s) => {
    const pts = s.values
      .map((v, i) => ({ x: x(i), y: y(v), ok: Number.isFinite(v) }))
      .filter((p) => p.ok);
    if (!pts.length) return nothing;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (pts[i - 1].x + pts[i].x) / 2;
      d += ` C ${cx} ${pts[i - 1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    return svg`
      <path d=${d} fill="none" stroke=${s.color} stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round"/>
      ${
        showDots
          ? pts.map(
              (p) => svg`<circle cx=${p.x} cy=${p.y} r="3.1" fill="var(--bc-dot-fill)"
                stroke=${s.color} stroke-width="2"/>`
            )
          : nothing
      }
    `;
  });

  return html`<svg class="chart" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    ${grid}${marks}${parts}
  </svg>`;
}

/** Rounded daily bars with an optional dashed goal line. */
export function barChart(
  values: number[],
  color: string,
  goal?: number,
  opts: ChartOpts = {}
): TemplateResult | typeof nothing {
  const w = opts.w ?? W;
  const h = opts.h ?? H;
  if (!values.some((v) => Number.isFinite(v) && v > 0)) return nothing;
  const vals = values.map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const max = Math.max(...vals, goal ?? 0) || 1;
  const n = vals.length;
  const ticks = opts.yFmt ? [max, max / 2] : [];
  const { padL, padB } = axisGeometry(opts, ticks);
  const slot = (w - padL - PAD) / n;
  const bw = Math.min(slot * 0.55, 14);
  const y = (v: number) => (v / max) * (h - padB - PAD);

  const grid = ticks.map(
    (v) => svg`
      <line x1=${padL} x2=${w - PAD} y1=${h - padB - y(v)} y2=${h - padB - y(v)}
        stroke=${GRID} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${padL - 5} y=${h - padB - y(v)} text-anchor="end"
        dominant-baseline="middle">${opts.yFmt!(v)}</text>`
  );
  const marks = (opts.xMarks ?? []).map((mk) => {
    const mx = padL + mk.i * slot + slot / 2;
    return svg`
      ${
        mk.line
          ? svg`<line x1=${mx} x2=${mx} y1=${PAD} y2=${h - padB}
              stroke=${GRID} stroke-width="1"/>`
          : nothing
      }
      ${
        mk.label
          ? svg`<text class="axis" x=${mx} y=${h - 3} text-anchor="middle">${mk.label}</text>`
          : nothing
      }`;
  });

  const bars = vals.map((v, i) => {
    const bh = Math.max(y(v), v > 0 ? 3 : 1.5);
    const bx = padL + i * slot + (slot - bw) / 2;
    return svg`<rect x=${bx} y=${h - padB - bh} width=${bw} height=${bh}
      rx=${Math.min(bw / 2, 4)} fill=${color} opacity=${v > 0 ? 1 : 0.25}/>`;
  });

  const goalLine = Number.isFinite(goal as number)
    ? svg`<line x1=${padL} x2=${w - PAD} y1=${h - padB - y(goal!)} y2=${h - padB - y(goal!)}
        stroke=${color} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>`
    : nothing;

  return html`<svg class="chart" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    ${grid}${marks}${goalLine}${bars}
  </svg>`;
}

const SCORE_PALETTE = [
  'var(--amber-color, #FFC107)',
  'var(--purple-color, #9C27B0)',
  'var(--pink-color, #E91E63)',
];
const NEUTRAL_DOT = 'color-mix(in srgb, var(--primary-text-color) 16%, transparent)';

/** Sub-goal segment: category color plus its share (0..1) of the score. */
export interface ScoreSegment {
  color: string;
  share: number;
}

/**
 * Withings-style confetti dot ring. The share of colored dots (clockwise from
 * the top) reflects the score ratio; with segments the colored dots take the
 * category colors proportionally (randomly mixed like the original).
 */
export function scoreRing(
  scoreColor: string,
  ratio: number,
  segments?: ScoreSegment[]
): TemplateResult {
  const rnd = (i: number) => Math.abs((Math.sin(i * 127.1) * 43758.5453) % 1);
  const pick = (seed: number): string => {
    if (!segments?.length) {
      return SCORE_PALETTE[Math.floor(rnd(seed) * SCORE_PALETTE.length)];
    }
    const r = rnd(seed);
    let acc = 0;
    for (const s of segments) {
      acc += s.share;
      if (r <= acc) return s.color;
    }
    return segments[segments.length - 1].color;
  };
  const dots = [];
  for (let ring = 0; ring < 2; ring++) {
    const base = ring === 0 ? 74 : 88;
    const count = ring === 0 ? 26 : 32;
    for (let i = 0; i < count; i++) {
      const frac = i / count;
      const a = frac * Math.PI * 2 - Math.PI / 2 + rnd(i + ring * 100) * 0.12;
      const r = base + (rnd(i * 3 + ring * 7) - 0.5) * 6;
      const size = 2.4 + rnd(i * 7 + ring * 13) * 2.4;
      const color = frac < ratio ? pick(i * 11 + ring * 29) : NEUTRAL_DOT;
      dots.push(
        svg`<circle cx=${100 + Math.cos(a) * r} cy=${100 + Math.sin(a) * r}
          r=${size} fill=${color} opacity="0.75"/>`
      );
    }
  }
  return html`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="62" fill="color-mix(in srgb, ${scoreColor} 10%, transparent)" />
    ${dots}
  </svg>`;
}

/** Single progress arc with round caps. */
function progressArc(R: number, width: number, ratio: number, color: string) {
  const C = 2 * Math.PI * R;
  return svg`<circle cx="100" cy="100" r=${R} fill="none" stroke=${color}
    stroke-width=${width} stroke-linecap="round"
    stroke-dasharray="${C * Math.max(ratio, 0.02)} ${C}"
    transform="rotate(-90 100 100)"/>`;
}

/** Clean progress ring (default, bubble, mirror score variants). */
export function scoreArc(color: string, ratio: number, width = 10): TemplateResult {
  const R = 82;
  return html`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r=${R} fill="none" stroke=${color} opacity="0.16"
      stroke-width=${width}/>
    ${progressArc(R, width, ratio, color)}
  </svg>`;
}

/**
 * Liquid-glass progress ring: a glass tube with specular edge highlights and
 * a colored glow that grows with the score; at (nearly) full score an outer
 * halo pulses softly.
 */
export function scoreArcGlass(
  color: string,
  ratio: number,
  segments?: ScoreSegment[]
): TemplateResult {
  const R = 78;
  const w = 13;
  const C = 2 * Math.PI * R;
  const dash = `${C * Math.max(ratio, 0.02)} ${C}`;
  const R2 = R + w * 0.27; // specular line rides the outer tube edge
  const C2 = 2 * Math.PI * R2;
  const glow = 0.18 + ratio * 0.5;
  const full = ratio >= 0.95;
  // padded viewBox: blur glow and halo need room beyond the ring
  return html`<svg class="scorering" viewBox="-14 -14 228 228" aria-hidden="true">
    <defs>
      <filter id="bc-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="bc-blur-heavy" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="15" />
      </filter>
    </defs>
    ${full
      ? svg`<circle cx="100" cy="100" r="93" fill="none" stroke=${color}
          stroke-width="2.5" opacity="0.4" filter="url(#bc-glow)" class="glowpulse"/>`
      : nothing}
    <circle cx="100" cy="100" r=${R} fill="none" stroke=${color}
      stroke-width=${w + 7} stroke-linecap="round" stroke-dasharray=${dash}
      transform="rotate(-90 100 100)" filter="url(#bc-glow)" opacity=${glow}
      class=${full ? 'glowpulse' : ''}/>
    ${
      // sub-goals melt into a heavily blurred color wash behind the number
      segments?.length
        ? segments.map((seg, i) => {
            const a = (i / segments!.length) * 2 * Math.PI - Math.PI / 2;
            return svg`<circle cx=${100 + Math.cos(a) * 24} cy=${100 + Math.sin(a) * 24}
              r=${16 + seg.share * 26} fill=${seg.color}
              filter="url(#bc-blur-heavy)" opacity="0.5"/>`;
          })
        : nothing
    }
    <circle cx="100" cy="100" r=${R} fill="none" stroke-width=${w}
      stroke="color-mix(in srgb, ${color} 13%, transparent)"/>
    <circle cx="100" cy="100" r=${R + w / 2 - 0.6} fill="none" stroke-width="1"
      stroke="color-mix(in srgb, #fff 30%, transparent)"/>
    <circle cx="100" cy="100" r=${R - w / 2 + 0.6} fill="none" stroke-width="1"
      stroke="color-mix(in srgb, #fff 12%, transparent)"/>
    ${progressArc(R, w, ratio, color)}
    <circle cx="100" cy="100" r=${R2} fill="none" stroke="rgba(255, 255, 255, 0.55)"
      stroke-width="1.6" stroke-linecap="round"
      stroke-dasharray="${C2 * Math.max(ratio, 0.02)} ${C2}"
      transform="rotate(-90 100 100)"/>
  </svg>`;
}

/** Material You: scalloped tonal blob with an outer progress arc. */
export function scoreScallop(
  accent: string,
  scoreColor: string,
  ratio: number
): TemplateResult {
  const pts: string[] = [];
  const N = 144;
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * 2 * Math.PI;
    const r = 72 + 7 * Math.cos(12 * th);
    pts.push(
      `${i ? 'L' : 'M'} ${(100 + Math.cos(th) * r).toFixed(1)} ${(100 + Math.sin(th) * r).toFixed(1)}`
    );
  }
  const R = 92;
  return html`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <path d="${pts.join(' ')} Z" fill="color-mix(in srgb, ${accent} 22%, transparent)"/>
    <circle cx="100" cy="100" r=${R} fill="none" stroke=${scoreColor} opacity="0.18"
      stroke-width="5"/>
    ${progressArc(R, 5, ratio, scoreColor)}
  </svg>`;
}

export interface CycleSegment {
  /** start day (1-based, inclusive) */
  from: number;
  /** end day (inclusive) */
  to: number;
  color: string;
}

/**
 * Menstrual-cycle ring: colored phase arcs around a donut with a marker at
 * the current day. Day 1 starts at the top and runs clockwise.
 */
export function cycleRing(
  day: number,
  length: number,
  segments: CycleSegment[]
): TemplateResult {
  const R = 80;
  const width = 15;
  const C = 2 * Math.PI * R;
  const segEls = segments.map((s) => {
    const span = Math.max(0, s.to - (s.from - 1));
    const len = (C * span) / length;
    const offset = (C * (s.from - 1)) / length;
    return svg`<circle cx="100" cy="100" r=${R} fill="none" stroke=${s.color}
      stroke-width=${width} stroke-linecap="butt"
      stroke-dasharray="${Math.max(len - 1.5, 0.1)} ${C}" stroke-dashoffset=${-offset}
      transform="rotate(-90 100 100)"/>`;
  });
  // marker at the middle of the current day
  const a = ((day - 0.5) / length) * 2 * Math.PI - Math.PI / 2;
  const mx = 100 + Math.cos(a) * R;
  const my = 100 + Math.sin(a) * R;
  return html`<svg class="scorering" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r=${R} fill="none"
      stroke="color-mix(in srgb, var(--primary-text-color) 8%, transparent)"
      stroke-width=${width}/>
    ${segEls}
    <circle cx=${mx} cy=${my} r="10" fill="var(--bc-card-bg)"
      stroke="var(--primary-text-color)" stroke-width="2.5"/>
    <circle cx=${mx} cy=${my} r="3.5" fill="var(--primary-text-color)"/>
  </svg>`;
}

/** Picks the score graphic matching the active card style. */
export function scoreGraphic(
  variant: string,
  accent: string,
  scoreColor: string,
  ratio: number,
  segments?: ScoreSegment[]
): TemplateResult {
  // sub-goals stay subtle: category colors only tint the withings dots and
  // the glass glow — plain arcs never turn into pie charts
  if (variant === 'material') return scoreScallop(accent, scoreColor, ratio);
  if (variant === 'bubble') return scoreArc(scoreColor, ratio, 15);
  if (variant === 'mirror') return scoreArc('#fff', ratio, 7);
  if (variant === 'glass') return scoreArcGlass(scoreColor, ratio, segments);
  if (variant === 'default') return scoreArc(scoreColor, ratio, 10);
  return scoreRing(scoreColor, ratio, segments);
}
