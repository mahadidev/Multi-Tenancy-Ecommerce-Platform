var Jr = Object.defineProperty;
var Zr = (e, t, r) =>
    t in e
        ? Jr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
        : (e[t] = r);
var Ze = (e, t, r) => Zr(e, typeof t != "symbol" ? t + "" : t, r);
import {
    k as Xr,
    r as I,
    g as Yr,
    j as A,
    o as ce,
    L as $e,
} from "./chunk-K6AXKMTT-DZy3nHUu.js";
function Q(e) {
    return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var en = (typeof Symbol == "function" && Symbol.observable) || "@@observable",
    Tt = en,
    Xe = () => Math.random().toString(36).substring(7).split("").join("."),
    tn = {
        INIT: `@@redux/INIT${Xe()}`,
        REPLACE: `@@redux/REPLACE${Xe()}`,
        PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Xe()}`,
    },
    Le = tn;
function J(e) {
    if (typeof e != "object" || e === null) return !1;
    let t = e;
    for (; Object.getPrototypeOf(t) !== null; ) t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function St(e, t, r) {
    if (typeof e != "function") throw new Error(Q(2));
    if (
        (typeof t == "function" && typeof r == "function") ||
        (typeof r == "function" && typeof arguments[3] == "function")
    )
        throw new Error(Q(0));
    if (
        (typeof t == "function" && typeof r > "u" && ((r = t), (t = void 0)),
        typeof r < "u")
    ) {
        if (typeof r != "function") throw new Error(Q(1));
        return r(St)(e, t);
    }
    let n = e,
        i = t,
        s = new Map(),
        o = s,
        d = 0,
        y = !1;
    function b() {
        o === s &&
            ((o = new Map()),
            s.forEach((v, _) => {
                o.set(_, v);
            }));
    }
    function S() {
        if (y) throw new Error(Q(3));
        return i;
    }
    function g(v) {
        if (typeof v != "function") throw new Error(Q(4));
        if (y) throw new Error(Q(5));
        let _ = !0;
        b();
        const a = d++;
        return (
            o.set(a, v),
            function () {
                if (_) {
                    if (y) throw new Error(Q(6));
                    (_ = !1), b(), o.delete(a), (s = null);
                }
            }
        );
    }
    function l(v) {
        if (!J(v)) throw new Error(Q(7));
        if (typeof v.type > "u") throw new Error(Q(8));
        if (typeof v.type != "string") throw new Error(Q(17));
        if (y) throw new Error(Q(9));
        try {
            (y = !0), (i = n(i, v));
        } finally {
            y = !1;
        }
        return (
            (s = o).forEach((a) => {
                a();
            }),
            v
        );
    }
    function f(v) {
        if (typeof v != "function") throw new Error(Q(10));
        (n = v), l({ type: Le.REPLACE });
    }
    function h() {
        const v = g;
        return {
            subscribe(_) {
                if (typeof _ != "object" || _ === null) throw new Error(Q(11));
                function a() {
                    const c = _;
                    c.next && c.next(S());
                }
                return a(), { unsubscribe: v(a) };
            },
            [Tt]() {
                return this;
            },
        };
    }
    return (
        l({ type: Le.INIT }),
        { dispatch: l, subscribe: g, getState: S, replaceReducer: f, [Tt]: h }
    );
}
function rn(e) {
    Object.keys(e).forEach((t) => {
        const r = e[t];
        if (typeof r(void 0, { type: Le.INIT }) > "u") throw new Error(Q(12));
        if (typeof r(void 0, { type: Le.PROBE_UNKNOWN_ACTION() }) > "u")
            throw new Error(Q(13));
    });
}
function br(e) {
    const t = Object.keys(e),
        r = {};
    for (let s = 0; s < t.length; s++) {
        const o = t[s];
        typeof e[o] == "function" && (r[o] = e[o]);
    }
    const n = Object.keys(r);
    let i;
    try {
        rn(r);
    } catch (s) {
        i = s;
    }
    return function (o = {}, d) {
        if (i) throw i;
        let y = !1;
        const b = {};
        for (let S = 0; S < n.length; S++) {
            const g = n[S],
                l = r[g],
                f = o[g],
                h = l(f, d);
            if (typeof h > "u") throw (d && d.type, new Error(Q(14)));
            (b[g] = h), (y = y || h !== f);
        }
        return (y = y || n.length !== Object.keys(o).length), y ? b : o;
    };
}
function Ue(...e) {
    return e.length === 0
        ? (t) => t
        : e.length === 1
        ? e[0]
        : e.reduce(
              (t, r) =>
                  (...n) =>
                      t(r(...n))
          );
}
function nn(...e) {
    return (t) => (r, n) => {
        const i = t(r, n);
        let s = () => {
            throw new Error(Q(15));
        };
        const o = { getState: i.getState, dispatch: (y, ...b) => s(y, ...b) },
            d = e.map((y) => y(o));
        return (s = Ue(...d)(i.dispatch)), { ...i, dispatch: s };
    };
}
function Sr(e) {
    return J(e) && "type" in e && typeof e.type == "string";
}
var wt = Symbol.for("immer-nothing"),
    we = Symbol.for("immer-draftable"),
    W = Symbol.for("immer-state");
function F(e, ...t) {
    throw new Error(
        `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
    );
}
var ae = Object.getPrototypeOf;
function Z(e) {
    return !!e && !!e[W];
}
function G(e) {
    var t;
    return e
        ? wr(e) ||
              Array.isArray(e) ||
              !!e[we] ||
              !!((t = e.constructor) != null && t[we]) ||
              Ae(e) ||
              Me(e)
        : !1;
}
var sn = Object.prototype.constructor.toString();
function wr(e) {
    if (!e || typeof e != "object") return !1;
    const t = ae(e);
    if (t === null) return !0;
    const r = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
    return r === Object
        ? !0
        : typeof r == "function" && Function.toString.call(r) === sn;
}
function on(e) {
    return Z(e) || F(15, e), e[W].base_;
}
function Ee(e, t) {
    le(e) === 0
        ? Reflect.ownKeys(e).forEach((r) => {
              t(r, e[r], e);
          })
        : e.forEach((r, n) => t(n, r, e));
}
function le(e) {
    const t = e[W];
    return t ? t.type_ : Array.isArray(e) ? 1 : Ae(e) ? 2 : Me(e) ? 3 : 0;
}
function xe(e, t) {
    return le(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function Ye(e, t) {
    return le(e) === 2 ? e.get(t) : e[t];
}
function _r(e, t, r) {
    const n = le(e);
    n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : (e[t] = r);
}
function un(e, t) {
    return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function Ae(e) {
    return e instanceof Map;
}
function Me(e) {
    return e instanceof Set;
}
function oe(e) {
    return e.copy_ || e.base_;
}
function lt(e, t) {
    if (Ae(e)) return new Map(e);
    if (Me(e)) return new Set(e);
    if (Array.isArray(e)) return Array.prototype.slice.call(e);
    const r = wr(e);
    if (t === !0 || (t === "class_only" && !r)) {
        const n = Object.getOwnPropertyDescriptors(e);
        delete n[W];
        let i = Reflect.ownKeys(n);
        for (let s = 0; s < i.length; s++) {
            const o = i[s],
                d = n[o];
            d.writable === !1 && ((d.writable = !0), (d.configurable = !0)),
                (d.get || d.set) &&
                    (n[o] = {
                        configurable: !0,
                        writable: !0,
                        enumerable: d.enumerable,
                        value: e[o],
                    });
        }
        return Object.create(ae(e), n);
    } else {
        const n = ae(e);
        if (n !== null && r) return { ...e };
        const i = Object.create(n);
        return Object.assign(i, e);
    }
}
function _t(e, t = !1) {
    return (
        Ve(e) ||
            Z(e) ||
            !G(e) ||
            (le(e) > 1 && (e.set = e.add = e.clear = e.delete = cn),
            Object.freeze(e),
            t && Object.entries(e).forEach(([r, n]) => _t(n, !0))),
        e
    );
}
function cn() {
    F(2);
}
function Ve(e) {
    return Object.isFrozen(e);
}
var ft = {};
function fe(e) {
    const t = ft[e];
    return t || F(0, e), t;
}
function an(e, t) {
    ft[e] || (ft[e] = t);
}
var Re;
function Or() {
    return Re;
}
function ln(e, t) {
    return {
        drafts_: [],
        parent_: e,
        immer_: t,
        canAutoFreeze_: !0,
        unfinalizedDrafts_: 0,
    };
}
function Nt(e, t) {
    t &&
        (fe("Patches"),
        (e.patches_ = []),
        (e.inversePatches_ = []),
        (e.patchListener_ = t));
}
function dt(e) {
    pt(e), e.drafts_.forEach(fn), (e.drafts_ = null);
}
function pt(e) {
    e === Re && (Re = e.parent_);
}
function qt(e) {
    return (Re = ln(Re, e));
}
function fn(e) {
    const t = e[W];
    t.type_ === 0 || t.type_ === 1 ? t.revoke_() : (t.revoked_ = !0);
}
function kt(e, t) {
    t.unfinalizedDrafts_ = t.drafts_.length;
    const r = t.drafts_[0];
    return (
        e !== void 0 && e !== r
            ? (r[W].modified_ && (dt(t), F(4)),
              G(e) && ((e = We(t, e)), t.parent_ || Ke(t, e)),
              t.patches_ &&
                  fe("Patches").generateReplacementPatches_(
                      r[W].base_,
                      e,
                      t.patches_,
                      t.inversePatches_
                  ))
            : (e = We(t, r, [])),
        dt(t),
        t.patches_ && t.patchListener_(t.patches_, t.inversePatches_),
        e !== wt ? e : void 0
    );
}
function We(e, t, r) {
    if (Ve(t)) return t;
    const n = t[W];
    if (!n) return Ee(t, (i, s) => zt(e, n, t, i, s, r)), t;
    if (n.scope_ !== e) return t;
    if (!n.modified_) return Ke(e, n.base_, !0), n.base_;
    if (!n.finalized_) {
        (n.finalized_ = !0), n.scope_.unfinalizedDrafts_--;
        const i = n.copy_;
        let s = i,
            o = !1;
        n.type_ === 3 && ((s = new Set(i)), i.clear(), (o = !0)),
            Ee(s, (d, y) => zt(e, n, i, d, y, r, o)),
            Ke(e, i, !1),
            r &&
                e.patches_ &&
                fe("Patches").generatePatches_(
                    n,
                    r,
                    e.patches_,
                    e.inversePatches_
                );
    }
    return n.copy_;
}
function zt(e, t, r, n, i, s, o) {
    if (Z(i)) {
        const d =
                s && t && t.type_ !== 3 && !xe(t.assigned_, n)
                    ? s.concat(n)
                    : void 0,
            y = We(e, i, d);
        if ((_r(r, n, y), Z(y))) e.canAutoFreeze_ = !1;
        else return;
    } else o && r.add(i);
    if (G(i) && !Ve(i)) {
        if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1) return;
        We(e, i),
            (!t || !t.scope_.parent_) &&
                typeof n != "symbol" &&
                Object.prototype.propertyIsEnumerable.call(r, n) &&
                Ke(e, i);
    }
}
function Ke(e, t, r = !1) {
    !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && _t(t, r);
}
function dn(e, t) {
    const r = Array.isArray(e),
        n = {
            type_: r ? 1 : 0,
            scope_: t ? t.scope_ : Or(),
            modified_: !1,
            finalized_: !1,
            assigned_: {},
            parent_: t,
            base_: e,
            draft_: null,
            copy_: null,
            revoke_: null,
            isManual_: !1,
        };
    let i = n,
        s = Ot;
    r && ((i = [n]), (s = Ce));
    const { revoke: o, proxy: d } = Proxy.revocable(i, s);
    return (n.draft_ = d), (n.revoke_ = o), d;
}
var Ot = {
        get(e, t) {
            if (t === W) return e;
            const r = oe(e);
            if (!xe(r, t)) return pn(e, r, t);
            const n = r[t];
            return e.finalized_ || !G(n)
                ? n
                : n === et(e.base_, t)
                ? (tt(e), (e.copy_[t] = ht(n, e)))
                : n;
        },
        has(e, t) {
            return t in oe(e);
        },
        ownKeys(e) {
            return Reflect.ownKeys(oe(e));
        },
        set(e, t, r) {
            const n = Er(oe(e), t);
            if (n != null && n.set) return n.set.call(e.draft_, r), !0;
            if (!e.modified_) {
                const i = et(oe(e), t),
                    s = i == null ? void 0 : i[W];
                if (s && s.base_ === r)
                    return (e.copy_[t] = r), (e.assigned_[t] = !1), !0;
                if (un(r, i) && (r !== void 0 || xe(e.base_, t))) return !0;
                tt(e), yt(e);
            }
            return (
                (e.copy_[t] === r && (r !== void 0 || t in e.copy_)) ||
                    (Number.isNaN(r) && Number.isNaN(e.copy_[t])) ||
                    ((e.copy_[t] = r), (e.assigned_[t] = !0)),
                !0
            );
        },
        deleteProperty(e, t) {
            return (
                et(e.base_, t) !== void 0 || t in e.base_
                    ? ((e.assigned_[t] = !1), tt(e), yt(e))
                    : delete e.assigned_[t],
                e.copy_ && delete e.copy_[t],
                !0
            );
        },
        getOwnPropertyDescriptor(e, t) {
            const r = oe(e),
                n = Reflect.getOwnPropertyDescriptor(r, t);
            return (
                n && {
                    writable: !0,
                    configurable: e.type_ !== 1 || t !== "length",
                    enumerable: n.enumerable,
                    value: r[t],
                }
            );
        },
        defineProperty() {
            F(11);
        },
        getPrototypeOf(e) {
            return ae(e.base_);
        },
        setPrototypeOf() {
            F(12);
        },
    },
    Ce = {};
Ee(Ot, (e, t) => {
    Ce[e] = function () {
        return (arguments[0] = arguments[0][0]), t.apply(this, arguments);
    };
});
Ce.deleteProperty = function (e, t) {
    return Ce.set.call(this, e, t, void 0);
};
Ce.set = function (e, t, r) {
    return Ot.set.call(this, e[0], t, r, e[0]);
};
function et(e, t) {
    const r = e[W];
    return (r ? oe(r) : e)[t];
}
function pn(e, t, r) {
    var i;
    const n = Er(t, r);
    return n
        ? "value" in n
            ? n.value
            : (i = n.get) == null
            ? void 0
            : i.call(e.draft_)
        : void 0;
}
function Er(e, t) {
    if (!(t in e)) return;
    let r = ae(e);
    for (; r; ) {
        const n = Object.getOwnPropertyDescriptor(r, t);
        if (n) return n;
        r = ae(r);
    }
}
function yt(e) {
    e.modified_ || ((e.modified_ = !0), e.parent_ && yt(e.parent_));
}
function tt(e) {
    e.copy_ || (e.copy_ = lt(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var yn = class {
    constructor(e) {
        (this.autoFreeze_ = !0),
            (this.useStrictShallowCopy_ = !1),
            (this.produce = (t, r, n) => {
                if (typeof t == "function" && typeof r != "function") {
                    const s = r;
                    r = t;
                    const o = this;
                    return function (y = s, ...b) {
                        return o.produce(y, (S) => r.call(this, S, ...b));
                    };
                }
                typeof r != "function" && F(6),
                    n !== void 0 && typeof n != "function" && F(7);
                let i;
                if (G(t)) {
                    const s = qt(this),
                        o = ht(t, void 0);
                    let d = !0;
                    try {
                        (i = r(o)), (d = !1);
                    } finally {
                        d ? dt(s) : pt(s);
                    }
                    return Nt(s, n), kt(i, s);
                } else if (!t || typeof t != "object") {
                    if (
                        ((i = r(t)),
                        i === void 0 && (i = t),
                        i === wt && (i = void 0),
                        this.autoFreeze_ && _t(i, !0),
                        n)
                    ) {
                        const s = [],
                            o = [];
                        fe("Patches").generateReplacementPatches_(t, i, s, o),
                            n(s, o);
                    }
                    return i;
                } else F(1, t);
            }),
            (this.produceWithPatches = (t, r) => {
                if (typeof t == "function")
                    return (o, ...d) =>
                        this.produceWithPatches(o, (y) => t(y, ...d));
                let n, i;
                return [
                    this.produce(t, r, (o, d) => {
                        (n = o), (i = d);
                    }),
                    n,
                    i,
                ];
            }),
            typeof (e == null ? void 0 : e.autoFreeze) == "boolean" &&
                this.setAutoFreeze(e.autoFreeze),
            typeof (e == null ? void 0 : e.useStrictShallowCopy) == "boolean" &&
                this.setUseStrictShallowCopy(e.useStrictShallowCopy);
    }
    createDraft(e) {
        G(e) || F(8), Z(e) && (e = hn(e));
        const t = qt(this),
            r = ht(e, void 0);
        return (r[W].isManual_ = !0), pt(t), r;
    }
    finishDraft(e, t) {
        const r = e && e[W];
        (!r || !r.isManual_) && F(9);
        const { scope_: n } = r;
        return Nt(n, t), kt(void 0, n);
    }
    setAutoFreeze(e) {
        this.autoFreeze_ = e;
    }
    setUseStrictShallowCopy(e) {
        this.useStrictShallowCopy_ = e;
    }
    applyPatches(e, t) {
        let r;
        for (r = t.length - 1; r >= 0; r--) {
            const i = t[r];
            if (i.path.length === 0 && i.op === "replace") {
                e = i.value;
                break;
            }
        }
        r > -1 && (t = t.slice(r + 1));
        const n = fe("Patches").applyPatches_;
        return Z(e) ? n(e, t) : this.produce(e, (i) => n(i, t));
    }
};
function ht(e, t) {
    const r = Ae(e)
        ? fe("MapSet").proxyMap_(e, t)
        : Me(e)
        ? fe("MapSet").proxySet_(e, t)
        : dn(e, t);
    return (t ? t.scope_ : Or()).drafts_.push(r), r;
}
function hn(e) {
    return Z(e) || F(10, e), xr(e);
}
function xr(e) {
    if (!G(e) || Ve(e)) return e;
    const t = e[W];
    let r;
    if (t) {
        if (!t.modified_) return t.base_;
        (t.finalized_ = !0), (r = lt(e, t.scope_.immer_.useStrictShallowCopy_));
    } else r = lt(e, !0);
    return (
        Ee(r, (n, i) => {
            _r(r, n, xr(i));
        }),
        t && (t.finalized_ = !1),
        r
    );
}
function mn() {
    const t = "replace",
        r = "add",
        n = "remove";
    function i(l, f, h, p) {
        switch (l.type_) {
            case 0:
            case 2:
                return o(l, f, h, p);
            case 1:
                return s(l, f, h, p);
            case 3:
                return d(l, f, h, p);
        }
    }
    function s(l, f, h, p) {
        let { base_: v, assigned_: _ } = l,
            a = l.copy_;
        a.length < v.length && (([v, a] = [a, v]), ([h, p] = [p, h]));
        for (let u = 0; u < v.length; u++)
            if (_[u] && a[u] !== v[u]) {
                const c = f.concat([u]);
                h.push({ op: t, path: c, value: g(a[u]) }),
                    p.push({ op: t, path: c, value: g(v[u]) });
            }
        for (let u = v.length; u < a.length; u++) {
            const c = f.concat([u]);
            h.push({ op: r, path: c, value: g(a[u]) });
        }
        for (let u = a.length - 1; v.length <= u; --u) {
            const c = f.concat([u]);
            p.push({ op: n, path: c });
        }
    }
    function o(l, f, h, p) {
        const { base_: v, copy_: _ } = l;
        Ee(l.assigned_, (a, u) => {
            const c = Ye(v, a),
                O = Ye(_, a),
                w = u ? (xe(v, a) ? t : r) : n;
            if (c === O && w === t) return;
            const m = f.concat(a);
            h.push(w === n ? { op: w, path: m } : { op: w, path: m, value: O }),
                p.push(
                    w === r
                        ? { op: n, path: m }
                        : w === n
                        ? { op: r, path: m, value: g(c) }
                        : { op: t, path: m, value: g(c) }
                );
        });
    }
    function d(l, f, h, p) {
        let { base_: v, copy_: _ } = l,
            a = 0;
        v.forEach((u) => {
            if (!_.has(u)) {
                const c = f.concat([a]);
                h.push({ op: n, path: c, value: u }),
                    p.unshift({ op: r, path: c, value: u });
            }
            a++;
        }),
            (a = 0),
            _.forEach((u) => {
                if (!v.has(u)) {
                    const c = f.concat([a]);
                    h.push({ op: r, path: c, value: u }),
                        p.unshift({ op: n, path: c, value: u });
                }
                a++;
            });
    }
    function y(l, f, h, p) {
        h.push({ op: t, path: [], value: f === wt ? void 0 : f }),
            p.push({ op: t, path: [], value: l });
    }
    function b(l, f) {
        return (
            f.forEach((h) => {
                const { path: p, op: v } = h;
                let _ = l;
                for (let O = 0; O < p.length - 1; O++) {
                    const w = le(_);
                    let m = p[O];
                    typeof m != "string" &&
                        typeof m != "number" &&
                        (m = "" + m),
                        (w === 0 || w === 1) &&
                            (m === "__proto__" || m === "constructor") &&
                            F(19),
                        typeof _ == "function" && m === "prototype" && F(19),
                        (_ = Ye(_, m)),
                        typeof _ != "object" && F(18, p.join("/"));
                }
                const a = le(_),
                    u = S(h.value),
                    c = p[p.length - 1];
                switch (v) {
                    case t:
                        switch (a) {
                            case 2:
                                return _.set(c, u);
                            case 3:
                                F(16);
                            default:
                                return (_[c] = u);
                        }
                    case r:
                        switch (a) {
                            case 1:
                                return c === "-"
                                    ? _.push(u)
                                    : _.splice(c, 0, u);
                            case 2:
                                return _.set(c, u);
                            case 3:
                                return _.add(u);
                            default:
                                return (_[c] = u);
                        }
                    case n:
                        switch (a) {
                            case 1:
                                return _.splice(c, 1);
                            case 2:
                                return _.delete(c);
                            case 3:
                                return _.delete(h.value);
                            default:
                                return delete _[c];
                        }
                    default:
                        F(17, v);
                }
            }),
            l
        );
    }
    function S(l) {
        if (!G(l)) return l;
        if (Array.isArray(l)) return l.map(S);
        if (Ae(l))
            return new Map(Array.from(l.entries()).map(([h, p]) => [h, S(p)]));
        if (Me(l)) return new Set(Array.from(l).map(S));
        const f = Object.create(ae(l));
        for (const h in l) f[h] = S(l[h]);
        return xe(l, we) && (f[we] = l[we]), f;
    }
    function g(l) {
        return Z(l) ? S(l) : l;
    }
    an("Patches", {
        applyPatches_: b,
        generatePatches_: i,
        generateReplacementPatches_: y,
    });
}
var B = new yn(),
    Ie = B.produce,
    Rr = B.produceWithPatches.bind(B);
B.setAutoFreeze.bind(B);
B.setUseStrictShallowCopy.bind(B);
var Qt = B.applyPatches.bind(B);
B.createDraft.bind(B);
B.finishDraft.bind(B);
function gn(e, t = `expected a function, instead received ${typeof e}`) {
    if (typeof e != "function") throw new TypeError(t);
}
function vn(e, t = `expected an object, instead received ${typeof e}`) {
    if (typeof e != "object") throw new TypeError(t);
}
function bn(
    e,
    t = "expected all items to be functions, instead received the following types: "
) {
    if (!e.every((r) => typeof r == "function")) {
        const r = e
            .map((n) =>
                typeof n == "function"
                    ? `function ${n.name || "unnamed"}()`
                    : typeof n
            )
            .join(", ");
        throw new TypeError(`${t}[${r}]`);
    }
}
var Ft = (e) => (Array.isArray(e) ? e : [e]);
function Sn(e) {
    const t = Array.isArray(e[0]) ? e[0] : e;
    return (
        bn(
            t,
            "createSelector expects all input-selectors to be functions, but received the following types: "
        ),
        t
    );
}
function wn(e, t) {
    const r = [],
        { length: n } = e;
    for (let i = 0; i < n; i++) r.push(e[i].apply(null, t));
    return r;
}
var _n = class {
        constructor(e) {
            this.value = e;
        }
        deref() {
            return this.value;
        }
    },
    On = typeof WeakRef < "u" ? WeakRef : _n,
    En = 0,
    $t = 1;
function Te() {
    return { s: En, v: void 0, o: null, p: null };
}
function Be(e, t = {}) {
    let r = Te();
    const { resultEqualityCheck: n } = t;
    let i,
        s = 0;
    function o() {
        var g;
        let d = r;
        const { length: y } = arguments;
        for (let l = 0, f = y; l < f; l++) {
            const h = arguments[l];
            if (
                typeof h == "function" ||
                (typeof h == "object" && h !== null)
            ) {
                let p = d.o;
                p === null && (d.o = p = new WeakMap());
                const v = p.get(h);
                v === void 0 ? ((d = Te()), p.set(h, d)) : (d = v);
            } else {
                let p = d.p;
                p === null && (d.p = p = new Map());
                const v = p.get(h);
                v === void 0 ? ((d = Te()), p.set(h, d)) : (d = v);
            }
        }
        const b = d;
        let S;
        if (d.s === $t) S = d.v;
        else if (((S = e.apply(null, arguments)), s++, n)) {
            const l =
                ((g = i == null ? void 0 : i.deref) == null
                    ? void 0
                    : g.call(i)) ?? i;
            l != null && n(l, S) && ((S = l), s !== 0 && s--),
                (i =
                    (typeof S == "object" && S !== null) ||
                    typeof S == "function"
                        ? new On(S)
                        : S);
        }
        return (b.s = $t), (b.v = S), S;
    }
    return (
        (o.clearCache = () => {
            (r = Te()), o.resetResultsCount();
        }),
        (o.resultsCount = () => s),
        (o.resetResultsCount = () => {
            s = 0;
        }),
        o
    );
}
function xn(e, ...t) {
    const r = typeof e == "function" ? { memoize: e, memoizeOptions: t } : e,
        n = (...i) => {
            let s = 0,
                o = 0,
                d,
                y = {},
                b = i.pop();
            typeof b == "object" && ((y = b), (b = i.pop())),
                gn(
                    b,
                    `createSelector expects an output function after the inputs, but received: [${typeof b}]`
                );
            const S = { ...r, ...y },
                {
                    memoize: g,
                    memoizeOptions: l = [],
                    argsMemoize: f = Be,
                    argsMemoizeOptions: h = [],
                    devModeChecks: p = {},
                } = S,
                v = Ft(l),
                _ = Ft(h),
                a = Sn(i),
                u = g(function () {
                    return s++, b.apply(null, arguments);
                }, ...v),
                c = f(function () {
                    o++;
                    const w = wn(a, arguments);
                    return (d = u.apply(null, w)), d;
                }, ..._);
            return Object.assign(c, {
                resultFunc: b,
                memoizedResultFunc: u,
                dependencies: a,
                dependencyRecomputations: () => o,
                resetDependencyRecomputations: () => {
                    o = 0;
                },
                lastResult: () => d,
                recomputations: () => s,
                resetRecomputations: () => {
                    s = 0;
                },
                memoize: g,
                argsMemoize: f,
            });
        };
    return Object.assign(n, { withTypes: () => n }), n;
}
var Et = xn(Be),
    Rn = Object.assign(
        (e, t = Et) => {
            vn(
                e,
                `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`
            );
            const r = Object.keys(e),
                n = r.map((s) => e[s]);
            return t(n, (...s) =>
                s.reduce((o, d, y) => ((o[r[y]] = d), o), {})
            );
        },
        { withTypes: () => Rn }
    );
function Cr(e) {
    return ({ dispatch: r, getState: n }) =>
        (i) =>
        (s) =>
            typeof s == "function" ? s(r, n, e) : i(s);
}
var Cn = Cr(),
    jn = Cr,
    Pn =
        typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            : function () {
                  if (arguments.length !== 0)
                      return typeof arguments[0] == "object"
                          ? Ue
                          : Ue.apply(null, arguments);
              },
    An = (e) => e && typeof e.match == "function";
function H(e, t) {
    function r(...n) {
        if (t) {
            let i = t(...n);
            if (!i) throw new Error(V(0));
            return {
                type: e,
                payload: i.payload,
                ...("meta" in i && { meta: i.meta }),
                ...("error" in i && { error: i.error }),
            };
        }
        return { type: e, payload: n[0] };
    }
    return (
        (r.toString = () => `${e}`),
        (r.type = e),
        (r.match = (n) => Sr(n) && n.type === e),
        r
    );
}
var jr = class Se extends Array {
    constructor(...t) {
        super(...t), Object.setPrototypeOf(this, Se.prototype);
    }
    static get [Symbol.species]() {
        return Se;
    }
    concat(...t) {
        return super.concat.apply(this, t);
    }
    prepend(...t) {
        return t.length === 1 && Array.isArray(t[0])
            ? new Se(...t[0].concat(this))
            : new Se(...t.concat(this));
    }
};
function Lt(e) {
    return G(e) ? Ie(e, () => {}) : e;
}
function Ut(e, t, r) {
    return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
}
function Mn(e) {
    return typeof e == "boolean";
}
var In = () =>
        function (t) {
            const {
                thunk: r = !0,
                immutableCheck: n = !0,
                serializableCheck: i = !0,
                actionCreatorCheck: s = !0,
            } = t ?? {};
            let o = new jr();
            return r && (Mn(r) ? o.push(Cn) : o.push(jn(r.extraArgument))), o;
        },
    ue = "RTK_autoBatch",
    ge = () => (e) => ({ payload: e, meta: { [ue]: !0 } }),
    Wt = (e) => (t) => {
        setTimeout(t, e);
    },
    Dn =
        (e = { type: "raf" }) =>
        (t) =>
        (...r) => {
            const n = t(...r);
            let i = !0,
                s = !1,
                o = !1;
            const d = new Set(),
                y =
                    e.type === "tick"
                        ? queueMicrotask
                        : e.type === "raf"
                        ? typeof window < "u" && window.requestAnimationFrame
                            ? window.requestAnimationFrame
                            : Wt(10)
                        : e.type === "callback"
                        ? e.queueNotification
                        : Wt(e.timeout),
                b = () => {
                    (o = !1), s && ((s = !1), d.forEach((S) => S()));
                };
            return Object.assign({}, n, {
                subscribe(S) {
                    const g = () => i && S(),
                        l = n.subscribe(g);
                    return (
                        d.add(S),
                        () => {
                            l(), d.delete(S);
                        }
                    );
                },
                dispatch(S) {
                    var g;
                    try {
                        return (
                            (i = !(
                                (g = S == null ? void 0 : S.meta) != null &&
                                g[ue]
                            )),
                            (s = !i),
                            s && (o || ((o = !0), y(b))),
                            n.dispatch(S)
                        );
                    } finally {
                        i = !0;
                    }
                },
            });
        },
    Tn = (e) =>
        function (r) {
            const { autoBatch: n = !0 } = r ?? {};
            let i = new jr(e);
            return n && i.push(Dn(typeof n == "object" ? n : void 0)), i;
        };
function Ls(e) {
    const t = In(),
        {
            reducer: r = void 0,
            middleware: n,
            devTools: i = !0,
            preloadedState: s = void 0,
            enhancers: o = void 0,
        } = e || {};
    let d;
    if (typeof r == "function") d = r;
    else if (J(r)) d = br(r);
    else throw new Error(V(1));
    let y;
    typeof n == "function" ? (y = n(t)) : (y = t());
    let b = Ue;
    i && (b = Pn({ trace: !1, ...(typeof i == "object" && i) }));
    const S = nn(...y),
        g = Tn(S);
    let l = typeof o == "function" ? o(g) : g();
    const f = b(...l);
    return St(d, s, f);
}
function Pr(e) {
    const t = {},
        r = [];
    let n;
    const i = {
        addCase(s, o) {
            const d = typeof s == "string" ? s : s.type;
            if (!d) throw new Error(V(28));
            if (d in t) throw new Error(V(29));
            return (t[d] = o), i;
        },
        addMatcher(s, o) {
            return r.push({ matcher: s, reducer: o }), i;
        },
        addDefaultCase(s) {
            return (n = s), i;
        },
    };
    return e(i), [t, r, n];
}
function Nn(e) {
    return typeof e == "function";
}
function qn(e, t) {
    let [r, n, i] = Pr(t),
        s;
    if (Nn(e)) s = () => Lt(e());
    else {
        const d = Lt(e);
        s = () => d;
    }
    function o(d = s(), y) {
        let b = [
            r[y.type],
            ...n.filter(({ matcher: S }) => S(y)).map(({ reducer: S }) => S),
        ];
        return (
            b.filter((S) => !!S).length === 0 && (b = [i]),
            b.reduce((S, g) => {
                if (g)
                    if (Z(S)) {
                        const f = g(S, y);
                        return f === void 0 ? S : f;
                    } else {
                        if (G(S)) return Ie(S, (l) => g(l, y));
                        {
                            const l = g(S, y);
                            if (l === void 0) {
                                if (S === null) return S;
                                throw Error(
                                    "A case reducer on a non-draftable value must not return undefined"
                                );
                            }
                            return l;
                        }
                    }
                return S;
            }, d)
        );
    }
    return (o.getInitialState = s), o;
}
var Ar = (e, t) => (An(e) ? e.match(t) : e(t));
function Y(...e) {
    return (t) => e.some((r) => Ar(r, t));
}
function _e(...e) {
    return (t) => e.every((r) => Ar(r, t));
}
function Ge(e, t) {
    if (!e || !e.meta) return !1;
    const r = typeof e.meta.requestId == "string",
        n = t.indexOf(e.meta.requestStatus) > -1;
    return r && n;
}
function De(e) {
    return (
        typeof e[0] == "function" &&
        "pending" in e[0] &&
        "fulfilled" in e[0] &&
        "rejected" in e[0]
    );
}
function xt(...e) {
    return e.length === 0
        ? (t) => Ge(t, ["pending"])
        : De(e)
        ? Y(...e.map((t) => t.pending))
        : xt()(e[0]);
}
function me(...e) {
    return e.length === 0
        ? (t) => Ge(t, ["rejected"])
        : De(e)
        ? Y(...e.map((t) => t.rejected))
        : me()(e[0]);
}
function Je(...e) {
    const t = (r) => r && r.meta && r.meta.rejectedWithValue;
    return e.length === 0
        ? _e(me(...e), t)
        : De(e)
        ? _e(me(...e), t)
        : Je()(e[0]);
}
function ne(...e) {
    return e.length === 0
        ? (t) => Ge(t, ["fulfilled"])
        : De(e)
        ? Y(...e.map((t) => t.fulfilled))
        : ne()(e[0]);
}
function mt(...e) {
    return e.length === 0
        ? (t) => Ge(t, ["pending", "fulfilled", "rejected"])
        : De(e)
        ? Y(...e.flatMap((t) => [t.pending, t.rejected, t.fulfilled]))
        : mt()(e[0]);
}
var kn = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW",
    Rt = (e = 21) => {
        let t = "",
            r = e;
        for (; r--; ) t += kn[(Math.random() * 64) | 0];
        return t;
    },
    zn = ["name", "message", "stack", "code"],
    rt = class {
        constructor(e, t) {
            Ze(this, "_type");
            (this.payload = e), (this.meta = t);
        }
    },
    Kt = class {
        constructor(e, t) {
            Ze(this, "_type");
            (this.payload = e), (this.meta = t);
        }
    },
    Qn = (e) => {
        if (typeof e == "object" && e !== null) {
            const t = {};
            for (const r of zn) typeof e[r] == "string" && (t[r] = e[r]);
            return t;
        }
        return { message: String(e) };
    },
    Bt = (() => {
        function e(t, r, n) {
            const i = H(t + "/fulfilled", (y, b, S, g) => ({
                    payload: y,
                    meta: {
                        ...(g || {}),
                        arg: S,
                        requestId: b,
                        requestStatus: "fulfilled",
                    },
                })),
                s = H(t + "/pending", (y, b, S) => ({
                    payload: void 0,
                    meta: {
                        ...(S || {}),
                        arg: b,
                        requestId: y,
                        requestStatus: "pending",
                    },
                })),
                o = H(t + "/rejected", (y, b, S, g, l) => ({
                    payload: g,
                    error: ((n && n.serializeError) || Qn)(y || "Rejected"),
                    meta: {
                        ...(l || {}),
                        arg: S,
                        requestId: b,
                        rejectedWithValue: !!g,
                        requestStatus: "rejected",
                        aborted: (y == null ? void 0 : y.name) === "AbortError",
                        condition:
                            (y == null ? void 0 : y.name) === "ConditionError",
                    },
                }));
            function d(y) {
                return (b, S, g) => {
                    const l =
                            n != null && n.idGenerator
                                ? n.idGenerator(y)
                                : Rt(),
                        f = new AbortController();
                    let h, p;
                    function v(a) {
                        (p = a), f.abort();
                    }
                    const _ = (async function () {
                        var c, O;
                        let a;
                        try {
                            let w =
                                (c = n == null ? void 0 : n.condition) == null
                                    ? void 0
                                    : c.call(n, y, { getState: S, extra: g });
                            if (
                                ($n(w) && (w = await w),
                                w === !1 || f.signal.aborted)
                            )
                                throw {
                                    name: "ConditionError",
                                    message:
                                        "Aborted due to condition callback returning false.",
                                };
                            const m = new Promise((E, x) => {
                                (h = () => {
                                    x({
                                        name: "AbortError",
                                        message: p || "Aborted",
                                    });
                                }),
                                    f.signal.addEventListener("abort", h);
                            });
                            b(
                                s(
                                    l,
                                    y,
                                    (O =
                                        n == null
                                            ? void 0
                                            : n.getPendingMeta) == null
                                        ? void 0
                                        : O.call(
                                              n,
                                              { requestId: l, arg: y },
                                              { getState: S, extra: g }
                                          )
                                )
                            ),
                                (a = await Promise.race([
                                    m,
                                    Promise.resolve(
                                        r(y, {
                                            dispatch: b,
                                            getState: S,
                                            extra: g,
                                            requestId: l,
                                            signal: f.signal,
                                            abort: v,
                                            rejectWithValue: (E, x) =>
                                                new rt(E, x),
                                            fulfillWithValue: (E, x) =>
                                                new Kt(E, x),
                                        })
                                    ).then((E) => {
                                        if (E instanceof rt) throw E;
                                        return E instanceof Kt
                                            ? i(E.payload, l, y, E.meta)
                                            : i(E, l, y);
                                    }),
                                ]));
                        } catch (w) {
                            a =
                                w instanceof rt
                                    ? o(null, l, y, w.payload, w.meta)
                                    : o(w, l, y);
                        } finally {
                            h && f.signal.removeEventListener("abort", h);
                        }
                        return (
                            (n &&
                                !n.dispatchConditionRejection &&
                                o.match(a) &&
                                a.meta.condition) ||
                                b(a),
                            a
                        );
                    })();
                    return Object.assign(_, {
                        abort: v,
                        requestId: l,
                        arg: y,
                        unwrap() {
                            return _.then(Fn);
                        },
                    });
                };
            }
            return Object.assign(d, {
                pending: s,
                rejected: o,
                fulfilled: i,
                settled: Y(o, i),
                typePrefix: t,
            });
        }
        return (e.withTypes = () => e), e;
    })();
function Fn(e) {
    if (e.meta && e.meta.rejectedWithValue) throw e.payload;
    if (e.error) throw e.error;
    return e.payload;
}
function $n(e) {
    return e !== null && typeof e == "object" && typeof e.then == "function";
}
var Ln = Symbol.for("rtk-slice-createasyncthunk");
function Un(e, t) {
    return `${e}/${t}`;
}
function Wn({ creators: e } = {}) {
    var r;
    const t = (r = e == null ? void 0 : e.asyncThunk) == null ? void 0 : r[Ln];
    return function (i) {
        const { name: s, reducerPath: o = s } = i;
        if (!s) throw new Error(V(11));
        const d =
                (typeof i.reducers == "function"
                    ? i.reducers(Bn())
                    : i.reducers) || {},
            y = Object.keys(d),
            b = {
                sliceCaseReducersByName: {},
                sliceCaseReducersByType: {},
                actionCreators: {},
                sliceMatchers: [],
            },
            S = {
                addCase(u, c) {
                    const O = typeof u == "string" ? u : u.type;
                    if (!O) throw new Error(V(12));
                    if (O in b.sliceCaseReducersByType) throw new Error(V(13));
                    return (b.sliceCaseReducersByType[O] = c), S;
                },
                addMatcher(u, c) {
                    return b.sliceMatchers.push({ matcher: u, reducer: c }), S;
                },
                exposeAction(u, c) {
                    return (b.actionCreators[u] = c), S;
                },
                exposeCaseReducer(u, c) {
                    return (b.sliceCaseReducersByName[u] = c), S;
                },
            };
        y.forEach((u) => {
            const c = d[u],
                O = {
                    reducerName: u,
                    type: Un(s, u),
                    createNotation: typeof i.reducers == "function",
                };
            Vn(c) ? Jn(O, c, S, t) : Hn(O, c, S);
        });
        function g() {
            const [u = {}, c = [], O = void 0] =
                    typeof i.extraReducers == "function"
                        ? Pr(i.extraReducers)
                        : [i.extraReducers],
                w = { ...u, ...b.sliceCaseReducersByType };
            return qn(i.initialState, (m) => {
                for (let E in w) m.addCase(E, w[E]);
                for (let E of b.sliceMatchers)
                    m.addMatcher(E.matcher, E.reducer);
                for (let E of c) m.addMatcher(E.matcher, E.reducer);
                O && m.addDefaultCase(O);
            });
        }
        const l = (u) => u,
            f = new Map();
        let h;
        function p(u, c) {
            return h || (h = g()), h(u, c);
        }
        function v() {
            return h || (h = g()), h.getInitialState();
        }
        function _(u, c = !1) {
            function O(m) {
                let E = m[u];
                return typeof E > "u" && c && (E = v()), E;
            }
            function w(m = l) {
                const E = Ut(f, c, () => new WeakMap());
                return Ut(E, m, () => {
                    const x = {};
                    for (const [R, C] of Object.entries(i.selectors ?? {}))
                        x[R] = Kn(C, m, v, c);
                    return x;
                });
            }
            return {
                reducerPath: u,
                getSelectors: w,
                get selectors() {
                    return w(O);
                },
                selectSlice: O,
            };
        }
        const a = {
            name: s,
            reducer: p,
            actions: b.actionCreators,
            caseReducers: b.sliceCaseReducersByName,
            getInitialState: v,
            ..._(o),
            injectInto(u, { reducerPath: c, ...O } = {}) {
                const w = c ?? o;
                return (
                    u.inject({ reducerPath: w, reducer: p }, O),
                    { ...a, ..._(w, !0) }
                );
            },
        };
        return a;
    };
}
function Kn(e, t, r, n) {
    function i(s, ...o) {
        let d = t(s);
        return typeof d > "u" && n && (d = r()), e(d, ...o);
    }
    return (i.unwrapped = e), i;
}
var de = Wn();
function Bn() {
    function e(t, r) {
        return {
            _reducerDefinitionType: "asyncThunk",
            payloadCreator: t,
            ...r,
        };
    }
    return (
        (e.withTypes = () => e),
        {
            reducer(t) {
                return Object.assign(
                    {
                        [t.name](...r) {
                            return t(...r);
                        },
                    }[t.name],
                    { _reducerDefinitionType: "reducer" }
                );
            },
            preparedReducer(t, r) {
                return {
                    _reducerDefinitionType: "reducerWithPrepare",
                    prepare: t,
                    reducer: r,
                };
            },
            asyncThunk: e,
        }
    );
}
function Hn({ type: e, reducerName: t, createNotation: r }, n, i) {
    let s, o;
    if ("reducer" in n) {
        if (r && !Gn(n)) throw new Error(V(17));
        (s = n.reducer), (o = n.prepare);
    } else s = n;
    i.addCase(e, s)
        .exposeCaseReducer(t, s)
        .exposeAction(t, o ? H(e, o) : H(e));
}
function Vn(e) {
    return e._reducerDefinitionType === "asyncThunk";
}
function Gn(e) {
    return e._reducerDefinitionType === "reducerWithPrepare";
}
function Jn({ type: e, reducerName: t }, r, n, i) {
    if (!i) throw new Error(V(18));
    const {
            payloadCreator: s,
            fulfilled: o,
            pending: d,
            rejected: y,
            settled: b,
            options: S,
        } = r,
        g = i(e, s, S);
    n.exposeAction(t, g),
        o && n.addCase(g.fulfilled, o),
        d && n.addCase(g.pending, d),
        y && n.addCase(g.rejected, y),
        b && n.addMatcher(g.settled, b),
        n.exposeCaseReducer(t, {
            fulfilled: o || Ne,
            pending: d || Ne,
            rejected: y || Ne,
            settled: b || Ne,
        });
}
function Ne() {}
function V(e) {
    return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var nt = { exports: {} },
    it = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ht;
function Zn() {
    if (Ht) return it;
    Ht = 1;
    var e = Xr();
    function t(y, b) {
        return (
            (y === b && (y !== 0 || 1 / y === 1 / b)) || (y !== y && b !== b)
        );
    }
    var r = typeof Object.is == "function" ? Object.is : t,
        n = e.useSyncExternalStore,
        i = e.useRef,
        s = e.useEffect,
        o = e.useMemo,
        d = e.useDebugValue;
    return (
        (it.useSyncExternalStoreWithSelector = function (y, b, S, g, l) {
            var f = i(null);
            if (f.current === null) {
                var h = { hasValue: !1, value: null };
                f.current = h;
            } else h = f.current;
            f = o(
                function () {
                    function v(O) {
                        if (!_) {
                            if (
                                ((_ = !0),
                                (a = O),
                                (O = g(O)),
                                l !== void 0 && h.hasValue)
                            ) {
                                var w = h.value;
                                if (l(w, O)) return (u = w);
                            }
                            return (u = O);
                        }
                        if (((w = u), r(a, O))) return w;
                        var m = g(O);
                        return l !== void 0 && l(w, m)
                            ? ((a = O), w)
                            : ((a = O), (u = m));
                    }
                    var _ = !1,
                        a,
                        u,
                        c = S === void 0 ? null : S;
                    return [
                        function () {
                            return v(b());
                        },
                        c === null
                            ? void 0
                            : function () {
                                  return v(c());
                              },
                    ];
                },
                [b, S, g, l]
            );
            var p = n(y, f[0], f[1]);
            return (
                s(
                    function () {
                        (h.hasValue = !0), (h.value = p);
                    },
                    [p]
                ),
                d(p),
                p
            );
        }),
        it
    );
}
var Vt;
function Xn() {
    return Vt || ((Vt = 1), (nt.exports = Zn())), nt.exports;
}
var Yn = Xn();
function Mr(e) {
    e();
}
function ei() {
    let e = null,
        t = null;
    return {
        clear() {
            (e = null), (t = null);
        },
        notify() {
            Mr(() => {
                let r = e;
                for (; r; ) r.callback(), (r = r.next);
            });
        },
        get() {
            const r = [];
            let n = e;
            for (; n; ) r.push(n), (n = n.next);
            return r;
        },
        subscribe(r) {
            let n = !0;
            const i = (t = { callback: r, next: null, prev: t });
            return (
                i.prev ? (i.prev.next = i) : (e = i),
                function () {
                    !n ||
                        e === null ||
                        ((n = !1),
                        i.next ? (i.next.prev = i.prev) : (t = i.prev),
                        i.prev ? (i.prev.next = i.next) : (e = i.next));
                }
            );
        },
    };
}
var Gt = { notify() {}, get: () => [] };
function ti(e, t) {
    let r,
        n = Gt,
        i = 0,
        s = !1;
    function o(p) {
        S();
        const v = n.subscribe(p);
        let _ = !1;
        return () => {
            _ || ((_ = !0), v(), g());
        };
    }
    function d() {
        n.notify();
    }
    function y() {
        h.onStateChange && h.onStateChange();
    }
    function b() {
        return s;
    }
    function S() {
        i++, r || ((r = e.subscribe(y)), (n = ei()));
    }
    function g() {
        i--, r && i === 0 && (r(), (r = void 0), n.clear(), (n = Gt));
    }
    function l() {
        s || ((s = !0), S());
    }
    function f() {
        s && ((s = !1), g());
    }
    const h = {
        addNestedSub: o,
        notifyNestedSubs: d,
        handleChangeWrapper: y,
        isSubscribed: b,
        trySubscribe: l,
        tryUnsubscribe: f,
        getListeners: () => n,
    };
    return h;
}
var ri = () =>
        typeof window < "u" &&
        typeof window.document < "u" &&
        typeof window.document.createElement < "u",
    ni = ri(),
    ii = () => typeof navigator < "u" && navigator.product === "ReactNative",
    si = ii(),
    oi = () => (ni || si ? I.useLayoutEffect : I.useEffect),
    ui = oi();
function Jt(e, t) {
    return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function Oe(e, t) {
    if (Jt(e, t)) return !0;
    if (
        typeof e != "object" ||
        e === null ||
        typeof t != "object" ||
        t === null
    )
        return !1;
    const r = Object.keys(e),
        n = Object.keys(t);
    if (r.length !== n.length) return !1;
    for (let i = 0; i < r.length; i++)
        if (
            !Object.prototype.hasOwnProperty.call(t, r[i]) ||
            !Jt(e[r[i]], t[r[i]])
        )
            return !1;
    return !0;
}
var st = Symbol.for("react-redux-context"),
    ot = typeof globalThis < "u" ? globalThis : {};
function ci() {
    if (!I.createContext) return {};
    const e = ot[st] ?? (ot[st] = new Map());
    let t = e.get(I.createContext);
    return t || ((t = I.createContext(null)), e.set(I.createContext, t)), t;
}
var ie = ci();
function ai(e) {
    const { children: t, context: r, serverState: n, store: i } = e,
        s = I.useMemo(() => {
            const y = ti(i);
            return {
                store: i,
                subscription: y,
                getServerState: n ? () => n : void 0,
            };
        }, [i, n]),
        o = I.useMemo(() => i.getState(), [i]);
    ui(() => {
        const { subscription: y } = s;
        return (
            (y.onStateChange = y.notifyNestedSubs),
            y.trySubscribe(),
            o !== i.getState() && y.notifyNestedSubs(),
            () => {
                y.tryUnsubscribe(), (y.onStateChange = void 0);
            }
        );
    }, [s, o]);
    const d = r || ie;
    return I.createElement(d.Provider, { value: s }, t);
}
var Us = ai;
function Ct(e = ie) {
    return function () {
        return I.useContext(e);
    };
}
var Ir = Ct();
function Dr(e = ie) {
    const t = e === ie ? Ir : Ct(e),
        r = () => {
            const { store: n } = t();
            return n;
        };
    return Object.assign(r, { withTypes: () => r }), r;
}
var Tr = Dr();
function li(e = ie) {
    const t = e === ie ? Tr : Dr(e),
        r = () => t().dispatch;
    return Object.assign(r, { withTypes: () => r }), r;
}
var fi = li(),
    di = (e, t) => e === t;
function pi(e = ie) {
    const t = e === ie ? Ir : Ct(e),
        r = (n, i = {}) => {
            const { equalityFn: s = di } =
                    typeof i == "function" ? { equalityFn: i } : i,
                o = t(),
                { store: d, subscription: y, getServerState: b } = o;
            I.useRef(!0);
            const S = I.useCallback(
                    {
                        [n.name](l) {
                            return n(l);
                        },
                    }[n.name],
                    [n]
                ),
                g = Yn.useSyncExternalStoreWithSelector(
                    y.addNestedSub,
                    d.getState,
                    b || d.getState,
                    S,
                    s
                );
            return I.useDebugValue(g), g;
        };
    return Object.assign(r, { withTypes: () => r }), r;
}
var yi = pi(),
    hi = Mr,
    jt = "persist:",
    Nr = "persist/FLUSH",
    Pt = "persist/REHYDRATE",
    qr = "persist/PAUSE",
    kr = "persist/PERSIST",
    zr = "persist/PURGE",
    Qr = "persist/REGISTER",
    mi = -1;
function Fe(e) {
    return (
        typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (Fe = function (r) {
                  return typeof r;
              })
            : (Fe = function (r) {
                  return r &&
                      typeof Symbol == "function" &&
                      r.constructor === Symbol &&
                      r !== Symbol.prototype
                      ? "symbol"
                      : typeof r;
              }),
        Fe(e)
    );
}
function Zt(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t &&
            (n = n.filter(function (i) {
                return Object.getOwnPropertyDescriptor(e, i).enumerable;
            })),
            r.push.apply(r, n);
    }
    return r;
}
function gi(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2
            ? Zt(r, !0).forEach(function (n) {
                  vi(e, n, r[n]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Zt(r).forEach(function (n) {
                  Object.defineProperty(
                      e,
                      n,
                      Object.getOwnPropertyDescriptor(r, n)
                  );
              });
    }
    return e;
}
function vi(e, t, r) {
    return (
        t in e
            ? Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
              })
            : (e[t] = r),
        e
    );
}
function bi(e, t, r, n) {
    n.debug;
    var i = gi({}, r);
    return (
        e &&
            Fe(e) === "object" &&
            Object.keys(e).forEach(function (s) {
                s !== "_persist" && t[s] === r[s] && (i[s] = e[s]);
            }),
        i
    );
}
function Si(e) {
    var t = e.blacklist || null,
        r = e.whitelist || null,
        n = e.transforms || [],
        i = e.throttle || 0,
        s = "".concat(e.keyPrefix !== void 0 ? e.keyPrefix : jt).concat(e.key),
        o = e.storage,
        d;
    e.serialize === !1
        ? (d = function (O) {
              return O;
          })
        : typeof e.serialize == "function"
        ? (d = e.serialize)
        : (d = wi);
    var y = e.writeFailHandler || null,
        b = {},
        S = {},
        g = [],
        l = null,
        f = null,
        h = function (O) {
            Object.keys(O).forEach(function (w) {
                _(w) && b[w] !== O[w] && g.indexOf(w) === -1 && g.push(w);
            }),
                Object.keys(b).forEach(function (w) {
                    O[w] === void 0 &&
                        _(w) &&
                        g.indexOf(w) === -1 &&
                        b[w] !== void 0 &&
                        g.push(w);
                }),
                l === null && (l = setInterval(p, i)),
                (b = O);
        };
    function p() {
        if (g.length === 0) {
            l && clearInterval(l), (l = null);
            return;
        }
        var c = g.shift(),
            O = n.reduce(function (w, m) {
                return m.in(w, c, b);
            }, b[c]);
        if (O !== void 0)
            try {
                S[c] = d(O);
            } catch (w) {
                console.error(
                    "redux-persist/createPersistoid: error serializing state",
                    w
                );
            }
        else delete S[c];
        g.length === 0 && v();
    }
    function v() {
        Object.keys(S).forEach(function (c) {
            b[c] === void 0 && delete S[c];
        }),
            (f = o.setItem(s, d(S)).catch(a));
    }
    function _(c) {
        return !(
            (r && r.indexOf(c) === -1 && c !== "_persist") ||
            (t && t.indexOf(c) !== -1)
        );
    }
    function a(c) {
        y && y(c);
    }
    var u = function () {
        for (; g.length !== 0; ) p();
        return f || Promise.resolve();
    };
    return { update: h, flush: u };
}
function wi(e) {
    return JSON.stringify(e);
}
function _i(e) {
    var t = e.transforms || [],
        r = "".concat(e.keyPrefix !== void 0 ? e.keyPrefix : jt).concat(e.key),
        n = e.storage;
    e.debug;
    var i;
    return (
        e.deserialize === !1
            ? (i = function (o) {
                  return o;
              })
            : typeof e.deserialize == "function"
            ? (i = e.deserialize)
            : (i = Oi),
        n.getItem(r).then(function (s) {
            if (s)
                try {
                    var o = {},
                        d = i(s);
                    return (
                        Object.keys(d).forEach(function (y) {
                            o[y] = t.reduceRight(function (b, S) {
                                return S.out(b, y, d);
                            }, i(d[y]));
                        }),
                        o
                    );
                } catch (y) {
                    throw y;
                }
            else return;
        })
    );
}
function Oi(e) {
    return JSON.parse(e);
}
function Ei(e) {
    var t = e.storage,
        r = "".concat(e.keyPrefix !== void 0 ? e.keyPrefix : jt).concat(e.key);
    return t.removeItem(r, xi);
}
function xi(e) {}
function Xt(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t &&
            (n = n.filter(function (i) {
                return Object.getOwnPropertyDescriptor(e, i).enumerable;
            })),
            r.push.apply(r, n);
    }
    return r;
}
function X(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2
            ? Xt(r, !0).forEach(function (n) {
                  Ri(e, n, r[n]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Xt(r).forEach(function (n) {
                  Object.defineProperty(
                      e,
                      n,
                      Object.getOwnPropertyDescriptor(r, n)
                  );
              });
    }
    return e;
}
function Ri(e, t, r) {
    return (
        t in e
            ? Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
              })
            : (e[t] = r),
        e
    );
}
function Ci(e, t) {
    if (e == null) return {};
    var r = ji(e, t),
        n,
        i;
    if (Object.getOwnPropertySymbols) {
        var s = Object.getOwnPropertySymbols(e);
        for (i = 0; i < s.length; i++)
            (n = s[i]),
                !(t.indexOf(n) >= 0) &&
                    Object.prototype.propertyIsEnumerable.call(e, n) &&
                    (r[n] = e[n]);
    }
    return r;
}
function ji(e, t) {
    if (e == null) return {};
    var r = {},
        n = Object.keys(e),
        i,
        s;
    for (s = 0; s < n.length; s++)
        (i = n[s]), !(t.indexOf(i) >= 0) && (r[i] = e[i]);
    return r;
}
var Pi = 5e3;
function Ws(e, t) {
    var r = e.version !== void 0 ? e.version : mi;
    e.debug;
    var n = e.stateReconciler === void 0 ? bi : e.stateReconciler,
        i = e.getStoredState || _i,
        s = e.timeout !== void 0 ? e.timeout : Pi,
        o = null,
        d = !1,
        y = !0,
        b = function (g) {
            return g._persist.rehydrated && o && !y && o.update(g), g;
        };
    return function (S, g) {
        var l = S || {},
            f = l._persist,
            h = Ci(l, ["_persist"]),
            p = h;
        if (g.type === kr) {
            var v = !1,
                _ = function (E, x) {
                    v || (g.rehydrate(e.key, E, x), (v = !0));
                };
            if (
                (s &&
                    setTimeout(function () {
                        !v &&
                            _(
                                void 0,
                                new Error(
                                    'redux-persist: persist timed out for persist key "'.concat(
                                        e.key,
                                        '"'
                                    )
                                )
                            );
                    }, s),
                (y = !1),
                o || (o = Si(e)),
                f)
            )
                return X({}, t(p, g), { _persist: f });
            if (
                typeof g.rehydrate != "function" ||
                typeof g.register != "function"
            )
                throw new Error(
                    "redux-persist: either rehydrate or register is not a function on the PERSIST action. This can happen if the action is being replayed. This is an unexplored use case, please open an issue and we will figure out a resolution."
                );
            return (
                g.register(e.key),
                i(e).then(
                    function (m) {
                        var E =
                            e.migrate ||
                            function (x, R) {
                                return Promise.resolve(x);
                            };
                        E(m, r).then(
                            function (x) {
                                _(x);
                            },
                            function (x) {
                                _(void 0, x);
                            }
                        );
                    },
                    function (m) {
                        _(void 0, m);
                    }
                ),
                X({}, t(p, g), { _persist: { version: r, rehydrated: !1 } })
            );
        } else {
            if (g.type === zr)
                return (
                    (d = !0), g.result(Ei(e)), X({}, t(p, g), { _persist: f })
                );
            if (g.type === Nr)
                return (
                    g.result(o && o.flush()), X({}, t(p, g), { _persist: f })
                );
            if (g.type === qr) y = !0;
            else if (g.type === Pt) {
                if (d)
                    return X({}, p, { _persist: X({}, f, { rehydrated: !0 }) });
                if (g.key === e.key) {
                    var a = t(p, g),
                        u = g.payload,
                        c = n !== !1 && u !== void 0 ? n(u, S, a, e) : a,
                        O = X({}, c, {
                            _persist: X({}, f, { rehydrated: !0 }),
                        });
                    return b(O);
                }
            }
        }
        if (!f) return t(S, g);
        var w = t(p, g);
        return w === p ? S : b(X({}, w, { _persist: f }));
    };
}
function Yt(e) {
    return Ii(e) || Mi(e) || Ai();
}
function Ai() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function Mi(e) {
    if (
        Symbol.iterator in Object(e) ||
        Object.prototype.toString.call(e) === "[object Arguments]"
    )
        return Array.from(e);
}
function Ii(e) {
    if (Array.isArray(e)) {
        for (var t = 0, r = new Array(e.length); t < e.length; t++) r[t] = e[t];
        return r;
    }
}
function er(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t &&
            (n = n.filter(function (i) {
                return Object.getOwnPropertyDescriptor(e, i).enumerable;
            })),
            r.push.apply(r, n);
    }
    return r;
}
function gt(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2
            ? er(r, !0).forEach(function (n) {
                  Di(e, n, r[n]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : er(r).forEach(function (n) {
                  Object.defineProperty(
                      e,
                      n,
                      Object.getOwnPropertyDescriptor(r, n)
                  );
              });
    }
    return e;
}
function Di(e, t, r) {
    return (
        t in e
            ? Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
              })
            : (e[t] = r),
        e
    );
}
var Fr = { registry: [], bootstrapped: !1 },
    Ti = function () {
        var t =
                arguments.length > 0 && arguments[0] !== void 0
                    ? arguments[0]
                    : Fr,
            r = arguments.length > 1 ? arguments[1] : void 0;
        switch (r.type) {
            case Qr:
                return gt({}, t, {
                    registry: [].concat(Yt(t.registry), [r.key]),
                });
            case Pt:
                var n = t.registry.indexOf(r.key),
                    i = Yt(t.registry);
                return (
                    i.splice(n, 1),
                    gt({}, t, { registry: i, bootstrapped: i.length === 0 })
                );
            default:
                return t;
        }
    };
function Ks(e, t, r) {
    var n = St(Ti, Fr, void 0),
        i = function (y) {
            n.dispatch({ type: Qr, key: y });
        },
        s = function (y, b, S) {
            var g = { type: Pt, payload: b, err: S, key: y };
            e.dispatch(g), n.dispatch(g);
        },
        o = gt({}, n, {
            purge: function () {
                var y = [];
                return (
                    e.dispatch({
                        type: zr,
                        result: function (S) {
                            y.push(S);
                        },
                    }),
                    Promise.all(y)
                );
            },
            flush: function () {
                var y = [];
                return (
                    e.dispatch({
                        type: Nr,
                        result: function (S) {
                            y.push(S);
                        },
                    }),
                    Promise.all(y)
                );
            },
            pause: function () {
                e.dispatch({ type: qr });
            },
            persist: function () {
                e.dispatch({ type: kr, register: i, rehydrate: s });
            },
        });
    return o.persist(), o;
}
var ve = {},
    qe = {},
    ke = {},
    tr;
function Ni() {
    if (tr) return ke;
    (tr = 1), (ke.__esModule = !0), (ke.default = i);
    function e(s) {
        return (
            typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
                ? (e = function (d) {
                      return typeof d;
                  })
                : (e = function (d) {
                      return d &&
                          typeof Symbol == "function" &&
                          d.constructor === Symbol &&
                          d !== Symbol.prototype
                          ? "symbol"
                          : typeof d;
                  }),
            e(s)
        );
    }
    function t() {}
    var r = { getItem: t, setItem: t, removeItem: t };
    function n(s) {
        if (
            (typeof self > "u" ? "undefined" : e(self)) !== "object" ||
            !(s in self)
        )
            return !1;
        try {
            var o = self[s],
                d = "redux-persist ".concat(s, " test");
            o.setItem(d, "test"), o.getItem(d), o.removeItem(d);
        } catch {
            return !1;
        }
        return !0;
    }
    function i(s) {
        var o = "".concat(s, "Storage");
        return n(o) ? self[o] : r;
    }
    return ke;
}
var rr;
function qi() {
    if (rr) return qe;
    (rr = 1), (qe.__esModule = !0), (qe.default = r);
    var e = t(Ni());
    function t(n) {
        return n && n.__esModule ? n : { default: n };
    }
    function r(n) {
        var i = (0, e.default)(n);
        return {
            getItem: function (o) {
                return new Promise(function (d, y) {
                    d(i.getItem(o));
                });
            },
            setItem: function (o, d) {
                return new Promise(function (y, b) {
                    y(i.setItem(o, d));
                });
            },
            removeItem: function (o) {
                return new Promise(function (d, y) {
                    d(i.removeItem(o));
                });
            },
        };
    }
    return qe;
}
var nr;
function ki() {
    if (nr) return ve;
    (nr = 1), (ve.__esModule = !0), (ve.default = void 0);
    var e = t(qi());
    function t(n) {
        return n && n.__esModule ? n : { default: n };
    }
    var r = (0, e.default)("local");
    return (ve.default = r), ve;
}
var zi = ki();
const Bs = Yr(zi);
var $r = ((e) => (
    (e.uninitialized = "uninitialized"),
    (e.pending = "pending"),
    (e.fulfilled = "fulfilled"),
    (e.rejected = "rejected"),
    e
))($r || {});
function Qi(e) {
    return {
        status: e,
        isUninitialized: e === "uninitialized",
        isLoading: e === "pending",
        isSuccess: e === "fulfilled",
        isError: e === "rejected",
    };
}
var ir = J;
function Lr(e, t) {
    if (
        e === t ||
        !((ir(e) && ir(t)) || (Array.isArray(e) && Array.isArray(t)))
    )
        return t;
    const r = Object.keys(t),
        n = Object.keys(e);
    let i = r.length === n.length;
    const s = Array.isArray(t) ? [] : {};
    for (const o of r) (s[o] = Lr(e[o], t[o])), i && (i = e[o] === s[o]);
    return i ? e : s;
}
function he(e) {
    let t = 0;
    for (const r in e) t++;
    return t;
}
var sr = (e) => [].concat(...e);
function Fi(e) {
    return new RegExp("(^|:)//").test(e);
}
function $i() {
    return typeof document > "u" ? !0 : document.visibilityState !== "hidden";
}
function He(e) {
    return e != null;
}
function Li() {
    return typeof navigator > "u" || navigator.onLine === void 0
        ? !0
        : navigator.onLine;
}
var Ui = (e) => e.replace(/\/$/, ""),
    Wi = (e) => e.replace(/^\//, "");
function Ki(e, t) {
    if (!e) return t;
    if (!t) return e;
    if (Fi(t)) return t;
    const r = e.endsWith("/") || !t.startsWith("?") ? "/" : "";
    return (e = Ui(e)), (t = Wi(t)), `${e}${r}${t}`;
}
function Bi(e, t, r) {
    return e.has(t) ? e.get(t) : e.set(t, r).get(t);
}
var or = (...e) => fetch(...e),
    Hi = (e) => e.status >= 200 && e.status <= 299,
    Vi = (e) => /ion\/(vnd\.api\+)?json/.test(e.get("content-type") || "");
function ur(e) {
    if (!J(e)) return e;
    const t = { ...e };
    for (const [r, n] of Object.entries(t)) n === void 0 && delete t[r];
    return t;
}
function Hs({
    baseUrl: e,
    prepareHeaders: t = (g) => g,
    fetchFn: r = or,
    paramsSerializer: n,
    isJsonContentType: i = Vi,
    jsonContentType: s = "application/json",
    jsonReplacer: o,
    timeout: d,
    responseHandler: y,
    validateStatus: b,
    ...S
} = {}) {
    return (
        typeof fetch > "u" &&
            r === or &&
            console.warn(
                "Warning: `fetch` is not available. Please supply a custom `fetchFn` property to use `fetchBaseQuery` on SSR environments."
            ),
        async (l, f, h) => {
            const {
                getState: p,
                extra: v,
                endpoint: _,
                forced: a,
                type: u,
            } = f;
            let c,
                {
                    url: O,
                    headers: w = new Headers(S.headers),
                    params: m = void 0,
                    responseHandler: E = y ?? "json",
                    validateStatus: x = b ?? Hi,
                    timeout: R = d,
                    ...C
                } = typeof l == "string" ? { url: l } : l,
                j,
                P = f.signal;
            R &&
                ((j = new AbortController()),
                f.signal.addEventListener("abort", j.abort),
                (P = j.signal));
            let M = { ...S, signal: P, ...C };
            (w = new Headers(ur(w))),
                (M.headers =
                    (await t(w, {
                        getState: p,
                        arg: l,
                        extra: v,
                        endpoint: _,
                        forced: a,
                        type: u,
                        extraOptions: h,
                    })) || w);
            const D = (U) =>
                typeof U == "object" &&
                (J(U) || Array.isArray(U) || typeof U.toJSON == "function");
            if (
                (!M.headers.has("content-type") &&
                    D(M.body) &&
                    M.headers.set("content-type", s),
                D(M.body) &&
                    i(M.headers) &&
                    (M.body = JSON.stringify(M.body, o)),
                m)
            ) {
                const U = ~O.indexOf("?") ? "&" : "?",
                    se = n ? n(m) : new URLSearchParams(ur(m));
                O += U + se;
            }
            O = Ki(e, O);
            const q = new Request(O, M);
            c = { request: new Request(O, M) };
            let T,
                z = !1,
                N =
                    j &&
                    setTimeout(() => {
                        (z = !0), j.abort();
                    }, R);
            try {
                T = await r(q);
            } catch (U) {
                return {
                    error: {
                        status: z ? "TIMEOUT_ERROR" : "FETCH_ERROR",
                        error: String(U),
                    },
                    meta: c,
                };
            } finally {
                N && clearTimeout(N),
                    j == null || j.signal.removeEventListener("abort", j.abort);
            }
            const $ = T.clone();
            c.response = $;
            let K,
                L = "";
            try {
                let U;
                if (
                    (await Promise.all([
                        g(T, E).then(
                            (se) => (K = se),
                            (se) => (U = se)
                        ),
                        $.text().then(
                            (se) => (L = se),
                            () => {}
                        ),
                    ]),
                    U)
                )
                    throw U;
            } catch (U) {
                return {
                    error: {
                        status: "PARSING_ERROR",
                        originalStatus: T.status,
                        data: L,
                        error: String(U),
                    },
                    meta: c,
                };
            }
            return x(T, K)
                ? { data: K, meta: c }
                : { error: { status: T.status, data: K }, meta: c };
        }
    );
    async function g(l, f) {
        if (typeof f == "function") return f(l);
        if (
            (f === "content-type" && (f = i(l.headers) ? "json" : "text"),
            f === "json")
        ) {
            const h = await l.text();
            return h.length ? JSON.parse(h) : null;
        }
        return l.text();
    }
}
var cr = class {
        constructor(e, t = void 0) {
            (this.value = e), (this.meta = t);
        }
    },
    At = H("__rtkq/focused"),
    Ur = H("__rtkq/unfocused"),
    Mt = H("__rtkq/online"),
    Wr = H("__rtkq/offline");
function Kr(e) {
    return e.type === "query";
}
function Gi(e) {
    return e.type === "mutation";
}
function It(e, t, r, n, i, s) {
    return Ji(e)
        ? e(t, r, n, i).filter(He).map(vt).map(s)
        : Array.isArray(e)
        ? e.map(vt).map(s)
        : [];
}
function Ji(e) {
    return typeof e == "function";
}
function vt(e) {
    return typeof e == "string" ? { type: e } : e;
}
function Zi(e, t) {
    return e.catch(t);
}
var je = Symbol("forceQueryFn"),
    bt = (e) => typeof e[je] == "function";
function Xi({
    serializeQueryArgs: e,
    queryThunk: t,
    mutationThunk: r,
    api: n,
    context: i,
}) {
    const s = new Map(),
        o = new Map(),
        {
            unsubscribeQueryResult: d,
            removeMutationResult: y,
            updateSubscriptionOptions: b,
        } = n.internalActions;
    return {
        buildInitiateQuery: h,
        buildInitiateMutation: p,
        getRunningQueryThunk: S,
        getRunningMutationThunk: g,
        getRunningQueriesThunk: l,
        getRunningMutationsThunk: f,
    };
    function S(v, _) {
        return (a) => {
            var O;
            const u = i.endpointDefinitions[v],
                c = e({ queryArgs: _, endpointDefinition: u, endpointName: v });
            return (O = s.get(a)) == null ? void 0 : O[c];
        };
    }
    function g(v, _) {
        return (a) => {
            var u;
            return (u = o.get(a)) == null ? void 0 : u[_];
        };
    }
    function l() {
        return (v) => Object.values(s.get(v) || {}).filter(He);
    }
    function f() {
        return (v) => Object.values(o.get(v) || {}).filter(He);
    }
    function h(v, _) {
        const a =
            (
                u,
                {
                    subscribe: c = !0,
                    forceRefetch: O,
                    subscriptionOptions: w,
                    [je]: m,
                    ...E
                } = {}
            ) =>
            (x, R) => {
                var K;
                const C = e({
                        queryArgs: u,
                        endpointDefinition: _,
                        endpointName: v,
                    }),
                    j = t({
                        ...E,
                        type: "query",
                        subscribe: c,
                        forceRefetch: O,
                        subscriptionOptions: w,
                        endpointName: v,
                        originalArgs: u,
                        queryCacheKey: C,
                        [je]: m,
                    }),
                    P = n.endpoints[v].select(u),
                    M = x(j),
                    D = P(R()),
                    { requestId: q, abort: k } = M,
                    T = D.requestId !== q,
                    z = (K = s.get(x)) == null ? void 0 : K[C],
                    N = () => P(R()),
                    $ = Object.assign(
                        m
                            ? M.then(N)
                            : T && !z
                            ? Promise.resolve(D)
                            : Promise.all([z, M]).then(N),
                        {
                            arg: u,
                            requestId: q,
                            subscriptionOptions: w,
                            queryCacheKey: C,
                            abort: k,
                            async unwrap() {
                                const L = await $;
                                if (L.isError) throw L.error;
                                return L.data;
                            },
                            refetch: () =>
                                x(a(u, { subscribe: !1, forceRefetch: !0 })),
                            unsubscribe() {
                                c && x(d({ queryCacheKey: C, requestId: q }));
                            },
                            updateSubscriptionOptions(L) {
                                ($.subscriptionOptions = L),
                                    x(
                                        b({
                                            endpointName: v,
                                            requestId: q,
                                            queryCacheKey: C,
                                            options: L,
                                        })
                                    );
                            },
                        }
                    );
                if (!z && !T && !m) {
                    const L = Bi(s, x, {});
                    (L[C] = $),
                        $.then(() => {
                            delete L[C], he(L) || s.delete(x);
                        });
                }
                return $;
            };
        return a;
    }
    function p(v) {
        return (_, { track: a = !0, fixedCacheKey: u } = {}) =>
            (c, O) => {
                const w = r({
                        type: "mutation",
                        endpointName: v,
                        originalArgs: _,
                        track: a,
                        fixedCacheKey: u,
                    }),
                    m = c(w),
                    { requestId: E, abort: x, unwrap: R } = m,
                    C = Zi(
                        m.unwrap().then((D) => ({ data: D })),
                        (D) => ({ error: D })
                    ),
                    j = () => {
                        c(y({ requestId: E, fixedCacheKey: u }));
                    },
                    P = Object.assign(C, {
                        arg: m.arg,
                        requestId: E,
                        abort: x,
                        unwrap: R,
                        reset: j,
                    }),
                    M = o.get(c) || {};
                return (
                    o.set(c, M),
                    (M[E] = P),
                    P.then(() => {
                        delete M[E], he(M) || o.delete(c);
                    }),
                    u &&
                        ((M[u] = P),
                        P.then(() => {
                            M[u] === P && (delete M[u], he(M) || o.delete(c));
                        })),
                    P
                );
            };
    }
}
function ar(e) {
    return e;
}
function Yi({
    reducerPath: e,
    baseQuery: t,
    context: { endpointDefinitions: r },
    serializeQueryArgs: n,
    api: i,
    assertTagType: s,
}) {
    const o = (a, u, c, O) => (w, m) => {
            const E = r[a],
                x = n({ queryArgs: u, endpointDefinition: E, endpointName: a });
            if (
                (w(
                    i.internalActions.queryResultPatched({
                        queryCacheKey: x,
                        patches: c,
                    })
                ),
                !O)
            )
                return;
            const R = i.endpoints[a].select(u)(m()),
                C = It(E.providesTags, R.data, void 0, u, {}, s);
            w(
                i.internalActions.updateProvidedBy({
                    queryCacheKey: x,
                    providedTags: C,
                })
            );
        },
        d =
            (a, u, c, O = !0) =>
            (w, m) => {
                const x = i.endpoints[a].select(u)(m()),
                    R = {
                        patches: [],
                        inversePatches: [],
                        undo: () =>
                            w(i.util.patchQueryData(a, u, R.inversePatches, O)),
                    };
                if (x.status === "uninitialized") return R;
                let C;
                if ("data" in x)
                    if (G(x.data)) {
                        const [j, P, M] = Rr(x.data, c);
                        R.patches.push(...P),
                            R.inversePatches.push(...M),
                            (C = j);
                    } else
                        (C = c(x.data)),
                            R.patches.push({
                                op: "replace",
                                path: [],
                                value: C,
                            }),
                            R.inversePatches.push({
                                op: "replace",
                                path: [],
                                value: x.data,
                            });
                return (
                    R.patches.length === 0 ||
                        w(i.util.patchQueryData(a, u, R.patches, O)),
                    R
                );
            },
        y = (a, u, c) => (O) =>
            O(
                i.endpoints[a].initiate(u, {
                    subscribe: !1,
                    forceRefetch: !0,
                    [je]: () => ({ data: c }),
                })
            ),
        b = async (
            a,
            {
                signal: u,
                abort: c,
                rejectWithValue: O,
                fulfillWithValue: w,
                dispatch: m,
                getState: E,
                extra: x,
            }
        ) => {
            const R = r[a.endpointName];
            try {
                let C = ar,
                    j;
                const P = {
                        signal: u,
                        abort: c,
                        dispatch: m,
                        getState: E,
                        extra: x,
                        endpoint: a.endpointName,
                        type: a.type,
                        forced: a.type === "query" ? S(a, E()) : void 0,
                        queryCacheKey:
                            a.type === "query" ? a.queryCacheKey : void 0,
                    },
                    M = a.type === "query" ? a[je] : void 0;
                if (
                    (M
                        ? (j = M())
                        : R.query
                        ? ((j = await t(
                              R.query(a.originalArgs),
                              P,
                              R.extraOptions
                          )),
                          R.transformResponse && (C = R.transformResponse))
                        : (j = await R.queryFn(
                              a.originalArgs,
                              P,
                              R.extraOptions,
                              (D) => t(D, P, R.extraOptions)
                          )),
                    typeof process < "u",
                    j.error)
                )
                    throw new cr(j.error, j.meta);
                return w(await C(j.data, j.meta, a.originalArgs), {
                    fulfilledTimeStamp: Date.now(),
                    baseQueryMeta: j.meta,
                    [ue]: !0,
                });
            } catch (C) {
                let j = C;
                if (j instanceof cr) {
                    let P = ar;
                    R.query &&
                        R.transformErrorResponse &&
                        (P = R.transformErrorResponse);
                    try {
                        return O(await P(j.value, j.meta, a.originalArgs), {
                            baseQueryMeta: j.meta,
                            [ue]: !0,
                        });
                    } catch (M) {
                        j = M;
                    }
                }
                throw (console.error(j), j);
            }
        };
    function S(a, u) {
        var E, x, R;
        const c =
                (x = (E = u[e]) == null ? void 0 : E.queries) == null
                    ? void 0
                    : x[a.queryCacheKey],
            O =
                (R = u[e]) == null
                    ? void 0
                    : R.config.refetchOnMountOrArgChange,
            w = c == null ? void 0 : c.fulfilledTimeStamp,
            m = a.forceRefetch ?? (a.subscribe && O);
        return m ? m === !0 || (Number(new Date()) - Number(w)) / 1e3 >= m : !1;
    }
    const g = Bt(`${e}/executeQuery`, b, {
            getPendingMeta() {
                return { startedTimeStamp: Date.now(), [ue]: !0 };
            },
            condition(a, { getState: u }) {
                var R, C, j;
                const c = u(),
                    O =
                        (C = (R = c[e]) == null ? void 0 : R.queries) == null
                            ? void 0
                            : C[a.queryCacheKey],
                    w = O == null ? void 0 : O.fulfilledTimeStamp,
                    m = a.originalArgs,
                    E = O == null ? void 0 : O.originalArgs,
                    x = r[a.endpointName];
                return bt(a)
                    ? !0
                    : (O == null ? void 0 : O.status) === "pending"
                    ? !1
                    : S(a, c) ||
                      (Kr(x) &&
                          (j = x == null ? void 0 : x.forceRefetch) != null &&
                          j.call(x, {
                              currentArg: m,
                              previousArg: E,
                              endpointState: O,
                              state: c,
                          }))
                    ? !0
                    : !w;
            },
            dispatchConditionRejection: !0,
        }),
        l = Bt(`${e}/executeMutation`, b, {
            getPendingMeta() {
                return { startedTimeStamp: Date.now(), [ue]: !0 };
            },
        }),
        f = (a) => "force" in a,
        h = (a) => "ifOlderThan" in a,
        p = (a, u, c) => (O, w) => {
            const m = f(c) && c.force,
                E = h(c) && c.ifOlderThan,
                x = (C = !0) => {
                    const j = { forceRefetch: C, isPrefetch: !0 };
                    return i.endpoints[a].initiate(u, j);
                },
                R = i.endpoints[a].select(u)(w());
            if (m) O(x());
            else if (E) {
                const C = R == null ? void 0 : R.fulfilledTimeStamp;
                if (!C) {
                    O(x());
                    return;
                }
                (Number(new Date()) - Number(new Date(C))) / 1e3 >= E && O(x());
            } else O(x(!1));
        };
    function v(a) {
        return (u) => {
            var c, O;
            return (
                ((O =
                    (c = u == null ? void 0 : u.meta) == null
                        ? void 0
                        : c.arg) == null
                    ? void 0
                    : O.endpointName) === a
            );
        };
    }
    function _(a, u) {
        return {
            matchPending: _e(xt(a), v(u)),
            matchFulfilled: _e(ne(a), v(u)),
            matchRejected: _e(me(a), v(u)),
        };
    }
    return {
        queryThunk: g,
        mutationThunk: l,
        prefetch: p,
        updateQueryData: d,
        upsertQueryData: y,
        patchQueryData: o,
        buildMatchThunkActions: _,
    };
}
function Br(e, t, r, n) {
    return It(
        r[e.meta.arg.endpointName][t],
        ne(e) ? e.payload : void 0,
        Je(e) ? e.payload : void 0,
        e.meta.arg.originalArgs,
        "baseQueryMeta" in e.meta ? e.meta.baseQueryMeta : void 0,
        n
    );
}
function ze(e, t, r) {
    const n = e[t];
    n && r(n);
}
function Pe(e) {
    return ("arg" in e ? e.arg.fixedCacheKey : e.fixedCacheKey) ?? e.requestId;
}
function lr(e, t, r) {
    const n = e[Pe(t)];
    n && r(n);
}
var be = {};
function es({
    reducerPath: e,
    queryThunk: t,
    mutationThunk: r,
    serializeQueryArgs: n,
    context: {
        endpointDefinitions: i,
        apiUid: s,
        extractRehydrationInfo: o,
        hasRehydrationInfo: d,
    },
    assertTagType: y,
    config: b,
}) {
    const S = H(`${e}/resetApiState`);
    function g(w, m, E, x) {
        var R;
        w[(R = m.queryCacheKey)] ??
            (w[R] = { status: "uninitialized", endpointName: m.endpointName }),
            ze(w, m.queryCacheKey, (C) => {
                (C.status = "pending"),
                    (C.requestId =
                        E && C.requestId ? C.requestId : x.requestId),
                    m.originalArgs !== void 0 &&
                        (C.originalArgs = m.originalArgs),
                    (C.startedTimeStamp = x.startedTimeStamp);
            });
    }
    function l(w, m, E) {
        ze(w, m.arg.queryCacheKey, (x) => {
            if (x.requestId !== m.requestId && !bt(m.arg)) return;
            const { merge: R } = i[m.arg.endpointName];
            if (((x.status = "fulfilled"), R))
                if (x.data !== void 0) {
                    const {
                        fulfilledTimeStamp: C,
                        arg: j,
                        baseQueryMeta: P,
                        requestId: M,
                    } = m;
                    let D = Ie(x.data, (q) =>
                        R(q, E, {
                            arg: j.originalArgs,
                            baseQueryMeta: P,
                            fulfilledTimeStamp: C,
                            requestId: M,
                        })
                    );
                    x.data = D;
                } else x.data = E;
            else
                x.data =
                    i[m.arg.endpointName].structuralSharing ?? !0
                        ? Lr(Z(x.data) ? on(x.data) : x.data, E)
                        : E;
            delete x.error, (x.fulfilledTimeStamp = m.fulfilledTimeStamp);
        });
    }
    const f = de({
            name: `${e}/queries`,
            initialState: be,
            reducers: {
                removeQueryResult: {
                    reducer(w, { payload: { queryCacheKey: m } }) {
                        delete w[m];
                    },
                    prepare: ge(),
                },
                cacheEntriesUpserted: {
                    reducer(w, m) {
                        for (const E of m.payload) {
                            const { queryDescription: x, value: R } = E;
                            g(w, x, !0, {
                                arg: x,
                                requestId: m.meta.requestId,
                                startedTimeStamp: m.meta.timestamp,
                            }),
                                l(
                                    w,
                                    {
                                        arg: x,
                                        requestId: m.meta.requestId,
                                        fulfilledTimeStamp: m.meta.timestamp,
                                        baseQueryMeta: {},
                                    },
                                    R
                                );
                        }
                    },
                    prepare: (w) => ({
                        payload: w.map((x) => {
                            const { endpointName: R, arg: C, value: j } = x,
                                P = i[R];
                            return {
                                queryDescription: {
                                    type: "query",
                                    endpointName: R,
                                    originalArgs: x.arg,
                                    queryCacheKey: n({
                                        queryArgs: C,
                                        endpointDefinition: P,
                                        endpointName: R,
                                    }),
                                },
                                value: j,
                            };
                        }),
                        meta: {
                            [ue]: !0,
                            requestId: Rt(),
                            timestamp: Date.now(),
                        },
                    }),
                },
                queryResultPatched: {
                    reducer(w, { payload: { queryCacheKey: m, patches: E } }) {
                        ze(w, m, (x) => {
                            x.data = Qt(x.data, E.concat());
                        });
                    },
                    prepare: ge(),
                },
            },
            extraReducers(w) {
                w.addCase(t.pending, (m, { meta: E, meta: { arg: x } }) => {
                    const R = bt(x);
                    g(m, x, R, E);
                })
                    .addCase(t.fulfilled, (m, { meta: E, payload: x }) => {
                        l(m, E, x);
                    })
                    .addCase(
                        t.rejected,
                        (
                            m,
                            {
                                meta: { condition: E, arg: x, requestId: R },
                                error: C,
                                payload: j,
                            }
                        ) => {
                            ze(m, x.queryCacheKey, (P) => {
                                if (!E) {
                                    if (P.requestId !== R) return;
                                    (P.status = "rejected"), (P.error = j ?? C);
                                }
                            });
                        }
                    )
                    .addMatcher(d, (m, E) => {
                        const { queries: x } = o(E);
                        for (const [R, C] of Object.entries(x))
                            ((C == null ? void 0 : C.status) === "fulfilled" ||
                                (C == null ? void 0 : C.status) ===
                                    "rejected") &&
                                (m[R] = C);
                    });
            },
        }),
        h = de({
            name: `${e}/mutations`,
            initialState: be,
            reducers: {
                removeMutationResult: {
                    reducer(w, { payload: m }) {
                        const E = Pe(m);
                        E in w && delete w[E];
                    },
                    prepare: ge(),
                },
            },
            extraReducers(w) {
                w.addCase(
                    r.pending,
                    (
                        m,
                        {
                            meta: E,
                            meta: { requestId: x, arg: R, startedTimeStamp: C },
                        }
                    ) => {
                        R.track &&
                            (m[Pe(E)] = {
                                requestId: x,
                                status: "pending",
                                endpointName: R.endpointName,
                                startedTimeStamp: C,
                            });
                    }
                )
                    .addCase(r.fulfilled, (m, { payload: E, meta: x }) => {
                        x.arg.track &&
                            lr(m, x, (R) => {
                                R.requestId === x.requestId &&
                                    ((R.status = "fulfilled"),
                                    (R.data = E),
                                    (R.fulfilledTimeStamp =
                                        x.fulfilledTimeStamp));
                            });
                    })
                    .addCase(
                        r.rejected,
                        (m, { payload: E, error: x, meta: R }) => {
                            R.arg.track &&
                                lr(m, R, (C) => {
                                    C.requestId === R.requestId &&
                                        ((C.status = "rejected"),
                                        (C.error = E ?? x));
                                });
                        }
                    )
                    .addMatcher(d, (m, E) => {
                        const { mutations: x } = o(E);
                        for (const [R, C] of Object.entries(x))
                            ((C == null ? void 0 : C.status) === "fulfilled" ||
                                (C == null ? void 0 : C.status) ===
                                    "rejected") &&
                                R !== (C == null ? void 0 : C.requestId) &&
                                (m[R] = C);
                    });
            },
        }),
        p = de({
            name: `${e}/invalidation`,
            initialState: be,
            reducers: {
                updateProvidedBy: {
                    reducer(w, m) {
                        var R, C;
                        const { queryCacheKey: E, providedTags: x } = m.payload;
                        for (const j of Object.values(w))
                            for (const P of Object.values(j)) {
                                const M = P.indexOf(E);
                                M !== -1 && P.splice(M, 1);
                            }
                        for (const { type: j, id: P } of x) {
                            const M =
                                (R = w[j] ?? (w[j] = {}))[
                                    (C = P || "__internal_without_id")
                                ] ?? (R[C] = []);
                            M.includes(E) || M.push(E);
                        }
                    },
                    prepare: ge(),
                },
            },
            extraReducers(w) {
                w.addCase(
                    f.actions.removeQueryResult,
                    (m, { payload: { queryCacheKey: E } }) => {
                        for (const x of Object.values(m))
                            for (const R of Object.values(x)) {
                                const C = R.indexOf(E);
                                C !== -1 && R.splice(C, 1);
                            }
                    }
                )
                    .addMatcher(d, (m, E) => {
                        var R, C;
                        const { provided: x } = o(E);
                        for (const [j, P] of Object.entries(x))
                            for (const [M, D] of Object.entries(P)) {
                                const q =
                                    (R = m[j] ?? (m[j] = {}))[
                                        (C = M || "__internal_without_id")
                                    ] ?? (R[C] = []);
                                for (const k of D) q.includes(k) || q.push(k);
                            }
                    })
                    .addMatcher(Y(ne(t), Je(t)), (m, E) => {
                        const x = Br(E, "providesTags", i, y),
                            { queryCacheKey: R } = E.meta.arg;
                        p.caseReducers.updateProvidedBy(
                            m,
                            p.actions.updateProvidedBy({
                                queryCacheKey: R,
                                providedTags: x,
                            })
                        );
                    });
            },
        }),
        v = de({
            name: `${e}/subscriptions`,
            initialState: be,
            reducers: {
                updateSubscriptionOptions(w, m) {},
                unsubscribeQueryResult(w, m) {},
                internal_getRTKQSubscriptions() {},
            },
        }),
        _ = de({
            name: `${e}/internalSubscriptions`,
            initialState: be,
            reducers: {
                subscriptionsUpdated: {
                    reducer(w, m) {
                        return Qt(w, m.payload);
                    },
                    prepare: ge(),
                },
            },
        }),
        a = de({
            name: `${e}/config`,
            initialState: {
                online: Li(),
                focused: $i(),
                middlewareRegistered: !1,
                ...b,
            },
            reducers: {
                middlewareRegistered(w, { payload: m }) {
                    w.middlewareRegistered =
                        w.middlewareRegistered === "conflict" || s !== m
                            ? "conflict"
                            : !0;
                },
            },
            extraReducers: (w) => {
                w.addCase(Mt, (m) => {
                    m.online = !0;
                })
                    .addCase(Wr, (m) => {
                        m.online = !1;
                    })
                    .addCase(At, (m) => {
                        m.focused = !0;
                    })
                    .addCase(Ur, (m) => {
                        m.focused = !1;
                    })
                    .addMatcher(d, (m) => ({ ...m }));
            },
        }),
        u = br({
            queries: f.reducer,
            mutations: h.reducer,
            provided: p.reducer,
            subscriptions: _.reducer,
            config: a.reducer,
        }),
        c = (w, m) => u(S.match(m) ? void 0 : w, m),
        O = {
            ...a.actions,
            ...f.actions,
            ...v.actions,
            ..._.actions,
            ...h.actions,
            ...p.actions,
            resetApiState: S,
        };
    return { reducer: c, actions: O };
}
var te = Symbol.for("RTKQ/skipToken"),
    Hr = { status: "uninitialized" },
    fr = Ie(Hr, () => {}),
    dr = Ie(Hr, () => {});
function ts({ serializeQueryArgs: e, reducerPath: t, createSelector: r }) {
    const n = (g) => fr,
        i = (g) => dr;
    return {
        buildQuerySelector: d,
        buildMutationSelector: y,
        selectInvalidatedBy: b,
        selectCachedArgsForQuery: S,
    };
    function s(g) {
        return { ...g, ...Qi(g.status) };
    }
    function o(g) {
        return g[t];
    }
    function d(g, l) {
        return (f) => {
            if (f === te) return r(n, s);
            const h = e({
                queryArgs: f,
                endpointDefinition: l,
                endpointName: g,
            });
            return r((v) => {
                var _, a;
                return (
                    ((a = (_ = o(v)) == null ? void 0 : _.queries) == null
                        ? void 0
                        : a[h]) ?? fr
                );
            }, s);
        };
    }
    function y() {
        return (g) => {
            let l;
            return (
                typeof g == "object" ? (l = Pe(g) ?? te) : (l = g),
                r(
                    l === te
                        ? i
                        : (p) => {
                              var v, _;
                              return (
                                  ((_ =
                                      (v = o(p)) == null
                                          ? void 0
                                          : v.mutations) == null
                                      ? void 0
                                      : _[l]) ?? dr
                              );
                          },
                    s
                )
            );
        };
    }
    function b(g, l) {
        const f = g[t],
            h = new Set();
        for (const p of l.filter(He).map(vt)) {
            const v = f.provided[p.type];
            if (!v) continue;
            let _ = (p.id !== void 0 ? v[p.id] : sr(Object.values(v))) ?? [];
            for (const a of _) h.add(a);
        }
        return sr(
            Array.from(h.values()).map((p) => {
                const v = f.queries[p];
                return v
                    ? [
                          {
                              queryCacheKey: p,
                              endpointName: v.endpointName,
                              originalArgs: v.originalArgs,
                          },
                      ]
                    : [];
            })
        );
    }
    function S(g, l) {
        return Object.values(g[t].queries)
            .filter(
                (f) =>
                    (f == null ? void 0 : f.endpointName) === l &&
                    f.status !== "uninitialized"
            )
            .map((f) => f.originalArgs);
    }
}
var pe = WeakMap ? new WeakMap() : void 0,
    pr = ({ endpointName: e, queryArgs: t }) => {
        let r = "";
        const n = pe == null ? void 0 : pe.get(t);
        if (typeof n == "string") r = n;
        else {
            const i = JSON.stringify(
                t,
                (s, o) => (
                    (o = typeof o == "bigint" ? { $bigint: o.toString() } : o),
                    (o = J(o)
                        ? Object.keys(o)
                              .sort()
                              .reduce((d, y) => ((d[y] = o[y]), d), {})
                        : o),
                    o
                )
            );
            J(t) && (pe == null || pe.set(t, i)), (r = i);
        }
        return `${e}(${r})`;
    };
function rs(...e) {
    return function (r) {
        const n = Be((b) => {
                var S;
                return (S = r.extractRehydrationInfo) == null
                    ? void 0
                    : S.call(r, b, { reducerPath: r.reducerPath ?? "api" });
            }),
            i = {
                reducerPath: "api",
                keepUnusedDataFor: 60,
                refetchOnMountOrArgChange: !1,
                refetchOnFocus: !1,
                refetchOnReconnect: !1,
                invalidationBehavior: "delayed",
                ...r,
                extractRehydrationInfo: n,
                serializeQueryArgs(b) {
                    let S = pr;
                    if ("serializeQueryArgs" in b.endpointDefinition) {
                        const g = b.endpointDefinition.serializeQueryArgs;
                        S = (l) => {
                            const f = g(l);
                            return typeof f == "string"
                                ? f
                                : pr({ ...l, queryArgs: f });
                        };
                    } else r.serializeQueryArgs && (S = r.serializeQueryArgs);
                    return S(b);
                },
                tagTypes: [...(r.tagTypes || [])],
            },
            s = {
                endpointDefinitions: {},
                batch(b) {
                    b();
                },
                apiUid: Rt(),
                extractRehydrationInfo: n,
                hasRehydrationInfo: Be((b) => n(b) != null),
            },
            o = {
                injectEndpoints: y,
                enhanceEndpoints({ addTagTypes: b, endpoints: S }) {
                    if (b)
                        for (const g of b)
                            i.tagTypes.includes(g) || i.tagTypes.push(g);
                    if (S)
                        for (const [g, l] of Object.entries(S))
                            typeof l == "function"
                                ? l(s.endpointDefinitions[g])
                                : Object.assign(
                                      s.endpointDefinitions[g] || {},
                                      l
                                  );
                    return o;
                },
            },
            d = e.map((b) => b.init(o, i, s));
        function y(b) {
            const S = b.endpoints({
                query: (g) => ({ ...g, type: "query" }),
                mutation: (g) => ({ ...g, type: "mutation" }),
            });
            for (const [g, l] of Object.entries(S)) {
                if (b.overrideExisting !== !0 && g in s.endpointDefinitions) {
                    if (b.overrideExisting === "throw") throw new Error(V(39));
                    continue;
                }
                s.endpointDefinitions[g] = l;
                for (const f of d) f.injectEndpoint(g, l);
            }
            return o;
        }
        return o.injectEndpoints({ endpoints: r.endpoints });
    };
}
function ee(e, ...t) {
    return Object.assign(e, ...t);
}
var ns = ({ api: e, queryThunk: t, internalState: r }) => {
    const n = `${e.reducerPath}/subscriptions`;
    let i = null,
        s = null;
    const { updateSubscriptionOptions: o, unsubscribeQueryResult: d } =
            e.internalActions,
        y = (f, h) => {
            var v, _, a;
            if (o.match(h)) {
                const {
                    queryCacheKey: u,
                    requestId: c,
                    options: O,
                } = h.payload;
                return (
                    (v = f == null ? void 0 : f[u]) != null &&
                        v[c] &&
                        (f[u][c] = O),
                    !0
                );
            }
            if (d.match(h)) {
                const { queryCacheKey: u, requestId: c } = h.payload;
                return f[u] && delete f[u][c], !0;
            }
            if (e.internalActions.removeQueryResult.match(h))
                return delete f[h.payload.queryCacheKey], !0;
            if (t.pending.match(h)) {
                const {
                        meta: { arg: u, requestId: c },
                    } = h,
                    O = f[(_ = u.queryCacheKey)] ?? (f[_] = {});
                return (
                    (O[`${c}_running`] = {}),
                    u.subscribe && (O[c] = u.subscriptionOptions ?? O[c] ?? {}),
                    !0
                );
            }
            let p = !1;
            if (t.fulfilled.match(h) || t.rejected.match(h)) {
                const u = f[h.meta.arg.queryCacheKey] || {},
                    c = `${h.meta.requestId}_running`;
                p || (p = !!u[c]), delete u[c];
            }
            if (t.rejected.match(h)) {
                const {
                    meta: { condition: u, arg: c, requestId: O },
                } = h;
                if (u && c.subscribe) {
                    const w = f[(a = c.queryCacheKey)] ?? (f[a] = {});
                    (w[O] = c.subscriptionOptions ?? w[O] ?? {}), (p = !0);
                }
            }
            return p;
        },
        b = () => r.currentSubscriptions,
        l = {
            getSubscriptions: b,
            getSubscriptionCount: (f) => {
                const p = b()[f] ?? {};
                return he(p);
            },
            isRequestSubscribed: (f, h) => {
                var v;
                const p = b();
                return !!((v = p == null ? void 0 : p[f]) != null && v[h]);
            },
        };
    return (f, h) => {
        if (
            (i || (i = JSON.parse(JSON.stringify(r.currentSubscriptions))),
            e.util.resetApiState.match(f))
        )
            return (i = r.currentSubscriptions = {}), (s = null), [!0, !1];
        if (e.internalActions.internal_getRTKQSubscriptions.match(f))
            return [!1, l];
        const p = y(r.currentSubscriptions, f);
        let v = !0;
        if (p) {
            s ||
                (s = setTimeout(() => {
                    const u = JSON.parse(
                            JSON.stringify(r.currentSubscriptions)
                        ),
                        [, c] = Rr(i, () => u);
                    h.next(e.internalActions.subscriptionsUpdated(c)),
                        (i = u),
                        (s = null);
                }, 500));
            const _ = typeof f.type == "string" && !!f.type.startsWith(n),
                a =
                    t.rejected.match(f) &&
                    f.meta.condition &&
                    !!f.meta.arg.subscribe;
            v = !_ && !a;
        }
        return [v, !1];
    };
};
function is(e) {
    for (const t in e) return !1;
    return !0;
}
var ss = 2147483647 / 1e3 - 1,
    os = ({
        reducerPath: e,
        api: t,
        queryThunk: r,
        context: n,
        internalState: i,
    }) => {
        const {
                removeQueryResult: s,
                unsubscribeQueryResult: o,
                cacheEntriesUpserted: d,
            } = t.internalActions,
            y = Y(o.match, r.fulfilled, r.rejected, d.match);
        function b(f) {
            const h = i.currentSubscriptions[f];
            return !!h && !is(h);
        }
        const S = {},
            g = (f, h, p) => {
                var v;
                if (y(f)) {
                    const _ = h.getState()[e];
                    let a;
                    if (d.match(f))
                        a = f.payload.map(
                            (u) => u.queryDescription.queryCacheKey
                        );
                    else {
                        const { queryCacheKey: u } = o.match(f)
                            ? f.payload
                            : f.meta.arg;
                        a = [u];
                    }
                    for (const u of a)
                        l(
                            u,
                            (v = _.queries[u]) == null
                                ? void 0
                                : v.endpointName,
                            h,
                            _.config
                        );
                }
                if (t.util.resetApiState.match(f))
                    for (const [_, a] of Object.entries(S))
                        a && clearTimeout(a), delete S[_];
                if (n.hasRehydrationInfo(f)) {
                    const _ = h.getState()[e],
                        { queries: a } = n.extractRehydrationInfo(f);
                    for (const [u, c] of Object.entries(a))
                        l(u, c == null ? void 0 : c.endpointName, h, _.config);
                }
            };
        function l(f, h, p, v) {
            const _ = n.endpointDefinitions[h],
                a =
                    (_ == null ? void 0 : _.keepUnusedDataFor) ??
                    v.keepUnusedDataFor;
            if (a === 1 / 0) return;
            const u = Math.max(0, Math.min(a, ss));
            if (!b(f)) {
                const c = S[f];
                c && clearTimeout(c),
                    (S[f] = setTimeout(() => {
                        b(f) || p.dispatch(s({ queryCacheKey: f })),
                            delete S[f];
                    }, u * 1e3));
            }
        }
        return g;
    },
    yr = new Error("Promise never resolved before cacheEntryRemoved."),
    us = ({
        api: e,
        reducerPath: t,
        context: r,
        queryThunk: n,
        mutationThunk: i,
        internalState: s,
    }) => {
        const o = mt(n),
            d = mt(i),
            y = ne(n, i),
            b = {};
        function S(p, v, _) {
            const a = b[p];
            a != null &&
                a.valueResolved &&
                (a.valueResolved({ data: v, meta: _ }), delete a.valueResolved);
        }
        function g(p) {
            const v = b[p];
            v && (delete b[p], v.cacheEntryRemoved());
        }
        const l = (p, v, _) => {
            const a = f(p);
            function u(c, O, w, m) {
                const E = _[t].queries[O],
                    x = v.getState()[t].queries[O];
                !E && x && h(c, m, O, v, w);
            }
            if (n.pending.match(p))
                u(
                    p.meta.arg.endpointName,
                    a,
                    p.meta.requestId,
                    p.meta.arg.originalArgs
                );
            else if (e.internalActions.cacheEntriesUpserted.match(p))
                for (const { queryDescription: c, value: O } of p.payload) {
                    const {
                        endpointName: w,
                        originalArgs: m,
                        queryCacheKey: E,
                    } = c;
                    u(w, E, p.meta.requestId, m), S(E, O, {});
                }
            else if (i.pending.match(p))
                v.getState()[t].mutations[a] &&
                    h(
                        p.meta.arg.endpointName,
                        p.meta.arg.originalArgs,
                        a,
                        v,
                        p.meta.requestId
                    );
            else if (y(p)) S(a, p.payload, p.meta.baseQueryMeta);
            else if (
                e.internalActions.removeQueryResult.match(p) ||
                e.internalActions.removeMutationResult.match(p)
            )
                g(a);
            else if (e.util.resetApiState.match(p))
                for (const c of Object.keys(b)) g(c);
        };
        function f(p) {
            return o(p)
                ? p.meta.arg.queryCacheKey
                : d(p)
                ? p.meta.arg.fixedCacheKey ?? p.meta.requestId
                : e.internalActions.removeQueryResult.match(p)
                ? p.payload.queryCacheKey
                : e.internalActions.removeMutationResult.match(p)
                ? Pe(p.payload)
                : "";
        }
        function h(p, v, _, a, u) {
            const c = r.endpointDefinitions[p],
                O = c == null ? void 0 : c.onCacheEntryAdded;
            if (!O) return;
            const w = {},
                m = new Promise((P) => {
                    w.cacheEntryRemoved = P;
                }),
                E = Promise.race([
                    new Promise((P) => {
                        w.valueResolved = P;
                    }),
                    m.then(() => {
                        throw yr;
                    }),
                ]);
            E.catch(() => {}), (b[_] = w);
            const x = e.endpoints[p].select(c.type === "query" ? v : _),
                R = a.dispatch((P, M, D) => D),
                C = {
                    ...a,
                    getCacheEntry: () => x(a.getState()),
                    requestId: u,
                    extra: R,
                    updateCachedData:
                        c.type === "query"
                            ? (P) => a.dispatch(e.util.updateQueryData(p, v, P))
                            : void 0,
                    cacheDataLoaded: E,
                    cacheEntryRemoved: m,
                },
                j = O(v, C);
            Promise.resolve(j).catch((P) => {
                if (P !== yr) throw P;
            });
        }
        return l;
    },
    cs =
        ({ api: e, context: { apiUid: t }, reducerPath: r }) =>
        (n, i) => {
            e.util.resetApiState.match(n) &&
                i.dispatch(e.internalActions.middlewareRegistered(t));
        },
    as = ({
        reducerPath: e,
        context: t,
        context: { endpointDefinitions: r },
        mutationThunk: n,
        queryThunk: i,
        api: s,
        assertTagType: o,
        refetchQuery: d,
        internalState: y,
    }) => {
        const { removeQueryResult: b } = s.internalActions,
            S = Y(ne(n), Je(n)),
            g = Y(ne(n, i), me(n, i));
        let l = [];
        const f = (v, _) => {
            S(v)
                ? p(Br(v, "invalidatesTags", r, o), _)
                : g(v)
                ? p([], _)
                : s.util.invalidateTags.match(v) &&
                  p(It(v.payload, void 0, void 0, void 0, void 0, o), _);
        };
        function h(v) {
            var _, a;
            for (const u in v.queries)
                if (
                    ((_ = v.queries[u]) == null ? void 0 : _.status) ===
                    "pending"
                )
                    return !0;
            for (const u in v.mutations)
                if (
                    ((a = v.mutations[u]) == null ? void 0 : a.status) ===
                    "pending"
                )
                    return !0;
            return !1;
        }
        function p(v, _) {
            const a = _.getState(),
                u = a[e];
            if (
                (l.push(...v),
                u.config.invalidationBehavior === "delayed" && h(u))
            )
                return;
            const c = l;
            if (((l = []), c.length === 0)) return;
            const O = s.util.selectInvalidatedBy(a, c);
            t.batch(() => {
                const w = Array.from(O.values());
                for (const { queryCacheKey: m } of w) {
                    const E = u.queries[m],
                        x = y.currentSubscriptions[m] ?? {};
                    E &&
                        (he(x) === 0
                            ? _.dispatch(b({ queryCacheKey: m }))
                            : E.status !== "uninitialized" && _.dispatch(d(E)));
                }
            });
        }
        return f;
    },
    ls = ({
        reducerPath: e,
        queryThunk: t,
        api: r,
        refetchQuery: n,
        internalState: i,
    }) => {
        const s = {},
            o = (l, f) => {
                (r.internalActions.updateSubscriptionOptions.match(l) ||
                    r.internalActions.unsubscribeQueryResult.match(l)) &&
                    y(l.payload, f),
                    (t.pending.match(l) ||
                        (t.rejected.match(l) && l.meta.condition)) &&
                        y(l.meta.arg, f),
                    (t.fulfilled.match(l) ||
                        (t.rejected.match(l) && !l.meta.condition)) &&
                        d(l.meta.arg, f),
                    r.util.resetApiState.match(l) && S();
            };
        function d({ queryCacheKey: l }, f) {
            const h = f.getState()[e],
                p = h.queries[l],
                v = i.currentSubscriptions[l];
            if (!p || p.status === "uninitialized") return;
            const { lowestPollingInterval: _, skipPollingIfUnfocused: a } =
                g(v);
            if (!Number.isFinite(_)) return;
            const u = s[l];
            u != null &&
                u.timeout &&
                (clearTimeout(u.timeout), (u.timeout = void 0));
            const c = Date.now() + _;
            s[l] = {
                nextPollTimestamp: c,
                pollingInterval: _,
                timeout: setTimeout(() => {
                    (h.config.focused || !a) && f.dispatch(n(p)),
                        d({ queryCacheKey: l }, f);
                }, _),
            };
        }
        function y({ queryCacheKey: l }, f) {
            const p = f.getState()[e].queries[l],
                v = i.currentSubscriptions[l];
            if (!p || p.status === "uninitialized") return;
            const { lowestPollingInterval: _ } = g(v);
            if (!Number.isFinite(_)) {
                b(l);
                return;
            }
            const a = s[l],
                u = Date.now() + _;
            (!a || u < a.nextPollTimestamp) && d({ queryCacheKey: l }, f);
        }
        function b(l) {
            const f = s[l];
            f != null && f.timeout && clearTimeout(f.timeout), delete s[l];
        }
        function S() {
            for (const l of Object.keys(s)) b(l);
        }
        function g(l = {}) {
            let f = !1,
                h = Number.POSITIVE_INFINITY;
            for (let p in l)
                l[p].pollingInterval &&
                    ((h = Math.min(l[p].pollingInterval, h)),
                    (f = l[p].skipPollingIfUnfocused || f));
            return { lowestPollingInterval: h, skipPollingIfUnfocused: f };
        }
        return o;
    },
    fs = ({ api: e, context: t, queryThunk: r, mutationThunk: n }) => {
        const i = xt(r, n),
            s = me(r, n),
            o = ne(r, n),
            d = {};
        return (b, S) => {
            var g, l;
            if (i(b)) {
                const {
                        requestId: f,
                        arg: { endpointName: h, originalArgs: p },
                    } = b.meta,
                    v = t.endpointDefinitions[h],
                    _ = v == null ? void 0 : v.onQueryStarted;
                if (_) {
                    const a = {},
                        u = new Promise((m, E) => {
                            (a.resolve = m), (a.reject = E);
                        });
                    u.catch(() => {}), (d[f] = a);
                    const c = e.endpoints[h].select(v.type === "query" ? p : f),
                        O = S.dispatch((m, E, x) => x),
                        w = {
                            ...S,
                            getCacheEntry: () => c(S.getState()),
                            requestId: f,
                            extra: O,
                            updateCachedData:
                                v.type === "query"
                                    ? (m) =>
                                          S.dispatch(
                                              e.util.updateQueryData(h, p, m)
                                          )
                                    : void 0,
                            queryFulfilled: u,
                        };
                    _(p, w);
                }
            } else if (o(b)) {
                const { requestId: f, baseQueryMeta: h } = b.meta;
                (g = d[f]) == null || g.resolve({ data: b.payload, meta: h }),
                    delete d[f];
            } else if (s(b)) {
                const {
                    requestId: f,
                    rejectedWithValue: h,
                    baseQueryMeta: p,
                } = b.meta;
                (l = d[f]) == null ||
                    l.reject({
                        error: b.payload ?? b.error,
                        isUnhandledError: !h,
                        meta: p,
                    }),
                    delete d[f];
            }
        };
    },
    ds = ({
        reducerPath: e,
        context: t,
        api: r,
        refetchQuery: n,
        internalState: i,
    }) => {
        const { removeQueryResult: s } = r.internalActions,
            o = (y, b) => {
                At.match(y) && d(b, "refetchOnFocus"),
                    Mt.match(y) && d(b, "refetchOnReconnect");
            };
        function d(y, b) {
            const S = y.getState()[e],
                g = S.queries,
                l = i.currentSubscriptions;
            t.batch(() => {
                for (const f of Object.keys(l)) {
                    const h = g[f],
                        p = l[f];
                    if (!p || !h) continue;
                    (Object.values(p).some((_) => _[b] === !0) ||
                        (Object.values(p).every((_) => _[b] === void 0) &&
                            S.config[b])) &&
                        (he(p) === 0
                            ? y.dispatch(s({ queryCacheKey: f }))
                            : h.status !== "uninitialized" && y.dispatch(n(h)));
                }
            });
        }
        return o;
    };
function ps(e) {
    const { reducerPath: t, queryThunk: r, api: n, context: i } = e,
        { apiUid: s } = i,
        o = { invalidateTags: H(`${t}/invalidateTags`) },
        d = (g) => g.type.startsWith(`${t}/`),
        y = [cs, os, as, ls, us, fs];
    return {
        middleware: (g) => {
            let l = !1;
            const h = {
                    ...e,
                    internalState: { currentSubscriptions: {} },
                    refetchQuery: S,
                    isThisApiSliceAction: d,
                },
                p = y.map((a) => a(h)),
                v = ns(h),
                _ = ds(h);
            return (a) => (u) => {
                if (!Sr(u)) return a(u);
                l ||
                    ((l = !0),
                    g.dispatch(n.internalActions.middlewareRegistered(s)));
                const c = { ...g, next: a },
                    O = g.getState(),
                    [w, m] = v(u, c, O);
                let E;
                if (
                    (w ? (E = a(u)) : (E = m),
                    g.getState()[t] &&
                        (_(u, c, O), d(u) || i.hasRehydrationInfo(u)))
                )
                    for (const x of p) x(u, c, O);
                return E;
            };
        },
        actions: o,
    };
    function S(g) {
        return e.api.endpoints[g.endpointName].initiate(g.originalArgs, {
            subscribe: !1,
            forceRefetch: !0,
        });
    }
}
var hr = Symbol(),
    ys = ({ createSelector: e = Et } = {}) => ({
        name: hr,
        init(
            t,
            {
                baseQuery: r,
                tagTypes: n,
                reducerPath: i,
                serializeQueryArgs: s,
                keepUnusedDataFor: o,
                refetchOnMountOrArgChange: d,
                refetchOnFocus: y,
                refetchOnReconnect: b,
                invalidationBehavior: S,
            },
            g
        ) {
            mn();
            const l = (T) => T;
            Object.assign(t, {
                reducerPath: i,
                endpoints: {},
                internalActions: {
                    onOnline: Mt,
                    onOffline: Wr,
                    onFocus: At,
                    onFocusLost: Ur,
                },
                util: {},
            });
            const {
                    queryThunk: f,
                    mutationThunk: h,
                    patchQueryData: p,
                    updateQueryData: v,
                    upsertQueryData: _,
                    prefetch: a,
                    buildMatchThunkActions: u,
                } = Yi({
                    baseQuery: r,
                    reducerPath: i,
                    context: g,
                    api: t,
                    serializeQueryArgs: s,
                    assertTagType: l,
                }),
                { reducer: c, actions: O } = es({
                    context: g,
                    queryThunk: f,
                    mutationThunk: h,
                    serializeQueryArgs: s,
                    reducerPath: i,
                    assertTagType: l,
                    config: {
                        refetchOnFocus: y,
                        refetchOnReconnect: b,
                        refetchOnMountOrArgChange: d,
                        keepUnusedDataFor: o,
                        reducerPath: i,
                        invalidationBehavior: S,
                    },
                });
            ee(t.util, {
                patchQueryData: p,
                updateQueryData: v,
                upsertQueryData: _,
                prefetch: a,
                resetApiState: O.resetApiState,
                upsertQueryEntries: O.cacheEntriesUpserted,
            }),
                ee(t.internalActions, O);
            const { middleware: w, actions: m } = ps({
                reducerPath: i,
                context: g,
                queryThunk: f,
                mutationThunk: h,
                api: t,
                assertTagType: l,
            });
            ee(t.util, m), ee(t, { reducer: c, middleware: w });
            const {
                buildQuerySelector: E,
                buildMutationSelector: x,
                selectInvalidatedBy: R,
                selectCachedArgsForQuery: C,
            } = ts({
                serializeQueryArgs: s,
                reducerPath: i,
                createSelector: e,
            });
            ee(t.util, { selectInvalidatedBy: R, selectCachedArgsForQuery: C });
            const {
                buildInitiateQuery: j,
                buildInitiateMutation: P,
                getRunningMutationThunk: M,
                getRunningMutationsThunk: D,
                getRunningQueriesThunk: q,
                getRunningQueryThunk: k,
            } = Xi({
                queryThunk: f,
                mutationThunk: h,
                api: t,
                serializeQueryArgs: s,
                context: g,
            });
            return (
                ee(t.util, {
                    getRunningMutationThunk: M,
                    getRunningMutationsThunk: D,
                    getRunningQueryThunk: k,
                    getRunningQueriesThunk: q,
                }),
                {
                    name: hr,
                    injectEndpoint(T, z) {
                        var $;
                        const N = t;
                        ($ = N.endpoints)[T] ?? ($[T] = {}),
                            Kr(z)
                                ? ee(
                                      N.endpoints[T],
                                      {
                                          name: T,
                                          select: E(T, z),
                                          initiate: j(T, z),
                                      },
                                      u(f, T)
                                  )
                                : Gi(z) &&
                                  ee(
                                      N.endpoints[T],
                                      { name: T, select: x(), initiate: P(T) },
                                      u(h, T)
                                  );
                    },
                }
            );
        },
    });
function ut(e) {
    return e.replace(e[0], e[0].toUpperCase());
}
function hs(e) {
    return e.type === "query";
}
function ms(e) {
    return e.type === "mutation";
}
function Qe(e, ...t) {
    return Object.assign(e, ...t);
}
var ye = WeakMap ? new WeakMap() : void 0,
    gs = ({ endpointName: e, queryArgs: t }) => {
        let r = "";
        const n = ye == null ? void 0 : ye.get(t);
        if (typeof n == "string") r = n;
        else {
            const i = JSON.stringify(
                t,
                (s, o) => (
                    (o = typeof o == "bigint" ? { $bigint: o.toString() } : o),
                    (o = J(o)
                        ? Object.keys(o)
                              .sort()
                              .reduce((d, y) => ((d[y] = o[y]), d), {})
                        : o),
                    o
                )
            );
            J(t) && (ye == null || ye.set(t, i)), (r = i);
        }
        return `${e}(${r})`;
    },
    ct = Symbol();
function mr(e, t, r, n) {
    const i = I.useMemo(
            () => ({
                queryArgs: e,
                serialized:
                    typeof e == "object"
                        ? t({
                              queryArgs: e,
                              endpointDefinition: r,
                              endpointName: n,
                          })
                        : e,
            }),
            [e, t, r, n]
        ),
        s = I.useRef(i);
    return (
        I.useEffect(() => {
            s.current.serialized !== i.serialized && (s.current = i);
        }, [i]),
        s.current.serialized === i.serialized ? s.current.queryArgs : e
    );
}
function at(e) {
    const t = I.useRef(e);
    return (
        I.useEffect(() => {
            Oe(t.current, e) || (t.current = e);
        }, [e]),
        Oe(t.current, e) ? t.current : e
    );
}
var vs = () =>
        typeof window < "u" &&
        typeof window.document < "u" &&
        typeof window.document.createElement < "u",
    bs = vs(),
    Ss = () => typeof navigator < "u" && navigator.product === "ReactNative",
    ws = Ss(),
    _s = () => (bs || ws ? I.useLayoutEffect : I.useEffect),
    Os = _s(),
    Es = (e) =>
        e.isUninitialized
            ? {
                  ...e,
                  isUninitialized: !1,
                  isFetching: !0,
                  isLoading: e.data === void 0,
                  status: $r.pending,
              }
            : e;
function xs({
    api: e,
    moduleOptions: {
        batch: t,
        hooks: { useDispatch: r, useSelector: n, useStore: i },
        unstable__sideEffectsInRender: s,
        createSelector: o,
    },
    serializeQueryArgs: d,
    context: y,
}) {
    const b = s ? (h) => h() : I.useEffect;
    return { buildQueryHooks: l, buildMutationHook: f, usePrefetch: g };
    function S(h, p, v) {
        if (p != null && p.endpointName && h.isUninitialized) {
            const { endpointName: w } = p,
                m = y.endpointDefinitions[w];
            v !== te &&
                d({
                    queryArgs: p.originalArgs,
                    endpointDefinition: m,
                    endpointName: w,
                }) ===
                    d({
                        queryArgs: v,
                        endpointDefinition: m,
                        endpointName: w,
                    }) &&
                (p = void 0);
        }
        let _ = h.isSuccess ? h.data : p == null ? void 0 : p.data;
        _ === void 0 && (_ = h.data);
        const a = _ !== void 0,
            u = h.isLoading,
            c = (!p || p.isLoading || p.isUninitialized) && !a && u,
            O =
                h.isSuccess ||
                (a && ((u && !(p != null && p.isError)) || h.isUninitialized));
        return {
            ...h,
            data: _,
            currentData: h.data,
            isFetching: u,
            isLoading: c,
            isSuccess: O,
        };
    }
    function g(h, p) {
        const v = r(),
            _ = at(p);
        return I.useCallback(
            (a, u) => v(e.util.prefetch(h, a, { ..._, ...u })),
            [h, v, _]
        );
    }
    function l(h) {
        const p = (
                a,
                {
                    refetchOnReconnect: u,
                    refetchOnFocus: c,
                    refetchOnMountOrArgChange: O,
                    skip: w = !1,
                    pollingInterval: m = 0,
                    skipPollingIfUnfocused: E = !1,
                } = {}
            ) => {
                const { initiate: x } = e.endpoints[h],
                    R = r(),
                    C = I.useRef(void 0);
                if (!C.current) {
                    const N = R(
                        e.internalActions.internal_getRTKQSubscriptions()
                    );
                    C.current = N;
                }
                const j = mr(w ? te : a, gs, y.endpointDefinitions[h], h),
                    P = at({
                        refetchOnReconnect: u,
                        refetchOnFocus: c,
                        pollingInterval: m,
                        skipPollingIfUnfocused: E,
                    }),
                    M = I.useRef(!1),
                    D = I.useRef(void 0);
                let { queryCacheKey: q, requestId: k } = D.current || {},
                    T = !1;
                q && k && (T = C.current.isRequestSubscribed(q, k));
                const z = !T && M.current;
                return (
                    b(() => {
                        M.current = T;
                    }),
                    b(() => {
                        z && (D.current = void 0);
                    }, [z]),
                    b(() => {
                        var K;
                        const N = D.current;
                        if (j === te) {
                            N == null || N.unsubscribe(), (D.current = void 0);
                            return;
                        }
                        const $ =
                            (K = D.current) == null
                                ? void 0
                                : K.subscriptionOptions;
                        if (!N || N.arg !== j) {
                            N == null || N.unsubscribe();
                            const L = R(
                                x(j, {
                                    subscriptionOptions: P,
                                    forceRefetch: O,
                                })
                            );
                            D.current = L;
                        } else P !== $ && N.updateSubscriptionOptions(P);
                    }, [R, x, O, j, P, z]),
                    I.useEffect(
                        () => () => {
                            var N;
                            (N = D.current) == null || N.unsubscribe(),
                                (D.current = void 0);
                        },
                        []
                    ),
                    I.useMemo(
                        () => ({
                            refetch: () => {
                                var N;
                                if (!D.current) throw new Error(V(38));
                                return (N = D.current) == null
                                    ? void 0
                                    : N.refetch();
                            },
                        }),
                        []
                    )
                );
            },
            v = ({
                refetchOnReconnect: a,
                refetchOnFocus: u,
                pollingInterval: c = 0,
                skipPollingIfUnfocused: O = !1,
            } = {}) => {
                const { initiate: w } = e.endpoints[h],
                    m = r(),
                    [E, x] = I.useState(ct),
                    R = I.useRef(void 0),
                    C = at({
                        refetchOnReconnect: a,
                        refetchOnFocus: u,
                        pollingInterval: c,
                        skipPollingIfUnfocused: O,
                    });
                b(() => {
                    var q, k;
                    const D =
                        (q = R.current) == null
                            ? void 0
                            : q.subscriptionOptions;
                    C !== D &&
                        ((k = R.current) == null ||
                            k.updateSubscriptionOptions(C));
                }, [C]);
                const j = I.useRef(C);
                b(() => {
                    j.current = C;
                }, [C]);
                const P = I.useCallback(
                        function (D, q = !1) {
                            let k;
                            return (
                                t(() => {
                                    var T;
                                    (T = R.current) == null || T.unsubscribe(),
                                        (R.current = k =
                                            m(
                                                w(D, {
                                                    subscriptionOptions:
                                                        j.current,
                                                    forceRefetch: !q,
                                                })
                                            )),
                                        x(D);
                                }),
                                k
                            );
                        },
                        [m, w]
                    ),
                    M = I.useCallback(() => {
                        var D, q;
                        (D = R.current) != null &&
                            D.queryCacheKey &&
                            m(
                                e.internalActions.removeQueryResult({
                                    queryCacheKey:
                                        (q = R.current) == null
                                            ? void 0
                                            : q.queryCacheKey,
                                })
                            );
                    }, [m]);
                return (
                    I.useEffect(
                        () => () => {
                            var D;
                            (D = R == null ? void 0 : R.current) == null ||
                                D.unsubscribe();
                        },
                        []
                    ),
                    I.useEffect(() => {
                        E !== ct && !R.current && P(E, !0);
                    }, [E, P]),
                    I.useMemo(() => [P, E, { reset: M }], [P, E, M])
                );
            },
            _ = (a, { skip: u = !1, selectFromResult: c } = {}) => {
                const { select: O } = e.endpoints[h],
                    w = mr(u ? te : a, d, y.endpointDefinitions[h], h),
                    m = I.useRef(void 0),
                    E = I.useMemo(
                        () =>
                            o([O(w), (P, M) => M, (P) => w], S, {
                                memoizeOptions: { resultEqualityCheck: Oe },
                            }),
                        [O, w]
                    ),
                    x = I.useMemo(
                        () =>
                            c
                                ? o([E], c, {
                                      devModeChecks: {
                                          identityFunctionCheck: "never",
                                      },
                                  })
                                : E,
                        [E, c]
                    ),
                    R = n((P) => x(P, m.current), Oe),
                    C = i(),
                    j = E(C.getState(), m.current);
                return (
                    Os(() => {
                        m.current = j;
                    }, [j]),
                    R
                );
            };
        return {
            useQueryState: _,
            useQuerySubscription: p,
            useLazyQuerySubscription: v,
            useLazyQuery(a) {
                const [u, c, { reset: O }] = v(a),
                    w = _(c, { ...a, skip: c === ct }),
                    m = I.useMemo(() => ({ lastArg: c }), [c]);
                return I.useMemo(
                    () => [u, { ...w, reset: O }, m],
                    [u, w, O, m]
                );
            },
            useQuery(a, u) {
                const c = p(a, u),
                    O = _(a, {
                        selectFromResult:
                            a === te || (u != null && u.skip) ? void 0 : Es,
                        ...u,
                    }),
                    {
                        data: w,
                        status: m,
                        isLoading: E,
                        isSuccess: x,
                        isError: R,
                        error: C,
                    } = O;
                return (
                    I.useDebugValue({
                        data: w,
                        status: m,
                        isLoading: E,
                        isSuccess: x,
                        isError: R,
                        error: C,
                    }),
                    I.useMemo(() => ({ ...O, ...c }), [O, c])
                );
            },
        };
    }
    function f(h) {
        return ({ selectFromResult: p, fixedCacheKey: v } = {}) => {
            const { select: _, initiate: a } = e.endpoints[h],
                u = r(),
                [c, O] = I.useState();
            I.useEffect(
                () => () => {
                    (c != null && c.arg.fixedCacheKey) ||
                        c == null ||
                        c.reset();
                },
                [c]
            );
            const w = I.useCallback(
                    function ($) {
                        const K = u(a($, { fixedCacheKey: v }));
                        return O(K), K;
                    },
                    [u, a, v]
                ),
                { requestId: m } = c || {},
                E = I.useMemo(
                    () =>
                        _({
                            fixedCacheKey: v,
                            requestId: c == null ? void 0 : c.requestId,
                        }),
                    [v, c, _]
                ),
                x = I.useMemo(() => (p ? o([E], p) : E), [p, E]),
                R = n(x, Oe),
                C =
                    v == null
                        ? c == null
                            ? void 0
                            : c.arg.originalArgs
                        : void 0,
                j = I.useCallback(() => {
                    t(() => {
                        c && O(void 0),
                            v &&
                                u(
                                    e.internalActions.removeMutationResult({
                                        requestId: m,
                                        fixedCacheKey: v,
                                    })
                                );
                    });
                }, [u, v, c, m]),
                {
                    endpointName: P,
                    data: M,
                    status: D,
                    isLoading: q,
                    isSuccess: k,
                    isError: T,
                    error: z,
                } = R;
            I.useDebugValue({
                endpointName: P,
                data: M,
                status: D,
                isLoading: q,
                isSuccess: k,
                isError: T,
                error: z,
            });
            const N = I.useMemo(
                () => ({ ...R, originalArgs: C, reset: j }),
                [R, C, j]
            );
            return I.useMemo(() => [w, N], [w, N]);
        };
    }
}
var Rs = Symbol(),
    Cs = ({
        batch: e = hi,
        hooks: t = { useDispatch: fi, useSelector: yi, useStore: Tr },
        createSelector: r = Et,
        unstable__sideEffectsInRender: n = !1,
        ...i
    } = {}) => ({
        name: Rs,
        init(s, { serializeQueryArgs: o }, d) {
            const y = s,
                {
                    buildQueryHooks: b,
                    buildMutationHook: S,
                    usePrefetch: g,
                } = xs({
                    api: s,
                    moduleOptions: {
                        batch: e,
                        hooks: t,
                        unstable__sideEffectsInRender: n,
                        createSelector: r,
                    },
                    serializeQueryArgs: o,
                    context: d,
                });
            return (
                Qe(y, { usePrefetch: g }),
                Qe(d, { batch: e }),
                {
                    injectEndpoint(l, f) {
                        if (hs(f)) {
                            const {
                                useQuery: h,
                                useLazyQuery: p,
                                useLazyQuerySubscription: v,
                                useQueryState: _,
                                useQuerySubscription: a,
                            } = b(l);
                            Qe(y.endpoints[l], {
                                useQuery: h,
                                useLazyQuery: p,
                                useLazyQuerySubscription: v,
                                useQueryState: _,
                                useQuerySubscription: a,
                            }),
                                (s[`use${ut(l)}Query`] = h),
                                (s[`useLazy${ut(l)}Query`] = p);
                        } else if (ms(f)) {
                            const h = S(l);
                            Qe(y.endpoints[l], { useMutation: h }),
                                (s[`use${ut(l)}Mutation`] = h);
                        }
                    },
                }
            );
        },
    }),
    Vs = rs(ys(), Cs());
const js = window.document,
    Ps = js.head.querySelector('meta[name="base-url"]').content,
    Gs = Ps + "/api/v1",
    As = ({ categories: e }) =>
        A.jsx("div", {
            className: "w-full h-full bg-white",
            children: e.map((t) =>
                A.jsx(
                    "a",
                    {
                        href: t.slug,
                        className: "block py-2 px-4 hover:bg-gray-100",
                        children: t.name,
                    },
                    t.id
                )
            ),
        }),
    Ms = function ({ widget: e, store: t }) {
        var r, n, i;
        return A.jsx(A.Fragment, {
            children: A.jsxs("section", {
                className: "w-full  bg-gray-100 relative",
                children: [
                    A.jsx("div", {
                        className:
                            "min-w-full absolute w-full h-full top-0 left-0",
                        style: {
                            backgroundColor: `${
                                e.inputs.slice().sort(function (s, o) {
                                    return s.id - o.id;
                                })[0] &&
                                ((i =
                                    (n =
                                        (r = e.inputs
                                            .slice()
                                            .sort(function (s, o) {
                                                return s.id - o.id;
                                            })[0]) == null
                                            ? void 0
                                            : r.items) == null
                                        ? void 0
                                        : n.find(
                                              (s) => s.name === "bg-color"
                                          )) == null
                                    ? void 0
                                    : i.value)
                            }`,
                        },
                    }),
                    A.jsx("div", {
                        className: "container mx-auto relative z-10",
                        children: A.jsxs("div", {
                            className: "grid grid-cols-6",
                            children: [
                                A.jsx("div", {
                                    className: "w-full",
                                    children: A.jsx(As, {
                                        categories: t.categories,
                                    }),
                                }),
                                A.jsx("div", {
                                    className:
                                        "col-span-5 overflow-x-auto flex",
                                    children: e.inputs
                                        .slice()
                                        .sort(function (s, o) {
                                            return s.id - o.id;
                                        })
                                        .map((s, o) => {
                                            var d;
                                            if (s.name === "slide" && s.items)
                                                return A.jsx(
                                                    "img",
                                                    {
                                                        className:
                                                            "min-w-full object-fill",
                                                        src: `${
                                                            (d = s.items.find(
                                                                (y) =>
                                                                    y.name ===
                                                                    "image"
                                                            )) == null
                                                                ? void 0
                                                                : d.value
                                                        }
                                `,
                                                        alt: "Banner",
                                                    },
                                                    o
                                                );
                                        }),
                                }),
                            ],
                        }),
                    }),
                ],
            }),
        });
    };
var Vr = {
        color: void 0,
        size: void 0,
        className: void 0,
        style: void 0,
        attr: void 0,
    },
    gr = ce.createContext && ce.createContext(Vr),
    re = function () {
        return (
            (re =
                Object.assign ||
                function (e) {
                    for (var t, r = 1, n = arguments.length; r < n; r++) {
                        t = arguments[r];
                        for (var i in t)
                            Object.prototype.hasOwnProperty.call(t, i) &&
                                (e[i] = t[i]);
                    }
                    return e;
                }),
            re.apply(this, arguments)
        );
    },
    Is = function (e, t) {
        var r = {};
        for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) &&
                t.indexOf(n) < 0 &&
                (r[n] = e[n]);
        if (e != null && typeof Object.getOwnPropertySymbols == "function")
            for (
                var i = 0, n = Object.getOwnPropertySymbols(e);
                i < n.length;
                i++
            )
                t.indexOf(n[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(e, n[i]) &&
                    (r[n[i]] = e[n[i]]);
        return r;
    };
function Gr(e) {
    return (
        e &&
        e.map(function (t, r) {
            return ce.createElement(t.tag, re({ key: r }, t.attr), Gr(t.child));
        })
    );
}
function Dt(e) {
    return function (t) {
        return ce.createElement(
            Ds,
            re({ attr: re({}, e.attr) }, t),
            Gr(e.child)
        );
    };
}
function Ds(e) {
    var t = function (r) {
        var n = e.attr,
            i = e.size,
            s = e.title,
            o = Is(e, ["attr", "size", "title"]),
            d = i || r.size || "1em",
            y;
        return (
            r.className && (y = r.className),
            e.className && (y = (y ? y + " " : "") + e.className),
            ce.createElement(
                "svg",
                re(
                    {
                        stroke: "currentColor",
                        fill: "currentColor",
                        strokeWidth: "0",
                    },
                    r.attr,
                    n,
                    o,
                    {
                        className: y,
                        style: re(
                            re({ color: e.color || r.color }, r.style),
                            e.style
                        ),
                        height: d,
                        width: d,
                        xmlns: "http://www.w3.org/2000/svg",
                    }
                ),
                s && ce.createElement("title", null, s),
                e.children
            )
        );
    };
    return gr !== void 0
        ? ce.createElement(gr.Consumer, null, function (r) {
              return t(r);
          })
        : t(Vr);
}
function Ts(e) {
    return Dt({
        tag: "svg",
        attr: { viewBox: "0 0 24 24" },
        child: [
            {
                tag: "g",
                attr: { id: "Menu_Fries" },
                child: [
                    {
                        tag: "path",
                        attr: {
                            d: "M20.437,19.937c0.276,0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5l-16.874,0.002c-0.276,-0 -0.5,-0.224 -0.5,-0.5c-0,-0.276 0.224,-0.5 0.5,-0.5l16.874,-0.002Z",
                        },
                    },
                    {
                        tag: "path",
                        attr: {
                            d: "M20.437,11.5c0.276,-0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5l-10,0.001c-0.276,-0 -0.5,-0.224 -0.5,-0.5c-0,-0.276 0.224,-0.5 0.5,-0.5l10,-0.001Z",
                        },
                    },
                    {
                        tag: "path",
                        attr: {
                            d: "M20.437,3.062c0.276,-0 0.5,0.224 0.5,0.5c0,0.276 -0.224,0.5 -0.5,0.5l-16.874,0.001c-0.276,-0 -0.5,-0.224 -0.5,-0.5c-0,-0.276 0.224,-0.5 0.5,-0.5l16.874,-0.001Z",
                        },
                    },
                ],
            },
        ],
    })(e);
}
function vr(e) {
    return Dt({
        tag: "svg",
        attr: {
            version: "1.1",
            id: "search",
            x: "0px",
            y: "0px",
            viewBox: "0 0 24 24",
            style: "enable-background:new 0 0 24 24;",
        },
        child: [
            {
                tag: "g",
                attr: {},
                child: [
                    {
                        tag: "path",
                        attr: {
                            d: `M20.031,20.79c0.46,0.46,1.17-0.25,0.71-0.7l-3.75-3.76c1.27-1.41,2.04-3.27,2.04-5.31
		c0-4.39-3.57-7.96-7.96-7.96s-7.96,3.57-7.96,7.96c0,4.39,3.57,7.96,7.96,7.96c1.98,0,3.81-0.73,5.21-1.94L20.031,20.79z
		 M4.11,11.02c0-3.84,3.13-6.96,6.96-6.96c3.84,0,6.96,3.12,6.96,6.96c0,3.84-3.12,6.96-6.96,6.96C7.24,17.98,4.11,14.86,4.11,11.02
		z`,
                        },
                    },
                ],
            },
        ],
    })(e);
}
function Ns(e) {
    return Dt({
        tag: "svg",
        attr: { viewBox: "0 0 24 24" },
        child: [
            {
                tag: "g",
                attr: { id: "Shopping_Cart" },
                child: [
                    {
                        tag: "path",
                        attr: {
                            d: "M17.437,19.934c0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1c0.552,0 1,0.448 1,1Zm-11.217,-4.266l-0.945,-10.9c-0.03,-0.391 -0.356,-0.693 -0.749,-0.693l-0.966,-0c-0.276,-0 -0.5,-0.224 -0.5,-0.5c0,-0.276 0.224,-0.5 0.5,-0.5l0.966,-0c0.916,-0 1.676,0.704 1.746,1.617l0.139,1.818l13.03,-0c0.885,-0 1.577,0.76 1.494,1.638l-0.668,7.52c-0.121,1.285 -1.199,2.267 -2.489,2.267l-9.069,0c-1.29,0 -2.367,-0.981 -2.489,-2.267Zm0.274,-8.158l0.722,8.066c0.073,0.77 0.719,1.359 1.493,1.359l9.069,0c0.774,0 1.42,-0.589 1.493,-1.359l0.668,-7.518c0.028,-0.294 -0.203,-0.548 -0.498,-0.548l-12.947,-0Zm4.454,12.424c-0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c-0,-0.552 0.448,-1 1,-1c0.552,0 1,0.448 1,1Z",
                        },
                    },
                ],
            },
        ],
    })(e);
}
const qs = function () {
        return A.jsx("nav", {
            className: "bg-white relative border-t z-30",
            children: A.jsx("div", {
                className: "container hidden lg:block",
                children: A.jsxs("div", {
                    className: "grid grid-cols-6",
                    children: [
                        A.jsx("div", {
                            className: "",
                            children: A.jsxs("div", {
                                className:
                                    "w-full px-4 py-2 bg-primary text-gray-800 flex gap-2 items-center relative",
                                children: [
                                    A.jsx("span", {
                                        className: "text-lg",
                                        children: A.jsx(Ts, {}),
                                    }),
                                    " ",
                                    "Browse Categories",
                                ],
                            }),
                        }),
                        A.jsxs("div", {
                            className:
                                "col-span-5 w-full flex gap-4 items-center justify-end",
                            children: [
                                A.jsx("div", {
                                    className: "flex gap-4",
                                    children: A.jsx($e, {
                                        className: "text-gray-800 py-2",
                                        to: "/",
                                        children: "T-Shirts",
                                    }),
                                }),
                                A.jsx("div", {
                                    className: "flex gap-4",
                                    children: A.jsx($e, {
                                        className: "text-gray-800 py-2",
                                        to: "/",
                                        children: "Home",
                                    }),
                                }),
                            ],
                        }),
                    ],
                }),
            }),
        });
    },
    ks = () =>
        A.jsx("div", {
            className: "py-2 bg-white",
            children: A.jsxs("div", {
                className: "container flex justify-between",
                children: [
                    A.jsx($e, {
                        className: "w-12 sm:w-max",
                        to: "/",
                        children: A.jsx("img", {
                            className: "max-w-[60px] w-full aspect-square",
                            src: "https://cholgori-com-1.vercel.app/images/logo.svg",
                            alt: "Logo",
                        }),
                    }),
                    A.jsxs("div", {
                        className: "flex items-center gap-4",
                        children: [
                            A.jsxs("div", {
                                className: "items-stretch mr-4 hidden sm:flex",
                                children: [
                                    A.jsx("input", {
                                        className: "px-3 py-2 bg-gray-100",
                                        type: "text",
                                        placeholder: "search...",
                                    }),
                                    A.jsx("button", {
                                        className:
                                            "bg-primary text-gray-800 px-3 text-lg",
                                        children: A.jsx(vr, {}),
                                    }),
                                ],
                            }),
                            A.jsx("button", {
                                className: "text-gray-500 text-2xl sm:hidden",
                                children: A.jsx(vr, {}),
                            }),
                            A.jsxs($e, {
                                to: "/cart",
                                className:
                                    "flex gap-3 items-center text-gray-800",
                                children: [
                                    A.jsxs("span", {
                                        className:
                                            "text-gray-500 text-2xl relative",
                                        children: [
                                            A.jsx(Ns, {}),
                                            A.jsx("span", {
                                                className:
                                                    "absolute -top-2 -right-2 bg-primary text-gray-900 w-5 h-5 text-xs rounded-full flex items-center justify-center",
                                                children: "0",
                                            }),
                                        ],
                                    }),
                                    "10$",
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        }),
    zs = function ({ widget: e, store: t }) {
        return A.jsxs(A.Fragment, {
            children: [
                A.jsx(ks, { widget: e, store: t }),
                A.jsx(qs, { widget: e, store: t }),
            ],
        });
    },
    Qs = function ({ widget: e }) {
        var t;
        return A.jsx(A.Fragment, {
            children: A.jsxs("section", {
                className: "py-8 bg-gray-100",
                children: [
                    A.jsx("h1", {
                        className: "text-center text-2xl mb-4 text-gray-800",
                        children:
                            (t = e.inputs.find((r) => r.name === "title")) ==
                            null
                                ? void 0
                                : t.value,
                    }),
                    A.jsx("div", {
                        className:
                            "container hidden sm:!grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 last:border-r-0 flex-wrap",
                        children: e.inputs
                            .slice()
                            .sort(function (r, n) {
                                return r.id - n.id;
                            })
                            .map((r, n) => {
                                var i, s, o;
                                return A.jsx(A.Fragment, {
                                    children:
                                        r.name === "offer_box" &&
                                        r.items &&
                                        A.jsxs(
                                            "div",
                                            {
                                                className:
                                                    "bg-white flex gap-4 px-4 py-6 group",
                                                children: [
                                                    A.jsx("span", {
                                                        className:
                                                            "flex items-center text-4xl text-gray-700 group-hover:text-primary transition-all",
                                                        dangerouslySetInnerHTML:
                                                            {
                                                                __html: `${
                                                                    (i =
                                                                        r.items.find(
                                                                            (
                                                                                d
                                                                            ) =>
                                                                                d.name ===
                                                                                "icon"
                                                                        )) ==
                                                                    null
                                                                        ? void 0
                                                                        : i.value
                                                                }`,
                                                            },
                                                    }),
                                                    A.jsxs("div", {
                                                        className: "w-full",
                                                        children: [
                                                            A.jsx("h1", {
                                                                className:
                                                                    "text-lg text-gray-700",
                                                                children:
                                                                    (s =
                                                                        r.items.find(
                                                                            (
                                                                                d
                                                                            ) =>
                                                                                d.name ===
                                                                                "title"
                                                                        )) ==
                                                                    null
                                                                        ? void 0
                                                                        : s.value,
                                                            }),
                                                            A.jsx("p", {
                                                                className:
                                                                    "text-gray-600",
                                                                children:
                                                                    (o =
                                                                        r.items.find(
                                                                            (
                                                                                d
                                                                            ) =>
                                                                                d.name ===
                                                                                "description"
                                                                        )) ==
                                                                    null
                                                                        ? void 0
                                                                        : o.value,
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                            },
                                            n
                                        ),
                                });
                            }),
                    }),
                ],
            }),
        });
    },
    Js = function ({ widget: e, store: t }) {
        const r = {
            navigation: A.jsx(zs, { widget: e, store: t }),
            hero: A.jsx(Ms, { widget: e, store: t }),
            offers: A.jsx(Qs, { widget: e, store: t }),
        };
        return A.jsx(A.Fragment, {
            children: r[e.name]
                ? r[e.name]
                : `Please create the ${e.name} component in react.`,
        });
    };
export {
    Js as C,
    Gs as G,
    Us as P,
    Vs as a,
    br as b,
    de as c,
    Ls as d,
    Ks as e,
    Hs as f,
    yi as g,
    Dt as h,
    Ps as i,
    Ws as p,
    Bs as s,
    fi as u,
};
