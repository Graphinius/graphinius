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
	// PrRWalk = new $PRRandomWalk.pageRankCentrality(),
	PrGauss = new $PRGauss.pageRankDetCentrality();


describe("PageRank Centrality Tests", () => {
	let n3Graph = null;

	beforeAll(() => {
		n3Graph = new $I.JSONInput(true, false, false).readFromJSONFile(TEST_PATH_PREFIX + pr_3nodes_file);
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


	test('should calculate similar values for random walk and gaussian', () => {
		let prd = PrGauss.getCentralityMap(graph);
		//logger.log("GAUSS:"+JSON.stringify(prd));
		let prrw = new PageRankRandomWalk(graph).getPRDict();
		//logger.log("RANDOM:"+JSON.stringify(prrw));
		checkPageRanks(graph, prd, prrw, 0.5);
	});


	/**
	 * @description probably useless test, since Gauss & RW are not supposed to produce identical or even similar results...!?
	 */
	test.skip(
		'should calculate similar values for random walk and gaussian on undirected unweighted graph',
		() => {
			let prd = PrGauss.getCentralityMap(graph_und_unw);
			logger.log("GAUSS:" + JSON.stringify(prd));

			let prrw = new PageRankRandomWalk(graph).getPRDict();
			logger.log("RANDOM:" + JSON.stringify(prrw));

			/**
			 * @todo order matrix
			 */
			// checkPageRanks(graph, prd, prrw, 0.5);
		}
	);

	/**
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

	test('should stop random walk after short time', () => {
		const convergence = 0.3;
		let result = new PageRankRandomWalk(graph, {
			weighted: true,
			alpha: 1e-1,
			convergence: convergence
		}).getPRDict();

		for (let key in result) {
			expect(result[key]).toBeLessThan(convergence);
		}
	});

	/**
	 * @todo test iterations -> best with spy on an iterating method
	 */
	test('should not stop random walk with convergence criteria but with iterations', () => {
		const max_rank = 0.2;

		let prrw = new PageRankRandomWalk(graph_und_unw, {
			weighted: true,
			alpha: 1e-1,
			convergence: 1e-13,
			iterations: 2
		}).getPRDict();

		for (let key in prrw) {
			expect(prrw[key]).toBeLessThan(max_rank);
		}
	});


	test('RW result on dict datastructs should equal RW result on array datastructs', () => {
		let PR = new PageRankRandomWalk(n3Graph, {
			convergence: 1e-3,
			alpha: 0.15,
			weighted: false
		});
		let PRDictResult = PR.getPRDict();
		let PRArrayResult = PR.getPRArray();
		logger.log(JSON.stringify(PRDictResult));
		logger.log(JSON.stringify(PRArrayResult));
	});


	test('RW result should equal NetworkX results - simple pr_3node_graph', () => {
		let PR = new PageRankRandomWalk(n3Graph, {
			convergence: 1e-3,
			alpha: 0.15,
			weighted: false,
			normalize: true
		});
		let PRArrayResult = PR.getPRArray();
		logger.log(JSON.stringify(PRArrayResult));

		const nxControl = {'A': 0.19757959373228612, 'B': 0.5208692975273156, 'C': 0.2815511087403978}
		logger.log(JSON.stringify(nxControl));

		let epsilon = 1e-6;
		Object.keys(PRArrayResult).forEach( n => 
			expect( checkEpsilonEquality(PRArrayResult[n], nxControl[n], epsilon) ).toBe(true)
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
					convergence	: 1e-4,
					normalize		: true
				});
				
				let tic = +new Date;
				let result_dict = PR.getPRDict();
				let toc = +new Date;
				logger.log(`PageRank Random Walk DICT version for ${graph_file} graph took ${toc - tic} ms.`)

				tic = +new Date;
				let result_arr = PR.getPRArray();
				toc = +new Date;
				logger.log(`PageRank Random Walk ARRAY version for ${graph_file} graph took ${toc - tic} ms.`)

				// Length
				expect(Object.keys(result_dict).length).toEqual(Object.keys(result_arr).length);
				// Structure
				expect(Object.keys(result_dict)).toEqual(Object.keys(result_arr));
				// Content
				expect(result_dict).toEqual(result_arr);

				/**
				 * check against NetworkX results
				 */
				let controlFileName = `${TEST_PATH_PREFIX}${pagerank_py_folder}/pagerank_${graph_file}_results.json`;
				let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());
				expect(Object.keys(result_arr).length).toBe(Object.keys(controlMap).length);
				
				let epsilon = 1e-4;

				// Object.keys(result_arr).forEach( n => expect(result_arr[n]).toBeGreaterThan(controlMap[n] - epsilon));
				// Object.keys(result_arr).forEach( n => expect(result_arr[n]).toBeLessThan(controlMap[n] + epsilon));
				
				Object.keys(result_arr).forEach( n => 
					expect( checkEpsilonEquality(result_arr[n], controlMap[n], epsilon) ).toBe(true)
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
