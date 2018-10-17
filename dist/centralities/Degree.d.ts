/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
export declare enum DegreeMode {
    in = 0,
    out = 1,
    und = 2,
    dir = 3,
    all = 4,
}
/**
 * @TODO per edge type ???
 */
export interface DegreeDistribution {
    in: Uint32Array;
    out: Uint32Array;
    dir: Uint32Array;
    und: Uint32Array;
    all: Uint32Array;
}
declare class DegreeCentrality {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode): {
        [id: string]: number;
    };
    /**
     * @TODO Weighted version !
   * @TODO per edge type !
     */
    degreeDistribution(graph: $G.IGraph): DegreeDistribution;
}
export { DegreeCentrality };
