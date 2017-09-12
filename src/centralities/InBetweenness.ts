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
  for (let keyA in nodes) {
    for (let keyB in nodes) {
      if(keyA!=keyB && paths[keyA][keyB]!=keyB){
        addBetweeness(keyA, keyB, paths, map, keyA);
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
  console.log(paths);
  return map;
}

function addBetweeness(u, v, next, map, start){
  if(u==v)
    return 1;     //Terminal nodes return 1
  let nodes = 0;  //count of terminal nodes (= number of path's to v)
  for(let e of next[u][v]){
      nodes += addBetweeness(e, v, next, map, start); //Add all child nodes reachable from this node
  }
  if(u!=start){
    map[u] += nodes;
  }
  return nodes;
}

export {
  inBetweennessCentrality
};