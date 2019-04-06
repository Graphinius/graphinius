"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
const SSL_PORT = '443';
function retrieveRemoteFile(config, cb) {
    if (typeof cb !== 'function') {
        throw new Error('Provided callback is not a function.');
    }
    logger.log(`Requesting file via NodeJS request: ${config.remote_host}${config.remote_path}${config.file_name}`);
    let options = {
        host: config.remote_host,
        port: SSL_PORT,
        path: config.remote_path + config.file_name,
        method: 'GET'
    };
    let req = https.get(options, response => {
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            cb(body);
        });
    });
    req.on('error', e => {
        logger.log(`Request error: ${e.message}`);
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
