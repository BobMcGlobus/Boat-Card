/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, Mt = mt.ShadowRoot && (mt.ShadyCSS === void 0 || mt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Pt = Symbol(), Ft = /* @__PURE__ */ new WeakMap();
let te = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== Pt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Mt && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = Ft.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ft.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const me = (t) => new te(typeof t == "string" ? t : t + "", void 0, Pt), _t = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, a, o) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[o + 1], t[0]);
  return new te(i, t, Pt);
}, ge = (t, e) => {
  if (Mt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), a = mt.litNonce;
    a !== void 0 && r.setAttribute("nonce", a), r.textContent = i.cssText, t.appendChild(r);
  }
}, Bt = Mt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return me(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: fe, defineProperty: be, getOwnPropertyDescriptor: ve, getOwnPropertyNames: _e, getOwnPropertySymbols: ye, getPrototypeOf: xe } = Object, H = globalThis, Dt = H.trustedTypes, $e = Dt ? Dt.emptyScript : "", we = H.reactiveElementPolyfillSupport, st = (t, e) => t, gt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? $e : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Rt = (t, e) => !fe(t, e), Ut = { attribute: !0, type: String, converter: gt, reflect: !1, useDefault: !1, hasChanged: Rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), H.litPropertyMetadata ?? (H.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let X = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Ut) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = Symbol(), a = this.getPropertyDescriptor(e, r, i);
      a !== void 0 && be(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: a, set: o } = ve(this.prototype, e) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: a, set(s) {
      const c = a?.call(this);
      o?.call(this, s), this.requestUpdate(e, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(st("elementProperties"))) return;
    const e = xe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(st("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(st("properties"))) {
      const i = this.properties, r = [..._e(i), ...ye(i)];
      for (const a of r) this.createProperty(a, i[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [r, a] of i) this.elementProperties.set(r, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const a = this._$Eu(i, r);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const a of r) i.unshift(Bt(a));
    } else e !== void 0 && i.push(Bt(e));
    return i;
  }
  static _$Eu(e, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ge(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, r) {
    this._$AK(e, r);
  }
  _$ET(e, i) {
    const r = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, r);
    if (a !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : gt).toAttribute(i, r.type);
      this._$Em = e, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const r = this.constructor, a = r._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const o = r.getPropertyOptions(a), s = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : gt;
      this._$Em = a;
      const c = s.fromAttribute(i, o.type);
      this[a] = c ?? this._$Ej?.get(a) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, a = !1, o) {
    if (e !== void 0) {
      const s = this.constructor;
      if (a === !1 && (o = this[e]), r ?? (r = s.getPropertyOptions(e)), !((r.hasChanged ?? Rt)(o, i) || r.useDefault && r.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(s._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: a, wrapped: o }, s) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, s ?? i ?? this[e]), o !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [a, o] of r) {
        const { wrapped: s } = o, c = this[a];
        s !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, o, c);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
X.elementStyles = [], X.shadowRootOptions = { mode: "open" }, X[st("elementProperties")] = /* @__PURE__ */ new Map(), X[st("finalized")] = /* @__PURE__ */ new Map(), we?.({ ReactiveElement: X }), (H.reactiveElementVersions ?? (H.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis, Ht = (t) => t, ft = ot.trustedTypes, jt = ft ? ft.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ee = "$lit$", U = `lit$${Math.random().toFixed(9).slice(2)}$`, ie = "?" + U, ke = `<${ie}>`, Q = document, ct = () => Q.createComment(""), lt = (t) => t === null || typeof t != "object" && typeof t != "function", Tt = Array.isArray, Se = (t) => Tt(t) || typeof t?.[Symbol.iterator] == "function", kt = `[ 	
\f\r]`, rt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Wt = /-->/g, It = />/g, G = RegExp(`>|${kt}(?:([^\\s"'>=/]+)(${kt}*=${kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Kt = /'/g, Gt = /"/g, re = /^(?:script|style|textarea|title)$/i, ae = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), l = ae(1), w = ae(2), J = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Zt = /* @__PURE__ */ new WeakMap(), Z = Q.createTreeWalker(Q, 129);
function se(t, e) {
  if (!Tt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return jt !== void 0 ? jt.createHTML(e) : e;
}
const Ae = (t, e) => {
  const i = t.length - 1, r = [];
  let a, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = rt;
  for (let c = 0; c < i; c++) {
    const n = t[c];
    let h, m, p = -1, _ = 0;
    for (; _ < n.length && (s.lastIndex = _, m = s.exec(n), m !== null); ) _ = s.lastIndex, s === rt ? m[1] === "!--" ? s = Wt : m[1] !== void 0 ? s = It : m[2] !== void 0 ? (re.test(m[2]) && (a = RegExp("</" + m[2], "g")), s = G) : m[3] !== void 0 && (s = G) : s === G ? m[0] === ">" ? (s = a ?? rt, p = -1) : m[1] === void 0 ? p = -2 : (p = s.lastIndex - m[2].length, h = m[1], s = m[3] === void 0 ? G : m[3] === '"' ? Gt : Kt) : s === Gt || s === Kt ? s = G : s === Wt || s === It ? s = rt : (s = G, a = void 0);
    const x = s === G && t[c + 1].startsWith("/>") ? " " : "";
    o += s === rt ? n + ke : p >= 0 ? (r.push(h), n.slice(0, p) + ee + n.slice(p) + U + x) : n + U + (p === -2 ? c : x);
  }
  return [se(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class dt {
  constructor({ strings: e, _$litType$: i }, r) {
    let a;
    this.parts = [];
    let o = 0, s = 0;
    const c = e.length - 1, n = this.parts, [h, m] = Ae(e, i);
    if (this.el = dt.createElement(h, r), Z.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (a = Z.nextNode()) !== null && n.length < c; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const p of a.getAttributeNames()) if (p.endsWith(ee)) {
          const _ = m[s++], x = a.getAttribute(p).split(U), f = /([.?@])?(.*)/.exec(_);
          n.push({ type: 1, index: o, name: f[2], strings: x, ctor: f[1] === "." ? Ce : f[1] === "?" ? ze : f[1] === "@" ? Ne : yt }), a.removeAttribute(p);
        } else p.startsWith(U) && (n.push({ type: 6, index: o }), a.removeAttribute(p));
        if (re.test(a.tagName)) {
          const p = a.textContent.split(U), _ = p.length - 1;
          if (_ > 0) {
            a.textContent = ft ? ft.emptyScript : "";
            for (let x = 0; x < _; x++) a.append(p[x], ct()), Z.nextNode(), n.push({ type: 2, index: ++o });
            a.append(p[_], ct());
          }
        }
      } else if (a.nodeType === 8) if (a.data === ie) n.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = a.data.indexOf(U, p + 1)) !== -1; ) n.push({ type: 7, index: o }), p += U.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const r = Q.createElement("template");
    return r.innerHTML = e, r;
  }
}
function tt(t, e, i = t, r) {
  if (e === J) return e;
  let a = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const o = lt(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== o && (a?._$AO?.(!1), o === void 0 ? a = void 0 : (a = new o(t), a._$AT(t, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = a : i._$Cl = a), a !== void 0 && (e = tt(t, a._$AS(t, e.values), a, r)), e;
}
class Ee {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: r } = this._$AD, a = (e?.creationScope ?? Q).importNode(i, !0);
    Z.currentNode = a;
    let o = Z.nextNode(), s = 0, c = 0, n = r[0];
    for (; n !== void 0; ) {
      if (s === n.index) {
        let h;
        n.type === 2 ? h = new ht(o, o.nextSibling, this, e) : n.type === 1 ? h = new n.ctor(o, n.name, n.strings, this, e) : n.type === 6 && (h = new Me(o, this, e)), this._$AV.push(h), n = r[++c];
      }
      s !== n?.index && (o = Z.nextNode(), s++);
    }
    return Z.currentNode = Q, a;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class ht {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, r, a) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = tt(this, e, i), lt(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== J && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Se(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && lt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Q.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: r } = e, a = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = dt.createElement(se(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const o = new Ee(a, this), s = o.u(this.options);
      o.p(i), this.T(s), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = Zt.get(e.strings);
    return i === void 0 && Zt.set(e.strings, i = new dt(e)), i;
  }
  k(e) {
    Tt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, a = 0;
    for (const o of e) a === i.length ? i.push(r = new ht(this.O(ct()), this.O(ct()), this, this.options)) : r = i[a], r._$AI(o), a++;
    a < i.length && (this._$AR(r && r._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const r = Ht(e).nextSibling;
      Ht(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
let yt = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, a, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = i, this._$AM = a, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, i = this, r, a) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) e = tt(this, e, i, 0), s = !lt(e) || e !== this._$AH && e !== J, s && (this._$AH = e);
    else {
      const c = e;
      let n, h;
      for (e = o[0], n = 0; n < o.length - 1; n++) h = tt(this, c[r + n], i, n), h === J && (h = this._$AH[n]), s || (s = !lt(h) || h !== this._$AH[n]), h === d ? e = d : e !== d && (e += (h ?? "") + o[n + 1]), this._$AH[n] = h;
    }
    s && !a && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class Ce extends yt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class ze extends yt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Ne extends yt {
  constructor(e, i, r, a, o) {
    super(e, i, r, a, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = tt(this, e, i, 0) ?? d) === J) return;
    const r = this._$AH, a = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, o = e !== d && (r === d || a);
    a && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Me {
  constructor(e, i, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    tt(this, e);
  }
}
const Pe = ot.litHtmlPolyfillSupport;
Pe?.(dt, ht), (ot.litHtmlVersions ?? (ot.litHtmlVersions = [])).push("3.3.3");
const Re = (t, e, i) => {
  const r = i?.renderBefore ?? e;
  let a = r._$litPart$;
  if (a === void 0) {
    const o = i?.renderBefore ?? null;
    r._$litPart$ = a = new ht(e.insertBefore(ct(), o), o, void 0, i ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis;
class j extends X {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Re(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return J;
  }
}
j._$litElement$ = !0, j.finalized = !0, nt.litElementHydrateSupport?.({ LitElement: j });
const Te = nt.litElementPolyfillSupport;
Te?.({ LitElement: j });
(nt.litElementVersions ?? (nt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = { attribute: !0, type: String, converter: gt, reflect: !1, hasChanged: Rt }, Le = (t = Oe, e, i) => {
  const { kind: r, metadata: a } = i;
  let o = globalThis.litPropertyMetadata.get(a);
  if (o === void 0 && globalThis.litPropertyMetadata.set(a, o = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), r === "accessor") {
    const { name: s } = i;
    return { set(c) {
      const n = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(s, n, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(s, void 0, t, c), c;
    } };
  }
  if (r === "setter") {
    const { name: s } = i;
    return function(c) {
      const n = this[s];
      e.call(this, c), this.requestUpdate(s, n, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function T(t) {
  return (e, i) => typeof i == "object" ? Le(t, e, i) : ((r, a, o) => {
    const s = a.hasOwnProperty(o);
    return a.constructor.createProperty(o, r), s ? Object.getOwnPropertyDescriptor(a, o) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function S(t) {
  return T({ ...t, state: !0, attribute: !1 });
}
const Fe = ["unavailable", "unknown", "none", ""];
function g(t, e) {
  if (!(!t || !e))
    return t.states[e];
}
function C(t) {
  return !t || Fe.includes(String(t.state).toLowerCase());
}
function pt(t) {
  if (!t) return !1;
  const e = String(t.state).toLowerCase();
  return ["on", "open", "home", "active", "charging", "true", "playing"].includes(e);
}
function D(t, e) {
  if (!t) return NaN;
  const i = e ? t.attributes?.[e] : t.state;
  if (i == null) return NaN;
  const r = typeof i == "number" ? i : parseFloat(String(i).replace(",", "."));
  return Number.isFinite(r) ? r : NaN;
}
function Be(t) {
  return t?.attributes?.unit_of_measurement ?? "";
}
function et(t, e = "") {
  return t?.attributes?.friendly_name ?? e;
}
function oe(t) {
  return t.split(".")[0] ?? "";
}
function V(t, e) {
  t.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId: e },
      bubbles: !0,
      composed: !0
    })
  );
}
function De(t, e, i) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: i, bubbles: !0, composed: !0 })
  );
}
function at(t, e) {
  const i = oe(e), r = ["switch", "light", "fan", "input_boolean"].includes(i) ? i : "homeassistant";
  t.callService(r, "toggle", { entity_id: e });
}
function bt(t) {
  return t ? /^(#|rgb|hsl|var\()/.test(t) ? t : [
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
  ].includes(t) ? `var(--${t}-color)` : t : void 0;
}
function Ue(t) {
  return t?.locale?.language ?? t?.language ?? "de";
}
function O(t, e, i) {
  if (!Number.isFinite(e)) return "–";
  const r = {};
  i !== void 0 ? (r.minimumFractionDigits = i, r.maximumFractionDigits = i) : r.maximumFractionDigits = 1;
  try {
    return new Intl.NumberFormat(Ue(t), r).format(e);
  } catch {
    return String(e);
  }
}
function He(t, e) {
  return e ? ["%"].includes(e) ? `${t}${e}` : `${t} ${e}` : t;
}
function k(t, e, i = {}) {
  if (C(e)) return i.unavailable ?? "—";
  const r = D(e, i.attribute);
  if (Number.isFinite(r))
    return He(O(t, r, i.precision), i.unit ?? Be(e));
  if (i.attribute && e) {
    const a = e.attributes?.[i.attribute];
    if (a != null) return String(a);
  }
  if (t.formatEntityState && e)
    try {
      return t.formatEntityState(e);
    } catch {
    }
  return e ? e.state : i.unavailable ?? "—";
}
function Qt(t, e = "de") {
  if (!Number.isFinite(t)) return "";
  const i = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"], r = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], a = Math.round((t % 360 + 360) % 360 / 45) % 8;
  return (e === "de" ? i : r)[a];
}
const je = {
  range_day: "Tag",
  range_week: "Woche",
  range_month: "Monat",
  stat_min: "Min",
  stat_avg: "Ø",
  stat_max: "Max",
  stat_trend: "Trend",
  weather: "Wetter",
  forecast: "Vorhersage",
  radar: "Radar",
  wind: "Wind",
  gusts: "Böen",
  precipitation: "Niederschlag",
  inside: "Innen",
  outside: "Außen",
  now: "Jetzt",
  forecast_hourly: "Stündlich",
  forecast_daily: "Täglich",
  no_weather: "Keine Wetter-Entität konfiguriert",
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
}, We = {
  range_day: "Day",
  range_week: "Week",
  range_month: "Month",
  stat_min: "Min",
  stat_avg: "Avg",
  stat_max: "Max",
  stat_trend: "Trend",
  weather: "Weather",
  forecast: "Forecast",
  radar: "Radar",
  wind: "Wind",
  gusts: "Gusts",
  precipitation: "Precipitation",
  inside: "Inside",
  outside: "Outside",
  now: "Now",
  forecast_hourly: "Hourly",
  forecast_daily: "Daily",
  no_weather: "No weather entity configured",
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
function Ie(t) {
  return (t?.locale?.language ?? t?.language ?? "de").toLowerCase().startsWith("de") ? "de" : "en";
}
function u(t, e) {
  return (Ie(t) === "de" ? je : We)[e] ?? e;
}
const Ke = [
  "default",
  "glass",
  "material",
  "bubble",
  "mirror"
], zt = ["dock", "sailing", "trailer"], Ge = [
  "boat",
  "battery",
  "solar",
  "weather",
  "forecast",
  "radar",
  "fridge",
  "camera",
  "grafana",
  "sensor"
];
function Vt(t) {
  return `s-${t && Ke.includes(t) ? t : "default"}`;
}
const Ze = _t`
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
    /* playing-card portrait (poker card 63×88 mm ≈ 5:7), centered like a card
       lying on the tile; ratio/width configurable per section */
    aspect-ratio: var(--bc-stage-ar, 5 / 7);
    max-width: var(--bc-stage-w, 400px);
    margin: 0 auto;
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 8px;
    margin-top: 12px;
  }
  /* actors render as outlined mini tiles (like HA's tile card) */
  .ctl {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    color: var(--secondary-text-color);
    cursor: pointer;
    font: inherit;
    padding: 10px 8px;
    border-radius: 14px;
    transition: all 0.15s;
  }
  .ctl:hover {
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }
  .ctl ha-icon {
    --mdc-icon-size: 26px;
  }
  .ctl.on {
    color: var(--bc-accent);
    border-color: var(--bc-accent);
    background: color-mix(in srgb, var(--bc-accent) 14%, transparent);
  }
  .ctl .cl {
    font-size: 12px;
  }
  .s-mirror .ctl {
    background: #000;
    border-color: rgba(255, 255, 255, 0.28);
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

  /* ---- battery banks / solar arrays (multi) ---- */
  .banks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .bank {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 8px;
    border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }
  .bank:first-child {
    border-top: none;
    padding-top: 0;
  }
  .bank-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .bank-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary-text-color);
    flex: 1;
  }
  .bank-val {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .bank .kv {
    font-size: 12px;
  }

  /* ---- weather chips (Weatherglass sky-details look) ---- */
  .wx-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 6px;
  }
  .wx {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border-radius: 12px;
    padding: 6px 8px;
    text-align: center;
    min-width: 0;
  }
  .wx-label {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .wx-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-text-color);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
  }
  .wx-value ha-icon {
    --mdc-icon-size: 15px;
    color: var(--bc-accent);
  }
  .wx-sub {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .s-mirror .wx {
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.28);
  }

  /* ---- forecast strip (Weatherglass look) ---- */
  .periods {
    display: flex;
    gap: 6px;
    margin-bottom: 6px;
  }
  .period {
    border: none;
    cursor: pointer;
    padding: 5px 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 12px;
    font-family: inherit;
    color: var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  .period.active {
    background: var(--bc-accent);
    color: #fff;
  }
  .fc-strip {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    margin-top: 2px;
    padding-bottom: 2px;
  }
  .fc-strip::-webkit-scrollbar {
    display: none;
  }
  .fc-step {
    flex: 1 0 auto;
    min-width: 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 4px;
    border-radius: 12px;
  }
  .fc-when {
    font-size: 11px;
    font-weight: 600;
    color: var(--secondary-text-color);
  }
  .fc-ico {
    --mdc-icon-size: 22px;
    color: var(--bc-accent);
  }
  .fc-pop {
    font-size: 10px;
    font-weight: 600;
    min-height: 13px;
    color: var(--light-blue-color, #03a9f4);
  }
  .fc-pop.empty {
    opacity: 0;
  }
  .fc-temp {
    font-size: 13px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .fc-lo {
    font-size: 11px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  /* ---- radar ---- */
  .radarframe {
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    aspect-ratio: 16 / 10;
  }
  .radarframe iframe {
    width: 100%;
    height: 100%;
    border: none;
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
`, Ot = () => w`
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
`, Lt = (t) => w`
  <line x1="212" y1="132" x2="212" y2="34" stroke="#e7e2d6" stroke-width="4"
        stroke-linecap="round" />
  ${t ? w`
        <path d="M208 40 Q150 90 176 150 L208 150 Z" fill="#f4f1ea" />
        <path d="M216 44 Q270 92 250 150 L216 150 Z" fill="#fbfaf6" />
        <path d="M208 40 Q150 90 176 150" fill="none" stroke="#d9d3c4" stroke-width="1.5" />` : w`
        <path d="M212 40 Q206 90 212 150" fill="none" stroke="#cfe0f5" stroke-width="10"
              stroke-linecap="round" opacity="0.9" />`}
`, ne = (t) => w`
  <g opacity="0.7" stroke="#7fa8d8" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M60 200 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" />
    ${t ? w`<path d="M40 214 q16 -6 32 0 t32 0 t32 0 t32 0 t32 0 t32 0"
                    opacity="0.5" />` : d}
  </g>
`, Qe = () => w`
  ${ne(!1)}
  <!-- pier -->
  <g>
    <path d="M300 196 L392 176 L392 190 L300 210 Z" fill="#b98c5a" />
    <path d="M300 196 L392 176 L392 179 L300 199 Z" fill="#caa06f" />
    <rect x="330" y="205" width="6" height="26" fill="#7c5a34" />
    <rect x="372" y="196" width="6" height="30" fill="#7c5a34" />
  </g>
  ${Ot()}
  ${Lt(!1)}
`, Ve = () => w`
  ${ne(!0)}
  ${Ot()}
  ${Lt(!0)}
  <!-- little wake -->
  <path d="M70 200 q-18 4 -30 -2" fill="none" stroke="#fff" stroke-width="3"
        stroke-linecap="round" opacity="0.55" />
`, qe = () => w`
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
  ${Ot()}
  ${Lt(!1)}
`;
function ce(t) {
  const e = t === "sailing" ? Ve() : t === "trailer" ? qe() : Qe();
  return l`<svg
    viewBox="0 0 410 240"
    xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;display:block"
  >
    ${e}
  </svg>`;
}
const P = {
  boat: { icon: "mdi:sail-boat", color: "#5b7cfa", nameKey: "boat" },
  battery: { icon: "mdi:car-battery", color: "#34c759", nameKey: "battery", graph: "line", trend: "up_good" },
  solar: { icon: "mdi:solar-power-variant", color: "#f5a623", nameKey: "solar", graph: "bar", trend: "up_good" },
  weather: { icon: "mdi:weather-partly-cloudy", color: "#2aa5c7", nameKey: "weather" },
  forecast: { icon: "mdi:calendar-clock", color: "#5b7cfa", nameKey: "forecast" },
  radar: { icon: "mdi:radar", color: "#5b7cfa", nameKey: "radar" },
  fridge: { icon: "mdi:fridge-outline", color: "#2aa5c7", nameKey: "fridge" },
  camera: { icon: "mdi:cctv", color: "#6d8bff", nameKey: "camera" },
  grafana: { icon: "mdi:chart-areaspline", color: "#f46800", nameKey: "grafana" },
  sensor: { icon: "mdi:gauge", color: "#5b7cfa", nameKey: "sensor", graph: "line", trend: "neutral" }
}, Ye = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
  exceptional: "mdi:weather-cloudy-alert"
};
function Xe(t, e = !0) {
  if (!t) return e ? "mdi:weather-partly-cloudy" : "mdi:weather-night";
  if (!e) {
    if (t === "sunny") return "mdi:weather-night";
    if (t === "partlycloudy") return "mdi:weather-night-partly-cloudy";
  }
  return Ye[t] ?? "mdi:weather-partly-cloudy";
}
async function Je(t, e, i) {
  try {
    const o = (await t.callWS({
      type: "execute_script",
      sequence: [
        {
          service: "weather.get_forecasts",
          data: { type: i },
          target: { entity_id: e },
          response_variable: "_bc_forecast"
        },
        { stop: "done", response_variable: "_bc_forecast" }
      ]
    }))?.response?.[e]?.forecast;
    if (Array.isArray(o) && o.length) return o;
  } catch {
  }
  if (t.connection?.subscribeMessage)
    try {
      const a = await new Promise((o) => {
        let s;
        const c = setTimeout(() => {
          s?.(), o([]);
        }, 4e3);
        t.connection.subscribeMessage(
          (n) => {
            clearTimeout(c), s?.(), o(n.forecast ?? []);
          },
          {
            type: "weather/subscribe_forecast",
            forecast_type: i,
            entity_id: e
          }
        ).then((n) => {
          s = n;
        }).catch(() => o([]));
      });
      if (a.length) return a;
    } catch {
    }
  const r = t.states[e]?.attributes?.forecast;
  return Array.isArray(r) && r.length ? r : [];
}
async function ti(t, e, i) {
  if (!e.length) return {};
  const r = /* @__PURE__ */ new Date(), a = /* @__PURE__ */ new Date();
  a.setHours(0, 0, 0, 0), a.setDate(a.getDate() - (i - 1));
  const o = await t.callWS({
    type: "history/history_during_period",
    start_time: a.toISOString(),
    end_time: r.toISOString(),
    entity_ids: e,
    minimal_response: !0,
    no_attributes: !0
  }), s = {};
  for (const c of e)
    s[c] = (o?.[c] ?? []).map((n) => ({ t: n.lu * 1e3, v: parseFloat(n.s) })).filter((n) => Number.isFinite(n.v));
  return s;
}
function ei(t, e, i) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const a = r.getTime() - (e - 1) * 864e5, o = Array.from({ length: e }, () => []);
  for (const s of t) {
    const c = Math.floor((s.t - a) / 864e5);
    c >= 0 && c < e && o[c].push(s.v);
  }
  return o.map((s) => {
    if (!s.length) return NaN;
    switch (i) {
      case "min":
        return Math.min(...s);
      case "max":
        return Math.max(...s);
      case "sum":
        return s.reduce((c, n) => c + n, 0);
      case "last":
        return s[s.length - 1];
      default:
        return s.reduce((c, n) => c + n, 0) / s.length;
    }
  });
}
function ii(t, e, i) {
  const r = /* @__PURE__ */ new Date();
  r.setMinutes(0, 0, 0);
  const a = r.getTime() - (e - 1) * 36e5, o = Array.from({ length: e }, () => []);
  for (const s of t) {
    const c = Math.floor((s.t - a) / 36e5);
    c >= 0 && c < e && o[c].push(s.v);
  }
  return o.map((s) => {
    if (!s.length) return NaN;
    switch (i) {
      case "min":
        return Math.min(...s);
      case "max":
        return Math.max(...s);
      case "sum":
        return s.reduce((c, n) => c + n, 0);
      case "last":
        return s[s.length - 1];
      default:
        return s.reduce((c, n) => c + n, 0) / s.length;
    }
  });
}
function ut(t) {
  const e = [...t];
  let i = NaN;
  for (let a = 0; a < e.length; a++)
    Number.isFinite(e[a]) ? i = e[a] : e[a] = i;
  let r = NaN;
  for (let a = e.length - 1; a >= 0; a--)
    Number.isFinite(e[a]) ? r = e[a] : e[a] = r;
  return e;
}
function qt(t) {
  const e = t.filter(Number.isFinite);
  return e.length < 2 ? NaN : e[e.length - 1] - e[0];
}
const le = 220, de = 60, R = 7, vt = "color-mix(in srgb, var(--primary-text-color) 14%, transparent)";
function he(t, e) {
  const i = t.yFmt ? Math.max(26, ...e.map((a) => t.yFmt(a).length * 5.6 + 10)) : R, r = t.xMarks?.some((a) => a.label) ? 15 : R;
  return { padL: i, padB: r };
}
function ri(t) {
  const e = t.filter(Number.isFinite), i = Math.min(...e), r = Math.max(...e), a = r - i || Math.abs(r) * 0.1 || 1;
  return { lo: i - a * 0.18, hi: r + a * 0.18 };
}
function Yt(t, e = {}) {
  const i = e.w ?? le, r = e.h ?? de, a = e.dots ?? !0, o = t.filter((b) => b.values.some(Number.isFinite));
  if (!o.length) return d;
  const { lo: s, hi: c } = ri(o.flatMap((b) => b.values)), n = Math.max(...o.map((b) => b.values.length)), h = e.yFmt ? [c - (c - s) * 0.08, (s + c) / 2, s + (c - s) * 0.08] : [], { padL: m, padB: p } = he(e, h), _ = (b) => m + b * (i - m - R) / Math.max(n - 1, 1), x = (b) => r - p - (b - s) / (c - s) * (r - p - R), f = h.map(
    (b) => w`
      <line x1=${m} x2=${i - R} y1=${x(b)} y2=${x(b)}
        stroke=${vt} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${m - 5} y=${x(b)} text-anchor="end"
        dominant-baseline="middle">${e.yFmt(b)}</text>`
  ), I = (e.xMarks ?? []).map(
    (b) => w`
      ${b.line ? w`<line x1=${_(b.i)} x2=${_(b.i)} y1=${R} y2=${r - p}
              stroke=${vt} stroke-width="1"/>` : d}
      ${b.label ? w`<text class="axis" x=${_(b.i)} y=${r - 3} text-anchor="middle">${b.label}</text>` : d}`
  ), wt = o.map((b) => {
    const E = b.values.map(($, K) => ({ x: _(K), y: x($), ok: Number.isFinite($) })).filter(($) => $.ok);
    if (!E.length) return d;
    let v = `M ${E[0].x} ${E[0].y}`;
    for (let $ = 1; $ < E.length; $++) {
      const K = (E[$ - 1].x + E[$].x) / 2;
      v += ` C ${K} ${E[$ - 1].y}, ${K} ${E[$].y}, ${E[$].x} ${E[$].y}`;
    }
    return w`
      <path d=${v} fill="none" stroke=${b.color} stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round"/>
      ${a ? E.map(
      ($) => w`<circle cx=${$.x} cy=${$.y} r="3.1" fill="var(--bc-dot-fill)"
                stroke=${b.color} stroke-width="2"/>`
    ) : d}
    `;
  });
  return l`<svg class="chart" viewBox="0 0 ${i} ${r}" aria-hidden="true">
    ${f}${I}${wt}
  </svg>`;
}
function Xt(t, e, i, r = {}) {
  const a = r.w ?? le, o = r.h ?? de;
  if (!t.some((v) => Number.isFinite(v) && v > 0)) return d;
  const s = t.map((v) => Number.isFinite(v) && v > 0 ? v : 0), c = Math.max(...s, 0) || 1, n = s.length, h = r.yFmt ? [c, c / 2] : [], { padL: m, padB: p } = he(r, h), _ = (a - m - R) / n, x = Math.min(_ * 0.55, 14), f = (v) => v / c * (o - p - R), I = h.map(
    (v) => w`
      <line x1=${m} x2=${a - R} y1=${o - p - f(v)} y2=${o - p - f(v)}
        stroke=${vt} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${m - 5} y=${o - p - f(v)} text-anchor="end"
        dominant-baseline="middle">${r.yFmt(v)}</text>`
  ), wt = (r.xMarks ?? []).map((v) => {
    const $ = m + v.i * _ + _ / 2;
    return w`
      ${v.line ? w`<line x1=${$} x2=${$} y1=${R} y2=${o - p}
              stroke=${vt} stroke-width="1"/>` : d}
      ${v.label ? w`<text class="axis" x=${$} y=${o - 3} text-anchor="middle">${v.label}</text>` : d}`;
  }), b = s.map((v, $) => {
    const K = Math.max(f(v), v > 0 ? 3 : 1.5), ue = m + $ * _ + (_ - x) / 2;
    return w`<rect x=${ue} y=${o - p - K} width=${x} height=${K}
      rx=${Math.min(x / 2, 4)} fill=${e} opacity=${v > 0 ? 1 : 0.25}/>`;
  }), E = Number.isFinite(i) ? w`<line x1=${m} x2=${a - R} y1=${o - p - f(i)} y2=${o - p - f(i)}
        stroke=${e} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>` : d;
  return l`<svg class="chart" viewBox="0 0 ${a} ${o}" aria-hidden="true">
    ${I}${wt}${E}${b}
  </svg>`;
}
var ai = Object.defineProperty, si = Object.getOwnPropertyDescriptor, A = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? si(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (a = (r ? s(e, i, a) : s(a)) || a);
  return r && a && ai(e, i, a), a;
};
const St = {
  dock: "Am Steg",
  sailing: "Segeln",
  trailer: "Anhänger"
}, oi = [
  "right",
  "left",
  "top",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
].map((t) => ({ value: t, label: t })), pe = {
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
  hidden: "In dieser Ansicht ausblenden",
  // battery banks / solar arrays (boat-items-editor)
  soc: "Ladezustand (%)",
  voltage: "Spannung",
  current: "Strom",
  power: "Leistung",
  temperature: "Temperatur",
  time_remaining: "Restzeit",
  yield_today: "Ertrag heute",
  state: "Zustand (Text)"
};
function Nt(t) {
  const e = {};
  for (const [i, r] of Object.entries(t))
    r == null || r === "" || (e[i] = r);
  return e;
}
function q(t) {
  return t.map((e) => ({
    ...e,
    positions: e.positions ? Object.fromEntries(
      Object.entries(e.positions).map(([i, r]) => [i, { ...r }])
    ) : void 0
  }));
}
let L = class extends j {
  constructor() {
    super(...arguments), this.chips = [], this._variant = "dock", this._expanded = -1, this._label = (t) => pe[t?.name] ?? t?.name ?? "";
  }
  get _chips() {
    return this._working ?? this.chips ?? [];
  }
  _ratioCss() {
    const t = /^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/.exec(this.ratio ?? "");
    return t ? `${t[1]} / ${t[2]}` : "5 / 7";
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t.map((e) => Nt(e)) },
        bubbles: !0,
        composed: !0
      })
    );
  }
  // ---- drag placement ----
  _stageRect() {
    return this.renderRoot?.querySelector(".ce-stage")?.getBoundingClientRect();
  }
  _onDotDown(t, e) {
    t.preventDefault(), t.stopPropagation(), t.currentTarget.setPointerCapture(t.pointerId), this._working = q(this.chips), this._drag = { index: e, pointerId: t.pointerId, moved: !1, x0: t.clientX, y0: t.clientY };
  }
  _onDotMove(t) {
    if (!this._drag) return;
    Math.abs(t.clientX - this._drag.x0) + Math.abs(t.clientY - this._drag.y0) > 3 && (this._drag.moved = !0);
    const e = this._stageRect();
    if (!e) return;
    let i = (t.clientX - e.left) / e.width * 100, r = (t.clientY - e.top) / e.height * 100;
    i = Math.max(0, Math.min(100, Math.round(i * 10) / 10)), r = Math.max(0, Math.min(100, Math.round(r * 10) / 10));
    const a = this._working[this._drag.index], o = a.positions?.[this._variant] ?? { x: 50, y: 50 };
    a.positions = { ...a.positions ?? {}, [this._variant]: { ...o, x: i, y: r } }, this.requestUpdate();
  }
  _onDotUp(t, e) {
    if (!this._drag) return;
    const i = this._drag.moved, r = this._working ?? this.chips;
    this._drag = void 0, this._working = void 0, i ? this._emit(r) : this._expanded = this._expanded === e ? -1 : e;
  }
  _chipPos(t) {
    const e = t.positions?.[this._variant];
    return e && !e.hidden ? e : void 0;
  }
  // ---- chip mutations ----
  _addChip() {
    const t = q(this.chips);
    t.push({
      entity: "",
      positions: { [this._variant]: { x: 50, y: 50, dot: "right" } }
    }), this._expanded = t.length - 1, this._emit(t);
  }
  _removeChip(t) {
    const e = q(this.chips);
    e.splice(t, 1), this._expanded === t && (this._expanded = -1), this._emit(e);
  }
  _moveChip(t, e) {
    const i = q(this.chips), r = t + e;
    r < 0 || r >= i.length || ([i[t], i[r]] = [i[r], i[t]], this._emit(i));
  }
  _placeHere(t) {
    const e = q(this.chips);
    e[t].positions = {
      ...e[t].positions ?? {},
      [this._variant]: { x: 50, y: 50, dot: "right" }
    }, this._emit(e);
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
          { name: "dot", selector: { select: { mode: "dropdown", options: oi } } },
          { name: "hidden", selector: { boolean: {} } }
        ]
      }
    ];
  }
  _flatten(t) {
    const e = t.positions?.[this._variant] ?? {};
    return Nt({
      entity: t.entity,
      entity2: t.entity2,
      name: t.name,
      icon: t.icon,
      color: t.color,
      unit: t.unit,
      precision: t.precision,
      tap_action: t.tap_action,
      x: e.x,
      y: e.y,
      dot: e.dot,
      hidden: e.hidden
    });
  }
  _chipFormChanged(t, e) {
    t.stopPropagation();
    const i = t.detail.value, r = q(this.chips), a = r[e];
    a.entity = i.entity ?? "", a.entity2 = i.entity2 || void 0, a.name = i.name || void 0, a.icon = i.icon || void 0, a.color = i.color || void 0, a.unit = i.unit || void 0, a.precision = i.precision, a.tap_action = i.tap_action || void 0;
    const o = { ...a.positions ?? {} };
    i.x !== void 0 && i.y !== void 0 ? o[this._variant] = {
      x: i.x,
      y: i.y,
      dot: i.dot || void 0,
      hidden: i.hidden || void 0
    } : i.hidden ? o[this._variant] = {
      ...o[this._variant] ?? { x: 50, y: 50 },
      hidden: !0
    } : delete o[this._variant], a.positions = o, this._emit(r);
  }
  render() {
    const t = this._chips;
    return l`
      <div class="ce">
        <div class="ce-tabs">
          ${zt.map(
      (e) => l`<button
              class=${e === this._variant ? "on" : ""}
              @click=${() => this._variant = e}
            >
              ${St[e]}
            </button>`
    )}
        </div>

        <div class="ce-stage-wrap">
          <div class="ce-stage" style="--ce-ar:${this._ratioCss()}">
            ${this.images?.[this._variant] ? l`<img src=${this.images[this._variant]} alt="" />` : l`<div class="svg">${ce(this._variant)}</div>`}
            ${t.map((e, i) => this._renderDot(e, i))}
          </div>
          <div class="ce-hint">
            Punkte auf das Boot ziehen · Antippen zum Bearbeiten ·
            Ansicht: <b>${St[this._variant]}</b>
          </div>
        </div>

        <div class="ce-list">
          ${t.map((e, i) => this._renderRow(e, i))}
        </div>

        <button class="ce-add" @click=${this._addChip}>
          <ha-icon icon="mdi:plus"></ha-icon> Chip hinzufügen
        </button>
      </div>
    `;
  }
  _renderDot(t, e) {
    const i = this._chipPos(t);
    if (!i) return d;
    const r = g(this.hass, t.entity), a = bt(t.color) ?? "var(--bc-accent, #5b7cfa)", o = r ? k(this.hass, r, { precision: t.precision, unit: t.unit }) : "—", s = i.dot ?? (i.x >= 50 ? "left" : "right"), c = (t.name ?? et(r, t.entity)) || `#${e + 1}`;
    return l`<div
      class="ce-anchor dot-${s} ${e === this._expanded ? "active" : ""}"
      style="left:${i.x}%;top:${i.y}%;--ac:${a}"
    >
      <span
        class="ce-adot"
        @pointerdown=${(n) => this._onDotDown(n, e)}
        @pointermove=${this._onDotMove}
        @pointerup=${(n) => this._onDotUp(n, e)}
        @pointercancel=${(n) => this._onDotUp(n, e)}
        title=${c}
      ></span>
      <span
        class="ce-albl"
        @click=${() => this._expanded = this._expanded === e ? -1 : e}
        >${c}: ${o}</span
      >
    </div>`;
  }
  _renderRow(t, e) {
    const i = g(this.hass, t.entity), r = !!t.positions?.[this._variant], a = !!t.positions?.[this._variant]?.hidden, o = bt(t.color) ?? "var(--bc-accent, #5b7cfa)", s = (t.name ?? et(i, t.entity)) || `Chip #${e + 1}`, c = e === this._expanded;
    return l`<div class="ce-row ${c ? "open" : ""}">
      <div class="ce-row-head" @click=${() => this._expanded = c ? -1 : e}>
        <span class="swatch" style="background:${o}"></span>
        <span class="rn">${s}</span>
        <span class="badge ${r ? a ? "hid" : "ok" : "no"}">
          ${r ? a ? "ausgeblendet" : "platziert" : "nicht in dieser Ansicht"}
        </span>
        <span class="sp"></span>
        <ha-icon-button
          .label=${"hoch"}
          @click=${(n) => {
      n.stopPropagation(), this._moveChip(e, -1);
    }}
        ><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(n) => {
      n.stopPropagation(), this._moveChip(e, 1);
    }}
        ><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(n) => {
      n.stopPropagation(), this._removeChip(e);
    }}
        ><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${c ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${c ? l`<div class="ce-row-body">
            ${r ? d : l`<button class="ce-place" @click=${() => this._placeHere(e)}>
                  <ha-icon icon="mdi:map-marker-plus"></ha-icon>
                  In „${St[this._variant]}" platzieren
                </button>`}
            <ha-form
              .hass=${this.hass}
              .data=${this._flatten(t)}
              .schema=${this._chipSchema()}
              .computeLabel=${this._label}
              @value-changed=${(n) => this._chipFormChanged(n, e)}
            ></ha-form>
          </div>` : d}
    </div>`;
  }
};
L.styles = _t`
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
      /* must match .stage in the card so chip placement stays WYSIWYG */
      aspect-ratio: var(--ce-ar, 5 / 7);
      max-width: 400px;
      margin: 0 auto;
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
A([
  T({ attribute: !1 })
], L.prototype, "hass", 2);
A([
  T({ attribute: !1 })
], L.prototype, "chips", 2);
A([
  T({ attribute: !1 })
], L.prototype, "images", 2);
A([
  T()
], L.prototype, "ratio", 2);
A([
  S()
], L.prototype, "_variant", 2);
A([
  S()
], L.prototype, "_expanded", 2);
A([
  S()
], L.prototype, "_working", 2);
L = A([
  xt("boat-chips-editor")
], L);
let W = class extends j {
  constructor() {
    super(...arguments), this.items = [], this.fields = [], this.addLabel = "Hinzufügen", this._expanded = -1, this._label = (t) => pe[t?.name] ?? t?.name ?? "";
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t.map((e) => Nt(e)) },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _norm(t) {
    return typeof t == "string" ? { entity: t } : { ...t };
  }
  _add() {
    const t = this.items.map((e) => this._norm(e));
    t.push({ entity: "" }), this._expanded = t.length - 1, this._emit(t);
  }
  _remove(t) {
    const e = this.items.map((i) => this._norm(i));
    e.splice(t, 1), this._expanded === t && (this._expanded = -1), this._emit(e);
  }
  _move(t, e) {
    const i = this.items.map((a) => this._norm(a)), r = t + e;
    r < 0 || r >= i.length || ([i[t], i[r]] = [i[r], i[t]], this._emit(i));
  }
  _changed(t, e) {
    t.stopPropagation();
    const i = this.items.map((r) => this._norm(r));
    i[e] = { ...i[e], ...t.detail.value }, this._emit(i);
  }
  render() {
    const t = (this.items ?? []).map((e) => this._norm(e));
    return l`<div class="li">
      ${t.map((e, i) => {
      const r = g(this.hass, e.entity), a = i === this._expanded, o = (e.name ?? et(r, e.entity)) || `#${i + 1}`;
      return l`<div class="row ${a ? "open" : ""}">
          <div class="head" @click=${() => this._expanded = a ? -1 : i}>
            ${e.icon ? l`<ha-icon icon=${e.icon}></ha-icon>` : d}
            <span class="n">${o}</span>
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
          ${a ? l`<div class="body">
                <ha-form
                  .hass=${this.hass}
                  .data=${e}
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
W.styles = _t`
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
A([
  T({ attribute: !1 })
], W.prototype, "hass", 2);
A([
  T({ attribute: !1 })
], W.prototype, "items", 2);
A([
  T({ attribute: !1 })
], W.prototype, "fields", 2);
A([
  T({ type: String })
], W.prototype, "addLabel", 2);
A([
  S()
], W.prototype, "_expanded", 2);
W = A([
  xt("boat-items-editor")
], W);
var ni = Object.defineProperty, ci = Object.getOwnPropertyDescriptor, $t = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? ci(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (a = (r ? s(e, i, a) : s(a)) || a);
  return r && a && ni(e, i, a), a;
};
const At = {
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
  stage_ratio: "Bildformat (B:H, z. B. 5:7)",
  stage_width: "Bildbreite max. (px)",
  gps: "GPS",
  speed: "Geschwindigkeit",
  heading: "Kurs",
  location: "Standort (device_tracker)",
  lat: "Breitengrad (Sensor)",
  lon: "Längengrad (Sensor)",
  altitude: "Höhe (Sensor)",
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
  tap_action: "Tippen",
  graph: "Diagramm",
  days: "Zeitraum (Tage)",
  trend: "Trend-Pfeil",
  wind_speed: "Windstärke",
  wind_bearing: "Windrichtung (°)",
  wind_gust: "Böen",
  precipitation: "Niederschlag",
  temp_inside: "Temperatur innen",
  temp_outside: "Temperatur außen",
  temp_water: "Wassertemperatur",
  weather: "Wetter-Entität",
  forecast_type: "Vorhersage-Art",
  forecast_count: "Anzahl Schritte",
  provider: "Anbieter",
  latitude: "Breitengrad",
  longitude: "Längengrad",
  zoom: "Zoom"
}, Jt = {
  boat: "Boot (Bild + Chips)",
  battery: "Batterie",
  solar: "Solar",
  weather: "Wetter",
  forecast: "Wetter-Vorhersage",
  radar: "Wetter-Radar",
  fridge: "Kühlschrank",
  camera: "Kamera",
  grafana: "Grafana",
  sensor: "Sensor (Wert)"
}, N = (t) => ({ name: t, selector: { text: {} } }), B = (t) => ({ name: t, selector: { boolean: {} } }), y = (t) => ({ name: t, selector: { entity: { domain: "sensor" } } }), M = (t, e) => ({
  name: t,
  selector: { entity: e ? { domain: e } : {} }
}), Y = (t, e = 0, i = 100) => ({
  name: t,
  selector: { number: { min: e, max: i, mode: "box" } }
}), li = {
  name: "card_style",
  selector: {
    select: {
      mode: "dropdown",
      options: [
        { value: "default", label: "Standard" },
        { value: "glass", label: "Liquid Glass" },
        { value: "material", label: "Material You" },
        { value: "bubble", label: "Bubble" },
        { value: "mirror", label: "Magic Mirror" }
      ]
    }
  }
}, Et = [
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "graph",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "line", label: "Linie" },
              { value: "bar", label: "Balken" },
              { value: "none", label: "Kein Chart" }
            ]
          }
        }
      },
      { name: "days", selector: { number: { min: 1, max: 31, mode: "box" } } }
    ]
  },
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "trend",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "up_good", label: "Steigend = gut" },
              { value: "down_good", label: "Fallend = gut" },
              { value: "neutral", label: "Neutral" },
              { value: "none", label: "Kein Trend" }
            ]
          }
        }
      },
      {
        name: "tap_action",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "popup", label: "Detail-Popup" },
              { value: "more-info", label: "Info-Dialog" },
              { value: "none", label: "Nichts" }
            ]
          }
        }
      }
    ]
  }
];
let it = class extends j {
  constructor() {
    super(...arguments), this._expanded = -1, this._label = (t) => At[t?.name] ?? t?.name ?? "";
  }
  setConfig(t) {
    this._config = { ...t, sections: t.sections ?? [] };
  }
  _emit(t) {
    this._config = t, De(this, "config-changed", { config: t });
  }
  _topSchema() {
    return [
      N("title"),
      N("subtitle"),
      { type: "grid", name: "", schema: [li, Y("columns", 1, 4)] },
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
          B("tiles")
        ]
      },
      { type: "grid", name: "", schema: [B("background"), B("flush")] }
    ];
  }
  _topChanged(t) {
    t.stopPropagation(), this._config && this._emit({ ...this._config, ...t.detail.value, sections: this._config.sections });
  }
  // ---- section-type field schema ----
  _sectionSchema(t) {
    const e = [
      { type: "grid", name: "", schema: [N("name"), { name: "icon", selector: { icon: {} } }] },
      { type: "grid", name: "", schema: [N("color"), B("full_width")] }
    ];
    switch (t) {
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
              M("variant_entity")
            ]
          },
          B("show_variant_switch"),
          { type: "grid", name: "", schema: [N("stage_ratio"), Y("stage_width", 200, 800)] },
          {
            type: "expandable",
            name: "images",
            title: At.images,
            schema: [
              // HA's image selector: native "upload picture" flow right in the
              // editor (stores via /api/image/upload), URL input as fallback
              { name: "dock", selector: { image: {} } },
              { name: "sailing", selector: { image: {} } },
              { name: "trailer", selector: { image: {} } },
              B("image_remove_black")
            ]
          },
          {
            type: "expandable",
            name: "gps",
            title: At.gps,
            schema: [
              y("speed"),
              y("heading"),
              M("location", ["device_tracker", "person", "zone"]),
              y("lat"),
              y("lon"),
              y("altitude"),
              N("speed_unit")
            ]
          }
        ];
      case "battery":
        return [
          ...e,
          y("soc"),
          { type: "grid", name: "", schema: [y("voltage"), y("current")] },
          { type: "grid", name: "", schema: [y("power"), y("temperature")] },
          y("time_remaining"),
          ...Et
        ];
      case "solar":
        return [
          ...e,
          y("power"),
          { type: "grid", name: "", schema: [y("yield_today"), M("state")] },
          { type: "grid", name: "", schema: [y("voltage"), y("current")] },
          ...Et
        ];
      case "weather":
        return [
          ...e,
          { type: "grid", name: "", schema: [y("wind_speed"), y("wind_bearing")] },
          { type: "grid", name: "", schema: [y("wind_gust"), y("precipitation")] },
          { type: "grid", name: "", schema: [y("temp_inside"), y("temp_outside")] },
          y("temp_water")
        ];
      case "forecast":
        return [
          ...e,
          M("weather", "weather"),
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "forecast_type",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "daily", label: "Täglich" },
                      { value: "hourly", label: "Stündlich" }
                    ]
                  }
                }
              },
              { name: "forecast_count", selector: { number: { min: 3, max: 12, mode: "box" } } }
            ]
          }
        ];
      case "radar":
        return [
          ...e,
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "provider",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "windy", label: "Windy" },
                      { value: "rainviewer", label: "RainViewer" }
                    ]
                  }
                }
              },
              { name: "zoom", selector: { number: { min: 4, max: 14, mode: "box" } } }
            ]
          },
          { type: "grid", name: "", schema: [Y("latitude", -90, 90), Y("longitude", -180, 180)] },
          N("url")
        ];
      case "fridge":
        return [
          ...e,
          M("switch", ["switch", "input_boolean"]),
          y("temperature"),
          { type: "grid", name: "", schema: [M("target", ["sensor", "number", "input_number"]), y("power")] }
        ];
      case "camera":
        return [
          ...e,
          M("camera", "camera"),
          { type: "grid", name: "", schema: [M("switch", ["switch", "input_boolean"]), B("ptz")] },
          { type: "grid", name: "", schema: [M("presets", "select"), N("aspect_ratio")] }
        ];
      case "grafana":
        return [
          ...e,
          N("url"),
          { type: "grid", name: "", schema: [Y("height", 150, 1200), B("auto_params")] },
          B("show_open")
        ];
      case "sensor":
      default:
        return [
          ...e,
          M("entity"),
          M("entity2"),
          { type: "grid", name: "", schema: [N("unit"), Y("precision", 0, 4)] },
          N("attribute"),
          ...Et
        ];
    }
  }
  // ---- section mutations ----
  _sections() {
    return (this._config?.sections ?? []).map((t) => ({ ...t }));
  }
  _commit(t) {
    this._emit({ ...this._config, sections: t });
  }
  _sectionChanged(t, e) {
    t.stopPropagation();
    const i = this._sections();
    i[e] = { ...i[e], ...t.detail.value }, this._commit(i);
  }
  _chipsChanged(t, e) {
    t.stopPropagation();
    const i = this._sections();
    i[e] = { ...i[e], chips: t.detail.value }, this._commit(i);
  }
  _controlsChanged(t, e) {
    t.stopPropagation();
    const i = this._sections();
    i[e] = { ...i[e], controls: t.detail.value }, this._commit(i);
  }
  _listChanged(t, e, i) {
    t.stopPropagation();
    const r = this._sections();
    r[e] = { ...r[e], [i]: t.detail.value }, this._commit(r);
  }
  _addSection(t) {
    const e = t.target.value;
    if (!e) return;
    t.target.value = "";
    const i = this._sections();
    i.push({ type: e }), this._expanded = i.length - 1, this._commit(i);
  }
  _removeSection(t) {
    const e = this._sections();
    e.splice(t, 1), this._expanded === t && (this._expanded = -1), this._commit(e);
  }
  _moveSection(t, e) {
    const i = this._sections(), r = t + e;
    r < 0 || r >= i.length || ([i[t], i[r]] = [i[r], i[t]], this._commit(i));
  }
  render() {
    if (!this.hass || !this._config) return d;
    const t = this._config.sections ?? [];
    return l`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._topSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="sec-title">Sektionen</div>
      <div class="sec-list">
        ${t.map((e, i) => this._renderSection(e, i))}
      </div>

      <div class="add-row">
        <select class="add-sel" @change=${this._addSection}>
          <option value="">+ Sektion hinzufügen …</option>
          ${Ge.map((e) => l`<option value=${e}>${Jt[e]}</option>`)}
        </select>
      </div>
    `;
  }
  _renderSection(t, e) {
    const i = e === this._expanded, r = P[t.type] ?? P.sensor, a = t.entity ?? t.soc ?? t.power ?? t.camera ?? t.switch ?? t.url ?? "", o = t.name ?? et(g(this.hass, a), "");
    return l`<div class="sec ${i ? "open" : ""}">
      <div class="sec-head" @click=${() => this._expanded = i ? -1 : e}>
        <ha-icon .icon=${t.icon ?? r.icon}></ha-icon>
        <span class="sec-name">${Jt[t.type] ?? t.type}</span>
        ${o ? l`<span class="sec-sub">${o}</span>` : d}
        <span class="sp"></span>
        <ha-icon-button @click=${(s) => {
      s.stopPropagation(), this._moveSection(e, -1);
    }}><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(s) => {
      s.stopPropagation(), this._moveSection(e, 1);
    }}><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(s) => {
      s.stopPropagation(), this._removeSection(e);
    }}><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${i ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${i ? l`<div class="sec-body">
            <ha-form
              .hass=${this.hass}
              .data=${t}
              .schema=${this._sectionSchema(t.type)}
              .computeLabel=${this._label}
              @value-changed=${(s) => this._sectionChanged(s, e)}
            ></ha-form>
            ${t.type === "battery" ? l`
                  <div class="sub-title">Batterien (mehrere)</div>
                  <div class="sub-sub">Leer lassen = die einzelnen Felder oben nutzen.</div>
                  <boat-items-editor
                    .hass=${this.hass}
                    .items=${t.banks ?? []}
                    .fields=${hi}
                    addLabel="Batterie hinzufügen"
                    @value-changed=${(s) => this._listChanged(s, e, "banks")}
                  ></boat-items-editor>
                ` : d}
            ${t.type === "solar" ? l`
                  <div class="sub-title">Solarmodule (mehrere)</div>
                  <div class="sub-sub">Leer lassen = die einzelnen Felder oben nutzen.</div>
                  <boat-items-editor
                    .hass=${this.hass}
                    .items=${t.arrays ?? []}
                    .fields=${pi}
                    addLabel="Modul hinzufügen"
                    @value-changed=${(s) => this._listChanged(s, e, "arrays")}
                  ></boat-items-editor>
                ` : d}
            ${t.type === "boat" ? l`
                  <div class="sub-title">Chips auf dem Boot</div>
                  <div class="sub-sub">Punkte aufs Boot ziehen · Tabs = Positionen je Ansicht</div>
                  <boat-chips-editor
                    .hass=${this.hass}
                    .chips=${t.chips ?? []}
                    .images=${t.images}
                    .ratio=${t.stage_ratio}
                    @value-changed=${(s) => this._chipsChanged(s, e)}
                  ></boat-chips-editor>
                  <div class="sub-title">Aktoren-Reihe</div>
                  <boat-items-editor
                    .hass=${this.hass}
                    .items=${t.controls ?? []}
                    .fields=${di}
                    addLabel="Aktor hinzufügen"
                    @value-changed=${(s) => this._controlsChanged(s, e)}
                  ></boat-items-editor>
                ` : d}
          </div>` : d}
    </div>`;
  }
};
it.styles = _t`
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
$t([
  T({ attribute: !1 })
], it.prototype, "hass", 2);
$t([
  S()
], it.prototype, "_config", 2);
$t([
  S()
], it.prototype, "_expanded", 2);
it = $t([
  xt("boat-card-editor")
], it);
const di = [
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
], hi = [
  { name: "name", selector: { text: {} } },
  { name: "soc", selector: { entity: { domain: "sensor" } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "voltage", selector: { entity: { domain: "sensor" } } },
      { name: "current", selector: { entity: { domain: "sensor" } } }
    ]
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "power", selector: { entity: { domain: "sensor" } } },
      { name: "temperature", selector: { entity: { domain: "sensor" } } }
    ]
  },
  { name: "time_remaining", selector: { entity: { domain: "sensor" } } }
], pi = [
  { name: "name", selector: { text: {} } },
  { name: "power", selector: { entity: { domain: "sensor" } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "yield_today", selector: { entity: { domain: "sensor" } } },
      { name: "state", selector: { entity: {} } }
    ]
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "voltage", selector: { entity: { domain: "sensor" } } },
      { name: "current", selector: { entity: { domain: "sensor" } } }
    ]
  }
];
var ui = Object.defineProperty, mi = Object.getOwnPropertyDescriptor, F = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? mi(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (a = (r ? s(e, i, a) : s(a)) || a);
  return r && a && ui(e, i, a), a;
};
const gi = ["left", "right", "up", "down", "zoom_in", "zoom_out"], fi = 2e4, bi = 5 * 6e4, Ct = [
  { key: "day", labelKey: "range_day", kind: "hour", count: 24 },
  { key: "week", labelKey: "range_week", kind: "day", count: 7 },
  { key: "month", labelKey: "range_month", kind: "day", count: 30 }
];
let z = class extends j {
  constructor() {
    super(...arguments), this._variantOverride = {}, this._history = {}, this._popup = null, this._popupRange = "week", this._tileRanges = {}, this._forecasts = {}, this._fcRanges = {}, this._fcFetching = /* @__PURE__ */ new Set(), this._fcTime = {}, this._cfgSig = "", this._stateSig = "", this._lastFetch = 0, this._fetching = !1;
  }
  setConfig(t) {
    if (!t) throw new Error("Invalid configuration");
    if (!Array.isArray(t.sections))
      throw new Error('boat-card: "sections" must be a list');
    this._config = t, this._variantOverride = {}, this._cfgSig = "";
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
      card_style: "default",
      sections: [
        {
          type: "boat",
          variant: "dock",
          show_variant_switch: !0,
          chips: [
            { entity: "sensor.solar_power", icon: "mdi:solar-power", positions: { dock: { x: 58, y: 26, dot: "left" } } },
            { entity: "sensor.battery_soc", icon: "mdi:battery", positions: { dock: { x: 40, y: 66, dot: "right" } } }
          ]
        },
        { type: "battery", soc: "sensor.battery_soc", voltage: "sensor.battery_voltage" },
        { type: "solar", power: "sensor.solar_power", yield_today: "sensor.solar_yield_today" },
        { type: "fridge", switch: "switch.fridge", temperature: "sensor.fridge_temperature" }
      ]
    };
  }
  // ==================== history lifecycle ====================
  updated(t) {
    super.updated(t), (t.has("hass") || t.has("_config")) && this._maybeFetch(), (t.has("hass") || t.has("_config") || t.has("_fcRanges")) && this._maybeFetchForecasts();
  }
  _fcType(t, e) {
    return this._fcRanges[e] ?? t.forecast_type ?? "daily";
  }
  _maybeFetchForecasts() {
    !this.hass || !this._config || this._config.sections.forEach((t, e) => {
      if (t.type !== "forecast" || !t.weather) return;
      const i = this._fcType(t, e), r = `${t.weather}|${i}`;
      this._fcTime[r] && Date.now() - this._fcTime[r] < 15 * 6e4 || this._fcFetching.has(r) || (this._fcFetching.add(r), Je(this.hass, t.weather, i).then((o) => {
        this._fcTime[r] = Date.now(), this._forecasts = { ...this._forecasts, [r]: o };
      }).catch(() => {
      }).finally(() => this._fcFetching.delete(r)));
    });
  }
  _sectionSeries(t) {
    switch (t.type) {
      case "sensor": {
        const e = [];
        return t.entities?.length && e.push(...t.entities.map((i) => typeof i == "string" ? i : i.entity)), t.entity && e.push(t.entity), t.entity2 && e.push(t.entity2), e;
      }
      case "battery":
        return t.banks?.length ? t.banks.map((e) => e.soc).filter((e) => !!e) : t.soc ? [t.soc] : [];
      case "solar":
        return t.arrays?.length ? t.arrays.map((e) => e.power).filter((e) => !!e) : t.power ? [t.power] : [];
      default:
        return [];
    }
  }
  _watchedEntities() {
    const t = /* @__PURE__ */ new Set();
    for (const e of this._config?.sections ?? [])
      if (e.graph !== "none")
        for (const i of this._sectionSeries(e)) i && t.add(i);
    return [...t];
  }
  _maybeFetch() {
    if (!this.hass || !this._config || this._fetching) return;
    const t = this._watchedEntities();
    if (!t.length) return;
    const e = Math.max(
      31,
      ...this._config.sections.map((s) => s.days ?? 7)
    ), i = `${e}|${t.join(",")}`, r = t.map((s) => this.hass.states[s]?.last_updated ?? "").join("|"), a = Date.now();
    (i !== this._cfgSig || a - this._lastFetch > bi || r !== this._stateSig && a - this._lastFetch > fi) && (this._fetching = !0, this._cfgSig = i, this._stateSig = r, ti(this.hass, t, e).then((s) => {
      this._history = s, this._lastFetch = Date.now();
    }).catch((s) => console.warn("boat-card: history fetch failed", s)).finally(() => {
      this._fetching = !1;
    }));
  }
  _buckets(t, e, i, r) {
    if (!t) return [];
    const a = this._history[t] ?? [];
    return e === "hour" ? ii(a, i, r) : ei(a, i, r);
  }
  // ==================== helpers ====================
  _accent(t) {
    const e = P[t.type] ?? P.sensor;
    return bt(t.color) ?? e.color;
  }
  _icon(t) {
    return t.icon ?? (P[t.type] ?? P.sensor).icon;
  }
  _name(t) {
    const e = P[t.type] ?? P.sensor;
    return t.name ?? u(this.hass, e.nameKey);
  }
  _isFull(t) {
    return t.full_width ?? ["boat", "camera", "grafana"].includes(t.type);
  }
  _graph(t) {
    return t.graph ?? P[t.type]?.graph ?? "none";
  }
  _trendMode(t) {
    return t.trend ?? P[t.type]?.trend ?? "none";
  }
  _agg(t) {
    return t.aggregate ?? P[t.type]?.aggregate ?? "mean";
  }
  render() {
    if (!this.hass || !this._config) return d;
    const t = this._config, e = [
      "cardroot",
      Vt(t.card_style),
      t.tiles === !1 ? "flat" : "tiles",
      t.flush ? "flush" : ""
    ].join(" "), i = l`
      ${t.title ? l`<div class="header">
            <div class="title">${t.title}</div>
            ${t.subtitle ? l`<div class="subtitle">${t.subtitle}</div>` : d}
          </div>` : d}
      <div class="metrics ${t.layout === "carousel" ? "carousel" : ""}" style="--bc-columns:${t.columns ?? 1}">
        ${(t.sections ?? []).map((r, a) => this._renderSection(r, a))}
      </div>
    `;
    return l`
      ${t.background === !1 ? l`<div class="${e} nobg">${i}</div>` : l`<ha-card class=${e}>${i}</ha-card>`}
      ${this._renderPopup()}
    `;
  }
  _renderSection(t, e) {
    const i = this._isFull(t) ? "full" : "", r = this._accent(t);
    let a;
    switch (t.type) {
      case "boat":
        a = this._renderBoat(t, e);
        break;
      case "battery":
        a = this._renderBattery(t, e);
        break;
      case "solar":
        a = this._renderSolar(t, e);
        break;
      case "weather":
        a = this._renderWeather(t);
        break;
      case "forecast":
        a = this._renderForecastTile(t, e);
        break;
      case "radar":
        a = this._renderRadar(t);
        break;
      case "fridge":
        a = this._renderFridge(t);
        break;
      case "camera":
        a = this._renderCamera(t);
        break;
      case "grafana":
        a = this._renderGrafana(t);
        break;
      case "sensor":
        a = this._renderSensor(t, e);
        break;
      default:
        a = d;
    }
    return l`<div class="metric ${i}" style="--bc-accent:${r}">${a}</div>`;
  }
  _tileHead(t, e) {
    return l`<div class="head">
      <div class="iconchip"><ha-icon .icon=${this._icon(t)}></ha-icon></div>
      <div class="name">${this._name(t)}</div>
      ${e ?? d}
    </div>`;
  }
  // ==================== value-tile building blocks ====================
  _trendEl(t, e) {
    const i = this._trendMode(e);
    if (i === "none" || !t) return d;
    const r = e.days ?? 7, a = qt(ut(this._buckets(t, "day", r, this._agg(e))));
    if (!Number.isFinite(a) || Math.abs(a) < 1e-9) return d;
    const o = a > 0, s = i === "up_good" ? o : i === "down_good" ? !o : null;
    return l`<span class="trend ${s === null ? "flat" : s ? "up" : "down"}">
      <ha-icon .icon=${o ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right"}></ha-icon>
      ${O(this.hass, Math.abs(a), e.precision ?? 1)}
    </span>`;
  }
  _miniChart(t, e, i) {
    const r = this._graph(i);
    if (r === "none") return d;
    const a = i.days ?? 7, o = this._agg(i);
    if (r === "bar")
      return Xt(this._buckets(t[0], "day", a, o), e, void 0, { h: 56 });
    if (r === "progress") return d;
    const s = t.filter(Boolean).map((c, n) => ({
      values: ut(this._buckets(c, "day", a, o)),
      color: n === 0 ? e : "var(--secondary-text-color)"
    }));
    return Yt(s, { h: 56 });
  }
  _handleTap(t, e, i) {
    const r = t.tap_action ?? "popup";
    if (r !== "none") {
      if (r === "toggle" && i) return at(this.hass, i);
      if (r === "link" && t.link) {
        /^https?:/.test(t.link) ? window.open(t.link, "_blank") : i && V(this, i);
        return;
      }
      if (r === "more-info") {
        i && V(this, i);
        return;
      }
      this._popupRange = "week", this._popup = e;
    }
  }
  // ==================== BATTERY / SOLAR / SENSOR (value tiles) ====================
  _kvRow(t, e) {
    const i = g(this.hass, t);
    return !t || C(i) ? d : l`<div class="kv"><span>${e}</span><b>${k(this.hass, i)}</b></div>`;
  }
  _socColor(t) {
    return Number.isFinite(t) ? t >= 50 ? "var(--bc-battery)" : t >= 20 ? "var(--bc-solar)" : "var(--bc-danger)" : "var(--secondary-text-color)";
  }
  _valueTile(t, e, i, r, a, o, s) {
    const c = g(this.hass, i), n = (t.tap_action ?? "popup") !== "none";
    return l`<div
      class="tile-inner ${n ? "clickable" : ""}"
      @click=${() => this._handleTap(t, e, i)}
    >
      ${this._tileHead(
      t,
      c ? l`<div class="time">${this._trendEl(i, t)}</div>` : void 0
    )}
      <div class="body">
        <div class="info">${r}${a}</div>
        <div class="chartcell">${this._miniChart(o, s, t)}</div>
      </div>
    </div>`;
  }
  _bankBlock(t, e) {
    const i = g(this.hass, t.soc), r = D(i), a = this._socColor(r);
    return l`<div class="bank">
      <div class="bank-head">
        <span class="bank-name">${t.name ?? `#${e + 1}`}</span>
        <span class="bank-val" style="color:${a}"
          >${k(this.hass, i, { unit: "%", precision: 0, unavailable: "—" })}</span
        >
      </div>
      <div class="progress"><span style="width:${Math.max(0, Math.min(100, r || 0))}%;--bar-color:${a}"></span></div>
      <div class="kvs">
        ${this._kvRow(t.voltage, u(this.hass, "voltage"))}
        ${this._kvRow(t.current, u(this.hass, "current"))}
        ${this._kvRow(t.power, u(this.hass, "power_now"))}
        ${this._kvRow(t.temperature, u(this.hass, "temperature"))}
        ${this._kvRow(t.time_remaining, "⌛")}
      </div>
    </div>`;
  }
  _renderBattery(t, e) {
    if (t.banks?.length) {
      const c = l`<div class="banks">
        ${t.banks.map((n, h) => this._bankBlock(n, h))}
      </div>`;
      return this._valueTile(t, e, t.banks[0]?.soc, c, d, this._sectionSeries(t), this._accent(t));
    }
    const i = g(this.hass, t.soc), r = D(i), a = this._socColor(r), o = i ? l`<div class="value" style="color:${a}">${k(this.hass, i, { unit: "%", precision: 0 })}</div>
          <div class="progress"><span style="width:${Math.max(0, Math.min(100, r || 0))}%;--bar-color:${a}"></span></div>` : l`<div class="missing">${u(this.hass, "unavailable")}</div>`, s = l`<div class="kvs">
      ${this._kvRow(t.voltage, u(this.hass, "voltage"))}
      ${this._kvRow(t.current, u(this.hass, "current"))}
      ${this._kvRow(t.power, u(this.hass, "power_now"))}
      ${this._kvRow(t.temperature, u(this.hass, "temperature"))}
      ${this._kvRow(t.time_remaining, "⌛")}
    </div>`;
    return this._valueTile(t, e, t.soc, o, s, [t.soc ?? ""], a);
  }
  _arrayBlock(t, e) {
    const i = g(this.hass, t.power);
    return l`<div class="bank">
      <div class="bank-head">
        <span class="bank-name">${t.name ?? `#${e + 1}`}</span>
        <span class="bank-val" style="color:var(--bc-solar)"
          >${k(this.hass, i, { unit: "W", precision: 0, unavailable: "—" })}</span
        >
      </div>
      <div class="kvs">
        ${this._kvRow(t.yield_today, u(this.hass, "yield_today"))}
        ${this._kvRow(t.voltage, u(this.hass, "voltage"))}
        ${this._kvRow(t.current, u(this.hass, "current"))}
        ${this._kvRow(t.state, u(this.hass, "state"))}
      </div>
    </div>`;
  }
  _renderSolar(t, e) {
    if (t.arrays?.length) {
      const o = l`<div class="banks">
        ${t.arrays.map((c, n) => this._arrayBlock(c, n))}
      </div>`, s = { ...t, graph: t.graph ?? "line" };
      return this._valueTile(s, e, t.arrays[0]?.power, o, d, this._sectionSeries(t), "var(--bc-solar)");
    }
    const i = g(this.hass, t.power), r = i ? l`<div class="value" style="color:var(--bc-solar)">${k(this.hass, i, { unit: "W", precision: 0 })}</div>` : l`<div class="missing">${u(this.hass, "unavailable")}</div>`, a = l`<div class="kvs">
      ${this._kvRow(t.yield_today, u(this.hass, "yield_today"))}
      ${this._kvRow(t.voltage, u(this.hass, "voltage"))}
      ${this._kvRow(t.current, u(this.hass, "current"))}
      ${this._kvRow(t.state, u(this.hass, "state"))}
    </div>`;
    return this._valueTile(t, e, t.power, r, a, [t.power ?? ""], "var(--bc-solar)");
  }
  // ==================== WEATHER ====================
  _wxChip(t, e, i) {
    return l`<div class="wx">
      <div class="wx-label">${t}</div>
      <div class="wx-value">${e}</div>
      ${i ? l`<div class="wx-sub">${i}</div>` : d}
    </div>`;
  }
  _renderWeather(t) {
    const e = [], i = g(this.hass, t.wind_speed);
    if (i && !C(i)) {
      const a = D(g(this.hass, t.wind_bearing)), o = g(this.hass, t.wind_gust), s = Number.isFinite(a) ? l`<ha-icon icon="mdi:navigation" style="transform:rotate(${(a + 180) % 360}deg)"></ha-icon>` : d, c = Number.isFinite(a) ? Qt(a) : "";
      e.push(
        this._wxChip(
          u(this.hass, "wind"),
          l`${s}${k(this.hass, i, { precision: 0 })}${c ? ` ${c}` : ""}`,
          o && !C(o) ? `${u(this.hass, "gusts")} ${k(this.hass, o, { precision: 0 })}` : void 0
        )
      );
    }
    const r = (a, o, s = 1) => {
      const c = g(this.hass, a);
      !c || C(c) || e.push(this._wxChip(u(this.hass, o), k(this.hass, c, { precision: s })));
    };
    return r(t.precipitation, "precipitation"), r(t.temp_inside, "inside"), r(t.temp_outside, "outside"), r(t.temp_water, "water_temp"), l`
      ${this._tileHead(t)}
      ${e.length ? l`<div class="wx-grid">${e}</div>` : l`<div class="missing">${u(this.hass, "unavailable")}</div>`}
    `;
  }
  // ==================== FORECAST ====================
  _renderForecastTile(t, e) {
    if (!t.weather) return l`${this._tileHead(t)}<div class="missing">${u(this.hass, "no_weather")}</div>`;
    const i = this._fcType(t, e), r = this._forecasts[`${t.weather}|${i}`] ?? [], a = t.forecast_count ?? (i === "hourly" ? 6 : 7), o = r.slice(0, a), s = this.hass.locale?.language ?? this.hass.language ?? "de", c = (n, h) => {
      const m = new Date(n.datetime);
      return i === "hourly" ? h ? u(this.hass, "now") : `${m.getHours()}` : m.toLocaleDateString(s, { weekday: "short" });
    };
    return l`
      ${this._tileHead(
      t,
      l`<div class="periods">
          ${["hourly", "daily"].map(
        (n) => l`<button
              class="period ${i === n ? "active" : ""}"
              @click=${(h) => {
          h.stopPropagation(), this._fcRanges = { ...this._fcRanges, [e]: n };
        }}
            >
              ${u(this.hass, n === "hourly" ? "forecast_hourly" : "forecast_daily")}
            </button>`
      )}
        </div>`
    )}
      ${o.length ? l`<div class="fc-strip">
            ${o.map((n, h) => {
      const m = n.is_daytime ?? !0, p = n.precipitation_probability, _ = typeof p == "number" && p >= 5 ? l`<span class="fc-pop">${O(this.hass, p, 0)}%</span>` : typeof n.precipitation == "number" && n.precipitation >= 0.2 ? l`<span class="fc-pop">${O(this.hass, n.precipitation, 1)}</span>` : l`<span class="fc-pop empty"></span>`;
      return l`<div class="fc-step">
                <span class="fc-when">${c(n, h === 0)}</span>
                <ha-icon class="fc-ico" .icon=${Xe(n.condition, m)}></ha-icon>
                ${_}
                <span class="fc-temp">
                  ${typeof n.temperature == "number" ? l`${O(this.hass, n.temperature, 0)}°` : "–"}
                  ${i === "daily" && typeof n.templow == "number" ? l`<span class="fc-lo">${O(this.hass, n.templow, 0)}°</span>` : d}
                </span>
              </div>`;
    })}
          </div>` : l`<div class="missing">…</div>`}
    `;
  }
  // ==================== RADAR ====================
  /** iframe URL for the embedded live radar map (from Weatherglass). */
  _radarUrl(t) {
    if (t.url) return t.url;
    const e = t.latitude ?? this.hass.config?.latitude ?? 51.163, i = t.longitude ?? this.hass.config?.longitude ?? 10.447, r = t.zoom ?? 8;
    return t.provider === "rainviewer" ? `https://www.rainviewer.com/map.html?loc=${e},${i},${r}&oCS=1&c=3&o=83&lm=0&layer=radar&sm=1&sn=1&hu=0` : `https://embed.windy.com/embed2.html?lat=${e}&lon=${i}&detailLat=${e}&detailLon=${i}&zoom=${r}&level=surface&overlay=radar&product=radar&menu=&message=&marker=true&calendar=now&type=map&location=coordinates&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  }
  _renderRadar(t) {
    return l`
      ${this._tileHead(t)}
      <div class="radarframe">
        <iframe src=${this._radarUrl(t)} title=${this._name(t)} loading="lazy" allow="fullscreen"></iframe>
      </div>
    `;
  }
  _renderSensor(t, e) {
    const i = t.entity ?? (t.entities?.length ? typeof t.entities[0] == "string" ? t.entities[0] : t.entities[0].entity : void 0), r = g(this.hass, i), a = l`<div class="value">${k(this.hass, r, { precision: t.precision, unit: t.unit, attribute: t.attribute, unavailable: "—" })}</div>`, o = (t.secondary ?? []).map((c) => g(this.hass, c)).filter((c) => c && !C(c)).map((c) => k(this.hass, c)), s = o.length ? l`<div class="secondary-vals">${o.join(" · ")}</div>` : d;
    return this._valueTile(t, e, i, a, s, this._sectionSeries(t), this._accent(t));
  }
  // ==================== BOAT HERO ====================
  _variant(t, e) {
    if (this._variantOverride[e]) return this._variantOverride[e];
    if (t.variant_entity) {
      const i = g(this.hass, t.variant_entity);
      if (i) {
        const r = t.variant_map?.[i.state];
        if (r) return r;
        if (zt.includes(i.state)) return i.state;
      }
    }
    return t.variant ?? "dock";
  }
  /** "5:7" -> "5 / 7" (safe against junk input) */
  _stageRatio(t) {
    const e = /^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/.exec(t.stage_ratio ?? "");
    return e ? `${e[1]} / ${e[2]}` : "5 / 7";
  }
  _renderBoat(t, e) {
    const i = this._variant(t, e), r = t.images?.[i];
    return l`
      <div
        class="stage"
        style="--bc-stage-ar:${this._stageRatio(t)};--bc-stage-w:${t.stage_width ?? 400}px"
      >
        ${r ? l`<img class="scene ${t.image_remove_black ? "rm-black" : ""}" src=${r} alt=${i} />` : l`<div class="scene">${ce(i)}</div>`}
        ${(t.chips ?? []).map((a) => this._renderChip(a, i))}
        ${t.show_variant_switch !== !1 ? this._renderVariantSwitch(i, e) : d}
      </div>
      ${this._renderGps(t.gps)} ${this._renderControls(t.controls)}
    `;
  }
  _renderVariantSwitch(t, e) {
    const i = { dock: "mdi:dock-top", sailing: "mdi:sail-boat", trailer: "mdi:truck-trailer" };
    return l`<div class="variant-switch">
      ${zt.map(
      (r) => l`<button class=${r === t ? "on" : ""} title=${u(this.hass, r)} @click=${() => this._variantOverride = { ...this._variantOverride, [e]: r }}>
          <ha-icon .icon=${i[r]}></ha-icon>
        </button>`
    )}
    </div>`;
  }
  _chipPos(t, e) {
    const i = t.positions?.[e];
    if (i) return i.hidden ? void 0 : i;
    if (t.x !== void 0 && t.y !== void 0) return { x: t.x, y: t.y, dot: t.dot };
  }
  _tapChip(t) {
    const e = t.tap_action ?? "more-info";
    if (e !== "none") {
      if (e === "toggle") return at(this.hass, t.entity);
      if (e === "link" && t.link) {
        /^https?:/.test(t.link) ? window.open(t.link, "_blank") : V(this, t.entity);
        return;
      }
      V(this, t.entity);
    }
  }
  _renderChip(t, e) {
    const i = this._chipPos(t, e), r = g(this.hass, t.entity);
    if (!i || !r) return d;
    const a = i.dot ?? (i.x >= 50 ? "left" : "right"), o = bt(t.color) ?? "var(--bc-accent)";
    let s;
    if (t.entity2) {
      const n = g(this.hass, t.entity2);
      s = `${k(this.hass, r, { precision: t.precision, unit: "" })} / ${k(this.hass, n, { precision: t.precision })}`;
    } else
      s = k(this.hass, r, { precision: t.precision, unit: t.unit, attribute: t.attribute });
    const c = t.name ?? et(r, "");
    return l`<div class="anchor dot-${a}" style="left:${i.x}%;top:${i.y}%;--ac:${o}" @click=${() => this._tapChip(t)}>
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        ${t.icon ? l`<ha-icon class="ci" .icon=${t.icon}></ha-icon>` : d}
        <div class="anchor-txt">
          ${c ? l`<span class="anchor-name">${c}</span>` : d}
          <span class="anchor-val">${s}</span>
        </div>
      </div>
    </div>`;
  }
  _renderGps(t) {
    if (!t) return d;
    const e = [], i = g(this.hass, t.speed);
    i && !C(i) && e.push(l`<span class="gps-item"><ha-icon icon="mdi:speedometer"></ha-icon>${k(this.hass, i, { unit: t.speed_unit })}</span>`);
    const r = g(this.hass, t.heading);
    if (r && !C(r)) {
      const s = D(r);
      e.push(l`<span class="gps-item"><ha-icon icon="mdi:compass-outline"></ha-icon>${Qt(s)} ${Number.isFinite(s) ? l`${O(this.hass, s, 0)}°` : ""}</span>`);
    }
    const a = this._coords(t);
    a && e.push(l`<span class="gps-item"><ha-icon icon="mdi:map-marker"></ha-icon>${a}</span>`);
    const o = g(this.hass, t.altitude);
    return o && !C(o) && e.push(l`<span class="gps-item"><ha-icon icon="mdi:altimeter"></ha-icon>${k(this.hass, o, { precision: 0 })}</span>`), e.length ? l`<div class="gps-bar">${e}</div>` : d;
  }
  _coords(t) {
    let e = NaN, i = NaN;
    if (t.location) {
      const r = g(this.hass, t.location);
      e = D(r, "latitude"), i = D(r, "longitude");
    }
    return !Number.isFinite(e) && t.lat && (e = D(g(this.hass, t.lat))), !Number.isFinite(i) && t.lon && (i = D(g(this.hass, t.lon))), !Number.isFinite(e) || !Number.isFinite(i) ? "" : `${e.toFixed(4)}, ${i.toFixed(4)}`;
  }
  _renderControls(t) {
    return t?.length ? l`<div class="controls">
      ${t.map((e) => {
      const i = typeof e == "string" ? { entity: e } : e, r = g(this.hass, i.entity), a = pt(r), o = a ? i.icon_on ?? i.icon : i.icon;
      return l`<button class="ctl ${a ? "on" : ""}" @click=${() => at(this.hass, i.entity)}>
          <ha-icon .icon=${o ?? "mdi:power"}></ha-icon>
          <span class="cl">${i.name ?? et(r, "")}</span>
          <span class="cl">${a ? u(this.hass, "on") : u(this.hass, "off")}</span>
        </button>`;
    })}
    </div>` : d;
  }
  // ==================== FRIDGE ====================
  _renderFridge(t) {
    const e = g(this.hass, t.switch), i = pt(e), r = g(this.hass, t.temperature);
    return l`
      ${this._tileHead(t)}
      <div class="fridge">
        ${t.switch ? l`<button class="power ${i ? "on" : ""}" @click=${() => at(this.hass, t.switch)}>
              <ha-icon icon="mdi:fridge-outline"></ha-icon>
              <span>${i ? u(this.hass, "on") : u(this.hass, "off")}</span>
            </button>` : d}
        <div class="readouts">
          ${t.temperature ? l`<div class="ro" @click=${() => V(this, t.temperature)}>
                <span class="l">${u(this.hass, "fridge_temp")}</span>
                <span class="v">${k(this.hass, r, { precision: 1 })}</span>
              </div>` : d}
          ${t.target && !C(g(this.hass, t.target)) ? l`<div class="ro"><span class="l">${u(this.hass, "target")}</span><span class="v">${k(this.hass, g(this.hass, t.target), { precision: 1 })}</span></div>` : d}
          ${t.power && !C(g(this.hass, t.power)) ? l`<div class="ro"><span class="l">${u(this.hass, "power_now")}</span><span class="v">${k(this.hass, g(this.hass, t.power))}</span></div>` : d}
        </div>
      </div>
    `;
  }
  // ==================== CAMERA ====================
  _ptzButtons(t) {
    var o;
    if (t.ptz_buttons) return t.ptz_buttons;
    const e = {};
    for (const s of Object.keys(this.hass.states)) {
      if (oe(s) !== "button") continue;
      const c = s.match(/^button\.(.+)_ptz_(left|right|up|down|zoom_in|zoom_out)$/);
      c && ((e[o = c[1]] ?? (e[o] = {}))[c[2]] = s);
    }
    const i = (t.camera ?? "").split(".")[1] ?? "";
    let r = "", a = -1;
    for (const s of Object.keys(e)) {
      const c = s.split("_"), n = i.split("_");
      let h = 0;
      for (; h < c.length && h < n.length && c[h] === n[h]; ) h++;
      h > a && (a = h, r = s);
    }
    return r ? e[r] : {};
  }
  _renderCamera(t) {
    const e = g(this.hass, t.camera), i = g(this.hass, t.switch), r = g(this.hass, t.presets), a = this._ptzButtons(t), o = t.ptz !== !1 && (t.ptz === !0 || gi.some((n) => a[n])), s = e?.attributes?.entity_picture, c = (n, h) => l`<button class="ptz-btn" ?disabled=${!a[n]} @click=${() => a[n] && this.hass.callService("button", "press", { entity_id: a[n] })}><ha-icon .icon=${h}></ha-icon></button>`;
    return l`
      ${this._tileHead(
      t,
      t.switch ? l`<button class="ptz-btn" style=${pt(i) ? "color:var(--bc-accent)" : ""} title=${u(this.hass, "camera_power")} @click=${() => at(this.hass, t.switch)}><ha-icon icon="mdi:power"></ha-icon></button>` : void 0
    )}
      <div class="cam-wrap" style="--ar:${(t.aspect_ratio ?? "16:9").replace(":", "/")}">
        ${t.switch && !pt(i) ? l`<div class="cam off"><ha-icon icon="mdi:cctv-off"></ha-icon><span>${u(this.hass, "off")}</span></div>` : l`<div class="cam" @click=${() => t.camera && V(this, t.camera)}>
              ${e ? l`<ha-camera-stream .hass=${this.hass} .stateObj=${e} muted></ha-camera-stream>` : d}
              ${!e && s ? l`<img src=${s} alt="camera" />` : d}
            </div>`}
      </div>
      ${r && !C(r) ? l`<div class="presets">
            <ha-icon icon="mdi:map-marker-radius"></ha-icon>
            <select @change=${(n) => this.hass.callService("select", "select_option", { entity_id: t.presets, option: n.target.value })}>
              ${(r.attributes.options ?? []).map((n) => l`<option ?selected=${n === r.state}>${n}</option>`)}
            </select>
          </div>` : d}
      ${o ? l`<div class="ptz">
            <div class="pad">
              <span></span>${c("up", "mdi:chevron-up")}<span></span>
              ${c("left", "mdi:chevron-left")}<ha-icon class="pad-center" icon="mdi:pan"></ha-icon>${c("right", "mdi:chevron-right")}
              <span></span>${c("down", "mdi:chevron-down")}<span></span>
            </div>
            <div class="zoom">${c("zoom_out", "mdi:magnify-minus-outline")}${c("zoom_in", "mdi:magnify-plus-outline")}</div>
          </div>` : d}
    `;
  }
  // ==================== GRAFANA ====================
  _grafanaUrl(t) {
    let e = t.url ?? "";
    if (t.auto_params === !1) return e;
    const i = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches, r = (a, o) => {
      new RegExp(`[?&]${a}(=|&|$)`).test(e) || (e += (e.includes("?") ? "&" : "?") + (o ? `${a}=${o}` : a));
    };
    return r("theme", i ? "dark" : "light"), r("kiosk"), e;
  }
  _renderGrafana(t) {
    return l`
      ${this._tileHead(
      t,
      t.show_open !== !1 && t.url ? l`<a class="g-open" href=${t.url} target="_blank" rel="noopener" title=${u(this.hass, "open_grafana")}><ha-icon icon="mdi:open-in-new"></ha-icon></a>` : void 0
    )}
      ${t.url ? l`<iframe class="frame" style="height:${t.height ?? 400}px" src=${this._grafanaUrl(t)} loading="lazy" referrerpolicy="no-referrer"></iframe>` : l`<div class="missing">${u(this.hass, "no_url")}</div>`}
    `;
  }
  // ==================== DETAIL POPUP ====================
  _popupSection() {
    return this._popup === null ? void 0 : this._config?.sections[this._popup];
  }
  _renderPopup() {
    const t = this._popupSection();
    if (!t) return d;
    const e = Ct.find((f) => f.key === this._popupRange) ?? Ct[1], i = this._sectionSeries(t)[0], r = t.type === "solar" ? "var(--bc-solar)" : this._accent(t), a = this._agg(t), o = this._buckets(i, e.kind, e.count, a), c = (this._graph(t) === "bar" ? "bar" : "line") === "bar" ? Xt(o, r, void 0, { w: 520, h: 150, yFmt: (f) => O(this.hass, f, 0) }) : Yt([{ values: ut(o), color: r }], { w: 520, h: 150, yFmt: (f) => O(this.hass, f, 0) }), n = o.filter(Number.isFinite), h = n.length ? Math.min(...n) : NaN, m = n.length ? Math.max(...n) : NaN, p = n.length ? n.reduce((f, I) => f + I, 0) / n.length : NaN, _ = qt(ut(o)), x = (f, I) => l`<div class="stat-tile"><div class="stat-label">${f}</div><div class="stat-value">${O(this.hass, I, t.precision ?? 1)}</div></div>`;
    return l`<div class="backdrop ${Vt(this._config?.card_style)}" @click=${() => this._popup = null}>
      <div class="dialog" @click=${(f) => f.stopPropagation()}>
        <div class="dialog-head">
          <div class="iconchip"><ha-icon .icon=${this._icon(t)}></ha-icon></div>
          <div class="dialog-title">${this._name(t)}</div>
          <button class="close" @click=${() => this._popup = null}><ha-icon icon="mdi:close"></ha-icon></button>
        </div>
        <div class="ranges">
          ${Ct.map(
      (f) => l`<button class="range ${f.key === this._popupRange ? "on" : ""}" @click=${() => this._popupRange = f.key}>${u(this.hass, f.labelKey)}</button>`
    )}
        </div>
        <div class="bigchart">${c}</div>
        <div class="stats">
          ${x(u(this.hass, "stat_min"), h)}
          ${x(u(this.hass, "stat_avg"), p)}
          ${x(u(this.hass, "stat_max"), m)}
          ${x(u(this.hass, "stat_trend"), _)}
        </div>
      </div>
    </div>`;
  }
};
z.styles = Ze;
F([
  T({ attribute: !1 })
], z.prototype, "hass", 2);
F([
  S()
], z.prototype, "_config", 2);
F([
  S()
], z.prototype, "_variantOverride", 2);
F([
  S()
], z.prototype, "_history", 2);
F([
  S()
], z.prototype, "_popup", 2);
F([
  S()
], z.prototype, "_popupRange", 2);
F([
  S()
], z.prototype, "_tileRanges", 2);
F([
  S()
], z.prototype, "_forecasts", 2);
F([
  S()
], z.prototype, "_fcRanges", 2);
z = F([
  xt("boat-card")
], z);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "boat-card",
  name: "Boat Card",
  description: "A fully configurable single card for a boat: a graphical boat hero with per-image chips plus configurable metric tiles (battery, solar, fridge, camera, Grafana, sensors) with mini charts, trends and a detail popup.",
  preview: !0,
  documentationURL: "https://github.com/BobMcGlobus/Boat-Card"
});
export {
  z as BoatCard
};
