/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $SU from '../utils/structUtils'

interface FWConfig {
	directed: boolean;
}

/**
 * Floyd-Warshall - we mostly use it to get In-betweenness
 * of a graph. We use the standard algorithm and save all
 * the shortest paths we find.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @param sparse option to speed up calculation on sparse graphs
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshall(graph: $G.IGraph, config = { directed: false } ) : {} {

	/**
	 * We are not traversing an empty graph...
	 */
	if ( graph.getMode() === $G.GraphMode.INIT ) {
		throw new Error('Cowardly refusing to traverse graph without edges.');
	}
	
	let edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
	let nodes = graph.getNodes();
	let adj_list = graph.adjList(true, true); // include incoming edges and self

	// console.log( adj_list );

	// let dist = {};
	// for (let keyA in nodes) {
	// 	dist[keyA] = {};
	// 	for (let keyB in nodes) {
	// 		let num = adj_list[keyA][keyB];
	// 		dist[keyA][keyB] = num === num ? num : Number.MAX_VALUE;
	// 	}
	// }

	let pairs_count = 0;

	for (let k in adj_list) {
		for (let i in adj_list[k]) {
			for (let j in adj_list[k]) {
				++pairs_count;

				if ( i === j ) {
					continue;
				}

				if ( !adj_list[i][j] || ( adj_list[i][j] > adj_list[i][k] + adj_list[k][j] ) ) {
					adj_list[i][j] = adj_list[i][k] + adj_list[k][j];
				}
			}
		}
	}

	console.log(`Went through ${pairs_count} candidates for improval`);

	return adj_list;
}
	


// function getShortestPath(next, i, j){
// 	let allPaths = [];
// 	let c = 0;
// 	console.log(i+" j:"+j);
// 	if (!isEmpty(next[i][j]))
// 		for(let k in next[i][j])
// 			if (next[i][j][k] == -1) { // add the path = [i, j]
// 				allPaths.push([i, j]);
// 				c++;
// 			}
// 			else{ // add the path = [i .. k .. j]
// 				let nk = next[i][j][k];
// 				let paths_I_K = getShortestPath(next,i,nk); // get all paths from i to k
// 				let paths_K_J = getShortestPath(next,nk,j); // get all paths from k to j
// 				for (let i_k in paths_I_K)
// 					for (let k_j in paths_K_J) {
// 						let i = paths_K_J[i_k].pop(); // remove the last element since that repeats in k_j
// 						allPaths.push([i, paths_K_J[k_j]]);
// 					}
// 			}

// 	return allPaths;
// }


// function getAllShortestPaths(graph : $G.IGraph, nextMatrix:{}):{}{
// 	let ret = {};
// 	for(let k in graph.getNodes()){
// 		for(let i in graph.getNodes())
// 			ret[k] = getShortestPath(nextMatrix,k,i);
// 	}
// 	return ret;
// }

// var hasOwnProperty = Object.prototype.hasOwnProperty;

// function isEmpty(obj) {

// 	// null and undefined are "empty"
// 	if (obj == null) return true;

// 	// Assume if it has a length property with a non-zero value
// 	// that that property is correct.
// 	if (obj.length > 0)    return false;
// 	if (obj.length === 0)  return true;

// 	// If it isn't an object at this point
// 	// it is empty, but it can't be anything *but* empty
// 	// Is it empty?  Depends on your application.
// 	if (typeof obj !== "object") return true;

// 	// Otherwise, does it have any properties of its own?
// 	// Note that this doesn't handle
// 	// toString and valueOf enumeration bugs in IE < 9
// 	for (var key in obj) {
// 		if (hasOwnProperty.call(obj, key)) return false;
// 	}

// 	return true;
// }

export { FloydWarshall }; // , getAllShortestPaths };
