"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $N = require("../core/base/BaseNode");
const $E = require("../core/base/BaseEdge");
function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof $N.BaseNode || obj instanceof $E.BaseEdge) {
        return;
    }
    let cloneObj = obj.constructor ? obj.constructor() : {};
    for (let attribute in obj) {
        if (!obj.hasOwnProperty(attribute)) {
            continue;
        }
        if (typeof obj[attribute] === "object") {
            cloneObj[attribute] = clone(obj[attribute]);
        }
        else {
            cloneObj[attribute] = obj[attribute];
        }
    }
    return cloneObj;
}
exports.clone = clone;
function shuffleArray(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}
exports.shuffleArray = shuffleArray;
function mergeArrays(args, cb = undefined) {
    for (let arg_idx in args) {
        if (!Array.isArray(args[arg_idx])) {
            throw new Error('Will only mergeArrays arrays');
        }
    }
    let seen = {}, result = [], identity;
    for (let i = 0; i < args.length; i++) {
        for (let j = 0; j < args[i].length; j++) {
            identity = typeof cb !== 'undefined' ? cb(args[i][j]) : args[i][j];
            if (seen[identity] !== true) {
                result.push(args[i][j]);
                seen[identity] = true;
            }
        }
    }
    return result;
}
exports.mergeArrays = mergeArrays;
function mergeObjects(args) {
    for (let i = 0; i < args.length; i++) {
        if (Object.prototype.toString.call(args[i]) !== '[object Object]') {
            throw new Error('Will only take objects as inputs');
        }
    }
    let result = {};
    for (let i = 0; i < args.length; i++) {
        for (let key in args[i]) {
            if (args[i].hasOwnProperty(key)) {
                result[key] = args[i][key];
            }
        }
    }
    return result;
}
exports.mergeObjects = mergeObjects;
function findKey(obj, cb) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && cb(obj[key])) {
            return key;
        }
    }
    return undefined;
}
exports.findKey = findKey;
function mergeOrderedArraysNoDups(a, b) {
    let ret = [];
    let idx_a = 0;
    let idx_b = 0;
    if (a[0] != null && b[0] != null) {
        while (true) {
            if (idx_a >= a.length || idx_b >= b.length)
                break;
            if (a[idx_a] == b[idx_b]) {
                if (ret[ret.length - 1] != a[idx_a])
                    ret.push(a[idx_a]);
                idx_a++;
                idx_b++;
                continue;
            }
            if (a[idx_a] < b[idx_b]) {
                ret.push(a[idx_a]);
                idx_a++;
                continue;
            }
            if (b[idx_b] < a[idx_a]) {
                ret.push(b[idx_b]);
                idx_b++;
            }
        }
    }
    while (idx_a < a.length) {
        if (a[idx_a] != null)
            ret.push(a[idx_a]);
        idx_a++;
    }
    while (idx_b < b.length) {
        if (b[idx_b] != null)
            ret.push(b[idx_b]);
        idx_b++;
    }
    return ret;
}
exports.mergeOrderedArraysNoDups = mergeOrderedArraysNoDups;
