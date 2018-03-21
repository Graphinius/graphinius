"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
var DegreeMode;
(function (DegreeMode) {
    DegreeMode[DegreeMode["in"] = 0] = "in";
    DegreeMode[DegreeMode["out"] = 1] = "out";
    DegreeMode[DegreeMode["und"] = 2] = "und";
    DegreeMode[DegreeMode["dir"] = 3] = "dir";
    DegreeMode[DegreeMode["all"] = 4] = "all";
})(DegreeMode = exports.DegreeMode || (exports.DegreeMode = {}));
var degreeCentrality = /** @class */ (function () {
    function degreeCentrality() {
    }
    degreeCentrality.prototype.getCentralityMap = function (graph, weighted, conf) {
        weighted = (weighted != null) ? !!weighted : true;
        conf = (conf == null) ? DegreeMode.all : conf;
        var ret = {}; //Will be a map of [nodeID] = centrality
        switch (conf) {
            case DegreeMode.in:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        if (!weighted)
                            ret[key] = node.inDegree();
                        else {
                            ret[key] = ret[key] || 0;
                            for (var k in node.inEdges()) {
                                ret[key] += node.inEdges()[k].getWeight();
                            }
                        }
                }
                break;
            case DegreeMode.out:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        if (!weighted)
                            ret[key] = node.outDegree();
                        else {
                            ret[key] = ret[key] || 0;
                            for (var k in node.outEdges())
                                ret[key] += node.outEdges()[k].getWeight();
                        }
                }
                break;
            case DegreeMode.und:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        if (!weighted)
                            ret[key] = node.degree();
                        else {
                            ret[key] = ret[key] || 0;
                            for (var k in node.undEdges())
                                ret[key] += node.undEdges()[k].getWeight();
                        }
                }
                break;
            case DegreeMode.dir:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        if (!weighted)
                            ret[key] = node.inDegree() + node.outDegree();
                        else {
                            ret[key] = ret[key] || 0;
                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
                            for (var k in comb)
                                ret[key] += comb[k].getWeight();
                        }
                }
                break;
            case DegreeMode.all:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        if (!weighted)
                            ret[key] = node.degree() + node.inDegree() + node.outDegree();
                        else {
                            ret[key] = ret[key] || 0;
                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
                            for (var k in comb) {
                                ret[key] += comb[k].getWeight();
                            }
                        }
                }
                break;
        }
        return ret;
    };
    degreeCentrality.prototype.getHistorgram = function (graph) {
        return graph.degreeDistribution();
    };
    return degreeCentrality;
}());
exports.degreeCentrality = degreeCentrality;
