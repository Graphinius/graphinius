"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("../base/BaseNode");
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
const GENERIC_TYPE = 'GENERIC';
class TypedNode extends BaseNode_1.BaseNode {
    constructor(_id, config = {}) {
        super(_id, config);
        this._id = _id;
        this._type = config.type;
        this._typedAdjSets = {
            [GENERIC_TYPE]: {
                ins: new Set(),
                outs: new Set(),
                conns: new Set()
            }
        };
    }
    get type() {
        return this._type;
    }
    get typed() {
        return true;
    }
    uniqueNID(e) {
        const conn = e.getNodes();
        const other = conn.a === this ? conn.b : conn.a;
        return `${other.id}#${e.id}#${e.isWeighted() ? 'w' : 'u'}`;
    }
    addEdge(edge) {
        if (!super.addEdge(edge)) {
            return null;
        }
        const type = edge.type || GENERIC_TYPE;
        const dir = edge.isDirected();
        const uid = this.uniqueNID(edge);
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
        logger.log(this._typedAdjSets);
        return edge;
    }
    removeEdge(edge) {
        return super.removeEdge(edge);
    }
    removeEdgeByID(id) {
    }
    ins(type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].ins : undefined;
    }
    outs(type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].outs : undefined;
    }
    conns(type) {
        return this._typedAdjSets[type] ? this._typedAdjSets[type].conns : undefined;
    }
}
exports.TypedNode = TypedNode;
