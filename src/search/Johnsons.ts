
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

function Johnsons(graph: $G.IGraph): {} {

  if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
    throw new Error("Cowardly refusing to traverse graph without edges.");
  }

  //getting all graph nodes
  let allNodes: { [key: string]: $N.IBaseNode } = graph.getNodes();
  let nodeKeys = Object.keys(allNodes);

  if (graph.hasNegativeEdge()) {
    var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
      graph = addExtraNandE(graph, extraNode);
      let BFresult=BellmanFordDict(graph, extraNode);

    //reminder: output of the BellmanFordDict is BFDictResult
    //contains a dictionary called distances, format: {[nodeID]:dist}, and a boolean called neg_cycle
    if (BFresult.neg_cycle) {
      throw new Error("The graph contains a negative edge, thus it can not be processed");
    }

    else {
      let newWeights: {} = BFresult.distances;

      graph = reWeighGraph(graph, newWeights);
      //graph still has the extraNode
      //reminder: deleteNode function removes its edges, too
      graph.deleteNode(extraNode);
    }
  }

  //@Bernd: I have written two functions, one is PFSforAllSources (see below), but that one did not give the right results
  //then I wrote PFSforAllSources2, an alternative approach (see below), when this one is called, it gives nice output
  return PFSforAllSources(graph);
}

function addExtraNandE(target: $G.IGraph, nodeToAdd: $N.IBaseNode): $G.IGraph {
  let allNodes: { [key: string]: $N.IBaseNode } = target.getNodes();
  target.addNode(nodeToAdd);
  let tempCounter=0;
  //be aware, it adds an edge between extraNode and extraNode too!
  for (let nodeKey in allNodes) {
    target.addEdgeByNodeIDs("temp"+tempCounter, nodeToAdd.getID(), allNodes[nodeKey].getID(), { directed: true, weighted: true, weight: 0 });
    tempCounter++;
  }
  return target;
}

function reWeighGraph(target: $G.IGraph, distDict: {}): $G.IGraph {

  //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
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

//@ Bernd: this was my first try. 
//the idea was that I let the PFS do its thing, but I already create the dists and next arrays before starting it
//and put in two callbacks into the PFS Config, which update the dists and next arrays
//those two callbacks are written and could be pushed into the config.callbacks
//however the output of the Johnsons was not correct, when I called this function (could not yet figure out why)
function PFSforAllSources(graph: $G.IGraph): {} {

  //reminder: this is a 2d array,
  //value of a given [i][j]: 0 if self, value if j is directly reachable from i, positive infinity in all other cases
  // let dists: $G.MinAdjacencyListArray = graph.adjListArray();
  let dists = graph.adjListArray();
  // console.log(dists);

  //reminder: this is a 3d array
  //value in given [i][j] subbarray: node itself if self, goal node if goal node is directly reachable from source node, 
  //null in all other cases
  let next: $G.NextArray = graph.nextArray();

  //for positioning, i will always be the source node, 
  //j will always be the actual goal node

  //create an array of graph nodes, so when I later need the index of a nodeID, I can find it
  //so the original order of nodes will not be messed up by PFS
  let nodesDict = graph.getNodes();
  let nodeIDIdxMap = {};
  let i = 0;
  for (let key in nodesDict) {
    nodeIDIdxMap[key] = i++;
  }

  //creating the config for the PFS
  let specialConfig: $PFS.PFS_Config = $PFS.preparePFSStandardConfig();

  //and now modify whatever I need to
  var betterPathJohnsons = function (context: $PFS.PFS_Scope) {
    let i = nodeIDIdxMap[ context.root_node.getID() ];
    let j = nodeIDIdxMap[ context.next.node.getID() ];
    dists[i][j] = context.better_dist;
    next[i][j].splice(0, next[i][j].length, nodeIDIdxMap[ context.current.node.getID() ]);
  };

  //info: splice replaces the content created by the preparePFSStandardConfig function, 
  //to the one I need here
  specialConfig.callbacks.better_path.push( betterPathJohnsons );

  var equalPathJohnsons = function (context: $PFS.PFS_Scope) {
    let i = nodeIDIdxMap[ context.root_node.getID() ];
    let j = nodeIDIdxMap[ context.next.node.getID() ];

    if (next[i][j][0] === null) {
      next[i][j].splice(0, next[i][j].length, nodeIDIdxMap[ context.current.node.getID() ]);
    }
    if (next[i][j].indexOf(nodeIDIdxMap[ context.current.node.getID() ]) === -1) {
      next[i][j].push(nodeIDIdxMap[ context.current.node.getID() ]);
    }
  }
  //this array is empty so it is fine to just push
  specialConfig.callbacks.equal_path.push(equalPathJohnsons);

  let allNodes = graph.getNodes();
  for (let node_key in allNodes) {
    $PFS.PFS(graph, allNodes[node_key], specialConfig);
  }

  return [dists, next, specialConfig];
}


export {
  Johnsons, addExtraNandE, reWeighGraph, PFSforAllSources
};

