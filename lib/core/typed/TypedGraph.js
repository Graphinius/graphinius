"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TypedNode_1 = require("./TypedNode");
var TypedEdge_1 = require("./TypedEdge");
var BaseEdge_1 = require("../base/BaseEdge");
var BaseGraph_1 = require("../base/BaseGraph");
var run_config_1 = require("../../config/run_config");
var TypedGraph = (function (_super) {
    __extends(TypedGraph, _super);
    function TypedGraph(_label) {
        var _this = _super.call(this, _label) || this;
        _this._label = _label;
        _this._typedNodes = new Map();
        _this._typedEdges = new Map();
        _this._type = run_config_1.GENERIC_TYPES.Graph;
        _this._typedNodes.set(run_config_1.GENERIC_TYPES.Node, new Map());
        _this._typedEdges.set(run_config_1.GENERIC_TYPES.Edge, new Map());
        return _this;
    }
    TypedGraph.prototype.n = function (id) {
        return this.getNodeById(id);
    };
    Object.defineProperty(TypedGraph.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    TypedGraph.prototype.nodeTypes = function () {
        return Array.from(this._typedNodes.keys());
    };
    TypedGraph.prototype.edgeTypes = function () {
        return Array.from(this._typedEdges.keys());
    };
    TypedGraph.prototype.nrTypedNodes = function (type) {
        type = type.toUpperCase();
        return this._typedNodes.get(type) ? this._typedNodes.get(type).size : null;
    };
    TypedGraph.prototype.nrTypedEdges = function (type) {
        type = type.toUpperCase();
        return this._typedEdges.get(type) ? this._typedEdges.get(type).size : null;
    };
    TypedGraph.prototype.ins = function (node, type) {
        var _this = this;
        return new Set(__spread(node.ins(type)).map(function (uid) { return _this.n(TypedNode_1.TypedNode.nIDFromUID(uid)); }));
    };
    TypedGraph.prototype.outs = function (node, type) {
        var _this = this;
        return new Set(__spread(node.outs(type)).map(function (uid) { return _this.n(TypedNode_1.TypedNode.nIDFromUID(uid)); }));
    };
    TypedGraph.prototype.conns = function (node, type) {
        var _this = this;
        return new Set(__spread(node.conns(type)).map(function (uid) { return _this.n(TypedNode_1.TypedNode.nIDFromUID(uid)); }));
    };
    TypedGraph.prototype.getNeighborsOfSet = function (nodes, dir, type) {
        var e_1, _a, e_2, _b;
        var resultSet = new Set();
        var nr_visits = 0, nodeRef;
        var tic = process.hrtime()[1];
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                if (resultSet.size >= this._nr_nodes) {
                    return resultSet;
                }
                var targets = node[dir](type);
                if (!targets) {
                    return new Set();
                }
                try {
                    for (var targets_1 = __values(targets), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
                        var target = targets_1_1.value;
                        nr_visits++;
                        nodeRef = this.n(TypedNode_1.TypedNode.nIDFromUID(target));
                        if (!nodes.has(nodeRef)) {
                            resultSet.add(nodeRef);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (targets_1_1 && !targets_1_1.done && (_b = targets_1.return)) _b.call(targets_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var toc = process.hrtime()[1];
        return resultSet;
    };
    TypedGraph.prototype.expandK = function (nodes, dir, type, k) {
        var e_3, _a;
        if (k < 0) {
            throw new Error('cowardly refusing to expand a negative number of steps.');
        }
        var resultSet = new Set();
        var periphery = nodes;
        k = k || this._nr_nodes;
        while (k-- || resultSet.size >= this._nr_nodes) {
            var otic = process.hrtime()[1];
            periphery = this.getNeighborsOfSet(periphery, dir, type);
            var old_size = resultSet.size;
            var tic = process.hrtime()[1];
            try {
                for (var periphery_1 = __values(periphery), periphery_1_1 = periphery_1.next(); !periphery_1_1.done; periphery_1_1 = periphery_1.next()) {
                    var target = periphery_1_1.value;
                    resultSet.add(target);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (periphery_1_1 && !periphery_1_1.done && (_a = periphery_1.return)) _a.call(periphery_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            var toc = process.hrtime()[1];
            if (old_size === resultSet.size) {
                break;
            }
            var otoc = process.hrtime()[1];
        }
        return resultSet;
    };
    TypedGraph.prototype.inHistT = function (nType, eType) {
        return this.degreeHistT(BaseGraph_1.DIR.in, nType, eType);
    };
    TypedGraph.prototype.outHistT = function (nType, eType) {
        return this.degreeHistT(BaseGraph_1.DIR.out, nType, eType);
    };
    TypedGraph.prototype.connHistT = function (nType, eType) {
        return this.degreeHistT(BaseGraph_1.DIR.conn, nType, eType);
    };
    TypedGraph.prototype.degreeHistT = function (dir, nType, eType) {
        var e_4, _a;
        var result = [];
        try {
            for (var _b = __values(this._typedNodes.get(nType)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), node_id = _d[0], node = _d[1];
                var deg = void 0;
                switch (dir) {
                    case BaseGraph_1.DIR.in:
                        deg = node.ins(eType) ? node.ins(eType).size : 0;
                        break;
                    case BaseGraph_1.DIR.out:
                        deg = node.outs(eType) ? node.outs(eType).size : 0;
                        break;
                    default:
                        deg = node.conns(eType) ? node.conns(eType).size : 0;
                }
                if (!result[deg]) {
                    result[deg] = new Set([node]);
                }
                else {
                    result[deg].add(node);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    TypedGraph.prototype.addNodeByID = function (id, opts) {
        if (this.hasNodeID(id)) {
            throw new Error("Won't add node with duplicate ID.");
        }
        var node = new TypedNode_1.TypedNode(id, opts);
        return this.addNode(node) ? node : null;
    };
    TypedGraph.prototype.addNode = function (node) {
        if (!_super.prototype.addNode.call(this, node)) {
            return null;
        }
        var id = node.getID(), type = node.type ? node.type.toUpperCase() : null;
        if (!type) {
            this._typedNodes.get(run_config_1.GENERIC_TYPES.Node).set(id, node);
        }
        else {
            if (!this._typedNodes.get(type)) {
                this._typedNodes.set(type, new Map());
            }
            this._typedNodes.get(type).set(id, node);
        }
        return node;
    };
    TypedGraph.prototype.getNodeById = function (id) {
        return _super.prototype.getNodeById.call(this, id);
    };
    TypedGraph.prototype.getNodesT = function (type) {
        return this._typedNodes.get(type.toUpperCase());
    };
    TypedGraph.prototype.getEdgesT = function (type) {
        return this._typedEdges.get(type.toUpperCase());
    };
    TypedGraph.prototype.deleteNode = function (node) {
        var id = node.getID(), type = node.type ? node.type.toUpperCase() : run_config_1.GENERIC_TYPES.Node;
        if (!this._typedNodes.get(type)) {
            throw Error('Node type does not exist on this TypedGraph.');
        }
        var removeNode = this._typedNodes.get(type).get(id);
        if (!removeNode) {
            throw Error('This particular node is nowhere to be found in its typed set.');
        }
        this._typedNodes.get(type).delete(id);
        if (this.nrTypedNodes(type) === 0) {
            this._typedNodes.delete(type);
        }
        _super.prototype.deleteNode.call(this, node);
    };
    TypedGraph.prototype.addEdgeByID = function (id, a, b, opts) {
        var edge = new TypedEdge_1.TypedEdge(id, a, b, opts || {});
        return this.addEdge(edge);
    };
    TypedGraph.prototype.addEdge = function (edge) {
        if (!_super.prototype.addEdge.call(this, edge)) {
            return null;
        }
        var id = edge.getID();
        var type = run_config_1.GENERIC_TYPES.Edge;
        if (BaseEdge_1.BaseEdge.isTyped(edge) && edge.type) {
            type = edge.type.toUpperCase();
        }
        if (id === type) {
            this._typedEdges.get(run_config_1.GENERIC_TYPES.Edge).set(id, edge);
        }
        else {
            if (!this._typedEdges.get(type)) {
                this._typedEdges.set(type, new Map());
            }
            this._typedEdges.get(type).set(id, edge);
        }
        return edge;
    };
    TypedGraph.prototype.deleteEdge = function (edge) {
        var id = edge.getID();
        var type = run_config_1.GENERIC_TYPES.Edge;
        if (BaseEdge_1.BaseEdge.isTyped(edge) && edge.type) {
            type = edge.type.toUpperCase();
        }
        if (!this._typedEdges.get(type)) {
            throw Error('Edge type does not exist on this TypedGraph.');
        }
        var removeEdge = this._typedEdges.get(type).get(id);
        if (!removeEdge) {
            throw Error('This particular edge is nowhere to be found in its typed set.');
        }
        this._typedEdges.get(type).delete(id);
        if (this.nrTypedEdges(type) === 0) {
            this._typedEdges.delete(type);
        }
        _super.prototype.deleteEdge.call(this, edge);
    };
    TypedGraph.prototype.getStats = function () {
        var typed_nodes = {}, typed_edges = {};
        this._typedNodes.forEach(function (k, v) { return typed_nodes[v] = k.size; });
        this._typedEdges.forEach(function (k, v) { return typed_edges[v] = k.size; });
        return __assign({}, _super.prototype.getStats.call(this), { typed_nodes: typed_nodes,
            typed_edges: typed_edges });
    };
    return TypedGraph;
}(BaseGraph_1.BaseGraph));
exports.TypedGraph = TypedGraph;
