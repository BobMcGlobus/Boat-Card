/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, vt = rt.ShadowRoot && (rt.ShadyCSS === void 0 || rt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, _t = Symbol(), kt = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== _t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (vt && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = kt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && kt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Zt = (e) => new Rt(typeof e == "string" ? e : e + "", void 0, _t), nt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, o, a) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[a + 1], e[0]);
  return new Rt(i, e, _t);
}, Gt = (e, t) => {
  if (vt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), o = rt.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = i.cssText, e.appendChild(r);
  }
}, St = vt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return Zt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: qt, defineProperty: Vt, getOwnPropertyDescriptor: Yt, getOwnPropertyNames: Xt, getOwnPropertySymbols: Jt, getPrototypeOf: te } = Object, P = globalThis, At = P.trustedTypes, ee = At ? At.emptyScript : "", ie = P.reactiveElementPolyfillSupport, Z = (e, t) => e, ot = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ee : null;
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
} }, xt = (e, t) => !qt(e, t), Et = { attribute: !0, type: String, converter: ot, reflect: !1, useDefault: !1, hasChanged: xt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), P.litPropertyMetadata ?? (P.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let B = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Et) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), o = this.getPropertyDescriptor(t, r, i);
      o !== void 0 && Vt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: o, set: a } = Yt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: o, set(s) {
      const l = o?.call(this);
      a?.call(this, s), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const t = te(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const i = this.properties, r = [...Xt(i), ...Jt(i)];
      for (const o of r) this.createProperty(o, i[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, o] of i) this.elementProperties.set(r, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const o = this._$Eu(i, r);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const o of r) i.unshift(St(o));
    } else t !== void 0 && i.push(St(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    const r = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, r);
    if (o !== void 0 && r.reflect === !0) {
      const a = (r.converter?.toAttribute !== void 0 ? r.converter : ot).toAttribute(i, r.type);
      this._$Em = t, a == null ? this.removeAttribute(o) : this.setAttribute(o, a), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const r = this.constructor, o = r._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const a = r.getPropertyOptions(o), s = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : ot;
      this._$Em = o;
      const l = s.fromAttribute(i, a.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, o = !1, a) {
    if (t !== void 0) {
      const s = this.constructor;
      if (o === !1 && (a = this[t]), r ?? (r = s.getPropertyOptions(t)), !((r.hasChanged ?? xt)(a, i) || r.useDefault && r.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: o, wrapped: a }, s) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), a !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), o === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, a] of r) {
        const { wrapped: s } = a, l = this[o];
        s !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, a, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
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
B.elementStyles = [], B.shadowRootOptions = { mode: "open" }, B[Z("elementProperties")] = /* @__PURE__ */ new Map(), B[Z("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: B }), (P.reactiveElementVersions ?? (P.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, Ct = (e) => e, at = G.trustedTypes, Pt = at ? at.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Tt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, Ht = "?" + C, re = `<${Ht}>`, T = document, V = () => T.createComment(""), Y = (e) => e === null || typeof e != "object" && typeof e != "function", yt = Array.isArray, oe = (e) => yt(e) || typeof e?.[Symbol.iterator] == "function", pt = `[ 	
\f\r]`, Q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zt = /-->/g, Ot = />/g, M = RegExp(`>|${pt}(?:([^\\s"'>=/]+)(${pt}*=${pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Nt = /'/g, Mt = /"/g, Bt = /^(?:script|style|textarea|title)$/i, jt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = jt(1), k = jt(2), j = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Lt = /* @__PURE__ */ new WeakMap(), R = T.createTreeWalker(T, 129);
function Dt(e, t) {
  if (!yt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pt !== void 0 ? Pt.createHTML(t) : t;
}
const ae = (e, t) => {
  const i = e.length - 1, r = [];
  let o, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = Q;
  for (let l = 0; l < i; l++) {
    const n = e[l];
    let h, g, u = -1, $ = 0;
    for (; $ < n.length && (s.lastIndex = $, g = s.exec(n), g !== null); ) $ = s.lastIndex, s === Q ? g[1] === "!--" ? s = zt : g[1] !== void 0 ? s = Ot : g[2] !== void 0 ? (Bt.test(g[2]) && (o = RegExp("</" + g[2], "g")), s = M) : g[3] !== void 0 && (s = M) : s === M ? g[0] === ">" ? (s = o ?? Q, u = -1) : g[1] === void 0 ? u = -2 : (u = s.lastIndex - g[2].length, h = g[1], s = g[3] === void 0 ? M : g[3] === '"' ? Mt : Nt) : s === Mt || s === Nt ? s = M : s === zt || s === Ot ? s = Q : (s = M, o = void 0);
    const A = s === M && e[l + 1].startsWith("/>") ? " " : "";
    a += s === Q ? n + re : u >= 0 ? (r.push(h), n.slice(0, u) + Tt + n.slice(u) + C + A) : n + C + (u === -2 ? l : A);
  }
  return [Dt(e, a + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class X {
  constructor({ strings: t, _$litType$: i }, r) {
    let o;
    this.parts = [];
    let a = 0, s = 0;
    const l = t.length - 1, n = this.parts, [h, g] = ae(t, i);
    if (this.el = X.createElement(h, r), R.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (o = R.nextNode()) !== null && n.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const u of o.getAttributeNames()) if (u.endsWith(Tt)) {
          const $ = g[s++], A = o.getAttribute(u).split(C), tt = /([.?@])?(.*)/.exec($);
          n.push({ type: 1, index: a, name: tt[2], strings: A, ctor: tt[1] === "." ? ne : tt[1] === "?" ? ce : tt[1] === "@" ? le : ct }), o.removeAttribute(u);
        } else u.startsWith(C) && (n.push({ type: 6, index: a }), o.removeAttribute(u));
        if (Bt.test(o.tagName)) {
          const u = o.textContent.split(C), $ = u.length - 1;
          if ($ > 0) {
            o.textContent = at ? at.emptyScript : "";
            for (let A = 0; A < $; A++) o.append(u[A], V()), R.nextNode(), n.push({ type: 2, index: ++a });
            o.append(u[$], V());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ht) n.push({ type: 2, index: a });
      else {
        let u = -1;
        for (; (u = o.data.indexOf(C, u + 1)) !== -1; ) n.push({ type: 7, index: a }), u += C.length - 1;
      }
      a++;
    }
  }
  static createElement(t, i) {
    const r = T.createElement("template");
    return r.innerHTML = t, r;
  }
}
function D(e, t, i = e, r) {
  if (t === j) return t;
  let o = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const a = Y(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== a && (o?._$AO?.(!1), a === void 0 ? o = void 0 : (o = new a(e), o._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = o : i._$Cl = o), o !== void 0 && (t = D(e, o._$AS(e, t.values), o, r)), t;
}
class se {
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
    const { el: { content: i }, parts: r } = this._$AD, o = (t?.creationScope ?? T).importNode(i, !0);
    R.currentNode = o;
    let a = R.nextNode(), s = 0, l = 0, n = r[0];
    for (; n !== void 0; ) {
      if (s === n.index) {
        let h;
        n.type === 2 ? h = new J(a, a.nextSibling, this, t) : n.type === 1 ? h = new n.ctor(a, n.name, n.strings, this, t) : n.type === 6 && (h = new de(a, this, t)), this._$AV.push(h), n = r[++l];
      }
      s !== n?.index && (a = R.nextNode(), s++);
    }
    return R.currentNode = T, o;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class J {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, r, o) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = D(this, t, i), Y(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== j && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : oe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && Y(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: r } = t, o = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = X.createElement(Dt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === o) this._$AH.p(i);
    else {
      const a = new se(o, this), s = a.u(this.options);
      a.p(i), this.T(s), this._$AH = a;
    }
  }
  _$AC(t) {
    let i = Lt.get(t.strings);
    return i === void 0 && Lt.set(t.strings, i = new X(t)), i;
  }
  k(t) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, o = 0;
    for (const a of t) o === i.length ? i.push(r = new J(this.O(V()), this.O(V()), this, this.options)) : r = i[o], r._$AI(a), o++;
    o < i.length && (this._$AR(r && r._$AB.nextSibling, o), i.length = o);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const r = Ct(t).nextSibling;
      Ct(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ct {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, o, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = o, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(t, i = this, r, o) {
    const a = this.strings;
    let s = !1;
    if (a === void 0) t = D(this, t, i, 0), s = !Y(t) || t !== this._$AH && t !== j, s && (this._$AH = t);
    else {
      const l = t;
      let n, h;
      for (t = a[0], n = 0; n < a.length - 1; n++) h = D(this, l[r + n], i, n), h === j && (h = this._$AH[n]), s || (s = !Y(h) || h !== this._$AH[n]), h === d ? t = d : t !== d && (t += (h ?? "") + a[n + 1]), this._$AH[n] = h;
    }
    s && !o && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ne extends ct {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class ce extends ct {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class le extends ct {
  constructor(t, i, r, o, a) {
    super(t, i, r, o, a), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = D(this, t, i, 0) ?? d) === j) return;
    const r = this._$AH, o = t === d && r !== d || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, a = t !== d && (r === d || o);
    o && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class de {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    D(this, t);
  }
}
const he = G.litHtmlPolyfillSupport;
he?.(X, J), (G.litHtmlVersions ?? (G.litHtmlVersions = [])).push("3.3.3");
const pe = (e, t, i) => {
  const r = i?.renderBefore ?? t;
  let o = r._$litPart$;
  if (o === void 0) {
    const a = i?.renderBefore ?? null;
    r._$litPart$ = o = new J(t.insertBefore(V(), a), a, void 0, i ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis;
class z extends B {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = pe(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return j;
  }
}
z._$litElement$ = !0, z.finalized = !0, q.litElementHydrateSupport?.({ LitElement: z });
const ue = q.litElementPolyfillSupport;
ue?.({ LitElement: z });
(q.litElementVersions ?? (q.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = { attribute: !0, type: String, converter: ot, reflect: !1, hasChanged: xt }, ge = (e = me, t, i) => {
  const { kind: r, metadata: o } = i;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(i.name, e), r === "accessor") {
    const { name: s } = i;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(s, n, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, e, l), l;
    } };
  }
  if (r === "setter") {
    const { name: s } = i;
    return function(l) {
      const n = this[s];
      t.call(this, l), this.requestUpdate(s, n, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function y(e) {
  return (t, i) => typeof i == "object" ? ge(e, t, i) : ((r, o, a) => {
    const s = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, r), s ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function N(e) {
  return y({ ...e, state: !0, attribute: !1 });
}
const be = ["unavailable", "unknown", "none", ""];
function p(e, t) {
  if (!(!e || !t))
    return e.states[t];
}
function L(e) {
  return !e || be.includes(String(e.state).toLowerCase());
}
function et(e) {
  if (!e) return !1;
  const t = String(e.state).toLowerCase();
  return ["on", "open", "home", "active", "charging", "true", "playing"].includes(t);
}
function U(e, t) {
  if (!e) return NaN;
  const i = t ? e.attributes?.[t] : e.state;
  if (i == null) return NaN;
  const r = typeof i == "number" ? i : parseFloat(String(i).replace(",", "."));
  return Number.isFinite(r) ? r : NaN;
}
function fe(e) {
  return e?.attributes?.unit_of_measurement ?? "";
}
function I(e, t = "") {
  return e?.attributes?.friendly_name ?? t;
}
function It(e) {
  return e.split(".")[0] ?? "";
}
function W(e, t) {
  e.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function ve(e, t, i) {
  e.dispatchEvent(
    new CustomEvent(t, { detail: i, bubbles: !0, composed: !0 })
  );
}
function it(e, t) {
  const i = It(t), r = ["switch", "light", "fan", "input_boolean"].includes(i) ? i : "homeassistant";
  e.callService(r, "toggle", { entity_id: t });
}
function st(e) {
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
function _e(e) {
  return e?.locale?.language ?? e?.language ?? "de";
}
function Ft(e, t, i) {
  if (!Number.isFinite(t)) return "–";
  const r = {};
  i !== void 0 ? (r.minimumFractionDigits = i, r.maximumFractionDigits = i) : r.maximumFractionDigits = 1;
  try {
    return new Intl.NumberFormat(_e(e), r).format(t);
  } catch {
    return String(t);
  }
}
function xe(e, t) {
  return t ? ["%"].includes(t) ? `${e}${t}` : `${e} ${t}` : e;
}
function _(e, t, i = {}) {
  if (L(t)) return i.unavailable ?? "—";
  const r = U(t, i.attribute);
  if (Number.isFinite(r))
    return xe(Ft(e, r, i.precision), i.unit ?? fe(t));
  if (i.attribute && t) {
    const o = t.attributes?.[i.attribute];
    if (o != null) return String(o);
  }
  if (e.formatEntityState && t)
    try {
      return e.formatEntityState(t);
    } catch {
    }
  return t ? t.state : i.unavailable ?? "—";
}
function ye(e, t = "de") {
  if (!Number.isFinite(e)) return "";
  const i = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"], r = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], o = Math.round((e % 360 + 360) % 360 / 45) % 8;
  return (t === "de" ? i : r)[o];
}
const $e = {
  boat: "Boot",
  sensor: "Sensor",
  state: "Zustand",
  target: "Sollwert",
  no_url: "Keine URL konfiguriert",
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
}, we = {
  boat: "Boat",
  sensor: "Sensor",
  state: "State",
  target: "Target",
  no_url: "No URL configured",
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
function ke(e) {
  return (e?.locale?.language ?? e?.language ?? "de").toLowerCase().startsWith("de") ? "de" : "en";
}
function m(e, t) {
  return (ke(e) === "de" ? $e : we)[t] ?? t;
}
const Se = [
  "default",
  "withings",
  "glass",
  "material",
  "bubble",
  "mirror"
], bt = ["dock", "sailing", "trailer"], Ae = [
  "boat",
  "battery",
  "solar",
  "fridge",
  "camera",
  "grafana",
  "sensor"
];
function Ee(e) {
  return `s-${e && Se.includes(e) ? e : "withings"}`;
}
const Ce = nt`
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

  /* default: plain HA look following the active theme */
  .s-default {
    --bc-tile-bg: var(
      --secondary-background-color,
      color-mix(in srgb, var(--primary-text-color) 5%, var(--bc-card-bg))
    );
    --bc-dot-fill: var(--secondary-background-color, var(--bc-card-bg));
    --bc-tile-radius: var(--ha-card-border-radius, 12px);
  }
  /* withings: soft tinted tiles = base tokens, nothing extra */

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
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, #fff 25%, transparent),
      0 8px 24px color-mix(in srgb, #000 10%, transparent);
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
    grid-template-columns: repeat(var(--bc-columns, 2), minmax(0, 1fr));
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
    aspect-ratio: 41 / 24;
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
`, $t = () => k`
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
`, wt = (e) => k`
  <line x1="212" y1="132" x2="212" y2="34" stroke="#e7e2d6" stroke-width="4"
        stroke-linecap="round" />
  ${e ? k`
        <path d="M208 40 Q150 90 176 150 L208 150 Z" fill="#f4f1ea" />
        <path d="M216 44 Q270 92 250 150 L216 150 Z" fill="#fbfaf6" />
        <path d="M208 40 Q150 90 176 150" fill="none" stroke="#d9d3c4" stroke-width="1.5" />` : k`
        <path d="M212 40 Q206 90 212 150" fill="none" stroke="#cfe0f5" stroke-width="10"
              stroke-linecap="round" opacity="0.9" />`}
`, Kt = (e) => k`
  <g opacity="0.7" stroke="#7fa8d8" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M60 200 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" />
    ${e ? k`<path d="M40 214 q16 -6 32 0 t32 0 t32 0 t32 0 t32 0 t32 0"
                    opacity="0.5" />` : d}
  </g>
`, Pe = () => k`
  ${Kt(!1)}
  <!-- pier -->
  <g>
    <path d="M300 196 L392 176 L392 190 L300 210 Z" fill="#b98c5a" />
    <path d="M300 196 L392 176 L392 179 L300 199 Z" fill="#caa06f" />
    <rect x="330" y="205" width="6" height="26" fill="#7c5a34" />
    <rect x="372" y="196" width="6" height="30" fill="#7c5a34" />
  </g>
  ${$t()}
  ${wt(!1)}
`, ze = () => k`
  ${Kt(!0)}
  ${$t()}
  ${wt(!0)}
  <!-- little wake -->
  <path d="M70 200 q-18 4 -30 -2" fill="none" stroke="#fff" stroke-width="3"
        stroke-linecap="round" opacity="0.55" />
`, Oe = () => k`
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
  ${$t()}
  ${wt(!1)}
`;
function Qt(e) {
  const t = e === "sailing" ? ze() : e === "trailer" ? Oe() : Pe();
  return c`<svg
    viewBox="0 0 410 240"
    xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;display:block"
  >
    ${t}
  </svg>`;
}
const E = {
  boat: { icon: "mdi:sail-boat", color: "#5b7cfa", nameKey: "boat" },
  battery: { icon: "mdi:car-battery", color: "#34c759", nameKey: "battery" },
  solar: { icon: "mdi:solar-power-variant", color: "#f5a623", nameKey: "solar" },
  fridge: { icon: "mdi:fridge-outline", color: "#2aa5c7", nameKey: "fridge" },
  camera: { icon: "mdi:cctv", color: "#6d8bff", nameKey: "camera" },
  grafana: { icon: "mdi:chart-areaspline", color: "#f46800", nameKey: "grafana" },
  sensor: { icon: "mdi:gauge", color: "#5b7cfa", nameKey: "sensor" }
};
var Ne = Object.defineProperty, Me = Object.getOwnPropertyDescriptor, f = (e, t, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Me(t, i) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (o = (r ? s(t, i, o) : s(o)) || o);
  return r && o && Ne(t, i, o), o;
};
const ut = {
  dock: "Am Steg",
  sailing: "Segeln",
  trailer: "Anhänger"
}, Le = [
  "right",
  "left",
  "top",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
].map((e) => ({ value: e, label: e })), Wt = {
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
function ft(e) {
  const t = {};
  for (const [i, r] of Object.entries(e))
    r == null || r === "" || (t[i] = r);
  return t;
}
function H(e) {
  return e.map((t) => ({
    ...t,
    positions: t.positions ? Object.fromEntries(
      Object.entries(t.positions).map(([i, r]) => [i, { ...r }])
    ) : void 0
  }));
}
let S = class extends z {
  constructor() {
    super(...arguments), this.chips = [], this._variant = "dock", this._expanded = -1, this._label = (e) => Wt[e?.name] ?? e?.name ?? "";
  }
  get _chips() {
    return this._working ?? this.chips ?? [];
  }
  _emit(e) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e.map((t) => ft(t)) },
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
    e.preventDefault(), e.stopPropagation(), e.currentTarget.setPointerCapture(e.pointerId), this._working = H(this.chips), this._drag = { index: t, pointerId: e.pointerId, moved: !1, x0: e.clientX, y0: e.clientY };
  }
  _onDotMove(e) {
    if (!this._drag) return;
    Math.abs(e.clientX - this._drag.x0) + Math.abs(e.clientY - this._drag.y0) > 3 && (this._drag.moved = !0);
    const t = this._stageRect();
    if (!t) return;
    let i = (e.clientX - t.left) / t.width * 100, r = (e.clientY - t.top) / t.height * 100;
    i = Math.max(0, Math.min(100, Math.round(i * 10) / 10)), r = Math.max(0, Math.min(100, Math.round(r * 10) / 10));
    const o = this._working[this._drag.index], a = o.positions?.[this._variant] ?? { x: 50, y: 50 };
    o.positions = { ...o.positions ?? {}, [this._variant]: { ...a, x: i, y: r } }, this.requestUpdate();
  }
  _onDotUp(e, t) {
    if (!this._drag) return;
    const i = this._drag.moved, r = this._working ?? this.chips;
    this._drag = void 0, this._working = void 0, i ? this._emit(r) : this._expanded = this._expanded === t ? -1 : t;
  }
  _chipPos(e) {
    const t = e.positions?.[this._variant];
    return t && !t.hidden ? t : void 0;
  }
  // ---- chip mutations ----
  _addChip() {
    const e = H(this.chips);
    e.push({
      entity: "",
      positions: { [this._variant]: { x: 50, y: 50, dot: "right" } }
    }), this._expanded = e.length - 1, this._emit(e);
  }
  _removeChip(e) {
    const t = H(this.chips);
    t.splice(e, 1), this._expanded === e && (this._expanded = -1), this._emit(t);
  }
  _moveChip(e, t) {
    const i = H(this.chips), r = e + t;
    r < 0 || r >= i.length || ([i[e], i[r]] = [i[r], i[e]], this._emit(i));
  }
  _placeHere(e) {
    const t = H(this.chips);
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
          { name: "dot", selector: { select: { mode: "dropdown", options: Le } } },
          { name: "hidden", selector: { boolean: {} } }
        ]
      }
    ];
  }
  _flatten(e) {
    const t = e.positions?.[this._variant] ?? {};
    return ft({
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
    const i = e.detail.value, r = H(this.chips), o = r[t];
    o.entity = i.entity ?? "", o.entity2 = i.entity2 || void 0, o.name = i.name || void 0, o.icon = i.icon || void 0, o.color = i.color || void 0, o.unit = i.unit || void 0, o.precision = i.precision, o.tap_action = i.tap_action || void 0;
    const a = { ...o.positions ?? {} };
    i.x !== void 0 && i.y !== void 0 ? a[this._variant] = {
      x: i.x,
      y: i.y,
      dot: i.dot || void 0,
      hidden: i.hidden || void 0
    } : i.hidden ? a[this._variant] = {
      ...a[this._variant] ?? { x: 50, y: 50 },
      hidden: !0
    } : delete a[this._variant], o.positions = a, this._emit(r);
  }
  render() {
    const e = this._chips;
    return c`
      <div class="ce">
        <div class="ce-tabs">
          ${bt.map(
      (t) => c`<button
              class=${t === this._variant ? "on" : ""}
              @click=${() => this._variant = t}
            >
              ${ut[t]}
            </button>`
    )}
        </div>

        <div class="ce-stage-wrap">
          <div class="ce-stage">
            ${this.images?.[this._variant] ? c`<img src=${this.images[this._variant]} alt="" />` : c`<div class="svg">${Qt(this._variant)}</div>`}
            ${e.map((t, i) => this._renderDot(t, i))}
          </div>
          <div class="ce-hint">
            Punkte auf das Boot ziehen · Antippen zum Bearbeiten ·
            Ansicht: <b>${ut[this._variant]}</b>
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
    if (!i) return d;
    const r = p(this.hass, e.entity), o = st(e.color) ?? "var(--bc-accent, #5b7cfa)", a = r ? _(this.hass, r, { precision: e.precision, unit: e.unit }) : "—", s = i.dot ?? (i.x >= 50 ? "left" : "right"), l = (e.name ?? I(r, e.entity)) || `#${t + 1}`;
    return c`<div
      class="ce-anchor dot-${s} ${t === this._expanded ? "active" : ""}"
      style="left:${i.x}%;top:${i.y}%;--ac:${o}"
    >
      <span
        class="ce-adot"
        @pointerdown=${(n) => this._onDotDown(n, t)}
        @pointermove=${this._onDotMove}
        @pointerup=${(n) => this._onDotUp(n, t)}
        @pointercancel=${(n) => this._onDotUp(n, t)}
        title=${l}
      ></span>
      <span
        class="ce-albl"
        @click=${() => this._expanded = this._expanded === t ? -1 : t}
        >${l}: ${a}</span
      >
    </div>`;
  }
  _renderRow(e, t) {
    const i = p(this.hass, e.entity), r = !!e.positions?.[this._variant], o = !!e.positions?.[this._variant]?.hidden, a = st(e.color) ?? "var(--bc-accent, #5b7cfa)", s = (e.name ?? I(i, e.entity)) || `Chip #${t + 1}`, l = t === this._expanded;
    return c`<div class="ce-row ${l ? "open" : ""}">
      <div class="ce-row-head" @click=${() => this._expanded = l ? -1 : t}>
        <span class="swatch" style="background:${a}"></span>
        <span class="rn">${s}</span>
        <span class="badge ${r ? o ? "hid" : "ok" : "no"}">
          ${r ? o ? "ausgeblendet" : "platziert" : "nicht in dieser Ansicht"}
        </span>
        <span class="sp"></span>
        <ha-icon-button
          .label=${"hoch"}
          @click=${(n) => {
      n.stopPropagation(), this._moveChip(t, -1);
    }}
        ><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(n) => {
      n.stopPropagation(), this._moveChip(t, 1);
    }}
        ><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(n) => {
      n.stopPropagation(), this._removeChip(t);
    }}
        ><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${l ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${l ? c`<div class="ce-row-body">
            ${r ? d : c`<button class="ce-place" @click=${() => this._placeHere(t)}>
                  <ha-icon icon="mdi:map-marker-plus"></ha-icon>
                  In „${ut[this._variant]}" platzieren
                </button>`}
            <ha-form
              .hass=${this.hass}
              .data=${this._flatten(e)}
              .schema=${this._chipSchema()}
              .computeLabel=${this._label}
              @value-changed=${(n) => this._chipFormChanged(n, t)}
            ></ha-form>
          </div>` : d}
    </div>`;
  }
};
S.styles = nt`
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
f([
  y({ attribute: !1 })
], S.prototype, "hass", 2);
f([
  y({ attribute: !1 })
], S.prototype, "chips", 2);
f([
  y({ attribute: !1 })
], S.prototype, "images", 2);
f([
  N()
], S.prototype, "_variant", 2);
f([
  N()
], S.prototype, "_expanded", 2);
f([
  N()
], S.prototype, "_working", 2);
S = f([
  lt("boat-chips-editor")
], S);
let O = class extends z {
  constructor() {
    super(...arguments), this.items = [], this.fields = [], this.addLabel = "Hinzufügen", this._expanded = -1, this._label = (e) => Wt[e?.name] ?? e?.name ?? "";
  }
  _emit(e) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e.map((t) => ft(t)) },
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
    const i = this.items.map((o) => this._norm(o)), r = e + t;
    r < 0 || r >= i.length || ([i[e], i[r]] = [i[r], i[e]], this._emit(i));
  }
  _changed(e, t) {
    e.stopPropagation();
    const i = this.items.map((r) => this._norm(r));
    i[t] = { ...i[t], ...e.detail.value }, this._emit(i);
  }
  render() {
    const e = (this.items ?? []).map((t) => this._norm(t));
    return c`<div class="li">
      ${e.map((t, i) => {
      const r = p(this.hass, t.entity), o = i === this._expanded, a = (t.name ?? I(r, t.entity)) || `#${i + 1}`;
      return c`<div class="row ${o ? "open" : ""}">
          <div class="head" @click=${() => this._expanded = o ? -1 : i}>
            ${t.icon ? c`<ha-icon icon=${t.icon}></ha-icon>` : d}
            <span class="n">${a}</span>
            <span class="sp"></span>
            <ha-icon-button @click=${(s) => {
        s.stopPropagation(), this._move(i, -1);
      }}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(s) => {
        s.stopPropagation(), this._move(i, 1);
      }}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(s) => {
        s.stopPropagation(), this._remove(i);
      }}>
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          </div>
          ${o ? c`<div class="body">
                <ha-form
                  .hass=${this.hass}
                  .data=${t}
                  .schema=${this.fields}
                  .computeLabel=${this._label}
                  @value-changed=${(s) => this._changed(s, i)}
                ></ha-form>
              </div>` : d}
        </div>`;
    })}
      <button class="add" @click=${this._add}>
        <ha-icon icon="mdi:plus"></ha-icon> ${this.addLabel}
      </button>
    </div>`;
  }
};
O.styles = nt`
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
f([
  y({ attribute: !1 })
], O.prototype, "hass", 2);
f([
  y({ attribute: !1 })
], O.prototype, "items", 2);
f([
  y({ attribute: !1 })
], O.prototype, "fields", 2);
f([
  y({ type: String })
], O.prototype, "addLabel", 2);
f([
  N()
], O.prototype, "_expanded", 2);
O = f([
  lt("boat-items-editor")
], O);
var Ue = Object.defineProperty, Re = Object.getOwnPropertyDescriptor, dt = (e, t, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Re(t, i) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (o = (r ? s(t, i, o) : s(o)) || o);
  return r && o && Ue(t, i, o), o;
};
const mt = {
  title: "Titel",
  subtitle: "Untertitel",
  card_style: "Kartenstil",
  columns: "Spalten",
  layout: "Layout",
  background: "Hintergrund anzeigen",
  tiles: "Als Kacheln",
  flush: "Ohne Rand (flush)",
  name: "Name",
  icon: "Icon",
  color: "Akzentfarbe (Token oder #hex)",
  full_width: "Volle Breite",
  variant: "Aktive Ansicht",
  variant_entity: "Ansicht aus Entität",
  images: "Bilder (URLs)",
  dock: "Am Steg (URL)",
  sailing: "Unter Segeln (URL)",
  trailer: "Auf dem Anhänger (URL)",
  image_remove_black: "Schwarz transparent machen",
  show_variant_switch: "Umschalter anzeigen",
  gps: "GPS",
  speed: "Geschwindigkeit",
  heading: "Kurs",
  location: "Standort (device_tracker)",
  lat: "Breitengrad (Sensor)",
  lon: "Längengrad (Sensor)",
  speed_unit: "Einheit Geschwindigkeit",
  soc: "Ladezustand (%)",
  voltage: "Spannung",
  current: "Strom",
  power: "Leistung",
  temperature: "Temperatur",
  time_remaining: "Restzeit",
  yield_today: "Ertrag heute",
  state: "Zustand (Text)",
  switch: "Schalter (Strom)",
  target: "Sollwert",
  camera: "Kamera",
  ptz: "PTZ-Steuerung",
  presets: "Preset-Auswahl (select)",
  aspect_ratio: "Seitenverhältnis",
  url: "Grafana-URL",
  height: "Höhe (px)",
  auto_params: "kiosk/theme automatisch",
  show_open: '„Öffnen"-Button',
  entity: "Entität",
  entity2: "Zweite Entität",
  unit: "Einheit",
  precision: "Nachkommastellen",
  attribute: "Attribut",
  tap_action: "Tippen"
}, Ut = {
  boat: "Boot (Bild + Chips)",
  battery: "Batterie",
  solar: "Solar",
  fridge: "Kühlschrank",
  camera: "Kamera",
  grafana: "Grafana",
  sensor: "Sensor (Wert)"
}, v = (e) => ({ name: e, selector: { text: {} } }), w = (e) => ({ name: e, selector: { boolean: {} } }), b = (e) => ({ name: e, selector: { entity: { domain: "sensor" } } }), x = (e, t) => ({
  name: e,
  selector: { entity: t ? { domain: t } : {} }
}), gt = (e, t = 0, i = 100) => ({
  name: e,
  selector: { number: { min: t, max: i, mode: "box" } }
}), Te = {
  name: "card_style",
  selector: {
    select: {
      mode: "dropdown",
      options: [
        { value: "withings", label: "Withings (Standard)" },
        { value: "default", label: "HA-Standard" },
        { value: "glass", label: "Liquid Glass" },
        { value: "material", label: "Material You" },
        { value: "bubble", label: "Bubble" },
        { value: "mirror", label: "Magic Mirror" }
      ]
    }
  }
};
let F = class extends z {
  constructor() {
    super(...arguments), this._expanded = -1, this._label = (e) => mt[e?.name] ?? e?.name ?? "";
  }
  setConfig(e) {
    this._config = { ...e, sections: e.sections ?? [] };
  }
  _emit(e) {
    this._config = e, ve(this, "config-changed", { config: e });
  }
  _topSchema() {
    return [
      v("title"),
      v("subtitle"),
      { type: "grid", name: "", schema: [Te, gt("columns", 1, 4)] },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "layout",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "grid", label: "Grid" },
                  { value: "carousel", label: "Karussell" }
                ]
              }
            }
          },
          w("tiles")
        ]
      },
      { type: "grid", name: "", schema: [w("background"), w("flush")] }
    ];
  }
  _topChanged(e) {
    e.stopPropagation(), this._config && this._emit({ ...this._config, ...e.detail.value, sections: this._config.sections });
  }
  // ---- section-type field schema ----
  _sectionSchema(e) {
    const t = [
      { type: "grid", name: "", schema: [v("name"), { name: "icon", selector: { icon: {} } }] },
      { type: "grid", name: "", schema: [v("color"), w("full_width")] }
    ];
    switch (e) {
      case "boat":
        return [
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
              x("variant_entity")
            ]
          },
          w("show_variant_switch"),
          {
            type: "expandable",
            name: "images",
            title: mt.images,
            schema: [v("dock"), v("sailing"), v("trailer"), w("image_remove_black")]
          },
          {
            type: "expandable",
            name: "gps",
            title: mt.gps,
            schema: [
              b("speed"),
              b("heading"),
              x("location", ["device_tracker", "person", "zone"]),
              b("lat"),
              b("lon"),
              v("speed_unit")
            ]
          }
        ];
      case "battery":
        return [
          ...t,
          b("soc"),
          { type: "grid", name: "", schema: [b("voltage"), b("current")] },
          { type: "grid", name: "", schema: [b("power"), b("temperature")] },
          b("time_remaining")
        ];
      case "solar":
        return [
          ...t,
          b("power"),
          { type: "grid", name: "", schema: [b("yield_today"), x("state")] },
          { type: "grid", name: "", schema: [b("voltage"), b("current")] }
        ];
      case "fridge":
        return [
          ...t,
          x("switch", ["switch", "input_boolean"]),
          b("temperature"),
          { type: "grid", name: "", schema: [x("target", ["sensor", "number", "input_number"]), b("power")] }
        ];
      case "camera":
        return [
          ...t,
          x("camera", "camera"),
          { type: "grid", name: "", schema: [x("switch", ["switch", "input_boolean"]), w("ptz")] },
          { type: "grid", name: "", schema: [x("presets", "select"), v("aspect_ratio")] }
        ];
      case "grafana":
        return [
          ...t,
          v("url"),
          { type: "grid", name: "", schema: [gt("height", 150, 1200), w("auto_params")] },
          w("show_open")
        ];
      case "sensor":
      default:
        return [
          ...t,
          x("entity"),
          x("entity2"),
          { type: "grid", name: "", schema: [v("unit"), gt("precision", 0, 4)] },
          {
            type: "grid",
            name: "",
            schema: [
              v("attribute"),
              {
                name: "tap_action",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "more-info", label: "Info-Dialog" },
                      { value: "toggle", label: "Schalten" },
                      { value: "none", label: "Nichts" }
                    ]
                  }
                }
              }
            ]
          }
        ];
    }
  }
  // ---- section mutations ----
  _sections() {
    return (this._config?.sections ?? []).map((e) => ({ ...e }));
  }
  _commit(e) {
    this._emit({ ...this._config, sections: e });
  }
  _sectionChanged(e, t) {
    e.stopPropagation();
    const i = this._sections();
    i[t] = { ...i[t], ...e.detail.value }, this._commit(i);
  }
  _chipsChanged(e, t) {
    e.stopPropagation();
    const i = this._sections();
    i[t] = { ...i[t], chips: e.detail.value }, this._commit(i);
  }
  _controlsChanged(e, t) {
    e.stopPropagation();
    const i = this._sections();
    i[t] = { ...i[t], controls: e.detail.value }, this._commit(i);
  }
  _addSection(e) {
    const t = e.target.value;
    if (!t) return;
    e.target.value = "";
    const i = this._sections();
    i.push({ type: t }), this._expanded = i.length - 1, this._commit(i);
  }
  _removeSection(e) {
    const t = this._sections();
    t.splice(e, 1), this._expanded === e && (this._expanded = -1), this._commit(t);
  }
  _moveSection(e, t) {
    const i = this._sections(), r = e + t;
    r < 0 || r >= i.length || ([i[e], i[r]] = [i[r], i[e]], this._commit(i));
  }
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config.sections ?? [];
    return c`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._topSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="sec-title">Sektionen</div>
      <div class="sec-list">
        ${e.map((t, i) => this._renderSection(t, i))}
      </div>

      <div class="add-row">
        <select class="add-sel" @change=${this._addSection}>
          <option value="">+ Sektion hinzufügen …</option>
          ${Ae.map((t) => c`<option value=${t}>${Ut[t]}</option>`)}
        </select>
      </div>
    `;
  }
  _renderSection(e, t) {
    const i = t === this._expanded, r = E[e.type] ?? E.sensor, o = e.entity ?? e.soc ?? e.power ?? e.camera ?? e.switch ?? e.url ?? "", a = e.name ?? I(p(this.hass, o), "");
    return c`<div class="sec ${i ? "open" : ""}">
      <div class="sec-head" @click=${() => this._expanded = i ? -1 : t}>
        <ha-icon .icon=${e.icon ?? r.icon}></ha-icon>
        <span class="sec-name">${Ut[e.type] ?? e.type}</span>
        ${a ? c`<span class="sec-sub">${a}</span>` : d}
        <span class="sp"></span>
        <ha-icon-button @click=${(s) => {
      s.stopPropagation(), this._moveSection(t, -1);
    }}><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(s) => {
      s.stopPropagation(), this._moveSection(t, 1);
    }}><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(s) => {
      s.stopPropagation(), this._removeSection(t);
    }}><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${i ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${i ? c`<div class="sec-body">
            <ha-form
              .hass=${this.hass}
              .data=${e}
              .schema=${this._sectionSchema(e.type)}
              .computeLabel=${this._label}
              @value-changed=${(s) => this._sectionChanged(s, t)}
            ></ha-form>
            ${e.type === "boat" ? c`
                  <div class="sub-title">Chips auf dem Boot</div>
                  <div class="sub-sub">Punkte aufs Boot ziehen · Tabs = Positionen je Ansicht</div>
                  <boat-chips-editor
                    .hass=${this.hass}
                    .chips=${e.chips ?? []}
                    .images=${e.images}
                    @value-changed=${(s) => this._chipsChanged(s, t)}
                  ></boat-chips-editor>
                  <div class="sub-title">Aktoren-Reihe</div>
                  <boat-items-editor
                    .hass=${this.hass}
                    .items=${e.controls ?? []}
                    .fields=${He}
                    addLabel="Aktor hinzufügen"
                    @value-changed=${(s) => this._controlsChanged(s, t)}
                  ></boat-items-editor>
                ` : d}
          </div>` : d}
    </div>`;
  }
};
F.styles = nt`
    .sec-title,
    .sub-title {
      font-size: 0.95rem;
      font-weight: 600;
      margin: 18px 0 8px;
      color: var(--primary-text-color);
    }
    .sub-title {
      font-size: 0.85rem;
      margin: 16px 0 2px;
    }
    .sub-sub {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    .sec-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sec {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      overflow: hidden;
    }
    .sec-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 6px 6px 12px;
      cursor: pointer;
    }
    .sec-name {
      font-weight: 600;
    }
    .sec-sub {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 40%;
    }
    .sp {
      flex: 1;
    }
    .sec-body {
      padding: 10px 12px 14px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    .add-row {
      margin-top: 10px;
    }
    .add-sel {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px dashed var(--divider-color, #bbb);
      background: none;
      color: var(--primary-color, #5b7cfa);
      font: inherit;
      cursor: pointer;
    }
    ha-icon-button {
      --mdc-icon-button-size: 34px;
      color: var(--secondary-text-color);
    }
  `;
dt([
  y({ attribute: !1 })
], F.prototype, "hass", 2);
dt([
  N()
], F.prototype, "_config", 2);
dt([
  N()
], F.prototype, "_expanded", 2);
F = dt([
  lt("boat-card-editor")
], F);
const He = [
  { name: "entity", selector: { entity: { domain: ["switch", "input_boolean", "light"] } } },
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
var Be = Object.defineProperty, je = Object.getOwnPropertyDescriptor, ht = (e, t, i, r) => {
  for (var o = r > 1 ? void 0 : r ? je(t, i) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (o = (r ? s(t, i, o) : s(o)) || o);
  return r && o && Be(t, i, o), o;
};
const De = ["left", "right", "up", "down", "zoom_in", "zoom_out"];
let K = class extends z {
  constructor() {
    super(...arguments), this._variantOverride = {};
  }
  setConfig(e) {
    if (!e) throw new Error("Invalid configuration");
    if (!Array.isArray(e.sections))
      throw new Error('boat-card: "sections" must be a list');
    this._config = e, this._variantOverride = {};
  }
  getCardSize() {
    return 4 + (this._config?.sections?.length ?? 0) * 2;
  }
  static getConfigElement() {
    return document.createElement("boat-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:boat-card",
      title: "Hoppetosse",
      card_style: "withings",
      columns: 2,
      sections: [
        {
          type: "boat",
          variant: "dock",
          show_variant_switch: !0,
          chips: [
            {
              entity: "sensor.solar_power",
              icon: "mdi:solar-power",
              positions: { dock: { x: 58, y: 26, dot: "left" } }
            },
            {
              entity: "sensor.battery_soc",
              icon: "mdi:battery",
              positions: { dock: { x: 40, y: 66, dot: "right" } }
            }
          ]
        },
        { type: "battery", soc: "sensor.battery_soc", voltage: "sensor.battery_voltage" },
        { type: "fridge", switch: "switch.fridge", temperature: "sensor.fridge_temperature" }
      ]
    };
  }
  // ---- helpers ----
  _accent(e) {
    const t = E[e.type] ?? E.sensor;
    return st(e.color) ?? t.color;
  }
  _icon(e) {
    return e.icon ?? (E[e.type] ?? E.sensor).icon;
  }
  _name(e) {
    const t = E[e.type] ?? E.sensor;
    return e.name ?? m(this.hass, t.nameKey);
  }
  _isFull(e) {
    return e.full_width ?? ["boat", "camera", "grafana"].includes(e.type);
  }
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = [
      "cardroot",
      Ee(e.card_style),
      e.tiles === !1 ? "flat" : "tiles",
      e.flush ? "flush" : ""
    ].join(" "), i = c`
      ${e.title ? c`<div class="header">
            <div class="title">${e.title}</div>
            ${e.subtitle ? c`<div class="subtitle">${e.subtitle}</div>` : d}
          </div>` : d}
      <div
        class="metrics ${e.layout === "carousel" ? "carousel" : ""}"
        style="--bc-columns:${e.columns ?? 2}"
      >
        ${(e.sections ?? []).map((r, o) => this._renderSection(r, o))}
      </div>
    `;
    return e.background === !1 ? c`<div class="${t} nobg">${i}</div>` : c`<ha-card class=${t}>${i}</ha-card>`;
  }
  _renderSection(e, t) {
    const i = this._isFull(e) ? "full" : "", r = this._accent(e);
    let o;
    switch (e.type) {
      case "boat":
        o = this._renderBoat(e, t);
        break;
      case "battery":
        o = this._renderBattery(e);
        break;
      case "solar":
        o = this._renderSolar(e);
        break;
      case "fridge":
        o = this._renderFridge(e);
        break;
      case "camera":
        o = this._renderCamera(e);
        break;
      case "grafana":
        o = this._renderGrafana(e);
        break;
      case "sensor":
        o = this._renderSensor(e);
        break;
      default:
        o = d;
    }
    return c`<div class="metric ${i}" style="--bc-accent:${r}">${o}</div>`;
  }
  _tileHead(e, t) {
    return c`<div class="head">
      <div class="iconchip"><ha-icon .icon=${this._icon(e)}></ha-icon></div>
      <div class="name">${this._name(e)}</div>
      ${t ?? d}
    </div>`;
  }
  // ==================== BOAT HERO ====================
  _variant(e, t) {
    if (this._variantOverride[t]) return this._variantOverride[t];
    if (e.variant_entity) {
      const i = p(this.hass, e.variant_entity);
      if (i) {
        const r = e.variant_map?.[i.state];
        if (r) return r;
        if (bt.includes(i.state))
          return i.state;
      }
    }
    return e.variant ?? "dock";
  }
  _renderBoat(e, t) {
    const i = this._variant(e, t), r = e.images?.[i];
    return c`
      <div class="stage">
        ${r ? c`<img class="scene ${e.image_remove_black ? "rm-black" : ""}" src=${r} alt=${i} />` : c`<div class="scene">${Qt(i)}</div>`}
        ${(e.chips ?? []).map((o) => this._renderChip(o, i))}
        ${e.show_variant_switch !== !1 ? this._renderVariantSwitch(i, t) : d}
      </div>
      ${this._renderGps(e.gps)} ${this._renderControls(e.controls)}
    `;
  }
  _renderVariantSwitch(e, t) {
    const i = {
      dock: "mdi:dock-top",
      sailing: "mdi:sail-boat",
      trailer: "mdi:truck-trailer"
    };
    return c`<div class="variant-switch">
      ${bt.map(
      (r) => c`<button
          class=${r === e ? "on" : ""}
          title=${m(this.hass, r)}
          @click=${() => this._variantOverride = { ...this._variantOverride, [t]: r }}
        >
          <ha-icon .icon=${i[r]}></ha-icon>
        </button>`
    )}
    </div>`;
  }
  _chipPos(e, t) {
    const i = e.positions?.[t];
    if (i) return i.hidden ? void 0 : i;
    if (e.x !== void 0 && e.y !== void 0)
      return { x: e.x, y: e.y, dot: e.dot };
  }
  _tapChip(e) {
    const t = e.tap_action ?? "more-info";
    if (t !== "none") {
      if (t === "toggle") return it(this.hass, e.entity);
      if (t === "link" && e.link) {
        /^https?:/.test(e.link) ? window.open(e.link, "_blank") : W(this, e.entity);
        return;
      }
      W(this, e.entity);
    }
  }
  _renderChip(e, t) {
    const i = this._chipPos(e, t), r = p(this.hass, e.entity);
    if (!i || !r) return d;
    const o = i.dot ?? (i.x >= 50 ? "left" : "right"), a = st(e.color) ?? "var(--bc-accent)";
    let s;
    if (e.entity2) {
      const n = p(this.hass, e.entity2);
      s = `${_(this.hass, r, { precision: e.precision, unit: "" })} / ${_(this.hass, n, { precision: e.precision })}`;
    } else
      s = _(this.hass, r, {
        precision: e.precision,
        unit: e.unit,
        attribute: e.attribute
      });
    const l = e.name ?? I(r, "");
    return c`<div
      class="anchor dot-${o}"
      style="left:${i.x}%;top:${i.y}%;--ac:${a}"
      @click=${() => this._tapChip(e)}
    >
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        ${e.icon ? c`<ha-icon class="ci" .icon=${e.icon}></ha-icon>` : d}
        <div class="anchor-txt">
          ${l ? c`<span class="anchor-name">${l}</span>` : d}
          <span class="anchor-val">${s}</span>
        </div>
      </div>
    </div>`;
  }
  _renderGps(e) {
    if (!e) return d;
    const t = [], i = p(this.hass, e.speed);
    i && !L(i) && t.push(c`<span class="gps-item"><ha-icon icon="mdi:speedometer"></ha-icon>${_(this.hass, i, { unit: e.speed_unit })}</span>`);
    const r = p(this.hass, e.heading);
    if (r && !L(r)) {
      const a = U(r);
      t.push(c`<span class="gps-item"><ha-icon icon="mdi:compass-outline"></ha-icon>${ye(a)} ${Number.isFinite(a) ? c`${Ft(this.hass, a, 0)}°` : ""}</span>`);
    }
    const o = this._coords(e);
    return o && t.push(c`<span class="gps-item"><ha-icon icon="mdi:map-marker"></ha-icon>${o}</span>`), t.length ? c`<div class="gps-bar">${t}</div>` : d;
  }
  _coords(e) {
    let t = NaN, i = NaN;
    if (e.location) {
      const r = p(this.hass, e.location);
      t = U(r, "latitude"), i = U(r, "longitude");
    }
    return !Number.isFinite(t) && e.lat && (t = U(p(this.hass, e.lat))), !Number.isFinite(i) && e.lon && (i = U(p(this.hass, e.lon))), !Number.isFinite(t) || !Number.isFinite(i) ? "" : `${t.toFixed(4)}, ${i.toFixed(4)}`;
  }
  _renderControls(e) {
    return e?.length ? c`<div class="controls">
      ${e.map((t) => {
      const i = typeof t == "string" ? { entity: t } : t, r = p(this.hass, i.entity), o = et(r), a = o ? i.icon_on ?? i.icon : i.icon;
      return c`<button class="ctl ${o ? "on" : ""}" @click=${() => it(this.hass, i.entity)}>
          <ha-icon .icon=${a ?? "mdi:power"}></ha-icon>
          <span class="cl">${i.name ?? I(r, "")}</span>
          <span class="cl">${o ? m(this.hass, "on") : m(this.hass, "off")}</span>
        </button>`;
    })}
    </div>` : d;
  }
  // ==================== BATTERY / SOLAR ====================
  _kvRow(e, t) {
    const i = p(this.hass, e);
    return !e || L(i) ? d : c`<div class="kv"><span>${t}</span><b>${_(this.hass, i)}</b></div>`;
  }
  _socColor(e) {
    return Number.isFinite(e) ? e >= 50 ? "var(--bc-battery)" : e >= 20 ? "var(--bc-solar)" : "var(--bc-danger)" : "var(--secondary-text-color)";
  }
  _renderBattery(e) {
    const t = p(this.hass, e.soc), i = U(t), r = this._socColor(i);
    return c`
      ${this._tileHead(e)}
      ${t ? c`<div class="value" style="color:${r}">${_(this.hass, t, { unit: "%", precision: 0 })}</div>
            <div class="progress"><span style="width:${Math.max(0, Math.min(100, i || 0))}%;--bar-color:${r}"></span></div>` : d}
      <div class="kvs">
        ${this._kvRow(e.voltage, m(this.hass, "voltage"))}
        ${this._kvRow(e.current, m(this.hass, "current"))}
        ${this._kvRow(e.power, m(this.hass, "power_now"))}
        ${this._kvRow(e.temperature, m(this.hass, "temperature"))}
        ${this._kvRow(e.time_remaining, "⌛")}
      </div>
    `;
  }
  _renderSolar(e) {
    const t = p(this.hass, e.power);
    return c`
      ${this._tileHead(e)}
      ${t ? c`<div class="value" style="color:var(--bc-solar)">${_(this.hass, t, { unit: "W", precision: 0 })}</div>` : d}
      <div class="kvs">
        ${this._kvRow(e.yield_today, m(this.hass, "yield_today"))}
        ${this._kvRow(e.voltage, m(this.hass, "voltage"))}
        ${this._kvRow(e.current, m(this.hass, "current"))}
        ${this._kvRow(e.state, m(this.hass, "state"))}
      </div>
    `;
  }
  // ==================== FRIDGE ====================
  _renderFridge(e) {
    const t = p(this.hass, e.switch), i = et(t), r = p(this.hass, e.temperature);
    return c`
      ${this._tileHead(e)}
      <div class="fridge">
        ${e.switch ? c`<button class="power ${i ? "on" : ""}" @click=${() => it(this.hass, e.switch)}>
              <ha-icon icon="mdi:fridge-outline"></ha-icon>
              <span>${i ? m(this.hass, "on") : m(this.hass, "off")}</span>
            </button>` : d}
        <div class="readouts">
          ${e.temperature ? c`<div class="ro" @click=${() => W(this, e.temperature)}>
                <span class="l">${m(this.hass, "fridge_temp")}</span>
                <span class="v">${_(this.hass, r, { precision: 1 })}</span>
              </div>` : d}
          ${e.target && !L(p(this.hass, e.target)) ? c`<div class="ro"><span class="l">${m(this.hass, "target")}</span><span class="v">${_(this.hass, p(this.hass, e.target), { precision: 1 })}</span></div>` : d}
          ${e.power && !L(p(this.hass, e.power)) ? c`<div class="ro"><span class="l">${m(this.hass, "power_now")}</span><span class="v">${_(this.hass, p(this.hass, e.power))}</span></div>` : d}
        </div>
      </div>
    `;
  }
  // ==================== CAMERA ====================
  _ptzButtons(e) {
    var a;
    if (e.ptz_buttons) return e.ptz_buttons;
    const t = {};
    for (const s of Object.keys(this.hass.states)) {
      if (It(s) !== "button") continue;
      const l = s.match(/^button\.(.+)_ptz_(left|right|up|down|zoom_in|zoom_out)$/);
      l && ((t[a = l[1]] ?? (t[a] = {}))[l[2]] = s);
    }
    const i = (e.camera ?? "").split(".")[1] ?? "";
    let r = "", o = -1;
    for (const s of Object.keys(t)) {
      const l = s.split("_"), n = i.split("_");
      let h = 0;
      for (; h < l.length && h < n.length && l[h] === n[h]; ) h++;
      h > o && (o = h, r = s);
    }
    return r ? t[r] : {};
  }
  _renderCamera(e) {
    const t = p(this.hass, e.camera), i = p(this.hass, e.switch), r = p(this.hass, e.presets), o = this._ptzButtons(e), a = e.ptz !== !1 && (e.ptz === !0 || De.some((n) => o[n])), s = t?.attributes?.entity_picture, l = (n, h) => c`<button class="ptz-btn" ?disabled=${!o[n]} @click=${() => o[n] && this.hass.callService("button", "press", { entity_id: o[n] })}>
        <ha-icon .icon=${h}></ha-icon>
      </button>`;
    return c`
      ${this._tileHead(
      e,
      e.switch ? c`<button
              class="ptz-btn"
              style=${et(i) ? "color:var(--bc-accent)" : ""}
              title=${m(this.hass, "camera_power")}
              @click=${() => it(this.hass, e.switch)}
            ><ha-icon icon="mdi:power"></ha-icon></button>` : void 0
    )}
      <div class="cam-wrap" style="--ar:${(e.aspect_ratio ?? "16:9").replace(":", "/")}">
        ${e.switch && !et(i) ? c`<div class="cam off"><ha-icon icon="mdi:cctv-off"></ha-icon><span>${m(this.hass, "off")}</span></div>` : c`<div class="cam" @click=${() => e.camera && W(this, e.camera)}>
              ${t ? c`<ha-camera-stream .hass=${this.hass} .stateObj=${t} muted></ha-camera-stream>` : d}
              ${!t && s ? c`<img src=${s} alt="camera" />` : d}
            </div>`}
      </div>
      ${r && !L(r) ? c`<div class="presets">
            <ha-icon icon="mdi:map-marker-radius"></ha-icon>
            <select @change=${(n) => this.hass.callService("select", "select_option", { entity_id: e.presets, option: n.target.value })}>
              ${(r.attributes.options ?? []).map((n) => c`<option ?selected=${n === r.state}>${n}</option>`)}
            </select>
          </div>` : d}
      ${a ? c`<div class="ptz">
            <div class="pad">
              <span></span>${l("up", "mdi:chevron-up")}<span></span>
              ${l("left", "mdi:chevron-left")}<ha-icon class="pad-center" icon="mdi:pan"></ha-icon>${l("right", "mdi:chevron-right")}
              <span></span>${l("down", "mdi:chevron-down")}<span></span>
            </div>
            <div class="zoom">${l("zoom_out", "mdi:magnify-minus-outline")}${l("zoom_in", "mdi:magnify-plus-outline")}</div>
          </div>` : d}
    `;
  }
  // ==================== GRAFANA ====================
  _grafanaUrl(e) {
    let t = e.url ?? "";
    if (e.auto_params === !1) return t;
    const i = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches, r = (o, a) => {
      new RegExp(`[?&]${o}(=|&|$)`).test(t) || (t += (t.includes("?") ? "&" : "?") + (a ? `${o}=${a}` : o));
    };
    return r("theme", i ? "dark" : "light"), r("kiosk"), t;
  }
  _renderGrafana(e) {
    return c`
      ${this._tileHead(
      e,
      e.show_open !== !1 && e.url ? c`<a class="g-open" href=${e.url} target="_blank" rel="noopener" title=${m(this.hass, "open_grafana")}><ha-icon icon="mdi:open-in-new"></ha-icon></a>` : void 0
    )}
      ${e.url ? c`<iframe class="frame" style="height:${e.height ?? 400}px" src=${this._grafanaUrl(e)} loading="lazy" referrerpolicy="no-referrer"></iframe>` : c`<div class="missing">${m(this.hass, "no_url")}</div>`}
    `;
  }
  // ==================== SENSOR (generic) ====================
  _renderSensor(e) {
    const t = p(this.hass, e.entity);
    return c`
      <div class="${t ? "clickable" : ""}" @click=${() => e.entity && W(this, e.entity)}>
        ${this._tileHead(e)}
        <div class="value">
          ${_(this.hass, t, { precision: e.precision, unit: e.unit, attribute: e.attribute, unavailable: "—" })}
        </div>
      </div>
    `;
  }
};
K.styles = Ce;
ht([
  y({ attribute: !1 })
], K.prototype, "hass", 2);
ht([
  N()
], K.prototype, "_config", 2);
ht([
  N()
], K.prototype, "_variantOverride", 2);
K = ht([
  lt("boat-card")
], K);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-card",
  name: "Boat Card",
  description: "A fully configurable card for a boat: graphical boat overview with per-image chips, battery & solar, fridge, PTZ camera and Grafana — all in one card.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
export {
  K as BoatCard
};
