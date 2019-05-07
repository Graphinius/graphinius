import * as fs from 'fs';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PRGauss from '../../src/centralities/PageRankGaussian';
import { PageRankRandomWalk } from '../../src/centralities/PageRankRandomWalk';
import * as $CSV from '../../src/io/input/CSVInput';
import { Logger } from '../../src/utils/logger';

const logger = new Logger();
const EPSILON = 1e-7;

const TEST_PATH_PREFIX = "./test/test_data/",
	PATH_PREFIX_CENTRALITIES = TEST_PATH_PREFIX + "centralities/";

let csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
	json: $I.IJSONInput = new $I.JSONInput(true, false, true),
	deg_cent_graph = `search_graph_pfs_extended.json`,
	pr_3nodes_file = `centralities/3node2SPs1direct.json`,
	sn_300_file = `social_network_edges_300.csv`,
	sn_1K_file = `social_network_edges_1K.csv`,
	sn_20K_file = `social_network_edges_20K.csv`,
	graph_unweighted_undirected = `network_undirected_unweighted.csv`,
	pagerank_py_folder = `centralities/pagerank`,
	graph: $G.IGraph = json.readFromJSONFile(TEST_PATH_PREFIX + deg_cent_graph),
	graph_und_unw = csv.readFromEdgeListFile(TEST_PATH_PREFIX + graph_unweighted_undirected),
	PrGauss = new $PRGauss.pageRankDetCentrality();


