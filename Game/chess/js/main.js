/*
 Platform.js
 Copyright 2014-2020 Benjamin Tan
 Copyright 2011-2013 John-David Dalton
 Available under MIT license
*/
"undefined" == typeof _pio && (_pio = {});
(function() {
    _pio.channel = function() {};
    _pio.channel.prototype.call = function(f, h, d, g, b) {
        var a = "undefined" != typeof PLAYERIO_API_HOST ? PLAYERIO_API_HOST : (PlayerIO.useSecureApiRequests ? "https" : "http") + "://api.playerio.com/json/",
            c = new XMLHttpRequest;
        "withCredentials" in c ? c.open("post", a, !0) : "undefined" != typeof XDomainRequest ? (c = new XDomainRequest, c.open("post", a)) : c = new _pio.flashWebRequest("post", a);
        var e = Error();
        null != c ? (c.send("[" + f + "|" + (this.token || "") + "]" + JSON.stringify(h)), c.onload = function() {
            var k =
                null;
            try {
                var l = c.response || c.responseText;
                if ("[" == l[0]) {
                    var m = l.indexOf("]");
                    this.token = l.substring(1, m);
                    l = l.substring(m + 1)
                }
                k = JSON.parse(l)
            } catch (n) {
                _pio.handleError(e, g, PlayerIOErrorCode.GeneralError, "Error decoding response from webservice: " + n);
                return
            }
            if ("undefined" == typeof k.errorcode && "undefined" == typeof k.message) {
                l = k;
                if (b) try {
                    l = b(k)
                } catch (n) {
                    _pio.handleError(e, g, n.code, n.message)
                }
                d && d(l)
            } else _pio.handleError(e, g, k.errorcode, k.message)
        }, c.onerror = function(k) {
            _pio.handleError(e, g, PlayerIOErrorCode.GeneralError,
                "Error talking to webservice: " + JSON.stringify(k))
        }) : _pio.handleError(e, g, PlayerIOErrorCode.GeneralError, "Need to implement flash calling")
    };
    _pio.runCallback = function(f, h, d) {
        try {
            f && f(h)
        } catch (g) {
            f = "Unhandled error in callback: " + g.message, f = f + "\nStack:\n" + (g.stack || g.stacktrace || g.StackTrace), d && (f = f + "\nCallsite stack:\n" + (d.stack || d.stacktrace || d.StackTrace)), console.log(f)
        }
    };
    _pio.handleError = function(f, h, d, g) {
        d = _pio.error(d, g);
        f && (f.stack && (d.stack = f.stack), f.stacktrace && (d.stacktrace = f.stacktrace),
            f.StackTrace && (d.StackTrace = f.StackTrace));
        h ? _pio.runCallback(h, d, f) : "undefined" != typeof console ? console.log("No error callback specified for: " + d.code + ": " + d.message + "\n" + (d.stack || d.stacktrace || d.StackTrace)) : alert("No error callback specified for: " + d.code + ": " + d.message + "\n" + (d.stack || d.stacktrace || d.StackTrace))
    };
    _pio.error = function(f, h) {
        1 == arguments.length && (h = f, f = PlayerIOErrorCode.GeneralError);
        "number" == typeof f && (f = PlayerIOErrorCode.codes[f]);
        if ("string" != typeof f) throw console.log(f, h, Error().stack),
            "Code must be a string!";
        var d = Error();
        return new PlayerIOError(f, h, d.stack || d.stacktrace || d.StackTrace)
    };
    _pio.debugLog = function(f) {
        "undefined" != typeof console && console.log(f)
    };
    _pio.convertToKVArray = function(f) {
        var h = [];
        if (f)
            for (var d in f) h.push({
                key: "" + d,
                value: "" + f[d]
            });
        return h
    };
    _pio.convertFromKVArray = function(f) {
        var h = {};
        if (f && f.length)
            for (var d in f) h[f[d].key] = f[d].value;
        return h
    };
    _pio.convertToSegmentArray = function(f) {
        var h = [];
        if (f)
            for (var d in f) h.push(d + ":" + f[d]);
        return h
    }
})();
PlayerIO = {
    useSecureApiRequests: !1,
    authenticate: function(f, h, d, g, b, a) {
        if ("auto" == d.publishingnetworklogin) "undefined" == typeof window.PublishingNetwork ? a(new PlayerIOError(PlayerIOErrorCode.GeneralError, "Could not find the PublishingNetwork object on the current page. Did you include the PublishingNetwork.js script?")) : PublishingNetwork.dialog("login", {
            gameId: f,
            connectionId: h,
            __use_usertoken__: !0
        }, function(e) {
            e.error ? a(new PlayerIOError(PlayerIOErrorCode.GeneralError, e.error)) : "undefined" == typeof e.userToken ?
                a(new PlayerIOError(PlayerIOErrorCode.GeneralError, "Missing userToken value in result, but no error message given.")) : PlayerIO.authenticate(f, h, {
                    userToken: e.userToken
                }, g, b, a)
        });
        else {
            var c = new _pio.channel;
            c.authenticate(f, h, _pio.convertToKVArray(d), _pio.convertToSegmentArray(g), "javascript", _pio.convertToKVArray({}), null, b, a, function(e) {
                c.token = e.token;
                return new _pio.client(c, f, e.gamefsredirectmap, e.userid)
            })
        }
    },
    quickConnect: null,
    gameFS: function(f) {
        return new _pio.gameFS(f)
    }
};
var JSON;
JSON || (JSON = {});
(function() {
    function f(l) {
        return 10 > l ? "0" + l : l
    }

    function h(l) {
        b.lastIndex = 0;
        return b.test(l) ? '"' + l.replace(b, function(m) {
            var n = e[m];
            return "string" === typeof n ? n : "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + l + '"'
    }

    function d(l, m) {
        var n, p = a,
            q = m[l];
        q && "object" === typeof q && "function" === typeof q.toJSON && (q = q.toJSON(l));
        "function" === typeof k && (q = k.call(m, l, q));
        switch (typeof q) {
            case "string":
                return h(q);
            case "number":
                return isFinite(q) ? String(q) : "null";
            case "boolean":
            case "null":
                return String(q);
            case "object":
                if (!q) return "null";
                a += c;
                var u = [];
                if ("[object Array]" === Object.prototype.toString.apply(q)) {
                    var t = q.length;
                    for (n = 0; n < t; n += 1) u[n] = d(n, q) || "null";
                    var r = 0 === u.length ? "[]" : a ? "[\n" + a + u.join(",\n" + a) + "\n" + p + "]" : "[" + u.join(",") + "]";
                    a = p;
                    return r
                }
                if (k && "object" === typeof k)
                    for (t = k.length, n = 0; n < t; n += 1) {
                        if ("string" === typeof k[n]) {
                            var x = k[n];
                            (r = d(x, q)) && u.push(h(x) + (a ? ": " : ":") + r)
                        }
                    } else
                        for (x in q) Object.prototype.hasOwnProperty.call(q, x) && (r = d(x, q)) && u.push(h(x) + (a ? ": " : ":") + r);
                r = 0 === u.length ? "{}" : a ? "{\n" + a + u.join(",\n" + a) + "\n" +
                    p + "}" : "{" + u.join(",") + "}";
                a = p;
                return r
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(l) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(l) {
        return this.valueOf()
    });
    var g = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        b = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        a, c, e = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        k;
    "function" !== typeof JSON.stringify && (JSON.stringify = function(l, m, n) {
        var p;
        c = a = "";
        if ("number" === typeof n)
            for (p = 0; p < n; p += 1) c += " ";
        else "string" === typeof n && (c = n);
        if ((k = m) && "function" !== typeof m && ("object" !== typeof m || "number" !== typeof m.length)) throw Error("JSON.stringify");
        return d("", {
            "": l
        })
    });
    "function" !== typeof JSON.parse && (JSON.parse = function(l, m) {
        function n(q, u) {
            var t, r = q[u];
            if (r && "object" === typeof r)
                for (t in r)
                    if (Object.prototype.hasOwnProperty.call(r, t)) {
                        var x = n(r, t);
                        void 0 !== x ? r[t] = x : delete r[t]
                    }
            return m.call(q, u, r)
        }
        l = String(l);
        g.lastIndex = 0;
        g.test(l) && (l = l.replace(g, function(q) {
            return "\\u" + ("0000" + q.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(l.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            var p = eval("(" + l + ")");
            return "function" === typeof m ? n({
                "": p
            }, "") : p
        }
        throw new SyntaxError("JSON.parse");
    })
})();
(function() {
    function f(e) {
        if (null != b) e(b);
        else if (a) e(null);
        else if (null == c) {
            c = [e];
            var k = setInterval(function() {
                var m = h();
                null != m && l(m)
            }, 50);
            setTimeout(function() {
                null == b && l(null)
            }, 3E4);
            var l = function(m) {
                b = m;
                a = null == m;
                clearInterval(k);
                for (var n = 0; n != c.length; n++) c[n](m)
            }
        } else c.push(e)
    }

    function h() {
        var e = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="10" height="10" style="$style$" id="$id$">\t<param name="movie" value="$src$" />\t<param name="allowNetworking" value="all" />\t<param name="allowScriptAccess" value="always" />\t\x3c!--[if !IE]>--\x3e\t<object type="application/x-shockwave-flash" data="$src$" width="10" height="10" style="$style$">\t\t<param name="allowNetworking" value="all" />\t\t<param name="allowScriptAccess" value="always" />\t</object>\t\x3c!--<![endif]--\x3e</object>'.replace(/\$id\$/gi, "__pio_flashfallback__");
        e = e.replace(/\$src\$/gi, "http://192.168.30.154/html5client/FlashFallback/bin-debug/FlashFallback.swf");
        e = e.replace(/\$style\$/gi, "width:10px;height:10px");
        var k = document.getElementById("containerId");
        if (!k) {
            var l = document.createElement("div");
            l.setAttribute("id", k);
            l.setAttribute("style", "position:absolute;top:-20px;left:-20px");
            l.innerHTML = e;
            try {
                document.body.appendChild(l)
            } catch (m) {}
        }
        e = function(m) {
            m = document.getElementsByTagName(m);
            for (var n = 0; n != m.length; n++)
                if (m[n].ping && "pong" == m[n].ping()) return m[n]
        };
        return e("embed") || e("object")
    }
    var d = {},
        g = 0;
    __pio_flashfallback_callback__ = function() {
        var e = d[arguments[0]];
        if (e) {
            for (var k = [], l = 1; l != arguments.length; l++) k[l - 1] = arguments[l];
            e.apply(null, k)
        }
    };
    _pio.flashWebRequest = function(e, k) {
        var l = this;
        this.response = null;
        this.onload = function() {};
        this.onerror = function() {};
        this.send = function(m) {
            f(function(n) {
                if (null == n) l.onerror("Browser does not support Cross-Origin (CORS) webrequest or Flash as a fallback method");
                else {
                    var p = "cb" + g++;
                    d[p] = function(q, u) {
                        delete d[p];
                        if (q) l.response = u, l.onload();
                        else l.onerror(u)
                    };
                    n.webrequest(p, e, k, m)
                }
            })
        }
    };
    _pio.flashSocketConnection = function(e, k, l, m, n) {
        var p = "cb" + g++,
            q = this,
            u = new _pio.messageSerializer,
            t = !1,
            r = !1,
            x = setTimeout(function() {
                t || (t = !0, l(!1, "Connect attempt timed out"))
            }, k);
        this.disconnect = function() {
            console.log("... this shouldn't happen")
        };
        this.sendMessage = function(D) {
            console.log("... send msg. this shouldn't happen")
        };
        f(function(D) {
            null == D ? (t = !0, l(!1, "Browser does not support WebSocket connections and the Flash fallback failed.")) :
                (d[p] = function(w, E) {
                    switch (w) {
                        case "onopen":
                            t || (clearTimeout(x), r = t = !0, D.socketSend(p, [0]), l(r));
                            break;
                        case "onclose":
                            q.disconnect();
                            break;
                        case "onerror":
                            q.disconnect();
                            break;
                        case "onmessage":
                            n(u.deserializeMessage(E, 0, E.length))
                    }
                }, q.disconnect = function() {
                    if (r) {
                        r = !1;
                        m();
                        try {
                            D.socketClose(p)
                        } catch (w) {
                            _pio.debugLog(w)
                        }
                    }
                }, q.sendMessage = function(w) {
                    w = u.serializeMessage(w);
                    D.socketSend(p, w)
                }, D.socketConnection(p, e))
        })
    };
    _pio.isFlashFallbackEnabled = function(e) {
        f(function(k) {
            e(null != k)
        })
    };
    var b = null,
        a = !1,
        c = null
})();
(function() {
    var f = _pio.channel.prototype;
    f.connect = function(h, d, g, b, a, c, e, k, l, m, n) {
        this.call(10, {
            gameid: h,
            connectionid: d,
            userid: g,
            auth: b,
            partnerid: a,
            playerinsightsegments: c,
            clientapi: e,
            clientinfo: k
        }, l, m, n)
    };
    _pio.ApiSecurityRule = {
        RespectClientSetting: 0,
        UseHttp: 1,
        UseHttps: 2
    };
    f.authenticate = function(h, d, g, b, a, c, e, k, l, m) {
        this.call(13, {
            gameid: h,
            connectionid: d,
            authenticationarguments: g,
            playerinsightsegments: b,
            clientapi: a,
            clientinfo: c,
            playcodes: e
        }, k, l, m)
    };
    f.createRoom = function(h, d, g, b, a, c, e, k) {
        this.call(21, {
            roomid: h,
            roomtype: d,
            visible: g,
            roomdata: b,
            isdevroom: a
        }, c, e, k)
    };
    f.joinRoom = function(h, d, g, b, a, c) {
        this.call(24, {
            roomid: h,
            joindata: d,
            isdevroom: g
        }, b, a, c)
    };
    f.createJoinRoom = function(h, d, g, b, a, c, e, k, l) {
        this.call(27, {
            roomid: h,
            roomtype: d,
            visible: g,
            roomdata: b,
            joindata: a,
            isdevroom: c
        }, e, k, l)
    };
    f.listRooms = function(h, d, g, b, a, c, e, k) {
        this.call(30, {
            roomtype: h,
            searchcriteria: d,
            resultlimit: g,
            resultoffset: b,
            onlydevrooms: a
        }, c, e, k)
    };
    f.userLeftRoom = function(h, d, g, b, a, c) {
        this.call(40, {
                extendedroomid: h,
                newplayercount: d,
                closed: g
            },
            b, a, c)
    };
    f.writeError = function(h, d, g, b, a, c, e, k) {
        this.call(50, {
            source: h,
            error: d,
            details: g,
            stacktrace: b,
            extradata: a
        }, c, e, k)
    };
    f.updateRoom = function(h, d, g, b, a, c) {
        this.call(53, {
            extendedroomid: h,
            visible: d,
            roomdata: g
        }, b, a, c)
    };
    _pio.ValueType = {
        String: 0,
        Int: 1,
        UInt: 2,
        Long: 3,
        Bool: 4,
        Float: 5,
        Double: 6,
        ByteArray: 7,
        DateTime: 8,
        Array: 9,
        Obj: 10
    };
    f.createObjects = function(h, d, g, b, a) {
        this.call(82, {
            objects: h,
            loadexisting: d
        }, g, b, a)
    };
    f.loadObjects = function(h, d, g, b) {
        this.call(85, {
            objectids: h
        }, d, g, b)
    };
    _pio.LockType = {
        NoLocks: 0,
        LockIndividual: 1,
        LockAll: 2
    };
    f.saveObjectChanges = function(h, d, g, b, a, c) {
        this.call(88, {
            locktype: h,
            changesets: d,
            createifmissing: g
        }, b, a, c)
    };
    f.deleteObjects = function(h, d, g, b) {
        this.call(91, {
            objectids: h
        }, d, g, b)
    };
    f.loadMatchingObjects = function(h, d, g, b, a, c, e) {
        this.call(94, {
            table: h,
            index: d,
            indexvalue: g,
            limit: b
        }, a, c, e)
    };
    f.loadIndexRange = function(h, d, g, b, a, c, e, k) {
        this.call(97, {
            table: h,
            index: d,
            startindexvalue: g,
            stopindexvalue: b,
            limit: a
        }, c, e, k)
    };
    f.deleteIndexRange = function(h, d, g, b, a, c, e) {
        this.call(100, {
            table: h,
            index: d,
            startindexvalue: g,
            stopindexvalue: b
        }, a, c, e)
    };
    f.loadMyPlayerObject = function(h, d, g) {
        this.call(103, {}, h, d, g)
    };
    f.payVaultReadHistory = function(h, d, g, b, a, c) {
        this.call(160, {
            page: h,
            pagesize: d,
            targetuserid: g
        }, b, a, c)
    };
    f.payVaultRefresh = function(h, d, g, b, a) {
        this.call(163, {
            lastversion: h,
            targetuserid: d
        }, g, b, a)
    };
    f.payVaultConsume = function(h, d, g, b, a) {
        this.call(166, {
            ids: h,
            targetuserid: d
        }, g, b, a)
    };
    f.payVaultCredit = function(h, d, g, b, a, c) {
        this.call(169, {
            amount: h,
            reason: d,
            targetuserid: g
        }, b, a, c)
    };
    f.payVaultDebit =
        function(h, d, g, b, a, c) {
            this.call(172, {
                amount: h,
                reason: d,
                targetuserid: g
            }, b, a, c)
        };
    f.payVaultBuy = function(h, d, g, b, a, c) {
        this.call(175, {
            items: h,
            storeitems: d,
            targetuserid: g
        }, b, a, c)
    };
    f.payVaultGive = function(h, d, g, b, a) {
        this.call(178, {
            items: h,
            targetuserid: d
        }, g, b, a)
    };
    f.payVaultPaymentInfo = function(h, d, g, b, a, c) {
        this.call(181, {
            provider: h,
            purchasearguments: d,
            items: g
        }, b, a, c)
    };
    f.payVaultUsePaymentInfo = function(h, d, g, b, a) {
        this.call(184, {
            provider: h,
            providerarguments: d
        }, g, b, a)
    };
    f.partnerPayTrigger = function(h, d, g, b,
        a) {
        this.call(200, {
            key: h,
            count: d
        }, g, b, a)
    };
    f.partnerPaySetTag = function(h, d, g, b) {
        this.call(203, {
            partnerid: h
        }, d, g, b)
    };
    f.notificationsRefresh = function(h, d, g, b) {
        this.call(213, {
            lastversion: h
        }, d, g, b)
    };
    f.notificationsRegisterEndpoints = function(h, d, g, b, a) {
        this.call(216, {
            lastversion: h,
            endpoints: d
        }, g, b, a)
    };
    f.notificationsSend = function(h, d, g, b) {
        this.call(219, {
            notifications: h
        }, d, g, b)
    };
    f.notificationsToggleEndpoints = function(h, d, g, b, a, c) {
        this.call(222, {
            lastversion: h,
            endpoints: d,
            enabled: g
        }, b, a, c)
    };
    f.notificationsDeleteEndpoints =
        function(h, d, g, b, a) {
            this.call(225, {
                lastversion: h,
                endpoints: d
            }, g, b, a)
        };
    f.gameRequestsSend = function(h, d, g, b, a, c) {
        this.call(241, {
            requesttype: h,
            requestdata: d,
            requestrecipients: g
        }, b, a, c)
    };
    f.gameRequestsRefresh = function(h, d, g, b) {
        this.call(244, {
            playcodes: h
        }, d, g, b)
    };
    f.gameRequestsDelete = function(h, d, g, b) {
        this.call(247, {
            requestids: h
        }, d, g, b)
    };
    f.achievementsRefresh = function(h, d, g, b) {
        this.call(271, {
            lastversion: h
        }, d, g, b)
    };
    f.achievementsLoad = function(h, d, g, b) {
        this.call(274, {
            userids: h
        }, d, g, b)
    };
    f.achievementsProgressSet =
        function(h, d, g, b, a) {
            this.call(277, {
                achievementid: h,
                progress: d
            }, g, b, a)
        };
    f.achievementsProgressAdd = function(h, d, g, b, a) {
        this.call(280, {
            achievementid: h,
            progressdelta: d
        }, g, b, a)
    };
    f.achievementsProgressMax = function(h, d, g, b, a) {
        this.call(283, {
            achievementid: h,
            progress: d
        }, g, b, a)
    };
    f.achievementsProgressComplete = function(h, d, g, b) {
        this.call(286, {
            achievementid: h
        }, d, g, b)
    };
    f.playerInsightRefresh = function(h, d, g) {
        this.call(301, {}, h, d, g)
    };
    f.playerInsightSetSegments = function(h, d, g, b) {
        this.call(304, {
            segments: h
        }, d, g, b)
    };
    f.playerInsightTrackInvitedBy = function(h, d, g, b, a) {
        this.call(307, {
            invitinguserid: h,
            invitationchannel: d
        }, g, b, a)
    };
    f.playerInsightTrackEvents = function(h, d, g, b) {
        this.call(311, {
            events: h
        }, d, g, b)
    };
    f.playerInsightTrackExternalPayment = function(h, d, g, b, a) {
        this.call(314, {
            currency: h,
            amount: d
        }, g, b, a)
    };
    f.playerInsightSessionKeepAlive = function(h, d, g) {
        this.call(317, {}, h, d, g)
    };
    f.playerInsightSessionStop = function(h, d, g) {
        this.call(320, {}, h, d, g)
    };
    f.oneScoreLoad = function(h, d, g, b) {
        this.call(351, {
            userids: h
        }, d, g, b)
    };
    f.oneScoreSet =
        function(h, d, g, b) {
            this.call(354, {
                score: h
            }, d, g, b)
        };
    f.oneScoreAdd = function(h, d, g, b) {
        this.call(357, {
            score: h
        }, d, g, b)
    };
    f.oneScoreRefresh = function(h, d, g) {
        this.call(360, {}, h, d, g)
    };
    f.simpleConnect = function(h, d, g, b, a, c, e, k, l) {
        this.call(400, {
            gameid: h,
            usernameoremail: d,
            password: g,
            playerinsightsegments: b,
            clientapi: a,
            clientinfo: c
        }, e, k, l)
    };
    f.simpleRegister = function(h, d, g, b, a, c, e, k, l, m, n, p, q, u) {
        this.call(403, {
            gameid: h,
            username: d,
            password: g,
            email: b,
            captchakey: a,
            captchavalue: c,
            extradata: e,
            partnerid: k,
            playerinsightsegments: l,
            clientapi: m,
            clientinfo: n
        }, p, q, u)
    };
    f.simpleRecoverPassword = function(h, d, g, b, a) {
        this.call(406, {
            gameid: h,
            usernameoremail: d
        }, g, b, a)
    };
    f.kongregateConnect = function(h, d, g, b, a, c, e, k, l) {
        this.call(412, {
            gameid: h,
            userid: d,
            gameauthtoken: g,
            playerinsightsegments: b,
            clientapi: a,
            clientinfo: c
        }, e, k, l)
    };
    f.simpleGetCaptcha = function(h, d, g, b, a, c) {
        this.call(415, {
            gameid: h,
            width: d,
            height: g
        }, b, a, c)
    };
    f.facebookOAuthConnect = function(h, d, g, b, a, c, e, k, l) {
        this.call(418, {
            gameid: h,
            accesstoken: d,
            partnerid: g,
            playerinsightsegments: b,
            clientapi: a,
            clientinfo: c
        }, e, k, l)
    };
    f.steamConnect = function(h, d, g, b, a, c, e, k, l) {
        this.call(421, {
            gameid: h,
            steamappid: d,
            steamsessionticket: g,
            playerinsightsegments: b,
            clientapi: a,
            clientinfo: c
        }, e, k, l)
    };
    f.simpleUserGetSecureLoginInfo = function(h, d, g) {
        this.call(424, {}, h, d, g)
    };
    f.joinCluster = function(h, d, g, b, a, c, e, k, l, m, n, p, q, u, t, r, x) {
        this.call(504, {
            clusteraccesskey: h,
            isdevelopmentserver: d,
            ports: g,
            machinename: b,
            version: a,
            machineid: c,
            os: e,
            cpu: k,
            cpucores: l,
            cpulogicalcores: m,
            cpuaddresswidth: n,
            cpumaxclockspeed: p,
            rammegabytes: q,
            ramspeed: u
        }, t, r, x)
    };
    f.serverHeartbeat = function(h, d, g, b, a, c, e, k, l, m, n, p, q, u, t, r, x, D, w, E) {
        this.call(510, {
            serverid: h,
            appdomains: d,
            servertypes: g,
            machinecpu: b,
            processcpu: a,
            memoryusage: c,
            avaliablememory: e,
            freememory: k,
            runningrooms: l,
            usedresources: m,
            apirequests: n,
            apirequestserror: p,
            apirequestsfailed: q,
            apirequestsexecuting: u,
            apirequestsqueued: t,
            apirequeststime: r,
            serverunixtimeutc: x
        }, D, w, E)
    };
    f.getGameAssemblyUrl = function(h, d, g, b, a, c) {
        this.call(513, {
            clusteraccesskey: h,
            gamecodeid: d,
            machineid: g
        }, b, a, c)
    };
    f.devServerLogin =
        function(h, d, g, b, a) {
            this.call(524, {
                username: h,
                password: d
            }, g, b, a)
        };
    f.webserviceOnlineTest = function(h, d, g) {
        this.call(533, {}, h, d, g)
    };
    f.getServerInfo = function(h, d, g, b) {
        this.call(540, {
            machineid: h
        }, d, g, b)
    };
    f.socialRefresh = function(h, d, g) {
        this.call(601, {}, h, d, g)
    };
    f.socialLoadProfiles = function(h, d, g, b) {
        this.call(604, {
            userids: h
        }, d, g, b)
    }
})();
PlayerIOError = function(f, h, d) {
    this.code = f;
    this.message = h;
    this.stack = d;
    this.stack || (d = Error(), this.stack = d.stack || d.stacktrace || d.StackTrace);
    this.toString = function() {
        return "PlayerIOError[" + f + "]: " + h
    }
};
PlayerIOError.prototype = Error();
PlayerIOErrorCode = {
    UnsupportedMethod: "UnsupportedMethod",
    GeneralError: "GeneralError",
    InternalError: "InternalError",
    AccessDenied: "AccessDenied",
    InvalidMessageFormat: "InvalidMessageFormat",
    MissingValue: "MissingValue",
    GameRequired: "GameRequired",
    ExternalError: "ExternalError",
    ArgumentOutOfRange: "ArgumentOutOfRange",
    GameDisabled: "GameDisabled",
    UnknownGame: "UnknownGame",
    UnknownConnection: "UnknownConnection",
    InvalidAuth: "InvalidAuth",
    NoServersAvailable: "NoServersAvailable",
    RoomDataTooLarge: "RoomDataTooLarge",
    RoomAlreadyExists: "RoomAlreadyExists",
    UnknownRoomType: "UnknownRoomType",
    UnknownRoom: "UnknownRoom",
    MissingRoomId: "MissingRoomId",
    RoomIsFull: "RoomIsFull",
    NotASearchColumn: "NotASearchColumn",
    QuickConnectMethodNotEnabled: "QuickConnectMethodNotEnabled",
    UnknownUser: "UnknownUser",
    InvalidPassword: "InvalidPassword",
    InvalidRegistrationData: "InvalidRegistrationData",
    InvalidBigDBKey: "InvalidBigDBKey",
    BigDBObjectTooLarge: "BigDBObjectTooLarge",
    BigDBObjectDoesNotExist: "BigDBObjectDoesNotExist",
    UnknownTable: "UnknownTable",
    UnknownIndex: "UnknownIndex",
    InvalidIndexValue: "InvalidIndexValue",
    NotObjectCreator: "NotObjectCreator",
    KeyAlreadyUsed: "KeyAlreadyUsed",
    StaleVersion: "StaleVersion",
    CircularReference: "CircularReference",
    HeartbeatFailed: "HeartbeatFailed",
    InvalidGameCode: "InvalidGameCode",
    VaultNotLoaded: "VaultNotLoaded",
    UnknownPayVaultProvider: "UnknownPayVaultProvider",
    DirectPurchaseNotSupportedByProvider: "DirectPurchaseNotSupportedByProvider",
    BuyingCoinsNotSupportedByProvider: "BuyingCoinsNotSupportedByProvider",
    NotEnoughCoins: "NotEnoughCoins",
    ItemNotInVault: "ItemNotInVault",
    InvalidPurchaseArguments: "InvalidPurchaseArguments",
    InvalidPayVaultProviderSetup: "InvalidPayVaultProviderSetup",
    UnknownPartnerPayAction: "UnknownPartnerPayAction",
    InvalidType: "InvalidType",
    IndexOutOfBounds: "IndexOutOfBounds",
    InvalidIdentifier: "InvalidIdentifier",
    InvalidArgument: "InvalidArgument",
    LoggedOut: "LoggedOut",
    InvalidSegment: "InvalidSegment",
    GameRequestsNotLoaded: "GameRequestsNotLoaded",
    AchievementsNotLoaded: "AchievementsNotLoaded",
    UnknownAchievement: "UnknownAchievement",
    NotificationsNotLoaded: "NotificationsNotLoaded",
    InvalidNotificationsEndpoint: "InvalidNotificationsEndpoint",
    NetworkIssue: "NetworkIssue",
    OneScoreNotLoaded: "OneScoreNotLoaded",
    PublishingNetworkNotAvailable: "PublishingNetworkNotAvailable",
    PublishingNetworkNotLoaded: "PublishingNetworkNotLoaded",
    DialogClosed: "DialogClosed",
    AdTrackCheckCookie: "AdTrackCheckCookie",
    codes: {
        0: "UnsupportedMethod",
        1: "GeneralError",
        2: "InternalError",
        3: "AccessDenied",
        4: "InvalidMessageFormat",
        5: "MissingValue",
        6: "GameRequired",
        7: "ExternalError",
        8: "ArgumentOutOfRange",
        9: "GameDisabled",
        10: "UnknownGame",
        11: "UnknownConnection",
        12: "InvalidAuth",
        13: "NoServersAvailable",
        14: "RoomDataTooLarge",
        15: "RoomAlreadyExists",
        16: "UnknownRoomType",
        17: "UnknownRoom",
        18: "MissingRoomId",
        19: "RoomIsFull",
        20: "NotASearchColumn",
        21: "QuickConnectMethodNotEnabled",
        22: "UnknownUser",
        23: "InvalidPassword",
        24: "InvalidRegistrationData",
        25: "InvalidBigDBKey",
        26: "BigDBObjectTooLarge",
        27: "BigDBObjectDoesNotExist",
        28: "UnknownTable",
        29: "UnknownIndex",
        30: "InvalidIndexValue",
        31: "NotObjectCreator",
        32: "KeyAlreadyUsed",
        33: "StaleVersion",
        34: "CircularReference",
        40: "HeartbeatFailed",
        41: "InvalidGameCode",
        50: "VaultNotLoaded",
        51: "UnknownPayVaultProvider",
        52: "DirectPurchaseNotSupportedByProvider",
        54: "BuyingCoinsNotSupportedByProvider",
        55: "NotEnoughCoins",
        56: "ItemNotInVault",
        57: "InvalidPurchaseArguments",
        58: "InvalidPayVaultProviderSetup",
        70: "UnknownPartnerPayAction",
        80: "InvalidType",
        81: "IndexOutOfBounds",
        82: "InvalidIdentifier",
        83: "InvalidArgument",
        84: "LoggedOut",
        90: "InvalidSegment",
        100: "GameRequestsNotLoaded",
        110: "AchievementsNotLoaded",
        111: "UnknownAchievement",
        120: "NotificationsNotLoaded",
        121: "InvalidNotificationsEndpoint",
        130: "NetworkIssue",
        131: "OneScoreNotLoaded",
        200: "PublishingNetworkNotAvailable",
        201: "PublishingNetworkNotLoaded",
        301: "DialogClosed",
        302: "AdTrackCheckCookie"
    }
};
(function() {
    _pio.client = function(f, h, d, g) {
        this.connectUserId = g;
        this.gameId = h;
        this.gameFS = new _pio.gameFS(h, d);
        this.errorLog = new _pio.errorLog(f);
        this.payVault = new _pio.payVault(f);
        this.bigDB = new _pio.bigDB(f);
        this.multiplayer = new _pio.multiplayer(f);
        this.gameRequests = new _pio.gameRequests(f);
        this.achievements = new _pio.achievements(f);
        this.playerInsight = new _pio.playerInsight(f);
        this.oneScore = new _pio.oneScore(f);
        this.notifications = new _pio.notifications(f);
        this.publishingNetwork = new _pio.publishingNetwork(f,
            this.connectUserId)
    }
})();
(function() {
    var f = {};
    _pio.gameFS = function(h, d) {
        if ("string" == typeof d && 0 < d.length) {
            var g = (d || "").split("|");
            if (1 <= g.length)
                for (var b = f[h.toLowerCase()] = {}, a = 0; a != g.length; a++) {
                    var c = g[a];
                    "alltoredirect" == c || "cdnmap" == c ? b.baseUrl = g[a + 1] : "alltoredirectsecure" == c || "cdnmapsecure" == c ? b.secureBaseUrl = g[a + 1] : b["." + c] = g[a + 1]
                }
        }
        this.getUrl = function(e, k) {
            if ("/" == !e[0]) throw _pio.error("The path given to getUrl must start with a slash, like: '/myfile.swf' or '/folder/file.jpg'");
            var l = f[h];
            return l ? (k ? l.secureBaseUrl :
                l.baseUrl) + (l["." + e] || e) : (k ? "https" : "http") + "://r.playerio.com/r/" + h + e
        }
    }
})();
(function() {
    _pio.gameRequests = function(f) {
        function h(b) {
            if (null == b || 0 == b.length) return [];
            for (var a = [], c = 0; c != b.length; c++) {
                var e = b[c];
                a.push(new _pio.gameRequest(e.id, e.type, e.senderuserid, e.created, e.data))
            }
            return a
        }
        var d = [];
        this.waitingRequests = "[ERROR: You tried to access gameRequests.waitingRequests before loading waiting requests. You have to call the refresh method first.]";
        var g = this;
        this.send = function(b, a, c, e, k) {
            f.gameRequestsSend(b, _pio.convertToKVArray(a), c, e, k, function(l) {})
        };
        this.refresh =
            function(b, a) {
                f.gameRequestsRefresh(d, b, a, function(c) {
                    g._playCodes = c.newplaycodes;
                    g.waitingRequests = h(c.requests)
                })
            };
        this["delete"] = function(b, a, c) {
            if ("object" == typeof b || b.length) {
                for (var e = [], k = 0; k != b.length; k++) {
                    var l = b[k].id;
                    if (l) e.push(l);
                    else {
                        b = _pio.error("No GameRequest id found on item#" + k + ". You have to use requests from the gameRequests.waitingRequests array. For instance: client.gameRequests.delete(client.gameRequests.waitingRequests, ...)");
                        _pio.handleError(b, c, b.code, b.message);
                        return
                    }
                }
                f.gameRequestsDelete(e,
                    a, c,
                    function(m) {
                        g.waitingRequests = h(m.requests)
                    })
            } else b = _pio.error("The first argument to delete should be an array: client.gameRequests.delete([requests], ...)"), _pio.handleError(b, c, b.code, b.message)
        }
    };
    _pio.gameRequest = function(f, h, d, g, b) {
        this.id = f;
        this.type = h;
        this.senderUserId = d;
        this.created = new Date(g);
        this.data = _pio.convertFromKVArray(b)
    }
})();
(function() {
    _pio.errorLog = function(f) {
        this.writeError = function(h, d, g, b) {
            f.writeError("Javascript", h, d, g, _pio.convertToKVArray(b))
        }
    }
})();
(function() {
    _pio.quickConnect = function() {
        this.simpleGetCaptcha = function(f, h, d, g, b) {
            (new _pio.channel).simpleGetCaptcha(f, h, d, g, b, function(a) {
                return new _pio.simpleGetCaptchaOutput(a.captchakey, a.captchaimageurl)
            })
        };
        this.simpleRecoverPassword = function(f, h, d, g) {
            (new _pio.channel).simpleRecoverPassword(f, h, d, g, function(b) {})
        }
    };
    _pio.simpleGetCaptchaOutput = function(f, h) {
        this.captchaKey = f;
        this.captchaImageUrl = h
    };
    PlayerIO.quickConnect = new _pio.quickConnect
})();
(function() {
    _pio.payVault = function(f) {
        function h(b) {
            if (null != b && (d = b.version, g.coins = b.coins || 0, g.items = [], b.items && b.items.length))
                for (var a = 0; a != b.items.length; a++) {
                    var c = b.items[a],
                        e = g.items[a] = new _pio.vaultItem(c.id, c.itemkey, (new Date).setTime(c.purchasedate));
                    _pio.bigDBDeserialize(c.properties, e, !0)
                }
        }
        var d = null;
        this.coins = "[ERROR: you tried to access payVault.coins before the vault was loaded. You have to refresh the vault before the .coins property is set to the right value]";
        this.items = "[ERROR: you tried to access payVault.items before the vault was loaded. You have to refresh the vault before the .items property is set to the right value]";
        this.has = function(b) {
            if (null == d) throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded, "Cannot access items before vault has been loaded. Please refresh the vault first");
            for (var a = 0; a != this.items.length; a++)
                if (this.items[a].itemKey == b) return !0;
            return !1
        };
        this.first = function(b) {
            if (null == d) throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded, "Cannot access items before vault has been loaded. Please refresh the vault first");
            for (var a = 0; a != this.items.length; a++)
                if (this.items[a].itemKey == b) return this.items[a];
            return null
        };
        this.count = function(b) {
            if (null == d) throw new PlayerIOError(PlayerIOErrorCode.VaultNotLoaded, "Cannot access items before vault has been loaded. Please refresh the vault first");
            for (var a = 0, c = 0; c != this.items.length; c++) this.items[c].itemKey == b && a++;
            return a
        };
        this.refresh = function(b, a) {
            f.payVaultRefresh(d, null, b, a, function(c) {
                h(c.vaultcontents)
            })
        };
        this.readHistory = function(b, a, c, e) {
            f.payVaultReadHistory(b, a, null, c, e, function(k) {
                for (var l = [], m = 0; m != k.entries.length; m++) {
                    var n = k.entries[m];
                    l.push(new _pio.payVaultHistoryEntry(n.type, n.amount, n.timestamp, n.itemkeys || [], n.reason, n.providertransactionid, n.providerprice))
                }
                return l
            })
        };
        this.credit = function(b, a, c, e) {
            f.payVaultCredit(b, a, null, c, e, function(k) {
                h(k.vaultcontents)
            })
        };
        this.debit = function(b, a, c, e) {
            f.payVaultDebit(b, a, null, c, e, function(k) {
                h(k.vaultcontents)
            })
        };
        this.consume = function(b, a, c) {
            if ("object" == typeof b || b.length) {
                for (var e = [], k = 0; k != b.length; k++) {
                    var l = b[k].id;
                    if (l) e.push(l);
                    else {
                        b = _pio.error("No PayVault item id found on item#" +
                            k + ". You have to use items from the payVault.items array. For instance: client.payVault.consume([client.payVault.first('sportscar')], ...)");
                        _pio.handleError(b, c, b.code, b.message);
                        return
                    }
                }
                f.payVaultConsume(e, null, a, c, function(m) {
                    h(m.vaultcontents)
                })
            } else b = _pio.error("The first argument to consume should be an array: client.payVault.consume([item], ...)"), _pio.handleError(b, c, b.code, b.message)
        };
        this.buy = function(b, a, c, e) {
            f.payVaultBuy(_pio.convertBuyItems(b), a, null, c, e, function(k) {
                h(k.vaultcontents)
            })
        };
        this.give = function(b, a, c) {
            f.payVaultGive(_pio.convertBuyItems(b), null, a, c, function(e) {
                h(e.vaultcontents)
            })
        };
        this.getBuyCoinsInfo = function(b, a, c, e) {
            f.payVaultPaymentInfo(b, _pio.convertToKVArray(a), null, c, e, function(k) {
                return _pio.convertFromKVArray(k.providerarguments)
            })
        };
        this.getBuyDirectInfo = function(b, a, c, e, k) {
            f.payVaultPaymentInfo(b, _pio.convertToKVArray(a), _pio.convertBuyItems(c), e, k, function(l) {
                return _pio.convertFromKVArray(l.providerarguments)
            })
        };
        var g = this
    };
    _pio.convertBuyItems = function(f) {
        if (null ==
            f) return [];
        for (var h = [], d = 0; d != f.length; d++) {
            var g = f[d].itemkey;
            if (!g) throw _pio.error("You have to specify an itemkey for the payvault item. Example:  {itemkey:'car'}");
            h.push({
                itemkey: g,
                payload: _pio.compareForChanges({
                    itemkey: g
                }, f[d], !0, !0)
            })
        }
        return h
    };
    _pio.vaultItem = function(f, h, d) {
        this.id = f;
        this.itemKey = h;
        this.purchaseDate = d
    };
    _pio.payVaultHistoryEntry = function(f, h, d, g, b, a, c) {
        this.type = f;
        this.amount = h;
        this.timestamp = (new Date).setTime(d);
        this.itemKeys = g;
        this.reason = b;
        this.providerTransactionId =
            a;
        this.providerPrice = c
    }
})();
(function() {
    _pio.bigDB = function(f) {
        function h() {
            for (var a = 0; a < b.length; a++) {
                var c = b[a],
                    e = !0,
                    k;
                for (k in c.objects)
                    if (c.objects[k]._internal_("get-is-saving")) {
                        e = !1;
                        break
                    }
                if (e) {
                    for (k in c.objects)
                        for (e = a + 1; e < b.length; e++) {
                            futureSave = b[e];
                            for (var l = 0; l < futureSave.objects.length; l++) futureSave.objects[l] == c.objects[k] && futureSave.fullOverwrite == c.fullOverwrite && futureSave.useOptimisticLock == c.useOptimisticLock && (c.changesets[k] = futureSave.changesets[l], c.futureSaves.push(futureSave))
                        }
                    b.splice(a, 1);
                    a--;
                    c.execute()
                }
            }
        }

        function d(a, c) {
            null == a ? a = [] : a instanceof Array || (a = [a]);
            null != c && (a = a.concat([c]));
            for (var e = [], k = 0; k != a.length; k++) {
                var l = a[k];
                switch (typeof l) {
                    case "boolean":
                        e.push({
                            valuetype: _pio.ValueType.Bool,
                            bool: l
                        });
                        break;
                    case "string":
                        e.push({
                            valuetype: _pio.ValueType.String,
                            string: l
                        });
                        break;
                    case "number":
                        0 != l % 1 ? e.push({
                            valuetype: _pio.ValueType.Double,
                            "double": l
                        }) : -2147483648 < l && 2147483647 > l ? e.push({
                            valuetype: _pio.ValueType.Int,
                            "int": l
                        }) : 0 < l && 4294967295 > l ? e.push({
                            valuetype: _pio.ValueType.UInt,
                            uint: l
                        }) : e.push({
                            valuetype: _pio.ValueType.Long,
                            "long": l
                        });
                        break;
                    case "object":
                        if (l.getTime && l.getMilliseconds) e.push({
                            valuetype: _pio.ValueType.DateTime,
                            datetime: l.getTime()
                        });
                        else throw Error("Don't know how to serialize type '" + typeof l + "' for BigDB");
                        break;
                    default:
                        throw Error("Don't know how to serialize type '" + typeof l + "' for BigDB");
                }
            }
            return e
        }
        var g = this,
            b = [];
        this.createObject = function(a, c, e, k, l) {
            var m = _pio.compareForChanges({}, e || {}, !0, !0);
            f.createObjects([{
                    key: c,
                    table: a,
                    properties: m
                }], !1, k,
                l,
                function(n) {
                    if (1 == n.objects.length) return new _pio.databaseobject(g, a, n.objects[0].key, n.objects[0].version, !1, m);
                    throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "Error creating object");
                })
        };
        this.loadMyPlayerObject = function(a, c) {
            f.loadMyPlayerObject(a, c, function(e) {
                return new _pio.databaseobject(g, "PlayerObjects", e.playerobject.key, e.playerobject.version, !0, e.playerobject.properties)
            })
        };
        this.load = function(a, c, e, k) {
            f.loadObjects([{
                table: a,
                keys: [c]
            }], e, k, function(l) {
                if (1 == l.objects.length) return null ==
                    l.objects[0] ? null : new _pio.databaseobject(g, a, l.objects[0].key, l.objects[0].version, !1, l.objects[0].properties);
                throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "Error loading object");
            })
        };
        this.loadKeys = function(a, c, e, k) {
            f.loadObjects([{
                table: a,
                keys: c
            }], e, k, function(l) {
                for (var m = [], n = 0; n != l.objects.length; n++) {
                    var p = l.objects[n];
                    m[n] = null == p ? null : new _pio.databaseobject(g, a, p.key, p.version, !1, p.properties)
                }
                return m
            })
        };
        this.loadOrCreate = function(a, c, e, k) {
            f.createObjects([{
                key: c,
                table: a,
                properties: []
            }], !0, e, k, function(l) {
                if (1 == l.objects.length) return new _pio.databaseobject(g, a, l.objects[0].key, l.objects[0].version, !1, l.objects[0].properties);
                throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "Error creating object");
            })
        };
        this.deleteKeys = function(a, c, e, k) {
            f.deleteObjects([{
                table: a,
                keys: c
            }], e, k, function(l) {
                return null
            })
        };
        this.loadKeysOrCreate = function(a, c, e, k) {
            for (var l = [], m = 0; m != c.length; m++) l.push({
                key: c[m],
                table: a,
                properties: []
            });
            f.createObjects(l, !0, e, k, function(n) {
                for (var p = [], q = 0; q != n.objects.length; q++) {
                    var u =
                        n.objects[q];
                    p[q] = new _pio.databaseobject(g, a, u.key, u.version, !1, u.properties)
                }
                return p
            })
        };
        this.loadSingle = function(a, c, e, k, l) {
            f.loadMatchingObjects(a, c, d(e), 1, k, l, function(m) {
                return 0 == m.objects.length ? null : new _pio.databaseobject(g, a, m.objects[0].key, m.objects[0].version, !1, m.objects[0].properties)
            })
        };
        this.loadRange = function(a, c, e, k, l, m, n, p) {
            f.loadIndexRange(a, c, d(e, k), d(e, l), m, n, p, function(q) {
                for (var u = [], t = 0; t != q.objects.length; t++) {
                    var r = q.objects[t];
                    u[t] = null == r ? null : new _pio.databaseobject(g,
                        a, r.key, r.version, !1, r.properties)
                }
                return u
            })
        };
        this.deleteRange = function(a, c, e, k, l, m, n) {
            f.deleteIndexRange(a, c, d(e, k), d(e, l), m, n, function() {})
        };
        this.saveChanges = function(a, c, e, k, l, m) {
            var n = 1 == m;
            m = [];
            for (var p in e) {
                var q = e[p];
                if (!(q.existsInDatabase && q.key && q.table && q._internal_ && q.save)) {
                    a = _pio.error("You can only save database objects that exist in the database");
                    _pio.handleError(a, l, a.code, a.message);
                    return
                }
                var u = _pio.compareForChanges(c ? {} : q._internal_("get-dbCurrent"), q, !0, !0);
                (c || 0 < u.length) &&
                m.push({
                    key: q._internal_("get-key"),
                    table: q._internal_("get-table"),
                    fulloverwrite: c,
                    onlyifversion: a ? q._internal_("get-version") : null,
                    changes: u
                })
            }
            b.push({
                objects: e,
                changesets: m,
                fullOverwrite: c,
                useOptimisticLock: a,
                futureSaves: [],
                setIsSavingOnAll: function(t) {
                    for (var r = 0; r != this.objects.length; r++) this.objects[r]._internal_("set-is-saving", t)
                },
                done: function() {
                    this.setIsSavingOnAll(!1);
                    h()
                },
                execute: function() {
                    var t = this;
                    t.setIsSavingOnAll(!0);
                    0 < t.changesets.length ? f.saveObjectChanges(_pio.LockType.LockAll,
                        t.changesets, n, k,
                        function(r) {
                            t.done();
                            _pio.handleError(r, l, r.code, r.message)
                        },
                        function(r) {
                            for (var x = 0; x != t.objects.length; x++) {
                                var D = t.objects[x];
                                D._internal_("set-version", r.versions[x]);
                                D._internal_("change-dbCurrent", t.changesets[x].changes);
                                for (var w = 0; w != t.futureSaves.length; w++)
                                    for (var E = t.futureSaves[w], F = 0; F < E.objects.length; F++) E.objects[F] == D && (E.changesets.splice(F, 1), E.objects.splice(F, 1), F--)
                            }
                            t.done()
                        }) : (t.done(), setTimeout(k, 1))
                }
            });
            h()
        }
    };
    _pio.databaseobject = function(f, h, d, g, b, a) {
        var c = {},
            e = !1;
        _pio.bigDBDeserialize(a, c, !0);
        this.table = h;
        this.key = d;
        this.existsInDatabase = !0;
        this.save = function(k, l, m, n) {
            f.saveChanges(k, l, [this], m, n, b)
        };
        this._internal_ = function(k, l) {
            switch (k) {
                case "get-table":
                    return h;
                case "get-key":
                    return d;
                case "set-is-saving":
                    e = l;
                case "get-is-saving":
                    return e;
                case "get-version":
                    return g;
                case "set-version":
                    g = l;
                case "get-dbCurrent":
                    return c;
                case "change-dbCurrent":
                    _pio.bigDBDeserialize(l, c, !0)
            }
        };
        _pio.bigDBDeserialize(a, this, !0)
    };
    _pio.compareForChanges = function(f, h, d,
        g) {
        var b = [],
            a;
        for (a in h) {
            var c = h[a],
                e = f ? f[a] : null;
            switch (a) {
                case "table":
                    if (g) continue;
                case "key":
                    if (g) continue;
                case "save":
                    if (g) continue;
                case "existsInDatabase":
                    if (g) continue;
                case "_internal_":
                    if (g) continue;
                case "_circular_reference_finder_":
                    continue
            }
            if (null != c) {
                var k = d ? {
                    name: a
                } : {
                    index: parseInt(a)
                };
                switch (typeof c) {
                    case "boolean":
                        c != e && (k.value = {
                            valuetype: _pio.ValueType.Bool,
                            bool: c
                        }, b.push(k));
                        break;
                    case "number":
                        c != e && (isFinite(c) && Math.floor(c) === c ? k.value = -2147483648 <= c && 2147483647 >= c ? {
                            valuetype: _pio.ValueType.Int,
                            "int": c
                        } : 0 < c && 4294967295 >= c ? {
                            valuetype: _pio.ValueType.UInt,
                            uint: c
                        } : -0x7ffffffffffffc00 <= c && 0x7ffffffffffffc00 >= c ? {
                            valuetype: _pio.ValueType.Long,
                            "long": c
                        } : 0 < c && 1.844674407370955E19 >= c ? {
                            valuetype: _pio.ValueType.ULong,
                            ulong: c
                        } : {
                            valuetype: _pio.ValueType.Double,
                            "double": c
                        } : k.value = {
                            valuetype: _pio.ValueType.Double,
                            "double": c
                        }, b.push(k));
                        break;
                    case "string":
                        c != e && (k.value = {
                            valuetype: _pio.ValueType.String,
                            string: c
                        }, b.push(k));
                        break;
                    case "object":
                        if (c.getTime && c.getMilliseconds) c + "" != e + "" && (k.value = {
                            valuetype: _pio.ValueType.DateTime,
                            datetime: c.getTime()
                        }, b.push(k));
                        else {
                            if (c._circular_reference_finder_) throw new PlayerIOError(PlayerIOErrorCode.CircularReference, "The object you're trying to save contains a circular reference for " + (d ? "a property named" : "the array entry") + "): " + a);
                            c._circular_reference_finder_ = !0;
                            var l = c instanceof Array;
                            if (l && c.bytearray) {
                                l = Array(c.length);
                                for (e = 0; e != l.length; e++) {
                                    var m = c[e];
                                    if (0 <= m && 255 >= m) l[e] = m;
                                    else throw new PlayerIOError(PlayerIOErrorCode.GeneralError, "The bytearray property '" + a + "' was supposed to only contain byte (0-255) values, but contained the value: " +
                                        m);
                                }
                                k.value = {
                                    valuetype: _pio.ValueType.ByteArray,
                                    bytearray: l
                                }
                            } else e = _pio.compareForChanges(e, c, !l, !1), k.value = l ? {
                                valuetype: _pio.ValueType.Array,
                                arrayproperties: e
                            } : {
                                valuetype: _pio.ValueType.Obj,
                                objectproperties: e
                            };
                            b.push(k);
                            delete c._circular_reference_finder_
                        }
                        break;
                    case "undefined":
                        break;
                    case "function":
                        break;
                    default:
                        throw Error("Don't know how to serialize type '" + typeof c + "' for BigDB");
                }
            }
        }
        for (a in f) null != h[a] && "undefined" != typeof h[a] || b.push(d ? {
            name: a
        } : {
            index: parseInt(a)
        });
        return b
    };
    _pio.bigDBDeserialize =
        function(f, h, d) {
            for (var g in f) {
                var b = f[g],
                    a = d ? b.name : b.index || 0;
                if (b = b.value) switch (b.valuetype || 0) {
                    case _pio.ValueType.String:
                        h[a] = b.string || "";
                        break;
                    case _pio.ValueType.Int:
                        h[a] = b["int"] || 0;
                        break;
                    case _pio.ValueType.UInt:
                        h[a] = b.uint || 0;
                        break;
                    case _pio.ValueType.Long:
                        h[a] = b["long"] || 0;
                        break;
                    case _pio.ValueType.Bool:
                        h[a] = b.bool || 0;
                        break;
                    case _pio.ValueType.Float:
                        h[a] = b["float"] || 0;
                        break;
                    case _pio.ValueType.Double:
                        h[a] = b["double"] || 0;
                        break;
                    case _pio.ValueType.ByteArray:
                        h[a] = b.bytearray;
                        h[a].bytearray = !0;
                        break;
                    case _pio.ValueType.DateTime:
                        h[a] = new Date(b.datetime || 0);
                        break;
                    case _pio.ValueType.Array:
                        var c = h[a] instanceof Array ? h[a] : [];
                        _pio.bigDBDeserialize(b.arrayproperties, c, !1);
                        h[a] = c;
                        break;
                    case _pio.ValueType.Obj:
                        c = "object" == typeof h[a] ? h[a] : {}, _pio.bigDBDeserialize(b.objectproperties, c, !0), h[a] = c
                } else delete h[a]
            }
        }
})();
(function() {
    _pio.multiplayer = function(d) {
        var g = this;
        this.developmentServer = null;
        this.useSecureConnections = !1;
        this.createRoom = function(b, a, c, e, k, l) {
            d.createRoom(b, a, c, _pio.convertToKVArray(e), null != g.developmentServer, k, l, function(m) {
                return m.roomid
            })
        };
        this.joinRoom = function(b, a, c, e) {
            clearTimeout(setTimeout(function() {
                c(new _pio.connection)
            }, 1E4));
            var k = Error();
            d.joinRoom(b, _pio.convertToKVArray(a), null != g.developmentServer, function() {}, e, function(l) {
                return new _pio.connection(k, g.developmentServer,
                    g.useSecureConnections, l.endpoints, l.joinkey, a || {}, c, e)
            })
        };
        this.createJoinRoom = function(b, a, c, e, k, l, m) {
            clearTimeout(setTimeout(function() {
                l(new _pio.connection)
            }, 1E4));
            var n = Error();
            d.createJoinRoom(b, a, c, _pio.convertToKVArray(e), _pio.convertToKVArray(k), null != g.developmentServer, function() {}, m, function(p) {
                return new _pio.connection(n, g.developmentServer, g.useSecureConnections, p.endpoints, p.joinkey, k || {}, l, m)
            })
        };
        this.listRooms = function(b, a, c, e, k, l) {
            d.listRooms(b, _pio.convertToKVArray(a), c, e, null !=
                g.developmentServer, k, l,
                function(m) {
                    var n = [];
                    if (m.rooms && 0 < m.rooms.length)
                        for (var p = 0; p != m.rooms.length; p++) {
                            var q = m.rooms[p];
                            n.push(new _pio.roomInfo(q.id, q.roomtype, q.onlineusers, _pio.convertFromKVArray(q.roomdata)))
                        }
                    return n
                })
        }
    };
    _pio.websocketConnection = function(d, g, b, a, c, e, k) {
        var l = this,
            m = !1,
            n = new _pio.messageSerializer,
            p = !1,
            q = null;
        g = (g ? "wss://" : "ws://") + b + "/";
        try {
            q = "undefined" != typeof MozWebSocket ? new MozWebSocket(g) : new WebSocket(g)
        } catch (t) {
            c(!1, "" + t);
            return
        }
        var u = setTimeout(function() {
            m ||
                (m = !0, c(!1, "Connect attempt timed out"))
        }, a);
        q.onopen = function() {
            m || (clearTimeout(u), p = m = !0, c(p))
        };
        q.onclose = function(t) {
            l.disconnect()
        };
        q.onerror = function(t) {
            l.disconnect()
        };
        q.onmessage = function(t) {
            if (p)
                if (d) {
                    var r = new FileReader;
                    r.onloadend = function() {
                        for (var x = new Uint8Array(r.result), D = Array(x.length), w = 0; w != x.length; w++) D[w] = x[w];
                        k(n.deserializeMessage(D, 0, D.length))
                    };
                    r.readAsArrayBuffer(t.data)
                } else t = _pio.base64decode(t.data), k(n.deserializeMessage(t, 0, t.length))
        };
        this.disconnect = function() {
            if (p) {
                p = !1;
                e();
                try {
                    q.close()
                } catch (t) {
                    _pio.debugLog(t)
                }
            }
        };
        this.sendMessage = function(t) {
            t = n.serializeMessage(t);
            if (d) {
                for (var r = new Uint8Array(t.length), x = 0; x < t.length; x++) r[x] = t[x];
                q.send(r.buffer)
            } else t = _pio.base64encode(t), q.send(t)
        }
    };
    _pio.connection = function(d, g, b, a, c, e, k, l) {
        function m(w) {
            function E() {
                if (0 < B.length) {
                    var K = B[0];
                    B.splice(0, 1);
                    var A = w(b, K, 4E3, function(M, O) {
                        if (M) {
                            r = A;
                            n.connected = !0;
                            var S = n.createMessage("join");
                            S.addString(c);
                            if (null != e)
                                for (var R in e) S.addString(R), S.addString("" + e[R]);
                            n.sendMessage(S)
                        } else _pio.debugLog("Unable to connect to endpoint: " + K + '. reason: "' + O + (0 < B.length ? '". Trying next endpoint.' : '". No more endpoints to try.')), E()
                    }, function(M) {
                        n.connected && (n.connected = !1, setTimeout(function() {
                            for (var O = 0; O != q.length; O++) _pio.runCallback(q[O].callback, n, q[O].stackSource)
                        }, 100))
                    }, function(M) {
                        p ? "playerio.joinresult" == M.type ? (p = !1, M.getBoolean(0) ? _pio.runCallback(k, n, null) : _pio.handleError(d, l, M.getInt(1), M.getString(2))) : _pio.handleError(d, l, PlayerIOErrorCode.GeneralError,
                            "The expected inital messagetype is: playerio.joinresult, received: " + joinResult.getType()) : (F(M.type, M), F("*", M))
                    })
                } else _pio.handleError(d, l, PlayerIOErrorCode.GeneralError, "Could not establish a socket connection to any of the given endpoints for the room")
            }

            function F(K, A) {
                var M = u[K];
                if (M)
                    for (var O = 0; O < M.length; O++) _pio.runCallback(M[O].callback, A, M[O].stackSource)
            }
            var B = [];
            if (g) B.push(g);
            else
                for (var C = 0; C != a.length; C++) B.push(a[C].address + ":" + a[C].port);
            E()
        }
        var n = this,
            p = !0,
            q = [],
            u = {},
            t = [],
            r = null,
            x = /(WebKit|Firefox|Trident)\/([0-9]+)/gi.exec(navigator.userAgent),
            D = x && 3 <= x.length ? x[1] : null;
        x = x && 3 <= x.length ? parseInt(x[2]) : null;
        window.FileReader && "WebKit" == D && 535 <= x || "Firefox" == D && 11 <= x || "Trident" == D && 6 <= x ? m(function(w, E, F, B, C, K) {
            return new _pio.websocketConnection(!0, w, E, F, B, C, K)
        }) : _pio.isFlashFallbackEnabled(function(w) {
            w ? m(function(E, F, B, C, K, A) {
                return new _pio.flashSocketConnection(F, B, C, K, A)
            }) : m(function(E, F, B, C, K, A) {
                return new _pio.websocketConnection(!1, E, F, B, C, K, A)
            })
        });
        this.connected = !1;
        this.addDisconnectCallback = function(w) {
            q.push({
                callback: w,
                stackSourc: Error()
            })
        };
        this.addMessageCallback = function(w, E) {
            null == w && (w = "*");
            var F = u[w];
            F || (u[w] = F = []);
            F.push({
                callback: E,
                stackSource: Error()
            })
        };
        this.removeDisconnectCallback = function(w) {
            for (var E = 0; E < q.length; E++) q[E].callback == w && (q.splice(E, 1), E--)
        };
        this.removeMessageCallback = function(w) {
            for (var E in u)
                for (var F = u[E], B = 0; B < F.length; B++) F[B].callback == w && (F.splice(B, 1), B--)
        };
        this.createMessage = function(w) {
            for (var E = new _pio.message(w),
                    F = 1; F < arguments.length; F++) E.add(arguments[F]);
            return E
        };
        this.send = function(w) {
            var E = this.createMessage.apply(this, arguments);
            this.sendMessage(E)
        };
        this.sendMessage = function(w) {
            n.connected ? r.sendMessage(w) : t.push(w)
        };
        this.disconnect = function() {
            n.connected && r.disconnect()
        }
    };
    _pio.message = function(d) {
        function g(m, n, p, q) {
            if (m) l.push(n), k.push(p), e.length = l.length;
            else throw _pio.error("The given value (" + n + ") is not " + q);
        }

        function b(m, n) {
            if (m > l.length) throw _pio.error("this message (" + e.type + ") only has " +
                l.length + " entries");
            if (k[m] == n) return l[m];
            throw _pio.error("Value at index:" + m + " is a " + a(k[m]) + " and not a " + a(n) + " as requested. The value is: " + l[m]);
        }

        function a(m) {
            return {
                0: "Integer",
                1: "Unsigned Integer",
                2: "Long",
                3: "Unsigned Long",
                4: "Double",
                5: "Float",
                6: "String",
                7: "ByteArray",
                8: "Boolean"
            }[m]
        }

        function c(m) {
            var n = "object" == typeof m && "undefined" != typeof m.length;
            if (n)
                for (var p = 0; p != m.length; p++)
                    if (255 < m[p] || 0 > m[p]) {
                        n = !1;
                        break
                    }
            return n
        }
        var e = this,
            k = [],
            l = [];
        this.type = d;
        this.length = 0;
        this.add = function() {
            for (var m =
                    0; m < arguments.length; m++) {
                var n = arguments[m];
                switch (typeof n) {
                    case "string":
                        e.addString(n);
                        break;
                    case "boolean":
                        e.addBoolean(n);
                        break;
                    case "number":
                        if (isFinite(n) && Math.floor(n) === n)
                            if (-2147483648 <= n && 2147483647 >= n) {
                                e.addInt(n);
                                break
                            } else if (0 < n && 4294967295 >= n) {
                            e.addUInt(n);
                            break
                        } else if (-0x7ffffffffffffc00 <= n && 0x7ffffffffffffc00 >= n) {
                            e.addLong(n);
                            break
                        } else if (0 < n && 1.844674407370955E19 >= n) {
                            e.addULong(n);
                            break
                        }
                        e.addDouble(n);
                        break;
                    case "object":
                        if (c(n)) {
                            this.addByteArray(n);
                            break
                        }
                    default:
                        throw _pio.error("The type of the value (" +
                            n + ") cannot be inferred");
                }
            }
        };
        this.addInt = function(m) {
            g(-2147483648 <= m && 2147483647 >= m, Math.trunc(m), 0, "an integer (32bit)")
        };
        this.addUInt = function(m) {
            g(0 <= m && 4294967295 >= m, Math.trunc(m), 1, "an unsigned integer (32bit)")
        };
        this.addLong = function(m) {
            g(-0x7ffffffffffffc00 <= m && 0x7ffffffffffffc00 >= m, Math.trunc(m), 2, "a long (64bit)")
        };
        this.addULong = function(m) {
            g(0 <= m && 1.844674407370955E19 >= m, m, 3, "an unsigned long (64bit)")
        };
        this.addBoolean = function(m) {
            g(!0, m ? !0 : !1, 8, "a boolean value")
        };
        this.addFloat = function(m) {
            g(!0,
                Number(m), 5, "a floating point value (32bit)")
        };
        this.addDouble = function(m) {
            g(!0, Number(m), 4, "a double floating point value (64bit)")
        };
        this.addByteArray = function(m) {
            g(c(m), m, 7, "a bytearray")
        };
        this.addString = function(m) {
            g(!0, m + "", 6, "a string")
        };
        this.getInt = function(m) {
            return b(m, 0)
        };
        this.getUInt = function(m) {
            return b(m, 1)
        };
        this.getLong = function(m) {
            return b(m, 2)
        };
        this.getULong = function(m) {
            return b(m, 3)
        };
        this.getBoolean = function(m) {
            return b(m, 8)
        };
        this.getDouble = function(m) {
            return b(m, 4)
        };
        this.getFloat =
            function(m) {
                return b(m, 5)
            };
        this.getByteArray = function(m) {
            return b(m, 7)
        };
        this.getString = function(m) {
            return b(m, 6)
        };
        this.toString = function() {
            for (var m = "msg.Type = " + this.type, n = 0; n != this.length; n++) m += ", msg[" + n + "] = " + l[n] + " (" + a(k[n]) + ")";
            return m
        };
        this._internal_ = function(m, n) {
            switch (m) {
                case "get-objects":
                    return l;
                case "get-types":
                    return k
            }
        }
    };
    _pio.roomInfo = function(d, g, b, a) {
        this.id = d;
        this.roomType = g;
        this.onlineUsers = b;
        this.roomData = a
    };
    _pio.byteWriter = function() {
        this.bytes = [];
        this.writeByte = function(d) {
            if (0 <=
                d && 255 >= d) this.bytes.push(d);
            else throw Error("This is not a byte value: " + d);
        };
        this.writeBytes = function(d) {
            for (var g = 0; g != d.length; g++) this.writeByte(d[g])
        };
        this.writeTagWithLength = function(d, g, b) {
            63 < d || 0 > d ? this.writeBottomPatternAndBytes(b, _pio.binaryserializer.bytesFromInt(d)) : this.writeByte(g | d)
        };
        this.writeBottomPatternAndBytes = function(d, g) {
            var b = 0;
            0 != g[0] ? b = 3 : 0 != g[1] ? b = 2 : 0 != g[2] && (b = 1);
            this.writeByte(d | b);
            for (b = g.length - b - 1; b != g.length; b++) this.writeByte(g[b])
        };
        this.writeLongPattern = function(d,
            g, b) {
            for (var a = 0, c = 0; 7 != c; c++)
                if (0 != b[c]) {
                    a = 7 - c;
                    break
                }
            3 < a ? this.writeByte(g | a - 4) : this.writeByte(d | a);
            for (c = b.length - a - 1; c != b.length; c++) this.writeByte(b[c])
        }
    };
    _pio.messageSerializer = function() {
        this.serializeMessage = function(d) {
            var g = new _pio.byteWriter;
            g.writeTagWithLength(d.length, 128, 4);
            var b = _pio.binaryserializer.bytesFromString(d.type);
            g.writeTagWithLength(b.length, 192, 12);
            g.writeBytes(b);
            for (var a = 0; a != d.length; a++) switch (b = d._internal_("get-objects")[a], d._internal_("get-types")[a]) {
                case 6:
                    b =
                        _pio.binaryserializer.bytesFromString(b);
                    g.writeTagWithLength(b.length, 192, 12);
                    g.writeBytes(b);
                    break;
                case 0:
                    g.writeTagWithLength(b, 128, 4);
                    break;
                case 1:
                    g.writeBottomPatternAndBytes(8, _pio.binaryserializer.bytesFromUInt(b));
                    break;
                case 2:
                    g.writeLongPattern(48, 52, _pio.binaryserializer.bytesFromLong(b));
                    break;
                case 3:
                    g.writeLongPattern(56, 60, _pio.binaryserializer.bytesFromULong(b));
                    break;
                case 7:
                    g.writeTagWithLength(b.length, 64, 16);
                    g.writeBytes(b);
                    break;
                case 4:
                    g.writeByte(3);
                    g.writeBytes(_pio.binaryserializer.bytesFromDouble(b));
                    break;
                case 5:
                    g.writeByte(2);
                    b = _pio.binaryserializer.bytesFromFloat(b);
                    g.writeBytes(b);
                    break;
                case 8:
                    g.writeByte(b ? 1 : 0)
            }
            return g.bytes
        };
        this.deserializeMessage = function(d, g, b) {
            var a = g;
            g += b;
            b = null;
            for (var c = 0; a < g;) {
                var e = 0,
                    k = 0,
                    l = d[a];
                a++;
                var m = l & 192;
                0 == m && (m = l & 60, 0 == m && (m = l));
                switch (m) {
                    case 12:
                    case 16:
                        e = (l & 3) + 1;
                        if (a + e > g) throw Error("Unexpected: Unfinished message");
                        l = e;
                        e = _pio.binaryserializer.intFromBytes(d, a, e);
                        a += l;
                        break;
                    case 192:
                        e = l & 63;
                        break;
                    case 128:
                        k = l & 63;
                        break;
                    case 64:
                        e = l & 63;
                        break;
                    case 4:
                    case 8:
                    case 48:
                    case 56:
                        e =
                            (l & 3) + 1;
                        break;
                    case 52:
                    case 60:
                        e = (l & 3) + 5;
                        break;
                    case 3:
                        e = 8;
                        break;
                    case 2:
                        e = 4
                }
                if (a + e > g) throw Error("Unexpected: Unfinished message");
                switch (m) {
                    case 12:
                    case 192:
                        null == b ? (b = new _pio.message(_pio.binaryserializer.stringFromBytes(d, a, e)), c++) : b.addString(_pio.binaryserializer.stringFromBytes(d, a, e));
                        break;
                    case 4:
                        k = _pio.binaryserializer.intFromBytes(d, a, e);
                    case 128:
                        0 == c ? c = k : b.addInt(k);
                        break;
                    case 16:
                    case 64:
                        b.addByteArray(d.slice(a, a + e));
                        break;
                    case 8:
                        b.addUInt(_pio.binaryserializer.uintFromBytes(d, a, e));
                        break;
                    case 48:
                    case 52:
                        b.addLong(_pio.binaryserializer.longFromBytes(d, a, e));
                        break;
                    case 56:
                    case 60:
                        b.addULong(_pio.binaryserializer.ulongFromBytes(d, a, e));
                        break;
                    case 3:
                        b.addDouble(_pio.binaryserializer.doubleFromBytes(d, a, e));
                        break;
                    case 2:
                        b.addFloat(_pio.binaryserializer.floatFromBytes(d, a, e));
                        break;
                    case 1:
                        b.addBoolean(!0);
                        break;
                    case 0:
                        b.addBoolean(!1)
                }
                a += e;
                if (null != b && 0 == --c) return b
            }
            throw Error("Unexpected: Misaligned message");
        }
    };
    _pio.binaryserializer = {
        pow2: function(d) {
            return 0 <= d && 31 > d ? 1 << d : this.pow2[d] ||
                (this.pow2[d] = Math.pow(2, d))
        },
        _intEncode: function(d, g) {
            if (4 == g) var b = [d >>> 24 & 255, d >>> 16 & 255, d >>> 8 & 255, d & 255];
            else {
                if (0 <= d) {
                    b = Math.floor(d / this.pow2(32));
                    var a = d - b * this.pow2(32)
                } else b = Math.floor(d / this.pow2(32)), a = d - b * this.pow2(32), b += this.pow2(32);
                b = [b >>> 24 & 255, b >>> 16 & 255, b >>> 8 & 255, b & 255, a >>> 24 & 255, a >>> 16 & 255, a >>> 8 & 255, a & 255]
            }
            return b
        },
        _floatEncode: function(d, g, b) {
            var a = 0 > d ? 1 : 0,
                c, e = ~(-1 << b - 1),
                k = 1 - e;
            0 > d && (d = -d);
            0 === d ? d = c = 0 : isNaN(d) ? (c = 2 * e + 1, d = 1) : Infinity === d ? (c = 2 * e + 1, d = 0) : (c = Math.floor(Math.log(d) /
                Math.LN2), c >= k && c <= e ? (d = Math.floor((d * this.pow2(-c) - 1) * this.pow2(g)), c += e) : (d = Math.floor(d / this.pow2(k - g)), c = 0));
            for (e = []; 8 <= g;) e.push(d % 256), d = Math.floor(d / 256), g -= 8;
            c = c << g | d;
            for (b += g; 8 <= b;) e.push(c & 255), c >>>= 8, b -= 8;
            e.push(a << b | c);
            e.reverse();
            return e
        },
        bytesFromString: function(d) {
            for (var g = [], b = 0; b < d.length; b++)
                if (127 >= d.charCodeAt(b)) g.push(d.charCodeAt(b));
                else
                    for (var a = encodeURIComponent(d.charAt(b)).substr(1).split("%"), c = 0; c < a.length; c++) g.push(parseInt(a[c], 16));
            return g
        },
        bytesFromInt: function(d) {
            return this._intEncode(d,
                4)
        },
        bytesFromUInt: function(d) {
            return this._intEncode(d, 4)
        },
        bytesFromLong: function(d) {
            return this._intEncode(d, 8)
        },
        bytesFromULong: function(d) {
            return this._intEncode(d, 8)
        },
        bytesFromFloat: function(d) {
            return this._floatEncode(d, 23, 8)
        },
        bytesFromDouble: function(d) {
            return this._floatEncode(d, 52, 11)
        },
        _intDecode: function(d, g, b, a, c) {
            var e = g + b - 1;
            g = c && b == a && d[g] & 128;
            a = 0;
            c = 1;
            for (var k = 0; k < b; k++) {
                var l = d[e - k];
                g && (l = (l ^ 255) + c, c = l >> 8, l &= 255);
                a += l * this.pow2(8 * k)
            }
            return g ? -a : a
        },
        _float32Decode: function(d, g) {
            var b = d.slice(g,
                    g + 4).reverse(),
                a = 1 - 2 * (b[3] >> 7),
                c = (b[3] << 1 & 255 | b[2] >> 7) - 127;
            b = (b[2] & 127) << 16 | b[1] << 8 | b[0];
            return 128 === c ? 0 !== b ? NaN : Infinity * a : -127 === c ? a * b * this.pow2(-149) : a * (1 + b * this.pow2(-23)) * this.pow2(c)
        },
        _float64Decode: function(d, g) {
            var b = d.slice(g, g + 8).reverse(),
                a = 1 - 2 * (b[7] >> 7),
                c = ((b[7] << 1 & 255) << 3 | b[6] >> 4) - 1023;
            b = (b[6] & 15) * this.pow2(48) + b[5] * this.pow2(40) + b[4] * this.pow2(32) + b[3] * this.pow2(24) + b[2] * this.pow2(16) + b[1] * this.pow2(8) + b[0];
            return 1024 === c ? 0 !== b ? NaN : Infinity * a : -1023 === c ? a * b * this.pow2(-1074) : a * (1 + b *
                this.pow2(-52)) * this.pow2(c)
        },
        stringFromBytes: function(d, g, b) {
            for (var a = "", c = g; c < g + b; c++) a += 127 >= d[c] ? 37 === d[c] ? "%25" : String.fromCharCode(d[c]) : "%" + d[c].toString(16).toUpperCase();
            return decodeURIComponent(a)
        },
        intFromBytes: function(d, g, b) {
            return this._intDecode(d, g, b, 4, !0)
        },
        uintFromBytes: function(d, g, b) {
            return this._intDecode(d, g, b, 4, !1)
        },
        longFromBytes: function(d, g, b) {
            return this._intDecode(d, g, b, 8, !0)
        },
        ulongFromBytes: function(d, g, b) {
            return this._intDecode(d, g, b, 8, !1)
        },
        floatFromBytes: function(d, g,
            b) {
            return 4 == b ? this._float32Decode(d, g) : NaN
        },
        doubleFromBytes: function(d, g, b) {
            return 8 == b ? this._float64Decode(d, g) : NaN
        }
    };
    for (var f = [], h = 0; 65 != h; h++) f["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charCodeAt(h)] = h;
    _pio.base64encode = function(d) {
        for (var g = [], b = 0; b < d.length; b++) {
            var a = d[b],
                c = ++b <= d.length ? d[b] : NaN,
                e = ++b <= d.length ? d[b] : NaN,
                k = a >> 2;
            a = (a & 3) << 4 | c >> 4;
            var l = (c & 15) << 2 | e >> 6,
                m = e & 63;
            isNaN(c) ? l = m = 64 : isNaN(e) && (m = 64);
            g.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(k));
            g.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a));
            g.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(l));
            g.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(m))
        }
        return g.join("")
    };
    _pio.base64decode = function(d) {
        for (var g = [], b = 0; b < d.length; b++) {
            var a = f[d.charCodeAt(b)],
                c = ++b < d.length ? f[d.charCodeAt(b)] : 64,
                e = ++b < d.length ? f[d.charCodeAt(b)] : 64,
                k = ++b < d.length ? f[d.charCodeAt(b)] : 64,
                l = (c & 15) << 4 | e >> 2,
                m = (e & 3) <<
                6 | k;
            g.push(a << 2 | c >> 4);
            64 != e && (g.push(l), 64 != k && g.push(m))
        }
        return g
    }
})();
(function() {
    _pio.achievements = function(f) {
        function h(b, a) {
            var c = new _pio.achievement(b.identifier, b.title, b.description, b.imageurl, b.progress, b.progressgoal, b.lastupdated);
            if ("string" !== typeof g.myAchievements)
                for (var e = 0; e < g.myAchievements.length; e++) g.myAchievements[e].id == c.id && (g.myAchievements[e] = c, g.currentVersion = null);
            if (a)
                for (e = 0; e < g.onCompleteHandlers.length; e++)(0, g.onCompleteHandlers[e])(c);
            return c
        }
        var d = null;
        this.myAchievements = "[ERROR: You tried to access achievements.myAchievements before loading them. You have to call the refresh method first.]";
        this.onCompleteHandlers = [];
        var g = this;
        this.addOnComplete = function(b) {
            if ("function" === typeof b && 1 == b.length) g.onCompleteHandlers.push(b);
            else throw new PlayerIOError(PlayerIOErrorCode.InvalidArgument, "Expects argument to be a function that takes an achievement as an argument.");
        };
        this.get = function(b) {
            if ("string" === typeof g.myAchievements) return null;
            for (var a = 0; a < g.myAchievements.length; a++)
                if (g.myAchievements[a].id == b) return g.myAchievements[a];
            return null
        };
        this.refresh = function(b, a) {
            f.achievementsRefresh(d,
                b, a,
                function(c) {
                    if (d != c.version)
                        if (d = c.version, null == c.achievements || 0 == c.achievements.length) g.myAchievements = [];
                        else {
                            for (var e = [], k = 0; k < c.achievements.length; k++) {
                                var l = c.achievements[k];
                                e.push(new _pio.achievement(l.identifier, l.title, l.description, l.imageurl, l.progress, l.progressgoal, l.lastupdated))
                            }
                            g.myAchievements = e
                        }
                })
        };
        this.load = function(b, a, c) {
            "object" == typeof b || requests.length ? f.achievementsLoad(b, a, c, function(e) {
                if (null == e || 0 == e.length) return {};
                for (var k = {}, l = 0; l < e.userachievements.length; l++) {
                    for (var m =
                            e.userachievements[l], n = [], p = 0; p < m.achievements.length; p++) {
                        var q = m.achievements[p];
                        n.push(new _pio.achievement(q.identifier, q.title, q.description, q.imageurl, q.progress, q.progressgoal, q.lastupdated))
                    }
                    k[m.userid] = n
                }
                return k
            }) : (b = _pio.error("The first argument to load should be an array: client.achievements.load(['user1', 'user2', ...], ...)"), _pio.handleError(b, c, b.code, b.message))
        };
        this.progressSet = function(b, a, c, e) {
            f.achievementsProgressSet(b, a, c, e, function(k) {
                return h(k.achievement, k.completednow)
            })
        };
        this.progressAdd = function(b, a, c, e) {
            f.achievementsProgressAdd(b, a, c, e, function(k) {
                return h(k.achievement, k.completednow)
            })
        };
        this.progressMax = function(b, a, c, e) {
            f.achievementsProgressMax(b, a, c, e, function(k) {
                return h(k.achievement, k.completednow)
            })
        };
        this.progressComplete = function(b, a, c) {
            f.achievementsProgressComplete(b, a, c, function(e) {
                return h(e.achievement, e.completednow)
            })
        }
    };
    _pio.achievement = function(f, h, d, g, b, a, c) {
        this.id = f;
        this.title = h;
        this.description = d;
        this.imageUrl = g;
        this.progress = "undefined" ===
            typeof b ? 0 : b;
        this.progressGoal = a;
        this.lastUpdated = new Date(1E3 * c);
        this.progressRatio = this.progress / this.progressGoal;
        this.completed = this.progress == this.progressGoal
    }
})();
(function() {
    _pio.playerInsight = function(f) {
        function h(g) {
            d.playersOnline = -1 == g.playersonline ? "[ERROR: The current connection does not have the rights required to read the playersonline variable.]" : g.playersonline;
            d.segments = _pio.convertFromKVArray(g.segments)
        }
        this.playersOnline = "[ERROR: You tried to access playerInsight.playersOnline before loading it. You have to call the refresh method first.]";
        this.segments = {};
        var d = this;
        this.refresh = function(g, b) {
            f.playerInsightRefresh(g, b, function(a) {
                h(a.state)
            })
        };
        this.setSegments = function(g, b, a) {
            f.playerInsightSetSegments(_pio.convertToSegmentArray(g), b, a, function(c) {
                h(c.state)
            })
        };
        this.trackInvitedBy = function(g, b, a, c) {
            f.playerInsightTrackInvitedBy(g, b, a, c, function(e) {})
        };
        this.trackEvent = function(g, b, a, c) {
            f.playerInsightTrackEvents([{
                eventtype: g,
                value: b
            }], a, c, function(e) {})
        };
        this.trackExternalPayment = function(g, b, a, c) {
            f.playerInsightTrackExternalPayment(g, b, a, c, function(e) {})
        };
        this.sessionKeepAlive = function(g, b) {
            f.playerInsightSessionKeepAlive(g, b, function(a) {})
        }
    }
})();
(function() {
    _pio.oneScore = function(f) {
        this.percentile = "[ERROR: You tried to access oneScore.percentile before loading the OneScore. You have to call the refresh method first.]";
        this.score = "[ERROR: You tried to access oneScore.score before loading the OneScore. You have to call the refresh method first.]";
        this.topRank = "[ERROR: You tried to access oneScore.topRank before loading the OneScore. You have to call the refresh method first.]";
        var h = this;
        this.refresh = function(d, g) {
            f.oneScoreRefresh(d, g, function(b) {
                b =
                    new _pio.oneScoreValue(b.onescore.percentile, b.onescore.score, b.onescore.toprank);
                h.percentile = b.percentile;
                h.score = b.score;
                h.topRank = b.toprank
            })
        };
        this.set = function(d, g, b) {
            f.oneScoreSet(d, g, b, function(a) {
                a = new _pio.oneScoreValue(a.onescore.percentile, a.onescore.score, a.onescore.toprank);
                h.percentile = a.percentile;
                h.score = a.score;
                h.topRank = a.toprank;
                return a
            })
        };
        this.add = function(d, g, b) {
            f.oneScoreAdd(d, g, b, function(a) {
                a = new _pio.oneScoreValue(a.onescore.percentile, a.onescore.score, a.onescore.toprank);
                h.percentile = a.percentile;
                h.score = a.score;
                h.topRank = a.toprank;
                return a
            })
        };
        this.load = function(d, g, b) {
            if ("object" == typeof d || requests.length) f.oneScoreLoad(d, g, b, function(a) {
                if (null == a || null == a.onescores || 0 == a.onescores.length) return [];
                for (var c = [], e = 0, k = 0; k < d.length; k++) {
                    var l = a.onescores[e];
                    l && d[k] == l.userid ? (c.push(new _pio.oneScoreValue(l.percentile, l.score, l.toprank)), e++) : c.push(null)
                }
                return c
            });
            else g = _pio.error("The first argument to load should be an array: client.oneScore.load(['user1', 'user2', ...], ...)"),
                _pio.handleError(g, b, g.code, g.message)
        }
    };
    _pio.oneScoreValue = function(f, h, d) {
        this.percentile = "undefined" === typeof f ? 0 : f;
        this.score = "undefined" === typeof h ? 0 : h;
        this.topRank = "undefined" === typeof d ? 0 : d
    }
})();
(function() {
    _pio.notifications = function(f) {
        function h(a) {
            if (a.version != b) {
                var c = [];
                if (a.endpoints)
                    for (var e = 0; e != a.endpoints.length; e++) {
                        var k = a.endpoints[e];
                        c[e] = new _pio.notificationEndpoint(k.type, k.identifier, _pio.convertFromKVArray(k.configuration), k.enabled ? !0 : !1)
                    }
                b = a.version;
                g.myEndpoints = c
            }
        }

        function d(a) {
            var c = [];
            if (a && 0 < a.length)
                for (var e = 0; e != a.length; e++) {
                    var k = a[e];
                    k.type && k.identifier && c.push({
                        type: k.type,
                        identifier: k.identifier
                    })
                }
            return c
        }
        this.myEndpoints = "[ERROR: You tried to access notifications.myEndpoints before calling refresh.]";
        var g = this,
            b = "";
        this.refresh = function(a, c) {
            f.notificationsRefresh(b, a, c, h)
        };
        this.registerEndpoint = function(a, c, e, k, l, m) {
            var n;
            a: {
                if ("" != b)
                    for (n = 0; n != g.myEndpoints.length; n++) {
                        var p = g.myEndpoints[n];
                        if (p.type == a && p.identifier == c) {
                            n = p;
                            break a
                        }
                    }
                n = null
            }(p = null == n || n.enabled != k) || (p = JSON.stringify(n.configuration) != JSON.stringify(e));
            p ? f.notificationsRegisterEndpoints(b, [{
                type: a,
                identifier: c,
                configuration: _pio.convertToKVArray(e),
                enabled: k
            }], l, m, h) : l && l()
        };
        this.toggleEndpoints = function(a, c, e, k) {
            a = d(a);
            0 < a.length ? f.notificationsToggleEndpoints(b, a, c ? !0 : !1, e, k, h) : e && e()
        };
        this.deleteEndpoints = function(a, c, e) {
            a = d(a);
            0 < a.length ? f.notificationsDeleteEndpoints(b, a, c, e, h) : c && c()
        };
        this.send = function(a, c, e) {
            for (var k = [], l = 0; l != a.length; l++) {
                var m = a[l],
                    n = {
                        recipient: m.recipientUserId,
                        endpointtype: m.endpointType,
                        data: {}
                    };
                0 != (n.recipient + "").length && 0 != (n.endpointtype + "").length || console.log("error");
                for (var p in m) "recipientUserId" != p && "endpointType" != p && (n.data[p] = m[p]);
                k[l] = n
            }
            0 < k.length ? f.notificationsSend(k,
                c, e, null) : c && c()
        }
    };
    _pio.notificationEndpoint = function(f, h, d, g) {
        this.type = f;
        this.identifier = h;
        this.configuration = d;
        this.enabled = g
    }
})();
(function() {
    _pio.publishingNetwork = function(f, h) {
        var d = this;
        this.profiles = new _pio.publishingNetworkProfiles(f);
        this.payments = new _pio.publishingNetworkPayments(f);
        this.relations = new _pio.publishingNetworkRelations(f, h, this);
        this.userToken = "[ERROR: you tried to access publishingNetwork.userToken before calling publishingNetwork.refresh(callback)]";
        this.refresh = function(g, b) {
            f.socialRefresh(g, b, function(a) {
                d.userToken = a.myprofile.usertoken;
                d.profiles.myProfile = new _pio.publishingNetworkProfile(a.myprofile);
                "undefined" == typeof _pio.friendLookup && (_pio.friendLookup = {}, _pio.blockedLookup = {});
                var c = _pio.friendLookup[d.profiles.myProfile.userId],
                    e = _pio.blockedLookup[d.profiles.myProfile.userId];
                c || e || (c = _pio.friendLookup[d.profiles.myProfile.userId] = {}, e = _pio.blockedLookup[d.profiles.myProfile.userId] = {});
                d.relations.friends = [];
                for (var k = 0; k != a.friends.length; k++) {
                    var l = new _pio.publishingNetworkProfile(a.friends[k]);
                    d.relations.friends.push(l);
                    c[l.userId] = !0
                }
                for (k = 0; k != a.blocked.length; k++) e[a.blocked[k]] = !0
            })
        }
    };
    _pio.showDialog = function(f, h, d, g) {
        if ("undefined" == typeof window.PublishingNetwork) throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotAvailable, "PublishingNetwork.js was not found on the current page. You have to include the 'piocdn.com/publishingnetwork.js' on the containing page to show dialogs. See http://playerio.com/documentation/ for more information.");
        d.__apitoken__ = h.token;
        window.PublishingNetwork.dialog(f, d, g)
    }
})();
(function() {
    _pio.publishingNetworkPayments = function(f) {
        this.showBuyCoinsDialog = function(h, d, g, b) {
            d || (d = {});
            d.coinamount = h;
            f.payVaultPaymentInfo("publishingnetwork", _pio.convertToKVArray(d), null, function(a) {
                _pio.showDialog("buy", f, a, function(c) {
                    c.error ? b(new PlayerIOError(PlayerIOErrorCode.GeneralError, c.error)) : g(c)
                })
            }, b, function(a) {
                return _pio.convertFromKVArray(a.providerarguments)
            })
        };
        this.showBuyItemsDialog = function(h, d, g, b) {
            f.payVaultPaymentInfo("publishingnetwork", _pio.convertToKVArray(d || {}),
                _pio.convertBuyItems(h),
                function(a) {
                    _pio.showDialog("buy", f, a, function(c) {
                        c.error ? b(new PlayerIOError(PlayerIOErrorCode.GeneralError, c.error)) : g(c)
                    })
                }, b,
                function(a) {
                    return _pio.convertFromKVArray(a.providerarguments)
                })
        }
    }
})();
(function() {
    _pio.publishingNetworkProfiles = function(f) {
        this.myProfile = "[ERROR: you tried to access publishingNetworkProfiles.myProfile before calling publishingNetwork.refresh(callback)]";
        this.showProfile = function(h, d) {
            _pio.showDialog("profile", f, {
                userId: h
            }, d)
        };
        this.loadProfiles = function(h, d, g) {
            f.socialLoadProfiles(h, d, g, function(b) {
                for (var a = [], c = 0; c != h.length; c++) {
                    var e = h[c];
                    a[c] = null;
                    for (var k = 0; k != b.profiles.length; k++) {
                        var l = b.profiles[k];
                        if (l && l.userid == e) {
                            a[c] = new _pio.publishingNetworkProfile(b.profiles[k]);
                            break
                        }
                    }
                }
                return a
            })
        }
    };
    _pio.publishingNetworkProfile = function(f) {
        this.userId = f.userid;
        this.displayName = f.displayname;
        this.avatarUrl = f.avatarurl;
        this.lastOnline = new Date(f.lastonline);
        this.countryCode = f.countrycode
    }
})();
(function() {
    _pio.publishingNetworkRelations = function(f, h, d) {
        this.friends = "[ERROR: you tried to access publishingNetworkRelations.friends before calling publishingNetwork.refresh(callback)]";
        this.isFriend = function(g) {
            if ("undefined" != typeof _pio.friendLookup && "undefined" != typeof _pio.friendLookup[h]) return _pio.friendLookup[h][g] || !1;
            throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotLoaded, "Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first");
        };
        this.isBlocked = function(g) {
            if ("undefined" != typeof _pio.blockedLookup && "undefined" != typeof _pio.blockedLookup[h]) return _pio.blockedLookup[h][g] || !1;
            throw new PlayerIOError(PlayerIOErrorCode.PublishingNetworkNotLoaded, "Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first");
        };
        this.showRequestFriendshipDialog = function(g, b) {
            _pio.showDialog("requestfriendship", f, {
                userId: g
            }, b)
        };
        this.showRequestBlockUserDialog = function(g, b) {
            _pio.showDialog("requestblockuser",
                f, {
                    userId: g
                },
                function() {
                    d.refresh(function() {
                        b && b()
                    }, function() {
                        b && b()
                    })
                })
        };
        this.showFriendsManager = function(g) {
            _pio.showDialog("friendsmanager", f, {}, function(b) {
                b.updated ? d.refresh(function() {
                    g && g()
                }, function() {
                    g && g()
                }) : g && g()
            })
        };
        this.showBlockedUsersManager = function(g) {
            _pio.showDialog("blockedusersmanager", f, {}, function(b) {
                b.updated ? d.refresh(function() {
                    g && g()
                }, function() {
                    g && g()
                }) : g && g()
            })
        }
    }
})();
(function() {
    var f = "undefined" !== typeof window && "undefined" !== typeof window.document ? window.document : {},
        h = "undefined" !== typeof module && module.exports,
        d = function() {
            for (var a, c = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "),
                    "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")
                ], e = 0, k = c.length, l = {}; e < k; e++)
                if ((a = c[e]) && a[1] in f) {
                    for (e = 0; e < a.length; e++) l[c[0][e]] = a[e];
                    return l
                }
            return !1
        }(),
        g = {
            change: d.fullscreenchange,
            error: d.fullscreenerror
        },
        b = {
            request: function(a) {
                return new Promise(function(c, e) {
                    var k = function() {
                        this.off("change",
                            k);
                        c()
                    }.bind(this);
                    this.on("change", k);
                    a = a || f.documentElement;
                    Promise.resolve(a[d.requestFullscreen]())["catch"](e)
                }.bind(this))
            },
            exit: function() {
                return new Promise(function(a, c) {
                    if (this.isFullscreen) {
                        var e = function() {
                            this.off("change", e);
                            a()
                        }.bind(this);
                        this.on("change", e);
                        Promise.resolve(f[d.exitFullscreen]())["catch"](c)
                    } else a()
                }.bind(this))
            },
            toggle: function(a) {
                return this.isFullscreen ? this.exit() : this.request(a)
            },
            onchange: function(a) {
                this.on("change", a)
            },
            onerror: function(a) {
                this.on("error", a)
            },
            on: function(a, c) {
                var e = g[a];
                e && f.addEventListener(e, c, !1)
            },
            off: function(a, c) {
                var e = g[a];
                e && f.removeEventListener(e, c, !1)
            },
            raw: d
        };
    d ? (Object.defineProperties(b, {
        isFullscreen: {
            get: function() {
                return !!f[d.fullscreenElement]
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return f[d.fullscreenElement]
            }
        },
        isEnabled: {
            enumerable: !0,
            get: function() {
                return !!f[d.fullscreenEnabled]
            }
        }
    }), h ? module.exports = b : window.screenfull = b) : h ? module.exports = {
        isEnabled: !1
    } : window.screenfull = {
        isEnabled: !1
    }
})();
(function() {
    function f(w) {
        w = String(w);
        return w.charAt(0).toUpperCase() + w.slice(1)
    }

    function h(w, E) {
        var F = -1,
            B = w ? w.length : 0;
        if ("number" == typeof B && -1 < B && B <= u)
            for (; ++F < B;) E(w[F], F, w);
        else g(w, E)
    }

    function d(w) {
        w = k(w);
        return /^(?:webOS|i(?:OS|P))/.test(w) ? w : f(w)
    }

    function g(w, E) {
        for (var F in w) r.call(w, F) && E(w[F], F, w)
    }

    function b(w) {
        return null == w ? f(w) : x.call(w).slice(8, -1)
    }

    function a(w, E) {
        var F = null != w ? typeof w[E] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(F) && ("object" == F ? !!w[E] : !0)
    }

    function c(w) {
        return String(w).replace(/([ -])(?!$)/g,
            "$1?")
    }

    function e(w, E) {
        var F = null;
        h(w, function(B, C) {
            F = E(F, B, C, w)
        });
        return F
    }

    function k(w) {
        return String(w).replace(/^ +| +$/g, "")
    }

    function l(w) {
        function E(N) {
            return e(N, function(J, I) {
                var P = I.pattern || c(I);
                !J && (J = RegExp("\\b" + P + " *\\d+[.\\w_]*", "i").exec(w) || RegExp("\\b" + P + " *\\w+-[\\w]*", "i").exec(w) || RegExp("\\b" + P + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(w)) && ((J = String(I.label && !RegExp(P, "i").test(I.label) ? I.label : J).split("/"))[1] && !/[\d.]+/.test(J[0]) && (J[0] += " " + J[1]), I = I.label ||
                    I, J = d(J[0].replace(RegExp(P, "i"), I).replace(RegExp("; *(?:" + I + "[_-])?", "i"), " ").replace(RegExp("(" + I + ")[-_.]?(\\w)", "i"), "$1 $2")));
                return J
            })
        }

        function F(N) {
            return e(N, function(J, I) {
                return J || (RegExp(I + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(w) || 0)[1] || null
            })
        }
        var B = n,
            C = w && "object" == typeof w && "String" != b(w);
        C && (B = w, w = null);
        var K = B.navigator || {},
            A = K.userAgent || "";
        w || (w = A);
        var M = C ? !!K.likeChrome : /\bChrome\b/.test(w) && !/internal|\n/i.test(x.toString()),
            O = C ? "Object" : "ScriptBridgingProxyObject",
            S = C ? "Object" : "Environment",
            R = C && B.java ? "JavaPackage" : b(B.java),
            ca = C ? "Object" : "RuntimeObject";
        S = (R = /\bJava/.test(R) && B.java) && b(B.environment) == S;
        var da = R ? "a" : "\u03b1",
            ea = R ? "b" : "\u03b2",
            Y = B.document || {},
            T = B.operamini || B.opera,
            V = t.test(V = C && T ? T["[[Class]]"] : b(T)) ? V : T = null,
            v, W = w;
        C = [];
        var X = null,
            U = w == A;
        A = U && T && "function" == typeof T.version && T.version();
        var H = function(N) {
                return e(N, function(J, I) {
                    return J || RegExp("\\b" + (I.pattern || c(I)) + "\\b", "i").exec(w) && (I.label || I)
                })
            }([{
                    label: "EdgeHTML",
                    pattern: "Edge"
                },
                "Trident", {
                    label: "WebKit",
                    pattern: "AppleWebKit"
                }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"
            ]),
            y = function(N) {
                return e(N, function(J, I) {
                    return J || RegExp("\\b" + (I.pattern || c(I)) + "\\b", "i").exec(w) && (I.label || I)
                })
            }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
                    label: "Microsoft Edge",
                    pattern: "(?:Edge|Edg|EdgA|EdgiOS)"
                }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS",
                "Raven", "Rekonq", "RockMelt", {
                    label: "Samsung Internet",
                    pattern: "SamsungBrowser"
                }, "SeaMonkey", {
                    label: "Silk",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Sleipnir", "SlimBrowser", {
                    label: "SRWare Iron",
                    pattern: "Iron"
                }, "Sunrise", "Swiftfox", "Vivaldi", "Waterfox", "WebPositive", {
                    label: "Yandex Browser",
                    pattern: "YaBrowser"
                }, {
                    label: "UC Browser",
                    pattern: "UCBrowser"
                }, "Opera Mini", {
                    label: "Opera Mini",
                    pattern: "OPiOS"
                }, "Opera", {
                    label: "Opera",
                    pattern: "OPR"
                }, "Chromium", "Chrome", {
                    label: "Chrome",
                    pattern: "(?:HeadlessChrome)"
                },
                {
                    label: "Chrome Mobile",
                    pattern: "(?:CriOS|CrMo)"
                }, {
                    label: "Firefox",
                    pattern: "(?:Firefox|Minefield)"
                }, {
                    label: "Firefox for iOS",
                    pattern: "FxiOS"
                }, {
                    label: "IE",
                    pattern: "IEMobile"
                }, {
                    label: "IE",
                    pattern: "MSIE"
                }, "Safari"
            ]),
            G = E([{
                label: "BlackBerry",
                pattern: "BB10"
            }, "BlackBerry", {
                label: "Galaxy S",
                pattern: "GT-I9000"
            }, {
                label: "Galaxy S2",
                pattern: "GT-I9100"
            }, {
                label: "Galaxy S3",
                pattern: "GT-I9300"
            }, {
                label: "Galaxy S4",
                pattern: "GT-I9500"
            }, {
                label: "Galaxy S5",
                pattern: "SM-G900"
            }, {
                label: "Galaxy S6",
                pattern: "SM-G920"
            }, {
                label: "Galaxy S6 Edge",
                pattern: "SM-G925"
            }, {
                label: "Galaxy S7",
                pattern: "SM-G930"
            }, {
                label: "Galaxy S7 Edge",
                pattern: "SM-G935"
            }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
                label: "Kindle Fire",
                pattern: "(?:Cloud9|Silk-Accelerated)"
            }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", {
                label: "Wii U",
                pattern: "WiiU"
            }, "Wii", "Xbox One", {
                label: "Xbox 360",
                pattern: "Xbox"
            }, "Xoom"]),
            L = function(N) {
                return e(N, function(J, I, P) {
                    return J || (I[G] || I[/^[a-z]+(?: +[a-z]+\b)*/i.exec(G)] || RegExp("\\b" + c(P) +
                        "(?:\\b|\\w*\\d)", "i").exec(w)) && P
                })
            }({
                Apple: {
                    iPad: 1,
                    iPhone: 1,
                    iPod: 1
                },
                Alcatel: {},
                Archos: {},
                Amazon: {
                    Kindle: 1,
                    "Kindle Fire": 1
                },
                Asus: {
                    Transformer: 1
                },
                "Barnes & Noble": {
                    Nook: 1
                },
                BlackBerry: {
                    PlayBook: 1
                },
                Google: {
                    "Google TV": 1,
                    Nexus: 1
                },
                HP: {
                    TouchPad: 1
                },
                HTC: {},
                Huawei: {},
                Lenovo: {},
                LG: {},
                Microsoft: {
                    Xbox: 1,
                    "Xbox One": 1
                },
                Motorola: {
                    Xoom: 1
                },
                Nintendo: {
                    "Wii U": 1,
                    Wii: 1
                },
                Nokia: {
                    Lumia: 1
                },
                Oppo: {},
                Samsung: {
                    "Galaxy S": 1,
                    "Galaxy S2": 1,
                    "Galaxy S3": 1,
                    "Galaxy S4": 1
                },
                Sony: {
                    PlayStation: 1,
                    "PlayStation Vita": 1
                },
                Xiaomi: {
                    Mi: 1,
                    Redmi: 1
                }
            }),
            z = function(N) {
                return e(N, function(J, I) {
                    var P = I.pattern || c(I);
                    if (!J && (J = RegExp("\\b" + P + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(w))) {
                        var Q = J,
                            Z = I.label || I,
                            aa = {
                                "10.0": "10",
                                "6.4": "10 Technical Preview",
                                "6.3": "8.1",
                                "6.2": "8",
                                "6.1": "Server 2008 R2 / 7",
                                "6.0": "Server 2008 / Vista",
                                "5.2": "Server 2003 / XP 64-bit",
                                "5.1": "XP",
                                "5.01": "2000 SP1",
                                "5.0": "2000",
                                "4.0": "NT",
                                "4.90": "ME"
                            };
                        P && Z && /^Win/i.test(Q) && !/^Windows Phone /i.test(Q) && (aa = aa[/[\d.]+$/.exec(Q)]) && (Q = "Windows " + aa);
                        Q = String(Q);
                        P && Z && (Q = Q.replace(RegExp(P,
                            "i"), Z));
                        J = Q = d(Q.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])
                    }
                    return J
                })
            }(["Windows Phone", "KaiOS", "Android", "CentOS", {
                    label: "Chrome OS",
                    pattern: "CrOS"
                }, "Debian",
                {
                    label: "DragonFly BSD",
                    pattern: "DragonFly"
                }, "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "
            ]);
        H && (H = [H]);
        /\bAndroid\b/.test(z) && !G && (v = /\bAndroid[^;]*;(.*?)(?:Build|\) AppleWebKit)\b/i.exec(w)) && (G = k(v[1]).replace(/^[a-z]{2}-[a-z]{2};\s*/i, "") || null);
        L && !G ? G = E([L]) : L && G && (G = G.replace(RegExp("^(" + c(L) + ")[-_.\\s]", "i"),
            L + " ").replace(RegExp("^(" + c(L) + ")[-_.]?(\\w)", "i"), L + " $2"));
        if (v = /\bGoogle TV\b/.exec(G)) G = v[0];
        /\bSimulator\b/i.test(w) && (G = (G ? G + " " : "") + "Simulator");
        "Opera Mini" == y && /\bOPiOS\b/.test(w) && C.push("running in Turbo/Uncompressed mode");
        "IE" == y && /\blike iPhone OS\b/.test(w) ? (v = l(w.replace(/like iPhone OS/, "")), L = v.manufacturer, G = v.product) : /^iP/.test(G) ? (y || (y = "Safari"), z = "iOS" + ((v = / OS ([\d_]+)/i.exec(w)) ? " " + v[1].replace(/_/g, ".") : "")) : "Konqueror" == y && /^Linux\b/i.test(z) ? z = "Kubuntu" : L && "Google" !=
            L && (/Chrome/.test(y) && !/\bMobile Safari\b/i.test(w) || /\bVita\b/.test(G)) || /\bAndroid\b/.test(z) && /^Chrome/.test(y) && /\bVersion\//i.test(w) ? (y = "Android Browser", z = /\bAndroid\b/.test(z) ? z : "Android") : "Silk" == y ? (/\bMobi/i.test(w) || (z = "Android", C.unshift("desktop mode")), /Accelerated *= *true/i.test(w) && C.unshift("accelerated")) : "UC Browser" == y && /\bUCWEB\b/.test(w) ? C.push("speed mode") : "PaleMoon" == y && (v = /\bFirefox\/([\d.]+)\b/.exec(w)) ? C.push("identifying as Firefox " + v[1]) : "Firefox" == y && (v = /\b(Mobile|Tablet|TV)\b/i.exec(w)) ?
            (z || (z = "Firefox OS"), G || (G = v[1])) : !y || (v = !/\bMinefield\b/i.test(w) && /\b(?:Firefox|Safari)\b/.exec(y)) ? (y && !G && /[\/,]|^[^(]+?\)/.test(w.slice(w.indexOf(v + "/") + 8)) && (y = null), (v = G || L || z) && (G || L || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(z)) && (y = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(z) ? z : v) + " Browser")) : "Electron" == y && (v = (/\bChrome\/([\d.]+)\b/.exec(w) || 0)[1]) && C.push("Chromium " + v);
        A || (A = F(["(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|HeadlessChrome|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$)|UCBrowser|YaBrowser)",
            "Version", c(y), "(?:Firefox|Minefield|NetFront)"
        ]));
        if (v = "iCab" == H && 3 < parseFloat(A) && "WebKit" || /\bOpera\b/.test(y) && (/\bOPR\b/.test(w) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(w) && !/^(?:Trident|EdgeHTML)$/.test(H) && "WebKit" || !H && /\bMSIE\b/i.test(w) && ("Mac OS" == z ? "Tasman" : "Trident") || "WebKit" == H && /\bPlayStation\b(?! Vita\b)/i.test(y) && "NetFront") H = [v];
        "IE" == y && (v = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(w) || 0)[1]) ? (y += " Mobile", z = "Windows Phone " + (/\+$/.test(v) ? v : v + ".x"), C.unshift("desktop mode")) :
            /\bWPDesktop\b/i.test(w) ? (y = "IE Mobile", z = "Windows Phone 8.x", C.unshift("desktop mode"), A || (A = (/\brv:([\d.]+)/.exec(w) || 0)[1])) : "IE" != y && "Trident" == H && (v = /\brv:([\d.]+)/.exec(w)) && (y && C.push("identifying as " + y + (A ? " " + A : "")), y = "IE", A = v[1]);
        if (U) {
            if (a(B, "global"))
                if (R && (v = R.lang.System, W = v.getProperty("os.arch"), z = z || v.getProperty("os.name") + " " + v.getProperty("os.version")), S) {
                    try {
                        A = B.require("ringo/engine").version.join("."), y = "RingoJS"
                    } catch (N) {
                        (v = B.system) && v.global.system == B.system && (y = "Narwhal",
                            z || (z = v[0].os || null))
                    }
                    y || (y = "Rhino")
                } else "object" == typeof B.process && !B.process.browser && (v = B.process) && ("object" == typeof v.versions && ("string" == typeof v.versions.electron ? (C.push("Node " + v.versions.node), y = "Electron", A = v.versions.electron) : "string" == typeof v.versions.nw && (C.push("Chromium " + A, "Node " + v.versions.node), y = "NW.js", A = v.versions.nw)), y || (y = "Node.js", W = v.arch, z = v.platform, A = (A = /[\d.]+/.exec(v.version)) ? A[0] : null));
            else b(v = B.runtime) == O ? (y = "Adobe AIR", z = v.flash.system.Capabilities.os) :
                b(v = B.phantom) == ca ? (y = "PhantomJS", A = (v = v.version || null) && v.major + "." + v.minor + "." + v.patch) : "number" == typeof Y.documentMode && (v = /\bTrident\/(\d+)/i.exec(w)) ? (A = [A, Y.documentMode], (v = +v[1] + 4) != A[1] && (C.push("IE " + A[1] + " mode"), H && (H[1] = ""), A[1] = v), A = "IE" == y ? String(A[1].toFixed(1)) : A[0]) : "number" == typeof Y.documentMode && /^(?:Chrome|Firefox)\b/.test(y) && (C.push("masking as " + y + " " + A), y = "IE", A = "11.0", H = ["Trident"], z = "Windows");
            z = z && d(z)
        }
        A && (v = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(A) || /(?:alpha|beta)(?: ?\d)?/i.exec(w +
            ";" + (U && K.appMinorVersion)) || /\bMinefield\b/i.test(w) && "a") && (X = /b/i.test(v) ? "beta" : "alpha", A = A.replace(RegExp(v + "\\+?$"), "") + ("beta" == X ? ea : da) + (/\d+\+?/.exec(v) || ""));
        if ("Fennec" == y || "Firefox" == y && /\b(?:Android|Firefox OS|KaiOS)\b/.test(z)) y = "Firefox Mobile";
        else if ("Maxthon" == y && A) A = A.replace(/\.[\d.]+/, ".x");
        else if (/\bXbox\b/i.test(G)) "Xbox 360" == G && (z = null), "Xbox 360" == G && /\bIEMobile\b/.test(w) && C.unshift("mobile mode");
        else if (!/^(?:Chrome|IE|Opera)$/.test(y) && (!y || G || /Browser|Mobi/.test(y)) ||
            "Windows CE" != z && !/Mobi/i.test(w))
            if ("IE" == y && U) try {
                null === B.external && C.unshift("platform preview")
            } catch (N) {
                C.unshift("embedded")
            } else(/\bBlackBerry\b/.test(G) || /\bBB10\b/.test(w)) && (v = (RegExp(G.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(w) || 0)[1] || A) ? (v = [v, /BB10/.test(w)], z = (v[1] ? (G = null, L = "BlackBerry") : "Device Software") + " " + v[0], A = null) : this != g && "Wii" != G && (U && T || /Opera/.test(y) && /\b(?:MSIE|Firefox)\b/i.test(w) || "Firefox" == y && /\bOS X (?:\d+\.){2,}/.test(z) || "IE" == y && (z && !/^Win/.test(z) && 5.5 < A ||
                /\bWindows XP\b/.test(z) && 8 < A || 8 == A && !/\bTrident\b/.test(w))) && !t.test(v = l.call(g, w.replace(t, "") + ";")) && v.name && (v = "ing as " + v.name + ((v = v.version) ? " " + v : ""), t.test(y) ? (/\bIE\b/.test(v) && "Mac OS" == z && (z = null), v = "identify" + v) : (v = "mask" + v, y = V ? d(V.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera", /\bIE\b/.test(v) && (z = null), U || (A = null)), H = ["Presto"], C.push(v));
            else y += " Mobile";
        if (v = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(w) || 0)[1]) {
            v = [parseFloat(v.replace(/\.(\d)$/, ".0$1")), v];
            if ("Safari" == y && "+" == v[1].slice(-1)) y =
                "WebKit Nightly", X = "alpha", A = v[1].slice(0, -1);
            else if (A == v[1] || A == (v[2] = (/\bSafari\/([\d.]+\+?)/i.exec(w) || 0)[1])) A = null;
            v[1] = (/\b(?:Headless)?Chrome\/([\d.]+)/i.exec(w) || 0)[1];
            537.36 == v[0] && 537.36 == v[2] && 28 <= parseFloat(v[1]) && "WebKit" == H && (H = ["Blink"]);
            U && (M || v[1]) ? (H && (H[1] = "like Chrome"), v = v[1] || (v = v[0], 530 > v ? 1 : 532 > v ? 2 : 532.05 > v ? 3 : 533 > v ? 4 : 534.03 > v ? 5 : 534.07 > v ? 6 : 534.1 > v ? 7 : 534.13 > v ? 8 : 534.16 > v ? 9 : 534.24 > v ? 10 : 534.3 > v ? 11 : 535.01 > v ? 12 : 535.02 > v ? "13+" : 535.07 > v ? 15 : 535.11 > v ? 16 : 535.19 > v ? 17 : 536.05 > v ? 18 : 536.1 >
                v ? 19 : 537.01 > v ? 20 : 537.11 > v ? "21+" : 537.13 > v ? 23 : 537.18 > v ? 24 : 537.24 > v ? 25 : 537.36 > v ? 26 : "Blink" != H ? "27" : "28")) : (H && (H[1] = "like Safari"), v = (v = v[0], 400 > v ? 1 : 500 > v ? 2 : 526 > v ? 3 : 533 > v ? 4 : 534 > v ? "4+" : 535 > v ? 5 : 537 > v ? 6 : 538 > v ? 7 : 601 > v ? 8 : 602 > v ? 9 : 604 > v ? 10 : 606 > v ? 11 : 608 > v ? 12 : "12"));
            H && (H[1] += " " + (v += "number" == typeof v ? ".x" : /[.+]/.test(v) ? "" : "+"));
            "Safari" == y && (!A || 45 < parseInt(A)) ? A = v : "Chrome" == y && /\bHeadlessChrome/i.test(w) && C.unshift("headless")
        }
        "Opera" == y && (v = /\bzbov|zvav$/.exec(z)) ? (y += " ", C.unshift("desktop mode"), "zvav" ==
            v ? (y += "Mini", A = null) : y += "Mobile", z = z.replace(RegExp(" *" + v + "$"), "")) : "Safari" == y && /\bChrome\b/.exec(H && H[1]) ? (C.unshift("desktop mode"), y = "Chrome Mobile", A = null, /\bOS X\b/.test(z) ? (L = "Apple", z = "iOS 4.3+") : z = null) : /\bSRWare Iron\b/.test(y) && !A && (A = F("Chrome"));
        A && 0 == A.indexOf(v = /[\d.]+$/.exec(z)) && -1 < w.indexOf("/" + v + "-") && (z = k(z.replace(v, "")));
        z && -1 != z.indexOf(y) && !RegExp(y + " OS").test(z) && (z = z.replace(RegExp(" *" + c(y) + " *"), ""));
        H && !/\b(?:Avant|Nook)\b/.test(y) && (/Browser|Lunascape|Maxthon/.test(y) ||
            "Safari" != y && /^iOS/.test(z) && /\bSafari\b/.test(H[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|SRWare Iron|Vivaldi|Web)/.test(y) && H[1]) && (v = H[H.length - 1]) && C.push(v);
        C.length && (C = ["(" + C.join("; ") + ")"]);
        L && G && 0 > G.indexOf(L) && C.push("on " + L);
        G && C.push((/^on /.test(C[C.length - 1]) ? "" : "on ") + G);
        if (z) {
            var ba = (v = / ([\d.+]+)$/.exec(z)) && "/" == z.charAt(z.length - v[0].length - 1);
            z = {
                architecture: 32,
                family: v && !ba ? z.replace(v[0], "") : z,
                version: v ? v[1] : null,
                toString: function() {
                    var N =
                        this.version;
                    return this.family + (N && !ba ? " " + N : "") + (64 == this.architecture ? " 64-bit" : "")
                }
            }
        }(v = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(W)) && !/\bi686\b/i.test(W) ? (z && (z.architecture = 64, z.family = z.family.replace(RegExp(" *" + v), "")), y && (/\bWOW64\b/i.test(w) || U && /\w(?:86|32)$/.test(K.cpuClass || K.platform) && !/\bWin64; x64\b/i.test(w)) && C.unshift("32-bit")) : z && /^OS X/.test(z.family) && "Chrome" == y && 39 <= parseFloat(A) && (z.architecture = 64);
        w || (w = null);
        B = {};
        B.description = w;
        B.layout = H && H[0];
        B.manufacturer = L;
        B.name =
            y;
        B.prerelease = X;
        B.product = G;
        B.ua = w;
        B.version = y && A;
        B.os = z || {
            architecture: null,
            family: null,
            version: null,
            toString: function() {
                return "null"
            }
        };
        B.parse = l;
        B.toString = function() {
            return this.description || ""
        };
        B.version && C.unshift(A);
        B.name && C.unshift(y);
        z && y && (z != String(z).split(" ")[0] || z != y.split(" ")[0] && !G) && C.push(G ? "(" + z + ")" : "on " + z);
        C.length && (B.description = C.join(" "));
        return B
    }
    var m = {
            "function": !0,
            object: !0
        },
        n = m[typeof window] && window || this,
        p = m[typeof exports] && exports;
    m = m[typeof module] && module &&
        !module.nodeType && module;
    var q = p && m && "object" == typeof global && global;
    !q || q.global !== q && q.window !== q && q.self !== q || (n = q);
    var u = Math.pow(2, 53) - 1,
        t = /\bOpera/;
    q = Object.prototype;
    var r = q.hasOwnProperty,
        x = q.toString,
        D = l();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (n.platform = D, define(function() {
        return D
    })) : p && m ? g(D, function(w, E) {
        p[E] = w
    }) : n.platform = D
}).call(this);

function buildIOSMeta() {
    for (var f = [{
            name: "viewport",
            content: "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        }, {
            name: "apple-mobile-web-app-capable",
            content: "yes"
        }, {
            name: "apple-mobile-web-app-status-bar-style",
            content: "black"
        }], h = 0; h < f.length; h++) {
        var d = document.createElement("meta");
        d.name = f[h].name;
        d.content = f[h].content;
        var g = window.document.head.querySelector('meta[name="' + d.name + '"]');
        g && g.parentNode.removeChild(g);
        window.document.head.appendChild(d)
    }
}

function hideIOSFullscreenPanel() {
    jQuery(".xxx-ios-fullscreen-message").css("display", "none");
    jQuery(".xxx-ios-fullscreen-scroll").css("display", "none");
    jQuery(".xxx-game-iframe-full").removeClass("xxx-game-iframe-iphone-se")
}

function buildIOSFullscreenPanel() {
    jQuery("body").append('<div class="xxx-ios-fullscreen-message"><div class="xxx-ios-fullscreen-swipe"></div></div><div class="xxx-ios-fullscreen-scroll"></div>')
}

function showIOSFullscreenPanel() {
    jQuery(".xxx-ios-fullscreen-message").css("display", "block");
    jQuery(".xxx-ios-fullscreen-scroll").css("display", "block")
}

function __iosResize() {
    window.scrollTo(0, 0);
    console.log(window.devicePixelRatio);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    if ("iPhone" === platform.product) switch (window.devicePixelRatio) {
        case 2:
            switch (window.innerWidth) {
                case 568:
                    320 !== window.innerHeight && jQuery(".xxx-game-iframe-full").addClass("xxx-game-iframe-iphone-se");
                    break;
                case 667:
                    375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 808:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                default:
                    hideIOSFullscreenPanel()
            }
            break;
        case 3:
            switch (window.innerWidth) {
                case 736:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 724:
                    375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 808:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                default:
                    hideIOSFullscreenPanel()
            }
            break;
        default:
            hideIOSFullscreenPanel()
    }
}

function iosResize() {
    __iosResize();
    setTimeout(function() {
        __iosResize()
    }, 500)
}

function iosInIframe() {
    try {
        return window.self !== window.top
    } catch (f) {
        return !0
    }
}
$(document).ready(function() {
    platform && "iPhone" === platform.product && "safari" !== platform.name.toLowerCase() && !iosInIframe() && (buildIOSFullscreenPanel(), buildIOSMeta())
});
jQuery(window).resize(function() {
    platform && "iPhone" === platform.product && "safari" !== platform.name.toLowerCase() && !iosInIframe() && iosResize()
});
! function(f) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = f();
    else if ("function" == typeof define && define.amd) define([], f);
    else {
        var h;
        "undefined" != typeof window ? h = window : "undefined" != typeof global ? h = global : "undefined" != typeof self && (h = self);
        h.TreeModel = f()
    }
}(function() {
    return function b(h, d, g) {
        function a(k, l) {
            if (!d[k]) {
                if (!h[k]) {
                    var m = "function" == typeof require && require;
                    if (!l && m) return m(k, !0);
                    if (c) return c(k, !0);
                    m = Error("Cannot find module '" + k + "'");
                    throw m.code = "MODULE_NOT_FOUND",
                        m;
                }
                m = d[k] = {
                    exports: {}
                };
                h[k][0].call(m.exports, function(n) {
                    var p = h[k][1][n];
                    return a(p ? p : n)
                }, m, m.exports, b, h, d, g)
            }
            return d[k].exports
        }
        for (var c = "function" == typeof require && require, e = 0; e < g.length; e++) a(g[e]);
        return a
    }({
        1: [function(h, d, g) {
            var b = h("mergesort");
            var a = h("find-insert-index");
            d.exports = function() {
                function c(n) {
                    this.config = n = n || {};
                    this.config.childrenPropertyName = n.childrenPropertyName || "children";
                    this.config.modelComparatorFn = n.modelComparatorFn
                }

                function e(n, p) {
                    this.config = n;
                    this.model = p;
                    this.children = []
                }

                function k(n, p, q) {
                    if (!(p instanceof e)) throw new TypeError("Child must be of type Node.");
                    p.parent = n;
                    n.model[n.config.childrenPropertyName] instanceof Array || (n.model[n.config.childrenPropertyName] = []);
                    if ("function" === typeof n.config.modelComparatorFn) {
                        var u = a(n.config.modelComparatorFn, n.model[n.config.childrenPropertyName], p.model);
                        n.model[n.config.childrenPropertyName].splice(u, 0, p.model);
                        n.children.splice(u, 0, p)
                    } else if (void 0 === q) n.model[n.config.childrenPropertyName].push(p.model),
                        n.children.push(p);
                    else {
                        if (0 > q || q > n.children.length) throw Error("Invalid index.");
                        n.model[n.config.childrenPropertyName].splice(q, 0, p.model);
                        n.children.splice(u, 0, p)
                    }
                    return p
                }

                function l() {
                    var n = {};
                    1 === arguments.length ? n.fn = arguments[0] : 2 === arguments.length ? "function" === typeof arguments[0] ? (n.fn = arguments[0], n.ctx = arguments[1]) : (n.options = arguments[0], n.fn = arguments[1]) : (n.options = arguments[0], n.fn = arguments[1], n.ctx = arguments[2]);
                    n.options = n.options || {};
                    n.options.strategy || (n.options.strategy = "pre");
                    if (!m[n.options.strategy]) throw Error("Unknown tree walk strategy. Valid strategies are 'pre' [default], 'post' and 'breadth'.");
                    return n
                }
                var m = {};
                c.prototype.parse = function(n) {
                    var p;
                    if (!(n instanceof Object)) throw new TypeError("Model must be of type object.");
                    var q = new e(this.config, n);
                    if (n[this.config.childrenPropertyName] instanceof Array) {
                        this.config.modelComparatorFn && (n[this.config.childrenPropertyName] = b(this.config.modelComparatorFn, n[this.config.childrenPropertyName]));
                        var u = 0;
                        for (p = n[this.config.childrenPropertyName].length; u <
                            p; u++) {
                            var t = q,
                                r = this.parse(n[this.config.childrenPropertyName][u]);
                            r.parent = t;
                            t.children.push(r)
                        }
                    }
                    return q
                };
                e.prototype.isRoot = function() {
                    return void 0 === this.parent
                };
                e.prototype.hasChildren = function() {
                    return 0 < this.children.length
                };
                e.prototype.addChild = function(n) {
                    return k(this, n)
                };
                e.prototype.addChildAtIndex = function(n, p) {
                    if ("function" === typeof this.config.modelComparatorFn) throw Error("Cannot add child at index when using a comparator function.");
                    return k(this, n, p)
                };
                e.prototype.getPath = function() {
                    var n = [];
                    (function u(q) {
                        n.unshift(q);
                        q.isRoot() || u(q.parent)
                    })(this);
                    return n
                };
                e.prototype.walk = function() {
                    var n = l.apply(this, arguments);
                    m[n.options.strategy].call(this, n.fn, n.ctx)
                };
                m.pre = function u(p, q) {
                    var t;
                    var r = p.call(q, this);
                    var x = 0;
                    for (t = this.children.length; x < t; x++) {
                        if (!1 === r) return !1;
                        r = u.call(this.children[x], p, q)
                    }
                    return r
                };
                m.post = function t(q, u) {
                    var r;
                    var x = 0;
                    for (r = this.children.length; x < r; x++) {
                        var D = t.call(this.children[x], q, u);
                        if (!1 === D) return !1
                    }
                    return D = q.call(u, this)
                };
                m.breadth = function(q,
                    u) {
                    var t = [this];
                    (function x() {
                        var D;
                        if (0 !== t.length) {
                            var w = t.shift();
                            var E = 0;
                            for (D = w.children.length; E < D; E++) t.push(w.children[E]);
                            !1 !== q.call(u, w) && x()
                        }
                    })()
                };
                e.prototype.all = function() {
                    var q = [];
                    var u = l.apply(this, arguments);
                    m[u.options.strategy].call(this, function(t) {
                        u.fn.call(u.ctx, t) && q.push(t)
                    }, u.ctx);
                    return q
                };
                e.prototype.first = function() {
                    var q;
                    var u = l.apply(this, arguments);
                    m[u.options.strategy].call(this, function(t) {
                        if (u.fn.call(u.ctx, t)) return q = t, !1
                    }, u.ctx);
                    return q
                };
                e.prototype.drop = function() {
                    if (!this.isRoot()) {
                        var q =
                            this.parent.children.indexOf(this);
                        this.parent.children.splice(q, 1);
                        this.parent.model[this.config.childrenPropertyName].splice(q, 1);
                        this.parent = void 0;
                        delete this.parent
                    }
                    return this
                };
                return c
            }()
        }, {
            "find-insert-index": 2,
            mergesort: 3
        }],
        2: [function(h, d, g) {
            d.exports = function() {
                return function(b, a, c) {
                    var e;
                    var k = 0;
                    for (e = a.length; k < e && !(0 < b(a[k], c)); k++);
                    return k
                }
            }()
        }, {}],
        3: [function(h, d, g) {
            d.exports = function() {
                function b(a, c) {
                    var e = c.length;
                    if (2 <= e) {
                        var k = c.slice(0, e / 2);
                        e = c.slice(e / 2, e);
                        k = b(a, k);
                        e = b(a,
                            e);
                        for (var l = [], m = k.length, n = e.length; 0 < m && 0 < n;) 0 >= a(k[0], e[0]) ? (l.push(k.shift()), m--) : (l.push(e.shift()), n--);
                        0 < m ? l.push.apply(l, k) : l.push.apply(l, e);
                        return l
                    }
                    return c.slice()
                }
                return b
            }()
        }, {}]
    }, {}, [1])(1)
});
var CCTLMultiplayerGui = function() {
    this._cssClassDomain = "ctl-multiplayer-";
    this._idCurDialog;
    this._idLoadingDialog;
    var f = localStorage.getItem("nickname");
    this._szNickName = null === f || void 0 === f ? "" : f;
    jQuery(document).on("click", "." + this._cssClassDomain + "room-list li", function() {
        var h = jQuery(this).attr("data-private");
        if ("false" !== jQuery(this).attr("data-accessible")) {
            g_oCTLMultiplayer.closeCurrentDialog();
            var d = jQuery(this).text();
            "true" === h ? g_oCTLMultiplayer.showTypeRoomPassword(d) : (g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING),
                on_ctl_multiplayer_join_room(d))
        }
    })
};
CCTLMultiplayerGui.prototype.refreshRoomList = function(f) {
    for (var h = "", d = 0; d < f.length; d++) h += '<li data-private="' + f[d]["private"] + '" data-accessible="' + f[d].accessible + '" data-specialmode="' + f[d].specialmode + '">', h += '<span class="' + this._cssClassDomain + 'room-name">', h += f[d].name, h += "</span>", h = !0 === f[d]["private"] ? h + ('<i class="' + this._cssClassDomain + 'icons-lock"></i>') : !1 === f[d].accessible ? h + ('<i class="' + this._cssClassDomain + 'icons-block"></i>') : h + ('<i class="' + this._cssClassDomain + 'icons-login"></i>'),
        h += "</li>";
    jQuery("." + this._cssClassDomain + "room-list").html(h)
};
CCTLMultiplayerGui.prototype.showRoomList = function(f) {
    var h = '<ul class="' + this._cssClassDomain + 'room-list">';
    h = h + '</ul><button onclick="on_ctl_multiplayer_refresh_room_list()" type="button" class="' + (this._cssClassDomain + "update " + this._cssClassDomain + 'btn-gray">');
    h += '<i class="' + this._cssClassDomain + 'icons-arrows-cw"></i>';
    h += "<span>" + TEXT_SYS_UPDATE + "</span>";
    this._idCurDialog = this.showDialog(TEXT_SYS_MATCH_LIST, h + "</button>", [{
            txt: TEXT_SYS_QUICKMATCH,
            cb: "on_ctl_multiplayer_join_quick_match",
            classes: ""
        },
        {
            txt: TEXT_SYS_CREATEMATCH,
            cb: "on_ctl_multiplayer_show_create_match",
            classes: ""
        }, {
            txt: TEXT_SYS_BACK,
            cb: "g_oCTLMultiplayer.closeCurrentDialog",
            classes: ""
        }
    ]);
    this.refreshRoomList(f)
};
CCTLMultiplayerGui.prototype.showTypeRoomPassword = function(f) {
    var h = '<div class="' + this._cssClassDomain + 'form-group">';
    h += "<label>" + TEXT_SYS_TYPEROOMPASS + "</label>";
    this._idCurDialog = this.showDialog(TEXT_SYS_TYPEROOMPASS, h + ('<input type="password" name="password" data-room-name="' + f + '"></div>'), [{
        txt: TEXT_SYS_OK,
        cb: "on_ctl_multiplayer_send_password",
        classes: ""
    }, {
        txt: TEXT_SYS_BACK,
        cb: "on_ctl_multiplayer_close_type_room_password",
        classes: ""
    }])
};
CCTLMultiplayerGui.prototype.showCreateRoom = function() {
    var f = '<div class="' + this._cssClassDomain + 'form-group">';
    f += "<label>" + TEXT_SYS_NAMEROOM + "</label>";
    f += '<input type="text" name="roomname" value="' + this._szNickName + "'s room\">";
    f = f + '</div><div class="' + (this._cssClassDomain + 'form-group">');
    f += "<label>" + TEXT_SYS_PASSWORD + "</label>";
    f = f + '<input type="password" name="password"><p>' + (TEXT_SYS_INFOPASS + "</p>");
    this._idCurDialog = this.showDialog(TEXT_SYS_CREATEROOM, f + "</div>", [{
        txt: TEXT_SYS_CREATE,
        cb: "on_ctl_multiplayer_create_room",
        classes: ""
    }, {
        txt: TEXT_SYS_BACK,
        cb: "on_ctl_multiplayer_close_create_room",
        classes: ""
    }])
};
CCTLMultiplayerGui.prototype.showChooseNickName = function() {
    this._idCurDialog = this.showDialog(TEXT_SYS_CHOOSENICK, '<input type="text" name="nickname" maxlength="20" value="' + this._szNickName + '">', [{
        txt: TEXT_SYS_OK,
        cb: "on_ctl_multiplayer_send_nickname",
        classes: ""
    }, {
        txt: TEXT_SYS_CLOSE,
        cb: "g_oCTLMultiplayer.closeCurrentDialog",
        classes: ""
    }])
};
CCTLMultiplayerGui.prototype.showGeneralDialog = function(f, h) {
    this._idCurDialog = this.showDialog(f, "", [{
        txt: TEXT_SYS_BACK,
        cb: h,
        classes: ""
    }])
};
CCTLMultiplayerGui.prototype.closeLoadingDialog = function() {
    this.closeDlg(this._idLoadingDialog)
};
CCTLMultiplayerGui.prototype.closeCurrentDialog = function() {
    this.closeDlg(this._idCurDialog)
};
CCTLMultiplayerGui.prototype.makeCode = function() {
    for (var f = "", h = 0; 32 > h; h++) f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
    return f
};
CCTLMultiplayerGui.prototype.showDialog = function(f, h, d, g) {
    var b = "";
    g || (g = this.makeCode());
    b += "<div id='" + g + "' class='" + this._cssClassDomain + "dlg-wrapper'>";
    b += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
    b += "<div class='" + this._cssClassDomain + "dlg-content'>";
    b += "<div class='" + this._cssClassDomain + "dlg-header'>";
    b = b + ("<h1>" + f + "</h1></div><div class='") + (this._cssClassDomain + "dlg-content-body'>");
    b += h;
    b += "</div>";
    if (d && 0 < d.length) {
        b += "<div class='" + this._cssClassDomain + "dlg-footer'>";
        for (f =
            0; f < d.length; f++) b += "<button type='button' onclick='" + d[f].cb + '("' + g + "\");' class='" + this._cssClassDomain + "-mini " + d[f].classes + "'>" + d[f].txt + "</button>";
        b += this.buildExtraFooter();
        b += "</div>"
    }
    b += "</div>";
    b += "</div>";
    jQuery("body").append(b);
    return g
};
CCTLMultiplayerGui.prototype.buildExtraFooter = function() {
    return '<div class="' + this._cssClassDomain + 'copyright"><a>www.codethislab.com</a></div>'
};
CCTLMultiplayerGui.prototype.showLoading = function(f, h) {
    var d = "";
    this._idLoadingDialog = this.makeCode();
    f || (f = TEXT_SYS_LOADING);
    d += "<div id='" + this._idLoadingDialog + "' class='" + this._cssClassDomain + "dlg-wrapper " + this._cssClassDomain + "fixed'>";
    d += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
    d += "<div class='" + this._cssClassDomain + "dlg-content'>";
    d += "<div class='" + this._cssClassDomain + "dlg-header'>";
    d = d + ("<h1>" + f + "</h1></div><div class='") + (this._cssClassDomain + "dlg-content-body " + this._cssClassDomain +
        "align-center'>");
    d += '<i class="' + this._cssClassDomain + 'icons-spin5 animate-spin"></i>';
    d += "</div>";
    h && (d += "<div class='" + this._cssClassDomain + "dlg-footer " + this._cssClassDomain + "center'>", d += "<button type='button' onclick='" + h + '("' + this._idLoadingDialog + "\");' class='" + this._cssClassDomain + "-mini '>" + TEXT_SYS_BACK + "</button>", d += this.buildExtraFooter(), d += "</div>");
    d += "</div>";
    d += "</div>";
    jQuery("body").append(d)
};
CCTLMultiplayerGui.prototype.closeDlg = function(f) {
    jQuery("#" + f).remove()
};
CCTLMultiplayerGui.prototype.closeAllDialog = function() {
    g_oCTLMultiplayer.closeLoadingDialog();
    g_oCTLMultiplayer.closeCurrentDialog()
};
CCTLMultiplayerGui.prototype.setNickName = function(f) {
    this._szNickName = null === f || void 0 === f ? "" : f;
    localStorage.setItem("nickname", this._szNickName)
};
CCTLMultiplayerGui.prototype.getNickname = function() {
    return this._szNickName
};
var g_oCTLMultiplayer = new CCTLMultiplayerGui,
    s_iScaleFactor = 1,
    s_bIsIphone = !1,
    s_iOffsetX, s_iOffsetY, s_bFocus = !0;
