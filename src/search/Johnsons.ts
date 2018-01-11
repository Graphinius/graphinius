
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $PFS from '../search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $D from '../search/Dijkstra';
import * as $CB from '../utils/callbackUtils';
import * as $BH from '../datastructs/binaryHeap';
import { BellmanFordDict, BellmanFordArray } from '../search/BellmanFord';
import { Dijkstra } from '../search/Dijkstra';
import { IGraph, BaseGraph } from '../core/Graph';
import { IBaseNode, BaseNode } from '../core/Nodes';
import { prepareBFSStandardConfig } from './BFS';


//PFS for Johnsons: initiation and run is the same as in normal PFS

//return types: should be same as Floyd-Warshall
//dist: a 2d array containing distances for each shortest paths
//next: a 3d array containing "next" nodes (sort of parent nodes)
function Johnsons(graph: $G.IGraph): {} {

  if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
    throw new Error("Cowardly refusing to traverse graph without edges.");
  }
  //getting all graph nodes
  let allNodes: { [key: string]: $N.IBaseNode } = graph.getNodes();
  let nodeKeys = Object.keys(allNodes);

  var hasNWE = graph.hasNegativeEdge();

  if (!hasNWE) {
    return PFSforAllSources2(graph);
  }

  else {
    var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
    graph = addExtraNandE(graph, extraNode);
    //reminder: output of the BellmanFordDict is BFDictResult
    //contains a dictionary called distances, format: {[nodeID]:dist}, and a boolean called neg_cycle

    //now call BF
    if (BellmanFordDict(graph, extraNode).neg_cycle) {
      throw new Error("The graph contains a negative edge, thus it can not be processed");
    }
    else {
      let newWeights: {} = BellmanFordDict(graph, extraNode).distances;
      //removing the extraNode and re-weighing here, call outer function(s)

      //deleting the distance 0 of the extraNode, it is no more needed
      delete newWeights["extraNode"];
      //target graph still has the extraNode
      //reminder: deleteNode function removes its edges, too
      graph.deleteNode(extraNode);

      graph = reWeighGraph(graph, newWeights);

      for (let nodeID in allNodes) {
        Dijkstra(graph, allNodes[nodeID]);
      }

      //these lines will die soon
      let dist: any[];
      let next: any[];

      return PFSforAllSources2(graph);
    }
  }
}

function addExtraNandE(target: $G.IGraph, nodeToAdd: $N.IBaseNode): $G.IGraph {
  let allNodes: { [key: string]: $N.IBaseNode } = target.getNodes();
  target.addNode(nodeToAdd);
  for (let nodeKey in allNodes) {
    target.addEdgeByNodeIDs("temp", nodeToAdd.getID(), allNodes[nodeKey].getID(), { directed: true, weighted: true, weight: 0 });
  }
  return target;
}

function reWeighGraph(target: $G.IGraph, distDict: {}): $G.IGraph {

  //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
  //clone is needed!
  let edges = target.getDirEdgesArray().concat(target.getUndEdgesArray());
  for (let edge of edges) {
    var a = edge.getNodes().a.getID();
    var b = edge.getNodes().b.getID();
    if (edge.isWeighted) {
      let oldWeight = edge.getWeight();
      let newWeight = oldWeight + distDict[a] - distDict[b];
      edge.setWeight(newWeight);
    }
    else {
      //collecting edgeID and directedness for later re-use
      let edgeID: string = edge.getID();
      let dirNess: boolean = edge.isDirected();
      //to re-weigh, one needs to delete and then re-establish the edge
      target.deleteEdge(edge);
      let oldWeight = $PFS.DEFAULT_WEIGHT; //which is 1
      let newWeight = oldWeight + distDict[a] - distDict[b];
      target.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
    }
  }
  return target;
}

