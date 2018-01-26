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
				//-new fix from Rita, i!=j -> if it is not there, zero-weight edges generate false parents
				if (dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j && i!=j) {

					//original line of code
					//next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);

					//-a new fix from Rita- However, this fix makes it faster on the midsize graph!
					//if a node is unreachable, the corresponding value in next should not be updated, but stay null
					if (dists[i][j] == Number.POSITIVE_INFINITY) {
						continue;
					}
					else {
						next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
					}
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

function changeNextToDirectParents(input: $G.NextArray, graph: $G.IGraph): $G.NextArray {
	let output: Array<Array<Array<number>>> = [];
	//build the output and make it a copy of the input
	for (let a = 0; a < input.length; a++) {
		output.push([]);
		for (let b = 0; b < input.length; b++) {
			output[a].push([]);
			output[a][b] = input[a][b];
		}
	}

	for (let a = 0; a < input.length; a++) {
		for (let b = 0; b < input.length; b++) {
			//when unreachable, no update needed
			if (input[a][b] == null) {
				continue;
			}

			else if (a != b && !(input[a][b].length == 1 && input[a][b][0] == b)) {
				output[a][b] = [];
				findDirectParents(a, b, input, output);
			}
		}
	}

	return output;
}

//new try
function findDirectParents(u, v, inNext, outNext): void {
	let nodesInTracking: Array<number>;

	nodesInTracking = inNext[u][v];

	while (nodesInTracking.length > 0) {
		let currNode = nodesInTracking.pop();
		if (inNext[currNode][v].length == 1 && inNext[currNode][v][0] == v) {
			outNext[u][v] = outNext[u][v].length == 0 ? [currNode == u ? v : currNode] :
				$SU.mergeOrderedArraysNoDups(outNext[u][v], [currNode == u ? v : currNode]);
		}

		else {
			for (let node of inNext[currNode][v]) {
				if (node == v) {
					outNext[u][v] = outNext[u][v].length == 0 ? [currNode == u ? v : currNode] :
						$SU.mergeOrderedArraysNoDups(outNext[u][v], [currNode == u ? v : currNode]);
				}
				else {
					nodesInTracking = $SU.mergeOrderedArraysNoDups(nodesInTracking, [node]);
				}
			}
		}
	}
}


//old versions, do not run them, in their present state they give an infinite loop!
/*let directIsThere = false;

for (let e = 0; e < inNext[u][v].length; e++) {
}
	
for (let f = 0; f < inNext[u][v].length; f++) {
	if (inNext[u][v][f] == v)
		directIsThere = true;
}
if (directIsThere = true && inNext[u][v].length == 1) {
	outNext[start][v].push(v);
	break;
}

else if (directIsThere = true && inNext[u][v][e] == v) {
	outNext[start][v].push(v);
	continue;
}
else {
	while (true) {
		u = inNext[u][v][e];
		if (inNext[u][v][e] == v) {
			outNext[start][v].push(u);
			break;
		}
	}
}*/

/*let shortcut: boolean = false;


for (let f = 0; f < inNext[u][v].length; f++) {
	if (inNext[u][v][f] == v) {
		outNext[start][v].push(v);
		shortcut = true;
	}
}

while (true) {
	u = inNext[u][v][e];
	for (let g = 0; g < inNext[u][v].length; g++) {
		if (inNext[u][v][g] == v) {
			outNext[start][v].push(u);
			break;
		}
	}
}
*/






export {
	FloydWarshallAPSP,
	FloydWarshallArray,
	FloydWarshall,
	changeNextToDirectParents
};
