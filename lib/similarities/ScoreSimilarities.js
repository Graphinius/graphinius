"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var PRECISION = 5;
exports.simFuncs = {
    cosine: cosine,
    cosineSets: cosineSets,
    euclidean: euclidean,
    euclideanSets: euclideanSets,
    pearson: pearson,
    pearsonSets: pearsonSets
};
function euclidean(a, b) {
    if (a.length !== b.length) {
        throw new Error('Vectors must be of same size');
    }
    var at = a.length < 1e4 ? a : new Float32Array(a);
    var bt = b.length < 1e4 ? b : new Float32Array(b);
    var sum = 0, diff = 0;
    for (var i = 0; i < at.length; i++) {
        diff = at[i] - bt[i];
        sum += diff * diff;
    }
    var sim = +Math.sqrt(sum).toPrecision(PRECISION);
    return { sim: sim };
}
function cosine(a, b) {
    if (a.length !== b.length) {
        throw new Error('Vectors must be of same size');
    }
    var fa1 = new Float32Array(a);
    var fa2 = new Float32Array(b);
    var numerator = 0;
    for (var i = 0; i < fa1.length; i++) {
        numerator += fa1[i] * fa2[i];
    }
    var dena = 0, denb = 0;
    for (var i = 0; i < fa1.length; i++) {
        dena += fa1[i] * fa1[i];
        denb += fa2[i] * fa2[i];
    }
    dena = Math.sqrt(dena);
    denb = Math.sqrt(denb);
    return { sim: +(numerator / (dena * denb)).toPrecision(PRECISION) };
}
function pearson(a, b, a_mean, b_mean) {
    if (a.length !== b.length) {
        throw new Error('Vectors must be of same size');
    }
    var sum_a = 0, sum_b = 0, mean_a = a_mean || 0, mean_b = b_mean || 0, numerator = 0, diff_a_sq = 0, diff_b_sq = 0, denominator, a_diff, b_diff, sim;
    if (!a_mean || !b_mean) {
        for (var i = 0; i < a.length; i++) {
            sum_a += a[i];
            sum_b += b[i];
        }
        mean_a = sum_a / a.length;
        mean_b = sum_b / b.length;
    }
    for (var i = 0; i < a.length; i++) {
        a_diff = a[i] - mean_a;
        b_diff = b[i] - mean_b;
        numerator += a_diff * b_diff;
        diff_a_sq += a_diff * a_diff;
        diff_b_sq += b_diff * b_diff;
    }
    denominator = Math.sqrt(diff_a_sq) * Math.sqrt(diff_b_sq);
    sim = +(numerator / denominator).toPrecision(PRECISION);
    return { sim: sim };
}
function cosineSets(a, b) {
    var _a = __read(extractCommonTargetScores(a, b), 2), aa = _a[0], ba = _a[1];
    if (!aa.length || !ba.length) {
        return { sim: 0 };
    }
    return cosine(aa, ba);
}
function euclideanSets(a, b) {
    var _a = __read(extractCommonTargetScores(a, b), 2), aa = _a[0], ba = _a[1];
    if (!aa.length || !ba.length) {
        return { sim: 0 };
    }
    return euclidean(aa, ba);
}
function pearsonSets(a, b) {
    var _a = __read(extractCommonTargetScores(a, b), 4), aa = _a[0], ba = _a[1], a_mean = _a[2], b_mean = _a[3];
    if (!aa.length || !ba.length) {
        return { sim: 0 };
    }
    return pearson(aa, ba, a_mean, b_mean);
}
function extractCommonTargetScores(a, b) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
    var a_id = new Set(), b_id = new Set();
    try {
        for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
            var e = a_1_1.value;
            a_id.add(e.split('#')[0]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var b_1 = __values(b), b_1_1 = b_1.next(); !b_1_1.done; b_1_1 = b_1.next()) {
            var e = b_1_1.value;
            b_id.add(e.split('#')[0]);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (b_1_1 && !b_1_1.done && (_b = b_1.return)) _b.call(b_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var score, a_map = new Map(), b_map = new Map(), a_vec = [], b_vec = [], earr, a_mean = 0, b_mean = 0;
    try {
        for (var a_2 = __values(a), a_2_1 = a_2.next(); !a_2_1.done; a_2_1 = a_2.next()) {
            var e = a_2_1.value;
            earr = e.split('#');
            score = +earr[earr.length - 1];
            a_mean += score;
            if (b_id.has(earr[0])) {
                a_map.set(earr[0], score);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (a_2_1 && !a_2_1.done && (_c = a_2.return)) _c.call(a_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    try {
        for (var b_2 = __values(b), b_2_1 = b_2.next(); !b_2_1.done; b_2_1 = b_2.next()) {
            var e = b_2_1.value;
            var earr_1 = e.split('#');
            score = +earr_1[earr_1.length - 1];
            b_mean += score;
            if (a_id.has(earr_1[0])) {
                b_map.set(earr_1[0], score);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (b_2_1 && !b_2_1.done && (_d = b_2.return)) _d.call(b_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    var a_keys = Array.from(a_map.keys()).sort();
    try {
        for (var a_keys_1 = __values(a_keys), a_keys_1_1 = a_keys_1.next(); !a_keys_1_1.done; a_keys_1_1 = a_keys_1.next()) {
            var key = a_keys_1_1.value;
            a_vec.push(a_map.get(key));
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (a_keys_1_1 && !a_keys_1_1.done && (_e = a_keys_1.return)) _e.call(a_keys_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    var b_keys = Array.from(b_map.keys()).sort();
    try {
        for (var b_keys_1 = __values(b_keys), b_keys_1_1 = b_keys_1.next(); !b_keys_1_1.done; b_keys_1_1 = b_keys_1.next()) {
            var key = b_keys_1_1.value;
            b_vec.push(b_map.get(key));
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (b_keys_1_1 && !b_keys_1_1.done && (_f = b_keys_1.return)) _f.call(b_keys_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return [a_vec, b_vec, a_mean / a.size, b_mean / b.size];
}
