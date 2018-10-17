"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const $N = require("../core/Nodes");
const $P = require("../search/PFS");
const $BF = require("../search/BellmanFord");
const $JO = require("../search/Johnsons");
const $BH = require("../datastructs/binaryHeap");
/**
 * @param graph input graph
 * @returns Dict of betweenness centrality values for each node
 * @constructor
 */
function BrandesUnweighted(graph, normalize = false, directed = false) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    let nodes = graph.getNodes();
    let adjList = graph.adjListDict();
    //Variables for Brandes algorithm
    let s, //source node
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
    let closedNodes = {};
    for (let n in nodes) {
        let node_id = nodes[n].getID();
        CB[node_id] = 0;
        dist[node_id] = Number.POSITIVE_INFINITY;
        sigma[node_id] = 0;
        delta[node_id] = 0;
        Pred[node_id] = [];
        closedNodes[node_id] = false;
    }
    for (let i in nodes) {
        s = nodes[i];
        //Initialization
        let id = s.getID();
        dist[id] = 0;
        sigma[id] = 1;
        Q.push(id);
        closedNodes[id] = true;
        let counter = 0;
        while (Q.length) { //Queue not empty
            v = Q.shift();
            S.push(v);
            let neighbors = adjList[v];
            closedNodes[v] = true;
            for (let w in neighbors) {
                if (closedNodes[w]) {
                    continue;
                }
                //Path discovery: w found for the first time?
                if (dist[w] === Number.POSITIVE_INFINITY) {
                    Q.push(w);
                    dist[w] = dist[v] + 1;
                }
                //Path counting: edge (v,w) on shortest path?
                if (dist[w] === dist[v] + 1) {
                    sigma[w] += sigma[v];
                    Pred[w].push(v);
                }
            }
        }
        //Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
            for (let parent of Pred[w]) {
                delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
            }
            if (w != s.getID()) {
                CB[w] += delta[w];
            }
            // This spares us from having to loop over all nodes again for initialization
            sigma[w] = 0;
            delta[w] = 0;
            dist[w] = Number.POSITIVE_INFINITY;
            Pred[w] = [];
            closedNodes[w] = false;
        }
    }
    if (normalize) {
        normalizeScores(CB, graph.nrNodes(), directed);
    }
    return CB;
}
exports.BrandesUnweighted = BrandesUnweighted;
function BrandesWeighted(graph, normalize, directed) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    if (graph.hasNegativeEdge()) {
        var extraNode = new $N.BaseNode("extraNode");
        graph = $JO.addExtraNandE(graph, extraNode);
        let BFresult = $BF.BellmanFordDict(graph, extraNode);
        if (BFresult.neg_cycle) {
            throw new Error("The graph contains a negative cycle, thus it can not be processed");
        }
        else {
            let newWeights = BFresult.distances;
            graph = $JO.reWeighGraph(graph, newWeights, extraNode);
            graph.deleteNode(extraNode);
        }
    }
    let nodes = graph.getNodes();
    let N = Object.keys(nodes).length;
    let adjList = graph.adjListDict();
    const evalPriority = (nb) => nb.best;
    const evalObjID = (nb) => nb.id;
    //Variables for Brandes algorithm
    let s, //source node, 
    v, //parent of w, at least one shortest path between s and w leads through v
    w, //neighbour of v, lies one edge further than v from s, type id nodeID, alias string (got from AdjListDict)
    Pred = {}, //list of Predecessors=parent nodes
    sigma = {}, //number of shortest paths from source s to each node as goal node
    delta = {}, //dependency of source node s on a node 
    dist = {}, //distances from source node s to each node
    S = [], //stack of nodeIDs - nodes waiting for their dependency values
    CB = {}, //Betweenness values for each node
    closedNodes = {}, Q = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID);
    for (let n in nodes) {
        let currID = nodes[n].getID();
        CB[currID] = 0;
        dist[currID] = Number.POSITIVE_INFINITY;
        sigma[currID] = 0;
        delta[currID] = 0;
        Pred[currID] = [];
        closedNodes[currID] = false;
    }
    for (let i in nodes) {
        s = nodes[i];
        let id_s = s.getID();
        dist[id_s] = 0;
        sigma[id_s] = 1;
        let source = { id: id_s, best: 0 };
        Q.insert(source);
        closedNodes[id_s] = true;
        while (Q.size() > 0) {
            v = Q.pop();
            let current_id = v.id;
            S.push(current_id);
            closedNodes[current_id] = true;
            let neighbors = adjList[current_id];
            for (let w in neighbors) {
                if (closedNodes[w]) {
                    continue;
                }
                let new_dist = dist[current_id] + neighbors[w];
                let nextNode = { id: w, best: dist[w] };
                if (dist[w] > new_dist) {
                    if (isFinite(dist[w])) { //this means the node has already been encountered
                        let x = Q.remove(nextNode);
                        nextNode.best = new_dist;
                        Q.insert(nextNode);
                    }
                    else {
                        nextNode.best = new_dist;
                        Q.insert(nextNode);
                    }
                    sigma[w] = 0;
                    dist[w] = new_dist;
                    Pred[w] = [];
                }
                if (dist[w] === new_dist) {
                    sigma[w] += sigma[current_id];
                    Pred[w].push(current_id);
                }
            }
        }
        // Accumulation: back-propagation of dependencies
        while (S.length >= 1) {
            w = S.pop();
            for (let parent of Pred[w]) {
                delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
            }
            if (w != s.getID()) {
                CB[w] += delta[w];
            }
            // reset
            sigma[w] = 0;
            delta[w] = 0;
            dist[w] = Number.POSITIVE_INFINITY;
            Pred[w] = [];
            closedNodes[w] = false;
        }
    }
    if (normalize) {
        normalizeScores(CB, N, directed);
    }
    return CB;
}
exports.BrandesWeighted = BrandesWeighted;
/**
 *
 * @param graph
 * @param normalize
 * @param directed
 *
 * @todo decide to remove or not
 */
