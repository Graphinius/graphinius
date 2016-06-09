var Edges			= require("./dist/core/Edges.js");
var Nodes 		= require("./dist/core/Nodes.js");
var Graph 		= require("./dist/core/Graph.js");
var CsvInput 	= require("./dist/io/input/CSVInput.js");
var JsonInput = require("./dist/io/input/JSONInput.js");
var CsvOutput = require("./dist/io/output/CSVOutput.js");
var BFS				= require("./dist/search/BFS.js");
var DFS				= require("./dist/search/DFS.js");
var PFS       = require("./dist/search/PFS.js");

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
		JsonInput 	: JsonInput.JSONInput,
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
