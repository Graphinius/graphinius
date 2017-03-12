"use strict";
var $SU = require("../utils/structUtils");
var $GAUSS = require("../centralities/gauss");
function pageRankDetCentrality(graph) {
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
        numMatr[key] = Array.apply(null, Array(graph.nrNodes() + 1)).map(Number.prototype.valueOf, 0);
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
    numMatr[numMatr.length] = Array.apply(null, Array(graph.nrNodes() + 1)).map(Number.prototype.valueOf, 1);
    console.log("Matrix before Gauss:");
    console.log(numMatr);
    var x = [];
    x = $GAUSS.gauss(numMatr, x);
    console.log("Solved Gauss:");
    console.log(numMatr);
    return matr;
}
exports.pageRankDetCentrality = pageRankDetCentrality;
