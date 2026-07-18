import { html, svg, nothing } from 'lit';
import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { BoatVariant } from './types';

// A stylised sailboat used as the built-in fallback when no image URLs are
// configured. Three scenes: at the dock, sailing, on the trailer. Colours are
// baked to a nautical palette (like the reference render) but the whole scene
// is an <svg> so chips overlay cleanly on top of it.

const hull = (): SVGTemplateResult => svg`
  <!-- reflection / shadow -->
  <ellipse cx="205" cy="212" rx="150" ry="12" fill="#000" opacity="0.06" />
  <!-- deck (wood) -->
  <path d="M70 176 Q205 150 340 176 L322 190 Q205 172 92 190 Z"
        fill="#d8b487" />
  <!-- hull -->
  <path d="M70 176 Q205 150 340 176 Q330 205 205 212 Q90 205 70 176 Z"
        fill="#28527a" />
  <path d="M92 190 Q205 172 322 190 Q312 204 205 208 Q100 204 92 190 Z"
        fill="#1f4166" />
  <!-- cabin -->
  <path d="M150 150 Q160 132 205 130 Q250 132 262 150 Q262 168 205 170 Q150 168 150 150 Z"
        fill="#e9c99b" />
  <path d="M168 150 Q176 140 205 139 Q234 140 244 150 Q244 160 205 161 Q176 160 168 150 Z"
        fill="#5c7fa3" opacity="0.55" />
  <!-- name plate -->
  <rect x="150" y="188" width="110" height="10" rx="5" fill="#0f2f4d" opacity="0.35" />
`;

const mast = (sailUp: boolean): SVGTemplateResult => svg`
  <line x1="212" y1="132" x2="212" y2="34" stroke="#e7e2d6" stroke-width="4"
        stroke-linecap="round" />
  ${
    sailUp
      ? svg`
        <path d="M208 40 Q150 90 176 150 L208 150 Z" fill="#f4f1ea" />
        <path d="M216 44 Q270 92 250 150 L216 150 Z" fill="#fbfaf6" />
        <path d="M208 40 Q150 90 176 150" fill="none" stroke="#d9d3c4" stroke-width="1.5" />`
      : svg`
        <path d="M212 40 Q206 90 212 150" fill="none" stroke="#cfe0f5" stroke-width="10"
              stroke-linecap="round" opacity="0.9" />`
  }
`;

const waterLine = (moving: boolean): SVGTemplateResult => svg`
  <g opacity="0.7" stroke="#7fa8d8" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M60 200 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" />
    ${
      moving
        ? svg`<path d="M40 214 q16 -6 32 0 t32 0 t32 0 t32 0 t32 0 t32 0"
                    opacity="0.5" />`
        : nothing
    }
  </g>
`;

const dockScene = (): SVGTemplateResult => svg`
  ${waterLine(false)}
  <!-- pier -->
  <g>
    <path d="M300 196 L392 176 L392 190 L300 210 Z" fill="#b98c5a" />
    <path d="M300 196 L392 176 L392 179 L300 199 Z" fill="#caa06f" />
    <rect x="330" y="205" width="6" height="26" fill="#7c5a34" />
    <rect x="372" y="196" width="6" height="30" fill="#7c5a34" />
  </g>
  ${hull()}
  ${mast(false)}
`;

const sailingScene = (): SVGTemplateResult => svg`
  ${waterLine(true)}
  ${hull()}
  ${mast(true)}
  <!-- little wake -->
  <path d="M70 200 q-18 4 -30 -2" fill="none" stroke="#fff" stroke-width="3"
        stroke-linecap="round" opacity="0.55" />
`;

const trailerScene = (): SVGTemplateResult => svg`
  <!-- ground -->
  <rect x="30" y="214" width="350" height="26" rx="6" fill="#000" opacity="0.05" />
  <!-- trailer frame -->
  <g stroke="#37424f" stroke-width="6" stroke-linecap="round">
    <line x1="96" y1="206" x2="316" y2="206" />
    <line x1="316" y1="206" x2="356" y2="206" />
  </g>
  <circle cx="150" cy="214" r="16" fill="#2b3138" />
  <circle cx="150" cy="214" r="7" fill="#8b949e" />
  <circle cx="262" cy="214" r="16" fill="#2b3138" />
  <circle cx="262" cy="214" r="7" fill="#8b949e" />
  ${hull()}
  ${mast(false)}
`;

export function boatScene(variant: BoatVariant): TemplateResult {
  const inner =
    variant === 'sailing'
      ? sailingScene()
      : variant === 'trailer'
        ? trailerScene()
        : dockScene();
  // html wrapper for the standalone <svg>; the fragments above use the svg tag
  return html`<svg
    viewBox="0 0 410 240"
    xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;display:block"
  >
    ${inner}
  </svg>`;
}
