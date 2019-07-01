import { IGraph } from '../core/Graph';
import { IBaseNode } from '../core/Nodes';
import { GraphPartitioning } from './Interfaces';
import { BinaryHeap } from '../datastructs/BinaryHeap';
export declare type GainEntry = {
    id: string;
    source: IBaseNode;
    target: IBaseNode;
    gain: number;
};
export interface KL_Costs {
    internal: {
        [key: string]: number;
    };
    external: {
        [key: string]: number;
    };
}
export interface KL_Config {
    initShuffle?: boolean;
    directed?: boolean;
    weighted?: boolean;
}
export interface KL_Open_Sets {
    partition_a: Map<string, boolean>;
    partition_b: Map<string, boolean>;
}
export declare class KLPartitioning {
    private _graph;
    _partitionings: Map<number, GraphPartitioning>;
    _costs: KL_Costs;
    _gainsHeap: BinaryHeap;
    _bestPartitioning: number;
    _currentPartitioning: number;
    _open_sets: KL_Open_Sets;
    _adjList: {};
    private _keys;
    private _config;
    private _gainsHash;
    constructor(_graph: IGraph, config?: KL_Config);
    private initPartitioning;
    private initCosts;
    initGainsHeap(): void;
    performIteration(): void;
    updateCosts(swap_ge: GainEntry): void;
    doSwapAndDropLockedConnections(): GainEntry;
    private removeGainsEntry;
}
