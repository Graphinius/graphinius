import * as $G from '../core/Graph';
declare class pageRankCentrality {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean, alpha?: number, conv?: number, iterations?: number): {
        [id: string]: number;
    };
}
export { pageRankCentrality };
