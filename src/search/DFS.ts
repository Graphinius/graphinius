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
									callbacks			: DFS_Callbacks = {},
									dir_mode			: $G.GraphMode = $G.GraphMode.MIXED) {
	
	var scope : DFSVisitScope = {
		marked_temp		: {},
		stack					: [],
		adj_nodes			: [],
		stack_entry		: null,
		current				: null,
		current_root	: current_root
	};
	
	/**
	 * We are not traversing a blank graph...
	 */
	if ( dir_mode === $G.GraphMode.INIT ) {
		throw new Error('Cowardly refusing to traverse graph without edges.');
	}
	
	/**
	 * HOOK 1 - INIT (INNER DFS VISIT):
	 * Initializing a possible result object,
	 * possibly with the current_root;
	 */
	if ( callbacks.init_dfs_visit ) {
		execCallbacks(callbacks.init_dfs_visit, scope);
	}
	
	// Start by pushing current root to the stack
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
			
			/**
			 * Do we move only in the directed subgraph, 
			 * undirected subgraph or complete (mixed) graph?
			 */
			if ( dir_mode === $G.GraphMode.MIXED ) {
				scope.adj_nodes = scope.current.adjNodes();
			}
			else if ( dir_mode === $G.GraphMode.UNDIRECTED ) {
				scope.adj_nodes = scope.current.connNodes();
			}
			else if ( dir_mode === $G.GraphMode.DIRECTED ) {
				scope.adj_nodes = scope.current.nextNodes();
			}
			
			for ( var adj_idx in scope.adj_nodes ) {
				/**
				 * HOOK 6 - NODE OR EDGE TYPE CHECK...
				 * LATER !!
				 */
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
							callbacks	: DFS_Callbacks = {},
							dir_mode	: $G.GraphMode = $G.GraphMode.MIXED) {
	
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
			DFSVisit(graph, scope.nodes[node_id], callbacks, dir_mode);
		}
	}
}


function prepareStandardDFSVisitCBs( result: {}, 
																		 callbacks: DFS_Callbacks, 
																		 count: number) {																		
	var counter = function() { 
		return count++;
	};
	callbacks.init_dfs_visit = callbacks.init_dfs_visit || [];
	callbacks.node_unmarked = callbacks.node_unmarked || [];			
	var initDFSVisit = function( context : DFSVisitScope ) {
		result[context.current_root.getID()] = {
			parent 	: context.current_root
		};
	};
	callbacks.init_dfs_visit.push(initDFSVisit);						
	var setResultEntry = function( context : DFSVisitScope) {
		result[context.current.getID()] = {
			parent 	: context.stack_entry.parent,
			counter : counter()
		};
	};
	callbacks.node_unmarked.push(setResultEntry);	
}


function prepareStandardDFSCBs( result: {},
												callbacks: DFS_Callbacks,
												count: number) {
	// First prepare Visit callbacks
	prepareStandardDFSVisitCBs(result, callbacks, count);
	// Now add outer DFS INIT callback
	callbacks.init_dfs = callbacks.init_dfs || [];		
	var setInitialResultEntries = function( context : DFSScope ) {
		for ( var node_id in context.nodes ) {
			result[node_id] = {
				parent: null,
				counter: -1
			}
		}
	};
	callbacks.init_dfs.push(setInitialResultEntries);
};


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


export { DFSVisit, DFS, DFS_Callbacks, DFSVisitScope, DFSScope, prepareStandardDFSVisitCBs, 
				 prepareStandardDFSCBs, execCallbacks };
