"use strict";
var $N = require('../core/Nodes');
var $PFS = require('../search/PFS');
var BellmanFord_1 = require('../search/BellmanFord');
function Johnsons(graph, cycle) {
    if (cycle === void 0) { cycle = true; }
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var allNodes = graph.getNodes();
    var nodeKeys = Object.keys(allNodes);
    var hasNWE = function (graph) {
        var allDir = graph.getDirEdges();
        var allUnd = graph.getUndEdges();
        var resultHasNWE = false;
        for (var diredge in allDir) {
            if (!allDir[diredge].isWeighted()) {
                continue;
            }
            if (allDir[diredge].getWeight() < 0) {
                resultHasNWE = true;
            }
        }
        for (var undEdge in allUnd) {
            if (!allUnd[undEdge].isWeighted()) {
                continue;
            }
            if (allUnd[undEdge].getWeight() < 0) {
                resultHasNWE = true;
            }
        }
        return resultHasNWE;
    };
    var RWGraph;
    if (hasNWE) {
        var extraNode = new $N.BaseNode("extraNode");
        var graphForBF = graph.clone();
        graphForBF.addNode(extraNode);
        for (var _i = 0, nodeKeys_1 = nodeKeys; _i < nodeKeys_1.length; _i++) {
            var nodeId = nodeKeys_1[_i];
            graphForBF.addEdgeByNodeIDs("temp", "extraNode", nodeId, { directed: true, weighted: true, weight: 0 });
        }
        if (BellmanFord_1.BellmanFordArray(graphForBF, extraNode, true)) {
            throw new Error("The graph contains negative cycle(s), it makes no sense to continue");
        }
        var newWeights = BellmanFord_1.BellmanFordDict(graphForBF, extraNode, false);
        delete newWeights["extraNode"];
        RWGraph = graph.clone();
        var edges = RWGraph.getDirEdgesArray().concat(RWGraph.getUndEdgesArray());
        for (var edgeID in edges) {
            var edge = edges[edgeID];
            var a = edge.getNodes().a.getID();
            var b = edge.getNodes().b.getID();
            if (edge.isWeighted) {
                var oldWeight = edge.getWeight();
                var newWeight = oldWeight + newWeights[a] - newWeights[b];
                edge.setWeight(newWeight);
            }
            else {
                var edgeID_1 = edge.getID();
                var dirNess = edge.isDirected();
                RWGraph.deleteEdge(edge);
                var oldWeight = $PFS.DEFAULT_WEIGHT;
                var newWeight = oldWeight + newWeights[a] - newWeights[b];
                RWGraph.addEdgeByNodeIDs(edgeID_1, a, b, { directed: dirNess, weighted: true, weight: newWeight });
            }
        }
    }
    else {
        RWGraph = graph.clone();
    }
    var RWAllNodes = RWGraph.getNodes();
    var RWNodeKeys = Object.keys(RWAllNodes);
    var dist;
    var next;
    for (var src_id = 0; src_id < RWNodeKeys.length; src_id++) {
        dist.push([]);
        next.push([]);
    }
    return { dist: dist, next: next };
}
exports.Johnsons = Johnsons;
