/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
/**
 * Floyd-Warshall - we mostly use it to get In-betweenness
 * of a graph. We use the standard algorithm and save all
 * the shortest paths we find.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values, m*m*m matrix of neighbors
 * @constructor
 */
declare function FloydWarshallAPSP(graph: $G.IGraph): {};
/**
 * Floyd-Warshall - we mostly use it for Closeness centrality.
 * This is the array version, which means the returned matrix
 * is not accessible with node IDs but rather with their indices.
 * It also is faster than the dict version.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
declare function FloydWarshallArray(graph: $G.IGraph): $G.MinAdjacencyListArray;
/**
 * Floyd-Warshall - we mostly use it for Closeness centrality.
 * This is the dict version, which means the returned matrix
 * is accessible with node IDs
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
declare function FloydWarshallDict(graph: $G.IGraph): {};
declare function changeNextToDirectParents(input: $G.NextArray): $G.NextArray;
export { FloydWarshallAPSP, FloydWarshallArray, FloydWarshallDict, changeNextToDirectParents };
