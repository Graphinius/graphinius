"use strict";
function pageRankCentrality(graph) {
    var startVal = 1 / graph.nrNodes();
    var pageScores = {};
    for (var key in graph.getNodes()) {
        pageScores[key] = startVal;
    }
    return graph.degreeDistribution();
}
exports.pageRankCentrality = pageRankCentrality;
