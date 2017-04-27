/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';

/**
 * Floyd-Warshall - we mostly use it to get In-betweenness
 * of a graph. We use the standard algorithm and save all
 * the shortest paths we find.
 * 
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshall(graph 	 : $G.IGraph) : number[][] {

	let ret:number[][] = [][];
	/**
	 * We are not traversing an empty graph...
	 */
	if ( graph.getMode() === $G.GraphMode.INIT ) {
		throw new Error('Cowardly refusing to traverse graph without edges.');
	}
	/**
	 * We are not traversing a graph taking NO edges into account
	 */
	if ( dir_mode === $G.GraphMode.INIT ) {
		throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	}

  	/*
	  let dist be a |V| × |V| array of minimum distances initialized to ∞ (infinity)
	  for each vertex v
	     dist[v][v] ← 0
	  for each edge (u,v)
	     dist[u][v] ← w(u,v)  // the weight of the edge (u,v)
	  for k from 1 to |V|
	     for i from 1 to |V|
	        for j from 1 to |V|
	           if dist[i][j] > dist[i][k] + dist[k][j]
	               dist[i][j] ← dist[i][k] + dist[k][j]
	           end if
  	 */


	return ret;
}

export { FloydWarshall };
