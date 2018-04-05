"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $N = require("./Nodes");
var $E = require("./Edges");
var $DS = require("../utils/structUtils");
var logger_1 = require("../utils/logger");
var $BFS = require("../search/BFS");
var $DFS = require("../search/DFS");
var BellmanFord_1 = require("../search/BellmanFord");
var logger = new logger_1.Logger();
var DEFAULT_WEIGHT = 1;
var GraphMode;
(function (GraphMode) {
    GraphMode[GraphMode["INIT"] = 0] = "INIT";
    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
})(GraphMode = exports.GraphMode || (exports.GraphMode = {}));
var BaseGraph = /** @class */ (function () {
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
    /**
     * Version 1: do it in-place (to the object you receive)
     * Version 2: clone the graph first, return the mutated clone
     */
    BaseGraph.prototype.toDirectedGraph = function (copy) {
        if (copy === void 0) { copy = false; }
        var result_graph = copy ? this.clone() : this;
        // if graph has no edges, we want to throw an exception
        if (this._nr_dir_edges === 0 && this._nr_und_edges === 0) {
            throw new Error("Cowardly refusing to re-interpret an empty graph.");
        }
        return result_graph;
    };
    BaseGraph.prototype.toUndirectedGraph = function () {
        return this;
    };
    /**
     * what to do if some edges are not weighted at all?
     * Since graph traversal algortihms (and later maybe graphs themselves)
     * use default weights anyways, I am simply ignoring them for now...
     * @todo figure out how to test this...
     */
    BaseGraph.prototype.hasNegativeEdge = function () {
        var has_neg_edge = false, edge;
        // negative und_edges are always negative cycles
        //reminder: a return statement breaks out of the for loop and finishes the function
        for (var edge_id in this._und_edges) {
            edge = this._und_edges[edge_id];
            if (!edge.isWeighted()) {
                continue;
            }
            if (edge.getWeight() < 0) {
                return true;
            }
        }
        for (var edge_id in this._dir_edges) {
            edge = this._dir_edges[edge_id];
            if (!edge.isWeighted()) {
                continue;
            }
            if (edge.getWeight() < 0) {
                has_neg_edge = true;
                break;
            }
        }
        return has_neg_edge;
    };
    /**
     * Do we want to throw an error if an edge is unweighted?
     * Or shall we let the traversal algorithm deal with DEFAULT weights like now?
     */
    BaseGraph.prototype.hasNegativeCycles = function (node) {
        var _this = this;
        if (!this.hasNegativeEdge()) {
            return false;
        }
        var negative_cycle = false, start = node ? node : this.getRandomNode();
        /**
         * Now do Bellman Ford over all graph components
         */
        $DFS.DFS(this, start).forEach(function (comp) {
            var min_count = Number.POSITIVE_INFINITY, comp_start_node;
            Object.keys(comp).forEach(function (node_id) {
                if (min_count > comp[node_id].counter) {
                    min_count = comp[node_id].counter;
                    comp_start_node = node_id;
                }
            });
            if (BellmanFord_1.BellmanFordArray(_this, _this._nodes[comp_start_node]).neg_cycle) {
                negative_cycle = true;
            }
        });
        return negative_cycle;
    };
    /**
     *
     * @param incoming
     */
    BaseGraph.prototype.nextArray = function (incoming) {
        if (incoming === void 0) { incoming = false; }
        var next = [], node_keys = Object.keys(this._nodes);
        //?? - but AdjDict contains distance value only for the directly reachable neighbors for each node, not all!	
        //I do not understand but it works so it should be okay	
        var adjDict = this.adjListDict(incoming, true, 0);
        for (var i = 0; i < this._nr_nodes; ++i) {
            next.push([]);
            for (var j = 0; j < this._nr_nodes; ++j) {
                next[i].push([]);
                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
            }
        }
        return next;
    };
    /**
     * This function iterates over the adjDict in order to use it's advantage
     * of being able to override edges if edges with smaller weights exist
     *
     * However, the order of nodes in the array represents the order of nodes
     * at creation time, no other implicit alphabetical or collational sorting.
     *
     * This has to be considered when further processing the result
     *
     * @param incoming whether or not to consider incoming edges as well
     * @param include_self contains a distance to itself apart?
     * @param self_dist default distance to self
     */
    BaseGraph.prototype.adjListArray = function (incoming) {
        if (incoming === void 0) { incoming = false; }
        var adjList = [], node_keys = Object.keys(this._nodes);
        var adjDict = this.adjListDict(incoming, true, 0);
        for (var i = 0; i < this._nr_nodes; ++i) {
            adjList.push([]);
            for (var j = 0; j < this._nr_nodes; ++j) {
                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
            }
        }
        return adjList;
    };
    /**
     *
     * @param incoming whether or not to consider incoming edges as well
     * @param include_self contains a distance to itself apart?
     * @param self_dist default distance to self
     */
    BaseGraph.prototype.adjListDict = function (incoming, include_self, self_dist) {
        if (incoming === void 0) { incoming = false; }
        if (include_self === void 0) { include_self = false; }
        if (self_dist === void 0) { self_dist = 0; }
        var adj_list_dict = {}, nodes = this.getNodes(), cur_dist, key, cur_edge_weight;
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
                    if (incoming) { // we need to update the 'inverse' entry as well
                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
                    }
                }
                else {
                    adj_list_dict[key][ne.node.getID()] = cur_dist;
                    if (incoming) { // we need to update the 'inverse' entry as well
                        adj_list_dict[ne.node.getID()][key] = cur_dist;
                    }
                }
            });
        }
        return adj_list_dict;
    };
    BaseGraph.prototype.getMode = function () {
        return this._mode;
    };
    BaseGraph.prototype.getStats = function () {
        return {
            mode: this._mode,
            nr_nodes: this._nr_nodes,
            nr_und_edges: this._nr_und_edges,
            nr_dir_edges: this._nr_dir_edges,
            density_dir: this._nr_dir_edges / (this._nr_nodes * (this._nr_nodes - 1)),
            density_und: 2 * this._nr_und_edges / (this._nr_nodes * (this._nr_nodes - 1))
        };
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
    /**
     *
     * @param id
     * @param opts
     *
     * @todo addNode functions should check if a node with a given ID already exists -> node IDs have to be unique...
     */
    BaseGraph.prototype.addNodeByID = function (id, opts) {
        if (this.hasNodeID(id)) {
            throw new Error("Won't add node with duplicate ID.");
        }
        var node = new $N.BaseNode(id, opts);
        return this.addNode(node) ? node : null;
    };
    BaseGraph.prototype.addNode = function (node) {
        if (this.hasNodeID(node.getID())) {
            throw new Error("Won't add node with duplicate ID.");
        }
        this._nodes[node.getID()] = node;
        this._nr_nodes += 1;
        return true;
    };
    /**
     * Instantiates a new node object, copies the features and
     * adds the node to the graph, but does NOT clone it's edges
     * @param node the node object to clone
     */
    BaseGraph.prototype.cloneAndAddNode = function (node) {
        var new_node = new $N.BaseNode(node.getID());
        new_node.setFeatures($DS.clone(node.getFeatures()));
        this._nodes[node.getID()] = new_node;
        this._nr_nodes += 1;
        return new_node;
    };
    BaseGraph.prototype.hasNodeID = function (id) {
        return !!this._nodes[id];
    };
    BaseGraph.prototype.getNodeById = function (id) {
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
    BaseGraph.prototype.getEdgeById = function (id) {
        var edge = this._dir_edges[id] || this._und_edges[id];
        if (!edge) {
            throw new Error("cannot retrieve edge with non-existing ID.");
        }
        return edge;
    };
    BaseGraph.prototype.checkExistanceOfEdgeNodes = function (node_a, node_b) {
        if (!node_a) {
            throw new Error("Cannot find edge. Node A does not exist (in graph).");
        }
        if (!node_b) {
            throw new Error("Cannot find edge. Node B does not exist (in graph).");
        }
    };
    // get the edge from node_a to node_b (or undirected)
    BaseGraph.prototype.getDirEdgeByNodeIDs = function (node_a_id, node_b_id) {
        var node_a = this.getNodeById(node_a_id);
        var node_b = this.getNodeById(node_b_id);
        this.checkExistanceOfEdgeNodes(node_a, node_b);
        // check for outgoing directed edges
        var edges_dir = node_a.outEdges(), edges_dir_keys = Object.keys(edges_dir);
        for (var i = 0; i < edges_dir_keys.length; i++) {
            var edge = edges_dir[edges_dir_keys[i]];
            if (edge.getNodes().b.getID() == node_b_id) {
                return edge;
            }
        }
        // if we managed to arrive here, there is no edge!
        throw new Error("Cannot find edge. There is no edge between Node " + node_a_id + " and " + node_b_id + ".");
    };
    BaseGraph.prototype.getUndEdgeByNodeIDs = function (node_a_id, node_b_id) {
        var node_a = this.getNodeById(node_a_id);
        var node_b = this.getNodeById(node_b_id);
        this.checkExistanceOfEdgeNodes(node_a, node_b);
        // check for undirected edges
        var edges_und = node_a.undEdges(), edges_und_keys = Object.keys(edges_und);
        for (var i = 0; i < edges_und_keys.length; i++) {
            var edge = edges_und[edges_und_keys[i]];
            var b;
            (edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
            if (b == node_b_id) {
                return edge;
            }
        }
    };
    BaseGraph.prototype.getDirEdges = function () {
        return this._dir_edges;
    };
    BaseGraph.prototype.getUndEdges = function () {
        return this._und_edges;
    };
    BaseGraph.prototype.getDirEdgesArray = function () {
        var edges = [];
        for (var e_id in this._dir_edges) {
            edges.push(this._dir_edges[e_id]);
        }
        return edges;
    };
    BaseGraph.prototype.getUndEdgesArray = function () {
        var edges = [];
        for (var e_id in this._und_edges) {
            edges.push(this._und_edges[e_id]);
        }
        return edges;
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
            return this.addEdgeByID(label, node_a, node_b, opts);
        }
    };
    /**
     * Now all test cases pertaining addEdge() call this one...
     */
    BaseGraph.prototype.addEdgeByID = function (id, node_a, node_b, opts) {
        var edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
        return this.addEdge(edge);
    };
    /**
     * Test cases should be reversed / completed
     */
    BaseGraph.prototype.addEdge = function (edge) {
        var node_a = edge.getNodes().a, node_b = edge.getNodes().b;
        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())
            || this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b) {
            throw new Error("can only add edge between two nodes existing in graph");
        }
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
    BaseGraph.prototype.clone = function () {
        var new_graph = new BaseGraph(this._label), old_nodes = this.getNodes(), old_edge, new_node_a = null, new_node_b = null;
        for (var node_id in old_nodes) {
            new_graph.addNode(old_nodes[node_id].clone());
        }
        [this.getDirEdges(), this.getUndEdges()].forEach(function (old_edges) {
            for (var edge_id in old_edges) {
                old_edge = old_edges[edge_id];
                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
                new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
            }
        });
        return new_graph;
    };
    BaseGraph.prototype.cloneSubGraph = function (root, cutoff) {
        var new_graph = new BaseGraph(this._label);
        var config = $BFS.prepareBFSStandardConfig();
        var bfsNodeUnmarkedTestCallback = function (context) {
            if (config.result[context.next_node.getID()].counter > cutoff) {
                context.queue = [];
            }
            else { //This means we only add cutoff -1 nodes to the cloned graph, # of nodes is then equal to cutoff
                new_graph.addNode(context.next_node.clone());
            }
        };
        config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
        $BFS.BFS(this, root, config);
        var old_edge, new_node_a = null, new_node_b = null;
        [this.getDirEdges(), this.getUndEdges()].forEach(function (old_edges) {
            for (var edge_id in old_edges) {
                old_edge = old_edges[edge_id];
                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
                if (new_node_a != null && new_node_b != null)
                    new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
            }
        });
        return new_graph;
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
    BaseGraph.prototype.pickRandomProperty = function (propList) {
        var tmpList = Object.keys(propList);
        var randomPropertyName = tmpList[Math.floor(Math.random() * tmpList.length)];
        return propList[randomPropertyName];
    };
    /**
     * In some cases we need to give back a large number of objects
     * in one swoop, as calls to Object.keys() are really slow
     * for large input objects.
     *
     * In order to do this, we only extract the keys once and then
     * iterate over the key list and add them to a result array
     * with probability = amount / keys.length
     *
     * We also mark all used keys in case we haven't picked up
     * enough entities for the result array after the first round.
     * We then just fill up the rest of the result array linearly
     * with as many unused keys as necessary
     *
     *
     * @todo include generic Test Cases
     * @todo check if amount is larger than propList size
     * @todo This seems like a simple hack - filling up remaining objects
     * Could be replaced by a better fraction-increasing function above...
     *
     * @param propList
     * @param fraction
     * @returns {Array}
     */
    BaseGraph.prototype.pickRandomProperties = function (propList, amount) {
        var ids = [];
        var keys = Object.keys(propList);
        var fraction = amount / keys.length;
        var used_keys = {};
        for (var i = 0; ids.length < amount && i < keys.length; i++) {
            if (Math.random() < fraction) {
                ids.push(keys[i]);
                used_keys[keys[i]] = i;
            }
        }
        var diff = amount - ids.length;
        for (var i = 0; i < keys.length && diff; i++) {
            if (used_keys[keys[i]] == null) {
                ids.push(keys[i]);
                diff--;
            }
        }
        return ids;
    };
    return BaseGraph;
}());
exports.BaseGraph = BaseGraph;
