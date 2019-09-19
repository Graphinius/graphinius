"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var $N = require("../core/base/BaseNode");
var $P = require("../search/PFS");
var $BF = require("../search/BellmanFord");
var $JO = require("../search/Johnsons");
var $BH = require("../datastructs/BinaryHeap");
var ComputeGraph_1 = require("../core/compute/ComputeGraph");
var Brandes = (function () {
    function Brandes(_graph) {
        this._graph = _graph;
        this._cg = new ComputeGraph_1.ComputeGraph(this._graph);
    }
    Brandes.prototype.computeUnweighted = function (normalize, directed) {
        if (normalize === void 0) { normalize = false; }
        if (directed === void 0) { directed = false; }
        var e_1, _a;
        if (this._graph.nrDirEdges() === 0 && this._graph.nrUndEdges() === 0) {
            throw new Error("Cowardly refusing to traverse graph without edges.");
        }
        var nodes = this._graph.getNodes();
        var adjList = this._cg.adjListDict();
        var s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, Q = [], S = [], CB = {};
        var closedNodes = {};
        for (var n in nodes) {
            var node_id = nodes[n].getID();
            CB[node_id] = 0;
            dist[node_id] = Number.POSITIVE_INFINITY;
            sigma[node_id] = 0;
            delta[node_id] = 0;
            Pred[node_id] = [];
            closedNodes[node_id] = false;
        }
        for (var i in nodes) {
            s = nodes[i];
            var id = s.getID();
            dist[id] = 0;
            sigma[id] = 1;
            Q.push(id);
            closedNodes[id] = true;
            var counter = 0;
            while (Q.length) {
                v = Q.shift();
                S.push(v);
                var neighbors = adjList[v];
                closedNodes[v] = true;
                for (var w_1 in neighbors) {
                    if (closedNodes[w_1]) {
                        continue;
                    }
                    if (dist[w_1] === Number.POSITIVE_INFINITY) {
                        Q.push(w_1);
                        dist[w_1] = dist[v] + 1;
                    }
                    if (dist[w_1] === dist[v] + 1) {
                        sigma[w_1] += sigma[v];
                        Pred[w_1].push(v);
                    }
                }
            }
            while (S.length >= 1) {
                w = S.pop();
                try {
                    for (var _b = __values(Pred[w]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var parent_1 = _c.value;
                        delta[parent_1] += (sigma[parent_1] / sigma[w] * (1 + delta[w]));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
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
    };
    Brandes.prototype.computeWeighted = function (normalize, directed) {
        var e_2, _a;
        if (this._graph.nrDirEdges() === 0 && this._graph.nrUndEdges() === 0) {
            throw new Error("Cowardly refusing to traverse graph without edges.");
        }
        if (this._graph.hasNegativeEdge()) {
            var extraNode = new $N.BaseNode("extraNode");
            var graph = $JO.addExtraNandE(this._graph, extraNode);
            var BFresult = $BF.BellmanFordDict(graph, extraNode);
            if (BFresult.neg_cycle) {
                throw new Error("The graph contains a negative cycle, thus it can not be processed");
            }
            else {
                var newWeights = BFresult.distances;
                graph = $JO.reWeighGraph(graph, newWeights, extraNode);
                graph.deleteNode(extraNode);
            }
            this._graph = graph;
        }
        var nodes = this._graph.getNodes();
        var N = Object.keys(nodes).length;
        var adjList = this._cg.adjListDict();
        var evalPriority = function (nb) { return nb.best; };
        var evalObjID = function (nb) { return nb.id; };
        var s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, S = [], CB = {}, closedNodes = {}, Q = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID);
        for (var n in nodes) {
            var currID = nodes[n].getID();
            CB[currID] = 0;
            dist[currID] = Number.POSITIVE_INFINITY;
            sigma[currID] = 0;
            delta[currID] = 0;
            Pred[currID] = [];
            closedNodes[currID] = false;
        }
        for (var i in nodes) {
            s = nodes[i];
            var id_s = s.getID();
            dist[id_s] = 0;
            sigma[id_s] = 1;
            var source = { id: id_s, best: 0 };
            Q.insert(source);
            closedNodes[id_s] = true;
            while (Q.size() > 0) {
                v = Q.pop();
                var current_id = v.id;
                S.push(current_id);
                closedNodes[current_id] = true;
                var neighbors = adjList[current_id];
                for (var w_2 in neighbors) {
                    if (closedNodes[w_2]) {
                        continue;
                    }
                    var new_dist = dist[current_id] + neighbors[w_2];
                    var nextNode = { id: w_2, best: dist[w_2] };
                    if (dist[w_2] > new_dist) {
                        if (isFinite(dist[w_2])) {
                            var x = Q.remove(nextNode);
                            nextNode.best = new_dist;
                            Q.insert(nextNode);
                        }
                        else {
                            nextNode.best = new_dist;
                            Q.insert(nextNode);
                        }
                        sigma[w_2] = 0;
                        dist[w_2] = new_dist;
                        Pred[w_2] = [];
                    }
                    if (dist[w_2] === new_dist) {
                        sigma[w_2] += sigma[current_id];
                        Pred[w_2].push(current_id);
                    }
                }
            }
            while (S.length >= 1) {
                w = S.pop();
                try {
                    for (var _b = __values(Pred[w]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var parent_2 = _c.value;
                        delta[parent_2] += (sigma[parent_2] / sigma[w] * (1 + delta[w]));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
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
    };
    Brandes.prototype.computePFSbased = function (normalize, directed) {
        var e_3, _a;
        var nodes = this._graph.getNodes();
        var adjList = this._cg.adjListDict();
        var Pred = {}, sigma = {}, delta = {}, S = [], CB = {};
        for (var n in nodes) {
            var currID = nodes[n].getID();
            CB[currID] = 0;
            sigma[currID] = 0;
            delta[currID] = 0;
            Pred[currID] = [];
        }
        var specialConfig = $P.preparePFSStandardConfig();
        var notEncounteredBrandes = function (context) {
            context.next.best =
                context.current.best + (isNaN(context.next.edge.getWeight()) ? $P.DEFAULT_WEIGHT : context.next.edge.getWeight());
            var next_id = context.next.node.getID();
            var current_id = context.current.node.getID();
            Pred[next_id] = [current_id];
            sigma[next_id] += sigma[current_id];
        };
        specialConfig.callbacks.not_encountered.splice(0, 1, notEncounteredBrandes);
        var newCurrentBrandes = function (context) {
            S.push(context.current.node.getID());
        };
        specialConfig.callbacks.new_current.push(newCurrentBrandes);
        var betterPathBrandes = function (context) {
            var next_id = context.next.node.getID();
            var current_id = context.current.node.getID();
            sigma[next_id] = 0;
            sigma[next_id] += sigma[current_id];
            Pred[next_id] = [];
            Pred[next_id].push(current_id);
        };
        specialConfig.callbacks.better_path.splice(0, 1, betterPathBrandes);
        var equalPathBrandes = function (context) {
            var next_id = context.next.node.getID();
            var current_id = context.current.node.getID();
            sigma[next_id] += sigma[current_id];
            if (Pred[next_id].indexOf(current_id) === -1) {
                Pred[next_id].push(current_id);
            }
        };
        specialConfig.callbacks.equal_path.push(equalPathBrandes);
        for (var i in nodes) {
            var s = nodes[i];
            sigma[s.getID()] = 1;
            $P.PFS(this._graph, s, specialConfig);
            while (S.length >= 1) {
                var w = S.pop();
                try {
                    for (var _b = __values(Pred[w]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var parent_3 = _c.value;
                        delta[parent_3] += (sigma[parent_3] / sigma[w] * (1 + delta[w]));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
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
    };
    Brandes.prototype.normalizeScores = function (CB, N, directed) {
        var factor = directed ? ((N - 1) * (N - 2)) : ((N - 1) * (N - 2) / 2);
        for (var node in CB) {
            CB[node] /= factor;
        }
    };
    return Brandes;
}());
exports.Brandes = Brandes;
