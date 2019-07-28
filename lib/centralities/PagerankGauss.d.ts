import * as $G from '../core/BaseGraph';
declare class pageRankDetCentrality {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean): {
        [id: string]: number;
    };
}
export { pageRankDetCentrality };
