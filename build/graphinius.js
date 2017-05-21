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
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Edges			      = __webpack_require__(1);
	var Nodes 		      = __webpack_require__(2);
	var Graph 		      = __webpack_require__(4);
	var CSVInput 	      = __webpack_require__(7);
	var CSVOutput       = __webpack_require__(12);
	var JSONInput       = __webpack_require__(13);
	var JSONOutput      = __webpack_require__(14);
	var BFS				      = __webpack_require__(15);
	var DFS				      = __webpack_require__(17);
	var PFS             = __webpack_require__(18);
	var structUtils     = __webpack_require__(3);
	var remoteUtils     = __webpack_require__(11);
	var callbackUtils   = __webpack_require__(16);
	var randGen         = __webpack_require__(20);
	var binaryHeap      = __webpack_require__(19);
	var simplePerturbation = __webpack_require__(21);
	var MCMFBoykov			= __webpack_require__(22);
	var degCent				 	= __webpack_require__(23)

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
			degree: degCent
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
	    preparePFSStandardConfig       : PFS.preparePFSStandardConfig
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	var $DS = __webpack_require__(3);
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
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
	    BaseGraph.prototype.adjList = function (incoming) {
	        if (incoming === void 0) { incoming = false; }
	        var adj_list = {}, nodes = this.getNodes(), weight;
	        for (var key_1 in nodes) {
	            adj_list[key_1] = {};
	        }
	        for (var key in nodes) {
	            var neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();
	            neighbors.forEach(function (ne) {
	                weight = adj_list[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
	                if (ne.edge.getWeight() < weight) {
	                    adj_list[key][ne.node.getID()] = ne.edge.getWeight();
	                    if (incoming) {
	                        adj_list[ne.node.getID()][key] = ne.edge.getWeight();
	                    }
	                }
	                else {
	                    adj_list[key][ne.node.getID()] = weight;
	                    if (incoming) {
	                        adj_list[ne.node.getID()][key] = weight;
	                    }
	                }
	            });
	        }
	        return adj_list;
	    };
	    BaseGraph.prototype.getMode = function () {
	        return this._mode;
	    };
	    BaseGraph.prototype.getStats = function () {
	        return {
	            mode: this._mode,
	            nr_nodes: this._nr_nodes,
	            nr_und_edges: this._nr_und_edges,
	            nr_dir_edges: this._nr_dir_edges
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
	    BaseGraph.prototype.hasNodeID = function (id) {
	        return !!this._nodes[id];
	    };
	    BaseGraph.prototype.hasNodeLabel = function (label) {
	        return !!$DS.findKey(this._nodes, function (node) {
	            return node.getLabel() === label;
	        });
	    };
	    BaseGraph.prototype.getNodeById = function (id) {
	        return this._nodes[id];
	    };
	    BaseGraph.prototype.getNodeByLabel = function (label) {
	        var id = $DS.findKey(this._nodes, function (node) {
	            return node.getLabel() === label;
	        });
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
	    BaseGraph.prototype.getEdgeByLabel = function (label) {
	        var dir_id = $DS.findKey(this._dir_edges, function (edge) {
	            return edge.getLabel() === label;
	        });
	        var und_id = $DS.findKey(this._und_edges, function (edge) {
	            return edge.getLabel() === label;
	        });
	        var edge = this._dir_edges[dir_id] || this._und_edges[und_id];
	        if (!edge) {
	            throw new Error("cannot retrieve edge with non-existing Label.");
	        }
	        return edge;
	    };
	    BaseGraph.prototype.getEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        if (!node_a) {
	            throw new Error("Cannot find edge. Node A does not exist");
	        }
	        var node_b = this.getNodeById(node_b_id);
	        if (!node_b) {
	            throw new Error("Cannot find edge. Node B does not exist");
	        }
	        var edges_dir = node_a.outEdges();
	        for (var i = 0; i < Object.keys(edges_dir).length; i++) {
	            var edge = edges_dir[Object.keys(edges_dir)[i]];
	            if (edge.getNodes().b.getID() == node_b_id) {
	                return edge;
	            }
	        }
	        var edges_und = node_a.undEdges();
	        for (var i = 0; i < Object.keys(edges_und).length; i++) {
	            var edge = edges_und[Object.keys(edges_und)[i]];
	            var b;
	            (edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
	            if (b == node_b_id) {
	                return edge;
	            }
	        }
	        throw new Error("Cannot find edge. There is no edge between Node " + node_a_id + " and " + node_b_id);
	    };
	    BaseGraph.prototype.getDirEdges = function () {
	        return this._dir_edges;
	    };
	    BaseGraph.prototype.getUndEdges = function () {
	        return this._und_edges;
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
	        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())) {
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var path = __webpack_require__(8);
	var fs = __webpack_require__(10);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(11);
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 9 */
/***/ function(module, exports) {

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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 10 */
/***/ function(module, exports) {

	

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var http = __webpack_require__(10);
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(10);
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


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(10);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(11);
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
	                var edge_input = edges[e], target_node_id = edge_input.to, directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', weight_float = parseFloat(edge_input.weight), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
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
	    JSONInput.prototype.checkNodeEnvironment = function () {
	        if (typeof window !== 'undefined') {
	            throw new Error('Cannot read file in browser environment.');
	        }
	    };
	    return JSONInput;
	}());
	exports.JSONInput = JSONInput;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(10);
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
	                    weight: edge.isWeighted() ? edge.getWeight() : undefined
	                });
	            }
	            node_struct.features = node.getFeatures();
	            if ((coords = node.getFeature('coords')) != null) {
	                node_struct['coords'] = coords;
	            }
	        }
	        return JSON.stringify(result);
	    };
	    return JSONOutput;
	}());
	exports.JSONOutput = JSONOutput;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(16);
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


