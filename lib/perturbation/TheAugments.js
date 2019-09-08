"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimilarityCommons_1 = require("../similarities/SimilarityCommons");
var TheAugments = (function () {
    function TheAugments(_g) {
        this._g = _g;
    }
    TheAugments.prototype.addSubsetRelationship = function (algo, sets, cfg) {
        var edgeSet = new Set();
        var edge;
        var g = this._g;
        var sims = SimilarityCommons_1.knnNodeArray(algo, sets, { knn: cfg.knn || 1, cutoff: cfg.cutoff || 0 });
        sims.forEach(function (e) {
            if (sets[e.from].size <= sets[e.to].size) {
                edge = g.addEdgeByID('ontheedge', g.n(e.from), g.n(e.to), { directed: true, type: cfg.rtype });
            }
            else {
                edge = g.addEdgeByID('ontheedge', g.n(e.to), g.n(e.from), { directed: true, type: cfg.rtype });
            }
            edgeSet.add(edge);
        });
        return edgeSet;
    };
    return TheAugments;
}());
exports.TheAugments = TheAugments;
