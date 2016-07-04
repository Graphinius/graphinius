"use strict";
var $N = require('./Nodes');
var $E = require('./Edges');
var $DS = require('../utils/structUtils');
(function (GraphMode) {
    GraphMode[GraphMode["INIT"] = 0] = "INIT";
    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
})(exports.GraphMode || (exports.GraphMode = {}));
var GraphMode = exports.GraphMode;
var BaseGraph = (function () {
    function BaseGraph(_label) {
        this._label = _label;
        this._nr_nodes = 0;
        this._nr_dir_edges = 0;
        this._nr_und_edges = 0;
        this._mode = GraphMode.INIT;
        this._nodes = {};
        this._dir_edges = {};
        this._und_edges = {};
    }
    BaseGraph.prototype.getMode = function () {
        return this._mode;
    };
    BaseGraph.prototype.getStats = function () {
        return {
            mode: this._mode,
            nr_nodes: this._nr_nodes,
            nr_und_edges: this._nr_und_edges,
            nr_dir_edges: this._nr_dir_edges
        };
    };
    BaseGraph.prototype.degreeDistribution = function () {
        var max_deg = 0, key, node, all_deg;
        for (key in this._nodes) {
            node = this._nodes[key];
            all_deg = node.inDegree() + node.outDegree() + node.degree() + 1;
            max_deg = all_deg > max_deg ? all_deg : max_deg;
        }
        var deg_dist = {
            in: new Uint16Array(max_deg),
            out: new Uint16Array(max_deg),
            dir: new Uint16Array(max_deg),
            und: new Uint16Array(max_deg),
            all: new Uint16Array(max_deg)
        };
        for (key in this._nodes) {
            node = this._nodes[key];
            deg_dist.in[node.inDegree()]++;
            deg_dist.out[node.outDegree()]++;
            deg_dist.dir[node.inDegree() + node.outDegree()]++;
            deg_dist.und[node.degree()]++;
            deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
        }
        return deg_dist;
    };
    BaseGraph.prototype.nrNodes = function () {
        return this._nr_nodes;
    };
    BaseGraph.prototype.nrDirEdges = function () {
        return this._nr_dir_edges;
    };
    BaseGraph.prototype.nrUndEdges = function () {
        return this._nr_und_edges;
    };
    BaseGraph.prototype.addNode = function (id, opts) {
        var node = new $N.BaseNode(id, opts);
        this._nodes[node.getID()] = node;
        this._nr_nodes += 1;
        return node;
    };
    BaseGraph.prototype.hasNodeID = function (id) {
        return !!this._nodes[id];
    };
    BaseGraph.prototype.hasNodeLabel = function (label) {
        return !!$DS.findKey(this._nodes, function (node) {
            return node.getLabel() === label;
        });
    };
    BaseGraph.prototype.getNodeById = function (id) {
        return this._nodes[id];
    };
    BaseGraph.prototype.getNodeByLabel = function (label) {
        var id = $DS.findKey(this._nodes, function (node) {
            return node.getLabel() === label;
        });
        return this._nodes[id];
    };
    BaseGraph.prototype.getNodes = function () {
        return this._nodes;
    };
    BaseGraph.prototype.getRandomNode = function () {
        return this.pickRandomProperty(this._nodes);
    };
    BaseGraph.prototype.deleteNode = function (node) {
        var rem_node = this._nodes[node.getID()];
        if (!rem_node) {
            throw new Error('Cannot remove un-added node.');
        }
        var in_deg = node.inDegree();
        var out_deg = node.outDegree();
        var deg = node.degree();
        if (in_deg) {
            this.deleteInEdgesOf(node);
        }
        if (out_deg) {
            this.deleteOutEdgesOf(node);
        }
        if (deg) {
            this.deleteUndEdgesOf(node);
        }
        delete this._nodes[node.getID()];
        this._nr_nodes -= 1;
    };
    BaseGraph.prototype.hasEdgeID = function (id) {
        return !!this._dir_edges[id] || !!this._und_edges[id];
    };
    BaseGraph.prototype.hasEdgeLabel = function (label) {
        var dir_id = $DS.findKey(this._dir_edges, function (edge) {
            return edge.getLabel() === label;
        });
        var und_id = $DS.findKey(this._und_edges, function (edge) {
            return edge.getLabel() === label;
        });
        return !!dir_id || !!und_id;
    };
    BaseGraph.prototype.getEdgeById = function (id) {
        var edge = this._dir_edges[id] || this._und_edges[id];
        if (!edge) {
            throw new Error("cannot retrieve edge with non-existing ID.");
        }
        return edge;
    };
    BaseGraph.prototype.getEdgeByLabel = function (label) {
        var dir_id = $DS.findKey(this._dir_edges, function (edge) {
            return edge.getLabel() === label;
        });
        var und_id = $DS.findKey(this._und_edges, function (edge) {
            return edge.getLabel() === label;
        });
        var edge = this._dir_edges[dir_id] || this._und_edges[und_id];
        if (!edge) {
            throw new Error("cannot retrieve edge with non-existing Label.");
        }
        return edge;
    };
    BaseGraph.prototype.getDirEdges = function () {
        return this._dir_edges;
    };
    BaseGraph.prototype.getUndEdges = function () {
        return this._und_edges;
    };
    BaseGraph.prototype.addEdgeByNodeIDs = function (label, node_a_id, node_b_id, opts) {
        var node_a = this.getNodeById(node_a_id), node_b = this.getNodeById(node_b_id);
        if (!node_a) {
            throw new Error("Cannot add edge. Node A does not exist");
        }
        else if (!node_b) {
            throw new Error("Cannot add edge. Node B does not exist");
        }
        else {
            return this.addEdge(label, node_a, node_b, opts);
        }
    };
    BaseGraph.prototype.addEdge = function (id, node_a, node_b, opts) {
        var edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
        node_a.addEdge(edge);
        if (edge.isDirected()) {
            node_b.addEdge(edge);
            this._dir_edges[edge.getID()] = edge;
            this._nr_dir_edges += 1;
            this.updateGraphMode();
        }
        else {
            if (node_a !== node_b) {
                node_b.addEdge(edge);
            }
            this._und_edges[edge.getID()] = edge;
            this._nr_und_edges += 1;
            this.updateGraphMode();
        }
        return edge;
    };
    BaseGraph.prototype.deleteEdge = function (edge) {
        var dir_edge = this._dir_edges[edge.getID()];
        var und_edge = this._und_edges[edge.getID()];
        if (!dir_edge && !und_edge) {
            throw new Error('cannot remove non-existing edge.');
        }
        var nodes = edge.getNodes();
        nodes.a.removeEdge(edge);
        if (nodes.a !== nodes.b) {
            nodes.b.removeEdge(edge);
        }
        if (dir_edge) {
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        else {
            delete this._und_edges[edge.getID()];
            this._nr_und_edges -= 1;
        }
        this.updateGraphMode();
    };
    BaseGraph.prototype.deleteInEdgesOf = function (node) {
        this.checkConnectedNodeOrThrow(node);
        var in_edges = node.inEdges();
        var key, edge;
        for (key in in_edges) {
            edge = in_edges[key];
            edge.getNodes().a.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearInEdges();
        this.updateGraphMode();
    };
    BaseGraph.prototype.deleteOutEdgesOf = function (node) {
        this.checkConnectedNodeOrThrow(node);
        var out_edges = node.outEdges();
        var key, edge;
        for (key in out_edges) {
            edge = out_edges[key];
            edge.getNodes().b.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearOutEdges();
        this.updateGraphMode();
    };
    BaseGraph.prototype.deleteDirEdgesOf = function (node) {
        this.deleteInEdgesOf(node);
        this.deleteOutEdgesOf(node);
    };
    BaseGraph.prototype.deleteUndEdgesOf = function (node) {
        this.checkConnectedNodeOrThrow(node);
        var und_edges = node.undEdges();
        var key, edge;
        for (key in und_edges) {
            edge = und_edges[key];
            var conns = edge.getNodes();
            conns.a.removeEdge(edge);
            if (conns.a !== conns.b) {
                conns.b.removeEdge(edge);
            }
            delete this._und_edges[edge.getID()];
            this._nr_und_edges -= 1;
        }
        node.clearUndEdges();
        this.updateGraphMode();
    };
    BaseGraph.prototype.deleteAllEdgesOf = function (node) {
        this.deleteDirEdgesOf(node);
        this.deleteUndEdgesOf(node);
    };
    BaseGraph.prototype.clearAllDirEdges = function () {
        for (var edge in this._dir_edges) {
            this.deleteEdge(this._dir_edges[edge]);
        }
    };
    BaseGraph.prototype.clearAllUndEdges = function () {
        for (var edge in this._und_edges) {
            this.deleteEdge(this._und_edges[edge]);
        }
    };
    BaseGraph.prototype.clearAllEdges = function () {
        this.clearAllDirEdges();
        this.clearAllUndEdges();
    };
    BaseGraph.prototype.createRandomEdgesProb = function (probability, directed) {
        if (0 > probability || 1 < probability) {
            throw new Error("Probability out of range.");
        }
        directed = directed || false;
        var nodes = this._nodes, node_a, node_b, edge_id, dir = directed ? '_d' : '_u';
        for (node_a in nodes) {
            for (node_b in nodes) {
                if (node_a !== node_b && Math.random() < probability) {
                    edge_id = nodes[node_a].getID() + "_" + nodes[node_b].getID() + dir;
                    this.addEdge(edge_id, nodes[node_a], nodes[node_b], { directed: directed });
                }
            }
        }
    };
    BaseGraph.prototype.createRandomEdgesSpan = function (min, max, directed) {
        if (min < 0) {
            throw new Error('Minimum degree cannot be negative.');
        }
        if (max >= this.nrNodes()) {
            throw new Error('Maximum degree exceeds number of reachable nodes.');
        }
        directed = directed || false;
        var min = min | 0, max = max | 0, nodes = this._nodes, idx_a, node_a, node_b, edge_id, node_keys = Object.keys(nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
        for (idx_a in nodes) {
            node_a = nodes[idx_a];
            rand_idx = 0;
            rand_deg = (Math.random() * max + min) | 0;
            while (rand_deg) {
                rand_idx = (keys_len * Math.random()) | 0;
                node_b = nodes[node_keys[rand_idx]];
                if (node_a !== node_b) {
                    edge_id = node_a.getID() + "_" + node_b.getID() + dir;
                    if (node_a.hasEdgeID(edge_id)) {
                        continue;
                    }
                    this.addEdge(edge_id, node_a, node_b, { directed: directed });
                    --rand_deg;
                }
            }
        }
    };
    BaseGraph.prototype.getRandomDirEdge = function () {
        return this.pickRandomProperty(this._dir_edges);
    };
    BaseGraph.prototype.getRandomUndEdge = function () {
        return this.pickRandomProperty(this._und_edges);
    };
    BaseGraph.prototype.checkConnectedNodeOrThrow = function (node) {
        var node = this._nodes[node.getID()];
        if (!node) {
            throw new Error('Cowardly refusing to delete edges of un-added node.');
        }
    };
    BaseGraph.prototype.updateGraphMode = function () {
        var nr_dir = this._nr_dir_edges, nr_und = this._nr_und_edges;
        if (nr_dir && nr_und) {
            this._mode = GraphMode.MIXED;
        }
        else if (nr_dir) {
            this._mode = GraphMode.DIRECTED;
        }
        else if (nr_und) {
            this._mode = GraphMode.UNDIRECTED;
        }
        else {
            this._mode = GraphMode.INIT;
        }
    };
    BaseGraph.prototype.pickRandomProperty = function (obj) {
        var key;
        var count = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && Math.random() < 1 / ++count) {
                key = prop;
            }
        }
        return obj[key];
    };
    return BaseGraph;
}());
exports.BaseGraph = BaseGraph;