/***/ },
/* 16 */
/***/ function(module, exports) {

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


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(16);
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


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var $E = __webpack_require__(1);
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(16);
	var $BH = __webpack_require__(19);
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
	                scope.better_dist = scope.current.best + scope.next.edge.getWeight();
	                if (scope.next.best > scope.better_dist) {
	                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
	                    scope.OPEN_HEAP.remove(scope.next);
	                    scope.next.best = scope.better_dist;
	                    scope.OPEN_HEAP.insert(scope.next);
	                    scope.OPEN[scope.next.node.getID()].best = scope.better_dist;
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
	            goal_reached: []
	        },
	        messages: {
	            init_pfs_msgs: [],
	            not_enc_msgs: [],
	            node_open_msgs: [],
	            node_closed_msgs: [],
	            better_path_msgs: [],
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
	        context.next.best = context.current.best + context.next.edge.getWeight();
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


/***/ },
/* 19 */
/***/ function(module, exports) {

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


/***/ },
/* 20 */
/***/ function(module, exports) {

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


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var randgen = __webpack_require__(20);
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


/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
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
	            path: []
	        };
	        this._config = config || this.prepareMCMFStandardConfig();
	        this._state.residGraph = _graph;
	    }
	    MCMFBoykov.prototype.calculateCycle = function () {
	        var result = {
	            edges: [],
	            edgeIDs: [],
	            cost: 0
	        };
	        this._state.treeS[this._source.getID()] = this._source;
	        this._state.treeT[this._sink.getID()] = this._sink;
	        this._state.activeNodes[this._source.getID()] = this._source;
	        this._state.activeNodes[this._sink.getID()] = this._sink;
	        var nrCycles = 0;
	        while (true) {
	            var path = this.grow();
	            if (!path.length) {
	                break;
	            }
	            this.augmentation();
	            this.adoption();
	            ++nrCycles;
	        }
	        var smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
	        for (var i = 0; i < Object.keys(smallTree).length; i++) {
	            var node_id = smallTree[Object.keys(smallTree)[i]].getID();
	            var node = this._graph.getNodeById(node_id);
	            var outEdges = node.outEdges();
	            var inEdges = node.inEdges();
	            for (var i_1 = 0; i_1 < Object.keys(outEdges).length; i_1++) {
	                var edge = outEdges[Object.keys(outEdges)[i_1]];
	                var neighbor = edge.getNodes().b;
	                if (this.tree(neighbor) != this.tree(node)) {
	                    result.edges.push(edge);
	                    result.edgeIDs.push(edge.getID());
	                    result.cost += edge.getWeight();
	                }
	            }
	            for (var i_2 = 0; i_2 < Object.keys(inEdges).length; i_2++) {
	                var edge = inEdges[Object.keys(inEdges)[i_2]];
	                var neighbor = edge.getNodes().a;
	                if (this.tree(neighbor) != this.tree(node)) {
	                    result.edges.push(edge);
	                    result.edgeIDs.push(edge.getID());
	                    result.cost += edge.getWeight();
	                }
	            }
	        }
	        console.log("Cost => " + result.cost);
	        console.log("# cycles => " + nrCycles);
	        return result;
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
	        var path = [];
	        var node_id = node.getID();
	        path.push(this._graph.getNodeById(node_id));
	        while ((node_id != this._sink.getID()) && (node_id != this._source.getID())) {
	            if (this._state.parents[node_id] == null) {
	                return path;
	            }
	            node_id = this._state.parents[node_id].getID();
	            path.push(this._graph.getNodeById(node_id));
	        }
	        return path;
	    };
	    MCMFBoykov.prototype.getBottleneckCapacity = function (path) {
	        var min_capacity = 0;
	        for (var i = 0; i < path.length - 1; i++) {
	            var node_a = path[i];
	            var node_b = path[i + 1];
	            var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
	            if (!i) {
	                min_capacity = edge.getWeight();
	                continue;
	            }
	            if (edge.getWeight() < min_capacity) {
	                min_capacity = edge.getWeight();
	            }
	        }
	        return min_capacity;
	    };
	    MCMFBoykov.prototype.grow = function () {
	        while (Object.keys(this._state.activeNodes).length) {
	            var activeNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
	            var edges = (this.tree(activeNode) == "S") ? activeNode.outEdges() : activeNode.inEdges();
	            for (var i = 0; i < Object.keys(edges).length; i++) {
	                var edge = edges[(Object.keys(edges)[i])];
	                var neighborNode = (this.tree(activeNode) == "S") ? edge.getNodes().b : edge.getNodes().a;
	                if (edge.getWeight() <= 0) {
	                    continue;
	                }
	                if (this.tree(neighborNode) == "") {
	                    (this.tree(activeNode) == "S") ? this._state.treeS[neighborNode.getID()] = neighborNode : this._state.treeT[neighborNode.getID()] = neighborNode;
	                    this._state.parents[neighborNode.getID()] = activeNode;
	                    this._state.activeNodes[neighborNode.getID()] = neighborNode;
	                }
	                else if (this.tree(neighborNode) != this.tree(activeNode)) {
	                    var path;
	                    var nPath = this.getPathToRoot(neighborNode);
	                    var aPath = this.getPathToRoot(activeNode);
	                    var root_node_npath = nPath[nPath.length - 1];
	                    if (this.tree(root_node_npath) == "S") {
	                        nPath = nPath.reverse();
	                        path = nPath.concat(aPath);
	                    }
	                    else {
	                        aPath = aPath.reverse();
	                        path = aPath.concat(nPath);
	                    }
	                    this._state.path = path;
	                    return this._state.path;
	                }
	            }
	            delete this._state.activeNodes[activeNode.getID()];
	        }
	        return [];
	    };
	    MCMFBoykov.prototype.augmentation = function () {
	        var min_capacity = this.getBottleneckCapacity(this._state.path);
	        for (var i = 0; i < this._state.path.length - 1; i++) {
	            var node_a = this._state.path[i], node_b = this._state.path[i + 1];
	            var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
	            var reverse_edge = this._state.residGraph.getEdgeByNodeIDs(node_b.getID(), node_a.getID());
	            this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
	            this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
	            edge = this._state.residGraph.getEdgeById(edge.getID());
	            if (!edge.getWeight()) {
	                if (this.tree(node_a) == this.tree(node_b)) {
	                    if (this.tree(node_b) == "S") {
	                        delete this._state.parents[node_b.getID()];
	                        this._state.orphans[node_b.getID()] = node_b;
	                    }
	                    if (this.tree(node_a) == "T") {
	                        delete this._state.parents[node_a.getID()];
	                        this._state.orphans[node_a.getID()] = node_a;
	                    }
	                }
	            }
	        }
	    };
	    MCMFBoykov.prototype.adoption = function () {
	        while (Object.keys(this._state.orphans).length) {
	            var orphan = this._state.orphans[Object.keys(this._state.orphans)[0]];
	            delete this._state.orphans[orphan.getID()];
	            var edges = (this.tree(orphan) == "S") ? orphan.inEdges() : orphan.outEdges();
	            var found = false;
	            for (var i = 0; i < Object.keys(edges).length; i++) {
	                var edge = edges[Object.keys(edges)[i]];
	                var neighbor = (this.tree(orphan) == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if ((this.tree(orphan) == this.tree(neighbor)) && edge.getWeight()) {
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
	            for (var i = 0; i < Object.keys(edges).length; i++) {
	                var edge = edges[Object.keys(edges)[i]];
	                var neighbor = (this.tree(orphan) == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if (this.tree(orphan) == this.tree(neighbor)) {
	                    if (edge.getWeight()) {
	                        this._state.activeNodes[neighbor.getID()] = neighbor;
	                    }
	                    if (this._state.parents[neighbor.getID()] == null) {
	                        continue;
	                    }
	                    if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
	                        this._state.orphans[neighbor.getID()] = neighbor;
	                        delete this._state.parents[neighbor.getID()];
	                    }
	                }
	            }
	            var orphan_tree = this.tree(orphan);
	            if (orphan_tree == "S") {
	                delete this._state.treeS[orphan.getID()];
	            }
	            else if (orphan_tree == "T") {
	                delete this._state.treeT[orphan.getID()];
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


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

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
	        if (weighted == null)
	            weighted = true;
	        if (!weighted && weighted != null)
	            weighted = false;
	        if (conf == null)
	            conf = DegreeMode.all;
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


/***/ }
/******/ ]);