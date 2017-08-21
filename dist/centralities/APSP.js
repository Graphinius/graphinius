"use strict";
var $SU = require('../utils/structUtils');
var APSP = (function () {
    function APSP() {
    }
    APSP.prototype.addNode = function (graph, Z) {
        var E = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]), L = {}, D = {}, T1 = Z.prevNodes(), T2 = Z.nextNodes();
        var minkinT1 = [];
        var minkoutT2 = [];
        var nodes = graph.getNodes();
        var z = Z.getID();
        for (var v in nodes) {
            for (var kin in T1) {
                if (v != kin) {
                    L[v][z] = D[v][kin] + graph.getEdgeByNodeIDs(kin, z);
                    if (L[v][z] < minkinT1[v])
                        minkinT1[v] = L[v][z];
                }
            }
            for (var kout in T2) {
                if (v != kout) {
                    L[z][v] = graph.getEdgeByNodeIDs(z, kout) + D[kout][v];
                    if (L[z][v] < minkoutT2[v])
                        minkoutT2[v] = L[z][v];
                }
            }
        }
        for (var i in minkinT1) {
            for (var j in minkoutT2) {
                if (minkinT1[i] + minkoutT2[j] < D[i][j])
                    D[i][j] = minkinT1[i] + minkoutT2[j];
            }
        }
        for (var i in minkinT1)
            D[i][z] = minkinT1[i];
        for (var j in minkoutT2)
            D[z][j] = minkoutT2[j];
        return {};
    };
    return APSP;
}());
exports.APSP = APSP;
