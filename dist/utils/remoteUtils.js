"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
var SSL_PORT = '443';
/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
function retrieveRemoteFile(config, cb) {
    if (typeof cb !== 'function') {
        throw new Error('Provided callback is not a function.');
    }
    logger.log("Requesting file via NodeJS request: " + config.remote_host + config.remote_path + config.file_name);
    var options = {
        host: config.remote_host,
        port: SSL_PORT,
        path: config.remote_path + config.file_name,
        method: 'GET'
    };
    var req = https.get(options, function (response) {
        // Continuously update stream with data
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // Received data in body...
            cb(body);
        });
    });
    req.on('error', function (e) {
        logger.log("Request error: " + e.message);
    });
    return req;
}
exports.retrieveRemoteFile = retrieveRemoteFile;
