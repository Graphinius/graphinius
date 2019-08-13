"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var Logger_1 = require("./Logger");
var logger = new Logger_1.Logger();
var SSL_PORT = '443';
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
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            cb(body);
        });
    });
    req.on('error', function (e) {
        logger.log("Request error: " + e.message);
    });
    return req;
}
exports.retrieveRemoteFile = retrieveRemoteFile;
function checkNodeEnvironment() {
    if (typeof window !== 'undefined') {
        throw new Error('When in Browser, do as the Browsers do! (use fetch and call readFromJSON() directly...) ');
    }
}
exports.checkNodeEnvironment = checkNodeEnvironment;
