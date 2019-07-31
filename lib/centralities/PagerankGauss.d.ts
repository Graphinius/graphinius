import * as $G from '../core/base/BaseGraph';
declare class pageRankDetCentrality {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean): {
        [id: string]: number;
    };
}
export { pageRankDetCentrality };
