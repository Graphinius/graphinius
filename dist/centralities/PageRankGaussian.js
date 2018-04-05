"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
var $GAUSS = require("../centralities/gauss");
//Calculates the page rank for a given graph
var pageRankDetCentrality = /** @class */ (function () {
    function pageRankDetCentrality() {
    }
    pageRankDetCentrality.prototype.getCentralityMap = function (graph, weighted) {
        //First initialize the values for all nodes
        var divideTable = {}; //Tells us how many outgoing edges each node has
        var matr = [];
        var ctr = 0;
        var map = {};
        for (var key in graph.getNodes()) {
            divideTable[key] = 0;
        }
        for (var key in graph.getNodes()) { //Run through all nodes in graph
            //pageScores[key] = startVal;
            map[key] = ctr;
            var node = graph.getNodeById(key);
            var node_InEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            matr[ctr] = new Array();
            //Find out which other nodes influence the PageRank of this node
            for (var edgeKey in node_InEdges) {
                var edge = node_InEdges[edgeKey];
                if (edge.getNodes().a.getID() == node.getID()) {
                    matr[ctr].push(edge.getNodes().b.getID());
                    divideTable[edge.getNodes().b.getID()]++; //Count to see how much we have to split the score
                }
                else {
                    matr[ctr].push(edge.getNodes().a.getID());
                    divideTable[edge.getNodes().a.getID()]++;
                }
            }
            //We push this to the array and pop it later, this is the current variable (=left side of equation)
            matr[ctr].push(node.getID());
            ctr++;
        }
        ctr = 0;
        var mapCtr = {};
        var numMatr = [[]];
        //console.log(matr);
        //Bring matrix into correct form
        for (var key in matr) { //  |maybe add +1 here
            numMatr[key] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0); //Fill array with 0
            //set the slot of our variable to -1 (we switch it to the other side)
            var p = matr[key].pop();
            if (mapCtr[p] == null)
                mapCtr[p] = ctr++;
            numMatr[key][mapCtr[p]] = -1;
            for (var k in matr[key]) {
                var a = matr[key][k];
                if (mapCtr[a] == null)
                    mapCtr[a] = ctr++;
                //console.log("mapCtr:"+mapCtr[a] + " " + a);
                numMatr[key][mapCtr[a]] += 1 / divideTable[a];
            }
        }
        //Now add last equation, everything added together should be 1!  | maybe add +1 here
        numMatr[numMatr.length - 1] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 1);
        var x = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
        x[x.length - 1] = 1;
        x = $GAUSS.gauss(numMatr, x);
        var y = {};
        for (var key in map) {
            y[key] = x[ctr];
        }
        return x;
    };
    return pageRankDetCentrality;
}());
exports.pageRankDetCentrality = pageRankDetCentrality;
