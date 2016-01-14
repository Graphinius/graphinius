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


describe('GRAPH JSON INPUT TESTS', () => {
	
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
				
		it('should correctly generate our small example graph out of a JSON file with explicitly encoded edge directions', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/small_graph.json";
			graph = json.readFromJSONFile(input_file);
			$C.checkSmallGraphStats(graph);
		});
		
		
		it('should correctly generate our small example graph out of a JSON file with direction mode set to undirected', () => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction_mode = false; // undirected graph
			input_file = "./test/input/test_data/small_graph.json";
			graph = json.readFromJSONFile(input_file);
			expect(graph.nrNodes()).to.equal(4);
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(4);
		});
		
		
		it('should correctly generate our small example graph out of a JSON file with direction mode set to directed', () => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction_mode = true; // undirected graph
			input_file = "./test/input/test_data/small_graph.json";
			graph = json.readFromJSONFile(input_file);
			expect(graph.nrNodes()).to.equal(4);
			expect(graph.nrDirEdges()).to.equal(7);
			expect(graph.nrUndEdges()).to.equal(0);
		});
		
	});
	
	
	describe('Real graph from JSON', () => {
		
		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 undirected nodes.
		 */ 
		it('should construct a real sized graph from an edge list with edges set to undirected', () => {
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
		
		
		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 directed nodes.
		 */ 
		it('should construct a real sized graph from an edge list with edges set to directed', () => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction_mode = true;
			input_file = "./test/input/test_data/real_graph.json";
			graph = json.readFromJSONFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(5937);
			expect(stats.nr_dir_edges).to.equal(17777);
			expect(stats.nr_und_edges).to.equal(0);
			expect(stats.mode).to.equal($G.GraphMode.DIRECTED);
			
			// console.dir(stats);
		});
		
		
		it('tests the time Object keys takes to return the length of the keys array', () => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction_mode = false;
			input_file = "./test/input/test_data/real_graph.json";
			graph = json.readFromJSONFile(input_file);
			var start = +new Date(),
					end;
			
			for ( var i = 0; i < 5000; i++ ) {
				graph.nrNodes();
			}
			
			end = +new Date();
			console.log("counted graph nodes 5000 times in " + (end-start) + " ms.");
		});
		
		
		/**
		 * Funny use case - see how long it takes to mutilate graph...
		 */ 
		// it('should construct a real sized graph from an edge list with edges set to directed', () => {
		// 	json = new JSON_IN();
		// 	json._explicit_direction = false;
		// 	json._direction_mode = false;
		// 	input_file = "./test/input/test_data/real_graph.json";
		// 	graph = json.readFromJSONFile(input_file);
			
		// 	var nr_nodes = graph.nrNodes();
		// 	while ( nr_nodes ) {
		// 		graph.removeNode(graph.getNodeById(String(--nr_nodes)));
		// 		console.log(nr_nodes);
		// 	}
		// 	expect(graph.nrNodes()).to.equal(0);			
		// });
	
	});
	
});