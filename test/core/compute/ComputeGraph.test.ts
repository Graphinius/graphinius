import * as $G from "../../../src/core/base/BaseGraph";
import {MinAdjacencyListArray, MinAdjacencyListDict, NextArray} from "../../../src/core/interfaces";
import {JSONInput} from "../../../src/io/input/JSONInput";
import {CSV_SN_PATH, JSON_DATA_PATH} from "../../config/test_paths";
import {CSVInput, ICSVInConfig} from "../../../src/io/input/CSVInput";
import {ComputeGraph} from "../../../src/core/compute/ComputeGraph";
import {BaseGraph} from "../../../src/core/base/BaseGraph";

let sn_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false
};

const small_graph_file = `${JSON_DATA_PATH}/small_graph.json`;



describe('Adjacency List / Hash Tests - ', () => {

	let
		g: $G.IGraph,
		cg: ComputeGraph,
		adj_list: MinAdjacencyListDict,
		expected_result: MinAdjacencyListDict,
		jsonReader = new JSONInput({explicit_direction: true, directed: false, weighted: true});


	beforeEach(() => {
		g = new $G.BaseGraph("testus");
		// g = jsonReader.readFromJSONFile(small_graph_file);
		cg = new ComputeGraph(g);
	});


	describe("Minimum Adjacency List generation Tests, DICT version - ", () => {

		test('should output an empty adjacency list for an empty graph', () => {
			g = new $G.BaseGraph("testus");
			cg = new ComputeGraph(g);
			expect(cg.adjListDict()).toEqual({});
		});


		test('should produce a non-empty adj.list for the small example graph', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListDict();
			expect(adj_list).not.toBeUndefined();
			expect(adj_list).not.toEqual({});
		});


		test('should produce the correct adj.list without incoming edges', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListDict(false);
			expected_result = {
				'A': { 'A': 7, 'B': 1, 'C': 0, 'D': -33 },
				'B': { 'A': 3 },
				'C': { 'A': 0 },
				'D': { 'A': 6 }
			};
			expect(adj_list).toEqual(expected_result);
		});


		test('should produce the correct adj.list including incoming edges', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListDict(true);
			expected_result = {
				'A': { 'A': 7, 'B': 1, 'C': 0, 'D': -33 },
				'B': { 'A': 1 },
				'C': { 'A': 0 },
				'D': { 'A': -33 }
			};
			expect(adj_list).toEqual(expected_result);
		});


		test('should produce the correct adj.list including incoming edges & implicit self connection',
			() => {
				g = jsonReader.readFromJSONFile(small_graph_file, g);
				adj_list = cg.adjListDict(true, true);
				expected_result = {
					'A': { 'A': 7, 'B': 1, 'C': 0, 'D': -33 },
					'B': { 'A': 1, 'B': 0 },
					'C': { 'A': 0, 'C': 0 },
					'D': { 'A': -33, 'D': 0 }
				};
				expect(adj_list).toEqual(expected_result);
			}
		);


		/**
		 * In a state machine, the distance of a node to itself could
		 * be set to 1 because the state would have to transition to itself...
		 */
		test('should produce the correct adj.list with specific self-dist', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListDict(true, true, 1);
			expected_result = {
				'A': { 'A': 1, 'B': 1, 'C': 0, 'D': -33 },
				'B': { 'A': 1, 'B': 1 },
				'C': { 'A': 0, 'C': 1 },
				'D': { 'A': -33, 'D': 1 }
			};
			expect(adj_list).toEqual(expected_result);
		});


		/**
		 * @todo what's the default for 'include_self'?
		 */
		test('should produce the correct adj.list considering default weights', () => {
			jsonReader = new JSONInput({explicit_direction: true, directed: false, weighted: false});
			g = jsonReader.readFromJSONFile(small_graph_file);
			cg = new ComputeGraph(g);
			adj_list = cg.adjListDict(true);
			expected_result = {
				'A': { 'A': 1, 'B': 1, 'C': 1, 'D': 1 },
				'B': { 'A': 1 },
				'C': { 'A': 1 },
				'D': { 'A': 1 }
			};
			expect(adj_list).toEqual(expected_result);
		});


		test('should produce the correct adj.list considering default weights', () => {
			jsonReader = new JSONInput({explicit_direction: true, directed: false, weighted: false});
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListDict(true, true);

			expected_result = {
				'A': { 'A': 1, 'B': 1, 'C': 1, 'D': 1 },
				'B': { 'A': 1, 'B': 0 },
				'C': { 'A': 1, 'C': 0 },
				'D': { 'A': 1, 'D': 0 }
			};
			expect(adj_list).toEqual(expected_result);
		});

	});


	/**
	 * @todo how to deal with negative loops?
	 */
	describe("Minimum Adjacency List generation Tests, ARRAY version", () => {

		let sn_300_graph_file = `${CSV_SN_PATH}/social_network_edges_300.csv`, graph: $G.IGraph,
			adj_list: MinAdjacencyListArray,
			sn_300_graph: $G.IGraph,
			expected_result: MinAdjacencyListArray,
			jsonReader = new JSONInput({explicit_direction: true, directed: false, weighted: true}),
			csvReader = new CSVInput(sn_config),
			inf = Number.POSITIVE_INFINITY;


		test('should output an empty adjacency list for an empty graph', () => {
			expected_result = [];
			g = new BaseGraph('emptinius');
			cg = new ComputeGraph(g);
			expect(cg.adjListArray()).toEqual(expected_result);
		});


		test('should produce a non-empty adj.list for the small example graph', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListArray();
			expect(adj_list).toBeDefined();
			expect(adj_list).not.toEqual([]);
		});


		test('should produce the correct adj.list without incoming edges', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListArray();
			expected_result = [
				[0, 1, 0, -33],
				[3, 0, inf, inf],
				[0, inf, 0, inf],
				[6, inf, inf, 0]
			];
			expect(adj_list).toEqual(expected_result);
		});


		test('should produce the correct adj.list including incoming edges', () => {
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListArray(true);
			expected_result = [
				[0, 1, 0, -33],
				[1, 0, inf, inf],
				[0, inf, 0, inf],
				[-33, inf, inf, 0]
			];
			expect(adj_list).toEqual(expected_result);
		});


		test('should produce the correct adj.list considering default weights', () => {
			jsonReader = new JSONInput({explicit_direction: true, directed: false, weighted: false});
			g = jsonReader.readFromJSONFile(small_graph_file, g);
			adj_list = cg.adjListArray(true);

			expected_result = [
				[0, 1, 1, 1],
				[1, 0, inf, inf],
				[1, inf, 0, inf],
				[1, inf, inf, 0]
			];
			expect(adj_list).toEqual(expected_result);
		});

	});


	describe('Next array generation for FW etc.', () => {

		let search_graph_file = `${JSON_DATA_PATH}/search_graph_multiple_SPs_positive.json`,
			sn_300_graph_file = `${CSV_SN_PATH}/social_network_edges_300.csv`,
			sn_300_graph: $G.IGraph,
			// TODO invent better name for next/adj_list
			next: NextArray,
			expected_result: MinAdjacencyListArray,
			csvReader = new CSVInput(sn_config),
			jsonReader = new JSONInput({explicit_direction: true, directed: false, weighted: true}),
			inf = Number.POSITIVE_INFINITY;


		test('should output an empty next array for an empty graph', () => {
			expected_result = [];
			expect(cg.adjListArray()).toEqual(expected_result);
		});


		test(
			'should produce a non-empty next array for the small example graph',
			() => {
				g = jsonReader.readFromJSONFile(small_graph_file, g);
				next = cg.nextArray();
				expect(next).toBeDefined();
				expect(next).not.toEqual([]);
			}
		);


		test('should produce the correct next array without incoming edges', () => {
			g = jsonReader.readFromJSONFile(search_graph_file, g);
			next = cg.nextArray();
			let expected_result = [
				[[0], [1], [2], [3], [null], [null]],
				[[0], [1], [2], [null], [4], [5]],
				[[0], [null], [2], [null], [4], [null]],
				[[null], [null], [2], [3], [4], [null]],
				[[null], [1], [null], [3], [4], [null]],
				[[null], [null], [2], [null], [4], [5]]];

			expect(next).toEqual(expected_result);
		});


		test('should produce the correct next array including incoming edges', () => {
			g = jsonReader.readFromJSONFile(search_graph_file, g);
			next = cg.nextArray(true);
			let expected_result = [
				[[0], [1], [2], [3], [null], [null]],
				[[0], [1], [2], [null], [4], [5]],
				[[0], [1], [2], [3], [4], [5]],
				[[0], [null], [2], [3], [4], [null]],
				[[null], [1], [2], [3], [4], [5]],
				[[null], [1], [2], [null], [4], [5]]];

			expect(next).toEqual(expected_result);
		});

	});

});
