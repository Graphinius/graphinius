"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var interfaces_1 = require("../interfaces");
var BaseEdge_1 = require("../../core/base/BaseEdge");
var BaseNode_1 = require("../../core/base/BaseNode");
var BaseGraph_1 = require("../../core/base/BaseGraph");
var startChar = 64;
var JSONOutput = (function () {
    function JSONOutput() {
    }
    JSONOutput.prototype.constructTypeRLUT = function (g) {
        var e_1, _a, e_2, _b;
        var nchar = startChar;
        var echar = startChar;
        var lut = {
            nodes: {},
            edges: {}
        };
        var rlut = {
            nodes: {},
            edges: {}
        };
        var ntypes = g.nodeTypes();
        try {
            for (var ntypes_1 = __values(ntypes), ntypes_1_1 = ntypes_1.next(); !ntypes_1_1.done; ntypes_1_1 = ntypes_1.next()) {
                var t = ntypes_1_1.value;
                lut.nodes[t] = String.fromCharCode(nchar);
                rlut.nodes[String.fromCharCode(nchar++)] = t;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (ntypes_1_1 && !ntypes_1_1.done && (_a = ntypes_1.return)) _a.call(ntypes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var etypes = g.edgeTypes();
        try {
            for (var etypes_1 = __values(etypes), etypes_1_1 = etypes_1.next(); !etypes_1_1.done; etypes_1_1 = etypes_1.next()) {
                var t = etypes_1_1.value;
                lut.edges[t] = String.fromCharCode(echar);
                rlut.edges[String.fromCharCode(echar++)] = t;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (etypes_1_1 && !etypes_1_1.done && (_b = etypes_1.return)) _b.call(etypes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return [lut, rlut];
    };
    JSONOutput.prototype.writeToJSONFile = function (filepath, graph) {
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToJSONString(graph));
    };
    JSONOutput.prototype.writeToJSONString = function (graph) {
        var _a, _b, _c, _d;
        var lut = null;
        var rlt = null;
        var nodes, node, node_struct, und_edges, dir_edges, edge, coords;
        var result = {
            name: graph.label,
            nodes: graph.nrNodes(),
            dir_e: graph.nrDirEdges(),
            und_e: graph.nrUndEdges(),
            data: {}
        };
        if (BaseGraph_1.BaseGraph.isTyped(graph)) {
            _a = __read(this.constructTypeRLUT(graph), 2), lut = _a[0], rlt = _a[1];
        }
        if (rlt) {
            result['typeRLT'] = rlt;
        }
        nodes = graph.getNodes();
        for (var node_key in nodes) {
            node = nodes[node_key];
            node_struct = result.data[node.getID()] = (_b = {},
                _b[interfaces_1.labelKeys.edges] = [],
                _b);
            if (node.getID() !== node.getLabel()) {
                node_struct[interfaces_1.labelKeys.n_label] = node.label;
            }
            if (BaseNode_1.BaseNode.isTyped(node)) {
                node_struct[interfaces_1.labelKeys.n_type] = lut && lut.nodes[node.type];
            }
            und_edges = node.undEdges();
            for (var edge_key in und_edges) {
                edge = und_edges[edge_key];
                var endPoints = edge.getNodes();
                var edgeStruct = (_c = {},
                    _c[interfaces_1.labelKeys.e_to] = endPoints.a.getID() === node.getID() ? endPoints.b.getID() : endPoints.a.getID(),
                    _c[interfaces_1.labelKeys.e_dir] = edge.isDirected() ? 1 : 0,
                    _c[interfaces_1.labelKeys.e_weight] = JSONOutput.handleEdgeWeight(edge),
                    _c);
                if (edge.getID() !== edge.getLabel()) {
                    edgeStruct[interfaces_1.labelKeys.e_label] = edge.getLabel();
                }
                if (BaseEdge_1.BaseEdge.isTyped(edge)) {
                    edgeStruct[interfaces_1.labelKeys.e_type] = lut && lut.edges[edge.type];
                }
                node_struct[interfaces_1.labelKeys.edges].push(edgeStruct);
            }
            dir_edges = node.outEdges();
            for (var edge_key in dir_edges) {
                edge = dir_edges[edge_key];
                var endPoints = edge.getNodes();
                var edgeStruct = (_d = {},
                    _d[interfaces_1.labelKeys.e_to] = endPoints.b.getID(),
                    _d[interfaces_1.labelKeys.e_dir] = edge.isDirected() ? 1 : 0,
                    _d[interfaces_1.labelKeys.e_weight] = JSONOutput.handleEdgeWeight(edge),
                    _d);
                if (edge.getID() !== edge.getLabel()) {
                    edgeStruct[interfaces_1.labelKeys.e_label] = edge.getLabel();
                }
                if (BaseEdge_1.BaseEdge.isTyped(edge)) {
                    edgeStruct[interfaces_1.labelKeys.e_type] = lut && lut.edges[edge.type];
                }
                node_struct[interfaces_1.labelKeys.edges].push(edgeStruct);
            }
            node_struct[interfaces_1.labelKeys.n_features] = node.getFeatures();
            if ((coords = node.getFeature(interfaces_1.labelKeys.coords)) != null) {
                node_struct[interfaces_1.labelKeys.coords] = coords;
            }
        }
        return JSON.stringify(result);
    };
    JSONOutput.handleEdgeWeight = function (edge) {
        if (!edge.isWeighted()) {
            return undefined;
        }
        switch (edge.getWeight()) {
            case Number.POSITIVE_INFINITY:
                return 'Infinity';
            case Number.NEGATIVE_INFINITY:
                return '-Infinity';
            case Number.MAX_VALUE:
                return 'MAX';
            case Number.MIN_VALUE:
                return 'MIN';
            default:
                return edge.getWeight();
        }
    };
    return JSONOutput;
}());
exports.JSONOutput = JSONOutput;
