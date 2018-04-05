"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $PFS = require("../search/PFS");
/**
 * TODO Consider target node callbacks / messages
 * @param graph
 * @param v
 */
function Dijkstra(graph, source, target) {
    var config = $PFS.preparePFSStandardConfig();
    if (target) {
        config.goal_node = target;
    }
    return $PFS.PFS(graph, source, config);
}
exports.Dijkstra = Dijkstra;
