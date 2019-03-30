import * as $G from '../core/Graph';
export interface KROLConfig {
    genMat: Array<Array<number>>;
    cycles: number;
}
export interface KROLResult {
    graph: $G.IGraph;
}
export interface IKROL {
    generate(): KROLResult;
    prepareKROLStandardConfig(): KROLConfig;
}
declare class KROL implements IKROL {
    private _config;
    private _genMat;
    private _cycles;
    private _graph;
    constructor(config?: KROLConfig);
    generate(): KROLResult;
    addEdge(node1: number, node2: number, dims: number): boolean;
    prepareKROLStandardConfig(): KROLConfig;
}
export { KROL };
