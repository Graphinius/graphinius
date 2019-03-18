"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/structUtils");
class pageRankCentrality {
    getCentralityMap(graph, weighted, alpha, conv, iterations) {
        if (alpha == null)
            alpha = 0.10;
        if (iterations == null)
            iterations = 1000;
        if (conv == null)
            conv = 0.000125;
        let curr = {};
        let old = {};
        let nrNodes = graph.nrNodes();
        let structure = {};
        for (let key in graph.getNodes()) {
            key = String(key);
            let node = graph.getNodeById(key);
            structure[key] = {};
            structure[key]['deg'] = node.outDegree() + node.degree();
            structure[key]['inc'] = [];
            let incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            for (let edge in incomingEdges) {
                let edgeNode = incomingEdges[edge];
                let parent = edgeNode.getNodes().a;
                if (edgeNode.getNodes().a.getID() == node.getID())
                    parent = edgeNode.getNodes().b;
                structure[key]['inc'].push(parent.getID());
            }
        }
        for (let key in graph.getNodes()) {
            key = String(key);
            curr[key] = 1 / nrNodes;
            old[key] = 1 / nrNodes;
        }
        for (let i = 0; i < iterations; i++) {
            let me = 0.0;
            for (let key in graph.getNodes()) {
                key = String(key);
                let total = 0;
                let parents = structure[key]['inc'];
                for (let k in parents) {
                    let p = String(parents[k]);
                    total += old[p] / structure[p]['deg'];
                }
                curr[key] = total * (1 - alpha) + alpha / nrNodes;
                me += Math.abs(curr[key] - old[key]);
            }
            if (me <= conv) {
                return curr;
            }
            old = $SU.clone(curr);
        }
        return curr;
    }
}
exports.pageRankCentrality = pageRankCentrality;
