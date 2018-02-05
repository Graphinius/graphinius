
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $PFS from '../search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $D from '../search/Dijkstra';
import * as $CB from '../utils/callbackUtils';
import * as $BH from '../datastructs/binaryHeap';
import { BellmanFordDict, BellmanFordArray } from '../search/BellmanFord';
import * as $SU from '../utils/structUtils'
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
    var extraNode: $N.IBaseNode = new $N.BaseNode("extraNode");
    graph = addExtraNandE(graph, extraNode);
    let BFresult = BellmanFordDict(graph, extraNode);

    //reminder: output of the BellmanFordDict is BFDictResult
    //contains a dictionary called distances, format: {[nodeID]:dist}, and a boolean called neg_cycle
    if (BFresult.neg_cycle) {
      throw new Error("The graph contains a negative edge, thus it can not be processed");
    }

    else {
      let newWeights: {} = BFresult.distances;

      graph = reWeighGraph(graph, newWeights, extraNode);
      //graph still has the extraNode
      //reminder: deleteNode function removes its edges, too
      graph.deleteNode(extraNode);
      return PFSforAllSources(graph);
    }
  }

  return PFSforAllSources(graph);
}

function addExtraNandE(target: $G.IGraph, nodeToAdd: $N.IBaseNode): $G.IGraph {
  let allNodes: { [key: string]: $N.IBaseNode } = target.getNodes();
  target.addNode(nodeToAdd);
  let tempCounter = 0;
  //now add a directed edge from the extranode to all graph nodes, excluding itself
  for (let nodeKey in allNodes) {
    if (allNodes[nodeKey].getID() != nodeToAdd.getID()) {
      target.addEdgeByNodeIDs("temp" + tempCounter, nodeToAdd.getID(), allNodes[nodeKey].getID(),
        { directed: true, weighted: true, weight: 0 });
      tempCounter++;
    }
  }
  return target;
}

function reWeighGraph(target: $G.IGraph, distDict: {}, tempNode: $N.IBaseNode): $G.IGraph {

  //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
  let edges = target.getDirEdgesArray().concat(target.getUndEdgesArray());
  for (let edge of edges) {
    var a = edge.getNodes().a.getID();
    var b = edge.getNodes().b.getID();

    //no need to re-weigh the temporary edges starting from the extraNode, they will be deleted anyway
    if (a == tempNode.getID()) {
      continue;
    }
     //assuming that the node keys in the distDict correspond to the nodeIDs
    else if (edge.isWeighted) {
      let oldWeight = edge.getWeight();
      let newWeight = oldWeight + distDict[a] - distDict[b];
      edge.setWeight(newWeight);
    }
    else {
      let oldWeight = $PFS.DEFAULT_WEIGHT; //which is 1
      let newWeight = oldWeight + distDict[a] - distDict[b];
      //collecting edgeID and directedness for later re-use
      let edgeID: string = edge.getID();
      let dirNess: boolean = edge.isDirected();

      //one does not simply make an edge weighted, but needs to delete and re-create it
      target.deleteEdge(edge);
      target.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
    }
  }
  return target;
}

function PFSforAllSources(graph: $G.IGraph): {} {

  //reminder: this is a 2d array,
  //value of a given [i][j]: 0 if self, value if j is directly reachable from i, positive infinity in all other cases
  let dists: Array<Array<number>> = graph.adjListArray();

  //reminder: this is a 3d array
  //value in given [i][j] subbarray: node itself if self, goal node if goal node is directly reachable from source node, 
  //null in all other cases
  let next: $G.NextArray = graph.nextArray();

  //create a dict of graph nodes, format: {[nodeID:string]:number}
  //so the original order of nodes will not be messed up by PFS
  let nodesDict = graph.getNodes();
  let nodeIDIdxMap = {};
  let i = 0;
  for (let key in nodesDict) {
    nodeIDIdxMap[nodesDict[key].getID()] = i++;
  }

  //creating the config for the PFS
  let specialConfig: $PFS.PFS_Config = $PFS.preparePFSStandardConfig();

  //and now modify whatever I need to
  var notEncounteredJohnsons = function (context: $PFS.PFS_Scope) {
    context.next.best =
      context.current.best + (isNaN(context.next.edge.getWeight()) ? $PFS.DEFAULT_WEIGHT : context.next.edge.getWeight());
    let i = nodeIDIdxMap[context.root_node.getID()],
      j = nodeIDIdxMap[context.next.node.getID()];
    if (context.current.node == context.root_node) {
      dists[i][j] = context.next.best;
      next[i][j][0] = j;
    }
    else {
      dists[i][j] = context.next.best;
      next[i][j][0] = nodeIDIdxMap[context.current.node.getID()];
    }
  };
  specialConfig.callbacks.not_encountered.splice(0, 1, notEncounteredJohnsons);

  var betterPathJohnsons = function (context: $PFS.PFS_Scope) {
    let i = nodeIDIdxMap[context.root_node.getID()],
      j = nodeIDIdxMap[context.next.node.getID()];

    dists[i][j] = context.better_dist;
    //here I do need the splice, because I do not know how many elements are there in the subarray
    next[i][j].splice(0, next[i][j].length, nodeIDIdxMap[context.current.node.getID()]);
  };
  //info: splice replaces the content created by the preparePFSStandardConfig function, 
  //to the one I need here
  specialConfig.callbacks.better_path.splice(0, 1, betterPathJohnsons);

  var equalPathJohnsons = function (context: $PFS.PFS_Scope) {
    let i = nodeIDIdxMap[context.root_node.getID()],
      j = nodeIDIdxMap[context.next.node.getID()];

    if (context.current.node == context.root_node) {
      next[i][j][0] = nodeIDIdxMap[context.next.node.getID()];
    }
    else {
      next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], [nodeIDIdxMap[context.current.node.getID()]]);
    }
  }
  //this array is empty so it is fine to just push
  specialConfig.callbacks.equal_path.push(equalPathJohnsons);

  for (let key in nodesDict) {
    $PFS.PFS(graph, nodesDict[key], specialConfig);
  }

  return [dists, next];
}

export {
  Johnsons, addExtraNandE, reWeighGraph, PFSforAllSources
};

