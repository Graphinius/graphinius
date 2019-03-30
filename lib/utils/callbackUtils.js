"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function execCallbacks(cbs, context) {
    cbs.forEach(function (cb) {
        if (typeof cb === 'function') {
            cb(context);
        }
        else {
            throw new Error('Provided callback is not a function.');
        }
    });
}
exports.execCallbacks = execCallbacks;
