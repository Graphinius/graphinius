import * as $G from '../core/Graph';
declare class closenessCentrality {
    getCentralityMapFW(graph: $G.IGraph): Array<Number>;
    getCentralityMap(graph: $G.IGraph): {
        [id: string]: number;
    };
}
export { closenessCentrality };
