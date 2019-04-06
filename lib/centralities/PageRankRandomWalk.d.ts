import * as $G from '../core/Graph';
export declare type RankMap = {
    [id: string]: number;
};
export interface PrRandomWalkConfig {
    weighted?: boolean;
    alpha?: number;
    convergence?: number;
    iterations?: number;
}
export declare class PageRankRandomWalk {
    private _graph;
    private _weighted;
    private _alpha;
    private _convergence;
    private _iterations;
    constructor(_graph: $G.IGraph, config?: PrRandomWalkConfig);
    getCentralityMap(): RankMap;
}
