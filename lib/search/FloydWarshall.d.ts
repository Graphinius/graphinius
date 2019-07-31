import * as $G from '../core/base/BaseGraph';
declare function FloydWarshallAPSP(graph: $G.IGraph): {};
declare function FloydWarshallArray(graph: $G.IGraph): $G.MinAdjacencyListArray;
declare function FloydWarshallDict(graph: $G.IGraph): {};
declare function changeNextToDirectParents(input: $G.NextArray): $G.NextArray;
export { FloydWarshallAPSP, FloydWarshallArray, FloydWarshallDict, changeNextToDirectParents };
