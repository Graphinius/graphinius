/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
export interface BFArrrayResult {
    distances: Array<number>;
    neg_cycle: boolean;
}
export interface BFDictResult {
    distances: {};
    neg_cycle: boolean;
}
declare function BellmanFordArray(graph: $G.IGraph, start: $N.IBaseNode): BFArrrayResult;
/**
 *
 * @param graph
 * @param start
 */
declare function BellmanFordDict(graph: $G.IGraph, start: $N.IBaseNode): BFDictResult;
export { BellmanFordDict, BellmanFordArray };