(function(f) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(f) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(f.substr(0,
        4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
    sizeHandler()
});

function trace(f) {
    console.log(f)
}

function getSize(f) {
    var h = f.toLowerCase(),
        d = window.document,
        g = d.documentElement;
    if (void 0 === window["inner" + f]) f = g["client" + f];
    else if (window["inner" + f] != g["client" + f]) {
        var b = d.createElement("body");
        b.id = "vpw-test-b";
        b.style.cssText = "overflow:scroll";
        var a = d.createElement("div");
        a.id = "vpw-test-d";
        a.style.cssText = "position:absolute;top:-1000px";
        a.innerHTML = "<style>@media(" + h + ":" + g["client" + f] + "px){body#vpw-test-b div#vpw-test-d{" + h + ":7px!important}}</style>";
        b.appendChild(a);
        g.insertBefore(b, d.head);
        f = 7 == a["offset" + f] ? g["client" + f] : window["inner" + f];
        g.removeChild(b)
    } else f = window["inner" + f];
    return f
}
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}

function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
}

function isIpad() {
    var f = -1 !== navigator.userAgent.toLowerCase().indexOf("ipad");
    return !f && navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && 2 < navigator.maxTouchPoints ? !0 : f
}

function isMobile() {
    return isIpad() ? !0 : jQuery.browser.mobile
}

