/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Edges			      = __webpack_require__(1);
	var Nodes 		      = __webpack_require__(2);
	var Graph 		      = __webpack_require__(4);
	var CSVInput 	      = __webpack_require__(13);
	var CSVOutput       = __webpack_require__(18);
	var JSONInput       = __webpack_require__(19);
	var JSONOutput      = __webpack_require__(20);
	var BFS				      = __webpack_require__(7);
	var DFS				      = __webpack_require__(9);
	var PFS             = __webpack_require__(11);
	var BellmanFord     = __webpack_require__(10);
	var FloydWarshall		= __webpack_require__(21);
	var structUtils     = __webpack_require__(3);
	var remoteUtils     = __webpack_require__(17);
	var callbackUtils   = __webpack_require__(8);
	var randGen         = __webpack_require__(22);
	var binaryHeap      = __webpack_require__(12);
	var simplePerturbation = __webpack_require__(23);
	var MCMFBoykov			= __webpack_require__(24);
	var DegreeCent		 	= __webpack_require__(25);
	var ClosenessCent	 	= __webpack_require__(26);
	var BetweennessCent	= __webpack_require__(27);
	var PRGauss					= __webpack_require__(28);
	var PRRandomWalk		= __webpack_require__(30);

	// Define global object
	var out = typeof window !== 'undefined' ? window : global;

	/**
	 * Inside Global or Window object
	 */
	out.$G = {
		core: {
			BaseEdge 				: Edges.BaseEdge,
			BaseNode 				: Nodes.BaseNode,
			BaseGraph 			: Graph.BaseGraph,
			GraphMode		    : Graph.GraphMode
		},
		centralities: {
			Degree: DegreeCent,
			Closeness: ClosenessCent,
			Betweenness: BetweennessCent,
			PageRankGauss: PRGauss,
			PageRankRandWalk: PRRandomWalk
		},
		input: {
			CSVInput 		: CSVInput.CSVInput,
			JSONInput 	: JSONInput.JSONInput
		},
		output: {
			CSVOutput		: CSVOutput.CSVOutput,
			JSONOutput	: JSONOutput.JSONOutput
		},
		search: {
			BFS													   : BFS.BFS,
	    prepareBFSStandardConfig       : BFS.prepareBFSStandardConfig,
			DFS 												   : DFS.DFS,
			DFSVisit										   : DFS.DFSVisit,
			prepareDFSStandardConfig			 : DFS.prepareDFSStandardConfig,
			prepareDFSVisitStandardConfig	 : DFS.prepareDFSVisitStandardConfig,
	    PFS                            : PFS.PFS,
			preparePFSStandardConfig       : PFS.preparePFSStandardConfig,
			BellmanFord										 : BellmanFord,
			FloydWarshall									 : FloydWarshall
		},
		mincut: {
			MCMFBoykov										 : MCMFBoykov.MCMFBoykov
		},
	  utils: {
	    struct          : structUtils,
	    remote          : remoteUtils,
	    callback        : callbackUtils,
	    randgen         : randGen
	  },
	  datastructs: {
	    BinaryHeap  : binaryHeap.BinaryHeap
	  },
		perturbation: {
			SimplePerturber: simplePerturbation.SimplePerturber
		}
	};

	/**
	 * For NodeJS / CommonJS global object
	 */
	module.exports = out.$G;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var BaseEdge = (function () {
	    function BaseEdge(_id, _node_a, _node_b, options) {
	        this._id = _id;
	        this._node_a = _node_a;
	        this._node_b = _node_b;
	        if (!(_node_a instanceof $N.BaseNode) || !(_node_b instanceof $N.BaseNode)) {
	            throw new Error("cannot instantiate edge without two valid node objects");
	        }
	        options = options || {};
	        this._directed = options.directed || false;
	        this._weighted = options.weighted || false;
	        this._weight = this._weighted ? (isNaN(options.weight) ? 1 : options.weight) : undefined;
	        this._label = options.label || this._id;
	    }
	    BaseEdge.prototype.getID = function () {
	        return this._id;
	    };
	    BaseEdge.prototype.getLabel = function () {
	        return this._label;
	    };
	    BaseEdge.prototype.setLabel = function (label) {
	        this._label = label;
	    };
	    BaseEdge.prototype.isDirected = function () {
	        return this._directed;
	    };
	    BaseEdge.prototype.isWeighted = function () {
	        return this._weighted;
	    };
	    BaseEdge.prototype.getWeight = function () {
	        return this._weight;
	    };
	    BaseEdge.prototype.setWeight = function (w) {
	        if (!this._weighted) {
	            throw new Error("Cannot set weight on unweighted edge.");
	        }
	        this._weight = w;
	    };
	    BaseEdge.prototype.getNodes = function () {
	        return { a: this._node_a, b: this._node_b };
	    };
	    BaseEdge.prototype.clone = function (new_node_a, new_node_b) {
	        if (!(new_node_a instanceof $N.BaseNode) || !(new_node_b instanceof $N.BaseNode)) {
	            throw new Error("refusing to clone edge if any new node is invalid");
	        }
	        return new BaseEdge(this._id, new_node_a, new_node_b, {
	            directed: this._directed,
	            weighted: this._weighted,
	            weight: this._weight,
	            label: this._label
	        });
	    };
	    return BaseEdge;
	}());
	exports.BaseEdge = BaseEdge;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var BaseNode = (function () {
	    function BaseNode(_id, features) {
	        this._id = _id;
	        this._in_degree = 0;
	        this._out_degree = 0;
	        this._und_degree = 0;
	        this._in_edges = {};
	        this._out_edges = {};
	        this._und_edges = {};
	        this._features = typeof features !== 'undefined' ? $SU.clone(features) : {};
	        this._label = this._features["label"] || this._id;
	    }
	    BaseNode.prototype.getID = function () {
	        return this._id;
	    };
	    BaseNode.prototype.getLabel = function () {
	        return this._label;
	    };
	    BaseNode.prototype.setLabel = function (label) {
	        this._label = label;
	    };
	    BaseNode.prototype.getFeatures = function () {
	        return this._features;
	    };
	    BaseNode.prototype.getFeature = function (key) {
	        return this._features[key];
	    };
	    BaseNode.prototype.setFeatures = function (features) {
	        this._features = $SU.clone(features);
	    };
	    BaseNode.prototype.setFeature = function (key, value) {
	        this._features[key] = value;
	    };
	    BaseNode.prototype.deleteFeature = function (key) {
	        var feat = this._features[key];
	        delete this._features[key];
	        return feat;
	    };
	    BaseNode.prototype.clearFeatures = function () {
	        this._features = {};
	    };
	    BaseNode.prototype.inDegree = function () {
	        return this._in_degree;
	    };
	    BaseNode.prototype.outDegree = function () {
	        return this._out_degree;
	    };
	    BaseNode.prototype.degree = function () {
	        return this._und_degree;
	    };
	    BaseNode.prototype.addEdge = function (edge) {
	        var nodes = edge.getNodes();
	        if (nodes.a !== this && nodes.b !== this) {
	            throw new Error("Cannot add edge that does not connect to this node");
	        }
	        var edge_id = edge.getID();
	        if (edge.isDirected()) {
	            if (nodes.a === this && !this._out_edges[edge_id]) {
	                this._out_edges[edge_id] = edge;
	                this._out_degree += 1;
	                if (nodes.b === this && !this._in_edges[edge_id]) {
	                    this._in_edges[edge.getID()] = edge;
	                    this._in_degree += 1;
	                }
	            }
	            else if (!this._in_edges[edge_id]) {
	                this._in_edges[edge.getID()] = edge;
	                this._in_degree += 1;
	            }
	        }
	        else {
	            if (this._und_edges[edge.getID()]) {
	                throw new Error("Cannot add same undirected edge multiple times.");
	            }
	            this._und_edges[edge.getID()] = edge;
	            this._und_degree += 1;
	        }
	    };
	    BaseNode.prototype.hasEdge = function (edge) {
	        return !!this._in_edges[edge.getID()] || !!this._out_edges[edge.getID()] || !!this._und_edges[edge.getID()];
	    };
	    BaseNode.prototype.hasEdgeID = function (id) {
	        return !!this._in_edges[id] || !!this._out_edges[id] || !!this._und_edges[id];
	    };
	    BaseNode.prototype.getEdge = function (id) {
	        var edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
	        if (!edge) {
	            throw new Error("Cannot retrieve non-existing edge.");
	        }
	        return edge;
	    };
	    BaseNode.prototype.inEdges = function () {
	        return this._in_edges;
	    };
	    BaseNode.prototype.outEdges = function () {
	        return this._out_edges;
	    };
	    BaseNode.prototype.undEdges = function () {
	        return this._und_edges;
	    };
	    BaseNode.prototype.dirEdges = function () {
	        return $SU.mergeObjects([this._in_edges, this._out_edges]);
	    };
	    BaseNode.prototype.allEdges = function () {
	        return $SU.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
	    };
	    BaseNode.prototype.removeEdge = function (edge) {
	        if (!this.hasEdge(edge)) {
	            throw new Error("Cannot remove unconnected edge.");
	        }
	        var id = edge.getID();
	        var e = this._und_edges[id];
	        if (e) {
	            delete this._und_edges[id];
	            this._und_degree -= 1;
	        }
	        e = this._in_edges[id];
	        if (e) {
	            delete this._in_edges[id];
	            this._in_degree -= 1;
	        }
	        e = this._out_edges[id];
	        if (e) {
	            delete this._out_edges[id];
	            this._out_degree -= 1;
	        }
	    };
	    BaseNode.prototype.removeEdgeID = function (id) {
	        if (!this.hasEdgeID(id)) {
	            throw new Error("Cannot remove unconnected edge.");
	        }
	        var e = this._und_edges[id];
	        if (e) {
	            delete this._und_edges[id];
	            this._und_degree -= 1;
	        }
	        e = this._in_edges[id];
	        if (e) {
	            delete this._in_edges[id];
	            this._in_degree -= 1;
	        }
	        e = this._out_edges[id];
	        if (e) {
	            delete this._out_edges[id];
	            this._out_degree -= 1;
	        }
	    };
	    BaseNode.prototype.clearOutEdges = function () {
	        this._out_edges = {};
	        this._out_degree = 0;
	    };
	    BaseNode.prototype.clearInEdges = function () {
	        this._in_edges = {};
	        this._in_degree = 0;
	    };
	    BaseNode.prototype.clearUndEdges = function () {
	        this._und_edges = {};
	        this._und_degree = 0;
	    };
	    BaseNode.prototype.clearEdges = function () {
	        this.clearInEdges();
	        this.clearOutEdges();
	        this.clearUndEdges();
	    };
	    BaseNode.prototype.prevNodes = function () {
	        var prevs = [];
	        var key, edge;
	        for (key in this._in_edges) {
	            if (this._in_edges.hasOwnProperty(key)) {
	                edge = this._in_edges[key];
	                prevs.push({
	                    node: edge.getNodes().a,
	                    edge: edge
	                });
	            }
	        }
	        return prevs;
	    };
	    BaseNode.prototype.nextNodes = function () {
	        var nexts = [];
	        var key, edge;
	        for (key in this._out_edges) {
	            if (this._out_edges.hasOwnProperty(key)) {
	                edge = this._out_edges[key];
	                nexts.push({
	                    node: edge.getNodes().b,
	                    edge: edge
	                });
	            }
	        }
	        return nexts;
	    };
	    BaseNode.prototype.connNodes = function () {
	        var conns = [];
	        var key, edge;
	        for (key in this._und_edges) {
	            if (this._und_edges.hasOwnProperty(key)) {
	                edge = this._und_edges[key];
	                var nodes = edge.getNodes();
	                if (nodes.a === this) {
	                    conns.push({
	                        node: edge.getNodes().b,
	                        edge: edge
	                    });
	                }
	                else {
	                    conns.push({
	                        node: edge.getNodes().a,
	                        edge: edge
	                    });
	                }
	            }
	        }
	        return conns;
	    };
	    BaseNode.prototype.reachNodes = function (identityFunc) {
	        var identity = 0;
	        return $SU.mergeArrays([this.nextNodes(), this.connNodes()], identityFunc || function (ne) { return identity++; });
	    };
	    BaseNode.prototype.clone = function () {
	        var new_node = new BaseNode(this._id);
	        new_node.setFeatures(this.getFeatures());
	        return new_node;
	    };
	    return BaseNode;
	}());
	exports.BaseNode = BaseNode;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	function clone(obj) {
	    if (obj === null || typeof obj !== 'object') {
	        return obj;
	    }
	    if (obj instanceof $N.BaseNode || obj instanceof $E.BaseEdge) {
	        return;
	    }
	    var cloneObj = obj.constructor ? obj.constructor() : {};
	    for (var attribute in obj) {
	        if (!obj.hasOwnProperty(attribute)) {
	            continue;
	        }
	        if (typeof obj[attribute] === "object") {
	            cloneObj[attribute] = clone(obj[attribute]);
	        }
	        else {
	            cloneObj[attribute] = obj[attribute];
	        }
	    }
	    return cloneObj;
	}
	exports.clone = clone;
	function mergeArrays(args, cb) {
	    if (cb === void 0) { cb = undefined; }
	    for (var arg_idx in args) {
	        if (!Array.isArray(args[arg_idx])) {
	            throw new Error('Will only mergeArrays arrays');
	        }
	    }
	    var seen = {}, result = [], identity;
	    for (var i = 0; i < args.length; i++) {
	        for (var j = 0; j < args[i].length; j++) {
	            identity = typeof cb !== 'undefined' ? cb(args[i][j]) : args[i][j];
	            if (seen[identity] !== true) {
	                result.push(args[i][j]);
	                seen[identity] = true;
	            }
	        }
	    }
	    return result;
	}
	exports.mergeArrays = mergeArrays;
	function mergeObjects(args) {
	    for (var i = 0; i < args.length; i++) {
	        if (Object.prototype.toString.call(args[i]) !== '[object Object]') {
	            throw new Error('Will only take objects as inputs');
	        }
	    }
	    var result = {};
	    for (var i = 0; i < args.length; i++) {
	        for (var key in args[i]) {
	            if (args[i].hasOwnProperty(key)) {
	                result[key] = args[i][key];
	            }
	        }
	    }
	    return result;
	}
	exports.mergeObjects = mergeObjects;
	function findKey(obj, cb) {
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key) && cb(obj[key])) {
	            return key;
	        }
	    }
	    return undefined;
	}
	exports.findKey = findKey;
	function mergeOrderedArraysNoDups(a, b) {
	    var ret = [];
	    var idx_a = 0;
	    var idx_b = 0;
	    if (a[0] != null && b[0] != null) {
	        while (true) {
	            if (idx_a >= a.length || idx_b >= b.length)
	                break;
	            if (a[idx_a] == b[idx_b]) {
	                if (ret[ret.length - 1] != a[idx_a])
	                    ret.push(a[idx_a]);
	                idx_a++;
	                idx_b++;
	                continue;
	            }
	            if (a[idx_a] < b[idx_b]) {
	                ret.push(a[idx_a]);
	                idx_a++;
	                continue;
	            }
	            if (b[idx_b] < a[idx_a]) {
	                ret.push(b[idx_b]);
	                idx_b++;
	            }
	        }
	    }
	    while (idx_a < a.length) {
	        if (a[idx_a] != null)
	            ret.push(a[idx_a]);
	        idx_a++;
	    }
	    while (idx_b < b.length) {
	        if (b[idx_b] != null)
	            ret.push(b[idx_b]);
	        idx_b++;
	    }
	    return ret;
	}
	exports.mergeOrderedArraysNoDups = mergeOrderedArraysNoDups;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	var $DS = __webpack_require__(3);
	var logger_1 = __webpack_require__(5);
	var $BFS = __webpack_require__(7);
	var $DFS = __webpack_require__(9);
	var BellmanFord_1 = __webpack_require__(10);
	var logger = new logger_1.Logger();
	var DEFAULT_WEIGHT = 1;
	(function (GraphMode) {
	    GraphMode[GraphMode["INIT"] = 0] = "INIT";
	    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
	    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
	    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
	})(exports.GraphMode || (exports.GraphMode = {}));
	var GraphMode = exports.GraphMode;
	var BaseGraph = (function () {
	    function BaseGraph(_label) {
	        this._label = _label;
	        this._nr_nodes = 0;
	        this._nr_dir_edges = 0;
	        this._nr_und_edges = 0;
	        this._mode = GraphMode.INIT;
	        this._nodes = {};
	        this._dir_edges = {};
	        this._und_edges = {};
	    }
	    BaseGraph.prototype.toDirectedGraph = function () {
	        return this;
	    };
	    BaseGraph.prototype.toUndirectedGraph = function () {
	        return this;
	    };
	    BaseGraph.prototype.hasNegativeCycles = function (node) {
	        var _this = this;
	        var negative_edge = false, negative_cycle = false, start = node ? node : this.getRandomNode(), edge;
	        for (var edge_id in this._und_edges) {
	            edge = this._und_edges[edge_id];
	            if (edge.getWeight() < 0) {
	                return true;
	            }
	        }
	        for (var edge_id in this._dir_edges) {
	            edge = this._dir_edges[edge_id];
	            if (edge.getWeight() < 0) {
	                negative_edge = true;
	                break;
	            }
	        }
	        if (!negative_edge) {
	            return false;
	        }
	        $DFS.DFS(this, start).forEach(function (comp) {
	            var min_count = Number.POSITIVE_INFINITY, comp_start_node;
	            Object.keys(comp).forEach(function (node_id) {
	                if (min_count > comp[node_id].counter) {
	                    min_count = comp[node_id].counter;
	                    comp_start_node = node_id;
	                }
	            });
	            if (BellmanFord_1.BellmanFordArray(_this, _this._nodes[comp_start_node], true)) {
	                negative_cycle = true;
	            }
	        });
	        return negative_cycle;
	    };
	    BaseGraph.prototype.nextArray = function (incoming) {
	        if (incoming === void 0) { incoming = false; }
	        var next = [], node_keys = Object.keys(this._nodes);
	        var adjDict = this.adjListDict(incoming, true, 0);
	        for (var i = 0; i < this._nr_nodes; ++i) {
	            next.push([]);
	            for (var j = 0; j < this._nr_nodes; ++j) {
	                next[i].push([]);
	                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
	            }
	        }
	        return next;
	    };
	    BaseGraph.prototype.adjListArray = function (incoming) {
	        if (incoming === void 0) { incoming = false; }
	        var adjList = [], node_keys = Object.keys(this._nodes);
	        var adjDict = this.adjListDict(incoming, true, 0);
	        for (var i = 0; i < this._nr_nodes; ++i) {
	            adjList.push([]);
	            for (var j = 0; j < this._nr_nodes; ++j) {
	                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
	            }
	        }
	        return adjList;
	    };
	    BaseGraph.prototype.adjListDict = function (incoming, include_self, self_dist) {
	        if (incoming === void 0) { incoming = false; }
	        if (include_self === void 0) { include_self = false; }
	        if (self_dist === void 0) { self_dist = 0; }
	        var adj_list_dict = {}, nodes = this.getNodes(), cur_dist, key, cur_edge_weight;
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
	    BaseGraph.prototype.getMode = function () {
	        return this._mode;
	    };
	    BaseGraph.prototype.getStats = function () {
	        return {
	            mode: this._mode,
	            nr_nodes: this._nr_nodes,
	            nr_und_edges: this._nr_und_edges,
	            nr_dir_edges: this._nr_dir_edges,
	            density_dir: this._nr_dir_edges / (this._nr_nodes * (this._nr_nodes - 1)),
	            density_und: 2 * this._nr_und_edges / (this._nr_nodes * (this._nr_nodes - 1))
	        };
	    };
	    BaseGraph.prototype.degreeDistribution = function () {
	        var max_deg = 0, key, node, all_deg;
	        for (key in this._nodes) {
	            node = this._nodes[key];
	            all_deg = node.inDegree() + node.outDegree() + node.degree() + 1;
	            max_deg = all_deg > max_deg ? all_deg : max_deg;
	        }
	        var deg_dist = {
	            in: new Uint16Array(max_deg),
	            out: new Uint16Array(max_deg),
	            dir: new Uint16Array(max_deg),
	            und: new Uint16Array(max_deg),
	            all: new Uint16Array(max_deg)
	        };
	        for (key in this._nodes) {
	            node = this._nodes[key];
	            deg_dist.in[node.inDegree()]++;
	            deg_dist.out[node.outDegree()]++;
	            deg_dist.dir[node.inDegree() + node.outDegree()]++;
	            deg_dist.und[node.degree()]++;
	            deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
	        }
	        return deg_dist;
	    };
	    BaseGraph.prototype.nrNodes = function () {
	        return this._nr_nodes;
	    };
	    BaseGraph.prototype.nrDirEdges = function () {
	        return this._nr_dir_edges;
	    };
	    BaseGraph.prototype.nrUndEdges = function () {
	        return this._nr_und_edges;
	    };
	    BaseGraph.prototype.addNodeByID = function (id, opts) {
	        var node = new $N.BaseNode(id, opts);
	        return this.addNode(node) ? node : null;
	    };
	    BaseGraph.prototype.addNode = function (node) {
	        this._nodes[node.getID()] = node;
	        this._nr_nodes += 1;
	        return true;
	    };
	    BaseGraph.prototype.cloneAndAddNode = function (node) {
	        var new_node = new $N.BaseNode(node.getID());
	        new_node.setFeatures($DS.clone(node.getFeatures()));
	        this._nodes[node.getID()] = new_node;
	        this._nr_nodes += 1;
	        return new_node;
	    };
	    BaseGraph.prototype.hasNodeID = function (id) {
	        return !!this._nodes[id];
	    };
	    BaseGraph.prototype.getNodeById = function (id) {
	        return this._nodes[id];
	    };
	    BaseGraph.prototype.getNodes = function () {
	        return this._nodes;
	    };
	    BaseGraph.prototype.getRandomNode = function () {
	        return this.pickRandomProperty(this._nodes);
	    };
	    BaseGraph.prototype.deleteNode = function (node) {
	        var rem_node = this._nodes[node.getID()];
	        if (!rem_node) {
	            throw new Error('Cannot remove un-added node.');
	        }
	        var in_deg = node.inDegree();
	        var out_deg = node.outDegree();
	        var deg = node.degree();
	        if (in_deg) {
	            this.deleteInEdgesOf(node);
	        }
	        if (out_deg) {
	            this.deleteOutEdgesOf(node);
	        }
	        if (deg) {
	            this.deleteUndEdgesOf(node);
	        }
	        delete this._nodes[node.getID()];
	        this._nr_nodes -= 1;
	    };
	    BaseGraph.prototype.hasEdgeID = function (id) {
	        return !!this._dir_edges[id] || !!this._und_edges[id];
	    };
	    BaseGraph.prototype.hasEdgeLabel = function (label) {
	        var dir_id = $DS.findKey(this._dir_edges, function (edge) {
	            return edge.getLabel() === label;
	        });
	        var und_id = $DS.findKey(this._und_edges, function (edge) {
	            return edge.getLabel() === label;
	        });
	        return !!dir_id || !!und_id;
	    };
	    BaseGraph.prototype.getEdgeById = function (id) {
	        var edge = this._dir_edges[id] || this._und_edges[id];
	        if (!edge) {
	            throw new Error("cannot retrieve edge with non-existing ID.");
	        }
	        return edge;
	    };
	    BaseGraph.prototype.checkExistanceOfEdgeNodes = function (node_a, node_b) {
	        if (!node_a) {
	            throw new Error("Cannot find edge. Node A does not exist (in graph).");
	        }
	        if (!node_b) {
	            throw new Error("Cannot find edge. Node B does not exist (in graph).");
	        }
	    };
	    BaseGraph.prototype.getDirEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        var node_b = this.getNodeById(node_b_id);
	        this.checkExistanceOfEdgeNodes(node_a, node_b);
	        var edges_dir = node_a.outEdges(), edges_dir_keys = Object.keys(edges_dir);
	        for (var i = 0; i < edges_dir_keys.length; i++) {
	            var edge = edges_dir[edges_dir_keys[i]];
	            if (edge.getNodes().b.getID() == node_b_id) {
	                return edge;
	            }
	        }
	        throw new Error("Cannot find edge. There is no edge between Node " + node_a_id + " and " + node_b_id + ".");
	    };
	    BaseGraph.prototype.getUndEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        var node_b = this.getNodeById(node_b_id);
	        this.checkExistanceOfEdgeNodes(node_a, node_b);
	        var edges_und = node_a.undEdges(), edges_und_keys = Object.keys(edges_und);
	        for (var i = 0; i < edges_und_keys.length; i++) {
	            var edge = edges_und[edges_und_keys[i]];
	            var b;
	            (edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
	            if (b == node_b_id) {
	                return edge;
	            }
	        }
	    };
	    BaseGraph.prototype.getDirEdges = function () {
	        return this._dir_edges;
	    };
	    BaseGraph.prototype.getUndEdges = function () {
	        return this._und_edges;
	    };
	    BaseGraph.prototype.getDirEdgesArray = function () {
	        var edges = [];
	        for (var e_id in this._dir_edges) {
	            edges.push(this._dir_edges[e_id]);
	        }
	        return edges;
	    };
	    BaseGraph.prototype.getUndEdgesArray = function () {
	        var edges = [];
	        for (var e_id in this._und_edges) {
	            edges.push(this._und_edges[e_id]);
	        }
	        return edges;
	    };
	    BaseGraph.prototype.addEdgeByNodeIDs = function (label, node_a_id, node_b_id, opts) {
	        var node_a = this.getNodeById(node_a_id), node_b = this.getNodeById(node_b_id);
	        if (!node_a) {
	            throw new Error("Cannot add edge. Node A does not exist");
	        }
	        else if (!node_b) {
	            throw new Error("Cannot add edge. Node B does not exist");
	        }
	        else {
	            return this.addEdgeByID(label, node_a, node_b, opts);
	        }
	    };
	    BaseGraph.prototype.addEdgeByID = function (id, node_a, node_b, opts) {
	        var edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
	        return this.addEdge(edge);
	    };
	    BaseGraph.prototype.addEdge = function (edge) {
	        var node_a = edge.getNodes().a, node_b = edge.getNodes().b;
	        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())
	            || this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b) {
	            throw new Error("can only add edge between two nodes existing in graph");
	        }
	        node_a.addEdge(edge);
	        if (edge.isDirected()) {
	            node_b.addEdge(edge);
	            this._dir_edges[edge.getID()] = edge;
	            this._nr_dir_edges += 1;
	            this.updateGraphMode();
	        }
	        else {
	            if (node_a !== node_b) {
	                node_b.addEdge(edge);
	            }
	            this._und_edges[edge.getID()] = edge;
	            this._nr_und_edges += 1;
	            this.updateGraphMode();
	        }
	        return edge;
	    };
	    BaseGraph.prototype.deleteEdge = function (edge) {
	        var dir_edge = this._dir_edges[edge.getID()];
	        var und_edge = this._und_edges[edge.getID()];
	        if (!dir_edge && !und_edge) {
	            throw new Error('cannot remove non-existing edge.');
	        }
	        var nodes = edge.getNodes();
	        nodes.a.removeEdge(edge);
	        if (nodes.a !== nodes.b) {
	            nodes.b.removeEdge(edge);
	        }
	        if (dir_edge) {
	            delete this._dir_edges[edge.getID()];
	            this._nr_dir_edges -= 1;
	        }
	        else {
	            delete this._und_edges[edge.getID()];
	            this._nr_und_edges -= 1;
	        }
	        this.updateGraphMode();
	    };
	    BaseGraph.prototype.deleteInEdgesOf = function (node) {
	        this.checkConnectedNodeOrThrow(node);
	        var in_edges = node.inEdges();
	        var key, edge;
	        for (key in in_edges) {
	            edge = in_edges[key];
	            edge.getNodes().a.removeEdge(edge);
	            delete this._dir_edges[edge.getID()];
	            this._nr_dir_edges -= 1;
	        }
	        node.clearInEdges();
	        this.updateGraphMode();
	    };
	    BaseGraph.prototype.deleteOutEdgesOf = function (node) {
	        this.checkConnectedNodeOrThrow(node);
	        var out_edges = node.outEdges();
	        var key, edge;
	        for (key in out_edges) {
	            edge = out_edges[key];
	            edge.getNodes().b.removeEdge(edge);
	            delete this._dir_edges[edge.getID()];
	            this._nr_dir_edges -= 1;
	        }
	        node.clearOutEdges();
	        this.updateGraphMode();
	    };
	    BaseGraph.prototype.deleteDirEdgesOf = function (node) {
	        this.deleteInEdgesOf(node);
	        this.deleteOutEdgesOf(node);
	    };
	    BaseGraph.prototype.deleteUndEdgesOf = function (node) {
	        this.checkConnectedNodeOrThrow(node);
	        var und_edges = node.undEdges();
	        var key, edge;
	        for (key in und_edges) {
	            edge = und_edges[key];
	            var conns = edge.getNodes();
	            conns.a.removeEdge(edge);
	            if (conns.a !== conns.b) {
	                conns.b.removeEdge(edge);
	            }
	            delete this._und_edges[edge.getID()];
	            this._nr_und_edges -= 1;
	        }
	        node.clearUndEdges();
	        this.updateGraphMode();
	    };
	    BaseGraph.prototype.deleteAllEdgesOf = function (node) {
	        this.deleteDirEdgesOf(node);
	        this.deleteUndEdgesOf(node);
	    };
	    BaseGraph.prototype.clearAllDirEdges = function () {
	        for (var edge in this._dir_edges) {
	            this.deleteEdge(this._dir_edges[edge]);
	        }
	    };
	    BaseGraph.prototype.clearAllUndEdges = function () {
	        for (var edge in this._und_edges) {
	            this.deleteEdge(this._und_edges[edge]);
	        }
	    };
	    BaseGraph.prototype.clearAllEdges = function () {
	        this.clearAllDirEdges();
	        this.clearAllUndEdges();
	    };
	    BaseGraph.prototype.getRandomDirEdge = function () {
	        return this.pickRandomProperty(this._dir_edges);
	    };
	    BaseGraph.prototype.getRandomUndEdge = function () {
	        return this.pickRandomProperty(this._und_edges);
	    };
	    BaseGraph.prototype.clone = function () {
	        var new_graph = new BaseGraph(this._label), old_nodes = this.getNodes(), old_edge, new_node_a = null, new_node_b = null;
	        for (var node_id in old_nodes) {
	            new_graph.addNode(old_nodes[node_id].clone());
	        }
	        [this.getDirEdges(), this.getUndEdges()].forEach(function (old_edges) {
	            for (var edge_id in old_edges) {
	                old_edge = old_edges[edge_id];
	                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
	                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
	                new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
	            }
	        });
	        return new_graph;
	    };
	    BaseGraph.prototype.cloneSubGraph = function (root, cutoff) {
	        var new_graph = new BaseGraph(this._label);
	        var config = $BFS.prepareBFSStandardConfig();
	        var bfsNodeUnmarkedTestCallback = function (context) {
	            if (config.result[context.next_node.getID()].counter > cutoff) {
	                context.queue = [];
	            }
	            else {
	                new_graph.addNode(context.next_node.clone());
	            }
	        };
	        config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
	        $BFS.BFS(this, root, config);
	        var old_edge, new_node_a = null, new_node_b = null;
	        [this.getDirEdges(), this.getUndEdges()].forEach(function (old_edges) {
	            for (var edge_id in old_edges) {
	                old_edge = old_edges[edge_id];
	                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
	                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
	                if (new_node_a != null && new_node_b != null)
	                    new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
	            }
	        });
	        return new_graph;
	    };
	    BaseGraph.prototype.checkConnectedNodeOrThrow = function (node) {
	        var node = this._nodes[node.getID()];
	        if (!node) {
	            throw new Error('Cowardly refusing to delete edges of un-added node.');
	        }
	    };
	    BaseGraph.prototype.updateGraphMode = function () {
	        var nr_dir = this._nr_dir_edges, nr_und = this._nr_und_edges;
	        if (nr_dir && nr_und) {
	            this._mode = GraphMode.MIXED;
	        }
	        else if (nr_dir) {
	            this._mode = GraphMode.DIRECTED;
	        }
	        else if (nr_und) {
	            this._mode = GraphMode.UNDIRECTED;
	        }
	        else {
	            this._mode = GraphMode.INIT;
	        }
	    };
	    BaseGraph.prototype.pickRandomProperty = function (propList) {
	        var tmpList = Object.keys(propList);
	        var randomPropertyName = tmpList[Math.floor(Math.random() * tmpList.length)];
	        return propList[randomPropertyName];
	    };
	    BaseGraph.prototype.pickRandomProperties = function (propList, amount) {
	        var ids = [];
	        var keys = Object.keys(propList);
	        var fraction = amount / keys.length;
	        var used_keys = {};
	        for (var i = 0; ids.length < amount && i < keys.length; i++) {
	            if (Math.random() < fraction) {
	                ids.push(keys[i]);
	                used_keys[keys[i]] = i;
	            }
	        }
	        var diff = amount - ids.length;
	        for (var i = 0; i < keys.length && diff; i++) {
	            if (used_keys[keys[i]] == null) {
	                ids.push(keys[i]);
	                diff--;
	            }
	        }
	        return ids;
	    };
	    return BaseGraph;
	}());
	exports.BaseGraph = BaseGraph;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var LOG_LEVELS = __webpack_require__(6).LOG_LEVELS;
	var RUN_CONFIG = __webpack_require__(6).RUN_CONFIG;
	var Logger = (function () {
	    function Logger(config) {
	        this.config = null;
	        this.config = config || RUN_CONFIG;
	    }
	    Logger.prototype.log = function (msg) {
	        if (this.config.log_level === LOG_LEVELS.debug) {
	            console.log.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.error = function (err) {
	        if (this.config.log_level === LOG_LEVELS.debug) {
	            console.error.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.dir = function (obj) {
	        if (this.config.log_level === LOG_LEVELS.debug) {
	            console.dir.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.info = function (msg) {
	        if (this.config.log_level === LOG_LEVELS.debug) {
	            console.info.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.warn = function (msg) {
	        if (this.config.log_level === LOG_LEVELS.debug) {
	            console.warn.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    return Logger;
	}());
	exports.Logger = Logger;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	var LOG_LEVELS = {
	  debug: "DEBUG",
	  production: "PRODUCTION"
	};

	var RUN_CONFIG = {
	  log_level: LOG_LEVELS.debug
	};

	module.exports = {
	  LOG_LEVELS: LOG_LEVELS,
	  RUN_CONFIG: RUN_CONFIG
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(8);
	function BFS(graph, v, config) {
	    var config = config || prepareBFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    var bfsScope = {
	        marked: {},
	        nodes: graph.getNodes(),
	        queue: [],
	        current: null,
	        next_node: null,
	        next_edge: null,
	        root_node: v,
	        adj_nodes: []
	    };
	    if (callbacks.init_bfs) {
	        $CB.execCallbacks(callbacks.init_bfs, bfsScope);
	    }
	    bfsScope.queue.push(v);
	    var i = 0;
	    while (i < bfsScope.queue.length) {
	        bfsScope.current = bfsScope.queue[i++];
	        if (dir_mode === $G.GraphMode.MIXED) {
	            bfsScope.adj_nodes = bfsScope.current.reachNodes();
	        }
	        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	            bfsScope.adj_nodes = bfsScope.current.connNodes();
	        }
	        else if (dir_mode === $G.GraphMode.DIRECTED) {
	            bfsScope.adj_nodes = bfsScope.current.nextNodes();
	        }
	        else {
	            bfsScope.adj_nodes = [];
	        }
	        if (typeof callbacks.sort_nodes === 'function') {
	            callbacks.sort_nodes(bfsScope);
	        }
	        for (var adj_idx in bfsScope.adj_nodes) {
	            bfsScope.next_node = bfsScope.adj_nodes[adj_idx].node;
	            bfsScope.next_edge = bfsScope.adj_nodes[adj_idx].edge;
	            if (config.result[bfsScope.next_node.getID()].distance === Number.POSITIVE_INFINITY) {
	                if (callbacks.node_unmarked) {
	                    $CB.execCallbacks(callbacks.node_unmarked, bfsScope);
	                }
	            }
	            else {
	                if (callbacks.node_marked) {
	                    $CB.execCallbacks(callbacks.node_marked, bfsScope);
	                }
	            }
	        }
	    }
	    return config.result;
	}
	exports.BFS = BFS;
	function prepareBFSStandardConfig() {
	    var config = {
	        result: {},
	        callbacks: {
	            init_bfs: [],
	            node_unmarked: [],
	            node_marked: [],
	            sort_nodes: undefined
	        },
	        dir_mode: $G.GraphMode.MIXED,
	        messages: {},
	        filters: {}
	    }, result = config.result, callbacks = config.callbacks;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    var initBFS = function (context) {
	        for (var key in context.nodes) {
	            config.result[key] = {
	                distance: Number.POSITIVE_INFINITY,
	                parent: null,
	                counter: -1
	            };
	        }
	        config.result[context.root_node.getID()] = {
	            distance: 0,
	            parent: context.root_node,
	            counter: counter()
	        };
	    };
	    callbacks.init_bfs.push(initBFS);
	    var nodeUnmarked = function (context) {
	        config.result[context.next_node.getID()] = {
	            distance: result[context.current.getID()].distance + 1,
	            parent: context.current,
	            counter: counter()
	        };
	        context.queue.push(context.next_node);
	    };
	    callbacks.node_unmarked.push(nodeUnmarked);
	    return config;
	}
	exports.prepareBFSStandardConfig = prepareBFSStandardConfig;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	function execCallbacks(cbs, context) {
	    cbs.forEach(function (cb) {
	        if (typeof cb === 'function') {
	            cb(context);
	        }
	        else {
	            throw new Error('Provided callback is not a function.');
	        }
	    });
	}
	exports.execCallbacks = execCallbacks;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(8);
	function DFSVisit(graph, current_root, config) {
	    var dfsVisitScope = {
	        stack: [],
	        adj_nodes: [],
	        stack_entry: null,
	        current: null,
	        current_root: current_root
	    };
	    var config = config || prepareDFSVisitStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    if (callbacks.init_dfs_visit) {
	        $CB.execCallbacks(callbacks.init_dfs_visit, dfsVisitScope);
	    }
	    dfsVisitScope.stack.push({
	        node: current_root,
	        parent: current_root,
	        weight: 0
	    });
	    while (dfsVisitScope.stack.length) {
	        dfsVisitScope.stack_entry = dfsVisitScope.stack.pop();
	        dfsVisitScope.current = dfsVisitScope.stack_entry.node;
	        if (callbacks.node_popped) {
	            $CB.execCallbacks(callbacks.node_popped, dfsVisitScope);
	        }
	        if (!config.dfs_visit_marked[dfsVisitScope.current.getID()]) {
	            config.dfs_visit_marked[dfsVisitScope.current.getID()] = true;
	            if (callbacks.node_unmarked) {
	                $CB.execCallbacks(callbacks.node_unmarked, dfsVisitScope);
	            }
	            if (dir_mode === $G.GraphMode.MIXED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.reachNodes();
	            }
	            else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.connNodes();
	            }
	            else if (dir_mode === $G.GraphMode.DIRECTED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.nextNodes();
	            }
	            if (typeof callbacks.sort_nodes === 'function') {
	                callbacks.sort_nodes(dfsVisitScope);
	            }
	            for (var adj_idx in dfsVisitScope.adj_nodes) {
	                if (callbacks) {
	                }
	                dfsVisitScope.stack.push({
	                    node: dfsVisitScope.adj_nodes[adj_idx].node,
	                    parent: dfsVisitScope.current,
	                    weight: dfsVisitScope.adj_nodes[adj_idx].edge.getWeight()
	                });
	            }
	            if (callbacks.adj_nodes_pushed) {
	                $CB.execCallbacks(callbacks.adj_nodes_pushed, dfsVisitScope);
	            }
	        }
	        else {
	            if (callbacks.node_marked) {
	                $CB.execCallbacks(callbacks.node_marked, dfsVisitScope);
	            }
	        }
	    }
	    return config.visit_result;
	}
	exports.DFSVisit = DFSVisit;
	function DFS(graph, root, config) {
	    var config = config || prepareDFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    var dfsScope = {
	        marked: {},
	        nodes: graph.getNodes()
	    };
	    if (callbacks.init_dfs) {
	        $CB.execCallbacks(callbacks.init_dfs, dfsScope);
	    }
	    callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
	    var markNode = function (context) {
	        dfsScope.marked[context.current.getID()] = true;
	    };
	    callbacks.adj_nodes_pushed.push(markNode);
	    var dfs_result = [{}];
	    var dfs_idx = 0;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    var addToProperSegment = function (context) {
	        dfs_result[dfs_idx][context.current.getID()] = {
	            parent: context.stack_entry.parent,
	            counter: counter()
	        };
	    };
	    if (callbacks && callbacks.node_unmarked) {
	        callbacks.node_unmarked.push(addToProperSegment);
	    }
	    DFSVisit(graph, root, config);
	    for (var node_key in dfsScope.nodes) {
	        if (!dfsScope.marked[node_key]) {
	            dfs_idx++;
	            dfs_result.push({});
	            DFSVisit(graph, dfsScope.nodes[node_key], config);
	        }
	    }
	    return dfs_result;
	}
	exports.DFS = DFS;
	function prepareDFSVisitStandardConfig() {
	    var config = {
	        visit_result: {},
	        callbacks: {},
	        messages: {},
	        dfs_visit_marked: {},
	        dir_mode: $G.GraphMode.MIXED
	    }, result = config.visit_result, callbacks = config.callbacks;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    callbacks.init_dfs_visit = callbacks.init_dfs_visit || [];
	    var initDFSVisit = function (context) {
	        result[context.current_root.getID()] = {
	            parent: context.current_root
	        };
	    };
	    callbacks.init_dfs_visit.push(initDFSVisit);
	    callbacks.node_unmarked = callbacks.node_unmarked || [];
	    var setResultEntry = function (context) {
	        result[context.current.getID()] = {
	            parent: context.stack_entry.parent,
	            counter: counter()
	        };
	    };
	    callbacks.node_unmarked.push(setResultEntry);
	    return config;
	}
	exports.prepareDFSVisitStandardConfig = prepareDFSVisitStandardConfig;
	function prepareDFSStandardConfig() {
	    var config = prepareDFSVisitStandardConfig(), callbacks = config.callbacks, result = config.visit_result;
	    callbacks.init_dfs = callbacks.init_dfs || [];
	    var setInitialResultEntries = function (context) {
	    };
	    callbacks.init_dfs.push(setInitialResultEntries);
	    return config;
	}
	exports.prepareDFSStandardConfig = prepareDFSStandardConfig;
	;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var PFS_1 = __webpack_require__(11);
	function BFSanityChecks(graph, start) {
	    if (graph == null || start == null) {
	        throw new Error('Graph as well as start node have to be valid objects.');
	    }
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error('Cowardly refusing to traverse a graph without edges.');
	    }
	    if (!graph.hasNodeID(start.getID())) {
	        throw new Error('Cannot start from an outside node.');
	    }
	}
	function BellmanFordArray(graph, start, cycle) {
	    if (cycle === void 0) { cycle = false; }
	    BFSanityChecks(graph, start);
	    var distArray = [], nodes = graph.getNodes(), edge, node_keys = Object.keys(nodes), node, id_idx_map = {}, bf_edge_entry, new_weight;
	    for (var n_idx = 0; n_idx < node_keys.length; ++n_idx) {
	        node = nodes[node_keys[n_idx]];
	        distArray[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
	        id_idx_map[node.getID()] = n_idx;
	    }
	    var graph_edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
	    var bf_edges = [];
	    for (var e_idx = 0; e_idx < graph_edges.length; ++e_idx) {
	        edge = graph_edges[e_idx];
	        var bf_edge_entry_1 = bf_edges.push([
	            id_idx_map[edge.getNodes().a.getID()],
	            id_idx_map[edge.getNodes().b.getID()],
	            isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT,
	            edge.isDirected()
	        ]);
	    }
	    for (var i = 0; i < node_keys.length - 1; ++i) {
	        for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
	            edge = bf_edges[e_idx];
	            updateDist(edge[0], edge[1], edge[2]);
	            !edge[3] && updateDist(edge[1], edge[0], edge[2]);
	        }
	    }
	    if (cycle) {
	        for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
	            edge = bf_edges[e_idx];
	            if (betterDist(edge[0], edge[1], edge[2]) || (!edge[3] && betterDist(edge[1], edge[0], edge[2]))) {
	                return true;
	            }
	        }
	        return false;
	    }
	    function updateDist(u, v, weight) {
	        new_weight = distArray[u] + weight;
	        if (distArray[v] > new_weight) {
	            distArray[v] = new_weight;
	        }
	    }
	    function betterDist(u, v, weight) {
	        return (distArray[v] > distArray[u] + weight);
	    }
	    return distArray;
	}
	exports.BellmanFordArray = BellmanFordArray;
	function BellmanFordDict(graph, start, cycle) {
	    if (cycle === void 0) { cycle = false; }
	    BFSanityChecks(graph, start);
	    var distDict = {}, edges, edge, a, b, weight, new_weight, nodes_size;
	    distDict = {};
	    edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
	    nodes_size = graph.nrNodes();
	    for (var node in graph.getNodes()) {
	        distDict[node] = Number.POSITIVE_INFINITY;
	    }
	    distDict[start.getID()] = 0;
	    for (var i = 0; i < nodes_size - 1; ++i) {
	        for (var e_idx = 0; e_idx < edges.length; ++e_idx) {
	            edge = edges[e_idx];
	            a = edge.getNodes().a.getID();
	            b = edge.getNodes().b.getID();
	            weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
	            updateDist(a, b, weight);
	            !edge.isDirected() && updateDist(b, a, weight);
	        }
	    }
	    if (cycle) {
	        for (var edgeID in edges) {
	            edge = edges[edgeID];
	            a = edge.getNodes().a.getID();
	            b = edge.getNodes().b.getID();
	            weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
	            if (betterDist(a, b, weight) || (!edge.isDirected() && betterDist(b, a, weight))) {
	                return true;
	            }
	        }
	        return false;
	    }
	    function updateDist(u, v, weight) {
	        new_weight = distDict[u] + weight;
	        if (distDict[v] > new_weight) {
	            distDict[v] = new_weight;
	        }
	    }
	    function betterDist(u, v, weight) {
	        return (distDict[v] > distDict[u] + weight);
	    }
	    return distDict;
	}
	exports.BellmanFordDict = BellmanFordDict;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $E = __webpack_require__(1);
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(8);
	var $BH = __webpack_require__(12);
	exports.DEFAULT_WEIGHT = 1;
	function PFS(graph, v, config) {
	    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode, evalPriority = config.evalPriority, evalObjID = config.evalObjID;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    var start_ne = {
	        node: v,
	        edge: new $E.BaseEdge('virtual start edge', v, v, { weighted: true, weight: 0 }),
	        best: 0
	    };
	    var scope = {
	        OPEN_HEAP: new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
	        OPEN: {},
	        CLOSED: {},
	        nodes: graph.getNodes(),
	        root_node: v,
	        current: start_ne,
	        adj_nodes: [],
	        next: null,
	        better_dist: Number.POSITIVE_INFINITY,
	    };
	    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
	    scope.OPEN_HEAP.insert(start_ne);
	    scope.OPEN[start_ne.node.getID()] = start_ne;
	    while (scope.OPEN_HEAP.size()) {
	        scope.current = scope.OPEN_HEAP.pop();
	        if (scope.current == null) {
	            console.log("HEAP popped undefined - HEAP size: " + scope.OPEN_HEAP.size());
	        }
	        scope.OPEN[scope.current.node.getID()] = undefined;
	        scope.CLOSED[scope.current.node.getID()] = scope.current;
	        if (scope.current.node === config.goal_node) {
	            config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached, scope);
	            return config.result;
	        }
	        if (dir_mode === $G.GraphMode.MIXED) {
	            scope.adj_nodes = scope.current.node.reachNodes();
	        }
	        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	            scope.adj_nodes = scope.current.node.connNodes();
	        }
	        else if (dir_mode === $G.GraphMode.DIRECTED) {
	            scope.adj_nodes = scope.current.node.nextNodes();
	        }
	        else {
	            throw new Error('Unsupported traversal mode. Please use directed, undirected, or mixed');
	        }
	        for (var adj_idx in scope.adj_nodes) {
	            scope.next = scope.adj_nodes[adj_idx];
	            if (scope.CLOSED[scope.next.node.getID()]) {
	                config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
	                continue;
	            }
	            if (scope.OPEN[scope.next.node.getID()]) {
	                scope.next.best = scope.OPEN[scope.next.node.getID()].best;
	                config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);
	                scope.better_dist = scope.current.best + (isNaN(scope.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : scope.next.edge.getWeight());
	                if (scope.next.best > scope.better_dist) {
	                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
	                    scope.OPEN_HEAP.remove(scope.next);
	                    scope.next.best = scope.better_dist;
	                    scope.OPEN_HEAP.insert(scope.next);
	                    scope.OPEN[scope.next.node.getID()].best = scope.better_dist;
	                }
	                if (scope.next.best === scope.better_dist) {
	                    config.callbacks.equal_path && $CB.execCallbacks(config.callbacks.equal_path, scope);
	                }
	                continue;
	            }
	            config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);
	            scope.OPEN_HEAP.insert(scope.next);
	            scope.OPEN[scope.next.node.getID()] = scope.next;
	        }
	    }
	    return config.result;
	}
	exports.PFS = PFS;
	function preparePFSStandardConfig() {
	    var config = {
	        result: {},
	        callbacks: {
	            init_pfs: [],
	            not_encountered: [],
	            node_open: [],
	            node_closed: [],
	            better_path: [],
	            equal_path: [],
	            goal_reached: []
	        },
	        messages: {
	            init_pfs_msgs: [],
	            not_enc_msgs: [],
	            node_open_msgs: [],
	            node_closed_msgs: [],
	            better_path_msgs: [],
	            equal_path_msgs: [],
	            goal_reached_msgs: []
	        },
	        dir_mode: $G.GraphMode.MIXED,
	        goal_node: null,
	        evalPriority: function (ne) {
	            return ne.best || exports.DEFAULT_WEIGHT;
	        },
	        evalObjID: function (ne) {
	            return ne.node.getID();
	        }
	    }, callbacks = config.callbacks;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    var initPFS = function (context) {
	        for (var key in context.nodes) {
	            config.result[key] = {
	                distance: Number.POSITIVE_INFINITY,
	                parent: null,
	                counter: -1
	            };
	        }
	        config.result[context.root_node.getID()] = {
	            distance: 0,
	            parent: context.root_node,
	            counter: counter()
	        };
	    };
	    callbacks.init_pfs.push(initPFS);
	    var notEncountered = function (context) {
	        context.next.best = context.current.best + (isNaN(context.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : context.next.edge.getWeight());
	        config.result[context.next.node.getID()] = {
	            distance: context.next.best,
	            parent: context.current.node,
	            counter: undefined
	        };
	    };
	    callbacks.not_encountered.push(notEncountered);
	    var betterPathFound = function (context) {
	        config.result[context.next.node.getID()].distance = context.better_dist;
	        config.result[context.next.node.getID()].parent = context.current.node;
	    };
	    callbacks.better_path.push(betterPathFound);
	    return config;
	}
	exports.preparePFSStandardConfig = preparePFSStandardConfig;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	(function (BinaryHeapMode) {
	    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
	    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
	})(exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
	var BinaryHeapMode = exports.BinaryHeapMode;
	var BinaryHeap = (function () {
	    function BinaryHeap(_mode, _evalPriority, _evalObjID) {
	        if (_mode === void 0) { _mode = BinaryHeapMode.MIN; }
	        if (_evalPriority === void 0) { _evalPriority = function (obj) {
	            if (typeof obj !== 'number' && typeof obj !== 'string') {
	                return NaN;
	            }
	            return parseInt(obj);
	        }; }
	        if (_evalObjID === void 0) { _evalObjID = function (obj) {
	            return obj;
	        }; }
	        this._mode = _mode;
	        this._evalPriority = _evalPriority;
	        this._evalObjID = _evalObjID;
	        this._array = [];
	        this._positions = {};
	    }
	    BinaryHeap.prototype.getMode = function () {
	        return this._mode;
	    };
	    BinaryHeap.prototype.getArray = function () {
	        return this._array;
	    };
	    BinaryHeap.prototype.getPositions = function () {
	        return this._positions;
	    };
	    BinaryHeap.prototype.size = function () {
	        return this._array.length;
	    };
	    BinaryHeap.prototype.getEvalPriorityFun = function () {
	        return this._evalPriority;
	    };
	    BinaryHeap.prototype.evalInputPriority = function (obj) {
	        return this._evalPriority(obj);
	    };
	    BinaryHeap.prototype.getEvalObjIDFun = function () {
	        return this._evalObjID;
	    };
	    BinaryHeap.prototype.evalInputObjID = function (obj) {
	        return this._evalObjID(obj);
	    };
	    BinaryHeap.prototype.peek = function () {
	        return this._array[0];
	    };
	    BinaryHeap.prototype.pop = function () {
	        if (this.size()) {
	            return this.remove(this._array[0]);
	        }
	    };
	    BinaryHeap.prototype.find = function (obj) {
	        var pos = this.getNodePosition(obj);
	        return this._array[pos];
	    };
	    BinaryHeap.prototype.insert = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error("Cannot insert object without numeric priority.");
	        }
	        this._array.push(obj);
	        this.setNodePosition(obj, this.size() - 1, false);
	        this.trickleUp(this.size() - 1);
	    };
	    BinaryHeap.prototype.remove = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error('Object invalid.');
	        }
	        var objID = this._evalObjID(obj), found = undefined;
	        for (var pos = 0; pos < this._array.length; pos++) {
	            if (this._evalObjID(this._array[pos]) === objID) {
	                found = this._array[pos];
	                var last = this._array.pop();
	                if (this.size()) {
	                    this._array[pos] = last;
	                    this.trickleUp(pos);
	                    this.trickleDown(pos);
	                }
	                return found;
	            }
	        }
	        return found;
	    };
	    BinaryHeap.prototype.trickleDown = function (i) {
	        var parent = this._array[i];
	        while (true) {
	            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
	            if (left_child_idx < this.size() && !this.orderCorrect(parent, left_child)) {
	                swap = left_child_idx;
	            }
	            if (right_child_idx < this.size() && !this.orderCorrect(parent, right_child)
	                && !this.orderCorrect(left_child, right_child)) {
	                swap = right_child_idx;
	            }
	            if (swap === null) {
	                break;
	            }
	            this._array[i] = this._array[swap];
	            this._array[swap] = parent;
	            this.setNodePosition(this._array[i], i, true, swap);
	            this.setNodePosition(this._array[swap], swap, true, i);
	            i = swap;
	        }
	    };
	    BinaryHeap.prototype.trickleUp = function (i) {
	        var child = this._array[i];
	        while (i) {
	            var parent_idx = Math.floor((i + 1) / 2) - 1, parent = this._array[parent_idx];
	            if (this.orderCorrect(parent, child)) {
	                break;
	            }
	            else {
	                this._array[parent_idx] = child;
	                this._array[i] = parent;
	                this.setNodePosition(child, parent_idx, true, i);
	                this.setNodePosition(parent, i, true, parent_idx);
	                i = parent_idx;
	            }
	        }
	    };
	    BinaryHeap.prototype.orderCorrect = function (obj_a, obj_b) {
	        var obj_a_pr = this._evalPriority(obj_a);
	        var obj_b_pr = this._evalPriority(obj_b);
	        if (this._mode === BinaryHeapMode.MIN) {
	            return obj_a_pr <= obj_b_pr;
	        }
	        else {
	            return obj_a_pr >= obj_b_pr;
	        }
	    };
	    BinaryHeap.prototype.setNodePosition = function (obj, new_pos, replace, old_pos) {
	        if (replace === void 0) { replace = true; }
	        if (typeof obj === 'undefined' || obj === null || typeof new_pos === 'undefined' || new_pos === null) {
	            throw new Error('minium required arguments are ojb and new_pos');
	        }
	        if (replace === true && (typeof old_pos === 'undefined' || old_pos === null)) {
	            throw new Error('replacing a node position requires an old_pos');
	        }
	        var pos_obj = {
	            priority: this.evalInputPriority(obj),
	            position: new_pos
	        };
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            this._positions[obj_key] = pos_obj;
	        }
	        else if (Array.isArray(occurrence)) {
	            if (replace) {
	                for (var i = 0; i < occurrence.length; i++) {
	                    if (occurrence[i].position === old_pos) {
	                        occurrence[i].position = new_pos;
	                        return;
	                    }
	                }
	            }
	            else {
	                occurrence.push(pos_obj);
	            }
	        }
	        else {
	            if (replace) {
	                this._positions[obj_key] = pos_obj;
	            }
	            else {
	                this._positions[obj_key] = [occurrence, pos_obj];
	            }
	        }
	    };
	    BinaryHeap.prototype.getNodePosition = function (obj) {
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            console.log("getNodePosition: no occurrence found");
	            console.log("Neighborhood entry: ");
	            console.dir(obj);
	            console.log("Object KEY: " + obj_key);
	            return undefined;
	        }
	        else if (Array.isArray(occurrence)) {
	            var node = null, min = Number.POSITIVE_INFINITY;
	            for (var i = 0; i < occurrence.length; i++) {
	                if (occurrence[i].position < min) {
	                    node = occurrence[i];
	                }
	            }
	            if (node) {
	                if (typeof node.position === 'undefined')
	                    console.log('Node position: undefined!');
	                return node.position;
	            }
	        }
	        else {
	            if (typeof occurrence.position === 'undefined')
	                console.log('Occurrence position: undefined!');
	            return occurrence.position;
	        }
	    };
	    BinaryHeap.prototype.unsetNodePosition = function (obj) {
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            console.log("Neighborhood entry: ");
	            console.log("Object: ");
	            console.dir(obj);
	            console.log("Object KEY: " + obj_key);
	            return undefined;
	        }
	        else if (Array.isArray(occurrence)) {
	            var node_idx = null, node = null, min = Number.POSITIVE_INFINITY;
	            for (var i = 0; i < occurrence.length; i++) {
	                if (occurrence[i].position < min) {
	                    node_idx = i;
	                    node = occurrence[i];
	                }
	            }
	            if (node) {
	                occurrence.splice(node_idx, 1);
	                if (occurrence.length === 1) {
	                    this._positions[obj_key] = occurrence[0];
	                }
	                if (typeof node.position === 'undefined')
	                    console.log('Node position: undefined!');
	                return node.position;
	            }
	        }
	        else {
	            delete this._positions[obj_key];
	            return occurrence.position;
	        }
	    };
	    return BinaryHeap;
	}());
	exports.BinaryHeap = BinaryHeap;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var path = __webpack_require__(14);
	var fs = __webpack_require__(16);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(17);
	var CSVInput = (function () {
	    function CSVInput(_separator, _explicit_direction, _direction_mode) {
	        if (_separator === void 0) { _separator = ','; }
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction_mode === void 0) { _direction_mode = false; }
	        this._separator = _separator;
	        this._explicit_direction = _explicit_direction;
	        this._direction_mode = _direction_mode;
	    }
	    CSVInput.prototype.readFromAdjacencyListURL = function (fileurl, cb) {
	        this.readGraphFromURL(fileurl, cb, this.readFromAdjacencyList);
	    };
	    CSVInput.prototype.readFromEdgeListURL = function (fileurl, cb) {
	        this.readGraphFromURL(fileurl, cb, this.readFromEdgeList);
	    };
	    CSVInput.prototype.readGraphFromURL = function (fileurl, cb, localFun) {
	        var self = this, graph_name = path.basename(fileurl), graph, request;
	        if (typeof window !== 'undefined') {
	            request = new XMLHttpRequest();
	            request.onreadystatechange = function () {
	                if (request.readyState == 4 && request.status == 200) {
	                    var input = request.responseText.split('\n');
	                    graph = localFun.apply(self, [input, graph_name]);
	                    cb(graph, undefined);
	                }
	            };
	            request.open("GET", fileurl, true);
	            request.setRequestHeader('Content-Type', 'text/csv; charset=ISO-8859-1');
	            request.send();
	        }
	        else {
	            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
	                var input = raw_graph.toString().split('\n');
	                graph = localFun.apply(self, [input, graph_name]);
	                cb(graph, undefined);
	            });
	        }
	    };
	    CSVInput.prototype.readFromAdjacencyListFile = function (filepath) {
	        return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
	    };
	    CSVInput.prototype.readFromEdgeListFile = function (filepath) {
	        return this.readFileAndReturn(filepath, this.readFromEdgeList);
	    };
	    CSVInput.prototype.readFileAndReturn = function (filepath, func) {
	        this.checkNodeEnvironment();
	        var graph_name = path.basename(filepath);
	        var input = fs.readFileSync(filepath).toString().split('\n');
	        return func.apply(this, [input, graph_name]);
	    };
	    CSVInput.prototype.readFromAdjacencyList = function (input, graph_name) {
	        var graph = new $G.BaseGraph(graph_name);
	        for (var idx in input) {
	            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator), node_id = elements[0], node, edge_array = elements.slice(1), edge, target_node_id, target_node, dir_char, directed, edge_id, edge_id_u2;
	            if (!node_id) {
	                continue;
	            }
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            for (var e = 0; e < edge_array.length;) {
	                if (this._explicit_direction && (!edge_array || edge_array.length % 2)) {
	                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
	                }
	                target_node_id = edge_array[e++];
	                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	                dir_char = this._explicit_direction ? edge_array[e++] : this._direction_mode ? 'd' : 'u';
	                if (dir_char !== 'd' && dir_char !== 'u') {
	                    throw new Error("Specification of edge direction invalid (d and u are valid).");
	                }
	                directed = dir_char === 'd';
	                edge_id = node_id + "_" + target_node_id + "_" + dir_char;
	                edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    continue;
	                }
	                else {
	                    edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
	                }
	            }
	        }
	        return graph;
	    };
	    CSVInput.prototype.readFromEdgeList = function (input, graph_name) {
	        var graph = new $G.BaseGraph(graph_name);
	        for (var idx in input) {
	            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator);
	            if (!elements) {
	                continue;
	            }
	            if (elements.length < 2) {
	                console.log(elements);
	                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
	            }
	            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2;
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	            if (dir_char !== 'd' && dir_char !== 'u') {
	                throw new Error("Specification of edge direction invalid (d and u are valid).");
	            }
	            directed = dir_char === 'd';
	            edge_id = node_id + "_" + target_node_id + "_" + dir_char;
	            edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	            if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                continue;
	            }
	            else {
	                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
	            }
	        }
	        return graph;
	    };
	    CSVInput.prototype.checkNodeEnvironment = function () {
	        if (typeof window !== 'undefined') {
	            throw new Error('Cannot read file in browser environment.');
	        }
	    };
	    return CSVInput;
	}());
	exports.CSVInput = CSVInput;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var http = __webpack_require__(16);
	function retrieveRemoteFile(url, cb) {
	    if (typeof cb !== 'function') {
	        throw new Error('Provided callback is not a function.');
	    }
	    return http.get(url, function (response) {
	        var body = '';
	        response.on('data', function (d) {
	            body += d;
	        });
	        response.on('end', function () {
	            cb(body);
	        });
	    });
	}
	exports.retrieveRemoteFile = retrieveRemoteFile;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(16);
	var CSVOutput = (function () {
	    function CSVOutput(_separator, _explicit_direction, _direction_mode) {
	        if (_separator === void 0) { _separator = ','; }
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction_mode === void 0) { _direction_mode = false; }
	        this._separator = _separator;
	        this._explicit_direction = _explicit_direction;
	        this._direction_mode = _direction_mode;
	    }
	    CSVOutput.prototype.writeToAdjacencyListFile = function (filepath, graph) {
	        if (typeof window !== 'undefined' && window !== null) {
	            throw new Error('cannot write to File inside of Browser');
	        }
	        fs.writeFileSync(filepath, this.writeToAdjacencyList(graph));
	    };
	    CSVOutput.prototype.writeToAdjacencyList = function (graph) {
	        var graphString = "";
	        var nodes = graph.getNodes(), node = null, adj_nodes = null, adj_node = null;
	        var mergeFunc = function (ne) {
	            return ne.node.getID();
	        };
	        for (var node_key in nodes) {
	            node = nodes[node_key];
	            graphString += node.getID();
	            adj_nodes = node.reachNodes(mergeFunc);
	            for (var adj_idx in adj_nodes) {
	                adj_node = adj_nodes[adj_idx].node;
	                graphString += this._separator + adj_node.getID();
	            }
	            graphString += "\n";
	        }
	        return graphString;
	    };
	    CSVOutput.prototype.writeToEdgeListFile = function (filepath, graph) {
	        throw new Error("CSVOutput.writeToEdgeListFile not implemented yet.");
	    };
	    CSVOutput.prototype.writeToEdgeList = function (graph) {
	        throw new Error("CSVOutput.writeToEdgeList not implemented yet.");
	    };
	    return CSVOutput;
	}());
	exports.CSVOutput = CSVOutput;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(16);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(17);
	var DEFAULT_WEIGHT = 1;
	var JSONInput = (function () {
	    function JSONInput(_explicit_direction, _direction, _weighted_mode) {
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction === void 0) { _direction = false; }
	        if (_weighted_mode === void 0) { _weighted_mode = false; }
	        this._explicit_direction = _explicit_direction;
	        this._direction = _direction;
	        this._weighted_mode = _weighted_mode;
	    }
	    JSONInput.prototype.readFromJSONFile = function (filepath) {
	        this.checkNodeEnvironment();
	        var json = JSON.parse(fs.readFileSync(filepath).toString());
	        return this.readFromJSON(json);
	    };
	    JSONInput.prototype.readFromJSONURL = function (fileurl, cb) {
	        var self = this, graph, request, json;
	        if (typeof window !== 'undefined') {
	            request = new XMLHttpRequest();
	            request.onreadystatechange = function () {
	                if (request.readyState == 4 && request.status == 200) {
	                    var json = JSON.parse(request.responseText);
	                    graph = self.readFromJSON(json);
	                    if (cb) {
	                        cb(graph, undefined);
	                    }
	                }
	            };
	            request.open("GET", fileurl, true);
	            request.timeout = 60000;
	            request.setRequestHeader('Content-Type', 'application/json');
	            request.send();
	        }
	        else {
	            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
	                graph = self.readFromJSON(JSON.parse(raw_graph));
	                cb(graph, undefined);
	            });
	        }
	    };
	    JSONInput.prototype.readFromJSON = function (json) {
	        var graph = new $G.BaseGraph(json.name), coords_json, coords, coord_idx, coord_val, features, feature;
	        for (var node_id in json.data) {
	            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            if (features = json.data[node_id].features) {
	                node.setFeatures(features);
	            }
	            if (coords_json = json.data[node_id].coords) {
	                coords = {};
	                for (coord_idx in coords_json) {
	                    coords[coord_idx] = +coords_json[coord_idx];
	                }
	                node.setFeature('coords', coords);
	            }
	            var edges = json.data[node_id].edges;
	            for (var e in edges) {
	                var edge_input = edges[e], target_node_id = edge_input.to, directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', weight_float = this.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    continue;
	                }
	                else {
	                    var edge = graph.addEdgeByID(edge_id, node, target_node, {
	                        directed: directed,
	                        weighted: this._weighted_mode,
	                        weight: edge_weight
	                    });
	                }
	            }
	        }
	        return graph;
	    };
	    JSONInput.prototype.handleEdgeWeights = function (edge_input) {
	        switch (edge_input.weight) {
	            case "undefined":
	                return DEFAULT_WEIGHT;
	            case "Infinity":
	                return Number.POSITIVE_INFINITY;
	            case "-Infinity":
	                return Number.NEGATIVE_INFINITY;
	            case "MAX":
	                return Number.MAX_VALUE;
	            case "MIN":
	                return Number.MIN_VALUE;
	            default:
	                return parseFloat(edge_input.weight);
	        }
	    };
	    JSONInput.prototype.checkNodeEnvironment = function () {
	        if (typeof window !== 'undefined') {
	            throw new Error('Cannot read file in browser environment.');
	        }
	    };
	    return JSONInput;
	}());
	exports.JSONInput = JSONInput;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(16);
	var JSONOutput = (function () {
	    function JSONOutput() {
	    }
	    JSONOutput.prototype.writeToJSONFile = function (filepath, graph) {
	        if (typeof window !== 'undefined' && window !== null) {
	            throw new Error('cannot write to File inside of Browser');
	        }
	        fs.writeFileSync(filepath, this.writeToJSONSString(graph));
	    };
	    JSONOutput.prototype.writeToJSONSString = function (graph) {
	        var nodes, node, node_struct, und_edges, dir_edges, edge, edge_struct, features, coords;
	        var result = {
	            name: graph._label,
	            nodes: graph.nrNodes(),
	            dir_edges: graph.nrDirEdges(),
	            und_edges: graph.nrUndEdges(),
	            data: {}
	        };
	        nodes = graph.getNodes();
	        for (var node_key in nodes) {
	            node = nodes[node_key];
	            node_struct = result.data[node.getID()] = {
	                edges: []
	            };
	            und_edges = node.undEdges();
	            for (var edge_key in und_edges) {
	                edge = und_edges[edge_key];
	                var connected_nodes = edge.getNodes();
	                node_struct.edges.push({
	                    to: connected_nodes.a.getID() === node.getID() ? connected_nodes.b.getID() : connected_nodes.a.getID(),
	                    directed: edge.isDirected(),
	                    weight: edge.isWeighted() ? edge.getWeight() : undefined
	                });
	            }
	            dir_edges = node.outEdges();
	            for (var edge_key in dir_edges) {
	                edge = dir_edges[edge_key];
	                var connected_nodes = edge.getNodes();
	                node_struct.edges.push({
	                    to: connected_nodes.b.getID(),
	                    directed: edge.isDirected(),
	                    weight: this.handleEdgeWeight(edge)
	                });
	            }
	            node_struct.features = node.getFeatures();
	            if ((coords = node.getFeature('coords')) != null) {
	                node_struct['coords'] = coords;
	            }
	        }
	        return JSON.stringify(result);
	    };
	    JSONOutput.prototype.handleEdgeWeight = function (edge) {
	        if (!edge.isWeighted()) {
	            return undefined;
	        }
	        switch (edge.getWeight()) {
	            case Number.POSITIVE_INFINITY:
	                return 'Infinity';
	            case Number.NEGATIVE_INFINITY:
	                return '-Infinity';
	            case Number.MAX_VALUE:
	                return 'MAX';
	            case Number.MIN_VALUE:
	                return 'MIN';
	            default:
	                return edge.getWeight();
	        }
	    };
	    return JSONOutput;
	}());
	exports.JSONOutput = JSONOutput;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	function initializeDistsWithEdges(graph) {
	    var dists = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
	    for (var edge in edges) {
	        var a = edges[edge].getNodes().a.getID();
	        var b = edges[edge].getNodes().b.getID();
	        if (dists[a] == null)
	            dists[a] = {};
	        dists[a][b] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
	        if (!edges[edge].isDirected()) {
	            if (dists[b] == null)
	                dists[b] = {};
	            dists[b][a] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
	        }
	    }
	    return dists;
	}
	function FloydWarshallAPSP(graph) {
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error("Cowardly refusing to traverse graph without edges.");
	    }
	    var dists = graph.adjListArray();
	    var next = graph.nextArray();
	    var N = dists.length;
	    for (var k = 0; k < N; ++k) {
	        for (var i = 0; i < N; ++i) {
	            for (var j = 0; j < N; ++j) {
	                if (dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j) {
	                    next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
	                }
	                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
	                    next[i][j] = next[i][k].slice(0);
	                    dists[i][j] = dists[i][k] + dists[k][j];
	                }
	            }
	        }
	    }
	    return [dists, next];
	}
	exports.FloydWarshallAPSP = FloydWarshallAPSP;
	function FloydWarshallArray(graph) {
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error("Cowardly refusing to traverse graph without edges.");
	    }
	    var dists = graph.adjListArray();
	    var N = dists.length;
	    for (var k = 0; k < N; ++k) {
	        for (var i = 0; i < N; ++i) {
	            for (var j = 0; j < N; ++j) {
	                if (dists[i][j] > dists[i][k] + dists[k][j]) {
	                    dists[i][j] = dists[i][k] + dists[k][j];
	                }
	            }
	        }
	    }
	    return dists;
	}
	exports.FloydWarshallArray = FloydWarshallArray;
	function FloydWarshall(graph) {
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error("Cowardly refusing to traverse graph without edges.");
	    }
	    var dists = initializeDistsWithEdges(graph);
	    for (var k in dists) {
	        for (var i in dists) {
	            for (var j in dists) {
	                if (i === j) {
	                    continue;
	                }
	                if (dists[i][k] == null || dists[k][j] == null) {
	                    continue;
	                }
	                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
	                    dists[i][j] = dists[i][k] + dists[k][j];
	                }
	            }
	        }
	    }
	    return dists;
	}
	exports.FloydWarshall = FloydWarshall;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	"use strict";
	function randBase36String() {
	    return (Math.random() + 1).toString(36).substr(2, 24);
	}
	exports.randBase36String = randBase36String;
	function runif(min, max, discrete) {
	    if (min === undefined) {
	        min = 0;
	    }
	    if (max === undefined) {
	        max = 1;
	    }
	    if (discrete === undefined) {
	        discrete = false;
	    }
	    if (discrete) {
	        return Math.floor(runif(min, max, false));
	    }
	    return Math.random() * (max - min) + min;
	}
	exports.runif = runif;
	function rnorm(mean, stdev) {
	    this.v2 = null;
	    var u1, u2, v1, v2, s;
	    if (mean === undefined) {
	        mean = 0.0;
	    }
	    if (stdev === undefined) {
	        stdev = 1.0;
	    }
	    if (this.v2 === null) {
	        do {
	            u1 = Math.random();
	            u2 = Math.random();
	            v1 = 2 * u1 - 1;
	            v2 = 2 * u2 - 1;
	            s = v1 * v1 + v2 * v2;
	        } while (s === 0 || s >= 1);
	        this.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s);
	        return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean;
	    }
	    v2 = this.v2;
	    this.v2 = null;
	    return stdev * v2 + mean;
	}
	exports.rnorm = rnorm;
	function rchisq(degreesOfFreedom) {
	    if (degreesOfFreedom === undefined) {
	        degreesOfFreedom = 1;
	    }
	    var i, z, sum = 0.0;
	    for (i = 0; i < degreesOfFreedom; i++) {
	        z = rnorm();
	        sum += z * z;
	    }
	    return sum;
	}
	exports.rchisq = rchisq;
	function rpoisson(lambda) {
	    if (lambda === undefined) {
	        lambda = 1;
	    }
	    var l = Math.exp(-lambda), k = 0, p = 1.0;
	    do {
	        k++;
	        p *= Math.random();
	    } while (p > l);
	    return k - 1;
	}
	exports.rpoisson = rpoisson;
	function rcauchy(loc, scale) {
	    if (loc === undefined) {
	        loc = 0.0;
	    }
	    if (scale === undefined) {
	        scale = 1.0;
	    }
	    var n2, n1 = rnorm();
	    do {
	        n2 = rnorm();
	    } while (n2 === 0.0);
	    return loc + scale * n1 / n2;
	}
	exports.rcauchy = rcauchy;
	function rbernoulli(p) {
	    return Math.random() < p ? 1 : 0;
	}
	exports.rbernoulli = rbernoulli;
	function vectorize(generator) {
	    return function () {
	        var n, result, i, args;
	        args = [].slice.call(arguments);
	        n = args.shift();
	        result = [];
	        for (i = 0; i < n; i++) {
	            result.push(generator.apply(this, args));
	        }
	        return result;
	    };
	}
	function histogram(data, binCount) {
	    binCount = binCount || 10;
	    var bins, i, scaled, max = Math.max.apply(this, data), min = Math.min.apply(this, data);
	    if (max === min) {
	        return [data.length];
	    }
	    bins = [];
	    for (i = 0; i < binCount; i++) {
	        bins.push(0);
	    }
	    for (i = 0; i < data.length; i++) {
	        scaled = (data[i] - min) / (max - min);
	        scaled *= binCount;
	        scaled = Math.floor(scaled);
	        if (scaled === binCount) {
	            scaled--;
	        }
	        bins[scaled]++;
	    }
	    return bins;
	}
	exports.histogram = histogram;
	function rlist(list) {
	    return list[runif(0, list.length, true)];
	}
	exports.rlist = rlist;
	var rvunif = vectorize(runif);
	exports.rvunif = rvunif;
	var rvnorm = vectorize(rnorm);
	exports.rvnorm = rvnorm;
	var rvchisq = vectorize(rchisq);
	exports.rvchisq = rvchisq;
	var rvpoisson = vectorize(rpoisson);
	exports.rvpoisson = rvpoisson;
	var rvcauchy = vectorize(rcauchy);
	exports.rvcauchy = rvcauchy;
	var rvbernoulli = vectorize(rbernoulli);
	exports.rvbernoulli = rvbernoulli;
	var rvlist = vectorize(rlist);
	exports.rvlist = rvlist;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var randgen = __webpack_require__(22);
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
	var SimplePerturber = (function () {
	    function SimplePerturber(_graph) {
	        this._graph = _graph;
	    }
	    SimplePerturber.prototype.randomlyDeleteNodesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage / 100);
	        this.randomlyDeleteNodesAmount(nr_nodes_to_delete);
	    };
	    SimplePerturber.prototype.randomlyDeleteUndEdgesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
	        this.randomlyDeleteUndEdgesAmount(nr_edges_to_delete);
	    };
	    SimplePerturber.prototype.randomlyDeleteDirEdgesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
	        this.randomlyDeleteDirEdgesAmount(nr_edges_to_delete);
	    };
	    SimplePerturber.prototype.randomlyDeleteNodesAmount = function (amount) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to remove a negative amount of nodes';
	        }
	        if (this._graph.nrNodes() === 0) {
	            return;
	        }
	        for (var nodeID = 0, randomNodes = this._graph.pickRandomProperties(this._graph.getNodes(), amount); nodeID < randomNodes.length; nodeID++) {
	            this._graph.deleteNode(this._graph.getNodes()[randomNodes[nodeID]]);
	        }
	    };
	    SimplePerturber.prototype.randomlyDeleteUndEdgesAmount = function (amount) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to remove a negative amount of edges';
	        }
	        if (this._graph.nrUndEdges() === 0) {
	            return;
	        }
	        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getUndEdges(), amount); edgeID < randomEdges.length; edgeID++) {
	            this._graph.deleteEdge(this._graph.getUndEdges()[randomEdges[edgeID]]);
	        }
	    };
	    SimplePerturber.prototype.randomlyDeleteDirEdgesAmount = function (amount) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to remove a negative amount of edges';
	        }
	        if (this._graph.nrDirEdges() === 0) {
	            return;
	        }
	        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getDirEdges(), amount); edgeID < randomEdges.length; edgeID++) {
	            this._graph.deleteEdge(this._graph.getDirEdges()[randomEdges[edgeID]]);
	        }
	    };
	    SimplePerturber.prototype.randomlyAddUndEdgesPercentage = function (percentage) {
	        var nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
	        this.randomlyAddEdgesAmount(nr_und_edges_to_add, { directed: false });
	    };
	    SimplePerturber.prototype.randomlyAddDirEdgesPercentage = function (percentage) {
	        var nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
	        this.randomlyAddEdgesAmount(nr_dir_edges_to_add, { directed: true });
	    };
	    SimplePerturber.prototype.randomlyAddEdgesAmount = function (amount, config) {
	        if (amount <= 0) {
	            throw new Error('Cowardly refusing to add a non-positive amount of edges');
	        }
	        var node_a, node_b, nodes;
	        var direction = (config && config.directed) ? config.directed : false, dir = direction ? "_d" : "_u";
	        while (amount) {
	            node_a = this._graph.getRandomNode();
	            while ((node_b = this._graph.getRandomNode()) === node_a) { }
	            var edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	            if (node_a.hasEdgeID(edge_id)) {
	                continue;
	            }
	            else {
	                this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: direction });
	                --amount;
	            }
	        }
	    };
	    SimplePerturber.prototype.randomlyAddNodesPercentage = function (percentage, config) {
	        var nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage / 100);
	        this.randomlyAddNodesAmount(nr_nodes_to_add, config);
	    };
	    SimplePerturber.prototype.randomlyAddNodesAmount = function (amount, config) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to add a negative amount of nodes';
	        }
	        var new_nodes = {};
	        while (amount--) {
	            var new_node_id = randgen.randBase36String();
	            new_nodes[new_node_id] = this._graph.addNodeByID(new_node_id);
	        }
	        if (config == null) {
	            return;
	        }
	        else {
	            this.createEdgesByConfig(config, new_nodes);
	        }
	    };
	    SimplePerturber.prototype.createEdgesByConfig = function (config, new_nodes) {
	        var degree, min_degree, max_degree, deg_probability;
	        if (config.und_degree != null ||
	            config.dir_degree != null ||
	            config.min_und_degree != null && config.max_und_degree != null ||
	            config.min_dir_degree != null && config.max_dir_degree != null) {
	            if ((degree = config.und_degree) != null) {
	                this.createRandomEdgesSpan(degree, degree, false, new_nodes);
	            }
	            else if ((min_degree = config.min_und_degree) != null
	                && (max_degree = config.max_und_degree) != null) {
	                this.createRandomEdgesSpan(min_degree, max_degree, false, new_nodes);
	            }
	            if (degree = config.dir_degree) {
	                this.createRandomEdgesSpan(degree, degree, true, new_nodes);
	            }
	            else if ((min_degree = config.min_dir_degree) != null
	                && (max_degree = config.max_dir_degree) != null) {
	                this.createRandomEdgesSpan(min_degree, max_degree, true, new_nodes);
	            }
	        }
	        else {
	            if (config.probability_dir != null) {
	                this.createRandomEdgesProb(config.probability_dir, true, new_nodes);
	            }
	            if (config.probability_und != null) {
	                this.createRandomEdgesProb(config.probability_und, false, new_nodes);
	            }
	        }
	    };
	    SimplePerturber.prototype.createRandomEdgesProb = function (probability, directed, new_nodes) {
	        if (0 > probability || 1 < probability) {
	            throw new Error("Probability out of range.");
	        }
	        directed = directed || false;
	        new_nodes = new_nodes || this._graph.getNodes();
	        var all_nodes = this._graph.getNodes(), node_a, node_b, edge_id, dir = directed ? '_d' : '_u';
	        for (node_a in new_nodes) {
	            for (node_b in all_nodes) {
	                if (node_a !== node_b && Math.random() <= probability) {
	                    edge_id = all_nodes[node_a].getID() + "_" + all_nodes[node_b].getID() + dir;
	                    if (this._graph.getNodes()[node_a].hasEdgeID(edge_id)) {
	                        continue;
	                    }
	                    this._graph.addEdgeByID(edge_id, all_nodes[node_a], all_nodes[node_b], { directed: directed });
	                }
	            }
	        }
	    };
	    SimplePerturber.prototype.createRandomEdgesSpan = function (min, max, directed, setOfNodes) {
	        if (min < 0) {
	            throw new Error('Minimum degree cannot be negative.');
	        }
	        if (max >= this._graph.nrNodes()) {
	            throw new Error('Maximum degree exceeds number of reachable nodes.');
	        }
	        if (min > max) {
	            throw new Error('Minimum degree cannot exceed maximum degree.');
	        }
	        directed = directed || false;
	        var min = min | 0, max = max | 0, new_nodes = setOfNodes || this._graph.getNodes(), all_nodes = this._graph.getNodes(), idx_a, node_a, node_b, edge_id, node_keys = Object.keys(all_nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
	        for (idx_a in new_nodes) {
	            node_a = new_nodes[idx_a];
	            rand_idx = 0;
	            rand_deg = (Math.random() * (max - min) + min) | 0;
	            while (rand_deg) {
	                rand_idx = (keys_len * Math.random()) | 0;
	                node_b = all_nodes[node_keys[rand_idx]];
	                if (node_a !== node_b) {
	                    edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	                    if (node_a.hasEdgeID(edge_id)) {
	                        continue;
	                    }
	                    this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: directed });
	                    --rand_deg;
	                }
	            }
	        }
	    };
	    return SimplePerturber;
	}());
	exports.SimplePerturber = SimplePerturber;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var MCMFBoykov = (function () {
	    function MCMFBoykov(_graph, _source, _sink, config) {
	        this._graph = _graph;
	        this._source = _source;
	        this._sink = _sink;
	        this._state = {
	            residGraph: null,
	            activeNodes: {},
	            orphans: {},
	            treeS: {},
	            treeT: {},
	            parents: {},
	            path: [],
	            tree: {}
	        };
	        this._config = config || this.prepareMCMFStandardConfig();
	        if (this._config.directed) {
	            this.renameEdges(_graph);
	        }
	        this._state.residGraph = this._graph;
	        if (!this._config.directed) {
	            this._state.residGraph = this.convertToDirectedGraph(this._state.residGraph);
	            this._source = this._state.residGraph.getNodeById(this._source.getID());
	            this._sink = this._state.residGraph.getNodeById(this._sink.getID());
	        }
	    }
	    MCMFBoykov.prototype.calculateCycle = function () {
	        var result = {
	            edges: [],
	            edgeIDs: [],
	            cost: 0
	        };
	        this._state.treeS[this._source.getID()] = this._source;
	        this._state.tree[this._source.getID()] = "S";
	        this._state.treeT[this._sink.getID()] = this._sink;
	        this._state.tree[this._sink.getID()] = "T";
	        this._state.activeNodes[this._source.getID()] = this._source;
	        this._state.activeNodes[this._sink.getID()] = this._sink;
	        var nrCycles = 0;
	        while (true) {
	            this.grow();
	            if (!this._state.path.length) {
	                break;
	            }
	            this.augmentation();
	            this.adoption();
	            ++nrCycles;
	        }
	        console.log("computing result");
	        var smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
	        var smallTree_size = Object.keys(smallTree).length;
	        var smallTree_ids = Object.keys(smallTree);
	        for (var i = 0; i < smallTree_size; i++) {
	            var node_id = smallTree_ids[i];
	            var node = this._graph.getNodeById(node_id);
	            if (!this._config.directed) {
	                var undEdges = node.undEdges();
	                var undEdges_size = Object.keys(undEdges).length;
	                var undEdges_ids = Object.keys(undEdges);
	                for (var i_1 = 0; i_1 < undEdges_size; i_1++) {
	                    var edge = undEdges[undEdges_ids[i_1]];
	                    var neighbor = (edge.getNodes().a.getID() == node.getID()) ? edge.getNodes().b : edge.getNodes().a;
	                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	            }
	            else {
	                var outEdges_ids = Object.keys(node.outEdges());
	                var outEdges_length = outEdges_ids.length;
	                var inEdges_ids = Object.keys(node.inEdges());
	                var inEdges_length = inEdges_ids.length;
	                for (var i_2 = 0; i_2 < outEdges_length; i_2++) {
	                    var edge = this._graph.getEdgeById(outEdges_ids[i_2]);
	                    var neighbor = edge.getNodes().b;
	                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	                for (var i_3 = 0; i_3 < inEdges_length; i_3++) {
	                    var edge = this._graph.getEdgeById(inEdges_ids[i_3]);
	                    var neighbor = edge.getNodes().a;
	                    if (this.tree(neighbor) != this.tree(node)) {
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	            }
	        }
	        console.log("Cost => " + result.cost);
	        console.log("# cycles => " + nrCycles);
	        return result;
	    };
	    MCMFBoykov.prototype.renameEdges = function (graph) {
	        var edges = graph.getDirEdges();
	        var edges_ids = Object.keys(edges);
	        var edges_length = edges_ids.length;
	        for (var i = 0; i < edges_length; i++) {
	            var edge = edges[edges_ids[i]];
	            var weight = edge.getWeight();
	            graph.deleteEdge(edge);
	            var node_a = edge.getNodes().a;
	            var node_b = edge.getNodes().b;
	            var options = { directed: true, weighted: true, weight: weight };
	            var new_edge = graph.addEdgeByID(node_a.getID() + "_" + node_b.getID(), node_a, node_b, options);
	        }
	    };
	    MCMFBoykov.prototype.convertToDirectedGraph = function (uGraph) {
	        var dGraph = new $G.BaseGraph(uGraph._label + "_directed");
	        var nodes = uGraph.getNodes();
	        var nodes_ids = Object.keys(nodes);
	        var nodes_length = nodes_ids.length;
	        for (var i = 0; i < nodes_length; i++) {
	            var node = nodes[nodes_ids[i]];
	            dGraph.addNodeByID(node.getID());
	        }
	        var edges = uGraph.getUndEdges();
	        var edges_ids = Object.keys(edges);
	        var edges_length = edges_ids.length;
	        for (var i = 0; i < edges_length; i++) {
	            var und_edge = edges[edges_ids[i]];
	            var node_a_id = und_edge.getNodes().a.getID();
	            var node_b_id = und_edge.getNodes().b.getID();
	            var options = { directed: true, weighted: true, weight: und_edge.getWeight() };
	            dGraph.addEdgeByID(node_a_id + "_" + node_b_id, dGraph.getNodeById(node_a_id), dGraph.getNodeById(node_b_id), options);
	            dGraph.addEdgeByID(node_b_id + "_" + node_a_id, dGraph.getNodeById(node_b_id), dGraph.getNodeById(node_a_id), options);
	        }
	        return dGraph;
	    };
	    MCMFBoykov.prototype.tree = function (node) {
	        var tree = "";
	        if (node.getID() in this._state.treeS) {
	            tree = "S";
	            return tree;
	        }
	        if (node.getID() in this._state.treeT) {
	            tree = "T";
	            return tree;
	        }
	        return tree;
	    };
	    MCMFBoykov.prototype.getPathToRoot = function (node) {
	        var path_root = [];
	        var node_id = node.getID();
	        path_root.push(this._graph.getNodeById(node_id));
	        var sink_id = this._sink.getID();
	        var source_id = this._source.getID();
	        while ((node_id != sink_id) && (node_id != source_id)) {
	            if (this._state.parents[node_id] == null) {
	                return path_root;
	            }
	            node_id = this._state.parents[node_id].getID();
	            path_root.push(this._graph.getNodeById(node_id));
	        }
	        return path_root;
	    };
	    MCMFBoykov.prototype.getBottleneckCapacity = function () {
	        var min_capacity = 0;
	        var min_capacity = this._state.residGraph.getEdgeById(this._state.path[0].getID() + "_" + this._state.path[1].getID()).getWeight();
	        var path_length = this._state.path.length - 1;
	        for (var i = 0; i < path_length; i++) {
	            var node_a = this._state.path[i];
	            var node_b = this._state.path[i + 1];
	            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
	            if (edge.getWeight() < min_capacity) {
	                min_capacity = edge.getWeight();
	            }
	        }
	        return min_capacity;
	    };
	    MCMFBoykov.prototype.grow = function () {
	        var nr_active_nodes = Object.keys(this._state.activeNodes).length;
	        var active_nodes_ids = Object.keys(this._state.activeNodes);
	        while (nr_active_nodes) {
	            var activeNode = this._state.activeNodes[active_nodes_ids[0]];
	            var edges = (this._state.tree[activeNode.getID()] == "S") ? activeNode.outEdges() : activeNode.inEdges();
	            var edges_ids = Object.keys(edges);
	            var edges_length = edges_ids.length;
	            for (var i = 0; i < edges_length; i++) {
	                var edge = edges[edges_ids[i]];
	                var neighborNode = (this._state.tree[activeNode.getID()] == "S") ? edge.getNodes().b : edge.getNodes().a;
	                if (edge.getWeight() <= 0) {
	                    continue;
	                }
	                if (!(this._state.tree[neighborNode.getID()])) {
	                    if (this._state.tree[activeNode.getID()] == "S") {
	                        this._state.treeS[neighborNode.getID()] = neighborNode;
	                        this._state.tree[neighborNode.getID()] = "S";
	                    }
	                    else {
	                        this._state.treeT[neighborNode.getID()] = neighborNode;
	                        this._state.tree[neighborNode.getID()] = "T";
	                    }
	                    this._state.parents[neighborNode.getID()] = activeNode;
	                    this._state.activeNodes[neighborNode.getID()] = neighborNode;
	                    active_nodes_ids.push(neighborNode.getID());
	                    ++nr_active_nodes;
	                }
	                else if (this._state.tree[neighborNode.getID()] != this._state.tree[activeNode.getID()]) {
	                    var complete_path;
	                    var nPath = this.getPathToRoot(neighborNode);
	                    var aPath = this.getPathToRoot(activeNode);
	                    var root_node_npath = nPath[nPath.length - 1];
	                    if (this._state.tree[root_node_npath.getID()] == "S") {
	                        nPath = nPath.reverse();
	                        complete_path = nPath.concat(aPath);
	                    }
	                    else {
	                        aPath = aPath.reverse();
	                        complete_path = aPath.concat(nPath);
	                    }
	                    this._state.path = complete_path;
	                    return;
	                }
	            }
	            delete this._state.activeNodes[activeNode.getID()];
	            active_nodes_ids.shift();
	            --nr_active_nodes;
	        }
	        this._state.path = [];
	        return;
	    };
	    MCMFBoykov.prototype.augmentation = function () {
	        var min_capacity = this.getBottleneckCapacity();
	        for (var i = 0; i < this._state.path.length - 1; i++) {
	            var node_a = this._state.path[i], node_b = this._state.path[i + 1];
	            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
	            var reverse_edge = this._state.residGraph.getEdgeById(node_b.getID() + "_" + node_a.getID());
	            this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
	            this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
	            edge = this._state.residGraph.getEdgeById(edge.getID());
	            if (!edge.getWeight()) {
	                if (this._state.tree[node_a.getID()] == this._state.tree[node_b.getID()]) {
	                    if (this._state.tree[node_b.getID()] == "S") {
	                        delete this._state.parents[node_b.getID()];
	                        this._state.orphans[node_b.getID()] = node_b;
	                    }
	                    if (this._state.tree[node_a.getID()] == "T") {
	                        delete this._state.parents[node_a.getID()];
	                        this._state.orphans[node_a.getID()] = node_a;
	                    }
	                }
	            }
	        }
	    };
	    MCMFBoykov.prototype.adoption = function () {
	        var orphans_ids = Object.keys(this._state.orphans);
	        var orphans_size = orphans_ids.length;
	        while (orphans_size) {
	            var orphan = this._state.orphans[orphans_ids[0]];
	            delete this._state.orphans[orphan.getID()];
	            orphans_ids.shift();
	            --orphans_size;
	            var edges = (this._state.tree[orphan.getID()] == "S") ? orphan.inEdges() : orphan.outEdges();
	            var edge_ids = Object.keys(edges);
	            var edge_length = edge_ids.length;
	            var found = false;
	            for (var i = 0; i < edge_length; i++) {
	                var edge = edges[edge_ids[i]];
	                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if ((this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) && edge.getWeight()) {
	                    var neighbor_root_path = this.getPathToRoot(neighbor);
	                    var neighbor_root = neighbor_root_path[neighbor_root_path.length - 1];
	                    if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
	                        this._state.parents[orphan.getID()] = neighbor;
	                        found = true;
	                        break;
	                    }
	                }
	            }
	            if (found) {
	                continue;
	            }
	            for (var i = 0; i < edge_length; i++) {
	                var edge = edges[edge_ids[i]];
	                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if (this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) {
	                    if (edge.getWeight()) {
	                        this._state.activeNodes[neighbor.getID()] = neighbor;
	                    }
	                    if (this._state.parents[neighbor.getID()] == null) {
	                        continue;
	                    }
	                    if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
	                        this._state.orphans[neighbor.getID()] = neighbor;
	                        orphans_ids.push(neighbor.getID());
	                        ++orphans_size;
	                        delete this._state.parents[neighbor.getID()];
	                    }
	                }
	            }
	            var orphan_tree = this._state.tree[orphan.getID()];
	            if (orphan_tree == "S") {
	                delete this._state.treeS[orphan.getID()];
	                delete this._state.tree[orphan.getID()];
	            }
	            else if (orphan_tree == "T") {
	                delete this._state.treeT[orphan.getID()];
	                delete this._state.tree[orphan.getID()];
	            }
	            delete this._state.activeNodes[orphan.getID()];
	        }
	    };
	    MCMFBoykov.prototype.prepareMCMFStandardConfig = function () {
	        return {
	            directed: true
	        };
	    };
	    return MCMFBoykov;
	}());
	exports.MCMFBoykov = MCMFBoykov;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	(function (DegreeMode) {
	    DegreeMode[DegreeMode["in"] = 0] = "in";
	    DegreeMode[DegreeMode["out"] = 1] = "out";
	    DegreeMode[DegreeMode["und"] = 2] = "und";
	    DegreeMode[DegreeMode["dir"] = 3] = "dir";
	    DegreeMode[DegreeMode["all"] = 4] = "all";
	})(exports.DegreeMode || (exports.DegreeMode = {}));
	var DegreeMode = exports.DegreeMode;
	var degreeCentrality = (function () {
	    function degreeCentrality() {
	    }
	    degreeCentrality.prototype.getCentralityMap = function (graph, weighted, conf) {
	        weighted = (weighted != null) ? !!weighted : true;
	        conf = (conf == null) ? DegreeMode.all : conf;
	        var ret = {};
	        switch (conf) {
	            case DegreeMode.in:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.inDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.inEdges()) {
	                                ret[key] += node.inEdges()[k].getWeight();
	                            }
	                        }
	                }
	                break;
	            case DegreeMode.out:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.outDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.outEdges())
	                                ret[key] += node.outEdges()[k].getWeight();
	                        }
	                }
	                break;
	            case DegreeMode.und:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.degree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.undEdges())
	                                ret[key] += node.undEdges()[k].getWeight();
	                        }
	                }
	                break;
	            case DegreeMode.dir:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.inDegree() + node.outDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
	                            for (var k in comb)
	                                ret[key] += comb[k].getWeight();
	                        }
	                }
	                break;
	            case DegreeMode.all:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.degree() + node.inDegree() + node.outDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
	                            for (var k in comb) {
	                                ret[key] += comb[k].getWeight();
	                            }
	                        }
	                }
	                break;
	        }
	        return ret;
	    };
	    degreeCentrality.prototype.getHistorgram = function (graph) {
	        return graph.degreeDistribution();
	    };
	    return degreeCentrality;
	}());
	exports.degreeCentrality = degreeCentrality;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $PFS = __webpack_require__(11);
	var $FW = __webpack_require__(21);
	var closenessCentrality = (function () {
	    function closenessCentrality() {
	    }
	    closenessCentrality.prototype.getCentralityMapFW = function (graph) {
	        var dists = $FW.FloydWarshallArray(graph);
	        var ret = [];
	        var N = dists.length;
	        for (var a = 0; a < N; ++a) {
	            var sum = 0;
	            for (var b = 0; b < N; ++b) {
	                if (dists[a][b] != Number.POSITIVE_INFINITY)
	                    sum += dists[a][b];
	            }
	            ret[a] = 1 / sum;
	        }
	        return ret;
	    };
	    closenessCentrality.prototype.getCentralityMap = function (graph) {
	        var pfs_config = $PFS.preparePFSStandardConfig();
	        var accumulated_distance = 0;
	        var not_encountered = function (context) {
	            accumulated_distance += context.current.best + (isNaN(context.next.edge.getWeight()) ? 1 : context.next.edge.getWeight());
	        };
	        var betterPathFound = function (context) {
	            accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.better_dist;
	        };
	        var bp = pfs_config.callbacks.better_path.pop();
	        pfs_config.callbacks.better_path.push(betterPathFound);
	        pfs_config.callbacks.better_path.push(bp);
	        pfs_config.callbacks.not_encountered.push(not_encountered);
	        var ret = {};
	        for (var key in graph.getNodes()) {
	            var node = graph.getNodeById(key);
	            if (node != null) {
	                accumulated_distance = 0;
	                $PFS.PFS(graph, node, pfs_config);
	                ret[key] = 1 / accumulated_distance;
	            }
	        }
	        return ret;
	    };
	    return closenessCentrality;
	}());
	exports.closenessCentrality = closenessCentrality;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $FW = __webpack_require__(21);
	function inBetweennessCentrality(graph, sparse) {
	    var paths;
	    paths = $FW.FloydWarshallAPSP(graph)[1];
	    var nodes = graph.adjListArray();
	    var map = {};
	    for (var keyA in nodes) {
	        map[keyA] = 0;
	    }
	    var N = paths.length;
	    for (var a = 0; a < N; ++a) {
	        for (var b = 0; b < N; ++b) {
	            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
	                addBetweeness(a, b, paths, map, a);
	            }
	        }
	    }
	    var dem = 0;
	    for (var a_1 in map) {
	        dem += map[a_1];
	    }
	    for (var a_2 in map) {
	        map[a_2] /= dem;
	    }
	    return map;
	}
	exports.inBetweennessCentrality = inBetweennessCentrality;
	function addBetweeness(u, v, next, map, start) {
	    if (u == v)
	        return 1;
	    var nodes = 0;
	    for (var e = 0; e < next[u][v].length; e++) {
	        nodes += addBetweeness(next[u][v][e], v, next, map, start);
	    }
	    if (u != start) {
	        map[u] += nodes;
	    }
	    return nodes;
	}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var $GAUSS = __webpack_require__(29);
	var pageRankDetCentrality = (function () {
	    function pageRankDetCentrality() {
	    }
	    pageRankDetCentrality.prototype.getCentralityMap = function (graph, weighted) {
	        var divideTable = {};
	        var matr = [];
	        var ctr = 0;
	        var map = {};
	        for (var key in graph.getNodes()) {
	            divideTable[key] = 0;
	        }
	        for (var key in graph.getNodes()) {
	            map[key] = ctr;
	            var node = graph.getNodeById(key);
	            var node_InEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
	            matr[ctr] = new Array();
	            for (var edgeKey in node_InEdges) {
	                var edge = node_InEdges[edgeKey];
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
	        var mapCtr = {};
	        var numMatr = [[]];
	        for (var key in matr) {
	            numMatr[key] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
	            var p = matr[key].pop();
	            if (mapCtr[p] == null)
	                mapCtr[p] = ctr++;
	            numMatr[key][mapCtr[p]] = -1;
	            for (var k in matr[key]) {
	                var a = matr[key][k];
	                if (mapCtr[a] == null)
	                    mapCtr[a] = ctr++;
	                numMatr[key][mapCtr[a]] += 1 / divideTable[a];
	            }
	        }
	        numMatr[numMatr.length - 1] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 1);
	        var x = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
	        x[x.length - 1] = 1;
	        x = $GAUSS.gauss(numMatr, x);
	        var y = {};
	        for (var key in map) {
	            y[key] = x[ctr];
	        }
	        return x;
	    };
	    return pageRankDetCentrality;
	}());
	exports.pageRankDetCentrality = pageRankDetCentrality;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	"use strict";
	var abs = Math.abs;
	function array_fill(i, n, v) {
	    var a = [];
	    for (; i < n; i++) {
	        a.push(v);
	    }
	    return a;
	}
	function gauss(A, x) {
	    var i, k, j;
	    for (i = 0; i < A.length; i++) {
	        A[i].push(x[i]);
	    }
	    var n = A.length;
	    for (i = 0; i < n; i++) {
	        var maxEl = abs(A[i][i]), maxRow = i;
	        for (k = i + 1; k < n; k++) {
	            if (abs(A[k][i]) > maxEl) {
	                maxEl = abs(A[k][i]);
	                maxRow = k;
	            }
	        }
	        for (k = i; k < n + 1; k++) {
	            var tmp = A[maxRow][k];
	            A[maxRow][k] = A[i][k];
	            A[i][k] = tmp;
	        }
	        for (k = i + 1; k < n; k++) {
	            var c = -A[k][i] / A[i][i];
	            for (j = i; j < n + 1; j++) {
	                if (i === j) {
	                    A[k][j] = 0;
	                }
	                else {
	                    A[k][j] += c * A[i][j];
	                }
	            }
	        }
	    }
	    x = array_fill(0, n, 0);
	    for (i = n - 1; i > -1; i--) {
	        x[i] = A[i][n] / A[i][i];
	        for (k = i - 1; k > -1; k--) {
	            A[k][n] -= A[k][i] * x[i];
	        }
	    }
	    return x;
	}
	exports.gauss = gauss;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var pageRankCentrality = (function () {
	    function pageRankCentrality() {
	    }
	    pageRankCentrality.prototype.getCentralityMap = function (graph, weighted, alpha, conv, iterations) {
	        if (alpha == null)
	            alpha = 0.10;
	        if (iterations == null)
	            iterations = 1000;
	        if (conv == null)
	            conv = 0.000125;
	        var curr = {};
	        var old = {};
	        var nrNodes = graph.nrNodes();
	        var structure = {};
	        for (var key in graph.getNodes()) {
	            key = String(key);
	            var node = graph.getNodeById(key);
	            structure[key] = {};
	            structure[key]['deg'] = node.outDegree() + node.degree();
	            structure[key]['inc'] = [];
	            var incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
	            for (var edge in incomingEdges) {
	                var edgeNode = incomingEdges[edge];
	                var parent_1 = edgeNode.getNodes().a;
	                if (edgeNode.getNodes().a.getID() == node.getID())
	                    parent_1 = edgeNode.getNodes().b;
	                structure[key]['inc'].push(parent_1.getID());
	            }
	        }
	        for (var key in graph.getNodes()) {
	            key = String(key);
	            curr[key] = 1 / nrNodes;
	            old[key] = 1 / nrNodes;
	        }
	        for (var i = 0; i < iterations; i++) {
	            var me = 0.0;
	            for (var key in graph.getNodes()) {
	                key = String(key);
	                var total = 0;
	                var parents = structure[key]['inc'];
	                for (var k in parents) {
	                    var p = String(parents[k]);
	                    total += old[p] / structure[p]['deg'];
	                }
	                curr[key] = total * (1 - alpha) + alpha / nrNodes;
	                me += Math.abs(curr[key] - old[key]);
	            }
	            if (me <= conv) {
	                return curr;
	            }
	            old = $SU.clone(curr);
	        }
	        return curr;
	    };
	    return pageRankCentrality;
	}());
	exports.pageRankCentrality = pageRankCentrality;


/***/ })
/******/ ]);