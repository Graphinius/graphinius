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
  console.log(JSON.stringify(paths,null,2));

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

function addBetweeness(u,v,next, map, fact = 1,path=[]){
  console.log("u,v:"+u+v + " " + JSON.stringify(next[u][v]) + " ");
  if (next[u][v] == null || path.indexOf(u) >= 0)
    return;
  path.push(u);
  //Don't increase the betweenness of the start and end node
  fact = fact/next[u][v].length;
  for(let e of next[u][v]){
    if(e!=v) {
      addBetweeness(e, v, next, map, fact, path.slice(0));
      map[e] += fact;
    }
  }
      //if(u=="E")
      //  console.log("E from " + uo + " to " + v);
}

export {
  inBetweennessCentrality
};