"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEdge_1 = require("../../core/base/BaseEdge");
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
class EdgeDupeChecker {
    constructor(_graph) {
        this._graph = _graph;
    }
    isDupe(e) {
        let pds = this.potentialEndpoints(e);
        if (!pds.size) {
            return false;
        }
        for (let pd of pds.values()) {
            if (!EdgeDupeChecker.checkTypeWeightEquality(e, pd)
                || !EdgeDupeChecker.typeWeightDupe(e, pd)) {
                pds.delete(pd);
            }
        }
        return !!pds.size;
    }
    static typeWeightDupe(e, oe) {
        const neitherTypedNorWeighted = !e.typed && !e.weighted;
        const notTypedButWeighted = !e.typed && e.weighted;
        const weightEqual = e.weight === oe.getWeight();
        const typeEqual = e.typed && BaseEdge_1.BaseEdge.isTyped(oe) && e.type === oe.type;
        return (neitherTypedNorWeighted || notTypedButWeighted && weightEqual || typeEqual);
    }
    static checkTypeWeightEquality(e, oe) {
        return BaseEdge_1.BaseEdge.isTyped(oe) === e.typed && e.weighted === oe.isWeighted();
    }
    potentialEndpoints(e) {
        const result = new Set();
        if (e.dir) {
            e.a.nextNodes().forEach(ne => {
                (ne.node === e.b) && result.add(ne.edge);
            });
        }
        else {
            e.a.connNodes().forEach(ne => {
                (ne.node === e.b) && result.add(ne.edge);
            });
        }
        return result;
    }
}
exports.EdgeDupeChecker = EdgeDupeChecker;
