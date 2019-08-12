declare const GENERIC_TYPES: {
    Node: string;
    Edge: string;
    Graph: string;
};
declare const LOG_LEVELS: {
    debug: string;
    production: string;
};
declare function runLevel(): string;
export { LOG_LEVELS, GENERIC_TYPES, runLevel };
