"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../../utils/StructUtils");
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
class BaseNode {
    constructor(_id, config = {}) {
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
    static isTyped(arg) {
        return !!arg.type;
    }
    get id() {
        return this._id;
    }
    get label() {
        return this._label;
    }
    get features() {
        return this._features;
    }
    getID() {
        return this._id;
    }
    getLabel() {
        return this._label;
    }
    setLabel(label) {
        this._label = label;
    }
    getFeatures() {
        return this._features;
    }
    getFeature(key) {
        return this._features[key];
    }
    setFeatures(features) {
        this._features = $SU.clone(features);
    }
    setFeature(key, value) {
        this._features[key] = value;
    }
    deleteFeature(key) {
        let feat = this._features[key];
        delete this._features[key];
        return feat;
    }
    clearFeatures() {
        this._features = {};
    }
    inDegree() {
        return this._in_degree;
    }
    outDegree() {
        return this._out_degree;
    }
    degree() {
        return this._und_degree;
    }
    addEdge(edge) {
        let nodes = edge.getNodes();
        if (nodes.a !== this && nodes.b !== this) {
            throw new Error("Cannot add edge that does not connect to this node");
        }
        let edgeID = edge.getID();
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
    }
    hasEdge(edge) {
        return !!this._in_edges[edge.getID()] || !!this._out_edges[edge.getID()] || !!this._und_edges[edge.getID()];
    }
    hasEdgeID(id) {
        return !!this._in_edges[id] || !!this._out_edges[id] || !!this._und_edges[id];
    }
    getEdge(id) {
        let edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
        if (!edge) {
            throw new Error("Cannot retrieve non-existing edge.");
        }
        return edge;
    }
    inEdges() {
        return this._in_edges;
    }
    outEdges() {
        return this._out_edges;
    }
    undEdges() {
        return this._und_edges;
    }
    dirEdges() {
        return $SU.mergeObjects([this._in_edges, this._out_edges]);
    }
    allEdges() {
        return $SU.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
    }
    removeEdge(edge) {
        if (!this.hasEdge(edge)) {
            throw new Error("Cannot remove unconnected edge.");
        }
        let id = edge.getID();
        let e = this._und_edges[id];
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
    }
    removeEdgeByID(id) {
        if (!this.hasEdgeID(id)) {
            throw new Error("Cannot remove unconnected edge.");
        }
        let e = this._und_edges[id];
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
    }
    clearOutEdges() {
        this._out_edges = {};
        this._out_degree = 0;
    }
    clearInEdges() {
        this._in_edges = {};
        this._in_degree = 0;
    }
    clearUndEdges() {
        this._und_edges = {};
        this._und_degree = 0;
    }
    clearEdges() {
        this.clearInEdges();
        this.clearOutEdges();
        this.clearUndEdges();
    }
    prevNodes() {
        let prevs = [];
        let key, edge;
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
    }
    nextNodes() {
        let nexts = [];
        let key, edge;
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
    }
    connNodes() {
        let conns = [];
        let key, edge;
        for (key in this._und_edges) {
            if (this._und_edges.hasOwnProperty(key)) {
                edge = this._und_edges[key];
                let nodes = edge.getNodes();
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
    }
    reachNodes(identityFunc) {
        let identity = 0;
        return $SU.mergeArrays([this.nextNodes(), this.connNodes()], identityFunc || (ne => identity++));
    }
    allNeighbors(identityFunc) {
        let identity = 0;
        return $SU.mergeArrays([this.prevNodes(), this.nextNodes(), this.connNodes()], identityFunc || function (ne) { return identity++; });
    }
    clone() {
        let new_node = new BaseNode(this._id);
        new_node._label = this._label;
        new_node.setFeatures($SU.clone(this.getFeatures()));
        return new_node;
    }
}
exports.BaseNode = BaseNode;
