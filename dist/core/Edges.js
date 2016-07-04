"use strict";
var BaseEdge = (function () {
    function BaseEdge(_id, _node_a, _node_b, options) {
        this._id = _id;
        this._node_a = _node_a;
        this._node_b = _node_b;
        options = options || {};
        this._directed = options.directed || false;
        this._weighted = options.weighted || false;
        this._weight = this._weighted ? (isNaN(options.weight) ? 1 : options.weight) : undefined;
        this._label = options.label || this._id;
    }
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
    return BaseEdge;
}());
exports.BaseEdge = BaseEdge;
