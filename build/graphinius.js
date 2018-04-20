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
	var CSVInput 	      = __webpack_require__(14);
	var CSVOutput       = __webpack_require__(19);
	var JSONInput       = __webpack_require__(20);
	var JSONOutput      = __webpack_require__(21);
	var BFS				      = __webpack_require__(8);
	var DFS				      = __webpack_require__(10);
	var PFS             = __webpack_require__(12);
	var BellmanFord     = __webpack_require__(11);
	var FloydWarshall		= __webpack_require__(22);
	var structUtils     = __webpack_require__(3);
	var remoteUtils     = __webpack_require__(17);
	var callbackUtils   = __webpack_require__(9);
	var binaryHeap      = __webpack_require__(13);
	var simplePerturbation = __webpack_require__(23);
	var MCMFBoykov			= __webpack_require__(24);
	var DegreeCent		 	= __webpack_require__(25);
	var ClosenessCent	 	= __webpack_require__(26);
	var BetweennessCent	= __webpack_require__(27);
	var PRGauss					= __webpack_require__(29);
	var PRRandomWalk		= __webpack_require__(31);
	var kronLeskovec		= __webpack_require__(32);


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
	    callback        : callbackUtils
	  },
	  datastructs: {
	    BinaryHeap  : binaryHeap.BinaryHeap
	  },
		perturbation: {
			SimplePerturber: simplePerturbation.SimplePerturber
		},
		generators: {
			kronecker: kronLeskovec
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
	Object.defineProperty(exports, "__esModule", { value: true });
	var $N = __webpack_require__(2);
	var BaseEdge = /** @class */ (function () {
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
	        // @NOTE isNaN and Number.isNaN confusion...
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
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $SU = __webpack_require__(3);
	var BaseNode = /** @class */ (function () {
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
	        // if ( !feat ) {
	        // 	throw new Error("Cannot retrieve non-existing feature.");
	        // }
	        // return feat;
	    };
	    BaseNode.prototype.setFeatures = function (features) {
	        this._features = $SU.clone(features);
	    };
	    BaseNode.prototype.setFeature = function (key, value) {
	        this._features[key] = value;
	    };
	    BaseNode.prototype.deleteFeature = function (key) {
	        var feat = this._features[key];
	        // if ( !feat ) {
	        // 	throw new Error("Cannot delete non-existing feature.");
	        // }
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
	    /**
	     * We have to:
	     * 1. throw an error if the edge is already attached
	     * 2. add it to the edge array
	     * 3. check type of edge (directed / undirected)
	     * 4. update our degrees accordingly
	     * This is a design decision we can defend by pointing out
	     * that querying degrees will occur much more often
	     * than modifying the edge structure of a node (??)
	     * One further point: do we also check for duplicate
	     * edges not in the sense of duplicate ID's but duplicate
	     * structure (nodes, direction) ?
	     * => Not for now, as we would have to check every edge
	     * instead of simply checking the hash id...
	     * ALTHOUGH: adding edges will (presumably) not occur often...
	     */
	    BaseNode.prototype.addEdge = function (edge) {
	        // is this edge connected to us at all?
	        var nodes = edge.getNodes();
	        if (nodes.a !== this && nodes.b !== this) {
	            throw new Error("Cannot add edge that does not connect to this node");
	        }
	        var edge_id = edge.getID();
	        // Is it an undirected or directed edge?
	        if (edge.isDirected()) {
	            // is it outgoing or incoming?
	            if (nodes.a === this && !this._out_edges[edge_id]) {
	                this._out_edges[edge_id] = edge;
	                this._out_degree += 1;
	                // Is the edge also connecting to ourselves -> loop ?
	                if (nodes.b === this && !this._in_edges[edge_id]) {
	                    this._in_edges[edge.getID()] = edge;
	                    this._in_degree += 1;
	                }
	            }
	            else if (!this._in_edges[edge_id]) { // nodes.b === this
	                this._in_edges[edge.getID()] = edge;
	                this._in_degree += 1;
	            }
	        }
	        else {
	            // Is the edge also connecting to ourselves -> loop
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
	    /**
	     *
	     * @param identityFunc can be used to remove 'duplicates' from resulting array,
	     * if necessary
	     * @returns {Array}
	     *
	   */
	    BaseNode.prototype.reachNodes = function (identityFunc) {
	        var identity = 0;
	        // console.log(this.nextNodes());
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
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	/**
	 * Method to deep clone an object
	 *
	 * @param obj
	 * @returns {*}
	 *
	 */
	function clone(obj) {
	    if (obj === null || typeof obj !== 'object') {
	        return obj;
	    }
	    // check for nodes or edges and ignore them
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
	/**
	 * @args an Array of any kind of objects
	 * @cb callback to return a unique identifier;
	 * if this is duplicate, the object will not be stored in result.
	 * @returns {Array}
	 */
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
	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * @param args Array of all the object to take keys from
	 * @returns result object
	 */
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
	/**
	 * @TODO Test !!!
	 *
	 * @param object
	 * @param cb
	 */
	function findKey(obj, cb) {
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key) && cb(obj[key])) {
	            return key;
	        }
	    }
	    return undefined;
	}
	exports.findKey = findKey;
	/**
	 * Takes two ordered number arrays and merges them. The returned array is
	 * also ordered and does not contain any duplicates.
	 *
	 * @param a: first array
	 * @param b: second array
	 */
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
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	var $DS = __webpack_require__(3);
	var logger_1 = __webpack_require__(5);
	var $BFS = __webpack_require__(8);
	var $DFS = __webpack_require__(10);
	var BellmanFord_1 = __webpack_require__(11);
	var logger = new logger_1.Logger();
	var DEFAULT_WEIGHT = 1;
	var GraphMode;
	(function (GraphMode) {
	    GraphMode[GraphMode["INIT"] = 0] = "INIT";
	    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
	    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
	    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
	})(GraphMode = exports.GraphMode || (exports.GraphMode = {}));
	var BaseGraph = /** @class */ (function () {
	    // protected _typed_nodes: { [type: string] : { [key: string] : $N.IBaseNode } };
	    // protected _typed_dir_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
	    // protected _typed_und_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
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
	    /**
	     * Version 1: do it in-place (to the object you receive)
	     * Version 2: clone the graph first, return the mutated clone
	     */
	    BaseGraph.prototype.toDirectedGraph = function (copy) {
	        if (copy === void 0) { copy = false; }
	        var result_graph = copy ? this.clone() : this;
	        // if graph has no edges, we want to throw an exception
	        if (this._nr_dir_edges === 0 && this._nr_und_edges === 0) {
	            throw new Error("Cowardly refusing to re-interpret an empty graph.");
	        }
	        return result_graph;
	    };
	    BaseGraph.prototype.toUndirectedGraph = function () {
	        return this;
	    };
	    /**
	     * what to do if some edges are not weighted at all?
	     * Since graph traversal algortihms (and later maybe graphs themselves)
	     * use default weights anyways, I am simply ignoring them for now...
	     * @todo figure out how to test this...
	     */
	    BaseGraph.prototype.hasNegativeEdge = function () {
	        var has_neg_edge = false, edge;
	        // negative und_edges are always negative cycles
	        //reminder: a return statement breaks out of the for loop and finishes the function
	        for (var edge_id in this._und_edges) {
	            edge = this._und_edges[edge_id];
	            if (!edge.isWeighted()) {
	                continue;
	            }
	            if (edge.getWeight() < 0) {
	                return true;
	            }
	        }
	        for (var edge_id in this._dir_edges) {
	            edge = this._dir_edges[edge_id];
	            if (!edge.isWeighted()) {
	                continue;
	            }
	            if (edge.getWeight() < 0) {
	                has_neg_edge = true;
	                break;
	            }
	        }
	        return has_neg_edge;
	    };
	    /**
	     * Do we want to throw an error if an edge is unweighted?
	     * Or shall we let the traversal algorithm deal with DEFAULT weights like now?
	     */
	    BaseGraph.prototype.hasNegativeCycles = function (node) {
	        var _this = this;
	        if (!this.hasNegativeEdge()) {
	            return false;
	        }
	        var negative_cycle = false, start = node ? node : this.getRandomNode();
	        /**
	         * Now do Bellman Ford over all graph components
	         */
	        $DFS.DFS(this, start).forEach(function (comp) {
	            var min_count = Number.POSITIVE_INFINITY, comp_start_node;
	            Object.keys(comp).forEach(function (node_id) {
	                if (min_count > comp[node_id].counter) {
	                    min_count = comp[node_id].counter;
	                    comp_start_node = node_id;
	                }
	            });
	            if (BellmanFord_1.BellmanFordArray(_this, _this._nodes[comp_start_node]).neg_cycle) {
	                negative_cycle = true;
	            }
	        });
	        return negative_cycle;
	    };
	    /**
	     *
	     * @param incoming
	     */
	    BaseGraph.prototype.nextArray = function (incoming) {
	        if (incoming === void 0) { incoming = false; }
	        var next = [], node_keys = Object.keys(this._nodes);
	        //?? - but AdjDict contains distance value only for the directly reachable neighbors for each node, not all!	
	        //I do not understand but it works so it should be okay	
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
	    /**
	     * This function iterates over the adjDict in order to use it's advantage
	     * of being able to override edges if edges with smaller weights exist
	     *
	     * However, the order of nodes in the array represents the order of nodes
	     * at creation time, no other implicit alphabetical or collational sorting.
	     *
	     * This has to be considered when further processing the result
	     *
	     * @param incoming whether or not to consider incoming edges as well
	     * @param include_self contains a distance to itself apart?
	     * @param self_dist default distance to self
	     */
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
	    /**
	     *
	     * @param incoming whether or not to consider incoming edges as well
	     * @param include_self contains a distance to itself apart?
	     * @param self_dist default distance to self
	     */
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
	                    if (incoming) { // we need to update the 'inverse' entry as well
	                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
	                    }
	                }
	                else {
	                    adj_list_dict[key][ne.node.getID()] = cur_dist;
	                    if (incoming) { // we need to update the 'inverse' entry as well
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
	    BaseGraph.prototype.nrNodes = function () {
	        return this._nr_nodes;
	    };
	    BaseGraph.prototype.nrDirEdges = function () {
	        return this._nr_dir_edges;
	    };
	    BaseGraph.prototype.nrUndEdges = function () {
	        return this._nr_und_edges;
	    };
	    /**
	     *
	     * @param id
	     * @param opts
	     *
	     * @todo addNode functions should check if a node with a given ID already exists -> node IDs have to be unique...
	     */
	    BaseGraph.prototype.addNodeByID = function (id, opts) {
	        if (this.hasNodeID(id)) {
	            throw new Error("Won't add node with duplicate ID.");
	        }
	        var node = new $N.BaseNode(id, opts);
	        return this.addNode(node) ? node : null;
	    };
	    BaseGraph.prototype.addNode = function (node) {
	        if (this.hasNodeID(node.getID())) {
	            throw new Error("Won't add node with duplicate ID.");
	        }
	        this._nodes[node.getID()] = node;
	        this._nr_nodes += 1;
	        return true;
	    };
	    /**
	     * Instantiates a new node object, copies the features and
	     * adds the node to the graph, but does NOT clone it's edges
	     * @param node the node object to clone
	     */
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
	    /**
	     * CAUTION - This function takes linear time in # nodes
	     */
	    BaseGraph.prototype.getRandomNode = function () {
	        return this.pickRandomProperty(this._nodes);
	    };
	    BaseGraph.prototype.deleteNode = function (node) {
	        var rem_node = this._nodes[node.getID()];
	        if (!rem_node) {
	            throw new Error('Cannot remove un-added node.');
	        }
	        // Edges?
	        var in_deg = node.inDegree();
	        var out_deg = node.outDegree();
	        var deg = node.degree();
	        // Delete all edges brutally...
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
	    // get the edge from node_a to node_b (or undirected)
	    BaseGraph.prototype.getDirEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        var node_b = this.getNodeById(node_b_id);
	        this.checkExistanceOfEdgeNodes(node_a, node_b);
	        // check for outgoing directed edges
	        var edges_dir = node_a.outEdges(), edges_dir_keys = Object.keys(edges_dir);
	        for (var i = 0; i < edges_dir_keys.length; i++) {
	            var edge = edges_dir[edges_dir_keys[i]];
	            if (edge.getNodes().b.getID() == node_b_id) {
	                return edge;
	            }
	        }
	        // if we managed to arrive here, there is no edge!
	        throw new Error("Cannot find edge. There is no edge between Node " + node_a_id + " and " + node_b_id + ".");
	    };
	    BaseGraph.prototype.getUndEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        var node_b = this.getNodeById(node_b_id);
	        this.checkExistanceOfEdgeNodes(node_a, node_b);
	        // check for undirected edges
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
	    /**
	     * Now all test cases pertaining addEdge() call this one...
	     */
	    BaseGraph.prototype.addEdgeByID = function (id, node_a, node_b, opts) {
	        var edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
	        return this.addEdge(edge);
	    };
	    /**
	     * Test cases should be reversed / completed
	     */
	    BaseGraph.prototype.addEdge = function (edge) {
	        var node_a = edge.getNodes().a, node_b = edge.getNodes().b;
	        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())
	            || this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b) {
	            throw new Error("can only add edge between two nodes existing in graph");
	        }
	        // connect edge to first node anyways
	        node_a.addEdge(edge);
	        if (edge.isDirected()) {
	            // add edge to second node too
	            node_b.addEdge(edge);
	            this._dir_edges[edge.getID()] = edge;
	            this._nr_dir_edges += 1;
	            this.updateGraphMode();
	        }
	        else {
	            // add edge to both nodes, except they are the same...
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
	    // Some atomicity / rollback feature would be nice here...
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
	    // Some atomicity / rollback feature would be nice here...
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
	    // Some atomicity / rollback feature would be nice here...
	    BaseGraph.prototype.deleteDirEdgesOf = function (node) {
	        this.deleteInEdgesOf(node);
	        this.deleteOutEdgesOf(node);
	    };
	    // Some atomicity / rollback feature would be nice here...
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
	    // Some atomicity / rollback feature would be nice here...
	    BaseGraph.prototype.deleteAllEdgesOf = function (node) {
	        this.deleteDirEdgesOf(node);
	        this.deleteUndEdgesOf(node);
	    };
	    /**
	     * Remove all the (un)directed edges in the graph
	     */
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
	    /**
	     * CAUTION - This function is linear in # directed edges
	     */
	    BaseGraph.prototype.getRandomDirEdge = function () {
	        return this.pickRandomProperty(this._dir_edges);
	    };
	    /**
	     * CAUTION - This function is linear in # undirected edges
	     */
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
	            else { //This means we only add cutoff -1 nodes to the cloned graph, # of nodes is then equal to cutoff
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
	    /**
	     * In some cases we need to give back a large number of objects
	     * in one swoop, as calls to Object.keys() are really slow
	     * for large input objects.
	     *
	     * In order to do this, we only extract the keys once and then
	     * iterate over the key list and add them to a result array
	     * with probability = amount / keys.length
	     *
	     * We also mark all used keys in case we haven't picked up
	     * enough entities for the result array after the first round.
	     * We then just fill up the rest of the result array linearly
	     * with as many unused keys as necessary
	     *
	     *
	     * @todo include generic Test Cases
	     * @todo check if amount is larger than propList size
	     * @todo This seems like a simple hack - filling up remaining objects
	     * Could be replaced by a better fraction-increasing function above...
	     *
	     * @param propList
	     * @param fraction
	     * @returns {Array}
	     */
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
	Object.defineProperty(exports, "__esModule", { value: true });
	var run_config_1 = __webpack_require__(6);
	var Logger = /** @class */ (function () {
	    function Logger(config) {
	        this.config = null;
	        this.config = config || run_config_1.RUN_CONFIG;
	    }
	    Logger.prototype.log = function (msg) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.log.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.error = function (err) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.error.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.dir = function (obj) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.dir.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.info = function (msg) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.info.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.warn = function (msg) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
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
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var LOG_LEVELS = {
	    debug: "debug",
	    production: "production"
	};
	exports.LOG_LEVELS = LOG_LEVELS;
	var RUN_CONFIG = {
	    log_level: process.env['G_LOG'] // LOG_LEVELS.debug
	};
	exports.RUN_CONFIG = RUN_CONFIG;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(9);
	/**
	 * Breadth first search - usually performed to see
	 * reachability etc. Therefore we do not want 'segments'
	 * or 'components' of our graph, but simply one well
	 * defined result segment covering the whole graph.
	 *
	 * @param graph the graph to perform BFS on
	 * @param v the vertex to use as a start vertex
	 * @param config an optional config object, will be
	 * automatically instantiated if not passed by caller
	 * @returns {{}}
	 * @constructor
	 */
	function BFS(graph, v, config) {
	    var config = config || prepareBFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    /**
	     * We are not traversing an empty graph...
	     */
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    /**
	     * We are not traversing a graph taking NO edges into account
	     */
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    // scope to pass to callbacks at different stages of execution
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
	    /**
	       * HOOK 1: BFS INIT
	       */
	    if (callbacks.init_bfs) {
	        $CB.execCallbacks(callbacks.init_bfs, bfsScope);
	    }
	    bfsScope.queue.push(v);
	    var i = 0;
	    while (i < bfsScope.queue.length) {
	        bfsScope.current = bfsScope.queue[i++];
	        /**
	         * Do we move only in the directed subgraph,
	         * undirected subgraph or complete (mixed) graph?
	         */
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
	        /**
	         * HOOK 2 - Sort adjacent nodes
	         */
	        if (typeof callbacks.sort_nodes === 'function') {
	            callbacks.sort_nodes(bfsScope);
	        }
	        for (var adj_idx in bfsScope.adj_nodes) {
	            bfsScope.next_node = bfsScope.adj_nodes[adj_idx].node;
	            bfsScope.next_edge = bfsScope.adj_nodes[adj_idx].edge;
	            /**
	             * HOOK 3 - Node unmarked
	             */
	            if (config.result[bfsScope.next_node.getID()].distance === Number.POSITIVE_INFINITY) {
	                if (callbacks.node_unmarked) {
	                    $CB.execCallbacks(callbacks.node_unmarked, bfsScope);
	                }
	            }
	            else {
	                /**
	                 * HOOK 4 - Node marked
	                 */
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
	    // Standard INIT callback
	    var initBFS = function (context) {
	        // initialize all nodes to infinite distance
	        for (var key in context.nodes) {
	            config.result[key] = {
	                distance: Number.POSITIVE_INFINITY,
	                parent: null,
	                counter: -1
	            };
	        }
	        // initialize root node entry
	        config.result[context.root_node.getID()] = {
	            distance: 0,
	            parent: context.root_node,
	            counter: counter()
	        };
	    };
	    callbacks.init_bfs.push(initBFS);
	    // Standard Node unmarked callback
	    // have to populate respective result entry
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
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @param context this pointer to the DFS or DFSVisit function
	 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(9);
	/**
	 * DFS Visit - one run to see what nodes are reachable
	 * from a given "current" root node
	 *
	 * @param graph
	 * @param current_root
	 * @param config
	 * @returns {{}}
	 * @constructor
	 */
	function DFSVisit(graph, current_root, config) {
	    // scope to pass to callbacks at different stages of execution
	    var dfsVisitScope = {
	        stack: [],
	        adj_nodes: [],
	        stack_entry: null,
	        current: null,
	        current_root: current_root
	    };
	    var config = config || prepareDFSVisitStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    /**
	     * We are not traversing an empty graph...
	     */
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    /**
	       * We are not traversing a graph taking NO edges into account
	       */
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    /**
	     * HOOK 1 - INIT (INNER DFS VISIT):
	     * Initializing a possible result object,
	     * possibly with the current_root;
	     */
	    if (callbacks.init_dfs_visit) {
	        $CB.execCallbacks(callbacks.init_dfs_visit, dfsVisitScope);
	    }
	    // Start by pushing current root to the stack
	    dfsVisitScope.stack.push({
	        node: current_root,
	        parent: current_root,
	        weight: 0 // initial weight cost from current_root
	    });
	    while (dfsVisitScope.stack.length) {
	        dfsVisitScope.stack_entry = dfsVisitScope.stack.pop();
	        dfsVisitScope.current = dfsVisitScope.stack_entry.node;
	        /**
	         * HOOK 2 - AQUIRED CURRENT NODE / POPPED NODE
	         */
	        if (callbacks.node_popped) {
	            $CB.execCallbacks(callbacks.node_popped, dfsVisitScope);
	        }
	        if (!config.dfs_visit_marked[dfsVisitScope.current.getID()]) {
	            config.dfs_visit_marked[dfsVisitScope.current.getID()] = true;
	            /**
	             * HOOK 3 - CURRENT NODE UNMARKED
	             */
	            if (callbacks.node_unmarked) {
	                $CB.execCallbacks(callbacks.node_unmarked, dfsVisitScope);
	            }
	            /**
	             * Do we move only in the directed subgraph,
	             * undirected subgraph or complete (mixed) graph?
	             */
	            if (dir_mode === $G.GraphMode.MIXED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.reachNodes();
	            }
	            else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.connNodes();
	            }
	            else if (dir_mode === $G.GraphMode.DIRECTED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.nextNodes();
	            }
	            /**
	             * HOOK 4 - SORT ADJACENT NODES
	             */
	            if (typeof callbacks.sort_nodes === 'function') {
	                callbacks.sort_nodes(dfsVisitScope);
	            }
	            for (var adj_idx in dfsVisitScope.adj_nodes) {
	                /**
	                 * HOOK 5 - NODE OR EDGE TYPE CHECK...
	                 * LATER !!
	                 */
	                if (callbacks) {
	                }
	                dfsVisitScope.stack.push({
	                    node: dfsVisitScope.adj_nodes[adj_idx].node,
	                    parent: dfsVisitScope.current,
	                    weight: dfsVisitScope.adj_nodes[adj_idx].edge.getWeight()
	                });
	            }
	            /**
	             * HOOK 6 - ADJACENT NODES PUSHED - LEAVING CURRENT NODE
	             */
	            if (callbacks.adj_nodes_pushed) {
	                $CB.execCallbacks(callbacks.adj_nodes_pushed, dfsVisitScope);
	            }
	        }
	        else {
	            /**
	             * HOOK 7 - CURRENT NODE ALREADY MARKED
	             */
	            if (callbacks.node_marked) {
	                $CB.execCallbacks(callbacks.node_marked, dfsVisitScope);
	            }
	        }
	    }
	    return config.visit_result;
	}
	exports.DFSVisit = DFSVisit;
	/**
	 * Depth first search - used for reachability / exploration
	 * of graph structure and as a basis for topological sorting
	 * and component / community analysis.
	 * Because DFS can be used as a basis for many other algorithms,
	 * we want to keep the result as generic as possible to be
	 * populated by the caller rather than the core DFS algorithm.
	 *
	 * @param graph
	 * @param root
	 * @param config
	 * @returns {{}[]}
	 * @constructor
	 */
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
	    /**
	     * HOOK 1 - INIT (OUTER DFS)
	     */
	    if (callbacks.init_dfs) {
	        $CB.execCallbacks(callbacks.init_dfs, dfsScope);
	    }
	    callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
	    var markNode = function (context) {
	        dfsScope.marked[context.current.getID()] = true;
	    };
	    callbacks.adj_nodes_pushed.push(markNode);
	    // We need to put our results into segments
	    // for easy counting of 'components'
	    // TODO refactor for count & counter...
	    var dfs_result = [{}];
	    var dfs_idx = 0;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    /**
	     * We not only add new nodes to the result object
	     * of DFSVisit, but also to it's appropriate
	     * segment of the dfs_result object
	     */
	    var addToProperSegment = function (context) {
	        dfs_result[dfs_idx][context.current.getID()] = {
	            parent: context.stack_entry.parent,
	            counter: counter()
	        };
	    };
	    // check if a callbacks object has been instantiated
	    if (callbacks && callbacks.node_unmarked) {
	        callbacks.node_unmarked.push(addToProperSegment);
	    }
	    // Start with root node, no matter what
	    DFSVisit(graph, root, config);
	    // Now take the rest in 'normal' order
	    for (var node_key in dfsScope.nodes) {
	        if (!dfsScope.marked[node_key]) {
	            // Next segment in dfs_results
	            dfs_idx++;
	            dfs_result.push({});
	            // Explore and fill next subsegment
	            DFSVisit(graph, dfsScope.nodes[node_key], config);
	        }
	    }
	    // console.dir(config.visit_result);
	    return dfs_result;
	}
	exports.DFS = DFS;
	/**
	 * This is the only place in which a config object
	 * is instantiated (except manually, of course)
	 *
	 * Therefore, we do not take any arguments
	 */
	function prepareDFSVisitStandardConfig() {
	    var config = {
	        visit_result: {},
	        callbacks: {},
	        messages: {},
	        dfs_visit_marked: {},
	        dir_mode: $G.GraphMode.MIXED
	    }, result = config.visit_result, callbacks = config.callbacks;
	    // internal variable for order of visit
	    // during DFS Visit                      
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
	/**
	 * First instantiates config file for DFSVisit, then
	 * enhances it with outer DFS init callback
	 */
	function prepareDFSStandardConfig() {
	    // First prepare DFS Visit callbacks
	    var config = prepareDFSVisitStandardConfig(), callbacks = config.callbacks, result = config.visit_result;
	    // Now add outer DFS INIT callback
	    callbacks.init_dfs = callbacks.init_dfs || [];
	    var setInitialResultEntries = function (context) {
	        // for ( var node_id in context.nodes ) {
	        // 	result[node_id] = {
	        // 		parent: null,
	        // 		counter: -1
	        // 	}
	        // }
	    };
	    callbacks.init_dfs.push(setInitialResultEntries);
	    return config;
	}
	exports.prepareDFSStandardConfig = prepareDFSStandardConfig;
	;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var PFS_1 = __webpack_require__(12);
	/**
	 *
	 * @param graph
	 * @param start
	 */
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
	function BellmanFordArray(graph, start) {
	    BFSanityChecks(graph, start);
	    var distances = [], nodes = graph.getNodes(), edge, node_keys = Object.keys(nodes), node, id_idx_map = {}, bf_edge_entry, new_weight, neg_cycle = false;
	    for (var n_idx = 0; n_idx < node_keys.length; ++n_idx) {
	        node = nodes[node_keys[n_idx]];
	        distances[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
	        id_idx_map[node.getID()] = n_idx;
	    }
	    // Initialize an edge array just holding the node indices, weight and directed
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
	    for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
	        edge = bf_edges[e_idx];
	        if (betterDist(edge[0], edge[1], edge[2]) || (!edge[3] && betterDist(edge[1], edge[0], edge[2]))) {
	            neg_cycle = true;
	            break;
	        }
	    }
	    function updateDist(u, v, weight) {
	        new_weight = distances[u] + weight;
	        if (distances[v] > new_weight) {
	            distances[v] = new_weight;
	        }
	    }
	    function betterDist(u, v, weight) {
	        return (distances[v] > distances[u] + weight);
	    }
	    return { distances: distances, neg_cycle: neg_cycle };
	}
	exports.BellmanFordArray = BellmanFordArray;
	/**
	 *
	 * @param graph
	 * @param start
	 */
	function BellmanFordDict(graph, start) {
	    BFSanityChecks(graph, start);
	    var distances = {}, edges, edge, a, b, weight, new_weight, nodes_size, neg_cycle = false;
	    distances = {}; // Reset dists, TODO refactor
	    edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
	    nodes_size = graph.nrNodes();
	    for (var node in graph.getNodes()) {
	        distances[node] = Number.POSITIVE_INFINITY;
	    }
	    distances[start.getID()] = 0;
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
	    for (var edgeID in edges) {
	        edge = edges[edgeID];
	        a = edge.getNodes().a.getID();
	        b = edge.getNodes().b.getID();
	        weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
	        if (betterDist(a, b, weight) || (!edge.isDirected() && betterDist(b, a, weight))) {
	            neg_cycle = true;
	        }
	    }
	    function updateDist(u, v, weight) {
	        new_weight = distances[u] + weight;
	        if (distances[v] > new_weight) {
	            distances[v] = new_weight;
	        }
	    }
	    function betterDist(u, v, weight) {
	        return (distances[v] > distances[u] + weight);
	    }
	    return { distances: distances, neg_cycle: neg_cycle };
	}
	exports.BellmanFordDict = BellmanFordDict;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $E = __webpack_require__(1);
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(9);
	var $BH = __webpack_require__(13);
	exports.DEFAULT_WEIGHT = 1;
	/**
	 * Priority first search
	 *
	 * Like BFS, we are not necessarily visiting the
	 * whole graph, but only what's reachable from
	 * a given start node.
	 *
	 * @param graph the graph to perform PFS only
	 * @param v the node from which to start PFS
	 * @config a config object similar to that used
	 * in BFS, automatically instantiated if not given..
	 */
	function PFS(graph, v, config) {
	    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode, evalPriority = config.evalPriority, evalObjID = config.evalObjID;
	    /**
	       * We are not traversing an empty graph...
	       */
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    /**
	       * We are not traversing a graph taking NO edges into account
	       */
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    // We need to push NeighborEntries
	    // TODO: Virtual edge addition OK?
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
	        proposed_dist: Number.POSITIVE_INFINITY,
	    };
	    /**
	       * HOOK 1: PFS INIT
	       */
	    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
	    //initializes the result entry, gives the start node the final values, and default values for all others
	    scope.OPEN_HEAP.insert(start_ne);
	    scope.OPEN[start_ne.node.getID()] = start_ne;
	    /**
	     * Main loop
	     */
	    while (scope.OPEN_HEAP.size()) {
	        // console.log(scope.OPEN_HEAP); //LOG!
	        // get currently best node
	        //pop returns the first element of the OPEN_HEAP, which is the node with the smallest distance
	        //it removes it from the heap, too - no extra removal needed
	        // process.stdout.write(`heap array: [`);
	        // scope.OPEN_HEAP.getArray().forEach( ne => {
	        //   process.stdout.write( ne.node.getID() + ", " );
	        // });
	        // console.log(']');
	        // console.log(`heap positions: \n`)
	        // console.log(scope.OPEN_HEAP.getPositions());
	        scope.current = scope.OPEN_HEAP.pop();
	        // console.log(`node: ${scope.current.node.getID()}`); //LOG!
	        // console.log(`best: ${scope.current.best}`); //LOG!
	        /**
	         * HOOK 2: NEW CURRENT
	         */
	        callbacks.new_current && $CB.execCallbacks(callbacks.new_current, scope);
	        if (scope.current == null) {
	            console.log("HEAP popped undefined - HEAP size: " + scope.OPEN_HEAP.size());
	        }
	        // remove from OPEN
	        scope.OPEN[scope.current.node.getID()] = undefined;
	        // add it to CLOSED
	        scope.CLOSED[scope.current.node.getID()] = scope.current;
	        // TODO what if we already reached the goal?
	        if (scope.current.node === config.goal_node) {
	            /**
	             * HOOK 3: Goal node reached
	             */
	            config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached, scope);
	            // If a goal node is set from the outside & we reach it, we stop.
	            return config.result;
	        }
	        /**
	         * Extend the current node, also called
	         * "create n's successors"...
	             */
	        // TODO: Reverse callback logic to NOT merge anything by default!!!
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
	        /**
	         * EXPAND AND EXAMINE NEIGHBORHOOD
	         */
	        for (var adj_idx in scope.adj_nodes) {
	            scope.next = scope.adj_nodes[adj_idx];
	            // console.log("scopeNext now:"); //LOG!
	            // console.log(scope.next.node.getID());
	            if (scope.CLOSED[scope.next.node.getID()]) {
	                /**
	                 * HOOK 4: Goal node already closed
	                 */
	                config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
	                continue;
	            }
	            if (scope.OPEN[scope.next.node.getID()]) {
	                // First let's recover the previous best solution from our OPEN structure,
	                // as the node's neighborhood-retrieving function cannot know it...
	                // console.log("MARKER - ALREADY OPEN"); //LOG!
	                scope.next.best = scope.OPEN[scope.next.node.getID()].best;
	                /**
	                 * HOOK 5: Goal node already visited, but not yet closed
	                 */
	                config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);
	                scope.proposed_dist = scope.current.best + (isNaN(scope.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : scope.next.edge.getWeight());
	                /**
	                 * HOOK 6: Better path found
	                 */
	                if (scope.next.best > scope.proposed_dist) {
	                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
	                    // HEAP operations are necessary for internal traversal,
	                    // so we handle them here in the main loop
	                    //removing thext with the old value and adding it again with updated value
	                    scope.OPEN_HEAP.remove(scope.next);
	                    // console.log("MARKER - BETTER DISTANCE");
	                    // console.log(scope.OPEN_HEAP);
	                    scope.next.best = scope.proposed_dist;
	                    scope.OPEN_HEAP.insert(scope.next);
	                    scope.OPEN[scope.next.node.getID()].best = scope.proposed_dist;
	                }
	                /**
	                 * HOOK 7: Equal path found (same weight)
	                 */
	                //at the moment, this callback array is empty here in the PFS and in the Dijkstra, but used in the Johnsons
	                else if (scope.next.best === scope.proposed_dist) {
	                    config.callbacks.equal_path && $CB.execCallbacks(config.callbacks.equal_path, scope);
	                }
	                continue;
	            }
	            // NODE NOT ENCOUNTERED
	            config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);
	            // HEAP operations are necessary for internal traversal,
	            // so we handle them here in the main loop
	            scope.OPEN_HEAP.insert(scope.next);
	            scope.OPEN[scope.next.node.getID()] = scope.next;
	            // console.log("MARKER-NOT ENCOUNTERED"); //LOG!
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
	            new_current: [],
	            not_encountered: [],
	            node_open: [],
	            node_closed: [],
	            better_path: [],
	            equal_path: [],
	            goal_reached: []
	        },
	        messages: {
	            init_pfs_msgs: [],
	            new_current_msgs: [],
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
	    // Standard INIT callback
	    var initPFS = function (context) {
	        // initialize all nodes to infinite distance
	        for (var key in context.nodes) {
	            config.result[key] = {
	                distance: Number.POSITIVE_INFINITY,
	                parent: null,
	                counter: -1
	            };
	        }
	        // initialize root node entry
	        // maybe take heuristic into account right here...??
	        config.result[context.root_node.getID()] = {
	            distance: 0,
	            parent: context.root_node,
	            counter: counter()
	        };
	    };
	    callbacks.init_pfs.push(initPFS);
	    // Node not yet encountered callback
	    var notEncountered = function (context) {
	        // setting it's best score to actual distance + edge weight
	        // and update result structure
	        context.next.best = context.current.best + (isNaN(context.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : context.next.edge.getWeight());
	        config.result[context.next.node.getID()] = {
	            distance: context.next.best,
	            parent: context.current.node,
	            counter: undefined
	        };
	    };
	    callbacks.not_encountered.push(notEncountered);
	    // Callback for when we find a better solution
	    var betterPathFound = function (context) {
	        config.result[context.next.node.getID()].distance = context.proposed_dist;
	        config.result[context.next.node.getID()].parent = context.current.node;
	    };
	    callbacks.better_path.push(betterPathFound);
	    return config;
	}
	exports.preparePFSStandardConfig = preparePFSStandardConfig;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var BinaryHeapMode;
	(function (BinaryHeapMode) {
	    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
	    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
	})(BinaryHeapMode = exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
	/**
	 * We only support unique object ID's for now !!!
	 * @TODO Rename into "ObjectBinaryHeap" or such...
	 */
	var BinaryHeap = /** @class */ (function () {
	    /**
	     * Mode of a min heap should only be set upon
	     * instantiation and never again afterwards...
	     * @param _mode MIN or MAX heap
	     * @param _evalObjID function to determine an object's identity
	     * @param _evalPriority function to determine an objects score
	     */
	    function BinaryHeap(_mode, _evalPriority, _evalObjID) {
	        if (_mode === void 0) { _mode = BinaryHeapMode.MIN; }
	        if (_evalPriority === void 0) { _evalPriority = function (obj) {
	            if (typeof obj !== 'number' && typeof obj !== 'string') {
	                return NaN;
	            }
	            if (typeof obj === 'number') {
	                return obj | 0;
	            }
	            return parseInt(obj);
	        }; }
	        if (_evalObjID === void 0) { _evalObjID = function (obj) {
	            return obj;
	        }; }
	        this._mode = _mode;
	        this._evalPriority = _evalPriority;
	        this._evalObjID = _evalObjID;
	        this._nr_removes = 0; // just for debugging
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
	    BinaryHeap.prototype.evalInputScore = function (obj) {
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
	    /**
	     * Insert - Adding an object to the heap
	     * @param obj the obj to add to the heap
	     * @returns {number} the objects index in the internal array
	     */
	    BinaryHeap.prototype.insert = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error("Cannot insert object without numeric priority.");
	        }
	        /**
	         * @todo if we keep the unique ID stuff, check for it here and throw an Error if needed...
	         */
	        this._array.push(obj);
	        this.setNodePosition(obj, this.size() - 1);
	        this.trickleUp(this.size() - 1);
	    };
	    BinaryHeap.prototype.remove = function (obj) {
	        this._nr_removes++;
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error('Object invalid.');
	        }
	        var objID = this._evalObjID(obj), found = null;
	        /**
	         * Search in O(1)
	         */
	        var pos = this.getNodePosition(obj), found = this._array[pos] != null ? this._array[pos] : null;
	        /**
	         * Search in O(n)
	         */
	        // for (var pos = 0; pos < this._array.length; ++pos) {
	        //   if (this._evalObjID(this._array[pos]) === objID) {
	        //     found = this._array[pos];
	        //     break;
	        //   }
	        // }
	        if (found === null) {
	            return undefined;
	        }
	        var last_array_obj = this._array.pop();
	        this.removeNodePosition(obj);
	        if (this.size() && found !== last_array_obj) {
	            this._array[pos] = last_array_obj;
	            this.setNodePosition(last_array_obj, pos);
	            this.trickleUp(pos);
	            this.trickleDown(pos);
	        }
	        return found;
	    };
	    BinaryHeap.prototype.trickleDown = function (i) {
	        var parent = this._array[i];
	        while (true) {
	            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
	            // check if left child exists && is larger than parent
	            if (left_child_idx < this.size() && !this.orderCorrect(parent, left_child)) {
	                swap = left_child_idx;
	            }
	            // check if right child exists && is larger than parent
	            if (right_child_idx < this.size() && !this.orderCorrect(parent, right_child)
	                && !this.orderCorrect(left_child, right_child)) {
	                swap = right_child_idx;
	            }
	            if (swap === null) {
	                break;
	            }
	            // we only have to swap one child, doesn't matter which one
	            this._array[i] = this._array[swap];
	            this._array[swap] = parent;
	            // console.log(`Trickle down: swapping ${this._array[i]} and ${this._array[swap]}`);
	            this.setNodePosition(this._array[i], i);
	            this.setNodePosition(this._array[swap], swap);
	            i = swap;
	        }
	    };
	    BinaryHeap.prototype.trickleUp = function (i) {
	        var child = this._array[i];
	        // Can only trickle up from positive levels
	        while (i) {
	            var parent_idx = Math.floor((i + 1) / 2) - 1, parent = this._array[parent_idx];
	            if (this.orderCorrect(parent, child)) {
	                break;
	            }
	            else {
	                this._array[parent_idx] = child;
	                this._array[i] = parent;
	                // console.log(`Trickle up: swapping ${child} and ${parent}`);
	                this.setNodePosition(child, parent_idx);
	                this.setNodePosition(parent, i);
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
	    /**
	     * Superstructure to enable search in BinHeap in O(1)
	     * @param obj
	     * @param pos
	     */
	    BinaryHeap.prototype.setNodePosition = function (obj, pos) {
	        if (obj == null || pos == null || pos !== (pos | 0)) {
	            throw new Error('minium required arguments are obj and new_pos');
	        }
	        var pos_obj = {
	            score: this.evalInputScore(obj),
	            position: pos
	        };
	        var obj_key = this.evalInputObjID(obj);
	        this._positions[obj_key] = pos_obj;
	    };
	    /**
	     *
	     */
	    BinaryHeap.prototype.getNodePosition = function (obj) {
	        var obj_key = this.evalInputObjID(obj);
	        // console.log(obj_key);
	        var occurrence = this._positions[obj_key];
	        // console.log(occurrence);
	        return occurrence ? occurrence.position : null;
	    };
	    /**
	     * @param obj
	     * @returns {number}
	     */
	    BinaryHeap.prototype.removeNodePosition = function (obj) {
	        var obj_key = this.evalInputObjID(obj);
	        delete this._positions[obj_key];
	    };
	    return BinaryHeap;
	}());
	exports.BinaryHeap = BinaryHeap;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var path = __webpack_require__(15);
	var fs = __webpack_require__(16);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(17);
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
	var DEFAULT_WEIGHT = 1;
	var CSV_EXTENSION = ".csv";
	var CSVInput = /** @class */ (function () {
	    function CSVInput(_separator, _explicit_direction, _direction_mode, _weighted) {
	        if (_separator === void 0) { _separator = ','; }
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction_mode === void 0) { _direction_mode = false; }
	        if (_weighted === void 0) { _weighted = false; }
	        this._separator = _separator;
	        this._explicit_direction = _explicit_direction;
	        this._direction_mode = _direction_mode;
	        this._weighted = _weighted;
	    }
	    CSVInput.prototype.readFromAdjacencyListURL = function (config, cb) {
	        this.readGraphFromURL(config, cb, this.readFromAdjacencyList);
	    };
	    CSVInput.prototype.readFromEdgeListURL = function (config, cb) {
	        this.readGraphFromURL(config, cb, this.readFromEdgeList);
	    };
	    CSVInput.prototype.readGraphFromURL = function (config, cb, localFun) {
	        var self = this, graph_name = config.file_name, graph, request;
	        // Node or browser ??
	        if (typeof window !== 'undefined') {
	            var fileurl = config.remote_host + config.remote_path + config.file_name + CSV_EXTENSION;
	            logger.log("Requesting file via XMLHTTPRequest: " + fileurl);
	            // Browser...
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
	            // Node.js
	            $R.retrieveRemoteFile(config, function (raw_graph) {
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
	                // end of file or empty line, just treat like an empty line...
	                continue;
	            }
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            for (var e = 0; e < edge_array.length;) {
	                if (this._explicit_direction && (!edge_array || edge_array.length % 2)) {
	                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
	                }
	                target_node_id = edge_array[e++];
	                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	                /**
	                 * The direction determines if we have to check for the existence
	                 * of an edge in 'both' directions or only from one node to the other
	                 * Within the CSV module this check is done simply via ID check,
	                 * as we are following a rigorous naming scheme anyways...
	                 */
	                dir_char = this._explicit_direction ? edge_array[e++] : this._direction_mode ? 'd' : 'u';
	                if (dir_char !== 'd' && dir_char !== 'u') {
	                    throw new Error("Specification of edge direction invalid (d and u are valid).");
	                }
	                directed = dir_char === 'd';
	                edge_id = node_id + "_" + target_node_id + "_" + dir_char;
	                edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    // The completely same edge should only be added once...
	                    continue;
	                }
	                else {
	                    edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
	                }
	            }
	        }
	        return graph;
	    };
	    CSVInput.prototype.readFromEdgeList = function (input, graph_name, weighted) {
	        if (weighted === void 0) { weighted = false; }
	        var graph = new $G.BaseGraph(graph_name);
	        for (var idx in input) {
	            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator);
	            if (!elements) {
	                // end of file or empty line, just treat like an empty line...
	                continue;
	            }
	            if (elements.length < 2 || elements.length > 3) {
	                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
	            }
	            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2, parse_weight, edge_weight;
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	            if (dir_char !== 'd' && dir_char !== 'u') {
	                throw new Error("Specification of edge direction invalid (d and u are valid).");
	            }
	            directed = dir_char === 'd';
	            edge_id = node_id + "_" + target_node_id + "_" + dir_char;
	            edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	            parse_weight = parseFloat(elements[2]);
	            edge_weight = this._weighted ? (isNaN(parse_weight) ? DEFAULT_WEIGHT : parse_weight) : null;
	            if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                // The completely same edge should only be added once...
	                continue;
	            }
	            else if (this._weighted) {
	                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed, weighted: true, weight: edge_weight });
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
/* 15 */
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var https = __webpack_require__(18);
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
	var SSL_PORT = '443';
	/**
	 * @TODO: Test it !!!
	 *
	 * @param url
	 * @param cb
	 * @returns {ClientRequest}
	 */
	function retrieveRemoteFile(config, cb) {
	    if (typeof cb !== 'function') {
	        throw new Error('Provided callback is not a function.');
	    }
	    logger.log("Requesting file via NodeJS request: " + config.remote_host + config.remote_path + config.file_name);
	    var options = {
	        host: config.remote_host,
	        port: SSL_PORT,
	        path: config.remote_path + config.file_name,
	        method: 'GET'
	    };
	    var req = https.get(options, function (response) {
	        // Continuously update stream with data
	        var body = '';
	        response.setEncoding('utf8');
	        response.on('data', function (d) {
	            body += d;
	        });
	        response.on('end', function () {
	            // Received data in body...
	            cb(body);
	        });
	    });
	    req.on('error', function (e) {
	        logger.log("Request error: " + e.message);
	    });
	    return req;
	}
	exports.retrieveRemoteFile = retrieveRemoteFile;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var http = __webpack_require__(16);

	var https = module.exports;

	for (var key in http) {
	    if (http.hasOwnProperty(key)) https[key] = http[key];
	};

	https.request = function (params, cb) {
	    if (!params) params = {};
	    params.scheme = 'https';
	    params.protocol = 'https:';
	    return http.request.call(this, params, cb);
	}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var fs = __webpack_require__(16);
	var CSVOutput = /** @class */ (function () {
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
	        // TODO make generic for graph mode
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
	        // var graphString = "";
	        // return graphString;
	    };
	    return CSVOutput;
	}());
	exports.CSVOutput = CSVOutput;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var fs = __webpack_require__(16);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(17);
	var DEFAULT_WEIGHT = 1;
	var JSON_EXTENSION = ".json";
	var JSONInput = /** @class */ (function () {
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
	        // TODO test for existing file...
	        var json = JSON.parse(fs.readFileSync(filepath).toString());
	        return this.readFromJSON(json);
	    };
	    JSONInput.prototype.readFromJSONURL = function (config, cb) {
	        var self = this, graph, request, json;
	        // Node or browser ??
	        if (typeof window !== 'undefined') {
	            // Browser...			
	            var fileurl = config.remote_host + config.remote_path + config.file_name + JSON_EXTENSION;
	            request = new XMLHttpRequest();
	            request.onreadystatechange = function () {
	                // console.log("Ready state: " + request.readyState);
	                // console.log("Reqst status: " + request.status);
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
	            // Node.js
	            $R.retrieveRemoteFile(config, function (raw_graph) {
	                graph = self.readFromJSON(JSON.parse(raw_graph));
	                cb(graph, undefined);
	            });
	        }
	    };
	    /**
	     * In this case, there is one great difference to the CSV edge list cases:
	     * If you don't explicitly define a directed edge, it will simply
	     * instantiate an undirected one
	     * we'll leave that for now, as we will produce apt JSON sources later anyways...
	     */
	    JSONInput.prototype.readFromJSON = function (json) {
	        var graph = new $G.BaseGraph(json.name), coords_json, coords, coord_idx, coord_val, features, feature;
	        for (var node_id in json.data) {
	            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            /**
	             * Reading and instantiating features
	             * We are using the shortcut setFeatures here,
	             * so we have to read them before any special features
	             */
	            if (features = json.data[node_id].features) {
	                // for ( feature in features ) {
	                // 	node.setFeature(feature, features[feature]);
	                // }
	                node.setFeatures(features);
	            }
	            /**
	             * Reading and instantiating coordinates
	             * Coordinates are treated as special features,
	             * and are therefore added after general features
	             */
	            if (coords_json = json.data[node_id].coords) {
	                coords = {};
	                for (coord_idx in coords_json) {
	                    coords[coord_idx] = +coords_json[coord_idx];
	                }
	                node.setFeature('coords', coords);
	            }
	            // Reading and instantiating edges
	            var edges = json.data[node_id].edges;
	            for (var e in edges) {
	                var edge_input = edges[e], target_node_id = edge_input.to, 
	                // Is there any direction information?            
	                directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', 
	                // Is there any weight information?,
	                weight_float = this.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    // The completely same edge should only be added once...
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
	    /**
	     * Infinity & -Infinity cases are redundant, as JavaScript
	     * handles them correctly anyways (for now)
	     * @param edge_input
	     */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var fs = __webpack_require__(16);
	var JSONOutput = /** @class */ (function () {
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
	        // Go through all nodes 
	        nodes = graph.getNodes();
	        for (var node_key in nodes) {
	            node = nodes[node_key];
	            node_struct = result.data[node.getID()] = {
	                edges: []
	            };
	            // UNdirected Edges
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
	            // Directed Edges
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
	            // Features
	            node_struct.features = node.getFeatures();
	            // Coords (shall we really?)
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $SU = __webpack_require__(3);
	/**
	 * Initializes the distance matrix from each node to all other node
	 * using the edges of the graph
	 *
	 * @param graph the graph for which to calculate the distances
	 * @returns m*m matrix of values
	 * @constructor
	 */
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
	/**
	 * Floyd-Warshall - we mostly use it to get In-betweenness
	 * of a graph. We use the standard algorithm and save all
	 * the shortest paths we find.
	 *
	 * @param graph the graph to perform Floyd-Warshall on
	 * @returns m*m matrix of values, m*m*m matrix of neighbors
	 * @constructor
	 */
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
	                if (k != i && k != j && i != j && dists[i][j] == (dists[i][k] + dists[k][j])) {
	                    //if a node is unreachable, the corresponding value in next should not be updated, but stay null
	                    if (dists[i][j] !== Number.POSITIVE_INFINITY) {
	                        next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
	                    }
	                }
	                if (k != i && k != j && i != j && dists[i][j] > dists[i][k] + dists[k][j]) {
	                    next[i][j] = next[i][k].slice(0);
	                    dists[i][j] = dists[i][k] + dists[k][j];
	                }
	            }
	        }
	    }
	    return [dists, next];
	}
	exports.FloydWarshallAPSP = FloydWarshallAPSP;
	/**
	 * Floyd-Warshall - we mostly use it for Closeness centrality.
	 * This is the array version, which means the returned matrix
	 * is not accessible with node IDs but rather with their indices.
	 * It also is faster than the dict version.
	 *
	 * @param graph the graph to perform Floyd-Warshall on
	 * @returns m*m matrix of values
	 * @constructor
	 */
	function FloydWarshallArray(graph) {
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error("Cowardly refusing to traverse graph without edges.");
	    }
	    var dists = graph.adjListArray();
	    var N = dists.length;
	    for (var k = 0; k < N; ++k) {
	        for (var i = 0; i < N; ++i) {
	            for (var j = 0; j < N; ++j) {
	                if (k != i && k != j && i != j && dists[i][j] > dists[i][k] + dists[k][j]) {
	                    dists[i][j] = dists[i][k] + dists[k][j];
	                }
	            }
	        }
	    }
	    return dists;
	}
	exports.FloydWarshallArray = FloydWarshallArray;
	/**
	 * Floyd-Warshall - we mostly use it for Closeness centrality.
	 * This is the dict version, which means the returned matrix
	 * is accessible with node IDs
	 *
	 * @param graph the graph to perform Floyd-Warshall on
	 * @returns m*m matrix of values
	 * @constructor
	 */
	function FloydWarshallDict(graph) {
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
	exports.FloydWarshallDict = FloydWarshallDict;
	function changeNextToDirectParents(input) {
	    var output = [];
	    for (var a = 0; a < input.length; a++) {
	        output.push([]);
	        for (var b = 0; b < input.length; b++) {
	            output[a].push([]);
	            output[a][b] = input[a][b];
	        }
	    }
	    for (var a = 0; a < input.length; a++) {
	        for (var b = 0; b < input.length; b++) {
	            if (input[a][b][0] == null) {
	                continue;
	            }
	            else if (a != b && !(input[a][b].length === 1 && input[a][b][0] === b)) {
	                output[a][b] = [];
	                findDirectParents(a, b, input, output);
	            }
	        }
	    }
	    return output;
	}
	exports.changeNextToDirectParents = changeNextToDirectParents;
	function findDirectParents(u, v, inNext, outNext) {
	    var nodesInTracking = [u];
	    var counter = 0;
	    while (nodesInTracking.length > 0) {
	        var currNode = nodesInTracking.pop();
	        if (currNode == u && counter > 0) {
	            continue;
	        }
	        else {
	            for (var e = 0; e < inNext[currNode][v].length; e++) {
	                if (inNext[currNode][v][e] == v && counter == 0) {
	                    outNext[u][v] = $SU.mergeOrderedArraysNoDups(outNext[u][v], [v]);
	                }
	                else if (inNext[currNode][v][e] == v) {
	                    outNext[u][v] = $SU.mergeOrderedArraysNoDups(outNext[u][v], [currNode]);
	                }
	                else {
	                    nodesInTracking = $SU.mergeOrderedArraysNoDups(nodesInTracking, [inNext[currNode][v][e]]);
	                }
	            }
	        }
	        counter++;
	    }
	}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
	var SimplePerturber = /** @class */ (function () {
	    function SimplePerturber(_graph) {
	        this._graph = _graph;
	    }
	    /**
	     *
	     * @param percentage
	     */
	    SimplePerturber.prototype.randomlyDeleteNodesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage / 100);
	        this.randomlyDeleteNodesAmount(nr_nodes_to_delete);
	    };
	    /**
	     *
	     * @param percentage
	     */
	    SimplePerturber.prototype.randomlyDeleteUndEdgesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
	        this.randomlyDeleteUndEdgesAmount(nr_edges_to_delete);
	    };
	    /**
	     *
	     * @param percentage
	     */
	    SimplePerturber.prototype.randomlyDeleteDirEdgesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
	        this.randomlyDeleteDirEdgesAmount(nr_edges_to_delete);
	    };
	    /**
	     *
	     */
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
	    /**
	     *
	     */
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
	    /**
	     *
	     */
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
	    /**
	     *
	     */
	    SimplePerturber.prototype.randomlyAddUndEdgesPercentage = function (percentage) {
	        var nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
	        this.randomlyAddEdgesAmount(nr_und_edges_to_add, { directed: false });
	    };
	    /**
	     *
	     */
	    SimplePerturber.prototype.randomlyAddDirEdgesPercentage = function (percentage) {
	        var nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
	        this.randomlyAddEdgesAmount(nr_dir_edges_to_add, { directed: true });
	    };
	    /**
	     *
	     * DEFAULT edge direction: UNDIRECTED
	     */
	    SimplePerturber.prototype.randomlyAddEdgesAmount = function (amount, config) {
	        if (amount <= 0) {
	            throw new Error('Cowardly refusing to add a non-positive amount of edges');
	        }
	        var node_a, node_b, nodes;
	        var direction = (config && config.directed) ? config.directed : false, dir = direction ? "_d" : "_u";
	        // logger.log("DIRECTION of new edges to create: " + direction ? "directed" : "undirected");
	        while (amount) {
	            node_a = this._graph.getRandomNode();
	            while ((node_b = this._graph.getRandomNode()) === node_a) { }
	            var edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	            if (node_a.hasEdgeID(edge_id)) {
	                // TODO: Check if the whole duplication prevention is really necessary!
	                // logger.log("Duplicate edge creation, continuing...");
	                continue;
	            }
	            else {
	                /**
	                 * Enable random weights for edges ??
	                 */
	                this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: direction });
	                --amount;
	            }
	        }
	        // logger.log(`Created ${amount} ${direction ? "directed" : "undirected"} edges...`);
	    };
	    /**
	     *
	     */
	    SimplePerturber.prototype.randomlyAddNodesPercentage = function (percentage, config) {
	        var nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage / 100);
	        this.randomlyAddNodesAmount(nr_nodes_to_add, config);
	    };
	    /**
	     *
	     * If the degree configuration is invalid
	     * (negative or infinite degree amount / percentage)
	     * the nodes will have been created nevertheless
	     */
	    SimplePerturber.prototype.randomlyAddNodesAmount = function (amount, config) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to add a negative amount of nodes';
	        }
	        var new_nodes = {};
	        while (amount--) {
	            /**
	             * @todo check if this procedure is 'random enough'
	             */
	            var new_node_id = (Math.random() + 1).toString(36).substr(2, 32) + (Math.random() + 1).toString(36).substr(2, 32);
	            new_nodes[new_node_id] = this._graph.addNodeByID(new_node_id);
	        }
	        if (config == null) {
	            return;
	        }
	        else {
	            this.createEdgesByConfig(config, new_nodes);
	        }
	    };
	    /**
	     * Go through the degree_configuration provided and create edges
	     * as requested by config
	     */
	    SimplePerturber.prototype.createEdgesByConfig = function (config, new_nodes) {
	        var degree, min_degree, max_degree, deg_probability;
	        if (config.und_degree != null ||
	            config.dir_degree != null ||
	            config.min_und_degree != null && config.max_und_degree != null ||
	            config.min_dir_degree != null && config.max_dir_degree != null) {
	            // Ignore min / max undirected degree if specific amount is given
	            if ((degree = config.und_degree) != null) {
	                this.createRandomEdgesSpan(degree, degree, false, new_nodes);
	            }
	            else if ((min_degree = config.min_und_degree) != null
	                && (max_degree = config.max_und_degree) != null) {
	                this.createRandomEdgesSpan(min_degree, max_degree, false, new_nodes);
	            }
	            // Ignore min / max directed degree if specific amount is given
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
	    /**
	     * Simple edge generator:
	     * Go through all node combinations, and
	     * add an (un)directed edge with
	     * @param probability and
	     * @direction true or false
	     * CAUTION: this algorithm takes quadratic runtime in #nodes
	     */
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
	                    // Check if edge already exists
	                    if (this._graph.getNodes()[node_a].hasEdgeID(edge_id)) {
	                        continue;
	                    }
	                    this._graph.addEdgeByID(edge_id, all_nodes[node_a], all_nodes[node_b], { directed: directed });
	                }
	            }
	        }
	    };
	    /**
	     * Simple edge generator:
	     * Go through all nodes, and
	     * add [min, max] (un)directed edges to
	     * a randomly chosen node
	     * CAUTION: this algorithm could take quadratic runtime in #nodes
	     * but should be much faster
	     */
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
	        // Do we need to set them integers before the calculations?
	        var min = min | 0, max = max | 0, new_nodes = setOfNodes || this._graph.getNodes(), all_nodes = this._graph.getNodes(), idx_a, node_a, node_b, edge_id, 
	        // we want edges to all possible nodes
	        // TODO: enhance with types / filters later on
	        node_keys = Object.keys(all_nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
	        for (idx_a in new_nodes) {
	            node_a = new_nodes[idx_a];
	            rand_idx = 0;
	            rand_deg = (Math.random() * (max - min) + min) | 0;
	            while (rand_deg) {
	                rand_idx = (keys_len * Math.random()) | 0; // should never reach keys_len...
	                node_b = all_nodes[node_keys[rand_idx]];
	                if (node_a !== node_b) {
	                    edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	                    // Check if edge already exists
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
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $G = __webpack_require__(4);
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
	/**
	 *
	 */
	var MCMFBoykov = /** @class */ (function () {
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
	            // undGraph 		: null
	        };
	        this._config = config || this.prepareMCMFStandardConfig();
	        if (this._config.directed) {
	            this.renameEdges(_graph);
	        }
	        this._state.residGraph = this._graph;
	        if (!this._config.directed) {
	            // convert the undirected graph to a directed one
	            this._state.residGraph = this.convertToDirectedGraph(this._state.residGraph);
	            // update source and sink
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
	        // init
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
	        // compute the cut edges and the total cost of the cut
	        // var tree_ids = Object.keys(this._state.tree);
	        // var tree_length = tree_ids.length;
	        // var size_S = 0;
	        // for (let i = 0; i < tree_length; i++) {
	        //     if (this._state.tree[tree_ids[i]] == "S") {
	        //         ++size_S;
	        //     }
	        // }
	        logger.log("computing result");
	        var smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
	        var smallTree_size = Object.keys(smallTree).length;
	        var smallTree_ids = Object.keys(smallTree);
	        for (var i = 0; i < smallTree_size; i++) {
	            // var node_id: string = smallTree[Object.keys(smallTree)[i]].getID();
	            var node_id = smallTree_ids[i];
	            var node = this._graph.getNodeById(node_id);
	            // if undirected
	            if (!this._config.directed) {
	                var undEdges = node.undEdges();
	                var undEdges_size = Object.keys(undEdges).length;
	                var undEdges_ids = Object.keys(undEdges);
	                for (var i_1 = 0; i_1 < undEdges_size; i_1++) {
	                    // var edge: $E.IBaseEdge = undEdges[Object.keys(undEdges)[i]];
	                    var edge = undEdges[undEdges_ids[i_1]];
	                    var neighbor = (edge.getNodes().a.getID() == node.getID()) ? edge.getNodes().b : edge.getNodes().a;
	                    // if (this.tree(neighbor) != this.tree(node)) {
	                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
	                        // we found a an edge which is part of the Cut
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	            }
	            else {
	                /*TODO refactor! object.keys is fucking slow... see above!
	                */
	                /* if directed
	                    */
	                var outEdges_ids = Object.keys(node.outEdges());
	                var outEdges_length = outEdges_ids.length;
	                var inEdges_ids = Object.keys(node.inEdges());
	                var inEdges_length = inEdges_ids.length;
	                // check outEdges
	                for (var i_2 = 0; i_2 < outEdges_length; i_2++) {
	                    // var edge: $E.IBaseEdge = outEdges[Object.keys(outEdges)[i]];
	                    var edge = this._graph.getEdgeById(outEdges_ids[i_2]);
	                    var neighbor = edge.getNodes().b;
	                    // if (this.tree(neighbor) != this.tree(node)) {
	                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
	                        // we found a an edge which is part of the Cut
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	                // check inEdges
	                for (var i_3 = 0; i_3 < inEdges_length; i_3++) {
	                    // var edge: $E.IBaseEdge = inEdges[Object.keys(inEdges)[i]];
	                    var edge = this._graph.getEdgeById(inEdges_ids[i_3]);
	                    var neighbor = edge.getNodes().a;
	                    if (this.tree(neighbor) != this.tree(node)) {
	                        // we found a an edge which is part of the Cut
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	            }
	        }
	        //logger.log(result.edges);
	        logger.log("Cost => " + result.cost);
	        logger.log("# cycles => " + nrCycles);
	        // logger.log(result.edges);
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
	        // copy all nodes
	        var nodes = uGraph.getNodes();
	        var nodes_ids = Object.keys(nodes);
	        var nodes_length = nodes_ids.length;
	        // logger.log("#nodes: " + Object.keys(nodes).length);
	        for (var i = 0; i < nodes_length; i++) {
	            // var node: $N.IBaseNode = nodes[Object.keys(nodes)[i]];
	            var node = nodes[nodes_ids[i]];
	            dGraph.addNodeByID(node.getID());
	        }
	        // create one in and one out edge for each undirected edge
	        var edges = uGraph.getUndEdges();
	        var edges_ids = Object.keys(edges);
	        var edges_length = edges_ids.length;
	        for (var i = 0; i < edges_length; i++) {
	            // var und_edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
	            var und_edge = edges[edges_ids[i]];
	            var node_a_id = und_edge.getNodes().a.getID();
	            var node_b_id = und_edge.getNodes().b.getID();
	            var options = { directed: true, weighted: true, weight: und_edge.getWeight() };
	            dGraph.addEdgeByID(node_a_id + "_" + node_b_id, dGraph.getNodeById(node_a_id), dGraph.getNodeById(node_b_id), options);
	            dGraph.addEdgeByID(node_b_id + "_" + node_a_id, dGraph.getNodeById(node_b_id), dGraph.getNodeById(node_a_id), options);
	        }
	        // logger.log(dGraph);
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
	            if (this._state.parents[node_id] == null) { // this happens when the root of this path is a free node
	                return path_root;
	            }
	            node_id = this._state.parents[node_id].getID();
	            path_root.push(this._graph.getNodeById(node_id));
	        }
	        return path_root;
	    };
	    MCMFBoykov.prototype.getBottleneckCapacity = function () {
	        var min_capacity = 0;
	        // set first edge weight
	        var min_capacity = this._state.residGraph.getEdgeById(this._state.path[0].getID() + "_" + this._state.path[1].getID()).getWeight();
	        var path_length = this._state.path.length - 1;
	        for (var i = 0; i < path_length; i++) {
	            var node_a = this._state.path[i];
	            var node_b = this._state.path[i + 1];
	            // var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
	            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
	            if (edge.getWeight() < min_capacity) {
	                min_capacity = edge.getWeight();
	            }
	        }
	        return min_capacity;
	    };
	    MCMFBoykov.prototype.grow = function () {
	        // as long as there are active nodes
	        var nr_active_nodes = Object.keys(this._state.activeNodes).length;
	        var active_nodes_ids = Object.keys(this._state.activeNodes);
	        while (nr_active_nodes) {
	            // take an active node
	            // var activeNode: $N.IBaseNode = this._state.activeNodes[Object.keys(this._state.activeNodes)[0]];
	            var activeNode = this._state.activeNodes[active_nodes_ids[0]];
	            // var edges: {[k: string] : $E.IBaseEdge} = (this.tree(activeNode) == "S") ? activeNode.outEdges() : activeNode.inEdges();
	            var edges = (this._state.tree[activeNode.getID()] == "S") ? activeNode.outEdges() : activeNode.inEdges();
	            var edges_ids = Object.keys(edges);
	            var edges_length = edges_ids.length;
	            // for all neighbors
	            for (var i = 0; i < edges_length; i++) {
	                // var edge: $E.IBaseEdge = edges[(Object.keys(edges)[i])];
	                var edge = edges[edges_ids[i]];
	                var neighborNode = (this._state.tree[activeNode.getID()] == "S") ? edge.getNodes().b : edge.getNodes().a;
	                if (edge.getWeight() <= 0) {
	                    continue;
	                }
	                if (!(this._state.tree[neighborNode.getID()])) {
	                    // add neighbor to corresponding tree
	                    if (this._state.tree[activeNode.getID()] == "S") {
	                        this._state.treeS[neighborNode.getID()] = neighborNode;
	                        this._state.tree[neighborNode.getID()] = "S";
	                    }
	                    else {
	                        this._state.treeT[neighborNode.getID()] = neighborNode;
	                        this._state.tree[neighborNode.getID()] = "T";
	                    }
	                    // set active node as parent to neighbor node
	                    this._state.parents[neighborNode.getID()] = activeNode;
	                    // add neighbor to active node set
	                    this._state.activeNodes[neighborNode.getID()] = neighborNode;
	                    active_nodes_ids.push(neighborNode.getID());
	                    ++nr_active_nodes;
	                }
	                else if (this._state.tree[neighborNode.getID()] != this._state.tree[activeNode.getID()]) {
	                    // constructing path
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
	                    // return; this._state.path;
	                    return;
	                }
	            }
	            delete this._state.activeNodes[activeNode.getID()];
	            active_nodes_ids.shift();
	            --nr_active_nodes;
	        }
	        this._state.path = [];
	        return; //empty path
	    };
	    MCMFBoykov.prototype.augmentation = function () {
	        var min_capacity = this.getBottleneckCapacity();
	        for (var i = 0; i < this._state.path.length - 1; i++) {
	            var node_a = this._state.path[i], node_b = this._state.path[i + 1];
	            // var edge = this._state.residGraph.getEdgeByNodeIDs(node_a.getID(), node_b.getID());
	            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
	            // var reverse_edge = this._state.residGraph.getEdgeByNodeIDs(node_b.getID(), node_a.getID());
	            var reverse_edge = this._state.residGraph.getEdgeById(node_b.getID() + "_" + node_a.getID());
	            // update the residual capacity in the graph
	            this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
	            this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
	            // for all saturated edges
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
	            // var orphan: $N.IBaseNode = this._state.orphans[Object.keys(this._state.orphans)[0]];
	            var orphan = this._state.orphans[orphans_ids[0]];
	            delete this._state.orphans[orphan.getID()];
	            orphans_ids.shift();
	            --orphans_size;
	            // try to find a new valid parent for the orphan
	            var edges = (this._state.tree[orphan.getID()] == "S") ? orphan.inEdges() : orphan.outEdges();
	            var edge_ids = Object.keys(edges);
	            var edge_length = edge_ids.length;
	            var found = false;
	            for (var i = 0; i < edge_length; i++) {
	                // var edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
	                var edge = edges[edge_ids[i]];
	                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
	                // check for same tree and weight > 0
	                if ((this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) && edge.getWeight()) {
	                    var neighbor_root_path = this.getPathToRoot(neighbor);
	                    var neighbor_root = neighbor_root_path[neighbor_root_path.length - 1];
	                    // check for root either source or sink
	                    if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
	                        // we found a valid parent
	                        this._state.parents[orphan.getID()] = neighbor;
	                        found = true;
	                        break;
	                    }
	                }
	            }
	            if (found) {
	                continue;
	            }
	            // var edge_ids: Array<string> = Object.keys(edges);
	            // var edge_length: number = edge_ids.length;
	            // we could not find a valid parent
	            for (var i = 0; i < edge_length; i++) {
	                // var edge: $E.IBaseEdge = edges[Object.keys(edges)[i]];
	                var edge = edges[edge_ids[i]];
	                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if (this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) {
	                    // set neighbor active
	                    if (edge.getWeight()) {
	                        this._state.activeNodes[neighbor.getID()] = neighbor;
	                    }
	                    if (this._state.parents[neighbor.getID()] == null) {
	                        continue;
	                    }
	                    // set neighbor to orphan if his parent is the current orphan
	                    if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
	                        this._state.orphans[neighbor.getID()] = neighbor;
	                        orphans_ids.push(neighbor.getID());
	                        ++orphans_size;
	                        delete this._state.parents[neighbor.getID()];
	                    }
	                }
	            }
	            // remove from current tree and from activeNodes
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
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $SU = __webpack_require__(3);
	var DegreeMode;
	(function (DegreeMode) {
	    DegreeMode[DegreeMode["in"] = 0] = "in";
	    DegreeMode[DegreeMode["out"] = 1] = "out";
	    DegreeMode[DegreeMode["und"] = 2] = "und";
	    DegreeMode[DegreeMode["dir"] = 3] = "dir";
	    DegreeMode[DegreeMode["all"] = 4] = "all";
	})(DegreeMode = exports.DegreeMode || (exports.DegreeMode = {}));
	var DegreeCentrality = /** @class */ (function () {
	    function DegreeCentrality() {
	    }
	    DegreeCentrality.prototype.getCentralityMap = function (graph, weighted, conf) {
	        weighted = (weighted != null) ? !!weighted : true;
	        conf = (conf == null) ? DegreeMode.all : conf;
	        var ret = {}; //Will be a map of [nodeID] = centrality
	        switch (conf) { //Switch on the outside for faster loops
	            case DegreeMode.in:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null) {
	                        if (!weighted) {
	                            ret[key] = node.inDegree();
	                        }
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.inEdges()) {
	                                ret[key] += node.inEdges()[k].getWeight();
	                            }
	                        }
	                    }
	                }
	                break;
	            case DegreeMode.out:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null) {
	                        if (!weighted) {
	                            ret[key] = node.outDegree();
	                        }
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.outEdges()) {
	                                ret[key] += node.outEdges()[k].getWeight();
	                            }
	                        }
	                    }
	                }
	                break;
	            case DegreeMode.und:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null) {
	                        if (!weighted) {
	                            ret[key] = node.degree();
	                        }
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.undEdges()) {
	                                ret[key] += node.undEdges()[k].getWeight();
	                            }
	                        }
	                    }
	                }
	                break;
	            case DegreeMode.dir:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null) {
	                        if (!weighted) {
	                            ret[key] = node.inDegree() + node.outDegree();
	                        }
	                        else {
	                            ret[key] = ret[key] || 0;
	                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
	                            for (var k in comb) {
	                                ret[key] += comb[k].getWeight();
	                            }
	                        }
	                    }
	                }
	                break;
	            case DegreeMode.all:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null) {
	                        if (!weighted) {
	                            ret[key] = node.degree() + node.inDegree() + node.outDegree();
	                        }
	                        else {
	                            ret[key] = ret[key] || 0;
	                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
	                            for (var k in comb) {
	                                ret[key] += comb[k].getWeight();
	                            }
	                        }
	                    }
	                }
	                break;
	        }
	        return ret;
	    };
	    /**
	     * @TODO Weighted version !
	   * @TODO per edge type !
	     */
	    DegreeCentrality.prototype.degreeDistribution = function (graph) {
	        var max_deg = 0, key, nodes = graph.getNodes(), node, all_deg;
	        for (key in nodes) {
	            node = nodes[key];
	            all_deg = node.inDegree() + node.outDegree() + node.degree() + 1;
	            max_deg = all_deg > max_deg ? all_deg : max_deg;
	        }
	        var deg_dist = {
	            in: new Uint32Array(max_deg),
	            out: new Uint32Array(max_deg),
	            dir: new Uint32Array(max_deg),
	            und: new Uint32Array(max_deg),
	            all: new Uint32Array(max_deg)
	        };
	        for (key in nodes) {
	            node = nodes[key];
	            deg_dist.in[node.inDegree()]++;
	            deg_dist.out[node.outDegree()]++;
	            deg_dist.dir[node.inDegree() + node.outDegree()]++;
	            deg_dist.und[node.degree()]++;
	            deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
	        }
	        // console.dir(deg_dist);
	        return deg_dist;
	    };
	    return DegreeCentrality;
	}());
	exports.DegreeCentrality = DegreeCentrality;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $PFS = __webpack_require__(12);
	var $FW = __webpack_require__(22);
	//Calculates all the shortest path's to all other nodes for all given nodes in the graph
	//Returns a map with every node as key and the average distance to all other nodes as value
	var closenessCentrality = /** @class */ (function () {
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
	        //set the config (we want the sum of all edges to become a property of result)
	        //a node is encountered the first time
	        var not_encountered = function (context) {
	            // adding the distance to the accumulated distance
	            accumulated_distance += context.current.best + (isNaN(context.next.edge.getWeight()) ? 1 : context.next.edge.getWeight());
	        };
	        //We found a better path, we need to correct the accumulated distance
	        var betterPathFound = function (context) {
	            //console.log("correcting distance "+context.current.node.getID()+"->"+context.next.node.getID()+" from " + pfs_config.result[context.next.node.getID()].distance + "to" + context.better_dist);
	            accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.proposed_dist;
	        };
	        var bp = pfs_config.callbacks.better_path.pop(); //change the order, otherwise our betterPathFound would not do anything
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
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $FW = __webpack_require__(22);
	var $JO = __webpack_require__(28);
	/**
	 * DEMO Version of a betweenness centrality computed via Johnson's or FloydWarshall algorithm
	 *
	 * @param graph the graph to perform Floyd-Warshall/Johnsons on
	 * @param directed for normalization, not used at the moment
	 * @param sparse decides if using the FW (dense) or Johnsons (sparse)
	 *
	 * @returns m*m matrix of values (dist), m*m*m matrix of neighbors (next)
	 * @constructor
	 *
	 * @comment function gives the correct results but is slow.
	 *
	 * !!! DO NOT USE FOR PRODUCTION !!!
	 *
	 * @todo decide if we still need it...
	 */
	function betweennessCentrality(graph, directed, sparse) {
	    var paths;
	    var sparse = sparse || false;
	    if (sparse) {
	        paths = $JO.Johnsons(graph)[1];
	    }
	    else {
	        paths = $FW.changeNextToDirectParents($FW.FloydWarshallAPSP(graph)[1]);
	    }
	    var nodes = graph.getNodes();
	    //getting the nodeKeys
	    var nodeKeys = Object.keys(nodes);
	    var map = {};
	    for (var key in nodes) {
	        //initializing the map which will be returned at the end - should it contain the keys (numbers), or the node IDs?
	        map[key] = 0;
	    }
	    var N = paths.length;
	    for (var a = 0; a < N; ++a) {
	        for (var b = 0; b < N; ++b) {
	            //if self, or b is directly reachable from a and it is the only shortest path, no betweenness score is handed out
	            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b) && paths[a][b][0] != null) {
	                // console.log("called with a and b: "+a+" , "+b);
	                var tempMap = {};
	                var leadArray = [];
	                var pathCount = 0;
	                do {
	                    //ends when all paths are traced back
	                    var tracer = b;
	                    var leadCounter = 0;
	                    pathCount++;
	                    while (true) {
	                        //ends when one path is traced back
	                        var previous = paths[a][tracer];
	                        var terminate = false;
	                        //no branching: 
	                        if (previous.length == 1 && previous[0] == tracer) {
	                            break;
	                        }
	                        else if (previous.length == 1) {
	                            tracer = previous[0];
	                            //scoring on the fly
	                            tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
	                        }
	                        //if there is a branching:
	                        //handle reaching the terminal node here too!          
	                        if (previous.length > 1) {
	                            //case: leadArray is empty and we find a branch
	                            if (leadArray.length == 0) {
	                                //leave a trace in the leadArray
	                                leadArray.push([0, previous.length]);
	                                if (previous[0] == tracer) {
	                                    terminate = true;
	                                }
	                                else {
	                                    tracer = previous[0];
	                                    tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
	                                }
	                                leadCounter++;
	                            }
	                            //case: branch is covered by the leadArray
	                            else if (leadCounter < leadArray.length) {
	                                var choice = leadArray[leadCounter][0];
	                                if (previous[choice] == tracer) {
	                                    terminate = true;
	                                }
	                                else {
	                                    tracer = previous[choice];
	                                    tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
	                                }
	                                leadCounter++;
	                            }
	                            //case: branch is beyond the leadArray (new branching encountered)
	                            else {
	                                //leave a trace in the leadArray
	                                leadArray.push([0, previous.length]);
	                                if (previous[0] == tracer) {
	                                    terminate = true;
	                                }
	                                else {
	                                    tracer = previous[0];
	                                    tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
	                                }
	                                leadCounter++;
	                            }
	                        }
	                        if (terminate) {
	                            break;
	                        }
	                    }
	                    // here I need to update the leadArray, if not empty
	                    //reminder: each subarray in leadArray: [current branchpoint, length]
	                    if (leadArray.length > 0) {
	                        leadArray[leadArray.length - 1][0]++;
	                        while (leadArray[leadArray.length - 1][0] == leadArray[leadArray.length - 1][1]) {
	                            //then remove last item from leadArray
	                            leadArray.splice(leadArray.length - 1, 1);
	                            if (leadArray.length == 0) {
	                                break;
	                            }
	                            leadArray[leadArray.length - 1][0]++;
	                        }
	                    }
	                    //console.log("one round over, path count: " + pathCount);
	                } while (leadArray.length != 0);
	                //now put the correct scores into the final map
	                //be careful, the return map uses letters as nodekeys! - one must transform, otherwise one gets rubbish
	                for (var key in tempMap) {
	                    // console.log("tempMap element " + key);
	                    // console.log(tempMap[key]);
	                    var mapKey = nodeKeys[key];
	                    map[mapKey] += tempMap[key] / pathCount;
	                }
	            }
	        }
	    }
	    return map;
	}
	exports.betweennessCentrality = betweennessCentrality;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $N = __webpack_require__(2);
	var $PFS = __webpack_require__(12);
	var $BF = __webpack_require__(11);
	var $SU = __webpack_require__(3);
	function Johnsons(graph) {
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error("Cowardly refusing to traverse graph without edges.");
	    }
	    //getting all graph nodes
	    var allNodes = graph.getNodes();
	    var nodeKeys = Object.keys(allNodes);
	    if (graph.hasNegativeEdge()) {
	        var extraNode = new $N.BaseNode("extraNode");
	        graph = addExtraNandE(graph, extraNode);
	        var BFresult = $BF.BellmanFordDict(graph, extraNode);
	        //reminder: output of the BellmanFordDict is BFDictResult
	        //contains a dictionary called distances, format: {[nodeID]:dist}, and a boolean called neg_cycle
	        if (BFresult.neg_cycle) {
	            throw new Error("The graph contains a negative cycle, thus it can not be processed");
	        }
	        else {
	            var newWeights = BFresult.distances;
	            graph = reWeighGraph(graph, newWeights, extraNode);
	            //graph still has the extraNode
	            //reminder: deleteNode function removes its edges, too
	            graph.deleteNode(extraNode);
	            return PFSFromAllNodes(graph);
	        }
	    }
	    return PFSFromAllNodes(graph);
	}
	exports.Johnsons = Johnsons;
	function addExtraNandE(target, nodeToAdd) {
	    var allNodes = target.getNodes();
	    target.addNode(nodeToAdd);
	    var tempCounter = 0;
	    //now add a directed edge from the extranode to all graph nodes, excluding itself
	    for (var nodeKey in allNodes) {
	        if (allNodes[nodeKey].getID() != nodeToAdd.getID()) {
	            target.addEdgeByNodeIDs("temp" + tempCounter, nodeToAdd.getID(), allNodes[nodeKey].getID(), { directed: true, weighted: true, weight: 0 });
	            tempCounter++;
	        }
	    }
	    return target;
	}
	exports.addExtraNandE = addExtraNandE;
	function reWeighGraph(target, distDict, tempNode) {
	    //reminder: w(e)'=w(e)+dist(a)-dist(b), a and b the start and end nodes of the edge
	    var edges = target.getDirEdgesArray().concat(target.getUndEdgesArray());
	    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
	        var edge = edges_1[_i];
	        var a = edge.getNodes().a.getID();
	        var b = edge.getNodes().b.getID();
	        //no need to re-weigh the temporary edges starting from the extraNode, they will be deleted anyway
	        if (a == tempNode.getID()) {
	            continue;
	        }
	        //assuming that the node keys in the distDict correspond to the nodeIDs
	        else if (edge.isWeighted) {
	            var oldWeight = edge.getWeight();
	            var newWeight = oldWeight + distDict[a] - distDict[b];
	            edge.setWeight(newWeight);
	        }
	        else {
	            var oldWeight = $PFS.DEFAULT_WEIGHT; //which is 1
	            var newWeight = oldWeight + distDict[a] - distDict[b];
	            //collecting edgeID and directedness for later re-use
	            var edgeID = edge.getID();
	            var dirNess = edge.isDirected();
	            //one does not simply make an edge weighted, but needs to delete and re-create it
	            target.deleteEdge(edge);
	            target.addEdgeByNodeIDs(edgeID, a, b, { directed: dirNess, weighted: true, weight: newWeight });
	        }
	    }
	    return target;
	}
	exports.reWeighGraph = reWeighGraph;
	function PFSFromAllNodes(graph) {
	    var dists = graph.adjListArray();
	    var next = graph.nextArray();
	    var nodesDict = graph.getNodes();
	    var nodeIDIdxMap = {};
	    var i = 0;
	    for (var key in nodesDict) {
	        nodeIDIdxMap[nodesDict[key].getID()] = i++;
	    }
	    var specialConfig = $PFS.preparePFSStandardConfig();
	    var notEncounteredJohnsons = function (context) {
	        context.next.best =
	            context.current.best + (isNaN(context.next.edge.getWeight()) ? $PFS.DEFAULT_WEIGHT : context.next.edge.getWeight());
	        var i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
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
	    var betterPathJohnsons = function (context) {
	        var i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
	        dists[i][j] = context.proposed_dist;
	        if (context.current.node !== context.root_node) {
	            next[i][j].splice(0, next[i][j].length, nodeIDIdxMap[context.current.node.getID()]);
	        }
	    };
	    specialConfig.callbacks.better_path.splice(0, 1, betterPathJohnsons);
	    var equalPathJohnsons = function (context) {
	        var i = nodeIDIdxMap[context.root_node.getID()], j = nodeIDIdxMap[context.next.node.getID()];
	        if (context.current.node !== context.root_node) {
	            next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], [nodeIDIdxMap[context.current.node.getID()]]);
	        }
	    };
	    specialConfig.callbacks.equal_path.push(equalPathJohnsons);
	    for (var key in nodesDict) {
	        $PFS.PFS(graph, nodesDict[key], specialConfig);
	    }
	    return [dists, next];
	}
	exports.PFSFromAllNodes = PFSFromAllNodes;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $SU = __webpack_require__(3);
	var $GAUSS = __webpack_require__(30);
	//Calculates the page rank for a given graph
	var pageRankDetCentrality = /** @class */ (function () {
	    function pageRankDetCentrality() {
	    }
	    pageRankDetCentrality.prototype.getCentralityMap = function (graph, weighted) {
	        //First initialize the values for all nodes
	        var divideTable = {}; //Tells us how many outgoing edges each node has
	        var matr = [];
	        var ctr = 0;
	        var map = {};
	        for (var key in graph.getNodes()) {
	            divideTable[key] = 0;
	        }
	        for (var key in graph.getNodes()) { //Run through all nodes in graph
	            //pageScores[key] = startVal;
	            map[key] = ctr;
	            var node = graph.getNodeById(key);
	            var node_InEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
	            matr[ctr] = new Array();
	            //Find out which other nodes influence the PageRank of this node
	            for (var edgeKey in node_InEdges) {
	                var edge = node_InEdges[edgeKey];
	                if (edge.getNodes().a.getID() == node.getID()) {
	                    matr[ctr].push(edge.getNodes().b.getID());
	                    divideTable[edge.getNodes().b.getID()]++; //Count to see how much we have to split the score
	                }
	                else {
	                    matr[ctr].push(edge.getNodes().a.getID());
	                    divideTable[edge.getNodes().a.getID()]++;
	                }
	            }
	            //We push this to the array and pop it later, this is the current variable (=left side of equation)
	            matr[ctr].push(node.getID());
	            ctr++;
	        }
	        ctr = 0;
	        var mapCtr = {};
	        var numMatr = [[]];
	        //console.log(matr);
	        //Bring matrix into correct form
	        for (var key in matr) { //  |maybe add +1 here
	            numMatr[key] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0); //Fill array with 0
	            //set the slot of our variable to -1 (we switch it to the other side)
	            var p = matr[key].pop();
	            if (mapCtr[p] == null)
	                mapCtr[p] = ctr++;
	            numMatr[key][mapCtr[p]] = -1;
	            for (var k in matr[key]) {
	                var a = matr[key][k];
	                if (mapCtr[a] == null)
	                    mapCtr[a] = ctr++;
	                //console.log("mapCtr:"+mapCtr[a] + " " + a);
	                numMatr[key][mapCtr[a]] += 1 / divideTable[a];
	            }
	        }
	        //Now add last equation, everything added together should be 1!  | maybe add +1 here
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
/* 30 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * This file was taken from https://github.com/itsravenous/gaussian-elimination
	 * Authors: itsravenous, seckwei
	 * Licence: GPL-3.0
	 *
	 * Small changes were made to comply to typescript
	 * TODO: Check licence compliance with authors
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	var abs = Math.abs;
	function array_fill(i, n, v) {
	    var a = [];
	    for (; i < n; i++) {
	        a.push(v);
	    }
	    return a;
	}
	/**
	 * Gaussian elimination
	 * @param  array A matrix
	 * @param  array x vector
	 * @return array x solution vector
	 */
	function gauss(A, x) {
	    var i, k, j;
	    // Just make a single matrix
	    for (i = 0; i < A.length; i++) {
	        A[i].push(x[i]);
	    }
	    var n = A.length;
	    for (i = 0; i < n; i++) {
	        // Search for maximum in this column
	        var maxEl = abs(A[i][i]), maxRow = i;
	        for (k = i + 1; k < n; k++) {
	            if (abs(A[k][i]) > maxEl) {
	                maxEl = abs(A[k][i]);
	                maxRow = k;
	            }
	        }
	        // Swap maximum row with current row (column by column)
	        for (k = i; k < n + 1; k++) {
	            var tmp = A[maxRow][k];
	            A[maxRow][k] = A[i][k];
	            A[i][k] = tmp;
	        }
	        // Make all rows below this one 0 in current column
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
	    // Solve equation Ax=b for an upper triangular matrix A
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $SU = __webpack_require__(3);
	//Calculates the page rank for a given graph
	var pageRankCentrality = /** @class */ (function () {
	    function pageRankCentrality() {
	    }
	    pageRankCentrality.prototype.getCentralityMap = function (graph, weighted, alpha, conv, iterations) {
	        if (alpha == null)
	            alpha = 0.10;
	        if (iterations == null)
	            iterations = 1000;
	        if (conv == null)
	            conv = 0.000125;
	        //First initialize the values for all nodes
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
	        //console.log(JSON.stringify(structure));
	        for (var key in graph.getNodes()) {
	            key = String(key);
	            curr[key] = 1 / nrNodes;
	            old[key] = 1 / nrNodes;
	        }
	        for (var i = 0; i < iterations; i++) {
	            var me = 0.0;
	            for (var key in graph.getNodes()) { //Run through all nodes in graph
	                key = String(key);
	                //console.log(structure[key]);
	                var total = 0;
	                var parents = structure[key]['inc'];
	                for (var k in parents) {
	                    var p = String(parents[k]);
	                    total += old[p] / structure[p]['deg'];
	                }
	                //console.log("o:"+old[key] + " n:"+curr[key]);
	                curr[key] = total * (1 - alpha) + alpha / nrNodes;
	                me += Math.abs(curr[key] - old[key]);
	            }
	            if (me <= conv) {
	                return curr;
	            }
	            //console.log("Error:"+me/nrNodes);
	            old = $SU.clone(curr);
	        }
	        return curr;
	    };
	    return pageRankCentrality;
	}());
	exports.pageRankCentrality = pageRankCentrality;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../../typings/tsd.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var $G = __webpack_require__(4);
	var KROL = /** @class */ (function () {
	    function KROL(config) {
	        this._config = config || this.prepareKROLStandardConfig();
	        // this._generator = this._config.generator;
	        // TODO: use the adjacency matrix form the generator graph
	        // as soon as the issues from computing the adjacency matrix are fixe
	        // this._genMat = this._generator.adjListArray();
	        this._genMat = this._config.genMat;
	        this._cycles = this._config.cycles;
	        this._graph = new $G.BaseGraph('synth');
	    }
	    KROL.prototype.generate = function () {
	        // var gen_dims = this._generator.nrNodes();
	        var gen_dims = this._genMat[0].length;
	        var res_dims = Math.pow(gen_dims, this._cycles + 1);
	        for (var index = 0; index < res_dims; index++) {
	            this._graph.addNodeByID(index.toString());
	        }
	        var nr_edges = 0;
	        for (var node1 = 0; node1 < res_dims; node1++) {
	            for (var node2 = 0; node2 < res_dims; node2++) {
	                if (this.addEdge(node1, node2, gen_dims)) {
	                    this._graph.addEdgeByNodeIDs(node1 + '_' + node2, node1.toString(), node2.toString());
	                    ++nr_edges;
	                }
	            }
	        }
	        var result = {
	            graph: this._graph
	        };
	        return result;
	    };
	    KROL.prototype.addEdge = function (node1, node2, dims) {
	        var rprob = Math.random();
	        var prob = 1.0;
	        for (var level = 0; level < this._cycles; level++) {
	            var id_1 = Math.floor(node1 / Math.pow(dims, level + 1)) % dims;
	            var id_2 = Math.floor(node2 / Math.pow(dims, level + 1)) % dims;
	            prob *= this._genMat[id_1][id_2];
	            if (rprob > prob) {
	                return false;
	            }
	        }
	        return true;
	    };
	    KROL.prototype.prepareKROLStandardConfig = function () {
	        // var generator: $G.IGraph = new $G.BaseGraph('generator');
	        // var node_a = generator.addNodeByID('a');
	        // var node_b = generator.addNodeByID('b');
	        // var edge_ab_id: string = node_a.getID() + '_' + node_b.getID();
	        // var edge_ba_id: string = node_b.getID() + '_' + node_a.getID();
	        // var edge_aa_id: string = node_a.getID() + '_' + node_a.getID();
	        // var edge_bb_id: string = node_b.getID() + '_' + node_b.getID();
	        // generator.addEdgeByID(edge_ab_id, node_a, node_b, {weighted: true, weight: 0.9});
	        // generator.addEdgeByID(edge_ba_id, node_b, node_a, {weighted: true, weight: 0.5});
	        // generator.addEdgeByID(edge_aa_id, node_a, node_a, {weighted: true, weight: 0.5});
	        // generator.addEdgeByID(edge_bb_id, node_b, node_b, {weighted: true, weight: 0.1});
	        var genMat = [[0.9, 0.5], [0.5, 0.1]];
	        return {
	            // generator: generator,
	            genMat: genMat,
	            cycles: 5
	        };
	    };
	    return KROL;
	}());
	exports.KROL = KROL;


/***/ })
/******/ ]);