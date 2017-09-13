/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $E from '../core/Edges';
import * as $N from '../core/Nodes';
import * as $SU from '../utils/structUtils'
import {DEFAULT_WEIGHT} from "./PFS";


/**
 * 
 * @param graph 
 * @param start 
 */
function BFSanityChecks(graph: $G.IGraph, start: $N.IBaseNode) {
  if ( graph == null || start == null ) {
    throw new Error('Graph as well as start node have to be valid objects.');
  }
  if ( graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0 ) {
    throw new Error('Cowardly refusing to traverse a graph without edges.');
  }
  if ( !graph.hasNodeID( start.getID() ) ) {
    throw new Error('Cannot start from an outside node.');
  }
}


/**
 * 
 * @param graph 
 * @param start 
 */
function BellmanFord(graph: $G.IGraph, start: $N.IBaseNode) : {} {
  BFSanityChecks(graph, start);

  let dists = {},
      edges: {},
      edge : $E.IBaseEdge,
      a: string,
      b: string,
      weight: number,
      new_weight: number,
      size = graph.nrNodes();
  
  
  for ( let node in graph.getNodes() ) {
    dists[node] = Number.POSITIVE_INFINITY;
  }
  dists[start.getID()] = 0;

  edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
  for ( let i = 0; i < size-1; ++i ) {
    for ( let edgeID in edges ) {
      edge = edges[edgeID];
      a = edge.getNodes().a.getID();
      b = edge.getNodes().b.getID();
      updateDist(a, b);
      if ( !edge.isDirected() ) {
        updateDist(b, a);
      }
    }
  }

  function updateDist(u, v) {
    weight = isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT;
    new_weight = dists[u] + weight;
    if ( dists[v] > new_weight ) {
      dists[v] = new_weight;
    }
  }
  
  return dists;
}



export {
  BellmanFord
};