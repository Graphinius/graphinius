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

	/* WEBPACK VAR INJECTION */(function(global) {var Edges			= __webpack_require__(1);
	var Nodes 		= __webpack_require__(2);
	var Graph 		= __webpack_require__(4);
	var CsvInput 	= __webpack_require__(5);
	var JsonInput = __webpack_require__(10);
	var CsvOutput = __webpack_require__(11);
	var BFS				= __webpack_require__(12);
	var DFS				= __webpack_require__(14);
	var PFS       = __webpack_require__(15);

	// TODO:
	// Encapsulate ALL functions within Graph for
	// easier access and less import / new ceremony ??

	var out = typeof window !== 'undefined' ? window : global;

	/**
	 * For Browser window object
	 */
	out.$G = {
		core: {
			Edge 				: Edges.BaseEdge,
			Node 				: Nodes.BaseNode,
			Graph 			: Graph.BaseGraph,
			GraphMode		: Graph.GraphMode
		},
		input: {
			CsvInput 		: CsvInput.CSVInput,
			JsonInput 	: JsonInput.JSONInput
		},
		output: {		
			CsvOutput		: CsvOutput.CsvOutput
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
		}
	};

	/**
	 * For NodeJS / CommonJS global object
	 */
	module.exports = {
		$G : out.$G
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var BaseEdge = (function () {
	    function BaseEdge(_id, _node_a, _node_b, options) {
	        this._id = _id;
	        this._node_a = _node_a;
	        this._node_b = _node_b;
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
	    return BaseEdge;
	}());
	exports.BaseEdge = BaseEdge;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	"use strict";
	var $DS = __webpack_require__(3);
	var BaseNode = (function () {
	    function BaseNode(_id, features) {
	        this._id = _id;
	        /**
	         * degrees - let's hold them separate in order
	         * to avoid Object.keys(...)
	         */
	        this._in_degree = 0;
	        this._out_degree = 0;
	        this._und_degree = 0;
	        this._in_edges = {};
	        this._out_edges = {};
	        this._und_edges = {};
	        this._features = typeof features !== 'undefined' ? $DS.clone(features) : {};
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
	        this._features = $DS.clone(features);
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
	            else if (!this._in_edges[edge_id]) {
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
	        return $DS.mergeObjects([this._in_edges, this._out_edges]);
	    };
	    BaseNode.prototype.allEdges = function () {
	        return $DS.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
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
	        return $DS.mergeArrays([this.nextNodes(), this.connNodes()], identityFunc || function (ne) { return identity++; });
	    };
	    return BaseNode;
	}());
	exports.BaseNode = BaseNode;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
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
	    var cloneObj = obj.constructor();
	    for (var attribute in obj) {
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	"use strict";
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	var $DS = __webpack_require__(3);
	(function (GraphMode) {
	    GraphMode[GraphMode["INIT"] = 0] = "INIT";
	    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
	    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
	    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
	})(exports.GraphMode || (exports.GraphMode = {}));
	var GraphMode = exports.GraphMode;
	var BaseGraph = (function () {
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
	    /**
	     * We assume graphs in which no node has higher total degree than 65536
	     */
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
	        // console.dir(deg_dist);
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
	    BaseGraph.prototype.addNode = function (id, opts) {
	        var node = new $N.BaseNode(id, opts);
	        this._nodes[node.getID()] = node;
	        this._nr_nodes += 1;
	        return node;
	    };
	    BaseGraph.prototype.hasNodeID = function (id) {
	        return !!this._nodes[id];
	    };
	    /**
	     * Use hasNodeLabel with CAUTION ->
	     * it has LINEAR runtime in the graph's #nodes
	     */
	    BaseGraph.prototype.hasNodeLabel = function (label) {
	        return !!$DS.findKey(this._nodes, function (node) {
	            return node.getLabel() === label;
	        });
	    };
	    BaseGraph.prototype.getNodeById = function (id) {
	        return this._nodes[id];
	    };
	    /**
	     * Use getNodeByLabel with CAUTION ->
	     * it has LINEAR runtime in the graph's #nodes
	     */
	    BaseGraph.prototype.getNodeByLabel = function (label) {
	        var id = $DS.findKey(this._nodes, function (node) {
	            return node.getLabel() === label;
	        });
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
	    /**
	     * Use hasEdgeLabel with CAUTION ->
	     * it has LINEAR runtime in the graph's #edges
	     */
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
	    /**
	     * Use hasEdgeLabel with CAUTION ->
	     * it has LINEAR runtime in the graph's #edges
	     */
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
	            return this.addEdge(label, node_a, node_b, opts);
	        }
	    };
	    BaseGraph.prototype.addEdge = function (id, node_a, node_b, opts) {
	        var edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
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
	     * Simple edge generator:
	     * Go through all node combinations, and
	     * add an (un)directed edge with
	     * @param probability and
	     * @direction true or false
	     * CAUTION: this algorithm takes quadratic runtime in #nodes
	     */
	    BaseGraph.prototype.createRandomEdgesProb = function (probability, directed) {
	        if (0 > probability || 1 < probability) {
	            throw new Error("Probability out of range.");
	        }
	        directed = directed || false;
	        var nodes = this._nodes, node_a, node_b, edge_id, dir = directed ? '_d' : '_u';
	        for (node_a in nodes) {
	            for (node_b in nodes) {
	                if (node_a !== node_b && Math.random() < probability) {
	                    edge_id = nodes[node_a].getID() + "_" + nodes[node_b].getID() + dir;
	                    this.addEdge(edge_id, nodes[node_a], nodes[node_b], { directed: directed });
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
	    BaseGraph.prototype.createRandomEdgesSpan = function (min, max, directed) {
	        if (min < 0) {
	            throw new Error('Minimum degree cannot be negative.');
	        }
	        if (max >= this.nrNodes()) {
	            throw new Error('Maximum degree exceeds number of reachable nodes.');
	        }
	        directed = directed || false;
	        // Do we need to set them integers before the calculations?
	        var min = min | 0, max = max | 0, nodes = this._nodes, idx_a, node_a, node_b, edge_id, node_keys = Object.keys(nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
	        for (idx_a in nodes) {
	            node_a = nodes[idx_a];
	            rand_idx = 0;
	            rand_deg = (Math.random() * max + min) | 0;
	            while (rand_deg) {
	                rand_idx = (keys_len * Math.random()) | 0; // should never reach keys_len...
	                node_b = nodes[node_keys[rand_idx]];
	                if (node_a !== node_b) {
	                    edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	                    if (node_a.hasEdgeID(edge_id)) {
	                        continue;
	                    }
	                    this.addEdge(edge_id, node_a, node_b, { directed: directed });
	                    --rand_deg;
	                }
	            }
	        }
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
	    BaseGraph.prototype.pickRandomProperty = function (obj) {
	        var key;
	        var count = 0;
	        for (var prop in obj) {
	            if (obj.hasOwnProperty(prop) && Math.random() < 1 / ++count) {
	                key = prop;
	            }
	        }
	        return obj[key];
	    };
	    return BaseGraph;
	}());
	exports.BaseGraph = BaseGraph;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../../typings/tsd.d.ts" />
	"use strict";
	var path = __webpack_require__(6);
	var fs = __webpack_require__(8);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(9);
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
	        // Node or browser ??
	        if (typeof window !== 'undefined') {
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
	                // end of file or empty line, just treat like an empty line...
	                continue;
	            }
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
	            for (var e = 0; e < edge_array.length;) {
	                if (this._explicit_direction && (!edge_array || edge_array.length % 2)) {
	                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
	                }
	                target_node_id = edge_array[e++];
	                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
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
	                    edge = graph.addEdge(edge_id, node, target_node, { directed: directed });
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
	                // end of file or empty line, just treat like an empty line...
	                continue;
	            }
	            if (elements.length < 2) {
	                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
	            }
	            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2;
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
	            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
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
	                edge = graph.addEdge(edge_id, node, target_node, { directed: directed });
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
/* 6 */
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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
/* 8 */
/***/ function(module, exports) {

	

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var http = __webpack_require__(8);
	/**
	 * @TODO: Test it !!!
	 *
	 * @param url
	 * @param cb
	 * @returns {ClientRequest}
	 */
	function retrieveRemoteFile(url, cb) {
	    if (typeof cb !== 'function') {
	        throw new Error('Provided callback is not a function.');
	    }
	    return http.get(url, function (response) {
	        // Continuously update stream with data
	        var body = '';
	        response.on('data', function (d) {
	            body += d;
	        });
	        response.on('end', function () {
	            // Received data in body...
	            cb(body);
	        });
	    });
	}
	exports.retrieveRemoteFile = retrieveRemoteFile;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../../typings/tsd.d.ts" />
	"use strict";
	var fs = __webpack_require__(8);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(9);
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
	        // Node or browser ??
	        if (typeof window !== 'undefined') {
	            // Browser...			
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
	            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
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
	            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
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
	                weight_float = parseFloat(edge_input.weight), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
	                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    // The completely same edge should only be added once...
	                    continue;
	                }
	                else {
	                    var edge = graph.addEdge(edge_id, node, target_node, {
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
/* 11 */
/***/ function(module, exports) {

	/// <reference path="../../../typings/tsd.d.ts" />
	"use strict";
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
	            graphString += node.getID() + " ";
	            adj_nodes = node.reachNodes(mergeFunc);
	            // console.dir(adj_nodes);
	            for (var adj_idx in adj_nodes) {
	                adj_node = adj_nodes[adj_idx].node;
	                graphString += adj_node.getID() + " ";
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(13);
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


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(13);
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


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/tsd.d.ts" />
	"use strict";
	var $E = __webpack_require__(1);
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(13);
	var $BH = __webpack_require__(16);
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
	    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
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
	     * we take a standard eval function returning
	     * the weight of a successor edge
	     * This will later be replaced by a config option...
	     */
	    var evalPriority = function (ne) {
	        return ne.best;
	    };
	    /**
	     * we take a standard ID function returning
	     * the ID of a NeighborEntry's node
	     * This will later be replaced by a config option...
	     */
	    var evalObjID = function (ne) {
	        return ne.node.getID();
	    };
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
	        better_dist: Number.POSITIVE_INFINITY,
	    };
	    /**
	       * HOOK 1: PFS INIT
	       */
	    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
	    scope.OPEN_HEAP.insert(start_ne);
	    scope.OPEN[start_ne.node.getID()] = start_ne;
	    /**
	     * Main loop
	     */
	    while (scope.OPEN_HEAP.size()) {
	        // get currently best node
	        scope.current = scope.OPEN_HEAP.pop();
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
	             * HOOK 2: Goal node reached
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
	            if (scope.CLOSED[scope.next.node.getID()]) {
	                /**
	                 * HOOK 3: Goal node already closed
	                 */
	                config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
	                continue;
	            }
	            if (scope.OPEN[scope.next.node.getID()]) {
	                // First let's recover the previous best solution from our OPEN structure,
	                // as the node's neighborhood-retrieving function cannot know it...
	                scope.next.best = scope.OPEN[scope.next.node.getID()].best;
	                /**
	                 * HOOK 4: Goal node already visited, but not yet closed
	                 */
	                config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);
	                scope.better_dist = scope.current.best + scope.next.edge.getWeight();
	                if (scope.next.best > scope.better_dist) {
	                    /**
	                     * HOOK 5: Better path found
	                     */
	                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
	                    // HEAP operations are necessary for internal traversal,
	                    // so we handle them here in the main loop
	                    scope.OPEN_HEAP.remove(scope.next);
	                    scope.next.best = scope.better_dist;
	                    scope.OPEN_HEAP.insert(scope.next);
	                    scope.OPEN[scope.next.node.getID()].best = scope.better_dist;
	                }
	                continue;
	            }
	            // NODE NOT ENCOUNTERED
	            config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);
	            // HEAP operations are necessary for internal traversal,
	            // so we handle them here in the main loop
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
	        goal_node: null
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
	        context.next.best = context.current.best + context.next.edge.getWeight();
	        config.result[context.next.node.getID()] = {
	            distance: context.next.best,
	            parent: context.current.node,
	            counter: undefined
	        };
	    };
	    callbacks.not_encountered.push(notEncountered);
	    // Callback for when we find a better solution
	    var betterPathFound = function (context) {
	        config.result[context.next.node.getID()].distance = context.better_dist;
	        config.result[context.next.node.getID()].parent = context.current.node;
	    };
	    callbacks.better_path.push(betterPathFound);
	    return config;
	}
	exports.preparePFSStandardConfig = preparePFSStandardConfig;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/// <reference path="../../typings/tsd.d.ts" />
	"use strict";
	(function (BinaryHeapMode) {
	    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
	    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
	})(exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
	var BinaryHeapMode = exports.BinaryHeapMode;
	var BinaryHeap = (function () {
	    /**
	     * Mode of a min heap should only be set upon
	     * instantiation and never again afterwards...
	     * @param _mode MIN or MAX heap
	     * @param _evalPriority the evaluation function applied to
	     * all incoming objects to determine it's score
	     * @param _evalObjID function to determine the identity of
	     * the object we are looking for at removal etc..
	     */
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
	    /**
	     * Insert - Adding an object to the heap
	     * @param obj the obj to add to the heap
	     * @returns {number} the objects index in the internal array
	     */
	    BinaryHeap.prototype.insert = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error("Cannot insert object without numeric priority.");
	        }
	        this._array.push(obj);
	        this.setNodePosition(obj, this.size() - 1, false);
	        this.trickleUp(this.size() - 1);
	    };
	    /**
	     *
	     */
	    BinaryHeap.prototype.remove = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error('Object invalid.');
	        }
	        /**
	         * Search in O(1)
	         */
	        // var pos = this.getNodePosition(obj),
	        //     found = this._array[pos];
	        // if ( typeof found !== 'undefined' && found !== null ) {
	        //   var last = this._array.pop();
	        //   this.unsetNodePosition(found);
	        //   if ( this.size() ) {
	        //     this._array[pos] = last;
	        //     // update node position before trickling
	        //     this.setNodePosition(last, pos, true, this.size()); // old size after pop()..
	        //     this.trickleUp(pos);
	        //     this.trickleDown(pos);
	        //   }
	        //   return found;
	        // }
	        /**
	         * OLD SEARCH in O(n) (but simpler)
	         */
	        var objID = this._evalObjID(obj), found = undefined;
	        for (var pos = 0; pos < this._array.length; pos++) {
	            if (this._evalObjID(this._array[pos]) === objID) {
	                found = this._array[pos];
	                // we pop the last element
	                var last = this._array.pop();
	                // we switch the last with the found element
	                // and restore the heaps order, but only if the
	                // heap size is not down to zero
	                if (this.size()) {
	                    this._array[pos] = last;
	                    this.trickleUp(pos);
	                    this.trickleDown(pos);
	                }
	                return found;
	            }
	        }
	        // console.log("Found undefined object at position: " + pos);
	        return found;
	    };
	    BinaryHeap.prototype.trickleDown = function (i) {
	        var parent = this._array[i];
	        // run until we manually break
	        while (true) {
	            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
	            // check if left child exists
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
	            // we only have to swap one child, doesn't matter which one
	            this._array[i] = this._array[swap];
	            this._array[swap] = parent;
	            // correct position for later lookup in O(1)
	            this.setNodePosition(this._array[i], i, true, swap);
	            this.setNodePosition(this._array[swap], swap, true, i);
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
	                // correct position for later lookup in O(1)
	                this.setNodePosition(child, parent_idx, true, i);
	                this.setNodePosition(parent, i, true, parent_idx);
	                // next round...
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
	    BinaryHeap.prototype.setNodePosition = function (obj, new_pos, replace, old_pos) {
	        if (replace === void 0) { replace = true; }
	        if (typeof obj === 'undefined' || obj === null || typeof new_pos === 'undefined' || new_pos === null) {
	            throw new Error('minium required arguments are ojb and new_pos');
	        }
	        if (replace === true && (typeof old_pos === 'undefined' || old_pos === null)) {
	            throw new Error('replacing a node position requires an old_pos');
	        }
	        // First we create a new entry object
	        var pos_obj = {
	            priority: this.evalInputPriority(obj),
	            position: new_pos
	        };
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            // we can simply add the object to the hash...
	            this._positions[obj_key] = pos_obj;
	        }
	        else if (Array.isArray(occurrence)) {
	            // if we replace, we add the position object to the array
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
	            // we have a single object at this place...
	            // either we replace the droid or we give it some company ;)
	            if (replace) {
	                this._positions[obj_key] = pos_obj;
	            }
	            else {
	                this._positions[obj_key] = [occurrence, pos_obj];
	            }
	        }
	    };
	    /**
	     *
	     */
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
	            // lets find the droid we are looking for...
	            // we are of course looking for the smallest one ;)
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
	            // we have a single object at this place
	            if (typeof occurrence.position === 'undefined')
	                console.log('Occurrence position: undefined!');
	            return occurrence.position;
	        }
	    };
	    /**
	     * @param obj
	     * @returns {number}
	     */
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
	            // lets find the droid we are looking for...
	            // we are of course looking for the smallest one ;)
	            var node_idx = null, node = null, min = Number.POSITIVE_INFINITY;
	            for (var i = 0; i < occurrence.length; i++) {
	                if (occurrence[i].position < min) {
	                    node_idx = i;
	                    node = occurrence[i];
	                }
	            }
	            if (node) {
	                // remove the wanted droid (it's become useless...)
	                occurrence.splice(node_idx, 1);
	                // if only 1 droid remains, make him officially single!
	                if (occurrence.length === 1) {
	                    this._positions[obj_key] = occurrence[0];
	                }
	                if (typeof node.position === 'undefined')
	                    console.log('Node position: undefined!');
	                return node.position;
	            }
	        }
	        else {
	            // we have a single object at this place
	            delete this._positions[obj_key];
	            return occurrence.position;
	        }
	    };
	    return BinaryHeap;
	}());
	exports.BinaryHeap = BinaryHeap;


/***/ }
/******/ ]);