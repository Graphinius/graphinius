"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortFuncs = {
    asc: function (se1, se2) { return se1.sim - se2.sim; },
    desc: function (se1, se2) { return se2.sim - se1.sim; }
};
exports.cutFuncs = {
    above: function (sim, threshold) { return sim >= threshold; },
    below: function (sim, threshold) { return sim <= threshold; }
};
function sim(algo, a, b) {
    return algo(a, b);
}
exports.sim = sim;
function simSource(algo, s, t, cfg) {
    if (cfg === void 0) { cfg = {}; }
    var e_1, _a;
    var sort = cfg.sort || exports.sortFuncs.desc;
    var cutFunc = cfg.cutFunc || exports.cutFuncs.above;
    var result = [];
    var start = t[s];
    try {
        for (var _b = __values(Object.entries(t)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
            if (k === s) {
                continue;
            }
            var sim_1 = algo(start, v);
            if (cfg.cutoff == null || cutFunc(sim_1.sim, cfg.cutoff)) {
                result.push(__assign({ from: s, to: k }, sim_1));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    result.sort(sort);
    if (cfg.knn != null && cfg.knn <= result.length) {
        result = result.slice(0, cfg.knn);
    }
    return result;
}
exports.simSource = simSource;
function simPairwise(algo, s, cfg) {
    if (cfg === void 0) { cfg = {}; }
    var sort = cfg.sort || exports.sortFuncs.desc;
    var cutFunc = cfg.cutFunc || exports.cutFuncs.above;
    var result = [];
    var keys = Object.keys(s);
    for (var i in keys) {
        for (var j = 0; j < +i; j++) {
            var from = keys[i];
            var to = keys[j];
            if (from === to) {
                continue;
            }
            var sim_2 = algo(s[keys[i]], s[keys[j]], i, j);
            if (cfg.cutoff == null || cutFunc(sim_2.sim, cfg.cutoff)) {
                result.push(__assign({ from: from, to: to }, sim_2));
            }
        }
    }
    result.sort(sort);
    if (cfg.knn != null && cfg.knn <= result.length) {
        result = result.slice(0, cfg.knn);
    }
    return result;
}
exports.simPairwise = simPairwise;
function simSubsets(algo, s1, s2, cfg) {
    if (cfg === void 0) { cfg = {}; }
    var sort = cfg.sort || exports.sortFuncs.desc;
    var cutFunc = cfg.cutFunc || exports.cutFuncs.above;
    var result = [];
    var keys1 = Object.keys(s1);
    var keys2 = Object.keys(s2);
    for (var i in keys1) {
        var subRes = [];
        for (var j in keys2) {
            var from = keys1[i];
            var to = keys2[j];
            if (from === to) {
                continue;
            }
            var sim_3 = algo(s1[keys1[i]], s2[keys2[j]]);
            if (cfg.cutoff == null || cutFunc(sim_3.sim, cfg.cutoff)) {
                subRes.push(__assign({ from: from, to: to }, sim_3));
            }
        }
        subRes.sort(sort);
        if (cfg.knn != null && cfg.knn <= subRes.length) {
            subRes = subRes.slice(0, cfg.knn);
        }
        result = result.concat(subRes);
    }
    return result.sort(sort);
}
exports.simSubsets = simSubsets;
function knnNodeArray(algo, s, cfg) {
    var e_2, _a;
    var sort = cfg.sort || exports.sortFuncs.desc;
    var c = cfg.cutoff || 0;
    var topK = [];
    var dupes = {};
    try {
        for (var _b = __values(Object.keys(s)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var node = _c.value;
            var topKEntries = simSource(algo, node, s, { knn: cfg.knn || 1, sort: cfg.sort });
            topKEntries.forEach(function (e) {
                if (c == null || e.sim < c) {
                    return;
                }
                if (!cfg.dup && (dupes[e.from] && dupes[e.from][e.to] || dupes[e.to] && dupes[e.to][e.from])) {
                    return;
                }
                topK.push(e);
                dupes[e.from] = dupes[e.from] || {};
                dupes[e.from][e.to] = true;
            });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return topK.sort(sort);
}
exports.knnNodeArray = knnNodeArray;
function knnNodeDict(algo, s, cfg) {
    var e_3, _a;
    var sort = cfg.sort || exports.sortFuncs.desc;
    var c = cfg.cutoff || 0;
    var topK = {};
    var _loop_1 = function (node) {
        var e_4, _a;
        var topKEntries = simSource(algo, node, s, { knn: cfg.knn || 1, sort: cfg.sort });
        topKEntries.forEach(function (e) {
            if (c == null || e.sim < c) {
                return;
            }
            delete e.from;
            topK[node] = topK[node] || [];
            topK[node].push(e);
        });
        try {
            for (var _b = __values(Object.values(topK)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var arr = _c.value;
                arr.sort(sort);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    try {
        for (var _b = __values(Object.keys(s)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var node = _c.value;
            _loop_1(node);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return topK;
}
exports.knnNodeDict = knnNodeDict;
function viaSharedPrefs(g, algo, cfg) {
    var e_5, _a, e_6, _b;
    var sort = cfg.sort || exports.sortFuncs.desc;
    var cutoff = cfg.co == null ? 1e-6 : cfg.co;
    var cutFunc = cfg.cutFunc || exports.cutFuncs.above;
    var sims = [];
    var t1Set = g.getNodesT(cfg.t1);
    var t2Set = g.getNodesT(cfg.t2);
    var prefCache = new Map();
    try {
        for (var _c = __values(t1Set.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), t1Name = _e[0], t1Node = _e[1];
            try {
                for (var _f = __values(t2Set.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), t2Name = _h[0], t2Node = _h[1];
                    var prefSet1 = void 0, prefSet2 = void 0;
                    if (prefCache.get(t1Node.id)) {
                        prefSet1 = prefCache.get(t1Node.id);
                    }
                    else {
                        prefSet1 = g[cfg.d1](t1Node, cfg.e1.toUpperCase());
                        prefCache.set(t1Node.id, prefSet1);
                    }
                    if (prefCache.get(t2Node.id)) {
                        prefSet2 = prefCache.get(t2Node.id);
                    }
                    else {
                        prefSet2 = g[cfg.d2](t2Node, cfg.e2.toUpperCase());
                        prefCache.set(t2Node.id, prefSet2);
                    }
                    var sim_4 = algo(prefSet1, prefSet2);
                    if (cutFunc(sim_4.sim, cutoff)) {
                        sims.push(__assign({ from: t1Name, to: t2Name }, sim_4));
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return sims.sort(sort);
}
exports.viaSharedPrefs = viaSharedPrefs;
function getBsNotInA(a, b) {
    var e_7, _a, e_8, _b;
    var result = new Set();
    var sa = new Set(), sb = new Set();
    try {
        for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
            var e = a_1_1.value;
            sa.add(e.label);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    try {
        for (var b_1 = __values(b), b_1_1 = b_1.next(); !b_1_1.done; b_1_1 = b_1.next()) {
            var e = b_1_1.value;
            if (!sa.has(e.label)) {
                result.add(e);
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (b_1_1 && !b_1_1.done && (_b = b_1.return)) _b.call(b_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return result;
}
exports.getBsNotInA = getBsNotInA;