function isIOS() {
    for (var f = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";"); f.length;)
        if (navigator.platform === f.pop()) return s_bIsIphone = !0;
    return s_bIsIphone = !1
}

function getIOSWindowHeight() {
    return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}

function getHeightOfIOSToolbars() {
    var f = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
    return 1 < f ? f : 0
}

function playSound(f, h, d) {
    return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[f].play(), s_aSounds[f].volume(h), s_aSounds[f].loop(d), s_aSounds[f]) : null
}

function stopSound(f) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].stop()
}

function setVolume(f, h) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].volume(h)
}

function setMute(f, h) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].mute(h)
}

function sizeHandler() {
    window.scrollTo(0, 1);
    if ($("#canvas")) {
        var f = null !== platform.name && "safari" === platform.name.toLowerCase() ? getIOSWindowHeight() : getSize("Height");
        var h = getSize("Width");
        s_bFocus && _checkOrientation(h, f);
        var d = Math.min(f / CANVAS_HEIGHT, h / CANVAS_WIDTH),
            g = Math.round(CANVAS_WIDTH * d);
        d = Math.round(CANVAS_HEIGHT * d);
        if (d < f) {
            var b = f - d;
            d += b;
            g += CANVAS_WIDTH / CANVAS_HEIGHT * b
        } else g < h && (b = h - g, g += b, d += CANVAS_HEIGHT / CANVAS_WIDTH * b);
        b = f / 2 - d / 2;
        var a = h / 2 - g / 2,
            c = CANVAS_WIDTH / g;
        if (a * c < -EDGEBOARD_X ||
            b * c < -EDGEBOARD_Y) d = Math.min(f / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y), h / (CANVAS_WIDTH - 2 * EDGEBOARD_X)), g = Math.round(CANVAS_WIDTH * d), d = Math.round(CANVAS_HEIGHT * d), b = (f - d) / 2, a = (h - g) / 2, c = CANVAS_WIDTH / g;
        s_iOffsetX = -1 * a * c;
        s_iOffsetY = -1 * b * c;
        0 <= b && (s_iOffsetY = 0);
        0 <= a && (s_iOffsetX = 0);
        null !== s_oInterface && s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        null !== s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        null !== s_oModeMenu && s_oModeMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        $("#canvas").css("width",
            g + "px");
        $("#canvas").css("height", d + "px");
        0 > b || (b = (f - d) / 2);
        $("#canvas").css("top", b + "px");
        $("#canvas").css("left", a + "px");
        fullscreenHandler()
    }
}