function PFSforAllSources(graph: $G.IGraph): {} {
  //the same output types will be used as in FW

  //reminder: this is a 2d array,
  //value of a given [i][j]: 0 if self, value if j is directly reachable from i, positive infinity in all other cases
  let dists: $G.MinAdjacencyListArray = graph.adjListArray();

  //reminder: this is a 3d array
  //value in given [i][j] subbarray: node itself if self, goal node if goal node is directly reachable from source node, 
  //null in all other cases
  let next: $G.NextArray = graph.nextArray();

  //for positioning, i will always be the source node, 
  //j will always be the actual goal node

  //create an array of graph nodes, so that later indices can be get
  let nodesDict = graph.getNodes();
  let nodeIDsArray: Array<string> = [];
  for (let key in nodesDict) {
    nodeIDsArray.push(nodesDict[key].getID());
  }
  //now whenever I need the position of any nodeID, I can get it
  //so that the original order of nodes will not be messed up by PFS

  //PFS needs to be called for each node as source
  //creating the config for the PFS

  let specialConfig: $PFS.PFS_Config = $PFS.preparePFSStandardConfig();
  //and now modify whatever I need to


  var betterPathJohnsons = function (context: $PFS.PFS_Scope) {
    let i = nodeIDsArray.indexOf(context.root_node.getID()),
      j = nodeIDsArray.indexOf(context.next.node.getID());

    dists[i][j] = context.better_dist;
    next[i][j].splice(0, next[i][j].length, nodeIDsArray.indexOf(context.current.node.getID()));
  };
  //splice replaces the content created by the preparePFSStandardConfig function, 
  //to the one I need here

  specialConfig.callbacks.better_path.push(betterPathJohnsons);
  //specialConfig.callbacks.better_path.splice(0, 1, betterPathJohnsons);

  var equalPathJohnsons = function (context: $PFS.PFS_Scope) {
    let i = nodeIDsArray.indexOf(context.root_node.getID()),
      j = nodeIDsArray.indexOf(context.next.node.getID());

    if (next[i][j][0] === null) {
      next[i][j].splice(0, next[i][j].length, nodeIDsArray.indexOf(context.current.node.getID()));
    }
    if (next[i][j].indexOf(nodeIDsArray.indexOf(context.current.node.getID())) === -1) {
      next[i][j].push(nodeIDsArray.indexOf(context.current.node.getID()));
    }
  }

  specialConfig.callbacks.equal_path.push(equalPathJohnsons);

  for (let key in nodesDict) {
    $PFS.PFS(graph, nodesDict[key], specialConfig);
  }

  return [dists, next, specialConfig];
}

export interface PFS_ResultEntry2 {
  distance: number; // evaluated by a
  parent: Array<$N.IBaseNode>;
  counter: number; // order of discovery
}
export interface PFS_Config2 {
  result: { [id: string]: PFS_ResultEntry2 };
  callbacks: $PFS.PFS_Callbacks;
  dir_mode: $G.GraphMode;
  goal_node: $N.IBaseNode;
  messages?: $PFS.PFS_Messages;
  filters?: any;
  evalPriority: any;
  evalObjID: any;
}

function PFSforAllSources2(graph: $G.IGraph): {} {
  //creating the superarrays for the outputs
  let dists: Array<Array<number>> = [];
  let next: Array<Array<Array<string>>> = [];

  let PFSSpecialConfig2: PFS_Config2 = preparePFSStandardConfig2();

  let nodesDict = graph.getNodes();
  for (let key in nodesDict){
    let distsSub :Array<number> = [];
    let nextSub : Array<Array<string>> =[];
    let resultDict= PFS2(graph, nodesDict[key], PFSSpecialConfig2);
    for (let key in nodesDict){
      let currentGoalID=nodesDict[key].getID();
      let currentGoalDist=resultDict[currentGoalID].distance;
      distsSub.push(currentGoalDist);
      //I need to pack the node IDs into the output array next
      let currentGoalParent:Array<IBaseNode>=resultDict[currentGoalID].parent;
      let currentGoalParentIDs:Array<string>=[];
      for (let node of currentGoalParent){
        let nodeID = node.getID();
        currentGoalParentIDs.push(nodeID);
      }

      nextSub.push(currentGoalParentIDs);
    }
    dists.push(distsSub);
    next.push(nextSub);
  }

  return [dists, next];
}

