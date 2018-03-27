/// <reference path="../../typings/tsd.d.ts" />

/**
 * Previous version created by ru on 14.09.17 is to be found below. 
 * Modifications by Rita on 28.02.2018 - now it can handle branchings too. 
 * CONTENTS: 
 * Brandes: according to Brandes 2001, it is meant for unweighted graphs (+undirected according to the paper, but runs fine on directed ones, too)
 * BrandesForWeighted: according to Brandes 2007, handles WEIGHTED graphs, including graphs with null edges
 * PFSdictBased: an alternative for our PFS, not heap based but dictionary based, however, not faster (see BetweennessTests)
 */

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $P from '../search/PFS';
import * as $BF from '../search/BellmanFord';
import * as $JO from '../search/Johnsons';
import * as $SU from '../utils/structUtils';
import * as $BH from '../datastructs/binaryHeap';


/**
 * @param graph input graph
 * @returns Dict of betweenness centrality values for each node
 * @constructor
 */

//Brandes, written based on Brandes 2001, works good on UNWEIGHTED graphs
//for WEIGHTED graphs, see function BrandesForWeighted below!
function Brandes(graph: $G.IGraph, normalize: boolean, directed: boolean): {} {

    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }

    let nodes = graph.getNodes();
    let N = Object.keys(nodes).length;

    //Variables for Brandes algorithm
    let s: $N.IBaseNode,     //source node
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
        let node_id = nodes[n].getID();
        CB[node_id] = 0;
        dist[node_id] = Number.POSITIVE_INFINITY;
        sigma[node_id] = 0;
        delta[node_id] = 0;
        Pred[node_id] = [];
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

            // This spares us from having to loop over all nodes again for initialization
            sigma[w.getID()] = 0;
            delta[w.getID()] = 0;
            dist[w.getID()] = Number.POSITIVE_INFINITY;
            Pred[w.getID()] = [];
        }
    }

    //normalize, if requested 
    if (normalize) {
        let factor = directed ? ((N - 1) * (N - 2)) : ((N - 1) * (N - 2) / 2);

        for (let node in CB) {
            CB[node] /= factor;
        }
    }

    return CB;
}

//COPY USING MIN; NO HEAPS - FOR TESTING ONLY; WILL NOT STAY!
//works on all graphs, weighted/unweighted, directed/undirected, with/without null weight edge!
function BrandesForWeighted2(graph: $G.IGraph, normalize: boolean, directed?: boolean): {} {

    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }

    if (graph.hasNegativeEdge()) {
        var extraNode: $N.IBaseNode = new $N.BaseNode("extraNode");
        graph = $JO.addExtraNandE(graph, extraNode);
        let BFresult = $BF.BellmanFordDict(graph, extraNode);

        //reminder: output of the BellmanFordDict is BFDictResult
        //contains a dictionary called distances, format: {[nodeID]:dist}, and a boolean called neg_cycle
        if (BFresult.neg_cycle) {
            throw new Error("The graph contains a negative cycle, thus it can not be processed");
        }

        else {
            let newWeights: {} = BFresult.distances;

            graph = $JO.reWeighGraph(graph, newWeights, extraNode);
            //graph still has the extraNode
            //reminder: deleteNode function removes its edges, too
            graph.deleteNode(extraNode);
        }
    }

    let nodes = graph.getNodes();
    let N = Object.keys(nodes).length;
    let adjList = graph.adjListDict();

    //Variables for Brandes algorithm
    let s: $N.IBaseNode,     //source node, 
        v: string,    //parent of w, at least one shortest path between s and w leads through v
        w: string,     //neighbour of v, lies one edge further than v from s
        Pred: { [key: string]: string[] } = {},     //list of Predecessors=parent nodes
        sigma: { [key: string]: number } = {}, //number of shortest paths from source s to each node as goal node
        delta: { [key: string]: number } = {}, //dependency of source node s on a node 
        dist: { [key: string]: number } = {},  //distances from source node s to each node
        Q: { [key: string]: number } = {},     //Nodes to visit - this time, a Priority queue, so it is a dict
        S: string[] = [],     //stack of nodeIDs - nodes waiting for their dependency values
        CB: { [key: string]: number } = {};    //Betweenness values for each node

    //APPR 3!
    let closedNodes: { [key: string]: boolean } = {};

    //APPR 2!
    // let tempJunk: $G.MinAdjacencyListDict = {}; // will be used to store key-key-value pairs temporarily

    for (let n in nodes) {
        let currID = nodes[n].getID();
        CB[currID] = 0;
        dist[currID] = Number.POSITIVE_INFINITY;
        sigma[currID] = 0;
        delta[currID] = 0;
        Pred[currID] = [];

        //APPR 3!
        closedNodes[currID] = false;
    }

    for (let i in nodes) {
        s = nodes[i];

        //Initialization
        let id_s = s.getID();
        dist[id_s] = 0;
        sigma[id_s] = 1;
        Q[id_s] = 0;

        //APPR 3!
        closedNodes[id_s] = true;

        //graph traversal for actual source node
        while (Object.keys(Q).length > 0) { // unless Priority queue empty

            var values = Object.values(Q);
            var min = Math.min(...values);
            for (let key in Q) {
                if (Q[key] == min) {
                    v = key;
                    delete Q[key];
                    break;
                }
            }
            // console.log("graph traversal2:" + v);
            S.push(v);

            //APPR 3!
            closedNodes[v] = true;

            let neighbors = adjList[v];

            //IDEAS FOR NOT TURNING BACK AT ZERO EDGE: (time costs are given on the midsize graph, base value : 500-520 ms)
            // APPR1: check presence of node in S (all closed nodes are in S!) - time cost: 160-180 ms, 1 outcommented section
            //APPR2: use tempJunk, but only for zero edges! - time cost: 20-30 ms, 3 outcommented sections
            //APPR3: have a Dict, node id:boolean, set to true when node is closed. - time cost: 0-20 ms, 6 outcommented sections
            //time cost of tempJunk, when used constantly: 80-100 ms

            //explore neighbourhood for actual node     
            for (let w in neighbors) {

                //APPR 3!
                if (closedNodes[w])
                    continue;

                //APPR 1!
                // if (S.indexOf(w) !== -1)
                //     continue;

                //APPR 2!
                // if (neighbors[w] === 0) {
                //     if (tempJunk[w] == undefined) {
                //         tempJunk[w] = {};
                //     }
                //     tempJunk[w][v] = adjList[w][v];
                //     delete adjList[w][v];
                // }

                //reminder: edge weight of e(v,w) is neighbors[w]
                //Path discovery: w found for the first time, or shorter path found?
                let new_dist = dist[v] + neighbors[w];
                if (dist[w] > new_dist) {
                    Q[w] = new_dist;
                    sigma[w] = 0;
                    dist[w] = new_dist;
                    Pred[w] = [];
                }

                //Path counting: edge (v,w) on shortest path?
                if (dist[w] === new_dist) {
                    sigma[w] += sigma[v];
                    Pred[w].push(v);
                }
            }
        }
        // console.log();
        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
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

            //APPR 3!
            closedNodes[w] = false;
        }

        //APPR 2!
        //restoring the adjList using the tempJunk:
        // if (Object.keys(tempJunk).length > 0) {
        //     for (let outKey in tempJunk) {
        //         for (let inKey in tempJunk[outKey]) {
        //             adjList[outKey][inKey] = tempJunk[outKey][inKey];
        //         }
        //     }
        // }

    }

    //normalize, if requested 
    if (normalize) {
        let factor = directed ? ((N - 1) * (N - 2)) : ((N - 1) * (N - 2) / 2);

        for (let node in CB) {
            CB[node] /= factor;
        }
    }

    return CB;
}


