"use strict";
var $G = require('../core/Graph');
var KROL = (function () {
    function KROL(config) {
        this._config = config || this.prepareKROLStandardConfig();
        this._genMat = this._config.genMat;
        this._cycles = this._config.cycles;
        this._graph = new $G.BaseGraph('synth');
    }
    KROL.prototype.generate = function () {
        var gen_dims = this._genMat.length;
        var res_dims = Math.pow(gen_dims, this._cycles);
        for (var index = 0; index < res_dims; index++) {
            this._graph.addNodeByID(index.toString());
        }
        var nr_edges = 0;
        for (var node1 = 0; node1 < res_dims - 1; node1++) {
            for (var node2 = 0; node2 < res_dims - 1; node2++) {
                if (this.addEdge(node1, node2, res_dims)) {
                    this._graph.addEdgeByNodeIDs(node1 + '_' + node2, node1.toString(), node2.toString());
                    ++nr_edges;
                }
            }
        }
        var result = {
            graph: this._graph
        };
        return result;
    };
    KROL.prototype.addEdge = function (node1, node2, dims) {
        var rprob = Math.random();
        var prob = 1.0;
        for (var level = 0; level < this._cycles; level++) {
            var id_1 = Math.floor(node1 / Math.pow(dims, level + 1)) % dims;
            var id_2 = Math.floor(node2 / Math.pow(dims, level + 1)) % dims;
            prob *= this._genMat[id_1][id_2];
            if (rprob > prob) {
                return false;
            }
            node1 = node1 / dims | 0;
            node2 = node2 / dims | 0;
        }
        return true;
    };
    KROL.prototype.prepareKROLStandardConfig = function () {
        var genMat = [[0.9, 0.5], [0.5, 0.1]];
        return {
            genMat: genMat,
            cycles: 5
        };
    };
    return KROL;
}());
exports.KROL = KROL;
