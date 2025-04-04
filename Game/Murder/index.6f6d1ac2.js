/*!
 * pixi.js - v6.3.0
 * Compiled Wed, 23 Mar 2022 18:58:56 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var PIXI = (function (t) {
  var e = setTimeout;
  function r(t) {
    return Boolean(t && void 0 !== t.length);
  }
  function i() {}
  function n(t) {
    if (!(this instanceof n))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof t) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = void 0),
      (this._deferreds = []),
      l(t, this);
  }
  function o(t, e) {
    for (; 3 === t._state; ) t = t._value;
    0 !== t._state
      ? ((t._handled = !0),
        n._immediateFn(function () {
          var r = 1 === t._state ? e.onFulfilled : e.onRejected;
          if (null !== r) {
            var i;
            try {
              i = r(t._value);
            } catch (t) {
              return void a(e.promise, t);
            }
            s(e.promise, i);
          } else (1 === t._state ? s : a)(e.promise, t._value);
        }))
      : t._deferreds.push(e);
  }
  function s(t, e) {
    try {
      if (e === t)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (e && ("object" == typeof e || "function" == typeof e)) {
        var r = e.then;
        if (e instanceof n) return (t._state = 3), (t._value = e), void h(t);
        if ("function" == typeof r)
          return void l(
            ((i = r),
            (o = e),
            function () {
              i.apply(o, arguments);
            }),
            t
          );
      }
      (t._state = 1), (t._value = e), h(t);
    } catch (e) {
      a(t, e);
    }
    var i, o;
  }
  function a(t, e) {
    (t._state = 2), (t._value = e), h(t);
  }
  function h(t) {
    2 === t._state &&
      0 === t._deferreds.length &&
      n._immediateFn(function () {
        t._handled || n._unhandledRejectionFn(t._value);
      });
    for (var e = 0, r = t._deferreds.length; e < r; e++) o(t, t._deferreds[e]);
    t._deferreds = null;
  }
  function u(t, e, r) {
    (this.onFulfilled = "function" == typeof t ? t : null),
      (this.onRejected = "function" == typeof e ? e : null),
      (this.promise = r);
  }
  function l(t, e) {
    var r = !1;
    try {
      t(
        function (t) {
          r || ((r = !0), s(e, t));
        },
        function (t) {
          r || ((r = !0), a(e, t));
        }
      );
    } catch (t) {
      if (r) return;
      (r = !0), a(e, t);
    }
  }
  (n.prototype.catch = function (t) {
    return this.then(null, t);
  }),
    (n.prototype.then = function (t, e) {
      var r = new this.constructor(i);
      return o(this, new u(t, e, r)), r;
    }),
    (n.prototype.finally = function (t) {
      var e = this.constructor;
      return this.then(
        function (r) {
          return e.resolve(t()).then(function () {
            return r;
          });
        },
        function (r) {
          return e.resolve(t()).then(function () {
            return e.reject(r);
          });
        }
      );
    }),
    (n.all = function (t) {
      return new n(function (e, i) {
        if (!r(t)) return i(new TypeError("Promise.all accepts an array"));
        var n = Array.prototype.slice.call(t);
        if (0 === n.length) return e([]);
        var o = n.length;
        function s(t, r) {
          try {
            if (r && ("object" == typeof r || "function" == typeof r)) {
              var a = r.then;
              if ("function" == typeof a)
                return void a.call(
                  r,
                  function (e) {
                    s(t, e);
                  },
                  i
                );
            }
            (n[t] = r), 0 == --o && e(n);
          } catch (t) {
            i(t);
          }
        }
        for (var a = 0; a < n.length; a++) s(a, n[a]);
      });
    }),
    (n.allSettled = function (t) {
      return new this(function (e, r) {
        if (!t || void 0 === t.length)
          return r(
            new TypeError(
              typeof t +
                " " +
                t +
                " is not iterable(cannot read property Symbol(Symbol.iterator))"
            )
          );
        var i = Array.prototype.slice.call(t);
        if (0 === i.length) return e([]);
        var n = i.length;
        function o(t, r) {
          if (r && ("object" == typeof r || "function" == typeof r)) {
            var s = r.then;
            if ("function" == typeof s)
              return void s.call(
                r,
                function (e) {
                  o(t, e);
                },
                function (r) {
                  (i[t] = { status: "rejected", reason: r }), 0 == --n && e(i);
                }
              );
          }
          (i[t] = { status: "fulfilled", value: r }), 0 == --n && e(i);
        }
        for (var s = 0; s < i.length; s++) o(s, i[s]);
      });
    }),
    (n.resolve = function (t) {
      return t && "object" == typeof t && t.constructor === n
        ? t
        : new n(function (e) {
            e(t);
          });
    }),
    (n.reject = function (t) {
      return new n(function (e, r) {
        r(t);
      });
    }),
    (n.race = function (t) {
      return new n(function (e, i) {
        if (!r(t)) return i(new TypeError("Promise.race accepts an array"));
        for (var o = 0, s = t.length; o < s; o++) n.resolve(t[o]).then(e, i);
      });
    }),
    (n._immediateFn =
      ("function" == typeof setImmediate &&
        function (t) {
          setImmediate(t);
        }) ||
      function (t) {
        e(t, 0);
      }),
    (n._unhandledRejectionFn = function (t) {
      "undefined" != typeof console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", t);
    });
  var c = Object.getOwnPropertySymbols,
    d = Object.prototype.hasOwnProperty,
    f = Object.prototype.propertyIsEnumerable;
  function p(t) {
    if (null == t)
      throw new TypeError(
        "Object.assign cannot be called with null or undefined"
      );
    return Object(t);
  }
  var _ = (function () {
    try {
      if (!Object.assign) return !1;
      var t = new String("abc");
      if (((t[5] = "de"), "5" === Object.getOwnPropertyNames(t)[0])) return !1;
      for (var e = {}, r = 0; r < 10; r++) e["_" + String.fromCharCode(r)] = r;
      if (
        "0123456789" !==
        Object.getOwnPropertyNames(e)
          .map(function (t) {
            return e[t];
          })
          .join("")
      )
        return !1;
      var i = {};
      return (
        "abcdefghijklmnopqrst".split("").forEach(function (t) {
          i[t] = t;
        }),
        "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, i)).join("")
      );
    } catch (t) {
      return !1;
    }
  })()
    ? Object.assign
    : function (t, e) {
        for (
          var r, i, n = arguments, o = p(t), s = 1;
          s < arguments.length;
          s++
        ) {
          for (var a in (r = Object(n[s]))) d.call(r, a) && (o[a] = r[a]);
          if (c) {
            i = c(r);
            for (var h = 0; h < i.length; h++)
              f.call(r, i[h]) && (o[i[h]] = r[i[h]]);
          }
        }
        return o;
      };
  /*!
   * @pixi/polyfill - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/polyfill is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */ "undefined" == typeof globalThis &&
    ("undefined" != typeof self
      ? (self.globalThis = self)
      : "undefined" != typeof global && (global.globalThis = global)),
    globalThis.Promise || (globalThis.Promise = n),
    Object.assign || (Object.assign = _);
  if (
    ((Date.now && Date.prototype.getTime) ||
      (Date.now = function () {
        return new Date().getTime();
      }),
    !globalThis.performance || !globalThis.performance.now)
  ) {
    var v = Date.now();
    globalThis.performance || (globalThis.performance = {}),
      (globalThis.performance.now = function () {
        return Date.now() - v;
      });
  }
  for (
    var m = Date.now(), E = ["ms", "moz", "webkit", "o"], T = 0;
    T < E.length && !globalThis.requestAnimationFrame;
    ++T
  ) {
    var y = E[T];
    (globalThis.requestAnimationFrame =
      globalThis[y + "RequestAnimationFrame"]),
      (globalThis.cancelAnimationFrame =
        globalThis[y + "CancelAnimationFrame"] ||
        globalThis[y + "CancelRequestAnimationFrame"]);
  }
  globalThis.requestAnimationFrame ||
    (globalThis.requestAnimationFrame = function (t) {
      if ("function" != typeof t) throw new TypeError(t + "is not a function");
      var e = Date.now(),
        r = 16 + m - e;
      return (
        r < 0 && (r = 0),
        (m = e),
        globalThis.self.setTimeout(function () {
          (m = Date.now()), t(performance.now());
        }, r)
      );
    }),
    globalThis.cancelAnimationFrame ||
      (globalThis.cancelAnimationFrame = function (t) {
        return clearTimeout(t);
      }),
    Math.sign ||
      (Math.sign = function (t) {
        return 0 === (t = Number(t)) || isNaN(t) ? t : t > 0 ? 1 : -1;
      }),
    Number.isInteger ||
      (Number.isInteger = function (t) {
        return "number" == typeof t && isFinite(t) && Math.floor(t) === t;
      }),
    globalThis.ArrayBuffer || (globalThis.ArrayBuffer = Array),
    globalThis.Float32Array || (globalThis.Float32Array = Array),
    globalThis.Uint32Array || (globalThis.Uint32Array = Array),
    globalThis.Uint16Array || (globalThis.Uint16Array = Array),
    globalThis.Uint8Array || (globalThis.Uint8Array = Array),
    globalThis.Int32Array || (globalThis.Int32Array = Array);
  var g = /iPhone/i,
    b = /iPod/i,
    R = /iPad/i,
    A = /\biOS-universal(?:.+)Mac\b/i,
    x = /\bAndroid(?:.+)Mobile\b/i,
    S = /Android/i,
    O = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,
    I = /Silk/i,
    P = /Windows Phone/i,
    M = /\bWindows(?:.+)ARM\b/i,
    N = /BlackBerry/i,
    D = /BB10/i,
    C = /Opera Mini/i,
    w = /\b(CriOS|Chrome)(?:.+)Mobile/i,
    L = /Mobile(?:.+)Firefox\b/i,
    F = function (t) {
      return (
        void 0 !== t &&
        "MacIntel" === t.platform &&
        "number" == typeof t.maxTouchPoints &&
        t.maxTouchPoints > 1 &&
        "undefined" == typeof MSStream
      );
    };
  /*!
   * @pixi/settings - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/settings is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var U,
    B,
    G,
    X,
    k,
    H,
    Y,
    j,
    V,
    W,
    z,
    q,
    K,
    Z,
    Q,
    J,
    $,
    tt,
    et,
    rt,
    it,
    nt,
    ot,
    st,
    at,
    ht,
    ut,
    lt,
    ct,
    dt,
    ft,
    pt,
    _t,
    vt,
    mt,
    Et,
    Tt,
    yt,
    gt = (function (t) {
      var e = { userAgent: "", platform: "", maxTouchPoints: 0 };
      t || "undefined" == typeof navigator
        ? "string" == typeof t
          ? (e.userAgent = t)
          : t &&
            t.userAgent &&
            (e = {
              userAgent: t.userAgent,
              platform: t.platform,
              maxTouchPoints: t.maxTouchPoints || 0,
            })
        : (e = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints || 0,
          });
      var r = e.userAgent,
        i = r.split("[FBAN");
      void 0 !== i[1] && (r = i[0]),
        void 0 !== (i = r.split("Twitter"))[1] && (r = i[0]);
      var n = (function (t) {
          return function (e) {
            return e.test(t);
          };
        })(r),
        o = {
          apple: {
            phone: n(g) && !n(P),
            ipod: n(b),
            tablet: !n(g) && (n(R) || F(e)) && !n(P),
            universal: n(A),
            device: (n(g) || n(b) || n(R) || n(A) || F(e)) && !n(P),
          },
          amazon: { phone: n(O), tablet: !n(O) && n(I), device: n(O) || n(I) },
          android: {
            phone: (!n(P) && n(O)) || (!n(P) && n(x)),
            tablet: !n(P) && !n(O) && !n(x) && (n(I) || n(S)),
            device:
              (!n(P) && (n(O) || n(I) || n(x) || n(S))) || n(/\bokhttp\b/i),
          },
          windows: { phone: n(P), tablet: n(M), device: n(P) || n(M) },
          other: {
            blackberry: n(N),
            blackberry10: n(D),
            opera: n(C),
            firefox: n(L),
            chrome: n(w),
            device: n(N) || n(D) || n(C) || n(L) || n(w),
          },
          any: !1,
          phone: !1,
          tablet: !1,
        };
      return (
        (o.any =
          o.apple.device ||
          o.android.device ||
          o.windows.device ||
          o.other.device),
        (o.phone = o.apple.phone || o.android.phone || o.windows.phone),
        (o.tablet = o.apple.tablet || o.android.tablet || o.windows.tablet),
        o
      );
    })(globalThis.navigator);
  ((B = U || (U = {}))[(B.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
    (B[(B.WEBGL = 1)] = "WEBGL"),
    (B[(B.WEBGL2 = 2)] = "WEBGL2"),
    ((X = G || (G = {}))[(X.UNKNOWN = 0)] = "UNKNOWN"),
    (X[(X.WEBGL = 1)] = "WEBGL"),
    (X[(X.CANVAS = 2)] = "CANVAS"),
    ((H = k || (k = {}))[(H.COLOR = 16384)] = "COLOR"),
    (H[(H.DEPTH = 256)] = "DEPTH"),
    (H[(H.STENCIL = 1024)] = "STENCIL"),
    ((j = Y || (Y = {}))[(j.NORMAL = 0)] = "NORMAL"),
    (j[(j.ADD = 1)] = "ADD"),
    (j[(j.MULTIPLY = 2)] = "MULTIPLY"),
    (j[(j.SCREEN = 3)] = "SCREEN"),
    (j[(j.OVERLAY = 4)] = "OVERLAY"),
    (j[(j.DARKEN = 5)] = "DARKEN"),
    (j[(j.LIGHTEN = 6)] = "LIGHTEN"),
    (j[(j.COLOR_DODGE = 7)] = "COLOR_DODGE"),
    (j[(j.COLOR_BURN = 8)] = "COLOR_BURN"),
    (j[(j.HARD_LIGHT = 9)] = "HARD_LIGHT"),
    (j[(j.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
    (j[(j.DIFFERENCE = 11)] = "DIFFERENCE"),
    (j[(j.EXCLUSION = 12)] = "EXCLUSION"),
    (j[(j.HUE = 13)] = "HUE"),
    (j[(j.SATURATION = 14)] = "SATURATION"),
    (j[(j.COLOR = 15)] = "COLOR"),
    (j[(j.LUMINOSITY = 16)] = "LUMINOSITY"),
    (j[(j.NORMAL_NPM = 17)] = "NORMAL_NPM"),
    (j[(j.ADD_NPM = 18)] = "ADD_NPM"),
    (j[(j.SCREEN_NPM = 19)] = "SCREEN_NPM"),
    (j[(j.NONE = 20)] = "NONE"),
    (j[(j.SRC_OVER = 0)] = "SRC_OVER"),
    (j[(j.SRC_IN = 21)] = "SRC_IN"),
    (j[(j.SRC_OUT = 22)] = "SRC_OUT"),
    (j[(j.SRC_ATOP = 23)] = "SRC_ATOP"),
    (j[(j.DST_OVER = 24)] = "DST_OVER"),
    (j[(j.DST_IN = 25)] = "DST_IN"),
    (j[(j.DST_OUT = 26)] = "DST_OUT"),
    (j[(j.DST_ATOP = 27)] = "DST_ATOP"),
    (j[(j.ERASE = 26)] = "ERASE"),
    (j[(j.SUBTRACT = 28)] = "SUBTRACT"),
    (j[(j.XOR = 29)] = "XOR"),
    ((W = V || (V = {}))[(W.POINTS = 0)] = "POINTS"),
    (W[(W.LINES = 1)] = "LINES"),
    (W[(W.LINE_LOOP = 2)] = "LINE_LOOP"),
    (W[(W.LINE_STRIP = 3)] = "LINE_STRIP"),
    (W[(W.TRIANGLES = 4)] = "TRIANGLES"),
    (W[(W.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
    (W[(W.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN"),
    ((q = z || (z = {}))[(q.RGBA = 6408)] = "RGBA"),
    (q[(q.RGB = 6407)] = "RGB"),
    (q[(q.RG = 33319)] = "RG"),
    (q[(q.RED = 6403)] = "RED"),
    (q[(q.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
    (q[(q.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
    (q[(q.RG_INTEGER = 33320)] = "RG_INTEGER"),
    (q[(q.RED_INTEGER = 36244)] = "RED_INTEGER"),
    (q[(q.ALPHA = 6406)] = "ALPHA"),
    (q[(q.LUMINANCE = 6409)] = "LUMINANCE"),
    (q[(q.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
    (q[(q.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
    (q[(q.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL"),
    ((Z = K || (K = {}))[(Z.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
    (Z[(Z.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
    (Z[(Z.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
    (Z[(Z.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
      "TEXTURE_CUBE_MAP_POSITIVE_X"),
    (Z[(Z.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_X"),
    (Z[(Z.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Y"),
    (Z[(Z.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
    (Z[(Z.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
      "TEXTURE_CUBE_MAP_POSITIVE_Z"),
    (Z[(Z.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
      "TEXTURE_CUBE_MAP_NEGATIVE_Z"),
    ((J = Q || (Q = {}))[(J.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
    (J[(J.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
    (J[(J.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
    (J[(J.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
    (J[(J.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
    (J[(J.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
    (J[(J.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
      "UNSIGNED_INT_10F_11F_11F_REV"),
    (J[(J.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
      "UNSIGNED_INT_2_10_10_10_REV"),
    (J[(J.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
    (J[(J.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
    (J[(J.BYTE = 5120)] = "BYTE"),
    (J[(J.SHORT = 5122)] = "SHORT"),
    (J[(J.INT = 5124)] = "INT"),
    (J[(J.FLOAT = 5126)] = "FLOAT"),
    (J[(J.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
      "FLOAT_32_UNSIGNED_INT_24_8_REV"),
    (J[(J.HALF_FLOAT = 36193)] = "HALF_FLOAT"),
    ((tt = $ || ($ = {}))[(tt.FLOAT = 0)] = "FLOAT"),
    (tt[(tt.INT = 1)] = "INT"),
    (tt[(tt.UINT = 2)] = "UINT"),
    ((rt = et || (et = {}))[(rt.NEAREST = 0)] = "NEAREST"),
    (rt[(rt.LINEAR = 1)] = "LINEAR"),
    ((nt = it || (it = {}))[(nt.CLAMP = 33071)] = "CLAMP"),
    (nt[(nt.REPEAT = 10497)] = "REPEAT"),
    (nt[(nt.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT"),
    ((st = ot || (ot = {}))[(st.OFF = 0)] = "OFF"),
    (st[(st.POW2 = 1)] = "POW2"),
    (st[(st.ON = 2)] = "ON"),
    (st[(st.ON_MANUAL = 3)] = "ON_MANUAL"),
    ((ht = at || (at = {}))[(ht.NPM = 0)] = "NPM"),
    (ht[(ht.UNPACK = 1)] = "UNPACK"),
    (ht[(ht.PMA = 2)] = "PMA"),
    (ht[(ht.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
    (ht[(ht.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
    (ht[(ht.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
    (ht[(ht.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA"),
    ((lt = ut || (ut = {}))[(lt.NO = 0)] = "NO"),
    (lt[(lt.YES = 1)] = "YES"),
    (lt[(lt.AUTO = 2)] = "AUTO"),
    (lt[(lt.BLEND = 0)] = "BLEND"),
    (lt[(lt.CLEAR = 1)] = "CLEAR"),
    (lt[(lt.BLIT = 2)] = "BLIT"),
    ((dt = ct || (ct = {}))[(dt.AUTO = 0)] = "AUTO"),
    (dt[(dt.MANUAL = 1)] = "MANUAL"),
    ((pt = ft || (ft = {})).LOW = "lowp"),
    (pt.MEDIUM = "mediump"),
    (pt.HIGH = "highp"),
    ((vt = _t || (_t = {}))[(vt.NONE = 0)] = "NONE"),
    (vt[(vt.SCISSOR = 1)] = "SCISSOR"),
    (vt[(vt.STENCIL = 2)] = "STENCIL"),
    (vt[(vt.SPRITE = 3)] = "SPRITE"),
    ((Et = mt || (mt = {}))[(Et.NONE = 0)] = "NONE"),
    (Et[(Et.LOW = 2)] = "LOW"),
    (Et[(Et.MEDIUM = 4)] = "MEDIUM"),
    (Et[(Et.HIGH = 8)] = "HIGH"),
    ((yt = Tt || (Tt = {}))[(yt.ELEMENT_ARRAY_BUFFER = 34963)] =
      "ELEMENT_ARRAY_BUFFER"),
    (yt[(yt.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
    (yt[(yt.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
  var bt = {
      MIPMAP_TEXTURES: ot.POW2,
      ANISOTROPIC_LEVEL: 0,
      RESOLUTION: 1,
      FILTER_RESOLUTION: 1,
      FILTER_MULTISAMPLE: mt.NONE,
      SPRITE_MAX_TEXTURES: (function (t) {
        var e = !0;
        if (gt.tablet || gt.phone) {
          var r;
          if (gt.apple.device)
            if ((r = navigator.userAgent.match(/OS (\d+)_(\d+)?/)))
              parseInt(r[1], 10) < 11 && (e = !1);
          if (gt.android.device)
            if ((r = navigator.userAgent.match(/Android\s([0-9.]*)/)))
              parseInt(r[1], 10) < 7 && (e = !1);
        }
        return e ? t : 4;
      })(32),
      SPRITE_BATCH_SIZE: 4096,
      RENDER_OPTIONS: {
        view: null,
        antialias: !1,
        autoDensity: !1,
        backgroundColor: 0,
        backgroundAlpha: 1,
        useContextAlpha: !0,
        clearBeforeRender: !0,
        preserveDrawingBuffer: !1,
        width: 800,
        height: 600,
        legacy: !1,
      },
      GC_MODE: ct.AUTO,
      GC_MAX_IDLE: 3600,
      GC_MAX_CHECK_COUNT: 600,
      WRAP_MODE: it.CLAMP,
      SCALE_MODE: et.LINEAR,
      PRECISION_VERTEX: ft.HIGH,
      PRECISION_FRAGMENT: gt.apple.device ? ft.HIGH : ft.MEDIUM,
      CAN_UPLOAD_SAME_BUFFER: !gt.apple.device,
      CREATE_IMAGE_BITMAP: !1,
      ROUND_PIXELS: !1,
    },
    Rt =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {};
  function At(t, e, r) {
    return (
      t(
        (r = {
          path: e,
          exports: {},
          require: function (t, e) {
            return (function () {
              throw new Error(
                "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
              );
            })(null == e && r.path);
          },
        }),
        r.exports
      ),
      r.exports
    );
  }
  var xt = At(function (t) {
      var e = Object.prototype.hasOwnProperty,
        r = "~";
      function i() {}
      function n(t, e, r) {
        (this.fn = t), (this.context = e), (this.once = r || !1);
      }
      function o(t, e, i, o, s) {
        if ("function" != typeof i)
          throw new TypeError("The listener must be a function");
        var a = new n(i, o || t, s),
          h = r ? r + e : e;
        return (
          t._events[h]
            ? t._events[h].fn
              ? (t._events[h] = [t._events[h], a])
              : t._events[h].push(a)
            : ((t._events[h] = a), t._eventsCount++),
          t
        );
      }
      function s(t, e) {
        0 == --t._eventsCount ? (t._events = new i()) : delete t._events[e];
      }
      function a() {
        (this._events = new i()), (this._eventsCount = 0);
      }
      Object.create &&
        ((i.prototype = Object.create(null)), new i().__proto__ || (r = !1)),
        (a.prototype.eventNames = function () {
          var t,
            i,
            n = [];
          if (0 === this._eventsCount) return n;
          for (i in (t = this._events))
            e.call(t, i) && n.push(r ? i.slice(1) : i);
          return Object.getOwnPropertySymbols
            ? n.concat(Object.getOwnPropertySymbols(t))
            : n;
        }),
        (a.prototype.listeners = function (t) {
          var e = r ? r + t : t,
            i = this._events[e];
          if (!i) return [];
          if (i.fn) return [i.fn];
          for (var n = 0, o = i.length, s = new Array(o); n < o; n++)
            s[n] = i[n].fn;
          return s;
        }),
        (a.prototype.listenerCount = function (t) {
          var e = r ? r + t : t,
            i = this._events[e];
          return i ? (i.fn ? 1 : i.length) : 0;
        }),
        (a.prototype.emit = function (t, e, i, n, o, s) {
          var a = arguments,
            h = r ? r + t : t;
          if (!this._events[h]) return !1;
          var u,
            l,
            c = this._events[h],
            d = arguments.length;
          if (c.fn) {
            switch ((c.once && this.removeListener(t, c.fn, void 0, !0), d)) {
              case 1:
                return c.fn.call(c.context), !0;
              case 2:
                return c.fn.call(c.context, e), !0;
              case 3:
                return c.fn.call(c.context, e, i), !0;
              case 4:
                return c.fn.call(c.context, e, i, n), !0;
              case 5:
                return c.fn.call(c.context, e, i, n, o), !0;
              case 6:
                return c.fn.call(c.context, e, i, n, o, s), !0;
            }
            for (l = 1, u = new Array(d - 1); l < d; l++) u[l - 1] = a[l];
            c.fn.apply(c.context, u);
          } else {
            var f,
              p = c.length;
            for (l = 0; l < p; l++)
              switch (
                (c[l].once && this.removeListener(t, c[l].fn, void 0, !0), d)
              ) {
                case 1:
                  c[l].fn.call(c[l].context);
                  break;
                case 2:
                  c[l].fn.call(c[l].context, e);
                  break;
                case 3:
                  c[l].fn.call(c[l].context, e, i);
                  break;
                case 4:
                  c[l].fn.call(c[l].context, e, i, n);
                  break;
                default:
                  if (!u)
                    for (f = 1, u = new Array(d - 1); f < d; f++)
                      u[f - 1] = a[f];
                  c[l].fn.apply(c[l].context, u);
              }
          }
          return !0;
        }),
        (a.prototype.on = function (t, e, r) {
          return o(this, t, e, r, !1);
        }),
        (a.prototype.once = function (t, e, r) {
          return o(this, t, e, r, !0);
        }),
        (a.prototype.removeListener = function (t, e, i, n) {
          var o = r ? r + t : t;
          if (!this._events[o]) return this;
          if (!e) return s(this, o), this;
          var a = this._events[o];
          if (a.fn)
            a.fn !== e ||
              (n && !a.once) ||
              (i && a.context !== i) ||
              s(this, o);
          else {
            for (var h = 0, u = [], l = a.length; h < l; h++)
              (a[h].fn !== e ||
                (n && !a[h].once) ||
                (i && a[h].context !== i)) &&
                u.push(a[h]);
            u.length
              ? (this._events[o] = 1 === u.length ? u[0] : u)
              : s(this, o);
          }
          return this;
        }),
        (a.prototype.removeAllListeners = function (t) {
          var e;
          return (
            t
              ? ((e = r ? r + t : t), this._events[e] && s(this, e))
              : ((this._events = new i()), (this._eventsCount = 0)),
            this
          );
        }),
        (a.prototype.off = a.prototype.removeListener),
        (a.prototype.addListener = a.prototype.on),
        (a.prefixed = r),
        (a.EventEmitter = a),
        (t.exports = a);
    }),
    St = It,
    Ot = It;
  function It(t, e, r) {
    r = r || 2;
    var i,
      n,
      o,
      s,
      a,
      h,
      u,
      l = e && e.length,
      c = l ? e[0] * r : t.length,
      d = Pt(t, 0, c, r, !0),
      f = [];
    if (!d || d.next === d.prev) return f;
    if (
      (l &&
        (d = (function (t, e, r, i) {
          var n,
            o,
            s,
            a = [];
          for (n = 0, o = e.length; n < o; n++)
            (s = Pt(
              t,
              e[n] * i,
              n < o - 1 ? e[n + 1] * i : t.length,
              i,
              !1
            )) === s.next && (s.steiner = !0),
              a.push(Xt(s));
          for (a.sort(Ft), n = 0; n < a.length; n++)
            Ut(a[n], r), (r = Mt(r, r.next));
          return r;
        })(t, e, d, r)),
      t.length > 80 * r)
    ) {
      (i = o = t[0]), (n = s = t[1]);
      for (var p = r; p < c; p += r)
        (a = t[p]) < i && (i = a),
          (h = t[p + 1]) < n && (n = h),
          a > o && (o = a),
          h > s && (s = h);
      u = 0 !== (u = Math.max(o - i, s - n)) ? 1 / u : 0;
    }
    return Nt(d, f, r, i, n, u), f;
  }
  function Pt(t, e, r, i, n) {
    var o, s;
    if (n === $t(t, e, r, i) > 0)
      for (o = e; o < r; o += i) s = Zt(o, t[o], t[o + 1], s);
    else for (o = r - i; o >= e; o -= i) s = Zt(o, t[o], t[o + 1], s);
    return s && jt(s, s.next) && (Qt(s), (s = s.next)), s;
  }
  function Mt(t, e) {
    if (!t) return t;
    e || (e = t);
    var r,
      i = t;
    do {
      if (
        ((r = !1), i.steiner || (!jt(i, i.next) && 0 !== Yt(i.prev, i, i.next)))
      )
        i = i.next;
      else {
        if ((Qt(i), (i = e = i.prev) === i.next)) break;
        r = !0;
      }
    } while (r || i !== e);
    return e;
  }
  function Nt(t, e, r, i, n, o, s) {
    if (t) {
      !s &&
        o &&
        (function (t, e, r, i) {
          var n = t;
          do {
            null === n.z && (n.z = Gt(n.x, n.y, e, r, i)),
              (n.prevZ = n.prev),
              (n.nextZ = n.next),
              (n = n.next);
          } while (n !== t);
          (n.prevZ.nextZ = null),
            (n.prevZ = null),
            (function (t) {
              var e,
                r,
                i,
                n,
                o,
                s,
                a,
                h,
                u = 1;
              do {
                for (r = t, t = null, o = null, s = 0; r; ) {
                  for (
                    s++, i = r, a = 0, e = 0;
                    e < u && (a++, (i = i.nextZ));
                    e++
                  );
                  for (h = u; a > 0 || (h > 0 && i); )
                    0 !== a && (0 === h || !i || r.z <= i.z)
                      ? ((n = r), (r = r.nextZ), a--)
                      : ((n = i), (i = i.nextZ), h--),
                      o ? (o.nextZ = n) : (t = n),
                      (n.prevZ = o),
                      (o = n);
                  r = i;
                }
                (o.nextZ = null), (u *= 2);
              } while (s > 1);
            })(n);
        })(t, i, n, o);
      for (var a, h, u = t; t.prev !== t.next; )
        if (((a = t.prev), (h = t.next), o ? Ct(t, i, n, o) : Dt(t)))
          e.push(a.i / r),
            e.push(t.i / r),
            e.push(h.i / r),
            Qt(t),
            (t = h.next),
            (u = h.next);
        else if ((t = h) === u) {
          s
            ? 1 === s
              ? Nt((t = wt(Mt(t), e, r)), e, r, i, n, o, 2)
              : 2 === s && Lt(t, e, r, i, n, o)
            : Nt(Mt(t), e, r, i, n, o, 1);
          break;
        }
    }
  }
  function Dt(t) {
    var e = t.prev,
      r = t,
      i = t.next;
    if (Yt(e, r, i) >= 0) return !1;
    for (var n = t.next.next; n !== t.prev; ) {
      if (
        kt(e.x, e.y, r.x, r.y, i.x, i.y, n.x, n.y) &&
        Yt(n.prev, n, n.next) >= 0
      )
        return !1;
      n = n.next;
    }
    return !0;
  }
  function Ct(t, e, r, i) {
    var n = t.prev,
      o = t,
      s = t.next;
    if (Yt(n, o, s) >= 0) return !1;
    for (
      var a = n.x < o.x ? (n.x < s.x ? n.x : s.x) : o.x < s.x ? o.x : s.x,
        h = n.y < o.y ? (n.y < s.y ? n.y : s.y) : o.y < s.y ? o.y : s.y,
        u = n.x > o.x ? (n.x > s.x ? n.x : s.x) : o.x > s.x ? o.x : s.x,
        l = n.y > o.y ? (n.y > s.y ? n.y : s.y) : o.y > s.y ? o.y : s.y,
        c = Gt(a, h, e, r, i),
        d = Gt(u, l, e, r, i),
        f = t.prevZ,
        p = t.nextZ;
      f && f.z >= c && p && p.z <= d;

    ) {
      if (
        f !== t.prev &&
        f !== t.next &&
        kt(n.x, n.y, o.x, o.y, s.x, s.y, f.x, f.y) &&
        Yt(f.prev, f, f.next) >= 0
      )
        return !1;
      if (
        ((f = f.prevZ),
        p !== t.prev &&
          p !== t.next &&
          kt(n.x, n.y, o.x, o.y, s.x, s.y, p.x, p.y) &&
          Yt(p.prev, p, p.next) >= 0)
      )
        return !1;
      p = p.nextZ;
    }
    for (; f && f.z >= c; ) {
      if (
        f !== t.prev &&
        f !== t.next &&
        kt(n.x, n.y, o.x, o.y, s.x, s.y, f.x, f.y) &&
        Yt(f.prev, f, f.next) >= 0
      )
        return !1;
      f = f.prevZ;
    }
    for (; p && p.z <= d; ) {
      if (
        p !== t.prev &&
        p !== t.next &&
        kt(n.x, n.y, o.x, o.y, s.x, s.y, p.x, p.y) &&
        Yt(p.prev, p, p.next) >= 0
      )
        return !1;
      p = p.nextZ;
    }
    return !0;
  }
  function wt(t, e, r) {
    var i = t;
    do {
      var n = i.prev,
        o = i.next.next;
      !jt(n, o) &&
        Vt(n, i, i.next, o) &&
        qt(n, o) &&
        qt(o, n) &&
        (e.push(n.i / r),
        e.push(i.i / r),
        e.push(o.i / r),
        Qt(i),
        Qt(i.next),
        (i = t = o)),
        (i = i.next);
    } while (i !== t);
    return Mt(i);
  }
  function Lt(t, e, r, i, n, o) {
    var s = t;
    do {
      for (var a = s.next.next; a !== s.prev; ) {
        if (s.i !== a.i && Ht(s, a)) {
          var h = Kt(s, a);
          return (
            (s = Mt(s, s.next)),
            (h = Mt(h, h.next)),
            Nt(s, e, r, i, n, o),
            void Nt(h, e, r, i, n, o)
          );
        }
        a = a.next;
      }
      s = s.next;
    } while (s !== t);
  }
  function Ft(t, e) {
    return t.x - e.x;
  }
  function Ut(t, e) {
    if (
      ((e = (function (t, e) {
        var r,
          i = e,
          n = t.x,
          o = t.y,
          s = -1 / 0;
        do {
          if (o <= i.y && o >= i.next.y && i.next.y !== i.y) {
            var a = i.x + ((o - i.y) * (i.next.x - i.x)) / (i.next.y - i.y);
            if (a <= n && a > s) {
              if (((s = a), a === n)) {
                if (o === i.y) return i;
                if (o === i.next.y) return i.next;
              }
              r = i.x < i.next.x ? i : i.next;
            }
          }
          i = i.next;
        } while (i !== e);
        if (!r) return null;
        if (n === s) return r;
        var h,
          u = r,
          l = r.x,
          c = r.y,
          d = 1 / 0;
        i = r;
        do {
          n >= i.x &&
            i.x >= l &&
            n !== i.x &&
            kt(o < c ? n : s, o, l, c, o < c ? s : n, o, i.x, i.y) &&
            ((h = Math.abs(o - i.y) / (n - i.x)),
            qt(i, t) &&
              (h < d ||
                (h === d && (i.x > r.x || (i.x === r.x && Bt(r, i))))) &&
              ((r = i), (d = h))),
            (i = i.next);
        } while (i !== u);
        return r;
      })(t, e)),
      e)
    ) {
      var r = Kt(e, t);
      Mt(e, e.next), Mt(r, r.next);
    }
  }
  function Bt(t, e) {
    return Yt(t.prev, t, e.prev) < 0 && Yt(e.next, t, t.next) < 0;
  }
  function Gt(t, e, r, i, n) {
    return (
      (t =
        1431655765 &
        ((t =
          858993459 &
          ((t =
            252645135 &
            ((t = 16711935 & ((t = 32767 * (t - r) * n) | (t << 8))) |
              (t << 4))) |
            (t << 2))) |
          (t << 1))) |
      ((e =
        1431655765 &
        ((e =
          858993459 &
          ((e =
            252645135 &
            ((e = 16711935 & ((e = 32767 * (e - i) * n) | (e << 8))) |
              (e << 4))) |
            (e << 2))) |
          (e << 1))) <<
        1)
    );
  }
  function Xt(t) {
    var e = t,
      r = t;
    do {
      (e.x < r.x || (e.x === r.x && e.y < r.y)) && (r = e), (e = e.next);
    } while (e !== t);
    return r;
  }
  function kt(t, e, r, i, n, o, s, a) {
    return (
      (n - s) * (e - a) - (t - s) * (o - a) >= 0 &&
      (t - s) * (i - a) - (r - s) * (e - a) >= 0 &&
      (r - s) * (o - a) - (n - s) * (i - a) >= 0
    );
  }
  function Ht(t, e) {
    return (
      t.next.i !== e.i &&
      t.prev.i !== e.i &&
      !(function (t, e) {
        var r = t;
        do {
          if (
            r.i !== t.i &&
            r.next.i !== t.i &&
            r.i !== e.i &&
            r.next.i !== e.i &&
            Vt(r, r.next, t, e)
          )
            return !0;
          r = r.next;
        } while (r !== t);
        return !1;
      })(t, e) &&
      ((qt(t, e) &&
        qt(e, t) &&
        (function (t, e) {
          var r = t,
            i = !1,
            n = (t.x + e.x) / 2,
            o = (t.y + e.y) / 2;
          do {
            r.y > o != r.next.y > o &&
              r.next.y !== r.y &&
              n < ((r.next.x - r.x) * (o - r.y)) / (r.next.y - r.y) + r.x &&
              (i = !i),
              (r = r.next);
          } while (r !== t);
          return i;
        })(t, e) &&
        (Yt(t.prev, t, e.prev) || Yt(t, e.prev, e))) ||
        (jt(t, e) && Yt(t.prev, t, t.next) > 0 && Yt(e.prev, e, e.next) > 0))
    );
  }
  function Yt(t, e, r) {
    return (e.y - t.y) * (r.x - e.x) - (e.x - t.x) * (r.y - e.y);
  }
  function jt(t, e) {
    return t.x === e.x && t.y === e.y;
  }
  function Vt(t, e, r, i) {
    var n = zt(Yt(t, e, r)),
      o = zt(Yt(t, e, i)),
      s = zt(Yt(r, i, t)),
      a = zt(Yt(r, i, e));
    return (
      (n !== o && s !== a) ||
      !(0 !== n || !Wt(t, r, e)) ||
      !(0 !== o || !Wt(t, i, e)) ||
      !(0 !== s || !Wt(r, t, i)) ||
      !(0 !== a || !Wt(r, e, i))
    );
  }
  function Wt(t, e, r) {
    return (
      e.x <= Math.max(t.x, r.x) &&
      e.x >= Math.min(t.x, r.x) &&
      e.y <= Math.max(t.y, r.y) &&
      e.y >= Math.min(t.y, r.y)
    );
  }
  function zt(t) {
    return t > 0 ? 1 : t < 0 ? -1 : 0;
  }
  function qt(t, e) {
    return Yt(t.prev, t, t.next) < 0
      ? Yt(t, e, t.next) >= 0 && Yt(t, t.prev, e) >= 0
      : Yt(t, e, t.prev) < 0 || Yt(t, t.next, e) < 0;
  }
  function Kt(t, e) {
    var r = new Jt(t.i, t.x, t.y),
      i = new Jt(e.i, e.x, e.y),
      n = t.next,
      o = e.prev;
    return (
      (t.next = e),
      (e.prev = t),
      (r.next = n),
      (n.prev = r),
      (i.next = r),
      (r.prev = i),
      (o.next = i),
      (i.prev = o),
      i
    );
  }
  function Zt(t, e, r, i) {
    var n = new Jt(t, e, r);
    return (
      i
        ? ((n.next = i.next), (n.prev = i), (i.next.prev = n), (i.next = n))
        : ((n.prev = n), (n.next = n)),
      n
    );
  }
  function Qt(t) {
    (t.next.prev = t.prev),
      (t.prev.next = t.next),
      t.prevZ && (t.prevZ.nextZ = t.nextZ),
      t.nextZ && (t.nextZ.prevZ = t.prevZ);
  }
  function Jt(t, e, r) {
    (this.i = t),
      (this.x = e),
      (this.y = r),
      (this.prev = null),
      (this.next = null),
      (this.z = null),
      (this.prevZ = null),
      (this.nextZ = null),
      (this.steiner = !1);
  }
  function $t(t, e, r, i) {
    for (var n = 0, o = e, s = r - i; o < r; o += i)
      (n += (t[s] - t[o]) * (t[o + 1] + t[s + 1])), (s = o);
    return n;
  }
  (It.deviation = function (t, e, r, i) {
    var n = e && e.length,
      o = n ? e[0] * r : t.length,
      s = Math.abs($t(t, 0, o, r));
    if (n)
      for (var a = 0, h = e.length; a < h; a++) {
        var u = e[a] * r,
          l = a < h - 1 ? e[a + 1] * r : t.length;
        s -= Math.abs($t(t, u, l, r));
      }
    var c = 0;
    for (a = 0; a < i.length; a += 3) {
      var d = i[a] * r,
        f = i[a + 1] * r,
        p = i[a + 2] * r;
      c += Math.abs(
        (t[d] - t[p]) * (t[f + 1] - t[d + 1]) -
          (t[d] - t[f]) * (t[p + 1] - t[d + 1])
      );
    }
    return 0 === s && 0 === c ? 0 : Math.abs((c - s) / s);
  }),
    (It.flatten = function (t) {
      for (
        var e = t[0][0].length,
          r = { vertices: [], holes: [], dimensions: e },
          i = 0,
          n = 0;
        n < t.length;
        n++
      ) {
        for (var o = 0; o < t[n].length; o++)
          for (var s = 0; s < e; s++) r.vertices.push(t[n][o][s]);
        n > 0 && ((i += t[n - 1].length), r.holes.push(i));
      }
      return r;
    }),
    (St.default = Ot);
  var te = At(function (t, e) {
      !(function (r) {
        var i = e && !e.nodeType && e,
          n = t && !t.nodeType && t,
          o = "object" == typeof Rt && Rt;
        (o.global !== o && o.window !== o && o.self !== o) || (r = o);
        var s,
          a,
          h = 2147483647,
          u = 36,
          l = /^xn--/,
          c = /[^\x20-\x7E]/,
          d = /[\x2E\u3002\uFF0E\uFF61]/g,
          f = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input",
          },
          p = Math.floor,
          _ = String.fromCharCode;
        function v(t) {
          throw RangeError(f[t]);
        }
        function m(t, e) {
          for (var r = t.length, i = []; r--; ) i[r] = e(t[r]);
          return i;
        }
        function E(t, e) {
          var r = t.split("@"),
            i = "";
          return (
            r.length > 1 && ((i = r[0] + "@"), (t = r[1])),
            i + m((t = t.replace(d, ".")).split("."), e).join(".")
          );
        }
        function T(t) {
          for (var e, r, i = [], n = 0, o = t.length; n < o; )
            (e = t.charCodeAt(n++)) >= 55296 && e <= 56319 && n < o
              ? 56320 == (64512 & (r = t.charCodeAt(n++)))
                ? i.push(((1023 & e) << 10) + (1023 & r) + 65536)
                : (i.push(e), n--)
              : i.push(e);
          return i;
        }
        function y(t) {
          return m(t, function (t) {
            var e = "";
            return (
              t > 65535 &&
                ((e += _((((t -= 65536) >>> 10) & 1023) | 55296)),
                (t = 56320 | (1023 & t))),
              (e += _(t))
            );
          }).join("");
        }
        function g(t, e) {
          return t + 22 + 75 * (t < 26) - ((0 != e) << 5);
        }
        function b(t, e, r) {
          var i = 0;
          for (t = r ? p(t / 700) : t >> 1, t += p(t / e); t > 455; i += u)
            t = p(t / 35);
          return p(i + (36 * t) / (t + 38));
        }
        function R(t) {
          var e,
            r,
            i,
            n,
            o,
            s,
            a,
            l,
            c,
            d,
            f,
            _ = [],
            m = t.length,
            E = 0,
            T = 128,
            g = 72;
          for ((r = t.lastIndexOf("-")) < 0 && (r = 0), i = 0; i < r; ++i)
            t.charCodeAt(i) >= 128 && v("not-basic"), _.push(t.charCodeAt(i));
          for (n = r > 0 ? r + 1 : 0; n < m; ) {
            for (
              o = E, s = 1, a = u;
              n >= m && v("invalid-input"),
                ((l =
                  (f = t.charCodeAt(n++)) - 48 < 10
                    ? f - 22
                    : f - 65 < 26
                    ? f - 65
                    : f - 97 < 26
                    ? f - 97
                    : u) >= u ||
                  l > p((h - E) / s)) &&
                  v("overflow"),
                (E += l * s),
                !(l < (c = a <= g ? 1 : a >= g + 26 ? 26 : a - g));
              a += u
            )
              s > p(h / (d = u - c)) && v("overflow"), (s *= d);
            (g = b(E - o, (e = _.length + 1), 0 == o)),
              p(E / e) > h - T && v("overflow"),
              (T += p(E / e)),
              (E %= e),
              _.splice(E++, 0, T);
          }
          return y(_);
        }
        function A(t) {
          var e,
            r,
            i,
            n,
            o,
            s,
            a,
            l,
            c,
            d,
            f,
            m,
            E,
            y,
            R,
            A = [];
          for (m = (t = T(t)).length, e = 128, r = 0, o = 72, s = 0; s < m; ++s)
            (f = t[s]) < 128 && A.push(_(f));
          for (i = n = A.length, n && A.push("-"); i < m; ) {
            for (a = h, s = 0; s < m; ++s) (f = t[s]) >= e && f < a && (a = f);
            for (
              a - e > p((h - r) / (E = i + 1)) && v("overflow"),
                r += (a - e) * E,
                e = a,
                s = 0;
              s < m;
              ++s
            )
              if (((f = t[s]) < e && ++r > h && v("overflow"), f == e)) {
                for (
                  l = r, c = u;
                  !(l < (d = c <= o ? 1 : c >= o + 26 ? 26 : c - o));
                  c += u
                )
                  (R = l - d),
                    (y = u - d),
                    A.push(_(g(d + (R % y), 0))),
                    (l = p(R / y));
                A.push(_(g(l, 0))), (o = b(r, E, i == n)), (r = 0), ++i;
              }
            ++r, ++e;
          }
          return A.join("");
        }
        if (
          ((s = {
            version: "1.3.2",
            ucs2: { decode: T, encode: y },
            decode: R,
            encode: A,
            toASCII: function (t) {
              return E(t, function (t) {
                return c.test(t) ? "xn--" + A(t) : t;
              });
            },
            toUnicode: function (t) {
              return E(t, function (t) {
                return l.test(t) ? R(t.slice(4).toLowerCase()) : t;
              });
            },
          }),
          i && n)
        )
          if (t.exports == i) n.exports = s;
          else for (a in s) s.hasOwnProperty(a) && (i[a] = s[a]);
        else r.punycode = s;
      })(Rt);
    }),
    ee = function (t) {
      return "string" == typeof t;
    },
    re = function (t) {
      return "object" == typeof t && null !== t;
    },
    ie = function (t) {
      return null === t;
    },
    ne = function (t) {
      return null == t;
    };
  function oe(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }
  var se = function (t, e, r, i) {
      (e = e || "&"), (r = r || "=");
      var n = {};
      if ("string" != typeof t || 0 === t.length) return n;
      var o = /\+/g;
      t = t.split(e);
      var s = 1e3;
      i && "number" == typeof i.maxKeys && (s = i.maxKeys);
      var a = t.length;
      s > 0 && a > s && (a = s);
      for (var h = 0; h < a; ++h) {
        var u,
          l,
          c,
          d,
          f = t[h].replace(o, "%20"),
          p = f.indexOf(r);
        p >= 0
          ? ((u = f.substr(0, p)), (l = f.substr(p + 1)))
          : ((u = f), (l = "")),
          (c = decodeURIComponent(u)),
          (d = decodeURIComponent(l)),
          oe(n, c)
            ? Array.isArray(n[c])
              ? n[c].push(d)
              : (n[c] = [n[c], d])
            : (n[c] = d);
      }
      return n;
    },
    ae = function (t) {
      switch (typeof t) {
        case "string":
          return t;
        case "boolean":
          return t ? "true" : "false";
        case "number":
          return isFinite(t) ? t : "";
        default:
          return "";
      }
    },
    he = function (t, e, r, i) {
      return (
        (e = e || "&"),
        (r = r || "="),
        null === t && (t = void 0),
        "object" == typeof t
          ? Object.keys(t)
              .map(function (i) {
                var n = encodeURIComponent(ae(i)) + r;
                return Array.isArray(t[i])
                  ? t[i]
                      .map(function (t) {
                        return n + encodeURIComponent(ae(t));
                      })
                      .join(e)
                  : n + encodeURIComponent(ae(t[i]));
              })
              .join(e)
          : i
          ? encodeURIComponent(ae(i)) + r + encodeURIComponent(ae(t))
          : ""
      );
    },
    ue = At(function (t, e) {
      (e.decode = e.parse = se), (e.encode = e.stringify = he);
    }),
    le = Se,
    ce = function (t, e) {
      return Se(t, !1, !0).resolve(e);
    },
    de = function (t) {
      ee(t) && (t = Se(t));
      return t instanceof fe ? t.format() : fe.prototype.format.call(t);
    };
  function fe() {
    (this.protocol = null),
      (this.slashes = null),
      (this.auth = null),
      (this.host = null),
      (this.port = null),
      (this.hostname = null),
      (this.hash = null),
      (this.search = null),
      (this.query = null),
      (this.pathname = null),
      (this.path = null),
      (this.href = null);
  }
  var pe = /^([a-z0-9.+-]+:)/i,
    _e = /:[0-9]*$/,
    ve = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    me = ["{", "}", "|", "\\", "^", "`"].concat([
      "<",
      ">",
      '"',
      "`",
      " ",
      "\r",
      "\n",
      "\t",
    ]),
    Ee = ["'"].concat(me),
    Te = ["%", "/", "?", ";", "#"].concat(Ee),
    ye = ["/", "?", "#"],
    ge = /^[+a-z0-9A-Z_-]{0,63}$/,
    be = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    Re = { javascript: !0, "javascript:": !0 },
    Ae = { javascript: !0, "javascript:": !0 },
    xe = {
      http: !0,
      https: !0,
      ftp: !0,
      gopher: !0,
      file: !0,
      "http:": !0,
      "https:": !0,
      "ftp:": !0,
      "gopher:": !0,
      "file:": !0,
    };
  function Se(t, e, r) {
    if (t && re(t) && t instanceof fe) return t;
    var i = new fe();
    return i.parse(t, e, r), i;
  }
  (fe.prototype.parse = function (t, e, r) {
    if (!ee(t))
      throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
    var i = t.indexOf("?"),
      n = -1 !== i && i < t.indexOf("#") ? "?" : "#",
      o = t.split(n);
    o[0] = o[0].replace(/\\/g, "/");
    var s = (t = o.join(n));
    if (((s = s.trim()), !r && 1 === t.split("#").length)) {
      var a = ve.exec(s);
      if (a)
        return (
          (this.path = s),
          (this.href = s),
          (this.pathname = a[1]),
          a[2]
            ? ((this.search = a[2]),
              (this.query = e
                ? ue.parse(this.search.substr(1))
                : this.search.substr(1)))
            : e && ((this.search = ""), (this.query = {})),
          this
        );
    }
    var h = pe.exec(s);
    if (h) {
      var u = (h = h[0]).toLowerCase();
      (this.protocol = u), (s = s.substr(h.length));
    }
    if (r || h || s.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var l = "//" === s.substr(0, 2);
      !l || (h && Ae[h]) || ((s = s.substr(2)), (this.slashes = !0));
    }
    if (!Ae[h] && (l || (h && !xe[h]))) {
      for (var c, d, f = -1, p = 0; p < ye.length; p++) {
        -1 !== (_ = s.indexOf(ye[p])) && (-1 === f || _ < f) && (f = _);
      }
      -1 !== (d = -1 === f ? s.lastIndexOf("@") : s.lastIndexOf("@", f)) &&
        ((c = s.slice(0, d)),
        (s = s.slice(d + 1)),
        (this.auth = decodeURIComponent(c))),
        (f = -1);
      for (p = 0; p < Te.length; p++) {
        var _;
        -1 !== (_ = s.indexOf(Te[p])) && (-1 === f || _ < f) && (f = _);
      }
      -1 === f && (f = s.length),
        (this.host = s.slice(0, f)),
        (s = s.slice(f)),
        this.parseHost(),
        (this.hostname = this.hostname || "");
      var v =
        "[" === this.hostname[0] &&
        "]" === this.hostname[this.hostname.length - 1];
      if (!v)
        for (
          var m = this.hostname.split(/\./), E = ((p = 0), m.length);
          p < E;
          p++
        ) {
          var T = m[p];
          if (T && !T.match(ge)) {
            for (var y = "", g = 0, b = T.length; g < b; g++)
              T.charCodeAt(g) > 127 ? (y += "x") : (y += T[g]);
            if (!y.match(ge)) {
              var R = m.slice(0, p),
                A = m.slice(p + 1),
                x = T.match(be);
              x && (R.push(x[1]), A.unshift(x[2])),
                A.length && (s = "/" + A.join(".") + s),
                (this.hostname = R.join("."));
              break;
            }
          }
        }
      this.hostname.length > 255
        ? (this.hostname = "")
        : (this.hostname = this.hostname.toLowerCase()),
        v || (this.hostname = te.toASCII(this.hostname));
      var S = this.port ? ":" + this.port : "",
        O = this.hostname || "";
      (this.host = O + S),
        (this.href += this.host),
        v &&
          ((this.hostname = this.hostname.substr(1, this.hostname.length - 2)),
          "/" !== s[0] && (s = "/" + s));
    }
    if (!Re[u])
      for (p = 0, E = Ee.length; p < E; p++) {
        var I = Ee[p];
        if (-1 !== s.indexOf(I)) {
          var P = encodeURIComponent(I);
          P === I && (P = escape(I)), (s = s.split(I).join(P));
        }
      }
    var M = s.indexOf("#");
    -1 !== M && ((this.hash = s.substr(M)), (s = s.slice(0, M)));
    var N = s.indexOf("?");
    if (
      (-1 !== N
        ? ((this.search = s.substr(N)),
          (this.query = s.substr(N + 1)),
          e && (this.query = ue.parse(this.query)),
          (s = s.slice(0, N)))
        : e && ((this.search = ""), (this.query = {})),
      s && (this.pathname = s),
      xe[u] && this.hostname && !this.pathname && (this.pathname = "/"),
      this.pathname || this.search)
    ) {
      S = this.pathname || "";
      var D = this.search || "";
      this.path = S + D;
    }
    return (this.href = this.format()), this;
  }),
    (fe.prototype.format = function () {
      var t = this.auth || "";
      t && ((t = (t = encodeURIComponent(t)).replace(/%3A/i, ":")), (t += "@"));
      var e = this.protocol || "",
        r = this.pathname || "",
        i = this.hash || "",
        n = !1,
        o = "";
      this.host
        ? (n = t + this.host)
        : this.hostname &&
          ((n =
            t +
            (-1 === this.hostname.indexOf(":")
              ? this.hostname
              : "[" + this.hostname + "]")),
          this.port && (n += ":" + this.port)),
        this.query &&
          re(this.query) &&
          Object.keys(this.query).length &&
          (o = ue.stringify(this.query));
      var s = this.search || (o && "?" + o) || "";
      return (
        e && ":" !== e.substr(-1) && (e += ":"),
        this.slashes || ((!e || xe[e]) && !1 !== n)
          ? ((n = "//" + (n || "")), r && "/" !== r.charAt(0) && (r = "/" + r))
          : n || (n = ""),
        i && "#" !== i.charAt(0) && (i = "#" + i),
        s && "?" !== s.charAt(0) && (s = "?" + s),
        e +
          n +
          (r = r.replace(/[?#]/g, function (t) {
            return encodeURIComponent(t);
          })) +
          (s = s.replace("#", "%23")) +
          i
      );
    }),
    (fe.prototype.resolve = function (t) {
      return this.resolveObject(Se(t, !1, !0)).format();
    }),
    (fe.prototype.resolveObject = function (t) {
      if (ee(t)) {
        var e = new fe();
        e.parse(t, !1, !0), (t = e);
      }
      for (var r = new fe(), i = Object.keys(this), n = 0; n < i.length; n++) {
        var o = i[n];
        r[o] = this[o];
      }
      if (((r.hash = t.hash), "" === t.href)) return (r.href = r.format()), r;
      if (t.slashes && !t.protocol) {
        for (var s = Object.keys(t), a = 0; a < s.length; a++) {
          var h = s[a];
          "protocol" !== h && (r[h] = t[h]);
        }
        return (
          xe[r.protocol] &&
            r.hostname &&
            !r.pathname &&
            (r.path = r.pathname = "/"),
          (r.href = r.format()),
          r
        );
      }
      if (t.protocol && t.protocol !== r.protocol) {
        if (!xe[t.protocol]) {
          for (var u = Object.keys(t), l = 0; l < u.length; l++) {
            var c = u[l];
            r[c] = t[c];
          }
          return (r.href = r.format()), r;
        }
        if (((r.protocol = t.protocol), t.host || Ae[t.protocol]))
          r.pathname = t.pathname;
        else {
          for (
            var d = (t.pathname || "").split("/");
            d.length && !(t.host = d.shift());

          );
          t.host || (t.host = ""),
            t.hostname || (t.hostname = ""),
            "" !== d[0] && d.unshift(""),
            d.length < 2 && d.unshift(""),
            (r.pathname = d.join("/"));
        }
        if (
          ((r.search = t.search),
          (r.query = t.query),
          (r.host = t.host || ""),
          (r.auth = t.auth),
          (r.hostname = t.hostname || t.host),
          (r.port = t.port),
          r.pathname || r.search)
        ) {
          var f = r.pathname || "",
            p = r.search || "";
          r.path = f + p;
        }
        return (r.slashes = r.slashes || t.slashes), (r.href = r.format()), r;
      }
      var _ = r.pathname && "/" === r.pathname.charAt(0),
        v = t.host || (t.pathname && "/" === t.pathname.charAt(0)),
        m = v || _ || (r.host && t.pathname),
        E = m,
        T = (r.pathname && r.pathname.split("/")) || [],
        y =
          ((d = (t.pathname && t.pathname.split("/")) || []),
          r.protocol && !xe[r.protocol]);
      if (
        (y &&
          ((r.hostname = ""),
          (r.port = null),
          r.host && ("" === T[0] ? (T[0] = r.host) : T.unshift(r.host)),
          (r.host = ""),
          t.protocol &&
            ((t.hostname = null),
            (t.port = null),
            t.host && ("" === d[0] ? (d[0] = t.host) : d.unshift(t.host)),
            (t.host = null)),
          (m = m && ("" === d[0] || "" === T[0]))),
        v)
      )
        (r.host = t.host || "" === t.host ? t.host : r.host),
          (r.hostname =
            t.hostname || "" === t.hostname ? t.hostname : r.hostname),
          (r.search = t.search),
          (r.query = t.query),
          (T = d);
      else if (d.length)
        T || (T = []),
          T.pop(),
          (T = T.concat(d)),
          (r.search = t.search),
          (r.query = t.query);
      else if (!ne(t.search)) {
        if (y)
          (r.hostname = r.host = T.shift()),
            (x = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) &&
              ((r.auth = x.shift()), (r.host = r.hostname = x.shift()));
        return (
          (r.search = t.search),
          (r.query = t.query),
          (ie(r.pathname) && ie(r.search)) ||
            (r.path =
              (r.pathname ? r.pathname : "") + (r.search ? r.search : "")),
          (r.href = r.format()),
          r
        );
      }
      if (!T.length)
        return (
          (r.pathname = null),
          r.search ? (r.path = "/" + r.search) : (r.path = null),
          (r.href = r.format()),
          r
        );
      for (
        var g = T.slice(-1)[0],
          b =
            ((r.host || t.host || T.length > 1) && ("." === g || ".." === g)) ||
            "" === g,
          R = 0,
          A = T.length;
        A >= 0;
        A--
      )
        "." === (g = T[A])
          ? T.splice(A, 1)
          : ".." === g
          ? (T.splice(A, 1), R++)
          : R && (T.splice(A, 1), R--);
      if (!m && !E) for (; R--; ) T.unshift("..");
      !m || "" === T[0] || (T[0] && "/" === T[0].charAt(0)) || T.unshift(""),
        b && "/" !== T.join("/").substr(-1) && T.push("");
      var x,
        S = "" === T[0] || (T[0] && "/" === T[0].charAt(0));
      y &&
        ((r.hostname = r.host = S ? "" : T.length ? T.shift() : ""),
        (x = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) &&
          ((r.auth = x.shift()), (r.host = r.hostname = x.shift())));
      return (
        (m = m || (r.host && T.length)) && !S && T.unshift(""),
        T.length
          ? (r.pathname = T.join("/"))
          : ((r.pathname = null), (r.path = null)),
        (ie(r.pathname) && ie(r.search)) ||
          (r.path =
            (r.pathname ? r.pathname : "") + (r.search ? r.search : "")),
        (r.auth = t.auth || r.auth),
        (r.slashes = r.slashes || t.slashes),
        (r.href = r.format()),
        r
      );
    }),
    (fe.prototype.parseHost = function () {
      var t = this.host,
        e = _e.exec(t);
      e &&
        (":" !== (e = e[0]) && (this.port = e.substr(1)),
        (t = t.substr(0, t.length - e.length))),
        t && (this.hostname = t);
    });
  /*!
   * @pixi/constants - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/constants is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  !(function (t) {
    (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
      (t[(t.WEBGL = 1)] = "WEBGL"),
      (t[(t.WEBGL2 = 2)] = "WEBGL2");
  })(t.ENV || (t.ENV = {})),
    (function (t) {
      (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
        (t[(t.WEBGL = 1)] = "WEBGL"),
        (t[(t.CANVAS = 2)] = "CANVAS");
    })(t.RENDERER_TYPE || (t.RENDERER_TYPE = {})),
    (function (t) {
      (t[(t.COLOR = 16384)] = "COLOR"),
        (t[(t.DEPTH = 256)] = "DEPTH"),
        (t[(t.STENCIL = 1024)] = "STENCIL");
    })(t.BUFFER_BITS || (t.BUFFER_BITS = {})),
    (function (t) {
      (t[(t.NORMAL = 0)] = "NORMAL"),
        (t[(t.ADD = 1)] = "ADD"),
        (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
        (t[(t.SCREEN = 3)] = "SCREEN"),
        (t[(t.OVERLAY = 4)] = "OVERLAY"),
        (t[(t.DARKEN = 5)] = "DARKEN"),
        (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
        (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
        (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
        (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
        (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
        (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
        (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
        (t[(t.HUE = 13)] = "HUE"),
        (t[(t.SATURATION = 14)] = "SATURATION"),
        (t[(t.COLOR = 15)] = "COLOR"),
        (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
        (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
        (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
        (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
        (t[(t.NONE = 20)] = "NONE"),
        (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
        (t[(t.SRC_IN = 21)] = "SRC_IN"),
        (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
        (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
        (t[(t.DST_OVER = 24)] = "DST_OVER"),
        (t[(t.DST_IN = 25)] = "DST_IN"),
        (t[(t.DST_OUT = 26)] = "DST_OUT"),
        (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
        (t[(t.ERASE = 26)] = "ERASE"),
        (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
        (t[(t.XOR = 29)] = "XOR");
    })(t.BLEND_MODES || (t.BLEND_MODES = {})),
    (function (t) {
      (t[(t.POINTS = 0)] = "POINTS"),
        (t[(t.LINES = 1)] = "LINES"),
        (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
        (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
        (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
        (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
        (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
    })(t.DRAW_MODES || (t.DRAW_MODES = {})),
    (function (t) {
      (t[(t.RGBA = 6408)] = "RGBA"),
        (t[(t.RGB = 6407)] = "RGB"),
        (t[(t.RG = 33319)] = "RG"),
        (t[(t.RED = 6403)] = "RED"),
        (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
        (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
        (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
        (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
        (t[(t.ALPHA = 6406)] = "ALPHA"),
        (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
        (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
        (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
        (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
    })(t.FORMATS || (t.FORMATS = {})),
    (function (t) {
      (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
        (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
        (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
          "TEXTURE_CUBE_MAP_POSITIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Z"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Z");
    })(t.TARGETS || (t.TARGETS = {})),
    (function (t) {
      (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
        (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
        (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
        (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
        (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
        (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
        (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
          "UNSIGNED_INT_10F_11F_11F_REV"),
        (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
          "UNSIGNED_INT_2_10_10_10_REV"),
        (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
        (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
        (t[(t.BYTE = 5120)] = "BYTE"),
        (t[(t.SHORT = 5122)] = "SHORT"),
        (t[(t.INT = 5124)] = "INT"),
        (t[(t.FLOAT = 5126)] = "FLOAT"),
        (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
          "FLOAT_32_UNSIGNED_INT_24_8_REV"),
        (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
    })(t.TYPES || (t.TYPES = {})),
    (function (t) {
      (t[(t.FLOAT = 0)] = "FLOAT"),
        (t[(t.INT = 1)] = "INT"),
        (t[(t.UINT = 2)] = "UINT");
    })(t.SAMPLER_TYPES || (t.SAMPLER_TYPES = {})),
    (function (t) {
      (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
    })(t.SCALE_MODES || (t.SCALE_MODES = {})),
    (function (t) {
      (t[(t.CLAMP = 33071)] = "CLAMP"),
        (t[(t.REPEAT = 10497)] = "REPEAT"),
        (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
    })(t.WRAP_MODES || (t.WRAP_MODES = {})),
    (function (t) {
      (t[(t.OFF = 0)] = "OFF"),
        (t[(t.POW2 = 1)] = "POW2"),
        (t[(t.ON = 2)] = "ON"),
        (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
    })(t.MIPMAP_MODES || (t.MIPMAP_MODES = {})),
    (function (t) {
      (t[(t.NPM = 0)] = "NPM"),
        (t[(t.UNPACK = 1)] = "UNPACK"),
        (t[(t.PMA = 2)] = "PMA"),
        (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
        (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
        (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
        (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
    })(t.ALPHA_MODES || (t.ALPHA_MODES = {})),
    (function (t) {
      (t[(t.NO = 0)] = "NO"),
        (t[(t.YES = 1)] = "YES"),
        (t[(t.AUTO = 2)] = "AUTO"),
        (t[(t.BLEND = 0)] = "BLEND"),
        (t[(t.CLEAR = 1)] = "CLEAR"),
        (t[(t.BLIT = 2)] = "BLIT");
    })(t.CLEAR_MODES || (t.CLEAR_MODES = {})),
    (function (t) {
      (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
    })(t.GC_MODES || (t.GC_MODES = {})),
    (function (t) {
      (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
    })(t.PRECISION || (t.PRECISION = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.SCISSOR = 1)] = "SCISSOR"),
        (t[(t.STENCIL = 2)] = "STENCIL"),
        (t[(t.SPRITE = 3)] = "SPRITE");
    })(t.MASK_TYPES || (t.MASK_TYPES = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.LOW = 2)] = "LOW"),
        (t[(t.MEDIUM = 4)] = "MEDIUM"),
        (t[(t.HIGH = 8)] = "HIGH");
    })(t.MSAA_QUALITY || (t.MSAA_QUALITY = {})),
    (function (t) {
      (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
        (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
        (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
    })(t.BUFFER_TYPE || (t.BUFFER_TYPE = {}));
  /*!
   * @pixi/utils - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/utils is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var Oe = { parse: le, format: de, resolve: ce };
  (bt.RETINA_PREFIX = /@([0-9\.]+)x/),
    (bt.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1);
  var Ie,
    Pe = !1;
  function Me(t) {
    var e;
    if (!Pe) {
      if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
        var r = [
          "\n %c %c %c PixiJS 6.3.0 - ✰ " +
            t +
            " ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n",
          "background: #ff66a5; padding:5px 0;",
          "background: #ff66a5; padding:5px 0;",
          "color: #ff66a5; background: #030307; padding:5px 0;",
          "background: #ff66a5; padding:5px 0;",
          "background: #ffc3dc; padding:5px 0;",
          "background: #ff66a5; padding:5px 0;",
          "color: #ff2424; background: #fff; padding:5px 0;",
          "color: #ff2424; background: #fff; padding:5px 0;",
          "color: #ff2424; background: #fff; padding:5px 0;",
        ];
        (e = globalThis.console).log.apply(e, r);
      } else
        globalThis.console &&
          globalThis.console.log(
            "PixiJS 6.3.0 - " + t + " - http://www.pixijs.com/"
          );
      Pe = !0;
    }
  }
  function Ne() {
    return (
      void 0 === Ie &&
        (Ie = (function () {
          var t = {
            stencil: !0,
            failIfMajorPerformanceCaveat: bt.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT,
          };
          try {
            if (!globalThis.WebGLRenderingContext) return !1;
            var e = document.createElement("canvas"),
              r =
                e.getContext("webgl", t) ||
                e.getContext("experimental-webgl", t),
              i = !(!r || !r.getContextAttributes().stencil);
            if (r) {
              var n = r.getExtension("WEBGL_lose_context");
              n && n.loseContext();
            }
            return (r = null), i;
          } catch (t) {
            return !1;
          }
        })()),
      Ie
    );
  }
  var De = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
  };
  function Ce(t, e) {
    return (
      void 0 === e && (e = []),
      (e[0] = ((t >> 16) & 255) / 255),
      (e[1] = ((t >> 8) & 255) / 255),
      (e[2] = (255 & t) / 255),
      e
    );
  }
  function we(t) {
    var e = t.toString(16);
    return "#" + (e = "000000".substring(0, 6 - e.length) + e);
  }
  function Le(t) {
    return (
      "string" == typeof t &&
        "#" === (t = De[t.toLowerCase()] || t)[0] &&
        (t = t.slice(1)),
      parseInt(t, 16)
    );
  }
  var Fe = (function () {
    for (var e = [], r = [], i = 0; i < 32; i++) (e[i] = i), (r[i] = i);
    (e[t.BLEND_MODES.NORMAL_NPM] = t.BLEND_MODES.NORMAL),
      (e[t.BLEND_MODES.ADD_NPM] = t.BLEND_MODES.ADD),
      (e[t.BLEND_MODES.SCREEN_NPM] = t.BLEND_MODES.SCREEN),
      (r[t.BLEND_MODES.NORMAL] = t.BLEND_MODES.NORMAL_NPM),
      (r[t.BLEND_MODES.ADD] = t.BLEND_MODES.ADD_NPM),
      (r[t.BLEND_MODES.SCREEN] = t.BLEND_MODES.SCREEN_NPM);
    var n = [];
    return n.push(r), n.push(e), n;
  })();
  function Ue(t, e) {
    return Fe[e ? 1 : 0][t];
  }
  function Be(t, e, r, i) {
    return (
      (r = r || new Float32Array(4)),
      i || void 0 === i
        ? ((r[0] = t[0] * e), (r[1] = t[1] * e), (r[2] = t[2] * e))
        : ((r[0] = t[0]), (r[1] = t[1]), (r[2] = t[2])),
      (r[3] = e),
      r
    );
  }
  function Ge(t, e) {
    if (1 === e) return ((255 * e) << 24) + t;
    if (0 === e) return 0;
    var r = (t >> 16) & 255,
      i = (t >> 8) & 255,
      n = 255 & t;
    return (
      ((255 * e) << 24) +
      ((r = (r * e + 0.5) | 0) << 16) +
      ((i = (i * e + 0.5) | 0) << 8) +
      (n = (n * e + 0.5) | 0)
    );
  }
  function Xe(t, e, r, i) {
    return (
      ((r = r || new Float32Array(4))[0] = ((t >> 16) & 255) / 255),
      (r[1] = ((t >> 8) & 255) / 255),
      (r[2] = (255 & t) / 255),
      (i || void 0 === i) && ((r[0] *= e), (r[1] *= e), (r[2] *= e)),
      (r[3] = e),
      r
    );
  }
  function ke(t, e) {
    void 0 === e && (e = null);
    var r = 6 * t;
    if ((e = e || new Uint16Array(r)).length !== r)
      throw new Error(
        "Out buffer length is incorrect, got " + e.length + " and expected " + r
      );
    for (var i = 0, n = 0; i < r; i += 6, n += 4)
      (e[i + 0] = n + 0),
        (e[i + 1] = n + 1),
        (e[i + 2] = n + 2),
        (e[i + 3] = n + 0),
        (e[i + 4] = n + 2),
        (e[i + 5] = n + 3);
    return e;
  }
  function He(t) {
    if (4 === t.BYTES_PER_ELEMENT)
      return t instanceof Float32Array
        ? "Float32Array"
        : t instanceof Uint32Array
        ? "Uint32Array"
        : "Int32Array";
    if (2 === t.BYTES_PER_ELEMENT) {
      if (t instanceof Uint16Array) return "Uint16Array";
    } else if (1 === t.BYTES_PER_ELEMENT && t instanceof Uint8Array)
      return "Uint8Array";
    return null;
  }
  var Ye = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array,
  };
  function je(t) {
    return (
      (t += 0 === t ? 1 : 0),
      --t,
      (t |= t >>> 1),
      (t |= t >>> 2),
      (t |= t >>> 4),
      (t |= t >>> 8),
      (t |= t >>> 16) + 1
    );
  }
  function Ve(t) {
    return !(t & (t - 1) || !t);
  }
  function We(t) {
    var e = (t > 65535 ? 1 : 0) << 4,
      r = ((t >>>= e) > 255 ? 1 : 0) << 3;
    return (
      (e |= r),
      (e |= r = ((t >>>= r) > 15 ? 1 : 0) << 2),
      (e |= r = ((t >>>= r) > 3 ? 1 : 0) << 1) | ((t >>>= r) >> 1)
    );
  }
  function ze(t, e, r) {
    var i,
      n = t.length;
    if (!(e >= n || 0 === r)) {
      var o = n - (r = e + r > n ? n - e : r);
      for (i = e; i < o; ++i) t[i] = t[i + r];
      t.length = o;
    }
  }
  function qe(t) {
    return 0 === t ? 0 : t < 0 ? -1 : 1;
  }
  var Ke = 0;
  function Ze() {
    return ++Ke;
  }
  var Qe = {};
  function Je(t, e, r) {
    if ((void 0 === r && (r = 3), !Qe[e])) {
      var i = new Error().stack;
      void 0 === i
        ? console.warn(
            "PixiJS Deprecation Warning: ",
            e + "\nDeprecated since v" + t
          )
        : ((i = i.split("\n").splice(r).join("\n")),
          console.groupCollapsed
            ? (console.groupCollapsed(
                "%cPixiJS Deprecation Warning: %c%s",
                "color:#614108;background:#fffbe6",
                "font-weight:normal;color:#614108;background:#fffbe6",
                e + "\nDeprecated since v" + t
              ),
              console.warn(i),
              console.groupEnd())
            : (console.warn(
                "PixiJS Deprecation Warning: ",
                e + "\nDeprecated since v" + t
              ),
              console.warn(i))),
        (Qe[e] = !0);
    }
  }
  var $e = {},
    tr = Object.create(null),
    er = Object.create(null);
  var rr = (function () {
    function t(t, e, r) {
      (this.canvas = document.createElement("canvas")),
        (this.context = this.canvas.getContext("2d")),
        (this.resolution = r || bt.RESOLUTION),
        this.resize(t, e);
    }
    return (
      (t.prototype.clear = function () {
        this.context.setTransform(1, 0, 0, 1, 0, 0),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }),
      (t.prototype.resize = function (t, e) {
        (this.canvas.width = Math.round(t * this.resolution)),
          (this.canvas.height = Math.round(e * this.resolution));
      }),
      (t.prototype.destroy = function () {
        (this.context = null), (this.canvas = null);
      }),
      Object.defineProperty(t.prototype, "width", {
        get: function () {
          return this.canvas.width;
        },
        set: function (t) {
          this.canvas.width = Math.round(t);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "height", {
        get: function () {
          return this.canvas.height;
        },
        set: function (t) {
          this.canvas.height = Math.round(t);
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })();
  function ir(t) {
    var e,
      r,
      i,
      n = t.width,
      o = t.height,
      s = t.getContext("2d"),
      a = s.getImageData(0, 0, n, o).data,
      h = a.length,
      u = { top: null, left: null, right: null, bottom: null },
      l = null;
    for (e = 0; e < h; e += 4)
      0 !== a[e + 3] &&
        ((r = (e / 4) % n),
        (i = ~~(e / 4 / n)),
        null === u.top && (u.top = i),
        (null === u.left || r < u.left) && (u.left = r),
        (null === u.right || u.right < r) && (u.right = r + 1),
        (null === u.bottom || u.bottom < i) && (u.bottom = i));
    return (
      null !== u.top &&
        ((n = u.right - u.left),
        (o = u.bottom - u.top + 1),
        (l = s.getImageData(u.left, u.top, n, o))),
      { height: o, width: n, data: l }
    );
  }
  var nr,
    or =
      /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;
  function sr(t, e) {
    if ((void 0 === e && (e = globalThis.location), 0 === t.indexOf("data:")))
      return "";
    (e = e || globalThis.location),
      nr || (nr = document.createElement("a")),
      (nr.href = t);
    var r = Oe.parse(nr.href),
      i = (!r.port && "" === e.port) || r.port === e.port;
    return r.hostname === e.hostname && i && r.protocol === e.protocol
      ? ""
      : "anonymous";
  }
  function ar(t, e) {
    var r = bt.RETINA_PREFIX.exec(t);
    return r ? parseFloat(r[1]) : void 0 !== e ? e : 1;
  }
  var hr,
    ur = {
      __proto__: null,
      BaseTextureCache: er,
      CanvasRenderTarget: rr,
      DATA_URI: or,
      ProgramCache: $e,
      TextureCache: tr,
      clearTextureCache: function () {
        var t;
        for (t in tr) delete tr[t];
        for (t in er) delete er[t];
      },
      correctBlendMode: Ue,
      createIndicesForQuads: ke,
      decomposeDataUri: function (t) {
        var e = or.exec(t);
        if (e)
          return {
            mediaType: e[1] ? e[1].toLowerCase() : void 0,
            subType: e[2] ? e[2].toLowerCase() : void 0,
            charset: e[3] ? e[3].toLowerCase() : void 0,
            encoding: e[4] ? e[4].toLowerCase() : void 0,
            data: e[5],
          };
      },
      deprecation: Je,
      destroyTextureCache: function () {
        var t;
        for (t in tr) tr[t].destroy();
        for (t in er) er[t].destroy();
      },
      determineCrossOrigin: sr,
      getBufferType: He,
      getResolutionOfUrl: ar,
      hex2rgb: Ce,
      hex2string: we,
      interleaveTypedArrays: function (t, e) {
        for (var r = 0, i = 0, n = {}, o = 0; o < t.length; o++)
          (i += e[o]), (r += t[o].length);
        var s = new ArrayBuffer(4 * r),
          a = null,
          h = 0;
        for (o = 0; o < t.length; o++) {
          var u = e[o],
            l = t[o],
            c = He(l);
          n[c] || (n[c] = new Ye[c](s)), (a = n[c]);
          for (var d = 0; d < l.length; d++) {
            a[((d / u) | 0) * i + h + (d % u)] = l[d];
          }
          h += u;
        }
        return new Float32Array(s);
      },
      isPow2: Ve,
      isWebGLSupported: Ne,
      log2: We,
      nextPow2: je,
      premultiplyBlendMode: Fe,
      premultiplyRgba: Be,
      premultiplyTint: Ge,
      premultiplyTintToRgba: Xe,
      removeItems: ze,
      rgb2hex: function (t) {
        return ((255 * t[0]) << 16) + ((255 * t[1]) << 8) + ((255 * t[2]) | 0);
      },
      sayHello: Me,
      sign: qe,
      skipHello: function () {
        Pe = !0;
      },
      string2hex: Le,
      trimCanvas: ir,
      uid: Ze,
      url: Oe,
      isMobile: gt,
      EventEmitter: xt,
      earcut: St,
    },
    lr = 2 * Math.PI,
    cr = 180 / Math.PI,
    dr = Math.PI / 180;
  /*!
   * @pixi/math - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/math is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */ ((hr = t.SHAPES || (t.SHAPES = {}))[(hr.POLY = 0)] = "POLY"),
    (hr[(hr.RECT = 1)] = "RECT"),
    (hr[(hr.CIRC = 2)] = "CIRC"),
    (hr[(hr.ELIP = 3)] = "ELIP"),
    (hr[(hr.RREC = 4)] = "RREC");
  var fr = (function () {
      function t(t, e) {
        void 0 === t && (t = 0),
          void 0 === e && (e = 0),
          (this.x = 0),
          (this.y = 0),
          (this.x = t),
          (this.y = e);
      }
      return (
        (t.prototype.clone = function () {
          return new t(this.x, this.y);
        }),
        (t.prototype.copyFrom = function (t) {
          return this.set(t.x, t.y), this;
        }),
        (t.prototype.copyTo = function (t) {
          return t.set(this.x, this.y), t;
        }),
        (t.prototype.equals = function (t) {
          return t.x === this.x && t.y === this.y;
        }),
        (t.prototype.set = function (t, e) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = t),
            (this.x = t),
            (this.y = e),
            this
          );
        }),
        (t.prototype.toString = function () {
          return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
        }),
        t
      );
    })(),
    pr = [new fr(), new fr(), new fr(), new fr()],
    _r = (function () {
      function e(e, r, i, n) {
        void 0 === e && (e = 0),
          void 0 === r && (r = 0),
          void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          (this.x = Number(e)),
          (this.y = Number(r)),
          (this.width = Number(i)),
          (this.height = Number(n)),
          (this.type = t.SHAPES.RECT);
      }
      return (
        Object.defineProperty(e.prototype, "left", {
          get: function () {
            return this.x;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "right", {
          get: function () {
            return this.x + this.width;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "top", {
          get: function () {
            return this.y;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "bottom", {
          get: function () {
            return this.y + this.height;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "EMPTY", {
          get: function () {
            return new e(0, 0, 0, 0);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.clone = function () {
          return new e(this.x, this.y, this.width, this.height);
        }),
        (e.prototype.copyFrom = function (t) {
          return (
            (this.x = t.x),
            (this.y = t.y),
            (this.width = t.width),
            (this.height = t.height),
            this
          );
        }),
        (e.prototype.copyTo = function (t) {
          return (
            (t.x = this.x),
            (t.y = this.y),
            (t.width = this.width),
            (t.height = this.height),
            t
          );
        }),
        (e.prototype.contains = function (t, e) {
          return (
            !(this.width <= 0 || this.height <= 0) &&
            t >= this.x &&
            t < this.x + this.width &&
            e >= this.y &&
            e < this.y + this.height
          );
        }),
        (e.prototype.intersects = function (t, e) {
          if (!e) {
            var r = this.x < t.x ? t.x : this.x;
            if ((this.right > t.right ? t.right : this.right) <= r) return !1;
            var i = this.y < t.y ? t.y : this.y;
            return (this.bottom > t.bottom ? t.bottom : this.bottom) > i;
          }
          var n = this.left,
            o = this.right,
            s = this.top,
            a = this.bottom;
          if (o <= n || a <= s) return !1;
          var h = pr[0].set(t.left, t.top),
            u = pr[1].set(t.left, t.bottom),
            l = pr[2].set(t.right, t.top),
            c = pr[3].set(t.right, t.bottom);
          if (l.x <= h.x || u.y <= h.y) return !1;
          var d = Math.sign(e.a * e.d - e.b * e.c);
          if (0 === d) return !1;
          if (
            (e.apply(h, h),
            e.apply(u, u),
            e.apply(l, l),
            e.apply(c, c),
            Math.max(h.x, u.x, l.x, c.x) <= n ||
              Math.min(h.x, u.x, l.x, c.x) >= o ||
              Math.max(h.y, u.y, l.y, c.y) <= s ||
              Math.min(h.y, u.y, l.y, c.y) >= a)
          )
            return !1;
          var f = d * (u.y - h.y),
            p = d * (h.x - u.x),
            _ = f * n + p * s,
            v = f * o + p * s,
            m = f * n + p * a,
            E = f * o + p * a;
          if (
            Math.max(_, v, m, E) <= f * h.x + p * h.y ||
            Math.min(_, v, m, E) >= f * c.x + p * c.y
          )
            return !1;
          var T = d * (h.y - l.y),
            y = d * (l.x - h.x),
            g = T * n + y * s,
            b = T * o + y * s,
            R = T * n + y * a,
            A = T * o + y * a;
          return !(
            Math.max(g, b, R, A) <= T * h.x + y * h.y ||
            Math.min(g, b, R, A) >= T * c.x + y * c.y
          );
        }),
        (e.prototype.pad = function (t, e) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = t),
            (this.x -= t),
            (this.y -= e),
            (this.width += 2 * t),
            (this.height += 2 * e),
            this
          );
        }),
        (e.prototype.fit = function (t) {
          var e = Math.max(this.x, t.x),
            r = Math.min(this.x + this.width, t.x + t.width),
            i = Math.max(this.y, t.y),
            n = Math.min(this.y + this.height, t.y + t.height);
          return (
            (this.x = e),
            (this.width = Math.max(r - e, 0)),
            (this.y = i),
            (this.height = Math.max(n - i, 0)),
            this
          );
        }),
        (e.prototype.ceil = function (t, e) {
          void 0 === t && (t = 1), void 0 === e && (e = 0.001);
          var r = Math.ceil((this.x + this.width - e) * t) / t,
            i = Math.ceil((this.y + this.height - e) * t) / t;
          return (
            (this.x = Math.floor((this.x + e) * t) / t),
            (this.y = Math.floor((this.y + e) * t) / t),
            (this.width = r - this.x),
            (this.height = i - this.y),
            this
          );
        }),
        (e.prototype.enlarge = function (t) {
          var e = Math.min(this.x, t.x),
            r = Math.max(this.x + this.width, t.x + t.width),
            i = Math.min(this.y, t.y),
            n = Math.max(this.y + this.height, t.y + t.height);
          return (
            (this.x = e),
            (this.width = r - e),
            (this.y = i),
            (this.height = n - i),
            this
          );
        }),
        (e.prototype.toString = function () {
          return (
            "[@pixi/math:Rectangle x=" +
            this.x +
            " y=" +
            this.y +
            " width=" +
            this.width +
            " height=" +
            this.height +
            "]"
          );
        }),
        e
      );
    })(),
    vr = (function () {
      function e(e, r, i) {
        void 0 === e && (e = 0),
          void 0 === r && (r = 0),
          void 0 === i && (i = 0),
          (this.x = e),
          (this.y = r),
          (this.radius = i),
          (this.type = t.SHAPES.CIRC);
      }
      return (
        (e.prototype.clone = function () {
          return new e(this.x, this.y, this.radius);
        }),
        (e.prototype.contains = function (t, e) {
          if (this.radius <= 0) return !1;
          var r = this.radius * this.radius,
            i = this.x - t,
            n = this.y - e;
          return (i *= i) + (n *= n) <= r;
        }),
        (e.prototype.getBounds = function () {
          return new _r(
            this.x - this.radius,
            this.y - this.radius,
            2 * this.radius,
            2 * this.radius
          );
        }),
        (e.prototype.toString = function () {
          return (
            "[@pixi/math:Circle x=" +
            this.x +
            " y=" +
            this.y +
            " radius=" +
            this.radius +
            "]"
          );
        }),
        e
      );
    })(),
    mr = (function () {
      function e(e, r, i, n) {
        void 0 === e && (e = 0),
          void 0 === r && (r = 0),
          void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          (this.x = e),
          (this.y = r),
          (this.width = i),
          (this.height = n),
          (this.type = t.SHAPES.ELIP);
      }
      return (
        (e.prototype.clone = function () {
          return new e(this.x, this.y, this.width, this.height);
        }),
        (e.prototype.contains = function (t, e) {
          if (this.width <= 0 || this.height <= 0) return !1;
          var r = (t - this.x) / this.width,
            i = (e - this.y) / this.height;
          return (r *= r) + (i *= i) <= 1;
        }),
        (e.prototype.getBounds = function () {
          return new _r(
            this.x - this.width,
            this.y - this.height,
            this.width,
            this.height
          );
        }),
        (e.prototype.toString = function () {
          return (
            "[@pixi/math:Ellipse x=" +
            this.x +
            " y=" +
            this.y +
            " width=" +
            this.width +
            " height=" +
            this.height +
            "]"
          );
        }),
        e
      );
    })(),
    Er = (function () {
      function e() {
        for (var e = arguments, r = [], i = 0; i < arguments.length; i++)
          r[i] = e[i];
        var n = Array.isArray(r[0]) ? r[0] : r;
        if ("number" != typeof n[0]) {
          for (var o = [], s = 0, a = n.length; s < a; s++)
            o.push(n[s].x, n[s].y);
          n = o;
        }
        (this.points = n), (this.type = t.SHAPES.POLY), (this.closeStroke = !0);
      }
      return (
        (e.prototype.clone = function () {
          var t = new e(this.points.slice());
          return (t.closeStroke = this.closeStroke), t;
        }),
        (e.prototype.contains = function (t, e) {
          for (
            var r = !1, i = this.points.length / 2, n = 0, o = i - 1;
            n < i;
            o = n++
          ) {
            var s = this.points[2 * n],
              a = this.points[2 * n + 1],
              h = this.points[2 * o],
              u = this.points[2 * o + 1];
            a > e != u > e && t < ((e - a) / (u - a)) * (h - s) + s && (r = !r);
          }
          return r;
        }),
        (e.prototype.toString = function () {
          return (
            "[@pixi/math:PolygoncloseStroke=" +
            this.closeStroke +
            "points=" +
            this.points.reduce(function (t, e) {
              return t + ", " + e;
            }, "") +
            "]"
          );
        }),
        e
      );
    })(),
    Tr = (function () {
      function e(e, r, i, n, o) {
        void 0 === e && (e = 0),
          void 0 === r && (r = 0),
          void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          void 0 === o && (o = 20),
          (this.x = e),
          (this.y = r),
          (this.width = i),
          (this.height = n),
          (this.radius = o),
          (this.type = t.SHAPES.RREC);
      }
      return (
        (e.prototype.clone = function () {
          return new e(this.x, this.y, this.width, this.height, this.radius);
        }),
        (e.prototype.contains = function (t, e) {
          if (this.width <= 0 || this.height <= 0) return !1;
          if (
            t >= this.x &&
            t <= this.x + this.width &&
            e >= this.y &&
            e <= this.y + this.height
          ) {
            var r = Math.max(
              0,
              Math.min(this.radius, Math.min(this.width, this.height) / 2)
            );
            if (
              (e >= this.y + r && e <= this.y + this.height - r) ||
              (t >= this.x + r && t <= this.x + this.width - r)
            )
              return !0;
            var i = t - (this.x + r),
              n = e - (this.y + r),
              o = r * r;
            if (i * i + n * n <= o) return !0;
            if ((i = t - (this.x + this.width - r)) * i + n * n <= o) return !0;
            if (i * i + (n = e - (this.y + this.height - r)) * n <= o)
              return !0;
            if ((i = t - (this.x + r)) * i + n * n <= o) return !0;
          }
          return !1;
        }),
        (e.prototype.toString = function () {
          return (
            "[@pixi/math:RoundedRectangle x=" +
            this.x +
            " y=" +
            this.y +
            "width=" +
            this.width +
            " height=" +
            this.height +
            " radius=" +
            this.radius +
            "]"
          );
        }),
        e
      );
    })(),
    yr = (function () {
      function t(t, e, r, i) {
        void 0 === r && (r = 0),
          void 0 === i && (i = 0),
          (this._x = r),
          (this._y = i),
          (this.cb = t),
          (this.scope = e);
      }
      return (
        (t.prototype.clone = function (e, r) {
          return (
            void 0 === e && (e = this.cb),
            void 0 === r && (r = this.scope),
            new t(e, r, this._x, this._y)
          );
        }),
        (t.prototype.set = function (t, e) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = t),
            (this._x === t && this._y === e) ||
              ((this._x = t), (this._y = e), this.cb.call(this.scope)),
            this
          );
        }),
        (t.prototype.copyFrom = function (t) {
          return (
            (this._x === t.x && this._y === t.y) ||
              ((this._x = t.x), (this._y = t.y), this.cb.call(this.scope)),
            this
          );
        }),
        (t.prototype.copyTo = function (t) {
          return t.set(this._x, this._y), t;
        }),
        (t.prototype.equals = function (t) {
          return t.x === this._x && t.y === this._y;
        }),
        (t.prototype.toString = function () {
          return (
            "[@pixi/math:ObservablePoint x=0 y=0 scope=" + this.scope + "]"
          );
        }),
        Object.defineProperty(t.prototype, "x", {
          get: function () {
            return this._x;
          },
          set: function (t) {
            this._x !== t && ((this._x = t), this.cb.call(this.scope));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "y", {
          get: function () {
            return this._y;
          },
          set: function (t) {
            this._y !== t && ((this._y = t), this.cb.call(this.scope));
          },
          enumerable: !1,
          configurable: !0,
        }),
        t
      );
    })(),
    gr = (function () {
      function t(t, e, r, i, n, o) {
        void 0 === t && (t = 1),
          void 0 === e && (e = 0),
          void 0 === r && (r = 0),
          void 0 === i && (i = 1),
          void 0 === n && (n = 0),
          void 0 === o && (o = 0),
          (this.array = null),
          (this.a = t),
          (this.b = e),
          (this.c = r),
          (this.d = i),
          (this.tx = n),
          (this.ty = o);
      }
      return (
        (t.prototype.fromArray = function (t) {
          (this.a = t[0]),
            (this.b = t[1]),
            (this.c = t[3]),
            (this.d = t[4]),
            (this.tx = t[2]),
            (this.ty = t[5]);
        }),
        (t.prototype.set = function (t, e, r, i, n, o) {
          return (
            (this.a = t),
            (this.b = e),
            (this.c = r),
            (this.d = i),
            (this.tx = n),
            (this.ty = o),
            this
          );
        }),
        (t.prototype.toArray = function (t, e) {
          this.array || (this.array = new Float32Array(9));
          var r = e || this.array;
          return (
            t
              ? ((r[0] = this.a),
                (r[1] = this.b),
                (r[2] = 0),
                (r[3] = this.c),
                (r[4] = this.d),
                (r[5] = 0),
                (r[6] = this.tx),
                (r[7] = this.ty),
                (r[8] = 1))
              : ((r[0] = this.a),
                (r[1] = this.c),
                (r[2] = this.tx),
                (r[3] = this.b),
                (r[4] = this.d),
                (r[5] = this.ty),
                (r[6] = 0),
                (r[7] = 0),
                (r[8] = 1)),
            r
          );
        }),
        (t.prototype.apply = function (t, e) {
          e = e || new fr();
          var r = t.x,
            i = t.y;
          return (
            (e.x = this.a * r + this.c * i + this.tx),
            (e.y = this.b * r + this.d * i + this.ty),
            e
          );
        }),
        (t.prototype.applyInverse = function (t, e) {
          e = e || new fr();
          var r = 1 / (this.a * this.d + this.c * -this.b),
            i = t.x,
            n = t.y;
          return (
            (e.x =
              this.d * r * i +
              -this.c * r * n +
              (this.ty * this.c - this.tx * this.d) * r),
            (e.y =
              this.a * r * n +
              -this.b * r * i +
              (-this.ty * this.a + this.tx * this.b) * r),
            e
          );
        }),
        (t.prototype.translate = function (t, e) {
          return (this.tx += t), (this.ty += e), this;
        }),
        (t.prototype.scale = function (t, e) {
          return (
            (this.a *= t),
            (this.d *= e),
            (this.c *= t),
            (this.b *= e),
            (this.tx *= t),
            (this.ty *= e),
            this
          );
        }),
        (t.prototype.rotate = function (t) {
          var e = Math.cos(t),
            r = Math.sin(t),
            i = this.a,
            n = this.c,
            o = this.tx;
          return (
            (this.a = i * e - this.b * r),
            (this.b = i * r + this.b * e),
            (this.c = n * e - this.d * r),
            (this.d = n * r + this.d * e),
            (this.tx = o * e - this.ty * r),
            (this.ty = o * r + this.ty * e),
            this
          );
        }),
        (t.prototype.append = function (t) {
          var e = this.a,
            r = this.b,
            i = this.c,
            n = this.d;
          return (
            (this.a = t.a * e + t.b * i),
            (this.b = t.a * r + t.b * n),
            (this.c = t.c * e + t.d * i),
            (this.d = t.c * r + t.d * n),
            (this.tx = t.tx * e + t.ty * i + this.tx),
            (this.ty = t.tx * r + t.ty * n + this.ty),
            this
          );
        }),
        (t.prototype.setTransform = function (t, e, r, i, n, o, s, a, h) {
          return (
            (this.a = Math.cos(s + h) * n),
            (this.b = Math.sin(s + h) * n),
            (this.c = -Math.sin(s - a) * o),
            (this.d = Math.cos(s - a) * o),
            (this.tx = t - (r * this.a + i * this.c)),
            (this.ty = e - (r * this.b + i * this.d)),
            this
          );
        }),
        (t.prototype.prepend = function (t) {
          var e = this.tx;
          if (1 !== t.a || 0 !== t.b || 0 !== t.c || 1 !== t.d) {
            var r = this.a,
              i = this.c;
            (this.a = r * t.a + this.b * t.c),
              (this.b = r * t.b + this.b * t.d),
              (this.c = i * t.a + this.d * t.c),
              (this.d = i * t.b + this.d * t.d);
          }
          return (
            (this.tx = e * t.a + this.ty * t.c + t.tx),
            (this.ty = e * t.b + this.ty * t.d + t.ty),
            this
          );
        }),
        (t.prototype.decompose = function (t) {
          var e = this.a,
            r = this.b,
            i = this.c,
            n = this.d,
            o = t.pivot,
            s = -Math.atan2(-i, n),
            a = Math.atan2(r, e),
            h = Math.abs(s + a);
          return (
            h < 1e-5 || Math.abs(lr - h) < 1e-5
              ? ((t.rotation = a), (t.skew.x = t.skew.y = 0))
              : ((t.rotation = 0), (t.skew.x = s), (t.skew.y = a)),
            (t.scale.x = Math.sqrt(e * e + r * r)),
            (t.scale.y = Math.sqrt(i * i + n * n)),
            (t.position.x = this.tx + (o.x * e + o.y * i)),
            (t.position.y = this.ty + (o.x * r + o.y * n)),
            t
          );
        }),
        (t.prototype.invert = function () {
          var t = this.a,
            e = this.b,
            r = this.c,
            i = this.d,
            n = this.tx,
            o = t * i - e * r;
          return (
            (this.a = i / o),
            (this.b = -e / o),
            (this.c = -r / o),
            (this.d = t / o),
            (this.tx = (r * this.ty - i * n) / o),
            (this.ty = -(t * this.ty - e * n) / o),
            this
          );
        }),
        (t.prototype.identity = function () {
          return (
            (this.a = 1),
            (this.b = 0),
            (this.c = 0),
            (this.d = 1),
            (this.tx = 0),
            (this.ty = 0),
            this
          );
        }),
        (t.prototype.clone = function () {
          var e = new t();
          return (
            (e.a = this.a),
            (e.b = this.b),
            (e.c = this.c),
            (e.d = this.d),
            (e.tx = this.tx),
            (e.ty = this.ty),
            e
          );
        }),
        (t.prototype.copyTo = function (t) {
          return (
            (t.a = this.a),
            (t.b = this.b),
            (t.c = this.c),
            (t.d = this.d),
            (t.tx = this.tx),
            (t.ty = this.ty),
            t
          );
        }),
        (t.prototype.copyFrom = function (t) {
          return (
            (this.a = t.a),
            (this.b = t.b),
            (this.c = t.c),
            (this.d = t.d),
            (this.tx = t.tx),
            (this.ty = t.ty),
            this
          );
        }),
        (t.prototype.toString = function () {
          return (
            "[@pixi/math:Matrix a=" +
            this.a +
            " b=" +
            this.b +
            " c=" +
            this.c +
            " d=" +
            this.d +
            " tx=" +
            this.tx +
            " ty=" +
            this.ty +
            "]"
          );
        }),
        Object.defineProperty(t, "IDENTITY", {
          get: function () {
            return new t();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t, "TEMP_MATRIX", {
          get: function () {
            return new t();
          },
          enumerable: !1,
          configurable: !0,
        }),
        t
      );
    })(),
    br = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1],
    Rr = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1],
    Ar = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1],
    xr = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1],
    Sr = [],
    Or = [],
    Ir = Math.sign;
  !(function () {
    for (var t = 0; t < 16; t++) {
      var e = [];
      Sr.push(e);
      for (var r = 0; r < 16; r++)
        for (
          var i = Ir(br[t] * br[r] + Ar[t] * Rr[r]),
            n = Ir(Rr[t] * br[r] + xr[t] * Rr[r]),
            o = Ir(br[t] * Ar[r] + Ar[t] * xr[r]),
            s = Ir(Rr[t] * Ar[r] + xr[t] * xr[r]),
            a = 0;
          a < 16;
          a++
        )
          if (br[a] === i && Rr[a] === n && Ar[a] === o && xr[a] === s) {
            e.push(a);
            break;
          }
    }
    for (t = 0; t < 16; t++) {
      var h = new gr();
      h.set(br[t], Rr[t], Ar[t], xr[t], 0, 0), Or.push(h);
    }
  })();
  var Pr = {
      E: 0,
      SE: 1,
      S: 2,
      SW: 3,
      W: 4,
      NW: 5,
      N: 6,
      NE: 7,
      MIRROR_VERTICAL: 8,
      MAIN_DIAGONAL: 10,
      MIRROR_HORIZONTAL: 12,
      REVERSE_DIAGONAL: 14,
      uX: function (t) {
        return br[t];
      },
      uY: function (t) {
        return Rr[t];
      },
      vX: function (t) {
        return Ar[t];
      },
      vY: function (t) {
        return xr[t];
      },
      inv: function (t) {
        return 8 & t ? 15 & t : 7 & -t;
      },
      add: function (t, e) {
        return Sr[t][e];
      },
      sub: function (t, e) {
        return Sr[t][Pr.inv(e)];
      },
      rotate180: function (t) {
        return 4 ^ t;
      },
      isVertical: function (t) {
        return 2 == (3 & t);
      },
      byDirection: function (t, e) {
        return 2 * Math.abs(t) <= Math.abs(e)
          ? e >= 0
            ? Pr.S
            : Pr.N
          : 2 * Math.abs(e) <= Math.abs(t)
          ? t > 0
            ? Pr.E
            : Pr.W
          : e > 0
          ? t > 0
            ? Pr.SE
            : Pr.SW
          : t > 0
          ? Pr.NE
          : Pr.NW;
      },
      matrixAppendRotationInv: function (t, e, r, i) {
        void 0 === r && (r = 0), void 0 === i && (i = 0);
        var n = Or[Pr.inv(e)];
        (n.tx = r), (n.ty = i), t.append(n);
      },
    },
    Mr = (function () {
      function t() {
        (this.worldTransform = new gr()),
          (this.localTransform = new gr()),
          (this.position = new yr(this.onChange, this, 0, 0)),
          (this.scale = new yr(this.onChange, this, 1, 1)),
          (this.pivot = new yr(this.onChange, this, 0, 0)),
          (this.skew = new yr(this.updateSkew, this, 0, 0)),
          (this._rotation = 0),
          (this._cx = 1),
          (this._sx = 0),
          (this._cy = 0),
          (this._sy = 1),
          (this._localID = 0),
          (this._currentLocalID = 0),
          (this._worldID = 0),
          (this._parentID = 0);
      }
      return (
        (t.prototype.onChange = function () {
          this._localID++;
        }),
        (t.prototype.updateSkew = function () {
          (this._cx = Math.cos(this._rotation + this.skew.y)),
            (this._sx = Math.sin(this._rotation + this.skew.y)),
            (this._cy = -Math.sin(this._rotation - this.skew.x)),
            (this._sy = Math.cos(this._rotation - this.skew.x)),
            this._localID++;
        }),
        (t.prototype.toString = function () {
          return (
            "[@pixi/math:Transform position=(" +
            this.position.x +
            ", " +
            this.position.y +
            ") rotation=" +
            this.rotation +
            " scale=(" +
            this.scale.x +
            ", " +
            this.scale.y +
            ") skew=(" +
            this.skew.x +
            ", " +
            this.skew.y +
            ") ]"
          );
        }),
        (t.prototype.updateLocalTransform = function () {
          var t = this.localTransform;
          this._localID !== this._currentLocalID &&
            ((t.a = this._cx * this.scale.x),
            (t.b = this._sx * this.scale.x),
            (t.c = this._cy * this.scale.y),
            (t.d = this._sy * this.scale.y),
            (t.tx =
              this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c)),
            (t.ty =
              this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d)),
            (this._currentLocalID = this._localID),
            (this._parentID = -1));
        }),
        (t.prototype.updateTransform = function (t) {
          var e = this.localTransform;
          if (
            (this._localID !== this._currentLocalID &&
              ((e.a = this._cx * this.scale.x),
              (e.b = this._sx * this.scale.x),
              (e.c = this._cy * this.scale.y),
              (e.d = this._sy * this.scale.y),
              (e.tx =
                this.position.x - (this.pivot.x * e.a + this.pivot.y * e.c)),
              (e.ty =
                this.position.y - (this.pivot.x * e.b + this.pivot.y * e.d)),
              (this._currentLocalID = this._localID),
              (this._parentID = -1)),
            this._parentID !== t._worldID)
          ) {
            var r = t.worldTransform,
              i = this.worldTransform;
            (i.a = e.a * r.a + e.b * r.c),
              (i.b = e.a * r.b + e.b * r.d),
              (i.c = e.c * r.a + e.d * r.c),
              (i.d = e.c * r.b + e.d * r.d),
              (i.tx = e.tx * r.a + e.ty * r.c + r.tx),
              (i.ty = e.tx * r.b + e.ty * r.d + r.ty),
              (this._parentID = t._worldID),
              this._worldID++;
          }
        }),
        (t.prototype.setFromMatrix = function (t) {
          t.decompose(this), this._localID++;
        }),
        Object.defineProperty(t.prototype, "rotation", {
          get: function () {
            return this._rotation;
          },
          set: function (t) {
            this._rotation !== t && ((this._rotation = t), this.updateSkew());
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.IDENTITY = new t()),
        t
      );
    })();
  /*!
   * @pixi/display - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/display is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  bt.SORTABLE_CHILDREN = !1;
  var Nr = (function () {
      function t() {
        (this.minX = 1 / 0),
          (this.minY = 1 / 0),
          (this.maxX = -1 / 0),
          (this.maxY = -1 / 0),
          (this.rect = null),
          (this.updateID = -1);
      }
      return (
        (t.prototype.isEmpty = function () {
          return this.minX > this.maxX || this.minY > this.maxY;
        }),
        (t.prototype.clear = function () {
          (this.minX = 1 / 0),
            (this.minY = 1 / 0),
            (this.maxX = -1 / 0),
            (this.maxY = -1 / 0);
        }),
        (t.prototype.getRectangle = function (t) {
          return this.minX > this.maxX || this.minY > this.maxY
            ? _r.EMPTY
            : (((t = t || new _r(0, 0, 1, 1)).x = this.minX),
              (t.y = this.minY),
              (t.width = this.maxX - this.minX),
              (t.height = this.maxY - this.minY),
              t);
        }),
        (t.prototype.addPoint = function (t) {
          (this.minX = Math.min(this.minX, t.x)),
            (this.maxX = Math.max(this.maxX, t.x)),
            (this.minY = Math.min(this.minY, t.y)),
            (this.maxY = Math.max(this.maxY, t.y));
        }),
        (t.prototype.addPointMatrix = function (t, e) {
          var r = t.a,
            i = t.b,
            n = t.c,
            o = t.d,
            s = t.tx,
            a = t.ty,
            h = r * e.x + n * e.y + s,
            u = i * e.x + o * e.y + a;
          (this.minX = Math.min(this.minX, h)),
            (this.maxX = Math.max(this.maxX, h)),
            (this.minY = Math.min(this.minY, u)),
            (this.maxY = Math.max(this.maxY, u));
        }),
        (t.prototype.addQuad = function (t) {
          var e = this.minX,
            r = this.minY,
            i = this.maxX,
            n = this.maxY,
            o = t[0],
            s = t[1];
          (e = o < e ? o : e),
            (r = s < r ? s : r),
            (i = o > i ? o : i),
            (n = s > n ? s : n),
            (e = (o = t[2]) < e ? o : e),
            (r = (s = t[3]) < r ? s : r),
            (i = o > i ? o : i),
            (n = s > n ? s : n),
            (e = (o = t[4]) < e ? o : e),
            (r = (s = t[5]) < r ? s : r),
            (i = o > i ? o : i),
            (n = s > n ? s : n),
            (e = (o = t[6]) < e ? o : e),
            (r = (s = t[7]) < r ? s : r),
            (i = o > i ? o : i),
            (n = s > n ? s : n),
            (this.minX = e),
            (this.minY = r),
            (this.maxX = i),
            (this.maxY = n);
        }),
        (t.prototype.addFrame = function (t, e, r, i, n) {
          this.addFrameMatrix(t.worldTransform, e, r, i, n);
        }),
        (t.prototype.addFrameMatrix = function (t, e, r, i, n) {
          var o = t.a,
            s = t.b,
            a = t.c,
            h = t.d,
            u = t.tx,
            l = t.ty,
            c = this.minX,
            d = this.minY,
            f = this.maxX,
            p = this.maxY,
            _ = o * e + a * r + u,
            v = s * e + h * r + l;
          (c = _ < c ? _ : c),
            (d = v < d ? v : d),
            (f = _ > f ? _ : f),
            (p = v > p ? v : p),
            (c = (_ = o * i + a * r + u) < c ? _ : c),
            (d = (v = s * i + h * r + l) < d ? v : d),
            (f = _ > f ? _ : f),
            (p = v > p ? v : p),
            (c = (_ = o * e + a * n + u) < c ? _ : c),
            (d = (v = s * e + h * n + l) < d ? v : d),
            (f = _ > f ? _ : f),
            (p = v > p ? v : p),
            (c = (_ = o * i + a * n + u) < c ? _ : c),
            (d = (v = s * i + h * n + l) < d ? v : d),
            (f = _ > f ? _ : f),
            (p = v > p ? v : p),
            (this.minX = c),
            (this.minY = d),
            (this.maxX = f),
            (this.maxY = p);
        }),
        (t.prototype.addVertexData = function (t, e, r) {
          for (
            var i = this.minX,
              n = this.minY,
              o = this.maxX,
              s = this.maxY,
              a = e;
            a < r;
            a += 2
          ) {
            var h = t[a],
              u = t[a + 1];
            (i = h < i ? h : i),
              (n = u < n ? u : n),
              (o = h > o ? h : o),
              (s = u > s ? u : s);
          }
          (this.minX = i), (this.minY = n), (this.maxX = o), (this.maxY = s);
        }),
        (t.prototype.addVertices = function (t, e, r, i) {
          this.addVerticesMatrix(t.worldTransform, e, r, i);
        }),
        (t.prototype.addVerticesMatrix = function (t, e, r, i, n, o) {
          void 0 === n && (n = 0), void 0 === o && (o = n);
          for (
            var s = t.a,
              a = t.b,
              h = t.c,
              u = t.d,
              l = t.tx,
              c = t.ty,
              d = this.minX,
              f = this.minY,
              p = this.maxX,
              _ = this.maxY,
              v = r;
            v < i;
            v += 2
          ) {
            var m = e[v],
              E = e[v + 1],
              T = s * m + h * E + l,
              y = u * E + a * m + c;
            (d = Math.min(d, T - n)),
              (p = Math.max(p, T + n)),
              (f = Math.min(f, y - o)),
              (_ = Math.max(_, y + o));
          }
          (this.minX = d), (this.minY = f), (this.maxX = p), (this.maxY = _);
        }),
        (t.prototype.addBounds = function (t) {
          var e = this.minX,
            r = this.minY,
            i = this.maxX,
            n = this.maxY;
          (this.minX = t.minX < e ? t.minX : e),
            (this.minY = t.minY < r ? t.minY : r),
            (this.maxX = t.maxX > i ? t.maxX : i),
            (this.maxY = t.maxY > n ? t.maxY : n);
        }),
        (t.prototype.addBoundsMask = function (t, e) {
          var r = t.minX > e.minX ? t.minX : e.minX,
            i = t.minY > e.minY ? t.minY : e.minY,
            n = t.maxX < e.maxX ? t.maxX : e.maxX,
            o = t.maxY < e.maxY ? t.maxY : e.maxY;
          if (r <= n && i <= o) {
            var s = this.minX,
              a = this.minY,
              h = this.maxX,
              u = this.maxY;
            (this.minX = r < s ? r : s),
              (this.minY = i < a ? i : a),
              (this.maxX = n > h ? n : h),
              (this.maxY = o > u ? o : u);
          }
        }),
        (t.prototype.addBoundsMatrix = function (t, e) {
          this.addFrameMatrix(e, t.minX, t.minY, t.maxX, t.maxY);
        }),
        (t.prototype.addBoundsArea = function (t, e) {
          var r = t.minX > e.x ? t.minX : e.x,
            i = t.minY > e.y ? t.minY : e.y,
            n = t.maxX < e.x + e.width ? t.maxX : e.x + e.width,
            o = t.maxY < e.y + e.height ? t.maxY : e.y + e.height;
          if (r <= n && i <= o) {
            var s = this.minX,
              a = this.minY,
              h = this.maxX,
              u = this.maxY;
            (this.minX = r < s ? r : s),
              (this.minY = i < a ? i : a),
              (this.maxX = n > h ? n : h),
              (this.maxY = o > u ? o : u);
          }
        }),
        (t.prototype.pad = function (t, e) {
          void 0 === t && (t = 0),
            void 0 === e && (e = t),
            this.isEmpty() ||
              ((this.minX -= t),
              (this.maxX += t),
              (this.minY -= e),
              (this.maxY += e));
        }),
        (t.prototype.addFramePad = function (t, e, r, i, n, o) {
          (t -= n),
            (e -= o),
            (r += n),
            (i += o),
            (this.minX = this.minX < t ? this.minX : t),
            (this.maxX = this.maxX > r ? this.maxX : r),
            (this.minY = this.minY < e ? this.minY : e),
            (this.maxY = this.maxY > i ? this.maxY : i);
        }),
        t
      );
    })(),
    Dr = function (t, e) {
      return (
        (Dr =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Dr(t, e)
      );
    };
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */ function Cr(
    t,
    e
  ) {
    function r() {
      this.constructor = t;
    }
    Dr(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var wr,
    Lr,
    Fr,
    Ur,
    Br,
    Gr,
    Xr,
    kr,
    Hr,
    Yr,
    jr,
    Vr,
    Wr,
    zr,
    qr,
    Kr,
    Zr,
    Qr,
    Jr,
    $r = (function (t) {
      function e() {
        var e = t.call(this) || this;
        return (
          (e.tempDisplayObjectParent = null),
          (e.transform = new Mr()),
          (e.alpha = 1),
          (e.visible = !0),
          (e.renderable = !0),
          (e.cullable = !1),
          (e.cullArea = null),
          (e.parent = null),
          (e.worldAlpha = 1),
          (e._lastSortedIndex = 0),
          (e._zIndex = 0),
          (e.filterArea = null),
          (e.filters = null),
          (e._enabledFilters = null),
          (e._bounds = new Nr()),
          (e._localBounds = null),
          (e._boundsID = 0),
          (e._boundsRect = null),
          (e._localBoundsRect = null),
          (e._mask = null),
          (e._maskRefCount = 0),
          (e._destroyed = !1),
          (e.isSprite = !1),
          (e.isMask = !1),
          e
        );
      }
      return (
        Cr(e, t),
        (e.mixin = function (t) {
          for (var r = Object.keys(t), i = 0; i < r.length; ++i) {
            var n = r[i];
            Object.defineProperty(
              e.prototype,
              n,
              Object.getOwnPropertyDescriptor(t, n)
            );
          }
        }),
        Object.defineProperty(e.prototype, "destroyed", {
          get: function () {
            return this._destroyed;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype._recursivePostUpdateTransform = function () {
          this.parent
            ? (this.parent._recursivePostUpdateTransform(),
              this.transform.updateTransform(this.parent.transform))
            : this.transform.updateTransform(
                this._tempDisplayObjectParent.transform
              );
        }),
        (e.prototype.updateTransform = function () {
          this._boundsID++,
            this.transform.updateTransform(this.parent.transform),
            (this.worldAlpha = this.alpha * this.parent.worldAlpha);
        }),
        (e.prototype.getBounds = function (t, e) {
          return (
            t ||
              (this.parent
                ? (this._recursivePostUpdateTransform(), this.updateTransform())
                : ((this.parent = this._tempDisplayObjectParent),
                  this.updateTransform(),
                  (this.parent = null))),
            this._bounds.updateID !== this._boundsID &&
              (this.calculateBounds(),
              (this._bounds.updateID = this._boundsID)),
            e ||
              (this._boundsRect || (this._boundsRect = new _r()),
              (e = this._boundsRect)),
            this._bounds.getRectangle(e)
          );
        }),
        (e.prototype.getLocalBounds = function (t) {
          t ||
            (this._localBoundsRect || (this._localBoundsRect = new _r()),
            (t = this._localBoundsRect)),
            this._localBounds || (this._localBounds = new Nr());
          var e = this.transform,
            r = this.parent;
          (this.parent = null),
            (this.transform = this._tempDisplayObjectParent.transform);
          var i = this._bounds,
            n = this._boundsID;
          this._bounds = this._localBounds;
          var o = this.getBounds(!1, t);
          return (
            (this.parent = r),
            (this.transform = e),
            (this._bounds = i),
            (this._bounds.updateID += this._boundsID - n),
            o
          );
        }),
        (e.prototype.toGlobal = function (t, e, r) {
          return (
            void 0 === r && (r = !1),
            r ||
              (this._recursivePostUpdateTransform(),
              this.parent
                ? this.displayObjectUpdateTransform()
                : ((this.parent = this._tempDisplayObjectParent),
                  this.displayObjectUpdateTransform(),
                  (this.parent = null))),
            this.worldTransform.apply(t, e)
          );
        }),
        (e.prototype.toLocal = function (t, e, r, i) {
          return (
            e && (t = e.toGlobal(t, r, i)),
            i ||
              (this._recursivePostUpdateTransform(),
              this.parent
                ? this.displayObjectUpdateTransform()
                : ((this.parent = this._tempDisplayObjectParent),
                  this.displayObjectUpdateTransform(),
                  (this.parent = null))),
            this.worldTransform.applyInverse(t, r)
          );
        }),
        (e.prototype.setParent = function (t) {
          if (!t || !t.addChild)
            throw new Error("setParent: Argument must be a Container");
          return t.addChild(this), t;
        }),
        (e.prototype.setTransform = function (t, e, r, i, n, o, s, a, h) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            void 0 === r && (r = 1),
            void 0 === i && (i = 1),
            void 0 === n && (n = 0),
            void 0 === o && (o = 0),
            void 0 === s && (s = 0),
            void 0 === a && (a = 0),
            void 0 === h && (h = 0),
            (this.position.x = t),
            (this.position.y = e),
            (this.scale.x = r || 1),
            (this.scale.y = i || 1),
            (this.rotation = n),
            (this.skew.x = o),
            (this.skew.y = s),
            (this.pivot.x = a),
            (this.pivot.y = h),
            this
          );
        }),
        (e.prototype.destroy = function (t) {
          this.parent && this.parent.removeChild(this),
            this.emit("destroyed"),
            this.removeAllListeners(),
            (this.transform = null),
            (this.parent = null),
            (this._bounds = null),
            (this.mask = null),
            (this.cullArea = null),
            (this.filters = null),
            (this.filterArea = null),
            (this.hitArea = null),
            (this.interactive = !1),
            (this.interactiveChildren = !1),
            (this._destroyed = !0);
        }),
        Object.defineProperty(e.prototype, "_tempDisplayObjectParent", {
          get: function () {
            return (
              null === this.tempDisplayObjectParent &&
                (this.tempDisplayObjectParent = new ti()),
              this.tempDisplayObjectParent
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.enableTempParent = function () {
          var t = this.parent;
          return (this.parent = this._tempDisplayObjectParent), t;
        }),
        (e.prototype.disableTempParent = function (t) {
          this.parent = t;
        }),
        Object.defineProperty(e.prototype, "x", {
          get: function () {
            return this.position.x;
          },
          set: function (t) {
            this.transform.position.x = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "y", {
          get: function () {
            return this.position.y;
          },
          set: function (t) {
            this.transform.position.y = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "worldTransform", {
          get: function () {
            return this.transform.worldTransform;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "localTransform", {
          get: function () {
            return this.transform.localTransform;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "position", {
          get: function () {
            return this.transform.position;
          },
          set: function (t) {
            this.transform.position.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "scale", {
          get: function () {
            return this.transform.scale;
          },
          set: function (t) {
            this.transform.scale.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "pivot", {
          get: function () {
            return this.transform.pivot;
          },
          set: function (t) {
            this.transform.pivot.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "skew", {
          get: function () {
            return this.transform.skew;
          },
          set: function (t) {
            this.transform.skew.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "rotation", {
          get: function () {
            return this.transform.rotation;
          },
          set: function (t) {
            this.transform.rotation = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "angle", {
          get: function () {
            return this.transform.rotation * cr;
          },
          set: function (t) {
            this.transform.rotation = t * dr;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "zIndex", {
          get: function () {
            return this._zIndex;
          },
          set: function (t) {
            (this._zIndex = t), this.parent && (this.parent.sortDirty = !0);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "worldVisible", {
          get: function () {
            var t = this;
            do {
              if (!t.visible) return !1;
              t = t.parent;
            } while (t);
            return !0;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "mask", {
          get: function () {
            return this._mask;
          },
          set: function (t) {
            if (this._mask !== t) {
              var e;
              if (this._mask)
                (e = this._mask.maskObject || this._mask)._maskRefCount--,
                  0 === e._maskRefCount &&
                    ((e.renderable = !0), (e.isMask = !1));
              if (((this._mask = t), this._mask))
                0 === (e = this._mask.maskObject || this._mask)._maskRefCount &&
                  ((e.renderable = !1), (e.isMask = !0)),
                  e._maskRefCount++;
            }
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(xt),
    ti = (function (t) {
      function e() {
        var e = (null !== t && t.apply(this, arguments)) || this;
        return (e.sortDirty = null), e;
      }
      return Cr(e, t), e;
    })($r);
  function ei(t, e) {
    return t.zIndex === e.zIndex
      ? t._lastSortedIndex - e._lastSortedIndex
      : t.zIndex - e.zIndex;
  }
  ($r.prototype.displayObjectUpdateTransform = $r.prototype.updateTransform),
    (function (t) {
      (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
        (t[(t.WEBGL = 1)] = "WEBGL"),
        (t[(t.WEBGL2 = 2)] = "WEBGL2");
    })(wr || (wr = {})),
    (function (t) {
      (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
        (t[(t.WEBGL = 1)] = "WEBGL"),
        (t[(t.CANVAS = 2)] = "CANVAS");
    })(Lr || (Lr = {})),
    (function (t) {
      (t[(t.COLOR = 16384)] = "COLOR"),
        (t[(t.DEPTH = 256)] = "DEPTH"),
        (t[(t.STENCIL = 1024)] = "STENCIL");
    })(Fr || (Fr = {})),
    (function (t) {
      (t[(t.NORMAL = 0)] = "NORMAL"),
        (t[(t.ADD = 1)] = "ADD"),
        (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
        (t[(t.SCREEN = 3)] = "SCREEN"),
        (t[(t.OVERLAY = 4)] = "OVERLAY"),
        (t[(t.DARKEN = 5)] = "DARKEN"),
        (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
        (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
        (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
        (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
        (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
        (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
        (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
        (t[(t.HUE = 13)] = "HUE"),
        (t[(t.SATURATION = 14)] = "SATURATION"),
        (t[(t.COLOR = 15)] = "COLOR"),
        (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
        (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
        (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
        (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
        (t[(t.NONE = 20)] = "NONE"),
        (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
        (t[(t.SRC_IN = 21)] = "SRC_IN"),
        (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
        (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
        (t[(t.DST_OVER = 24)] = "DST_OVER"),
        (t[(t.DST_IN = 25)] = "DST_IN"),
        (t[(t.DST_OUT = 26)] = "DST_OUT"),
        (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
        (t[(t.ERASE = 26)] = "ERASE"),
        (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
        (t[(t.XOR = 29)] = "XOR");
    })(Ur || (Ur = {})),
    (function (t) {
      (t[(t.POINTS = 0)] = "POINTS"),
        (t[(t.LINES = 1)] = "LINES"),
        (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
        (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
        (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
        (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
        (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
    })(Br || (Br = {})),
    (function (t) {
      (t[(t.RGBA = 6408)] = "RGBA"),
        (t[(t.RGB = 6407)] = "RGB"),
        (t[(t.RG = 33319)] = "RG"),
        (t[(t.RED = 6403)] = "RED"),
        (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
        (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
        (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
        (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
        (t[(t.ALPHA = 6406)] = "ALPHA"),
        (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
        (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
        (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
        (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
    })(Gr || (Gr = {})),
    (function (t) {
      (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
        (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
        (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
          "TEXTURE_CUBE_MAP_POSITIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Z"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Z");
    })(Xr || (Xr = {})),
    (function (t) {
      (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
        (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
        (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
        (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
        (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
        (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
        (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
          "UNSIGNED_INT_10F_11F_11F_REV"),
        (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
          "UNSIGNED_INT_2_10_10_10_REV"),
        (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
        (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
        (t[(t.BYTE = 5120)] = "BYTE"),
        (t[(t.SHORT = 5122)] = "SHORT"),
        (t[(t.INT = 5124)] = "INT"),
        (t[(t.FLOAT = 5126)] = "FLOAT"),
        (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
          "FLOAT_32_UNSIGNED_INT_24_8_REV"),
        (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
    })(kr || (kr = {})),
    (function (t) {
      (t[(t.FLOAT = 0)] = "FLOAT"),
        (t[(t.INT = 1)] = "INT"),
        (t[(t.UINT = 2)] = "UINT");
    })(Hr || (Hr = {})),
    (function (t) {
      (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
    })(Yr || (Yr = {})),
    (function (t) {
      (t[(t.CLAMP = 33071)] = "CLAMP"),
        (t[(t.REPEAT = 10497)] = "REPEAT"),
        (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
    })(jr || (jr = {})),
    (function (t) {
      (t[(t.OFF = 0)] = "OFF"),
        (t[(t.POW2 = 1)] = "POW2"),
        (t[(t.ON = 2)] = "ON"),
        (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
    })(Vr || (Vr = {})),
    (function (t) {
      (t[(t.NPM = 0)] = "NPM"),
        (t[(t.UNPACK = 1)] = "UNPACK"),
        (t[(t.PMA = 2)] = "PMA"),
        (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
        (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
        (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
        (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
    })(Wr || (Wr = {})),
    (function (t) {
      (t[(t.NO = 0)] = "NO"),
        (t[(t.YES = 1)] = "YES"),
        (t[(t.AUTO = 2)] = "AUTO"),
        (t[(t.BLEND = 0)] = "BLEND"),
        (t[(t.CLEAR = 1)] = "CLEAR"),
        (t[(t.BLIT = 2)] = "BLIT");
    })(zr || (zr = {})),
    (function (t) {
      (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
    })(qr || (qr = {})),
    (function (t) {
      (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
    })(Kr || (Kr = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.SCISSOR = 1)] = "SCISSOR"),
        (t[(t.STENCIL = 2)] = "STENCIL"),
        (t[(t.SPRITE = 3)] = "SPRITE");
    })(Zr || (Zr = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.LOW = 2)] = "LOW"),
        (t[(t.MEDIUM = 4)] = "MEDIUM"),
        (t[(t.HIGH = 8)] = "HIGH");
    })(Qr || (Qr = {})),
    (function (t) {
      (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
        (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
        (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
    })(Jr || (Jr = {}));
  var ri = (function (t) {
    function e() {
      var e = t.call(this) || this;
      return (
        (e.children = []),
        (e.sortableChildren = bt.SORTABLE_CHILDREN),
        (e.sortDirty = !1),
        e
      );
    }
    return (
      Cr(e, t),
      (e.prototype.onChildrenChange = function (t) {}),
      (e.prototype.addChild = function () {
        for (var t = arguments, e = [], r = 0; r < arguments.length; r++)
          e[r] = t[r];
        if (e.length > 1)
          for (var i = 0; i < e.length; i++) this.addChild(e[i]);
        else {
          var n = e[0];
          n.parent && n.parent.removeChild(n),
            (n.parent = this),
            (this.sortDirty = !0),
            (n.transform._parentID = -1),
            this.children.push(n),
            this._boundsID++,
            this.onChildrenChange(this.children.length - 1),
            this.emit("childAdded", n, this, this.children.length - 1),
            n.emit("added", this);
        }
        return e[0];
      }),
      (e.prototype.addChildAt = function (t, e) {
        if (e < 0 || e > this.children.length)
          throw new Error(
            t +
              "addChildAt: The index " +
              e +
              " supplied is out of bounds " +
              this.children.length
          );
        return (
          t.parent && t.parent.removeChild(t),
          (t.parent = this),
          (this.sortDirty = !0),
          (t.transform._parentID = -1),
          this.children.splice(e, 0, t),
          this._boundsID++,
          this.onChildrenChange(e),
          t.emit("added", this),
          this.emit("childAdded", t, this, e),
          t
        );
      }),
      (e.prototype.swapChildren = function (t, e) {
        if (t !== e) {
          var r = this.getChildIndex(t),
            i = this.getChildIndex(e);
          (this.children[r] = e),
            (this.children[i] = t),
            this.onChildrenChange(r < i ? r : i);
        }
      }),
      (e.prototype.getChildIndex = function (t) {
        var e = this.children.indexOf(t);
        if (-1 === e)
          throw new Error(
            "The supplied DisplayObject must be a child of the caller"
          );
        return e;
      }),
      (e.prototype.setChildIndex = function (t, e) {
        if (e < 0 || e >= this.children.length)
          throw new Error(
            "The index " +
              e +
              " supplied is out of bounds " +
              this.children.length
          );
        var r = this.getChildIndex(t);
        ze(this.children, r, 1),
          this.children.splice(e, 0, t),
          this.onChildrenChange(e);
      }),
      (e.prototype.getChildAt = function (t) {
        if (t < 0 || t >= this.children.length)
          throw new Error("getChildAt: Index (" + t + ") does not exist.");
        return this.children[t];
      }),
      (e.prototype.removeChild = function () {
        for (var t = arguments, e = [], r = 0; r < arguments.length; r++)
          e[r] = t[r];
        if (e.length > 1)
          for (var i = 0; i < e.length; i++) this.removeChild(e[i]);
        else {
          var n = e[0],
            o = this.children.indexOf(n);
          if (-1 === o) return null;
          (n.parent = null),
            (n.transform._parentID = -1),
            ze(this.children, o, 1),
            this._boundsID++,
            this.onChildrenChange(o),
            n.emit("removed", this),
            this.emit("childRemoved", n, this, o);
        }
        return e[0];
      }),
      (e.prototype.removeChildAt = function (t) {
        var e = this.getChildAt(t);
        return (
          (e.parent = null),
          (e.transform._parentID = -1),
          ze(this.children, t, 1),
          this._boundsID++,
          this.onChildrenChange(t),
          e.emit("removed", this),
          this.emit("childRemoved", e, this, t),
          e
        );
      }),
      (e.prototype.removeChildren = function (t, e) {
        void 0 === t && (t = 0), void 0 === e && (e = this.children.length);
        var r,
          i = t,
          n = e - i;
        if (n > 0 && n <= e) {
          r = this.children.splice(i, n);
          for (var o = 0; o < r.length; ++o)
            (r[o].parent = null),
              r[o].transform && (r[o].transform._parentID = -1);
          this._boundsID++, this.onChildrenChange(t);
          for (o = 0; o < r.length; ++o)
            r[o].emit("removed", this),
              this.emit("childRemoved", r[o], this, o);
          return r;
        }
        if (0 === n && 0 === this.children.length) return [];
        throw new RangeError(
          "removeChildren: numeric values are outside the acceptable range."
        );
      }),
      (e.prototype.sortChildren = function () {
        for (var t = !1, e = 0, r = this.children.length; e < r; ++e) {
          var i = this.children[e];
          (i._lastSortedIndex = e), t || 0 === i.zIndex || (t = !0);
        }
        t && this.children.length > 1 && this.children.sort(ei),
          (this.sortDirty = !1);
      }),
      (e.prototype.updateTransform = function () {
        this.sortableChildren && this.sortDirty && this.sortChildren(),
          this._boundsID++,
          this.transform.updateTransform(this.parent.transform),
          (this.worldAlpha = this.alpha * this.parent.worldAlpha);
        for (var t = 0, e = this.children.length; t < e; ++t) {
          var r = this.children[t];
          r.visible && r.updateTransform();
        }
      }),
      (e.prototype.calculateBounds = function () {
        this._bounds.clear(), this._calculateBounds();
        for (var t = 0; t < this.children.length; t++) {
          var e = this.children[t];
          if (e.visible && e.renderable)
            if ((e.calculateBounds(), e._mask)) {
              var r = e._mask.maskObject || e._mask;
              r.calculateBounds(),
                this._bounds.addBoundsMask(e._bounds, r._bounds);
            } else
              e.filterArea
                ? this._bounds.addBoundsArea(e._bounds, e.filterArea)
                : this._bounds.addBounds(e._bounds);
        }
        this._bounds.updateID = this._boundsID;
      }),
      (e.prototype.getLocalBounds = function (e, r) {
        void 0 === r && (r = !1);
        var i = t.prototype.getLocalBounds.call(this, e);
        if (!r)
          for (var n = 0, o = this.children.length; n < o; ++n) {
            var s = this.children[n];
            s.visible && s.updateTransform();
          }
        return i;
      }),
      (e.prototype._calculateBounds = function () {}),
      (e.prototype._renderWithCulling = function (t) {
        var r = t.renderTexture.sourceFrame;
        if (r.width > 0 && r.height > 0) {
          var i, n;
          if (
            (this.cullArea
              ? ((i = this.cullArea), (n = this.worldTransform))
              : this._render !== e.prototype._render &&
                (i = this.getBounds(!0)),
            i && r.intersects(i, n))
          )
            this._render(t);
          else if (this.cullArea) return;
          for (var o = 0, s = this.children.length; o < s; ++o) {
            var a = this.children[o],
              h = a.cullable;
            (a.cullable = h || !this.cullArea), a.render(t), (a.cullable = h);
          }
        }
      }),
      (e.prototype.render = function (t) {
        if (this.visible && !(this.worldAlpha <= 0) && this.renderable)
          if (this._mask || (this.filters && this.filters.length))
            this.renderAdvanced(t);
          else if (this.cullable) this._renderWithCulling(t);
          else {
            this._render(t);
            for (var e = 0, r = this.children.length; e < r; ++e)
              this.children[e].render(t);
          }
      }),
      (e.prototype.renderAdvanced = function (t) {
        var e = this.filters,
          r = this._mask;
        if (e) {
          this._enabledFilters || (this._enabledFilters = []),
            (this._enabledFilters.length = 0);
          for (var i = 0; i < e.length; i++)
            e[i].enabled && this._enabledFilters.push(e[i]);
        }
        var n =
          (e && this._enabledFilters && this._enabledFilters.length) ||
          (r &&
            (!r.isMaskData ||
              (r.enabled && (r.autoDetect || r.type !== Zr.NONE))));
        if (
          (n && t.batch.flush(),
          e &&
            this._enabledFilters &&
            this._enabledFilters.length &&
            t.filter.push(this, this._enabledFilters),
          r && t.mask.push(this, this._mask),
          this.cullable)
        )
          this._renderWithCulling(t);
        else {
          this._render(t);
          i = 0;
          for (var o = this.children.length; i < o; ++i)
            this.children[i].render(t);
        }
        n && t.batch.flush(),
          r && t.mask.pop(this),
          e &&
            this._enabledFilters &&
            this._enabledFilters.length &&
            t.filter.pop();
      }),
      (e.prototype._render = function (t) {}),
      (e.prototype.destroy = function (e) {
        t.prototype.destroy.call(this), (this.sortDirty = !1);
        var r = "boolean" == typeof e ? e : e && e.children,
          i = this.removeChildren(0, this.children.length);
        if (r) for (var n = 0; n < i.length; ++n) i[n].destroy(e);
      }),
      Object.defineProperty(e.prototype, "width", {
        get: function () {
          return this.scale.x * this.getLocalBounds().width;
        },
        set: function (t) {
          var e = this.getLocalBounds().width;
          (this.scale.x = 0 !== e ? t / e : 1), (this._width = t);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "height", {
        get: function () {
          return this.scale.y * this.getLocalBounds().height;
        },
        set: function (t) {
          var e = this.getLocalBounds().height;
          (this.scale.y = 0 !== e ? t / e : 1), (this._height = t);
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })($r);
  ri.prototype.containerUpdateTransform = ri.prototype.updateTransform;
  /*!
   * @pixi/accessibility - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/accessibility is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var ii = {
    accessible: !1,
    accessibleTitle: null,
    accessibleHint: null,
    tabIndex: 0,
    _accessibleActive: !1,
    _accessibleDiv: null,
    accessibleType: "button",
    accessiblePointerEvents: "auto",
    accessibleChildren: !0,
    renderId: -1,
  };
  $r.mixin(ii);
  var ni,
    oi = (function () {
      function t(t) {
        (this.debug = !1),
          (this._isActive = !1),
          (this._isMobileAccessibility = !1),
          (this.pool = []),
          (this.renderId = 0),
          (this.children = []),
          (this.androidUpdateCount = 0),
          (this.androidUpdateFrequency = 500),
          (this._hookDiv = null),
          (gt.tablet || gt.phone) && this.createTouchHook();
        var e = document.createElement("div");
        (e.style.width = "100px"),
          (e.style.height = "100px"),
          (e.style.position = "absolute"),
          (e.style.top = "0px"),
          (e.style.left = "0px"),
          (e.style.zIndex = (2).toString()),
          (this.div = e),
          (this.renderer = t),
          (this._onKeyDown = this._onKeyDown.bind(this)),
          (this._onMouseMove = this._onMouseMove.bind(this)),
          globalThis.addEventListener("keydown", this._onKeyDown, !1);
      }
      return (
        Object.defineProperty(t.prototype, "isActive", {
          get: function () {
            return this._isActive;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isMobileAccessibility", {
          get: function () {
            return this._isMobileAccessibility;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.createTouchHook = function () {
          var t = this,
            e = document.createElement("button");
          (e.style.width = "1px"),
            (e.style.height = "1px"),
            (e.style.position = "absolute"),
            (e.style.top = "-1000px"),
            (e.style.left = "-1000px"),
            (e.style.zIndex = (2).toString()),
            (e.style.backgroundColor = "#FF0000"),
            (e.title = "select to enable accessibility for this content"),
            e.addEventListener("focus", function () {
              (t._isMobileAccessibility = !0),
                t.activate(),
                t.destroyTouchHook();
            }),
            document.body.appendChild(e),
            (this._hookDiv = e);
        }),
        (t.prototype.destroyTouchHook = function () {
          this._hookDiv &&
            (document.body.removeChild(this._hookDiv), (this._hookDiv = null));
        }),
        (t.prototype.activate = function () {
          var t;
          this._isActive ||
            ((this._isActive = !0),
            globalThis.document.addEventListener(
              "mousemove",
              this._onMouseMove,
              !0
            ),
            globalThis.removeEventListener("keydown", this._onKeyDown, !1),
            this.renderer.on("postrender", this.update, this),
            null === (t = this.renderer.view.parentNode) ||
              void 0 === t ||
              t.appendChild(this.div));
        }),
        (t.prototype.deactivate = function () {
          var t;
          this._isActive &&
            !this._isMobileAccessibility &&
            ((this._isActive = !1),
            globalThis.document.removeEventListener(
              "mousemove",
              this._onMouseMove,
              !0
            ),
            globalThis.addEventListener("keydown", this._onKeyDown, !1),
            this.renderer.off("postrender", this.update),
            null === (t = this.div.parentNode) ||
              void 0 === t ||
              t.removeChild(this.div));
        }),
        (t.prototype.updateAccessibleObjects = function (t) {
          if (t.visible && t.accessibleChildren) {
            t.accessible &&
              t.interactive &&
              (t._accessibleActive || this.addChild(t),
              (t.renderId = this.renderId));
            var e = t.children;
            if (e)
              for (var r = 0; r < e.length; r++)
                this.updateAccessibleObjects(e[r]);
          }
        }),
        (t.prototype.update = function () {
          var t = performance.now();
          if (
            !(gt.android.device && t < this.androidUpdateCount) &&
            ((this.androidUpdateCount = t + this.androidUpdateFrequency),
            this.renderer.renderingToScreen)
          ) {
            this.renderer._lastObjectRendered &&
              this.updateAccessibleObjects(this.renderer._lastObjectRendered);
            var e = this.renderer.view.getBoundingClientRect(),
              r = e.left,
              i = e.top,
              n = e.width,
              o = e.height,
              s = this.renderer,
              a = s.width,
              h = s.height,
              u = s.resolution,
              l = (n / a) * u,
              c = (o / h) * u,
              d = this.div;
            (d.style.left = r + "px"),
              (d.style.top = i + "px"),
              (d.style.width = a + "px"),
              (d.style.height = h + "px");
            for (var f = 0; f < this.children.length; f++) {
              var p = this.children[f];
              if (p.renderId !== this.renderId)
                (p._accessibleActive = !1),
                  ze(this.children, f, 1),
                  this.div.removeChild(p._accessibleDiv),
                  this.pool.push(p._accessibleDiv),
                  (p._accessibleDiv = null),
                  f--;
              else {
                d = p._accessibleDiv;
                var _ = p.hitArea,
                  v = p.worldTransform;
                p.hitArea
                  ? ((d.style.left = (v.tx + _.x * v.a) * l + "px"),
                    (d.style.top = (v.ty + _.y * v.d) * c + "px"),
                    (d.style.width = _.width * v.a * l + "px"),
                    (d.style.height = _.height * v.d * c + "px"))
                  : ((_ = p.getBounds()),
                    this.capHitArea(_),
                    (d.style.left = _.x * l + "px"),
                    (d.style.top = _.y * c + "px"),
                    (d.style.width = _.width * l + "px"),
                    (d.style.height = _.height * c + "px"),
                    d.title !== p.accessibleTitle &&
                      null !== p.accessibleTitle &&
                      (d.title = p.accessibleTitle),
                    d.getAttribute("aria-label") !== p.accessibleHint &&
                      null !== p.accessibleHint &&
                      d.setAttribute("aria-label", p.accessibleHint)),
                  (p.accessibleTitle === d.title &&
                    p.tabIndex === d.tabIndex) ||
                    ((d.title = p.accessibleTitle),
                    (d.tabIndex = p.tabIndex),
                    this.debug && this.updateDebugHTML(d));
              }
            }
            this.renderId++;
          }
        }),
        (t.prototype.updateDebugHTML = function (t) {
          t.innerHTML =
            "type: " +
            t.type +
            "</br> title : " +
            t.title +
            "</br> tabIndex: " +
            t.tabIndex;
        }),
        (t.prototype.capHitArea = function (t) {
          t.x < 0 && ((t.width += t.x), (t.x = 0)),
            t.y < 0 && ((t.height += t.y), (t.y = 0));
          var e = this.renderer,
            r = e.width,
            i = e.height;
          t.x + t.width > r && (t.width = r - t.x),
            t.y + t.height > i && (t.height = i - t.y);
        }),
        (t.prototype.addChild = function (t) {
          var e = this.pool.pop();
          e ||
            (((e = document.createElement("button")).style.width = "100px"),
            (e.style.height = "100px"),
            (e.style.backgroundColor = this.debug
              ? "rgba(255,255,255,0.5)"
              : "transparent"),
            (e.style.position = "absolute"),
            (e.style.zIndex = (2).toString()),
            (e.style.borderStyle = "none"),
            navigator.userAgent.toLowerCase().indexOf("chrome") > -1
              ? e.setAttribute("aria-live", "off")
              : e.setAttribute("aria-live", "polite"),
            navigator.userAgent.match(/rv:.*Gecko\//)
              ? e.setAttribute("aria-relevant", "additions")
              : e.setAttribute("aria-relevant", "text"),
            e.addEventListener("click", this._onClick.bind(this)),
            e.addEventListener("focus", this._onFocus.bind(this)),
            e.addEventListener("focusout", this._onFocusOut.bind(this))),
            (e.style.pointerEvents = t.accessiblePointerEvents),
            (e.type = t.accessibleType),
            t.accessibleTitle && null !== t.accessibleTitle
              ? (e.title = t.accessibleTitle)
              : (t.accessibleHint && null !== t.accessibleHint) ||
                (e.title = "displayObject " + t.tabIndex),
            t.accessibleHint &&
              null !== t.accessibleHint &&
              e.setAttribute("aria-label", t.accessibleHint),
            this.debug && this.updateDebugHTML(e),
            (t._accessibleActive = !0),
            (t._accessibleDiv = e),
            (e.displayObject = t),
            this.children.push(t),
            this.div.appendChild(t._accessibleDiv),
            (t._accessibleDiv.tabIndex = t.tabIndex);
        }),
        (t.prototype._onClick = function (t) {
          var e = this.renderer.plugins.interaction,
            r = t.target.displayObject,
            i = e.eventData;
          e.dispatchEvent(r, "click", i),
            e.dispatchEvent(r, "pointertap", i),
            e.dispatchEvent(r, "tap", i);
        }),
        (t.prototype._onFocus = function (t) {
          t.target.getAttribute("aria-live") ||
            t.target.setAttribute("aria-live", "assertive");
          var e = this.renderer.plugins.interaction,
            r = t.target.displayObject,
            i = e.eventData;
          e.dispatchEvent(r, "mouseover", i);
        }),
        (t.prototype._onFocusOut = function (t) {
          t.target.getAttribute("aria-live") ||
            t.target.setAttribute("aria-live", "polite");
          var e = this.renderer.plugins.interaction,
            r = t.target.displayObject,
            i = e.eventData;
          e.dispatchEvent(r, "mouseout", i);
        }),
        (t.prototype._onKeyDown = function (t) {
          9 === t.keyCode && this.activate();
        }),
        (t.prototype._onMouseMove = function (t) {
          (0 === t.movementX && 0 === t.movementY) || this.deactivate();
        }),
        (t.prototype.destroy = function () {
          this.destroyTouchHook(),
            (this.div = null),
            globalThis.document.removeEventListener(
              "mousemove",
              this._onMouseMove,
              !0
            ),
            globalThis.removeEventListener("keydown", this._onKeyDown),
            (this.pool = null),
            (this.children = null),
            (this.renderer = null);
        }),
        t
      );
    })();
  /*!
   * @pixi/ticker - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/ticker is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  (bt.TARGET_FPMS = 0.06),
    ((ni = t.UPDATE_PRIORITY || (t.UPDATE_PRIORITY = {}))[
      (ni.INTERACTION = 50)
    ] = "INTERACTION"),
    (ni[(ni.HIGH = 25)] = "HIGH"),
    (ni[(ni.NORMAL = 0)] = "NORMAL"),
    (ni[(ni.LOW = -25)] = "LOW"),
    (ni[(ni.UTILITY = -50)] = "UTILITY");
  var si = (function () {
      function t(t, e, r, i) {
        void 0 === e && (e = null),
          void 0 === r && (r = 0),
          void 0 === i && (i = !1),
          (this.next = null),
          (this.previous = null),
          (this._destroyed = !1),
          (this.fn = t),
          (this.context = e),
          (this.priority = r),
          (this.once = i);
      }
      return (
        (t.prototype.match = function (t, e) {
          return (
            void 0 === e && (e = null), this.fn === t && this.context === e
          );
        }),
        (t.prototype.emit = function (t) {
          this.fn &&
            (this.context ? this.fn.call(this.context, t) : this.fn(t));
          var e = this.next;
          return (
            this.once && this.destroy(!0),
            this._destroyed && (this.next = null),
            e
          );
        }),
        (t.prototype.connect = function (t) {
          (this.previous = t),
            t.next && (t.next.previous = this),
            (this.next = t.next),
            (t.next = this);
        }),
        (t.prototype.destroy = function (t) {
          void 0 === t && (t = !1),
            (this._destroyed = !0),
            (this.fn = null),
            (this.context = null),
            this.previous && (this.previous.next = this.next),
            this.next && (this.next.previous = this.previous);
          var e = this.next;
          return (this.next = t ? null : e), (this.previous = null), e;
        }),
        t
      );
    })(),
    ai = (function () {
      function e() {
        var t = this;
        (this.autoStart = !1),
          (this.deltaTime = 1),
          (this.lastTime = -1),
          (this.speed = 1),
          (this.started = !1),
          (this._requestId = null),
          (this._maxElapsedMS = 100),
          (this._minElapsedMS = 0),
          (this._protected = !1),
          (this._lastFrame = -1),
          (this._head = new si(null, null, 1 / 0)),
          (this.deltaMS = 1 / bt.TARGET_FPMS),
          (this.elapsedMS = 1 / bt.TARGET_FPMS),
          (this._tick = function (e) {
            (t._requestId = null),
              t.started &&
                (t.update(e),
                t.started &&
                  null === t._requestId &&
                  t._head.next &&
                  (t._requestId = requestAnimationFrame(t._tick)));
          });
      }
      return (
        (e.prototype._requestIfNeeded = function () {
          null === this._requestId &&
            this._head.next &&
            ((this.lastTime = performance.now()),
            (this._lastFrame = this.lastTime),
            (this._requestId = requestAnimationFrame(this._tick)));
        }),
        (e.prototype._cancelIfNeeded = function () {
          null !== this._requestId &&
            (cancelAnimationFrame(this._requestId), (this._requestId = null));
        }),
        (e.prototype._startIfPossible = function () {
          this.started
            ? this._requestIfNeeded()
            : this.autoStart && this.start();
        }),
        (e.prototype.add = function (e, r, i) {
          return (
            void 0 === i && (i = t.UPDATE_PRIORITY.NORMAL),
            this._addListener(new si(e, r, i))
          );
        }),
        (e.prototype.addOnce = function (e, r, i) {
          return (
            void 0 === i && (i = t.UPDATE_PRIORITY.NORMAL),
            this._addListener(new si(e, r, i, !0))
          );
        }),
        (e.prototype._addListener = function (t) {
          var e = this._head.next,
            r = this._head;
          if (e) {
            for (; e; ) {
              if (t.priority > e.priority) {
                t.connect(r);
                break;
              }
              (r = e), (e = e.next);
            }
            t.previous || t.connect(r);
          } else t.connect(r);
          return this._startIfPossible(), this;
        }),
        (e.prototype.remove = function (t, e) {
          for (var r = this._head.next; r; )
            r = r.match(t, e) ? r.destroy() : r.next;
          return this._head.next || this._cancelIfNeeded(), this;
        }),
        Object.defineProperty(e.prototype, "count", {
          get: function () {
            if (!this._head) return 0;
            for (var t = 0, e = this._head; (e = e.next); ) t++;
            return t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.start = function () {
          this.started || ((this.started = !0), this._requestIfNeeded());
        }),
        (e.prototype.stop = function () {
          this.started && ((this.started = !1), this._cancelIfNeeded());
        }),
        (e.prototype.destroy = function () {
          if (!this._protected) {
            this.stop();
            for (var t = this._head.next; t; ) t = t.destroy(!0);
            this._head.destroy(), (this._head = null);
          }
        }),
        (e.prototype.update = function (t) {
          var e;
          if ((void 0 === t && (t = performance.now()), t > this.lastTime)) {
            if (
              ((e = this.elapsedMS = t - this.lastTime) > this._maxElapsedMS &&
                (e = this._maxElapsedMS),
              (e *= this.speed),
              this._minElapsedMS)
            ) {
              var r = (t - this._lastFrame) | 0;
              if (r < this._minElapsedMS) return;
              this._lastFrame = t - (r % this._minElapsedMS);
            }
            (this.deltaMS = e),
              (this.deltaTime = this.deltaMS * bt.TARGET_FPMS);
            for (var i = this._head, n = i.next; n; )
              n = n.emit(this.deltaTime);
            i.next || this._cancelIfNeeded();
          } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
          this.lastTime = t;
        }),
        Object.defineProperty(e.prototype, "FPS", {
          get: function () {
            return 1e3 / this.elapsedMS;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "minFPS", {
          get: function () {
            return 1e3 / this._maxElapsedMS;
          },
          set: function (t) {
            var e = Math.min(this.maxFPS, t),
              r = Math.min(Math.max(0, e) / 1e3, bt.TARGET_FPMS);
            this._maxElapsedMS = 1 / r;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "maxFPS", {
          get: function () {
            return this._minElapsedMS
              ? Math.round(1e3 / this._minElapsedMS)
              : 0;
          },
          set: function (t) {
            if (0 === t) this._minElapsedMS = 0;
            else {
              var e = Math.max(this.minFPS, t);
              this._minElapsedMS = 1 / (e / 1e3);
            }
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "shared", {
          get: function () {
            if (!e._shared) {
              var t = (e._shared = new e());
              (t.autoStart = !0), (t._protected = !0);
            }
            return e._shared;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "system", {
          get: function () {
            if (!e._system) {
              var t = (e._system = new e());
              (t.autoStart = !0), (t._protected = !0);
            }
            return e._system;
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(),
    hi = (function () {
      function e() {}
      return (
        (e.init = function (e) {
          var r = this;
          (e = Object.assign({ autoStart: !0, sharedTicker: !1 }, e)),
            Object.defineProperty(this, "ticker", {
              set: function (e) {
                this._ticker && this._ticker.remove(this.render, this),
                  (this._ticker = e),
                  e && e.add(this.render, this, t.UPDATE_PRIORITY.LOW);
              },
              get: function () {
                return this._ticker;
              },
            }),
            (this.stop = function () {
              r._ticker.stop();
            }),
            (this.start = function () {
              r._ticker.start();
            }),
            (this._ticker = null),
            (this.ticker = e.sharedTicker ? ai.shared : new ai()),
            e.autoStart && this.start();
        }),
        (e.destroy = function () {
          if (this._ticker) {
            var t = this._ticker;
            (this.ticker = null), t.destroy();
          }
        }),
        e
      );
    })(),
    ui = (function () {
      function t() {
        (this.pressure = 0),
          (this.rotationAngle = 0),
          (this.twist = 0),
          (this.tangentialPressure = 0),
          (this.global = new fr()),
          (this.target = null),
          (this.originalEvent = null),
          (this.identifier = null),
          (this.isPrimary = !1),
          (this.button = 0),
          (this.buttons = 0),
          (this.width = 0),
          (this.height = 0),
          (this.tiltX = 0),
          (this.tiltY = 0),
          (this.pointerType = null),
          (this.pressure = 0),
          (this.rotationAngle = 0),
          (this.twist = 0),
          (this.tangentialPressure = 0);
      }
      return (
        Object.defineProperty(t.prototype, "pointerId", {
          get: function () {
            return this.identifier;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.getLocalPosition = function (t, e, r) {
          return t.worldTransform.applyInverse(r || this.global, e);
        }),
        (t.prototype.copyEvent = function (t) {
          "isPrimary" in t && t.isPrimary && (this.isPrimary = !0),
            (this.button = "button" in t && t.button);
          var e = "buttons" in t && t.buttons;
          (this.buttons = Number.isInteger(e) ? e : "which" in t && t.which),
            (this.width = "width" in t && t.width),
            (this.height = "height" in t && t.height),
            (this.tiltX = "tiltX" in t && t.tiltX),
            (this.tiltY = "tiltY" in t && t.tiltY),
            (this.pointerType = "pointerType" in t && t.pointerType),
            (this.pressure = "pressure" in t && t.pressure),
            (this.rotationAngle = "rotationAngle" in t && t.rotationAngle),
            (this.twist = ("twist" in t && t.twist) || 0),
            (this.tangentialPressure =
              ("tangentialPressure" in t && t.tangentialPressure) || 0);
        }),
        (t.prototype.reset = function () {
          this.isPrimary = !1;
        }),
        t
      );
    })(),
    li = function (t, e) {
      return (
        (li =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        li(t, e)
      );
    };
  var ci = (function () {
      function t() {
        (this.stopped = !1),
          (this.stopsPropagatingAt = null),
          (this.stopPropagationHint = !1),
          (this.target = null),
          (this.currentTarget = null),
          (this.type = null),
          (this.data = null);
      }
      return (
        (t.prototype.stopPropagation = function () {
          (this.stopped = !0),
            (this.stopPropagationHint = !0),
            (this.stopsPropagatingAt = this.currentTarget);
        }),
        (t.prototype.reset = function () {
          (this.stopped = !1),
            (this.stopsPropagatingAt = null),
            (this.stopPropagationHint = !1),
            (this.currentTarget = null),
            (this.target = null);
        }),
        t
      );
    })(),
    di = (function () {
      function t(e) {
        (this._pointerId = e), (this._flags = t.FLAGS.NONE);
      }
      return (
        (t.prototype._doSet = function (t, e) {
          this._flags = e ? this._flags | t : this._flags & ~t;
        }),
        Object.defineProperty(t.prototype, "pointerId", {
          get: function () {
            return this._pointerId;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "flags", {
          get: function () {
            return this._flags;
          },
          set: function (t) {
            this._flags = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "none", {
          get: function () {
            return this._flags === t.FLAGS.NONE;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "over", {
          get: function () {
            return 0 != (this._flags & t.FLAGS.OVER);
          },
          set: function (e) {
            this._doSet(t.FLAGS.OVER, e);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "rightDown", {
          get: function () {
            return 0 != (this._flags & t.FLAGS.RIGHT_DOWN);
          },
          set: function (e) {
            this._doSet(t.FLAGS.RIGHT_DOWN, e);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "leftDown", {
          get: function () {
            return 0 != (this._flags & t.FLAGS.LEFT_DOWN);
          },
          set: function (e) {
            this._doSet(t.FLAGS.LEFT_DOWN, e);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.FLAGS = Object.freeze({
          NONE: 0,
          OVER: 1,
          LEFT_DOWN: 2,
          RIGHT_DOWN: 4,
        })),
        t
      );
    })(),
    fi = (function () {
      function t() {
        this._tempPoint = new fr();
      }
      return (
        (t.prototype.recursiveFindHit = function (t, e, r, i, n) {
          if (!e || !e.visible) return !1;
          var o = t.data.global,
            s = !1,
            a = (n = e.interactive || n),
            h = !0;
          if (
            (e.hitArea
              ? (i &&
                  (e.worldTransform.applyInverse(o, this._tempPoint),
                  e.hitArea.contains(this._tempPoint.x, this._tempPoint.y)
                    ? (s = !0)
                    : ((i = !1), (h = !1))),
                (a = !1))
              : e._mask &&
                i &&
                ((e._mask.containsPoint && e._mask.containsPoint(o)) ||
                  (i = !1)),
            h && e.interactiveChildren && e.children)
          )
            for (var u = e.children, l = u.length - 1; l >= 0; l--) {
              var c = u[l],
                d = this.recursiveFindHit(t, c, r, i, a);
              if (d) {
                if (!c.parent) continue;
                (a = !1), d && (t.target && (i = !1), (s = !0));
              }
            }
          return (
            n &&
              (i &&
                !t.target &&
                !e.hitArea &&
                e.containsPoint &&
                e.containsPoint(o) &&
                (s = !0),
              e.interactive &&
                (s && !t.target && (t.target = e), r && r(t, e, !!s))),
            s
          );
        }),
        (t.prototype.findHit = function (t, e, r, i) {
          this.recursiveFindHit(t, e, r, i, !1);
        }),
        t
      );
    })(),
    pi = {
      interactive: !1,
      interactiveChildren: !0,
      hitArea: null,
      get buttonMode() {
        return "pointer" === this.cursor;
      },
      set buttonMode(t) {
        t
          ? (this.cursor = "pointer")
          : "pointer" === this.cursor && (this.cursor = null);
      },
      cursor: null,
      get trackedPointers() {
        return (
          void 0 === this._trackedPointers && (this._trackedPointers = {}),
          this._trackedPointers
        );
      },
      _trackedPointers: void 0,
    };
  $r.mixin(pi);
  var _i = { target: null, data: { global: null } },
    vi = (function (e) {
      function r(t, r) {
        var i = e.call(this) || this;
        return (
          (r = r || {}),
          (i.renderer = t),
          (i.autoPreventDefault =
            void 0 === r.autoPreventDefault || r.autoPreventDefault),
          (i.interactionFrequency = r.interactionFrequency || 10),
          (i.mouse = new ui()),
          (i.mouse.identifier = 1),
          i.mouse.global.set(-999999),
          (i.activeInteractionData = {}),
          (i.activeInteractionData[1] = i.mouse),
          (i.interactionDataPool = []),
          (i.eventData = new ci()),
          (i.interactionDOMElement = null),
          (i.moveWhenInside = !1),
          (i.eventsAdded = !1),
          (i.tickerAdded = !1),
          (i.mouseOverRenderer = !("PointerEvent" in globalThis)),
          (i.supportsTouchEvents = "ontouchstart" in globalThis),
          (i.supportsPointerEvents = !!globalThis.PointerEvent),
          (i.onPointerUp = i.onPointerUp.bind(i)),
          (i.processPointerUp = i.processPointerUp.bind(i)),
          (i.onPointerCancel = i.onPointerCancel.bind(i)),
          (i.processPointerCancel = i.processPointerCancel.bind(i)),
          (i.onPointerDown = i.onPointerDown.bind(i)),
          (i.processPointerDown = i.processPointerDown.bind(i)),
          (i.onPointerMove = i.onPointerMove.bind(i)),
          (i.processPointerMove = i.processPointerMove.bind(i)),
          (i.onPointerOut = i.onPointerOut.bind(i)),
          (i.processPointerOverOut = i.processPointerOverOut.bind(i)),
          (i.onPointerOver = i.onPointerOver.bind(i)),
          (i.cursorStyles = { default: "inherit", pointer: "pointer" }),
          (i.currentCursorMode = null),
          (i.cursor = null),
          (i.resolution = 1),
          (i.delayedEvents = []),
          (i.search = new fi()),
          (i._tempDisplayObject = new ti()),
          (i._eventListenerOptions = { capture: !0, passive: !1 }),
          (i._useSystemTicker =
            void 0 === r.useSystemTicker || r.useSystemTicker),
          i.setTargetElement(i.renderer.view, i.renderer.resolution),
          i
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          li(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(r, e),
        Object.defineProperty(r.prototype, "useSystemTicker", {
          get: function () {
            return this._useSystemTicker;
          },
          set: function (t) {
            (this._useSystemTicker = t),
              t ? this.addTickerListener() : this.removeTickerListener();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "lastObjectRendered", {
          get: function () {
            return this.renderer._lastObjectRendered || this._tempDisplayObject;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.hitTest = function (t, e) {
          return (
            (_i.target = null),
            (_i.data.global = t),
            e || (e = this.lastObjectRendered),
            this.processInteractive(_i, e, null, !0),
            _i.target
          );
        }),
        (r.prototype.setTargetElement = function (t, e) {
          void 0 === e && (e = 1),
            this.removeTickerListener(),
            this.removeEvents(),
            (this.interactionDOMElement = t),
            (this.resolution = e),
            this.addEvents(),
            this.addTickerListener();
        }),
        (r.prototype.addTickerListener = function () {
          !this.tickerAdded &&
            this.interactionDOMElement &&
            this._useSystemTicker &&
            (ai.system.add(
              this.tickerUpdate,
              this,
              t.UPDATE_PRIORITY.INTERACTION
            ),
            (this.tickerAdded = !0));
        }),
        (r.prototype.removeTickerListener = function () {
          this.tickerAdded &&
            (ai.system.remove(this.tickerUpdate, this),
            (this.tickerAdded = !1));
        }),
        (r.prototype.addEvents = function () {
          if (!this.eventsAdded && this.interactionDOMElement) {
            var t = this.interactionDOMElement.style;
            globalThis.navigator.msPointerEnabled
              ? ((t.msContentZooming = "none"), (t.msTouchAction = "none"))
              : this.supportsPointerEvents && (t.touchAction = "none"),
              this.supportsPointerEvents
                ? (globalThis.document.addEventListener(
                    "pointermove",
                    this.onPointerMove,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.addEventListener(
                    "pointerdown",
                    this.onPointerDown,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.addEventListener(
                    "pointerleave",
                    this.onPointerOut,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.addEventListener(
                    "pointerover",
                    this.onPointerOver,
                    this._eventListenerOptions
                  ),
                  globalThis.addEventListener(
                    "pointercancel",
                    this.onPointerCancel,
                    this._eventListenerOptions
                  ),
                  globalThis.addEventListener(
                    "pointerup",
                    this.onPointerUp,
                    this._eventListenerOptions
                  ))
                : (globalThis.document.addEventListener(
                    "mousemove",
                    this.onPointerMove,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.addEventListener(
                    "mousedown",
                    this.onPointerDown,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.addEventListener(
                    "mouseout",
                    this.onPointerOut,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.addEventListener(
                    "mouseover",
                    this.onPointerOver,
                    this._eventListenerOptions
                  ),
                  globalThis.addEventListener(
                    "mouseup",
                    this.onPointerUp,
                    this._eventListenerOptions
                  )),
              this.supportsTouchEvents &&
                (this.interactionDOMElement.addEventListener(
                  "touchstart",
                  this.onPointerDown,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "touchcancel",
                  this.onPointerCancel,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "touchend",
                  this.onPointerUp,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.addEventListener(
                  "touchmove",
                  this.onPointerMove,
                  this._eventListenerOptions
                )),
              (this.eventsAdded = !0);
          }
        }),
        (r.prototype.removeEvents = function () {
          if (this.eventsAdded && this.interactionDOMElement) {
            var t = this.interactionDOMElement.style;
            globalThis.navigator.msPointerEnabled
              ? ((t.msContentZooming = ""), (t.msTouchAction = ""))
              : this.supportsPointerEvents && (t.touchAction = ""),
              this.supportsPointerEvents
                ? (globalThis.document.removeEventListener(
                    "pointermove",
                    this.onPointerMove,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.removeEventListener(
                    "pointerdown",
                    this.onPointerDown,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.removeEventListener(
                    "pointerleave",
                    this.onPointerOut,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.removeEventListener(
                    "pointerover",
                    this.onPointerOver,
                    this._eventListenerOptions
                  ),
                  globalThis.removeEventListener(
                    "pointercancel",
                    this.onPointerCancel,
                    this._eventListenerOptions
                  ),
                  globalThis.removeEventListener(
                    "pointerup",
                    this.onPointerUp,
                    this._eventListenerOptions
                  ))
                : (globalThis.document.removeEventListener(
                    "mousemove",
                    this.onPointerMove,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.removeEventListener(
                    "mousedown",
                    this.onPointerDown,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.removeEventListener(
                    "mouseout",
                    this.onPointerOut,
                    this._eventListenerOptions
                  ),
                  this.interactionDOMElement.removeEventListener(
                    "mouseover",
                    this.onPointerOver,
                    this._eventListenerOptions
                  ),
                  globalThis.removeEventListener(
                    "mouseup",
                    this.onPointerUp,
                    this._eventListenerOptions
                  )),
              this.supportsTouchEvents &&
                (this.interactionDOMElement.removeEventListener(
                  "touchstart",
                  this.onPointerDown,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "touchcancel",
                  this.onPointerCancel,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "touchend",
                  this.onPointerUp,
                  this._eventListenerOptions
                ),
                this.interactionDOMElement.removeEventListener(
                  "touchmove",
                  this.onPointerMove,
                  this._eventListenerOptions
                )),
              (this.interactionDOMElement = null),
              (this.eventsAdded = !1);
          }
        }),
        (r.prototype.tickerUpdate = function (t) {
          (this._deltaTime += t),
            this._deltaTime < this.interactionFrequency ||
              ((this._deltaTime = 0), this.update());
        }),
        (r.prototype.update = function () {
          if (this.interactionDOMElement)
            if (this._didMove) this._didMove = !1;
            else {
              for (var t in ((this.cursor = null), this.activeInteractionData))
                if (this.activeInteractionData.hasOwnProperty(t)) {
                  var e = this.activeInteractionData[t];
                  if (e.originalEvent && "touch" !== e.pointerType) {
                    var r = this.configureInteractionEventForDOMEvent(
                      this.eventData,
                      e.originalEvent,
                      e
                    );
                    this.processInteractive(
                      r,
                      this.lastObjectRendered,
                      this.processPointerOverOut,
                      !0
                    );
                  }
                }
              this.setCursorMode(this.cursor);
            }
        }),
        (r.prototype.setCursorMode = function (t) {
          t = t || "default";
          var e = !0;
          if (
            (globalThis.OffscreenCanvas &&
              this.interactionDOMElement instanceof OffscreenCanvas &&
              (e = !1),
            this.currentCursorMode !== t)
          ) {
            this.currentCursorMode = t;
            var r = this.cursorStyles[t];
            if (r)
              switch (typeof r) {
                case "string":
                  e && (this.interactionDOMElement.style.cursor = r);
                  break;
                case "function":
                  r(t);
                  break;
                case "object":
                  e && Object.assign(this.interactionDOMElement.style, r);
              }
            else
              e &&
                "string" == typeof t &&
                !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) &&
                (this.interactionDOMElement.style.cursor = t);
          }
        }),
        (r.prototype.dispatchEvent = function (t, e, r) {
          (r.stopPropagationHint && t !== r.stopsPropagatingAt) ||
            ((r.currentTarget = t),
            (r.type = e),
            t.emit(e, r),
            t[e] && t[e](r));
        }),
        (r.prototype.delayDispatchEvent = function (t, e, r) {
          this.delayedEvents.push({
            displayObject: t,
            eventString: e,
            eventData: r,
          });
        }),
        (r.prototype.mapPositionToPoint = function (t, e, r) {
          var i;
          i = this.interactionDOMElement.parentElement
            ? this.interactionDOMElement.getBoundingClientRect()
            : {
                x: 0,
                y: 0,
                width: this.interactionDOMElement.width,
                height: this.interactionDOMElement.height,
                left: 0,
                top: 0,
              };
          var n = 1 / this.resolution;
          (t.x =
            (e - i.left) * (this.interactionDOMElement.width / i.width) * n),
            (t.y =
              (r - i.top) * (this.interactionDOMElement.height / i.height) * n);
        }),
        (r.prototype.processInteractive = function (t, e, r, i) {
          var n = this.search.findHit(t, e, r, i),
            o = this.delayedEvents;
          if (!o.length) return n;
          t.stopPropagationHint = !1;
          var s = o.length;
          this.delayedEvents = [];
          for (var a = 0; a < s; a++) {
            var h = o[a],
              u = h.displayObject,
              l = h.eventString,
              c = h.eventData;
            c.stopsPropagatingAt === u && (c.stopPropagationHint = !0),
              this.dispatchEvent(u, l, c);
          }
          return n;
        }),
        (r.prototype.onPointerDown = function (t) {
          if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
            var e = this.normalizeToPointerData(t);
            if (this.autoPreventDefault && e[0].isNormalized)
              (t.cancelable || !("cancelable" in t)) && t.preventDefault();
            for (var r = e.length, i = 0; i < r; i++) {
              var n = e[i],
                o = this.getInteractionDataForPointerId(n),
                s = this.configureInteractionEventForDOMEvent(
                  this.eventData,
                  n,
                  o
                );
              if (
                ((s.data.originalEvent = t),
                this.processInteractive(
                  s,
                  this.lastObjectRendered,
                  this.processPointerDown,
                  !0
                ),
                this.emit("pointerdown", s),
                "touch" === n.pointerType)
              )
                this.emit("touchstart", s);
              else if ("mouse" === n.pointerType || "pen" === n.pointerType) {
                var a = 2 === n.button;
                this.emit(a ? "rightdown" : "mousedown", this.eventData);
              }
            }
          }
        }),
        (r.prototype.processPointerDown = function (t, e, r) {
          var i = t.data,
            n = t.data.identifier;
          if (r)
            if (
              (e.trackedPointers[n] || (e.trackedPointers[n] = new di(n)),
              this.dispatchEvent(e, "pointerdown", t),
              "touch" === i.pointerType)
            )
              this.dispatchEvent(e, "touchstart", t);
            else if ("mouse" === i.pointerType || "pen" === i.pointerType) {
              var o = 2 === i.button;
              o
                ? (e.trackedPointers[n].rightDown = !0)
                : (e.trackedPointers[n].leftDown = !0),
                this.dispatchEvent(e, o ? "rightdown" : "mousedown", t);
            }
        }),
        (r.prototype.onPointerComplete = function (t, e, r) {
          for (
            var i = this.normalizeToPointerData(t),
              n = i.length,
              o = t.target !== this.interactionDOMElement ? "outside" : "",
              s = 0;
            s < n;
            s++
          ) {
            var a = i[s],
              h = this.getInteractionDataForPointerId(a),
              u = this.configureInteractionEventForDOMEvent(
                this.eventData,
                a,
                h
              );
            if (
              ((u.data.originalEvent = t),
              this.processInteractive(u, this.lastObjectRendered, r, e || !o),
              this.emit(e ? "pointercancel" : "pointerup" + o, u),
              "mouse" === a.pointerType || "pen" === a.pointerType)
            ) {
              var l = 2 === a.button;
              this.emit(l ? "rightup" + o : "mouseup" + o, u);
            } else
              "touch" === a.pointerType &&
                (this.emit(e ? "touchcancel" : "touchend" + o, u),
                this.releaseInteractionDataForPointerId(a.pointerId));
          }
        }),
        (r.prototype.onPointerCancel = function (t) {
          (this.supportsTouchEvents && "touch" === t.pointerType) ||
            this.onPointerComplete(t, !0, this.processPointerCancel);
        }),
        (r.prototype.processPointerCancel = function (t, e) {
          var r = t.data,
            i = t.data.identifier;
          void 0 !== e.trackedPointers[i] &&
            (delete e.trackedPointers[i],
            this.dispatchEvent(e, "pointercancel", t),
            "touch" === r.pointerType &&
              this.dispatchEvent(e, "touchcancel", t));
        }),
        (r.prototype.onPointerUp = function (t) {
          (this.supportsTouchEvents && "touch" === t.pointerType) ||
            this.onPointerComplete(t, !1, this.processPointerUp);
        }),
        (r.prototype.processPointerUp = function (t, e, r) {
          var i = t.data,
            n = t.data.identifier,
            o = e.trackedPointers[n],
            s = "touch" === i.pointerType,
            a = "mouse" === i.pointerType || "pen" === i.pointerType,
            h = !1;
          if (a) {
            var u = 2 === i.button,
              l = di.FLAGS,
              c = u ? l.RIGHT_DOWN : l.LEFT_DOWN,
              d = void 0 !== o && o.flags & c;
            r
              ? (this.dispatchEvent(e, u ? "rightup" : "mouseup", t),
                d &&
                  (this.dispatchEvent(e, u ? "rightclick" : "click", t),
                  (h = !0)))
              : d &&
                this.dispatchEvent(
                  e,
                  u ? "rightupoutside" : "mouseupoutside",
                  t
                ),
              o && (u ? (o.rightDown = !1) : (o.leftDown = !1));
          }
          r
            ? (this.dispatchEvent(e, "pointerup", t),
              s && this.dispatchEvent(e, "touchend", t),
              o &&
                ((a && !h) || this.dispatchEvent(e, "pointertap", t),
                s && (this.dispatchEvent(e, "tap", t), (o.over = !1))))
            : o &&
              (this.dispatchEvent(e, "pointerupoutside", t),
              s && this.dispatchEvent(e, "touchendoutside", t)),
            o && o.none && delete e.trackedPointers[n];
        }),
        (r.prototype.onPointerMove = function (t) {
          if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
            var e = this.normalizeToPointerData(t);
            ("mouse" !== e[0].pointerType && "pen" !== e[0].pointerType) ||
              ((this._didMove = !0), (this.cursor = null));
            for (var r = e.length, i = 0; i < r; i++) {
              var n = e[i],
                o = this.getInteractionDataForPointerId(n),
                s = this.configureInteractionEventForDOMEvent(
                  this.eventData,
                  n,
                  o
                );
              (s.data.originalEvent = t),
                this.processInteractive(
                  s,
                  this.lastObjectRendered,
                  this.processPointerMove,
                  !0
                ),
                this.emit("pointermove", s),
                "touch" === n.pointerType && this.emit("touchmove", s),
                ("mouse" !== n.pointerType && "pen" !== n.pointerType) ||
                  this.emit("mousemove", s);
            }
            "mouse" === e[0].pointerType && this.setCursorMode(this.cursor);
          }
        }),
        (r.prototype.processPointerMove = function (t, e, r) {
          var i = t.data,
            n = "touch" === i.pointerType,
            o = "mouse" === i.pointerType || "pen" === i.pointerType;
          o && this.processPointerOverOut(t, e, r),
            (this.moveWhenInside && !r) ||
              (this.dispatchEvent(e, "pointermove", t),
              n && this.dispatchEvent(e, "touchmove", t),
              o && this.dispatchEvent(e, "mousemove", t));
        }),
        (r.prototype.onPointerOut = function (t) {
          if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
            var e = this.normalizeToPointerData(t)[0];
            "mouse" === e.pointerType &&
              ((this.mouseOverRenderer = !1), this.setCursorMode(null));
            var r = this.getInteractionDataForPointerId(e),
              i = this.configureInteractionEventForDOMEvent(
                this.eventData,
                e,
                r
              );
            (i.data.originalEvent = e),
              this.processInteractive(
                i,
                this.lastObjectRendered,
                this.processPointerOverOut,
                !1
              ),
              this.emit("pointerout", i),
              "mouse" === e.pointerType || "pen" === e.pointerType
                ? this.emit("mouseout", i)
                : this.releaseInteractionDataForPointerId(r.identifier);
          }
        }),
        (r.prototype.processPointerOverOut = function (t, e, r) {
          var i = t.data,
            n = t.data.identifier,
            o = "mouse" === i.pointerType || "pen" === i.pointerType,
            s = e.trackedPointers[n];
          r && !s && (s = e.trackedPointers[n] = new di(n)),
            void 0 !== s &&
              (r && this.mouseOverRenderer
                ? (s.over ||
                    ((s.over = !0),
                    this.delayDispatchEvent(e, "pointerover", t),
                    o && this.delayDispatchEvent(e, "mouseover", t)),
                  o && null === this.cursor && (this.cursor = e.cursor))
                : s.over &&
                  ((s.over = !1),
                  this.dispatchEvent(e, "pointerout", this.eventData),
                  o && this.dispatchEvent(e, "mouseout", t),
                  s.none && delete e.trackedPointers[n]));
        }),
        (r.prototype.onPointerOver = function (t) {
          var e = this.normalizeToPointerData(t)[0],
            r = this.getInteractionDataForPointerId(e),
            i = this.configureInteractionEventForDOMEvent(this.eventData, e, r);
          (i.data.originalEvent = e),
            "mouse" === e.pointerType && (this.mouseOverRenderer = !0),
            this.emit("pointerover", i),
            ("mouse" !== e.pointerType && "pen" !== e.pointerType) ||
              this.emit("mouseover", i);
        }),
        (r.prototype.getInteractionDataForPointerId = function (t) {
          var e,
            r = t.pointerId;
          return (
            1 === r || "mouse" === t.pointerType
              ? (e = this.mouse)
              : this.activeInteractionData[r]
              ? (e = this.activeInteractionData[r])
              : (((e = this.interactionDataPool.pop() || new ui()).identifier =
                  r),
                (this.activeInteractionData[r] = e)),
            e.copyEvent(t),
            e
          );
        }),
        (r.prototype.releaseInteractionDataForPointerId = function (t) {
          var e = this.activeInteractionData[t];
          e &&
            (delete this.activeInteractionData[t],
            e.reset(),
            this.interactionDataPool.push(e));
        }),
        (r.prototype.configureInteractionEventForDOMEvent = function (t, e, r) {
          return (
            (t.data = r),
            this.mapPositionToPoint(r.global, e.clientX, e.clientY),
            "touch" === e.pointerType &&
              ((e.globalX = r.global.x), (e.globalY = r.global.y)),
            (r.originalEvent = e),
            t.reset(),
            t
          );
        }),
        (r.prototype.normalizeToPointerData = function (t) {
          var e = [];
          if (this.supportsTouchEvents && t instanceof TouchEvent)
            for (var r = 0, i = t.changedTouches.length; r < i; r++) {
              var n = t.changedTouches[r];
              void 0 === n.button && (n.button = t.touches.length ? 1 : 0),
                void 0 === n.buttons && (n.buttons = t.touches.length ? 1 : 0),
                void 0 === n.isPrimary &&
                  (n.isPrimary =
                    1 === t.touches.length && "touchstart" === t.type),
                void 0 === n.width && (n.width = n.radiusX || 1),
                void 0 === n.height && (n.height = n.radiusY || 1),
                void 0 === n.tiltX && (n.tiltX = 0),
                void 0 === n.tiltY && (n.tiltY = 0),
                void 0 === n.pointerType && (n.pointerType = "touch"),
                void 0 === n.pointerId && (n.pointerId = n.identifier || 0),
                void 0 === n.pressure && (n.pressure = n.force || 0.5),
                void 0 === n.twist && (n.twist = 0),
                void 0 === n.tangentialPressure && (n.tangentialPressure = 0),
                void 0 === n.layerX && (n.layerX = n.offsetX = n.clientX),
                void 0 === n.layerY && (n.layerY = n.offsetY = n.clientY),
                (n.isNormalized = !0),
                e.push(n);
            }
          else if (
            globalThis.MouseEvent &&
            (!(t instanceof MouseEvent) ||
              (this.supportsPointerEvents &&
                t instanceof globalThis.PointerEvent))
          )
            e.push(t);
          else {
            var o = t;
            void 0 === o.isPrimary && (o.isPrimary = !0),
              void 0 === o.width && (o.width = 1),
              void 0 === o.height && (o.height = 1),
              void 0 === o.tiltX && (o.tiltX = 0),
              void 0 === o.tiltY && (o.tiltY = 0),
              void 0 === o.pointerType && (o.pointerType = "mouse"),
              void 0 === o.pointerId && (o.pointerId = 1),
              void 0 === o.pressure && (o.pressure = 0.5),
              void 0 === o.twist && (o.twist = 0),
              void 0 === o.tangentialPressure && (o.tangentialPressure = 0),
              (o.isNormalized = !0),
              e.push(o);
          }
          return e;
        }),
        (r.prototype.destroy = function () {
          this.removeEvents(),
            this.removeTickerListener(),
            this.removeAllListeners(),
            (this.renderer = null),
            (this.mouse = null),
            (this.eventData = null),
            (this.interactionDOMElement = null),
            (this.onPointerDown = null),
            (this.processPointerDown = null),
            (this.onPointerUp = null),
            (this.processPointerUp = null),
            (this.onPointerCancel = null),
            (this.processPointerCancel = null),
            (this.onPointerMove = null),
            (this.processPointerMove = null),
            (this.onPointerOut = null),
            (this.processPointerOverOut = null),
            (this.onPointerOver = null),
            (this.search = null);
        }),
        r
      );
    })(xt),
    mi = (function () {
      function t(t) {
        (this.items = []), (this._name = t), (this._aliasCount = 0);
      }
      return (
        (t.prototype.emit = function (t, e, r, i, n, o, s, a) {
          if (arguments.length > 8) throw new Error("max arguments reached");
          var h = this,
            u = h.name,
            l = h.items;
          this._aliasCount++;
          for (var c = 0, d = l.length; c < d; c++)
            l[c][u](t, e, r, i, n, o, s, a);
          return l === this.items && this._aliasCount--, this;
        }),
        (t.prototype.ensureNonAliasedItems = function () {
          this._aliasCount > 0 &&
            this.items.length > 1 &&
            ((this._aliasCount = 0), (this.items = this.items.slice(0)));
        }),
        (t.prototype.add = function (t) {
          return (
            t[this._name] &&
              (this.ensureNonAliasedItems(),
              this.remove(t),
              this.items.push(t)),
            this
          );
        }),
        (t.prototype.remove = function (t) {
          var e = this.items.indexOf(t);
          return (
            -1 !== e && (this.ensureNonAliasedItems(), this.items.splice(e, 1)),
            this
          );
        }),
        (t.prototype.contains = function (t) {
          return -1 !== this.items.indexOf(t);
        }),
        (t.prototype.removeAll = function () {
          return this.ensureNonAliasedItems(), (this.items.length = 0), this;
        }),
        (t.prototype.destroy = function () {
          this.removeAll(), (this.items = null), (this._name = null);
        }),
        Object.defineProperty(t.prototype, "empty", {
          get: function () {
            return 0 === this.items.length;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return this._name;
          },
          enumerable: !1,
          configurable: !0,
        }),
        t
      );
    })();
  Object.defineProperties(mi.prototype, {
    dispatch: { value: mi.prototype.emit },
    run: { value: mi.prototype.emit },
  }),
    /*!
     * @pixi/core - v6.3.0
     * Compiled Wed, 23 Mar 2022 18:58:56 UTC
     *
     * @pixi/core is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    (bt.PREFER_ENV = gt.any ? t.ENV.WEBGL : t.ENV.WEBGL2),
    (bt.STRICT_TEXTURE_CACHE = !1);
  var Ei = [];
  function Ti(t, e) {
    if (!t) return null;
    var r = "";
    if ("string" == typeof t) {
      var i = /\.(\w{3,4})(?:$|\?|#)/i.exec(t);
      i && (r = i[1].toLowerCase());
    }
    for (var n = Ei.length - 1; n >= 0; --n) {
      var o = Ei[n];
      if (o.test && o.test(t, r)) return new o(t, e);
    }
    throw new Error("Unrecognized source type to auto-detect Resource");
  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */ var yi =
    function (t, e) {
      return (
        (yi =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        yi(t, e)
      );
    };
  function gi(t, e) {
    function r() {
      this.constructor = t;
    }
    yi(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var bi = function () {
    return (
      (bi =
        Object.assign ||
        function (t) {
          for (var e, r = arguments, i = 1, n = arguments.length; i < n; i++)
            for (var o in (e = r[i]))
              Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          return t;
        }),
      bi.apply(this, arguments)
    );
  };
  var Ri = (function () {
      function t(t, e) {
        void 0 === t && (t = 0),
          void 0 === e && (e = 0),
          (this._width = t),
          (this._height = e),
          (this.destroyed = !1),
          (this.internal = !1),
          (this.onResize = new mi("setRealSize")),
          (this.onUpdate = new mi("update")),
          (this.onError = new mi("onError"));
      }
      return (
        (t.prototype.bind = function (t) {
          this.onResize.add(t),
            this.onUpdate.add(t),
            this.onError.add(t),
            (this._width || this._height) &&
              this.onResize.emit(this._width, this._height);
        }),
        (t.prototype.unbind = function (t) {
          this.onResize.remove(t),
            this.onUpdate.remove(t),
            this.onError.remove(t);
        }),
        (t.prototype.resize = function (t, e) {
          (t === this._width && e === this._height) ||
            ((this._width = t), (this._height = e), this.onResize.emit(t, e));
        }),
        Object.defineProperty(t.prototype, "valid", {
          get: function () {
            return !!this._width && !!this._height;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.update = function () {
          this.destroyed || this.onUpdate.emit();
        }),
        (t.prototype.load = function () {
          return Promise.resolve(this);
        }),
        Object.defineProperty(t.prototype, "width", {
          get: function () {
            return this._width;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "height", {
          get: function () {
            return this._height;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.style = function (t, e, r) {
          return !1;
        }),
        (t.prototype.dispose = function () {}),
        (t.prototype.destroy = function () {
          this.destroyed ||
            ((this.destroyed = !0),
            this.dispose(),
            this.onError.removeAll(),
            (this.onError = null),
            this.onResize.removeAll(),
            (this.onResize = null),
            this.onUpdate.removeAll(),
            (this.onUpdate = null));
        }),
        (t.test = function (t, e) {
          return !1;
        }),
        t
      );
    })(),
    Ai = (function (e) {
      function r(t, r) {
        var i = this,
          n = r || {},
          o = n.width,
          s = n.height;
        if (!o || !s) throw new Error("BufferResource width or height invalid");
        return ((i = e.call(this, o, s) || this).data = t), i;
      }
      return (
        gi(r, e),
        (r.prototype.upload = function (e, r, i) {
          var n = e.gl;
          n.pixelStorei(
            n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            r.alphaMode === t.ALPHA_MODES.UNPACK
          );
          var o = r.realWidth,
            s = r.realHeight;
          return (
            i.width === o && i.height === s
              ? n.texSubImage2D(
                  r.target,
                  0,
                  0,
                  0,
                  o,
                  s,
                  r.format,
                  i.type,
                  this.data
                )
              : ((i.width = o),
                (i.height = s),
                n.texImage2D(
                  r.target,
                  0,
                  i.internalFormat,
                  o,
                  s,
                  0,
                  r.format,
                  i.type,
                  this.data
                )),
            !0
          );
        }),
        (r.prototype.dispose = function () {
          this.data = null;
        }),
        (r.test = function (t) {
          return (
            t instanceof Float32Array ||
            t instanceof Uint8Array ||
            t instanceof Uint32Array
          );
        }),
        r
      );
    })(Ri),
    xi = {
      scaleMode: t.SCALE_MODES.NEAREST,
      format: t.FORMATS.RGBA,
      alphaMode: t.ALPHA_MODES.NPM,
    },
    Si = (function (e) {
      function r(r, i) {
        void 0 === r && (r = null), void 0 === i && (i = null);
        var n = e.call(this) || this,
          o = (i = i || {}).alphaMode,
          s = i.mipmap,
          a = i.anisotropicLevel,
          h = i.scaleMode,
          u = i.width,
          l = i.height,
          c = i.wrapMode,
          d = i.format,
          f = i.type,
          p = i.target,
          _ = i.resolution,
          v = i.resourceOptions;
        return (
          !r || r instanceof Ri || ((r = Ti(r, v)).internal = !0),
          (n.resolution = _ || bt.RESOLUTION),
          (n.width = Math.round((u || 0) * n.resolution) / n.resolution),
          (n.height = Math.round((l || 0) * n.resolution) / n.resolution),
          (n._mipmap = void 0 !== s ? s : bt.MIPMAP_TEXTURES),
          (n.anisotropicLevel = void 0 !== a ? a : bt.ANISOTROPIC_LEVEL),
          (n._wrapMode = c || bt.WRAP_MODE),
          (n._scaleMode = void 0 !== h ? h : bt.SCALE_MODE),
          (n.format = d || t.FORMATS.RGBA),
          (n.type = f || t.TYPES.UNSIGNED_BYTE),
          (n.target = p || t.TARGETS.TEXTURE_2D),
          (n.alphaMode = void 0 !== o ? o : t.ALPHA_MODES.UNPACK),
          (n.uid = Ze()),
          (n.touched = 0),
          (n.isPowerOfTwo = !1),
          n._refreshPOT(),
          (n._glTextures = {}),
          (n.dirtyId = 0),
          (n.dirtyStyleId = 0),
          (n.cacheId = null),
          (n.valid = u > 0 && l > 0),
          (n.textureCacheIds = []),
          (n.destroyed = !1),
          (n.resource = null),
          (n._batchEnabled = 0),
          (n._batchLocation = 0),
          (n.parentTextureArray = null),
          n.setResource(r),
          n
        );
      }
      return (
        gi(r, e),
        Object.defineProperty(r.prototype, "realWidth", {
          get: function () {
            return Math.round(this.width * this.resolution);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "realHeight", {
          get: function () {
            return Math.round(this.height * this.resolution);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "mipmap", {
          get: function () {
            return this._mipmap;
          },
          set: function (t) {
            this._mipmap !== t && ((this._mipmap = t), this.dirtyStyleId++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "scaleMode", {
          get: function () {
            return this._scaleMode;
          },
          set: function (t) {
            this._scaleMode !== t &&
              ((this._scaleMode = t), this.dirtyStyleId++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "wrapMode", {
          get: function () {
            return this._wrapMode;
          },
          set: function (t) {
            this._wrapMode !== t && ((this._wrapMode = t), this.dirtyStyleId++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.setStyle = function (t, e) {
          var r;
          return (
            void 0 !== t &&
              t !== this.scaleMode &&
              ((this.scaleMode = t), (r = !0)),
            void 0 !== e && e !== this.mipmap && ((this.mipmap = e), (r = !0)),
            r && this.dirtyStyleId++,
            this
          );
        }),
        (r.prototype.setSize = function (t, e, r) {
          return (r = r || this.resolution), this.setRealSize(t * r, e * r, r);
        }),
        (r.prototype.setRealSize = function (t, e, r) {
          return (
            (this.resolution = r || this.resolution),
            (this.width = Math.round(t) / this.resolution),
            (this.height = Math.round(e) / this.resolution),
            this._refreshPOT(),
            this.update(),
            this
          );
        }),
        (r.prototype._refreshPOT = function () {
          this.isPowerOfTwo = Ve(this.realWidth) && Ve(this.realHeight);
        }),
        (r.prototype.setResolution = function (t) {
          var e = this.resolution;
          return (
            e === t ||
              ((this.resolution = t),
              this.valid &&
                ((this.width = Math.round(this.width * e) / t),
                (this.height = Math.round(this.height * e) / t),
                this.emit("update", this)),
              this._refreshPOT()),
            this
          );
        }),
        (r.prototype.setResource = function (t) {
          if (this.resource === t) return this;
          if (this.resource) throw new Error("Resource can be set only once");
          return t.bind(this), (this.resource = t), this;
        }),
        (r.prototype.update = function () {
          this.valid
            ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this))
            : this.width > 0 &&
              this.height > 0 &&
              ((this.valid = !0),
              this.emit("loaded", this),
              this.emit("update", this));
        }),
        (r.prototype.onError = function (t) {
          this.emit("error", this, t);
        }),
        (r.prototype.destroy = function () {
          this.resource &&
            (this.resource.unbind(this),
            this.resource.internal && this.resource.destroy(),
            (this.resource = null)),
            this.cacheId &&
              (delete er[this.cacheId],
              delete tr[this.cacheId],
              (this.cacheId = null)),
            this.dispose(),
            r.removeFromCache(this),
            (this.textureCacheIds = null),
            (this.destroyed = !0);
        }),
        (r.prototype.dispose = function () {
          this.emit("dispose", this);
        }),
        (r.prototype.castToBaseTexture = function () {
          return this;
        }),
        (r.from = function (t, e, i) {
          void 0 === i && (i = bt.STRICT_TEXTURE_CACHE);
          var n = "string" == typeof t,
            o = null;
          if (n) o = t;
          else {
            if (!t._pixiId) {
              var s = (e && e.pixiIdPrefix) || "pixiid";
              t._pixiId = s + "_" + Ze();
            }
            o = t._pixiId;
          }
          var a = er[o];
          if (n && i && !a)
            throw new Error(
              'The cacheId "' + o + '" does not exist in BaseTextureCache.'
            );
          return a || (((a = new r(t, e)).cacheId = o), r.addToCache(a, o)), a;
        }),
        (r.fromBuffer = function (e, i, n, o) {
          e = e || new Float32Array(i * n * 4);
          var s = new Ai(e, { width: i, height: n }),
            a =
              e instanceof Float32Array ? t.TYPES.FLOAT : t.TYPES.UNSIGNED_BYTE;
          return new r(
            s,
            Object.assign(xi, o || { width: i, height: n, type: a })
          );
        }),
        (r.addToCache = function (t, e) {
          e &&
            (-1 === t.textureCacheIds.indexOf(e) && t.textureCacheIds.push(e),
            er[e] &&
              console.warn(
                "BaseTexture added to the cache with an id [" +
                  e +
                  "] that already had an entry"
              ),
            (er[e] = t));
        }),
        (r.removeFromCache = function (t) {
          if ("string" == typeof t) {
            var e = er[t];
            if (e) {
              var r = e.textureCacheIds.indexOf(t);
              return r > -1 && e.textureCacheIds.splice(r, 1), delete er[t], e;
            }
          } else if (t && t.textureCacheIds) {
            for (var i = 0; i < t.textureCacheIds.length; ++i)
              delete er[t.textureCacheIds[i]];
            return (t.textureCacheIds.length = 0), t;
          }
          return null;
        }),
        (r._globalBatch = 0),
        r
      );
    })(xt),
    Oi = (function (t) {
      function e(e, r) {
        var i = this,
          n = r || {},
          o = n.width,
          s = n.height;
        ((i = t.call(this, o, s) || this).items = []), (i.itemDirtyIds = []);
        for (var a = 0; a < e; a++) {
          var h = new Si();
          i.items.push(h), i.itemDirtyIds.push(-2);
        }
        return (i.length = e), (i._load = null), (i.baseTexture = null), i;
      }
      return (
        gi(e, t),
        (e.prototype.initFromArray = function (t, e) {
          for (var r = 0; r < this.length; r++)
            t[r] &&
              (t[r].castToBaseTexture
                ? this.addBaseTextureAt(t[r].castToBaseTexture(), r)
                : t[r] instanceof Ri
                ? this.addResourceAt(t[r], r)
                : this.addResourceAt(Ti(t[r], e), r));
        }),
        (e.prototype.dispose = function () {
          for (var t = 0, e = this.length; t < e; t++) this.items[t].destroy();
          (this.items = null), (this.itemDirtyIds = null), (this._load = null);
        }),
        (e.prototype.addResourceAt = function (t, e) {
          if (!this.items[e])
            throw new Error("Index " + e + " is out of bounds");
          return (
            t.valid && !this.valid && this.resize(t.width, t.height),
            this.items[e].setResource(t),
            this
          );
        }),
        (e.prototype.bind = function (e) {
          if (null !== this.baseTexture)
            throw new Error(
              "Only one base texture per TextureArray is allowed"
            );
          t.prototype.bind.call(this, e);
          for (var r = 0; r < this.length; r++)
            (this.items[r].parentTextureArray = e),
              this.items[r].on("update", e.update, e);
        }),
        (e.prototype.unbind = function (e) {
          t.prototype.unbind.call(this, e);
          for (var r = 0; r < this.length; r++)
            (this.items[r].parentTextureArray = null),
              this.items[r].off("update", e.update, e);
        }),
        (e.prototype.load = function () {
          var t = this;
          if (this._load) return this._load;
          var e = this.items
            .map(function (t) {
              return t.resource;
            })
            .filter(function (t) {
              return t;
            })
            .map(function (t) {
              return t.load();
            });
          return (
            (this._load = Promise.all(e).then(function () {
              var e = t.items[0],
                r = e.realWidth,
                i = e.realHeight;
              return t.resize(r, i), Promise.resolve(t);
            })),
            this._load
          );
        }),
        e
      );
    })(Ri),
    Ii = (function (e) {
      function r(t, r) {
        var i,
          n,
          o = this,
          s = r || {},
          a = s.width,
          h = s.height;
        return (
          Array.isArray(t) ? ((i = t), (n = t.length)) : (n = t),
          (o = e.call(this, n, { width: a, height: h }) || this),
          i && o.initFromArray(i, r),
          o
        );
      }
      return (
        gi(r, e),
        (r.prototype.addBaseTextureAt = function (t, e) {
          if (!t.resource)
            throw new Error("ArrayResource does not support RenderTexture");
          return this.addResourceAt(t.resource, e), this;
        }),
        (r.prototype.bind = function (r) {
          e.prototype.bind.call(this, r),
            (r.target = t.TARGETS.TEXTURE_2D_ARRAY);
        }),
        (r.prototype.upload = function (t, e, r) {
          var i = this,
            n = i.length,
            o = i.itemDirtyIds,
            s = i.items,
            a = t.gl;
          r.dirtyId < 0 &&
            a.texImage3D(
              a.TEXTURE_2D_ARRAY,
              0,
              r.internalFormat,
              this._width,
              this._height,
              n,
              0,
              e.format,
              r.type,
              null
            );
          for (var h = 0; h < n; h++) {
            var u = s[h];
            o[h] < u.dirtyId &&
              ((o[h] = u.dirtyId),
              u.valid &&
                a.texSubImage3D(
                  a.TEXTURE_2D_ARRAY,
                  0,
                  0,
                  0,
                  h,
                  u.resource.width,
                  u.resource.height,
                  1,
                  e.format,
                  r.type,
                  u.resource.source
                ));
          }
          return !0;
        }),
        r
      );
    })(Oi),
    Pi = (function (e) {
      function r(t) {
        var r = this,
          i = t,
          n = i.naturalWidth || i.videoWidth || i.width,
          o = i.naturalHeight || i.videoHeight || i.height;
        return (
          ((r = e.call(this, n, o) || this).source = t), (r.noSubImage = !1), r
        );
      }
      return (
        gi(r, e),
        (r.crossOrigin = function (t, e, r) {
          void 0 === r && 0 !== e.indexOf("data:")
            ? (t.crossOrigin = sr(e))
            : !1 !== r &&
              (t.crossOrigin = "string" == typeof r ? r : "anonymous");
        }),
        (r.prototype.upload = function (e, r, i, n) {
          var o = e.gl,
            s = r.realWidth,
            a = r.realHeight;
          if ((n = n || this.source) instanceof HTMLImageElement) {
            if (!n.complete || 0 === n.naturalWidth) return !1;
          } else if (n instanceof HTMLVideoElement && n.readyState <= 1)
            return !1;
          return (
            o.pixelStorei(
              o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
              r.alphaMode === t.ALPHA_MODES.UNPACK
            ),
            this.noSubImage ||
            r.target !== o.TEXTURE_2D ||
            i.width !== s ||
            i.height !== a
              ? ((i.width = s),
                (i.height = a),
                o.texImage2D(
                  r.target,
                  0,
                  i.internalFormat,
                  r.format,
                  i.type,
                  n
                ))
              : o.texSubImage2D(o.TEXTURE_2D, 0, 0, 0, r.format, i.type, n),
            !0
          );
        }),
        (r.prototype.update = function () {
          if (!this.destroyed) {
            var t = this.source,
              r = t.naturalWidth || t.videoWidth || t.width,
              i = t.naturalHeight || t.videoHeight || t.height;
            this.resize(r, i), e.prototype.update.call(this);
          }
        }),
        (r.prototype.dispose = function () {
          this.source = null;
        }),
        r
      );
    })(Ri),
    Mi = (function (t) {
      function e(e) {
        return t.call(this, e) || this;
      }
      return (
        gi(e, t),
        (e.test = function (t) {
          var e = globalThis.OffscreenCanvas;
          return (
            !!(e && t instanceof e) ||
            (globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement)
          );
        }),
        e
      );
    })(Pi),
    Ni = (function (e) {
      function r(i, n) {
        var o = this,
          s = n || {},
          a = s.width,
          h = s.height,
          u = s.autoLoad,
          l = s.linkBaseTexture;
        if (i && i.length !== r.SIDES)
          throw new Error("Invalid length. Got " + i.length + ", expected 6");
        o = e.call(this, 6, { width: a, height: h }) || this;
        for (var c = 0; c < r.SIDES; c++)
          o.items[c].target = t.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + c;
        return (
          (o.linkBaseTexture = !1 !== l),
          i && o.initFromArray(i, n),
          !1 !== u && o.load(),
          o
        );
      }
      return (
        gi(r, e),
        (r.prototype.bind = function (r) {
          e.prototype.bind.call(this, r),
            (r.target = t.TARGETS.TEXTURE_CUBE_MAP);
        }),
        (r.prototype.addBaseTextureAt = function (e, r, i) {
          if ((void 0 === i && (i = this.linkBaseTexture), !this.items[r]))
            throw new Error("Index " + r + " is out of bounds");
          if (
            !this.linkBaseTexture ||
            e.parentTextureArray ||
            Object.keys(e._glTextures).length > 0
          ) {
            if (!e.resource)
              throw new Error(
                "CubeResource does not support copying of renderTexture."
              );
            this.addResourceAt(e.resource, r);
          } else
            (e.target = t.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + r),
              (e.parentTextureArray = this.baseTexture),
              (this.items[r] = e);
          return (
            e.valid && !this.valid && this.resize(e.realWidth, e.realHeight),
            (this.items[r] = e),
            this
          );
        }),
        (r.prototype.upload = function (t, e, i) {
          for (var n = this.itemDirtyIds, o = 0; o < r.SIDES; o++) {
            var s = this.items[o];
            n[o] < s.dirtyId &&
              (s.valid && s.resource
                ? (s.resource.upload(t, s, i), (n[o] = s.dirtyId))
                : n[o] < -1 &&
                  (t.gl.texImage2D(
                    s.target,
                    0,
                    i.internalFormat,
                    e.realWidth,
                    e.realHeight,
                    0,
                    e.format,
                    i.type,
                    null
                  ),
                  (n[o] = -1)));
          }
          return !0;
        }),
        (r.test = function (t) {
          return Array.isArray(t) && t.length === r.SIDES;
        }),
        (r.SIDES = 6),
        r
      );
    })(Oi),
    Di = (function (e) {
      function r(t, r) {
        var i = this;
        if (((r = r || {}), !(t instanceof HTMLImageElement))) {
          var n = new Image();
          Pi.crossOrigin(n, t, r.crossorigin), (n.src = t), (t = n);
        }
        return (
          (i = e.call(this, t) || this),
          !t.complete &&
            i._width &&
            i._height &&
            ((i._width = 0), (i._height = 0)),
          (i.url = t.src),
          (i._process = null),
          (i.preserveBitmap = !1),
          (i.createBitmap =
            (void 0 !== r.createBitmap
              ? r.createBitmap
              : bt.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap),
          (i.alphaMode = "number" == typeof r.alphaMode ? r.alphaMode : null),
          (i.bitmap = null),
          (i._load = null),
          !1 !== r.autoLoad && i.load(),
          i
        );
      }
      return (
        gi(r, e),
        (r.prototype.load = function (t) {
          var e = this;
          return (
            this._load ||
              (void 0 !== t && (this.createBitmap = t),
              (this._load = new Promise(function (t, r) {
                var i = e.source;
                e.url = i.src;
                var n = function () {
                  e.destroyed ||
                    ((i.onload = null),
                    (i.onerror = null),
                    e.resize(i.width, i.height),
                    (e._load = null),
                    e.createBitmap ? t(e.process()) : t(e));
                };
                i.complete && i.src
                  ? n()
                  : ((i.onload = n),
                    (i.onerror = function (t) {
                      r(t), e.onError.emit(t);
                    }));
              }))),
            this._load
          );
        }),
        (r.prototype.process = function () {
          var e = this,
            r = this.source;
          if (null !== this._process) return this._process;
          if (null !== this.bitmap || !globalThis.createImageBitmap)
            return Promise.resolve(this);
          var i = globalThis.createImageBitmap,
            n = !r.crossOrigin || "anonymous" === r.crossOrigin;
          return (
            (this._process = fetch(r.src, { mode: n ? "cors" : "no-cors" })
              .then(function (t) {
                return t.blob();
              })
              .then(function (n) {
                return i(n, 0, 0, r.width, r.height, {
                  premultiplyAlpha:
                    e.alphaMode === t.ALPHA_MODES.UNPACK
                      ? "premultiply"
                      : "none",
                });
              })
              .then(function (t) {
                return e.destroyed
                  ? Promise.reject()
                  : ((e.bitmap = t),
                    e.update(),
                    (e._process = null),
                    Promise.resolve(e));
              })),
            this._process
          );
        }),
        (r.prototype.upload = function (t, r, i) {
          if (
            ("number" == typeof this.alphaMode &&
              (r.alphaMode = this.alphaMode),
            !this.createBitmap)
          )
            return e.prototype.upload.call(this, t, r, i);
          if (!this.bitmap && (this.process(), !this.bitmap)) return !1;
          if (
            (e.prototype.upload.call(this, t, r, i, this.bitmap),
            !this.preserveBitmap)
          ) {
            var n = !0,
              o = r._glTextures;
            for (var s in o) {
              var a = o[s];
              if (a !== i && a.dirtyId !== r.dirtyId) {
                n = !1;
                break;
              }
            }
            n &&
              (this.bitmap.close && this.bitmap.close(), (this.bitmap = null));
          }
          return !0;
        }),
        (r.prototype.dispose = function () {
          (this.source.onload = null),
            (this.source.onerror = null),
            e.prototype.dispose.call(this),
            this.bitmap && (this.bitmap.close(), (this.bitmap = null)),
            (this._process = null),
            (this._load = null);
        }),
        (r.test = function (t) {
          return "string" == typeof t || t instanceof HTMLImageElement;
        }),
        r
      );
    })(Pi),
    Ci = (function (t) {
      function e(e, r) {
        var i = this;
        return (
          (r = r || {}),
          ((i =
            t.call(this, document.createElement("canvas")) || this)._width = 0),
          (i._height = 0),
          (i.svg = e),
          (i.scale = r.scale || 1),
          (i._overrideWidth = r.width),
          (i._overrideHeight = r.height),
          (i._resolve = null),
          (i._crossorigin = r.crossorigin),
          (i._load = null),
          !1 !== r.autoLoad && i.load(),
          i
        );
      }
      return (
        gi(e, t),
        (e.prototype.load = function () {
          var t = this;
          return (
            this._load ||
              (this._load = new Promise(function (r) {
                if (
                  ((t._resolve = function () {
                    t.resize(t.source.width, t.source.height), r(t);
                  }),
                  e.SVG_XML.test(t.svg.trim()))
                ) {
                  if (!btoa)
                    throw new Error(
                      "Your browser doesn't support base64 conversions."
                    );
                  t.svg =
                    "data:image/svg+xml;base64," +
                    btoa(unescape(encodeURIComponent(t.svg)));
                }
                t._loadSvg();
              })),
            this._load
          );
        }),
        (e.prototype._loadSvg = function () {
          var t = this,
            e = new Image();
          Pi.crossOrigin(e, this.svg, this._crossorigin),
            (e.src = this.svg),
            (e.onerror = function (r) {
              t._resolve && ((e.onerror = null), t.onError.emit(r));
            }),
            (e.onload = function () {
              if (t._resolve) {
                var r = e.width,
                  i = e.height;
                if (!r || !i)
                  throw new Error(
                    "The SVG image must have width and height defined (in pixels), canvas API needs them."
                  );
                var n = r * t.scale,
                  o = i * t.scale;
                (t._overrideWidth || t._overrideHeight) &&
                  ((n = t._overrideWidth || (t._overrideHeight / i) * r),
                  (o = t._overrideHeight || (t._overrideWidth / r) * i)),
                  (n = Math.round(n)),
                  (o = Math.round(o));
                var s = t.source;
                (s.width = n),
                  (s.height = o),
                  (s._pixiId = "canvas_" + Ze()),
                  s.getContext("2d").drawImage(e, 0, 0, r, i, 0, 0, n, o),
                  t._resolve(),
                  (t._resolve = null);
              }
            });
        }),
        (e.getSize = function (t) {
          var r = e.SVG_SIZE.exec(t),
            i = {};
          return (
            r &&
              ((i[r[1]] = Math.round(parseFloat(r[3]))),
              (i[r[5]] = Math.round(parseFloat(r[7])))),
            i
          );
        }),
        (e.prototype.dispose = function () {
          t.prototype.dispose.call(this),
            (this._resolve = null),
            (this._crossorigin = null);
        }),
        (e.test = function (t, r) {
          return (
            "svg" === r ||
            ("string" == typeof t &&
              /^data:image\/svg\+xml(;(charset=utf8|utf8))?;base64/.test(t)) ||
            ("string" == typeof t && e.SVG_XML.test(t))
          );
        }),
        (e.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m),
        (e.SVG_SIZE =
          /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i),
        e
      );
    })(Pi),
    wi = (function (t) {
      function e(r, i) {
        var n = this;
        if (((i = i || {}), !(r instanceof HTMLVideoElement))) {
          var o = document.createElement("video");
          o.setAttribute("preload", "auto"),
            o.setAttribute("webkit-playsinline", ""),
            o.setAttribute("playsinline", ""),
            "string" == typeof r && (r = [r]);
          var s = r[0].src || r[0];
          Pi.crossOrigin(o, s, i.crossorigin);
          for (var a = 0; a < r.length; ++a) {
            var h = document.createElement("source"),
              u = r[a],
              l = u.src,
              c = u.mime,
              d = (l = l || r[a]).split("?").shift().toLowerCase(),
              f = d.slice(d.lastIndexOf(".") + 1);
            (c = c || e.MIME_TYPES[f] || "video/" + f),
              (h.src = l),
              (h.type = c),
              o.appendChild(h);
          }
          r = o;
        }
        return (
          ((n = t.call(this, r) || this).noSubImage = !0),
          (n._autoUpdate = !0),
          (n._isConnectedToTicker = !1),
          (n._updateFPS = i.updateFPS || 0),
          (n._msToNextUpdate = 0),
          (n.autoPlay = !1 !== i.autoPlay),
          (n._load = null),
          (n._resolve = null),
          (n._onCanPlay = n._onCanPlay.bind(n)),
          (n._onError = n._onError.bind(n)),
          !1 !== i.autoLoad && n.load(),
          n
        );
      }
      return (
        gi(e, t),
        (e.prototype.update = function (e) {
          if (!this.destroyed) {
            var r = ai.shared.elapsedMS * this.source.playbackRate;
            (this._msToNextUpdate = Math.floor(this._msToNextUpdate - r)),
              (!this._updateFPS || this._msToNextUpdate <= 0) &&
                (t.prototype.update.call(this),
                (this._msToNextUpdate = this._updateFPS
                  ? Math.floor(1e3 / this._updateFPS)
                  : 0));
          }
        }),
        (e.prototype.load = function () {
          var t = this;
          if (this._load) return this._load;
          var e = this.source;
          return (
            (e.readyState === e.HAVE_ENOUGH_DATA ||
              e.readyState === e.HAVE_FUTURE_DATA) &&
              e.width &&
              e.height &&
              (e.complete = !0),
            e.addEventListener("play", this._onPlayStart.bind(this)),
            e.addEventListener("pause", this._onPlayStop.bind(this)),
            this._isSourceReady()
              ? this._onCanPlay()
              : (e.addEventListener("canplay", this._onCanPlay),
                e.addEventListener("canplaythrough", this._onCanPlay),
                e.addEventListener("error", this._onError, !0)),
            (this._load = new Promise(function (r) {
              t.valid ? r(t) : ((t._resolve = r), e.load());
            })),
            this._load
          );
        }),
        (e.prototype._onError = function (t) {
          this.source.removeEventListener("error", this._onError, !0),
            this.onError.emit(t);
        }),
        (e.prototype._isSourcePlaying = function () {
          var t = this.source;
          return (
            t.currentTime > 0 &&
            !1 === t.paused &&
            !1 === t.ended &&
            t.readyState > 2
          );
        }),
        (e.prototype._isSourceReady = function () {
          var t = this.source;
          return 3 === t.readyState || 4 === t.readyState;
        }),
        (e.prototype._onPlayStart = function () {
          this.valid || this._onCanPlay(),
            this.autoUpdate &&
              !this._isConnectedToTicker &&
              (ai.shared.add(this.update, this),
              (this._isConnectedToTicker = !0));
        }),
        (e.prototype._onPlayStop = function () {
          this._isConnectedToTicker &&
            (ai.shared.remove(this.update, this),
            (this._isConnectedToTicker = !1));
        }),
        (e.prototype._onCanPlay = function () {
          var t = this.source;
          t.removeEventListener("canplay", this._onCanPlay),
            t.removeEventListener("canplaythrough", this._onCanPlay);
          var e = this.valid;
          this.resize(t.videoWidth, t.videoHeight),
            !e &&
              this._resolve &&
              (this._resolve(this), (this._resolve = null)),
            this._isSourcePlaying()
              ? this._onPlayStart()
              : this.autoPlay && t.play();
        }),
        (e.prototype.dispose = function () {
          this._isConnectedToTicker &&
            (ai.shared.remove(this.update, this),
            (this._isConnectedToTicker = !1));
          var e = this.source;
          e &&
            (e.removeEventListener("error", this._onError, !0),
            e.pause(),
            (e.src = ""),
            e.load()),
            t.prototype.dispose.call(this);
        }),
        Object.defineProperty(e.prototype, "autoUpdate", {
          get: function () {
            return this._autoUpdate;
          },
          set: function (t) {
            t !== this._autoUpdate &&
              ((this._autoUpdate = t),
              !this._autoUpdate && this._isConnectedToTicker
                ? (ai.shared.remove(this.update, this),
                  (this._isConnectedToTicker = !1))
                : this._autoUpdate &&
                  !this._isConnectedToTicker &&
                  this._isSourcePlaying() &&
                  (ai.shared.add(this.update, this),
                  (this._isConnectedToTicker = !0)));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "updateFPS", {
          get: function () {
            return this._updateFPS;
          },
          set: function (t) {
            t !== this._updateFPS && (this._updateFPS = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.test = function (t, r) {
          return (
            (globalThis.HTMLVideoElement && t instanceof HTMLVideoElement) ||
            e.TYPES.indexOf(r) > -1
          );
        }),
        (e.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"]),
        (e.MIME_TYPES = {
          ogv: "video/ogg",
          mov: "video/quicktime",
          m4v: "video/mp4",
        }),
        e
      );
    })(Pi),
    Li = (function (t) {
      function e(e) {
        return t.call(this, e) || this;
      }
      return (
        gi(e, t),
        (e.test = function (t) {
          return !!globalThis.createImageBitmap && t instanceof ImageBitmap;
        }),
        e
      );
    })(Pi);
  Ei.push(Di, Li, Mi, wi, Ci, Ai, Ni, Ii);
  var Fi = {
      __proto__: null,
      Resource: Ri,
      BaseImageResource: Pi,
      INSTALLED: Ei,
      autoDetectResource: Ti,
      AbstractMultiResource: Oi,
      ArrayResource: Ii,
      BufferResource: Ai,
      CanvasResource: Mi,
      CubeResource: Ni,
      ImageResource: Di,
      SVGResource: Ci,
      VideoResource: wi,
      ImageBitmapResource: Li,
    },
    Ui = (function (e) {
      function r() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        gi(r, e),
        (r.prototype.upload = function (e, r, i) {
          var n = e.gl;
          n.pixelStorei(
            n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            r.alphaMode === t.ALPHA_MODES.UNPACK
          );
          var o = r.realWidth,
            s = r.realHeight;
          return (
            i.width === o && i.height === s
              ? n.texSubImage2D(
                  r.target,
                  0,
                  0,
                  0,
                  o,
                  s,
                  r.format,
                  i.type,
                  this.data
                )
              : ((i.width = o),
                (i.height = s),
                n.texImage2D(
                  r.target,
                  0,
                  i.internalFormat,
                  o,
                  s,
                  0,
                  r.format,
                  i.type,
                  this.data
                )),
            !0
          );
        }),
        r
      );
    })(Ai),
    Bi = (function () {
      function e(e, r) {
        (this.width = Math.round(e || 100)),
          (this.height = Math.round(r || 100)),
          (this.stencil = !1),
          (this.depth = !1),
          (this.dirtyId = 0),
          (this.dirtyFormat = 0),
          (this.dirtySize = 0),
          (this.depthTexture = null),
          (this.colorTextures = []),
          (this.glFramebuffers = {}),
          (this.disposeRunner = new mi("disposeFramebuffer")),
          (this.multisample = t.MSAA_QUALITY.NONE);
      }
      return (
        Object.defineProperty(e.prototype, "colorTexture", {
          get: function () {
            return this.colorTextures[0];
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.addColorTexture = function (e, r) {
          return (
            void 0 === e && (e = 0),
            (this.colorTextures[e] =
              r ||
              new Si(null, {
                scaleMode: t.SCALE_MODES.NEAREST,
                resolution: 1,
                mipmap: t.MIPMAP_MODES.OFF,
                width: this.width,
                height: this.height,
              })),
            this.dirtyId++,
            this.dirtyFormat++,
            this
          );
        }),
        (e.prototype.addDepthTexture = function (e) {
          return (
            (this.depthTexture =
              e ||
              new Si(new Ui(null, { width: this.width, height: this.height }), {
                scaleMode: t.SCALE_MODES.NEAREST,
                resolution: 1,
                width: this.width,
                height: this.height,
                mipmap: t.MIPMAP_MODES.OFF,
                format: t.FORMATS.DEPTH_COMPONENT,
                type: t.TYPES.UNSIGNED_SHORT,
              })),
            this.dirtyId++,
            this.dirtyFormat++,
            this
          );
        }),
        (e.prototype.enableDepth = function () {
          return (this.depth = !0), this.dirtyId++, this.dirtyFormat++, this;
        }),
        (e.prototype.enableStencil = function () {
          return (this.stencil = !0), this.dirtyId++, this.dirtyFormat++, this;
        }),
        (e.prototype.resize = function (t, e) {
          if (
            ((t = Math.round(t)),
            (e = Math.round(e)),
            t !== this.width || e !== this.height)
          ) {
            (this.width = t),
              (this.height = e),
              this.dirtyId++,
              this.dirtySize++;
            for (var r = 0; r < this.colorTextures.length; r++) {
              var i = this.colorTextures[r],
                n = i.resolution;
              i.setSize(t / n, e / n);
            }
            if (this.depthTexture) {
              n = this.depthTexture.resolution;
              this.depthTexture.setSize(t / n, e / n);
            }
          }
        }),
        (e.prototype.dispose = function () {
          this.disposeRunner.emit(this, !1);
        }),
        (e.prototype.destroyDepthTexture = function () {
          this.depthTexture &&
            (this.depthTexture.destroy(),
            (this.depthTexture = null),
            ++this.dirtyId,
            ++this.dirtyFormat);
        }),
        e
      );
    })(),
    Gi = (function (e) {
      function r(r) {
        void 0 === r && (r = {});
        var i = this;
        if ("number" == typeof r) {
          var n = arguments[0],
            o = arguments[1],
            s = arguments[2],
            a = arguments[3];
          r = { width: n, height: o, scaleMode: s, resolution: a };
        }
        return (
          (r.width = r.width || 100),
          (r.height = r.height || 100),
          (r.multisample =
            void 0 !== r.multisample ? r.multisample : t.MSAA_QUALITY.NONE),
          ((i = e.call(this, null, r) || this).mipmap = t.MIPMAP_MODES.OFF),
          (i.valid = !0),
          (i.clearColor = [0, 0, 0, 0]),
          (i.framebuffer = new Bi(i.realWidth, i.realHeight).addColorTexture(
            0,
            i
          )),
          (i.framebuffer.multisample = r.multisample),
          (i.maskStack = []),
          (i.filterStack = [{}]),
          i
        );
      }
      return (
        gi(r, e),
        (r.prototype.resize = function (t, e) {
          this.framebuffer.resize(t * this.resolution, e * this.resolution),
            this.setRealSize(this.framebuffer.width, this.framebuffer.height);
        }),
        (r.prototype.dispose = function () {
          this.framebuffer.dispose(), e.prototype.dispose.call(this);
        }),
        (r.prototype.destroy = function () {
          e.prototype.destroy.call(this),
            this.framebuffer.destroyDepthTexture(),
            (this.framebuffer = null);
        }),
        r
      );
    })(Si),
    Xi = (function () {
      function t() {
        (this.x0 = 0),
          (this.y0 = 0),
          (this.x1 = 1),
          (this.y1 = 0),
          (this.x2 = 1),
          (this.y2 = 1),
          (this.x3 = 0),
          (this.y3 = 1),
          (this.uvsFloat32 = new Float32Array(8));
      }
      return (
        (t.prototype.set = function (t, e, r) {
          var i = e.width,
            n = e.height;
          if (r) {
            var o = t.width / 2 / i,
              s = t.height / 2 / n,
              a = t.x / i + o,
              h = t.y / n + s;
            (r = Pr.add(r, Pr.NW)),
              (this.x0 = a + o * Pr.uX(r)),
              (this.y0 = h + s * Pr.uY(r)),
              (r = Pr.add(r, 2)),
              (this.x1 = a + o * Pr.uX(r)),
              (this.y1 = h + s * Pr.uY(r)),
              (r = Pr.add(r, 2)),
              (this.x2 = a + o * Pr.uX(r)),
              (this.y2 = h + s * Pr.uY(r)),
              (r = Pr.add(r, 2)),
              (this.x3 = a + o * Pr.uX(r)),
              (this.y3 = h + s * Pr.uY(r));
          } else
            (this.x0 = t.x / i),
              (this.y0 = t.y / n),
              (this.x1 = (t.x + t.width) / i),
              (this.y1 = t.y / n),
              (this.x2 = (t.x + t.width) / i),
              (this.y2 = (t.y + t.height) / n),
              (this.x3 = t.x / i),
              (this.y3 = (t.y + t.height) / n);
          (this.uvsFloat32[0] = this.x0),
            (this.uvsFloat32[1] = this.y0),
            (this.uvsFloat32[2] = this.x1),
            (this.uvsFloat32[3] = this.y1),
            (this.uvsFloat32[4] = this.x2),
            (this.uvsFloat32[5] = this.y2),
            (this.uvsFloat32[6] = this.x3),
            (this.uvsFloat32[7] = this.y3);
        }),
        (t.prototype.toString = function () {
          return (
            "[@pixi/core:TextureUvs x0=" +
            this.x0 +
            " y0=" +
            this.y0 +
            " x1=" +
            this.x1 +
            " y1=" +
            this.y1 +
            " x2=" +
            this.x2 +
            " y2=" +
            this.y2 +
            " x3=" +
            this.x3 +
            " y3=" +
            this.y3 +
            "]"
          );
        }),
        t
      );
    })(),
    ki = new Xi(),
    Hi = (function (t) {
      function e(r, i, n, o, s, a) {
        var h = t.call(this) || this;
        if (
          ((h.noFrame = !1),
          i || ((h.noFrame = !0), (i = new _r(0, 0, 1, 1))),
          r instanceof e && (r = r.baseTexture),
          (h.baseTexture = r),
          (h._frame = i),
          (h.trim = o),
          (h.valid = !1),
          (h._uvs = ki),
          (h.uvMatrix = null),
          (h.orig = n || i),
          (h._rotate = Number(s || 0)),
          !0 === s)
        )
          h._rotate = 2;
        else if (h._rotate % 2 != 0)
          throw new Error(
            "attempt to use diamond-shaped UVs. If you are sure, set rotation manually"
          );
        return (
          (h.defaultAnchor = a ? new fr(a.x, a.y) : new fr(0, 0)),
          (h._updateID = 0),
          (h.textureCacheIds = []),
          r.valid
            ? h.noFrame
              ? r.valid && h.onBaseTextureUpdated(r)
              : (h.frame = i)
            : r.once("loaded", h.onBaseTextureUpdated, h),
          h.noFrame && r.on("update", h.onBaseTextureUpdated, h),
          h
        );
      }
      return (
        gi(e, t),
        (e.prototype.update = function () {
          this.baseTexture.resource && this.baseTexture.resource.update();
        }),
        (e.prototype.onBaseTextureUpdated = function (t) {
          if (this.noFrame) {
            if (!this.baseTexture.valid) return;
            (this._frame.width = t.width),
              (this._frame.height = t.height),
              (this.valid = !0),
              this.updateUvs();
          } else this.frame = this._frame;
          this.emit("update", this);
        }),
        (e.prototype.destroy = function (t) {
          if (this.baseTexture) {
            if (t) {
              var r = this.baseTexture.resource;
              r && r.url && tr[r.url] && e.removeFromCache(r.url),
                this.baseTexture.destroy();
            }
            this.baseTexture.off("loaded", this.onBaseTextureUpdated, this),
              this.baseTexture.off("update", this.onBaseTextureUpdated, this),
              (this.baseTexture = null);
          }
          (this._frame = null),
            (this._uvs = null),
            (this.trim = null),
            (this.orig = null),
            (this.valid = !1),
            e.removeFromCache(this),
            (this.textureCacheIds = null);
        }),
        (e.prototype.clone = function () {
          var t = this._frame.clone(),
            r = this._frame === this.orig ? t : this.orig.clone(),
            i = new e(
              this.baseTexture,
              !this.noFrame && t,
              r,
              this.trim && this.trim.clone(),
              this.rotate,
              this.defaultAnchor
            );
          return this.noFrame && (i._frame = t), i;
        }),
        (e.prototype.updateUvs = function () {
          this._uvs === ki && (this._uvs = new Xi()),
            this._uvs.set(this._frame, this.baseTexture, this.rotate),
            this._updateID++;
        }),
        (e.from = function (t, r, i) {
          void 0 === r && (r = {}),
            void 0 === i && (i = bt.STRICT_TEXTURE_CACHE);
          var n = "string" == typeof t,
            o = null;
          if (n) o = t;
          else if (t instanceof Si) {
            if (!t.cacheId) {
              var s = (r && r.pixiIdPrefix) || "pixiid";
              (t.cacheId = s + "-" + Ze()), Si.addToCache(t, t.cacheId);
            }
            o = t.cacheId;
          } else {
            if (!t._pixiId) {
              s = (r && r.pixiIdPrefix) || "pixiid";
              t._pixiId = s + "_" + Ze();
            }
            o = t._pixiId;
          }
          var a = tr[o];
          if (n && i && !a)
            throw new Error(
              'The cacheId "' + o + '" does not exist in TextureCache.'
            );
          return (
            a || t instanceof Si
              ? !a && t instanceof Si && ((a = new e(t)), e.addToCache(a, o))
              : (r.resolution || (r.resolution = ar(t)),
                ((a = new e(new Si(t, r))).baseTexture.cacheId = o),
                Si.addToCache(a.baseTexture, o),
                e.addToCache(a, o)),
            a
          );
        }),
        (e.fromURL = function (t, r) {
          var i = Object.assign(
              { autoLoad: !1 },
              null == r ? void 0 : r.resourceOptions
            ),
            n = e.from(t, Object.assign({ resourceOptions: i }, r), !1),
            o = n.baseTexture.resource;
          return n.baseTexture.valid
            ? Promise.resolve(n)
            : o.load().then(function () {
                return Promise.resolve(n);
              });
        }),
        (e.fromBuffer = function (t, r, i, n) {
          return new e(Si.fromBuffer(t, r, i, n));
        }),
        (e.fromLoader = function (t, r, i, n) {
          var o = new Si(
              t,
              Object.assign({ scaleMode: bt.SCALE_MODE, resolution: ar(r) }, n)
            ),
            s = o.resource;
          s instanceof Di && (s.url = r);
          var a = new e(o);
          return (
            i || (i = r),
            Si.addToCache(a.baseTexture, i),
            e.addToCache(a, i),
            i !== r && (Si.addToCache(a.baseTexture, r), e.addToCache(a, r)),
            a.baseTexture.valid
              ? Promise.resolve(a)
              : new Promise(function (t) {
                  a.baseTexture.once("loaded", function () {
                    return t(a);
                  });
                })
          );
        }),
        (e.addToCache = function (t, e) {
          e &&
            (-1 === t.textureCacheIds.indexOf(e) && t.textureCacheIds.push(e),
            tr[e] &&
              console.warn(
                "Texture added to the cache with an id [" +
                  e +
                  "] that already had an entry"
              ),
            (tr[e] = t));
        }),
        (e.removeFromCache = function (t) {
          if ("string" == typeof t) {
            var e = tr[t];
            if (e) {
              var r = e.textureCacheIds.indexOf(t);
              return r > -1 && e.textureCacheIds.splice(r, 1), delete tr[t], e;
            }
          } else if (t && t.textureCacheIds) {
            for (var i = 0; i < t.textureCacheIds.length; ++i)
              tr[t.textureCacheIds[i]] === t && delete tr[t.textureCacheIds[i]];
            return (t.textureCacheIds.length = 0), t;
          }
          return null;
        }),
        Object.defineProperty(e.prototype, "resolution", {
          get: function () {
            return this.baseTexture.resolution;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "frame", {
          get: function () {
            return this._frame;
          },
          set: function (t) {
            (this._frame = t), (this.noFrame = !1);
            var e = t.x,
              r = t.y,
              i = t.width,
              n = t.height,
              o = e + i > this.baseTexture.width,
              s = r + n > this.baseTexture.height;
            if (o || s) {
              var a = o && s ? "and" : "or",
                h =
                  "X: " +
                  e +
                  " + " +
                  i +
                  " = " +
                  (e + i) +
                  " > " +
                  this.baseTexture.width,
                u =
                  "Y: " +
                  r +
                  " + " +
                  n +
                  " = " +
                  (r + n) +
                  " > " +
                  this.baseTexture.height;
              throw new Error(
                "Texture Error: frame does not fit inside the base Texture dimensions: " +
                  h +
                  " " +
                  a +
                  " " +
                  u
              );
            }
            (this.valid = i && n && this.baseTexture.valid),
              this.trim || this.rotate || (this.orig = t),
              this.valid && this.updateUvs();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "rotate", {
          get: function () {
            return this._rotate;
          },
          set: function (t) {
            (this._rotate = t), this.valid && this.updateUvs();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "width", {
          get: function () {
            return this.orig.width;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "height", {
          get: function () {
            return this.orig.height;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.castToBaseTexture = function () {
          return this.baseTexture;
        }),
        e
      );
    })(xt);
  function Yi(t) {
    (t.destroy = function () {}),
      (t.on = function () {}),
      (t.once = function () {}),
      (t.emit = function () {});
  }
  (Hi.EMPTY = new Hi(new Si())),
    Yi(Hi.EMPTY),
    Yi(Hi.EMPTY.baseTexture),
    (Hi.WHITE = (function () {
      var t = document.createElement("canvas");
      (t.width = 16), (t.height = 16);
      var e = t.getContext("2d");
      return (
        (e.fillStyle = "white"),
        e.fillRect(0, 0, 16, 16),
        new Hi(new Si(new Mi(t)))
      );
    })()),
    Yi(Hi.WHITE),
    Yi(Hi.WHITE.baseTexture);
  var ji = (function (t) {
      function e(e, r) {
        var i = t.call(this, e, r) || this;
        return (
          (i.valid = !0),
          (i.filterFrame = null),
          (i.filterPoolKey = null),
          i.updateUvs(),
          i
        );
      }
      return (
        gi(e, t),
        Object.defineProperty(e.prototype, "framebuffer", {
          get: function () {
            return this.baseTexture.framebuffer;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "multisample", {
          get: function () {
            return this.framebuffer.multisample;
          },
          set: function (t) {
            this.framebuffer.multisample = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.resize = function (t, e, r) {
          void 0 === r && (r = !0);
          var i = this.baseTexture.resolution,
            n = Math.round(t * i) / i,
            o = Math.round(e * i) / i;
          (this.valid = n > 0 && o > 0),
            (this._frame.width = this.orig.width = n),
            (this._frame.height = this.orig.height = o),
            r && this.baseTexture.resize(n, o),
            this.updateUvs();
        }),
        (e.prototype.setResolution = function (t) {
          var e = this.baseTexture;
          e.resolution !== t &&
            (e.setResolution(t), this.resize(e.width, e.height, !1));
        }),
        (e.create = function (t) {
          for (var r = arguments, i = [], n = 1; n < arguments.length; n++)
            i[n - 1] = r[n];
          return (
            "number" == typeof t &&
              (Je(
                "6.0.0",
                "Arguments (width, height, scaleMode, resolution) have been deprecated."
              ),
              (t = {
                width: t,
                height: i[0],
                scaleMode: i[1],
                resolution: i[2],
              })),
            new e(new Gi(t))
          );
        }),
        e
      );
    })(Hi),
    Vi = (function () {
      function e(t) {
        (this.texturePool = {}),
          (this.textureOptions = t || {}),
          (this.enableFullScreen = !1),
          (this._pixelsWidth = 0),
          (this._pixelsHeight = 0);
      }
      return (
        (e.prototype.createTexture = function (e, r, i) {
          void 0 === i && (i = t.MSAA_QUALITY.NONE);
          var n = new Gi(
            Object.assign(
              { width: e, height: r, resolution: 1, multisample: i },
              this.textureOptions
            )
          );
          return new ji(n);
        }),
        (e.prototype.getOptimalTexture = function (e, r, i, n) {
          var o;
          void 0 === i && (i = 1),
            void 0 === n && (n = t.MSAA_QUALITY.NONE),
            (e = Math.ceil(e * i - 1e-6)),
            (r = Math.ceil(r * i - 1e-6)),
            this.enableFullScreen &&
            e === this._pixelsWidth &&
            r === this._pixelsHeight
              ? (o = n > 1 ? -n : -1)
              : ((o =
                  (((65535 & (e = je(e))) << 16) | (65535 & (r = je(r)))) >>>
                  0),
                n > 1 && (o += 4294967296 * n)),
            this.texturePool[o] || (this.texturePool[o] = []);
          var s = this.texturePool[o].pop();
          return (
            s || (s = this.createTexture(e, r, n)),
            (s.filterPoolKey = o),
            s.setResolution(i),
            s
          );
        }),
        (e.prototype.getFilterTexture = function (e, r, i) {
          var n = this.getOptimalTexture(
            e.width,
            e.height,
            r || e.resolution,
            i || t.MSAA_QUALITY.NONE
          );
          return (n.filterFrame = e.filterFrame), n;
        }),
        (e.prototype.returnTexture = function (t) {
          var e = t.filterPoolKey;
          (t.filterFrame = null), this.texturePool[e].push(t);
        }),
        (e.prototype.returnFilterTexture = function (t) {
          this.returnTexture(t);
        }),
        (e.prototype.clear = function (t) {
          if ((t = !1 !== t))
            for (var e in this.texturePool) {
              var r = this.texturePool[e];
              if (r) for (var i = 0; i < r.length; i++) r[i].destroy(!0);
            }
          this.texturePool = {};
        }),
        (e.prototype.setScreenSize = function (t) {
          if (
            t.width !== this._pixelsWidth ||
            t.height !== this._pixelsHeight
          ) {
            for (var e in ((this.enableFullScreen =
              t.width > 0 && t.height > 0),
            this.texturePool))
              if (Number(e) < 0) {
                var r = this.texturePool[e];
                if (r) for (var i = 0; i < r.length; i++) r[i].destroy(!0);
                this.texturePool[e] = [];
              }
            (this._pixelsWidth = t.width), (this._pixelsHeight = t.height);
          }
        }),
        (e.SCREEN_KEY = -1),
        e
      );
    })(),
    Wi = (function () {
      function e(e, r, i, n, o, s, a) {
        void 0 === r && (r = 0),
          void 0 === i && (i = !1),
          void 0 === n && (n = t.TYPES.FLOAT),
          (this.buffer = e),
          (this.size = r),
          (this.normalized = i),
          (this.type = n),
          (this.stride = o),
          (this.start = s),
          (this.instance = a);
      }
      return (
        (e.prototype.destroy = function () {
          this.buffer = null;
        }),
        (e.from = function (t, r, i, n, o) {
          return new e(t, r, i, n, o);
        }),
        e
      );
    })(),
    zi = 0,
    qi = (function () {
      function e(t, e, r) {
        void 0 === e && (e = !0),
          void 0 === r && (r = !1),
          (this.data = t || new Float32Array(1)),
          (this._glBuffers = {}),
          (this._updateID = 0),
          (this.index = r),
          (this.static = e),
          (this.id = zi++),
          (this.disposeRunner = new mi("disposeBuffer"));
      }
      return (
        (e.prototype.update = function (t) {
          t instanceof Array && (t = new Float32Array(t)),
            (this.data = t || this.data),
            this._updateID++;
        }),
        (e.prototype.dispose = function () {
          this.disposeRunner.emit(this, !1);
        }),
        (e.prototype.destroy = function () {
          this.dispose(), (this.data = null);
        }),
        Object.defineProperty(e.prototype, "index", {
          get: function () {
            return this.type === t.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
          },
          set: function (e) {
            this.type = e
              ? t.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER
              : t.BUFFER_TYPE.ARRAY_BUFFER;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.from = function (t) {
          return t instanceof Array && (t = new Float32Array(t)), new e(t);
        }),
        e
      );
    })(),
    Ki = {
      Float32Array: Float32Array,
      Uint32Array: Uint32Array,
      Int32Array: Int32Array,
      Uint8Array: Uint8Array,
    };
  var Zi = { 5126: 4, 5123: 2, 5121: 1 },
    Qi = 0,
    Ji = {
      Float32Array: Float32Array,
      Uint32Array: Uint32Array,
      Int32Array: Int32Array,
      Uint8Array: Uint8Array,
      Uint16Array: Uint16Array,
    },
    $i = (function () {
      function e(t, e) {
        void 0 === t && (t = []),
          void 0 === e && (e = {}),
          (this.buffers = t),
          (this.indexBuffer = null),
          (this.attributes = e),
          (this.glVertexArrayObjects = {}),
          (this.id = Qi++),
          (this.instanced = !1),
          (this.instanceCount = 1),
          (this.disposeRunner = new mi("disposeGeometry")),
          (this.refCount = 0);
      }
      return (
        (e.prototype.addAttribute = function (t, e, r, i, n, o, s, a) {
          if (
            (void 0 === r && (r = 0),
            void 0 === i && (i = !1),
            void 0 === a && (a = !1),
            !e)
          )
            throw new Error(
              "You must pass a buffer when creating an attribute"
            );
          e instanceof qi ||
            (e instanceof Array && (e = new Float32Array(e)), (e = new qi(e)));
          var h = t.split("|");
          if (h.length > 1) {
            for (var u = 0; u < h.length; u++)
              this.addAttribute(h[u], e, r, i, n);
            return this;
          }
          var l = this.buffers.indexOf(e);
          return (
            -1 === l && (this.buffers.push(e), (l = this.buffers.length - 1)),
            (this.attributes[t] = new Wi(l, r, i, n, o, s, a)),
            (this.instanced = this.instanced || a),
            this
          );
        }),
        (e.prototype.getAttribute = function (t) {
          return this.attributes[t];
        }),
        (e.prototype.getBuffer = function (t) {
          return this.buffers[this.getAttribute(t).buffer];
        }),
        (e.prototype.addIndex = function (e) {
          return (
            e instanceof qi ||
              (e instanceof Array && (e = new Uint16Array(e)), (e = new qi(e))),
            (e.type = t.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER),
            (this.indexBuffer = e),
            -1 === this.buffers.indexOf(e) && this.buffers.push(e),
            this
          );
        }),
        (e.prototype.getIndex = function () {
          return this.indexBuffer;
        }),
        (e.prototype.interleave = function () {
          if (
            1 === this.buffers.length ||
            (2 === this.buffers.length && this.indexBuffer)
          )
            return this;
          var t,
            e = [],
            r = [],
            i = new qi();
          for (t in this.attributes) {
            var n = this.attributes[t],
              o = this.buffers[n.buffer];
            e.push(o.data), r.push((n.size * Zi[n.type]) / 4), (n.buffer = 0);
          }
          for (
            i.data = (function (t, e) {
              for (var r = 0, i = 0, n = {}, o = 0; o < t.length; o++)
                (i += e[o]), (r += t[o].length);
              var s = new ArrayBuffer(4 * r),
                a = null,
                h = 0;
              for (o = 0; o < t.length; o++) {
                var u = e[o],
                  l = t[o],
                  c = He(l);
                n[c] || (n[c] = new Ki[c](s)), (a = n[c]);
                for (var d = 0; d < l.length; d++)
                  a[((d / u) | 0) * i + h + (d % u)] = l[d];
                h += u;
              }
              return new Float32Array(s);
            })(e, r),
              t = 0;
            t < this.buffers.length;
            t++
          )
            this.buffers[t] !== this.indexBuffer && this.buffers[t].destroy();
          return (
            (this.buffers = [i]),
            this.indexBuffer && this.buffers.push(this.indexBuffer),
            this
          );
        }),
        (e.prototype.getSize = function () {
          for (var t in this.attributes) {
            var e = this.attributes[t];
            return (
              this.buffers[e.buffer].data.length / (e.stride / 4 || e.size)
            );
          }
          return 0;
        }),
        (e.prototype.dispose = function () {
          this.disposeRunner.emit(this, !1);
        }),
        (e.prototype.destroy = function () {
          this.dispose(),
            (this.buffers = null),
            (this.indexBuffer = null),
            (this.attributes = null);
        }),
        (e.prototype.clone = function () {
          for (var r = new e(), i = 0; i < this.buffers.length; i++)
            r.buffers[i] = new qi(this.buffers[i].data.slice(0));
          for (var i in this.attributes) {
            var n = this.attributes[i];
            r.attributes[i] = new Wi(
              n.buffer,
              n.size,
              n.normalized,
              n.type,
              n.stride,
              n.start,
              n.instance
            );
          }
          return (
            this.indexBuffer &&
              ((r.indexBuffer =
                r.buffers[this.buffers.indexOf(this.indexBuffer)]),
              (r.indexBuffer.type = t.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER)),
            r
          );
        }),
        (e.merge = function (r) {
          for (
            var i, n = new e(), o = [], s = [], a = [], h = 0;
            h < r.length;
            h++
          ) {
            i = r[h];
            for (var u = 0; u < i.buffers.length; u++)
              (s[u] = s[u] || 0),
                (s[u] += i.buffers[u].data.length),
                (a[u] = 0);
          }
          for (h = 0; h < i.buffers.length; h++)
            (o[h] = new Ji[He(i.buffers[h].data)](s[h])),
              (n.buffers[h] = new qi(o[h]));
          for (h = 0; h < r.length; h++) {
            i = r[h];
            for (u = 0; u < i.buffers.length; u++)
              o[u].set(i.buffers[u].data, a[u]),
                (a[u] += i.buffers[u].data.length);
          }
          if (((n.attributes = i.attributes), i.indexBuffer)) {
            (n.indexBuffer = n.buffers[i.buffers.indexOf(i.indexBuffer)]),
              (n.indexBuffer.type = t.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER);
            var l = 0,
              c = 0,
              d = 0,
              f = 0;
            for (h = 0; h < i.buffers.length; h++)
              if (i.buffers[h] !== i.indexBuffer) {
                f = h;
                break;
              }
            for (var h in i.attributes) {
              var p = i.attributes[h];
              (0 | p.buffer) === f && (c += (p.size * Zi[p.type]) / 4);
            }
            for (h = 0; h < r.length; h++) {
              var _ = r[h].indexBuffer.data;
              for (u = 0; u < _.length; u++) n.indexBuffer.data[u + d] += l;
              (l += r[h].buffers[f].data.length / c), (d += _.length);
            }
          }
          return n;
        }),
        e
      );
    })(),
    tn = (function (t) {
      function e() {
        var e = t.call(this) || this;
        return (
          e
            .addAttribute(
              "aVertexPosition",
              new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
            )
            .addIndex([0, 1, 3, 2]),
          e
        );
      }
      return gi(e, t), e;
    })($i),
    en = (function (t) {
      function e() {
        var e = t.call(this) || this;
        return (
          (e.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])),
          (e.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])),
          (e.vertexBuffer = new qi(e.vertices)),
          (e.uvBuffer = new qi(e.uvs)),
          e
            .addAttribute("aVertexPosition", e.vertexBuffer)
            .addAttribute("aTextureCoord", e.uvBuffer)
            .addIndex([0, 1, 2, 0, 2, 3]),
          e
        );
      }
      return (
        gi(e, t),
        (e.prototype.map = function (t, e) {
          var r = 0,
            i = 0;
          return (
            (this.uvs[0] = r),
            (this.uvs[1] = i),
            (this.uvs[2] = r + e.width / t.width),
            (this.uvs[3] = i),
            (this.uvs[4] = r + e.width / t.width),
            (this.uvs[5] = i + e.height / t.height),
            (this.uvs[6] = r),
            (this.uvs[7] = i + e.height / t.height),
            (r = e.x),
            (i = e.y),
            (this.vertices[0] = r),
            (this.vertices[1] = i),
            (this.vertices[2] = r + e.width),
            (this.vertices[3] = i),
            (this.vertices[4] = r + e.width),
            (this.vertices[5] = i + e.height),
            (this.vertices[6] = r),
            (this.vertices[7] = i + e.height),
            this.invalidate(),
            this
          );
        }),
        (e.prototype.invalidate = function () {
          return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
        }),
        e
      );
    })($i),
    rn = 0,
    nn = (function () {
      function e(e, r, i) {
        (this.group = !0),
          (this.syncUniforms = {}),
          (this.dirtyId = 0),
          (this.id = rn++),
          (this.static = !!r),
          (this.ubo = !!i),
          e instanceof qi
            ? ((this.buffer = e),
              (this.buffer.type = t.BUFFER_TYPE.UNIFORM_BUFFER),
              (this.autoManage = !1),
              (this.ubo = !0))
            : ((this.uniforms = e),
              this.ubo &&
                ((this.buffer = new qi(new Float32Array(1))),
                (this.buffer.type = t.BUFFER_TYPE.UNIFORM_BUFFER),
                (this.autoManage = !0)));
      }
      return (
        (e.prototype.update = function () {
          this.dirtyId++,
            !this.autoManage && this.buffer && this.buffer.update();
        }),
        (e.prototype.add = function (t, r, i) {
          if (this.ubo)
            throw new Error(
              "[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them"
            );
          this.uniforms[t] = new e(r, i);
        }),
        (e.from = function (t, r, i) {
          return new e(t, r, i);
        }),
        (e.uboFrom = function (t, r) {
          return new e(t, null == r || r, !0);
        }),
        e
      );
    })(),
    on = (function () {
      function e() {
        (this.renderTexture = null),
          (this.target = null),
          (this.legacy = !1),
          (this.resolution = 1),
          (this.multisample = t.MSAA_QUALITY.NONE),
          (this.sourceFrame = new _r()),
          (this.destinationFrame = new _r()),
          (this.bindingSourceFrame = new _r()),
          (this.bindingDestinationFrame = new _r()),
          (this.filters = []),
          (this.transform = null);
      }
      return (
        (e.prototype.clear = function () {
          (this.target = null),
            (this.filters = null),
            (this.renderTexture = null);
        }),
        e
      );
    })(),
    sn = [new fr(), new fr(), new fr(), new fr()],
    an = new gr(),
    hn = (function () {
      function e(t) {
        (this.renderer = t),
          (this.defaultFilterStack = [{}]),
          (this.texturePool = new Vi()),
          this.texturePool.setScreenSize(t.view),
          (this.statePool = []),
          (this.quad = new tn()),
          (this.quadUv = new en()),
          (this.tempRect = new _r()),
          (this.activeState = {}),
          (this.globalUniforms = new nn(
            {
              outputFrame: new _r(),
              inputSize: new Float32Array(4),
              inputPixel: new Float32Array(4),
              inputClamp: new Float32Array(4),
              resolution: 1,
              filterArea: new Float32Array(4),
              filterClamp: new Float32Array(4),
            },
            !0
          )),
          (this.forceClear = !1),
          (this.useMaxPadding = !1);
      }
      return (
        (e.prototype.push = function (t, e) {
          for (
            var r,
              i,
              n = this.renderer,
              o = this.defaultFilterStack,
              s = this.statePool.pop() || new on(),
              a = this.renderer.renderTexture,
              h = e[0].resolution,
              u = e[0].multisample,
              l = e[0].padding,
              c = e[0].autoFit,
              d = null === (r = e[0].legacy) || void 0 === r || r,
              f = 1;
            f < e.length;
            f++
          ) {
            var p = e[f];
            (h = Math.min(h, p.resolution)),
              (u = Math.min(u, p.multisample)),
              (l = this.useMaxPadding ? Math.max(l, p.padding) : l + p.padding),
              (c = c && p.autoFit),
              (d = d || null === (i = p.legacy) || void 0 === i || i);
          }
          if (
            (1 === o.length &&
              (this.defaultFilterStack[0].renderTexture = a.current),
            o.push(s),
            (s.resolution = h),
            (s.multisample = u),
            (s.legacy = d),
            (s.target = t),
            s.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)),
            s.sourceFrame.pad(l),
            c)
          ) {
            var _ = this.tempRect.copyFrom(a.sourceFrame);
            n.projection.transform &&
              this.transformAABB(
                an.copyFrom(n.projection.transform).invert(),
                _
              ),
              s.sourceFrame.fit(_);
          }
          this.roundFrame(
            s.sourceFrame,
            a.current ? a.current.resolution : n.resolution,
            a.sourceFrame,
            a.destinationFrame,
            n.projection.transform
          ),
            (s.renderTexture = this.getOptimalFilterTexture(
              s.sourceFrame.width,
              s.sourceFrame.height,
              h,
              u
            )),
            (s.filters = e),
            (s.destinationFrame.width = s.renderTexture.width),
            (s.destinationFrame.height = s.renderTexture.height);
          var v = this.tempRect;
          (v.x = 0),
            (v.y = 0),
            (v.width = s.sourceFrame.width),
            (v.height = s.sourceFrame.height),
            (s.renderTexture.filterFrame = s.sourceFrame),
            s.bindingSourceFrame.copyFrom(a.sourceFrame),
            s.bindingDestinationFrame.copyFrom(a.destinationFrame),
            (s.transform = n.projection.transform),
            (n.projection.transform = null),
            a.bind(s.renderTexture, s.sourceFrame, v),
            n.framebuffer.clear(0, 0, 0, 0);
        }),
        (e.prototype.pop = function () {
          var e = this.defaultFilterStack,
            r = e.pop(),
            i = r.filters;
          this.activeState = r;
          var n = this.globalUniforms.uniforms;
          (n.outputFrame = r.sourceFrame), (n.resolution = r.resolution);
          var o = n.inputSize,
            s = n.inputPixel,
            a = n.inputClamp;
          if (
            ((o[0] = r.destinationFrame.width),
            (o[1] = r.destinationFrame.height),
            (o[2] = 1 / o[0]),
            (o[3] = 1 / o[1]),
            (s[0] = Math.round(o[0] * r.resolution)),
            (s[1] = Math.round(o[1] * r.resolution)),
            (s[2] = 1 / s[0]),
            (s[3] = 1 / s[1]),
            (a[0] = 0.5 * s[2]),
            (a[1] = 0.5 * s[3]),
            (a[2] = r.sourceFrame.width * o[2] - 0.5 * s[2]),
            (a[3] = r.sourceFrame.height * o[3] - 0.5 * s[3]),
            r.legacy)
          ) {
            var h = n.filterArea;
            (h[0] = r.destinationFrame.width),
              (h[1] = r.destinationFrame.height),
              (h[2] = r.sourceFrame.x),
              (h[3] = r.sourceFrame.y),
              (n.filterClamp = n.inputClamp);
          }
          this.globalUniforms.update();
          var u = e[e.length - 1];
          if ((this.renderer.framebuffer.blit(), 1 === i.length))
            i[0].apply(
              this,
              r.renderTexture,
              u.renderTexture,
              t.CLEAR_MODES.BLEND,
              r
            ),
              this.returnFilterTexture(r.renderTexture);
          else {
            var l = r.renderTexture,
              c = this.getOptimalFilterTexture(l.width, l.height, r.resolution);
            c.filterFrame = l.filterFrame;
            var d = 0;
            for (d = 0; d < i.length - 1; ++d) {
              1 === d &&
                r.multisample > 1 &&
                ((c = this.getOptimalFilterTexture(
                  l.width,
                  l.height,
                  r.resolution
                )).filterFrame = l.filterFrame),
                i[d].apply(this, l, c, t.CLEAR_MODES.CLEAR, r);
              var f = l;
              (l = c), (c = f);
            }
            i[d].apply(this, l, u.renderTexture, t.CLEAR_MODES.BLEND, r),
              d > 1 &&
                r.multisample > 1 &&
                this.returnFilterTexture(r.renderTexture),
              this.returnFilterTexture(l),
              this.returnFilterTexture(c);
          }
          r.clear(), this.statePool.push(r);
        }),
        (e.prototype.bindAndClear = function (e, r) {
          void 0 === r && (r = t.CLEAR_MODES.CLEAR);
          var i = this.renderer,
            n = i.renderTexture,
            o = i.state;
          if (
            (e ===
            this.defaultFilterStack[this.defaultFilterStack.length - 1]
              .renderTexture
              ? (this.renderer.projection.transform =
                  this.activeState.transform)
              : (this.renderer.projection.transform = null),
            e && e.filterFrame)
          ) {
            var s = this.tempRect;
            (s.x = 0),
              (s.y = 0),
              (s.width = e.filterFrame.width),
              (s.height = e.filterFrame.height),
              n.bind(e, e.filterFrame, s);
          } else
            e !==
            this.defaultFilterStack[this.defaultFilterStack.length - 1]
              .renderTexture
              ? n.bind(e)
              : this.renderer.renderTexture.bind(
                  e,
                  this.activeState.bindingSourceFrame,
                  this.activeState.bindingDestinationFrame
                );
          var a = 1 & o.stateId || this.forceClear;
          (r === t.CLEAR_MODES.CLEAR || (r === t.CLEAR_MODES.BLIT && a)) &&
            this.renderer.framebuffer.clear(0, 0, 0, 0);
        }),
        (e.prototype.applyFilter = function (e, r, i, n) {
          var o = this.renderer;
          o.state.set(e.state),
            this.bindAndClear(i, n),
            (e.uniforms.uSampler = r),
            (e.uniforms.filterGlobals = this.globalUniforms),
            o.shader.bind(e),
            (e.legacy = !!e.program.attributeData.aTextureCoord),
            e.legacy
              ? (this.quadUv.map(r._frame, r.filterFrame),
                o.geometry.bind(this.quadUv),
                o.geometry.draw(t.DRAW_MODES.TRIANGLES))
              : (o.geometry.bind(this.quad),
                o.geometry.draw(t.DRAW_MODES.TRIANGLE_STRIP));
        }),
        (e.prototype.calculateSpriteMatrix = function (t, e) {
          var r = this.activeState,
            i = r.sourceFrame,
            n = r.destinationFrame,
            o = e._texture.orig,
            s = t.set(n.width, 0, 0, n.height, i.x, i.y),
            a = e.worldTransform.copyTo(gr.TEMP_MATRIX);
          return (
            a.invert(),
            s.prepend(a),
            s.scale(1 / o.width, 1 / o.height),
            s.translate(e.anchor.x, e.anchor.y),
            s
          );
        }),
        (e.prototype.destroy = function () {
          (this.renderer = null), this.texturePool.clear(!1);
        }),
        (e.prototype.getOptimalFilterTexture = function (e, r, i, n) {
          return (
            void 0 === i && (i = 1),
            void 0 === n && (n = t.MSAA_QUALITY.NONE),
            this.texturePool.getOptimalTexture(e, r, i, n)
          );
        }),
        (e.prototype.getFilterTexture = function (e, r, i) {
          if ("number" == typeof e) {
            var n = e;
            (e = r), (r = n);
          }
          e = e || this.activeState.renderTexture;
          var o = this.texturePool.getOptimalTexture(
            e.width,
            e.height,
            r || e.resolution,
            i || t.MSAA_QUALITY.NONE
          );
          return (o.filterFrame = e.filterFrame), o;
        }),
        (e.prototype.returnFilterTexture = function (t) {
          this.texturePool.returnTexture(t);
        }),
        (e.prototype.emptyPool = function () {
          this.texturePool.clear(!0);
        }),
        (e.prototype.resize = function () {
          this.texturePool.setScreenSize(this.renderer.view);
        }),
        (e.prototype.transformAABB = function (t, e) {
          var r = sn[0],
            i = sn[1],
            n = sn[2],
            o = sn[3];
          r.set(e.left, e.top),
            i.set(e.left, e.bottom),
            n.set(e.right, e.top),
            o.set(e.right, e.bottom),
            t.apply(r, r),
            t.apply(i, i),
            t.apply(n, n),
            t.apply(o, o);
          var s = Math.min(r.x, i.x, n.x, o.x),
            a = Math.min(r.y, i.y, n.y, o.y),
            h = Math.max(r.x, i.x, n.x, o.x),
            u = Math.max(r.y, i.y, n.y, o.y);
          (e.x = s), (e.y = a), (e.width = h - s), (e.height = u - a);
        }),
        (e.prototype.roundFrame = function (t, e, r, i, n) {
          if (
            !(t.width <= 0 || t.height <= 0 || r.width <= 0 || r.height <= 0)
          ) {
            if (n) {
              var o = n.a,
                s = n.b,
                a = n.c,
                h = n.d;
              if (
                (Math.abs(s) > 1e-4 || Math.abs(a) > 1e-4) &&
                (Math.abs(o) > 1e-4 || Math.abs(h) > 1e-4)
              )
                return;
            }
            (n = n ? an.copyFrom(n) : an.identity())
              .translate(-r.x, -r.y)
              .scale(i.width / r.width, i.height / r.height)
              .translate(i.x, i.y),
              this.transformAABB(n, t),
              t.ceil(e),
              this.transformAABB(n.invert(), t);
          }
        }),
        e
      );
    })(),
    un = (function () {
      function t(t) {
        this.renderer = t;
      }
      return (
        (t.prototype.flush = function () {}),
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        (t.prototype.start = function () {}),
        (t.prototype.stop = function () {
          this.flush();
        }),
        (t.prototype.render = function (t) {}),
        t
      );
    })(),
    ln = (function () {
      function t(t) {
        (this.renderer = t),
          (this.emptyRenderer = new un(t)),
          (this.currentRenderer = this.emptyRenderer);
      }
      return (
        (t.prototype.setObjectRenderer = function (t) {
          this.currentRenderer !== t &&
            (this.currentRenderer.stop(),
            (this.currentRenderer = t),
            this.currentRenderer.start());
        }),
        (t.prototype.flush = function () {
          this.setObjectRenderer(this.emptyRenderer);
        }),
        (t.prototype.reset = function () {
          this.setObjectRenderer(this.emptyRenderer);
        }),
        (t.prototype.copyBoundTextures = function (t, e) {
          for (
            var r = this.renderer.texture.boundTextures, i = e - 1;
            i >= 0;
            --i
          )
            (t[i] = r[i] || null), t[i] && (t[i]._batchLocation = i);
        }),
        (t.prototype.boundArray = function (t, e, r, i) {
          for (
            var n = t.elements, o = t.ids, s = t.count, a = 0, h = 0;
            h < s;
            h++
          ) {
            var u = n[h],
              l = u._batchLocation;
            if (l >= 0 && l < i && e[l] === u) o[h] = l;
            else
              for (; a < i; ) {
                var c = e[a];
                if (!c || c._batchEnabled !== r || c._batchLocation !== a) {
                  (o[h] = a), (u._batchLocation = a), (e[a] = u);
                  break;
                }
                a++;
              }
          }
        }),
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        t
      );
    })(),
    cn = 0,
    dn = (function () {
      function e(t) {
        (this.renderer = t),
          (this.webGLVersion = 1),
          (this.extensions = {}),
          (this.supports = { uint32Indices: !1 }),
          (this.handleContextLost = this.handleContextLost.bind(this)),
          (this.handleContextRestored = this.handleContextRestored.bind(this)),
          t.view.addEventListener(
            "webglcontextlost",
            this.handleContextLost,
            !1
          ),
          t.view.addEventListener(
            "webglcontextrestored",
            this.handleContextRestored,
            !1
          );
      }
      return (
        Object.defineProperty(e.prototype, "isLost", {
          get: function () {
            return !this.gl || this.gl.isContextLost();
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.contextChange = function (t) {
          (this.gl = t),
            (this.renderer.gl = t),
            (this.renderer.CONTEXT_UID = cn++),
            t.isContextLost() &&
              t.getExtension("WEBGL_lose_context") &&
              t.getExtension("WEBGL_lose_context").restoreContext();
        }),
        (e.prototype.initFromContext = function (t) {
          (this.gl = t),
            this.validateContext(t),
            (this.renderer.gl = t),
            (this.renderer.CONTEXT_UID = cn++),
            this.renderer.runners.contextChange.emit(t);
        }),
        (e.prototype.initFromOptions = function (t) {
          var e = this.createContext(this.renderer.view, t);
          this.initFromContext(e);
        }),
        (e.prototype.createContext = function (e, r) {
          var i;
          if (
            (bt.PREFER_ENV >= t.ENV.WEBGL2 && (i = e.getContext("webgl2", r)),
            i)
          )
            this.webGLVersion = 2;
          else if (
            ((this.webGLVersion = 1),
            !(i =
              e.getContext("webgl", r) ||
              e.getContext("experimental-webgl", r)))
          )
            throw new Error(
              "This browser does not support WebGL. Try using the canvas renderer"
            );
          return (this.gl = i), this.getExtensions(), this.gl;
        }),
        (e.prototype.getExtensions = function () {
          var t = this.gl,
            e = {
              anisotropicFiltering: t.getExtension(
                "EXT_texture_filter_anisotropic"
              ),
              floatTextureLinear: t.getExtension("OES_texture_float_linear"),
              s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
              s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
              etc: t.getExtension("WEBGL_compressed_texture_etc"),
              etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
              pvrtc:
                t.getExtension("WEBGL_compressed_texture_pvrtc") ||
                t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
              atc: t.getExtension("WEBGL_compressed_texture_atc"),
              astc: t.getExtension("WEBGL_compressed_texture_astc"),
            };
          1 === this.webGLVersion
            ? Object.assign(this.extensions, e, {
                drawBuffers: t.getExtension("WEBGL_draw_buffers"),
                depthTexture: t.getExtension("WEBGL_depth_texture"),
                loseContext: t.getExtension("WEBGL_lose_context"),
                vertexArrayObject:
                  t.getExtension("OES_vertex_array_object") ||
                  t.getExtension("MOZ_OES_vertex_array_object") ||
                  t.getExtension("WEBKIT_OES_vertex_array_object"),
                uint32ElementIndex: t.getExtension("OES_element_index_uint"),
                floatTexture: t.getExtension("OES_texture_float"),
                floatTextureLinear: t.getExtension("OES_texture_float_linear"),
                textureHalfFloat: t.getExtension("OES_texture_half_float"),
                textureHalfFloatLinear: t.getExtension(
                  "OES_texture_half_float_linear"
                ),
              })
            : 2 === this.webGLVersion &&
              Object.assign(this.extensions, e, {
                colorBufferFloat: t.getExtension("EXT_color_buffer_float"),
              });
        }),
        (e.prototype.handleContextLost = function (t) {
          t.preventDefault();
        }),
        (e.prototype.handleContextRestored = function () {
          this.renderer.runners.contextChange.emit(this.gl);
        }),
        (e.prototype.destroy = function () {
          var t = this.renderer.view;
          (this.renderer = null),
            t.removeEventListener("webglcontextlost", this.handleContextLost),
            t.removeEventListener(
              "webglcontextrestored",
              this.handleContextRestored
            ),
            this.gl.useProgram(null),
            this.extensions.loseContext &&
              this.extensions.loseContext.loseContext();
        }),
        (e.prototype.postrender = function () {
          this.renderer.renderingToScreen && this.gl.flush();
        }),
        (e.prototype.validateContext = function (t) {
          var e = t.getContextAttributes(),
            r =
              "WebGL2RenderingContext" in globalThis &&
              t instanceof globalThis.WebGL2RenderingContext;
          r && (this.webGLVersion = 2),
            e.stencil ||
              console.warn(
                "Provided WebGL context does not have a stencil buffer, masks may not render correctly"
              );
          var i = r || !!t.getExtension("OES_element_index_uint");
          (this.supports.uint32Indices = i),
            i ||
              console.warn(
                "Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly"
              );
        }),
        e
      );
    })(),
    fn = function (e) {
      (this.framebuffer = e),
        (this.stencil = null),
        (this.dirtyId = -1),
        (this.dirtyFormat = -1),
        (this.dirtySize = -1),
        (this.multisample = t.MSAA_QUALITY.NONE),
        (this.msaaBuffer = null),
        (this.blitFramebuffer = null),
        (this.mipLevel = 0);
    },
    pn = new _r(),
    _n = (function () {
      function e(t) {
        (this.renderer = t),
          (this.managedFramebuffers = []),
          (this.unknownFramebuffer = new Bi(10, 10)),
          (this.msaaSamples = null);
      }
      return (
        (e.prototype.contextChange = function () {
          var e = (this.gl = this.renderer.gl);
          if (
            ((this.CONTEXT_UID = this.renderer.CONTEXT_UID),
            (this.current = this.unknownFramebuffer),
            (this.viewport = new _r()),
            (this.hasMRT = !0),
            (this.writeDepthTexture = !0),
            this.disposeAll(!0),
            1 === this.renderer.context.webGLVersion)
          ) {
            var r = this.renderer.context.extensions.drawBuffers,
              i = this.renderer.context.extensions.depthTexture;
            bt.PREFER_ENV === t.ENV.WEBGL_LEGACY && ((r = null), (i = null)),
              r
                ? (e.drawBuffers = function (t) {
                    return r.drawBuffersWEBGL(t);
                  })
                : ((this.hasMRT = !1), (e.drawBuffers = function () {})),
              i || (this.writeDepthTexture = !1);
          } else
            this.msaaSamples = e.getInternalformatParameter(
              e.RENDERBUFFER,
              e.RGBA8,
              e.SAMPLES
            );
        }),
        (e.prototype.bind = function (t, e, r) {
          void 0 === r && (r = 0);
          var i = this.gl;
          if (t) {
            var n =
              t.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t);
            this.current !== t &&
              ((this.current = t),
              i.bindFramebuffer(i.FRAMEBUFFER, n.framebuffer)),
              n.mipLevel !== r &&
                (t.dirtyId++, t.dirtyFormat++, (n.mipLevel = r)),
              n.dirtyId !== t.dirtyId &&
                ((n.dirtyId = t.dirtyId),
                n.dirtyFormat !== t.dirtyFormat
                  ? ((n.dirtyFormat = t.dirtyFormat),
                    (n.dirtySize = t.dirtySize),
                    this.updateFramebuffer(t, r))
                  : n.dirtySize !== t.dirtySize &&
                    ((n.dirtySize = t.dirtySize), this.resizeFramebuffer(t)));
            for (var o = 0; o < t.colorTextures.length; o++) {
              var s = t.colorTextures[o];
              this.renderer.texture.unbind(s.parentTextureArray || s);
            }
            if (
              (t.depthTexture && this.renderer.texture.unbind(t.depthTexture),
              e)
            ) {
              var a = e.width >> r,
                h = e.height >> r,
                u = a / e.width;
              this.setViewport(e.x * u, e.y * u, a, h);
            } else {
              (a = t.width >> r), (h = t.height >> r);
              this.setViewport(0, 0, a, h);
            }
          } else
            this.current &&
              ((this.current = null), i.bindFramebuffer(i.FRAMEBUFFER, null)),
              e
                ? this.setViewport(e.x, e.y, e.width, e.height)
                : this.setViewport(
                    0,
                    0,
                    this.renderer.width,
                    this.renderer.height
                  );
        }),
        (e.prototype.setViewport = function (t, e, r, i) {
          var n = this.viewport;
          (t = Math.round(t)),
            (e = Math.round(e)),
            (r = Math.round(r)),
            (i = Math.round(i)),
            (n.width === r && n.height === i && n.x === t && n.y === e) ||
              ((n.x = t),
              (n.y = e),
              (n.width = r),
              (n.height = i),
              this.gl.viewport(t, e, r, i));
        }),
        Object.defineProperty(e.prototype, "size", {
          get: function () {
            return this.current
              ? {
                  x: 0,
                  y: 0,
                  width: this.current.width,
                  height: this.current.height,
                }
              : {
                  x: 0,
                  y: 0,
                  width: this.renderer.width,
                  height: this.renderer.height,
                };
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.clear = function (e, r, i, n, o) {
          void 0 === o && (o = t.BUFFER_BITS.COLOR | t.BUFFER_BITS.DEPTH);
          var s = this.gl;
          s.clearColor(e, r, i, n), s.clear(o);
        }),
        (e.prototype.initFramebuffer = function (t) {
          var e = this.gl,
            r = new fn(e.createFramebuffer());
          return (
            (r.multisample = this.detectSamples(t.multisample)),
            (t.glFramebuffers[this.CONTEXT_UID] = r),
            this.managedFramebuffers.push(t),
            t.disposeRunner.add(this),
            r
          );
        }),
        (e.prototype.resizeFramebuffer = function (t) {
          var e = this.gl,
            r = t.glFramebuffers[this.CONTEXT_UID];
          r.msaaBuffer &&
            (e.bindRenderbuffer(e.RENDERBUFFER, r.msaaBuffer),
            e.renderbufferStorageMultisample(
              e.RENDERBUFFER,
              r.multisample,
              e.RGBA8,
              t.width,
              t.height
            )),
            r.stencil &&
              (e.bindRenderbuffer(e.RENDERBUFFER, r.stencil),
              r.msaaBuffer
                ? e.renderbufferStorageMultisample(
                    e.RENDERBUFFER,
                    r.multisample,
                    e.DEPTH24_STENCIL8,
                    t.width,
                    t.height
                  )
                : e.renderbufferStorage(
                    e.RENDERBUFFER,
                    e.DEPTH_STENCIL,
                    t.width,
                    t.height
                  ));
          var i = t.colorTextures,
            n = i.length;
          e.drawBuffers || (n = Math.min(n, 1));
          for (var o = 0; o < n; o++) {
            var s = i[o],
              a = s.parentTextureArray || s;
            this.renderer.texture.bind(a, 0);
          }
          t.depthTexture &&
            this.writeDepthTexture &&
            this.renderer.texture.bind(t.depthTexture, 0);
        }),
        (e.prototype.updateFramebuffer = function (t, e) {
          var r = this.gl,
            i = t.glFramebuffers[this.CONTEXT_UID],
            n = t.colorTextures,
            o = n.length;
          r.drawBuffers || (o = Math.min(o, 1)),
            i.multisample > 1 && this.canMultisampleFramebuffer(t)
              ? ((i.msaaBuffer = i.msaaBuffer || r.createRenderbuffer()),
                r.bindRenderbuffer(r.RENDERBUFFER, i.msaaBuffer),
                r.renderbufferStorageMultisample(
                  r.RENDERBUFFER,
                  i.multisample,
                  r.RGBA8,
                  t.width,
                  t.height
                ),
                r.framebufferRenderbuffer(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.RENDERBUFFER,
                  i.msaaBuffer
                ))
              : i.msaaBuffer &&
                (r.deleteRenderbuffer(i.msaaBuffer),
                (i.msaaBuffer = null),
                i.blitFramebuffer &&
                  (i.blitFramebuffer.dispose(), (i.blitFramebuffer = null)));
          for (var s = [], a = 0; a < o; a++) {
            var h = n[a],
              u = h.parentTextureArray || h;
            this.renderer.texture.bind(u, 0),
              (0 === a && i.msaaBuffer) ||
                (r.framebufferTexture2D(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0 + a,
                  h.target,
                  u._glTextures[this.CONTEXT_UID].texture,
                  e
                ),
                s.push(r.COLOR_ATTACHMENT0 + a));
          }
          if (
            (s.length > 1 && r.drawBuffers(s), t.depthTexture) &&
            this.writeDepthTexture
          ) {
            var l = t.depthTexture;
            this.renderer.texture.bind(l, 0),
              r.framebufferTexture2D(
                r.FRAMEBUFFER,
                r.DEPTH_ATTACHMENT,
                r.TEXTURE_2D,
                l._glTextures[this.CONTEXT_UID].texture,
                e
              );
          }
          (!t.stencil && !t.depth) || (t.depthTexture && this.writeDepthTexture)
            ? i.stencil && (r.deleteRenderbuffer(i.stencil), (i.stencil = null))
            : ((i.stencil = i.stencil || r.createRenderbuffer()),
              r.bindRenderbuffer(r.RENDERBUFFER, i.stencil),
              i.msaaBuffer
                ? r.renderbufferStorageMultisample(
                    r.RENDERBUFFER,
                    i.multisample,
                    r.DEPTH24_STENCIL8,
                    t.width,
                    t.height
                  )
                : r.renderbufferStorage(
                    r.RENDERBUFFER,
                    r.DEPTH_STENCIL,
                    t.width,
                    t.height
                  ),
              r.framebufferRenderbuffer(
                r.FRAMEBUFFER,
                r.DEPTH_STENCIL_ATTACHMENT,
                r.RENDERBUFFER,
                i.stencil
              ));
        }),
        (e.prototype.canMultisampleFramebuffer = function (t) {
          return (
            1 !== this.renderer.context.webGLVersion &&
            t.colorTextures.length <= 1 &&
            !t.depthTexture
          );
        }),
        (e.prototype.detectSamples = function (e) {
          var r = this.msaaSamples,
            i = t.MSAA_QUALITY.NONE;
          if (e <= 1 || null === r) return i;
          for (var n = 0; n < r.length; n++)
            if (r[n] <= e) {
              i = r[n];
              break;
            }
          return 1 === i && (i = t.MSAA_QUALITY.NONE), i;
        }),
        (e.prototype.blit = function (t, e, r) {
          var i = this,
            n = i.current,
            o = i.renderer,
            s = i.gl,
            a = i.CONTEXT_UID;
          if (2 === o.context.webGLVersion && n) {
            var h = n.glFramebuffers[a];
            if (h) {
              if (!t) {
                if (!h.msaaBuffer) return;
                var u = n.colorTextures[0];
                if (!u) return;
                h.blitFramebuffer ||
                  ((h.blitFramebuffer = new Bi(n.width, n.height)),
                  h.blitFramebuffer.addColorTexture(0, u)),
                  (t = h.blitFramebuffer).colorTextures[0] !== u &&
                    ((t.colorTextures[0] = u), t.dirtyId++, t.dirtyFormat++),
                  (t.width === n.width && t.height === n.height) ||
                    ((t.width = n.width),
                    (t.height = n.height),
                    t.dirtyId++,
                    t.dirtySize++);
              }
              e || (((e = pn).width = n.width), (e.height = n.height)),
                r || (r = e);
              var l = e.width === r.width && e.height === r.height;
              this.bind(t),
                s.bindFramebuffer(s.READ_FRAMEBUFFER, h.framebuffer),
                s.blitFramebuffer(
                  e.left,
                  e.top,
                  e.right,
                  e.bottom,
                  r.left,
                  r.top,
                  r.right,
                  r.bottom,
                  s.COLOR_BUFFER_BIT,
                  l ? s.NEAREST : s.LINEAR
                );
            }
          }
        }),
        (e.prototype.disposeFramebuffer = function (t, e) {
          var r = t.glFramebuffers[this.CONTEXT_UID],
            i = this.gl;
          if (r) {
            delete t.glFramebuffers[this.CONTEXT_UID];
            var n = this.managedFramebuffers.indexOf(t);
            n >= 0 && this.managedFramebuffers.splice(n, 1),
              t.disposeRunner.remove(this),
              e ||
                (i.deleteFramebuffer(r.framebuffer),
                r.msaaBuffer && i.deleteRenderbuffer(r.msaaBuffer),
                r.stencil && i.deleteRenderbuffer(r.stencil)),
              r.blitFramebuffer && r.blitFramebuffer.dispose();
          }
        }),
        (e.prototype.disposeAll = function (t) {
          var e = this.managedFramebuffers;
          this.managedFramebuffers = [];
          for (var r = 0; r < e.length; r++) this.disposeFramebuffer(e[r], t);
        }),
        (e.prototype.forceStencil = function () {
          var t = this.current;
          if (t) {
            var e = t.glFramebuffers[this.CONTEXT_UID];
            if (e && !e.stencil) {
              t.stencil = !0;
              var r = t.width,
                i = t.height,
                n = this.gl,
                o = n.createRenderbuffer();
              n.bindRenderbuffer(n.RENDERBUFFER, o),
                e.msaaBuffer
                  ? n.renderbufferStorageMultisample(
                      n.RENDERBUFFER,
                      e.multisample,
                      n.DEPTH24_STENCIL8,
                      r,
                      i
                    )
                  : n.renderbufferStorage(
                      n.RENDERBUFFER,
                      n.DEPTH_STENCIL,
                      r,
                      i
                    ),
                (e.stencil = o),
                n.framebufferRenderbuffer(
                  n.FRAMEBUFFER,
                  n.DEPTH_STENCIL_ATTACHMENT,
                  n.RENDERBUFFER,
                  o
                );
            }
          }
        }),
        (e.prototype.reset = function () {
          (this.current = this.unknownFramebuffer), (this.viewport = new _r());
        }),
        (e.prototype.destroy = function () {
          this.renderer = null;
        }),
        e
      );
    })(),
    vn = { 5126: 4, 5123: 2, 5121: 1 },
    mn = (function () {
      function e(t) {
        (this.renderer = t),
          (this._activeGeometry = null),
          (this._activeVao = null),
          (this.hasVao = !0),
          (this.hasInstance = !0),
          (this.canUseUInt32ElementIndex = !1),
          (this.managedGeometries = {});
      }
      return (
        (e.prototype.contextChange = function () {
          this.disposeAll(!0);
          var e = (this.gl = this.renderer.gl),
            r = this.renderer.context;
          if (
            ((this.CONTEXT_UID = this.renderer.CONTEXT_UID),
            2 !== r.webGLVersion)
          ) {
            var i = this.renderer.context.extensions.vertexArrayObject;
            bt.PREFER_ENV === t.ENV.WEBGL_LEGACY && (i = null),
              i
                ? ((e.createVertexArray = function () {
                    return i.createVertexArrayOES();
                  }),
                  (e.bindVertexArray = function (t) {
                    return i.bindVertexArrayOES(t);
                  }),
                  (e.deleteVertexArray = function (t) {
                    return i.deleteVertexArrayOES(t);
                  }))
                : ((this.hasVao = !1),
                  (e.createVertexArray = function () {
                    return null;
                  }),
                  (e.bindVertexArray = function () {
                    return null;
                  }),
                  (e.deleteVertexArray = function () {
                    return null;
                  }));
          }
          if (2 !== r.webGLVersion) {
            var n = e.getExtension("ANGLE_instanced_arrays");
            n
              ? ((e.vertexAttribDivisor = function (t, e) {
                  return n.vertexAttribDivisorANGLE(t, e);
                }),
                (e.drawElementsInstanced = function (t, e, r, i, o) {
                  return n.drawElementsInstancedANGLE(t, e, r, i, o);
                }),
                (e.drawArraysInstanced = function (t, e, r, i) {
                  return n.drawArraysInstancedANGLE(t, e, r, i);
                }))
              : (this.hasInstance = !1);
          }
          this.canUseUInt32ElementIndex =
            2 === r.webGLVersion || !!r.extensions.uint32ElementIndex;
        }),
        (e.prototype.bind = function (t, e) {
          e = e || this.renderer.shader.shader;
          var r = this.gl,
            i = t.glVertexArrayObjects[this.CONTEXT_UID],
            n = !1;
          i ||
            ((this.managedGeometries[t.id] = t),
            t.disposeRunner.add(this),
            (t.glVertexArrayObjects[this.CONTEXT_UID] = i = {}),
            (n = !0));
          var o = i[e.program.id] || this.initGeometryVao(t, e, n);
          (this._activeGeometry = t),
            this._activeVao !== o &&
              ((this._activeVao = o),
              this.hasVao
                ? r.bindVertexArray(o)
                : this.activateVao(t, e.program)),
            this.updateBuffers();
        }),
        (e.prototype.reset = function () {
          this.unbind();
        }),
        (e.prototype.updateBuffers = function () {
          for (
            var t = this._activeGeometry, e = this.renderer.buffer, r = 0;
            r < t.buffers.length;
            r++
          ) {
            var i = t.buffers[r];
            e.update(i);
          }
        }),
        (e.prototype.checkCompatibility = function (t, e) {
          var r = t.attributes,
            i = e.attributeData;
          for (var n in i)
            if (!r[n])
              throw new Error(
                'shader and geometry incompatible, geometry missing the "' +
                  n +
                  '" attribute'
              );
        }),
        (e.prototype.getSignature = function (t, e) {
          var r = t.attributes,
            i = e.attributeData,
            n = ["g", t.id];
          for (var o in r) i[o] && n.push(o, i[o].location);
          return n.join("-");
        }),
        (e.prototype.initGeometryVao = function (t, e, r) {
          void 0 === r && (r = !0);
          var i = this.gl,
            n = this.CONTEXT_UID,
            o = this.renderer.buffer,
            s = e.program;
          s.glPrograms[n] || this.renderer.shader.generateProgram(e),
            this.checkCompatibility(t, s);
          var a = this.getSignature(t, s),
            h = t.glVertexArrayObjects[this.CONTEXT_UID],
            u = h[a];
          if (u) return (h[s.id] = u), u;
          var l = t.buffers,
            c = t.attributes,
            d = {},
            f = {};
          for (var p in l) (d[p] = 0), (f[p] = 0);
          for (var p in c)
            !c[p].size && s.attributeData[p]
              ? (c[p].size = s.attributeData[p].size)
              : c[p].size ||
                console.warn(
                  "PIXI Geometry attribute '" +
                    p +
                    "' size cannot be determined (likely the bound shader does not have the attribute)"
                ),
              (d[c[p].buffer] += c[p].size * vn[c[p].type]);
          for (var p in c) {
            var _ = c[p],
              v = _.size;
            void 0 === _.stride &&
              (d[_.buffer] === v * vn[_.type]
                ? (_.stride = 0)
                : (_.stride = d[_.buffer])),
              void 0 === _.start &&
                ((_.start = f[_.buffer]), (f[_.buffer] += v * vn[_.type]));
          }
          (u = i.createVertexArray()), i.bindVertexArray(u);
          for (var m = 0; m < l.length; m++) {
            var E = l[m];
            o.bind(E), r && E._glBuffers[n].refCount++;
          }
          return (
            this.activateVao(t, s),
            (this._activeVao = u),
            (h[s.id] = u),
            (h[a] = u),
            u
          );
        }),
        (e.prototype.disposeGeometry = function (t, e) {
          var r;
          if (this.managedGeometries[t.id]) {
            delete this.managedGeometries[t.id];
            var i = t.glVertexArrayObjects[this.CONTEXT_UID],
              n = this.gl,
              o = t.buffers,
              s =
                null === (r = this.renderer) || void 0 === r
                  ? void 0
                  : r.buffer;
            if ((t.disposeRunner.remove(this), i)) {
              if (s)
                for (var a = 0; a < o.length; a++) {
                  var h = o[a]._glBuffers[this.CONTEXT_UID];
                  h &&
                    (h.refCount--, 0 !== h.refCount || e || s.dispose(o[a], e));
                }
              if (!e)
                for (var u in i)
                  if ("g" === u[0]) {
                    var l = i[u];
                    this._activeVao === l && this.unbind(),
                      n.deleteVertexArray(l);
                  }
              delete t.glVertexArrayObjects[this.CONTEXT_UID];
            }
          }
        }),
        (e.prototype.disposeAll = function (t) {
          for (
            var e = Object.keys(this.managedGeometries), r = 0;
            r < e.length;
            r++
          )
            this.disposeGeometry(this.managedGeometries[e[r]], t);
        }),
        (e.prototype.activateVao = function (t, e) {
          var r = this.gl,
            i = this.CONTEXT_UID,
            n = this.renderer.buffer,
            o = t.buffers,
            s = t.attributes;
          t.indexBuffer && n.bind(t.indexBuffer);
          var a = null;
          for (var h in s) {
            var u = s[h],
              l = o[u.buffer],
              c = l._glBuffers[i];
            if (e.attributeData[h]) {
              a !== c && (n.bind(l), (a = c));
              var d = e.attributeData[h].location;
              if (
                (r.enableVertexAttribArray(d),
                r.vertexAttribPointer(
                  d,
                  u.size,
                  u.type || r.FLOAT,
                  u.normalized,
                  u.stride,
                  u.start
                ),
                u.instance)
              ) {
                if (!this.hasInstance)
                  throw new Error(
                    "geometry error, GPU Instancing is not supported on this device"
                  );
                r.vertexAttribDivisor(d, 1);
              }
            }
          }
        }),
        (e.prototype.draw = function (t, e, r, i) {
          var n = this.gl,
            o = this._activeGeometry;
          if (o.indexBuffer) {
            var s = o.indexBuffer.data.BYTES_PER_ELEMENT,
              a = 2 === s ? n.UNSIGNED_SHORT : n.UNSIGNED_INT;
            2 === s || (4 === s && this.canUseUInt32ElementIndex)
              ? o.instanced
                ? n.drawElementsInstanced(
                    t,
                    e || o.indexBuffer.data.length,
                    a,
                    (r || 0) * s,
                    i || 1
                  )
                : n.drawElements(
                    t,
                    e || o.indexBuffer.data.length,
                    a,
                    (r || 0) * s
                  )
              : console.warn("unsupported index buffer type: uint32");
          } else
            o.instanced
              ? n.drawArraysInstanced(t, r, e || o.getSize(), i || 1)
              : n.drawArrays(t, r, e || o.getSize());
          return this;
        }),
        (e.prototype.unbind = function () {
          this.gl.bindVertexArray(null),
            (this._activeVao = null),
            (this._activeGeometry = null);
        }),
        (e.prototype.destroy = function () {
          this.renderer = null;
        }),
        e
      );
    })(),
    En = (function () {
      function e(e) {
        void 0 === e && (e = null),
          (this.type = t.MASK_TYPES.NONE),
          (this.autoDetect = !0),
          (this.maskObject = e || null),
          (this.pooled = !1),
          (this.isMaskData = !0),
          (this.resolution = null),
          (this.multisample = bt.FILTER_MULTISAMPLE),
          (this.enabled = !0),
          (this._filters = null),
          (this._stencilCounter = 0),
          (this._scissorCounter = 0),
          (this._scissorRect = null),
          (this._scissorRectLocal = null),
          (this._target = null);
      }
      return (
        Object.defineProperty(e.prototype, "filter", {
          get: function () {
            return this._filters ? this._filters[0] : null;
          },
          set: function (t) {
            t
              ? this._filters
                ? (this._filters[0] = t)
                : (this._filters = [t])
              : (this._filters = null);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.reset = function () {
          this.pooled &&
            ((this.maskObject = null),
            (this.type = t.MASK_TYPES.NONE),
            (this.autoDetect = !0)),
            (this._target = null),
            (this._scissorRectLocal = null);
        }),
        (e.prototype.copyCountersOrReset = function (t) {
          t
            ? ((this._stencilCounter = t._stencilCounter),
              (this._scissorCounter = t._scissorCounter),
              (this._scissorRect = t._scissorRect))
            : ((this._stencilCounter = 0),
              (this._scissorCounter = 0),
              (this._scissorRect = null));
        }),
        e
      );
    })();
  function Tn(t, e, r) {
    var i = t.createShader(e);
    return t.shaderSource(i, r), t.compileShader(i), i;
  }
  function yn(t, e) {
    var r = t
        .getShaderSource(e)
        .split("\n")
        .map(function (t, e) {
          return e + ": " + t;
        }),
      i = t.getShaderInfoLog(e),
      n = i.split("\n"),
      o = {},
      s = n
        .map(function (t) {
          return parseFloat(t.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
        })
        .filter(function (t) {
          return !(!t || o[t]) && ((o[t] = !0), !0);
        }),
      a = [""];
    s.forEach(function (t) {
      (r[t - 1] = "%c" + r[t - 1] + "%c"),
        a.push(
          "background: #FF0000; color:#FFFFFF; font-size: 10px",
          "font-size: 10px"
        );
    });
    var h = r.join("\n");
    (a[0] = h),
      console.error(i),
      console.groupCollapsed("click to view full shader code"),
      console.warn.apply(console, a),
      console.groupEnd();
  }
  function gn(t) {
    for (var e = new Array(t), r = 0; r < e.length; r++) e[r] = !1;
    return e;
  }
  function bn(t, e) {
    switch (t) {
      case "float":
      case "int":
      case "uint":
      case "sampler2D":
      case "sampler2DArray":
        return 0;
      case "vec2":
        return new Float32Array(2 * e);
      case "vec3":
        return new Float32Array(3 * e);
      case "vec4":
        return new Float32Array(4 * e);
      case "ivec2":
        return new Int32Array(2 * e);
      case "ivec3":
        return new Int32Array(3 * e);
      case "ivec4":
        return new Int32Array(4 * e);
      case "uvec2":
        return new Uint32Array(2 * e);
      case "uvec3":
        return new Uint32Array(3 * e);
      case "uvec4":
        return new Uint32Array(4 * e);
      case "bool":
        return !1;
      case "bvec2":
        return gn(2 * e);
      case "bvec3":
        return gn(3 * e);
      case "bvec4":
        return gn(4 * e);
      case "mat2":
        return new Float32Array([1, 0, 0, 1]);
      case "mat3":
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
      case "mat4":
        return new Float32Array([
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]);
    }
    return null;
  }
  var Rn,
    An = {},
    xn = An;
  function Sn() {
    if (xn === An || (xn && xn.isContextLost())) {
      var e = document.createElement("canvas"),
        r = void 0;
      bt.PREFER_ENV >= t.ENV.WEBGL2 && (r = e.getContext("webgl2", {})),
        r ||
          ((r =
            e.getContext("webgl", {}) || e.getContext("experimental-webgl", {}))
            ? r.getExtension("WEBGL_draw_buffers")
            : (r = null)),
        (xn = r);
    }
    return xn;
  }
  function On(e, r, i) {
    if ("precision" !== e.substring(0, 9)) {
      var n = r;
      return (
        r === t.PRECISION.HIGH &&
          i !== t.PRECISION.HIGH &&
          (n = t.PRECISION.MEDIUM),
        "precision " + n + " float;\n" + e
      );
    }
    return i !== t.PRECISION.HIGH && "precision highp" === e.substring(0, 15)
      ? e.replace("precision highp", "precision mediump")
      : e;
  }
  var In = {
    float: 1,
    vec2: 2,
    vec3: 3,
    vec4: 4,
    int: 1,
    ivec2: 2,
    ivec3: 3,
    ivec4: 4,
    uint: 1,
    uvec2: 2,
    uvec3: 3,
    uvec4: 4,
    bool: 1,
    bvec2: 2,
    bvec3: 3,
    bvec4: 4,
    mat2: 4,
    mat3: 9,
    mat4: 16,
    sampler2D: 1,
  };
  function Pn(t) {
    return In[t];
  }
  var Mn = null,
    Nn = {
      FLOAT: "float",
      FLOAT_VEC2: "vec2",
      FLOAT_VEC3: "vec3",
      FLOAT_VEC4: "vec4",
      INT: "int",
      INT_VEC2: "ivec2",
      INT_VEC3: "ivec3",
      INT_VEC4: "ivec4",
      UNSIGNED_INT: "uint",
      UNSIGNED_INT_VEC2: "uvec2",
      UNSIGNED_INT_VEC3: "uvec3",
      UNSIGNED_INT_VEC4: "uvec4",
      BOOL: "bool",
      BOOL_VEC2: "bvec2",
      BOOL_VEC3: "bvec3",
      BOOL_VEC4: "bvec4",
      FLOAT_MAT2: "mat2",
      FLOAT_MAT3: "mat3",
      FLOAT_MAT4: "mat4",
      SAMPLER_2D: "sampler2D",
      INT_SAMPLER_2D: "sampler2D",
      UNSIGNED_INT_SAMPLER_2D: "sampler2D",
      SAMPLER_CUBE: "samplerCube",
      INT_SAMPLER_CUBE: "samplerCube",
      UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
      SAMPLER_2D_ARRAY: "sampler2DArray",
      INT_SAMPLER_2D_ARRAY: "sampler2DArray",
      UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray",
    };
  function Dn(t, e) {
    if (!Mn) {
      var r = Object.keys(Nn);
      Mn = {};
      for (var i = 0; i < r.length; ++i) {
        var n = r[i];
        Mn[t[n]] = Nn[n];
      }
    }
    return Mn[e];
  }
  var Cn = [
      {
        test: function (t) {
          return "float" === t.type && 1 === t.size;
        },
        code: function (t) {
          return (
            '\n            if(uv["' +
            t +
            '"] !== ud["' +
            t +
            '"].value)\n            {\n                ud["' +
            t +
            '"].value = uv["' +
            t +
            '"]\n                gl.uniform1f(ud["' +
            t +
            '"].location, uv["' +
            t +
            '"])\n            }\n            '
          );
        },
      },
      {
        test: function (t) {
          return (
            ("sampler2D" === t.type ||
              "samplerCube" === t.type ||
              "sampler2DArray" === t.type) &&
            1 === t.size &&
            !t.isArray
          );
        },
        code: function (t) {
          return (
            't = syncData.textureCount++;\n\n            renderer.texture.bind(uv["' +
            t +
            '"], t);\n\n            if(ud["' +
            t +
            '"].value !== t)\n            {\n                ud["' +
            t +
            '"].value = t;\n                gl.uniform1i(ud["' +
            t +
            '"].location, t);\n; // eslint-disable-line max-len\n            }'
          );
        },
      },
      {
        test: function (t, e) {
          return "mat3" === t.type && 1 === t.size && void 0 !== e.a;
        },
        code: function (t) {
          return (
            '\n            gl.uniformMatrix3fv(ud["' +
            t +
            '"].location, false, uv["' +
            t +
            '"].toArray(true));\n            '
          );
        },
        codeUbo: function (t) {
          return (
            "\n                var " +
            t +
            "_matrix = uv." +
            t +
            ".toArray(true);\n\n                data[offset] = " +
            t +
            "_matrix[0];\n                data[offset+1] = " +
            t +
            "_matrix[1];\n                data[offset+2] = " +
            t +
            "_matrix[2];\n        \n                data[offset + 4] = " +
            t +
            "_matrix[3];\n                data[offset + 5] = " +
            t +
            "_matrix[4];\n                data[offset + 6] = " +
            t +
            "_matrix[5];\n        \n                data[offset + 8] = " +
            t +
            "_matrix[6];\n                data[offset + 9] = " +
            t +
            "_matrix[7];\n                data[offset + 10] = " +
            t +
            "_matrix[8];\n            "
          );
        },
      },
      {
        test: function (t, e) {
          return "vec2" === t.type && 1 === t.size && void 0 !== e.x;
        },
        code: function (t) {
          return (
            '\n                cv = ud["' +
            t +
            '"].value;\n                v = uv["' +
            t +
            '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud["' +
            t +
            '"].location, v.x, v.y);\n                }'
          );
        },
        codeUbo: function (t) {
          return (
            "\n                v = uv." +
            t +
            ";\n\n                data[offset] = v.x;\n                data[offset+1] = v.y;\n            "
          );
        },
      },
      {
        test: function (t) {
          return "vec2" === t.type && 1 === t.size;
        },
        code: function (t) {
          return (
            '\n                cv = ud["' +
            t +
            '"].value;\n                v = uv["' +
            t +
            '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud["' +
            t +
            '"].location, v[0], v[1]);\n                }\n            '
          );
        },
      },
      {
        test: function (t, e) {
          return "vec4" === t.type && 1 === t.size && void 0 !== e.width;
        },
        code: function (t) {
          return (
            '\n                cv = ud["' +
            t +
            '"].value;\n                v = uv["' +
            t +
            '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud["' +
            t +
            '"].location, v.x, v.y, v.width, v.height)\n                }'
          );
        },
        codeUbo: function (t) {
          return (
            "\n                    v = uv." +
            t +
            ";\n\n                    data[offset] = v.x;\n                    data[offset+1] = v.y;\n                    data[offset+2] = v.width;\n                    data[offset+3] = v.height;\n                "
          );
        },
      },
      {
        test: function (t) {
          return "vec4" === t.type && 1 === t.size;
        },
        code: function (t) {
          return (
            '\n                cv = ud["' +
            t +
            '"].value;\n                v = uv["' +
            t +
            '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud["' +
            t +
            '"].location, v[0], v[1], v[2], v[3])\n                }'
          );
        },
      },
    ],
    wn = {
      float:
        "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1f(location, v);\n    }",
      vec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2f(location, v[0], v[1])\n    }",
      vec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
      vec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4f(location, v[0], v[1], v[2], v[3]);\n    }",
      int: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }",
      ivec2:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
      ivec3:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
      ivec4:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
      uint: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1ui(location, v);\n    }",
      uvec2:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2ui(location, v[0], v[1]);\n    }",
      uvec3:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3ui(location, v[0], v[1], v[2]);\n    }",
      uvec4:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);\n    }",
      bool: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1i(location, v);\n    }",
      bvec2:
        "\n    if (cv[0] != v[0] || cv[1] != v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
      bvec3:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
      bvec4:
        "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
      mat2: "gl.uniformMatrix2fv(location, false, v)",
      mat3: "gl.uniformMatrix3fv(location, false, v)",
      mat4: "gl.uniformMatrix4fv(location, false, v)",
      sampler2D: "gl.uniform1i(location, v)",
      samplerCube: "gl.uniform1i(location, v)",
      sampler2DArray: "gl.uniform1i(location, v)",
    },
    Ln = {
      float: "gl.uniform1fv(location, v)",
      vec2: "gl.uniform2fv(location, v)",
      vec3: "gl.uniform3fv(location, v)",
      vec4: "gl.uniform4fv(location, v)",
      mat4: "gl.uniformMatrix4fv(location, false, v)",
      mat3: "gl.uniformMatrix3fv(location, false, v)",
      mat2: "gl.uniformMatrix2fv(location, false, v)",
      int: "gl.uniform1iv(location, v)",
      ivec2: "gl.uniform2iv(location, v)",
      ivec3: "gl.uniform3iv(location, v)",
      ivec4: "gl.uniform4iv(location, v)",
      uint: "gl.uniform1uiv(location, v)",
      uvec2: "gl.uniform2uiv(location, v)",
      uvec3: "gl.uniform3uiv(location, v)",
      uvec4: "gl.uniform4uiv(location, v)",
      bool: "gl.uniform1iv(location, v)",
      bvec2: "gl.uniform2iv(location, v)",
      bvec3: "gl.uniform3iv(location, v)",
      bvec4: "gl.uniform4iv(location, v)",
      sampler2D: "gl.uniform1iv(location, v)",
      samplerCube: "gl.uniform1iv(location, v)",
      sampler2DArray: "gl.uniform1iv(location, v)",
    };
  var Fn,
    Un = [
      "precision mediump float;",
      "void main(void){",
      "float test = 0.1;",
      "%forloop%",
      "gl_FragColor = vec4(0.0);",
      "}",
    ].join("\n");
  function Bn(t) {
    for (var e = "", r = 0; r < t; ++r)
      r > 0 && (e += "\nelse "),
        r < t - 1 && (e += "if(test == " + r + ".0){}");
    return e;
  }
  function Gn(t, e) {
    if (0 === t)
      throw new Error(
        "Invalid value of `0` passed to `checkMaxIfStatementsInShader`"
      );
    for (var r = e.createShader(e.FRAGMENT_SHADER); ; ) {
      var i = Un.replace(/%forloop%/gi, Bn(t));
      if (
        (e.shaderSource(r, i),
        e.compileShader(r),
        e.getShaderParameter(r, e.COMPILE_STATUS))
      )
        break;
      t = (t / 2) | 0;
    }
    return t;
  }
  var Xn = 0,
    kn = {},
    Hn = (function () {
      function e(r, i, n) {
        void 0 === n && (n = "pixi-shader"),
          (this.id = Xn++),
          (this.vertexSrc = r || e.defaultVertexSrc),
          (this.fragmentSrc = i || e.defaultFragmentSrc),
          (this.vertexSrc = this.vertexSrc.trim()),
          (this.fragmentSrc = this.fragmentSrc.trim()),
          "#version" !== this.vertexSrc.substring(0, 8) &&
            ((n = n.replace(/\s+/g, "-")),
            kn[n] ? (kn[n]++, (n += "-" + kn[n])) : (kn[n] = 1),
            (this.vertexSrc =
              "#define SHADER_NAME " + n + "\n" + this.vertexSrc),
            (this.fragmentSrc =
              "#define SHADER_NAME " + n + "\n" + this.fragmentSrc),
            (this.vertexSrc = On(
              this.vertexSrc,
              bt.PRECISION_VERTEX,
              t.PRECISION.HIGH
            )),
            (this.fragmentSrc = On(
              this.fragmentSrc,
              bt.PRECISION_FRAGMENT,
              (function () {
                if (!Rn) {
                  Rn = t.PRECISION.MEDIUM;
                  var e = Sn();
                  if (e && e.getShaderPrecisionFormat) {
                    var r = e.getShaderPrecisionFormat(
                      e.FRAGMENT_SHADER,
                      e.HIGH_FLOAT
                    );
                    Rn = r.precision ? t.PRECISION.HIGH : t.PRECISION.MEDIUM;
                  }
                }
                return Rn;
              })()
            ))),
          (this.glPrograms = {}),
          (this.syncUniforms = null);
      }
      return (
        Object.defineProperty(e, "defaultVertexSrc", {
          get: function () {
            return "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "defaultFragmentSrc", {
          get: function () {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.from = function (t, r, i) {
          var n = t + r,
            o = $e[n];
          return o || ($e[n] = o = new e(t, r, i)), o;
        }),
        e
      );
    })(),
    Yn = (function () {
      function t(t, e) {
        (this.uniformBindCount = 0),
          (this.program = t),
          (this.uniformGroup = e
            ? e instanceof nn
              ? e
              : new nn(e)
            : new nn({}));
      }
      return (
        (t.prototype.checkUniformExists = function (t, e) {
          if (e.uniforms[t]) return !0;
          for (var r in e.uniforms) {
            var i = e.uniforms[r];
            if (i.group && this.checkUniformExists(t, i)) return !0;
          }
          return !1;
        }),
        (t.prototype.destroy = function () {
          this.uniformGroup = null;
        }),
        Object.defineProperty(t.prototype, "uniforms", {
          get: function () {
            return this.uniformGroup.uniforms;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.from = function (e, r, i) {
          return new t(Hn.from(e, r), i);
        }),
        t
      );
    })(),
    jn = (function () {
      function e() {
        (this.data = 0),
          (this.blendMode = t.BLEND_MODES.NORMAL),
          (this.polygonOffset = 0),
          (this.blend = !0),
          (this.depthMask = !0);
      }
      return (
        Object.defineProperty(e.prototype, "blend", {
          get: function () {
            return !!(1 & this.data);
          },
          set: function (t) {
            !!(1 & this.data) !== t && (this.data ^= 1);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "offsets", {
          get: function () {
            return !!(2 & this.data);
          },
          set: function (t) {
            !!(2 & this.data) !== t && (this.data ^= 2);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "culling", {
          get: function () {
            return !!(4 & this.data);
          },
          set: function (t) {
            !!(4 & this.data) !== t && (this.data ^= 4);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "depthTest", {
          get: function () {
            return !!(8 & this.data);
          },
          set: function (t) {
            !!(8 & this.data) !== t && (this.data ^= 8);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "depthMask", {
          get: function () {
            return !!(32 & this.data);
          },
          set: function (t) {
            !!(32 & this.data) !== t && (this.data ^= 32);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "clockwiseFrontFace", {
          get: function () {
            return !!(16 & this.data);
          },
          set: function (t) {
            !!(16 & this.data) !== t && (this.data ^= 16);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "blendMode", {
          get: function () {
            return this._blendMode;
          },
          set: function (e) {
            (this.blend = e !== t.BLEND_MODES.NONE), (this._blendMode = e);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "polygonOffset", {
          get: function () {
            return this._polygonOffset;
          },
          set: function (t) {
            (this.offsets = !!t), (this._polygonOffset = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.toString = function () {
          return (
            "[@pixi/core:State blendMode=" +
            this.blendMode +
            " clockwiseFrontFace=" +
            this.clockwiseFrontFace +
            " culling=" +
            this.culling +
            " depthMask=" +
            this.depthMask +
            " polygonOffset=" +
            this.polygonOffset +
            "]"
          );
        }),
        (e.for2d = function () {
          var t = new e();
          return (t.depthTest = !1), (t.blend = !0), t;
        }),
        e
      );
    })(),
    Vn = (function (t) {
      function e(r, i, n) {
        var o = this,
          s = Hn.from(r || e.defaultVertexSrc, i || e.defaultFragmentSrc);
        return (
          ((o = t.call(this, s, n) || this).padding = 0),
          (o.resolution = bt.FILTER_RESOLUTION),
          (o.multisample = bt.FILTER_MULTISAMPLE),
          (o.enabled = !0),
          (o.autoFit = !0),
          (o.state = new jn()),
          o
        );
      }
      return (
        gi(e, t),
        (e.prototype.apply = function (t, e, r, i, n) {
          t.applyFilter(this, e, r, i);
        }),
        Object.defineProperty(e.prototype, "blendMode", {
          get: function () {
            return this.state.blendMode;
          },
          set: function (t) {
            this.state.blendMode = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "resolution", {
          get: function () {
            return this._resolution;
          },
          set: function (t) {
            this._resolution = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "defaultVertexSrc", {
          get: function () {
            return "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "defaultFragmentSrc", {
          get: function () {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(Yn),
    Wn = new gr(),
    zn = (function () {
      function t(t, e) {
        (this._texture = t),
          (this.mapCoord = new gr()),
          (this.uClampFrame = new Float32Array(4)),
          (this.uClampOffset = new Float32Array(2)),
          (this._textureID = -1),
          (this._updateID = 0),
          (this.clampOffset = 0),
          (this.clampMargin = void 0 === e ? 0.5 : e),
          (this.isSimple = !1);
      }
      return (
        Object.defineProperty(t.prototype, "texture", {
          get: function () {
            return this._texture;
          },
          set: function (t) {
            (this._texture = t), (this._textureID = -1);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.multiplyUvs = function (t, e) {
          void 0 === e && (e = t);
          for (var r = this.mapCoord, i = 0; i < t.length; i += 2) {
            var n = t[i],
              o = t[i + 1];
            (e[i] = n * r.a + o * r.c + r.tx),
              (e[i + 1] = n * r.b + o * r.d + r.ty);
          }
          return e;
        }),
        (t.prototype.update = function (t) {
          var e = this._texture;
          if (!e || !e.valid) return !1;
          if (!t && this._textureID === e._updateID) return !1;
          (this._textureID = e._updateID), this._updateID++;
          var r = e._uvs;
          this.mapCoord.set(
            r.x1 - r.x0,
            r.y1 - r.y0,
            r.x3 - r.x0,
            r.y3 - r.y0,
            r.x0,
            r.y0
          );
          var i = e.orig,
            n = e.trim;
          n &&
            (Wn.set(
              i.width / n.width,
              0,
              0,
              i.height / n.height,
              -n.x / n.width,
              -n.y / n.height
            ),
            this.mapCoord.append(Wn));
          var o = e.baseTexture,
            s = this.uClampFrame,
            a = this.clampMargin / o.resolution,
            h = this.clampOffset;
          return (
            (s[0] = (e._frame.x + a + h) / o.width),
            (s[1] = (e._frame.y + a + h) / o.height),
            (s[2] = (e._frame.x + e._frame.width - a + h) / o.width),
            (s[3] = (e._frame.y + e._frame.height - a + h) / o.height),
            (this.uClampOffset[0] = h / o.realWidth),
            (this.uClampOffset[1] = h / o.realHeight),
            (this.isSimple =
              e._frame.width === o.width &&
              e._frame.height === o.height &&
              0 === e.rotate),
            !0
          );
        }),
        t
      );
    })(),
    qn = (function (t) {
      function e(e, r, i) {
        var n = this,
          o = null;
        return (
          "string" != typeof e &&
            void 0 === r &&
            void 0 === i &&
            ((o = e), (e = void 0), (r = void 0), (i = void 0)),
          ((n =
            t.call(
              this,
              e ||
                "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n",
              r ||
                "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n",
              i
            ) || this).maskSprite = o),
          (n.maskMatrix = new gr()),
          n
        );
      }
      return (
        gi(e, t),
        Object.defineProperty(e.prototype, "maskSprite", {
          get: function () {
            return this._maskSprite;
          },
          set: function (t) {
            (this._maskSprite = t),
              this._maskSprite && (this._maskSprite.renderable = !1);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.apply = function (t, e, r, i) {
          var n = this._maskSprite,
            o = n._texture;
          o.valid &&
            (o.uvMatrix || (o.uvMatrix = new zn(o, 0)),
            o.uvMatrix.update(),
            (this.uniforms.npmAlpha = o.baseTexture.alphaMode ? 0 : 1),
            (this.uniforms.mask = o),
            (this.uniforms.otherMatrix = t
              .calculateSpriteMatrix(this.maskMatrix, n)
              .prepend(o.uvMatrix.mapCoord)),
            (this.uniforms.alpha = n.worldAlpha),
            (this.uniforms.maskClamp = o.uvMatrix.uClampFrame),
            t.applyFilter(this, e, r, i));
        }),
        e
      );
    })(Vn),
    Kn = (function () {
      function e(t) {
        (this.renderer = t),
          (this.enableScissor = !0),
          (this.alphaMaskPool = []),
          (this.maskDataPool = []),
          (this.maskStack = []),
          (this.alphaMaskIndex = 0);
      }
      return (
        (e.prototype.setMaskStack = function (t) {
          (this.maskStack = t),
            this.renderer.scissor.setMaskStack(t),
            this.renderer.stencil.setMaskStack(t);
        }),
        (e.prototype.push = function (e, r) {
          var i = r;
          if (!i.isMaskData) {
            var n = this.maskDataPool.pop() || new En();
            (n.pooled = !0), (n.maskObject = r), (i = n);
          }
          var o =
            0 !== this.maskStack.length
              ? this.maskStack[this.maskStack.length - 1]
              : null;
          if (
            (i.copyCountersOrReset(o),
            i.autoDetect && this.detect(i),
            (i._target = e),
            i.type !== t.MASK_TYPES.SPRITE && this.maskStack.push(i),
            i.enabled)
          )
            switch (i.type) {
              case t.MASK_TYPES.SCISSOR:
                this.renderer.scissor.push(i);
                break;
              case t.MASK_TYPES.STENCIL:
                this.renderer.stencil.push(i);
                break;
              case t.MASK_TYPES.SPRITE:
                i.copyCountersOrReset(null), this.pushSpriteMask(i);
            }
          i.type === t.MASK_TYPES.SPRITE && this.maskStack.push(i);
        }),
        (e.prototype.pop = function (e) {
          var r = this.maskStack.pop();
          if (r && r._target === e) {
            if (r.enabled)
              switch (r.type) {
                case t.MASK_TYPES.SCISSOR:
                  this.renderer.scissor.pop();
                  break;
                case t.MASK_TYPES.STENCIL:
                  this.renderer.stencil.pop(r.maskObject);
                  break;
                case t.MASK_TYPES.SPRITE:
                  this.popSpriteMask(r);
              }
            if (
              (r.reset(),
              r.pooled && this.maskDataPool.push(r),
              0 !== this.maskStack.length)
            ) {
              var i = this.maskStack[this.maskStack.length - 1];
              i.type === t.MASK_TYPES.SPRITE &&
                i._filters &&
                (i._filters[0].maskSprite = i.maskObject);
            }
          }
        }),
        (e.prototype.detect = function (e) {
          e.maskObject.isSprite
            ? (e.type = t.MASK_TYPES.SPRITE)
            : this.enableScissor && this.renderer.scissor.testScissor(e)
            ? (e.type = t.MASK_TYPES.SCISSOR)
            : (e.type = t.MASK_TYPES.STENCIL);
        }),
        (e.prototype.pushSpriteMask = function (t) {
          var e,
            r,
            i = t.maskObject,
            n = t._target,
            o = t._filters;
          o ||
            (o = this.alphaMaskPool[this.alphaMaskIndex]) ||
            (o = this.alphaMaskPool[this.alphaMaskIndex] = [new qn()]);
          var s,
            a,
            h = this.renderer,
            u = h.renderTexture;
          if (u.current) {
            var l = u.current;
            (s = t.resolution || l.resolution),
              (a =
                null !== (e = t.multisample) && void 0 !== e
                  ? e
                  : l.multisample);
          } else
            (s = t.resolution || h.resolution),
              (a =
                null !== (r = t.multisample) && void 0 !== r
                  ? r
                  : h.multisample);
          (o[0].resolution = s), (o[0].multisample = a), (o[0].maskSprite = i);
          var c = n.filterArea;
          (n.filterArea = i.getBounds(!0)),
            h.filter.push(n, o),
            (n.filterArea = c),
            t._filters || this.alphaMaskIndex++;
        }),
        (e.prototype.popSpriteMask = function (t) {
          this.renderer.filter.pop(),
            t._filters
              ? (t._filters[0].maskSprite = null)
              : (this.alphaMaskIndex--,
                (this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null));
        }),
        (e.prototype.destroy = function () {
          this.renderer = null;
        }),
        e
      );
    })(),
    Zn = (function () {
      function t(t) {
        (this.renderer = t), (this.maskStack = []), (this.glConst = 0);
      }
      return (
        (t.prototype.getStackLength = function () {
          return this.maskStack.length;
        }),
        (t.prototype.setMaskStack = function (t) {
          var e = this.renderer.gl,
            r = this.getStackLength();
          this.maskStack = t;
          var i = this.getStackLength();
          i !== r &&
            (0 === i
              ? e.disable(this.glConst)
              : (e.enable(this.glConst), this._useCurrent()));
        }),
        (t.prototype._useCurrent = function () {}),
        (t.prototype.destroy = function () {
          (this.renderer = null), (this.maskStack = null);
        }),
        t
      );
    })(),
    Qn = new gr(),
    Jn = (function (t) {
      function e(e) {
        var r = t.call(this, e) || this;
        return (r.glConst = WebGLRenderingContext.SCISSOR_TEST), r;
      }
      return (
        gi(e, t),
        (e.prototype.getStackLength = function () {
          var t = this.maskStack[this.maskStack.length - 1];
          return t ? t._scissorCounter : 0;
        }),
        (e.prototype.calcScissorRect = function (t) {
          if (!t._scissorRectLocal) {
            var e = t._scissorRect,
              r = t.maskObject,
              i = this.renderer,
              n = i.renderTexture;
            r.renderable = !0;
            var o = r.getBounds();
            this.roundFrameToPixels(
              o,
              n.current ? n.current.resolution : i.resolution,
              n.sourceFrame,
              n.destinationFrame,
              i.projection.transform
            ),
              (r.renderable = !1),
              e && o.fit(e),
              (t._scissorRectLocal = o);
          }
        }),
        (e.isMatrixRotated = function (t) {
          if (!t) return !1;
          var e = t.a,
            r = t.b,
            i = t.c,
            n = t.d;
          return (
            (Math.abs(r) > 1e-4 || Math.abs(i) > 1e-4) &&
            (Math.abs(e) > 1e-4 || Math.abs(n) > 1e-4)
          );
        }),
        (e.prototype.testScissor = function (t) {
          var r = t.maskObject;
          if (!r.isFastRect || !r.isFastRect()) return !1;
          if (e.isMatrixRotated(r.worldTransform)) return !1;
          if (e.isMatrixRotated(this.renderer.projection.transform)) return !1;
          this.calcScissorRect(t);
          var i = t._scissorRectLocal;
          return i.width > 0 && i.height > 0;
        }),
        (e.prototype.roundFrameToPixels = function (t, r, i, n, o) {
          e.isMatrixRotated(o) ||
            ((o = o ? Qn.copyFrom(o) : Qn.identity())
              .translate(-i.x, -i.y)
              .scale(n.width / i.width, n.height / i.height)
              .translate(n.x, n.y),
            this.renderer.filter.transformAABB(o, t),
            t.fit(n),
            (t.x = Math.round(t.x * r)),
            (t.y = Math.round(t.y * r)),
            (t.width = Math.round(t.width * r)),
            (t.height = Math.round(t.height * r)));
        }),
        (e.prototype.push = function (t) {
          t._scissorRectLocal || this.calcScissorRect(t);
          var e = this.renderer.gl;
          t._scissorRect || e.enable(e.SCISSOR_TEST),
            t._scissorCounter++,
            (t._scissorRect = t._scissorRectLocal),
            this._useCurrent();
        }),
        (e.prototype.pop = function () {
          var t = this.renderer.gl;
          this.getStackLength() > 0
            ? this._useCurrent()
            : t.disable(t.SCISSOR_TEST);
        }),
        (e.prototype._useCurrent = function () {
          var t,
            e = this.maskStack[this.maskStack.length - 1]._scissorRect;
          (t = this.renderer.renderTexture.current
            ? e.y
            : this.renderer.height - e.height - e.y),
            this.renderer.gl.scissor(e.x, t, e.width, e.height);
        }),
        e
      );
    })(Zn),
    $n = (function (t) {
      function e(e) {
        var r = t.call(this, e) || this;
        return (r.glConst = WebGLRenderingContext.STENCIL_TEST), r;
      }
      return (
        gi(e, t),
        (e.prototype.getStackLength = function () {
          var t = this.maskStack[this.maskStack.length - 1];
          return t ? t._stencilCounter : 0;
        }),
        (e.prototype.push = function (t) {
          var e = t.maskObject,
            r = this.renderer.gl,
            i = t._stencilCounter;
          0 === i &&
            (this.renderer.framebuffer.forceStencil(),
            r.clearStencil(0),
            r.clear(r.STENCIL_BUFFER_BIT),
            r.enable(r.STENCIL_TEST)),
            t._stencilCounter++,
            r.colorMask(!1, !1, !1, !1),
            r.stencilFunc(r.EQUAL, i, 4294967295),
            r.stencilOp(r.KEEP, r.KEEP, r.INCR),
            (e.renderable = !0),
            e.render(this.renderer),
            this.renderer.batch.flush(),
            (e.renderable = !1),
            this._useCurrent();
        }),
        (e.prototype.pop = function (t) {
          var e = this.renderer.gl;
          0 === this.getStackLength()
            ? e.disable(e.STENCIL_TEST)
            : (e.colorMask(!1, !1, !1, !1),
              e.stencilOp(e.KEEP, e.KEEP, e.DECR),
              (t.renderable = !0),
              t.render(this.renderer),
              this.renderer.batch.flush(),
              (t.renderable = !1),
              this._useCurrent());
        }),
        (e.prototype._useCurrent = function () {
          var t = this.renderer.gl;
          t.colorMask(!0, !0, !0, !0),
            t.stencilFunc(t.EQUAL, this.getStackLength(), 4294967295),
            t.stencilOp(t.KEEP, t.KEEP, t.KEEP);
        }),
        e
      );
    })(Zn),
    to = (function () {
      function t(t) {
        (this.renderer = t),
          (this.destinationFrame = null),
          (this.sourceFrame = null),
          (this.defaultFrame = null),
          (this.projectionMatrix = new gr()),
          (this.transform = null);
      }
      return (
        (t.prototype.update = function (t, e, r, i) {
          (this.destinationFrame =
            t || this.destinationFrame || this.defaultFrame),
            (this.sourceFrame = e || this.sourceFrame || t),
            this.calculateProjection(
              this.destinationFrame,
              this.sourceFrame,
              r,
              i
            ),
            this.transform && this.projectionMatrix.append(this.transform);
          var n = this.renderer;
          (n.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix),
            n.globalUniforms.update(),
            n.shader.shader &&
              n.shader.syncUniformGroup(n.shader.shader.uniforms.globals);
        }),
        (t.prototype.calculateProjection = function (t, e, r, i) {
          var n = this.projectionMatrix,
            o = i ? -1 : 1;
          n.identity(),
            (n.a = (1 / e.width) * 2),
            (n.d = o * ((1 / e.height) * 2)),
            (n.tx = -1 - e.x * n.a),
            (n.ty = -o - e.y * n.d);
        }),
        (t.prototype.setTransform = function (t) {}),
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        t
      );
    })(),
    eo = new _r(),
    ro = new _r(),
    io = (function () {
      function t(t) {
        (this.renderer = t),
          (this.clearColor = t._backgroundColorRgba),
          (this.defaultMaskStack = []),
          (this.current = null),
          (this.sourceFrame = new _r()),
          (this.destinationFrame = new _r()),
          (this.viewportFrame = new _r());
      }
      return (
        (t.prototype.bind = function (t, e, r) {
          void 0 === t && (t = null);
          var i,
            n,
            o,
            s = this.renderer;
          (this.current = t),
            t
              ? ((o = (i = t.baseTexture).resolution),
                e ||
                  ((eo.width = t.frame.width),
                  (eo.height = t.frame.height),
                  (e = eo)),
                r ||
                  ((ro.x = t.frame.x),
                  (ro.y = t.frame.y),
                  (ro.width = e.width),
                  (ro.height = e.height),
                  (r = ro)),
                (n = i.framebuffer))
              : ((o = s.resolution),
                e ||
                  ((eo.width = s.screen.width),
                  (eo.height = s.screen.height),
                  (e = eo)),
                r || (((r = eo).width = e.width), (r.height = e.height)));
          var a = this.viewportFrame;
          (a.x = r.x * o),
            (a.y = r.y * o),
            (a.width = r.width * o),
            (a.height = r.height * o),
            t || (a.y = s.view.height - (a.y + a.height)),
            a.ceil(),
            this.renderer.framebuffer.bind(n, a),
            this.renderer.projection.update(r, e, o, !n),
            t
              ? this.renderer.mask.setMaskStack(i.maskStack)
              : this.renderer.mask.setMaskStack(this.defaultMaskStack),
            this.sourceFrame.copyFrom(e),
            this.destinationFrame.copyFrom(r);
        }),
        (t.prototype.clear = function (t, e) {
          t = this.current
            ? t || this.current.baseTexture.clearColor
            : t || this.clearColor;
          var r = this.destinationFrame,
            i = this.current ? this.current.baseTexture : this.renderer.screen,
            n = r.width !== i.width || r.height !== i.height;
          if (n) {
            var o = this.viewportFrame,
              s = o.x,
              a = o.y,
              h = o.width,
              u = o.height;
            (s = Math.round(s)),
              (a = Math.round(a)),
              (h = Math.round(h)),
              (u = Math.round(u)),
              this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST),
              this.renderer.gl.scissor(s, a, h, u);
          }
          this.renderer.framebuffer.clear(t[0], t[1], t[2], t[3], e),
            n && this.renderer.scissor.pop();
        }),
        (t.prototype.resize = function () {
          this.bind(null);
        }),
        (t.prototype.reset = function () {
          this.bind(null);
        }),
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        t
      );
    })();
  function no(t, e, r, i, n) {
    r.buffer.update(n);
  }
  var oo = {
      float: "\n        data[offset] = v;\n    ",
      vec2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n    ",
      vec3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n    ",
      vec4: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n        data[offset+3] = v[3];\n    ",
      mat2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n\n        data[offset+4] = v[2];\n        data[offset+5] = v[3];\n    ",
      mat3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n        data[offset + 4] = v[3];\n        data[offset + 5] = v[4];\n        data[offset + 6] = v[5];\n\n        data[offset + 8] = v[6];\n        data[offset + 9] = v[7];\n        data[offset + 10] = v[8];\n    ",
      mat4: "\n        for(var i = 0; i < 16; i++)\n        {\n            data[offset + i] = v[i];\n        }\n    ",
    },
    so = {
      float: 4,
      vec2: 8,
      vec3: 12,
      vec4: 16,
      int: 4,
      ivec2: 8,
      ivec3: 12,
      ivec4: 16,
      uint: 4,
      uvec2: 8,
      uvec3: 12,
      uvec4: 16,
      bool: 4,
      bvec2: 8,
      bvec3: 12,
      bvec4: 16,
      mat2: 32,
      mat3: 48,
      mat4: 64,
    };
  function ao(t) {
    for (
      var e = t.map(function (t) {
          return { data: t, offset: 0, dataLen: 0, dirty: 0 };
        }),
        r = 0,
        i = 0,
        n = 0,
        o = 0;
      o < e.length;
      o++
    ) {
      var s = e[o];
      if (
        ((r = so[s.data.type]),
        s.data.size > 1 && (r = Math.max(r, 16) * s.data.size),
        (s.dataLen = r),
        i % r != 0 && i < 16)
      ) {
        var a = (i % r) % 16;
        (i += a), (n += a);
      }
      i + r > 16
        ? ((n = 16 * Math.ceil(n / 16)), (s.offset = n), (n += r), (i = r))
        : ((s.offset = n), (i += r), (n += r));
    }
    return { uboElements: e, size: (n = 16 * Math.ceil(n / 16)) };
  }
  function ho(t, e) {
    var r = [];
    for (var i in t) e[i] && r.push(e[i]);
    return (
      r.sort(function (t, e) {
        return t.index - e.index;
      }),
      r
    );
  }
  function uo(t, e) {
    if (!t.autoManage) return { size: 0, syncFunc: no };
    for (
      var r = ao(ho(t.uniforms, e)),
        i = r.uboElements,
        n = r.size,
        o = [
          "\n    var v = null;\n    var v2 = null;\n    var cv = null;\n    var t = 0;\n    var gl = renderer.gl\n    var index = 0;\n    var data = buffer.data;\n    ",
        ],
        s = 0;
      s < i.length;
      s++
    ) {
      for (
        var a = i[s],
          h = t.uniforms[a.data.name],
          u = a.data.name,
          l = !1,
          c = 0;
        c < Cn.length;
        c++
      ) {
        var d = Cn[c];
        if (d.codeUbo && d.test(a.data, h)) {
          o.push(
            "offset = " + a.offset / 4 + ";",
            Cn[c].codeUbo(a.data.name, h)
          ),
            (l = !0);
          break;
        }
      }
      if (!l)
        if (a.data.size > 1) {
          var f = Pn(a.data.type),
            p = Math.max(so[a.data.type] / 16, 1),
            _ = f / p,
            v = (4 - (_ % 4)) % 4;
          o.push(
            "\n                cv = ud." +
              u +
              ".value;\n                v = uv." +
              u +
              ";\n                offset = " +
              a.offset / 4 +
              ";\n\n                t = 0;\n\n                for(var i=0; i < " +
              a.data.size * p +
              "; i++)\n                {\n                    for(var j = 0; j < " +
              _ +
              "; j++)\n                    {\n                        data[offset++] = v[t++];\n                    }\n                    offset += " +
              v +
              ";\n                }\n\n                "
          );
        } else {
          var m = oo[a.data.type];
          o.push(
            "\n                cv = ud." +
              u +
              ".value;\n                v = uv." +
              u +
              ";\n                offset = " +
              a.offset / 4 +
              ";\n                " +
              m +
              ";\n                "
          );
        }
    }
    return (
      o.push("\n       renderer.buffer.update(buffer);\n    "),
      {
        size: n,
        syncFunc: new Function(
          "ud",
          "uv",
          "renderer",
          "syncData",
          "buffer",
          o.join("\n")
        ),
      }
    );
  }
  var lo = function () {},
    co = (function () {
      function t(t, e) {
        (this.program = t),
          (this.uniformData = e),
          (this.uniformGroups = {}),
          (this.uniformDirtyGroups = {}),
          (this.uniformBufferBindings = {});
      }
      return (
        (t.prototype.destroy = function () {
          (this.uniformData = null),
            (this.uniformGroups = null),
            (this.uniformDirtyGroups = null),
            (this.uniformBufferBindings = null),
            (this.program = null);
        }),
        t
      );
    })();
  function fo(t, e) {
    var r = Tn(t, t.VERTEX_SHADER, e.vertexSrc),
      i = Tn(t, t.FRAGMENT_SHADER, e.fragmentSrc),
      n = t.createProgram();
    if (
      (t.attachShader(n, r),
      t.attachShader(n, i),
      t.linkProgram(n),
      t.getProgramParameter(n, t.LINK_STATUS) ||
        (function (t, e, r, i) {
          t.getProgramParameter(e, t.LINK_STATUS) ||
            (t.getShaderParameter(r, t.COMPILE_STATUS) || yn(t, r),
            t.getShaderParameter(i, t.COMPILE_STATUS) || yn(t, i),
            console.error("PixiJS Error: Could not initialize shader."),
            "" !== t.getProgramInfoLog(e) &&
              console.warn(
                "PixiJS Warning: gl.getProgramInfoLog()",
                t.getProgramInfoLog(e)
              ));
        })(t, n, r, i),
      (e.attributeData = (function (t, e) {
        for (
          var r = {}, i = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES), n = 0;
          n < i;
          n++
        ) {
          var o = e.getActiveAttrib(t, n);
          if (0 !== o.name.indexOf("gl_")) {
            var s = Dn(e, o.type),
              a = {
                type: s,
                name: o.name,
                size: Pn(s),
                location: e.getAttribLocation(t, o.name),
              };
            r[o.name] = a;
          }
        }
        return r;
      })(n, t)),
      (e.uniformData = (function (t, e) {
        for (
          var r = {}, i = e.getProgramParameter(t, e.ACTIVE_UNIFORMS), n = 0;
          n < i;
          n++
        ) {
          var o = e.getActiveUniform(t, n),
            s = o.name.replace(/\[.*?\]$/, ""),
            a = !!o.name.match(/\[.*?\]$/),
            h = Dn(e, o.type);
          r[s] = {
            name: s,
            index: n,
            type: h,
            size: o.size,
            isArray: a,
            value: bn(h, o.size),
          };
        }
        return r;
      })(n, t)),
      !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(e.vertexSrc))
    ) {
      var o = Object.keys(e.attributeData);
      o.sort(function (t, e) {
        return t > e ? 1 : -1;
      });
      for (var s = 0; s < o.length; s++)
        (e.attributeData[o[s]].location = s), t.bindAttribLocation(n, s, o[s]);
      t.linkProgram(n);
    }
    t.deleteShader(r), t.deleteShader(i);
    var a = {};
    for (var s in e.uniformData) {
      var h = e.uniformData[s];
      a[s] = {
        location: t.getUniformLocation(n, s),
        value: bn(h.type, h.size),
      };
    }
    return new co(n, a);
  }
  var po = 0,
    _o = { textureCount: 0, uboCount: 0 },
    vo = (function () {
      function t(t) {
        (this.destroyed = !1),
          (this.renderer = t),
          this.systemCheck(),
          (this.gl = null),
          (this.shader = null),
          (this.program = null),
          (this.cache = {}),
          (this._uboCache = {}),
          (this.id = po++);
      }
      return (
        (t.prototype.systemCheck = function () {
          if (
            !(function () {
              if ("boolean" == typeof Fn) return Fn;
              try {
                var t = new Function(
                  "param1",
                  "param2",
                  "param3",
                  "return param1[param2] === param3;"
                );
                Fn = !0 === t({ a: "b" }, "a", "b");
              } catch (t) {
                Fn = !1;
              }
              return Fn;
            })()
          )
            throw new Error(
              "Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support."
            );
        }),
        (t.prototype.contextChange = function (t) {
          (this.gl = t), this.reset();
        }),
        (t.prototype.bind = function (t, e) {
          t.uniforms.globals = this.renderer.globalUniforms;
          var r = t.program,
            i =
              r.glPrograms[this.renderer.CONTEXT_UID] ||
              this.generateProgram(t);
          return (
            (this.shader = t),
            this.program !== r &&
              ((this.program = r), this.gl.useProgram(i.program)),
            e ||
              ((_o.textureCount = 0),
              (_o.uboCount = 0),
              this.syncUniformGroup(t.uniformGroup, _o)),
            i
          );
        }),
        (t.prototype.setUniforms = function (t) {
          var e = this.shader.program,
            r = e.glPrograms[this.renderer.CONTEXT_UID];
          e.syncUniforms(r.uniformData, t, this.renderer);
        }),
        (t.prototype.syncUniformGroup = function (t, e) {
          var r = this.getGlProgram();
          (t.static && t.dirtyId === r.uniformDirtyGroups[t.id]) ||
            ((r.uniformDirtyGroups[t.id] = t.dirtyId),
            this.syncUniforms(t, r, e));
        }),
        (t.prototype.syncUniforms = function (t, e, r) {
          (t.syncUniforms[this.shader.program.id] || this.createSyncGroups(t))(
            e.uniformData,
            t.uniforms,
            this.renderer,
            r
          );
        }),
        (t.prototype.createSyncGroups = function (t) {
          var e = this.getSignature(t, this.shader.program.uniformData, "u");
          return (
            this.cache[e] ||
              (this.cache[e] = (function (t, e) {
                var r,
                  i = [
                    "\n        var v = null;\n        var cv = null;\n        var cu = null;\n        var t = 0;\n        var gl = renderer.gl;\n    ",
                  ];
                for (var n in t.uniforms) {
                  var o = e[n];
                  if (o) {
                    for (
                      var s = t.uniforms[n], a = !1, h = 0;
                      h < Cn.length;
                      h++
                    )
                      if (Cn[h].test(o, s)) {
                        i.push(Cn[h].code(n, s)), (a = !0);
                        break;
                      }
                    if (!a) {
                      var u = (1 === o.size ? wn : Ln)[o.type].replace(
                        "location",
                        'ud["' + n + '"].location'
                      );
                      i.push(
                        '\n            cu = ud["' +
                          n +
                          '"];\n            cv = cu.value;\n            v = uv["' +
                          n +
                          '"];\n            ' +
                          u +
                          ";"
                      );
                    }
                  } else
                    (null === (r = t.uniforms[n]) || void 0 === r
                      ? void 0
                      : r.group) &&
                      (t.uniforms[n].ubo
                        ? i.push(
                            "\n                        renderer.shader.syncUniformBufferGroup(uv." +
                              n +
                              ", '" +
                              n +
                              "');\n                    "
                          )
                        : i.push(
                            "\n                        renderer.shader.syncUniformGroup(uv." +
                              n +
                              ", syncData);\n                    "
                          ));
                }
                return new Function(
                  "ud",
                  "uv",
                  "renderer",
                  "syncData",
                  i.join("\n")
                );
              })(t, this.shader.program.uniformData)),
            (t.syncUniforms[this.shader.program.id] = this.cache[e]),
            t.syncUniforms[this.shader.program.id]
          );
        }),
        (t.prototype.syncUniformBufferGroup = function (t, e) {
          var r = this.getGlProgram();
          if (!t.static || 0 !== t.dirtyId || !r.uniformGroups[t.id]) {
            t.dirtyId = 0;
            var i =
              r.uniformGroups[t.id] || this.createSyncBufferGroup(t, r, e);
            t.buffer.update(),
              i(r.uniformData, t.uniforms, this.renderer, _o, t.buffer);
          }
          this.renderer.buffer.bindBufferBase(
            t.buffer,
            r.uniformBufferBindings[e]
          );
        }),
        (t.prototype.createSyncBufferGroup = function (t, e, r) {
          var i = this.renderer.gl;
          this.renderer.buffer.bind(t.buffer);
          var n = this.gl.getUniformBlockIndex(e.program, r);
          (e.uniformBufferBindings[r] = this.shader.uniformBindCount),
            i.uniformBlockBinding(e.program, n, this.shader.uniformBindCount),
            this.shader.uniformBindCount++;
          var o = this.getSignature(t, this.shader.program.uniformData, "ubo"),
            s = this._uboCache[o];
          if (
            (s ||
              (s = this._uboCache[o] = uo(t, this.shader.program.uniformData)),
            t.autoManage)
          ) {
            var a = new Float32Array(s.size / 4);
            t.buffer.update(a);
          }
          return (e.uniformGroups[t.id] = s.syncFunc), e.uniformGroups[t.id];
        }),
        (t.prototype.getSignature = function (t, e, r) {
          var i = t.uniforms,
            n = [r + "-"];
          for (var o in i) n.push(o), e[o] && n.push(e[o].type);
          return n.join("-");
        }),
        (t.prototype.getGlProgram = function () {
          return this.shader
            ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID]
            : null;
        }),
        (t.prototype.generateProgram = function (t) {
          var e = this.gl,
            r = t.program,
            i = fo(e, r);
          return (r.glPrograms[this.renderer.CONTEXT_UID] = i), i;
        }),
        (t.prototype.reset = function () {
          (this.program = null), (this.shader = null);
        }),
        (t.prototype.destroy = function () {
          (this.renderer = null), (this.destroyed = !0);
        }),
        t
      );
    })();
  var mo = (function () {
      function e() {
        (this.gl = null),
          (this.stateId = 0),
          (this.polygonOffset = 0),
          (this.blendMode = t.BLEND_MODES.NONE),
          (this._blendEq = !1),
          (this.map = []),
          (this.map[0] = this.setBlend),
          (this.map[1] = this.setOffset),
          (this.map[2] = this.setCullFace),
          (this.map[3] = this.setDepthTest),
          (this.map[4] = this.setFrontFace),
          (this.map[5] = this.setDepthMask),
          (this.checks = []),
          (this.defaultState = new jn()),
          (this.defaultState.blend = !0);
      }
      return (
        (e.prototype.contextChange = function (e) {
          (this.gl = e),
            (this.blendModes = (function (e, r) {
              return (
                void 0 === r && (r = []),
                (r[t.BLEND_MODES.NORMAL] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.ADD] = [e.ONE, e.ONE]),
                (r[t.BLEND_MODES.MULTIPLY] = [
                  e.DST_COLOR,
                  e.ONE_MINUS_SRC_ALPHA,
                  e.ONE,
                  e.ONE_MINUS_SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.SCREEN] = [
                  e.ONE,
                  e.ONE_MINUS_SRC_COLOR,
                  e.ONE,
                  e.ONE_MINUS_SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.OVERLAY] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.DARKEN] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.LIGHTEN] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.COLOR_DODGE] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.COLOR_BURN] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.HARD_LIGHT] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.SOFT_LIGHT] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.DIFFERENCE] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.EXCLUSION] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.HUE] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.SATURATION] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.COLOR] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.LUMINOSITY] = [e.ONE, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.NONE] = [0, 0]),
                (r[t.BLEND_MODES.NORMAL_NPM] = [
                  e.SRC_ALPHA,
                  e.ONE_MINUS_SRC_ALPHA,
                  e.ONE,
                  e.ONE_MINUS_SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.ADD_NPM] = [e.SRC_ALPHA, e.ONE, e.ONE, e.ONE]),
                (r[t.BLEND_MODES.SCREEN_NPM] = [
                  e.SRC_ALPHA,
                  e.ONE_MINUS_SRC_COLOR,
                  e.ONE,
                  e.ONE_MINUS_SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.SRC_IN] = [e.DST_ALPHA, e.ZERO]),
                (r[t.BLEND_MODES.SRC_OUT] = [e.ONE_MINUS_DST_ALPHA, e.ZERO]),
                (r[t.BLEND_MODES.SRC_ATOP] = [
                  e.DST_ALPHA,
                  e.ONE_MINUS_SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.DST_OVER] = [e.ONE_MINUS_DST_ALPHA, e.ONE]),
                (r[t.BLEND_MODES.DST_IN] = [e.ZERO, e.SRC_ALPHA]),
                (r[t.BLEND_MODES.DST_OUT] = [e.ZERO, e.ONE_MINUS_SRC_ALPHA]),
                (r[t.BLEND_MODES.DST_ATOP] = [
                  e.ONE_MINUS_DST_ALPHA,
                  e.SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.XOR] = [
                  e.ONE_MINUS_DST_ALPHA,
                  e.ONE_MINUS_SRC_ALPHA,
                ]),
                (r[t.BLEND_MODES.SUBTRACT] = [
                  e.ONE,
                  e.ONE,
                  e.ONE,
                  e.ONE,
                  e.FUNC_REVERSE_SUBTRACT,
                  e.FUNC_ADD,
                ]),
                r
              );
            })(e)),
            this.set(this.defaultState),
            this.reset();
        }),
        (e.prototype.set = function (t) {
          if (((t = t || this.defaultState), this.stateId !== t.data)) {
            for (var e = this.stateId ^ t.data, r = 0; e; )
              1 & e && this.map[r].call(this, !!(t.data & (1 << r))),
                (e >>= 1),
                r++;
            this.stateId = t.data;
          }
          for (r = 0; r < this.checks.length; r++) this.checks[r](this, t);
        }),
        (e.prototype.forceState = function (t) {
          t = t || this.defaultState;
          for (var e = 0; e < this.map.length; e++)
            this.map[e].call(this, !!(t.data & (1 << e)));
          for (e = 0; e < this.checks.length; e++) this.checks[e](this, t);
          this.stateId = t.data;
        }),
        (e.prototype.setBlend = function (t) {
          this.updateCheck(e.checkBlendMode, t),
            this.gl[t ? "enable" : "disable"](this.gl.BLEND);
        }),
        (e.prototype.setOffset = function (t) {
          this.updateCheck(e.checkPolygonOffset, t),
            this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
        }),
        (e.prototype.setDepthTest = function (t) {
          this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST);
        }),
        (e.prototype.setDepthMask = function (t) {
          this.gl.depthMask(t);
        }),
        (e.prototype.setCullFace = function (t) {
          this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE);
        }),
        (e.prototype.setFrontFace = function (t) {
          this.gl.frontFace(this.gl[t ? "CW" : "CCW"]);
        }),
        (e.prototype.setBlendMode = function (t) {
          if (t !== this.blendMode) {
            this.blendMode = t;
            var e = this.blendModes[t],
              r = this.gl;
            2 === e.length
              ? r.blendFunc(e[0], e[1])
              : r.blendFuncSeparate(e[0], e[1], e[2], e[3]),
              6 === e.length
                ? ((this._blendEq = !0), r.blendEquationSeparate(e[4], e[5]))
                : this._blendEq &&
                  ((this._blendEq = !1),
                  r.blendEquationSeparate(r.FUNC_ADD, r.FUNC_ADD));
          }
        }),
        (e.prototype.setPolygonOffset = function (t, e) {
          this.gl.polygonOffset(t, e);
        }),
        (e.prototype.reset = function () {
          this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1),
            this.forceState(this.defaultState),
            (this._blendEq = !0),
            (this.blendMode = -1),
            this.setBlendMode(0);
        }),
        (e.prototype.updateCheck = function (t, e) {
          var r = this.checks.indexOf(t);
          e && -1 === r
            ? this.checks.push(t)
            : e || -1 === r || this.checks.splice(r, 1);
        }),
        (e.checkBlendMode = function (t, e) {
          t.setBlendMode(e.blendMode);
        }),
        (e.checkPolygonOffset = function (t, e) {
          t.setPolygonOffset(1, e.polygonOffset);
        }),
        (e.prototype.destroy = function () {
          this.gl = null;
        }),
        e
      );
    })(),
    Eo = (function () {
      function e(t) {
        (this.renderer = t),
          (this.count = 0),
          (this.checkCount = 0),
          (this.maxIdle = bt.GC_MAX_IDLE),
          (this.checkCountMax = bt.GC_MAX_CHECK_COUNT),
          (this.mode = bt.GC_MODE);
      }
      return (
        (e.prototype.postrender = function () {
          this.renderer.renderingToScreen &&
            (this.count++,
            this.mode !== t.GC_MODES.MANUAL &&
              (this.checkCount++,
              this.checkCount > this.checkCountMax &&
                ((this.checkCount = 0), this.run())));
        }),
        (e.prototype.run = function () {
          for (
            var t = this.renderer.texture, e = t.managedTextures, r = !1, i = 0;
            i < e.length;
            i++
          ) {
            var n = e[i];
            !n.framebuffer &&
              this.count - n.touched > this.maxIdle &&
              (t.destroyTexture(n, !0), (e[i] = null), (r = !0));
          }
          if (r) {
            var o = 0;
            for (i = 0; i < e.length; i++) null !== e[i] && (e[o++] = e[i]);
            e.length = o;
          }
        }),
        (e.prototype.unload = function (t) {
          var e = this.renderer.texture,
            r = t._texture;
          r && !r.framebuffer && e.destroyTexture(r);
          for (var i = t.children.length - 1; i >= 0; i--)
            this.unload(t.children[i]);
        }),
        (e.prototype.destroy = function () {
          this.renderer = null;
        }),
        e
      );
    })();
  var To = function (e) {
      (this.texture = e),
        (this.width = -1),
        (this.height = -1),
        (this.dirtyId = -1),
        (this.dirtyStyleId = -1),
        (this.mipmap = !1),
        (this.wrapMode = 33071),
        (this.type = t.TYPES.UNSIGNED_BYTE),
        (this.internalFormat = t.FORMATS.RGBA),
        (this.samplerType = 0);
    },
    yo = (function () {
      function e(t) {
        (this.renderer = t),
          (this.boundTextures = []),
          (this.currentLocation = -1),
          (this.managedTextures = []),
          (this._unknownBoundTextures = !1),
          (this.unknownTexture = new Si()),
          (this.hasIntegerTextures = !1);
      }
      return (
        (e.prototype.contextChange = function () {
          var e = (this.gl = this.renderer.gl);
          (this.CONTEXT_UID = this.renderer.CONTEXT_UID),
            (this.webGLVersion = this.renderer.context.webGLVersion),
            (this.internalFormats = (function (e) {
              var r,
                i,
                n,
                o,
                s,
                a,
                h,
                u,
                l,
                c,
                d,
                f,
                p,
                _,
                v,
                m,
                E,
                T,
                y,
                g,
                b,
                R,
                A;
              return (
                "WebGL2RenderingContext" in globalThis &&
                e instanceof globalThis.WebGL2RenderingContext
                  ? (((r = {})[t.TYPES.UNSIGNED_BYTE] =
                      (((i = {})[t.FORMATS.RGBA] = e.RGBA8),
                      (i[t.FORMATS.RGB] = e.RGB8),
                      (i[t.FORMATS.RG] = e.RG8),
                      (i[t.FORMATS.RED] = e.R8),
                      (i[t.FORMATS.RGBA_INTEGER] = e.RGBA8UI),
                      (i[t.FORMATS.RGB_INTEGER] = e.RGB8UI),
                      (i[t.FORMATS.RG_INTEGER] = e.RG8UI),
                      (i[t.FORMATS.RED_INTEGER] = e.R8UI),
                      (i[t.FORMATS.ALPHA] = e.ALPHA),
                      (i[t.FORMATS.LUMINANCE] = e.LUMINANCE),
                      (i[t.FORMATS.LUMINANCE_ALPHA] = e.LUMINANCE_ALPHA),
                      i)),
                    (r[t.TYPES.BYTE] =
                      (((n = {})[t.FORMATS.RGBA] = e.RGBA8_SNORM),
                      (n[t.FORMATS.RGB] = e.RGB8_SNORM),
                      (n[t.FORMATS.RG] = e.RG8_SNORM),
                      (n[t.FORMATS.RED] = e.R8_SNORM),
                      (n[t.FORMATS.RGBA_INTEGER] = e.RGBA8I),
                      (n[t.FORMATS.RGB_INTEGER] = e.RGB8I),
                      (n[t.FORMATS.RG_INTEGER] = e.RG8I),
                      (n[t.FORMATS.RED_INTEGER] = e.R8I),
                      n)),
                    (r[t.TYPES.UNSIGNED_SHORT] =
                      (((o = {})[t.FORMATS.RGBA_INTEGER] = e.RGBA16UI),
                      (o[t.FORMATS.RGB_INTEGER] = e.RGB16UI),
                      (o[t.FORMATS.RG_INTEGER] = e.RG16UI),
                      (o[t.FORMATS.RED_INTEGER] = e.R16UI),
                      (o[t.FORMATS.DEPTH_COMPONENT] = e.DEPTH_COMPONENT16),
                      o)),
                    (r[t.TYPES.SHORT] =
                      (((s = {})[t.FORMATS.RGBA_INTEGER] = e.RGBA16I),
                      (s[t.FORMATS.RGB_INTEGER] = e.RGB16I),
                      (s[t.FORMATS.RG_INTEGER] = e.RG16I),
                      (s[t.FORMATS.RED_INTEGER] = e.R16I),
                      s)),
                    (r[t.TYPES.UNSIGNED_INT] =
                      (((a = {})[t.FORMATS.RGBA_INTEGER] = e.RGBA32UI),
                      (a[t.FORMATS.RGB_INTEGER] = e.RGB32UI),
                      (a[t.FORMATS.RG_INTEGER] = e.RG32UI),
                      (a[t.FORMATS.RED_INTEGER] = e.R32UI),
                      (a[t.FORMATS.DEPTH_COMPONENT] = e.DEPTH_COMPONENT24),
                      a)),
                    (r[t.TYPES.INT] =
                      (((h = {})[t.FORMATS.RGBA_INTEGER] = e.RGBA32I),
                      (h[t.FORMATS.RGB_INTEGER] = e.RGB32I),
                      (h[t.FORMATS.RG_INTEGER] = e.RG32I),
                      (h[t.FORMATS.RED_INTEGER] = e.R32I),
                      h)),
                    (r[t.TYPES.FLOAT] =
                      (((u = {})[t.FORMATS.RGBA] = e.RGBA32F),
                      (u[t.FORMATS.RGB] = e.RGB32F),
                      (u[t.FORMATS.RG] = e.RG32F),
                      (u[t.FORMATS.RED] = e.R32F),
                      (u[t.FORMATS.DEPTH_COMPONENT] = e.DEPTH_COMPONENT32F),
                      u)),
                    (r[t.TYPES.HALF_FLOAT] =
                      (((l = {})[t.FORMATS.RGBA] = e.RGBA16F),
                      (l[t.FORMATS.RGB] = e.RGB16F),
                      (l[t.FORMATS.RG] = e.RG16F),
                      (l[t.FORMATS.RED] = e.R16F),
                      l)),
                    (r[t.TYPES.UNSIGNED_SHORT_5_6_5] =
                      (((c = {})[t.FORMATS.RGB] = e.RGB565), c)),
                    (r[t.TYPES.UNSIGNED_SHORT_4_4_4_4] =
                      (((d = {})[t.FORMATS.RGBA] = e.RGBA4), d)),
                    (r[t.TYPES.UNSIGNED_SHORT_5_5_5_1] =
                      (((f = {})[t.FORMATS.RGBA] = e.RGB5_A1), f)),
                    (r[t.TYPES.UNSIGNED_INT_2_10_10_10_REV] =
                      (((p = {})[t.FORMATS.RGBA] = e.RGB10_A2),
                      (p[t.FORMATS.RGBA_INTEGER] = e.RGB10_A2UI),
                      p)),
                    (r[t.TYPES.UNSIGNED_INT_10F_11F_11F_REV] =
                      (((_ = {})[t.FORMATS.RGB] = e.R11F_G11F_B10F), _)),
                    (r[t.TYPES.UNSIGNED_INT_5_9_9_9_REV] =
                      (((v = {})[t.FORMATS.RGB] = e.RGB9_E5), v)),
                    (r[t.TYPES.UNSIGNED_INT_24_8] =
                      (((m = {})[t.FORMATS.DEPTH_STENCIL] = e.DEPTH24_STENCIL8),
                      m)),
                    (r[t.TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV] =
                      (((E = {})[t.FORMATS.DEPTH_STENCIL] =
                        e.DEPTH32F_STENCIL8),
                      E)),
                    (A = r))
                  : (((T = {})[t.TYPES.UNSIGNED_BYTE] =
                      (((y = {})[t.FORMATS.RGBA] = e.RGBA),
                      (y[t.FORMATS.RGB] = e.RGB),
                      (y[t.FORMATS.ALPHA] = e.ALPHA),
                      (y[t.FORMATS.LUMINANCE] = e.LUMINANCE),
                      (y[t.FORMATS.LUMINANCE_ALPHA] = e.LUMINANCE_ALPHA),
                      y)),
                    (T[t.TYPES.UNSIGNED_SHORT_5_6_5] =
                      (((g = {})[t.FORMATS.RGB] = e.RGB), g)),
                    (T[t.TYPES.UNSIGNED_SHORT_4_4_4_4] =
                      (((b = {})[t.FORMATS.RGBA] = e.RGBA), b)),
                    (T[t.TYPES.UNSIGNED_SHORT_5_5_5_1] =
                      (((R = {})[t.FORMATS.RGBA] = e.RGBA), R)),
                    (A = T)),
                A
              );
            })(e));
          var r = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
          this.boundTextures.length = r;
          for (var i = 0; i < r; i++) this.boundTextures[i] = null;
          this.emptyTextures = {};
          var n = new To(e.createTexture());
          e.bindTexture(e.TEXTURE_2D, n.texture),
            e.texImage2D(
              e.TEXTURE_2D,
              0,
              e.RGBA,
              1,
              1,
              0,
              e.RGBA,
              e.UNSIGNED_BYTE,
              new Uint8Array(4)
            ),
            (this.emptyTextures[e.TEXTURE_2D] = n),
            (this.emptyTextures[e.TEXTURE_CUBE_MAP] = new To(
              e.createTexture()
            )),
            e.bindTexture(
              e.TEXTURE_CUBE_MAP,
              this.emptyTextures[e.TEXTURE_CUBE_MAP].texture
            );
          for (i = 0; i < 6; i++)
            e.texImage2D(
              e.TEXTURE_CUBE_MAP_POSITIVE_X + i,
              0,
              e.RGBA,
              1,
              1,
              0,
              e.RGBA,
              e.UNSIGNED_BYTE,
              null
            );
          e.texParameteri(e.TEXTURE_CUBE_MAP, e.TEXTURE_MAG_FILTER, e.LINEAR),
            e.texParameteri(e.TEXTURE_CUBE_MAP, e.TEXTURE_MIN_FILTER, e.LINEAR);
          for (i = 0; i < this.boundTextures.length; i++) this.bind(null, i);
        }),
        (e.prototype.bind = function (t, e) {
          void 0 === e && (e = 0);
          var r = this.gl;
          if (
            (t = null == t ? void 0 : t.castToBaseTexture()) &&
            t.valid &&
            !t.parentTextureArray
          ) {
            t.touched = this.renderer.textureGC.count;
            var i = t._glTextures[this.CONTEXT_UID] || this.initTexture(t);
            this.boundTextures[e] !== t &&
              (this.currentLocation !== e &&
                ((this.currentLocation = e), r.activeTexture(r.TEXTURE0 + e)),
              r.bindTexture(t.target, i.texture)),
              i.dirtyId !== t.dirtyId &&
                (this.currentLocation !== e &&
                  ((this.currentLocation = e), r.activeTexture(r.TEXTURE0 + e)),
                this.updateTexture(t)),
              (this.boundTextures[e] = t);
          } else
            this.currentLocation !== e &&
              ((this.currentLocation = e), r.activeTexture(r.TEXTURE0 + e)),
              r.bindTexture(
                r.TEXTURE_2D,
                this.emptyTextures[r.TEXTURE_2D].texture
              ),
              (this.boundTextures[e] = null);
        }),
        (e.prototype.reset = function () {
          (this._unknownBoundTextures = !0),
            (this.hasIntegerTextures = !1),
            (this.currentLocation = -1);
          for (var t = 0; t < this.boundTextures.length; t++)
            this.boundTextures[t] = this.unknownTexture;
        }),
        (e.prototype.unbind = function (t) {
          var e = this.gl,
            r = this.boundTextures;
          if (this._unknownBoundTextures) {
            this._unknownBoundTextures = !1;
            for (var i = 0; i < r.length; i++)
              r[i] === this.unknownTexture && this.bind(null, i);
          }
          for (i = 0; i < r.length; i++)
            r[i] === t &&
              (this.currentLocation !== i &&
                (e.activeTexture(e.TEXTURE0 + i), (this.currentLocation = i)),
              e.bindTexture(t.target, this.emptyTextures[t.target].texture),
              (r[i] = null));
        }),
        (e.prototype.ensureSamplerType = function (e) {
          var r = this,
            i = r.boundTextures,
            n = r.hasIntegerTextures,
            o = r.CONTEXT_UID;
          if (n)
            for (var s = e - 1; s >= 0; --s) {
              var a = i[s];
              if (a)
                a._glTextures[o].samplerType !== t.SAMPLER_TYPES.FLOAT &&
                  this.renderer.texture.unbind(a);
            }
        }),
        (e.prototype.initTexture = function (t) {
          var e = new To(this.gl.createTexture());
          return (
            (e.dirtyId = -1),
            (t._glTextures[this.CONTEXT_UID] = e),
            this.managedTextures.push(t),
            t.on("dispose", this.destroyTexture, this),
            e
          );
        }),
        (e.prototype.initTextureType = function (e, r) {
          var i, n;
          (r.internalFormat =
            null !==
              (n =
                null === (i = this.internalFormats[e.type]) || void 0 === i
                  ? void 0
                  : i[e.format]) && void 0 !== n
              ? n
              : e.format),
            2 === this.webGLVersion && e.type === t.TYPES.HALF_FLOAT
              ? (r.type = this.gl.HALF_FLOAT)
              : (r.type = e.type);
        }),
        (e.prototype.updateTexture = function (e) {
          var r = e._glTextures[this.CONTEXT_UID];
          if (r) {
            var i = this.renderer;
            if (
              (this.initTextureType(e, r),
              e.resource && e.resource.upload(i, e, r))
            )
              r.samplerType !== t.SAMPLER_TYPES.FLOAT &&
                (this.hasIntegerTextures = !0);
            else {
              var n = e.realWidth,
                o = e.realHeight,
                s = i.gl;
              (r.width !== n || r.height !== o || r.dirtyId < 0) &&
                ((r.width = n),
                (r.height = o),
                s.texImage2D(
                  e.target,
                  0,
                  r.internalFormat,
                  n,
                  o,
                  0,
                  e.format,
                  r.type,
                  null
                ));
            }
            e.dirtyStyleId !== r.dirtyStyleId && this.updateTextureStyle(e),
              (r.dirtyId = e.dirtyId);
          }
        }),
        (e.prototype.destroyTexture = function (t, e) {
          var r = this.gl;
          if (
            (t = t.castToBaseTexture())._glTextures[this.CONTEXT_UID] &&
            (this.unbind(t),
            r.deleteTexture(t._glTextures[this.CONTEXT_UID].texture),
            t.off("dispose", this.destroyTexture, this),
            delete t._glTextures[this.CONTEXT_UID],
            !e)
          ) {
            var i = this.managedTextures.indexOf(t);
            -1 !== i && ze(this.managedTextures, i, 1);
          }
        }),
        (e.prototype.updateTextureStyle = function (e) {
          var r = e._glTextures[this.CONTEXT_UID];
          r &&
            ((e.mipmap !== t.MIPMAP_MODES.POW2 && 2 === this.webGLVersion) ||
            e.isPowerOfTwo
              ? (r.mipmap = e.mipmap >= 1)
              : (r.mipmap = !1),
            2 === this.webGLVersion || e.isPowerOfTwo
              ? (r.wrapMode = e.wrapMode)
              : (r.wrapMode = t.WRAP_MODES.CLAMP),
            (e.resource && e.resource.style(this.renderer, e, r)) ||
              this.setStyle(e, r),
            (r.dirtyStyleId = e.dirtyStyleId));
        }),
        (e.prototype.setStyle = function (e, r) {
          var i = this.gl;
          if (
            (r.mipmap &&
              e.mipmap !== t.MIPMAP_MODES.ON_MANUAL &&
              i.generateMipmap(e.target),
            i.texParameteri(e.target, i.TEXTURE_WRAP_S, r.wrapMode),
            i.texParameteri(e.target, i.TEXTURE_WRAP_T, r.wrapMode),
            r.mipmap)
          ) {
            i.texParameteri(
              e.target,
              i.TEXTURE_MIN_FILTER,
              e.scaleMode === t.SCALE_MODES.LINEAR
                ? i.LINEAR_MIPMAP_LINEAR
                : i.NEAREST_MIPMAP_NEAREST
            );
            var n = this.renderer.context.extensions.anisotropicFiltering;
            if (
              n &&
              e.anisotropicLevel > 0 &&
              e.scaleMode === t.SCALE_MODES.LINEAR
            ) {
              var o = Math.min(
                e.anisotropicLevel,
                i.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
              );
              i.texParameterf(e.target, n.TEXTURE_MAX_ANISOTROPY_EXT, o);
            }
          } else
            i.texParameteri(
              e.target,
              i.TEXTURE_MIN_FILTER,
              e.scaleMode === t.SCALE_MODES.LINEAR ? i.LINEAR : i.NEAREST
            );
          i.texParameteri(
            e.target,
            i.TEXTURE_MAG_FILTER,
            e.scaleMode === t.SCALE_MODES.LINEAR ? i.LINEAR : i.NEAREST
          );
        }),
        (e.prototype.destroy = function () {
          this.renderer = null;
        }),
        e
      );
    })(),
    go = {
      __proto__: null,
      FilterSystem: hn,
      BatchSystem: ln,
      ContextSystem: dn,
      FramebufferSystem: _n,
      GeometrySystem: mn,
      MaskSystem: Kn,
      ScissorSystem: Jn,
      StencilSystem: $n,
      ProjectionSystem: to,
      RenderTextureSystem: io,
      ShaderSystem: vo,
      StateSystem: mo,
      TextureGCSystem: Eo,
      TextureSystem: yo,
    },
    bo = new gr(),
    Ro = (function (e) {
      function r(r, i) {
        void 0 === r && (r = t.RENDERER_TYPE.UNKNOWN);
        var n = e.call(this) || this;
        return (
          (i = Object.assign({}, bt.RENDER_OPTIONS, i)),
          (n.options = i),
          (n.type = r),
          (n.screen = new _r(0, 0, i.width, i.height)),
          (n.view = i.view || document.createElement("canvas")),
          (n.resolution = i.resolution || bt.RESOLUTION),
          (n.useContextAlpha = i.useContextAlpha),
          (n.autoDensity = !!i.autoDensity),
          (n.preserveDrawingBuffer = i.preserveDrawingBuffer),
          (n.clearBeforeRender = i.clearBeforeRender),
          (n._backgroundColor = 0),
          (n._backgroundColorRgba = [0, 0, 0, 1]),
          (n._backgroundColorString = "#000000"),
          (n.backgroundColor = i.backgroundColor || n._backgroundColor),
          (n.backgroundAlpha = i.backgroundAlpha),
          void 0 !== i.transparent &&
            (Je(
              "6.0.0",
              "Option transparent is deprecated, please use backgroundAlpha instead."
            ),
            (n.useContextAlpha = i.transparent),
            (n.backgroundAlpha = i.transparent ? 0 : 1)),
          (n._lastObjectRendered = null),
          (n.plugins = {}),
          n
        );
      }
      return (
        gi(r, e),
        (r.prototype.initPlugins = function (t) {
          for (var e in t) this.plugins[e] = new t[e](this);
        }),
        Object.defineProperty(r.prototype, "width", {
          get: function () {
            return this.view.width;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "height", {
          get: function () {
            return this.view.height;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.resize = function (t, e) {
          (this.view.width = Math.round(t * this.resolution)),
            (this.view.height = Math.round(e * this.resolution));
          var r = this.view.width / this.resolution,
            i = this.view.height / this.resolution;
          (this.screen.width = r),
            (this.screen.height = i),
            this.autoDensity &&
              ((this.view.style.width = r + "px"),
              (this.view.style.height = i + "px")),
            this.emit("resize", r, i);
        }),
        (r.prototype.generateTexture = function (t, e, r, i) {
          void 0 === e && (e = {}),
            "number" == typeof e &&
              (Je(
                "6.1.0",
                "generateTexture options (scaleMode, resolution, region) are now object options."
              ),
              (e = { scaleMode: e, resolution: r, region: i }));
          var n = e.region,
            o = (function (t, e) {
              var r = {};
              for (var i in t)
                Object.prototype.hasOwnProperty.call(t, i) &&
                  e.indexOf(i) < 0 &&
                  (r[i] = t[i]);
              if (
                null != t &&
                "function" == typeof Object.getOwnPropertySymbols
              ) {
                var n = 0;
                for (i = Object.getOwnPropertySymbols(t); n < i.length; n++)
                  e.indexOf(i[n]) < 0 && (r[i[n]] = t[i[n]]);
              }
              return r;
            })(e, ["region"]);
          0 === (i = n || t.getLocalBounds(null, !0)).width && (i.width = 1),
            0 === i.height && (i.height = 1);
          var s = ji.create(bi({ width: i.width, height: i.height }, o));
          return (
            (bo.tx = -i.x),
            (bo.ty = -i.y),
            this.render(t, {
              renderTexture: s,
              clear: !1,
              transform: bo,
              skipUpdateTransform: !!t.parent,
            }),
            s
          );
        }),
        (r.prototype.destroy = function (e) {
          for (var r in this.plugins)
            this.plugins[r].destroy(), (this.plugins[r] = null);
          e &&
            this.view.parentNode &&
            this.view.parentNode.removeChild(this.view);
          var i = this;
          (i.plugins = null),
            (i.type = t.RENDERER_TYPE.UNKNOWN),
            (i.view = null),
            (i.screen = null),
            (i._tempDisplayObjectParent = null),
            (i.options = null),
            (this._backgroundColorRgba = null),
            (this._backgroundColorString = null),
            (this._lastObjectRendered = null);
        }),
        Object.defineProperty(r.prototype, "backgroundColor", {
          get: function () {
            return this._backgroundColor;
          },
          set: function (t) {
            (this._backgroundColor = t),
              (this._backgroundColorString = we(t)),
              Ce(t, this._backgroundColorRgba);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "backgroundAlpha", {
          get: function () {
            return this._backgroundColorRgba[3];
          },
          set: function (t) {
            this._backgroundColorRgba[3] = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(xt),
    Ao = function (t) {
      (this.buffer = t || null),
        (this.updateID = -1),
        (this.byteLength = -1),
        (this.refCount = 0);
    },
    xo = (function () {
      function t(t) {
        (this.renderer = t),
          (this.managedBuffers = {}),
          (this.boundBufferBases = {});
      }
      return (
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        (t.prototype.contextChange = function () {
          this.disposeAll(!0),
            (this.gl = this.renderer.gl),
            (this.CONTEXT_UID = this.renderer.CONTEXT_UID);
        }),
        (t.prototype.bind = function (t) {
          var e = this.gl,
            r = this.CONTEXT_UID,
            i = t._glBuffers[r] || this.createGLBuffer(t);
          e.bindBuffer(t.type, i.buffer);
        }),
        (t.prototype.bindBufferBase = function (t, e) {
          var r = this.gl,
            i = this.CONTEXT_UID;
          if (this.boundBufferBases[e] !== t) {
            var n = t._glBuffers[i] || this.createGLBuffer(t);
            (this.boundBufferBases[e] = t),
              r.bindBufferBase(r.UNIFORM_BUFFER, e, n.buffer);
          }
        }),
        (t.prototype.bindBufferRange = function (t, e, r) {
          var i = this.gl,
            n = this.CONTEXT_UID;
          r = r || 0;
          var o = t._glBuffers[n] || this.createGLBuffer(t);
          i.bindBufferRange(i.UNIFORM_BUFFER, e || 0, o.buffer, 256 * r, 256);
        }),
        (t.prototype.update = function (t) {
          var e = this.gl,
            r = this.CONTEXT_UID,
            i = t._glBuffers[r];
          if (t._updateID !== i.updateID)
            if (
              ((i.updateID = t._updateID),
              e.bindBuffer(t.type, i.buffer),
              i.byteLength >= t.data.byteLength)
            )
              e.bufferSubData(t.type, 0, t.data);
            else {
              var n = t.static ? e.STATIC_DRAW : e.DYNAMIC_DRAW;
              (i.byteLength = t.data.byteLength),
                e.bufferData(t.type, t.data, n);
            }
        }),
        (t.prototype.dispose = function (t, e) {
          if (this.managedBuffers[t.id]) {
            delete this.managedBuffers[t.id];
            var r = t._glBuffers[this.CONTEXT_UID],
              i = this.gl;
            t.disposeRunner.remove(this),
              r &&
                (e || i.deleteBuffer(r.buffer),
                delete t._glBuffers[this.CONTEXT_UID]);
          }
        }),
        (t.prototype.disposeAll = function (t) {
          for (
            var e = Object.keys(this.managedBuffers), r = 0;
            r < e.length;
            r++
          )
            this.dispose(this.managedBuffers[e[r]], t);
        }),
        (t.prototype.createGLBuffer = function (t) {
          var e = this.CONTEXT_UID,
            r = this.gl;
          return (
            (t._glBuffers[e] = new Ao(r.createBuffer())),
            (this.managedBuffers[t.id] = t),
            t.disposeRunner.add(this),
            t._glBuffers[e]
          );
        }),
        t
      );
    })(),
    So = (function (e) {
      function r(i) {
        var n = e.call(this, t.RENDERER_TYPE.WEBGL, i) || this;
        return (
          (i = n.options),
          (n.gl = null),
          (n.CONTEXT_UID = 0),
          (n.runners = {
            destroy: new mi("destroy"),
            contextChange: new mi("contextChange"),
            reset: new mi("reset"),
            update: new mi("update"),
            postrender: new mi("postrender"),
            prerender: new mi("prerender"),
            resize: new mi("resize"),
          }),
          n.runners.contextChange.add(n),
          (n.globalUniforms = new nn({ projectionMatrix: new gr() }, !0)),
          n
            .addSystem(Kn, "mask")
            .addSystem(dn, "context")
            .addSystem(mo, "state")
            .addSystem(vo, "shader")
            .addSystem(yo, "texture")
            .addSystem(xo, "buffer")
            .addSystem(mn, "geometry")
            .addSystem(_n, "framebuffer")
            .addSystem(Jn, "scissor")
            .addSystem($n, "stencil")
            .addSystem(to, "projection")
            .addSystem(Eo, "textureGC")
            .addSystem(hn, "filter")
            .addSystem(io, "renderTexture")
            .addSystem(ln, "batch"),
          n.initPlugins(r.__plugins),
          (n.multisample = void 0),
          i.context
            ? n.context.initFromContext(i.context)
            : n.context.initFromOptions({
                alpha: !!n.useContextAlpha,
                antialias: i.antialias,
                premultipliedAlpha:
                  n.useContextAlpha && "notMultiplied" !== n.useContextAlpha,
                stencil: !0,
                preserveDrawingBuffer: i.preserveDrawingBuffer,
                powerPreference: n.options.powerPreference,
              }),
          (n.renderingToScreen = !0),
          Me(2 === n.context.webGLVersion ? "WebGL 2" : "WebGL 1"),
          n.resize(n.options.width, n.options.height),
          n
        );
      }
      return (
        gi(r, e),
        (r.create = function (t) {
          if (Ne()) return new r(t);
          throw new Error(
            'WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.'
          );
        }),
        (r.prototype.contextChange = function () {
          var e,
            r = this.gl;
          if (1 === this.context.webGLVersion) {
            var i = r.getParameter(r.FRAMEBUFFER_BINDING);
            r.bindFramebuffer(r.FRAMEBUFFER, null),
              (e = r.getParameter(r.SAMPLES)),
              r.bindFramebuffer(r.FRAMEBUFFER, i);
          } else {
            i = r.getParameter(r.DRAW_FRAMEBUFFER_BINDING);
            r.bindFramebuffer(r.DRAW_FRAMEBUFFER, null),
              (e = r.getParameter(r.SAMPLES)),
              r.bindFramebuffer(r.DRAW_FRAMEBUFFER, i);
          }
          e >= t.MSAA_QUALITY.HIGH
            ? (this.multisample = t.MSAA_QUALITY.HIGH)
            : e >= t.MSAA_QUALITY.MEDIUM
            ? (this.multisample = t.MSAA_QUALITY.MEDIUM)
            : e >= t.MSAA_QUALITY.LOW
            ? (this.multisample = t.MSAA_QUALITY.LOW)
            : (this.multisample = t.MSAA_QUALITY.NONE);
        }),
        (r.prototype.addSystem = function (t, e) {
          var r = new t(this);
          if (this[e])
            throw new Error('Whoops! The name "' + e + '" is already in use');
          for (var i in ((this[e] = r), this.runners)) this.runners[i].add(r);
          return this;
        }),
        (r.prototype.render = function (t, e) {
          var r, i, n, o;
          if (
            (e &&
              (e instanceof ji
                ? (Je(
                    "6.0.0",
                    "Renderer#render arguments changed, use options instead."
                  ),
                  (r = e),
                  (i = arguments[2]),
                  (n = arguments[3]),
                  (o = arguments[4]))
                : ((r = e.renderTexture),
                  (i = e.clear),
                  (n = e.transform),
                  (o = e.skipUpdateTransform))),
            (this.renderingToScreen = !r),
            this.runners.prerender.emit(),
            this.emit("prerender"),
            (this.projection.transform = n),
            !this.context.isLost)
          ) {
            if ((r || (this._lastObjectRendered = t), !o)) {
              var s = t.enableTempParent();
              t.updateTransform(), t.disableTempParent(s);
            }
            this.renderTexture.bind(r),
              this.batch.currentRenderer.start(),
              (void 0 !== i ? i : this.clearBeforeRender) &&
                this.renderTexture.clear(),
              t.render(this),
              this.batch.currentRenderer.flush(),
              r && r.baseTexture.update(),
              this.runners.postrender.emit(),
              (this.projection.transform = null),
              this.emit("postrender");
          }
        }),
        (r.prototype.generateTexture = function (t, r, i, n) {
          void 0 === r && (r = {});
          var o = e.prototype.generateTexture.call(this, t, r, i, n);
          return this.framebuffer.blit(), o;
        }),
        (r.prototype.resize = function (t, r) {
          e.prototype.resize.call(this, t, r),
            this.runners.resize.emit(this.screen.height, this.screen.width);
        }),
        (r.prototype.reset = function () {
          return this.runners.reset.emit(), this;
        }),
        (r.prototype.clear = function () {
          this.renderTexture.bind(), this.renderTexture.clear();
        }),
        (r.prototype.destroy = function (t) {
          for (var r in (this.runners.destroy.emit(), this.runners))
            this.runners[r].destroy();
          e.prototype.destroy.call(this, t), (this.gl = null);
        }),
        Object.defineProperty(r.prototype, "extract", {
          get: function () {
            return (
              Je(
                "6.0.0",
                "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead."
              ),
              this.plugins.extract
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.registerPlugin = function (t, e) {
          (r.__plugins = r.__plugins || {}), (r.__plugins[t] = e);
        }),
        r
      );
    })(Ro);
  function Oo(t) {
    return So.create(t);
  }
  var Io =
      "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
    Po =
      "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n",
    Mo = (function () {
      function t(t) {
        Je(
          "6.1.0",
          "System class is deprecated, implemement ISystem interface instead."
        ),
          (this.renderer = t);
      }
      return (
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        t
      );
    })(),
    No = function () {
      (this.texArray = null),
        (this.blend = 0),
        (this.type = t.DRAW_MODES.TRIANGLES),
        (this.start = 0),
        (this.size = 0),
        (this.data = null);
    },
    Do = (function () {
      function t() {
        (this.elements = []), (this.ids = []), (this.count = 0);
      }
      return (
        (t.prototype.clear = function () {
          for (var t = 0; t < this.count; t++) this.elements[t] = null;
          this.count = 0;
        }),
        t
      );
    })(),
    Co = (function () {
      function t(t) {
        "number" == typeof t
          ? (this.rawBinaryData = new ArrayBuffer(t))
          : t instanceof Uint8Array
          ? (this.rawBinaryData = t.buffer)
          : (this.rawBinaryData = t),
          (this.uint32View = new Uint32Array(this.rawBinaryData)),
          (this.float32View = new Float32Array(this.rawBinaryData));
      }
      return (
        Object.defineProperty(t.prototype, "int8View", {
          get: function () {
            return (
              this._int8View ||
                (this._int8View = new Int8Array(this.rawBinaryData)),
              this._int8View
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "uint8View", {
          get: function () {
            return (
              this._uint8View ||
                (this._uint8View = new Uint8Array(this.rawBinaryData)),
              this._uint8View
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "int16View", {
          get: function () {
            return (
              this._int16View ||
                (this._int16View = new Int16Array(this.rawBinaryData)),
              this._int16View
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "uint16View", {
          get: function () {
            return (
              this._uint16View ||
                (this._uint16View = new Uint16Array(this.rawBinaryData)),
              this._uint16View
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "int32View", {
          get: function () {
            return (
              this._int32View ||
                (this._int32View = new Int32Array(this.rawBinaryData)),
              this._int32View
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.view = function (t) {
          return this[t + "View"];
        }),
        (t.prototype.destroy = function () {
          (this.rawBinaryData = null),
            (this._int8View = null),
            (this._uint8View = null),
            (this._int16View = null),
            (this._uint16View = null),
            (this._int32View = null),
            (this.uint32View = null),
            (this.float32View = null);
        }),
        (t.sizeOf = function (t) {
          switch (t) {
            case "int8":
            case "uint8":
              return 1;
            case "int16":
            case "uint16":
              return 2;
            case "int32":
            case "uint32":
            case "float32":
              return 4;
            default:
              throw new Error(t + " isn't a valid view type");
          }
        }),
        t
      );
    })(),
    wo = (function (e) {
      function r(t) {
        var r = e.call(this, t) || this;
        return (
          (r.shaderGenerator = null),
          (r.geometryClass = null),
          (r.vertexSize = null),
          (r.state = jn.for2d()),
          (r.size = 4 * bt.SPRITE_BATCH_SIZE),
          (r._vertexCount = 0),
          (r._indexCount = 0),
          (r._bufferedElements = []),
          (r._bufferedTextures = []),
          (r._bufferSize = 0),
          (r._shader = null),
          (r._packedGeometries = []),
          (r._packedGeometryPoolSize = 2),
          (r._flushId = 0),
          (r._aBuffers = {}),
          (r._iBuffers = {}),
          (r.MAX_TEXTURES = 1),
          r.renderer.on("prerender", r.onPrerender, r),
          t.runners.contextChange.add(r),
          (r._dcIndex = 0),
          (r._aIndex = 0),
          (r._iIndex = 0),
          (r._attributeBuffer = null),
          (r._indexBuffer = null),
          (r._tempBoundTextures = []),
          r
        );
      }
      return (
        gi(r, e),
        (r.prototype.contextChange = function () {
          var e = this.renderer.gl;
          bt.PREFER_ENV === t.ENV.WEBGL_LEGACY
            ? (this.MAX_TEXTURES = 1)
            : ((this.MAX_TEXTURES = Math.min(
                e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),
                bt.SPRITE_MAX_TEXTURES
              )),
              (this.MAX_TEXTURES = Gn(this.MAX_TEXTURES, e))),
            (this._shader = this.shaderGenerator.generateShader(
              this.MAX_TEXTURES
            ));
          for (var r = 0; r < this._packedGeometryPoolSize; r++)
            this._packedGeometries[r] = new this.geometryClass();
          this.initFlushBuffers();
        }),
        (r.prototype.initFlushBuffers = function () {
          for (
            var t = r._drawCallPool,
              e = r._textureArrayPool,
              i = this.size / 4,
              n = Math.floor(i / this.MAX_TEXTURES) + 1;
            t.length < i;

          )
            t.push(new No());
          for (; e.length < n; ) e.push(new Do());
          for (var o = 0; o < this.MAX_TEXTURES; o++)
            this._tempBoundTextures[o] = null;
        }),
        (r.prototype.onPrerender = function () {
          this._flushId = 0;
        }),
        (r.prototype.render = function (t) {
          t._texture.valid &&
            (this._vertexCount + t.vertexData.length / 2 > this.size &&
              this.flush(),
            (this._vertexCount += t.vertexData.length / 2),
            (this._indexCount += t.indices.length),
            (this._bufferedTextures[this._bufferSize] = t._texture.baseTexture),
            (this._bufferedElements[this._bufferSize++] = t));
        }),
        (r.prototype.buildTexturesAndDrawCalls = function () {
          var t = this._bufferedTextures,
            e = this.MAX_TEXTURES,
            i = r._textureArrayPool,
            n = this.renderer.batch,
            o = this._tempBoundTextures,
            s = this.renderer.textureGC.count,
            a = ++Si._globalBatch,
            h = 0,
            u = i[0],
            l = 0;
          n.copyBoundTextures(o, e);
          for (var c = 0; c < this._bufferSize; ++c) {
            var d = t[c];
            (t[c] = null),
              d._batchEnabled !== a &&
                (u.count >= e &&
                  (n.boundArray(u, o, a, e),
                  this.buildDrawCalls(u, l, c),
                  (l = c),
                  (u = i[++h]),
                  ++a),
                (d._batchEnabled = a),
                (d.touched = s),
                (u.elements[u.count++] = d));
          }
          u.count > 0 &&
            (n.boundArray(u, o, a, e),
            this.buildDrawCalls(u, l, this._bufferSize),
            ++h,
            ++a);
          for (c = 0; c < o.length; c++) o[c] = null;
          Si._globalBatch = a;
        }),
        (r.prototype.buildDrawCalls = function (t, e, i) {
          var n = this,
            o = n._bufferedElements,
            s = n._attributeBuffer,
            a = n._indexBuffer,
            h = n.vertexSize,
            u = r._drawCallPool,
            l = this._dcIndex,
            c = this._aIndex,
            d = this._iIndex,
            f = u[l];
          (f.start = this._iIndex), (f.texArray = t);
          for (var p = e; p < i; ++p) {
            var _ = o[p],
              v = _._texture.baseTexture,
              m = Fe[v.alphaMode ? 1 : 0][_.blendMode];
            (o[p] = null),
              e < p &&
                f.blend !== m &&
                ((f.size = d - f.start),
                (e = p),
                ((f = u[++l]).texArray = t),
                (f.start = d)),
              this.packInterleavedGeometry(_, s, a, c, d),
              (c += (_.vertexData.length / 2) * h),
              (d += _.indices.length),
              (f.blend = m);
          }
          e < i && ((f.size = d - f.start), ++l),
            (this._dcIndex = l),
            (this._aIndex = c),
            (this._iIndex = d);
        }),
        (r.prototype.bindAndClearTexArray = function (t) {
          for (var e = this.renderer.texture, r = 0; r < t.count; r++)
            e.bind(t.elements[r], t.ids[r]), (t.elements[r] = null);
          t.count = 0;
        }),
        (r.prototype.updateGeometry = function () {
          var t = this,
            e = t._packedGeometries,
            r = t._attributeBuffer,
            i = t._indexBuffer;
          bt.CAN_UPLOAD_SAME_BUFFER
            ? (e[this._flushId]._buffer.update(r.rawBinaryData),
              e[this._flushId]._indexBuffer.update(i),
              this.renderer.geometry.updateBuffers())
            : (this._packedGeometryPoolSize <= this._flushId &&
                (this._packedGeometryPoolSize++,
                (e[this._flushId] = new this.geometryClass())),
              e[this._flushId]._buffer.update(r.rawBinaryData),
              e[this._flushId]._indexBuffer.update(i),
              this.renderer.geometry.bind(e[this._flushId]),
              this.renderer.geometry.updateBuffers(),
              this._flushId++);
        }),
        (r.prototype.drawBatches = function () {
          for (
            var t = this._dcIndex,
              e = this.renderer,
              i = e.gl,
              n = e.state,
              o = r._drawCallPool,
              s = null,
              a = 0;
            a < t;
            a++
          ) {
            var h = o[a],
              u = h.texArray,
              l = h.type,
              c = h.size,
              d = h.start,
              f = h.blend;
            s !== u && ((s = u), this.bindAndClearTexArray(u)),
              (this.state.blendMode = f),
              n.set(this.state),
              i.drawElements(l, c, i.UNSIGNED_SHORT, 2 * d);
          }
        }),
        (r.prototype.flush = function () {
          0 !== this._vertexCount &&
            ((this._attributeBuffer = this.getAttributeBuffer(
              this._vertexCount
            )),
            (this._indexBuffer = this.getIndexBuffer(this._indexCount)),
            (this._aIndex = 0),
            (this._iIndex = 0),
            (this._dcIndex = 0),
            this.buildTexturesAndDrawCalls(),
            this.updateGeometry(),
            this.drawBatches(),
            (this._bufferSize = 0),
            (this._vertexCount = 0),
            (this._indexCount = 0));
        }),
        (r.prototype.start = function () {
          this.renderer.state.set(this.state),
            this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES),
            this.renderer.shader.bind(this._shader),
            bt.CAN_UPLOAD_SAME_BUFFER &&
              this.renderer.geometry.bind(
                this._packedGeometries[this._flushId]
              );
        }),
        (r.prototype.stop = function () {
          this.flush();
        }),
        (r.prototype.destroy = function () {
          for (var t = 0; t < this._packedGeometryPoolSize; t++)
            this._packedGeometries[t] && this._packedGeometries[t].destroy();
          this.renderer.off("prerender", this.onPrerender, this),
            (this._aBuffers = null),
            (this._iBuffers = null),
            (this._packedGeometries = null),
            (this._attributeBuffer = null),
            (this._indexBuffer = null),
            this._shader && (this._shader.destroy(), (this._shader = null)),
            e.prototype.destroy.call(this);
        }),
        (r.prototype.getAttributeBuffer = function (t) {
          var e = je(Math.ceil(t / 8)),
            r = We(e),
            i = 8 * e;
          this._aBuffers.length <= r && (this._iBuffers.length = r + 1);
          var n = this._aBuffers[i];
          return (
            n || (this._aBuffers[i] = n = new Co(i * this.vertexSize * 4)), n
          );
        }),
        (r.prototype.getIndexBuffer = function (t) {
          var e = je(Math.ceil(t / 12)),
            r = We(e),
            i = 12 * e;
          this._iBuffers.length <= r && (this._iBuffers.length = r + 1);
          var n = this._iBuffers[r];
          return n || (this._iBuffers[r] = n = new Uint16Array(i)), n;
        }),
        (r.prototype.packInterleavedGeometry = function (t, e, r, i, n) {
          for (
            var o = e.uint32View,
              s = e.float32View,
              a = i / this.vertexSize,
              h = t.uvs,
              u = t.indices,
              l = t.vertexData,
              c = t._texture.baseTexture._batchLocation,
              d = Math.min(t.worldAlpha, 1),
              f =
                d < 1 && t._texture.baseTexture.alphaMode
                  ? Ge(t._tintRGB, d)
                  : t._tintRGB + ((255 * d) << 24),
              p = 0;
            p < l.length;
            p += 2
          )
            (s[i++] = l[p]),
              (s[i++] = l[p + 1]),
              (s[i++] = h[p]),
              (s[i++] = h[p + 1]),
              (o[i++] = f),
              (s[i++] = c);
          for (p = 0; p < u.length; p++) r[n++] = a + u[p];
        }),
        (r._drawCallPool = []),
        (r._textureArrayPool = []),
        r
      );
    })(un),
    Lo = (function () {
      function t(t, e) {
        if (
          ((this.vertexSrc = t),
          (this.fragTemplate = e),
          (this.programCache = {}),
          (this.defaultGroupCache = {}),
          e.indexOf("%count%") < 0)
        )
          throw new Error('Fragment template must contain "%count%".');
        if (e.indexOf("%forloop%") < 0)
          throw new Error('Fragment template must contain "%forloop%".');
      }
      return (
        (t.prototype.generateShader = function (t) {
          if (!this.programCache[t]) {
            for (var e = new Int32Array(t), r = 0; r < t; r++) e[r] = r;
            this.defaultGroupCache[t] = nn.from({ uSamplers: e }, !0);
            var i = this.fragTemplate;
            (i = (i = i.replace(/%count%/gi, "" + t)).replace(
              /%forloop%/gi,
              this.generateSampleSrc(t)
            )),
              (this.programCache[t] = new Hn(this.vertexSrc, i));
          }
          var n = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new gr(),
            default: this.defaultGroupCache[t],
          };
          return new Yn(this.programCache[t], n);
        }),
        (t.prototype.generateSampleSrc = function (t) {
          var e = "";
          (e += "\n"), (e += "\n");
          for (var r = 0; r < t; r++)
            r > 0 && (e += "\nelse "),
              r < t - 1 && (e += "if(vTextureId < " + r + ".5)"),
              (e += "\n{"),
              (e +=
                "\n\tcolor = texture2D(uSamplers[" + r + "], vTextureCoord);"),
              (e += "\n}");
          return (e += "\n"), (e += "\n");
        }),
        t
      );
    })(),
    Fo = (function (e) {
      function r(r) {
        void 0 === r && (r = !1);
        var i = e.call(this) || this;
        return (
          (i._buffer = new qi(null, r, !1)),
          (i._indexBuffer = new qi(null, r, !0)),
          i
            .addAttribute("aVertexPosition", i._buffer, 2, !1, t.TYPES.FLOAT)
            .addAttribute("aTextureCoord", i._buffer, 2, !1, t.TYPES.FLOAT)
            .addAttribute("aColor", i._buffer, 4, !0, t.TYPES.UNSIGNED_BYTE)
            .addAttribute("aTextureId", i._buffer, 1, !0, t.TYPES.FLOAT)
            .addIndex(i._indexBuffer),
          i
        );
      }
      return gi(r, e), r;
    })($i),
    Uo =
      "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n",
    Bo =
      "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n",
    Go = (function () {
      function t() {}
      return (
        (t.create = function (t) {
          var e = Object.assign(
              { vertex: Uo, fragment: Bo, geometryClass: Fo, vertexSize: 6 },
              t
            ),
            r = e.vertex,
            i = e.fragment,
            n = e.vertexSize,
            o = e.geometryClass;
          return (function (t) {
            function e(e) {
              var s = t.call(this, e) || this;
              return (
                (s.shaderGenerator = new Lo(r, i)),
                (s.geometryClass = o),
                (s.vertexSize = n),
                s
              );
            }
            return gi(e, t), e;
          })(wo);
        }),
        Object.defineProperty(t, "defaultVertexSrc", {
          get: function () {
            return Uo;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t, "defaultFragmentTemplate", {
          get: function () {
            return Bo;
          },
          enumerable: !1,
          configurable: !0,
        }),
        t
      );
    })(),
    Xo = Go.create(),
    ko = {},
    Ho = function (t) {
      Object.defineProperty(ko, t, {
        get: function () {
          return (
            Je("6.0.0", "PIXI.systems." + t + " has moved to PIXI." + t), Fi[t]
          );
        },
      });
    };
  for (var Yo in Fi) Ho(Yo);
  var jo = {},
    Vo = function (t) {
      Object.defineProperty(jo, t, {
        get: function () {
          return (
            Je("6.0.0", "PIXI.resources." + t + " has moved to PIXI." + t),
            go[t]
          );
        },
      });
    };
  for (var Yo in go) Vo(Yo);
  /*!
   * @pixi/app - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/app is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */ var Wo = (function () {
      function t(e) {
        var r = this;
        (this.stage = new ri()),
          (e = Object.assign({ forceCanvas: !1 }, e)),
          (this.renderer = Oo(e)),
          t._plugins.forEach(function (t) {
            t.init.call(r, e);
          });
      }
      return (
        (t.registerPlugin = function (e) {
          t._plugins.push(e);
        }),
        (t.prototype.render = function () {
          this.renderer.render(this.stage);
        }),
        Object.defineProperty(t.prototype, "view", {
          get: function () {
            return this.renderer.view;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "screen", {
          get: function () {
            return this.renderer.screen;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.destroy = function (e, r) {
          var i = this,
            n = t._plugins.slice(0);
          n.reverse(),
            n.forEach(function (t) {
              t.destroy.call(i);
            }),
            this.stage.destroy(r),
            (this.stage = null),
            this.renderer.destroy(e),
            (this.renderer = null);
        }),
        (t._plugins = []),
        t
      );
    })(),
    zo = (function () {
      function t() {}
      return (
        (t.init = function (t) {
          var e = this;
          Object.defineProperty(this, "resizeTo", {
            set: function (t) {
              globalThis.removeEventListener("resize", this.queueResize),
                (this._resizeTo = t),
                t &&
                  (globalThis.addEventListener("resize", this.queueResize),
                  this.resize());
            },
            get: function () {
              return this._resizeTo;
            },
          }),
            (this.queueResize = function () {
              e._resizeTo &&
                (e.cancelResize(),
                (e._resizeId = requestAnimationFrame(function () {
                  return e.resize();
                })));
            }),
            (this.cancelResize = function () {
              e._resizeId &&
                (cancelAnimationFrame(e._resizeId), (e._resizeId = null));
            }),
            (this.resize = function () {
              if (e._resizeTo) {
                var t, r;
                if ((e.cancelResize(), e._resizeTo === globalThis.window))
                  (t = globalThis.innerWidth), (r = globalThis.innerHeight);
                else {
                  var i = e._resizeTo;
                  (t = i.clientWidth), (r = i.clientHeight);
                }
                e.renderer.resize(t, r);
              }
            }),
            (this._resizeId = null),
            (this._resizeTo = null),
            (this.resizeTo = t.resizeTo || null);
        }),
        (t.destroy = function () {
          globalThis.removeEventListener("resize", this.queueResize),
            this.cancelResize(),
            (this.cancelResize = null),
            (this.queueResize = null),
            (this.resizeTo = null),
            (this.resize = null);
        }),
        t
      );
    })();
  Wo.registerPlugin(zo);
  /*!
   * @pixi/extract - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/extract is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  var qo = new _r(),
    Ko = (function () {
      function t(t) {
        this.renderer = t;
      }
      return (
        (t.prototype.image = function (t, e, r) {
          var i = new Image();
          return (i.src = this.base64(t, e, r)), i;
        }),
        (t.prototype.base64 = function (t, e, r) {
          return this.canvas(t).toDataURL(e, r);
        }),
        (t.prototype.canvas = function (e) {
          var r,
            i,
            n,
            o = this.renderer,
            s = !1,
            a = !1;
          e &&
            (e instanceof ji
              ? (n = e)
              : ((n = this.renderer.generateTexture(e)), (a = !0))),
            n
              ? ((r = n.baseTexture.resolution),
                (i = n.frame),
                (s = !1),
                o.renderTexture.bind(n))
              : ((r = this.renderer.resolution),
                (s = !0),
                ((i = qo).width = this.renderer.width),
                (i.height = this.renderer.height),
                o.renderTexture.bind(null));
          var h = Math.floor(i.width * r + 1e-4),
            u = Math.floor(i.height * r + 1e-4),
            l = new rr(h, u, 1),
            c = new Uint8Array(4 * h * u),
            d = o.gl;
          d.readPixels(i.x * r, i.y * r, h, u, d.RGBA, d.UNSIGNED_BYTE, c);
          var f = l.context.getImageData(0, 0, h, u);
          if (
            (t.arrayPostDivide(c, f.data), l.context.putImageData(f, 0, 0), s)
          ) {
            var p = new rr(l.width, l.height, 1);
            p.context.scale(1, -1),
              p.context.drawImage(l.canvas, 0, -u),
              l.destroy(),
              (l = p);
          }
          return a && n.destroy(!0), l.canvas;
        }),
        (t.prototype.pixels = function (e) {
          var r,
            i,
            n,
            o = this.renderer,
            s = !1;
          e &&
            (e instanceof ji
              ? (n = e)
              : ((n = this.renderer.generateTexture(e)), (s = !0))),
            n
              ? ((r = n.baseTexture.resolution),
                (i = n.frame),
                o.renderTexture.bind(n))
              : ((r = o.resolution),
                ((i = qo).width = o.width),
                (i.height = o.height),
                o.renderTexture.bind(null));
          var a = i.width * r,
            h = i.height * r,
            u = new Uint8Array(4 * a * h),
            l = o.gl;
          return (
            l.readPixels(i.x * r, i.y * r, a, h, l.RGBA, l.UNSIGNED_BYTE, u),
            s && n.destroy(!0),
            t.arrayPostDivide(u, u),
            u
          );
        }),
        (t.prototype.destroy = function () {
          this.renderer = null;
        }),
        (t.arrayPostDivide = function (t, e) {
          for (var r = 0; r < t.length; r += 4) {
            var i = (e[r + 3] = t[r + 3]);
            0 !== i
              ? ((e[r] = Math.round(Math.min((255 * t[r]) / i, 255))),
                (e[r + 1] = Math.round(Math.min((255 * t[r + 1]) / i, 255))),
                (e[r + 2] = Math.round(Math.min((255 * t[r + 2]) / i, 255))))
              : ((e[r] = t[r]), (e[r + 1] = t[r + 1]), (e[r + 2] = t[r + 2]));
          }
        }),
        t
      );
    })(),
    Zo = (function () {
      function t(t, e, r) {
        void 0 === e && (e = !1),
          (this._fn = t),
          (this._once = e),
          (this._thisArg = r),
          (this._next = this._prev = this._owner = null);
      }
      return (
        (t.prototype.detach = function () {
          return null !== this._owner && (this._owner.detach(this), !0);
        }),
        t
      );
    })();
  function Qo(t, e) {
    return (
      t._head
        ? ((t._tail._next = e), (e._prev = t._tail), (t._tail = e))
        : ((t._head = e), (t._tail = e)),
      (e._owner = t),
      e
    );
  }
  var Jo = (function () {
    function t() {
      this._head = this._tail = void 0;
    }
    return (
      (t.prototype.handlers = function (t) {
        void 0 === t && (t = !1);
        var e = this._head;
        if (t) return !!e;
        for (var r = []; e; ) r.push(e), (e = e._next);
        return r;
      }),
      (t.prototype.has = function (t) {
        if (!(t instanceof Zo))
          throw new Error(
            "MiniSignal#has(): First arg must be a SignalBinding object."
          );
        return t._owner === this;
      }),
      (t.prototype.dispatch = function () {
        for (var t = arguments, e = [], r = 0; r < arguments.length; r++)
          e[r] = t[r];
        var i = this._head;
        if (!i) return !1;
        for (; i; )
          i._once && this.detach(i), i._fn.apply(i._thisArg, e), (i = i._next);
        return !0;
      }),
      (t.prototype.add = function (t, e) {
        if ((void 0 === e && (e = null), "function" != typeof t))
          throw new Error("MiniSignal#add(): First arg must be a Function.");
        return Qo(this, new Zo(t, !1, e));
      }),
      (t.prototype.once = function (t, e) {
        if ((void 0 === e && (e = null), "function" != typeof t))
          throw new Error("MiniSignal#once(): First arg must be a Function.");
        return Qo(this, new Zo(t, !0, e));
      }),
      (t.prototype.detach = function (t) {
        if (!(t instanceof Zo))
          throw new Error(
            "MiniSignal#detach(): First arg must be a SignalBinding object."
          );
        return (
          t._owner !== this ||
            (t._prev && (t._prev._next = t._next),
            t._next && (t._next._prev = t._prev),
            t === this._head
              ? ((this._head = t._next),
                null === t._next && (this._tail = null))
              : t === this._tail &&
                ((this._tail = t._prev), (this._tail._next = null)),
            (t._owner = null)),
          this
        );
      }),
      (t.prototype.detachAll = function () {
        var t = this._head;
        if (!t) return this;
        for (this._head = this._tail = null; t; )
          (t._owner = null), (t = t._next);
        return this;
      }),
      t
    );
  })();
  function $o(t, e) {
    e = e || {};
    for (
      var r = {
          key: [
            "source",
            "protocol",
            "authority",
            "userInfo",
            "user",
            "password",
            "host",
            "port",
            "relative",
            "path",
            "directory",
            "file",
            "query",
            "anchor",
          ],
          q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
          parser: {
            strict:
              /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:
              /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          },
        },
        i = r.parser[e.strictMode ? "strict" : "loose"].exec(t),
        n = {},
        o = 14;
      o--;

    )
      n[r.key[o]] = i[o] || "";
    return (
      (n[r.q.name] = {}),
      n[r.key[12]].replace(r.q.parser, function (t, e, i) {
        e && (n[r.q.name][e] = i);
      }),
      n
    );
  }
  var ts,
    es,
    rs,
    is,
    ns,
    os = !(
      !globalThis.XDomainRequest || "withCredentials" in new XMLHttpRequest()
    ),
    ss = null;
  function as() {}
  function hs(t, e, r) {
    e && 0 === e.indexOf(".") && (e = e.substring(1)), e && (t[e] = r);
  }
  function us(t) {
    return t.toString().replace("object ", "");
  }
  function ls() {}
  function cs(t) {
    return function () {
      for (var e = arguments, r = [], i = 0; i < arguments.length; i++)
        r[i] = e[i];
      if (null === t) throw new Error("Callback was already called.");
      var n = t;
      (t = null), n.apply(this, r);
    };
  }
  (t.LoaderResource = (function () {
    function t(e, r, i) {
      if (
        ((this._dequeue = as),
        (this._onLoadBinding = null),
        (this._elementTimer = 0),
        (this._boundComplete = null),
        (this._boundOnError = null),
        (this._boundOnProgress = null),
        (this._boundOnTimeout = null),
        (this._boundXhrOnError = null),
        (this._boundXhrOnTimeout = null),
        (this._boundXhrOnAbort = null),
        (this._boundXhrOnLoad = null),
        "string" != typeof e || "string" != typeof r)
      )
        throw new Error(
          "Both name and url are required for constructing a resource."
        );
      (i = i || {}),
        (this._flags = 0),
        this._setFlag(t.STATUS_FLAGS.DATA_URL, 0 === r.indexOf("data:")),
        (this.name = e),
        (this.url = r),
        (this.extension = this._getExtension()),
        (this.data = null),
        (this.crossOrigin = !0 === i.crossOrigin ? "anonymous" : i.crossOrigin),
        (this.timeout = i.timeout || 0),
        (this.loadType = i.loadType || this._determineLoadType()),
        (this.xhrType = i.xhrType),
        (this.metadata = i.metadata || {}),
        (this.error = null),
        (this.xhr = null),
        (this.children = []),
        (this.type = t.TYPE.UNKNOWN),
        (this.progressChunk = 0),
        (this._dequeue = as),
        (this._onLoadBinding = null),
        (this._elementTimer = 0),
        (this._boundComplete = this.complete.bind(this)),
        (this._boundOnError = this._onError.bind(this)),
        (this._boundOnProgress = this._onProgress.bind(this)),
        (this._boundOnTimeout = this._onTimeout.bind(this)),
        (this._boundXhrOnError = this._xhrOnError.bind(this)),
        (this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this)),
        (this._boundXhrOnAbort = this._xhrOnAbort.bind(this)),
        (this._boundXhrOnLoad = this._xhrOnLoad.bind(this)),
        (this.onStart = new Jo()),
        (this.onProgress = new Jo()),
        (this.onComplete = new Jo()),
        (this.onAfterMiddleware = new Jo());
    }
    return (
      (t.setExtensionLoadType = function (e, r) {
        hs(t._loadTypeMap, e, r);
      }),
      (t.setExtensionXhrType = function (e, r) {
        hs(t._xhrTypeMap, e, r);
      }),
      Object.defineProperty(t.prototype, "isDataUrl", {
        get: function () {
          return this._hasFlag(t.STATUS_FLAGS.DATA_URL);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "isComplete", {
        get: function () {
          return this._hasFlag(t.STATUS_FLAGS.COMPLETE);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "isLoading", {
        get: function () {
          return this._hasFlag(t.STATUS_FLAGS.LOADING);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.complete = function () {
        this._clearEvents(), this._finish();
      }),
      (t.prototype.abort = function (e) {
        if (!this.error) {
          if (((this.error = new Error(e)), this._clearEvents(), this.xhr))
            this.xhr.abort();
          else if (this.xdr) this.xdr.abort();
          else if (this.data)
            if (this.data.src) this.data.src = t.EMPTY_GIF;
            else
              for (; this.data.firstChild; )
                this.data.removeChild(this.data.firstChild);
          this._finish();
        }
      }),
      (t.prototype.load = function (e) {
        var r = this;
        if (!this.isLoading)
          if (this.isComplete)
            e &&
              setTimeout(function () {
                return e(r);
              }, 1);
          else
            switch (
              (e && this.onComplete.once(e),
              this._setFlag(t.STATUS_FLAGS.LOADING, !0),
              this.onStart.dispatch(this),
              (!1 !== this.crossOrigin &&
                "string" == typeof this.crossOrigin) ||
                (this.crossOrigin = this._determineCrossOrigin(this.url)),
              this.loadType)
            ) {
              case t.LOAD_TYPE.IMAGE:
                (this.type = t.TYPE.IMAGE), this._loadElement("image");
                break;
              case t.LOAD_TYPE.AUDIO:
                (this.type = t.TYPE.AUDIO), this._loadSourceElement("audio");
                break;
              case t.LOAD_TYPE.VIDEO:
                (this.type = t.TYPE.VIDEO), this._loadSourceElement("video");
                break;
              case t.LOAD_TYPE.XHR:
              default:
                os && this.crossOrigin ? this._loadXdr() : this._loadXhr();
            }
      }),
      (t.prototype._hasFlag = function (t) {
        return 0 != (this._flags & t);
      }),
      (t.prototype._setFlag = function (t, e) {
        this._flags = e ? this._flags | t : this._flags & ~t;
      }),
      (t.prototype._clearEvents = function () {
        clearTimeout(this._elementTimer),
          this.data &&
            this.data.removeEventListener &&
            (this.data.removeEventListener("error", this._boundOnError, !1),
            this.data.removeEventListener("load", this._boundComplete, !1),
            this.data.removeEventListener(
              "progress",
              this._boundOnProgress,
              !1
            ),
            this.data.removeEventListener(
              "canplaythrough",
              this._boundComplete,
              !1
            )),
          this.xhr &&
            (this.xhr.removeEventListener
              ? (this.xhr.removeEventListener(
                  "error",
                  this._boundXhrOnError,
                  !1
                ),
                this.xhr.removeEventListener(
                  "timeout",
                  this._boundXhrOnTimeout,
                  !1
                ),
                this.xhr.removeEventListener(
                  "abort",
                  this._boundXhrOnAbort,
                  !1
                ),
                this.xhr.removeEventListener(
                  "progress",
                  this._boundOnProgress,
                  !1
                ),
                this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1))
              : ((this.xhr.onerror = null),
                (this.xhr.ontimeout = null),
                (this.xhr.onprogress = null),
                (this.xhr.onload = null)));
      }),
      (t.prototype._finish = function () {
        if (this.isComplete)
          throw new Error(
            "Complete called again for an already completed resource."
          );
        this._setFlag(t.STATUS_FLAGS.COMPLETE, !0),
          this._setFlag(t.STATUS_FLAGS.LOADING, !1),
          this.onComplete.dispatch(this);
      }),
      (t.prototype._loadElement = function (t) {
        this.metadata.loadElement
          ? (this.data = this.metadata.loadElement)
          : "image" === t && void 0 !== globalThis.Image
          ? (this.data = new Image())
          : (this.data = document.createElement(t)),
          this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
          this.metadata.skipSource || (this.data.src = this.url),
          this.data.addEventListener("error", this._boundOnError, !1),
          this.data.addEventListener("load", this._boundComplete, !1),
          this.data.addEventListener("progress", this._boundOnProgress, !1),
          this.timeout &&
            (this._elementTimer = setTimeout(
              this._boundOnTimeout,
              this.timeout
            ));
      }),
      (t.prototype._loadSourceElement = function (t) {
        if (
          (this.metadata.loadElement
            ? (this.data = this.metadata.loadElement)
            : "audio" === t && void 0 !== globalThis.Audio
            ? (this.data = new Audio())
            : (this.data = document.createElement(t)),
          null !== this.data)
        ) {
          if (
            (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
            !this.metadata.skipSource)
          )
            if (navigator.isCocoonJS)
              this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
            else if (Array.isArray(this.url))
              for (
                var e = this.metadata.mimeType, r = 0;
                r < this.url.length;
                ++r
              )
                this.data.appendChild(
                  this._createSource(
                    t,
                    this.url[r],
                    Array.isArray(e) ? e[r] : e
                  )
                );
            else {
              e = this.metadata.mimeType;
              this.data.appendChild(
                this._createSource(t, this.url, Array.isArray(e) ? e[0] : e)
              );
            }
          this.data.addEventListener("error", this._boundOnError, !1),
            this.data.addEventListener("load", this._boundComplete, !1),
            this.data.addEventListener("progress", this._boundOnProgress, !1),
            this.data.addEventListener(
              "canplaythrough",
              this._boundComplete,
              !1
            ),
            this.data.load(),
            this.timeout &&
              (this._elementTimer = setTimeout(
                this._boundOnTimeout,
                this.timeout
              ));
        } else this.abort("Unsupported element: " + t);
      }),
      (t.prototype._loadXhr = function () {
        "string" != typeof this.xhrType &&
          (this.xhrType = this._determineXhrType());
        var e = (this.xhr = new XMLHttpRequest());
        "use-credentials" === this.crossOrigin && (e.withCredentials = !0),
          e.open("GET", this.url, !0),
          (e.timeout = this.timeout),
          this.xhrType === t.XHR_RESPONSE_TYPE.JSON ||
          this.xhrType === t.XHR_RESPONSE_TYPE.DOCUMENT
            ? (e.responseType = t.XHR_RESPONSE_TYPE.TEXT)
            : (e.responseType = this.xhrType),
          e.addEventListener("error", this._boundXhrOnError, !1),
          e.addEventListener("timeout", this._boundXhrOnTimeout, !1),
          e.addEventListener("abort", this._boundXhrOnAbort, !1),
          e.addEventListener("progress", this._boundOnProgress, !1),
          e.addEventListener("load", this._boundXhrOnLoad, !1),
          e.send();
      }),
      (t.prototype._loadXdr = function () {
        "string" != typeof this.xhrType &&
          (this.xhrType = this._determineXhrType());
        var t = (this.xhr = new globalThis.XDomainRequest());
        (t.timeout = this.timeout || 5e3),
          (t.onerror = this._boundXhrOnError),
          (t.ontimeout = this._boundXhrOnTimeout),
          (t.onprogress = this._boundOnProgress),
          (t.onload = this._boundXhrOnLoad),
          t.open("GET", this.url, !0),
          setTimeout(function () {
            return t.send();
          }, 1);
      }),
      (t.prototype._createSource = function (t, e, r) {
        r || (r = t + "/" + this._getExtension(e));
        var i = document.createElement("source");
        return (i.src = e), (i.type = r), i;
      }),
      (t.prototype._onError = function (t) {
        this.abort("Failed to load element using: " + t.target.nodeName);
      }),
      (t.prototype._onProgress = function (t) {
        t &&
          t.lengthComputable &&
          this.onProgress.dispatch(this, t.loaded / t.total);
      }),
      (t.prototype._onTimeout = function () {
        this.abort("Load timed out.");
      }),
      (t.prototype._xhrOnError = function () {
        var t = this.xhr;
        this.abort(
          us(t) +
            " Request failed. Status: " +
            t.status +
            ', text: "' +
            t.statusText +
            '"'
        );
      }),
      (t.prototype._xhrOnTimeout = function () {
        var t = this.xhr;
        this.abort(us(t) + " Request timed out.");
      }),
      (t.prototype._xhrOnAbort = function () {
        var t = this.xhr;
        this.abort(us(t) + " Request was aborted by the user.");
      }),
      (t.prototype._xhrOnLoad = function () {
        var e = this.xhr,
          r = "",
          i = void 0 === e.status ? 200 : e.status;
        if (
          (("" !== e.responseType &&
            "text" !== e.responseType &&
            void 0 !== e.responseType) ||
            (r = e.responseText),
          0 === i &&
          (r.length > 0 || e.responseType === t.XHR_RESPONSE_TYPE.BUFFER)
            ? (i = 200)
            : 1223 === i && (i = 204),
          2 === ((i / 100) | 0))
        ) {
          if (this.xhrType === t.XHR_RESPONSE_TYPE.TEXT)
            (this.data = r), (this.type = t.TYPE.TEXT);
          else if (this.xhrType === t.XHR_RESPONSE_TYPE.JSON)
            try {
              (this.data = JSON.parse(r)), (this.type = t.TYPE.JSON);
            } catch (t) {
              return void this.abort("Error trying to parse loaded json: " + t);
            }
          else if (this.xhrType === t.XHR_RESPONSE_TYPE.DOCUMENT)
            try {
              if (globalThis.DOMParser) {
                var n = new DOMParser();
                this.data = n.parseFromString(r, "text/xml");
              } else {
                var o = document.createElement("div");
                (o.innerHTML = r), (this.data = o);
              }
              this.type = t.TYPE.XML;
            } catch (t) {
              return void this.abort("Error trying to parse loaded xml: " + t);
            }
          else this.data = e.response || r;
          this.complete();
        } else
          this.abort(
            "[" + e.status + "] " + e.statusText + ": " + e.responseURL
          );
      }),
      (t.prototype._determineCrossOrigin = function (t, e) {
        if (0 === t.indexOf("data:")) return "";
        if (globalThis.origin !== globalThis.location.origin)
          return "anonymous";
        (e = e || globalThis.location),
          ss || (ss = document.createElement("a")),
          (ss.href = t);
        var r = $o(ss.href, { strictMode: !0 }),
          i = (!r.port && "" === e.port) || r.port === e.port,
          n = r.protocol ? r.protocol + ":" : "";
        return r.host === e.hostname && i && n === e.protocol
          ? ""
          : "anonymous";
      }),
      (t.prototype._determineXhrType = function () {
        return t._xhrTypeMap[this.extension] || t.XHR_RESPONSE_TYPE.TEXT;
      }),
      (t.prototype._determineLoadType = function () {
        return t._loadTypeMap[this.extension] || t.LOAD_TYPE.XHR;
      }),
      (t.prototype._getExtension = function (t) {
        void 0 === t && (t = this.url);
        var e = "";
        if (this.isDataUrl) {
          var r = t.indexOf("/");
          e = t.substring(r + 1, t.indexOf(";", r));
        } else {
          var i = t.indexOf("?"),
            n = t.indexOf("#"),
            o = Math.min(i > -1 ? i : t.length, n > -1 ? n : t.length);
          e = (t = t.substring(0, o)).substring(t.lastIndexOf(".") + 1);
        }
        return e.toLowerCase();
      }),
      (t.prototype._getMimeFromXhrType = function (e) {
        switch (e) {
          case t.XHR_RESPONSE_TYPE.BUFFER:
            return "application/octet-binary";
          case t.XHR_RESPONSE_TYPE.BLOB:
            return "application/blob";
          case t.XHR_RESPONSE_TYPE.DOCUMENT:
            return "application/xml";
          case t.XHR_RESPONSE_TYPE.JSON:
            return "application/json";
          case t.XHR_RESPONSE_TYPE.DEFAULT:
          case t.XHR_RESPONSE_TYPE.TEXT:
          default:
            return "text/plain";
        }
      }),
      t
    );
  })()),
    (ts = t.LoaderResource || (t.LoaderResource = {})),
    ((es = ts.STATUS_FLAGS || (ts.STATUS_FLAGS = {}))[(es.NONE = 0)] = "NONE"),
    (es[(es.DATA_URL = 1)] = "DATA_URL"),
    (es[(es.COMPLETE = 2)] = "COMPLETE"),
    (es[(es.LOADING = 4)] = "LOADING"),
    ((rs = ts.TYPE || (ts.TYPE = {}))[(rs.UNKNOWN = 0)] = "UNKNOWN"),
    (rs[(rs.JSON = 1)] = "JSON"),
    (rs[(rs.XML = 2)] = "XML"),
    (rs[(rs.IMAGE = 3)] = "IMAGE"),
    (rs[(rs.AUDIO = 4)] = "AUDIO"),
    (rs[(rs.VIDEO = 5)] = "VIDEO"),
    (rs[(rs.TEXT = 6)] = "TEXT"),
    ((is = ts.LOAD_TYPE || (ts.LOAD_TYPE = {}))[(is.XHR = 1)] = "XHR"),
    (is[(is.IMAGE = 2)] = "IMAGE"),
    (is[(is.AUDIO = 3)] = "AUDIO"),
    (is[(is.VIDEO = 4)] = "VIDEO"),
    ((ns = ts.XHR_RESPONSE_TYPE || (ts.XHR_RESPONSE_TYPE = {})).DEFAULT =
      "text"),
    (ns.BUFFER = "arraybuffer"),
    (ns.BLOB = "blob"),
    (ns.DOCUMENT = "document"),
    (ns.JSON = "json"),
    (ns.TEXT = "text"),
    (ts._loadTypeMap = {
      gif: ts.LOAD_TYPE.IMAGE,
      png: ts.LOAD_TYPE.IMAGE,
      bmp: ts.LOAD_TYPE.IMAGE,
      jpg: ts.LOAD_TYPE.IMAGE,
      jpeg: ts.LOAD_TYPE.IMAGE,
      tif: ts.LOAD_TYPE.IMAGE,
      tiff: ts.LOAD_TYPE.IMAGE,
      webp: ts.LOAD_TYPE.IMAGE,
      tga: ts.LOAD_TYPE.IMAGE,
      svg: ts.LOAD_TYPE.IMAGE,
      "svg+xml": ts.LOAD_TYPE.IMAGE,
      mp3: ts.LOAD_TYPE.AUDIO,
      ogg: ts.LOAD_TYPE.AUDIO,
      wav: ts.LOAD_TYPE.AUDIO,
      mp4: ts.LOAD_TYPE.VIDEO,
      webm: ts.LOAD_TYPE.VIDEO,
    }),
    (ts._xhrTypeMap = {
      xhtml: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      html: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      htm: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      xml: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      tmx: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      svg: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      tsx: ts.XHR_RESPONSE_TYPE.DOCUMENT,
      gif: ts.XHR_RESPONSE_TYPE.BLOB,
      png: ts.XHR_RESPONSE_TYPE.BLOB,
      bmp: ts.XHR_RESPONSE_TYPE.BLOB,
      jpg: ts.XHR_RESPONSE_TYPE.BLOB,
      jpeg: ts.XHR_RESPONSE_TYPE.BLOB,
      tif: ts.XHR_RESPONSE_TYPE.BLOB,
      tiff: ts.XHR_RESPONSE_TYPE.BLOB,
      webp: ts.XHR_RESPONSE_TYPE.BLOB,
      tga: ts.XHR_RESPONSE_TYPE.BLOB,
      json: ts.XHR_RESPONSE_TYPE.JSON,
      text: ts.XHR_RESPONSE_TYPE.TEXT,
      txt: ts.XHR_RESPONSE_TYPE.TEXT,
      ttf: ts.XHR_RESPONSE_TYPE.BUFFER,
      otf: ts.XHR_RESPONSE_TYPE.BUFFER,
    }),
    (ts.EMPTY_GIF =
      "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
  var ds = function (t, e) {
      (this.data = t), (this.callback = e);
    },
    fs = (function () {
      function t(t, e) {
        var r = this;
        if (
          (void 0 === e && (e = 1),
          (this.workers = 0),
          (this.saturated = ls),
          (this.unsaturated = ls),
          (this.empty = ls),
          (this.drain = ls),
          (this.error = ls),
          (this.started = !1),
          (this.paused = !1),
          (this._tasks = []),
          (this._insert = function (t, e, i) {
            if (i && "function" != typeof i)
              throw new Error("task callback must be a function");
            if (((r.started = !0), null == t && r.idle()))
              setTimeout(function () {
                return r.drain();
              }, 1);
            else {
              var n = new ds(t, "function" == typeof i ? i : ls);
              e ? r._tasks.unshift(n) : r._tasks.push(n),
                setTimeout(r.process, 1);
            }
          }),
          (this.process = function () {
            for (
              ;
              !r.paused && r.workers < r.concurrency && r._tasks.length;

            ) {
              var t = r._tasks.shift();
              0 === r._tasks.length && r.empty(),
                (r.workers += 1),
                r.workers === r.concurrency && r.saturated(),
                r._worker(t.data, cs(r._next(t)));
            }
          }),
          (this._worker = t),
          0 === e)
        )
          throw new Error("Concurrency must not be zero");
        (this.concurrency = e), (this.buffer = e / 4);
      }
      return (
        (t.prototype._next = function (t) {
          var e = this;
          return function () {
            for (var r = arguments, i = [], n = 0; n < arguments.length; n++)
              i[n] = r[n];
            (e.workers -= 1),
              t.callback.apply(t, i),
              null != i[0] && e.error(i[0], t.data),
              e.workers <= e.concurrency - e.buffer && e.unsaturated(),
              e.idle() && e.drain(),
              e.process();
          };
        }),
        (t.prototype.push = function (t, e) {
          this._insert(t, !1, e);
        }),
        (t.prototype.kill = function () {
          (this.workers = 0),
            (this.drain = ls),
            (this.started = !1),
            (this._tasks = []);
        }),
        (t.prototype.unshift = function (t, e) {
          this._insert(t, !0, e);
        }),
        (t.prototype.length = function () {
          return this._tasks.length;
        }),
        (t.prototype.running = function () {
          return this.workers;
        }),
        (t.prototype.idle = function () {
          return this._tasks.length + this.workers === 0;
        }),
        (t.prototype.pause = function () {
          !0 !== this.paused && (this.paused = !0);
        }),
        (t.prototype.resume = function () {
          if (!1 !== this.paused) {
            this.paused = !1;
            for (var t = 1; t <= this.concurrency; t++) this.process();
          }
        }),
        (t.eachSeries = function (t, e, r, i) {
          var n = 0,
            o = t.length;
          !(function s(a) {
            a || n === o
              ? r && r(a)
              : i
              ? setTimeout(function () {
                  e(t[n++], s);
                }, 1)
              : e(t[n++], s);
          })();
        }),
        (t.queue = function (e, r) {
          return new t(e, r);
        }),
        t
      );
    })(),
    ps = /(#[\w-]+)?$/,
    _s = (function () {
      function e(t, r) {
        var i = this;
        void 0 === t && (t = ""),
          void 0 === r && (r = 10),
          (this.progress = 0),
          (this.loading = !1),
          (this.defaultQueryString = ""),
          (this._beforeMiddleware = []),
          (this._afterMiddleware = []),
          (this._resourcesParsing = []),
          (this._boundLoadResource = function (t, e) {
            return i._loadResource(t, e);
          }),
          (this.resources = {}),
          (this.baseUrl = t),
          (this._beforeMiddleware = []),
          (this._afterMiddleware = []),
          (this._resourcesParsing = []),
          (this._boundLoadResource = function (t, e) {
            return i._loadResource(t, e);
          }),
          (this._queue = fs.queue(this._boundLoadResource, r)),
          this._queue.pause(),
          (this.resources = {}),
          (this.onProgress = new Jo()),
          (this.onError = new Jo()),
          (this.onLoad = new Jo()),
          (this.onStart = new Jo()),
          (this.onComplete = new Jo());
        for (var n = 0; n < e._plugins.length; ++n) {
          var o = e._plugins[n],
            s = o.pre,
            a = o.use;
          s && this.pre(s), a && this.use(a);
        }
        this._protected = !1;
      }
      return (
        (e.prototype._add = function (e, r, i, n) {
          if (this.loading && (!i || !i.parentResource))
            throw new Error(
              "Cannot add resources while the loader is running."
            );
          if (this.resources[e])
            throw new Error('Resource named "' + e + '" already exists.');
          if (
            ((r = this._prepareUrl(r)),
            (this.resources[e] = new t.LoaderResource(e, r, i)),
            "function" == typeof n &&
              this.resources[e].onAfterMiddleware.once(n),
            this.loading)
          ) {
            for (
              var o = i.parentResource, s = [], a = 0;
              a < o.children.length;
              ++a
            )
              o.children[a].isComplete || s.push(o.children[a]);
            var h = (o.progressChunk * (s.length + 1)) / (s.length + 2);
            o.children.push(this.resources[e]), (o.progressChunk = h);
            for (a = 0; a < s.length; ++a) s[a].progressChunk = h;
            this.resources[e].progressChunk = h;
          }
          return this._queue.push(this.resources[e]), this;
        }),
        (e.prototype.pre = function (t) {
          return this._beforeMiddleware.push(t), this;
        }),
        (e.prototype.use = function (t) {
          return this._afterMiddleware.push(t), this;
        }),
        (e.prototype.reset = function () {
          for (var t in ((this.progress = 0),
          (this.loading = !1),
          this._queue.kill(),
          this._queue.pause(),
          this.resources)) {
            var e = this.resources[t];
            e._onLoadBinding && e._onLoadBinding.detach(),
              e.isLoading && e.abort("loader reset");
          }
          return (this.resources = {}), this;
        }),
        (e.prototype.load = function (t) {
          if (("function" == typeof t && this.onComplete.once(t), this.loading))
            return this;
          if (this._queue.idle()) this._onStart(), this._onComplete();
          else {
            for (
              var e = 100 / this._queue._tasks.length, r = 0;
              r < this._queue._tasks.length;
              ++r
            )
              this._queue._tasks[r].data.progressChunk = e;
            this._onStart(), this._queue.resume();
          }
          return this;
        }),
        Object.defineProperty(e.prototype, "concurrency", {
          get: function () {
            return this._queue.concurrency;
          },
          set: function (t) {
            this._queue.concurrency = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype._prepareUrl = function (t) {
          var e,
            r = $o(t, { strictMode: !0 });
          if (
            ((e =
              r.protocol || !r.path || 0 === t.indexOf("//")
                ? t
                : this.baseUrl.length &&
                  this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 &&
                  "/" !== t.charAt(0)
                ? this.baseUrl + "/" + t
                : this.baseUrl + t),
            this.defaultQueryString)
          ) {
            var i = ps.exec(e)[0];
            -1 !== (e = e.slice(0, e.length - i.length)).indexOf("?")
              ? (e += "&" + this.defaultQueryString)
              : (e += "?" + this.defaultQueryString),
              (e += i);
          }
          return e;
        }),
        (e.prototype._loadResource = function (t, e) {
          var r = this;
          (t._dequeue = e),
            fs.eachSeries(
              this._beforeMiddleware,
              function (e, i) {
                e.call(r, t, function () {
                  i(t.isComplete ? {} : null);
                });
              },
              function () {
                t.isComplete
                  ? r._onLoad(t)
                  : ((t._onLoadBinding = t.onComplete.once(r._onLoad, r)),
                    t.load());
              },
              !0
            );
        }),
        (e.prototype._onStart = function () {
          (this.progress = 0), (this.loading = !0), this.onStart.dispatch(this);
        }),
        (e.prototype._onComplete = function () {
          (this.progress = 100),
            (this.loading = !1),
            this.onComplete.dispatch(this, this.resources);
        }),
        (e.prototype._onLoad = function (t) {
          var e = this;
          (t._onLoadBinding = null),
            this._resourcesParsing.push(t),
            t._dequeue(),
            fs.eachSeries(
              this._afterMiddleware,
              function (r, i) {
                r.call(e, t, i);
              },
              function () {
                t.onAfterMiddleware.dispatch(t),
                  (e.progress = Math.min(100, e.progress + t.progressChunk)),
                  e.onProgress.dispatch(e, t),
                  t.error
                    ? e.onError.dispatch(t.error, e, t)
                    : e.onLoad.dispatch(e, t),
                  e._resourcesParsing.splice(e._resourcesParsing.indexOf(t), 1),
                  e._queue.idle() &&
                    0 === e._resourcesParsing.length &&
                    e._onComplete();
              },
              !0
            );
        }),
        (e.prototype.destroy = function () {
          this._protected || this.reset();
        }),
        Object.defineProperty(e, "shared", {
          get: function () {
            var t = e._shared;
            return t || (((t = new e())._protected = !0), (e._shared = t)), t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.registerPlugin = function (t) {
          return e._plugins.push(t), t.add && t.add(), e;
        }),
        (e._plugins = []),
        e
      );
    })();
  _s.prototype.add = function (t, e, r, i) {
    if (Array.isArray(t)) {
      for (var n = 0; n < t.length; ++n) this.add(t[n]);
      return this;
    }
    if (
      ("object" == typeof t &&
        ((r = t),
        (i = e || r.callback || r.onComplete),
        (e = r.url),
        (t = r.name || r.key || r.url)),
      "string" != typeof e && ((i = r), (r = e), (e = t)),
      "string" != typeof e)
    )
      throw new Error("No url passed to add resource to loader.");
    return (
      "function" == typeof r && ((i = r), (r = null)), this._add(t, e, r, i)
    );
  };
  var vs = (function () {
      function t() {}
      return (
        (t.init = function (t) {
          (t = Object.assign({ sharedLoader: !1 }, t)),
            (this.loader = t.sharedLoader ? _s.shared : new _s());
        }),
        (t.destroy = function () {
          this.loader && (this.loader.destroy(), (this.loader = null));
        }),
        t
      );
    })(),
    ms = (function () {
      function e() {}
      return (
        (e.add = function () {
          t.LoaderResource.setExtensionLoadType(
            "svg",
            t.LoaderResource.LOAD_TYPE.XHR
          ),
            t.LoaderResource.setExtensionXhrType(
              "svg",
              t.LoaderResource.XHR_RESPONSE_TYPE.TEXT
            );
        }),
        (e.use = function (e, r) {
          if (
            !e.data ||
            (e.type !== t.LoaderResource.TYPE.IMAGE && "svg" !== e.extension)
          )
            r();
          else {
            var i = e.data,
              n = e.url,
              o = e.name,
              s = e.metadata;
            Hi.fromLoader(i, n, o, s)
              .then(function (t) {
                (e.texture = t), r();
              })
              .catch(r);
          }
        }),
        e
      );
    })();
  var Es,
    Ts,
    ys = self.URL || self.webkitURL;
  _s.registerPlugin({
    use: function (e, r) {
      if (e.data) {
        if (e.xhr && e.xhrType === t.LoaderResource.XHR_RESPONSE_TYPE.BLOB)
          if (self.Blob && "string" != typeof e.data) {
            if (0 === e.data.type.indexOf("image")) {
              var i = ys.createObjectURL(e.data);
              return (
                (e.blob = e.data),
                (e.data = new Image()),
                (e.data.src = i),
                (e.type = t.LoaderResource.TYPE.IMAGE),
                void (e.data.onload = function () {
                  ys.revokeObjectURL(i), (e.data.onload = null), r();
                })
              );
            }
          } else {
            var n = e.xhr.getResponseHeader("content-type");
            if (n && 0 === n.indexOf("image"))
              return (
                (e.data = new Image()),
                (e.data.src =
                  "data:" +
                  n +
                  ";base64," +
                  (function (t) {
                    for (var e = "", r = 0; r < t.length; ) {
                      for (
                        var i = [0, 0, 0], n = [0, 0, 0, 0], o = 0;
                        o < i.length;
                        ++o
                      )
                        r < t.length
                          ? (i[o] = 255 & t.charCodeAt(r++))
                          : (i[o] = 0);
                      switch (
                        ((n[0] = i[0] >> 2),
                        (n[1] = ((3 & i[0]) << 4) | (i[1] >> 4)),
                        (n[2] = ((15 & i[1]) << 2) | (i[2] >> 6)),
                        (n[3] = 63 & i[2]),
                        r - (t.length - 1))
                      ) {
                        case 2:
                          (n[3] = 64), (n[2] = 64);
                          break;
                        case 1:
                          n[3] = 64;
                      }
                      for (o = 0; o < n.length; ++o)
                        e +=
                          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
                            n[o]
                          );
                    }
                    return e;
                  })(e.xhr.responseText)),
                (e.type = t.LoaderResource.TYPE.IMAGE),
                void (e.data.onload = function () {
                  (e.data.onload = null), r();
                })
              );
          }
        r();
      } else r();
    },
  }),
    _s.registerPlugin(ms),
    ((Ts = t.INTERNAL_FORMATS || (t.INTERNAL_FORMATS = {}))[
      (Ts.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776)
    ] = "COMPRESSED_RGB_S3TC_DXT1_EXT"),
    (Ts[(Ts.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777)] =
      "COMPRESSED_RGBA_S3TC_DXT1_EXT"),
    (Ts[(Ts.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778)] =
      "COMPRESSED_RGBA_S3TC_DXT3_EXT"),
    (Ts[(Ts.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779)] =
      "COMPRESSED_RGBA_S3TC_DXT5_EXT"),
    (Ts[(Ts.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917)] =
      "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"),
    (Ts[(Ts.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918)] =
      "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"),
    (Ts[(Ts.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919)] =
      "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"),
    (Ts[(Ts.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916)] =
      "COMPRESSED_SRGB_S3TC_DXT1_EXT"),
    (Ts[(Ts.COMPRESSED_R11_EAC = 37488)] = "COMPRESSED_R11_EAC"),
    (Ts[(Ts.COMPRESSED_SIGNED_R11_EAC = 37489)] = "COMPRESSED_SIGNED_R11_EAC"),
    (Ts[(Ts.COMPRESSED_RG11_EAC = 37490)] = "COMPRESSED_RG11_EAC"),
    (Ts[(Ts.COMPRESSED_SIGNED_RG11_EAC = 37491)] =
      "COMPRESSED_SIGNED_RG11_EAC"),
    (Ts[(Ts.COMPRESSED_RGB8_ETC2 = 37492)] = "COMPRESSED_RGB8_ETC2"),
    (Ts[(Ts.COMPRESSED_RGBA8_ETC2_EAC = 37496)] = "COMPRESSED_RGBA8_ETC2_EAC"),
    (Ts[(Ts.COMPRESSED_SRGB8_ETC2 = 37493)] = "COMPRESSED_SRGB8_ETC2"),
    (Ts[(Ts.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497)] =
      "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"),
    (Ts[(Ts.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494)] =
      "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2"),
    (Ts[(Ts.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495)] =
      "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"),
    (Ts[(Ts.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840)] =
      "COMPRESSED_RGB_PVRTC_4BPPV1_IMG"),
    (Ts[(Ts.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842)] =
      "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"),
    (Ts[(Ts.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841)] =
      "COMPRESSED_RGB_PVRTC_2BPPV1_IMG"),
    (Ts[(Ts.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843)] =
      "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"),
    (Ts[(Ts.COMPRESSED_RGB_ETC1_WEBGL = 36196)] = "COMPRESSED_RGB_ETC1_WEBGL"),
    (Ts[(Ts.COMPRESSED_RGB_ATC_WEBGL = 35986)] = "COMPRESSED_RGB_ATC_WEBGL"),
    (Ts[(Ts.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986)] =
      "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL"),
    (Ts[(Ts.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798)] =
      "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL");
  var gs =
      (((Es = {})[t.INTERNAL_FORMATS.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_R11_EAC] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SIGNED_R11_EAC] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RG11_EAC] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SIGNED_RG11_EAC] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGB8_ETC2] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA8_ETC2_EAC] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB8_ETC2] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGB_ETC1_WEBGL] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGB_ATC_WEBGL] = 0.5),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1),
      (Es[t.INTERNAL_FORMATS.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1),
      Es),
    bs = function (t, e) {
      return (
        (bs =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        bs(t, e)
      );
    };
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */ function Rs(
    t,
    e
  ) {
    function r() {
      this.constructor = t;
    }
    bs(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  function As(t, e) {
    var r,
      i,
      n,
      o,
      s = {
        label: 0,
        sent: function () {
          if (1 & n[0]) throw n[1];
          return n[1];
        },
        trys: [],
        ops: [],
      };
    return (
      (o = { next: a(0), throw: a(1), return: a(2) }),
      "function" == typeof Symbol &&
        (o[Symbol.iterator] = function () {
          return this;
        }),
      o
    );
    function a(o) {
      return function (a) {
        return (function (o) {
          if (r) throw new TypeError("Generator is already executing.");
          for (; s; )
            try {
              if (
                ((r = 1),
                i &&
                  (n =
                    2 & o[0]
                      ? i.return
                      : o[0]
                      ? i.throw || ((n = i.return) && n.call(i), 0)
                      : i.next) &&
                  !(n = n.call(i, o[1])).done)
              )
                return n;
              switch (((i = 0), n && (o = [2 & o[0], n.value]), o[0])) {
                case 0:
                case 1:
                  n = o;
                  break;
                case 4:
                  return s.label++, { value: o[1], done: !1 };
                case 5:
                  s.label++, (i = o[1]), (o = [0]);
                  continue;
                case 7:
                  (o = s.ops.pop()), s.trys.pop();
                  continue;
                default:
                  if (
                    !((n = s.trys),
                    (n = n.length > 0 && n[n.length - 1]) ||
                      (6 !== o[0] && 2 !== o[0]))
                  ) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!n || (o[1] > n[0] && o[1] < n[3]))) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < n[1]) {
                    (s.label = n[1]), (n = o);
                    break;
                  }
                  if (n && s.label < n[2]) {
                    (s.label = n[2]), s.ops.push(o);
                    break;
                  }
                  n[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = e.call(t, s);
            } catch (t) {
              (o = [6, t]), (i = 0);
            } finally {
              r = n = 0;
            }
          if (5 & o[0]) throw o[1];
          return { value: o[0] ? o[1] : void 0, done: !0 };
        })([o, a]);
      };
    }
  }
  var xs,
    Ss,
    Os = (function (t) {
      function e(e, r) {
        void 0 === r && (r = { width: 1, height: 1, autoLoad: !0 });
        var i,
          n,
          o = this;
        return (
          "string" == typeof e
            ? ((i = e), (n = new Uint8Array()))
            : ((i = null), (n = e)),
          ((o = t.call(this, n, r) || this).origin = i),
          (o.buffer = n ? new Co(n) : null),
          o.origin && !1 !== r.autoLoad && o.load(),
          n &&
            n.length &&
            ((o.loaded = !0), o.onBlobLoaded(o.buffer.rawBinaryData)),
          o
        );
      }
      return (
        Rs(e, t),
        (e.prototype.onBlobLoaded = function (t) {}),
        (e.prototype.load = function () {
          return (
            (t = this),
            (e = void 0),
            (i = function () {
              var t;
              return As(this, function (e) {
                switch (e.label) {
                  case 0:
                    return [4, fetch(this.origin)];
                  case 1:
                    return [4, e.sent().blob()];
                  case 2:
                    return [4, e.sent().arrayBuffer()];
                  case 3:
                    return (
                      (t = e.sent()),
                      (this.data = new Uint32Array(t)),
                      (this.buffer = new Co(t)),
                      (this.loaded = !0),
                      this.onBlobLoaded(t),
                      this.update(),
                      [2, this]
                    );
                }
              });
            }),
            new ((r = Promise) || (r = Promise))(function (n, o) {
              function s(t) {
                try {
                  h(i.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                try {
                  h(i.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function h(t) {
                t.done
                  ? n(t.value)
                  : new r(function (e) {
                      e(t.value);
                    }).then(s, a);
              }
              h((i = i.apply(t, e || [])).next());
            })
          );
          var t, e, r, i;
        }),
        e
      );
    })(Ai),
    Is = (function (t) {
      function e(r, i) {
        var n = t.call(this, r, i) || this;
        return (
          (n.format = i.format),
          (n.levels = i.levels || 1),
          (n._width = i.width),
          (n._height = i.height),
          (n._extension = e._formatToExtension(n.format)),
          (i.levelBuffers || n.buffer) &&
            (n._levelBuffers =
              i.levelBuffers ||
              e._createLevelBuffers(
                r instanceof Uint8Array ? r : n.buffer.uint8View,
                n.format,
                n.levels,
                4,
                4,
                n.width,
                n.height
              )),
          n
        );
      }
      return (
        Rs(e, t),
        (e.prototype.upload = function (t, e, r) {
          var i = t.gl;
          if (!t.context.extensions[this._extension])
            throw new Error(
              this._extension +
                " textures are not supported on the current machine"
            );
          if (!this._levelBuffers) return !1;
          for (var n = 0, o = this.levels; n < o; n++) {
            var s = this._levelBuffers[n],
              a = s.levelID,
              h = s.levelWidth,
              u = s.levelHeight,
              l = s.levelBuffer;
            i.compressedTexImage2D(i.TEXTURE_2D, a, this.format, h, u, 0, l);
          }
          return !0;
        }),
        (e.prototype.onBlobLoaded = function () {
          this._levelBuffers = e._createLevelBuffers(
            this.buffer.uint8View,
            this.format,
            this.levels,
            4,
            4,
            this.width,
            this.height
          );
        }),
        (e._formatToExtension = function (t) {
          if (t >= 33776 && t <= 33779) return "s3tc";
          if (t >= 37488 && t <= 37497) return "etc";
          if (t >= 35840 && t <= 35843) return "pvrtc";
          if (t >= 36196) return "etc1";
          if (t >= 35986 && t <= 34798) return "atc";
          throw new Error("Invalid (compressed) texture format given!");
        }),
        (e._createLevelBuffers = function (t, e, r, i, n, o, s) {
          for (
            var a = new Array(r),
              h = t.byteOffset,
              u = o,
              l = s,
              c = (u + i - 1) & ~(i - 1),
              d = (l + n - 1) & ~(n - 1),
              f = c * d * gs[e],
              p = 0;
            p < r;
            p++
          )
            (a[p] = {
              levelID: p,
              levelWidth: r > 1 ? u : c,
              levelHeight: r > 1 ? l : d,
              levelBuffer: new Uint8Array(t.buffer, h, f),
            }),
              (h += f),
              (f =
                (c = ((u = u >> 1 || 1) + i - 1) & ~(i - 1)) *
                (d = ((l = l >> 1 || 1) + n - 1) & ~(n - 1)) *
                gs[e]);
          return a;
        }),
        e
      );
    })(Os),
    Ps = (function () {
      function e() {}
      return (
        (e.use = function (r, i) {
          var n = r.data;
          if (
            r.type === t.LoaderResource.TYPE.JSON &&
            n &&
            n.cacheID &&
            n.textures
          ) {
            for (
              var o = n.textures, s = void 0, a = void 0, h = 0, u = o.length;
              h < u;
              h++
            ) {
              var l = o[h],
                c = l.src,
                d = l.format;
              if ((d || (a = c), e.textureFormats[d])) {
                s = c;
                break;
              }
            }
            if (!(s = s || a))
              return void i(
                new Error(
                  "Cannot load compressed-textures in " +
                    r.url +
                    ", make sure you provide a fallback"
                )
              );
            if (s === r.url)
              return void i(
                new Error(
                  "URL of compressed texture cannot be the same as the manifest's URL"
                )
              );
            var f = {
                crossOrigin: r.crossOrigin,
                metadata: r.metadata.imageMetadata,
                parentResource: r,
              },
              p = Oe.resolve(r.url.replace(this.baseUrl, ""), s),
              _ = n.cacheID;
            this.add(_, p, f, function (t) {
              if (t.error) i(t.error);
              else {
                var e = t.texture,
                  n = void 0 === e ? null : e,
                  o = t.textures,
                  s = void 0 === o ? {} : o;
                Object.assign(r, { texture: n, textures: s }), i();
              }
            });
          } else i();
        }),
        (e.add = function () {
          var t = document.createElement("canvas").getContext("webgl");
          if (t) {
            var r = {
              s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
              s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
              etc: t.getExtension("WEBGL_compressed_texture_etc"),
              etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
              pvrtc:
                t.getExtension("WEBGL_compressed_texture_pvrtc") ||
                t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
              atc: t.getExtension("WEBGL_compressed_texture_atc"),
              astc: t.getExtension("WEBGL_compressed_texture_astc"),
            };
            for (var i in ((e.textureExtensions = r),
            (e.textureFormats = {}),
            r)) {
              var n = r[i];
              n && Object.assign(e.textureFormats, Object.getPrototypeOf(n));
            }
          } else
            console.warn(
              "WebGL not available for compressed textures. Silently failing."
            );
        }),
        e
      );
    })();
  function Ms(e, r, i) {
    var n = { textures: {}, texture: null };
    return r
      ? (r
          .map(function (e) {
            return new Hi(
              new Si(
                e,
                Object.assign(
                  {
                    mipmap: t.MIPMAP_MODES.OFF,
                    alphaMode: t.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
                  },
                  i
                )
              )
            );
          })
          .forEach(function (t, r) {
            var i = t.baseTexture,
              o = e + "-" + (r + 1);
            Si.addToCache(i, o),
              Hi.addToCache(t, o),
              0 === r &&
                (Si.addToCache(i, e), Hi.addToCache(t, e), (n.texture = t)),
              (n.textures[o] = t);
          }),
        n)
      : n;
  }
  t.LoaderResource.setExtensionXhrType(
    "dds",
    t.LoaderResource.XHR_RESPONSE_TYPE.BUFFER
  );
  var Ns,
    Ds,
    Cs,
    ws,
    Ls = 124,
    Fs = 3,
    Us = 4,
    Bs = 7,
    Gs = 19,
    Xs = 2,
    ks = 0,
    Hs = 1,
    Ys = 2,
    js = 3;
  ((Ds = Ns || (Ns = {}))[(Ds.DXGI_FORMAT_UNKNOWN = 0)] =
    "DXGI_FORMAT_UNKNOWN"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1)] =
      "DXGI_FORMAT_R32G32B32A32_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32A32_FLOAT = 2)] =
      "DXGI_FORMAT_R32G32B32A32_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32A32_UINT = 3)] =
      "DXGI_FORMAT_R32G32B32A32_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32A32_SINT = 4)] =
      "DXGI_FORMAT_R32G32B32A32_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32_TYPELESS = 5)] =
      "DXGI_FORMAT_R32G32B32_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32_FLOAT = 6)] = "DXGI_FORMAT_R32G32B32_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32_UINT = 7)] = "DXGI_FORMAT_R32G32B32_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32B32_SINT = 8)] = "DXGI_FORMAT_R32G32B32_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9)] =
      "DXGI_FORMAT_R16G16B16A16_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R16G16B16A16_FLOAT = 10)] =
      "DXGI_FORMAT_R16G16B16A16_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R16G16B16A16_UNORM = 11)] =
      "DXGI_FORMAT_R16G16B16A16_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16G16B16A16_UINT = 12)] =
      "DXGI_FORMAT_R16G16B16A16_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R16G16B16A16_SNORM = 13)] =
      "DXGI_FORMAT_R16G16B16A16_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16G16B16A16_SINT = 14)] =
      "DXGI_FORMAT_R16G16B16A16_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32_TYPELESS = 15)] = "DXGI_FORMAT_R32G32_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R32G32_FLOAT = 16)] = "DXGI_FORMAT_R32G32_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32_UINT = 17)] = "DXGI_FORMAT_R32G32_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R32G32_SINT = 18)] = "DXGI_FORMAT_R32G32_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R32G8X24_TYPELESS = 19)] =
      "DXGI_FORMAT_R32G8X24_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20)] =
      "DXGI_FORMAT_D32_FLOAT_S8X24_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21)] =
      "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22)] =
      "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23)] =
      "DXGI_FORMAT_R10G10B10A2_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R10G10B10A2_UNORM = 24)] =
      "DXGI_FORMAT_R10G10B10A2_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R10G10B10A2_UINT = 25)] =
      "DXGI_FORMAT_R10G10B10A2_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R11G11B10_FLOAT = 26)] = "DXGI_FORMAT_R11G11B10_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27)] =
      "DXGI_FORMAT_R8G8B8A8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R8G8B8A8_UNORM = 28)] = "DXGI_FORMAT_R8G8B8A8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29)] =
      "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_R8G8B8A8_UINT = 30)] = "DXGI_FORMAT_R8G8B8A8_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R8G8B8A8_SNORM = 31)] = "DXGI_FORMAT_R8G8B8A8_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_R8G8B8A8_SINT = 32)] = "DXGI_FORMAT_R8G8B8A8_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R16G16_TYPELESS = 33)] = "DXGI_FORMAT_R16G16_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R16G16_FLOAT = 34)] = "DXGI_FORMAT_R16G16_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R16G16_UNORM = 35)] = "DXGI_FORMAT_R16G16_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16G16_UINT = 36)] = "DXGI_FORMAT_R16G16_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R16G16_SNORM = 37)] = "DXGI_FORMAT_R16G16_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16G16_SINT = 38)] = "DXGI_FORMAT_R16G16_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R32_TYPELESS = 39)] = "DXGI_FORMAT_R32_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_D32_FLOAT = 40)] = "DXGI_FORMAT_D32_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R32_FLOAT = 41)] = "DXGI_FORMAT_R32_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_R32_UINT = 42)] = "DXGI_FORMAT_R32_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R32_SINT = 43)] = "DXGI_FORMAT_R32_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R24G8_TYPELESS = 44)] = "DXGI_FORMAT_R24G8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_D24_UNORM_S8_UINT = 45)] =
      "DXGI_FORMAT_D24_UNORM_S8_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46)] =
      "DXGI_FORMAT_R24_UNORM_X8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47)] =
      "DXGI_FORMAT_X24_TYPELESS_G8_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R8G8_TYPELESS = 48)] = "DXGI_FORMAT_R8G8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R8G8_UNORM = 49)] = "DXGI_FORMAT_R8G8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R8G8_UINT = 50)] = "DXGI_FORMAT_R8G8_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R8G8_SNORM = 51)] = "DXGI_FORMAT_R8G8_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_R8G8_SINT = 52)] = "DXGI_FORMAT_R8G8_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R16_TYPELESS = 53)] = "DXGI_FORMAT_R16_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R16_FLOAT = 54)] = "DXGI_FORMAT_R16_FLOAT"),
    (Ds[(Ds.DXGI_FORMAT_D16_UNORM = 55)] = "DXGI_FORMAT_D16_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16_UNORM = 56)] = "DXGI_FORMAT_R16_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16_UINT = 57)] = "DXGI_FORMAT_R16_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R16_SNORM = 58)] = "DXGI_FORMAT_R16_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_R16_SINT = 59)] = "DXGI_FORMAT_R16_SINT"),
    (Ds[(Ds.DXGI_FORMAT_R8_TYPELESS = 60)] = "DXGI_FORMAT_R8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_R8_UNORM = 61)] = "DXGI_FORMAT_R8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R8_UINT = 62)] = "DXGI_FORMAT_R8_UINT"),
    (Ds[(Ds.DXGI_FORMAT_R8_SNORM = 63)] = "DXGI_FORMAT_R8_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_R8_SINT = 64)] = "DXGI_FORMAT_R8_SINT"),
    (Ds[(Ds.DXGI_FORMAT_A8_UNORM = 65)] = "DXGI_FORMAT_A8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R1_UNORM = 66)] = "DXGI_FORMAT_R1_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67)] =
      "DXGI_FORMAT_R9G9B9E5_SHAREDEXP"),
    (Ds[(Ds.DXGI_FORMAT_R8G8_B8G8_UNORM = 68)] = "DXGI_FORMAT_R8G8_B8G8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_G8R8_G8B8_UNORM = 69)] = "DXGI_FORMAT_G8R8_G8B8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC1_TYPELESS = 70)] = "DXGI_FORMAT_BC1_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC1_UNORM = 71)] = "DXGI_FORMAT_BC1_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC1_UNORM_SRGB = 72)] = "DXGI_FORMAT_BC1_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_BC2_TYPELESS = 73)] = "DXGI_FORMAT_BC2_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC2_UNORM = 74)] = "DXGI_FORMAT_BC2_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC2_UNORM_SRGB = 75)] = "DXGI_FORMAT_BC2_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_BC3_TYPELESS = 76)] = "DXGI_FORMAT_BC3_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC3_UNORM = 77)] = "DXGI_FORMAT_BC3_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC3_UNORM_SRGB = 78)] = "DXGI_FORMAT_BC3_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_BC4_TYPELESS = 79)] = "DXGI_FORMAT_BC4_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC4_UNORM = 80)] = "DXGI_FORMAT_BC4_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC4_SNORM = 81)] = "DXGI_FORMAT_BC4_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC5_TYPELESS = 82)] = "DXGI_FORMAT_BC5_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC5_UNORM = 83)] = "DXGI_FORMAT_BC5_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC5_SNORM = 84)] = "DXGI_FORMAT_BC5_SNORM"),
    (Ds[(Ds.DXGI_FORMAT_B5G6R5_UNORM = 85)] = "DXGI_FORMAT_B5G6R5_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_B5G5R5A1_UNORM = 86)] = "DXGI_FORMAT_B5G5R5A1_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_B8G8R8A8_UNORM = 87)] = "DXGI_FORMAT_B8G8R8A8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_B8G8R8X8_UNORM = 88)] = "DXGI_FORMAT_B8G8R8X8_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89)] =
      "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90)] =
      "DXGI_FORMAT_B8G8R8A8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91)] =
      "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92)] =
      "DXGI_FORMAT_B8G8R8X8_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93)] =
      "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_BC6H_TYPELESS = 94)] = "DXGI_FORMAT_BC6H_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC6H_UF16 = 95)] = "DXGI_FORMAT_BC6H_UF16"),
    (Ds[(Ds.DXGI_FORMAT_BC6H_SF16 = 96)] = "DXGI_FORMAT_BC6H_SF16"),
    (Ds[(Ds.DXGI_FORMAT_BC7_TYPELESS = 97)] = "DXGI_FORMAT_BC7_TYPELESS"),
    (Ds[(Ds.DXGI_FORMAT_BC7_UNORM = 98)] = "DXGI_FORMAT_BC7_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_BC7_UNORM_SRGB = 99)] = "DXGI_FORMAT_BC7_UNORM_SRGB"),
    (Ds[(Ds.DXGI_FORMAT_AYUV = 100)] = "DXGI_FORMAT_AYUV"),
    (Ds[(Ds.DXGI_FORMAT_Y410 = 101)] = "DXGI_FORMAT_Y410"),
    (Ds[(Ds.DXGI_FORMAT_Y416 = 102)] = "DXGI_FORMAT_Y416"),
    (Ds[(Ds.DXGI_FORMAT_NV12 = 103)] = "DXGI_FORMAT_NV12"),
    (Ds[(Ds.DXGI_FORMAT_P010 = 104)] = "DXGI_FORMAT_P010"),
    (Ds[(Ds.DXGI_FORMAT_P016 = 105)] = "DXGI_FORMAT_P016"),
    (Ds[(Ds.DXGI_FORMAT_420_OPAQUE = 106)] = "DXGI_FORMAT_420_OPAQUE"),
    (Ds[(Ds.DXGI_FORMAT_YUY2 = 107)] = "DXGI_FORMAT_YUY2"),
    (Ds[(Ds.DXGI_FORMAT_Y210 = 108)] = "DXGI_FORMAT_Y210"),
    (Ds[(Ds.DXGI_FORMAT_Y216 = 109)] = "DXGI_FORMAT_Y216"),
    (Ds[(Ds.DXGI_FORMAT_NV11 = 110)] = "DXGI_FORMAT_NV11"),
    (Ds[(Ds.DXGI_FORMAT_AI44 = 111)] = "DXGI_FORMAT_AI44"),
    (Ds[(Ds.DXGI_FORMAT_IA44 = 112)] = "DXGI_FORMAT_IA44"),
    (Ds[(Ds.DXGI_FORMAT_P8 = 113)] = "DXGI_FORMAT_P8"),
    (Ds[(Ds.DXGI_FORMAT_A8P8 = 114)] = "DXGI_FORMAT_A8P8"),
    (Ds[(Ds.DXGI_FORMAT_B4G4R4A4_UNORM = 115)] = "DXGI_FORMAT_B4G4R4A4_UNORM"),
    (Ds[(Ds.DXGI_FORMAT_P208 = 116)] = "DXGI_FORMAT_P208"),
    (Ds[(Ds.DXGI_FORMAT_V208 = 117)] = "DXGI_FORMAT_V208"),
    (Ds[(Ds.DXGI_FORMAT_V408 = 118)] = "DXGI_FORMAT_V408"),
    (Ds[(Ds.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119)] =
      "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE"),
    (Ds[(Ds.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120)] =
      "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE"),
    (Ds[(Ds.DXGI_FORMAT_FORCE_UINT = 121)] = "DXGI_FORMAT_FORCE_UINT"),
    ((ws = Cs || (Cs = {}))[(ws.DDS_DIMENSION_TEXTURE1D = 2)] =
      "DDS_DIMENSION_TEXTURE1D"),
    (ws[(ws.DDS_DIMENSION_TEXTURE2D = 3)] = "DDS_DIMENSION_TEXTURE2D"),
    (ws[(ws.DDS_DIMENSION_TEXTURE3D = 6)] = "DDS_DIMENSION_TEXTURE3D");
  var Vs,
    Ws,
    zs,
    qs =
      (((xs = {})[827611204] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT),
      (xs[861165636] = t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT),
      (xs[894720068] = t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT),
      xs),
    Ks =
      (((Ss = {})[Ns.DXGI_FORMAT_BC1_TYPELESS] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT),
      (Ss[Ns.DXGI_FORMAT_BC1_UNORM] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT),
      (Ss[Ns.DXGI_FORMAT_BC2_TYPELESS] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT),
      (Ss[Ns.DXGI_FORMAT_BC2_UNORM] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT),
      (Ss[Ns.DXGI_FORMAT_BC3_TYPELESS] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT),
      (Ss[Ns.DXGI_FORMAT_BC3_UNORM] =
        t.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT),
      (Ss[Ns.DXGI_FORMAT_BC1_UNORM_SRGB] =
        t.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT),
      (Ss[Ns.DXGI_FORMAT_BC2_UNORM_SRGB] =
        t.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT),
      (Ss[Ns.DXGI_FORMAT_BC3_UNORM_SRGB] =
        t.INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT),
      Ss),
    Zs = (function () {
      function t() {}
      return (
        (t.use = function (e, r) {
          if ("dds" === e.extension && e.data)
            try {
              Object.assign(
                e,
                Ms(e.name || e.url, t.parse(e.data), e.metadata)
              );
            } catch (t) {
              return void r(t);
            }
          r();
        }),
        (t.parse = function (t) {
          var e = new Uint32Array(t);
          if (542327876 !== e[0])
            throw new Error("Invalid DDS file magic word");
          var r = new Uint32Array(t, 0, Ls / Uint32Array.BYTES_PER_ELEMENT),
            i = r[Fs],
            n = r[Us],
            o = r[Bs],
            s = new Uint32Array(
              t,
              Gs * Uint32Array.BYTES_PER_ELEMENT,
              32 / Uint32Array.BYTES_PER_ELEMENT
            ),
            a = s[1];
          if (4 & a) {
            var h = s[Xs];
            if (808540228 !== h) {
              var u = qs[h],
                l = new Uint8Array(t, 128);
              return [new Is(l, { format: u, width: n, height: i, levels: o })];
            }
            var c = new Uint32Array(
                e.buffer,
                128,
                20 / Uint32Array.BYTES_PER_ELEMENT
              ),
              d = c[ks],
              f = c[Hs],
              p = c[Ys],
              _ = c[js],
              v = Ks[d];
            if (void 0 === v)
              throw new Error(
                "DDSLoader cannot parse texture data with DXGI format " + d
              );
            if (4 === p)
              throw new Error("DDSLoader does not support cubemap textures");
            if (f === Cs.DDS_DIMENSION_TEXTURE3D)
              throw new Error("DDSLoader does not supported 3D texture data");
            var m = new Array();
            if (1 === _) m.push(new Uint8Array(t, 148));
            else {
              for (var E = gs[v], T = 0, y = n, g = i, b = 0; b < o; b++) {
                (T +=
                  Math.max(1, (y + 3) & -4) * Math.max(1, (g + 3) & -4) * E),
                  (y >>>= 1),
                  (g >>>= 1);
              }
              var R = 148;
              for (b = 0; b < _; b++) m.push(new Uint8Array(t, R, T)), (R += T);
            }
            return m.map(function (t) {
              return new Is(t, { format: v, width: n, height: i, levels: o });
            });
          }
          if (64 & a)
            throw new Error(
              "DDSLoader does not support uncompressed texture data."
            );
          if (512 & a)
            throw new Error(
              "DDSLoader does not supported YUV uncompressed texture data."
            );
          if (131072 & a)
            throw new Error(
              "DDSLoader does not support single-channel (lumninance) texture data!"
            );
          if (2 & a)
            throw new Error(
              "DDSLoader does not support single-channel (alpha) texture data!"
            );
          throw new Error(
            "DDSLoader failed to load a texture file due to an unknown reason!"
          );
        }),
        t
      );
    })();
  t.LoaderResource.setExtensionXhrType(
    "ktx",
    t.LoaderResource.XHR_RESPONSE_TYPE.BUFFER
  );
  var Qs = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10],
    Js = 12,
    $s = 16,
    ta = 24,
    ea = 28,
    ra = 36,
    ia = 40,
    na = 44,
    oa = 48,
    sa = 52,
    aa = 56,
    ha = 60,
    ua =
      (((Vs = {})[t.TYPES.UNSIGNED_BYTE] = 1),
      (Vs[t.TYPES.UNSIGNED_SHORT] = 2),
      (Vs[t.TYPES.INT] = 4),
      (Vs[t.TYPES.UNSIGNED_INT] = 4),
      (Vs[t.TYPES.FLOAT] = 4),
      (Vs[t.TYPES.HALF_FLOAT] = 8),
      Vs),
    la =
      (((Ws = {})[t.FORMATS.RGBA] = 4),
      (Ws[t.FORMATS.RGB] = 3),
      (Ws[t.FORMATS.RG] = 2),
      (Ws[t.FORMATS.RED] = 1),
      (Ws[t.FORMATS.LUMINANCE] = 1),
      (Ws[t.FORMATS.LUMINANCE_ALPHA] = 2),
      (Ws[t.FORMATS.ALPHA] = 1),
      Ws),
    ca =
      (((zs = {})[t.TYPES.UNSIGNED_SHORT_4_4_4_4] = 2),
      (zs[t.TYPES.UNSIGNED_SHORT_5_5_5_1] = 2),
      (zs[t.TYPES.UNSIGNED_SHORT_5_6_5] = 2),
      zs),
    da = (function () {
      function e() {}
      return (
        (e.use = function (r, i) {
          if ("ktx" === r.extension && r.data)
            try {
              var n = r.name || r.url,
                o = e.parse(n, r.data),
                s = o.compressed,
                a = o.uncompressed;
              if (s) Object.assign(r, Ms(n, s, r.metadata));
              else if (a) {
                var h = {};
                a.forEach(function (e, r) {
                  var i = new Hi(
                      new Si(e.resource, {
                        mipmap: t.MIPMAP_MODES.OFF,
                        alphaMode: t.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
                        type: e.type,
                        format: e.format,
                      })
                    ),
                    o = n + "-" + (r + 1);
                  Si.addToCache(i.baseTexture, o),
                    Hi.addToCache(i, o),
                    0 === r &&
                      ((h[n] = i),
                      Si.addToCache(i.baseTexture, n),
                      Hi.addToCache(i, n)),
                    (h[o] = i);
                }),
                  Object.assign(r, { textures: h });
              }
            } catch (t) {
              return void i(t);
            }
          i();
        }),
        (e.parse = function (r, i) {
          var n = new DataView(i);
          if (!e.validate(r, n)) return null;
          var o = 67305985 === n.getUint32(Js, !0),
            s = n.getUint32($s, o),
            a = n.getUint32(ta, o),
            h = n.getUint32(ea, o),
            u = n.getUint32(ra, o),
            l = n.getUint32(ia, o) || 1,
            c = n.getUint32(na, o) || 1,
            d = n.getUint32(oa, o) || 1,
            f = n.getUint32(sa, o),
            p = n.getUint32(aa, o),
            _ = n.getUint32(ha, o);
          if (0 === l || 1 !== c)
            throw new Error("Only 2D textures are supported");
          if (1 !== f)
            throw new Error("CubeTextures are not supported by KTXLoader yet!");
          if (1 !== d) throw new Error("WebGL does not support array textures");
          var v,
            m = (u + 3) & -4,
            E = (l + 3) & -4,
            T = new Array(d),
            y = u * l;
          if (
            (0 === s && (y = m * E),
            void 0 === (v = 0 !== s ? (ua[s] ? ua[s] * la[a] : ca[s]) : gs[h]))
          )
            throw new Error(
              "Unable to resolve the pixel format stored in the *.ktx file!"
            );
          for (
            var g = y * v, b = u, R = l, A = m, x = E, S = 64 + _, O = 0;
            O < p;
            O++
          ) {
            for (var I = n.getUint32(S, o), P = S + 4, M = 0; M < d; M++) {
              var N = T[M];
              N || (N = T[M] = new Array(p)),
                (N[O] = {
                  levelID: O,
                  levelWidth: p > 1 || 0 !== s ? b : A,
                  levelHeight: p > 1 || 0 !== s ? R : x,
                  levelBuffer: new Uint8Array(i, P, g),
                }),
                (P += g);
            }
            (S = (S += I + 4) % 4 != 0 ? S + 4 - (S % 4) : S),
              (g =
                (A = ((b = b >> 1 || 1) + 4 - 1) & -4) *
                (x = ((R = R >> 1 || 1) + 4 - 1) & -4) *
                v);
          }
          return 0 !== s
            ? {
                uncompressed: T.map(function (r) {
                  var i = r[0].levelBuffer,
                    n = !1;
                  return (
                    s === t.TYPES.FLOAT
                      ? (i = new Float32Array(
                          r[0].levelBuffer.buffer,
                          r[0].levelBuffer.byteOffset,
                          r[0].levelBuffer.byteLength / 4
                        ))
                      : s === t.TYPES.UNSIGNED_INT
                      ? ((n = !0),
                        (i = new Uint32Array(
                          r[0].levelBuffer.buffer,
                          r[0].levelBuffer.byteOffset,
                          r[0].levelBuffer.byteLength / 4
                        )))
                      : s === t.TYPES.INT &&
                        ((n = !0),
                        (i = new Int32Array(
                          r[0].levelBuffer.buffer,
                          r[0].levelBuffer.byteOffset,
                          r[0].levelBuffer.byteLength / 4
                        ))),
                    {
                      resource: new Ai(i, {
                        width: r[0].levelWidth,
                        height: r[0].levelHeight,
                      }),
                      type: s,
                      format: n ? e.convertFormatToInteger(a) : a,
                    }
                  );
                }),
              }
            : {
                compressed: T.map(function (t) {
                  return new Is(null, {
                    format: h,
                    width: u,
                    height: l,
                    levels: p,
                    levelBuffers: t,
                  });
                }),
              };
        }),
        (e.validate = function (t, e) {
          for (var r = 0; r < Qs.length; r++)
            if (e.getUint8(r) !== Qs[r])
              return console.error(t + " is not a valid *.ktx file!"), !1;
          return !0;
        }),
        (e.convertFormatToInteger = function (e) {
          switch (e) {
            case t.FORMATS.RGBA:
              return t.FORMATS.RGBA_INTEGER;
            case t.FORMATS.RGB:
              return t.FORMATS.RGB_INTEGER;
            case t.FORMATS.RG:
              return t.FORMATS.RG_INTEGER;
            case t.FORMATS.RED:
              return t.FORMATS.RED_INTEGER;
            default:
              return e;
          }
        }),
        e
      );
    })(),
    fa = function (t, e) {
      return (
        (fa =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        fa(t, e)
      );
    };
  function pa(t, e) {
    function r() {
      this.constructor = t;
    }
    fa(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var _a,
    va,
    ma = (function (e) {
      function r(r, i, n, o) {
        void 0 === r && (r = 1500),
          void 0 === n && (n = 16384),
          void 0 === o && (o = !1);
        var s = e.call(this) || this;
        return (
          n > 16384 && (n = 16384),
          (s._properties = [!1, !0, !1, !1, !1]),
          (s._maxSize = r),
          (s._batchSize = n),
          (s._buffers = null),
          (s._bufferUpdateIDs = []),
          (s._updateID = 0),
          (s.interactiveChildren = !1),
          (s.blendMode = t.BLEND_MODES.NORMAL),
          (s.autoResize = o),
          (s.roundPixels = !0),
          (s.baseTexture = null),
          s.setProperties(i),
          (s._tint = 0),
          (s.tintRgb = new Float32Array(4)),
          (s.tint = 16777215),
          s
        );
      }
      return (
        pa(r, e),
        (r.prototype.setProperties = function (t) {
          t &&
            ((this._properties[0] =
              "vertices" in t || "scale" in t
                ? !!t.vertices || !!t.scale
                : this._properties[0]),
            (this._properties[1] =
              "position" in t ? !!t.position : this._properties[1]),
            (this._properties[2] =
              "rotation" in t ? !!t.rotation : this._properties[2]),
            (this._properties[3] = "uvs" in t ? !!t.uvs : this._properties[3]),
            (this._properties[4] =
              "tint" in t || "alpha" in t
                ? !!t.tint || !!t.alpha
                : this._properties[4]));
        }),
        (r.prototype.updateTransform = function () {
          this.displayObjectUpdateTransform();
        }),
        Object.defineProperty(r.prototype, "tint", {
          get: function () {
            return this._tint;
          },
          set: function (t) {
            (this._tint = t), Ce(t, this.tintRgb);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.render = function (t) {
          var e = this;
          this.visible &&
            !(this.worldAlpha <= 0) &&
            this.children.length &&
            this.renderable &&
            (this.baseTexture ||
              ((this.baseTexture = this.children[0]._texture.baseTexture),
              this.baseTexture.valid ||
                this.baseTexture.once("update", function () {
                  return e.onChildrenChange(0);
                })),
            t.batch.setObjectRenderer(t.plugins.particle),
            t.plugins.particle.render(this));
        }),
        (r.prototype.onChildrenChange = function (t) {
          for (
            var e = Math.floor(t / this._batchSize);
            this._bufferUpdateIDs.length < e;

          )
            this._bufferUpdateIDs.push(0);
          this._bufferUpdateIDs[e] = ++this._updateID;
        }),
        (r.prototype.dispose = function () {
          if (this._buffers) {
            for (var t = 0; t < this._buffers.length; ++t)
              this._buffers[t].destroy();
            this._buffers = null;
          }
        }),
        (r.prototype.destroy = function (t) {
          e.prototype.destroy.call(this, t),
            this.dispose(),
            (this._properties = null),
            (this._buffers = null),
            (this._bufferUpdateIDs = null);
        }),
        r
      );
    })(ri),
    Ea = (function () {
      function e(e, r, i) {
        (this.geometry = new $i()),
          (this.indexBuffer = null),
          (this.size = i),
          (this.dynamicProperties = []),
          (this.staticProperties = []);
        for (var n = 0; n < e.length; ++n) {
          var o = e[n];
          (o = {
            attributeName: o.attributeName,
            size: o.size,
            uploadFunction: o.uploadFunction,
            type: o.type || t.TYPES.FLOAT,
            offset: o.offset,
          }),
            r[n]
              ? this.dynamicProperties.push(o)
              : this.staticProperties.push(o);
        }
        (this.staticStride = 0),
          (this.staticBuffer = null),
          (this.staticData = null),
          (this.staticDataUint32 = null),
          (this.dynamicStride = 0),
          (this.dynamicBuffer = null),
          (this.dynamicData = null),
          (this.dynamicDataUint32 = null),
          (this._updateID = 0),
          this.initBuffers();
      }
      return (
        (e.prototype.initBuffers = function () {
          var e = this.geometry,
            r = 0;
          (this.indexBuffer = new qi(ke(this.size), !0, !0)),
            e.addIndex(this.indexBuffer),
            (this.dynamicStride = 0);
          for (var i = 0; i < this.dynamicProperties.length; ++i) {
            ((a = this.dynamicProperties[i]).offset = r),
              (r += a.size),
              (this.dynamicStride += a.size);
          }
          var n = new ArrayBuffer(this.size * this.dynamicStride * 16);
          (this.dynamicData = new Float32Array(n)),
            (this.dynamicDataUint32 = new Uint32Array(n)),
            (this.dynamicBuffer = new qi(this.dynamicData, !1, !1));
          var o = 0;
          this.staticStride = 0;
          for (i = 0; i < this.staticProperties.length; ++i) {
            ((a = this.staticProperties[i]).offset = o),
              (o += a.size),
              (this.staticStride += a.size);
          }
          var s = new ArrayBuffer(this.size * this.staticStride * 16);
          (this.staticData = new Float32Array(s)),
            (this.staticDataUint32 = new Uint32Array(s)),
            (this.staticBuffer = new qi(this.staticData, !0, !1));
          for (i = 0; i < this.dynamicProperties.length; ++i) {
            var a = this.dynamicProperties[i];
            e.addAttribute(
              a.attributeName,
              this.dynamicBuffer,
              0,
              a.type === t.TYPES.UNSIGNED_BYTE,
              a.type,
              4 * this.dynamicStride,
              4 * a.offset
            );
          }
          for (i = 0; i < this.staticProperties.length; ++i) {
            a = this.staticProperties[i];
            e.addAttribute(
              a.attributeName,
              this.staticBuffer,
              0,
              a.type === t.TYPES.UNSIGNED_BYTE,
              a.type,
              4 * this.staticStride,
              4 * a.offset
            );
          }
        }),
        (e.prototype.uploadDynamic = function (e, r, i) {
          for (var n = 0; n < this.dynamicProperties.length; n++) {
            var o = this.dynamicProperties[n];
            o.uploadFunction(
              e,
              r,
              i,
              o.type === t.TYPES.UNSIGNED_BYTE
                ? this.dynamicDataUint32
                : this.dynamicData,
              this.dynamicStride,
              o.offset
            );
          }
          this.dynamicBuffer._updateID++;
        }),
        (e.prototype.uploadStatic = function (e, r, i) {
          for (var n = 0; n < this.staticProperties.length; n++) {
            var o = this.staticProperties[n];
            o.uploadFunction(
              e,
              r,
              i,
              o.type === t.TYPES.UNSIGNED_BYTE
                ? this.staticDataUint32
                : this.staticData,
              this.staticStride,
              o.offset
            );
          }
          this.staticBuffer._updateID++;
        }),
        (e.prototype.destroy = function () {
          (this.indexBuffer = null),
            (this.dynamicProperties = null),
            (this.dynamicBuffer = null),
            (this.dynamicData = null),
            (this.dynamicDataUint32 = null),
            (this.staticProperties = null),
            (this.staticBuffer = null),
            (this.staticData = null),
            (this.staticDataUint32 = null),
            this.geometry.destroy();
        }),
        e
      );
    })(),
    Ta = (function (e) {
      function r(r) {
        var i = e.call(this, r) || this;
        return (
          (i.shader = null),
          (i.properties = null),
          (i.tempMatrix = new gr()),
          (i.properties = [
            {
              attributeName: "aVertexPosition",
              size: 2,
              uploadFunction: i.uploadVertices,
              offset: 0,
            },
            {
              attributeName: "aPositionCoord",
              size: 2,
              uploadFunction: i.uploadPosition,
              offset: 0,
            },
            {
              attributeName: "aRotation",
              size: 1,
              uploadFunction: i.uploadRotation,
              offset: 0,
            },
            {
              attributeName: "aTextureCoord",
              size: 2,
              uploadFunction: i.uploadUvs,
              offset: 0,
            },
            {
              attributeName: "aColor",
              size: 1,
              type: t.TYPES.UNSIGNED_BYTE,
              uploadFunction: i.uploadTint,
              offset: 0,
            },
          ]),
          (i.shader = Yn.from(
            "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n",
            "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}",
            {}
          )),
          (i.state = jn.for2d()),
          i
        );
      }
      return (
        pa(r, e),
        (r.prototype.render = function (t) {
          var e = t.children,
            r = t._maxSize,
            i = t._batchSize,
            n = this.renderer,
            o = e.length;
          if (0 !== o) {
            o > r && !t.autoResize && (o = r);
            var s = t._buffers;
            s || (s = t._buffers = this.generateBuffers(t));
            var a = e[0]._texture.baseTexture;
            (this.state.blendMode = Ue(t.blendMode, a.alphaMode)),
              n.state.set(this.state);
            var h = n.gl,
              u = t.worldTransform.copyTo(this.tempMatrix);
            u.prepend(n.globalUniforms.uniforms.projectionMatrix),
              (this.shader.uniforms.translationMatrix = u.toArray(!0)),
              (this.shader.uniforms.uColor = Be(
                t.tintRgb,
                t.worldAlpha,
                this.shader.uniforms.uColor,
                a.alphaMode
              )),
              (this.shader.uniforms.uSampler = a),
              this.renderer.shader.bind(this.shader);
            for (var l = !1, c = 0, d = 0; c < o; c += i, d += 1) {
              var f = o - c;
              f > i && (f = i),
                d >= s.length && s.push(this._generateOneMoreBuffer(t));
              var p = s[d];
              p.uploadDynamic(e, c, f);
              var _ = t._bufferUpdateIDs[d] || 0;
              (l = l || p._updateID < _) &&
                ((p._updateID = t._updateID), p.uploadStatic(e, c, f)),
                n.geometry.bind(p.geometry),
                h.drawElements(h.TRIANGLES, 6 * f, h.UNSIGNED_SHORT, 0);
            }
          }
        }),
        (r.prototype.generateBuffers = function (t) {
          for (
            var e = [],
              r = t._maxSize,
              i = t._batchSize,
              n = t._properties,
              o = 0;
            o < r;
            o += i
          )
            e.push(new Ea(this.properties, n, i));
          return e;
        }),
        (r.prototype._generateOneMoreBuffer = function (t) {
          var e = t._batchSize,
            r = t._properties;
          return new Ea(this.properties, r, e);
        }),
        (r.prototype.uploadVertices = function (t, e, r, i, n, o) {
          for (var s = 0, a = 0, h = 0, u = 0, l = 0; l < r; ++l) {
            var c = t[e + l],
              d = c._texture,
              f = c.scale.x,
              p = c.scale.y,
              _ = d.trim,
              v = d.orig;
            _
              ? ((s = (a = _.x - c.anchor.x * v.width) + _.width),
                (h = (u = _.y - c.anchor.y * v.height) + _.height))
              : ((s = v.width * (1 - c.anchor.x)),
                (a = v.width * -c.anchor.x),
                (h = v.height * (1 - c.anchor.y)),
                (u = v.height * -c.anchor.y)),
              (i[o] = a * f),
              (i[o + 1] = u * p),
              (i[o + n] = s * f),
              (i[o + n + 1] = u * p),
              (i[o + 2 * n] = s * f),
              (i[o + 2 * n + 1] = h * p),
              (i[o + 3 * n] = a * f),
              (i[o + 3 * n + 1] = h * p),
              (o += 4 * n);
          }
        }),
        (r.prototype.uploadPosition = function (t, e, r, i, n, o) {
          for (var s = 0; s < r; s++) {
            var a = t[e + s].position;
            (i[o] = a.x),
              (i[o + 1] = a.y),
              (i[o + n] = a.x),
              (i[o + n + 1] = a.y),
              (i[o + 2 * n] = a.x),
              (i[o + 2 * n + 1] = a.y),
              (i[o + 3 * n] = a.x),
              (i[o + 3 * n + 1] = a.y),
              (o += 4 * n);
          }
        }),
        (r.prototype.uploadRotation = function (t, e, r, i, n, o) {
          for (var s = 0; s < r; s++) {
            var a = t[e + s].rotation;
            (i[o] = a),
              (i[o + n] = a),
              (i[o + 2 * n] = a),
              (i[o + 3 * n] = a),
              (o += 4 * n);
          }
        }),
        (r.prototype.uploadUvs = function (t, e, r, i, n, o) {
          for (var s = 0; s < r; ++s) {
            var a = t[e + s]._texture._uvs;
            a
              ? ((i[o] = a.x0),
                (i[o + 1] = a.y0),
                (i[o + n] = a.x1),
                (i[o + n + 1] = a.y1),
                (i[o + 2 * n] = a.x2),
                (i[o + 2 * n + 1] = a.y2),
                (i[o + 3 * n] = a.x3),
                (i[o + 3 * n + 1] = a.y3),
                (o += 4 * n))
              : ((i[o] = 0),
                (i[o + 1] = 0),
                (i[o + n] = 0),
                (i[o + n + 1] = 0),
                (i[o + 2 * n] = 0),
                (i[o + 2 * n + 1] = 0),
                (i[o + 3 * n] = 0),
                (i[o + 3 * n + 1] = 0),
                (o += 4 * n));
          }
        }),
        (r.prototype.uploadTint = function (t, e, r, i, n, o) {
          for (var s = 0; s < r; ++s) {
            var a = t[e + s],
              h = a._texture.baseTexture.alphaMode > 0,
              u = a.alpha,
              l =
                u < 1 && h ? Ge(a._tintRGB, u) : a._tintRGB + ((255 * u) << 24);
            (i[o] = l),
              (i[o + n] = l),
              (i[o + 2 * n] = l),
              (i[o + 3 * n] = l),
              (o += 4 * n);
          }
        }),
        (r.prototype.destroy = function () {
          e.prototype.destroy.call(this),
            this.shader && (this.shader.destroy(), (this.shader = null)),
            (this.tempMatrix = null);
        }),
        r
      );
    })(un);
  (/*!
   * @pixi/graphics - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/graphics is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  (_a = t.LINE_JOIN || (t.LINE_JOIN = {})).MITER = "miter"),
    (_a.BEVEL = "bevel"),
    (_a.ROUND = "round"),
    ((va = t.LINE_CAP || (t.LINE_CAP = {})).BUTT = "butt"),
    (va.ROUND = "round"),
    (va.SQUARE = "square");
  var ya = {
      adaptive: !0,
      maxLength: 10,
      minSegments: 8,
      maxSegments: 2048,
      epsilon: 1e-4,
      _segmentsCount: function (t, e) {
        if ((void 0 === e && (e = 20), !this.adaptive || !t || isNaN(t)))
          return e;
        var r = Math.ceil(t / this.maxLength);
        return (
          r < this.minSegments
            ? (r = this.minSegments)
            : r > this.maxSegments && (r = this.maxSegments),
          r
        );
      },
    },
    ga = (function () {
      function t() {
        (this.color = 16777215),
          (this.alpha = 1),
          (this.texture = Hi.WHITE),
          (this.matrix = null),
          (this.visible = !1),
          this.reset();
      }
      return (
        (t.prototype.clone = function () {
          var e = new t();
          return (
            (e.color = this.color),
            (e.alpha = this.alpha),
            (e.texture = this.texture),
            (e.matrix = this.matrix),
            (e.visible = this.visible),
            e
          );
        }),
        (t.prototype.reset = function () {
          (this.color = 16777215),
            (this.alpha = 1),
            (this.texture = Hi.WHITE),
            (this.matrix = null),
            (this.visible = !1);
        }),
        (t.prototype.destroy = function () {
          (this.texture = null), (this.matrix = null);
        }),
        t
      );
    })(),
    ba = function (t, e) {
      return (
        (ba =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        ba(t, e)
      );
    };
  function Ra(t, e) {
    function r() {
      this.constructor = t;
    }
    ba(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  function Aa(t, e) {
    var r, i;
    void 0 === e && (e = !1);
    var n = t.length;
    if (!(n < 6)) {
      for (var o = 0, s = 0, a = t[n - 2], h = t[n - 1]; s < n; s += 2) {
        var u = t[s],
          l = t[s + 1];
        (o += (u - a) * (l + h)), (a = u), (h = l);
      }
      if ((!e && o > 0) || (e && o <= 0)) {
        var c = n / 2;
        for (s = c + (c % 2); s < n; s += 2) {
          var d = n - s - 2,
            f = n - s - 1,
            p = s,
            _ = s + 1;
          (r = [t[p], t[d]]),
            (t[d] = r[0]),
            (t[p] = r[1]),
            (i = [t[_], t[f]]),
            (t[f] = i[0]),
            (t[_] = i[1]);
        }
      }
    }
  }
  var xa = {
      build: function (t) {
        t.points = t.shape.points.slice();
      },
      triangulate: function (t, e) {
        var r = t.points,
          i = t.holes,
          n = e.points,
          o = e.indices;
        if (r.length >= 6) {
          Aa(r, !1);
          for (var s = [], a = 0; a < i.length; a++) {
            var h = i[a];
            Aa(h.points, !0), s.push(r.length / 2), (r = r.concat(h.points));
          }
          var u = St(r, s, 2);
          if (!u) return;
          var l = n.length / 2;
          for (a = 0; a < u.length; a += 3)
            o.push(u[a] + l), o.push(u[a + 1] + l), o.push(u[a + 2] + l);
          for (a = 0; a < r.length; a++) n.push(r[a]);
        }
      },
    },
    Sa = {
      build: function (e) {
        var r,
          i,
          n,
          o,
          s,
          a,
          h = e.points;
        if (e.type === t.SHAPES.CIRC) {
          var u = e.shape;
          (r = u.x), (i = u.y), (s = a = u.radius), (n = o = 0);
        } else if (e.type === t.SHAPES.ELIP) {
          var l = e.shape;
          (r = l.x), (i = l.y), (s = l.width), (a = l.height), (n = o = 0);
        } else {
          var c = e.shape,
            d = c.width / 2,
            f = c.height / 2;
          (r = c.x + d),
            (i = c.y + f),
            (n = d - (s = a = Math.max(0, Math.min(c.radius, Math.min(d, f))))),
            (o = f - a);
        }
        var p = Math.ceil(2.3 * Math.sqrt(s + a)),
          _ = 8 * p + (n ? 4 : 0) + (o ? 4 : 0);
        if (((h.length = _), 0 !== _)) {
          if (0 === p)
            return (
              (h.length = 8),
              (h[0] = h[6] = r + n),
              (h[1] = h[3] = i + o),
              (h[2] = h[4] = r - n),
              void (h[5] = h[7] = i - o)
            );
          var v = 0,
            m = 4 * p + (n ? 2 : 0) + 2,
            E = m,
            T = _,
            y = r + (S = n + s),
            g = r - S,
            b = i + (O = o);
          if (((h[v++] = y), (h[v++] = b), (h[--m] = b), (h[--m] = g), o)) {
            var R = i - O;
            (h[E++] = g), (h[E++] = R), (h[--T] = R), (h[--T] = y);
          }
          for (var A = 1; A < p; A++) {
            var x = (Math.PI / 2) * (A / p);
            (y = r + (S = n + Math.cos(x) * s)),
              (g = r - S),
              (b = i + (O = o + Math.sin(x) * a)),
              (R = i - O);
            (h[v++] = y),
              (h[v++] = b),
              (h[--m] = b),
              (h[--m] = g),
              (h[E++] = g),
              (h[E++] = R),
              (h[--T] = R),
              (h[--T] = y);
          }
          var S, O;
          (y = r + (S = n)), (g = r - S), (b = i + (O = o + a)), (R = i - O);
          (h[v++] = y),
            (h[v++] = b),
            (h[--T] = R),
            (h[--T] = y),
            n && ((h[v++] = g), (h[v++] = b), (h[--T] = R), (h[--T] = g));
        }
      },
      triangulate: function (e, r) {
        var i,
          n,
          o = e.points,
          s = r.points,
          a = r.indices,
          h = s.length / 2,
          u = h;
        if (e.type !== t.SHAPES.RREC) {
          var l = e.shape;
          (i = l.x), (n = l.y);
        } else {
          var c = e.shape;
          (i = c.x + c.width / 2), (n = c.y + c.height / 2);
        }
        var d = e.matrix;
        s.push(
          e.matrix ? d.a * i + d.c * n + d.tx : i,
          e.matrix ? d.b * i + d.d * n + d.ty : n
        ),
          h++,
          s.push(o[0], o[1]);
        for (var f = 2; f < o.length; f += 2)
          s.push(o[f], o[f + 1]), a.push(h++, u, h);
        a.push(u + 1, u, h);
      },
    },
    Oa = {
      build: function (t) {
        var e = t.shape,
          r = e.x,
          i = e.y,
          n = e.width,
          o = e.height,
          s = t.points;
        (s.length = 0), s.push(r, i, r + n, i, r + n, i + o, r, i + o);
      },
      triangulate: function (t, e) {
        var r = t.points,
          i = e.points,
          n = i.length / 2;
        i.push(r[0], r[1], r[2], r[3], r[6], r[7], r[4], r[5]),
          e.indices.push(n, n + 1, n + 2, n + 1, n + 2, n + 3);
      },
    };
  function Ia(t, e, r) {
    return t + (e - t) * r;
  }
  function Pa(t, e, r, i, n, o, s) {
    void 0 === s && (s = []);
    for (
      var a = s, h = 0, u = 0, l = 0, c = 0, d = 0, f = 0, p = 0, _ = 0;
      p <= 20;
      ++p
    )
      (h = Ia(t, r, (_ = p / 20))),
        (u = Ia(e, i, _)),
        (l = Ia(r, n, _)),
        (c = Ia(i, o, _)),
        (d = Ia(h, l, _)),
        (f = Ia(u, c, _)),
        (0 === p && a[a.length - 2] === d && a[a.length - 1] === f) ||
          a.push(d, f);
    return a;
  }
  var Ma = {
    build: function (t) {
      if (Ka.nextRoundedRectBehavior) Sa.build(t);
      else {
        var e = t.shape,
          r = t.points,
          i = e.x,
          n = e.y,
          o = e.width,
          s = e.height,
          a = Math.max(0, Math.min(e.radius, Math.min(o, s) / 2));
        (r.length = 0),
          a
            ? (Pa(i, n + a, i, n, i + a, n, r),
              Pa(i + o - a, n, i + o, n, i + o, n + a, r),
              Pa(i + o, n + s - a, i + o, n + s, i + o - a, n + s, r),
              Pa(i + a, n + s, i, n + s, i, n + s - a, r))
            : r.push(i, n, i + o, n, i + o, n + s, i, n + s);
      }
    },
    triangulate: function (t, e) {
      if (Ka.nextRoundedRectBehavior) Sa.triangulate(t, e);
      else {
        for (
          var r = t.points,
            i = e.points,
            n = e.indices,
            o = i.length / 2,
            s = St(r, null, 2),
            a = 0,
            h = s.length;
          a < h;
          a += 3
        )
          n.push(s[a] + o), n.push(s[a + 1] + o), n.push(s[a + 2] + o);
        for (a = 0, h = r.length; a < h; a++) i.push(r[a], r[++a]);
      }
    },
  };
  function Na(t, e, r, i, n, o, s, a) {
    var h, u;
    s ? ((h = i), (u = -r)) : ((h = -i), (u = r));
    var l = t - r * n + h,
      c = e - i * n + u,
      d = t + r * o + h,
      f = e + i * o + u;
    return a.push(l, c), a.push(d, f), 2;
  }
  function Da(t, e, r, i, n, o, s, a) {
    var h = r - t,
      u = i - e,
      l = Math.atan2(h, u),
      c = Math.atan2(n - t, o - e);
    a && l < c ? (l += 2 * Math.PI) : !a && l > c && (c += 2 * Math.PI);
    var d = l,
      f = c - l,
      p = Math.abs(f),
      _ = Math.sqrt(h * h + u * u),
      v = 1 + (((15 * p * Math.sqrt(_)) / Math.PI) >> 0),
      m = f / v;
    if (((d += m), a)) {
      s.push(t, e), s.push(r, i);
      for (var E = 1, T = d; E < v; E++, T += m)
        s.push(t, e), s.push(t + Math.sin(T) * _, e + Math.cos(T) * _);
      s.push(t, e), s.push(n, o);
    } else {
      s.push(r, i), s.push(t, e);
      for (E = 1, T = d; E < v; E++, T += m)
        s.push(t + Math.sin(T) * _, e + Math.cos(T) * _), s.push(t, e);
      s.push(n, o), s.push(t, e);
    }
    return 2 * v;
  }
  function Ca(e, r) {
    e.lineStyle.native
      ? (function (e, r) {
          var i = 0,
            n = e.shape,
            o = e.points || n.points,
            s = n.type !== t.SHAPES.POLY || n.closeStroke;
          if (0 !== o.length) {
            var a = r.points,
              h = r.indices,
              u = o.length / 2,
              l = a.length / 2,
              c = l;
            for (a.push(o[0], o[1]), i = 1; i < u; i++)
              a.push(o[2 * i], o[2 * i + 1]), h.push(c, c + 1), c++;
            s && h.push(c, l);
          }
        })(e, r)
      : (function (e, r) {
          var i = e.shape,
            n = e.points || i.points.slice(),
            o = r.closePointEps;
          if (0 !== n.length) {
            var s = e.lineStyle,
              a = new fr(n[0], n[1]),
              h = new fr(n[n.length - 2], n[n.length - 1]),
              u = i.type !== t.SHAPES.POLY || i.closeStroke,
              l = Math.abs(a.x - h.x) < o && Math.abs(a.y - h.y) < o;
            if (u) {
              (n = n.slice()),
                l &&
                  (n.pop(), n.pop(), h.set(n[n.length - 2], n[n.length - 1]));
              var c = 0.5 * (a.x + h.x),
                d = 0.5 * (h.y + a.y);
              n.unshift(c, d), n.push(c, d);
            }
            var f = r.points,
              p = n.length / 2,
              _ = n.length,
              v = f.length / 2,
              m = s.width / 2,
              E = m * m,
              T = s.miterLimit * s.miterLimit,
              y = n[0],
              g = n[1],
              b = n[2],
              R = n[3],
              A = 0,
              x = 0,
              S = -(g - R),
              O = y - b,
              I = 0,
              P = 0,
              M = Math.sqrt(S * S + O * O);
            (S /= M), (O /= M), (S *= m), (O *= m);
            var N = s.alignment,
              D = 2 * (1 - N),
              C = 2 * N;
            u ||
              (s.cap === t.LINE_CAP.ROUND
                ? (_ +=
                    Da(
                      y - S * (D - C) * 0.5,
                      g - O * (D - C) * 0.5,
                      y - S * D,
                      g - O * D,
                      y + S * C,
                      g + O * C,
                      f,
                      !0
                    ) + 2)
                : s.cap === t.LINE_CAP.SQUARE &&
                  (_ += Na(y, g, S, O, D, C, !0, f))),
              f.push(y - S * D, g - O * D),
              f.push(y + S * C, g + O * C);
            for (var w = 1; w < p - 1; ++w) {
              (y = n[2 * (w - 1)]),
                (g = n[2 * (w - 1) + 1]),
                (b = n[2 * w]),
                (R = n[2 * w + 1]),
                (A = n[2 * (w + 1)]),
                (x = n[2 * (w + 1) + 1]),
                (S = -(g - R)),
                (O = y - b),
                (S /= M = Math.sqrt(S * S + O * O)),
                (O /= M),
                (S *= m),
                (O *= m),
                (I = -(R - x)),
                (P = b - A),
                (I /= M = Math.sqrt(I * I + P * P)),
                (P /= M),
                (I *= m),
                (P *= m);
              var L = b - y,
                F = g - R,
                U = b - A,
                B = x - R,
                G = F * U - B * L,
                X = G < 0;
              if (Math.abs(G) < 0.1)
                f.push(b - S * D, R - O * D), f.push(b + S * C, R + O * C);
              else {
                var k = (-S + y) * (-O + R) - (-S + b) * (-O + g),
                  H = (-I + A) * (-P + R) - (-I + b) * (-P + x),
                  Y = (L * H - U * k) / G,
                  j = (B * k - F * H) / G,
                  V = (Y - b) * (Y - b) + (j - R) * (j - R),
                  W = b + (Y - b) * D,
                  z = R + (j - R) * D,
                  q = b - (Y - b) * C,
                  K = R - (j - R) * C,
                  Z = X ? D : C;
                V <= Math.min(L * L + F * F, U * U + B * B) + Z * Z * E
                  ? s.join === t.LINE_JOIN.BEVEL || V / E > T
                    ? (X
                        ? (f.push(W, z),
                          f.push(b + S * C, R + O * C),
                          f.push(W, z),
                          f.push(b + I * C, R + P * C))
                        : (f.push(b - S * D, R - O * D),
                          f.push(q, K),
                          f.push(b - I * D, R - P * D),
                          f.push(q, K)),
                      (_ += 2))
                    : s.join === t.LINE_JOIN.ROUND
                    ? X
                      ? (f.push(W, z),
                        f.push(b + S * C, R + O * C),
                        (_ +=
                          Da(
                            b,
                            R,
                            b + S * C,
                            R + O * C,
                            b + I * C,
                            R + P * C,
                            f,
                            !0
                          ) + 4),
                        f.push(W, z),
                        f.push(b + I * C, R + P * C))
                      : (f.push(b - S * D, R - O * D),
                        f.push(q, K),
                        (_ +=
                          Da(
                            b,
                            R,
                            b - S * D,
                            R - O * D,
                            b - I * D,
                            R - P * D,
                            f,
                            !1
                          ) + 4),
                        f.push(b - I * D, R - P * D),
                        f.push(q, K))
                    : (f.push(W, z), f.push(q, K))
                  : (f.push(b - S * D, R - O * D),
                    f.push(b + S * C, R + O * C),
                    s.join === t.LINE_JOIN.BEVEL ||
                      V / E > T ||
                      (s.join === t.LINE_JOIN.ROUND
                        ? (_ += X
                            ? Da(
                                b,
                                R,
                                b + S * C,
                                R + O * C,
                                b + I * C,
                                R + P * C,
                                f,
                                !0
                              ) + 2
                            : Da(
                                b,
                                R,
                                b - S * D,
                                R - O * D,
                                b - I * D,
                                R - P * D,
                                f,
                                !1
                              ) + 2)
                        : (X
                            ? (f.push(q, K), f.push(q, K))
                            : (f.push(W, z), f.push(W, z)),
                          (_ += 2))),
                    f.push(b - I * D, R - P * D),
                    f.push(b + I * C, R + P * C),
                    (_ += 2));
              }
            }
            (y = n[2 * (p - 2)]),
              (g = n[2 * (p - 2) + 1]),
              (b = n[2 * (p - 1)]),
              (S = -(g - (R = n[2 * (p - 1) + 1]))),
              (O = y - b),
              (S /= M = Math.sqrt(S * S + O * O)),
              (O /= M),
              (S *= m),
              (O *= m),
              f.push(b - S * D, R - O * D),
              f.push(b + S * C, R + O * C),
              u ||
                (s.cap === t.LINE_CAP.ROUND
                  ? (_ +=
                      Da(
                        b - S * (D - C) * 0.5,
                        R - O * (D - C) * 0.5,
                        b - S * D,
                        R - O * D,
                        b + S * C,
                        R + O * C,
                        f,
                        !1
                      ) + 2)
                  : s.cap === t.LINE_CAP.SQUARE &&
                    (_ += Na(b, R, S, O, D, C, !1, f)));
            var Q = r.indices,
              J = ya.epsilon * ya.epsilon;
            for (w = v; w < _ + v - 2; ++w)
              (y = f[2 * w]),
                (g = f[2 * w + 1]),
                (b = f[2 * (w + 1)]),
                (R = f[2 * (w + 1) + 1]),
                (A = f[2 * (w + 2)]),
                (x = f[2 * (w + 2) + 1]),
                Math.abs(y * (R - x) + b * (x - g) + A * (g - R)) < J ||
                  Q.push(w, w + 1, w + 2);
          }
        })(e, r);
  }
  var wa,
    La = (function () {
      function t() {}
      return (
        (t.curveTo = function (t, e, r, i, n, o) {
          var s = o[o.length - 2],
            a = o[o.length - 1] - e,
            h = s - t,
            u = i - e,
            l = r - t,
            c = Math.abs(a * l - h * u);
          if (c < 1e-8 || 0 === n)
            return (
              (o[o.length - 2] === t && o[o.length - 1] === e) || o.push(t, e),
              null
            );
          var d = a * a + h * h,
            f = u * u + l * l,
            p = a * u + h * l,
            _ = (n * Math.sqrt(d)) / c,
            v = (n * Math.sqrt(f)) / c,
            m = (_ * p) / d,
            E = (v * p) / f,
            T = _ * l + v * h,
            y = _ * u + v * a,
            g = h * (v + m),
            b = a * (v + m),
            R = l * (_ + E),
            A = u * (_ + E);
          return {
            cx: T + t,
            cy: y + e,
            radius: n,
            startAngle: Math.atan2(b - y, g - T),
            endAngle: Math.atan2(A - y, R - T),
            anticlockwise: h * u > l * a,
          };
        }),
        (t.arc = function (t, e, r, i, n, o, s, a, h) {
          for (
            var u = s - o,
              l = ya._segmentsCount(
                Math.abs(u) * n,
                40 * Math.ceil(Math.abs(u) / lr)
              ),
              c = u / (2 * l),
              d = 2 * c,
              f = Math.cos(c),
              p = Math.sin(c),
              _ = l - 1,
              v = (_ % 1) / _,
              m = 0;
            m <= _;
            ++m
          ) {
            var E = c + o + d * (m + v * m),
              T = Math.cos(E),
              y = -Math.sin(E);
            h.push((f * T + p * y) * n + r, (f * -y + p * T) * n + i);
          }
        }),
        t
      );
    })(),
    Fa = (function () {
      function t() {}
      return (
        (t.curveLength = function (t, e, r, i, n, o, s, a) {
          for (
            var h = 0,
              u = 0,
              l = 0,
              c = 0,
              d = 0,
              f = 0,
              p = 0,
              _ = 0,
              v = 0,
              m = 0,
              E = 0,
              T = t,
              y = e,
              g = 1;
            g <= 10;
            ++g
          )
            (m =
              T -
              (_ =
                (p = (f = (d = 1 - (u = g / 10)) * d) * d) * t +
                3 * f * u * r +
                3 * d * (l = u * u) * n +
                (c = l * u) * s)),
              (E = y - (v = p * e + 3 * f * u * i + 3 * d * l * o + c * a)),
              (T = _),
              (y = v),
              (h += Math.sqrt(m * m + E * E));
          return h;
        }),
        (t.curveTo = function (e, r, i, n, o, s, a) {
          var h = a[a.length - 2],
            u = a[a.length - 1];
          a.length -= 2;
          var l = ya._segmentsCount(t.curveLength(h, u, e, r, i, n, o, s)),
            c = 0,
            d = 0,
            f = 0,
            p = 0,
            _ = 0;
          a.push(h, u);
          for (var v = 1, m = 0; v <= l; ++v)
            (f = (d = (c = 1 - (m = v / l)) * c) * c),
              (_ = (p = m * m) * m),
              a.push(
                f * h + 3 * d * m * e + 3 * c * p * i + _ * o,
                f * u + 3 * d * m * r + 3 * c * p * n + _ * s
              );
        }),
        t
      );
    })(),
    Ua = (function () {
      function t() {}
      return (
        (t.curveLength = function (t, e, r, i, n, o) {
          var s = t - 2 * r + n,
            a = e - 2 * i + o,
            h = 2 * r - 2 * t,
            u = 2 * i - 2 * e,
            l = 4 * (s * s + a * a),
            c = 4 * (s * h + a * u),
            d = h * h + u * u,
            f = 2 * Math.sqrt(l + c + d),
            p = Math.sqrt(l),
            _ = 2 * l * p,
            v = 2 * Math.sqrt(d),
            m = c / p;
          return (
            (_ * f +
              p * c * (f - v) +
              (4 * d * l - c * c) * Math.log((2 * p + m + f) / (m + v))) /
            (4 * _)
          );
        }),
        (t.curveTo = function (e, r, i, n, o) {
          for (
            var s = o[o.length - 2],
              a = o[o.length - 1],
              h = ya._segmentsCount(t.curveLength(s, a, e, r, i, n)),
              u = 0,
              l = 0,
              c = 1;
            c <= h;
            ++c
          ) {
            var d = c / h;
            (u = s + (e - s) * d),
              (l = a + (r - a) * d),
              o.push(
                u + (e + (i - e) * d - u) * d,
                l + (r + (n - r) * d - l) * d
              );
          }
        }),
        t
      );
    })(),
    Ba = (function () {
      function t() {
        this.reset();
      }
      return (
        (t.prototype.begin = function (t, e, r) {
          this.reset(),
            (this.style = t),
            (this.start = e),
            (this.attribStart = r);
        }),
        (t.prototype.end = function (t, e) {
          (this.attribSize = e - this.attribStart),
            (this.size = t - this.start);
        }),
        (t.prototype.reset = function () {
          (this.style = null),
            (this.size = 0),
            (this.start = 0),
            (this.attribStart = 0),
            (this.attribSize = 0);
        }),
        t
      );
    })(),
    Ga =
      (((wa = {})[t.SHAPES.POLY] = xa),
      (wa[t.SHAPES.CIRC] = Sa),
      (wa[t.SHAPES.ELIP] = Sa),
      (wa[t.SHAPES.RECT] = Oa),
      (wa[t.SHAPES.RREC] = Ma),
      wa),
    Xa = [],
    ka = [],
    Ha = (function () {
      function t(t, e, r, i) {
        void 0 === e && (e = null),
          void 0 === r && (r = null),
          void 0 === i && (i = null),
          (this.points = []),
          (this.holes = []),
          (this.shape = t),
          (this.lineStyle = r),
          (this.fillStyle = e),
          (this.matrix = i),
          (this.type = t.type);
      }
      return (
        (t.prototype.clone = function () {
          return new t(this.shape, this.fillStyle, this.lineStyle, this.matrix);
        }),
        (t.prototype.destroy = function () {
          (this.shape = null),
            (this.holes.length = 0),
            (this.holes = null),
            (this.points.length = 0),
            (this.points = null),
            (this.lineStyle = null),
            (this.fillStyle = null);
        }),
        t
      );
    })(),
    Ya = new fr(),
    ja = new Nr(),
    Va = (function (e) {
      function r() {
        var t = e.call(this) || this;
        return (
          (t.closePointEps = 1e-4),
          (t.boundsPadding = 0),
          (t.uvsFloat32 = null),
          (t.indicesUint16 = null),
          (t.batchable = !1),
          (t.points = []),
          (t.colors = []),
          (t.uvs = []),
          (t.indices = []),
          (t.textureIds = []),
          (t.graphicsData = []),
          (t.drawCalls = []),
          (t.batchDirty = -1),
          (t.batches = []),
          (t.dirty = 0),
          (t.cacheDirty = -1),
          (t.clearDirty = 0),
          (t.shapeIndex = 0),
          (t._bounds = new Nr()),
          (t.boundsDirty = -1),
          t
        );
      }
      return (
        Ra(r, e),
        Object.defineProperty(r.prototype, "bounds", {
          get: function () {
            return (
              this.boundsDirty !== this.dirty &&
                ((this.boundsDirty = this.dirty), this.calculateBounds()),
              this._bounds
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.invalidate = function () {
          (this.boundsDirty = -1),
            this.dirty++,
            this.batchDirty++,
            (this.shapeIndex = 0),
            (this.points.length = 0),
            (this.colors.length = 0),
            (this.uvs.length = 0),
            (this.indices.length = 0),
            (this.textureIds.length = 0);
          for (var t = 0; t < this.drawCalls.length; t++)
            this.drawCalls[t].texArray.clear(), ka.push(this.drawCalls[t]);
          this.drawCalls.length = 0;
          for (t = 0; t < this.batches.length; t++) {
            var e = this.batches[t];
            e.reset(), Xa.push(e);
          }
          this.batches.length = 0;
        }),
        (r.prototype.clear = function () {
          return (
            this.graphicsData.length > 0 &&
              (this.invalidate(),
              this.clearDirty++,
              (this.graphicsData.length = 0)),
            this
          );
        }),
        (r.prototype.drawShape = function (t, e, r, i) {
          void 0 === e && (e = null),
            void 0 === r && (r = null),
            void 0 === i && (i = null);
          var n = new Ha(t, e, r, i);
          return this.graphicsData.push(n), this.dirty++, this;
        }),
        (r.prototype.drawHole = function (t, e) {
          if ((void 0 === e && (e = null), !this.graphicsData.length))
            return null;
          var r = new Ha(t, null, null, e),
            i = this.graphicsData[this.graphicsData.length - 1];
          return (
            (r.lineStyle = i.lineStyle), i.holes.push(r), this.dirty++, this
          );
        }),
        (r.prototype.destroy = function () {
          e.prototype.destroy.call(this);
          for (var t = 0; t < this.graphicsData.length; ++t)
            this.graphicsData[t].destroy();
          (this.points.length = 0),
            (this.points = null),
            (this.colors.length = 0),
            (this.colors = null),
            (this.uvs.length = 0),
            (this.uvs = null),
            (this.indices.length = 0),
            (this.indices = null),
            this.indexBuffer.destroy(),
            (this.indexBuffer = null),
            (this.graphicsData.length = 0),
            (this.graphicsData = null),
            (this.drawCalls.length = 0),
            (this.drawCalls = null),
            (this.batches.length = 0),
            (this.batches = null),
            (this._bounds = null);
        }),
        (r.prototype.containsPoint = function (t) {
          for (var e = this.graphicsData, r = 0; r < e.length; ++r) {
            var i = e[r];
            if (
              i.fillStyle.visible &&
              i.shape &&
              (i.matrix ? i.matrix.applyInverse(t, Ya) : Ya.copyFrom(t),
              i.shape.contains(Ya.x, Ya.y))
            ) {
              var n = !1;
              if (i.holes)
                for (var o = 0; o < i.holes.length; o++) {
                  if (i.holes[o].shape.contains(Ya.x, Ya.y)) {
                    n = !0;
                    break;
                  }
                }
              if (!n) return !0;
            }
          }
          return !1;
        }),
        (r.prototype.updateBatches = function (e) {
          if (this.graphicsData.length) {
            if (this.validateBatching()) {
              this.cacheDirty = this.dirty;
              var r = this.uvs,
                i = this.graphicsData,
                n = null,
                o = null;
              this.batches.length > 0 &&
                (o = (n = this.batches[this.batches.length - 1]).style);
              for (var s = this.shapeIndex; s < i.length; s++) {
                this.shapeIndex++;
                var a = i[s],
                  h = a.fillStyle,
                  u = a.lineStyle;
                Ga[a.type].build(a),
                  a.matrix && this.transformPoints(a.points, a.matrix),
                  (h.visible || u.visible) && this.processHoles(a.holes);
                for (var l = 0; l < 2; l++) {
                  var c = 0 === l ? h : u;
                  if (c.visible) {
                    var d = c.texture.baseTexture,
                      f = this.indices.length,
                      p = this.points.length / 2;
                    (d.wrapMode = t.WRAP_MODES.REPEAT),
                      0 === l ? this.processFill(a) : this.processLine(a);
                    var _ = this.points.length / 2 - p;
                    0 !== _ &&
                      (n &&
                        !this._compareStyles(o, c) &&
                        (n.end(f, p), (n = null)),
                      n ||
                        ((n = Xa.pop() || new Ba()).begin(c, f, p),
                        this.batches.push(n),
                        (o = c)),
                      this.addUvs(this.points, r, c.texture, p, _, c.matrix));
                  }
                }
              }
              var v = this.indices.length,
                m = this.points.length / 2;
              if ((n && n.end(v, m), 0 !== this.batches.length)) {
                if (
                  this.indicesUint16 &&
                  this.indices.length === this.indicesUint16.length
                )
                  this.indicesUint16.set(this.indices);
                else {
                  var E = m > 65535 && e;
                  this.indicesUint16 = E
                    ? new Uint32Array(this.indices)
                    : new Uint16Array(this.indices);
                }
                (this.batchable = this.isBatchable()),
                  this.batchable ? this.packBatches() : this.buildDrawCalls();
              } else this.batchable = !0;
            }
          } else this.batchable = !0;
        }),
        (r.prototype._compareStyles = function (t, e) {
          return (
            !(!t || !e) &&
            t.texture.baseTexture === e.texture.baseTexture &&
            t.color + t.alpha === e.color + e.alpha &&
            !!t.native == !!e.native
          );
        }),
        (r.prototype.validateBatching = function () {
          if (this.dirty === this.cacheDirty || !this.graphicsData.length)
            return !1;
          for (var t = 0, e = this.graphicsData.length; t < e; t++) {
            var r = this.graphicsData[t],
              i = r.fillStyle,
              n = r.lineStyle;
            if (i && !i.texture.baseTexture.valid) return !1;
            if (n && !n.texture.baseTexture.valid) return !1;
          }
          return !0;
        }),
        (r.prototype.packBatches = function () {
          this.batchDirty++, (this.uvsFloat32 = new Float32Array(this.uvs));
          for (var t = this.batches, e = 0, r = t.length; e < r; e++)
            for (var i = t[e], n = 0; n < i.size; n++) {
              var o = i.start + n;
              this.indicesUint16[o] = this.indicesUint16[o] - i.attribStart;
            }
        }),
        (r.prototype.isBatchable = function () {
          if (this.points.length > 131070) return !1;
          for (var t = this.batches, e = 0; e < t.length; e++)
            if (t[e].style.native) return !1;
          return this.points.length < 2 * r.BATCHABLE_SIZE;
        }),
        (r.prototype.buildDrawCalls = function () {
          for (var e = ++Si._globalBatch, r = 0; r < this.drawCalls.length; r++)
            this.drawCalls[r].texArray.clear(), ka.push(this.drawCalls[r]);
          this.drawCalls.length = 0;
          var i = this.colors,
            n = this.textureIds,
            o = ka.pop();
          o || ((o = new No()).texArray = new Do()),
            (o.texArray.count = 0),
            (o.start = 0),
            (o.size = 0),
            (o.type = t.DRAW_MODES.TRIANGLES);
          var s = 0,
            a = null,
            h = 0,
            u = !1,
            l = t.DRAW_MODES.TRIANGLES,
            c = 0;
          this.drawCalls.push(o);
          for (r = 0; r < this.batches.length; r++) {
            var d = this.batches[r],
              f = d.style,
              p = f.texture.baseTexture;
            u !== !!f.native &&
              ((l = (u = !!f.native)
                ? t.DRAW_MODES.LINES
                : t.DRAW_MODES.TRIANGLES),
              (a = null),
              (s = 8),
              e++),
              a !== p &&
                ((a = p),
                p._batchEnabled !== e &&
                  (8 === s &&
                    (e++,
                    (s = 0),
                    o.size > 0 &&
                      ((o = ka.pop()) || ((o = new No()).texArray = new Do()),
                      this.drawCalls.push(o)),
                    (o.start = c),
                    (o.size = 0),
                    (o.texArray.count = 0),
                    (o.type = l)),
                  (p.touched = 1),
                  (p._batchEnabled = e),
                  (p._batchLocation = s),
                  (p.wrapMode = t.WRAP_MODES.REPEAT),
                  (o.texArray.elements[o.texArray.count++] = p),
                  s++)),
              (o.size += d.size),
              (c += d.size),
              (h = p._batchLocation),
              this.addColors(i, f.color, f.alpha, d.attribSize, d.attribStart),
              this.addTextureIds(n, h, d.attribSize, d.attribStart);
          }
          (Si._globalBatch = e), this.packAttributes();
        }),
        (r.prototype.packAttributes = function () {
          for (
            var t = this.points,
              e = this.uvs,
              r = this.colors,
              i = this.textureIds,
              n = new ArrayBuffer(12 * t.length),
              o = new Float32Array(n),
              s = new Uint32Array(n),
              a = 0,
              h = 0;
            h < t.length / 2;
            h++
          )
            (o[a++] = t[2 * h]),
              (o[a++] = t[2 * h + 1]),
              (o[a++] = e[2 * h]),
              (o[a++] = e[2 * h + 1]),
              (s[a++] = r[h]),
              (o[a++] = i[h]);
          this._buffer.update(n), this._indexBuffer.update(this.indicesUint16);
        }),
        (r.prototype.processFill = function (t) {
          t.holes.length
            ? xa.triangulate(t, this)
            : Ga[t.type].triangulate(t, this);
        }),
        (r.prototype.processLine = function (t) {
          Ca(t, this);
          for (var e = 0; e < t.holes.length; e++) Ca(t.holes[e], this);
        }),
        (r.prototype.processHoles = function (t) {
          for (var e = 0; e < t.length; e++) {
            var r = t[e];
            Ga[r.type].build(r),
              r.matrix && this.transformPoints(r.points, r.matrix);
          }
        }),
        (r.prototype.calculateBounds = function () {
          var e = this._bounds,
            r = ja,
            i = gr.IDENTITY;
          this._bounds.clear(), r.clear();
          for (var n = 0; n < this.graphicsData.length; n++) {
            var o = this.graphicsData[n],
              s = o.shape,
              a = o.type,
              h = o.lineStyle,
              u = o.matrix || gr.IDENTITY,
              l = 0;
            if (
              (h && h.visible && (l = h.width * Math.max(0, h.alignment)),
              i !== u &&
                (r.isEmpty() || (e.addBoundsMatrix(r, i), r.clear()), (i = u)),
              a === t.SHAPES.RECT || a === t.SHAPES.RREC)
            ) {
              var c = s;
              r.addFramePad(c.x, c.y, c.x + c.width, c.y + c.height, l, l);
            } else if (a === t.SHAPES.CIRC) {
              var d = s;
              r.addFramePad(d.x, d.y, d.x, d.y, d.radius + l, d.radius + l);
            } else if (a === t.SHAPES.ELIP) {
              var f = s;
              r.addFramePad(f.x, f.y, f.x, f.y, f.width + l, f.height + l);
            } else {
              var p = s;
              e.addVerticesMatrix(i, p.points, 0, p.points.length, l, l);
            }
          }
          r.isEmpty() || e.addBoundsMatrix(r, i),
            e.pad(this.boundsPadding, this.boundsPadding);
        }),
        (r.prototype.transformPoints = function (t, e) {
          for (var r = 0; r < t.length / 2; r++) {
            var i = t[2 * r],
              n = t[2 * r + 1];
            (t[2 * r] = e.a * i + e.c * n + e.tx),
              (t[2 * r + 1] = e.b * i + e.d * n + e.ty);
          }
        }),
        (r.prototype.addColors = function (t, e, r, i, n) {
          void 0 === n && (n = 0);
          var o = Ge((e >> 16) + (65280 & e) + ((255 & e) << 16), r);
          t.length = Math.max(t.length, n + i);
          for (var s = 0; s < i; s++) t[n + s] = o;
        }),
        (r.prototype.addTextureIds = function (t, e, r, i) {
          void 0 === i && (i = 0), (t.length = Math.max(t.length, i + r));
          for (var n = 0; n < r; n++) t[i + n] = e;
        }),
        (r.prototype.addUvs = function (t, e, r, i, n, o) {
          void 0 === o && (o = null);
          for (var s = 0, a = e.length, h = r.frame; s < n; ) {
            var u = t[2 * (i + s)],
              l = t[2 * (i + s) + 1];
            if (o) {
              var c = o.a * u + o.c * l + o.tx;
              (l = o.b * u + o.d * l + o.ty), (u = c);
            }
            s++, e.push(u / h.width, l / h.height);
          }
          var d = r.baseTexture;
          (h.width < d.width || h.height < d.height) &&
            this.adjustUvs(e, r, a, n);
        }),
        (r.prototype.adjustUvs = function (t, e, r, i) {
          for (
            var n = e.baseTexture,
              o = 1e-6,
              s = r + 2 * i,
              a = e.frame,
              h = a.width / n.width,
              u = a.height / n.height,
              l = a.x / a.width,
              c = a.y / a.height,
              d = Math.floor(t[r] + o),
              f = Math.floor(t[r + 1] + o),
              p = r + 2;
            p < s;
            p += 2
          )
            (d = Math.min(d, Math.floor(t[p] + o))),
              (f = Math.min(f, Math.floor(t[p + 1] + o)));
          (l -= d), (c -= f);
          for (p = r; p < s; p += 2)
            (t[p] = (t[p] + l) * h), (t[p + 1] = (t[p + 1] + c) * u);
        }),
        (r.BATCHABLE_SIZE = 100),
        r
      );
    })(Fo),
    Wa = (function (e) {
      function r() {
        var r = (null !== e && e.apply(this, arguments)) || this;
        return (
          (r.width = 0),
          (r.alignment = 0.5),
          (r.native = !1),
          (r.cap = t.LINE_CAP.BUTT),
          (r.join = t.LINE_JOIN.MITER),
          (r.miterLimit = 10),
          r
        );
      }
      return (
        Ra(r, e),
        (r.prototype.clone = function () {
          var t = new r();
          return (
            (t.color = this.color),
            (t.alpha = this.alpha),
            (t.texture = this.texture),
            (t.matrix = this.matrix),
            (t.visible = this.visible),
            (t.width = this.width),
            (t.alignment = this.alignment),
            (t.native = this.native),
            (t.cap = this.cap),
            (t.join = this.join),
            (t.miterLimit = this.miterLimit),
            t
          );
        }),
        (r.prototype.reset = function () {
          e.prototype.reset.call(this),
            (this.color = 0),
            (this.alignment = 0.5),
            (this.width = 0),
            (this.native = !1);
        }),
        r
      );
    })(ga),
    za = new Float32Array(3),
    qa = {},
    Ka = (function (e) {
      function r(r) {
        void 0 === r && (r = null);
        var i = e.call(this) || this;
        return (
          (i.shader = null),
          (i.pluginName = "batch"),
          (i.currentPath = null),
          (i.batches = []),
          (i.batchTint = -1),
          (i.batchDirty = -1),
          (i.vertexData = null),
          (i._fillStyle = new ga()),
          (i._lineStyle = new Wa()),
          (i._matrix = null),
          (i._holeMode = !1),
          (i.state = jn.for2d()),
          (i._geometry = r || new Va()),
          i._geometry.refCount++,
          (i._transformID = -1),
          (i.tint = 16777215),
          (i.blendMode = t.BLEND_MODES.NORMAL),
          i
        );
      }
      return (
        Ra(r, e),
        Object.defineProperty(r.prototype, "geometry", {
          get: function () {
            return this._geometry;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.clone = function () {
          return this.finishPoly(), new r(this._geometry);
        }),
        Object.defineProperty(r.prototype, "blendMode", {
          get: function () {
            return this.state.blendMode;
          },
          set: function (t) {
            this.state.blendMode = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "tint", {
          get: function () {
            return this._tint;
          },
          set: function (t) {
            this._tint = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "fill", {
          get: function () {
            return this._fillStyle;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "line", {
          get: function () {
            return this._lineStyle;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.lineStyle = function (t, e, r, i, n) {
          return (
            void 0 === t && (t = null),
            void 0 === e && (e = 0),
            void 0 === r && (r = 1),
            void 0 === i && (i = 0.5),
            void 0 === n && (n = !1),
            "number" == typeof t &&
              (t = { width: t, color: e, alpha: r, alignment: i, native: n }),
            this.lineTextureStyle(t)
          );
        }),
        (r.prototype.lineTextureStyle = function (e) {
          (e = Object.assign(
            {
              width: 0,
              texture: Hi.WHITE,
              color: e && e.texture ? 16777215 : 0,
              alpha: 1,
              matrix: null,
              alignment: 0.5,
              native: !1,
              cap: t.LINE_CAP.BUTT,
              join: t.LINE_JOIN.MITER,
              miterLimit: 10,
            },
            e
          )),
            this.currentPath && this.startPoly();
          var r = e.width > 0 && e.alpha > 0;
          return (
            r
              ? (e.matrix && ((e.matrix = e.matrix.clone()), e.matrix.invert()),
                Object.assign(this._lineStyle, { visible: r }, e))
              : this._lineStyle.reset(),
            this
          );
        }),
        (r.prototype.startPoly = function () {
          if (this.currentPath) {
            var t = this.currentPath.points,
              e = this.currentPath.points.length;
            e > 2 &&
              (this.drawShape(this.currentPath),
              (this.currentPath = new Er()),
              (this.currentPath.closeStroke = !1),
              this.currentPath.points.push(t[e - 2], t[e - 1]));
          } else
            (this.currentPath = new Er()), (this.currentPath.closeStroke = !1);
        }),
        (r.prototype.finishPoly = function () {
          this.currentPath &&
            (this.currentPath.points.length > 2
              ? (this.drawShape(this.currentPath), (this.currentPath = null))
              : (this.currentPath.points.length = 0));
        }),
        (r.prototype.moveTo = function (t, e) {
          return (
            this.startPoly(),
            (this.currentPath.points[0] = t),
            (this.currentPath.points[1] = e),
            this
          );
        }),
        (r.prototype.lineTo = function (t, e) {
          this.currentPath || this.moveTo(0, 0);
          var r = this.currentPath.points,
            i = r[r.length - 2],
            n = r[r.length - 1];
          return (i === t && n === e) || r.push(t, e), this;
        }),
        (r.prototype._initCurve = function (t, e) {
          void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            this.currentPath
              ? 0 === this.currentPath.points.length &&
                (this.currentPath.points = [t, e])
              : this.moveTo(t, e);
        }),
        (r.prototype.quadraticCurveTo = function (t, e, r, i) {
          this._initCurve();
          var n = this.currentPath.points;
          return (
            0 === n.length && this.moveTo(0, 0), Ua.curveTo(t, e, r, i, n), this
          );
        }),
        (r.prototype.bezierCurveTo = function (t, e, r, i, n, o) {
          return (
            this._initCurve(),
            Fa.curveTo(t, e, r, i, n, o, this.currentPath.points),
            this
          );
        }),
        (r.prototype.arcTo = function (t, e, r, i, n) {
          this._initCurve(t, e);
          var o = this.currentPath.points,
            s = La.curveTo(t, e, r, i, n, o);
          if (s) {
            var a = s.cx,
              h = s.cy,
              u = s.radius,
              l = s.startAngle,
              c = s.endAngle,
              d = s.anticlockwise;
            this.arc(a, h, u, l, c, d);
          }
          return this;
        }),
        (r.prototype.arc = function (t, e, r, i, n, o) {
          if ((void 0 === o && (o = !1), i === n)) return this;
          if (
            (!o && n <= i ? (n += lr) : o && i <= n && (i += lr), 0 === n - i)
          )
            return this;
          var s = t + Math.cos(i) * r,
            a = e + Math.sin(i) * r,
            h = this._geometry.closePointEps,
            u = this.currentPath ? this.currentPath.points : null;
          if (u) {
            var l = Math.abs(u[u.length - 2] - s),
              c = Math.abs(u[u.length - 1] - a);
            (l < h && c < h) || u.push(s, a);
          } else this.moveTo(s, a), (u = this.currentPath.points);
          return La.arc(s, a, t, e, r, i, n, o, u), this;
        }),
        (r.prototype.beginFill = function (t, e) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = 1),
            this.beginTextureFill({ texture: Hi.WHITE, color: t, alpha: e })
          );
        }),
        (r.prototype.beginTextureFill = function (t) {
          (t = Object.assign(
            { texture: Hi.WHITE, color: 16777215, alpha: 1, matrix: null },
            t
          )),
            this.currentPath && this.startPoly();
          var e = t.alpha > 0;
          return (
            e
              ? (t.matrix && ((t.matrix = t.matrix.clone()), t.matrix.invert()),
                Object.assign(this._fillStyle, { visible: e }, t))
              : this._fillStyle.reset(),
            this
          );
        }),
        (r.prototype.endFill = function () {
          return this.finishPoly(), this._fillStyle.reset(), this;
        }),
        (r.prototype.drawRect = function (t, e, r, i) {
          return this.drawShape(new _r(t, e, r, i));
        }),
        (r.prototype.drawRoundedRect = function (t, e, r, i, n) {
          return this.drawShape(new Tr(t, e, r, i, n));
        }),
        (r.prototype.drawCircle = function (t, e, r) {
          return this.drawShape(new vr(t, e, r));
        }),
        (r.prototype.drawEllipse = function (t, e, r, i) {
          return this.drawShape(new mr(t, e, r, i));
        }),
        (r.prototype.drawPolygon = function () {
          for (var t, e = arguments, r = [], i = 0; i < arguments.length; i++)
            r[i] = e[i];
          var n = !0,
            o = r[0];
          o.points
            ? ((n = o.closeStroke), (t = o.points))
            : (t = Array.isArray(r[0]) ? r[0] : r);
          var s = new Er(t);
          return (s.closeStroke = n), this.drawShape(s), this;
        }),
        (r.prototype.drawShape = function (t) {
          return (
            this._holeMode
              ? this._geometry.drawHole(t, this._matrix)
              : this._geometry.drawShape(
                  t,
                  this._fillStyle.clone(),
                  this._lineStyle.clone(),
                  this._matrix
                ),
            this
          );
        }),
        (r.prototype.clear = function () {
          return (
            this._geometry.clear(),
            this._lineStyle.reset(),
            this._fillStyle.reset(),
            this._boundsID++,
            (this._matrix = null),
            (this._holeMode = !1),
            (this.currentPath = null),
            this
          );
        }),
        (r.prototype.isFastRect = function () {
          var e = this._geometry.graphicsData;
          return !(
            1 !== e.length ||
            e[0].shape.type !== t.SHAPES.RECT ||
            e[0].matrix ||
            e[0].holes.length ||
            (e[0].lineStyle.visible && e[0].lineStyle.width)
          );
        }),
        (r.prototype._render = function (t) {
          this.finishPoly();
          var e = this._geometry,
            r = t.context.supports.uint32Indices;
          e.updateBatches(r),
            e.batchable
              ? (this.batchDirty !== e.batchDirty && this._populateBatches(),
                this._renderBatched(t))
              : (t.batch.flush(), this._renderDirect(t));
        }),
        (r.prototype._populateBatches = function () {
          var t = this._geometry,
            e = this.blendMode,
            r = t.batches.length;
          (this.batchTint = -1),
            (this._transformID = -1),
            (this.batchDirty = t.batchDirty),
            (this.batches.length = r),
            (this.vertexData = new Float32Array(t.points));
          for (var i = 0; i < r; i++) {
            var n = t.batches[i],
              o = n.style.color,
              s = new Float32Array(
                this.vertexData.buffer,
                8 * n.attribStart,
                2 * n.attribSize
              ),
              a = new Float32Array(
                t.uvsFloat32.buffer,
                8 * n.attribStart,
                2 * n.attribSize
              ),
              h = {
                vertexData: s,
                blendMode: e,
                indices: new Uint16Array(
                  t.indicesUint16.buffer,
                  2 * n.start,
                  n.size
                ),
                uvs: a,
                _batchRGB: Ce(o),
                _tintRGB: o,
                _texture: n.style.texture,
                alpha: n.style.alpha,
                worldAlpha: 1,
              };
            this.batches[i] = h;
          }
        }),
        (r.prototype._renderBatched = function (t) {
          if (this.batches.length) {
            t.batch.setObjectRenderer(t.plugins[this.pluginName]),
              this.calculateVertices(),
              this.calculateTints();
            for (var e = 0, r = this.batches.length; e < r; e++) {
              var i = this.batches[e];
              (i.worldAlpha = this.worldAlpha * i.alpha),
                t.plugins[this.pluginName].render(i);
            }
          }
        }),
        (r.prototype._renderDirect = function (t) {
          var e = this._resolveDirectShader(t),
            r = this._geometry,
            i = this.tint,
            n = this.worldAlpha,
            o = e.uniforms,
            s = r.drawCalls;
          (o.translationMatrix = this.transform.worldTransform),
            (o.tint[0] = (((i >> 16) & 255) / 255) * n),
            (o.tint[1] = (((i >> 8) & 255) / 255) * n),
            (o.tint[2] = ((255 & i) / 255) * n),
            (o.tint[3] = n),
            t.shader.bind(e),
            t.geometry.bind(r, e),
            t.state.set(this.state);
          for (var a = 0, h = s.length; a < h; a++)
            this._renderDrawCallDirect(t, r.drawCalls[a]);
        }),
        (r.prototype._renderDrawCallDirect = function (t, e) {
          for (
            var r = e.texArray,
              i = e.type,
              n = e.size,
              o = e.start,
              s = r.count,
              a = 0;
            a < s;
            a++
          )
            t.texture.bind(r.elements[a], a);
          t.geometry.draw(i, n, o);
        }),
        (r.prototype._resolveDirectShader = function (t) {
          var e = this.shader,
            r = this.pluginName;
          if (!e) {
            if (!qa[r]) {
              for (
                var i = t.plugins.batch.MAX_TEXTURES,
                  n = new Int32Array(i),
                  o = 0;
                o < i;
                o++
              )
                n[o] = o;
              var s = {
                  tint: new Float32Array([1, 1, 1, 1]),
                  translationMatrix: new gr(),
                  default: nn.from({ uSamplers: n }, !0),
                },
                a = t.plugins[r]._shader.program;
              qa[r] = new Yn(a, s);
            }
            e = qa[r];
          }
          return e;
        }),
        (r.prototype._calculateBounds = function () {
          this.finishPoly();
          var t = this._geometry;
          if (t.graphicsData.length) {
            var e = t.bounds,
              r = e.minX,
              i = e.minY,
              n = e.maxX,
              o = e.maxY;
            this._bounds.addFrame(this.transform, r, i, n, o);
          }
        }),
        (r.prototype.containsPoint = function (t) {
          return (
            this.worldTransform.applyInverse(t, r._TEMP_POINT),
            this._geometry.containsPoint(r._TEMP_POINT)
          );
        }),
        (r.prototype.calculateTints = function () {
          if (this.batchTint !== this.tint) {
            this.batchTint = this.tint;
            for (
              var t = Ce(this.tint, za), e = 0;
              e < this.batches.length;
              e++
            ) {
              var r = this.batches[e],
                i = r._batchRGB,
                n =
                  ((t[0] * i[0] * 255) << 16) +
                  ((t[1] * i[1] * 255) << 8) +
                  (0 | (t[2] * i[2] * 255));
              r._tintRGB = (n >> 16) + (65280 & n) + ((255 & n) << 16);
            }
          }
        }),
        (r.prototype.calculateVertices = function () {
          var t = this.transform._worldID;
          if (this._transformID !== t) {
            this._transformID = t;
            for (
              var e = this.transform.worldTransform,
                r = e.a,
                i = e.b,
                n = e.c,
                o = e.d,
                s = e.tx,
                a = e.ty,
                h = this._geometry.points,
                u = this.vertexData,
                l = 0,
                c = 0;
              c < h.length;
              c += 2
            ) {
              var d = h[c],
                f = h[c + 1];
              (u[l++] = r * d + n * f + s), (u[l++] = o * f + i * d + a);
            }
          }
        }),
        (r.prototype.closePath = function () {
          var t = this.currentPath;
          return t && ((t.closeStroke = !0), this.finishPoly()), this;
        }),
        (r.prototype.setMatrix = function (t) {
          return (this._matrix = t), this;
        }),
        (r.prototype.beginHole = function () {
          return this.finishPoly(), (this._holeMode = !0), this;
        }),
        (r.prototype.endHole = function () {
          return this.finishPoly(), (this._holeMode = !1), this;
        }),
        (r.prototype.destroy = function (t) {
          this._geometry.refCount--,
            0 === this._geometry.refCount && this._geometry.dispose(),
            (this._matrix = null),
            (this.currentPath = null),
            this._lineStyle.destroy(),
            (this._lineStyle = null),
            this._fillStyle.destroy(),
            (this._fillStyle = null),
            (this._geometry = null),
            (this.shader = null),
            (this.vertexData = null),
            (this.batches.length = 0),
            (this.batches = null),
            e.prototype.destroy.call(this, t);
        }),
        (r.nextRoundedRectBehavior = !1),
        (r._TEMP_POINT = new fr()),
        r
      );
    })(ri),
    Za = {
      buildPoly: xa,
      buildCircle: Sa,
      buildRectangle: Oa,
      buildRoundedRectangle: Ma,
      buildLine: Ca,
      ArcUtils: La,
      BezierUtils: Fa,
      QuadraticUtils: Ua,
      BatchPart: Ba,
      FILL_COMMANDS: Ga,
      BATCH_POOL: Xa,
      DRAW_CALL_POOL: ka,
    },
    Qa = function (t, e) {
      return (
        (Qa =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Qa(t, e)
      );
    };
  var Ja,
    $a = new fr(),
    th = new Uint16Array([0, 1, 2, 0, 2, 3]),
    eh = (function (e) {
      function r(r) {
        var i = e.call(this) || this;
        return (
          (i._anchor = new yr(
            i._onAnchorUpdate,
            i,
            r ? r.defaultAnchor.x : 0,
            r ? r.defaultAnchor.y : 0
          )),
          (i._texture = null),
          (i._width = 0),
          (i._height = 0),
          (i._tint = null),
          (i._tintRGB = null),
          (i.tint = 16777215),
          (i.blendMode = t.BLEND_MODES.NORMAL),
          (i._cachedTint = 16777215),
          (i.uvs = null),
          (i.texture = r || Hi.EMPTY),
          (i.vertexData = new Float32Array(8)),
          (i.vertexTrimmedData = null),
          (i._transformID = -1),
          (i._textureID = -1),
          (i._transformTrimmedID = -1),
          (i._textureTrimmedID = -1),
          (i.indices = th),
          (i.pluginName = "batch"),
          (i.isSprite = !0),
          (i._roundPixels = bt.ROUND_PIXELS),
          i
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          Qa(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(r, e),
        (r.prototype._onTextureUpdate = function () {
          (this._textureID = -1),
            (this._textureTrimmedID = -1),
            (this._cachedTint = 16777215),
            this._width &&
              (this.scale.x =
                (qe(this.scale.x) * this._width) / this._texture.orig.width),
            this._height &&
              (this.scale.y =
                (qe(this.scale.y) * this._height) / this._texture.orig.height);
        }),
        (r.prototype._onAnchorUpdate = function () {
          (this._transformID = -1), (this._transformTrimmedID = -1);
        }),
        (r.prototype.calculateVertices = function () {
          var t = this._texture;
          if (
            this._transformID !== this.transform._worldID ||
            this._textureID !== t._updateID
          ) {
            this._textureID !== t._updateID &&
              (this.uvs = this._texture._uvs.uvsFloat32),
              (this._transformID = this.transform._worldID),
              (this._textureID = t._updateID);
            var e = this.transform.worldTransform,
              r = e.a,
              i = e.b,
              n = e.c,
              o = e.d,
              s = e.tx,
              a = e.ty,
              h = this.vertexData,
              u = t.trim,
              l = t.orig,
              c = this._anchor,
              d = 0,
              f = 0,
              p = 0,
              _ = 0;
            if (
              (u
                ? ((d = (f = u.x - c._x * l.width) + u.width),
                  (p = (_ = u.y - c._y * l.height) + u.height))
                : ((d = (f = -c._x * l.width) + l.width),
                  (p = (_ = -c._y * l.height) + l.height)),
              (h[0] = r * f + n * _ + s),
              (h[1] = o * _ + i * f + a),
              (h[2] = r * d + n * _ + s),
              (h[3] = o * _ + i * d + a),
              (h[4] = r * d + n * p + s),
              (h[5] = o * p + i * d + a),
              (h[6] = r * f + n * p + s),
              (h[7] = o * p + i * f + a),
              this._roundPixels)
            )
              for (var v = bt.RESOLUTION, m = 0; m < h.length; ++m)
                h[m] = Math.round(((h[m] * v) | 0) / v);
          }
        }),
        (r.prototype.calculateTrimmedVertices = function () {
          if (this.vertexTrimmedData) {
            if (
              this._transformTrimmedID === this.transform._worldID &&
              this._textureTrimmedID === this._texture._updateID
            )
              return;
          } else this.vertexTrimmedData = new Float32Array(8);
          (this._transformTrimmedID = this.transform._worldID),
            (this._textureTrimmedID = this._texture._updateID);
          var t = this._texture,
            e = this.vertexTrimmedData,
            r = t.orig,
            i = this._anchor,
            n = this.transform.worldTransform,
            o = n.a,
            s = n.b,
            a = n.c,
            h = n.d,
            u = n.tx,
            l = n.ty,
            c = -i._x * r.width,
            d = c + r.width,
            f = -i._y * r.height,
            p = f + r.height;
          (e[0] = o * c + a * f + u),
            (e[1] = h * f + s * c + l),
            (e[2] = o * d + a * f + u),
            (e[3] = h * f + s * d + l),
            (e[4] = o * d + a * p + u),
            (e[5] = h * p + s * d + l),
            (e[6] = o * c + a * p + u),
            (e[7] = h * p + s * c + l);
        }),
        (r.prototype._render = function (t) {
          this.calculateVertices(),
            t.batch.setObjectRenderer(t.plugins[this.pluginName]),
            t.plugins[this.pluginName].render(this);
        }),
        (r.prototype._calculateBounds = function () {
          var t = this._texture.trim,
            e = this._texture.orig;
          !t || (t.width === e.width && t.height === e.height)
            ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData))
            : (this.calculateTrimmedVertices(),
              this._bounds.addQuad(this.vertexTrimmedData));
        }),
        (r.prototype.getLocalBounds = function (t) {
          return 0 === this.children.length
            ? (this._localBounds || (this._localBounds = new Nr()),
              (this._localBounds.minX =
                this._texture.orig.width * -this._anchor._x),
              (this._localBounds.minY =
                this._texture.orig.height * -this._anchor._y),
              (this._localBounds.maxX =
                this._texture.orig.width * (1 - this._anchor._x)),
              (this._localBounds.maxY =
                this._texture.orig.height * (1 - this._anchor._y)),
              t ||
                (this._localBoundsRect || (this._localBoundsRect = new _r()),
                (t = this._localBoundsRect)),
              this._localBounds.getRectangle(t))
            : e.prototype.getLocalBounds.call(this, t);
        }),
        (r.prototype.containsPoint = function (t) {
          this.worldTransform.applyInverse(t, $a);
          var e = this._texture.orig.width,
            r = this._texture.orig.height,
            i = -e * this.anchor.x,
            n = 0;
          return (
            $a.x >= i &&
            $a.x < i + e &&
            ((n = -r * this.anchor.y), $a.y >= n && $a.y < n + r)
          );
        }),
        (r.prototype.destroy = function (t) {
          if (
            (e.prototype.destroy.call(this, t),
            this._texture.off("update", this._onTextureUpdate, this),
            (this._anchor = null),
            "boolean" == typeof t ? t : t && t.texture)
          ) {
            var r = "boolean" == typeof t ? t : t && t.baseTexture;
            this._texture.destroy(!!r);
          }
          this._texture = null;
        }),
        (r.from = function (t, e) {
          return new r(t instanceof Hi ? t : Hi.from(t, e));
        }),
        Object.defineProperty(r.prototype, "roundPixels", {
          get: function () {
            return this._roundPixels;
          },
          set: function (t) {
            this._roundPixels !== t && (this._transformID = -1),
              (this._roundPixels = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "width", {
          get: function () {
            return Math.abs(this.scale.x) * this._texture.orig.width;
          },
          set: function (t) {
            var e = qe(this.scale.x) || 1;
            (this.scale.x = (e * t) / this._texture.orig.width),
              (this._width = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "height", {
          get: function () {
            return Math.abs(this.scale.y) * this._texture.orig.height;
          },
          set: function (t) {
            var e = qe(this.scale.y) || 1;
            (this.scale.y = (e * t) / this._texture.orig.height),
              (this._height = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "anchor", {
          get: function () {
            return this._anchor;
          },
          set: function (t) {
            this._anchor.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "tint", {
          get: function () {
            return this._tint;
          },
          set: function (t) {
            (this._tint = t),
              (this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "texture", {
          get: function () {
            return this._texture;
          },
          set: function (t) {
            this._texture !== t &&
              (this._texture &&
                this._texture.off("update", this._onTextureUpdate, this),
              (this._texture = t || Hi.EMPTY),
              (this._cachedTint = 16777215),
              (this._textureID = -1),
              (this._textureTrimmedID = -1),
              t &&
                (t.baseTexture.valid
                  ? this._onTextureUpdate()
                  : t.once("update", this._onTextureUpdate, this)));
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(ri),
    rh = function (t, e) {
      return (
        (rh =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        rh(t, e)
      );
    };
  ((Ja = t.TEXT_GRADIENT || (t.TEXT_GRADIENT = {}))[(Ja.LINEAR_VERTICAL = 0)] =
    "LINEAR_VERTICAL"),
    (Ja[(Ja.LINEAR_HORIZONTAL = 1)] = "LINEAR_HORIZONTAL");
  var ih = {
      align: "left",
      breakWords: !1,
      dropShadow: !1,
      dropShadowAlpha: 1,
      dropShadowAngle: Math.PI / 6,
      dropShadowBlur: 0,
      dropShadowColor: "black",
      dropShadowDistance: 5,
      fill: "black",
      fillGradientType: t.TEXT_GRADIENT.LINEAR_VERTICAL,
      fillGradientStops: [],
      fontFamily: "Arial",
      fontSize: 26,
      fontStyle: "normal",
      fontVariant: "normal",
      fontWeight: "normal",
      letterSpacing: 0,
      lineHeight: 0,
      lineJoin: "miter",
      miterLimit: 10,
      padding: 0,
      stroke: "black",
      strokeThickness: 0,
      textBaseline: "alphabetic",
      trim: !1,
      whiteSpace: "pre",
      wordWrap: !1,
      wordWrapWidth: 100,
      leading: 0,
    },
    nh = [
      "serif",
      "sans-serif",
      "monospace",
      "cursive",
      "fantasy",
      "system-ui",
    ],
    oh = (function () {
      function t(t) {
        (this.styleID = 0), this.reset(), hh(this, t, t);
      }
      return (
        (t.prototype.clone = function () {
          var e = {};
          return hh(e, this, ih), new t(e);
        }),
        (t.prototype.reset = function () {
          hh(this, ih, ih);
        }),
        Object.defineProperty(t.prototype, "align", {
          get: function () {
            return this._align;
          },
          set: function (t) {
            this._align !== t && ((this._align = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "breakWords", {
          get: function () {
            return this._breakWords;
          },
          set: function (t) {
            this._breakWords !== t && ((this._breakWords = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropShadow", {
          get: function () {
            return this._dropShadow;
          },
          set: function (t) {
            this._dropShadow !== t && ((this._dropShadow = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropShadowAlpha", {
          get: function () {
            return this._dropShadowAlpha;
          },
          set: function (t) {
            this._dropShadowAlpha !== t &&
              ((this._dropShadowAlpha = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropShadowAngle", {
          get: function () {
            return this._dropShadowAngle;
          },
          set: function (t) {
            this._dropShadowAngle !== t &&
              ((this._dropShadowAngle = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropShadowBlur", {
          get: function () {
            return this._dropShadowBlur;
          },
          set: function (t) {
            this._dropShadowBlur !== t &&
              ((this._dropShadowBlur = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropShadowColor", {
          get: function () {
            return this._dropShadowColor;
          },
          set: function (t) {
            var e = ah(t);
            this._dropShadowColor !== e &&
              ((this._dropShadowColor = e), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropShadowDistance", {
          get: function () {
            return this._dropShadowDistance;
          },
          set: function (t) {
            this._dropShadowDistance !== t &&
              ((this._dropShadowDistance = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fill", {
          get: function () {
            return this._fill;
          },
          set: function (t) {
            var e = ah(t);
            this._fill !== e && ((this._fill = e), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fillGradientType", {
          get: function () {
            return this._fillGradientType;
          },
          set: function (t) {
            this._fillGradientType !== t &&
              ((this._fillGradientType = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fillGradientStops", {
          get: function () {
            return this._fillGradientStops;
          },
          set: function (t) {
            (function (t, e) {
              if (!Array.isArray(t) || !Array.isArray(e)) return !1;
              if (t.length !== e.length) return !1;
              for (var r = 0; r < t.length; ++r) if (t[r] !== e[r]) return !1;
              return !0;
            })(this._fillGradientStops, t) ||
              ((this._fillGradientStops = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fontFamily", {
          get: function () {
            return this._fontFamily;
          },
          set: function (t) {
            this.fontFamily !== t && ((this._fontFamily = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fontSize", {
          get: function () {
            return this._fontSize;
          },
          set: function (t) {
            this._fontSize !== t && ((this._fontSize = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fontStyle", {
          get: function () {
            return this._fontStyle;
          },
          set: function (t) {
            this._fontStyle !== t && ((this._fontStyle = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fontVariant", {
          get: function () {
            return this._fontVariant;
          },
          set: function (t) {
            this._fontVariant !== t &&
              ((this._fontVariant = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fontWeight", {
          get: function () {
            return this._fontWeight;
          },
          set: function (t) {
            this._fontWeight !== t && ((this._fontWeight = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "letterSpacing", {
          get: function () {
            return this._letterSpacing;
          },
          set: function (t) {
            this._letterSpacing !== t &&
              ((this._letterSpacing = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "lineHeight", {
          get: function () {
            return this._lineHeight;
          },
          set: function (t) {
            this._lineHeight !== t && ((this._lineHeight = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "leading", {
          get: function () {
            return this._leading;
          },
          set: function (t) {
            this._leading !== t && ((this._leading = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "lineJoin", {
          get: function () {
            return this._lineJoin;
          },
          set: function (t) {
            this._lineJoin !== t && ((this._lineJoin = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "miterLimit", {
          get: function () {
            return this._miterLimit;
          },
          set: function (t) {
            this._miterLimit !== t && ((this._miterLimit = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "padding", {
          get: function () {
            return this._padding;
          },
          set: function (t) {
            this._padding !== t && ((this._padding = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "stroke", {
          get: function () {
            return this._stroke;
          },
          set: function (t) {
            var e = ah(t);
            this._stroke !== e && ((this._stroke = e), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "strokeThickness", {
          get: function () {
            return this._strokeThickness;
          },
          set: function (t) {
            this._strokeThickness !== t &&
              ((this._strokeThickness = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "textBaseline", {
          get: function () {
            return this._textBaseline;
          },
          set: function (t) {
            this._textBaseline !== t &&
              ((this._textBaseline = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "trim", {
          get: function () {
            return this._trim;
          },
          set: function (t) {
            this._trim !== t && ((this._trim = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "whiteSpace", {
          get: function () {
            return this._whiteSpace;
          },
          set: function (t) {
            this._whiteSpace !== t && ((this._whiteSpace = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "wordWrap", {
          get: function () {
            return this._wordWrap;
          },
          set: function (t) {
            this._wordWrap !== t && ((this._wordWrap = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "wordWrapWidth", {
          get: function () {
            return this._wordWrapWidth;
          },
          set: function (t) {
            this._wordWrapWidth !== t &&
              ((this._wordWrapWidth = t), this.styleID++);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.toFontString = function () {
          var t =
              "number" == typeof this.fontSize
                ? this.fontSize + "px"
                : this.fontSize,
            e = this.fontFamily;
          Array.isArray(this.fontFamily) || (e = this.fontFamily.split(","));
          for (var r = e.length - 1; r >= 0; r--) {
            var i = e[r].trim();
            !/([\"\'])[^\'\"]+\1/.test(i) &&
              nh.indexOf(i) < 0 &&
              (i = '"' + i + '"'),
              (e[r] = i);
          }
          return (
            this.fontStyle +
            " " +
            this.fontVariant +
            " " +
            this.fontWeight +
            " " +
            t +
            " " +
            e.join(",")
          );
        }),
        t
      );
    })();
  function sh(t) {
    return "number" == typeof t
      ? we(t)
      : ("string" == typeof t &&
          0 === t.indexOf("0x") &&
          (t = t.replace("0x", "#")),
        t);
  }
  function ah(t) {
    if (Array.isArray(t)) {
      for (var e = 0; e < t.length; ++e) t[e] = sh(t[e]);
      return t;
    }
    return sh(t);
  }
  function hh(t, e, r) {
    for (var i in r)
      Array.isArray(e[i]) ? (t[i] = e[i].slice()) : (t[i] = e[i]);
  }
  var uh = (function () {
      function t(t, e, r, i, n, o, s, a, h) {
        (this.text = t),
          (this.style = e),
          (this.width = r),
          (this.height = i),
          (this.lines = n),
          (this.lineWidths = o),
          (this.lineHeight = s),
          (this.maxLineWidth = a),
          (this.fontProperties = h);
      }
      return (
        (t.measureText = function (e, r, i, n) {
          void 0 === n && (n = t._canvas), (i = null == i ? r.wordWrap : i);
          var o = r.toFontString(),
            s = t.measureFont(o);
          0 === s.fontSize &&
            ((s.fontSize = r.fontSize), (s.ascent = r.fontSize));
          var a = n.getContext("2d");
          a.font = o;
          for (
            var h = (i ? t.wordWrap(e, r, n) : e).split(/(?:\r\n|\r|\n)/),
              u = new Array(h.length),
              l = 0,
              c = 0;
            c < h.length;
            c++
          ) {
            var d =
              a.measureText(h[c]).width + (h[c].length - 1) * r.letterSpacing;
            (u[c] = d), (l = Math.max(l, d));
          }
          var f = l + r.strokeThickness;
          r.dropShadow && (f += r.dropShadowDistance);
          var p = r.lineHeight || s.fontSize + r.strokeThickness,
            _ =
              Math.max(p, s.fontSize + r.strokeThickness) +
              (h.length - 1) * (p + r.leading);
          return (
            r.dropShadow && (_ += r.dropShadowDistance),
            new t(e, r, f, _, h, u, p + r.leading, l, s)
          );
        }),
        (t.wordWrap = function (e, r, i) {
          void 0 === i && (i = t._canvas);
          for (
            var n = i.getContext("2d"),
              o = 0,
              s = "",
              a = "",
              h = Object.create(null),
              u = r.letterSpacing,
              l = r.whiteSpace,
              c = t.collapseSpaces(l),
              d = t.collapseNewlines(l),
              f = !c,
              p = r.wordWrapWidth + u,
              _ = t.tokenize(e),
              v = 0;
            v < _.length;
            v++
          ) {
            var m = _[v];
            if (t.isNewline(m)) {
              if (!d) {
                (a += t.addLine(s)), (f = !c), (s = ""), (o = 0);
                continue;
              }
              m = " ";
            }
            if (c) {
              var E = t.isBreakingSpace(m),
                T = t.isBreakingSpace(s[s.length - 1]);
              if (E && T) continue;
            }
            var y = t.getFromCache(m, u, h, n);
            if (y > p)
              if (
                ("" !== s && ((a += t.addLine(s)), (s = ""), (o = 0)),
                t.canBreakWords(m, r.breakWords))
              )
                for (var g = t.wordWrapSplit(m), b = 0; b < g.length; b++) {
                  for (var R = g[b], A = 1; g[b + A]; ) {
                    var x = g[b + A],
                      S = R[R.length - 1];
                    if (t.canBreakChars(S, x, m, b, r.breakWords)) break;
                    (R += x), A++;
                  }
                  b += R.length - 1;
                  var O = t.getFromCache(R, u, h, n);
                  O + o > p &&
                    ((a += t.addLine(s)), (f = !1), (s = ""), (o = 0)),
                    (s += R),
                    (o += O);
                }
              else {
                s.length > 0 && ((a += t.addLine(s)), (s = ""), (o = 0));
                var I = v === _.length - 1;
                (a += t.addLine(m, !I)), (f = !1), (s = ""), (o = 0);
              }
            else
              y + o > p && ((f = !1), (a += t.addLine(s)), (s = ""), (o = 0)),
                (s.length > 0 || !t.isBreakingSpace(m) || f) &&
                  ((s += m), (o += y));
          }
          return (a += t.addLine(s, !1));
        }),
        (t.addLine = function (e, r) {
          return (
            void 0 === r && (r = !0),
            (e = t.trimRight(e)),
            (e = r ? e + "\n" : e)
          );
        }),
        (t.getFromCache = function (t, e, r, i) {
          var n = r[t];
          if ("number" != typeof n) {
            var o = t.length * e;
            (n = i.measureText(t).width + o), (r[t] = n);
          }
          return n;
        }),
        (t.collapseSpaces = function (t) {
          return "normal" === t || "pre-line" === t;
        }),
        (t.collapseNewlines = function (t) {
          return "normal" === t;
        }),
        (t.trimRight = function (e) {
          if ("string" != typeof e) return "";
          for (var r = e.length - 1; r >= 0; r--) {
            var i = e[r];
            if (!t.isBreakingSpace(i)) break;
            e = e.slice(0, -1);
          }
          return e;
        }),
        (t.isNewline = function (e) {
          return (
            "string" == typeof e && t._newlines.indexOf(e.charCodeAt(0)) >= 0
          );
        }),
        (t.isBreakingSpace = function (e, r) {
          return (
            "string" == typeof e &&
            t._breakingSpaces.indexOf(e.charCodeAt(0)) >= 0
          );
        }),
        (t.tokenize = function (e) {
          var r = [],
            i = "";
          if ("string" != typeof e) return r;
          for (var n = 0; n < e.length; n++) {
            var o = e[n],
              s = e[n + 1];
            t.isBreakingSpace(o, s) || t.isNewline(o)
              ? ("" !== i && (r.push(i), (i = "")), r.push(o))
              : (i += o);
          }
          return "" !== i && r.push(i), r;
        }),
        (t.canBreakWords = function (t, e) {
          return e;
        }),
        (t.canBreakChars = function (t, e, r, i, n) {
          return !0;
        }),
        (t.wordWrapSplit = function (t) {
          return t.split("");
        }),
        (t.measureFont = function (e) {
          if (t._fonts[e]) return t._fonts[e];
          var r = { ascent: 0, descent: 0, fontSize: 0 },
            i = t._canvas,
            n = t._context;
          n.font = e;
          var o = t.METRICS_STRING + t.BASELINE_SYMBOL,
            s = Math.ceil(n.measureText(o).width),
            a = Math.ceil(n.measureText(t.BASELINE_SYMBOL).width),
            h = Math.ceil(t.HEIGHT_MULTIPLIER * a);
          (a = (a * t.BASELINE_MULTIPLIER) | 0),
            (i.width = s),
            (i.height = h),
            (n.fillStyle = "#f00"),
            n.fillRect(0, 0, s, h),
            (n.font = e),
            (n.textBaseline = "alphabetic"),
            (n.fillStyle = "#000"),
            n.fillText(o, 0, a);
          var u = n.getImageData(0, 0, s, h).data,
            l = u.length,
            c = 4 * s,
            d = 0,
            f = 0,
            p = !1;
          for (d = 0; d < a; ++d) {
            for (var _ = 0; _ < c; _ += 4)
              if (255 !== u[f + _]) {
                p = !0;
                break;
              }
            if (p) break;
            f += c;
          }
          for (r.ascent = a - d, f = l - c, p = !1, d = h; d > a; --d) {
            for (_ = 0; _ < c; _ += 4)
              if (255 !== u[f + _]) {
                p = !0;
                break;
              }
            if (p) break;
            f -= c;
          }
          return (
            (r.descent = d - a),
            (r.fontSize = r.ascent + r.descent),
            (t._fonts[e] = r),
            r
          );
        }),
        (t.clearMetrics = function (e) {
          void 0 === e && (e = ""), e ? delete t._fonts[e] : (t._fonts = {});
        }),
        t
      );
    })(),
    lh = (function () {
      try {
        var t = new OffscreenCanvas(0, 0),
          e = t.getContext("2d");
        return e && e.measureText ? t : document.createElement("canvas");
      } catch (t) {
        return document.createElement("canvas");
      }
    })();
  (lh.width = lh.height = 10),
    (uh._canvas = lh),
    (uh._context = lh.getContext("2d")),
    (uh._fonts = {}),
    (uh.METRICS_STRING = "|ÉqÅ"),
    (uh.BASELINE_SYMBOL = "M"),
    (uh.BASELINE_MULTIPLIER = 1.4),
    (uh.HEIGHT_MULTIPLIER = 2),
    (uh._newlines = [10, 13]),
    (uh._breakingSpaces = [
      9, 32, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8200, 8201, 8202, 8287,
      12288,
    ]);
  var ch = { texture: !0, children: !1, baseTexture: !0 },
    dh = (function (e) {
      function r(t, r, i) {
        var n = this,
          o = !1;
        i || ((i = document.createElement("canvas")), (o = !0)),
          (i.width = 3),
          (i.height = 3);
        var s = Hi.from(i);
        return (
          (s.orig = new _r()),
          (s.trim = new _r()),
          ((n = e.call(this, s) || this)._ownCanvas = o),
          (n.canvas = i),
          (n.context = n.canvas.getContext("2d")),
          (n._resolution = bt.RESOLUTION),
          (n._autoResolution = !0),
          (n._text = null),
          (n._style = null),
          (n._styleListener = null),
          (n._font = ""),
          (n.text = t),
          (n.style = r),
          (n.localStyleID = -1),
          n
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          rh(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(r, e),
        (r.prototype.updateText = function (t) {
          var e = this._style;
          if (
            (this.localStyleID !== e.styleID &&
              ((this.dirty = !0), (this.localStyleID = e.styleID)),
            this.dirty || !t)
          ) {
            this._font = this._style.toFontString();
            var i,
              n,
              o = this.context,
              s = uh.measureText(
                this._text || " ",
                this._style,
                this._style.wordWrap,
                this.canvas
              ),
              a = s.width,
              h = s.height,
              u = s.lines,
              l = s.lineHeight,
              c = s.lineWidths,
              d = s.maxLineWidth,
              f = s.fontProperties;
            (this.canvas.width = Math.ceil(
              Math.ceil(Math.max(1, a) + 2 * e.padding) * this._resolution
            )),
              (this.canvas.height = Math.ceil(
                Math.ceil(Math.max(1, h) + 2 * e.padding) * this._resolution
              )),
              o.scale(this._resolution, this._resolution),
              o.clearRect(0, 0, this.canvas.width, this.canvas.height),
              (o.font = this._font),
              (o.lineWidth = e.strokeThickness),
              (o.textBaseline = e.textBaseline),
              (o.lineJoin = e.lineJoin),
              (o.miterLimit = e.miterLimit);
            for (var p = e.dropShadow ? 2 : 1, _ = 0; _ < p; ++_) {
              var v = e.dropShadow && 0 === _,
                m = v ? Math.ceil(Math.max(1, h) + 2 * e.padding) : 0,
                E = m * this._resolution;
              if (v) {
                (o.fillStyle = "black"), (o.strokeStyle = "black");
                var T = e.dropShadowColor,
                  y = Ce("number" == typeof T ? T : Le(T)),
                  g = e.dropShadowBlur * this._resolution,
                  b = e.dropShadowDistance * this._resolution;
                (o.shadowColor =
                  "rgba(" +
                  255 * y[0] +
                  "," +
                  255 * y[1] +
                  "," +
                  255 * y[2] +
                  "," +
                  e.dropShadowAlpha +
                  ")"),
                  (o.shadowBlur = g),
                  (o.shadowOffsetX = Math.cos(e.dropShadowAngle) * b),
                  (o.shadowOffsetY = Math.sin(e.dropShadowAngle) * b + E);
              } else
                (o.fillStyle = this._generateFillStyle(e, u, s)),
                  (o.strokeStyle = e.stroke),
                  (o.shadowColor = "black"),
                  (o.shadowBlur = 0),
                  (o.shadowOffsetX = 0),
                  (o.shadowOffsetY = 0);
              var R = (l - f.fontSize) / 2;
              (!r.nextLineHeightBehavior || l - f.fontSize < 0) && (R = 0);
              for (var A = 0; A < u.length; A++)
                (i = e.strokeThickness / 2),
                  (n = e.strokeThickness / 2 + A * l + f.ascent + R),
                  "right" === e.align
                    ? (i += d - c[A])
                    : "center" === e.align && (i += (d - c[A]) / 2),
                  e.stroke &&
                    e.strokeThickness &&
                    this.drawLetterSpacing(
                      u[A],
                      i + e.padding,
                      n + e.padding - m,
                      !0
                    ),
                  e.fill &&
                    this.drawLetterSpacing(
                      u[A],
                      i + e.padding,
                      n + e.padding - m
                    );
            }
            this.updateTexture();
          }
        }),
        (r.prototype.drawLetterSpacing = function (t, e, i, n) {
          void 0 === n && (n = !1);
          var o = this._style.letterSpacing,
            s =
              r.experimentalLetterSpacing &&
              ("letterSpacing" in CanvasRenderingContext2D.prototype ||
                "textLetterSpacing" in CanvasRenderingContext2D.prototype);
          if (0 === o || s)
            return (
              s &&
                ((this.context.letterSpacing = o),
                (this.context.textLetterSpacing = o)),
              void (n
                ? this.context.strokeText(t, e, i)
                : this.context.fillText(t, e, i))
            );
          for (
            var a = e,
              h = Array.from ? Array.from(t) : t.split(""),
              u = this.context.measureText(t).width,
              l = 0,
              c = 0;
            c < h.length;
            ++c
          ) {
            var d = h[c];
            n
              ? this.context.strokeText(d, a, i)
              : this.context.fillText(d, a, i);
            for (var f = "", p = c + 1; p < h.length; ++p) f += h[p];
            (a += u - (l = this.context.measureText(f).width) + o), (u = l);
          }
        }),
        (r.prototype.updateTexture = function () {
          var t = this.canvas;
          if (this._style.trim) {
            var e = ir(t);
            e.data &&
              ((t.width = e.width),
              (t.height = e.height),
              this.context.putImageData(e.data, 0, 0));
          }
          var r = this._texture,
            i = this._style,
            n = i.trim ? 0 : i.padding,
            o = r.baseTexture;
          (r.trim.width = r._frame.width = t.width / this._resolution),
            (r.trim.height = r._frame.height = t.height / this._resolution),
            (r.trim.x = -n),
            (r.trim.y = -n),
            (r.orig.width = r._frame.width - 2 * n),
            (r.orig.height = r._frame.height - 2 * n),
            this._onTextureUpdate(),
            o.setRealSize(t.width, t.height, this._resolution),
            r.updateUvs(),
            this._recursivePostUpdateTransform(),
            (this.dirty = !1);
        }),
        (r.prototype._render = function (t) {
          this._autoResolution &&
            this._resolution !== t.resolution &&
            ((this._resolution = t.resolution), (this.dirty = !0)),
            this.updateText(!0),
            e.prototype._render.call(this, t);
        }),
        (r.prototype.getLocalBounds = function (t) {
          return this.updateText(!0), e.prototype.getLocalBounds.call(this, t);
        }),
        (r.prototype._calculateBounds = function () {
          this.updateText(!0),
            this.calculateVertices(),
            this._bounds.addQuad(this.vertexData);
        }),
        (r.prototype._generateFillStyle = function (e, r, i) {
          var n,
            o = e.fill;
          if (!Array.isArray(o)) return o;
          if (1 === o.length) return o[0];
          var s = e.dropShadow ? e.dropShadowDistance : 0,
            a = e.padding || 0,
            h = this.canvas.width / this._resolution - s - 2 * a,
            u = this.canvas.height / this._resolution - s - 2 * a,
            l = o.slice(),
            c = e.fillGradientStops.slice();
          if (!c.length)
            for (var d = l.length + 1, f = 1; f < d; ++f) c.push(f / d);
          if (
            (l.unshift(o[0]),
            c.unshift(0),
            l.push(o[o.length - 1]),
            c.push(1),
            e.fillGradientType === t.TEXT_GRADIENT.LINEAR_VERTICAL)
          ) {
            n = this.context.createLinearGradient(h / 2, a, h / 2, u + a);
            var p = i.fontProperties.fontSize + e.strokeThickness;
            for (f = 0; f < r.length; f++) {
              var _ = i.lineHeight * (f - 1) + p,
                v = i.lineHeight * f,
                m = v;
              f > 0 && _ > v && (m = (v + _) / 2);
              var E = v + p,
                T = i.lineHeight * (f + 1),
                y = E;
              f + 1 < r.length && T < E && (y = (E + T) / 2);
              for (var g = (y - m) / u, b = 0; b < l.length; b++) {
                var R = 0;
                R = "number" == typeof c[b] ? c[b] : b / l.length;
                var A = Math.min(1, Math.max(0, m / u + R * g));
                (A = Number(A.toFixed(5))), n.addColorStop(A, l[b]);
              }
            }
          } else {
            n = this.context.createLinearGradient(a, u / 2, h + a, u / 2);
            var x = l.length + 1,
              S = 1;
            for (f = 0; f < l.length; f++) {
              var O = void 0;
              (O = "number" == typeof c[f] ? c[f] : S / x),
                n.addColorStop(O, l[f]),
                S++;
            }
          }
          return n;
        }),
        (r.prototype.destroy = function (t) {
          "boolean" == typeof t && (t = { children: t }),
            (t = Object.assign({}, ch, t)),
            e.prototype.destroy.call(this, t),
            this._ownCanvas && (this.canvas.height = this.canvas.width = 0),
            (this.context = null),
            (this.canvas = null),
            (this._style = null);
        }),
        Object.defineProperty(r.prototype, "width", {
          get: function () {
            return (
              this.updateText(!0),
              Math.abs(this.scale.x) * this._texture.orig.width
            );
          },
          set: function (t) {
            this.updateText(!0);
            var e = qe(this.scale.x) || 1;
            (this.scale.x = (e * t) / this._texture.orig.width),
              (this._width = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "height", {
          get: function () {
            return (
              this.updateText(!0),
              Math.abs(this.scale.y) * this._texture.orig.height
            );
          },
          set: function (t) {
            this.updateText(!0);
            var e = qe(this.scale.y) || 1;
            (this.scale.y = (e * t) / this._texture.orig.height),
              (this._height = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "style", {
          get: function () {
            return this._style;
          },
          set: function (t) {
            (t = t || {}),
              (this._style = t instanceof oh ? t : new oh(t)),
              (this.localStyleID = -1),
              (this.dirty = !0);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "text", {
          get: function () {
            return this._text;
          },
          set: function (t) {
            (t = String(null == t ? "" : t)),
              this._text !== t && ((this._text = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "resolution", {
          get: function () {
            return this._resolution;
          },
          set: function (t) {
            (this._autoResolution = !1),
              this._resolution !== t &&
                ((this._resolution = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.nextLineHeightBehavior = !1),
        (r.experimentalLetterSpacing = !1),
        r
      );
    })(eh);
  /*!
   * @pixi/prepare - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/prepare is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  bt.UPLOADS_PER_FRAME = 4;
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */ var fh =
    function (t, e) {
      return (
        (fh =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        fh(t, e)
      );
    };
  var ph = (function () {
    function t(t) {
      (this.maxItemsPerFrame = t), (this.itemsLeft = 0);
    }
    return (
      (t.prototype.beginFrame = function () {
        this.itemsLeft = this.maxItemsPerFrame;
      }),
      (t.prototype.allowedToUpload = function () {
        return this.itemsLeft-- > 0;
      }),
      t
    );
  })();
  function _h(t, e) {
    var r = !1;
    if (t && t._textures && t._textures.length)
      for (var i = 0; i < t._textures.length; i++)
        if (t._textures[i] instanceof Hi) {
          var n = t._textures[i].baseTexture;
          -1 === e.indexOf(n) && (e.push(n), (r = !0));
        }
    return r;
  }
  function vh(t, e) {
    if (t.baseTexture instanceof Si) {
      var r = t.baseTexture;
      return -1 === e.indexOf(r) && e.push(r), !0;
    }
    return !1;
  }
  function mh(t, e) {
    if (t._texture && t._texture instanceof Hi) {
      var r = t._texture.baseTexture;
      return -1 === e.indexOf(r) && e.push(r), !0;
    }
    return !1;
  }
  function Eh(t, e) {
    return e instanceof dh && (e.updateText(!0), !0);
  }
  function Th(t, e) {
    if (e instanceof oh) {
      var r = e.toFontString();
      return uh.measureFont(r), !0;
    }
    return !1;
  }
  function yh(t, e) {
    if (t instanceof dh) {
      -1 === e.indexOf(t.style) && e.push(t.style),
        -1 === e.indexOf(t) && e.push(t);
      var r = t._texture.baseTexture;
      return -1 === e.indexOf(r) && e.push(r), !0;
    }
    return !1;
  }
  function gh(t, e) {
    return t instanceof oh && (-1 === e.indexOf(t) && e.push(t), !0);
  }
  var bh = (function () {
    function e(t) {
      var e = this;
      (this.limiter = new ph(bt.UPLOADS_PER_FRAME)),
        (this.renderer = t),
        (this.uploadHookHelper = null),
        (this.queue = []),
        (this.addHooks = []),
        (this.uploadHooks = []),
        (this.completes = []),
        (this.ticking = !1),
        (this.delayedTick = function () {
          e.queue && e.prepareItems();
        }),
        this.registerFindHook(yh),
        this.registerFindHook(gh),
        this.registerFindHook(_h),
        this.registerFindHook(vh),
        this.registerFindHook(mh),
        this.registerUploadHook(Eh),
        this.registerUploadHook(Th);
    }
    return (
      (e.prototype.upload = function (e, r) {
        "function" == typeof e && ((r = e), (e = null)),
          e && this.add(e),
          this.queue.length
            ? (r && this.completes.push(r),
              this.ticking ||
                ((this.ticking = !0),
                ai.system.addOnce(this.tick, this, t.UPDATE_PRIORITY.UTILITY)))
            : r && r();
      }),
      (e.prototype.tick = function () {
        setTimeout(this.delayedTick, 0);
      }),
      (e.prototype.prepareItems = function () {
        for (
          this.limiter.beginFrame();
          this.queue.length && this.limiter.allowedToUpload();

        ) {
          var e = this.queue[0],
            r = !1;
          if (e && !e._destroyed)
            for (var i = 0, n = this.uploadHooks.length; i < n; i++)
              if (this.uploadHooks[i](this.uploadHookHelper, e)) {
                this.queue.shift(), (r = !0);
                break;
              }
          r || this.queue.shift();
        }
        if (this.queue.length)
          ai.system.addOnce(this.tick, this, t.UPDATE_PRIORITY.UTILITY);
        else {
          this.ticking = !1;
          var o = this.completes.slice(0);
          this.completes.length = 0;
          for (i = 0, n = o.length; i < n; i++) o[i]();
        }
      }),
      (e.prototype.registerFindHook = function (t) {
        return t && this.addHooks.push(t), this;
      }),
      (e.prototype.registerUploadHook = function (t) {
        return t && this.uploadHooks.push(t), this;
      }),
      (e.prototype.add = function (t) {
        for (
          var e = 0, r = this.addHooks.length;
          e < r && !this.addHooks[e](t, this.queue);
          e++
        );
        if (t instanceof ri)
          for (e = t.children.length - 1; e >= 0; e--) this.add(t.children[e]);
        return this;
      }),
      (e.prototype.destroy = function () {
        this.ticking && ai.system.remove(this.tick, this),
          (this.ticking = !1),
          (this.addHooks = null),
          (this.uploadHooks = null),
          (this.renderer = null),
          (this.completes = null),
          (this.queue = null),
          (this.limiter = null),
          (this.uploadHookHelper = null);
      }),
      e
    );
  })();
  function Rh(t, e) {
    return (
      e instanceof Si && (e._glTextures[t.CONTEXT_UID] || t.texture.bind(e), !0)
    );
  }
  function Ah(t, e) {
    if (!(e instanceof Ka)) return !1;
    var r = e.geometry;
    e.finishPoly(), r.updateBatches();
    for (var i = r.batches, n = 0; n < i.length; n++) {
      var o = i[n].style.texture;
      o && Rh(t, o.baseTexture);
    }
    return r.batchable || t.geometry.bind(r, e._resolveDirectShader(t)), !0;
  }
  function xh(t, e) {
    return t instanceof Ka && (e.push(t), !0);
  }
  var Sh = (function (t) {
      function e(e) {
        var r = t.call(this, e) || this;
        return (
          (r.uploadHookHelper = r.renderer),
          r.registerFindHook(xh),
          r.registerUploadHook(Rh),
          r.registerUploadHook(Ah),
          r
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          fh(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(e, t),
        e
      );
    })(bh),
    Oh = (function () {
      function t(t) {
        (this.maxMilliseconds = t), (this.frameStart = 0);
      }
      return (
        (t.prototype.beginFrame = function () {
          this.frameStart = Date.now();
        }),
        (t.prototype.allowedToUpload = function () {
          return Date.now() - this.frameStart < this.maxMilliseconds;
        }),
        t
      );
    })(),
    Ih = (function () {
      function t(t, e, r) {
        void 0 === r && (r = null),
          (this._texture = t instanceof Hi ? t : null),
          (this.baseTexture = t instanceof Si ? t : this._texture.baseTexture),
          (this.textures = {}),
          (this.animations = {}),
          (this.data = e);
        var i = this.baseTexture.resource;
        (this.resolution = this._updateResolution(r || (i ? i.url : null))),
          (this._frames = this.data.frames),
          (this._frameKeys = Object.keys(this._frames)),
          (this._batchIndex = 0),
          (this._callback = null);
      }
      return (
        (t.prototype._updateResolution = function (t) {
          void 0 === t && (t = null);
          var e = this.data.meta.scale,
            r = ar(t, null);
          return (
            null === r && (r = void 0 !== e ? parseFloat(e) : 1),
            1 !== r && this.baseTexture.setResolution(r),
            r
          );
        }),
        (t.prototype.parse = function (e) {
          (this._batchIndex = 0),
            (this._callback = e),
            this._frameKeys.length <= t.BATCH_SIZE
              ? (this._processFrames(0),
                this._processAnimations(),
                this._parseComplete())
              : this._nextBatch();
        }),
        (t.prototype._processFrames = function (e) {
          for (
            var r = e, i = t.BATCH_SIZE;
            r - e < i && r < this._frameKeys.length;

          ) {
            var n = this._frameKeys[r],
              o = this._frames[n],
              s = o.frame;
            if (s) {
              var a = null,
                h = null,
                u = !1 !== o.trimmed && o.sourceSize ? o.sourceSize : o.frame,
                l = new _r(
                  0,
                  0,
                  Math.floor(u.w) / this.resolution,
                  Math.floor(u.h) / this.resolution
                );
              (a = o.rotated
                ? new _r(
                    Math.floor(s.x) / this.resolution,
                    Math.floor(s.y) / this.resolution,
                    Math.floor(s.h) / this.resolution,
                    Math.floor(s.w) / this.resolution
                  )
                : new _r(
                    Math.floor(s.x) / this.resolution,
                    Math.floor(s.y) / this.resolution,
                    Math.floor(s.w) / this.resolution,
                    Math.floor(s.h) / this.resolution
                  )),
                !1 !== o.trimmed &&
                  o.spriteSourceSize &&
                  (h = new _r(
                    Math.floor(o.spriteSourceSize.x) / this.resolution,
                    Math.floor(o.spriteSourceSize.y) / this.resolution,
                    Math.floor(s.w) / this.resolution,
                    Math.floor(s.h) / this.resolution
                  )),
                (this.textures[n] = new Hi(
                  this.baseTexture,
                  a,
                  l,
                  h,
                  o.rotated ? 2 : 0,
                  o.anchor
                )),
                Hi.addToCache(this.textures[n], n);
            }
            r++;
          }
        }),
        (t.prototype._processAnimations = function () {
          var t = this.data.animations || {};
          for (var e in t) {
            this.animations[e] = [];
            for (var r = 0; r < t[e].length; r++) {
              var i = t[e][r];
              this.animations[e].push(this.textures[i]);
            }
          }
        }),
        (t.prototype._parseComplete = function () {
          var t = this._callback;
          (this._callback = null),
            (this._batchIndex = 0),
            t.call(this, this.textures);
        }),
        (t.prototype._nextBatch = function () {
          var e = this;
          this._processFrames(this._batchIndex * t.BATCH_SIZE),
            this._batchIndex++,
            setTimeout(function () {
              e._batchIndex * t.BATCH_SIZE < e._frameKeys.length
                ? e._nextBatch()
                : (e._processAnimations(), e._parseComplete());
            }, 0);
        }),
        (t.prototype.destroy = function (t) {
          var e;
          for (var r in (void 0 === t && (t = !1), this.textures))
            this.textures[r].destroy();
          (this._frames = null),
            (this._frameKeys = null),
            (this.data = null),
            (this.textures = null),
            t &&
              (null === (e = this._texture) || void 0 === e || e.destroy(),
              this.baseTexture.destroy()),
            (this._texture = null),
            (this.baseTexture = null);
        }),
        (t.BATCH_SIZE = 1e3),
        t
      );
    })(),
    Ph = (function () {
      function e() {}
      return (
        (e.use = function (r, i) {
          var n,
            o,
            s = this,
            a = r.name + "_image";
          if (
            r.data &&
            r.type === t.LoaderResource.TYPE.JSON &&
            r.data.frames &&
            !s.resources[a]
          ) {
            var h =
              null ===
                (o = null === (n = r.data) || void 0 === n ? void 0 : n.meta) ||
              void 0 === o
                ? void 0
                : o.related_multi_packs;
            if (Array.isArray(h))
              for (
                var u = function (e) {
                    if ("string" != typeof e) return "continue";
                    var i = e.replace(".json", ""),
                      n = Oe.resolve(r.url.replace(s.baseUrl, ""), e);
                    if (
                      s.resources[i] ||
                      Object.values(s.resources).some(function (t) {
                        return Oe.format(Oe.parse(t.url)) === n;
                      })
                    )
                      return "continue";
                    var o = {
                      crossOrigin: r.crossOrigin,
                      loadType: t.LoaderResource.LOAD_TYPE.XHR,
                      xhrType: t.LoaderResource.XHR_RESPONSE_TYPE.JSON,
                      parentResource: r,
                      metadata: r.metadata,
                    };
                    s.add(i, n, o);
                  },
                  l = 0,
                  c = h;
                l < c.length;
                l++
              ) {
                u(c[l]);
              }
            var d = {
                crossOrigin: r.crossOrigin,
                metadata: r.metadata.imageMetadata,
                parentResource: r,
              },
              f = e.getResourcePath(r, s.baseUrl);
            s.add(a, f, d, function (t) {
              if (t.error) i(t.error);
              else {
                var e = new Ih(t.texture, r.data, r.url);
                e.parse(function () {
                  (r.spritesheet = e), (r.textures = e.textures), i();
                });
              }
            });
          } else i();
        }),
        (e.getResourcePath = function (t, e) {
          return t.isDataUrl
            ? t.data.meta.image
            : Oe.resolve(t.url.replace(e, ""), t.data.meta.image);
        }),
        e
      );
    })(),
    Mh = function (t, e) {
      return (
        (Mh =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Mh(t, e)
      );
    };
  function Nh(t, e) {
    function r() {
      this.constructor = t;
    }
    Mh(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var Dh = new fr(),
    Ch = (function (t) {
      function e(e, r, i) {
        void 0 === r && (r = 100), void 0 === i && (i = 100);
        var n = t.call(this, e) || this;
        return (
          (n.tileTransform = new Mr()),
          (n._width = r),
          (n._height = i),
          (n.uvMatrix = n.texture.uvMatrix || new zn(e)),
          (n.pluginName = "tilingSprite"),
          (n.uvRespectAnchor = !1),
          n
        );
      }
      return (
        Nh(e, t),
        Object.defineProperty(e.prototype, "clampMargin", {
          get: function () {
            return this.uvMatrix.clampMargin;
          },
          set: function (t) {
            (this.uvMatrix.clampMargin = t), this.uvMatrix.update(!0);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "tileScale", {
          get: function () {
            return this.tileTransform.scale;
          },
          set: function (t) {
            this.tileTransform.scale.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "tilePosition", {
          get: function () {
            return this.tileTransform.position;
          },
          set: function (t) {
            this.tileTransform.position.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype._onTextureUpdate = function () {
          this.uvMatrix && (this.uvMatrix.texture = this._texture),
            (this._cachedTint = 16777215);
        }),
        (e.prototype._render = function (t) {
          var e = this._texture;
          e &&
            e.valid &&
            (this.tileTransform.updateLocalTransform(),
            this.uvMatrix.update(),
            t.batch.setObjectRenderer(t.plugins[this.pluginName]),
            t.plugins[this.pluginName].render(this));
        }),
        (e.prototype._calculateBounds = function () {
          var t = this._width * -this._anchor._x,
            e = this._height * -this._anchor._y,
            r = this._width * (1 - this._anchor._x),
            i = this._height * (1 - this._anchor._y);
          this._bounds.addFrame(this.transform, t, e, r, i);
        }),
        (e.prototype.getLocalBounds = function (e) {
          return 0 === this.children.length
            ? ((this._bounds.minX = this._width * -this._anchor._x),
              (this._bounds.minY = this._height * -this._anchor._y),
              (this._bounds.maxX = this._width * (1 - this._anchor._x)),
              (this._bounds.maxY = this._height * (1 - this._anchor._y)),
              e ||
                (this._localBoundsRect || (this._localBoundsRect = new _r()),
                (e = this._localBoundsRect)),
              this._bounds.getRectangle(e))
            : t.prototype.getLocalBounds.call(this, e);
        }),
        (e.prototype.containsPoint = function (t) {
          this.worldTransform.applyInverse(t, Dh);
          var e = this._width,
            r = this._height,
            i = -e * this.anchor._x;
          if (Dh.x >= i && Dh.x < i + e) {
            var n = -r * this.anchor._y;
            if (Dh.y >= n && Dh.y < n + r) return !0;
          }
          return !1;
        }),
        (e.prototype.destroy = function (e) {
          t.prototype.destroy.call(this, e),
            (this.tileTransform = null),
            (this.uvMatrix = null);
        }),
        (e.from = function (t, r) {
          return new e(t instanceof Hi ? t : Hi.from(t, r), r.width, r.height);
        }),
        Object.defineProperty(e.prototype, "width", {
          get: function () {
            return this._width;
          },
          set: function (t) {
            this._width = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "height", {
          get: function () {
            return this._height;
          },
          set: function (t) {
            this._height = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(eh),
    wh =
      "#version 100\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n",
    Lh = new gr(),
    Fh = (function (e) {
      function r(t) {
        var r = e.call(this, t) || this;
        return (
          t.runners.contextChange.add(r),
          (r.quad = new en()),
          (r.state = jn.for2d()),
          r
        );
      }
      return (
        Nh(r, e),
        (r.prototype.contextChange = function () {
          var t = this.renderer,
            e = { globals: t.globalUniforms };
          (this.simpleShader = Yn.from(
            wh,
            "#version 100\n#define SHADER_NAME Tiling-Sprite-Simple-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 texSample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = texSample * uColor;\n}\n",
            e
          )),
            (this.shader =
              t.context.webGLVersion > 1
                ? Yn.from(
                    "#version 300 es\n#define SHADER_NAME Tiling-Sprite-300\n\nprecision lowp float;\n\nin vec2 aVertexPosition;\nin vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nout vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n",
                    "#version 300 es\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nin vec2 vTextureCoord;\n\nout vec4 fragmentColor;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0\n\n    fragmentColor = texSample * uColor;\n}\n",
                    e
                  )
                : Yn.from(
                    wh,
                    "#version 100\n#ifdef GL_EXT_shader_texture_lod\n    #extension GL_EXT_shader_texture_lod : enable\n#endif\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    #ifdef GL_EXT_shader_texture_lod\n        vec4 texSample = unclamped == coord\n            ? texture2D(uSampler, coord) \n            : texture2DLodEXT(uSampler, coord, 0);\n    #else\n        vec4 texSample = texture2D(uSampler, coord);\n    #endif\n\n    gl_FragColor = texSample * uColor;\n}\n",
                    e
                  ));
        }),
        (r.prototype.render = function (e) {
          var r = this.renderer,
            i = this.quad,
            n = i.vertices;
          (n[0] = n[6] = e._width * -e.anchor.x),
            (n[1] = n[3] = e._height * -e.anchor.y),
            (n[2] = n[4] = e._width * (1 - e.anchor.x)),
            (n[5] = n[7] = e._height * (1 - e.anchor.y));
          var o = e.uvRespectAnchor ? e.anchor.x : 0,
            s = e.uvRespectAnchor ? e.anchor.y : 0;
          ((n = i.uvs)[0] = n[6] = -o),
            (n[1] = n[3] = -s),
            (n[2] = n[4] = 1 - o),
            (n[5] = n[7] = 1 - s),
            i.invalidate();
          var a = e._texture,
            h = a.baseTexture,
            u = e.tileTransform.localTransform,
            l = e.uvMatrix,
            c =
              h.isPowerOfTwo &&
              a.frame.width === h.width &&
              a.frame.height === h.height;
          c &&
            (h._glTextures[r.CONTEXT_UID]
              ? (c = h.wrapMode !== t.WRAP_MODES.CLAMP)
              : h.wrapMode === t.WRAP_MODES.CLAMP &&
                (h.wrapMode = t.WRAP_MODES.REPEAT));
          var d = c ? this.simpleShader : this.shader,
            f = a.width,
            p = a.height,
            _ = e._width,
            v = e._height;
          Lh.set(
            (u.a * f) / _,
            (u.b * f) / v,
            (u.c * p) / _,
            (u.d * p) / v,
            u.tx / _,
            u.ty / v
          ),
            Lh.invert(),
            c
              ? Lh.prepend(l.mapCoord)
              : ((d.uniforms.uMapCoord = l.mapCoord.toArray(!0)),
                (d.uniforms.uClampFrame = l.uClampFrame),
                (d.uniforms.uClampOffset = l.uClampOffset)),
            (d.uniforms.uTransform = Lh.toArray(!0)),
            (d.uniforms.uColor = Xe(
              e.tint,
              e.worldAlpha,
              d.uniforms.uColor,
              h.alphaMode
            )),
            (d.uniforms.translationMatrix = e.transform.worldTransform.toArray(
              !0
            )),
            (d.uniforms.uSampler = a),
            r.shader.bind(d),
            r.geometry.bind(i),
            (this.state.blendMode = Ue(e.blendMode, h.alphaMode)),
            r.state.set(this.state),
            r.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
        }),
        r
      );
    })(un),
    Uh = function (t, e) {
      return (
        (Uh =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Uh(t, e)
      );
    };
  function Bh(t, e) {
    function r() {
      this.constructor = t;
    }
    Uh(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var Gh = (function () {
      function t(t, e) {
        (this.uvBuffer = t),
          (this.uvMatrix = e),
          (this.data = null),
          (this._bufferUpdateId = -1),
          (this._textureUpdateId = -1),
          (this._updateID = 0);
      }
      return (
        (t.prototype.update = function (t) {
          if (
            t ||
            this._bufferUpdateId !== this.uvBuffer._updateID ||
            this._textureUpdateId !== this.uvMatrix._updateID
          ) {
            (this._bufferUpdateId = this.uvBuffer._updateID),
              (this._textureUpdateId = this.uvMatrix._updateID);
            var e = this.uvBuffer.data;
            (this.data && this.data.length === e.length) ||
              (this.data = new Float32Array(e.length)),
              this.uvMatrix.multiplyUvs(e, this.data),
              this._updateID++;
          }
        }),
        t
      );
    })(),
    Xh = new fr(),
    kh = new Er(),
    Hh = (function (e) {
      function r(r, i, n, o) {
        void 0 === o && (o = t.DRAW_MODES.TRIANGLES);
        var s = e.call(this) || this;
        return (
          (s.geometry = r),
          (s.shader = i),
          (s.state = n || jn.for2d()),
          (s.drawMode = o),
          (s.start = 0),
          (s.size = 0),
          (s.uvs = null),
          (s.indices = null),
          (s.vertexData = new Float32Array(1)),
          (s.vertexDirty = -1),
          (s._transformID = -1),
          (s._roundPixels = bt.ROUND_PIXELS),
          (s.batchUvs = null),
          s
        );
      }
      return (
        Bh(r, e),
        Object.defineProperty(r.prototype, "geometry", {
          get: function () {
            return this._geometry;
          },
          set: function (t) {
            this._geometry !== t &&
              (this._geometry &&
                (this._geometry.refCount--,
                0 === this._geometry.refCount && this._geometry.dispose()),
              (this._geometry = t),
              this._geometry && this._geometry.refCount++,
              (this.vertexDirty = -1));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "uvBuffer", {
          get: function () {
            return this.geometry.buffers[1];
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "verticesBuffer", {
          get: function () {
            return this.geometry.buffers[0];
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "material", {
          get: function () {
            return this.shader;
          },
          set: function (t) {
            this.shader = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "blendMode", {
          get: function () {
            return this.state.blendMode;
          },
          set: function (t) {
            this.state.blendMode = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "roundPixels", {
          get: function () {
            return this._roundPixels;
          },
          set: function (t) {
            this._roundPixels !== t && (this._transformID = -1),
              (this._roundPixels = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "tint", {
          get: function () {
            return "tint" in this.shader ? this.shader.tint : null;
          },
          set: function (t) {
            this.shader.tint = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "texture", {
          get: function () {
            return "texture" in this.shader ? this.shader.texture : null;
          },
          set: function (t) {
            this.shader.texture = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype._render = function (e) {
          var i = this.geometry.buffers[0].data;
          this.shader.batchable &&
          this.drawMode === t.DRAW_MODES.TRIANGLES &&
          i.length < 2 * r.BATCHABLE_SIZE
            ? this._renderToBatch(e)
            : this._renderDefault(e);
        }),
        (r.prototype._renderDefault = function (t) {
          var e = this.shader;
          (e.alpha = this.worldAlpha),
            e.update && e.update(),
            t.batch.flush(),
            (e.uniforms.translationMatrix =
              this.transform.worldTransform.toArray(!0)),
            t.shader.bind(e),
            t.state.set(this.state),
            t.geometry.bind(this.geometry, e),
            t.geometry.draw(
              this.drawMode,
              this.size,
              this.start,
              this.geometry.instanceCount
            );
        }),
        (r.prototype._renderToBatch = function (t) {
          var e = this.geometry,
            r = this.shader;
          r.uvMatrix && (r.uvMatrix.update(), this.calculateUvs()),
            this.calculateVertices(),
            (this.indices = e.indexBuffer.data),
            (this._tintRGB = r._tintRGB),
            (this._texture = r.texture);
          var i = this.material.pluginName;
          t.batch.setObjectRenderer(t.plugins[i]), t.plugins[i].render(this);
        }),
        (r.prototype.calculateVertices = function () {
          var t = this.geometry.buffers[0],
            e = t.data,
            r = t._updateID;
          if (
            r !== this.vertexDirty ||
            this._transformID !== this.transform._worldID
          ) {
            (this._transformID = this.transform._worldID),
              this.vertexData.length !== e.length &&
                (this.vertexData = new Float32Array(e.length));
            for (
              var i = this.transform.worldTransform,
                n = i.a,
                o = i.b,
                s = i.c,
                a = i.d,
                h = i.tx,
                u = i.ty,
                l = this.vertexData,
                c = 0;
              c < l.length / 2;
              c++
            ) {
              var d = e[2 * c],
                f = e[2 * c + 1];
              (l[2 * c] = n * d + s * f + h),
                (l[2 * c + 1] = o * d + a * f + u);
            }
            if (this._roundPixels) {
              var p = bt.RESOLUTION;
              for (c = 0; c < l.length; ++c)
                l[c] = Math.round(((l[c] * p) | 0) / p);
            }
            this.vertexDirty = r;
          }
        }),
        (r.prototype.calculateUvs = function () {
          var t = this.geometry.buffers[1],
            e = this.shader;
          e.uvMatrix.isSimple
            ? (this.uvs = t.data)
            : (this.batchUvs || (this.batchUvs = new Gh(t, e.uvMatrix)),
              this.batchUvs.update(),
              (this.uvs = this.batchUvs.data));
        }),
        (r.prototype._calculateBounds = function () {
          this.calculateVertices(),
            this._bounds.addVertexData(
              this.vertexData,
              0,
              this.vertexData.length
            );
        }),
        (r.prototype.containsPoint = function (t) {
          if (!this.getBounds().contains(t.x, t.y)) return !1;
          this.worldTransform.applyInverse(t, Xh);
          for (
            var e = this.geometry.getBuffer("aVertexPosition").data,
              r = kh.points,
              i = this.geometry.getIndex().data,
              n = i.length,
              o = 4 === this.drawMode ? 3 : 1,
              s = 0;
            s + 2 < n;
            s += o
          ) {
            var a = 2 * i[s],
              h = 2 * i[s + 1],
              u = 2 * i[s + 2];
            if (
              ((r[0] = e[a]),
              (r[1] = e[a + 1]),
              (r[2] = e[h]),
              (r[3] = e[h + 1]),
              (r[4] = e[u]),
              (r[5] = e[u + 1]),
              kh.contains(Xh.x, Xh.y))
            )
              return !0;
          }
          return !1;
        }),
        (r.prototype.destroy = function (t) {
          e.prototype.destroy.call(this, t),
            this._cachedTexture &&
              (this._cachedTexture.destroy(), (this._cachedTexture = null)),
            (this.geometry = null),
            (this.shader = null),
            (this.state = null),
            (this.uvs = null),
            (this.indices = null),
            (this.vertexData = null);
        }),
        (r.BATCHABLE_SIZE = 100),
        r
      );
    })(ri),
    Yh = (function (t) {
      function e(e, r) {
        var i = this,
          n = {
            uSampler: e,
            alpha: 1,
            uTextureMatrix: gr.IDENTITY,
            uColor: new Float32Array([1, 1, 1, 1]),
          };
        return (
          (r = Object.assign(
            { tint: 16777215, alpha: 1, pluginName: "batch" },
            r
          )).uniforms && Object.assign(n, r.uniforms),
          ((i =
            t.call(
              this,
              r.program ||
                Hn.from(
                  "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n",
                  "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n"
                ),
              n
            ) || this)._colorDirty = !1),
          (i.uvMatrix = new zn(e)),
          (i.batchable = void 0 === r.program),
          (i.pluginName = r.pluginName),
          (i.tint = r.tint),
          (i.alpha = r.alpha),
          i
        );
      }
      return (
        Bh(e, t),
        Object.defineProperty(e.prototype, "texture", {
          get: function () {
            return this.uniforms.uSampler;
          },
          set: function (t) {
            this.uniforms.uSampler !== t &&
              ((this.uniforms.uSampler = t), (this.uvMatrix.texture = t));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "alpha", {
          get: function () {
            return this._alpha;
          },
          set: function (t) {
            t !== this._alpha && ((this._alpha = t), (this._colorDirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "tint", {
          get: function () {
            return this._tint;
          },
          set: function (t) {
            t !== this._tint &&
              ((this._tint = t),
              (this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16)),
              (this._colorDirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.update = function () {
          if (this._colorDirty) {
            this._colorDirty = !1;
            var t = this.texture.baseTexture;
            Xe(this._tint, this._alpha, this.uniforms.uColor, t.alphaMode);
          }
          this.uvMatrix.update() &&
            (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
        }),
        e
      );
    })(Yn),
    jh = (function (e) {
      function r(r, i, n) {
        var o = e.call(this) || this,
          s = new qi(r),
          a = new qi(i, !0),
          h = new qi(n, !0, !0);
        return (
          o
            .addAttribute("aVertexPosition", s, 2, !1, t.TYPES.FLOAT)
            .addAttribute("aTextureCoord", a, 2, !1, t.TYPES.FLOAT)
            .addIndex(h),
          (o._updateId = -1),
          o
        );
      }
      return (
        Bh(r, e),
        Object.defineProperty(r.prototype, "vertexDirtyId", {
          get: function () {
            return this.buffers[0]._updateID;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })($i),
    Vh = function (t, e) {
      return (
        (Vh =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Vh(t, e)
      );
    };
  var Wh = function () {
      (this.info = []),
        (this.common = []),
        (this.page = []),
        (this.char = []),
        (this.kerning = []),
        (this.distanceField = []);
    },
    zh = (function () {
      function t() {}
      return (
        (t.test = function (t) {
          return "string" == typeof t && 0 === t.indexOf("info face=");
        }),
        (t.parse = function (t) {
          var e = t.match(/^[a-z]+\s+.+$/gm),
            r = {
              info: [],
              common: [],
              page: [],
              char: [],
              chars: [],
              kerning: [],
              kernings: [],
              distanceField: [],
            };
          for (var i in e) {
            var n = e[i].match(/^[a-z]+/gm)[0],
              o = e[i].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm),
              s = {};
            for (var a in o) {
              var h = o[a].split("="),
                u = h[0],
                l = h[1].replace(/"/gm, ""),
                c = parseFloat(l),
                d = isNaN(c) ? l : c;
              s[u] = d;
            }
            r[n].push(s);
          }
          var f = new Wh();
          return (
            r.info.forEach(function (t) {
              return f.info.push({ face: t.face, size: parseInt(t.size, 10) });
            }),
            r.common.forEach(function (t) {
              return f.common.push({ lineHeight: parseInt(t.lineHeight, 10) });
            }),
            r.page.forEach(function (t) {
              return f.page.push({ id: parseInt(t.id, 10), file: t.file });
            }),
            r.char.forEach(function (t) {
              return f.char.push({
                id: parseInt(t.id, 10),
                page: parseInt(t.page, 10),
                x: parseInt(t.x, 10),
                y: parseInt(t.y, 10),
                width: parseInt(t.width, 10),
                height: parseInt(t.height, 10),
                xoffset: parseInt(t.xoffset, 10),
                yoffset: parseInt(t.yoffset, 10),
                xadvance: parseInt(t.xadvance, 10),
              });
            }),
            r.kerning.forEach(function (t) {
              return f.kerning.push({
                first: parseInt(t.first, 10),
                second: parseInt(t.second, 10),
                amount: parseInt(t.amount, 10),
              });
            }),
            r.distanceField.forEach(function (t) {
              return f.distanceField.push({
                distanceRange: parseInt(t.distanceRange, 10),
                fieldType: t.fieldType,
              });
            }),
            f
          );
        }),
        t
      );
    })(),
    qh = (function () {
      function t() {}
      return (
        (t.test = function (t) {
          return (
            t instanceof XMLDocument &&
            t.getElementsByTagName("page").length &&
            null !== t.getElementsByTagName("info")[0].getAttribute("face")
          );
        }),
        (t.parse = function (t) {
          for (
            var e = new Wh(),
              r = t.getElementsByTagName("info"),
              i = t.getElementsByTagName("common"),
              n = t.getElementsByTagName("page"),
              o = t.getElementsByTagName("char"),
              s = t.getElementsByTagName("kerning"),
              a = t.getElementsByTagName("distanceField"),
              h = 0;
            h < r.length;
            h++
          )
            e.info.push({
              face: r[h].getAttribute("face"),
              size: parseInt(r[h].getAttribute("size"), 10),
            });
          for (h = 0; h < i.length; h++)
            e.common.push({
              lineHeight: parseInt(i[h].getAttribute("lineHeight"), 10),
            });
          for (h = 0; h < n.length; h++)
            e.page.push({
              id: parseInt(n[h].getAttribute("id"), 10) || 0,
              file: n[h].getAttribute("file"),
            });
          for (h = 0; h < o.length; h++) {
            var u = o[h];
            e.char.push({
              id: parseInt(u.getAttribute("id"), 10),
              page: parseInt(u.getAttribute("page"), 10) || 0,
              x: parseInt(u.getAttribute("x"), 10),
              y: parseInt(u.getAttribute("y"), 10),
              width: parseInt(u.getAttribute("width"), 10),
              height: parseInt(u.getAttribute("height"), 10),
              xoffset: parseInt(u.getAttribute("xoffset"), 10),
              yoffset: parseInt(u.getAttribute("yoffset"), 10),
              xadvance: parseInt(u.getAttribute("xadvance"), 10),
            });
          }
          for (h = 0; h < s.length; h++)
            e.kerning.push({
              first: parseInt(s[h].getAttribute("first"), 10),
              second: parseInt(s[h].getAttribute("second"), 10),
              amount: parseInt(s[h].getAttribute("amount"), 10),
            });
          for (h = 0; h < a.length; h++)
            e.distanceField.push({
              fieldType: a[h].getAttribute("fieldType"),
              distanceRange: parseInt(a[h].getAttribute("distanceRange"), 10),
            });
          return e;
        }),
        t
      );
    })(),
    Kh = (function () {
      function t() {}
      return (
        (t.test = function (t) {
          if ("string" == typeof t && t.indexOf("<font>") > -1) {
            var e = new globalThis.DOMParser().parseFromString(t, "text/xml");
            return qh.test(e);
          }
          return !1;
        }),
        (t.parse = function (t) {
          var e = new globalThis.DOMParser().parseFromString(t, "text/xml");
          return qh.parse(e);
        }),
        t
      );
    })(),
    Zh = [zh, qh, Kh];
  function Qh(t) {
    for (var e = 0; e < Zh.length; e++) if (Zh[e].test(t)) return Zh[e];
    return null;
  }
  function Jh(e, r, i, n, o, s, a) {
    var h = i.text,
      u = i.fontProperties;
    r.translate(n, o), r.scale(s, s);
    var l = a.strokeThickness / 2,
      c = -a.strokeThickness / 2;
    if (
      ((r.font = a.toFontString()),
      (r.lineWidth = a.strokeThickness),
      (r.textBaseline = a.textBaseline),
      (r.lineJoin = a.lineJoin),
      (r.miterLimit = a.miterLimit),
      (r.fillStyle = (function (e, r, i, n, o, s) {
        var a,
          h = i.fill;
        if (!Array.isArray(h)) return h;
        if (1 === h.length) return h[0];
        var u = i.dropShadow ? i.dropShadowDistance : 0,
          l = i.padding || 0,
          c = e.width / n - u - 2 * l,
          d = e.height / n - u - 2 * l,
          f = h.slice(),
          p = i.fillGradientStops.slice();
        if (!p.length)
          for (var _ = f.length + 1, v = 1; v < _; ++v) p.push(v / _);
        if (
          (f.unshift(h[0]),
          p.unshift(0),
          f.push(h[h.length - 1]),
          p.push(1),
          i.fillGradientType === t.TEXT_GRADIENT.LINEAR_VERTICAL)
        ) {
          a = r.createLinearGradient(c / 2, l, c / 2, d + l);
          var m = 0,
            E = (s.fontProperties.fontSize + i.strokeThickness) / d;
          for (v = 0; v < o.length; v++)
            for (var T = s.lineHeight * v, y = 0; y < f.length; y++) {
              var g =
                  T / d + ("number" == typeof p[y] ? p[y] : y / f.length) * E,
                b = Math.max(m, g);
              (b = Math.min(b, 1)), a.addColorStop(b, f[y]), (m = b);
            }
        } else {
          a = r.createLinearGradient(l, d / 2, c + l, d / 2);
          var R = f.length + 1,
            A = 1;
          for (v = 0; v < f.length; v++) {
            var x = void 0;
            (x = "number" == typeof p[v] ? p[v] : A / R),
              a.addColorStop(x, f[v]),
              A++;
          }
        }
        return a;
      })(e, r, a, s, [h], i)),
      (r.strokeStyle = a.stroke),
      a.dropShadow)
    ) {
      var d = a.dropShadowColor,
        f = Ce("number" == typeof d ? d : Le(d)),
        p = a.dropShadowBlur * s,
        _ = a.dropShadowDistance * s;
      (r.shadowColor =
        "rgba(" +
        255 * f[0] +
        "," +
        255 * f[1] +
        "," +
        255 * f[2] +
        "," +
        a.dropShadowAlpha +
        ")"),
        (r.shadowBlur = p),
        (r.shadowOffsetX = Math.cos(a.dropShadowAngle) * _),
        (r.shadowOffsetY = Math.sin(a.dropShadowAngle) * _);
    } else
      (r.shadowColor = "black"),
        (r.shadowBlur = 0),
        (r.shadowOffsetX = 0),
        (r.shadowOffsetY = 0);
    a.stroke &&
      a.strokeThickness &&
      r.strokeText(h, l, c + i.lineHeight - u.descent),
      a.fill && r.fillText(h, l, c + i.lineHeight - u.descent),
      r.setTransform(1, 0, 0, 1, 0, 0),
      (r.fillStyle = "rgba(0, 0, 0, 0)");
  }
  function $h(t) {
    return Array.from ? Array.from(t) : t.split("");
  }
  function tu(t) {
    return t.codePointAt ? t.codePointAt(0) : t.charCodeAt(0);
  }
  var eu = (function () {
      function e(e, r, i) {
        var n,
          o,
          s = e.info[0],
          a = e.common[0],
          h = e.page[0],
          u = e.distanceField[0],
          l = ar(h.file),
          c = {};
        (this._ownsTextures = i),
          (this.font = s.face),
          (this.size = s.size),
          (this.lineHeight = a.lineHeight / l),
          (this.chars = {}),
          (this.pageTextures = c);
        for (var d = 0; d < e.page.length; d++) {
          var f = e.page[d],
            p = f.id,
            _ = f.file;
          (c[p] = r instanceof Array ? r[d] : r[_]),
            (null == u ? void 0 : u.fieldType) &&
              "none" !== u.fieldType &&
              (c[p].baseTexture.alphaMode =
                t.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA);
        }
        for (d = 0; d < e.char.length; d++) {
          var v = e.char[d],
            m = ((p = v.id), v.page),
            E = e.char[d],
            T = E.x,
            y = E.y,
            g = E.width,
            b = E.height,
            R = E.xoffset,
            A = E.yoffset,
            x = E.xadvance;
          (y /= l), (g /= l), (b /= l), (R /= l), (A /= l), (x /= l);
          var S = new _r(
            (T /= l) + c[m].frame.x / l,
            y + c[m].frame.y / l,
            g,
            b
          );
          this.chars[p] = {
            xOffset: R,
            yOffset: A,
            xAdvance: x,
            kerning: {},
            texture: new Hi(c[m].baseTexture, S),
            page: m,
          };
        }
        for (d = 0; d < e.kerning.length; d++) {
          var O = e.kerning[d],
            I = O.first,
            P = O.second,
            M = O.amount;
          (I /= l),
            (P /= l),
            (M /= l),
            this.chars[P] && (this.chars[P].kerning[I] = M);
        }
        (this.distanceFieldRange = null == u ? void 0 : u.distanceRange),
          (this.distanceFieldType =
            null !==
              (o =
                null === (n = null == u ? void 0 : u.fieldType) || void 0 === n
                  ? void 0
                  : n.toLowerCase()) && void 0 !== o
              ? o
              : "none");
      }
      return (
        (e.prototype.destroy = function () {
          for (var t in this.chars)
            this.chars[t].texture.destroy(), (this.chars[t].texture = null);
          for (var t in this.pageTextures)
            this._ownsTextures && this.pageTextures[t].destroy(!0),
              (this.pageTextures[t] = null);
          (this.chars = null), (this.pageTextures = null);
        }),
        (e.install = function (t, r, i) {
          var n;
          if (t instanceof Wh) n = t;
          else {
            var o = Qh(t);
            if (!o) throw new Error("Unrecognized data format for font.");
            n = o.parse(t);
          }
          r instanceof Hi && (r = [r]);
          var s = new e(n, r, i);
          return (e.available[s.font] = s), s;
        }),
        (e.uninstall = function (t) {
          var r = e.available[t];
          if (!r) throw new Error("No font found named '" + t + "'");
          r.destroy(), delete e.available[t];
        }),
        (e.from = function (t, r, i) {
          if (!t) throw new Error("[BitmapFont] Property `name` is required.");
          var n = Object.assign({}, e.defaultOptions, i),
            o = n.chars,
            s = n.padding,
            a = n.resolution,
            h = n.textureWidth,
            u = n.textureHeight,
            l = (function (t) {
              "string" == typeof t && (t = [t]);
              for (var e = [], r = 0, i = t.length; r < i; r++) {
                var n = t[r];
                if (Array.isArray(n)) {
                  if (2 !== n.length)
                    throw new Error(
                      "[BitmapFont]: Invalid character range length, expecting 2 got " +
                        n.length +
                        "."
                    );
                  var o = n[0].charCodeAt(0),
                    s = n[1].charCodeAt(0);
                  if (s < o)
                    throw new Error("[BitmapFont]: Invalid character range.");
                  for (var a = o, h = s; a <= h; a++)
                    e.push(String.fromCharCode(a));
                } else e.push.apply(e, $h(n));
              }
              if (0 === e.length)
                throw new Error(
                  "[BitmapFont]: Empty set when resolving characters."
                );
              return e;
            })(o),
            c = r instanceof oh ? r : new oh(r),
            d = h,
            f = new Wh();
          (f.info[0] = { face: c.fontFamily, size: c.fontSize }),
            (f.common[0] = { lineHeight: c.fontSize });
          for (
            var p, _, v, m = 0, E = 0, T = 0, y = [], g = 0;
            g < l.length;
            g++
          ) {
            p ||
              (((p = document.createElement("canvas")).width = h),
              (p.height = u),
              (_ = p.getContext("2d")),
              (v = new Si(p, { resolution: a })),
              y.push(new Hi(v)),
              f.page.push({ id: y.length - 1, file: "" }));
            var b = uh.measureText(l[g], c, !1, p),
              R = b.width,
              A = Math.ceil(b.height),
              x = Math.ceil(("italic" === c.fontStyle ? 2 : 1) * R);
            if (E >= u - A * a) {
              if (0 === E)
                throw new Error(
                  "[BitmapFont] textureHeight " +
                    u +
                    "px is too small for " +
                    c.fontSize +
                    "px fonts"
                );
              --g,
                (p = null),
                (_ = null),
                (v = null),
                (E = 0),
                (m = 0),
                (T = 0);
            } else if (
              ((T = Math.max(A + b.fontProperties.descent, T)), x * a + m >= d)
            )
              --g, (E += T * a), (E = Math.ceil(E)), (m = 0), (T = 0);
            else {
              Jh(p, _, b, m, E, a, c);
              var S = tu(b.text);
              f.char.push({
                id: S,
                page: y.length - 1,
                x: m / a,
                y: E / a,
                width: x,
                height: A,
                xoffset: 0,
                yoffset: 0,
                xadvance: Math.ceil(
                  R -
                    (c.dropShadow ? c.dropShadowDistance : 0) -
                    (c.stroke ? c.strokeThickness : 0)
                ),
              }),
                (m += (x + 2 * s) * a),
                (m = Math.ceil(m));
            }
          }
          g = 0;
          for (var O = l.length; g < O; g++)
            for (var I = l[g], P = 0; P < O; P++) {
              var M = l[P],
                N = _.measureText(I).width,
                D = _.measureText(M).width,
                C = _.measureText(I + M).width - (N + D);
              C && f.kerning.push({ first: tu(I), second: tu(M), amount: C });
            }
          var w = new e(f, y, !0);
          return (
            void 0 !== e.available[t] && e.uninstall(t), (e.available[t] = w), w
          );
        }),
        (e.ALPHA = [["a", "z"], ["A", "Z"], " "]),
        (e.NUMERIC = [["0", "9"]]),
        (e.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "]),
        (e.ASCII = [[" ", "~"]]),
        (e.defaultOptions = {
          resolution: 1,
          textureWidth: 512,
          textureHeight: 512,
          padding: 4,
          chars: e.ALPHANUMERIC,
        }),
        (e.available = {}),
        e
      );
    })(),
    ru = [],
    iu = [],
    nu = [],
    ou = (function (e) {
      function r(t, i) {
        void 0 === i && (i = {});
        var n = e.call(this) || this;
        n._tint = 16777215;
        var o = Object.assign({}, r.styleDefaults, i),
          s = o.align,
          a = o.tint,
          h = o.maxWidth,
          u = o.letterSpacing,
          l = o.fontName,
          c = o.fontSize;
        if (!eu.available[l]) throw new Error('Missing BitmapFont "' + l + '"');
        return (
          (n._activePagesMeshData = []),
          (n._textWidth = 0),
          (n._textHeight = 0),
          (n._align = s),
          (n._tint = a),
          (n._fontName = l),
          (n._fontSize = c || eu.available[l].size),
          (n._text = t),
          (n._maxWidth = h),
          (n._maxLineHeight = 0),
          (n._letterSpacing = u),
          (n._anchor = new yr(
            function () {
              n.dirty = !0;
            },
            n,
            0,
            0
          )),
          (n._roundPixels = bt.ROUND_PIXELS),
          (n.dirty = !0),
          (n._textureCache = {}),
          n
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          Vh(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(r, e),
        (r.prototype.updateText = function () {
          for (
            var e,
              r = eu.available[this._fontName],
              i = this._fontSize / r.size,
              n = new fr(),
              o = [],
              s = [],
              a = [],
              h = $h(this._text.replace(/(?:\r\n|\r)/g, "\n") || " "),
              u = (this._maxWidth * r.size) / this._fontSize,
              l = "none" === r.distanceFieldType ? ru : iu,
              c = null,
              d = 0,
              f = 0,
              p = 0,
              _ = -1,
              v = 0,
              m = 0,
              E = 0,
              T = 0,
              y = 0;
            y < h.length;
            y++
          ) {
            var g = tu((k = h[y]));
            if (
              (/(?:\s)/.test(k) && ((_ = y), (v = d), T++),
              "\r" !== k && "\n" !== k)
            ) {
              var b = r.chars[g];
              if (b) {
                c && b.kerning[c] && (n.x += b.kerning[c]);
                var R = nu.pop() || {
                  texture: Hi.EMPTY,
                  line: 0,
                  charCode: 0,
                  prevSpaces: 0,
                  position: new fr(),
                };
                (R.texture = b.texture),
                  (R.line = p),
                  (R.charCode = g),
                  (R.position.x = n.x + b.xOffset + this._letterSpacing / 2),
                  (R.position.y = n.y + b.yOffset),
                  (R.prevSpaces = T),
                  o.push(R),
                  (d =
                    R.position.x + Math.max(b.xAdvance, b.texture.orig.width)),
                  (n.x += b.xAdvance + this._letterSpacing),
                  (E = Math.max(E, b.yOffset + b.texture.height)),
                  (c = g),
                  -1 !== _ &&
                    u > 0 &&
                    n.x > u &&
                    (ze(o, 1 + _ - ++m, 1 + y - _),
                    (y = _),
                    (_ = -1),
                    s.push(v),
                    a.push(o.length > 0 ? o[o.length - 1].prevSpaces : 0),
                    (f = Math.max(f, v)),
                    p++,
                    (n.x = 0),
                    (n.y += r.lineHeight),
                    (c = null),
                    (T = 0));
              }
            } else
              s.push(d),
                a.push(-1),
                (f = Math.max(f, d)),
                ++p,
                ++m,
                (n.x = 0),
                (n.y += r.lineHeight),
                (c = null),
                (T = 0);
          }
          var A = h[h.length - 1];
          "\r" !== A &&
            "\n" !== A &&
            (/(?:\s)/.test(A) && (d = v),
            s.push(d),
            (f = Math.max(f, d)),
            a.push(-1));
          var x = [];
          for (y = 0; y <= p; y++) {
            var S = 0;
            "right" === this._align
              ? (S = f - s[y])
              : "center" === this._align
              ? (S = (f - s[y]) / 2)
              : "justify" === this._align &&
                (S = a[y] < 0 ? 0 : (f - s[y]) / a[y]),
              x.push(S);
          }
          var O = o.length,
            I = {},
            P = [],
            M = this._activePagesMeshData;
          for (y = 0; y < M.length; y++) l.push(M[y]);
          for (y = 0; y < O; y++) {
            var N = (Y = o[y].texture).baseTexture.uid;
            if (!I[N]) {
              if (!(Z = l.pop())) {
                var D = new jh(),
                  C = void 0,
                  w = void 0;
                "none" === r.distanceFieldType
                  ? ((C = new Yh(Hi.EMPTY)), (w = t.BLEND_MODES.NORMAL))
                  : ((C = new Yh(Hi.EMPTY, {
                      program: Hn.from(
                        "// Mesh material default fragment\r\nattribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\nuniform mat3 translationMatrix;\r\nuniform mat3 uTextureMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n\r\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r\n}\r\n",
                        "// Pixi texture info\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\n// Tint\r\nuniform vec4 uColor;\r\n\r\n// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r\nuniform float uFWidth;\r\n\r\nvoid main(void) {\r\n\r\n  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r\n  vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n\r\n  // MSDF\r\n  float median = texColor.r + texColor.g + texColor.b -\r\n                  min(texColor.r, min(texColor.g, texColor.b)) -\r\n                  max(texColor.r, max(texColor.g, texColor.b));\r\n  // SDF\r\n  median = min(median, texColor.a);\r\n\r\n  float screenPxDistance = uFWidth * (median - 0.5);\r\n  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r\n\r\n  // NPM Textures, NPM outputs\r\n  gl_FragColor = vec4(uColor.rgb, uColor.a * alpha);\r\n\r\n}\r\n"
                      ),
                      uniforms: { uFWidth: 0 },
                    })),
                    (w = t.BLEND_MODES.NORMAL_NPM));
                var L = new Hh(D, C);
                (L.blendMode = w),
                  (Z = {
                    index: 0,
                    indexCount: 0,
                    vertexCount: 0,
                    uvsCount: 0,
                    total: 0,
                    mesh: L,
                    vertices: null,
                    uvs: null,
                    indices: null,
                  });
              }
              (Z.index = 0),
                (Z.indexCount = 0),
                (Z.vertexCount = 0),
                (Z.uvsCount = 0),
                (Z.total = 0);
              var F = this._textureCache;
              (F[N] = F[N] || new Hi(Y.baseTexture)),
                (Z.mesh.texture = F[N]),
                (Z.mesh.tint = this._tint),
                P.push(Z),
                (I[N] = Z);
            }
            I[N].total++;
          }
          for (y = 0; y < M.length; y++)
            -1 === P.indexOf(M[y]) && this.removeChild(M[y].mesh);
          for (y = 0; y < P.length; y++)
            P[y].mesh.parent !== this && this.addChild(P[y].mesh);
          for (var y in ((this._activePagesMeshData = P), I)) {
            var U = (Z = I[y]).total;
            if (
              !(
                (null === (e = Z.indices) || void 0 === e ? void 0 : e.length) >
                6 * U
              ) ||
              Z.vertices.length < 2 * Hh.BATCHABLE_SIZE
            )
              (Z.vertices = new Float32Array(8 * U)),
                (Z.uvs = new Float32Array(8 * U)),
                (Z.indices = new Uint16Array(6 * U));
            else
              for (
                var B = Z.total, G = Z.vertices, X = 8 * B;
                X < G.length;
                X++
              )
                G[X] = 0;
            Z.mesh.size = 6 * U;
          }
          for (y = 0; y < O; y++) {
            var k,
              H =
                (k = o[y]).position.x +
                x[k.line] * ("justify" === this._align ? k.prevSpaces : 1);
            this._roundPixels && (H = Math.round(H));
            var Y,
              j = H * i,
              V = k.position.y * i,
              W = I[(Y = k.texture).baseTexture.uid],
              z = Y.frame,
              q = Y._uvs,
              K = W.index++;
            (W.indices[6 * K + 0] = 0 + 4 * K),
              (W.indices[6 * K + 1] = 1 + 4 * K),
              (W.indices[6 * K + 2] = 2 + 4 * K),
              (W.indices[6 * K + 3] = 0 + 4 * K),
              (W.indices[6 * K + 4] = 2 + 4 * K),
              (W.indices[6 * K + 5] = 3 + 4 * K),
              (W.vertices[8 * K + 0] = j),
              (W.vertices[8 * K + 1] = V),
              (W.vertices[8 * K + 2] = j + z.width * i),
              (W.vertices[8 * K + 3] = V),
              (W.vertices[8 * K + 4] = j + z.width * i),
              (W.vertices[8 * K + 5] = V + z.height * i),
              (W.vertices[8 * K + 6] = j),
              (W.vertices[8 * K + 7] = V + z.height * i),
              (W.uvs[8 * K + 0] = q.x0),
              (W.uvs[8 * K + 1] = q.y0),
              (W.uvs[8 * K + 2] = q.x1),
              (W.uvs[8 * K + 3] = q.y1),
              (W.uvs[8 * K + 4] = q.x2),
              (W.uvs[8 * K + 5] = q.y2),
              (W.uvs[8 * K + 6] = q.x3),
              (W.uvs[8 * K + 7] = q.y3);
          }
          for (var y in ((this._textWidth = f * i),
          (this._textHeight = (n.y + r.lineHeight) * i),
          I)) {
            var Z = I[y];
            if (0 !== this.anchor.x || 0 !== this.anchor.y)
              for (
                var Q = 0,
                  J = this._textWidth * this.anchor.x,
                  $ = this._textHeight * this.anchor.y,
                  tt = 0;
                tt < Z.total;
                tt++
              )
                (Z.vertices[Q++] -= J),
                  (Z.vertices[Q++] -= $),
                  (Z.vertices[Q++] -= J),
                  (Z.vertices[Q++] -= $),
                  (Z.vertices[Q++] -= J),
                  (Z.vertices[Q++] -= $),
                  (Z.vertices[Q++] -= J),
                  (Z.vertices[Q++] -= $);
            this._maxLineHeight = E * i;
            var et = Z.mesh.geometry.getBuffer("aVertexPosition"),
              rt = Z.mesh.geometry.getBuffer("aTextureCoord"),
              it = Z.mesh.geometry.getIndex();
            (et.data = Z.vertices),
              (rt.data = Z.uvs),
              (it.data = Z.indices),
              et.update(),
              rt.update(),
              it.update();
          }
          for (y = 0; y < o.length; y++) nu.push(o[y]);
        }),
        (r.prototype.updateTransform = function () {
          this.validate(), this.containerUpdateTransform();
        }),
        (r.prototype._render = function (t) {
          var r = eu.available[this._fontName],
            i = r.distanceFieldRange,
            n = r.distanceFieldType,
            o = r.size;
          if ("none" !== n)
            for (
              var s = this.worldTransform,
                a = s.a,
                h = s.b,
                u = s.c,
                l = s.d,
                c = Math.sqrt(a * a + h * h),
                d = Math.sqrt(u * u + l * l),
                f = (Math.abs(c) + Math.abs(d)) / 2,
                p = this._fontSize / o,
                _ = 0,
                v = this._activePagesMeshData;
              _ < v.length;
              _++
            ) {
              v[_].mesh.shader.uniforms.uFWidth = f * i * p * t.resolution;
            }
          e.prototype._render.call(this, t);
        }),
        (r.prototype.getLocalBounds = function () {
          return this.validate(), e.prototype.getLocalBounds.call(this);
        }),
        (r.prototype.validate = function () {
          this.dirty && (this.updateText(), (this.dirty = !1));
        }),
        Object.defineProperty(r.prototype, "tint", {
          get: function () {
            return this._tint;
          },
          set: function (t) {
            if (this._tint !== t) {
              this._tint = t;
              for (var e = 0; e < this._activePagesMeshData.length; e++)
                this._activePagesMeshData[e].mesh.tint = t;
            }
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "align", {
          get: function () {
            return this._align;
          },
          set: function (t) {
            this._align !== t && ((this._align = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "fontName", {
          get: function () {
            return this._fontName;
          },
          set: function (t) {
            if (!eu.available[t])
              throw new Error('Missing BitmapFont "' + t + '"');
            this._fontName !== t && ((this._fontName = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "fontSize", {
          get: function () {
            return this._fontSize;
          },
          set: function (t) {
            this._fontSize !== t && ((this._fontSize = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "anchor", {
          get: function () {
            return this._anchor;
          },
          set: function (t) {
            "number" == typeof t
              ? this._anchor.set(t)
              : this._anchor.copyFrom(t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "text", {
          get: function () {
            return this._text;
          },
          set: function (t) {
            (t = String(null == t ? "" : t)),
              this._text !== t && ((this._text = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "maxWidth", {
          get: function () {
            return this._maxWidth;
          },
          set: function (t) {
            this._maxWidth !== t && ((this._maxWidth = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "maxLineHeight", {
          get: function () {
            return this.validate(), this._maxLineHeight;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "textWidth", {
          get: function () {
            return this.validate(), this._textWidth;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "letterSpacing", {
          get: function () {
            return this._letterSpacing;
          },
          set: function (t) {
            this._letterSpacing !== t &&
              ((this._letterSpacing = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "roundPixels", {
          get: function () {
            return this._roundPixels;
          },
          set: function (t) {
            t !== this._roundPixels &&
              ((this._roundPixels = t), (this.dirty = !0));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "textHeight", {
          get: function () {
            return this.validate(), this._textHeight;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (r.prototype.destroy = function (t) {
          var r = this._textureCache;
          for (var i in r) {
            r[i].destroy(), delete r[i];
          }
          (this._textureCache = null), e.prototype.destroy.call(this, t);
        }),
        (r.styleDefaults = {
          align: "left",
          tint: 16777215,
          maxWidth: 0,
          letterSpacing: 0,
        }),
        r
      );
    })(ri),
    su = (function () {
      function e() {}
      return (
        (e.add = function () {
          t.LoaderResource.setExtensionXhrType(
            "fnt",
            t.LoaderResource.XHR_RESPONSE_TYPE.TEXT
          );
        }),
        (e.use = function (r, i) {
          var n = Qh(r.data);
          if (n)
            for (
              var o = e.getBaseUrl(this, r),
                s = n.parse(r.data),
                a = {},
                h = function (t) {
                  (a[t.metadata.pageFile] = t.texture),
                    Object.keys(a).length === s.page.length &&
                      ((r.bitmapFont = eu.install(s, a, !0)), i());
                },
                u = 0;
              u < s.page.length;
              ++u
            ) {
              var l = s.page[u].file,
                c = o + l,
                d = !1;
              for (var f in this.resources) {
                var p = this.resources[f];
                if (p.url === c) {
                  (p.metadata.pageFile = l),
                    p.texture ? h(p) : p.onAfterMiddleware.add(h),
                    (d = !0);
                  break;
                }
              }
              if (!d) {
                var _ = {
                  crossOrigin: r.crossOrigin,
                  loadType: t.LoaderResource.LOAD_TYPE.IMAGE,
                  metadata: Object.assign(
                    { pageFile: l },
                    r.metadata.imageMetadata
                  ),
                  parentResource: r,
                };
                this.add(c, _, h);
              }
            }
          else i();
        }),
        (e.getBaseUrl = function (t, r) {
          var i = r.isDataUrl ? "" : e.dirname(r.url);
          return (
            r.isDataUrl &&
              ("." === i && (i = ""),
              t.baseUrl &&
                i &&
                "/" === t.baseUrl.charAt(t.baseUrl.length - 1) &&
                (i += "/")),
            (i = i.replace(t.baseUrl, "")) &&
              "/" !== i.charAt(i.length - 1) &&
              (i += "/"),
            i
          );
        }),
        (e.dirname = function (t) {
          var e = t
            .replace(/\\/g, "/")
            .replace(/\/$/, "")
            .replace(/\/[^\/]*$/, "");
          return e === t ? "." : "" === e ? "/" : e;
        }),
        e
      );
    })(),
    au = function (t, e) {
      return (
        (au =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        au(t, e)
      );
    };
  var hu = (function (t) {
      function e(e) {
        void 0 === e && (e = 1);
        var r =
          t.call(
            this,
            Io,
            "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n",
            { uAlpha: 1 }
          ) || this;
        return (r.alpha = e), r;
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          au(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(e, t),
        Object.defineProperty(e.prototype, "alpha", {
          get: function () {
            return this.uniforms.uAlpha;
          },
          set: function (t) {
            this.uniforms.uAlpha = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(Vn),
    uu = function (t, e) {
      return (
        (uu =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        uu(t, e)
      );
    };
  function lu(t, e) {
    function r() {
      this.constructor = t;
    }
    uu(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var cu,
    du,
    fu,
    pu,
    _u,
    vu,
    mu,
    Eu,
    Tu,
    yu,
    gu,
    bu,
    Ru,
    Au,
    xu,
    Su,
    Ou,
    Iu,
    Pu,
    Mu = {
      5: [0.153388, 0.221461, 0.250301],
      7: [0.071303, 0.131514, 0.189879, 0.214607],
      9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
      11: [0.0093, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
      13: [
        0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641,
      ],
      15: [
        489e-6, 0.002403, 0.009246, 0.02784, 0.065602, 0.120999, 0.174697,
        0.197448,
      ],
    },
    Nu = [
      "varying vec2 vBlurTexCoords[%size%];",
      "uniform sampler2D uSampler;",
      "void main(void)",
      "{",
      "    gl_FragColor = vec4(0.0);",
      "    %blur%",
      "}",
    ].join("\n");
  !(function (t) {
    (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
      (t[(t.WEBGL = 1)] = "WEBGL"),
      (t[(t.WEBGL2 = 2)] = "WEBGL2");
  })(cu || (cu = {})),
    (function (t) {
      (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
        (t[(t.WEBGL = 1)] = "WEBGL"),
        (t[(t.CANVAS = 2)] = "CANVAS");
    })(du || (du = {})),
    (function (t) {
      (t[(t.COLOR = 16384)] = "COLOR"),
        (t[(t.DEPTH = 256)] = "DEPTH"),
        (t[(t.STENCIL = 1024)] = "STENCIL");
    })(fu || (fu = {})),
    (function (t) {
      (t[(t.NORMAL = 0)] = "NORMAL"),
        (t[(t.ADD = 1)] = "ADD"),
        (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
        (t[(t.SCREEN = 3)] = "SCREEN"),
        (t[(t.OVERLAY = 4)] = "OVERLAY"),
        (t[(t.DARKEN = 5)] = "DARKEN"),
        (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
        (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
        (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
        (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
        (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
        (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
        (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
        (t[(t.HUE = 13)] = "HUE"),
        (t[(t.SATURATION = 14)] = "SATURATION"),
        (t[(t.COLOR = 15)] = "COLOR"),
        (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
        (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
        (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
        (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
        (t[(t.NONE = 20)] = "NONE"),
        (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
        (t[(t.SRC_IN = 21)] = "SRC_IN"),
        (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
        (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
        (t[(t.DST_OVER = 24)] = "DST_OVER"),
        (t[(t.DST_IN = 25)] = "DST_IN"),
        (t[(t.DST_OUT = 26)] = "DST_OUT"),
        (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
        (t[(t.ERASE = 26)] = "ERASE"),
        (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
        (t[(t.XOR = 29)] = "XOR");
    })(pu || (pu = {})),
    (function (t) {
      (t[(t.POINTS = 0)] = "POINTS"),
        (t[(t.LINES = 1)] = "LINES"),
        (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
        (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
        (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
        (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
        (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
    })(_u || (_u = {})),
    (function (t) {
      (t[(t.RGBA = 6408)] = "RGBA"),
        (t[(t.RGB = 6407)] = "RGB"),
        (t[(t.RG = 33319)] = "RG"),
        (t[(t.RED = 6403)] = "RED"),
        (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
        (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
        (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
        (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
        (t[(t.ALPHA = 6406)] = "ALPHA"),
        (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
        (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
        (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
        (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
    })(vu || (vu = {})),
    (function (t) {
      (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
        (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
        (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
          "TEXTURE_CUBE_MAP_POSITIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Z"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Z");
    })(mu || (mu = {})),
    (function (t) {
      (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
        (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
        (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
        (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
        (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
        (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
        (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
          "UNSIGNED_INT_10F_11F_11F_REV"),
        (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
          "UNSIGNED_INT_2_10_10_10_REV"),
        (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
        (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
        (t[(t.BYTE = 5120)] = "BYTE"),
        (t[(t.SHORT = 5122)] = "SHORT"),
        (t[(t.INT = 5124)] = "INT"),
        (t[(t.FLOAT = 5126)] = "FLOAT"),
        (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
          "FLOAT_32_UNSIGNED_INT_24_8_REV"),
        (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
    })(Eu || (Eu = {})),
    (function (t) {
      (t[(t.FLOAT = 0)] = "FLOAT"),
        (t[(t.INT = 1)] = "INT"),
        (t[(t.UINT = 2)] = "UINT");
    })(Tu || (Tu = {})),
    (function (t) {
      (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
    })(yu || (yu = {})),
    (function (t) {
      (t[(t.CLAMP = 33071)] = "CLAMP"),
        (t[(t.REPEAT = 10497)] = "REPEAT"),
        (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
    })(gu || (gu = {})),
    (function (t) {
      (t[(t.OFF = 0)] = "OFF"),
        (t[(t.POW2 = 1)] = "POW2"),
        (t[(t.ON = 2)] = "ON"),
        (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
    })(bu || (bu = {})),
    (function (t) {
      (t[(t.NPM = 0)] = "NPM"),
        (t[(t.UNPACK = 1)] = "UNPACK"),
        (t[(t.PMA = 2)] = "PMA"),
        (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
        (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
        (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
        (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
    })(Ru || (Ru = {})),
    (function (t) {
      (t[(t.NO = 0)] = "NO"),
        (t[(t.YES = 1)] = "YES"),
        (t[(t.AUTO = 2)] = "AUTO"),
        (t[(t.BLEND = 0)] = "BLEND"),
        (t[(t.CLEAR = 1)] = "CLEAR"),
        (t[(t.BLIT = 2)] = "BLIT");
    })(Au || (Au = {})),
    (function (t) {
      (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
    })(xu || (xu = {})),
    (function (t) {
      (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
    })(Su || (Su = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.SCISSOR = 1)] = "SCISSOR"),
        (t[(t.STENCIL = 2)] = "STENCIL"),
        (t[(t.SPRITE = 3)] = "SPRITE");
    })(Ou || (Ou = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.LOW = 2)] = "LOW"),
        (t[(t.MEDIUM = 4)] = "MEDIUM"),
        (t[(t.HIGH = 8)] = "HIGH");
    })(Iu || (Iu = {})),
    (function (t) {
      (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
        (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
        (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
    })(Pu || (Pu = {}));
  var Du = (function (t) {
      function e(e, r, i, n, o) {
        void 0 === r && (r = 8),
          void 0 === i && (i = 4),
          void 0 === n && (n = bt.FILTER_RESOLUTION),
          void 0 === o && (o = 5);
        var s = this,
          a = (function (t, e) {
            var r,
              i = Math.ceil(t / 2),
              n =
                "\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n\n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }",
              o = "";
            r = e
              ? "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);"
              : "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
            for (var s = 0; s < t; s++) {
              var a = r.replace("%index%", s.toString());
              (o += a = a.replace("%sampleIndex%", s - (i - 1) + ".0")),
                (o += "\n");
            }
            return (n = n.replace("%blur%", o)).replace("%size%", t.toString());
          })(o, e),
          h = (function (t) {
            for (
              var e, r = Mu[t], i = r.length, n = Nu, o = "", s = 0;
              s < t;
              s++
            ) {
              var a =
                "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;".replace(
                  "%index%",
                  s.toString()
                );
              (e = s),
                s >= i && (e = t - s - 1),
                (o += a = a.replace("%value%", r[e].toString())),
                (o += "\n");
            }
            return (n = n.replace("%blur%", o)).replace("%size%", t.toString());
          })(
            /*!
             * @pixi/constants - v6.3.0
             * Compiled Wed, 23 Mar 2022 18:58:56 UTC
             *
             * @pixi/constants is licensed under the MIT License.
             * http://www.opensource.org/licenses/mit-license
             */ o
          );
        return (
          ((s = t.call(this, a, h) || this).horizontal = e),
          (s.resolution = n),
          (s._quality = 0),
          (s.quality = i),
          (s.blur = r),
          s
        );
      }
      return (
        lu(e, t),
        (e.prototype.apply = function (t, e, r, i) {
          if (
            (r
              ? this.horizontal
                ? (this.uniforms.strength = (1 / r.width) * (r.width / e.width))
                : (this.uniforms.strength =
                    (1 / r.height) * (r.height / e.height))
              : this.horizontal
              ? (this.uniforms.strength =
                  (1 / t.renderer.width) * (t.renderer.width / e.width))
              : (this.uniforms.strength =
                  (1 / t.renderer.height) * (t.renderer.height / e.height)),
            (this.uniforms.strength *= this.strength),
            (this.uniforms.strength /= this.passes),
            1 === this.passes)
          )
            t.applyFilter(this, e, r, i);
          else {
            var n = t.getFilterTexture(),
              o = t.renderer,
              s = e,
              a = n;
            (this.state.blend = !1), t.applyFilter(this, s, a, Au.CLEAR);
            for (var h = 1; h < this.passes - 1; h++) {
              t.bindAndClear(s, Au.BLIT), (this.uniforms.uSampler = a);
              var u = a;
              (a = s), (s = u), o.shader.bind(this), o.geometry.draw(5);
            }
            (this.state.blend = !0),
              t.applyFilter(this, a, r, i),
              t.returnFilterTexture(n);
          }
        }),
        Object.defineProperty(e.prototype, "blur", {
          get: function () {
            return this.strength;
          },
          set: function (t) {
            (this.padding = 1 + 2 * Math.abs(t)), (this.strength = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "quality", {
          get: function () {
            return this._quality;
          },
          set: function (t) {
            (this._quality = t), (this.passes = t);
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(Vn),
    Cu = (function (t) {
      function e(e, r, i, n) {
        void 0 === e && (e = 8),
          void 0 === r && (r = 4),
          void 0 === i && (i = bt.FILTER_RESOLUTION),
          void 0 === n && (n = 5);
        var o = t.call(this) || this;
        return (
          (o.blurXFilter = new Du(!0, e, r, i, n)),
          (o.blurYFilter = new Du(!1, e, r, i, n)),
          (o.resolution = i),
          (o.quality = r),
          (o.blur = e),
          (o.repeatEdgePixels = !1),
          o
        );
      }
      return (
        lu(e, t),
        (e.prototype.apply = function (t, e, r, i) {
          var n = Math.abs(this.blurXFilter.strength),
            o = Math.abs(this.blurYFilter.strength);
          if (n && o) {
            var s = t.getFilterTexture();
            this.blurXFilter.apply(t, e, s, Au.CLEAR),
              this.blurYFilter.apply(t, s, r, i),
              t.returnFilterTexture(s);
          } else
            o
              ? this.blurYFilter.apply(t, e, r, i)
              : this.blurXFilter.apply(t, e, r, i);
        }),
        (e.prototype.updatePadding = function () {
          this._repeatEdgePixels
            ? (this.padding = 0)
            : (this.padding =
                2 *
                Math.max(
                  Math.abs(this.blurXFilter.strength),
                  Math.abs(this.blurYFilter.strength)
                ));
        }),
        Object.defineProperty(e.prototype, "blur", {
          get: function () {
            return this.blurXFilter.blur;
          },
          set: function (t) {
            (this.blurXFilter.blur = this.blurYFilter.blur = t),
              this.updatePadding();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "quality", {
          get: function () {
            return this.blurXFilter.quality;
          },
          set: function (t) {
            this.blurXFilter.quality = this.blurYFilter.quality = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "blurX", {
          get: function () {
            return this.blurXFilter.blur;
          },
          set: function (t) {
            (this.blurXFilter.blur = t), this.updatePadding();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "blurY", {
          get: function () {
            return this.blurYFilter.blur;
          },
          set: function (t) {
            (this.blurYFilter.blur = t), this.updatePadding();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "blendMode", {
          get: function () {
            return this.blurYFilter.blendMode;
          },
          set: function (t) {
            this.blurYFilter.blendMode = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "repeatEdgePixels", {
          get: function () {
            return this._repeatEdgePixels;
          },
          set: function (t) {
            (this._repeatEdgePixels = t), this.updatePadding();
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(Vn),
    wu = function (t, e) {
      return (
        (wu =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        wu(t, e)
      );
    };
  var Lu = (function (t) {
    function e() {
      var e = this,
        r = {
          m: new Float32Array([
            1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
          ]),
          uAlpha: 1,
        };
      return (
        ((e =
          t.call(
            this,
            Po,
            "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n",
            r
          ) || this).alpha = 1),
        e
      );
    }
    return (
      (function (t, e) {
        function r() {
          this.constructor = t;
        }
        wu(t, e),
          (t.prototype =
            null === e
              ? Object.create(e)
              : ((r.prototype = e.prototype), new r()));
      })(e, t),
      (e.prototype._loadMatrix = function (t, e) {
        void 0 === e && (e = !1);
        var r = t;
        e &&
          (this._multiply(r, this.uniforms.m, t), (r = this._colorMatrix(r))),
          (this.uniforms.m = r);
      }),
      (e.prototype._multiply = function (t, e, r) {
        return (
          (t[0] = e[0] * r[0] + e[1] * r[5] + e[2] * r[10] + e[3] * r[15]),
          (t[1] = e[0] * r[1] + e[1] * r[6] + e[2] * r[11] + e[3] * r[16]),
          (t[2] = e[0] * r[2] + e[1] * r[7] + e[2] * r[12] + e[3] * r[17]),
          (t[3] = e[0] * r[3] + e[1] * r[8] + e[2] * r[13] + e[3] * r[18]),
          (t[4] =
            e[0] * r[4] + e[1] * r[9] + e[2] * r[14] + e[3] * r[19] + e[4]),
          (t[5] = e[5] * r[0] + e[6] * r[5] + e[7] * r[10] + e[8] * r[15]),
          (t[6] = e[5] * r[1] + e[6] * r[6] + e[7] * r[11] + e[8] * r[16]),
          (t[7] = e[5] * r[2] + e[6] * r[7] + e[7] * r[12] + e[8] * r[17]),
          (t[8] = e[5] * r[3] + e[6] * r[8] + e[7] * r[13] + e[8] * r[18]),
          (t[9] =
            e[5] * r[4] + e[6] * r[9] + e[7] * r[14] + e[8] * r[19] + e[9]),
          (t[10] = e[10] * r[0] + e[11] * r[5] + e[12] * r[10] + e[13] * r[15]),
          (t[11] = e[10] * r[1] + e[11] * r[6] + e[12] * r[11] + e[13] * r[16]),
          (t[12] = e[10] * r[2] + e[11] * r[7] + e[12] * r[12] + e[13] * r[17]),
          (t[13] = e[10] * r[3] + e[11] * r[8] + e[12] * r[13] + e[13] * r[18]),
          (t[14] =
            e[10] * r[4] +
            e[11] * r[9] +
            e[12] * r[14] +
            e[13] * r[19] +
            e[14]),
          (t[15] = e[15] * r[0] + e[16] * r[5] + e[17] * r[10] + e[18] * r[15]),
          (t[16] = e[15] * r[1] + e[16] * r[6] + e[17] * r[11] + e[18] * r[16]),
          (t[17] = e[15] * r[2] + e[16] * r[7] + e[17] * r[12] + e[18] * r[17]),
          (t[18] = e[15] * r[3] + e[16] * r[8] + e[17] * r[13] + e[18] * r[18]),
          (t[19] =
            e[15] * r[4] +
            e[16] * r[9] +
            e[17] * r[14] +
            e[18] * r[19] +
            e[19]),
          t
        );
      }),
      (e.prototype._colorMatrix = function (t) {
        var e = new Float32Array(t);
        return (e[4] /= 255), (e[9] /= 255), (e[14] /= 255), (e[19] /= 255), e;
      }),
      (e.prototype.brightness = function (t, e) {
        var r = [t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(r, e);
      }),
      (e.prototype.tint = function (t, e) {
        var r = [
          ((t >> 16) & 255) / 255,
          0,
          0,
          0,
          0,
          0,
          ((t >> 8) & 255) / 255,
          0,
          0,
          0,
          0,
          0,
          (255 & t) / 255,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
        ];
        this._loadMatrix(r, e);
      }),
      (e.prototype.greyscale = function (t, e) {
        var r = [t, t, t, 0, 0, t, t, t, 0, 0, t, t, t, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(r, e);
      }),
      (e.prototype.blackAndWhite = function (t) {
        this._loadMatrix(
          [
            0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0,
            0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.hue = function (t, e) {
        t = ((t || 0) / 180) * Math.PI;
        var r = Math.cos(t),
          i = Math.sin(t),
          n = 1 / 3,
          o = (0, Math.sqrt)(n),
          s = [
            r + (1 - r) * n,
            n * (1 - r) - o * i,
            n * (1 - r) + o * i,
            0,
            0,
            n * (1 - r) + o * i,
            r + n * (1 - r),
            n * (1 - r) - o * i,
            0,
            0,
            n * (1 - r) - o * i,
            n * (1 - r) + o * i,
            r + n * (1 - r),
            0,
            0,
            0,
            0,
            0,
            1,
            0,
          ];
        this._loadMatrix(s, e);
      }),
      (e.prototype.contrast = function (t, e) {
        var r = (t || 0) + 1,
          i = -0.5 * (r - 1),
          n = [r, 0, 0, 0, i, 0, r, 0, 0, i, 0, 0, r, 0, i, 0, 0, 0, 1, 0];
        this._loadMatrix(n, e);
      }),
      (e.prototype.saturate = function (t, e) {
        void 0 === t && (t = 0);
        var r = (2 * t) / 3 + 1,
          i = -0.5 * (r - 1),
          n = [r, i, i, 0, 0, i, r, i, 0, 0, i, i, r, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(n, e);
      }),
      (e.prototype.desaturate = function () {
        this.saturate(-1);
      }),
      (e.prototype.negative = function (t) {
        this._loadMatrix(
          [-1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, 0],
          t
        );
      }),
      (e.prototype.sepia = function (t) {
        this._loadMatrix(
          [
            0.393, 0.7689999, 0.18899999, 0, 0, 0.349, 0.6859999, 0.16799999, 0,
            0, 0.272, 0.5339999, 0.13099999, 0, 0, 0, 0, 0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.technicolor = function (t) {
        this._loadMatrix(
          [
            1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0,
            11.793603434377337, -0.3087833385928097, 1.7658908555458428,
            -0.10601743074722245, 0, -70.35205161461398, -0.231103377548616,
            -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138, 0, 0,
            0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.polaroid = function (t) {
        this._loadMatrix(
          [
            1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016,
            -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.toBGR = function (t) {
        this._loadMatrix(
          [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          t
        );
      }),
      (e.prototype.kodachrome = function (t) {
        this._loadMatrix(
          [
            1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0,
            63.72958762196502, -0.16404339962244616, 1.0835251566291304,
            -0.05498805115633132, 0, 24.732407896706203, -0.16786010706155763,
            -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946, 0, 0,
            0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.browni = function (t) {
        this._loadMatrix(
          [
            0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0,
            47.43192855600873, -0.037703249837783157, 0.8609577587992641,
            0.15059552388459913, 0, -36.96841498319127, 0.24113635128153335,
            -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283, 0,
            0, 0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.vintage = function (t) {
        this._loadMatrix(
          [
            0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0,
            9.651285835294123, 0.02578397704808868, 0.6441188644374771,
            0.03259127616149294, 0, 7.462829176470591, 0.0466055556782719,
            -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296, 0, 0,
            0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.colorTone = function (t, e, r, i, n) {
        var o = (((r = r || 16770432) >> 16) & 255) / 255,
          s = ((r >> 8) & 255) / 255,
          a = (255 & r) / 255,
          h = (((i = i || 3375104) >> 16) & 255) / 255,
          u = ((i >> 8) & 255) / 255,
          l = (255 & i) / 255,
          c = [
            0.3,
            0.59,
            0.11,
            0,
            0,
            o,
            s,
            a,
            (t = t || 0.2),
            0,
            h,
            u,
            l,
            (e = e || 0.15),
            0,
            o - h,
            s - u,
            a - l,
            0,
            0,
          ];
        this._loadMatrix(c, n);
      }),
      (e.prototype.night = function (t, e) {
        var r = [
          -2 * (t = t || 0.1),
          -t,
          0,
          0,
          0,
          -t,
          0,
          t,
          0,
          0,
          0,
          t,
          2 * t,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
        ];
        this._loadMatrix(r, e);
      }),
      (e.prototype.predator = function (t, e) {
        var r = [
          11.224130630493164 * t,
          -4.794486999511719 * t,
          -2.8746118545532227 * t,
          0 * t,
          0.40342438220977783 * t,
          -3.6330697536468506 * t,
          9.193157196044922 * t,
          -2.951810836791992 * t,
          0 * t,
          -1.316135048866272 * t,
          -3.2184197902679443 * t,
          -4.2375030517578125 * t,
          7.476448059082031 * t,
          0 * t,
          0.8044459223747253 * t,
          0,
          0,
          0,
          1,
          0,
        ];
        this._loadMatrix(r, e);
      }),
      (e.prototype.lsd = function (t) {
        this._loadMatrix(
          [
            2, -0.4, 0.5, 0, 0, -0.5, 2, -0.4, 0, 0, -0.4, -0.5, 3, 0, 0, 0, 0,
            0, 1, 0,
          ],
          t
        );
      }),
      (e.prototype.reset = function () {
        this._loadMatrix(
          [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          !1
        );
      }),
      Object.defineProperty(e.prototype, "matrix", {
        get: function () {
          return this.uniforms.m;
        },
        set: function (t) {
          this.uniforms.m = t;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "alpha", {
        get: function () {
          return this.uniforms.uAlpha;
        },
        set: function (t) {
          this.uniforms.uAlpha = t;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Vn);
  Lu.prototype.grayscale = Lu.prototype.greyscale;
  /*!
   * @pixi/filter-displacement - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/filter-displacement is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */ var Fu =
    function (t, e) {
      return (
        (Fu =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Fu(t, e)
      );
    };
  var Uu = (function (t) {
      function e(e, r) {
        var i = this,
          n = new gr();
        return (
          (e.renderable = !1),
          ((i =
            t.call(
              this,
              "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n\tgl_Position = filterVertexPosition();\n\tvTextureCoord = filterTextureCoord();\n\tvFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n",
              "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n",
              {
                mapSampler: e._texture,
                filterMatrix: n,
                scale: { x: 1, y: 1 },
                rotation: new Float32Array([1, 0, 0, 1]),
              }
            ) || this).maskSprite = e),
          (i.maskMatrix = n),
          null == r && (r = 20),
          (i.scale = new fr(r, r)),
          i
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          Fu(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(e, t),
        (e.prototype.apply = function (t, e, r, i) {
          (this.uniforms.filterMatrix = t.calculateSpriteMatrix(
            this.maskMatrix,
            this.maskSprite
          )),
            (this.uniforms.scale.x = this.scale.x),
            (this.uniforms.scale.y = this.scale.y);
          var n = this.maskSprite.worldTransform,
            o = Math.sqrt(n.a * n.a + n.b * n.b),
            s = Math.sqrt(n.c * n.c + n.d * n.d);
          0 !== o &&
            0 !== s &&
            ((this.uniforms.rotation[0] = n.a / o),
            (this.uniforms.rotation[1] = n.b / o),
            (this.uniforms.rotation[2] = n.c / s),
            (this.uniforms.rotation[3] = n.d / s)),
            t.applyFilter(this, e, r, i);
        }),
        Object.defineProperty(e.prototype, "map", {
          get: function () {
            return this.uniforms.mapSampler;
          },
          set: function (t) {
            this.uniforms.mapSampler = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(Vn),
    Bu = function (t, e) {
      return (
        (Bu =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Bu(t, e)
      );
    };
  var Gu = (function (t) {
      function e() {
        return (
          t.call(
            this,
            "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n",
            'varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\nuniform sampler2D uSampler;\nuniform highp vec4 inputSize;\n\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n\n --\n\n From:\n https://github.com/mitsuhiko/webgl-meincraft\n\n Copyright (c) 2011 by Armin Ronacher.\n\n Some rights reserved.\n\n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n\n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n\n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n\n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec4 color;\n\n      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n'
          ) || this
        );
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          Bu(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(e, t),
        e
      );
    })(Vn),
    Xu = function (t, e) {
      return (
        (Xu =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        Xu(t, e)
      );
    };
  var ku,
    Hu,
    Yu,
    ju,
    Vu,
    Wu,
    zu,
    qu,
    Ku,
    Zu,
    Qu,
    Ju,
    $u,
    tl,
    el,
    rl,
    il,
    nl,
    ol,
    sl = (function (t) {
      function e(e, r) {
        void 0 === e && (e = 0.5), void 0 === r && (r = Math.random());
        var i =
          t.call(
            this,
            Po,
            "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n",
            { uNoise: 0, uSeed: 0 }
          ) || this;
        return (i.noise = e), (i.seed = r), i;
      }
      return (
        (function (t, e) {
          function r() {
            this.constructor = t;
          }
          Xu(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((r.prototype = e.prototype), new r()));
        })(e, t),
        Object.defineProperty(e.prototype, "noise", {
          get: function () {
            return this.uniforms.uNoise;
          },
          set: function (t) {
            this.uniforms.uNoise = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "seed", {
          get: function () {
            return this.uniforms.uSeed;
          },
          set: function (t) {
            this.uniforms.uSeed = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        e
      );
    })(Vn);
  !(function (t) {
    (t[(t.WEBGL_LEGACY = 0)] = "WEBGL_LEGACY"),
      (t[(t.WEBGL = 1)] = "WEBGL"),
      (t[(t.WEBGL2 = 2)] = "WEBGL2");
  })(ku || (ku = {})),
    (function (t) {
      (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
        (t[(t.WEBGL = 1)] = "WEBGL"),
        (t[(t.CANVAS = 2)] = "CANVAS");
    })(Hu || (Hu = {})),
    (function (t) {
      (t[(t.COLOR = 16384)] = "COLOR"),
        (t[(t.DEPTH = 256)] = "DEPTH"),
        (t[(t.STENCIL = 1024)] = "STENCIL");
    })(Yu || (Yu = {})),
    (function (t) {
      (t[(t.NORMAL = 0)] = "NORMAL"),
        (t[(t.ADD = 1)] = "ADD"),
        (t[(t.MULTIPLY = 2)] = "MULTIPLY"),
        (t[(t.SCREEN = 3)] = "SCREEN"),
        (t[(t.OVERLAY = 4)] = "OVERLAY"),
        (t[(t.DARKEN = 5)] = "DARKEN"),
        (t[(t.LIGHTEN = 6)] = "LIGHTEN"),
        (t[(t.COLOR_DODGE = 7)] = "COLOR_DODGE"),
        (t[(t.COLOR_BURN = 8)] = "COLOR_BURN"),
        (t[(t.HARD_LIGHT = 9)] = "HARD_LIGHT"),
        (t[(t.SOFT_LIGHT = 10)] = "SOFT_LIGHT"),
        (t[(t.DIFFERENCE = 11)] = "DIFFERENCE"),
        (t[(t.EXCLUSION = 12)] = "EXCLUSION"),
        (t[(t.HUE = 13)] = "HUE"),
        (t[(t.SATURATION = 14)] = "SATURATION"),
        (t[(t.COLOR = 15)] = "COLOR"),
        (t[(t.LUMINOSITY = 16)] = "LUMINOSITY"),
        (t[(t.NORMAL_NPM = 17)] = "NORMAL_NPM"),
        (t[(t.ADD_NPM = 18)] = "ADD_NPM"),
        (t[(t.SCREEN_NPM = 19)] = "SCREEN_NPM"),
        (t[(t.NONE = 20)] = "NONE"),
        (t[(t.SRC_OVER = 0)] = "SRC_OVER"),
        (t[(t.SRC_IN = 21)] = "SRC_IN"),
        (t[(t.SRC_OUT = 22)] = "SRC_OUT"),
        (t[(t.SRC_ATOP = 23)] = "SRC_ATOP"),
        (t[(t.DST_OVER = 24)] = "DST_OVER"),
        (t[(t.DST_IN = 25)] = "DST_IN"),
        (t[(t.DST_OUT = 26)] = "DST_OUT"),
        (t[(t.DST_ATOP = 27)] = "DST_ATOP"),
        (t[(t.ERASE = 26)] = "ERASE"),
        (t[(t.SUBTRACT = 28)] = "SUBTRACT"),
        (t[(t.XOR = 29)] = "XOR");
    })(ju || (ju = {})),
    (function (t) {
      (t[(t.POINTS = 0)] = "POINTS"),
        (t[(t.LINES = 1)] = "LINES"),
        (t[(t.LINE_LOOP = 2)] = "LINE_LOOP"),
        (t[(t.LINE_STRIP = 3)] = "LINE_STRIP"),
        (t[(t.TRIANGLES = 4)] = "TRIANGLES"),
        (t[(t.TRIANGLE_STRIP = 5)] = "TRIANGLE_STRIP"),
        (t[(t.TRIANGLE_FAN = 6)] = "TRIANGLE_FAN");
    })(Vu || (Vu = {})),
    (function (t) {
      (t[(t.RGBA = 6408)] = "RGBA"),
        (t[(t.RGB = 6407)] = "RGB"),
        (t[(t.RG = 33319)] = "RG"),
        (t[(t.RED = 6403)] = "RED"),
        (t[(t.RGBA_INTEGER = 36249)] = "RGBA_INTEGER"),
        (t[(t.RGB_INTEGER = 36248)] = "RGB_INTEGER"),
        (t[(t.RG_INTEGER = 33320)] = "RG_INTEGER"),
        (t[(t.RED_INTEGER = 36244)] = "RED_INTEGER"),
        (t[(t.ALPHA = 6406)] = "ALPHA"),
        (t[(t.LUMINANCE = 6409)] = "LUMINANCE"),
        (t[(t.LUMINANCE_ALPHA = 6410)] = "LUMINANCE_ALPHA"),
        (t[(t.DEPTH_COMPONENT = 6402)] = "DEPTH_COMPONENT"),
        (t[(t.DEPTH_STENCIL = 34041)] = "DEPTH_STENCIL");
    })(Wu || (Wu = {})),
    (function (t) {
      (t[(t.TEXTURE_2D = 3553)] = "TEXTURE_2D"),
        (t[(t.TEXTURE_CUBE_MAP = 34067)] = "TEXTURE_CUBE_MAP"),
        (t[(t.TEXTURE_2D_ARRAY = 35866)] = "TEXTURE_2D_ARRAY"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
          "TEXTURE_CUBE_MAP_POSITIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_X"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
        (t[(t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
          "TEXTURE_CUBE_MAP_POSITIVE_Z"),
        (t[(t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
          "TEXTURE_CUBE_MAP_NEGATIVE_Z");
    })(zu || (zu = {})),
    (function (t) {
      (t[(t.UNSIGNED_BYTE = 5121)] = "UNSIGNED_BYTE"),
        (t[(t.UNSIGNED_SHORT = 5123)] = "UNSIGNED_SHORT"),
        (t[(t.UNSIGNED_SHORT_5_6_5 = 33635)] = "UNSIGNED_SHORT_5_6_5"),
        (t[(t.UNSIGNED_SHORT_4_4_4_4 = 32819)] = "UNSIGNED_SHORT_4_4_4_4"),
        (t[(t.UNSIGNED_SHORT_5_5_5_1 = 32820)] = "UNSIGNED_SHORT_5_5_5_1"),
        (t[(t.UNSIGNED_INT = 5125)] = "UNSIGNED_INT"),
        (t[(t.UNSIGNED_INT_10F_11F_11F_REV = 35899)] =
          "UNSIGNED_INT_10F_11F_11F_REV"),
        (t[(t.UNSIGNED_INT_2_10_10_10_REV = 33640)] =
          "UNSIGNED_INT_2_10_10_10_REV"),
        (t[(t.UNSIGNED_INT_24_8 = 34042)] = "UNSIGNED_INT_24_8"),
        (t[(t.UNSIGNED_INT_5_9_9_9_REV = 35902)] = "UNSIGNED_INT_5_9_9_9_REV"),
        (t[(t.BYTE = 5120)] = "BYTE"),
        (t[(t.SHORT = 5122)] = "SHORT"),
        (t[(t.INT = 5124)] = "INT"),
        (t[(t.FLOAT = 5126)] = "FLOAT"),
        (t[(t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269)] =
          "FLOAT_32_UNSIGNED_INT_24_8_REV"),
        (t[(t.HALF_FLOAT = 36193)] = "HALF_FLOAT");
    })(qu || (qu = {})),
    (function (t) {
      (t[(t.FLOAT = 0)] = "FLOAT"),
        (t[(t.INT = 1)] = "INT"),
        (t[(t.UINT = 2)] = "UINT");
    })(Ku || (Ku = {})),
    (function (t) {
      (t[(t.NEAREST = 0)] = "NEAREST"), (t[(t.LINEAR = 1)] = "LINEAR");
    })(Zu || (Zu = {})),
    (function (t) {
      (t[(t.CLAMP = 33071)] = "CLAMP"),
        (t[(t.REPEAT = 10497)] = "REPEAT"),
        (t[(t.MIRRORED_REPEAT = 33648)] = "MIRRORED_REPEAT");
    })(Qu || (Qu = {})),
    (function (t) {
      (t[(t.OFF = 0)] = "OFF"),
        (t[(t.POW2 = 1)] = "POW2"),
        (t[(t.ON = 2)] = "ON"),
        (t[(t.ON_MANUAL = 3)] = "ON_MANUAL");
    })(Ju || (Ju = {})),
    (function (t) {
      (t[(t.NPM = 0)] = "NPM"),
        (t[(t.UNPACK = 1)] = "UNPACK"),
        (t[(t.PMA = 2)] = "PMA"),
        (t[(t.NO_PREMULTIPLIED_ALPHA = 0)] = "NO_PREMULTIPLIED_ALPHA"),
        (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = "PREMULTIPLY_ON_UPLOAD"),
        (t[(t.PREMULTIPLY_ALPHA = 2)] = "PREMULTIPLY_ALPHA"),
        (t[(t.PREMULTIPLIED_ALPHA = 2)] = "PREMULTIPLIED_ALPHA");
    })($u || ($u = {})),
    (function (t) {
      (t[(t.NO = 0)] = "NO"),
        (t[(t.YES = 1)] = "YES"),
        (t[(t.AUTO = 2)] = "AUTO"),
        (t[(t.BLEND = 0)] = "BLEND"),
        (t[(t.CLEAR = 1)] = "CLEAR"),
        (t[(t.BLIT = 2)] = "BLIT");
    })(tl || (tl = {})),
    (function (t) {
      (t[(t.AUTO = 0)] = "AUTO"), (t[(t.MANUAL = 1)] = "MANUAL");
    })(el || (el = {})),
    (function (t) {
      (t.LOW = "lowp"), (t.MEDIUM = "mediump"), (t.HIGH = "highp");
    })(rl || (rl = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.SCISSOR = 1)] = "SCISSOR"),
        (t[(t.STENCIL = 2)] = "STENCIL"),
        (t[(t.SPRITE = 3)] = "SPRITE");
    })(il || (il = {})),
    (function (t) {
      (t[(t.NONE = 0)] = "NONE"),
        (t[(t.LOW = 2)] = "LOW"),
        (t[(t.MEDIUM = 4)] = "MEDIUM"),
        (t[(t.HIGH = 8)] = "HIGH");
    })(nl || (nl = {})),
    (function (t) {
      (t[(t.ELEMENT_ARRAY_BUFFER = 34963)] = "ELEMENT_ARRAY_BUFFER"),
        (t[(t.ARRAY_BUFFER = 34962)] = "ARRAY_BUFFER"),
        (t[(t.UNIFORM_BUFFER = 35345)] = "UNIFORM_BUFFER");
    })(ol || (ol = {}));
  var al = new gr();
  ($r.prototype._cacheAsBitmap = !1),
    ($r.prototype._cacheData = null),
    ($r.prototype._cacheAsBitmapResolution = null),
    ($r.prototype._cacheAsBitmapMultisample = nl.NONE);
  var hl = function () {
    (this.textureCacheId = null),
      (this.originalRender = null),
      (this.originalRenderCanvas = null),
      (this.originalCalculateBounds = null),
      (this.originalGetLocalBounds = null),
      (this.originalUpdateTransform = null),
      (this.originalDestroy = null),
      (this.originalMask = null),
      (this.originalFilterArea = null),
      (this.originalContainsPoint = null),
      (this.sprite = null);
  };
  Object.defineProperties($r.prototype, {
    cacheAsBitmapResolution: {
      get: function () {
        return this._cacheAsBitmapResolution;
      },
      set: function (t) {
        t !== this._cacheAsBitmapResolution &&
          ((this._cacheAsBitmapResolution = t),
          this.cacheAsBitmap &&
            ((this.cacheAsBitmap = !1), (this.cacheAsBitmap = !0)));
      },
    },
    cacheAsBitmapMultisample: {
      get: function () {
        return this._cacheAsBitmapMultisample;
      },
      set: function (t) {
        t !== this._cacheAsBitmapMultisample &&
          ((this._cacheAsBitmapMultisample = t),
          this.cacheAsBitmap &&
            ((this.cacheAsBitmap = !1), (this.cacheAsBitmap = !0)));
      },
    },
    cacheAsBitmap: {
      get: function () {
        return this._cacheAsBitmap;
      },
      set: function (t) {
        var e;
        this._cacheAsBitmap !== t &&
          ((this._cacheAsBitmap = t),
          t
            ? (this._cacheData || (this._cacheData = new hl()),
              ((e = this._cacheData).originalRender = this.render),
              (e.originalRenderCanvas = this.renderCanvas),
              (e.originalUpdateTransform = this.updateTransform),
              (e.originalCalculateBounds = this.calculateBounds),
              (e.originalGetLocalBounds = this.getLocalBounds),
              (e.originalDestroy = this.destroy),
              (e.originalContainsPoint = this.containsPoint),
              (e.originalMask = this._mask),
              (e.originalFilterArea = this.filterArea),
              (this.render = this._renderCached),
              (this.renderCanvas = this._renderCachedCanvas),
              (this.destroy = this._cacheAsBitmapDestroy))
            : ((e = this._cacheData).sprite &&
                this._destroyCachedDisplayObject(),
              (this.render = e.originalRender),
              (this.renderCanvas = e.originalRenderCanvas),
              (this.calculateBounds = e.originalCalculateBounds),
              (this.getLocalBounds = e.originalGetLocalBounds),
              (this.destroy = e.originalDestroy),
              (this.updateTransform = e.originalUpdateTransform),
              (this.containsPoint = e.originalContainsPoint),
              (this._mask = e.originalMask),
              (this.filterArea = e.originalFilterArea)));
      },
    },
  }),
    ($r.prototype._renderCached = function (t) {
      !this.visible ||
        this.worldAlpha <= 0 ||
        !this.renderable ||
        (this._initCachedDisplayObject(t),
        (this._cacheData.sprite.transform._worldID = this.transform._worldID),
        (this._cacheData.sprite.worldAlpha = this.worldAlpha),
        this._cacheData.sprite._render(t));
    }),
    ($r.prototype._initCachedDisplayObject = function (t) {
      var e;
      if (!this._cacheData || !this._cacheData.sprite) {
        var r = this.alpha;
        (this.alpha = 1), t.batch.flush();
        var i = this.getLocalBounds(null, !0).clone();
        if (this.filters && this.filters.length) {
          var n = this.filters[0].padding;
          i.pad(n);
        }
        i.ceil(bt.RESOLUTION);
        var o = t.renderTexture.current,
          s = t.renderTexture.sourceFrame.clone(),
          a = t.renderTexture.destinationFrame.clone(),
          h = t.projection.transform,
          u = ji.create({
            width: i.width,
            height: i.height,
            resolution: this.cacheAsBitmapResolution || t.resolution,
            multisample:
              null !== (e = this.cacheAsBitmapMultisample) && void 0 !== e
                ? e
                : t.multisample,
          }),
          l = "cacheAsBitmap_" + Ze();
        (this._cacheData.textureCacheId = l),
          Si.addToCache(u.baseTexture, l),
          Hi.addToCache(u, l);
        var c = this.transform.localTransform
          .copyTo(al)
          .invert()
          .translate(-i.x, -i.y);
        (this.render = this._cacheData.originalRender),
          t.render(this, {
            renderTexture: u,
            clear: !0,
            transform: c,
            skipUpdateTransform: !1,
          }),
          t.framebuffer.blit(),
          (t.projection.transform = h),
          t.renderTexture.bind(o, s, a),
          (this.render = this._renderCached),
          (this.updateTransform = this.displayObjectUpdateTransform),
          (this.calculateBounds = this._calculateCachedBounds),
          (this.getLocalBounds = this._getCachedLocalBounds),
          (this._mask = null),
          (this.filterArea = null),
          (this.alpha = r);
        var d = new eh(u);
        (d.transform.worldTransform = this.transform.worldTransform),
          (d.anchor.x = -i.x / i.width),
          (d.anchor.y = -i.y / i.height),
          (d.alpha = r),
          (d._bounds = this._bounds),
          (this._cacheData.sprite = d),
          (this.transform._parentID = -1),
          this.parent
            ? this.updateTransform()
            : (this.enableTempParent(),
              this.updateTransform(),
              this.disableTempParent(null)),
          (this.containsPoint = d.containsPoint.bind(d));
      }
    }),
    ($r.prototype._renderCachedCanvas = function (t) {
      !this.visible ||
        this.worldAlpha <= 0 ||
        !this.renderable ||
        (this._initCachedDisplayObjectCanvas(t),
        (this._cacheData.sprite.worldAlpha = this.worldAlpha),
        this._cacheData.sprite._renderCanvas(t));
    }),
    ($r.prototype._initCachedDisplayObjectCanvas = function (t) {
      if (!this._cacheData || !this._cacheData.sprite) {
        var e = this.getLocalBounds(null, !0),
          r = this.alpha;
        this.alpha = 1;
        var i = t.context,
          n = t._projTransform;
        e.ceil(bt.RESOLUTION);
        var o = ji.create({ width: e.width, height: e.height }),
          s = "cacheAsBitmap_" + Ze();
        (this._cacheData.textureCacheId = s),
          Si.addToCache(o.baseTexture, s),
          Hi.addToCache(o, s);
        var a = al;
        this.transform.localTransform.copyTo(a),
          a.invert(),
          (a.tx -= e.x),
          (a.ty -= e.y),
          (this.renderCanvas = this._cacheData.originalRenderCanvas),
          t.render(this, {
            renderTexture: o,
            clear: !0,
            transform: a,
            skipUpdateTransform: !1,
          }),
          (t.context = i),
          (t._projTransform = n),
          (this.renderCanvas = this._renderCachedCanvas),
          (this.updateTransform = this.displayObjectUpdateTransform),
          (this.calculateBounds = this._calculateCachedBounds),
          (this.getLocalBounds = this._getCachedLocalBounds),
          (this._mask = null),
          (this.filterArea = null),
          (this.alpha = r);
        var h = new eh(o);
        (h.transform.worldTransform = this.transform.worldTransform),
          (h.anchor.x = -e.x / e.width),
          (h.anchor.y = -e.y / e.height),
          (h.alpha = r),
          (h._bounds = this._bounds),
          (this._cacheData.sprite = h),
          (this.transform._parentID = -1),
          this.parent
            ? this.updateTransform()
            : ((this.parent = t._tempDisplayObjectParent),
              this.updateTransform(),
              (this.parent = null)),
          (this.containsPoint = h.containsPoint.bind(h));
      }
    }),
    ($r.prototype._calculateCachedBounds = function () {
      this._bounds.clear(),
        (this._cacheData.sprite.transform._worldID = this.transform._worldID),
        this._cacheData.sprite._calculateBounds(),
        (this._bounds.updateID = this._boundsID);
    }),
    ($r.prototype._getCachedLocalBounds = function () {
      return this._cacheData.sprite.getLocalBounds(null);
    }),
    ($r.prototype._destroyCachedDisplayObject = function () {
      this._cacheData.sprite._texture.destroy(!0),
        (this._cacheData.sprite = null),
        Si.removeFromCache(this._cacheData.textureCacheId),
        Hi.removeFromCache(this._cacheData.textureCacheId),
        (this._cacheData.textureCacheId = null);
    }),
    ($r.prototype._cacheAsBitmapDestroy = function (t) {
      (this.cacheAsBitmap = !1), this.destroy(t);
    }),
    /*!
     * @pixi/mixin-get-child-by-name - v6.3.0
     * Compiled Wed, 23 Mar 2022 18:58:56 UTC
     *
     * @pixi/mixin-get-child-by-name is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    ($r.prototype.name = null),
    (ri.prototype.getChildByName = function (t, e) {
      for (var r = 0, i = this.children.length; r < i; r++)
        if (this.children[r].name === t) return this.children[r];
      if (e)
        for (r = 0, i = this.children.length; r < i; r++) {
          if (this.children[r].getChildByName) {
            var n = this.children[r].getChildByName(t, !0);
            if (n) return n;
          }
        }
      return null;
    }),
    /*!
     * @pixi/mixin-get-global-position - v6.3.0
     * Compiled Wed, 23 Mar 2022 18:58:56 UTC
     *
     * @pixi/mixin-get-global-position is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    ($r.prototype.getGlobalPosition = function (t, e) {
      return (
        void 0 === t && (t = new fr()),
        void 0 === e && (e = !1),
        this.parent
          ? this.parent.toGlobal(this.position, t, e)
          : ((t.x = this.position.x), (t.y = this.position.y)),
        t
      );
    });
  /*!
   * @pixi/mesh-extras - v6.3.0
   * Compiled Wed, 23 Mar 2022 18:58:56 UTC
   *
   * @pixi/mesh-extras is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */ var ul =
    function (t, e) {
      return (
        (ul =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        ul(t, e)
      );
    };
  function ll(t, e) {
    function r() {
      this.constructor = t;
    }
    ul(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var cl = (function (t) {
      function e(e, r, i, n) {
        void 0 === e && (e = 100),
          void 0 === r && (r = 100),
          void 0 === i && (i = 10),
          void 0 === n && (n = 10);
        var o = t.call(this) || this;
        return (
          (o.segWidth = i),
          (o.segHeight = n),
          (o.width = e),
          (o.height = r),
          o.build(),
          o
        );
      }
      return (
        ll(e, t),
        (e.prototype.build = function () {
          for (
            var t = this.segWidth * this.segHeight,
              e = [],
              r = [],
              i = [],
              n = this.segWidth - 1,
              o = this.segHeight - 1,
              s = this.width / n,
              a = this.height / o,
              h = 0;
            h < t;
            h++
          ) {
            var u = h % this.segWidth,
              l = (h / this.segWidth) | 0;
            e.push(u * s, l * a), r.push(u / n, l / o);
          }
          var c = n * o;
          for (h = 0; h < c; h++) {
            var d = h % n,
              f = (h / n) | 0,
              p = f * this.segWidth + d,
              _ = f * this.segWidth + d + 1,
              v = (f + 1) * this.segWidth + d,
              m = (f + 1) * this.segWidth + d + 1;
            i.push(p, _, v, _, m, v);
          }
          (this.buffers[0].data = new Float32Array(e)),
            (this.buffers[1].data = new Float32Array(r)),
            (this.indexBuffer.data = new Uint16Array(i)),
            this.buffers[0].update(),
            this.buffers[1].update(),
            this.indexBuffer.update();
        }),
        e
      );
    })(jh),
    dl = (function (t) {
      function e(e, r, i) {
        void 0 === e && (e = 200), void 0 === i && (i = 0);
        var n =
          t.call(
            this,
            new Float32Array(4 * r.length),
            new Float32Array(4 * r.length),
            new Uint16Array(6 * (r.length - 1))
          ) || this;
        return (
          (n.points = r), (n._width = e), (n.textureScale = i), n.build(), n
        );
      }
      return (
        ll(e, t),
        Object.defineProperty(e.prototype, "width", {
          get: function () {
            return this._width;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.build = function () {
          var t = this.points;
          if (t) {
            var e = this.getBuffer("aVertexPosition"),
              r = this.getBuffer("aTextureCoord"),
              i = this.getIndex();
            if (!(t.length < 1)) {
              e.data.length / 4 !== t.length &&
                ((e.data = new Float32Array(4 * t.length)),
                (r.data = new Float32Array(4 * t.length)),
                (i.data = new Uint16Array(6 * (t.length - 1))));
              var n = r.data,
                o = i.data;
              (n[0] = 0), (n[1] = 0), (n[2] = 0), (n[3] = 1);
              for (
                var s = 0,
                  a = t[0],
                  h = this._width * this.textureScale,
                  u = t.length,
                  l = 0;
                l < u;
                l++
              ) {
                var c = 4 * l;
                if (this.textureScale > 0) {
                  var d = a.x - t[l].x,
                    f = a.y - t[l].y,
                    p = Math.sqrt(d * d + f * f);
                  (a = t[l]), (s += p / h);
                } else s = l / (u - 1);
                (n[c] = s), (n[c + 1] = 0), (n[c + 2] = s), (n[c + 3] = 1);
              }
              var _ = 0;
              for (l = 0; l < u - 1; l++) {
                c = 2 * l;
                (o[_++] = c),
                  (o[_++] = c + 1),
                  (o[_++] = c + 2),
                  (o[_++] = c + 2),
                  (o[_++] = c + 1),
                  (o[_++] = c + 3);
              }
              r.update(), i.update(), this.updateVertices();
            }
          }
        }),
        (e.prototype.updateVertices = function () {
          var t = this.points;
          if (!(t.length < 1)) {
            for (
              var e,
                r = t[0],
                i = 0,
                n = 0,
                o = this.buffers[0].data,
                s = t.length,
                a = 0;
              a < s;
              a++
            ) {
              var h = t[a],
                u = 4 * a;
              (n = -((e = a < t.length - 1 ? t[a + 1] : h).x - r.x)),
                (i = e.y - r.y);
              var l = Math.sqrt(i * i + n * n),
                c =
                  this.textureScale > 0
                    ? (this.textureScale * this._width) / 2
                    : this._width / 2;
              (i /= l),
                (n /= l),
                (i *= c),
                (n *= c),
                (o[u] = h.x + i),
                (o[u + 1] = h.y + n),
                (o[u + 2] = h.x - i),
                (o[u + 3] = h.y - n),
                (r = h);
            }
            this.buffers[0].update();
          }
        }),
        (e.prototype.update = function () {
          this.textureScale > 0 ? this.build() : this.updateVertices();
        }),
        e
      );
    })(jh),
    fl = (function (e) {
      function r(r, i, n) {
        void 0 === n && (n = 0);
        var o = this,
          s = new dl(r.height, i, n),
          a = new Yh(r);
        return (
          n > 0 && (r.baseTexture.wrapMode = t.WRAP_MODES.REPEAT),
          ((o = e.call(this, s, a) || this).autoUpdate = !0),
          o
        );
      }
      return (
        ll(r, e),
        (r.prototype._render = function (t) {
          var r = this.geometry;
          (this.autoUpdate || r._width !== this.shader.texture.height) &&
            ((r._width = this.shader.texture.height), r.update()),
            e.prototype._render.call(this, t);
        }),
        r
      );
    })(Hh),
    pl = (function (t) {
      function e(e, r, i) {
        var n = this,
          o = new cl(e.width, e.height, r, i),
          s = new Yh(Hi.WHITE);
        return (
          ((n = t.call(this, o, s) || this).texture = e), (n.autoResize = !0), n
        );
      }
      return (
        ll(e, t),
        (e.prototype.textureUpdated = function () {
          this._textureID = this.shader.texture._updateID;
          var t = this.geometry,
            e = this.shader.texture,
            r = e.width,
            i = e.height;
          !this.autoResize ||
            (t.width === r && t.height === i) ||
            ((t.width = this.shader.texture.width),
            (t.height = this.shader.texture.height),
            t.build());
        }),
        Object.defineProperty(e.prototype, "texture", {
          get: function () {
            return this.shader.texture;
          },
          set: function (t) {
            this.shader.texture !== t &&
              ((this.shader.texture = t),
              (this._textureID = -1),
              t.baseTexture.valid
                ? this.textureUpdated()
                : t.once("update", this.textureUpdated, this));
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype._render = function (e) {
          this._textureID !== this.shader.texture._updateID &&
            this.textureUpdated(),
            t.prototype._render.call(this, e);
        }),
        (e.prototype.destroy = function (e) {
          this.shader.texture.off("update", this.textureUpdated, this),
            t.prototype.destroy.call(this, e);
        }),
        e
      );
    })(Hh),
    _l = (function (t) {
      function e(e, r, i, n, o) {
        void 0 === e && (e = Hi.EMPTY);
        var s = this,
          a = new jh(r, i, n);
        a.getBuffer("aVertexPosition").static = !1;
        var h = new Yh(e);
        return ((s = t.call(this, a, h, null, o) || this).autoUpdate = !0), s;
      }
      return (
        ll(e, t),
        Object.defineProperty(e.prototype, "vertices", {
          get: function () {
            return this.geometry.getBuffer("aVertexPosition").data;
          },
          set: function (t) {
            this.geometry.getBuffer("aVertexPosition").data = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype._render = function (e) {
          this.autoUpdate &&
            this.geometry.getBuffer("aVertexPosition").update(),
            t.prototype._render.call(this, e);
        }),
        e
      );
    })(Hh),
    vl = (function (t) {
      function e(e, r, i, n, o) {
        void 0 === r && (r = 10),
          void 0 === i && (i = 10),
          void 0 === n && (n = 10),
          void 0 === o && (o = 10);
        var s = t.call(this, Hi.WHITE, 4, 4) || this;
        return (
          (s._origWidth = e.orig.width),
          (s._origHeight = e.orig.height),
          (s._width = s._origWidth),
          (s._height = s._origHeight),
          (s._leftWidth = r),
          (s._rightWidth = n),
          (s._topHeight = i),
          (s._bottomHeight = o),
          (s.texture = e),
          s
        );
      }
      return (
        ll(e, t),
        (e.prototype.textureUpdated = function () {
          (this._textureID = this.shader.texture._updateID), this._refresh();
        }),
        Object.defineProperty(e.prototype, "vertices", {
          get: function () {
            return this.geometry.getBuffer("aVertexPosition").data;
          },
          set: function (t) {
            this.geometry.getBuffer("aVertexPosition").data = t;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.updateHorizontalVertices = function () {
          var t = this.vertices,
            e = this._getMinScale();
          (t[9] = t[11] = t[13] = t[15] = this._topHeight * e),
            (t[17] =
              t[19] =
              t[21] =
              t[23] =
                this._height - this._bottomHeight * e),
            (t[25] = t[27] = t[29] = t[31] = this._height);
        }),
        (e.prototype.updateVerticalVertices = function () {
          var t = this.vertices,
            e = this._getMinScale();
          (t[2] = t[10] = t[18] = t[26] = this._leftWidth * e),
            (t[4] = t[12] = t[20] = t[28] = this._width - this._rightWidth * e),
            (t[6] = t[14] = t[22] = t[30] = this._width);
        }),
        (e.prototype._getMinScale = function () {
          var t = this._leftWidth + this._rightWidth,
            e = this._width > t ? 1 : this._width / t,
            r = this._topHeight + this._bottomHeight,
            i = this._height > r ? 1 : this._height / r;
          return Math.min(e, i);
        }),
        Object.defineProperty(e.prototype, "width", {
          get: function () {
            return this._width;
          },
          set: function (t) {
            (this._width = t), this._refresh();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "height", {
          get: function () {
            return this._height;
          },
          set: function (t) {
            (this._height = t), this._refresh();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "leftWidth", {
          get: function () {
            return this._leftWidth;
          },
          set: function (t) {
            (this._leftWidth = t), this._refresh();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "rightWidth", {
          get: function () {
            return this._rightWidth;
          },
          set: function (t) {
            (this._rightWidth = t), this._refresh();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "topHeight", {
          get: function () {
            return this._topHeight;
          },
          set: function (t) {
            (this._topHeight = t), this._refresh();
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e.prototype, "bottomHeight", {
          get: function () {
            return this._bottomHeight;
          },
          set: function (t) {
            (this._bottomHeight = t), this._refresh();
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype._refresh = function () {
          var t = this.texture,
            e = this.geometry.buffers[1].data;
          (this._origWidth = t.orig.width), (this._origHeight = t.orig.height);
          var r = 1 / this._origWidth,
            i = 1 / this._origHeight;
          (e[0] = e[8] = e[16] = e[24] = 0),
            (e[1] = e[3] = e[5] = e[7] = 0),
            (e[6] = e[14] = e[22] = e[30] = 1),
            (e[25] = e[27] = e[29] = e[31] = 1),
            (e[2] = e[10] = e[18] = e[26] = r * this._leftWidth),
            (e[4] = e[12] = e[20] = e[28] = 1 - r * this._rightWidth),
            (e[9] = e[11] = e[13] = e[15] = i * this._topHeight),
            (e[17] = e[19] = e[21] = e[23] = 1 - i * this._bottomHeight),
            this.updateHorizontalVertices(),
            this.updateVerticalVertices(),
            this.geometry.buffers[0].update(),
            this.geometry.buffers[1].update();
        }),
        e
      );
    })(pl),
    ml = function (t, e) {
      return (
        (ml =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          }),
        ml(t, e)
      );
    };
  var El = (function (e) {
    function r(t, r) {
      void 0 === r && (r = !0);
      var i = e.call(this, t[0] instanceof Hi ? t[0] : t[0].texture) || this;
      return (
        (i._textures = null),
        (i._durations = null),
        (i._autoUpdate = r),
        (i._isConnectedToTicker = !1),
        (i.animationSpeed = 1),
        (i.loop = !0),
        (i.updateAnchor = !1),
        (i.onComplete = null),
        (i.onFrameChange = null),
        (i.onLoop = null),
        (i._currentTime = 0),
        (i._playing = !1),
        (i._previousFrame = null),
        (i.textures = t),
        i
      );
    }
    return (
      (function (t, e) {
        function r() {
          this.constructor = t;
        }
        ml(t, e),
          (t.prototype =
            null === e
              ? Object.create(e)
              : ((r.prototype = e.prototype), new r()));
      })(r, e),
      (r.prototype.stop = function () {
        this._playing &&
          ((this._playing = !1),
          this._autoUpdate &&
            this._isConnectedToTicker &&
            (ai.shared.remove(this.update, this),
            (this._isConnectedToTicker = !1)));
      }),
      (r.prototype.play = function () {
        this._playing ||
          ((this._playing = !0),
          this._autoUpdate &&
            !this._isConnectedToTicker &&
            (ai.shared.add(this.update, this, t.UPDATE_PRIORITY.HIGH),
            (this._isConnectedToTicker = !0)));
      }),
      (r.prototype.gotoAndStop = function (t) {
        this.stop();
        var e = this.currentFrame;
        (this._currentTime = t),
          e !== this.currentFrame && this.updateTexture();
      }),
      (r.prototype.gotoAndPlay = function (t) {
        var e = this.currentFrame;
        (this._currentTime = t),
          e !== this.currentFrame && this.updateTexture(),
          this.play();
      }),
      (r.prototype.update = function (t) {
        if (this._playing) {
          var e = this.animationSpeed * t,
            r = this.currentFrame;
          if (null !== this._durations) {
            var i =
              (this._currentTime % 1) * this._durations[this.currentFrame];
            for (i += (e / 60) * 1e3; i < 0; )
              this._currentTime--, (i += this._durations[this.currentFrame]);
            var n = Math.sign(this.animationSpeed * t);
            for (
              this._currentTime = Math.floor(this._currentTime);
              i >= this._durations[this.currentFrame];

            )
              (i -= this._durations[this.currentFrame] * n),
                (this._currentTime += n);
            this._currentTime += i / this._durations[this.currentFrame];
          } else this._currentTime += e;
          this._currentTime < 0 && !this.loop
            ? (this.gotoAndStop(0), this.onComplete && this.onComplete())
            : this._currentTime >= this._textures.length && !this.loop
            ? (this.gotoAndStop(this._textures.length - 1),
              this.onComplete && this.onComplete())
            : r !== this.currentFrame &&
              (this.loop &&
                this.onLoop &&
                ((this.animationSpeed > 0 && this.currentFrame < r) ||
                  (this.animationSpeed < 0 && this.currentFrame > r)) &&
                this.onLoop(),
              this.updateTexture());
        }
      }),
      (r.prototype.updateTexture = function () {
        var t = this.currentFrame;
        this._previousFrame !== t &&
          ((this._previousFrame = t),
          (this._texture = this._textures[t]),
          (this._textureID = -1),
          (this._textureTrimmedID = -1),
          (this._cachedTint = 16777215),
          (this.uvs = this._texture._uvs.uvsFloat32),
          this.updateAnchor &&
            this._anchor.copyFrom(this._texture.defaultAnchor),
          this.onFrameChange && this.onFrameChange(this.currentFrame));
      }),
      (r.prototype.destroy = function (t) {
        this.stop(),
          e.prototype.destroy.call(this, t),
          (this.onComplete = null),
          (this.onFrameChange = null),
          (this.onLoop = null);
      }),
      (r.fromFrames = function (t) {
        for (var e = [], i = 0; i < t.length; ++i) e.push(Hi.from(t[i]));
        return new r(e);
      }),
      (r.fromImages = function (t) {
        for (var e = [], i = 0; i < t.length; ++i) e.push(Hi.from(t[i]));
        return new r(e);
      }),
      Object.defineProperty(r.prototype, "totalFrames", {
        get: function () {
          return this._textures.length;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "textures", {
        get: function () {
          return this._textures;
        },
        set: function (t) {
          if (t[0] instanceof Hi)
            (this._textures = t), (this._durations = null);
          else {
            (this._textures = []), (this._durations = []);
            for (var e = 0; e < t.length; e++)
              this._textures.push(t[e].texture),
                this._durations.push(t[e].time);
          }
          (this._previousFrame = null),
            this.gotoAndStop(0),
            this.updateTexture();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "currentFrame", {
        get: function () {
          var t = Math.floor(this._currentTime) % this._textures.length;
          return t < 0 && (t += this._textures.length), t;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "playing", {
        get: function () {
          return this._playing;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r.prototype, "autoUpdate", {
        get: function () {
          return this._autoUpdate;
        },
        set: function (t) {
          t !== this._autoUpdate &&
            ((this._autoUpdate = t),
            !this._autoUpdate && this._isConnectedToTicker
              ? (ai.shared.remove(this.update, this),
                (this._isConnectedToTicker = !1))
              : this._autoUpdate &&
                !this._isConnectedToTicker &&
                this._playing &&
                (ai.shared.add(this.update, this),
                (this._isConnectedToTicker = !0)));
        },
        enumerable: !1,
        configurable: !0,
      }),
      r
    );
  })(eh);
  So.registerPlugin("accessibility", oi),
    So.registerPlugin("extract", Ko),
    So.registerPlugin("interaction", vi),
    So.registerPlugin("particle", Ta),
    So.registerPlugin("prepare", Sh),
    So.registerPlugin("batch", Xo),
    So.registerPlugin("tilingSprite", Fh),
    _s.registerPlugin(su),
    _s.registerPlugin(Ps),
    _s.registerPlugin(Zs),
    _s.registerPlugin(da),
    _s.registerPlugin(Ph),
    Wo.registerPlugin(hi),
    Wo.registerPlugin(vs);
  var Tl = {
    AlphaFilter: hu,
    BlurFilter: Cu,
    BlurFilterPass: Du,
    ColorMatrixFilter: Lu,
    DisplacementFilter: Uu,
    FXAAFilter: Gu,
    NoiseFilter: sl,
  };
  return (
    (t.AbstractBatchRenderer = wo),
    (t.AbstractMultiResource = Oi),
    (t.AbstractRenderer = Ro),
    (t.AccessibilityManager = oi),
    (t.AnimatedSprite = El),
    (t.AppLoaderPlugin = vs),
    (t.Application = Wo),
    (t.ArrayResource = Ii),
    (t.Attribute = Wi),
    (t.BaseImageResource = Pi),
    (t.BasePrepare = bh),
    (t.BaseRenderTexture = Gi),
    (t.BaseTexture = Si),
    (t.BatchDrawCall = No),
    (t.BatchGeometry = Fo),
    (t.BatchPluginFactory = Go),
    (t.BatchRenderer = Xo),
    (t.BatchShaderGenerator = Lo),
    (t.BatchSystem = ln),
    (t.BatchTextureArray = Do),
    (t.BitmapFont = eu),
    (t.BitmapFontData = Wh),
    (t.BitmapFontLoader = su),
    (t.BitmapText = ou),
    (t.BlobResource = Os),
    (t.Bounds = Nr),
    (t.Buffer = qi),
    (t.BufferResource = Ai),
    (t.CanvasResource = Mi),
    (t.Circle = vr),
    (t.CompressedTextureLoader = Ps),
    (t.CompressedTextureResource = Is),
    (t.Container = ri),
    (t.ContextSystem = dn),
    (t.CountLimiter = ph),
    (t.CubeResource = Ni),
    (t.DDSLoader = Zs),
    (t.DEG_TO_RAD = dr),
    (t.DisplayObject = $r),
    (t.Ellipse = mr),
    (t.Extract = Ko),
    (t.FORMATS_TO_COMPONENTS = la),
    (t.FillStyle = ga),
    (t.Filter = Vn),
    (t.FilterState = on),
    (t.FilterSystem = hn),
    (t.Framebuffer = Bi),
    (t.FramebufferSystem = _n),
    (t.GLFramebuffer = fn),
    (t.GLProgram = co),
    (t.GLTexture = To),
    (t.GRAPHICS_CURVES = ya),
    (t.Geometry = $i),
    (t.GeometrySystem = mn),
    (t.Graphics = Ka),
    (t.GraphicsData = Ha),
    (t.GraphicsGeometry = Va),
    (t.IGLUniformData = lo),
    (t.INSTALLED = Ei),
    (t.INTERNAL_FORMAT_TO_BYTES_PER_PIXEL = gs),
    (t.ImageBitmapResource = Li),
    (t.ImageResource = Di),
    (t.InteractionData = ui),
    (t.InteractionEvent = ci),
    (t.InteractionManager = vi),
    (t.InteractionTrackingData = di),
    (t.KTXLoader = da),
    (t.LineStyle = Wa),
    (t.Loader = _s),
    (t.MaskData = En),
    (t.MaskSystem = Kn),
    (t.Matrix = gr),
    (t.Mesh = Hh),
    (t.MeshBatchUvs = Gh),
    (t.MeshGeometry = jh),
    (t.MeshMaterial = Yh),
    (t.NineSlicePlane = vl),
    (t.ObjectRenderer = un),
    (t.ObservablePoint = yr),
    (t.PI_2 = lr),
    (t.ParticleContainer = ma),
    (t.ParticleRenderer = Ta),
    (t.PlaneGeometry = cl),
    (t.Point = fr),
    (t.Polygon = Er),
    (t.Prepare = Sh),
    (t.Program = Hn),
    (t.ProjectionSystem = to),
    (t.Quad = tn),
    (t.QuadUv = en),
    (t.RAD_TO_DEG = cr),
    (t.Rectangle = _r),
    (t.RenderTexture = ji),
    (t.RenderTexturePool = Vi),
    (t.RenderTextureSystem = io),
    (t.Renderer = So),
    (t.Resource = Ri),
    (t.RopeGeometry = dl),
    (t.RoundedRectangle = Tr),
    (t.Runner = mi),
    (t.SVGResource = Ci),
    (t.ScissorSystem = Jn),
    (t.Shader = Yn),
    (t.ShaderSystem = vo),
    (t.SimpleMesh = _l),
    (t.SimplePlane = pl),
    (t.SimpleRope = fl),
    (t.Sprite = eh),
    (t.SpriteMaskFilter = qn),
    (t.Spritesheet = Ih),
    (t.SpritesheetLoader = Ph),
    (t.State = jn),
    (t.StateSystem = mo),
    (t.StencilSystem = $n),
    (t.System = Mo),
    (t.TYPES_TO_BYTES_PER_COMPONENT = ua),
    (t.TYPES_TO_BYTES_PER_PIXEL = ca),
    (t.TemporaryDisplayObject = ti),
    (t.Text = dh),
    (t.TextMetrics = uh),
    (t.TextStyle = oh),
    (t.Texture = Hi),
    (t.TextureGCSystem = Eo),
    (t.TextureLoader = ms),
    (t.TextureMatrix = zn),
    (t.TextureSystem = yo),
    (t.TextureUvs = Xi),
    (t.Ticker = ai),
    (t.TickerPlugin = hi),
    (t.TilingSprite = Ch),
    (t.TilingSpriteRenderer = Fh),
    (t.TimeLimiter = Oh),
    (t.Transform = Mr),
    (t.UniformGroup = nn),
    (t.VERSION = "6.3.0"),
    (t.VideoResource = wi),
    (t.ViewableBuffer = Co),
    (t.accessibleTarget = ii),
    (t.autoDetectRenderer = Oo),
    (t.autoDetectResource = Ti),
    (t.checkMaxIfStatementsInShader = Gn),
    (t.createUBOElements = ao),
    (t.defaultFilterVertex = Po),
    (t.defaultVertex = Io),
    (t.filters = Tl),
    (t.generateProgram = fo),
    (t.generateUniformBufferSync = uo),
    (t.getTestContext = Sn),
    (t.getUBOData = ho),
    (t.graphicsUtils = Za),
    (t.groupD8 = Pr),
    (t.interactiveTarget = pi),
    (t.isMobile = gt),
    (t.resources = ko),
    (t.settings = bt),
    (t.systems = jo),
    (t.uniformParsers = Cn),
    (t.utils = ur),
    t
  );
})({});
//# sourceMappingURL=index.6f6d1ac2.js.map
