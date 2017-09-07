/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $E from '../core/Edges';
import * as $SU from '../utils/structUtils'
import {DEFAULT_WEIGHT} from "./PFS";

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

function FloydWarshall(graph: $G.IGraph): {} {
	let dists = {},
		edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);


	for (let edge in edges){
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

export { FloydWarshallSparse,
				 FloydWarshallDense, FloydWarshall}; // , getAllShortestPaths };
