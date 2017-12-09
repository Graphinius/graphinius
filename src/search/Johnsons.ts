
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $PFS from '../search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $D from '../search/Dijkstra';
import { BellmanFordDict, BellmanFordArray } from '../search/BellmanFord';
import { Dijkstra } from '../search/Dijkstra';


//return types: similar to Floyd-Warshall, 
//dist: a 2d array containing distances for each shortest paths
//next: a 3d array containing the paths starting with the node right after the source
function Johnsons(graph: $G.IGraph, cycle = true): any {

  if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
    throw new Error("Cowardly refusing to traverse graph without edges.");
  }
  //getting all graph nodes
  let allNodes: { [key: string]: $N.IBaseNode } = graph.getNodes();
  let nodeKeys = Object.keys(allNodes);

  //this is not yet correct, I will need to check these lambda expressions once more
  let hasNWE = graph => {
    let allDir = graph.getDirEdges();
    let allUnd = graph.getUndEdges();
    let resultHasNWE: boolean = false;
    for (let diredge in allDir) {
      if (!allDir[diredge].isWeighted()) {
        continue;
      }
      if (allDir[diredge].getWeight() < 0) {
        resultHasNWE = true;
      }
    }
    for (let undEdge in allUnd) {
      if (!allUnd[undEdge].isWeighted()) {
        continue;
      }
      if (allUnd[undEdge].getWeight() < 0) {
        resultHasNWE = true;
      }
    }
    return resultHasNWE;
  };

  //initialize the graph on which the Dijkstras will be made
  var RWGraph: $G.IGraph;


  //if the graph has negative weight edges, it needs to be re-weighed
  //if not, then RWGraph is a simple clone of the input graph, and one can directly go for the Dijkstra

  if (hasNWE) {

    //the extra node we need to re-weigh the edges
    var extraNode: $N.IBaseNode = new $N.BaseNode("extraNode");

    //to help testing, I will have 3 different graphs
    //original graph: unmodified input graph
    //graphForBF: clone of the original, contains extraNode and temporary edges
    //RWGraph: clone of the original graph, but edges are re-weighted
    //the RWGraph will be used for Dijkstras

    let graphForBF: $G.IGraph = graph.clone();
    graphForBF.addNode(extraNode);

    //adding the temporary edges

    //2 for loops, 1 is commented out
    //their speed can be compared later

    for (let nodeId of nodeKeys) {
      graphForBF.addEdgeByNodeIDs("temp", "extraNode", nodeId, { directed: true, weighted: true, weight: 0 });
    }

    //the alternative for loop, may be used later
    /*for (let i = 0; i < nodeKeys.length; i++) {
      let actualNode = allNodes[nodeKeys[i]];
      graphForBF.addEdgeByID("temp"+i, extraNode, actualNode, { directed: true, weighted: true, weight: 0 });
    }*/

    //now the Bellman-Ford, and re-weighting, if there are no negative edges

    if (<boolean>BellmanFordArray(graphForBF, extraNode, true)) {
      throw new Error("The graph contains negative cycle(s), it makes no sense to continue");
    }

    let newWeights: {} = <{}>BellmanFordDict(graphForBF, extraNode, false);

    //deleting the distance 0 of the extraNode, it is no more needed
    delete newWeights["extraNode"];

    //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
    //RWGraph will be a clone of the original graph, then no node deletion needed
    RWGraph = graph.clone();
    let edges = RWGraph.getDirEdgesArray().concat(RWGraph.getUndEdgesArray());
    for (let edgeID in edges) {
      let edge = edges[edgeID];
      var a = edge.getNodes().a.getID();
      var b = edge.getNodes().b.getID();
      if (edge.isWeighted) {
        let oldWeight = edge.getWeight();
        let newWeight = oldWeight + newWeights[a] - newWeights[b];
        edge.setWeight(newWeight);
      }
      else {
        //collecting edgeID and directedness for later re-use
        let edgeID: string = edge.getID();
        let dirNess: boolean = edge.isDirected();
        RWGraph.deleteEdge(edge);
        let oldWeight = $PFS.DEFAULT_WEIGHT;
        let newWeight = oldWeight + newWeights[a] - newWeights[b];
        RWGraph.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
      }
    }
  }

  else {
    RWGraph = graph.clone();
  }

  let RWAllNodes = RWGraph.getNodes();
  let RWNodeKeys = Object.keys(RWAllNodes);

  //reminder: return type of PFS (last step of Dijkstras) is a dict
  //keys are IDs of the target nodes, values are PFS entries (distance, parent, count)

  let dist: any[];
  let next: any[];

  //filling the output arrays with Dijkstra results

  for (let src_id = 0; src_id < RWNodeKeys.length; src_id++) {
    //making place for the source node line in both arrays
    dist.push([]);
    next.push([]);

    //and here I could collate the DijkstraAlt results, 
    //according to the nodeKeys, into a 2D and 3D array

    /*let resultD= Dijkstra(RWGraph, RWAllNodes[src_id]);
    //reminder: resultD is a dict, key(target node id):PFSEntry (distance, parent, count)
    let targetKeys=Object.keys(resultD);
    
    for (let tgt_id=0; tgt_id<targetKeys.length;tgt_id++){
      //making place for target arrays in next (only in next)
      next [src_id].push([]);

      //getting the actual PFS Entry (a BaseNode)
      let entryForTgt = resultD[tgt_id];

      dist[src_id].push(entryForTgt.distance);

      //reminder: parentForTgt is a BaseNode
      let parentForTgt = entryForTgt.parent;

      while (true){
        if (parentForTgt.getID()==RWNodeKeys[src_id]){
          next[src_id][tgt_id].splice(0, 0, parentForTgt);
          break;
        }
        if (parentForTgt==null){
          next[src_id][tgt_id].push(null);
          break;
        }*/

  }

  return { dist, next };
}


export {
  Johnsons
};