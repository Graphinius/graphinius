"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypedNode_1 = require("./TypedNode");
const TypedEdge_1 = require("./TypedEdge");
const BaseEdge_1 = require("../base/BaseEdge");
const BaseGraph_1 = require("../base/BaseGraph");
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
exports.GENERIC_TYPE = "GENERIC";
class TypedGraph extends BaseGraph_1.BaseGraph {
    constructor(_label) {
        super(_label);
        this._label = _label;
        this._typedNodes = new Map();
        this._typedEdges = new Map();
        this._typedNodes.set(exports.GENERIC_TYPE, new Map());
        this._typedEdges.set(exports.GENERIC_TYPE, new Map());
    }
    get typed() {
        return true;
    }
    nodeTypes() {
        return Array.from(this._typedNodes.keys());
    }
    edgeTypes() {
        return Array.from(this._typedEdges.keys());
    }
    nrTypedNodes(type) {
        type = type.toUpperCase();
        return this._typedNodes.get(type) ? this._typedNodes.get(type).size : null;
    }
    nrTypedEdges(type) {
        type = type.toUpperCase();
        return this._typedEdges.get(type) ? this._typedEdges.get(type).size : null;
    }
    addNodeByID(id, opts) {
        if (this.hasNodeID(id)) {
            throw new Error("Won't add node with duplicate ID.");
        }
        let node = new TypedNode_1.TypedNode(id, opts);
        return this.addNode(node) ? node : null;
    }
    addNode(node) {
        if (!super.addNode(node)) {
            return null;
        }
        const id = node.getID(), type = node.type ? node.type.toUpperCase() : null;
        if (!type) {
            this._typedNodes.get(exports.GENERIC_TYPE).set(id, node);
        }
        else {
            if (!this._typedNodes.get(type)) {
                this._typedNodes.set(type, new Map());
            }
            this._typedNodes.get(type).set(id, node);
        }
        return node;
    }
    deleteNode(node) {
        const id = node.getID(), type = node.type ? node.type.toUpperCase() : exports.GENERIC_TYPE;
        if (!this._typedNodes.get(type)) {
            throw Error('Node type does not exist on this TypedGraph.');
        }
        const removeNode = this._typedNodes.get(type).get(id);
        if (!removeNode) {
            throw Error('This particular node is nowhere to be found in its typed set.');
        }
        this._typedNodes.get(type).delete(id);
        if (this.nrTypedNodes(type) === 0) {
            this._typedNodes.delete(type);
        }
        super.deleteNode(node);
    }
    addEdgeByID(id, a, b, opts) {
        let edge = new TypedEdge_1.TypedEdge(id, a, b, opts || {});
        return this.addEdge(edge);
    }
    addEdge(edge) {
        if (!super.addEdge(edge)) {
            return null;
        }
        const id = edge.getID();
        let type = exports.GENERIC_TYPE;
        if (BaseEdge_1.BaseEdge.isTyped(edge) && edge.type) {
            type = edge.type.toUpperCase();
        }
        if (id === type) {
            this._typedEdges.get(exports.GENERIC_TYPE).set(id, edge);
        }
        else {
            if (!this._typedEdges.get(type)) {
                this._typedEdges.set(type, new Map());
            }
            this._typedEdges.get(type).set(id, edge);
        }
        return edge;
    }
    deleteEdge(edge) {
        const id = edge.getID();
        let type = exports.GENERIC_TYPE;
        if (BaseEdge_1.BaseEdge.isTyped(edge) && edge.type) {
            type = edge.type.toUpperCase();
        }
        if (!this._typedEdges.get(type)) {
            throw Error('Edge type does not exist on this TypedGraph.');
        }
        const removeEdge = this._typedEdges.get(type).get(id);
        if (!removeEdge) {
            throw Error('This particular edge is nowhere to be found in its typed set.');
        }
        this._typedEdges.get(type).delete(id);
        if (this.nrTypedEdges(type) === 0) {
            this._typedEdges.delete(type);
        }
        super.deleteEdge(edge);
    }
    getStats() {
        let typed_nodes = {}, typed_edges = {};
        this._typedNodes.forEach((k, v) => typed_nodes[v] = k.size);
        this._typedEdges.forEach((k, v) => typed_edges[v] = k.size);
        return Object.assign({}, super.getStats(), { typed_nodes,
            typed_edges });
    }
}
exports.TypedGraph = TypedGraph;