export interface BrandesHeapEntry {
    id: string;
    best: number;
}
//copy of the version using heaps
//works on all graphs, weighted/unweighted, directed/undirected, with/without null weight edge!
function BrandesForWeighted(graph: $G.IGraph, normalize: boolean, directed: boolean): {} {

    let nodes = graph.getNodes();
    let adjList = graph.adjListDict();

    // eval Function for Neighbor distance
    const neighborEval = (nb: BrandesHeapEntry) => nb.best;

    //Variables for Brandes algorithm
    let s: $N.IBaseNode,     //source node, 
        v: BrandesHeapEntry,    //parent of w, at least one shortest path between s and w leads through v
        w: string,     //neighbour of v, lies one edge further than v from s, type id nodeID, alias string (got from AdjListDict)

        Pred: { [key: string]: string[] } = {},     //list of Predecessors=parent nodes
        sigma: { [key: string]: number } = {}, //number of shortest paths from source s to each node as goal node
        delta: { [key: string]: number } = {}, //dependency of source node s on a node 
        dist: { [key: string]: number } = {},  //distances from source node s to each node
        // Q: { [key: string]: number } = {},     //Nodes to visit - this time, a Priority queue, so it is a dict
        // Q: BinaryHeap = new BinaryHeap(BinaryHeapMode.MIN, neighborEval),
        S: string[] = [],     //stack of nodeIDs - nodes waiting for their dependency values
        CB: { [key: string]: number } = {},    //Betweenness values for each node
        tempJunk: $G.MinAdjacencyListDict = {}; // will be used to store key-key-value pairs temporarily

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
        let Q: $BH.BinaryHeap = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, neighborEval);
        let source: BrandesHeapEntry = { id: s.getID(), best: 0 };
        Q.insert(source);

        //graph traversal for actual source node
        while (Q.size() > 0) { // unless Priority queue empty

            v = Q.pop();

            // TODO: Make interface...
            let current_id = v.id;
            console.log("traversal-heap: " + current_id);

            S.push(current_id);

            let neighbors = adjList[current_id];



            //explore neighbourhood for actual node
            for (let w in neighbors) {
                //cleaning up the v node from the neighbors of w to avoid returns
                //but before, key-value needs to be stored temporarily, and later added back to the adjList
                if (tempJunk[w] == undefined) {
                    tempJunk[w] = {};
                }
                tempJunk[w][current_id] = adjList[w][current_id];
                delete adjList[w][current_id];

                //reminder: edge weight of e(v,w) is neighbors[w]
                //Path discovery: w found for the first time, or shorter path found?
                let new_dist = dist[current_id] + neighbors[w];
                let nextNode: BrandesHeapEntry = { id: w, best: dist[w] };
                if (dist[w] > new_dist) {
                    if (isFinite(dist[w])) { //this means the node has already been encountered
                        let x = Q.remove(nextNode);
                    }
                    nextNode.best = new_dist;
                    Q.insert(nextNode);
                    sigma[w] = 0;
                    dist[w] = new_dist;
                    Pred[w] = [];
                }

                //Path counting: edge (v,w) on shortest path?
                if (dist[w] === new_dist) {
                    sigma[w] += sigma[current_id];
                    Pred[w].push(current_id);
                }
            }
        }

        console.log();

        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
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

        //restoring the adjList using the tempJunk:
        for (let outKey in tempJunk) {
            for (let inKey in tempJunk[outKey]) {
                adjList[outKey][inKey] = tempJunk[outKey][inKey];
            }
        }
    }
    return CB;
}