function _checkOrientation(f, h) {
    s_bMobile && ENABLE_CHECK_ORIENTATION && (f > h ? "landscape" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"), s_oMain.stopUpdate()) : "portrait" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
        s_oMain.stopUpdate()))
}

function zoomInCamera(f, h, d, g, b) {
    if (null !== f.getBounds() && void 0 !== f.getBounds()) return h /= g, d /= b, d = h <= d ? h : d, f.scaleX = f.scaleY = d
}

function inRectResize(f, h, d) {
    if (null !== f.getBounds() && void 0 !== f.getBounds()) {
        var g = f.getBounds().width;
        h /= g;
        g = f.getBounds().height;
        d = Math.min(h, d / g);
        return f.scaleX = f.scaleY = d
    }
}

function createBitmap(f, h, d) {
    var g = new createjs.Bitmap(f),
        b = new createjs.Shape;
    h && d ? b.graphics.beginFill("#fff").drawRect(0, 0, h, d) : b.graphics.beginFill("#ff0").drawRect(0, 0, f.width, f.height);
    g.hitArea = b;
    return g
}

function createSprite(f, h, d, g, b, a) {
    f = null !== h ? new createjs.Sprite(f, h) : new createjs.Sprite(f);
    h = new createjs.Shape;
    h.graphics.beginFill("#000000").drawRect(-d, -g, b, a);
    f.hitArea = h;
    return f
}

function pad(f, h, d) {
    f += "";
    return f.length >= h ? f : Array(h - f.length + 1).join(d || "0") + f
}

function randomFloatBetween(f, h, d) {
    "undefined" === typeof d && (d = 2);
    return parseFloat(Math.min(f + Math.random() * (h - f), h).toFixed(d))
}

function rotateVector2D(f, h) {
    var d = h.getX() * Math.cos(f) + h.getY() * Math.sin(f),
        g = h.getX() * -Math.sin(f) + h.getY() * Math.cos(f);
    h.set(d, g)
}

function tweenVectorsOnX(f, h, d) {
    return f + d * (h - f)
}

function shuffle(f) {
    for (var h = f.length, d, g; 0 !== h;) g = Math.floor(Math.random() * h), --h, d = f[h], f[h] = f[g], f[g] = d;
    return f
}

function bubbleSort(f) {
    do {
        var h = !1;
        for (var d = 0; d < f.length - 1; d++) f[d] > f[d + 1] && (h = f[d], f[d] = f[d + 1], f[d + 1] = h, h = !0)
    } while (h)
}

function compare(f, h) {
    return f.index > h.index ? -1 : f.index < h.index ? 1 : 0
}

function easeLinear(f, h, d, g) {
    return d * f / g + h
}

function easeInQuad(f, h, d, g) {
    return d * (f /= g) * f + h
}

function easeInSine(f, h, d, g) {
    return -d * Math.cos(f / g * (Math.PI / 2)) + d + h
}

function easeInCubic(f, h, d, g) {
    return d * (f /= g) * f * f + h
}

function getTrajectoryPoint(f, h) {
    var d = new createjs.Point,
        g = (1 - f) * (1 - f),
        b = f * f;
    d.x = g * h.start.x + 2 * (1 - f) * f * h.traj.x + b * h.end.x;
    d.y = g * h.start.y + 2 * (1 - f) * f * h.traj.y + b * h.end.y;
    return d
}

function formatTime(f) {
    f /= 1E3;
    var h = Math.floor(f / 60);
    f = Math.floor(f - 60 * h);
    var d = "";
    d = 10 > h ? d + ("0" + h + ":") : d + (h + ":");
    return 10 > f ? d + ("0" + f) : d + f
}

function degreesToRadians(f) {
    return f * Math.PI / 180
}

function checkRectCollision(f, h) {
    var d = getBounds(f, .9);
    var g = getBounds(h, .98);
    return calculateIntersection(d, g)
}

function calculateIntersection(f, h) {
    var d, g, b, a;
    var c = f.x + (d = f.width / 2);
    var e = f.y + (g = f.height / 2);
    var k = h.x + (b = h.width / 2);
    var l = h.y + (a = h.height / 2);
    c = Math.abs(c - k) - (d + b);
    e = Math.abs(e - l) - (g + a);
    return 0 > c && 0 > e ? (c = Math.min(Math.min(f.width, h.width), -c), e = Math.min(Math.min(f.height, h.height), -e), {
        x: Math.max(f.x, h.x),
        y: Math.max(f.y, h.y),
        width: c,
        height: e,
        rect1: f,
        rect2: h
    }) : null
}

function getBounds(f, h) {
    var d = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (f instanceof createjs.Container) {
        d.x2 = -Infinity;
        d.y2 = -Infinity;
        var g = f.children,
            b = g.length,
            a;
        for (a = 0; a < b; a++) {
            var c = getBounds(g[a], 1);
            c.x < d.x && (d.x = c.x);
            c.y < d.y && (d.y = c.y);
            c.x + c.width > d.x2 && (d.x2 = c.x + c.width);
            c.y + c.height > d.y2 && (d.y2 = c.y + c.height)
        }
        Infinity == d.x && (d.x = 0);
        Infinity == d.y && (d.y = 0);
        Infinity == d.x2 && (d.x2 = 0);
        Infinity == d.y2 && (d.y2 = 0);
        d.width = d.x2 - d.x;
        d.height = d.y2 - d.y;
        delete d.x2;
        delete d.y2
    } else {
        if (f instanceof createjs.Bitmap) {
            b =
                f.sourceRect || f.image;
            a = b.width * h;
            var e = b.height * h
        } else if (f instanceof createjs.Sprite)
            if (f.spriteSheet._frames && f.spriteSheet._frames[f.currentFrame] && f.spriteSheet._frames[f.currentFrame].image) {
                b = f.spriteSheet.getFrame(f.currentFrame);
                a = b.rect.width;
                e = b.rect.height;
                g = b.regX;
                var k = b.regY
            } else d.x = f.x || 0, d.y = f.y || 0;
        else d.x = f.x || 0, d.y = f.y || 0;
        g = g || 0;
        a = a || 0;
        k = k || 0;
        e = e || 0;
        d.regX = g;
        d.regY = k;
        b = f.localToGlobal(0 - g, 0 - k);
        c = f.localToGlobal(a - g, e - k);
        a = f.localToGlobal(a - g, 0 - k);
        g = f.localToGlobal(0 - g, e - k);
        d.x =
            Math.min(Math.min(Math.min(b.x, c.x), a.x), g.x);
        d.y = Math.min(Math.min(Math.min(b.y, c.y), a.y), g.y);
        d.width = Math.max(Math.max(Math.max(b.x, c.x), a.x), g.x) - d.x;
        d.height = Math.max(Math.max(Math.max(b.y, c.y), a.y), g.y) - d.y
    }
    return d
}

function NoClickDelay(f) {
    this.element = f;
    window.Touch && this.element.addEventListener("touchstart", this, !1)
}

function shuffle(f) {
    for (var h = f.length, d, g; 0 < h;) g = Math.floor(Math.random() * h), h--, d = f[h], f[h] = f[g], f[g] = d;
    return f
}
NoClickDelay.prototype = {
    handleEvent: function(f) {
        switch (f.type) {
            case "touchstart":
                this.onTouchStart(f);
                break;
            case "touchmove":
                this.onTouchMove(f);
                break;
            case "touchend":
                this.onTouchEnd(f)
        }
    },
    onTouchStart: function(f) {
        f.preventDefault();
        this.moved = !1;
        this.element.addEventListener("touchmove", this, !1);
        this.element.addEventListener("touchend", this, !1)
    },
    onTouchMove: function(f) {
        this.moved = !0
    },
    onTouchEnd: function(f) {
        this.element.removeEventListener("touchmove", this, !1);
        this.element.removeEventListener("touchend",
            this, !1);
        if (!this.moved) {
            f = document.elementFromPoint(f.changedTouches[0].clientX, f.changedTouches[0].clientY);
            3 == f.nodeType && (f = f.parentNode);
            var h = document.createEvent("MouseEvents");
            h.initEvent("click", !0, !0);
            f.dispatchEvent(h)
        }
    }
};
(function() {
    function f(d) {
        var g = {
            focus: "visible",
            focusin: "visible",
            pageshow: "visible",
            blur: "hidden",
            focusout: "hidden",
            pagehide: "hidden"
        };
        d = d || window.event;
        d.type in g ? document.body.className = g[d.type] : (document.body.className = this[h] ? "hidden" : "visible", "hidden" === document.body.className ? (s_oMain.stopUpdate(), s_bFocus = !1) : (s_oMain.startUpdate(), s_bFocus = !0))
    }
    var h = "hidden";
    h in document ? document.addEventListener("visibilitychange", f) : (h = "mozHidden") in document ? document.addEventListener("mozvisibilitychange",
        f) : (h = "webkitHidden") in document ? document.addEventListener("webkitvisibilitychange", f) : (h = "msHidden") in document ? document.addEventListener("msvisibilitychange", f) : "onfocusin" in document ? document.onfocusin = document.onfocusout = f : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = f
})();

function compareRow(f, h) {
    return f.row > h.row ? 1 : f.row < h.row ? -1 : 0
}

function compareCol(f, h) {
    return f.col > h.col ? 1 : f.col < h.col ? -1 : 0
}

function ctlArcadeResume() {
    null !== s_oMain && s_oMain.startUpdate()
}

function ctlArcadePause() {
    null !== s_oMain && s_oMain.stopUpdate()
}

function getParamValue(f) {
    for (var h = window.location.search.substring(1).split("&"), d = 0; d < h.length; d++) {
        var g = h[d].split("=");
        if (g[0] == f) return g[1]
    }
}
String.prototype.format = function() {
    for (var f = this, h = arguments.length; h--;) f = f.replace(new RegExp("\\{" + h + "\\}", "gm"), arguments[h]);
    return f
};

function fullscreenHandler() {
    ENABLE_FULLSCREEN && !1 !== screenfull.isEnabled && (s_bFullscreen = screenfull.isFullscreen, null !== s_oInterface && s_oInterface.resetFullscreenBut(), null !== s_oMenu && s_oMenu.resetFullscreenBut(), null !== s_oModeMenu && s_oModeMenu.resetFullscreenBut())
}
if (screenfull.isEnabled) screenfull.on("change", function() {
    s_bFullscreen = screenfull.isFullscreen;
    null !== s_oInterface && s_oInterface.resetFullscreenBut();
    null !== s_oMenu && s_oMenu.resetFullscreenBut();
    null !== s_oModeMenu && s_oModeMenu.resetFullscreenBut()
});
var s_szGameID = "b2a3398e327b4f6da665759d6730aab4";
window.GD_OPTIONS = {
    gameId: s_szGameID,
    onEvent: function(f) {
        switch (f.name) {
            case "SDK_GAME_START":
                s_oMain && s_oMain.startUpdate();
                break;
            case "SDK_GAME_PAUSE":
                s_oMain && s_oMain.stopUpdate()
        }
    }
};
(function(f, h, d) {
    var g = f.getElementsByTagName(h)[0];
    f.getElementById(d) || (f = f.createElement(h), f.id = d, f.src = "", g.parentNode.insertBefore(f, g))
})(document, "script", "gamedistribution-jssdk");

function CSpriteLibrary() {
    var f = {},
        h, d, g, b, a, c;
    this.init = function(e, k, l) {
        h = {};
        g = d = 0;
        b = e;
        a = k;
        c = l
    };
    this.addSprite = function(e, k) {
        if (!f.hasOwnProperty(e)) {
            var l = new Image;
            f[e] = h[e] = {
                szPath: k,
                oSprite: l,
                bLoaded: !1
            };
            d++
        }
    };
    this.getSprite = function(e) {
        return f.hasOwnProperty(e) ? f[e].oSprite : null
    };
    this._onSpritesLoaded = function() {
        d = 0;
        a.call(c)
    };
    this._onSpriteLoaded = function() {
        b.call(c);
        ++g === d && this._onSpritesLoaded()
    };
    this.loadSprites = function() {
        for (var e in h) h[e].oSprite.oSpriteLibrary = this, h[e].oSprite.szKey =
            e, h[e].oSprite.onload = function() {
                this.oSpriteLibrary.setLoaded(this.szKey);
                this.oSpriteLibrary._onSpriteLoaded(this.szKey)
            }, h[e].oSprite.onerror = function(k) {
                var l = k.currentTarget;
                setTimeout(function() {
                    h[l.szKey].oSprite.src = h[l.szKey].szPath
                }, 500)
            }, h[e].oSprite.src = h[e].szPath
    };
    this.setLoaded = function(e) {
        f[e].bLoaded = !0
    };
    this.isLoaded = function(e) {
        return f[e].bLoaded
    };
    this.getNumSprites = function() {
        return d
    }
}

