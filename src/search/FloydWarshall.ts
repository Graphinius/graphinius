/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $SU from '../utils/structUtils'

interface FWConfig {
	directed: boolean;
}


function initializeDistsWithEdges(graph: $G.IGraph) {
	let dists = {},
	edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);

	for (let edge in edges) {
		let a = edges[edge].getNodes().a.getID();
		let b = edges[edge].getNodes().b.getID();

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
 * @returns m*m matrix of values
 * @constructor
 */
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
					next[i][j] = mergeArrays(next[i][j], next[i][k]);
				}
				if ((!dists[i][j] && dists[i][j] != 0) || ( dists[i][j] > dists[i][k] + dists[k][j] )) {
					next[i][j] = next[i][k].slice(0);
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return [dists,next];
}

function mergeArrays(a:Array<number>,b:Array<number>):Array<number>{
	let ret:Array<number> = [];
	let idx_a = 0;
	let idx_b = 0;
	if(a[0]!=null && b[0]!=null){
		while(true){
			if(idx_a >= a.length || idx_b >= b.length)
				break;

			if(a[idx_a] == b[idx_b]){
				if(ret[ret.length-1]!=a[idx_a])
					ret.push(a[idx_a]);
				idx_a++;
				idx_b++;
				continue;
			}
			if(a[idx_a] < b[idx_b]){
				ret.push(a[idx_a]);
				idx_a++;
				continue;
			}
			if(b[idx_b] < a[idx_a]){
				ret.push(b[idx_b]);
				idx_b++;
			}
		}
		if( a[idx_a] > b[idx_b] ) {
			ret.push(b[idx_b]);
			idx_b++;
		}
	}
	while(idx_a < a.length){
		ret.push(a[idx_a]);
		idx_a++;
	}
	while(idx_b < b.length){
		ret.push(b[idx_b]);
		idx_b++;
	}
	return ret;
}


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

//Taken from Noah Freitas:
//https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
function flatten(arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	}, []);
}

export {FloydWarshallAPSP, 
				FloydWarshallArray,
				FloydWarshall
			};
