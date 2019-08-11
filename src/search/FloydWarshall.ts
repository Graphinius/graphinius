import * as $G from '../core/base/BaseGraph';
import * as $SU from '../utils/StructUtils'


const DEFAULT_WEIGHT = 1;

/**
 * @todo FW directed mode ??
 */



/**
 * Floyd-Warshall - we mostly use it to get the Betweenness
 * of a graph. We use the standard algorithm and save all
 * the shortest paths we find.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values, m*m*m matrix of neighbors
 * @constructor
 */
function FloydWarshallAPSP(graph: $G.IGraph): {} {
	if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}

	let dists: $G.MinAdjacencyListArray = graph.adjListArray();
	let next: $G.NextArray = graph.nextArray();

	let N = dists.length;
	for (let k = 0; k < N; ++k) {
		for (let i = 0; i < N; ++i) {
			for (let j = 0; j < N; ++j) {
				if (k != i && k != j && i != j && dists[i][j] == (dists[i][k] + dists[k][j]) ) {
					//if a node is unreachable, the corresponding value in next should not be updated, but stay null
					if (dists[i][j] !== Number.POSITIVE_INFINITY) {
						next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
					}
				}

				if (k != i && k != j && i != j && dists[i][j] > dists[i][k] + dists[k][j]) {
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

	for (let k = 0; k < N; ++k) {
		for (let i = 0; i < N; ++i) {
			for (let j = 0; j < N; ++j) {
				if (k != i && k != j && i != j && dists[i][j] > dists[i][k] + dists[k][j]) {
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}
	return dists;
}


function changeNextToDirectParents(input: $G.NextArray): $G.NextArray {
	let output: Array<Array<Array<number>>> = [];
	
	for (let a = 0; a < input.length; a++) {
		output.push([]);
		for (let b = 0; b < input.length; b++) {
			output[a].push([]);
			output[a][b] = input[a][b];
		}
	}

	for (let a = 0; a < input.length; a++) {
		for (let b = 0; b < input.length; b++) {
			
			if ( input[a][b][0] != null
					 && a != b && !(input[a][b].length === 1
					 && input[a][b][0] === b))
			{
				output[a][b] = [];
				findDirectParents(a, b, input, output);
			}
		}
	}
	return output;
}


function findDirectParents(u, v, inNext, outNext): void {
	let nodesInTracking = [u];
	let counter = 0;

	while (nodesInTracking.length > 0) {
		let currNode = nodesInTracking.pop();
		
		if (currNode == u && counter > 0) {
			continue;
		}

		else {
			for (let e = 0; e < inNext[currNode][v].length; e++) {
				if (inNext[currNode][v][e] == v && counter == 0) {
					outNext[u][v] = $SU.mergeOrderedArraysNoDups(outNext[u][v], [v]);
				}
				else if (inNext[currNode][v][e] == v) {
					outNext[u][v] = $SU.mergeOrderedArraysNoDups(outNext[u][v], [currNode]);
				}
				else {
					nodesInTracking = $SU.mergeOrderedArraysNoDups(nodesInTracking, [inNext[currNode][v][e]]);
				}
			}
		}
		counter++;
	}
}


export {
	FloydWarshallAPSP,
	FloydWarshallArray,
	changeNextToDirectParents
};
