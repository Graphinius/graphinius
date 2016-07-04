import http = require('http');
/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
declare function retrieveRemoteFile(url: string, cb: Function): http.ClientRequest;
export { retrieveRemoteFile };
