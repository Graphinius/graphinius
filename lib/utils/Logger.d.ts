export interface LOG_CONFIG {
    log_level: string;
}
export declare enum LogColors {
    FgBlack = 30,
    FgRed = 31,
    FgGreen = 32,
    FgYellow = 33,
    FgBlue = 34,
    FgMagenta = 35,
    FgCyan = 36,
    FgWhite = 37,
    BgBlack = 40,
    BgRed = 41,
    BgGreen = 42,
    BgYellow = 43,
    BgBlue = 44,
    BgMagenta = 45,
    BgCyan = 46,
    BgWhite = 47
}
declare class Logger {
    config: LOG_CONFIG;
    constructor(config?: any);
    log(msg: any, color?: any, bright?: boolean): boolean;
    error(err: any, color?: any, bright?: boolean): boolean;
    dir(obj: any, color?: any, bright?: boolean): boolean;
    info(msg: any, color?: any, bright?: boolean): boolean;
    warn(msg: any, color?: any, bright?: boolean): boolean;
    write(msg: any, color?: any, bright?: boolean): boolean;
    static colorize(color: any, output: any, bright: any): string;
}
export { Logger };
