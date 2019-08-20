"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../../utils/StructUtils");
var BaseNode = (function () {
    function BaseNode(_id, config) {
        if (config === void 0) { config = {}; }
        this._id = _id;
        this._in_degree = 0;
        this._out_degree = 0;
        this._und_degree = 0;
        this._in_edges = {};
        this._out_edges = {};
        this._und_edges = {};
        this._label = config.label || _id;
        this._features = config.features != null ? $SU.clone(config.features) : {};
    }
    BaseNode.isTyped = function (arg) {
        return !!arg.type;
    };
    Object.defineProperty(BaseNode.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseNode.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseNode.prototype, "features", {
        get: function () {
            return this._features;
        },
        enumerable: true,
        configurable: true
    });
    BaseNode.prototype.getID = function () {
        return this._id;
    };
    BaseNode.prototype.getLabel = function () {
        return this._label;
    };
    BaseNode.prototype.setLabel = function (label) {
        this._label = label;
    };
    BaseNode.prototype.getFeatures = function () {
        return this._features;
    };
    BaseNode.prototype.getFeature = function (key) {
        return this._features[key];
    };
    BaseNode.prototype.setFeatures = function (features) {
        this._features = $SU.clone(features);
    };
    BaseNode.prototype.setFeature = function (key, value) {
        this._features[key] = value;
    };
    BaseNode.prototype.deleteFeature = function (key) {
        var feat = this._features[key];
        delete this._features[key];
        return feat;
    };
    BaseNode.prototype.clearFeatures = function () {
        this._features = {};
    };
    BaseNode.prototype.inDegree = function () {
        return this._in_degree;
    };
    BaseNode.prototype.outDegree = function () {
        return this._out_degree;
    };
    BaseNode.prototype.degree = function () {
        return this._und_degree;
    };
    BaseNode.prototype.addEdge = function (edge) {
        var nodes = edge.getNodes();
        if (nodes.a !== this && nodes.b !== this) {
            throw new Error("Cannot add edge that does not connect to this node");
        }
        var edgeID = edge.getID();
        if (edge.isDirected()) {
            if (nodes.a === this && !this._out_edges[edgeID]) {
                this._out_edges[edgeID] = edge;
                this._out_degree += 1;
                if (nodes.b === this && !this._in_edges[edgeID]) {
                    this._in_edges[edgeID] = edge;
                    this._in_degree += 1;
                }
            }
            else if (!this._in_edges[edgeID]) {
                this._in_edges[edgeID] = edge;
                this._in_degree += 1;
            }
        }
        else {
            if (this._und_edges[edge.getID()]) {
                throw new Error("Cannot add same undirected edge multiple times.");
            }
            this._und_edges[edge.getID()] = edge;
            this._und_degree += 1;
        }
        return edge;
    };
    BaseNode.prototype.hasEdge = function (edge) {
        return !!this._in_edges[edge.getID()] || !!this._out_edges[edge.getID()] || !!this._und_edges[edge.getID()];
    };
    BaseNode.prototype.hasEdgeID = function (id) {
        return !!this._in_edges[id] || !!this._out_edges[id] || !!this._und_edges[id];
    };
    BaseNode.prototype.getEdge = function (id) {
        var edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
        if (!edge) {
            throw new Error("Cannot retrieve non-existing edge.");
        }
        return edge;
    };
    BaseNode.prototype.inEdges = function () {
        return this._in_edges;
    };
    BaseNode.prototype.outEdges = function () {
        return this._out_edges;
    };
    BaseNode.prototype.undEdges = function () {
        return this._und_edges;
    };
    BaseNode.prototype.dirEdges = function () {
        return $SU.mergeObjects([this._in_edges, this._out_edges]);
    };
    BaseNode.prototype.allEdges = function () {
        return $SU.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
    };
    BaseNode.prototype.removeEdge = function (edge) {
        if (!this.hasEdge(edge)) {
            throw new Error("Cannot remove unconnected edge.");
        }
        var id = edge.getID();
        var e = this._und_edges[id];
        if (e) {
            delete this._und_edges[id];
            this._und_degree -= 1;
        }
        e = this._in_edges[id];
        if (e) {
            delete this._in_edges[id];
            this._in_degree -= 1;
        }
        e = this._out_edges[id];
        if (e) {
            delete this._out_edges[id];
            this._out_degree -= 1;
        }
    };
    BaseNode.prototype.removeEdgeByID = function (id) {
        if (!this.hasEdgeID(id)) {
            throw new Error("Cannot remove unconnected edge.");
        }
        var e = this._und_edges[id];
        if (e) {
            delete this._und_edges[id];
            this._und_degree -= 1;
        }
        e = this._in_edges[id];
        if (e) {
            delete this._in_edges[id];
            this._in_degree -= 1;
        }
        e = this._out_edges[id];
        if (e) {
            delete this._out_edges[id];
            this._out_degree -= 1;
        }
    };
    BaseNode.prototype.clearOutEdges = function () {
        this._out_edges = {};
        this._out_degree = 0;
    };
    BaseNode.prototype.clearInEdges = function () {
        this._in_edges = {};
        this._in_degree = 0;
    };
    BaseNode.prototype.clearUndEdges = function () {
        this._und_edges = {};
        this._und_degree = 0;
    };
    BaseNode.prototype.clearEdges = function () {
        this.clearInEdges();
        this.clearOutEdges();
        this.clearUndEdges();
    };
    BaseNode.prototype.prevNodes = function () {
        var prevs = [];
        var key, edge;
        for (key in this._in_edges) {
            if (this._in_edges.hasOwnProperty(key)) {
                edge = this._in_edges[key];
                prevs.push({
                    node: edge.getNodes().a,
                    edge: edge
                });
            }
        }
        return prevs;
    };
    BaseNode.prototype.nextNodes = function () {
        var nexts = [];
        var key, edge;
        for (key in this._out_edges) {
            if (this._out_edges.hasOwnProperty(key)) {
                edge = this._out_edges[key];
                nexts.push({
                    node: edge.getNodes().b,
                    edge: edge
                });
            }
        }
        return nexts;
    };
    BaseNode.prototype.connNodes = function () {
        var conns = [];
        var key, edge;
        for (key in this._und_edges) {
            if (this._und_edges.hasOwnProperty(key)) {
                edge = this._und_edges[key];
                var nodes = edge.getNodes();
                if (nodes.a === this) {
                    conns.push({
                        node: edge.getNodes().b,
                        edge: edge
                    });
                }
                else {
                    conns.push({
                        node: edge.getNodes().a,
                        edge: edge
                    });
                }
            }
        }
        return conns;
    };
    BaseNode.prototype.reachNodes = function (identityFunc) {
        var identity = 0;
        return $SU.mergeArrays([this.nextNodes(), this.connNodes()], identityFunc || (function (ne) { return identity++; }));
    };
    BaseNode.prototype.allNeighbors = function (identityFunc) {
        var identity = 0;
        return $SU.mergeArrays([this.prevNodes(), this.nextNodes(), this.connNodes()], identityFunc || function (ne) { return identity++; });
    };
    BaseNode.prototype.clone = function () {
        var new_node = new BaseNode(this._id);
        new_node._label = this._label;
        new_node.setFeatures($SU.clone(this.getFeatures()));
        return new_node;
    };
    return BaseNode;
}());
exports.BaseNode = BaseNode;
