/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $FW from '../search/FloydWarshall';
import * as $JO from '../search/Johnsons';
import * as $PFS from '../search/PFS';
import * as $N from '../core/Nodes';

/**
 * This is used to get the betweenness of a graph by either
 * Bellman Ford (Johnsons) or Floyd Warshall with APSP.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values (dist), m*m*m matrix of neighbors (next)
 * @constructor
 */


function betweennessCentrality(graph: $G.IGraph, directed: boolean, sparse?: boolean) {
  let paths;
  var sparse = sparse || false;

  if (sparse) {
    paths = $JO.Johnsons(graph)[1];
  }
  else {
    paths = $FW.changeNextToDirectParents($FW.FloydWarshallAPSP(graph)[1]);
  }

  let nodes = graph.getNodes();
  let map = {};
  for (let keyA in nodes) {
    //initializing the map which will be returned at the end - should it contain the keys, or the node IDs?
    map[keyA] = 0;
  }

  let N = paths.length;
  for (var a = 0; a < N; ++a) {
    for (var b = 0; b < N; ++b) {
      //if self, or b is directly reachable from a and it is the only shortest path, no betweenness score is handed out
      if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
        //goals: trace back until the starting node, reconstruct paths in a dict or array?
        //give scores: for each node, 1/x, where x is the total number of shortest paths
        let nodesToScore = [];
        //strategy: build all shortest paths, as a 2d array
        //push each node on the way into the nodesToScore array
        //scoring: pop the array until empty, check for the node, in how many subarrays does it occur?/total num of subarrays -> score
        let allSPs: Array<Array<number>> = [];
        for (let parent of paths[a][b]) {
          if (parent != b) {
            allSPs.push([parent]);
            nodesToScore.push(parent);
          }
          //now there is at least one array in the allSPs
          //start a while or a do...while loop, with counter (init=0), at the end, ++. while count < allSps.length       
          //in case the parent path diverges, the array needs to be multiplicated
          //for each array of the appSPs: 
          //grab length-1. element of the first array - ALWAYS push each elements into the nodesToScore!!!
          //paths [a][this element], if length=1, push it into the array and continue
          //if length>1, push first element into this array
          //for each other elements, clone the array into allSps and push the element into the clone
          //continue this until [a][this element]=this element. This element should still be part of the array
          //do this with all arrays in the allSPs
          
          //finished: start popping nodes to score
          //score: occurrence of node in the arrays/total number of arrays

          //finished: normalize each scores, put values into separate normMap?

        }
      }
    }
  }
}





//code from Benedict, commented out for a while
/*function inBetweennessCentrality(graph: $G.IGraph, sparse?: boolean) {
  let paths;
  var sparse = sparse || false;

  if (sparse) {
    paths = $JO.Johnsons(graph)[1];
  }
  else {
    paths =  $FW.FloydWarshallAPSP(graph)[1];
  }
  

  let nodes = graph.adjListArray();
  let map = {};
  for (let keyA in nodes) {
    map[keyA] = 0;
  }
  let N = paths.length;
  for (var a = 0; a < N; ++a) {
    for (var b = 0; b < N; ++b) {

      if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
        addBetweeness(a, b, paths, map, a);
      }
    }
  }
  let dem = 0;
  for (let a in map) {
    dem += map[a];
  }
  for (let a in map) {
    map[a] /= dem;
  }
  return map;
}*/

/**
 * This is used to run through all shortest paths and
 * apply betweenness score to all nodes between start
 * and endnode
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values, m*m*m matrix of neighbors
 * @constructor
 */

//part of the former inBetweennessCentrality, commented out for a while
/*function addBetweeness(u, v, next, map, start) {
  if (u == v)
    return 1;     //Terminal nodes return 1
  let nodes = 0;  //count of terminal nodes (= number of path's to v)
  for (let e = 0; e < next[u][v].length; e++) {
    nodes += addBetweeness(next[u][v][e], v, next, map, start); //Add all child nodes reachable from this node
  }
  if (u != start) {
    map[u] += nodes;
  }
  return nodes;
}*/

export {
  betweennessCentrality
};
