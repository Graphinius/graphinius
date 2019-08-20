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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var StructUtils_1 = require("../utils/StructUtils");
var DEFAULT_WEIGHTED = false;
var DEFAULT_ALPHA = 0.15;
var DEFAULT_MAX_ITERATIONS = 1e3;
var DEFAULT_EPSILON = 1e-6;
var DEFAULT_NORMALIZE = false;
var defaultInit = function (graph) { return 1 / graph.nrNodes(); };
var Pagerank = (function () {
    function Pagerank(_graph, config) {
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
    Pagerank.prototype.getConfig = function () {
        return {
            _weighted: this._weighted,
            _alpha: this._alpha,
            _maxIterations: this._maxIterations,
            _epsilon: this._epsilon,
            _normalize: this._normalize,
        };
    };
    Pagerank.prototype.getDSs = function () {
        return this._PRArrayDS;
    };
    Pagerank.prototype.constructPRArrayDataStructs = function (config) {
        var tic = +new Date;
        var nodes = this._graph.getNodes();
        var i = 0;
        var teleport_prob_sum = 0;
        var init_sum = 0;
        for (var key in nodes) {
            var node = this._graph.getNodeById(key);
            node.setFeature('PR_index', i);
            if (config.init_map) {
                if (config.init_map[key] == null) {
                    throw Error("initial value must be given for each node in the graph.");
                }
                var val = config.init_map[key];
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
                var tele_prob_node = config.tele_set[node.getID()] || 0;
                this._PRArrayDS.teleport[i] = tele_prob_node;
                teleport_prob_sum += tele_prob_node;
                tele_prob_node && this._PRArrayDS.tele_size++;
            }
            ++i;
        }
        if (config.init_map && init_sum !== 1) {
            this._PRArrayDS.curr = this._PRArrayDS.curr.map(function (n) { return n /= init_sum; });
            this._PRArrayDS.old = this._PRArrayDS.old.map(function (n) { return n /= init_sum; });
        }
        if (this._personalized && teleport_prob_sum !== 1) {
            this._PRArrayDS.teleport = this._PRArrayDS.teleport.map(function (n) { return n /= teleport_prob_sum; });
        }
        for (var key in nodes) {
            var node = this._graph.getNodeById(key);
            var node_idx = node.getFeature('PR_index');
            var pull_i = [];
            var pull_weight_i = [];
            var incoming_edges = StructUtils_1.mergeObjects([node.inEdges(), node.undEdges()]);
            for (var edge_key in incoming_edges) {
                var edge = incoming_edges[edge_key];
                var source = edge.getNodes().a;
                if (edge.getNodes().a.getID() == node.getID()) {
                    source = edge.getNodes().b;
                }
                var parent_idx = source.getFeature('PR_index');
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
        var toc = +new Date;
    };
    Pagerank.prototype.getRankMapFromArray = function () {
        var result = {};
        var nodes = this._graph.getNodes();
        if (this._normalize) {
            this.normalizePR();
        }
        for (var key in nodes) {
            var node_val = this._PRArrayDS.curr[nodes[key].getFeature('PR_index')];
            result[key] = node_val;
        }
        return result;
    };
    Pagerank.prototype.normalizePR = function () {
        var pr_sum = this._PRArrayDS.curr.reduce(function (i, j) { return i + j; }, 0);
        if (pr_sum !== 1) {
            this._PRArrayDS.curr = this._PRArrayDS.curr.map(function (n) { return n / pr_sum; });
        }
    };
    Pagerank.prototype.pull2DTo1D = function () {
        var e_1, _a;
        var p1d = [];
        var p2d = this._PRArrayDS.pull;
        for (var n in p2d) {
            try {
                for (var _b = __values(p2d[n]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var i = _c.value;
                    p1d.push(i);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            +n !== p2d.length - 1 && p1d.push(-1);
        }
        return p1d;
    };
    Pagerank.prototype.computePR = function () {
        var e_2, _a;
        var ds = this._PRArrayDS;
        var N = this._graph.nrNodes();
        var visits = 0;
        for (var i = 0; i < this._maxIterations; ++i) {
            var delta_iter = 0.0;
            for (var node in ds.curr) {
                var pull_rank = 0;
                visits++;
                var idx = 0;
                try {
                    for (var _b = __values(ds.pull[node]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var source = _c.value;
                        visits++;
                        if (ds.out_deg[source] === 0) {
                            throw ('Encountered zero divisor!');
                        }
                        var weight = this._weighted ? ds.pull_weight[node][idx++] : 1.0;
                        pull_rank += ds.old[source] * weight / ds.out_deg[source];
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var link_pr = (1 - this._alpha) * pull_rank;
                if (this._personalized) {
                    var jump_chance = ds.teleport[node] / ds.tele_size;
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
            ds.old = __spread(ds.curr);
        }
        return this.getRankMapFromArray();
    };
    return Pagerank;
}());
exports.Pagerank = Pagerank;
