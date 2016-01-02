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
			stats					: $G.GraphStats,
			search_res		: {[id: string] : $S.SearchResultEntry};
	
	
	describe('BFS on small test graph', () => {
		
		it('should correctly instantiate the search graph', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/search_graph.json";
			graph = json.readFromJSONFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(7);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(2);
		})
				
		it('should correctly compute distances from node A', () => {
			var root = graph.getNodeById('A');
			search_res = $S.BFS(graph, root);
						
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['B'].distance).to.equal(1);
			expect(search_res['B'].parent).to.equal(root);
			expect(search_res['C'].distance).to.equal(1);
			expect(search_res['C'].parent).to.equal(root);
			expect(search_res['D'].distance).to.equal(1);
			expect(search_res['D'].parent).to.equal(root);
			expect(search_res['E'].distance).to.equal(2);
			expect(search_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(search_res['F'].distance).to.equal(1);
			expect(search_res['F'].parent).to.equal(root);
			expect(search_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D');
			search_res = $S.BFS(graph, root);
			
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].distance).to.equal(1);
			expect(search_res['A'].parent).to.equal(root);
			expect(search_res['B'].distance).to.equal(2);
			expect(search_res['B'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['C'].distance).to.equal(2);
			expect(search_res['C'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['E'].distance).to.equal(1);
			expect(search_res['E'].parent).to.equal(root);
			expect(search_res['F'].distance).to.equal(2);
			expect(search_res['F'].parent).to.equal(graph.getNodeById('E'));
			expect(search_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node E', () => {
			var root = graph.getNodeById('E');
			search_res = $S.BFS(graph, root);
			
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['A'].parent).to.equal(null);
			expect(search_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['B'].parent).to.equal(null);
			expect(search_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['C'].parent).to.equal(null);
			expect(search_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['D'].parent).to.equal(null);
			expect(search_res['F'].distance).to.equal(1);
			expect(search_res['F'].parent).to.equal(root);
			expect(search_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node E', () => {
			var root = graph.getNodeById('G');
			search_res = $S.BFS(graph, root);
			
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['A'].parent).to.equal(null);
			expect(search_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['B'].parent).to.equal(null);
			expect(search_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['C'].parent).to.equal(null);
			expect(search_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['D'].parent).to.equal(null);
			expect(search_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['E'].parent).to.equal(null);
			expect(search_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['F'].parent).to.equal(null);
		});
		
	});
	
});