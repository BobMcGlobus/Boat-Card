/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut = globalThis, Nt = ut.ShadowRoot && (ut.ShadyCSS === void 0 || ut.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zt = Symbol(), Ut = /* @__PURE__ */ new WeakMap();
let Jt = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== zt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Nt && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = Ut.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ut.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ue = (t) => new Jt(typeof t == "string" ? t : t + "", void 0, zt), vt = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, o, s) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new Jt(i, t, zt);
}, me = (t, e) => {
  if (Nt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), o = ut.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = i.cssText, t.appendChild(r);
  }
}, Dt = Nt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return ue(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ge, defineProperty: be, getOwnPropertyDescriptor: fe, getOwnPropertyNames: ve, getOwnPropertySymbols: _e, getPrototypeOf: xe } = Object, D = globalThis, Ht = D.trustedTypes, ye = Ht ? Ht.emptyScript : "", $e = D.reactiveElementPolyfillSupport, ot = (t, e) => t, mt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ye : null;
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
} }, Ot = (t, e) => !ge(t, e), Bt = { attribute: !0, type: String, converter: mt, reflect: !1, useDefault: !1, hasChanged: Ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), D.litPropertyMetadata ?? (D.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let V = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Bt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = Symbol(), o = this.getPropertyDescriptor(e, r, i);
      o !== void 0 && be(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: o, set: s } = fe(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: o, set(a) {
      const n = o?.call(this);
      s?.call(this, a), this.requestUpdate(e, n, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ot("elementProperties"))) return;
    const e = xe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ot("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ot("properties"))) {
      const i = this.properties, r = [...ve(i), ..._e(i)];
      for (const o of r) this.createProperty(o, i[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [r, o] of i) this.elementProperties.set(r, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const o = this._$Eu(i, r);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const o of r) i.unshift(Dt(o));
    } else e !== void 0 && i.push(Dt(e));
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
    return me(e, this.constructor.elementStyles), e;
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
    const r = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, r);
    if (o !== void 0 && r.reflect === !0) {
      const s = (r.converter?.toAttribute !== void 0 ? r.converter : mt).toAttribute(i, r.type);
      this._$Em = e, s == null ? this.removeAttribute(o) : this.setAttribute(o, s), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const r = this.constructor, o = r._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const s = r.getPropertyOptions(o), a = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : mt;
      this._$Em = o;
      const n = a.fromAttribute(i, s.type);
      this[o] = n ?? this._$Ej?.get(o) ?? n, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, o = !1, s) {
    if (e !== void 0) {
      const a = this.constructor;
      if (o === !1 && (s = this[e]), r ?? (r = a.getPropertyOptions(e)), !((r.hasChanged ?? Ot)(s, i) || r.useDefault && r.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: o, wrapped: s }, a) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? i ?? this[e]), s !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, s] of r) {
        const { wrapped: a } = s, n = this[o];
        a !== !0 || this._$AL.has(o) || n === void 0 || this.C(o, void 0, s, n);
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
V.elementStyles = [], V.shadowRootOptions = { mode: "open" }, V[ot("elementProperties")] = /* @__PURE__ */ new Map(), V[ot("finalized")] = /* @__PURE__ */ new Map(), $e?.({ ReactiveElement: V }), (D.reactiveElementVersions ?? (D.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = globalThis, Ft = (t) => t, gt = at.trustedTypes, jt = gt ? gt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, te = "$lit$", U = `lit$${Math.random().toFixed(9).slice(2)}$`, ee = "?" + U, we = `<${ee}>`, Q = document, nt = () => Q.createComment(""), ct = (t) => t === null || typeof t != "object" && typeof t != "function", Tt = Array.isArray, ke = (t) => Tt(t) || typeof t?.[Symbol.iterator] == "function", wt = `[ 	
\f\r]`, it = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, It = /-->/g, Kt = />/g, K = RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Gt = /'/g, Wt = /"/g, ie = /^(?:script|style|textarea|title)$/i, re = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), l = re(1), $ = re(2), X = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Qt = /* @__PURE__ */ new WeakMap(), W = Q.createTreeWalker(Q, 129);
function oe(t, e) {
  if (!Tt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return jt !== void 0 ? jt.createHTML(e) : e;
}
const Se = (t, e) => {
  const i = t.length - 1, r = [];
  let o, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = it;
  for (let n = 0; n < i; n++) {
    const c = t[n];
    let p, u, h = -1, _ = 0;
    for (; _ < c.length && (a.lastIndex = _, u = a.exec(c), u !== null); ) _ = a.lastIndex, a === it ? u[1] === "!--" ? a = It : u[1] !== void 0 ? a = Kt : u[2] !== void 0 ? (ie.test(u[2]) && (o = RegExp("</" + u[2], "g")), a = K) : u[3] !== void 0 && (a = K) : a === K ? u[0] === ">" ? (a = o ?? it, h = -1) : u[1] === void 0 ? h = -2 : (h = a.lastIndex - u[2].length, p = u[1], a = u[3] === void 0 ? K : u[3] === '"' ? Wt : Gt) : a === Wt || a === Gt ? a = K : a === It || a === Kt ? a = it : (a = K, o = void 0);
    const x = a === K && t[n + 1].startsWith("/>") ? " " : "";
    s += a === it ? c + we : h >= 0 ? (r.push(p), c.slice(0, h) + te + c.slice(h) + U + x) : c + U + (h === -2 ? n : x);
  }
  return [oe(t, s + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class lt {
  constructor({ strings: e, _$litType$: i }, r) {
    let o;
    this.parts = [];
    let s = 0, a = 0;
    const n = e.length - 1, c = this.parts, [p, u] = Se(e, i);
    if (this.el = lt.createElement(p, r), W.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = W.nextNode()) !== null && c.length < n; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(te)) {
          const _ = u[a++], x = o.getAttribute(h).split(U), m = /([.?@])?(.*)/.exec(_);
          c.push({ type: 1, index: s, name: m[2], strings: x, ctor: m[1] === "." ? Ee : m[1] === "?" ? Ce : m[1] === "@" ? Pe : _t }), o.removeAttribute(h);
        } else h.startsWith(U) && (c.push({ type: 6, index: s }), o.removeAttribute(h));
        if (ie.test(o.tagName)) {
          const h = o.textContent.split(U), _ = h.length - 1;
          if (_ > 0) {
            o.textContent = gt ? gt.emptyScript : "";
            for (let x = 0; x < _; x++) o.append(h[x], nt()), W.nextNode(), c.push({ type: 2, index: ++s });
            o.append(h[_], nt());
          }
        }
      } else if (o.nodeType === 8) if (o.data === ee) c.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(U, h + 1)) !== -1; ) c.push({ type: 7, index: s }), h += U.length - 1;
      }
      s++;
    }
  }
  static createElement(e, i) {
    const r = Q.createElement("template");
    return r.innerHTML = e, r;
  }
}
function J(t, e, i = t, r) {
  if (e === X) return e;
  let o = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const s = ct(e) ? void 0 : e._$litDirective$;
  return o?.constructor !== s && (o?._$AO?.(!1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = o : i._$Cl = o), o !== void 0 && (e = J(t, o._$AS(t, e.values), o, r)), e;
}
class Ae {
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
    const { el: { content: i }, parts: r } = this._$AD, o = (e?.creationScope ?? Q).importNode(i, !0);
    W.currentNode = o;
    let s = W.nextNode(), a = 0, n = 0, c = r[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let p;
        c.type === 2 ? p = new dt(s, s.nextSibling, this, e) : c.type === 1 ? p = new c.ctor(s, c.name, c.strings, this, e) : c.type === 6 && (p = new Me(s, this, e)), this._$AV.push(p), c = r[++n];
      }
      a !== c?.index && (s = W.nextNode(), a++);
    }
    return W.currentNode = Q, o;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class dt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, r, o) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    e = J(this, e, i), ct(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== X && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ke(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && ct(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Q.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: r } = e, o = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = lt.createElement(oe(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === o) this._$AH.p(i);
    else {
      const s = new Ae(o, this), a = s.u(this.options);
      s.p(i), this.T(a), this._$AH = s;
    }
  }
  _$AC(e) {
    let i = Qt.get(e.strings);
    return i === void 0 && Qt.set(e.strings, i = new lt(e)), i;
  }
  k(e) {
    Tt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, o = 0;
    for (const s of e) o === i.length ? i.push(r = new dt(this.O(nt()), this.O(nt()), this, this.options)) : r = i[o], r._$AI(s), o++;
    o < i.length && (this._$AR(r && r._$AB.nextSibling, o), i.length = o);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const r = Ft(e).nextSibling;
      Ft(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
let _t = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, o, s) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = i, this._$AM = o, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, i = this, r, o) {
    const s = this.strings;
    let a = !1;
    if (s === void 0) e = J(this, e, i, 0), a = !ct(e) || e !== this._$AH && e !== X, a && (this._$AH = e);
    else {
      const n = e;
      let c, p;
      for (e = s[0], c = 0; c < s.length - 1; c++) p = J(this, n[r + c], i, c), p === X && (p = this._$AH[c]), a || (a = !ct(p) || p !== this._$AH[c]), p === d ? e = d : e !== d && (e += (p ?? "") + s[c + 1]), this._$AH[c] = p;
    }
    a && !o && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class Ee extends _t {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ce extends _t {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Pe extends _t {
  constructor(e, i, r, o, s) {
    super(e, i, r, o, s), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = J(this, e, i, 0) ?? d) === X) return;
    const r = this._$AH, o = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== d && (r === d || o);
    o && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
    J(this, e);
  }
}
const Ne = at.litHtmlPolyfillSupport;
Ne?.(lt, dt), (at.litHtmlVersions ?? (at.litHtmlVersions = [])).push("3.3.3");
const ze = (t, e, i) => {
  const r = i?.renderBefore ?? e;
  let o = r._$litPart$;
  if (o === void 0) {
    const s = i?.renderBefore ?? null;
    r._$litPart$ = o = new dt(e.insertBefore(nt(), s), s, void 0, i ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis;
class H extends V {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ze(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return X;
  }
}
H._$litElement$ = !0, H.finalized = !0, st.litElementHydrateSupport?.({ LitElement: H });
const Oe = st.litElementPolyfillSupport;
Oe?.({ LitElement: H });
(st.litElementVersions ?? (st.litElementVersions = [])).push("4.2.2");
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
const Te = { attribute: !0, type: String, converter: mt, reflect: !1, hasChanged: Ot }, Re = (t = Te, e, i) => {
  const { kind: r, metadata: o } = i;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(i.name, t), r === "accessor") {
    const { name: a } = i;
    return { set(n) {
      const c = e.get.call(this);
      e.set.call(this, n), this.requestUpdate(a, c, t, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(a, void 0, t, n), n;
    } };
  }
  if (r === "setter") {
    const { name: a } = i;
    return function(n) {
      const c = this[a];
      e.call(this, n), this.requestUpdate(a, c, t, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function O(t) {
  return (e, i) => typeof i == "object" ? Re(t, e, i) : ((r, o, s) => {
    const a = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, r), a ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(t) {
  return O({ ...t, state: !0, attribute: !1 });
}
const Le = ["unavailable", "unknown", "none", ""];
function b(t, e) {
  if (!(!t || !e))
    return t.states[e];
}
function L(t) {
  return !t || Le.includes(String(t.state).toLowerCase());
}
function ht(t) {
  if (!t) return !1;
  const e = String(t.state).toLowerCase();
  return ["on", "open", "home", "active", "charging", "true", "playing"].includes(e);
}
function G(t, e) {
  if (!t) return NaN;
  const i = e ? t.attributes?.[e] : t.state;
  if (i == null) return NaN;
  const r = typeof i == "number" ? i : parseFloat(String(i).replace(",", "."));
  return Number.isFinite(r) ? r : NaN;
}
function Ue(t) {
  return t?.attributes?.unit_of_measurement ?? "";
}
function tt(t, e = "") {
  return t?.attributes?.friendly_name ?? e;
}
function ae(t) {
  return t.split(".")[0] ?? "";
}
function Z(t, e) {
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
function rt(t, e) {
  const i = ae(e), r = ["switch", "light", "fan", "input_boolean"].includes(i) ? i : "homeassistant";
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
function He(t) {
  return t?.locale?.language ?? t?.language ?? "de";
}
function Y(t, e, i) {
  if (!Number.isFinite(e)) return "–";
  const r = {};
  i !== void 0 ? (r.minimumFractionDigits = i, r.maximumFractionDigits = i) : r.maximumFractionDigits = 1;
  try {
    return new Intl.NumberFormat(He(t), r).format(e);
  } catch {
    return String(e);
  }
}
function Be(t, e) {
  return e ? ["%"].includes(e) ? `${t}${e}` : `${t} ${e}` : t;
}
function S(t, e, i = {}) {
  if (L(e)) return i.unavailable ?? "—";
  const r = G(e, i.attribute);
  if (Number.isFinite(r))
    return Be(Y(t, r, i.precision), i.unit ?? Ue(e));
  if (i.attribute && e) {
    const o = e.attributes?.[i.attribute];
    if (o != null) return String(o);
  }
  if (t.formatEntityState && e)
    try {
      return t.formatEntityState(e);
    } catch {
    }
  return e ? e.state : i.unavailable ?? "—";
}
function Fe(t, e = "de") {
  if (!Number.isFinite(t)) return "";
  const i = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"], r = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], o = Math.round((t % 360 + 360) % 360 / 45) % 8;
  return (e === "de" ? i : r)[o];
}
const je = {
  range_day: "Tag",
  range_week: "Woche",
  range_month: "Monat",
  stat_min: "Min",
  stat_avg: "Ø",
  stat_max: "Max",
  stat_trend: "Trend",
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
}, Ie = {
  range_day: "Day",
  range_week: "Week",
  range_month: "Month",
  stat_min: "Min",
  stat_avg: "Avg",
  stat_max: "Max",
  stat_trend: "Trend",
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
function Ke(t) {
  return (t?.locale?.language ?? t?.language ?? "de").toLowerCase().startsWith("de") ? "de" : "en";
}
function g(t, e) {
  return (Ke(t) === "de" ? je : Ie)[e] ?? e;
}
const Ge = [
  "default",
  "glass",
  "material",
  "bubble",
  "mirror"
], Pt = ["dock", "sailing", "trailer"], We = [
  "boat",
  "battery",
  "solar",
  "fridge",
  "camera",
  "grafana",
  "sensor"
];
function Zt(t) {
  return `s-${t && Ge.includes(t) ? t : "default"}`;
}
const Qe = vt`
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
`, Rt = () => $`
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
`, Lt = (t) => $`
  <line x1="212" y1="132" x2="212" y2="34" stroke="#e7e2d6" stroke-width="4"
        stroke-linecap="round" />
  ${t ? $`
        <path d="M208 40 Q150 90 176 150 L208 150 Z" fill="#f4f1ea" />
        <path d="M216 44 Q270 92 250 150 L216 150 Z" fill="#fbfaf6" />
        <path d="M208 40 Q150 90 176 150" fill="none" stroke="#d9d3c4" stroke-width="1.5" />` : $`
        <path d="M212 40 Q206 90 212 150" fill="none" stroke="#cfe0f5" stroke-width="10"
              stroke-linecap="round" opacity="0.9" />`}
`, se = (t) => $`
  <g opacity="0.7" stroke="#7fa8d8" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M60 200 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" />
    ${t ? $`<path d="M40 214 q16 -6 32 0 t32 0 t32 0 t32 0 t32 0 t32 0"
                    opacity="0.5" />` : d}
  </g>
`, Ze = () => $`
  ${se(!1)}
  <!-- pier -->
  <g>
    <path d="M300 196 L392 176 L392 190 L300 210 Z" fill="#b98c5a" />
    <path d="M300 196 L392 176 L392 179 L300 199 Z" fill="#caa06f" />
    <rect x="330" y="205" width="6" height="26" fill="#7c5a34" />
    <rect x="372" y="196" width="6" height="30" fill="#7c5a34" />
  </g>
  ${Rt()}
  ${Lt(!1)}
`, qe = () => $`
  ${se(!0)}
  ${Rt()}
  ${Lt(!0)}
  <!-- little wake -->
  <path d="M70 200 q-18 4 -30 -2" fill="none" stroke="#fff" stroke-width="3"
        stroke-linecap="round" opacity="0.55" />
`, Ve = () => $`
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
  ${Rt()}
  ${Lt(!1)}
`;
function ne(t) {
  const e = t === "sailing" ? qe() : t === "trailer" ? Ve() : Ze();
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
  fridge: { icon: "mdi:fridge-outline", color: "#2aa5c7", nameKey: "fridge" },
  camera: { icon: "mdi:cctv", color: "#6d8bff", nameKey: "camera" },
  grafana: { icon: "mdi:chart-areaspline", color: "#f46800", nameKey: "grafana" },
  sensor: { icon: "mdi:gauge", color: "#5b7cfa", nameKey: "sensor", graph: "line", trend: "neutral" }
};
async function Ye(t, e, i) {
  if (!e.length) return {};
  const r = /* @__PURE__ */ new Date(), o = /* @__PURE__ */ new Date();
  o.setHours(0, 0, 0, 0), o.setDate(o.getDate() - (i - 1));
  const s = await t.callWS({
    type: "history/history_during_period",
    start_time: o.toISOString(),
    end_time: r.toISOString(),
    entity_ids: e,
    minimal_response: !0,
    no_attributes: !0
  }), a = {};
  for (const n of e)
    a[n] = (s?.[n] ?? []).map((c) => ({ t: c.lu * 1e3, v: parseFloat(c.s) })).filter((c) => Number.isFinite(c.v));
  return a;
}
function Xe(t, e, i) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const o = r.getTime() - (e - 1) * 864e5, s = Array.from({ length: e }, () => []);
  for (const a of t) {
    const n = Math.floor((a.t - o) / 864e5);
    n >= 0 && n < e && s[n].push(a.v);
  }
  return s.map((a) => {
    if (!a.length) return NaN;
    switch (i) {
      case "min":
        return Math.min(...a);
      case "max":
        return Math.max(...a);
      case "sum":
        return a.reduce((n, c) => n + c, 0);
      case "last":
        return a[a.length - 1];
      default:
        return a.reduce((n, c) => n + c, 0) / a.length;
    }
  });
}
function Je(t, e, i) {
  const r = /* @__PURE__ */ new Date();
  r.setMinutes(0, 0, 0);
  const o = r.getTime() - (e - 1) * 36e5, s = Array.from({ length: e }, () => []);
  for (const a of t) {
    const n = Math.floor((a.t - o) / 36e5);
    n >= 0 && n < e && s[n].push(a.v);
  }
  return s.map((a) => {
    if (!a.length) return NaN;
    switch (i) {
      case "min":
        return Math.min(...a);
      case "max":
        return Math.max(...a);
      case "sum":
        return a.reduce((n, c) => n + c, 0);
      case "last":
        return a[a.length - 1];
      default:
        return a.reduce((n, c) => n + c, 0) / a.length;
    }
  });
}
function pt(t) {
  const e = [...t];
  let i = NaN;
  for (let o = 0; o < e.length; o++)
    Number.isFinite(e[o]) ? i = e[o] : e[o] = i;
  let r = NaN;
  for (let o = e.length - 1; o >= 0; o--)
    Number.isFinite(e[o]) ? r = e[o] : e[o] = r;
  return e;
}
function qt(t) {
  const e = t.filter(Number.isFinite);
  return e.length < 2 ? NaN : e[e.length - 1] - e[0];
}
const ce = 220, le = 60, M = 7, ft = "color-mix(in srgb, var(--primary-text-color) 14%, transparent)";
function de(t, e) {
  const i = t.yFmt ? Math.max(26, ...e.map((o) => t.yFmt(o).length * 5.6 + 10)) : M, r = t.xMarks?.some((o) => o.label) ? 15 : M;
  return { padL: i, padB: r };
}
function ti(t) {
  const e = t.filter(Number.isFinite), i = Math.min(...e), r = Math.max(...e), o = r - i || Math.abs(r) * 0.1 || 1;
  return { lo: i - o * 0.18, hi: r + o * 0.18 };
}
function Vt(t, e = {}) {
  const i = e.w ?? ce, r = e.h ?? le, o = e.dots ?? !0, s = t.filter((f) => f.values.some(Number.isFinite));
  if (!s.length) return d;
  const { lo: a, hi: n } = ti(s.flatMap((f) => f.values)), c = Math.max(...s.map((f) => f.values.length)), p = e.yFmt ? [n - (n - a) * 0.08, (a + n) / 2, a + (n - a) * 0.08] : [], { padL: u, padB: h } = de(e, p), _ = (f) => u + f * (i - u - M) / Math.max(c - 1, 1), x = (f) => r - h - (f - a) / (n - a) * (r - h - M), m = p.map(
    (f) => $`
      <line x1=${u} x2=${i - M} y1=${x(f)} y2=${x(f)}
        stroke=${ft} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${u - 5} y=${x(f)} text-anchor="end"
        dominant-baseline="middle">${e.yFmt(f)}</text>`
  ), j = (e.xMarks ?? []).map(
    (f) => $`
      ${f.line ? $`<line x1=${_(f.i)} x2=${_(f.i)} y1=${M} y2=${r - h}
              stroke=${ft} stroke-width="1"/>` : d}
      ${f.label ? $`<text class="axis" x=${_(f.i)} y=${r - 3} text-anchor="middle">${f.label}</text>` : d}`
  ), $t = s.map((f) => {
    const k = f.values.map((y, I) => ({ x: _(I), y: x(y), ok: Number.isFinite(y) })).filter((y) => y.ok);
    if (!k.length) return d;
    let v = `M ${k[0].x} ${k[0].y}`;
    for (let y = 1; y < k.length; y++) {
      const I = (k[y - 1].x + k[y].x) / 2;
      v += ` C ${I} ${k[y - 1].y}, ${I} ${k[y].y}, ${k[y].x} ${k[y].y}`;
    }
    return $`
      <path d=${v} fill="none" stroke=${f.color} stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round"/>
      ${o ? k.map(
      (y) => $`<circle cx=${y.x} cy=${y.y} r="3.1" fill="var(--bc-dot-fill)"
                stroke=${f.color} stroke-width="2"/>`
    ) : d}
    `;
  });
  return l`<svg class="chart" viewBox="0 0 ${i} ${r}" aria-hidden="true">
    ${m}${j}${$t}
  </svg>`;
}
function Yt(t, e, i, r = {}) {
  const o = r.w ?? ce, s = r.h ?? le;
  if (!t.some((v) => Number.isFinite(v) && v > 0)) return d;
  const a = t.map((v) => Number.isFinite(v) && v > 0 ? v : 0), n = Math.max(...a, 0) || 1, c = a.length, p = r.yFmt ? [n, n / 2] : [], { padL: u, padB: h } = de(r, p), _ = (o - u - M) / c, x = Math.min(_ * 0.55, 14), m = (v) => v / n * (s - h - M), j = p.map(
    (v) => $`
      <line x1=${u} x2=${o - M} y1=${s - h - m(v)} y2=${s - h - m(v)}
        stroke=${ft} stroke-width="1" stroke-dasharray="2 3"/>
      <text class="axis" x=${u - 5} y=${s - h - m(v)} text-anchor="end"
        dominant-baseline="middle">${r.yFmt(v)}</text>`
  ), $t = (r.xMarks ?? []).map((v) => {
    const y = u + v.i * _ + _ / 2;
    return $`
      ${v.line ? $`<line x1=${y} x2=${y} y1=${M} y2=${s - h}
              stroke=${ft} stroke-width="1"/>` : d}
      ${v.label ? $`<text class="axis" x=${y} y=${s - 3} text-anchor="middle">${v.label}</text>` : d}`;
  }), f = a.map((v, y) => {
    const I = Math.max(m(v), v > 0 ? 3 : 1.5), pe = u + y * _ + (_ - x) / 2;
    return $`<rect x=${pe} y=${s - h - I} width=${x} height=${I}
      rx=${Math.min(x / 2, 4)} fill=${e} opacity=${v > 0 ? 1 : 0.25}/>`;
  }), k = Number.isFinite(i) ? $`<line x1=${u} x2=${o - M} y1=${s - h - m(i)} y2=${s - h - m(i)}
        stroke=${e} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>` : d;
  return l`<svg class="chart" viewBox="0 0 ${o} ${s}" aria-hidden="true">
    ${j}${$t}${k}${f}
  </svg>`;
}
var ei = Object.defineProperty, ii = Object.getOwnPropertyDescriptor, A = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? ii(e, i) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (o = (r ? a(e, i, o) : a(o)) || o);
  return r && o && ei(e, i, o), o;
};
const kt = {
  dock: "Am Steg",
  sailing: "Segeln",
  trailer: "Anhänger"
}, ri = [
  "right",
  "left",
  "top",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
].map((t) => ({ value: t, label: t })), he = {
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
function Mt(t) {
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
let R = class extends H {
  constructor() {
    super(...arguments), this.chips = [], this._variant = "dock", this._expanded = -1, this._label = (t) => he[t?.name] ?? t?.name ?? "";
  }
  get _chips() {
    return this._working ?? this.chips ?? [];
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t.map((e) => Mt(e)) },
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
    const o = this._working[this._drag.index], s = o.positions?.[this._variant] ?? { x: 50, y: 50 };
    o.positions = { ...o.positions ?? {}, [this._variant]: { ...s, x: i, y: r } }, this.requestUpdate();
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
          { name: "dot", selector: { select: { mode: "dropdown", options: ri } } },
          { name: "hidden", selector: { boolean: {} } }
        ]
      }
    ];
  }
  _flatten(t) {
    const e = t.positions?.[this._variant] ?? {};
    return Mt({
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
    const i = t.detail.value, r = q(this.chips), o = r[e];
    o.entity = i.entity ?? "", o.entity2 = i.entity2 || void 0, o.name = i.name || void 0, o.icon = i.icon || void 0, o.color = i.color || void 0, o.unit = i.unit || void 0, o.precision = i.precision, o.tap_action = i.tap_action || void 0;
    const s = { ...o.positions ?? {} };
    i.x !== void 0 && i.y !== void 0 ? s[this._variant] = {
      x: i.x,
      y: i.y,
      dot: i.dot || void 0,
      hidden: i.hidden || void 0
    } : i.hidden ? s[this._variant] = {
      ...s[this._variant] ?? { x: 50, y: 50 },
      hidden: !0
    } : delete s[this._variant], o.positions = s, this._emit(r);
  }
  render() {
    const t = this._chips;
    return l`
      <div class="ce">
        <div class="ce-tabs">
          ${Pt.map(
      (e) => l`<button
              class=${e === this._variant ? "on" : ""}
              @click=${() => this._variant = e}
            >
              ${kt[e]}
            </button>`
    )}
        </div>

        <div class="ce-stage-wrap">
          <div class="ce-stage">
            ${this.images?.[this._variant] ? l`<img src=${this.images[this._variant]} alt="" />` : l`<div class="svg">${ne(this._variant)}</div>`}
            ${t.map((e, i) => this._renderDot(e, i))}
          </div>
          <div class="ce-hint">
            Punkte auf das Boot ziehen · Antippen zum Bearbeiten ·
            Ansicht: <b>${kt[this._variant]}</b>
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
    const r = b(this.hass, t.entity), o = bt(t.color) ?? "var(--bc-accent, #5b7cfa)", s = r ? S(this.hass, r, { precision: t.precision, unit: t.unit }) : "—", a = i.dot ?? (i.x >= 50 ? "left" : "right"), n = (t.name ?? tt(r, t.entity)) || `#${e + 1}`;
    return l`<div
      class="ce-anchor dot-${a} ${e === this._expanded ? "active" : ""}"
      style="left:${i.x}%;top:${i.y}%;--ac:${o}"
    >
      <span
        class="ce-adot"
        @pointerdown=${(c) => this._onDotDown(c, e)}
        @pointermove=${this._onDotMove}
        @pointerup=${(c) => this._onDotUp(c, e)}
        @pointercancel=${(c) => this._onDotUp(c, e)}
        title=${n}
      ></span>
      <span
        class="ce-albl"
        @click=${() => this._expanded = this._expanded === e ? -1 : e}
        >${n}: ${s}</span
      >
    </div>`;
  }
  _renderRow(t, e) {
    const i = b(this.hass, t.entity), r = !!t.positions?.[this._variant], o = !!t.positions?.[this._variant]?.hidden, s = bt(t.color) ?? "var(--bc-accent, #5b7cfa)", a = (t.name ?? tt(i, t.entity)) || `Chip #${e + 1}`, n = e === this._expanded;
    return l`<div class="ce-row ${n ? "open" : ""}">
      <div class="ce-row-head" @click=${() => this._expanded = n ? -1 : e}>
        <span class="swatch" style="background:${s}"></span>
        <span class="rn">${a}</span>
        <span class="badge ${r ? o ? "hid" : "ok" : "no"}">
          ${r ? o ? "ausgeblendet" : "platziert" : "nicht in dieser Ansicht"}
        </span>
        <span class="sp"></span>
        <ha-icon-button
          .label=${"hoch"}
          @click=${(c) => {
      c.stopPropagation(), this._moveChip(e, -1);
    }}
        ><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(c) => {
      c.stopPropagation(), this._moveChip(e, 1);
    }}
        ><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button
          @click=${(c) => {
      c.stopPropagation(), this._removeChip(e);
    }}
        ><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${n ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${n ? l`<div class="ce-row-body">
            ${r ? d : l`<button class="ce-place" @click=${() => this._placeHere(e)}>
                  <ha-icon icon="mdi:map-marker-plus"></ha-icon>
                  In „${kt[this._variant]}" platzieren
                </button>`}
            <ha-form
              .hass=${this.hass}
              .data=${this._flatten(t)}
              .schema=${this._chipSchema()}
              .computeLabel=${this._label}
              @value-changed=${(c) => this._chipFormChanged(c, e)}
            ></ha-form>
          </div>` : d}
    </div>`;
  }
};
R.styles = vt`
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
A([
  O({ attribute: !1 })
], R.prototype, "hass", 2);
A([
  O({ attribute: !1 })
], R.prototype, "chips", 2);
A([
  O({ attribute: !1 })
], R.prototype, "images", 2);
A([
  C()
], R.prototype, "_variant", 2);
A([
  C()
], R.prototype, "_expanded", 2);
A([
  C()
], R.prototype, "_working", 2);
R = A([
  xt("boat-chips-editor")
], R);
let B = class extends H {
  constructor() {
    super(...arguments), this.items = [], this.fields = [], this.addLabel = "Hinzufügen", this._expanded = -1, this._label = (t) => he[t?.name] ?? t?.name ?? "";
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t.map((e) => Mt(e)) },
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
    const i = this.items.map((o) => this._norm(o)), r = t + e;
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
      const r = b(this.hass, e.entity), o = i === this._expanded, s = (e.name ?? tt(r, e.entity)) || `#${i + 1}`;
      return l`<div class="row ${o ? "open" : ""}">
          <div class="head" @click=${() => this._expanded = o ? -1 : i}>
            ${e.icon ? l`<ha-icon icon=${e.icon}></ha-icon>` : d}
            <span class="n">${s}</span>
            <span class="sp"></span>
            <ha-icon-button @click=${(a) => {
        a.stopPropagation(), this._move(i, -1);
      }}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(a) => {
        a.stopPropagation(), this._move(i, 1);
      }}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(a) => {
        a.stopPropagation(), this._remove(i);
      }}>
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          </div>
          ${o ? l`<div class="body">
                <ha-form
                  .hass=${this.hass}
                  .data=${e}
                  .schema=${this.fields}
                  .computeLabel=${this._label}
                  @value-changed=${(a) => this._changed(a, i)}
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
B.styles = vt`
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
  O({ attribute: !1 })
], B.prototype, "hass", 2);
A([
  O({ attribute: !1 })
], B.prototype, "items", 2);
A([
  O({ attribute: !1 })
], B.prototype, "fields", 2);
A([
  O({ type: String })
], B.prototype, "addLabel", 2);
A([
  C()
], B.prototype, "_expanded", 2);
B = A([
  xt("boat-items-editor")
], B);
var oi = Object.defineProperty, ai = Object.getOwnPropertyDescriptor, yt = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? ai(e, i) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (o = (r ? a(e, i, o) : a(o)) || o);
  return r && o && oi(e, i, o), o;
};
const St = {
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
  tap_action: "Tippen",
  graph: "Diagramm",
  days: "Zeitraum (Tage)",
  trend: "Trend-Pfeil"
}, Xt = {
  boat: "Boot (Bild + Chips)",
  battery: "Batterie",
  solar: "Solar",
  fridge: "Kühlschrank",
  camera: "Kamera",
  grafana: "Grafana",
  sensor: "Sensor (Wert)"
}, E = (t) => ({ name: t, selector: { text: {} } }), T = (t) => ({ name: t, selector: { boolean: {} } }), w = (t) => ({ name: t, selector: { entity: { domain: "sensor" } } }), N = (t, e) => ({
  name: t,
  selector: { entity: e ? { domain: e } : {} }
}), At = (t, e = 0, i = 100) => ({
  name: t,
  selector: { number: { min: e, max: i, mode: "box" } }
}), si = {
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
let et = class extends H {
  constructor() {
    super(...arguments), this._expanded = -1, this._label = (t) => St[t?.name] ?? t?.name ?? "";
  }
  setConfig(t) {
    this._config = { ...t, sections: t.sections ?? [] };
  }
  _emit(t) {
    this._config = t, De(this, "config-changed", { config: t });
  }
  _topSchema() {
    return [
      E("title"),
      E("subtitle"),
      { type: "grid", name: "", schema: [si, At("columns", 1, 4)] },
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
          T("tiles")
        ]
      },
      { type: "grid", name: "", schema: [T("background"), T("flush")] }
    ];
  }
  _topChanged(t) {
    t.stopPropagation(), this._config && this._emit({ ...this._config, ...t.detail.value, sections: this._config.sections });
  }
  // ---- section-type field schema ----
  _sectionSchema(t) {
    const e = [
      { type: "grid", name: "", schema: [E("name"), { name: "icon", selector: { icon: {} } }] },
      { type: "grid", name: "", schema: [E("color"), T("full_width")] }
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
              N("variant_entity")
            ]
          },
          T("show_variant_switch"),
          {
            type: "expandable",
            name: "images",
            title: St.images,
            schema: [E("dock"), E("sailing"), E("trailer"), T("image_remove_black")]
          },
          {
            type: "expandable",
            name: "gps",
            title: St.gps,
            schema: [
              w("speed"),
              w("heading"),
              N("location", ["device_tracker", "person", "zone"]),
              w("lat"),
              w("lon"),
              E("speed_unit")
            ]
          }
        ];
      case "battery":
        return [
          ...e,
          w("soc"),
          { type: "grid", name: "", schema: [w("voltage"), w("current")] },
          { type: "grid", name: "", schema: [w("power"), w("temperature")] },
          w("time_remaining"),
          ...Et
        ];
      case "solar":
        return [
          ...e,
          w("power"),
          { type: "grid", name: "", schema: [w("yield_today"), N("state")] },
          { type: "grid", name: "", schema: [w("voltage"), w("current")] },
          ...Et
        ];
      case "fridge":
        return [
          ...e,
          N("switch", ["switch", "input_boolean"]),
          w("temperature"),
          { type: "grid", name: "", schema: [N("target", ["sensor", "number", "input_number"]), w("power")] }
        ];
      case "camera":
        return [
          ...e,
          N("camera", "camera"),
          { type: "grid", name: "", schema: [N("switch", ["switch", "input_boolean"]), T("ptz")] },
          { type: "grid", name: "", schema: [N("presets", "select"), E("aspect_ratio")] }
        ];
      case "grafana":
        return [
          ...e,
          E("url"),
          { type: "grid", name: "", schema: [At("height", 150, 1200), T("auto_params")] },
          T("show_open")
        ];
      case "sensor":
      default:
        return [
          ...e,
          N("entity"),
          N("entity2"),
          { type: "grid", name: "", schema: [E("unit"), At("precision", 0, 4)] },
          E("attribute"),
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
          ${We.map((e) => l`<option value=${e}>${Xt[e]}</option>`)}
        </select>
      </div>
    `;
  }
  _renderSection(t, e) {
    const i = e === this._expanded, r = P[t.type] ?? P.sensor, o = t.entity ?? t.soc ?? t.power ?? t.camera ?? t.switch ?? t.url ?? "", s = t.name ?? tt(b(this.hass, o), "");
    return l`<div class="sec ${i ? "open" : ""}">
      <div class="sec-head" @click=${() => this._expanded = i ? -1 : e}>
        <ha-icon .icon=${t.icon ?? r.icon}></ha-icon>
        <span class="sec-name">${Xt[t.type] ?? t.type}</span>
        ${s ? l`<span class="sec-sub">${s}</span>` : d}
        <span class="sp"></span>
        <ha-icon-button @click=${(a) => {
      a.stopPropagation(), this._moveSection(e, -1);
    }}><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(a) => {
      a.stopPropagation(), this._moveSection(e, 1);
    }}><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        <ha-icon-button @click=${(a) => {
      a.stopPropagation(), this._removeSection(e);
    }}><ha-icon icon="mdi:delete"></ha-icon></ha-icon-button>
        <ha-icon icon=${i ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${i ? l`<div class="sec-body">
            <ha-form
              .hass=${this.hass}
              .data=${t}
              .schema=${this._sectionSchema(t.type)}
              .computeLabel=${this._label}
              @value-changed=${(a) => this._sectionChanged(a, e)}
            ></ha-form>
            ${t.type === "boat" ? l`
                  <div class="sub-title">Chips auf dem Boot</div>
                  <div class="sub-sub">Punkte aufs Boot ziehen · Tabs = Positionen je Ansicht</div>
                  <boat-chips-editor
                    .hass=${this.hass}
                    .chips=${t.chips ?? []}
                    .images=${t.images}
                    @value-changed=${(a) => this._chipsChanged(a, e)}
                  ></boat-chips-editor>
                  <div class="sub-title">Aktoren-Reihe</div>
                  <boat-items-editor
                    .hass=${this.hass}
                    .items=${t.controls ?? []}
                    .fields=${ni}
                    addLabel="Aktor hinzufügen"
                    @value-changed=${(a) => this._controlsChanged(a, e)}
                  ></boat-items-editor>
                ` : d}
          </div>` : d}
    </div>`;
  }
};
et.styles = vt`
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
yt([
  O({ attribute: !1 })
], et.prototype, "hass", 2);
yt([
  C()
], et.prototype, "_config", 2);
yt([
  C()
], et.prototype, "_expanded", 2);
et = yt([
  xt("boat-card-editor")
], et);
const ni = [
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
var ci = Object.defineProperty, li = Object.getOwnPropertyDescriptor, F = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? li(e, i) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (o = (r ? a(e, i, o) : a(o)) || o);
  return r && o && ci(e, i, o), o;
};
const di = ["left", "right", "up", "down", "zoom_in", "zoom_out"], hi = 2e4, pi = 5 * 6e4, Ct = [
  { key: "day", labelKey: "range_day", kind: "hour", count: 24 },
  { key: "week", labelKey: "range_week", kind: "day", count: 7 },
  { key: "month", labelKey: "range_month", kind: "day", count: 30 }
];
let z = class extends H {
  constructor() {
    super(...arguments), this._variantOverride = {}, this._history = {}, this._popup = null, this._popupRange = "week", this._tileRanges = {}, this._cfgSig = "", this._stateSig = "", this._lastFetch = 0, this._fetching = !1;
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
      columns: 2,
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
    super.updated(t), (t.has("hass") || t.has("_config")) && this._maybeFetch();
  }
  _sectionSeries(t) {
    switch (t.type) {
      case "sensor": {
        const e = [];
        return t.entities?.length && e.push(...t.entities.map((i) => typeof i == "string" ? i : i.entity)), t.entity && e.push(t.entity), t.entity2 && e.push(t.entity2), e;
      }
      case "battery":
        return t.soc ? [t.soc] : [];
      case "solar":
        return t.power ? [t.power] : [];
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
      ...this._config.sections.map((a) => a.days ?? 7)
    ), i = `${e}|${t.join(",")}`, r = t.map((a) => this.hass.states[a]?.last_updated ?? "").join("|"), o = Date.now();
    (i !== this._cfgSig || o - this._lastFetch > pi || r !== this._stateSig && o - this._lastFetch > hi) && (this._fetching = !0, this._cfgSig = i, this._stateSig = r, Ye(this.hass, t, e).then((a) => {
      this._history = a, this._lastFetch = Date.now();
    }).catch((a) => console.warn("boat-card: history fetch failed", a)).finally(() => {
      this._fetching = !1;
    }));
  }
  _buckets(t, e, i, r) {
    if (!t) return [];
    const o = this._history[t] ?? [];
    return e === "hour" ? Je(o, i, r) : Xe(o, i, r);
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
    return t.name ?? g(this.hass, e.nameKey);
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
      Zt(t.card_style),
      t.tiles === !1 ? "flat" : "tiles",
      t.flush ? "flush" : ""
    ].join(" "), i = l`
      ${t.title ? l`<div class="header">
            <div class="title">${t.title}</div>
            ${t.subtitle ? l`<div class="subtitle">${t.subtitle}</div>` : d}
          </div>` : d}
      <div class="metrics ${t.layout === "carousel" ? "carousel" : ""}" style="--bc-columns:${t.columns ?? 2}">
        ${(t.sections ?? []).map((r, o) => this._renderSection(r, o))}
      </div>
    `;
    return l`
      ${t.background === !1 ? l`<div class="${e} nobg">${i}</div>` : l`<ha-card class=${e}>${i}</ha-card>`}
      ${this._renderPopup()}
    `;
  }
  _renderSection(t, e) {
    const i = this._isFull(t) ? "full" : "", r = this._accent(t);
    let o;
    switch (t.type) {
      case "boat":
        o = this._renderBoat(t, e);
        break;
      case "battery":
        o = this._renderBattery(t, e);
        break;
      case "solar":
        o = this._renderSolar(t, e);
        break;
      case "fridge":
        o = this._renderFridge(t);
        break;
      case "camera":
        o = this._renderCamera(t);
        break;
      case "grafana":
        o = this._renderGrafana(t);
        break;
      case "sensor":
        o = this._renderSensor(t, e);
        break;
      default:
        o = d;
    }
    return l`<div class="metric ${i}" style="--bc-accent:${r}">${o}</div>`;
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
    const r = e.days ?? 7, o = qt(pt(this._buckets(t, "day", r, this._agg(e))));
    if (!Number.isFinite(o) || Math.abs(o) < 1e-9) return d;
    const s = o > 0, a = i === "up_good" ? s : i === "down_good" ? !s : null;
    return l`<span class="trend ${a === null ? "flat" : a ? "up" : "down"}">
      <ha-icon .icon=${s ? "mdi:arrow-top-right" : "mdi:arrow-bottom-right"}></ha-icon>
      ${Y(this.hass, Math.abs(o), e.precision ?? 1)}
    </span>`;
  }
  _miniChart(t, e, i) {
    const r = this._graph(i);
    if (r === "none") return d;
    const o = i.days ?? 7, s = this._agg(i);
    if (r === "bar")
      return Yt(this._buckets(t[0], "day", o, s), e, void 0, { h: 56 });
    if (r === "progress") return d;
    const a = t.filter(Boolean).map((n, c) => ({
      values: pt(this._buckets(n, "day", o, s)),
      color: c === 0 ? e : "var(--secondary-text-color)"
    }));
    return Vt(a, { h: 56 });
  }
  _handleTap(t, e, i) {
    const r = t.tap_action ?? "popup";
    if (r !== "none") {
      if (r === "toggle" && i) return rt(this.hass, i);
      if (r === "link" && t.link) {
        /^https?:/.test(t.link) ? window.open(t.link, "_blank") : i && Z(this, i);
        return;
      }
      if (r === "more-info") {
        i && Z(this, i);
        return;
      }
      this._popupRange = "week", this._popup = e;
    }
  }
  // ==================== BATTERY / SOLAR / SENSOR (value tiles) ====================
  _kvRow(t, e) {
    const i = b(this.hass, t);
    return !t || L(i) ? d : l`<div class="kv"><span>${e}</span><b>${S(this.hass, i)}</b></div>`;
  }
  _socColor(t) {
    return Number.isFinite(t) ? t >= 50 ? "var(--bc-battery)" : t >= 20 ? "var(--bc-solar)" : "var(--bc-danger)" : "var(--secondary-text-color)";
  }
  _valueTile(t, e, i, r, o, s, a) {
    const n = b(this.hass, i), c = (t.tap_action ?? "popup") !== "none";
    return l`<div
      class="tile-inner ${c ? "clickable" : ""}"
      @click=${() => this._handleTap(t, e, i)}
    >
      ${this._tileHead(
      t,
      n ? l`<div class="time">${this._trendEl(i, t)}</div>` : void 0
    )}
      <div class="body">
        <div class="info">${r}${o}</div>
        <div class="chartcell">${this._miniChart(s, a, t)}</div>
      </div>
    </div>`;
  }
  _renderBattery(t, e) {
    const i = b(this.hass, t.soc), r = G(i), o = this._socColor(r), s = i ? l`<div class="value" style="color:${o}">${S(this.hass, i, { unit: "%", precision: 0 })}</div>
          <div class="progress"><span style="width:${Math.max(0, Math.min(100, r || 0))}%;--bar-color:${o}"></span></div>` : l`<div class="missing">${g(this.hass, "unavailable")}</div>`, a = l`<div class="kvs">
      ${this._kvRow(t.voltage, g(this.hass, "voltage"))}
      ${this._kvRow(t.current, g(this.hass, "current"))}
      ${this._kvRow(t.power, g(this.hass, "power_now"))}
      ${this._kvRow(t.temperature, g(this.hass, "temperature"))}
      ${this._kvRow(t.time_remaining, "⌛")}
    </div>`;
    return this._valueTile(t, e, t.soc, s, a, [t.soc ?? ""], o);
  }
  _renderSolar(t, e) {
    const i = b(this.hass, t.power), r = i ? l`<div class="value" style="color:var(--bc-solar)">${S(this.hass, i, { unit: "W", precision: 0 })}</div>` : l`<div class="missing">${g(this.hass, "unavailable")}</div>`, o = l`<div class="kvs">
      ${this._kvRow(t.yield_today, g(this.hass, "yield_today"))}
      ${this._kvRow(t.voltage, g(this.hass, "voltage"))}
      ${this._kvRow(t.current, g(this.hass, "current"))}
      ${this._kvRow(t.state, g(this.hass, "state"))}
    </div>`;
    return this._valueTile(t, e, t.power, r, o, [t.power ?? ""], "var(--bc-solar)");
  }
  _renderSensor(t, e) {
    const i = t.entity ?? (t.entities?.length ? typeof t.entities[0] == "string" ? t.entities[0] : t.entities[0].entity : void 0), r = b(this.hass, i), o = l`<div class="value">${S(this.hass, r, { precision: t.precision, unit: t.unit, attribute: t.attribute, unavailable: "—" })}</div>`, s = (t.secondary ?? []).map((n) => b(this.hass, n)).filter((n) => n && !L(n)).map((n) => S(this.hass, n)), a = s.length ? l`<div class="secondary-vals">${s.join(" · ")}</div>` : d;
    return this._valueTile(t, e, i, o, a, this._sectionSeries(t), this._accent(t));
  }
  // ==================== BOAT HERO ====================
  _variant(t, e) {
    if (this._variantOverride[e]) return this._variantOverride[e];
    if (t.variant_entity) {
      const i = b(this.hass, t.variant_entity);
      if (i) {
        const r = t.variant_map?.[i.state];
        if (r) return r;
        if (Pt.includes(i.state)) return i.state;
      }
    }
    return t.variant ?? "dock";
  }
  _renderBoat(t, e) {
    const i = this._variant(t, e), r = t.images?.[i];
    return l`
      <div class="stage">
        ${r ? l`<img class="scene ${t.image_remove_black ? "rm-black" : ""}" src=${r} alt=${i} />` : l`<div class="scene">${ne(i)}</div>`}
        ${(t.chips ?? []).map((o) => this._renderChip(o, i))}
        ${t.show_variant_switch !== !1 ? this._renderVariantSwitch(i, e) : d}
      </div>
      ${this._renderGps(t.gps)} ${this._renderControls(t.controls)}
    `;
  }
  _renderVariantSwitch(t, e) {
    const i = { dock: "mdi:dock-top", sailing: "mdi:sail-boat", trailer: "mdi:truck-trailer" };
    return l`<div class="variant-switch">
      ${Pt.map(
      (r) => l`<button class=${r === t ? "on" : ""} title=${g(this.hass, r)} @click=${() => this._variantOverride = { ...this._variantOverride, [e]: r }}>
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
      if (e === "toggle") return rt(this.hass, t.entity);
      if (e === "link" && t.link) {
        /^https?:/.test(t.link) ? window.open(t.link, "_blank") : Z(this, t.entity);
        return;
      }
      Z(this, t.entity);
    }
  }
  _renderChip(t, e) {
    const i = this._chipPos(t, e), r = b(this.hass, t.entity);
    if (!i || !r) return d;
    const o = i.dot ?? (i.x >= 50 ? "left" : "right"), s = bt(t.color) ?? "var(--bc-accent)";
    let a;
    if (t.entity2) {
      const c = b(this.hass, t.entity2);
      a = `${S(this.hass, r, { precision: t.precision, unit: "" })} / ${S(this.hass, c, { precision: t.precision })}`;
    } else
      a = S(this.hass, r, { precision: t.precision, unit: t.unit, attribute: t.attribute });
    const n = t.name ?? tt(r, "");
    return l`<div class="anchor dot-${o}" style="left:${i.x}%;top:${i.y}%;--ac:${s}" @click=${() => this._tapChip(t)}>
      <span class="anchor-dot"></span>
      <div class="anchor-chip">
        ${t.icon ? l`<ha-icon class="ci" .icon=${t.icon}></ha-icon>` : d}
        <div class="anchor-txt">
          ${n ? l`<span class="anchor-name">${n}</span>` : d}
          <span class="anchor-val">${a}</span>
        </div>
      </div>
    </div>`;
  }
  _renderGps(t) {
    if (!t) return d;
    const e = [], i = b(this.hass, t.speed);
    i && !L(i) && e.push(l`<span class="gps-item"><ha-icon icon="mdi:speedometer"></ha-icon>${S(this.hass, i, { unit: t.speed_unit })}</span>`);
    const r = b(this.hass, t.heading);
    if (r && !L(r)) {
      const s = G(r);
      e.push(l`<span class="gps-item"><ha-icon icon="mdi:compass-outline"></ha-icon>${Fe(s)} ${Number.isFinite(s) ? l`${Y(this.hass, s, 0)}°` : ""}</span>`);
    }
    const o = this._coords(t);
    return o && e.push(l`<span class="gps-item"><ha-icon icon="mdi:map-marker"></ha-icon>${o}</span>`), e.length ? l`<div class="gps-bar">${e}</div>` : d;
  }
  _coords(t) {
    let e = NaN, i = NaN;
    if (t.location) {
      const r = b(this.hass, t.location);
      e = G(r, "latitude"), i = G(r, "longitude");
    }
    return !Number.isFinite(e) && t.lat && (e = G(b(this.hass, t.lat))), !Number.isFinite(i) && t.lon && (i = G(b(this.hass, t.lon))), !Number.isFinite(e) || !Number.isFinite(i) ? "" : `${e.toFixed(4)}, ${i.toFixed(4)}`;
  }
  _renderControls(t) {
    return t?.length ? l`<div class="controls">
      ${t.map((e) => {
      const i = typeof e == "string" ? { entity: e } : e, r = b(this.hass, i.entity), o = ht(r), s = o ? i.icon_on ?? i.icon : i.icon;
      return l`<button class="ctl ${o ? "on" : ""}" @click=${() => rt(this.hass, i.entity)}>
          <ha-icon .icon=${s ?? "mdi:power"}></ha-icon>
          <span class="cl">${i.name ?? tt(r, "")}</span>
          <span class="cl">${o ? g(this.hass, "on") : g(this.hass, "off")}</span>
        </button>`;
    })}
    </div>` : d;
  }
  // ==================== FRIDGE ====================
  _renderFridge(t) {
    const e = b(this.hass, t.switch), i = ht(e), r = b(this.hass, t.temperature);
    return l`
      ${this._tileHead(t)}
      <div class="fridge">
        ${t.switch ? l`<button class="power ${i ? "on" : ""}" @click=${() => rt(this.hass, t.switch)}>
              <ha-icon icon="mdi:fridge-outline"></ha-icon>
              <span>${i ? g(this.hass, "on") : g(this.hass, "off")}</span>
            </button>` : d}
        <div class="readouts">
          ${t.temperature ? l`<div class="ro" @click=${() => Z(this, t.temperature)}>
                <span class="l">${g(this.hass, "fridge_temp")}</span>
                <span class="v">${S(this.hass, r, { precision: 1 })}</span>
              </div>` : d}
          ${t.target && !L(b(this.hass, t.target)) ? l`<div class="ro"><span class="l">${g(this.hass, "target")}</span><span class="v">${S(this.hass, b(this.hass, t.target), { precision: 1 })}</span></div>` : d}
          ${t.power && !L(b(this.hass, t.power)) ? l`<div class="ro"><span class="l">${g(this.hass, "power_now")}</span><span class="v">${S(this.hass, b(this.hass, t.power))}</span></div>` : d}
        </div>
      </div>
    `;
  }
  // ==================== CAMERA ====================
  _ptzButtons(t) {
    var s;
    if (t.ptz_buttons) return t.ptz_buttons;
    const e = {};
    for (const a of Object.keys(this.hass.states)) {
      if (ae(a) !== "button") continue;
      const n = a.match(/^button\.(.+)_ptz_(left|right|up|down|zoom_in|zoom_out)$/);
      n && ((e[s = n[1]] ?? (e[s] = {}))[n[2]] = a);
    }
    const i = (t.camera ?? "").split(".")[1] ?? "";
    let r = "", o = -1;
    for (const a of Object.keys(e)) {
      const n = a.split("_"), c = i.split("_");
      let p = 0;
      for (; p < n.length && p < c.length && n[p] === c[p]; ) p++;
      p > o && (o = p, r = a);
    }
    return r ? e[r] : {};
  }
  _renderCamera(t) {
    const e = b(this.hass, t.camera), i = b(this.hass, t.switch), r = b(this.hass, t.presets), o = this._ptzButtons(t), s = t.ptz !== !1 && (t.ptz === !0 || di.some((c) => o[c])), a = e?.attributes?.entity_picture, n = (c, p) => l`<button class="ptz-btn" ?disabled=${!o[c]} @click=${() => o[c] && this.hass.callService("button", "press", { entity_id: o[c] })}><ha-icon .icon=${p}></ha-icon></button>`;
    return l`
      ${this._tileHead(
      t,
      t.switch ? l`<button class="ptz-btn" style=${ht(i) ? "color:var(--bc-accent)" : ""} title=${g(this.hass, "camera_power")} @click=${() => rt(this.hass, t.switch)}><ha-icon icon="mdi:power"></ha-icon></button>` : void 0
    )}
      <div class="cam-wrap" style="--ar:${(t.aspect_ratio ?? "16:9").replace(":", "/")}">
        ${t.switch && !ht(i) ? l`<div class="cam off"><ha-icon icon="mdi:cctv-off"></ha-icon><span>${g(this.hass, "off")}</span></div>` : l`<div class="cam" @click=${() => t.camera && Z(this, t.camera)}>
              ${e ? l`<ha-camera-stream .hass=${this.hass} .stateObj=${e} muted></ha-camera-stream>` : d}
              ${!e && a ? l`<img src=${a} alt="camera" />` : d}
            </div>`}
      </div>
      ${r && !L(r) ? l`<div class="presets">
            <ha-icon icon="mdi:map-marker-radius"></ha-icon>
            <select @change=${(c) => this.hass.callService("select", "select_option", { entity_id: t.presets, option: c.target.value })}>
              ${(r.attributes.options ?? []).map((c) => l`<option ?selected=${c === r.state}>${c}</option>`)}
            </select>
          </div>` : d}
      ${s ? l`<div class="ptz">
            <div class="pad">
              <span></span>${n("up", "mdi:chevron-up")}<span></span>
              ${n("left", "mdi:chevron-left")}<ha-icon class="pad-center" icon="mdi:pan"></ha-icon>${n("right", "mdi:chevron-right")}
              <span></span>${n("down", "mdi:chevron-down")}<span></span>
            </div>
            <div class="zoom">${n("zoom_out", "mdi:magnify-minus-outline")}${n("zoom_in", "mdi:magnify-plus-outline")}</div>
          </div>` : d}
    `;
  }
  // ==================== GRAFANA ====================
  _grafanaUrl(t) {
    let e = t.url ?? "";
    if (t.auto_params === !1) return e;
    const i = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches, r = (o, s) => {
      new RegExp(`[?&]${o}(=|&|$)`).test(e) || (e += (e.includes("?") ? "&" : "?") + (s ? `${o}=${s}` : o));
    };
    return r("theme", i ? "dark" : "light"), r("kiosk"), e;
  }
  _renderGrafana(t) {
    return l`
      ${this._tileHead(
      t,
      t.show_open !== !1 && t.url ? l`<a class="g-open" href=${t.url} target="_blank" rel="noopener" title=${g(this.hass, "open_grafana")}><ha-icon icon="mdi:open-in-new"></ha-icon></a>` : void 0
    )}
      ${t.url ? l`<iframe class="frame" style="height:${t.height ?? 400}px" src=${this._grafanaUrl(t)} loading="lazy" referrerpolicy="no-referrer"></iframe>` : l`<div class="missing">${g(this.hass, "no_url")}</div>`}
    `;
  }
  // ==================== DETAIL POPUP ====================
  _popupSection() {
    return this._popup === null ? void 0 : this._config?.sections[this._popup];
  }
  _renderPopup() {
    const t = this._popupSection();
    if (!t) return d;
    const e = Ct.find((m) => m.key === this._popupRange) ?? Ct[1], i = this._sectionSeries(t)[0], r = t.type === "solar" ? "var(--bc-solar)" : this._accent(t), o = this._agg(t), s = this._buckets(i, e.kind, e.count, o), n = (this._graph(t) === "bar" ? "bar" : "line") === "bar" ? Yt(s, r, void 0, { w: 520, h: 150, yFmt: (m) => Y(this.hass, m, 0) }) : Vt([{ values: pt(s), color: r }], { w: 520, h: 150, yFmt: (m) => Y(this.hass, m, 0) }), c = s.filter(Number.isFinite), p = c.length ? Math.min(...c) : NaN, u = c.length ? Math.max(...c) : NaN, h = c.length ? c.reduce((m, j) => m + j, 0) / c.length : NaN, _ = qt(pt(s)), x = (m, j) => l`<div class="stat-tile"><div class="stat-label">${m}</div><div class="stat-value">${Y(this.hass, j, t.precision ?? 1)}</div></div>`;
    return l`<div class="backdrop ${Zt(this._config?.card_style)}" @click=${() => this._popup = null}>
      <div class="dialog" @click=${(m) => m.stopPropagation()}>
        <div class="dialog-head">
          <div class="iconchip"><ha-icon .icon=${this._icon(t)}></ha-icon></div>
          <div class="dialog-title">${this._name(t)}</div>
          <button class="close" @click=${() => this._popup = null}><ha-icon icon="mdi:close"></ha-icon></button>
        </div>
        <div class="ranges">
          ${Ct.map(
      (m) => l`<button class="range ${m.key === this._popupRange ? "on" : ""}" @click=${() => this._popupRange = m.key}>${g(this.hass, m.labelKey)}</button>`
    )}
        </div>
        <div class="bigchart">${n}</div>
        <div class="stats">
          ${x(g(this.hass, "stat_min"), p)}
          ${x(g(this.hass, "stat_avg"), h)}
          ${x(g(this.hass, "stat_max"), u)}
          ${x(g(this.hass, "stat_trend"), _)}
        </div>
      </div>
    </div>`;
  }
};
z.styles = Qe;
F([
  O({ attribute: !1 })
], z.prototype, "hass", 2);
F([
  C()
], z.prototype, "_config", 2);
F([
  C()
], z.prototype, "_variantOverride", 2);
F([
  C()
], z.prototype, "_history", 2);
F([
  C()
], z.prototype, "_popup", 2);
F([
  C()
], z.prototype, "_popupRange", 2);
F([
  C()
], z.prototype, "_tileRanges", 2);
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
