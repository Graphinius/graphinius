import {CSV_SN_PATH} from "_/config/test_paths";
import * as $G from "@/core/base/BaseGraph";
import {CSVInput, ICSVInConfig} from "@/io/input/CSVInput";
import {BellmanFordArray, BellmanFordDict} from "@/traversal/BellmanFord";
import { Logger } from '@/utils/Logger';

const logger = new Logger();

const csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};

describe('Performance Tests - ', () => {

	let social_300_file = `${CSV_SN_PATH}/social_network_edges_300.csv`,
		social_1k_file = `${CSV_SN_PATH}/social_network_edges_1K.csv`,
		social_20k_file = `${CSV_SN_PATH}/social_network_edges_20K.csv`,
		sn_300_graph  		: $G.IGraph,
		sn_1k_graph				: $G.IGraph,
		sn_20k_graph 			: $G.IGraph;


	const csv = new CSVInput(csv_config);
	sn_300_graph = csv.readFromEdgeListFile(social_300_file);
	sn_1k_graph = csv.readFromEdgeListFile(social_1k_file);
	sn_20k_graph = csv.readFromEdgeListFile(social_20k_file);


	[sn_300_graph, sn_1k_graph].forEach( graph => { // , sn_20k_graph
		test(`BF performance test on social networks of realistic (client-side) size:` , () => {
			let tic = +new Date();
			const BF_dict = BellmanFordDict(graph, graph.getRandomNode());
			let toc = +new Date();
			logger.log(`BellmanFord DICT on graph of |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic } ms.`);

			tic = +new Date();
			const BF_array = BellmanFordArray(graph, graph.getRandomNode());
			toc = +new Date();
			logger.log(`BellmanFord ARRAY on graph of |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic } ms.`);
		});
	});

});
