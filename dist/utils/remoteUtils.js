"use strict";
var http = require('http');
/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
function retrieveRemoteFile(url, cb) {
    return http.get(url, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // Received data in body...
            if (cb) {
                cb(body);
            }
        });
    });
}
exports.retrieveRemoteFile = retrieveRemoteFile;
