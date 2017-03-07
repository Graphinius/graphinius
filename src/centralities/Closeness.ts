/// <reference path="../../typings/tsd.d.ts" />

/*
    This calculates the shortest path to all others, this is accomplished by using
    the PFS of Graphinius JS
 */
import * as $G from '../core/Graph';
import * as $PFS from '../search/PFS';

//Calculates all the shortest path's to all other nodes for all given nodes in the graph
//Returns a map with every node as key and the average distance to all other nodes as value
function closenessCentrality(graph: $G.IGraph){//}, rootNode:$N.IBaseNode){
  let ret = {};
  for(let key in graph.getNodes())
  {
    let n = 1;
    let currAvg = 0;
    let node = graph.getNodeById(key);
    if(node != null){//TODO: maybe put inner of loop into own function (centrality for one single node)
      let allDistances = $PFS.PFS(graph, node);
      for(let distanceKey in allDistances)
      {
        if(distanceKey != key){
          currAvg = currAvg + (allDistances[distanceKey].distance - currAvg)/n;
          n++;
        }
      }
      ret[key] = currAvg;
    }

  }
  return ret;
}

export {
  closenessCentrality
};