/// <reference types="node" />
import * as http from 'http';
export interface RequestConfig {
    remote_host: string;
    remote_path: string;
    file_name: string;
}
export declare function retrieveRemoteFile(config: RequestConfig, cb: Function): http.ClientRequest;
export declare function checkNodeEnvironment(): void;
