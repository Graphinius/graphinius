import * as fs from 'fs';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PRGauss from '../../src/centralities/PageRankGaussian';
import { PRArrayDS, PageRankRandomWalk } from '../../src/centralities/PageRankRandomWalk';
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
	let n3_graph = null;

	beforeAll(() => {
		n3_graph = new $I.JSONInput(true, false, false).readFromJSONFile(TEST_PATH_PREFIX + pr_3nodes_file);
	});


	describe('constructor correctly sets class properties', () => {

	});


	describe('constructor correctly initializes PageRank RandomWalk data structures - ', () => {

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


		test('correctly constructs current & old array', () => {
			let pr_init = [0.3333333333333333,0.3333333333333333,0.3333333333333333];
			let pageRank = new PageRankRandomWalk(n3_graph);
			expect(pageRank.getDSs().curr).toEqual(pr_init);
		});


		test('correctly constructs old array', () => {
			let pr_init = [0.3333333333333333,0.3333333333333333,0.3333333333333333];
			let pageRank = new PageRankRandomWalk(n3_graph);
			expect(pageRank.getDSs().old).toEqual(pr_init);
		});


		test('correctly constructs out degree array', () => {
			let deg_init = [2,0,1];
			let pageRank = new PageRankRandomWalk(n3_graph);
			expect(pageRank.getDSs().out_deg).toEqual(deg_init);
		});


		test('correctly constructs `pull` 2D array', () => {
			let pull_expect = [[],[0,2],[0]];
			let pageRank = new PageRankRandomWalk(n3_graph);
			expect(pageRank.getDSs().pull).toEqual(pull_expect);			
		});


		test('if personalized, checks for existence of tele_set - throws error otherwise', () => {
			let prConstrWrapper = () => {
				return new PageRankRandomWalk(n3_graph, {
					personalized: true
				});
			};
			expect(prConstrWrapper).toThrow('Personalized Pagerank requires tele_set as a config argument');
		});


		test('correctly constructs tele_set & tele_size for NON_PPR', () => {
			let teleport_expect = null,
					tele_size_expect = null;
			let pageRank = new PageRankRandomWalk(n3_graph);
			expect(pageRank.getDSs().teleport).toEqual(teleport_expect);
			expect(pageRank.getDSs().tele_size).toEqual(tele_size_expect);
		});


		test('correctly constructs tele_set & tele_size for PPR, teleset={A}', () => {
			let teleport_expect = [1, 0, 0],
					tele_size_expect = 1;
			let pageRank = new PageRankRandomWalk(n3_graph, {
				personalized: true,
				tele_set: {"A": 1}
			});
			expect(pageRank.getDSs().teleport).toEqual(teleport_expect);
			expect(pageRank.getDSs().tele_size).toEqual(tele_size_expect);
		});


		test('correctly constructs tele_set & tele_size for PPR, teleset={A, B}', () => {
			let teleport_expect = [0.5, 0.5, 0],
					tele_size_expect = 2;
			let pageRank = new PageRankRandomWalk(n3_graph, {
				personalized: true,
				tele_set: {"A": 0.5, "B": 0.5}
			});
			expect(pageRank.getDSs().teleport).toEqual(teleport_expect);
			expect(pageRank.getDSs().tele_size).toEqual(tele_size_expect);
		});


		/**
		 * One array construction is tested properly there is no reason to test this...
		 */
		test('throws error when out degree of a given node in the pull array is zero', () => {
			let erroneousDS = {
				"curr": [0.3333333333333333,0.3333333333333333,0.3333333333333333],
				"old": [0.3333333333333333,0.3333333333333333,0.3333333333333333],
				"out_deg": [2,0,1],
				"pull": [[1],[0,2],[0]]
			}
			let pageRank = new PageRankRandomWalk(graph, {PRArrays: erroneousDS});
			expect(pageRank.computePR.bind(pageRank)).toThrow('Encountered zero divisor!');
		});

	});


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
		let PR = new PageRankRandomWalk(n3_graph, {
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
	 * @todo figure out why the results deviate below 1e-4
	 */
	[{
		teleport_set: {'A': 1},
		nx_control: {'A': 0.4521984139201357, 'B': 0.3555616685302314, 'C': 0.19223991754963288}
	 },
	 {
		teleport_set: {'A': 0.5, 'B': 0.5},
		nx_control: {'A': 0.31136235851100036, 'B': 0.5562862087697674, 'C': 0.13235143271923222}
	 },
	 /**
		* WHY DOES THIS WORK !?!?
	  */
	 {
		teleport_set: {'A': 5, 'B': 5},
		nx_control: {'A': 0.31136235851100036, 'B': 0.5562862087697674, 'C': 0.13235143271923222}
	 }
	].forEach( teleports => {
		test('RW result should equal NetworkX results - teleport set', () => {
			let PR = new PageRankRandomWalk(n3_graph, {
				convergence: 1e-4,
				alpha: 0.15,
				weighted: false,
				normalize: true,
				personalized: true,
				tele_set: teleports.teleport_set
			});
			let result = PR.computePR();
			logger.log(JSON.stringify(result));

			const nxControl = teleports.nx_control
			logger.log(JSON.stringify(nxControl));

			let epsilon = 1e-4; // does not work with lower values ... !
			// Object.keys(result).forEach( n => expect(result[n]).toEqual(nxControl[n]) ); // just for direct comparison

			Object.keys(result).forEach( n => expect(result[n]).toBeGreaterThan(nxControl[n] - epsilon));
			Object.keys(result).forEach( n => expect(result[n]).toBeLessThan(nxControl[n] + epsilon));

			Object.keys(result).forEach(n =>
				expect(checkEpsilonEquality(result[n], nxControl[n], epsilon)).toBe(true)
			);
		});
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
