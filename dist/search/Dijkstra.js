"use strict";
var $PFS = require('../search/PFS');
function Dijkstra(graph, source, target) {
    var config = $PFS.preparePFSStandardConfig();
    if (target) {
        config.goal_node = target;
    }
    return $PFS.PFS(graph, source, config);
}
exports.Dijkstra = Dijkstra;
