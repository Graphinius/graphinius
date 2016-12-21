"use strict";
var MCMFBoykov = (function () {
    function MCMFBoykov(_graph, _source, _sink, config) {
        this._graph = _graph;
        this._source = _source;
        this._sink = _sink;
        this._state = {
            activeNodes: {},
            orphans: {},
            treeS: {},
            treeT: {},
            parents: {},
            path: []
        };
        this._config = config || this.prepareMCMFStandardConfig();
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
    MCMFBoykov.prototype.grow = function () {
        while (Object.keys(this._state.activeNodes).length) {
            var activeNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
            var neighbors = activeNode.reachNodes();
            for (var i = 0; i < neighbors.length; i++) {
                var neighborNode = neighbors[i].node;
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
    MCMFBoykov.prototype.prepareMCMFStandardConfig = function () {
        return {
            directed: true
        };
    };
    return MCMFBoykov;
}());
exports.MCMFBoykov = MCMFBoykov;
