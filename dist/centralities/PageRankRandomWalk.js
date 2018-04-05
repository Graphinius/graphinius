"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
//Calculates the page rank for a given graph
var pageRankCentrality = /** @class */ (function () {
    function pageRankCentrality() {
    }
    pageRankCentrality.prototype.getCentralityMap = function (graph, weighted, alpha, conv, iterations) {
        if (alpha == null)
            alpha = 0.10;
        if (iterations == null)
            iterations = 1000;
        if (conv == null)
            conv = 0.000125;
        //First initialize the values for all nodes
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
        //console.log(JSON.stringify(structure));
        for (var key in graph.getNodes()) {
            key = String(key);
            curr[key] = 1 / nrNodes;
            old[key] = 1 / nrNodes;
        }
        for (var i = 0; i < iterations; i++) {
            var me = 0.0;
            for (var key in graph.getNodes()) { //Run through all nodes in graph
                key = String(key);
                //console.log(structure[key]);
                var total = 0;
                var parents = structure[key]['inc'];
                for (var k in parents) {
                    var p = String(parents[k]);
                    total += old[p] / structure[p]['deg'];
                }
                //console.log("o:"+old[key] + " n:"+curr[key]);
                curr[key] = total * (1 - alpha) + alpha / nrNodes;
                me += Math.abs(curr[key] - old[key]);
            }
            if (me <= conv) {
                return curr;
            }
            //console.log("Error:"+me/nrNodes);
            old = $SU.clone(curr);
        }
        return curr;
    };
    return pageRankCentrality;
}());
exports.pageRankCentrality = pageRankCentrality;
