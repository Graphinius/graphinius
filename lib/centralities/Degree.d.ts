import * as $G from '../core/base/BaseGraph';
export declare enum DegreeMode {
    in = 0,
    out = 1,
    und = 2,
    dir = 3,
    all = 4
}
export interface DegreeDistribution {
    in: Uint32Array;
    out: Uint32Array;
    dir: Uint32Array;
    und: Uint32Array;
    all: Uint32Array;
}
declare class DegreeCentrality {
    constructor();
    getCentralityMap(graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode): {
        [id: string]: number;
    };
    degreeDistribution(graph: $G.IGraph): DegreeDistribution;
}
export { DegreeCentrality };
