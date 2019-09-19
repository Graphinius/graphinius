"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var DEFAULT_WEIGHT = 1;
var ComputeGraph = (function () {
    function ComputeGraph(_g, _tf) {
        this._g = _g;
        this._tf = _tf;
    }
    ComputeGraph.prototype.nextArray = function (incoming) {
        if (incoming === void 0) { incoming = false; }
        var next = [], node_keys = Object.keys(this._g.getNodes());
        var adjDict = this.adjListW(incoming, true, 0);
        for (var i = 0; i < this._g.nrNodes(); ++i) {
            next.push([]);
            for (var j = 0; j < this._g.nrNodes(); ++j) {
                next[i].push([]);
                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
            }
        }
        return next;
    };
    ComputeGraph.prototype.adjMatrix = function () {
        var adjList = [], node_keys = Object.keys(this._g.getNodes());
        var adjDict = this.adjListW();
        for (var i = 0; i < this._g.nrNodes(); ++i) {
            adjList.push([]);
            for (var j = 0; j < this._g.nrNodes(); ++j) {
                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? 1 : 0);
            }
        }
        return adjList;
    };
    ComputeGraph.prototype.adjMatrixW = function (incoming, include_self, self_dist) {
        if (incoming === void 0) { incoming = false; }
        if (include_self === void 0) { include_self = false; }
        if (self_dist === void 0) { self_dist = 0; }
        var adjList = [], node_keys = Object.keys(this._g.getNodes());
        var adjDict = this.adjListW(incoming, include_self, self_dist);
        for (var i = 0; i < this._g.nrNodes(); ++i) {
            adjList.push([]);
            for (var j = 0; j < this._g.nrNodes(); ++j) {
                adjList[i].push(i === j ? self_dist : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
            }
        }
        return adjList;
    };
    ComputeGraph.prototype.adjListW = function (incoming, include_self, self_dist) {
        if (incoming === void 0) { incoming = false; }
        if (include_self === void 0) { include_self = false; }
        if (self_dist === void 0) { self_dist = 0; }
        var adj_list_dict = {}, nodes = this._g.getNodes(), cur_dist, key, cur_edge_weight;
        for (key in nodes) {
            adj_list_dict[key] = {};
            if (include_self) {
                adj_list_dict[key][key] = self_dist;
            }
        }
        for (key in nodes) {
            var neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();
            neighbors.forEach(function (ne) {
                cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
                cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();
                if (cur_edge_weight < cur_dist) {
                    adj_list_dict[key][ne.node.getID()] = cur_edge_weight;
                    if (incoming) {
                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
                    }
                }
                else {
                    adj_list_dict[key][ne.node.getID()] = cur_dist;
                    if (incoming) {
                        adj_list_dict[ne.node.getID()][key] = cur_dist;
                    }
                }
            });
        }
        return adj_list_dict;
    };
    ComputeGraph.prototype.transitivity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tc, triads;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.triangleCount()];
                    case 1:
                        tc = _a.sent();
                        triads = this.triadCount();
                        return [2, {
                                und: 3 * tc.und / triads.und,
                                dir: null
                            }];
                }
            });
        });
    };
    ComputeGraph.prototype.triadCount = function () {
        var e_1, _a, e_2, _b;
        var und_count = 0;
        var dupes_set = new Set();
        var und_edges = Object.values(this._g.getUndEdges());
        var ia, ib, ja, jb, path_id;
        try {
            for (var und_edges_1 = __values(und_edges), und_edges_1_1 = und_edges_1.next(); !und_edges_1_1.done; und_edges_1_1 = und_edges_1.next()) {
                var i = und_edges_1_1.value;
                try {
                    for (var und_edges_2 = __values(und_edges), und_edges_2_1 = und_edges_2.next(); !und_edges_2_1.done; und_edges_2_1 = und_edges_2.next()) {
                        var j = und_edges_2_1.value;
                        if (i === j) {
                            continue;
                        }
                        ia = i.getNodes().a;
                        ib = i.getNodes().b;
                        ja = j.getNodes().a;
                        jb = j.getNodes().b;
                        if (ia === ib || ja === jb) {
                            continue;
                        }
                        if (ia === ja && ib !== jb) {
                            path_id = ib.id + "-" + ia.id + "-" + jb.id;
                            if (!dupes_set.has(path_id) && !dupes_set.has(path_id.split('-').reverse().join('-'))) {
                                dupes_set.add(path_id);
                                und_count++;
                            }
                        }
                        if (ib === jb && ia !== ja) {
                            path_id = ia.id + "-" + ib.id + "-" + ja.id;
                            if (!dupes_set.has(path_id) && !dupes_set.has(path_id.split('-').reverse().join('-'))) {
                                dupes_set.add(path_id);
                                und_count++;
                            }
                        }
                        if (ib === ja && ia !== jb) {
                            path_id = ia.id + "-" + ib.id + "-" + jb.id;
                            if (!dupes_set.has(path_id) && !dupes_set.has(path_id.split('-').reverse().join('-'))) {
                                dupes_set.add(path_id);
                                und_count++;
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (und_edges_2_1 && !und_edges_2_1.done && (_b = und_edges_2.return)) _b.call(und_edges_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (und_edges_1_1 && !und_edges_1_1.done && (_a = und_edges_1.return)) _a.call(und_edges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            dir: null,
            und: und_count
        };
    };
    ComputeGraph.prototype.triangleCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adj_list, a, aux2, aux3, trace, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._tf || !this._tf.matMul) {
                            throw new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef.");
                        }
                        adj_list = this.adjMatrix();
                        a = this._tf.tensor2d(adj_list);
                        return [4, a.matMul(a).array()];
                    case 1:
                        aux2 = _a.sent();
                        return [4, a.matMul(aux2).array()];
                    case 2:
                        aux3 = _a.sent();
                        trace = 0;
                        for (i = 0; i < aux3.length; i++) {
                            trace += aux3[i][i];
                        }
                        return [2, {
                                und: trace / 6,
                                dir: trace / 3
                            }];
                }
            });
        });
    };
    return ComputeGraph;
}());
exports.ComputeGraph = ComputeGraph;
