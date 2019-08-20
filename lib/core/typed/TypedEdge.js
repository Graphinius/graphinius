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
var BaseEdge_1 = require("../base/BaseEdge");
var run_config_1 = require("../../config/run_config");
var TypedEdge = (function (_super) {
    __extends(TypedEdge, _super);
    function TypedEdge(_id, _node_a, _node_b, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, _id, _node_a, _node_b, config) || this;
        _this._id = _id;
        _this._node_a = _node_a;
        _this._node_b = _node_b;
        _this._type = config.type || run_config_1.GENERIC_TYPES.Edge;
        return _this;
    }
    Object.defineProperty(TypedEdge.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return TypedEdge;
}(BaseEdge_1.BaseEdge));
exports.TypedEdge = TypedEdge;
