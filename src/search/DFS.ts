/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import _ = require('lodash');



interface DFS_Visit_Results {
	parent		: $N.IBaseNode;
	counter 	: number;
}


interface DFS_Visit_Callbacks {
	counter? : Function;	
}


interface StackEntry {
	node		: $N.IBaseNode;
	parent	: $N.IBaseNode;
}


function DFSVisit(graph 				: $G.IGraph, 
									current_root 	: $N.IBaseNode,
									results?			: {[id: string] : DFS_Visit_Results},
									callbacks			: DFS_Visit_Callbacks = {}) {										
	
	var	marked_temp : {[id: string] : boolean} = {};
	
	
	var stack : Array<StackEntry> = [];
	stack.push({
		node		: current_root,
		parent	: current_root
	});
	
	/**
	 * We only need to populate a result object if it is
	 * required by an outside caller. In case of e.g.
	 * cycle detection this will be unnecessary, and in
	 * case of toposort the structure will be different.
	 */
	if ( results ) {
		results[current_root.getID()] = {
			parent 	: current_root,
			counter : callbacks.counter ? callbacks.counter() : undefined
		};
	}
	
	while ( stack.length ) {
		var stack_entry = stack.pop();
		var current = stack_entry.node;
		
		if ( !marked_temp[current.getID()] ) {			
			marked_temp[current.getID()] = true;
			
			/**
			 * Again, we only populate a results object if provided
			 */
			if ( results ) {				
				results[current.getID()] = {
					parent 	: stack_entry.parent,
					counter : callbacks.counter ? callbacks.counter() : undefined
				}
			}
						
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
}







function DFS(graph : $G.IGraph) {
		
	// var nodes = graph.getNodes();
	// for ( var key in nodes ) {
	// 	result[key] = {
	// 		parent 		: null,
	// 		// toposort	: Number.NEGATIVE_INFINITY,
	// 		counter		: -1
	// 	};
	// 	visited[key] = false;
	// }
	
	
}


export { DFSVisit, DFS, DFS_Visit_Results, DFS_Visit_Callbacks };
