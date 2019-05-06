import { IGraph } from '../core/Graph';
export declare type RankMap = {
    [id: string]: number;
};
export interface PrRandomWalkConfig {
    weighted?: boolean;
    alpha?: number;
    alphaDamp?: Function;
    convergence?: number;
    iterations?: number;
    init?: Function;
}
export declare class PageRankRandomWalk {
    private _graph;
    private _weighted;
    private _alpha;
    private _alphaDamp;
    private _convergence;
    private _maxIterations;
    private _init;
    private _PRArrayDS;
    constructor(_graph: IGraph, config?: PrRandomWalkConfig);
    setPRArrayDataStructs(): void;
    getPRArray(): RankMap;
    private getRankMapFromArray;
    getPRDict(): RankMap;
}
