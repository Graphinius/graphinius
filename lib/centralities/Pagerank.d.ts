import { IGraph } from '../core/BaseGraph';
export declare type InitMap = {
    [id: string]: number;
};
export declare type TeleSet = {
    [id: string]: number;
};
export declare type RankMap = {
    [id: string]: number;
};
export interface PRArrayDS {
    curr: Array<number>;
    old: Array<number>;
    out_deg: Array<number>;
    pull: Array<Array<number>>;
    pull_weight?: Array<Array<number>>;
    teleport?: Array<number>;
    tele_size?: number;
}
export interface PagerankRWConfig {
    weighted?: boolean;
    alpha?: number;
    epsilon?: number;
    iterations?: number;
    normalize?: boolean;
    PRArrays?: PRArrayDS;
    personalized?: boolean;
    tele_set?: TeleSet;
    init_map?: InitMap;
}
declare class Pagerank {
    private _graph;
    private _weighted;
    private _alpha;
    private _epsilon;
    private _maxIterations;
    private _normalize;
    private _personalized;
    private _PRArrayDS;
    constructor(_graph: IGraph, config?: PagerankRWConfig);
    getConfig(): {
        _weighted: boolean;
        _alpha: number;
        _maxIterations: number;
        _epsilon: number;
        _normalize: boolean;
    };
    getDSs(): PRArrayDS;
    constructPRArrayDataStructs(config: PagerankRWConfig): void;
    getRankMapFromArray(): RankMap;
    private normalizePR;
    pull2DTo1D(): Array<number>;
    computePR(): RankMap;
}
export { Pagerank };
