import * as $G from '../core/Graph';

export interface ICentrality {
    getCentralityMap(graph: $G.IGraph, weighted?: boolean) : {[id:string]: number};
    //getCentralityHistogram(graph: $G.IGraph) : DegreeDistribution
}

/*
* Next steps:
* * Histograms
* * Weighted/unweighted versions
* */