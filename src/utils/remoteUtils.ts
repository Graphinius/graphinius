import http = require('http');

/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
function retrieveRemoteFile(url: string, cb: Function) {
  if ( typeof cb !== 'function' ) {
    throw new Error('Provided callback is not a function.');
  }
  
  return http.get(url, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // Received data in body...
      cb(body);
    });
  });
}

export { retrieveRemoteFile };