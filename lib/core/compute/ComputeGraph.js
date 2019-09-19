"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_WEIGHT = 1;
var ComputeGraph = (function () {
    function ComputeGraph(_g, _tf) {
        this._g = _g;
        this._tf = _tf;
    }
    ComputeGraph.prototype.nextArray = function (incoming) {
        if (incoming === void 0) { incoming = false; }
        var next = [], node_keys = Object.keys(this._g.getNodes());
        var adjDict = this.adjListW(incoming, true, 0);
        for (var i = 0; i < this._g.nrNodes(); ++i) {
            next.push([]);
            for (var j = 0; j < this._g.nrNodes(); ++j) {
                next[i].push([]);
                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
            }
        }
        return next;
    };
    ComputeGraph.prototype.adjMatrix = function () {
        var adjList = [], node_keys = Object.keys(this._g.getNodes());
        var adjDict = this.adjListW();
        for (var i = 0; i < this._g.nrNodes(); ++i) {
            adjList.push([]);
            for (var j = 0; j < this._g.nrNodes(); ++j) {
                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? 1 : 0);
            }
        }
        return adjList;
    };
    ComputeGraph.prototype.adjMatrixW = function (incoming, include_self, self_dist) {
        if (incoming === void 0) { incoming = false; }
        if (include_self === void 0) { include_self = false; }
        if (self_dist === void 0) { self_dist = 0; }
        var adjList = [], node_keys = Object.keys(this._g.getNodes());
        var adjDict = this.adjListW(incoming, include_self, self_dist);
        for (var i = 0; i < this._g.nrNodes(); ++i) {
            adjList.push([]);
            for (var j = 0; j < this._g.nrNodes(); ++j) {
                adjList[i].push(i === j ? self_dist : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
            }
        }
        return adjList;
    };
    ComputeGraph.prototype.adjListW = function (incoming, include_self, self_dist) {
        if (incoming === void 0) { incoming = false; }
        if (include_self === void 0) { include_self = false; }
        if (self_dist === void 0) { self_dist = 0; }
        var adj_list_dict = {}, nodes = this._g.getNodes(), cur_dist, key, cur_edge_weight;
        for (key in nodes) {
            adj_list_dict[key] = {};
            if (include_self) {
                adj_list_dict[key][key] = self_dist;
            }
        }
        for (key in nodes) {
            var neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();
            neighbors.forEach(function (ne) {
                cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
                cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();
                if (cur_edge_weight < cur_dist) {
                    adj_list_dict[key][ne.node.getID()] = cur_edge_weight;
                    if (incoming) {
                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
                    }
                }
                else {
                    adj_list_dict[key][ne.node.getID()] = cur_dist;
                    if (incoming) {
                        adj_list_dict[ne.node.getID()][key] = cur_dist;
                    }
                }
            });
        }
        return adj_list_dict;
    };
    Object.defineProperty(ComputeGraph.prototype, "clustCoef", {
        get: function () {
            if (!this._tf || !this._tf.matMul) {
                throw new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef.");
            }
            var cc = { global_und: null, global_dir: null };
            var adj_list = this.adjMatrixW();
            console.log(adj_list);
            var aux2, aux3;
            this._tf.matMul(adj_list, adj_list).data().then(function (res) { return aux2 = res; });
            this._tf.matMul(adj_list, aux2).data().then(function (res) { return aux3 = res; });
            console.log(aux3);
            return cc;
        },
        enumerable: true,
        configurable: true
    });
    return ComputeGraph;
}());
exports.ComputeGraph = ComputeGraph;
