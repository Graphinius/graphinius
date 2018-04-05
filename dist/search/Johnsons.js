"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $N = require("../core/Nodes");
var $PFS = require("../search/PFS");
var $BF = require("../search/BellmanFord");
var $SU = require("../utils/structUtils");
function Johnsons(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    //getting all graph nodes
    var allNodes = graph.getNodes();
    var nodeKeys = Object.keys(allNodes);
    if (graph.hasNegativeEdge()) {
        var extraNode = new $N.BaseNode("extraNode");
        graph = addExtraNandE(graph, extraNode);
        var BFresult = $BF.BellmanFordDict(graph, extraNode);
        //reminder: output of the BellmanFordDict is BFDictResult
        //contains a dictionary called distances, format: {[nodeID]:dist}, and a boolean called neg_cycle
        if (BFresult.neg_cycle) {
            throw new Error("The graph contains a negative cycle, thus it can not be processed");
        }
        else {
            var newWeights = BFresult.distances;
            graph = reWeighGraph(graph, newWeights, extraNode);
            //graph still has the extraNode
            //reminder: deleteNode function removes its edges, too
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
    //now add a directed edge from the extranode to all graph nodes, excluding itself
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
    //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
    var edges = target.getDirEdgesArray().concat(target.getUndEdgesArray());
    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
        var edge = edges_1[_i];
        var a = edge.getNodes().a.getID();
        var b = edge.getNodes().b.getID();
        //no need to re-weigh the temporary edges starting from the extraNode, they will be deleted anyway
        if (a == tempNode.getID()) {
            continue;
        }
        //assuming that the node keys in the distDict correspond to the nodeIDs
        else if (edge.isWeighted) {
            var oldWeight = edge.getWeight();
            var newWeight = oldWeight + distDict[a] - distDict[b];
            edge.setWeight(newWeight);
        }
        else {
            var oldWeight = $PFS.DEFAULT_WEIGHT; //which is 1
            var newWeight = oldWeight + distDict[a] - distDict[b];
            //collecting edgeID and directedness for later re-use
            var edgeID = edge.getID();
            var dirNess = edge.isDirected();
            //one does not simply make an edge weighted, but needs to delete and re-create it
            target.deleteEdge(edge);
            target.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
        }
    }
    return target;
}
exports.reWeighGraph = reWeighGraph;
function PFSFromAllNodes(graph) {
    var dists = graph.adjListArray();
    var next = graph.nextArray();
    var nodesDict = graph.getNodes();
    var nodeIDIdxMap = {};
    var i = 0;
    for (var key in nodesDict) {
        nodeIDIdxMap[nodesDict[key].getID()] = i++;
    }
    var specialConfig = $PFS.preparePFSStandardConfig();
    var notEncounteredJohnsons = function (context) {
        context.next.best =
            context.current.best + (isNaN(context.next.edge.getWeight()) ? $PFS.DEFAULT_WEIGHT : context.next.edge.getWeight());
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
