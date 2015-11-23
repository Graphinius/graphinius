var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseEdge = (function () {
    function BaseEdge(_id, _node_a, _node_b, _directed) {
        this._id = _id;
        this._node_a = _node_a;
        this._node_b = _node_b;
        this._directed = _directed;
        this._is_weighted = false;
    }
    BaseEdge.prototype.isWeighted = function () {
        return this._is_weighted;
    };
    return BaseEdge;
})();
exports.BaseEdge = BaseEdge;
var WeightedEdge = (function (_super) {
    __extends(WeightedEdge, _super);
    function WeightedEdge(_id, _node_a, _node_b, _directed, _weight) {
        if (_weight === void 0) { _weight = 0; }
        _super.call(this, _id, _node_a, _node_b, _directed);
        this._weight = _weight;
        this._is_weighted = true;
    }
    return WeightedEdge;
})(BaseEdge);
exports.WeightedEdge = WeightedEdge;
