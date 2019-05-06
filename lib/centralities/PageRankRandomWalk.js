"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/structUtils");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 0.15;
const DEFAULT_MAX_ITERATIONS = 1e3;
const DEFAULT_CONVERGENCE = 1e-4;
const defaultInit = (graph) => 1 / graph.nrNodes();
const defaultAlphaDamp = (graph) => graph.nrNodes();
class PageRankRandomWalk {
    constructor(_graph, config) {
        this._graph = _graph;
        config = config || {};
        this._weighted = config.weighted || DEFAULT_WEIGHTED;
        this._alpha = config.alpha || DEFAULT_ALPHA;
        this._alpha;
        this._maxIterations = config.iterations || DEFAULT_MAX_ITERATIONS;
        this._convergence = config.convergence || DEFAULT_CONVERGENCE;
        this._init = config.init ? config.init(this._graph) : defaultInit(this._graph);
        this._alphaDamp = config.alphaDamp ? config.alphaDamp(this._graph) : defaultAlphaDamp(this._graph);
        this._PRArrayDS = {
            curr: [],
            old: [],
            outDeg: [],
            pull: []
        };
        this.setPRArrayDataStructs();
    }
    setPRArrayDataStructs() {
        let tic = +new Date;
        let nodes = this._graph.getNodes();
        let i = 0;
        for (let key in nodes) {
            let node = this._graph.getNodeById(key);
            node.setFeature('PR_index', i);
            this._PRArrayDS.curr[i] = this._init;
            this._PRArrayDS.old[i] = this._init;
            this._PRArrayDS.outDeg[i] = node.outDegree() + node.degree();
            ++i;
        }
        for (let key in nodes) {
            let node = this._graph.getNodeById(key);
            let node_idx = node.getFeature('PR_index');
            let pull_i = [];
            let incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            for (let edge_key in incomingEdges) {
                let edge = incomingEdges[edge_key];
                let source = edge.getNodes().a;
                if (edge.getNodes().a.getID() == node.getID()) {
                    source = edge.getNodes().b;
                }
                let parent_idx = source.getFeature('PR_index');
                pull_i.push(parent_idx);
            }
            this._PRArrayDS.pull[node_idx] = pull_i;
        }
        let toc = +new Date;
        logger.log(`PR Array DS init took ${toc - tic} ms.`);
    }
    getPRArray() {
        let ds = this._PRArrayDS;
        let visits = 0;
        for (let i = 0; i < this._maxIterations; ++i) {
            let delta_iter = 0.0;
            for (let node in ds.curr) {
                let pull_rank = 0;
                visits++;
                for (let source of ds.pull[node]) {
                    visits++;
                    if (ds.outDeg[source] === 0) {
                        logger.log(`Node: ${node}`);
                        logger.log(`Source: ${source} `);
                        throw ('GOT ZERO DIVISOR !!! -------------------------------------');
                    }
                    pull_rank += ds.old[source] / ds.outDeg[source];
                }
                ds.curr[node] = (1 - this._alpha) * pull_rank + this._alpha / this._alphaDamp;
                delta_iter += Math.abs(ds.curr[node] - ds.old[node]);
            }
            if (delta_iter <= this._convergence) {
                logger.log(`CONVERGED after ${i} iterations with ${visits} visits and a final delta of ${delta_iter}.`);
                return this.getRankMapFromArray();
            }
            ds.old = [...ds.curr];
        }
        logger.log(`ABORTED after ${this._maxIterations} iterations with ${visits} visits.`);
        return this.getRankMapFromArray();
    }
    getRankMapFromArray() {
        let result = {};
        let nodes = this._graph.getNodes();
        for (let key in nodes) {
            result[key] = this._PRArrayDS.curr[nodes[key].getFeature('PR_index')];
        }
        return result;
    }
    getPRDict() {
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
            for (let edge_key in incomingEdges) {
                let edge = incomingEdges[edge_key];
                let source = edge.getNodes().a;
                if (edge.getNodes().a.getID() == node.getID())
                    source = edge.getNodes().b;
                structure[key]['inc'].push(source.getID());
            }
            curr[key] = this._init;
            old[key] = this._init;
        }
        let visits = 0;
        for (let i = 0; i < this._maxIterations; ++i) {
            let delta_iter = 0.0;
            for (let key in nodes) {
                let pull_rank = 0;
                visits++;
                let sources = structure[key]['inc'];
                for (let k in sources) {
                    visits++;
                    let p = String(sources[k]);
                    pull_rank += old[p] / structure[p]['deg'];
                }
                curr[key] = (1 - this._alpha) * pull_rank + this._alpha / this._alphaDamp;
                delta_iter += Math.abs(curr[key] - old[key]);
            }
            if (delta_iter <= this._convergence) {
                logger.log(`CONVERGED after ${i} iterations with ${visits} visits and a final delta of ${delta_iter}.`);
                return curr;
            }
            old = $SU.clone(curr);
        }
        logger.log(`ABORTED after ${this._maxIterations} iterations with ${visits} visits.`);
        return curr;
    }
}
exports.PageRankRandomWalk = PageRankRandomWalk;
