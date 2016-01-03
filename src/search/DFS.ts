/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import _ = require('lodash');


interface DFS_Result {
	parent		: $N.IBaseNode;
	// toposort	: number;
	counter		: number; // just to check exploration order
}


interface StackEntry {
	node		: $N.IBaseNode;
	parent	: $N.IBaseNode;
}


function DFS(graph : $G.IGraph, root : $N.IBaseNode) : {[id: string] : DFS_Result} {
	var result  : {[id: string] : DFS_Result} = {},
			visited : {[id: string] : boolean} = {};
	

	var nodes = graph.getNodes();
	var toposort = Object.keys(nodes).length;
	
	for ( var key in nodes ) {
		result[key] = {
			parent 		: null,
			// toposort	: Number.NEGATIVE_INFINITY,
			counter		: -1
		};
		visited[key] = false;
	}
	
	var counter = 0;
	var stack : Array<StackEntry> = [];
	stack.push({
		node		: root,
		parent	: root
	});
	result[root.getID()].parent = root;
	
	while ( stack.length ) {
		var stack_entry = stack.pop();
		var current = stack_entry.node;
		
		if ( !visited[current.getID()] ) {
			
			visited[current.getID()] = true;
			result[current.getID()].parent = stack_entry.parent;
			result[current.getID()].counter = counter++;
			
			var adj_nodes = current.adjNodes();
			for ( var adj_idx in adj_nodes ) {
				stack.push({
					node: adj_nodes[adj_idx],
					parent: current
				});
			}			
		}
		else {
			// result[current.getID()].toposort = toposort--;
		}
	}

	return result;
}


export { DFS, DFS_Result };
