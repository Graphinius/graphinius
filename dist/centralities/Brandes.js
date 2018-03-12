"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param graph input graph
 * @returns Dict of betweenness centrality values for each node
 * @constructor
 */
//Brandes, written based on Brandes 2001, works good on UNWEIGHTED graphs
//for WEIGHTED graphs, see function BrandesForWeighted below!
function Brandes(graph) {
    //Information taken from graph
    var nodes = graph.getNodes();
    //Variables for Brandes algorithm
    var s, //source node
    v, //parent of w, at least one shortest path between s and w leads through v
    w, //neighbour of v, lies one edge further than v from s
    Pred = {}, //list of Predecessors=parent nodes
    sigma = {}, //number of shortest paths from source s to each node as goal node
    delta = {}, //dependency of source node s on a node 
    dist = {}, //distances from source node s to each node
    Q = [], //Queue of nodes - nodes to visit
    S = [], //stack of nodes - nodes waiting for their dependency values
    CB = {}; //Betweenness values for each node
    //info: push element to array - last position
    //array.shift: returns and removes the first element - when used, array behaves as queue
    //array.pop: returns and removes last element - when used, array behaves as stack
    for (var n in nodes) {
        CB[nodes[n].getID()] = 0;
        dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
        sigma[nodes[n].getID()] = 0;
        delta[nodes[n].getID()] = 0;
        Pred[nodes[n].getID()] = [];
    }
    for (var i in nodes) {
        s = nodes[i];
        //Initialization
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q.push(s);
        while (Q.length >= 1) {
            v = Q.shift();
            S.push(v);
            var neighbors = v.reachNodes();
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var ne = neighbors_1[_i];
                w = ne.node;
                //Path discovery: w found for the first time?
                if (dist[w.getID()] == Number.POSITIVE_INFINITY) {
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                }
                //Path counting: edge (v,w) on shortest path?
                if (dist[w.getID()] == dist[v.getID()] + 1) {
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v.getID());
                }
            }
        }
        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
            for (var _a = 0, _b = Pred[w.getID()]; _a < _b.length; _a++) {
                var parent_1 = _b[_a];
                delta[parent_1] += (sigma[parent_1] / sigma[w.getID()] * (1 + delta[w.getID()]));
            }
            if (w.getID() != s.getID()) {
                CB[w.getID()] += delta[w.getID()];
            }
            //This spares us from having to loop over all nodes again for initialization
            sigma[w.getID()] = 0;
            delta[w.getID()] = 0;
            dist[w.getID()] = Number.POSITIVE_INFINITY;
            Pred[w.getID()] = [];
        }
    }
    return CB;
}
exports.Brandes = Brandes;
//works on all graphs, weighted/unweighted, directed/undirected, with/without null weight edge!
function BrandesForWeighted(graph) {
    var nodes = graph.getNodes();
    var adjList = graph.adjListDict();
    //Variables for Brandes algorithm
    var s, //source node, 
    v, //parent of w, at least one shortest path between s and w leads through v
    w, //neighbour of v, lies one edge further than v from s
    Pred = {}, //list of Predecessors=parent nodes
    sigma = {}, //number of shortest paths from source s to each node as goal node
    delta = {}, //dependency of source node s on a node 
    dist = {}, //distances from source node s to each node
    Q = {}, //Nodes to visit - this time, a Priority queue, so it is a dict
    S = [], //stack of nodeIDs - nodes waiting for their dependency values
    CB = {}, //Betweenness values for each node
    tempJunk = {}; // will be used to store key-key-value pairs temporarily
    for (var n in nodes) {
        CB[nodes[n].getID()] = 0;
        dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
        sigma[nodes[n].getID()] = 0;
        delta[nodes[n].getID()] = 0;
        Pred[nodes[n].getID()] = [];
    }
    for (var i in nodes) {
        s = nodes[i];
        //Initialization
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q[s.getID()] = 0;
        //graph traversal for actual source node
        while (Object.keys(Q).length >= 1) {
            var values = Object.values(Q); //this seems to give an error, however it works fine!
            var min = Math.min.apply(Math, values);
            for (var key in Q) {
                if (Q[key] == min) {
                    v = key;
                    delete Q[key];
                    break;
                }
            }
            S.push(v);
            var neighbors = adjList[v]; //this is a dict itself, with node ID and dist values
            //explore neighbourhood for actual node
            for (var w_1 in neighbors) {
                //cleaning up the v node from the neighbors of w to avoid returns
                //but before, key-value needs to be stored temporarily, and later added back to the adjList
                if (tempJunk[w_1] == undefined) {
                    tempJunk[w_1] = {};
                }
                tempJunk[w_1][v] = adjList[w_1][v];
                delete adjList[w_1][v];
                //reminder: edge weight of e(v,w) is neighbors[w]
                //Path discovery: w found for the first time, or shorter path found?
                if (dist[w_1] > dist[v] + neighbors[w_1]) {
                    Q[w_1] = dist[v] + neighbors[w_1];
                    sigma[w_1] = 0;
                    dist[w_1] = dist[v] + neighbors[w_1];
                    Pred[w_1] = [];
                }
                //Path counting: edge (v,w) on shortest path?
                if (dist[w_1] == dist[v] + neighbors[w_1]) {
                    sigma[w_1] += sigma[v];
                    Pred[w_1].push(v);
                }
            }
        }
        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
            for (var _i = 0, _a = Pred[w]; _i < _a.length; _i++) {
                var parent_2 = _a[_i];
                delta[parent_2] += (sigma[parent_2] / sigma[w] * (1 + delta[w]));
            }
            if (w != s.getID()) {
                CB[w] += delta[w];
            }
            //This spares us from having to loop over all nodes again for initialization
            sigma[w] = 0;
            delta[w] = 0;
            dist[w] = Number.POSITIVE_INFINITY;
            Pred[w] = [];
        }
        //restoring the adjList using the tempJunk:
        for (var outKey in tempJunk) {
            for (var inKey in tempJunk[outKey]) {
                adjList[outKey][inKey] = tempJunk[outKey][inKey];
            }
        }
    }
    return CB;
}
exports.BrandesForWeighted = BrandesForWeighted;
//an alternative for our PFS, returns the same output arrays as the Johnsons
function PFSdictBased(graph) {
    var nodes = graph.getNodes();
    var N = Object.keys(nodes).length;
    var adjList = graph.adjListDict();
    //Initialize stuff needed for the outputs
    //reminder: this is a 2d array,
    //value of a given [i][j]: 0 if self, value if j is directly reachable from i, positive infinity in all other cases
    var dists = [];
    //reminder: this is a 3d array
    //value in given [i][j] subbarray: node itself if self, goal node if goal node is directly reachable from source node, 
    //null in all other cases
    var next = [];
    //create a dict of graph nodes, format: {[nodeID:string]:number}
    //so the original order of nodes will not be messed up by PFS
    var nodeIDMap = {};
    var i = 0;
    for (var key in nodes) {
        nodeIDMap[nodes[key].getID()] = i++;
    }
    //Variables for Brandes algorithm
    var s, //source node, 
    v, //parent of w, at least one shortest path between s and w leads through v
    w, //neighbour of v, lies one edge further than v from s
    Pred = {}, //list of Predecessors=parent nodes
    dist = {}, //distances from source node s to each node
    Q = {}, //Nodes to visit - this time, a Priority queue, so it is a dict
    tempJunk = {}; // will be used to store key-value pairs temporarily
    for (var n in nodes) {
        dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
        Pred[nodes[n].getID()] = [];
    }
    //graph traversal for each source nodes
    for (var i_1 in nodes) {
        s = nodes[i_1];
        tempJunk = {}; // will be used later to store key-value pairs temporarily
        for (var n in nodes) {
            dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
            Pred[nodes[n].getID()] = [];
        }
        //Initialization for source node
        dist[s.getID()] = 0;
        Pred[s.getID()].push(nodeIDMap[s.getID()]);
        Q[s.getID()] = 0;
        //graph traversal for actual source node
        while (Object.keys(Q).length >= 1) {
            var values = Object.values(Q); //this seems to give an error, however it works fine!
            var min = Math.min.apply(Math, values);
            for (var key in Q) {
                if (Q[key] == min) {
                    v = key;
                    delete Q[key];
                    break;
                }
            }
            var neighbors = adjList[v]; //this is a dict itself, with node ID and dist values
            //explore neigbourhood for actual node
            for (var w_2 in neighbors) {
                //cleaning up the v node from the neighbors of w to avoid returns
                //but before, key-value needs to be stored temporarily, to restore the adjList before the next source node
                if (tempJunk[w_2] == undefined) {
                    tempJunk[w_2] = {};
                }
                tempJunk[w_2][v] = adjList[w_2][v];
                delete adjList[w_2][v];
                //reminder: edge weight of e(v,w) is neighbors[w]
                //Path discovery: w found for the first time, or shorter path found?
                if (dist[w_2] > dist[v] + neighbors[w_2]) {
                    Q[w_2] = dist[v] + neighbors[w_2];
                    dist[w_2] = dist[v] + neighbors[w_2];
                    Pred[w_2] = [];
                }
                //Path counting: edge (v,w) on shortest path?
                if (dist[w_2] == dist[v] + neighbors[w_2]) {
                    if (v == s.getID()) {
                        Pred[w_2].push(nodeIDMap[w_2]);
                    }
                    else {
                        Pred[w_2].push(nodeIDMap[v]);
                    }
                }
            }
        }
        //restoring the adjList using the tempJunk:
        for (var outKey in tempJunk) {
            for (var inKey in tempJunk[outKey]) {
                adjList[outKey][inKey] = tempJunk[outKey][inKey];
            }
        }
        //here I need to copy the dist and Pred to the final arrays
        var distsSubArr = [];
        var nextSubArr = [];
        for (var i_2 = 0; i_2 < N; i_2++) {
            distsSubArr.push(0);
            nextSubArr.push([]);
        }
        for (var key in dist) {
            var pos = nodeIDMap[key];
            distsSubArr[pos] = dist[key];
        }
        for (var key in Pred) {
            var pos = nodeIDMap[key];
            nextSubArr[pos] = Pred[key];
        }
        dists.push(distsSubArr);
        next.push(nextSubArr);
    }
    return [dists, next];
}
exports.PFSdictBased = PFSdictBased;
//stuff to explore how to create a priority queue
// var map: { [key: string]: number } = {};
// map["v"] = 2;
// map["w"] = 2;
// map["z"] = 10;
// map["x"] = 5;
// map["y"] = 7;
// console.log(map);
// var values = Object.values(map);
// var min = Math.min(...values);
// console.log("min= " + min);
// var keys = Object.keys(map);
// var myKey;
// for (let key of keys) {
//     if (map[key] == min) {
//         myKey = key;
//         delete map[key];
//         break;
//     }
// }
// console.log("myKey= " + myKey);
// console.log(map);
//copy of old version (Benedict), for safety
// /**
//  * Brandes algorithm to calculate betweenness on an undirected unweighted graph.
//  * Other than in original Brandes algorithm we normalize the values after
//  * calculation. We also count each shortest path between (s,v) as 1 regular path,
//  * so if there is more than one path between (s,v) we do not divide the betweenness
//  * values for the nodes in between by the amount of paths.
//  *
//  * @param graph the graph to perform Floyd-Warshall on
//  * @returns m*m matrix of Betweenness value
//  * @constructor
//  */
// //this import was just to test "collections"
// //import * as Collections from 'typescript-collections';
// function Brandes(graph: $G.IGraph): {} {
//     //Information taken from graph
//     let adj_array = graph.adjListArray(),
//         nodes = graph.getNodes();
//     //  this was a test here if typescript-collections work properly
//     // test file of the library: 
//     // https://github.com/basarat/typescript-collections/blob/release/src/test/priorityQueueTest.ts
// //     var queue = new Collections.PriorityQueue();
// //  queue.enqueue(8);
// //  queue.enqueue(10);
// //  queue.enqueue(2);
// //  var lowest = queue.dequeue(); 
// //  console.log("priorityQue test: "+JSON.stringify(lowest));
//     //Variables for Brandes algorithm
//     let s,     //current node of outer loop
//         v: $N.IBaseNode,     //current node of inner loop
//         w: $N.IBaseNode,     //neighbour of v
//         Pred: { [key: string]: string[] } = {},     //list of Predecessors
//         sigma: { [key: string]: number } = {}, //number of shortest paths from source to v
//         delta: { [key: string]: number } = {}, //dependency of source on v
//         dist: { [key: string]: number } = {},  //distances
//         Q: $N.IBaseNode[] = [],     //Queue of nodes
//         S: $N.IBaseNode[] = [],     //stack of nodes
//         CB: { [key: string]: number } = {};    //Betweenness values
//     for (let n in nodes) {
//         CB[nodes[n].getID()] = 0;
//         dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
//         sigma[nodes[n].getID()] = 0;
//         delta[nodes[n].getID()] = 0;
//     }
//     let sum = 0;    //The sum of betweennesses
//     //let N = graph.nrNodes();
//     for (let i in nodes) {
//         s = nodes[i];
//         //Initialization
//         dist[s.getID()] = 0;
//         sigma[s.getID()] = 1;
//         Q.push(s);
//         while (Q.length >= 1) { //Queue not empty
//             v = Q.shift();
//             S.push(v);
//             let neighbors = v.reachNodes();
//             for (let ne in neighbors) {
//                 w = neighbors[ne].node;
//                 //Path discovery: w found for the first time?
//                 if (dist[w.getID()] == Number.POSITIVE_INFINITY) {
//                     Q.push(w);
//                     dist[w.getID()] = dist[v.getID()] + 1;
//                     Pred[w.getID()] = [];
//                 }
//                 //Path counting: edge (v,w) on shortest path?
//                 if (dist[w.getID()] == dist[v.getID()] + 1) {
//                     sigma[w.getID()] += sigma[v.getID()];
//                     Pred[w.getID()].push(v.getID());
//                 }
//             }
//         }
//         //Accumulation: back-propagation of dependencies
//         while (S.length >= 1) {
//             w = S.pop();
//             for (let key in Pred[w.getID()]) {
//                 let lvKey = Pred[w.getID()][key];
//                 delta[lvKey] = delta[lvKey] + (sigma[lvKey] * (1 + delta[w.getID()]));
//                 //Note: other than in original Brandes algorithm we do not divide
//                 //sigma[v] by sigma[w] because we count all path's equally
//             }
//             if (w.getID() != s.getID()) {
//                 CB[w.getID()] += delta[w.getID()];
//                 sum += delta[w.getID()];
//             }
//             //This spares us from having to loop over all nodes again for initialization
//             sigma[w.getID()] = 0;
//             delta[w.getID()] = 0;
//             dist[w.getID()] = Number.POSITIVE_INFINITY;
//         }
//     }
//     //Normalize the values
//     /*for (let n in nodes) {
//         CB[nodes[n].getID()] /= sum;
//     }*/
//     return CB;
// } 
