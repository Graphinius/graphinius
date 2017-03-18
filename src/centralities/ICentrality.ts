import * as $G from '../core/Graph';

export interface ICentrality {
    getCentralityMap(graph: $G.IGraph) : {[id:string]: number};
    //getCentralityHistogram(graph: $G.IGraph) : DegreeDistribution
}