import * as fs from "fs";
import {
	CSV_EGO_PATH,
	CSV_SN_PATH,
	RES_CENT_PATH,
	JSON_REC_PATH
} from "../config/test_paths";
import {Pagerank} from "../../src/centralities/Pagerank";
import {PagerankGauss} from '../../src/centralities/PagerankGauss';
import {DFS} from "../../src/search/DFS";
import {CSVInput, ICSVInConfig} from '../../src/io/input/CSVInput';

import {Logger} from '../../src/utils/Logger';
import {JSONInput} from "../../src/io/input/JSONInput";

const logger = new Logger();

const
	EPSILON = 1e-6,
	DIGITS = 6;

const
	sn_300_file = `social_network_edges_300.csv`,
	sn_1K_file = `social_network_edges_1K.csv`,
	sn_20K_file = `social_network_edges_20K.csv`,
	beerGraphFile = `${JSON_REC_PATH}/beerGraph.json`;

const std_csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};
const csv = new CSVInput(std_csv_config);
const PrGauss = new PagerankGauss();


/**
 * Checking against python / networkx implementation
 *
 * @todo figure out why the 20k graph shows significantly different results
 *       while the 300 & 1k graphs are at least OK with an epsilon = 1e-4
 * @todo Extract out into seperate performance test suite !!
 */
describe('Page Rank Random Walk performance tests on actual (small) social graphs - ', () => {
	[sn_300_file, sn_1K_file].forEach(graph_file => { //sn_300_file, sn_1K_file, sn_20K_file
		test('should calculate the PR via Random Walk for graphs of realistic size', () => {
			let sn_graph = csv.readFromEdgeListFile(CSV_SN_PATH + '/' + graph_file);
			let PR = new Pagerank(sn_graph, {
				epsilon: 1e-6, // limiting tolerance for speed, Numpy comparison works till 1e-15 !!!
				normalize: true
			});

			let start_node = sn_graph.getRandomNode();
			let dfs = DFS(sn_graph, start_node);
			logger.log(`Graph ${graph_file} consists of ${dfs.length} components.`);

			let tic = +new Date;
			let result;
			// for ( let i = 0; i < 1e2; i++ ) { // incredible speedup when executed 100 times !?!?
			result = PR.computePR();
			// }
			let toc = +new Date;
			logger.log(`Single-Thread JS PageRank (Arrays) on graph of |V|=${sn_graph.nrNodes()} and |E|=${sn_graph.nrUndEdges()} took ${toc - tic} ms.`);

			let controlFileName = `${RES_CENT_PATH}/pagerank/comparison_selected/pagerank_numpy_${graph_file}_results.json`;
			let nxControl = JSON.parse(fs.readFileSync(controlFileName).toString());

			// Length
			expect(Object.keys(result).length).toEqual(sn_graph.nrNodes());
			expect(Object.keys(result).length).toEqual(Object.keys(nxControl).length);
			// Structure
			expect(Object.keys(result)).toEqual(Object.keys(nxControl));
			// Content
			/**
			 * @todo the problem (at least with the ~20k graph) could lie in the fact that before normalization we get ridiculously heigh numbers (PR(n_i) ~ 2.5 !!!)
			 */
			let within_eps = 0;
			Object.keys(result).forEach(n => {
				if (result[n] <= nxControl[n] + EPSILON && result[n] >= nxControl[n] - EPSILON) {
					within_eps++;
				}
				expect(result[n]).toBeCloseTo(nxControl[n], DIGITS);
			});
			logger.log(`Got ${within_eps} pageranks out of ${sn_graph.nrNodes()} right.`);
		});
	});
});


describe('Page Rank Random Walk on ego graphs + comparison to networkx - ', () => {
	fs.readdirSync(CSV_EGO_PATH).forEach(graph_file => {

		test('should calculate the PR via Random Walk for EGO graphs of realistic size', () => {
			let sn_graph = csv.readFromEdgeListFile(CSV_EGO_PATH + '/' + graph_file);
			let PR = new Pagerank(sn_graph, {
				epsilon: 1e-15,
				normalize: true
			});

			let start_node = sn_graph.getRandomNode();
			let dfs = DFS(sn_graph, start_node);
			if (dfs.length > 1) {
				throw new Error('graph is DISCONNECTED - YMMV');
			}

			let tic = +new Date;
			let result = PR.computePR();
			let toc = +new Date;
			logger.log(`PageRank for graph of |V|=${sn_graph.nrNodes()} and |E|=${sn_graph.nrUndEdges()} took ${toc - tic} ms.`);

			let controlFileName = `${RES_CENT_PATH}/pagerank/comparison_ego_graphs/pagerank_numpy_ego_network_v_${sn_graph.nrNodes()}_e_${sn_graph.nrUndEdges() * 2}.json`;

			let nxControl = JSON.parse(fs.readFileSync(controlFileName).toString());
			expect(Object.keys(result).length).toEqual(sn_graph.nrNodes());
			expect(Object.keys(result).length).toEqual(Object.keys(nxControl).length);
			expect(Object.keys(result)).toEqual(Object.keys(nxControl));

			let within_eps = 0;
			Object.keys(result).forEach(n => {
				if (result[n] <= nxControl[n] + EPSILON && result[n] >= nxControl[n] - EPSILON) {
					within_eps++;
				}
				expect(result[n]).toBeCloseTo(nxControl[n], 15);
			});
			logger.log(`Got ${within_eps} pageranks out of ${sn_graph.nrNodes()} right.`);
		});
	});
});


describe('Neo4j beer graph (converted) - ', () => {

	it('should correctly compute the beer graph', () => {
		let graph = new JSONInput().readFromJSONFile(beerGraphFile);
		let pagerank = new Pagerank(graph, {
			epsilon: 1e-3,
			normalize: true
		});
		let tic = +new Date;
		pagerank.computePR();
		let toc = +new Date;
		logger.log(`PageRank for graph of |V|=${graph.nrNodes()} and |E|=${graph.nrDirEdges()} took ${toc - tic} ms.`)
	});

});


/*----------------------------------------*/
/*						OLD GAUSS TESTS							*/
/*----------------------------------------*/
/**
 * @todo 20k graph -> Heap out of memory...
 */
describe('PageRank Gauss performance tests - ', () => {

	[sn_300_file, sn_1K_file].forEach(graph_file => { // sn_20K_graph_file
		test('should calculate the PR with Gaussian Elimination for graphs of realistic size', () => {
			let sn_graph = csv.readFromEdgeListFile(CSV_SN_PATH + '/' + graph_file);
			let tic = +new Date;
			let pr = PrGauss.getCentralityMap(sn_graph);
			let toc = +new Date;
			logger.log(`PageRank Gaussian Elimination for ${graph_file} graph took ${toc - tic} ms.`);
			expect(Array.isArray(pr)).toBeTruthy;
		});

	});

});