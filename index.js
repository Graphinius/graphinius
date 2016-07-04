var Edges			      = require("./dist/core/Edges.js");
var Nodes 		      = require("./dist/core/Nodes.js");
var Graph 		      = require("./dist/core/Graph.js");
var CSVInput 	      = require("./dist/io/input/CSVInput.js");
var JSONInput       = require("./dist/io/input/JSONInput.js");
var CSVOutput       = require("./dist/io/output/CSVOutput.js");
var BFS				      = require("./dist/search/BFS.js");
var DFS				      = require("./dist/search/DFS.js");
var PFS             = require("./dist/search/PFS.js");
var structUtils     = require("./dist/utils/structUtils.js");
var remoteUtils     = require("./dist/utils/remoteUtils.js");
var callbackUtils   = require("./dist/utils/callbackUtils.js");
var binaryHeap      = require("./dist/datastructs/binaryHeap.js");

// TODO:
// Encapsulate ALL functions within Graph for
// easier access and less import / new ceremony ??

var out = typeof window !== 'undefined' ? window : global;

/**
 * For Browser window object
 */
out.$G = {
	core: {
		BaseEdge 				: Edges.BaseEdge,
		BaseNode 				: Nodes.BaseNode,
		BaseGraph 			: Graph.BaseGraph,
		GraphMode		    : Graph.GraphMode
	},
	input: {
		CSVInput 		: CSVInput.CSVInput,
		JSONInput 	: JSONInput.JSONInput
	},
	output: {		
		CSVOutput		: CSVOutput.CSVOutput
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
  util: {
    struct          : structUtils,
    remote          : remoteUtils,
    callback        : callbackUtils
  },
  datastructs: {
    binaryHeap  : binaryHeap
  }
};

/**
 * For NodeJS / CommonJS global object
 */
module.exports = out.$G;
