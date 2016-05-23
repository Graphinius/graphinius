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
  OPEN   	  	: {[id: string] : $N.NeighborEntry};
  CLOSED      : {[id: string] : $N.NeighborEntry};

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
  
  /**
   * we take a standard eval function returning
   * the weight of a successor edge
   * This will later be replaced by a config option...
   */
  var evalPriority = function(ne: $N.NeighborEntry) {
    return ne.best;
  };
  
  /**
   * we take a standard ID function returning
   * the ID of a NeighborEntry's node
   * This will later be replaced by a config option...
   */
  var evalObjID = function(ne: $N.NeighborEntry) {
    return ne.node.getID();
  };
  
  
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
  };
  
  /**
	 * HOOK 1: PFS INIT
	 */
  callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
  
  // We need to push NeighborEntries
  // TODO: Virtual edge addition OK?
  var start_ne : $N.NeighborEntry = {
    node: v,
    edge: new $E.BaseEdge('virtual start edge', v, v, {weighted: true, weight: 0}),
    best: 0
  };

  // console.log("Start NE: " + start_ne.node.getID());

  scope.OPEN_HEAP.insert(start_ne);
  scope.OPEN[start_ne.node.getID()] = start_ne;
  
  /**
   * Main loop
   */
  while ( scope.OPEN_HEAP.size() ) {
    // get currently best node
    scope.current = scope.OPEN_HEAP.pop();
    
    // console.log('POPPED NODE: ' + scope.current.node.getID() + ' with best distance: ' + scope.current.best);
    
    // remove from OPEN
    scope.OPEN[scope.current.node.getID()] = undefined;
    
    // add it to CLOSED
    scope.CLOSED[scope.current.node.getID()] = scope.current;
    
    // TODO what if we already reached the goal?
    if ( scope.current.node === config.goal_node ) {
      /**
       * HOOK 2: Goal node reached
       */
      config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached);
      
      
      // TODO: WHICH RESULT DO WE RETURN???
      return config.result;
    }
    
    
    /**
     * Extend the current node, also called
     * "create n's successors"...
     * 
		 * Do we move only in the directed subgraph,
		 * undirected subgraph or complete (mixed) graph?
		 */

    // TODO: Reverse callback logic to NOT merge anything by default!!!
		if ( dir_mode === $G.GraphMode.MIXED ) {
			scope.adj_nodes = scope.current.node.adjNodes((ne) => { return Math.random() * +(new Date) });
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


    for ( var adj_idx in scope.adj_nodes ) {
      var ne = scope.adj_nodes[adj_idx];
      
      // Have we already dealt with that node and all it's neighbors?
      if ( scope.CLOSED[ne.node.getID()] ) {
        continue;
      }
      
      // Have we encountered this node before but it's still in OPEN?
      if ( scope.OPEN[ne.node.getID()] ) {

        // Either our best value is already explicitly stored,
        // or it's the current distance plus edge weight
        ne.best = scope.OPEN[ne.node.getID()].best;

        // console.log("Encountered node " + ne.node.getID() + " with distance: " + ne.best);
        
        // reevaluate this neighborhood entry (& replace it in HEAP)
        var new_best = scope.current.best + ne.edge.getWeight();
        if ( ne.best > new_best ) {

          // console.log("NE BEST: " + ne.best + " to node " + ne.node.getID());
          // console.log("NEW BEST: " + new_best);

          scope.OPEN_HEAP.remove(ne);
          ne.best = new_best;
          scope.OPEN_HEAP.insert(ne);
          // also update in OPEN datastruct
          scope.OPEN[ne.node.getID()].best = new_best;
          
          // set new distance and parent...
          // TODO defer to better path callback later
          config.result[ne.node.getID()].distance = new_best;
          config.result[ne.node.getID()].parent = scope.current.node;
        }
        continue;
      }
      
      // We have never encountered this node - evaluate it,
      // setting it's best score to actual distance + edge weight
      // and add it to OPEN
      ne.best = scope.current.best + ne.edge.getWeight();

      // console.log('PUSHING NODE: ' + ne.node.getID() + ' with best distance: ' + ne.best);
      scope.OPEN_HEAP.insert(ne);
      scope.OPEN[ne.node.getID()] = ne;
      
      config.result[ne.node.getID()] = {
        distance  : ne.best,
        parent    : scope.current.node,
        counter   : undefined
      };
    }
    
    
    /**
     *  TODO: replace callbacks with / add to them:
     * 
     *  - target found
     *  - not_encountered
     *  - node_open
     *  - node_closed
     */
    
    // HACK Replace with actual algorithm:  
    config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open);  
    config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed);    
    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path);
        
  }
 
  return config.result;           
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