"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $G = require("../core/Graph");
var KROL = /** @class */ (function () {
    function KROL(config) {
        this._config = config || this.prepareKROLStandardConfig();
        // this._generator = this._config.generator;
        // TODO: use the adjacency matrix form the generator graph
        // as soon as the issues from computing the adjacency matrix are fixe
        // this._genMat = this._generator.adjListArray();
        this._genMat = this._config.genMat;
        this._cycles = this._config.cycles;
        this._graph = new $G.BaseGraph('synth');
    }
    KROL.prototype.generate = function () {
        // var gen_dims = this._generator.nrNodes();
        var gen_dims = this._genMat[0].length;
        var res_dims = Math.pow(gen_dims, this._cycles + 1);
        for (var index = 0; index < res_dims; index++) {
            this._graph.addNodeByID(index.toString());
        }
        var nr_edges = 0;
        for (var node1 = 0; node1 < res_dims; node1++) {
            for (var node2 = 0; node2 < res_dims; node2++) {
                if (this.addEdge(node1, node2, gen_dims)) {
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
        }
        return true;
    };
    KROL.prototype.prepareKROLStandardConfig = function () {
        // var generator: $G.IGraph = new $G.BaseGraph('generator');
        // var node_a = generator.addNodeByID('a');
        // var node_b = generator.addNodeByID('b');
        // var edge_ab_id: string = node_a.getID() + '_' + node_b.getID();
        // var edge_ba_id: string = node_b.getID() + '_' + node_a.getID();
        // var edge_aa_id: string = node_a.getID() + '_' + node_a.getID();
        // var edge_bb_id: string = node_b.getID() + '_' + node_b.getID();
        // generator.addEdgeByID(edge_ab_id, node_a, node_b, {weighted: true, weight: 0.9});
        // generator.addEdgeByID(edge_ba_id, node_b, node_a, {weighted: true, weight: 0.5});
        // generator.addEdgeByID(edge_aa_id, node_a, node_a, {weighted: true, weight: 0.5});
        // generator.addEdgeByID(edge_bb_id, node_b, node_b, {weighted: true, weight: 0.1});
        var genMat = [[0.9, 0.5], [0.5, 0.1]];
        return {
            // generator: generator,
            genMat: genMat,
            cycles: 5
        };
    };
    return KROL;
}());
exports.KROL = KROL;