function CTextButton(f, h, d, g, b, a, c, e) {
    var k, l, m, n, p, q, u;
    this._init = function(t, r, x, D, w, E, F, B) {
        k = [];
        l = [];
        var C = createBitmap(x),
            K = Math.ceil(F / 20);
        p = new createjs.Text(D, "bold " + F + "px " + w, "#000000");
        p.textAlign = "center";
        p.textBaseline = "alphabetic";
        var A = p.getBounds();
        p.x = x.width / 2 + K;
        p.y = Math.floor(x.height / 2) + A.height / 3 + K;
        n = new createjs.Text(D, "bold " + F + "px " + w, E);
        n.textAlign = "center";
        n.textBaseline = "alphabetic";
        A = n.getBounds();
        n.x = x.width / 2;
        n.y = Math.floor(x.height / 2) + A.height / 3;
        m = new createjs.Container;
        m.x = t;
        m.y = r;
        m.regX = x.width / 2;
        m.regY = x.height / 2;
        m.addChild(C, p, n);
        B.addChild(m);
        this._initListener()
    };
    this.unload = function() {
        m.off("mousedown", q);
        m.off("pressup", u);
        e.removeChild(m)
    };
    this.setVisible = function(t) {
        m.visible = t
    };
    this._initListener = function() {
        oParent = this;
        q = m.on("mousedown", this.buttonDown);
        u = m.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(t, r, x) {
        k[t] = r;
        l[t] = x
    };
    this.buttonRelease = function() {
        m.scaleX = 1;
        m.scaleY = 1;
        k[ON_MOUSE_UP] && k[ON_MOUSE_UP].call(l[ON_MOUSE_UP])
    };
    this.buttonDown =
        function() {
            m.scaleX = .9;
            m.scaleY = .9;
            k[ON_MOUSE_DOWN] && k[ON_MOUSE_DOWN].call(l[ON_MOUSE_DOWN])
        };
    this.setTextPosition = function(t) {
        n.y = t;
        p.y = t + 2
    };
    this.setPosition = function(t, r) {
        m.x = t;
        m.y = r
    };
    this.setX = function(t) {
        m.x = t
    };
    this.setY = function(t) {
        m.y = t
    };
    this.getButtonImage = function() {
        return m
    };
    this.getX = function() {
        return m.x
    };
    this.getY = function() {
        return m.y
    };
    this._init(f, h, d, g, b, a, c, e);
    return this
}

function CToggle(f, h, d, g, b) {
    var a, c, e, k, l = [],
        m, n, p, q;
    this._init = function(u, t, r, x) {
        c = !1;
        e = [];
        k = [];
        var D = new createjs.SpriteSheet({
            images: [r],
            frames: {
                width: r.width / 2,
                height: r.height,
                regX: r.width / 2 / 2,
                regY: r.height / 2
            },
            animations: {
                state_true: [0],
                state_false: [1]
            }
        });
        a = x;
        m = createSprite(D, "state_" + a, r.width / 2 / 2, r.height / 2, r.width / 2, r.height);
        m.x = u;
        m.y = t;
        m.stop();
        b.addChild(m);
        this._initListener()
    };
    this.unload = function() {
        s_bMobile ? m.off("mousedown", n) : (m.off("mousedown", n), m.off("mouseover", p));
        m.off("pressup",
            q);
        b.removeChild(m)
    };
    this._initListener = function() {
        s_bMobile ? n = m.on("mousedown", this.buttonDown) : (n = m.on("mousedown", this.buttonDown), p = m.on("mouseover", this.buttonOver));
        q = m.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(u, t, r) {
        e[u] = t;
        k[u] = r
    };
    this.addEventListenerWithParams = function(u, t, r, x) {
        e[u] = t;
        k[u] = r;
        l = x
    };
    this.setActive = function(u) {
        a = u;
        m.gotoAndStop("state_" + a)
    };
    this.buttonRelease = function() {
        m.scaleX = 1;
        m.scaleY = 1;
        playSound("click", 1, !1);
        a = !a;
        m.gotoAndStop("state_" + a);
        e[ON_MOUSE_UP] &&
            e[ON_MOUSE_UP].call(k[ON_MOUSE_UP], l)
    };
    this.buttonDown = function() {
        m.scaleX = .9;
        m.scaleY = .9;
        e[ON_MOUSE_DOWN] && e[ON_MOUSE_DOWN].call(k[ON_MOUSE_DOWN], l)
    };
    this.buttonOver = function(u) {
        s_bMobile || c || (u.target.cursor = "pointer")
    };
    this.getButtonImage = function() {
        return m
    };
    this.setPosition = function(u, t) {
        m.x = u;
        m.y = t
    };
    this.setVisible = function(u) {
        m.visible = u
    };
    this._init(f, h, d, g)
}

function CGfxButton(f, h, d, g) {
    var b, a, c, e, k, l, m, n;
    this._init = function(p, q, u, t) {
        b = !1;
        a = 1;
        c = [];
        e = [];
        k = createBitmap(u);
        k.x = p;
        k.y = q;
        k.scaleX = k.scaleY = a;
        k.regX = u.width / 2;
        k.regY = u.height / 2;
        t.addChild(k);
        this._initListener()
    };
    this.unload = function() {
        s_bMobile ? k.off("mousedown", l) : (k.off("mousedown", l), k.off("mouseover", m));
        k.off("pressup", n);
        g.removeChild(k)
    };
    this.setVisible = function(p) {
        k.visible = p
    };
    this.setClickable = function(p) {
        b = !p
    };
    this._initListener = function() {
        s_bMobile ? l = k.on("mousedown", this.buttonDown) :
            (l = k.on("mousedown", this.buttonDown), m = k.on("mouseover", this.buttonOver));
        n = k.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(p, q, u) {
        c[p] = q;
        e[p] = u
    };
    this.buttonRelease = function() {
        b || (k.scaleX = a, k.scaleY = a, c[ON_MOUSE_UP] && c[ON_MOUSE_UP].call(e[ON_MOUSE_UP]))
    };
    this.buttonDown = function() {
        b || (k.scaleX = .9 * a, k.scaleY = .9 * a, playSound("click", 1, !1), c[ON_MOUSE_DOWN] && c[ON_MOUSE_DOWN].call(e[ON_MOUSE_DOWN]))
    };
    this.buttonOver = function(p) {
        s_bMobile || b || (p.target.cursor = "pointer")
    };
    this.pulseAnimation =
        function() {
            createjs.Tween.get(k, {
                loop: !0
            }).to({
                scaleX: .9 * a,
                scaleY: .9 * a
            }, 850, createjs.Ease.quadOut).to({
                scaleX: a,
                scaleY: a
            }, 650, createjs.Ease.quadIn)
        };
    this.trembleAnimation = function() {
        createjs.Tween.get(k, {
            loop: !0
        }).to({
            rotation: 5
        }, 75, createjs.Ease.quadOut).to({
            rotation: -5
        }, 140, createjs.Ease.quadIn).to({
            rotation: 0
        }, 75, createjs.Ease.quadIn).wait(750)
    };
    this.setPosition = function(p, q) {
        k.x = p;
        k.y = q
    };
    this.setX = function(p) {
        k.x = p
    };
    this.setY = function(p) {
        k.y = p
    };
    this.getButtonImage = function() {
        return k
    };
    this.getX =
        function() {
            return k.x
        };
    this.getY = function() {
        return k.y
    };
    this._init(f, h, d, g);
    return this
}
CTLText.prototype = {
    constructor: CTLText,
    __autofit: function() {
        if (this._bFitText) {
            for (var f = this._iFontSize;
                (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(f--, this._oText.font = f + "px " + this._szFont, this._oText.lineHeight = Math.round(f * this._fLineHeightFactor), this.__updateY(), this.__verticalAlign(), 8 > f););
            this._iFontSize = f
        }
    },
    __verticalAlign: function() {
        if (this._bVerticalAlign) {
            var f = this._oText.getBounds().height;
            this._oText.y -=
                (f - this._iHeight) / 2 + this._iPaddingV
        }
    },
    __updateY: function() {
        this._oText.y = this._y + this._iPaddingV;
        switch (this._oText.textBaseline) {
            case "middle":
                this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize)
        }
    },
    __createText: function(f) {
        this._bDebug && (this._oDebugShape = new createjs.Shape, this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(this._x, this._y, this._iWidth, this._iHeight), this._oContainer.addChild(this._oDebugShape));
        this._oText = new createjs.Text(f,
            this._iFontSize + "px " + this._szFont, this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null;
        switch (this._szAlign) {
            case "center":
                this._oText.x = this._x + this._iWidth / 2;
                break;
            case "left":
                this._oText.x = this._x + this._iPaddingH;
                break;
            case "right":
                this._oText.x = this._x + this._iWidth - this._iPaddingH
        }
        this._oContainer.addChild(this._oText);
        this.refreshText(f)
    },
    setVerticalAlign: function(f) {
        this._bVerticalAlign = f
    },
    setOutline: function(f) {
        null !== this._oText && (this._oText.outline = f)
    },
    setShadow: function(f, h, d, g) {
        null !== this._oText && (this._oText.shadow = new createjs.Shadow(f, h, d, g))
    },
    setColor: function(f) {
        this._oText.color = f
    },
    setAlpha: function(f) {
        this._oText.alpha = f
    },
    setY: function(f) {
        this._y = this._oText.y = f
    },
    removeTweens: function() {
        createjs.Tween.removeTweens(this._oText)
    },
    getText: function() {
        return this._oText
    },
    getY: function() {
        return this._y
    },
    getFontSize: function() {
        return this._iFontSize
    },
    refreshText: function(f) {
        "" === f && (f = " ");
        null === this._oText && this.__createText(f);
        this._oText.text = f;
        this._oText.font = this._iFontSize + "px " + this._szFont;
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this.__autofit();
        this.__updateY();
        this.__verticalAlign()
    }
};

function CTLText(f, h, d, g, b, a, c, e, k, l, m, n, p, q, u, t, r) {
    this._oContainer = f;
    this._x = h;
    this._y = d;
    this._iWidth = g;
    this._iHeight = b;
    this._bMultiline = t;
    this._iFontSize = a;
    this._szAlign = c;
    this._szColor = e;
    this._szFont = k;
    this._iPaddingH = m;
    this._iPaddingV = n;
    this._bVerticalAlign = u;
    this._bFitText = q;
    this._bDebug = r;
    this._oDebugShape = null;
    this._fLineHeightFactor = l;
    this._oText = null;
    p && this.__createText(p)
}! function() {
    function f(b) {
        var a = b;
        if (g[a]) a = g[a];
        else {
            for (var c = a, e, k = [], l = 0; c;) {
                if (null !== (e = d.text.exec(c))) k.push(e[0]);
                else if (null !== (e = d.modulo.exec(c))) k.push("%");
                else if (null !== (e = d.placeholder.exec(c))) {
                    if (e[2]) {
                        l |= 1;
                        var m = [],
                            n = e[2],
                            p;
                        if (null !== (p = d.key.exec(n)))
                            for (m.push(p[1]);
                                "" !== (n = n.substring(p[0].length));)
                                if (null !== (p = d.key_access.exec(n))) m.push(p[1]);
                                else if (null !== (p = d.index_access.exec(n))) m.push(p[1]);
                        else throw new SyntaxError("[sprintf] failed to parse named argument key");
                        else throw new SyntaxError("[sprintf] failed to parse named argument key");
                        e[2] = m
                    } else l |= 2;
                    if (3 === l) throw Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                    k.push({
                        placeholder: e[0],
                        param_no: e[1],
                        keys: e[2],
                        sign: e[3],
                        pad_char: e[4],
                        align: e[5],
                        width: e[6],
                        precision: e[7],
                        type: e[8]
                    })
                } else throw new SyntaxError("[sprintf] unexpected placeholder");
                c = c.substring(e[0].length)
            }
            a = g[a] = k
        }
        c = arguments;
        e = 1;
        k = a.length;
        m = "";
        var q, u;
        for (n = 0; n < k; n++)
            if ("string" === typeof a[n]) m += a[n];
            else if ("object" === typeof a[n]) {
            p = a[n];
            if (p.keys)
                for (l = c[e], q = 0; q < p.keys.length; q++) {
                    if (void 0 == l) throw Error(f('[sprintf] Cannot access property "%s" of undefined value "%s"', p.keys[q], p.keys[q - 1]));
                    l = l[p.keys[q]]
                } else l = p.param_no ? c[p.param_no] : c[e++];
            d.not_type.test(p.type) && d.not_primitive.test(p.type) && l instanceof Function && (l = l());
            if (d.numeric_arg.test(p.type) && "number" !== typeof l && isNaN(l)) throw new TypeError(f("[sprintf] expecting number but found %T", l));
            d.number.test(p.type) && (u = 0 <= l);
            switch (p.type) {
                case "b":
                    l = parseInt(l, 10).toString(2);
                    break;
                case "c":
                    l = String.fromCharCode(parseInt(l, 10));
                    break;
                case "d":
                case "i":
                    l = parseInt(l, 10);
                    break;
                case "j":
                    l = JSON.stringify(l, null, p.width ? parseInt(p.width) : 0);
                    break;
                case "e":
                    l = p.precision ? parseFloat(l).toExponential(p.precision) : parseFloat(l).toExponential();
                    break;
                case "f":
                    l = p.precision ? parseFloat(l).toFixed(p.precision) : parseFloat(l);
                    break;
                case "g":
                    l = p.precision ? String(Number(l.toPrecision(p.precision))) : parseFloat(l);
                    break;
                case "o":
                    l = (parseInt(l,
                        10) >>> 0).toString(8);
                    break;
                case "s":
                    l = String(l);
                    l = p.precision ? l.substring(0, p.precision) : l;
                    break;
                case "t":
                    l = String(!!l);
                    l = p.precision ? l.substring(0, p.precision) : l;
                    break;
                case "T":
                    l = Object.prototype.toString.call(l).slice(8, -1).toLowerCase();
                    l = p.precision ? l.substring(0, p.precision) : l;
                    break;
                case "u":
                    l = parseInt(l, 10) >>> 0;
                    break;
                case "v":
                    l = l.valueOf();
                    l = p.precision ? l.substring(0, p.precision) : l;
                    break;
                case "x":
                    l = (parseInt(l, 10) >>> 0).toString(16);
                    break;
                case "X":
                    l = (parseInt(l, 10) >>> 0).toString(16).toUpperCase()
            }
            if (d.json.test(p.type)) m +=
                l;
            else {
                if (!d.number.test(p.type) || u && !p.sign) var t = "";
                else t = u ? "+" : "-", l = l.toString().replace(d.sign, "");
                q = p.pad_char ? "0" === p.pad_char ? "0" : p.pad_char.charAt(1) : " ";
                var r = p.width - (t + l).length;
                r = p.width ? 0 < r ? q.repeat(r) : "" : "";
                m += p.align ? t + l + r : "0" === q ? t + r + l : r + t + l
            }
        }
        return m
    }

    function h(b, a) {
        return f.apply(null, [b].concat(a || []))
    }
    var d = {
            not_string: /[^s]/,
            not_bool: /[^t]/,
            not_type: /[^T]/,
            not_primitive: /[^v]/,
            number: /[diefg]/,
            numeric_arg: /[bcdiefguxX]/,
            json: /[j]/,
            not_json: /[^j]/,
            text: /^[^\x25]+/,
            modulo: /^\x25{2}/,
            placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
            key: /^([a-z_][a-z_\d]*)/i,
            key_access: /^\.([a-z_][a-z_\d]*)/i,
            index_access: /^\[(\d+)\]/,
            sign: /^[+-]/
        },
        g = Object.create(null);
    "undefined" !== typeof exports && (exports.sprintf = f, exports.vsprintf = h);
    "undefined" !== typeof window && (window.sprintf = f, window.vsprintf = h, "function" === typeof define && define.amd && define(function() {
        return {
            sprintf: f,
            vsprintf: h
        }
    }))
}();

function CGUIExpandible(f, h, d, g) {
    var b, a, c, e, k, l, m, n;
    this._init = function(q, u, t, r) {
        e = [];
        l = new createjs.Container;
        l.x = q;
        l.y = u;
        r.addChild(l);
        m = new createjs.Container;
        l.addChild(m);
        n = new createjs.Container;
        l.addChild(n);
        c = !1;
        k = new CGfxButton(0, 0, t, n);
        k.addEventListener(ON_MOUSE_UP, this._onMenu, this);
        a = b = 120
    };
    this.unload = function() {
        k.unload();
        g.removeChild(l)
    };
    this.refreshPos = function(q, u) {
        l.x = f - q;
        l.y = h + u
    };
    this.addButton = function(q) {
        q = q.getButtonImage();
        q.x = 0;
        q.y = 0;
        q.visible = 0;
        m.addChildAt(q, 0);
        e.push(q)
    };
    this._onMenu = function() {
        (c = !c) ? p._expand(): p._collapse()
    };
    this._expand = function() {
        for (var q = 0; q < e.length; q++) e[q].visible = !0, createjs.Tween.get(e[q], {
            override: !0
        }).wait(300 * q / 2).to({
            y: b + q * a
        }, 300, createjs.Ease.cubicOut)
    };
    this._collapse = function() {
        for (var q = 0; q < e.length; q++) {
            var u = e[e.length - 1 - q];
            createjs.Tween.get(u, {
                override: !0
            }).wait(300 * q / 2).to({
                y: 0
            }, 300, createjs.Ease.cubicOut).call(function(t) {
                t.visible = !1
            }, [u])
        }
    };
    var p = this;
    this._init(f, h, d, g)
}
var ON_CONNECTION_ERROR = 0,
    ON_DISCONNECTION = 1,
    ON_LOGIN_SUCCESS = 2,
    ON_MATCHMAKING_CONNECTION_SUCCESS = 3,
    ON_GAMEROOM_CONNECTION_SUCCESS = 4,
    ON_USEROWNERROOM_CREATE_SUCCESS = 5,
    ON_USEROWNERROOM_JOIN_SUCCESS = 6,
    ON_ROOM_INFO_RETURNED = 7,
    ON_BACK_FROM_A_ROOM = 8,
    ERROR_CODE_UNKNOWNROOM = "UnknownRoom",
    ROOM_TYPE_MATCHMAKING = "MatchmakingRoom",
    ROOM_TYPE_USEROWNER = "UserOwnerRoom",
    ROOM_TYPE_GAME = "GameRoom";

function CNetworkManager() {
    var f, h, d, g, b, a, c, e, k, l, m;
    this._init = function() {
        f = [];
        h = [];
        b = new CNetworkMessageForwarder
    };
    this.unload = function() {
        s_oNetworkManager = null
    };
    this.connectToSystem = function() {
        s_oNetworkManager.addEventListener(ON_LOGIN_SUCCESS, s_oNetworkManager.gotoLobby);
        g_oCTLMultiplayer.showChooseNickName()
    };
    this.login = function(n) {
        c = n;
        n = this._setValidNick(n);
        PlayerIO.useSecureApiRequests = !MULTIPLAYER_TEST_LOCAL;
        PlayerIO.authenticate(GAME_PLAYERIO_ID, "public", {
            userId: n
        }, {}, function(p) {
            g = p;
            g.multiplayer.useSecureConnections = !MULTIPLAYER_TEST_LOCAL;
            MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184", g.multiplayer.createJoinRoom("fakeroom" + Math.random(), "fakeroom", !1, null, null, function(q) {
                q.addMessageCallback("*", b.messageHandler);
                q.addDisconnectCallback(s_oNetworkManager.callbackDisconnect)
            }, s_oNetworkManager.callbackError));
            f[ON_LOGIN_SUCCESS] && f[ON_LOGIN_SUCCESS].call(h[ON_LOGIN_SUCCESS])
        }, s_oNetworkManager.callbackError)
    };
    this._setValidNick = function(n) {
        var p = s_oNetworkManager._getRandomCodeNumber();
        "" === n ? c = n = "guest-" + p : n = n + "-" + p;
        return n
    };
    this._getRandomCodeNumber = function() {
        return Math.floor(1E3 * Math.random())
    };
    this.generateRandomName = function() {
        var n = "xmariox alex max mahuro biajus rob idah fabrix seth ikillyou commander admiral general seasalt emperorofthesea Aspect Kraken Dragon Shiver Dracula Doom Scar Roadkill Cobra Psycho Ranger Ripley Clink Bruise Bowser Creep Cannon Daemon Steel Tempest Hurricane Titanium Tito Lightning IronHeart Sabotage Rex Hydra Terminator Agrippa Gash Blade Katana Gladius Angon Claymore Pike Hammer Club Heart Gauntlet Montante Longbow bow Dagger".split(" "),
            p = Math.floor(Math.random() * n.length);
        n = n[p];
        if (.5 < Math.random()) {
            var q = Math.floor(100 * Math.random());
            if (.5 < Math.random()) {
                var u = ["-", "_"];
                p = Math.floor(Math.random() * u.length);
                n += u[p]
            }
            n += q
        }
        return m = n
    };
    this.getBotName = function() {
        return m
    };
    this.addEventListener = function(n, p, q) {
        f[n] = p;
        h[n] = q
    };
    this.callbackError = function(n) {
        f[ON_CONNECTION_ERROR] && f[ON_CONNECTION_ERROR].call(h[ON_CONNECTION_ERROR], n)
    };
    this.callbackDisconnect = function(n) {
        f[ON_DISCONNECTION] && f[ON_DISCONNECTION].call(h[ON_DISCONNECTION],
            n)
    };
    this.sendMsg = function(n, p) {
        d && d.send(n, p)
    };
    this.disconnect = function() {
        d && (d.disconnect(), d = null)
    };
    this.isUserA = function() {
        return 0 === parseInt(a) ? !0 : !1
    };
    this.getPlayerOrderID = function() {
        return a
    };
    this.getPlayerNickname = function() {
        return c
    };
    this.getEnemyNickname = function() {
        return e
    };
    this.createRoom = function(n, p) {
        s_oNetworkManager.addEventListener(ON_USEROWNERROOM_CREATE_SUCCESS, this._onRoomCreated);
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        g.multiplayer.createJoinRoom(n,
            ROOM_TYPE_USEROWNER, !0, {
                id: n,
                pass: p
            }, {
                nickname: c
            },
            function(q) {
                d = q;
                q.addMessageCallback("*", b.messageHandler);
                q.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);
                f[ON_USEROWNERROOM_CREATE_SUCCESS] && f[ON_USEROWNERROOM_CREATE_SUCCESS].call(h[ON_USEROWNERROOM_CREATE_SUCCESS])
            }, s_oNetworkManager.callbackError)
    };
    this.joinRoom = function(n) {
        s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR, this._onRoomJoinedFailed);
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        g.multiplayer.joinRoom(n, {
            nickname: c
        }, function(p) {
            d = p;
            p.addMessageCallback("*", b.messageHandler);
            p.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);
            f[ON_USEROWNERROOM_JOIN_SUCCESS] && f[ON_USEROWNERROOM_JOIN_SUCCESS].call(h[ON_USEROWNERROOM_JOIN_SUCCESS])
        }, s_oNetworkManager.callbackError)
    };
    this.gotoGameRoom = function(n) {
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        var p = n.getString(0);
        a = n.getInt(1);
        e = n.getString(2);
        g.multiplayer.createJoinRoom(p, ROOM_TYPE_GAME, !1, null, null, function(q) {
            d =
                q;
            q.addMessageCallback("*", b.messageHandler);
            q.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);
            g_oCTLMultiplayer.closeAllDialog();
            f[ON_GAMEROOM_CONNECTION_SUCCESS] && f[ON_GAMEROOM_CONNECTION_SUCCESS].call(h[ON_GAMEROOM_CONNECTION_SUCCESS])
        }, s_oNetworkManager.callbackError)
    };
    this.gotoMatchMakingRoom = function() {
        MULTIPLAYER_TEST_LOCAL && (g.multiplayer.developmentServer = "localhost:8184");
        g.multiplayer.createJoinRoom("matchmakingroom1", ROOM_TYPE_MATCHMAKING, !0, null, {
            nickname: c
        }, function(n) {
            d =
                n;
            n.addMessageCallback("*", b.messageHandler);
            n.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);
            f[ON_MATCHMAKING_CONNECTION_SUCCESS] && f[ON_MATCHMAKING_CONNECTION_SUCCESS].call(h[ON_MATCHMAKING_CONNECTION_SUCCESS])
        }, s_oNetworkManager.callbackError)
    };
    this.tryCreateUniqueRoom = function(n, p) {
        k = n;
        l = p;
        g.multiplayer.listRooms(ROOM_TYPE_USEROWNER, {
            id: n
        }, 0, 0, s_oNetworkManager._onUniqueListRoomSearch, s_oNetworkManager.callbackError)
    };
    this._onUniqueListRoomSearch = function(n) {
        0 < n.length && (k += "-" + s_oNetworkManager._getRandomCodeNumber());
        s_oNetworkManager.createRoom(k, l)
    };
    this._onRoomCreated = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_WAITING_FOR_OPPONENT_IN_ROOM + k, "s_oNetworkManager._onDisconnectFromARoom")
    };
    this._onDisconnectFromARoom = function() {
        f[ON_BACK_FROM_A_ROOM] && f[ON_BACK_FROM_A_ROOM].call(h[ON_BACK_FROM_A_ROOM]);
        s_oNetworkManager.disconnect();
        setTimeout(function() {
            s_oNetworkManager.gotoLobby()
        }, 250)
    };
    this._onRoomJoined = function() {};
    this._onRoomJoinedFailed = function(n) {
        s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR,
            function() {});
        switch (n.code) {
            case ERROR_CODE_UNKNOWNROOM:
                g_oCTLMultiplayer.closeAllDialog(), g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_DOESNT_EXIST, "s_oNetworkManager.gotoLobby")
        }
    };
    this.gotoLobby = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_CONNECT_TO_LOBBY);
        g.multiplayer.listRooms(ROOM_TYPE_USEROWNER, null, 0, 0, s_oNetworkManager._onListRoom, s_oNetworkManager.callbackError)
    };
    this._onListRoom = function(n) {
        for (var p = [], q = 0; q < n.length; q++) p[q] = {
            name: n[q].id,
            "private": 0 ===
                n[q].roomData.pass.length ? !1 : !0
        };
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showRoomList(p)
    };
    this.joinQuickMatch = function() {
        g_oCTLMultiplayer.showLoading(TEXT_FIND_OPPONENT, "s_oNetworkManager._onDisconnectFromARoom");
        s_oNetworkManager.gotoMatchMakingRoom()
    };
    this.tryJoinRoomWithPass = function(n, p) {
        k = n;
        l = p;
        s_oNetworkManager.addEventListener(ON_ROOM_INFO_RETURNED, s_oNetworkManager._checkUserPermissionToJoin);
        s_oNetworkManager.getRoomInfo(n, p)
    };
    this._checkUserPermissionToJoin = function(n) {
        0 < n.length ?
            s_oNetworkManager.joinRoom(n[0].roomData.id, n[0].roomData.pass) : (g_oCTLMultiplayer.closeAllDialog(), g_oCTLMultiplayer.showGeneralDialog(TEXT_WRONG_PASSWORD, "s_oNetworkManager._onPasswordFailed"))
    };
    this._onPasswordFailed = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showTypeRoomPassword(k)
    };
    this.getRoomInfo = function(n, p) {
        g.multiplayer.listRooms(ROOM_TYPE_USEROWNER, {
            id: n,
            pass: p
        }, 0, 0, s_oNetworkManager._onRoomInfoReturned, s_oNetworkManager.callbackError)
    };
    this._onRoomInfoReturned = function(n) {
        f[ON_ROOM_INFO_RETURNED] &&
            f[ON_ROOM_INFO_RETURNED].call(h[ON_ROOM_INFO_RETURNED], n)
    };
    this._init()
}
var MSG_ROOM_IS_FULL = "room_is_full",
    MSG_GAME_FOUND = "game_found",
    MSG_SET_WINNER = "set_winner",
    MSG_REMATCH_PANEL = "rematch_panel",
    MSG_REMATCH_ANSWER_RESULTS = "rematch_answer_results",
    MSG_ENEMY_MOVES = "enemy_moves",
    MSG_END_MATCH = "end_match",
    MSG_ACCEPT_REMATCH = "accept_rematch",
    MSG_DISCONNECTION = "disconnection",
    MSG_MOVE = "move";

function CNetworkMessageForwarder() {
    this._init = function() {};
    this.messageHandler = function(h) {
        switch (h.type) {
            case MSG_ROOM_IS_FULL:
                f._onFullRoom(h);
                break;
            case MSG_GAME_FOUND:
                f._onGameFound(h);
                break;
            case MSG_SET_WINNER:
                f._onSetWinner(h);
                break;
            case MSG_REMATCH_PANEL:
                f._onRematchPanel(h);
                break;
            case MSG_REMATCH_ANSWER_RESULTS:
                f._onRematchResults(h);
                break;
            case MSG_ENEMY_MOVES:
                f._onEnemyMoves(h)
        }
    };
    this._onFullRoom = function() {
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_IS_FULL,
            "s_oNetworkManager.gotoLobby")
    };
    this._onGameFound = function(h) {
        s_oNetworkManager.gotoGameRoom(h)
    };
    this._onSetWinner = function(h) {
        s_oGame.opponentLeftTheGame()
    };
    this._onRematchPanel = function() {
        s_oGame.showRematchQuestion()
    };
    this._onRematchResults = function(h) {
        if (h.getBoolean(0)) s_oGame.onOpponentAcceptRematch();
        else s_oGame.onOpponentRefuseRematch()
    };
    this._onEnemyMoves = function(h) {
        h = h.getString(0);
        h = JSON.parse(h);
        s_oGame.remoteMovePiece(h[MSG_MOVE])
    };
    var f = this;
    this._init()
}

function CAreYouSurePanel(f) {
    var h, d, g, b, a, c;
    this._init = function(k) {
        b = new createjs.Shape;
        b.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        b.alpha = 0;
        c = b.on("mousedown", function() {});
        s_oStage.addChild(b);
        (new createjs.Tween.get(b)).to({
            alpha: .7
        }, 500);
        a = new createjs.Container;
        s_oStage.addChild(a);
        k = s_oSpriteLibrary.getSprite("msg_box");
        var l = createBitmap(k);
        l.regX = k.width / 2;
        l.regY = k.height / 2;
        a.addChild(l);
        a.x = CANVAS_WIDTH / 2;
        a.y = CANVAS_HEIGHT + k.height / 2;
        h = a.y;
        (new createjs.Tween.get(a)).to({
            y: CANVAS_HEIGHT /
                2 - 40
        }, 500, createjs.Ease.cubicOut);
        k = k.width - 120;
        new CTLText(a, -(k / 2), -340, k, 200, 100, "center", "#ffffff", PRIMARY_FONT, 1, 2, 2, TEXT_ARE_SURE, !0, !0, !0, !1);
        d = new CGfxButton(170, 80, s_oSpriteLibrary.getSprite("but_yes"), a);
        d.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        g = new CGfxButton(-170, 80, s_oSpriteLibrary.getSprite("but_no"), a);
        g.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        g.pulseAnimation()
    };
    this._onButYes = function() {
        g.setClickable(!1);
        d.setClickable(!1);
        (new createjs.Tween.get(b)).to({
                alpha: 0
            },
            500);
        (new createjs.Tween.get(a)).to({
            y: h
        }, 400, createjs.Ease.backIn).call(function() {
            e.unload();
            f()
        })
    };
    this._onButNo = function() {
        g.setClickable(!1);
        d.setClickable(!1);
        (new createjs.Tween.get(b)).to({
            alpha: 0
        }, 500);
        (new createjs.Tween.get(a)).to({
            y: h
        }, 400, createjs.Ease.backIn).call(function() {
            e.unload()
        })
    };
    this.unload = function() {
        g.unload();
        d.unload();
        s_oStage.removeChild(b);
        s_oStage.removeChild(a);
        b.off("mousedown", c)
    };
    var e = this;
    this._init(f)
}

function CTreeDecision(f) {
    var h, d, g;
    this._init = function(b) {
        h = [];
        for (var a = 0; a < SEARCH_DEPTH + 1; a++) h[a] = [];
        d = new TreeModel;
        g = d.parse(b);
        h[0][0] = g
    };
    this.getRoot = function() {
        return g
    };
    this.initNewNode = function(b) {
        h[b].push(d.parse({
            rating: 0,
            moves: [],
            depth: b
        }));
        return h[b][h[b].length - 1]
    };
    this.addNode = function(b, a, c) {
        var e = b + 1,
            k = h[e].length - 1;
        h[e][k].model.moves = c;
        h[e][k].model.rating = a;
        h[b][h[b].length - 1].addChild(h[e][k])
    };
    this.rateNode = function(b, a) {
        b.model.rating = a
    };
    this.getNode = function(b, a) {
        return g.all(function(c) {
            return c.model.rating ===
                b && c.model.depth === a
        })
    };
    this.getPath = function(b) {
        return b.getPath()
    };
    this.getTerminalNodes = function() {
        return g.all(function(b) {
            return !b.hasChildren()
        })
    };
    this._init(f)
}
var CANVAS_WIDTH = 1280,
    CANVAS_HEIGHT = 1920,
    EDGEBOARD_X = 150,
    EDGEBOARD_Y = 280,
    FPS = 30,
    FPS_TIME = 1E3 / FPS,
    DISABLE_SOUND_MOBILE = !1,
    PRIMARY_FONT = "arialrounded",
    SOUNDTRACK_VOLUME_IN_GAME = 1,
    GAME_PLAYERIO_ID = "master-chess-e6yiz5o6zk6hiyfnexvrqa",
    GAME_NAME = "masterchess_multiplayer",
    MULTIPLAYER_TEST_LOCAL = !1,
    STATE_LOADING = 0,
    STATE_MENU = 1,
    STATE_HELP = 1,
    STATE_GAME = 3,
    ON_MOUSE_DOWN = 0,
    ON_MOUSE_UP = 1,
    ON_MOUSE_OVER = 2,
    ON_MOUSE_OUT = 3,
    ON_DRAG_START = 4,
    ON_DRAG_END = 5,
    MODE_HUMAN = 0,
    MODE_COMPUTER = 1,
    EASY_MODE = 0,
    MEDIUM_MODE = 1,
    HARD_MODE =
    2,
    WHITE = "white",
    BLACK = "black",
    PAWN = "pawn",
    ROOK = "rook",
    KNIGHT = "knight",
    BISHOP = "bishop",
    QUEEN = "queen",
    KING = "king",
    PLAYER_STATE_WAIT = 0,
    PLAYER_STATE_SELECTED = 1,
    PLAYER_STATE_MOVING = 2,
    BOARD_STATE_STALEMATE = 0,
    BOARD_STATE_CHECK = 1,
    BOARD_STATE_PROMOTION = 2,
    BOARD_STATE_CHECKMATE = 3,
    BOARD_SPECIAL_CASTLING_RIGHT = 0,
    BOARD_SPECIAL_CASTLING_LEFT = 1,
    BOARD_SPECIAL_ENPASSANT = 2,
    NUM_CELL = 8,
    BOARD_LENGTH = 815,
    CELL_LENGTH = BOARD_LENGTH / NUM_CELL,
    DRAW = -1,
    TIME_MOVE = 1E3,
    TIME_LOOP_WAIT = 1E3,
    MIN_AI_THINKING = 1E3,
    MAX_AI_THINKING = 1500,
    INFINITE = 99999,
    SEARCH_DEPTH, DRAW_COUNTER = 50,
    START_SCORE, SCORE_DECREASE_PER_SECOND, SHOW_SCORE, ENABLE_CHECK_ORIENTATION, ENABLE_FULLSCREEN;

function CPreloader() {
    var f, h, d, g, b, a, c, e, k, l;
    this._init = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.loadSprites();
        l = new createjs.Container;
        s_oStage.addChild(l)
    };
    this.unload = function() {
        l.removeAllChildren();
        k.unload()
    };
    this._onImagesLoaded = function() {};
    this._onAllImagesLoaded = function() {
        this.attachSprites();
        s_oMain.preloaderReady()
    };
    this.attachSprites = function() {
        var m = new createjs.Shape;
        m.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        l.addChild(m);
        m = s_oSpriteLibrary.getSprite("200x200");
        c = createBitmap(m);
        c.regX = .5 * m.width;
        c.regY = .5 * m.height;
        c.x = CANVAS_WIDTH / 2;
        c.y = CANVAS_HEIGHT / 2 - 180;
        l.addChild(c);
        e = new createjs.Shape;
        e.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(c.x - 100, c.y - 100, 200, 200, 10);
        l.addChild(e);
        c.mask = e;
        m = s_oSpriteLibrary.getSprite("progress_bar");
        g = createBitmap(m);
        g.x = CANVAS_WIDTH / 2 - m.width / 2;
        g.y = CANVAS_HEIGHT / 2 + 50;
        l.addChild(g);
        f = m.width;
        h = m.height;
        b = new createjs.Shape;
        b.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(g.x, g.y, 1, h);
        l.addChild(b);
        g.mask = b;
        d = new createjs.Text("", "30px " + PRIMARY_FONT, "#fff");
        d.x = CANVAS_WIDTH / 2;
        d.y = CANVAS_HEIGHT / 2 + 100;
        d.textBaseline = "alphabetic";
        d.textAlign = "center";
        l.addChild(d);
        m = s_oSpriteLibrary.getSprite("but_start");
        k = new CTextButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT /
            2, m, TEXT_PRELOADER_CONTINUE, "Arial", "#000", 40, l);
        k.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this);
        k.setVisible(!1);
        a = new createjs.Shape;
        a.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        l.addChild(a);
        createjs.Tween.get(a).to({
            alpha: 0
        }, 500).call(function() {
            createjs.Tween.removeTweens(a);
            l.removeChild(a)
        })
    };
    this._onButStartRelease = function() {
        $(s_oMain).trigger("show_preroll_ad");
        s_oMain._onPreloaderComplete()
    };
    this.refreshLoader = function(m) {
        d.text = m + "%";
        100 === m && ($(s_oMain).trigger("show_preroll_ad"),
            s_oMain._onPreloaderComplete());
        b.graphics.clear();
        m = Math.floor(m * f / 100);
        b.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(g.x, g.y, m, h)
    };
    this._init()
}

function CCreditsPanel() {
    var f, h, d, g, b, a, c;
    this._init = function() {
        g = new createjs.Shape;
        g.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        g.alpha = 0;
        s_oStage.addChild(g);
        (new createjs.Tween.get(g)).to({
            alpha: .7
        }, 500);
        var e = s_oSpriteLibrary.getSprite("msg_box");
        c = new createjs.Container;
        c.y = CANVAS_HEIGHT + e.height / 2;
        s_oStage.addChild(c);
        f = createBitmap(e);
        f.regX = e.width / 2;
        f.regY = e.height / 2;
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT / 2;
        c.addChild(f);
        a = new createjs.Shape;
        a.graphics.beginFill("#0f0f0f").drawRect(0,
            0, CANVAS_WIDTH, CANVAS_HEIGHT);
        a.alpha = .01;
        b = a.on("click", this._onLogoButRelease);
        c.addChild(a);
        var k = s_oSpriteLibrary.getSprite("but_exit");
        d = new CGfxButton(1E3, 610, k, c);
        d.addEventListener(ON_MOUSE_UP, this.unload, this);
        k = e.width - 120;
        var l = 90,
            m = CANVAS_WIDTH / 2,
            n = CANVAS_HEIGHT / 2 - 124;
        new CTLText(c, m - k / 2, n - l / 2, k, l, 80, "center", "#402604", PRIMARY_FONT, 1, 2, 2, TEXT_CREDITS_DEVELOPED, !0, !0, !1, !1);
        k = s_oSpriteLibrary.getSprite("logo_ctl");
        h = createBitmap(k);
        h.regX = k.width / 2;
        h.regY = k.height / 2;
        h.x = CANVAS_WIDTH / 2;
        h.y = CANVAS_HEIGHT / 2;
        c.addChild(h);
        k = e.width - 120;
        l = 80;
        m = CANVAS_WIDTH / 2;
        n = CANVAS_HEIGHT / 2 + 120;
        new CTLText(c, m - k / 2, n - l / 2, k, l, 68, "center", "#402604", PRIMARY_FONT, 1, 2, 2, "www.codethislab.com", !0, !0, !1, !1);
        e = new createjs.Text("v.2", "26px " + PRIMARY_FONT, "#402604");
        e.textAlign = "center";
        e.textBaseline = "alphabetic";
        e.x = CANVAS_WIDTH / 2 - 390;
        e.y = CANVAS_HEIGHT / 2 + 390;
        c.addChild(e);
        (new createjs.Tween.get(c)).to({
            y: 0
        }, 1E3, createjs.Ease.backOut)
    };
    this.unload = function() {
        a.off("click", b);
        d.unload();
        d = null;
        s_oStage.removeChild(g);
        s_oStage.removeChild(c)
    };
    this._onLogoButRelease = function() {};
    this._init()
}

