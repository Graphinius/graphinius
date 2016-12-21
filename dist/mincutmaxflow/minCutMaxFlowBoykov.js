"use strict";
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
            path: []
        };
        this._config = config || this.prepareMCMFStandardConfig();
        this._state.residGraph = _graph;
    }
    MCMFBoykov.prototype.calculateCycle = function () {
        var result = {
            edges: [],
            cost: 0
        };
        return result;
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
        var path;
        path.push(node);
        while (this._state.parents[node.getID()]) {
            node = this._state.parents[node.getID()];
            path.push(this._state.parents[node.getID()]);
        }
        return path;
    };
    MCMFBoykov.prototype.getBottleneckCapacity = function (path) {
        var min_capacity = 0;
        for (var i = 0; i < path.length - 1; i++) {
            var node_a = path[i], node_b = path[i + 1];
            var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
            if (edge.getWeight() < min_capacity) {
                min_capacity = edge.getWeight();
            }
        }
        return min_capacity;
    };
    MCMFBoykov.prototype.grow = function () {
        while (Object.keys(this._state.activeNodes).length) {
            var activeNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
            var neighbors = activeNode.reachNodes();
            for (var i = 0; i < neighbors.length; i++) {
                var neighborNode = neighbors[i].node;
                var edge = this._state.residGraph.getEdgeByNodeIDs(activeNode.getID(), neighborNode.getID());
                if (edge.getWeight() <= 0) {
                    continue;
                }
                if (this.tree(neighborNode) == "") {
                    (this.tree(activeNode) == "S") ? this._state.treeS[neighborNode.getID()] = neighborNode : this._state.treeT[neighborNode.getID()] = neighborNode;
                    this._state.parents[neighborNode.getID()] = activeNode;
                    this._state.activeNodes[neighborNode.getID()] = neighborNode;
                }
                else if (this.tree(neighborNode) != this.tree(activeNode)) {
                    var path;
                    var nPath = this.getPathToRoot(neighborNode);
                    var aPath = this.getPathToRoot(activeNode);
                    var root_node_npath = nPath[nPath.length - 1];
                    if (this.tree(root_node_npath) == "S") {
                        nPath = nPath.reverse();
                        path = nPath.concat(aPath);
                    }
                    else {
                        aPath = aPath.reverse();
                        path = aPath.concat(nPath);
                    }
                    this._state.path = path;
                    return this._state.path;
                }
            }
            delete this._state.activeNodes[activeNode.getID()];
        }
        return [];
    };
    MCMFBoykov.prototype.augmentation = function () {
        var min_capacity = this.getBottleneckCapacity(this._state.path);
        for (var i = 0; i < this._state.path.length - 1; i++) {
            var node_a = this._state.path[i], node_b = this._state.path[i + 1];
            var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
            var reverse_edge = this._state.residGraph.getEdgeByNodeIDs(node_b.getID(), node_a.getID());
            this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
            this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
            edge = this._state.residGraph.getEdgeById(edge.getID());
            if (!edge.getWeight()) {
                if (this.tree(node_a) == this.tree(node_b)) {
                    if (this.tree(node_b) == "S") {
                        delete this._state.parents[node_b.getID()];
                        this._state.orphans[node_b.getID()] = node_b;
                    }
                    if (this.tree(node_a) == "T") {
                        delete this._state.parents[node_a.getID()];
                        this._state.orphans[node_a.getID()] = node_a;
                    }
                }
            }
        }
    };
    MCMFBoykov.prototype.adoption = function () {
        while (Object.keys(this._state.orphans).length) {
            var orphan = this._state.orphans[Object.keys(this._state.orphans)[0]];
            delete this._state.orphans[orphan.getID()];
            var neighbors = orphan.reachNodes();
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i].node;
                var edge = this._state.residGraph.getEdgeByNodeIDs(neighbor.getID(), orphan.getID());
                if ((this.tree(orphan) == this.tree(neighbor)) && edge.getWeight()) {
                    var neighbor_root_path = this.getPathToRoot(neighbor);
                    var neighbor_root = neighbor_root_path[neighbor_root_path.length - 1];
                    if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
                        this._state.parents[orphan.getID()] = orphan;
                        return;
                    }
                }
            }
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i].node;
                if (this.tree(orphan) == this.tree(neighbor)) {
                    var edge = this._state.residGraph.getEdgeByNodeIDs(neighbor.getID(), orphan.getID());
                    if (edge.getWeight()) {
                        this._state.activeNodes[neighbor.getID()] = neighbor;
                    }
                    if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
                        this._state.orphans[neighbor.getID()] = neighbor;
                        delete this._state.parents[neighbor.getID()];
                    }
                }
            }
            var orphan_tree = this.tree(orphan);
            if (orphan_tree == "S") {
                delete this._state.treeS[orphan.getID()];
            }
            else if (orphan_tree == "T") {
                delete this._state.treeT[orphan.getID()];
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
