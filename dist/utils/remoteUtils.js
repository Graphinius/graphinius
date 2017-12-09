"use strict";
var http = require('http');
function retrieveRemoteFile(url, cb) {
    if (typeof cb !== 'function') {
        throw new Error('Provided callback is not a function.');
    }
    return http.get(url, function (response) {
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            cb(body);
        });
    });
}
exports.retrieveRemoteFile = retrieveRemoteFile;
