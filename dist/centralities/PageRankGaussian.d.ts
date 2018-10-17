/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
declare class pageRankDetCentrality {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean): {
        [id: string]: number;
    };
}
export { pageRankDetCentrality };
