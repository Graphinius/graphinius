"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $N = require("./BaseNode");
var BaseEdge = (function () {
    function BaseEdge(_id, _node_a, _node_b, config) {
        this._id = _id;
        this._node_a = _node_a;
        this._node_b = _node_b;
        if (!(_node_a instanceof $N.BaseNode) || !(_node_b instanceof $N.BaseNode)) {
            throw new Error("cannot instantiate edge without two valid node objects");
        }
        config = config || {};
        this._directed = config.directed || false;
        this._weighted = config.weighted || false;
        this._weight = this._weighted ? (isNaN(config.weight) ? 1 : config.weight) : undefined;
        this._label = config.label || this._id;
    }
    Object.defineProperty(BaseEdge.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEdge.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    BaseEdge.prototype.getID = function () {
        return this._id;
    };
    BaseEdge.prototype.getLabel = function () {
        return this._label;
    };
    BaseEdge.prototype.setLabel = function (label) {
        this._label = label;
    };
    BaseEdge.prototype.isDirected = function () {
        return this._directed;
    };
    BaseEdge.prototype.isWeighted = function () {
        return this._weighted;
    };
    BaseEdge.prototype.getWeight = function () {
        return this._weight;
    };
    BaseEdge.prototype.setWeight = function (w) {
        if (!this._weighted) {
            throw new Error("Cannot set weight on unweighted edge.");
        }
        this._weight = w;
    };
    BaseEdge.prototype.getNodes = function () {
        return { a: this._node_a, b: this._node_b };
    };
    BaseEdge.prototype.clone = function (new_node_a, new_node_b) {
        if (!(new_node_a instanceof $N.BaseNode) || !(new_node_b instanceof $N.BaseNode)) {
            throw new Error("refusing to clone edge if any new node is invalid");
        }
        return new BaseEdge(this._id, new_node_a, new_node_b, {
            directed: this._directed,
            weighted: this._weighted,
            weight: this._weight,
            label: this._label
        });
    };
    BaseEdge.isTyped = function (arg) {
        return !!arg.type;
    };
    return BaseEdge;
}());
exports.BaseEdge = BaseEdge;
