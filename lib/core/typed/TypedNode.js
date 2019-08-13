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
Object.defineProperty(exports, "__esModule", { value: true });
var BaseNode_1 = require("../base/BaseNode");
var run_config_1 = require("../../config/run_config");
var Logger_1 = require("../../utils/Logger");
var logger = new Logger_1.Logger();
var TypedNode = (function (_super) {
    __extends(TypedNode, _super);
    function TypedNode(_id, config) {
        var _a;
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, _id, config) || this;
        _this._id = _id;
        _this._type = config.type || run_config_1.GENERIC_TYPES.Node;
        _this._typedAdjSets = (_a = {},
            _a[run_config_1.GENERIC_TYPES.Edge] = {
                ins: new Set(),
                outs: new Set(),
                conns: new Set()
            },
            _a);
        return _this;
    }
    Object.defineProperty(TypedNode.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    TypedNode.prototype.addEdge = function (edge) {
        if (!_super.prototype.addEdge.call(this, edge)) {
            return null;
        }
        var type = edge.type || run_config_1.GENERIC_TYPES.Edge;
        var dir = edge.isDirected();
        var uid = this.uniqueNID(edge);
        if (!this._typedAdjSets[type]) {
            this._typedAdjSets[type] = {};
        }
        if (!dir) {
            if (!this._typedAdjSets[type].conns) {
                this._typedAdjSets[type].conns = new Set();
            }
            this._typedAdjSets[type].conns.add(uid);
        }
        else if (edge.getNodes().a === this) {
            if (!this._typedAdjSets[type].outs) {
                this._typedAdjSets[type].outs = new Set();
            }
            this._typedAdjSets[type].outs.add(uid);
        }
        else {
            if (!this._typedAdjSets[type].ins) {
                this._typedAdjSets[type].ins = new Set();
            }
            this._typedAdjSets[type].ins.add(uid);
        }
        return edge;
    };
    TypedNode.prototype.removeEdge = function (edge) {
        _super.prototype.removeEdge.call(this, edge);
        var type = edge.type || run_config_1.GENERIC_TYPES.Edge;
        var dir = edge.isDirected();
        var uid = this.uniqueNID(edge);
        if (!dir) {
            this._typedAdjSets[type].conns.delete(uid);
        }
        else if (edge.getNodes().a === this) {
            this._typedAdjSets[type].outs.delete(uid);
        }
        else {
            this._typedAdjSets[type].ins.delete(uid);
        }
        if (type !== run_config_1.GENERIC_TYPES.Edge && this.noEdgesOfTypeLeft(type)) {
            delete this._typedAdjSets[type];
        }
    };
    TypedNode.prototype.removeEdgeByID = function (id) {
    };
    TypedNode.prototype.ins = function (type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].ins : undefined;
    };
    TypedNode.prototype.outs = function (type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].outs : undefined;
    };
    TypedNode.prototype.conns = function (type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].conns : undefined;
    };
    TypedNode.prototype.uniqueNID = function (e) {
        var conn = e.getNodes();
        var node = conn.a === this ? conn.b : conn.a;
        return node.id + "#" + e.id + "#" + (e.isWeighted() ? 'w' : 'u');
    };
    TypedNode.prototype.noEdgesOfTypeLeft = function (type) {
        return (!this._typedAdjSets[type].ins || !this._typedAdjSets[type].ins.size)
            && (!this._typedAdjSets[type].outs || !this._typedAdjSets[type].outs.size)
            && (!this._typedAdjSets[type].conns || !this._typedAdjSets[type].conns.size);
    };
    return TypedNode;
}(BaseNode_1.BaseNode));
exports.TypedNode = TypedNode;
