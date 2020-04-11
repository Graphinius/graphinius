"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../../utils/Logger");
var logger = new Logger_1.Logger();
var DEFAULT_WEIGHT = 1;
var ComputeGraph = (function () {
    function ComputeGraph(_g, _numeric) {
        this._g = _g;
        this._numeric = _numeric;
    }
    ComputeGraph.prototype.checkNumericHandler = function () {
        if (!this._numeric || !this._numeric.matMul) {
            throw new Error("Tensorflow & TF matMul function must be present in order to compute transitivity.");
        }
    };
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
    ComputeGraph.prototype.triadCount = function (directed) {
        var e_1, _a;
        if (directed === void 0) { directed = false; }
        var triangle_count = 0;
        var nodes = Object.values(this._g.getNodes());
        var deg;
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var n = nodes_1_1.value;
                if (directed) {
                    triangle_count += (n.in_deg - n.self_in_deg) * (n.out_deg - n.self_out_deg);
                }
                else {
                    deg = n.deg - n.self_deg;
                    triangle_count += deg * (deg - 1) / 2;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return triangle_count;
    };
    ComputeGraph.prototype.triangleCount = function (directed) {
        if (directed === void 0) { directed = false; }
        return __awaiter(this, void 0, void 0, function () {
            var adj_list, a, aux2, aux3, trace, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkNumericHandler();
                        adj_list = this.adjMatrix();
                        a = this._numeric.tensor2d(adj_list);
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
                        return [2, directed ? trace / 3 : trace / 6];
                }
            });
        });
    };
    ComputeGraph.prototype.globalCC = function (directed) {
        if (directed === void 0) { directed = false; }
        return __awaiter(this, void 0, void 0, function () {
            var triangles, triads;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.triangleCount(directed)];
                    case 1:
                        triangles = _a.sent();
                        triads = this.triadCount(directed);
                        return [2, 3 * triangles / triads];
                }
            });
        });
    };
    ComputeGraph.prototype.localCC = function (directed) {
        if (directed === void 0) { directed = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result, adj_list, a, aux2, aux3, deg, node, cc_i, keys, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkNumericHandler();
                        result = {};
                        adj_list = this.adjMatrix();
                        a = this._numeric.tensor2d(adj_list);
                        return [4, a.matMul(a).array()];
                    case 1:
                        aux2 = _a.sent();
                        return [4, a.matMul(aux2).array()];
                    case 2:
                        aux3 = _a.sent();
                        keys = Object.keys(this._g.getNodes());
                        for (i in aux3[0]) {
                            node = this._g.getNodeById(keys[i]);
                            deg = directed ? node.in_deg + node.out_deg : node.deg;
                            cc_i = (aux3[i][i] / (deg * (deg - 1))) || 0;
                            result[i] = directed ? 2 * cc_i : cc_i;
                        }
                        return [2, result];
                }
            });
        });
    };
    return ComputeGraph;
}());
exports.ComputeGraph = ComputeGraph;
