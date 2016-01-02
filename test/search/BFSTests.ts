/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $S from '../../src/search/BFS';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;


describe('Basic GRAPH SEARCH Tests (BFS, DFS)', () => {
	
	var json 					: $I.IJSONInput,
			input_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats;
	
	
	describe('BFS on small test graph', () => {
		
		it('should correctly instantiate the search graph', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/search_graph.json";
			graph = json.readFromJSONFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(7);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(2);
						
			console.dir(stats.degree_dist);
		})
				
		it('should correctly compute distances from node A', () => {
			
			
			$S.BFS(graph);
		});
		
		it('should correctly compute distances from node C', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/small_graph.json";
			graph = json.readFromJSONFile(input_file);		
			
		});
		
		it('should correctly compute distances from node B', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/small_graph.json";
			graph = json.readFromJSONFile(input_file);		
			
		});
		
	});
	
});