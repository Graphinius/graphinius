/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
/**
 * DEMO Version of a betweenness centrality computed via Johnson's or FloydWarshall algorithm
 *
 * @param graph the graph to perform Floyd-Warshall/Johnsons on
 * @param directed for normalization, not used at the moment
 * @param sparse decides if using the FW (dense) or Johnsons (sparse)
 *
 * @returns m*m matrix of values (dist), m*m*m matrix of neighbors (next)
 * @constructor
 *
 * @comment function gives the correct results but is slow.
 *
 * !!! DO NOT USE FOR PRODUCTION !!!
 *
 * @todo decide if we still need it...
 */
declare function betweennessCentrality(graph: $G.IGraph, directed: boolean, sparse?: boolean): {};
export { betweennessCentrality };
