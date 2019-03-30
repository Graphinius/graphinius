import * as $G from '../../../src/core/Graph';
import * as $I from '../../../src/io/input/CSVInput';
import * as $C from './common';

let CSV = $I.CSVInput;


describe('GRAPH CSV INPUT TESTS', () => {

	var csv: $I.ICSVInput,
		sep: string,
		input_file: string,
		graph: $G.IGraph,
		stats: $G.GraphStats,
		DEFAULT_SEP: string = ',';


	describe('Basic instantiation tests', () => {

		test('should instantiate a default version of CSVInput', () => {
			csv = new CSV();
			expect(csv).toBeInstanceOf(CSV);
			expect(csv._separator).toBe(DEFAULT_SEP);
		});

	});


	describe('Basic input tests - ', () => {

		beforeEach( () => {
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
                input_file = "./test/test_data/small_graph_adj_list_def_sep.csv";
                graph = csv.readFromAdjacencyListFile(input_file);
                $C.checkSmallGraphStats(graph);
            }
        );
		
		
		test('should be able to use a specified separator', () => {
			csv._separator = " ";
			input_file = "./test/test_data/small_graph_adj_list_ws_sep.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		/**
		 * Adjacency list, but with _mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */
		test(
            'should construct a very small graph from an adjacency list with edges set to undirected',
            () => {
                csv._explicit_direction = false;
                input_file = "./test/test_data/small_graph_adj_list_no_dir.csv";
                graph = csv.readFromAdjacencyListFile(input_file);
                stats = graph.getStats();
                expect(stats.nr_nodes).toBe(4);
                expect(stats.nr_dir_edges).toBe(0);
                expect(stats.nr_und_edges).toBe(4);
                expect(stats.mode).toBe($G.GraphMode.UNDIRECTED);
            }
        );
		
		
		/**
		 * Adjacency list, but with _mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */
		test(
            'should construct a very small graph from an adjacency list with edges set to directed',
            () => {
                csv._explicit_direction = false;
                csv._direction_mode = true;
                input_file = "./test/test_data/small_graph_adj_list_no_dir.csv";
                graph = csv.readFromAdjacencyListFile(input_file);
                stats = graph.getStats();
                expect(stats.nr_nodes).toBe(4);
                expect(stats.nr_dir_edges).toBe(7);
                expect(stats.nr_und_edges).toBe(0);
                expect(stats.mode).toBe($G.GraphMode.DIRECTED);
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
                csv._separator = ",";
                input_file = "./test/test_data/small_graph_edge_list.csv";
                graph = csv.readFromEdgeListFile(input_file);
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
                csv._explicit_direction = false;
                input_file = "./test/test_data/small_graph_edge_list_no_dir.csv";
                graph = csv.readFromEdgeListFile(input_file);
                stats = graph.getStats();
                expect(stats.nr_nodes).toBe(4);
                expect(stats.nr_dir_edges).toBe(0);
                expect(stats.nr_und_edges).toBe(4);
                expect(stats.mode).toBe($G.GraphMode.UNDIRECTED);
            }
        );
		
		
		/**
		 * Edge list, but with _mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */
		test(
            'should construct a very small graph from an edge list with edges set to directed',
            () => {
                csv._explicit_direction = false;
                csv._direction_mode = true;
                input_file = "./test/test_data/small_graph_edge_list_no_dir.csv";
                graph = csv.readFromEdgeListFile(input_file);
                stats = graph.getStats();
                expect(stats.nr_nodes).toBe(4);
                expect(stats.nr_dir_edges).toBe(7);
                expect(stats.nr_und_edges).toBe(0);
                expect(stats.mode).toBe($G.GraphMode.DIRECTED);
            }
        );


		/**
		 * Weighted edge list
		 */
		test('small weighted, directed graph from an edge list', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			csv._weighted = true;
			input_file = "./test/test_data/csv_inputs/tiny_weighted_graph.csv";
			graph = csv.readFromEdgeListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).toBe(4);
			expect(stats.nr_dir_edges).toBe(4);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe($G.GraphMode.DIRECTED);
			Object.keys(graph.getDirEdges()).forEach( e_id => {
				let edge = graph.getEdgeById( e_id );
				expect( edge.isWeighted() ).toBe(true);
				expect( typeof edge.getWeight() ).toEqual('number');
				// expect( typeof edge.getWeight() ).toBeInstanceOf(Number);
			});
		});

		
		/**
		 * Edge list, but with a REAL graph now, edges set to undirected
		 * graph should have 5937 nodes.
		 * 
		 */
		test(
            'should construct a real sized graph from an edge list with edges set to undirected',
            () => {
                csv._separator = " ";
                csv._explicit_direction = false;
                csv._direction_mode = false;
                input_file = "./test/test_data/real_graph_edge_list_no_dir.csv";
                graph = csv.readFromEdgeListFile(input_file);
                stats = graph.getStats();
                expect(stats.nr_nodes).toBe(5937);
                expect(stats.nr_dir_edges).toBe(0);
                expect(stats.nr_und_edges).toBe(17777);
                expect(stats.mode).toBe($G.GraphMode.UNDIRECTED);
            }
        );
		
		
		/**
		 * Edge list, but with a REAL graph now, edges set to directed
		 * graph should have 5937 nodes.
		 */
		test(
            'should construct a real sized graph from an edge list with edges set to directed',
            () => {
                csv._separator = " ";
                csv._explicit_direction = false;
                csv._direction_mode = true;
                input_file = "./test/test_data/real_graph_edge_list_no_dir.csv";
                graph = csv.readFromEdgeListFile(input_file);
                stats = graph.getStats();
                expect(stats.nr_nodes).toBe(5937);
                expect(stats.nr_dir_edges).toBe(17777);
                expect(stats.nr_und_edges).toBe(0);
                expect(stats.mode).toBe($G.GraphMode.DIRECTED);
            }
        );

	});


	describe('Wrong input formats / corrupted files', () => {
		
		beforeEach( () => {
			csv = new CSV();
		});
		
		
		test(
            'should throw an error if the entries of an edge list are too short',
            () => {
                input_file = "./test/test_data/csv_erroneous/edge_list_entries_too_short.csv";
                expect(csv.readFromEdgeListFile.bind(csv, input_file)).toThrowError(
                    'Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)'
                );
            }
        );
		
		
		test(
            'should throw an error if the direction markers of an edge list are wrong',
            () => {
                input_file = "./test/test_data/csv_erroneous/edge_list_wrong_dir_marker.csv";
                expect(csv.readFromEdgeListFile.bind(csv, input_file)).toThrowError('Specification of edge direction invalid (d and u are valid).');
            }
        );
		
		
		test(
            'should throw an error if the direction markers of an adj list are wrong',
            () => {
                input_file = "./test/test_data/csv_erroneous/adj_list_wrong_dir_marker.csv";
                expect(csv.readFromAdjacencyListFile.bind(csv, input_file)).toThrowError('Specification of edge direction invalid (d and u are valid).');
            }
        );
		
		
		test(
            'should throw an error if the direction markers of an adj list are wrong',
            () => {
                input_file = "./test/test_data/csv_erroneous/adj_list_edge_dir_undefined.csv";
                expect(csv.readFromAdjacencyListFile.bind(csv, input_file)).toThrowError('Every edge entry has to contain its direction info in explicit mode.');
            }
        );


		test('weighted graph from edge list, too many params', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			csv._weighted = true;
			input_file = "./test/test_data/csv_inputs/tiny_weighted_graph_four_args.csv";
			expect(csv.readFromEdgeListFile.bind(csv, input_file)).toThrowError(
                'Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)'
            );
		});


		test('weighted graph from edge list, too many params', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			csv._weighted = true;
			input_file = "./test/test_data/csv_inputs/tiny_weighted_graph_four_args.csv";
			expect(csv.readFromEdgeListFile.bind(csv, input_file)).toThrowError(
                'Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)'
            );
		});


		test('weighted graph from edge list, NaN weight - replaced with 1', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			csv._weighted = true;
			input_file = "./test/test_data/csv_inputs/tiny_weighted_graph_NaN.csv";
			graph = csv.readFromEdgeListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).toBe(4);
			expect(stats.nr_dir_edges).toBe(4);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe($G.GraphMode.DIRECTED);
			Object.keys(graph.getDirEdges()).forEach( e_id => {
				let edge = graph.getEdgeById( e_id );
				expect( edge.isWeighted() ).toBe(true);
				expect( edge.getWeight() ).toBe(1);
			});
		});


		test('weighted graph from edge list, missing weight - replaced with 1', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			csv._weighted = true;
			input_file = "./test/test_data/csv_inputs/tiny_weighted_graph_missing.csv";
			graph = csv.readFromEdgeListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).toBe(4);
			expect(stats.nr_dir_edges).toBe(4);
			expect(stats.nr_und_edges).toBe(0);
			expect(stats.mode).toBe($G.GraphMode.DIRECTED);
			Object.keys(graph.getDirEdges()).forEach( e_id => {
				let edge = graph.getEdgeById( e_id );
				expect( edge.isWeighted() ).toBe(true);
			});
			expect( graph.getEdgeById('A_C_d').getWeight() ).toBe(1);
		});

	});

});
