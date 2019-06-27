let Edges			      = require("./lib/core/Edges.js");
let Nodes 		      = require("./lib/core/Nodes.js");
let Graph 		      = require("./lib/core/Graph.js");
let CSVInput 	      = require("./lib/io/input/CSVInput.js");
let CSVOutput       = require("./lib/io/output/CSVOutput.js");
let JSONInput       = require("./lib/io/input/JSONInput.js");
let JSONOutput      = require("./lib/io/output/JSONOutput.js");
let BFS				      = require("./lib/search/BFS.js");
let DFS				      = require("./lib/search/DFS.js");
let PFS             = require("./lib/search/PFS.js");
let BellmanFord     = require("./lib/search/BellmanFord.js");
let FloydWarshall		= require("./lib/search/FloydWarshall.js");
let structUtils     = require("./lib/utils/structUtils.js");
let remoteUtils     = require("./lib/utils/remoteUtils.js");
let callbackUtils   = require("./lib/utils/callbackUtils.js");
let binaryHeap      = require("./lib/datastructs/binaryHeap.js");
let simplePerturbation = require("./lib/perturbation/SimplePerturbations.js");
// let MCMFBoykov			= require("./dist/mincutmaxflow/minCutMaxFlowBoykov.js");
let DegreeCent		 	= require("./lib/centralities/Degree.js");
let ClosenessCent	 	= require("./lib/centralities/Closeness.js");
let BetweennessCent	= require("./lib/centralities/Betweenness.js");
let PR							= require("./lib/centralities/Pagerank.js");
let kronLeskovec		= require("./lib/generators/kroneckerLeskovec.js");


// Define global object
let out = typeof window !== 'undefined' ? window : global;

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
		PageRank: PR.Pagerank
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
