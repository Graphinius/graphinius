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
 * @param config
 * @constructor
 */
function PFS_BFS( config: PFS_Config ) {

}

function prepareStandardPFSBFSConfig() {
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


function prepareStandardPFSDFSConfig() {

}

export { PFS_BFS, prepareStandardPFSBFSConfig };