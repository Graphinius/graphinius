var Edges			      = require("./lib/core/Edges.js");
var Nodes 		      = require("./lib/core/Nodes.js");
var Graph 		      = require("./lib/core/Graph.js");
var CSVInput 	      = require("./lib/io/input/CSVInput.js");
var CSVOutput       = require("./lib/io/output/CSVOutput.js");
var JSONInput       = require("./lib/io/input/JSONInput.js");
var JSONOutput      = require("./lib/io/output/JSONOutput.js");
var BFS				      = require("./lib/search/BFS.js");
var DFS				      = require("./lib/search/DFS.js");
var PFS             = require("./lib/search/PFS.js");
var BellmanFord     = require("./lib/search/BellmanFord.js");
var FloydWarshall		= require("./lib/search/FloydWarshall.js");
var structUtils     = require("./lib/utils/structUtils.js");
var remoteUtils     = require("./lib/utils/remoteUtils.js");
var callbackUtils   = require("./lib/utils/callbackUtils.js");
var binaryHeap      = require("./lib/datastructs/binaryHeap.js");
var simplePerturbation = require("./lib/perturbation/SimplePerturbations.js");
// var MCMFBoykov			= require("./dist/mincutmaxflow/minCutMaxFlowBoykov.js");
var DegreeCent		 	= require("./lib/centralities/Degree.js");
var ClosenessCent	 	= require("./lib/centralities/Closeness.js");
var BetweennessCent	= require("./lib/centralities/Betweenness.js");
// var PRGauss					= require("./lib/centralities/PageRankGaussian.js");
var pagerank		= require("./lib/centralities/PageRankRandomWalk.js");
var kronLeskovec		= require("./lib/generators/kroneckerLeskovec.js");


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
		// PageRankGauss: PRGauss,
		PageRankRandWalk: pagerank
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
	// mincut: {
	// 	MCMFBoykov										 : MCMFBoykov.MCMFBoykov
	// },
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