function preparePFSStandardConfig2(): PFS_Config2 {
  var config: PFS_Config2 = {
    result: {},
    callbacks: {
      init_pfs: [],
      not_encountered: [],
      node_open: [],
      node_closed: [],
      better_path: [],
      equal_path: [],
      goal_reached: []
    },
    messages: {
      init_pfs_msgs: [],
      not_enc_msgs: [],
      node_open_msgs: [],
      node_closed_msgs: [],
      better_path_msgs: [],
      equal_path_msgs: [],
      goal_reached_msgs: []
    },
    dir_mode: $G.GraphMode.MIXED,
    goal_node: null,
    evalPriority: function (ne: $N.NeighborEntry) {
      return ne.best || $PFS.DEFAULT_WEIGHT;
    },
    evalObjID: function (ne: $N.NeighborEntry) {
      return ne.node.getID();
    }
  },
    callbacks = config.callbacks;

  var count = 0;
  var counter = function () {
    return count++;
  };

  // Standard INIT callback
  var initPFS = function (context: $PFS.PFS_Scope) {
    // initialize all nodes to infinite distance
    for (var key in context.nodes) {
      config.result[key] = {
        distance: Number.POSITIVE_INFINITY,
        parent: [null],
        counter: -1
      };
    }
    // initialize root node entry
    // maybe take heuristic into account right here...??
    config.result[context.root_node.getID()] = {
      distance: 0,
      parent: [context.root_node],
      counter: counter()
    };
  };
  callbacks.init_pfs.push(initPFS);


  // Node not yet encountered callback
  var notEncountered = function (context: $PFS.PFS_Scope) {
    // setting it's best score to actual distance + edge weight
    // and update result structure
    context.next.best = context.current.best + (isNaN(context.next.edge.getWeight()) ? $PFS.DEFAULT_WEIGHT : context.next.edge.getWeight());

    config.result[context.next.node.getID()] = {
      distance: context.next.best,
      parent: [context.current.node===context.root_node? context.next.node : context.current.node],//or next? not sure yet
      //nodes directly reachable from root node should get next, I think...
      counter: undefined
    };
  };
  callbacks.not_encountered.push(notEncountered);


  // Callback for when we find a better solution
  var betterPathFound = function (context: $PFS.PFS_Scope) {
    config.result[context.next.node.getID()].distance = context.better_dist;
    config.result[context.next.node.getID()].parent = [context.current.node];
  };
  callbacks.better_path.push(betterPathFound);

  var equalPathFound = function (context: $PFS.PFS_Scope) {
    if (config.result[context.next.node.getID()].parent.indexOf(context.current.node) === -1) {
      config.result[context.next.node.getID()].parent.push(context.current.node);
    }
  };
  callbacks.equal_path.push(equalPathFound);

  return config;
}

function PFS2(graph 	 : $G.IGraph, 
  v 			 : $N.IBaseNode,
  config? : PFS_Config2) : {[id: string] : PFS_ResultEntry2} 
{
var config = config || preparePFSStandardConfig2(),
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

var scope : $PFS.PFS_Scope = {
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
//initializes the result entry, gives the start node the final values, and default values for all others

scope.OPEN_HEAP.insert(start_ne);
scope.OPEN[start_ne.node.getID()] = start_ne;


/**
* Main loop
*/
while ( scope.OPEN_HEAP.size() ) {
// get currently best node
//pop returns the first element of the OPEN_HEAP, which is the node with the smallest distance
//it removes it from the heap, too - no extra removal needed
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

scope.better_dist = scope.current.best + (isNaN(scope.next.edge.getWeight()) ? $PFS.DEFAULT_WEIGHT : scope.next.edge.getWeight());

/**
* HOOK 5: Better path found
*/
if ( scope.next.best > scope.better_dist ) {
config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);

// HEAP operations are necessary for internal traversal,
// so we handle them here in the main loop
//removing thext with the old value and adding it again with updated value
scope.OPEN_HEAP.remove(scope.next);
scope.next.best = scope.better_dist;
scope.OPEN_HEAP.insert(scope.next);
scope.OPEN[scope.next.node.getID()].best = scope.better_dist;
}

/**
* HOOK 6: Equal path found (same weight)
*/
//at the moment, this callback array is empty. This hook is needed in the Johnsons only

if ( scope.next.best === scope.better_dist ) {
config.callbacks.equal_path && $CB.execCallbacks(config.callbacks.equal_path, scope);
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


export {
  Johnsons, addExtraNandE, reWeighGraph, PFSforAllSources
};

