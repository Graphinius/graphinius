import {GraphMode, GraphStats} from '../../../lib/core/interfaces';
import * as $G from '../../../lib/core/base/BaseGraph';
import * as $I from '../../../lib/io/input/CSVInput';
import * as $C from './common';
import {CSV_DATA_PATH, CSV_ERR_PATH} from "../../config/test_paths";

let CSV = $I.CSVInput;


describe('GRAPH CSV INPUT TESTS', () => {

	let csv: $I.ICSVInput,
		sep: string,
		input_file: string,
		graph: $G.IGraph,
		stats: GraphStats,
		DEFAULT_SEP: string = ',';


	describe('Basic instantiation tests', () => {

		beforeEach(() => {
			csv = new CSV();
		});


		test('should instantiate a default version of CSVInput', () => {
			expect(csv).toBeInstanceOf(CSV);
			expect(csv._config.separator).toBe(DEFAULT_SEP);
		});


		it('should set the correct configureation options', () => {
			csv = new CSV({
				weighted: true,
				direction_mode: true,
				explicit_direction: false,
				separator: " "
			});
			expect(csv._config.separator).toBe(' ');
			expect(csv._config.weighted).toBe(true);
			expect(csv._config.direction_mode).toBe(true);
			expect(csv._config.explicit_direction).toBe(false);
		});
	});


	describe('Basic input tests - ', () => {

		beforeEach(() => {
			csv = new CSV();
		});


		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an adjacency list
		 */
		test(
			'should construct a very small graph from an adjacency list and produce the right stats',
			() => {
				input_file = "small_graph_adj_list_def_sep.csv";
				graph = csv.readFromAdjacencyListFile(CSV_DATA_PATH + '/' + input_file);
				$C.checkSmallGraphStats(graph);
			}
		);


		test('should be able to use a specified separator', () => {
			csv._config.separator = " ";
			input_file = "small_graph_adj_list_ws_sep.csv";
			graph = csv.readFromAdjacencyListFile(CSV_DATA_PATH + '/' + input_file);
			$C.checkSmallGraphStats(graph);
		});


		/**
		 * Adjacency list, but with _mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */
		test(
			'should construct a very small graph from an adjacency list with edges set to undirected',
			() => {
				csv._config.explicit_direction = false;
				input_file = "small_graph_adj_list_no_dir.csv";
				graph = csv.readFromAdjacencyListFile(CSV_DATA_PATH + '/' + input_file);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(4);
				expect(stats.nr_dir_edges).toBe(0);
				expect(stats.nr_und_edges).toBe(4);
				expect(stats.mode).toBe(GraphMode.UNDIRECTED);
			}
		);


		/**
		 * Adjacency list, but with _mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */
		test(
			'should construct a very small graph from an adjacency list with edges set to directed',
			() => {
				csv._config.explicit_direction = false;
				csv._config.direction_mode = true;
				input_file = "small_graph_adj_list_no_dir.csv";
				graph = csv.readFromAdjacencyListFile(CSV_DATA_PATH + '/' + input_file);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(4);
				expect(stats.nr_dir_edges).toBe(7);
				expect(stats.nr_und_edges).toBe(0);
				expect(stats.mode).toBe(GraphMode.DIRECTED);
			}
		);


		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an edge list
		 */
		test(
			'should construct a very small graph from an edge list and produce the right stats',
			() => {
				csv._config.separator = ",";
				input_file = "small_graph_edge_list.csv";
				graph = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
				$C.checkSmallGraphStats(graph);
			}
		);


		/**
		 * Edge list, but with _mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */
		test(
			'should construct a very small graph from an edge list with edges set to undirected',
			() => {
				csv._config.explicit_direction = false;
				input_file = "small_graph_edge_list_no_dir.csv";
				graph = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(4);
				expect(stats.nr_dir_edges).toBe(0);
				expect(stats.nr_und_edges).toBe(4);
				expect(stats.mode).toBe(GraphMode.UNDIRECTED);
			}
		);


		/**
		 * Edge list, but with _mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */
		test(
			'should construct a very small graph from an edge list with edges set to directed',
			() => {
				csv._config.explicit_direction = false;
				csv._config.direction_mode = true;
				input_file = "small_graph_edge_list_no_dir.csv";
				graph = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(4);
				expect(stats.nr_dir_edges).toBe(7);
				expect(stats.nr_und_edges).toBe(0);
				expect(stats.mode).toBe(GraphMode.DIRECTED);
			}
		);


		/**
		 * Weighted edge list
		 */
		test('small weighted, directed graph from an edge list', () => {
			csv._config.separator = " ";
			csv._config.explicit_direction = false;
			csv._config.direction_mode = true;
			csv._config.weighted = true;
			input_file = "tiny_weighted_graph.csv";
			graph = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).toBe(4);
			expect(stats.nr_dir_edges).toBe(4);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe(GraphMode.DIRECTED);
			Object.keys(graph.getDirEdges()).forEach(e_id => {
				let edge = graph.getEdgeById(e_id);
				expect(edge.isWeighted()).toBe(true);
				expect(typeof edge.getWeight()).toEqual('number');
				// expect( typeof edge.getWeight() ).toBeInstanceOf(Number);
			});
		});

	});


	describe('Wrong input formats / corrupted files', () => {

		beforeEach(() => {
			csv = new CSV();
		});


		test(
			'should throw an error if the entries of an edge list are too short',
			() => {
				input_file = "edge_list_entries_too_short.csv";
				expect(csv.readFromEdgeListFile.bind(csv, CSV_ERR_PATH + '/' + input_file)).toThrowError(
					'Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)'
				);
			}
		);


		test(
			'should throw an error if the direction markers of an edge list are wrong',
			() => {
				input_file = "edge_list_wrong_dir_marker.csv";
				expect(csv.readFromEdgeListFile.bind(csv, CSV_ERR_PATH + '/' + input_file)).toThrowError('Specification of edge direction invalid (d and u are valid).');
			}
		);


		test(
			'should throw an error if the direction markers of an adj list are wrong',
			() => {
				input_file = "adj_list_wrong_dir_marker.csv";
				expect(csv.readFromAdjacencyListFile.bind(csv, CSV_ERR_PATH + '/' + input_file)).toThrowError('Specification of edge direction invalid (d and u are valid).');
			}
		);


		test(
			'should throw an error if the direction markers of an adj list are wrong',
			() => {
				input_file = "adj_list_edge_dir_undefined.csv";
				expect(csv.readFromAdjacencyListFile.bind(csv, CSV_ERR_PATH + '/' + input_file)).toThrowError('Every edge entry has to contain its direction info in explicit mode.');
			}
		);


		test('weighted graph from edge list, too many params', () => {
			csv._config.separator = " ";
			csv._config.explicit_direction = false;
			csv._config.direction_mode = true;
			csv._config.weighted = true;
			input_file = "tiny_weighted_graph_four_args.csv";
			expect(csv.readFromEdgeListFile.bind(csv, CSV_DATA_PATH + '/' + input_file)).toThrowError(
				'Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)'
			);
		});


		test('weighted graph from edge list, too many params', () => {
			csv._config.separator = " ";
			csv._config.explicit_direction = false;
			csv._config.direction_mode = true;
			csv._config.weighted = true;
			input_file = "tiny_weighted_graph_four_args.csv";
			expect(csv.readFromEdgeListFile.bind(csv, CSV_DATA_PATH + '/' + input_file)).toThrowError(
				'Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)'
			);
		});


		test('weighted graph from edge list, NaN weight - replaced with 1', () => {
			csv._config.separator = " ";
			csv._config.explicit_direction = false;
			csv._config.direction_mode = true;
			csv._config.weighted = true;
			input_file = "tiny_weighted_graph_NaN.csv";
			graph = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).toBe(4);
			expect(stats.nr_dir_edges).toBe(4);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe(GraphMode.DIRECTED);
			Object.keys(graph.getDirEdges()).forEach(e_id => {
				let edge = graph.getEdgeById(e_id);
				expect(edge.isWeighted()).toBe(true);
				expect(edge.getWeight()).toBe(1);
			});
		});


		test('weighted graph from edge list, missing weight - replaced with 1', () => {
			csv._config.separator = " ";
			csv._config.explicit_direction = false;
			csv._config.direction_mode = true;
			csv._config.weighted = true;
			input_file = "tiny_weighted_graph_missing.csv";
			graph = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).toBe(4);
			expect(stats.nr_dir_edges).toBe(4);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe(GraphMode.DIRECTED);
			Object.keys(graph.getDirEdges()).forEach(e_id => {
				let edge = graph.getEdgeById(e_id);
				expect(edge.isWeighted()).toBe(true);
			});
			expect(graph.getEdgeById('A_C_d').getWeight()).toBe(1);
		});

	});

});