function BrandesPFSbased(graph, normalize, directed) {
    let nodes = graph.getNodes();
    let adjList = graph.adjListDict();
    //Variables for Brandes algorithm
    let Pred = {}, //list of Predecessors=parent nodes
    sigma = {}, //number of shortest paths from source s to each node as goal node
    delta = {}, //dependency of source node s on a node 
    S = [], //stack of nodeIDs - nodes waiting for their dependency values
    CB = {}; //Betweenness values for each node
    for (let n in nodes) {
        let currID = nodes[n].getID();
        CB[currID] = 0;
        sigma[currID] = 0;
        delta[currID] = 0;
        Pred[currID] = [];
    }
    let specialConfig = $P.preparePFSStandardConfig();
    var notEncounteredBrandes = function (context) {
        context.next.best =
            context.current.best + (isNaN(context.next.edge.getWeight()) ? $P.DEFAULT_WEIGHT : context.next.edge.getWeight());
        //these needed for betweenness
        let next_id = context.next.node.getID();
        let current_id = context.current.node.getID();
        Pred[next_id] = [current_id];
        sigma[next_id] += sigma[current_id];
    };
    specialConfig.callbacks.not_encountered.splice(0, 1, notEncounteredBrandes);
    var newCurrentBrandes = function (context) {
        S.push(context.current.node.getID());
    };
    specialConfig.callbacks.new_current.push(newCurrentBrandes);
    var betterPathBrandes = function (context) {
        let next_id = context.next.node.getID();
        let current_id = context.current.node.getID();
        sigma[next_id] = 0;
        sigma[next_id] += sigma[current_id];
        Pred[next_id] = [];
        Pred[next_id].push(current_id);
    };
    specialConfig.callbacks.better_path.splice(0, 1, betterPathBrandes);
    /**
     * @param context
     *
     * @todo figure out a faster way than .indexOf()
     */
    var equalPathBrandes = function (context) {
        let next_id = context.next.node.getID();
        let current_id = context.current.node.getID();
        sigma[next_id] += sigma[current_id];
        //other approach needed to avoid duplicates
        if (Pred[next_id].indexOf(current_id) === -1) {
            Pred[next_id].push(current_id);
        }
    };
    specialConfig.callbacks.equal_path.push(equalPathBrandes);
    for (let i in nodes) {
        let s = nodes[i];
        sigma[s.getID()] = 1;
        $P.PFS(graph, s, specialConfig);
        //step: do the scoring, using S, Pred and sigma
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
    if (normalize) {
        normalizeScores(CB, graph.nrNodes(), directed);
    }
    return CB;
}
exports.BrandesPFSbased = BrandesPFSbased;
function normalizeScores(CB, N, directed) {
    let factor = directed ? ((N - 1) * (N - 2)) : ((N - 1) * (N - 2) / 2);
    for (let node in CB) {
        CB[node] /= factor;
    }
}
exports.normalizeScores = normalizeScores;
