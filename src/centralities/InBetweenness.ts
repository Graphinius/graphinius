/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';

function inBetweennessCentrality( graph: $G.IGraph ) {
  return graph.degreeDistribution();
}

export {
  inBetweennessCentrality
};