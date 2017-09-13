"use strict";
var $SU = require("../utils/structUtils");
var pageRankCentrality = (function () {
    function pageRankCentrality() {
    }
    pageRankCentrality.prototype.getCentralityMap = function (graph, weighted, alpha, conv, iterations) {
        if (!weighted && weighted != null) {
            var a = 0;
        }
        if (alpha == null)
            alpha = 0.10;
        if (iterations == null)
            iterations = 1000;
        if (conv == null)
            conv = 0.000125;
        var curr = {};
        var old = {};
        var nrNodes = graph.nrNodes();
        var structure = {};
        for (var key in graph.getNodes()) {
            key = String(key);
            var node = graph.getNodeById(key);
            structure[key] = {};
            structure[key]['deg'] = node.outDegree() + node.degree();
            structure[key]['inc'] = [];
            var incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            for (var edge in incomingEdges) {
                var edgeNode = incomingEdges[edge];
                var parent_1 = edgeNode.getNodes().a;
                if (edgeNode.getNodes().a.getID() == node.getID())
                    parent_1 = edgeNode.getNodes().b;
                structure[key]['inc'].push(parent_1.getID());
            }
        }
        for (var key in graph.getNodes()) {
            key = String(key);
            curr[key] = 1 / nrNodes;
            old[key] = 1 / nrNodes;
        }
        for (var i = 0; i < iterations; i++) {
            var me = 0.0;
            for (var key in graph.getNodes()) {
                key = String(key);
                var total = 0;
                var parents = structure[key]['inc'];
                for (var k in parents) {
                    var p = String(parents[k]);
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
    };
    return pageRankCentrality;
}());
exports.pageRankCentrality = pageRankCentrality;
