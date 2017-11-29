
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $PFS from '../../src/search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $D from '../search/Dijkstra';
import { BellmanFordDict, BellmanFordArray } from '../search/BellmanFord';
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
  
  // @answer<Bernd>
  // both will work, but it might be that the 2nd is faster than the first
  // see this performance shootout:
  // https://jsperf.com/performance-of-array-vs-object/3
  // for now I would suggest leaving both in and commenting one out, so that we
  // can performance test later...
  // I am experimenting now with writing code in Rust and compiling it to WASM,
  // if that works well we might re-implement compute-intensive methods in this way...

  //=================!
  //here I added a counter to the edge ID, so that each added edge has a different label
  //I think this is not important, because it is the ID which counts
  //if this is really so, I can remove the counter

  // @answer<Bernd>
  // Yes, it seems to me this is irrelevant, as we only need the distances <extraNode->node(v_i)>
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

  // @correction<Bernd>
  // if you only want to know about negative cycles, the array version is faster
  // and the return value is 'true' if there is indeed a negative cycle
  if (<boolean>BellmanFordArray(graphForBF, extraNode, true)) {
  // if (! <boolean>BellmanFordDict(graphForBF, extraNode, true)) {
    throw new Error("The graph contains negative cycle(s), it makes no sense to continue");
    //=================!
    //do I need to put in some "break" command here?
    //I mean, if there is negative cycle, there is no sense to continue
    //or should I simply put the rest of the code into an "else" block, as I did now? (pls see where this coming "else" block ends)

    // @answer<Bernd>
    // nope, forget the else, if this one throws an error, the rest of the code won't execute anyways
  }

  else {
    // @correction<Bernd>
    // here you don't want to check for a cycle, right?
    let newWeights: {} = <{}>BellmanFordDict(graphForBF, extraNode, false);
    // let newWeights: {} = <{}>BellmanFordDict(graphForBF, extraNode, true);

    //deleting the distance 0 of the extraNode, it is no more needed
    delete newWeights["extraNode"];

    // @suggestion<Bernd>
    // don't you wanna delete the extraNode here again?
    // graph.deleteNode(extraNode);


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

        // @answer<Bernd>
        // good thinking, this scenario shows you the complexities of a mixed mode graph
        // this is why most other graph libraries make these artificial distinctions
        // between graph, digraph and weighted (di)graph.. ;-))

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

    for (let nodeID of RWNodeKeys) {
      let resultD= Dijkstra(RWGraph, RWAllNodes[nodeID]);
      let targetKeys=Object.keys(resultD);

      for (let targetNode in targetKeys){
        let entryForThisTarget = resultD[targetNode];
        let distanceForThisTarget = entryForThisTarget.distance;
        let parentForThisTarget = entryForThisTarget.parent;
      //and here I should build the final return structure once I figure out how that should look   
        
      // @answer<Bernd>
      // exactly - and here I would have a look at Benedikt's code, or better:
      // take a look at how the object wich is called in 'centralities/Betweenness.ts', 
      // line 27 is constructed in 'search/FloydWarshall.ts' 
      // in principle, it's this 'next' object you would have to construct and then
      // return [dists, next]; -> as in 'search/FloydWarshall.ts' line 78
      // so your job is to somehow merge the n dijkra return structures into those
      // dists & next structures ;)
      // then in 'centralities/Betweenness.ts', we could simply do a check on the
      // number of nodes and edges in the graph, and if it is dense, we keep the
      // call to FloydWarshall, but if it is sparse, we call Johnson's => easy!          
      }
      
    }
    //return structure here




  }
  //this part is under construction
  return {};
  }


export {
  Johnsons
};