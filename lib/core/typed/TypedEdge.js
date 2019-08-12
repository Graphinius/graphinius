"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEdge_1 = require("../base/BaseEdge");
const run_config_1 = require("../../config/run_config");
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
class TypedEdge extends BaseEdge_1.BaseEdge {
    constructor(_id, _node_a, _node_b, config = {}) {
        super(_id, _node_a, _node_b, config);
        this._id = _id;
        this._node_a = _node_a;
        this._node_b = _node_b;
        this._type = config.type || run_config_1.GENERIC_TYPES.EDGE;
    }
    get type() {
        return this._type;
    }
}
exports.TypedEdge = TypedEdge;
