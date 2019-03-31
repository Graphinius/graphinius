import * as fs from 'fs';

import * as $N from '../../../src/core/Nodes';
import * as $E from '../../../src/core/Edges';
import * as $G from '../../../src/core/Graph';
import * as $I from '../../../src/io/input/JSONInput';
import * as $C from './common';

let JSON_IN = $I.JSONInput;

let REAL_GRAPH_NR_NODES = 6204,
	REAL_GRAPH_NR_EDGES = 18550,
	small_graph = "./test/test_data/small_graph.json",
	small_graph_2N_flawed = "./test/test_data/small_graph_2N_flawed.json",
	small_graph_no_features = "./test/test_data/small_graph_no_features.json",
	small_graph_weights_crap = "./test/test_data/small_graph_weights_crap.json",
	real_graph = "./test/test_data/real_graph.json",
	extreme_weights_graph = "./test/test_data/extreme_weights_graph.json";

const DEFAULT_WEIGHT: number = 1;


describe('GRAPH JSON INPUT TESTS', () => {

	var json: $I.IJSONInput,
		input_file: string,
		graph: $G.IGraph,
		stats: $G.GraphStats;

	describe('Basic instantiation tests - ', () => {

		test('should correctly instantiate a default version of JSONInput', () => {
			json = new JSON_IN();
			expect(json).toBeInstanceOf(JSON_IN);
			expect(json._explicit_direction).toBe(true);
			expect(json._direction).toBe(false);
			expect(json._weighted_mode).toBe(false);
		});

		test('should correclty set modes of JSONInput', () => {
			json = new JSON_IN(false, true, true);
			expect(json).toBeInstanceOf(JSON_IN);
			expect(json._explicit_direction).toBe(false);
			expect(json._direction).toBe(true);
			expect(json._weighted_mode).toBe(true);
		});

	});


	describe('Small test graph', () => {

		test(
			'should correctly generate our small example graph out of a JSON file with explicitly encoded edge directions',
			() => {
				json = new JSON_IN();
				graph = json.readFromJSONFile(small_graph);
				$C.checkSmallGraphStats(graph);
			}
		);


		test(
			'should correctly generate our small example graph out of a JSON file with direction _mode set to undirected',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = false;
				graph = json.readFromJSONFile(small_graph);
				expect(graph.nrNodes()).toBe(4);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(4);
			}
		);


		test(
			'should correctly generate our small example graph out of a JSON file with direction _mode set to directed',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = true;
				graph = json.readFromJSONFile(small_graph);
				expect(graph.nrNodes()).toBe(4);
				expect(graph.nrDirEdges()).toBe(7);
				expect(graph.nrUndEdges()).toBe(0);
			}
		);

	});


	describe('Real graph from JSON', () => {

		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 undirected nodes.
		 */
		test(
			'should construct a real sized graph from an edge list with edges set to undirected',
			() => {
				json = new JSON_IN();
				graph = json.readFromJSONFile(real_graph);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(REAL_GRAPH_NR_NODES);
				expect(stats.nr_dir_edges).toBe(0);
				expect(stats.nr_und_edges).toBe(REAL_GRAPH_NR_EDGES);
				expect(stats.mode).toBe($G.GraphMode.UNDIRECTED);
			}
		);


		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 directed nodes.
		 */
		test(
			'should construct a real sized graph from an edge list with edges set to directed',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = true;
				graph = json.readFromJSONFile(real_graph);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(REAL_GRAPH_NR_NODES);
				expect(stats.nr_dir_edges).toBe(REAL_GRAPH_NR_EDGES);
				expect(stats.nr_und_edges).toBe(0);
				expect(stats.mode).toBe($G.GraphMode.DIRECTED);
			}
		);


		/**
		 * PERFORMANCE test case - see how long it takes to mutilate graph...
		 */
		test(
			'should mutilate a graph (delte nodes) until it is completely empty - in a performant way',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = false;
				graph = json.readFromJSONFile(real_graph);

				var nr_nodes = graph.nrNodes();
				while (nr_nodes--) {
					graph.deleteNode(graph.getNodeById(String(nr_nodes)));
				}
				expect(graph.nrNodes()).toBe(0);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
			}
		);

	});


	/**
	 * Test for coordinates - take the 'small_graph.json'
	 * which contains x, y, z coords and check for their
	 * exact values upon instantiation (cloning?)
	 */
	describe('Node coordinates - ', () => {

		test(
			'should correctly read the node coordinates contained in a json file',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = false;
				graph = json.readFromJSONFile(small_graph);
				$C.checkSmallGraphCoords(graph);
			}
		);


		test(
			'should not assign the coords feature if no coordinates are contained in a json file',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = false;
				graph = json.readFromJSONFile(small_graph_no_features);
				var nodes = graph.getNodes();
				for (var node_idx in nodes) {
					expect(nodes[node_idx].getFeature("coords")).toBeUndefined();
				}
			}
		);

	});


	/**
   * Test for features - take the 'small_graph.json'
   * which contains some feature vectors and check for their
   * exact values upon instantiation (cloning?)
   */
	describe('Node features - ', () => {

		test(
			'should correctly read the node features contained in a json file',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = false;
				graph = json.readFromJSONFile(small_graph);
				$C.checkSmallGraphFeatures(graph);
			}
		);


		test(
			'should not assign any features if no features entry is contained in a json file',
			() => {
				json = new JSON_IN();
				json._explicit_direction = false;
				json._direction = false;
				graph = json.readFromJSONFile(small_graph_no_features);
				var nodes = graph.getNodes();
				for (var node_idx in nodes) {
					expect( Object.keys( nodes[node_idx].getFeatures() ).length ).toBe(0);
				}
			}
		);

	});


	/**
	 * Test for weights - take the 'small_graph_weights.json'
	 * which contains weights for each edge and check for their
	 * exact (number) values upon instantiation
	 */
	describe('Edge weights - ', () => {

		beforeEach(() => {
			json = new JSON_IN();
			json._explicit_direction = true;
		});


		test('should correctly read the edge weights contained in a json file', () => {
			json._weighted_mode = true;
			graph = json.readFromJSONFile(small_graph);
			$C.checkSmallGraphEdgeWeights(graph);
		});


		test(
			'should correctly set edge weights to undefined if in unweighted _mode',
			() => {
				json._weighted_mode = false;
				graph = json.readFromJSONFile(small_graph);
				var und_edges = graph.getUndEdges();
				for (var edge in und_edges) {
					expect(graph.getEdgeById(edge).isWeighted()).toBe(false);
					expect(graph.getEdgeById(edge).getWeight()).toBeUndefined();
				}
				var dir_edges = graph.getDirEdges();
				for (var edge in dir_edges) {
					expect(graph.getEdgeById(edge).isWeighted()).toBe(false);
					expect(graph.getEdgeById(edge).getWeight()).toBeUndefined();
				}
			}
		);


		test(
			'should correctly set edge weights to default of 1 if info contained in json file is crappy',
			() => {
				json._weighted_mode = true;
				graph = json.readFromJSONFile(small_graph_weights_crap);
				var und_edges = graph.getUndEdges();
				for (var edge in und_edges) {
					expect(graph.getEdgeById(edge).isWeighted()).toBe(true);
					expect(graph.getEdgeById(edge).getWeight()).toBe(1);
				}
				var dir_edges = graph.getDirEdges();
				for (var edge in dir_edges) {
					expect(graph.getEdgeById(edge).isWeighted()).toBe(true);
					expect(graph.getEdgeById(edge).getWeight()).toBe(1);
				}
			}
		);


		describe('should be able to handle extreme edge weight cases', () => {

			beforeEach(() => {
				json._weighted_mode = true;
				graph = json.readFromJSONFile(extreme_weights_graph);
			})


			test(
				'should correctly set edge weight of "undefined" to DEFAULT_WEIGHT of 1',
				() => {
					expect(graph.getEdgeById("A_A_d").getWeight()).toBe(DEFAULT_WEIGHT);
				}
			);


			test(
				'should correctly set edge weight of "Infinity" to Number.POSITIVE_INFINITY',
				() => {
					expect(graph.getEdgeById("A_B_d").getWeight()).toBe(Number.POSITIVE_INFINITY);
				}
			);


			test(
				'should correctly set edge weight of "-Infinity" to Number.NEGATIVE_INFINITY',
				() => {
					expect(graph.getEdgeById("A_C_d").getWeight()).toBe(Number.NEGATIVE_INFINITY);
				}
			);


			test('should correctly set edge weight of "MAX" to Number.MAX_VALUE', () => {
				expect(graph.getEdgeById("A_D_d").getWeight()).toBe(Number.MAX_VALUE);
			});


			test('should correctly set edge weight of "MIN" to Number.MIN_VALUE', () => {
				expect(graph.getEdgeById("A_E_d").getWeight()).toBe(Number.MIN_VALUE);
			});

		});

	});

	describe('FLAWED graphs - ', () => {

		test('should throw an Error if the JSON file contains duplicate undirected edges with different weights', () => {
			json = new JSON_IN(true, false, true);
			let flawed_graph_duplicate_und_edge_diff_weights = JSON.parse(fs.readFileSync(small_graph_2N_flawed).toString());
			expect( json.readFromJSON.bind(json, flawed_graph_duplicate_und_edge_diff_weights) )
				.toThrow('Input JSON flawed! Found duplicate edge with different weights!');				
		});

	});

});
