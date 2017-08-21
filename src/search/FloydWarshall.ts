/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $E from '../core/Edges';
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
function FloydWarshallSparse(graph: $G.IGraph) : {} { //  config = { directed: false }
	//return {};
	let dists = {},
		next = {},
		adj_list = graph.adjListArray(true,true),
		edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);

	for (let edge in edges){
		let a = edges[edge].getNodes().a.getID();
		let b = edges[edge].getNodes().b.getID();
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
		dists[a][b] = edges[edge].getWeight();
		if(!edges[edge].isDirected()){
			if(dists[b]==null)
				dists[b] = {};
			dists[b][a] = edges[edge].getWeight();
		}
	}
	console.log(adj_list);
	for (var k in adj_list) {
		for (var i in adj_list) {
			for (var j in adj_list) {

				if (i === j) {
					continue;
				}
				if (dists[i][k] == null || dists[k][j] == null) {
					continue;
				}
				if ( dists[i][j] == (dists[i][k] + dists[k][j]) && next[i][j]!=next[i][k]) {
					//Why do we need this .indexOf? It should not be added two times... TODO
					if(checkPathItoK(i,k,j,next) && checkPathKtoJ(i,k,j,next) && next[i][j].indexOf(next[i][k])<0){
						next[i][j].push(next[i][k].slice(0));
						next[i][j] = flatten(next[i][j]);
					}
				}
				if ((!dists[i][j] && dists[i][j] != 0) || ( dists[i][j] > dists[i][k] + dists[k][j] )) {
					if (next[i] == null)
						next[i] = {};

					next[i][j] = next[i][k].slice(0);
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return [dists,next];
}



function FloydWarshallDense(graph: $G.IGraph): {} {
	let dists = {},
			next = {},
			edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);

	for (let edge in edges){
		let a = edges[edge].getNodes().a.getID();
		let b = edges[edge].getNodes().b.getID();
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
		dists[a][b] = edges[edge].getWeight();
		if(!edges[edge].isDirected()){
			if(dists[b]==null)
				dists[b] = {};
			dists[b][a] = edges[edge].getWeight();
		}
	}

	for (var k in dists) {
		for (var i in dists) {
			for (var j in dists) {

				if (i === j) {
					continue;
				}
				if (dists[i][k] == null || dists[k][j] == null) {
					continue;
				}
				if ( dists[i][j] == (dists[i][k] + dists[k][j]) && next[i][j]!=next[i][k]) {
					//Why do we need this .indexOf? It should not be added two times... TODO
					if(checkPathItoK(i,k,j,next) && checkPathKtoJ(i,k,j,next) && next[i][j].indexOf(next[i][k])<0){
						next[i][j].push(next[i][k].slice(0));
						next[i][j] = flatten(next[i][j]);
					}
				}
				if ((!dists[i][j] && dists[i][j] != 0) || ( dists[i][j] > dists[i][k] + dists[k][j] )) {
					if (next[i] == null)
						next[i] = {};

					next[i][j] = next[i][k].slice(0);
					dists[i][j] = dists[i][k] + dists[k][j];
				}
			}
		}
	}

	return [dists,next];
}

function checkPathItoK(i,k,j,next){
	if(next[i][k]==k || next[i][k].indexOf(k)>=0)
		return true;
	i = next[i][k];
	if(i==j)
		return false;
	if(i.indexOf(k)<0){
		let ret = false;
		for(let e of k){
			if(e==k)
				return true;
			if (checkPathItoK(e, k, j,  next)) ret = true;
		}
		if(!ret) return false;
	}
	return true;
}
function checkPathKtoJ(i,k,j,next)
{
	if(next[k][j]==j) return true;
	k = next[k][j];
	if(k.indexOf(j)<0){
		let ret = false;
		for(let e of k){
			if(e!=i) {
				if (checkPathKtoJ(i, e, j, next)) ret = true;
			}
		}
		if(!ret) return false;
	}

	return true;
}

//Taken from Noah Freitas:
//https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
function flatten(arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	}, []);
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

export { FloydWarshallSparse,
				 FloydWarshallDense }; // , getAllShortestPaths };
