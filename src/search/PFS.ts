/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';
import * as $BH from '../datastructs/binaryHeap';


export interface PFS_Config {
	result			    :	{[id: string]: PFS_ResultEntry};
	callbacks		    :	PFS_Callbacks;
	dir_mode		    :	$G.GraphMode;
  goal_node       : $N.IBaseNode;
	messages?		    : PFS_Messages;
	filters?		    : any;
  evalPriority    : any;
  evalObjID       : any;
}

export interface PFS_ResultEntry {
	distance	:	number; // evaluated by a
	parent		:	$N.IBaseNode;
	counter		: number; // order of discovery
}

export interface PFS_Callbacks {
	init_pfs?			    : Array<Function>;
  not_encountered?  : Array<Function>;
	node_open?        : Array<Function>;
	node_closed?	    : Array<Function>;
  better_path?      : Array<Function>;
  goal_reached?     : Array<Function>;
}

export interface PFS_Messages {
  init_pfs_msgs?     : Array<string>;
  not_enc_msgs?      : Array<string>;
  node_open_msgs?    : Array<string>;
  node_closed_msgs?  : Array<string>;
  better_path_msgs?  : Array<string>;
  goal_reached_msgs? : Array<string>;
}

export interface PFS_Scope {
  // OPEN is the heap we use for getting the best choice
  OPEN_HEAP   : $BH.BinaryHeap;
  OPEN   	  	: {[id: string] : $N.NeighborEntry};
  CLOSED      : {[id: string] : $N.NeighborEntry};
	nodes		  	: {[id: string] : $N.IBaseNode};
  root_node		: $N.IBaseNode;
	current			: $N.NeighborEntry;
	adj_nodes		: Array<$N.NeighborEntry>;
  next        : $N.NeighborEntry;
  better_dist : number;
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
             config? : PFS_Config) : {[id: string] : PFS_ResultEntry} {

  var config = config || preparePFSStandardConfig(),
      callbacks = config.callbacks,
      dir_mode = config.dir_mode,
      evalPriority = config.evalPriority,
      evalObjID = config.evalObjID;

  
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
  
  
  // We need to push NeighborEntries
  // TODO: Virtual edge addition OK?
  var start_ne : $N.NeighborEntry = {
    node: v,
    edge: new $E.BaseEdge('virtual start edge', v, v, {weighted: true, weight: 0}),
    best: 0
  };
  
  var scope : PFS_Scope = {
    OPEN_HEAP   : new $BH.BinaryHeap( $BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
    OPEN        : {},
    CLOSED      : {},
    nodes       : graph.getNodes(),
    root_node   : v,
    current     : start_ne,
    adj_nodes   : [],
    next        : null,
    better_dist : Number.POSITIVE_INFINITY,
  };
  
  /**
	 * HOOK 1: PFS INIT
	 */
  callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
  
  scope.OPEN_HEAP.insert(start_ne);
  scope.OPEN[start_ne.node.getID()] = start_ne;
  
  /**
   * Main loop
   */
  while ( scope.OPEN_HEAP.size() ) {
    // get currently best node
    scope.current = scope.OPEN_HEAP.pop();
    
    if (scope.current == null) {
      console.log("HEAP popped undefined - HEAP size: " + scope.OPEN_HEAP.size());
    }

    // remove from OPEN
    scope.OPEN[scope.current.node.getID()] = undefined;
    
    // add it to CLOSED
    scope.CLOSED[scope.current.node.getID()] = scope.current;
    
    // TODO what if we already reached the goal?
    if ( scope.current.node === config.goal_node ) {
      /**
       * HOOK 2: Goal node reached
       */
      config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached, scope);
      
      // If a goal node is set from the outside & we reach it, we stop.
      return config.result;
    }
    
    
    /**
     * Extend the current node, also called
     * "create n's successors"...
		 */

    // TODO: Reverse callback logic to NOT merge anything by default!!!
		if ( dir_mode === $G.GraphMode.MIXED ) {
			scope.adj_nodes = scope.current.node.reachNodes();
		}
		else if ( dir_mode === $G.GraphMode.UNDIRECTED ) {
			scope.adj_nodes = scope.current.node.connNodes();
		}
		else if ( dir_mode === $G.GraphMode.DIRECTED ) {
			scope.adj_nodes = scope.current.node.nextNodes();
		}
		else {
      throw new Error('Unsupported traversal mode. Please use directed, undirected, or mixed');
		}

    /**
     * EXPAND AND EXAMINE NEIGHBORHOOD
     */
    for ( var adj_idx in scope.adj_nodes ) {
      scope.next = scope.adj_nodes[adj_idx];

      if ( scope.CLOSED[scope.next.node.getID()] ) {
        /**
         * HOOK 3: Goal node already closed
         */
        config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
        continue;
      }

      if ( scope.OPEN[scope.next.node.getID()] ) {
        // First let's recover the previous best solution from our OPEN structure,
        // as the node's neighborhood-retrieving function cannot know it...
        scope.next.best = scope.OPEN[scope.next.node.getID()].best;

        /**
         * HOOK 4: Goal node already visited, but not yet closed
         */
        config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);

        scope.better_dist = scope.current.best + scope.next.edge.getWeight();
        if ( scope.next.best > scope.better_dist ) {
          /**
           * HOOK 5: Better path found
           */
          config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);

          // HEAP operations are necessary for internal traversal,
          // so we handle them here in the main loop
          scope.OPEN_HEAP.remove(scope.next);
          scope.next.best = scope.better_dist;
          scope.OPEN_HEAP.insert(scope.next);
          scope.OPEN[scope.next.node.getID()].best = scope.better_dist;
        }
        continue;
      }

      // NODE NOT ENCOUNTERED
      config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);

      // HEAP operations are necessary for internal traversal,
      // so we handle them here in the main loop
      scope.OPEN_HEAP.insert(scope.next);
      scope.OPEN[scope.next.node.getID()] = scope.next;
    }
  }
 
  return config.result;           
}


function preparePFSStandardConfig() : PFS_Config {
  var config : PFS_Config = {
    result    : {},
    callbacks : {
      init_pfs			  : [],
      not_encountered : [],
      node_open       : [],
      node_closed 	  : [],
      better_path     : [],
      goal_reached    : []
    },
    messages: {
      init_pfs_msgs     : [],
      not_enc_msgs      : [],
      node_open_msgs    : [],
      node_closed_msgs  : [],
      better_path_msgs  : [],
      goal_reached_msgs : []
    },
    dir_mode  : $G.GraphMode.MIXED,
    goal_node : null,
    evalPriority : function(ne: $N.NeighborEntry) {
      return ne.best;
    },
    evalObjID : function(ne: $N.NeighborEntry) {
      return ne.node.getID();
    }
  },
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


  // Node not yet encountered callback
  var notEncountered = function( context : PFS_Scope ) {
    // setting it's best score to actual distance + edge weight
    // and update result structure
    context.next.best = context.current.best + context.next.edge.getWeight();

    config.result[context.next.node.getID()] = {
      distance  : context.next.best,
      parent    : context.current.node,
      counter   : undefined
    };
  };
  callbacks.not_encountered.push(notEncountered);


  // Callback for when we find a better solution
  var betterPathFound = function( context: PFS_Scope ) {
    config.result[context.next.node.getID()].distance = context.better_dist;
    config.result[context.next.node.getID()].parent = context.current.node;
  };
  callbacks.better_path.push(betterPathFound);
  
  return config;
}

export { PFS, preparePFSStandardConfig };