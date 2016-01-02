/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import _ = require('lodash');


interface SearchResultEntry {
	distance	:	number;
	parent		:	$N.IBaseNode;
}


function BFS(graph : $G.IGraph, root : $N.IBaseNode) : {[id: string] : SearchResultEntry} {
	var result : {[id: string] : SearchResultEntry} = {};			
	
	var nodes = graph.getNodes();
	for ( var key in nodes ) {
		result[key] = {
			distance : Number.POSITIVE_INFINITY,
			parent : null
		};
	}
	
	var queue : Array<$N.IBaseNode> = [];
	queue.push(root);
	result[root.getID()] = {
		distance	: 0,
		parent		: null
	};
	
	while ( queue.length ) {
		var current = queue.shift();
		var adj_nodes = current.adjNodes();
		for ( var adj_idx in adj_nodes ) {
			var adj_node = adj_nodes[adj_idx];
			if ( result[adj_node.getID()].distance === Number.POSITIVE_INFINITY ) {
				result[adj_node.getID()] = {
					distance : result[current.getID()].distance + 1,
					parent 	 : current
				}
				queue.push(adj_node);
			}
		}
	}
	
	return result;
}


//  1 Breadth-First-Search(Graph, root):
//  2 
//  3     for each node n in Graph:            
//  4         n.distance = INFINITY        
//  5         n.parent = NIL
//  6 
//  7     create empty queue Q      
//  8 
//  9     root.distance = 0
// 10     Q.enqueue(root)                      
// 11 
// 12     while Q is not empty:        
// 13     
// 14         current = Q.dequeue()
// 15     
// 16         for each node n that is adjacent to current:
// 17             if n.distance == INFINITY:
// 18                 n.distance = current.distance + 1
// 19                 n.parent = current
// 20                 Q.enqueue(n)

export { BFS, SearchResultEntry };
