/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';

//Just get all shortest path's from each node to each other node (this will take a while...)
function inBetweennessCentrality( graph: $G.IGraph ) {
  return graph.degreeDistribution();
}

export {
  inBetweennessCentrality
};