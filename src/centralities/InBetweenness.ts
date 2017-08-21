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

  //console.log(paths);
  //console.log(JSON.stringify(paths,null,2));

  let nodes = graph.getNodes();
  let map = {};
  for (let keyA in nodes) {
    map[keyA] = 0;
  }
  let nop = 0; //number of paths - for normalization
  for (let keyA in nodes) {
    for (let keyB in nodes) {
      if(keyA!=keyB && paths[keyA][keyB]!=keyB){
        nop += addBetweeness(keyA,keyB,paths,map,0,[],keyA) + 1;
      }
    }
  }
  for(let a in map){
    map[a] /= nop; //Is this correct? A path has multiple nodes... so this is >= 1
  }
  return map;
}

function addBetweeness(u,v,next, map, fact = 0,path=[],ou){
  if(u==v)
    if(path.length<=1)
      return -2;
    else
      return -1;
  if(path.indexOf(u) >= 0)
    return -1;
  if (next[u][v] == null)
    return -1;
  path.push(u);
  let ef = 1;
  for(let e of next[u][v]){
    if(e!=v && e!=ou) {
      fact += addBetweeness(e, v, next, map, -1, path.slice(0),ou);
      fact += ef;
      ef = 2;
      map[e] += 1;
    }
    if(e==ou){
      //Remove current branch, this probably needs to be done because we could already
      // have added betweenness values to nodes on this cycle to ou TODO
    }
  }
  return fact;
}

export {
  inBetweennessCentrality
};