"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $N = require("../core/base/BaseNode");
const $P = require("../search/PFS");
const $BF = require("../search/BellmanFord");
const $JO = require("../search/Johnsons");
const $BH = require("../datastructs/BinaryHeap");
class Brandes {
    constructor(_graph) {
        this._graph = _graph;
    }
    computeUnweighted(normalize = false, directed = false) {
        if (this._graph.nrDirEdges() === 0 && this._graph.nrUndEdges() === 0) {
            throw new Error("Cowardly refusing to traverse graph without edges.");
        }
        let nodes = this._graph.getNodes();
        let adjList = this._graph.adjListDict();
        let s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, Q = [], S = [], CB = {};
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
            let id = s.getID();
            dist[id] = 0;
            sigma[id] = 1;
            Q.push(id);
            closedNodes[id] = true;
            let counter = 0;
            while (Q.length) {
                v = Q.shift();
                S.push(v);
                let neighbors = adjList[v];
                closedNodes[v] = true;
                for (let w in neighbors) {
                    if (closedNodes[w]) {
                        continue;
                    }
                    if (dist[w] === Number.POSITIVE_INFINITY) {
                        Q.push(w);
                        dist[w] = dist[v] + 1;
                    }
                    if (dist[w] === dist[v] + 1) {
                        sigma[w] += sigma[v];
                        Pred[w].push(v);
                    }
                }
            }
            while (S.length >= 1) {
                w = S.pop();
                for (let parent of Pred[w]) {
                    delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
                }
                if (w != s.getID()) {
                    CB[w] += delta[w];
                }
                sigma[w] = 0;
                delta[w] = 0;
                dist[w] = Number.POSITIVE_INFINITY;
                Pred[w] = [];
                closedNodes[w] = false;
            }
        }
        if (normalize) {
            this.normalizeScores(CB, this._graph.nrNodes(), directed);
        }
        return CB;
    }
    computeWeighted(normalize, directed) {
        if (this._graph.nrDirEdges() === 0 && this._graph.nrUndEdges() === 0) {
            throw new Error("Cowardly refusing to traverse graph without edges.");
        }
        if (this._graph.hasNegativeEdge()) {
            var extraNode = new $N.BaseNode("extraNode");
            let graph = $JO.addExtraNandE(this._graph, extraNode);
            let BFresult = $BF.BellmanFordDict(graph, extraNode);
            if (BFresult.neg_cycle) {
                throw new Error("The graph contains a negative cycle, thus it can not be processed");
            }
            else {
                let newWeights = BFresult.distances;
                graph = $JO.reWeighGraph(graph, newWeights, extraNode);
                graph.deleteNode(extraNode);
            }
            this._graph = graph;
        }
        let nodes = this._graph.getNodes();
        let N = Object.keys(nodes).length;
        let adjList = this._graph.adjListDict();
        const evalPriority = (nb) => nb.best;
        const evalObjID = (nb) => nb.id;
        let s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, S = [], CB = {}, closedNodes = {}, Q = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID);
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
                        if (isFinite(dist[w])) {
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
            while (S.length >= 1) {
                w = S.pop();
                for (let parent of Pred[w]) {
                    delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
                }
                if (w != s.getID()) {
                    CB[w] += delta[w];
                }
                sigma[w] = 0;
                delta[w] = 0;
                dist[w] = Number.POSITIVE_INFINITY;
                Pred[w] = [];
                closedNodes[w] = false;
            }
        }
        if (normalize) {
            this.normalizeScores(CB, N, directed);
        }
        return CB;
    }
    computePFSbased(normalize, directed) {
        let nodes = this._graph.getNodes();
        let adjList = this._graph.adjListDict();
        let Pred = {}, sigma = {}, delta = {}, S = [], CB = {};
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
        var equalPathBrandes = function (context) {
            let next_id = context.next.node.getID();
            let current_id = context.current.node.getID();
            sigma[next_id] += sigma[current_id];
            if (Pred[next_id].indexOf(current_id) === -1) {
                Pred[next_id].push(current_id);
            }
        };
        specialConfig.callbacks.equal_path.push(equalPathBrandes);
        for (let i in nodes) {
            let s = nodes[i];
            sigma[s.getID()] = 1;
            $P.PFS(this._graph, s, specialConfig);
            while (S.length >= 1) {
                let w = S.pop();
                for (let parent of Pred[w]) {
                    delta[parent] += (sigma[parent] / sigma[w] * (1 + delta[w]));
                }
                if (w != s.getID()) {
                    CB[w] += delta[w];
                }
                sigma[w] = 0;
                delta[w] = 0;
                Pred[w] = [];
            }
        }
        if (normalize) {
            this.normalizeScores(CB, this._graph.nrNodes(), directed);
        }
        return CB;
    }
    normalizeScores(CB, N, directed) {
        let factor = directed ? ((N - 1) * (N - 2)) : ((N - 1) * (N - 2) / 2);
        for (let node in CB) {
            CB[node] /= factor;
        }
    }
}
exports.Brandes = Brandes;
