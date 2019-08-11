"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $N = require("../core/base/BaseNode");
const $PFS = require("../search/PFS");
const $BF = require("../search/BellmanFord");
const $SU = require("../utils/StructUtils");
function Johnsons(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    let allNodes = graph.getNodes();
    if (graph.hasNegativeEdge()) {
        let extraNode = new $N.BaseNode("extraNode");
        graph = addExtraNandE(graph, extraNode);
        let BFresult = $BF.BellmanFordDict(graph, extraNode);
        if (BFresult.neg_cycle) {
            throw new Error("The graph contains a negative cycle, thus it can not be processed");
        }
        else {
            let newWeights = BFresult.distances;
            graph = reWeighGraph(graph, newWeights, extraNode);
            graph.deleteNode(extraNode);
            return PFSFromAllNodes(graph);
        }
    }
    return PFSFromAllNodes(graph);
}
exports.Johnsons = Johnsons;
function addExtraNandE(target, nodeToAdd) {
    let allNodes = target.getNodes();
    target.addNode(nodeToAdd);
    let tempCounter = 0;
    for (let nodeKey in allNodes) {
        if (allNodes[nodeKey].getID() != nodeToAdd.getID()) {
            target.addEdgeByNodeIDs("temp" + tempCounter, nodeToAdd.getID(), allNodes[nodeKey].getID(), { directed: true, weighted: true, weight: 0 });
            tempCounter++;
        }
    }
    return target;
}
exports.addExtraNandE = addExtraNandE;
function reWeighGraph(target, distDict, tempNode) {
    let edges = target.getDirEdgesArray().concat(target.getUndEdgesArray());
    for (let edge of edges) {
        let a = edge.getNodes().a.getID();
        let b = edge.getNodes().b.getID();
        if (a !== tempNode.getID() && edge.isWeighted) {
            let oldWeight = edge.getWeight();
            let newWeight = oldWeight + distDict[a] - distDict[b];
            edge.setWeight(newWeight);
        }
        else {
            let newWeight = $PFS.DEFAULT_WEIGHT + distDict[a] - distDict[b];
            let edgeID = edge.getID();
            let dirNess = edge.isDirected();
            target.deleteEdge(edge);
            target.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
        }
    }
    return target;
}
exports.reWeighGraph = reWeighGraph;
function PFSFromAllNodes(graph) {
    let dists = graph.adjListArray();
    let next = graph.nextArray();
    let nodesDict = graph.getNodes();
    let nodeIDIdxMap = {};
    let i = 0;
    for (let key in nodesDict) {
        nodeIDIdxMap[nodesDict[key].getID()] = i++;
    }
    let specialConfig = $PFS.preparePFSStandardConfig();
    let notEncounteredJohnsons = function (context) {
        context.next.best = context.current.best + context.next.edge.getWeight();
        let i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
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
    let betterPathJohnsons = function (context) {
        let i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
        dists[i][j] = context.proposed_dist;
        if (context.current.node !== context.root_node) {
            next[i][j].splice(0, next[i][j].length, nodeIDIdxMap[context.current.node.getID()]);
        }
    };
    specialConfig.callbacks.better_path.splice(0, 1, betterPathJohnsons);
    let equalPathJohnsons = function (context) {
        let i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
        if (context.current.node !== context.root_node) {
            next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], [nodeIDIdxMap[context.current.node.getID()]]);
        }
    };
    specialConfig.callbacks.equal_path.push(equalPathJohnsons);
    for (let key in nodesDict) {
        $PFS.PFS(graph, nodesDict[key], specialConfig);
    }
    return [dists, next];
}
exports.PFSFromAllNodes = PFSFromAllNodes;
