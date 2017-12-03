/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
import * as $PFS from '../../src/search/PFS';
import { BaseNode, IBaseNode } from '../core/Nodes';


/**
 * TODO Consider target node callbacks / messages
 * @param graph
 * @param v 
 */
function Dijkstra( graph   : $G.IGraph,
                   source  : $N.IBaseNode,
                   target? : $N.IBaseNode ) : {[id: string] : $PFS.PFS_ResultEntry} 
{
  let config = $PFS.preparePFSStandardConfig();

  if ( target ) {
    config.goal_node = target;
  }

  return $PFS.PFS( graph, source, config );
}

//output types used for DijkstraAlt
export type DijkstraAltDistOutput = {[key:string]:number};
export type DijkstraAltParentOutput = {[key:string]:[$N.IBaseNode]};


function DijkstraAlt ( graph   : $G.IGraph,
                      source  : $N.IBaseNode,
                      target? : $N.IBaseNode ) : [DijkstraAltDistOutput, DijkstraAltParentOutput] 
{
//getting the neighbor nodes for each node
let allNeighbors= graph.adjListDict(false, false, 0);

//initializing helper lists and output
let visitedNodes :string [];
let unvisitedNodes:{[key:string]:number};
let unvisitedNodeKeys=Object.keys(unvisitedNodes);

let distOutput:DijkstraAltDistOutput;
let parentOutput:DijkstraAltParentOutput;

let allNodes=graph.getNodes();
let nodeKeys = Object.keys(allNodes); 

//initializing values in the output dict, and in the unvisited nodes
for (let nodeKey in allNodes){
  if (allNodes[nodeKey]==source) {
    distOutput[nodeKey]=0;
    parentOutput[nodeKey]=[source];
    unvisitedNodes[nodeKey]=0;
  }
  else {
    distOutput[nodeKey]=Number.POSITIVE_INFINITY;
    parentOutput[nodeKey]=[null];
    unvisitedNodes[nodeKey]=Number.POSITIVE_INFINITY;
  }
}

//let it begin
for (let i=0; i<nodeKeys.length; i++){
  //choosing the next node to visit
  let nextNodeKey=unvisitedNodeKeys[0];
  for (let node in unvisitedNodes){
    if (unvisitedNodes[node]<unvisitedNodes[nextNodeKey]){
      nextNodeKey=node;
    }
  }
if (unvisitedNodes[nextNodeKey]==Number.POSITIVE_INFINITY){
  break;
}
//updating the visited-unvisited lists
visitedNodes.push(nextNodeKey);
delete unvisitedNodes[nextNodeKey];
let indDel = unvisitedNodeKeys.indexOf(nextNodeKey);
unvisitedNodeKeys.splice(indDel, 1);

//updating the distance/parent of the neighbor nodes
//reminder - neighbors is a node:distance dictionary
let neighbors = allNeighbors[nextNodeKey];
for (let key in neighbors){
  if (visitedNodes.indexOf(key)<0){
    if (distOutput[key]>distOutput[nextNodeKey]+neighbors[key]) {
      distOutput[key]=distOutput[nextNodeKey]+neighbors[key];
      parentOutput[key]=[allNodes[nextNodeKey]];
    }
    if (distOutput[key]=distOutput[nextNodeKey]+neighbors[key]){
      parentOutput[key].push(allNodes.nextNodeKey);
    }
  }
}
}



return [distOutput, parentOutput];
}

export {
  Dijkstra, DijkstraAlt
};