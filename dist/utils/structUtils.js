"use strict";
/**
 * Method to deep clone an object
 *
 * @param obj
 * @returns {*}
 *
 */
function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var cloneObj = obj.constructor();
    for (var attribute in obj) {
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
/**
 * @args an Array of any kind of objects
 * @cb callback to return a unique identifier;
 * if this is duplicate, the object will not be stored in result.
 * @returns {Array}
 */
function mergeArrays(args, cb) {
    if (cb === void 0) { cb = undefined; }
    for (var arg_idx in args) {
        if (!Array.isArray(args[arg_idx])) {
            throw new Error('Will only mergeArrays arrays');
        }
    }
    var seen = {}, result = [], identity;
    for (var i = 0; i < args.length; i++) {
        for (var j = 0; j < args[i].length; j++) {
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
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param args Array of all the object to take keys from
 * @returns result object
 */
function mergeObjects(args) {
    for (var i = 0; i < args.length; i++) {
        if (Object.prototype.toString.call(args[i]) !== '[object Object]') {
            throw new Error('Will only take objects as inputs');
        }
    }
    var result = {};
    for (var i = 0; i < args.length; i++) {
        for (var key in args[i]) {
            if (args[i].hasOwnProperty(key)) {
                result[key] = args[i][key];
            }
        }
    }
    return result;
}
exports.mergeObjects = mergeObjects;
/**
 * @TODO Test !!!
 *
 * @param object
 * @param cb
 */
function findKey(obj, cb) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && cb(obj[key])) {
            return key;
        }
    }
    return undefined;
}
exports.findKey = findKey;
