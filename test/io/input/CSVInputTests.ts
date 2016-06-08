/// <reference path="../../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../../src/core/Graph';
import * as $I from '../../../src/io/input/CSVInput';
import * as $C from '../../../test/io/input/common';

var expect = chai.expect,
		CSV = $I.CSVInput;


describe('GRAPH CSV INPUT TESTS', () => {

	var csv: $I.ICSVInput,
		sep: string,
		input_file: string,
		graph: $G.IGraph,
		stats: $G.GraphStats,
		DEFAULT_SEP: string = ',';

	describe('Basic instantiation tests', () => {

		it('should instantiate a default version of CSVInput', () => {
			csv = new CSV();
			expect(csv).to.be.an.instanceof(CSV);
			expect(csv._separator).to.equal(DEFAULT_SEP);
		});

	});

	describe('Basic input tests', () => {

		beforeEach('instantiate the CSV input class', () => {
			csv = new CSV();
		});

		
		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an adjacency list
		 */
		it('should construct a very small graph from an adjacency list and produce the right stats', () => {
			input_file = "./test/test_data/small_graph_adj_list_def_sep.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		it('should be able to use a specified separator', () => {
			csv._separator = " ";
			input_file = "./test/test_data/small_graph_adj_list_ws_sep.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		/**
		 * Adjacency list, but with _mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */
		it('should construct a very small graph from an adjacency list with edges set to undirected', () => {
			csv._explicit_direction = false;
			input_file = "./test/test_data/small_graph_adj_list_no_dir.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(4);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * Adjacency list, but with _mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */
		it('should construct a very small graph from an adjacency list with edges set to directed', () => {
			csv._explicit_direction = false;
			csv._direction_mode = true;
			input_file = "./test/test_data/small_graph_adj_list_no_dir.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(0);
			expect(stats.mode).to.equal($G.GraphMode.DIRECTED);
		});
		
		
		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an edge list
		 */
		it('should construct a very small graph from an edge list and produce the right stats', () => {
			csv._separator = ",";
			input_file = "./test/test_data/small_graph_edge_list.csv";
			graph = csv.readFromEdgeListFile(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		/**
		 * Edge list, but with _mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */
		it('should construct a very small graph from an edge list with edges set to undirected', () => {
			csv._explicit_direction = false;
			input_file = "./test/test_data/small_graph_edge_list_no_dir.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(4);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * Edge list, but with _mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */
		it('should construct a very small graph from an edge list with edges set to directed', () => {
			csv._explicit_direction = false;
			csv._direction_mode = true;
			input_file = "./test/test_data/small_graph_edge_list_no_dir.csv";
			graph = csv.readFromAdjacencyListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(0);
			expect(stats.mode).to.equal($G.GraphMode.DIRECTED);
		});
		
		
		/**
		 * Edge list, but with a REAL graph now, edges set to undirected
		 * graph should have 5937 nodes.
		 * 
		 */
		it('should construct a real sized graph from an edge list with edges set to undirected', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = false;
			input_file = "./test/test_data/real_graph_edge_list_no_dir.csv";
			graph = csv.readFromEdgeListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(5937);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(17777);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * Edge list, but with a REAL graph now, edges set to directed
		 * graph should have 5937 nodes.
		 */
		it('should construct a real sized graph from an edge list with edges set to directed', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			input_file = "./test/test_data/real_graph_edge_list_no_dir.csv";
			graph = csv.readFromEdgeListFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(5937);
			expect(stats.nr_dir_edges).to.equal(17777);
			expect(stats.nr_und_edges).to.equal(0);
			expect(stats.mode).to.equal($G.GraphMode.DIRECTED);
		});

	});


	describe('Wrong input formats / corrupted files', () => {
		
		beforeEach('instantiate the CSV input class', () => {
			csv = new CSV();
		});
		
		
		it('should throw an error if the entries of an edge list are too short', () => {
			input_file = "./test/test_data/csv_erroneous/edge_list_entries_too_short.csv";
			expect(csv.readFromEdgeListFile.bind(csv, input_file)).to.throw('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
		});
		
		
		it('should throw an error if the direction markers of an edge list are wrong', () => {
			input_file = "./test/test_data/csv_erroneous/edge_list_wrong_dir_marker.csv";
			expect(csv.readFromEdgeListFile.bind(csv, input_file)).to.throw('Specification of edge direction invalid (d and u are valid).');
		});
		
		
		it('should throw an error if the direction markers of an adj list are wrong', () => {
			input_file = "./test/test_data/csv_erroneous/adj_list_wrong_dir_marker.csv";
			expect(csv.readFromAdjacencyListFile.bind(csv, input_file)).to.throw('Specification of edge direction invalid (d and u are valid).');
		});
		
		
		it('should throw an error if the direction markers of an adj list are wrong', () => {
			input_file = "./test/test_data/csv_erroneous/adj_list_edge_dir_undefined.csv";
			expect(csv.readFromAdjacencyListFile.bind(csv, input_file)).to.throw('Every edge entry has to contain its direction info in explicit mode.');
		});
	
	});

});