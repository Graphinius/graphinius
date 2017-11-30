/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $SU from '../utils/structUtils'

interface FWConfig {
	directed: boolean;
}


/**
 * Initializes the distance matrix from each node to all other node
 * using the edges of the graph
 *
 * @param graph the graph for which to calculate the distances
 * @returns m*m matrix of values
 * @constructor
 */
//returns a series of 2d arrays with initial distance values
//and filling up all sub-arrays with some value 
//first  (outer) array: belongs to starting node, second (inner) array: target node distance
function initializeDistsWithEdges(graph: $G.IGraph) {
	let dists = {},
	edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);

	for (let edge in edges) {
		let a = edges[edge].getNodes().a.getID();
		let b = edges[edge].getNodes().b.getID();
		//===================
		//can one build and fill an array without first initializing the arrays themselves?
		//dists is initialized simply as an object, not as an array
		if(dists[a]==null)
			dists[a] = {};

		dists[a][b] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
		if(!edges[edge].isDirected()){
			if(dists[b]==null)
				dists[b] = {};
			dists[b][a] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
		}
	}

	return dists;
}


/**
 * Floyd-Warshall - we mostly use it to get In-betweenness
 * of a graph. We use the standard algorithm and save all
 * the shortest paths we find.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values, m*m*m matrix of neighbors
 * @constructor
 */
//returns a 2d array dists and a 3d array next (paths)
function FloydWarshallAPSP(graph: $G.IGraph): {} {
	if ( graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0 ) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}

	let dists : $G.MinAdjacencyListArray = graph.adjListArray();
	let next : $G.NextArray  = graph.nextArray();

	let N = dists.length;
	for (var k = 0; k < N; ++k) {
		for (var i = 0; i < N; ++i) {
			for (var j = 0; j < N; ++j) {
				if ( dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j) {
					next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
				}
				//======================
				//first 2 condition of the if (stuff before the ||) is not clear for me, don't they rule out each other?
				if ((!dists[i][j] && dists[i][j] != 0) || ( dists[i][j] > dists[i][k] + dists[k][j] )) {
					//info: slice(0) means a duplication of the array
					next[i][j] = next[i][k].slice(0);
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return [dists, next];
}

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
function FloydWarshallArray(graph: $G.IGraph) : $G.MinAdjacencyListArray {
	if ( graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0 ) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}

	let dists = graph.adjListArray();
	let N = dists.length;

	for (var k = 0; k < N; ++k) {
		for (var i = 0; i < N; ++i) {
			for (var j = 0; j < N; ++j) {
				if ( dists[i][j] > dists[i][k] + dists[k][j] ) {
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return dists;
}


/**
 * Floyd-Warshall - we mostly use it for Closeness centrality.
 * This is the dict version, which means the returned matrix
 * is accessible with node IDs
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshall(graph: $G.IGraph) : {} {
	if ( graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0 ) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}
	let dists = initializeDistsWithEdges(graph);

	for (var k in dists) {
		for (var i in dists) {
			for (var j in dists) {

				if (i === j) {
					continue;
				}
				if (dists[i][k] == null || dists[k][j] == null) {
					continue;
				}
				if ((!dists[i][j] && dists[i][j] != 0) || ( dists[i][j] > dists[i][k] + dists[k][j] )) {
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return dists;
}

export {FloydWarshallAPSP, 
				FloydWarshallArray,
				FloydWarshall
			};
