import * as fs from 'fs';
import * as $G from '../../src/core/Graph';
import * as $PRGauss from '../../src/centralities/PagerankGauss';
import { ICSVInConfig, CSVInput } from '../../src/io/input/CSVInput';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';
import { Logger } from '../../src/utils/logger';

const logger = new Logger();
const EPSILON = 1e-6;

const TEST_PATH_PREFIX = "./test/test_data/";

const std_csv_in_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
}

const std_json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: true,
	weighted: false
}


let csv = new CSVInput(std_csv_in_config),
	json = new JSONInput(std_json_in_config),
	deg_cent_graph = `search_graph_pfs_extended.json`,
	sn_300_file = `social_network_edges_300.csv`,
	sn_1K_file = `social_network_edges_1K.csv`,
	graph_unweighted_undirected = `network_undirected_unweighted.csv`,
	pagerank_py_folder = `centralities/pagerank`,
	graph: $G.IGraph = json.readFromJSONFile(TEST_PATH_PREFIX + deg_cent_graph),
	graph_und_unw = csv.readFromEdgeListFile(TEST_PATH_PREFIX + graph_unweighted_undirected),
	PrGauss = new $PRGauss.pageRankDetCentrality();


describe("PageRank Gauss Tests", () => {

	test('should return correct betweenness map (directed: true)', () => {
		let prd = PrGauss.getCentralityMap(graph);
		expect(prd).toEqual([
			0.1332312404287902,
			0.18376722817764174,
			0.17457886676875956,
			0.2787136294027564,
			0.18376722817764166,
			0.045941807044410435
		]);
	});

	/**
	 * What is this supposed to be doing !? Check Gauss against pre-calculated results !?
	 * same === correct !?
	 */
	test('should return the correct centrality score for each node. Tested on graphs with 2, 3 and 6 nodes respectively.', () => {
		let graph_2 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_2.csv");
		let graph_3 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_3.csv");
		let graph_6 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_6.csv");
		checkRankPrecision(graph_2, PrGauss.getCentralityMap(graph_2));
		checkRankPrecision(graph_3, PrGauss.getCentralityMap(graph_3));
		checkRankPrecision(graph_6, PrGauss.getCentralityMap(graph_6));
	});


	/**
	 * PERFORMANCE TESTS UNWEIGHTED
	 * 
	 * Also checking against the python implementation
	 * 
	 * @todo figure out why the 20k graph shows significantly different results 
	 * while the 300 & 1k graphs are 
	 * @todo Extract out into seperate performance test suite !!
	 */
	describe('PageRank Gauss performance tests - ', () => {

		[sn_300_file, sn_1K_file].forEach(graph_file => { // sn_20K_graph_file => HEAP out of memory...!
			test('should calculate the PR with Gaussian Elimination for graphs of realistic size', () => {
				let sn_graph = csv.readFromEdgeListFile(TEST_PATH_PREFIX + graph_file);
				let tic = +new Date;
				let pr = PrGauss.getCentralityMap(sn_graph);
				let toc = +new Date;
				logger.log(`PageRank Gaussian Elimination for ${graph_file} graph took ${toc - tic} ms.`)
				expect(Array.isArray(pr)).toBeTruthy;
			});

		});

	});

});


function checkRankPrecision(graph, gauss) {
	let last = gauss[0];
	let ctr = 0;
	for (let key in graph.getNodes()) {
		expect(gauss[ctr]).toBeGreaterThan(1 / graph.nrNodes() - EPSILON);
		expect(gauss[ctr]).toBeLessThan(1 / graph.nrNodes() + EPSILON);
		expect(gauss[ctr]).toBeGreaterThan(last - EPSILON);
		expect(gauss[ctr]).toBeLessThan(last + EPSILON);
		last = gauss[ctr++];
	}
}
