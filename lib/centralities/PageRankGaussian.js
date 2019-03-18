"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/structUtils");
const $GAUSS = require("./Gauss");
class pageRankDetCentrality {
    getCentralityMap(graph, weighted) {
        let divideTable = {};
        let matr = [];
        let ctr = 0;
        let map = {};
        for (let key in graph.getNodes()) {
            divideTable[key] = 0;
        }
        for (let key in graph.getNodes()) {
            map[key] = ctr;
            let node = graph.getNodeById(key);
            let node_InEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            matr[ctr] = new Array();
            for (let edgeKey in node_InEdges) {
                let edge = node_InEdges[edgeKey];
                if (edge.getNodes().a.getID() == node.getID()) {
                    matr[ctr].push(edge.getNodes().b.getID());
                    divideTable[edge.getNodes().b.getID()]++;
                }
                else {
                    matr[ctr].push(edge.getNodes().a.getID());
                    divideTable[edge.getNodes().a.getID()]++;
                }
            }
            matr[ctr].push(node.getID());
            ctr++;
        }
        ctr = 0;
        let mapCtr = {};
        let numMatr = [[]];
        for (let key in matr) {
            numMatr[key] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
            let p = matr[key].pop();
            if (mapCtr[p] == null)
                mapCtr[p] = ctr++;
            numMatr[key][mapCtr[p]] = -1;
            for (let k in matr[key]) {
                let a = matr[key][k];
                if (mapCtr[a] == null)
                    mapCtr[a] = ctr++;
                numMatr[key][mapCtr[a]] += 1 / divideTable[a];
            }
        }
        numMatr[numMatr.length - 1] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 1);
        let x = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
        x[x.length - 1] = 1;
        x = $GAUSS.gauss(numMatr, x);
        let y = {};
        for (let key in map) {
            y[key] = x[ctr];
        }
        return x;
    }
}
exports.pageRankDetCentrality = pageRankDetCentrality;
