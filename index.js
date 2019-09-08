// CORE
const iCore										= require("./lib/core/interfaces");
// Base
const BaseEdge	      				= require("./lib/core/base/BaseEdge.js");
const BaseNode 	      				= require("./lib/core/base/BaseNode.js");
const BaseGraph	      				= require("./lib/core/base/BaseGraph.js");
// Typed
const TypedEdge	      				= require("./lib/core/typed/TypedEdge.js");
const TypedNode 	      				= require("./lib/core/typed/TypedNode.js");
const TypedGraph	      				= require("./lib/core/typed/TypedGraph.js");
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
// SIMILARITIES
const SimCommons							= require("./lib/similarities/SimilarityCommons");
const SetSims									= require("./lib/similarities/SetSimilarities");
const ScoreSims								= require("./lib/similarities/ScoreSimilarities");
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
		GraphMode								: iCore.GraphMode,
		DIR											: iCore.DIR,
		base: {
			BaseEdge 								: BaseEdge.BaseEdge,
			BaseNode 								: BaseNode.BaseNode,
			BaseGraph 							: BaseGraph.BaseGraph
		},
		typed: {
			TypedEdge								: TypedEdge.TypedEdge,
			TypedNode								: TypedNode.TypedNode,
			TypedGraph							: TypedGraph.TypedGraph
		}
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
	similarities: {
		Commons										: SimCommons,
		Sets											: SetSims,
		Score											: ScoreSims,
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
