"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/StructUtils");
const Logger_1 = require("../utils/Logger");
const logger = new Logger_1.Logger();
const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 0.15;
const DEFAULT_MAX_ITERATIONS = 1e3;
const DEFAULT_EPSILON = 1e-6;
const DEFAULT_NORMALIZE = false;
const defaultInit = (graph) => 1 / graph.nrNodes();
class Pagerank {
    constructor(_graph, config) {
        this._graph = _graph;
        config = config || {};
        this._weighted = config.weighted || DEFAULT_WEIGHTED;
        this._alpha = config.alpha || DEFAULT_ALPHA;
        this._maxIterations = config.iterations || DEFAULT_MAX_ITERATIONS;
        this._epsilon = config.epsilon || DEFAULT_EPSILON;
        this._normalize = config.normalize || DEFAULT_NORMALIZE;
        this._personalized = config.personalized ? config.personalized : false;
        if (this._personalized && !config.tele_set) {
            throw Error("Personalized Pagerank requires tele_set as a config argument");
        }
        if (config.init_map && Object.keys(config.init_map).length !== this._graph.nrNodes()) {
            throw Error("init_map config parameter must be of size |nodes|");
        }
        this._PRArrayDS = config.PRArrays || {
            curr: [],
            old: [],
            out_deg: [],
            pull: [],
            pull_weight: this._weighted ? [] : null,
            teleport: config.tele_set ? [] : null,
            tele_size: config.tele_set ? 0 : null
        };
        config.PRArrays || this.constructPRArrayDataStructs(config);
    }
    getConfig() {
        return {
            _weighted: this._weighted,
            _alpha: this._alpha,
            _maxIterations: this._maxIterations,
            _epsilon: this._epsilon,
            _normalize: this._normalize,
        };
    }
    getDSs() {
        return this._PRArrayDS;
    }
    constructPRArrayDataStructs(config) {
        let tic = +new Date;
        let nodes = this._graph.getNodes();
        let i = 0;
        let teleport_prob_sum = 0;
        let init_sum = 0;
        for (let key in nodes) {
            let node = this._graph.getNodeById(key);
            node.setFeature('PR_index', i);
            if (config.init_map) {
                if (config.init_map[key] == null) {
                    throw Error("initial value must be given for each node in the graph.");
                }
                let val = config.init_map[key];
                this._PRArrayDS.curr[i] = val;
                this._PRArrayDS.old[i] = val;
                init_sum += val;
            }
            else {
                this._PRArrayDS.curr[i] = defaultInit(this._graph);
                this._PRArrayDS.old[i] = defaultInit(this._graph);
            }
            this._PRArrayDS.out_deg[i] = node.outDegree() + node.degree();
            if (this._personalized) {
                let tele_prob_node = config.tele_set[node.getID()] || 0;
                this._PRArrayDS.teleport[i] = tele_prob_node;
                teleport_prob_sum += tele_prob_node;
                tele_prob_node && this._PRArrayDS.tele_size++;
            }
            ++i;
        }
        if (config.init_map && init_sum !== 1) {
            this._PRArrayDS.curr = this._PRArrayDS.curr.map(n => n /= init_sum);
            this._PRArrayDS.old = this._PRArrayDS.old.map(n => n /= init_sum);
        }
        if (this._personalized && teleport_prob_sum !== 1) {
            this._PRArrayDS.teleport = this._PRArrayDS.teleport.map(n => n /= teleport_prob_sum);
        }
        for (let key in nodes) {
            let node = this._graph.getNodeById(key);
            let node_idx = node.getFeature('PR_index');
            let pull_i = [];
            let pull_weight_i = [];
            let incoming_edges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
            for (let edge_key in incoming_edges) {
                let edge = incoming_edges[edge_key];
                let source = edge.getNodes().a;
                if (edge.getNodes().a.getID() == node.getID()) {
                    source = edge.getNodes().b;
                }
                let parent_idx = source.getFeature('PR_index');
                if (this._weighted) {
                    pull_weight_i.push(edge.getWeight());
                }
                pull_i.push(parent_idx);
            }
            this._PRArrayDS.pull[node_idx] = pull_i;
            if (this._weighted) {
                this._PRArrayDS.pull_weight[node_idx] = pull_weight_i;
            }
        }
        let toc = +new Date;
        logger.log(`PR Array DS init took ${toc - tic} ms.`);
    }
    getRankMapFromArray() {
        let result = {};
        let nodes = this._graph.getNodes();
        if (this._normalize) {
            this.normalizePR();
        }
        for (let key in nodes) {
            let node_val = this._PRArrayDS.curr[nodes[key].getFeature('PR_index')];
            result[key] = node_val;
        }
        return result;
    }
    normalizePR() {
        let pr_sum = this._PRArrayDS.curr.reduce((i, j) => i + j, 0);
        if (pr_sum !== 1) {
            this._PRArrayDS.curr = this._PRArrayDS.curr.map(n => n / pr_sum);
        }
    }
    pull2DTo1D() {
        let p1d = [];
        let p2d = this._PRArrayDS.pull;
        for (let n in p2d) {
            for (let i of p2d[n]) {
                p1d.push(i);
            }
            +n !== p2d.length - 1 && p1d.push(-1);
        }
        return p1d;
    }
    computePR() {
        const ds = this._PRArrayDS;
        const N = this._graph.nrNodes();
        let visits = 0;
        for (let i = 0; i < this._maxIterations; ++i) {
            let delta_iter = 0.0;
            for (let node in ds.curr) {
                let pull_rank = 0;
                visits++;
                let idx = 0;
                for (let source of ds.pull[node]) {
                    visits++;
                    if (ds.out_deg[source] === 0) {
                        logger.log(`Node: ${node}`);
                        logger.log(`Source: ${source} `);
                        throw ('Encountered zero divisor!');
                    }
                    let weight = this._weighted ? ds.pull_weight[node][idx++] : 1.0;
                    pull_rank += ds.old[source] * weight / ds.out_deg[source];
                }
                let link_pr = (1 - this._alpha) * pull_rank;
                if (this._personalized) {
                    let jump_chance = ds.teleport[node] / ds.tele_size;
                    ds.curr[node] = link_pr + jump_chance;
                }
                else {
                    ds.curr[node] = link_pr + this._alpha / N;
                }
                delta_iter += Math.abs(ds.curr[node] - ds.old[node]);
            }
            if (delta_iter <= this._epsilon) {
                return this.getRankMapFromArray();
            }
            ds.old = [...ds.curr];
        }
        return this.getRankMapFromArray();
    }
}
exports.Pagerank = Pagerank;
