// CORE
const Edges			      				= require("./lib/core/Edges.js");
const Nodes 		      				= require("./lib/core/Nodes.js");
const Graph 		      				= require("./lib/core/Graph.js");
// CENTRALITIES
const BetweennessCent					= require("./lib/centralities/Betweenness.js");
const BrandesCent							= require("./lib/centralities/Brandes");
const ClosenessCent	 					= require("./lib/centralities/Closeness.js");
const DegreeCent		 					= require("./lib/centralities/Degree.js");
const PagerankCent						= require("./lib/centralities/Pagerank.js");
// IO
const CSVInput 	      				= require("./lib/io/input/CSVInput.js");
const CSVOutput       				= require("./lib/io/output/CSVOutput.js");
const JSONInput       				= require("./lib/io/input/JSONInput.js");
const JSONOutput      				= require("./lib/io/output/JSONOutput.js");
// SEARCH
const BFS				      				= require("./lib/search/BFS.js");
const DFS				      				= require("./lib/search/DFS.js");
const PFS             				= require("./lib/search/PFS.js");
const Dijkstra								= require("./lib/search/Dijkstra");
const BellmanFord     				= require("./lib/search/BellmanFord.js");
const FloydWarshall						= require("./lib/search/FloydWarshall.js");
const Johnsons								= require("./lib/search/Johnsons.js");
// UTILS
const StructUtils     				= require("./lib/utils/StructUtils.js");
const RemoteUtils     				= require("./lib/utils/RemoteUtils.js");
const CallbackUtils   				= require("./lib/utils/CallbackUtils.js");
// DATASTRUCTS
const BinaryHeap      				= require("./lib/datastructs/BinaryHeap.js");
// PERTURBATION
const Perturb									= require("./lib/perturbation/SimplePerturbations.js");
// GENERATORS
const KronLeskovec						= require("./lib/generators/KroneckerLeskovec.js");
// MISC
// var MCMFBoykov							= require("./dist/mincutmaxflow/minCutMaxFlowBoykov.js");
// var PRGauss								= require("./lib/centralities/PageRankGaussian.js");


// Define global object
let out = typeof window !== 'undefined' ? window : global;

/**
 * Inside Global or Window object
 */
out.$G = {
	core: {
		BaseEdge 									: Edges.BaseEdge,
		BaseNode 									: Nodes.BaseNode,
		BaseGraph 								: Graph.BaseGraph,
		GraphMode									: Graph.GraphMode
	},
	centralities: {
		Betweenness								: BetweennessCent.betweennessCentrality,
		Brandes										: BrandesCent.Brandes,
		Closeness									: ClosenessCent.ClosenessCentrality,
		Degree										: DegreeCent.DegreeCentrality,
		Pagerank									: PagerankCent.Pagerank
	},							
	input: {							
		CSVInput 									: CSVInput.CSVInput,
		JSONInput 								: JSONInput.JSONInput
	},							
	output: {							
		CSVOutput									: CSVOutput.CSVOutput,
		JSONOutput								: JSONOutput.JSONOutput
	},
	search: {
		BFS												: BFS,
		DFS 											: DFS,
		PFS           						: PFS,
		Dijkstra									: Dijkstra,
		BellmanFord								: BellmanFord,
		FloydWarshall							: FloydWarshall,
		Johnsons									: Johnsons
	},						
  utils: {						
    Struct        						: StructUtils,
		Remote        						: RemoteUtils,
    Callback 									: CallbackUtils
  },
  datastructs: {
    BinaryHeap  							: BinaryHeap.BinaryHeap
  },
	perturbation: {
		SimplePerturber						: Perturb.SimplePerturber
	},
	generators: {
		Kronecker									: KronLeskovec.KROL
	},
	// mincut: {
	// 	MCMFBoykov							: MCMFBoykov.MCMFBoykov
	// },
};

/**
 * For NodeJS / CommonJS global object
 */
module.exports = out.$G;
