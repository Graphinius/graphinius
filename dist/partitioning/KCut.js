"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KCut = /** @class */ (function () {
    function KCut(_graph) {
        this._graph = _graph;
        this._partitioning = {
            partitions: {},
            nodePartMap: {},
            nodeFrontMap: {},
            cut_cost: 0
        };
    }
    KCut.prototype.cut = function (k, shuffle) {
        if (shuffle === void 0) { shuffle = false; }
        var nodes = this._graph.getNodes(), n = Object.keys(nodes).length, nr_parts = Math.floor(n / k), nr_rest = n % k;
        for (var i = 0; i < nr_parts; i++) {
            var partition = {
                nodes: {}
            };
            // this._partitioning.partitions.set( i, partition );
        }
        // for (let node in nodes) {
        //   let actualNode = nodes[node];
        //   if (i++ <= n / 2 - 1) {
        //     //now true is put in for all, later a change to false means deletion (but faster)
        //     part1[actualNode.getID()] = true;
        //   }
        //   else {
        //     part2[actualNode.getID()] = true;
        //   }
        // }
        // let partCount = 0;
        // result[partCount++] = part1;
        // result[partCount++] = part2;
        return this._partitioning;
    };
    return KCut;
}());
exports.default = KCut;
