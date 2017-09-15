/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $FW from '../search/FloydWarshall';
import * as $PFS from '../search/PFS';
import * as $N from '../core/Nodes';


//Just get all shortest path's from each node to each other node (this will take a while...)
function inBetweennessCentrality( graph: $G.IGraph, sparse?: boolean ) {
  let paths;
  if(sparse){
    throw new Error("Not implemented yet")
    //paths = Bellman Ford
  }
  else
    paths = $FW.FloydWarshallAPSP(graph)[1];

  let nodes = graph.adjListArray();
  let map = {};
  for (let keyA in nodes) {
    map[keyA] = 0;
  }
  let N = paths.length;
  for (var a = 0; a < N; ++a) {
    for (var b = 0; b < N; ++b) {
      if(a!=b && !(paths[a][b].length == 1 && paths[a][b][0] == b)){
        addBetweeness(a, b, paths, map, a);
      }
    }
  }
  let dem = 0;
  for(let a in map){
    dem +=map[a];
  }
  for(let a in map){
    map[a]/=dem;
  }
  return map;
}

function addBetweeness(u, v, next, map, start){
  if(u==v)
    return 1;     //Terminal nodes return 1
  let nodes = 0;  //count of terminal nodes (= number of path's to v)
  for(let e = 0; e < next[u][v].length; e ++){
      nodes += addBetweeness(next[u][v][e], v, next, map, start); //Add all child nodes reachable from this node
  }
  if(u!=start){
    map[u] += nodes;
  }
  return nodes;
}

export {
  inBetweennessCentrality
};