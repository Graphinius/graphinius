
import * as $N from '../../src/core/base/BaseNode';
import * as $G from '../../src/core/base/BaseGraph';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';
import { CSVInput, ICSVInConfig } from '../../src/io/input/CSVInput';
import { BellmanFordDict, BellmanFordArray } from '../../src/search/BellmanFord';
import {CSV_SN_PATH, JSON_DATA_PATH} from '../config/config';

import { Logger } from '../../src/utils/Logger';
const logger = new Logger();

const csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};

const json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: false,
	weighted: true
};


let bf_graph_file = `${JSON_DATA_PATH}/bellman_ford.json`,
	bf_graph_neg_cycle_file = `${JSON_DATA_PATH}/negative_cycle.json`;


describe('GRAPH SEARCH Tests - Bellman Ford - ', () => {
	
	let json 							: JSONInput,
			csv								: CSVInput,
			bf_graph    			: $G.IGraph,
			bf_neg_cycle_graph: $G.IGraph,
      stats							: $G.GraphStats,
      // BF                : Function = BellmanFordDict,
			BF_expect     		: {} = {},
			// BF_neg_expect			: {} = {},
			BF_compute				: {} = {},
			BF_expect_array		: Array<number>,
			BF_compute_array	: any; // TODO refactor w.r.t union return type


	beforeAll(() => {
		json = new JSONInput(json_in_config);
		csv = new CSVInput(csv_config);
		bf_graph = json.readFromJSONFile(bf_graph_file);
		bf_neg_cycle_graph = json.readFromJSONFile(bf_graph_neg_cycle_file);
		BF_expect = { S: 0, A: 5, B: 5, C: 7, D: 9, E: 8 };
		BF_expect_array = [ 0, 5, 5, 7, 9, 8 ];
  });


	test('should correctly instantiate the test BF graph', () => {
		stats = bf_graph.getStats();
		expect(stats.nr_nodes).toBe(6);
		expect(stats.nr_dir_edges).toBe(8);
		expect(stats.nr_und_edges).toBe(0);
	});


	describe('Bellman Ford Sanity Checks Tests - ', () => {

		test('should reject an undefined or null graph', () => {
			expect(BellmanFordDict.bind(BellmanFordDict, undefined)).toThrowError('Graph as well as start node have to be valid objects.');
			expect(BellmanFordDict.bind(BellmanFordDict, null)).toThrowError('Graph as well as start node have to be valid objects.');
		});


		test('should reject an undefined or null start node', () => {
			let graph = new $G.BaseGraph('emptinius');
			expect(BellmanFordDict.bind(BellmanFordDict, graph, undefined)).toThrowError('Graph as well as start node have to be valid objects.');
			expect(BellmanFordDict.bind(BellmanFordDict, graph, null)).toThrowError('Graph as well as start node have to be valid objects.');
		});


		test('should refuse to search a graph without edges', () => {
			let graph = new $G.BaseGraph('emptinius');
			let node = graph.addNodeByID('firstus');
			expect(BellmanFordDict.bind(BellmanFordDict, graph, node)).toThrowError('Cowardly refusing to traverse a graph without edges.');
		});


		test('should reject an outside node', () => {
			let node = new $N.BaseNode('firstus');
			expect(BellmanFordDict.bind(BellmanFordDict, bf_graph, node)).toThrowError('Cannot start from an outside node.');
		});

	});


	/**
	 * @todo more test cases (directed, undirected, weighted, unweighted graphs)
	 */
	describe('BF Dict version tests - ', () => {
		
		test('should correctly compute distances from S within BF test graph', () => {
			BF_compute = BellmanFordDict(bf_graph, bf_graph.getNodeById("S")).distances;
			expect(BF_compute).toEqual(BF_expect);
		});

		/**
		 * Computing 'correct' distances with negative cycles makes no sense,
		 * since they are not even defined in finite time.
		 */

		test('BF should not detect any negative cycle in the bf graph', () => {
			expect(BellmanFordDict(bf_graph, bf_graph.getNodeById("S")).neg_cycle).toBe(false);
		});


		test('BF should detect the negative cycle in the bf_neg_cycle graph', () => {
			expect(BellmanFordDict(bf_neg_cycle_graph, bf_neg_cycle_graph.getNodeById("S")).neg_cycle).toBe(true);
		});

	});


	/**
	 * @todo more test cases (directed, undirected, weighted, unweighted graphs)
	 */
	describe('BF Array version tests - ', () => {

		test('should correctly compute dists for BF test graph', () => {
			BF_compute_array = BellmanFordArray(bf_graph, bf_graph.getNodeById("S")).distances;
			expect(BF_compute_array).toEqual(BF_expect_array);
		});


		test('BF should not detect any negative cycle in the bf graph', () => {
			expect(BellmanFordArray(bf_graph, bf_graph.getNodeById("S")).neg_cycle).toBe(false);
		});


		test('BF should detect the negative cycle in the bf_neg_cycle graph', () => {
			expect(BellmanFordArray(bf_neg_cycle_graph, bf_neg_cycle_graph.getNodeById("S")).neg_cycle).toBe(true);
		});

	});
  
});