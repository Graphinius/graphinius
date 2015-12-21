/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $C from '../../test/input/common';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;


describe('GRAPH CSV INPUT TESTS', () => {
	
	var json 					: $I.IJSONInput,
			input_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats;
	
	describe('Basic instantiation tests', () => {
		
		it('should instantiate a default version of JSONInput', () => {
			json = new JSON_IN();
			expect(json).to.be.an.instanceof(JSON_IN);
		});
		
	});
	
	
	describe('Small test graph', () => {
				
		it('should instantiate a default version of CSVInput', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/small_graph.json";
			graph = json.readFromJSONFile(input_file);
			$C.checkSmallGraphStats(graph);
		});		
	});
	
	
	describe('Real graph from JSON', () => {
		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 nodes.
		 */ 
		it('should construct a real sized graph from an edge list with edges set to directed', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/real_graph.json";
			graph = json.readFromJSONFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(5937);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(17777);
			expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
			
			// console.dir(stats);
		});
	
	});	
	
});