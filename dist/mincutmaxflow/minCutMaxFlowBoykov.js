"use strict";
var $G = require('../core/Graph');
var MCMFBoykov = (function () {
    function MCMFBoykov(_graph, _source, _sink, config) {
        this._graph = _graph;
        this._source = _source;
        this._sink = _sink;
        this._state = {
            residGraph: null,
            activeNodes: {},
            orphans: {},
            treeS: {},
            treeT: {},
            parents: {},
            path: [],
            tree: {}
        };
        this._config = config || this.prepareMCMFStandardConfig();
        if (this._config.directed) {
            this.renameEdges(_graph);
        }
        this._state.residGraph = this._graph;
        if (!this._config.directed) {
            this._state.residGraph = this.convertToDirectedGraph(this._state.residGraph);
            this._source = this._state.residGraph.getNodeById(this._source.getID());
            this._sink = this._state.residGraph.getNodeById(this._sink.getID());
        }
    }
    MCMFBoykov.prototype.calculateCycle = function () {
        var result = {
            edges: [],
            edgeIDs: [],
            cost: 0
        };
        this._state.treeS[this._source.getID()] = this._source;
        this._state.tree[this._source.getID()] = "S";
        this._state.treeT[this._sink.getID()] = this._sink;
        this._state.tree[this._sink.getID()] = "T";
        this._state.activeNodes[this._source.getID()] = this._source;
        this._state.activeNodes[this._sink.getID()] = this._sink;
        var nrCycles = 0;
        while (true) {
            this.grow();
            if (!this._state.path.length) {
                break;
            }
            this.augmentation();
            this.adoption();
            ++nrCycles;
        }
        console.log("computing result");
        var smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
        var smallTree_size = Object.keys(smallTree).length;
        var smallTree_ids = Object.keys(smallTree);
        for (var i = 0; i < smallTree_size; i++) {
            var node_id = smallTree_ids[i];
            var node = this._graph.getNodeById(node_id);
            if (!this._config.directed) {
                var undEdges = node.undEdges();
                var undEdges_size = Object.keys(undEdges).length;
                var undEdges_ids = Object.keys(undEdges);
                for (var i_1 = 0; i_1 < undEdges_size; i_1++) {
                    var edge = undEdges[undEdges_ids[i_1]];
                    var neighbor = (edge.getNodes().a.getID() == node.getID()) ? edge.getNodes().b : edge.getNodes().a;
                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
                        result.edges.push(edge);
                        result.edgeIDs.push(edge.getID());
                        result.cost += edge.getWeight();
                    }
                }
            }
            else {
                var outEdges_ids = Object.keys(node.outEdges());
                var outEdges_length = outEdges_ids.length;
                var inEdges_ids = Object.keys(node.inEdges());
                var inEdges_length = inEdges_ids.length;
                for (var i_2 = 0; i_2 < outEdges_length; i_2++) {
                    var edge = this._graph.getEdgeById(outEdges_ids[i_2]);
                    var neighbor = edge.getNodes().b;
                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
                        result.edges.push(edge);
                        result.edgeIDs.push(edge.getID());
                        result.cost += edge.getWeight();
                    }
                }
                for (var i_3 = 0; i_3 < inEdges_length; i_3++) {
                    var edge = this._graph.getEdgeById(inEdges_ids[i_3]);
                    var neighbor = edge.getNodes().a;
                    if (this.tree(neighbor) != this.tree(node)) {
                        result.edges.push(edge);
                        result.edgeIDs.push(edge.getID());
                        result.cost += edge.getWeight();
                    }
                }
            }
        }
        console.log("Cost => " + result.cost);
        console.log("# cycles => " + nrCycles);
        return result;
    };
    MCMFBoykov.prototype.renameEdges = function (graph) {
        var edges = graph.getDirEdges();
        var edges_ids = Object.keys(edges);
        var edges_length = edges_ids.length;
        for (var i = 0; i < edges_length; i++) {
            var edge = edges[edges_ids[i]];
            var weight = edge.getWeight();
            graph.deleteEdge(edge);
            var node_a = edge.getNodes().a;
            var node_b = edge.getNodes().b;
            var options = { directed: true, weighted: true, weight: weight };
            var new_edge = graph.addEdge(node_a.getID() + "_" + node_b.getID(), node_a, node_b, options);
        }
    };
    MCMFBoykov.prototype.convertToDirectedGraph = function (uGraph) {
        var dGraph = new $G.BaseGraph(uGraph._label + "_directed");
        var nodes = uGraph.getNodes();
        var nodes_ids = Object.keys(nodes);
        var nodes_length = nodes_ids.length;
        for (var i = 0; i < nodes_length; i++) {
            var node = nodes[nodes_ids[i]];
            dGraph.addNode(node.getID());
        }
        var edges = uGraph.getUndEdges();
        var edges_ids = Object.keys(edges);
        var edges_length = edges_ids.length;
        for (var i = 0; i < edges_length; i++) {
            var und_edge = edges[edges_ids[i]];
            var node_a_id = und_edge.getNodes().a.getID();
            var node_b_id = und_edge.getNodes().b.getID();
            var options = { directed: true, weighted: true, weight: und_edge.getWeight() };
            dGraph.addEdge(node_a_id + "_" + node_b_id, dGraph.getNodeById(node_a_id), dGraph.getNodeById(node_b_id), options);
            dGraph.addEdge(node_b_id + "_" + node_a_id, dGraph.getNodeById(node_b_id), dGraph.getNodeById(node_a_id), options);
        }
        return dGraph;
    };
    MCMFBoykov.prototype.tree = function (node) {
        var tree = "";
        if (node.getID() in this._state.treeS) {
            tree = "S";
            return tree;
        }
        if (node.getID() in this._state.treeT) {
            tree = "T";
            return tree;
        }
        return tree;
    };
    MCMFBoykov.prototype.getPathToRoot = function (node) {
        var path_root = [];
        var node_id = node.getID();
        path_root.push(this._graph.getNodeById(node_id));
        var sink_id = this._sink.getID();
        var source_id = this._source.getID();
        while ((node_id != sink_id) && (node_id != source_id)) {
            if (this._state.parents[node_id] == null) {
                return path_root;
            }
            node_id = this._state.parents[node_id].getID();
            path_root.push(this._graph.getNodeById(node_id));
        }
        return path_root;
    };
    MCMFBoykov.prototype.getBottleneckCapacity = function () {
        var min_capacity = 0;
        var min_capacity = this._state.residGraph.getEdgeById(this._state.path[0].getID() + "_" + this._state.path[1].getID()).getWeight();
        var path_length = this._state.path.length - 1;
        for (var i = 0; i < path_length; i++) {
            var node_a = this._state.path[i];
            var node_b = this._state.path[i + 1];
            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
            if (edge.getWeight() < min_capacity) {
                min_capacity = edge.getWeight();
            }
        }
        return min_capacity;
    };
    MCMFBoykov.prototype.grow = function () {
        var nr_active_nodes = Object.keys(this._state.activeNodes).length;
        var active_nodes_ids = Object.keys(this._state.activeNodes);
        while (nr_active_nodes) {
            var activeNode = this._state.activeNodes[active_nodes_ids[0]];
            var edges = (this._state.tree[activeNode.getID()] == "S") ? activeNode.outEdges() : activeNode.inEdges();
            var edges_ids = Object.keys(edges);
            var edges_length = edges_ids.length;
            for (var i = 0; i < edges_length; i++) {
                var edge = edges[edges_ids[i]];
                var neighborNode = (this._state.tree[activeNode.getID()] == "S") ? edge.getNodes().b : edge.getNodes().a;
                if (edge.getWeight() <= 0) {
                    continue;
                }
                if (!(this._state.tree[neighborNode.getID()])) {
                    if (this._state.tree[activeNode.getID()] == "S") {
                        this._state.treeS[neighborNode.getID()] = neighborNode;
                        this._state.tree[neighborNode.getID()] = "S";
                    }
                    else {
                        this._state.treeT[neighborNode.getID()] = neighborNode;
                        this._state.tree[neighborNode.getID()] = "T";
                    }
                    this._state.parents[neighborNode.getID()] = activeNode;
                    this._state.activeNodes[neighborNode.getID()] = neighborNode;
                    active_nodes_ids.push(neighborNode.getID());
                    ++nr_active_nodes;
                }
                else if (this._state.tree[neighborNode.getID()] != this._state.tree[activeNode.getID()]) {
                    var complete_path;
                    var nPath = this.getPathToRoot(neighborNode);
                    var aPath = this.getPathToRoot(activeNode);
                    var root_node_npath = nPath[nPath.length - 1];
                    if (this._state.tree[root_node_npath.getID()] == "S") {
                        nPath = nPath.reverse();
                        complete_path = nPath.concat(aPath);
                    }
                    else {
                        aPath = aPath.reverse();
                        complete_path = aPath.concat(nPath);
                    }
                    this._state.path = complete_path;
                    return;
                }
            }
            delete this._state.activeNodes[activeNode.getID()];
            active_nodes_ids.shift();
            --nr_active_nodes;
        }
        this._state.path = [];
        return;
    };
    MCMFBoykov.prototype.augmentation = function () {
        var min_capacity = this.getBottleneckCapacity();
        for (var i = 0; i < this._state.path.length - 1; i++) {
            var node_a = this._state.path[i], node_b = this._state.path[i + 1];
            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
            var reverse_edge = this._state.residGraph.getEdgeById(node_b.getID() + "_" + node_a.getID());
            this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
            this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
            edge = this._state.residGraph.getEdgeById(edge.getID());
            if (!edge.getWeight()) {
                if (this._state.tree[node_a.getID()] == this._state.tree[node_b.getID()]) {
                    if (this._state.tree[node_b.getID()] == "S") {
                        delete this._state.parents[node_b.getID()];
                        this._state.orphans[node_b.getID()] = node_b;
                    }
                    if (this._state.tree[node_a.getID()] == "T") {
                        delete this._state.parents[node_a.getID()];
                        this._state.orphans[node_a.getID()] = node_a;
                    }
                }
            }
        }
    };
    MCMFBoykov.prototype.adoption = function () {
        var orphans_ids = Object.keys(this._state.orphans);
        var orphans_size = orphans_ids.length;
        while (orphans_size) {
            var orphan = this._state.orphans[orphans_ids[0]];
            delete this._state.orphans[orphan.getID()];
            orphans_ids.shift();
            --orphans_size;
            var edges = (this._state.tree[orphan.getID()] == "S") ? orphan.inEdges() : orphan.outEdges();
            var edge_ids = Object.keys(edges);
            var edge_length = edge_ids.length;
            var found = false;
            for (var i = 0; i < edge_length; i++) {
                var edge = edges[edge_ids[i]];
                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
                if ((this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) && edge.getWeight()) {
                    var neighbor_root_path = this.getPathToRoot(neighbor);
                    var neighbor_root = neighbor_root_path[neighbor_root_path.length - 1];
                    if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
                        this._state.parents[orphan.getID()] = neighbor;
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                continue;
            }
            for (var i = 0; i < edge_length; i++) {
                var edge = edges[edge_ids[i]];
                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
                if (this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) {
                    if (edge.getWeight()) {
                        this._state.activeNodes[neighbor.getID()] = neighbor;
                    }
                    if (this._state.parents[neighbor.getID()] == null) {
                        continue;
                    }
                    if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
                        this._state.orphans[neighbor.getID()] = neighbor;
                        orphans_ids.push(neighbor.getID());
                        ++orphans_size;
                        delete this._state.parents[neighbor.getID()];
                    }
                }
            }
            var orphan_tree = this._state.tree[orphan.getID()];
            if (orphan_tree == "S") {
                delete this._state.treeS[orphan.getID()];
                delete this._state.tree[orphan.getID()];
            }
            else if (orphan_tree == "T") {
                delete this._state.treeT[orphan.getID()];
                delete this._state.tree[orphan.getID()];
            }
            delete this._state.activeNodes[orphan.getID()];
        }
    };
    MCMFBoykov.prototype.prepareMCMFStandardConfig = function () {
        return {
            directed: true
        };
    };
    return MCMFBoykov;
}());
exports.MCMFBoykov = MCMFBoykov;
