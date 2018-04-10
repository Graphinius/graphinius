import * as http from 'http';
import * as https from 'https';
import {Logger} from '../utils/logger';

const logger = new Logger();
const SSL_PORT = '443';

export interface RequestConfig {
	remote_host: string,
	remote_path: string,
	file_name: string
}

/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
function retrieveRemoteFile(config: RequestConfig, cb: Function) {
  if ( typeof cb !== 'function' ) {
    throw new Error('Provided callback is not a function.');
  }

  logger.log(`Requesting file via NodeJS request: ${config.remote_host}${config.remote_path}${config.file_name}`);

  let options : https.RequestOptions = {
    host: config.remote_host,
    port: SSL_PORT,
    path: config.remote_path + config.file_name,
    method: 'GET'
  };

  let req = https.get(options, response => {

    // Continuously update stream with data
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // Received data in body...
      cb(body);
    });
  });

  req.on('error', e => {
    logger.log(`Request error: ${e.message}`);
  });
  
  return req;
}

export { retrieveRemoteFile };
