export interface LOG_CONFIG {
    log_level: string;
}
declare class Logger {
    config: LOG_CONFIG;
    constructor(config?: any);
    log(msg: any): boolean;
    error(err: any): boolean;
    dir(obj: any): boolean;
    info(msg: any): boolean;
    warn(msg: any): boolean;
}
export { Logger };
