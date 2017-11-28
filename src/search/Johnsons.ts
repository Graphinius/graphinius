
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $PFS from '../../src/search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $D from '../search/Dijkstra';
import { BellmanFordDict } from '../search/BellmanFord';
import { Dijkstra } from '../search/Dijkstra';



//return type will change! Most probably two 2d arrays may work - 1 for distances, 1 for parent nodes
function Johnsons(graph: $G.IGraph, cycle = true): { [id: string]: $PFS.PFS_ResultEntry } {
  //getting all graph nodes
  let allNodes: { [key: string]: $N.IBaseNode } = graph.getNodes();

  let nodeKeys = Object.keys(allNodes); 
  

  //the extra node we need to re-weigh the edges
  var extraNode: $N.IBaseNode = new $N.BaseNode("extraNode");

  //to help testing, I will make two graph clones
  //strategy: original graph -> graphForBF (contains extraNode and temporary edges) -> RWGraph (re-weighted, extraNode removed) 
  //reWeightedGraph will be used for the Dijkstras
  let graphForBF: $G.IGraph = graph.clone();
  graphForBF.addNode(extraNode);

  //adding the temporary edges

  //==================!
  //I made 2 for loops, I suppose both are good, but now for safety I left both to show you
  //please tell which is better (if any of them is good, but the compiler is not crying... so I hope they are OK)

  //=================!
  //here I added a counter to the edge ID, so that each added edge has a different label
  //I think this is not important, because it is the ID which counts
  //if this is really so, I can remove the counter
  let count = 0;
  for (let nodeId of nodeKeys) {
    graphForBF.addEdgeByNodeIDs("temp" + count++, "extraNode", nodeId, { directed: true, weighted: true, weight: 0 });
  }

  //OR - alternative for loop, I suppose both are good, please correct if not
    for (let i = 0; i < nodeKeys.length; i++) {
    let actualNode = allNodes[nodeKeys[i]];
    graphForBF.addEdgeByID("temp"+i, extraNode, actualNode, { directed: true, weighted: true, weight: 0 });
  }

  //now the Bellman-Ford, and re-weighting, if there are no negative edges
  if (! <boolean>BellmanFordDict(graphForBF, extraNode, true)) {
    throw new Error("The graph contains negative cycle(s), it makes no sense to continue");
    //=================!
    //do I need to put in some "break" command here?
    //I mean, if there is negative cycle, there is no sense to continue
    //or should I simply put the rest of the code into an "else" block, as I did now? (pls see where this coming "else" block ends)
  }
  else {
    let newWeights: {} = <{}>BellmanFordDict(graphForBF, extraNode, true);

    //deleting the distance 0 of the extraNode, it is no more needed
    delete newWeights["extraNode"];

    //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
    //RWGraph will be a clone of the original graph, then no node deletion needed
    var RWGraph :$G.IGraph = graph.clone();
    let edges = RWGraph.getDirEdgesArray().concat(RWGraph.getUndEdgesArray());
    for (let edgeID in edges){
      let edge=edges[edgeID];
      var a = edge.getNodes().a.getID();
      var b = edge.getNodes().b.getID();
      if (edge.isWeighted) {
        let oldWeight=edge.getWeight();
        let newWeight=oldWeight+newWeights[a]-newWeights[b];
        edge.setWeight(newWeight);
      }
      else {
        //========================!
        //is this the right thing to do?
        //in the class Bellman-Ford, if there is no weight, the default value 1 is used
        //in the class Edge, it is told the weighted and directed parameters should not be changed on live edges,
        //one should delete and re-create instead
        //so if not weighted, I delete the edge, then create a new one
        //with the same ID and directedness, but weighted. The old weight is set artificially to 1. 

        //collecting edgeID and directedness for later re-use
        let edgeID:string=edge.getID();
        let dirNess: boolean= edge.isDirected();
        RWGraph.deleteEdge(edge);
        let oldWeight=$PFS.DEFAULT_WEIGHT;
        let newWeight=oldWeight+newWeights[a]-newWeights[b];
        RWGraph.addEdgeByNodeIDs(edgeID, a, b, {directed: dirNess, weighted: true, weight: newWeight});
        }
    }
    
    //=============! 
    //pls go through this part too, if this is correct so far
    //call Dijkstras for each nodes on RWGraph
    //will need the distances and parents for each target node, starting from each graph node as a source
    let RWAllNodes = RWGraph.getNodes();
    let RWNodeKeys=Object.keys(RWAllNodes);
     //reminder: return type of PFS (last step of Dijkstras) is a dict
     //keys are IDs of the target nodes, values are PFS entries (distance, parent, count)

    for (let nodeID of RWNodeKeys){
      let resultD= Dijkstra(RWGraph, RWAllNodes[nodeID]);
      let targetKeys=Object.keys(resultD);
        for (let targetNode in targetKeys){
          let entryForThisTarget = resultD[targetNode];
          let distanceForThisTarget = entryForThisTarget.distance;
          let parentForThisTarget = entryForThisTarget.parent;
        //and here I should build the final return structure once I figure out how that should look   
         
          
        }
    }
    //return return structure here

  }
  //this part is under construction
  return {};
  }


export {
  Johnsons
};