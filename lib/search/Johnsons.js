"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var $N = require("../core/base/BaseNode");
var $PFS = require("../search/PFS");
var $BF = require("../search/BellmanFord");
var $SU = require("../utils/StructUtils");
var ComputeGraph_1 = require("../core/compute/ComputeGraph");
function Johnsons(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    if (graph.hasNegativeEdge()) {
        var extraNode = new $N.BaseNode("extraNode");
        graph = addExtraNandE(graph, extraNode);
        var BFresult = $BF.BellmanFordDict(graph, extraNode);
        if (BFresult.neg_cycle) {
            throw new Error("The graph contains a negative cycle, thus it can not be processed");
        }
        else {
            var newWeights = BFresult.distances;
            graph = reWeighGraph(graph, newWeights, extraNode);
            graph.deleteNode(extraNode);
            return PFSFromAllNodes(graph);
        }
    }
    return PFSFromAllNodes(graph);
}
exports.Johnsons = Johnsons;
function addExtraNandE(target, nodeToAdd) {
    var allNodes = target.getNodes();
    target.addNode(nodeToAdd);
    var tempCounter = 0;
    for (var nodeKey in allNodes) {
        if (allNodes[nodeKey].getID() != nodeToAdd.getID()) {
            target.addEdgeByNodeIDs("temp" + tempCounter, nodeToAdd.getID(), allNodes[nodeKey].getID(), { directed: true, weighted: true, weight: 0 });
            tempCounter++;
        }
    }
    return target;
}
exports.addExtraNandE = addExtraNandE;
function reWeighGraph(target, distDict, tempNode) {
    var e_1, _a;
    var edges = target.getDirEdgesArray().concat(target.getUndEdgesArray());
    try {
        for (var edges_1 = __values(edges), edges_1_1 = edges_1.next(); !edges_1_1.done; edges_1_1 = edges_1.next()) {
            var edge = edges_1_1.value;
            var a = edge.getNodes().a.getID();
            var b = edge.getNodes().b.getID();
            if (a !== tempNode.getID() && edge.isWeighted) {
                var oldWeight = edge.getWeight();
                var newWeight = oldWeight + distDict[a] - distDict[b];
                edge.setWeight(newWeight);
            }
            else {
                var newWeight = $PFS.DEFAULT_WEIGHT + distDict[a] - distDict[b];
                var edgeID = edge.getID();
                var dirNess = edge.isDirected();
                target.deleteEdge(edge);
                target.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) _a.call(edges_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return target;
}
exports.reWeighGraph = reWeighGraph;
function PFSFromAllNodes(graph) {
    var cg = new ComputeGraph_1.ComputeGraph(graph);
    var dists = cg.adjMatrixW();
    var next = cg.nextArray();
    var nodesDict = graph.getNodes();
    var nodeIDIdxMap = {};
    var i = 0;
    for (var key in nodesDict) {
        nodeIDIdxMap[nodesDict[key].getID()] = i++;
    }
    var specialConfig = $PFS.preparePFSStandardConfig();
    var notEncounteredJohnsons = function (context) {
        context.next.best = context.current.best + context.next.edge.getWeight();
        var i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
        if (context.current.node == context.root_node) {
            dists[i][j] = context.next.best;
            next[i][j][0] = j;
        }
        else {
            dists[i][j] = context.next.best;
            next[i][j][0] = nodeIDIdxMap[context.current.node.getID()];
        }
    };
    specialConfig.callbacks.not_encountered.splice(0, 1, notEncounteredJohnsons);
    var betterPathJohnsons = function (context) {
        var i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
        dists[i][j] = context.proposed_dist;
        if (context.current.node !== context.root_node) {
            next[i][j].splice(0, next[i][j].length, nodeIDIdxMap[context.current.node.getID()]);
        }
    };
    specialConfig.callbacks.better_path.splice(0, 1, betterPathJohnsons);
    var equalPathJohnsons = function (context) {
        var i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
        if (context.current.node !== context.root_node) {
            next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], [nodeIDIdxMap[context.current.node.getID()]]);
        }
    };
    specialConfig.callbacks.equal_path.push(equalPathJohnsons);
    for (var key in nodesDict) {
        $PFS.PFS(graph, nodesDict[key], specialConfig);
    }
    return [dists, next];
}
exports.PFSFromAllNodes = PFSFromAllNodes;
