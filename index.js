var Edges			= require("./dist/core/Edges.js");
var Nodes 		= require("./dist/core/Nodes.js");
var Graph 		= require("./dist/core/Graph.js");
var CsvInput 	= require("./dist/input/CSVInput.js");
var JsonInput = require("./dist/input/JSONInput.js");
var BFS				= require("./dist/search/BFS.js");
var DFS				= require("./dist/search/DFS.js");

// TODO:
// Encapsulate ALL functions within Graph for
// easier access and less import / new ceremony ??

var out = typeof window !== 'undefined' ? window : global;

out.$G = {
	core: {
		Edge 				: Edges.BaseEdge,
		Node 				: Nodes.BaseNode,
		Graph 			: Graph.BaseGraph
	},
	input: {
		CsvInput 		: CsvInput.CSVInput,
		JsonInput 	: JsonInput.JSONInput
	},
	search: {
		BFS													   : BFS.BFS,
		DFS 												   : DFS.DFS,
		DFSVisit										   : DFS.DFSVisit,
		prepareDFSStandardConfig			 : DFS.prepareDFSStandardConfig,
		prepareDFSVisitStandardConfig	 : DFS.prepareDFSVisitStandardConfig
	}
};

module.exports = {
	$G : out.$G
};