function CMain(f) {
    var h, d = 0,
        g = 0,
        b = STATE_LOADING,
        a;
    this.initContainer = function() {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage, !0);
        s_bMobile = isMobile();
        !1 === s_bMobile && (s_oStage.enableMouseOver(20), $("body").on("contextmenu", "#canvas", function(e) {
            return !1
        }));
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
        s_oSpriteLibrary = new CSpriteLibrary;
        s_oNetworkManager = new CNetworkManager;
        a = new CPreloader
    };
    this.preloaderReady = function() {
        this._loadImages();
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
        h = !0
    };
    this.soundLoaded = function() {
        d++;
        a.refreshLoader(Math.floor(d / g * 100))
    };
    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);
        s_aSoundsInfo = [];
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "game_over",
            loop: !1,
            volume: 1,
            ingamename: "game_over"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "click",
            loop: !1,
            volume: 1,
            ingamename: "click"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "win",
            loop: !1,
            volume: 1,
            ingamename: "win"
        });
        g += s_aSoundsInfo.length;
        s_aSounds = [];
        for (var e = 0; e < s_aSoundsInfo.length; e++) this.tryToLoadSound(s_aSoundsInfo[e], !1)
    };
    this.tryToLoadSound = function(e, k) {
        setTimeout(function() {
            s_aSounds[e.ingamename] = new Howl({
                src: [e.path + e.filename + ".mp3"],
                autoplay: !1,
                preload: !0,
                loop: e.loop,
                volume: e.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(l, m) {
                    for (var n = 0; n < s_aSoundsInfo.length; n++)
                        if (l ===
                            s_aSounds[s_aSoundsInfo[n].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[n], !0);
                            break
                        }
                },
                onplayerror: function(l) {
                    for (var m = 0; m < s_aSoundsInfo.length; m++)
                        if (l === s_aSounds[s_aSoundsInfo[m].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[m].ingamename].once("unlock", function() {
                                s_aSounds[s_aSoundsInfo[m].ingamename].play();
                                "soundtrack" === s_aSoundsInfo[m].ingamename && null !== s_oGame && setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
                            });
                            break
                        }
                }
            })
        }, k ? 200 : 0)
    };
    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded,
            this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("local_but", "./sprites/local_but.png");
        s_oSpriteLibrary.addSprite("multiplayer_but", "./sprites/multiplayer_but.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_difficulty", "./sprites/bg_difficulty.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_mod_menu", "./sprites/bg_mod_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_vs_man", "./sprites/vs_man_panel.png");
        s_oSpriteLibrary.addSprite("but_vs_pc", "./sprites/vs_pc_panel.png");
        s_oSpriteLibrary.addSprite("message", "./sprites/message.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_show",
            "./sprites/but_show.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_settings", "./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("board8", "./sprites/grid_8.png");
        s_oSpriteLibrary.addSprite("threat", "./sprites/threat.png");
        s_oSpriteLibrary.addSprite("highlight", "./sprites/highlight.png");
        s_oSpriteLibrary.addSprite("bg_turn", "./sprites/player_panel.png");
        s_oSpriteLibrary.addSprite("audio_icon_big",
            "./sprites/audio_icon_big.png");
        s_oSpriteLibrary.addSprite("black_bishop", "./sprites/pieces/black_bishop.png");
        s_oSpriteLibrary.addSprite("black_king", "./sprites/pieces/black_king.png");
        s_oSpriteLibrary.addSprite("black_knight", "./sprites/pieces/black_knight.png");
        s_oSpriteLibrary.addSprite("black_pawn", "./sprites/pieces/black_pawn.png");
        s_oSpriteLibrary.addSprite("black_queen", "./sprites/pieces/black_queen.png");
        s_oSpriteLibrary.addSprite("black_rook", "./sprites/pieces/black_rook.png");
        s_oSpriteLibrary.addSprite("white_bishop",
            "./sprites/pieces/white_bishop.png");
        s_oSpriteLibrary.addSprite("white_king", "./sprites/pieces/white_king.png");
        s_oSpriteLibrary.addSprite("white_knight", "./sprites/pieces/white_knight.png");
        s_oSpriteLibrary.addSprite("white_pawn", "./sprites/pieces/white_pawn.png");
        s_oSpriteLibrary.addSprite("white_queen", "./sprites/pieces/white_queen.png");
        s_oSpriteLibrary.addSprite("white_rook", "./sprites/pieces/white_rook.png");
        s_oSpriteLibrary.addSprite("white_king_marker", "./sprites/white_king_marker.png");
        s_oSpriteLibrary.addSprite("black_king_marker",
            "./sprites/black_king_marker.png");
        s_oSpriteLibrary.addSprite("score_panel", "./sprites/score_panel.png");
        s_oSpriteLibrary.addSprite("toggle_easy", "./sprites/toggle_easy.png");
        s_oSpriteLibrary.addSprite("toggle_medium", "./sprites/toggle_medium.png");
        s_oSpriteLibrary.addSprite("toggle_hard", "./sprites/toggle_hard.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        g += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    };
    this._onImagesLoaded = function() {
        d++;
        a.refreshLoader(Math.floor(d / g * 100))
    };
    this._onPreloaderComplete = function() {
        try {
            checkMoreGames(s_szGameID, "bottom-left", ["board", "casual", "multiplayer"], [], -1, "light_brown")
        } catch (e) {}
        a.unload();
        this.gotoMenu()
    };
    this._onAllImagesLoaded = function() {};
    this.gotoMenu = function() {
        new CMenu;
        b = STATE_MENU;
        try {
            showMoreGames()
        } catch (e) {}
    };
    this.gotoModeMenu = function() {
        new CModeMenu;
        b = STATE_MENU
    };
    this.gotoGame =
        function(e) {
            s_iGameType = e;
            s_oGame = new CGameSingle(c);
            b = STATE_GAME
        };
    this.gotoGameMulti = function() {
        s_iGameType = MODE_HUMAN;
        s_oGame = new CGameMulti(c);
        b = STATE_GAME
    };
    this.gotoGameWithBot = function() {
        s_oGame = _oGame = new CGameSingleWithBot(c);
        b = STATE_GAME
    };
    this.gotoHelp = function() {
        new CHelp;
        b = STATE_HELP
    };
    this.stopUpdate = function() {
        h = !1;
        createjs.Ticker.paused = !0;
        $("#block_game").css("display", "block");
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || Howler.mute(!0)
    };
    this.startUpdate = function() {
        s_iPrevTime = (new Date).getTime();
        h = !0;
        createjs.Ticker.paused = !1;
        $("#block_game").css("display", "none");
        (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) && s_bAudioActive && Howler.mute(!1)
    };
    this._update = function(e) {
        if (!1 !== h) {
            var k = (new Date).getTime();
            s_iTimeElaps = k - s_iPrevTime;
            s_iCntTime += s_iTimeElaps;
            s_iCntFps++;
            s_iPrevTime = k;
            1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0);
            b === STATE_GAME && s_oGame.update();
            s_oStage.update(e)
        }
    };
    s_oMain = this;
    var c = f;
    ENABLE_CHECK_ORIENTATION = f.check_orientation;
    ENABLE_FULLSCREEN = f.fullscreen;
    s_bAudioActive = !0;
    this.initContainer()
}
var s_bMobile, s_bAudioActive = !0,
    s_bFullscreen = !1,
    s_iCntTime = 0,
    s_iTimeElaps = 0,
    s_iPrevTime = 0,
    s_iCntFps = 0,
    s_iCurFps = 0,
    s_oStage, s_oMain, s_oSpriteLibrary, s_oCanvas, s_iGameType, s_aSounds, s_oGame = null,
    s_oNetworkManager = null,
    s_bMultiplayer = !1,
    s_bWeightSquares = !1,
    s_bEdgeSensitive = !1;

function CMessage(f, h, d) {
    var g, b, a, c;
    this._init = function(k, l) {
        s_bMultiplayer ? s_oNetworkManager.isUserA() ? this.setPosition(!0) : this.setPosition(!1) : this.setPosition(!0);
        c = new createjs.Container;
        c.x = g;
        c.y = b;
        s_bMobile && k === BLACK && s_iGameType === MODE_HUMAN && (c.rotation = 180);
        d.addChild(c);
        var m = s_oSpriteLibrary.getSprite("message"),
            n = createBitmap(m);
        n.regX = m.width / 2;
        n.regY = m.height / 2;
        c.addChild(n);
        m = m.width - 30;
        new CTLText(c, -(m / 2), -25, m, 50, 40, "center", "#ffffff", PRIMARY_FONT, 1, 2, 2, l, !0, !0, !1, !1);
        createjs.Tween.get(c).to({
                y: a
            },
            750, createjs.Ease.cubicOut)
    };
    this.unload = function() {
        d.removeChild(c)
    };
    this.removeAnimated = function() {
        console.log(c.x);
        0 < c.x ? createjs.Tween.get(c).to({
            x: CANVAS_WIDTH / 2 + 200
        }, 500, createjs.Ease.cubicOut).call(function() {
            e.unload()
        }) : createjs.Tween.get(c).to({
            x: -CANVAS_WIDTH / 2 - 200
        }, 500, createjs.Ease.cubicOut).call(function() {
            e.unload()
        })
    };
    this.setPosition = function(k) {
        k ? f === WHITE ? (g = -306, b = 1E3, a = 516) : (g = 230, b = -1E3, a = -506) : f === BLACK ? (g = -306, b = 1E3, a = 516) : (g = 230, b = -1E3, a = -506)
    };
    var e = this;
    this._init(f, h)
}

function CMenu() {
    var f, h, d, g, b, a, c, e, k, l, m, n, p, q, u = null,
        t = null;
    this._init = function() {
        e = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(e);
        var r = s_oSpriteLibrary.getSprite("local_but");
        k = new CGfxButton(CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT - 450, r, s_oStage);
        k.addEventListener(ON_MOUSE_UP, this._onButLocalRelease, this);
        r = s_oSpriteLibrary.getSprite("multiplayer_but");
        l = new CGfxButton(CANVAS_WIDTH / 2 + 250, CANVAS_HEIGHT - 450, r, s_oStage);
        l.addEventListener(ON_MOUSE_UP, this._onButMultiplayerRelease,
            this);
        r = s_oSpriteLibrary.getSprite("but_credits");
        b = 10 + r.width / 2;
        a = r.height / 2 + 25;
        p = new CGfxButton(b, a, r, s_oStage);
        p.addEventListener(ON_MOUSE_UP, this._onCredits, this);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) r = s_oSpriteLibrary.getSprite("audio_icon"), f = CANVAS_WIDTH - r.height / 2 - 10, h = r.height / 2 + 25, n = new CToggle(f, h, r, s_bAudioActive, s_oStage), n.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        r = window.document;
        var x = r.documentElement;
        u = x.requestFullscreen || x.mozRequestFullScreen || x.webkitRequestFullScreen ||
            x.msRequestFullscreen;
        t = r.exitFullscreen || r.mozCancelFullScreen || r.webkitExitFullscreen || r.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (u = !1);
        u && screenfull.isEnabled && (r = s_oSpriteLibrary.getSprite("but_fullscreen"), d = b + r.width / 2 + 10, g = a, q = new CToggle(d, g, r, s_bFullscreen, s_oStage), q.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        m = new createjs.Shape;
        m.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(m);
        createjs.Tween.get(m).to({
            alpha: 0
        }, 1E3).call(function() {
            m.visible = !1
        });
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
    };
    this.unload = function() {
        k.unload();
        k = null;
        l.unload();
        l = null;
        m.visible = !1;
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) n.unload(), n = null;
        p.unload();
        u && screenfull.isEnabled && q.unload();
        s_oStage.removeChild(e);
        s_oMenu = e = null
    };
    this.refreshButtonPos = function(r, x) {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || n.setPosition(f - r, x + h);
        p.setPosition(b + r, x + a);
        u && screenfull.isEnabled && q.setPosition(d + r, x + g)
    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._onButLocalRelease = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd();
        try {
            hideMoreGames()
        } catch (r) {}
        this.unload();
        s_bPlayWithBot = s_bMultiplayer = !1;
        $(s_oMain).trigger("start_session");
        s_oMain.gotoModeMenu()
    };
    this._onButMultiplayerRelease = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd();
        try {
            hideMoreGames()
        } catch (r) {}
        $(s_oMain).trigger("start_session");
        s_bMultiplayer = !0;
        s_bPlayWithBot = !1;
        s_oNetworkManager.addEventListener(ON_GAMEROOM_CONNECTION_SUCCESS,
            this._onGameStart);
        s_oNetworkManager.addEventListener(ON_MATCHMAKING_CONNECTION_SUCCESS, this._checkMatchWithBot);
        s_oNetworkManager.addEventListener(ON_BACK_FROM_A_ROOM, this.clearBotCheck);
        s_oNetworkManager.connectToSystem()
    };
    this._onGameStart = function() {
        s_oMenu.clearBotCheck();
        s_bMultiplayer = !0;
        s_bPlayWithBot = !1;
        s_oMenu.unload();
        s_oMain.gotoGameMulti()
    };
    this._checkMatchWithBot = function() {
        var r = randomFloatBetween(18E3, 26E3);
        c = setTimeout(function() {
            s_bPlayWithBot = s_bMultiplayer = !0;
            s_iGameType = MODE_COMPUTER;
            var x = Math.random();
            SEARCH_DEPTH = .8 < x ? 3 : .6 < x ? 1 : 2;
            g_oCTLMultiplayer.closeAllDialog();
            s_oNetworkManager.disconnect();
            s_oNetworkManager.generateRandomName();
            s_oMenu.unload();
            s_oMain.gotoGameWithBot()
        }, r)
    };
    this.clearBotCheck = function() {
        clearTimeout(c)
    };
    this._onCredits = function() {
        new CCreditsPanel
    };
    this.resetFullscreenBut = function() {
        u && screenfull.isEnabled && q.setActive(s_bFullscreen)
    };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? t.call(window.document) : u.call(window.document.documentElement);
        sizeHandler()
    };
    s_oMenu = this;
    this._init()
}
var s_oMenu = null;

function CModeMenu() {
    var f, h, d, g, b, a, c, e, k, l, m = null,
        n, p, q, u, t = null,
        r = null;
    this._init = function() {
        var x = createBitmap(s_oSpriteLibrary.getSprite("bg_mod_menu"));
        s_oStage.addChild(x);
        x = s_oSpriteLibrary.getSprite("but_exit");
        d = CANVAS_WIDTH - x.height / 2 - 10;
        g = x.height / 2 + 25;
        l = new CGfxButton(d, g, x, s_oStage);
        l.addEventListener(ON_MOUSE_UP, this._onExit, this);
        b = CANVAS_WIDTH - x.width / 2 - 125;
        a = x.height / 2 + 25;
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) x = s_oSpriteLibrary.getSprite("audio_icon"), m = new CToggle(b, a, x,
            s_bAudioActive, s_oStage), m.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        x = window.document;
        var D = x.documentElement;
        t = D.requestFullscreen || D.mozRequestFullScreen || D.webkitRequestFullScreen || D.msRequestFullscreen;
        r = x.exitFullscreen || x.mozCancelFullScreen || x.webkitExitFullscreen || x.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (t = !1);
        t && screenfull.isEnabled && (x = s_oSpriteLibrary.getSprite("but_fullscreen"), f = x.width / 4 + 10, h = g, u = new CToggle(f, h, x, s_bFullscreen, s_oStage), u.addEventListener(ON_MOUSE_UP,
            this._onFullscreenRelease, this));
        new CTLText(s_oStage, CANVAS_WIDTH / 2 - 300, 300, 600, 200, 80, "center", "#ffffff", PRIMARY_FONT, 1, 2, 2, TEXT_MODE, !0, !0, !0, !1);
        x = s_oSpriteLibrary.getSprite("but_vs_man");
        e = new CGfxButton(CANVAS_WIDTH / 2, 800, x, s_oStage);
        e.addEventListener(ON_MOUSE_UP, this._onButHumanRelease, this);
        x = s_oSpriteLibrary.getSprite("bg_difficulty");
        D = createBitmap(x);
        D.regX = x.width / 2;
        D.regY = x.height / 2;
        D.x = CANVAS_WIDTH / 2;
        D.y = 1532;
        s_oStage.addChild(D);
        x = s_oSpriteLibrary.getSprite("toggle_easy");
        n = new CToggle(CANVAS_WIDTH /
            2 - 130 + 2, 1550, x, !1, s_oStage);
        n.addEventListenerWithParams(ON_MOUSE_UP, this._onDifficultyToggle, this, EASY_MODE);
        x = s_oSpriteLibrary.getSprite("toggle_medium");
        p = new CToggle(CANVAS_WIDTH / 2 + 2, 1550, x, !0, s_oStage);
        p.addEventListenerWithParams(ON_MOUSE_UP, this._onDifficultyToggle, this, MEDIUM_MODE);
        x = s_oSpriteLibrary.getSprite("toggle_hard");
        q = new CToggle(CANVAS_WIDTH / 2 + 132, 1550, x, !1, s_oStage);
        q.addEventListenerWithParams(ON_MOUSE_UP, this._onDifficultyToggle, this, HARD_MODE);
        x = s_oSpriteLibrary.getSprite("but_vs_pc");
        k = new CGfxButton(CANVAS_WIDTH / 2, 1300, x, s_oStage);
        k.addEventListener(ON_MOUSE_UP, this._onButComputerRelease, this);
        this._onDifficultyToggle(MEDIUM_MODE);
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
    };
    this.unload = function() {
        e.unload();
        k.unload();
        l.unload();
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) m.unload(), m = null;
        t && screenfull.isEnabled && u.unload();
        s_oModeMenu = null;
        s_oStage.removeAllChildren()
    };
    this._onDifficultyToggle = function(x) {
        switch (x) {
            case EASY_MODE:
                n.setActive(!0);
                p.setActive(!1);
                q.setActive(!1);
                c = EASY_MODE;
                SEARCH_DEPTH = 1;
                break;
            case MEDIUM_MODE:
                n.setActive(!1);
                p.setActive(!0);
                q.setActive(!1);
                c = MEDIUM_MODE;
                SEARCH_DEPTH = 2;
                break;
            case HARD_MODE:
                n.setActive(!1), p.setActive(!1), q.setActive(!0), c = HARD_MODE, SEARCH_DEPTH = 3
        }
    };
    this.refreshButtonPos = function(x, D) {
        l.setPosition(d - x, D + g);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || m.setPosition(b - x, D + a);
        t && screenfull.isEnabled && u.setPosition(f + x, D + h)
    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this.resetFullscreenBut =
        function() {
            t && screenfull.isEnabled && u.setActive(s_bFullscreen)
        };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? r.call(window.document) : t.call(window.document.documentElement);
        sizeHandler()
    };
    this._onExit = function() {
        this.unload();
        s_oMain.gotoMenu()
    };
    this._onButHumanRelease = function() {
        this.unload();
        s_oMain.gotoGame(MODE_HUMAN)
    };
    this._onButComputerRelease = function() {
        this.unload();
        s_oMain.gotoGame(MODE_COMPUTER, c)
    };
    s_oModeMenu = this;
    this._init()
}
var s_oModeMenu = null;

function CGameBase(f) {
    this._bStartGame;
    this._bCheck;
    this._iPlayerState;
    this._iCurPlayer;
    this._iBlackTime;
    this._iWhiteTime;
    this._iBlackScore;
    this._iWhiteScore;
    this._iHistoryID;
    this._aCell;
    this._oInterface;
    this._oEndPanel = null;
    this._oBoardContainer;
    this._oInfoPanelContainer;
    this._oPiecesContainer;
    this._oKnightContainer;
    this._oMessage;
    this._oThinking;
    this._oBoard;
    this._oCellActive;
    this._oAI;
    SHOW_SCORE = f.show_score;
    START_SCORE = f.start_score;
    SCORE_DECREASE_PER_SECOND = f.score_decrease_per_second;
    this._init()
}
CGameBase.prototype._init = function() {
    this._reset();
    this._oMessage = this._oCellActive = null;
    var f = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    s_oStage.addChild(f);
    this._oBoardContainer = new createjs.Container;
    this._oBoardContainer.x = CANVAS_WIDTH / 2;
    this._oBoardContainer.y = CANVAS_HEIGHT / 2;
    this._oBoardContainer.scaleX = this._oBoardContainer.scaleY = 1.2;
    s_oStage.addChild(this._oBoardContainer);
    this._oPiecesContainer = new createjs.Container;
    this._oPiecesContainer.x = CANVAS_WIDTH / 2;
    this._oPiecesContainer.y =
        CANVAS_HEIGHT / 2;
    this._oPiecesContainer.scaleX = this._oPiecesContainer.scaleY = 1.2;
    s_oStage.addChild(this._oPiecesContainer);
    this._oKnightContainer = new createjs.Container;
    this._oKnightContainer.x = CANVAS_WIDTH / 2;
    this._oKnightContainer.y = CANVAS_HEIGHT / 2;
    this._oKnightContainer.scaleX = this._oKnightContainer.scaleY = 1.2;
    s_oStage.addChild(this._oKnightContainer);
    f = s_oSpriteLibrary.getSprite("board8");
    this._oBoard = new createBitmap(f);
    this._oBoard.regX = f.width / 2;
    this._oBoard.regY = f.height / 2;
    this._oBoardContainer.addChild(this._oBoard);
    this._oThinking = new CThinking;
    this._oInfoPanelContainer = new createjs.Container;
    this._oInfoPanelContainer.x = CANVAS_WIDTH / 2;
    this._oInfoPanelContainer.y = CANVAS_HEIGHT / 2;
    this._oInfoPanelContainer.scaleX = this._oInfoPanelContainer.scaleY = 1.2;
    s_oStage.addChild(this._oInfoPanelContainer);
    this._oInterface = new CInterface(this._oInfoPanelContainer);
    this.refreshSize()
};
CGameBase.prototype._reset = function() {
    this._bStartGame = !0;
    this._bCheck = !1;
    this._iPlayerState = PLAYER_STATE_WAIT;
    this._iCurPlayer = WHITE;
    this._iWhiteTime = this._iBlackTime = this._iHistoryID = 0;
    this._iWhiteScore = this._iBlackScore = START_SCORE
};
CGameBase.prototype._initBoard = function() {
    for (var f = 0; f < NUM_CELL; f++) this._aCell[1][f].createPiece(this._iHistoryID, BLACK, PAWN);
    for (f = 0; f < NUM_CELL; f++) this._aCell[6][f].createPiece(this._iHistoryID, WHITE, PAWN);
    this._aCell[0][0].createPiece(this._iHistoryID, BLACK, ROOK);
    this._aCell[0][7].createPiece(this._iHistoryID, BLACK, ROOK);
    this._aCell[7][0].createPiece(this._iHistoryID, WHITE, ROOK);
    this._aCell[7][7].createPiece(this._iHistoryID, WHITE, ROOK);
    this._aCell[0][1].createPiece(this._iHistoryID, BLACK, KNIGHT);
    this._aCell[0][6].createPiece(this._iHistoryID, BLACK, KNIGHT);
    this._aCell[7][1].createPiece(this._iHistoryID, WHITE, KNIGHT);
    this._aCell[7][6].createPiece(this._iHistoryID, WHITE, KNIGHT);
    this._aCell[0][2].createPiece(this._iHistoryID, BLACK, BISHOP);
    this._aCell[0][5].createPiece(this._iHistoryID, BLACK, BISHOP);
    this._aCell[7][2].createPiece(this._iHistoryID, WHITE, BISHOP);
    this._aCell[7][5].createPiece(this._iHistoryID, WHITE, BISHOP);
    this._aCell[0][3].createPiece(this._iHistoryID, BLACK, QUEEN);
    this._aCell[0][4].createPiece(this._iHistoryID,
        BLACK, KING);
    this._aCell[7][3].createPiece(this._iHistoryID, WHITE, QUEEN);
    this._aCell[7][4].createPiece(this._iHistoryID, WHITE, KING)
};
CGameBase.prototype.refreshSize = function() {
    if (this._oBoardContainer && this._oBoardContainer.getBounds()) {
        this._oBoardContainer.getBounds();
        var f = CANVAS_WIDTH - 2 * s_iOffsetX - 60,
            h = CANVAS_HEIGHT - 2 * s_iOffsetY - 120 - EDGEBOARD_Y;
        var d = this._oBoard.getBounds().width - 200;
        var g = this._oBoard.getBounds().height - 200;
        d = zoomInCamera(this._oBoardContainer, f, h, d, g);
        this._oInfoPanelContainer.scaleX = this._oInfoPanelContainer.scaleY = d;
        this._oPiecesContainer.scaleX = this._oPiecesContainer.scaleY = d;
        this._oKnightContainer.scaleX =
            this._oKnightContainer.scaleY = d
    }
};
CGameBase.prototype._playAI = function(f) {
    if (!f) {
        s_oGame._oThinking.show();
        f = MIN_AI_THINKING + Math.random() * (MAX_AI_THINKING - MIN_AI_THINKING);
        var h = this._oAI.getMove();
        null !== h && setTimeout(function() {
            s_oGame._oThinking.hide();
            s_oGame.cellClicked(h.sourcerow, h.sourcecol);
            s_oGame.cellClicked(h.destrow, h.destcol)
        }, f)
    }
};
CGameBase.prototype.cellClicked = function(f, h) {
    switch (this._iPlayerState) {
        case PLAYER_STATE_WAIT:
            this._disableAllThreat();
            if (null !== this._aCell[f][h].getColor() && this._aCell[f][h].getColor() !== this._iCurPlayer) break;
            this._selectPiece(f, h);
            break;
        case PLAYER_STATE_SELECTED:
            this._oCellActive.getLogicPos().row === f && this._oCellActive.getLogicPos().col === h ? this._deselectPiece() : this._aCell[f][h].getColor() === this._iCurPlayer ? (this._deselectPiece(), this._selectPiece(f, h)) : this._aCell[f][h].isHighlight() ?
                this._checkLegalMove(f, h) : this._deselectPiece(), playSound("click", 1, !1)
    }
};
CGameBase.prototype._checkLegalMove = function(f, h) {
    var d = s_oBoardStateController.copyBoard(this._aCell);
    s_oBoardStateController.moveCopiedPiece(d, this._oCellActive.getLogicPos().row, this._oCellActive.getLogicPos().col, f, h);
    d = s_oBoardStateController.findAllChecks(this._iCurPlayer, d);
    if (0 === d.length) {
        switch (s_oBoardStateController.getSpecialMoves(this._oCellActive.getLogicPos().row, this._oCellActive.getLogicPos().col, f, h, this._aCell)) {
            case BOARD_SPECIAL_CASTLING_RIGHT:
                var g = this._aCell[this._oCellActive.getLogicPos().row][7];
                d = this._aCell[this._oCellActive.getLogicPos().row][5];
                g.shift(d);
                break;
            case BOARD_SPECIAL_CASTLING_LEFT:
                g = this._aCell[this._oCellActive.getLogicPos().row][0];
                d = this._aCell[this._oCellActive.getLogicPos().row][3];
                g.shift(d);
                break;
            case BOARD_SPECIAL_ENPASSANT:
                d = this._aCell[this._oCellActive.getLogicPos().row][h], d.eatUp(), d.setPiece(null)
        }
        this._oCellActive.setActive(!1);
        this._movePiece(f, h);
        this._deselectPiece();
        this._iPlayerState = PLAYER_STATE_MOVING
    } else this._enableThreatHighlight(d)
};
CGameBase.prototype._selectPiece = function(f, h) {
    this._oCellActive = this._aCell[f][h];
    this._oCellActive.setActive(!0);
    for (var d = s_oMovesController.getMovesList(f, h, this._aCell), g = 0; g < d.length; g++) this._aCell[d[g].row][d[g].col].highlight(!0);
    this._iPlayerState = PLAYER_STATE_SELECTED;
    playSound("click", 1, !1)
};
CGameBase.prototype._deselectPiece = function() {
    s_oGame._disableAllHighlight();
    s_oGame._oCellActive.setActive(!1);
    s_oGame._oCellActive = null;
    s_oGame._iPlayerState = PLAYER_STATE_WAIT
};
CGameBase.prototype.checkGameState = function() {
    this._bCheck = s_oBoardStateController.kingInCheck(this._iCurPlayer, this._aCell);
    var f = !1;
    switch (s_oBoardStateController.getState(this._iCurPlayer, this._aCell)) {
        case BOARD_STATE_STALEMATE:
            this.gameOver(DRAW);
            this._oMessage = new CMessage(this._iCurPlayer, TEXT_STALEMATE, this._oInfoPanelContainer);
            f = !0;
            break;
        case BOARD_STATE_CHECK:
            this._bCheck = !0;
            for (var h = s_oBoardStateController.findAllChecks(this._iCurPlayer, this._aCell), d = 0; d < h.length; d++) this._aCell[h[d].getLogicPos().row][h[d].getLogicPos().col].threat(!0);
            this._oMessage = new CMessage(this._iCurPlayer, TEXT_CHECK, this._oInfoPanelContainer);
            break;
        case BOARD_STATE_CHECKMATE:
            f = s_oBoardStateController.getOtherOpponent(this._iCurPlayer), this._oMessage = new CMessage(this._iCurPlayer, TEXT_CHECKMATE, this._oInfoPanelContainer), this.gameOver(f), f = !0
    }
    return f
};
CGameBase.prototype.setPieceDepth = function() {
    for (var f = [], h = 0; h < this._oPiecesContainer.children.length; h++) {
        var d = this._oPiecesContainer.children[h];
        f.push({
            height: d.y,
            piece: d
        })
    }
    f.sort(this.compareHeight);
    for (h = d = 0; h < this._oPiecesContainer.children.length; h++) this._oPiecesContainer.setChildIndex(f[h].piece, d++)
};
CGameBase.prototype.compareHeight = function(f, h) {
    return f.height < h.height ? -1 : f.height > h.height ? 1 : 0
};
CGameBase.prototype.getCells = function() {
    return this._aCell
};
CGameBase.prototype.restartGame = function() {
    s_oGame._oEndPanel.unload();
    this._oCellActive = null;
    s_oGame._disableAllHighlight();
    this._reset();
    for (var f = 0; f < NUM_CELL; f++)
        for (var h = 0; h < NUM_CELL; h++) this._aCell[f][h].removePiece();
    this._initBoard();
    s_oGame._oInterface.resetInfo();
    s_oGame._oInterface.setInfoVisible(!0);
    s_oGame._oInterface.activePlayer(this._iCurPlayer);
    this._oMessage && this._oMessage.unload()
};
CGameBase.prototype.checkBoard = function() {
    s_oGame._oEndPanel.hide()
};
CGameBase.prototype.pauseGame = function(f) {
    this._bStartGame = !f
};
CGameBase.prototype._disableAllHighlight = function() {
    null !== this._oCellActive && this._oCellActive.setActive(!1);
    for (var f = 0; f < NUM_CELL; f++)
        for (var h = 0; h < NUM_CELL; h++) this._aCell[f][h].highlight(!1), this._aCell[f][h].threat(!1)
};
CGameBase.prototype._disableAllThreat = function() {
    for (var f = 0; f < NUM_CELL; f++)
        for (var h = 0; h < NUM_CELL; h++) this._aCell[f][h].threat(!1)
};
CGameBase.prototype._enableThreatHighlight = function(f) {
    this._disableAllThreat();
    for (var h = 0; h < f.length; h++) this._aCell[f[h].getLogicPos().row][f[h].getLogicPos().col].threat(!0)
};
CGameBase.prototype.setAllVisible = function(f) {
    for (var h = 0; h < NUM_CELL; h++)
        for (var d = 0; d < NUM_CELL; d++) this._aCell[h][d].setVisible(f)
};
CGameBase.prototype.isCheck = function() {
    return this._bCheck
};
CGameBase.prototype.changePiece = function(f, h) {
    this._aCell[h.row][h.col].changePiece(this._iCurPlayer, f)
};
CGameBase.prototype.getNewHistoryID = function() {
    return ++this._iHistoryID
};
CGameBase.prototype.getLastHistoryID = function() {
    return this._iHistoryID
};
CGameBase.prototype._onExitHelp = function() {
    this._bStartGame = !0
};
CGameBase.prototype.gameOver = function(f) {
    this._bStartGame = !1;
    this._oThinking.hide();
    f === WHITE ? this._iBlackScore = 0 : f === BLACK ? this._iWhiteScore = 0 : f === DRAW && (this._iWhiteScore = this._iBlackScore = 0);
    this.setEndPanel(f)
};
CGameBase.prototype.update = function() {
    this._bStartGame && (null !== this._oThinking && this._oThinking.update(), this.setPieceDepth(), this._iCurPlayer === WHITE ? (this._iWhiteTime += s_iTimeElaps, this._oInterface.refreshWhiteTime(this._iWhiteTime), this._iWhiteScore -= SCORE_DECREASE_PER_SECOND * s_iTimeElaps / 1E3, 0 > this._iWhiteScore && (this._iWhiteScore = 0), this._oInterface.refreshWhiteScore(Math.floor(this._iWhiteScore))) : (this._iBlackTime += s_iTimeElaps, this._oInterface.refreshBlackTime(this._iBlackTime), this._iBlackScore -=
        SCORE_DECREASE_PER_SECOND * s_iTimeElaps / 1E3, 0 > this._iBlackScore && (this._iBlackScore = 0), this._oInterface.refreshBlackScore(Math.floor(this._iBlackScore))))
};

function CGameSingle(f) {
    CGameBase.call(this, f);
    this._startGame()
}
CGameSingle.prototype = Object.create(CGameBase.prototype);
CGameSingle.prototype._startGame = function() {
    this._oInterface.configureInfoPanel(!0);
    this._setBoard();
    this._initBoard();
    this.setPieceDepth();
    new CMovesController(this._aCell);
    new CMovesControllerFaster(this._aCell);
    new CBoardStateController;
    this._oInterface.activePlayer(this._iCurPlayer);
    this._oAI = new CAI
};
CGameSingle.prototype._setBoard = function() {
    var f = NUM_CELL,
        h = CELL_LENGTH,
        d = -BOARD_LENGTH / 2 + h / 2;
    this._aCell = [];
    for (var g = 0; g < f; g++) {
        this._aCell[g] = [];
        for (var b = 0; b < f; b++) this._aCell[g][b] = new CCell(d + b * h, d + g * h, null, g, b, this._oBoardContainer, this._oPiecesContainer, this._oKnightContainer)
    }
};
CGameSingle.prototype._movePiece = function(f, h) {
    var d = this._aCell[f][h];
    this._oCellActive.move(d);
    null !== d.getColor() && d.eatUp()
};
CGameSingle.prototype.onFinishMove = function() {
    this.setPieceDepth();
    var f = s_oBoardStateController.checkPromotion(this._aCell);
    null === f ? this.changeTurn() : s_iGameType === MODE_HUMAN ? new CPromoPanel(this._iCurPlayer, f) : this._iCurPlayer === BLACK ? (this.changePiece(QUEEN, f), this.changeTurn()) : new CPromoPanel(this._iCurPlayer, f)
};
CGameSingle.prototype.changeTurn = function() {
    null !== this._oMessage && this._oMessage.removeAnimated();
    this._bCheck = !1;
    this._iPlayerState = PLAYER_STATE_WAIT;
    if (this._iCurPlayer === WHITE) {
        this._iCurPlayer = BLACK;
        var f = this.checkGameState();
        s_iGameType === MODE_COMPUTER && this._playAI(f)
    } else this._iCurPlayer = WHITE, this.checkGameState();
    this._oInterface.activePlayer(this._iCurPlayer)
};
CGameSingle.prototype.onExitPromoPanel = function() {
    this.changeTurn()
};
CGameSingle.prototype.unload = function() {
    this._bStartGame = !1;
    this._oInterface.unload();
    null !== this._oEndPanel && this._oEndPanel.unload();
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren()
};
CGameSingle.prototype.onExit = function() {
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad");
    s_oGame.unload();
    s_oMain.gotoMenu()
};
CGameSingle.prototype.setEndPanel = function(f) {
    this._oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite("msg_box"));
    this._oEndPanel.setRestartBut(s_oGame.restartGame, s_oGame);
    this._oEndPanel.setCheckBut(s_oGame.checkBoard, s_oGame);
    this._oEndPanel.setHomeBut(s_oGame.onExit, s_oGame);
    setTimeout(function() {
        s_oGame._oEndPanel.show(f, s_oGame._iBlackTime, s_oGame._iWhiteTime, s_oGame._iBlackScore, s_oGame._iWhiteScore);
        s_oGame._oInterface.setInfoVisible(!1)
    }, 1E3)
};

