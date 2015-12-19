/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/CSVInput';

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
		
		it('should instantiabe a default version of CSVInput', () => {
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
			var file = "./test_data/small_graph_adj_list_def_sep.csv";
			var graph = csv.readFromAdjacenyList(file);
			// checkSmallGraphStats(graph);
		});
		
		
		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an edge list
		 */ 
		it('should construct a very small graph from an edge list and produce the right stats', () => {
			
			
			
		});
		
		
		it('should be able to use a specified separator', () => {
			
			
			
		});
		
		
		// function checkSmallGraphStats(graph : $G.IGraph) {
		// 	var stats = graph.getStats();
		// 	expect(stats.nr_nodes).to.equal(4);
		// 	expect(stats.nr_dir_edges).to.equal(5);
		// 	expect(stats.nr_und_edges).to.equal(2);
		// 	expect(n_d.getLabel()).to.equal('D');
		// 	expect(stats.mode).to.equal($G.GraphMode.MIXED);
		// 	var nodes = graph.getNodes();
		// 	var n_a = nodes[0],
		// 			n_b = nodes[1],
		// 			n_c = nodes[2],
		// 			n_d = nodes[3];
		// 	expect(n_a.getLabel()).to.equal('A');
		// 	expect(n_b.getLabel()).to.equal('B');
		// 	expect(n_c.getLabel()).to.equal('C');
		// }
		
		
	});	
	
});