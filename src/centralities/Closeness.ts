/// <reference path="../../typings/tsd.d.ts" />

/*
    This calculates the shortest path to all others, this is accomplished by using
    the PFS of Graphinius
 */
import * as $G from '../core/Graph';
import * as $PFS from '../search/PFS';
import * as $ICentrality from "../centralities/ICentrality";
import * as $N from '../core/Nodes';

//Calculates all the shortest path's to all other nodes for all given nodes in the graph
//Returns a map with every node as key and the average distance to all other nodes as value
class closenessCentrality implements $ICentrality.ICentrality {

  getCentralityMap(graph: $G.IGraph, weighted: boolean): {[id: string]: number} {
    let pfs_config:$PFS.PFS_Config = $PFS.preparePFSStandardConfig();
    if(!weighted && weighted != null) //If we want, we can ignore edgeWeights, then every edge has weight 1
      pfs_config.evalPriority = function(ne: $N.NeighborEntry) {
        return $PFS.DEFAULT_WEIGHT;
      };
    let ret:{[id:string]: number} = {};
    for (let key in graph.getNodes()) {
      let n = 1;
      let currAvg = 0;
      let node = graph.getNodeById(key);
      if (node != null) {//TODO: maybe put inner of loop into own function (centrality for one single node)
        let allDistances = $PFS.PFS(graph, node, pfs_config);
        for (let distanceKey in allDistances) {
          if (distanceKey != key) {
            currAvg = currAvg + (allDistances[distanceKey].distance - currAvg) / n;
            n++;
          }
        }
        ret[key] = currAvg;
      }

    }
    return ret;
  }
}
export {
  closenessCentrality
};