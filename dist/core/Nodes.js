"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
var BaseNode = /** @class */ (function () {
    function BaseNode(_id, features) {
        this._id = _id;
        this._in_degree = 0;
        this._out_degree = 0;
        this._und_degree = 0;
        this._in_edges = {};
        this._out_edges = {};
        this._und_edges = {};
        this._features = typeof features !== 'undefined' ? $SU.clone(features) : {};
        this._label = this._features["label"] || this._id;
    }
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
        // if ( !feat ) {
        // 	throw new Error("Cannot retrieve non-existing feature.");
        // }
        // return feat;
    };
    BaseNode.prototype.setFeatures = function (features) {
        this._features = $SU.clone(features);
    };
    BaseNode.prototype.setFeature = function (key, value) {
        this._features[key] = value;
    };
    BaseNode.prototype.deleteFeature = function (key) {
        var feat = this._features[key];
        // if ( !feat ) {
        // 	throw new Error("Cannot delete non-existing feature.");
        // }
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
    /**
     * We have to:
     * 1. throw an error if the edge is already attached
     * 2. add it to the edge array
     * 3. check type of edge (directed / undirected)
     * 4. update our degrees accordingly
     * This is a design decision we can defend by pointing out
     * that querying degrees will occur much more often
     * than modifying the edge structure of a node (??)
     * One further point: do we also check for duplicate
     * edges not in the sense of duplicate ID's but duplicate
     * structure (nodes, direction) ?
     * => Not for now, as we would have to check every edge
     * instead of simply checking the hash id...
     * ALTHOUGH: adding edges will (presumably) not occur often...
     */
    BaseNode.prototype.addEdge = function (edge) {
        // is this edge connected to us at all?
        var nodes = edge.getNodes();
        if (nodes.a !== this && nodes.b !== this) {
            throw new Error("Cannot add edge that does not connect to this node");
        }
        var edge_id = edge.getID();
        // Is it an undirected or directed edge?
        if (edge.isDirected()) {
            // is it outgoing or incoming?
            if (nodes.a === this && !this._out_edges[edge_id]) {
                this._out_edges[edge_id] = edge;
                this._out_degree += 1;
                // Is the edge also connecting to ourselves -> loop ?
                if (nodes.b === this && !this._in_edges[edge_id]) {
                    this._in_edges[edge.getID()] = edge;
                    this._in_degree += 1;
                }
            }
            else if (!this._in_edges[edge_id]) { // nodes.b === this
                this._in_edges[edge.getID()] = edge;
                this._in_degree += 1;
            }
        }
        else {
            // Is the edge also connecting to ourselves -> loop
            if (this._und_edges[edge.getID()]) {
                throw new Error("Cannot add same undirected edge multiple times.");
            }
            this._und_edges[edge.getID()] = edge;
            this._und_degree += 1;
        }
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
    BaseNode.prototype.removeEdgeID = function (id) {
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
    /**
     *
     * @param identityFunc can be used to remove 'duplicates' from resulting array,
     * if necessary
     * @returns {Array}
     *
   */
    BaseNode.prototype.reachNodes = function (identityFunc) {
        var identity = 0;
        // console.log(this.nextNodes());
        return $SU.mergeArrays([this.nextNodes(), this.connNodes()], identityFunc || function (ne) { return identity++; });
    };
    BaseNode.prototype.clone = function () {
        var new_node = new BaseNode(this._id);
        new_node.setFeatures(this.getFeatures());
        return new_node;
    };
    return BaseNode;
}());
exports.BaseNode = BaseNode;
