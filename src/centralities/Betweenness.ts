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

//new idea included, now in debugging
function betweennessCentrality2(graph: $G.IGraph, directed: boolean, sparse?: boolean): {} {
  let paths;
  var sparse = sparse || false;
  //the argument directed is not yet used, it will be important later when we normalize

  if (sparse) {
    paths = $JO.Johnsons(graph)[1];
  }
  else {
    paths = $FW.changeNextToDirectParents($FW.FloydWarshallAPSP(graph)[1]);
  }

  let nodes = graph.getNodes();
  //getting the nodeKeys
  let nodeKeys = Object.keys(nodes);
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

        let tempMap = {};
        let leadArray: Array<Array<number>> = [];
        let pathCount = 0;

        do {
          let tracer = b;
          let leadCounter = 0;
          pathCount++;

          while (true) {
            let previous: Array<number> = paths[a][tracer];
            let terminate = false;
            //no branching: 
            if (previous.length == 1 && previous[0] == tracer) {
              break;
            }
            else if (previous.length == 1) {
              tracer = previous[0];
              //scoring on the fly
              tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
            }
            //if there is a branching:
            //handle reaching the terminal node here too!          
            else {
              //case: leadArray is empty and we find a branch
              if (leadArray.length == 0) {
                if (previous[0] == tracer) {
                  terminate = true;
                }
                else {
                  tracer = previous[0];
                  tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                }
                //leave a trace in the leadArray
                leadArray.push([0, previous.length]);
              }
              //case: branch is covered by the leadArray
              else if (leadCounter < leadArray.length) {
                let choice = leadArray[leadCounter][0];
                if (previous[choice] == tracer) {
                  terminate = true;
                }
                else {
                  tracer = previous[choice];
                  tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                }
                leadCounter++;
              }

              //case: branch is beyond the leadArray (new branching encountered)
              else {
                if (previous[0] == tracer) {
                  terminate = true;
                }
                else {
                  tracer = previous[0];
                  tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                }
                //leave a trace in the leadArray
                leadArray.push([0, previous.length]);
              }
            }
            if (terminate) {
              break;
            }
          }
          // here I need to update the leadArray, if not empty
          //reminder: each subarray in leadArray: [current branchpoint, length]
          if (leadArray.length > 0) {
            leadArray[leadArray.length - 1][0]++;
            while (leadArray[leadArray.length - 1][0] == leadArray[leadArray.length - 1][1]) {
              //then remove last item from leadArray
              leadArray.splice(leadArray.length - 1, 1);
              if (leadArray.length == 0) {
                break;
              }
              leadArray[leadArray.length - 1][0]++;
            }
          }
        } while (leadArray.length != 0)

        /*console.log("pathcount is: " + pathCount);
        for (let key in tempMap) {
          console.log("tempMap content: " + tempMap[key]);
        }*/

        //now put the correct scores into the final map
        //be careful, the return map uses letters as nodekeys! - one must transform, otherwise one gets rubbish
        for (let key in tempMap) {
          let mapKey = nodeKeys[key];
          map[mapKey] += tempMap[key] / pathCount;
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
  betweennessCentrality2
};
