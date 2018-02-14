/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $FW from '../search/FloydWarshall';
import * as $JO from '../search/Johnsons';
import * as $PFS from '../search/PFS';
import * as $N from '../core/Nodes';
import { ifError } from 'assert';

/**
 * This is used to get the betweenness of a graph by either
 * Bellman Ford (Johnsons) or Floyd Warshall with APSP.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values (dist), m*m*m matrix of neighbors (next)
 * @constructor
 */


function betweennessCentrality1(graph: $G.IGraph, directed: boolean, sparse?: boolean): {} {
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
    //initializing the map which will be returned at the end - should it contain the keys (numbers), or the node IDs?
    map[keyA] = 0;
  }

  let N = paths.length;
  for (var a = 0; a < N; ++a) {
    for (var b = 0; b < N; ++b) {
      //if self, or b is directly reachable from a and it is the only shortest path, no betweenness score is handed out
      if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
        let nodesToScore = [];
        let allSPs: Array<Array<number>> = [];
        //strategy: build all shortest paths, as a 2d array
        //push each node on the way into the nodesToScore array
        //scoring: pop the array until empty, check for the node, in how many subarrays does it occur?/total num of subarrays -> score

        //initializing the allSPs and nodesToScore arrays
        for (let parent of paths[a][b]) {
          if (parent != b) {
            allSPs.push([parent]);
            nodesToScore.push(parent);
          }
          let counter = 0;

          do {
            while (true) {
              //lastNode is the last element of the working array
              let lastNode = allSPs[counter][(allSPs[counter].length - 1)];
              let previous = paths[a][lastNode];
              //1 or more elements in previous
              if (previous.length == 1 && previous[0] == lastNode) {
                break;
              }
              else if (previous.length == 1) {
                allSPs[counter].push(previous[0]);
                nodesToScore.push(previous[0]);
              }
              else if (previous.indexOf(lastNode) != -1) {
                for (let prev of previous) {
                  let newArray = false;
                  //first it needs to continue the working array
                  if (prev != lastNode && newArray == false) {
                    allSPs[counter].push(prev);
                    nodesToScore.push(prev);
                    newArray = true;
                  }
                  else if (prev != lastNode && newArray) {
                    let newArray = [];
                    //copy the working array
                    newArray = allSPs[counter].slice(0);
                    newArray.push(prev);
                    allSPs.push(newArray);
                    nodesToScore.push(prev);
                  }
                }
                break;
              }
              else {
                for (let prev of previous) {
                  let newArray = false;
                  //first it needs to continue the working array
                  if (prev != lastNode && newArray == false) {
                    allSPs[counter].push(prev);
                    nodesToScore.push(prev);
                    newArray = true;
                  }
                  else if (prev != lastNode && newArray) {
                    let newArray = [];
                    //copy the working array and push prev into the copy
                    newArray = allSPs[counter].slice(0);
                    newArray.push(prev);
                    allSPs.push(newArray);
                    nodesToScore.push(prev);
                  }
                }
                counter++;
              }
            }
          } while (counter < allSPs.length)

          //and now the scoring
          let node = nodesToScore.pop();
          let score = 0;
          allSPs.forEach(subArray => {
            if (subArray.indexOf(node) != -1) {
              score += 1;
            }
          });

          score /= allSPs.length;
          map[node] += score;
          //normalization is missing yet

        }
      }
    }
  }
  return map;
}

function betweennessCentrality2(graph: $G.IGraph, directed: boolean, sparse?: boolean): {} {
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
  for (let key in nodes) {
    //initializing the map which will be returned at the end - should it contain the keys (numbers), or the node IDs?
    map[key] = 0;
  }

  let N = paths.length;
  for (var a = 0; a < N; ++a) {
    for (var b = 0; b < N; ++b) {
      //if self, or b is directly reachable from a and it is the only shortest path, no betweenness score is handed out
      if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
        //first follow back the paths and fill up the nodesToScore array - nodes a and b are allowed  will be ruled out later
        //for each node, follow back all paths, score when the node is on the path
        //if a fork is found, put them in the arrays downstream or upstream

        let nodesToScore = [];
        //first exploratory followback to fill up the nodesToScore array - nodes a and b are allowed, will be ruled out later
        let forks = [b];
        while (forks.length > 0) {
          let end = forks.pop();
          while (end != a) {
            let prev = paths[a][end];
            for (let p = 0; p < prev.length; p++) {
              nodesToScore.push(prev[p]);
              if (p == 0) {
                end = prev[0];
              }
              else {
                forks.push(prev[p]);
              }
            }
          }
        }
        for (let node of nodesToScore) {
          if (node == a || node == b) {
            continue;
          }
          let upStreamForks = [b];
          let downStreamForks = [];
          let nrOfPaths = 0;
          let numNodeFound = 0;
          while (upStreamForks.length > 0 || downStreamForks.length > 0) {
            let nodeFound = false;
            nrOfPaths += 1;
            let tracer;
            if (upStreamForks.length > 0) {
              tracer = upStreamForks.pop();
              if (tracer == node) {
                numNodeFound++;
                nodeFound = true;
              }
            }
            else {
              numNodeFound += 1;
              nodeFound = true;
              tracer = downStreamForks.pop();
            }
            while (tracer != a) {
              let prev = paths[a][tracer];
              for (let p = 0; p < prev.length; p++) {
                if (p == 0) {
                  tracer = prev[0];
                  if (tracer == node) {
                    numNodeFound++;
                    nodeFound = true;
                  }
                }
                else {
                  if (nodeFound) {
                    downStreamForks.push(prev[p]);
                  }
                  else {
                    upStreamForks.push(prev[p])
                  }
                }
              }
              let score = numNodeFound / nrOfPaths;
              map[node] += score;
            }
          }
        }
      }
    }
  }
  return map;
}



//old code from Benedict, commented out for a while
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
  betweennessCentrality1, betweennessCentrality2
};
