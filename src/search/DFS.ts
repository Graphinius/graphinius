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


interface DFSVisitScope {
	marked_temp 	: {[id: string] : boolean};
	stack 				: Array<StackEntry>;
	adj_nodes			: Array<$N.IBaseNode>;
	stack_entry 	: StackEntry;
	current				: $N.IBaseNode;
	current_root	: $N.IBaseNode;
}


interface DFSScope {
	marked 	: {[id: string] : boolean};
	nodes		: {[id: string] : $N.IBaseNode};
}


function DFSVisit(graph 				: $G.IGraph, 
									current_root 	: $N.IBaseNode,
									callbacks			: DFS_Callbacks = {}) {
	
	var scope : DFSVisitScope = {
		marked_temp		: {},
		stack					: [],
		adj_nodes			: [],
		stack_entry		: null,
		current				: null,
		current_root	: current_root
	}				
	
	/**
	 * HOOK 1 - INIT (INNER DFS VISIT):
	 * Initializing a possible result object,
	 * possibly with the current_root;
	 */
	if ( callbacks.init_dfs_visit ) {
		execCallbacks(callbacks.init_dfs_visit, scope);
	}
	
	// Start py pushing current root to the stack
	scope.stack.push({
		node		: current_root,
		parent	: current_root
	});
	
	
	while ( scope.stack.length ) {
		scope.stack_entry = scope.stack.pop();
		scope.current = scope.stack_entry.node;
		
		/**
		 * HOOK 2 - AQUIRED CURRENT NODE / POPPED NODE
		 */
		if ( callbacks.node_popped ) {
			execCallbacks(callbacks.node_popped, scope);
		}
		
		if ( !scope.marked_temp[scope.current.getID()] ) {			
			scope.marked_temp[scope.current.getID()] = true;
			
			/**
			 * HOOK 3 - CURRENT NODE UNMARKED
			 */
			if ( callbacks.node_unmarked ) {
				execCallbacks(callbacks.node_unmarked, scope);
			}
						
			scope.adj_nodes = scope.current.adjNodes();
			for ( var adj_idx in scope.adj_nodes ) {
				scope.stack.push({
					node: scope.adj_nodes[adj_idx],
					parent: scope.current
				});
			}
			
			/**
			 * HOOK 4 - ADJACENT NODES PUSHED - LEAVING CURRENT NODE
			 */
			if ( callbacks.adj_nodes_pushed ) {
				execCallbacks(callbacks.adj_nodes_pushed, scope);
			}

		}
		else {
			/**
			 * HOOK 5 - CURRENT NODE ALREADY MARKED
			 */
			if ( callbacks.node_marked ) {
				execCallbacks(callbacks.node_marked, scope);
			}
		}
	}
}


function DFS( graph 		: $G.IGraph,
							callbacks	: DFS_Callbacks = {} ) {
	
	var scope : DFSScope = {
		marked 	: {},
		nodes 	: graph.getNodes()
	}	
	
	/**
	 * HOOK 1 - INIT (OUTER DFS)
	 */
	if ( callbacks.init_dfs ) {
		execCallbacks(callbacks.init_dfs, scope);
	}
	
	callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
	var markNode = function ( context : DFSVisitScope ) { 
		scope.marked[context.current.getID()] = true 
	};
	callbacks.adj_nodes_pushed.push(markNode);
	
	for ( var node_id in scope.nodes ) {		
		if ( !scope.marked[node_id] ) {			
			DFSVisit(graph, scope.nodes[node_id], callbacks);
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


export { DFSVisit, DFS, DFS_Callbacks, DFSVisitScope, DFSScope, execCallbacks };
