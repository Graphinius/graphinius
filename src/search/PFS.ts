/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';
import * as $BH from '../../src/datastructs/binaryHeap';


export interface PFS_Config {
	result			:	{[id: string]: PFS_ResultEntry};
	callbacks		:	PFS_Callbacks;
	dir_mode		:	$G.GraphMode;
  goal_node   : $N.IBaseNode;
	messages?		: PFS_Messages;
	filters?		: any;
}

export interface PFS_ResultEntry {
	distance	:	number; // evaluated by a
	parent		:	$N.IBaseNode;
	counter		: number; // order of discovery
}

export interface PFS_Callbacks {
	init_pfs?			 : Array<Function>;
	node_open?     : Array<Function>;
	node_closed?	 : Array<Function>;
  better_path?   : Array<Function>;
  goal_reached?  : Array<Function>;
}

export interface PFS_Messages {
  init_pfs_msgs?     : Array<string>;
  node_open_msgs?    : Array<string>;
  node_closed_msgs?  : Array<string>;
  better_path_msgs?  : Array<string>;
  goal_reached_msgs? : Array<string>;
}

export interface PFS_Scope {
  // OPEN is the heap we use for getting the best choice
  OPEN_HEAP   : $BH.BinaryHeap;
  OPEN   	  	: {[id: string] : boolean};
  CLOSED      : {[id: string] : boolean};
  // TODO need that ???
	nodes		  	: {[id: string] : $N.IBaseNode};
	current			: $N.NeighborEntry;
	next_node		: $N.IBaseNode;
	next_edge		: $E.IBaseEdge;
	root_node		: $N.IBaseNode;
	adj_nodes		: Array<$N.NeighborEntry>;
}

/**
 * Priority first search
 * 
 * Like BFS, we are not necessarily visiting the
 * whole graph, but only what's reachable from
 * a given start node.
 * 
 * @param graph the graph to perform PFS only
 * @param v the node from which to start PFS
 * @config a config object similar to that used
 * in BFS, automatically instantiated if not given..
 */
function PFS(graph 	 : $G.IGraph, 
						 v 			 : $N.IBaseNode,
             config  : PFS_Config) : {[id: string] : PFS_ResultEntry} {

  var config = config || preparePFSStandardConfig(),
      callbacks = config.callbacks,
      dir_mode = config.dir_mode;
  
  /**
	 * We are not traversing an empty graph...
	 */
	if ( graph.getMode() === $G.GraphMode.INIT ) {
		throw new Error('Cowardly refusing to traverse graph without edges.');
	}
  /**
	 * We are not traversing a graph taking NO edges into account
	 */
	if ( dir_mode === $G.GraphMode.INIT ) {
		throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	}
  
  // we take a standard eval function returning
  // the weight of a successor edge
  var evalPriority = function(ne: $N.NeighborEntry) {
    return ne.edge.getWeight();
  };
  // we take a standard ID function returning
  // the ID of a NeighborEntry's node
  var evalObjID = function(ne: $N.NeighborEntry) {
    return ne.node.getID();
  }
  
  
  var scope : PFS_Scope = {
    OPEN_HEAP : new $BH.BinaryHeap( $BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
    OPEN      : {},
    CLOSED    : {},
    nodes     : graph.getNodes(),
    current   : null,
    next_node : null,
    next_edge : null,
    root_node : v,
    adj_nodes : []
  }
  
  /**
	 * HOOK 1: PFS INIT
	 */
	if ( callbacks.init_pfs ) {
		$CB.execCallbacks(callbacks.init_pfs, scope);
	}
  
  // We need to push NeighborEntries
  // TODO: Virtual edge addition OK?
  var start_ne : $N.NeighborEntry = {
    node: v,
    edge: new $E.BaseEdge('virtual start edge', v, v, {weighted: true, weight: 0})
  }
  scope.OPEN_HEAP.insert(start_ne);
  
  /**
   * Main loop
   */
  while ( scope.OPEN_HEAP.size() ) {
    scope.current = scope.OPEN_HEAP.pop();
    
    // TODO what if we already reached the goal?
    if ( scope.current.node === config.goal_node ) {
      // first execCallbacks if given
      if ( config.callbacks.goal_reached ) {
        $CB.execCallbacks(config.callbacks.goal_reached);
      }
    }
    
    
    /**
		 * Do we move only in the directed subgraph,
		 * undirected subgraph or complete (mixed) graph?
		 */
		if ( dir_mode === $G.GraphMode.MIXED ) {
			scope.adj_nodes = scope.current.node.adjNodes();
		}
		else if ( dir_mode === $G.GraphMode.UNDIRECTED ) {
			scope.adj_nodes = scope.current.node.connNodes();
		}
		else if ( dir_mode === $G.GraphMode.DIRECTED ) {
			scope.adj_nodes = scope.current.node.nextNodes();
		}
		else {
			scope.adj_nodes = [];
		}
    
    
  }
  
  
 
  return {};               
}


function preparePFSStandardConfig() : PFS_Config {
  var config : PFS_Config = {
    result    : {},
    callbacks : {
      init_pfs			 : [],
      node_open      : [],
      node_closed 	 : [],
      better_path    : [],
      goal_reached   : []
    },
    messages: {
      init_pfs_msgs     : [],
      node_open_msgs    : [],
      node_closed_msgs  : [],
      better_path_msgs  : [],
      goal_reached_msgs : []
    },
    dir_mode  : $G.GraphMode.MIXED,
    goal_node : null
  },
    result = config.result,
    callbacks = config.callbacks;
    
  var count = 0;
	var counter = function() {
		return count++;
	};
  
  // Standard INIT callback
	var initPFS = function( context : PFS_Scope ) {
		// initialize all nodes to infinite distance
		for ( var key in context.nodes ) {
			config.result[key] = {
				distance : Number.POSITIVE_INFINITY,
				parent 	 : null,
				counter	 : -1
			};
		}
		// initialize root node entry
    // maybe take heuristic into account right here...??
		config.result[context.root_node.getID()] = {
			distance	: 0,
			parent		: context.root_node,
			counter		: counter()
		};
	};
	callbacks.init_pfs.push( initPFS );
  
  
  return config;
}

export { PFS, preparePFSStandardConfig };