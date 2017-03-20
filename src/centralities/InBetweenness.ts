/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $BFS from '../search/BFS';

//Just get all shortest path's from each node to each other node (this will take a while...)
function inBetweennessCentrality( graph: $G.IGraph, weighted?: boolean ) {
  let ret = {}; //Will be a map of [nodeID] = centrality
  for(let key in graph.getNodes())
  {
    let node = graph.getNodeById(key);
    if(node != null){//TODO: maybe put inner of loop into own function (centrality for one single node)
      let allDistances = $BFS.BFS(graph, node);
      //Now we go through the result and add the scores to the corresponding nodes
      //We would actually need the shortest path here, not a distribution
      //console.log(allDistances);
      for(let distanceKey in allDistances)
      {
        if(ret[distanceKey] == null)
          ret[distanceKey] = 0;
        ret[distanceKey]++;
      }
    }

  }
  return ret;
}

export {
  inBetweennessCentrality
};