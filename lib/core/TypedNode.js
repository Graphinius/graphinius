"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("./base/BaseNode");
const Logger_1 = require("../utils/Logger");
const logger = new Logger_1.Logger();
const typedAdjList = {
    FRIENDS_WITH: {
        und: new Set([0, 3]),
    },
    MEMBER_OF: {
        out: new Set([1, 4])
    },
    LIKED_BY: {
        in: new Set([2, 5])
    }
};
class TypedNode extends BaseNode_1.BaseNode {
    constructor(_id, config = {}) {
        super(_id, config);
        this._id = _id;
        this._type = config.type;
    }
    get type() {
        return this._type;
    }
}
exports.TypedNode = TypedNode;
