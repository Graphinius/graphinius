import * as $G from '@/core/base/BaseGraph';
import * as $E from '@/core/base/BaseEdge';
import * as $N from '@/core/base/BaseNode';
import { DEFAULT_WEIGHT } from "./PFS";


export interface BFArrrayResult {
  distances: Array<number>;
  neg_cycle: boolean;
}


export interface BFDictResult {
  distances: {};
  neg_cycle: boolean;
}


/**
 * 
 * @param graph 
 * @param start 
 */
function BFSanityChecks(graph: $G.IGraph, start: $N.IBaseNode) {
  if (graph == null || start == null) {
    throw new Error('Graph as well as start node have to be valid objects.');
  }
  if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
    throw new Error('Cowardly refusing to traverse a graph without edges.');
  }
  if (!graph.hasNodeID(start.getID())) {
    throw new Error('Cannot start from an outside node.');
  }
}


function BellmanFordArray(graph: $G.IGraph, start: $N.IBaseNode): BFArrrayResult {
  BFSanityChecks(graph, start);

  let distances: Array<number> = [],
    nodes = graph.getNodes(),
    edge: $E.IBaseEdge,
    node_keys = Object.keys(nodes),
    node: $N.IBaseNode,
    id_idx_map: {} = {},
    bf_edge_entry,
    new_weight: number,
    neg_cycle: boolean = false;


  for (let n_idx = 0; n_idx < node_keys.length; ++n_idx) {
    node = nodes[node_keys[n_idx]];
    distances[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
    id_idx_map[node.getID()] = n_idx;
  }

  // Initialize an edge array just holding the node indices, weight and directed
  let graph_edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
  let bf_edges = [];
  for (let e_idx = 0; e_idx < graph_edges.length; ++e_idx) {
    edge = graph_edges[e_idx];
    let bf_edge_entry =
      bf_edges.push([
        id_idx_map[edge.getNodes().a.getID()],
        id_idx_map[edge.getNodes().b.getID()],
        isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT,
        edge.isDirected()
      ]);
  }

  for (let i = 0; i < node_keys.length - 1; ++i) {
    for (let e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
      edge = bf_edges[e_idx];
      updateDist(edge[0], edge[1], edge[2]);
      !edge[3] && updateDist(edge[1], edge[0], edge[2]);
    }
  }

  for (let e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
    edge = bf_edges[e_idx];
    if (betterDist(edge[0], edge[1], edge[2]) || (!edge[3] && betterDist(edge[1], edge[0], edge[2]))) {
      neg_cycle = true;
      break;
    }
  }

  function updateDist(u, v, weight) {
    new_weight = distances[u] + weight;
    if (distances[v] > new_weight) {
      distances[v] = new_weight;
    }
  }

  function betterDist(u, v, weight) {
    return (distances[v] > distances[u] + weight);
  }

  return { distances, neg_cycle };
}



/**
 * 
 * @param graph 
 * @param start 
 */
function BellmanFordDict(graph: $G.IGraph, start: $N.IBaseNode): BFDictResult {
  BFSanityChecks(graph, start);

  let distances = {},
    edges: Array<$E.IBaseEdge>,
    edge: $E.IBaseEdge,
    a: string,
    b: string,
    weight: number,
    new_weight: number,
    nodes_size: number,
    neg_cycle: boolean = false;

  distances = {}; // Reset dists, TODO refactor
  edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
  nodes_size = graph.nrNodes();

  for (let node in graph.getNodes()) {
    distances[node] = Number.POSITIVE_INFINITY;
  }
  distances[start.getID()] = 0;

  for (let i = 0; i < nodes_size - 1; ++i) {
    for (let e_idx = 0; e_idx < edges.length; ++e_idx) {
      edge = edges[e_idx];
      a = edge.getNodes().a.getID();
      b = edge.getNodes().b.getID();
      weight = isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT;
      updateDist(a, b, weight);
      !edge.isDirected() && updateDist(b, a, weight);
    }
  }

  for (let edgeID in edges) {
    edge = edges[edgeID];
    a = edge.getNodes().a.getID();
    b = edge.getNodes().b.getID();
    weight = isFinite(edge.getWeight()) ? edge.getWeight() : DEFAULT_WEIGHT;
    if (betterDist(a, b, weight) || (!edge.isDirected() && betterDist(b, a, weight))) {
      neg_cycle = true;
    }
  }


  function updateDist(u, v, weight) {
    new_weight = distances[u] + weight;
    if (distances[v] > new_weight) {
      distances[v] = new_weight;
    }
  }

  function betterDist(u, v, weight) {
    return (distances[v] > distances[u] + weight);
  }

  return {distances, neg_cycle};
}



export {
  BellmanFordDict,
  BellmanFordArray
};