"use strict";
var $SU = require('../utils/structUtils');
var APSP = (function () {
    function APSP(graph) {
        var _this = this;
        this.E = {};
        this.L = {};
        this.D = {};
        this.addNode = function (Z) {
            var T1 = Z.prevNodes(), T2 = Z.nextNodes();
            var minkinT1 = [];
            var minkoutT2 = [];
            var nodes = _this.graph.getNodes();
            var z = Z.getID();
            if (_this.L[z] == null)
                _this.L[z] = [];
            if (_this.D[z] == null)
                _this.D[z] = [];
            for (var v in nodes) {
                if (_this.L[v] == null)
                    _this.L[v] = [];
                if (_this.D[v] == null)
                    _this.D[v] = [];
                for (var kin in T1) {
                    if (v != T1[kin].node.getID()) {
                        if (_this.D[T1[kin].node.getID()] == null)
                            _this.D[T1[kin].node.getID()] = [];
                        _this.L[v][z] = _this.D[v][T1[kin].node.getID()] + T1[kin].edge.getWeight();
                        if (_this.L[v][z] < minkinT1[v])
                            minkinT1[v] = _this.L[v][z];
                    }
                }
                for (var kout in T2) {
                    if (v != T2[kout].node.getID()) {
                        if (_this.D[T2[kout].node.getID()] == null)
                            _this.D[T2[kout].node.getID()] = [];
                        _this.L[z][v] = T2[kout].edge.getWeight() + _this.D[T2[kout].node.getID()][v];
                        if (_this.L[z][v] < minkoutT2[v])
                            minkoutT2[v] = _this.L[z][v];
                    }
                }
            }
            console.log(minkinT1);
            console.log(minkoutT2);
            for (var i in minkinT1) {
                for (var j in minkoutT2) {
                    if (minkinT1[i] + minkoutT2[j] < _this.D[i][j])
                        _this.D[i][j] = minkinT1[i] + minkoutT2[j];
                }
            }
            for (var i in minkinT1)
                _this.D[i][z] = minkinT1[i];
            for (var j in minkoutT2)
                _this.D[z][j] = minkoutT2[j];
            return {};
        };
        $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
        this.graph = graph;
        for (var n in graph.getNodes()) {
            this.L[n] = {};
            this.D[n] = {};
            for (var m in graph.getNodes()) {
                this.L[n][m] = Number.MAX_VALUE;
                this.D[n][m] = Number.MAX_VALUE;
            }
        }
        var edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
        for (var edge in edges) {
            var a = edges[edge].getNodes().a.getID();
            var b = edges[edge].getNodes().b.getID();
            if (this.L[a] == null)
                this.L[a] = {};
            this.L[a][b] = edges[edge].getWeight();
            if (!edges[edge].isDirected()) {
                if (this.L[b] == null)
                    this.L[b] = {};
                this.L[b][a] = edges[edge].getWeight();
            }
        }
    }
    APSP.prototype.getCloseness = function () {
        var ret = {};
        for (var i in this.graph.getNodes())
            console.log(JSON.stringify(this.D[i]));
        for (var i in this.graph.getNodes())
            for (var j in this.graph.getNodes())
                ret[i] = ret != null ? ret[i] + this.D[i][j] : this.D[i][j];
        console.log(ret);
        return ret;
    };
    return APSP;
}());
exports.APSP = APSP;