describe("PageRank Centrality Tests", () => {
	let n3Graph = null;

	beforeAll(() => {
		n3Graph = new $I.JSONInput(true, false, false).readFromJSONFile(TEST_PATH_PREFIX + pr_3nodes_file);
	});


	describe('constructor correctly sets class properties', () => {

	});


	describe('correctly constructs PageRank RandomWalk data structures - ', () => {

		test('correctly initialized PageRank configuration from default values', () => {
			let PR = new PageRankRandomWalk(graph);
			expect(PR.getConfig()).toEqual({
				_weighted: false,
				_alpha: 0.15,
				_maxIterations: 1e3,
				_convergence: 1e-4,
				_normalize: false,
				_init: 1 / graph.nrNodes()
			});
		});

		test.todo('correctly constructs current array')

		test.todo('correctly constructs old array')

		test.todo('correctly constructs out degree array');

		test.todo('correctly constructs `pull` 2D array');


		/**
		 * If array construction is tested properly there is no reason to test this...
		 */
		test('throws error when out degree of a given node in the pull array is zero', () => {
			let erroneousDS = {
				"curr":[0.3333333333333333,0.3333333333333333,0.3333333333333333],
				"old":[0.3333333333333333,0.3333333333333333,0.3333333333333333],
				"outDeg":[2,0,1],
				"pull":[[1],[0,2],[0]]
			}
			let pageRank = new PageRankRandomWalk(graph, {PRArrays: erroneousDS});
			expect(pageRank.computePR.bind(pageRank)).toThrow('Encountered zero divisor!');
		});

	});


	test('should return correct betweenness map', () => {
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



	// test.skip('should calculate similar values for random walk and gaussian', () => {
	// 	let prd = PrGauss.getCentralityMap(graph);
	// 	let prrw = new PageRankRandomWalk(graph, {normalize: true}).computePR();

	// 	logger.log("GAUSS:"+JSON.stringify(prd));
	// 	logger.log("RANDOM:"+JSON.stringify(prrw));
	// 	checkPageRanks(graph, prd, prrw, 0.5);
	// });


	// /**
	//  * @description probably useless test, since Gauss & RW are not supposed to produce identical or even similar results...!?
	//  */
	// test.skip(
	// 	'should calculate similar values for random walk and gaussian on undirected unweighted graph',
	// 	() => {
	// 		let result_gauss = PrGauss.getCentralityMap(graph_und_unw);
	// 		logger.log("GAUSS:" + JSON.stringify(result_gauss));

	// 		let result_rw = new PageRankRandomWalk(graph_und_unw, {normalize: true}).computePR();
	// 		logger.log("RANDOM:" + JSON.stringify(result_rw));

	// 		checkPageRanks(graph_und_unw, result_rw, result_gauss, 0.5);
	// 	}
	// );


	/**
	 * What is this supposed to be doing !?
	 * same === correct !?
	 */
	test('should return the same centrality score for each node. Tested on graphs with 2, 3 and 6 nodes respectively.', () => {
		let graph_2 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_2.csv");
		let graph_3 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_3.csv");
		let graph_6 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_6.csv");
		checkRankPrecision(graph_2, PrGauss.getCentralityMap(graph_2));
		checkRankPrecision(graph_3, PrGauss.getCentralityMap(graph_3));
		checkRankPrecision(graph_6, PrGauss.getCentralityMap(graph_6));
	}
	);


	/**
	 * It's not testing for what the title says...
	 * 
	 * @todo how to measure 'short time'?
	 */
	test('should stop random walk after few iterations', () => {
		const convergence = 0.3;

		let pagerank = new PageRankRandomWalk(graph, {
			// weighted: true,
			alpha: 1e-1,
			convergence: convergence
		}).computePR();

		for (let key in pagerank) {
			expect(pagerank[key]).toBeLessThan(convergence);
		}
	});


	/**
	 * @todo test iterations -> best with spy on an iterating method
	 */
	test('should not stop random walk with convergence criteria but with iterations', () => {
		const max_rank = 0.2;

		let pagerank = new PageRankRandomWalk(graph_und_unw, {
			// weighted: true,
			alpha: 1e-1,
			convergence: 1e-13,
			iterations: 2
		}).computePR();

		for (let key in pagerank) {
			expect(pagerank[key]).toBeLessThan(max_rank);
		}
	});


	test('RW result should equal NetworkX results - simple pr_3node_graph', () => {
		let PR = new PageRankRandomWalk(n3Graph, {
			convergence: 1e-3,
			alpha: 0.15,
			weighted: false,
			normalize: true
		});
		let PRArrayResult = PR.computePR();
		logger.log(JSON.stringify(PRArrayResult));

		const nxControl = { 'A': 0.19757959373228612, 'B': 0.5208692975273156, 'C': 0.2815511087403978 }
		logger.log(JSON.stringify(nxControl));

		let epsilon = 1e-6;
		Object.keys(PRArrayResult).forEach(n =>
			expect(checkEpsilonEquality(PRArrayResult[n], nxControl[n], epsilon)).toBe(true)
		);
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
	describe('Page Rank Random Walk performance comparison DICT / ARRAY verion - ', () => {
		[sn_300_file, sn_1K_file].forEach(graph_file => { //sn_300_file, sn_1K_file, sn_20K_file
			test('should calculate the PR via Random Walk for graphs of realistic size', () => {
				let sn_graph = csv.readFromEdgeListFile(TEST_PATH_PREFIX + graph_file);
				let PR = new PageRankRandomWalk(sn_graph, {
					convergence: 1e-4,
					normalize: true
				});

				let tic = +new Date;
				let result_arr = PR.computePR();
				let toc = +new Date;
				logger.log(`PageRank Random Walk ARRAY version for ${graph_file} graph took ${toc - tic} ms.`)

				let controlFileName = `${TEST_PATH_PREFIX}${pagerank_py_folder}/pagerank_${graph_file}_results.json`;
				let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

				// Length
				expect(Object.keys(result_arr).length).toEqual(sn_graph.nrNodes());
				expect(Object.keys(result_arr).length).toBe(Object.keys(controlMap).length);
				// Structure
				expect(Object.keys(result_arr)).toEqual(Object.keys(controlMap));
				// Content
				let epsilon = 1e-4;

				// Object.keys(result_arr).forEach( n => expect(result_arr[n]).toBeGreaterThan(controlMap[n] - epsilon));
				// Object.keys(result_arr).forEach( n => expect(result_arr[n]).toBeLessThan(controlMap[n] + epsilon));

				Object.keys(result_arr).forEach(n =>
					expect(checkEpsilonEquality(result_arr[n], controlMap[n], epsilon)).toBe(true)
				);
			});
		});


		[sn_300_file, sn_1K_file].forEach(graph_file => { // sn_20K_graph_file => HEAP out of memory...!
			test.skip('should calculate the PR with Gaussian Elimination for graphs of realistic size', () => {
				let sn_graph = csv.readFromEdgeListFile(graph_file);
				let tic = +new Date;
				let pr = PrGauss.getCentralityMap(sn_graph);
				let toc = +new Date;
				logger.log(`PageRank Gaussian Elimination for ${graph_file} graph took ${toc - tic} ms.`)
				expect(Array.isArray(pr)).toBeTruthy;
			});

		});

	});

});


function checkEpsilonEquality(a: number, b: number, epsilon: number) {
	return Math.abs(a - b) <= epsilon;
}


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

/**
 * @todo probably useless -> eliminte?
 */
function checkPageRanks(graph, gauss, rand_walk, threshold) {
	let ctr = 0;
	for (let key in graph.getNodes()) {
		expect(posMin(gauss[ctr++], rand_walk[key]) < threshold).toBe(true);
		// ctr++;
	}
}

/**
 * @todo probably useless -> eliminte?
 */
function posMin(a: number, b: number): number {
	return (a > b) ? (a - b) : (b - a);
}
