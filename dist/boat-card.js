/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht = globalThis, wt = ht.ShadowRoot && (ht.ShadyCSS === void 0 || ht.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, St = Symbol(), Lt = /* @__PURE__ */ new WeakMap();
let Xt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== St) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (wt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = Lt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Lt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const le = (e) => new Xt(typeof e == "string" ? e : e + "", void 0, St), E = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, a) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[a + 1], e[0]);
  return new Xt(i, e, St);
}, de = (e, t) => {
  if (wt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = ht.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, Ut = wt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return le(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: he, defineProperty: pe, getOwnPropertyDescriptor: ue, getOwnPropertyNames: me, getOwnPropertySymbols: be, getPrototypeOf: ge } = Object, O = globalThis, Tt = O.trustedTypes, fe = Tt ? Tt.emptyScript : "", ve = O.reactiveElementPolyfillSupport, q = (e, t) => e, pt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? fe : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, kt = (e, t) => !he(e, t), Bt = { attribute: !0, type: String, converter: pt, reflect: !1, useDefault: !1, hasChanged: kt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), O.litPropertyMetadata ?? (O.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let F = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Bt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && pe(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: a } = ue(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const d = r?.call(this);
      a?.call(this, o), this.requestUpdate(t, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(q("elementProperties"))) return;
    const t = ge(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(q("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(q("properties"))) {
      const i = this.properties, s = [...me(i), ...be(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(Ut(r));
    } else t !== void 0 && i.push(Ut(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return de(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : pt).toAttribute(i, s.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : pt;
      this._$Em = r;
      const d = o.fromAttribute(i, a.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, a) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (a = this[t]), s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? kt)(a, i) || s.useDefault && s.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: a }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, a] of s) {
        const { wrapped: o } = a, d = this[r];
        o !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, a, d);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
F.elementStyles = [], F.shadowRootOptions = { mode: "open" }, F[q("elementProperties")] = /* @__PURE__ */ new Map(), F[q("finalized")] = /* @__PURE__ */ new Map(), ve?.({ ReactiveElement: F }), (O.reactiveElementVersions ?? (O.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, Dt = (e) => e, ut = V.trustedTypes, Rt = ut ? ut.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Jt = "$lit$", z = `lit$${Math.random().toFixed(9).slice(2)}$`, te = "?" + z, _e = `<${te}>`, j = document, Y = () => j.createComment(""), X = (e) => e === null || typeof e != "object" && typeof e != "function", At = Array.isArray, ye = (e) => At(e) || typeof e?.[Symbol.iterator] == "function", _t = `[ 	
\f\r]`, Z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, jt = /-->/g, Ht = />/g, U = RegExp(`>|${_t}(?:([^\\s"'>=/]+)(${_t}*=${_t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), It = /'/g, Ft = /"/g, ee = /^(?:script|style|textarea|title)$/i, ie = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), n = ie(1), k = ie(2), G = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), Gt = /* @__PURE__ */ new WeakMap(), B = j.createTreeWalker(j, 129);
function se(e, t) {
  if (!At(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Rt !== void 0 ? Rt.createHTML(t) : t;
}
const $e = (e, t) => {
  const i = e.length - 1, s = [];
  let r, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Z;
  for (let d = 0; d < i; d++) {
    const l = e[d];
    let u, b, p = -1, S = 0;
    for (; S < l.length && (o.lastIndex = S, b = o.exec(l), b !== null); ) S = o.lastIndex, o === Z ? b[1] === "!--" ? o = jt : b[1] !== void 0 ? o = Ht : b[2] !== void 0 ? (ee.test(b[2]) && (r = RegExp("</" + b[2], "g")), o = U) : b[3] !== void 0 && (o = U) : o === U ? b[0] === ">" ? (o = r ?? Z, p = -1) : b[1] === void 0 ? p = -2 : (p = o.lastIndex - b[2].length, u = b[1], o = b[3] === void 0 ? U : b[3] === '"' ? Ft : It) : o === Ft || o === It ? o = U : o === jt || o === Ht ? o = Z : (o = U, r = void 0);
    const P = o === U && e[d + 1].startsWith("/>") ? " " : "";
    a += o === Z ? l + _e : p >= 0 ? (s.push(u), l.slice(0, p) + Jt + l.slice(p) + z + P) : l + z + (p === -2 ? d : P);
  }
  return [se(e, a + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class J {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let a = 0, o = 0;
    const d = t.length - 1, l = this.parts, [u, b] = $e(t, i);
    if (this.el = J.createElement(u, s), B.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = B.nextNode()) !== null && l.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(Jt)) {
          const S = b[o++], P = r.getAttribute(p).split(z), dt = /([.?@])?(.*)/.exec(S);
          l.push({ type: 1, index: a, name: dt[2], strings: P, ctor: dt[1] === "." ? we : dt[1] === "?" ? Se : dt[1] === "@" ? ke : ft }), r.removeAttribute(p);
        } else p.startsWith(z) && (l.push({ type: 6, index: a }), r.removeAttribute(p));
        if (ee.test(r.tagName)) {
          const p = r.textContent.split(z), S = p.length - 1;
          if (S > 0) {
            r.textContent = ut ? ut.emptyScript : "";
            for (let P = 0; P < S; P++) r.append(p[P], Y()), B.nextNode(), l.push({ type: 2, index: ++a });
            r.append(p[S], Y());
          }
        }
      } else if (r.nodeType === 8) if (r.data === te) l.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(z, p + 1)) !== -1; ) l.push({ type: 7, index: a }), p += z.length - 1;
      }
      a++;
    }
  }
  static createElement(t, i) {
    const s = j.createElement("template");
    return s.innerHTML = t, s;
  }
}
function Q(e, t, i = e, s) {
  if (t === G) return t;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const a = X(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = r : i._$Cl = r), r !== void 0 && (t = Q(e, r._$AS(e, t.values), r, s)), t;
}
class xe {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, r = (t?.creationScope ?? j).importNode(i, !0);
    B.currentNode = r;
    let a = B.nextNode(), o = 0, d = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new ot(a, a.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (u = new Ae(a, this, t)), this._$AV.push(u), l = s[++d];
      }
      o !== l?.index && (a = B.nextNode(), o++);
    }
    return B.currentNode = j, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class ot {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = Q(this, t, i), X(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== G && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ye(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && X(this._$AH) ? this._$AA.nextSibling.data = t : this.T(j.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = J.createElement(se(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const a = new xe(r, this), o = a.u(this.options);
      a.p(i), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let i = Gt.get(t.strings);
    return i === void 0 && Gt.set(t.strings, i = new J(t)), i;
  }
  k(t) {
    At(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const a of t) r === i.length ? i.push(s = new ot(this.O(Y()), this.O(Y()), this, this.options)) : s = i[r], s._$AI(a), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = Dt(t).nextSibling;
      Dt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ft {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, a) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, i = this, s, r) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = Q(this, t, i, 0), o = !X(t) || t !== this._$AH && t !== G, o && (this._$AH = t);
    else {
      const d = t;
      let l, u;
      for (t = a[0], l = 0; l < a.length - 1; l++) u = Q(this, d[s + l], i, l), u === G && (u = this._$AH[l]), o || (o = !X(u) || u !== this._$AH[l]), u === c ? t = c : t !== c && (t += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class we extends ft {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Se extends ft {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class ke extends ft {
  constructor(t, i, s, r, a) {
    super(t, i, s, r, a), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = Q(this, t, i, 0) ?? c) === G) return;
    const s = this._$AH, r = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ae {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Q(this, t);
  }
}
const Ce = V.litHtmlPolyfillSupport;
Ce?.(J, ot), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.3");
const Ee = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const a = i?.renderBefore ?? null;
    s._$litPart$ = r = new ot(t.insertBefore(Y(), a), a, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
class $ extends F {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ee(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return G;
  }
}
$._$litElement$ = !0, $.finalized = !0, K.litElementHydrateSupport?.({ LitElement: $ });
const Pe = K.litElementPolyfillSupport;
Pe?.({ LitElement: $ });
(K.litElementVersions ?? (K.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ze = { attribute: !0, type: String, converter: pt, reflect: !1, hasChanged: kt }, Oe = (e = ze, t, i) => {
  const { kind: s, metadata: r } = i;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(d) {
      const l = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(o, l, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(o, void 0, e, d), d;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(d) {
      const l = this[o];
      t.call(this, d), this.requestUpdate(o, l, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function v(e) {
  return (t, i) => typeof i == "object" ? Oe(e, t, i) : ((s, r, a) => {
    const o = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, s), o ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(e) {
  return v({ ...e, state: !0, attribute: !1 });
}
const Me = ["unavailable", "unknown", "none", ""];
function Ne(e) {
  return !!e?.themes?.darkMode;
}
function h(e, t) {
  if (!(!e || !t))
    return e.states[t];
}
function N(e) {
  return !e || Me.includes(String(e.state).toLowerCase());
}
function mt(e) {
  if (!e) return !1;
  const t = String(e.state).toLowerCase();
  return ["on", "open", "home", "active", "charging", "true", "playing"].includes(t);
}
function T(e, t) {
  if (!e) return NaN;
  const i = t ? e.attributes?.[t] : e.state;
  if (i == null) return NaN;
  const s = typeof i == "number" ? i : parseFloat(String(i).replace(",", "."));
  return Number.isFinite(s) ? s : NaN;
}
function Le(e) {
  return e?.attributes?.unit_of_measurement ?? "";
}
function D(e, t = "") {
  return e?.attributes?.friendly_name ?? t;
}
function re(e) {
  return e.split(".")[0] ?? "";
}
function R(e, t) {
  e.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function Ue(e, t, i) {
  e.dispatchEvent(
    new CustomEvent(t, { detail: i, bubbles: !0, composed: !0 })
  );
}
function bt(e, t) {
  const i = re(t), s = ["switch", "light", "fan", "input_boolean"].includes(i) ? i : "homeassistant";
  e.callService(s, "toggle", { entity_id: t });
}
function gt(e) {
  return e ? /^(#|rgb|hsl|var\()/.test(e) ? e : [
    "primary",
    "accent",
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "grey",
    "blue-grey"
  ].includes(e) ? `var(--${e}-color)` : e : void 0;
}
function Te(e) {
  return e?.locale?.language ?? e?.language ?? "de";
}
function ae(e, t, i) {
  if (!Number.isFinite(t)) return "–";
  const s = {};
  i !== void 0 ? (s.minimumFractionDigits = i, s.maximumFractionDigits = i) : s.maximumFractionDigits = 1;
  try {
    return new Intl.NumberFormat(Te(e), s).format(t);
  } catch {
    return String(t);
  }
}
function Be(e, t) {
  return t ? ["%"].includes(t) ? `${e}${t}` : `${e} ${t}` : e;
}
function _(e, t, i = {}) {
  if (N(t)) return i.unavailable ?? "—";
  const s = T(t, i.attribute);
  if (Number.isFinite(s))
    return Be(ae(e, s, i.precision), i.unit ?? Le(t));
  if (i.attribute && t) {
    const r = t.attributes?.[i.attribute];
    if (r != null) return String(r);
  }
  if (e.formatEntityState && t)
    try {
      return e.formatEntityState(t);
    } catch {
    }
  return t ? t.state : i.unavailable ?? "—";
}
function De(e, t = "de") {
  if (!Number.isFinite(e)) return "";
  const i = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"], s = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], r = Math.round((e % 360 + 360) % 360 / 45) % 8;
  return (t === "de" ? i : s)[r];
}
const Re = {
  battery: "Batterie",
  main_battery: "Hauptbatterie",
  motor_battery: "Motorbatterie",
  solar: "Solar",
  solar_main: "Solar Hauptmodul",
  solar_secondary: "Solar Zweitmodul",
  yield_today: "Ertrag heute",
  power_now: "Leistung",
  voltage: "Spannung",
  current: "Strom",
  soc: "Ladezustand",
  fridge: "Kühlschrank",
  fridge_temp: "Kühlschranktemperatur",
  temperature: "Temperatur",
  water_temp: "Wassertemperatur",
  camera: "Kamera",
  depth: "Echolot",
  nav_lights: "Positionsbeleuchtung",
  camera_power: "Kamera-Strom",
  speed: "Geschwindigkeit",
  heading: "Kurs",
  position: "Position",
  on: "An",
  off: "Aus",
  unavailable: "Nicht verfügbar",
  grafana: "Grafana",
  open_grafana: "Grafana öffnen",
  dock: "Am Steg",
  sailing: "Unter Segeln",
  trailer: "Auf dem Anhänger",
  charging: "lädt",
  discharging: "entlädt",
  preset: "Preset",
  move: "Bewegen"
}, je = {
  battery: "Battery",
  main_battery: "Main battery",
  motor_battery: "Motor battery",
  solar: "Solar",
  solar_main: "Solar main array",
  solar_secondary: "Solar secondary array",
  yield_today: "Yield today",
  power_now: "Power",
  voltage: "Voltage",
  current: "Current",
  soc: "State of charge",
  fridge: "Fridge",
  fridge_temp: "Fridge temperature",
  temperature: "Temperature",
  water_temp: "Water temperature",
  camera: "Camera",
  depth: "Depth sounder",
  nav_lights: "Navigation lights",
  camera_power: "Camera power",
  speed: "Speed",
  heading: "Heading",
  position: "Position",
  on: "On",
  off: "Off",
  unavailable: "Unavailable",
  grafana: "Grafana",
  open_grafana: "Open Grafana",
  dock: "At the dock",
  sailing: "Sailing",
  trailer: "On the trailer",
  charging: "charging",
  discharging: "discharging",
  preset: "Preset",
  move: "Move"
};
function He(e) {
  return (e?.locale?.language ?? e?.language ?? "de").toLowerCase().startsWith("de") ? "de" : "en";
}
function m(e, t) {
  return (He(e) === "de" ? Re : je)[t] ?? t;
}
function Ie(e) {
  switch (e) {
    case "glass":
      return "s-glass";
    case "default":
      return "s-default";
    case "marine":
    default:
      return "s-marine";
  }
}
function nt(e, t) {
  return Ie(e) + (Ne(t) ? " dark" : "");
}
const ct = E`
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
`, Ct = () => k`
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
`, Et = (e) => k`
  <line x1="212" y1="132" x2="212" y2="34" stroke="#e7e2d6" stroke-width="4"
        stroke-linecap="round" />
  ${e ? k`
        <path d="M208 40 Q150 90 176 150 L208 150 Z" fill="#f4f1ea" />
        <path d="M216 44 Q270 92 250 150 L216 150 Z" fill="#fbfaf6" />
        <path d="M208 40 Q150 90 176 150" fill="none" stroke="#d9d3c4" stroke-width="1.5" />` : k`
        <path d="M212 40 Q206 90 212 150" fill="none" stroke="#cfe0f5" stroke-width="10"
              stroke-linecap="round" opacity="0.9" />`}
`, oe = (e) => k`
  <g opacity="0.7" stroke="#7fa8d8" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M60 200 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" />
    ${e ? k`<path d="M40 214 q16 -6 32 0 t32 0 t32 0 t32 0 t32 0 t32 0"
                    opacity="0.5" />` : c}
  </g>
`, Fe = () => k`
  ${oe(!1)}
  <!-- pier -->
  <g>
    <path d="M300 196 L392 176 L392 190 L300 210 Z" fill="#b98c5a" />
    <path d="M300 196 L392 176 L392 179 L300 199 Z" fill="#caa06f" />
    <rect x="330" y="205" width="6" height="26" fill="#7c5a34" />
    <rect x="372" y="196" width="6" height="30" fill="#7c5a34" />
  </g>
  ${Ct()}
  ${Et(!1)}
`, Ge = () => k`
  ${oe(!0)}
  ${Ct()}
  ${Et(!0)}
  <!-- little wake -->
  <path d="M70 200 q-18 4 -30 -2" fill="none" stroke="#fff" stroke-width="3"
        stroke-linecap="round" opacity="0.55" />
`, Qe = () => k`
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
  ${Ct()}
  ${Et(!1)}
`;
function ne(e) {
  const t = e === "sailing" ? Ge() : e === "trailer" ? Qe() : Fe();
  return n`<svg
    viewBox="0 0 410 240"
    xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;display:block"
  >
    ${t}
  </svg>`;
}
const $t = ["dock", "sailing", "trailer"];
var We = Object.defineProperty, Ze = Object.getOwnPropertyDescriptor, Pt = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ze(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && We(t, i, r), r;
};
let tt = class extends $ {
  setConfig(e) {
    if (!e) throw new Error("Invalid configuration");
    this._config = e;
  }
  getCardSize() {
    return 5;
  }
  static getStubConfig() {
    return {
      type: "custom:boat-battery-card",
      title: "Batterie & Solar",
      card_style: "marine",
      main_battery: {
        name: "Hauptbatterie",
        soc: "sensor.main_battery_soc",
        voltage: "sensor.main_battery_voltage",
        current: "sensor.main_battery_current"
      },
      solar_main: {
        name: "Solar Hauptmodul",
        power: "sensor.solar_main_power",
        yield_today: "sensor.solar_main_yield_today"
      }
    };
  }
  static getConfigElement() {
    return document.createElement("boat-battery-card-editor");
  }
  _socColor(e) {
    return Number.isFinite(e) ? e >= 50 ? "var(--bc-battery)" : e >= 20 ? "var(--bc-solar)" : "#e5484d" : "var(--bc-muted)";
  }
  _batteryTile(e, t) {
    if (!e) return c;
    const i = h(this.hass, e.soc), s = T(i), r = this._socColor(s), a = [], o = (d, l) => {
      const u = h(this.hass, d);
      !d || N(u) || a.push(n`<div class="kv">
        <span>${l}</span><b>${_(this.hass, u)}</b>
      </div>`);
    };
    return o(e.voltage, m(this.hass, "voltage")), o(e.current, m(this.hass, "current")), o(e.power, m(this.hass, "power_now")), o(e.temperature, m(this.hass, "temperature")), o(e.time_remaining, "⌛"), n`<div class="bc-tile" @click=${() => e.soc && R(this, e.soc)}>
      <div class="bc-tile-head">
        <ha-icon .icon=${e.icon ?? "mdi:car-battery"}></ha-icon>
        ${e.name ?? t}
      </div>
      ${i ? n`<div class="bc-value" style="color:${r}">
              ${_(this.hass, i, { unit: "%", precision: 0 })}
            </div>
            <div class="bc-progress">
              <span
                style="width:${Math.max(0, Math.min(100, s || 0))}%;--bar-color:${r}"
              ></span>
            </div>` : c}
      <div class="kvs">${a}</div>
    </div>`;
  }
  _solarTile(e, t) {
    if (!e) return c;
    const i = h(this.hass, e.power), s = [], r = (a, o) => {
      const d = h(this.hass, a);
      !a || N(d) || s.push(n`<div class="kv">
        <span>${o}</span><b>${_(this.hass, d)}</b>
      </div>`);
    };
    return r(e.yield_today, m(this.hass, "yield_today")), r(e.voltage, m(this.hass, "voltage")), r(e.current, m(this.hass, "current")), r(e.state, m(this.hass, "preset")), n`<div class="bc-tile" @click=${() => e.power && R(this, e.power)}>
      <div class="bc-tile-head">
        <ha-icon icon="mdi:solar-power-variant"></ha-icon>
        ${e.name ?? t}
      </div>
      ${i ? n`<div class="bc-value" style="color:var(--bc-solar)">
            ${_(this.hass, i, { unit: "W", precision: 0 })}
          </div>` : c}
      <div class="kvs">${s}</div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return c;
    const e = this._config, t = nt(e.card_style, this.hass);
    return n`<ha-card
      class=${t}
      style="background:none;border:none;box-shadow:none"
    >
      <div class="bc-root ${e.background === !1 ? "no-bg" : ""}">
        ${e.title ? n`<div class="bc-head">
              <div class="bc-title small">${e.title}</div>
            </div>` : c}
        <div class="bc-grid two">
          ${this._batteryTile(e.main_battery, m(this.hass, "main_battery"))}
          ${this._batteryTile(e.motor_battery, m(this.hass, "motor_battery"))}
          ${this._solarTile(e.solar_main, m(this.hass, "solar_main"))}
          ${this._solarTile(e.solar_secondary, m(this.hass, "solar_secondary"))}
        </div>
      </div>
    </ha-card>`;
  }
};
tt.styles = [
  ct,
  E`
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
    `
];
Pt([
  v({ attribute: !1 })
], tt.prototype, "hass", 2);
Pt([
  w()
], tt.prototype, "_config", 2);
tt = Pt([
  x("boat-battery-card")
], tt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-battery-card",
  name: "Boat Battery & Solar Card",
  description: "Main + motor battery banks and Victron solar arrays.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
var qe = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, zt = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ve(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && qe(t, i, r), r;
};
let et = class extends $ {
  setConfig(e) {
    if (!e || !e.switch)
      throw new Error('boat-fridge-card: "switch" is required');
    this._config = e;
  }
  getCardSize() {
    return 3;
  }
  static getStubConfig() {
    return {
      type: "custom:boat-fridge-card",
      title: "Kühlschrank",
      card_style: "marine",
      switch: "switch.fridge",
      temperature: "sensor.fridge_temperature"
    };
  }
  static getConfigElement() {
    return document.createElement("boat-fridge-card-editor");
  }
  render() {
    if (!this._config || !this.hass) return c;
    const e = this._config, t = nt(e.card_style, this.hass), i = h(this.hass, e.switch), s = mt(i), r = h(this.hass, e.temperature);
    return n`<ha-card
      class=${t}
      style="background:none;border:none;box-shadow:none"
    >
      <div class="bc-root ${e.background === !1 ? "no-bg" : ""}">
        ${e.title ? n`<div class="bc-head">
              <div class="bc-title small">${e.title}</div>
            </div>` : c}
        <div class="fridge">
          <button
            class="power ${s ? "on" : ""}"
            @click=${() => bt(this.hass, e.switch)}
          >
            <ha-icon icon="mdi:fridge-outline"></ha-icon>
            <span>${s ? m(this.hass, "on") : m(this.hass, "off")}</span>
          </button>

          <div class="readouts">
            ${e.temperature ? n`<div
                  class="ro"
                  @click=${() => R(this, e.temperature)}
                >
                  <span class="l">${m(this.hass, "fridge_temp")}</span>
                  <span class="v"
                    >${_(this.hass, r, { precision: 1 })}</span
                  >
                </div>` : c}
            ${e.target && !N(h(this.hass, e.target)) ? n`<div class="ro">
                  <span class="l">${m(this.hass, "preset")}</span>
                  <span class="v"
                    >${_(this.hass, h(this.hass, e.target), {
      precision: 1
    })}</span
                  >
                </div>` : c}
            ${e.power && !N(h(this.hass, e.power)) ? n`<div class="ro">
                  <span class="l">${m(this.hass, "power_now")}</span>
                  <span class="v"
                    >${_(this.hass, h(this.hass, e.power))}</span
                  >
                </div>` : c}
          </div>
        </div>
      </div>
    </ha-card>`;
  }
};
et.styles = [
  ct,
  E`
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
    `
];
zt([
  v({ attribute: !1 })
], et.prototype, "hass", 2);
zt([
  w()
], et.prototype, "_config", 2);
et = zt([
  x("boat-fridge-card")
], et);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-fridge-card",
  name: "Boat Fridge Card",
  description: "Fridge power toggle with temperature and power readout.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
var Ke = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, Ot = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ye(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Ke(t, i, r), r;
};
const Xe = ["left", "right", "up", "down", "zoom_in", "zoom_out"];
let it = class extends $ {
  setConfig(e) {
    if (!e || !e.camera)
      throw new Error('boat-camera-card: "camera" is required');
    this._config = e;
  }
  getCardSize() {
    return 6;
  }
  static getStubConfig() {
    return {
      type: "custom:boat-camera-card",
      title: "Kamera",
      card_style: "marine",
      camera: "camera.mast",
      ptz: !0
    };
  }
  static getConfigElement() {
    return document.createElement("boat-camera-card-editor");
  }
  // Resolve the six PTZ buttons: explicit config first, then auto-discovery.
  _ptzButtons() {
    const e = this._config;
    if (e.ptz_buttons) return e.ptz_buttons;
    const t = {}, i = {};
    for (const o of Object.keys(this.hass.states)) {
      if (re(o) !== "button") continue;
      const d = o.match(/^button\.(.+)_ptz_(left|right|up|down|zoom_in|zoom_out)$/);
      if (!d) continue;
      const [, l, u] = d;
      (i[l] ?? (i[l] = {}))[u] = o;
    }
    const s = e.camera.split(".")[1] ?? "";
    let r = "", a = -1;
    for (const o of Object.keys(i)) {
      const d = this._overlap(o, s);
      d > a && (a = d, r = o);
    }
    return r ? i[r] : t;
  }
  _overlap(e, t) {
    const i = e.split("_"), s = t.split("_");
    let r = 0;
    for (; r < i.length && r < s.length && i[r] === s[r]; ) r++;
    return r;
  }
  _pressPtz(e) {
    e && this.hass.callService("button", "press", { entity_id: e });
  }
  _selectPreset(e) {
    const t = e.target.value;
    !t || !this._config?.presets || this.hass.callService("select", "select_option", {
      entity_id: this._config.presets,
      option: t
    });
  }
  _renderImage(e) {
    const t = e?.attributes?.entity_picture;
    return n`<div class="cam" @click=${() => R(this, this._config.camera)}>
      ${e ? n`<ha-camera-stream
            .hass=${this.hass}
            .stateObj=${e}
            muted
          ></ha-camera-stream>` : c}
      ${!e && t ? n`<img src=${t} alt="camera" />` : c}
    </div>`;
  }
  _renderPtz() {
    const e = this._config;
    if (e.ptz === !1) return c;
    const t = this._ptzButtons();
    if (!Xe.some((r) => t[r]) && e.ptz !== !0) return c;
    const s = (r, a) => n`<button
        class="ptz-btn"
        ?disabled=${!t[r]}
        @click=${() => this._pressPtz(t[r])}
      >
        <ha-icon .icon=${a}></ha-icon>
      </button>`;
    return n`<div class="ptz">
      <div class="pad">
        <span></span>${s("up", "mdi:chevron-up")}<span></span>
        ${s("left", "mdi:chevron-left")}
        <ha-icon class="pad-center" icon="mdi:pan"></ha-icon>
        ${s("right", "mdi:chevron-right")} <span></span>
        ${s("down", "mdi:chevron-down")}<span></span>
      </div>
      <div class="zoom">
        ${s("zoom_out", "mdi:magnify-minus-outline")}
        ${s("zoom_in", "mdi:magnify-plus-outline")}
      </div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return c;
    const e = this._config, t = nt(e.card_style, this.hass), i = h(this.hass, e.camera), s = h(this.hass, e.power), r = h(this.hass, e.presets);
    return n`<ha-card
      class=${t}
      style="background:none;border:none;box-shadow:none"
    >
      <div class="bc-root ${e.background === !1 ? "no-bg" : ""}">
        <div class="cam-head">
          ${e.title ? n`<div class="bc-title small">${e.title}</div>` : c}
          ${e.power ? n`<button
                class="pow ${mt(s) ? "on" : ""}"
                title=${m(this.hass, "camera_power")}
                @click=${() => bt(this.hass, e.power)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>` : c}
        </div>

        <div class="cam-wrap" style="--ar:${(e.aspect_ratio ?? "16:9").replace(":", "/")}">
          ${e.power && !mt(s) ? n`<div class="cam off">
                <ha-icon icon="mdi:cctv-off"></ha-icon>
                <span>${m(this.hass, "off")}</span>
              </div>` : this._renderImage(i)}
        </div>

        ${r && !N(r) ? n`<div class="presets">
              <ha-icon icon="mdi:map-marker-radius"></ha-icon>
              <select @change=${this._selectPreset}>
                ${(r.attributes.options ?? []).map(
      (a) => n`<option ?selected=${a === r.state}>${a}</option>`
    )}
              </select>
            </div>` : c}

        ${this._renderPtz()}
      </div>
    </ha-card>`;
  }
};
it.styles = [
  ct,
  E`
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
    `
];
Ot([
  v({ attribute: !1 })
], it.prototype, "hass", 2);
Ot([
  w()
], it.prototype, "_config", 2);
it = Ot([
  x("boat-camera-card")
], it);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-camera-card",
  name: "Boat Camera Card",
  description: "Reolink live view with PTZ controls and presets.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
var Je = Object.defineProperty, ti = Object.getOwnPropertyDescriptor, Mt = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ti(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Je(t, i, r), r;
};
let st = class extends $ {
  setConfig(e) {
    if (!e || !e.url)
      throw new Error('boat-grafana-card: "url" is required');
    this._config = e;
  }
  getCardSize() {
    const e = this._config?.height ?? 400;
    return Math.max(3, Math.round(e / 50));
  }
  static getStubConfig() {
    return {
      type: "custom:boat-grafana-card",
      title: "Grafana",
      card_style: "marine",
      url: "https://grafana.local/d/xxxx/boat?orgId=1",
      height: 420
    };
  }
  static getConfigElement() {
    return document.createElement("boat-grafana-card-editor");
  }
  _prefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  _url() {
    const e = this._config;
    if (e.auto_params === !1) return e.url;
    let t = e.url;
    const i = (s, r) => {
      new RegExp(`[?&]${s}(=|&|$)`).test(t) || (t += (t.includes("?") ? "&" : "?") + (r ? `${s}=${r}` : s));
    };
    return i("theme", this._prefersDark() ? "dark" : "light"), i("kiosk"), t;
  }
  render() {
    if (!this._config || !this.hass) return c;
    const e = this._config, t = nt(e.card_style, this.hass);
    return n`<ha-card
      class=${t}
      style="background:none;border:none;box-shadow:none"
    >
      <div class="bc-root ${e.background === !1 ? "no-bg" : ""}">
        <div class="g-head">
          ${e.title ? n`<div class="bc-title small">${e.title}</div>` : c}
          ${e.show_open !== !1 ? n`<a
                class="open"
                href=${e.url}
                target="_blank"
                rel="noopener"
                title=${m(this.hass, "open_grafana")}
              >
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </a>` : c}
        </div>
        <iframe
          class="frame"
          style="height:${e.height ?? 400}px"
          src=${this._url()}
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </div>
    </ha-card>`;
  }
};
st.styles = [
  ct,
  E`
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
    `
];
Mt([
  v({ attribute: !1 })
], st.prototype, "hass", 2);
Mt([
  w()
], st.prototype, "_config", 2);
st = Mt([
  x("boat-grafana-card")
], st);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-grafana-card",
  name: "Boat Grafana Card",
  description: "Embed a Grafana dashboard/panel with kiosk + theme handling.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
var ei = Object.defineProperty, ii = Object.getOwnPropertyDescriptor, y = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ii(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ei(t, i, r), r;
};
const yt = {
  dock: "Am Steg",
  sailing: "Segeln",
  trailer: "Anhänger"
}, si = [
  "right",
  "left",
  "top",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
].map((e) => ({ value: e, label: e })), ce = {
  entity: "Entität",
  entity2: "Zweite Entität (z. B. Strom)",
  name: "Name",
  icon: "Icon",
  icon_on: "Icon (wenn an)",
  color: "Farbe (Token oder #hex)",
  unit: "Einheit",
  precision: "Nachkommastellen",
  tap_action: "Tippen",
  x: "X (%)",
  y: "Y (%)",
  dot: "Label-Richtung",
  hidden: "In dieser Ansicht ausblenden"
};
function xt(e) {
  const t = {};
  for (const [i, s] of Object.entries(e))
    s == null || s === "" || (t[i] = s);
  return t;
}
function I(e) {
  return e.map((t) => ({
    ...t,
    positions: t.positions ? Object.fromEntries(
      Object.entries(t.positions).map(([i, s]) => [i, { ...s }])
    ) : void 0
  }));
}
let A = class extends $ {
  constructor() {
    super(...arguments), this.chips = [], this._variant = "dock", this._expanded = -1, this._label = (e) => ce[e?.name] ?? e?.name ?? "";
  }
  get _chips() {
    return this._working ?? this.chips ?? [];
  }
  _emit(e) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e.map((t) => xt(t)) },
        bubbles: !0,
        composed: !0
      })
    );
  }
  // ---- drag placement ----
  _stageRect() {
    return this.renderRoot?.querySelector(".ce-stage")?.getBoundingClientRect();
  }
  _onDotDown(e, t) {
    e.preventDefault(), e.stopPropagation(), e.currentTarget.setPointerCapture(e.pointerId), this._working = I(this.chips), this._drag = { index: t, pointerId: e.pointerId, moved: !1, x0: e.clientX, y0: e.clientY };
  }
  _onDotMove(e) {
    if (!this._drag) return;
    Math.abs(e.clientX - this._drag.x0) + Math.abs(e.clientY - this._drag.y0) > 3 && (this._drag.moved = !0);
    const t = this._stageRect();
    if (!t) return;
    let i = (e.clientX - t.left) / t.width * 100, s = (e.clientY - t.top) / t.height * 100;
    i = Math.max(0, Math.min(100, Math.round(i * 10) / 10)), s = Math.max(0, Math.min(100, Math.round(s * 10) / 10));
    const r = this._working[this._drag.index], a = r.positions?.[this._variant] ?? { x: 50, y: 50 };
    r.positions = { ...r.positions ?? {}, [this._variant]: { ...a, x: i, y: s } }, this.requestUpdate();
  }
  _onDotUp(e, t) {
    if (!this._drag) return;
    const i = this._drag.moved, s = this._working ?? this.chips;
    this._drag = void 0, this._working = void 0, i ? this._emit(s) : this._expanded = this._expanded === t ? -1 : t;
  }
  _chipPos(e) {
    const t = e.positions?.[this._variant];
    return t && !t.hidden ? t : void 0;
  }
  // ---- chip mutations ----
  _addChip() {
    const e = I(this.chips);
    e.push({
      entity: "",
      positions: { [this._variant]: { x: 50, y: 50, dot: "right" } }
    }), this._expanded = e.length - 1, this._emit(e);
  }
  _removeChip(e) {
    const t = I(this.chips);
    t.splice(e, 1), this._expanded === e && (this._expanded = -1), this._emit(t);
  }
  _moveChip(e, t) {
    const i = I(this.chips), s = e + t;
    s < 0 || s >= i.length || ([i[e], i[s]] = [i[s], i[e]], this._emit(i));
  }
  _placeHere(e) {
    const t = I(this.chips);
    t[e].positions = {
      ...t[e].positions ?? {},
      [this._variant]: { x: 50, y: 50, dot: "right" }
    }, this._emit(t);
  }
  _chipSchema() {
    return [
      { name: "entity", selector: { entity: {} } },
      { name: "entity2", selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "color", selector: { text: {} } },
          { name: "unit", selector: { text: {} } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "precision", selector: { number: { min: 0, max: 4, mode: "box" } } },
          {
            name: "tap_action",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "more-info", label: "Info-Dialog" },
                  { value: "toggle", label: "Schalten" },
                  { value: "link", label: "Link" },
                  { value: "none", label: "Nichts" }
                ]
              }
            }
          }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "x", selector: { number: { min: 0, max: 100, step: 0.5, mode: "box" } } },
          { name: "y", selector: { number: { min: 0, max: 100, step: 0.5, mode: "box" } } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "dot", selector: { select: { mode: "dropdown", options: si } } },
          { name: "hidden", selector: { boolean: {} } }
        ]
      }
    ];
  }
  _flatten(e) {
    const t = e.positions?.[this._variant] ?? {};
    return xt({
      entity: e.entity,
      entity2: e.entity2,
      name: e.name,
      icon: e.icon,
      color: e.color,
      unit: e.unit,
      precision: e.precision,
      tap_action: e.tap_action,
      x: t.x,
      y: t.y,
      dot: t.dot,
      hidden: t.hidden
    });
  }
  _chipFormChanged(e, t) {
    e.stopPropagation();
    const i = e.detail.value, s = I(this.chips), r = s[t];
    r.entity = i.entity ?? "", r.entity2 = i.entity2 || void 0, r.name = i.name || void 0, r.icon = i.icon || void 0, r.color = i.color || void 0, r.unit = i.unit || void 0, r.precision = i.precision, r.tap_action = i.tap_action || void 0;
    const a = { ...r.positions ?? {} };
    i.x !== void 0 && i.y !== void 0 ? a[this._variant] = {
      x: i.x,
      y: i.y,
      dot: i.dot || void 0,
      hidden: i.hidden || void 0
    } : i.hidden ? a[this._variant] = {
      ...a[this._variant] ?? { x: 50, y: 50 },
      hidden: !0
    } : delete a[this._variant], r.positions = a, this._emit(s);
  }
  render() {
    const e = this._chips;
    return n`
      <div class="ce">
        <div class="ce-tabs">
          ${$t.map(
      (t) => n`<button
              class=${t === this._variant ? "on" : ""}
              @click=${() => this._variant = t}
            >
              ${yt[t]}
            </button>`
    )}
        </div>

        <div class="ce-stage-wrap">
          <div class="ce-stage">
            ${this.images?.[this._variant] ? n`<img src=${this.images[this._variant]} alt="" />` : n`<div class="svg">${ne(this._variant)}</div>`}
            ${e.map((t, i) => this._renderDot(t, i))}
          </div>
          <div class="ce-hint">
            Punkte auf das Boot ziehen · Antippen zum Bearbeiten ·
            Ansicht: <b>${yt[this._variant]}</b>
          </div>
        </div>

        <div class="ce-list">
          ${e.map((t, i) => this._renderRow(t, i))}
        </div>

        <button class="ce-add" @click=${this._addChip}>
          <ha-icon icon="mdi:plus"></ha-icon> Chip hinzufügen
        </button>
      </div>
    `;
  }
  _renderDot(e, t) {
    const i = this._chipPos(e);
    if (!i) return c;
    const s = h(this.hass, e.entity), r = gt(e.color) ?? "var(--bc-accent, #5b7cfa)", a = s ? _(this.hass, s, { precision: e.precision, unit: e.unit }) : "—";
    return n`<div
      class="ce-dot ${t === this._expanded ? "active" : ""}"
      style="left:${i.x}%;top:${i.y}%;--ac:${r}"
      @pointerdown=${(o) => this._onDotDown(o, t)}
      @pointermove=${this._onDotMove}
      @pointerup=${(o) => this._onDotUp(o, t)}
      @pointercancel=${(o) => this._onDotUp(o, t)}
      title=${e.name ?? D(s, e.entity)}
    >
      <span class="d"></span>
      <span class="lbl">${(e.name ?? D(s, e.entity)) || `#${t + 1}`}: ${a}</span>
    </div>`;
  }
  _renderRow(e, t) {
    const i = h(this.hass, e.entity), s = !!e.positions?.[this._variant], r = !!e.positions?.[this._variant]?.hidden, a = gt(e.color) ?? "var(--bc-accent, #5b7cfa)", o = (e.name ?? D(i, e.entity)) || `Chip #${t + 1}`, d = t === this._expanded;
    return n`<div class="ce-row ${d ? "open" : ""}">
      <div class="ce-row-head" @click=${() => this._expanded = d ? -1 : t}>
        <span class="swatch" style="background:${a}"></span>
        <span class="rn">${o}</span>
        <span class="badge ${s ? r ? "hid" : "ok" : "no"}">
          ${s ? r ? "ausgeblendet" : "platziert" : "nicht in dieser Ansicht"}
        </span>
        <span class="sp"></span>
        <ha-icon-button
          .label=${"hoch"}
          @click=${(l) => {
      l.stopPropagation(), this._moveChip(t, -1);
    }}
        ><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(l) => {
      l.stopPropagation(), this._moveChip(t, 1);
    }}
        ><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(l) => {
      l.stopPropagation(), this._removeChip(t);
    }}
        ><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${d ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${d ? n`<div class="ce-row-body">
            ${s ? c : n`<button class="ce-place" @click=${() => this._placeHere(t)}>
                  <ha-icon icon="mdi:map-marker-plus"></ha-icon>
                  In „${yt[this._variant]}" platzieren
                </button>`}
            <ha-form
              .hass=${this.hass}
              .data=${this._flatten(e)}
              .schema=${this._chipSchema()}
              .computeLabel=${this._label}
              @value-changed=${(l) => this._chipFormChanged(l, t)}
            ></ha-form>
          </div>` : c}
    </div>`;
  }
};
A.styles = E`
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
    .ce-dot {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: grab;
      display: flex;
      align-items: center;
      gap: 6px;
      touch-action: none;
    }
    .ce-dot:active {
      cursor: grabbing;
    }
    .ce-dot .d {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--ac);
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
      flex: 0 0 auto;
    }
    .ce-dot.active .d {
      outline: 2px solid var(--ac);
      outline-offset: 2px;
    }
    .ce-dot .lbl {
      background: rgba(255, 255, 255, 0.92);
      color: #16233a;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 8px;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
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
y([
  v({ attribute: !1 })
], A.prototype, "hass", 2);
y([
  v({ attribute: !1 })
], A.prototype, "chips", 2);
y([
  v({ attribute: !1 })
], A.prototype, "images", 2);
y([
  w()
], A.prototype, "_variant", 2);
y([
  w()
], A.prototype, "_expanded", 2);
y([
  w()
], A.prototype, "_working", 2);
A = y([
  x("boat-chips-editor")
], A);
let L = class extends $ {
  constructor() {
    super(...arguments), this.items = [], this.fields = [], this.addLabel = "Hinzufügen", this._expanded = -1, this._label = (e) => ce[e?.name] ?? e?.name ?? "";
  }
  _emit(e) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e.map((t) => xt(t)) },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _norm(e) {
    return typeof e == "string" ? { entity: e } : { ...e };
  }
  _add() {
    const e = this.items.map((t) => this._norm(t));
    e.push({ entity: "" }), this._expanded = e.length - 1, this._emit(e);
  }
  _remove(e) {
    const t = this.items.map((i) => this._norm(i));
    t.splice(e, 1), this._expanded === e && (this._expanded = -1), this._emit(t);
  }
  _move(e, t) {
    const i = this.items.map((r) => this._norm(r)), s = e + t;
    s < 0 || s >= i.length || ([i[e], i[s]] = [i[s], i[e]], this._emit(i));
  }
  _changed(e, t) {
    e.stopPropagation();
    const i = this.items.map((s) => this._norm(s));
    i[t] = { ...i[t], ...e.detail.value }, this._emit(i);
  }
  render() {
    const e = (this.items ?? []).map((t) => this._norm(t));
    return n`<div class="li">
      ${e.map((t, i) => {
      const s = h(this.hass, t.entity), r = i === this._expanded, a = (t.name ?? D(s, t.entity)) || `#${i + 1}`;
      return n`<div class="row ${r ? "open" : ""}">
          <div class="head" @click=${() => this._expanded = r ? -1 : i}>
            ${t.icon ? n`<ha-icon icon=${t.icon}></ha-icon>` : c}
            <span class="n">${a}</span>
            <span class="sp"></span>
            <ha-icon-button @click=${(o) => {
        o.stopPropagation(), this._move(i, -1);
      }}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(o) => {
        o.stopPropagation(), this._move(i, 1);
      }}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(o) => {
        o.stopPropagation(), this._remove(i);
      }}>
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          </div>
          ${r ? n`<div class="body">
                <ha-form
                  .hass=${this.hass}
                  .data=${t}
                  .schema=${this.fields}
                  .computeLabel=${this._label}
                  @value-changed=${(o) => this._changed(o, i)}
                ></ha-form>
              </div>` : c}
        </div>`;
    })}
      <button class="add" @click=${this._add}>
        <ha-icon icon="mdi:plus"></ha-icon> ${this.addLabel}
      </button>
    </div>`;
  }
};
L.styles = E`
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
y([
  v({ attribute: !1 })
], L.prototype, "hass", 2);
y([
  v({ attribute: !1 })
], L.prototype, "items", 2);
y([
  v({ attribute: !1 })
], L.prototype, "fields", 2);
y([
  v({ type: String })
], L.prototype, "addLabel", 2);
y([
  w()
], L.prototype, "_expanded", 2);
L = y([
  x("boat-items-editor")
], L);
var ri = Object.defineProperty, ai = Object.getOwnPropertyDescriptor, H = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ai(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ri(t, i, r), r;
};
const rt = {
  title: "Titel",
  subtitle: "Untertitel",
  card_style: "Kartenstil",
  background: "Hintergrund anzeigen",
  variant: "Aktive Ansicht",
  variant_entity: "Ansicht aus Entität",
  show_variant_switch: "Umschalter anzeigen",
  image_remove_black: "Schwarz transparent machen",
  images: "Bilder (URLs)",
  dock: "Am Steg (URL)",
  sailing: "Unter Segeln (URL)",
  trailer: "Auf dem Anhänger (URL)",
  gps: "GPS",
  speed: "Geschwindigkeit",
  heading: "Kurs",
  location: "Standort (device_tracker)",
  lat: "Breitengrad (Sensor)",
  lon: "Längengrad (Sensor)",
  speed_unit: "Einheit Geschwindigkeit",
  main_battery: "Hauptbatterie",
  motor_battery: "Motorbatterie",
  solar_main: "Solar Hauptmodul",
  solar_secondary: "Solar Zweitmodul",
  soc: "Ladezustand (%)",
  voltage: "Spannung",
  current: "Strom",
  power: "Leistung",
  temperature: "Temperatur",
  time_remaining: "Restzeit",
  yield_today: "Ertrag heute",
  state: "Ladezustand (Text)",
  name: "Name",
  switch: "Schalter (Strom)",
  target: "Sollwert",
  camera: "Kamera",
  ptz: "PTZ-Steuerung",
  presets: "Preset-Auswahl (select)",
  aspect_ratio: "Seitenverhältnis",
  url: "Grafana-URL",
  height: "Höhe (px)",
  auto_params: "kiosk/theme automatisch",
  show_open: '„Öffnen"-Button'
}, lt = {
  name: "card_style",
  selector: {
    select: {
      mode: "dropdown",
      options: [
        { value: "marine", label: "Marine (Blau)" },
        { value: "glass", label: "Glass" },
        { value: "default", label: "HA Standard" }
      ]
    }
  }
}, g = (e) => ({
  name: e,
  selector: { entity: { domain: "sensor" } }
}), M = (e, t) => ({
  name: e,
  selector: { entity: t ? { domain: t } : {} }
}), f = (e) => ({ name: e, selector: { text: {} } }), at = (e) => ({ name: e, selector: { boolean: {} } }), Nt = class Nt extends $ {
  constructor() {
    super(...arguments), this._label = (t) => rt[t?.name] ?? t?.name ?? "";
  }
  setConfig(t) {
    this._config = t;
  }
  schema() {
    return [];
  }
  hint() {
    return c;
  }
  /** Replace the whole config and notify Home Assistant. */
  _emit(t) {
    this._config = t, Ue(this, "config-changed", { config: t });
  }
  _valueChanged(t) {
    t.stopPropagation(), this._config && this._emit({ ...this._config, ...t.detail.value });
  }
  /** The scalar ha-form for this editor's schema(). */
  _formTemplate() {
    return n`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema()}
      .computeLabel=${this._label}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }
  render() {
    return !this.hass || !this._config ? c : n`${this.hint()} ${this._formTemplate()}`;
  }
};
Nt.styles = E`
    .hint {
      display: block;
      margin: 4px 0 12px;
      padding: 10px 12px;
      border-radius: 10px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .hint code {
      font-family: var(--code-font-family, monospace);
    }
    .section {
      margin-top: 18px;
    }
    .section-title {
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--primary-text-color);
    }
    .section-sub {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      margin: -4px 0 10px;
    }
  `;
let C = Nt;
H([
  v({ attribute: !1 })
], C.prototype, "hass", 2);
H([
  w()
], C.prototype, "_config", 2);
const oi = [
  { name: "entity", selector: { entity: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } }
    ]
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "unit", selector: { text: {} } },
      { name: "precision", selector: { number: { min: 0, max: 4, mode: "box" } } }
    ]
  }
], ni = [
  { name: "entity", selector: { entity: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } }
    ]
  },
  { name: "icon_on", selector: { icon: {} } }
];
let Qt = class extends C {
  _chipsChanged(e) {
    e.stopPropagation(), this._emit({ ...this._config, chips: e.detail.value });
  }
  _statsChanged(e) {
    e.stopPropagation(), this._emit({ ...this._config, stats: e.detail.value });
  }
  _controlsChanged(e) {
    e.stopPropagation(), this._emit({ ...this._config, controls: e.detail.value });
  }
  render() {
    return !this.hass || !this._config ? c : n`
      ${this._formTemplate()}
      <div class="section">
        <div class="section-title">Chips auf dem Boot</div>
        <div class="section-sub">
          Ziehe die Punkte auf das Boot. Jede Ansicht (Steg/Segeln/Anhänger) hat
          eigene Positionen.
        </div>
        <boat-chips-editor
          .hass=${this.hass}
          .chips=${this._config.chips ?? []}
          .images=${this._config.images}
          @value-changed=${this._chipsChanged}
        ></boat-chips-editor>
      </div>
      <div class="section">
        <div class="section-title">Werte-Zeile</div>
        <boat-items-editor
          .hass=${this.hass}
          .items=${this._config.stats ?? []}
          .fields=${oi}
          addLabel="Wert hinzufügen"
          @value-changed=${this._statsChanged}
        ></boat-items-editor>
      </div>
      <div class="section">
        <div class="section-title">Aktoren (Schalter-Reihe)</div>
        <boat-items-editor
          .hass=${this.hass}
          .items=${this._config.controls ?? []}
          .fields=${ni}
          addLabel="Aktor hinzufügen"
          @value-changed=${this._controlsChanged}
        ></boat-items-editor>
      </div>
    `;
  }
  schema() {
    return [
      f("title"),
      f("subtitle"),
      { type: "grid", name: "", schema: [lt, at("show_variant_switch")] },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "variant",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "dock", label: "Am Steg" },
                  { value: "sailing", label: "Unter Segeln" },
                  { value: "trailer", label: "Auf dem Anhänger" }
                ]
              }
            }
          },
          M("variant_entity")
        ]
      },
      {
        type: "expandable",
        name: "images",
        title: rt.images,
        schema: [f("dock"), f("sailing"), f("trailer"), at("image_remove_black")]
      },
      {
        type: "expandable",
        name: "gps",
        title: rt.gps,
        schema: [
          g("speed"),
          g("heading"),
          M("location", ["device_tracker", "person", "zone"]),
          g("lat"),
          g("lon"),
          f("speed_unit")
        ]
      }
    ];
  }
};
Qt = H([
  x("boat-card-editor")
], Qt);
const Wt = (e) => ({
  type: "expandable",
  name: e,
  title: rt[e] ?? e,
  schema: [
    f("name"),
    g("soc"),
    g("voltage"),
    g("current"),
    g("power"),
    g("temperature"),
    g("time_remaining")
  ]
}), Zt = (e) => ({
  type: "expandable",
  name: e,
  title: rt[e] ?? e,
  schema: [
    f("name"),
    g("power"),
    g("yield_today"),
    g("voltage"),
    g("current"),
    M("state")
  ]
});
let qt = class extends C {
  schema() {
    return [
      f("title"),
      lt,
      Wt("main_battery"),
      Wt("motor_battery"),
      Zt("solar_main"),
      Zt("solar_secondary")
    ];
  }
};
qt = H([
  x("boat-battery-card-editor")
], qt);
let Vt = class extends C {
  schema() {
    return [
      f("title"),
      lt,
      M("switch", ["switch", "input_boolean"]),
      g("temperature"),
      M("target", ["sensor", "number", "input_number"]),
      g("power")
    ];
  }
};
Vt = H([
  x("boat-fridge-card-editor")
], Vt);
let Kt = class extends C {
  schema() {
    return [
      f("title"),
      lt,
      M("camera", "camera"),
      M("power", ["switch", "input_boolean"]),
      at("ptz"),
      M("presets", "select"),
      f("aspect_ratio")
    ];
  }
};
Kt = H([
  x("boat-camera-card-editor")
], Kt);
let Yt = class extends C {
  schema() {
    return [
      f("title"),
      lt,
      f("url"),
      { name: "height", selector: { number: { min: 150, max: 1200, mode: "box" } } },
      { type: "grid", name: "", schema: [at("auto_params"), at("show_open")] }
    ];
  }
};
Yt = H([
  x("boat-grafana-card-editor")
], Yt);
var ci = Object.defineProperty, li = Object.getOwnPropertyDescriptor, vt = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? li(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ci(t, i, r), r;
};
let W = class extends $ {
  // manual switch in the UI
  setConfig(e) {
    if (!e) throw new Error("Invalid configuration");
    this._config = e, this._override = void 0;
  }
  getCardSize() {
    return 8;
  }
  static getStubConfig() {
    return {
      type: "custom:boat-card",
      title: "Hoppetosse",
      card_style: "marine",
      variant: "dock",
      show_variant_switch: !0,
      chips: [
        {
          entity: "sensor.solar_power",
          icon: "mdi:solar-power",
          positions: {
            dock: { x: 22, y: 30, dot: "right" },
            sailing: { x: 30, y: 24, dot: "right" },
            trailer: { x: 24, y: 34, dot: "right" }
          }
        },
        {
          entity: "sensor.battery_soc",
          icon: "mdi:battery",
          positions: {
            dock: { x: 70, y: 62, dot: "left" },
            sailing: { x: 66, y: 60, dot: "left" },
            trailer: { x: 72, y: 64, dot: "left" }
          }
        }
      ],
      stats: [],
      controls: []
    };
  }
  static getConfigElement() {
    return document.createElement("boat-card-editor");
  }
  // ---- variant resolution ----
  _variant() {
    if (this._override) return this._override;
    const e = this._config;
    if (e.variant_entity) {
      const t = h(this.hass, e.variant_entity);
      if (t) {
        const i = e.variant_map?.[t.state];
        if (i) return i;
        if ($t.includes(t.state))
          return t.state;
      }
    }
    return e.variant ?? "dock";
  }
  _tapChip(e) {
    const t = e.tap_action ?? "more-info";
    if (t !== "none") {
      if (t === "toggle") return bt(this.hass, e.entity);
      if (t === "link" && e.link) {
        /^https?:/.test(e.link) ? window.open(e.link, "_blank") : R(this, e.entity);
        return;
      }
      R(this, e.entity);
    }
  }
  render() {
    if (!this._config || !this.hass) return c;
    const e = this._config, t = this._variant(), i = nt(e.card_style, this.hass), s = e.background === !1;
    return n`
      <ha-card class=${i} style="background:none;border:none;box-shadow:none">
        <div class="bc-root ${s ? "no-bg" : ""}">
          ${e.title ? n`<div class="bc-head">
                <div class="bc-title">${e.title}</div>
                ${e.subtitle ? n`<div class="bc-subtitle">${e.subtitle}</div>` : c}
              </div>` : c}

          <div class="stage">
            ${this._renderImage(e, t)}
            <div class="chip-layer">
              ${(e.chips ?? []).map((r) => this._renderChip(r, t))}
            </div>
            ${e.show_variant_switch !== !1 ? this._renderSwitch(t) : c}
          </div>

          ${this._renderStats(e)} ${this._renderGps(e)}
          ${this._renderControls(e)}
        </div>
      </ha-card>
    `;
  }
  _renderImage(e, t) {
    const i = e.images?.[t];
    return i ? n`<img
        class="scene ${e.image_remove_black ? "rm-black" : ""}"
        src=${i}
        alt=${t}
      />` : n`<div class="scene svg">${ne(t)}</div>`;
  }
  _renderSwitch(e) {
    return n`<div class="variant-switch">
      ${$t.map(
      (t) => n`<button
          class=${t === e ? "on" : ""}
          title=${m(this.hass, t)}
          @click=${() => this._override = t}
        >
          <ha-icon
            .icon=${t === "dock" ? "mdi:dock-top" : t === "sailing" ? "mdi:sail-boat" : "mdi:truck-trailer"}
          ></ha-icon>
        </button>`
    )}
    </div>`;
  }
  // ---- chips ----
  _chipPos(e, t) {
    const i = e.positions?.[t];
    if (i) return i.hidden ? void 0 : i;
    if (e.x !== void 0 && e.y !== void 0)
      return { x: e.x, y: e.y, dot: e.dot };
  }
  _renderChip(e, t) {
    const i = this._chipPos(e, t), s = h(this.hass, e.entity);
    if (!i || !s) return c;
    const r = i.dot ?? (i.x >= 50 ? "left" : "right"), a = gt(e.color) ?? "var(--bc-accent)";
    let o;
    if (e.entity2) {
      const l = h(this.hass, e.entity2);
      o = `${_(this.hass, s, { precision: e.precision, unit: "" })} / ${_(
        this.hass,
        l,
        { precision: e.precision }
      )}`;
    } else
      o = _(this.hass, s, {
        precision: e.precision,
        unit: e.unit,
        attribute: e.attribute
      });
    const d = e.name ?? D(s, "");
    return n`<div
      class="anchor dot-${r}"
      style="left:${i.x}%;top:${i.y}%;--ac:${a}"
      @click=${() => this._tapChip(e)}
    >
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        ${e.icon ? n`<ha-icon class="ci" .icon=${e.icon}></ha-icon>` : c}
        <div class="anchor-txt">
          ${d ? n`<span class="anchor-name">${d}</span>` : c}
          <span class="anchor-val">${o}</span>
        </div>
      </div>
    </div>`;
  }
  // ---- stats row ----
  _renderStats(e) {
    const t = e.stats ?? [];
    return t.length ? n`<div class="bc-stats">
      ${t.map((i) => {
      const s = typeof i == "string" ? { entity: i } : i, r = h(this.hass, s.entity), a = gt(s.color);
      return n`<div
          class="bc-stat"
          @click=${() => R(this, s.entity)}
        >
          ${s.icon ? n`<ha-icon
                .icon=${s.icon}
                style=${a ? `color:${a}` : ""}
              ></ha-icon>` : c}
          <span class="v"
            >${_(this.hass, r, {
        precision: s.precision,
        unit: s.unit,
        attribute: s.attribute
      })}</span
          >
          <span class="l">${s.name ?? D(r, "")}</span>
        </div>`;
    })}
    </div>` : c;
  }
  // ---- gps footer ----
  _renderGps(e) {
    const t = e.gps;
    if (!t) return c;
    const i = [], s = h(this.hass, t.speed);
    s && !N(s) && i.push(n`<span class="gps-item"
        ><ha-icon icon="mdi:speedometer"></ha-icon
        >${_(this.hass, s, { unit: t.speed_unit })}</span
      >`);
    const r = h(this.hass, t.heading);
    if (r && !N(r)) {
      const o = T(r);
      i.push(n`<span class="gps-item"
        ><ha-icon icon="mdi:compass-outline"></ha-icon
        >${De(o)} ${Number.isFinite(o) ? n`${ae(this.hass, o, 0)}°` : ""}</span
      >`);
    }
    const a = this._coords(t);
    return a && i.push(n`<span class="gps-item"
        ><ha-icon icon="mdi:map-marker"></ha-icon>${a}</span
      >`), i.length ? n`<div class="gps-bar">${i}</div>` : c;
  }
  _coords(e) {
    let t = NaN, i = NaN;
    if (e.location) {
      const s = h(this.hass, e.location);
      t = T(s, "latitude"), i = T(s, "longitude");
    }
    return !Number.isFinite(t) && e.lat && (t = T(h(this.hass, e.lat))), !Number.isFinite(i) && e.lon && (i = T(h(this.hass, e.lon))), !Number.isFinite(t) || !Number.isFinite(i) ? "" : `${t.toFixed(4)}, ${i.toFixed(4)}`;
  }
  // ---- controls row (actor toggles) ----
  _renderControls(e) {
    const t = e.controls ?? [];
    return t.length ? n`<div class="bc-controls">
      ${t.map((i) => {
      const s = typeof i == "string" ? { entity: i } : i, r = h(this.hass, s.entity), a = mt(r), o = a ? s.icon_on ?? s.icon : s.icon;
      return n`<button
          class="bc-ctl ${a ? "on" : ""}"
          @click=${() => bt(this.hass, s.entity)}
        >
          <ha-icon .icon=${o ?? "mdi:power"}></ha-icon>
          <span class="cl">${s.name ?? D(r, "")}</span>
          <span class="cl">${a ? m(this.hass, "on") : m(this.hass, "off")}</span>
        </button>`;
    })}
    </div>` : c;
  }
};
W.styles = [
  ct,
  E`
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
    `
];
vt([
  v({ attribute: !1 })
], W.prototype, "hass", 2);
vt([
  w()
], W.prototype, "_config", 2);
vt([
  w()
], W.prototype, "_override", 2);
W = vt([
  x("boat-card")
], W);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-card",
  name: "Boat Card",
  description: "Graphical boat overview with per-image configurable chips, stats, actor controls and GPS.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
export {
  W as BoatCard
};
