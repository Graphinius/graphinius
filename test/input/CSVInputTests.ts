/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/CSVInput';
import * as $C from '../../test/input/common';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var CSV 		= $I.CSVInput;


describe('GRAPH CSV INPUT TESTS', () => {
	
	var csv 					: $I.ICSVInput,
			sep 					: string,
			input_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats,
			DEFAULT_SEP		: string = ',';
	
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
			input_file = "./test/input/test_data/small_graph_adj_list_def_sep.csv";
			graph = csv.readFromAdjacenyList(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		it('should be able to use a specified separator', () => {
			csv._separator = " ";
			input_file = "./test/input/test_data/small_graph_adj_list_ws_sep.csv";
			graph = csv.readFromAdjacenyList(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		/**
		 * Adjacency list, but with mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */ 
		it('should construct a very small graph from an adjacency list with edges set to undirected', () => {
			csv._explicit_direction = false;
			input_file = "./test/input/test_data/small_graph_adj_list_no_dir.csv";
			graph = csv.readFromAdjacenyList(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(4);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * Adjacency list, but with mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */ 
		it('should construct a very small graph from an adjacency list with edges set to directed', () => {
			csv._explicit_direction = false;
			csv._direction_mode = true;
			input_file = "./test/input/test_data/small_graph_adj_list_no_dir.csv";
			graph = csv.readFromAdjacenyList(input_file);
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
			input_file = "./test/input/test_data/small_graph_edge_list.csv";
			graph = csv.readFromEdgeList(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		/**
		 * Edge list, but with mode set to 'undirected'
		 * graph should only have 4 undirected edges now.
		 */ 
		it('should construct a very small graph from an edge list with edges set to undirected', () => {
			csv._explicit_direction = false;
			input_file = "./test/input/test_data/small_graph_edge_list_no_dir.csv";
			graph = csv.readFromAdjacenyList(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(4);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * Edge list, but with mode set to 'directed'
		 * graph should have 7 directed edges now.
		 */ 
		it('should construct a very small graph from an edge list with edges set to directed', () => {
			csv._explicit_direction = false;
			csv._direction_mode = true;
			input_file = "./test/input/test_data/small_graph_edge_list_no_dir.csv";
			graph = csv.readFromAdjacenyList(input_file);
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
			input_file = "./test/input/test_data/real_graph_edge_list_no_dir.csv";
			graph = csv.readFromEdgeList(input_file);
			stats = graph.getStats();			
			expect(stats.nr_nodes).to.equal(5937);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(17777);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
			
			// console.dir(stats);
		});
		
		
		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 nodes.
		 */ 
		it('should construct a real sized graph from an edge list with edges set to directed', () => {
			csv._separator = " ";
			csv._explicit_direction = false;
			csv._direction_mode = true;
			input_file = "./test/input/test_data/real_graph_edge_list_no_dir.csv";
			graph = csv.readFromEdgeList(input_file);
			stats = graph.getStats();	
			expect(stats.nr_nodes).to.equal(5937);
			expect(stats.nr_dir_edges).to.equal(17777);
			expect(stats.nr_und_edges).to.equal(0);
			expect(stats.mode).to.equal($G.GraphMode.DIRECTED);
			
			// console.dir(stats);
		});
			
	});	
	
});