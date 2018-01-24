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

//returns the array dists, 
//which is a 2d array
//containing initial distance values after going through the edges
function initializeDistsWithEdges(graph: $G.IGraph) {
	//info: here, dists is a dictionary, not yet an array
	let dists = {},

		//info: the getters below give a dict as an output
		edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);

	for (let edge in edges) {

		let a = edges[edge].getNodes().a.getID();
		let b = edges[edge].getNodes().b.getID();

		if (dists[a] == null)
			dists[a] = {};

		dists[a][b] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
		if (!edges[edge].isDirected()) {
			if (dists[b] == null)
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
//returns a 2d array dists and a 3d array next (sort of parent nodes)
//going through each possible intermediate nodes (labeled as k), 
//checking if k introduces a shorter path between the nodes i and j
function FloydWarshallAPSP(graph: $G.IGraph): {} {
	if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}

	let dists: $G.MinAdjacencyListArray = graph.adjListArray();
	let next: $G.NextArray = graph.nextArray();

	let N = dists.length;
	for (var k = 0; k < N; ++k) {
		for (var i = 0; i < N; ++i) {
			for (var j = 0; j < N; ++j) {
				if (dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j) {
					next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
				}

				if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
					//info: slice(0) returns the array itself, unmodified
					//so practically copying the array contents next [i][k] into the array next [i][j]
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
function FloydWarshallArray(graph: $G.IGraph): $G.MinAdjacencyListArray {
	if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}

	let dists = graph.adjListArray();
	let N = dists.length;

	for (var k = 0; k < N; ++k) {
		for (var i = 0; i < N; ++i) {
			for (var j = 0; j < N; ++j) {
				if (dists[i][j] > dists[i][k] + dists[k][j]) {
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
function FloydWarshall(graph: $G.IGraph): {} {
	if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
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
				if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return dists;
}

//I give this up for today.
function changeNextToDirectParents(input: $G.NextArray, graph: $G.IGraph): $G.NextArray {
	let originalNext = graph.nextArray();
	var input:$G.NextArray=input;
	let output: $G.NextArray = graph.nextArray();
	
	
	let N = input.length;
	for (var a = 0; a < N; ++a) {
		for (var b = 0; b < N; ++b) {
			//if a==b, no update needed
			//if node is not reachable, no update, either
			if (input[a][b] = [null]) {
				continue;
			}

			if (a!=b && input[a][b].length == 1 && input[a][b][0] != originalNext[a][b][0]){

			}

			


			//if a==b, or b is the only direct parent of a, this will prove false. In all other cases, it is true
			else if (a != b && !(input[a][b].length == 1 && input[a][b][0] == b)) {
				output[a][b] = [];
				update(a, b, input, output, originalNext, a);
			}
		}
	}
	return output;
}

function update(u:number, v:number, next: $G.NextArray, out:$G.NextArray, original : $G.NextArray, start:number): void {
	
	for (let e = 0; e < next[u][v].length; e++) {
		if (next[u][v][e] != original[u][v][0]) {
			if (next[u][v][e] != original[u][v][0]) {
				u = next[u][v][e];
				update(u, v, next, out, original, start);
			}
			out[start][v].push(u);
		}
		else {
			out[start][v].push(next[u][v][e]);
		}
	}
}


export {
	FloydWarshallAPSP,
	FloydWarshallArray,
	FloydWarshall,
	changeNextToDirectParents
};
