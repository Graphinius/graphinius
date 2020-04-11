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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
Object.defineProperty(exports, "__esModule", { value: true });
var BaseNode_1 = require("../base/BaseNode");
var run_config_1 = require("../../config/run_config");
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
    Object.defineProperty(TypedNode.prototype, "stats", {
        get: function () {
            var e_1, _a;
            var result = {
                typed_edges: {}
            };
            try {
                for (var _b = __values(Object.keys(this._typedAdjSets)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var type = _c.value;
                    result.typed_edges[type] = { ins: 0, outs: 0, conns: 0 };
                    result.typed_edges[type].ins = this._typedAdjSets[type].ins ? this._typedAdjSets[type].ins.size : 0;
                    result.typed_edges[type].outs = this._typedAdjSets[type].outs ? this._typedAdjSets[type].outs.size : 0;
                    result.typed_edges[type].conns = this._typedAdjSets[type].conns ? this._typedAdjSets[type].conns.size : 0;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
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
    TypedNode.prototype.ins = function (type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].ins : undefined;
    };
    TypedNode.prototype.outs = function (type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].outs : undefined;
    };
    TypedNode.prototype.unds = function (type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].conns : undefined;
    };
    TypedNode.prototype.all = function (type) {
        var result = new Set();
        if (this._typedAdjSets[type]) {
            this._typedAdjSets[type].ins && result.add(__spread(this._typedAdjSets[type].ins));
            this._typedAdjSets[type].outs && result.add(__spread(this._typedAdjSets[type].outs));
            this._typedAdjSets[type].conns && result.add(__spread(this._typedAdjSets[type].conns));
        }
        return result;
    };
    TypedNode.prototype.uniqueNID = function (e) {
        var _a = e.getNodes(), a = _a.a, b = _a.b;
        var node = a === this ? b : a;
        var string = node.id + "#" + e.id + "#";
        string += e.isWeighted() ? 'w#' + e.getWeight() : 'u';
        return string;
    };
    TypedNode.nIDFromUID = function (uid) {
        return uid.split('#')[0];
    };
    TypedNode.prototype.noEdgesOfTypeLeft = function (type) {
        return (!this._typedAdjSets[type].ins || !this._typedAdjSets[type].ins.size)
            && (!this._typedAdjSets[type].outs || !this._typedAdjSets[type].outs.size)
            && (!this._typedAdjSets[type].conns || !this._typedAdjSets[type].conns.size);
    };
    return TypedNode;
}(BaseNode_1.BaseNode));
exports.TypedNode = TypedNode;
