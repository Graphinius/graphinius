/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $E from '../core/Edges';
import * as $N from '../core/Nodes';
import * as $SU from '../utils/structUtils'
import {DEFAULT_WEIGHT} from "./PFS";

interface edge_entry_BF {
  a_idx   : number;
  b_idx   : number;
  weight  : number;
}

export type edges_BF = Array<edge_entry_BF>;


let dists = {},
    edges: Array<$E.IBaseEdge>,
    edge: $E.IBaseEdge,
    a: string,
    b: string,
    weight: number,
    new_weight: number,
    nodes_size: number;


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


function BellmanFordArray(graph: $G.IGraph, start: $N.IBaseNode) : Array<number> {
  BFSanityChecks(graph, start);
  let dists = [];
  let adj_matrix = graph.adjListArray();
  console.log(adj_matrix);

  let nodes = graph.getNodes(),
      keys = Object.keys(nodes),
      node : $N.IBaseNode;

  for ( let n_idx = 0; n_idx < keys.length; ++n_idx ) {
    node = nodes[keys[n_idx]];
    dists[n_idx] = ( node === start ) ? 0 : Number.POSITIVE_INFINITY;
  }


  
  return dists;
}


/**
 * 
 * @param graph 
 * @param start 
 */
function BellmanFord(graph: $G.IGraph, start: $N.IBaseNode) : {} {
  BFSanityChecks(graph, start);

  dists = {}; // Reset dists, TODO refactor
  edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
  nodes_size = graph.nrNodes();
  
  for ( let node in graph.getNodes() ) {
    dists[node] = Number.POSITIVE_INFINITY;
  }
  dists[start.getID()] = 0;

  for ( let i = 0; i < nodes_size-1; ++i ) {
    for ( let e_idx = 0; e_idx < edges.length; ++e_idx ) {
      edge = edges[e_idx];
      a = edge.getNodes().a.getID();
      b = edge.getNodes().b.getID();
      weight = isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT;
      updateDist(a, b, weight);
      !edge.isDirected() && updateDist(b, a, weight);
    }
  }

  function updateDist(u, v, weight) {
    new_weight = dists[u] + weight;
    if ( dists[v] > new_weight ) {
      dists[v] = new_weight;
    }
  }
  
  return dists;
}


function hasNegativeCycle(graph: $G.IGraph, start: $N.IBaseNode) : boolean {
  dists = BellmanFord(graph, start);
  // let edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
  for ( let edgeID in edges ) {
    edge = edges[edgeID];
    a = edge.getNodes().a.getID();
    b = edge.getNodes().b.getID();
    weight = isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT;
    if ( betterDist(a, b, weight) || ( !edge.isDirected() && betterDist(b, a, weight) ) ) {
      return true;
    }
  }
  return false;
  
  function betterDist(u, v, weight) {
    return ( dists[v] > dists[u] + weight );
  }
}


export {
  BellmanFord,
  BellmanFordArray,
  hasNegativeCycle
};