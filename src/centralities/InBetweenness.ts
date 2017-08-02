/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $FW from '../search/FloydWarshall';

//Just get all shortest path's from each node to each other node (this will take a while...)
function inBetweennessCentrality( graph: $G.IGraph, sparse?: boolean ) {
  let paths;
  if(sparse)
    paths = $FW.FloydWarshallSparse(graph)[1];
  else
    paths = $FW.FloydWarshallDense(graph)[1];

  console.log(paths);

  let nodes = graph.getNodes();
  let map = {};
  for (let keyA in nodes) {
    map[keyA] = 0;
  }
  for (let keyA in nodes) {
    for (let keyB in nodes) {
      addBetweeness(keyA,keyB,paths,map);
    }
  }

  return map;
}

function addBetweeness(u,v,next, map){
  if (next[u][v] == null)
    return;
  //Don't increase the betweenness of the start and end node
  while (u != v) {
    u = next[u][v];
    if(u!=v) {
      map[u]++;
      //if(u=="E")
      //  console.log("E from " + uo + " to " + v);
    }
  }
  return
}

export {
  inBetweennessCentrality
};