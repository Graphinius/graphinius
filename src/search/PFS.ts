/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';
import * as $BFS from './BFS';
import * as $DFS from './DFS';


export interface PFS_Config {
  dir_mode      : $G.GraphMode;
  cost_function : Function;
}


/**
 * Priority first search on BFS
 *
 * By default we are going to implement
 * greedy best-first-search (pure heuristic search)
 * which expands the path along the edges
 * of least weight, if no other cost function is given
 *
 * @param graph
 * @param v
 * @param config
 * @constructor
 */
function PFS_BFS( graph   : $G.IGraph,
                  v       : $N.IBaseNode,
                  config? : PFS_Config ) {

  var config = config || preparePFSBFSStandardConfig(),
      bfs_config = $BFS.prepareBFSStandardConfig();

  bfs_config.callbacks.sort_nodes = config.cost_function;
  bfs_config.dir_mode = config.dir_mode;

  return $BFS.BFS(graph, v, bfs_config);
}


function preparePFSBFSStandardConfig() {
  var config : PFS_Config = {
    dir_mode: $G.GraphMode.MIXED,
    cost_function: null
  };

  config.cost_function = ( context: $BFS.BFS_Scope ) => {
    return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
      return a.edge.getWeight() - b.edge.getWeight();
    });
  };

  return config;
}


/**
 * Priority first search on DFS
 *
 * Same default heuristics as PFS_BFS
 *
 * @param config
 * @constructor
 */
function PFS_DFS( config: PFS_Config ) {

}


function preparePFSDFSStandardConfig() {
  var config : PFS_Config = {
    dir_mode: $G.GraphMode.MIXED,
    cost_function: null
  };

  config.cost_function = ( context: $DFS.DFSVisit_Scope ) => {
    return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
      return a.edge.getWeight() - b.edge.getWeight();
    });
  };

  return config;
}

export {  PFS_BFS,
          PFS_DFS,
          preparePFSBFSStandardConfig,
          preparePFSDFSStandardConfig
       };