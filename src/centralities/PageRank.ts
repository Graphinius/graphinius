/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';

function pageRankCentrality( graph: $G.IGraph ) {
  return graph.degreeDistribution();
}

export {
  pageRankCentrality
};