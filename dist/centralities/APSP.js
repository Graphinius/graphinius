"use strict";
var $G = require('../core/Graph');
var $N = require('../core/Nodes');
var APSP = (function () {
    function APSP(graph) {
        var _this = this;
        this.E = {};
        this.L = {};
        this.D = {};
        this.edgesToAdd = [];
        this.nodes = [];
        this.addNode = function (Z) {
            var T1 = Z.prevNodes(), T2 = Z.nextNodes();
            var minkinT1 = [];
            var minkoutT2 = [];
            var z = Z.getID();
            _this.nodes.push(z);
            var nodes = _this.nodes;
            nodes.forEach(function (v, index) {
                minkinT1[v] = Number.MAX_VALUE;
                minkoutT2[v] = Number.MAX_VALUE;
                for (var kin in T1) {
                    if (v != T1[kin].node.getID()) {
                        _this.L[v][z] = _this.D[v][T1[kin].node.getID()] + T1[kin].edge.getWeight();
                        if (_this.L[v][z] < minkinT1[v])
                            minkinT1[v] = _this.L[v][z];
                    }
                }
                for (var kout in T2) {
                    if (v != T2[kout].node.getID()) {
                        _this.L[z][v] = T2[kout].edge.getWeight() + _this.D[T2[kout].node.getID()][v];
                        if (_this.L[z][v] < minkoutT2[v])
                            minkoutT2[v] = _this.L[z][v];
                    }
                }
            });
            console.log(minkinT1);
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
        this.addEdge = function (E) {
            var k1 = E.getNodes().a.getID();
            var k2 = E.getNodes().b.getID();
            if (_this.nodes.indexOf(k1) <= -1) {
                _this.graph.addNode(new $N.BaseNode(k1));
                _this.nodes.push(k1);
                _this.D[k1] = [];
                _this.D[k1][k1] = 0;
            }
            if (_this.nodes.indexOf(k2) <= -1) {
                _this.graph.addNode(new $N.BaseNode(k2));
                _this.nodes.push(k2);
                _this.D[k2] = [];
                _this.D[k2][k2] = 0;
            }
            _this.graph.addEdgeByID(E.getID(), _this.graph.getNodeById(k1), _this.graph.getNodeById(k2), { weighted: true, weight: E.getWeight(), directed: true });
            if (_this.D[k1][k2] == null) {
                _this.D[k1][k2] = E.getWeight();
                console.log("D <- W - " + E.getWeight() + " " + _this.D[k1][k2]);
            }
            else if (_this.D[k1][k2] < E.getWeight())
                return;
            _this.nodes.forEach(function (i, index) {
                _this.nodes.forEach(function (j, index) {
                    if (_this.D[i][j] == null || _this.D[i][k1] == null || _this.D[k2][j] == null) {
                    }
                    else {
                        var pathLength = _this.D[i][k1] + _this.D[k1][k2] + _this.D[k2][j];
                        if (pathLength < _this.D[i][j]) {
                            _this.D[i][j] = pathLength;
                            console.log("D[" + i + "][" + j + "] <- Pathlength - " + " " + _this.D[i][j]);
                        }
                    }
                });
            });
            _this.nodes.forEach(function (i, index) {
                _this.nodes.forEach(function (j, index) {
                    console.log("D[" + i + "][" + j + "]=" + _this.D[i][j]);
                });
            });
            console.log("This is the new D:" + JSON.stringify(_this.D));
            return {};
        };
        this.graph = new $G.BaseGraph("2");
    }
    APSP.prototype.getCloseness = function () {
        var ret = {};
        console.log("THIS IS D:" + JSON.stringify(this.D));
        for (var i in this.graph.getNodes()) {
            ret[i] = 0;
            for (var j in this.graph.getNodes()) {
                ret[i] = ret[i] + this.D[i][j];
            }
        }
        console.log("THIS IS RET:" + JSON.stringify(ret));
        return ret;
    };
    return APSP;
}());
exports.APSP = APSP;
