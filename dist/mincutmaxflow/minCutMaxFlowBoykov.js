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
            edgeIDs: [],
            cost: 0
        };
        this._state.treeS[this._source.getID()] = this._source;
        this._state.treeT[this._sink.getID()] = this._sink;
        this._state.activeNodes[this._source.getID()] = this._source;
        this._state.activeNodes[this._sink.getID()] = this._sink;
        var nrCycles = 0;
        while (true) {
            var path = this.grow();
            if (!path.length) {
                break;
            }
            this.augmentation();
            this.adoption();
            ++nrCycles;
        }
        var smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
        for (var i = 0; i < Object.keys(smallTree).length; i++) {
            var node_id = smallTree[Object.keys(smallTree)[i]].getID();
            var node = this._graph.getNodeById(node_id);
            var outEdges = node.outEdges();
            var inEdges = node.inEdges();
            for (var i_1 = 0; i_1 < Object.keys(outEdges).length; i_1++) {
                var edge = outEdges[Object.keys(outEdges)[i_1]];
                var neighbor = edge.getNodes().b;
                if (this.tree(neighbor) != this.tree(node)) {
                    result.edges.push(edge);
                    result.edgeIDs.push(edge.getID());
                    result.cost += edge.getWeight();
                }
            }
            for (var i_2 = 0; i_2 < Object.keys(inEdges).length; i_2++) {
                var edge = inEdges[Object.keys(inEdges)[i_2]];
                var neighbor = edge.getNodes().a;
                if (this.tree(neighbor) != this.tree(node)) {
                    result.edges.push(edge);
                    result.edgeIDs.push(edge.getID());
                    result.cost += edge.getWeight();
                }
            }
        }
        console.log("Cost => " + result.cost);
        console.log("# cycles => " + nrCycles);
        return result;
    };
    MCMFBoykov.prototype.printState = function (print_path) {
        var treeS = [];
        for (var i = 0; i < Object.keys(this._state.treeS).length; i++) {
            treeS.push(Object.keys(this._state.treeS)[i]);
        }
        var treeT = [];
        for (var i = 0; i < Object.keys(this._state.treeT).length; i++) {
            treeT.push(Object.keys(this._state.treeT)[i]);
        }
        var activeNodes = [];
        for (var i = 0; i < Object.keys(this._state.activeNodes).length; i++) {
            activeNodes.push(Object.keys(this._state.activeNodes)[i]);
        }
        var orphans = [];
        for (var i = 0; i < Object.keys(this._state.orphans).length; i++) {
            orphans.push(Object.keys(this._state.orphans)[i]);
        }
        console.log("==========");
        console.log("S => " + treeS);
        console.log("T => " + treeT);
        console.log("A => " + activeNodes);
        console.log("O => " + orphans);
        var p_b = (this._state.parents["B"] == null) ? "/" : this._state.parents["B"].getID();
        var p_c = (this._state.parents["C"] == null) ? "/" : this._state.parents["C"].getID();
        var p_d = (this._state.parents["D"] == null) ? "/" : this._state.parents["D"].getID();
        var p_e = (this._state.parents["E"] == null) ? "/" : this._state.parents["E"].getID();
        console.log("P_B => " + p_b);
        console.log("P_C => " + p_c);
        console.log("P_D => " + p_d);
        console.log("P_E => " + p_e);
        if (print_path) {
            var path = [];
            for (var i = 0; i < this._state.path.length; i++) {
                path.push(this._state.path[i].getID());
            }
            console.log("Path => " + path);
        }
        console.log("==========");
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
        var path = [];
        var node_id = node.getID();
        path.push(this._graph.getNodeById(node_id));
        while ((node_id != this._sink.getID()) && (node_id != this._source.getID())) {
            if (this._state.parents[node_id] == null) {
                return path;
            }
            node_id = this._state.parents[node_id].getID();
            path.push(this._graph.getNodeById(node_id));
        }
        return path;
    };
    MCMFBoykov.prototype.getBottleneckCapacity = function (path) {
        var min_capacity = 0;
        for (var i = 0; i < path.length - 1; i++) {
            var node_a = path[i];
            var node_b = path[i + 1];
            var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
            if (!i) {
                min_capacity = edge.getWeight();
                continue;
            }
            if (edge.getWeight() < min_capacity) {
                min_capacity = edge.getWeight();
            }
        }
        return min_capacity;
    };
    MCMFBoykov.prototype.grow = function () {
        console.log("///// GROW /////");
        while (Object.keys(this._state.activeNodes).length) {
            var activeNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
            var edges = (this.tree(activeNode) == "S") ? activeNode.outEdges() : activeNode.inEdges();
            for (var i = 0; i < Object.keys(edges).length; i++) {
                var edge = edges[(Object.keys(edges)[i])];
                var neighborNode = (this.tree(activeNode) == "S") ? edge.getNodes().b : edge.getNodes().a;
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
        console.log("///// AUGMENT /////");
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
        console.log("///// ADOPT /////");
        while (Object.keys(this._state.orphans).length) {
            var orphan = this._state.orphans[Object.keys(this._state.orphans)[0]];
            delete this._state.orphans[orphan.getID()];
            var edges = (this.tree(orphan) == "S") ? orphan.inEdges() : orphan.outEdges();
            var found = false;
            for (var i = 0; i < Object.keys(edges).length; i++) {
                var edge = edges[Object.keys(edges)[i]];
                var neighbor = (this.tree(orphan) == "S") ? edge.getNodes().a : edge.getNodes().b;
                if ((this.tree(orphan) == this.tree(neighbor)) && edge.getWeight()) {
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
            for (var i = 0; i < Object.keys(edges).length; i++) {
                var edge = edges[Object.keys(edges)[i]];
                var neighbor = (this.tree(orphan) == "S") ? edge.getNodes().a : edge.getNodes().b;
                if (this.tree(orphan) == this.tree(neighbor)) {
                    if (edge.getWeight()) {
                        this._state.activeNodes[neighbor.getID()] = neighbor;
                    }
                    if (this._state.parents[neighbor.getID()] == null) {
                        continue;
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
