/// <reference types="node" />
import * as http from 'http';
export interface RequestConfig {
    remote_host: string;
    remote_path: string;
    file_name: string;
}
/**
 * @TODO: Test it !!!
 *
 * @param url
 * @param cb
 * @returns {ClientRequest}
 */
declare function retrieveRemoteFile(config: RequestConfig, cb: Function): http.ClientRequest;
export { retrieveRemoteFile };