//status: does not work yet, I need to figure out how to put nodes into the S stack
function BrandesPFSbased(graph: $G.IGraph, normalize: boolean, directed: boolean): {} {
    let nodes = graph.getNodes();
    let adjList = graph.adjListDict();

    //Variables for Brandes algorithm
    let Pred: { [key: string]: string[] } = {},     //list of Predecessors=parent nodes
        sigma: { [key: string]: number } = {}, //number of shortest paths from source s to each node as goal node
        delta: { [key: string]: number } = {}, //dependency of source node s on a node 
        S: string[] = [],     //stack of nodeIDs - nodes waiting for their dependency values
        CB: { [key: string]: number } = {};    //Betweenness values for each node

    for (let n in nodes) {
        let currID = nodes[n].getID();
        CB[currID] = 0;
        sigma[currID] = 0;
        delta[currID] = 0;
        Pred[currID] = [];
    }

    //creating the config for the PFS
    let specialConfig: $P.PFS_Config = $P.preparePFSStandardConfig();

    //and now modify whatever I need to
    //use splice if array is not empty, use simple push if empty
    var notEncounteredBrandes = function (context: $P.PFS_Scope) {
        //this needed to keep the PFS going
        context.next.best =
            context.current.best + (isNaN(context.next.edge.getWeight()) ? $P.DEFAULT_WEIGHT : context.next.edge.getWeight());
        //these needed for BC
        let next_id = context.next.node.getID();
        let current_id = context.current.node.getID();
        Pred[next_id] = [current_id];
        sigma[next_id] += sigma[current_id];

    };
    specialConfig.callbacks.not_encountered.splice(0, 1, notEncounteredBrandes);

    var newCurrentBrandes = function (context: $P.PFS_Scope) {
        S.push(context.current.node.getID());
    };
    specialConfig.callbacks.new_current.push(newCurrentBrandes);

    var betterPathBrandes = function (context: $P.PFS_Scope) {
        let next_id = context.next.node.getID();
        let current_id = context.current.node.getID();
        sigma[next_id] = 0;
        sigma[next_id] += sigma[current_id];
        Pred[next_id] = [];
        Pred[next_id].push(current_id);
    };

    specialConfig.callbacks.better_path.splice(0, 1, betterPathBrandes);

    var equalPathBrandes = function (context: $P.PFS_Scope) {
        let next_id = context.next.node.getID();
        let current_id = context.current.node.getID();

        sigma[next_id] += sigma[current_id];
        //mergeOrderedArrayNoDups does not work with the string[] of Pred! - works with number[] only!
        //other approach needed to avoid duplicates
        if (Pred[next_id].indexOf(current_id) === -1) {
            Pred[next_id].push(current_id);
        }
    }
    //this array is empty so it is fine to just push
    specialConfig.callbacks.equal_path.push(equalPathBrandes);

    //step: initialize dicts and call the PFS for each node
    for (let i in nodes) {
        let s = nodes[i];

        //Initialization
        sigma[s.getID()] = 1;
        S.push(s.getID());
        //rest of the nodes will be pushed to S by the callback new_current

        //now call the PFS
        $P.PFS(graph, s, specialConfig)

        //step: do the scoring, using S, Pred and sigma
        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            let w = S.pop();
            for (let parent of Pred[w]) {
                delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
            }
            if (w != s.getID()) {
                CB[w] += delta[w];
            }
            //This spares us from having to loop over all nodes again for initialization
            sigma[w] = 0;
            delta[w] = 0;
            Pred[w] = [];
        }
    }
    return CB;
}

export { Brandes, BrandesForWeighted, BrandesForWeighted2, BrandesPFSbased }


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