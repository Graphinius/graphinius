var Edges			      = require("./dist/core/Edges.js");
var Nodes 		      = require("./dist/core/Nodes.js");
var Graph 		      = require("./dist/core/Graph.js");
var CSVInput 	      = require("./dist/io/input/CSVInput.js");
var CSVOutput       = require("./dist/io/output/CSVOutput.js");
var JSONInput       = require("./dist/io/input/JSONInput.js");
var JSONOutput      = require("./dist/io/output/JSONOutput.js");
var BFS				      = require("./dist/search/BFS.js");
var DFS				      = require("./dist/search/DFS.js");
var PFS             = require("./dist/search/PFS.js");
var structUtils     = require("./dist/utils/structUtils.js");
var remoteUtils     = require("./dist/utils/remoteUtils.js");
var callbackUtils   = require("./dist/utils/callbackUtils.js");
var randGen         = require("./dist/utils/randGenUtils.js");
var binaryHeap      = require("./dist/datastructs/binaryHeap.js");
var simplePerturbation = require("./dist/perturbation/SimplePerturbations.js");
var MCMFBoykov			= require("./dist/mincutmaxflow/minCutMaxFlowBoykov.js");
var degCent				 	= require("./dist/centralities/DegreeCentrality.js")

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
  util: {
    struct          : structUtils,
    remote          : remoteUtils,
    callback        : callbackUtils,
    randgen         : randGen
  },
  datastructs: {
    binaryHeap  : binaryHeap
  },
	perturbation: {
		simplePerturber: simplePerturbation.SimplePerturber
	}
};

/**
 * For NodeJS / CommonJS global object
 */
module.exports = out.$G;
