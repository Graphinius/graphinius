
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $PFS from '../../src/search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $D from '../search/Dijkstra';

//the main function
//first call addExtraNodeWithEdges
//then call BellmanFord - also check for negative cycle
//then call removeExtraNodeWithEdges
//then call Dijkstra

var extraNode : $N.IBaseNode = new $N.BaseNode ("extraNode");

function Johnsons ( graph: $G.IGraph, start: $N.IBaseNode, cycle = false) : {[id: string] : $PFS.PFS_ResultEntry} 
{
addExtraNodeWithEdges(graph);
//now the Bellman-Ford
//instead, Bellman-Ford right away
if (graph.hasNegativeCycles()){
  throw new Error('Can not continue: the graph has negative cycle');
}
else {
let resultBF:Array<number>=<Array<number>>$BF.BellmanFordArray(graph, extraNode, true);
//now I need to put these data to the graph - ??
//re-weigh edges. In the array: node distances are in. 
//use BF-Dict!
removeExtraNodeWithEdges(graph);

//call Dijkstras for each nodes
//PFS_ResultEntry as return type not clear for me, the [id:string]part of it

let allNodes :{[key:string]:$N.IBaseNode} =graph.getNodes();
let resultJohnson:{[id: string] : $PFS.PFS_ResultEntry};
for (let count=0; count<graph.nrNodes(); count++) {
  let source=allNodes[count];
  let actualResult:{[id: string] : $PFS.PFS_ResultEntry}=$D.Dijkstra(graph, source);
  //I need to add these, tried push, concat, simple +, but none of them worked
  // resultJohnson.concat(actualResult);

}
//most probably this is not the nicest output
//should work more on it later
return resultJohnson;


}


//now somehow I need to update the graph edge weights 
//how??







}
//adds an extra node to the graph
//adds edges
//are they need to be directed?
//all weighted, weight =0
//test: if this is a real graph: >1 nodes, >=1 edges
//test if extraNode has been added
//test if edges from extraNode are added, 
//are directed? and weighted with a weight of 0
//does not need to be a separate function, does not need to return
function addExtraNodeWithEdges (graph: $G.IGraph) :  $G.IGraph {

  //getting all graph nodes
  let allNodes :{[key:string]:$N.IBaseNode} =graph.getNodes();

  graph.addNode(extraNode);

  Object.keys(graph.getNodes()) // array o
  //connecting the extraNode
  //tried foreach but did not work, the normal for loop seems ok
for (let count=0; count<graph.nrNodes(); count++) {
 let target=allNodes[count];
  let tempEdge= new $E.BaseEdge("temp", extraNode, target, {directed:true, weighted:true, weight:0});
  //do I need to make it directed? I tried but could not?
  //tempEdge.setWeight(0);
//add to graph
}
return graph;
}

//removes all edges starting from the extra point
//removes the extra point
//test: if extraNode was removed
//test: if edges were removed
function removeExtraNodeWithEdges (graph: $G.IGraph) :  $G.IGraph{
 //I may not need this
  //extraNode.clearOutEdges();
  graph.deleteNode(extraNode);

return graph;
}


export {
  Johnsons
};