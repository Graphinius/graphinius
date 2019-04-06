"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/structUtils");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 1e-1;
const DEFAULT_ITERATIONS = 1e3;
const DEFAULT_CONVERGENCE = 1.25e-4;
class PageRankRandomWalk {
    constructor(_graph, config) {
        this._graph = _graph;
        config = config || {};
        this._weighted = config.weighted || DEFAULT_WEIGHTED;
        this._alpha = config.alpha || DEFAULT_ALPHA;
        this._iterations = config.iterations || DEFAULT_ITERATIONS;
        this._convergence = config.convergence || DEFAULT_CONVERGENCE;
    }
    getCentralityMap() {
        let curr = {};
        let old = {};
        let nodes = this._graph.getNodes();
        let nrNodes = this._graph.nrNodes();
        let structure = {};
        for (let key in nodes) {
            let node = this._graph.getNodeById(key);
            structure[key] = {};
            structure[key]['deg'] = node.outDegree() + node.degree();
            structure[key]['inc'] = [];
            let incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            for (let edge in incomingEdges) {
                let edgeNode = incomingEdges[edge];
                let parent = edgeNode.getNodes().a;
                if (edgeNode.getNodes().a.getID() == node.getID())
                    parent = edgeNode.getNodes().b;
                structure[key]['inc'].push(parent.getID());
            }
        }
        for (let key in nodes) {
            curr[key] = 1 / nrNodes;
            old[key] = 1 / nrNodes;
        }
        for (let i = 0; i < this._iterations; i++) {
            let me = 0.0;
            for (let key in nodes) {
                let total = 0;
                let parents = structure[key]['inc'];
                for (let k in parents) {
                    let p = String(parents[k]);
                    total += old[p] / structure[p]['deg'];
                }
                curr[key] = total * (1 - this._alpha) + this._alpha / nrNodes;
                me += Math.abs(curr[key] - old[key]);
            }
            if (me <= this._convergence) {
                return curr;
            }
            old = $SU.clone(curr);
        }
        return curr;
    }
}
exports.PageRankRandomWalk = PageRankRandomWalk;
