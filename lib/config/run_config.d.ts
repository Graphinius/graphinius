declare const GENERIC_TYPES: {
    NODE: string;
    EDGE: string;
    GRAPH: string;
};
declare const LOG_LEVELS: {
    debug: string;
    production: string;
};
declare function runLevel(): string;
export { LOG_LEVELS, GENERIC_TYPES, runLevel };
