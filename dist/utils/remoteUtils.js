"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
function retrieveRemoteFile(url, cb) {
    if (typeof cb !== 'function') {
        throw new Error('Provided callback is not a function.');
    }
    return https.get(url, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // Received data in body...
            cb(body);
        });
    });
}
exports.retrieveRemoteFile = retrieveRemoteFile;
