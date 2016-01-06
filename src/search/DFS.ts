/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import _ = require('lodash');


interface DFS_Callbacks {
	init_dfs?					: Array<Function>;
	init_dfs_visit?		: Array<Function>;
	node_popped?			: Array<Function>;
	node_marked?			: Array<Function>;
	node_unmarked?		: Array<Function>;
	adj_nodes_pushed?	: Array<Function>;
}


interface StackEntry {
	node		: $N.IBaseNode;
	parent	: $N.IBaseNode;
}


function DFSVisit(graph 				: $G.IGraph, 
									current_root 	: $N.IBaseNode,
									callbacks			: DFS_Callbacks = {}) {
	
	var	marked_temp : {[id: string] : boolean} = {},
			stack 			: Array<StackEntry> = [],
			stack_entry : StackEntry,
			current			: $N.IBaseNode,
			adj_nodes		: Array<$N.IBaseNode>;
			
	var scope = {
		marked_temp: marked_temp,
		stack: stack,
		stack_entry : stack_entry,
		current: current,
		adj_nodes: adj_nodes,
		current_root: current_root
	};
				
	
	/**
	 * HOOK 1 - INIT (INNER DFS VISIT):
	 * Initializing a possible result object,
	 * possibly with the current_root;
	 */
	if ( callbacks.init_dfs_visit ) {
		execCallbacks(callbacks.init_dfs_visit, scope);
	}
	
	stack.push({
		node		: current_root,
		parent	: current_root
	});
	
	
	while ( stack.length ) {
		stack_entry = stack.pop();
		current = stack_entry.node;
		
		/**
		 * HOOK 2 - AQUIRED CURRENT NODE / POPPED NODE
		 */
		
		if ( !marked_temp[current.getID()] ) {			
			marked_temp[current.getID()] = true;
			
			/**
			 * HOOK 3 - CURRENT NODE UNMARKED
			 */
			if ( callbacks.node_unmarked ) {
				execCallbacks(callbacks.node_unmarked, scope);
			}
						
			adj_nodes = current.adjNodes();
			for ( var adj_idx in adj_nodes ) {
				stack.push({
					node: adj_nodes[adj_idx],
					parent: current
				});
			}
			
			/**
			 * HOOK 4 - ADJACENT NODES PUSHED - LEAVING CURRENT NODE
			 */
			
			/**
			 * If we run from an outer loop, maybe we have to 
			 * execute some callback in that context...
			 */
			if ( callbacks.adj_nodes_pushed ) {
				execCallbacks(callbacks.adj_nodes_pushed, scope);
			}
		}
		else {
			/**
			 * HOOK 5 - CURRENT NODE ALREADY MARKED
			 */
		}
	}
}



function DFS( graph 		: $G.IGraph,
							callbacks	: DFS_Callbacks = {} ) {
		
	var	marked : {[id: string] : boolean} = {};
	var nodes = graph.getNodes();
	
	/**
	 * HOOK 1 - INIT (OUTER DFS)
	 */
	if ( callbacks.init_dfs ) {
		execCallbacks(callbacks.init_dfs, this);
	}
	
	var adj_nodes_pushed = callbacks.adj_nodes_pushed || {};
	adj_nodes_pushed["treatOuterNode"] = function(node:$N.IBaseNode) { 
		marked[node.getID()] = true 
	};
	
	for ( var node_id in nodes ) {		
		if ( !marked[node_id] ) {			
			DFSVisit(graph, nodes[node_id], callbacks);
		}
	}	
}


/**
 * @param context this pointer to the DFS or DFSVisit function
 */
function execCallbacks(cbs : Array<Function>, context) {
	cbs.forEach( function(cb) {
		if ( typeof cb === 'function' ) {
			cb(context);
		}
	});
}


export { DFSVisit, DFS, DFS_Callbacks };
