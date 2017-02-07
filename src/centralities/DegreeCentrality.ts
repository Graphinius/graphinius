/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';

function degreeCentrality( graph: $G.IGraph ) {
  return graph.degreeDistribution();
}

export {
  degreeCentrality
};