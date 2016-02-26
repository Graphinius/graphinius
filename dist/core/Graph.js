/// <reference path="../../typings/tsd.d.ts" />
var $N = require('./Nodes');
var $E = require('./Edges');
var _ = require('lodash');
(function (GraphMode) {
    GraphMode[GraphMode["INIT"] = 0] = "INIT";
    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
})(exports.GraphMode || (exports.GraphMode = {}));
var GraphMode = exports.GraphMode;
var BaseGraph = (function () {
    // protected _typed_nodes: { [type: string] : { [key: string] : $N.IBaseNode } };
    // protected _typed_dir_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
    // protected _typed_und_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
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
    /**
     * We assume graphs in which no node has higher total degree than 65536
     */
    BaseGraph.prototype.degreeDistribution = function () {
        var max_deg = 0, key, node, all_deg;
        for (key in this._nodes) {
            if (!this._nodes.hasOwnProperty(key)) {
                continue;
            }
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
            if (!this._nodes.hasOwnProperty(key)) {
                continue;
            }
            node = this._nodes[key];
            deg_dist.in[node.inDegree()]++;
            deg_dist.out[node.outDegree()]++;
            deg_dist.dir[node.inDegree() + node.outDegree()]++;
            deg_dist.und[node.degree()]++;
            deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
        }
        // console.dir(deg_dist);
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
    /**
     * Use hasNodeLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #nodes
     */
    BaseGraph.prototype.hasNodeLabel = function (label) {
        return !!_.findKey(this._nodes, function (node) {
            return node.getLabel() === label;
        });
    };
    BaseGraph.prototype.getNodeById = function (id) {
        return this._nodes[id];
    };
    /**
     * Use getNodeByLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #nodes
     */
    BaseGraph.prototype.getNodeByLabel = function (label) {
        var id = _.findKey(this._nodes, function (node) {
            return node.getLabel() === label;
        });
        return this._nodes[id];
    };
    BaseGraph.prototype.getNodes = function () {
        return this._nodes;
    };
    /**
     * CAUTION - This function takes linear time in # nodes
     */
    BaseGraph.prototype.getRandomNode = function () {
        return this.pickRandomProperty(this._nodes);
    };
    BaseGraph.prototype.deleteNode = function (node) {
        var rem_node = this._nodes[node.getID()];
        if (!rem_node) {
            throw new Error('Cannot remove un-added node.');
        }
        // Edges?
        var in_deg = node.inDegree();
        var out_deg = node.outDegree();
        var deg = node.degree();
        // Delete all edges brutally...
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
    /**
     * Use hasEdgeLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #edges
     */
    BaseGraph.prototype.hasEdgeLabel = function (label) {
        var dir_id = _.findKey(this._dir_edges, function (edge) {
            return edge.getLabel() === label;
        });
        var und_id = _.findKey(this._und_edges, function (edge) {
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
    /**
     * Use hasEdgeLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #edges
     */
    BaseGraph.prototype.getEdgeByLabel = function (label) {
        var dir_id = _.findKey(this._dir_edges, function (edge) {
            return edge.getLabel() === label;
        });
        var und_id = _.findKey(this._und_edges, function (edge) {
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
        // connect edge to first node anyways			
        node_a.addEdge(edge);
        if (edge.isDirected()) {
            // add edge to second node too
            node_b.addEdge(edge);
            this._dir_edges[edge.getID()] = edge;
            this._nr_dir_edges += 1;
            this.updateGraphMode();
        }
        else {
            // add edge to both nodes, except they are the same...
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
    // Some atomicity / rollback feature would be nice here...
    BaseGraph.prototype.deleteInEdgesOf = function (node) {
        this.checkConnectedNodeOrThrow(node);
        var in_edges = node.inEdges();
        var key, edge;
        for (key in in_edges) {
            if (!in_edges.hasOwnProperty(key)) {
                continue;
            }
            edge = in_edges[key];
            edge.getNodes().a.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearInEdges();
        this.updateGraphMode();
    };
    // Some atomicity / rollback feature would be nice here...
    BaseGraph.prototype.deleteOutEdgesOf = function (node) {
        this.checkConnectedNodeOrThrow(node);
        var out_edges = node.outEdges();
        var key, edge;
        for (key in out_edges) {
            if (!out_edges.hasOwnProperty(key)) {
                continue;
            }
            edge = out_edges[key];
            edge.getNodes().b.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearOutEdges();
        this.updateGraphMode();
    };
    // Some atomicity / rollback feature would be nice here...
    BaseGraph.prototype.deleteDirEdgesOf = function (node) {
        this.deleteInEdgesOf(node);
        this.deleteOutEdgesOf(node);
    };
    // Some atomicity / rollback feature would be nice here...
    BaseGraph.prototype.deleteUndEdgesOf = function (node) {
        this.checkConnectedNodeOrThrow(node);
        var und_edges = node.undEdges();
        var key, edge;
        for (key in und_edges) {
            if (!und_edges.hasOwnProperty(key)) {
                continue;
            }
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
    // Some atomicity / rollback feature would be nice here...
    BaseGraph.prototype.deleteAllEdgesOf = function (node) {
        this.deleteDirEdgesOf(node);
        this.deleteUndEdgesOf(node);
    };
    /**
     * Remove all the (un)directed edges in the graph
     */
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
    /**
     * Simple edge generator:
     * Go through all node combinations, and
     * add an (un)directed edge with
     * @param probability and
     * @direction true or false
     * CAUTION: this algorithm takes quadratic runtime in #nodes
     */
    BaseGraph.prototype.createRandomEdgesProb = function (probability, directed) {
        if (directed === void 0) { directed = false; }
        if (0 > probability || 1 < probability) {
            throw new Error("Probability out of range.");
        }
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
    /**
     * Simple edge generator:
     * Go through all nodes, and
     * add [min, max] (un)directed edges to
     * a randomly chosen node
     * CAUTION: this algorithm could take quadratic runtime in #nodes
     * but should be much faster
     */
    BaseGraph.prototype.createRandomEdgesSpan = function (min, max, directed) {
        if (directed === void 0) { directed = false; }
        if (min < 0) {
            throw new Error('Minimum degree cannot be negative.');
        }
        if (max >= this.nrNodes()) {
            throw new Error('Maximum degree exceeds number of reachable nodes.');
        }
        // Do we need to set them integers before the calculations?
        var min = min | 0, max = max | 0, nodes = this._nodes, idx_a, node_a, node_b, edge_id, node_keys = Object.keys(nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
        for (idx_a in nodes) {
            node_a = nodes[idx_a];
            rand_idx = 0;
            rand_deg = (Math.random() * max + min) | 0;
            while (rand_deg) {
                rand_idx = (keys_len * Math.random()) | 0; // should never reach keys_len...
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
    /**
     * CAUTION - This function is linear in # directed edges
     */
    BaseGraph.prototype.getRandomDirEdge = function () {
        return this.pickRandomProperty(this._dir_edges);
    };
    /**
     * CAUTION - This function is linear in # undirected edges
     */
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
})();
exports.BaseGraph = BaseGraph;
