import * as $G from '../core/base/BaseGraph';
declare class PagerankGauss {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean): {
        [id: string]: number;
    };
}
export { PagerankGauss };