function CGameMulti(f) {
    this._oRemotePromoMove = this._oCurMoveToSend = null;
    CGameBase.call(this, f);
    this._startGame()
}
CGameMulti.prototype = Object.create(CGameBase.prototype);
CGameMulti.prototype._startGame = function() {
    this._oInterface.configureInfoPanel(s_oNetworkManager.isUserA());
    s_oNetworkManager.isUserA() ? s_oInterface.setPlayersInfo(s_oNetworkManager.getPlayerNickname(), s_oNetworkManager.getEnemyNickname()) : (this._oThinking.show(), this._oBoard.rotation = 180, s_oInterface.setPlayersInfo(s_oNetworkManager.getEnemyNickname(), s_oNetworkManager.getPlayerNickname()));
    this._setBoard();
    this._initBoard();
    this.setPieceDepth();
    new CMovesController(this._aCell);
    new CMovesControllerFaster(this._aCell);
    new CBoardStateController;
    this._oInterface.activePlayer(this._iCurPlayer);
    s_oNetworkManager.addEventListener(ON_DISCONNECTION, this.playerDisconnectedFromGame)
};
CGameMulti.prototype._setBoard = function() {
    var f = BOARD_LENGTH,
        h = NUM_CELL,
        d = CELL_LENGTH,
        g = -f / 2 + d / 2;
    this._aCell = [];
    if (s_oNetworkManager.isUserA())
        for (f = 0; f < h; f++) {
            this._aCell[f] = [];
            for (var b = 0; b < h; b++) {
                var a = g + b * d,
                    c = g + f * d;
                this._aCell[f][b] = new CCell(a, c, null, f, b, this._oBoardContainer, this._oPiecesContainer, this._oKnightContainer)
            }
        } else
            for (g = f / 2 - d / 2, f = 0; f < h; f++)
                for (this._aCell[f] = [], b = 0; b < h; b++) a = g - b * d, c = g - f * d, this._aCell[f][b] = new CCell(a, c, null, f, b, this._oBoardContainer, this._oPiecesContainer, this._oKnightContainer)
};
CGameMulti.prototype.changeTurn = function() {
    null !== this._oMessage && this._oMessage.removeAnimated();
    this._bCheck = !1;
    this._iPlayerState = PLAYER_STATE_WAIT;
    this._oCurMoveToSend = this._oRemotePromoMove = null;
    this._iCurPlayer === WHITE ? (this._iCurPlayer = BLACK, s_oNetworkManager.isUserA() ? this._oThinking.show() : this._oThinking.hide()) : (this._iCurPlayer = WHITE, s_oNetworkManager.isUserA() ? this._oThinking.hide() : this._oThinking.show());
    this._disableAllHighlight();
    this.checkGameState();
    this._oInterface.activePlayer(this._iCurPlayer)
};
CGameMulti.prototype._movePiece = function(f, h) {
    var d = this._oCellActive.getType(),
        g = this._aCell[f][h];
    this._oCurMoveToSend = {
        sourcerow: this._oCellActive.getLogicPos().row,
        sourcecol: this._oCellActive.getLogicPos().col,
        destrow: f,
        destcol: h
    };
    this._oCellActive.move(g);
    null !== g.getColor() && g.eatUp();
    g = !1;
    0 !== f && 7 !== f || d !== PAWN || (g = !0);
    g || (d = {}, d[MSG_MOVE] = this._oCurMoveToSend, s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(d)))
};
CGameMulti.prototype.remoteMovePiece = function(f) {
    var h = f.sourcerow,
        d = f.sourcecol,
        g = {
            row: f.destrow,
            col: f.destcol
        };
    f.promo_piece_type && (this._oRemotePromoMove = {
        cell: g,
        type: f.promo_piece_type
    });
    switch (s_oBoardStateController.getSpecialMoves(h, d, g.row, g.col, this._aCell)) {
        case BOARD_SPECIAL_CASTLING_RIGHT:
            f = this._aCell[h][5];
            this._aCell[h][7].shift(f);
            break;
        case BOARD_SPECIAL_CASTLING_LEFT:
            var b = this._aCell[h][0];
            f = this._aCell[h][3];
            b.shift(f);
            break;
        case BOARD_SPECIAL_ENPASSANT:
            f = this._aCell[h][g.col],
                f.eatUp(), f.setPiece(null)
    }
    f = this._aCell[g.row][g.col];
    this._aCell[h][d].move(f);
    null !== f.getColor() && f.eatUp()
};
CGameMulti.prototype.onFinishMove = function() {
    null !== this._oRemotePromoMove && this.changePiece(this._oRemotePromoMove.type, this._oRemotePromoMove.cell);
    this.setPieceDepth();
    var f = s_oBoardStateController.checkPromotion(this._aCell);
    null === f ? this.changeTurn() : s_iGameType === MODE_HUMAN ? new CPromoPanel(this._iCurPlayer, f) : this._iCurPlayer === BLACK ? (this.changePiece(QUEEN, f), this.changeTurn()) : new CPromoPanel(this._iCurPlayer, f)
};
CGameMulti.prototype.onExitPromoPanel = function(f) {
    this._oCurMoveToSend.promo_piece_type = f;
    trace(this._oCurMoveToSend);
    f = {};
    f[MSG_MOVE] = this._oCurMoveToSend;
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(f));
    this.changeTurn()
};
CGameMulti.prototype.unload = function() {
    this._bStartGame = !1;
    this._oInterface.unload();
    null !== this._oEndPanel && this._oEndPanel.unload();
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren();
    s_oNetworkManager.addEventListener(ON_DISCONNECTION, function() {})
};
CGameMulti.prototype.onExit = function() {
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad");
    s_oGame.unload();
    s_oMain.gotoMenu();
    s_oNetworkManager.disconnect()
};
CGameMulti.prototype.checkBoard = function() {
    var f = new createjs.Shape;
    f.graphics.beginFill("rgba(0,0,0,0.4)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    f.on("click", s_oGame.returnToEndPanel, s_oGame, !0, f);
    s_oStage.addChild(f);
    this._oEndPanel.hide()
};
CGameMulti.prototype.returnToEndPanel = function(f, h) {
    s_oStage.removeChild(h);
    this._oEndPanel.reShow()
};
CGameMulti.prototype.setEndPanel = function(f) {
    var h = !1;
    f === WHITE ? s_oNetworkManager.isUserA() && (h = !0) : s_oNetworkManager.isUserA() || (h = !0);
    s_oNetworkManager.sendMsg(MSG_END_MATCH, h);
    this._oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite("msg_box"));
    s_oGame._oEndPanel.show(f, s_oGame._iBlackTime, s_oGame._iWhiteTime, s_oGame._iBlackScore, s_oGame._iWhiteScore);
    s_oGame._oInterface.setInfoVisible(!1)
};
CGameMulti.prototype.showRematchQuestion = function() {
    this._oEndPanel.setRestartBut(s_oGame._onConfirmRematch, s_oGame);
    this._oEndPanel.setCheckBut(s_oGame.checkBoard, s_oGame);
    this._oEndPanel.setHomeBut(s_oGame.onExit, s_oGame)
};
CGameMulti.prototype._onConfirmRematch = function() {
    this._oEndPanel.unload();
    this._oEndPanel = new CMsgBox(TEXT_WAIT_OPPONENT);
    s_oNetworkManager.sendMsg(MSG_ACCEPT_REMATCH, "")
};
CGameMulti.prototype.onOpponentRefuseRematch = function() {
    this._oEndPanel.unload();
    this._oEndPanel = new CMsgBox(TEXT_OPPONENT_LEFT);
    this._oEndPanel.addButton(s_oSpriteLibrary.getSprite("but_home"), ON_MOUSE_UP, this.onExit, this);
    this._oEndPanel.addButton(s_oSpriteLibrary.getSprite("but_show"), ON_MOUSE_UP, this.checkBoard, this)
};
CGameMulti.prototype.onOpponentAcceptRematch = function() {
    s_oNetworkManager.isUserA() || this._oThinking.show();
    s_oGame.restartGame()
};
CGameMulti.prototype.playerDisconnectedFromGame = function() {
    this._oEndPanel && this._oEndPanel.unload();
    this._oEndPanel = new CMsgBox(TEXT_OPPONENT_LEFT);
    this._oEndPanel.addButton(s_oSpriteLibrary.getSprite("but_yes"), ON_MOUSE_UP, this.onExit, this);
    s_oNetworkManager.sendMsg(MSG_DISCONNECTION, "")
};
CGameMulti.prototype.opponentLeftTheGame = function() {
    this._oEndPanel = new CMsgBox(TEXT_OPPONENT_LEFT);
    this._oEndPanel.addButton(s_oSpriteLibrary.getSprite("but_yes"), ON_MOUSE_UP, this.onExit, this);
    s_oNetworkManager.isUserA() ? this._oEndPanel.setExplMsg(sprintf(TEXT_WINS, WHITE)) : this._oEndPanel.setExplMsg(sprintf(TEXT_WINS, BLACK))
};
var CGameSingleWithBot = function(f) {
    CGameSingle.call(this, f)
};
CGameSingleWithBot.prototype = Object.create(CGameSingle.prototype);
CGameSingleWithBot.prototype._startGame = function() {
    this._oInterface.configureInfoPanel(!0);
    this._setBoard();
    this._initBoard();
    this.setPieceDepth();
    new CMovesController(this._aCell);
    new CMovesControllerFaster(this._aCell);
    new CBoardStateController;
    this._oInterface.activePlayer(this._iCurPlayer);
    this._oAI = new CAI;
    s_oInterface.setPlayersInfo(s_oNetworkManager.getPlayerNickname(), s_oNetworkManager.getBotName())
};
CGameSingleWithBot.prototype._playAI = function(f) {
    if (!f) {
        s_oGame._oThinking.show();
        f = MIN_AI_THINKING + 1E3;
        f += Math.random() * (MAX_AI_THINKING + 1E3 - f);
        var h = this._oAI.getMove();
        null !== h && setTimeout(function() {
            s_oGame._oThinking.hide();
            s_oGame.cellClicked(h.sourcerow, h.sourcecol);
            s_oGame.cellClicked(h.destrow, h.destcol)
        }, f)
    }
};
CGameSingleWithBot.prototype.setEndPanel = function(f) {
    this._oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite("msg_box"));
    s_oGame._oEndPanel.show(f, s_oGame._iBlackTime, s_oGame._iWhiteTime, s_oGame._iBlackScore, s_oGame._iWhiteScore);
    s_oGame._oInterface.setInfoVisible(!1);
    this._oEndPanel.setRestartBut(s_oGame._onConfirmRematch, s_oGame);
    this._oEndPanel.setCheckBut(s_oGame.checkBoard, s_oGame);
    this._oEndPanel.setHomeBut(s_oGame.onExit, s_oGame)
};
CGameSingleWithBot.prototype._onConfirmRematch = function() {
    this._oEndPanel.unload();
    this._oEndPanel = new CMsgBox(TEXT_WAIT_OPPONENT);
    var f = randomFloatBetween(200, 2E3);
    if (.33 < Math.random()) .4 < Math.random() ? setTimeout(function() {
        s_oGame._rematch()
    }, f) : s_oGame._rematch();
    else if (.4 < Math.random()) setTimeout(function() {
        s_oGame.onBotRefuseRematch()
    }, f);
    else s_oGame.onBotRefuseRematch()
};
CGameSingleWithBot.prototype.onBotRefuseRematch = function() {
    this._oEndPanel.unload();
    this._oEndPanel = new CMsgBox(TEXT_OPPONENT_LEFT);
    this._oEndPanel.addButton(s_oSpriteLibrary.getSprite("but_yes"), ON_MOUSE_UP, this.onExit, this)
};
CGameSingleWithBot.prototype._rematch = function() {
    s_oGame.restartGame()
};

function CInterface(f) {
    var h, d, g, b, a, c, e, k, l, m, n, p, q = null,
        u = null;
    this._init = function(t) {
        var r = s_oSpriteLibrary.getSprite("but_exit");
        g = CANVAS_WIDTH - r.height / 2 - 10;
        b = r.height / 2 + 25;
        e = new CGfxButton(g, b, r, s_oStage);
        e.addEventListener(ON_MOUSE_UP, this._onExit, this);
        t = CANVAS_WIDTH - r.width / 2 - 125;
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) r = s_oSpriteLibrary.getSprite("audio_icon"), h = t, d = 25 + r.height / 2, k = new CToggle(h, d, r, s_bAudioActive, s_oStage), k.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        t =
            window.document;
        r = t.documentElement;
        q = r.requestFullscreen || r.mozRequestFullScreen || r.webkitRequestFullScreen || r.msRequestFullscreen;
        u = t.exitFullscreen || t.mozCancelFullScreen || t.webkitExitFullscreen || t.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (q = !1);
        q && screenfull.isEnabled && (r = s_oSpriteLibrary.getSprite("but_fullscreen"), a = r.width / 4 + 10, c = r.height / 2 + 25, n = new CToggle(a, c, r, s_bFullscreen, s_oStage), n.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        r = s_oSpriteLibrary.getSprite("but_settings");
        p = new CGUIExpandible(g, b, r, s_oStage);
        p.addButton(e);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || p.addButton(k);
        q && screenfull.isEnabled && p.addButton(n);
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
    };
    this.unload = function() {
        e.unload();
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || k.unload();
        m.unload();
        l.unload();
        q && screenfull.isEnabled && n.unload();
        s_oInterface = null
    };
    this.refreshButtonPos = function(t, r) {
        p.refreshPos(t, r);
        s_oGame && s_oGame.refreshSize()
    };
    this.refreshWhiteTime = function(t) {
        50 < t && l.refreshTime(formatTime(t))
    };
    this.refreshBlackTime = function(t) {
        50 < t && m.refreshTime(formatTime(t))
    };
    this.refreshWhiteScore = function(t) {
        l.refreshScore(t)
    };
    this.refreshBlackScore = function(t) {
        m.refreshScore(t)
    };
    this.activePlayer = function(t) {
        t === WHITE ? (m.active(!1), l.active(!0)) : (l.active(!1), m.active(!0))
    };
    this.resetInfo = function() {
        l.refreshTime(formatTime(0));
        m.refreshTime(formatTime(0));
        l.refreshScore(START_SCORE);
        m.refreshScore(START_SCORE)
    };
    this.setInfoVisible = function(t) {
        l.setPanelVisible(t);
        m.setPanelVisible(t)
    };
    this.setPlayersInfo =
        function(t, r) {
            l.setName(t);
            m.setName(r)
        };
    this._onButConfigRelease = function() {
        new CConfigPanel
    };
    this._onButRestartRelease = function() {
        s_oGame.restartGame()
    };
    this.onExitFromHelp = function() {
        null.unload()
    };
    this._onExit = function() {
        new CAreYouSurePanel(s_oGame.onExit)
    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this.resetFullscreenBut = function() {
        q && screenfull.isEnabled && n.setActive(s_bFullscreen)
    };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? u.call(window.document) :
            q.call(window.document.documentElement);
        sizeHandler()
    };
    this.configureInfoPanel = function(t) {
        var r = {
                x: 220,
                y: 536
            },
            x = {
                x: s_iGameType === MODE_HUMAN && s_bMobile ? -220 : -240,
                y: -536
            };
        t ? (t = r, r = x) : t = x;
        l = new CInfoTurn(t.x, t.y, WHITE, f);
        m = new CInfoTurn(r.x, r.y, BLACK, f)
    };
    s_oInterface = this;
    this._init(f);
    return this
}
var s_oInterface = null;

function CInfoTurn(f, h, d, g) {
    var b, a, c, e, k, l, m;
    this._init = function(n, p, q, u) {
        b = new createjs.Container;
        b.x = n;
        b.y = p;
        s_iGameType === MODE_HUMAN && q === BLACK && s_bMobile && !s_bMultiplayer && (b.rotation = 180);
        u.addChild(b);
        l = new createjs.Container;
        n = -324;
        p = 30;
        q === WHITE ? (l.x = n, l.y = -p) : (l.x = -n + 20, s_iGameType === MODE_HUMAN && q === BLACK && s_bMobile && !s_bMultiplayer ? (l.x = n, l.y = -p) : l.y = p);
        b.addChild(l);
        if (!SHOW_SCORE || s_iGameType === MODE_COMPUTER && q === BLACK || s_bMultiplayer) l.visible = !1;
        n = s_oSpriteLibrary.getSprite("score_panel");
        p = createBitmap(n);
        p.regX = n.width / 2;
        p.regY = n.height / 2;
        l.addChild(p);
        m = new createjs.Text(START_SCORE, " 30px " + PRIMARY_FONT, "#ffffff");
        m.x = 90;
        m.textAlign = "right";
        m.textBaseline = "middle";
        m.lineWidth = 200;
        l.addChild(m);
        n = s_oSpriteLibrary.getSprite("bg_turn");
        p = new createjs.SpriteSheet({
            images: [n],
            framerate: 58,
            frames: {
                width: n.width / 2,
                height: n.height,
                regX: n.width / 2 / 2,
                regY: n.height / 2
            },
            animations: {
                off: [0, 0, "on"],
                on: [1, 1, "off"]
            }
        });
        a = createSprite(p, 0, n.width / 2 / 2, n.height / 2, n.width / 2, n.height);
        a.stop();
        b.addChild(a);
        c = createSprite(p, 1, n.width / 2 / 2, n.height / 2, n.width / 2, n.height);
        c.stop();
        c.x = 10;
        c.alpha = 0;
        b.addChild(c);
        n = s_oSpriteLibrary.getSprite(q + "_king_marker");
        k = createBitmap(n);
        k.x = 160;
        k.regX = n.width / 2;
        k.regY = n.height / 2;
        b.addChild(k);
        e = new createjs.Text("00:00", " 58px " + PRIMARY_FONT, "#ffffff");
        e.x = -65;
        e.y = 2;
        e.textBaseline = "middle";
        e.lineWidth = 200;
        b.addChild(e)
    };
    this.refreshTime = function(n) {
        e.text = n
    };
    this.refreshScore = function(n) {
        m.text = n
    };
    this.invert = function() {
        e.x = 0;
        k.x = -100
    };
    this.active = function(n) {
        n ? (createjs.Tween.get(a, {
            loop: !0
        }).to({
            alpha: 0
        }, 750, createjs.Ease.cubicOut).to({
            alpha: 1
        }, 750, createjs.Ease.cubicIn), createjs.Tween.get(c, {
            loop: !0
        }).to({
            alpha: 1
        }, 750, createjs.Ease.cubicOut).to({
            alpha: 0
        }, 750, createjs.Ease.cubicIn)) : (a.alpha = 1, c.alpha = 0, createjs.Tween.removeTweens(a), createjs.Tween.removeTweens(c))
    };
    this.unload = function() {
        g.removeChild(b)
    };
    this.setBgVisible = function(n) {
        a.visible = n;
        l.visible = n
    };
    this.setPanelVisible = function(n) {
        b.visible = n
    };
    this.setName = function(n) {
        var p = "left",
            q = a.getBounds().width / 2 + 200;
        0 <
            b.y && (q = -a.getBounds().width / 2 - 190, p = "right");
        new CTLText(b, q - 190, -30, 380, 60, 50, p, "#fff", PRIMARY_FONT, 1, 2, 2, n, !0, !0, !1, !1)
    };
    this.setPawn = function(n) {
        k.gotoAndStop(n)
    };
    this._init(f, h, d, g)
}

function CThinking() {
    var f, h, d, g, b, a, c;
    this._init = function() {
        f = !0;
        h = 0;
        d = new createjs.Container;
        var e = (new createjs.Graphics).beginFill("rgba(0,0,0,0.3)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        a = new createjs.Shape(e);
        c = a.on("click", function() {});
        g = new createjs.Text(TEXT_THINKING, "bold 60px " + PRIMARY_FONT, "#ffffff");
        g.x = .5 * CANVAS_WIDTH;
        g.y = .5 * CANVAS_HEIGHT - 100;
        g.textAlign = "center";
        g.textBaseline = "alphabetic";
        g.lineWidth = 800;
        b = new createjs.Text("", "bold 180px " + PRIMARY_FONT, "#ffffff");
        b.x = .5 * CANVAS_WIDTH -
            76;
        b.y = .5 * CANVAS_HEIGHT - 50;
        b.textAlign = "left";
        b.textBaseline = "alphabetic";
        b.lineWidth = 800;
        d.addChild(a, g, b);
        s_oStage.addChild(d);
        this.hide()
    };
    this.unload = function() {
        f = !1;
        a.off("click", c);
        s_oStage.removeChild(d)
    };
    this.isShown = function() {
        return d.visible
    };
    this.show = function() {
        d.visible = !0
    };
    this.hide = function() {
        d.visible = !1
    };
    this.update = function() {
        f && (h += s_iTimeElaps, 0 <= h && h < TIME_LOOP_WAIT / 4 ? b.text = "" : h >= TIME_LOOP_WAIT / 4 && h < 2 * TIME_LOOP_WAIT / 4 ? b.text = "." : h >= 2 * TIME_LOOP_WAIT / 4 && h < 3 * TIME_LOOP_WAIT / 4 ? b.text =
            ".." : h >= 3 * TIME_LOOP_WAIT / 4 && h < TIME_LOOP_WAIT ? b.text = "..." : h = 0)
    };
    this._init()
}

function CEndPanel(f) {
    var h, d, g, b, a, c, e, k, l, m, n;
    this._init = function(p) {
        s_oGame.pauseGame(!0);
        d = new createjs.Container;
        d.alpha = 0;
        d.visible = !1;
        s_oStage.addChild(d);
        e = new createjs.Shape;
        e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        e.alpha = .7;
        d.addChild(e);
        h = createBitmap(p);
        h.regX = p.width / 2;
        h.regY = p.height / 2;
        h.x = CANVAS_WIDTH / 2;
        h.y = CANVAS_HEIGHT / 2;
        d.addChild(h);
        var q = p.width - 120,
            u = 100,
            t = CANVAS_WIDTH / 2,
            r = CANVAS_HEIGHT / 2 - 300;
        a = new CTLText(d, t - q / 2, r - u / 2, q, u, 90, "center", "#ffffff",
            PRIMARY_FONT, 1, 2, 2, "", !0, !0, !1, !1);
        q = p.width - 320;
        u = 50;
        t = CANVAS_WIDTH / 2;
        r = CANVAS_HEIGHT / 2 - 230;
        c = new CTLText(d, t - q / 2, r - u / 2, q, u, 40, "center", "#ffffff", PRIMARY_FONT, 1, 2, 2, "", !0, !0, !1, !1);
        g = new CInfoTurn(CANVAS_WIDTH / 2, 1E3, BLACK, d);
        g.setBgVisible(!1);
        g.invert();
        b = new CInfoTurn(CANVAS_WIDTH / 2, 850, WHITE, d);
        b.setBgVisible(!1);
        b.invert()
    };
    this.unload = function() {
        s_oStage.removeChild(d);
        d.off("mousedown", n);
        m.unload();
        k.unload();
        l.unload();
        g.unload();
        b.unload();
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad")
    };
    this._initListener = function() {
        n = d.on("mousedown", this._onExit)
    };
    this.setRestartBut = function(p, q) {
        var u = s_oSpriteLibrary.getSprite("but_restart");
        m = new CGfxButton(CANVAS_WIDTH / 2 - 180, CANVAS_HEIGHT / 2 + 250, u, d);
        m.addEventListener(ON_MOUSE_UP, p, q)
    };
    this.setHomeBut = function(p, q) {
        var u = s_oSpriteLibrary.getSprite("but_home");
        k = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 250, u, d);
        k.addEventListener(ON_MOUSE_UP, p, q)
    };
    this.setCheckBut = function(p, q) {
        var u = s_oSpriteLibrary.getSprite("but_show");
        l = new CGfxButton(CANVAS_WIDTH /
            2 + 180, CANVAS_HEIGHT / 2 + 250, u, d);
        l.addEventListener(ON_MOUSE_UP, p, q)
    };
    this.show = function(p, q, u, t, r) {
        g.refreshTime(formatTime(q));
        b.refreshTime(formatTime(u));
        p === WHITE ? (playSound("win", 1, !1), a.refreshText(TEXT_CHECKMATE), c.refreshText(sprintf(TEXT_WINS, TEXT_WHITE))) : p === BLACK ? (s_iGameType === MODE_HUMAN ? playSound("win", 1, !1) : playSound("game_over", 1, !1), a.refreshText(TEXT_CHECKMATE), c.refreshText(sprintf(TEXT_WINS, TEXT_BLACK))) : p === DRAW && (playSound("game_over", 1, !1), a.refreshText(TEXT_STALEMATE), c.refreshText(TEXT_DRAW));
        d.visible = !0;
        createjs.Tween.get(d).to({
            alpha: 1
        }, 500);
        $(s_oMain).trigger("save_score", [p, q, u, s_iGameType, r, t]);
        $(s_oMain).trigger("share_event", [r, s_iGameType, p])
    };
    this.hide = function() {
        d.visible = !1;
        $(s_oMain).trigger("end_session")
    };
    this.reShow = function() {
        d.visible = !0
    };
    this._init(f);
    return this
}

function CCell(f, h, d, g, b, a, c, e) {
    var k, l, m, n, p, q, u, t;
    this._init = function(r, x, D, w, E, F, B, C) {
        k = w;
        l = E;
        m = new createjs.Container;
        m.x = r;
        m.y = x;
        F.addChild(m);
        n = null;
        r = s_oSpriteLibrary.getSprite("highlight");
        u = createBitmap(r);
        u.regX = r.width / 2;
        u.regY = r.height / 2;
        u.alpha = .8;
        u.visible = !1;
        m.addChild(u);
        r = s_oSpriteLibrary.getSprite("threat");
        q = createBitmap(r);
        q.regX = r.width / 2;
        q.regY = r.height / 2;
        q.visible = !1;
        m.addChild(q);
        p = new createjs.Shape;
        p.graphics.beginFill("rgba(158,0,0,0.01)").drawRect(-CELL_LENGTH / 2, -CELL_LENGTH /
            2, CELL_LENGTH, CELL_LENGTH);
        t = p.on("mousedown", this._onCellClick);
        m.addChild(p)
    };
    this.unload = function() {
        a.removeChild(m);
        p.off("mousedown", t)
    };
    this.removePiece = function() {
        n && n.unload();
        n = null
    };
    this.setClickableArea = function(r) {
        p.visible = r
    };
    this.changePiece = function(r, x) {
        var D = n.getHistory();
        n.unload();
        n = new CPiece(f, h, r, x, c, e);
        n.setHistory(D);
        n.setNewMoveInHistory(s_oGame.getNewHistoryID(), g, b, x)
    };
    this.createPiece = function(r, x, D) {
        n = new CPiece(f, h, x, D, c, e);
        n.setNewMoveInHistory(r, g, b, D)
    };
    this.getPieceContainer =
        function() {
            return n.getContainer()
        };
    this.setPiece = function(r) {
        n = r
    };
    this.getType = function() {
        return null !== n ? n.getType() : null
    };
    this.getColor = function() {
        return null !== n ? n.getColor() : null
    };
    this.getPieceHistory = function() {
        return null !== n ? n.getHistory() : []
    };
    this.threat = function(r) {
        q.visible = r
    };
    this.highlight = function(r) {
        u.visible = r
    };
    this.isHighlight = function() {
        return u.visible
    };
    this._onCellClick = function() {
        s_oGame.cellClicked(k, l)
    };
    this.setActive = function(r) {
        null !== n && n.setActive(r)
    };
    this.setVisible = function(r) {
        m.visible =
            r
    };
    this.getPos = function() {
        return {
            x: f,
            y: h
        }
    };
    this.getLogicPos = function() {
        return {
            row: g,
            col: b
        }
    };
    this.move = function(r) {
        n.move(r);
        n = null
    };
    this.shift = function(r) {
        n.shift(r);
        n = null
    };
    this.eatUp = function() {
        n.disappear()
    };
    this._init(f, h, d, g, b, a, c, e)
}

function CPiece(f, h, d, g, b, a) {
    var c, e, k, l;
    this._init = function(n, p, q, u, t, r) {
        c = q;
        e = u;
        k = [];
        q = this._getSpriteName();
        q = s_oSpriteLibrary.getSprite(q);
        u = q.width / 2;
        r = q.height;
        q = new createjs.SpriteSheet({
            images: [q],
            frames: {
                width: u,
                height: r,
                regX: u / 2,
                regY: r - 40
            },
            animations: {
                idle: [0],
                lit: [1]
            }
        });
        l = createSprite(q, "idle", 0, 0, 0, 0);
        l.x = n;
        l.y = p;
        t.addChild(l)
    };
    this.unload = function() {
        b.removeChild(l)
    };
    this._getSpriteName = function() {
        var n = d === WHITE ? "white" : "black";
        switch (g) {
            case PAWN:
                var p = "pawn";
                break;
            case ROOK:
                p = "rook";
                break;
            case KNIGHT:
                p = "knight";
                break;
            case BISHOP:
                p = "bishop";
                break;
            case QUEEN:
                p = "queen";
                break;
            case KING:
                p = "king"
        }
        return n + "_" + p
    };
    this.getContainer = function() {
        return l
    };
    this.getType = function() {
        return e
    };
    this.getColor = function() {
        return c
    };
    this.setPos = function(n, p) {
        l.x = n;
        l.y = p
    };
    this.getPos = function() {
        return {
            x: l.x,
            y: l.y
        }
    };
    this.setNewMoveInHistory = function(n, p, q, u) {
        k.push({
            id: n,
            row: p,
            col: q,
            piece: u
        })
    };
    this.setHistory = function(n) {
        k = [];
        for (var p = 0; p < n.length; p++) k[p] = n[p]
    };
    this.getHistory = function() {
        return k
    };
    this.setActive = function(n) {
        n ? l.gotoAndStop("lit") : l.gotoAndStop("idle")
    };
    this.move = function(n) {
        var p = n.getPos();
        e === KNIGHT ? (a.addChild(l), (new createjs.Tween.get(l)).to({
            scaleX: 1.3,
            scaleY: 1.3
        }, .4 * TIME_MOVE, createjs.Ease.cubicOut).to({
            scaleX: 1,
            scaleY: 1
        }, 600)) : e === PAWN && s_oBoardStateController.resetStall();
        (new createjs.Tween.get(l)).to({
            x: p.x,
            y: p.y
        }, TIME_MOVE, createjs.Ease.cubicOut).call(function() {
            s_oBoardStateController.increaseStallCount();
            e === KNIGHT && b.addChild(l);
            n.setPiece(m);
            m.setNewMoveInHistory(s_oGame.getNewHistoryID(),
                n.getLogicPos().row, n.getLogicPos().col, e);
            s_oGame.onFinishMove()
        })
    };
    this.shift = function(n) {
        var p = n.getPos();
        (new createjs.Tween.get(l)).to({
            x: p.x,
            y: p.y
        }, 1E3, createjs.Ease.cubicOut).call(function() {
            n.setPiece(m);
            m.setNewMoveInHistory(s_oGame.getNewHistoryID(), n.getLogicPos().row, n.getLogicPos().col, e)
        })
    };
    this.disappear = function() {
        (new createjs.Tween.get(l)).to({
            alpha: 0
        }, 1E3).call(function() {
            s_oBoardStateController.resetStall();
            m.unload()
        })
    };
    var m = this;
    this._init(f, h, d, g, b, a)
}
var DIR_TOPRIGHT = "DIR_TOPRIGHT",
    DIR_RIGHT = "DIR_RIGHT",
    DIR_BOTRIGHT = "DIR_BOTRIGHT",
    DIR_TOPLEFT = "DIR_TOPLEFT",
    DIR_LEFT = "DIR_LEFT",
    DIR_BOTLEFT = "DIR_BOTLEFT",
    DIR_TOP = "DIR_TOP",
    DIR_BOT = "DIR_BOT";

function CMovesController(f) {
    var h, d, g, b;
    this._init = function(a) {
        h = a.length;
        d = a[0].length;
        b = [];
        g = [];
        for (a = 0; a < h; a++) {
            g[a] = [];
            for (var c = 0; c < d; c++) g[a][c] = []
        }
        this._buildMap()
    };
    this._buildMap = function() {
        for (var a = 0; a < h; a++)
            for (var c = 0; c < d; c++) g[a][c][DIR_TOPRIGHT] = this._setNeighbor(a, c, DIR_TOPRIGHT), g[a][c][DIR_RIGHT] = this._setNeighbor(a, c, DIR_RIGHT), g[a][c][DIR_BOTRIGHT] = this._setNeighbor(a, c, DIR_BOTRIGHT), g[a][c][DIR_TOPLEFT] = this._setNeighbor(a, c, DIR_TOPLEFT), g[a][c][DIR_LEFT] = this._setNeighbor(a,
                c, DIR_LEFT), g[a][c][DIR_BOTLEFT] = this._setNeighbor(a, c, DIR_BOTLEFT), g[a][c][DIR_TOP] = this._setNeighbor(a, c, DIR_TOP), g[a][c][DIR_BOT] = this._setNeighbor(a, c, DIR_BOT)
    };
    this._setNeighbor = function(a, c, e) {
        var k = null;
        switch (e) {
            case DIR_TOPRIGHT:
                0 < a && c < d - 1 && (k = {
                    row: a - 1,
                    col: c + 1
                });
                break;
            case DIR_RIGHT:
                c < d - 1 && (k = {
                    row: a,
                    col: c + 1
                });
                break;
            case DIR_BOTRIGHT:
                a < h - 1 && c < d - 1 && (k = {
                    row: a + 1,
                    col: c + 1
                });
                break;
            case DIR_TOPLEFT:
                0 < a && 0 < c && (k = {
                    row: a - 1,
                    col: c - 1
                });
                break;
            case DIR_LEFT:
                0 < c && (k = {
                    row: a,
                    col: c - 1
                });
                break;
            case DIR_BOTLEFT:
                a <
                    h - 1 && 0 < c && (k = {
                        row: a + 1,
                        col: c - 1
                    });
                break;
            case DIR_TOP:
                0 < a && (k = {
                    row: a - 1,
                    col: c
                });
                break;
            case DIR_BOT:
                a < h - 1 && (k = {
                    row: a + 1,
                    col: c
                })
        }
        return k
    };
    this._getNeighborByDir = function(a, c, e) {
        return g[a][c][e]
    };
    this._getAllNeighbor = function(a, c) {
        var e = [],
            k;
        for (k in g[a][c]) null !== g[a][c][k] && e.push(g[a][c][k]);
        return e
    };
    this._getMainDiagonal = function(a, c, e) {
        var k = [],
            l = e[a][c].getColor();
        this._findInDirection(a, c, DIR_BOTRIGHT, k, 99, l, e);
        this._findInDirection(a, c, DIR_TOPLEFT, k, 99, l, e);
        return k
    };
    this._getSecondDiagonal = function(a,
        c, e) {
        var k = [],
            l = e[a][c].getColor();
        this._findInDirection(a, c, DIR_BOTLEFT, k, 99, l, e);
        this._findInDirection(a, c, DIR_TOPRIGHT, k, 99, l, e);
        return k
    };
    this._getRow = function(a, c, e) {
        var k = [],
            l = e[a][c].getColor();
        this._findInDirection(a, c, DIR_LEFT, k, 99, l, e);
        this._findInDirection(a, c, DIR_RIGHT, k, 99, l, e);
        return k
    };
    this._getCol = function(a, c, e) {
        var k = [],
            l = e[a][c].getColor();
        this._findInDirection(a, c, DIR_TOP, k, 99, l, e);
        this._findInDirection(a, c, DIR_BOT, k, 99, l, e);
        return k
    };
    this._getStraightByDirAndRadius = function(a,
        c, e, k, l) {
        var m = [];
        b = [];
        b.push({
            radius: k,
            direction: null
        });
        var n = l[a][c].getColor();
        this._findInDirection(a, c, e, m, k, n, l);
        return m
    };
    this._getStraightRowByRadius = function(a, c, e) {
        var k = [];
        b = [];
        b.push({
            radius: e,
            direction: null
        });
        this._findInDirection(a, c, DIR_LEFT, k, e);
        this._findInDirection(a, c, DIR_RIGHT, k, e);
        return k
    };
    this._getStraightColByRadius = function(a, c, e) {
        var k = [];
        b = [];
        b.push({
            radius: e,
            direction: null
        });
        this._findInDirection(a, c, DIR_TOP, k, e);
        this._findInDirection(a, c, DIR_BOT, k, e);
        return k
    };
    this._findInDirection =
        function(a, c, e, k, l, m, n) {
            --l;
            if (null !== g[a][c][e] && 0 <= l) {
                var p = g[a][c][e].row;
                a = g[a][c][e].col;
                m ? (c = n[p][a].getColor(), c !== m && (null === c ? (k.push({
                    row: p,
                    col: a
                }), b.push({
                    radius: l,
                    direction: e
                }), this._findInDirection(p, a, e, k, l, m, n)) : (k.push({
                    row: p,
                    col: a
                }), b.push({
                    radius: l,
                    direction: e
                })))) : (k.push({
                    row: p,
                    col: a
                }), b.push({
                    radius: l,
                    direction: e
                }), this._findInDirection(p, a, e, k, l, m, n))
            }
        };
    this._findTPos = function(a, c, e) {
        var k = [];
        a = g[a][c][e];
        null !== a && (a = g[a.row][a.col][e], null !== a && (k = e === DIR_TOP || e === DIR_BOT ?
            this._getStraightRowByRadius(a.row, a.col, 1) : this._getStraightColByRadius(a.row, a.col, 1)));
        return k
    };
    this.getMovesList = function(a, c, e, k) {
        var l = [];
        switch (e[a][c].getType()) {
            case PAWN:
                l = this.getPawnMove(a, c, e);
                break;
            case ROOK:
                l = this.getRookMove(a, c, e);
                break;
            case KNIGHT:
                l = this.getKnightMove(a, c, e);
                break;
            case BISHOP:
                l = this.getBishopMove(a, c, e);
                break;
            case QUEEN:
                l = this.getQueenMove(a, c, e);
                break;
            case KING:
                l = k ? this.getSimpleKingMove(a, c, e) : this.getKingMove(a, c, e)
        }
        return l
    };
    this.getPawnMove = function(a, c, e) {
        var k =
            e[a][c].getColor(),
            l = [];
        if (k === WHITE) {
            var m = 6 === a ? this._getStraightByDirAndRadius(a, c, DIR_TOP, 2, e) : this._getStraightByDirAndRadius(a, c, DIR_TOP, 1, e);
            var n = this._getNeighborByDir(a, c, DIR_TOPRIGHT);
            null !== n && e[n.row][n.col].getColor() === BLACK && l.push(n);
            n = this._getNeighborByDir(a, c, DIR_TOPLEFT);
            null !== n && e[n.row][n.col].getColor() === BLACK && l.push(n);
            if (3 === a)
                for (a = this._getEnPassant(WHITE, a, c, e), c = 0; c < a.length; c++) l.push(a[c])
        } else if (m = 1 === a ? this._getStraightByDirAndRadius(a, c, DIR_BOT, 2, e) : this._getStraightByDirAndRadius(a,
                c, DIR_BOT, 1, e), n = this._getNeighborByDir(a, c, DIR_BOTRIGHT), null !== n && e[n.row][n.col].getColor() === WHITE && l.push(n), n = this._getNeighborByDir(a, c, DIR_BOTLEFT), null !== n && e[n.row][n.col].getColor() === WHITE && l.push(n), 4 === a)
            for (a = this._getEnPassant(BLACK, a, c, e), c = 0; c < a.length; c++) l.push(a[c]);
        for (c = m.length - 1; 0 <= c; c--) null !== e[m[c].row][m[c].col].getColor() && e[m[c].row][m[c].col].getColor() !== k && m.splice(c, 1);
        for (c = 0; c < l.length; c++) m.push(l[c]);
        return m
    };
    this.getRookMove = function(a, c, e) {
        var k = this._getRow(a,
            c, e);
        a = this._getCol(a, c, e);
        c = [];
        for (e = 0; e < k.length; e++) c.push(k[e]);
        for (e = 0; e < a.length; e++) c.push(a[e]);
        return c
    };
    this.getKnightMove = function(a, c, e) {
        var k = [];
        k.push(this._findTPos(a, c, DIR_TOP));
        k.push(this._findTPos(a, c, DIR_RIGHT));
        k.push(this._findTPos(a, c, DIR_BOT));
        k.push(this._findTPos(a, c, DIR_LEFT));
        for (var l = [], m = 0; m < k.length; m++)
            for (var n = 0; n < k[m].length; n++) l.push(k[m][n]);
        a = e[a][c].getColor();
        for (m = l.length - 1; 0 <= m; m--) e[l[m].row][l[m].col].getColor() === a && l.splice(m, 1);
        return l
    };
    this.getBishopMove =
        function(a, c, e) {
            var k = this._getMainDiagonal(a, c, e);
            a = this._getSecondDiagonal(a, c, e);
            c = [];
            for (e = 0; e < k.length; e++) c.push(k[e]);
            for (e = 0; e < a.length; e++) c.push(a[e]);
            return c
        };
    this.getQueenMove = function(a, c, e) {
        var k = this.getRookMove(a, c, e);
        a = this.getBishopMove(a, c, e);
        c = [];
        for (e = 0; e < k.length; e++) c.push(k[e]);
        for (e = 0; e < a.length; e++) c.push(a[e]);
        return c
    };
    this.getSimpleKingMove = function(a, c, e) {
        var k = this._getAllNeighbor(a, c);
        a = e[a][c].getColor();
        for (c = k.length - 1; 0 <= c; c--) e[k[c].row][k[c].col].getColor() ===
            a && k.splice(c, 1);
        return k
    };
    this.getKingMove = function(a, c, e) {
        var k = this._getAllNeighbor(a, c),
            l = e[a][c];
        if (1 === l.getPieceHistory().length && !s_oGame.isCheck()) {
            var m = !0;
            1 === e[a][7].getPieceHistory().length ? (null !== e[a][6].getColor() && (m = !1), null !== e[a][5].getColor() && (m = !1)) : m = !1;
            if (m) {
                m = {
                    row: a,
                    col: 6
                };
                var n = s_oBoardStateController.checkCastlingBlockFromOpponent(BOARD_SPECIAL_CASTLING_RIGHT, l.getColor(), e);
                0 === n.length && k.push(m)
            }
            m = !0;
            1 === e[a][0].getPieceHistory().length ? (null !== e[a][1].getColor() && (m = !1), null !== e[a][2].getColor() && (m = !1), null !== e[a][3].getColor() && (m = !1)) : m = !1;
            m && (m = {
                row: a,
                col: 2
            }, n = s_oBoardStateController.checkCastlingBlockFromOpponent(BOARD_SPECIAL_CASTLING_LEFT, l.getColor(), e), 0 === n.length && k.push(m))
        }
        a = e[a][c].getColor();
        for (c = k.length - 1; 0 <= c; c--) e[k[c].row][k[c].col].getColor() === a && k.splice(c, 1);
        return k
    };
    this._getEnPassant = function(a, c, e, k) {
        var l = [],
            m = s_oBoardStateController.getOtherOpponent(a),
            n = this._getNeighborByDir(c, e, DIR_RIGHT);
        null !== n && (n = k[n.row][n.col], n.getColor() ===
            m && n.getType() === PAWN && (n = n.getPieceHistory(), k[c][e].getPieceHistory(), 2 === n.length && n[1].id === s_oGame.getLastHistoryID() && (a === WHITE ? l.push(this._getNeighborByDir(c, e, DIR_TOPRIGHT)) : l.push(this._getNeighborByDir(c, e, DIR_BOTRIGHT)))));
        n = this._getNeighborByDir(c, e, DIR_LEFT);
        null !== n && (n = k[n.row][n.col], n.getColor() === m && n.getType() === PAWN && (n = n.getPieceHistory(), k[c][e].getPieceHistory(), 2 === n.length && n[1].id === s_oGame.getLastHistoryID() && (a === WHITE ? l.push(this._getNeighborByDir(c, e, DIR_TOPLEFT)) :
            l.push(this._getNeighborByDir(c, e, DIR_BOTLEFT)))));
        return l
    };
    this._init(f);
    s_oMovesController = this
}
var s_oMovesController;

