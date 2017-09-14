/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $E from '../core/Edges';
import * as $SU from '../utils/structUtils'
import {DEFAULT_WEIGHT} from "./PFS";

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
 * @param sparse option to speed up calculation on sparse graphs
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshallAPSP(graph: $G.IGraph): {} {
	if ( graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0 ) {
		throw new Error("Cowardly refusing to traverse graph without edges.");
	}

	/*let dists = {},
			next = {},
			edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);

	for (let edge in edges){
		let a = String(edges[edge].getNodes().a.getID());
		let b = String(edges[edge].getNodes().b.getID());

		if(edges[edge].getWeight()<=0)
			throw new Error('Cannot compute FW on negative edges');
		if(next[a] == null)
			next[a] = {};
		next[a][b] = [b];
		if(!edges[edge].isDirected()){
			if(next[b]==null)
				next[b] = {};
			next[b][a] = [a];
		}

		if(dists[a]==null)
			dists[a] = {};
		if(dists[b]==null)
			dists[b] = {};
		dists[a][b] = edges[edge].getWeight();
		if(!edges[edge].isDirected()){
			dists[b][a] = edges[edge].getWeight();
		}
	}*/
	let dists = graph.adjListArray();
	let next  = graph.nextArray();
	//console.log("NEXT:"+JSON.stringify(next));
	console.log("STARTING");
	let N = dists.length;
	for (var k = 0; k < N; ++k) {
		for (var i = 0; i < N; ++i) {
			for (var j = 0; j < N; ++j) {
				if ( dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j){
					//!(next[i][j].length==next[i][k].length && next[i][j].every((v,s) => v === next[i][k][s]))) {
					//if(next[i][j].indexOf(next[i][k])<0){
						//console.log("Before Add:"+next[i][j] +" i: "+i+" j: "+j + " k: "+k);
						next[i][j].push(next[i][k].slice(0));
						next[i][j] = flatten(next[i][j]);
						//only unique entries in next
						(next[i][j]) = next[i][j].filter((elem,pos,arr) => arr.indexOf(elem) == pos);
						//console.log("After Add:"+next[i][j] );
					//}
				}
				if ((!dists[i][j] && dists[i][j] != 0) || ( dists[i][j] > dists[i][k] + dists[k][j] )) {
					//console.log("Before:"+next[i][j]  +" i: "+i+" j:"+j + " k: "+k);
					next[i][j] = next[i][k].slice(0);
					dists[i][j] = dists[i][k] + dists[k][j];
					//console.log("After:"+next[i][j] );
				}
			}
		}
	}
	console.log("NEXT:"+JSON.stringify(next));
	console.log("Returning...");
	return [dists,next];
}


function FloydWarshallArray(graph: $G.IGraph) : {} {
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
