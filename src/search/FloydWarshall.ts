/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $SU from '../utils/structUtils'

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

	/**
	 * We are not traversing an empty graph...
	 */
	if ( graph.getMode() === $G.GraphMode.INIT ) {
		throw new Error('Cowardly refusing to traverse graph without edges.');
	}
	/**
	 * We are not traversing a graph taking NO edges into account
	 if ( dir_mode === $G.GraphMode.INIT ) {
		throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	}
	 */

	let dist:number[][] = [];
	let edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
	let nodes = graph.getNodes();
	for (let keyA in nodes) {
		//This needs to be done in an extra step, because nodes
		//are not necessarily in order
		dist[keyA] = [];
	}
	for (let keyA in nodes) {
		for (let keyB in nodes) {
			if(keyA===keyB)
				dist[keyA][keyB] = 0;
			else
				dist[keyA][keyB] = Number.MAX_VALUE;
		}
	}

	for (let key in edges) {
		let edge = graph.getEdgeById(key);
		if(edge.getWeight()==null || edge.getNodes().a.getID() == edge.getNodes().b.getID())
		{}
		else{
			if(!edge.isDirected())
				dist[edge.getNodes().b.getID()][edge.getNodes().a.getID()] = edge.getWeight();
			dist[edge.getNodes().a.getID()][edge.getNodes().b.getID()] = edge.getWeight();
		}
	}

	for (let k in nodes)
		for (let i in nodes)
			for (let j in nodes)
				if(dist[i][j] > dist[i][k] + dist[k][j])
					dist[i][j] = dist[i][k] + dist[k][j];

	return dist;
}

export { FloydWarshall };
