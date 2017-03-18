"use strict";
var $SU = require("../utils/structUtils");
var $GAUSS = require("../centralities/gauss");
var pageRankCentrality = (function () {
    function pageRankCentrality() {
    }
    pageRankCentrality.prototype.getCentralityMap = function (graph) {
        var startVal = 1 / graph.nrNodes();
        var pageScores = {};
        var divideTable = {};
        var matr = [];
        var ctr = 0;
        for (var key in graph.getNodes()) {
            divideTable[key] = 0;
        }
        for (var key in graph.getNodes()) {
            var node = graph.getNodeById(key);
            var node_InEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            matr[ctr] = new Array();
            for (var edgeKey in node_InEdges) {
                var edge = node_InEdges[edgeKey];
                if (edge.getNodes().a.getID() == node.getID()) {
                    matr[ctr].push(edge.getNodes().b.getID());
                    divideTable[edge.getNodes().b.getID()]++;
                }
                else {
                    matr[ctr].push(edge.getNodes().a.getID());
                    divideTable[edge.getNodes().a.getID()]++;
                }
            }
            matr[ctr].push(node.getID());
            ctr++;
        }
        ctr = 0;
        var mapCtr = {};
        var numMatr = [[]];
        for (var key in matr) {
            numMatr[key] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
            var p = matr[key].pop();
            if (mapCtr[p] == null)
                mapCtr[p] = ctr++;
            numMatr[key][mapCtr[p]] = -1;
            for (var k in matr[key]) {
                var a = matr[key][k];
                if (mapCtr[a] == null)
                    mapCtr[a] = ctr++;
                numMatr[key][mapCtr[a]] += 1 / divideTable[a];
            }
        }
        numMatr[numMatr.length - 1] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 1);
        var x = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
        x[x.length - 1] = 1;
        x = $GAUSS.gauss(numMatr, x);
        return x;
    };
    return pageRankCentrality;
}());
exports.pageRankCentrality = pageRankCentrality;
