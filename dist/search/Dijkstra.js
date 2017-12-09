"use strict";
var $PFS = require('../../src/search/PFS');
function Dijkstra(graph, source, target) {
    var config = $PFS.preparePFSStandardConfig();
    if (target) {
        config.goal_node = target;
    }
    return $PFS.PFS(graph, source, config);
}
exports.Dijkstra = Dijkstra;
function DijkstraAlt(graph, source, target) {
    var allNeighbors = graph.adjListDict(false, false, 0);
    var visitedNodes;
    var unvisitedNodes;
    var unvisitedNodeKeys = Object.keys(unvisitedNodes);
    var distOutput;
    var parentOutput;
    var allNodes = graph.getNodes();
    var nodeKeys = Object.keys(allNodes);
    for (var nodeKey in allNodes) {
        if (allNodes[nodeKey] == source) {
            distOutput[nodeKey] = 0;
            parentOutput[nodeKey] = [source];
            unvisitedNodes[nodeKey] = 0;
        }
        else {
            distOutput[nodeKey] = Number.POSITIVE_INFINITY;
            parentOutput[nodeKey] = [null];
            unvisitedNodes[nodeKey] = Number.POSITIVE_INFINITY;
        }
    }
    for (var i = 0; i < nodeKeys.length; i++) {
        var nextNodeKey = unvisitedNodeKeys[0];
        for (var node in unvisitedNodes) {
            if (unvisitedNodes[node] < unvisitedNodes[nextNodeKey]) {
                nextNodeKey = node;
            }
        }
        if (unvisitedNodes[nextNodeKey] == Number.POSITIVE_INFINITY) {
            break;
        }
        visitedNodes.push(nextNodeKey);
        delete unvisitedNodes[nextNodeKey];
        var indDel = unvisitedNodeKeys.indexOf(nextNodeKey);
        unvisitedNodeKeys.splice(indDel, 1);
        var neighbors = allNeighbors[nextNodeKey];
        for (var key in neighbors) {
            if (visitedNodes.indexOf(key) < 0) {
                if (distOutput[key] > distOutput[nextNodeKey] + neighbors[key]) {
                    distOutput[key] = distOutput[nextNodeKey] + neighbors[key];
                    parentOutput[key] = [allNodes[nextNodeKey]];
                }
                if (distOutput[key] = distOutput[nextNodeKey] + neighbors[key]) {
                    parentOutput[key].push(allNodes[nextNodeKey]);
                }
            }
        }
    }
    return [distOutput, parentOutput];
}
exports.DijkstraAlt = DijkstraAlt;
