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
            if (!e.typed && !e.weighted) {
                continue;
            }
            if (!e.typed && e.weighted) {
                if (e.weight !== pd.getWeight()) {
                    pds.delete(pd);
                }
                continue;
            }
            if (e.typed && BaseEdge_1.BaseEdge.isTyped(pd) && e.type !== pd.type) {
                pds.delete(pd);
            }
        }
        return !!pds.size;
    }
    checkTypeWeightEquality(e, oe) {
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
