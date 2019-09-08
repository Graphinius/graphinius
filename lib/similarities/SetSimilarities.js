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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simFuncs = {
    jaccard: jaccard,
    overlap: overlap
};
var PRECISION = 5;
function jaccard(a, b) {
    var ui = unionIntersect(a, b);
    return {
        isect: ui.isectSize,
        sim: +(ui.isectSize / ui.unionSize).toPrecision(PRECISION)
    };
}
function overlap(a, b) {
    var ui = unionIntersect(a, b);
    return {
        isect: ui.isectSize,
        sim: +(ui.isectSize / Math.min(a.size, b.size)).toPrecision(PRECISION)
    };
}
function unionIntersect(a, b) {
    var unionSize = new Set(__spread(a, b)).size;
    var isectSize = a.size + b.size - unionSize;
    return { unionSize: unionSize, isectSize: isectSize };
}
