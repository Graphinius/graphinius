"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/StructUtils");
var DegreeMode;
(function (DegreeMode) {
    DegreeMode[DegreeMode["in"] = 0] = "in";
    DegreeMode[DegreeMode["out"] = 1] = "out";
    DegreeMode[DegreeMode["und"] = 2] = "und";
    DegreeMode[DegreeMode["dir"] = 3] = "dir";
    DegreeMode[DegreeMode["all"] = 4] = "all";
})(DegreeMode = exports.DegreeMode || (exports.DegreeMode = {}));
var DegreeCentrality = (function () {
    function DegreeCentrality() {
    }
    DegreeCentrality.prototype.getCentralityMap = function (graph, weighted, conf) {
        weighted = (weighted != null) ? !!weighted : true;
        conf = (conf == null) ? DegreeMode.all : conf;
        var ret = {};
        switch (conf) {
            case DegreeMode.in:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null) {
                        if (!weighted) {
                            ret[key] = node.in_deg;
                        }
                        else {
                            ret[key] = ret[key] || 0;
                            for (var k in node.inEdges()) {
                                ret[key] += node.inEdges()[k].getWeight();
                            }
                        }
                    }
                }
                break;
            case DegreeMode.out:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null) {
                        if (!weighted) {
                            ret[key] = node.out_deg;
                        }
                        else {
                            ret[key] = ret[key] || 0;
                            for (var k in node.outEdges()) {
                                ret[key] += node.outEdges()[k].getWeight();
                            }
                        }
                    }
                }
                break;
            case DegreeMode.und:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null) {
                        if (!weighted) {
                            ret[key] = node.deg;
                        }
                        else {
                            ret[key] = ret[key] || 0;
                            for (var k in node.undEdges()) {
                                ret[key] += node.undEdges()[k].getWeight();
                            }
                        }
                    }
                }
                break;
            case DegreeMode.dir:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null) {
                        if (!weighted) {
                            ret[key] = node.in_deg + node.out_deg;
                        }
                        else {
                            ret[key] = ret[key] || 0;
                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
                            for (var k in comb) {
                                ret[key] += comb[k].getWeight();
                            }
                        }
                    }
                }
                break;
            case DegreeMode.all:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null) {
                        if (!weighted) {
                            ret[key] = node.deg + node.in_deg + node.out_deg;
                        }
                        else {
                            ret[key] = ret[key] || 0;
                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
                            for (var k in comb) {
                                ret[key] += comb[k].getWeight();
                            }
                        }
                    }
                }
                break;
        }
        return ret;
    };
    DegreeCentrality.prototype.degreeDistribution = function (graph) {
        var max_deg = 0, key, nodes = graph.getNodes(), node, all_deg;
        for (key in nodes) {
            node = nodes[key];
            all_deg = node.in_deg + node.out_deg + node.deg + 1;
            max_deg = all_deg > max_deg ? all_deg : max_deg;
        }
        var deg_dist = {
            in: new Uint32Array(max_deg),
            out: new Uint32Array(max_deg),
            dir: new Uint32Array(max_deg),
            und: new Uint32Array(max_deg),
            all: new Uint32Array(max_deg)
        };
        for (key in nodes) {
            node = nodes[key];
            deg_dist.in[node.in_deg]++;
            deg_dist.out[node.out_deg]++;
            deg_dist.dir[node.in_deg + node.out_deg]++;
            deg_dist.und[node.deg]++;
            deg_dist.all[node.in_deg + node.out_deg + node.deg]++;
        }
        return deg_dist;
    };
    return DegreeCentrality;
}());
exports.DegreeCentrality = DegreeCentrality;
