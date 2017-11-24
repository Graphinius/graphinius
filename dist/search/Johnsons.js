"use strict";
var $N = require('../core/Nodes');
var $E = require('../core/Edges');
var $BF = require('../search/BellmanFord');
var $D = require('../search/Dijkstra');
var extraNode = new $N.BaseNode("extraNode");
function Johnsons(graph, start, cycle) {
    if (cycle === void 0) { cycle = false; }
    addExtraNodeWithEdges(graph);
    if (graph.hasNegativeCycles()) {
        throw new Error('Can not continue: the graph has negative cycle');
    }
    else {
        var resultBF = $BF.BellmanFordArray(graph, extraNode, true);
        removeExtraNodeWithEdges(graph);
        var allNodes = graph.getNodes();
        var resultJohnson = void 0;
        for (var count = 0; count < graph.nrNodes(); count++) {
            var source = allNodes[count];
            var actualResult = $D.Dijkstra(graph, source);
        }
        return resultJohnson;
    }
}
exports.Johnsons = Johnsons;
function addExtraNodeWithEdges(graph) {
    var allNodes = graph.getNodes();
    graph.addNode(extraNode);
    Object.keys(graph.getNodes());
    for (var count = 0; count < graph.nrNodes(); count++) {
        var target = allNodes[count];
        var tempEdge = new $E.BaseEdge("temp", extraNode, target, { directed: true, weighted: true, weight: 0 });
    }
    return graph;
}
function removeExtraNodeWithEdges(graph) {
    graph.deleteNode(extraNode);
    return graph;
}
