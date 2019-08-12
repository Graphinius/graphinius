"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("../base/BaseNode");
const run_config_1 = require("../../config/run_config");
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
class TypedNode extends BaseNode_1.BaseNode {
    constructor(_id, config = {}) {
        super(_id, config);
        this._id = _id;
        this._type = config.type || run_config_1.GENERIC_TYPES.Node;
        this._typedAdjSets = {
            [run_config_1.GENERIC_TYPES.Edge]: {
                ins: new Set(),
                outs: new Set(),
                conns: new Set()
            }
        };
    }
    get type() {
        return this._type;
    }
    addEdge(edge) {
        if (!super.addEdge(edge)) {
            return null;
        }
        const type = edge.type || run_config_1.GENERIC_TYPES.Edge;
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
        return edge;
    }
    removeEdge(edge) {
        super.removeEdge(edge);
        const type = edge.type || run_config_1.GENERIC_TYPES.Edge;
        const dir = edge.isDirected();
        const uid = this.uniqueNID(edge);
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
    uniqueNID(e) {
        const conn = e.getNodes();
        const node = conn.a === this ? conn.b : conn.a;
        return `${node.id}#${e.id}#${e.isWeighted() ? 'w' : 'u'}`;
    }
    noEdgesOfTypeLeft(type) {
        return (!this._typedAdjSets[type].ins || !this._typedAdjSets[type].ins.size)
            && (!this._typedAdjSets[type].outs || !this._typedAdjSets[type].outs.size)
            && (!this._typedAdjSets[type].conns || !this._typedAdjSets[type].conns.size);
    }
}
exports.TypedNode = TypedNode;