function CBoardStateController() {
    var f;
    this._init = function() {
        f = 0
    };
    this.getOtherOpponent = function(h) {
        return h === WHITE ? BLACK : WHITE
    };
    this.moveCopiedPiece = function(h, d, g, b, a) {
        var c = h[d][g],
            e = h[b][a];
        switch (this.getSpecialMoves(d, g, b, a, h)) {
            case BOARD_SPECIAL_CASTLING_RIGHT:
                var k = h[d][7];
                h = h[d][5];
                h.setCell(c.getColor(), ROOK, b, a, c.getPieceHistory());
                k.setCell(null, null, d, g, []);
                break;
            case BOARD_SPECIAL_CASTLING_LEFT:
                k = h[d][0];
                h = h[d][3];
                h.setCell(c.getColor(), ROOK, b, a, c.getPieceHistory());
                k.setCell(null,
                    null, d, g, []);
                break;
            case BOARD_SPECIAL_ENPASSANT:
                h[d][a].setCell(null, null, d, a, [])
        }
        e.setCell(c.getColor(), c.getType(), b, a, c.getPieceHistory());
        c.setCell(null, null, d, g, [])
    };
    this.copyBoard = function(h) {
        for (var d = [], g = 0; g < h.length; g++) {
            d[g] = [];
            for (var b = 0; b < h[g].length; b++) d[g][b] = new CCopiedCell(h[g][b])
        }
        return d
    };
    this.getState = function(h, d) {
        if (0 !== this.findAllChecks(h, d).length) return this.findCheckMate(h, d) ? BOARD_STATE_CHECKMATE : BOARD_STATE_CHECK;
        if (this.findStaleMate(h, d)) return BOARD_STATE_STALEMATE
    };
    this.findCheckMate = function(h, d) {
        for (var g = [], b = 0; b < d.length; b++)
            for (var a = 0; a < d[b].length; a++) d[b][a].getColor() === h && g.push(d[b][a]);
        for (b = 0; b < g.length; b++) {
            var c = s_oMovesController.getMovesList(g[b].getLogicPos().row, g[b].getLogicPos().col, d);
            for (a = 0; a < c.length; a++) {
                var e = this.copyBoard(d);
                this.moveCopiedPiece(e, g[b].getLogicPos().row, g[b].getLogicPos().col, c[a].row, c[a].col);
                if (0 === this.findAllChecks(h, e).length) return !1
            }
        }
        return !0
    };
    this.findAllChecks = function(h, d) {
        var g = this.getOtherOpponent(h);
        g = this._getAllMovesList(g, d);
        for (var b = [], a = 0; a < g.length; a++)
            for (var c = 0; c < g[a].list.length; c++) {
                var e = g[a].list[c];
                d[e.row][e.col].getColor() === h && d[e.row][e.col].getType() === KING && b.push(g[a].piece)
            }
        return b
    };
    this.findStaleMate = function(h, d) {
        var g = this.findCheckMate(h, d);
        if (!g) {
            for (var b = [], a = [], c = 0; c < d.length; c++)
                for (var e = 0; e < d[c].length; e++) d[c][e].getColor() === WHITE && a.push(d[c][e].getType()), d[c][e].getColor() === BLACK && b.push(d[c][e].getType());
            if (1 === b.length && 1 === a.length) return !0;
            if (1 ===
                b.length && 2 === a.length || 2 === b.length && 1 === a.length)
                if (c = a.indexOf(BISHOP) && b.indexOf(BISHOP), e = a.indexOf(KNIGHT) && b.indexOf(KNIGHT), 0 <= c || 0 <= e) return !0;
            if (2 === b.length && 2 === a.length && (c = a.indexOf(BISHOP) || b.indexOf(BISHOP), 0 <= c)) {
                b = [];
                for (c = 0; c < d.length; c++)
                    for (e = 0; e < d[c].length; e++) d[c][e].getType() === BISHOP && b.push((c + e) % 2);
                if (b[0] === b[1]) return !0
            }
        }
        f === DRAW_COUNTER && (g = !0);
        return g
    };
    this.kingInCheck = function(h, d) {
        for (var g = this.getOtherOpponent(h), b = 0; b < d.length; b++)
            for (var a = 0; a < d[b].length; a++)
                if (d[b][a].getColor() ===
                    g) {
                    var c = d[b][a].getLogicPos();
                    c = s_oMovesController.getMovesList(c.row, c.col, d);
                    for (var e = 0; e < c.length; e++) {
                        var k = c[e];
                        if (d[k.row][k.col].getColor() === h && d[k.row][k.col].getType() === KING) return !0
                    }
                }
        return !1
    };
    this.increaseStallCount = function() {
        f++
    };
    this.resetStall = function() {
        f = 0
    };
    this.checkPromotion = function(h) {
        for (var d = null, g = 0; g < h.length; g++) h[0][g].getType() === PAWN ? d = {
            row: 0,
            col: g
        } : h[7][g].getType() === PAWN && (d = {
            row: 7,
            col: g
        });
        return d
    };
    this.getSpecialMoves = function(h, d, g, b, a) {
        h = a[h][d].getType();
        if (h === KING) {
            d -= b;
            if (-2 === d) return BOARD_SPECIAL_CASTLING_RIGHT;
            if (2 === d) return BOARD_SPECIAL_CASTLING_LEFT
        } else if (h === PAWN && d !== b && null === a[g][b].getType()) return BOARD_SPECIAL_ENPASSANT
    };
    this._getAllMovesList = function(h, d) {
        for (var g = [], b = 0; b < d.length; b++)
            for (var a = 0; a < d[b].length; a++) d[b][a].getColor() === h && g.push(d[b][a]);
        a = [];
        for (b = 0; b < g.length; b++) {
            var c = g[b].getLogicPos();
            a[b] = {
                list: s_oMovesController.getMovesList(c.row, c.col, d, !0),
                piece: g[b]
            }
        }
        return a
    };
    this._getPiecesThatMatchAList = function(h,
        d) {
        for (var g = [], b = 0; b < h.length; b++) {
            for (var a = !1, c = 0; c < h[b].list.length; c++)
                for (var e = h[b].list[c], k = 0; k < d.length; k++) e.row === d[k].row && e.col === d[k].col && (a = !0);
            a && g.push(h[b].piece)
        }
        return g
    };
    this.checkCastlingBlockFromOpponent = function(h, d, g) {
        var b = d === BLACK ? 0 : 7;
        d = this.getOtherOpponent(d);
        g = this._getAllMovesList(d, g);
        d = [];
        switch (h) {
            case BOARD_SPECIAL_CASTLING_RIGHT:
                h = [{
                    row: b,
                    col: 5
                }];
                d = this._getPiecesThatMatchAList(g, h);
                break;
            case BOARD_SPECIAL_CASTLING_LEFT:
                h = [{
                    row: b,
                    col: 3
                }], d = this._getPiecesThatMatchAList(g,
                    h)
        }
        return d
    };
    this._init();
    s_oBoardStateController = this
}
var s_oBoardStateController;

function CCopiedCell(f) {
    var h, d, g, b, a;
    this._init = function(c) {
        h = c.getColor();
        d = c.getType();
        b = c.getLogicPos().row;
        a = c.getLogicPos().col;
        c = c.getPieceHistory();
        g = [];
        for (var e = 0; e < c.length; e++) g[e] = c[e]
    };
    this.setCell = function(c, e, k, l, m) {
        h = c;
        d = e;
        b = k;
        a = l;
        for (c = 0; c < m.length; c++) g[c] = m[c]
    };
    this.setColor = function(c) {
        h = c
    };
    this.setType = function(c) {
        d = c
    };
    this.getColor = function() {
        return h
    };
    this.getType = function() {
        return d
    };
    this.getLogicPos = function() {
        return {
            row: b,
            col: a
        }
    };
    this.getPieceHistory = function() {
        return g
    };
    this._init(f)
}

function CPromoPanel(f, h) {
    var d, g, b, a, c, e;
    this._init = function(l, m) {
        b = new createjs.Shape;
        b.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        b.alpha = 0;
        s_oStage.addChild(b);
        (new createjs.Tween.get(b)).to({
            alpha: .7
        }, 500);
        var n = s_oSpriteLibrary.getSprite("msg_box");
        c = new createjs.Container;
        c.y = CANVAS_HEIGHT + n.height / 2;
        s_oStage.addChild(c);
        g = createBitmap(n);
        g.regX = n.width / 2;
        g.regY = n.height / 2;
        g.x = CANVAS_WIDTH / 2;
        g.y = CANVAS_HEIGHT / 2;
        c.addChild(g);
        a = new createjs.Shape;
        a.graphics.beginFill("#0f0f0f").drawRect(0, 0,
            CANVAS_WIDTH, CANVAS_HEIGHT);
        a.alpha = .01;
        e = a.on("click", function() {});
        c.addChild(a);
        n = 800;
        new CTLText(c, CANVAS_WIDTH / 2 - n / 2, CANVAS_HEIGHT / 2 - 250 - 100, n, 200, 40, "center", "#402604", PRIMARY_FONT, 1, 2, 2, TEXT_PROMOTION, !0, !0, !0, !1);
        var p = new createjs.Container;
        p.x = CANVAS_WIDTH / 2;
        p.y = CANVAS_HEIGHT / 2;
        c.addChild(p);
        var q = [];
        q[0] = BISHOP;
        q[1] = ROOK;
        q[2] = KNIGHT;
        q[3] = QUEEN;
        n = 400;
        d = [];
        for (var u = 0; u < q.length; u++) {
            var t = s_oSpriteLibrary.getSprite(l + "_" + q[u]);
            d[u] = new CToggle(-n / 2 + n / (q.length - 1) * u, 0, t, !0, p);
            d[u].addEventListenerWithParams(ON_MOUSE_UP,
                this._onPieceSelected, this, q[u])
        }(new createjs.Tween.get(c)).to({
            y: 0
        }, 750, createjs.Ease.cubicOut)
    };
    this.unload = function() {
        a.off("click", e);
        s_oStage.removeChild(b);
        s_oStage.removeChild(c)
    };
    this._onPieceSelected = function(l) {
        s_oGame.changePiece(l, h);
        var m = s_oSpriteLibrary.getSprite("msg_box");
        m = CANVAS_HEIGHT + m.height / 2;
        (new createjs.Tween.get(b)).to({
            alpha: 0
        }, 500);
        (new createjs.Tween.get(c)).to({
            y: m
        }, 500, createjs.Ease.backIn).call(function() {
            k.unload();
            s_oGame.onExitPromoPanel(l)
        })
    };
    this._init(f, h);
    var k = this
}

function CAI() {
    var f, h, d, g, b;
    this._init = function() {};
    this.getMove = function() {
        var a = this._buildTree();
        a = b.getNode(a, 1);
        return this._getBestNode(a)
    };
    this._getBestNode = function(a) {
        if (0 < a.length) {
            for (var c = 0; c < a.length; c++) {
                var e = a[c].model.moves;
                this._makeMove(e);
                var k = s_oMovesControllerFaster.getState(WHITE, d);
                k === BOARD_STATE_CHECKMATE ? a[c].model.rating += .5 : k === BOARD_STATE_STALEMATE && (a[c].model.rating -= .5);
                this._unMakeMove(e)
            }
            e = a[0].model.rating;
            for (c = 1; c < a.length; c++) a[c].model.rating > e && (e = a[c].model.rating);
            k = [];
            for (c = 0; c < a.length; c++) a[c].model.rating === e && k.push(a[c]);
            a = k[Math.floor(Math.random() * k.length)].model.moves
        } else a = null;
        return a
    };
    this._buildTree = function() {
        f = 0;
        b = new CTreeDecision({
            rating: 0,
            moves: [],
            depth: 0
        });
        d = this._copyBoard(s_oGame.getCells());
        (new Date).getTime();
        h = this._maxi(0);
        (new Date).getTime();
        return h
    };
    this._alphaBetaMax = function(a, c, e) {
        f++;
        if (e === SEARCH_DEPTH) return this._evaluateBoard();
        var k = this._findAllMoves(BLACK),
            l = k.moves;
        k = k.opponentlist;
        for (var m = l.length - 1; 0 <= m; m--)
            if (this._makeMove(l[m]),
                s_oMovesControllerFaster.isInCheck(BLACK, d, k)) this._unMakeMove(l[m]), l.splice(m, 1);
            else {
                var n = e + 1;
                b.initNewNode(n);
                n = this._alphaBetaMin(a, c, n);
                b.addNode(e, n, l[m]);
                this._unMakeMove(l[m]);
                if (n >= c) return c;
                n > a && (a = n)
            }
        return a
    };
    this._alphaBetaMin = function(a, c, e) {
        f++;
        if (e === SEARCH_DEPTH) return this._evaluateBoard();
        var k = this._findAllMoves(WHITE),
            l = k.moves;
        k = k.opponentlist;
        for (var m = l.length - 1; 0 <= m; m--)
            if (this._makeMove(l[m]), s_oMovesControllerFaster.isInCheck(WHITE, d, k)) this._unMakeMove(l[m]), l.splice(m,
                1);
            else {
                var n = e + 1;
                b.initNewNode(n);
                n = this._alphaBetaMax(a, c, n);
                b.addNode(e, n, l[m]);
                this._unMakeMove(l[m]);
                if (n <= a) return a;
                n < c && (c = n)
            }
        return c
    };
    this._evaluateBoard = function() {
        return 200 * (g[BLACK][KING] - g[WHITE][KING]) + 9 * (g[BLACK][QUEEN] - g[WHITE][QUEEN]) + 5 * (g[BLACK][ROOK] - g[WHITE][ROOK]) + 3 * (g[BLACK][BISHOP] - g[WHITE][BISHOP] + g[BLACK][KNIGHT] - g[WHITE][KNIGHT]) + (g[BLACK][PAWN] - g[WHITE][PAWN])
    };
    this._findAllMoves = function(a) {
        for (var c = [], e = [], k = 0; k < NUM_CELL; k++)
            for (var l = 0; l < NUM_CELL; l++)
                if (null !== d[k][l].type)
                    if (d[k][l].color ===
                        a)
                        for (var m = s_oMovesControllerFaster.getMovesList(k, l, d), n = 0; n < m.length; n++) {
                            var p = m[n].row,
                                q = m[n].col;
                            c.push({
                                sourcerow: k,
                                sourcecol: l,
                                destrow: p,
                                destcol: q,
                                sourcetype: d[k][l].type,
                                sourcecolor: d[k][l].color,
                                sourcehistory: d[k][l].history,
                                desttype: d[p][q].type,
                                destcolor: d[p][q].color,
                                desthistory: d[p][q].history,
                                special: m[n].special
                            })
                        } else e.push({
                            row: k,
                            col: l
                        });
        return {
            moves: c,
            opponentlist: e
        }
    };
    this._makeMove = function(a) {
        null !== a.destcolor && g[a.destcolor][a.desttype]--;
        switch (a.special) {
            case BOARD_SPECIAL_CASTLING_RIGHT:
                d[a.sourcerow][5] = {
                    color: a.sourcecolor,
                    type: ROOK,
                    history: d[a.sourcerow][7].history
                };
                d[a.sourcerow][7] = {
                    color: null,
                    type: null,
                    history: []
                };
                break;
            case BOARD_SPECIAL_CASTLING_LEFT:
                d[a.sourcerow][3] = {
                    color: a.sourcecolor,
                    type: ROOK,
                    history: d[a.sourcerow][0].history
                };
                d[a.sourcerow][0] = {
                    color: null,
                    type: null,
                    history: []
                };
                break;
            case BOARD_SPECIAL_ENPASSANT:
                var c = s_oBoardStateController.getOtherOpponent(a.sourcecolor);
                d[a.sourcerow][a.destcol] = {
                    color: null,
                    type: null,
                    history: []
                };
                g[c][PAWN]--
        }
        d[a.destrow][a.destcol] = {
            color: a.sourcecolor,
            type: a.sourcetype,
            history: a.sourcehistory
        };
        d[a.sourcerow][a.sourcecol] = {
            color: null,
            type: null,
            history: []
        };
        0 !== a.destrow && 7 !== a.destrow || a.sourcetype !== PAWN || (d[a.destrow][a.destcol] = {
            color: a.sourcecolor,
            type: QUEEN,
            history: a.sourcehistory
        }, g[a.sourcecolor][PAWN]--, g[a.sourcecolor][QUEEN]++)
    };
    this._unMakeMove = function(a) {
        null !== a.destcolor && g[a.destcolor][a.desttype]++;
        switch (a.special) {
            case BOARD_SPECIAL_CASTLING_RIGHT:
                d[a.sourcerow][7] = {
                    color: a.sourcecolor,
                    type: ROOK,
                    history: d[a.sourcerow][5].history
                };
                d[a.sourcerow][5] = {
                    color: null,
                    type: null,
                    history: []
                };
                break;
            case BOARD_SPECIAL_CASTLING_LEFT:
                d[a.sourcerow][0] = {
                    color: a.sourcecolor,
                    type: ROOK,
                    history: d[a.sourcerow][3].history
                };
                d[a.sourcerow][3] = {
                    color: null,
                    type: null,
                    history: []
                };
                break;
            case BOARD_SPECIAL_ENPASSANT:
                var c = s_oBoardStateController.getOtherOpponent(a.sourcecolor);
                d[a.sourcerow][a.destcol] = {
                    color: c,
                    type: PAWN,
                    history: []
                };
                g[c][PAWN]++
        }
        d[a.sourcerow][a.sourcecol] = {
            color: a.sourcecolor,
            type: a.sourcetype,
            history: a.sourcehistory
        };
        d[a.destrow][a.destcol] = {
            color: a.destcolor,
            type: a.desttype,
            history: a.desthistory
        };
        0 !== a.destrow && 7 !== a.destrow || a.sourcetype !== PAWN || (g[a.sourcecolor][PAWN]++, g[a.sourcecolor][QUEEN]--)
    };
    this.debugBoard = function(a) {
        for (var c = [], e = 0; e < NUM_CELL; e++) {
            c[e] = [];
            for (var k = 0; k < NUM_CELL; k++) c[e][k] = a[e][k].getType() + "_" + a[e][k].getColor()
        }
        return c
    };
    this._copyBoard = function(a) {
        g = [BLACK, WHITE];
        g[BLACK] = [];
        g[WHITE] = [];
        g[BLACK][KING] = 0;
        g[BLACK][QUEEN] = 0;
        g[BLACK][ROOK] = 0;
        g[BLACK][BISHOP] = 0;
        g[BLACK][KNIGHT] = 0;
        g[BLACK][PAWN] = 0;
        g[WHITE][KING] =
            0;
        g[WHITE][QUEEN] = 0;
        g[WHITE][ROOK] = 0;
        g[WHITE][BISHOP] = 0;
        g[WHITE][KNIGHT] = 0;
        g[WHITE][PAWN] = 0;
        for (var c = [], e = 0; e < NUM_CELL; e++) {
            c[e] = [];
            for (var k = 0; k < NUM_CELL; k++) c[e][k] = {
                color: a[e][k].getColor(),
                type: a[e][k].getType(),
                history: a[e][k].getPieceHistory()
            }, null !== a[e][k].getColor() && g[c[e][k].color][c[e][k].type]++
        }
        return c
    };
    this._maxi = function(a) {
        if (a === SEARCH_DEPTH) return this._evaluateBoard();
        var c = -INFINITE,
            e = this._findAllMoves(BLACK),
            k = e.moves;
        e = e.opponentlist;
        for (var l = a + 1, m = k.length - 1; 0 <= m; m--)
            if (this._makeMove(k[m]),
                s_oMovesControllerFaster.isInCheck(BLACK, d, e)) this._unMakeMove(k[m]), k.splice(m, 1);
            else {
                b.initNewNode(l);
                var n = this._mini(l);
                b.addNode(a, n, k[m]);
                this._unMakeMove(k[m]);
                n > c && (c = n)
            }
        return c
    };
    this._mini = function(a) {
        if (a === SEARCH_DEPTH) return this._evaluateBoard();
        var c = INFINITE,
            e = this._findAllMoves(WHITE),
            k = e.moves;
        e = e.opponentlist;
        for (var l = a + 1, m = k.length - 1; 0 <= m; m--)
            if (this._makeMove(k[m]), s_oMovesControllerFaster.isInCheck(WHITE, d, e)) this._unMakeMove(k[m]), k.splice(m, 1);
            else {
                b.initNewNode(l);
                var n =
                    this._maxi(l);
                b.addNode(a, n, k[m]);
                this._unMakeMove(k[m]);
                n < c && (c = n)
            }
        return c
    };
    this._init()
}
DIR_TOPRIGHT = "DIR_TOPRIGHT";
DIR_RIGHT = "DIR_RIGHT";
DIR_BOTRIGHT = "DIR_BOTRIGHT";
DIR_TOPLEFT = "DIR_TOPLEFT";
DIR_LEFT = "DIR_LEFT";
DIR_BOTLEFT = "DIR_BOTLEFT";
DIR_TOP = "DIR_TOP";
DIR_BOT = "DIR_BOT";

function CMovesControllerFaster(f) {
    var h, d, g;
    this._init = function(b) {
        h = b.length;
        d = b[0].length;
        g = [];
        for (b = 0; b < h; b++) {
            g[b] = [];
            for (var a = 0; a < d; a++) g[b][a] = []
        }
        this._buildMap()
    };
    this._buildMap = function() {
        for (var b = 0; b < h; b++)
            for (var a = 0; a < d; a++) g[b][a][DIR_TOPRIGHT] = this._setNeighbor(b, a, DIR_TOPRIGHT), g[b][a][DIR_RIGHT] = this._setNeighbor(b, a, DIR_RIGHT), g[b][a][DIR_BOTRIGHT] = this._setNeighbor(b, a, DIR_BOTRIGHT), g[b][a][DIR_TOPLEFT] = this._setNeighbor(b, a, DIR_TOPLEFT), g[b][a][DIR_LEFT] = this._setNeighbor(b, a,
                DIR_LEFT), g[b][a][DIR_BOTLEFT] = this._setNeighbor(b, a, DIR_BOTLEFT), g[b][a][DIR_TOP] = this._setNeighbor(b, a, DIR_TOP), g[b][a][DIR_BOT] = this._setNeighbor(b, a, DIR_BOT)
    };
    this._setNeighbor = function(b, a, c) {
        var e = null;
        switch (c) {
            case DIR_TOPRIGHT:
                0 < b && a < d - 1 && (e = {
                    row: b - 1,
                    col: a + 1
                });
                break;
            case DIR_RIGHT:
                a < d - 1 && (e = {
                    row: b,
                    col: a + 1
                });
                break;
            case DIR_BOTRIGHT:
                b < h - 1 && a < d - 1 && (e = {
                    row: b + 1,
                    col: a + 1
                });
                break;
            case DIR_TOPLEFT:
                0 < b && 0 < a && (e = {
                    row: b - 1,
                    col: a - 1
                });
                break;
            case DIR_LEFT:
                0 < a && (e = {
                    row: b,
                    col: a - 1
                });
                break;
            case DIR_BOTLEFT:
                b <
                    h - 1 && 0 < a && (e = {
                        row: b + 1,
                        col: a - 1
                    });
                break;
            case DIR_TOP:
                0 < b && (e = {
                    row: b - 1,
                    col: a
                });
                break;
            case DIR_BOT:
                b < h - 1 && (e = {
                    row: b + 1,
                    col: a
                })
        }
        return e
    };
    this._getNeighborByDir = function(b, a, c) {
        return g[b][a][c]
    };
    this._getAllNeighbor = function(b, a) {
        var c = [],
            e;
        for (e in g[b][a]) null !== g[b][a][e] && c.push(g[b][a][e]);
        return c
    };
    this._getMainDiagonal = function(b, a, c) {
        var e = [],
            k = c[b][a].color;
        this._findInDirection(b, a, DIR_BOTRIGHT, e, 99, k, c);
        this._findInDirection(b, a, DIR_TOPLEFT, e, 99, k, c);
        return e
    };
    this._getSecondDiagonal = function(b,
        a, c) {
        var e = [],
            k = c[b][a].color;
        this._findInDirection(b, a, DIR_BOTLEFT, e, 99, k, c);
        this._findInDirection(b, a, DIR_TOPRIGHT, e, 99, k, c);
        return e
    };
    this._getRow = function(b, a, c) {
        var e = [],
            k = c[b][a].color;
        this._findInDirection(b, a, DIR_LEFT, e, 99, k, c);
        this._findInDirection(b, a, DIR_RIGHT, e, 99, k, c);
        return e
    };
    this._getCol = function(b, a, c) {
        var e = [],
            k = c[b][a].color;
        this._findInDirection(b, a, DIR_TOP, e, 99, k, c);
        this._findInDirection(b, a, DIR_BOT, e, 99, k, c);
        return e
    };
    this._getStraightByDirAndRadius = function(b, a, c, e, k) {
        var l = [];
        this._findInDirection(b, a, c, l, e, k[b][a].color, k);
        return l
    };
    this._getStraightRowByRadius = function(b, a, c) {
        var e = [];
        this._findInDirection(b, a, DIR_LEFT, e, c);
        this._findInDirection(b, a, DIR_RIGHT, e, c);
        return e
    };
    this._getStraightColByRadius = function(b, a, c) {
        var e = [];
        this._findInDirection(b, a, DIR_TOP, e, c);
        this._findInDirection(b, a, DIR_BOT, e, c);
        return e
    };
    this._findInDirection = function(b, a, c, e, k, l, m) {
        --k;
        if (null !== g[b][a][c] && 0 <= k) {
            var n = g[b][a][c].row;
            b = g[b][a][c].col;
            l ? (a = m[n][b].color, a !== l && (null === a ?
                (e.push({
                    row: n,
                    col: b
                }), this._findInDirection(n, b, c, e, k, l, m)) : e.push({
                    row: n,
                    col: b
                }))) : (e.push({
                row: n,
                col: b
            }), this._findInDirection(n, b, c, e, k, l, m))
        }
    };
    this._findTPos = function(b, a, c) {
        var e = [];
        b = g[b][a][c];
        null !== b && (b = g[b.row][b.col][c], null !== b && (e = c === DIR_TOP || c === DIR_BOT ? this._getStraightRowByRadius(b.row, b.col, 1) : this._getStraightColByRadius(b.row, b.col, 1)));
        return e
    };
    this.getMovesList = function(b, a, c, e) {
        var k = [];
        switch (c[b][a].type) {
            case PAWN:
                k = this.getPawnMove(b, a, c);
                break;
            case ROOK:
                k = this.getRookMove(b,
                    a, c);
                break;
            case KNIGHT:
                k = this.getKnightMove(b, a, c);
                break;
            case BISHOP:
                k = this.getBishopMove(b, a, c);
                break;
            case QUEEN:
                k = this.getQueenMove(b, a, c);
                break;
            case KING:
                k = e ? this.getSimpleKingMove(b, a, c) : this.getKingMove(b, a, c)
        }
        return k
    };
    this.getPawnMove = function(b, a, c) {
        var e = c[b][a].color,
            k = [];
        if (e === WHITE) {
            var l = 6 === b ? this._getStraightByDirAndRadius(b, a, DIR_TOP, 2, c) : this._getStraightByDirAndRadius(b, a, DIR_TOP, 1, c);
            var m = this._getNeighborByDir(b, a, DIR_TOPRIGHT);
            null !== m && c[m.row][m.col].color === BLACK && k.push(m);
            m = this._getNeighborByDir(b, a, DIR_TOPLEFT);
            null !== m && c[m.row][m.col].color === BLACK && k.push(m);
            if (3 === b)
                for (b = this._getEnPassant(WHITE, b, a, c), a = 0; a < b.length; a++) k.push(b[a])
        } else if (l = 1 === b ? this._getStraightByDirAndRadius(b, a, DIR_BOT, 2, c) : this._getStraightByDirAndRadius(b, a, DIR_BOT, 1, c), m = this._getNeighborByDir(b, a, DIR_BOTRIGHT), null !== m && c[m.row][m.col].color === WHITE && k.push(m), m = this._getNeighborByDir(b, a, DIR_BOTLEFT), null !== m && c[m.row][m.col].color === WHITE && k.push(m), 4 === b)
            for (b = this._getEnPassant(BLACK,
                    b, a, c), a = 0; a < b.length; a++) k.push(b[a]);
        for (a = l.length - 1; 0 <= a; a--) null !== c[l[a].row][l[a].col].color && c[l[a].row][l[a].col].color !== e && l.splice(a, 1);
        for (a = 0; a < k.length; a++) l.push(k[a]);
        return l
    };
    this.getRookMove = function(b, a, c) {
        var e = this._getRow(b, a, c);
        b = this._getCol(b, a, c);
        a = [];
        for (c = 0; c < e.length; c++) a.push(e[c]);
        for (c = 0; c < b.length; c++) a.push(b[c]);
        return a
    };
    this.getKnightMove = function(b, a, c) {
        var e = [];
        e.push(this._findTPos(b, a, DIR_TOP));
        e.push(this._findTPos(b, a, DIR_RIGHT));
        e.push(this._findTPos(b,
            a, DIR_BOT));
        e.push(this._findTPos(b, a, DIR_LEFT));
        for (var k = [], l = 0; l < e.length; l++)
            for (var m = 0; m < e[l].length; m++) k.push(e[l][m]);
        b = c[b][a].color;
        for (l = k.length - 1; 0 <= l; l--) c[k[l].row][k[l].col].color === b && k.splice(l, 1);
        return k
    };
    this.getBishopMove = function(b, a, c) {
        var e = this._getMainDiagonal(b, a, c);
        b = this._getSecondDiagonal(b, a, c);
        a = [];
        for (c = 0; c < e.length; c++) a.push(e[c]);
        for (c = 0; c < b.length; c++) a.push(b[c]);
        return a
    };
    this.getQueenMove = function(b, a, c) {
        var e = this.getRookMove(b, a, c);
        b = this.getBishopMove(b,
            a, c);
        a = [];
        for (c = 0; c < e.length; c++) a.push(e[c]);
        for (c = 0; c < b.length; c++) a.push(b[c]);
        return a
    };
    this.getSimpleKingMove = function(b, a, c) {
        var e = this._getAllNeighbor(b, a);
        b = c[b][a].color;
        for (a = e.length - 1; 0 <= a; a--) c[e[a].row][e[a].col].color === b && e.splice(a, 1);
        return e
    };
    this.getKingMove = function(b, a, c) {
        var e = this._getAllNeighbor(b, a),
            k = c[b][a];
        if (1 === k.history.length && !s_oGame.isCheck()) {
            k = s_oBoardStateController.getOtherOpponent(k.color);
            k = this._getAllMovesList(k, c);
            var l = !0;
            1 === c[b][7].history.length ? (null !==
                c[b][6].color && (l = !1), null !== c[b][5].color && (l = !1)) : l = !1;
            l && (l = [{
                row: b,
                col: 5
            }], (l = this._isListMatching(k, l)) || e.push({
                row: b,
                col: 6,
                special: BOARD_SPECIAL_CASTLING_RIGHT
            }));
            l = !0;
            1 === c[b][0].history.length ? (null !== c[b][1].color && (l = !1), null !== c[b][2].color && (l = !1), null !== c[b][3].color && (l = !1)) : l = !1;
            l && (l = [{
                row: b,
                col: 3
            }], (l = this._isListMatching(k, l)) || e.push({
                row: b,
                col: 2,
                special: BOARD_SPECIAL_CASTLING_LEFT
            }))
        }
        b = c[b][a].color;
        for (a = e.length - 1; 0 <= a; a--) c[e[a].row][e[a].col].color === b && e.splice(a, 1);
        return e
    };
    this._getAllMovesList = function(b, a) {
        for (var c = [], e = 0; e < a.length; e++)
            for (var k = 0; k < a[e].length; k++) a[e][k].color === b && c.push({
                row: e,
                col: k
            });
        k = [];
        for (e = 0; e < c.length; e++) {
            var l = c[e];
            k[e] = {
                list: s_oMovesControllerFaster.getMovesList(l.row, l.col, a, !0),
                piece: c[e]
            }
        }
        return k
    };
    this._isListMatching = function(b, a) {
        for (var c = 0; c < b.length; c++)
            for (var e = 0; e < b[c].list.length; e++)
                for (var k = b[c].list[e], l = 0; l < a.length; l++)
                    if (k.row === a[l].row && k.col === a[l].col) return !0;
        return !1
    };
    this._getEnPassant = function(b, a, c, e) {
        var k = [],
            l = s_oBoardStateController.getOtherOpponent(b),
            m = this._getNeighborByDir(a, c, DIR_RIGHT);
        null !== m && (m = e[m.row][m.col], m.color === l && m.type === PAWN && (m = m.history, 2 === m.length && m[1].id === s_oGame.getLastHistoryID() && (b === WHITE ? k.push(this._getNeighborByDir(a, c, DIR_TOPRIGHT)) : k.push(this._getNeighborByDir(a, c, DIR_BOTRIGHT)))));
        m = this._getNeighborByDir(a, c, DIR_LEFT);
        null !== m && (m = e[m.row][m.col], m.color === l && m.type === PAWN && (m = m.history, 2 === m.length && m[1].id === s_oGame.getLastHistoryID() && (b === WHITE ? k.push(this._getNeighborByDir(a,
            c, DIR_TOPLEFT)) : k.push(this._getNeighborByDir(a, c, DIR_BOTLEFT)))));
        for (b = 0; b < k.length; b++) k[b].special = BOARD_SPECIAL_ENPASSANT;
        return k
    };
    this.getState = function(b, a) {
        if (0 !== this.findAllChecks(b, a).length) return this.findCheckMate(b, a) ? BOARD_STATE_CHECKMATE : BOARD_STATE_CHECK;
        if (this.findStaleMate(b, a)) return BOARD_STATE_STALEMATE
    };
    this.findCheckMate = function(b, a) {
        for (var c = [], e = 0; e < a.length; e++)
            for (var k = 0; k < a[e].length; k++) a[e][k].color === b && c.push({
                row: e,
                col: k
            });
        for (e = 0; e < c.length; e++) {
            var l = c[e].row,
                m = c[e].col,
                n = s_oMovesControllerFaster.getMovesList(l, m, a);
            for (k = 0; k < n.length; k++) {
                var p = n[k].row,
                    q = n[k].col;
                p = {
                    sourcerow: l,
                    sourcecol: m,
                    destrow: p,
                    destcol: q,
                    sourcetype: a[l][m].type,
                    sourcecolor: a[l][m].color,
                    sourcehistory: a[l][m].history,
                    desttype: a[p][q].type,
                    destcolor: a[p][q].color,
                    desthistory: a[p][q].history,
                    special: n[k].special
                };
                this._makeMove(a, p);
                if (0 === this.findAllChecks(b, a).length) return !1;
                this._unMakeMove(a, p)
            }
        }
        return !0
    };
    this._makeMove = function(b, a) {
        b[a.destrow][a.destcol] = {
            color: a.sourcecolor,
            type: a.sourcetype,
            history: a.sourcehistory
        };
        b[a.sourcerow][a.sourcecol] = {
            color: null,
            type: null,
            history: []
        };
        0 !== a.destrow && 7 !== a.destrow || a.sourcetype !== PAWN || (b[a.destrow][a.destcol] = {
            color: a.sourcecolor,
            type: QUEEN,
            history: a.sourcehistory
        })
    };
    this._unMakeMove = function(b, a) {
        b[a.sourcerow][a.sourcecol] = {
            color: a.sourcecolor,
            type: a.sourcetype,
            history: a.sourcehistory
        };
        b[a.destrow][a.destcol] = {
            color: a.destcolor,
            type: a.desttype,
            history: a.desthistory
        }
    };
    this.findStaleMate = function(b, a) {
        var c = this.findCheckMate(b,
            a);
        if (!c) {
            for (var e = [], k = [], l = 0; l < a.length; l++)
                for (var m = 0; m < a[l].length; m++) a[l][m].color === WHITE && k.push(a[l][m].type), a[l][m].color === BLACK && e.push(a[l][m].type);
            if (1 === e.length && 1 === k.length) return !0;
            if (1 === e.length && 2 === k.length || 2 === e.length && 1 === k.length)
                if (l = k.indexOf(BISHOP) && e.indexOf(BISHOP), m = k.indexOf(KNIGHT) && e.indexOf(KNIGHT), 0 <= l || 0 <= m) return !0;
            if (2 === e.length && 2 === k.length && (l = k.indexOf(BISHOP) || e.indexOf(BISHOP), 0 <= l)) {
                e = [];
                for (l = 0; l < a.length; l++)
                    for (m = 0; m < a[l].length; m++) a[l][m].type ===
                        BISHOP && e.push((l + m) % 2);
                if (e[0] === e[1]) return !0
            }
        }
        return c
    };
    this.isInCheck = function(b, a, c) {
        for (var e, k = 0; k < c.length; k++) {
            e = s_oMovesControllerFaster.getMovesList(c[k].row, c[k].col, a);
            for (var l = 0; l < e.length; l++) {
                var m = e[l];
                if (a[m.row][m.col].color === b && a[m.row][m.col].type === KING) return !0
            }
        }
        return !1
    };
    this.findAllChecks = function(b, a) {
        for (var c = s_oBoardStateController.getOtherOpponent(b), e = [], k = 0; k < a.length; k++)
            for (var l = 0; l < a[k].length; l++) a[k][l].color === c && e.push({
                row: k,
                col: l
            });
        c = [];
        for (k = 0; k < e.length; k++) {
            var m =
                e[k];
            c[k] = {
                list: s_oMovesControllerFaster.getMovesList(m.row, m.col, a),
                piece: e[k]
            }
        }
        e = [];
        for (k = 0; k < c.length; k++)
            for (l = 0; l < c[k].list.length; l++) m = c[k].list[l], a[m.row][m.col].color === b && a[m.row][m.col].type === KING && e.push(c[k].piece);
        return e
    };
    this._init(f);
    s_oMovesControllerFaster = this
}
var s_oMovesControllerFaster;

function CMsgBox(f) {
    var h, d, g, b, a;
    this._init = function(c) {
        d = new createjs.Shape;
        d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        d.alpha = 0;
        d.on("mousedown", function() {});
        s_oStage.addChild(d);
        (new createjs.Tween.get(d)).to({
            alpha: .7
        }, 500);
        g = new createjs.Container;
        s_oStage.addChild(g);
        var e = s_oSpriteLibrary.getSprite("msg_box"),
            k = createBitmap(e);
        k.regX = e.width / 2;
        k.regY = e.height / 2;
        g.addChild(k);
        g.x = CANVAS_WIDTH / 2;
        g.y = CANVAS_HEIGHT / 2;
        b = new createjs.Text(c, " 80px " + PRIMARY_FONT, "#ffffff");
        b.y = 0;
        b.textAlign = "center";
        b.textBaseline = "middle";
        b.lineWidth = 600;
        g.addChild(b);
        a = new createjs.Container;
        a.y = 180;
        g.addChild(a);
        h = []
    };
    this.unload = function() {
        s_oStage.removeChild(d);
        s_oStage.removeChild(g);
        d.off("mousedown", function() {});
        for (var c = 0; c < h.length; c++) h[c].unload()
    };
    this.setMessage = function(c) {
        b.text = c
    };
    this.setExplMsg = function(c) {
        c = new createjs.Text(c, " 50px " + PRIMARY_FONT, "#ffffff");
        c.y = -100;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.lineWidth = 400;
        g.addChild(c)
    };
    this.addButton = function(c,
        e, k, l) {
        b.y = -250;
        var m = new CGfxButton(h.length * (c.width + 150), 0, c, a);
        m.addEventListener(e, k, l);
        h.push(m);
        a.regX = a.getBounds().width / 2 - c.width / 2
    };
    this.show = function() {
        d.visible = !0;
        g.visible = !0
    };
    this.reShow = function() {
        d.visible = !0;
        g.visible = !0
    };
    this.hide = function() {
        d.visible = !1;
        g.visible = !1
    };
    this._init(f)
};