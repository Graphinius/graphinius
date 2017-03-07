/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';

//Calculates the page rank for a given graph
function pageRankCentrality( graph: $G.IGraph ) {
  //First initialize the values for all nodes
  let startVal:number = 1 / graph.nrNodes();
  let pageScores:{[k:string]: number;} = {};
  for(let key in graph.getNodes()) {
    pageScores[key] = startVal;
  }
  return graph.degreeDistribution();
}

export {
  pageRankCentrality
};