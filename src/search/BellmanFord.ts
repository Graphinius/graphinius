/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $E from '../core/Edges';
import * as $N from '../core/Nodes';
import * as $SU from '../utils/structUtils'
import {DEFAULT_WEIGHT} from "./PFS";

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
  let distArray = [];

  let nodes = graph.getNodes(),
      node_keys = Object.keys(nodes),
      node : $N.IBaseNode,
      id_idx_map: {} = {},
      bf_edge_entry

  for ( let n_idx = 0; n_idx < node_keys.length; ++n_idx ) {
    node = nodes[node_keys[n_idx]];
    distArray[n_idx] = ( node === start ) ? 0 : Number.POSITIVE_INFINITY;
    id_idx_map[node.getID()] = n_idx;
  }

  // Initialize an edge array just holding the node indices, weight and directed
  let graph_edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
  let bf_edges = [];  
  for ( let e_idx = 0; e_idx < graph_edges.length; ++e_idx ) {    
    edge = graph_edges[e_idx];
    let bf_edge_entry = 
    bf_edges.push( [
      id_idx_map[edge.getNodes().a.getID()],
      id_idx_map[edge.getNodes().b.getID()],
      isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT,
      edge.isDirected()
    ] );
  }

  for ( let i = 0; i < node_keys.length-1; ++i ) {
    for ( let e_idx = 0; e_idx < bf_edges.length; ++e_idx ) {
      edge = bf_edges[e_idx];
      updateDist(edge[0], edge[1], edge[2]);
      !edge[3] && updateDist(edge[1], edge[0], edge[2]);
    }
  }

  function updateDist(u, v, weight) {
    new_weight = distArray[u] + weight;
    if ( distArray[v] > new_weight ) {
      distArray[v] = new_weight;
    }
  }
  
  return distArray;
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