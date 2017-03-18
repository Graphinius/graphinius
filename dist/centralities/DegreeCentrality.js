"use strict";
(function (DegreeMode) {
    DegreeMode[DegreeMode["in"] = 0] = "in";
    DegreeMode[DegreeMode["out"] = 1] = "out";
    DegreeMode[DegreeMode["und"] = 2] = "und";
    DegreeMode[DegreeMode["dir"] = 3] = "dir";
    DegreeMode[DegreeMode["all"] = 4] = "all";
})(exports.DegreeMode || (exports.DegreeMode = {}));
var DegreeMode = exports.DegreeMode;
var degreeCentrality = (function () {
    function degreeCentrality() {
    }
    degreeCentrality.prototype.getCentralityMap = function (graph, conf) {
        if (conf == null)
            conf = DegreeMode.all;
        var ret = {};
        switch (conf) {
            case DegreeMode.in:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        ret[key] = node.inDegree();
                    console.log("::" + key + " " + ret[key]);
                }
                break;
            case DegreeMode.out:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        ret[key] = node.outDegree();
                }
                break;
            case DegreeMode.und:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        ret[key] = node.degree();
                }
                break;
            case DegreeMode.dir:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        ret[key] = node.inDegree() + node.outDegree();
                }
                break;
            case DegreeMode.all:
                for (var key in graph.getNodes()) {
                    var node = graph.getNodeById(key);
                    if (node != null)
                        ret[key] = node.degree() + node.inDegree() + node.outDegree();
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
