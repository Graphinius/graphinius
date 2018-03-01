/**
 * Previous version created by ru on 14.09.17 is to be found below. 
 * Modifications by Rita on 28.02.2018 - now it can handle branchings too. 
 * Functions contained: 
 * Brandes: according to Brandes 2001, it is meant for unweighted undirected graphs
 *  - I think it can be directed too, but definitely unweighted. 
 * BrandesForWeighted: according to Brandes 2007, handles weighted graphs
 */

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';

/**
 * @param graph input graph
 * @returns Dict of betweenness centrality values for each node
 * @constructor
 */

//Brandes, written based on Brandes 2001, works good on UNWEIGHTED graphs
function Brandes(graph: $G.IGraph): {} {
    //Information taken from graph
    let nodes = graph.getNodes();

    //Variables for Brandes algorithm
    let s,     //source node
        v: $N.IBaseNode,     //parent of w, at least one shortest path between s and w leads through v
        w: $N.IBaseNode,     //neighbour of v, lies one edge further than v from s
        Pred: { [key: string]: string[] } = {},     //list of Predecessors=parent nodes
        sigma: { [key: string]: number } = {}, //number of shortest paths from source s to each node as goal node
        delta: { [key: string]: number } = {}, //dependency of source node s on a node 
        dist: { [key: string]: number } = {},  //distances from source node s to each node
        Q: $N.IBaseNode[] = [],     //Queue of nodes - nodes to visit
        S: $N.IBaseNode[] = [],     //stack of nodes - nodes waiting for their dependency values
        CB: { [key: string]: number } = {};    //Betweenness values for each node
    //info: push element to array - last position
    //array.shift: returns and removes the first element - when used, array behaves as queue
    //array.pop: returns and removes last element - when used, array behaves as stack

    for (let n in nodes) {
        CB[nodes[n].getID()] = 0;
        dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
        sigma[nodes[n].getID()] = 0;
        delta[nodes[n].getID()] = 0;
        Pred[nodes[n].getID()] = [];
    }

    for (let i in nodes) {
        s = nodes[i];

        //Initialization
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q.push(s);

        while (Q.length >= 1) { //Queue not empty
            v = Q.shift();
            S.push(v);
            let neighbors = v.reachNodes();

            for (let ne of neighbors) {
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
            for (let parent of Pred[w.getID()]) {
                delta[parent] += (sigma[parent] / sigma[w.getID()] * (1 + delta[w.getID()]));
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


function BrandesForWeighted(graph: $G.IGraph): {} {

    //Information taken from graph
    let nodes = graph.getNodes(),
        adjList = graph.adjListDict();

    //Variables for Brandes algorithm
    let s,     //source node, 
        v: string,    //parent of w, at least one shortest path between s and w leads through v
        w: string,     //neighbour of v, lies one edge further than v from s
        Pred: { [key: string]: string[] } = {},     //list of Predecessors=parent nodes
        sigma: { [key: string]: number } = {}, //number of shortest paths from source s to each node as goal node
        delta: { [key: string]: number } = {}, //dependency of source node s on a node 
        dist: { [key: string]: number } = {},  //distances from source node s to each node
        Q: { [key: string]: number } = {},     //Nodes to visit - this time, a Priority queue, so it is a dict
        S: string[] = [],     //stack of nodeIDs - nodes waiting for their dependency values
        CB: { [key: string]: number } = {};    //Betweenness values for each node

    for (let n in nodes) {
        CB[nodes[n].getID()] = 0;
        dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
        sigma[nodes[n].getID()] = 0;
        delta[nodes[n].getID()] = 0;
        Pred[nodes[n].getID()] = [];
    }

    for (let i in nodes) {
        s = nodes[i];
        //console.log("actual source node: " + s.getID());

        //Initialization
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q[s.getID()] = 0;

        while (Object.keys(Q).length >= 1) { //until Priority queue not empty
            var values = Object.values(Q);
            var min = Math.min(...values);
            for (let key in Q) {
                if (Q[key] == min) {
                    v = key;
                    delete Q[key];
                    break;
                }
            }

            S.push(v);
            let neighbors = adjList[v]; //this is a dict itself, with node ID and dist values

            for (let w in neighbors) {
                //cleaning up the v node from the neighbors of w - bad! Somehow makes everything worse.
                //delete adjList[w][v];

                //reminder: edge weight of e(v,w) is neighbors[w]
                //Path discovery: w found for the first time, or shorter path found?
                if (dist[w] > dist[v] + neighbors[w]) {
                    Q[w] = dist[v] + neighbors[w];
                    dist[w] = dist[v] + neighbors[w];
                    Pred[w] = [];
                }

                //Path counting: edge (v,w) on shortest path?
                if (dist[w] == dist[v] + neighbors[w]) {
                    sigma[w] += sigma[v];
                    Pred[w].push(v);

                    //will the path be continued? if not, no increase in sigma!
                    // if (adjList[w].length>0) {
                    //     sigma[w] += sigma[v];
                    // }

                }
            }
        }
        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
            //console.log("parents of node " + w + " : " + Pred[w]);
            for (let parent of Pred[w]) {
                delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
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
    }

    return CB;
}
export { Brandes, BrandesForWeighted }

//stuff to create a priority queue
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