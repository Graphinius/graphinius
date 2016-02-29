/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import _ = require('lodash');


export interface BFSResult {
	distance	:	number;
	parent		:	$N.IBaseNode;
	counter		: number; // order of discovery
}


function BFS(graph : $G.IGraph, v : $N.IBaseNode) : {[id: string] : BFSResult} {
	var result : {[id: string] : BFSResult} = {};			
	
	var nodes = graph.getNodes();
	for ( var key in nodes ) {
		result[key] = {
			distance : Number.POSITIVE_INFINITY,
			parent 	 : null,
			counter	 : -1
		};
	}
	
	var counter = 0;	
	var queue : Array<$N.IBaseNode> = [];
	queue.push(v);
  
	result[v.getID()] = {
		distance	: 0,
		parent		: v,
		counter		: counter++
	};
	
	var i = 0;
	while ( i < queue.length ) {
		var current = queue[i++];
		var adj_nodes = current.adjNodes();
		for ( var adj_idx in adj_nodes ) {
			var adj_node = adj_nodes[adj_idx].node;
			if ( result[adj_node.getID()].distance === Number.POSITIVE_INFINITY ) {
				result[adj_node.getID()] = {
					distance : result[current.getID()].distance + 1,
					parent 	 : current,
					counter	 : counter++
				}
				queue.push(adj_node);
			}
		}
	}
	
	return result;
}


export { BFS };
