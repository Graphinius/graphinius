"use strict";
var $N = require('../core/Nodes');
var $PFS = require('../../src/search/PFS');
var BellmanFord_1 = require('../search/BellmanFord');
var Dijkstra_1 = require('../search/Dijkstra');
function Johnsons(graph, cycle) {
    if (cycle === void 0) { cycle = true; }
    var allNodes = graph.getNodes();
    var nodeKeys = Object.keys(allNodes);
    var extraNode = new $N.BaseNode("extraNode");
    var graphForBF = graph.clone();
    graphForBF.addNode(extraNode);
    var count = 0;
    for (var _i = 0, nodeKeys_1 = nodeKeys; _i < nodeKeys_1.length; _i++) {
        var nodeId = nodeKeys_1[_i];
        graphForBF.addEdgeByNodeIDs("temp" + count++, "extraNode", nodeId, { directed: true, weighted: true, weight: 0 });
    }
    for (var i = 0; i < nodeKeys.length; i++) {
        var actualNode = allNodes[nodeKeys[i]];
        graphForBF.addEdgeByID("temp" + i, extraNode, actualNode, { directed: true, weighted: true, weight: 0 });
    }
    if (BellmanFord_1.BellmanFordArray(graphForBF, extraNode, true)) {
        throw new Error("The graph contains negative cycle(s), it makes no sense to continue");
    }
    else {
        var newWeights = BellmanFord_1.BellmanFordDict(graphForBF, extraNode, false);
        delete newWeights["extraNode"];
        var RWGraph = graph.clone();
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
        var RWAllNodes = RWGraph.getNodes();
        var RWNodeKeys = Object.keys(RWAllNodes);
        for (var _a = 0, RWNodeKeys_1 = RWNodeKeys; _a < RWNodeKeys_1.length; _a++) {
            var nodeID = RWNodeKeys_1[_a];
            var resultD = Dijkstra_1.Dijkstra(RWGraph, RWAllNodes[nodeID]);
            var targetKeys = Object.keys(resultD);
            for (var targetNode in targetKeys) {
                var entryForThisTarget = resultD[targetNode];
                var distanceForThisTarget = entryForThisTarget.distance;
                var parentForThisTarget = entryForThisTarget.parent;
            }
        }
    }
    return {};
}
exports.Johnsons = Johnsons;
