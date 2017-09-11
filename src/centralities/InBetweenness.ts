/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $FW from '../search/FloydWarshall';
import * as $PFS from '../search/PFS';
import * as $N from '../core/Nodes';


//TODO: IMPLEMENT
function inBetweennessCentralityDijkstra(graph: $G.IGraph, weighted: boolean){
  let pfs_config:$PFS.PFS_Config = $PFS.preparePFSStandardConfig();
  if(!weighted && weighted != null) //If we want, we can ignore edgeWeights, then every edge has weight 1
    pfs_config.evalPriority = function(ne: $N.NeighborEntry) {
      return $PFS.DEFAULT_WEIGHT;
    };
  let accumulated_distance = 0;
  //set the config (we want the sum of all edges to become a property of result)

  //a node is encountered the first time
  let not_encountered = function( context : $PFS.PFS_Scope ) {
    // adding the distance to the accumulated distance

    accumulated_distance += context.current.best + context.next.edge.getWeight();
    //console.log("distance: "+context.current.node.getID()+"->"+context.next.node.getID()+" = " + context.current.best + context.next.edge.getWeight());
  };
  //We found a better path, we need to correct the accumulated distance
  var betterPathFound = function( context: $PFS.PFS_Scope  ) {
    //console.log("correcting distance "+context.current.node.getID()+"->"+context.next.node.getID()+" from " + pfs_config.result[context.next.node.getID()].distance + "to" + context.better_dist);
    accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.better_dist;
  };

  let bp = pfs_config.callbacks.better_path.pop(); //change the order, otherwise our betterPathFound would not do anything
  pfs_config.callbacks.better_path.push(betterPathFound);
  pfs_config.callbacks.better_path.push(bp);
  pfs_config.callbacks.not_encountered.push(not_encountered);

  let ret:{[id:string]: number} = {};
  for (let key in graph.getNodes()) {
    let node = graph.getNodeById(key);
    if (node != null) {//TODO: maybe put inner of loop into own function (centrality for one single node)
      accumulated_distance = 0;
      let allDistances = $PFS.PFS(graph, node, pfs_config);
      ret[key] = 1/accumulated_distance;
    }

  }
  return ret;
}

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
        nop += addBetweeness(keyA,keyB,paths,map);
      }
    }
  }
  for(let a in map){
    map[a] /= nop; //Is this correct? A path has multiple nodes... so this is >= 1
  }
  return map;
}

function addBetweeness(u,v,next, map, fact = 0){
  if(u==v)
    return 0;
  for(let e of next[u][v]){
    if(e!=v) {
      fact += addBetweeness(e, v, next, map, 0);
      map[e] += 1;
      fact++;
    }
  }
  return fact;
}

export {
  inBetweennessCentrality
};